# Spirebound — deferred mobile-migration Simulator tooling design

**Date:** 2026-07-11

**Status:** Deferred design specification; non-executable during Round 5

**Authority:** Owner activation is required before any implementation work

## 1. Decision and activation boundary

On 2026-07-11 the owner stopped the Round 5 Phase 0.5 Simulator programme.
The former eight-cell Safari/iOS Simulator matrix, its GO/NO-GO or warning
policy, and its later checkpoints are not Round 5 gates. Round 5 proceeds as a
commercial browser-engine and canvas programme under its independent
Playwright and WebKit-safe browser gates.

This document preserves the durable design for a future mobile-migration
programme. It is not an implementation plan, a compatibility plan, an
instruction to operate Simulator, or evidence that any mobile target is
supported. No current Round 5 task may execute any part of it. Tool
implementation may begin only after all of the following exist:

1. explicit owner activation of mobile migration;
2. a fresh predecessor and toolchain drift audit;
3. review and amendment of this design against then-current supported Apple
   interfaces;
4. a separate, detailed implementation plan for the automation tool.

The tool must then pass its own maturity gate before anyone writes or runs a
compatibility or support matrix.

## 2. Relationship to Round 5

The active [Round 5 Canvas UI, Content Registries & Ship-front
design](./2026-07-09-canvas-ui-shipfront-design.md) remains the source for the
browser-engine, canvas, content and ship-front programme. This deferred design
neither changes nor gates that work. Round 5's Playwright coverage, WebKit-safe
interface review and browser evidence continue independently.

Any retired Round 5 wording that describes Simulator Phase 0.5, an eight-cell
gate, a Simulator checkpoint or a Simulator-dependent exit criterion is
historical research context, not authority to execute this document. A future
mobile implementation plan must start from current `main` and the owner
activation, not revive those tasks mechanically.

## 3. Scope

This design covers only:

- preparation for an official Spirebound mobile migration;
- reusable automation of actual Safari in supported iOS/iPadOS Simulators;
- deterministic host, device, browser-session, orientation, route, input,
  semantic-classification, evidence and cleanup behaviour;
- local and self-hosted-runner invocation of the same tool interface;
- the proof required before that tool may drive a compatibility matrix.

It deliberately excludes:

- a present Round 5 gate or any present GO/NO-GO decision;
- a compatibility or support matrix and the choice of future supported models;
- physical-device testing or a physical-device gate;
- physical FPS, GPU or memory headroom, thermal behaviour, touch feel, input
  latency, background eviction or battery behaviour;
- Capacitor or other packaging, signing, distribution and App Store readiness;
- product changes intended to make a currently observed Simulator cell pass.

Under the current owner decision, no physical device is required. Adding one
requires a future explicit owner amendment to this design and a separate
device-evidence contract. Simulator evidence must never be presented as proof
of any excluded physical-device or packaging property.

## 4. Design principles

### 4.1 Tool first, matrix second

The automation tool is a prerequisite product of the future mobile programme,
not a thin script attached to each matrix cell. It must hide inventory,
lifecycle, orientation, transport, evidence and cleanup complexity behind one
small external interface. Callers describe the target and journey; the tool
owns how the target is prepared, exercised, proved and released.

The deletion test applies: removing the tool would force every caller to
reimplement device discovery, boot readiness, Safari readiness, orientation,
session recovery, evidence publication and cleanup. That depth is intentional.

### 4.2 Zero manual per-cell operation

After permitted one-time visible platform setup, a run requires zero human
window positioning, alignment, menu hunting, orientation nudging, route entry,
clicking, reload, evidence capture or cleanup. The same is true for every cell
and every retry. Operator nudging is never acceptance evidence.

One-time visible setup may grant supported platform permissions or install an
approved runtime. The tool must never:

- ask for a credential through a hidden terminal prompt;
- wake a sleeping Mac or display;
- unlock the Mac or a GUI session;
- bypass a platform permission;
- require a repeated manual action between cells.

If the host is not already awake, unlocked and logged into a usable GUI
session, preflight fails visibly before any managed-device mutation. A future
implementation may prevent new sleep only after preflight and only through a
child process whose ownership and termination it proves.

### 4.3 Transport is not product truth

Device boot, app readiness, WebDriver/RWI session establishment, orientation
control, route loading and evidence publication are infrastructure. A timeout,
disconnect, stale document, ambiguous target, cleanup fault or other transport
failure is `infrastructure_inconclusive`; it is never converted into a product
pass or failure.

The future compatibility plan may define product verdicts only after the tool
has produced a complete, current observation through a proved session.

### 4.4 Exact ownership

Every mutable resource has one owner namespace, run id and lifecycle record.
The tool may create, boot, change, close or delete only a resource recorded as
owned by that run or by its managed-device registry. A generic `booted` device,
frontmost window, partial name, requested model name or unrelated existing
Simulator is not ownership proof.

