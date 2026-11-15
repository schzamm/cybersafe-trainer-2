# Local regression and browser checks

Shared-player coverage tests all five lessons: actual-heading selector labels, changing sections while speaking/paused/loading, synchronized selectors, Stop retaining the selected section, stale callbacks, optional practice selection, and Skip selecting the quiz without starting audio. Real-browser checks repeat Play/Pause/Stop, keyboard section selection, and Skip at all four viewport sizes with 150% text; the Lesson 1 matrix also checks 100% text. Lessons and saved-completion rules are unchanged. Browser speech uses deterministic mocks and does not establish actual device voice output.
Floating-player regression coverage uses fresh isolated browser contexts at 390×844, 412×922, 320×568 and desktop 1280×900 CSS pixels. It checks 100% and 150% app text, activation-only visibility, paused visibility, Continue lesson, keyboard control, Stop/focus restoration, button bounds, horizontal overflow, and the reserved page/player boundary. It also checks that focused clue controls and the footer remain reachable above the player. Screenshots named `floating-WIDTH-HEIGHT-SIZE.png` are written only to ignored `tests/artifacts/`. Speech is mocked for repeatability; actual audio and physical devices still require manual testing.
No dependency installation or application build is required for the deterministic suite.

## Deterministic application suite

From the project root, using an already installed Node.js with node:test support:

~~~text
node --test tests/regression.test.cjs tests/simulation.test.cjs tests/bank-examples.test.cjs tests/lesson-flow.test.cjs
node check-mobile.cjs
~~~

The suite executes the current app.js against the actual index.html markup in a small DOM model. It uses fake clocks, local speech voices, storage, and events. It covers every main/follow-up answer, warning-sign checkbox combinations, retries, completion rules and review labels, storage validation/failure/restoration, multi-tab merging, routing, text-size bounds, and narration loading/pauses/Stop/stale callbacks.

The separate simulation suite checks the optional Lesson 1 fictional inbox, sender/destination/pressure disclosures, inert verification control, both decision explanations, reset and focus, completion/storage independence, the 400ms heading pause, playback controls, delayed voices, stale callbacks, and unavailable speech. Regression assertions have been updated for the current lesson layout and narration behavior.

The model deliberately does not claim to implement CSS layout, native browser keyboard behavior, audio output, or a screen reader. Do not interpret a model test pass as a rendered accessibility pass. Missing IDs and changed form relationships fail because the harness reads the real markup.

## Optional real-browser checks

tests/browser-check.cjs uses an already installed Playwright module and an existing Chrome or Edge executable. It does not run npm, install dependencies, download browsers, use a personal browser profile, or change security settings.

Set these process-local environment variables to paths on your own computer:

~~~powershell
$env:CYBERSAFE_PLAYWRIGHT_MODULE = '<existing Playwright module directory>'
$env:CYBERSAFE_BROWSER_EXECUTABLE = '<existing Chrome or Edge executable>'
node tests/browser-check.cjs
~~~

If Playwright is already resolvable by Node, the module variable can be omitted. Missing prerequisites are reported as unavailable (exit code 2), not passed. Browser launch or assertion failures return exit code 1.

For a repeat of only the local keyboard/layout/persistence checks, run `node tests/browser-check.cjs --local-only` with the same environment variables. This skips live-site navigations and writes `phase1-browser-local.json` separately, preserving the performance report.

The runner:

1. Uses an isolated headless Chromium profile.
2. Visits the live homepage and /#lesson-1 three times each, with a cold navigation and warm reload per repetition: 12 measurements total.
3. Uses 390×844 mobile/touch emulation, device scale factor 2, 150ms emulated network latency, 200,000 bytes/second download, 93,750 bytes/second upload, and 4× CPU slowdown.
4. Clears browser HTTP cache before each cold/warm pair. It does not guarantee cold operating-system DNS/TLS or CDN caches. Warm reloads keep browser HTTP caching enabled but can still perform conditional network revalidation.
5. Observes LCP candidates, FCP, navigation/resource timings and long tasks for three seconds after load. These are bounded lab measurements, not field percentiles or a Lighthouse score.
6. Starts a temporary 127.0.0.1 server on an OS-assigned port. Only index.html, app.js, styles.css and mobile.css are served; it exposes no test files or directory listing.
7. Checks real browser keyboard/focus behavior, feedback status semantics in the accessibility tree, and 320px layout at 150% app text across the homepage, menu, lessons and practice. A separate isolated context tests persistence.
8. Closes the test browser and temporary server in finally cleanup.

The local run also tests the fictional-email exercise in a separate isolated context: native keyboard activation and tab order, feedback accessibility-tree semantics, reset focus, fresh state after lesson navigation, and 320px/150% layout. It blocks external requests in that context and checks that exercise interactions cause no requests, navigation, new pages, or storage changes. Screenshots of the exercise are saved with the other ignored artifacts. These checks add no production instrumentation.

The live URL defaults to the published Cloudflare Pages site. An optional CYBERSAFE_PERF_URL can select another approved HTTPS site without credentials or query parameters. Live navigations may appear in the site's existing Cloudflare measurements; the runner adds no analytics or third-party scripts. Measurement scripts run only in the isolated test browser.

Generated reports and app-only screenshots are saved to tests/artifacts/, which is ignored by Git. The report records the browser version, emulation settings, individual measurements, failures and limitations. Resource URLs omit query parameters; no request headers, IP addresses, visitor identifiers, or personal profile information are collected.

## Remaining manual checks

`lesson-flow.test.cjs` checks the continuous page plus Lesson 1’s audio-only section bookmark, teaching order, exploration waits, optional Read Example messages, primary Play/Pause/Stop, section scrolling/highlighting, reduced motion, delayed voices, stale callbacks, collapsed-quiz behavior, and unchanged focus, progress and Lessons 2–5 readings. Browser checks exercise the same controls with native keyboard activation at 320px/150% text. A real-DOM test uses deterministic local speech and observes actual scroll calls and highlight attributes. These tests verify behavior, not audible voice output or screen-reader announcements.

The bank-example suite tests initially hidden clue explanations, safe sender/link/reply controls, reset focus, no storage or completion effects, lesson isolation, and shared speech cancellation. The local browser run additionally exercises every clue with the keyboard, inert actions, 320px/150% overflow checks, reduced-motion interaction, reset focus, and navigation away. Both mock interfaces contain no links, forms, credential fields, or network actions.

- A screen reader must confirm actual feedback and completion announcements. Accessibility-tree properties establish semantics, not audible announcements.
- Listen to local-English narration in supported browser/device combinations. Headless speech mocks do not establish actual voice output.
- Test physical phones, browser zoom, alternative operating-system text settings, private browsing, and blocked storage.
- Test production separately from local checks: Cloudflare can inject scripts outside the repository.
- Small lab samples cannot explain every poor LCP reported by real visitors. Inspect the relevant field sample count, route, browser/device and timing breakdown before optimizing.

See PHASE1-REVIEW.md for the recorded investigation and its limitations.
