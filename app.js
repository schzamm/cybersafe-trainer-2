'use strict';
const lessons = [
  {
    "title": "Recognizing Bank Impersonation Scams",
    "summary": "Learn how to identify suspicious bank messages and verify requests safely.",
    "intro": "Phishing is an attempt to obtain passwords, account details, or other personal information through deceptive messages. A text or email can display your bank’s name and still be fraudulent.",
    "signs": [
      "An unexpected message threatens to restrict or close your account unless you act immediately.",
      "A message directs you to a link to enter account details, a password, or a verification code—a temporary code used to confirm a sign-in or transaction.",
      "The sender pressures you to respond before you can verify the request independently."
    ],
    "scenario": "You receive a text or email claiming to be from your bank:\n\n\"Unusual purchase detected. Your account will close in 30 minutes. Verify your details using the link below.\"",
    "question": "What should you do next?",
    "answers": [
      "Tap the link and enter your password to keep the account open.",
      "Leave the link alone. Open your usual banking app or call the number on your bank card.",
      "Reply with your verification code to prove it is you."
    ],
    "correct": 1,
    "feedback": [
      "The deadline and threat of account closure create pressure to act before checking. The link could lead to a fraudulent sign-in page that collects your password or account details. A familiar bank name does not establish that the message is legitimate. Leave the link alone and check through your usual banking app or the number on your bank card.",
      "Your usual banking app or the number on your bank card provides an independent way to check the request. The urgent deadline, threat of account closure, and request to verify details through a link are warning signs, even when the message appears to come from your bank.",
      "A verification code may authorize access to your account or a transaction. Sharing it with the sender could give someone that access. Check the request through your bank’s usual app or a trusted phone number."
    ],
    "takeaway": "Verify unexpected bank messages through your usual banking app or a trusted phone number before taking action."
  },
  {
    "title": "Verifying Family Emergency Requests",
    "summary": "Verify a person’s identity before responding to an urgent request for money.",
    "intro": "A scammer may copy someone’s name and photo or gain access to their existing account. A familiar Messenger profile does not, by itself, confirm who is sending the message. Independent verification means checking through a separate contact method you already trust—not one supplied in the message. Use a saved number for the person or contact another trusted family member. Even a professional-looking message can be fraudulent.",
    "signs": [
      "The sender requests money urgently and asks you not to discuss the situation with anyone else.",
      "The sender avoids a phone or video call that could help verify their identity.",
      "The sender requests gift cards, a wire transfer, or another payment that may be difficult to recover."
    ],
    "scenario": "You receive a Messenger message from a profile displaying your niece Maya’s name and photo: ‘My phone broke, and I’m stranded. Please send $400 in gift cards now. Don’t tell anyone—I can’t talk.’",
    "question": "How should you verify this request before sending money?",
    "answers": [
      "Call Maya using the number you already have, or check with another trusted family member.",
      "Buy the gift cards because the profile photo looks familiar.",
      "Ask the sender for an address so you can send cash instead."
    ],
    "correct": 0,
    "feedback": [
      "Calling a number you already have provides an independent way to verify the request. If you cannot reach Maya, contact another trusted family member before sending money.",
      "A familiar photo does not verify the sender’s identity. Profiles can be copied, and existing accounts can be accessed by someone else. Confirm the request through a separate contact method.",
      "Changing the payment method does not establish who is requesting the money. Verify the person’s identity and the situation before making any payment."
    ],
    "takeaway": "Verify urgent requests through a separate contact method you already trust before sending money."
  },
  {
    "title": "Verifying Medicare and Government Calls",
    "summary": "Verify unexpected callers before sharing personal information or making payments.",
    "intro": "Someone may claim to represent Medicare or a government agency to obtain personal information or money. Caller ID—the name or number displayed on your phone—can be falsified, so it does not verify the caller’s identity.",
    "signs": [
      "An unexpected caller requests your Medicare number, Social Security number, or banking information.",
      "The caller threatens to suspend benefits or demands immediate payment.",
      "The caller requests payment by gift card or pressures you to remain on the line."
    ],
    "scenario": "An unexpected caller says: ‘I’m calling from Medicare. You need a replacement card today or your coverage will be suspended. Please confirm your Medicare number and bank details.’",
    "question": "What should you do next?",
    "answers": [
      "Share the details because the caller knows your name.",
      "Stay on the line and pay the requested fee.",
      "Hang up. Use the number on your Medicare card to check independently."
    ],
    "correct": 2,
    "feedback": [
      "Knowing your name does not establish that the caller represents Medicare. End the call and verify the request using the number on your Medicare card.",
      "An urgent payment demand and pressure to remain on the line are warning signs. End the call before sharing information or making a payment, then dial the number on your Medicare card.",
      "Using the number on your Medicare card lets you check the request independently of the caller. This helps protect your personal information while you establish whether any action is needed."
    ],
    "takeaway": "End an unexpected call and verify the request using contact information from a trusted source."
  },
  {
    "title": "Recognizing Fake Technical Support",
    "summary": "Recognize suspicious technical support requests before granting access to your device or making a payment.",
    "intro": "Technical support scams may begin with an unexpected phone call or a warning displayed on a website. Someone claiming to represent a technology company may ask to control your device or charge you to fix a problem. Remote access allows another person to view or control your device from elsewhere. Verify who you are dealing with before granting access. First, try closing the suspicious warning or browser using its normal controls. If that does not work, close the browser using Task Manager on Windows or your phone’s app switcher. When reopening the browser, avoid restoring the suspicious page. Do not call the number in the warning, download anything it recommends, or follow its instructions.",
    "signs": [
      "A website warning claims your device is infected and directs you to call a number immediately.",
      "An unexpected caller claims to have detected a problem with your computer or phone.",
      "Someone pressures you to install software or grant remote access before you can verify their identity.",
      "Payment is requested through gift cards, cryptocurrency—digital money—or another method that may be difficult to recover."
    ],
    "scenario": "While browsing a website, a warning appears: “Security alert: Viruses detected. Call our support team immediately to prevent your files from being lost.” You call the displayed number. The person answering says they represent your computer’s manufacturer. They ask you to install a remote-access program and purchase $200 in gift cards to pay for a repair.",
    "question": "What should you do before allowing access or making a payment?",
    "answers": [
      "Install the remote-access program so the person can confirm whether there is a problem.",
      "End the call and close the warning using the browser’s normal controls. If you need help, contact a support provider using contact information you obtain independently.",
      "Purchase the gift cards, but wait until after the repair to share the codes."
    ],
    "correct": 1,
    "feedback": [
      "Installing the program could allow someone to view or control your device. The warning and the person’s claim do not establish that they represent the manufacturer. Verify the support provider independently before granting access.",
      "Ending the contact gives you time to assess the situation without pressure. A website warning does not establish that your device is infected. The urgent threat, request for remote access, and gift-card payment demand are warning signs. Use contact details from your device documentation or a support website you already trust.",
      "Waiting to share the codes does not verify the person’s identity or the need for a repair. A demand to pay for technical support with gift cards is a warning sign. Verify the provider before buying anything or allowing access."
    ],
    "takeaway": "Verify technical support independently before granting remote access, installing software, or making a payment."
  },
  {
    "title": "Spotting Fake Delivery and Shopping Messages",
    "summary": "Check delivery notices and unfamiliar online stores before following links or sharing payment information.",
    "intro": "Fraudulent delivery messages and shopping offers may arrive by text, email, or social media. They may lead to a page that collects payment information or to an online store that does not deliver what it advertises. Before buying from an unfamiliar store, consider whether its prices are unusually low, look for reviews from independent sources, and check its contact information and return policy. A padlock symbol indicates an encrypted connection—it helps protect information while it travels between your browser and the website, but does not prove that the store is legitimate. A familiar logo, tracking number, or professional appearance does not establish that a message or store is legitimate.",
    "signs": [
      "An unexpected delivery message asks you to follow a link to pay a fee or correct your address.",
      "A message threatens to return a package unless you act immediately.",
      "A tracking or shopping link leads to an unfamiliar web address or one that only resembles the company’s address.",
      "An unfamiliar store offers unusually low prices, provides little contact information, or pressures you to purchase before you can check it.",
      "A page requests card details for an unexpected fee, or a seller insists on gift cards or a bank transfer."
    ],
    "scenario": "You recently ordered an item online. A text message arrives: “Delivery unsuccessful. Your parcel will be returned today unless you confirm your address and pay a $1.95 redelivery fee using the link below.” The message does not name the store where you placed your order. When you open the link, the page displays a delivery-company logo and asks for your full card number, expiration date, and card security code.",
    "question": "How should you check whether the delivery request is legitimate?",
    "answers": [
      "Close the linked page without entering information. Check your order through the store account or delivery service you normally use, using contact details obtained independently.",
      "Enter your card details because the fee is small and the page displays a delivery-company logo.",
      "Reply to the text with your order number and address so the sender can confirm the delivery."
    ],
    "correct": 0,
    "feedback": [
      "Checking through your usual account or a trusted delivery service lets you verify the request independently. The deadline, unexpected fee, and request for full card details are warning signs. A recent purchase does not establish that this particular message relates to your order.",
      "A small fee can be used to persuade you to share valuable payment information. Logos can be copied, so the page’s appearance does not verify who operates it. Check the delivery through a separate, trusted route before paying.",
      "Replying shares information without establishing who sent the message. The sender could use your order details or address to make further requests seem convincing. Check with the store or delivery service through contact details you obtain independently."
    ],
    "takeaway": "Verify delivery requests through trusted order information. Before buying from an unfamiliar store, check its web address, independent reviews, contact details, and return policy."
  }
];
const optionalPractice = [
  {
    "scenario": "An email displays your bank’s name and says:\n\n“We have identified a fee refund of $38.50 for you. Please use the link below to provide your debit card details and sign-in code so we can process it at your convenience.”\n\nThe email is polite and gives no deadline.",
    "choices": [
      [
        "The email asks for card details and a sign-in code to receive a refund.",
        true,
        "A refund offer does not establish who sent the email. Card details and a sign-in code could give someone access to your money. Check the offer through your usual banking app or the number on your bank card."
      ],
      [
        "It directs you to provide those details through a link in the email.",
        true,
        "The link is supplied by the same unverified sender. Open your usual banking app yourself or call a number you already trust rather than using the email’s route."
      ],
      [
        "The email is polite and gives you time to respond.",
        false,
        "A calm tone is not a warning sign by itself, but it also does not prove a message is genuine. Fraudulent requests can be polite and contain no urgent deadline."
      ]
    ],
    "closing": "Look at what a message asks you to do, not just how it sounds. An unexpected refund request still needs independent verification.",
    "question": "A caller says they are from your bank and that your savings are at risk. They ask you to transfer the money to a “safe account” they provide. What should you do before moving any money?",
    "answers": [
      "Ask the caller to confirm your recent transactions before following their instructions.",
      "End the call and use the number on your bank card to check the claim.",
      "Ask the caller to send the account details in writing before making the transfer."
    ],
    "correct": 1,
    "feedback": [
      "Knowledge of recent transactions does not independently establish who is calling. Do not transfer money on that basis. End the call and contact your bank using a number you already trust.",
      "Calling the number on your bank card gives you a separate way to check the claim. Do not move money to an account supplied by the caller while the request remains unverified.",
      "Written instructions from the same caller would not independently verify the request. Pause the transfer and contact your bank using the number on your card."
    ]
  },
  {
    "scenario": "A text from an unfamiliar number says:\n\n“Hi Mum, it’s Daniel. I’ve changed my number—please save this one. Could you pay my electricity bill today? My banking app isn’t working. Send it to these account details, under the name J. Ellis.”\n\nThe message uses Daniel’s usual nickname for you.",
    "choices": [
      [
        "The sender asks you to replace Daniel’s saved number before you have verified who is texting.",
        true,
        "A new-number claim can move the conversation away from contact details you already trust. Keep the saved number and use it, or another trusted contact, to check who is asking."
      ],
      [
        "The sender requests a bill payment to an unfamiliar name while saying their banking app is unavailable.",
        true,
        "The account name and explanation need checking before you send money. A believable everyday bill does not establish that Daniel made the request. Call Daniel’s previously saved number or another trusted family member before paying."
      ],
      [
        "The sender uses Daniel’s usual nickname for you.",
        false,
        "A familiar nickname is not suspicious by itself, but someone else may know it. It does not independently confirm who is using the new number. Call Daniel’s previously saved number or another trusted family member before paying."
      ]
    ],
    "closing": "An ordinary bill can be used in an impersonation attempt. Verify the person through an existing trusted route before changing contact details or making a payment.",
    "question": "You say you want to check with Daniel before paying. The sender gives you a new number for “his partner” and suggests calling it. How should you verify the request?",
    "answers": [
      "Call the partner’s new number and ask them to confirm Daniel needs the payment.",
      "Ask the sender to send a photo of the bill showing the amount and account.",
      "Use a number you already have for Daniel or another trusted family member."
    ],
    "correct": 2,
    "feedback": [
      "The new number comes from the person you are trying to verify. Someone answering it could be part of the same request. Use contact details you already have instead.",
      "A bill photo might look convincing, but it would still come from the unverified sender. Check the person’s identity through an existing trusted contact before paying.",
      "An existing trusted contact gives you an independent way to check. If you cannot reach anyone, wait before paying; the sender’s new contact details are not a substitute for verification."
    ]
  },
  {
    "scenario": "An unexpected caller offers you a free knee brace through Medicare:\n\n“There’s no payment today. Just confirm your Medicare number and we’ll arrange delivery. You don’t need to check with your doctor or call Medicare first.”\n\nThe caller knows your name and speaks in a friendly manner.",
    "choices": [
      [
        "The unexpected caller asks for your Medicare number to arrange the offer.",
        true,
        "A free offer can still be used to obtain sensitive information. Do not give your Medicare number to an unverified caller. End the call and dial the number on your Medicare card before accepting."
      ],
      [
        "The caller says there is no need to check with your doctor or Medicare.",
        true,
        "Discouraging a separate check is a warning sign. End the call and dial the number on your Medicare card to ask whether the offer is legitimate and appropriate for you."
      ],
      [
        "The caller knows your name and sounds friendly.",
        false,
        "Neither detail is a warning sign by itself, but neither verifies the caller. Someone making a fraudulent request may know your name and sound helpful."
      ]
    ],
    "closing": "An offer does not have to include a threat or a payment demand to deserve checking. Protect your Medicare number and verify unexpected offers independently.",
    "question": "You say you will call Medicare yourself. The caller replies, “There’s no need—I can transfer you to our verification department.” What should you do?",
    "answers": [
      "End the call and dial the number on your Medicare card yourself.",
      "Accept the transfer because a second person can confirm the request.",
      "Ask the caller to read your name back to you."
    ],
    "correct": 0,
    "feedback": [
      "Dialing a trusted number yourself gives you an independent connection. You do not have to remain on the original call.",
      "A transfer arranged by the unverified caller stays within the same contact. A second voice does not make it independent. End the call and dial the number on your Medicare card yourself.",
      "Knowing your name does not establish the caller’s identity or authority. Use the number on your Medicare card."
    ]
  },
  {
    "scenario": "An unexpected caller says:\n\n“I’m from your computer support team. We’re carrying out a routine update. Please install this screen-sharing program so I can do it for you.”\n\nYou have not requested help. The caller is patient and says there is no charge.",
    "choices": [
      [
        "The caller claims to be your support provider even though you have not requested help.",
        true,
        "An unsolicited support claim needs checking. The caller’s statement does not establish that they represent a company you use. Contact your provider through a route you already trust."
      ],
      [
        "The caller asks you to install a program that would let them see or control your screen.",
        true,
        "Screen-sharing software can allow someone to view information or operate your device. Verify the provider and the need for access independently before installing anything or granting control."
      ],
      [
        "The caller is patient and does not ask for payment.",
        false,
        "Patience and a free offer are not warning signs by themselves, but they do not prove the caller is genuine. Access to your device can be valuable even without a payment. End the call and contact support using your device documentation or a website you already trust."
      ]
    ],
    "closing": "A routine-sounding update can still involve a risky request for access. Check who is asking and why before installing software or sharing your screen.",
    "question": "You allowed an unexpected caller to control your computer. They are still connected, and you now feel unsure who they are. What is the safest immediate response?",
    "answers": [
      "Keep the connection open while asking the caller to explain their company’s credentials.",
      "Disconnect the computer from the internet, end the call, and seek help from a trusted support provider.",
      "Use the connected computer to sign in to your bank and check whether anything has changed."
    ],
    "correct": 1,
    "feedback": [
      "Questions alone do not remove the person’s access while you check. Disconnect the computer from the internet and end the call, then seek help through a support provider you trust.",
      "Disconnecting interrupts the remote connection and gives you time to get trusted help. For Wi-Fi, turn Wi-Fi off; for a wired connection, unplug the network cable. Explain what access you allowed. You can still take useful steps after a mistake.",
      "Signing in while someone may still have access could expose more information. Disconnect from the internet first and seek trusted help. If you need to contact your bank, use a separate trusted device or the number on your card."
    ]
  },
  {
    "scenario": "You are expecting a parcel. A text includes a tracking number and says:\n\n“See your delivery time in our new tracking app. Install it using this link.”\n\nThe linked page asks you to download an unfamiliar app and allow it to read your contacts and text messages.",
    "choices": [
      [
        "The message directs you to install an unfamiliar app through its own link.",
        true,
        "Do not install an app just because an unexpected message recommends it. Check your order through the store or delivery service you normally use, opened independently."
      ],
      [
        "The app asks to read contacts and text messages to show a delivery time.",
        true,
        "These requests would expose information beyond the delivery details you want. Do not grant access without understanding and independently verifying why it is needed. Do not install the app or grant access. Open your usual store account or delivery app yourself to check the order."
      ],
      [
        "The message includes a tracking number.",
        false,
        "A tracking number is not a warning sign by itself, but it can be copied or invented. Check it through the delivery service you normally use rather than the message’s link."
      ],
      [
        "You are expecting a parcel.",
        false,
        "That makes the message seem relevant, but it does not establish that this particular sender knows about your order. Use your trusted order information to check."
      ]
    ],
    "closing": "A delivery message may seek access to your device rather than a redelivery fee. Check through your usual order account before installing anything or granting access.",
    "question": "An unfamiliar store offers a kitchen appliance for half the usual price. Its reviews appear only on its own website, there is no clear contact address, and its return policy names a different business. What is the safest next step?",
    "answers": [
      "Ask the store to confirm the discount, then buy if its reply sounds professional.",
      "Make a small purchase first and check whether an order confirmation arrives.",
      "Hold off buying and look for independent information that resolves these concerns."
    ],
    "correct": 2,
    "feedback": [
      "A reply from the same store would not independently resolve the conflicting details. Check sources outside its website and avoid providing payment details while the concerns remain.",
      "A small purchase still shares payment information, and an automatic confirmation does not establish that goods will arrive. Check the store before making any payment.",
      "The missing contact details and inconsistent return policy give you reasons to pause. Reviews outside the store’s own website and independently checked business details may help. If the concerns remain unresolved, choose another seller; you do not need to prove fraud before deciding not to buy."
    ]
  }
];

