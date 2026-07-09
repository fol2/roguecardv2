# Energy count — above candles

**Date:** 2026-07-09  
**Status:** done  
**Commit:** `Place energy count above candles without overlap.`  
**Scope:** `src/styles.css` (`.energy-orb` / `.num`) + `src/ui.js` markup order. No ENERGY label. Candles unchanged size.

## Changes

- Column layout: **num → candles** (`flex-direction: column`, `gap: 2px`).
- `.num` is **in-flow** (no absolute overlay / no `top: 70%` wax seat) — sits **above** the candle row without overlapping art.
- Large readable count + stroke / text-shadow kept; `.lbl` still hidden.
- Markup order matches column: `<div class="num">` then `<div class="candles">`.

## Tests

- `npm test` — green (`unit checks passed; monte-carlo: 300 runs, …`).
