# Local regression and browser checks

No dependency installation or application build is required for the deterministic suite.

## Deterministic application suite

From the project root, using an already installed Node.js with node:test support:

~~~text
node --test tests/regression.test.cjs
node check-mobile.cjs
~~~

The suite executes the unchanged app.js against the actual index.html markup in a small DOM model. It uses fake clocks, local speech voices, storage, and events. It covers every main/follow-up answer, warning-sign checkbox combinations, retries, completion rules and review labels, storage validation/failure/restoration, multi-tab merging, routing, text-size bounds, and narration loading/pauses/Stop/stale callbacks.

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

The live URL defaults to the published Cloudflare Pages site. An optional CYBERSAFE_PERF_URL can select another approved HTTPS site without credentials or query parameters. Live navigations may appear in the site's existing Cloudflare measurements; the runner adds no analytics or third-party scripts. Measurement scripts run only in the isolated test browser.

Generated reports and app-only screenshots are saved to tests/artifacts/, which is ignored by Git. The report records the browser version, emulation settings, individual measurements, failures and limitations. Resource URLs omit query parameters; no request headers, IP addresses, visitor identifiers, or personal profile information are collected.

## Remaining manual checks

- A screen reader must confirm actual feedback and completion announcements. Accessibility-tree properties establish semantics, not audible announcements.
- Listen to local-English narration in supported browser/device combinations. Headless speech mocks do not establish actual voice output.
- Test physical phones, browser zoom, alternative operating-system text settings, private browsing, and blocked storage.
- Test production separately from local checks: Cloudflare can inject scripts outside the repository.
- Small lab samples cannot explain every poor LCP reported by real visitors. Inspect the relevant field sample count, route, browser/device and timing breakdown before optimizing.

See PHASE1-REVIEW.md for the recorded investigation and its limitations.
