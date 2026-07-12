# Spirebound documentation index

Quick map for agents and humans. Operational truth for running the game lives in the repo root [`README.md`](../README.md) and [`AGENTS.md`](../AGENTS.md).

## Run & architecture

| Doc | Purpose |
|---|---|
| [`../README.md`](../README.md) | Player-facing overview, tech stack, `npm test` / `npm run test:e2e` |
| [`../AGENTS.md`](../AGENTS.md) | Agent conventions: module graph, fixed stage, engine purity, commands |
| [`../CONTEXT-MAP.md`](../CONTEXT-MAP.md) | Ubiquitous language for the Climb and Vigil contexts |

### Round 5 P1 UI runtime — complete

`src/ui.js` is the stable two-export entry. `src/ui/index.js` is the sole
composition root; it wires the leaf screens and navigator to the frozen combat
API (`src/ui/combat.js`), the sole queue consumer (`src/ui/drain.js`) and the
read-only QA contract (`src/ui/probe.js`). Engine queue mutation remains in
drain; combat layout/input/synchronisation remains in combat; only index installs
`window.spirebound`, `window.__probe`, global listeners and observation sinks.
The semantic behaviour trace and presentation barrier remain renderer-neutral
contracts shared by Playwright regression journeys.

## Rendering

| Doc | Status |
|---|---|
| [`glass-crack-rendering.md`](glass-crack-rendering.md) | **Current** — transmission-glass crack/death rite (shipped), approved measures, superseded shader for the record, playground tuning workflow |

## Round 5 preparation

| Doc | Status |
|---|---|
| [`superpowers/specs/2026-07-09-canvas-ui-shipfront-design.md`](superpowers/specs/2026-07-09-canvas-ui-shipfront-design.md) | **Golden design** — PE-led commercial-grade production engineering with a small, isolated FE presentation lane; execution begins at P1 after loaded-predecessor/drift validation and proceeds through cumulative Playwright Chromium/WebKit browser gates |
| [`superpowers/plans/2026-07-10-round5-production-engineering.md`](superpowers/plans/2026-07-10-round5-production-engineering.md) | **Active executor** — Tasks through 10 complete; continuation starts at Task 11 under the active P2 content-table freeze; retired Task 3/4 numbers are non-executable historical tombstones |
| [`superpowers/reports/2026-07-12-round5-task10-handover.md`](superpowers/reports/2026-07-12-round5-task10-handover.md) | **Current handover** — exact Task 10 oracle provenance and gates, protected state, Task 11 start procedure, authorised write set and complete Task 11–40 inventory |
| [`superpowers/specs/2026-07-11-mobile-migration-simulator-tooling-design.md`](superpowers/specs/2026-07-11-mobile-migration-simulator-tooling-design.md) | **Deferred / non-executable** — future actual Safari/iOS Simulator automation design; requires explicit owner activation, fresh drift audit, a separate tool plan and tool-maturity proof |
| [`research/2026-07-10-ui-behaviour-trace-ios-simulator.md`](research/2026-07-10-ui-behaviour-trace-ios-simulator.md) | **Historical / superseded for Round 5 execution** — primary-source evidence boundaries and semantic-trace research; dated toolchain snapshot is non-current and any future mobile use flows through the deferred design |

## Active implementation specs

