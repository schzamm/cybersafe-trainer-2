'use strict';
const { test } = require('node:test');
const assert = require('node:assert/strict');
const { boot } = require('./helpers/app-harness.cjs');

function open(options) {
  const a = boot(options);
  a.run('openLesson(0)');
  return a;
}
function startInvestigation(a) {
  a.fire(a.get('play'));
}
function inspect(a) {
  for (const id of ['simulation-sender', 'simulation-destination', 'simulation-pressure']) a.fire(a.get(id));
}

test('simulation is optional, visible and present only in the bank lesson', () => {
  const a = boot();
  assert.equal(a.get('phishing-simulation').hidden, true);
  a.lessonClick(0);
  assert.equal(a.get('phishing-simulation').hidden, false);
  assert.equal(a.get('phishing-simulation').querySelector('section').hidden, false);
  assert.match(a.get('phishing-simulation').textContent, /Fictional inbox — practice only/);
  assert.equal(a.run('lessons.length'), 5);
  for (let i = 1; i < 5; i++) {
    a.lessonClick(i);
    assert.equal(a.get('phishing-simulation').hidden, true);
    assert.equal(a.get('phishing-simulation').children.length, 0);
  }
  a.lessonClick(0);
  assert.equal(a.get('simulation-feedback').textContent, '');
});

test('sender, destination and pressure are inspectable without changing the route', () => {
  const a = open();
  const hash = a.run('location.hash');
  for (const id of ['simulation-sender', 'simulation-destination', 'simulation-pressure']) {
    const control = a.get(id), region = a.get(id + '-detail');
    assert.equal(control.type, 'button');
    assert.equal(control.getAttribute('aria-controls'), region.id);
    assert.equal(region.hidden, true);
    a.fire(control);
    assert.equal(region.hidden, false);
    assert.equal(control.getAttribute('aria-expanded'), 'true');
    a.fire(control);
    assert.equal(region.hidden, true);
    assert.equal(control.getAttribute('aria-expanded'), 'false');
  }
  a.fire(a.get('simulation-verify'));
  assert.equal(a.get('simulation-destination-detail').hidden, false);
  assert.equal(a.get('simulation-verify').getAttribute('aria-expanded'), 'true');
  assert.equal(a.get('simulation-destination').getAttribute('aria-expanded'), 'true');
  assert.match(a.get('simulation-action-status').textContent, /No website opened/);
  a.fire(a.get('simulation-destination'));
  assert.equal(a.get('simulation-verify').getAttribute('aria-expanded'), 'false');
  a.fire(a.get('simulation-sender'));
  assert.match(a.get('simulation-sender-detail').textContent, /security@northbridge-support\.example/);
  assert.equal(a.run('location.hash'), hash);
});

test('no actionable links, login fields, forms, embeds or external destinations exist in the simulation', () => {
  const a = open(), host = a.get('phishing-simulation');
  inspect(a);
  for (const tag of ['a', 'input', 'form', 'iframe', 'script', 'img', 'textarea']) {
    assert.equal(host.querySelectorAll(tag).length, 0);
  }
  for (const node of host.querySelectorAll('*')) {
    assert.equal(node.getAttribute('href'), null);
    assert.equal(node.getAttribute('src'), null);
    assert.equal(node.getAttribute('action'), null);
  }
  assert.ok(host.querySelectorAll('button').every(button => button.type === 'button'));
  assert.match(a.get('simulation-destination-detail').textContent, /https:\/\/northbridge-check\.example\/verify/);
  assert.equal(a.get('simulation-verify').getAttribute('aria-describedby'), 'simulation-safety');
});

for (const decision of ['trust', 'report']) {
  test(decision + ' gives immediate educational feedback without completion, storage or automatic speech', () => {
    const a = open(), control = a.get('simulation-' + decision);
    const before = a.get('progress').textContent;
    control.focus(); a.fire(control);
    const feedback = a.get('simulation-feedback');
    assert.equal(feedback.getAttribute('role'), 'status');
    assert.equal(feedback.getAttribute('aria-live'), 'polite');
    assert.equal(feedback.getAttribute('aria-atomic'), 'true');
    assert.match(feedback.textContent, decision === 'trust' ? /look convincing/ : /investigation points to a suspicious message/);
    for (const clue of ['northbridge-support.example', 'northbridge-check.example', '30-minute', 'bank card', 'Nothing was sent or opened']) {
      assert.ok(feedback.textContent.includes(clue));
    }
    assert.equal(a.focused(), control);
    assert.equal(a.get('progress').textContent, before);
    assert.equal(a.run('completed.size'), 0);
    assert.equal(a.writes.length, 0);
    assert.equal(a.spoken.length, 0);
    assert.equal(a.get('next').hidden, true);
    a.fire(a.get('simulation-report')); a.fire(a.get('simulation-trust'));
    assert.match(feedback.textContent, /look convincing/);
  });
}

