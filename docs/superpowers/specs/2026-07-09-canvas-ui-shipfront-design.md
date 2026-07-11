# Spirebound — Round 5: Canvas UI, Content Registries & Ship-front (design)

**Date:** 2026-07-09 (revised same day: content-registry & dev-tooling amendment;
revised again after three independent reviews — gstack four-lens, ponytail
over-engineering, ask-matt grilling — with owner decisions recorded below;
revised 2026-07-10: commercial-grade production framing, semantic UI behaviour
trace, iOS Simulator Safari coverage, and explicit Production Engineering /
Front-end Experience agent ownership; revised 2026-07-11 after PR #14 and
PR #15 merged: the 32-export data contract, transactional Dawn recovery,
parallel-CI/performance policy, Phase 2 presentation states, and hot-applied
audio-gallery behaviour are now part of the Round 5 baseline; revised again
after PR #16 merged: all 22 Music Cues, the pure cue resolver and their live
Phase 2 call sites are predecessor behaviour rather than Round 5 intent;
revised again after PR #18 and PR #7 merged: app versioning/release semantics
and the English i18n overlay are loaded predecessor contracts, and the registry
design now composes mechanics packs with locale overlays instead of reclaiming
English display ownership; revised again after PR #17 merged at `40eb357`:
its combat-chrome grounding, fixed energy-candle frame and geometry regression
proof are inherited production behaviour, not styling to rediscover; revised
again after the first live P0.5 Safari row to make the Simulator input profile,
host-safety boundary and complete-matrix GO/NO-GO evidence contract explicit)
**Goal:** The commercial-grade production-engineering and final visual-hardening
round. Replace the fragile CSS-composited
combat UI with a **game-rendered PixiJS layer** (chrome *and* hand cards),
rebuild the content substrate as **registries + compiled-in content packs** so
expansions and Act 4 become data drops instead of codebase surgery, grow the
dev tooling (Content Lab, completeness reporting, Content Manager), give
every remaining screen (title, Embark, Fall/Dawn, non-combat panels, map)
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
`2026-07-09-entrance-progressive-delivery-design.md` (**landed prerequisite:**
Phase 2 — variants, the Emberglass chain, Rose Window, transactional Dawn and
sealed summit promise — merged in PR #14 at `4698906`; PR #15 established
hot audio-gallery preview/apply at `4dc1af7`; PR #16 then wired the complete
22-cue Music catalogue into the live Phase 2 surfaces at `7b8e01a`; PR #18
established package-sourced app versioning and the manual release convention at
`de84c30`; PR #7 extracted the default English catalogue and Node-pure i18n API
at `b285b81`; PR #17 then landed combat-chrome geometry and fixed candle-frame
behaviour from base `b285b81`, reviewed head `5cd1c55`, at merge/current minimum
baseline `40eb357`. Every Round 5 execution branch must contain all six merges before
runtime work. The merged surfaces and contracts are inputs, never work for
Round 5 to reimplement.)

## Decisions record (owner-approved)

| Question | Decision |
|---|---|
| Commercial-grade target | **Production quality, not appearance alone** — presentation, content integration, observability, deterministic regression evidence, recovery, and mobile compatibility all move together |
| Capacitor packaging | **Out of scope** — this is production engineering and presentation, not packaging. Capacitor *compatibility* is protected by WebKit-safe APIs, the GPU context budget, and Simulator Safari coverage; physical-device performance/feel evidence is deliberately deferred to the Capacitor/hardware round |
| UI end-state | **Canvas/WebGL chrome**, not data-driven DOM and not a framework migration |
| Canvas migration depth | **Full combat UI including hand cards** — but gated: the **P0.5 Simulator Safari compatibility spike** must pass before P1 begins, and a **P4→P5 Simulator/Playwright checkpoint** must pass before the hand migrates. "Pixi chrome + DOM hand" is a declared-acceptable shipped state if P5 stops |
| Engine | **PixiJS v8**, strictly WebGL with `preference: ['webgl']` (never the fall-through string form and never WebGPU) |
| Ordering vs content line | **Progressive Delivery Phase 2, PR #15/#16, PR #18 app versioning, PR #7 English i18n and PR #17 combat geometry are loaded** at the `40eb357` minimum baseline. A later `main` change triggers a fresh drift audit before execution. During Round 5 P2 (re-homing) the mechanics and English-catalogue lines observe a **content-table freeze** (assets/plans only) |
| Delivery lanes | **Production Engineering (PE) is the primary lane; Front-end Experience (FE) is a small, design-led lane.** PE owns all substrate, refactoring, Content Lab/manager, renderer mechanics, tooling, tests and integration. FE owns only authored player-facing presentation. Separate fresh spec-compliance and code-quality review cycles verify each unit; owner taste checkpoints stay with the owner |
| Parallel execution | PE and FE may run concurrently only from separate worktrees on a written disjoint-file manifest. A shared file is a sequential hand-off, never a concurrent edit. Every implementation-plan task has exactly one `[PE]`, `[FE]`, `[QA]`, or `[OWNER]` lead |
| Content substrate | **Full paired content architecture**: per-domain schemas join mechanics/behaviour from the `core` pack to English display data retained in the PR #7 locale overlay; `data.js` aliases the resulting hydrated frozen context. Registry work lands **before any production Pixi migration**; the disposable P0.5 compatibility spike is the sole exception. Enemy `ai` stays code; the legacy Hollow target getter is materialised from merged progression rather than copied with a global closure; an AI-DSL is explicitly out of scope |
| Pack delivery | **Compiled-in** (static imports; an expansion ships as an app update). Runtime/downloadable DLC out of scope — the pack *format* is the future-proofing, not a download pipeline. No save-shape change for packs (unknown-id validation already rejects a save whose content is absent) |
| Dev tooling | Dev shell, Content Lab, completeness reporting ("content doctor"), and **Content Manager** (the schema-driven CRUD editor). Content Manager and the dev shell are **droppable pressure-valve items**; Content Manager covers cards/relics/potions/themes only and never touches behaviour fields. All are PE, not FE |
| UI behaviour observability | **Semantic UI Behaviour Trace** — a renderer-neutral, versioned structured event stream is canonical; timestamped text and NDJSON are derived AI/human views. It lands at the start of P1 before decomposition, is local and bounded, and is not analytics or a second source of game truth |
| Mobile browser matrix | Playwright WebKit device emulation and actual Safari in representative iOS/iPadOS Simulators are separate lanes. Simulator Safari is driven serially through Apple `safaridriver`; Round 5 deliberately has no physical-device gate and makes no physical FPS, memory, thermal, background-eviction, latency, or touch-feel claim |
| Performance policy | The merged Phase 2 policy remains authoritative: **a missing, invalid or crashed measurement fails; a valid 55fps/22ms target miss is a recorded warning/reference, not a merge failure**. Round 5 records portrait/LITE and desktop/Full Pixi measurements without claiming Simulator or physical-device performance |
| Phase 2 domain language | A successful Climb ends at **Dawn** and a death is a **Fall**. Internal compatibility values (`win`, `death`), route names and Music Cue ids (`victory`, `defeat`) stay unchanged |
| Phase 2 music baseline | PR #16 makes **all 22 existing Music Cues live**. `src/music-resolve.js` is the Node-pure resolution truth; quest overrides beat Eighth Omen, Eighth Omen beats ordinary non-boss act music, and bosses retain their boss cue. Rose/Vigil, Hollow, sealed-door and Dawn exceptions are protected live call sites, not FE wiring requests |
| App-version baseline | PR #18 makes `package.json` version `0.5.0` the authored source; DEV embeds a live short SHA, ordinary builds show `0.5.0+unknown`, and only explicit release builds show clean semver. The safe-area Title label and hidden debug gesture are protected behaviour. Release scripts remain manual preparation and never commit, tag or push |
| English i18n baseline | PR #7 keeps the default locale `en`, exposes exactly seven Node-pure i18n APIs, owns English display strings in 18 content domains plus the UI catalogue, and hydrates the compatibility graph once at module initialisation without changing saves. Round 5 completes/preserves English coverage; it does not ship a second locale or runtime language switch |
| Combat-geometry baseline | PR #17 is PE-owned behaviour: foe chrome remains naturally under its own foe with stable dead-member packing, the resting-hand floor is static across hover, and energy slots compress inside shape-specific fixed frames. FE owns treatment only and may not move, relax or reinterpret these bounds |
| Store kit | Keep the **capture script + shot list** (rerunnable assets); the captured set is labelled **provisional/marketing-only**; trailer capture is raw reference footage only; device-framed store matrices and store-grade capture re-run in the Capacitor round |
| Screens in scope | All four sets: Fall/Dawn, title + Embark, non-combat panels (rewards/shop/event/rest/lamplighter/vigil), map re-upgrade (light) |
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
| **Production Engineering (PE)** | Primary/root agent | P0.5–P5 leadership; engine/data/registry/i18n/version contracts; all locale keys, English values, accessibility copy and runtime fallback behaviour; `ui.js` decomposition; all product JavaScript; stable markup/selectors; Semantic UI Behaviour Trace; Content Lab, doctor and editor; Pixi bootstrap and widget/card mechanics; input, probe, geometry, recovery, audio wiring, performance, capture, tests, CI, release/dev endpoints, docs and final integration | Player-facing taste, art direction or owner sign-off |
| **Front-end Experience (FE)** | One separate FE agent | One exact experience contract for P4–P6; the dedicated Round 5 screen stylesheet; approved visual token values; supplied-copy fit, hierarchy, wrapping, placement and motion; P7 visual assets, contact-sheet critique and provisional store compositions. FE may reference locale keys but cannot author or alter copy | Content architecture or management; localisation keys/values/fallbacks/accessibility wording; refactoring; any product JavaScript; trace; renderer/input infrastructure; dev tooling; probe; engine/audio wiring; test harnesses; capture automation; CI/perf; changing ids, schemas or save shape |
| **Verification (QA)** | Two fresh reviewer agents, each independent of the task implementer and of the other review role | Spec-compliance review first; fixes and re-review; then code-quality review; fixes and re-review. Read-only re-runs and closure confirmation are allowed | Producing or modifying product/test-harness code, owning gate evidence, fixing findings, combining the two reviewer roles, or making taste decisions |
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
  `src/vigil.js`, `src/data.js`, `src/version.js`, `src/i18n/**`,
  `src/registry.js`, `src/packs/**`, the P1
  extraction of `src/ui.js`, `src/ui/**`, probe/test code, Vite/dev-server
  endpoints, workflows, geometry/layout resolvers, capture scripts,
  `src/styles.css`, performance instrumentation and build configuration.
  Round 5 authors no new player-facing wording without owner approval; when a
  touched residual literal must move, PE adds the approved English locale key
  and value while FE preserves its presentation.
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
implementation unit follows one exact Superpowers 6.1.1 sequence: a fresh
implementer, then a fresh spec-compliance reviewer; the implementer fixes every
finding and the same spec reviewer re-reviews; only then a fresh code-quality
reviewer reviews, followed by implementer fixes and that reviewer's re-review.
No combined QA agent or single combined verdict substitutes for the two review
roles. PE produces gate evidence and implements fixes; reviewers may re-run
commands read-only and confirm closure without editing product or test-harness
files. An additional fresh closure reviewer may still audit a phase gate.

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
- Post-Phase-2 `ui.js` is a 5.6k-line single orchestrator rendering every
  screen and coordinating the new persistence/Dawn transactions.
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
- Fall/Dawn screens are a meta plate behind a CSS panel; the title got
  *cleaned* by Progressive Delivery Phase 1 but never visually hardened; the
  non-combat screens only ever received scene-panel backdrops and icons.