const $ = id => document.getElementById(id);
let current = -1, size = 100, utterance = null;
const completed = new Set();
// Stable identifiers keep saved completion independent of lesson titles.
const completionIds = [
  'bank-impersonation', 'family-emergency', 'government-calls',
  'technical-support', 'delivery-shopping'
];
const completionStorageKey = 'cybersafe-trainer.completed-lessons.v1';
const savedProgressNotice =
  'Completion is saved in this browser on this device. Clearing browser data, using another browser, or opening the app at a different address may reset it.';
const temporaryProgressNotice =
  'Progress could not be saved in this browser. It will remain available while this page stays open.';
let completionStorage = null;
let progressNotice = savedProgressNotice;

function readCompletedIds(raw) {
  if (raw === null) return [];
  try {
    const saved = JSON.parse(raw);
    if (
      !saved || saved.version !== 1 || !Array.isArray(saved.completed) ||
      saved.completed.length > completionIds.length ||
      !saved.completed.every(id => typeof id === 'string' && completionIds.includes(id))
    ) return null;
    return saved.completed;
  } catch {
    return null;
  }
}

function mergeCompletedIds(ids) {
  ids.forEach(id => completed.add(completionIds.indexOf(id)));
}

function loadCompletedLessons() {
  try {
    completionStorage = window.localStorage;
    if (!completionStorage ||
        typeof completionStorage.getItem !== 'function' ||
        typeof completionStorage.setItem !== 'function') {
      throw new Error('Storage unavailable');
    }
    const ids = readCompletedIds(completionStorage.getItem(completionStorageKey));
    if (ids === null) {
      progressNotice = 'Saved progress could not be read. You can complete lessons again to save new progress.';
      return;
    }
    mergeCompletedIds(ids);
  } catch {
    completionStorage = null;
    progressNotice = temporaryProgressNotice;
  }
}