| Doc | Status |
|---|---|
| [`superpowers/specs/2026-07-09-i18n-locale-extraction-design.md`](superpowers/specs/2026-07-09-i18n-locale-extraction-design.md) | **Current / brainstorm** — multi-language readiness: extract English into `src/i18n/en/` + `t()` plumbing; no translations yet |
| [`superpowers/plans/2026-07-09-i18n-locale-extraction.md`](superpowers/plans/2026-07-09-i18n-locale-extraction.md) | Executor plan — rebased onto Emberglass Phase 2; content + core UI extracted; composers deferred |
| [`superpowers/specs/2026-07-11-app-versioning-design.md`](superpowers/specs/2026-07-11-app-versioning-design.md) | **Current** — package.json-sourced app version, title-screen label, release build convention |
| [`superpowers/plans/2026-07-11-app-versioning.md`](superpowers/plans/2026-07-11-app-versioning.md) | Executor plan — Vite define, title UI, `npm run release` |
| [`app-versioning.md`](app-versioning.md) | Operator note — display rules, bump policy, release flow |
| [`superpowers/specs/2026-07-10-e2e-ci-feedback-design.md`](superpowers/specs/2026-07-10-e2e-ci-feedback-design.md) | **Current** — owner-approved Draft fast feedback and Ready/full parallel Playwright gate |
| [`superpowers/plans/2026-07-10-e2e-ci-feedback.md`](superpowers/plans/2026-07-10-e2e-ci-feedback.md) | Executor plan — CI contract, smoke tags, shardable random coverage, and parallel GitHub gate |
| [`superpowers/specs/2026-07-12-p2-base-ci-standing-design.md`](superpowers/specs/2026-07-12-p2-base-ci-standing-design.md) | **Current** — owner-approved CI-backed Round 5 `p2-base` standing (<10 min, no fidelity loss) |
| [`superpowers/plans/2026-07-12-p2-base-ci-standing.md`](superpowers/plans/2026-07-12-p2-base-ci-standing.md) | Executor plan — CI mode/aggregators, wait-github-check, standing profile flip |
| [`superpowers/plans/2026-07-10-versioned-audio-packs.md`](superpowers/plans/2026-07-10-versioned-audio-packs.md) | **Current** — versioned Music/SFX selection, individual overrides, backend/runtime boundary |
| [`superpowers/specs/2026-07-09-entrance-progressive-delivery-design.md`](superpowers/specs/2026-07-09-entrance-progressive-delivery-design.md) | **Complete** — progressive delivery and entrances shipped in Phase 1; Emberglass chain shipped in Phase 2 |
| [`superpowers/plans/2026-07-09-entrance-progressive-delivery-phase1.md`](superpowers/plans/2026-07-09-entrance-progressive-delivery-phase1.md) | Executor plan, Phase 1 (delivery engine + entrances — **shipped**) |
| [`superpowers/plans/2026-07-09-entrance-progressive-delivery-phase2.md`](superpowers/plans/2026-07-09-entrance-progressive-delivery-phase2.md) | Executor plan, Phase 2 (variants + six Emberglass quests + Rose Window — **shipped**) |
| [`superpowers/reports/2026-07-09-emberglass-phase2-evidence.md`](superpowers/reports/2026-07-09-emberglass-phase2-evidence.md) | Phase 2 release evidence: pacing, unit/build/e2e gates, performance reference, art review, and manual journey |
| [`superpowers/specs/2026-07-08-vigil-surfaces-status-art-design.md`](superpowers/specs/2026-07-08-vigil-surfaces-status-art-design.md) | **Current** — status strip rasters, Vigil/meta emblems, defeat/victory plates, gallery + manifest gates |
| [`superpowers/plans/2026-07-08-vigil-surfaces-status-art.md`](superpowers/plans/2026-07-08-vigil-surfaces-status-art.md) | Executor plan (8 tasks); Task 8 = baselines + final sweep |
| [`superpowers/specs/2026-07-06-visualisation-hardening-polish-design.md`](superpowers/specs/2026-07-06-visualisation-hardening-polish-design.md) | **Complete / predecessor** — ground line, mesh death, Playwright kit, polish workstreams |
| [`superpowers/plans/2026-07-06-visualisation-hardening-polish.md`](superpowers/plans/2026-07-06-visualisation-hardening-polish.md) | Predecessor executor plan (12 tasks); fixed stage + 16:9 desktop |
| [`superpowers/specs/2026-07-06-visualisation-boost-design.md`](superpowers/specs/2026-07-06-visualisation-boost-design.md) | Predecessor spec (14 tasks executed) |
| [`superpowers/plans/2026-07-06-visualisation-boost.md`](superpowers/plans/2026-07-06-visualisation-boost.md) | Predecessor executor plan (historical) |