- CI wiring is complete at P0. Repeatedly deferred per-boss stages and store
  assets remain; later work extends the existing CI gate for the new contracts.

## Invariants (violating any fails review)

- **The predecessor gate is a hard runtime stop.** Before P0.5, PE verifies
  from the execution branch itself that PR #14 merge `4698906`, PR #15 merge
  `4dc1af7`, PR #16 merge `7b8e01a`, PR #18 merge `de84c30`, and PR #7 merge
  `b285b81`, followed by PR #17 merge/current baseline `40eb357` (base
  `b285b81`, reviewed head `5cd1c55`), are in its ancestry. PR #17's final
  required roll-up is 24 `SUCCESS` checks plus only the expected skipped
  `e2e smoke`. The branch must
  expose all 32 current
  `src/data.js` exports: 28 content views plus `QUEST_STATES`,
  `QUEST_ACTIVE_STATES`, `TERMINAL_OUTCOMES` and `RUN_ID_RE`; the Emberglass,
  Rose Window, sealed-door, transactional Dawn and hot audio-gallery surfaces
  must be present. The 22/22 live Music catalogue, pure resolver and real
  Phase 2 cue call sites must also be present. It must retain `package.json`
  version `0.5.0`, the version/release UI and build contracts, the unchanged 32
  data exports, exactly seven i18n APIs, default `en`, all 18 English content
  domains, and module-init hydration with no save-shape change. A later `main`
  change reopens the drift audit. A local dirty predecessor worktree never
  satisfies this gate.
- **PR #17 geometry is inherited PE behaviour.** Desktop dual-foe authored x
  positions remain exactly `1000` and `1197`. The combat-chrome hand floor is
  computed from the resting hand with `50` stage-px slack and clamped at
  `maxBottom - 4`; it never follows a live hover/cast card. Enemy top and bottom
  rows pack independently in DOM order with `6` stage-px gaps, remain naturally
  under their own foe with the minimum displacement needed for hero/stage
  clearance, retain dead members so survivors do not drift, and each bottom
  plate horizontally overlaps its own art. Centre drift is at most `90` stage
  px generally and `80` for the desktop pair; hover moves a foe plate's top and
  bottom by at most `1` stage px. Candle frames are fixed at `120` stage px for
  `pad-landscape` and `desktop-landscape`, `102` for `pad-portrait`, `84` for
  `phone-portrait`, and `72` for `phone-landscape`; more slots compress pitch
  inside the frame instead of widening it. P1 extraction, P4
  Pixi `readUI()` geometry, P5 hover/hand migration and the DOM-removal gate
  preserve these exact semantics. Only the three PR #17 Linux visual baselines
  (`combat-act1-landscape`, `combat-act2-landscape`, and
  `combat-act2-portrait`) are inherited changed baseline files; Round 5 may not
  normalise unrelated snapshots or rebuild `dist/` before its final/prefix gate.
- **Engine purity is untouched.** `engine.js`, `vigil.js`, `data.js`,
  `battlefield*.js`, `uic.js`, `ui-chrome-layout.js`, and the new
  `src/content-protocol.js` / `src/registry.js` /
  `src/content-registration.js` / `src/i18n/hydrate-content.js` /
  `src/packs/**` /
  `src/ui/tokens.js` / `src/ui/behaviour-trace.js` /
  `src/ui/presentation-barrier.js` / `src/ui/run-effects.js` and the existing
  `src/music-resolve.js`, `src/version.js`, and `src/i18n/**` stay
  Node-runnable and DOM-free. Existing `src/choice-latch.js` stays Node-pure.
  `drain()` still
  consumes `cb.queue`; only the playback target changes from DOM to sprites.
  The trace observes presentation and never enters the engine import graph.
  `npm run test:ci` and `npm test` stay green at every task boundary.
