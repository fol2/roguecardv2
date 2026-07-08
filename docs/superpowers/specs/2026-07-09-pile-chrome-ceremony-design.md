# Spirebound — Draw / Discard / Ashes Pile Chrome & Ceremony (design)

**Date:** 2026-07-09  
**Goal:** Replace the plain glass Draw / Discard / Ashes buttons with **themed
card-stack widgets** (shared card body, per-pile state, 0–5+ depth tiers + always-
visible count), and give core pile flows **full per-card flight VFX** under a
**fixed frame-time budget** so mobile combat does not slow with deck size.  
**Predecessor:** combat pile chrome in `ui.js` / `styles.css`; existing
`flyTo` / `flycard` reshuffle arc; exhaust burn-inward ghost.

## Decisions record (owner-approved)

| Question | Decision |
|---|---|
| Visual metaphor | **B** — still cards, Spirebound-themed (not pure STS stacks, not abstract ritual props) |
| Count readout | **B** — tier art + always-visible number (mobile; no hover-only) |
| Differentiation | **B** — same card body, different state (sealed / spent / charred) |
| Ceremony scope | **B → upgraded to full-card** — every participating card flies; wall-clock time capped |
| Time model | Fixed (or narrow-range) **frame-time budget**; stagger compresses as `n` grows |
| Asset strategy | **B** — 3 state masters via imagegen + runtime stack-depth composite |
| Overall approach | **A** — Chrome upgrade (not stage props, not SVG-primary hybrid) |

## Context

Today:

- Three `.pile-btn` controls: label + count only (`DRAW` / `DISCARD` / `ASHES`).
- `reshuffle` arcs generic `.flycard` motes Discard → Draw.
- `draw` only `syncHand` + short sleep; hand cards use CSS `draw-in`.
- `discardHand` slides cards off-screen right; no landing on Discard.
- `exhaust` burns the card in place; embers do not travel to Ashes.
- Pile art does not change with count; empty vs thick is number-only.

Players cannot *see* pile thickness or the ritual of cards moving between
Draw ↔ Hand ↔ Discard / Ashes. Authors want richer assets and readable mobile
chrome without turning piles into battlefield props.

## Visual identity

Shared **card-body silhouette** across all three piles. State carries meaning:

| Pile | State look | At-a-glance read |
|---|---|---|
| Draw | Neat sealed stack, face-down backs, cool parchment / lead | Unused, still in the deck |
| Discard | Same body, slightly askew / worn, warmer spent tone | Spent, will return on reshuffle |
| Ashes | Same body, charred edges, ember flecks, softer opacity | Burned / Kindle — does not reshuffle |

### Depth tiers

Map `count` → visual tier:

| Tier | Count | Look |
|---|---|---|
| 0 | 0 | Empty plate / faint outline (still tappable → empty grid) |
| 1 | 1 | Single card |
| 2 | 2 | Two-card offset stack |
| 3 | 3 | Three-card stack |
| 4 | 4 | Four-card stack |
| 5+ | ≥5 | Thick stack + light overflow cue (no further per-card adds) |

Exact pixel offsets are implementation detail; must read at phone pile size
(~42–46px) and desktop (~62px).

### Number overlay

- Always visible on the widget (corner or centre-bottom).
- Exact integer from `cb.draw` / `cb.discard` / `cb.exhaust` lengths.
- Labels may stay short text or shrink; must not rely on hover for count.

## Assets

| Role | Proposed path | Notes |
|---|---|---|
| Draw master | `src/assets/piles/draw.png` (or `ui/pile-draw.png`) | Sealed neat backs |
| Discard master | `src/assets/piles/discard.png` | Spent / askew |
| Ashes master | `src/assets/piles/ashes.png` | Charred + ember |

- Generate **3 state masters** (transparent, consistent card aspect, no text).
- Prefer **runtime composite** for tiers 0–5+ from each master (layered offsets).
- If small-size composites muddy, bake a small set of depth frames per state
  (still not 18 unique illustrations).
- Scratch + prompt ledger under `scratch/pile-chrome-YYYYMMDD/` before promote;
  resolve via `assetUrl` with fallback to today’s glass button if missing.
- Do **not** use font glyphs for pile icons.

## Ceremony VFX

Engine math stays pure. UI `drain()` plays fuller flights. **Every card that
moves in the ceremony gets its own flight element**; total wall-clock time is
budgeted.

### Time budget (targets)

| Event | What flies | Budget (wall-clock) |
|---|---|---|
| `draw` | Each drawn card: Draw pile → hand slot | ~180–320ms total |
| Single / effect discard | Each discarded card: hand → Discard | ~220–400ms |
| `discardHand` | Every hand card → Discard | **~320–480ms** fixed-ish, any hand size |
| `exhaust` | Keep burn-inward; add ember trail → Ashes | ~400–540ms |
| `reshuffle` | Every Discard card-back → Draw | **~450–650ms** fixed-ish, any discard size |

### Compression rules

- Flights run **in parallel**.
- `stagger = min(maxStagger, budget / max(n, 1))` (denser as `n` grows).
- Optional slight shrink of per-card `flightDur` when `n` is large; never drop
  to “representative subset only”.
- `await` the budget (or last finish within budget), not serial per-card waits.
- Pile count / tier: settle once at ceremony start or mid-beat + one landing
  pulse — avoid n discrete number pops.

### Landing / pile feedback

- Soft scale bump on destination pile.
- Optional light particles: cool (Draw), warm (Discard), ember (Ashes).
- Tier art swaps when mapped tier changes.

### Reduced motion / LITE

- Skip or heavily shorten flights; fade + count/tier update still correct.
- Respect `prefers-reduced-motion`.

### Explicit non-flows

- Ashes never fly back into Draw on reshuffle.
- No requirement for add-to-discard / power-settle full flights in this pass
  (may reuse helpers later).

## Runtime / files

| Area | Change |
|---|---|
| `src/ui.js` | Pile widget markup; tier sync in `syncCombat`; full-flight drain handlers with budgets |
| `src/styles.css` | Stack widget layout, bump/tier transitions, mobile sizes |
| `src/art.js` / assets | Masters + `assetUrl`; optional composite helper |
| `src/vfx.js` | Thin shared landing pulse / motes only if useful |
| `src/engine.js` | Prefer **no** math changes; only add queue payload if UI cannot infer uids |

Click behaviour unchanged: open Draw / Discard / Ashes card grids (including empty).

## Out of scope

- Moving piles onto the battlefield as stage props (Approach 2).
- Eighteen unique per-tier illustrations.
- Ashes → Draw return path.
- Engine damage/block/preview changes.
- Audio redesign (may reuse `sfx.draw` / `sfx.card`).

## Success criteria

1. At phone size, Draw / Discard / Ashes are visually distinct via state art;
   count is always readable; tiers 0 vs 1 vs 5+ are distinguishable.
2. `discardHand` and `reshuffle` fly **every** participating card, yet complete
   within the stated budgets regardless of `n`.
3. `draw` and `exhaust` show origin/destination pile participation (not only
   in-place hand FX).
4. Missing pile assets fall back to current glass buttons; `npm test` green;
   LITE / reduced-motion remain usable.
5. Scratch masters reviewed and promoted through the existing art workflow
   before treating art as final.

## Open implementation notes (not undecided product)

- Exact `assetUrl` category folder name (`piles` vs `ui`).
- Whether discard-from-play (non-end-turn) already emits enough queue detail
  for per-uid flight, or needs a small engine event enrichment.
- Whether depth composites are pure DOM layers or pre-baked frames after
  mobile screenshot QA.
