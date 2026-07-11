# Round 5 Commercial Engine Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use Superpowers 6.1.1 `superpowers:subagent-driven-development` to implement this plan task-by-task with a fresh implementer and fresh spec/code reviewers. Do not substitute `executing-plans`. Steps use checkbox (`- [ ]`) syntax for tracking.

> **Phase 2 re-entry (2026-07-11):** Re-authored against loaded PR #14, PR #15
> and PR #16 at `7b8e01ab5ab5f7be0a3a8cbd3c61b3b41549a419`. The prior plan is
> not executable by assumption: terminal/Dawn transactions, the 32-export
> surface, parallel CI, progression gates, PR #15 audio hot-apply and PR #16's
> complete live Music Cue resolver/call sites are protected predecessor
> behaviour throughout this revision.

**Goal:** Deliver the Full-Round commercial-engine target: a registry-backed content substrate, AI-readable Semantic UI Behaviour Trace, production Pixi combat UI, deterministic authoring/QA tooling, finished DOM screens, and the provisional ship-front kit, with a supported P4/P5/P6 prefix stop at every declared gate.

**Architecture:** Production Engineering (PE) remains the primary lane and owns every product JavaScript file, state transition, renderer/input seam, authoring tool, probe, test, workflow and integration commit. A separate Front-end Experience (FE) worktree owns only the checked-in experience contract, one dedicated stylesheet, named visual assets and review reports. PE and FE run concurrently only on the disjoint write sets below; PE consumes FE outputs through named commit hand-offs after interfaces are frozen.

**Tech Stack:** Vite 8.1 + vanilla ES modules; Node 24; Three.js 0.185; PixiJS **8.19.0** pinned to WebGL; Selenium WebDriver **4.45.0** for serial Simulator Safari automation; plain `node:assert` checks in `test/test_engine.js`; Playwright 1.61.1; GitHub Actions; Apple `safaridriver` against the live iOS 26.5 (`23F73`) Simulator runtime prerequisite.

## Global Constraints

- **Loaded predecessor gate:** no Round 5 runtime/product edit starts unless the
  execution branch contains PR #14 merge `469890680239c523e708e6d05ad3a02d867f0859`,
  PR #15 merge `4dc1af79c47e8a93795355607cfca238c82f57be` and
  PR #16 merge `7b8e01ab5ab5f7be0a3a8cbd3c61b3b41549a419`.
  `src/data.js` must expose the complete 32-name post-Phase-2 contract,
  transactional Dawn/Rose/sealed-door surfaces and PR #15 hot audio-gallery
  behaviour. `src/music-resolve.js`, all 22 live catalogue rows, their PR #16
  precedence and real gameplay call sites must also be present. A later
  `origin/main` change triggers a fresh drift audit before runtime work; a
  local predecessor worktree never passes.
- Keep `src/engine.js`, `src/vigil.js`, `src/data.js`, `src/content.js`, `src/registry.js`,
  `src/content-protocol.js`, `src/choice-latch.js`,
  `src/music-resolve.js`,
  `src/packs/**`, `src/presentation-catalog.js`, `src/content-resources.js`, `src/battlefield.js`,
  `src/battlefield-layout.js`, `src/uic.js`, `src/ui-chrome-layout.js`,
  `src/ui/tokens.js`, `src/ui/shipfront-assets.js`,
  `src/ui/content.js`, `src/ui/behaviour-trace.js` and
  `src/ui/presentation-barrier.js`
  plus `src/ui/run-effects.js` Node-runnable and DOM-free.
- Preserve the load-bearing import graph: `src/engine.js` imports `src/data.js` only. `src/data.js` becomes the assembler and keeps the complete post-predecessor named-export surface.
- Keep all current internal ids and the complete `7b8e01a` save keys/shapes
  immutable, including `runId`, pending encounter/reward/Hollow/Shade state,
  `pendingRunEnd`, `pendingDawn`, Vigil receipts and bequests. Packs add no save
  field. New mechanics, a playable Act 4, runtime DLC, AI DSL, screen-reader
  mirror and Capacitor packaging are out of scope.
- P1 is a zero-visual-change refactor. Instrument the post-predecessor monolith before moving code; preserve selected DOM-era trace contracts through P4/P5.
- The trace is structured/versioned and observer-only. Order is `seq`; incremental cursor is `{ segment, seq }`; `atMs` is diagnostic; REDUCED is policy metadata; text/NDJSON are projections; no network exporter or automatic persistence.
- Presentation completion is owned by an always-on renderer-neutral barrier, never by the optional trace. Enabling or disabling trace may not change `settle()` timing or gameplay semantics.
- Every trace-enabled Playwright spec imports the automatic `test/e2e/trace-fixture.js`; failure NDJSON and timestamped text are mandatory for battle, Lab, input, presentation and P6 journeys.
- Pixi-era screenshot tolerance is pre-authorised at `0.01` for each named P4,
  P5, P6 and P7 suite. It lives in one tested policy map and may not be raised
  in response to a failed baseline; a different value requires a golden-spec
  revision before capture.
- Content Lab replay is presentation-only. On a replayable span settle, Lab writes bounded `replay=` via `history.replaceState`; reload hydrates but never auto-runs it; replay never calls engine commands or writes saves.
- Pin Pixi to WebGL (`preference: 'webgl'`), never WebGPU. New APIs must be current-iOS-WebKit safe. Total WebGL contexts stay at three: scene3d, mesh and Pixi.
- Simulator Safari proves functional compatibility only. It makes no physical-device FPS, memory, thermal, background-eviction, input-latency or touch-feel claim.
- Preserve the merged Phase 2 performance policy: missing/invalid metrics or a
  crashed journey fail; valid portrait/LITE or desktop/Full target misses emit
  `PERF_WARNING` and remain non-gating reference evidence. Do not silently turn
  55fps/22ms into a merge hard gate.
- `#uigl` has `pointer-events: none`. One stage-level router owns combat input. Preserve card 26px upward drag activation, touch-tooltip 12px cancellation, and map-pan 14px activation as separate grammars.
- `src/battlefield-layout.js` and `src/ui-chrome-layout.js` remain geometry truth; bfedit/bfuiedit edit those files and Pixi subscribes to their existing change hooks.
- From P5, one Pixi card-face composer feeds combat and DOM grids. No second card-face implementation may exist at a merge boundary.
- Every product/source/config behaviour-changing implementation task uses TDD:
  write the focused failing check, observe the expected failure, implement
  minimally, run the focused check, then every phase-applicable standing gate.
  Pure documentation, worktree, predecessor, evidence and decision-gate tasks
  use their declared preflight/characterisation/verification checks and never
  fabricate a red by breaking production source.
- Every Playwright-backed top-level command/package script runs against its own
  isolated strict-port server. Shell environment is never assumed to persist
  across tool calls or fresh subagents. Tasks 1 and 3 precede the durable
  wrapper, so each of their browser blocks allocates and exports a fresh port in
  the same fenced shell invocation as the browser command. Task 5 creates the
  import-safe `tools/run-with-strict-e2e-port.mjs`; every later executable
  browser line in this plan and CI invokes that wrapper in the same shell
  command, for example `node tools/run-with-strict-e2e-port.mjs -- npm run
  test:e2e`. Bare Playwright strings in `package.json` snippets are definitions,
  never an authorisation to execute them without the wrapper. The standing-gate
  runner imports the same allocator and injects a new port for each top-level
  browser row. Every selected port is recorded in that task's report, and the
  wrapper asserts the post-Phase2 `playwright-server.js` resolves
  `reuseExistingServer:false`. The strict bind may fail on a race, but no task
  may fall back to or reuse port 5174; rerun the wrapper so it allocates again.
  This rule includes capture tools, local baseline update/verify, perf, full
  gates and CI. A nested aggregate may run its serial child scripts on the one
  fresh isolated port assigned to that top-level aggregate invocation.

  ```bash
  node tools/run-with-strict-e2e-port.mjs -- npm run test:e2e
  ```
- PE produces gate evidence and fixes findings. A fresh QA agent reviews each task diff for both spec compliance and code quality; the implementer never self-certifies. Owner checkpoints remain owner-only.
- Use UK English in code comments, docs and player copy. Keep normal user communication in HK Cantonese.
- Rebuild tracked `dist/` only in the final Full-Round task or at an explicitly declared prefix exit. Stage exact paths; never use `git add -A`; never amend or force-push.

### Executable standing-gate matrix

Task 5 introduces the import-safe `tools/run-round5-standing-gates.mjs` and
`tools/run-with-strict-e2e-port.mjs`, plus the package entry
`test:round5:standing`. From that task onwards, every PE
task must run the profile in this table immediately before its commit step,
in addition to its focused RED/GREEN and phase-closure commands. The runner
executes argv arrays with `spawnSync` and no shell, stops on the first non-zero
exit, allocates and records a new strict `SPIREBOUND_E2E_PORT` for every
Playwright-backed command, and exports its frozen profile table for Node tests.
The task reviewer rejects a commit whose ledger row lacks the profile, command
list, port list and exit codes.

| Tasks | Profile | Exact cumulative standing commands |
|---|---|---|
| 5 | `p1-node` | `npm run test:ci`; `npm test` |
| 6–8 | `p1-dom` | all `p1-node`; `npx playwright test trace battle audio --project=desktop --workers=1`; `npm run test:e2e:trace-production` |
| 9 | `p1-complete` | all `p1-dom`; `npm run test:e2e:nonvisual` |
| 10–12 | `p2-base` | all `p1-complete`; `npm run test:progression` |
| 13–16 | `p2` | all `p2-base`; `npm run test:act-coupling` |
| 17–23 | `p3` | all `p2`; `node tools/verify-production-surface.mjs`; optional `npm run test:e2e:content-disk` when the script is defined |
| 24–28 | `p4` | all `p3`; `npm run test:e2e:webkit`; `npm run test:e2e:perf`; `node tools/check-bundle-budget.mjs` |
| 29–34 | `p5` | all `p4`; `npm run test:e2e:leak` |
| 35–39 | `p6` | all `p5`; `npx playwright test p6-screens end-ceremony contrast stage trace --project=desktop --project=portrait --project=landscape --workers=1 --no-deps` |
| 40 | `full` | all `p6`; `npm run test:e2e:visual`; `npm run test:simulator:full -- --surface production`; `npm run test:simulator:profiles -- --surface production` |

The cumulative relation is literal, expands each named command once in first-
occurrence order and is unit-tested: `p2-base` preserves the merged guided/
unguided pacing contract from the first registry task, and `p2` makes the
act-coupling sweep stand in every later P2+ task; `p3` makes the production-surface verifier stand
in every P3+ task, including Pixi, P5, P6 and ship-front source commits, and
makes the Manager disk gate stand from the first commit that defines it. A task
may repeat a command for a narrower proof, but may not replace or omit its
profile invocation. Tasks 0–4 precede the runner and retain their exact
declared preflight/gates.

Task 6 defines `test:e2e:nonvisual` exactly as
`npm run test:e2e:disk && npm run test:e2e:random-agent && npm run
test:e2e:main && npm run test:e2e:serial`. The existing `test:e2e` remains that lane followed by
`test:e2e:visual`. Per-task standing profiles intentionally use the complete
non-visual lane: Tasks 22–23, 26–28, 34–35 and 39 move pixels before their
authorised phase baseline commit, so stale visual baselines cannot be a
pre-commit gate. Visual comparison remains mandatory in P1 zero-drift tasks and
at P4/P5/P6/P7 baseline capture plus every prefix/full closure; only those
reviewed steps may update snapshots.

---


## Scope and execution model

This is one master plan because the renderer migration depends on the trace,
registries and Lab, while the screen and ship-front passes consume the same
tokens/card textures and evidence harness. Tasks remain phase-sized review units;
no task mixes FE judgement with PE mechanics. The controller may stop only at
the spec's P4, P5 or P6 prefix exits, or at a genuine hard blocker.

The only non-stopping omissions are the golden pressure valves: Task 18's dev
shell subsection and all of Task 19 Content Manager. PE records either
`SHIPPED` or `OMITTED (optional pressure valve)` in the ledger and Full-Round
report. The mandatory Task 18 content doctor/dashboard still ships; omission is
not a new prefix state and does not block Task 20.

PE and FE worktrees/branches already exist; Task 0 forbids recreating either:

```text
/Users/jamesto/Coding/roguecardv2/.worktrees/round5-production-engineering
codex/round5-production-engineering
/Users/jamesto/Coding/roguecardv2/.worktrees/round5-front-end
codex/round5-front-end
```

The dedicated FE agent has completed the reviewed Task 2 proposal, and resumes
at Tasks 31, 36 and 38 when their declared PE hand-offs exist. All PE
implementation tasks remain serial relative to other PE tasks. Before any
cross-lane integration, record both branch heads and use a normal merge; do not
copy uncommitted files between worktrees.

After Task 2, FE may also prepare Task 38 scratch candidates, prompt ledgers,
the stage-bible draft and provisional store draft in parallel with PE. No
candidate may move to a final asset path, and no promotion commit may exist,
before the Task 37 owner gate and the per-file P7 approval in Task 38.

## File ownership map

| Owner | Exact write set |
|---|---|
| PE | All `src/**/*.js`; `src/styles.css`; `src/main.js`; `index.html`; `package*.json`; `vite.config.js`; Playwright configs; `test/**`; `.github/**`; `tools/**`; `public/**`; `dist/**`; PE docs/reports |
| FE | `docs/superpowers/specs/2026-07-10-round5-fe-experience-contract.md`; `src/styles/round5-screens.css`; `docs/stage-art-bible.md`; `docs/superpowers/reports/2026-07-10-round5-fe-contact-sheet-review.md`; `docs/superpowers/reports/2026-07-10-round5-store-fe-draft.md`; `scratch/style-tests/round5/**`; the exact approved P7 asset paths from the golden spec |
| QA | Review reports/ledger only; no product or test-harness writes |

## Target module map

| File | Single responsibility | Introduced |
|---|---|---|
| `src/ui/behaviour-trace.js` | Node-pure bounded trace, span lifecycle, composite cursors and projections | P1 |
| `src/ui/presentation-barrier.js` | Always-on renderer-neutral presentation ownership and settle barrier | P1 |
| `src/ui/run-effects.js` | Sole transactional terminal/Hollow/Shard/bequest boundary; preserves the normal Phase 2 flow in P1 and adds Lab suppression in P3 | P1/P3 |
| `src/ui/context.js` | Browser UI singleton state, environment flags and DOM helpers | P1 |
| `src/ui/policy.js` | One motion/input/render-tier policy snapshot, including `REDUCED` | P1 |
| `src/ui/format.js` | Shared pure display formatters such as `ROMAN` | P1 |
| `src/ui/rose.js` | Shared Rose Window asset/fallback state used by title, Vigil and Probe | P1 |
| `src/ui/commands.js` | Bound command façade preventing screen→orchestrator imports | P1 |
| `src/ui/assets.js` | Raster/fallback resolution and warm-up helpers | P1 |
| `src/ui/tooltip.js` | Tooltip vocabulary, formatted card/status text and DOM card face until P5 | P1 |
| `src/ui/overlay.js` | Menus, settings, potions, persistence dialogs, help and card grids | P1 |
| `src/ui/navigation.js` | `show()`, transition/wipe lifecycle and route dispatch | P1 |
| `src/ui/screens/*.js` | One leaf renderer per screen set; no engine state ownership | P1 |
| `src/ui/combat.js` | Combat DOM/Pixi assembly, synchronisation and semantic commands | P1/P4/P5 |
| `src/ui/drain.js` | Queue batching and event→presentation playback | P1 |
| `src/ui/probe.js` | `window.__probe` readers/drivers; no test-only game logic | P1/P4 |
| `src/ui/index.js` | Imports/wires modules, binds commands, installs globals/HMR and boots UI | P1 |
| `src/ui.js` | Thin public re-export of `initUI` and `show` | P1 |
| `src/music-resolve.js` | Existing Node-pure PR #16 cue resolution: quest/Eighth/theme precedence, screen overrides and Dawn ceremony cues | P1/P2 |
| `src/content-protocol.js` | Four immutable protocol exports: quest states, active states, terminal outcomes and run-id RegExp | P2 |
| `src/registry.js` | Node-pure schemas, pack definition, deterministic content-context merge/freeze and doctor | P2 |
| `src/content-resources.js` | Node-pure static VFX/character/fallback/audio/token catalogues; no filesystem or Vite asset glob | P2 |
| `src/content.js` | Private production full-context assembler; exports `CORE_CONTENT` without widening `data.js` | P2 |
| `src/packs/core/*.js` | Existing content re-homed without id/value drift | P2 |
| `src/packs/_sample/*.js` | Dev/test-only card, enemy and fourth mini theme | P2 |
| `src/ui/tokens.js` | Node-pure motion/palette/type values consumed by CSS and Pixi | P2 |
| `src/ui/content.js` | Node-pure full presentation-context resolver; core default plus explicit ephemeral binding | P2/P3 |
| `src/presentation-catalog.js` | Node-pure VFX, character-kind and structural-fallback id inventory | P2 |
| `src/dev/lab-scenario.js` | Pure URL scenario/replay codec | P3 |
| `src/ui/dev/*.js` | Lab, doctor dashboard, optional Content Manager and dev launcher | P3 |
| `src/dev/content-serialize.js` | Stable schema-driven pack serialiser | P3 |
| `src/ui/pixi-app.js` | One Pixi Application, resize/DPR/tier and context recovery | P4 |
| `src/ui/fonts.js` | Blocking self-hosted Round 5 font readiness before Pixi/card texture bake | P4 |
| `src/ui/widgets.js` | Nine-slice, meter, counter, button and state-switch primitives | P4 |
| `src/ui/combat-gl.js` | Pixi combat scene/chrome and `readUI()`/`hitTest()` | P4/P5 |
| `src/ui/pointer.js` | Sole stage-level combat pointer router | P4 |
| `src/ui/tween.js` | Ticker tweens on shared tokens; named REDUCED end states | P4 |
| `src/ui/cardface.js` | Single card composer, texture cache/export and static allocation accounting | P5 |
| `test/simulator/*.mjs` | Serial `safaridriver` runner and normalised semantic assertions | P0.5+ |
| `tools/check-act-coupling.mjs` | Static act-literal/index/clamp sweep with enumerated allowlist | P2 |

## P1 state-ownership map

The P1 implementer must move every post-predecessor module-scope binding once.
These are semantic owners, not suggestions:

| Destination | Owned bindings/functions |
|---|---|
| `context.js` | `S`, `FORCE_INPUT`, `COARSE`, `FINE`, `$`, `$$`, `sleep`, `screenEl`, `terminalNavigationLocked`, `el`, `escHtml`, `trace`, `presentationBarrier` |
| `policy.js` | `REDUCED`, the former identical `CHOREO_REDUCED` read, motion/tier helpers |
| `format.js` | `ROMAN` and other cross-screen pure formatting constants |
| `rose.js` | `forceRoseFallback`, `roseAssets`, Rose asset readiness/fallback helpers |
| `assets.js` | `rasterOr`, `sceneBg`, `metaBg`, `relicArt`, `hudRelic`, `omenIconName`, `omenMark`, `aimRing`, `heroArt`, `combatantView`, `assetsWarmed`, `warmAssets` |
| `tooltip.js` | `FACET_DESC`, `KEYWORDS`, `initTooltip`, `fmtText`, the P1 DOM `cardEl` |
| `overlay.js` | `closeMenus*`, settings/reset/abandon, potion flow, `persistenceDialogTransaction`, persistence-dialog rendering/retry UI, card grid and help; retains `createChoiceLatch` one-shot guards |
| `run-effects.js` | the dependency-injected Phase 2 transaction adapter for terminal journal/finalise/acknowledge, Dawn stage/cursor/final clear, Hollow/Shard recovery and bequest writes/clears; owns no DOM |
| `navigation.js` | `wipe`, `transitionSeq`, `transition` and `show`; dispatches the route map injected by `index.js` and preserves PR #16 central screen-cue resolution, including Eighth Omen map/event and initial Rose/Hollow routing |
| `screens/title.js` | title-only state/helpers and `renderTitle`; consumes `rose.js` |
| `screens/embark.js` | `renderEmbark` |
| `screens/vigil.js` | Vigil/whisper helpers and `renderVigil`; consumes `rose.js`/`format.js`; Rose/deeds tab switches retain `roseWindow`/`vigil` cue ownership |
| `screens/run.js` | pending-route recovery, `startRun`, `routeStartedRun` |
| `screens/lamplighter.js` | Lamplighter and Hollow route render/exit helpers |
| `screens/map.js` | `NODE_ICONS`, map render, node bounty/routing, monument/echo flows; sealed-door open owns `sealedDoor` and close restores map/Eighth cue |
| `screens/reward.js` | reward, boss-relic and act-advance flows |
| `screens/rest.js` | rest and treasure renderers |
| `screens/shop.js` | shop renderer and stock interactions |
| `screens/event.js` | event renderer |
| `screens/end.js` | Fall/Dawn panel presentation, unlock queue and cursor/final-clear acknowledgement; delegates every mutation to `run-effects.js` and every retry modal to `overlay.js`; preserves `pageRead`/`act4Reveal` Dawn cue dispatch |
| `screens/gallery.js` | gallery state/lightbox and gallery renderer |
| `screens/audio-gallery.js` | complete PR #15 audio-gallery transaction: draft preview, metadata save, same-page apply, cache invalidation and active-cue re-resolution; never pins the mutable committed selection to one pack/version |
| `combat.js` | combat assembly/layout/sync, pile/hand state, drag/targeting, card play/end turn, rig/mesh/choreography/floaters and `afterAction`; passes pending quest and current omen to the pure PR #16 cue resolver |
| `drain.js` | `drain`, draw-wave/reshuffle batching, `handleEvent`, victory/defeat queue transitions |
| `probe.js` | `installProbe`, trace/state/geometry/UI readers, invariants and real-handler drivers |
| `index.js` | `initUI`, the sole ordered screen route map, command binding, `window.spirebound`, keyboard/global listeners, HMR hooks and boot routing |

Module imports point downward only. Leaf screens receive navigation/combat
operations through `commands.js`; they never import `index.js` or
`navigation.js`. `index.js` is the only module allowed to install
`window.spirebound` and `window.__probe`.

## Complete post-predecessor `src/data.js` export inventory

P2 preserves these **32** names exactly. The first 28 are pack-owned,
registry-owned or assembler-derived content views; the final four are immutable
protocol exports and never pack merge targets:

```text
PLAYER, ACTS, CARDS, CARD_POOLS, STATUS_INFO, RELICS, RELIC_POOLS, POTIONS,
ENEMIES, ENCOUNTERS, EVENTS, REWARD_GOLD, SHOP, OMENS, AFFIXES, ARTS, DEEDS,
PROGRESSION, REVEALS, POOL_GATE, QUEST_IDS, WHISPERS, QUESTS, SHADE_KITS,
VARIANTS, ASPECTS, VOWS, BOONS,
QUEST_STATES, QUEST_ACTIVE_STATES, TERMINAL_OUTCOMES, RUN_ID_RE
```

`src/content-protocol.js` owns the final four values. `src/data.js` re-exports
them so `engine.js` and `vigil.js` retain their sole `./data.js` import.
`RUN_ID_RE` equivalence is its exact `source` and `flags`; the Quest state and
terminal arrays preserve order and values.

## Task dependency graph

```text
Task 0 PE/FE worktrees + ledger ─┬─ Task 2 FE contract (allowed preparation)
                                  └─ Task 1 predecessor gate
                                       → Task 3 disposable P0.5 spike branch
                                       → Task 4 reusable Safari matrix + GO
                                       → Tasks 5–9 P1 trace + decomposition
                                       → Tasks 10–15 P2 registries/packs/themes/sample
                                       → Tasks 16–20 P3 Lab/doctor/Manager/CI
                                       → Tasks 21–24 P4 Pixi chrome/router
                                       → Task 25 P4 gate
                                       → Tasks 26–29 P5 card/hand/ceremony/perf
                                       → Task 30 P5 gate
                                       → Task 31 FE CSS ∥ Tasks 32–34 PE screens
                                       → Task 35 integration/capture
                                       → Task 36 FE critique → Task 37 PE closure with owner P6 gate
                                       → Task 38 FE P7 assets → Task 39 PE ship-front
                                       → Task 40 Full-Round gate/PR
```

## Supported prefix exit closure

This protocol applies only after a green P4, P5 or P6 gate explicitly selects
its supported prefix. It never applies to a P0.5 NO-GO or a partially completed
phase.

1. Before locking the prefix source SHA, run `git fetch origin --prune` and
   record it as `Base SHA: <hash>` in the gate report. Require
   `git merge-base --is-ancestor origin/main HEAD`. If it fails, merge current
   `origin/main` normally (the already-pushed Round 5 branch is never rebased or
   force-pushed), resolve with TDD, rerun the predecessor check and standing
   profile, then treat the merge as a source change: push the new SHA and
   regenerate both-platform baselines plus FE/QA review before continuing.
2. PE updates the gate report, `CONTEXT.md`, `docs/README.md` and `AGENTS.md`
   with the exact last completed phase, allowed claims, deferred tail and
   rollback commit. The report must say that Full-Round is not complete.
3. A fresh broad reviewer receives one package containing the complete
   committed `origin/main..HEAD` prefix diff **and** the exact unstaged Step 2
   gate-report/status-doc diff plus `git status --short`. PE fixes every
   Critical/Important finding and obtains re-approval of both source and exit
   claims. If a
   finding changes source, tests, config, workflow or baselines, commit/push a
   new source SHA and return to the latest phase's baseline procedure (P4 Task
   24 Steps 5–7, P5 Task 29 Steps 5–7, or P6 Task 37 Step 3): regenerate Darwin
   and Linux from that SHA, repeat FE/QA visual review, commit the baselines,
   rerun the complete phase gate, then repeat broad review. A report/status-doc-
   only fix refreshes this package. Old baseline provenance may never cross a
   reviewer source fix.
4. PE runs the phase-applicable gate again, then runs the normal
   `npm run build` exactly once. This is the declared exception to the final-task
   `dist/` rule. Verify only expected generated `dist/**` paths changed.
5. Stage only the exact generated/report/status paths listed by the selected
   gate task. Run `git diff --cached --check`, `git diff --cached --name-only`,
   `git ls-files -s` for every staged path and `git write-tree`. Persist the
   candidate tree as `Prefix candidate tree: <hash>` in the ignored ledger. A
   fresh closure reviewer receives the
   complete cached diff, modes/blob ids, staged report/artifact hashes, status
   and tree hash, and must approve that exact closure. A source/test/config/
   workflow/baseline finding returns to step 3 and the matching phase's dual-baseline
   loop; a generated-`dist` finding reruns steps 4–5; a report/status-only
   finding is restaged and the closure reviewer repeats.
6. Reload the last `Prefix candidate tree` hash from the ledger, require current
   `git write-tree` equality, then commit with the matching fixed message:
   - P4: `build: ship the Round 5 P4 commercial-engine prefix`
   - P5: `build: ship the Round 5 P5 combat prefix`
   - P6: `build: ship the Round 5 P6 presentation prefix`
   The contiguous build/add/commit examples in Tasks 25, 30 and 37 pause after
   their `git add` lines to execute steps 5–6; they do not bypass closure review.
7. Push `codex/round5-production-engineering`, open a PR whose title names that
   prefix, attach the gate report as its body, and watch every required check.
   Immediately before PR creation, fetch again and require both ancestry and
   the report's recorded base SHA still equal fetched `origin/main`; drift
   returns to step 1 and invalidates the locked source/baselines.
   Never merge a red PR; do not execute any deferred task after opening the
   prefix PR.

Each gate task below supplies its exact report path, commit message and PR
title; no executor invents them.

---

### Task 0: `[PE]` Historical bootstrap — completed; do not replay

**Existing state:**
- Git-ignored ledger: `.superpowers/sdd/progress.md`
- PE worktree/branch: `.worktrees/round5-production-engineering` /
  `codex/round5-production-engineering`
- FE worktree/branch: `.worktrees/round5-front-end` /
  `codex/round5-front-end`
- The original plan/bootstrap commit has already been rebased onto Phase 2;
  FE owns two contract commits. Re-running `git worktree add -b`, recreating the
  ledger or assuming equal PE/FE heads is forbidden.

**Interfaces:**
- Produces: immutable historical bootstrap evidence only.
- Runtime execution resumes at Task 3 after the read-only Task 1 checkpoint and
  the amended spec/plan/FE heads are recorded.

- [x] **Step 1: Verify the existing topology read-only**

```bash
git worktree list --porcelain
git rev-parse --verify codex/round5-production-engineering
git rev-parse --verify codex/round5-front-end
test -f .superpowers/sdd/progress.md
```

Expected: each branch occurs in exactly one worktree and the ledger retains the
Phase-2/PR16 re-entry rows. Do not edit, truncate or recreate it.

- [x] **Step 2: Preserve the FE-owned history**

The FE branch contains the original contract, its Phase-2 amendment and its
PR #16 live-music amendment. The controller rebases that owned range once onto
the final amended PE-plan head, records the resulting heads with `apply_patch`,
then treats both Task 0 and Task 1 mutation steps as closed. A future executor
may run only ancestry, status and diff/write-set checks; it may never reuse a
historical `PE pre-rebase`/`PE post-rebase` pair as a new `rebase --onto`
instruction.

### Task 1: `[PE]` Loaded Phase 2 + live-music predecessor re-entry — completed checkpoint

**Files:**
- Read only: `src/data.js`, `src/ui.js`, `src/engine.js`, `src/vigil.js`,
  `src/audio-assets.js`, `src/audio.js`, `src/audio-catalog.js`,
  `src/music-resolve.js`, `src/music.js`, `src/dev/audio-selection-serialize.js`,
  `public/audio-selection.json`, `package.json`,
  `test/test_module_boundaries.mjs`, `CONTEXT-MAP.md`,
  `docs/domain/climb/CONTEXT.md`, `docs/domain/vigil/CONTEXT.md`,
  `docs/README.md`
- No commit; this is a hard execution gate

**Interfaces:**
- Produces: the already-recorded clean PR #14 + PR #15 + PR #16 ancestry and
  semantic baseline consumed by every runtime task.
- Status: reopened and closed after the second 2026-07-11 rebase/audit onto
  `7b8e01a`. Do not replay its historical branch mutation; a future `main`
  change opens a new drift-audit task.

- [x] **Step 1: Verify the recorded ancestry without replaying the rebase**

The ledger already records the historical PE/FE pre/post-rebase hashes. They
are evidence, not arguments for another `rebase --onto`. The completed
checkpoint used these read-only provenance commands after the one authorised
rebase:

```bash
git fetch origin --prune
git fetch origin refs/pull/14/head:refs/remotes/origin/pr/14
git fetch origin refs/pull/15/head:refs/remotes/origin/pr/15
git fetch origin refs/pull/16/head:refs/remotes/origin/pr/16
for PR in 14 15 16; do
  test "$(gh pr view "$PR" --repo fol2/roguecardv2 --json state --jq .state)" = MERGED
  for CHECK in unit e2e; do
    test "$(gh pr view "$PR" --repo fol2/roguecardv2 --json statusCheckRollup \
      --jq "[.statusCheckRollup[] | select(.name==\"$CHECK\" and .conclusion==\"SUCCESS\") ] | length > 0")" = true
  done
done
test "$(git rev-parse origin/main)" = 7b8e01ab5ab5f7be0a3a8cbd3c61b3b41549a419
git merge-base --is-ancestor origin/main HEAD
```

Then it proved predecessor provenance:

```bash
test "$(gh pr view 14 --repo fol2/roguecardv2 --json baseRefOid --jq .baseRefOid)" = \
  d048640b962ccd17663e37bc0d1c8c5c692567b5
test "$(gh pr view 14 --repo fol2/roguecardv2 --json headRefOid --jq .headRefOid)" = \
  469890680239c523e708e6d05ad3a02d867f0859
test "$(gh pr view 14 --repo fol2/roguecardv2 --json mergeCommit --jq .mergeCommit.oid)" = \
  469890680239c523e708e6d05ad3a02d867f0859
test "$(gh pr view 15 --repo fol2/roguecardv2 --json baseRefOid --jq .baseRefOid)" = \
  469890680239c523e708e6d05ad3a02d867f0859
test "$(gh pr view 15 --repo fol2/roguecardv2 --json headRefOid --jq .headRefOid)" = \
  f429a419eecdd3a6a8ffb8c796689f34792a7259
test "$(gh pr view 15 --repo fol2/roguecardv2 --json mergeCommit --jq .mergeCommit.oid)" = \
  4dc1af79c47e8a93795355607cfca238c82f57be
test "$(gh pr view 16 --repo fol2/roguecardv2 --json baseRefOid --jq .baseRefOid)" = \
  4dc1af79c47e8a93795355607cfca238c82f57be
test "$(gh pr view 16 --repo fol2/roguecardv2 --json headRefOid --jq .headRefOid)" = \
  7c91f1675d5aa13694497855e3a5f068541d31b9
test "$(gh pr view 16 --repo fol2/roguecardv2 --json mergeCommit --jq .mergeCommit.oid)" = \
  7b8e01ab5ab5f7be0a3a8cbd3c61b3b41549a419
test "$(git rev-parse refs/remotes/origin/pr/14)" = \
  469890680239c523e708e6d05ad3a02d867f0859
test "$(git rev-parse refs/remotes/origin/pr/15)" = \
  f429a419eecdd3a6a8ffb8c796689f34792a7259
test "$(git rev-parse refs/remotes/origin/pr/16)" = \
  7c91f1675d5aa13694497855e3a5f068541d31b9
git merge-base --is-ancestor 469890680239c523e708e6d05ad3a02d867f0859 HEAD
git merge-base --is-ancestor f429a419eecdd3a6a8ffb8c796689f34792a7259 HEAD
git merge-base --is-ancestor 4dc1af79c47e8a93795355607cfca238c82f57be HEAD
git merge-base --is-ancestor 7c91f1675d5aa13694497855e3a5f068541d31b9 HEAD
git merge-base --is-ancestor 7b8e01ab5ab5f7be0a3a8cbd3c61b3b41549a419 HEAD
```

Expected: every command exits 0 and the branch is clean. Record the immutable
PR/head/merge hashes, green required checks and actual `origin/main`/PE heads
in the execution ledger. The old `4275781` application/test checkpoint remains
historical evidence only: PR #14 review/standards commits intentionally changed
source and tests after it and were re-proved by final required CI. Do not revive
the obsolete byte-clean assertion. The PR #16 re-entry recorded
`git diff --name-status 4dc1af7..7b8e01a` and re-proved the local baseline. If
`origin/main` contains commits after `7b8e01a`, record
`git diff --name-status 7b8e01a..origin/main`, re-enter the spec/plan drift
audit, and do not continue merely because ancestry passes.

The controller separately rebases the three reviewed FE-owned contract commits
onto the final amended plan head exactly once. It records `Phase 2 final PE
head:` and `Phase 2 final FE head:` in the ledger. Future checks are read-only:

```bash
FINAL_PE=$(sed -n 's/^Phase 2 final PE head: //p' .superpowers/sdd/progress.md | tail -1)
FINAL_FE=$(sed -n 's/^Phase 2 final FE head: //p' .superpowers/sdd/progress.md | tail -1)
test -n "$FINAL_PE" && test -n "$FINAL_FE"
test "$(git rev-parse HEAD)" = "$FINAL_PE"
test "$(git -C ../round5-front-end rev-parse HEAD)" = "$FINAL_FE"
git merge-base --is-ancestor "$FINAL_PE" "$FINAL_FE"
test -z "$(git status --short)"
test -z "$(git -C ../round5-front-end status --short)"
```

Do not fall back to the obsolete historical old/new pair. This prevents a
subsequent FE merge from replaying already-rebased commits.

- [x] **Step 2: Run the semantic predecessor assertion**

Run:

