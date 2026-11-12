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
  report.limitations.push('Accessibility-tree/live-region checks do not prove a screen reader spoke the feedback. Actual assistive-technology announcements and audible local-voice playback require manual testing.');
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
