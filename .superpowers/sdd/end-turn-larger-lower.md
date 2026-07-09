# End Turn — larger & lower

**Date:** 2026-07-09  
**Status:** done  
**Commit:** `c9791f1` — `Enlarge End Turn control and shift it down.`  
**Scope:** `src/styles.css`, `src/ui.js` (End Turn only; uiIcon already 120 on parent). Engine untouched. No lantern hunks.

## Changes

- Desktop glyph **96 → 120px**; label **16 → 18px**; `bottom` **152 → 140px** (moved down toward piles/hand).
- Pad (≤1100): **84 → 104px**, `bottom` **132 → 118px**.
- Phone portrait: **78 → 96px**, `bottom` **112 → 100px**.
- Phone landscape: **68 → 84px**, `bottom` **60 → 48px**.
- Markup: `uiIcon('end-turn', 120)`.
- Kept "End" text overlay + outline; no square chrome plate.
- `.end-turn.enemy-phase` dim unchanged (`opacity: 0.45; pointer-events: none`).

## Tests

- `npm test` — green (`unit checks passed; monte-carlo: 300 runs, …`).
