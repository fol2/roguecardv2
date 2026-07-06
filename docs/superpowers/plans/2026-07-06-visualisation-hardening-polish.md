# Visualisation Hardening & Polish II — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make the two failing visual-QA suites green (ground line, mesh corpse), capture screenshot baselines, clear the measured 55fps perf gate, then execute the polish workstreams (ambient stage, combat readability, transitions, map, non-combat screens, 21 raster icons) — each behind the same gates.

**Architecture:** The engine (`src/engine.js`) is pure and already correct — every task here touches only the presentation layer (`src/ui.js`, `src/vfx.js`, `src/mesh.js`, `src/styles.css`, `src/art.js` + asset folders). The Playwright kit in `test/e2e/` is the arbiter: a task is done when its suite is green, not when it looks done. The game renders inside a fixed virtual stage (`src/stage.js`, spec §1b): all layout/effect coordinates are stage px, CSS breakpoints are `@container stage (...)` queries, lengths use `cqw/cqh`.

**Tech Stack:** Vite + vanilla JS + three.js; Playwright (`@playwright/test`); WebAudio (untouched); no new dependencies allowed.

**Spec:** `docs/superpowers/specs/2026-07-06-visualisation-hardening-polish-design.md` — read §Invariants before starting any task.

## Global Constraints

- `npm test` (engine + asset manifest) must pass at every task boundary. It must never import Playwright, `stage.js`, `audio.js` or any DOM-touching module.
- Never import `audio.js` or `stage.js` from `engine.js` / `vigil.js`.
- Internal keys and card/status ids never change (display strings only).
- Structural UI icons come from `art.js` (`iconSvg`/`iconInline`) — never font glyphs.
- Animations use transform/opacity/filter only (clip-path additionally allowed for the §7 transition overlay). No new `requestAnimationFrame` loops — the one ambient spawner rides the existing vfx tick.
- `REDUCED` (prefers-reduced-motion) disables every new effect; LITE (coarse pointer) scales particle counts ×0.6.
- All JS layout coordinates are **stage px**: use `stageW()/stageH()/toStage()/stageRect()` from `src/stage.js`; `V.centerOf()` is already stage-native. Never mix `getBoundingClientRect()` values into element positioning without `stageRect`.
- CSS: size media queries are forbidden — use `@container stage (...)`; viewport units are forbidden — use `cqw/cqh` (input queries like `pointer: coarse` stay media queries).
- Playwright commands in this plan assume the dev server is already running (`npm run dev`, port 5174) and Chromium is installed (`npx playwright install chromium` once if launch fails).
- Do not commit `test-results/` or `playwright-report/` (gitignored). `dist/` is committed — run `npm run build` before each commit that changes `src/` and include `dist/` in the commit.
- Commit after every task with the message given in the task. Never use `--no-verify`, never amend.

---

### Task 1: Ground-line unification (spec §1)

Every combatant's feet, the painted ledge lip, and the glow seam must sit on ONE ground line — the battlefield's bottom edge. Today the hero floats 27px and enemies ~100px above it because name/HP/status chrome hangs *below* the art inside the same flex box.

**Files:**
- Modify: `src/styles.css` (combat layout block ~line 416–470, container-query blocks at ~1145, ~1189, ~1269, lightpool ~835)
- Modify: `src/ui.js` (`startCombatUI` markup, ~line 793–848)
- Test: `test/e2e/geometry.spec.js` (already written — currently red, this task makes it green)

**Interfaces:**
- Produces: CSS custom properties `--ground-y` and `--ledge-lip` on `.combat-screen`; `.eplate` / `.pplate` wrapper divs. Later tasks (baselines, readability) assume this DOM shape.
- Consumes: `window.__probe.geometry()` (stage px) from the kit.

- [ ] **Step 1: Confirm the failing state**

Run: `npx playwright test geometry --project=desktop --reporter=list`
Expected: FAIL — "hero feet on the ground line (hero … vs ground …)" with ~27px error, enemies ~100px.

- [ ] **Step 2: Introduce the ground tokens in `src/styles.css`**

Add `--ground-y`/`--ledge-lip` to `.combat-screen` and redefine per layout block. The values are today's battlefield bottom insets — they do not change, they become the single source of truth:

```css
.combat-screen { position: absolute; inset: 0; overflow: hidden; touch-action: none; --ground-y: 232px; --ledge-lip: 14px; }
```

In the `@container stage (max-width: 1100px)` block add:

```css
  .combat-screen { --ground-y: 210px; }
```

In the `@container stage (max-width: 740px)` block add:

```css
  .combat-screen { --ground-y: 218px; }
```

In the `@container stage (max-height: 480px) and (min-width: 500px)` block add:

```css
  .combat-screen { --ground-y: 132px; }
```

- [ ] **Step 3: Re-derive battlefield / ledge / seam from the tokens**

In `src/styles.css`, replace the bottom values with the token (top insets unchanged):

```css
.battlefield { position: absolute; inset: 96px 0 var(--ground-y) 0; display: flex; align-items: flex-end; justify-content: space-between; padding: 0 5cqw; }
```

and in the three container blocks:

```css
  .battlefield { padding: 0 2cqw; inset: 88px 0 var(--ground-y) 0; }          /* ≤1100 */
  .battlefield { inset: calc(56px + var(--sat)) 0 var(--ground-y) 0; padding: 0 2cqw; }  /* ≤740 */
  .battlefield { inset: calc(44px + var(--sat)) 0 var(--ground-y) 0; padding: 0 5cqw; }  /* landscape */
```

`.stage-ledge` (the glow band whose `::before` top edge is the seam) must put its TOP edge exactly on the ground line — element bottom = ground-y − height:

```css
.stage-ledge {
  position: absolute; left: 0; right: 0; bottom: calc(var(--ground-y) - 120px); height: 120px; z-index: 0; pointer-events: none;
  /* background/mask lines unchanged */
}
```

