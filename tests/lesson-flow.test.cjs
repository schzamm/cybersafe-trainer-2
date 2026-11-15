'use strict';
const {test} = require('node:test');
const assert = require('node:assert/strict');
const {boot} = require('./helpers/app-harness.cjs');
function open(options){const a=boot(options);a.run('openLesson(0)');return a;}
function drain(a){for(let i=0;i<150 && a.run('speechSession !== null');i++){if(a.active())a.end();a.advance(500);}}
test('Lesson 1 is a continuous page with no Continue controls or gated activities',()=>{
 const a=open();
 for(const id of ['guided-controls','lesson-continue'])
   assert.equal(a.document.getElementById(id),null);
 for(const id of ['bank-examples','bank-email-heading','bank-text-heading','simulation-content','lesson-scenario','quiz'])
   assert.equal(a.get(id).hidden,false);
 assert.equal(a.get('phishing-simulation').querySelectorAll('details').length,0);
 assert.match(a.get('bank-email-instructions').textContent,/Use the Investigate buttons/);
 assert.match(a.get('bank-text-instructions').textContent,/Use the Investigate buttons/);
 assert.equal(a.spoken.length,0);
 a.fire(a.get('bank-email-sender'));assert.equal(a.get('bank-email-sender-detail').hidden,false);
 assert.equal(a.spoken.length,0);assert.equal(a.writes.length,0);
});
test('teaching audio follows page order, waits for exploration, and never reads messages or clues automatically',()=>{
 const a=open();const focus=a.focused();const hash=a.run('location.hash');
 a.fire(a.get('play'));drain(a);
 for(const index of [2,3,4]) {
   assert.equal(a.run('lessonAudio.index'),index);assert.equal(a.run('lessonAudio.waiting'),true);
   assert.equal(a.get('play').textContent,'Continue lesson');
   const count=a.spoken.length;a.advance(10000);assert.equal(a.spoken.length,count);
   a.fire(a.get('play'));drain(a);
 }
 assert.equal(a.run('lessonAudio.finished'),true);
 const text=a.spoken.map(s=>s.text).join(' ');
 let previous=-1;for(const heading of ['Warning signs.',"Let's check two examples.",'The second example is a bank fraud text about an unfamiliar purchase.',"Now let's investigate another suspicious email.",'Lesson scenario.','Main question.']){
   const position=text.indexOf(heading);assert.ok(position>previous,heading);previous=position;
 }
 assert.doesNotMatch(text,/786.42|alerts@northbridge-access|Scammers use YES|northbridge-check.example/);
 for(const id of ['bank-email-sender-detail','bank-text-request-detail','simulation-sender-detail'])assert.equal(a.get(id).hidden,true);
 assert.equal(a.focused()===focus,true);assert.equal(a.run('location.hash'),hash);
 assert.equal(a.writes.length,0);assert.equal(a.run('completed.size'),0);
});
test('Read Example is optional and returns to exploration without losing the lesson bookmark',()=>{
 const a=open();a.fire(a.get('play'));drain(a);
 for(const [id,index,phrase] of [['bank-email-read',2,'alerts@northbridge-access.example'],['bank-text-read',3,'$786.42'],['simulation-read',4,'Please verify your account today']]){
   assert.equal(a.run('lessonAudio.index'),index);
   const start=a.spoken.length;a.fire(a.get(id));drain(a);
   const text=a.spoken.slice(start).map(s=>s.text).join(' ');
   assert.ok(text.includes(phrase));assert.doesNotMatch(text,/Compare the part after @|Scammers use YES|northbridge-check.example/);
   assert.equal(a.run('lessonAudio.index'),index);
   assert.equal(a.run('lessonAudio.waiting'),true);assert.equal(a.get('play').textContent,'Continue lesson');
   a.fire(a.get('play'));drain(a);
 }
});
test('highlight and scroll occur once per narrated section and never move focus',()=>{
 const a=open();const focus=a.focused();
 a.fire(a.get('play'));const target=a.get('lesson-introduction');
 assert.equal(target.getAttribute('data-narrating'),'true');assert.equal(target.scrollCalls,1);
 a.end();a.advance(400);assert.equal(target.scrollCalls,1);
 a.fire(a.get('pause'));a.fire(a.get('play'));assert.equal(target.scrollCalls,1);
 a.fire(a.get('stop'));assert.equal(target.getAttribute('data-narrating'),'false');
 assert.equal(a.focused()===focus,true);
 const b=open({reducedMotion:true});b.fire(b.get('play'));assert.equal(b.get('lesson-introduction').lastScrollOptions.behavior,'instant');
});
test('Stop during example reading returns to exploration; Pause resumes the example',()=>{
 const a=open();a.fire(a.get('play'));drain(a);a.fire(a.get('bank-email-read'));
 const example=a.active();a.fire(a.get('pause'));a.fire(a.get('play'));assert.equal(a.active()===example,true);
 a.fire(a.get('stop'));assert.equal(a.get('play').textContent,'▶ Play');
 assert.equal(a.get('bank-email-panel').getAttribute('data-narrating'),'false');
 a.fire(a.get('play'));assert.equal(a.run('lessonAudio.index'),2);
});
test('Read Example during an exercise introduction enters exploration without repeating the introduction',()=>{
 const a=open();a.run('lessonAudio.index=2');a.fire(a.get('play'));
 a.fire(a.get('bank-email-read'));drain(a);
 assert.equal(a.run('lessonAudio.waiting'),true);
 assert.equal(a.get('play').textContent,'Continue lesson');
 a.fire(a.get('play'));assert.equal(a.run('lessonAudio.index'),3);
});
test('rapid examples, stale callbacks, Stop and navigation cannot restart or overlap readings',()=>{
 const a=open();a.fire(a.get('play'));const stale=a.active();
 for(let i=0;i<8;i++)a.fire(a.get(i%2?'bank-email-read':'bank-text-read'));
 const active=a.active();stale.onend();a.advance(1000);assert.equal(a.active()===active,true);
 a.fire(a.get('stop'));a.advance(10000);assert.equal(a.active(),null);
 const oldButton=a.get('bank-email-read');
 a.fire(a.get('play'));a.lessonClick(1);a.fire(oldButton);a.advance(10000);assert.equal(a.active(),null);assert.equal(a.run('lessonAudio.lesson'),1);
});
test('a final onend during Pause cannot advance to another teaching section',()=>{
 for(const synchronous of [false,true]){
  const a=open({endDuringPause:synchronous});a.run("lessonAudio.sections[0].segments=[{text:'Opening.',pauseAfterMs:0}]");
  a.fire(a.get('play'));a.fire(a.get('pause'));if(!synchronous)a.end();a.advance(10000);
  assert.equal(a.run('lessonAudio.index'),0);assert.equal(a.spoken.length,1);
  a.fire(a.get('play'));assert.equal(a.run('lessonAudio.index'),1);
 }
});
test('Play does not overlap; Pause resumes; Stop cancels and a new Play starts the lesson',()=>{
 const a=open();a.fire(a.get('play'));const first=a.active();
 for(let i=0;i<10;i++)a.fire(a.get('play'));assert.equal(a.spoken.length,1);
 a.fire(a.get('pause'));a.advance(10000);a.fire(a.get('play'));assert.equal(a.active(),first);
 a.fire(a.get('stop'));assert.equal(a.active(),null);assert.equal(a.get('audio-status').textContent,'');
 a.advance(10000);assert.equal(a.spoken.length,1);
 a.fire(a.get('play'));assert.equal(a.active().text,first.text);const current=a.active();first.onend();assert.equal(a.active(),current);
});
test('heading gaps pause and resume without navigation or visibility changes',()=>{
 const a=open();a.fire(a.get('play'));a.end();a.advance(100);a.fire(a.get('pause'));const count=a.spoken.length;
 a.advance(5000);a.fire(a.get('play'));a.advance(299);assert.equal(a.spoken.length,count);a.advance(1);assert.equal(a.spoken.length,count+1);
 assert.equal(a.get('simulation-content').hidden,false);
});
test('selected clues alone narrate explanations; closing or resetting cancels reading',()=>{
 const a=open();a.fire(a.get('bank-email-sender'));assert.equal(a.spoken.length,0);
 a.fire(a.get('play'));a.fire(a.get('bank-text-request'));assert.match(a.active().text,/Scammers use YES\/NO/);
 const clue=a.active();a.fire(a.get('pause'));a.fire(a.get('play'));assert.equal(a.active(),clue);
 a.fire(a.get('bank-text-request'));assert.equal(a.active(),null);
 a.fire(a.get('simulation-sender'));assert.match(a.active().text,/Compare the part after @/);
 a.fire(a.get('simulation-reset'));assert.equal(a.active(),null);assert.equal(a.get('simulation-content').hidden,false);
});
test('delayed voice loading and stale callbacks never change layout or restart after Stop/navigation',()=>{
 const a=open({voices:[]});a.fire(a.get('play'));a.fire(a.get('pause'));
 a.setVoices([{lang:'en-US',localService:true}]);a.voicesChanged();a.advance(5000);assert.equal(a.spoken.length,0);
 a.fire(a.get('play'));const old=a.active();assert.ok(old);
 a.fire(a.get('stop'));old.onend();a.advance(10000);assert.equal(a.active(),null);
 assert.equal(a.get('simulation-content').hidden,false);
 a.fire(a.get('play'));a.lessonClick(1);a.advance(10000);assert.equal(a.active(),null);
});
test('Lessons 2–5 retain their original full readings and completion rules',()=>{
 for(let i=1;i<5;i++){const a=boot();a.run('openLesson('+i+')');a.fire(a.get('play'));drain(a);
 assert.equal(a.spoken.map(s=>s.text).join(''),a.run(`lessonSpeechSegments(lessons[${i}],${i},'').map(s=>s.text).join('')`));
 assert.equal(a.get('phishing-simulation').hidden,true);assert.equal(a.run('completed.size'),0);}
});
test('Lesson 1 quiz starts expanded and collapse preserves selected answers, feedback and completion',()=>{
 const a=open();
 assert.equal(a.get('lesson-one-quiz').open,true);
 assert.equal(a.get('lesson-one-quiz-toggle').textContent,'Lesson 1 Quiz — Check Your Knowledge');
 assert.equal(a.get('audio-status').textContent,'Select Play to listen to this lesson. You can pause or stop the narration at any time.');
 assert.doesNotMatch(a.get('bank-examples').textContent,/These fictional examples are optional/);
 a.selectMain(0,1);const selected=a.get('quiz').querySelector('input:checked');
 const feedback=a.get('feedback').textContent;const writes=a.writes.length;
 a.get('lesson-one-quiz').open=false;a.get('lesson-one-quiz').open=true;
 assert.equal(a.get('quiz').querySelector('input:checked'),selected);
 assert.equal(a.get('feedback').textContent,feedback);assert.equal(a.run('completed.size'),1);
 assert.equal(a.writes.length,writes);
 a.get('lesson-one-quiz').open=false;a.fire(a.get('play'));drain(a);
 assert.equal(a.get('lesson-one-quiz').open,false);
 assert.equal(a.writes.length,writes);
 for(let i=1;i<5;i++){a.run('openLesson('+i+')');assert.equal(a.document.getElementById('lesson-one-quiz'),null);assert.ok(a.get('quiz'));}
});

