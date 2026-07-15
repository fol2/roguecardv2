# Round 5 P6 capture evidence

**Date:** 2026-07-15 (UTC)  
**Branch:** `jamesto/round5-production-engineering-continuation`  
**Worktree:** `.worktrees/round5-production-engineering-continuation`  
**Machine:** Darwin arm64 (local focused gates; standing / full CI skipped per Ask-Matt cadence)

This record freezes the integrated FE screen stylesheet + PE experience layer for FE mechanical critique (Task 36). It does **not** refresh visual baselines, open a ship PR, or claim Safari / WKWebView / hardware mobile support.

**WebKit-safe API review: PASS** — Task 35/36 PE changes stay on standard DOM / `localStorage` / Playwright APIs; navigator freeze uses `globalThis.__p6NavFreeze`; overlay opacity / `data-r5-state` stamps use no Safari-only, no `webkit*` prefixes, no non-standard gesture APIs.

---

## Status: PASS

Task 36 close-loop (Fall phone-landscape): FE CSS `451895b2` → PE `1681b611` + full recapture. Prior persistence-plate hold still in ancestry. Write-set: FE import is `import './styles/round5-screens.css';` only; no `round5-pe-integration.css`.

| Gate | Result |
|---|---|
| FE CSS merge write-set | PASS (`src/styles/round5-screens.css` only from FE tip `451895b2`) |
| PE stylesheet write-set | PASS (bridges + `#overlay.open` opacity in `src/styles.css`) |
| `npm test` | PASS (`unit checks passed; monte-carlo: 300 runs`) |
| Focused Playwright `p6-screens end-ceremony contrast stage` (desktop, `--workers=1 --no-deps`) | PASS (**63** passed) |
| Contact-sheet capture | PASS (**183** rows; `sourceSha` == `1681b611…`) |
| Fall phone-landscape sheets | PASS (full 4×2 stats + VIEW FINAL DECK + RETURN TO THE VIGIL) |
| Persistence plates in sheets | PASS (held from prior Task 36 tip) |
| Visual baseline refresh | **not run** (deferred to FE final PASS critique / owner sign-off) |
| WebKit-safe | **PASS** |

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
| Prior P6 capture source (pre Task 36 FE) | `91e3e600fad2a1a07a4e184d79d2ecb6c0b6b757` | Sheets lacked held persistence plates |
| Task 36 FE CSS merge | `c09fc0e2e9b66d4989599be3d6e6249fbc2afdc2` | `style: apply Task 36 FE contact-sheet CSS fixes` (from FE `b0769441`) |
| PE persistence-plate hold | `7735a9d1164381bad75ea123b080dc1a3c654b50` | Overlay stamp + `#overlay.open` opacity + capture assert |
| Prior P6 capture source (Task 36 mid) | `7735a9d1164381bad75ea123b080dc1a3c654b50` | Persistence plates held; Fall phone-landscape still FAIL |
| Fall phone-landscape FE CSS | `1681b6119dad2124c49982dce2c158867ba5c6bc` | `style: apply Fall phone-landscape FE CSS fix` (from FE `451895b2`) |
| **P6 capture source** | `1681b6119dad2124c49982dce2c158867ba5c6bc` | Clean HEAD for Fall phone-landscape recapture; equals `manifest.sourceSha` |
| Evidence tip | _(pending recapture commit)_ | `test: recapture P6 sheets after Fall phone-landscape FE fix` |

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
| Shop / Usurper | `.r5-shop`, `.quest-shop-item[data-r5-state]`, `#run-save-failure[data-r5-state="usurper-item-save-blocked"]` |
| Event / rest / treasure / rewards / boss-relic | `.r5-scene-panel` / `.center-panel` families |
| End (Dawn / Fall) | `.r5-end`, `.end-screen`, `.dawn-ceremony`, `#dawn-save-failure` |
| Shared | `#stage`, `#screen`, `#overlay.open`, `.screen-enter`, `.scene-bg`, `data-r5-profile`, `data-r5-state`, `data-r5-ceremony` |

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
| `sourceSha` | `1681b6119dad2124c49982dce2c158867ba5c6bc` |
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
- After settle, capture **asserts** `#overlay.open` plate opacity/visibility for those three ids before `#stage` screenshot.
- Usurper save-blocked stamps `#run-save-failure[data-r5-state="usurper-item-save-blocked"]` from `showRunSaveFailure`.
- `#overlay.open { opacity: 1 }` (and REDUCED `animation: none`) keeps the 72% ink scrim from sticking at the fadein from-keyframe.
- Hollow close terminals use navigator `__p6NavFreeze` (not a patched `window.spirebound.show`).

---

## Concerns

1. PE layout bridges in `src/styles.css` restore stage geometry under FE shells (hollow grid, center-panel fill, phone title rails, dawn ledger). FE critique must not move those bridges into `round5-screens.css`.
2. Visual baselines were **not** refreshed; Darwin/Linux pixel gates may still reflect pre-FE chrome until Task 36/37.
3. Capture evidence is Chromium headless on Darwin; WebKit device lanes were not re-run for this tip (WebKit-safe API review PASS; desktop focused matrix only).
4. Task 36 FE pre-filter FAIL rows that were CSS-only (contrast / overflow / title-rose-loading) need FE re-critique against this recapture tip.