```bash
node --input-type=module -e '
  import { readFileSync } from "node:fs";
  const data = await import("./src/data.js");
  const { MUSIC_CATALOG } = await import("./src/audio-catalog.js");
  const musicResolve = await import("./src/music-resolve.js");
  const { serializeAudioSelection } = await import("./src/dev/audio-selection-serialize.js");
  const { VARIANTS, WHISPERS, QUESTS, QUEST_IDS, PROGRESSION,
    QUEST_STATES, QUEST_ACTIVE_STATES, TERMINAL_OUTCOMES, RUN_ID_RE } = data;
  if (Object.keys(data).length !== 32) throw new Error(`expected 32 exports; got ${Object.keys(data).length}`);
  if (!VARIANTS || Object.keys(VARIANTS).length < 1) throw new Error("VARIANTS missing");
  if (!Array.isArray(WHISPERS) || WHISPERS.length !== 24) throw new Error("WHISPERS missing");
  if (!Array.isArray(QUEST_IDS) || QUEST_IDS.length !== 6) throw new Error("Emberglass quests missing");
  if (!QUESTS?.hollowLamplighter || !PROGRESSION?.emberglass) throw new Error("Emberglass chain incomplete");
  if (PROGRESSION?.revealThresholds?.act4?.shards !== 6) throw new Error("sealed Act 4 data surface missing");
  if (JSON.stringify(QUEST_STATES) !== JSON.stringify(["dormant","armed","revealed","complete"])) throw new Error("quest states drifted");
  if (JSON.stringify(QUEST_ACTIVE_STATES) !== JSON.stringify(["armed","revealed"])) throw new Error("active quest states drifted");
  if (JSON.stringify(TERMINAL_OUTCOMES) !== JSON.stringify(["win","death","abandon"])) throw new Error("terminal outcomes drifted");
  if (RUN_ID_RE.source !== "^(?:run|legacy)-[a-z0-9]+(?:-[a-z0-9]+){1,3}$" || RUN_ID_RE.flags !== "") throw new Error("run id contract drifted");
  const art = readFileSync("src/art.js", "utf8");
  const ui = readFileSync("src/ui.js", "utf8");
  if (!/roseWindow/.test(art) || !/sealedDoor/.test(art)) throw new Error("Rose Window/sealed-door art ids missing");
  if (!/rose-window/.test(ui) || !/sealed-door/.test(ui)) throw new Error("Rose Window/sealed-door UI surfaces missing");
  for (const marker of ["pendingRunEnd", "pendingDawn", "commitPendingRunEnd", "createChoiceLatch"]) {
    if (!ui.includes(marker) && !readFileSync("src/engine.js", "utf8").includes(marker)
      && !readFileSync("src/vigil.js", "utf8").includes(marker)) throw new Error(`Phase 2 transaction marker missing: ${marker}`);
  }
  const audioAssets = readFileSync("src/audio-assets.js", "utf8");
  const audio = readFileSync("src/audio.js", "utf8");
  const music = readFileSync("src/music.js", "utf8");
  if (!/applyAudioSelection/.test(audioAssets) || !/previewSfx/.test(audio)
    || !/invalidateMusicSelection/.test(music)) throw new Error("PR 15 hot audio contract missing");
  const expectedResolverExports = ["QUEST_COMBAT_CUES","SCREEN_CUES","dawnEventCue","resolveCombatCue","resolveScreenCue"];
  if (JSON.stringify(Object.keys(musicResolve).sort()) !== JSON.stringify(expectedResolverExports.sort()))
    throw new Error("PR 16 music resolver export contract drifted");
  if (MUSIC_CATALOG.length !== 22 || MUSIC_CATALOG.some((row) => !row.wired))
    throw new Error("PR 16 requires 22/22 live Music Cues");
  const { resolveCombatCue, resolveScreenCue, dawnEventCue } = musicResolve;
  const cases = [
    [resolveCombatCue("monster",0,{questId:"paleOnes",omenId:"eighthOmen"}),"paleOnes"],
    [resolveCombatCue("monster",1,{questId:"ownShade"}),"shadeDuel"],
    [resolveCombatCue("boss",2,{questId:"usurper"}),"usurper"],
    [resolveCombatCue("elite",0,{omenId:"eighthOmen"}),"eighthOmen"],
    [resolveCombatCue("boss",0,{omenId:"eighthOmen"}),"act1Boss"],
    [resolveScreenCue("hollow"),"hollowLamplighter"],
    [resolveScreenCue("map","eighthOmen"),"eighthOmen"],
    [dawnEventCue({t:"pageRead"}),"unreadablePage"],
    [dawnEventCue({t:"act4Reveal"}),"sealedDoor"],
  ];
  if (cases.some(([actual,expected]) => actual !== expected)) throw new Error("PR 16 cue precedence drifted");
  const selectionRaw = readFileSync("public/audio-selection.json", "utf8");
  const selection = JSON.parse(selectionRaw);
  if (!selection.music?.version || !selection.sfx?.version
    || typeof selection.music.overrides !== "object" || typeof selection.sfx.overrides !== "object")
    throw new Error("audio selection shape drifted");
  if (selectionRaw !== serializeAudioSelection(selection)) throw new Error("audio selection is not canonical gallery output");
  console.log("Round 5 predecessor present");
'
rg -n "Phase 2.*(shipped|complete|merged)" docs/README.md
rg -n "Dawn|Fall|Run Outcome|Rose Window" CONTEXT-MAP.md \
  docs/domain/climb/CONTEXT.md docs/domain/vigil/CONTEXT.md
```

Expected on the loaded baseline: the Node command
prints `Round 5 predecessor present`, and the documentation status is no longer
pending.

- [x] **Step 3: Establish a clean post-merge baseline**

Run:

```bash
npm install
npm run test:ci
npm test
npm run test:progression
npx vite build --outDir /tmp/spirebound-round5-phase2-baseline --emptyOutDir
export SPIREBOUND_E2E_PORT=$(node -e "const s=require('node:net').createServer();s.listen(0,'127.0.0.1',()=>{console.log(s.address().port);s.close()})")
node --input-type=module -e 'import {e2eServerSettings} from "./playwright-server.js"; const x=e2eServerSettings(process.env.SPIREBOUND_E2E_PORT); if (x.reuseExistingServer || !x.command.includes("--strictPort")) process.exit(1)'
npm run test:e2e
git status --short
```

Expected: tests and temporary build exit 0, the complete Playwright gate passes,
and status is empty. If an unmodified post-merge checkout is dirty, resolve that
predecessor defect before Round 5.

Recorded PR #16 re-entry evidence: `test:ci`/module boundaries passed;
`npm test` passed with 300 Monte-Carlo runs; progression retained guided median
18 and unguided median 50; the temporary build passed; strict port `65361`
resolved `reuseExistingServer:false`; disk `1`, random-agent `3`, main `154`
with `152` intentional skips, serial `5`, and visual `48` all passed. PR #16
changed no package/lock file. The tested runtime/test/config surface matched
`origin/main`; only the in-progress Round 5 specification/plan documents
differed and are committed before Task 3.

### Task 2: `[FE]` Bounded Round 5 experience contract — completed proposal

**Files (FE worktree only):**
- Create: `docs/superpowers/specs/2026-07-10-round5-fe-experience-contract.md`
- Test: local Markdown target/placeholder check

**Interfaces:**
- Consumes: the golden spec, `docs/style-bible.md`, `docs/ui-chrome-art-bible.md`, `docs/superpowers/specs/2026-07-09-pile-chrome-ceremony-design.md`.
- Produces: exact P4/P5/P6 presentation values for PE; no selectors, product JavaScript or runtime state.
- Status: the original `904036b`, Phase-2 `6c80bfc` and PR #16 live-music
  `ee79e74` commits passed fresh review; the document remains unapproved until
  the Task 21 owner checkpoint.

- [x] **Step 1: Write the contract acceptance checklist before the contract**

The document must begin with this binding checklist:

```markdown
## Acceptance checklist

- [ ] P4: rest, hover, pressed, disabled, ready and loading states for every widget
- [ ] P5: card hierarchy, fan states, four damage tiers, banners and pile flights
- [ ] P6: fresh/grown composition for every named screen and stage shape
- [ ] Merged Phase 2: exact Rose, Hollow, map, Dawn, quest-shop and Fall substates
- [ ] Full/LITE/REDUCED appearance and named end-state for every effect
- [ ] Exact colour, type, duration and easing values; no subjective or unspecified judgement language
- [ ] No product JavaScript, content/tooling behaviour or engine requirements
```

- [x] **Step 2: Lock the shared value table**

Record these values verbatim; PE transcribes them into `src/ui/tokens.js` in Task 21:

```js
export const ROUND5_EXPERIENCE_VALUES = {
  easing: {
    outSoft: [0.22, 1, 0.36, 1],
    spring: [0.34, 1.56, 0.64, 1],
  },
  durationMs: { micro: 120, quick: 180, standard: 320, screen: 450, ceremony: 640 },
  colour: {
    gold: '#f2c14e', goldDim: '#9c7c34', ink: '#0b0e1a',
    parchment: '#f4e7c5', text: '#ece7df', textDim: '#aaa6b8',
    danger: '#ff7060', ward: '#8fd0ff', ember: '#ff9a4d',
  },
  type: { display: 'Cinzel', body: 'Alegreya' },
};
```

The document owns the values, not this JavaScript shape; FE creates no `.js`
file. The names identify the approved families only. PE owns self-hosting,
licence/provenance, preload and readiness in Task 21; FE must not add a Google
Fonts import, CDN URL or font file.

- [x] **Step 3: Specify P4 and P5 state matrices mechanically**

For each widget/card state, give: visible layers, opacity, scale/offset, colour,
duration, easing, LITE replacement and REDUCED final frame. The fixed policies
are:

```text
rest scale 1.00; hover 1.04 and y -2; pressed 0.97; disabled opacity 0.42
ready pulse scale 1.00→1.035→1.00 over 640ms outSoft
loading shows vector fallback at opacity 0.72 until the blocking texture is ready
LITE removes filters/foil and keeps a static 12% white flat sheen
REDUCED renders only the terminal state and emits motion=reduced, outcome=settled
damage tiers: normal 32px, heavy 40px, kill 52px, overkill 62px
```

The P4 inventory is exact: energy/candle, Lantern Art, facet row, Draw,
Discard and Ashes piles, End Turn, HP vial, Ward chip, intent chip and top-HUD
HP/gold/deck/menu/omen. Map nodes remain DOM-on-3D and must not appear as P4
Pixi widgets. The P5 presentation table includes turn, boss intro and guard
shattered plus the merged owners `bossIntro`, `variantDialogue`,
`questReveal`, `questProgress`, `questComplete`, `questUnlock`,
`monumentGift` and `hollowTithe`.

- [x] **Step 4: Specify every P6 composition and ceremony**

Enumerate all five canonical shapes (`phone-portrait`, `phone-landscape`,
`pad-portrait`, `pad-landscape`, `desktop-landscape`) for Title, Embark, Fall,
Dawn, rewards, boss relic, shop, event, rest, treasure, lamplighter, Hollow,
Vigil and map. Boss relic is a reward-family state, treasure a rest-family state,
and Hollow a lamplighter-family state, but each gets its own row. Every row
contains fresh/grown content, trigger, properties, duration, easing, separate
existing Music Cue and SFX catalogue ids, LITE state and REDUCED terminal frame.
FE selects ids already present in the catalogues; PE preserves PR #16's live
resolver/call sites and validates the intended presentation alignment. Reward
and boss-relic rows request no screen cue and explicitly preserve the current
active cue (nominally combat/victory in uninterrupted play).
Copy named ceremony outcomes from the golden spec; do not invent engine/reveal
logic.

- [x] **Step 5: Reconcile every merged Phase 2 presentation substate**

Retain the 70 base rows and add an exact separate matrix for: Rose absent,
loading/inert/ready, atomic raster/fallback, four pane states, selection,
whispers and six-Shard completion; Hollow unpaid/pay/save-failed/retry/paid/
continue/return/recovery; Pale/Witchlight and Eighth-floor map markers plus
sealed-door hidden/visible/open and drag-suppressed tap; all ten Dawn event
kinds plus cursor/final-clear retry; Usurper shop states; and unpaid Shade
bequest at Fall. `Dawn`/`Fall` are domain names while compatibility cue ids
remain `victory`/`defeat` and display titles remain `ASCENDED`/`FALLEN`.

All 22 logical Music Cue ids are already live predecessor behaviour.
The contract records the PR #16 dispositions for Rose/Vigil, Hollow, quest
combat, Eighth map/event/combat, Dawn page/door, sealed-door restore and
reward/boss-relic no-request hold; FE neither marks nor wires them. Forced
gallery preview is not gameplay evidence. The sealed door is a non-path
promise, not an Act 4 route. No pack version, override ref, asset URL or
PR #15 runtime mechanism enters the FE document.

- [x] **Step 6: Run the FE documentation gate**

Run:

```bash
git diff --check
if rg -n '\b(T[B]D|T[O]DO|FIX[M]E|lat[e]r|appropriat[e]|tastefull[y])\b' \
  docs/superpowers/specs/2026-07-10-round5-fe-experience-contract.md; then exit 1; fi
```

Expected: no output and exit 0.

- [x] **Step 7: Commit only the FE contract**

Run:

```bash
git add docs/superpowers/specs/2026-07-10-round5-fe-experience-contract.md
git diff --cached --check
git commit -m "docs: reconcile Round 5 experience contract with Phase 2"
```

If the pre-merge draft and Phase-2 amendment already exist, retain both and add
the PR #16 amendment as `docs: load Phase 2 music into the Round 5 experience
contract`. Record all three FE contract commits in the execution ledger. It
remains an FE proposal
until the owner explicitly approves its value tables; Task 21 may not transcribe
them into `src/ui/tokens.js` before that checkpoint.

### Task 3: `[PE]` Build the disposable Pixi/WebKit compatibility branch

**Files (disposable spike worktree only):**
- Modify: `package.json`, `package-lock.json`, `src/main.js`, `index.html`, `src/styles.css`
- Create: `src/dev/pixi-safari-spike.js`, `test/e2e/pixi-spike.spec.js`, `test/e2e/pixi-spike-perf.spec.js`
- Create worktree: `.worktrees/round5-pixi-spike`

**Interfaces:**
- Produces only a throwaway `codex/round5-pixi-spike` commit and `window.__pixiSpike` with `state()`, `drag(from, to)`, `cancelDrag()`, `loseContext()` and `restoreContext()`.
- Consumes live scene3d/mesh contexts, the 2D VFX canvas, fixed-stage geometry and the current VFX shake transform.
- No spike source, route, canvas markup, Pixi dependency or test is merged into the PE branch.

- [ ] **Step 1: Create an isolated spike worktree from the post-gate PE head**

From the main repository root:

```bash
PE_HEAD=$(git -C .worktrees/round5-production-engineering rev-parse HEAD)
git worktree add .worktrees/round5-pixi-spike -b codex/round5-pixi-spike "$PE_HEAD"
npm --prefix .worktrees/round5-pixi-spike install
```

Record `PE_HEAD` in the execution ledger. Verify both worktrees were clean before
the spike branch was created.

- [ ] **Step 2: Write and observe the failing compatibility test**

In the spike worktree create `test/e2e/pixi-spike.spec.js`. It must assert:

```text
Pixi renderer = WebGL; exact live owners before/after recovery are #bg3d,#mesh,#uigl; #vfx remains 2D; max concurrent owners = 3
one NineSliceSprite; ten sprite-backed objects; one composed card face
observed canonical shape/viewport and finite --sat/--sar/--sab/--sal inputs
document.fonts.status = loaded; end-turn blocking texture ready with non-zero size
foil filter active in Full; a separate missing texture forces vector fallback
26 client-px upward drag commits; explicit pointercancel returns to rest
Pixi root follows the same shake offset as VFX
ready -> lost -> rebuilding -> ready; snapshot state survives rebuild
```

The disposable spike module exports `installSpikeContextObserver()` and the
`?pixispike=1` branch installs it before `initScene`, `initVfx`, `initMesh` or
Pixi initialisation. Both Playwright and actual Safari WebDriver read this same
runtime recorder through `state()`; no test-only init-script monkeypatch is the
evidence source. Before loss and after rebuild, the sorted live owner set must equal exactly
`['bg3d','mesh','uigl']`; during Pixi loss it may temporarily be
`['bg3d','mesh']`. The recorded maximum is three, with no transient fourth or
duplicate Pixi owner. An absent scene3d/mesh context cannot pass merely because
the count is below the cap.

The separate perf spec warms for 2 seconds, samples `requestAnimationFrame` for
10 seconds under the same host Chromium run and writes average fps/p95 frame ms
plus host/runtime metadata. It records evidence only; it is not Simulator or
physical-iOS performance.

Run:

```bash
export SPIREBOUND_E2E_PORT=$(node -e "const s=require('node:net').createServer();s.listen(0,'127.0.0.1',()=>{console.log(s.address().port);s.close()})")
test "$SPIREBOUND_E2E_PORT" != 5174
npx playwright test pixi-spike pixi-spike-perf --project=portrait --workers=1 --no-deps
```

Expected: FAIL because the route and `window.__pixiSpike` do not exist.

- [ ] **Step 3: Pin Pixi and add the query-only spike route**

Run `npm install --save-exact pixi.js@8.19.0`. Add a DEV-only
`?pixispike=1` branch that dynamically imports the spike module, calls
`installSpikeContextObserver()`, then initialises stage, scene3d, VFX, mesh and
the spike in that order. Never import the spike from a production-reachable
static module.

Place `<canvas id="uigl" aria-hidden="true"></canvas>` immediately after
`#vfx`, outside `#shake`, before DOM overlays. Style it transparent, stage-sized
and `pointer-events:none`. Mirror the current VFX shake offset onto the Pixi root
instead of nesting the canvas inside the DOM shake container.

- [ ] **Step 4: Implement the complete disposable surface**

Initialise one Pixi `Application` with `preference:'webgl'`, DPR capped at 2,
transparent background and the fixed virtual stage size. Exercise a real
`NineSliceSprite`, ten sprite-backed objects, composed card face, foil filter,
forced missing-raster fallback, W3C pointer drag/cancel and
`WEBGL_lose_context`. Recovery destroys and rebuilds the sole Pixi application,
restores a serialisable snapshot, and exposes its `lost/rebuilding/ready` state.
Wait for `document.fonts.ready`; resolve every input coordinate through
`toStage()`.

`state()` exposes `stageInfo()`, observed viewport, the four parsed root safe-
area custom properties, `document.fonts.status`, and both real/fallback texture
records. It also exposes `webglOwnersBefore`, `webglOwnersDuringLoss`,
`webglOwnersAfter` and `maxConcurrentWebglOwners` from the observer. The real
texture is existing `ui/end-turn.png` and must have non-zero
dimensions; the forced-missing id remains a separate fallback assertion.

- [ ] **Step 5: Prove green and production exclusion without touching tracked `dist/`**

```bash
export SPIREBOUND_E2E_PORT=$(node -e "const s=require('node:net').createServer();s.listen(0,'127.0.0.1',()=>{console.log(s.address().port);s.close()})")
test "$SPIREBOUND_E2E_PORT" != 5174
npx playwright test pixi-spike pixi-spike-perf --project=portrait --workers=1 --no-deps
npm test
npx vite build --outDir /tmp/spirebound-round5-pixi-spike --emptyOutDir
if rg -n "__pixiSpike|pixispike|installSpikeContextObserver" /tmp/spirebound-round5-pixi-spike/assets; then exit 1; fi
git diff --check
```

Expected: the spike assertions pass, the temporary production bundle contains
no spike marker, and the spike worktree has only the declared paths.

- [ ] **Step 6: Commit and freeze the disposable evidence surface**

```bash
git add package.json package-lock.json src/main.js index.html src/styles.css \
  src/dev/pixi-safari-spike.js test/e2e/pixi-spike.spec.js \
  test/e2e/pixi-spike-perf.spec.js
git commit -m "test: spike Pixi on Simulator Safari"
git rev-parse HEAD
```

Record the immutable spike hash. Do not push or merge this branch.

### Task 4: `[PE]` Automate and record the Simulator Safari P0.5 gate

**Files (PE worktree):**
- Create: `test/simulator/matrix.mjs`, `matrix.test.mjs`, `dom-profile.test.mjs`, `preflight.mjs`, `orientation.mjs`, `server.mjs`, `webdriver.mjs`, `assertions.mjs`, `run.mjs`, `README.md`
- Modify: `package.json`, `package-lock.json`
- Modify: `AGENTS.md`, `docs/README.md`
- Create: `docs/superpowers/reports/2026-07-10-round5-p0.5-simulator-safari.md`
- Create: `docs/superpowers/artifacts/round5-p0.5-simulator/**`

**Interfaces:**
- Consumes the immutable Task 3 spike hash through `SPIREBOUND_BASE_URL`; the reusable runner never imports spike code.
- Produces serial eight-cell JSON/screenshot evidence plus a PE-authored GO/NO-GO report; evidence claims functional compatibility only.

- [ ] **Step 1: Write the pure runner contract tests first**

Create `matrix.test.mjs` before `matrix.mjs`; import the missing module and assert
the exact four-device, two-orientation matrix. Add pure tests for managed-device
name generation, capability construction, result normalisation and orientation
validation, plus spawned-server readiness/owned-child cleanup with a fake child.
Freeze `smoke` to exactly two cells: iPhone 17 Pro portrait and iPad mini
(A17 Pro) landscape; `full` is all eight cells. No profile may reinterpret
those names.
`dom-profile.test.mjs` freezes a reusable profile that waits for
`window.__probe.state()`, `queueIdle()` and `settle()`, with optional trace
assertions when P1 has installed them; it contains no Pixi/spike assumption. Run:

```bash
node --test test/simulator/*.test.mjs
```

Expected: FAIL with `ERR_MODULE_NOT_FOUND` for `matrix.mjs`.

- [ ] **Step 2: Implement the reusable serial modules**

`matrix.mjs` exports the exact device rows:

```js
export const SIMULATOR_MATRIX = [
  { device: 'iPhone SE (3rd generation)', family: 'phone', orientations: ['portrait', 'landscape'] },
  { device: 'iPhone 17 Pro', family: 'phone', orientations: ['portrait', 'landscape'] },
  { device: 'iPad mini (A17 Pro)', family: 'pad', orientations: ['portrait', 'landscape'] },
  { device: 'iPad Pro 13-inch (M5)', family: 'pad', orientations: ['portrait', 'landscape'] },
];
```

`preflight.mjs` reads `xcrun simctl list -j`, Xcode/runtime versions and
`safaridriver --help`; it must never invoke `safaridriver --enable`, request a
password or treat a model name as UDID proof. Require the pinned iOS 26.5
(`23F73`) runtime and record Xcode 26.6 (17F113). A missing runtime/tool is
`SETUP BLOCKED`, never a Pixi compatibility NO-GO. `preflight.mjs` prints the
exact non-credential setup action and exits non-zero; it never substitutes a
different runtime. Only a booted cell may produce a compatibility verdict. If
WebDriver is unavailable it prints one visible manual setup instruction and
exits non-zero.

The same preflight requires a real console user (not `loginwindow`, root or a
background-only session), a live `launchctl gui/<uid>` domain, an unlocked GUI
session and a launchable Simulator process. It records the console uid, GUI
session check and lock/power observations without recording usernames. A
sleeping/locked/headless Mac fails fast with the instruction to wake, unlock and
log in locally; the runner never tries to wake the Mac or requests credentials.
Once launched, `run.mjs` may own a `caffeinate` child for the duration and must
terminate only that child in `finally`; this prevents new sleep but cannot wake
an already sleeping host. Pure tests cover console-user, locked-session and
owned-caffeinate cleanup cases with fakes.

Only devices named `Spirebound R5 - <model>` may be created, booted, rotated or
shut down by the runner. Never erase/delete a Simulator and never shut down an
unrelated device. `orientation.mjs` uses a visible Simulator menu action through
`osascript`, then verifies `screen.orientation.type`, viewport and selected
stage shape; it does not invent an unsupported `simctl` rotation command.

`run.mjs` owns an isolated Vite server by default: choose a free localhost port,
spawn `npm run dev -- --host 127.0.0.1 --port <port> --strictPort` in the current worktree (or
`SPIREBOUND_SERVER_CWD`), wait for HTTP readiness, and terminate only that child
process tree in `finally`. If an explicit `SPIREBOUND_BASE_URL` is supplied it
uses but never stops that external server. It never reuses the developer's 5174
process. Pure tests assert `--strictPort`, a bind-race failure, readiness timeout
and owned-child cleanup; the runner never falls back to another port or server.

- [ ] **Step 3: Implement the WebDriver assertion contract**

Pin `selenium-webdriver@4.45.0` as an exact dev dependency. Build Safari
capabilities with this exact requested map and pure-test every key:

```js
{
  browserName: 'Safari',
  platformName: 'iOS',
  'safari:platformVersion': '26.5',
  'safari:platformBuildVersion': '23F73',
  'safari:useSimulator': true,
  'safari:deviceType': model,
  'safari:deviceUDID': managedUdid,
}
```

Model and UDID are the row's exact resolved managed device, never a requested-
only evidence label. Dispatch assertions through the explicit
`spike` or `dom` surface profile. Spike navigates to `/?pixispike=1` and verifies
the Task 3 state/drag/cancel/fallback/shake/loss/rebuild contract; DOM uses a
normal deterministic game URL and semantic Probe facts. `driver.quit()` runs in
`finally`.

Immediately after each session is established, call
`await driver.getCapabilities()` and serialise the **observed** capability map.
Require non-empty observed `browserName` and `browserVersion`; record them as
`observedSafari.browserName`/`browserVersion` in every cell. If WebDriver also
exposes a Safari/WebKit build capability, record its exact key/value as
`observedSafari.build`; otherwise record `build:null` plus the capability keys
examined. Requested capabilities never satisfy this evidence field. Pure
normalisation tests reject a result containing only the requested Safari
version/model.

Each cell writes JSON and a screenshot below `test-results/simulator/` with:
toolchain/builds, host architecture, requested capabilities, complete observed
capabilities, observed Safari name/version/build, model/UDID, requested and
observed orientation, viewport/stage shape, every semantic assertion, artifact
paths and `claim:'functional-compatibility-only'`.

Every cell fails unless its phone/pad + orientation selects the expected
canonical stage shape, all four safe-area inputs are finite/non-negative,
`document.fonts.status === 'loaded'`, the real blocking texture is ready and
non-zero, and the deliberately missing texture uses the labelled fallback.
For spike rows it also requires before/after owners exactly
`bg3d,mesh,uigl`, during-loss owners `bg3d,mesh`, and maximum concurrent owners
three; normalised JSON/report rows retain all four owner-evidence fields.

After the full run, copy the eight JSON files and eight screenshots into
`docs/superpowers/artifacts/round5-p0.5-simulator/` and generate
`manifest.json` containing source/spike SHA, relative path, media type, byte
size and SHA-256 for every file. The report links only these committed paths;
ignored `test-results/` paths are never durable evidence.

- [ ] **Step 4: Add stable entry points and prove the runner tests green**

Add scripts:

```json
"test:simulator:preflight": "node test/simulator/preflight.mjs",
"test:simulator:smoke": "node test/simulator/run.mjs --matrix smoke",
"test:simulator:full": "node test/simulator/run.mjs --matrix full"
```

Run `node --test test/simulator/*.test.mjs` and
`npm run test:simulator:preflight`. On the refreshed 2026-07-11 host, Xcode,
SafariDriver, all four device types and iOS 26.5 build `23F73` are present;
there are no managed Spirebound devices yet, which is expected because the
runner creates only its own names. If the exact runtime is absent on a later
host, first observe `SETUP BLOCKED`, run the supported non-interactive download
and rerun preflight:

```bash
xcodebuild -downloadPlatform iOS -buildVersion 26.5
npm run test:simulator:preflight
```

No agent invokes a password prompt. If Xcode reports that a credential or GUI
approval is required, stop as environment-blocked and report that visible
action; do not work around it. Expected after setup: pure tests and preflight
pass. Preflight may otherwise stop with the documented visible setup action,
never a hidden prompt.
`run.mjs` requires an explicit `--surface spike|dom|production`; Task 4
implements/tests `spike` and `dom`, and reserves `production` for Task 24.

- [ ] **Step 5: Run the immutable spike through all eight real-Safari cells**

Let the runner spawn the Task 3 worktree server on an isolated localhost port:

```bash
SPIREBOUND_SERVER_CWD=../round5-pixi-spike \
  npm run test:simulator:full -- --surface spike
```

Expected: eight serial results, each proving ready, drag committed,
pointer-cancelled rest, forced fallback, shake alignment, lost, rebuilding and
ready recovery. A single failed criterion makes the decision NO-GO and blocks
Task 5.

- [ ] **Step 6: Write the report and obtain independent QA review**

The report records the Phase 2 merge hash, PE head, spike hash, exact toolchain,
each cell's observed Safari browser version/build, all eight rows,
screenshots/JSON paths, each functional criterion, Playwright
host-relative numbers in a separate table, excluded physical-device claims and
one final line exactly `Decision: GO` or `Decision: NO-GO`. A fresh QA agent
reviews the report and raw artifacts; PE fixes findings and owns the decision
evidence.

On GO only, verify the disposable worktree has no uncommitted changes, record
its hash, remove `.worktrees/round5-pixi-spike`, and delete only the local
`codex/round5-pixi-spike` branch. No spike file is copied or merged.

- [ ] **Step 7: Verify and commit only reusable infrastructure/evidence**

Update `AGENTS.md` and the docs index with the runner-owned server, managed-
Simulator rule, `spike`/`dom` surfaces, serial matrix commands, visible
preflight and functional-compatibility-only claim before committing.

```bash
node --test test/simulator/*.test.mjs
npm test
git diff --check
git add package.json package-lock.json test/simulator/matrix.mjs \
  test/simulator/matrix.test.mjs test/simulator/preflight.mjs \
  test/simulator/dom-profile.test.mjs \
  test/simulator/orientation.mjs test/simulator/server.mjs \
  test/simulator/webdriver.mjs \
  test/simulator/assertions.mjs test/simulator/run.mjs \
  test/simulator/README.md \
  docs/superpowers/reports/2026-07-10-round5-p0.5-simulator-safari.md \
  docs/superpowers/artifacts/round5-p0.5-simulator AGENTS.md docs/README.md
git commit -m "test: record the Simulator Safari Pixi gate"
```

Do not commit `test-results/`. A NO-GO report is still committed, but execution
stops before Task 5 and the golden design is revised rather than bypassed.

---

**Golden spec:** `docs/superpowers/specs/2026-07-09-canvas-ui-shipfront-design.md`

**Research basis:** `docs/research/2026-07-10-ui-behaviour-trace-ios-simulator.md`

**Golden spec merge:** `d048640`, PR #13

**Loaded PR #14/#15 golden amendment:** `156e0ce`

**Loaded PR #16 golden amendment:** `d02fd64`

**Loaded PR #16 recovery clarification:** `be0dda0`

### Task 5: `[PE]` Implement the Node-pure Semantic UI Behaviour Trace

**Files:**
- Create: `src/ui/behaviour-trace.js`
- Create: `tools/run-with-strict-e2e-port.mjs`
- Create: `tools/run-round5-standing-gates.mjs`
- Modify: `package.json`, `package-lock.json`
- Modify/Test: `test/test_engine.js`

**Interfaces:**
- Produces: `createBehaviourTrace(options)` returning `emit`, `begin`, `read`, `activeSpans`, `assertIntegrity`, `reset` and `enabled`.
- Consumed by: `src/ui/context.js`, `src/ui/drain.js`, `src/ui/probe.js`, Content Lab and both browser runners.

- [ ] **Step 1: Write the failing trace contract block**

Import `createBehaviourTrace` into `test/test_engine.js` and add:

```js
{
  let now = 10;
  const trace = createBehaviourTrace({
    enabled: true, strict: true, capacity: 8, segment: 'page-a', now: () => now++,
    policy: () => ({ screen: 'combat', renderer: 'dom', motion: 'full', tier: 'full' }),
  });
  const input = trace.emit('input.card-drag', { phase: 'point', outcome: 'accepted', attributes: { uid: 7 } });
  const span = trace.begin('presentation.card-flight', {
    causeSeq: input.seq, correlationId: 'play-7', attributes: { uid: 7 },
  });
  span.finish('settled', { checkpoint: { queueDepth: 0 } });
  assert.deepEqual(trace.read({ format: 'contract' }).records.map((r) =>
    [r.seq, r.eventName, r.phase, r.outcome ?? null]), [
    [1, 'input.card-drag', 'point', 'accepted'],
    [2, 'presentation.card-flight', 'start', null],
    [3, 'presentation.card-flight', 'end', 'settled'],
  ]);
  const reset = trace.read({ after: { segment: 'page-old', seq: 99 }, format: 'records' });
  assert.equal(reset.reset, true);
  assert.equal(reset.records[0].seq, 1);
  assert.deepEqual(trace.assertIntegrity(), { ok: true, errors: [] });
  assert.throws(() => span.finish('settled'), /already finished/);
}
```

Add separate blocks for malformed JSON values, buffer overflow, orphan spans,
disabled no-op mode, NDJSON parseability and timestamp-free contract output.
Export/test a frozen forbidden-key set containing `text`, `copy`, `html`,
`label`, `run`, `cb`, `save`, `snapshot`, `dom`, `pixi`, `pointerX`, `pointerY`,
`frame` and `tick`. Reject nested occurrences, strings over 128 bytes, raw
pointer coordinates/events and save-shaped payloads. Replay Descriptor data is
validated through its own bounded schema, never smuggled into attributes.

Import the two not-yet-created runners. For the strict-port wrapper, assert an
empty argv is rejected, import performs no allocation/spawn, the allocator
never returns 5174, `e2eServerSettings(String(port))` is strict and
`reuseExistingServer:false`, argv is spawned without a shell, inherited env is
preserved, and the child receives only the newly allocated
`SPIREBOUND_E2E_PORT`. For the standing-gate runner assert the exact frozen
profile/command table above, literal cumulative inclusion from `p1-node` through
`full`, argv-array execution, fail-fast behaviour and a distinct non-5174 port
for each simulated Playwright-backed command. Assert import performs no process
spawn and the optional content-disk row is the only conditional command.

- [ ] **Step 2: Verify the red state**

Run `npm test`.

Expected: FAIL with `ERR_MODULE_NOT_FOUND` for `behaviour-trace.js` or the
standing-gate runner.

- [ ] **Step 3: Implement the strict-port wrapper and standing-gate runner**

In `run-with-strict-e2e-port.mjs`, export `allocateStrictE2EPort()` and
`runWithStrictE2EPort({argv, spawn, env, allocatePort})`. Keep CLI execution
behind a direct-execution guard, require the exact CLI form
`node tools/run-with-strict-e2e-port.mjs -- <argv...>`, allocate immediately
before spawning, reject 5174, validate `e2eServerSettings(String(port))`, print
the selected port, and use `spawnSync(argv[0], argv.slice(1), {shell:false,
stdio:'inherit', env:{...env,SPIREBOUND_E2E_PORT:String(port)}})`. Propagate
signal/non-zero status; never retry on 5174 or reuse a previous environment
value.

Export `STANDING_GATE_PROFILES` and `runStandingGates({profile, spawn,
allocatePort, record})`. Import the shared allocator, keep CLI execution behind
a direct-execution guard, use explicit command/argument arrays and inject a
freshly allocated port only for Playwright-backed rows. The real CLI appends one
JSON result row per command to the ignored SDD ledger and exits non-zero on the
first failure. Add exactly:

```json
"test:round5:standing": "node tools/run-round5-standing-gates.mjs"
```

Run `npm run test:round5:standing -- --profile p1-node`; expected: the existing
Node suite passes and no browser command is spawned.

- [ ] **Step 4: Implement the fixed record contract**

Use these constants and signature exactly:

```js
export const TRACE_VERSION = 1;
export const TRACE_END_OUTCOMES = new Set([
  'completed', 'settled', 'cancelled', 'skipped', 'failed',
]);
export const TRACE_POINT_OUTCOMES = new Set([
  'accepted', 'rejected', 'completed', 'cancelled', 'failed',
]);

export function createBehaviourTrace({
  enabled = false,
  strict = false,
  capacity = 4096,
  segment = `page-${crypto.randomUUID?.() ?? Math.random().toString(36).slice(2)}`,
  now = () => performance.now(),
  policy = () => ({}),
} = {}) {
  // bounded immutable records; main collector alone assigns seq
}
```

`emit()` accepts point records only and validates its optional outcome against
`TRACE_POINT_OUTCOMES`. `begin()` emits `phase:'start'` with no outcome and
returns one `finish(outcome, patch)` closure emitting `phase:'end'`, whose
outcome must be in `TRACE_END_OUTCOMES`. Deep-copy and deep-freeze JSON-safe
payloads. Reject DOM nodes, functions, cycles, non-finite numbers and outcomes
outside the phase-specific fixed set. On overflow, increment `dropped`,
retain the newest `capacity` records, emit one `error.trace-overflow` point with
the current dropped count and make `assertIntegrity()` fail. In `strict:true`
tests, malformed spans, orphan finishes and double finishes throw. Runtime uses
`strict:false`: the collector records `error.trace-integrity`, abandons only the
bad observation and never interrupts gameplay.

`read()` returns:

```js
{
  v: 1, enabled, format, segment, firstSeq, lastSeq, dropped, reset,
  header,
  cursor: { segment, seq: lastSeq },
  records, // raw/contract array; [] for text/ndjson
  text,    // string only for text; otherwise null
  ndjson,  // string only for ndjson; otherwise null
}
```

Disabled mode still returns that complete frozen envelope with `enabled:false`,
zero sequence/count values and an empty `records` array. It never allocates a
record or an active span. On initial/reset reads its selected text/NDJSON field
contains only the active header projection; on same-segment incremental reads
it is `''`. The unselected projection is `null`. Enabled mode always returns
`enabled:true`; probe and Lab code do not infer status from record count.

For `format:'records'`, `records` contains raw immutable records and both string
fields are `null`. For `format:'contract'`, `records` contains normalised
records and both string fields are `null`. For `format:'text'`, `records` is
empty and `.text` is the projection. For `format:'ndjson'`, `records` is empty
and `.ndjson` is the projection. No caller treats the envelope itself as a
string.

On an initial read (`after == null`) or any stale/foreign segment cursor,
`header` is the frozen active segment header
`{v,enabled,segment,firstSeq,lastSeq,dropped,reset}`; on a same-segment
incremental read it is `null`. A stale cursor sets `reset:true` and restarts at
the retained first record. `.text` starts with one `# trace ...` header line and
`.ndjson` starts with one `{kind:'trace-header',...}` object whenever `header`
is present. Contract/record consumers read the envelope header directly. Add
initial, same-segment incremental, stale-seq and foreign-segment tests.

For `format:'contract'`, strip `atMs`, generated/run/instance ids and asset URLs.
For the `.text` projection, emit one line with this fixed grammar:

```text
+000123.4ms [page-a:42] input.card-drag phase=end outcome=cancelled screen=combat renderer=dom reason=pointercancel cause=41 correlation=drag-1 attrs={"uid":7}
```

Fields are always ordered: elapsed time, `segment:seq`, event, phase/outcome,
screen/renderer, stable reason, cause seq, correlation id and compact sorted
JSON attributes; absent values render `-`. Escape line breaks/control bytes.
Only semantic ids, numbers, booleans and stable reasons enter attributes; no
player-facing copy appears in text/NDJSON/contract projections.
For `.ndjson`, emit one JSON object per line. A cursor from another segment
resets to the current first record. Unit tests parse `.text` without consulting
records and prove the same sequence/reason/cause facts; parse `.ndjson` line by
line without consulting raw records.

- [ ] **Step 5: Verify green**

Run:

```bash
npm test
npm run test:round5:standing -- --profile p1-node
```

Expected: all trace blocks plus the existing monte-carlo pass.

- [ ] **Step 6: Commit**

```bash
git add src/ui/behaviour-trace.js tools/run-with-strict-e2e-port.mjs \
  tools/run-round5-standing-gates.mjs \
  package.json package-lock.json test/test_engine.js
git commit -m "feat: add the semantic UI behaviour trace"
```

### Task 6: `[PE]` Instrument the DOM monolith and freeze migration contracts

**Files:**
- Modify: `src/ui.js`, `src/audio.js`, `src/music.js`
- Modify: `src/audio-assets.js` only if the selected/draft observation sink must
  be placed at the selection-resolution boundary
- Create: `src/ui/presentation-barrier.js`
- Modify/Test: `test/test_engine.js`, `test/test_module_boundaries.mjs`
- Modify: `test/e2e/helpers.js`, `test/e2e/battle.spec.js`,
  `test/e2e/audio.spec.js`, `test/e2e/emberglass.spec.js`,
  `test/e2e/emberglass-persistence.spec.js`,
  `test/e2e/hollow-transaction.spec.js`
