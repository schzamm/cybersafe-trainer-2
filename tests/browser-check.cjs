'use strict';
// Optional real-browser checks. Uses an already installed Playwright + browser.
// No automatic package/browser installation and no production source mutation.
const fs = require('node:fs');
const path = require('node:path');
const http = require('node:http');
const assert = require('node:assert/strict');
const { performance } = require('node:perf_hooks');
const root = path.resolve(__dirname, '..');
const artifacts = path.join(__dirname, 'artifacts');
const report = {
  schema: 1, generatedAt: new Date().toISOString(),
  environment: {}, measurements: [], checks: [], failures: [], limitations: []
};
let browser, server;

function instrument() {
  window.__phase1 = { lcp: [], longTasks: [] };
  const selector = element => !element ? null : element.tagName.toLowerCase() +
    (element.id ? '#' + element.id : '') +
    (typeof element.className === 'string' && element.className ? '.' + element.className.trim().split(/\s+/).join('.') : '');
  new PerformanceObserver(list => {
    for (const entry of list.getEntries()) window.__phase1.lcp.push({
      startTime: entry.startTime, renderTime: entry.renderTime, loadTime: entry.loadTime,
      size: entry.size, element: selector(entry.element),
      text: (entry.element?.textContent || '').replace(/\s+/g, ' ').trim().slice(0, 160)
    });
  }).observe({ type: 'largest-contentful-paint', buffered: true });
  try {
    new PerformanceObserver(list => {
      for (const entry of list.getEntries()) window.__phase1.longTasks.push({ startTime: entry.startTime, duration: entry.duration });
    }).observe({ type: 'longtask', buffered: true });
  } catch {}
}

async function measureLive() {
  const base = process.env.CYBERSAFE_PERF_URL || 'https://cybersafe-trainer-2.pages.dev/';
  const parsed = new URL(base);
  if (parsed.protocol !== 'https:' || parsed.username || parsed.password || parsed.search) {
    throw Error('Performance URL must be HTTPS without credentials or query parameters.');
  }
  report.environment.performanceUrl = parsed.origin + parsed.pathname;
  report.environment.mobile = { width: 390, height: 844, deviceScaleFactor: 2, touch: true,
    latencyMs: 150, downloadBytesPerSecond: 200000, uploadBytesPerSecond: 93750, cpuSlowdown: 4 };
  report.environment.repetitions = 3;
  report.environment.observationAfterLoadMs = 3000;
  report.environment.coldDefinition = 'Fresh isolated context; browser HTTP cache cleared before navigation. OS DNS/TLS and CDN cache are not guaranteed cold.';
  report.environment.warmDefinition = 'Reload in the same context with HTTP caching enabled; same network/CPU emulation.';
  outer: for (const route of ['home', 'lesson-1']) {
    for (let repetition = 1; repetition <= 3; repetition++) {
      const context = await browser.newContext({
        viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true
      });
      const page = await context.newPage();
      const cdp = await context.newCDPSession(page);
      await cdp.send('Network.enable');
      await cdp.send('Network.clearBrowserCache');
      await cdp.send('Network.setCacheDisabled', { cacheDisabled: false });
      await cdp.send('Network.emulateNetworkConditions', {
        offline: false, latency: 150, downloadThroughput: 200000, uploadThroughput: 93750, connectionType: 'cellular4g'
      });
      await cdp.send('Emulation.setCPUThrottlingRate', { rate: 4 });
      await page.addInitScript(instrument);
      const url = new URL(parsed);
      url.hash = route === 'home' ? '' : 'lesson-1';
      try {
        for (const cache of ['cold', 'warm']) {
          const started = performance.now();
          const response = cache === 'cold'
            ? await page.goto(url.href, { waitUntil: 'load', timeout: 30000 })
            : await page.reload({ waitUntil: 'load', timeout: 30000 });
          if (!response?.ok()) throw Error('Unexpected document status: ' + response?.status());
          if (!(await page.locator('#welcome-title').count())) throw Error('Expected site content is missing.');
          if (route === 'lesson-1') await page.locator('#lesson-title').waitFor({ state: 'visible', timeout: 5000 });
          await page.waitForTimeout(3000);
          const result = await page.evaluate(() => {
            const nav = performance.getEntriesByType('navigation')[0];
            const paints = performance.getEntriesByType('paint');
            const ownOrigin = location.origin;
            return {
              lcp: window.__phase1.lcp.at(-1) || null,
              candidates: window.__phase1.lcp,
              longTasks: window.__phase1.longTasks,
              fcpMs: paints.find(entry => entry.name === 'first-contentful-paint')?.startTime ?? null,
              ttfbMs: nav.responseStart,
              documentDownloadMs: nav.responseEnd - nav.responseStart,
              domContentLoadedMs: nav.domContentLoadedEventEnd,
              loadMs: nav.loadEventEnd,
              documentTransferBytes: nav.transferSize,
              resources: performance.getEntriesByType('resource').map(entry => {
                const url = new URL(entry.name);
                return { name: url.origin === ownOrigin ? url.pathname : url.origin + url.pathname,
                  startTime: entry.startTime, duration: entry.duration, responseEnd: entry.responseEnd,
                  transferSize: entry.transferSize, encodedBodySize: entry.encodedBodySize,
                  initiatorType: entry.initiatorType };
              })
            };
          });
          result.lcpMs = result.lcp?.startTime ?? null;
          result.postResponseToLcpMs = result.lcpMs === null ? null : result.lcpMs - result.ttfbMs;
          report.measurements.push({ route, cache, repetition, observationWallMs: performance.now() - started, ...result });
          console.log('LCP ' + route + ' ' + cache + ' #' + repetition + ': ' + result.lcpMs + 'ms; element ' + result.lcp?.element);
        }
      } catch (error) {
        report.limitations.push('Live performance measurement unavailable/incomplete: ' + error.message);
        console.log(report.limitations.at(-1));
        await context.close();
        break outer;
      }
      await context.close();
    }
  }
  if (report.measurements.length !== 12) report.limitations.push('The full 12-sample live measurement matrix was not completed.');
}