function saveCompletedLessons() {
  if (!completionStorage) return;
  try {
    // Merge another tab's saved results before writing this tab's completion.
    const ids = readCompletedIds(completionStorage.getItem(completionStorageKey));
    if (ids !== null) mergeCompletedIds(ids);
    completionStorage.setItem(completionStorageKey, JSON.stringify({
      version: 1,
      completed: completionIds.filter((id, index) => completed.has(index))
    }));
    progressNotice = savedProgressNotice;
  } catch {
    completionStorage = null;
    progressNotice = temporaryProgressNotice;
  }
}

function updateCompletionMessage() {
  const message = $('lesson-completion');
  message.replaceChildren();
  message.className = '';
  if (!completed.has(current)) return;
  message.className = 'feedback';
  const heading = document.createElement('strong');
  const mark = document.createElement('span');
  mark.textContent = '✓ ';
  mark.setAttribute('aria-hidden', 'true');
  heading.append(mark, document.createTextNode('Lesson completed!'));
  const text = document.createElement('p');
  text.textContent = 'You can revisit this lesson anytime to review the information or practice again.';
  message.append(heading, text);
}

function updateProgress() {
  $('progress').textContent =
    `${completed.size} of ${lessons.length} lessons completed.`;
  $('progress-storage').textContent = progressNotice;
  updateLessonCards();
  updateCompletionMessage();
}
loadCompletedLessons();
updateProgress();
window.addEventListener('storage', event => {
  if (
    !completionStorage || event.storageArea !== completionStorage ||
    event.key !== completionStorageKey || event.newValue === null
  ) return;
  const ids = readCompletedIds(event.newValue);
  if (ids === null) return;
  const previousCount = completed.size;
  mergeCompletedIds(ids);
  if (completed.size !== previousCount) {
    progressNotice = savedProgressNotice;
    updateProgress();
  }
});
const speech = Boolean(window.speechSynthesis) &&
  typeof window.SpeechSynthesisUtterance === 'function' &&
  ['getVoices', 'speak', 'cancel', 'pause', 'resume'].every(
    method => typeof window.speechSynthesis[method] === 'function'
  );
// CyberSafe lesson audio preference v2
let audioEnabled = false;
// Defined terms already explained in each lesson's introduction.
const lessonTerms = [
  'Phishing',
  'Independent verification',
  'Caller ID',
  'Remote access',
  'encrypted connection'
];
let speechSession = null;

function renderIntroduction(parent, text, term) {
  const position = term ? text.indexOf(term) : -1;
  if (position < 0) {
    parent.textContent = text;
    return;
  }
  const definition = document.createElement('dfn');
  definition.className = 'lesson-term';
  definition.textContent = term;
  parent.append(
    document.createTextNode(text.slice(0, position)),
    definition,
    document.createTextNode(text.slice(position + term.length))
  );
}

function lessonSpeechSegments(lesson, index, feedback, openingOnly = false) {
  const text = [
    lesson.title,
    lesson.intro,
    'Warning signs.',
    ...lesson.signs,
    ...(openingOnly ? [] : ['Scenario.',
    lesson.scenario,
    lesson.question,
    ...lesson.answers.map((answer, i) => `Option ${i + 1}. ${answer}`),
    feedback])
  ].join(' ');
  const titleEnd = lesson.title.length;
  const segments = [{ text: text.slice(0, titleEnd), pauseAfterMs: 400 }];
  const term = lessonTerms[index];
  const position = term ? lesson.intro.indexOf(term) : -1;
  if (position >= 0) {
    const termEnd = titleEnd + 1 + position + term.length;
    segments.push({ text: text.slice(titleEnd, termEnd), pauseAfterMs: 200 });
    segments.push({ text: text.slice(termEnd), pauseAfterMs: 0 });
  } else {
    segments.push({ text: text.slice(titleEnd), pauseAfterMs: 0 });
  }
  return segments;
}

// A reserved viewport row keeps the player visible without covering page content.
function showFloatingPlayer() {
  if (current < 0 || !$('floating-player').hidden) return;
  const top = typeof window.scrollY === 'number' ? window.scrollY : 0;
  $('floating-player').hidden = false;
  $('audio-player-focus').hidden = false;
  document.documentElement.setAttribute('data-audio-player','open');
  $('page-content').scrollTop = top;
}
function hideFloatingPlayer() {
  if ($('floating-player').hidden) return;
  const returnFocus = $('floating-player').contains(document.activeElement);
  const top = $('page-content').scrollTop || 0;
  $('floating-player').hidden = true;
  $('audio-player-focus').hidden = true;
  document.documentElement.setAttribute('data-audio-player','closed');
  if (typeof window.scrollTo === 'function') window.scrollTo({top,behavior:'instant'});
  if (returnFocus && !$('lesson').hidden) $('play').focus();
}
function syncFloatingPlayer() {
  const phase = speechSession && speechSession.phase;
  const running = phase && phase !== 'paused';
  $('floating-toggle').textContent = running ? 'Pause'
    : phase === 'paused' ? 'Play'
    : lessonAudio && lessonAudio.waiting ? 'Continue lesson' : 'Play';
}

function stopAudio(keepPlayer = false) {
  clearNarrationTarget();
  const session = speechSession;
  speechSession = null;
  utterance = null;
  if (session) session.cancel();
  if (speech) window.speechSynthesis.cancel();
  $('audio-status').textContent = '';
  $('explanation-speech-status').textContent = '';
  updateLessonAudioLabel();
  if (keepPlayer !== true) hideFloatingPlayer();
  syncFloatingPlayer();
  // Keep this lesson's audio preference for subsequent answers.
}

