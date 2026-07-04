# Spirebound Details Polish — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Six engine-free UI/UX micro-polish details, each executed to an award-winning craft bar.

**Architecture:** Pure `src/styles.css` + `src/ui.js` changes. No engine, data, save-shape, or test-path impact. Reuses the existing VFX helpers (`V.burst`/`V.ring`/`V.flash`/`V.floatText`/`flyTo`/`hitstop`/`kick`), the keyframe library, and the `nodePulse` map vocabulary.

**Tech Stack:** Vanilla JS, hand-written CSS. No build/deps change.

## Global Constraints

- Files touched: `src/styles.css`, `src/ui.js` only.
- Do NOT touch `engine.js`, `vigil.js`, `data.js`, save shape, or tested code.
- Animate `transform`/`opacity`/`filter` only where practical; no rAF layout thrash.
- Easing tokens (Task 0), used everywhere: `--ease-out-soft: cubic-bezier(0.22, 1, 0.36, 1)`, `--ease-spring: cubic-bezier(0.34, 1.56, 0.64, 1)`.
- Every motion collapses cleanly under `@media (prefers-reduced-motion: reduce)` / `REDUCED`.
- `npm test` stays green; `npm run build` clean.

**Note (verification shape):** This is visual/CSS work — there are no unit tests to write. Each task's "test" is: `npm test` still passes (regression guard) + a browser visual check. TDD steps are replaced accordingly.

---

### Task 0: Easing tokens

**Files:** Modify `src/styles.css` (`:root`, after the safe-area vars ~line 7).

- [ ] **Step 1: Add tokens to `:root`** — after `--sal: env(safe-area-inset-left, 0px);`:

```css
  /* shared motion curves — premium settle + physical overshoot */
  --ease-out-soft: cubic-bezier(0.22, 1, 0.36, 1);
  --ease-spring: cubic-bezier(0.34, 1.56, 0.64, 1);
```

- [ ] **Step 2:** `npm run build` — expect clean (no visual change yet; tokens just defined).

---

### Task 1: Tooltip pop-in *(CSS-only)*

`#tooltip` toggles `display:none↔block`. A `none→block` flip restarts a CSS **animation** (unlike a transition), so no `ui.js` change is needed.

**Files:** Modify `src/styles.css` (`#tooltip` rule ~line 100; reduced-motion block ~line 983).

- [ ] **Step 1: Add the animation to `#tooltip`.** Append to the existing `#tooltip { … }` rule's declarations:

```css
  animation: tipIn 0.12s var(--ease-spring) both;
```

- [ ] **Step 2: Add the keyframe** (near the other keyframes, e.g. after `@keyframes fadein`):

```css
@keyframes tipIn { from { opacity: 0; transform: translateY(6px) scale(0.96); } }
```

- [ ] **Step 3: Reduced-motion guard.** In the `@media (prefers-reduced-motion: reduce)` block, add:

```css
  #tooltip { animation: fadein 0.1s both; }
```

- [ ] **Step 4: Verify** — `npm run dev`, hover a status pip / relic / card. Tip scale-fades in; moving directly between two tipped elements does not re-trigger (intended). `npm test` green.

---

### Task 2: Card hover-lift *(CSS-only, FINE pointer)*

The fan layout owns each hand card's `transform`, so lift via `bottom` (base is `bottom: 8px`), which composes with the transform.

**Files:** Modify `src/styles.css` (`.hand-zone .card` rule ~line 322; new `@media (hover:hover)` block).

- [ ] **Step 1: Add `bottom` to the card transition.** In `.hand-zone .card { … transition: transform 0.28s cubic-bezier(0.25, 0.9, 0.3, 1.2), filter 0.2s; … }`, extend the transition list to:

```css
  transition: transform 0.28s cubic-bezier(0.25, 0.9, 0.3, 1.2), bottom 0.22s var(--ease-spring), filter 0.2s;
```

- [ ] **Step 2: Add the hover-lift rule** (after the existing `.hand-zone .card:hover …` shadow rule):

```css
@media (hover: hover) and (pointer: fine) {
  .hand-zone .card:hover { bottom: 26px; }
}
```

(The shadow deepening and foil/glare bloom on hover already exist; the lift is the missing physical rise. Touch/drag is untouched — `.dragging` sets `transition:none`, and the lift is hover-gated.)

- [ ] **Step 3: Verify** — desktop: hovering a hand card raises it ~18px with a spring settle, shadow grows, glare blooms; the fan arc position is preserved (no snap-to-center). Drag-to-play still works. `npm test` green.

---

### Task 3: Available-node beckon (desync + deepen) *(CSS-only)*

`.mnode.avail circle.bg` already pulses via `nodePulse`, but all avail nodes pulse in lockstep. Phase-offset them via `nth-child` buckets (negative delays → start mid-cycle at different phases) and add a gentle icon glow.

**Files:** Modify `src/styles.css` (map node block ~lines 226–234).