async function withLocalServer() {
  const files = new Map([
    ['/', ['index.html', 'text/html; charset=utf-8']],
    ['/index.html', ['index.html', 'text/html; charset=utf-8']],
    ['/app.js', ['app.js', 'text/javascript; charset=utf-8']],
    ['/styles.css', ['styles.css', 'text/css; charset=utf-8']],
    ['/mobile.css', ['mobile.css', 'text/css; charset=utf-8']]
  ]);
  server = http.createServer((request, response) => {
    const entry = files.get((request.url || '').split('?')[0]);
    if (!['GET', 'HEAD'].includes(request.method) || !entry) {
      response.writeHead(404); response.end('Not found'); return;
    }
    fs.readFile(path.join(root, entry[0]), (error, content) => {
      if (error) { response.writeHead(404); response.end('Not found'); return; }
      response.writeHead(200, { 'Content-Type': entry[1], 'Cache-Control': 'no-store' });
      response.end(request.method === 'HEAD' ? undefined : content);
    });
  });
  await new Promise((resolve, reject) => {
    server.once('error', reject); server.listen(0, '127.0.0.1', resolve);
  });
  return 'http://127.0.0.1:' + server.address().port;
}
async function check(name, fn) {
  try { await fn(); report.checks.push(name); console.log('PASS: ' + name); }
  catch (error) { report.failures.push({ name, error: error.message }); console.log('FAIL: ' + name + ': ' + error.message); }
}
async function localBrowserChecks() {
  const base = await withLocalServer();
  const context = await browser.newContext({ viewport: { width: 320, height: 844 }, isMobile: true, hasTouch: true });
  const page = await context.newPage();
  const pageErrors = [];
  page.on('pageerror', error => pageErrors.push(error.message));
  await page.goto(base, { waitUntil: 'load' });

  await check('keyboard skip link moves focus to main', async () => {
    await page.keyboard.press('Tab');
    assert.equal(await page.evaluate(() => document.activeElement.className), 'skip');
    await page.keyboard.press('Enter');
    assert.equal(await page.evaluate(() => document.activeElement.id), 'main');
  });
  await check('150% text uses 30px root text and mobile menu supports Enter/Escape', async () => {
    for (let i = 0; i < 5; i++) await page.locator('#larger').click();
    assert.equal(await page.locator('#size-label').textContent(), '150%');
    assert.equal(await page.evaluate(() => getComputedStyle(document.documentElement).fontSize), '30px');
    await page.locator('#menu-toggle').focus();
    await page.keyboard.press('Enter');
    assert.equal(await page.locator('#main-navigation').isVisible(), true);
    await page.keyboard.press('Escape');
    assert.equal(await page.locator('#main-navigation').isVisible(), false);
    assert.equal(await page.evaluate(() => document.activeElement.id), 'menu-toggle');
  });
  async function layout(label) {
    const result = await page.evaluate(() => {
      const width = document.documentElement.clientWidth;
      const bad = [...document.querySelectorAll('header .brand, #menu-toggle, .text-tools, .audio, .answer, button, .button, .practice summary')]
        .filter(element => element.getClientRects().length)
        .filter(element => {
          const rect = element.getBoundingClientRect();
          return rect.left < -1 || rect.right > width + 1 || element.scrollWidth > element.clientWidth + 2;
        }).map(element => ({ tag: element.tagName, id: element.id, text: element.textContent.trim().slice(0, 70) }));
      return { width, scrollWidth: document.documentElement.scrollWidth, bad,
        brand: document.querySelector('.brand').textContent };
    });
    assert.ok(result.scrollWidth <= result.width + 1, JSON.stringify(result));
    assert.deepEqual(result.bad, [], JSON.stringify(result));
    assert.equal(result.brand, 'CyberSafe Trainer');
    report.checks.push('320px / 150% layout: ' + label);
  }
  await check('homepage and expanded navigation do not overflow at 320px/150%', async () => {
    await page.evaluate(() => scrollTo(0, 0)); await page.waitForTimeout(300);
    await layout('homepage');
    await page.locator('#menu-toggle').click(); await layout('expanded menu');
    await page.screenshot({ path: path.join(artifacts, 'mobile-home-320-150.png') });
    await page.locator('#menu-toggle').click();
  });

  for (let i = 0; i < 5; i++) {
    await check('lesson ' + (i + 1) + ': keyboard controls, visible feedback and 320px/150% layout', async () => {
      await page.locator('#lesson-cards a').nth(i).click();
      assert.equal(await page.evaluate(() => document.activeElement.id), 'lesson-title');
      await layout('lesson ' + (i + 1));
      const mainInput = page.locator('#answers input').first();
      await mainInput.focus();
      await page.keyboard.press('ArrowDown');
      assert.equal(await page.locator('#answers input:checked').count(), 1);
      await page.locator('#quiz button[type=submit]').focus(); await page.keyboard.press('Enter');
      assert.equal(await page.locator('#feedback').isVisible(), true);
      assert.ok((await page.locator('#feedback').textContent()).length > 30);
      const cdp = await context.newCDPSession(page);
      await cdp.send('DOM.enable'); await cdp.send('Accessibility.enable');
      const document = await cdp.send('DOM.getDocument');
      const feedback = await cdp.send('DOM.querySelector', { nodeId: document.root.nodeId, selector: '#feedback' });
      const tree = await cdp.send('Accessibility.getPartialAXTree', { nodeId: feedback.nodeId });
      const status = tree.nodes.find(node => node.role?.value === 'status');
      assert.ok(status, 'Feedback is not exposed as a status in the accessibility tree');
      assert.ok(status.properties?.some(property => property.name === 'live' && property.value.value === 'polite'), 'Feedback has no polite live property');
      await cdp.detach();
      for (const id of ['warning-practice', 'followup-practice']) {
        const details = page.locator('#' + id + ' > details');
        await details.locator(':scope > summary').focus(); await page.keyboard.press('Enter');
        assert.equal(await details.getAttribute('open'), '');
        const input = details.locator('input').first();
        await input.focus(); await page.keyboard.press('Space'); assert.equal(await input.isChecked(), true);
        await details.locator('button[type=submit]').focus(); await page.keyboard.press('Enter');
        assert.equal(await details.locator('.practice-feedback').isVisible(), true);
        await layout('lesson ' + (i + 1) + ' ' + id);
        await details.getByRole('button', { name: 'Try again', exact: true }).click();
        assert.equal(await details.locator('.practice-feedback').isVisible(), false);
        assert.equal(await input.evaluate(element => element === document.activeElement), true);
        await details.getByRole('button', { name: 'Skip this practice', exact: true }).click();
        assert.equal(await details.getAttribute('open'), null);
      }
      await page.locator('#lesson-title').evaluate(element => element.scrollIntoView({ behavior: 'instant', block: 'start' }));
      await page.screenshot({ path: path.join(artifacts, 'mobile-lesson-' + (i + 1) + '-320-150.png') });
    });
  }

  await check('real browser localStorage restores completion after reload', async () => {
    // Isolate this fixture from answers already submitted by the keyboard tests.
    const storageContext = await browser.newContext();
    try {
      const storagePage = await storageContext.newPage();
      await storagePage.goto(base + '/#lesson-1');
      await storagePage.locator('#answers input').nth(1).check();
      await storagePage.locator('#quiz button[type=submit]').click();
      await storagePage.reload();
      assert.ok((await storagePage.locator('#progress').textContent()).startsWith('1 of 5'));
      assert.equal(await storagePage.locator('#lesson-cards a').first().textContent(), 'Review lesson 1');
      assert.equal(await storagePage.locator('#lesson-completion').isVisible(), true);
    } finally { await storageContext.close(); }
  });
  await check('no JavaScript page errors in real-browser checks', async () => assert.deepEqual(pageErrors, []));
  await context.close();
  await simulationBrowserChecks(base);
  await floatingPlayerChecks(base);
  report.limitations.push('Accessibility-tree/live-region checks do not prove a screen reader spoke the feedback. Actual assistive-technology announcements and audible local-voice playback require manual testing.');
}