## Visual QA kit

- Config: [`../playwright.config.js`](../playwright.config.js) with strict-port resolution in [`../playwright-server.js`](../playwright-server.js) — desktop 1600×900, portrait 375×812, landscape 812×375; dev server **5174** by default. Set `SPIREBOUND_E2E_PORT=<free-port>` for an isolated launch that refuses to reuse an existing server.
- Suites: [`../test/e2e/`](../test/e2e/) — config/runner contracts, battlefield-editor disk writes, stage and combat geometry, battle/reward flows, Emberglass progression and persistence transactions, Hollow routing, versioned audio selection, visual baselines, random-agent coverage, and performance.
- In-page API: `window.__probe`, assembled by [`../src/ui/probe.js`](../src/ui/probe.js) and installed by [`../src/ui/index.js`](../src/ui/index.js) — geometry in **stage px**; failure artefacts include non-empty NDJSON and timestamped text projections.

## Fixed virtual stage (summary)

`src/stage.js` — five shapes, uniform scale, letterbox. Layout uses `@container stage` + `cqw`/`cqh`. Full contract: hardening spec §1b.

| shape | stage px | when |
|---|---|---|
| `phone-portrait` | 390×844 | touch, aspect < 0.567 |
| `phone-landscape` | 844×390 | touch, aspect > 1.765 |
| `pad-portrait` | 820×1180 | aspect < 1 |
| `pad-landscape` | 1180×820 | touch landscape, or desktop aspect ≤ 1.600 |
| `desktop-landscape` | 1458×820 | desktop (non-touch), aspect > 1.600 |

Override: `?shape=<name>`.

## Asset authoring

| Doc | Purpose |
|---|---|
| [`generated-art-workflow.md`](generated-art-workflow.md) | gpt-image-2 → Nano Banana → alpha → gallery |
| [`imagegen.md`](imagegen.md) | Codex CLI image tool wrapper |
| [`style-bible.md`](style-bible.md) | Naming, gallery sets (`live` / `legacy`) |
| [`../src/assets/README.md`](../src/assets/README.md) | Live asset inventory + promotion notes |
| [`card-production/`](card-production/) | 60-card production pipeline (complete) |
| [`relic-art-bible.md`](relic-art-bible.md), [`prop-art-bible.md`](prop-art-bible.md), [`card-art-bible.md`](card-art-bible.md), [`potion-art-bible.md`](potion-art-bible.md) | Per-category art bibles |

## Audio authoring and runtime

| Doc | Purpose |
|---|---|
| [`audio-packs.md`](audio-packs.md) | Version directories, runtime JSON, individual overrides, dev backend, rollback |
| [`audio-strategy-review-v2.md`](audio-strategy-review-v2.md) | Downloaded v2 authoring review reconciled with the versioned runtime |
| [`music-ledger.md`](music-ledger.md) | 22 Music Cue briefs and generation direction |
| [`sfx-ledger.md`](sfx-ledger.md) | SFX id contract, ElevenLabs prompts, trim and mix guidance |
| [`adr/0001-music-cue-layer.md`](adr/0001-music-cue-layer.md) | Music Cue layer and independent buses |
| [`adr/0002-versioned-audio-selection.md`](adr/0002-versioned-audio-selection.md) | Immutable base packs and runtime-selected versions/files |

## Older polish (reference)

| Doc | Notes |
|---|---|
| [`superpowers/specs/2026-07-04-visual-polish-details-design.md`](superpowers/specs/2026-07-04-visual-polish-details-design.md) | Pre-boost UI motion tokens |
| [`superpowers/plans/2026-07-04-visual-polish-details.md`](superpowers/plans/2026-07-04-visual-polish-details.md) | Historical |
