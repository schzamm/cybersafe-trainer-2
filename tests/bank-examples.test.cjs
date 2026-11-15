'use strict';
const { test } = require('node:test');
const assert = require('node:assert/strict');
const { boot } = require('./helpers/app-harness.cjs');
for (const kind of ['email', 'text']) {
  test(kind + ': clues are hidden, inert, accessible, reversible and never affect progress', () => {
    const a = boot(); a.run('openLesson(0)');
    const host = a.get('bank-examples');
    assert.ok(host);
    const before = a.run('location.hash');
    const controls = host.querySelectorAll('button').filter(b => b.id && b.id.startsWith('bank-' + kind + '-') && b.getAttribute('aria-controls'));
    assert.ok(controls.length >= 3);
    for (const control of controls) {
      const detail = a.get(control.getAttribute('aria-controls'));
      assert.equal(detail.hidden, true);
      assert.equal(control.type, 'button');
      a.fire(control);
      assert.equal(detail.hidden, false);
      assert.equal(control.getAttribute('aria-expanded'), 'true');
      assert.equal(a.get('bank-' + kind + '-reset').textContent, 'Close');
      assert.equal(a.get('bank-' + kind + '-reset').disabled, false);
      assert.equal(a.get('bank-' + kind + '-status').textContent.includes(detail.textContent), false);
      assert.ok(a.get('bank-' + kind + '-status').textContent.length);
      a.fire(control);
      assert.equal(detail.hidden, true);
      assert.equal(a.get('bank-' + kind + '-reset').hidden, true);
      assert.equal(a.get('bank-' + kind + '-status').hidden, true);
      assert.match(a.get('bank-' + kind + '-announcement').textContent, /All clues closed/);
      assert.equal(a.get('bank-' + kind + '-reset').disabled, true);
    }
    a.fire(controls[0]); a.fire(a.get('bank-' + kind + '-reset'));
    assert.equal(a.focused(), controls[0]);
    assert.equal(a.run('completed.size'), 0);
    assert.equal(a.writes.length, 0);
    assert.equal(a.run('location.hash'), before);
    for (const tag of ['a','input','form','iframe','img','script']) assert.equal(host.querySelectorAll(tag).length, 0);
    for (const item of host.querySelectorAll('*')) {
      assert.equal(item.getAttribute('href'), null);
      assert.equal(item.getAttribute('src'), null);
    }
    a.run('openLesson(1)'); assert.equal(a.document.getElementById('bank-examples'), null);
  });
  test(kind + ': narration uses existing controls and cancellation', () => {
    const a = boot(); a.run('openLesson(0)');
    a.fire(a.get('play'));
    assert.ok(a.active()); a.fire(a.get('pause')); a.fire(a.get('play'));
    a.fire(a.get('stop')); a.advance(6000);
    assert.equal(a.run('speechSession'), null);
  });
}
test('YES and NO share one explanation and keep both control states synchronized', () => {
 const a=boot();a.run('openLesson(0)');
 const yes=a.get('bank-text-reply-yes'), no=a.get('bank-text-reply-no');
 assert.equal(yes.getAttribute('aria-controls'),no.getAttribute('aria-controls'));
 a.fire(yes); assert.equal(no.getAttribute('aria-expanded'),'true');
 assert.match(a.get('bank-text-status').textContent,/1 clue open/);
 a.fire(no);assert.equal(yes.getAttribute('aria-expanded'),'false');
 assert.equal(a.get('bank-text-reset').disabled,true);
});

test('single and multiple clue controls use Close and Close all without changing progress',()=>{
 const a=boot();a.run('openLesson(0)');
 a.fire(a.get('bank-email-sender'));assert.equal(a.get('bank-email-reset').textContent,'Close');
 a.fire(a.get('bank-email-urgency'));assert.equal(a.get('bank-email-reset').textContent,'Close all');
 a.fire(a.get('bank-email-sender'));assert.equal(a.get('bank-email-reset').textContent,'Close');
 assert.equal(a.writes.length,0);
 assert.equal(a.get('bank-examples-heading').textContent,"Let's Check Two Examples");
 assert.match(a.get('bank-email-sender').textContent,/Investigate/);
});