async function simulationBrowserChecks(base) {
  // This context never reaches the live site. Reject and record external requests.
  const context = await browser.newContext({
    viewport: { width: 320, height: 844 }, isMobile: true, hasTouch: true
  });
  const externalRequests = [];
  await context.route('**/*', route => {
    if (new URL(route.request().url()).origin !== new URL(base).origin) {
      externalRequests.push(new URL(route.request().url()).origin);
      return route.abort();
    }
    return route.continue();
  });
  const page = await context.newPage();
  const pageErrors = [], requests = [];
  page.on('pageerror', error => pageErrors.push(error.message));
  page.on('request', request => requests.push(request.url()));
  try {
    await page.goto(base + '/#lesson-1', { waitUntil: 'networkidle' });
    for (let i = 0; i < 5; i++) await page.locator('#larger').click();
    const panel = page.locator('#phishing-simulation');
    const initialUrl = page.url();
    const storedBefore = await page.evaluate(() => JSON.stringify({ ...localStorage }));
    const progressBefore = await page.locator('#progress').textContent();
    requests.length = 0;

    await check('simulation: expanded optional section, fictional inbox and inert markup', async () => {
      assert.equal(await panel.isVisible(), true);
      assert.equal(await panel.locator('#simulation-content').isVisible(), true);
      assert.equal(await panel.locator('details').count(), 0);
      assert.ok((await panel.textContent()).includes('Fictional inbox — practice only'));
      assert.equal(await panel.locator('a,input,form,iframe,script,img,textarea').count(), 0);
      assert.equal(await panel.locator('[href],[src],[action]').count(), 0);
      for (const button of await panel.locator('button').all()) assert.equal(await button.getAttribute('type'), 'button');
    });
    await check('simulation: keyboard inspection reveals fictional sender/destination without navigation', async () => {
      await page.locator('#simulation-verify').focus();
      assert.equal(await page.evaluate(() => document.activeElement.id), 'simulation-verify');
      await page.keyboard.press('Enter');
      assert.equal(await page.locator('#simulation-destination-detail').isVisible(), true);
      assert.ok((await page.locator('#simulation-destination-detail').textContent()).includes('https://northbridge-check.example/verify'));
      assert.equal(await page.locator('#simulation-verify').getAttribute('aria-expanded'), 'true');
      await page.keyboard.press('Tab');
      assert.equal(await page.evaluate(() => document.activeElement.id), 'simulation-sender');
      await page.keyboard.press('Space');
      assert.equal(await page.locator('#simulation-sender-detail').isVisible(), true);
      assert.ok((await page.locator('#simulation-sender-detail').textContent()).includes('security@northbridge-support.example'));
      await page.keyboard.press('Tab');
      assert.equal(await page.evaluate(() => document.activeElement.id), 'simulation-destination');
      await page.keyboard.press('Enter');
      assert.equal(await page.locator('#simulation-destination-detail').isVisible(), false);
      assert.equal(await page.locator('#simulation-verify').getAttribute('aria-expanded'), 'false');
      await page.keyboard.press('Enter');
      await page.keyboard.press('Tab');
      assert.equal(await page.evaluate(() => document.activeElement.id), 'simulation-pressure');
      await page.keyboard.press('Enter');
      assert.equal(await page.locator('#simulation-pressure-detail').isVisible(), true);
      assert.equal(page.url(), initialUrl);
      assert.equal(context.pages().length, 1);
    });
    await check('simulation: both keyboard decisions give polite feedback and preserve focus', async () => {
      await page.keyboard.press('Tab');
      assert.equal(await page.evaluate(() => document.activeElement.id), 'simulation-trust');
      await page.keyboard.press('Enter');
      assert.match(await page.locator('#simulation-feedback').textContent(), /look convincing/);
      assert.equal(await page.evaluate(() => document.activeElement.id), 'simulation-trust');
      await page.keyboard.press('Tab');
      assert.equal(await page.evaluate(() => document.activeElement.id), 'simulation-report');
      await page.keyboard.press('Space');
      const feedback = await page.locator('#simulation-feedback').textContent();
      assert.match(feedback, /investigation points to a suspicious message/);
      for (const text of ['northbridge-support.example', 'northbridge-check.example', '30-minute', 'bank card']) {
        assert.ok(feedback.includes(text));
      }
      const cdp = await context.newCDPSession(page);
      await cdp.send('DOM.enable'); await cdp.send('Accessibility.enable');
      const doc = await cdp.send('DOM.getDocument');
      const element = await cdp.send('DOM.querySelector', { nodeId: doc.root.nodeId, selector: '#simulation-feedback' });
      const tree = await cdp.send('Accessibility.getPartialAXTree', { nodeId: element.nodeId });
      const status = tree.nodes.find(node => node.role?.value === 'status');
      assert.ok(status);
      assert.ok(status.properties?.some(property => property.name === 'live' && property.value.value === 'polite'));
      await cdp.detach();
    });
    await check('simulation: expanded clues and feedback fit 320px at 150% text', async () => {
      assert.equal(await page.locator('#size-label').textContent(), '150%');
      const dimensions = await panel.evaluate(host => {
        const width = document.documentElement.clientWidth;
        const bad = [...host.querySelectorAll('button,code,p,article,summary')]
          .filter(element => element.getClientRects().length)
          .filter(element => {
            const r = element.getBoundingClientRect();
            return r.left < -1 || r.right > width + 1 ||
              element.scrollWidth > element.clientWidth + 2;
          }).map(element => ({ tag: element.tagName, id: element.id }));
        return { width, scrollWidth: document.documentElement.scrollWidth, bad };
      });
      assert.ok(dimensions.scrollWidth <= dimensions.width + 1, JSON.stringify(dimensions));
      assert.deepEqual(dimensions.bad, []);
      await page.locator('#simulation-subject').evaluate(element => element.scrollIntoView({ behavior: 'instant', block: 'start' }));
      await page.screenshot({ path: path.join(artifacts, 'simulation-email-320-150.png') });
      await page.locator('#simulation-feedback').evaluate(element => element.scrollIntoView({ behavior: 'instant', block: 'start' }));
      await page.screenshot({ path: path.join(artifacts, 'simulation-feedback-320-150.png') });
    });
    await check('simulation: keyboard reset closes clues, clears feedback and supports retry', async () => {
      // Restore keyboard position explicitly after screenshot scrolling.
      await page.locator('#simulation-report').focus();
      await page.keyboard.press('Tab');
      assert.equal(await page.evaluate(() => document.activeElement.id), 'simulation-read');
      await page.keyboard.press('Tab');
      assert.equal(await page.evaluate(() => document.activeElement.id), 'simulation-reset');
      await page.keyboard.press('Space');
      assert.equal(await page.evaluate(() => document.activeElement.id), 'simulation-sender');
      assert.equal(await page.locator('#simulation-feedback').textContent(), '');
      for (const id of ['sender', 'destination', 'pressure']) {
        assert.equal(await page.locator('#simulation-' + id + '-detail').isVisible(), false);
        assert.equal(await page.locator('#simulation-' + id).getAttribute('aria-expanded'), 'false');
      }
      assert.match(await page.locator('#simulation-action-status').textContent(), /Investigation restarted/);
      await page.locator('#simulation-report').focus(); await page.keyboard.press('Enter');
      assert.match(await page.locator('#simulation-feedback').textContent(), /investigation points to a suspicious message/);
    });
    await check('simulation: no requests, data storage, navigation, popups or completion effects', async () => {
      await page.waitForTimeout(300);
      assert.deepEqual(requests, []);
      assert.deepEqual(externalRequests, []);
      assert.equal(await page.evaluate(() => JSON.stringify({ ...localStorage })), storedBefore);
      assert.equal(await page.locator('#progress').textContent(), progressBefore);
      assert.equal(await page.locator('#next').isVisible(), false);
      assert.equal(page.url(), initialUrl);
      assert.equal(context.pages().length, 1);
      assert.deepEqual(pageErrors, []);
    });
    await check('simulation: remaining lessons stay accessible and a return starts fresh', async () => {
      await page.locator('#lesson-cards a').nth(1).click();
      assert.equal(await panel.isVisible(), false);
      assert.equal(await panel.locator('details').count(), 0);
      await page.locator('#lesson-cards a').first().click();
      assert.equal(await panel.locator('#simulation-content').isVisible(), true);
      assert.equal(await page.locator('#simulation-feedback').textContent(), '');
      assert.equal(await page.evaluate(() => document.activeElement.id), 'lesson-title');
    });
    await check('bank examples: keyboard clues, inert replies, reset and 320px/150% layout', async () => {
      const storage = await page.evaluate(() => JSON.stringify({ ...localStorage }));
      const url = page.url();
      requests.length = 0;
      const examples = page.locator('#bank-examples');
      assert.equal(await examples.locator('a,input,form,iframe,img,script,[href],[src]').count(), 0);
      assert.match(await examples.textContent(), /786.42/);
      const buttons = examples.locator('button[aria-controls]');
      for (let i = 0; i < await buttons.count(); i++) {
        const button = buttons.nth(i);
        const id = await button.getAttribute('aria-controls');
        const wasOpen = await page.locator('#' + id).isVisible();
        await button.focus();
        await page.keyboard.press('Enter');
        assert.equal(await button.getAttribute('aria-expanded'), String(!wasOpen));
        assert.equal(await page.locator('#' + id).isVisible(), !wasOpen);
        assert.equal(await page.evaluate(() => document.activeElement.id), await button.getAttribute('id'));
      }
      const overflow = await examples.evaluate(root => [...root.querySelectorAll('button,p,article,h4')].filter(e => {
        if (e.classList.contains('clue-announcement')) return false;
        const r = e.getBoundingClientRect();
        return r.width && (e.scrollWidth > e.clientWidth + 2 || r.left < -1 || r.right > innerWidth + 1);
      }).map(e => e.id || e.tagName));
      assert.deepEqual(overflow, []);
      assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true);
      for (const kind of ['email','text']) {
        await page.locator('#bank-' + kind + '-reset').focus();
        await page.keyboard.press('Space');
        assert.equal(await page.evaluate(() => document.activeElement.id), 'bank-' + kind + '-sender');
        assert.equal(await page.locator('#bank-' + kind + '-sender').getAttribute('aria-expanded'), 'false');
      }
      assert.equal(page.url(), url);
      assert.deepEqual(requests, []);
      assert.deepEqual(externalRequests, []);
      assert.equal(await page.evaluate(() => JSON.stringify({ ...localStorage })), storage);
      assert.equal(await page.locator('#progress').textContent(), progressBefore);
      await page.emulateMedia({ reducedMotion: 'reduce' });
      await page.locator('#bank-email-review').focus(); await page.keyboard.press('Space');
      assert.equal(await page.locator('#bank-email-review-detail').isVisible(), true);
      await page.locator('#lesson-cards a').nth(1).click();
      await page.waitForSelector('#bank-examples', { state: 'detached' });
      assert.equal(await page.locator('#bank-examples').count(), 0);
    });
    await check('Lesson 1 is continuously visible, in order, with no Continue controls at 320px/150%', async () => {
      await page.locator('#lesson-cards a').first().click();
      assert.equal(await page.locator('#guided-controls,#lesson-continue').count(),0);
      const order = await page.evaluate(() => ['bank-examples','phishing-simulation','lesson-scenario','quiz'].map(id =>
        [...document.querySelectorAll('*')].indexOf(document.getElementById(id))));
      assert.deepEqual(order,[...order].sort((a,b)=>a-b));
      for (const id of ['bank-email-heading','bank-text-heading','simulation-content','lesson-scenario','quiz'])
        assert.equal(await page.locator('#'+id).isVisible(),true);
      for (const id of ['bank-email-sender-detail','bank-text-request-detail','simulation-sender-detail'])
        assert.equal(await page.locator('#'+id).isVisible(),false);
      assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
    });
    await check('Lesson 1 quiz keyboard collapse preserves answers/feedback; empty clue controls stay hidden', async () => {
      await page.locator('#lesson-cards a').first().click();
      for (const kind of ['email','text']) {
        assert.equal(await page.locator('#bank-'+kind+'-reset').isVisible(),false);
        assert.equal(await page.locator('#bank-'+kind+'-status').isVisible(),false);
        await page.locator('#bank-'+kind+'-sender').focus();await page.keyboard.press('Enter');
        assert.equal(await page.locator('#bank-'+kind+'-reset').isVisible(),true);
        assert.equal(await page.locator('#bank-'+kind+'-reset').textContent(),'Close');
        await page.locator('#bank-'+kind+'-reset').focus();await page.keyboard.press('Space');
        assert.equal(await page.locator('#bank-'+kind+'-reset').isVisible(),false);
        assert.equal(await page.locator('#bank-'+kind+'-status').isVisible(),false);
        assert.match(await page.locator('#bank-'+kind+'-announcement').textContent(),/All clues closed/);
        assert.equal(await page.locator('#bank-'+kind+'-announcement').getAttribute('role'),'status');
        assert.equal(await page.locator('#bank-'+kind+'-announcement').evaluate(e=>getComputedStyle(e).clipPath),'inset(50%)');
      }
      const toggle=page.locator('#lesson-one-quiz-toggle');
      assert.equal(await page.locator('#lesson-one-quiz').getAttribute('open'),'');
      assert.equal(await toggle.textContent(),'Lesson 1 Quiz — Check Your Knowledge');
      await page.locator('#answers input').nth(1).check();
      await page.locator('#quiz button[type=submit]').click();
      const feedback=await page.locator('#feedback').textContent();
      const progress=await page.locator('#progress').textContent();
      await toggle.focus();await page.keyboard.press('Space');
      assert.equal(await page.locator('#quiz').isVisible(),false);
      assert.equal(await page.locator('#feedback').isVisible(),false);
      assert.equal(await page.evaluate(()=>document.activeElement.id),'lesson-one-quiz-toggle');
      await page.keyboard.press('Enter');
      assert.equal(await page.locator('#quiz').isVisible(),true);
      assert.equal(await page.locator('#answers input').nth(1).isChecked(),true);
      assert.equal(await page.locator('#feedback').textContent(),feedback);
      assert.equal(await page.locator('#progress').textContent(),progress);
      assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
      await page.locator('#lesson-cards a').nth(1).click();
      assert.equal(await page.locator('#lesson-one-quiz').count(),0);
      assert.equal(await page.locator('#quiz').isVisible(),true);
      await page.locator('#lesson-cards a').first().click();
    });
    await check('exploration audio: section tracking, optional messages, keyboard resume and reduced-motion scrolling', async () => {
      await page.addInitScript(() => {
        const state = { active: null, readings: [], paused: false };
        const synth = {
          get paused() { return state.paused; },
          getVoices() { return [{lang:'en-US',localService:true}]; },
          cancel() { state.active=null; state.paused=false; },
          pause() { state.paused=true; }, resume() { state.paused=false; },
          speak(reading) { if(state.active) throw Error('Overlapping speech'); state.active=reading;state.readings.push(reading.text); },
          addEventListener() {}, removeEventListener() {}
        };
        state.finish=()=>{const reading=state.active;state.active=null;if(reading)reading.onend();};
        state.scrolls=[];
        const scroll=Element.prototype.scrollIntoView;
        Element.prototype.scrollIntoView=function(options){state.scrolls.push({id:this.id,behavior:options&&options.behavior});scroll.call(this,options);};
        window.__guideAudio=state;
        Object.defineProperty(window,'speechSynthesis',{value:synth,configurable:true});
        Object.defineProperty(window,'SpeechSynthesisUtterance',{value:function(text){this.text=text;},configurable:true});
      });
      await page.reload();
      for(let i=0;i<5;i++) await page.locator('#larger').click();
      await page.locator('#play').click();
      const first=await page.evaluate(()=>window.__guideAudio.active.text);
      await page.locator('#play').click();
      assert.equal(await page.evaluate(()=>window.__guideAudio.readings.length),1);
      await page.locator('#pause').click();
      assert.equal(await page.evaluate(()=>window.__guideAudio.paused),true);
      await page.locator('#play').click();
      assert.equal(await page.evaluate(()=>window.__guideAudio.readings.length),1);
      await page.locator('#stop').click();
      assert.equal(await page.evaluate(()=>window.__guideAudio.active),null);
      await page.locator('#play').click();
      assert.equal(await page.evaluate(()=>window.__guideAudio.active.text),first);
      const drain = async () => {
        for(let i=0;i<100;i++){
          if(await page.evaluate(()=>speechSession===null))return;
          await page.evaluate(()=>window.__guideAudio.finish());
          await page.waitForTimeout(450);
        }
        throw Error('Narration did not finish or pause');
      };
      assert.equal(await page.locator('#lesson-introduction').getAttribute('data-narrating'),'true');
      assert.equal(await page.evaluate(()=>document.activeElement.id),'play');
      await drain();
      assert.equal(await page.evaluate(()=>lessonAudio.index),2);
      assert.equal(await page.locator('#play').textContent(),'Continue lesson');
      assert.match(await page.locator('#audio-status').textContent(),/paused while you explore/);
      const count=await page.evaluate(()=>window.__guideAudio.readings.length);
      await page.waitForTimeout(500);assert.equal(await page.evaluate(()=>window.__guideAudio.readings.length),count);
      assert.doesNotMatch(await page.evaluate(()=>window.__guideAudio.readings.join(' ')),/786.42|alerts@northbridge-access/);
      for(const [id,index,phrase] of [['bank-email-read',2,'alerts@northbridge-access.example'],['bank-text-read',3,'$786.42'],['simulation-read',4,'Please verify your account today']]){
        assert.equal(await page.evaluate(()=>lessonAudio.index),index);
        await page.locator('#'+id).focus();await page.keyboard.press('Space');
        assert.equal(await page.evaluate(()=>document.activeElement.id),id);
        await page.locator('#pause').click();assert.equal(await page.evaluate(()=>window.__guideAudio.paused),true);
        await page.locator('#play').click();
        await drain();
        assert.ok((await page.evaluate(()=>window.__guideAudio.readings.join(' '))).includes(phrase));
        assert.equal(await page.evaluate(()=>lessonAudio.waiting),true);
        assert.equal(await page.locator('#play').textContent(),'Continue lesson');
        if(index===4) await page.locator('#lesson-one-quiz-toggle').click();
        await page.locator('#play').focus();await page.keyboard.press('Enter');
        if(index<4) await drain();
      }
      for(let i=0;i<100;i++){
        if(await page.evaluate(()=>lessonAudio.sections[lessonAudio.index].target==='quiz'))break;
        await page.evaluate(()=>window.__guideAudio.finish());await page.waitForTimeout(450);
      }
      assert.equal(await page.locator('#lesson-one-quiz').getAttribute('open'),null);
      assert.equal(await page.locator('#lesson-one-quiz-toggle').getAttribute('data-narrating'),'true');
      await drain();
      assert.equal(await page.evaluate(()=>lessonAudio.finished),true);
      assert.equal(await page.evaluate(()=>document.activeElement.id),'play');
      assert.equal(await page.evaluate(()=>window.__guideAudio.scrolls.some(s=>s.id==='bank-email-panel')),true);
      assert.equal(await page.evaluate(()=>window.__guideAudio.scrolls.filter(s=>s.id==='bank-email-panel').every(s=>s.behavior==='instant')),true);
      for(const id of ['bank-email-sender-detail','bank-text-request-detail','simulation-sender-detail'])
        assert.equal(await page.locator('#'+id).isVisible(),false);
      assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
      await page.locator('#bank-text-request').focus();await page.keyboard.press('Enter');
      assert.equal(await page.evaluate(()=>window.__guideAudio.active),null);
      assert.equal(await page.evaluate(()=>audioEnabled),false);
      assert.equal(await page.locator('#bank-text-request-detail').isVisible(),true);
      assert.equal(await page.locator('#floating-player').isVisible(),false);
      await page.locator('#stop').click();
      assert.equal(await page.locator('[data-narrating="true"]').count(),0);
      assert.deepEqual(pageErrors,[]);
    });
    await check('silent investigation cancels current speech and never restarts it on keyboard activation or stale callbacks',async()=>{
      for(const control of ['bank-email-sender','bank-text-request','simulation-sender','simulation-verify']){
        await page.locator('#lesson-cards a').first().click();
        await page.locator('#read-from').selectOption({label:'Account sign-in email'});
        await page.locator('#play').click();
        await page.evaluate(()=>window.__silentStale=window.__guideAudio.active);
        const selected=await page.locator('#read-from').inputValue();
        const count=await page.evaluate(()=>window.__guideAudio.readings.length);
        await page.locator('#'+control).focus();await page.keyboard.press('Enter');
        assert.equal(await page.evaluate(()=>document.activeElement.id),control);
        assert.equal(await page.evaluate(()=>window.__guideAudio.active),null);
        assert.equal(await page.evaluate(()=>audioEnabled),false);
        assert.equal(await page.locator('#floating-player').isVisible(),false);
        assert.equal(await page.locator('#read-from').inputValue(),selected);
        assert.equal(await page.locator('#floating-read-from').inputValue(),selected);
        const detail=await page.locator('#'+control).getAttribute('aria-controls');
        assert.equal(await page.locator('#'+detail).isVisible(),true);
        await page.evaluate(()=>window.__silentStale.onend());await page.waitForTimeout(500);
        assert.equal(await page.evaluate(()=>window.__guideAudio.readings.length),count);
        await page.locator('#bank-text-read').click();assert.ok(await page.evaluate(()=>window.__guideAudio.active));
        await page.locator('#stop').click();
      }
      assert.deepEqual(pageErrors,[]);
    });
  } finally { await context.close(); }
}