function readText(input, explanation = false, observer = null) {
  stopAudio(true);
  const status = explanation
    ? $('explanation-speech-status')
    : $('audio-status');
  if (!speech) {
    status.textContent =
      'Read aloud is not available in this browser. ' +
      'You can still read all the text on the page.';
    return;
  }

  showFloatingPlayer();
  const synth = window.speechSynthesis;
  const segments = typeof input === 'string'
    ? [{ text: input, pauseAfterMs: 0 }]
    : input.map(segment => ({ ...segment }));
  let voice = null;
  let retryTimer = null;
  let voiceTimer = null;
  let voiceHandler = null;
  let voiceEpoch = 0;
  let voiceDeadline = 0;
  let voiceRemaining = 5000;
  let gapTimer = null;
  let gapEpoch = 0;
  let gapDeadline = 0;
  let gapRemaining = 0;
  let pausedPhase = null;
  const session = {
    index: 0,
    phase: 'loading',
    cancel,
    pause,
    resume
  };

  function current() {
    return speechSession === session;
  }

  function clearVoiceWait() {
    voiceEpoch++;
    clearInterval(retryTimer);
    clearTimeout(voiceTimer);
    retryTimer = voiceTimer = null;
    if (voiceHandler) {
      synth.removeEventListener('voiceschanged', voiceHandler);
      voiceHandler = null;
    }
  }

  function clearGap() {
    gapEpoch++;
    clearTimeout(gapTimer);
    gapTimer = null;
  }

  function cancel() {
    clearVoiceWait();
    clearGap();
    session.phase = 'canceled';
  }

  function readingStatus() {
    syncFloatingPlayer();
    status.textContent = explanation
      ? 'Reading the explanation. Use Pause or Stop to control reading.'
      : 'Reading aloud.';
    if (explanation) {
      $('audio-status').textContent = 'Reading the explanation aloud.';
    }
  }

  function fail(message) {
    if (!current()) return;
    stopAudio();
    status.textContent = message;
  }

  function playbackFailure() {
    fail(
      'Audio playback is currently unavailable. ' +
      'All lesson text remains available on the page.'
    );
  }

  function finish() {
    clearVoiceWait();
    clearGap();
    session.phase = 'finished';
    speechSession = null;
    utterance = null;
    clearNarrationTarget();
    status.textContent = 'Finished reading.';
    if (explanation) $('audio-status').textContent = '';
    if (observer && observer.complete) observer.complete();
    syncFloatingPlayer();
  }

  function startGap(milliseconds) {
    clearGap();
    session.phase = 'gap';
    syncFloatingPlayer();
    gapRemaining = milliseconds;
    gapDeadline = performance.now() + milliseconds;
    const epoch = gapEpoch;
    if (milliseconds <= 0) {
      speakSegment();
      return;
    }
    gapTimer = setTimeout(() => {
      if (!current() || session.phase !== 'gap' || epoch !== gapEpoch) return;
      gapTimer = null;
      speakSegment();
    }, milliseconds);
  }

  function speakSegment() {
    if (!current()) return;
    try {
      const segment = segments[session.index];
      const reading = new window.SpeechSynthesisUtterance(segment.text);
      reading.voice = voice;
      reading.lang = voice.lang;
      reading.rate = .9;
      utterance = reading;
      session.phase = 'speaking';

      reading.onend = () => {
        if (!current() || utterance !== reading) return;
        utterance = null;
        session.index++;
        if (session.phase === 'paused') {
          pausedPhase = session.index === segments.length ? 'completed' : 'gap';
          gapRemaining = segment.pauseAfterMs;
          return;
        }
        if (session.index === segments.length) {
          finish();
          return;
        }
        startGap(segment.pauseAfterMs);
      };

      reading.onerror = () => {
        if (!current() || utterance !== reading) return;
        fail(
          'Audio playback was interrupted. ' +
          'All lesson text remains available on the page.'
        );
      };

      if (synth.paused) synth.resume();
      readingStatus();
      if (observer) showNarrationTarget(observer.target);
      synth.speak(reading);
    } catch {
      playbackFailure();
    }
  }

  function waitForVoice(milliseconds) {
    clearVoiceWait();
    session.phase = 'loading';
    syncFloatingPlayer();
    voiceDeadline = performance.now() + milliseconds;
    const epoch = voiceEpoch;
    const active = () =>
      current() && session.phase === 'loading' && epoch === voiceEpoch;

    function attempt() {
      if (!active()) return;
      try {
        const candidate = synth.getVoices().find(
          item => item.localService === true && /^en(?:-|$)/i.test(item.lang)
        );
        if (!candidate) return;
        voice = candidate;
        clearVoiceWait();
        speakSegment();
      } catch {
        playbackFailure();
      }
    }

    try {
      if (
        typeof synth.addEventListener === 'function' &&
        typeof synth.removeEventListener === 'function'
      ) {
        voiceHandler = attempt;
        synth.addEventListener('voiceschanged', voiceHandler);
      }
      retryTimer = setInterval(attempt, 250);
      voiceTimer = setTimeout(() => {
        if (!active()) return;
        attempt();
        if (!active()) return;
        fail(
          'An English voice stored on this device is not currently available. ' +
          'You can try again shortly or read the text on the page.'
        );
      }, milliseconds);
      status.textContent = 'Loading an English voice stored on this device…';
      attempt();
    } catch {
      playbackFailure();
    }
  }

  function pause() {
    if (!current() || session.phase === 'paused') return;
    pausedPhase = session.phase;
    try {
      if (pausedPhase === 'loading') {
        voiceRemaining = Math.max(0, voiceDeadline - performance.now());
        clearVoiceWait();
      } else if (pausedPhase === 'gap') {
        gapRemaining = Math.max(0, gapDeadline - performance.now());
        clearGap();
      }
      session.phase = 'paused';
      if (pausedPhase === 'speaking') synth.pause();
      $('play').textContent = '▶ Play';
      status.textContent = 'Paused. Select Play to continue.';
      $('audio-status').textContent = 'Paused. Select Play to continue.';
      syncFloatingPlayer();
    } catch {
      playbackFailure();
    }
  }

  function resume() {
    if (!current() || session.phase !== 'paused') return;
    try {
      if (pausedPhase === 'completed') {
        finish();
      } else if (pausedPhase === 'loading') {
        waitForVoice(voiceRemaining);
      } else if (pausedPhase === 'gap') {
        readingStatus();
        if (synth.paused) synth.resume();
        startGap(gapRemaining);
      } else {
        session.phase = 'speaking';
        readingStatus();
        synth.resume();
      }
    } catch {
      playbackFailure();
    }
  }

  speechSession = session;
  waitForVoice(5000);
}


function updateLessonCards() {
  document.querySelectorAll('[data-lesson-progress]').forEach(node => {
    const index = Number(node.dataset.lessonProgress);
    node.replaceChildren();
    if (completed.has(index)) {
      const mark = document.createElement('span');
      mark.textContent = '✓ ';
      mark.setAttribute('aria-hidden', 'true');
      node.append(mark, document.createTextNode('Lesson completed'));
    } else node.textContent = 'Not completed';
    const link = node.parentElement.querySelector('a');
    link.textContent = completed.has(index) ? `Review lesson ${index + 1}` : `Start lesson ${index + 1}`;
  });
}

function practiceFeedback(form, text) {
  const feedback = form.querySelector('.practice-feedback');
  feedback.textContent = text;
  feedback.hidden = false;
  if (audioEnabled) readText(text);
}

function renderPractice(index) {
  practiceAudio={};
  const activity = optionalPractice[index];
  function build(host, kind) {
    host.replaceChildren();
    const warning = kind === 'warning';
    const details = document.createElement('details');
    details.className = 'practice';
    const summary = document.createElement('summary');
    summary.id = kind+'-practice-heading';
    summary.textContent = warning
      ? 'Practice spotting the warning signs'
      : 'Try another situation';
    const form = document.createElement('form');
    const instructions = document.createElement('p');
    instructions.textContent = warning
      ? 'Select the details that suggest you should stop and check the request independently. You can select more than one. Then choose Review my choices.'
      : 'Choose one response, then select Check my answer. You can try again as often as you like.';
    const scenario = document.createElement('p');
    scenario.className = 'practice-scenario';
    scenario.textContent = warning ? activity.scenario : activity.question;
    const fieldset = document.createElement('fieldset');
    const legend = document.createElement('legend');
    legend.textContent = warning ? 'Which details are warning signs?' : activity.question;
    // The question is the legend for radio choices; avoid reading it twice.
    if (!warning) scenario.hidden = true;
    fieldset.append(legend);
    const inputs = [];
    const choices = warning ? activity.choices.map(choice => choice[0]) : activity.answers;
    choices.forEach((choice, number) => {
      const label = document.createElement('label');
      label.className = 'answer';
      const input = document.createElement('input');
      input.type = warning ? 'checkbox' : 'radio';
      input.name = warning ? `warning-${number}` : 'practice-answer';
      input.value = number;
      const text = document.createElement('span');
      text.textContent = choice;
      label.append(input, text);
      fieldset.append(label);
      inputs.push(input);
    });
    const feedback = document.createElement('div');
    feedback.className = 'feedback practice-feedback';
    feedback.setAttribute('role', 'status');
    feedback.setAttribute('aria-atomic', 'true');
    feedback.hidden = true;
    const check = document.createElement('button');
    check.type = 'submit';
    check.textContent = warning ? 'Review my choices' : 'Check my answer';
    const retry = document.createElement('button');
    retry.type = 'button';
    retry.textContent = 'Try again';
    retry.addEventListener('click', () => {
      stopAudio();
      inputs.forEach(input => { input.checked = false; });
      feedback.hidden = true;
      feedback.textContent = '';
      inputs[0].focus();
    });
    const read = document.createElement('button');
    read.type = 'button';
    read.textContent = 'Read practice aloud';
    practiceAudio[kind]={target:summary.id,label:summary.textContent,optional:true,segments:()=>([
        { text: summary.textContent, pauseAfterMs: 400 },
        {
          text: [
            instructions.textContent,
            warning ? activity.scenario : activity.question,
            ...choices.map((choice, number) => `Option ${number + 1}. ${choice}`),
            !feedback.hidden ? feedback.textContent : ''
          ].join(' '),
          pauseAfterMs: 0
        }
      ])};
    read.addEventListener('click', () => {
      audioEnabled=true;
      selectLessonAudioTarget(summary.id);
      playLessonAudio();
    });
    const skip = document.createElement('button');
    skip.type = 'button';
    skip.textContent = 'Skip this practice';
    skip.addEventListener('click', () => {
      selectLessonAudioTarget('quiz');
      details.open = false;
      if (warning) {
        const quiz=$('lesson-one-quiz');
        const destination=quiz && !quiz.open ? $('lesson-one-quiz-toggle') : $('question');
        destination.setAttribute('tabindex', '-1');
        destination.focus();
      } else summary.focus();
    });
    const actions = document.createElement('div');
    actions.className = 'practice-actions';
    actions.append(check, retry, read, skip);
    form.append(instructions, scenario, fieldset, actions, feedback);
    form.addEventListener('submit', event => {
      event.preventDefault();
      stopAudio();
      if (warning) {
        const correct = activity.choices.every((choice, number) => inputs[number].checked === choice[1]);
        practiceFeedback(form, [
          correct ? 'You identified the warning signs.' : 'Let’s review the details.',
          ...activity.choices.map(choice => `${choice[0]} ${choice[1] ? 'Warning sign.' : 'Not a warning sign by itself.'} ${choice[2]}`),
          activity.closing
        ].join('\n\n'));
      } else {
        const number = inputs.findIndex(input => input.checked);
        if (number < 0) {
          // A reminder does not opt the learner into narration.
          feedback.textContent = 'Select a response, then choose Check my answer. You can also skip this practice.';
          feedback.hidden = false;
          return;
        }
        practiceFeedback(form,
          (number === activity.correct ? 'This is the safest response. ' : 'Let’s consider a safer next step. ') +
          activity.feedback[number]);
      }
    });
    details.addEventListener('toggle', () => {
      if (!details.open && host.contains(details) && speechSession && lessonAudio && lessonAudio.sections[lessonAudio.index].target===summary.id) stopAudio(true);
    });
    details.append(summary, form);
    if (!warning && index === 3) addBrowserHelp(details);
    host.append(details);
  }
  build($('warning-practice'), 'warning');
  build($('followup-practice'), 'followup');
}

