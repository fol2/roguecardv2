# Spirebound documentation index

Quick map for agents and humans. Operational truth for running the game lives in the repo root [`README.md`](../README.md) and [`AGENTS.md`](../AGENTS.md).

## Run & architecture

| Doc | Purpose |
|---|---|
| [`../README.md`](../README.md) | Player-facing overview, tech stack, `npm test` / `npm run test:e2e` |
| [`../AGENTS.md`](../AGENTS.md) | Agent conventions: module graph, fixed stage, engine purity, commands |
| [`../CONTEXT-MAP.md`](../CONTEXT-MAP.md) | Ubiquitous language for the Climb and Vigil contexts |

## Rendering

| Doc | Status |
|---|---|
| [`glass-crack-rendering.md`](glass-crack-rendering.md) | **Current** — transmission-glass crack/death rite (shipped), approved measures, superseded shader for the record, playground tuning workflow |

## Round 5 preparation

| Doc | Status |
|---|---|
| [`superpowers/specs/2026-07-09-canvas-ui-shipfront-design.md`](superpowers/specs/2026-07-09-canvas-ui-shipfront-design.md) | **Golden design** — PE-led commercial-grade production engineering with a small, isolated FE presentation lane; content registries, Semantic UI Behaviour Trace, Pixi combat UI, screen hardening, and ship-front. Progressive Delivery Phase 2 must merge before runtime execution |
| [`research/2026-07-10-ui-behaviour-trace-ios-simulator.md`](research/2026-07-10-ui-behaviour-trace-ios-simulator.md) | Primary-source research: structured AI-readable behaviour traces, Playwright/WebDriver consumption, Simulator evidence limits, and the owner decision to defer physical-device proof |

## Active implementation specs

| Doc | Status |
|---|---|
| [`superpowers/specs/2026-07-10-e2e-ci-feedback-design.md`](superpowers/specs/2026-07-10-e2e-ci-feedback-design.md) | **Current** — owner-approved Draft fast feedback and Ready/full parallel Playwright gate |
| [`superpowers/plans/2026-07-10-e2e-ci-feedback.md`](superpowers/plans/2026-07-10-e2e-ci-feedback.md) | Executor plan — CI contract, smoke tags, shardable random coverage, and parallel GitHub gate |
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
- In-page API: `window.__probe` in `src/ui.js` — geometry in **stage px**

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
