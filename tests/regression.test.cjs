'use strict';
const { test } = require('node:test');
const assert = require('node:assert/strict');
const { boot, html } = require('./helpers/app-harness.cjs');
const key = 'cybersafe-trainer.completed-lessons.v1';
const mainCorrect = [1, 0, 2, 1, 0];
const followupCorrect = [1, 2, 0, 1, 2];

test('Lesson 2 defines independent verification using trusted existing contacts and the usual accessible term pause',()=>{
  const a=boot();a.run('openLesson(1)');
  const definition=a.get('lesson-introduction').querySelector('dfn');
  assert.equal(definition.textContent,'Independent verification');
  assert.match(a.get('lesson-introduction').textContent,/not one supplied in the message/);
  assert.match(a.get('lesson-introduction').textContent,/professional-looking message can be fraudulent/);
  const segments=a.run('lessonSpeechSegments(lessons[1],1,"")');
  assert.equal(segments[0].pauseAfterMs,400);
  assert.equal(segments[1].pauseAfterMs,200);
  assert.ok(segments[1].text.endsWith('Independent verification'));
  assert.match(segments[2].text,/means checking through a separate contact method/);
  a.fire(a.get('play'));a.end();a.advance(400);
  assert.ok(a.active().text.endsWith('Independent verification'));
  a.end();const count=a.spoken.length;a.advance(199);assert.equal(a.spoken.length,count);
  a.advance(1);assert.match(a.active().text,/means checking through a separate contact method/);
  a.fire(a.get('stop'));assert.equal(a.active(),null);
  assert.equal(a.writes.length,0);
});

test('targeted explanations include a specific independent next step in each lesson',()=>{
  const a=boot();
  assert.match(a.run('lessons[0].feedback[0]'),/number on your bank card/);
  for(const choice of [1,2])assert.match(a.run('optionalPractice[1].choices['+choice+'][2]'),/Daniel’s previously saved number or another trusted family member before paying/);
  assert.match(a.run('lessons[2].feedback[1]'),/dial the number on your Medicare card/);
  assert.match(a.run('optionalPractice[2].feedback[1]'),/End the call and dial the number on your Medicare card yourself/);
  assert.match(a.run('optionalPractice[3].choices[2][2]'),/End the call and contact support using your device documentation or a website you already trust/);
  assert.match(a.run('optionalPractice[4].choices[1][2]'),/Open your usual store account or delivery app yourself/);
  a.run('openLesson(0)');
  for(const id of ['bank-email-urgency-detail','bank-text-request-detail','simulation-sender-detail','simulation-destination-detail','simulation-pressure-detail'])
    assert.match(a.get(id).textContent,/number on your bank card/);
});

test('actual markup provides a labelled main landmark, focusable skip target and unique IDs', () => {
  const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map(match => match[1]);
  assert.equal(ids.length, new Set(ids).size);
  assert.match(html, /<main id="main" tabindex="-1">/);
  assert.match(html, /class="skip" href="#main"/);
  const a = boot();
  assert.equal(a.run('current'), -1);
  assert.equal(a.get('lesson').hidden, true);
  assert.equal(a.get('lesson-cards').querySelectorAll('article').length, 5);
  assert.equal(a.get('progress').textContent, '0 of 5 lessons completed.');
});