- **The import graph is preserved.** `engine.js` and `vigil.js` import
  `data.js`, never i18n/version/UI. Core registration imports only the
  content-domain namespace from `src/i18n/en/content.js`, never
  `src/i18n/en/index.js` or `src/i18n/en/ui.js`; registry hydration uses the
  content-only `src/i18n/hydrate-content.js`, while `src/i18n/index.js`
  re-exports the unchanged PR #7 API. The P2 assembler consumes a generated
  target manifest and calls
  `createContentContext(packs, { id, resources, localeContent, localeToken })`;
  that function descriptor-validates, copies and derives a fresh mutable
  compatibility graph, invokes the existing `hydrateContent` before locale
  validation and recursive freeze, and preserves required aliases/identities.
  `data.js` aliases the already-hydrated frozen context's 28 content views and
  re-exports four protocol constants; it performs no post-freeze mutation.
  Protocol constants are not pack-merge content.
- **Registration is compiled, paired and central-switch-free.** Every content
  unit is one Node-pure `{id, mechanics, locales, targets}` registration with
  required `locales.en`. An import-safe deterministic compiler discovers only
  `src/packs/*/registration.js` and generates committed production/development
  manifests. Production imports no development/sample registration; stale
  generated bytes fail `--check`. Runtime validates unique registration/pack
  ids, selects the generated target plus requested fixtures, joins locale
  fragments, then invokes the one context assembler. Generated manifests are
  never hand-written pack switches.
- **Registry refactor is behaviour-neutral, proven three ways.** Content
  tables contain functions (enemy `ai`), the pre-registry Hollow target is a
  getter closing over global progression, and the compatibility surface
  contains a RegExp (`RUN_ID_RE`), so "deep-equal a JSON fixture" alone is
  unimplementable. The golden-equivalence gate is: (i) deep-equal on a stable
  observable-value projection of all 32 exports which strips behaviour
  functions and encodes RegExp `source`/`flags`, plus a descriptor inventory
  proving the single legacy Hollow getter is intentionally replaced by the
  same numeric value derived from the merged context's progression; (ii) behavioural
  trace equivalence for each enemy `ai` over a fixed seeded schedule of the
  complete live context (`turn`, `last`, `prev`, `hpFrac`, `rng`, and mutable
  `self`), before vs after re-homing — comparing the returned move, RNG
  consumption/final state, and every permitted `self` mutation; (iii) the
  fixed-seed monte-carlo digest unchanged. All three legs are `npm test` checks.
- **Internal keys, card/relic/status ids, and the post-PR16 save shape are
  immutable.** Re-homing content into packs changes file locations, never ids.
  No new save fields for packs. The protected baseline includes `runId`, quest
  snapshots, pending encounters/rewards/Hollow routes/Shade duels,
  `pendingRunEnd`, `pendingDawn`, Dawn cursor/clear recovery, Vigil receipts and
  bequest validation.
- **PR #7's i18n slice is preserved, not expanded by implication.** The exact
  API is `lookup`, `t`, `getLocale`, `setLocale`, `registerLocale`,
  `hydrateContent`, and `getContent`; default `en` owns the 18 domains `cards`,
  `status`, `relics`, `potions`, `arts`, `boons`, `enemies`, `events`, `omens`,
  `affixes`, `acts`, `aspects`, `vows`, `deeds`, `quests`, `whispers`,
  `variants`, and `shadeKits`. `setLocale()` changes `t`/`tr` lookup only in
  this slice: it does not rehydrate tables, rerender screens, persist a choice,
  add a picker, or change saves; unknown codes return `false` and are no-ops.
  P1 preserves every `t as tr` call, lazy `KEYWORDS()`/`FACET_DESC()` and
  `$$('.kw', card)` wiring. P2 completes English catalogue validation while a
  second locale, RTL and locale-specific fonts remain deferred.
- **PR #18's app identity is preserved.** `package.json` `0.5.0` is the only
  authored version. Vite defines `__SPIRE_VERSION__`, `__SPIRE_GIT_SHA__` and
  `__SPIRE_RELEASE__`; DEV serve embeds the real short SHA, an ordinary build
  deliberately uses `unknown`, `SPIRE_EMBED_SHA=1` is local smoke only, and
  `SPIRE_RELEASE=1` produces clean semver. `src/version.js` remains Node-pure.
  The bottom-right label respects safe-area variables, has no `data-a`, and
  five logo taps within two seconds reveal an `aria-live="polite"` debug row
  for three seconds (or hide it on the next completed gesture) without SFX.
  `npm run release`/`release:build` never run automatically and the release
  tool never commits, tags, or pushes.
- **Phase 2 terminal work has one transactional owner.** P1 extracts one
  Node-pure run-effects seam before moving the end, overlay or combat owners.
  It preserves journal → save → `commitPendingRunEnd` → Vigil/stats receipt →
  run acknowledgement ordering, idempotent retry, navigation lock, Dawn
  stage/cursor/final-clear recovery, Hollow/Shard/bequest recovery and the
  one-shot `choice-latch` guards. P3 extends that same seam for ephemeral Lab
  runs; it never creates a second terminal path.
- **Schemas are the single source.** Registry schemas drive validation, the
  content-doctor report, and Content Manager's CRUD forms. No tool re-declares
  content shape. Unknown extension keys warn, never fail. Behaviour-valued
  fields (`ai`, event hooks) are declared as `kind: 'function'` in the schema:
  validated for presence/arity only, excluded from projection, serialisation,
  and CRUD forms. Pack getters/setters are rejected because their closures can
  bind the wrong context. Assembly derives the numeric Hollow Quest target from
  that context's merged progression. Protocol RegExp/constants are outside pack
  schemas.