- [ ] **Step 1: Phase-offset the pulse.** After the `.mnode.avail circle.bg { … animation: nodePulse 1.6s ease-in-out infinite; }` rule, add:

```css
/* desync the beckon so the tower shimmers organically, not in lockstep */
.mnode:nth-child(4n) circle.bg   { animation-delay: -0.4s; }
.mnode:nth-child(4n+1) circle.bg { animation-delay: -0.8s; }
.mnode:nth-child(4n+2) circle.bg { animation-delay: -1.2s; }
.mnode:nth-child(4n+3) circle.bg { animation-delay: -1.55s; }
```

(Delays are harmless on non-`.avail` nodes, whose `circle.bg` has no animation.)

- [ ] **Step 2: Add a soft icon-glow breath on avail nodes.** After the `.mnode.avail .icg { … }` rule:

```css
.mnode.avail .icg { animation: beckonIcon 1.6s ease-in-out infinite; }
@keyframes beckonIcon { 0%, 100% { opacity: 0.9; } 50% { opacity: 1; filter: drop-shadow(0 0 5px currentColor); } }
```

- [ ] **Step 3: Reduced-motion guard.** In the reduced-motion block add:

```css
  .mnode.avail circle.bg, .mnode.avail .icg { animation: none; }
```

- [ ] **Step 4: Verify** — on the map, reachable lanterns breathe out of phase with each other (organic shimmer); the current node stays distinct (static bright glow). `npm test` green.

---

### Task 4: List/grid stagger-in *(CSS-only)*

Cascade reward rows, shop items, and vigil deeds in, instead of the whole screen fading as one slab. Applies to `.reward-list .reward-row`, `.shop-row .shop-item`, `.deed-list .deed-row`.

**Files:** Modify `src/styles.css` (near reward/shop rules ~line 762; reduced-motion block).

- [ ] **Step 1: Add the keyframe + shared rule + delay buckets** (place after the `.reward-row svg` rule ~line 772):

```css
/* crafted cascade: list children arrive lit, row by row */
@keyframes listIn { from { opacity: 0; transform: translateY(10px); filter: blur(6px); } }
.reward-list .reward-row, .shop-row .shop-item, .deed-list .deed-row {
  animation: listIn 0.42s var(--ease-spring) both;
  animation-delay: calc(var(--si, 0) * 45ms);
}
.reward-list .reward-row:nth-child(1), .shop-row .shop-item:nth-child(1), .deed-list .deed-row:nth-child(1) { --si: 0; }
.reward-list .reward-row:nth-child(2), .shop-row .shop-item:nth-child(2), .deed-list .deed-row:nth-child(2) { --si: 1; }
.reward-list .reward-row:nth-child(3), .shop-row .shop-item:nth-child(3), .deed-list .deed-row:nth-child(3) { --si: 2; }
.reward-list .reward-row:nth-child(4), .shop-row .shop-item:nth-child(4), .deed-list .deed-row:nth-child(4) { --si: 3; }
.reward-list .reward-row:nth-child(5), .shop-row .shop-item:nth-child(5), .deed-list .deed-row:nth-child(5) { --si: 4; }
.reward-list .reward-row:nth-child(6), .shop-row .shop-item:nth-child(6), .deed-list .deed-row:nth-child(6) { --si: 5; }
.reward-list .reward-row:nth-child(7), .shop-row .shop-item:nth-child(7), .deed-list .deed-row:nth-child(7) { --si: 6; }
.reward-list .reward-row:nth-child(n+8), .shop-row .shop-item:nth-child(n+8), .deed-list .deed-row:nth-child(n+8) { --si: 7; }
```

- [ ] **Step 2: Reduced-motion guard.** In the reduced-motion block add:

```css
  .reward-list .reward-row, .shop-row .shop-item, .deed-list .deed-row { animation: none; }
```

- [ ] **Step 3: Verify** — enter a reward screen, a shop, and the Vigil ledger: children cascade in with a focus-pull settle. Hover states (`translateX`/`translateY`) still work after entrance. `npm test` green.

---

### Task 5: Gold count-up *(ui.js)*

When reward coins fly to the purse, tick the HUD `.gold-num` up to meet them instead of snapping.

**Files:** Modify `src/ui.js` (add `tweenNum` near `flyTo` ~line 1297; wire the gold reward row ~line 1844). Modify `src/styles.css` (add `goldTick` keyframe + `.gold-num.tick`).

- [ ] **Step 1: Add `tweenNum` helper** immediately after the `flyTo` function (after its closing brace ~line 1321):

```js
// count a number element up/down to a target (ease-out cubic), with a set-pulse
function tweenNum(node, from, to, ms = 640) {
  from = Math.round(from); to = Math.round(to);
  if (REDUCED || from === to) { node.textContent = to; return; }
  const t0 = performance.now();
  const step = (now) => {
    const p = Math.min(1, (now - t0) / ms);
    const e = 1 - Math.pow(1 - p, 3);
    node.textContent = Math.round(from + (to - from) * e);
    if (p < 1) requestAnimationFrame(step);
    else { node.textContent = to; node.classList.remove('tick'); void node.offsetWidth; node.classList.add('tick'); }
  };
  requestAnimationFrame(step);
}
```