- Create: `test/e2e/trace.spec.js`, `test/e2e/trace-fixture.js`
- Create: `test/e2e/trace-production.spec.js`, `playwright.trace-production.config.js`
- Modify: `package.json`, `package-lock.json`
- Create: `test/e2e/fixtures/trace/manifest.json`, `title-embark.json`,
  `opening-turn.json`, `targeted-play.json`, `drag-cancel.json`, `art.json`,
  `pile-cycle.json`, `detached-ceremony.json`, `initial-run-save.json`,
  `usurper-purchase.json`, `shade-bequest-clear.json`,
  `hollow-payment.json`, `hollow-route-clear.json`, `terminal-outbox-retry.json`,
  `dawn-cursor-retry.json`, `dawn-final-clear-retry.json`,
  `dawn-resume-from-cursor.json`

**Interfaces:**
- Produces: trace-enabled `window.__probe.behaviourTrace`, an always-on
  presentation barrier, `queueIdle`, strengthened `settle`, selected DOM-era
  contract journeys and failure attachments.
- Consumes: `createBehaviourTrace`; the real existing handlers and queue.

- [ ] **Step 1: Write failing end-to-end trace assertions**

Create `test/e2e/trace.spec.js` with one helper that reduces records to
`eventName/phase/outcome`, then assert these ordered subsequences:

```js
const journeys = {
  screen: [
    ['screen.requested', 'point', 'accepted'],
    ['screen.exited', 'point', 'completed'],
    ['screen.entered', 'point', 'completed'],
  ],
  cancelledDrag: [
    ['input.card-drag', 'start', null],
    ['input.card-drag', 'end', 'cancelled'],
  ],
  cardPlay: [
    ['input.card-play', 'end', 'completed'],
    ['playback.queue', 'start', null],
    ['playback.queue-event', 'start', null],
    ['playback.queue-event', 'end', 'completed'],
    ['playback.queue', 'end', 'completed'],
  ],
};
```

Boot with `trace=1`, drive the real title navigation, a real cancelled pointer
drag and a real card play. Assert contiguous sequence, zero drops, zero open
spans and no `error.*` records.

Repeat representative assertions using only `behaviourTrace({format:'text'})`:
parse its `.text` field and no structured records, then diagnose screen entry,
card drag cancellation
with reason, queue parent/child cause order, detached ceremony settle and
persistence recovery. Task 24 adds the renderer loss/rebuild/ready text-only
journey. This is the falsifiable AI-readable-text gate, not a subjective report.

Boot a second detached-ceremony journey with trace disabled. Assert
`behaviourTrace().enabled === false`, the barrier remains non-idle until the
real animation callback completes, and `await __probe.settle()` cannot resolve
early. The enabled and disabled journeys must expose identical final semantic
Probe state; trace is an observer, not the synchronisation primitive.

The same spec owns the frozen Task 6 fixture manifest: Title→Embark,
opening/draw, targeted play, drag cancel, Lantern Art, draw/reshuffle pile
cycle, detached ceremony settle, initial-run save, Usurper purchase, Shade
bequest clear, Hollow payment, Hollow route clear, terminal-outbox retry, Dawn-cursor retry,
Dawn-final-clear retry and Dawn resume from its acknowledged cursor. The
manifest is the only downstream fixture inventory; later tasks say “the frozen
Task 6 fixture manifest” rather than repeating a number. Fixtures exclude
timestamps, segment/instance ids, URLs and renderer policy. Characterise the
post-Phase-2 retry, inert/focus, idempotence and exact-once outcomes before any
owner is extracted.

In `test_engine.js`, import the not-yet-created presentation barrier and write
pure failing tests for nested work, cancellation, double-finish strict/runtime
policy, destruction and `whenIdle()` resolution order.

- [ ] **Step 2: Verify red**

Run:

```bash
npm test
node tools/run-with-strict-e2e-port.mjs -- npx playwright test trace --project=desktop --workers=1
```

Expected: Node fails on the missing barrier module and Playwright fails because
`behaviourTrace` is absent. Keep both red tests intact for implementation.

- [ ] **Step 3: Instantiate trace before UI boot**

At module initialisation, define a compile-time QA gate:

```js
const TRACE_BUILD = import.meta.env.DEV
  || import.meta.env.MODE === 'test'
  || import.meta.env.VITE_QA_TRACE === '1';
const trace = createBehaviourTrace({
  enabled: TRACE_BUILD && (qs.has('trace') || qs.has('lab')),
});
```

An ordinary production build ignores `?trace=1` and remains no-op; only a
non-public build explicitly compiled with `VITE_QA_TRACE=1` may honour it. DEV
Lab auto-enables because replay/transcript is part of its contract; an ordinary
DEV URL without `trace` or `lab` remains disabled. Add both assertions. The
policy callback returns `S.screen`, renderer `dom`, current `REDUCED/FULL`
motion and `LITE/FULL` tier. Never put `S.run`, `S.cb`, elements or Pixi objects
in a record.

Add `test:e2e:trace-production`: build a normal production bundle into a fresh
temporary directory, serve it through a dedicated Playwright config, navigate
to `/?trace=1`, and assert the probe reports `enabled:false`, zero records and
zero persistence/network activity.

Also add the durable non-visual aggregate used by every standing profile:

```json
"test:e2e:nonvisual": "npm run test:e2e:disk && npm run test:e2e:random-agent && npm run test:e2e:main && npm run test:e2e:serial"
```

Keep `test:e2e` as `npm run test:e2e:nonvisual && npm run test:e2e:visual` and
add a Node source assertion for both exact mappings. This changes no individual
Playwright project and prevents pixel-moving implementation commits from
weakening or prematurely updating the visual suite.

- [ ] **Step 4: Instrument semantic owners**

First implement `createPresentationBarrier()` as a Node-pure token owner:

```js
const token = barrier.begin('card-flight');
token.finish();
barrier.activeCount();
barrier.whenIdle();
barrier.assertIdle();
```

Every real detached presentation owner opens exactly one barrier token and
finishes it from the existing completion/cancellation callback. The trace span
observes that same boundary but has no ownership role. Double finish is an
error in tests and fail-open/idempotent at runtime; destruction cancels and
finishes all owned tokens. Make every Step 1 barrier test green.

Add point/spans at these exact owner boundaries:

```text
boot/render readiness: app.ready, renderer.ready
show/transition: screen.requested, screen.exited, screen.entered, screen.redirected
bindCardDrag/beginCardDrag/doPlay: input.card-drag, input.card-play
setTargeting/clearTargeting: input.targeting
map pointer/select boundaries: input.map-pan, input.map-select
onEndTurn/doKindle/usePotionOn: input.end-turn, input.kindle, input.potion
drain/handleEvent/draw batches: playback.queue, playback.queue-event
banner/flyCardBacks/dawnQueue: presentation.banner, presentation.card-flight, presentation.dawn
save/recovery: persistence.attempt, persistence.blocked, persistence.recovered
music/audio observation sinks: audio.unlock, audio.music-request, audio.sfx-request
stable semantic snapshots: checkpoint.ui
window error/unhandled rejection/drain/invariant catch: error.ui, error.playback, error.invariant
```

Every started span finishes once; detached motion finishes only when its real
callback/animation settles. Each draw/reshuffle batch member gets its own
`playback.queue-event` span.

Use one semantic `persistence.*` vocabulary for Phase 2. Its finite `kind` is
exactly `initial-run`, `usurper-purchase`, `shade-bequest-clear`,
`hollow-payment`, `hollow-route-clear`, `run-end`, `dawn-cursor` or
`dawn-clear`; attributes contain numeric `attempt` plus the existing stable
result/reason vocabulary. Freeze one real focused assertion and manifest entry
for every kind. Never emit a save payload, run copy, receipt, asset reference
or player-facing text. Presentation-barrier ownership spans
the whole Dawn drain and any open persistence dialog, including the retry
interval. `settle()` cannot resolve while either owns a token. Add focused
characterisation for terminal-outbox retry, Dawn cursor retry, Dawn final-clear
retry, resume-from-cursor, the choice latch and the modal's inert/focus trap.

`checkpoint.ui` uses the same compact semantic projection as Probe state:
screen/busy/queue depth; player HP/Ward/energy; embers; enemy ids/HP/Ward; hand
content ids and counts. It deep-copies primitives only and never retains
`run`, `cb`, DOM or renderer objects.

Enemy identity is `{key,variantId}` rather than display name, and Rose state
includes only stable readiness/fallback flags and disclosed state ids. Add a
Phase-2 test for `paleDuskfang` plus forced Rose fallback so AI debugging can
distinguish the live variant and fallback path without reading pixels or copy.

Dispatch 100 raw `pointermove` events and advance 100 idle ticker frames; record
count must not change until a semantic threshold/cancellation boundary occurs.
Change visible card/screen copy in a controlled fixture and require the
normalised contract/text semantic fields to remain identical. Add source checks
rejecting trace emission inside raw pointermove and animation-frame/ticker loops.

Add optional browser-only observation sinks to `audio.js`, `music.js` and, only
when resolution evidence requires it, `audio-assets.js`; UI installs them and
maps actual playback results to trace records. The sinks never change playback
selection or timing and report the true result vocabulary:
`sample`, `synth-fallback`, `muted`, `unavailable`, `superseded` or `playing`.
Neither module imports the trace, and engine/vigil imports remain unchanged.

Audio results are attributes, not lifecycle outcomes. Emit audio point records
with `attributes.result` from that six-value enum; use point outcome
`completed` for `sample`, `synth-fallback` and `playing`, and `rejected` for
`muted`, `unavailable` and `superseded`. Add one test per result so no audio
string is accidentally passed as `outcome` and rejected by the collector.
Every audio record carries only its logical Music Cue/SFX id,
`mode:'active'|'draft'` and actual result. It excludes URLs, file names, pack
versions and override references. Characterise PR #15's unsaved draft preview,
same-page hot apply, both cache invalidations and active-cue re-resolution in
`audio.spec.js`; the trace must distinguish gameplay from forced preview
without changing either path. Also freeze PR #15's `_raw` glob exclusion and
the production gallery's read-only/no-POST behaviour; both remain explicit
`audio.spec.js` assertions through extraction.

Freeze PR #16 before moving any UI owner. Node checks require exactly the five
`music-resolve.js` exports, 22/22 wired catalogue rows, quest → Eighth
non-boss → ordinary theme precedence, `ownShade` → `shadeDuel`, and the
screen/Dawn mappings. Browser audio/trace journeys drive the real owners for:
initial Vigil and Rose/deeds tab switches; Hollow; Pale Ones, Own Shade and
Usurper combat; Eighth map, event, non-boss combat and boss fallback;
`pageRead` and `act4Reveal` Dawn panels; sealed-door open and map/Eighth restore
on close. Reward and boss-relic journeys assert **no screen-cue request** and
that the cue active before navigation is unchanged, including one nominal
combat/victory flow and one pending-state recovery flow. These are
selected-state fixtures, not gallery force-preview. `public/audio-selection.json` is characterised as
valid installed canonical Save output without pinning either version or empty
overrides. Module-boundary tests keep `music-resolve.js` Node-pure and forbid it
from importing audio, trace, DOM or stage modules.

The same browser test dynamically imports `/src/music.js` after normal boot,
projects `REGISTRY[id].warmWith`, and freezes this exact PR #16 core graph:

```js
const PR16_WARM_GRAPH = {
  title: ['embark', 'vigil'],
  embark: ['map'],
  vigil: ['title', 'roseWindow'],
  roseWindow: ['vigil'],
  map: ['act1Combat', 'safeNodes', 'elite', 'hollowLamplighter'],
  safeNodes: ['map'],
  act1Combat: ['act1Boss', 'map', 'elite'],
  act1Boss: ['map', 'victory'],
  act2Combat: ['act2Boss', 'map', 'elite'],
  act2Boss: ['map', 'victory'],
  act3Combat: ['act3Boss', 'map', 'elite'],
  act3Boss: ['victory', 'defeat'],
  elite: ['map'],
  paleOnes: ['map'],
  shadeDuel: ['map'],
  usurper: ['victory', 'defeat'],
  eighthOmen: ['map', 'elite'],
  unreadablePage: ['victory', 'vigil'],
  hollowLamplighter: ['map'],
  sealedDoor: ['map', 'vigil'],
  victory: ['title', 'vigil'],
  defeat: ['title', 'vigil'],
};
```

Task 13 must keep this production-core projection byte-for-byte equal after
deriving theme edges; a custom four-theme fixture is asserted separately and
never rewrites this frozen oracle. Separately characterise the live Map entry
warm call: current act combat/boss plus shared `elite`, `safeNodes` and
`hollowLamplighter`, with `eighthOmen` added only when active. That dynamic
current-theme warm set is not conflated with the registry's first-theme
look-ahead row.

- [ ] **Step 5: Expose read-only probe and presentation settle**

Add:

```js
behaviourTrace: ({ after = null, format = 'records' } = {}) =>
  trace.read({ after, format }),
queueIdle: () => !S.cb || S.cb.queue.length === 0,
settle: () => new Promise((resolve) => {
  const check = () => (!S.busy && (!S.cb || S.cb.queue.length === 0)
    && presentationBarrier.activeCount() === 0) ? resolve(true) : setTimeout(check, 16);
  check();
}),
```

`queueIdle()` reports only the engine queue fact. Existing Playwright helpers
keep calling `settle()`, which now additionally waits for `S.busy` and every
always-on presentation token. Trace integrity is asserted separately whenever
trace is enabled; trace status never controls the wait.

- [ ] **Step 6: Attach trace artifacts on every trace-enabled failure**

Create `test/e2e/trace-fixture.js`, extending Playwright's `test` with an
automatic page fixture. When `testInfo.status !== testInfo.expectedStatus`, it
calls `attachBehaviourTrace(page, testInfo)` for NDJSON and timestamped text and
attaches the returned `.ndjson` field as `application/x-ndjson` and `.text` as
`text/plain`. Trace, battle and all subsequent
trace-enabled Lab/input/presentation/P6 spec import `{ test, expect }` from this
fixture; no suite hand-writes its own failure hook.

- [ ] **Step 7: Verify green and commit**

Run:

```bash
npm test
UPDATE_TRACE_CONTRACTS=1 node tools/run-with-strict-e2e-port.mjs -- npx playwright test trace --project=desktop --workers=1
node tools/run-with-strict-e2e-port.mjs -- npx playwright test audio emberglass emberglass-persistence hollow-transaction trace battle --project=desktop --workers=1
node tools/run-with-strict-e2e-port.mjs -- npm run test:e2e:trace-production
```

The update command is permitted exactly once here, while `src/ui.js` is still
the instrumented DOM monolith and before Task 7 moves any owner. Inspect every
entry in the frozen Task 6 fixture manifest. Every subsequent task runs comparison-only mode; fixture updates
require a golden-contract revision, not an executor judgement.

Then:

```bash
git add src/ui.js src/ui/presentation-barrier.js src/audio-assets.js src/audio.js src/music.js \
  test/test_engine.js test/test_module_boundaries.mjs test/e2e/helpers.js \
  test/e2e/trace-fixture.js test/e2e/battle.spec.js test/e2e/audio.spec.js \
  test/e2e/emberglass.spec.js test/e2e/emberglass-persistence.spec.js \
  test/e2e/hollow-transaction.spec.js test/e2e/trace.spec.js \
  test/e2e/trace-production.spec.js playwright.trace-production.config.js \
  package.json package-lock.json \
  test/e2e/fixtures/trace/manifest.json \
  test/e2e/fixtures/trace/title-embark.json \
  test/e2e/fixtures/trace/opening-turn.json \
  test/e2e/fixtures/trace/targeted-play.json \
  test/e2e/fixtures/trace/drag-cancel.json test/e2e/fixtures/trace/art.json \
  test/e2e/fixtures/trace/pile-cycle.json \
  test/e2e/fixtures/trace/detached-ceremony.json \
  test/e2e/fixtures/trace/initial-run-save.json \
  test/e2e/fixtures/trace/usurper-purchase.json \
  test/e2e/fixtures/trace/shade-bequest-clear.json \
  test/e2e/fixtures/trace/hollow-payment.json \
  test/e2e/fixtures/trace/hollow-route-clear.json \
  test/e2e/fixtures/trace/terminal-outbox-retry.json \
  test/e2e/fixtures/trace/dawn-cursor-retry.json \
  test/e2e/fixtures/trace/dawn-final-clear-retry.json \
  test/e2e/fixtures/trace/dawn-resume-from-cursor.json
git commit -m "feat: trace real UI behaviour boundaries"
```

### Task 7: `[PE]` Extract context, commands and shared UI services

**Files:**
- Create: `src/ui/context.js`, `src/ui/policy.js`, `src/ui/format.js`,
  `src/ui/rose.js`, `src/ui/commands.js`, `src/ui/assets.js`,
  `src/ui/tooltip.js`, `src/ui/overlay.js`, `src/ui/navigation.js`,
  `src/ui/run-effects.js`
- Modify: `src/ui.js`
- Modify/Test: `test/test_engine.js`
- Test: `test/e2e/stage.spec.js`, `test/e2e/rewards.spec.js`,
  `test/e2e/trace.spec.js`, `test/e2e/emberglass.spec.js`,
  `test/e2e/emberglass-persistence.spec.js`,
  `test/e2e/hollow-transaction.spec.js`

**Interfaces:**
- Produces: the low-level modules and command façade from the target/state maps.
- Preserves: `show()` semantics, one `#screen`, stale-click clearing, persistence recovery and trace contracts.
- Review boundaries: 7A lands/reviews the DOM-free normal transaction seam
  while overlay/end/combat remain in the monolith; only then may 7B move shared
  DOM owners.

- [ ] **Step 1 (7A): Freeze and fail the normal transaction seam**

Run the complete Task 6 Phase-2 fixture manifest and the focused
`emberglass`, `emberglass-persistence` and `hollow-transaction` suites against
the monolith first; they must be green. Then add Node/source assertions for a
not-yet-created DOM-free `createRunEffects({engine,vigil})`, its exact exported
surface, and the one-owner inventory. Assert the normal adapter preserves
initial save, Usurper purchase, Shade bequest clear, Hollow payment/route,
terminal journal→finalise→commit and Dawn stage/cursor/final-clear ordering,
return shapes, retries and idempotence. Run `npm test`; expected RED is the
missing module/source owner only.

- [ ] **Step 2 (7A): Extract and delegate to `run-effects.js` before moving DOM owners**

Move only the dependency-injected transaction coordinator into Node-pure
`run-effects.js`. It owns the normal mutation/acknowledgement order and Dawn
queue construction; it owns no DOM, overlay, focus, inert state, retry UI,
screen rendering or Lab suppression yet. Leave `overlay.js`, end/combat
functions and all other shared owners physically in `src/ui.js`, but make their
mutation calls delegate to this reviewed seam. No transaction implementation
may remain duplicated in the monolith.

- [ ] **Step 3 (7A): Verify, review and commit the seam alone**

```bash
npm test
node tools/run-with-strict-e2e-port.mjs -- npx playwright test emberglass emberglass-persistence hollow-transaction trace --project=desktop --workers=1
npm run test:round5:standing -- --profile p1-dom
git add src/ui.js src/ui/run-effects.js test/test_engine.js \
  test/e2e/emberglass.spec.js test/e2e/emberglass-persistence.spec.js \
  test/e2e/hollow-transaction.spec.js test/e2e/trace.spec.js
git commit -m "refactor: extract the Phase 2 transaction seam"
```

A fresh spec reviewer and fresh quality reviewer must approve 7A before 7B.
Their package explicitly proves overlay/end/combat owners have not moved and
normal Phase-2 results are unchanged.

- [ ] **Step 4 (7B): Add a failing module-boundary smoke**

In `test/e2e/stage.spec.js`, evaluate after boot:

```js
const boundary = await page.evaluate(() => ({
  show: typeof window.spirebound.show,
  state: typeof window.spirebound.S,
  trace: typeof window.__probe.behaviourTrace,
}));
expect(boundary).toEqual({ show: 'function', state: 'object', trace: 'function' });
```

Also keep the reward stale-title-click regression green. Run the focused files
before moving code; they pass as characterisation. In Node, dynamically import
only the genuinely pure not-yet-created `format.js` and `commands.js` and assert
their exact export sets. For browser-owned `context.js`, `policy.js` and
`rose.js`, make `test_engine.js` parse their source exports without evaluating
them; do not add fake DOM guards to satisfy Node. In `stage.spec.js`, use Vite
browser imports after normal boot to assert the exact export set of all five
modules and invoke the real command handlers. Run `npm test`; expected
`ERR_MODULE_NOT_FOUND` for the pure modules or a missing-source assertion,
without altering/sabotaging production source.

- [ ] **Step 5 (7B): Create `context.js` and `commands.js`**

`context.js` alone exports the trace singleton and always-on presentation
barrier plus its other assigned bindings. `policy.js`, `format.js` and
`rose.js` each export only their own exact state-map bindings. `commands.js`
implements:

```js
const bound = Object.create(null);
export function bindUICommands(next) { Object.assign(bound, next); }
function call(name, args) {
  if (typeof bound[name] !== 'function') throw new Error(`UI command not bound: ${name}`);
  return bound[name](...args);
}
export const uiCommands = Object.freeze({
  show: (...args) => call('show', args),
  startCombat: (...args) => call('startCombat', args),
  renderHud: (...args) => call('renderHud', args),
  closeOverlay: (...args) => call('closeOverlay', args),
});
```

For the Task 7/8 transitional commits, the remaining `src/ui.js` monolith calls
`bindUICommands()` once with its live `show`, `startCombat`, `renderHud` and
overlay operations before any extracted module can invoke the facade. Add a
browser assertion that all four commands are bound and real handlers run. Task
9 moves that exact sole binding block to `ui/index.js` and removes it from the
thin re-export; no task boundary contains an unbound facade or two binders.

- [ ] **Step 6 (7B): Move the remaining shared owners mechanically**

Move, without rewriting, every binding listed for `assets.js`, `tooltip.js` and
`overlay.js`. Export only functions consumed outside the module. Replace direct
upward calls with `uiCommands`; do not duplicate a helper to avoid an import.

Keep the already-reviewed `run-effects.js` byte-identical. `overlay.js` alone
owns `persistenceDialogTransaction`, its retry modal, inert background and
focus trap, and delegates all mutation/acknowledgement calls downward. Source
checks prove the transaction seam still has one owner.

- [ ] **Step 7 (7B): Move navigation and preserve route semantics**

`navigation.js` owns `wipe`, `transitionSeq`, `transition` and `show`. Its
constructor receives a frozen route map:

```js
export function createNavigator({ routes, beforeShow, trace }) {
  return { show, transition };
}
```

`show()` must clear `screenEl().onclick` before dispatch, emit the existing
trace span and reject unknown route names with `error.ui` plus a thrown error.

- [ ] **Step 8 (7B): Run phase-applicable gates**

```bash
npm test
node tools/run-with-strict-e2e-port.mjs -- npx playwright test stage rewards emberglass hollow-transaction audio trace --project=desktop --workers=1
```

Expected: green and no screenshot changes.

- [ ] **Step 9 (7B): Review and commit the remaining shared services**

```bash
git add src/ui.js src/ui/context.js src/ui/policy.js src/ui/format.js \
  src/ui/rose.js src/ui/commands.js src/ui/assets.js \
  src/ui/tooltip.js src/ui/overlay.js src/ui/navigation.js \
  test/test_engine.js \
  test/e2e/stage.spec.js test/e2e/rewards.spec.js \
  test/e2e/emberglass.spec.js test/e2e/hollow-transaction.spec.js \
  test/e2e/audio.spec.js test/e2e/trace.spec.js
git commit -m "refactor: extract shared UI services"
```

### Task 8: `[PE]` Extract every non-combat screen as a leaf module

**Files:**
- Create: `src/ui/screens/title.js`, `embark.js`, `vigil.js`, `run.js`, `lamplighter.js`, `map.js`, `reward.js`, `rest.js`, `shop.js`, `event.js`, `end.js`, `gallery.js`, `audio-gallery.js`
- Modify: `src/ui.js`, `src/ui/navigation.js`, `src/ui/overlay.js`
- Test: `test/e2e/stage.spec.js`, `rewards.spec.js`, `visual.spec.js`,
  `trace.spec.js`, `audio.spec.js`, `emberglass.spec.js`,
  `emberglass-persistence.spec.js`, `hollow-transaction.spec.js`

**Interfaces:**
- Each file exports one `create*Screen(deps)` factory returning named render functions.
- Screens import only the matching shared
  `context/policy/format/rose/assets/tooltip/overlay/commands` modules; no
  screen imports `index.js`, `navigation.js`, another screen or Pixi.

- [ ] **Step 1: Freeze the route inventory in a failing assertion**

Add to `test/e2e/stage.spec.js`:

```js
expect(await page.evaluate(() => window.__probe.routes())).toEqual([
  'title', 'embark', 'vigil', 'lamplighter', 'hollow', 'map', 'combat',
  'reward', 'bossRelic', 'rest', 'treasure', 'shop', 'event', 'end',
  'gallery', 'audioGallery',
]);
```

Expected: FAIL because `routes()` is not yet exposed.

- [ ] **Step 2: Move screen functions according to the state map**

Move exact named function groups, retaining existing HTML and listeners. A
screen factory receives only the dependencies it calls; its return value is
frozen. Example:

```js
export function createTitleScreen({ context, assets, commands, vigil, music }) {
  function renderTitle() { /* existing body moved verbatim */ }
  return Object.freeze({ renderTitle });
}
```

Shared Rose asset/fallback state lives only in `rose.js`; title and Vigil keep
only their screen-local selection/layout state. `end.js` owns only Dawn
presentation state, panel rendering and cursor/final-clear acknowledgement;
durable outboxes remain engine-owned and all normal mutations delegate to
`run-effects.js`. Gallery lightbox state remains private to `gallery.js`.
`overlay.js` remains the sole persistence-dialog/focus/inert owner.

Move PR #16's browser call sites once, without moving or rewriting the pure
`music-resolve.js`: `navigation.js` owns central normal/Eighth/initial-Rose/
Hollow screen dispatch; `vigil.js` owns Rose/deeds tab switching; `map.js` owns
sealed-door open and map/Eighth restore; `end.js` owns Dawn event cue requests.
Task 9's `combat.js` retains pending-quest/current-omen resolution. Reward and
boss-relic modules deliberately make no screen-cue request. The frozen Task 6
audio/trace journeys must compare green after each move.

Move the complete PR #15 audio-gallery transaction atomically into
`screens/audio-gallery.js`, with injected audio-assets/audio/music dependencies:
unsaved draft preview, metadata-only POST, same-page apply, both cache
invalidations and active-cue re-resolution, with no reload. Preserve the
production read-only path. A screen extraction may not leave half of hot apply
in the orchestrator or silently convert draft preview to active selection.

- [ ] **Step 3: Build and expose the exact route map**

In the temporary `src/ui.js` orchestrator (moved without duplication to
`ui/index.js` in Task 9), construct the sole `Map` with the ordered names from
Step 1 and pass it to `createNavigator()`. `navigation.js` only dispatches the
injected map. Expose only the ordered keys through the probe.

- [ ] **Step 4: Verify zero visual/behaviour drift**

Run:

```bash
npm test
node tools/run-with-strict-e2e-port.mjs -- npx playwright test stage rewards emberglass hollow-transaction audio trace --project=desktop --workers=1
node tools/run-with-strict-e2e-port.mjs -- npm run test:e2e:visual
```

Expected: all current baselines match exactly; do not update snapshots.

- [ ] **Step 5: Commit**

```bash
git add src/ui.js src/ui/navigation.js src/ui/screens/title.js \
  src/ui/screens/embark.js src/ui/screens/vigil.js src/ui/screens/run.js \
  src/ui/screens/lamplighter.js src/ui/screens/map.js \
  src/ui/screens/reward.js src/ui/screens/rest.js src/ui/screens/shop.js \
  src/ui/screens/event.js src/ui/screens/end.js src/ui/screens/gallery.js \
  src/ui/screens/audio-gallery.js src/ui/overlay.js \
  test/e2e/stage.spec.js test/e2e/audio.spec.js \
  test/e2e/emberglass.spec.js test/e2e/emberglass-persistence.spec.js \
  test/e2e/hollow-transaction.spec.js
git commit -m "refactor: extract non-combat UI screens"
```

### Task 9: `[PE]` Extract combat, drain and probe; close P1

**Files:**
- Create: `src/ui/combat.js`, `src/ui/drain.js`, `src/ui/probe.js`, `src/ui/index.js`
- Replace: `src/ui.js` with thin re-exports
- Modify: `AGENTS.md`, `docs/README.md`, `test/e2e/helpers.js`
- Modify/Test: `test/test_engine.js`
- Modify: `test/simulator/assertions.mjs`, `test/simulator/run.mjs`
- Create: `test/simulator/trace-artifacts.test.mjs`
- Create: `docs/superpowers/artifacts/round5-p1-simulator-smoke/**`
- Test: full Node and Playwright kits

**Interfaces:**
- `src/ui.js` exports only `initUI` and `show` from `src/ui/index.js`.
- `combat.js` exports `startCombatUI`, `renderCombat`, `refitCombat`, semantic handlers and synchronisers.
- `drain.js` exports `drain` and accepts a frozen handler/dependency object.
- `probe.js` exports `installProbe({context, combat, navigator, trace})`.

- [ ] **Step 1: Write a failing public-surface assertion**

Add a Node source check to `test/test_engine.js`:

```js
{
  const source = readFileSync(new URL('../src/ui.js', import.meta.url), 'utf8');
  assert.match(source, /export \{ initUI, show \} from '\.\/ui\/index\.js';/);
  assert.ok(source.split('\n').length <= 5, 'src/ui.js stays a thin re-export');
}
```

Run `npm test`; expected FAIL against the remaining monolith.

Before changing the Simulator runner, add a failing pure test for trace failure
artifacts. For any trace-enabled journey, `finally` must execute
`behaviourTrace({format:'ndjson'})` and `behaviourTrace({format:'text'})` before
driver quit, write the returned `.ndjson` and `.text` fields beside the cell
JSON/screenshot, and record their paths/hashes even when a semantic assertion
failed. Non-trace P0.5 spike cells are
exempt. All Lab/production/screens profiles inherit this one implementation.

- [ ] **Step 2: Move combat and drain owners exactly once**

Use the P1 state map. Keep queue mutation solely in `drain.js`; keep layout,
input handlers and renderer synchronisation in `combat.js`. Pass callbacks for
victory/defeat/reward navigation so neither module imports screens or index.

- [ ] **Step 3: Move and harden the probe**

Move all readers/drivers to `probe.js`. Drivers must invoke the same exported
semantic handlers as real input; scenario shims remain limited to legal state
setup. Keep `queueIdle()` as the raw queue fact and `settle()` as the full
queue/busy/presentation-span barrier.

- [ ] **Step 4: Wire `index.js` and globals once**

`index.js` imports every leaf, constructs dependencies/routes, calls
`bindUICommands()`, and is the sole installer of:

```js
window.spirebound = { S, E, startCombatUI, show, meshEnabled, meshDebug, refitCombat };
window.__probe = installProbe(...);
```

It also owns keyboard/global listeners, HMR change hooks and gallery/editor boot
routing. Replace `src/ui.js` with:

```js
export { initUI, show } from './ui/index.js';
```

- [ ] **Step 5: Update the module graph docs in the same task**

Update `AGENTS.md` and `docs/README.md` to name the new modules, trace/probe
contracts and P1 completion. Do not alter unrelated guidance.

- [ ] **Step 6: Run the P1 gate**

```bash
npm test
npx vite build --outDir /tmp/spirebound-round5-p1 --emptyOutDir
node tools/run-with-strict-e2e-port.mjs -- npm run test:e2e
npm run test:simulator:smoke -- --surface dom --journey trace
git status --short
```

Expected: all tests pass, visual baselines remain byte-for-byte unchanged and
the tracked worktree is clean apart from declared Task 9 files. The temporary
build never writes `dist/`. Promote the representative iPhone 17 Pro portrait
and iPad mini landscape JSON/screenshots plus a SHA-256 manifest into the
declared P1 artifact directory before staging.

- [ ] **Step 7: Commit source/tests/docs, excluding `dist/`**

```bash
git add src/ui.js src/ui/combat.js src/ui/drain.js src/ui/probe.js \
  src/ui/index.js AGENTS.md docs/README.md test/e2e/helpers.js test/test_engine.js
git add docs/superpowers/artifacts/round5-p1-simulator-smoke
git add test/simulator/assertions.mjs test/simulator/run.mjs \
  test/simulator/trace-artifacts.test.mjs
git commit -m "refactor: decompose the UI behind stable contracts"
```

The task reviewer must report both zero visual drift and a complete state-owner
mapping before P2 starts.

---

### Task 10: `[PE]` Capture the immutable pre-registry behaviour oracle

**Files:**
- Create: `tools/capture-content-oracle.mjs`
- Create: `test/fixtures/round5-content-oracle-v1.json`
- Modify/Test: `test/test_engine.js`

**Interfaces:**
- Produces: the only valid before-move projection, enemy-AI schedule and monte-carlo digest.
- Consumes: the unmodified post-predecessor `src/data.js` and `src/engine.js`.

- [ ] **Step 1: Activate the P2 content-table freeze**

Append to `.superpowers/sdd/progress.md`: source SHA, `P2 content-table freeze:
ACTIVE`, owner `PE`, and allowed parallel changes `assets and planning only`.
Before each Task 10–15 commit, reject any concurrent content-table diff not
owned by this PE sequence. FE work remains disjoint.

- [ ] **Step 2: Add a failing fixture assertion before moving content**

Add to `test/test_engine.js`:

```js
{
  const oracle = JSON.parse(readFileSync(new URL('./fixtures/round5-content-oracle-v1.json', import.meta.url), 'utf8'));
  assert.equal(oracle.version, 1);
  assert.equal(oracle.contentExports.length, 28);
  assert.deepEqual(Object.keys(oracle.protocolExports), [
    'QUEST_STATES', 'QUEST_ACTIVE_STATES', 'TERMINAL_OUTCOMES', 'RUN_ID_RE',
  ]);
  assert.equal(oracle.enemyAi.length, Object.values(ENEMIES).filter((e) => e.ai).length);
  assert.equal(oracle.shadeAi.length, Object.values(SHADE_KITS).filter((e) => e.ai).length);
  assert.match(oracle.monteCarlo.sha256, /^[a-f0-9]{64}$/);
}
```

Run `npm test`; expected FAIL with `ENOENT`.

- [ ] **Step 3: Implement deterministic projection helpers**

`capture-content-oracle.mjs` imports all 32 named exports and exports an
import-safe `captureContentOracle()` function. Its CLI body runs only behind a
direct-execution guard; importing it from `test_engine.js` must write nothing and
must not inspect CLI arguments. Recursively sort object keys, preserve array
order, and omit function-valued fields entirely from the JSON projection. Reject
symbols, cycles and non-finite numbers. Hash canonical JSON with SHA-256.

Partition the fixture into 28 content views and a separate four-export protocol
leg. Canonicalise `RUN_ID_RE` exactly as `{source,flags}` and retain the exact
ordered values of `QUEST_STATES`, `QUEST_ACTIVE_STATES` and
`TERMINAL_OUTCOMES`. Tests exercise named valid and invalid run ids as well as
deep equality of all three arrays; protocol constants never enter a pack,
registry merge policy or custom content context.

Capture a descriptor inventory before reading values. The live monolith is
expected to contain exactly one schema-visible accessor,
`QUESTS.hollowLamplighter.target`; record its observable numeric value and its
path. Any second accessor is an oracle-capture failure. Task 12's candidate is
allowed one named descriptor transition at that path—from the legacy getter to
an enumerable own numeric data property with the same value—and no other
descriptor drift. Compare `Function#toString()` only for behaviour fields the
Task 11 schema explicitly declares as functions; ordinary data projection
never evaluates or serialises arbitrary functions.

For every enemy `ai` and every AI-bearing `SHADE_KITS` entry, derive
`moveKeys = Object.keys(def.moves)` and execute the full Cartesian schedule
`turn × last × prev × hpFrac × seed`, where turns are `[1,2,3,4,7]`, both
`last` and `prev` are `[null, ...moveKeys]`, HP fractions are `[1,0.49,0.1]`
and seeds are `[1,20260710]`. Assert the generated fixture contains every legal
move key in both history positions for that definition; invented generic
`attack`/`buff` history values are forbidden.

Build the canonical `self` through the real post-Phase2 combat constructor:
create a deterministic valid run, call `startCombat()` for the enemy or matching
own-shade variant with the run's `monument.shadeAspect` set to that kit, and take
its live combatant. For each case, retain the immutable `def` reference used by
the AI and deep-clone only mutable/data fields; the canonical JSON projection
omits functions inside `def` by the rule above. Do not call `structuredClone()`
on function-bearing definitions. The fixture therefore includes every live
field, including at least
`key`, `variantId`, `def`, `presentation`, `idx`, `name`, `hp`, `maxHp`,
`block`, `statuses`, `flags`, `lastMoves`, `moveKey`, `elite`, `boss`,
`facetMax` and `chips`. Set HP from `hpFrac`, history from the selected
`last`/`prev`, and retain any definition/variant presentation fields actually
created by Phase 2. Use a local seeded RNG that counts calls. Record returned
move, RNG call count/final state and the complete post-call `self`; any throw in
a valid scheduled context fails capture/check immediately and can never become
oracle data.

Add a named Sovereign mutation sequence outside the Cartesian cases. Starting
from a fresh live Sovereign below half HP, the first call must return `ascend`
and set `flags.ascended === true`; successive calls must increment `flags.p2`
and reach `annihilation` on the documented third phase-two turn. Capture and
compare every intermediate return value, complete self mutation and RNG state.
The test rejects an oracle missing this sequence or containing an unexpected
AI error.

- [ ] **Step 4: Capture the fixed engine digest**

Run 300 seeded agent runs with seeds `2026071000..2026071299`, recording only
terminal outcome, act, floor, HP, deck ids, relic ids and the engine RNG state.
Hash the ordered canonical array. Do not use wall clock or UI events.

- [ ] **Step 5: Generate and inspect the oracle once**

Run:

```bash
node tools/capture-content-oracle.mjs --write --expect-monolith
npm run test:ci
npm run test:progression
npm test
node tools/capture-content-oracle.mjs --check
npm run test:round5:standing -- --profile p2-base
```

`--expect-monolith` fails if `src/data.js` already imports `registry.js` or
`packs/`. Expected: tests and `--check` pass. Never use `--write` after the first
content table moves.