function addBrowserHelp(parent) {
  const help = document.createElement('details');
  help.className = 'browser-help';
  const summary = document.createElement('summary');
  summary.id='browser-help-heading';
  summary.textContent = 'How to close a browser that will not respond';
  const steps = [
    'First, try the browser’s own close button or close the suspicious tab. Do not use buttons inside the warning or call its displayed number.',
    'Windows: press Ctrl + Shift + Esc together to open Task Manager, a tool for closing programs. Find your browser, such as Edge, Firefox, or Chrome. Select it, then choose End task. This closes the browser and may lose work in other open tabs.',
    'Android: open your recent apps using the square or Recent apps button. If your phone uses gestures, swipe up from the bottom and pause with your finger near the middle. Find the browser’s preview and swipe it up to close it.',
    'iPhone: swipe up from the bottom and pause near the middle to see open apps. On an iPhone with a Home button, press it twice instead. Find the browser’s preview and swipe it up to close it.',
    'When you open the browser again, do not choose Restore pages or reopen the suspicious tab. If it returns, avoid interacting with it and ask a trusted person or support provider for help.'
  ];
  const list = document.createElement('ol');
  steps.forEach(text => {
    const item = document.createElement('li');
    item.textContent = text;
    list.append(item);
  });
  const read = document.createElement('button');
  read.type = 'button';
  read.textContent = 'Read these instructions aloud';
  read.addEventListener('click', () => {
    audioEnabled = true;
    selectLessonAudioTarget(summary.id);
    playLessonAudio();
  });
  practiceAudio.help={target:summary.id,label:summary.textContent,optional:true,segments:()=>[{text:[summary.textContent,...steps].join(' '),pauseAfterMs:0}]};
  help.append(summary, list, read);
  parent.append(help);
}