## 5. External interface and outcome model

The future implementation exposes one logical entry point to both local and CI
callers:

```text
run(request) -> runResult
```

The implementation plan may choose its package and command spelling only after
the drift audit. Local shell and self-hosted CI adapters must call this same
entry point with the same request schema; CI may add provenance, never a
separate orchestration path.

`request` contains:

- owner namespace and unique run id;
- exact source revision and cleanliness policy;
- required Xcode, Simulator runtime, Safari and host constraints;
- target class and exact resolved device/runtime identifiers;
- orientation, route, input profile and semantic journey;
- bounded per-state and whole-run deadlines;
- retry policy with a finite attempt count;
- evidence destination and publication policy.

`runResult` contains:

- `toolOutcome`: `passed`, `failed` or `infrastructure_inconclusive`;
- the exact inventory and provenance snapshot;
- lifecycle transitions and attempt records;
- raw observations, semantic classification and classifier identity;
- cleanup result and any cleanup debt;
- an artefact manifest and its hash;
- publication state: `published`, `not_published` or `cleanup_debt`.

During tool development, `passed` and `failed` describe only the tool's own
contract or representative smoke journey. They are not Spirebound mobile
support verdicts. `cleanup_debt` prevents a run from satisfying maturity even
if its semantic observations passed.

## 6. Tool architecture

The external interface is the test surface. The modules below are focused
internal seams, not separate user-facing commands.

### 6.1 Inventory and managed-device registry

The inventory module returns one immutable snapshot containing:

- selected Xcode path, version and build;
- available Simulator platforms, runtime identifiers, versions and builds;
- device types and exact identifiers;
- all matching managed devices with name, UDID, runtime, state and ownership;
- Safari/WebDriver/RWI capabilities exposed by that toolchain;
- host OS, architecture and usable-GUI-session facts.

The managed-device registry uses a Spirebound-specific namespace plus schema
version. It maps a logical target to exactly one UDID and records who created
it, from which device type/runtime, when it was last proved and whether it is
safe to reuse. It must reject name-only matches, duplicate ownership,
unsupported runtimes and devices not carrying the expected namespace record.

Registry reconciliation is deterministic: reuse a proved compatible managed
device or create one; never adopt or mutate an unrelated device. Deletion is
limited to owned managed devices explicitly selected by cleanup policy.

### 6.2 Host preflight and serial lease

The host-preflight module proves the Mac is already usable before mutation. Its
result covers awake/unlocked GUI state, platform permissions, available disk,
selected Xcode, runtime availability, Safari automation readiness, destination
writability and absence of incompatible owner debt.

A namespaced serial lease prevents concurrent runs from controlling the same
host, Simulator application or managed device. Lease acquisition is bounded;
stale-lease recovery requires owner and process identity proof. A surviving
unknown lock is cleanup debt, not permission to break the lock.

### 6.3 Deterministic lifecycle

The lifecycle module owns one state machine:

```text
preflight
  -> inventory_resolved
  -> lease_acquired
  -> device_acquired
  -> boot_requested
  -> boot_ready
  -> app_ready
  -> session_established
  -> document_proved
  -> journey_exercised
  -> evidence_sealed
  -> session_closed
  -> owned_state_cleaned
  -> lease_released
```

Every transition has a deadline, an idempotency rule, an observable completion
condition and a recorded source. Retries repeat a state transition, not an
unbounded bundle of shell actions. A failed transition enters bounded recovery
and then `infrastructure_inconclusive`; cleanup still runs from the last owned
state.

Boot completion requires the exact managed UDID and supported boot-status
truth. App readiness is separate from device boot. Fresh MobileSafari and RWI
readiness must be proved before requesting a Safari session. A session exists
only after the New Session operation returns a valid session id; no screenshot
or close operation is attempted against a session that never existed.

### 6.4 Orientation and viewport control

The orientation module accepts the exact managed UDID and desired supported
orientation, then returns an observation proving:

- requested and actual browser orientation;
- whether a change was required;
- the mechanism and exact target used;
- content viewport, visual viewport and safe-area facts;
- the natural Spirebound stage classification;
- the identity of the post-change document.

It must use then-current Apple-supported automation with exact target
ownership. It cannot depend on a human moving or aligning a Simulator window,
finding a device row, choosing a menu item or confirming the result. Generic
front-window state is not target identity.

If supported Apple automation cannot set and prove deterministic Safari
orientation, the tool phase must build and review a dedicated supported test
host or harness before compatibility execution. That harness must expose
orientation and viewport as a machine-verifiable interface and retain actual
Safari/iOS Simulator coverage for the compatibility journey. Repeated operator
nudging, coordinate clicks, visual alignment or an unproved accessibility
window transaction cannot satisfy tool maturity.