(`REDUCED` is declared just above `rigCombatants` — `tweenNum` sits after it, so define `tweenNum` *below* the `const REDUCED` line. It is at ui.js:1326, after `flyTo`. Place `tweenNum` right after `const REDUCED = …`.)

- [ ] **Step 2: Wire the reward gold row.** Replace the `requestAnimationFrame(() => { … })` body in the `addRow('¤', …)` gold reward (~line 1848) with:

```js
    requestAnimationFrame(() => {
      const purse = $('#hud .gold-num');
      const from = { x: innerWidth / 2, y: innerHeight / 2 - 40 };
      const to = purse ? V.centerOf(purse) : { x: 120, y: 24 };
      const before = run.player.gold - rewards.gold;
      if (purse) purse.textContent = before; // hold the old total; the coins bring the rest
      flyTo(from.x, from.y, to.x, to.y, { n: Math.min(9, 4 + Math.floor(rewards.gold / 12)), color: '#ffd76e', dur: 600, done: () => sfx.coin() });
      if (purse) tweenNum(purse, before, run.player.gold, 640);
    });
```

- [ ] **Step 3: Add the set-pulse CSS** (near `.gold-num` ~line 144):

```css
.gold-num.tick { animation: goldTick 0.34s var(--ease-out-soft); }
@keyframes goldTick { 40% { transform: scale(1.28); color: #fff3c0; text-shadow: 0 0 12px rgba(242, 193, 78, 0.8); } }
```

- [ ] **Step 4: Verify** — claim a gold reward: the purse holds the old total, ticks up as the coins arrive, and bumps/flares as it sets. Under reduced motion the number just sets. `npm test` green.

---

### Task 6: Overkill / killing-blow flourish (elevate) *(ui.js)*

`hitEnemy` already juices `killingBlow`/`overkill`. Elevate: kills always read big, and the light layers into one ceremonial beat.

**Files:** Modify `src/ui.js` (`hitEnemy` handler ~lines 1574–1591).

- [ ] **Step 1: Kills always read as crit.** Change the damage-number line (~1574) from:

```js
        if (ev.amount > 0) V.floatText(ex, ey - 24, `${ev.amount}`, big ? 'crit' : 'dmg');
```

to:

```js
        if (ev.amount > 0) V.floatText(ex, ey - 24, `${ev.amount}`, (ev.killingBlow || big) ? 'crit' : 'dmg');
```

- [ ] **Step 2: Layer the kill light.** Replace the `if (ev.killingBlow) { … }` block (~1584–1591) with:

```js
        if (ev.killingBlow) {
          // the blow that ends a life lands heavier — and overkill heavier still
          V.hitstop(ev.overkill >= 8 ? 130 : 90);
          kick(Math.min(1.6, 0.6 + ev.overkill * 0.06));
          V.ring(ex, ey, '#ffffff', 8, 780, 5);
          V.ring(ex, ey, '#ffd8a0', 14, 900, 4);   // warm shockwave layered under the white
          V.flash('#ffe6b0', 0.09, 0.28);          // a beat of gold ceremony on every kill
          if (ev.overkill >= 8) {
            V.flash('#ffffff', 0.12, 0.24);
            V.burst(ex, ey, { color: '#fff3d6', n: 26, speed: 620, size: 2.6, grav: 200, kind: 'spark' });
            V.burst(ex, ey, { color: '#ffd76e', n: 12, speed: 300, size: 3.4, grav: 120, kind: 'spark' }); // slow gold embers rising
          }
        }
```

- [ ] **Step 3: Verify** — a killing blow flares warm gold with a layered shockwave; an overkill (≥8) adds a white pop + rising gold embers, and small-damage kills now show a crit-sized number. `npm test` green.

---

### Final verification

- [ ] `npm test` — all pass (unit + monte-carlo).
- [ ] `npm run build` — clean.
- [ ] Browser QA (desktop + ≤740px phone): tooltip pop-in, hand-card hover-lift (desktop only, gated off on touch, drag still works), map beckon shimmer, reward/shop/vigil stagger-in, gold count-up + set-pulse, kill/overkill flourish. Zero console errors. Reduced-motion sanity (`?` or OS setting) collapses cleanly.

## Self-review

- **Spec coverage:** all six spec items → Tasks 1–6; craft-bar easing tokens → Task 0; reduced-motion guards in Tasks 1/3/4/5. ✓
- **Corrections vs spec:** overkill already partially exists (Task 6 elevates, not builds); avail nodes already pulse (Task 3 desyncs); tooltip needs no `ui.js` change (animation restarts on display flip); hover-lift uses `bottom` not `transform` (fan owns transform). All reconciled above.
- **Type consistency:** `tweenNum(node, from, to, ms)` defined once (Task 5 Step 1), called once (Step 2). `--si`/`--ease-*` tokens defined before use.
- **Placeholder scan:** none.
