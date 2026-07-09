# Energy count — on candle wax

**Date:** 2026-07-09  
**Status:** done  
**Commit:** 685e646 — `Seat energy count on candle bodies, not above flames.`  
**Scope:** `src/styles.css` only (`.energy-orb .num`). No ENERGY label. Candles unchanged size.

## Changes

- `.energy-orb .num` vertical anchor **`top: 52%` → `70%`** (still `left: 50%` + `translate(-50%, -50%)`).
- Number sits on the **wax body** (middle-lower of the candle imgs), not floating over / above the flames.
- Outline / stroke / text-shadow kept; font sizes unchanged across breakpoints.

## Tests

- `npm test` — green (`unit checks passed; monte-carlo: 300 runs, …`).
