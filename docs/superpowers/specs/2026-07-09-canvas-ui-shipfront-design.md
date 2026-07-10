# Spirebound — Round 5: Canvas UI, Content Registries & Ship-front (design)

**Date:** 2026-07-09 (revised same day: content-registry & dev-tooling amendment;
revised again after three independent reviews — gstack four-lens, ponytail
over-engineering, ask-matt grilling — with owner decisions recorded below;
revised 2026-07-10: commercial-grade production framing, semantic UI behaviour
trace, iOS Simulator Safari coverage, and explicit Production Engineering /
Front-end Experience agent ownership)
**Goal:** The commercial-grade production-engineering and final visual-hardening
round. Replace the fragile CSS-composited
combat UI with a **game-rendered PixiJS layer** (chrome *and* hand cards),
rebuild the content substrate as **registries + compiled-in content packs** so
expansions and Act 4 become data drops instead of codebase surgery, grow the
dev tooling (Content Lab, completeness reporting, Content Manager), give
every remaining screen (title, Embark, fallen/victory, non-combat panels, map)
its award-bar treatment, extend the already-merged CI gate for the new
contracts, and clear the remaining ship-front backlog (per-boss stages, store
visual kit, unlock-toast art). After this round the game should
present, behave, diagnose, and regress like a commercial-grade product, and new
content should register instead of being wired.
**Executor:** a lower-grade agentic LLM. Every workstream must be broken into
mechanical, individually-verifiable tasks in the implementation plans; nothing
may rely on executor taste or judgement. Where this spec demands judgement
(art direction, ceremony feel), the task is explicitly marked **owner
checkpoint**, never left to the executor.
**Predecessors:** `2026-07-06-visualisation-hardening-polish-design.md`
(fixed stage, Playwright kit, invariants), `2026-07-09-ui-chrome-assets-design.md`
(the 27-asset `src/assets/ui/` kit this round reuses as textures),
`2026-07-09-pile-chrome-ceremony-design.md` (flight budgets carried over),
`2026-07-09-entrance-progressive-delivery-design.md` (**hard prerequisite:**
Phase 2 — variants, Emberglass chain, rose window — must be merged before this
round's runtime work starts; this spec assumes those surfaces and tables exist.
Documentation/planning and unpromoted FE concept work may prepare earlier, but
they are not Round 5 runtime execution.)

## Decisions record (owner-approved)

| Question | Decision |
|---|---|
| Commercial-grade target | **Production quality, not appearance alone** — presentation, content integration, observability, deterministic regression evidence, recovery, and mobile compatibility all move together |
| Capacitor packaging | **Out of scope** — this is production engineering and presentation, not packaging. Capacitor *compatibility* is protected by WebKit-safe APIs, the GPU context budget, and Simulator Safari coverage; physical-device performance/feel evidence is deliberately deferred to the Capacitor/hardware round |
| UI end-state | **Canvas/WebGL chrome**, not data-driven DOM and not a framework migration |
| Canvas migration depth | **Full combat UI including hand cards** — but gated: the **P0.5 Simulator Safari compatibility spike** must pass before P1 begins, and a **P4→P5 Simulator/Playwright checkpoint** must pass before the hand migrates. "Pixi chrome + DOM hand" is a declared-acceptable shipped state if P5 stops |
| Engine | **PixiJS v8**, WebGL renderer pinned (never WebGPU) |
| Ordering vs content line | **Progressive Delivery Phase 2 executes first**; this round starts after it merges. During P2 (re-homing) the content line observes a **content-table freeze** (assets/plans only) |
| Delivery lanes | **Production Engineering (PE) is the primary lane; Front-end Experience (FE) is a small, design-led lane.** PE owns all substrate, refactoring, Content Lab/manager, renderer mechanics, tooling, tests and integration. FE owns only authored player-facing presentation. Independent QA verifies both; owner taste checkpoints stay with the owner |
| Parallel execution | PE and FE may run concurrently only from separate worktrees on a written disjoint-file manifest. A shared file is a sequential hand-off, never a concurrent edit. Every implementation-plan task has exactly one `[PE]`, `[FE]`, `[QA]`, or `[OWNER]` lead |
| Content substrate | **Full content-pack architecture**: per-domain registries with schemas, existing content re-homed as the `core` pack, `data.js` becomes the assembler. Registry work lands **before any production Pixi migration**; the disposable P0.5 compatibility spike is the sole exception. Pack contract is **data plus behaviour functions** (enemy `ai` stays code — see §2); an AI-DSL is explicitly out of scope |
| Pack delivery | **Compiled-in** (static imports; an expansion ships as an app update). Runtime/downloadable DLC out of scope — the pack *format* is the future-proofing, not a download pipeline. No save-shape change for packs (unknown-id validation already rejects a save whose content is absent) |
| Dev tooling | Dev shell, Content Lab, completeness reporting ("content doctor"), and **Content Manager** (the schema-driven CRUD editor). Content Manager and the dev shell are **droppable pressure-valve items**; Content Manager covers cards/relics/potions/themes only and never touches behaviour fields. All are PE, not FE |
| UI behaviour observability | **Semantic UI Behaviour Trace** — a renderer-neutral, versioned structured event stream is canonical; timestamped text and NDJSON are derived AI/human views. It lands at the start of P1 before decomposition, is local and bounded, and is not analytics or a second source of game truth |
| Mobile browser matrix | Playwright WebKit device emulation and actual Safari in representative iOS/iPadOS Simulators are separate lanes. Simulator Safari is driven serially through Apple `safaridriver`; Round 5 deliberately has no physical-device gate and makes no physical FPS, memory, thermal, background-eviction, latency, or touch-feel claim |
| Store kit | Keep the **capture script + shot list** (rerunnable assets); the captured set is labelled **provisional/marketing-only**; trailer capture is raw reference footage only; device-framed store matrices and store-grade capture re-run in the Capacitor round |
| Screens in scope | All four sets: fallen/victory, title + Embark, non-combat panels (rewards/shop/event/rest/lamplighter/vigil), map re-upgrade (light) |
| Catch-up status | CI wiring is already complete at P0. Remaining items are per-boss unique stage sets, store visual assets, and unlock-toast art; later phases extend the existing CI gate rather than redoing it |
| What stays DOM | Tooltip, pop-menus, toasts, settings, map screen (DOM-on-3D projection), all non-combat screens — restyled, not migrated |

## Delivery lanes and agent ownership

The owner uses **back-end** as shorthand for the primary lane. Spirebound has no
server back end in this round, so the canonical engineering term is
**Production Engineering (PE)**: the browser game's engine-adjacent substrate,
renderer infrastructure, authoring tools, diagnostics and release gates.
**Front-end Experience (FE)** means the deliberately small, player-facing
design and presentation lane. This naming prevents a content tool or a Pixi
refactor from being misrouted merely because it renders a browser screen.

| Lane | Accountable agent | Owns | Explicitly does not own |
|---|---|---|---|
| **Production Engineering (PE)** | Primary/root agent | P0.5–P5 leadership; engine/data/registry contracts; `ui.js` decomposition; all product JavaScript; stable markup/selectors; Semantic UI Behaviour Trace; Content Lab, doctor and editor; Pixi bootstrap and widget/card mechanics; input, probe, geometry, recovery, accessibility, audio wiring, performance, capture, tests, CI, dev endpoints, docs and final integration | Player-facing taste, art direction or owner sign-off |
| **Front-end Experience (FE)** | One separate FE agent | One exact experience contract for P4–P6; the dedicated Round 5 screen stylesheet; approved visual token values; authored motion/state matrices; P7 visual assets, contact-sheet critique and provisional store compositions | Content architecture or management; refactoring; any product JavaScript; trace; renderer/input infrastructure; dev tooling; probe; engine/audio wiring; test harnesses; capture automation; CI/perf; changing ids, schemas or save shape |
| **Verification (QA)** | A fresh reviewer agent, independent of the task implementer | Independent diff/evidence review; spec-compliance and code-quality verdicts; read-only re-runs where useful; confirmation that PE has closed findings | Producing or modifying product/test-harness code, owning gate evidence, fixing findings, or making taste decisions |
| **Owner checkpoint** | Owner | Art direction, ceremony feel, asset promotion and per-screen contact-sheet approval | Routine engineering execution |

This is a **lead boundary**, not a claim that PE code is invisible. Content
Manager/Lab screens, Pixi widgets, card faces and refactored screen modules are
all PE. FE supplies a narrow, declarative presentation seam that PE consumes;
it never owns the machinery behind that seam.

### Parallel-work contract