for (let index = 0; index < 5; index++) {
  test('lesson ' + (index + 1) + ': original question, every answer, feedback and completion', () => {
    const a = boot();
    const lesson = a.run('lessons[' + index + ']');
    assert.equal(lesson.correct, mainCorrect[index]);
    assert.equal(lesson.answers.length, 3);
    assert.equal(lesson.feedback.length, 3);
    a.run('openLesson(' + index + ')');
    assert.equal(a.get('lesson-title').textContent, lesson.title);
    assert.equal(a.get('question').textContent, lesson.question);
    assert.ok(a.get('lesson-scenario').textContent.includes(lesson.scenario));
    a.fire(a.get('quiz'), 'submit');
    assert.match(a.get('feedback').textContent, /^Select an answer/);
    assert.equal(a.run('completed.size'), 0);
    for (let answer = 0; answer < 3; answer++) {
      const fresh = boot();
      fresh.selectMain(index, answer);
      assert.ok(fresh.get('feedback').textContent.includes(lesson.feedback[answer]));
      assert.equal(fresh.get('feedback').hidden, false);
      assert.equal(fresh.run('completed.size'), answer === mainCorrect[index] ? 1 : 0);
      assert.equal(fresh.get('next').hidden, answer !== mainCorrect[index]);
      if (answer === mainCorrect[index]) {
        assert.ok(fresh.get('feedback').textContent.includes(lesson.takeaway));
        assert.ok(fresh.get('lesson-completion').textContent.includes('Lesson completed!'));
        assert.equal(fresh.get('next').textContent, index === 4 ? 'Return to all lessons' : 'Next lesson');
      }
    }
  });
  test('lesson ' + (index + 1) + ': every warning-sign selection combination, retries and no completion', () => {
    const a = boot();
    a.run('openLesson(' + index + ')');
    const data = a.run('optionalPractice[' + index + ']'), p = a.practice('warning');
    assert.equal(p.summary.textContent, 'Practice spotting the warning signs');
    assert.ok(p.form.querySelector('legend'));
    assert.ok(p.inputs.every(input => input.type === 'checkbox' && input.parentElement.tagName === 'LABEL'));
    assert.equal(p.feedback.getAttribute('role'), 'status');
    assert.equal(p.feedback.getAttribute('aria-atomic'), 'true');
    for (let mask = 0; mask < 2 ** p.inputs.length; mask++) {
      p.inputs.forEach((input, i) => { input.checked = Boolean(mask & (1 << i)); });
      a.fire(p.form, 'submit');
      const correct = data.choices.every((choice, i) => choice[1] === p.inputs[i].checked);
      assert.ok(p.feedback.textContent.startsWith(correct ? 'You identified the warning signs.' : 'Let’s review the details.'));
      data.choices.forEach(choice => assert.ok(p.feedback.textContent.includes(choice[2])));
      assert.ok(p.feedback.textContent.includes(data.closing));
    }
    a.fire(p.buttons[1]);
    assert.ok(p.inputs.every(input => !input.checked));
    assert.equal(p.feedback.hidden, true);
    assert.equal(a.focused(), p.inputs[0]);
    assert.equal(a.run('completed.size'), 0);
    assert.equal(a.writes.length, 0);
  });
  test('lesson ' + (index + 1) + ': all follow-up answers and empty submissions remain optional', () => {
    const a = boot();
    a.run('openLesson(' + index + ')');
    const data = a.run('optionalPractice[' + index + ']'), p = a.practice('followup');
    assert.equal(data.correct, followupCorrect[index]);
    assert.equal(p.summary.textContent, 'Try another situation');
    assert.ok(p.inputs.every(input => input.type === 'radio' && input.parentElement.tagName === 'LABEL'));
    a.fire(p.form, 'submit');
    assert.match(p.feedback.textContent, /^Select a response/);
    for (let answer = 0; answer < 3; answer++) {
      p.inputs.forEach((input, i) => { input.checked = i === answer; });
      a.fire(p.form, 'submit');
      assert.equal(p.feedback.textContent,
        (answer === followupCorrect[index] ? 'This is the safest response. ' : 'Let’s consider a safer next step. ') + data.feedback[answer]);
    }
    assert.equal(a.run('completed.size'), 0);
    assert.equal(a.writes.length, 0);
    assert.equal(a.get('next').hidden, true);
  });
  test('lesson ' + (index + 1) + ': direct, same-hash, repeated and keyboard click routing', () => {
    const a = boot({ hash: '#lesson-' + (index + 1) });
    const scrolls = a.get('lesson').scrollCalls;
    assert.equal(a.run('current'), index);
    assert.equal(a.lessonClick(index, { detail: 0 }).defaultPrevented, true);
    assert.equal(a.get('lesson').scrollCalls, scrolls + 1);
    assert.equal(a.focused(), a.get('lesson-title'));
    a.lessonClick(index);
    assert.equal(a.get('lesson').scrollCalls, scrolls + 2);
    a.fire(a.get('next'));
    assert.equal(a.run('location.hash'), index === 4 ? '#lessons' : '#lesson-' + (index + 2));
  });
}

