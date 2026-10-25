# CyberSafe Trainer 2

A free, beginner-friendly cybersecurity learning website for adults. It includes five lessons about bank impersonation, family emergency requests, government calls, fake technical support, and delivery and shopping scams.

**Live website:** [cybersafe-trainer-2.pages.dev](https://cybersafe-trainer-2.pages.dev)

**Source repository:** [schzamm/cybersafe-trainer-2](https://github.com/schzamm/cybersafe-trainer-2)

The website uses plain HTML, CSS, and JavaScript. There is no installation, package dependency, application build, account, or advertising. Cloudflare Web Analytics has been enabled for the hosted website, but successful collection of visitor statistics has not yet been confirmed.

## Open and use the website

Open the live website in a modern browser, such as Edge, Chrome, Firefox, or Safari. Read-aloud availability depends on the browser, device, and available local voices.

For local preview, open `index.html` using your browser's file-opening option or your operating system's “Open with” menu. Keep `app.js`, `styles.css`, and `mobile.css` beside it. No package installation or application build is required.

Choose any lesson. Each includes an introduction, warning signs, a scenario, and a main multiple-choice question. Only a correct answer to that main question marks the lesson complete. There are unlimited retries.

Each lesson also includes two optional activities:

- **Practice spotting the warning signs:** select the details that deserve further checking, then review the explanations.
- **Try another situation:** apply the lesson to a different decision, with feedback for each answer.

Optional activities never affect completion or block navigation. **Try again** clears the practice choices, and **Skip this practice** closes the activity. The technical-support lesson also includes expandable Windows, Android, and iPhone instructions for closing an unresponsive browser.

Completed cards show **✓ Lesson completed** and a numbered **Review lesson** link. The lesson displays **Lesson completed!** and explains that you can revisit it to review or practice again. The checkmark is decorative and hidden from screen readers; the written completion status remains available.

## Narration and accessibility

**Play**, **Pause**, and **Stop** control the current reading. Play resumes a paused reading; after Stop, Play starts the main lesson from the beginning. **Read practice aloud**, **Read explanation aloud**, and the browser-help reading button use the same controls. Starting a different reading, changing lessons, closing a practice, or submitting another answer stops the previous reading.

Choosing audio enables automatic reading of checked-answer feedback for the current lesson. Without that choice, feedback stays quiet. Changing lessons resets the audio preference. Stop clears playback and status without removing the preference for subsequent answers. No-answer reminders do not automatically play.

Narration uses browser speech synthesis and only voices reported as local English voices. No text is sent by this app to an external speech service. Voice loading is retried for a bounded period. If speech or a suitable voice is unavailable, the app displays a message and all text remains readable. Actual support depends on the browser and device; an operating-system speech test does not guarantee that the browser exposes a suitable voice.

Separate observations from user testing:

- **Chrome on the live website:** read-aloud worked during user testing. This observation does not establish support for every Chrome version or device.
- **Microsoft Edge on Windows 11:** narration worked during user testing.
- **Firefox on Windows 11:** the tested installation returned no speech voices and produced no sound in a direct speech-synthesis test. This describes that installation, not all Firefox versions or configurations. Lessons and activities remain readable and usable without narration.

Readings include a 400ms pause after lesson titles and activity headings, plus a 200ms pause after selected first-defined terms. Pausing during a gap preserves its remaining duration.

Use **A+** and **A−** to adjust text from 100% to 150%. Browser zoom also works. Text size and audio preferences are not saved. Controls have visible focus outlines and large touch targets.

Tab moves between controls. Space selects a checkbox; arrow keys move within a radio group. Enter activates a focused link or button, and Space also activates buttons. The **Skip to main content** link moves focus to the main content. Phone navigation uses **Menu**; Escape closes it and returns focus.

## Saved completion and privacy

Only completed lesson identifiers are saved in localStorage under this app's key, `cybersafe-trainer.completed-lessons.v1`. The saved object contains a version and those identifiers. Answers, passwords, personal information, audio choices, and text-size preferences are not saved.

Refreshing or reopening the same address in the same browser normally restores completion. Clearing browser data, changing browsers or devices, or opening another address can reset it. Different origins (protocol, hostname, or port) have separate storage. Sites under the same origin share localStorage, even if their paths differ. Private browsing generally clears its stored data when the private session ends. Storage for direct `file:///` pages varies by browser and is not guaranteed.

Saved data is validated before use. Invalid data is ignored, and a correct main answer can replace invalid data in this app's own key. Other storage keys are never cleared or changed. If storage cannot be read or written, the app keeps available progress in memory and explains that it may not survive closing the page.

Before saving, the app merges valid stored completion with this tab's results. It also listens for updates to its own storage key from other tabs and merges their completion into the displayed progress. This prevents ordinary stale-tab overwrites, but localStorage has no atomic merge: precisely simultaneous writes can still race. Deleting storage does not remove completion already held in an open tab; reload after clearing data to start with empty progress.

The application code does not implement accounts, advertising, cookies, analytics collection, or external fonts. Completion stays in localStorage; the application does not send lesson progress to an external service. The examples are fictional; do not enter personal information. Hosting the website involves normal requests to Cloudflare and may involve hosting-provider logs.

### Cloudflare Web Analytics status

Cloudflare Web Analytics has been enabled for the hosted website. Successful collection and display of visitor statistics have **not yet been confirmed**. Enabling the feature is not proof that analytics collection is working.

The reviewed repository files contain no manually embedded Cloudflare analytics script. Hosting-side instrumentation may be separate from those files, so source inspection alone cannot establish the deployed analytics behavior. Completion storage is separate from visitor analytics.

The hosting and analytics configuration described here reflects information supplied by the maintainer. Cloudflare dashboard settings and successful statistics collection were not independently verified during this README review.

**Separate website update needed:** the existing footer in `index.html` still says “No advertising, registration, or tracking.” That blanket privacy statement needs a separate update because Cloudflare Web Analytics has been enabled, even though successful collection is unconfirmed. This README-only change does not update the website footer or change analytics settings.

Scam help contains optional links to official FTC, IdentityTheft.gov, and Medicare websites. They open only when selected and require an internet connection. Their current availability has not been checked online in this development session. Educational content is not an emergency response service.

## Files

- `index.html`: page structure, navigation, help, and completion messages.
- `app.js`: five lessons, optional practice, quizzes, saved completion, narration, navigation, and text sizing.
- `styles.css`: shared design and accessible controls.
- `mobile.css`: phone layout and navigation overrides.
- `check-mobile.cjs`: a local menu-behavior simulation using only built-in Node.js modules.
- `README.md`: these instructions.
- `.gitignore`: exclusions for local backups, private maintenance scripts, credentials, and local artifacts.

## Testing

If Node.js is already installed, these saved checks can be run from the project folder without installing packages:

```text
node --check app.js
node --check check-mobile.cjs
node check-mobile.cjs
```

The saved menu simulation checks 320, 390, 430, and 1200 pixel widths, open/close behavior, Escape, focus return, and desktop/mobile transitions. It does not render CSS.

During the October 25, 2026 README review, both JavaScript syntax checks and the saved menu simulation were rerun successfully. These checks do not verify real voice playback, rendered layout, screen-reader announcements, Cloudflare deployment settings, or visitor-statistics collection.

Additional regression checks have been run in memory during development. They cover all five lessons, all practice answer combinations, feedback, completion requirements, saved progress and storage failures, narration timing and cancellation, same-hash navigation, skip-link focus, distinct review-link names, and multi-tab storage synchronization. These broader checks are not saved as runnable test files in this repository. Do not treat the menu simulation alone as complete application validation.

Manual browser testing is still required:

1. Complete a main question, refresh, and reopen the same address to verify actual persistence. Try blocked storage and private browsing.
2. Open two tabs. Complete different lessons in each and confirm indicators update without optional practice changing completion.
3. Use Tab and the skip link; check that focus reaches main content. Check numbered review links, radio and checkbox groups, disclosures, retries, and screen-reader feedback/completion announcements.
4. At 320, 390, and 430 pixels, check 100%, 120%, and 150% app text. Look for overlap, clipped controls, sideways scrolling, and clear focus indicators. Check desktop layout too.
5. Listen in supported browsers. Test Pause/Play during speech and gaps, Stop, repeated clicks, new answers, lesson changes, unavailable voices, and quiet mode.
6. Check the deployed site's assets, all five lesson links (including a link already in the address), Back/Forward navigation, and external help links. Test real phones as well as responsive desktop views.

The reported Chrome live-site result, Edge narration result, Firefox limitation, and prior responsive-mode testing do not certify every browser or phone. Broader rendered-layout, actual-speech, and assistive-technology checks still require manual testing. Analytics collection must also be verified separately before reporting it as operational.

## Prepare a public repository safely

Review the file list before any commit or upload. The intended public source files are:

```text
.gitignore
README.md
app.js
check-mobile.cjs
index.html
mobile.css
styles.css
```

Keep historical hidden backup directories, `*.original`, `*.candidate`, the private `wording-update-reviewed.ps1` maintenance script, credential files, and local logs out of the public repository. Do not execute the maintenance script as part of publishing. Existing backup folders can remain on your computer.

The ignore rules do not remove files already tracked or erase history. Inspect both tracked files and ignored/untracked files before publishing. Resolve any Git inspection errors before assuming a file is private. Never upload the whole local folder indiscriminately.

## Hosting and release updates

CyberSafe Trainer 2 is published through Cloudflare Pages at [cybersafe-trainer-2.pages.dev](https://cybersafe-trainer-2.pages.dev). Its source is maintained in [schzamm/cybersafe-trainer-2](https://github.com/schzamm/cybersafe-trainer-2).

Cloudflare Pages is configured to deploy automatically from the repository's `master` branch. Pushing approved changes to that branch can trigger a production deployment. GitHub hosts the source; GitHub Pages is not the documented production hosting service.

The website is static. Its runtime files are `index.html`, `app.js`, `styles.css`, and `mobile.css`, kept together in the published directory. Relative asset paths and fragment-based lesson routes require no application server or server-side route rewriting. No application build or package installation is required.

Before pushing, review the exact staged files and changes. Keep backups, private maintenance scripts, credentials, and local artifacts excluded. `.gitignore` does not remove previously tracked files or provide deployment access control. Confirm that all files in the deployment output are appropriate to expose.

After deployment, verify the live site's assets, navigation, completion storage, accessibility, and narration. Confirm analytics separately before claiming that visitor statistics are being collected. Moving from local files or another origin creates separate saved progress.

The deployment configuration above is maintainer-reported; the local source files and tests do not independently verify Cloudflare settings. This documentation update does not commit, push, connect accounts, deploy, or change analytics configuration.

## Copyright and attribution

© 2026 CyberSafe Trainer 2. All rights reserved.

Created by schzamm with assistance from OpenAI's ChatGPT and Codex.