The existing exact-window ownership research remains a useful warning: a
requested model, a title prefix, a generic front window or a Window-menu row
did not prove which Simulator was acted on. The future drift audit must
revalidate the supported ownership mechanism rather than copy that workaround.

### 6.5 Browser session, route, input and document reproof

The browser-session module owns navigation and input for an established exact
session. It loads the exact route, waits for application readiness and records
the resulting document identity. Route and input parameters are explicit;
`shape=` or another test override cannot silently replace natural viewport
classification when the journey intends to measure it.

Any orientation change, route change, app restart, navigation recovery or
explicit reload invalidates prior document truth. Before semantic execution,
the module must re-prove on the new document:

- exact route and source revision;
- input profile and native pointer facts;
- browser orientation;
- content and visual viewport dimensions;
- safe-area mapping;
- natural stage shape;
- application and trace readiness.

All taps, gestures, reloads and journey actions are automated. Input delivery
and product response are recorded separately so that a transport failure
cannot masquerade as semantic behaviour.

### 6.6 Shared semantic classifier

The classifier is a Node-pure module shared with Playwright and the Semantic UI
Behaviour Trace. It accepts a versioned canonical observation and returns a
normalised semantic result without reading Simulator, the DOM, screenshots or
transport state itself.

Simulator and Playwright adapters may collect observations differently, but
they must serialise the same classifier input schema. Evidence records the
classifier source hash, schema version, input hash and output hash. Replaying a
stored canonical input through either lane must produce byte-identical
normalised output. Screenshots remain separate visual evidence and never
replace semantic classification.

### 6.7 Orchestration, deadlines and cleanup

The orchestrator runs targets serially. It is the sole owner of retries,
deadlines, cancellation and cleanup. Defaults are bounded and recorded; an
implementation plan must set values from measured tool behaviour rather than
allow implicit platform timeouts.

Cleanup is a `finally` obligation and has its own deadline. It closes only an
established owned session, terminates owned helper processes, restores or
deletes only owned managed state according to policy, removes its transaction
workspace and releases its lease. It must not shut down or erase unrelated
booted devices.

If cleanup cannot prove that only allowed managed state remains, the run ends
with `cleanup_debt`. A later run cannot overwrite or ignore that debt; an
explicit reconciliation operation must identify each surviving resource,
resolve it safely and publish a new reconciliation record.

### 6.8 Evidence and atomic publication

Each run first writes to a uniquely owned transaction directory. Required
artefacts are:

- machine-readable run manifest in JSON;
- append-only lifecycle, cell and classifier records in NDJSON;
- concise timestamped human-readable text log;
- inventory and host-preflight snapshot;
- raw route, input, viewport, safe-area, stage and trace observations;
- screenshots at named semantic checkpoints and on a proved-session failure;
- source provenance: repository revision and dirty state, route/fixture hashes,
  tool source hash, classifier hash, Xcode/runtime/Safari/host identities;
- cleanup and debt record;
- complete artefact list with byte size and cryptographic hash.

The publisher validates the manifest, closes streams, hashes every artefact
and atomically promotes the transaction directory to its final immutable
location. A partial copy, hash mismatch, pre-existing destination, abandoned
transaction, backup or lock is a visible publication failure. No report may
cite an unpublished transaction as compatibility evidence.

Timestamps, run ids and host-specific paths are explicitly volatile. A stable
normalised projection excludes only those declared fields; it never discards
viewport, classifier, outcome, source, lifecycle or cleanup facts.

### 6.9 Local and self-hosted CI integration

Local and self-hosted-runner adapters supply the same request to the same
entry point. The CI adapter records runner identity and exposes artefacts, but
does not duplicate lifecycle or verdict logic.

The self-hosted runner must fail preflight visibly when the Mac is asleep,
locked, missing its usable GUI session, missing a required permission/runtime,
ambiguous, already leased or carrying unresolved cleanup debt. It must not try
to wake, unlock or repair the host through hidden credentials. Those outcomes
are infrastructure setup failures, not Spirebound failures.

## 7. Tool-maturity gate

A full compatibility matrix is forbidden until one reviewed tool revision
satisfies every item below on the drift-audited toolchain.

### 7.1 Pure and deterministic proof

- Pure unit and contract tests cover inventory normalisation, registry
  reconciliation, lifecycle transitions, ownership, request validation,
  semantic classification, manifest generation and cleanup decisions.
- Fake-clock tests prove every transition and whole-run deadline without real
  waiting.
- Deterministic fault tests cover missing runtime, unavailable GUI, lease
  contention, boot timeout, app-not-ready, New Session rejection, stale
  document, orientation mismatch, route/reload failure, input transport
  failure, classifier rejection, partial publication, hash mismatch and
  cleanup failure.