Delete the old per-block `.stage-ledge` bottom overrides and replace with height-consistent ones:
- ≤1100 block: delete `.stage-ledge { bottom: 163px; }` (base formula now correct).
- ≤740 block: `.stage-ledge { bottom: calc(var(--ground-y) - 90px); height: 90px; }`
- landscape block: `.stage-ledge { bottom: calc(var(--ground-y) - 70px); height: 70px; }`

`.sl-ledge` (painted plate): the platform's back edge is the image TOP, so anchor the top `--ledge-lip` above the ground line and stretch to the stage bottom:

```css
.sl-ledge { --amp: 9px; top: calc(100% - var(--ground-y) - var(--ledge-lip)); bottom: 0; height: auto; object-fit: cover; object-position: 50% 0%; animation: sl-drift 12s ease-in-out infinite alternate; }
```

(the old `height: 30%` line is what you're deleting — it moved with window size.)

- [ ] **Step 4: Move enemy chrome into an absolutely-positioned plate**

In `src/ui.js` `startCombatUI`, the enemy box currently stacks name/hpbar/facets/status *below* the art inside the flex column. Wrap those four rows in `.eplate`:

```js
    box.innerHTML = `<div class="intent"></div>
      <div class="enemy-art" style="width:${size}px;height:${size}px"><div class="enemy-sprite">${rasterOr('enemies', en.key, enemySvg(d.art))}</div><div class="dmg-preview"></div></div>
      <div class="eplate">
        <div class="name">${afx ? `<span class="affix-name" style="color:${afx.tone}">${afx.name.toUpperCase()}</span> ` : ''}${en.name.toUpperCase()}</div>
        <div class="hpbar-wrap"><span class="block-chip zero">${iconSvg('shield', 13)} 0</span><div class="hpbar"><div class="ghost"></div><div class="fill"></div><div class="pv"></div></div><span class="hp-label"></span></div>
        <div class="facet-row"></div>
        <div class="status-row"></div>
      </div>`;
```

All `ce.enemies[i]` lookups are class queries inside `box` — they survive unchanged. Add the plate CSS next to `.enemy`:

```css
.eplate { position: absolute; top: 100%; margin-top: 8px; left: 50%; transform: translateX(-50%); display: flex; flex-direction: column; align-items: center; gap: 6px; width: max-content; max-width: 230px; z-index: 3; }
```

- [ ] **Step 5: Same for the hero, and drop its 25px sink**

In `startCombatUI`'s player-zone markup, wrap the two below-art rows:

```js
      <div class="player-zone">
        <div class="hero-wrap">
          <div class="hero-name">${ASPECTS[S.run.aspect].name.toUpperCase()}</div>
          ${heroArt(S.run.aspect)}
        </div>
        <div class="pplate">
          <div class="hpbar-wrap"><span class="block-chip zero p-block">${iconSvg('shield', 13)} 0</span><div class="hpbar"><div class="ghost"></div><div class="fill"></div></div><span class="hp-label p-hp"></span></div>
          <div class="status-row p-status"></div>
        </div>
      </div>
```

CSS — remove the sink from `.player-zone` and give `.pplate` the same anchor treatment:

```css
.player-zone { display: flex; flex-direction: column; align-items: center; gap: 6px; width: 240px; position: relative; }
.pplate { position: absolute; top: 100%; margin-top: 8px; left: 50%; transform: translateX(-50%); display: flex; flex-direction: column; align-items: center; gap: 6px; width: max-content; z-index: 3; }
```

Update the intro keyframe (it baked in the 25px): 

```css
@keyframes heroIn { from { opacity: 0; transform: translate(-70px, 25px); } to { transform: none; } }
```

- [ ] **Step 6: Re-anchor the light pools to the new feet line**

The enemy pool cleared 65px of now-moved chrome. In `src/styles.css`:

```css
.enemy-art > .lightpool { bottom: -14px; }
```

and in the ≤740 / landscape blocks change `.enemy-art > .lightpool { bottom: -60px; }` / `{ bottom: -58px; }` to `{ bottom: -12px; }`. Leave `.lightpool` (hero) values as they are.

- [ ] **Step 7: Verify geometry goes green everywhere**

Run: `npx playwright test geometry stage --reporter=list`
Expected: PASS on all projects (13 geometry tests + stage suite). If a viewport fails by a few px, the plate `margin-top` is bleeding into layout — the plates must be `position: absolute` (out of flow); check for typos.

Then eyeball one shot: `npx playwright test visual --project=desktop --grep combat 2>/dev/null || true` (skips are fine — this is only to confirm no crash), and load `http://localhost:5174/` manually: hero + enemy feet must sit on the lit ledge lip, name/HP plates below their feet, at desktop and with devtools set to 390×844.

- [ ] **Step 8: Full gates + commit**

Run: `npm test && npm run build && npx playwright test geometry battle stage --reporter=list`
Expected: geometry + stage green; battle still has exactly its 2 known mesh reds (Task 2), no new reds.

```bash
git add -A && git commit -m "Unify combat ground line behind --ground-y (geometry.spec green)"
```

---

### Task 2: Mesh death lifecycle (spec §2)

With mesh warp on, the visible body is a WebGL plane; the DOM death animation plays on a hidden `<img>` and the plane renders the corpse forever.

**Files:**
- Modify: `src/mesh.js` (after `meshClear`, ~line 153)
- Modify: `src/ui.js` (`case 'die'` ~line 1777, `choreoHit` ~line 1521, import at line 9)
- Test: `test/e2e/battle.spec.js` (mesh-on kill + smolder-tick kill — currently red)

**Interfaces:**
- Produces: `meshRelease(el)` and `meshFlash(el, ms = 160)` exported from `src/mesh.js`. `el` may be the plane's own element or any ancestor.
- Consumes: `planes[]` entries `{ el, mesh, geo, seed, profile, flip, aspect }` (existing module state).

- [ ] **Step 1: Confirm the failing state**

Run: `npx playwright test battle --reporter=list`
Expected: FAIL ×2 — "enemy0: dead body releases its mesh plane — a WebGL warp plane still renders this corpse".

- [ ] **Step 2: Add release/flash + a visibility guard to `src/mesh.js`**

Below `meshClear`:

```js
/** Remove the plane bound to el (or any descendant of el) — the DOM <img> becomes visible again the same frame. */
export function meshRelease(el) {
  const i = planes.findIndex((p) => p.el === el || (el.contains && el.contains(p.el)));
  if (i < 0) return;
  const p = planes[i];
  p.el.classList.remove('mesh-live');
  scene.remove(p.mesh);
  p.geo.dispose();
  p.mesh.material.dispose();
  planes.splice(i, 1);
  if (!planes.length) document.documentElement.classList.remove('mesh-on');
  renderer?.render(scene, camera);
}

/** Brightness beat for hits — CSS filters don't reach WebGL planes. */
export function meshFlash(el, ms = 160) {
  const p = planes.find((q) => q.el === el || (el.contains && el.contains(q.el)));
  if (!p) return;
  p.mesh.material.color.setRGB(2.1, 2.1, 2.1);
  setTimeout(() => p.mesh?.material?.color?.setRGB(1, 1, 1), ms);
}
```

And in `layoutPlane`, before the existing rect check:

```js
  if (!p.el.isConnected || !(p.el.checkVisibility?.({ visibilityProperty: true }) ?? true)) { p.mesh.visible = false; return; }
```

- [ ] **Step 3: Wire them in `src/ui.js`**

Extend the import: `import { meshBind, meshClear, meshEnabled, meshDebug, meshRelease, meshFlash } from './mesh.js';`

At the very top of `case 'die'` (before the boss worldstop), release the plane so the existing DOM sequence (stagger → shatter → dissolve → gone) is what the player actually sees:

```js
    case 'die': {
      const x = ce.enemies[ev.idx];
      meshRelease(x.root); // the WebGL body hands back to the DOM for the death rite
```

In `choreoHit(el, dir)`, add the flash so mesh-live targets still read the hit:

```js
function choreoHit(el, dir = 1) {
  if (CHOREO_REDUCED || !el) return;
  meshFlash(el);
  /* existing el.animate(...) unchanged */
```

- [ ] **Step 4: Verify battle goes green**

Run: `npx playwright test battle --reporter=list`
Expected: PASS — all 8, including "mid-fight kill leaves no corpse on stage (mesh on)" and "smolder tick kill during the enemy phase".

- [ ] **Step 5: Full gates + commit**

Run: `npm test && npm run build && npx playwright test geometry battle stage --reporter=list`
Expected: all green — zero known reds remain outside perf/visual.

```bash
git add -A && git commit -m "Release mesh planes on death, flash them on hits (battle.spec green)"
```

---

### Task 3: Capture and commit visual baselines (spec §3)

The visual suite deliberately skips until baselines exist; geometry is now fixed, so today's pixels are worth enshrining.

**Files:**
- Create: `test/e2e/visual.spec.js-snapshots/` (generated PNGs)
- Test: `test/e2e/visual.spec.js`

- [ ] **Step 1: Capture**

Run: `npx playwright test visual --update-snapshots --reporter=list`
Expected: all visual tests report "snapshot written"; a `visual.spec.js-snapshots/` folder appears with ~24 PNGs (8 screens × 3 projects).

- [ ] **Step 2: Review every baseline by eye**

Open each PNG under `test/e2e/visual.spec.js-snapshots/`. Reject (fix, re-capture) if any shows: a floating combatant, a dead enemy, a half-rendered screen, or letterbox bars inside the shot (the screenshot is the viewport — bars appear on desktop 1280×800 as thin pillarboxes; that is CORRECT and expected).

- [ ] **Step 3: Verify determinism — run twice**

Run: `npx playwright test visual --reporter=list && npx playwright test visual --reporter=list`
Expected: PASS both times. A flaky diff means something escaped `freeze()` — find the animating element and hide/pause it under `html.freeze` in `styles.css` instead of raising `maxDiffPixelRatio`.

- [ ] **Step 4: Commit**

```bash
git add test/e2e/visual.spec.js-snapshots && git commit -m "Commit visual regression baselines (post ground-line/mesh fixes)"
```

---

### Task 4: Clear the perf gate — 55fps under 4× throttle (spec §10)

Measured hand-off state: 28.7fps avg during a double-annihilate burst, portrait project, 4× CPU throttle. Budget: avg ≥ 55fps, p95 frame ≤ 22ms.

**Files:**
- Modify: `src/scene3d.js`, `src/vfx.js` (LITE paths only)
- Test: `test/e2e/perf.spec.js`

**Interfaces:**
- Consumes: `LITE` flags already defined in both files (`pointer: coarse` / `?input=touch`).

- [ ] **Step 1: Measure the baseline number**

Run: `PERF=1 npx playwright test perf --workers=1 --reporter=list`
Expected: FAIL, prints `avg fps: NN.N, p95 frame: NN.Nms`. Record both numbers.

- [ ] **Step 2: Apply candidates one at a time, measuring after each**

Apply a candidate, re-run the Step-1 command, keep it if it helps, revert if it doesn't. Stop as soon as the gate passes. Candidates in order of expected win:

1. **LITE skips the bloom composer** — in `src/scene3d.js` `frame()`, replace the final `composer.render()` with:

```js
  if (LITE) renderer.render(scene, camera);
  else composer.render();
```

   and guard `bloom.strength = …` with `if (!LITE)`. (Bloom is a full-screen blur chain — the single biggest cost on a throttled CPU. The LITE look loses glow; acceptable per budget priority, and the lantern/vignette carry the mood.)
2. **Lower the LITE pixel-ratio cap** — in `initScene`'s `fit()`: `LITE ? 1.0 : 1.75` (was 1.35).
3. **Cut LITE particle counts harder** — in `src/vfx.js`: `const cnt = (n) => (LITE ? Math.max(2, Math.round(n * 0.4)) : n);` (was 0.6).
4. **Halve LITE point-cloud sizes** — in `initScene`: `makePoints(LITE ? 320 : 900, …)` and `LITE ? 90 : 240` for the accent cloud (was 480/130).

- [ ] **Step 3: Verify nothing else broke**

Run: `npm test && npm run build && npx playwright test --reporter=list` (full kit, all projects)
Expected: everything green except possibly visual diffs on the portrait project if candidate 1/2 changed LITE pixels — if so, re-capture portrait baselines (`npx playwright test visual --project=portrait --update-snapshots`), eyeball the diffs, and include them.

- [ ] **Step 4: Commit (include the measured numbers)**

```bash
git add -A && git commit -m "LITE perf pass: NN.Nfps -> NN.Nfps under 4x throttle (perf gate green)"
```

---

### Task 5: Living stage — ambient weather + lantern breathing (spec §5)

**Files:**
- Modify: `src/vfx.js` (spawner inside the existing `tick`), `src/ui.js` (drive it from screen changes), `src/styles.css` (breathing overlays)
- Test: `test/e2e/perf.spec.js` (gate must survive ambient), `test/e2e/visual.spec.js` (freeze hides the canvas — baselines only change where breathing overlays land)

**Interfaces:**
- Produces: `setWeather(act, { boss = false, mult = 1 } = {})` and `setWeather(null)` exported from `src/vfx.js`. Task 8 reuses it for the map at `mult: 0.3`.

- [ ] **Step 1: The spawner table + accumulator in `src/vfx.js`**

```js
// per-act ambient weather: [act1 ash, act2 pale motes, act3 wind embers]
const WEATHER = [
  { rate: 8,  colors: ['#b8b0a0', '#8a8378'], vx: [-6, 6],   vy: [10, 26],   size: [1.4, 2.6], drift: 0.4, emberRate: 0.5 },
  { rate: 6,  colors: ['#9fd4ff', '#cfe6ff'], vx: [-4, 4],   vy: [8, 18],    size: [1.6, 3],   drift: 0.7, emberRate: 0.25 },
  { rate: 10, colors: ['#ff9a4d', '#ffd166'], vx: [24, 60],  vy: [-18, -4],  size: [1.4, 2.4], drift: 1.1, emberRate: 0.9 },
];
let weather = null; // { act, boss, mult }
let weatherAcc = 0;
export function setWeather(act, { boss = false, mult = 1 } = {}) {
  weather = act == null ? null : { act: Math.min(act, 2), boss, mult };
  weatherAcc = 0;
}
```

Inside `tick`, right after the `hitstopUntil` early-return, spawn from the accumulator (REDUCED already blanks all particle entry points, but guard anyway):

```js
  if (weather && !REDUCED) {
    const w = WEATHER[weather.act];
    weatherAcc += dt * w.rate * (weather.boss ? 1.4 : 1) * weather.mult * (LITE ? 0.6 : 1);
    while (weatherAcc >= 1) {
      weatherAcc -= 1;
      const ember = Math.random() < w.emberRate * 0.1;
      const rnd = (a) => a[0] + Math.random() * (a[1] - a[0]);
      parts.push({
        kind: 'dot',
        x: Math.random() * stageW(), y: ember ? stageH() + 6 : -6,
        vx: rnd(w.vx), vy: ember ? -rnd([14, 34]) : rnd(w.vy),
        size: rnd(w.size) * (ember ? 1.3 : 1),
        color: ember ? '#ffd166' : w.colors[(Math.random() * w.colors.length) | 0],
        grav: 0, drag: w.drift * 0.1,
        life: 9, fade: 3, add: ember, alpha: ember ? 0.9 : 0.35,
      });
    }
  }
```

- [ ] **Step 2: Drive it from `src/ui.js`**

In `startCombatUI`, after `setTheme(...)`/scene setup (find the existing `setAmbience`/`setTheme` call at the top): `V.setWeather(S.run.act, { boss: kind === 'boss' });`
In `show(name, …)` add one line before the per-screen `render*` dispatch: `V.setWeather(null);` (combat re-arms it; Task 8 arms the map).

- [ ] **Step 3: Lantern breathing overlays**

In `startCombatUI`'s combat markup, after the `.stage-ledge` div:

```js
    <div class="stage-breath b1"></div><div class="stage-breath b2"></div>
```

CSS (per-act positions come from the existing `--ledge` tone; positions are fixed per spec):

```css
.stage-breath { position: absolute; width: 34cqw; height: 26cqh; border-radius: 50%; pointer-events: none; z-index: 0; opacity: 0.1; filter: blur(40px); background: radial-gradient(circle, var(--ledge, #8fa3d8) 0%, transparent 70%); animation: breath 7s ease-in-out infinite alternate; }
.stage-breath.b1 { left: 6cqw; bottom: calc(var(--ground-y) - 8cqh); }
.stage-breath.b2 { right: 8cqw; bottom: calc(var(--ground-y) - 12cqh); animation-delay: 3.2s; }
@keyframes breath { from { opacity: 0.06; transform: scale(0.94); } to { opacity: 0.16; transform: scale(1.06); } }
@media (prefers-reduced-motion: reduce) { .stage-breath { animation: none; opacity: 0.08; } }
```

- [ ] **Step 4: Gates — perf with ambient ON is the whole point**

Run: `PERF=1 npx playwright test perf --workers=1 --reporter=list`
Expected: still ≥55fps. If it dips, halve every `rate` in `WEATHER` and re-measure (record final numbers).

Run: `npm test && npm run build && npx playwright test --reporter=list`
Expected: visual diffs ONLY from the breathing overlays (the weather lives on the frozen-hidden `#vfx` canvas). Re-capture (`--update-snapshots`), eyeball, include.

- [ ] **Step 5: Commit**

```bash
git add -A && git commit -m "Ambient per-act weather + lantern breathing (perf gate holds)"
```

---

### Task 6: Combat readability (spec §6)

**Files:**
- Modify: `src/vfx.js` (`floatText` options), `src/ui.js` (drain `case 'hit'` ~1732, `case 'hitPlayer'` ~1806, `case 'enemyAct'` ~1908), `src/styles.css` (floaty tiers, telegraph, turn banner)
- Test: `test/e2e/battle.spec.js` (still green), visual baselines re-captured

- [ ] **Step 1: `floatText` learns tint + horizontal stagger**

In `src/vfx.js` change the signature and the two style lines:

```js
export function floatText(x, y, text, cls = '', { tint = '', dx = 0 } = {}) {
  const el = document.createElement('div');
  el.className = `floaty ${cls}`;
  el.innerHTML = text;
  el.style.left = `${x + dx}px`;
  el.style.top = `${y}px`;
  if (tint) el.style.color = tint;
  /* rest unchanged */
```

- [ ] **Step 2: Four damage tiers + archetype tint + per-hit stagger in `case 'hit'`**

The event already carries `ev.killingBlow` and `ev.overkill`. Above `drain()` add a module-level `let hitSeq = 0;` and reset it in `case 'play'` and `case 'enemyAct'` (`hitSeq = 0;`). Replace the enemy damage floater line:

```js
        if (ev.amount > 0) {
          const tier = ev.killingBlow && ev.overkill >= 8 ? 'dmg-overkill' : ev.killingBlow ? 'dmg-kill' : big ? 'dmg-big' : 'dmg';
          V.floatText(ex, ey - 24, `${ev.amount}`, tier, { tint: V.ARCHETYPE_TONES[vfxSource.archetype] || '', dx: (hitSeq++ % 3 - 1) * 34 });
        }
        else if (!ev.blocked) V.floatText(ex, ey - 24, '0', 'blockedf');
```

Mirror the same tier line in `case 'hitPlayer'` (there `big` is `ev.amount >= 16`, tint from `vfxSource.archetype`, no killingBlow — use `big ? 'dmg-big' : 'dmg'`). CSS type scale (the existing `.floaty` base is 32px / `.crit` 44px — keep `.crit` for compatibility):

```css
.floaty.dmg-big { font-size: 42px; }
.floaty.dmg-kill { font-size: 52px; text-shadow: 0 0 22px currentColor, 0 2px 4px #000; }
.floaty.dmg-overkill { font-size: 62px; -webkit-text-stroke: 1.5px #fff; text-shadow: 0 0 30px currentColor, 0 2px 6px #000; }
```

and in the ≤740 block: `.floaty.dmg-big { font-size: 30px; } .floaty.dmg-kill { font-size: 38px; } .floaty.dmg-overkill { font-size: 44px; }`

- [ ] **Step 3: "Guard shattered" beat**

In `case 'hit'`, inside the existing `if (ev.blocked > 0)` branch, add after the burst:

```js
          if (cb.enemies[ev.idx].block === 0 && ev.amount === 0) {
            V.floatText(ex, ey - 2, 'GUARD SHATTERED', 'shatterf');
            V.shardSpray(ex, ey, '#9fd4ff', 14);
          }
```

Same in `case 'hitPlayer'` with `cb.player.block === 0` and hero coords. CSS:

```css
.floaty.shatterf { font-size: 15px; letter-spacing: 0.2em; color: #9fd4ff; font-family: 'Cinzel', serif; }
```

- [ ] **Step 4: Telegraph + move plate + turn banner**

Strengthen the existing telegraph class (`x.intent.classList.add('telegraph')` in `case 'enemyAct'`):

```css
.intent.telegraph { animation: teleFlash 0.5s ease-in-out 2; }
@keyframes teleFlash { 50% { transform: scale(1.22); filter: brightness(1.8) drop-shadow(0 0 10px currentColor); } }
```

Find the move-name floater in `case 'enemyAct'` (`V.floatText(..., 'movef')` — if the class differs, restyle whichever class that call uses):

```css
.floaty.movef { font-size: 14px; letter-spacing: 0.14em; font-family: 'Cinzel', serif; background: var(--glass-fill); border: 1px solid var(--gold-line); border-radius: 6px; padding: 4px 12px; color: var(--parchment); }
```

Turn banner (`.turn-banner`, styles.css line ~736) — add the stained-glass plate without touching its keyframes:

```css
.turn-banner { background: var(--glass-fill); border-top: 1px solid var(--gold-line); border-bottom: 1px solid var(--gold-line); padding: 10px 40px; }
```

- [ ] **Step 5: Gates + commit**

Run: `npm test && npm run build && npx playwright test battle geometry stage --reporter=list` → green.
Re-capture visual baselines (turn banner changed): `npx playwright test visual --update-snapshots --reporter=list`, eyeball diffs.

```bash
git add -A && git commit -m "Combat readability: damage tiers, guard-shatter beat, telegraph, banner plate"
```

---

### Task 7: Transitions (spec §7)

**Files:**
- Modify: `index.html` (one overlay div), `src/ui.js` (`transition()` helper + call sites), `src/styles.css`
- Test: battle suite green (transitions must not break playback timing), visual re-capture only if end-state pixels change (they shouldn't — transitions are transient)

**Interfaces:**
- Produces: `async function transition(kind, opts = {})` in `ui.js`; kinds `'combat-in' | 'victory-out' | 'defeat' | 'act-change'`.

- [ ] **Step 1: The overlay element**

`index.html`, inside `#stage` after `#wipe`: `<div id="transit"></div>`. CSS:

```css
#transit { position: fixed; inset: 0; z-index: 62; pointer-events: none; display: none; }
#transit.on { display: block; }
#transit .tr-iris { position: absolute; inset: 0; background: #05070e; }
#transit .tr-bloom { position: absolute; inset: 0; background: radial-gradient(circle at 50% 45%, #ffe9ac 0%, #f2c14e55 30%, transparent 70%); }
#transit .tr-crack { position: absolute; inset: 0; background: rgba(3, 4, 10, 0.9); }
#transit .tr-plate { position: absolute; inset: 0; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 10px; background: rgba(5, 7, 14, 0.88); font-family: 'Cinzel', serif; }
#transit .tr-plate .tp-act { font-size: 44px; letter-spacing: 0.24em; color: var(--gold); }
#transit .tr-plate .tp-omen { font-size: 15px; letter-spacing: 0.14em; color: var(--text-dim); }
```

- [ ] **Step 2: The helper in `ui.js`**

```js
// one-shot screen transitions (spec §7). clip-path is allowed here by spec.
async function transition(kind, opts = {}) {
  if (REDUCED) return;
  const t = $('#transit');
  const run = (html, kf, dur) => {
    t.innerHTML = html;
    t.classList.add('on');
    return t.firstElementChild.animate(kf, { duration: dur, easing: 'cubic-bezier(0.4, 0, 0.2, 1)' }).finished
      .catch(() => {}).finally(() => { t.classList.remove('on'); t.innerHTML = ''; });
  };
  if (kind === 'combat-in') {
    const x = opts.x ?? stageW() / 2, y = opts.y ?? stageH() / 2;
    return run('<div class="tr-iris"></div>', [
      { clipPath: `circle(150% at ${x}px ${y}px)` },
      { clipPath: `circle(0% at ${x}px ${y}px)` },
    ], 480);
  }
  if (kind === 'victory-out') return run('<div class="tr-bloom"></div>', [{ opacity: 0 }, { opacity: 1, offset: 0.4 }, { opacity: 0 }], 900);
  if (kind === 'defeat') return run('<div class="tr-crack"></div>', [{ opacity: 0 }, { opacity: 1 }], 700);
  if (kind === 'act-change') {
    const omen = OMENS[S.run.omens?.[S.run.act]];
    return run(`<div class="tr-plate"><div class="tp-act">ACT ${S.run.act + 1} — ${ACTS[S.run.act].name.toUpperCase()}</div>
      ${omen ? `<div class="tp-omen" style="color:${omen.tone}">${iconSvg(`omen-${S.run.omens[S.run.act]}`, 16)} OMEN — ${omen.name.toUpperCase()}</div>` : ''}</div>`,
      [{ opacity: 0 }, { opacity: 1, offset: 0.15 }, { opacity: 1, offset: 0.8 }, { opacity: 0 }], 2200);
  }
}
```

- [ ] **Step 3: Call sites**

- `enterNode` combat branch: `const g = $(`.mnode[data-node="${node.id}"]`); const c = g ? V.centerOf(g) : {}; transition('combat-in', c);` then `startCombatUI(...)` (don't await — the iris covers the swap).
- `victoryFlow()`: first line `transition('victory-out');`
- `defeatFlow()`: first line `transition('defeat');`
- Act change: find where a boss win advances the act and shows the map (`show('reward'…)` → boss reward continue → `show('map')` path in `renderBossRelic`/reward continue handler). At the point `run.act` has just incremented and the map is about to show, call `transition('act-change')` and delete the old `banner('ACT …')`-style call if present (`omenBanner` may stay — the plate now announces the omen; if `omenBanner(run)` fires on map render, gate it: `if (!transitionShownForAct)` — simpler: remove the `omenBanner` call on act-change only, keep it for run start).
- Boss intro plate: in `startCombatUI`, where the rose-window is built (line ~775), append inside the same wrapper: `<div class="boss-plate">${ENEMIES[enemyIds[0]].name.toUpperCase()}</div>` with CSS `.boss-plate { position: absolute; left: 50%; top: 62%; transform: translateX(-50%); font-family: 'Cinzel', serif; font-size: 24px; letter-spacing: 0.3em; color: var(--gold); text-shadow: 0 0 24px #000; }`.

- [ ] **Step 4: Gates + commit**

Run: `npm test && npm run build && npx playwright test --reporter=list`
Expected: all green (battle timing unaffected — transitions don't block `drain`). The random-agent mini-run exercises victory/defeat paths.

```bash
git add -A && git commit -m "Screen transitions: combat iris, victory bloom, defeat crack, act plate"
```

---

### Task 8: Map screen upgrade (spec §8)

**Files:**
- Modify: `src/styles.css` (mnode chrome), `src/ui.js` (`renderMap` ~601: haze + weather + hints)
- Test: visual map baselines re-captured; geometry/battle untouched

- [ ] **Step 1: Medallion restyle + beacon + pulse + dim (CSS only)**

The SVG structure per node is `g.mnode > g.nwrap > (circle.bg + g.icg)`; classes `avail/current/visited/unlit` already exist, edges are `path.medge[.walked]`. Restyle:

```css
.mnode circle.bg { stroke: var(--gold-dim); stroke-width: 1.2; }
.mnode.current circle.bg { stroke: var(--gold); stroke-width: 2; filter: drop-shadow(0 0 14px rgba(242, 193, 78, 0.8)); }
.mnode.avail .nwrap { animation: nodePulse 1.6s ease-in-out infinite; }
@keyframes nodePulse { 50% { transform: scale(1.09); } }
.mnode.visited:not(.current) { opacity: 0.55; }
.medge.walked { opacity: 0.25; }
@media (prefers-reduced-motion: reduce) { .mnode.avail .nwrap { animation: none; } }
```

(If `.mnode.avail circle.bg` already animates — reduced-motion block references it — replace that old pulse with this one.)

- [ ] **Step 2: Act haze + low-density weather**

In `renderMap`, inside the `.map-screen` div before the svg: `<div class="map-haze" style="--haze:${['#2a3a2e','#1f2e40','#3a2030'][run.act] ?? '#2a3a2e'}"></div>`

```css
.map-haze { position: absolute; left: 0; right: 0; top: 30%; height: 45%; pointer-events: none; z-index: 0; opacity: 0.35; filter: blur(60px); background: radial-gradient(ellipse at 50% 50%, var(--haze) 0%, transparent 70%); }
```

At the end of `renderMap`: `V.setWeather(run.act, { mult: 0.3 });` (Task 5's `show()` line clears it for other screens; verify `renderMap` runs after that clear).

- [ ] **Step 3: Node hint cards**

The `_tip` wiring already exists (~line 657). Enrich the `names` table with a hint line per type via `sub`:

```js
    const hints = { monster: 'A fight. Embers and gold for the swift.', elite: 'A titled foe — greater risk, a relic-grade purse.', event: 'Fate unwritten. Could be anything.', rest: 'Heal, or forge a card into its + form.', shop: 'Gold for cards, relics, phials.', treasure: 'A chest with no fight attached.', boss: 'The act ends here. Ready your deck.' };
```

and add `sub: hints[n.type]` to the non-unlit `_tip` object.

- [ ] **Step 4: Gates + commit**

Run: `npm test && npm run build && npx playwright test --reporter=list`; re-capture map visual baselines, eyeball diffs (map screenshots freeze the canvas — only the haze + medallion chrome should diff).

```bash
git add -A && git commit -m "Map upgrade: medallion chrome, beacon, act haze, low-density weather, node hints"
```

---

### Task 9: Non-combat scene panels (spec §9)

**Files:**
- Modify: `src/ui.js` (`renderRest` ~2155, `renderTreasure` ~2197, `renderReward` ~2019, shop/event render fns, `renderLamplighter`), `src/styles.css`

- [ ] **Step 1: One shared backdrop helper in `ui.js`**

```js
// the act's own diorama, dimmed behind the glass panel — zero-asset fallback = today's flat backdrop
function sceneBg() {
  const u = assetUrl('stage', `act${(S.run?.act ?? 0) + 1}-backdrop`);
  return u ? `<div class="scene-bg" style="background-image:url('${u}')"></div>` : '';
}
```

```css
.scene-bg { position: absolute; inset: 0; z-index: -1; background-size: cover; background-position: 50% 65%; opacity: 0.35; filter: blur(6px) saturate(0.8); pointer-events: none; }
.center-panel { position: relative; }
.ov-title::after { content: ''; display: block; width: 84px; height: 2px; margin: 8px auto 0; background: linear-gradient(90deg, transparent, var(--gold), transparent); }
```

- [ ] **Step 2: Inject it**

In each of `renderRest`, `renderTreasure`, `renderReward`, the shop render fn, the event render fn and `renderLamplighter`, add `${sceneBg()}` as the first child of the outermost `.center-panel` / screen wrapper div (before `<div class="panel">`).

- [ ] **Step 3: Button hierarchy pass**

One primary action per screen gets `.btn-primary` (rest→Rest, treasure→Open, reward→Continue, shop→Leave, event→first option):

```css
.btn-primary { background: linear-gradient(180deg, #f2c14e, #c89a30); color: #1a1206; border-color: transparent; font-weight: 700; }
.btn-primary:hover { filter: brightness(1.1); }
```

Add the class in each render fn's primary button markup.

- [ ] **Step 4: Gates + commit**

Run: `npm test && npm run build && npx playwright test --reporter=list`; re-capture reward/shop/rest/treasure/event baselines, eyeball diffs.

```bash
git add -A && git commit -m "Scene panels: act backdrop behind non-combat screens, header ornament, button hierarchy"
```

---

### Task 10: Icon art bible + raster display wiring (spec §4, code half)

Wire the ≥32px call sites to prefer raster with the existing SVG as automatic fallback — shippable before any asset exists.

**Files:**
- Create: `docs/icon-art-bible.md`
- Modify: `src/ui.js` (`omenBanner` ~2145, lamplighter boon/art markup ~553–573, `case 'art'` ~1637, `renderGallery` cats ~2531)

**Interfaces:**
- Produces: asset categories `omens/`, `boons/`, `arts/` under `src/assets/` resolved via the existing `assetUrl(category, id)`; gallery sections for all three.

- [ ] **Step 1: Author `docs/icon-art-bible.md`**

Copy the style block + composition rules from `docs/relic-art-bible.md` (single centred emblem/prop, 512×512, transparent alpha, ~15% margin, painted stained-glass-and-brass language). Then this exact subject table:

| category | id | subject |
|---|---|---|
| omens | ashfall | grey ash falling past a cracked lantern pane |
| omens | heavyAir | a brass plumb-bob dragging chains of mist |
| omens | thinGlass | a wine-glass-thin pane, spiderweb crack blooming |
| omens | hungryDark | a black maw of smoke swallowing a candle flame |
| omens | emberWind | three embers streaking sideways on a gale line |
| omens | longNight | a moon-dial with the night arc gilded and overlong |
| omens | waningMoon | a crescent moon thinning into glass shards |
| boons | fullPurse | a fat leather purse spilling gold coins |
| boons | temperedGlass | a glass pane banded in riveted brass |
| boons | keenEye | a jeweller's loupe over a faceted gem |
| boons | warmHearth | a small hearth of stacked stones, banked coals |
| boons | emberFlask | a corked flask holding a live ember |
| boons | twinPhials | two slender phials, red and blue, crossed |
| boons | pilgrimsCache | a rope-bound bundle with a map corner showing |
| boons | venomPouch | a waxed pouch weeping one amber drop |
| arts | flare | a lantern bursting a cone of white-gold fire |
| arts | mendglass | a cracked pane re-seaming under green light |
| arts | beacon | a lantern raised on a pole, rays cutting fog |
| arts | emberveil | a curtain of sparks drawn like a veil |
| arts | stoke | a brass poker stirring a coal bed to flame |
| arts | ashfall | a lantern shaking a soft grey ash cloud downward |

- [ ] **Step 2: Wire the four display sites (raster preferred, SVG kept)**

`omenBanner` — swap the glyph span:

```js
  const oid = run.omens[run.act];
  const ou = assetUrl('omens', oid);
  const glyph = ou ? `<img class="ob-art" src="${ou}" alt="">` : `<span class="ob-glyph" style="color:${omen.tone}">${iconSvg(`omen-${oid}`, 22)}</span>`;
  const b = el('div', 'turn-banner omen-banner', `${glyph} OMEN — ${omen.name.toUpperCase()}<div class="ob-sub">${omen.text}</div>`);
```

```css
.ob-art { width: 44px; height: 44px; object-fit: contain; vertical-align: middle; filter: drop-shadow(0 2px 8px rgba(0,0,0,.6)); }
```

Lamplighter boon card (`lamp-boon` markup ~553): inside the button, before the name, add `${assetUrl('boons', id) ? `<img class="lb-art-img" src="${assetUrl('boons', id)}" alt="">` : ''}` with `.lb-art-img { width: 56px; height: 56px; object-fit: contain; }`.

Lamplighter art chip (`lamp-art` ~559): same pattern, 40px, category `'arts'`.

Art-cast moment (`case 'art'` in drain): after the `V.floatText(hx, hy - 84, …)` line:

```js
      const au = assetUrl('arts', ev.id);
      if (au) {
        const img = el('img', 'art-cast');
        img.src = au;
        $('#floaties').appendChild(img);
        img.style.left = `${hx}px`; img.style.top = `${hy - 30}px`;
        img.animate([
          { transform: 'translate(-50%,-50%) scale(0.4)', opacity: 0 },
          { transform: 'translate(-50%,-58%) scale(1)', opacity: 1, offset: 0.3 },
          { transform: 'translate(-50%,-70%) scale(1.05)', opacity: 0 },
        ], { duration: 900, easing: 'cubic-bezier(.2,.7,.3,1)' }).onfinish = () => img.remove();
      }
```

```css
.art-cast { position: fixed; width: 110px; height: 110px; object-fit: contain; pointer-events: none; z-index: 57; filter: drop-shadow(0 0 24px rgba(255, 217, 122, 0.5)); }
```

- [ ] **Step 3: Gallery categories**

In `renderGallery`'s `cats` object add (import `OMENS, BOONS, ARTS` are already imported in ui.js):

```js
    omens: Object.keys(OMENS).map((k) => [k, () => iconSvg(`omen-${k}`, 64)]),
    boons: Object.keys(BOONS).map((k) => [k, () => iconSvg(`boon-${k}`, 64)]),
    arts: Object.keys(ARTS).map((k) => [k, () => iconSvg(`art-${k}`, 64)]),
```

- [ ] **Step 4: Gates + commit**

Run: `npm test && npm run build && npx playwright test battle stage --reporter=list` → green (no assets yet — every site falls back to SVG; pixels unchanged, so no baseline updates).
Check `http://localhost:5174/?gallery=1` shows the three new sections with SVG badges.

```bash
git add -A && git commit -m "Icon art bible + raster wiring for omen banner, boon cards, art picker/cast (SVG fallback)"
```

---

### Task 11: Generate the 21 icons (spec §4, asset half)

**Requires imagegen access** (Codex CLI image tool — see `docs/imagegen.md`, wrapper `tools/imagegen.sh`, batch driver `tools/gen-batch.mjs`). If the tool is unavailable in your environment, STOP and report — do not fake assets.

**Files:**
- Create: `src/assets/omens/*.png` (7), `src/assets/boons/*.png` (8), `src/assets/arts/*.png` (6)
- Modify: `test/test_engine.js` (manifest gate, ~line 909)

- [ ] **Step 1: Generate per category** — follow `docs/generated-art-workflow.md` exactly as the relic batch did: prompts = bible style block + per-id subject row; 512×512; alpha strip via `tools/strip-alpha-rim.py`; filenames = internal ids (`src/assets/omens/ashfall.png`, …).

- [ ] **Step 2: Review in the gallery** — `http://localhost:5174/?gallery=1`: every cell in omens/boons/arts shows a PNG badge; reject and regenerate any icon that breaks silhouette readability at 44px (squint test).

- [ ] **Step 3: Extend the manifest gate** in `test/test_engine.js` next to the existing `checkManifest` calls:

```js
  checkManifest('omens', Object.keys(OMENS));
  checkManifest('boons', Object.keys(BOONS));
  checkManifest('arts', Object.keys(ARTS));
```

(add `OMENS, BOONS, ARTS` to the `data.js` import at the top of the file if missing.)

Run: `npm test` — Expected: PASS (fails loudly if any of the 21 files is missing or misnamed).

- [ ] **Step 4: Gates + commit**

Run: `npm run build && npx playwright test --reporter=list`; the omen banner appears on map entry — visual map baselines may diff; re-capture + eyeball.

```bash
git add -A && git commit -m "Generate 21 omen/boon/art raster icons + manifest gate"
```

---

### Task 12: Final sweep

- [ ] **Step 1: Full matrix**

Run: `npm test && npm run build && npx playwright test --reporter=list && PERF=1 npx playwright test perf --workers=1 --reporter=list`
Expected: every suite green on all three projects, perf gate green with ambient weather live.

- [ ] **Step 2: Manual smoke** — play one full act at `http://localhost:5174/` (desktop) and one fight in devtools 390×844: transitions fire, weather drifts, deaths shatter, no console errors, letterboxing correct at an odd window size (e.g. 1600×900).

- [ ] **Step 3: Update the spec's "Kit status" paragraph** in `docs/superpowers/specs/2026-07-06-visualisation-hardening-polish-design.md` — replace the hand-off failure list with the final green state + measured perf numbers.

- [ ] **Step 4: Commit + push**

```bash
git add -A && git commit -m "Visualisation hardening & polish II complete: all QA gates green" && git push
```