test('a collapsed quiz stays closed while its visible heading is highlighted',()=>{
 const a=open();a.get('lesson-one-quiz').open=false;
 a.run("lessonAudio.index=lessonAudio.sections.findIndex(s=>s.target==='quiz')");a.fire(a.get('play'));
 assert.equal(a.get('lesson-one-quiz').open,false);
 assert.equal(a.get('lesson-one-quiz-toggle').getAttribute('data-narrating'),'true');
 assert.equal(a.get('quiz').getAttribute('data-narrating'),null);
});
test('floating player appears only after audio activation and remains during pauses and exploration',()=>{
 const a=open();assert.equal(a.get('floating-player').hidden,true);
 a.fire(a.get('play'));assert.equal(a.get('floating-player').hidden,false);
 assert.equal(a.document.documentElement.getAttribute('data-audio-player'),'open');
 assert.equal(a.get('floating-toggle').textContent,'Pause');
 a.fire(a.get('floating-toggle'));assert.equal(a.get('floating-toggle').textContent,'Play');
 assert.equal(a.get('floating-player').hidden,false);
 a.fire(a.get('floating-toggle'));drain(a);
 assert.equal(a.get('floating-toggle').textContent,'Continue lesson');
 a.fire(a.get('bank-email-sender'));a.fire(a.get('bank-email-sender'));
 assert.equal(a.get('floating-player').hidden,false);
 a.fire(a.get('floating-toggle'));assert.equal(a.run('lessonAudio.index'),3);
 a.get('floating-stop').focus();a.fire(a.get('floating-stop'));
 assert.equal(a.get('floating-player').hidden,true);
 assert.equal(a.document.documentElement.getAttribute('data-audio-player'),'closed');
 assert.equal(a.focused()===a.get('play'),true);
 const count=a.spoken.length;a.advance(10000);assert.equal(a.spoken.length,count);
});
test('Read Example activates the same player and navigating away closes it',()=>{
 const a=open();a.fire(a.get('bank-text-read'));
 assert.equal(a.get('floating-player').hidden,false);assert.match(a.active().text,/Simulated text/);
 a.lessonClick(1);assert.equal(a.get('floating-player').hidden,true);assert.equal(a.active(),null);
});
test('the three exercise introductions use exactly the approved wording and retain exploration pauses',()=>{
 const a=open();
 const expected=[
  "Let's check two examples. These examples are safe to explore. The first is an account sign-in email. Use the Investigate buttons to look for warning signs.",
  'The second example is a bank fraud text about an unfamiliar purchase. Use the Investigate buttons to examine the sender and the reply request.',
  "Now let's investigate another suspicious email. Examine the sender, link, and warning signs. Then decide whether you would trust or report the message."
 ];
 for(let i=0;i<3;i++){
  const text=a.run('lessonAudio.sections['+(i+2)+'].segments.map(s=>s.text).join(" ")').replace(/\s+/g,' ').trim();
  assert.equal(text,expected[i]);
  assert.equal(a.run('lessonAudio.sections['+(i+2)+'].exercise'),true);
 }
 assert.match(a.get('phishing-simulation').textContent,/northbridge\.example/);
 a.fire(a.get('play'));drain(a);
 assert.equal(a.run('lessonAudio.waiting'),true);
 assert.equal(a.get('floating-toggle').textContent,'Continue lesson');
 assert.ok(a.get('bank-email-read'));assert.ok(a.get('bank-text-read'));assert.ok(a.get('simulation-read'));
});
for(let lesson=0;lesson<5;lesson++){
 test('lesson '+(lesson+1)+': shared Read from uses visible headings, cancels speech and retains the selection after Stop',()=>{
  const a=boot();a.run('openLesson('+lesson+')');
  const labels=a.get('read-from').children.map(option=>option.textContent);
  assert.equal(labels[0],a.get('lesson-title').textContent);
  assert.ok(labels.includes('Warning signs'));assert.ok(labels.includes('Scenario'));
  assert.ok(labels.includes('Practice spotting the warning signs'));assert.ok(labels.includes('Try another situation'));
  assert.deepEqual(a.get('floating-read-from').children.map(option=>option.textContent),labels);
  const scenario=a.run("lessonAudio.sections.findIndex(s=>s.target==='lesson-scenario')");
  a.get('read-from').value=String(scenario);a.fire(a.get('read-from'),'change');
  assert.equal(a.get('floating-player').hidden,true);assert.equal(a.spoken.length,0);
  a.fire(a.get('play'));const old=a.active();assert.equal(a.get('floating-player').hidden,false);
  a.fire(a.get('pause'));const quiz=a.run("lessonAudio.sections.findIndex(s=>s.target==='quiz')");
  a.get('floating-read-from').focus();a.get('floating-read-from').value=String(quiz);a.fire(a.get('floating-read-from'),'change');
  assert.equal(a.active(),null);assert.equal(a.get('floating-toggle').textContent,'Play');
  assert.equal(a.get('floating-player').hidden,false);
  old.onend();a.advance(10000);assert.equal(a.active(),null);
  assert.equal(a.get('read-from').value,String(quiz));
  assert.equal(a.focused()===a.get('floating-read-from'),true);
  a.fire(a.get('floating-toggle'));assert.ok(a.active());
  a.fire(a.get('floating-stop'));assert.equal(a.get('floating-player').hidden,true);
  assert.equal(a.get('read-from').value,String(quiz));assert.equal(a.get('floating-read-from').value,String(quiz));
  assert.equal(a.run('lessonAudio.index'),quiz);
  a.advance(10000);assert.equal(a.active(),null);a.fire(a.get('play'));assert.ok(a.active());
  assert.equal(a.writes.length,0);assert.equal(a.run('completed.size'),0);
 });
 test('lesson '+(lesson+1)+': Skip this practice selects the quiz without starting narration or hiding an active player',()=>{
  const a=boot();a.run('openLesson('+lesson+')');
  const practice=a.practice('warning');a.fire(practice.buttons[2]);const old=a.active();
  assert.equal(a.get('floating-player').hidden,false);
  a.fire(practice.buttons[3]);old.onend();a.advance(10000);
  assert.equal(a.active(),null);assert.equal(a.run('lessonAudio.sections[lessonAudio.index].target'),'quiz');
  assert.equal(a.get('floating-player').hidden,false);assert.equal(a.get('floating-toggle').textContent,'Play');
  a.fire(a.get('floating-toggle'));assert.ok(a.active());
  assert.equal(a.writes.length,0);
 });
}
test('selection during voice loading cancels retries; Stop does not forget or advance an exercise selection',()=>{
 const a=open({voices:[]});a.fire(a.get('play'));
 a.get('read-from').value='2';a.fire(a.get('read-from'),'change');
 a.setVoices([{lang:'en-US',localService:true}]);a.voicesChanged();a.advance(10000);assert.equal(a.spoken.length,0);
 a.fire(a.get('play'));drain(a);assert.equal(a.run('lessonAudio.waiting'),true);
 a.fire(a.get('stop'));assert.equal(a.run('lessonAudio.index'),2);assert.equal(a.run('lessonAudio.waiting'),false);
 a.fire(a.get('play'));assert.equal(a.run('lessonAudio.index'),2);
});
test('collapsed optional activities stay closed when selected; only a visible heading is highlighted',()=>{
 const a=boot();a.run('openLesson(3)');
 const index=a.run("lessonAudio.sections.findIndex(s=>s.target==='browser-help-heading')");
 a.get('read-from').value=String(index);a.fire(a.get('read-from'),'change');a.fire(a.get('play'));
 assert.equal(a.get('followup-practice').querySelector('details').open,false);
 assert.equal(a.get('followup-practice-heading').getAttribute('data-narrating'),'true');
});
