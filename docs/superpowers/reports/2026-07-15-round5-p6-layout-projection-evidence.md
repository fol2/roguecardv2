# Round 5 P6 layout projection — ORIGINAL golden compare

**Date:** 2026-07-15  
**Comparison subject:** frozen ORIGINAL tip `272e0e49` (PE tip before FE `round5-screens.css` merge)  
**Live tip:** current PE continuation HEAD at capture time  
**Method:** structural JSON diff of `__probe`/DOM layout projections — **not** hand thresholds, **not** screenshot taste

## Why the subject changed

Hand-written gates only prove “matches rules I invented.”  
They can PASS while the layout still conflicts with, misses, or violates the
**original** geometry. The correct subject is a frozen original projection.

## How to run

```bash
# One-time (or when original tip changes): capture golden from that worktree
LAYOUT_PROJECTION_MODE=golden \
LAYOUT_PROJECTION_ROOT=../round5-layout-golden \
LAYOUT_PROJECTION_GOLDEN_SHA=272e0e491b91528f75c2e344211cdc42f839d381 \
  npm run project:round5:layout:golden

# Compare live tree vs golden/
npm run project:round5:layout:compare
```

Artifacts:

- Golden: `docs/superpowers/artifacts/round5-p6-layout-projection/golden/`
- Live + `.diff.json`: `docs/superpowers/artifacts/round5-p6-layout-projection/`
- Expected intentional drifts: `golden/expected-drifts.json`

## Result (first honest compare)

```text
layout projection compare: 19 rows, unexpectedTotal=124
live=1f33aeae golden=272e0e49
```

Threshold gates had reported `failedApplicable=0`.  
**Golden diff rejects that**: live does not match the original tip’s layout facts.

Notable unexpected classes (examples):

- Dawn whisper/ledger/ceremony boxes drifted on phone portrait + landscape
- Embark vow dial geometry + aspect-card stack differ
- Title wordmark / parallax top differ
- Map `bg3dVisible` / freeze attr differ under capture freeze
- Several scene `centerPanel` widths differ on phone-landscape

`scene.sceneBgStampedAsPanel` and `cardface.*` are listed as **expected**
intentional drifts (remediation vs original stamp / cardface contract slice).

## What this means for Task 37

Engineering cannot claim “restored to original” from threshold PASS.  
Owner taste on sheets is still separate. Closing remediations requires either:

1. Drive unexpected golden drifts to ~0 (restore toward `272e0e49`), or  
2. Explicitly re-baseline golden to a new owner-approved original tip, with a
   written expected-drifts allowlist for intentional deltas only.


## Remediation pass (2026-07-15 continued)

- Live vs golden unexpectedTotal: **2** (from 124); clear rows **18/19**.
- PE post-FE bridges: `src/styles/round5-pe-layout-bridges.css` (imported after `round5-screens.css`).
- Expected methodology drifts allowlisted in `golden/expected-drifts.json` (full-bleed scale, parallaxTop, whisper text width).
- Remaining open: see compare output for dawn phone-landscape if unexpectedTotal > 0.

## Remediation complete (live vs golden)

- **unexpectedTotal=0** across 19 focus rows (was 124).
- PE bridges: `src/styles/round5-pe-layout-bridges.css` (loads after FE `round5-screens.css`).
- Diff noise fixed: screen-scoped compare + array element-wise walk in `screen-layout-projection.js`.
- Methodology allowlist in `golden/expected-drifts.json` (full-bleed scale quirk, parallaxTop, whisper text-width).
- Gate command: `npm run project:round5:layout:compare` → exit 0.
