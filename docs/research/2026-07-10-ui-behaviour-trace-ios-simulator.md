# Round 5 research: semantic UI behaviour trace and iOS Simulator

**Date:** 2026-07-10

**Status:** Accepted research basis; the Round 5 design specification is the canonical contract, not this note

**Scope:** iOS Simulator evidence limits, browser-automation boundaries, and a deterministic UI/UX behaviour trace for AI diagnosis and regression testing
**Owner decision after research:** Round 5 uses a Simulator-only mobile gate and makes no physical-device performance/feel claim; hardware evidence is deferred to the future Capacitor/hardware round.

## Executive conclusion

The proposed behaviour broadcast is sound production engineering. It should be a
**versioned structured semantic trace** with a text projection, not a stream of
ad-hoc `console.log()` messages. Tests consume the structured records; people and
AI agents read the timestamped text projection. This creates a runner-neutral
behaviour contract that Playwright and an iOS Safari WebDriver lane can both use.

iOS Simulator is valuable and can cover several representative iPhones and
iPads, but it cannot provide the evidence that an earlier P0.5 draft assigned
to a physical-device gate:

- It can prove that the page boots in the iOS Safari build, the intended Web APIs
  work, layouts and safe areas select correctly, synthetic pointer/touch flows
  reach the expected semantic states, and loss/restore handling works when loss
  is deliberately induced.
- It cannot establish an iPhone FPS floor, GPU or texture-memory headroom,
  finger-to-photon latency, drag *feel*, thermal behaviour, or survival under
  real-device memory pressure and background eviction. Apple explicitly says
  Simulator uses the Mac's CPU, memory, network and GPU resources and is not an
  accurate performance or memory test. Apple advises hardware for processing,
  graphics, networking, interaction and final verification.

Therefore Round 5 uses Simulator-only P0.5 as a **functional compatibility
GO/NO-GO** and makes no real-device performance/feel claim. The owner has
explicitly deferred those claims to the future Capacitor/hardware round; they
are not a hidden Round 5 blocker.

## 1. What iOS Simulator can and cannot prove

