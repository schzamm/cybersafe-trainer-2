'use strict';
// Deterministic application model, not a browser, layout engine or screen reader.
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const root = path.resolve(__dirname, '../..');
const source = fs.readFileSync(path.join(root, 'app.js'), 'utf8');
const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');

function boot(options = {}) {
  const events = {}, timers = new Map(), voiceListeners = new Set(), spoken = [];
  const data = options.data || new Map(), reads = [], writes = [];
  let now = 0, nextTimer = 0, active = null, focused = null;
  let voices = options.voices === undefined ? [{ lang: 'en-US', localService: true }] : options.voices;
  function element(tag, text = '') {
    let value = text;
    const node = {
      tagName: tag.toUpperCase(), children: [], attributes: {}, dataset: {}, style: {},
      handlers: {}, hidden: false, checked: false, disabled: false, open: false,
      get textContent() { return value + this.children.map(c => c.textContent).join(''); },
      set textContent(text) { value = String(text); this.children = []; },
      append(...children) { children.forEach(child => { child.parentElement = this; this.children.push(child); }); },
      replaceChildren(...children) { value = ''; this.children = []; this.append(...children); },
      addEventListener(type, callback) { (this.handlers[type] ||= []).push(callback); },
      setAttribute(name, value) {
        this.attributes[name] = String(value);
        if (name === 'id') this.id = value;
        if (name === 'class') this.className = value;
        if (name === 'href') this.href = value;
        if (name === 'hidden') this.hidden = true;
      },
      getAttribute(name) { return name === 'href' ? this.href : this.attributes[name] ?? null; },
      contains(child) { return this === child || this.children.some(c => c.contains(child)); },
      matches(selector) {
        if (selector === '*') return true;
        if (selector === 'input:checked') return this.tagName === 'INPUT' && this.checked;
        if (selector === '[data-lesson-progress]') return 'lessonProgress' in this.dataset;
        if (selector.startsWith('.')) return (this.className || '').split(' ').includes(selector.slice(1));
        if (selector.startsWith('#')) return this.id === selector.slice(1);
        return this.tagName === selector.toUpperCase();
      },
      querySelectorAll(selector) {
        return this.children.flatMap(c => [c, ...c.querySelectorAll('*')]).filter(c => c.matches(selector));
      },
      querySelector(selector) { return this.querySelectorAll(selector)[0] || null; },
      closest(selector) { return this.matches(selector) ? this : this.parentElement?.closest(selector) || null; },
      focus() { focused = this; },
      scrollIntoView() { this.scrollCalls = (this.scrollCalls || 0) + 1; }
    };
    return node;
  }

  // Read actual markup, so missing IDs and changed form relationships fail tests.
  const documentRoot = element('document'), stack = [documentRoot];
  const voidTags = new Set(['meta', 'link', 'input', 'br', 'img', 'hr']);
  for (const token of html.match(/<!--[\s\S]*?-->|<![^>]*>|<\/?[^>]+>|[^<]+/g) || []) {
    if (token.startsWith('<!')) continue;
    if (token.startsWith('</')) { stack.pop(); continue; }
    if (token.startsWith('<')) {
      const match = token.match(/^<([a-z0-9-]+)/i);
      if (!match) continue;
      const node = element(match[1]);
      const attrs = token.slice(match[0].length, -1);
      for (const attr of attrs.matchAll(/([a-z][\w-]*)(?:="([^"]*)")?/gi)) {
        node.setAttribute(attr[1], attr[2] ?? '');
      }
      stack.at(-1).append(node);
      if (!voidTags.has(match[1].toLowerCase())) stack.push(node);
    } else stack.at(-1).append(element('#text', token));
  }
  const document = {
    getElementById: id => documentRoot.querySelector('#' + id),
    createElement: element,
    createTextNode: text => element('#text', text),
    querySelector: selector => documentRoot.querySelector(selector),
    querySelectorAll: selector => documentRoot.querySelectorAll(selector),
    documentElement: documentRoot.querySelector('html'),
    get activeElement() { return focused; },
    addEventListener(type, callback) { (events['document:' + type] ||= []).push(callback); }
  };
  const get = id => {
    const node = document.getElementById(id);
    if (!node) throw Error('Missing markup ID: ' + id);
    return node;
  };
  const storage = {
    getItem(key) { reads.push(key); if (options.readThrows) throw Error('Storage read denied'); return data.has(key) ? data.get(key) : null; },
    setItem(key, value) { writes.push(key); if (options.writeThrows) throw Error('Storage write denied'); data.set(key, value); }
  };
  const synth = {
    paused: false, speaking: false,
    getVoices() { if (options.voicesThrow) throw Error('Voice lookup failed'); return voices; },
    cancel() { active = null; this.speaking = false; },
    pause() { this.paused = true; if (options.endDuringPause && active) end(active); },
    resume() { this.paused = false; },
    speak(reading) {
      if (options.speakThrows) throw Error('Playback failed');
      if (active) throw Error('Overlapping utterances');
      if (this.paused) throw Error('New reading while synthesis remains paused');
      active = reading; this.speaking = true; spoken.push(reading);
    },
    addEventListener(type, fn) { voiceListeners.add(fn); },
    removeEventListener(type, fn) { voiceListeners.delete(fn); }
  };
  const media = { matches: (options.width || 1200) <= 600,
    addEventListener(type, fn) { (events.media ||= []).push(fn); } };
  const window = {
    addEventListener(type, fn) { (events[type] ||= []).push(fn); },
    matchMedia() { return media; }
  };
  if (!options.noSpeech) {
    window.speechSynthesis = synth;
    window.SpeechSynthesisUtterance = function(text) { this.text = text; };
  }
  if (options.missingMethod) delete synth[options.missingMethod];
  if (options.missingConstructor) window.SpeechSynthesisUtterance = undefined;
  Object.defineProperty(window, 'localStorage', { get() {
    if (options.storageThrows) throw Error('Storage unavailable');
    return options.noStorage ? undefined : storage;
  }});
  const location = { hash: options.hash || '' };
  function schedule(fn, delay, interval = false) {
    const id = ++nextTimer; timers.set(id, { fn, time: now + delay, interval: interval ? delay : 0 }); return id;
  }
  const context = vm.createContext({
    window, document, location, performance: { now: () => now }, console,
    setTimeout: (fn, ms) => schedule(fn, ms),
    setInterval: (fn, ms) => schedule(fn, ms, true),
    clearTimeout: id => timers.delete(id), clearInterval: id => timers.delete(id)
  });
  const run = script => vm.runInContext(script, context, { timeout: 1000 });
  run(source);
  function fire(node, type = 'click', extra = {}) {
    const event = { target: node, button: 0, defaultPrevented: false,
      preventDefault() { this.defaultPrevented = true; }, ...extra };
    for (const callback of node.handlers[type] || []) callback(event);
    return event;
  }
  function dispatch(type, event = {}) { for (const fn of events[type] || []) fn(event); }
  function advance(ms) {
    const limit = now + ms;
    let count = 0;
    while (true) {
      const next = [...timers].sort((a, b) => a[1].time - b[1].time)[0];
      if (!next || next[1].time > limit) break;
      if (++count > 1000) throw Error('Timer loop');
      const [id, timer] = next;
      now = timer.time;
      if (timer.interval) timer.time += timer.interval; else timers.delete(id);
      timer.fn();
    }
    now = limit;
  }
  function end(reading = active) {
    if (!reading) throw Error('No utterance to end');
    if (reading === active) { active = null; synth.speaking = false; }
    reading.onend();
    return reading;
  }
  function selectMain(index, answer) {
    run('openLesson(' + index + ')');
    get('answers').querySelectorAll('input').forEach((input, i) => { input.checked = i === answer; });
    fire(get('quiz'), 'submit');
  }
  function practice(kind) {
    const details = get(kind === 'warning' ? 'warning-practice' : 'followup-practice').querySelector('details');
    return { details, summary: details.querySelector('summary'), form: details.querySelector('form'),
      inputs: details.querySelectorAll('input'), buttons: details.querySelectorAll('button'),
      feedback: details.querySelector('.practice-feedback') };
  }
  function lessonClick(index, extra = {}) {
    const link = get('lesson-cards').querySelectorAll('a')[index];
    const event = fire(get('lesson-cards'), 'click', { target: link, ...extra });
    if (!event.defaultPrevented && !event.ctrlKey && !event.metaKey && !event.shiftKey && !event.altKey && event.button === 0) {
      const changed = location.hash !== link.href; location.hash = link.href;
      if (changed) dispatch('hashchange');
    }
    return event;
  }
  return { get, run, fire, dispatch, advance, end, selectMain, practice, lessonClick,
    spoken, timers, data, reads, writes, storage, synth, media, window, document,
    active: () => active, focused: () => focused, setVoices: value => { voices = value; },
    voicesChanged: () => { for (const fn of [...voiceListeners]) fn(); },
    pendingVoiceListeners: () => voiceListeners.size };
}
module.exports = { boot, root, source, html };