- [ ] **Step 6: Commit the before oracle**

```bash
git add tools/capture-content-oracle.mjs test/fixtures/round5-content-oracle-v1.json test/test_engine.js
git commit -m "test: freeze the pre-registry content oracle"
```

### Task 11: `[PE]` Implement the registry kernel, schemas and doctor

**Files:**
- Create: `src/registry.js`
- Create: `src/presentation-catalog.js`, `src/content-resources.js`, `src/ui/tokens.js`
- Modify/Test: `test/test_engine.js`

**Interfaces:**
- Produces: `definePack`, `createContentRegistry`, `createContentContext`,
  `themeById`, `themeForAct`, `isFinalTheme`, `CONTENT_SCHEMAS`,
  `MERGE_POLICIES`, `PROGRESSION_MERGE_POLICIES`, `doctorContent`,
  `formatContentReport`.
- `createContentRegistry(packs)` may assemble a partial registry for focused
  schema/merge tests. `createContentContext(packs, {
  id, resources = STATIC_REFERENCE_CATALOGUES })` requires the full
  engine surface and returns the frozen, versioned context accepted by P3;
  all derived legacy views come from that same assembly.
- Does not yet modify `src/data.js`.

- [ ] **Step 1: Write failing registry unit blocks**

Add tests covering:

```js
const sample = definePack({
  id: 'sample',
  cards: { sampleCard: {
    name: 'Sample', type: 'attack', rarity: 'common', cost: 1,
    target: 'enemy', vfx: 'slash', text: 'Deal @1@ damage.',
    effects: [{ kind: 'dmg', n: 1 }],
  } },
  enemies: { sampleEnemy: {
    name: 'Sample Enemy', hp: [1, 1], facets: 2,
    moves: { wait: { name: 'Wait', intent: 'buff' } }, ai: (_ctx) => 'wait',
  } },
});
const registry = createContentRegistry([sample]);
assert.equal(registry.cards.sampleCard.name, 'Sample');
assert.equal(registry.enemies.sampleEnemy.ai.length, 1);
assert.equal(Object.isFrozen(registry.cards), true);
assert.throws(() => createContentRegistry([sample, sample]), /duplicate pack.*sample/i);
const sample2 = definePack({ id: 'sample2', cards: { sampleCard: sample.cards.sampleCard } });
assert.throws(() => createContentRegistry([sample, sample2]), /duplicate.*sampleCard/i);
assert.throws(() => definePack({ id: 'bad', cards: { bad: { name: 'Bad' } } }), /cards\.bad/);
assert.throws(() => createContentContext([sample], {
  id: 'incomplete', resources: STATIC_REFERENCE_CATALOGUES,
}), /player|themes/i);
const report = doctorContent([sample], {
  ...STATIC_REFERENCE_CATALOGUES, assetManifest: new Set(),
});
assert.ok(report.problems.every((p) => p.packId && p.entryId && p.field && p.expected && p.hint));
```

Use a separate complete minimal theme fixture for theme-schema tests. It must
provide `legacyAct` plus all `plates`, `weather`, `palette`, `music`, `roster`,
`encounters`, `rewardGold` and `mapHaze` fields, and the test injects the referenced asset,
cue and token ids. Use a different deliberately invalid theme to assert the
aggregated problem list; never make the success fixture depend on unknown-key
warnings. Enemy behaviour schema accepts arity 1 here and in `_sample`.

Run `npm test`; expected `ERR_MODULE_NOT_FOUND`.

- [ ] **Step 2: Define the exact merge policies**

Export this frozen policy map:

```js
export const MERGE_POLICIES = Object.freeze({
  player: 'singleton', shop: 'singleton',
  cards: 'keyed-unique', statuses: 'keyed-unique', relics: 'keyed-unique',
  potions: 'keyed-unique', enemies: 'keyed-unique', events: 'keyed-unique',
  omens: 'keyed-unique', affixes: 'keyed-unique', arts: 'keyed-unique',
  deeds: 'keyed-unique', quests: 'keyed-unique', variants: 'keyed-unique',
  shadeKits: 'keyed-unique', boons: 'keyed-unique', themes: 'keyed-unique',
  aspects: 'append-unique-id', vows: 'append', whispers: 'append', questIds: 'append-unique',
  progression: 'nested-declared',
});
```

Also export:

```js
export const PROGRESSION_MERGE_POLICIES = Object.freeze({
  revealThresholds: 'keyed-unique',
  poolWaves: Object.freeze({
    definitions: 'keyed-unique',
    extensions: 'existing-key-explicit',
    members: 'append-unique',
    gateAssignment: 'globally-unique',
  }),
  features: 'keyed-unique-flatten',
});
```

A pack authoring input has exactly this nested shape:

```js
const coreProgression = {
  revealThresholds: { poolWave2: { runsPlayed: 2 } },
  poolWaves: {
    define: { poolWave2: { cards: ['executioner'], relics: ['reapersBell'] } },
    extend: {},
  },
  features: { emberglass: CORE_EMBERGLASS_OBJECT },
};
const expansionProgression = {
  revealThresholds: { expansionGate: { runsPlayed: 7 } },
  poolWaves: {
    define: { expansionGate: { cards: ['expansionCard'], relics: [] } },
    extend: { poolWave2: { cards: ['expansionCommon'], relics: [] } },
  },
  features: { expansionQuest: { enabled: true } },
};
```

`define` owns a new wave id; `extend` must name a wave defined by an earlier
pack and is the only legal way to append its cards/relics. A pack may add a
threshold/feature namespace or define a wave. Duplicate threshold/feature/wave
ownership, unknown/forward extension targets, duplicate members and assigning
one content id to two gates are errors. Tests cover the exact two-pack example,
two deterministic extensions to one wave and every collision.

Assembly removes the authoring wrappers and returns the legacy shape exactly:

```js
progression = {
  revealThresholds: { poolWave2: { runsPlayed: 2 }, expansionGate: { runsPlayed: 7 } },
  poolWaves: {
    poolWave2: { cards: ['executioner', 'expansionCommon'], relics: ['reapersBell'] },
    expansionGate: { cards: ['expansionCard'], relics: [] },
  },
  emberglass: CORE_EMBERGLASS_OBJECT,
  expansionQuest: { enabled: true },
};
```

`features` owns top-level progression namespaces and flattens them after the
reserved `revealThresholds`/`poolWaves` keys; core's unchanged Emberglass object
therefore remains `PROGRESSION.emberglass`, byte-equivalent to Phase 2, rather
than becoming `PROGRESSION.features.emberglass`. Reject reserved feature names.
Task 12 may wrap the verbatim nested object for pack authoring but may not alter
its contents; the 28-content-view oracle leg proves the assembled projection is exact.
`append-unique-id` preserves aspect order but rejects a duplicate aspect id
across packs; include that collision test.

`ACTS`, `ENCOUNTERS`, `REWARD_GOLD`, `REVEALS`, card/relic pools and
`POOL_GATE` become assembler-derived views and are not merge targets.
`REVEALS` is derived solely from merged
`PROGRESSION.revealThresholds` insertion order as `{id,trigger}` rows, matching
the predecessor exactly. A pack cannot submit a separate reveal table. Tests
prove parity and reject divergent/duplicate threshold ownership.

- [ ] **Step 3: Define schemas once**

`CONTENT_SCHEMAS` describes required primitive/object/array fields and
cross-references. Mark `enemy.ai` and event hooks `{ kind:'function', arity }`;
validate them but exclude them from serialisation/CRUD. Unknown keys append a
warning, never a failure. `definePack()` aggregates every error before throwing
one `ContentValidationError` whose `.problems` uses the doctor problem shape.

Except at a schema field explicitly declared `{kind:'function'}`, every
schema-visible property must be an own enumerable data property. Walk
`Reflect.ownKeys()` and inspect `Object.getOwnPropertyDescriptor()` before any
`Object.entries()` call or value read; a `get` or `set` descriptor is an
`accessor-not-allowed` error at that exact path and validation must never invoke
it. Function-valued data properties are rejected unless their schema field is
the declared behaviour hook.

`definePack()` performs one descriptor-first validation/snapshot walk: inspect
each descriptor, reject an accessor before dereferencing it, then recursively
copy mutable data into a fresh graph. Only schema-declared behaviour hooks keep
their original function identity; this is the explicit code contract, not a
general closure-backed configuration escape. Mutating the original authoring
object afterwards cannot change any copied data in the pack. `createContentRegistry()` and
`createContentContext()` recursively freeze every object and array leaf,
including nested `progression` and `quests`; strict-mode tests prove nested
writes throw. Add focused tests for caller-input mutation, progression/quest
leaf immutability, allowed behaviour functions and exact-path accessor
rejection without getter execution.

Schemas name reference **kinds** (`vfx-id`, `character-kind-id`,
`fallback-id`, `music-id`, `sfx-id`, `token-id`, `asset-id`, `variant-base`)
but never duplicate allowed ids. Create Node-pure `presentation-catalog.js`
with the current VFX/character/fallback id sets and `ui/tokens.js` with current
base token ids/values. Existing browser switch owners remain temporarily until
Task 13 consumes these catalogues. `createContentContext` and `doctorContent`
both call the same exported `validateContentReferences(registry, resources)`;
unknown card VFX, theme cue/token and variant base produce identical problem
codes/paths in boot and doctor tests. Content Manager subsequently uses that same
schema/context call.

`src/content-resources.js` exports frozen `STATIC_REFERENCE_CATALOGUES`, built
only from `presentation-catalog.js`, `audio-catalog.js` and `ui/tokens.js`.
It contains VFX, character-kind, structural-fallback, Music Cue, SFX and token
ids; variant bases come from the assembled registry itself. It deliberately
contains no raster inventory: production Node boot cannot inspect Vite's
`import.meta.glob`, and every physical art reference retains its labelled
fallback. Physical `category/id` existence is an additional doctor-only check
when Task 15's filesystem test or the DEV dashboard supplies `assetManifest`.
Add tests proving the static default has no DOM/filesystem/Vite dependency and
that only the full doctor reports a removed raster as `asset-missing` at its
schema path. Do not claim raster existence is a production-boot error.

The theme schema requires a `legacyAct` object with the exact compatibility
shape `{name,boss,bossName,theme:{sky,fog,particles,glow,accent,ember}}` in
addition to the new presentation/roster fields. `legacyAct` is the sole source
of `ACTS`; never attempt to reconstruct the six legacy theme values from new
palette token ids. The oracle proves those legacy values remain byte-identical.

- [ ] **Step 4: Implement deterministic registry assembly**

Validate pack ids, reject duplicate pack registration, merge in supplied pack
order according to the fixed policies, validate cross-references only after all
packs merge, derive keyed reveal arrays by `id`, and recursively freeze the
assembled public tables without freezing function objects.

The four `src/content-protocol.js` exports are platform/save grammar. They are
not keys in `MERGE_POLICIES`, are not accepted from a pack and are not fields
of a content registry/context. Add negative tests for attempted protocol
submission and an exact source assertion for that boundary.

`createContentRegistry()` returns the recursively frozen merged domains.
`createContentContext(packs, {
id, resources = STATIC_REFERENCE_CATALOGUES })` first requires every engine domain
and validates the injected Node-pure resource sets, then returns this
branded structural envelope (domain rows omitted here only for readability;
every policy domain is present):

```js
{
  contextVersion: 1,
  id,
  packIds,
  player, cards, cardPools, statuses, relics, relicPools, potions,
  enemies, events, rewardGold, shop, omens, affixes, arts,
  deeds, progression, reveals, poolGate, questIds, whispers, quests,
  shadeKits, variants, aspects, vows, boons,
  themes, themeOrder, acts, encounters,
}
```

`themeOrder` is the frozen declared pack order of theme ids; `acts` is
`themeOrder.map(id => themes[id].legacyAct)`, while `encounters` and
`rewardGold` are the matching ordered projections of each theme's encounters
and reward ranges. Card/relic pools and
`poolGate` are also derived here, not independently in `data.js` or a dev
loader. `themeById(context,id)`, `themeForAct(context,index)` and
`isFinalTheme(context,index)` are pure bounds-checked helpers; finality means
the last registered theme, so production Act 3 remains final while appending
the dev fourth theme makes it the new final theme without rewriting core data.
Require a non-empty stable `id`; reject a context whose theme, pool or cross-
reference derivation is incomplete. This makes the production assembler and
Lab registry the same shape and prevents a dev-only parallel lookup model.

- [ ] **Step 5: Implement the pure doctor**

`doctorContent(packs, resources)` returns:

```js
{
  ok: problems.every((p) => p.severity !== 'error'),
  summary: { packs, entries, errors, warnings },
  domains: {
    cards: {
      total, complete, problems: [],
      entries: [{
        id, packId, complete,
        badges: {
          art: { status, refs }, vfx: { status, refs },
          charMeta: { status, refs }, audio: { status, refs },
          pool: { status, refs },
        },
        links: { gallery, lab }, problems: [],
      }],
    }, /* every policy key */
  },
  problems: [{ severity, packId, domain, entryId, field, expected, actual, hint }],
}
```

Asset/audio completeness is computed from injected sets, keeping Node purity.
Every entry has the five fixed badges; an inapplicable badge is explicit
`status:'not-applicable'`, never omitted. Stable route descriptors power the
dashboard links without browser imports. Domain totals are derived from these
entry rows, so Task 18 does not recompute a parallel completeness model.
`formatContentReport(report)` creates the one stable per-domain text projection
used by `npm test` and the dev dashboard; neither consumer formats problems
independently.

- [ ] **Step 6: Verify, review and commit the registry kernel**

```bash
npm test
npm run test:round5:standing -- --profile p2-base
git add src/registry.js src/presentation-catalog.js src/content-resources.js \
  src/ui/tokens.js \
  test/test_engine.js
git commit -m "feat: add content registries and schema doctor"
```

### Task 12: `[PE]` Re-home the complete core pack without changing exports

**Files:**
- Create: `src/packs/core/player.js`, `cards.js`, `statuses.js`, `relics.js`, `potions.js`, `enemies.js`, `events.js`, `omens.js`, `arts.js`, `meta.js`, `progression.js`, `themes.js`, `index.js`
- Create: `src/content.js`
- Create: `src/content-protocol.js`
- Modify: `src/data.js`, `src/engine.js`
- Create: `tools/check-core-candidate.mjs`
- Modify: `tools/capture-content-oracle.mjs`
- Test: `test/test_engine.js`, oracle fixture

**Interfaces:**
- Produces: `CORE_PACK`, private full `CORE_CONTENT`, the engine-private
  run→content seam and the extracted immutable protocol module.
- Preserves: 28 content-view aliases plus four protocol re-exports: the exact
  32-name `src/data.js` surface.
- Review boundaries: Task 12A commits the complete candidate while `data.js`
  stays live; Task 12B first moves the engine seam against live data, then
  performs one atomic cut-over. Each subtask gets its own fresh spec/quality
  review before the next begins.

- [ ] **Step 1 (12A): Add the live-oracle comparison before moving the first table**

Import the already export-safe oracle helper and add:

```js
import { captureContentOracle } from '../tools/capture-content-oracle.mjs';

{
  const expected = JSON.parse(readFileSync(new URL('./fixtures/round5-content-oracle-v1.json', import.meta.url), 'utf8'));
  const actual = captureContentOracle();
  assert.deepEqual(actual.contentExports, expected.contentExports);
  assert.deepEqual(actual.protocolExports, expected.protocolExports);
  assert.deepEqual(actual.enemyAi, expected.enemyAi);
  assert.deepEqual(actual.shadeAi, expected.shadeAi);
  assert.equal(actual.monteCarlo.sha256, expected.monteCarlo.sha256);
}
```

Run `npm test`; expected PASS before the move, proving the comparison is wired.

Do not add the final cut-over assertion yet; `src/data.js` remains the live
monolith while candidates are compared independently.

- [ ] **Step 2 (12A): Copy and compare every candidate domain while live data stays green**

First create import-safe `tools/check-core-candidate.mjs`; `--all` initially
fails because the candidate files are absent. It imports live `src/data.js` and
one candidate module at a time, compares ordered canonical data, and compares
only schema-declared behaviour hooks by exact
`Function.prototype.toString()` plus the Task 10 deterministic AI schedule for
enemy/shade definitions. Theme comparison
uses only exact legacy ACTS/ENCOUNTERS/REWARD_GOLD projections while separately
validating the new required presentation fields. It never writes the oracle or
imports a candidate through `src/data.js`.

Before reading a candidate property, inspect its descriptor. The live
`QUESTS.hollowLamplighter.target` getter is the sole named exception: candidate
progression assembly must expose an own enumerable numeric data property with
the same observable value and no `get`/`set`. Reject every other accessor or
descriptor drift. The oracle compares `target === 5`, not getter source text.

Copy content according to this map, running the matching focused command after
each file:

Move content verbatim according to this map:

```text
player.js      PLAYER, SHOP
cards.js       CARDS
statuses.js    STATUS_INFO
relics.js      RELICS
potions.js     POTIONS
enemies.js     ENEMIES
events.js      EVENTS
omens.js       OMENS, AFFIXES
arts.js        ARTS
meta.js        DEEDS, ASPECTS, VOWS, BOONS
progression.js the Task 11 core progression authoring wrapper around verbatim
               revealThresholds/poolWaves/emberglass values; QUEST_IDS,
               WHISPERS, QUESTS, SHADE_KITS, VARIANTS
themes.js      the three complete theme records: exact ACTS rows under
               legacyAct; current ENCOUNTERS/REWARD_GOLD; and the existing
               plates/weather/lantern/palette/music/roster/map-haze values
               copied from their current production owners
```

Do not reformat function bodies in this task. Local imports between core files
may point downward only: progression may import enemy ids/constants; no pack
imports `src/data.js`.

In `progression.js`, declare the local core progression authoring object first,
then construct quests from it. Materialise
`hollowLamplighter.target =
coreProgression.features.emberglass.hollowLamplighter.completeAt` at assembly
time; no closure-backed getter survives. `src/packs/core/index.js` exports
`createCoreAuthoring(overrides = {})` and
`deriveCoreCouplings(authoring)`. The first returns a fresh mutable complete
policy-domain graph, deep-merges only the declared `progression`, `quests` and
`variants` override objects, calls the second, and never mutates module
singletons. `deriveCoreCouplings` re-materialises Hollow quest targets and
variant stat aliases from that graph. Production defines
`CORE_PACK = definePack({id:'core', ...createCoreAuthoring()})`; tuned tests call
the same API before `createContentContext()` freezes the result. Unknown
override domains/keys fail with exact paths.

```bash
node tools/check-core-candidate.mjs --domain player
node tools/check-core-candidate.mjs --domain cards
node tools/check-core-candidate.mjs --domain statuses
node tools/check-core-candidate.mjs --domain relics
node tools/check-core-candidate.mjs --domain potions
node tools/check-core-candidate.mjs --domain enemies
node tools/check-core-candidate.mjs --domain events
node tools/check-core-candidate.mjs --domain omens
node tools/check-core-candidate.mjs --domain arts
node tools/check-core-candidate.mjs --domain meta
node tools/check-core-candidate.mjs --domain progression
node tools/check-core-candidate.mjs --domain themes
```

After each candidate comparison, run the existing `npm test` with `src/data.js`
still untouched; it must remain green. A failed focused comparison is repaired
before the next candidate. No incomplete `CORE_CONTENT` is placed on the live
import path.

The new presentation fields are unused until Task 13 and therefore cannot
alter rendering in this move. They still must be complete enough for
`createContentContext()` now. Store palette references as the stable token ids
Task 13 will publish; keep the exact legacy numeric/hex values separately in
`legacyAct.theme` for the 28-content-view oracle leg.

- [ ] **Step 3 (12A): Define and validate the complete candidate context**

`src/packs/core/index.js` calls `definePack()` once with id `core` and the
policy-domain names from Task 11. Theme order is `act1`, `act2`, `act3`; each
theme receives its existing reward ranges verbatim. Create `src/content.js`
against this complete pack and run `node tools/check-core-candidate.mjs --all`;
it compares all 28 derived content views plus enemy/shade AI schedules against the
still-live monolith. The engine monte-carlo remains on the live monolith until
the atomic cut-over. Expected: green before cut-over.

- [ ] **Step 4 (12A): Commit the reviewed candidate without changing the live graph**

Run `npm run test:round5:standing -- --profile p2-base`, obtain fresh reviews
of the candidate projection, freeze/accessor rules and progression derivation,
then commit only the candidate/tool/test paths:

```bash
git add src/content.js src/packs/core/player.js src/packs/core/cards.js \
  src/packs/core/statuses.js src/packs/core/relics.js \
  src/packs/core/potions.js src/packs/core/enemies.js \
  src/packs/core/events.js src/packs/core/omens.js src/packs/core/arts.js \
  src/packs/core/meta.js src/packs/core/progression.js \
  src/packs/core/themes.js src/packs/core/index.js test/test_engine.js \
  tools/capture-content-oracle.mjs tools/check-core-candidate.mjs
git commit -m "refactor: assemble the frozen core content candidate"
```

`src/data.js` and `src/engine.js` remain byte-identical to their pre-12A forms
at this commit. A fresh reviewer confirms the production import graph has not
cut over.

- [ ] **Step 5 (12B): Write the run-bound and tuned-context failures before cut-over**

With live `data.js` still authoritative, add RED tests for two simultaneous
frozen contexts: exact core and a fresh tuned authoring clone. Apply overrides
to the clone, re-derive coupled Hollow quest targets and variant stat aliases,
then create/freeze the tuned context. Assert nested writes throw and neither
run observes the other's progression, quests, variants, cards or encounters.

Refactor the post-Phase-2 tunable-variation/save-bound tests away from mutating
global `PROGRESSION`/`QUESTS`/`VARIANTS`. Extract a pure explicit-content test
seam with this exact signature:

```js
export function _normaliseRunSnapshotForTest(raw, content) // canonical mutable run or null
```

It deep-copies `raw`, runs the same validation/additive migration used by
production against the explicit engine content view, never reads/writes
storage, and returns a normalised mutable run or `null`. `loadRun()` remains
zero-argument/core-only and calls the same private normaliser after reading
storage. No content/context/theme id enters the saved object.

Add failures for `newRun(seed,{ephemeral:true,content:tuned,...})`,
`contentIdFor(run)`, `isEphemeralRun(run)`, `cardData(inst,run)`, map and
encounter generation, combat creation, finality and save/stat no-op behaviour.
Unknown ids must fail before RNG consumption or run mutation. Normal core calls
and every strict `saveRun(...) === true` caller retain their current contract.
Run `npm test`; expected failure is only the absent run-bound engine seam or
immutable-tuning helpers.

- [ ] **Step 6 (12B): Move the engine content seam while live data remains authoritative**

At module scope in `engine.js`, create private `RUN_CONTENT` and
`EPHEMERAL_RUNS` weak collections plus `engineContentFor(run)`. Build the
frozen core engine view only from the 28 content imports already supplied by
`data.js`; `engine.js` continues importing `data.js` only and never imports
`content.js`, `registry.js` or a pack. Bind and mark a run before starter cards,
vows, omens or map generation can read content.

Replace every run-capable static table read with the matching explicit content
domain. `cardData(inst, run = null)` preserves the one-argument core contract;
`enemyMove(enemy)` still reads the definition attached by `startCombat()`.
`themeCount(run)` and `isFinalTheme(run)` use the run-bound context boundary.
Export only the stable semantic `contentIdFor(run)` and
`isEphemeralRun(run)` reads needed by UI/effects later. Core-only catalogue
calls remain enumerated in a source-test allowlist.

Marking a run ephemeral causes engine-owned persistence/stat writes to return
their exact predecessor success value without touching storage; normal
`pendingRunEnd`, Dawn cursor/final-clear, receipt and save validation paths stay
unchanged. The test-only snapshot seam accepts explicit frozen content, but
production `loadRun()` validates/hydrates only core and binds no custom
context. Run the full core/tuned isolation suite while `data.js` is still the
monolith; it must pass before alias cut-over.

- [ ] **Step 7 (12B): Observe one final red, then atomically cut over 28 views plus four protocols**

Now add the source assertion that `src/data.js` imports `CORE_CONTENT` from
`./content.js`, re-exports the four constants from `./content-protocol.js`,
exports exactly the 32-name inventory and contains no entity table literal/AI
function. Run `npm test`; expected FAIL only on that assertion
while the live oracle and `check-core-candidate --all` remain green. This is the
single intentional cut-over red.

`src/content.js` imports `CORE_PACK`, `createContentContext` and
`STATIC_REFERENCE_CATALOGUES`; it exports exactly
`CORE_CONTENT = createContentContext([CORE_PACK], {
id:'core', resources:STATIC_REFERENCE_CATALOGUES })`. It never imports a Vite
asset glob or scans the filesystem.
Move `QUEST_STATES`, `QUEST_ACTIVE_STATES`, `TERMINAL_OUTCOMES` and `RUN_ID_RE`
verbatim into Node-pure `content-protocol.js`. `src/data.js` imports the content
object, contains the exhaustive 28 named compatibility aliases, re-exports the
four protocol constants and exposes no default/33rd export. Alias the
registry-derived views:

```js
export const CARDS = CORE_CONTENT.cards;
export const CARD_POOLS = CORE_CONTENT.cardPools;
export const RELIC_POOLS = CORE_CONTENT.relicPools;
export const ACTS = CORE_CONTENT.acts;
export const ENCOUNTERS = CORE_CONTENT.encounters;
export const REWARD_GOLD = CORE_CONTENT.rewardGold;
export const REVEALS = CORE_CONTENT.reveals;
export const POOL_GATE = CORE_CONTENT.poolGate;
```

Keep the export names/order inventory in this plan. `src/engine.js` and every
consumer retain their existing `data.js` import boundary.

- [ ] **Step 8 (12B): Run the three-leg oracle after the atomic cut-over**

Run `node tools/check-core-candidate.mjs --all`, `npm test` and
`node tools/capture-content-oracle.mjs --check`. Leg one compares the 28
observable content views (including the named getter→numeric hardening
exception); leg two compares the four protocols, RegExp cases and exact export
set; leg three compares AI schedules and the monte-carlo digest. Also run
`npm run test:ci`, `npm run test:progression` and the `p2-base` standing
profile. Task 13 creates the act-coupling gate; Task 12 may not invoke a future
script. If one leg changes, repair the seam/candidate/cut-over;
never regenerate the oracle.

- [ ] **Step 9 (12B): Commit the engine seam and atomic live cut-over**

```bash
git add src/data.js src/content-protocol.js src/engine.js test/test_engine.js \
  tools/capture-content-oracle.mjs tools/check-core-candidate.mjs
git commit -m "refactor: cut the engine over to frozen run content"
```

Fresh reviewers must inspect both 12A..12B commits together and confirm: exact
32-export surface, no save-shape widening, no global tunable mutation, no
custom-content leakage, recursive freeze, and an unchanged Phase-2 terminal
transaction flow before Task 13 begins.

### Task 13: `[PE]` Extract theme consumers and enforce no act coupling

**Files:**
- Modify: `src/packs/core/themes.js`, `src/engine.js`, `src/scene3d.js`,
  `src/vfx.js`, `src/music-resolve.js`, `src/music.js`,
  `src/audio-catalog.js`, `src/ui/**/*.js`,
  `src/battlefield.js`, `src/dev/bf-editor.js`
- Create: `src/ui/content.js`
- Modify: `src/presentation-catalog.js`, `src/ui/tokens.js`
- Create: `tools/check-act-coupling.mjs`, `test/fixtures/act-coupling-allowlist.json`
- Modify: `package.json`, `test/test_engine.js`
- Modify/Test: `test/e2e/audio.spec.js`

**Interfaces:**
- Produces: registry-driven weather/music/plates/palette/roster/reward lookup,
  UI-owned `themeForRun(run)`, engine-owned `themeCount(run)`/
  `isFinalTheme(run)`, theme-record inputs for scene/VFX/music, and a static
  sweep gate.
- Preserves: legacy numeric `run.act` and existing save shape.

API placement is fixed: generic `themeById(context,id)`,
`themeForAct(context,index)` and `isFinalTheme(context,index)` live in
Node-pure `registry.js`; `data.js` exports the exhaustive 28 compatibility
content views plus the four protocol re-exports. `src/ui/content.js` imports
`CORE_CONTENT` from `content.js` and owns
`contentViewFor(run)`/`themeForRun(run)` for full presentation data. Because
`engine.js` may import only `data.js`, it owns one allowlisted private
engine-only boundary plus `themeCount(run)`/`isFinalTheme(run)`; it never
returns a presentation theme. UI resolves it and passes the record to
scene/VFX/music.

- [ ] **Step 1: Write failing fourth-theme and coupling checks**

Add a pure test that passes a four-theme context to the registry and asserts
`themeForAct(context, 3).id === 'sampleTheme'`, the fourth reward row resolves,
and `isFinalTheme(context, 3) === true`. In the same RED block call
`resolveCombatCue` with `{combat:'paleOnes',boss:'usurper'}` and no quest/omen;
assert monster→`paleOnes`, boss→`usurper`, elite→the shared `elite`, proving no
numeric act clamp/string construction remains. Task 12B has already made the engine
run-context aware; Task 14 supplies the first fully registered non-core engine
journey and fourth-theme advance/boss proof. Add package script:

```json
"test:act-coupling": "node tools/check-act-coupling.mjs"
```

Run it before creating the tool; expected command-not-found/module failure.

- [ ] **Step 2: Verify and freeze each complete theme record**

Each core theme contains exactly:

```js
{
  id, name, tagline,
  legacyAct: { name, boss, bossName,
    theme: { sky, fog, particles, glow, accent, ember } },
  plates: { backdrop, mid, ledge }, bossPlates: {},
  weather: { kinds, density, palette, velocity },
  lanternLights, palette: { tint, glow, haze },
  music: { map, combat, boss, victory },
  roster: { normal, elite, boss }, encounters,
  rewardGold: { normal, elite, boss }, mapHaze,
}
```

Use asset and Music Cue ids, never browser URLs.
Assert these Task 12 values project to the exact legacy `ACTS`, `ENCOUNTERS`
and `REWARD_GOLD` oracle; this task changes consumers, not theme values.

- [ ] **Step 3: Replace scattered act decisions**

Replace `act1-*` construction, weather arrays, palette branches, music act
switches, roster lookups and `Math.min(act, 2)` clamps with registry theme
lookups. `engine.js` continues importing only the `data.js` assembler surface
and centralises its one `ACTS.length` compatibility lookup in the named private
boundary; every other engine function calls the wrappers. Full theme lookup is
never reconstructed from `ACTS`.
`run.act` remains an index only at engine/save boundaries.

Replace `run.act >= 2`, scattered `ACTS.length` end checks and player copy such
as `3 acts` with the engine `isFinalTheme(run)`/`themeCount(run)` boundary.
Task 13 proves production Act 3 is final and preserves the Task 12B custom-
context-aware boundary. Task 14 proves that appending a fourth theme makes Act
3 advance instead.

Change the browser seams to accept a resolved theme record, not an act index:
scene3d receives its plates/palette/lantern data, VFX receives weather, and UI
passes the resolved theme Music record to music. `ui/content.js` supplies
`CORE_CONTENT` at P2; Task 16 adds an explicit ephemeral override. None of
those modules imports a dev pack or maintains its own act array. Fixed
three-act tower coordinates remain
the explicit scene/editor allowlist residue; an appended theme reuses the last
physical tower segment in this round without clamping its data/presentation.

Atomically change the pure PR #16 resolver from
`resolveCombatCue(kind, actIdx, opts)` to
`resolveCombatCue(kind, themeMusic, opts)`, where `themeMusic` contains
`combat` and `boss`. Preserve exact priority: recognised quest override
→ Eighth Omen when `kind !== 'boss'` → `themeMusic.boss` for boss,
the shared global `'elite'` cue for elite, otherwise `themeMusic.combat`.
Preserve
`QUEST_COMBAT_CUES`, `SCREEN_CUES`, `resolveScreenCue` and `dawnEventCue`; the
module retains exactly those five exports and stays Node-pure. `music.js`
re-exports them, `playForCombat` accepts the resolved theme Music record, and
`combat.js` passes `themeForRun(run).music`. A four-theme test uses registered
non-`actN` cue ids so the old clamp/string construction cannot accidentally
pass. Map/event use the resolved theme's `map` unless Eighth owns them; Dawn
starts from the resolved theme `victory` and retains `pageRead`/`act4Reveal`
overrides. Each Map entry explicitly warms the resolved current theme's
combat/boss cues plus shared `elite`, `safeNodes` and `hollowLamplighter`, and
adds `eighthOmen` only when active.

Delete `music.js`'s hard-coded theme-specific `WARM_WITH` rows. Export
`configureThemeMusic({ themes, themeOrder })`; derive every theme
combat→boss/map/shared-elite adjacency from that theme's `music` record.
Non-final boss cues warm their theme map and victory; the final theme boss warms
victory and defeat, with no map edge. `embark` and the shared map row warm the
first theme through `themeOrder`, never a cue-name prefix: in the production
graph `embark → map` and
`map → act1Combat,safeNodes,elite,hollowLamplighter`. Preserve PR #16's
semantic global graph exactly: title/embark/vigil,
Rose↔Vigil, safe nodes/map, elite/map, Pale/Own-Shade→map,
Usurper→victory/defeat, Eighth→map/elite, Unreadable Page→victory/vigil,
Hollow Lamplighter→map, Sealed Door→map/vigil, and victory/defeat→title/vigil.
No hard-coded semantic row contains a theme-specific cue id; generated
first-theme/per-theme edges may contain only ids read from theme records.
`ui/index.js` configures the graph once from `CORE_CONTENT`. A focused
`audio.spec.js` browser-module fixture calls `configureThemeMusic` with four
theme records using registered non-`actN` sample combat/boss ids, proves those
cues warm correctly without editing `music.js`, then reloads and reasserts the
frozen production-core graph.

Preserve PR #15 selection semantics and PR #16 selection policy through the
music-graph move.
`preview(cue, draftSelection)` remains a forced unsaved-preview path;
`invalidateMusicSelection()` hot-re-resolves the currently active logical cue
against the newly applied selection and rebuilt theme graph. Keep the Task 6
audio trace distinction and every `audio.spec.js` hot-preview/apply check in
the focused gate. `_raw` files remain excluded from inventory and bundle.
`public/audio-selection.json` remains any valid installed canonical gallery
Save output; no test pins v2 or clears its overrides.

Remove the old VFX archetype, enemy/character art-kind and structural fallback
id inventories after switching browser renderers to Task 11's Node-pure
`presentation-catalog.js`; it imports nothing. The schema validator, doctor and
browser now share those ids instead of maintaining parallel switch keys.

Complete the Task 11 Node-pure token API before switching a theme consumer:
frozen current
`BASE_COLOUR`, `BASE_TYPE`, `BASE_EASING`, a stable `TOKEN_IDS` set and
`createExperienceTokens(values)` validator/freezer. Add pure
`cssVariables(tokens)` with the one fixed `--r5-*` variable map and
`applyExperienceTokens(root,tokens)`, which accepts a style-bearing root without
top-level DOM access. `ui/index.js` calls it once on `document.documentElement`
at boot; CSS and Pixi consume the same values. Core theme palettes store token
ids, not duplicated raw colours. Source tests reject the exact Round 5 raw
colour/duration/easing literals in CSS. Do not transcribe the unapproved FE
Round 5 values yet; Task 21 adds the owner-approved `ROUND5_TOKENS` export and
switches the same injection call to it.

- [ ] **Step 4: Implement the static sweep**

Scan non-pack production JS for all of these families:

```js
[/\bact[1-9]\b/i,
 /\bact[1-9](?:Combat|Boss)\b/,
 /\b(?:run\.)?act\s*(?:===?|!==?|>=?|<=?)\s*\d+/,
 /\d+\s*(?:===?|!==?|>=?|<=?)\s*(?:run\.)?act\b/,
 /Math\.(?:min|max)\([^\n]*\bact\b[^\n]*,\s*\d+\)/,
 /\b(?:ACTS|ENCOUNTERS)\.length\b/,
 /\b(?:ACTS|ENCOUNTERS)\s*\[\s*(?:\d+|[^\]]*\bact\b[^\]]*)\]/,
 /\b[A-Za-z_$][\w$]*(?:\.[A-Za-z_$][\w$]*)*\s*\[\s*(?:run\.)?act\s*\]/,
 /\b(?:act|theme|weather|palette|haze|music|roster|encounter)\w*\s*\[\s*\d+\s*\]/i,
 /\b\d+\s+acts?\b/i,
 /\bAct\s+[1-9]\b/i,
 /\bswitch\s*\(\s*(?:run\.)?act\s*\)/]
```

Additionally tokenise array literals immediately indexed by `act`/`run.act`.
When an act switch is found, parse its body and report every
numeric `case`.
`tools/check-act-coupling.mjs --self-test` must accept neutral ids/save-boundary
assignments and reject fixtures for `run.act >= 2`, reversed comparisons,
`ACTS[0]`, `ENCOUNTERS[run.act]`, `WEATHER[act]`,
`['a','b','c'][run.act]`, named numeric palette/haze indices, min/max clamps,
length logic, camel cue keys such as `act2Boss`, player-facing `3 acts` and
`Act 3` copy and numeric switch cases.
Legal indexed run data such as
`run.omens[run.act]` is still reported and must have an explicit allowlist
reason/owner. Give every scanner family a stable `ruleId`; compare findings to
JSON rows keyed by `file`, `ruleId`, exact match and a SHA-256 of the
whitespace-normalised containing statement. Line/column are diagnostic output
only and never allowlist identity, so a mechanical line move in Task 16 cannot
stale the gate. A real statement change requires deliberate re-approval of its
context hash. Initial allowed
residue is limited to the named engine theme boundary, save migration/versioned
copy and fixed three-act tower geometry/editor coordinates in `scene3d.js`/
`src/dev/bf-editor.js`, each with `reason` and `owner`. Legal per-run arrays such
as omen history are enumerated,
not silently exempted. Stale allowlist entries fail.

The six immutable legacy cue-id fields in `audio-catalog.js` are the only
camel-key residue and each gets an exact allowlist row whose reason is
`immutable saved audio-selection key` and owner is `audio-catalog`. No use copy
is allowlisted. Replace the eight affected `use` strings exactly while keeping
ids/titles/wiring unchanged:

```text
act1Combat → Ashen Woods normal fights
act1Boss → Ashen Woods boss — Rootheart
act2Combat → Sunken City normal fights
act2Boss → Sunken City boss — Leviathan
act3Combat → Astral Court normal fights
act3Boss → Astral Court boss — Eternal Sovereign
sealedDoor → Sealed summit door / act4Reveal Dawn
victory → Non-final boss ceremony and final run victory / end(won)
```

`audio.spec.js` asserts all eight exact strings and the six unchanged ids.
Asset README historical authorship prose is documentation, not scanned
production JS.

- [ ] **Step 5: Verify and commit**

```bash
npm test
npm run test:act-coupling
node tools/check-act-coupling.mjs --self-test
node tools/run-with-strict-e2e-port.mjs -- npx playwright test geometry stage audio --project=desktop --workers=1
git add src/packs/core/themes.js src/engine.js src/scene3d.js src/vfx.js \
  src/music-resolve.js src/music.js src/audio-catalog.js \
  src/battlefield.js src/dev/bf-editor.js \
  src/presentation-catalog.js src/ui/context.js src/ui/index.js \
  src/ui/content.js src/ui/tokens.js src/ui/assets.js src/ui/overlay.js \
  src/ui/navigation.js src/ui/combat.js src/ui/drain.js \
  src/ui/screens/title.js src/ui/screens/embark.js \
  src/ui/screens/vigil.js src/ui/screens/run.js src/ui/screens/lamplighter.js \
  src/ui/screens/map.js src/ui/screens/reward.js src/ui/screens/rest.js \
  src/ui/screens/shop.js src/ui/screens/event.js src/ui/screens/end.js \
  src/ui/screens/gallery.js src/ui/screens/audio-gallery.js \
  package.json package-lock.json tools/check-act-coupling.mjs \
  test/fixtures/act-coupling-allowlist.json test/test_engine.js \
  test/e2e/audio.spec.js
git commit -m "refactor: resolve acts through theme registries"
```

### Task 14: `[PE]` Add the isolated dev/test sample pack and fourth-theme fixture

**Files:**
- Create: `src/packs/_sample/index.js`, `src/packs/_sample/card.js`, `enemy.js`, `theme.js`
- Create: `src/packs/dev.js`
- Modify/Test: `test/test_engine.js`

**Interfaces:**
- Produces: `SAMPLE_PACK`, `createDevRegistry({sample:true})`; no production registration.
- Consumes: Task 12B's generic ephemeral engine content-context seam.
- Consumed by: Task 16's UI presentation binding, Content Lab Task 17 and
  registry tests. P2 proves both assembly and engine isolation; UI remains out
  of scope until P3.

- [ ] **Step 1: Write failing isolation, context and engine-behaviour tests**

Assert the production registry has no `sampleCard`, `sampleEnemy` or
`sampleTheme`; a dev registry has all three; `ACTS` production length remains
three; the dev context has `themeOrder.at(-1) === 'sampleTheme'`; and the sample
theme's one encounter resolves its enemy and registered Music Cue fallback.
Drive the context through the real Task 12B engine seam and assert: sample
`newRun`, starter deck/map, encounter roll, combat creation, `enemyMove`, boss
resolution and finality all use the sample context; Act 3 is non-final and
advances to theme index 3; theme index 3 is final. Hold a core run beside it and
prove both remain isolated. Assert engine-owned run-save/stat/terminal-journal
writes are success-shaped no-ops. This engine-only proof must not invoke a UI,
Vigil, Dawn or bequest route; Task 16A extends the already extracted
`run-effects` boundary and proves those remaining effects are suppressed. UI
rendering is deliberately not claimed in this task.

- [ ] **Step 2: Implement the exact fixture content**

```js
export const sampleCard = {
  name: 'Test Spark', type: 'attack', rarity: 'common',
  cost: 1, target: 'enemy', vfx: 'slash', chip: 1,
  text: 'Deal @3@ damage. Chip 1 extra Facet.',
  effects: [{ kind: 'dmg', n: 3 }],
};
export const sampleEnemy = {
  name: 'Test Pane', hp: [12, 12], facets: 2,
  art: { kind: 'wisp', hue: 180, size: 0.8 },
  moves: { wait: { name: 'Wait', intent: 'block', block: 1 } },
  ai: (_ctx) => 'wait',
};
```

The sample theme uses existing Act 1 plate ids and the already-registered
non-`actN` cue ids `map` (map), `paleOnes` (combat), `usurper` (boss) and
`victory`, with one normal roster entry and one encounter. Tests call the
ordinary resolver with no quest/omen override and require `paleOnes`/
`usurper`, so the old three-act clamp cannot pass by coincidence. It supplies a valid fourth reward row
`{normal:[1,1],elite:[1,1],boss:[1,1]}`, a complete `legacyAct` row named
`Test Gallery` whose boss is `sampleEnemy`, and every required theme field. It
adds no runtime assets.

- [ ] **Step 3: Keep the production graph clean**

Only `src/packs/dev.js`, tests and DEV-only dynamic imports may import
`_sample`. Add a source assertion in `test_engine.js` that production
`src/data.js` does not contain `_sample`.

`createDevRegistry({sample:true})` calls
`createContentContext([CORE_PACK,SAMPLE_PACK], {
id:'dev:_sample', resources:STATIC_REFERENCE_CATALOGUES })`; with
`sample:false` it returns the complete core dev context. It does not hand-merge
derived pools/themes/rewards. Reject unknown option keys so adding a fixture
cannot silently alter the production graph.

Use the existing Task 12B `newRun(...,{ephemeral:true,content})` and explicit
theme/aspect/omen id options. Do not add another engine registry, global active
context or sample-specific branch. Exercise simultaneous core/sample runs in
both call orders so a module-global current context cannot pass accidentally.

- [ ] **Step 4: Verify and commit**

```bash
npm test
npm run test:act-coupling
node tools/capture-content-oracle.mjs --check
npx vite build --outDir /tmp/spirebound-round5-p2-sample --emptyOutDir
npm run test:round5:standing -- --profile p2
git add src/packs/_sample/index.js src/packs/_sample/card.js \
  src/packs/_sample/enemy.js src/packs/_sample/theme.js src/packs/dev.js \
  test/test_engine.js
git commit -m "test: add the isolated sample content pack"
```

### Task 15: `[PE]` Close P2 registry equivalence, doctor and documentation

**Files:**
- Modify: `test/test_engine.js`, `AGENTS.md`, `docs/README.md`
- Create: `docs/superpowers/reports/2026-07-10-round5-p2-registry-evidence.md`
- Create: `test/simulator/theme-profile.test.mjs`
- Modify: `test/simulator/assertions.mjs`, `test/simulator/run.mjs`
- Modify: `src/ui/probe.js`
- Create: `docs/superpowers/artifacts/round5-p2-simulator-smoke/**`

**Interfaces:**
- Produces: P2 evidence: three-leg equality, 100% core doctor, deep-frozen
  no-accessor core, tuned-context variation, sample engine isolation, act sweep
  the exact 32-export list, and PR #16's five-export/22-live-cue contract on a
  theme-record resolver with no three-act clamp.

- [ ] **Step 1: Add one aggregate P2 assertion**

Build `resourceManifest` in the Node test from a recursive `readdirSync()` of
`src/assets/`, normalised to the same `category/id` keys used by the registry;
take `vfxIds`, `characterKindIds` and structural `fallbackIds` from
`presentation-catalog.js`; construct `musicIds` and `sfxIds` from the Node-pure
catalogues in `audio-catalog.js`, and `tokenIds` from `ui/tokens.js`. Import
`CHAR_META` from Node-pure `char-meta.js` and inject its ids plus the documented
default-fallback policy for valid hero/enemy ids. The doctor also verifies pool membership or
an explicit schema-level no-pool declaration. The test runs
`doctorContent([CORE_PACK], resourceManifest)` and requires zero errors and every
domain `complete === total`. It imports all 32 names, asserts the 28 content
views and four protocol constants form exactly the inventory in this plan, and
proves protocol values remain outside every pack/context domain.

Re-run the strict deep-freeze, no-accessor, authoring-input snapshot and tuned-
context derivation assertions from Tasks 11–12. The core context must contain
no schema-visible accessor; the materialised Hollow target retains the Phase 2
numeric value. Exercise simultaneous core/sample engine runs and both tuned
save-validation projections. A P2 report may not claim equivalence from an
assembly-only sample.

Re-run the Task 6/13 Music contract: exactly five `music-resolve.js` exports,
22/22 live catalogue rows, quest/Eighth/boss priority, Rose/Hollow/Dawn/summit
screen mappings, reward/boss-relic no-request hold and a non-`actN` fourth
theme. The source and act-coupling sweep reject the old numeric clamp or cue
construction. Update `AGENTS.md`'s module graph to place `music-resolve.js`
below browser-only `music.js`; it imports no audio, trace, DOM or stage module.

Assert `CORE_CONTENT` was compiled with the exact static catalogue categories;
the physical `assetManifest` is doctor/test-only. In a negative fixture remove
one live card VFX id and one theme music id: both
`createContentContext` and `doctorContent` must report the same stable problem
code, entry and field; the Manager schema exposes the same reference kind.
In a separate negative fixture remove one raster `category/id`: only the doctor
reports `asset-missing` at the same schema path and runtime fallback remains
valid. Neither schema nor a UI module carries an independent id enum.

Print `formatContentReport(report)` from `test_engine.js` so the command-line
doctor and Task 18 dashboard consume the same report/projection. Add a source
assertion that `src/data.js`, `src/registry.js` and `src/packs/core/**` contain no
HMR accept handler: pack edits deliberately fall through to Vite's full-page
reload, so no live-run or exported-object identity is promised.

Add a failing pure `theme-profile.test.mjs` for an exact three-theme result per
cell and a browser test/source assertion for a not-yet-created
`__probe.stageCoreTheme({ themeId, seed })` driver. Run the focused tests;
expected: missing driver/profile support.

- [ ] **Step 2: Implement the bounded core-theme Probe/profile contract**

Extend `installProbe` with `stageCoreTheme({themeId,seed})`, available only on
the existing QA Probe surface. It validates `themeId` against the injected
`CORE_CONTENT.themeOrder`, creates a normal core run through real `newRun`, sets
the validated numeric `run.act` as legal scenario setup before regenerating its
map, selects the first registered normal encounter for that theme, and enters
combat through the existing real `startCombatUI` handler. It returns only
semantic theme/plate/weather/music/enemy ids. It cannot accept a dev/custom
context, arbitrary enemy definitions or mutate content tables. This is an
extension of the existing Probe battle setup, not a second engine path.

Add the `themes` journey to `test/simulator/run.mjs`; it calls that driver, then
uses real card and End Turn handlers. The pure profile test requires the exact
theme order from the runner result and rejects a missing/duplicate row.

- [ ] **Step 3: Commit, review and push the immutable P2 capture source**

```bash
npm test
npm run test:act-coupling
node tools/run-with-strict-e2e-port.mjs -- npx playwright test geometry stage audio --project=desktop --workers=1
node --test test/simulator/theme-profile.test.mjs
npm run test:round5:standing -- --profile p2
git add src/ui/probe.js test/test_engine.js \
  test/simulator/theme-profile.test.mjs test/simulator/assertions.mjs \
  test/simulator/run.mjs
git commit -m "test: add the P2 theme Simulator profile"
git push -u origin codex/round5-production-engineering
test -z "$(git status --short)"
```

Obtain fresh QA approval of this source/harness commit. Use `apply_patch` to
append `P2 Simulator capture source: <actual HEAD>` to the ignored ledger.

- [ ] **Step 4: Run the complete P2 gate and capture actual Safari**

Reload `P2_SIM_SOURCE_SHA` from the ledger in the same shell and require it
equals clean `HEAD`.
Run:

```bash
P2_SIM_SOURCE_SHA=$(sed -n 's/^P2 Simulator capture source: //p' \
  .superpowers/sdd/progress.md | tail -1)
test -n "$P2_SIM_SOURCE_SHA"
test "$(git rev-parse HEAD)" = "$P2_SIM_SOURCE_SHA"
npx vite build --outDir /tmp/spirebound-round5-p2 --emptyOutDir
node tools/run-with-strict-e2e-port.mjs -- npm run test:e2e
npm run test:simulator:smoke -- --surface dom --journey themes
npm run test:round5:standing -- --profile p2
```

Expected: all pass; the committed oracle file remains unchanged.

The Simulator journey runs exactly the smoke cells (iPhone 17 Pro portrait and
iPad mini landscape). In each visible actual-Safari cell it uses legal Probe
scenario setup to visit all three registered production themes, starts one real
normal encounter per theme and verifies theme id/index, resolved backdrop/mid/
ledge ids or labelled fallback, weather semantic snapshot, requested combat
Music Cue/fallback, one real card play and End Turn, expected stage shape and
zero trace drops/errors/orphans. The pure profile test proves all three theme
rows are mandatory and normalises only semantic ids; no screenshot inference
or physical performance claim passes this gate.

- [ ] **Step 5: Write evidence/current docs and release the freeze**

Record commit range, exact commands/output summaries, export inventory, doctor
counts, allowlisted act residue and sample isolation. Update `AGENTS.md` module
graph and `docs/README.md` to mark P2 complete; explain deliberate page reload
on pack edits (no object-identity-preserving HMR in this round).

Promote both cells' JSON, screenshot, timestamped text and NDJSON plus a
source-SHA/path/bytes/SHA-256 manifest into the declared P2 artifact directory.
The report links those committed relative paths and records the observed Safari
version/build and `functional-compatibility-only` claim. Require its `sourceSha`
equals `P2_SIM_SOURCE_SHA`, not the subsequent evidence commit.

Only after the full P2 gate, artifact inspection and fresh QA review pass,
append the closing SHA and
`P2 content-table freeze: RELEASED` to the execution ledger. If the gate is red,
leave it ACTIVE and fix P2; do not let another content edit cross the boundary.

- [ ] **Step 6: Commit the evidence-only closure**

```bash
P2_SIM_SOURCE_SHA=$(sed -n 's/^P2 Simulator capture source: //p' \
  .superpowers/sdd/progress.md | tail -1)
test -n "$P2_SIM_SOURCE_SHA"
test "$(git rev-parse HEAD)" = "$P2_SIM_SOURCE_SHA"
npm run test:round5:standing -- --profile p2
git add AGENTS.md docs/README.md \
  docs/superpowers/reports/2026-07-10-round5-p2-registry-evidence.md \
  docs/superpowers/artifacts/round5-p2-simulator-smoke
git commit -m "test: close the content registry equivalence gate"
```

---

### Task 16: `[PE]` Bind ephemeral presentation/effects and add the pure Lab URL codec

**Files:**
- Modify: `src/ui/run-effects.js`, `src/ui/content.js`, `src/ui/assets.js`,
  `src/ui/navigation.js`, `src/ui/index.js`,
  `src/ui/combat.js`, `src/ui/drain.js`, `src/ui/overlay.js`,
  `src/ui/tooltip.js`, `src/ui/screens/embark.js`, `src/ui/screens/map.js`,
  `src/ui/screens/run.js`, `src/ui/screens/lamplighter.js`,
  `src/ui/screens/reward.js`, `src/ui/screens/rest.js`,
  `src/ui/screens/shop.js`, `src/ui/screens/event.js`, `src/ui/screens/end.js`
- Create: `src/dev/lab-scenario.js`
- Modify/Test: `test/test_engine.js`
- Create/Test: `test/e2e/content-context.spec.js`

**Interfaces:**
- Consumes the reviewed Task 12B engine seam: `newRun(...,{ephemeral:true,
  content,...})`, `contentIdFor`, `isEphemeralRun`, run-bound card/map/combat
  lookup and engine-owned storage/stat no-ops. Task 16 does not reimplement or
  widen that seam.
- `bindRunContent(run, content)`/`contentViewFor(run)`/`themeForRun(run)` live
  in `src/ui/content.js`. They return the imported full `CORE_CONTENT` for a
  normal run or the explicitly bound full custom context for an ephemeral run.
- Active-run UI resolves cards, enemies, relics, potions, omens, affixes, arts, statuses
  and themes through `contentViewFor(run)`, never a mutable global registry.
- `isEphemeralRun(run)` is the sole read path for terminal UI/meta suppression.
- The existing P1 `createRunEffects({ engine, vigil })` stays the sole UI
  transaction adapter and gains success-shaped ephemeral suppression for every
  terminal/Vigil/Dawn/Hollow/Shard/bequest effect. It never creates a second
  terminal route.
- `encodeLabScenario`, shape-only `decodeLabScenario`,
  `validateLabScenario(scenario, content)`, `encodeReplayDescriptor` and
  `decodeReplayDescriptor` are Node-pure.

- [ ] **Step 1 (16A): Write failing UI-binding and effects-isolation tests**

Build `createDevRegistry({sample:true})` and first re-run the green Task 12B/14
engine assertions; a failure there returns to P2 instead of being repaired in
the UI. Create a sample run, call `bindRunContent(run, dev)` immediately after
`newRun`, and assert `contentIdFor(run) === 'dev:_sample'`,
`contentViewFor(run) === dev`, `themeForRun(run).id === 'sampleTheme'`,
and every active-run UI table/asset/theme read resolves the dev context. Assert
a non-ephemeral binding throws, a normal run's UI view is the exact imported
`CORE_CONTENT`, and simultaneous core/sample runs remain isolated in both call
orders. Preserve every one-argument core engine/UI caller already proven in
P2.

Use sentinel run-save, stats and Vigil stores and exercise victory, Fall,
abandon, terminal receipt, Dawn staging/cursor/final-clear, Hollow/Shard
recovery, bequest write and bequest consumption through `run-effects.js`;
every sentinel remains byte-identical and every return has the normal caller-
compatible success shape. The corresponding normal-run journeys preserve the
post-Phase-2 call order, retry/idempotence behaviour and exact mutations. Add a
source assertion that all UI calls to terminal/Vigil/stats/Dawn/Hollow/Shard/
bequest mutators occur only inside `run-effects.js`.

Run `npm test` and the new `content-context.spec.js`; expected RED is missing UI
binding/suppression, never a changed engine/save assertion.

- [ ] **Step 2 (16A): Bind presentation content and extend the one effects boundary**

Extend `ui/content.js` with a private `RUN_PRESENTATION_CONTENT` WeakMap.
`bindRunContent` requires an engine-marked ephemeral run and matching
`contentIdFor(run)`, then binds the exact same recursively frozen context.
`contentViewFor` returns that object or imported `CORE_CONTENT`; it never asks
the engine for full presentation definitions and never reads a save field.

Update every active-run UI lookup to use the explicit view, including HUD
relics, cards, potions/statuses, omen/art labels, reward/deck rows, enemy/
variant presentation, scene plates, audio cues and finality copy. Add a source
inventory for all post-P1 modules. `content-context.spec.js` uses Vite browser
imports to create/bind simultaneous core/sample runs and invokes the real pure
card/theme/asset resolvers without assigning `S.run`, adding a hidden route or
hard-coding sample ids in production. Actual sample screen/combat rendering is
the Task 17 Lab journey. Core-only title/gallery catalogue reads stay only in
the named allowlist.

Extend—not replace—the P1 `run-effects.js`. For an ephemeral run, every
run/meta effect returns a frozen success-shaped diagnostic without calling
storage, Vigil or stats; terminal completion returns a Lab-result descriptor
for Task 17 instead of entering Dawn/Fall/bequest presentation. Normal paths
retain the exact journal→finalise→commit and Dawn queue sequence. `overlay.js`
remains the sole retry/focus/inert dialog owner.

- [ ] **Step 3 (16A): Verify, review and commit UI/effects isolation**

```bash
npm test
node tools/run-with-strict-e2e-port.mjs -- npx playwright test content-context emberglass hollow-transaction trace --project=desktop --workers=1
npm run test:round5:standing -- --profile p2
git add src/ui/run-effects.js src/ui/content.js src/ui/assets.js \
  src/ui/navigation.js src/ui/index.js src/ui/combat.js src/ui/drain.js \
  src/ui/overlay.js src/ui/tooltip.js src/ui/screens/embark.js \
  src/ui/screens/map.js src/ui/screens/run.js src/ui/screens/lamplighter.js \
  src/ui/screens/reward.js src/ui/screens/rest.js src/ui/screens/shop.js \
  src/ui/screens/event.js src/ui/screens/end.js \
  test/e2e/content-context.spec.js test/test_engine.js
git commit -m "feat: isolate ephemeral Lab presentation and effects"
```

Fresh reviewers must confirm there is one normal/ephemeral transaction owner,
no save-shape field, and no P2 engine seam duplicated in UI before 16B.

- [ ] **Step 4 (16B): Write the failing canonical codec tests**

Test this exact scenario round-trip:

```js
const scenario = {
  v: 1, mode: 'combat', seed: 20260710, aspectId: 'duskblade',
  themeId: 'act1', kind: 'normal', omenId: 'thinGlass',
  enemies: [
    { id: 'sporeling', variantId: null },
    { id: 'duskfang', variantId: 'paleDuskfang' },
  ],
  deck: [{ id: 'strike', up: false }, { id: 'defend', up: false }],
  hand: [{ id: 'strike', up: false }],
};
assert.deepEqual(
  validateLabScenario(decodeLabScenario(encodeLabScenario(scenario)), core),
  scenario,
);
```

Also round-trip a sample scenario containing `themeId:'sampleTheme'`,
`sampleEnemy` and `sampleCard`: it passes against the dev context and fails
against core with all unknown ids reported. `decodeLabScenario` rejects
duplicate query keys, more than four enemies, more than 60 deck ids, scenarios
over 8192 serialised bytes, replay payloads over 4096 serialised bytes and any
schema version other than 1; it does not silently validate against imported
core tables. `validateLabScenario` is the sole semantic-id check and aggregates
every unknown/mismatched id against its explicit content argument.

Stage both core and sample climb scenarios through `newRun` and assert
`aspectId` selects the registered starting aspect/deck before any card is made,
`omenId` occupies the selected act slot before map/combat setup, `themeId`
selects the correct numeric act, and the fixed seed produces the same map on
URL reload. Unknown/mismatched ids fail before RNG or run mutation. The legacy
numeric `opts.aspect` and normal rolled-omen path retain exact parity.

Each enemy row is exactly `{ id, variantId:null|string }`. A non-null variant
must exist in `VARIANTS` and have `base === id`; own-shade variants are the one
declared special case `{ id:'shade', variantId:'ownShade1|2|3' }` where
`base === 'hero'`. Staging passes `variantId ?? id` to the real combat command.

- [ ] **Step 5 (16B): Implement canonical URL codecs**

Sort object/query keys deterministically while preserving every array's semantic
order; encode JSON payloads with base64url; deep-copy/freeze decoded values.
Decode only the bounded versioned shape; validate semantic ids in a second
explicit pass against the caller-supplied frozen content context. Task 17 must
create/import that context before accepting or staging a pasted URL.
Replay descriptor shape is:

```js
{
  v: 1,
  kind: 'card-flight',
  subject: { kind: 'card', contentId: 'strike', upgraded: false },
  parameters: { destination: 'discard', motion: 'full' },
  endState: { destination: 'discard', visible: false },
}
```

It contains no command, engine state, DOM/Pixi data or save snapshot.

- [ ] **Step 6 (16B): Verify, review and commit the pure codec**

```bash
npm test
npm run test:act-coupling
node tools/capture-content-oracle.mjs --check
npx vite build --outDir /tmp/spirebound-round5-p3-context --emptyOutDir
node tools/run-with-strict-e2e-port.mjs -- npm run test:e2e
npm run test:round5:standing -- --profile p2
git add src/dev/lab-scenario.js test/test_engine.js
git commit -m "feat: add the bounded Lab scenario codec"
```

The fresh 16B review checks deterministic ordering, size/version limits,
explicit-context validation and that replay descriptors cannot encode commands,
engine/save state or auto-run behaviour. Task 17 depends on both reviewed 16A
and 16B commits.

### Task 17: `[PE]` Build Content Lab, replay preview and live trace transcript

**Files:**
- Create: `src/ui/dev/lab.js`, `src/ui/dev/replay-preview.js`, `test/e2e/lab.spec.js`
- Create: `tools/verify-production-surface.mjs`
- Create: `test/simulator/lab-profile.test.mjs`, `docs/superpowers/artifacts/round5-p3-simulator-smoke/**`
- Modify: `test/simulator/assertions.mjs`, `test/simulator/run.mjs`, `src/main.js`,
  `src/ui/commands.js`, `src/ui/index.js`, `src/ui/probe.js`,
  `src/ui/behaviour-trace.js`, `test/test_engine.js`

**Interfaces:**
- `?lab=1&scenario=<base64url>&replay=<base64url>` launches a dev-only ephemeral scenario.
- Lab uses probe drivers and public `newRun` options only.
- Replay renders an immutable presentation fixture in an isolated host and never mutates `S.run`/`S.cb`.

- [ ] **Step 1: Write failing Lab e2e**

Test URL round-trip, one real card play, trace transcript
copy, replay URL update, reload hydration without auto-run, and manual replay
producing a fresh `presentation.replay-preview` span. Seed the run-save, stats
and Vigil localStorage keys with sentinel bytes; force both Lab win and Lab loss
journeys and require all three values to remain byte-for-byte identical.

With no `scenario` query, assert Lab renders a registry-driven scenario editor
whose controls cover mode, numeric seed, every registered aspect, theme, omen,
combat kind, zero-to-four ordered enemy rows (base plus compatible variant),
ordered starting deck and ordered starting hand. Options and labels come from
the active frozen content context, never hard-coded ids. Drive the UI itself to
select Ashwarden, a non-default core theme, `thinGlass`, a normal fight,
`duskfang` with `paleDuskfang`, a custom deck and a custom opening hand. Click
`Start sandbox`; assert the canonical `scenario` URL is written, decode/validate
equals the form state exactly, Probe shows the selected variant/theme/omen and
the visible hand matches order. Reload must hydrate every control from that URL
and auto-stage that valid scenario exactly once through the same start path;
only `replay=` hydration is forbidden from auto-running. With no `scenario`, or
after the user edits the hydrated form, an explicit Start action is required.
Reordering or removing a card/enemy must produce a distinct canonical URL and
round-trip.

Add a pasted-URL journey for `paleDuskfang` that round-trips the row's
`variantId`, stages through the real probe/start-combat driver and asserts Probe
reports `{ key:'duskfang', variantId:'paleDuskfang' }`; reject a variant whose
registry `base` does not match its row.

In a separate climb-mode journey, load `_sample` through the dev-only registry,
generate its map, verify sample weather and Music Cue fallback, select its one
node through the real probe driver, start the registered sample encounter and
place `sampleCard` in the real hand, play it against `sampleEnemy`, assert the
3-damage/chip result, and complete one floor. Probe must report only the frozen
semantic content summary
`{contextId:'dev:_sample',themeId:'sampleTheme',themeIndex:3,themeCount:4}`;
it never exposes registry rows or behaviour functions. No production file may
branch on `sampleTheme`, `sampleEnemy` or `sampleCard`.

Add a pure failing Simulator profile test for `--surface dom --journey lab`:
it opens the same encoded Lab URL, proves trace integrity/replay hydration and
uses only public Probe drivers. It also requires inherited NDJSON/text failure
artifact paths in the normalised cell result.

Key assertions:

```js
await page.goto('/?lab=1&scenario=' + encoded);
await page.waitForFunction(() => window.__probe?.state().screen === 'combat');
expect((await page.evaluate(() => window.__probe.behaviourTrace())).enabled).toBe(true);
expect(await page.evaluate(() => localStorage.getItem('spirebound_save_v2'))).toBeNull();
await page.evaluate(() => window.__probe.play(window.__probe.state().hand[0].uid, 0));
await page.waitForFunction(() => new URL(location.href).searchParams.has('replay'));
const incomingReplay = await page.evaluate(() => new URL(location.href).searchParams.get('replay'));
await page.reload();
await page.evaluate(() => window.__probe.settle());
expect(await page.locator('[data-lab-replay]')).toBeEnabled();
expect(await page.locator('[data-replay-preview]')).toBeEmpty();
expect(await page.evaluate(() => new URL(location.href).searchParams.get('replay'))).toBe(incomingReplay);
```

Then trigger the next real user card-flight beat and assert only that new beat
changes the replay query. Decode both values and prove the reload preserved the
incoming descriptor byte-for-byte until publication was armed.

- [ ] **Step 2: Verify red**

```bash
node tools/run-with-strict-e2e-port.mjs -- npx playwright test lab --project=desktop --workers=1
```

Expected: FAIL because the route is absent.

- [ ] **Step 3: Add the DEV-only route and scenario staging**

In `main.js`, dynamically import Lab only when `import.meta.env.DEV &&
qs.has('lab')`. Lab first dynamically imports `createDevRegistry` and creates
`createDevRegistry({sample:true})`; only then does it decode the bounded shape,
call `validateLabScenario(raw, content)`, and pass that exact content plus
`ephemeral:true`/`themeId`/`aspectId`/`omenId` to `newRun`; it then calls
`bindRunContent(run, content)` before any UI render/probe stage and asserts the
semantic context ids match. A pasted sample URL is therefore never validated
against core by accident. Lab calls
`initStage/initScene/initVfx/initMesh/initUI`, then uses probe scenario drivers
to stage enemies/deck/hand and to play the real `sampleCard`. Add only the
minimum god controls named in the spec: HP, energy, embers and add-card.

Before staging, render the scenario editor from registry rows using stable
`data-lab-*` controls. Variant choices are filtered by the selected base enemy,
with the declared own-shade exception; deck/hand editors preserve order and
allow an independently authored opening hand within the Task 16 codec bounds.
`Start sandbox` gathers the form into the exact Task 16
schema, validates against the active context, canonicalises with
`encodeLabScenario`, writes the URL with `history.replaceState`, and only then
stages the run. A valid URL scenario hydrates the same editor/model and
auto-invokes that exact staging path once; no second parser or staging path
exists. Validation errors remain in the editor with stable
field paths and do not consume RNG or mutate a run.

Bind one optional `showLabResult(descriptor)` command in `commands.js`/
`index.js`; Task 16's terminal owner calls it only when `run-effects.finish()`
returns an ephemeral descriptor. Lab renders that visual result in its isolated
host. No end-screen module owns or repeats persistence suppression, and normal
runs follow the unchanged command/route path.

- [ ] **Step 4: Publish replay descriptors at presentation owners**

`behaviour-trace` records an optional bounded `replay` field only on replayable
presentation span starts. On settled end in Lab mode, call one injected
`onReplayable(descriptor)` callback; Lab writes it with
`history.replaceState()`. Normal mode passes no callback and never changes URL.

At boot, decode/deep-freeze any incoming `replay=` before scenario hydration and
set `replayPublicationArmed = false`. Opening/draw spans from URL scenario
auto-staging still emit trace/replay descriptors but the callback cannot replace
the query. After the scenario and presentation barrier settle, hydrate the
button from the original descriptor and only then arm publication. Thus replay
never auto-runs or gets overwritten by boot; the next user-triggered replayable
beat may replace it normally. Add strict tests for missing/invalid incoming
replay and for the exact byte-preservation/next-beat transition above.

- [ ] **Step 5: Render replay in isolation**

`replay-preview.js` accepts only descriptor data, creates a detached/contained
preview layer, resolves `kind` through a fixed presentation-factory map and
disposes it. It cannot import engine, context state or persistence. Unsupported
`kind` disables the button with stable reason `unsupported-presentation`.

- [ ] **Step 6: Add the production-surface verifier**

`tools/verify-production-surface.mjs` builds to a fresh temporary directory,
resolves every emitted chunk from `index.html`/manifest and fails on
`__content-save`, `Content Lab`, `_sample`, `data-dev-shell`,
`data-content-doctor`, `contentedit` or an explicit dev-only chunk marker. It
never reads tracked `dist/`. Add a Node source test that requires all forbidden
markers to remain in the verifier's list.

- [ ] **Step 7: Commit and push the immutable Lab capture source**

```bash
npm test
node tools/run-with-strict-e2e-port.mjs -- npx playwright test lab trace --project=desktop --workers=1
node tools/verify-production-surface.mjs
npm run test:round5:standing -- --profile p3
git add src/main.js src/ui/dev/lab.js src/ui/dev/replay-preview.js \
  src/ui/commands.js src/ui/index.js src/ui/probe.js src/ui/behaviour-trace.js \
  tools/verify-production-surface.mjs test/e2e/lab.spec.js test/test_engine.js \
  test/simulator/lab-profile.test.mjs test/simulator/assertions.mjs \
  test/simulator/run.mjs
git commit -m "feat: add the trace-driven Content Lab"
git push -u origin codex/round5-production-engineering
test -z "$(git status --short)"
```

Use `apply_patch` to append `P3 Lab capture source: <actual HEAD>` to the ignored
ledger. This source commit contains the exact Lab runtime, editor, trace and
Simulator profile; evidence may not point to Task 16 or an unstaged tree.

- [ ] **Step 8: Capture and commit Simulator evidence only**

Reload `LAB_CAPTURE_SOURCE_SHA` from the ledger, require it equals current
`HEAD`, then run:

```bash
LAB_CAPTURE_SOURCE_SHA=$(sed -n 's/^P3 Lab capture source: //p' \
  .superpowers/sdd/progress.md | tail -1)
test -n "$LAB_CAPTURE_SOURCE_SHA"
test "$(git rev-parse HEAD)" = "$LAB_CAPTURE_SOURCE_SHA"
npm run test:simulator:smoke -- --surface dom --journey lab
```

Promote the two representative Simulator JSON/screenshots, timestamped text and
NDJSON plus a manifest whose `sourceSha` equals `LAB_CAPTURE_SOURCE_SHA` and
whose path/byte/SHA-256 rows cover every file. Run the `p3` standing profile
again without modifying source, obtain fresh QA approval of the raw/evidence
package, then commit only:

```bash
git add docs/superpowers/artifacts/round5-p3-simulator-smoke
git commit -m "test: record the Content Lab Simulator smoke"
```

### Task 18: `[PE]` Add the content doctor dashboard and dev launcher

**Files:**
- Create: `src/ui/dev/doctor.js`, `test/e2e/dev-tools.spec.js`
- Optional create: `src/ui/dev/shell.js`
- Modify: `src/main.js`

**Interfaces:**
- `?dashboard=1` renders the mandatory pure doctor report; optional `?dev=1` links every existing editor/gallery/Lab route.
- No dev-tool module enters a production bundle.

- [ ] **Step 1: Write failing route tests**

Record `Task 18 dev shell: SHIPPED` or `OMITTED (optional pressure valve)` in
the ledger before writing tests. The dashboard is never optional.

Assert the dashboard renders every registry domain with total/complete badges,
problem links, gallery preview and Lab launch. If the ledger marks the shell
`SHIPPED`, also assert the dev shell links
`gallery`, `audio`, `bfedit`, `bfuiedit`, `charedit`, `vfxedit`, `lab`,
`dashboard` and `contentedit` without renaming existing URLs.

- [ ] **Step 2: Verify red**

Run `node tools/run-with-strict-e2e-port.mjs -- npx playwright test dev-tools
--project=desktop --workers=1`; expected FAIL.

- [ ] **Step 3: Implement thin views over existing pure APIs**

Dashboard imports `doctorContent` and resource manifests; it never redefines a
schema. When shipped, Shell is a static route list with availability labels.
Both use structural icons from `art.js`, not font glyphs. If omitted, do not
create a stub route or file; record the omission and continue.

- [ ] **Step 4: Implement and run the production-surface verifier**

```bash
node tools/verify-production-surface.mjs
```

Expected: the Task 17 verifier still rejects every dev marker from the temporary
production build.

- [ ] **Step 5: Verify and commit**

```bash
npm test
node tools/run-with-strict-e2e-port.mjs -- npx playwright test dev-tools --project=desktop --workers=1
node tools/verify-production-surface.mjs
git add src/main.js src/ui/dev/doctor.js test/e2e/dev-tools.spec.js
if test -f src/ui/dev/shell.js; then git add src/ui/dev/shell.js; fi
git commit -m "feat: add registry doctor developer tools"
```

### Task 19: `[PE]` Add the optional schema-driven Content Manager

**Files:**
- Create: `src/dev/content-serialize.js`, `src/ui/dev/content-manager.js`, `test/e2e/content-manager.spec.js`
- Modify: `vite.config.js`, `src/main.js`, `package.json`, `package-lock.json`,
  `playwright.config.js`, `test/test_engine.js`

**Interfaces:**
- `?contentedit=1` edits cards/relics/potions/themes only.
- `POST /__content-save` accepts `{ v:1, packId, domain, order, entries }`, same-origin DEV only.
- Behaviour fields are absent/read-only; validation occurs before atomic write.

- [ ] **Step 1: Record the pressure-valve decision**

Default to `SHIPPED`. If schedule/risk requires the golden omission, append
`Task 19: OMITTED (optional pressure valve)` plus reason and PE head to the
ledger, make no Task 19 file change, and continue directly to Task 20. This is
not a blocker or prefix exit.

- [ ] **Step 2: Write pure serialiser tests first**

In `test/test_engine.js`, assert stable key order, round-trip of a card/theme,
rejection of `ai`/functions, invalid ids, path traversal and schema failures.
The serialised module must be deterministic and end with one newline.
Include an unknown non-function extension key: schema warns, the Manager shows
it read-only/raw, and serialise→parse→serialise preserves it byte-for-byte.
Warned extension data may never disappear merely because no generated form
control owns it.

- [ ] **Step 3: Write the failing disk e2e**

Mirror `bfeditor.spec.js`: copy the target pack source, open Content Manager,
change a temporary card description, save, verify disk content and registry
validation, and restore the original bytes plus remove any owned `.tmp.mjs` in
`finally`. Run once with one worker.
Record the original SHA-256 and require the restored SHA-256, exact bytes and
clean absence of `.tmp.mjs` before the test reports success.

- [ ] **Step 4: Implement stable serialisation and endpoint**

Allow only `core` and domains `cards`, `relics`, `potions`, `themes`; require
version 1, unique `order` ids matching `entries`, and a body no larger than 1
MiB. Resolve through an explicit domain→file map, never a user path. Serialise
and schema/registry-compile the structured `entries` in memory first. Then write
the candidate beside its target as `file.tmp.mjs`, import it through a
cache-busted file URL, build a fresh candidate `CORE_PACK` with that imported
domain explicitly substituted for the live module, compile a complete
`createContentContext()` and run the doctor before atomic rename to the real
`.js` path. Do not validate by re-importing cached `packs/core/index.js`, which
would silently compile the old domain. A source/unit assertion proves the
replacement module's values are the ones observed by candidate compilation.
Preserve the submitted
top-level entry order and schema field order. On error, delete only the
`.tmp.mjs`, leave source bytes unchanged and return structured 400/500.