The implementation plan must label every task `[PE]`, `[FE]`, `[QA]`, or
`[OWNER]` and give it exactly one lead. A task that mixes production mechanics
with visual judgement is split before dispatch. PE and FE use separate
worktrees/branches and may run concurrently only when the plan lists disjoint
write sets. Read access is unrestricted; write ownership is exclusive.

- **Always PE-owned:** all `src/**/*.js`, including `src/engine.js`,
  `src/vigil.js`, `src/data.js`, `src/registry.js`, `src/packs/**`, the P1
  extraction of `src/ui.js`, `src/ui/**`, probe/test code, Vite/dev-server
  endpoints, workflows, geometry/layout resolvers, capture scripts,
  `src/styles.css`, performance instrumentation and build configuration.
- **FE-exclusive write set:**
  `docs/superpowers/specs/2026-07-10-round5-fe-experience-contract.md`;
  `src/styles/round5-screens.css`;
  `docs/stage-art-bible.md`;
  `docs/superpowers/reports/2026-07-10-round5-fe-contact-sheet-review.md`;
  `docs/superpowers/reports/2026-07-10-round5-store-fe-draft.md`; candidates
  under `scratch/style-tests/round5/`; and only these final assets:
  `src/assets/stage/{rootheart,leviathan,sovereign}-{backdrop,mid,ledge}.png`,
  `src/assets/title/round5-{back,mid,foreground}.png`, and
  `src/assets/meta/unlock-toast-frame.png`. FE alone creates/authors the
  dedicated stylesheet. PE adds its import in PE-owned `src/main.js`, never
  edits that stylesheet, and consumes only owner-approved assets from the FE
  promotion hand-off commit.
- **No routine shared product files.** PE translates the FE contract's exact
  token and motion values into PE-owned JavaScript and generates the contact
  sheets. FE reviews evidence and the owner approves it. If an unforeseen
  shared-file change is unavoidable, both lanes stop editing that file and use
  one named sequential hand-off; “small change” is not an exception.

Every cross-lane hand-off is a small versioned contract checked into the plan
or its evidence directory. It names: the exact commit, frozen interfaces,
allowed write set, visual/state matrix, motion and reduced-motion outcomes,
required evidence, and the rollback commit. An agent may not expand its lane to
fix a dependency; it reports the dependency to the owning lane. The task's
implementer may self-review, but a different QA agent must issue both the
spec-compliance and code-quality verdicts before integration. PE produces the
gate evidence and implements fixes; QA may re-run commands read-only and
confirms closure without editing product or test-harness files.

### Round-level topology

FE can author the locked P4/P5 presentation contracts and P6/P7 visual packages
while PE builds P0.5–P3, because those outputs touch no PE production files.
After P3, each production integration crosses a named hand-off:

```text
PE: P0.5 → P1 → P2 → P3 → P4 mechanics → P5 mechanics → P6/P7 integration
FE:             P4/P5 design contracts ───────→ P6 presentation → P7 visuals
                                      hand-off ↑        hand-off ↑
QA:                         independent task gates and combined-lane gates
Owner:                                      visual checkpoints only
```

P0.5–P5 are therefore PE-led even where the output is visual. In P6, FE owns
the experience contract and dedicated stylesheet while PE owns all markup,
behaviour and integration. P7 is split into disjoint FE visual tasks and PE
capture/registration tasks. This is the intended meaning of “Round 5 is mostly
back-end”: most work is production substrate; FE remains a small, bounded
presentation workstream.

## Context (why this pass)

Four visual rounds (2026-07-04 details polish; 2026-07-06 visualisation boost;
2026-07-06 hardening & polish II; the 2026-07-08/09 cluster — vigil surfaces,
status art, aim halo, Ward glass shell, pile ceremony, UI chrome kit, both
editors) plus a separate audio line have taken content art to raster and combat
choreography to a high bar. What remains fragile is the *substrate*:

- Combat chrome is CSS composition hand-tuned pixel by pixel — the UI-chrome
  round left dozens of "Nudge / Enlarge / Shrink / Restore" commits as evidence
  that the model has no stable widget layer.
- `ui.js` is a 4.3k-line single orchestrator rendering every screen.
- **Content is scattered.** One card's identity spans `data.js` (stats, `vfx`
  field), `src/assets/cards/`, `vfx.js` (`BESPOKE_VFX`), pool/wave membership
  in `PROGRESSION`, and unlock `locked:` flags. One enemy adds `char-meta.js`
  (mesh/shadow/aim) and `VARIANTS`. One *act* is worse: `act1-*` asset naming
  conventions, a weather table in `vfx.js`, palette tints in CSS, music-cue
  selection in `music.js`/`ui.js`, and roster/encounter tables. Building
  Act 4 or an expansion today means touching all of it. (Honesty note: some
  content is behaviour, not data — enemy `ai` functions, and ~29 relic ids
  hard-coded as engine hooks. Registries make content *registration* a data
  drop; new *mechanics* still mean engine work. The spec claims the former,
  not the latter.)
- Fallen/victory screens are a meta plate behind a CSS panel; the title got
  *cleaned* by Progressive Delivery Phase 1 but never visually hardened; the
  non-combat screens only ever received scene-panel backdrops and icons.
- CI wiring is complete at P0. Repeatedly deferred per-boss stages and store
  assets remain; later work extends the existing CI gate for the new contracts.

## Invariants (violating any fails review)

- **The predecessor gate is a hard runtime stop.** Before P0.5, PE verifies
  from the execution branch itself that Progressive Delivery Phase 2 is in its
  ancestry and that the expected `src/data.js` exports `VARIANTS` and
  `WHISPERS`, plus the Emberglass-chain and
  rose-window/reveal surfaces are present. Planning and the FE experience
  contract may proceed earlier; Round 5 production code may not. A local dirty
  predecessor worktree is not a merge and cannot satisfy this gate.
- **Engine purity is untouched.** `engine.js`, `vigil.js`, `data.js`,
  `battlefield*.js`, `uic.js`, `ui-chrome-layout.js`, and the new
  `src/registry.js` / `src/packs/**` / `src/ui/tokens.js` /
  `src/ui/behaviour-trace.js` stay Node-runnable and DOM-free. `drain()` still
  consumes `cb.queue`; only the playback target changes from DOM to sprites.
  The trace observes presentation and never enters the engine import graph.
  `npm test` green at every task boundary.
- **The import graph is preserved.** `engine.js` imports `data.js` only,
  exactly as today. `data.js` becomes an assembler (imports packs + registry,
  re-exports the same named exports) — its consumers never change.
- **Registry refactor is behaviour-neutral, proven three ways.** Content
  tables contain functions (enemy `ai`), so "deep-equal a fixture" alone is
  unimplementable. The golden-equivalence gate is: (i) deep-equal on a
  functions-stripped JSON projection of every exported table; (ii) behavioural
  trace equivalence for each enemy `ai` over a fixed seeded schedule of the
  complete live context (`turn`, `last`, `prev`, `hpFrac`, `rng`, and mutable
  `self`), before vs after re-homing — comparing the returned move, RNG
  consumption/final state, and every permitted `self` mutation; (iii) the
  fixed-seed monte-carlo digest unchanged. All three legs are `npm test` checks.
- **Internal keys, card/relic/status ids, save shapes: immutable, as ever.**
  Re-homing content into packs changes file locations, never ids. No new save
  fields for packs.
- **Schemas are the single source.** Registry schemas drive validation, the
  content-doctor report, and Content Manager's CRUD forms. No tool re-declares
  content shape. Unknown extension keys warn, never fail. Behaviour-valued
  fields (`ai`, event hooks) are declared as `kind: 'function'` in the schema:
  validated for presence/arity only, excluded from projection, serialisation,
  and CRUD forms.
- **No act coupling outside packs.** After the theme extraction, act
  references may not survive outside pack content — and the sweep covers
  more than string literals: numeric act indices, clamps (e.g. the
  `Math.min(act, 2)` weather clamp in `vfx.js`), and `length`-of-acts
  assumptions. Unavoidable residue (e.g. save migration, tower geometry if
  not extracted) enters an explicit, enumerated allowlist in the plan — the
  promise is honest, not implied-zero.
- **Combat input has one owner.** `#uigl` is `pointer-events: none`. A single
  stage-level input router receives all combat pointer input, hit-tests the
  Pixi scene first (using the same bounds the probe `ui()` reader exposes),
  resolves enemy/hero targets in stage px from `battlefield.js` geometry, and
  forwards residual events to the DOM. Card drag activates after 26px upward
  in client px. The separate 12px client-px threshold cancels a touch-tooltip
  long press, and map pan currently activates at 14px; the plan must preserve
  these distinct input grammars rather than calling all three "drag slop".
