# Phase 1 review — November 12, 2026

## Scope and changes

Added permanent tests and documentation; corrected the outdated README statement about the footer analytics notice. No lesson/practice content, application JavaScript, HTML, CSS, analytics, backend, dependency or hosting configuration was changed. No installation, commit, push or deployment was performed.

The only existing configuration change is a narrow .gitignore rule for generated tests/artifacts/. Test source and documentation are intended to remain reviewable; screenshots and transient machine reports are excluded.

## Automated results

- 59 built-in Node regression tests passed, with zero failures.
- Existing menu simulations passed at 320, 390, 430 and 1200px.
- Full real-browser run: 27 assertions passed, zero failures; 12 live LCP samples collected.
- The final local-only browser repeat also passed all 27 assertions and captured lesson-heading screenshots without additional live-site requests.
- Source syntax checks passed.
- A first browser run had one test-fixture failure: the persistence assertion expected one completed lesson after earlier keyboard tests had already completed more than one. The test was isolated in a fresh context; the corrected full run passed. No production change was needed.

## Performance method

Installed Google Chrome 157.0.8103.40 was driven headlessly with the already bundled Playwright package on Windows x64. No browser or package was installed.

- Live homepage: https://cybersafe-trainer-2.pages.dev/
- Direct lesson: https://cybersafe-trainer-2.pages.dev/#lesson-1
- Viewport 390×844, mobile/touch emulation, device scale factor 2.
- Emulated latency 150ms, download 200,000 bytes/sec, upload 93,750 bytes/sec, CPU slowdown 4×.
- Three independent cold/warm pairs per URL.
- Cold: fresh context and cleared browser HTTP cache. OS DNS/TLS and CDN caches were not guaranteed cold.
- Warm: reload in the same context, HTTP cache enabled. Network revalidation can still occur.
- PerformanceObserver recorded LCP candidates and long tasks; navigation/resource timing recorded response and load milestones.
- Each page was observed for three seconds after load. These are lab samples, not field percentiles or Lighthouse scores.

## Measured LCP

All times below are milliseconds. These are the final corrected full-run measurements.

| Page | Cache | Three LCP samples | Median | TTFB range |
| --- | --- | --- | --- | --- |
| Homepage | Cold | 656, 592, 588 | 592 | 175–183 |
| Homepage | Warm | 396, 404, 384 | 396 | approximately 151 |
| Direct Lesson 1 | Cold | 624, 648, 620 | 624 | 176–180 |
| Direct Lesson 1 | Warm | 404, 404, 432 | 404 | approximately 151 |

The observed LCP element in every sample was p.welcome-intro: the welcome introduction paragraph. This was also true for the direct lesson navigation. LCP therefore did not specifically measure the moment all lesson controls became usable.

No sample reproduced poor multi-second LCP. The maintainer-reported 67% good / 33% poor small visitor sample cannot be explained by these lab results alone.

## Measurable timing observations

- Cold stylesheet responses finished around 398–438ms; warm responses around 365–409ms. Warm stylesheet requests still lasted approximately 163–181ms under the emulated latency, so warm reload did not eliminate network waiting.
- app.js was the largest first-party asset. In the observed deployed responses its encoded body was about 15.3KB; cold responses finished around 528–559ms. Warm first-party asset responses were smaller but still involved network timing.
- Cold direct-lesson loads recorded 115–153ms long tasks. The observer does not provide function-level attribution, so these cannot be assigned to a specific app function or used alone to justify a rewrite.
- The existing Cloudflare beacon and RUM endpoint appeared in the live resource list. No analytics script was added by the tests. Observing requests does not confirm dashboard statistics, and cross-origin transfer sizes can be unavailable.
- Favicon requests appeared after LCP in this run; they are not established as the cause of slow LCP.

No production optimization was applied. Further investigation should target actual poor field visits: sample count and time range, landing URL/hash, browser/device, connection conditions, TTFB, and a browser performance trace that reproduces the delay. Do not infer a universal performance pass or promise improvement from these 12 samples.

## Keyboard, focus and mobile findings

The real-browser tests checked the local source using a temporary whitelist-only 127.0.0.1 server, which was closed after testing.

- Tab/Enter skip navigation focused main content.
- Mobile Menu responded to Enter and Escape, and Escape returned focus.
- Text-size controls reached 150% (30px root text).
- Homepage, expanded navigation, all five lessons and both optional activities passed horizontal overflow/control-clipping checks at 320px/150%.
- Radio arrow-key selection, checkbox Space activation, submitting answers with Enter, practice retries and skip behavior worked.
- Main quiz feedback was visible and exposed as a polite status in Chrome's accessibility tree.
- Completion restored after a real browser reload in an isolated context.
- No application JavaScript errors were reported.

Screenshots support layout inspection but do not establish screen-reader announcements or audible speech. At the enlarged size, the brand and Menu may occupy separate rows and more vertical scrolling is expected.

## Remaining limitations and manual checks

- Confirm actual feedback/completion announcements with a screen reader. An accessibility-tree property is not proof it was spoken, particularly for feedback that changes from hidden to visible.
- Listen to local-English narration on real supported devices/browsers. Narration state-machine tests use a simulated speech engine.
- Test physical phones and zoom/system text settings beyond the measured viewport/text combination.
- Precisely simultaneous localStorage writes still have the documented non-atomic race limitation.
- Live results depend on this browser, host computer, network, emulation, observation window and cache definitions. They do not establish the cause of Cloudflare's poor field samples.
- Existing analytics collection/dashboards were not administratively inspected; no new lesson analytics or visitor identifiers were introduced.
- Full application tests and browser checks are now saved. There are no added npm/package dependencies; the optional browser runner needs existing Playwright and a browser and reports unavailability instead of installing them.

## Reproduction and artifacts

See tests/README.md. Use node --test tests/regression.test.cjs for deterministic regression checks. Run tests/browser-check.cjs with the documented existing-tool environment variables for real measurements; --local-only skips live navigations.

Generated JSON and screenshots are under tests/artifacts/ and excluded by .gitignore. They contain app/test measurements, not IP addresses or visitor profiles. No application server is left running by the browser runner.