Reject accessors before reading values and reject every function field in the
four editable domains unless its schema explicitly marks it read-only (none is
editable). The endpoint accepts only own enumerable data properties and the
same bounded JSON-safe primitives as the registry; it cannot smuggle a getter,
prototype key, import expression or executable source into the generated
module.

- [ ] **Step 5: Build forms from `CONTENT_SCHEMAS`**

Render required/optional fields, types, enum options and warnings from the
schema. Omit every `{kind:'function'}` control. The view owns no duplicated
field list.

- [ ] **Step 6: Add the serial disk script**

Add:

```json
"test:e2e:content-disk": "playwright test content-manager --project=content-manager-disk --workers=1"
```

and a matching one-worker Playwright project.

- [ ] **Step 7: Verify and commit**

```bash
npm test
node tools/run-with-strict-e2e-port.mjs -- npm run test:e2e:content-disk
test -z "$(find src/packs/core -name '*.tmp.mjs' -print -quit)"
npm test
node tools/verify-production-surface.mjs
git status --short
git add src/dev/content-serialize.js src/ui/dev/content-manager.js src/main.js \
  vite.config.js package.json package-lock.json test/e2e/content-manager.spec.js \
  test/test_engine.js playwright.config.js
git commit -m "feat: add the schema-driven Content Manager"
```

### Task 20: `[PE]` Extend CI for trace, registries, WebKit and Simulator labels

**Files:**
- Modify: `package.json`, `package-lock.json`, `playwright.config.js`,
  `.github/workflows/ci.yml`, `.github/workflows/perf.yml`,
  `.github/workflows/update-baselines.yml`,
  `tools/ci-contract.mjs`, `test/test_ci_contract.mjs`,
  `test/test_module_boundaries.mjs`
- Create: `.github/workflows/simulator-safari.yml`
- Modify: `AGENTS.md`, `docs/README.md`

**Interfaces:**
- Produces: Playwright WebKit emulation on iPhone 17 Pro/iPad Mini; serial disk tools; manual self-hosted Simulator lane.
- Does not claim Playwright WebKit is Simulator Safari.

- [ ] **Step 1: Add failing config assertions to the existing CI contract**

Extend `test/test_ci_contract.mjs`—not the engine self-check—to read the
config/workflows and assert project
names `iphone-webkit`, `ipad-webkit`, package script `test:e2e:webkit`, CI install
contains `chromium webkit`, and Simulator workflow uses labels
`[self-hosted, macOS, spirebound-simulator]`. Also require
`test:e2e:update` to name exactly `desktop`, `portrait` and `landscape`; adding
any WebKit/dev-tool project must never widen canonical snapshot generation.
Import `e2eServerSettings` and assert an explicit port yields strictPort command,
127.0.0.1 origin and `reuseExistingServer:false`.

Scan every workflow shell line after Task 5: any executable `playwright test`,
`npm run test:e2e*` or browser-backed capture command must use
`tools/run-with-strict-e2e-port.mjs` in the same invocation, except the
Simulator runner which owns its separate isolated server. This test initially
fails on the existing bare Linux `update-baselines.yml` capture.

Keep `tools/ci-contract.mjs` as the executable source of truth. Extend its
`FULL_E2E_LANES` with `e2e-webkit` and assert the stable aggregate gates remain
named exactly `unit` and `e2e`. Add module-boundary checks only to
`test/test_module_boundaries.mjs`; do not duplicate CI topology in
`test_engine.js`.

- [ ] **Step 2: Add WebKit projects and script**

Use Playwright's exact descriptors:

```js
import { defineConfig, devices } from '@playwright/test';
// projects additions
{ name: 'iphone-webkit', use: { ...devices['iPhone 17 Pro'], browserName: 'webkit' } },
{ name: 'ipad-webkit', use: { ...devices['iPad Mini'], browserName: 'webkit' } },
```

Add:

```json
"test:e2e:webkit": "playwright test trace stage lab --project=iphone-webkit --project=ipad-webkit --workers=1 --no-deps",
"test:e2e:update": "playwright test visual --update-snapshots --project=desktop --project=portrait --project=landscape --workers=1 --no-deps"
```

Before the first local WebKit test, run `npx playwright install webkit` once
and record the installed Playwright/browser revision. This is a visible local
prerequisite, not a test and not a password flow. The Linux baseline workflow
continues installing only the Chromium browser it captures because the update
script is now project-locked.

- [ ] **Step 3: Extend the current parallel Linux topology without replacing it**

Preserve the post-Phase-2 topology exactly: all relevant Draft/Ready/`main`
changes run `unit-tests` and `build-dist` in parallel; Draft PR e2e mode runs
Chromium smoke, while Ready PRs and `main` run `e2e-disk`, random agent (3
shards), main (10 shards), `e2e-serial` and visual (desktop, portrait,
landscape). Add one separate `e2e-webkit` job, one worker, running the two
semantic projects. Add it to `FULL_E2E_LANES`, the aggregate `e2e` job's
`needs`/result map and no other required check; `unit` and `e2e` stay the only
stable required names.

Install `chromium webkit`; keep ffmpeg 8.1 in the npm/unit lane and retain all
committed-dist/clean-checkout checks. If Task 19 shipped, run content-disk
sequentially inside `e2e-disk` after the existing disk test, with its own fresh
server; optionality must not create a dynamic aggregate lane. Add new
source/config paths to `paths-filter`. Upload behaviour NDJSON/text with existing
failure artifacts.

Change `update-baselines.yml`'s local capture step to exactly
`node tools/run-with-strict-e2e-port.mjs -- npm run test:e2e:update`. Task 24
later adds its manifest writer around this already-isolated command; it must not
be the first task to repair the port contract. Tasks 5–19 never dispatch the
manual baseline workflow; Task 20 must land before Task 24 performs its first
Round 5 dispatch.

Invoke the shared strict-port wrapper immediately around **each** top-level
Playwright command in the same step/command invocation:

```bash
node tools/run-with-strict-e2e-port.mjs -- npm run test:e2e:webkit
```

Never persist one `GITHUB_ENV` port across commands; the config's strict bind
prevents a race from becoming stale-server reuse.
After the production build, run `node tools/verify-production-surface.mjs` as a
standing CI gate; archive its failure report with other diagnostics.

Keep `.github/workflows/perf.yml`'s existing valid-measurement verifier.
`test_ci_contract.mjs` must reject any CI source that turns the 55fps/22ms
reference thresholds into an assertion or non-zero exit. Missing/wrong-tier/
non-finite/zero/no-frame/browser/application-error measurements still fail;
valid misses emit `PERF_WARNING`. Deterministic bundle bytes, exact WebGL owner
count and texture/cache allocation invariants remain hard gates.

- [ ] **Step 4: Add the separately labelled manual Simulator workflow**

`simulator-safari.yml` is `workflow_dispatch` only, runs on
`[self-hosted, macOS, spirebound-simulator]`, uses one concurrency slot and
invokes the runner-owned isolated server. Its validated workflow inputs are
`surface` (`dom` initially; Task 24 adds/defaults `production`), `journey` and
`matrix`; it runs serially, uploads `test-results/simulator/`, and names every
artifact `functional-compatibility-only`. It is not a Linux required check and
contains no physical-performance wording. Its first executable step runs the
Task 4 GUI/awake/unlocked preflight and stops before device mutation on failure;
workflow text says it cannot wake or unlock the self-hosted Mac.

Provisioning/registration of that GitHub runner and repository label is an
owner-controlled external prerequisite, not something this plan silently
does. Before any dispatch, query the repository runner API and require exactly
one online runner carrying all three labels:

```bash
gh api repos/fol2/roguecardv2/actions/runners --paginate \
  --jq '[.runners[] | select(.status=="online") | .labels|map(.name)]'
```

If none exists, do not dispatch a workflow that will queue forever. Record
`Simulator workflow: CONFIGURED, AWAITING OWNER-PROVISIONED RUNNER`; keep using
the local Simulator full gate and make no CI-run claim. Once provisioned, the
owner explicitly authorises dispatch. No token, password or machine login is
requested by an agent.

- [ ] **Step 5: Update operational docs**

Document the two browser lanes, serial rule, visible Safari Remote Automation
preflight, no hidden password prompts, and phase-applicable gates. State
explicitly that the self-hosted Mac must already be awake, unlocked and logged
into a GUI session; neither Codex nor the workflow wakes it. Mark P3 complete;
Content Manager remains optional in the exit contract even if shipped.

- [ ] **Step 6: Verify and commit**

```bash
npm run test:ci
npm test
npm run test:progression
npm run test:act-coupling
node tools/run-with-strict-e2e-port.mjs -- npm run test:e2e
node tools/run-with-strict-e2e-port.mjs -- npm run test:e2e:webkit
if node -e "const p=require('./package.json');process.exit(p.scripts?.['test:e2e:content-disk']?0:1)"; then
  node tools/run-with-strict-e2e-port.mjs -- npm run test:e2e:content-disk
fi
node tools/verify-production-surface.mjs
npm run test:round5:standing -- --profile p3
git diff --check
git add package.json package-lock.json playwright.config.js \
  .github/workflows/ci.yml .github/workflows/perf.yml \
  .github/workflows/simulator-safari.yml \
  .github/workflows/update-baselines.yml tools/ci-contract.mjs \
  test/test_ci_contract.mjs test/test_module_boundaries.mjs \
  AGENTS.md docs/README.md
git commit -m "ci: extend Round 5 browser and tooling gates"
```

---

### Task 21: `[PE]` Bootstrap the production Pixi runtime, tokens and recovery

**Files:**
- Create: `src/ui/pixi-app.js`, `src/ui/widgets.js`, `src/ui/tween.js`, `src/ui/fonts.js`
- Create: `docs/licences/fonts/cinzel-OFL.txt`,
  `docs/licences/fonts/alegreya-OFL.txt`,
  `docs/licences/fonts/round5-provenance.json`,
  `tools/verify-round5-fonts.mjs`
- Modify: `src/ui/tokens.js`
- Modify: `index.html`, `src/main.js`, `src/ui/index.js`, `src/vfx.js`, `src/styles.css`
- Create: `test/e2e/pixi.spec.js`, `tools/check-bundle-budget.mjs`, `test/budgets/round5-bundle.json`
- Modify: `package.json`, `package-lock.json`
- Modify/Test: `test/test_engine.js`

**Interfaces:**
- Produces one `Application` lifecycle and widget/tween primitives; no caller can construct a second renderer.
- Consumes the approved FE value contract and stage/VFX shake state.

- [ ] **Step 1: Close the FE value owner checkpoint**

Record `PE_PRE_FE_CONTRACT=$(git rev-parse HEAD)`, inspect the exact Task 2 FE
contract commit and verify its diff/write set. Present the fixed value/state/
motion tables to the owner before merging. If changes are requested, FE alone
revises the contract and PE repeats the checkpoint. After approval, merge the
exact FE commit with `--no-ff`; record FE SHA, frozen value interface,
`PE_PRE_FE_CONTRACT`, merge SHA and rollback command
`FE_CONTRACT_MERGE=$(git rev-parse HEAD); git revert -m 1 "$FE_CONTRACT_MERGE"`
in the execution ledger and P4 gate report. Do not
create `ROUND5_TOKENS` from an unapproved contract.

- [ ] **Step 2: Capture the post-P3 pre-Pixi bundle baseline**

Build to `/tmp/spirebound-round5-pre-pixi`, identify the entry script from its
`index.html`, and calculate gzip level 9 with Node `zlib.gzipSync`. Store the
exact baseline in `test/budgets/round5-bundle.json`; do not use the older
261k reference number.

- [ ] **Step 3: Write failing lifecycle/widget tests**

`pixi.spec.js` asserts one canvas/application, WebGL renderer, fixed stage size,
policy state, ready→lost→rebuilding→ready, snapshot survival, vector texture
fallback, shake-root alignment, resolution-aware integer position snapping and
deterministic freeze/unfreeze/destruction. `test_engine.js`
imports the P2 `tokens.js` API and initially fails because `ROUND5_TOKENS` is not
exported; it then asserts the exact approved FE values and no DOM/global access.

Install a pre-navigation `HTMLCanvasElement.getContext` observer in the Pixi
spec. Assert the only live WebGL owners are exactly `#bg3d`, `#mesh`, `#uigl`;
`#vfx` is 2D; no fourth owner appears before or after Pixi rebuild. Context
generation may increment on recovery, but the live owner set remains three.

Add Node-pure `contrastRatio(foreground, background)` to `tokens.js` and assert
every approved text/background token pair is at least 4.5:1. In Pixi, extract
representative button/counter/HUD text bounds and sample opaque interior glyph
pixels against their local background; the measured ratio must also be ≥4.5:1.

- [ ] **Step 4: Pin and block on the approved self-hosted fonts**

The repo already self-hosts both families through `@fontsource/cinzel` and
`@fontsource/alegreya`; do not add a duplicate TTF pipeline. Change both
dependencies from ranges to exact `5.2.8`. `tools/verify-round5-fonts.mjs`
checks the lockfile tarball integrity, the exact local WOFF2 inputs and the two
package OFL files, and has an atomic `--write-evidence` mode for the declared
licence/provenance docs. Pin these values:

```text
@fontsource/cinzel 5.2.8
  lock integrity sha512-B9WeF/jPlOJOrcXfX96cy4KfM+s1QcU2C9W2hE3azBOBzPvzFkNpBovT5JmhAeicE/s4HZWKF9LF5hmEcqlbsw==
  latin 500 2864b2c9db377e10db43d3ca1ab268c0e10cf3ee94b1a325d104b8e4a74dc7da
  latin 700 8efa224fe70fef188a39c095e218b81fd31061809f2752537e33a9ec7b9c2263
  latin 800 47fd3e35a90ae2198df04cdc9f036011f1b58f6e97878de7aa9258c35f6ac665
  LICENSE f5a242cf68ad6ebd0603b3359a74c593ca080318a681035be5296ba2c6b04ae6
@fontsource/alegreya 5.2.8
  lock integrity sha512-/C4ShWmhyyaDZj9GfFvMaeGrt7pRupgoXdFd26Cg/y5m49UhhifbqBBRNwVhGCt5+wfjmakz7wBhFHJLH5c/mg==
  latin 400 normal fe33a80f1e2f7200d22980bb3838c168f1e7a36262a3e51ff73f47242e79c21f
  latin 500 normal 6cac80c145da16f6922c4f9b04adf2a49af671320925f923f16a4a8ed1133601
  latin 700 normal 9625138569ede683bc9d5b92b5c304bd2f5a106dadb2ba6ad757b792b79932bc
  latin 400 italic 61f7ea641fb5661f91a379791985c48fdb9b6205b4cae892190f0b2799650cdf
  LICENSE a616403914fd16d254244f482b348af457a54f7e79a7919daec24129c1bd3571
```

Remove `src/main.js`'s broad package CSS imports. `fonts.js` imports exactly the
seven local Latin WOFF2 URLs through Vite `?url` (Cinzel 500/700/800; Alegreya
400/500/700 normal and 400 italic), injects same-origin
`rel=preload as=font type=font/woff2 crossorigin` links before UI boot, creates
and loads matching `FontFace` objects, adds them to `doc.fonts`, and exports
`loadRound5Fonts(doc)`.

`loadRound5Fonts` awaits explicit
`doc.fonts.load()` calls for `700 16px Cinzel`, `400 16px Alegreya` and
`italic 400 16px Alegreya`, then `doc.fonts.ready`. It throws unless all
three matching `doc.fonts.check()` calls pass. `ui/index.js` awaits this before Pixi
initialisation or any card texture bake. The Pixi test records requests and
asserts all font responses are same-origin and complete before
`renderer.ready`; no font request begins after the first card bake. It also
proves family/weight with canvas `measureText`, so
`document.fonts.status === 'loaded'` cannot certify a fallback. Node tests
verify all package-asset hashes, both verbatim checked-in OFL copies and
provenance rows. A temporary production build must contain the seven expected
hashed WOFF2 assets and no Google/Fontsource network URL. No CSS `@import`,
`fonts.googleapis.com`, `fonts.gstatic.com` or runtime CDN request is allowed.

After implementing the verifier and pinning the packages, generate and verify
the exact evidence before any later renderer work:

```bash
npm install --save-exact @fontsource/cinzel@5.2.8 @fontsource/alegreya@5.2.8
node tools/verify-round5-fonts.mjs --write-evidence
node tools/verify-round5-fonts.mjs --check
test -s docs/licences/fonts/cinzel-OFL.txt
test -s docs/licences/fonts/alegreya-OFL.txt
test -s docs/licences/fonts/round5-provenance.json
```

`--check` is read-only and byte-verifies the generated docs, lock integrity,
seven WOFF2 inputs and package licences. Re-run it after every package/source
change in this task.

- [ ] **Step 5: Pin the production renderer dependency**

Run `npm install --save-exact pixi.js@8.19.0` in the PE worktree and assert
`package.json` contains the exact version without a range. The disposable spike
branch is not a dependency source and is never merged.

- [ ] **Step 6: Implement `tokens.js` and ticker tween contract**

Extend the P2 token API with frozen owner-approved `ROUND5_TOKENS` plus the
compatibility aliases `EASING`, `DURATION_MS`, `COLOUR`, `TYPE` and policy helpers; preserve
all P2 base token ids used by themes.
Switch the existing `ui/index.js` boot call to
`applyExperienceTokens(document.documentElement, ROUND5_TOKENS)` and assert
computed CSS variables exactly match the values Pixi receives. Scan
`src/styles.css` and the future FE stylesheet contract for duplicate raw Round
5 values; one code-side projection remains the source.
`tween.js` accepts `{from,to,duration,easing,onUpdate,endState}`; under REDUCED it
applies `endState` once, emits `motion:'reduced'`, and settles on the same tick.

- [ ] **Step 7: Mount `#uigl` in the correct render layer**

Place `<canvas id="uigl" aria-hidden="true"></canvas>` immediately after
`#vfx`, outside `#shake` and before tooltip/pop-menu/toast mounts. CSS is
absolute, transparent and `pointer-events:none`. Export the current VFX shake
offset and apply it to the Pixi world root on every ticker so renderer bounds,
hit tests and probe coordinates stay in stage space.

- [ ] **Step 8: Implement one lifecycle state machine**

Use:

```js
export async function createPixiLayer({ canvas, stage, policy, trace, snapshot }) {
  // ready -> lost -> rebuilding -> ready | failed
}
```

Initialise with `preference:'webgl'`, antialias off for baselines, stage-pixel
width/height, and resolution `Math.min(devicePixelRatio * stage.scale,
policy.tier === 'lite' ? 1 : 2)`. On loss: `preventDefault`, cancel pointer and
tooltip, freeze presentation and retain only the immutable presentation
snapshot. On restore: replace/reinitialise the application, reload blocking
sources/bitmap fonts/widgets and rebuild from that snapshot. Never store
run/cb/DOM/Pixi objects in the snapshot.

The lifecycle owns an injectable ticker clock and
`freezeForTest({ atTick = 0 })`/`unfreezeForTest()`. Freeze awaits the full
presentation settle barrier, advances to the named deterministic tick, stops
ticker/time/filter uniforms while keeping `#uigl` visible, and records frozen
state in the immutable recovery snapshot. A rebuild restores the same frozen
tick until explicitly unfrozen.

- [ ] **Step 9: Implement widget primitives**

Export:

```js
createNineSlice({ texture, fallback, bounds })
createMeter({ bounds, value, max, colours })
createCounter({ bounds, value, icon })
createButton({ bounds, states, onActivate })
createStateSprite({ bounds, states, initial })
```

All primitives implement `setState`, `layout`, `readBounds`, `destroy`; missing
textures draw a token-driven vector fallback and remain usable.

Export:

```js
const snapStage = (value, resolution) =>
  Math.round(value * resolution) / resolution;
```

Every baseline-visible Pixi position, size and root transform uses
it after layout. Tests assert device-pixel-integral bounds at the pinned baseline
DPR while semantic Probe bounds remain stage px.

- [ ] **Step 10: Freeze the bundle formula**

After minimal production bootstrap, measure entry gzip. Set:

```text
maxEntryGzipBytes = ceil(minimalBootstrapGzipBytes * 1.10 / 1024) * 1024
```

`check-bundle-budget.mjs` rebuilds to a temporary directory, resolves the entry
from `index.html`, gzips at level 9 and fails above that stored max.

- [ ] **Step 11: Verify and commit**

```bash
npm test
node tools/verify-round5-fonts.mjs --check
node tools/run-with-strict-e2e-port.mjs -- npx playwright test pixi --project=desktop --workers=1 --no-deps
node tools/check-bundle-budget.mjs
git add package.json package-lock.json index.html src/main.js src/ui/index.js \
  src/ui/pixi-app.js src/ui/widgets.js src/ui/tween.js src/ui/fonts.js \
  src/ui/tokens.js \
  docs/licences/fonts/cinzel-OFL.txt docs/licences/fonts/alegreya-OFL.txt \
  docs/licences/fonts/round5-provenance.json tools/verify-round5-fonts.mjs \
  src/vfx.js src/styles.css test/e2e/pixi.spec.js tools/check-bundle-budget.mjs \
  test/budgets/round5-bundle.json test/test_engine.js
git commit -m "feat: bootstrap the production Pixi UI layer"
```

### Task 22: `[PE]` Migrate all combat chrome except the DOM hand

**Files:**
- Create: `src/ui/combat-gl.js`
- Modify: `src/ui/combat.js`, `src/ui/widgets.js`, `src/ui/pixi-app.js`, `src/uic.js`, `src/styles.css`
- Create: `test/e2e/bfuieditor.spec.js`
- Modify: `package.json`, `package-lock.json`, `playwright.config.js`
- Modify/Test: `test/e2e/battle.spec.js`, `geometry.spec.js`, `stage.spec.js`, `pixi.spec.js`

**Interfaces:**
- Produces: the frozen deep renderer seam and immutable presentation model.
- At the Task 22 boundary only, DOM retains combatants/mesh/aim, VFX,
  tooltip/pop-menu/toasts, hand and one temporary transparent
  `#combat-hit-proxies` host. Task 23 removes that host when the stage router
  takes ownership; no commit leaves migrated controls unusable.

- [ ] **Step 1: Write failing P4 DOM inventory and renderer-shape tests**

After starting combat, assert `probe.ui().version === 2`, renderer `kind:'pixi'`,
and no DOM energy, lantern, End Turn, piles, HUD, potion, relic, status, name,
affix, HP/Ward/facet or intent **visual chrome**. Assert DOM hand cards still
exist and `#combat-hit-proxies` contains only the exact interactive migrated
regions (End Turn, lantern, three piles, potions, relic/menu/HUD buttons) with
no text/icon/image/background/opacity-visible content.

- [ ] **Step 2: Freeze the renderer interface**

Implement exactly:

```js
const renderer = await createCombatRenderer({ canvas, actions, tooltip, trace, tokens });
renderer.mount(presentationModel);
renderer.sync(presentationModel);
renderer.layout({ stage, battlefield, chrome });
renderer.hitTest(stagePoint);
renderer.setInteraction(interactionSnapshot);
renderer.readUI();
renderer.stats();
renderer.loseContextForTest();
await renderer.freezeForTest({ atTick: 0 });
renderer.unfreezeForTest();
renderer.destroy();
```

`presentationModel` is deep-frozen plain data built by `combat.js`; it contains
ids, copy, counts, state and stage geometry, never `run`, `cb`, DOM or Pixi refs.

- [ ] **Step 3: Register and preload the exact existing UI assets**

Register all 27 `src/assets/ui/*.png` ids. These exact 17 non-node ids block
`textured-ready`: `candle-lit`, `candle-spent`, `coin`, `deck`, `end-turn`,
`facet-chipped`, `facet-empty`, `heart`, `hp-vial-frame`, `intent-attack`,
`intent-block`, `intent-buff`, `intent-debuff`, `intent-heal`, `lantern`, `menu`,
`ward`. Also block on the three existing pile rasters
`src/assets/piles/{draw,discard,ashes}.png`; keep their existing procedural/SVG
fallbacks. The ten `node-*` files are non-blocking for combat. Do not generate
or invent replacement pile textures. Before
readiness, render vector chrome with input disabled. A failed raster keeps its
fallback and re-enables play with a trace warning.

- [ ] **Step 4: Migrate the complete chrome inventory**

Move: player/enemy names and affix label; statuses; HP/Ward/facets/intents;
energy; lantern/art/embers; End Turn; draw/discard/ashes; HUD HP/gold/deck/menu;
potions; relics; omen. Read existing `uicResolve()` and battlefield anchors;
do not re-derive geometry. Subscribe to `onUICChange()` for atomic relayout.

Until Task 23, bind the existing semantic handlers to transparent DOM hit
proxies at the same `uicResolve()` bounds. Drive every interactive migrated
widget through a real pointer/click test and assert the Pixi state updates.
These proxies are an explicit one-task bridge, not a second visual renderer;
they contain no display copy and are removed, with their listeners, by Task 23.

- [ ] **Step 5: Preserve editor and stage contracts**

Run live bfuiedit geometry changes and its disk-save test; assert `readUI()`
bounds change without reload. Run bfedit unchanged. Verify all five stage shapes
and safe-area selection. Also assert every rendered sprite/widget transform is
device-pixel integral at pinned baseline DPR.

Create a dedicated `bfuieditor-disk` one-worker project and
`test:e2e:bfuieditor-disk` script. `bfuieditor.spec.js` saves through the real
`/__bfui-save` endpoint, observes live Pixi relayout, and restores the exact
`src/ui-chrome-layout.js` bytes in `finally`; it never runs under `--no-deps`.
Extend the existing `test:e2e:disk` nested aggregate to run this command exactly
once after the battlefield/character editor disk command, with a fresh strict
port. Do not add a new top-level lane or change Task 6's frozen
`test:e2e = nonvisual && visual` and disk→random→main→serial ordering; all
remaining projects keep `--no-deps`. Update the exact package/CI-contract source
assertions accordingly.

- [ ] **Step 6: Verify and commit**

```bash
npm test
node tools/run-with-strict-e2e-port.mjs -- npx playwright test pixi battle geometry stage --project=desktop --workers=1 --no-deps
node tools/run-with-strict-e2e-port.mjs -- npm run test:e2e:bfuieditor-disk
node tools/run-with-strict-e2e-port.mjs -- npx playwright test bfeditor --project=desktop --workers=1
node tools/check-bundle-budget.mjs
git add src/ui/combat.js src/ui/combat-gl.js src/ui/widgets.js src/ui/pixi-app.js \
  src/uic.js src/styles.css test/e2e/battle.spec.js test/e2e/geometry.spec.js \
  test/e2e/stage.spec.js test/e2e/pixi.spec.js test/e2e/bfuieditor.spec.js \
  package.json package-lock.json playwright.config.js
git commit -m "feat: render complete combat chrome in Pixi"
```

### Task 23: `[PE]` Cut over the sole combat input router, tooltip and Probe v2

**Files:**
- Create: `src/ui/pointer.js`, `test/e2e/input-router.spec.js`
- Modify: `src/ui/combat.js`, `src/ui/combat-gl.js`, `src/ui/probe.js`, `src/ui/tooltip.js`, `src/ui/index.js`, `test/e2e/helpers.js`
- Modify/Test: `test/test_engine.js`

**Interfaces:**
- Produces: `createCombatPointerRouter(...)`, renderer-neutral `probe.ui()` and separate `queueIdle()`/`settle()`.

- [ ] **Step 1: Inventory and freeze current listener owners**

Add a source-based test listing all old combat-specific listener sites: enemy
click/enter/leave; card click/hover/drag; lantern; End Turn; piles; combat-root
pointerdown; targeting document pointermove. The final source test requires each
to be removed or delegated to `pointer.js`; non-combat overlay listeners remain.
Include every `#combat-hit-proxies` listener/site and require the host itself to
be absent after cut-over.

- [ ] **Step 2: Write failing real-pointer/cancel tests**

Use probe bounds converted from stage to client coordinates. Assert the browser
router instrumentation owner/currentTarget is `#stage` and the event target/
composed path is never `#uigl`; a P4 DOM hand child may remain the original
target. Assert `#combat-hit-proxies` is absent. Assert 26px upward starts drag;
12px cancels long-press;
`pointercancel` and `lostpointercapture` return the exact seat bounds, play
nothing and emit `cancelled`; enemy bounds come from battlefield geometry.

- [ ] **Step 3: Implement the fixed router seam**

```js
createCombatPointerRouter({
  stage, toStage, renderer, domHandAdapter, targetRegions,
  actions, tooltip, trace,
}) // -> enable(), disable(), cancel(reason), state(), destroy()
```

Hit-test Pixi first, P4 DOM hand second, then allow residual DOM events. Capture
one pointer after acceptance; every cancellation path calls the same cleanup.
The tooltip bridge converts sprite stage bounds to client bounds and delegates
to the existing DOM tooltip.

- [ ] **Step 4: Implement the renderer-neutral Probe v2 shape**

```js
ui: () => ({
  version: 2,
  renderer: { kind, state, generation, policy },
  hand: [{ uid, id, bounds, seatBounds, playable, selected, dragging }],
  piles: { draw, discard, ashes }, energy, lantern, endTurn,
  player, enemies, hud, input, textures,
}),
queueIdle: () => !S.cb || S.cb.queue.length === 0,
settle: () => presentationSettled(),
loseRendererContextForTest: () => renderer.loseContextForTest(),
freeze: (options) => renderer.freezeForTest(options),
unfreeze: () => renderer.unfreezeForTest(),
```

`geometry()` stays battlefield/DOM based. Drivers call real semantic actions.
The existing async `window.__probe.freeze()` first waits full settle, freezes
scene/VFX/DOM rig and delegates to Pixi; a CSS-only freeze is not canvas proof.

- [ ] **Step 5: Verify and commit**

```bash
npm test
node tools/run-with-strict-e2e-port.mjs -- npx playwright test input-router battle trace --project=desktop --workers=1 --no-deps
git add src/ui/pointer.js src/ui/combat.js src/ui/combat-gl.js src/ui/probe.js \
  src/ui/tooltip.js src/ui/index.js test/e2e/input-router.spec.js \
  test/e2e/helpers.js test/test_engine.js
git commit -m "feat: centralise combat input and Probe v2"
```

### Task 24: `[PE]` Add P4 trace parity, WebKit, perf and recovery gates

**Files:**
- Create: `test/e2e/visual-policy.js`
- Create: `tools/write-baseline-manifest.mjs`
- Create: `tools/run-baseline-workflow.mjs`
- Create: `tools/install-baseline-artifact.mjs`
- Modify: `test/e2e/helpers.js`, `test/e2e/pixi.spec.js`,
  `test/e2e/visual.spec.js`, `test/e2e/trace.spec.js`, `perf.spec.js`,
  `playwright.config.js`, `package.json`
- Modify/Test: `test/test_engine.js`
- Read-only: `test/e2e/fixtures/trace/*.json`
- Create: `test/simulator/production-profile.test.mjs`,
  `test/simulator/profile-fixtures.mjs`,
  `test/simulator/profile-fixtures.test.mjs`
- Modify: `test/simulator/assertions.mjs`, `test/simulator/run.mjs`
- Modify: `.github/workflows/ci.yml`, `.github/workflows/perf.yml`,
  `.github/workflows/simulator-safari.yml`,
  `.github/workflows/update-baselines.yml`
- Modify: `test/e2e/visual.spec.js-snapshots/**`
- Modify: `AGENTS.md`, `docs/README.md`

**Interfaces:**
- Proves frozen P1 semantic parity and produces P4 portrait/full-tier metric artifacts plus the reusable production-Simulator profile.

- [ ] **Step 1: Prove the frozen P1 fixture projections unchanged**

Run the complete frozen Task 6 fixture manifest against the P4 renderer in comparison-only mode.
Do not update them. Assert renderer kind/generation separately so the semantic
names/order remain byte-for-byte fixed.

Before any P4 screenshot update, create and freeze the only Pixi-era tolerance
policy:

```js
export const VISUAL_DIFF_RATIOS = Object.freeze({
  legacy: 0.01,
  p4Combat: 0.01,
  p5Cards: 0.01,
  p6Screens: 0.01,
  p7Shipfront: 0.01,
});
```

Route every screenshot helper through an explicit suite key. Add a Node/source
assertion that all five values are exactly `0.01`, every visual case declares
one key, and no other test/config file contains a numeric
`maxDiffPixelRatio`. Remove the current global numeric value from
`playwright.config.js`; `visual.spec.js` imports the pure map and passes the
selected value into each `toHaveScreenshot` call. `test_engine.js` imports the
map and scans the config/spec sources. QA approves this source policy before
Step 5 commits; FE
does not tune technical tolerance. A failed image is fixed or deliberately
re-baselined and reviewed, never made green by increasing the ratio.

- [ ] **Step 2: Add P4 context/shake assertions**

Assert `renderer.context-recovery` lost→rebuilding→ready, active pointer cancel,
post-restore interaction, `presentation.shake-sync` and no overflow/orphans/
unexpected errors. Re-run the Task 21 context observer through recovery: live
owners remain exactly scene3d/mesh/Pixi, VFX remains 2D and no transient fourth
WebGL canvas is created. Re-run token-pair and representative Pixi pixel contrast
checks at ≥4.5:1. Parse only the timestamped text projection and prove it exposes
the ordered renderer lost/rebuilding/ready journey with correlation/cause; do
not consult structured records for that assertion. The test reads the
`behaviourTrace({format:'text'}).text` field explicitly.

Stage the same shot in two fresh pages, await `__probe.freeze({atTick:0})`, and
require byte-identical PNGs. Repeat after context recovery and require the
frozen tick/state to survive. All visual helpers await this async Probe barrier;
a live Pixi ticker/foil uniform fails determinism.

Add a tested `production` Simulator profile that opens a deterministic Lab
combat URL and reads `window.__probe.ui()`/behaviour trace. It drives the real
stage router, pointer cancel, shake and
`window.__probe.loseRendererContextForTest()` seam;
it never references `window.__pixiSpike`. The P0.5 `spike` profile remains only
for replaying the archived decision surface while its worktree exists. Its pure
test requires the inherited NDJSON/text failure-artifact contract.

Add Node-pure fresh/veteran storage-fixture builders for the final commercial
smoke. Fresh removes run/stats/Vigil keys. Veteran emits a save-compatible
post-Phase2 Vigil/stats profile with every reveal, completed Rose Window shards,
grown title/Vigil/sealed-door surfaces, unlocked second aspect and a non-zero
Vow. Validate both through the real load/migration APIs in pure tests; never
hand a browser an unvalidated arbitrary storage blob. Freeze the profile matrix
to iPhone 17 Pro portrait and iPad mini (A17 Pro) landscape, each run once as
fresh and veteran (four rows).

- [ ] **Step 3: Extend performance outputs without changing Phase 2 policy**

Record portrait/LITE CPU 4× reference targets at average ≥55fps and p95 ≤22ms
with Pixi ready asserted, plus desktop/Full (foil/high DPR). A valid miss in
either tier emits `PERF_WARNING`, records the measured/reference values and does
not fail the task, CI gate or prefix decision. Missing artifact, wrong project
or tier, zero/non-finite metrics, no frames, browser crash, application error or
unready Pixi remains a hard failure. Disable semantic trace recording in both
and write separate JSON artifacts.

Add a source/CI-contract assertion that 55/22 cannot appear in a threshold
`expect` or non-zero-exit branch. Deterministic main-chunk bytes, exact WebGL
owner count and texture/cache allocation invariants remain hard gates. The
host-relative heap measurement in Task 29 keeps its separately declared leak
gate; this FPS/frame-time policy does not silently redefine it.

- [ ] **Step 4: Extend workflows phase-applicably**

Run WebKit semantic projects, bundle checker and P4 recovery tests in CI. Nightly
perf records both tiers. Manual Simulator workflow runs the narrow representative
smoke on browser-contract changes and the full matrix at this gate; its validated
surface default changes from `dom` to `production`. Update the
agent module graph and docs index with the Pixi lifecycle, renderer/router seam,
Probe v2, Simulator production profile and P4 standing gates in this same task.

Extend `update-baselines.yml` to run the Node-pure
`tools/write-baseline-manifest.mjs` after Linux capture. Its uploaded artifact
contains the snapshots plus `baseline-manifest.json` with schema version,
`GITHUB_SHA`, and for every exact relative path its bytes and SHA-256. Unit-test
stable ordering, path traversal rejection, Linux-snapshot allowlisting and hash
verification. All P4/P5/P6/P7 downloads reject a missing/extra file, a manifest
source SHA different from the recorded source head, or a byte/hash mismatch
before copying any baseline.

`tools/run-baseline-workflow.mjs` snapshots existing dispatch run ids for the
expected commit, dispatches the workflow, then polls `gh run list --commit
$SOURCE_SHA --event workflow_dispatch` until exactly one **new** matching run appears.
It rejects zero after its bounded timeout, concurrent duplicate matches or a
different `headSha`, then watches and downloads that exact database id. Unit
tests fake a delayed listing, a previous run on the same SHA, duplicate new
runs and head mismatch. P5/P6/P7 reuse this helper; no task selects `--limit=1`
immediately after dispatch.

`tools/install-baseline-artifact.mjs` has the exact CLI
`--artifact <dir> --expect-sha <sha> --destination
test/e2e/visual.spec.js-snapshots`. It finds exactly one
`baseline-manifest.json`, verifies schema/source SHA, exact Linux snapshot
allowlist, no missing/extra files, bytes and SHA-256 for every row, and performs
no copy until all validation passes. It then atomically replaces only the
manifest-listed Linux files and prints their sorted paths. Import-safe tests
cover head mismatch, traversal, missing/extra/hash failure and all-or-nothing
copy.

Add package script `test:simulator:profiles` for that exact four-row matrix.
Each row injects the validated profile on the app origin, reloads, drives real
title/Vigil/Embark/map/combat controls through Probe/stage pointer paths, and
writes JSON, screenshot, `.text` and `.ndjson`. It is functional evidence, not
a performance claim.

- [ ] **Step 5: Commit and push the exact P4 visual source head**

Run non-visual/focused gates, stage every non-baseline Task 24 path, commit, push
and require a clean worktree before baseline generation:

```bash
npm test
node tools/run-with-strict-e2e-port.mjs -- npm run test:e2e:webkit
node tools/run-with-strict-e2e-port.mjs -- npm run test:e2e:perf
PERF=1 PERF_TIER=full node tools/run-with-strict-e2e-port.mjs -- npx playwright test perf --project=desktop --workers=1 --no-deps
node tools/check-bundle-budget.mjs
node --test test/simulator/*.test.mjs
git add test/e2e/trace.spec.js test/e2e/perf.spec.js playwright.config.js \
  test/e2e/visual-policy.js test/e2e/helpers.js test/e2e/pixi.spec.js \
  test/e2e/visual.spec.js \
  package.json package-lock.json test/simulator/production-profile.test.mjs \
  test/simulator/profile-fixtures.mjs test/simulator/profile-fixtures.test.mjs \
  test/simulator/assertions.mjs test/simulator/run.mjs \
  .github/workflows/ci.yml .github/workflows/perf.yml \
  .github/workflows/simulator-safari.yml \
  .github/workflows/update-baselines.yml \
  tools/write-baseline-manifest.mjs tools/run-baseline-workflow.mjs \
  tools/install-baseline-artifact.mjs \
  AGENTS.md docs/README.md
git add test/test_engine.js
git commit -m "test: prepare the P4 renderer gates"
git push -u origin codex/round5-production-engineering
P4_SOURCE_SHA=$(git rev-parse HEAD)
test -z "$(git status --short)"
```

Inspect both metric artifacts before committing. A valid reference miss is
recorded as `PERF_WARNING` and does not abort this step; any missing/invalid/
crashed measurement still aborts. Never edit the thresholds to make evidence
green.

- [ ] **Step 6: Recapture and review the P4 visual contract in-phase**

Run the one-worker Darwin baseline update, then the visual suite. Dispatch
`update-baselines.yml` against the exact branch head, wait for green, download
its Linux artifact and replace only Linux baseline files. Inspect every Darwin
and Linux diff at pinned DPR/antialias-off; record the fixed
`p4Combat:0.01` policy and confirm it did not change. A fresh FE agent verifies
the captures against the approved Task 2
contract, and a fresh QA agent verifies evidence/quality. Neither edits tests or
baselines.

```bash
node tools/run-with-strict-e2e-port.mjs -- npm run test:e2e:update
node tools/run-with-strict-e2e-port.mjs -- npm run test:e2e:visual
P4_SOURCE_SHA=$(git rev-parse HEAD)
node tools/run-baseline-workflow.mjs \
  --workflow update-baselines.yml \
  --ref codex/round5-production-engineering \
  --sha "$P4_SOURCE_SHA" \
  --out /tmp/spirebound-round5-p4-linux-baselines
node tools/install-baseline-artifact.mjs \
  --artifact /tmp/spirebound-round5-p4-linux-baselines \
  --expect-sha "$P4_SOURCE_SHA" \
  --destination test/e2e/visual.spec.js-snapshots
```

The installer enforces source SHA, exact allowlisted paths, byte sizes and
SHA-256 before copying. A fresh FE agent verifies the captures against the
approved contract; a fresh QA agent verifies evidence/quality. Any source fix
creates a new pushed source SHA and repeats both Darwin and Linux generation.

- [ ] **Step 7: Verify and commit the baseline-only delta**

```bash
npm test
node tools/run-with-strict-e2e-port.mjs -- npm run test:e2e:webkit
node tools/run-with-strict-e2e-port.mjs -- npm run test:e2e:perf
PERF=1 PERF_TIER=full node tools/run-with-strict-e2e-port.mjs -- npx playwright test perf --project=desktop --workers=1 --no-deps
node tools/run-with-strict-e2e-port.mjs -- npm run test:e2e:visual
git add test/e2e/visual.spec.js-snapshots
git commit -m "test: approve the P4 visual baselines"
```

Again, valid `PERF_WARNING` rows are preserved as evidence and are not a
baseline failure. Only the hard measurement-validity conditions from Step 3
block this commit.

### Task 25: `[PE]` Close the P4→P5 gate or select the P4 prefix exit

**Files:**
- Create: `docs/superpowers/reports/2026-07-10-round5-p4-gate.md`
- Prefix only: generated `dist/**`, `CONTEXT.md`, `AGENTS.md`, `docs/README.md`

**Interfaces:**
- Produces: explicit `Decision: GO TO P5` or `Decision: P4 PREFIX EXIT`.

- [ ] **Step 1: Run every P4 gate from a clean checkout**

```bash
npm run test:ci
npm test
npm run test:progression
npm run test:act-coupling
node tools/run-with-strict-e2e-port.mjs -- npm run test:e2e
node tools/run-with-strict-e2e-port.mjs -- npm run test:e2e:webkit
node tools/run-with-strict-e2e-port.mjs -- npm run test:e2e:perf
PERF=1 PERF_TIER=full node tools/run-with-strict-e2e-port.mjs -- npx playwright test perf --project=desktop --workers=1 --no-deps
node tools/check-bundle-budget.mjs
node tools/verify-production-surface.mjs
npm run test:simulator:full -- --surface production
git diff --check
```

- [ ] **Step 2: Record non-command evidence**

Record trace parity, pointer/cancel/lost-capture, context recovery, shake motion,
bfuiedit/bfedit, all stage shapes, cold-preload fallback, Darwin/Linux baseline
review and exact Simulator rows. Record portrait/LITE and desktop/Full values
plus any `PERF_WARNING`; a valid target miss alone cannot select a prefix exit
or block `GO TO P5`. Missing/invalid/crashed measurements remain blocking. Do
not report hardware performance.

- [ ] **Step 3: Obtain independent review**

A fresh QA agent reviews the full P1–P4 diff package and returns both spec and
quality verdicts without editing product or evidence files. Any
Critical/Important issue returns to PE, which fixes it and requests re-review.

- [ ] **Step 4: Commit GO or close the P4 prefix**

For `Decision: GO TO P5`, commit only the gate record:

```bash
git add docs/superpowers/reports/2026-07-10-round5-p4-gate.md
git commit -m "docs: record the P4 Pixi gate"
```

For `Decision: P4 PREFIX EXIT`, obtain the protocol's broad-review approval;
the following commands implement its one build/commit/push closure:

```bash
npm run build
git add dist CONTEXT.md AGENTS.md docs/README.md \
  docs/superpowers/reports/2026-07-10-round5-p4-gate.md
git diff --cached --check
git commit -m "build: ship the Round 5 P4 commercial-engine prefix"
git push -u origin codex/round5-production-engineering
gh pr create --base main --head codex/round5-production-engineering \
  --title "Round 5 P4 commercial-engine prefix" \
  --body-file docs/superpowers/reports/2026-07-10-round5-p4-gate.md
```

Watch required checks and stop all execution after opening the P4 prefix PR.

### Task 26: `[PE]` Build the single card-face composer and bounded cache

**Files:**
- Create: `src/ui/cardface-layout.js`, `src/ui/cardface.js`, `test/e2e/cardface.spec.js`
- Modify: `src/ui/combat-gl.js`, `src/ui/tooltip.js`, `src/ui/overlay.js`, `src/ui/screens/reward.js`, `src/ui/screens/shop.js`, `test/test_engine.js`

**Interfaces:**
- Produces `createCardFaceComposer({renderer,registries,assets,tokens,locale,policy})`.

- [ ] **Step 1: Write Node layout/cache tests first**

Canonical face is 152×216 stage px. Body attempts 13px, 12px, 11px, max six
lines; inline keyword icon runs never split; final overflow ellipsises and emits
a diagnostic. Every base/upgraded core card must fit without emergency fallback.

Assert every rarity/base/upgraded cost/name/body token pair is ≥4.5:1. The
browser spec extracts representative common/uncommon/rare/boss card faces and
pixel-samples cost, name and body glyph interiors against their composed local
backgrounds at ≥4.5:1.

Allocation formula:

```js
Math.ceil(width * dpr) * Math.ceil(height * dpr) * 4 * 1.33
```

LRU caps are 4,191,990 bytes LITE and 16,767,960 bytes full, maximum 24 entries.

- [ ] **Step 2: Verify red and implement the pure layout module**

Run `npm test`; expected missing module. Implement token-aware wrap, cache key
including locale/content/upgrade/effective-value/DPR tier, allocation estimator
and deterministic upgrade-diff token ranges.

- [ ] **Step 3: Implement the composer contract**

```js
composer.acquire(cardDescriptor, displayState) // { key, texture, release }
composer.exportImage(cardDescriptor, displayState) // { key, url, release }
composer.invalidate(criteria)
composer.rebuild(renderer)
composer.stats()
composer.destroy()
```

Preview/lethal/hover tint and foil are live overlays, never cached. DOM export
uses `renderer.extract.canvas`, creates a scoped object URL, discards the canvas
and revokes URL on screen/overlay close or eviction.

- [ ] **Step 4: Replace every DOM card grid**

Combat, deck/help grid, rewards and shop consume the same composer/export API.
Exported images carry the same `data-card-face-key`; remove the P1 DOM card
implementation at the merge boundary.

- [ ] **Step 5: Verify and commit**

```bash
npm test
node tools/run-with-strict-e2e-port.mjs -- npx playwright test cardface rewards --project=desktop --workers=1 --no-deps
git add src/ui/cardface-layout.js src/ui/cardface.js src/ui/combat-gl.js \
  src/ui/tooltip.js src/ui/overlay.js src/ui/screens/reward.js \
  src/ui/screens/shop.js test/e2e/cardface.spec.js test/test_engine.js
git commit -m "feat: add the single bounded card-face composer"
```

### Task 27: `[PE]` Migrate the hand, targeting and keyboard path to Pixi

**Files:**
- Create: `src/ui/hand-layout.js`
- Modify: `src/ui/combat-gl.js`, `src/ui/combat.js`, `src/ui/pointer.js`, `src/ui/probe.js`, `src/ui/index.js`, `src/styles.css`
- Modify/Test: `test/e2e/input-router.spec.js`, `battle.spec.js`, `cardface.spec.js`, `test/test_engine.js`

**Interfaces:**
- Removes the P4 `domHandAdapter`; router thresholds/actions are unchanged.
- Adds selected-card/enemy keyboard state to `probe.ui()`.

- [ ] **Step 1: Freeze the current fan layout in pure tests**

Port exact constants: max gap 112, span 640, edge reserve 246, max step 5°,
total 42°, sag 3.2px/degree and maximum ten cards. Assert P4 DOM seat centres
equal pure `hand-layout.js` output for 1, 5 and 10 cards before cut-over.

- [ ] **Step 2: Write failing Pixi hand and keyboard e2e**

Assert no DOM hand cards, real pointer play/cancel, hover lift/tilt, foil in full,
flat sheen in LITE, long-press inspect, pure ghost/lethal values and all keyboard
journeys.

- [ ] **Step 3: Migrate hand and targeting arc**

Render card faces/interaction overlays in Pixi; route hits through the existing
P4 router; move the card-target arc from `#aim` to Pixi and leave `#aim` as an
empty structural host. Combatant `.aim-ring` SVG outlines and mesh outlines are
separate hosts/paths and remain unchanged.

- [ ] **Step 4: Implement the exact keyboard grammar**

Left/Right cycles hand; Enter/Space activates; during multi-enemy targeting,
Up/Down cycles living enemies and Enter commits; Escape cancels; E End Turn and
A Lantern Art remain. Ignore editable controls and open modals. Every path calls
the same semantic action façade and emits accepted/rejected reason codes.

- [ ] **Step 5: Verify and commit**

```bash
npm test
node tools/run-with-strict-e2e-port.mjs -- npx playwright test input-router battle cardface --project=desktop --workers=1 --no-deps
git add src/ui/hand-layout.js src/ui/combat-gl.js src/ui/combat.js \
  src/ui/pointer.js src/ui/probe.js src/ui/index.js src/styles.css \
  test/e2e/input-router.spec.js test/e2e/battle.spec.js \
  test/e2e/cardface.spec.js test/test_engine.js
git commit -m "feat: migrate the combat hand and keyboard path"
```

### Task 28: `[PE]` Migrate all combat floaters, banners and pile ceremonies

**Files:**
- Modify: `src/ui/drain.js`, `src/ui/combat-gl.js`, `src/ui/tween.js`, `src/vfx.js`, `src/pile-chrome.js`, `src/styles.css`
- Read-only: `src/ui/screens/end.js`
- Create: `test/e2e/presentation.spec.js`
- Modify: `test/e2e/trace.spec.js`, `visual.spec.js`, `test/test_engine.js`

**Interfaces:**
- Leaves no combat use of DOM `#floaties`; non-combat floaties may remain.

- [ ] **Step 1: Write failing semantic/timing assertions**

At CPU 4×, require one child `presentation.card-flight` per UID; `discardHand`
parent settles in 320–480ms; `reshuffle` in 450–650ms. REDUCED lands directly
on correct counts/seats with no orphan. Assert normal/heavy/kill/overkill damage
tiers and batched turn/boss/guard-shattered banners. Pixel-sample every damage
tier and representative banner text against its rendered local background at
≥4.5:1.

- [ ] **Step 2: Migrate every combat presentation owner**

Move combat `floatText`, `flyTo`, art cast, play/draw/discard/exhaust ghosts,
shatter fragments and banners into the Pixi scene/ticker. Pixi shatter consumes
the mesh handoff canvas as a temporary texture, animates fragments and destroys
it on settle.

Inventory queue ownership by `{domain,eventType}`, never by event name alone.
Migrate only combat `cb.queue` owners in this task: `questReveal`,
`questProgress`, `questComplete`, `questUnlock`, `variantDialogue`,
`hollowTithe` and `monumentGift`, plus pre-existing `bossIntro`, relic/status,
damage and combat-terminal events. Preserve each event's ordering,
detached-animation barrier and exact fallback. Trace only semantic
quest/variant/event ids and stable outcomes; never copy `variantDialogue` text
into trace records.

The distinct `run.endQueue` domain remains DOM-owned by `screens/end.js` for
Task 33/P6: `whisper`, `questReveal`, `questProgress`, `questUnlock`,
`pageRead`, `eighthResolved`, `shadeResolved`, `questComplete`, `shardGrant`
and `act4Reveal`. The four overlapping quest names therefore have two explicit
domain-qualified owners. Task 28 does not edit or migrate a Dawn panel. Add a
source inventory asserting every `{domain,eventType}` row has exactly one
declared owner and no Phase-2 event falls through silently.

- [ ] **Step 3: Preserve trace and replay descriptors**

Each ceremony span publishes only the immutable renderer-neutral descriptor;
parent/child correlation is explicit. Lab replay uses the same presentation
factory without engine mutation.

- [ ] **Step 4: Verify and commit**

```bash
npm test
node tools/run-with-strict-e2e-port.mjs -- npx playwright test presentation trace --project=desktop --workers=1 --no-deps
git add src/ui/drain.js src/ui/combat-gl.js src/ui/tween.js src/vfx.js \
  src/pile-chrome.js src/styles.css test/e2e/presentation.spec.js \
  test/e2e/trace.spec.js test/e2e/visual.spec.js test/test_engine.js
git commit -m "feat: migrate combat presentation ceremonies to Pixi"
```

### Task 29: `[PE]` Enforce P5 DOM, cache, leak, perf and CI closure

**Files:**
- Create: `test/e2e/leak.spec.js`
- Modify: `test/e2e/battle.spec.js`, `perf.spec.js`, `playwright.random-agent.config.js`, `package.json`, workflows, `src/styles.css`
- Modify: `test/test_engine.js`, `AGENTS.md`, `docs/README.md`
- Modify: `test/e2e/visual.spec.js-snapshots/**`

**Interfaces:**
- Produces: exact P5 DOM allowed-list and host-relative texture/heap regression metrics.

- [ ] **Step 1: Write the exact allowed-list test**

During combat, rendered DOM may contain only stage plates; combatant art plus
combatant `.aim-ring` and mesh outlines; `#uigl`; `#vfx`;
tooltip/pop-menu/toast mounts; empty structural hosts. Assert `#floaties` and
card-target host `#aim` are empty and no legacy face,
hand, flight, chrome or banner selector survives.

Before removing anything, add Node source assertions that reject the still-
present `?uigl=0` branch, each named legacy combat face/hand/flight/banner/
floaty selector and its dead listener registration. Run `npm test`; expected:
FAIL on those exact residues even if the rendered allowed-list already passes
after Tasks 27–28. Keep the red assertions unchanged for Step 3.

- [ ] **Step 2: Implement the leak test**

Warm the runtime/composer, run repeated identical fights and the long random
agent. In the Chromium desktop project, require
`page.context().newCDPSession(page)`, call `HeapProfiler.enable`, then
`HeapProfiler.collectGarbage` immediately before each of the three baseline and
post-cycle heap samples. Fail rather than substituting an implicit/browser GC
when CDP is unavailable. Managed entries ≤24; RGBA allocation within tier cap;
identical post-warm cycles leave texture count/bytes unchanged; the median of
three post-GC heap samples grows by at most `max(5 MiB, 15% of baseline)`.
Label all numbers host-relative. WebKit and Simulator retain cache/count and
functional checks but are explicitly excluded from the deterministic heap
claim.

Sample pile counts, End Turn, lantern/energy and representative HUD/status text
from the final P5 canvas and require measured local contrast ≥4.5:1; keep the
pure token-pair contrast gate standing too.

- [ ] **Step 3: Remove legacy escape paths and CSS**

Remove `?uigl=0`, DOM card face/hand/flight/banner/floaty combat rules and dead
listeners. Keep non-combat CSS still used by map/screens. Add source checks so a
legacy combat selector cannot return silently.

- [ ] **Step 4: Extend scripts/workflows**

Add `test:e2e:leak`; run it single-worker. P5 CI runs full Chromium, WebKit,
bundle, context recovery and cache checks. Nightly records full-tier perf/leak;
Simulator runs the full matrix at this gate.

- [ ] **Step 5: Commit and push the exact P5 visual source head**

Run the non-visual P5 standing gates, then commit every non-baseline Task 29
path and push the clean source head:

```bash
npm test
node tools/run-with-strict-e2e-port.mjs -- npm run test:e2e:webkit
node tools/run-with-strict-e2e-port.mjs -- npm run test:e2e:leak
node tools/run-with-strict-e2e-port.mjs -- npm run test:e2e:perf
node tools/check-bundle-budget.mjs
node tools/verify-production-surface.mjs
npm run test:simulator:full -- --surface production
git add test/e2e/leak.spec.js test/e2e/battle.spec.js test/e2e/perf.spec.js \
  src/styles.css package.json package-lock.json \
  playwright.random-agent.config.js .github/workflows/ci.yml \
  .github/workflows/perf.yml .github/workflows/simulator-safari.yml \
  test/test_engine.js AGENTS.md docs/README.md
git commit -m "test: prepare the P5 combat gates"
git push origin codex/round5-production-engineering
test -z "$(git status --short)"
```

`test:e2e:leak`, deterministic cache/texture allocation and bundle failures are
hard. A valid portrait/LITE or desktop/Full `PERF_WARNING` is recorded and does
not block this source commit; missing/invalid/crashed perf evidence does.

Use `apply_patch` to append `P5 baseline source: <actual HEAD>` to the ignored
ledger after the clean push.

- [ ] **Step 6: Recapture and review the P5 visual contract in-phase**

Reload the durable source SHA and execute the full local/remote install flow:

```bash
P5_SOURCE_SHA=$(sed -n 's/^P5 baseline source: //p' .superpowers/sdd/progress.md | tail -1)
test -n "$P5_SOURCE_SHA"
test "$(git rev-parse HEAD)" = "$P5_SOURCE_SHA"
test -z "$(git status --short)"
git push origin codex/round5-production-engineering
node tools/run-with-strict-e2e-port.mjs -- npm run test:e2e:update
node tools/run-with-strict-e2e-port.mjs -- npm run test:e2e:visual
node tools/run-baseline-workflow.mjs \
  --workflow update-baselines.yml \
  --ref codex/round5-production-engineering \
  --sha "$P5_SOURCE_SHA" \
  --out /tmp/spirebound-round5-p5-linux-baselines
node tools/install-baseline-artifact.mjs \
  --artifact /tmp/spirebound-round5-p5-linux-baselines \
  --expect-sha "$P5_SOURCE_SHA" \
  --destination test/e2e/visual.spec.js-snapshots
node tools/run-with-strict-e2e-port.mjs -- npm run test:e2e:visual
```

`run-baseline-workflow.mjs` rejects any dispatch/run whose `headSha` differs
from `P5_SOURCE_SHA`; the installer rejects manifest/path/hash drift. Inspect every
changed hand/card/floaty/banner/pile frame and deterministic terminal state. A
fresh FE agent checks the approved card/ceremony contract; fresh QA checks the
evidence and code-quality package. Do not carry a P4 baseline into P6 when P5
changed its contract. Require suite key `p5Cards` and the unchanged fixed
`0.01` policy before capture; a failure cannot authorise a tolerance edit.

- [ ] **Step 7: Verify and commit the baseline-only delta**

```bash
npm test
node tools/run-with-strict-e2e-port.mjs -- npm run test:e2e
node tools/run-with-strict-e2e-port.mjs -- npm run test:e2e:webkit
node tools/run-with-strict-e2e-port.mjs -- npm run test:e2e:leak
node tools/run-with-strict-e2e-port.mjs -- npm run test:e2e:perf
node tools/check-bundle-budget.mjs
node tools/verify-production-surface.mjs
npm run test:simulator:full -- --surface production
node tools/run-with-strict-e2e-port.mjs -- npm run test:e2e:visual
git add test/e2e/visual.spec.js-snapshots
git commit -m "test: approve the P5 visual baselines"
```

Preserve any valid `PERF_WARNING` in the P5 evidence. It cannot make the visual
gate red or trigger a tolerance/baseline change.

### Task 30: `[PE]` Close P5 and publish the P6 hand-off

**Files:**
- Create: `docs/superpowers/reports/2026-07-10-round5-p5-to-p6-handoff.md`
- Prefix only: generated `dist/**`, `CONTEXT.md`, `AGENTS.md`, `docs/README.md`

**Interfaces:**
- Produces `Decision: GO TO P6` or `Decision: P5 PREFIX EXIT` plus frozen selectors/state/asset ids and rollback.

- [ ] **Step 1: Re-run P4 commands plus P5 leak/full matrix**

Run this exact clean-source gate:

```bash
npm run test:ci
npm test
npm run test:progression
npm run test:act-coupling
node tools/run-with-strict-e2e-port.mjs -- npm run test:e2e
node tools/run-with-strict-e2e-port.mjs -- npm run test:e2e:webkit
node tools/run-with-strict-e2e-port.mjs -- npm run test:e2e:perf
PERF=1 PERF_TIER=full node tools/run-with-strict-e2e-port.mjs -- npx playwright test perf --project=desktop --workers=1 --no-deps
node tools/run-with-strict-e2e-port.mjs -- npm run test:e2e:leak
node tools/check-bundle-budget.mjs
node tools/verify-production-surface.mjs
npm run test:simulator:full -- --surface production
npm run test:round5:standing -- --profile p5
git diff --check
```

Require P1/P4/P5 trace
parity, exact DOM list, one composer, keyboard path, recovery, cache/heap/bundle/
perf and Darwin/Linux visual approval. Record valid performance target misses
as `PERF_WARNING`; they cannot by themselves select `P5 PREFIX EXIT` or block
`GO TO P6`. The declared heap leak/cache/bundle invariants and invalid/crashed
performance evidence remain blocking.

- [ ] **Step 2: Generate the cross-lane manifest**

Record exact PE commit and rollback commit; root selectors; allowed descendants
and data attributes; CSS-variable names; token values; asset ids and fallbacks;
Music Cue ids and SFX ids as separate sets; every screen/fresh/grown state; all
five canonical shapes; capture commands/output paths; FE write set; and required
evidence. FE may still edit only its dedicated stylesheet, contract/reports and
named assets. For the P6 lane specifically, the Task 2 experience contract is
read-only: Task 21 already owner-approved it and PE transcribed its values into
tokens/tests. The manifest records its hash as frozen.

- [ ] **Step 3: Obtain independent QA review and close the decision**

PE authors the complete manifest and decision first. A fresh QA agent verifies
it without editing the file. For `Decision: GO TO P6`, commit only the hand-off:

```bash
git add docs/superpowers/reports/2026-07-10-round5-p5-to-p6-handoff.md
git commit -m "docs: publish the P5 to P6 hand-off"
```

For `Decision: P5 PREFIX EXIT`, obtain the protocol's broad-review approval;
the following commands implement its one build/commit/push closure:

```bash
npm run build
git add dist CONTEXT.md AGENTS.md docs/README.md \
  docs/superpowers/reports/2026-07-10-round5-p5-to-p6-handoff.md
git diff --cached --check
git commit -m "build: ship the Round 5 P5 combat prefix"
git push -u origin codex/round5-production-engineering
gh pr create --base main --head codex/round5-production-engineering \
  --title "Round 5 P5 combat prefix" \
  --body-file docs/superpowers/reports/2026-07-10-round5-p5-to-p6-handoff.md
```

Watch required checks and stop all execution after opening the P5 prefix PR.

---

### Task 31: `[FE]` Author the exclusive Round 5 screen stylesheet

**Files (FE worktree only):**
- Create: `src/styles/round5-screens.css`
- Read-only: `docs/superpowers/specs/2026-07-10-round5-fe-experience-contract.md`

**Interfaces:**
- Consumes: the Task 30 selector/state manifest and experience contract.
- Produces: presentation-only rules; no JavaScript, generated content or state through CSS.

- [ ] **Step 1: Rebase FE onto the P5 hand-off**

```bash
git fetch origin --prune
git rebase codex/round5-production-engineering
```

Expected: Task 21's recorded FE merge already makes every contract commit an
ancestor of the PE hand-off, so this advances the FE branch to the P5 head with
zero replayed commits and a clean status. If Git attempts to duplicate/replay a
contract commit, stop and repair ancestry rather than accepting duplicate
history.

- [ ] **Step 2: Validate the frozen selector vocabulary**

The stylesheet may use only:

```text
.r5-title, .r5-title-parallax, .r5-title-wordmark, .r5-title-actions
.r5-embark, .r5-aspect-card, .r5-vow-dial, .r5-begin-rite
.r5-end, .r5-end--fallen, .r5-end--victory, .r5-monument, .r5-dawn-ledger
.r5-scene-panel, .r5-scene-header, .r5-rewards, .r5-shop, .r5-event,
.r5-rest, .r5-lamplighter, .r5-vigil, .r5-map
[data-r5-state], [data-r5-profile], [data-motion], [data-tier]
```

Existing shared button/focus/typography classes may be composed but not
redefined globally. Any missing selector returns to PE; FE must not edit markup.
Any desired value/motion change is not a Task 31 stylesheet exception: return
to the Task 21 owner checkpoint, let FE amend the contract on its branch, have
PE merge it and synchronise tokens/tests, rerun complete P4/P5 standing gates
and publish a new Task 30 hand-off before resuming Task 31.

- [ ] **Step 3: Write all shape/state/policy rules**

Use stage container queries, `cqw`/`cqh`, bundled font families and approved
tokens. Implement rest/hover/pressed/disabled/focus, fresh/grown, loading/ready,
LITE and REDUCED. No `vw`/`vh`, system font, linear easing, browser-default
scrollbar or unstyled focus ring. Reference only the PE-injected `--r5-*`
variables for every Task 2 value; do not repeat its raw hex/duration/easing
literals in the stylesheet.

- [ ] **Step 4: Run static FE gates**

```bash
git diff --check
if rg -n '\b(vw|vh)\b|transition[^;]*linear|font-family:[^;]*(system-ui|sans-serif)' \
  src/styles/round5-screens.css; then exit 1; fi
```

Expected: no findings.

- [ ] **Step 5: Commit FE-only output**

```bash
git add src/styles/round5-screens.css
git commit -m "style: add the Round 5 screen experience layer"
```

### Task 32: `[PE]` Implement Title and Embark presentation seams

**Files:**
- Modify: `src/ui/screens/title.js`, `src/ui/screens/embark.js`, `src/ui/rose.js`,
  `src/ui/tokens.js`, `src/ui/tween.js`
- Modify/Test: `test/e2e/stage.spec.js`, `trace.spec.js`, `emberglass.spec.js`

**Interfaces:**
- Produces frozen P6 selector/state markup for Title/Embark; consumes FE contract values.
- Does not import the FE stylesheet until Task 35.

- [ ] **Step 1: Write semantic/state tests first**

Assert fresh/grown title and Embark expose the fixed `.r5-*` selectors/data
states, reveal logic is unchanged, ignition runs once per page session, Begin
emits lantern-lighting span then enters map, and REDUCED lands directly on the
named final state.

Cover the Title Rose states here, before Task 34: Rose absent, medallion loading,
inert and ready, including decode failure, labelled fallback, keyboard focus and
REDUCED terminal frames. These tests consume the existing Phase-2 reveal/asset
facts and never invent quest state.

- [ ] **Step 2: Implement stable markup and ceremonies**

Use exact selectors from Task 31. Title supports three P7 parallax layer asset
ids with existing `title.png` fallback; no generated asset is required yet.
Wire only existing Music/SFX catalogue ids from the FE contract. Embark keeps
engine/Vigil reveal decisions untouched.

- [ ] **Step 3: Verify semantic gates and commit**

```bash
npm test
node tools/run-with-strict-e2e-port.mjs -- npx playwright test stage trace --project=desktop --workers=1 --no-deps
git add src/ui/screens/title.js src/ui/screens/embark.js src/ui/rose.js \
  src/ui/tokens.js src/ui/tween.js test/e2e/stage.spec.js \
  test/e2e/trace.spec.js test/e2e/emberglass.spec.js
git commit -m "feat: harden Title and Embark presentation"
```

### Task 33: `[PE]` Implement Fall and Dawn ceremonies

**Files:**
- Modify: `src/ui/screens/end.js`, `src/ui/tween.js`, `src/ui/drain.js`,
  `src/ui/overlay.js`
- Create: `test/e2e/end-ceremony.spec.js`
- Modify/Test: `test/e2e/emberglass.spec.js`,
  `test/e2e/emberglass-persistence.spec.js`, `test/e2e/trace.spec.js`

**Interfaces:**
- Produces monument-carving and dawn presentation spans; persistence/ledger logic remains unchanged.

- [ ] **Step 1: Write failing full/reduced ceremony tests**

Assert exact order: Fall plate rise→chisel beats→ember spray→bequest→whisper→
stats; Dawn bloom→ascended parallax→shard/page queue→ledger→close. Assert
existing pending-dawn persistence survives reload and REDUCED produces one
terminal frame with settled spans.

Require one presentation case for each exact Dawn owner: `whisper`,
`questReveal`, `questProgress`, `questUnlock`, `pageRead`, `eighthResolved`,
`shadeResolved`, `questComplete`, `shardGrant` and non-path `act4Reveal`, plus
cursor-save retry, final-clear retry and reload resume from the acknowledged
cursor. Fall includes the unpaid Shade-bequest state with no phantom choice.
All cases preserve the reviewed `run-effects` transaction owner and the
overlay-owned inert/focus/retry modal.

- [ ] **Step 2: Implement from the FE motion table**

Use `.r5-end*`, `.r5-monument`, `.r5-dawn-ledger`; pass presentation payloads
through trace/replay descriptors. Reuse `sunrise`, confetti and `tweenNum` only
where their contract still matches. Audio calls use existing ids only.
The compatibility CSS modifiers `.r5-end--fallen`/`.r5-end--victory`, internal
outcomes `death`/`win`, cue ids `defeat`/`victory` and display titles
`FALLEN`/`ASCENDED` stay unchanged; docs and domain narration call the outcomes
Fall and Dawn.

- [ ] **Step 3: Verify and commit**

```bash
npm test
node tools/run-with-strict-e2e-port.mjs -- npx playwright test end-ceremony trace --project=desktop --workers=1 --no-deps
git add src/ui/screens/end.js src/ui/tween.js src/ui/drain.js src/ui/overlay.js \
  test/e2e/end-ceremony.spec.js test/e2e/emberglass.spec.js \
  test/e2e/emberglass-persistence.spec.js test/e2e/trace.spec.js
git commit -m "feat: add Fall and Dawn ceremonies"
```

### Task 34: `[PE]` Implement remaining P6 screens and deterministic capture

**Files:**
- Modify: `src/ui/screens/reward.js`, `shop.js`, `event.js`, `rest.js`, `lamplighter.js`, `vigil.js`, `map.js`
- Create: `test/e2e/p6-screens.spec.js`, `test/e2e/contrast.spec.js`, `tools/capture-round5-contact-sheets.mjs`
- Modify: `test/e2e/visual.spec.js`
- Create: `test/simulator/screens-profile.test.mjs`
- Modify: `test/simulator/assertions.mjs`, `test/simulator/run.mjs`
- Modify: `package.json`

**Interfaces:**
- Produces all P6 markup/state seams and deterministic fresh/grown capture URLs.

- [ ] **Step 1: Write per-screen state tests first**

For each screen assert fresh/grown profile, all five stage shapes, scene-panel
theme resolution, card texture use in shop/rewards, and named ceremony trace.
Map keeps DOM-on-3D projection and adds entrance/path/camera spans only.

Treat the Task 2 additive Phase-2 matrix as mandatory capture/state coverage,
not extra screens. Task 32 already owns Title Rose absent/loading/inert/ready;
Task 33 already owns all ten Dawn events, both retries and unpaid Shade bequest.
This task implements the Vigil Rose atomic raster/fallback, four pane states,
selection/whispers/six shards; all Hollow payment/save/recovery states;
Witchlight/eighth markers, hidden/visible/open sealed-door promise and drag
suppression; and all four Usurper shop states. Re-run the earlier Title and end
cases in the integrated matrix. `act4Reveal` and the open sealed door remain a
non-path promise with no node, route or Act 4 gameplay.

`contrast.spec.js` visits every visible text/state in the same matrix, resolves
computed foreground/background colours with alpha compositing, and requires
≥4.5:1. It fails on transparent/unknown backgrounds rather than assuming a
colour. Canvas card images use the P5 pixel-sampling result, not DOM CSS maths.

Add deterministic visual cases for Title/Embark fresh and grown; Fall; Dawn;
rewards and boss relic; rest and treasure; lamplighter and Hollow;
Vigil; and map. The table covers all five canonical shapes at least once and
both profile states for each screen family. Add the cases now, but do not create
their baselines until the Task 37 owner gate.

Add a pure Simulator `production/screens` journey contract that visits the
deterministic Title/Embark, reward-family, rest-family, lamplighter-family,
Vigil and map scenarios, waits `settle()` and checks trace/overflow/viewport.
It inherits and asserts the NDJSON/text failure-artifact paths.

- [ ] **Step 2: Implement stable markup/wiring**

Use the fixed selector set. PE owns every handler, theme/card-texture resolve,
audio call, trace/probe hook, accessibility state and scenario URL. No FE-owned
CSS rule is copied into `src/styles.css`.

PR #16's `hollowLamplighter`, `roseWindow` and `sealedDoor` Music Cues are
already live PE-owned predecessor behaviour, not FE proposals. Preserve their
real state owners and the Task 6 audio/trace characterisation while applying
screen presentation. The FE contract may align visual beats but cannot mark,
wire, defer or replace a cue. A forced gallery preview cannot replace the
gameplay evidence, and `sealedDoor` remains a non-path promise.

- [ ] **Step 3: Implement the capture script**

Add package script `capture:round5:contact-sheets`. The tool drives URL-addressed
Lab/probe scenarios for every screen × stage shape × fresh/grown state **and**
every named additive Phase-2 substate from the Task 2 contract. Its frozen
capture manifest lists all 43 additive rows by stable state id and maps each to
its owning base screen; a missing/duplicate state fails before capture. The tool
waits on presentation settle/fonts/images, freezes, captures PNGs and composes
one sheet per screen with separate base and Phase-2-substate sections under
`test-results/round5-contact-sheets/`.

- [ ] **Step 4: Verify and commit**

```bash
npm test
node tools/run-with-strict-e2e-port.mjs -- npx playwright test p6-screens contrast trace --project=desktop --workers=1 --no-deps
node --test test/simulator/screens-profile.test.mjs
git add src/ui/screens/reward.js src/ui/screens/shop.js \
  src/ui/screens/event.js src/ui/screens/rest.js \
  src/ui/screens/lamplighter.js src/ui/screens/vigil.js \
  src/ui/screens/map.js test/e2e/p6-screens.spec.js test/e2e/contrast.spec.js \
  test/e2e/visual.spec.js \
  tools/capture-round5-contact-sheets.mjs package.json package-lock.json \
  test/simulator/screens-profile.test.mjs test/simulator/assertions.mjs \
  test/simulator/run.mjs
git commit -m "feat: harden the remaining Round 5 screens"
```

### Task 35: `[PE]` Integrate FE CSS and produce P6 contact sheets

**Files:**
- Modify: `src/main.js`
- Merge: FE stylesheet commit
- Create: `docs/superpowers/reports/2026-07-10-round5-p6-capture-evidence.md`
- Create: `docs/superpowers/artifacts/round5-p6-contact-sheets/**`

**Interfaces:**
- Produces styled P6 evidence for FE/owner review.

- [ ] **Step 1: Merge the exact FE head**

Record `FE_HEAD=$(git -C ../round5-front-end rev-parse HEAD)`, verify its diff is
within the FE write set, record `PE_PRE_FE_CSS=$(git rev-parse HEAD)`, then merge
that exact hash with `--no-ff` and record
`FE_CSS_MERGE=$(git rev-parse HEAD)`. The capture evidence
freezes selectors/write set, FE SHA, PE rollback SHA and rollback command
`git revert -m 1 "$FE_CSS_MERGE"`. Add
`import './styles/round5-screens.css';` in PE-owned `src/main.js`.

Commit the PE-owned import before capture, then require a clean immutable
source head:

```bash
git add src/main.js
git commit -m "style: integrate the Round 5 screen experience layer"
P6_CAPTURE_SOURCE_SHA=$(git rev-parse HEAD)
test -z "$(git status --short)"
```

Use `apply_patch` to append `P6 capture source: <actual hash>` to the ignored
SDD ledger. Do not rely on the shell variable outside this command block.

- [ ] **Step 2: Run all screen/visual gates**