// Runs in the page. Account for CSS scroll spacing when deciding whether a
// complete explanation fits; longer notes need a clearly readable beginning.
function explanationIsReadable(id) {
  const element=document.getElementById(id),rect=element.getBoundingClientRect();
  const inset=(parseFloat(getComputedStyle(document.documentElement).scrollPaddingTop)||0)+
    (parseFloat(getComputedStyle(element).scrollMarginTop)||0);
  const available=innerHeight-Math.max(12,inset)-12;
  return rect.height>available
    ? rect.top>=-1 && innerHeight-12-rect.top>=Math.min(180,available/2)
    : rect.top>=-1 && rect.bottom<=innerHeight+1;
}
async function floatingPlayerChecks(base) {
 for(const viewport of [{width:390,height:844},{width:412,height:922},{width:320,height:568},{width:1280,height:900}]) {
  const context=await browser.newContext({viewport,isMobile:viewport.width<600,hasTouch:viewport.width<600});
  const page=await context.newPage();
  const errors=[],external=[];
  page.on('pageerror',e=>errors.push(e.message));
  await context.route('**/*',route=>{
    if(route.request().url().startsWith(base+'/'))return route.continue();
    external.push(route.request().url());return route.abort();
  });
  try {
   await page.addInitScript(()=>{
    const audio={active:null,paused:false,readings:[]};
    const synth={
     get paused(){return audio.paused;},getVoices(){return [{lang:'en-US',localService:true}];},
     cancel(){audio.active=null;audio.paused=false;},pause(){audio.paused=true;},resume(){audio.paused=false;},
     speak(reading){if(audio.active)throw Error('Overlapping speech');audio.active=reading;audio.readings.push(reading.text);},
     addEventListener(){},removeEventListener(){}
    };
    audio.finish=()=>{const reading=audio.active;audio.active=null;if(reading)reading.onend();};
    window.__floatingAudio=audio;
    Object.defineProperty(window,'speechSynthesis',{value:synth,configurable:true});
    Object.defineProperty(window,'SpeechSynthesisUtterance',{value:function(text){this.text=text;},configurable:true});
   });
   await page.emulateMedia({reducedMotion:'reduce'});
   await page.goto(base+'/#lesson-1',{waitUntil:'networkidle'});
   await check('floating player '+viewport.width+'×'+viewport.height+': activation, pause, Continue lesson and non-obstructing 100%/150% layout',async()=>{
    const player=page.locator('#floating-player');
    assert.equal(await player.isVisible(),false);
    await page.locator('#play').focus();await page.keyboard.press('Enter');
    assert.equal(await player.isVisible(),true);
    assert.equal(await page.locator('#floating-toggle').textContent(),'Pause');
    await page.locator('#audio-player-focus').focus();await page.keyboard.press('Enter');
    assert.equal(await page.evaluate(()=>document.activeElement.id),'floating-toggle');
    await page.keyboard.press('Space');
    assert.equal(await page.evaluate(()=>window.__floatingAudio.paused),true);
    assert.equal(await player.isVisible(),true);
    await page.locator('#page-content').evaluate(e=>e.scrollTop=e.scrollHeight);
    assert.equal(await player.isVisible(),true);
    await page.keyboard.press('Enter');
    for(let i=0;i<80;i++){
      if(await page.evaluate(()=>speechSession===null))break;
      await page.evaluate(()=>window.__floatingAudio.finish());await page.waitForTimeout(410);
    }
    assert.equal(await page.evaluate(()=>lessonAudio.waiting),true);
    assert.equal(await page.locator('#floating-toggle').textContent(),'Continue lesson');
    const inspect=async size=>{
      const geometry=await page.evaluate(()=>{
        const content=document.getElementById('page-content').getBoundingClientRect();
        const player=document.getElementById('floating-player').getBoundingClientRect();
        const buttons=[...document.querySelectorAll('#floating-player button,#floating-player select')].map(e=>{const r=e.getBoundingClientRect();return {left:r.left,right:r.right,top:r.top,bottom:r.bottom,width:r.width,height:r.height,overflow:e.scrollWidth>e.clientWidth+2};});
        return {contentBottom:content.bottom,contentHeight:content.height,playerTop:player.top,playerBottom:player.bottom,playerLeft:player.left,playerRight:player.right,buttons,width:innerWidth,height:innerHeight,overflow:document.documentElement.scrollWidth>innerWidth};
      });
      assert.ok(geometry.contentBottom<=geometry.playerTop+1,JSON.stringify(geometry));
      assert.ok(geometry.contentHeight>geometry.height/2,JSON.stringify(geometry));
      assert.ok(geometry.playerBottom<=geometry.height+1&&geometry.playerLeft>=0&&geometry.playerRight<=geometry.width);
      assert.equal(geometry.overflow,false);
      assert.equal(await page.locator('#floating-stop').evaluate(e=>{const range=document.createRange();range.selectNodeContents(e);return range.getClientRects().length;}),1);
      for(const button of geometry.buttons){assert.ok(button.width>=48&&button.height>=48);assert.equal(button.overflow,false);assert.ok(button.top>=0&&button.bottom<=geometry.height+1);}
      await page.locator('#bank-email-sender').focus();
      await page.locator('#bank-email-sender').evaluate(e=>e.scrollIntoView({block:'end',behavior:'instant'}));
      const clue=await page.locator('#bank-email-sender').boundingBox();
      const frame=await page.locator('#page-content').boundingBox();
      assert.ok(clue.y>=frame.y-1&&clue.y+clue.height<=frame.y+frame.height+1);
      await page.locator('#page-content').evaluate(e=>e.scrollTop=e.scrollHeight);
      const footer=await page.locator('footer').boundingBox();
      assert.ok(footer.y+footer.height<=geometry.contentBottom+2);
      await page.locator('#bank-email-panel').evaluate(e=>e.scrollIntoView({block:'start',behavior:'instant'}));
      await page.screenshot({path:path.join(artifacts,'floating-'+viewport.width+'-'+viewport.height+'-'+size+'.png')});
    };
    await inspect(100);
    for(let i=0;i<5;i++)await page.locator('#larger').click();
    await inspect(150);
    await page.locator('#floating-toggle').focus();await page.keyboard.press('Enter');
    assert.equal(await page.evaluate(()=>lessonAudio.index),3);
    await page.locator('#floating-stop').focus();await page.keyboard.press('Space');
    assert.equal(await player.isVisible(),false);
    assert.equal(await page.evaluate(()=>document.activeElement.id),'play');
    assert.equal(await page.evaluate(()=>speechSession),null);
    assert.deepEqual(errors,[]);assert.deepEqual(external,[]);
   });
   for(let lesson=1;lesson<5;lesson++) await check('lesson '+(lesson+1)+' at '+viewport.width+'×'+viewport.height+': shared selector, keyboard Play/Pause/Stop, Skip and retained selection at 150%',async()=>{
    await page.locator('#lesson-cards a').nth(lesson).click();
    await page.waitForFunction(index=>lessonAudio && lessonAudio.lesson===index,lesson);
    assert.equal(await page.locator('#floating-player').isVisible(),false);
    const title=await page.locator('#lesson-title').textContent();
    const labels=await page.locator('#read-from option').allTextContents();
    assert.equal(labels[0],title);assert.ok(labels.includes('Scenario'));
    assert.deepEqual(await page.locator('#floating-read-from option').allTextContents(),labels);
    const count=await page.evaluate(()=>window.__floatingAudio.readings.length);
    await page.locator('#read-from').focus();await page.keyboard.press('Home');
    await page.keyboard.press('ArrowDown');await page.keyboard.press('ArrowDown');await page.keyboard.press('Enter');
    assert.equal(await page.locator('#read-from').inputValue(),'2');
    assert.equal(await page.evaluate(()=>window.__floatingAudio.readings.length),count);
    assert.equal(await page.locator('#floating-player').isVisible(),false);
    await page.locator('#play').focus();await page.keyboard.press('Enter');
    assert.match(await page.evaluate(()=>window.__floatingAudio.active.text),/Scenario/);
    assert.equal(await page.locator('#floating-player').isVisible(),true);
    await page.locator('#floating-toggle').focus();await page.keyboard.press('Space');
    assert.equal(await page.evaluate(()=>window.__floatingAudio.paused),true);
    await page.evaluate(()=>window.__staleReading=window.__floatingAudio.active);
    const quiz=await page.evaluate(()=>String(lessonAudio.sections.findIndex(s=>s.target==='quiz')));
    await page.locator('#floating-read-from').selectOption(quiz);
    assert.equal(await page.evaluate(()=>speechSession),null);
    assert.equal(await page.locator('#read-from').inputValue(),quiz);
    assert.equal(await page.locator('#floating-toggle').textContent(),'Play');
    await page.locator('#floating-toggle').focus();await page.keyboard.press('Enter');
    assert.ok(await page.evaluate(()=>window.__floatingAudio.active));
    await page.evaluate(()=>window.__staleReading.onend());
    assert.ok(await page.evaluate(()=>window.__floatingAudio.active));
    await page.locator('#floating-stop').focus();await page.keyboard.press('Enter');
    assert.equal(await page.locator('#floating-player').isVisible(),false);
    assert.equal(await page.locator('#floating-read-from').inputValue(),quiz);
    assert.equal(await page.evaluate(()=>speechSession),null);
    await page.locator('#play').click();
    assert.ok(await page.evaluate(()=>window.__floatingAudio.active));
    await page.locator('#floating-read-from').selectOption({label:'Practice spotting the warning signs'});
    await page.locator('#floating-toggle').click();
    await page.locator('#warning-practice summary').click();
    await page.locator('#warning-practice button').filter({hasText:'Skip this practice'}).click();
    assert.equal(await page.locator('#floating-player').isVisible(),true);
    assert.equal(await page.locator('#read-from').inputValue(),quiz);
    assert.equal(await page.evaluate(()=>speechSession),null);
    assert.equal(await page.locator('#floating-toggle').textContent(),'Play');
    assert.equal(await page.locator('#page-content').evaluate(e=>e.scrollWidth<=e.clientWidth+2),true);
    const bounds=await page.evaluate(()=>({page:document.getElementById('page-content').getBoundingClientRect().bottom,player:document.getElementById('floating-player').getBoundingClientRect().top}));
    assert.ok(bounds.page<=bounds.player+1);
    await page.locator('#floating-stop').click();
    assert.deepEqual(errors,[]);assert.deepEqual(external,[]);
   });
   await check('explanation visibility '+viewport.width+'×'+viewport.height+': inline placement, minimal scrolling, silent keyboard use at 100%/150%',async()=>{
    await page.locator('#lesson-cards a').first().click();
    await page.waitForFunction(()=>lessonAudio && lessonAudio.lesson===0);
    await page.evaluate(()=>{
      window.__explanationScrolls=[];
      const original=Element.prototype.scrollIntoView;
      Element.prototype.scrollIntoView=function(options){
        if(this.classList.contains('message-clue')||this.classList.contains('simulation-clue'))window.__explanationScrolls.push({id:this.id,block:options.block,behavior:options.behavior});
        return original.call(this,options);
      };
    });
    for(let i=0;i<5;i++)await page.locator('#smaller').click();
    for(const size of [100,150]){
      if(size===150)for(let i=0;i<5;i++)await page.locator('#larger').click();
      for(const id of ['bank-email-sender','bank-text-request','simulation-sender']){
        const button=page.locator('#'+id),detailId=await button.getAttribute('aria-controls');
        const detail=page.locator('#'+detailId);
        await button.focus();
        await page.evaluate(id=>{
          const button=document.getElementById(id),rect=button.getBoundingClientRect();
          window.scrollTo({top:window.scrollY+rect.bottom-(innerHeight-24),behavior:'instant'});
        },id);
        const count=await page.evaluate(()=>window.__floatingAudio.readings.length);
        await page.keyboard.press('Enter');
        await page.waitForFunction(explanationIsReadable,detailId);
        assert.equal(await detail.isVisible(),true);
        assert.equal(await page.evaluate(()=>document.activeElement.id),id);
        assert.equal(await page.evaluate(()=>window.__floatingAudio.readings.length),count);
        assert.equal(await page.evaluate(()=>audioEnabled),false);
        const requests=await page.evaluate(id=>window.__explanationScrolls.filter(item=>item.id===id),detailId);
        assert.ok(requests.length>0,'Expected a necessary scroll for '+id);
        assert.equal(requests.at(-1).behavior,'instant');
        if(id!=='simulation-sender')assert.equal(await button.evaluate(e=>e.nextElementSibling.id),detailId);
        if(size===150 && id==='bank-text-request')await page.screenshot({path:path.join(artifacts,'explanation-'+viewport.width+'-'+viewport.height+'-150.png')});
        const scrolls=await page.evaluate(()=>window.__explanationScrolls.length);
        await page.keyboard.press('Enter');
        assert.equal(await detail.isVisible(),false);
        assert.equal(await page.evaluate(()=>window.__explanationScrolls.length),scrolls);
      }
    }
    assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
    assert.deepEqual(errors,[]);assert.deepEqual(external,[]);
   });
   await check('shared reply and investigation explanations '+viewport.width+'×'+viewport.height+': readable beginning after stopping active narration at 150%',async()=>{
    await page.locator('#lesson-cards a').first().click();
    assert.equal(await page.evaluate(()=>getComputedStyle(document.documentElement).fontSize),'30px');
    for(const id of ['bank-text-reply-yes','bank-text-reply-no','simulation-sender','simulation-destination','simulation-pressure','simulation-verify']){
      const button=page.locator('#'+id),detailId=await button.getAttribute('aria-controls');
      const detail=page.locator('#'+detailId);
      if(await detail.isVisible())await button.click();
      await page.locator('#play').click();
      const count=await page.evaluate(()=>window.__floatingAudio.readings.length);
      await button.focus();await page.keyboard.press('Enter');
      await page.waitForFunction(explanationIsReadable,detailId);
      assert.equal(await detail.isVisible(),true);
      assert.equal(await page.evaluate(()=>document.activeElement.id),id);
      assert.equal(await page.evaluate(()=>window.__floatingAudio.readings.length),count);
      assert.equal(await page.evaluate(()=>window.__floatingAudio.active),null);
      assert.equal(await page.evaluate(()=>audioEnabled),false);
      assert.equal(await page.locator('#floating-player').isVisible(),false);
      if(id.includes('reply-'))assert.equal(await detail.evaluate(e=>e.parentElement.previousElementSibling.classList.contains('text-replies')),true);
    }
    assert.equal(await page.locator('#bank-text-reply-yes').getAttribute('aria-controls'),await page.locator('#bank-text-reply-no').getAttribute('aria-controls'));
    assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
    assert.deepEqual(errors,[]);assert.deepEqual(external,[]);
   });
  } finally {await context.close();}
 }
}

