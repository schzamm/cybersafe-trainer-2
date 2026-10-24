# CyberSafe Trainer 2

A free, beginner-friendly cybersecurity learning website for adults. It includes five lessons about bank impersonation, family emergency requests, government calls, fake technical support, and delivery and shopping scams.

The website uses plain HTML, CSS, and JavaScript. There is no installation, package dependency, application build, account, advertising, or analytics.

## Open and use the website

Open `index.html` in your browser. In Firefox, press **Ctrl+O** and choose the file. Keep `app.js`, `styles.css`, and `mobile.css` beside it.

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

Readings include a 400ms pause after lesson titles and activity headings, plus a 200ms pause after selected first-defined terms. Pausing during a gap preserves its remaining duration.

Use **A+** and **A−** to adjust text from 100% to 150%. Browser zoom also works. Text size and audio preferences are not saved. Controls have visible focus outlines and large touch targets.

Tab moves between controls. Space selects a checkbox; arrow keys move within a radio group. Enter activates a focused link or button, and Space also activates buttons. The **Skip to main content** link moves focus to the main content. Phone navigation uses **Menu**; Escape closes it and returns focus.

## Saved completion and privacy

Only completed lesson identifiers are saved in localStorage under this app's key, `cybersafe-trainer.completed-lessons.v1`. The saved object contains a version and those identifiers. Answers, passwords, personal information, audio choices, and text-size preferences are not saved.

Refreshing or reopening the same address in the same browser normally restores completion. Clearing browser data, changing browsers or devices, or opening another address can reset it. Different origins (protocol, hostname, or port) have separate storage. Sites under the same origin share localStorage, even if their paths differ. Private browsing generally clears its stored data when the private session ends. Storage for direct `file:///` pages varies by browser and is not guaranteed.

Saved data is validated before use. Invalid data is ignored, and a correct main answer can replace invalid data in this app's own key. Other storage keys are never cleared or changed. If storage cannot be read or written, the app keeps available progress in memory and explains that it may not survive closing the page.

Before saving, the app merges valid stored completion with this tab's results. It also listens for updates to its own storage key from other tabs and merges their completion into the displayed progress. This prevents ordinary stale-tab overwrites, but localStorage has no atomic merge: precisely simultaneous writes can still race. Deleting storage does not remove completion already held in an open tab; reload after clearing data to start with empty progress.

The app has no accounts, cookies, analytics, tracking, external fonts, or network requests for saving progress. The examples are fictional; do not enter personal information. Normal website hosting still involves requests to the hosting provider and may involve its server logs.

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

Additional regression checks have been run in memory during development. They cover all five lessons, all practice answer combinations, feedback, completion requirements, saved progress and storage failures, narration timing and cancellation, same-hash navigation, skip-link focus, distinct review-link names, and multi-tab storage synchronization. These broader checks are not saved as runnable test files in this repository. Do not treat the menu simulation alone as complete application validation.

Manual browser testing is still required:

1. Complete a main question, refresh, and reopen the same address to verify actual persistence. Try blocked storage and private browsing.
2. Open two tabs. Complete different lessons in each and confirm indicators update without optional practice changing completion.
3. Use Tab and the skip link; check that focus reaches main content. Check numbered review links, radio and checkbox groups, disclosures, retries, and screen-reader feedback/completion announcements.
4. At 320, 390, and 430 pixels, check 100%, 120%, and 150% app text. Look for overlap, clipped controls, sideways scrolling, and clear focus indicators. Check desktop layout too.
5. Listen in supported browsers. Test Pause/Play during speech and gaps, Stop, repeated clicks, new answers, lesson changes, unavailable voices, and quiet mode.
6. Check the deployed site's assets, all five lesson links (including a link already in the address), Back/Forward navigation, and external help links. Test real phones as well as responsive desktop views.

Prior responsive-mode and Edge narration testing does not certify every browser or phone. Current rendered layouts, actual speech, and assistive-technology announcements need manual verification.

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

## GitHub Pages and Cloudflare Pages preparation

Both targets can serve this website as static files. The runtime needs only `index.html`, `app.js`, `styles.css`, and `mobile.css` in the same published directory. All asset paths are relative; lesson routes use URL fragments such as `#lesson-1`, so they do not require server-side route rewrites.

For GitHub Pages, publish the approved source using a Pages configuration that serves the directory containing `index.html` at its root, such as the root of the chosen publication branch. There is no app-specific build command or Node.js runtime requirement. A repository-subdirectory URL should work with the existing relative paths.

For Cloudflare Pages, use a no-framework static-site configuration. Point the deployment output directory at the approved static files, with `index.html` at its root. No application build, package installation, Functions, Workers, or external integration is required. If deploying the repository root, confirm that all files in that output are appropriate to expose; `.gitignore` is not a general deployment access-control mechanism.

Do not enable analytics or add remote scripts. Review the hosting provider's current setup instructions and privacy/logging settings before connecting accounts or deploying; no live platform configuration has been verified by these local tests. Test the final HTTPS address, because moving from local files or another origin creates separate saved progress.

No commit, push, account connection, or deployment is performed by these instructions.