- **World coherence includes shake.** The Pixi root container mirrors the
  `#shake` transform every frame (or `#uigl` mounts inside `#shake` with
  tooltip compensation) so migrated chrome/floaters shake with the world.
  Verified through a named trace span plus motion review in Simulator Safari,
  since static baselines cannot catch motion.
- **Accessibility does not regress silently.** Combat keeps a keyboard path
  (cycle hand / play / end turn — the probe drivers already prove the handler
  plumbing) as a P5 deliverable. Screen-reader support is a **declared
  deferral** (documented decision: offscreen DOM mirror considered for a
  later round), not an accident.
- **Fixed virtual stage rules apply to Pixi.** The `#uigl` canvas is sized in
  stage px with the same DPR-cap discipline as vfx/mesh; pointer events cross
  the boundary through `toStage()`.
- **Layout files remain the single source of geometry truth.**
  `battlefield-layout.js` and `ui-chrome-layout.js` feed the Pixi renderer
  (live-reload via the existing `onUICChange()` hook in `uic.js`); bfedit and
  bfuiedit continue to work, editing the same files.
- **DOM allowed-list.** After Phase 5 the combat screen's rendered DOM content
  is exactly: stage plates; combatants (art + mesh/aim overlays); the vfx
  canvas; and tooltip/pop-menu/toast mounts. Permanent structural hosts may
  remain empty. Everything else in combat is Pixi. Non-combat screens stay DOM by design.
  (After Phase 4 only — chrome on Pixi, hand still DOM — combat is a
  declared-acceptable mixed state; see the P4 exit checkpoint.)
- **Single card-face renderer.** One Pixi composer renders every card face;
  DOM contexts (deck viewer, rewards, shop stock) consume its exported
  textures as `<img>`. Two card-face implementations may never coexist at a
  merge boundary. (This is a one-way door once P5 merges — the rollback
  before that point is "stop at P4"; a dev-only `?uigl=0` escape valve may
  exist during P4/P5 development but carries a mandatory removal task at
  phase close.)
- **WebKit-safe API rule.** Every new API must work in current iOS WKWebView:
  WebGL only (no WebGPU), no SharedArrayBuffer dependence, OffscreenCanvas
  only within Safari 16.4+ coverage, fonts bundled locally. Enforced as a
  review checklist item on every task.
- **GPU context budget.** WebGL contexts may not exceed three (scene3d, mesh,
  Pixi). The new Pixi layer ships with a context-loss/restore contract (what
  re-uploads, what rebuilds, what state survives); retrofitting scene3d/mesh
  restore is deferred to the Capacitor round where real devices make it
  testable. Absorbing the 2D vfx canvas into Pixi is a stretch goal that
  *reduces* the count; nothing may increase it.
- **Bundle budget.** Pixi is the project's first UI runtime dependency; the
  gzipped main-chunk size gains a budget measured in CI next to the build
  (target set in the P4 plan from the measured baseline + Pixi, then held).
- **Fallback discipline on canvas.** A missing texture renders as a
  Pixi-drawn vector primitive (the canvas analogue of the SVG fallback rule);
  the game is always playable with zero assets.
- **Motion discipline carries over.** The shared easing tokens
  (`--ease-out-soft`, `--ease-spring`) are ported into `src/ui/tokens.js` (one
  code-side definition, injected into CSS custom properties at boot);
  `REDUCED` collapses to a *named end-state* (each ceremony/effect specifies
  its single-frame end-state — never an unspecified "instant"); LITE gets a
  Pixi tier (foil/filters off — with a specified flat-sheen replacement so
  LITE reads intentional, lower DPR cap).
- **Preview mirrors are untouched.** `previewPlay` / `previewBlock` /
  `previewEnemyDmg` stay pure; only their display layer changes.
- **The Semantic UI Behaviour Trace is a first-class test interface, never a
  second game truth.** Semantic owners emit versioned, immutable, JSON-safe
  records at interaction, routing, queue-playback, ceremony, lifecycle,
  persistence-dialog, audio-request, renderer-recovery, and error boundaries.
  Records carry a contiguous `seq` (authoritative order), monotonic `atMs`
  (diagnostic time only), stable event/reason codes, explicit phase/outcome,
  and causal correlation. The canonical record is structured; timestamped text,
  NDJSON, and volatile-fields-stripped contract projections derive from it.
  Engine state, DOM/Pixi objects, display copy, raw `pointermove`, tween/ticker
  frames, and full save snapshots never enter the trace. The bounded buffer
  reports overflow explicitly; tracing fails open for play but overflow,
  malformed records, orphaned spans, and unexpected `error.*` events fail tests.
- **Trace scope is local diagnostics.** It is enabled only in development,
  tests, or an explicit non-public QA build; ordinary production builds take a
  no-op path. It has no network exporter, automatic persistence, user analytics,
  or crash reporting. Performance gates run with recording disabled so the
  observer cannot perturb the number it measures.
- **Dev tooling is dev-only.** The Lab / doctor / Content Manager and the
  `/__content-save` endpoint exist only under the Vite dev server (same
  same-origin gate as `/__bf-save`); none of it reaches the production
  bundle. The `_sample` fixture pack is imported by tests and by the Lab
  behind a dev flag; it never registers in production builds.
- **Docs move with their contracts.** The same rule as Playwright: any phase
  that changes a documented contract (module graph, icon policy, tool list)
  updates `AGENTS.md`, the affected domain docs, and `docs/README.md` in the
  same phase. Stale agent docs are an active hazard in an LLM-executed repo.
- **Agent ownership is enforceable, not advisory.** Every task has one lane
  label and one write-set owner. PE and FE may not modify a shared file
  concurrently; shared files cross the sequential hand-off in the ownership
  section. The implementer never supplies the task's final QA verdict, and no
  agent supplies owner taste approval.
- Playwright suites are updated **in the same phase** that moves their
  contracts; visual baselines re-captured per phase — darwin locally on the
  reference machine, linux via the `update-baselines.yml` artifact — **in the
  same PR that moves the contract**, both eyeballed, never trailing.

## 1. Architecture

### Layers

```
z-order inside #stage:
  #bg3d (three.js scene)  →  stage plates  →  combatants + #mesh  →  #vfx
  →  #uigl (PixiJS v8, WebGL, stage-px sized, pointer-events: none)
  →  DOM: tooltip / pop-menu / toasts
```

Input never follows z-order: the stage-level router (invariants) owns combat
pointer input and dispatches to Pixi or DOM explicitly.

### Content flow

```
src/packs/core/**  (data + declared behaviour functions + presentation meta)
        ↓ definePack()
src/registry.js    (schemas, id uniqueness, cross-refs, per-domain merge,
                    freeze, content-doctor report — Node-pure)
        ↓
src/data.js        (assembler: re-exports the same named tables as today)
        ↓                          ↓
engine.js (unchanged)     ui/* + vfx + music (read registries & tokens)
```

### Module decomposition (Phase 1 refactor + new substrate modules)

**Lead: PE.** P1 is a behaviour-preserving refactor with zero FE production-code
scope. FE may work in parallel only on the checked-in P4–P7 presentation
contracts and candidate assets, outside the P1 write set.

`src/ui.js` splits into a `src/ui/` directory; `src/ui.js` remains as a thin
re-export so `main.js` and console hooks are unchanged. **The P1 plan must
carry the complete state-ownership map** — every module-scope binding in
today's `ui.js` assigned to a destination module with its access pattern
(e.g. one shared `ctx` module) — written by the planner, not discovered by
the executor. Internal import direction is one-way (`index` → screens →
widgets; no upward imports), and the plan names the single module that
installs `window.spirebound` / `window.__probe`.

| Module | Owns | Phase | Lead / hand-off |
|---|---|---|---|
| `src/ui/index.js` | orchestrator: `show()`, screen routing, boot | P1 | PE |
| `src/ui/behaviour-trace.js` | renderer-neutral structured flight recorder; span lifecycle, bounded buffer, contract/text/NDJSON projections | P1, before decomposition | PE |
| `src/ui/drain.js` | `drain()` and the event→handler dispatch | P1 | PE |
| `src/ui/combat.js` | combat screen assembly (later delegates to `src/ui/combat-gl.js`) | P1 | PE |
| `src/ui/screens/*.js` | title, embark, map, rewards, shop, event, rest, lamplighter, end, vigil | P1, P6 | PE owns all JavaScript; FE contract + dedicated CSS provide presentation |
| `src/registry.js` | pack registration, schemas, merge, content doctor | P2 | PE |
| `src/packs/core/**` | all existing content, re-homed | P2 | PE |
| `src/packs/_sample/**` | dev/test-only fixture pack (a card, an enemy, a mini theme) | P2 | PE |
| `src/ui/tokens.js` | easing / palette / type scale; injected into CSS vars at boot | P2, P4–P6 | PE owns code/API and transcribes owner-approved FE values |
| `src/ui/dev/*.js` | dev shell, Lab, doctor view, Content Manager (dev-only chunk) | P3 | PE |
| `src/ui/widgets.js` | the Pixi widget kit | P4 | PE; consumes the FE experience contract |
| `src/ui/combat-gl.js` | the Pixi combat scene | P4 | PE; consumes the FE experience contract |
| `src/ui/pointer.js` | the stage-level combat input router | P4 | PE only |
| `src/ui/tween.js` | ticker tweens on the shared easing tokens | P4–P6 | PE; consumes owner-approved FE motion values |
| `src/ui/cardface.js` | the single card-face composer + texture export | P5 | PE; consumes the FE card hierarchy contract |