test('completed cards restore accessible, numbered links; reviews and incorrect retries do not remove completion', () => {
  const data = new Map(), a = boot({ data });
  for (let i = 0; i < 5; i++) a.selectMain(i, mainCorrect[i]);
  assert.equal(a.get('progress').textContent, '5 of 5 lessons completed.');
  const refreshed = boot({ data });
  const states = refreshed.get('lesson-cards').querySelectorAll('[data-lesson-progress]');
  states.forEach((state, i) => {
    assert.equal(state.textContent, '✓ Lesson completed');
    assert.equal(state.querySelector('span').getAttribute('aria-hidden'), 'true');
    assert.equal(state.parentElement.querySelector('a').textContent, 'Review lesson ' + (i + 1));
  });
  refreshed.selectMain(0, 0);
  assert.equal(refreshed.run('completed.size'), 5);
  assert.match(refreshed.get('lesson-completion').textContent, /You can revisit this lesson anytime/);
  assert.equal(boot().run('completed.size'), 0);
  assert.equal(refreshed.run('audioEnabled'), false);
  assert.equal(refreshed.run('size'), 100);
  assert.deepEqual(Object.keys(JSON.parse(data.get(key))).sort(), ['completed', 'version']);
});

for (const invalid of ['bad json', 'null', '[]', '{}', '{"version":2,"completed":[]}',
  '{"version":1,"completed":[0]}', '{"version":1,"completed":["unknown"]}',
  '{"version":1,"completed":"bank-impersonation"}',
  '{"version":1,"completed":["bank-impersonation","family-emergency","government-calls","technical-support","delivery-shopping","extra"]}']) {
  test('invalid stored progress is ignored without deleting data: ' + invalid, () => {
    const data = new Map([[key, invalid], ['unrelated', 'preserve']]);
    const a = boot({ data });
    assert.equal(a.run('completed.size'), 0);
    assert.equal(data.get(key), invalid);
    assert.equal(a.writes.length, 0);
    a.selectMain(0, 1);
    assert.deepEqual(JSON.parse(data.get(key)), { version: 1, completed: ['bank-impersonation'] });
    assert.equal(data.get('unrelated'), 'preserve');
  });
}
for (const option of ['noStorage', 'storageThrows', 'readThrows', 'writeThrows']) {
  test('storage failure ' + option + ' preserves usable in-memory completion', () => {
    const a = boot({ [option]: true, data: new Map([['unrelated', 'preserve']]) });
    a.selectMain(0, 1);
    assert.equal(a.run('completed.size'), 1);
    assert.match(a.get('progress-storage').textContent, /could not be saved/);
    assert.equal(a.data.get('unrelated'), 'preserve');
  });
}
test('interleaved tabs merge progress and valid storage events update cards without writes or audio', () => {
  const data = new Map(), a = boot({ data }), b = boot({ data });
  a.selectMain(0, 1); b.selectMain(1, 0);
  assert.deepEqual(JSON.parse(data.get(key)).completed, ['bank-impersonation', 'family-emergency']);
  const writes = a.writes.length;
  a.dispatch('storage', { key, storageArea: a.storage, newValue: data.get(key) });
  assert.equal(a.run('completed.size'), 2);
  assert.equal(a.writes.length, writes);
  assert.equal(a.spoken.length, 0);
  for (const event of [
    { key: 'unrelated', storageArea: a.storage, newValue: data.get(key) },
    { key, storageArea: {}, newValue: data.get(key) },
    { key, storageArea: a.storage, newValue: 'bad json' },
    { key, storageArea: a.storage, newValue: null }
  ]) a.dispatch('storage', event);
  assert.equal(a.run('completed.size'), 2);
  assert.ok([...a.reads, ...a.writes].every(name => name === key));
});
test('skip navigation targets main and stops audio without scrolling Home', () => {
  const a = boot({ hash: '#lesson-1' });
  a.fire(a.get('play')); const stale = a.active();
  a.run("location.hash='#main'"); a.dispatch('hashchange');
  assert.equal(a.focused(), a.get('main'));
  assert.equal(a.get('main').scrollCalls, 1);
  assert.equal(a.get('home').scrollCalls || 0, 0);
  assert.equal(a.get('lesson').hidden, true);
  stale.onend(); a.advance(1000);
  assert.equal(a.active(), null);
});
test('clean URL, invalid hashes, section navigation and Back/Forward-style changes', () => {
  const a = boot();
  a.lessonClick(1); assert.equal(a.run('current'), 1);
  a.run("location.hash='#lesson-1'"); a.dispatch('hashchange'); assert.equal(a.run('current'), 0);
  a.run("location.hash='#lesson-2'"); a.dispatch('hashchange'); assert.equal(a.run('current'), 1);
  for (const hash of ['#lesson-0', '#lesson-6', '#lesson-01', '#lesson-999999999999999999', '#help', '#lessons']) {
    a.run('location.hash=' + JSON.stringify(hash)); a.dispatch('hashchange');
    assert.equal(a.get('lesson').hidden, true);
  }
});
test('modified or previously prevented same-hash clicks are not hijacked', () => {
  const a = boot({ hash: '#lesson-1' }), scrolls = a.get('lesson').scrollCalls;
  for (const extra of [{ ctrlKey: true }, { metaKey: true }, { shiftKey: true }, { altKey: true }, { button: 1 }, { defaultPrevented: true }]) {
    a.lessonClick(0, extra);
    assert.equal(a.get('lesson').scrollCalls, scrolls);
  }
});
test('150% text size bounds and mobile disclosure focus model', () => {
  const a = boot({ width: 320 });
  for (let i = 0; i < 10; i++) a.fire(a.get('larger'));
  assert.equal(a.get('size-label').textContent, '150%');
  assert.equal(a.document.documentElement.style.fontSize, '30px');
  assert.equal(a.get('larger').disabled, true);
  a.fire(a.get('menu-toggle'));
  assert.equal(a.get('main-navigation').hidden, false);
  a.dispatch('document:keydown', { key: 'Escape' });
  assert.equal(a.get('main-navigation').hidden, true);
  assert.equal(a.focused(), a.get('menu-toggle'));
});