Apple's own boundary is unusually clear. Simulator is an app running on the Mac
and uses the Mac's resources. Apple says to use hardware for accurate processing,
graphics and networking performance, and for real-world interaction checks.
Apple also lists differences in display, system background handling, hardware,
APIs and Metal. See
[Running your app on simulated or physical devices](https://developer.apple.com/documentation/xcode/running-your-app-on-simulated-or-physical-devices).

For graphics specifically, Simulator does not emulate the selected iPhone's GPU.
It translates calls to the host Mac GPU, may expose different features and
limits, and cannot be used in Xcode to measure the app's memory footprint or
performance. Apple positions it for workflow and behaviour prototyping and says
to tune final graphics performance on hardware. See
[Developing Metal apps that run in Simulator](https://developer.apple.com/documentation/metal/developing-metal-apps-that-run-in-simulator)
and [Improving app responsiveness](https://developer.apple.com/documentation/xcode/improving-app-responsiveness).

Although Spirebound uses browser WebGL rather than calling Metal directly, iOS
Safari ultimately runs that graphics work on the platform graphics stack. The
same evidence boundary applies: a host-GPU Simulator result is compatibility
evidence, not an A-series GPU budget measurement.

| Question | Simulator evidence | What remains unproved |
|---|---|---|
| Does the game boot in iOS/iPadOS Safari with the required APIs? | Strong functional evidence on the installed Simulator runtime | Behaviour on other shipped OS versions and physical-device-only limits |
| Do viewport, safe-area, orientation and mobile WebKit behaviours work? | Strong functional evidence across selected simulated devices; WebKit explicitly recommends Simulator for viewport-meta, rendered type, double-tap and Home Screen web-app behaviour | Physical screen colour, legibility and touch-target feel; Apple notes display and user-interaction differences |
| Do taps, drags, cancellation and state transitions produce the intended game behaviour? | Good synthetic-input and semantic-trace evidence | Human drag feel, missed touches, palm/finger effects and end-to-end input latency |
| Can scene3d, mesh and Pixi contexts coexist and render? | Useful compatibility and nominal-stability evidence | Real device GPU limits, memory headroom, thermal throttling and the probability of a context being reclaimed |
| Does context loss recovery work? | Yes when loss is deliberately generated and the trace proves loss -> rebuild -> ready | Whether and when a real iPhone loses a context under OS/GPU pressure |
| Does background/foreground recovery logic run? | Nominal suspend/resume paths can be exercised | Real memory-pressure termination, tab/process eviction and long-suspension survival |
| Does the build meet an FPS or input-latency threshold? | No absolute device claim; only host-relative development measurements | The commercial performance and feel gate on supported hardware |
| Does it survive battery, thermal and constrained-device conditions? | No | All of these require hardware |

The background distinction matters for a three-context game. Apple says Simulator
and hardware differ in system background handling, while real iOS can terminate
background work under memory pressure. See [Reducing terminations in your app](https://developer.apple.com/documentation/xcode/reduce-terminations-in-your-app).
The WebGL specification also permits context loss because of mobile power or
memory conditions and requires resources to be rebuilt after restoration. A
deterministic test can induce the same state machine through
[`WEBGL_lose_context`](https://registry.khronos.org/webgl/extensions/WEBGL_lose_context/),
but that validates recovery logic, not real-world survival probability.

## 2. Playwright WebKit is not iOS Simulator Safari

There are three different test surfaces and their names should not be conflated:

1. **Playwright WebKit with an iPhone/iPad device descriptor.** Playwright's
   descriptors emulate parameters such as user agent, screen size, viewport and
   touch capability. Playwright states that its WebKit is a patched build derived
   from WebKit main and that it does **not** control branded Safari. See
   [Playwright browsers](https://playwright.dev/docs/browsers#webkit) and
   [Playwright emulation](https://playwright.dev/docs/emulation#devices).
2. **Safari inside an iOS Simulator.** This is the actual Safari supplied with
   that Simulator runtime. Apple supports automating it through `safaridriver`
   and the W3C WebDriver protocol, using `platformName: "iOS"` and
   `safari:useSimulator: true`. This support dates from iOS 13 and remains present
   in the current local `safaridriver(1)` manual. See WebKit's first-party
   [WebDriver is Coming to Safari in iOS 13](https://webkit.org/blog/9395/webdriver-is-coming-to-safari-in-ios-13/)
   and Apple's current [WebDriver overview](https://developer.apple.com/documentation/safari-developer-tools/webdriver).
3. **Safari on a physical iPhone or iPad.** Apple `safaridriver` can also target a
   paired device with Remote Automation enabled. That is the browser/hardware
   lane capable of closing mobile compatibility evidence, although performance
   and feel still need appropriately designed measurements or human checks.

Consequences:

- A Playwright project named `Mobile Safari` is not proof that iOS Simulator
  Safari, much less physical Safari, passed.
- Playwright cannot directly drive branded Safari or the iOS Simulator. A real
  Simulator-Safari lane uses a W3C WebDriver client, normally Selenium, against
  `safaridriver`.
- The same semantic trace can keep the assertions runner-neutral: Playwright can
  retrieve it with `page.evaluate()`, while WebDriver can retrieve it with its
  execute-script command.
- Safari permits only one WebDriver session at a time, so this lane is serial.
  Automation windows are isolated from normal Safari state. Apple's iOS
  WebDriver also suppresses notifications, system gestures, the software
  keyboard and other system content to reduce flakiness; it is not a
  general-purpose device automation API. System-level lifecycle exercises, where
  required, belong to XCUIAutomation or a controlled manual smoke. See
  [XCUIAutomation](https://developer.apple.com/documentation/xcuiautomation) and
  the safeguards in the WebKit WebDriver article above.

Safari and Web Inspector can inspect pages, service workers and Home Screen web
apps on both connected devices and simulators. Web Inspector is always enabled
for simulators. This is useful for diagnosing a failed Simulator lane, but it is
not itself a test runner. See [Inspecting iOS and iPadOS](https://developer.apple.com/documentation/safari-developer-tools/inspecting-ios).

### Local toolchain snapshot

The workstation inspected for this note currently has:

- macOS 26.5.2;
- Xcode 26.6 (build 17F113);
- iOS Simulator runtime 26.5 (23F77); and
- Playwright 1.61.1 in this repository.

`xcrun simctl list devicetypes` confirms current definitions for iPhone 17,
iPhone 17 Pro/Pro Max, iPhone SE (3rd generation), iPad mini (A17 Pro), and
iPad Pro 13-inch (M5), among others. The exact CI matrix must be selected from
the runtime installed on the CI Mac and recorded in the test artefact; a device
name alone is not a reproducible environment.

A compact representative compatibility matrix for the four mobile stage-shape
families is:

| Simulated device | Coverage role | Orientations |
|---|---|---|
| iPhone SE (3rd generation) | Small legacy phone viewport; no modern sensor-housing safe area | Portrait + landscape |
| iPhone 17 Pro | Current mainstream phone geometry and safe area | Portrait + landscape |
| iPad mini (A17 Pro) | Compact tablet extremes | Portrait + landscape |
| iPad Pro 13-inch (M5) | Large tablet extremes | Portrait + landscape |

An iPhone 17 Pro Max can be added as a breadth case, but running more simulated
models does not add hardware-performance coverage: they still share the Mac's
CPU, memory and GPU. The matrix should gate geometry, browser compatibility and
semantic behaviour, never compare model-labelled FPS numbers.

## 3. A deterministic semantic behaviour trace

### The contract

The canonical record should be structured, versioned and JSON-safe. A text line
is derived from it. One main-thread collector assigns the sequence number at the
instant it accepts an event.

```json
{
  "v": 1,
  "segment": "page-1",
  "seq": 42,
  "atMs": 1342.375,
  "eventName": "presentation.card-flight",
  "phase": "end",
  "outcome": "settled",
  "screen": "combat",
  "subject": { "kind": "card", "instanceId": "c7", "contentId": "strike" },
  "causeSeq": 39,
  "correlationId": "play-c7-3",
  "attributes": { "destination": "discard", "motion": "full" },
  "checkpoint": { "queueDepth": 0, "inputMode": "ready" }
}
```

The corresponding AI-readable projection can be:

```text
[+01342.375ms #000042] presentation.card-flight phase=end outcome=settled card=c7/strike destination=discard cause=#000039 queue=0 input=ready
```

Required semantics:

- **`seq` is the authoritative total order.** It is a contiguous, strictly
  increasing integer within a page segment. Timestamp equality, timer
  coarsening or async scheduling cannot make event order ambiguous.
- **Incremental cursors are composite.** A consumer resumes from
  `{ segment, seq }`, not `seq` alone. When reload creates a new segment and
  restarts sequence numbering, a stale-segment cursor resets to that new
  segment's header and first record rather than suppressing them.
- **`atMs` is diagnostic elapsed time, not ordering and not golden-test data.**
  Capture it with `performance.now()` at collector acceptance. High Resolution
  Time defines this against a monotonic clock, unlike `Date.now()`, which is
  subject to wall-clock adjustment. Timer precision may be coarsened or jittered
  for privacy, and background contexts may be throttled or frozen. See
  [High Resolution Time](https://www.w3.org/TR/hr-time-3/).
- **`performance.timeOrigin` belongs once in the trace header.** It can correlate
  elapsed values with other same-session contexts, but neither it nor a wall
  clock should be used to order records across browser restarts. A reload starts
  a new `segment` and sequence.
- **Causality is explicit.** `causeSeq` links the immediate cause;
  `correlationId` links an input, engine command, queue playback and animation
  lifecycle. Tests should not have to infer causality from close timestamps.
- **Payloads are immutable plain data.** Store stable content/instance IDs,
  reason codes and small state checkpoints, not DOM nodes, Pixi objects,
  functions or mutable engine objects.
- **One acceptance point owns ordering.** If workers are introduced later, they
  send records to the main collector and the collector assigns `seq`. Merging
  independent worker logs by timestamp would not produce a deterministic total
  order.
- **The buffer is bounded and observable.** Export `firstSeq`, `lastSeq` and a
  dropped-record count. A regression test fails if its trace overflows; silent
  truncation would make a passing assertion untrustworthy.
- **Lifecycle is orthogonal to event identity.** `eventName` names the stable
  semantic operation; `phase` is `point`, `start`, or `end`. An end record has
  exactly one outcome: `completed`, `settled`, `cancelled`, `skipped`, or
  `failed`. Do not create separate `.started` and `.settled` event names.

### Semantic events, not render noise

The useful vocabulary describes behaviour boundaries:

- `input.*`: acceptance, rejection and cancellation boundaries;
- `command.*`: engine-command commitment boundaries;
- `screen.*` and `state.*`: navigation and compact checkpoints;
- `playback.*` and `presentation.*`: queue and animation span identities;
- `lifecycle.*`: visibility, focus, audio state and pause/resume;
- `renderer.*`: readiness and context recovery; and
- `error.*`: uncaught playback or invariant failures.

For example, card drag should be readable as input received -> drag accepted ->
target resolved -> engine command committed -> queue item started -> flight
settled -> input ready. Rejection and cancellation need stable reason codes.
A presentation start without exactly one end carrying `settled`, `cancelled`,
`skipped`, or `failed` is then mechanically detectable.

Do not emit every pointer move, tween sample or render frame by default. Those
records hide the behavioural story, add runtime overhead and make AI diagnosis
worse. A separate temporary verbose channel can exist for a focused diagnosis.

### Why Performance Timeline is an adjunct, not the log

Selected start/end pairs can also be mirrored to User Timing marks and measures
so browser performance tools can display them. User Timing supports structured
`detail`, and `PerformanceObserver` can receive marks and measures. However, the
Performance Timeline is not an appropriate canonical behaviour ledger:

- observer delivery is asynchronous and deliberately scheduled at low priority;
- browser-defined buffers are bounded and can report dropped entries; and
- timestamps and generated performance-entry IDs are not an application-owned
  deterministic sequence.

See [User Timing](https://www.w3.org/TR/user-timing/) and
[Performance Timeline](https://www.w3.org/TR/performance-timeline/). The
application trace should own retention and order; User Timing should mirror only
the spans that are useful for performance analysis.

## 4. Playwright and CI consumption without screenshots

The trace should expose a small read-only probe surface that returns structured
records and the derived text. It should be present from application boot in
debug/test mode, not reconstructed by observing the DOM after the fact. This is
especially important once combat UI state moves into Pixi.

Playwright can then consume it in four ways:

1. **Wait on semantic predicates.** Use `page.evaluate()` plus Playwright's
   retrying `expect.poll()` to wait for a terminal event or checkpoint instead of
   sleeping for a guessed animation duration. Playwright documents both page
   evaluation and retrying assertions in [Page](https://playwright.dev/docs/api/class-page#page-evaluate)
   and [Assertions](https://playwright.dev/docs/test-assertions#expectpoll).
2. **Assert a normalised behavioural projection.** Remove `atMs`, time origin,
   runtime identity and other diagnostic values. For seeded, fully deterministic
   flows, compare the exact event-type/reason/state sequence. For async flows,
   assert causal partial orders and invariants rather than a whole-log snapshot.
3. **Fail on trace integrity.** Every test checks schema version, contiguous
   sequence, no dropped records, no unexpected `error.*`, and no lifecycle that
   begins without one terminal event.
4. **Attach failure evidence.** On failure or retry, attach both NDJSON and the
   text projection with `testInfo.attach()`. Playwright reporters preserve these
   attachments as test artefacts; see [TestInfo.attach](https://playwright.dev/docs/api/class-testinfo#test-info-attach).

Playwright's `browserContext.addInitScript()` can install test configuration
before application scripts run, and `browserContext.exposeBinding()` can bridge
page and runner. Both are documented in
[BrowserContext](https://playwright.dev/docs/api/class-browsercontext). A binding
call for every event should be avoided because asynchronous cross-process calls
can perturb the behaviour being measured. Keep synchronous records in the page,
then pull them in batches or at checkpoints.

The equivalent Simulator-Safari WebDriver test retrieves the same export using
execute-script, applies the same normaliser and assertions, and emits the same
NDJSON/text artefacts. This avoids maintaining a second definition of correct UI
behaviour merely because the runner differs.

### Appropriate regression assertions

| Assertion | Suitable for the semantic trace? |
|---|---|
| Correct screen progression and combat state checkpoints | Yes |
| Input accepted/rejected/cancelled for the correct reason | Yes |
| Engine command precedes playback; animation reaches one terminal state | Yes |
| No queue stall, uncaught playback error or trace overflow | Yes |
| Exact elapsed milliseconds on every CI run | No; keep time as diagnostic data or a separately budgeted performance test |
| Correct pixel, clipping, z-order, colour, font rasterisation or shader output | No; retain targeted visual tests and human/device review |
| Physical drag feel and finger-to-photon latency | No; physical-device evidence |

This is not a reason to remove screenshot baselines. It is a separation of
proofs: semantic traces prove *what happened and in what causal order*;
screenshots and device review prove *what was actually rendered and how it
felt*. A commercial-grade gate needs both, but most behavioural regressions can
be diagnosed from compact text and structured state without asking an AI agent
to interpret a video or sequence of screenshots.

## Recommended specification-level position

1. Treat the UI behaviour trace as a first-class, schema-versioned observability
   contract shared by DOM and Pixi code, with structured records as truth and a
   timestamped text projection for AI/human diagnosis.
2. Make functional Playwright tests assert semantic events and state checkpoints;
   preserve visual tests for visual claims and a separate performance lane for
   timing budgets.
3. Use Playwright WebKit emulation for fast cross-browser coverage and Apple
   `safaridriver` for the representative iOS/iPadOS Simulator Safari matrix. Do
   not describe either one as the other.
4. Reframe a Simulator-only P0.5 as a compatibility gate. It may green-light
   architecture work if its written criteria are limited to functional claims,
   but it must not close FPS, input-feel, GPU-memory or background-eviction
   claims. Those remain explicitly outstanding until physical hardware evidence
   exists.