- Every transport fault produces `infrastructure_inconclusive`, with no product
  verdict.
- Classifier replay from fixed canonical fixtures produces exact byte parity
  between Playwright, trace and Simulator adapters.

### 7.2 Representative integration smoke

- One representative phone and one representative pad are exercised in both
  portrait and landscape: four complete smoke cells.
- The inventory resolves exact current runtime, device type, name and UDID for
  every cell.
- Create or reconcile, boot, bootstatus, app readiness, session establishment,
  route load, orientation, post-change document reproof, automated input,
  evidence publication and cleanup all complete through the common entry
  point.
- Session establishment and app readiness are stable under bounded retries;
  no cell relies on an already convenient front window or generic booted
  device.
- There are zero manual per-cell alignment or action steps.
- Cleanup leaves only explicitly permitted namespaced managed devices, no
  owned helper process and zero transaction, backup, publication or lock debt.

### 7.3 Repeatability and invocation parity

- At least three consecutive runs against the same pinned source, toolchain
  and targets produce identical outcomes, lifecycle order, post-change
  viewport/stage facts, classifier inputs and outputs, and artefact-manifest
  shape after removing only declared volatile fields.
- Named deterministic screenshots have identical hashes; any screenshot not
  declared pixel-deterministic remains review evidence and cannot be used as a
  hidden semantic gate.
- A local invocation and a self-hosted CI invocation use the same entry point
  and request schema and produce the same stable normalised evidence contract.
- CI proves the unusable-host path fails visibly before mutation.
- Fresh review confirms the tool interface, supported Apple mechanisms,
  provenance, cleanup and maturity evidence.

Only the explicit result `TOOL_MATURE`, backed by the complete published
maturity archive and zero cleanup debt, allows the next planning stage. A
partial smoke, an infrastructure-inconclusive run, a manual nudge, an
unpublished transaction or an unresolved review finding yields
`TOOL_NOT_MATURE`.

## 8. Known iPhone SE research debt

The existing research observed this exact fact:

- iPhone SE (3rd generation) portrait Safari content viewport: `375x549`;
- the current aspect-only stage classifier naturally selects `pad-portrait`;
- the expected classification for that target is `phone-portrait`.

This is research evidence only. It is not a formal Round 5 GO/NO-GO, an
approved warning, a waiver or a current support claim. Before claiming iPhone
SE support, the future mobile programme must do one of the following:

1. correct the classifier or responsive contract and verify the result through
   the mature tool and a later compatibility plan; or
2. make an explicit owner support decision and document the resulting contract
   and evidence.

The debt cannot be silently inherited, downgraded to an exception or hidden by
forcing `shape=phone-portrait`.

## 9. Research handoff and provenance

The immutable disposable spike commit
`870489f559b829f7e8caefaa48a205aaab32b727` and the unfinished Task 4 runner
are research inputs only. They are not merged or published compatibility
evidence, do not close a gate and cannot be executed as the future programme
without:

- rebase onto then-current `main`;
- source, dependency, Xcode, iOS/iPadOS, Safari and host-toolchain
  revalidation;
- fresh design and code review;
- new evidence produced through the mature tool contract.

Useful root-cause learnings to preserve are:

- Safari content viewport and Simulator device screen are different facts;
- a freshly started MobileSafari/RWI path needs its own readiness proof after
  device boot;
- orientation changes invalidate prior document truth, so route reload and
  post-rotation reproof are required;
- exact-window ownership could not be inferred from model names, prefixes,
  generic front-window state or obsolete Window-menu rows;
- safe-area mapping belongs in the captured post-change browser observation;
- transport provenance and semantic provenance must remain separate.

These findings guide the future tool design. They do not make the spike or
runner an approved implementation.

## 10. Future activation sequence

The future programme follows this order without skipping or combining stages:

1. The owner explicitly activates mobile migration.
2. The programme audits current `main`, predecessor contracts, Xcode,
   iOS/iPadOS Simulator runtimes, Safari/WebDriver/RWI and the intended
   packaging target for drift.
3. Reviewers amend this deferred design for the supported interfaces and owner
   decisions that exist then.
4. A separate detailed implementation plan is written for the automation tool
   only.
5. The tool is built, independently reviewed and proved against the complete
   tool-maturity gate.
6. Only after `TOOL_MATURE` may a separate compatibility and support matrix
   plan be written and executed.

Owner activation does not itself authorise physical-device testing, packaging,
distribution or App Store work. Each remains outside scope until explicitly
added by the owner.

## 11. Present conclusion

This design records a deferred programme and closes no runtime, Simulator,
mobile-support or Round 5 gate. There is no executable action from this
document today. The correct current state is:

```text
DEFERRED — OWNER ACTIVATION REQUIRED — TOOL NOT YET BUILT
```