(async () => {
  let playwright;
  try { playwright = require(process.env.CYBERSAFE_PLAYWRIGHT_MODULE || 'playwright'); }
  catch {
    console.error('Browser testing unavailable: use an already installed Playwright module via CYBERSAFE_PLAYWRIGHT_MODULE. Nothing was installed.');
    process.exitCode = 2; return;
  }
  if (!process.env.CYBERSAFE_BROWSER_EXECUTABLE || !fs.existsSync(process.env.CYBERSAFE_BROWSER_EXECUTABLE)) {
    console.error('Browser testing unavailable: set CYBERSAFE_BROWSER_EXECUTABLE to an existing Chrome/Edge executable. Nothing was installed.');
    process.exitCode = 2; return;
  }
  fs.mkdirSync(artifacts, { recursive: true });
  try {
    browser = await playwright.chromium.launch({ executablePath: process.env.CYBERSAFE_BROWSER_EXECUTABLE, headless: true, chromiumSandbox: true });
    report.environment.browser = browser.version();
    report.environment.platform = process.platform + ' ' + process.arch;
    if (!process.argv.includes('--local-only')) await measureLive();
    await localBrowserChecks();
  } catch (error) {
    report.failures.push({ name: 'browser runner', error: error.message });
    console.error('Browser run failed: ' + error.message);
    process.exitCode = 1;
  } finally {
    if (browser) await browser.close();
    if (server) await new Promise(resolve => server.close(resolve));
    const reportName = process.argv.includes('--local-only') ? 'phase1-browser-local.json' : 'phase1-browser.json';
    fs.writeFileSync(path.join(artifacts, reportName), JSON.stringify(report, null, 2) + '\n');
    console.log('Report: tests/artifacts/' + reportName);
    console.log('Checks passed: ' + report.checks.length + '; failures: ' + report.failures.length + '; live samples: ' + report.measurements.length);
    if (report.failures.length) process.exitCode = 1;
  }
})();
