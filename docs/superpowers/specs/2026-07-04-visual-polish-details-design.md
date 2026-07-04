# Spirebound — Details Polish Round (design)

**Date:** 2026-07-04
**Scope:** A small, engine-free pass of UI/UX micro-polish — **six** detail
additions. Scope is deliberately tight; **craft is not.** Each of the six is to
be executed to a stunning, best-in-class bar (see Craft Bar below), reusing the
machinery already in the codebase (`V.burst`/`V.ring`/`V.flash`/`V.floatText`/
`flyTo`/`hitstop`, the `styles.css` keyframe library, the `nodePulse` map
vocabulary). No new systems, no new screens.

## Craft Bar (applies to every item)

"Not too ambitious" limits *how many* things we add. It does **not** lower how
well each is done. The target is award-winning finish:

- **Easing is intentional, never linear.** Define shared tokens in `:root` and
  use them everywhere:
  - `--ease-out-soft: cubic-bezier(0.22, 1, 0.36, 1)` (decelerate, premium settle)
  - `--ease-spring: cubic-bezier(0.34, 1.56, 0.64, 1)` (slight overshoot / physical land)
- **Layered, not flat.** A "glow" is glow + micro-scale + light + settle, timed
  together — not a single property change.
- **GPU-only.** Animate `transform`, `opacity`, `filter` only. No animating
  `width`/`top`/`box-shadow`-driven layout; no reflow in rAF loops.
- **Respect reduced motion.** Gate flourishes behind the codebase's `REDUCED`
  flag (JS) and `@media (prefers-reduced-motion: reduce)` (CSS) — motion
  collapses to a clean fade/instant state, never nothing.
- **Consistent with the world.** Colors pull from existing CSS vars (`--gold`,
  `--tint`, act glow); flourishes pair with the existing procedural SFX where a
  hook already exists, rather than inventing sound.

## Guardrails

- **Files touched:** `src/styles.css` and `src/ui.js` only. At most one small
  `src/art.js` touch; none expected.
- **Does NOT touch:** `engine.js`, `vigil.js`, `data.js`, save shape, or any
  tested code path. `npm test` and the fx whitelist are unaffected.

## The six details

### 1. List/grid stagger-in — *styles.css, CSS-only*
Menu lists currently appear as one slab (`#screen` fades via `screenIn`). Make
their children arrive as a crafted cascade.

- Each child animates in on a `:nth-child` delay (~45ms step, capped ~8 so long
  lists never drag): `opacity 0→1`, `translateY(10px)→0`, and a brief
  `filter: blur(6px)→0` for a "focus-pull" landing.
- Curve: `--ease-spring` so each row lands with a micro-settle, not a linear slide.
- As a row lands, its leading icon glow blooms (icon `filter: drop-shadow`
  ramps in on the same delay) so the list feels *lit* row by row.
- Apply to `.reward-list .reward-row`, `.shop-row .shop-item`, and the vigil
  deed list. Pure CSS — no `--i` index var, no render change.

### 2. Gold count-up — *ui.js*
The purse coins already fly to the HUD (`flyTo`), but `.gold-num` snaps.

- ~15-line `tweenNum(el, from, to, ms)` rAF helper, ease-out (`--ease-out-soft`
  equivalent in JS), parked next to `flyTo`.
- The number ticks up to *meet* the arriving coins (start the tween as the first
  coin lands, finish as the last does).
- Each landing coin gives the number a tiny scale-pulse + brief gold flare
  (reuse existing coin SFX per few ticks, pitch-rising, throttled so it never
  machine-guns); the final value "sets" with a short glow.
- Use tabular/`font-variant-numeric: tabular-nums` so the digits don't jitter
  width while counting. Generic enough to reuse for HP/embers later; only gold
  wired now.

### 3. Overkill flourish — *ui.js, hitEnemy handler*
`hitEnemy` events already carry an `overkill` flag the UI throws away (today it
only bumps to `crit` at amount ≥ 16).

- On `ev.overkill`: number at `crit` size (distinct tint), plus a **layered**
  impact — an extra `V.burst()` glass-shard spray at the enemy anchor, a quick
  `V.ring()` shock ring, a brief `V.flash()` whitepoint kick, extra `V.shake()`,
  and a few ms of `hitstop` so the moment *reads* before resolving.
- Timed as one beat (shards + ring + flash + hitstop fire together), not a
  scatter. ~6–10 lines in the existing handler; no new event type.

### 4. Available-node beckon — *styles.css, CSS-only*
The current node breathes via `nodePulse`; reachable nodes are static.

- `.mnode.avail` gets a gentle breathing glow (soft `filter: drop-shadow` +
  micro-scale) so the eye is drawn up the climb, and its lantern flame reads
  slightly brighter.
- **Phase-offset** the breathing per node using the existing `--d`
  (`n.row * 34ms`) as `animation-delay`, so nearby beckoning nodes don't pulse
  in lockstep — the tower shimmers organically.
- Tuned clearly *below* `.current`'s `nodePulse` intensity; `.current` wins when
  both classes apply, so the two states stay distinguishable.

### 5. Card hover-lift — *styles.css, CSS-only*
Hand cards have foil + mouse-tilt but don't rise (the existing `translateY(-8px)`
lift is on `.card-grid`, not the hand). The tilt transform lives on `.card-inner`.

- Under `@media (hover: hover) and (pointer: fine)` only: hovered
  `.hand-zone .card` rises ~12px with a slight scale and a shadow that *grows*
  with the lift, on `--ease-spring` (rise overshoots and settles; snap-back is
  `--ease-out-soft`).
- The card's tint glow + foil sheen bloom on hover (extends the existing
  `.card:hover .card-inner::before { opacity: 1 }`).
- Lift is on the **outer** `.card`, composing with the `.card-inner` tilt rather
  than clobbering it. Hover-gated → touch / drag-to-play untouched.

### 6. Tooltip pop-in — *styles.css + ~3 lines ui.js*
`#tooltip` toggles `display: none ↔ block`, which cannot transition.

- Swap show/hide to a `visibility` + `opacity` + `transform` class toggle (stays
  `position: fixed`, so hidden layout is unaffected).
- Scale-fade in over ~100ms on `--ease-spring`: `opacity 0→1`,
  `scale(0.96)→1`, a few px upward drift, and the gold title border/glow
  igniting as it lands. Felt on cards, relics, statuses, map nodes.

## Watch-outs

- **Hover-lift vs tilt:** JS tilt is on `.card-inner`; lift stays on `.card`.
  Verified separate elements — safe to compose.
- **Tooltip transition:** must be a class-swap, not the `display` toggle, or the
  transition never fires.
- **Beckon vs pulse:** `.avail` glow must be visibly gentler than `.current`
  `nodePulse`, and `.current` takes precedence when both apply.
- **SFX throttle:** gold-tick sound must be rate-limited so a big payout doesn't
  machine-gun.

## Verification

- `npm test` stays green (nothing here touches tested code).
- `npm run build` clean.
- Browser pass on desktop **and** one phone breakpoint (≤740px): confirm
  hover-lift is gated off on touch, drag-to-play still works, reduced-motion
  collapses cleanly, and the stagger / gold count-up / overkill / node-beckon /
  tooltip all read as *stunning* — before/after screenshots per change.

## Out of scope

Anything requiring engine, data, or save changes; new VFX kinds; new screens;
new keyframes beyond the small ones above (beckon, tooltip, stagger). Reusing
later: `tweenNum` for HP/embers counters.
