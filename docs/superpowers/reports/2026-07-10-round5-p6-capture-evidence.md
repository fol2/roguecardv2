# Round 5 P6 capture evidence

**Date:** 2026-07-15 (UTC)  
**Branch:** `jamesto/round5-production-engineering-continuation`  
**Worktree:** `.worktrees/round5-production-engineering-continuation`  
**Machine:** Darwin arm64 (local focused gates; standing / full CI skipped per Ask-Matt cadence)

This record freezes the integrated FE screen stylesheet + PE experience layer for FE mechanical critique (Task 36). It does **not** refresh visual baselines, open a ship PR, or claim Safari / WKWebView / hardware mobile support.

**WebKit-safe API review: PASS** — Task 35 changes stay on standard DOM / `localStorage` / Playwright APIs; navigator freeze uses `globalThis.__p6NavFreeze` (no Safari-only, no `webkit*` prefixes, no non-standard gesture APIs).

---

## Status: PASS

Write-set remediation: unauthorized `src/styles/round5-pe-integration.css` deleted; PE layout bridges live only in authorized `src/styles.css`. `src/main.js` imports the FE layer solely via `import './styles/round5-screens.css';`.

| Gate | Result |
|---|---|
| FE merge write-set proof | PASS (`src/styles/round5-screens.css` only) |
| PE stylesheet write-set | PASS (bridges in `src/styles.css`; no `round5-pe-integration.css`) |
| `npm test` | PASS (`unit checks passed; monte-carlo: 300 runs`) |
| Focused Playwright `p6-screens end-ceremony contrast stage` (desktop, `--workers=1 --no-deps`) | PASS (**63** passed) |
| Contact-sheet capture | PASS (**183** rows; `sourceSha` == capture HEAD) |
| Visual baseline refresh | **not run** (deferred to FE critique / owner sign-off) |

---

## Frozen SHAs

| Role | SHA | Notes |
|---|---|---|
| PE tip before FE CSS merge | `272e0e491b91528f75c2e344211cdc42f839d381` | Clean tip at Task 35 start |
| P5→P6 FE hand-off / merge-base | `0364da33e16f98047b66b3421f295688fb04b022` | Ledger `P5 to P6 FE hand-off` |
| FE head (stylesheet authoring) | `cd099004626b7f744e440ff5d7db4d9ad9d36cb2` | `../round5-front-end` |
| **FE_CSS_MERGE** | `2795d397fff5efb5202f18f4cdd348a7a211826c` | `style: merge Round 5 FE screen stylesheet` (`^1` = PE tip, `^2` = FE head) |
| Integrate import (first PE import commit) | `79a8ec084d552772a401247cfd7a7051c6ffd0e2` | `style: integrate the Round 5 screen experience layer` |
| Write-set remediations (PE bridges → `styles.css`) | `91e3e600fad2a1a07a4e184d79d2ecb6c0b6b757` | `fix: fold PE screen layout bridges into styles.css` |
| **P6 capture source** | `91e3e600fad2a1a07a4e184d79d2ecb6c0b6b757` | Clean HEAD used for recapture; equals `manifest.sourceSha` |
| Evidence tip | this commit | `test: recapture P6 sheets after write-set fix` |

### Rollback

```bash
git revert -m 1 2795d397fff5efb5202f18f4cdd348a7a211826c
```

That reverts the FE stylesheet merge parent. PE-owned follow-ups (`src/main.js` FE import, `src/styles.css` bridges, capture/staging fixes) may need separate reverts if a full unwind is required.

---

## FE / PE write set (frozen)

### FE write set consumed at merge

Exact diff `$FE_BASE..$FE_HEAD`:

1. `src/styles/round5-screens.css`

### PE-owned integration (post-merge; write-set clean)

| Path | Role |
|---|---|
| `src/main.js` | `import './styles.css'` then `import './styles/round5-screens.css'` only |
| `src/styles.css` | PE layout bridges under FE shells: hollow stage grid, center-panel safe fill, phone title rails, dawn ledger overflow |
| `src/ui/navigation.js` | `__p6NavFreeze` honour inside `createNavigator().show` |
| `test/e2e/p6-phase2-stage.js` | Real-owner Phase-2 staging for capture + `p6-screens` |
| `tools/capture-round5-contact-sheets.mjs` | Deterministic capture / sheets / manifest |

**Removed (Critical breach):** `src/styles/round5-pe-integration.css` — not in the PE or FE write set.

FE must not edit PE JS or `src/styles.css`; critique is report-only (Task 36).

---

## Root selectors (FE may style; PE owns markup)

Carry-forward from `docs/superpowers/reports/2026-07-10-round5-p5-to-p6-handoff.md`, plus Round 5 experience roots used in capture:

| Route / surface | Root selector(s) under `#screen` / `#stage` |
|---|---|
| Title | `.r5-title`, `.title-screen` |
| Embark | `.r5-embark`, `.embark-screen` |
| Vigil / Rose | `.r5-vigil`, `.vigil-panel`, `.title-rose-medallion`, Rose pane `[data-r5-state]` |
| Lamplighter | `.r5-lamplighter`, `.lamp-screen` |
| Hollow | `.r5-lamplighter--hollow`, `.hollow-lamplighter`, `[data-r5-ceremony]` |
| Map | `.r5-map`, `.map-screen` |
| Shop / Usurper | `.r5-shop`, `.quest-shop-item[data-r5-state]` |
| Event / rest / treasure / rewards / boss-relic | `.r5-scene-panel` / `.center-panel` families |
| End (Dawn / Fall) | `.r5-end`, `.end-screen`, `.dawn-ceremony`, `#dawn-save-failure` |
| Shared | `#stage`, `#screen`, `.screen-enter`, `.scene-bg`, `data-r5-profile`, `data-r5-state`, `data-r5-ceremony` |

Phase-2 capture ids (43) are listed in `test/e2e/p6-fixtures.js` `PHASE2_CAPTURE_MANIFEST` and mirrored under the artifact `phase2/` directory.

---

## Capture command + promotion

```bash
# From clean capture source SHA (ledger: P6 capture source):
npm test
node tools/run-with-strict-e2e-port.mjs -- npx playwright test \
  p6-screens end-ceremony contrast stage \
  --project=desktop --workers=1 --no-deps
node tools/run-with-strict-e2e-port.mjs -- npm run capture:round5:contact-sheets
```

Working output: `test-results/round5-contact-sheets/`  
Promoted (committed) tree: `docs/superpowers/artifacts/round5-p6-contact-sheets/`

| Manifest field | Value |
|---|---|
| `sourceSha` | `91e3e600fad2a1a07a4e184d79d2ecb6c0b6b757` |
| `captureCommand` | `node tools/run-with-strict-e2e-port.mjs -- npm run capture:round5:contact-sheets` |
| Rows | 183 (140 base + 43 Phase-2) |
| Files (excl. manifest self) | 204 (PNGs + sheet HTML) |

Each promoted file records `path`, `byteSize`, `mediaType`, and `sha256` in:

`docs/superpowers/artifacts/round5-p6-contact-sheets/manifest.json`

---

## Committed relative paths (FE cite these)

### Manifest

- `docs/superpowers/artifacts/round5-p6-contact-sheets/manifest.json`

### Base matrix (14 screens × 5 shapes × fresh/grown)

Directory: `docs/superpowers/artifacts/round5-p6-contact-sheets/base/`  
Naming: `<screen>__<shape>__<profile>.png`  
Examples:

- `docs/superpowers/artifacts/round5-p6-contact-sheets/base/title__desktop-landscape__grown.png`
- `docs/superpowers/artifacts/round5-p6-contact-sheets/base/shop__phone-portrait__fresh.png`
- `docs/superpowers/artifacts/round5-p6-contact-sheets/base/hollow__pad-landscape__grown.png`

### Phase-2 terminals (43)

Directory: `docs/superpowers/artifacts/round5-p6-contact-sheets/phase2/`  
Examples:

- `docs/superpowers/artifacts/round5-p6-contact-sheets/phase2/title-rose-loading.png`
- `docs/superpowers/artifacts/round5-p6-contact-sheets/phase2/hollow-continue-closed.png`
- `docs/superpowers/artifacts/round5-p6-contact-sheets/phase2/usurper-item-normal.png`
- `docs/superpowers/artifacts/round5-p6-contact-sheets/phase2/dawn-cursor-retry.png`
- `docs/superpowers/artifacts/round5-p6-contact-sheets/phase2/fall-unpaid-shade-bequest.png`

### Composed contact sheets

Directory: `docs/superpowers/artifacts/round5-p6-contact-sheets/sheets/`  
Examples:

- `docs/superpowers/artifacts/round5-p6-contact-sheets/sheets/title-base.html`
- `docs/superpowers/artifacts/round5-p6-contact-sheets/sheets/end-phase2.html`
- `docs/superpowers/artifacts/round5-p6-contact-sheets/sheets/shop-phase2.html`

---

## Focused gate notes

- Standing / full CI / visual baseline update: **skipped** (owner cadence).
- Capture settle races `presentationBarrier.whenIdle()` against 2.5s so intentional persistence-dialog terminals (`dawn-cursor-retry`, `dawn-final-clear-retry`, `usurper-item-save-blocked`, …) remain screenshotable while holding the barrier.
- Hollow close terminals use navigator `__p6NavFreeze` (not a patched `window.spirebound.show`).

---

## Concerns

1. PE layout bridges in `src/styles.css` restore stage geometry under FE shells (hollow grid, center-panel fill, phone title rails, dawn ledger). FE critique must not move those bridges into `round5-screens.css`.
2. Visual baselines were **not** refreshed; Darwin/Linux pixel gates may still reflect pre-FE chrome until Task 36/37.
3. Capture evidence is Chromium headless on Darwin; WebKit device lanes were not re-run for this tip (prior P5→P6 WebKit-safe carry-forward + desktop focused matrix only).
