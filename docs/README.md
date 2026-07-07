# Spirebound documentation index

Quick map for agents and humans. Operational truth for running the game lives in the repo root [`README.md`](../README.md) and [`AGENTS.md`](../AGENTS.md).

## Run & architecture

| Doc | Purpose |
|---|---|
| [`../README.md`](../README.md) | Player-facing overview, tech stack, `npm test` / `npm run test:e2e` |
| [`../AGENTS.md`](../AGENTS.md) | Agent conventions: module graph, fixed stage, engine purity, commands |

## Rendering

| Doc | Status |
|---|---|
| [`glass-crack-rendering.md`](glass-crack-rendering.md) | **Current** — transmission-glass crack/death rite (shipped), approved measures, superseded shader for the record, playground tuning workflow |

## Active implementation specs (2026-07-06)

| Doc | Status |
|---|---|
| [`superpowers/specs/2026-07-06-visualisation-hardening-polish-design.md`](superpowers/specs/2026-07-06-visualisation-hardening-polish-design.md) | **Current** — fixes (ground line, mesh death), Playwright kit, polish workstreams |
| [`superpowers/plans/2026-07-06-visualisation-hardening-polish.md`](superpowers/plans/2026-07-06-visualisation-hardening-polish.md) | Executor plan (12 tasks); §Already landed covers fixed stage + 16:9 desktop |
| [`superpowers/specs/2026-07-06-visualisation-boost-design.md`](superpowers/specs/2026-07-06-visualisation-boost-design.md) | Predecessor spec (14 tasks executed) |
| [`superpowers/plans/2026-07-06-visualisation-boost.md`](superpowers/plans/2026-07-06-visualisation-boost.md) | Predecessor executor plan (historical) |

## Visual QA kit

- Config: [`../playwright.config.js`](../playwright.config.js) — desktop 1600×900, portrait 375×812, landscape 812×375; dev server **5174**
- Suites: [`../test/e2e/`](../test/e2e/) — `stage.spec` (fixed viewport, **green**), `geometry.spec` (ground line, red until Task 1), `battle.spec`, `visual.spec`, `perf.spec`
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

## Older polish (reference)

| Doc | Notes |
|---|---|
| [`superpowers/specs/2026-07-04-visual-polish-details-design.md`](superpowers/specs/2026-07-04-visual-polish-details-design.md) | Pre-boost UI motion tokens |
| [`superpowers/plans/2026-07-04-visual-polish-details.md`](superpowers/plans/2026-07-04-visual-polish-details.md) | Historical |