// Shared audio bookmarks never hide, unlock or complete page content.
let lessonAudio = null;
let narrationTarget = null;
function clearNarrationTarget() {
  if (narrationTarget) narrationTarget.setAttribute('data-narrating', 'false');
  narrationTarget = null;
}
function showNarrationTarget(id) {
  if (!id) return;
  let target = $(id);
  let parent=target.parentElement;
  while(parent){
    if(parent.tagName==='DETAILS' && !parent.open)target=parent.querySelector('summary');
    parent=parent.parentElement;
  }
  if (target === narrationTarget) return;
  clearNarrationTarget();
  narrationTarget = target;
  target.setAttribute('data-narrating', 'true');
  target.scrollIntoView({ block: 'start', behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' });
}
function updateLessonAudioLabel() {
  if (current < 0 || !lessonAudio) return;
  $('play').textContent = lessonAudio.waiting ? 'Continue lesson' : '▶ Play';
  syncFloatingPlayer();
}
function bankTeachingSections() {
  const lesson = lessons[0];
  const section = (title, body) => [{ text: title, pauseAfterMs: 400 },
    ...body.split(/(?<=[.!?])(?=\s+[A-Z])/u).map(text => ({ text, pauseAfterMs: 0 }))];
  const term = lessonTerms[0];
  const end = lesson.intro.indexOf(term) + term.length;
  const opening = [{text: lesson.title, pauseAfterMs:400},
    {text:lesson.intro.slice(0,end),pauseAfterMs:200},{text:lesson.intro.slice(end),pauseAfterMs:0}];
  return [
    {target:'lesson-introduction',segments:opening},
    {target:'lesson-warning-signs',segments:section('Warning signs.',lesson.signs.join(' '))},
    {target:'bank-email-panel',exercise:true,segments:section("Let's check two examples.",
      'These examples are safe to explore. The first is an account sign-in email. Use the Investigate buttons to look for warning signs.'),
      example:section('Simulated email.',
        'Subject: New sign-in to your Northbridge Bank account. Sender: Northbridge Bank Security, alerts@northbridge-access.example. '+
        'To: alex@inbox.example. Today, 9:41 AM. Hello Alex. '+
        'We noticed a sign-in from a new device. If this was you, no action is needed. If you do not recognize this activity, review your account below. '+
        'Review within 30 minutes to prevent a temporary account restriction. The message offers to review account activity.')},
    {target:'bank-text-panel',exercise:true,segments:section('The second example is a bank fraud text about an unfamiliar purchase.',
      'Use the Investigate buttons to examine the sender and the reply request.'),
      example:section('Simulated text message.',
        'From Northbridge Bank. Today, 9:42 AM. Northbridge Bank Fraud Alert. '+
        'Did you attempt a $786.42 debit-card purchase at Alder Home Market? Reply YES if this was you or NO if you do not recognize this purchase.')},
    {target:'simulation-content',exercise:true,segments:section("Now let's investigate another suspicious email.",
      'Examine the sender, link, and warning signs. Then decide whether you would trust or report the message.'),
      example:section('Simulated investigation email.',
        'From Northbridge Bank. Subject: Please verify your account today. We noticed an unusual sign-in. Verify your account within 30 minutes to avoid a temporary restriction. The message asks you to verify your account.')},
    {target:'lesson-scenario',segments:section('Lesson scenario.',lesson.scenario)},
    {target:'quiz',segments:section('Main question.',[lesson.question,
      ...lesson.answers.map((answer,i)=>`Option ${i+1}. ${answer}`),'Choose an answer, then select Check my answer.'].join(' '))}
  ];
}
let practiceAudio = {};
function speechIntroduction(lesson,index) {
  const text=lesson.title+' '+lesson.intro;
  const titleEnd=lesson.title.length;
  const term=lessonTerms[index], position=term ? lesson.intro.indexOf(term) : -1;
  const segments=[{text:lesson.title,pauseAfterMs:400}];
  if(position>=0){
    const end=titleEnd+1+position+term.length;
    segments.push({text:text.slice(titleEnd,end),pauseAfterMs:200},{text:text.slice(end),pauseAfterMs:0});
  }else segments.push({text:text.slice(titleEnd),pauseAfterMs:0});
  return segments;
}
function resetLessonAudio(index) {
  const lesson=lessons[index];
  const sections=index===0 ? bankTeachingSections() : [
    {target:'lesson-introduction',segments:speechIntroduction(lesson,index)},
    {target:'lesson-warning-signs',segments:[{text:' Warning signs.',pauseAfterMs:400},{text:' '+lesson.signs.join(' '),pauseAfterMs:0}]},
    {target:'lesson-scenario',segments:[{text:' Scenario.',pauseAfterMs:400},{text:' '+lesson.scenario,pauseAfterMs:0}]},
    {target:'quiz',segments:()=>[{text:' '+[lesson.question,...lesson.answers.map((answer,i)=>`Option ${i+1}. ${answer}`),!$('feedback').hidden ? $('feedback').textContent : ''].join(' '),pauseAfterMs:0}]}
  ];
  const quizIndex=sections.findIndex(section=>section.target==='quiz');
  sections.splice(quizIndex,0,practiceAudio.warning);
  sections.push(practiceAudio.followup);
  if(practiceAudio.help)sections.push(practiceAudio.help);
  const labels={
    'lesson-introduction':$('lesson-title').textContent,
    'lesson-warning-signs':$('lesson-warning-signs').querySelector('h3').textContent,
    'bank-email-panel':index===0 ? $('bank-email-heading').textContent : '',
    'bank-text-panel':index===0 ? $('bank-text-heading').textContent : '',
    'simulation-content':index===0 ? $('simulation-heading').textContent : '',
    'lesson-scenario':$('lesson-scenario').querySelector('h3').textContent,
    quiz:index===0 ? $('lesson-one-quiz-toggle').textContent : $('question').textContent
  };
  sections.forEach(section=>{section.label=section.label || labels[section.target];});
  lessonAudio={lesson:index,index:0,waiting:false,finished:false,sections};
  for(const id of ['read-from','floating-read-from']){
    const select=$(id);select.replaceChildren();
    sections.forEach((section,i)=>{const option=document.createElement('option');option.value=String(i);option.textContent=section.label;select.append(option);});
  }
  syncReadFrom();
  $('play').textContent='▶ Play';
}
function syncReadFrom() {
  if(!lessonAudio)return;
  for(const id of ['read-from','floating-read-from'])$(id).value=String(lessonAudio.index);
}
function selectLessonAudioSection(value,keepPlayer=!$('floating-player').hidden) {
  const index=Number(value);
  if(!lessonAudio || !Number.isInteger(index) || index<0 || index>=lessonAudio.sections.length)return;
  stopAudio(keepPlayer);
  lessonAudio.index=index;lessonAudio.waiting=false;lessonAudio.finished=false;
  syncReadFrom();updateLessonAudioLabel();
  $('audio-status').textContent=speech ? 'Selected: '+lessonAudio.sections[index].label+'. Select Play to listen from here.' : 'Read aloud is not available in this browser. All lesson text remains available on the page.';
}
function selectLessonAudioTarget(target,keepPlayer=!$('floating-player').hidden) {
  if(!lessonAudio)return;
  const index=lessonAudio.sections.findIndex(section=>section.target===target);
  if(index>=0)selectLessonAudioSection(index,keepPlayer);
}
function stopLessonAudio() {
  stopAudio();
  if(lessonAudio){lessonAudio.waiting=false;lessonAudio.finished=false;syncReadFrom();updateLessonAudioLabel();}
}
function playLessonAudio() {
  const flow = lessonAudio;
  if (!flow || current < 0 || speechSession) return;
  audioEnabled = true;
  if (flow.finished) flow.finished=false;
  if (flow.waiting) {flow.index++;flow.waiting=false;}
  updateLessonAudioLabel();
  const section = flow.sections[flow.index];
  syncReadFrom();
  const segments = typeof section.segments === 'function' ? section.segments() : section.segments;
  readText(segments,false,{
    target:section.target,
    complete() {
      if (lessonAudio !== flow) return;
      if (section.exercise) {
        flow.waiting=true;
        updateLessonAudioLabel();
        $('audio-status').textContent = 'Narration is paused while you explore this example. Select Read Example to hear the message, or Continue lesson when ready.';
      } else if (section.optional || !flow.sections.some((entry,index)=>index>flow.index && !entry.optional)) {
        flow.finished=true;
        $('audio-status').textContent = section.optional ? 'Practice reading finished. You can try the activity or select another section in Read from.' : 'Lesson narration finished. Choose an answer and select Check my answer.';
      } else {
        flow.index=flow.sections.findIndex((entry,index)=>index>flow.index && !entry.optional);
        playLessonAudio();
      }
    }
  });
}
function readLessonOneExtra(segments,target) {
  if (!lessonAudio || current !== 0) return;
  audioEnabled=true;
  if (lessonAudio.sections[lessonAudio.index].exercise) lessonAudio.waiting=true;
  readText(segments,false,{
    target,
    complete() {
      updateLessonAudioLabel();
      $('audio-status').textContent = lessonAudio && lessonAudio.waiting
        ? 'Example reading finished. Narration is paused while you explore. Select Continue lesson when ready.'
        : 'Reading finished. Select Play to resume the lesson from this section.';
    }
  });
  $('play').textContent = '▶ Play';
}
function readExampleButton(id,index) {
  const button=document.createElement('button');
  button.id=id;
  button.type='button';
  button.textContent='Read Example';
  button.setAttribute('aria-label', 'Read Example — '+['scam email','scam text message','scam investigation'][index-2]);
  button.addEventListener('click',()=>{
    if (current !== 0 || !lessonAudio) return;
    const section=lessonAudio.sections[index];
    readLessonOneExtra(section.example,section.target);
  });
  return button;
}
function readBankDetail(text, target = null) {
  if (audioEnabled && current === 0) readLessonOneExtra([{text,pauseAfterMs:0}],target);
}
function investigateWithoutAudio() {
  audioEnabled=false;
  stopLessonAudio();
}
function bringExplanationIntoView(detail) {
  if (detail.hidden || typeof detail.getBoundingClientRect !== 'function') return;
  const rect=detail.getBoundingClientRect();
  let top=12, bottom=window.innerHeight-12;
  const frame=$('page-content');
  if(document.documentElement.getAttribute('data-audio-player')==='open'){
    const visible=frame.getBoundingClientRect();
    top=Math.max(top,visible.top+12);bottom=Math.min(bottom,visible.bottom-12);
  }
  const available=bottom-top;
  if(available<=0 || (rect.top>=top && rect.bottom<=bottom))return;
  const tall=rect.height>available;
  // A long explanation only needs its beginning comfortably visible.
  if(tall && rect.top>=top && bottom-rect.top>=Math.min(180,available/2))return;
  detail.scrollIntoView({block:tall?'start':'nearest',inline:'nearest',
    behavior:window.matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'});
}
function dismissBankDetail() { stopAudio(true); }

function buildBankExamples() {
  function node(tag, text, cls) {
    const item = document.createElement(tag);
    if (text) item.textContent = text;
    if (cls) item.className = cls;
    return item;
  }
  const section = node('section', '', 'bank-examples');
  section.id = 'bank-examples';
  const heading = node('h3', "Let's Check Two Examples");
  heading.id = 'bank-examples-heading';
  section.setAttribute('aria-labelledby', heading.id);
  section.append(heading, node('p', 'Examine these simulated messages for warning signs. Use the Investigate buttons to learn what makes each message suspicious. These examples are safe to explore.'), node('p','For comparison, your usual bank website is northbridge.example. The Investigate buttons only reveal explanations; nothing is sent or opened.'));
  function example(id, title, cls) {
    const wrapper = node('section', '', 'message-example');
    const label = node('h4', title);
    label.id = id + '-heading';
    wrapper.id = id + '-panel';
    wrapper.setAttribute('aria-labelledby', label.id);
    const mock = node('article', '', cls);
    mock.setAttribute('aria-label', title);
    const clues = node('div', '', 'message-clues');
    const status = node('p');
    status.id = id + '-status';
    status.hidden = true;
    const announcement = node('p', '', 'clue-announcement');
    announcement.id = id + '-announcement';
    announcement.setAttribute('role', 'status');
    announcement.setAttribute('aria-atomic', 'true');
    const controls = [];
    const explanations = new Map();
    function updateClues() {
      const count = [...explanations.values()].filter(detail => !detail.hidden).length;
      controls.forEach(control => {
        const detail = $(control.getAttribute('aria-controls'));
        control.setAttribute('aria-expanded', String(!detail.hidden));
        control.setAttribute('aria-describedby', detail.hidden ? introduction.id : detail.id);
      });
      reset.disabled = count === 0;
      reset.hidden = count === 0;
      reset.textContent = count === 1 ? 'Close' : 'Close all';
      status.hidden = true;
      status.textContent = count ? `${count} ${count === 1 ? 'clue open' : 'clues open'}.` : 'No clues open.';
      announcement.textContent = count ? status.textContent : 'All clues closed. You can investigate again.';
    }
    function clue(key, text, explanation, style) {
      const group = node('div', '', 'message-detail');
      const evidence = node('span', text, 'message-evidence ' + (style || ''));
      const button = node('button', 'Investigate', 'message-hotspot');
      const names = {sender:'sender',urgency:'time limit',review:'account-review request',purchase:'purchase details',request:'reply request','reply-yes':'YES reply','reply-no':'NO reply'};
      button.setAttribute('aria-label','Investigate '+(names[key] || key));
      button.id = id + '-' + key;
      button.type = 'button';
      button.setAttribute('aria-expanded', 'false');
      button.setAttribute('aria-controls', button.id + '-detail');
      let detail = explanations.get(explanation);
      const fresh = !detail;
      if (!detail) {
        detail = node('p', explanation, 'message-clue');
        detail.id = button.id + '-detail';
        detail.hidden = true;
        explanations.set(explanation, detail);
      }
      button.setAttribute('aria-controls', detail.id);
      button.setAttribute('aria-describedby', introduction.id);
      button.addEventListener('click', () => {
        investigateWithoutAudio();
        detail.hidden = !detail.hidden;
        updateClues();
        if (!detail.hidden) bringExplanationIntoView(detail);
      });
      controls.push(button);
      group.append(evidence,button);
      if (fresh) {
        if (key.startsWith('reply-')) clues.append(detail);
        else group.append(detail);
      }
      return group;
    }
    const reset = node('button', 'Close');
    reset.disabled = true;
    reset.hidden = true;
    reset.type = 'button';
    reset.id = id + '-reset';
    reset.addEventListener('click', () => {
      stopAudio(true);
      dismissBankDetail();
      controls.forEach(button => button.setAttribute('aria-expanded', 'false'));
      [...explanations.values()].forEach(item => { item.hidden = true; });
      updateClues();
      controls[0].focus();
    });
    const tools = node('div', '', 'practice-actions');
    tools.append(readExampleButton(id+'-read',id === 'bank-email' ? 2 : 3),reset);
    const introduction = node('p', id === 'bank-email'
      ? 'Use the Investigate buttons to examine this email’s sender, time limit, and account-review request. No link opens.'
      : 'Use the Investigate buttons to examine this text and its reply request. No reply is sent.', 'message-instructions');
    introduction.id = id + '-instructions';
    status.textContent = 'No clues open.';
    wrapper.append(label, introduction, mock, status, announcement, tools);
    section.append(wrapper);
    return { mock, clue, sharedClues: clues };
  }
  const email = example('bank-email', 'Account sign-in email', 'opened-email');
  email.mock.append(node('p', 'Inbox  /  Open message', 'message-chrome'),
    node('h4', 'New sign-in to your Northbridge Bank account'),
    email.clue('sender', 'Northbridge Bank Security <alerts@northbridge-access.example>',
      'The display name sounds familiar, but the sender uses northbridge-access.example, not your usual northbridge.example. Similar names can mislead. Check through your usual banking app or the number on your bank card.'),
    node('p', 'To: alex@inbox.example', 'message-meta'),
    node('p', 'Today, 9:41 AM', 'message-meta'),
    node('p', 'Hello Alex,'),
    node('p', 'We noticed a sign-in from a new device. If this was you, no action is needed. If you do not recognize this activity, review your account below.'),
    email.clue('urgency', 'Review within 30 minutes to prevent a temporary account restriction.',
      'A possible sign-in can feel urgent. The short deadline and threatened restriction add pressure. Do not let a timer replace a separate check. Open your usual banking app yourself or call the number on your bank card.'),
    email.clue('review', 'Review account activity',
      'This button points to https://northbridge-account.example/review, not northbridge.example. Here it only reveals this explanation. In a real message, use your usual app instead of an unexpected link.', 'message-review'),
    node('p', 'Northbridge Bank · Account Security', 'message-meta'));
  const sms = example('bank-text', 'Bank fraud text', 'phone-message');
  sms.mock.append(node('p', '9:42', 'phone-clock'),
    sms.clue('sender', 'Northbridge Bank',
      'A sender name does not verify who sent a text. Names and numbers can be disguised. Open your usual bank app or call the number on your card to check.'),
    node('p', 'Text message · Today 9:42 AM', 'message-meta'));
  const bubble = node('div', '', 'text-bubble');
  bubble.append(node('p', 'Northbridge Bank Fraud Alert'),
    sms.clue('purchase', 'Did you attempt a $786.42 debit-card purchase at Alder Home Market?',
      'An unfamiliar, precise purchase amount can make you react quickly. The amount is not proof that a purchase happened. Check transactions independently in your usual banking app.'),
    sms.clue('request', 'Reply YES if this was you or NO if you do not recognize this purchase.',
      'Scammers use YES/NO fraud alerts to begin a conversation, sometimes followed by a call from a fake fraud team. Some genuine alerts also use replies, so the wording alone is not proof. Open your usual banking app yourself or call the number on your bank card before responding.'));
  sms.mock.append(bubble);
  const replies = node('div', '', 'text-replies');
  for (const answer of ['YES', 'NO']) replies.append(sms.clue('reply-' + answer.toLowerCase(), answer,
    'No reply was sent. Either response can engage a scammer. Leave this unexpected conversation and check with your bank through your usual app or the number on your card.'));
  sms.mock.append(replies,sms.sharedClues);
  return section;
}

function renderPhishingSimulation(index) {
  const host = $('phishing-simulation');
  host.replaceChildren();
  host.hidden = index !== 0;
  if (index !== 0) return;

  function textNode(tag, text, className) {
    const node = document.createElement(tag);
    node.textContent = text;
    if (className) node.className = className;
    return node;
  }
  function button(id, label) {
    const node = textNode('button', label);
    node.id = id;
    node.type = 'button';
    return node;
  }
  const details = document.createElement('section');
  details.id = 'simulation-content';
  details.className = 'practice simulation';
  details.setAttribute('aria-labelledby', 'simulation-heading');
  const summary = textNode('h3', 'Scam Investigation: Is This Email Real?');
  summary.id = 'simulation-heading';
  const safety = textNode('p',
    'Optional investigation. An email has arrived claiming to be from your bank. Explore the clues and decide whether it deserves your trust. Nothing here sends a message or opens another website. The addresses and email are fictional.');
  safety.id = 'simulation-safety';
  const reference = textNode('p', 'A detail to compare: your usual bank website in this investigation is ');
  reference.append(textNode('code', 'northbridge.example'));
  const email = document.createElement('article');
  email.className = 'simulation-email';
  email.setAttribute('aria-labelledby', 'simulation-subject');
  const inbox = textNode('p', 'Fictional inbox — practice only', 'eyebrow');
  const subject = textNode('h3', 'Please verify your account today');
  subject.id = 'simulation-subject';
  const from = textNode('p', 'From: Northbridge Bank');
  const body = textNode('p',
    'We noticed an unusual sign-in. Verify your account within 30 minutes to avoid a temporary restriction.');
  const verify = button('simulation-verify', 'Verify account');
  verify.setAttribute('aria-label', 'Verify account — inspect the fictional destination only');
  verify.setAttribute('aria-describedby', 'simulation-safety');
  email.append(inbox, from, subject, body, verify);
  const inspection = document.createElement('div');
  inspection.className = 'simulation-inspection';
  const announcement = textNode('p', '');
  announcement.id = 'simulation-action-status';
  announcement.setAttribute('role', 'status');
  announcement.setAttribute('aria-atomic', 'true');

  function clue(id, label, introduction, value, explanation) {
    const control = button(id, label);
    control.setAttribute('aria-controls', id + '-detail');
    control.setAttribute('aria-expanded', 'false');
    const region = document.createElement('div');
    region.id = id + '-detail';
    region.className = 'simulation-clue';
    region.hidden = true;
    region.append(textNode('p', introduction), textNode('code', value), textNode('p', explanation));
    function reveal(open) {
      region.hidden = !open;
      control.setAttribute('aria-expanded', String(open));
    }
    control.addEventListener('click', () => {
      investigateWithoutAudio();
      reveal(region.hidden);
      if (!region.hidden) bringExplanationIntoView(region);
    });
    inspection.append(control, region);
    return { control, region, reveal };
  }
  const sender = clue('simulation-sender', 'Investigate the Sender',
    'Full sender address:', 'security@northbridge-support.example',
    'Compare the part after @ with the usual bank website shown above. The displayed name alone does not establish who sent the message. Check through your usual banking app or the number on your bank card.');
  const destination = clue('simulation-destination', 'Investigate the Link',
    'The verification button displays this fictional destination as text only:',
    'https://northbridge-check.example/verify',
    'Compare the website name with northbridge.example. Nothing opens when you inspect it. In a real message, leave the link alone and open your usual banking app yourself or call the number on your bank card.');
  const pressure = clue('simulation-pressure', 'Investigate the Warning Signs',
    'Notice the time limit:', 'within 30 minutes',
    'A short deadline can pressure you to act before checking. You can pause and verify a request independently. Open your usual banking app yourself or call the number on your bank card.');
  function revealDestination(open) {
    destination.reveal(open);
    verify.setAttribute('aria-expanded', String(open));
  }
  destination.control.addEventListener('click', () => {
    verify.setAttribute('aria-expanded', String(!destination.region.hidden));
  });
  verify.setAttribute('aria-controls', 'simulation-destination-detail');
  verify.setAttribute('aria-expanded', 'false');
  verify.addEventListener('click', () => {
    investigateWithoutAudio();
    revealDestination(true);
    announcement.textContent = 'A clue to investigate: the destination is shown below the email. No website opened.';
    bringExplanationIntoView(destination.region);
  });

  const question = textNode('p', 'What do the clues tell you? Investigate the sender, link and warning signs, then decide what you would do with this message. You can revisit any example.');
  const decisions = document.createElement('div');
  decisions.className = 'practice-actions';
  decisions.setAttribute('role', 'group');
  decisions.setAttribute('aria-label', 'Email investigation decision');
  const trust = button('simulation-trust', 'Trust this message');
  const report = button('simulation-report', 'Report as suspicious');
  const feedback = document.createElement('div');
  feedback.id = 'simulation-feedback';
  feedback.setAttribute('role', 'status');
  feedback.setAttribute('aria-live', 'polite');
  feedback.setAttribute('aria-atomic', 'true');
  const warningSigns =
    'The sender uses northbridge-support.example, while your usual fictional bank website is northbridge.example. ' +
    'The verification destination is northbridge-check.example, a different website again. ' +
    'The 30-minute deadline adds pressure. A familiar display name does not verify the sender. ' +
    'In a real situation, leave the link alone and check through your usual banking app or a number from your bank card.';
  function decide(choice) {
    stopAudio();
    announcement.textContent = '';
    feedback.className = 'feedback';
    feedback.textContent = (choice === 'report'
      ? 'Your investigation points to a suspicious message. Here is how the clues fit together. '
      : 'A familiar bank name can make this message look convincing. Let’s look more closely at the clues before trusting it. ') +
      warningSigns + ' Nothing was sent or opened. You can revisit the clues, reconsider your choice or restart the investigation.';
    if (audioEnabled) readBankDetail(feedback.textContent,feedback.id);
  }
  trust.addEventListener('click', () => decide('trust'));
  report.addEventListener('click', () => decide('report'));
  decisions.append(trust, report);
  const tools = document.createElement('div');
  tools.className = 'practice-actions';
  const reset = button('simulation-reset', 'Restart investigation');
  reset.addEventListener('click', () => {
    stopAudio(true);
    dismissBankDetail();
    sender.reveal(false);
    revealDestination(false);
    pressure.reveal(false);
    feedback.replaceChildren();
    feedback.className = '';
    announcement.textContent = 'Investigation restarted. All clues are closed. You can investigate the email again.';
    sender.control.focus();
  });
  tools.append(readExampleButton('simulation-read',4),reset);
  details.append(summary, safety, reference, email, inspection, announcement,
    question, decisions, feedback, tools);
  host.append(details);
}

function configureLessonQuiz(index) {
  const content = $('quiz-content');
  const region = $('quiz-region');
  if (index !== 0) { region.replaceChildren(content); return; }
  const details = document.createElement('details');
  details.id = 'lesson-one-quiz';
  details.className = 'lesson-quiz';
  details.open = true;
  const summary = document.createElement('summary');
  summary.id = 'lesson-one-quiz-toggle';
  const heading = document.createElement('h3');
  heading.textContent = 'Lesson 1 Quiz — Check Your Knowledge';
  summary.append(heading);
  region.replaceChildren(details);
  details.append(summary, content);
}

function showExplanation() {
  const answered = !!$('quiz').querySelector('input:checked');
  $('explanation-tools').hidden = !answered;
  if (answered && audioEnabled) {
    readText($('feedback').textContent, true);
  }
}
lessons.forEach((lesson,i)=>{const card=document.createElement('article');card.className='card';const label=document.createElement('span');label.className='eyebrow';label.textContent=`LESSON ${i+1}`;const title=document.createElement('h3');title.textContent=lesson.title;const desc=document.createElement('p');desc.textContent=lesson.summary;const link=document.createElement('a');link.className='button';link.href=`#lesson-${i+1}`;link.textContent=`Start lesson ${i+1}`;const state=document.createElement('p');state.dataset.lessonProgress=String(i);state.className='lesson-progress';state.textContent='Not completed';card.append(label,title,desc,state,link);$('lesson-cards').append(card);});
updateLessonCards();
function openLesson(i){stopAudio();audioEnabled=false;$('explanation-tools').hidden=true;current=i;lessonAudio=null;configureLessonQuiz(i);updateCompletionMessage();renderPractice(i);renderPhishingSimulation(i);const l=lessons[i];$('lesson').hidden=false;$('lesson-title').textContent=l.title;$('lesson-number').textContent=`LESSON ${i+1} OF ${lessons.length}`;$('lesson-copy').replaceChildren();const intro=document.createElement('p');intro.id='lesson-introduction';renderIntroduction(intro,l.intro,lessonTerms[i]);const heading=document.createElement('h3');heading.textContent='Warning signs';const list=document.createElement('ul');l.signs.forEach(s=>{const li=document.createElement('li');li.textContent=s;list.append(li);});const scenario=document.createElement('div');scenario.className='scenario';const h=document.createElement('h3');h.textContent='Scenario';const p=document.createElement('p');p.textContent=l.scenario;scenario.append(h,p);const warnings=document.createElement('div');warnings.id='lesson-warning-signs';warnings.append(heading,list);$('lesson-copy').append(intro,warnings);if(i===0)$('lesson-copy').append(buildBankExamples());$('lesson-scenario').replaceChildren(scenario);$('question').textContent=l.question;$('answers').replaceChildren();l.answers.forEach((a,n)=>{const label=document.createElement('label');label.className='answer';const input=document.createElement('input');input.type='radio';input.name='answer';input.value=n;const span=document.createElement('span');span.textContent=a;label.append(input,span);$('answers').append(label);});$('feedback').hidden=true;$('next').hidden=true;resetLessonAudio(i);$('audio-status').textContent=speech&&i===0?'Select Play to listen to this lesson. You can pause or stop the narration at any time.':speech?'Select Play to hear the lesson. After you choose audio, checked answers will also be read aloud during this lesson.':'Read aloud is not available in this browser. All lesson text is shown below.';$('lesson').scrollIntoView();$('lesson-title').focus({preventScroll:true});}
function route() {
  if (location.hash === '#main') {
    stopAudio();
    $('lesson').hidden = true;
    $('main').focus({ preventScroll: true });
    $('main').scrollIntoView();
    return;
  }
  const match = location.hash.match(/^#lesson-([1-9]\d*)$/);
  const lessonNumber = match ? Number(match[1]) : NaN;

  if (
    Number.isSafeInteger(lessonNumber) &&
    lessonNumber >= 1 &&
    lessonNumber <= lessons.length
  ) {
    openLesson(lessonNumber - 1);
  } else {
    stopAudio();
    $('lesson').hidden = true;
    const target = document.querySelector(
      ['#home', '#lessons', '#help', '#support'].includes(location.hash)
        ? location.hash
        : '#home'
    );
    if (location.hash) target.scrollIntoView();
  }
}
window.addEventListener('hashchange',route);
$('lesson-cards').addEventListener('click', event => {
  if (
    event.defaultPrevented || event.button !== 0 ||
    event.ctrlKey || event.metaKey || event.shiftKey || event.altKey
  ) return;
  const link = event.target.closest('a');
  if (link && link.getAttribute('href') === location.hash) {
    event.preventDefault();
    route();
  }
});
$('quiz').addEventListener('submit',e=>{e.preventDefault();stopAudio();const chosen=$('quiz').querySelector('input:checked');$('feedback').hidden=false;if(!chosen){$('feedback').textContent='Select an answer, then choose Check my answer to review the explanation.';showExplanation();return;}const l=lessons[current],correct=Number(chosen.value)===l.correct;$('feedback').textContent=(correct?'This is the safest response. ':'Why this response may be unsafe. ')+l.feedback[Number(chosen.value)]+(correct?' Key point: '+l.takeaway:' Review the explanation, then select another answer.');if(correct){completed.add(current);saveCompletedLessons();updateProgress();$('next').hidden=false;$('next').textContent=current===lessons.length-1?'Return to all lessons':'Next lesson';}showExplanation();});
$('next').addEventListener('click', () => {
  location.hash = current === lessons.length - 1
    ? '#lessons'
    : `#lesson-${current + 2}`;
});
function resize(delta){size=Math.max(100,Math.min(150,size+delta));document.documentElement.style.fontSize=`${20*size/100}px`;$('size-label').textContent=`${size}%`;$('smaller').disabled=size===100;$('larger').disabled=size===150;}
$('smaller').addEventListener('click',()=>resize(-10));$('larger').addEventListener('click',()=>resize(10));resize(0);
$('play').addEventListener('click', () => {
  if (current < 0) return;
  audioEnabled = true;

  if (speechSession && speechSession.phase === 'paused') {
    speechSession.resume();
    return;
  }

  if (speechSession) return;
  playLessonAudio();
});

$('read-explanation').addEventListener('click', () => {
  if ($('explanation-tools').hidden || $('feedback').hidden) return;
  audioEnabled = true;
  readText($('feedback').textContent, true);
});
$('pause').addEventListener('click', () => {
  if (speech && speechSession) speechSession.pause();
});
$('stop').addEventListener('click', stopLessonAudio);
$('floating-toggle').addEventListener('click', () => {
  if (speechSession && speechSession.phase !== 'paused') speechSession.pause();
  else $('play').click();
  syncFloatingPlayer();
});
$('floating-stop').addEventListener('click', stopLessonAudio);
for(const id of ['read-from','floating-read-from'])$(id).addEventListener('change',()=>selectLessonAudioSection($(id).value));
$('audio-player-focus').addEventListener('click', () => $('floating-toggle').focus());
if(!speech){['play','pause','stop','read-from','floating-read-from'].forEach(id=>$(id).disabled=true);}window.addEventListener('pagehide',stopAudio);route();

// Mobile navigation disclosure. Lesson and speech behavior above is unchanged.
const menuToggle = $('menu-toggle');
const mainNavigation = $('main-navigation');
const phoneLayout = window.matchMedia('(max-width: 600px)');
function setMenu(open, returnFocus = false) {
  mainNavigation.hidden = phoneLayout.matches && !open;
  menuToggle.setAttribute('aria-expanded', String(phoneLayout.matches && open));
  if (returnFocus) menuToggle.focus();
}
function syncMenuLayout() {
  const focused = document.activeElement;
  menuToggle.hidden = !phoneLayout.matches;
  setMenu(false);
  if (phoneLayout.matches && mainNavigation.contains(focused)) menuToggle.focus();
  if (!phoneLayout.matches && focused === menuToggle) mainNavigation.querySelector('a').focus();
}
menuToggle.addEventListener('click', () => setMenu(menuToggle.getAttribute('aria-expanded') !== 'true'));
mainNavigation.addEventListener('click', event => {
  if (event.target.closest('a') && phoneLayout.matches) setMenu(false, true);
});
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && phoneLayout.matches && menuToggle.getAttribute('aria-expanded') === 'true') setMenu(false, true);
});
phoneLayout.addEventListener('change', syncMenuLayout);
syncMenuLayout();