test('reset closes every clue, clears the decision, stops audio and returns focus safely', () => {
  const a = open();
  inspect(a); a.fire(a.get('simulation-report'));
  startInvestigation(a); const old = a.active();
  a.fire(a.get('simulation-reset'));
  for (const id of ['simulation-sender', 'simulation-destination', 'simulation-pressure']) {
    assert.equal(a.get(id + '-detail').hidden, true);
    assert.equal(a.get(id).getAttribute('aria-expanded'), 'false');
  }
  assert.equal(a.get('simulation-verify').getAttribute('aria-expanded'), 'false');
  assert.equal(a.get('simulation-feedback').textContent, '');
  assert.match(a.get('simulation-action-status').textContent, /Investigation restarted/);
  assert.equal(a.focused(), a.get('simulation-sender'));
  assert.equal(a.active(), null);
  old.onend(); a.advance(10000);
  assert.equal(a.active(), null);
  assert.equal(a.writes.length, 0);
});

test('simulation actions and reset never erase a completed main lesson or its current answer', () => {
  const a = boot(); a.selectMain(0, 1);
  const saved = a.data.get('cybersafe-trainer.completed-lessons.v1');
  const selected = a.get('quiz').querySelector('input:checked');
  inspect(a); a.fire(a.get('simulation-trust')); a.fire(a.get('simulation-report')); a.fire(a.get('simulation-reset'));
  assert.equal(a.run('completed.size'), 1);
  assert.equal(a.get('quiz').querySelector('input:checked'), selected);
  assert.equal(a.data.get('cybersafe-trainer.completed-lessons.v1'), saved);
  assert.equal(a.writes.length, 1);
  assert.equal(a.get('next').hidden, false);
});

test('primary lesson reading preserves the 400ms heading gap and existing Pause/Play/Stop', () => {
  const a = open(); inspect(a);
  startInvestigation(a);
  assert.equal(a.active().text, a.run('lessons[0].title'));
  assert.equal(a.active().voice.localService, true);
  a.end(); a.advance(100); a.fire(a.get('pause')); a.advance(5000);
  assert.equal(a.spoken.length, 1);
  a.fire(a.get('play')); a.advance(299); assert.equal(a.spoken.length, 1);
  a.advance(1); assert.equal(a.spoken.length, 2);
  assert.doesNotMatch(a.active().text, /security@northbridge-support\.example|northbridge-check\.example/);
  const body = a.active(); a.fire(a.get('pause')); a.fire(a.get('play'));
  assert.equal(a.active(), body);
  a.fire(a.get('stop'));
  assert.equal(a.active(), null);
  assert.equal(a.get('audio-status').textContent, '');
});

test('selected audio carries through both decision explanations without overlap', () => {
  const a = open(); startInvestigation(a); const old = a.active();
  a.fire(a.get('simulation-trust')); old.onend();
  assert.equal(a.active().text, a.get('simulation-feedback').textContent);
  const first = a.active(); a.fire(a.get('simulation-report')); first.onend();
  assert.equal(a.active().text, a.get('simulation-feedback').textContent);
  assert.equal(a.active().voice.localService, true);
  a.fire(a.get('stop'));
  assert.equal(a.run('audioEnabled'), true);
});

test('lesson navigation and investigation reset cancel pending voice loading', () => {
  for (const action of ['navigate', 'reset']) {
    const a = open({ voices: [] }); startInvestigation(a);
    if (action === 'navigate') a.lessonClick(1);
    else if (action === 'reset') a.fire(a.get('simulation-reset'));
    a.setVoices([{ lang: 'en-US', localService: true }]); a.voicesChanged(); a.advance(10000);
    assert.equal(a.spoken.length, 0);
    assert.equal(a.timers.size, 0);
  }
});

test('missing or remote-only speech leaves the exercise and explanations usable', () => {
  for (const options of [{ noSpeech: true }, { voices: [{ lang: 'en-US', localService: false }] }]) {
    const a = open(options); startInvestigation(a); a.advance(5000);
    assert.equal(a.spoken.length, 0);
    assert.match(a.get('audio-status').textContent, /not available|not currently available/);
    a.fire(a.get('simulation-report'));
    assert.match(a.get('simulation-feedback').textContent, /independently|bank card/);
    assert.equal(a.writes.length, 0);
  }
});