- **No act coupling outside packs.** After the theme extraction, act
  references may not survive outside pack content — and the sweep covers
  more than string literals: numeric act indices, clamps (e.g. the
  `Math.min(act, 2)` weather clamp in `vfx.js`), and `length`-of-acts
  assumptions. Current final-act comparisons, `PALE_BY_ACT` clamps and save
  validation ceilings must resolve through registered theme count/finality;
  they cannot be allowlisted while this round claims future Act 4 registration
  is a data drop. Fixed three-act tower geometry/editor coordinates are the
  only expected residue and enter an explicit, enumerated allowlist.
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
- **GPU context budget.** The renderer option is exactly
  `preference: ['webgl']`; Pixi 8.19's scalar preference form is forbidden
  because it falls through to WebGPU/canvas. **All** WebGL contexts count,
  including detached/id-less Pixi support-test canvases. The observer computes
  live total from every captured context using `!gl.isContextLost()`, while a
  separate named-owner assertion requires `bg3d`, `mesh`, and `uigl`. Before
  creating `uigl`, prewarm a `ColorMatrixFilter`/`GlProgram` while only bg3d and
  mesh are live, observe Pixi `isWebGLSupported()`'s temporary
  `getTestContext()`, explicitly lose that context through
  `WEBGL_lose_context`, and prove it is lost. Steady state has no live unowned
  context and the all-context maximum is three before, after, and throughout
  recovery. The new Pixi layer ships with a context-loss/restore contract (what
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
- **PR #15/#16 audio behaviour is a protected baseline.** Unsaved
  per-row selection previews the draft ref; Save posts metadata only, applies
  in place without reload, invalidates SFX/music selection caches and
  re-resolves the active cue; `_raw` audio never enters inventory or bundle;
  production remains read-only. `public/audio-selection.json` is the mutable
  gallery Save output: it must be a valid installed selection and exactly match
  the canonical serialiser, but tests must not pin a pack version or require
  empty overrides. PR #16 makes all 22 catalogue rows live and adds the
  Node-pure `music-resolve.js`: quest combat (`paleOnes`, `ownShade` →
  `shadeDuel`, `usurper`) takes precedence over Eighth Omen; Eighth Omen owns
  non-boss map/event/combat; ordinary boss/elite/act fallback remains stable.
  `hollow` resolves to `hollowLamplighter`; Vigil Rose tab, sealed-door
  open/close restore, and Dawn `pageRead`/`act4Reveal` own their named ceremony
  cues. Reward and boss-relic screens make no screen-cue request and preserve
  whatever cue is currently active (combat/victory in the nominal uninterrupted
  flow; another active cue is possible after pending-state recovery). P1
  extraction and P2 theme work preserve these call sites, precedence,
  warm-neighbour edges and tests. `music-resolve.js`
  imports neither browser audio nor trace; the trace observes the resolved
  logical id/result only at the real `music.js` playback sink. A forced gallery
  preview remains preview evidence only; it never substitutes for a real
  gameplay call-site test.
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
  Phase 2 transaction records use bounded stable kinds/reasons for initial-run
  save, Usurper purchase, Shade bequest clear, Hollow payment/route clear,
  terminal finalisation and Dawn cursor/final clear. Compact checkpoints may
  include terminal lock, pending kind, Dawn cursor/total and Hollow route type,
  never a full save. Phase 2 Probe enemy identity (`key`, `variantId`, `artId`)
  and forced Rose fallback remain visible through their existing read-only
  contracts.
- **Trace scope is local diagnostics.** It is enabled only in development,
  tests, or an explicit non-public QA build; ordinary production builds take a
  no-op path. It has no network exporter, automatic persistence, user analytics,
  or crash reporting. Performance measurements run with recording disabled so
  the observer cannot perturb the number it measures.
- **Dev tooling is dev-only.** The Lab / doctor / Content Manager and the
  `/__content-save` endpoint exist only under the Vite dev server (same
  same-origin gate as `/__bf-save`); none of it reaches the production
  bundle. The `_sample` mechanics/locale fixture pair is imported by tests and by the Lab
  behind a dev flag; it never registers in production builds.
- **Docs move with their contracts.** The same rule as Playwright: any phase
  that changes a documented contract (module graph, icon policy, tool list)
  updates `docs/README.md`, the relevant `CONTEXT.md`/domain docs and the Round
  5 report in the same phase. The existing repository `AGENTS.md` is not edited
  by Round 5. Stale contract docs are an active hazard in an LLM-executed repo.
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
src/packs/core/**              src/i18n/en/content.js
(mechanics + behaviour)        (content-only English overlay: 18 domains)
           ↓ definePack()       ↓ named-domain namespace
           └────────────┬───────┘
                        ↓ defineContentRegistration()
src/packs/core/registration.js  {id, mechanics, locales, targets}
                        ↓ convention discovery
tools/compile-content-registrations.mjs
                        ↓ deterministic committed manifests
src/packs/compiled/{production,development}.js
                        ↓ target/fixture selection + locale-fragment join
src/content-registration.js  compileContentRegistrations(manifest, ...)
                        ↓ exactly one call
src/registry.js  createContentContext(packs,
                 { id, resources, localeContent, localeToken })
                 validate descriptors → copy/derive mutable graph →
                 content-only hydrateContent → validate coverage → freeze
                        ↓
src/content-protocol.js (four immutable validation/protocol exports)
                        ↓
src/data.js       (aliases one already-hydrated frozen context:
                   28 content views + four protocol re-exports)
           ↓                                      ↓
engine.js + vigil.js (data only)      ui/* + vfx + music + real locale token
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
| `src/ui/run-effects.js` | sole DOM-free terminal/Vigil/stats/Dawn/Hollow/Shard/bequest transaction adapter; normal path first, later extended for ephemeral Lab suppression | P1, P3 | PE |
| `src/ui/drain.js` | `drain()` and the event→handler dispatch | P1 | PE |
| `src/ui/combat.js` | combat screen assembly (later delegates to `src/ui/combat-gl.js`) | P1 | PE |
| `src/ui/screens/*.js` | title, embark, map, rewards, shop, event, rest, lamplighter, end, vigil | P1, P6 | PE owns all JavaScript; FE contract + dedicated CSS provide presentation |
| `src/content-protocol.js` | `QUEST_STATES`, `QUEST_ACTIVE_STATES`, `TERMINAL_OUTCOMES`, `RUN_ID_RE`; never pack-merge content | P2 | PE |
| `src/registry.js` | pack registration, schemas, merge, content doctor | P2 | PE |
| `src/content-registration.js` | paired registration validation, compiled target/fixture selection, locale join, one context assembly and provenance | P2 | PE |
| `src/i18n/hydrate-content.js` | content-only hydration implementation; `i18n/index.js` re-exports the unchanged API without putting `en/ui.js` in the engine graph | P2 | PE |
| `tools/compile-content-registrations.mjs` | import-safe convention discovery and deterministic `--check`-able target-manifest generation | P2 | PE |
| `src/packs/compiled/{production,development}.js` | generated registration manifests; no hand-written switch, production excludes dev/sample | P2 | PE |
| `src/packs/core/**` | existing mechanics and declared behaviour, re-homed without English display fields | P2 | PE |
| `src/packs/{core,_sample}/registration.js` | mechanics/English pairing and target metadata; sample is development/fixture only | P2 | PE |
| `src/i18n/en/content.js` | existing English display ownership retained as the compiled-in locale overlay | predecessor/P2 validation | PE; FE may consume keys but not edit copy |
| `src/packs/_sample/**` + `locale-en.js` | dev/test-only mechanics fixture plus matching English overlay (a card, an enemy, a mini theme) | P2 | PE |
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
new-page records. The segment header records sanitised app version/build
identity and active locale once; normal fixtures strip the volatile short SHA.
Records may carry stable locale codes, locale keys and control ids, never
resolved copy, HTML or dialogue. Missing-copy diagnostics emit only a stable
key and reason code.
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
- the merged Phase 2 presentation owners `bossIntro`, `variantDialogue`,
  `questReveal`, `questProgress`, `questComplete`, `questUnlock`,
  `monumentGift` and `hollowTithe`, preserving their queue correlation;
- named presentation ceremonies start/end, with terminal outcome `settled`,
  `cancelled`, `skipped`, or `failed`; REDUCED is renderer-policy metadata plus
  a named end-state, never a lifecycle outcome. A handler finishing stays
  distinct from detached motion actually settling;
- meaningful Music Cue/SFX request outcomes, audio unlock, and persistence
  attempts/blockers/recovery with stable `kind`/`reason` for initial-run save,
  Usurper purchase, Shade bequest clear, Hollow payment/route clear, terminal
  finalisation and Dawn cursor/final clear; renderer context
  loss/rebuild/ready; and trace/invariant errors;
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
Normal game URLs are never mutated. Replay URLs contain ids and an optional
locale code, never resolved copy. Non-replayable spans expose a stable disabled
reason instead of pretending they can be replayed.

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

`data.js` stops *containing* content and starts *aliasing* one assembled,
already-hydrated context. The assembler composes mechanics packs with the
existing English locale overlay through `src/registry.js`, and preserves exactly
32 named exports. Twenty-eight are content/derived views (`CARDS`, `ENEMIES`,
`RELICS`, `POTIONS`, `EVENTS`, `STATUS_INFO`, `OMENS`, `BOONS`, `ASPECTS`,
`DEEDS`, `VARIANTS`, `WHISPERS`, `PROGRESSION`, `REVEALS`, and the remaining
enumerated surface); four are immutable protocol exports from
`src/content-protocol.js`: `QUEST_STATES`, `QUEST_ACTIVE_STATES`,
`TERMINAL_OUTCOMES` and `RUN_ID_RE`. Engine, tests, saves, and UI consumers
never notice. **During this phase the content line observes a
content-table freeze** (assets and planning only); the P2 plan names who folds
the merged Phase 2 mechanics for `VARIANTS`/`WHISPERS`/`QUESTS` into the core
pack while English names, prose and dialogue remain in
`src/i18n/en/content.js`.

Assembly is driven only by generated registration manifests. Node-pure
`defineContentRegistration({id,mechanics,locales,targets})` pairs each pack with
required English locale data and target order. The import-safe compiler
discovers convention-based `src/packs/*/registration.js`, then deterministically
generates committed `src/packs/compiled/production.js` and `development.js`;
`--check` rejects stale output. Production contains no development/sample
import. Core registration imports the named-domain namespace directly from
`src/i18n/en/content.js`, not the combined English bundle, so UI copy remains
outside the engine/data dependency graph.

`compileContentRegistrations()` validates unique registration and mechanics-
pack ids, selects the generated target plus explicit fixtures, joins locale
fragments, and calls `createContentContext()` exactly once. `src/content.js`
consumes only the generated production manifest. `src/packs/dev.js` consumes
only the generated development manifest through generic fixture selection.
Neither file names packs, joins a locale manually or owns an act/target switch.
Doctor, Lab and Content Manager consume the same compiled provenance and schema
field ownership rather than reconstructing a pack list.

The live cut-over has two reviewed halves. First PE assembles and validates the
complete core candidate while `data.js` remains authoritative. The full
factory signature is
`createContentContext(packs, { id, resources, localeContent, localeToken })`.
It descriptor-validates and copies raw mechanics, derives compatibility views,
calls the predecessor's `hydrateContent` on that fresh mutable graph, validates
locale coverage/source ownership, then recursively freezes. Then, still
against live data, it installs the engine-private run→content seam and
refactors Phase-2 tuning/save tests to use fresh explicit frozen contexts. Only
after simultaneous core/tuned runs pass does `data.js` atomically alias the 28
content views from that frozen context and re-export the four protocols without
post-freeze hydration or mutation. Public `loadRun()` stays core-
only and zero-argument; no content id enters the save shape. This ordering makes
the `_sample` engine proof real before the Lab UI exists.

Before moving the first table, PE commits the **before oracle** from a clean,
detached exact `40eb357` post-PR17 production worktree. The later capture tool
accepts that explicit source root and output path; data/engine/i18n imports
resolve from the detached root. Source SHA/tree and capture-parent HEAD/tree are
recorded separately as source and capture-parent provenance; exact working
SHA-256 values for the still-dirty capture tool and its test prevent the parent
tree being misreported as the implementation. The oracle contains the complete hydrated 32-export stable
observable-value projection (including
RegExp `source`/`flags`), a separate raw-mechanics ownership projection, the
English catalogue digest/provenance, the exact seven-API inventory, and a
property-descriptor inventory which identifies the legacy Hollow getter,
the seeded full-context enemy-AI trace
digest, the fixed-seed monte-carlo digest, and provenance for the inherited
PR #17 layout/UI/tests plus its exact three Linux baseline paths. The content
oracle does not serialise pixels or claim ownership of geometry, but its source
SHA and clean-tree manifest prove that no pre-PR17 monolith was captured. The
same tests then run against
the assembled registries after each move. Capturing an oracle after deleting
the old table is invalid evidence.

The post-prerequisite export inventory is exhaustive, not illustrative. The P2
plan classifies every `src/data.js` export — including entity domains,
aggregates such as `VOWS`, `AFFIXES`, `ENCOUNTERS`, `SHOP`, `PROGRESSION` and
`REVEALS`, constants, and derived pools/views — as pack-owned, registry-owned,
or assembler-derived, and assigns explicit merge/derivation semantics. No
export may disappear merely because it was absent from the domain shorthand
below.

### Pack contract: mechanics plus declared behaviour, joined to locale data

Content tables are not purely declarative — enemies carry `ai` functions and
events carry hooks. The pack contract is therefore **"Node-pure mechanics plus
declared behaviour functions"**: function fields are named in the schema as
`kind:'function'`, validated for presence/arity, and excluded from
serialisation and CRUD forms. Getters/setters are rejected. The legacy
`QUESTS.hollowLamplighter.target` getter is a pre-registry coupling artifact:
assembly materialises the same numeric target from the merged progression
context, so a custom/tuned context cannot close over production globals.
Protocol RegExp/constants never enter a pack. English display fields remain in
the parallel compiled-in locale overlay; they are not copied into pack source.
Every schema field declares exactly `source:'pack'` or `source:'locale'`.
Known locale-owned fields found in mechanics are errors; ordinary unknown
extension keys still warn. The same metadata drives locale coverage, doctor
rows and joined Content Manager forms. A mechanics-only partial registry is
allowed for isolated mechanics validation, but only a full joined context may
back `data.js`, production UI or a climb.
Converting `ai` to a declarative DSL is an engine-mechanics change and
explicitly out of scope.

The paired registration is the only full-context admission seam. Mechanics may
still be tested alone, but production/dev/Lab/doctor/Manager assembly starts
from a generated manifest, preserves its registration provenance, requires an
English fragment per registration and joins fragments in deterministic target
order. A pack array or locale join authored in `content.js`, `packs/dev.js` or
dev tooling is a spec failure even if its values happen to match.

### Registry domains

Mechanics domains are cards, relics, potions, enemies, variants, statuses,
events, omens, boons, arts, aspects, deeds, and **themes**. English `whispers`
remain an ordered locale domain and join during full-context assembly; they are
never accepted from a mechanics pack. Per domain the registry enforces:

- **Schema:** required fields + types per domain; cross-reference checks
  (a card's `vfx` must be a known archetype; a theme's `music` entries must
  be registered cue ids; a variant's `base` must be a registered enemy).
  Unknown extension keys warn, never fail unless the key is a known
  `source:'locale'` display field misplaced in mechanics.
- **Id uniqueness** across all packs (collision = throw at boot).
- **Merge semantics are per-table, declared in the spec of the domain:**
  entity tables (cards, enemies, …) are keyed-unique (collision = error);
  aggregate tables (`PROGRESSION.poolWaves`, `REVEALS`, encounter lists,
  pool membership) each declare append / keyed-replace / error in the P2
  plan — no aggregate merges by accident.
- Registries **freeze after boot**. Core-pack or locale edits deliberately use Vite's
  full-page reload in this round; there is no object-identity or live-run-state
  preservation promise and no registry-specific HMR rebuild path. Geometry
  editors keep their existing explicit `uic.js` / `battlefield.js` listeners.
- **Content doctor:** validation failures are aggregated into one report —
  every failure with entry id, field, expected shape, and a fix hint —
  surfaced identically in `npm test` output and in the dev overlay. (This
  report *is* most of the registry's authoring value; boot-throw stays for
  production builds.)

### Theme registry (the star)

One theme entry gathers everything that today defines "an act" across five
files:

```js
{ id: 'act1',
  plates: { backdrop, mid, ledge },      // per-boss override slot: bossPlates
  weather: { kinds, density, palette, velocity },
  lanternLights: [ … ],                  // ambient light-position table
  palette: { tint, glow, haze },         // references design tokens
  music: { map, combat, boss, victory }, // cue ids
  roster: { normal, elite, boss },       // engine-side
  encounters, mapHaze }
```

Engine reads `roster`/`encounters` (pure data); UI/vfx/music read the rest.
The matching English overlay owns theme `name`, `tagline` and boss display
copy; those fields are invalid in mechanics. The i18n help composer replaces
its hard-coded “3 acts” with `{count}` from the registered theme count.
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
- **Save compatibility:** ids and the complete post-PR7 predecessor save
  shape stay unchanged; `loadRun` validation reads the merged registries;
  **no new save fields** — unknown-id rejection already yields the right
  failure for a save whose pack is absent.
- **`_sample` fixture pair:** a mechanics pack plus `_sample/locale-en.js` and
  `_sample/registration.js`, generated into development only at reserved high
  fixture order `9000`, selected by a generic Lab fixture id and absent byte-
  for-byte from production output. Real production content orders remain below
  that sentinel.
- **Act 4/data-drop boundary:** a future content-only Act 4 adds only its
  mechanics modules, English locale fragment and paired production/development
  registration, then reruns the deterministic compiler. A Node-pure temporary
  production/development-manifest test begins with real core+sample, adds and
  removes such a synthetic order-`3` fourth-theme drop, and proves production
  finality, deterministic sample selection and joined locale fields without changing hand-written
  `content.js`, central i18n indexes, engine or an act switch. No playable Act 4
  is added now. New mechanics still require engine work, but registration
  itself touches no central switch.
- **Localisation boundary:** the card-face texture cache key uses the real
  `getLocale()` token and invalidates baked text when it changes; no fictional
  constant is introduced. Round 5 preserves/completes English coverage only.
  Full-page reload is the supported response to pack or locale source edits.

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
  owns the required engine touch explicitly. `opts.ephemeral` is a transient
  engine marker and never enters the save shape; engine save/stat writes and
  the same single `run-effects` boundary return caller-compatible no-op success
  for **all** run/meta persistence effects: terminal/Vigil/stats receipts,
  Dawn staging/cursor/final clear, Hollow/Shard recovery and bequest write/
  consume as well as ordinary run saves. It never opens a second terminal
  route, and the normal post-Phase-2 transaction order remains unchanged.
  God-mode panel (energy / embers / HP / add card) and
  **replay last beat** (render the immutable presentation fixture referenced by
  the last replayable Semantic UI Behaviour Trace span; never re-run its engine
  command or mutate run state) included. A
  compact live transcript panel can show/copy the structured
  and timestamped-text projections without becoming a second trace store. The
  Lab is the acceptance harness for the P4/P5 migration.
- **Content doctor:** primary surface is the aggregated report in `npm test`
  output (§2); `?dashboard=1` is a thin dev view over the same pure API —
  per-domain tables with badges (locale / art / vfx / char-meta / audio / pool
  membership) linking into gallery preview and Lab launch.
- **Content Manager (`?contentedit=1`)** *(droppable)*: schema-driven CRUD
  joined mechanics/locale forms for **cards, relics, potions, and themes only** — enemies are
  excluded in v1 (their `ai` is code; at most rendered as read-only source).
  Save → `POST /__content-save` (dev-only Vite plugin, same-origin gate) →
  writes a staged multi-source transaction with stable-ordered,
  pretty-printed serialisers, validating the complete joined candidate *before*
  atomically replacing either source and rolling both back on failure. A
  description edit changes locale bytes only; a mechanics edit changes pack
  bytes only. `npm test`
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
  gold, deck, menu, omen chip). Map nodes remain DOM-on-3D and are not P4
  Pixi widgets.
- **Input:** the stage-level router from the invariants section is built
  here (`src/ui/pointer.js`), with the real-pointer router e2e as its proof.
  The task first inventories every existing combat pointer/touch/click listener
  and removes or reroutes it at cut-over; layering the router over surviving
  competing listeners fails review. Shake mirroring lands with the first
  migrated widget.
- **Geometry:** consumed from `ui-chrome-layout.js` via `uic.js` — the
  hand-tuned values are inherited, not re-derived. bfuiedit keeps editing
  them; the Pixi renderer subscribes to the existing `onUICChange()` hook.
  `combat-gl.js` and Probe `readUI()` reproduce PR #17's under-own-foe,
  minimal-displacement/dead-member-stability, static resting-hand floor,
  own-art overlap, drift and fixed candle-frame contracts exactly. The
  migration tests compare DOM and Pixi readings before removing either source.
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
  renderer recovery at parity or better; Playwright produces a valid
  host-relative portrait/LITE measurement and records target warnings without
  turning a valid miss into a merge failure. This checkpoint makes no physical
  touch-feel or device-performance claim. A functional compatibility failure
  stops the migration: ship the declared-
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
  previews. Hover must not alter the inherited static resting-hand chrome
  floor: every foe plate top and bottom remains within `1` stage px.
- **Keyboard path:** cycle hand / play / end turn, wired through the same
  handlers the probe drivers use (the a11y invariant's deliverable).
- **Floaters:** the 4-tier damage hierarchy as Pixi BitmapText with archetype
  tints and the existing stagger rules; turn banner, boss intro plate, and
  the guard-shattered beat become sprite/text sequences on `src/ui/tween.js`.
- **Phase 2 presentation owners:** `bossIntro`, `variantDialogue`,
  `questReveal`, `questProgress`, `questComplete`, `questUnlock`,
  `monumentGift` and `hollowTithe` receive explicit Full/LITE/REDUCED
  sprite/text contracts and trace/replay terminal proof. No queue event is
  dropped merely because it arrived after the original FE matrix was drafted.
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
  imports FE's screen stylesheet. Removing DOM chrome is gated on Pixi/Probe
  proof of the entire PR #17 geometry contract, including candle-frame widths
  `120` for `pad-landscape`/`desktop-landscape`, `102` for `pad-portrait`, `84`
  for `phone-portrait`, and `72` for `phone-landscape`, plus the desktop pair x
  positions; visual similarity alone cannot close it.

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
ceremony's motion table, LITE/REDUCED outcomes, the 70 base P6 compositions,
and the merged Phase 2 substate matrix. PE freezes
the selector/state/asset-id manifest before FE authors
`src/styles/round5-screens.css`; FE may style only that manifest. PE translates
the approved contract into Pixi/JavaScript values and imports the stylesheet.

For every screen below, the plan must additionally specify: (a) the
**austere fresh-profile state** at the same design bar (what fills the space
before aspects/vows/rose-window exist, what teases growth); (b) every
ceremony beat **mechanically** (element, property, duration, easing token,
trigger, `REDUCED` end-state) — the pile-chrome spec is the precedent; (c) a
**audio-continuity pass** aligning each ceremony beat with the already-live
PR #16 cue/call site, an existing tested fallback, or deliberate silence. FE
does not mark or wire catalogue rows; PE preserves the Node-pure resolver,
gameplay call sites and audio/trace tests. No new audio assets, cue ids or
inference from forced gallery preview are authorised;
(d) the LITE/REDUCED end-state, one line each.

The Phase 2 substate matrix is additional to, not a replacement for, the 70
shape/screen rows. It covers Rose absent/loading/inert/ready, atomic raster or
complete labelled fallback, all four Quest pane states, pane selection,
whispers and six-Shard completion; Hollow unpaid/pay/save-failed/retry/paid/
continue/return/recovery; Pale/Witchlight and Eighth-floor map markers plus the
sealed-door hidden/visible/open overlay; the ten Dawn panel kinds and both
cursor/final-clear retry states; Usurper shop states; and the unpaid Shade
bequest at Fall. These are presentation states only: PE retains all reveal,
persistence and interaction logic. The sealed door remains a non-path promise;
this round adds no playable Act 4 screen or route.

### Title + Embark

- Title: the key art re-cut into the three P7A `round5-*` parallax layers
  (imagegen fills the gaps — **owner checkpoint**, routed through
  `docs/generated-art-workflow.md`),
  ember drift, a once-per-session wordmark ignition sequence, button column
  restyled in the widget-kit language; the Vigil pulse and rose-window
  medallion (Progressive Delivery Phase 2 surfaces) get their finished
  treatment. The PR #18 bottom-right version label stays visible in all five
  canonical shapes, inside safe areas and outside the button/stats geometry.
  Five logo taps inside two seconds still reveal the `aria-live` debug row for
  three seconds or until the next completed five-tap gesture; neither surface
  enters `data-a` routing or emits SFX. Trace records only stable show/hide,
  locale/control and release-state facts, never semver/SHA display copy.
- Embark: aspect picker as full-art panels (hero art + kit summary) with a
  selection ceremony; vow stepper as a lantern dial with the cumulative
  ledger; Begin plays a lantern-lighting transition into the map. Reveal
  logic from Progressive Delivery Phase 1 is untouched — presentation only.

### Fall / Dawn (ceremony tier)

- Fall (display title `FALLEN`, compatibility cue id `defeat`):
  monument-carving ceremony — the plate rises, chisel-strike beats
  with ember spray, bequest choice framed as a ritual, the whisper line, and
  stats engraved via `tweenNum`.
- Dawn (display title `ASCENDED`, compatibility cue id `victory`): light bloom,
  ascended-plate parallax, the
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
- PR #16 already wires all 22 Music Cues. `hollowLamplighter`, `roseWindow` and
  `sealedDoor` therefore remain PE-owned predecessor behaviour with real call
  sites; Round 5 adds gameplay/trace coverage before extraction. FE may specify
  only how the surrounding visual ceremony reads while those cues play. Forced
  `?audio=1` preview never replaces runtime evidence, and the sealed-door cue
  never turns the non-path promise into an Act 4 route.

### Map (kept light — R3 already upgraded it)

- Node entrance stagger (floors light up on map entry), path-ignite ceremony
  on route choice, camera settle polish, Pale/Witchlight and Eighth-floor
  markers, and the sealed-door overlay states. Drag-suppressed taps remain
  non-selections. The DOM-on-3D projection architecture is untouched.

### Owner taste gate

Per screen, PE generates a fixed-format **contact sheet** (all stage shapes ×
key states, austere and grown profiles, plus every named Phase 2 substate), FE records its mechanical/visual
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

GitHub Actions: stable required aggregators `unit` and `e2e`; Draft PRs run
parallel unit/build plus Chromium smoke, while Ready PRs and `main` run the
complete parallel disk, three-shard random-agent, ten-shard main,
serial-heavy and per-project visual topology. `npm run test:ci` protects that
contract, and docs/tooling-only changes receive successful no-op aggregators.
`perf.spec` runs as a nightly/manual job — CI runner numbers are recorded,
target misses warn, and missing/invalid metrics fail. Failure screenshots/diffs
upload as artifacts. This landed with Phase 2's fast-feedback follow-up; later
phases extend the tested lane/result map rather than rebuilding or weakening it.

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
The canonical spike URL is exactly
`/?pixispike=1&tier=full&input=touch`; `shape=` is forbidden. `input=touch`
declares the Simulator automation input profile only: the actual viewport must
still select the natural phone/pad portrait/landscape canonical shape. Every
cell records `inputProfile:'touch'`,
`nativePointerCoarse:<boolean>` from the native
`matchMedia('(pointer: coarse)').matches` result, and `shapeOverride:null`.
The installed primary `safaridriver` contract is literal: requested
`safari:deviceType` is only `iPhone` or `iPad`, the exact managed Simulator
name is `safari:deviceName`, and its resolved UDID is
`safari:deviceUDID`. Evidence records all three separately. Before any manual
workflow dispatch, PE combines every paginated repository-runner response and
requires exactly one online runner carrying `self-hosted`, `macOS` and
`spirebound-simulator`; zero records `AWAITING OWNER-PROVISIONED RUNNER`
without dispatch, while more than one is an ambiguous-runner failure.

The runtime is an environment prerequisite, not a product result. The
2026-07-11 live toolchain exposes iOS 26.5 build `23F73`; if that exact
Simulator runtime is absent, PE records
`SETUP BLOCKED`, installs that exact runtime through the supported visible
Xcode/`xcodebuild -downloadPlatform` path without requesting credentials, and
reruns preflight. Only a cell that actually boots and exercises the spike may
produce a decisive `passed|failed` row; an absent runtime is never misreported
as a Pixi failure. No physical device is required.

The runner never wakes the host or a display, unlocks a GUI or requests
credentials. It fails setup before any managed-device mutation unless the Mac
is already awake, unlocked and logged into a usable GUI session. Only after
that preflight passes may an owned `caffeinate -d -i -w <runner-pid>` child
prevent new sleep; the runner terminates that child itself.

The artifact records Xcode, runtime/build, Safari, model/UDID, orientation, and
host architecture. Written pass/fail criteria gate boot/API support,
stage/safe-area selection, font and texture readiness/fallback, automated
pointer and pointer-cancel semantics, motion coherence, all-context maximum
three plus exact named owners/no steady unowned context, and deliberately
induced **Pixi context** loss → rebuild → ready. The disposable proof includes
the deliberately observed-and-lost Pixi support-test context; counting only
canvas ids is invalid evidence.
Scene3d/mesh context restoration remains out of scope. Playwright
records host-relative performance separately, but neither lane claims physical
device FPS, GPU/texture-memory headroom, input latency/feel, thermal behaviour,
or real background eviction; those are explicitly deferred to the future
Capacitor/hardware round. More Simulator model names do not add hardware proof
because they still use the host Mac's CPU, memory, and GPU.

A formal product decision requires all eight cells to be decisive
`passed|failed` and every corresponding JSON/screenshot pair to be durably
archived through a failure-atomic transaction: a failed publication leaves the
complete prior durable archive unchanged and no partial replacement or owned
staging/backup residue. Eight passes produce GO and P1 proceeds; one or more
exercised functional failures produce NO-GO and reopen the canvas decision
before any sunk cost (the registries, behaviour trace, and tooling phases remain
valuable regardless). A setup-blocked row, incomplete matrix or missing
artifact remains `SETUP BLOCKED`/inconclusive and must not be published as
either GO or NO-GO.
This gate remains functional-compatibility-only: it requires no physical device
and makes none of the deferred physical-device claims above.

### Registry & tooling gates (P2–P3)

- **Golden equivalence, three legs** (see invariants): 32-export stable
  hydrated observable projection deep-equal (RegExp encoded and the one getter→derived-
  number transition explicitly asserted), seeded `ai` trace
  equivalence, monte-carlo digest.
- Raw mechanics ownership and English catalogue digest/provenance stay pinned;
  exactly seven i18n APIs, 18 domains, joined locale completeness and
  source-owned fields are checked. The sample mechanics/locale pair proves a
  fourth theme without English display fields leaking into its pack.
- Registry unit tests in `test_engine.js` (Node-pure): schema validation,
  id-collision throw, cross-reference checks, per-table merge semantics,
  content-doctor joined locale report shape, `_sample` fixture pair registering without
  polluting core pools.
- Registration compiler `--check`: deterministic production/development
  manifests, unique registration/pack ids, required English overlays,
  production exclusion of `_sample`, and one temporary production fourth-theme
  drop/import/remove cycle starting from the real core+sample manifests, with
  deterministic development sample selection, both manifest hashes restored
  after removal and no protected central-file hash change.
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

1. `npm run test:ci` and `npm test` green. P2 closure and the Full-Round gate
   also run `npm run test:progression` and preserve the guided/unguided pacing
   contract.
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
6. **P4 onward:** performance measurement remains unchanged in targets
   (portrait/LITE, CPU 4×, avg ≥ 55fps, p95 ≤ 22ms) and runs **with the Pixi
   scene active**. Missing/invalid metrics or a crashed journey fail; a valid
   target miss records `PERF_WARNING` and reference evidence without failing
   the merge. The nightly `perf.yml` also records a **desktop full-tier** run
   (foil on, high DPR) so the shiny path has a watched number; plus a
   Pixi-context-loss smoke (simulated loss → restore) and a heap/texture-leak check across the long
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
    fresh spec-compliance reviewer records a verdict, the implementer fixes and
    obtains re-review, then a separate fresh code-quality reviewer records a
    verdict and the implementer fixes and obtains re-review.

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
| P6 | Screens: title/Embark, Fall/Dawn, non-combat, map | FE contract/dedicated CSS; PE JavaScript/integration; owner taste gate | Per-screen and Phase 2-substate deliverables; owner contact-sheet sign-offs |
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
| Pixi's support probe briefly creates an unowned fourth context | Observe every `getContext`, prewarm while only two named owners exist, explicitly lose `getTestContext()`, and gate the all-context live maximum separately from named ownership |
| Required Simulator runtime is absent | Treat as environment setup, install the pinned runtime through supported Xcode tooling without credentials, and rerun preflight; never call absence a Pixi NO-GO |
| Simulator success is misreported as device performance proof | Record the exact runtime/host, label the gate functional compatibility, forbid Simulator FPS, memory, touch-feel, thermal, and background-eviction claims, and defer those claims explicitly |
| Behaviour trace becomes a second game truth or a noisy logger | Observe only semantic owners; structured versioned records are canonical; no engine imports, DOM inference, frame/pointer-move spam, or console-first transport |
| Trace snapshots become timing-flaky | `seq` and explicit causality define contract order; normal projections strip timestamps; only named budget tests assert elapsed time with tolerances |
| Missing instrumentation makes a trace look complete when it is not | P1 event inventory covers routing bypasses, batched queue consumption, detached ceremonies, dawn queue, error and overflow; schema integrity and orphan-span tests are mandatory |
| Functions/accessors/RegExp break the P2 gates | Stable 32-export projection encodes RegExp and evaluated values; a descriptor inventory records the one legacy getter; pack schemas reject accessors and declare behaviour functions; assembly derives Hollow target from the active context; protocol constants stay outside packs |
| Recursive registry freeze breaks authored-tunable compatibility tests | The implementation plan establishes an explicit derived content-context/snapshot-validation seam before the immutable cut-over; tests never mutate frozen production content |
| `data.js` re-homing drifts behaviour | Golden-equivalence (three legs) + monte-carlo + full Playwright; P2 is its own phase, never mixed with Pixi work |
| Round 5 silently regresses PR #17 chrome grounding or candle pitch | Carry the exact x/floor/gap/overlap/drift/hover/frame contracts into P1 ownership, P4 `readUI()`, P5 hover and DOM-removal gates; preserve exactly its three changed Linux baselines and review Darwin reconciliation separately |
| PR #17's three intended Linux baseline changes trigger a broad Darwin refresh | Inspect actual/diff for only inherited chrome/candle motion, update exactly the matching three Darwin files after reviewer approval, rerun the complete visual suite, and reject any fourth baseline change |
| Registry work reclaims or duplicates PR #7 English copy | Exact `source` metadata, raw-mechanics/locale oracle legs, hydrate-before-freeze, joined doctor/Manager forms and locale-only byte tests |
| Generated registration manifest goes stale or a central pack/locale switch returns | Convention discovery, deterministic committed production/development output, `--check` in standing/CI, production `_sample` exclusion, shared Lab/doctor/Manager provenance and the temporary production data-drop hash test |
| English copy silently changes during visual work | PE owns keys/values and requires owner approval for new wording; FE owns fit/hierarchy/wrapping/placement only; copy-invariance and unresolved-key gates stand |
| App version becomes volatile or a mid-round build looks released | Keep `0.5.0` package source, ordinary build `+unknown`, DEV-only live SHA, and never invoke release scripts during Round 5 closure |
| Refactor collides with parallel content commits | Mechanics/English-catalogue freeze during P2; named owner re-homes `VARIANTS` mechanics while `WHISPERS` and all display/dialogue remain locale-owned |
| PE/FE agents collide or silently cross ownership | Separate worktrees, task-level disjoint write manifests, one lead per task, sequential shared-file hand-offs, exact commit/interface records and separate fresh spec/code-quality review cycles before integration |
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
| Docs go stale and mislead future agents | Docs-same-phase standing gate through `docs/README.md`, relevant `CONTEXT.md` files and Round 5 reports; existing `AGENTS.md` remains untouched |
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
beyond the named `opts.ephemeral` Lab hook; audio redesign or new cue ids
(Round 5 preserves PR #16's live resolver/call sites); analytics / crash telemetry (named for the
Capacitor round, not silently dropped); screen-reader support (declared
deferral — keyboard path is in scope); any second locale, live content-table
rehydration/rerender, language picker or persistence, RTL, locale-specific font
coverage, ICU or full runtime language-switch claim (preservation/completion of
the default English catalogue is in scope); daily seeds / challenge modes; cutout/skeletal
rigging; Act 4 content (the `_sample` pack is scaffolding, not content);
store-grade capture and device-framed store matrices (Capacitor round);
trailer editing; save-storage migration (stays guarded localStorage / vigil
adapter until the Capacitor round); retrofitting context-loss restore onto
scene3d/mesh (Capacitor round).

## Exit contracts

There are three distinct outcomes; the implementation record must name which
one occurred rather than blending them into one definition of “done”.

1. **Compatibility NO-GO / re-scope:** the complete P0.5 matrix has eight
   decisive, durably archived cells and at least one booted/exercised cell
   fails a written functional criterion. The spike has succeeded as a decision
   gate, but Round 5 has not shipped or completed. Production migration stops
   and this design must be revised before execution resumes. Missing
   toolchain/runtime/GUI prerequisites, a setup-blocked row, a partial matrix
   or missing artifacts are `SETUP BLOCKED`/inconclusive, not this outcome.
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
   valid portrait/LITE and desktop/Full measurements exist with the Pixi scene
   active, target warnings are recorded under the non-gating Phase 2 policy,
   the desktop full-tier number is recorded nightly, and the P5 falsifiable
   wins are all present.
4. bfuiedit still edits live chrome geometry, now rendered by Pixi; bfedit
   (combatants + stage plates, which stay DOM) is unaffected and still works.
5. **Registry proof:** the three-leg golden equivalence and raw-mechanics/
   English-catalogue oracle legs hold; the `_sample` mechanics/locale pair boots
   a **climbable** mini theme in the Lab through the compiled development
   manifest; production compiler output contains no sample import and remains
   byte-identical when `_sample` is added. Starting from the real core+sample
   manifests, a temporary paired production fourth-theme drop compiles as the
   fourth/final production theme, orders before the high-sentinel sample in
   development, and removes cleanly with both manifest hashes restored while
   hand-written assembler/i18n/engine/act-switch hashes do not
   change. The compiler `--check` and act-coupling sweep pass with enumerated
   residue; Lab, doctor and Manager share compiled provenance/field ownership;
   the content doctor reports the joined core 100% complete.
6. **Tooling proof:** the Lab stages any registered encounter (including
   variants) from a pasted URL and can replay a correlated trace beat; if the
   Content Manager shipped, it round-trips an edit through `/__content-save` with
   a clean `npm test` afterwards.
7. All four screen sets carry **owner contact-sheet sign-offs** (austere,
   grown and every named Phase 2 substate); Fall/Dawn play as specified
   ceremonies while preserving every PR #16 cue/fallback call site and its
   gameplay/trace evidence; the title has its ignition and exact PR #18 version
   behaviour; captures assert locale `en`, catalogue hashes, no unresolved key
   or `{param}`, and visible supplied copy in all shapes; combat has its keyboard
   path.
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
    has a named sequential hand-off; and each implementation unit completes the
    fresh implementer → fresh spec reviewer → fixes/re-review → fresh
    code-quality reviewer → fixes/re-review sequence before integration.