Phase 1 produces **zero visual change** — the full Playwright kit passing
unchanged is its acceptance proof. It lands after the P0.5 gate and before
P2–P7 production work.

### Probe v2

- `geometry()` largely survives (combatants stay DOM).
- New `ui()` reader traverses the Pixi scene: hand card uids + stage-px
  bounds, pile counts/tiers, energy, lantern state, End Turn enabled.
- Drivers (`play`, `endTurn`, `useArt`, `usePotion`) keep calling the real
  internal handlers; battle.spec assertions move from DOM reads to `ui()`.
- At least one e2e test drives a card through **real Playwright pointer actions
  at probe-reported stage coordinates** (press → drag → release), exercising
  the stage router and browser hit-testing. It must not dispatch directly to
  `#uigl`, which is deliberately `pointer-events: none`. A separate interrupted-
  gesture test delivers `pointercancel` (and covers `lostpointercapture` if the
  router uses capture), then proves through the trace and probe that the card
  returned to its seat and no play committed — iOS edge-swipes and
  notifications interrupt drags in practice.

### Semantic UI Behaviour Trace

P1 first instruments the post-Progressive-Delivery-Phase-2 monolith, captures
representative DOM-era contracts, and only then moves code into `src/ui/`.
This makes the trace a migration oracle shared by the existing DOM renderer,
the P4 mixed renderer, and the P5 Pixi renderer. It observes the same real
handlers used by pointer input and probe drivers; it never infers behaviour from
DOM mutation, pixels, or close timestamps.

The deep module exposes one point-event operation, one paired-span operation,
and read-only projections. Exact names are fixed in the P1 plan, but the
interface shape and lifecycle below are load-bearing:

```js
trace.emit(eventName, attributes)
const span = trace.begin(eventName, attributes)
span.finish(outcome, attributes) // exactly once
trace.read({ after: { segment, seq }, format })  // records / contract / text / ndjson
```

Every record contains `v`, page `segment`, contiguous `seq`, monotonic `atMs`,
stable `eventName`, `phase` (`point`, `start`, or `end`), screen,
renderer/motion/tier policy,
small JSON-safe attributes, and explicit `causeSeq` or correlation id where a
flow crosses input → engine command → queue playback → animation. One session
header may carry wall-clock/time-origin metadata; reload starts a new segment
whose sequence restarts at one. Incremental reads therefore use the composite
cursor `{ segment, seq }`, never `seq` alone. If a supplied cursor's segment is
not the active segment, `read()` returns the new segment header plus records
from sequence one and a new cursor; retaining an old segment can never suppress
new-page records.
An `end` record has exactly one stable `outcome`: `completed` for non-visual
work, `settled` for completed presentation, or `cancelled`, `skipped`, or
`failed`. The `eventName` identifies the semantic operation; lifecycle is never
encoded by appending `.started` or `.settled` to that name. Every started span
must finish once and only once.
Ordering assertions use `seq`, never timestamp. Timing assertions are named
budgets with tolerances in their dedicated lane; normal contract projections
strip volatile time, run ids, instance ids where irrelevant, browser wording,
and asset URLs.

The initial vocabulary covers:

- app/renderer ready; screen requested/entered/exited/redirected;
- semantic input accepted/rejected/cancelled with stable reason codes, including
  card drag, targeting, keyboard actions, map selection, and map pan boundaries;
- combat and dawn drain start/end; every queue event start/end/fail, including
  each event consumed inside a draw/reshuffle batch;
- named presentation ceremonies start/end, with terminal outcome `settled`,
  `cancelled`, `skipped`, or `failed`; REDUCED is renderer-policy metadata plus
  a named end-state, never a lifecycle outcome. A handler finishing stays
  distinct from detached motion actually settling;
- meaningful Music Cue/SFX request outcomes, audio unlock, persistence blockers
  and recovery, renderer context loss/rebuild/ready, and trace/invariant errors;
- explicit compact checkpoints using the same semantic state projection as the
  probe — never a mutable reference to `run`, `cb`, DOM, or Pixi state.

`window.__probe.behaviourTrace({ after: { segment, seq }, format })` is the
read-only external surface. A presentation-aware settle helper waits for the
engine queue, `busy`,
and all trace-tracked named spans; the old queue-idle fact remains separately
readable so tests never confuse "handler returned" with "the UI settled".
Content Lab's replay-last-beat uses a small versioned **Replay Descriptor**
published by a replayable presentation owner and referenced by its correlated
span, rather than reconstructing a beat from timers. It is an immutable,
renderer-neutral presentation fixture, not an engine command or state journal.
Replay runs only in the Lab's isolated presentation preview: it never mutates
the run, replays combat logic, or touches the real save. The trace itself
remains non-persistent. In Lab mode, immediately after a replayable span
settles, the Lab serialises its bounded descriptor into the `replay=` query
parameter with `history.replaceState()` before exposing it as “last
replayable”; the full scenario is already in the same URL. Reload starts a
fresh trace segment, hydrates the replay button from `replay=`, and **does not
auto-run it**. Pressing the button replays only that isolated visual fixture.
Normal game URLs are never mutated. Non-replayable spans expose a stable
disabled reason instead of pretending they can be replayed.

Playwright enables tracing before boot, waits on semantic predicates instead of
guessed sleeps where a named event exists, checks schema/order/no-overflow/no-
orphan invariants, and attaches both normalised NDJSON and timestamped text on
failure. Simulator Safari retrieves the same projection through WebDriver
execute-script. Playwright's heavyweight browser trace remains independently
configurable; this facility neither depends on it nor replaces screenshot,
geometry, accessibility, performance, or device evidence.

Research basis:
[`docs/research/2026-07-10-ui-behaviour-trace-ios-simulator.md`](../../research/2026-07-10-ui-behaviour-trace-ios-simulator.md).

## 2. Phase 2 — content registries & packs

**Lead: PE. FE has no implementation scope in this phase.** P2 is a Node-pure
production substrate used by the shipped game, not dev tooling.

### The assembler move

`data.js` stops *containing* content and starts *assembling* it: it imports
the pack modules, feeds them through `src/registry.js`, and re-exports exactly
the named tables it exports today (`CARDS`, `ENEMIES`, `RELICS`, `POTIONS`,
`EVENTS`, `STATUS_INFO`, `OMENS`, `BOONS`, `ASPECTS`, `DEEDS`, `VARIANTS`,
`WHISPERS`, `PROGRESSION`, `REVEALS`, …the exact list is enumerated in the
plan after Progressive Delivery Phase 2 merges). Engine, tests, saves, and
UI consumers never notice. **During this phase the content line observes a
content-table freeze** (assets and planning only); the P2 plan names who
folds the freshly-merged `VARIANTS`/`WHISPERS` into the core pack.

Before moving the first table, PE commits the **before oracle**: the complete
functions-stripped export projection, the seeded full-context enemy-AI trace
digest and the fixed-seed monte-carlo digest. The same tests then run against
the assembled registries after each move. Capturing an oracle after deleting
the old table is invalid evidence.

The post-prerequisite export inventory is exhaustive, not illustrative. The P2
plan classifies every `src/data.js` export — including entity domains,
aggregates such as `VOWS`, `AFFIXES`, `ENCOUNTERS`, `SHOP`, `PROGRESSION` and
`REVEALS`, constants, and derived pools/views — as pack-owned, registry-owned,
or assembler-derived, and assigns explicit merge/derivation semantics. No
export may disappear merely because it was absent from the domain shorthand
below.

### Pack contract: data plus behaviour

Content tables are not purely declarative — enemies carry `ai` functions,
and events carry hooks. The pack contract is therefore **"Node-pure data
plus declared behaviour functions"**: behaviour fields are named in the
schema as `kind: 'function'`, validated for presence/arity, excluded from
the golden projection, from serialisation, and from CRUD forms. Converting
`ai` to a declarative DSL is an engine-mechanics change and explicitly out
of scope.