for (const mode of [{ noSpeech: true }, { missingConstructor: true },
  ...['getVoices', 'speak', 'cancel', 'pause', 'resume'].map(missingMethod => ({ missingMethod }))]) {
  test('partial/unavailable speech API is safely guarded: ' + JSON.stringify(mode), () => {
    const a = boot(mode); a.run('openLesson(0)');
    a.fire(a.get('play'));
    assert.equal(a.spoken.length, 0);
    assert.match(a.get('audio-status').textContent, /not available/);
    a.selectMain(0, 1);
    assert.equal(a.get('feedback').hidden, false);
    a.fire(a.get('stop'));
  });
}
test('voice filtering never speaks remote or non-English voices; timeout retains written text', () => {
  const a = boot({ voices: [{ lang: 'en-US', localService: false }, { lang: 'fr-FR', localService: true }] });
  a.run('openLesson(0)'); a.fire(a.get('play')); a.advance(5000);
  assert.equal(a.spoken.length, 0);
  assert.match(a.get('audio-status').textContent, /not currently available/);
  assert.equal(a.timers.size, 0);
  assert.equal(a.pendingVoiceListeners(), 0);
});
test('delayed voices, Pause while loading, Resume and duplicate events start once', () => {
  const a = boot({ voices: [] });
  a.run('openLesson(0)'); a.fire(a.get('play')); a.advance(1000); a.fire(a.get('pause'));
  a.setVoices([{ lang: 'en-GB', localService: true }]); a.voicesChanged(); a.advance(10000);
  assert.equal(a.spoken.length, 0);
  a.fire(a.get('play')); a.voicesChanged(); a.advance(1000);
  assert.equal(a.spoken.length, 1);
  assert.equal(a.active().lang, 'en-GB');
  assert.equal(a.active().rate, .9);
});
test('Stop and navigation cancel pending voice retries and stale callbacks', () => {
  for (const navigation of [false, true]) {
    const a = boot({ voices: [] }); a.run('openLesson(0)'); a.fire(a.get('play'));
    if (navigation) a.lessonClick(1); else a.fire(a.get('stop'));
    a.setVoices([{ lang: 'en-US', localService: true }]); a.voicesChanged(); a.advance(10000);
    assert.equal(a.spoken.length, 0); assert.equal(a.timers.size, 0);
  }
});
test('Lesson 1 teaching retains title and term pauses before exploration', () => {
  const a = boot(); a.run('openLesson(0)'); a.fire(a.get('play'));
  assert.equal(a.active().text, a.run('lessons[0].title'));
  a.end(); a.advance(399); assert.equal(a.spoken.length, 1);
  a.advance(1); assert.equal(a.spoken.length, 2);
  a.end(); a.advance(199); assert.equal(a.spoken.length, 2);
  a.advance(1); assert.equal(a.spoken.length, 3);
  for(let i=0;i<150 && a.run('speechSession !== null');i++){if(a.active())a.end();a.advance(500);}
  assert.equal(a.run('lessonAudio.index'),2);
  assert.equal(a.run('lessonAudio.waiting'),true);
  assert.equal(a.run('speechSession'),null);
  assert.equal(a.focused(),a.get('lesson-title'));
});
for (const kind of ['warning', 'followup']) {
  test(kind + ': current heading and 400ms gap, Pause/Play preserve remaining time', () => {
    const a = boot(); a.run('openLesson(0)'); const p = a.practice(kind);
    a.fire(p.buttons[2]); assert.equal(a.active().text, p.summary.textContent);
    a.end(); a.advance(100); a.fire(a.get('pause')); a.advance(5000);
    assert.equal(a.spoken.length, 1);
    a.fire(a.get('play')); a.advance(299); assert.equal(a.spoken.length, 1);
    a.advance(1); assert.equal(a.spoken.length, 2);
    assert.ok(a.active().text.startsWith(kind === 'warning' ? 'Select the details' : 'Choose one response'));
    const body = a.active(); a.fire(a.get('pause')); a.fire(a.get('play'));
    assert.equal(a.active(), body);
  });
  test(kind + ': rapid readings, Stop, skip, retries and navigation cancel stale continuations', () => {
    const a = boot(); a.run('openLesson(0)'); const p = a.practice(kind);
    a.fire(p.buttons[2]); const old = a.end();
    for (let i = 0; i < 12; i++) a.fire(p.buttons[2]);
    const last = a.active(); old.onend(); a.advance(1000);
    assert.equal(a.active(), last);
    a.end(); a.fire(a.get('stop')); a.advance(1000);
    assert.equal(a.active(), null); assert.equal(a.get('audio-status').textContent, '');
    for (const button of [p.buttons[1], p.buttons[3]]) {
      a.fire(p.buttons[2]); a.fire(button); assert.equal(a.active(), null);
    }
    a.fire(p.buttons[2]); a.lessonClick(1); a.advance(1000);
    assert.equal(a.active(), null);
  });
}
for (const synchronous of [false, true]) {
  test('completion during Pause cannot start the next segment; synchronous=' + synchronous, () => {
    const a = boot({ endDuringPause: synchronous }); a.run('openLesson(0)'); a.fire(a.get('play'));
    const heading = a.active(); a.fire(a.get('pause')); if (!synchronous) a.end();
    heading.onend(); a.advance(10000); assert.equal(a.spoken.length, 1);
    a.fire(a.get('play')); a.advance(400); assert.equal(a.spoken.length, 2);
  });
}
test('quiet feedback, selected audio preference, repeated answers and Stop semantics', () => {
  const a = boot(); a.selectMain(0, 0);
  assert.equal(a.spoken.length, 0);
  a.fire(a.get('read-explanation')); assert.equal(a.active().text, a.get('feedback').textContent);
  const stale = a.active(); a.fire(a.get('stop'));
  assert.equal(a.run('audioEnabled'), true);
  a.get('answers').querySelectorAll('input').forEach((input, i) => { input.checked = i === 1; });
  a.fire(a.get('quiz'), 'submit'); stale.onend();
  assert.equal(a.active().text, a.get('feedback').textContent);
  assert.equal(a.active().text.includes('Lesson completed!'), false);
  a.run('openLesson(1)'); assert.equal(a.active(), null); assert.equal(a.run('audioEnabled'), false);
});
test('speech errors and pagehide clean up safely without losing visible explanation', () => {
  for (const option of ['voicesThrow', 'speakThrows']) {
    const a = boot({ [option]: true }); a.run('openLesson(0)'); a.fire(a.get('play'));
    assert.equal(a.active(), null); assert.match(a.get('audio-status').textContent, /unavailable/);
  }
  const a = boot(); a.selectMain(0, 1); a.fire(a.get('read-explanation')); const stale = a.active();
  a.dispatch('pagehide'); stale.onend(); a.advance(1000);
  assert.equal(a.active(), null); assert.equal(a.get('feedback').hidden, false);
});