```bash
npm test
node tools/run-with-strict-e2e-port.mjs -- npx playwright test p6-screens end-ceremony contrast stage trace --project=desktop --project=portrait --project=landscape --workers=1 --no-deps
node tools/run-with-strict-e2e-port.mjs -- npm run capture:round5:contact-sheets
```

Inspect every individual capture before composing sheets. Record contrast,
overflow, missing asset/fallback and trace integrity results.

Promote the deterministic individual captures, composed sheets and a generated
`manifest.json` into committed
`docs/superpowers/artifacts/round5-p6-contact-sheets/`. The manifest records one
SHA-256/media type/byte size per file, capture command, source commit and
generated-at time. The evidence report links only committed relative paths, so
FE can reproduce and verify the hand-off after fast-forwarding its worktree.
Reload `P6_CAPTURE_SOURCE_SHA` from the ledger and require it equals current
`HEAD` immediately before capture and equals the manifest source. Any CSS, markup,
test or capture-tool correction is committed first, updates that SHA, and
reruns every capture; evidence may never name the pre-import merge head.

- [ ] **Step 3: Commit integration/evidence**

```bash
git add docs/superpowers/reports/2026-07-10-round5-p6-capture-evidence.md \
  docs/superpowers/artifacts/round5-p6-contact-sheets
git commit -m "test: capture the integrated P6 screen pass"
```

Do not refresh visual baselines before FE critique and owner sign-off.

### Task 36: `[FE]` Critique the P6 contact sheets mechanically

**Files (FE worktree only):**
- Create: `docs/superpowers/reports/2026-07-10-round5-fe-contact-sheet-review.md`

**Interfaces:**
- Consumes committed Task 35 capture evidence/artifacts.
- Produces one pass/fail row per screen/state/shape; no runtime edits.

- [ ] **Step 1: Fast-forward FE onto Task 35**

Because Task 35 merged the exact FE head, run
`git merge --ff-only codex/round5-production-engineering`; verify the prior FE
commit is an ancestor and both worktrees are clean. Do not replay already merged
FE commits.

- [ ] **Step 2: Review against the mechanical checklist**

For every sheet record interactive states, motion terminal frames, non-default
browser treatment, contrast, overflow, fresh/grown coherence, LITE/REDUCED and
asset fallback. Each failure names screen/state/shape, expected rule and exact
recommended FE CSS change; no JS suggestion.

- [ ] **Step 3: Fix CSS-only findings and re-capture through PE**

If needed, edit only `round5-screens.css`, commit, hand the hash to PE, and have
PE merge it and run `npm test`, the three-project
`p6-screens end-ceremony contrast stage trace` command, and
`node tools/run-with-strict-e2e-port.mjs -- npm run
capture:round5:contact-sheets` from a clean committed source head.
Repeat until the report says `FE pre-filter: PASS`.

- [ ] **Step 4: Commit the review**

```bash
git add src/styles/round5-screens.css \
  docs/superpowers/reports/2026-07-10-round5-fe-contact-sheet-review.md
git commit -m "docs: approve the P6 FE contact-sheet pre-filter"
```

### Task 37: `[PE]` Close P6 after the blocking owner checkpoint

**Files:**
- Create: `docs/superpowers/reports/2026-07-10-round5-p6-owner-gate.md`
- Modify: `docs/superpowers/reports/2026-07-10-round5-p6-capture-evidence.md`, `docs/superpowers/artifacts/round5-p6-contact-sheets/**`
- Modify: visual baselines only after sign-off, `CONTEXT.md`, `AGENTS.md`, `docs/README.md`
- Prefix only: generated `dist/**`
- Create: `docs/superpowers/artifacts/round5-p6-simulator-smoke/**`

**Interfaces:**
- Consumes the owner's non-delegable taste decision and produces the PE-owned
  gate evidence: `Decision: GO TO P7` or `Decision: P6 PREFIX EXIT`.

- [ ] **Step 1: PE merges the final FE CSS/review commit and re-captures**

Verify the merge diff remains FE-only and present the fixed-format sheets plus
FE PASS report to the owner. Before merging the final
FE correction/review head, record `PE_PRE_FE_P6=$(git rev-parse HEAD)`; after
`--no-ff`, record `FE_P6_MERGE=$(git rev-parse HEAD)`. The P6 gate report names
both hashes, frozen selector/stylesheet interface and rollback command
`git revert -m 1 "$FE_P6_MERGE"`.

Run the exact integrated recapture after the merge:

```bash
npm test
node tools/run-with-strict-e2e-port.mjs -- npx playwright test p6-screens end-ceremony contrast stage trace --project=desktop --project=portrait --project=landscape --workers=1 --no-deps
node tools/run-with-strict-e2e-port.mjs -- npm run capture:round5:contact-sheets
test -s test-results/round5-contact-sheets/manifest.json
node -e 'const fs=require("node:fs");const m=JSON.parse(fs.readFileSync("test-results/round5-contact-sheets/manifest.json"));if(m.sourceSha!==require("node:child_process").execFileSync("git",["rev-parse","HEAD"],{encoding:"utf8"}).trim())process.exit(1)'
```

After re-capture, compute a candidate manifest in `test-results` but keep the
worktree clean for the source-SHA push. The owner reviews those exact hashes.
After remote baseline collection and before Step 4 staging, promote the final
individual captures/sheets/manifest into the committed artifact directory and
update the capture-evidence source SHA/hashes. If outputs are byte-identical,
verify every manifest hash and record that fact; never finish with an ignored
`test-results`-only revision.

- [ ] **Step 2: Owner signs each screen set**

Record explicit pass/change decision for Title/Embark, Fall/Dawn,
non-combat panels and map in the execution ledger. Do not create/dirty the gate
report until remote baseline generation has locked the source SHA. No agent may
substitute its taste verdict.

The owner decision reviews only visual/timing taste around PR #16's already-live
Music Cues; it cannot approve, defer or undo gameplay wiring. PE must present
the Task 6/current audio/trace evidence for `hollowLamplighter`, `roseWindow`,
`sealedDoor` and the other Phase 2 call sites. Gallery force-preview evidence is
not accepted. Visual approval of `sealedDoor` never authorises an Act 4 route.

- [ ] **Step 3: Refresh baselines only after all owner passes**

First require the final FE merge/correction head to be committed and clean,
push it, and use `apply_patch` to append `P6 baseline source: <actual HEAD>` to
the ignored ledger. Then execute the complete local/remote install and
Simulator flow; any correction creates a new source commit/SHA, appends a new
ledger row and repeats the block. Require suite key `p6Screens` and the
unchanged fixed `0.01` policy before capture.

```bash
P6_SOURCE_SHA=$(sed -n 's/^P6 baseline source: //p' .superpowers/sdd/progress.md | tail -1)
test -n "$P6_SOURCE_SHA"
test "$(git rev-parse HEAD)" = "$P6_SOURCE_SHA"
test -z "$(git status --short)"
git push origin codex/round5-production-engineering
node tools/run-with-strict-e2e-port.mjs -- npm run test:e2e:update
node tools/run-with-strict-e2e-port.mjs -- npm run test:e2e:visual
node tools/run-baseline-workflow.mjs \
  --workflow update-baselines.yml \
  --ref codex/round5-production-engineering \
  --sha "$P6_SOURCE_SHA" \
  --out /tmp/spirebound-round5-p6-linux-baselines
node tools/install-baseline-artifact.mjs \
  --artifact /tmp/spirebound-round5-p6-linux-baselines \
  --expect-sha "$P6_SOURCE_SHA" \
  --destination test/e2e/visual.spec.js-snapshots
node tools/run-with-strict-e2e-port.mjs -- npm run test:e2e:visual
npm run test:simulator:smoke -- --surface production --journey screens
npm run test:round5:standing -- --profile p6
```

Promote the two Simulator JSON/screenshots/text/NDJSON rows plus their
source-SHA/path/bytes/SHA-256 manifest into the declared P6 artifact directory,
and promote the final contact-sheet manifest/captures from Step 1. The baseline
helper rejects a workflow `headSha` mismatch and the installer rejects all
manifest/path/hash drift.

Record any valid FPS/frame-time `PERF_WARNING` without changing the decision;
it cannot by itself force `P6 PREFIX EXIT` or block `GO TO P7`. Invalid/crashed
performance evidence and the standing hard bundle/leak/context/cache gates do
block closure.

- [ ] **Step 4: Commit GO or close the P6 prefix**

After promoting the final contact-sheet artifacts and baselines, run:

```bash
npm run test:ci
npm test
npm run test:progression
npm run test:act-coupling
node tools/run-with-strict-e2e-port.mjs -- npm run test:e2e
node tools/run-with-strict-e2e-port.mjs -- npm run test:e2e:webkit
node tools/run-with-strict-e2e-port.mjs -- npm run test:e2e:leak
node tools/run-with-strict-e2e-port.mjs -- npm run test:e2e:perf
node tools/check-bundle-budget.mjs
node tools/verify-production-surface.mjs
npm run test:simulator:smoke -- --surface production --journey screens
npm run test:round5:standing -- --profile p6
```

For `Decision: GO TO P7`, update the three status docs and commit:

```bash
git add docs/superpowers/reports/2026-07-10-round5-p6-owner-gate.md \
  docs/superpowers/reports/2026-07-10-round5-p6-capture-evidence.md \
  docs/superpowers/artifacts/round5-p6-contact-sheets \
  test/e2e/visual.spec.js-snapshots CONTEXT.md AGENTS.md docs/README.md \
  docs/superpowers/artifacts/round5-p6-simulator-smoke
git commit -m "docs: record the P6 owner gate"
```

For `Decision: P6 PREFIX EXIT`, obtain the protocol's broad-review approval;
the following commands implement its one build/commit/push closure:

```bash
npm run build
git add dist CONTEXT.md AGENTS.md docs/README.md \
  docs/superpowers/reports/2026-07-10-round5-p6-owner-gate.md \
  docs/superpowers/reports/2026-07-10-round5-p6-capture-evidence.md \
  docs/superpowers/artifacts/round5-p6-contact-sheets \
  test/e2e/visual.spec.js-snapshots \
  docs/superpowers/artifacts/round5-p6-simulator-smoke
git diff --cached --check
git commit -m "build: ship the Round 5 P6 presentation prefix"
git push -u origin codex/round5-production-engineering
gh pr create --base main --head codex/round5-production-engineering \
  --title "Round 5 P6 presentation prefix" \
  --body-file docs/superpowers/reports/2026-07-10-round5-p6-owner-gate.md
```

Watch required checks and stop all execution after opening the P6 prefix PR.

### Task 38: `[FE]` Author and promote the exact P7 visual package

**Files (FE worktree only):**
- Create candidates under: `scratch/style-tests/round5/{stage,title,meta}/`
- Create after owner approval: exact nine boss plates, three title layers, `src/assets/meta/unlock-toast-frame.png`
- Create: `docs/stage-art-bible.md`, `docs/superpowers/reports/2026-07-10-round5-store-fe-draft.md`
- Update: `docs/superpowers/reports/2026-07-10-round5-fe-contact-sheet-review.md`

**Interfaces:**
- Produces one preparation commit, one exactly-thirteen-file asset-only
  promotion commit and one report-only hand-off commit.
- Uses the documented image-generation workflow; does not edit manifests/theme code.

- [ ] **Step 1: Rebase onto the latest PE branch and invoke the image skill**

Use the repository's `docs/generated-art-workflow.md` and image-generation skill.
Generate candidates only at the scratch paths. Record prompt, generation id,
source/alpha path and rejection reason for every attempt. Each of `stage/`,
`title/` and `meta/` contains its own `prompt-ledger.md` and contact sheet.

- [ ] **Step 2: Build exact candidates**

Create the nine
`{rootheart,leviathan,sovereign}-{backdrop,mid,ledge}.png`, three
`round5-{back,mid,foreground}.png`, and `unlock-toast-frame.png` candidates.
Stage art preserves crop/horizon/ground/mobile focal rules; title keeps existing
wordmark fallback.

- [ ] **Step 3: Write the stage bible and store draft**

`docs/stage-art-bible.md` records boss-to-act mapping, layer/fallback ids,
dimensions/alpha contract, palette, horizon, ground, overlap, all-five-shape
mobile-safe zones, crop/contact-sheet criteria and fallback appearance. Store
draft records shot composition, feature graphic, icon/title crop, draft copy,
keyword candidates and `provisional/marketing-only` only.

- [ ] **Step 4: Commit the non-production preparation**

Commit only scratch candidates/ledgers/contact sheets, stage bible and store
draft:

```bash
git add scratch/style-tests/round5 docs/stage-art-bible.md \
  docs/superpowers/reports/2026-07-10-round5-store-fe-draft.md
git diff --cached --check
git diff --cached --name-only
if git diff --cached --name-only | rg '^src/assets/'; then exit 1; fi
git commit -m "docs: prepare the Round 5 ship-front candidates"
git show --name-only --format= HEAD
```

This commit may be prepared in parallel with P6. It contains no final-path
asset and makes no owner-approval claim.

- [ ] **Step 5: Owner promotion checkpoint**

Present candidate contact sheets. Record a separate explicit decision for each
of the thirteen files. Promote only approved assets to exact final paths;
rejected/unapproved candidates remain scratch-only.

- [ ] **Step 6: Commit exactly the thirteen approved assets**

Stage only:

```bash
git add src/assets/stage/rootheart-backdrop.png \
  src/assets/stage/rootheart-mid.png src/assets/stage/rootheart-ledge.png \
  src/assets/stage/leviathan-backdrop.png src/assets/stage/leviathan-mid.png \
  src/assets/stage/leviathan-ledge.png src/assets/stage/sovereign-backdrop.png \
  src/assets/stage/sovereign-mid.png src/assets/stage/sovereign-ledge.png \
  src/assets/title/round5-back.png src/assets/title/round5-mid.png \
  src/assets/title/round5-foreground.png \
  src/assets/meta/unlock-toast-frame.png
test "$(git diff --cached --name-only | wc -l | tr -d ' ')" = 13
git diff --cached --check
git commit -m "art: promote approved Round 5 ship-front assets"
```

Verify `git show --name-only --format= HEAD` lists exactly those thirteen paths.

- [ ] **Step 7: Record the immutable promotion hand-off separately**

Update only `2026-07-10-round5-fe-contact-sheet-review.md` with the promotion
SHA, thirteen owner decisions, file hashes, crop evidence, exact FE write set
and the frozen final-path interface. It explicitly requires PE to record a
pre-merge rollback SHA, merge SHA and revert command. Then commit:

```bash
git add docs/superpowers/reports/2026-07-10-round5-fe-contact-sheet-review.md
test "$(git diff --cached --name-only)" = \
  "docs/superpowers/reports/2026-07-10-round5-fe-contact-sheet-review.md"
git diff --cached --check
git commit -m "docs: record the Round 5 asset promotion hand-off"
test "$(git show --name-only --format= HEAD)" = \
  "docs/superpowers/reports/2026-07-10-round5-fe-contact-sheet-review.md"
```

### Task 39: `[PE]` Integrate P7 assets and build the provisional ship-front kit

**Files:**
- Modify: `src/packs/core/themes.js`, `src/ui/combat.js`, `src/ui/screens/title.js`, `src/ui/screens/end.js`
- Modify: `test/e2e/visual.spec.js`
- Modify: `test/e2e/battle.spec.js`
- Create: `src/ui/shipfront-assets.js`
- Create: `tools/capture-store-kit.mjs`, `docs/store-shot-list.md`, `docs/store-listing-content.md`
- Create: `docs/superpowers/reports/2026-07-10-round5-p7-handoff.md`
- Modify: `tools/gen-icons.sh`, `package.json`, `package-lock.json`, `docs/README.md`, `test/test_engine.js`
- Generate: `public/icon-180.png`, `public/icon-512.png`, `public/og.png`, `public/feature-graphic.png`, `docs/store-assets/round5/**`
- Generate exact evidence: `docs/store-assets/round5/manifest.json`

**Interfaces:**
- Consumes the exact FE promotion commit; produces theme/title/toast wiring and rerunnable capture assets.

- [ ] **Step 1: Merge and verify the FE promotion commit**

Record the FE preparation, asset-promotion and report-hand-off hashes. Ensure
every changed path is in the FE manifest, the promotion commit has exactly
thirteen PNGs and every final asset has per-file owner approval. Merge the exact
report-hand-off head with `--no-ff`; reject extra product files. Before merge,
record `PE_PRE_FE_P7=$(git rev-parse HEAD)`; after merge record
`FE_P7_MERGE=$(git rev-parse HEAD)`. The PE P7 hand-off report records all five
hashes, frozen asset interface/evidence, and rollback command
`git revert -m 1 "$FE_P7_MERGE"`.

- [ ] **Step 2: Write and observe the failing ship-front contracts**

Before wiring, add Node tests for:

```text
rootheart/leviathan/sovereign bossPlates resolve their exact three ids
an absent boss override resolves the standard theme plates
three round5 title layers resolve when available; title.png is the legacy fallback
unlock-toast-frame resolves with the existing deed/content illustration fallback
shot-list schema has exactly title/combat/map/rose-window/boss with seed/shape/profile
gen-icons in `--public-only` Round 5 mode rejects a missing explicit --source before writing any output; its legacy no-argument mode remains valid
visual suite declares three boss overrides, one absent-override fallback,
three-layer title, legacy title fallback, unlock frame and illustration fallback
```

The battle e2e starts each real boss through the normal combat route and asserts
the active plate ids; a normal encounter and a deliberately absent override use
the act-standard plates. A registry-only assertion is insufficient.

Create an import-safe pure `shipfront-assets.js` resolver contract and import-
safe shot-list validator in the test, then run `npm test`. Expected: FAIL because
the resolver/capture exports and wiring do not exist.

- [ ] **Step 3: Wire assets with fallbacks**

Register boss plates in each theme `bossPlates` slot; prove standard act fallback
when one is absent. Resolve three title layers with existing title fallback.
Use the generic unlock frame with existing deed/content illustration.

`combat.js` calls `resolveCombatPlates(theme, { kind, bossId }, available)` from
the pure resolver using the actual encounter kind/enemy boss id. It never maps
act numbers to boss names and never lets a normal fight consume boss overrides.

- [ ] **Step 4: Build deterministic capture tooling**

`capture-store-kit.mjs` stages title, bespoke combat, map, Rose Window and boss
through Lab/probe URLs, waits presentation settle, freezes and captures PNG plus
raw Playwright video. Write exact shot ids, seed, stage shape, profile, expected
copy and crop to `docs/store-shot-list.md`. One run writes the five provisional
PNGs and raw reference WebM below `docs/store-assets/round5/`; every output is
labelled provisional/marketing-only.

Add the exact package entry
`"capture:store-kit":"node tools/capture-store-kit.mjs"` and a Node source
assertion that it remains mapped to the durable script.

- [ ] **Step 5: Commit and push the immutable ship-front capture source**

Implement `--public-only` in `tools/gen-icons.sh` so it never writes tracked
`dist/`; Round 5 mode requires an explicit source while the tested legacy
no-argument fallback remains unchanged. Finalise `docs/store-listing-content.md`
from the FE draft with the PE age-rating/privacy checklist. Do not run either
capture/generation command yet.

Run the focused and standing gates, then commit every non-generated input:

```bash
npm test
node tools/run-with-strict-e2e-port.mjs -- npx playwright test stage battle p6-screens trace --project=desktop --workers=1 --no-deps
npm run test:round5:standing -- --profile p6
git add src/packs/core/themes.js src/ui/combat.js src/ui/screens/title.js \
  src/ui/screens/end.js \
  src/ui/shipfront-assets.js \
  test/e2e/visual.spec.js test/e2e/battle.spec.js \
  tools/capture-store-kit.mjs tools/gen-icons.sh package.json package-lock.json \
  docs/store-shot-list.md docs/store-listing-content.md test/test_engine.js
git commit -m "feat: wire the provisional Round 5 ship-front source"
git push origin codex/round5-production-engineering
test -z "$(git status --short)"
```

Obtain fresh QA source approval and use `apply_patch` to append
`P7 store capture source: <actual HEAD>` to the ignored ledger.

- [ ] **Step 6: Generate and review outputs from that exact source**

Reload `P7_CAPTURE_SOURCE_SHA` from the ledger in the same shell, require clean
`HEAD` equality, then run the fixed no-fallback sequence:

```bash
P7_CAPTURE_SOURCE_SHA=$(sed -n 's/^P7 store capture source: //p' \
  .superpowers/sdd/progress.md | tail -1)
test -n "$P7_CAPTURE_SOURCE_SHA"
test "$(git rev-parse HEAD)" = "$P7_CAPTURE_SOURCE_SHA"
node tools/run-with-strict-e2e-port.mjs -- npm run capture:store-kit
tools/gen-icons.sh --public-only \
  --source docs/store-assets/round5/title.png
```

Require exactly the five declared PNGs, `raw-reference.webm` and
`docs/store-assets/round5/manifest.json`; validate each shot against
`docs/store-shot-list.md`. The manifest's `sourceSha` must equal
`P7_CAPTURE_SOURCE_SHA`. The icon script records its four public outputs under
that same manifest's `derivedPublicAssets` and creates no second metadata file.
Inspect every capture/output, write the P7 hand-off report, rerun the focused
and `p6` standing gates, and obtain fresh FE plus QA approval.

```bash
npm test
node tools/run-with-strict-e2e-port.mjs -- npx playwright test stage battle p6-screens trace --project=desktop --workers=1 --no-deps
npm run test:round5:standing -- --profile p6
```

- [ ] **Step 7: Commit only generated evidence and status docs**

```bash
git add docs/README.md \
  docs/superpowers/reports/2026-07-10-round5-p7-handoff.md \
  docs/store-assets/round5/title.png docs/store-assets/round5/combat.png \
  docs/store-assets/round5/map.png docs/store-assets/round5/rose-window.png \
  docs/store-assets/round5/boss.png docs/store-assets/round5/raw-reference.webm \
  docs/store-assets/round5/manifest.json \
  public/icon-180.png public/icon-512.png public/og.png \
  public/feature-graphic.png
git commit -m "feat: integrate the provisional Round 5 ship-front kit"
```

### Task 40: `[PE]` Run the Full-Round gate, rebuild `dist/` and open the PR

**Files:**
- Modify: `dist/**`, final visual baselines, `CONTEXT.md`, `AGENTS.md`, `docs/README.md`
- Create: `docs/superpowers/reports/2026-07-10-round5-full-round-gate.md`
- Create: `docs/superpowers/artifacts/round5-full-simulator-profiles/**`

**Interfaces:**
- Produces Full-Round completion evidence and a reviewable PR; no hidden claims.

- [ ] **Step 1: Recapture the final P7 visual contract in-phase**

First run `git fetch origin --prune`, record the fetched base SHA in the ignored
ledger (Step 3 copies it into the report as `Base SHA: <hash>`) and require
`git merge-base --is-ancestor origin/main HEAD`. If not,
merge `origin/main` normally, resolve with TDD and commit; do not rebase or
force-push the published branch. That merge is a source change, so the source
SHA below is taken after it and all Darwin/Linux baselines and FE/QA reviews are
generated again.

Before any baseline update, require the exact Task 39/merged-main source head is
clean. Read `docs/store-assets/round5/manifest.json.sourceSha` and require no
diff from that commit to `HEAD` across `src/**`, non-snapshot `test/**`,
`index.html`, package/lock, Vite/Playwright configs, `tools/capture-store-kit.mjs`,
`tools/gen-icons.sh` and `docs/store-shot-list.md`. If any such path changed
(including an `origin/main` merge), run the exact store refresh block below,
obtain FE/QA approval and commit the evidence-only delta. Only after the
equivalence check passes may baseline capture begin.

Use this exact equivalence check; exit 42 triggers the Task 39 refresh described
above, after which reload the new manifest and rerun it:

```bash
STORE_SOURCE_SHA=$(node -e "const fs=require('node:fs');const m=JSON.parse(fs.readFileSync('docs/store-assets/round5/manifest.json'));process.stdout.write(m.sourceSha||'')")
test -n "$STORE_SOURCE_SHA"
git cat-file -e "$STORE_SOURCE_SHA^{commit}"
git diff --quiet "$STORE_SOURCE_SHA"..HEAD -- \
  src test ':(exclude)test/e2e/visual.spec.js-snapshots/**' \
  public ':(exclude)public/icon-180.png' ':(exclude)public/icon-512.png' \
  ':(exclude)public/og.png' ':(exclude)public/feature-graphic.png' \
  index.html package.json package-lock.json vite.config.js \
  playwright.config.js playwright-server.js playwright.random-agent.config.js \
  tools/capture-store-kit.mjs tools/gen-icons.sh docs/store-shot-list.md || exit 42
```

Exit 42 means: with clean current `HEAD`, use `apply_patch` to append
`P7 store recapture source: <actual HEAD>` to the ledger, then run:

```bash
P7_CAPTURE_SOURCE_SHA=$(sed -n 's/^P7 store recapture source: //p' .superpowers/sdd/progress.md | tail -1)
test -n "$P7_CAPTURE_SOURCE_SHA"
test "$(git rev-parse HEAD)" = "$P7_CAPTURE_SOURCE_SHA"
test -z "$(git status --short)"
node tools/run-with-strict-e2e-port.mjs -- npm run capture:store-kit
tools/gen-icons.sh --public-only --source docs/store-assets/round5/title.png
node -e 'const fs=require("node:fs");const m=JSON.parse(fs.readFileSync("docs/store-assets/round5/manifest.json"));if(m.sourceSha!==process.argv[1])process.exit(1)' "$P7_CAPTURE_SOURCE_SHA"
npm test
node tools/run-with-strict-e2e-port.mjs -- npx playwright test stage battle p6-screens trace --project=desktop --workers=1 --no-deps
npm run test:round5:standing -- --profile p6
git add docs/README.md \
  docs/superpowers/reports/2026-07-10-round5-p7-handoff.md \
  docs/store-assets/round5/title.png docs/store-assets/round5/combat.png \
  docs/store-assets/round5/map.png docs/store-assets/round5/rose-window.png \
  docs/store-assets/round5/boss.png docs/store-assets/round5/raw-reference.webm \
  docs/store-assets/round5/manifest.json \
  public/icon-180.png public/icon-512.png public/og.png public/feature-graphic.png
git diff --cached --check
git commit -m "feat: refresh the provisional Round 5 ship-front kit"
git push origin codex/round5-production-engineering
```

Fresh FE and QA approvals occur after generation and before the commit. Rerun
the exact equivalence check against the new manifest; do not continue on a
second exit 42.
Inspect title layers, boss overrides/fallback, unlock toast and every previously
approved P4–P6 frame. Reject a Linux artifact whose source SHA differs. Fresh
FE verifies the approved P7 visual package; fresh QA verifies evidence/quality.
Require suite key `p7Shipfront` and the unchanged fixed `0.01` policy before
capture.

With equivalence green, use `apply_patch` to append
`P7 final baseline source: <actual HEAD>` to the ignored ledger, then execute:

```bash
P7_SOURCE_SHA=$(sed -n 's/^P7 final baseline source: //p' .superpowers/sdd/progress.md | tail -1)
test -n "$P7_SOURCE_SHA"
test "$(git rev-parse HEAD)" = "$P7_SOURCE_SHA"
test -z "$(git status --short)"
git push origin codex/round5-production-engineering
node tools/run-with-strict-e2e-port.mjs -- npm run test:e2e:update
node tools/run-with-strict-e2e-port.mjs -- npm run test:e2e:visual
node tools/run-baseline-workflow.mjs \
  --workflow update-baselines.yml \
  --ref codex/round5-production-engineering \
  --sha "$P7_SOURCE_SHA" \
  --out /tmp/spirebound-round5-p7-linux-baselines
node tools/install-baseline-artifact.mjs \
  --artifact /tmp/spirebound-round5-p7-linux-baselines \
  --expect-sha "$P7_SOURCE_SHA" \
  --destination test/e2e/visual.spec.js-snapshots
node tools/run-with-strict-e2e-port.mjs -- npm run test:e2e:visual
git add test/e2e/visual.spec.js-snapshots
git diff --cached --check
git commit -m "test: approve the P7 visual baselines"
git push origin codex/round5-production-engineering
```

`run-baseline-workflow.mjs` requires the remote run `headSha` to equal
`P7_SOURCE_SHA`; the installer validates the manifest before copying. Any
source fix starts Step 1 again. Fresh FE/QA approve both platforms before the
baseline-only commit.

This makes every visual artifact part of the broad committed review range. No
subsequent step may change source/test/config without returning here and producing a
new source SHA plus both platforms again.

- [ ] **Step 2: Obtain broad approval of the complete committed source**

Set `BASE=$(git merge-base origin/main HEAD)` and generate the Superpowers final
code-review package for the exact range `BASE..HEAD`, including every committed
P0.5–P7 source, test, workflow, evidence and baseline path. A fresh most-capable broad
reviewer checks both spec compliance and code quality. One fixer resolves the
complete Critical/Important list with TDD and exact commits.

Any source, test, config, workflow or baseline fix is committed/pushed and
returns to Step 1: run its exact store-recapture block when capture inputs
changed, then run its exact Darwin/Linux block from the new SHA, repeat FE/QA
visual review, commit those baselines, then repeat this broad review. Continue
only when the committed head has an explicit approval and the PE worktree has
no unexpected changes.

- [ ] **Step 3: Run the complete gate, then generate final `dist/`**

```bash
npm run test:ci
npm test
npm run test:progression
npm run test:act-coupling
node tools/run-with-strict-e2e-port.mjs -- npm run test:e2e
node tools/run-with-strict-e2e-port.mjs -- npm run test:e2e:webkit
if node -e "const p=require('./package.json');process.exit(p.scripts?.['test:e2e:content-disk']?0:1)"; then
  node tools/run-with-strict-e2e-port.mjs -- npm run test:e2e:content-disk
fi
node tools/run-with-strict-e2e-port.mjs -- npm run test:e2e:leak
node tools/run-with-strict-e2e-port.mjs -- npm run test:e2e:perf
node tools/check-bundle-budget.mjs
node tools/verify-production-surface.mjs
npm run test:simulator:full -- --surface production
npm run test:simulator:profiles -- --surface production
npm run test:round5:standing -- --profile full
git diff --check
npm run build
```

The full report records both tiers' measured values and every valid
`PERF_WARNING`; such a warning cannot fail Full-Round or block the PR. Missing,
invalid, wrong-tier, zero/non-finite, no-frame or crashed measurements do fail,
as do the deterministic bundle, WebGL-owner, texture/cache and declared leak
gates. Do not rewrite policy or thresholds during closure.

The profile command produces exactly four actual-Simulator Safari rows:

```text
iPhone 17 Pro / portrait / fresh
iPhone 17 Pro / portrait / veteran
iPad mini (A17 Pro) / landscape / fresh
iPad mini (A17 Pro) / landscape / veteran
```

Fresh clears all profile keys, proves fresh Title→Embark→map, starts a real
normal encounter and plays one card. Veteran loads the validated grown
Vigil/stats plus valid Act 3 saved run, proves grown title, completed six-pane
Rose Window and sealed door, resumes map/combat and plays one card. Every row
requires settle, zero trace errors/drops/orphans, expected stage shape and one
real pointer path. PE then manually observes and drives the same checklist once
on each visible Simulator row; no screenshot-only verdict substitutes for the
interaction.

After the tracked build, allocate `PREVIEW_PORT` with the standard Node
ephemeral-port helper and start that exact `dist/` with:

```bash
PREVIEW_PORT=$(node -e "const s=require('node:net').createServer();s.listen(0,'127.0.0.1',()=>{console.log(s.address().port);s.close()})")
npm run preview -- --host 127.0.0.1 --port "$PREVIEW_PORT" --strictPort
```

Run that foreground command in a dedicated long-lived PTY/session and keep it
open while a separate visible-browser session performs both rows. Record the
PTY/session id and `http://127.0.0.1:$PREVIEW_PORT`, verify the listener and
served `dist/index.html` hash, then send Ctrl-C only to that owned session and
verify the port closed.
Manually drive two additional visible desktop
rows in the `desktop-landscape` shape: `fresh` and `veteran`. Fresh clears the
profile keys, uses real Title→Embark→map controls, enters a normal encounter,
drags/plays a card, opens/closes settings and verifies keyboard focus. Veteran
injects the same validated grown fixture used by the automated profile, reloads,
checks grown title, all six Rose panes and sealed door, resumes its Act 3
map/combat, plays a card, checks a tooltip and completes one keyboard End Turn.
For each row the human records browser name/version, preview origin, source SHA,
`dist/index.html` SHA-256, profile fixture hash, stage shape, every action and
observed result, plus one explicit `Manual desktop smoke: PASS|FAIL` field in
the Full-Round report. These two desktop manual rows are separate from and do
not replace the four actual-Simulator Safari rows.

Promote each row's JSON, screenshot, timestamped text and NDJSON plus a manifest
containing source SHA/path/media type/bytes/SHA-256 into
`docs/superpowers/artifacts/round5-full-simulator-profiles/`. The full report has
one automated and one manual PASS/FAIL field per row and lists the exact
excluded hardware claims. Verify trace integrity, all owner sign-offs, P7
rerunnable outputs, store-manifest source/input equivalence to final runtime,
no physical claims and exact FE/PE write history. The normal
tracked build is deliberately last so `dist/` is made
from the exact already-tested source. Then run:

Recompute `FULL_PROFILE_SOURCE_SHA=$(git rev-parse HEAD)` immediately before
promotion and require every row/manifest to equal it; also append it to the SDD
ledger so no subsequent shell relies on an earlier variable.

```bash
git status --short -- dist/
git diff --check -- dist/
```

If any command requires a source/test/config fix, do not patch around the gate:
commit/push the fix and return to Step 1. A build-only reproducibility failure
returns to this complete Step 3 after repair.

- [ ] **Step 4: Stage and review the exact final closure tree**

The report names exit contract `Full-Round`, commit ranges, every command and
result, CI/Simulator environments, bundle/perf/leak numbers, owner gates,
deferred physical/Capacitor claims and rollback commits.

```bash
git add dist CONTEXT.md AGENTS.md docs/README.md \
  docs/superpowers/reports/2026-07-10-round5-full-round-gate.md \
  docs/superpowers/artifacts/round5-full-simulator-profiles
git diff --cached --check
FINAL_CANDIDATE_TREE=$(git write-tree)
git diff --cached --name-only
git status --short
```

Use `apply_patch` to append `Final candidate tree: <actual hash>` to the ignored
SDD ledger, reload it, and assert it equals the current `git write-tree` before
building the closure review package. The reviewer verdict names this durable
hash. Each repair-loop restage appends a new row; only the last row is active.

The only staged paths are the declared `dist/**`, final Simulator profile
artifacts and final status/report docs;
P7 baselines are already committed in Step 1. Generate a second review package
containing: `origin/main...HEAD`; the complete `git diff --cached`; every
staged path/mode/blob id from `git ls-files -s`; SHA-256 for staged report and
generated assets; `git status --short`; and `FINAL_CANDIDATE_TREE`. A fresh
closure reviewer must explicitly approve that exact tree, not merely pre-Task40
HEAD.

Repair loop is binding:

- A source/test/config/workflow/baseline finding is unstaged, fixed with TDD,
  committed and pushed, then returns to Step 1 for both baselines, FE/QA review,
  the complete Step 3 gate/Simulator/build and both reviewers.
- A generated-`dist` finding reruns the complete Step 3 and this staged review.
- A report/status-doc-only finding is patched, restaged and re-reviewed; it
  cannot change a claim without matching recorded evidence.

Unstaging the owned closure paths does not discard them; while looping, they
remain the only permitted unstaged dirt and are regenerated before review.

- [ ] **Step 5: Commit the approved exact tree**

Immediately before commit, require the tree still matches the review verdict:

```bash
FINAL_CANDIDATE_TREE=$(sed -n 's/^Final candidate tree: //p' \
  .superpowers/sdd/progress.md | tail -1)
test -n "$FINAL_CANDIDATE_TREE"
test "$(git write-tree)" = "$FINAL_CANDIDATE_TREE"
git diff --cached --check
git commit -m "build: close the Round 5 Full-Round gate"
```

- [ ] **Step 6: Push and create the implementation PR**

Fetch once more and require fetched `origin/main` is both an ancestor and equal
to the base SHA recorded at Step 1. If it moved, return to Step 1; do not open a
PR with stale-base baselines or `dist/`.

```bash
git fetch origin --prune
RECORDED_BASE=$(sed -n 's/^Base SHA: //p' \
  docs/superpowers/reports/2026-07-10-round5-full-round-gate.md | tail -1)
test -n "$RECORDED_BASE"
test "$(git rev-parse origin/main)" = "$RECORDED_BASE"
git merge-base --is-ancestor origin/main HEAD
git push -u origin codex/round5-production-engineering
gh pr create --base main --head codex/round5-production-engineering \
  --title "Round 5 commercial engine" \
  --body-file docs/superpowers/reports/2026-07-10-round5-full-round-gate.md
```

Watch required checks. Do not merge a red PR. After green, use
`superpowers:finishing-a-development-branch`; preserve worktrees until the PR
has merged and post-merge tests pass.

---

## Plan self-review checklist

- [ ] Every golden-spec requirement maps to a numbered task or explicit out-of-scope constraint.
- [ ] Every product file has one PE owner; FE paths match the exact exclusive manifest.
- [ ] No task contains an unresolved placeholder, hidden numeric choice or unspecified interface.
- [ ] P0.5/P1/P2/P3/P4/P5/P6/P7 order and P4/P5/P6 prefix exits are explicit.
- [ ] Trace event/lifecycle/cursor/replay names are identical across tasks.
- [ ] P4/P5 renderer, router, probe and card-composer signatures are type-consistent.
- [ ] Each runtime task has a RED command, a focused GREEN command, phase-applicable gates and an exact commit boundary.
- [ ] Content Manager remains optional; its tests are conditional when omitted.
- [ ] Simulator results are compatibility evidence only; no physical-device gate appears.
- [ ] Phase 2 terminal/Dawn/Hollow/Shard/choice-latch, PR #15 hot apply and PR #16's 22-cue resolver/live call sites each retain one named owner and focused characterisation.
- [ ] P2 exposes exactly 28 content views plus four non-pack protocol exports; recursive freeze has no closure-backed accessors.
- [ ] Valid FPS/frame-time target misses remain `PERF_WARNING`; invalid/crashed evidence and deterministic bundle/context/cache/leak invariants retain their declared hard gates.
- [ ] Generated `dist/` is committed only by Task 40 or an explicitly selected supported prefix closure.