### Registry domains

cards, relics, potions, enemies, variants, statuses, events, omens, boons,
arts, aspects, deeds, whispers, **themes**. Per domain the registry enforces:

- **Schema:** required fields + types per domain; cross-reference checks
  (a card's `vfx` must be a known archetype; a theme's `music` entries must
  be registered cue ids; a variant's `base` must be a registered enemy).
  Unknown extension keys warn, never fail.
- **Id uniqueness** across all packs (collision = throw at boot).
- **Merge semantics are per-table, declared in the spec of the domain:**
  entity tables (cards, enemies, …) are keyed-unique (collision = error);
  aggregate tables (`PROGRESSION.poolWaves`, `REVEALS`, encounter lists,
  pool membership) each declare append / keyed-replace / error in the P2
  plan — no aggregate merges by accident.
- Registries **freeze after boot**; under dev HMR a pack edit rebuilds the
  registry through one named invalidate/rebuild path, following the explicit
  listener/rebuild precedent in `uic.js` / `battlefield.js`. Current `data.js`
  has no HMR contract to preserve, so the plan must decide whether a pack edit
  preserves object identity and live-run state or deliberately reloads the page.
- **Content doctor:** validation failures are aggregated into one report —
  every failure with entry id, field, expected shape, and a fix hint —
  surfaced identically in `npm test` output and in the dev overlay. (This
  report *is* most of the registry's authoring value; boot-throw stays for
  production builds.)

### Theme registry (the star)

One theme entry gathers everything that today defines "an act" across five
files:

```js
{ id: 'act1', name, tagline,
  plates: { backdrop, mid, ledge },      // per-boss override slot: bossPlates
  weather: { kinds, density, palette, velocity },
  lanternLights: [ … ],                  // ambient light-position table
  palette: { tint, glow, haze },         // references design tokens
  music: { map, combat, boss, victory }, // cue ids
  roster: { normal, elite, boss },       // engine-side
  encounters, mapHaze }
```

Engine reads `roster`/`encounters` (pure data); UI/vfx/music read the rest.
The extraction sweep covers literals **and** index/clamp/length coupling
(see invariants). The acceptance test is behavioural, not registrational:
**a dev-flagged fourth theme (the `_sample` mini theme) boots into a
climbable act in the Lab** — map generation, weather, music-cue fallback,
and roster resolve, one floor driven by probe drivers — with any residue
(e.g. tower geometry constants, if not extracted) enumerated in the plan
rather than implied absent.

### Supporting decisions

- **Assets do not move.** `assetUrl` globbing stays as-is; packs declare ids;
  the `npm test` manifest gate becomes registry-driven (automatically covers
  future packs).
- **Save compatibility:** ids unchanged; `loadRun` validation reads the merged
  registries; **no new save fields** — unknown-id rejection already yields
  the right failure for a save whose pack is absent.
- **`_sample` fixture pack:** imported by `test_engine.js` for contract tests
  and loadable in the Lab behind a dev flag; zero production surface.
- **Localisation note (no scope added):** registries centralise display
  strings, so future localisation becomes a string-table swap; the card-face
  texture cache key includes a locale token (constant today) so baked text
  can be invalidated per locale later.

## 3. Phase 3 — dev tooling

**Lead: PE.** Content Lab/Manager, doctor, trace view, dev shell and save
endpoint are production-engineering authoring tools even though they render UI.
FE has no implementation scope in this phase.

All dev-only (never in the production bundle). The **dev shell and Content
Manager are droppable pressure-valve items**; the Lab and the content doctor
are core deliverables.

- **Content Lab (`?lab=1`):** pick any enemy set (including variants),
  hero/aspect, starting deck/hand, act theme, and omen → instant sandbox
  combat. **Scenarios are URL-addressable** (query params encode the whole
  setup, following the `?shape=` convention) so a bug reproduces by pasting
  a link. Immediately after a replayable beat settles, the Lab writes its
  versioned Replay Descriptor to `replay=` with `history.replaceState()`.
  Reload hydrates, but does not auto-run, the replay button, so “replay last
  beat” survives without persisting the trace. The Lab interacts with the
  game exclusively through probe drivers and `newRun` opts, so the P4/P5
  render swap costs it nothing. It never touches the real save — the plan
  owns the required engine touch explicitly (an `opts.ephemeral` that
  no-ops `saveRun`). God-mode panel (energy / embers / HP / add card) and
  **replay last beat** (render the immutable presentation fixture referenced by
  the last replayable Semantic UI Behaviour Trace span; never re-run its engine
  command or mutate run state) included. A
  compact live transcript panel can show/copy the structured
  and timestamped-text projections without becoming a second trace store. The
  Lab is the acceptance harness for the P4/P5 migration.
- **Content doctor:** primary surface is the aggregated report in `npm test`
  output (§2); `?dashboard=1` is a thin dev view over the same pure API —
  per-domain tables with badges (art / vfx / char-meta / audio / pool
  membership) linking into gallery preview and Lab launch.
- **Content Manager (`?contentedit=1`)** *(droppable)*: schema-driven CRUD
  forms for **cards, relics, potions, and themes only** — enemies are
  excluded in v1 (their `ai` is code; at most rendered as read-only source).
  Save → `POST /__content-save` (dev-only Vite plugin, same-origin gate) →
  writes the pack module back with a stable-ordered, pretty-printed
  serialiser, validating against the schema *before* writing. `npm test`
  remains the commit gate.
- **Dev shell (`?dev=1`)** *(droppable)*: a thin launcher page listing every
  tool. Existing tool URLs unchanged.

## 4. Phase 4 — combat chrome on canvas

**Lead: PE.** FE may prepare the widget state matrix, token values and motion
contract in parallel and review PE's captured evidence after the interface
hand-off. Pixi bootstrap, widget code, styling translation, input, geometry,
trace, probe, tests and integration remain PE.

- **Widget kit** (`src/ui/widgets.js`): nine-slice plate, meter, counter, button,
  sprite-state switcher. These are the primitives every later phase reuses.
- **Migrates:** energy candles, facet chips, HP vials + Ward chip, the three
  pile widgets (stack tiers + always-visible counts), End Turn, lantern
  button (ember pips, art chip, ready pulse), intent chips, top HUD (HP,
  gold, deck, menu, omen chip).
- **Input:** the stage-level router from the invariants section is built
  here (`src/ui/pointer.js`), with the real-pointer router e2e as its proof.
  The task first inventories every existing combat pointer/touch/click listener
  and removes or reroutes it at cut-over; layering the router over surviving
  competing listeners fails review. Shake mirroring lands with the first
  migrated widget.
- **Geometry:** consumed from `ui-chrome-layout.js` via `uic.js` — the
  hand-tuned values are inherited, not re-derived. bfuiedit keeps editing
  them; the Pixi renderer subscribes to the existing `onUICChange()` hook.
- **Data:** widgets read registries and `src/ui/tokens.js` from day one.
- **Textures:** the existing 27 `src/assets/ui/*.png` load as Pixi textures;
  no regeneration needed. **Preload contract:** the plan names which
  textures block combat presentation and which may pop in, and specifies
  the visual during preload (cold cache on mobile is the design case, not
  an accident).
- **Tooltip bridge:** sprite hover / long-press forwards to the existing DOM
  tooltip, positioned from sprite bounds (stage px → client px).
- **P4 exit checkpoint (gates P5):** the full Simulator Safari matrix proves
  interaction semantics, motion coherence (including shake), layout, and
  renderer recovery at parity or better; the Playwright perf gate passes with
  measured host-relative headroom. This checkpoint makes no physical touch-
  feel or device-performance claim. Otherwise stop: ship the declared-
  acceptable mixed state, keep the DOM hand, and re-plan P5.

## 5. Phase 5 — hand, floaters, banners (combat fully game-rendered)

**Lead: PE.** FE supplies a bounded card/hand/ceremony presentation contract and
reviews PE's captured evidence after the compositor interfaces pass PE tests.
Card composition, styling translation, caching, input, accessibility, trace,
probe, performance and integration remain PE.

- **Card-face composer** (`src/ui/cardface.js`): frame (per rarity), art, name,
  cost gem, wrapped body text with keyword icons, rarity chrome, upgrade
  state — all read from the card registry. The plan carries a **layout
  contract** (wrap behaviour around inline icons, overflow rule with named
  shrink steps and a max-lines cap, upgrade-diff emphasis) and a **texture
  budget**: a static calculated cap for uncompressed RGBA allocation per card ×
  state × DPR, with a documented overhead factor, plus host-relative heap/
  texture-growth regression evidence. It makes no Simulator or physical-iOS
  memory-headroom claim. Per-frame preview tints are applied live, never
  cached; the cache key includes the locale token.
- **Hand:** fan/arc seat layout ported from the CSS seat logic; drag-to-play
  with unchanged client-px thresholds; **pointercancel returns the card to
  its seat and plays nothing**; desktop hover lift + tilt + foil sheen
  shader (LITE: flat sheen replacement); touch long-press inspect.
  Ghost/lethal preview numbers render as Pixi text from the untouched pure
  previews.
- **Keyboard path:** cycle hand / play / end turn, wired through the same
  handlers the probe drivers use (the a11y invariant's deliverable).
- **Floaters:** the 4-tier damage hierarchy as Pixi BitmapText with archetype
  tints and the existing stagger rules; turn banner, boss intro plate, and
  the guard-shattered beat become sprite/text sequences on `src/ui/tween.js`.
- **Pile ceremony re-wired:** draw / discard / exhaust / reshuffle per-card
  flights re-implemented as Pixi sprites under the same wall-clock budgets
  as the pile-chrome spec (`discardHand` ~320–480ms, `reshuffle` ~450–650ms,
  stagger compresses with n) — and those budgets are **asserted by name** in
  the e2e suite, not just stated.
- **Aim outlines are out of scope** — they live on combatants (mesh/SVG) and
  are unaffected.
- **Falsifiable wins (P5 review fails the migration on its own terms if
  absent):** foil sheen live in hand; per-card pile flights inside their
  budgets at CPU 4×; one card-face renderer feeding combat *and* every DOM
  grid; floaters/banners batched in the Pixi scene.
- **P5 → P6 production hand-off:** trace parity, the DOM allowed-list, the
  single card-face renderer, keyboard path, context recovery, leak/perf budgets
  and all standing gates must pass before PE freezes P6 selectors/interfaces or
  imports FE's screen stylesheet.

## 6. Phase 6 — screens (DOM, restyled to the award bar)

**Lead: FE for authored presentation; PE for product implementation.** FE may
change only `src/styles/round5-screens.css` plus its experience contract and
review records. PE owns screen JavaScript, stable markup/selectors, token
translation, handlers, state, registry/reveal wiring, audio calls, trace/probe
hooks, accessibility, capture, performance and tests. Owner contact-sheet
approval remains a separate gate.

FE's exact design deliverable is
`docs/superpowers/specs/2026-07-10-round5-fe-experience-contract.md`. It records
the P4 widget states, P5 card hierarchy, P4–P6 visual token values, every
ceremony's motion table, LITE/REDUCED outcomes and P6 compositions. PE freezes
the selector/state/asset-id manifest before FE authors
`src/styles/round5-screens.css`; FE may style only that manifest. PE translates
the approved contract into Pixi/JavaScript values and imports the stylesheet.

For every screen below, the plan must additionally specify: (a) the
**austere fresh-profile state** at the same design bar (what fills the space
before aspects/vows/rose-window exist, what teases growth); (b) every
ceremony beat **mechanically** (element, property, duration, easing token,
trigger, `REDUCED` end-state) — the pile-chrome spec is the precedent; (c) a
**wiring-only audio pass** mapping each new ceremony beat to existing
catalogued SFX/music cues (`src/audio-catalog.js`) — no new audio assets;
(d) the LITE/REDUCED end-state, one line each.

### Title + Embark

- Title: the key art re-cut into the three P7A `round5-*` parallax layers
  (imagegen fills the gaps — **owner checkpoint**, routed through
  `docs/generated-art-workflow.md`),
  ember drift, a once-per-session wordmark ignition sequence, button column
  restyled in the widget-kit language; the Vigil pulse and rose-window
  medallion (Progressive Delivery Phase 2 surfaces) get their finished
  treatment.
- Embark: aspect picker as full-art panels (hero art + kit summary) with a
  selection ceremony; vow stepper as a lantern dial with the cumulative
  ledger; Begin plays a lantern-lighting transition into the map. Reveal
  logic from Progressive Delivery Phase 1 is untouched — presentation only.

### Fallen / Victory (ceremony tier)

- Fallen: monument-carving ceremony — the plate rises, chisel-strike beats
  with ember spray, bequest choice framed as a ritual, the whisper line, and
  stats engraved via `tweenNum`.
- Victory: dawn ceremony — light bloom, ascended-plate parallax, the
  Progressive Delivery Phase 2 shard/page queue moments given their full
  visual weight, stats as an illuminated ledger, "the climb continues" close.
- Existing `sunrise()`, confetti, and monument CSS are upgraded in place, not
  replaced, wherever they survive the bar.

### Non-combat panels (rewards / shop / event / rest / lamplighter / vigil)

- Scene panel v2: act backdrop + mid layer with slow parallax (true depth,
  plates resolved through the theme registry), one shared header ornament,
  one button-hierarchy token pass.
- Shop gains merchant presence (existing event/props art); stock cards use
  card-composer textures (single-renderer rule); rest gets a firelight
  pulse; event gets art-plate framing; lamplighter boons/picker and both
  Vigil tabs adopt the same panel language.

### Map (kept light — R3 already upgraded it)

- Node entrance stagger (floors light up on map entry), path-ignite ceremony
  on route choice, camera settle polish. The DOM-on-3D projection
  architecture is untouched.

### Owner taste gate

Per screen, PE generates a fixed-format **contact sheet** (all stage shapes ×
key states, austere and grown profiles), FE records its mechanical/visual
critique under `docs/superpowers/reports/`, and the owner signs it off **before
PE refreshes baselines**. The award-bar checklist (§8) is the pre-filter; owner
sign-off is the gate. A lower-grade executor never self-certifies
"award-winning".

## 7. Phase 7 — assets & ship-front (parallelisable with Phase 6)

**Split into disjoint tasks, never one mixed task.**

### P7A — FE visual package

- **Per-boss stage candidates:** three bosses × (backdrop / mid / ledge) = 9
  plates under `src/assets/stage/`, produced through the locked imagegen
  workflow. The exact final files are
  `src/assets/stage/{rootheart,leviathan,sovereign}-{backdrop,mid,ledge}.png`.
  Before owner approval, the same filenames live only under
  `scratch/style-tests/round5/stage/`. FE also creates
  `docs/stage-art-bible.md`,
  defining ids, crop,
  horizon/ground, palette, mobile-safe focal zones and the fallback appearance.
  Promotion is an **owner checkpoint**; unapproved candidates stay outside the
  production manifest.
- **Unlock-toast art:** one generic
  `src/assets/meta/unlock-toast-frame.png`; its candidate lives at
  `scratch/style-tests/round5/meta/unlock-toast-frame.png`. The toast
  illustration reuses deed emblems/content art.
- **Title parallax layers:** `src/assets/title/round5-back.png`,
  `src/assets/title/round5-mid.png`, and
  `src/assets/title/round5-foreground.png`; existing
  `src/assets/title/title.png` remains the zero-new-asset fallback. Candidates
  use the same filenames under `scratch/style-tests/round5/title/`.
- **Store composition:** shot composition, feature-graphic layout, icon/title
  crop critique, draft listing copy and keyword candidates, written only to
  `docs/superpowers/reports/2026-07-10-round5-store-fe-draft.md`. Captures
  remain provisional/marketing-only.
- **Promotion hand-off:** after owner approval, FE promotes the named assets to
  their final paths in one asset-only commit and records that commit in
  `docs/superpowers/reports/2026-07-10-round5-fe-contact-sheet-review.md`. PE
  integrates exactly that commit before adding theme/manifest wiring.

### P7B — PE ship-front integration

- Register only owner-approved boss plates in the theme entries' `bossPlates`
  slots and prove the act-standard fallback. FE never edits theme/pack code.
- Build the screenshot capture kit: a Playwright script drives probe-staged
  scenes (title, bespoke combat moment, map, rose window, boss). The script and
  exact shot-list document are durable and rerunnable after the Capacitor round.
  Device-framed store matrices and store-grade capture specs (H.264 App Store
  previews etc.) belong to the Capacitor round.
- Run the feature graphic + icon refresh from final approved title art through
  `tools/gen-icons.sh`; generated public outputs remain PE-owned.
- Produce **raw reference footage only** from probe-driven deterministic
  Playwright sequences. Trailer editing remains out of scope.
- Finalise `docs/store-listing-content.md` from FE's draft copy/keywords, plus a
  PE-owned requirements checklist (age rating, privacy declarations) so
  “sellable” has a content plan, not just pixels. FE never edits this final PE
  document.

## 8. Testing & QA

### Phase 0 — CI (complete)

GitHub Actions: `npm test` + `npm run build` + Playwright (Chromium on
ubuntu; the linux baselines already exist) on every relevant PR and push to
main, with a required no-op success for docs/tooling-only changes.
`perf.spec` runs as a nightly/manual job — CI runner numbers are recorded,
not gating. Failure screenshots/diffs upload as artifacts. This landed from
`docs/superpowers/plans/2026-07-09-ci-wiring.md`; later phases extend the
existing gate rather than treating P0 as still in flight.

“P0 complete” does not pre-complete Round 5's later CI work. PE extends the
gate in the phase that introduces each contract: Playwright WebKit device
emulation, serial disk-writing Content Manager tests, the bundle budget,
desktop full-tier performance recording, Pixi context-loss proof, texture-leak
evidence and the separately labelled local/self-hosted Simulator Safari lane.
The Simulator lane is never represented as an ordinary Linux GitHub runner.

### Phase 0.5 — the Simulator Safari Pixi compatibility spike (gates P1)

Timeboxed (order of days, not weeks). A throwaway branch renders, via Pixi
v8 over the live scene3d + mesh contexts: one nine-slice plate, ~ten card
sprites with one composed card face (text + icons), the foil shader, and a
synthesised drag. Actual Safari in the pinned iOS Simulator runtime (iOS 26.5
at spec time) is driven serially through Apple `safaridriver`, never labelled
as Playwright Mobile Safari. The representative matrix is iPhone SE (3rd
generation), iPhone 17 Pro, iPad mini (A17 Pro), and iPad Pro 13-inch (M5),
portrait and landscape.

The artifact records Xcode, runtime/build, Safari, model/UDID, orientation, and
host architecture. Written pass/fail criteria gate boot/API support,
stage/safe-area selection, font and texture readiness/fallback, automated
pointer and pointer-cancel semantics, motion coherence, all three contexts
coexisting, and deliberately induced **Pixi context** loss → rebuild → ready.
Scene3d/mesh context restoration remains out of scope. Playwright
records host-relative performance separately, but neither lane claims physical
device FPS, GPU/texture-memory headroom, input latency/feel, thermal behaviour,
or real background eviction; those are explicitly deferred to the future
Capacitor/hardware round. More Simulator model names do not add hardware proof
because they still use the host Mac's CPU, memory, and GPU.

Pass → P1 proceeds. Functional compatibility fail → the canvas decision reopens
before any sunk cost (the registries, behaviour trace, and tooling phases remain
valuable regardless).

### Registry & tooling gates (P2–P3)

- **Golden equivalence, three legs** (see invariants): stripped-projection
  deep-equal, seeded `ai` trace equivalence, monte-carlo digest.
- Registry unit tests in `test_engine.js` (Node-pure): schema validation,
  id-collision throw, cross-reference checks, per-table merge semantics,
  content-doctor report shape, `_sample` fixture registering without
  polluting core pools.
- Act-coupling sweep gate: literals + indices + clamps, with the enumerated
  allowlist; the climbable `_sample`-theme Lab smoke.
- Lab e2e smoke: boot a URL-addressed scenario → play a card → zero page
  errors. **If Content Manager ships**, its endpoint e2e mirrors
  `bfeditor.spec`'s disk test: write a temporary card, validate, and revert.

### Standing gates (from their introducing phase onwards)

Every task runs the subset of gates that exists and applies at its phase; a
later renderer contract is never retroactively required of an earlier phase.
Once introduced, a gate remains standing for every subsequent applicable task.
PE owns gate code, evidence production, execution, fixes and closure; QA
independently checks the recorded evidence, may re-run commands read-only, and
issues the verdict. FE never has to modify test infrastructure in order to
satisfy a presentation task.

1. `npm test` green.
2. geometry / battle / stage suites green — updated in the same phase that
   moves a contract.
3. On every visual-contract-moving phase, visual baselines are re-captured
   (darwin locally, linux via
   `update-baselines.yml`, same PR), eyeballed; no cross-phase debt. For
   canvas-heavy shots: deterministic renderer settings (antialias off for
   baseline runs, integer position snapping, pinned DPR) and a
   pre-authorised per-suite `maxDiffPixelRatio` for the Pixi era.
4. **P4 onward:** Probe v2 keeps battle.spec meaningful on canvas; the
   real-pointer router
   and pointercancel tests pass.
5. **P1 onward:** Every trace-enabled functional test passes Semantic UI
   Behaviour Trace
   integrity: schema/version and contiguous
   ordering valid, no dropped records, no orphaned named spans, no unexpected
   `error.*`; contract projections preserve selected P1 DOM journeys through
   P4/P5 apart from explicitly reviewed renderer-policy fields. Playwright
   attaches NDJSON and timestamped text on failure, while timing/perf runs keep
   recording off.
6. **P4 onward:** Perf gate unchanged in numbers (portrait/LITE, CPU 4×,
   avg ≥ 55fps, p95
   ≤ 22ms) measured **with the Pixi scene active**; additionally the nightly
   `perf.yml` records a **desktop full-tier** run (foil on, high DPR) so the
   shiny path has a watched number; plus a Pixi-context-loss smoke (simulated
   loss → restore) and a heap/texture-leak check across the long
   random-agent run from P5 onward (per-combat texture leaks are the expected
   leak class); a REDUCED-motion e2e runs against the Pixi scene.
7. **P0.5 and every later browser-contract-moving phase:** Simulator Safari
   compatibility lane
   phase, using Apple `safaridriver` and the same normalised semantic assertions
   as Playwright; the full four-device/two-orientation matrix runs at P0.5,
   P4, P5, and the final gate, with narrower representative smokes in between.
8. WebKit-safe API rule reviewed per task.
9. **Docs-same-phase gate** (see invariants).
10. **P4 onward:** Gzipped main-chunk bundle budget measured in CI.
11. Agent-ownership gate: the task has one lane label and disjoint write set;
    any PE/FE shared-file hand-off names its commits and frozen interfaces; a
    fresh QA agent records both spec-compliance and code-quality verdicts.

### Award-bar acceptance checklist (mechanical pre-filter; the owner
contact-sheet sign-off in §6 is the gate)

- Every interactive element has distinct rest / hover / pressed / disabled
  states.
- Every state change moves — no property snaps except under `REDUCED` (which
  lands on its named end-state).
- No linear easing anywhere; only the shared tween tokens.
- Every screen's specified ceremony beats exist and run at their specified
  timings (beats are *specified* in plans, never invented by the executor).
- Nothing reads as browser-default: no default focus rings without styling,
  no system font fallbacks, no unstyled scrollbars inside the stage.
- Text contrast ≥ 4.5:1 — DOM-verified where DOM, and for Pixi text verified
  at design time per token pair plus probe-based pixel sampling of the few
  canvas text styles.

## 9. Phasing

| Phase | Content | Lead / FE boundary | Nature |
|---|---|---|---|
| P0 | CI wiring | PE — complete | Later phases extend the merged gate |
| P0.5 | Simulator Safari Pixi compatibility spike | PE; FE may review captured presentation only | Timeboxed functional matrix; no physical-device claim; gates P1 |
| P1 | Semantic UI Behaviour Trace, then `ui.js` → `src/ui/` decomposition | PE only; FE production-code write set is empty | Trace the monolith first; preserve normalised behavioural contracts; zero visual change; plan carries the state-ownership map |
| P2 | Content registries & packs | PE only | Node-pure production substrate; three-leg golden equivalence; content-table freeze window |
| P3 | Dev tooling (Lab + doctor + trace view core; shell + Content Manager droppable) | PE only, including all tooling UI | Dev-only surfaces; the Lab becomes the P4/P5 acceptance harness |
| P4 | Pixi bootstrap + widget kit + chrome + input router | PE code; FE contract/review only | First canvas UI; **exit checkpoint gates P5** |
| P5 | Hand + floaters/banners + pile flights + keyboard path | PE code; FE contract/review only | Combat fully game-rendered; falsifiable wins |
| P6 | Screens: title/Embark, fallen/victory, non-combat, map | FE contract/dedicated CSS; PE JavaScript/integration; owner taste gate | Per-screen deliverables; owner contact-sheet sign-offs |
| P7 | Per-boss stages, unlock toast, store kit (provisional) | Split FE visual tasks from PE registration/capture tasks | Parallel with P6 after P5 |

Ordering logic: P1 establishes the renderer-neutral behaviour contract before
moving its semantic owners. P2 is a Node-pure **production** substrate; P3 is
the dev-only tooling layer. Neither changes gameplay presentation, so the Pixi
phases build against stable APIs with the trace and Lab as their test bench.
FE's design packages may proceed in parallel on their disjoint branch, but
production-file integration waits for the named PE hand-off. Each phase is
independently shippable; the P4-only mixed state (Pixi chrome, DOM hand) is
declared acceptable as the reduced-scope stop below. Content Manager and the
dev shell are optional even for the Full-Round target. P6/P7 may be deferred
without stranding earlier phases, but doing so explicitly selects the
reduced-scope exit and does not satisfy Full-Round success.

## 10. Risks

| Risk | Mitigation |
|---|---|
| Pixi incompatible with mobile WebKit | **P0.5 Simulator Safari spike before any sunk cost**; P4 exit checkpoint before the hand migrates; WebKit-safe review and declared-acceptable fallback states at each gate; actual Capacitor WKWebView remains for its own round |
| Simulator success is misreported as device performance proof | Record the exact runtime/host, label the gate functional compatibility, forbid Simulator FPS, memory, touch-feel, thermal, and background-eviction claims, and defer those claims explicitly |
| Behaviour trace becomes a second game truth or a noisy logger | Observe only semantic owners; structured versioned records are canonical; no engine imports, DOM inference, frame/pointer-move spam, or console-first transport |
| Trace snapshots become timing-flaky | `seq` and explicit causality define contract order; normal projections strip timestamps; only named budget tests assert elapsed time with tolerances |
| Missing instrumentation makes a trace look complete when it is not | P1 event inventory covers routing bypasses, batched queue consumption, detached ceremonies, dawn queue, error and overflow; schema integrity and orphan-span tests are mandatory |
| Function-valued content breaks the P2 gates | Pack contract is data + declared behaviour functions; three-leg equivalence; Content Manager CRUD excludes behaviour fields |
| `data.js` re-homing drifts behaviour | Golden-equivalence (three legs) + monte-carlo + full Playwright; P2 is its own phase, never mixed with Pixi work |
| Refactor collides with parallel content commits | Content-table freeze during P2; named owner folds `VARIANTS`/`WHISPERS` into the core pack |
| PE/FE agents collide or silently cross ownership | Separate worktrees, task-level disjoint write manifests, one lead per task, sequential shared-file hand-offs, exact commit/interface records and independent QA before integration |
| Pointer/drag regressions on the canvas boundary | Single stage-level router specified up front; real-pointer router + pointercancel e2e |
| Migrated chrome stops shaking / motion regressions | Shake-mirror invariant; named trace span plus Simulator Safari motion review, not just static pixels |
| Content Manager writes a corrupt pack file | Schema validation before write + stable serialiser + `npm test` gate; endpoint dev-only; manager droppable |
| Theme extraction misses hardcoded act logic | Sweep covers literals + indices + clamps; climbable `_sample` Lab smoke; honest enumerated residue |
| Schema too strict, chokes content flexibility | Required core fields only; unknown extension keys warn, never fail |
| Baseline churn / canvas nondeterminism on CI | Per-phase re-baseline in the contract-moving PR; deterministic renderer settings; pre-authorised diff ratio |
| Card text fidelity (font timing) | Font-ready gate before the first Pixi text bake; fonts bundled |
| Card-face texture growth | Static calculated allocation cap plus host-relative leak check on the random-agent run; Simulator/device memory-headroom claims remain deferred |
| DOM/Pixi card-face drift | Single composer + texture export; DOM grids consume exports |
| `ui.js` decomposition regressions | State-ownership map in the plan; zero-visual-change acceptance with the full kit |
| Executor "self-certifies" taste | Owner contact-sheet sign-off gates; beats specified in plans; art tasks marked owner-checkpoint |
| Docs go stale and mislead future agents | Docs-same-phase standing gate |
| Scope pressure ("last round") | Every phase shippable; named droppable items |

## Out of scope (this pass)

Capacitor packaging (compatibility protected by invariants only); remote UI
telemetry collection, automatic trace upload/persistence, raw pointer/frame/DOM
mutation logging, or treating semantic trace as a replacement for visual,
accessibility, performance, or Simulator proof; physical-device FPS, memory,
thermal, latency/touch-feel, and real background-eviction testing (all deferred
to the Capacitor/hardware round); runtime /
downloadable DLC (pack *format* only — delivery stays compiled-in); an
enemy-AI DSL (behaviour stays code); engine mechanics or event-shape changes
beyond the named `opts.ephemeral` Lab hook; audio redesign (ceremony wiring
uses existing cues only); analytics / crash telemetry (named for the
Capacitor round, not silently dropped); screen-reader support (declared
deferral — keyboard path is in scope); localisation (registries merely
centralise strings for it); daily seeds / challenge modes; cutout/skeletal
rigging; Act 4 content (the `_sample` pack is scaffolding, not content);
store-grade capture and device-framed store matrices (Capacitor round);
trailer editing; save-storage migration (stays guarded localStorage / vigil
adapter until the Capacitor round); retrofitting context-loss restore onto
scene3d/mesh (Capacitor round).

## Exit contracts

There are three distinct outcomes; the implementation record must name which
one occurred rather than blending them into one definition of “done”.

1. **Compatibility NO-GO / re-scope:** P0.5 fails a written functional
   criterion. The spike has succeeded as a decision gate, but Round 5 has not
   shipped or completed. Production migration stops and this design must be
   revised before execution resumes.
2. **Supported reduced-scope prefix stop:** P0.5 passes and a contiguous phase
   prefix ending at P4, P5, or P6 passes every applicable standing gate. The
   execution record names the last completed phase and the explicitly deferred
   tail:
   - **P4 PE-core:** combat chrome is Pixi while the hand remains DOM under the
     P4 allowed-list; P5–P7 are deferred. It may claim the commercial-engine
     substrate, but not fully game-rendered combat.
   - **P5 combat-complete:** combat is fully game-rendered; P6–P7 are deferred.
     It may claim the combat migration, but not screen/store completion.
   - **P6 presentation-complete:** all P6 screen gates and owner sign-offs pass;
     P7 is deferred. It may claim screen completion, but not ship-front assets.
   Every prefix stop is supported and shippable, but none may claim “Round 5
   Full-Round complete”. Partially completed phases are preparation, not an
   additional exit state.
3. **Full-Round target:** the complete success criteria below pass. P5, all P6
   screen sets and P7 ship-front outputs are present. Content Manager and the
   dev shell remain the only optional feature deliverables.

## Full-Round success criteria

1. **P0.5 Simulator Safari compatibility spike passed its written functional
   criteria.** The evidence makes no physical-device claim.
2. **Semantic behaviour proof:** an AI can diagnose representative screen,
   card-drag/cancel, combat queue, ceremony, persistence-recovery, and renderer-
   recovery journeys from the timestamped text alone; Playwright and Simulator
   Safari assert the same structured contract; every **trace-enabled functional
   test** reports valid order, no drops, no orphaned spans, and no unexpected
   trace errors; its failure artifacts contain both NDJSON and text. Timing/perf
   tests deliberately run with recording disabled. Probe state and visual
   baselines remain the
   separate current-state and pixel proofs.
3. Combat is fully game-rendered: DOM in combat is exactly the allowed list;
   the perf gate passes with the Pixi scene active on the portrait project;
   the desktop full-tier number is recorded nightly; the P5 falsifiable wins
   are all present.
4. bfuiedit still edits live chrome geometry, now rendered by Pixi; bfedit
   (combatants + stage plates, which stay DOM) is unaffected and still works.
5. **Registry proof:** the three-leg golden equivalence holds; the `_sample`
   fixture pack boots a **climbable** mini theme in the Lab with zero code
   changes outside its own directory; the act-coupling sweep passes with its
   enumerated residue; the content doctor reports the core pack 100%
   complete.
6. **Tooling proof:** the Lab stages any registered encounter (including
   variants) from a pasted URL and can replay a correlated trace beat; if the
   Content Manager shipped, it round-trips an edit through `/__content-save` with
   a clean `npm test` afterwards.
7. All four screen sets carry **owner contact-sheet sign-offs** (austere and
   grown profiles); fallen/victory play as specified ceremonies with wired
   audio; the title has its ignition; combat has its keyboard path.
8. Every PR receives the required CI status; the full kit runs on relevant PRs
   and pushes to main, while docs/tooling-only changes receive the required
   no-op success. A red required status blocks merge; the bundle budget is
   measured and held.
9. The store kit's script + shot list + listing content doc exist; the
   provisional capture set is produced from one scripted run.
10. Fresh-profile and veteran-profile manual smokes (with the Progressive
   Delivery reveal ladder active) both read coherently on desktop and in actual
   Safari across the representative iPhone/iPad Simulator matrix.
11. Every implementation task has one `[PE]`, `[FE]`, `[QA]`, or `[OWNER]`
    lead; PE/FE parallel work has disjoint write sets; every shared-file change
    has a named sequential hand-off; and a fresh QA agent approves both spec
    compliance and code quality before integration.
