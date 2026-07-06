# Battlefield Layout File + In-Game Editor — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Move every combat-stage geometry number (hero, enemy formations, the
three painted background plates, the ground line) out of CSS into one
hand-editable data file, and build a dev-only in-game editor (`?bfedit=1`)
that edits that file live and writes it back through a vite dev endpoint.

**Architecture:** `src/battlefield-layout.js` (pure data) + `src/battlefield.js`
(resolver: deep-merge base ← per-shape override, defaults, slot fallback).
`ui.js` applies the resolved layout in `renderCombat()` via CSS custom
properties and inline styles on absolutely-positioned combatant boxes.
The editor (`src/dev/bf-editor.js`) is dynamic-imported behind
`import.meta.env.DEV && ?bfedit=1`, mutates a working copy through the
`_setBF()` hook, and saves via `POST /__bf-save` (vite dev middleware +
deterministic serializer in `src/dev/bf-serialize.js`).

**Tech Stack:** Vite 8 (ESM, `"type": "module"`), vanilla JS, Playwright
(existing kit in `test/e2e/`), `node:assert` self-check in `test/test_engine.js`.

**Spec:** `docs/superpowers/specs/2026-07-06-battlefield-editor-design.md` —
read it before starting. It supersedes Tasks 1, 4, 5 of
`docs/superpowers/plans/2026-07-06-visualisation-hardening-polish.md`.

## Global Constraints

- `src/battlefield-layout.js` and `src/battlefield.js` import nothing (except
  the former by the latter) and must stay Node-importable. Never import
  `audio.js`, `ui.js`, or anything DOM-touching from them.
- `engine.js` / `vigil.js` never import or reference battlefield files.
- All layout numbers are **stage px** for their shape (see `src/stage.js`:
  phone-portrait 390×844, phone-landscape 844×390, pad-portrait 820×1180,
  pad-landscape 1180×820, desktop-landscape 1458×820).
- Editor code loads only via `import.meta.env.DEV` + `?bfedit=1` dynamic
  import; `npm run build` output must not contain it.
- The save endpoint exists only on the dev server (`apply: 'serve'`).
- Serializer is deterministic: same input object ⇒ byte-identical file.
- Gates at every task boundary: `npm test` green; the Playwright suites named
  in the task green. Dev server for e2e: the Playwright config starts/reuses
  `npm run dev` on port 5174 automatically.
- Commit at the end of every task. Do not commit `dist/` (only the final
  full-gate task runs `npm run build`, and even then do not commit dist
  unless the owner asks).
- Display-name/key discipline and all other invariants from `AGENTS.md` hold.

## File Structure

| File | Role |
|---|---|
| `src/battlefield-layout.js` (create) | Pure data: `export const BF`. The file the owner hand-edits and the editor rewrites |
| `src/battlefield.js` (create) | Resolver: `bfResolve`, `bfActor`, `bfSlots`, `bfEnemySize`, `_setBF`, `bfRaw`. Imports only the data file |
| `src/ui.js` (modify) | `renderCombat` markup plates; `applyBattlefieldLayout()`; delete `enemyArtSize()`; expose `refitCombat` on `window.spirebound` |
| `src/styles.css` (modify) | Plates CSS; `--ground-y` derivations; delete combat geometry magic numbers from base + all 3 container blocks |
| `src/main.js` (modify) | Dev-only dynamic import of the editor |
| `src/dev/bf-editor.js` (create) | The editor: sandbox fight, toolbar, overlays, drag/resize, panel, save |
| `src/dev/bf-serialize.js` (create) | `serializeBF(bf)`, `validateBF(bf, ids?)` — shared by editor (browser) and vite plugin (node); imports nothing |
| `vite.config.js` (modify) | `bfSavePlugin()` dev middleware |
| `test/test_engine.js` (modify) | Schema gate + serializer round-trip gate |
| `test/e2e/bfeditor.spec.js` (create) | Editor smoke suite (desktop project only) |
| `docs/superpowers/plans/2026-07-06-visualisation-hardening-polish.md` (modify) | Mark Tasks 1/4/5 superseded |
| `AGENTS.md` (modify) | 3-line note: battlefield geometry source of truth + editor entry |

---

### Task 1: Layout data + resolver + schema gate

**Files:**
- Create: `src/battlefield-layout.js`
- Create: `src/battlefield.js`
- Test: `test/test_engine.js` (append a block before the monte-carlo section)

**Interfaces:**
- Produces: `BF` (data shape below); `bfResolve(shape) → {groundY, ledgeLip, hero, slots, layers, shared}`;
  `bfActor(kind, id) → {scale, footY, …}` with defaults, `kind ∈ 'enemies'|'heroes'`;
  `bfSlots(layout, count) → [{x, s}, …]` (interpolation fallback for undefined counts);
  `bfEnemySize(layout, key, tier, slot, stgW, stgH) → px` (`tier ∈ 'normal'|'elite'|'boss'`);
  `_setBF(bfOrNull)` (editor/test override hook, like vigil's `_setStore`); `bfRaw() → BF currently in effect`.

- [ ] **Step 1: Write the failing test.** Append to `test/test_engine.js`, immediately after the `checkManifest` block (around line 917) and before the monte-carlo section. Also add the import at the top of the file next to the other `../src/` imports:

```js
import { bfResolve, bfActor, bfSlots, bfEnemySize, _setBF, bfRaw } from '../src/battlefield.js';
```

```js
// ---- battlefield layout schema (spec 2026-07-06-battlefield-editor-design) ----
{
  const shapes = ['phone-portrait', 'phone-landscape', 'pad-portrait', 'pad-landscape', 'desktop-landscape'];
  for (const sh of shapes) {
    const L = bfResolve(sh);
    assert.ok(Number.isFinite(L.groundY) && L.groundY > 0, `bf: ${sh} groundY`);
    assert.ok(Number.isFinite(L.ledgeLip), `bf: ${sh} ledgeLip`);
    for (const k of ['x', 'w', 'h']) assert.ok(Number.isFinite(L.hero[k]), `bf: ${sh} hero.${k}`);
    for (const n of [1, 2, 3]) {
      const slots = bfSlots(L, n);
      assert.equal(slots.length, n, `bf: ${sh} slots(${n})`);
      for (const s of slots) assert.ok(Number.isFinite(s.x) && s.s > 0, `bf: ${sh} slots(${n}) entry`);
    }
    for (const layer of ['backdrop', 'mid', 'ledge']) {
      for (const k of ['h', 'y', 'zoom', 'posX', 'opacity']) {
        assert.ok(Number.isFinite(L.layers[layer][k]), `bf: ${sh} layers.${layer}.${k}`);
      }
    }
    for (const t of ['normal', 'elite', 'boss']) assert.ok(L.shared.sizes[t] > 0, `bf: ${sh} sizes.${t}`);
  }
  for (const key of Object.keys(ENEMIES)) {
    const a = bfActor('enemies', key);
    assert.ok(Number.isFinite(a.scale) && Number.isFinite(a.footY), `bf: enemy actor ${key}`);
  }
  for (const a of ASPECTS) {
    const h = bfActor('heroes', a.id);
    assert.ok(Number.isFinite(h.scale) && Number.isFinite(h.footY), `bf: hero actor ${a.id}`);
  }
  // slot interpolation fallback: a count with no authored formation still lays out
  assert.equal(bfSlots(bfResolve('pad-landscape'), 4).length, 4, 'bf: slot fallback');
  // clamp guard: an absurd hand-edit cannot blow art past the stage frame
  const L = bfResolve('pad-landscape');
  _setBF({ ...bfRaw(), shared: { ...bfRaw().shared, sizes: { normal: 99999, elite: 99999, boss: 99999 } } });
  assert.ok(bfEnemySize(bfResolve('pad-landscape'), 'duskfang', 'normal', { x: 0, s: 1 }, 1180, 820) <= 820 * 0.35 + 1, 'bf: size clamp');
  _setBF(null);
  assert.equal(bfResolve('pad-landscape').groundY, L.groundY, 'bf: _setBF(null) restores the file');
}
```

- [ ] **Step 2: Run to verify it fails.** Run: `npm test`. Expected: FAIL with `Cannot find module '../src/battlefield.js'`.

- [ ] **Step 3: Create `src/battlefield-layout.js`** — full content (the seed values approximate today's look; feet land ON the ground line, which today's CSS gets wrong — that correction is intended):

```js
// Battlefield layout — owned by the battlefield editor (?bfedit=1 on the dev
// server), hand edits welcome: keep the shape, keep numbers finite.
// All values are STAGE px for their shape (see src/stage.js). Conventions:
//   x       — actor's horizontal CENTER
//   footY   — feet offset from the ground line (art whose feet aren't at the
//             sprite's bottom edge), + is up
//   scale   — multiplies the tier size (sizes.normal/elite/boss)
//   slot.s  — per-formation size multiplier (keeps wide lineups on-ledge)
//   layers  — h: plate height; y: plate bottom offset from stage bottom (+up);
//             zoom: image scale inside the plate; posX: horizontal focus %
// Imports nothing; imported by src/battlefield.js only.
export const BF = {
  shared: {
    sizes: { normal: 185, elite: 230, boss: 280 },
    heroes: {
      duskblade: { scale: 1, footY: 0 },
      ashwarden: { scale: 1, footY: 0 },
    },
    enemies: {
      sporeling: { scale: 0.62, footY: 0 },
      duskfang: { scale: 0.95, footY: 0 },
      gloomslime: { scale: 0.95, footY: 0 },
      waylayer: { scale: 0.9, footY: 0 },
      thornling: { scale: 0.81, footY: 0 },
      ashAcolyte: { scale: 0.95, footY: 0 },
      gravewarden: { scale: 1.19, footY: 0 },
      alphaFang: { scale: 1.24, footY: 0 },
      rootheart: { scale: 1.45, footY: 0 },
      drownedOne: { scale: 0.95, footY: 0 },
      voltEel: { scale: 0.86, footY: 0 },
      mirelurker: { scale: 0.9, footY: 0 },
      tidecaller: { scale: 1, footY: 0 },
      shellback: { scale: 1.09, footY: 0 },
      deepmaw: { scale: 1.14, footY: 0 },
      abyssalKnight: { scale: 1.24, footY: 0 },
      siren: { scale: 1.09, footY: 0 },
      leviathan: { scale: 1.45, footY: 0 },
      voidWisp: { scale: 0.67, footY: 0 },
      obsidianGolem: { scale: 1.24, footY: 0 },
      starCultist: { scale: 1, footY: 0 },
      shade: { scale: 0.95, footY: 0 },
      chaosHound: { scale: 1.05, footY: 0 },
      watcherEye: { scale: 1, footY: 0 },
      voidColossus: { scale: 1.45, footY: 0 },
      heraldOfEnd: { scale: 1.4, footY: 0 },
      sovereign: { scale: 1.45, footY: 0 },
    },
  },
  base: {
    groundY: 232,
    ledgeLip: 14,
    hero: { x: 179, w: 190, h: 285 },
    slots: {
      1: [{ x: 980, s: 1 }],
      2: [{ x: 820, s: 1 }, { x: 1035, s: 1 }],
      3: [{ x: 615, s: 1 }, { x: 825, s: 1 }, { x: 1035, s: 1 }],
    },
    layers: {
      backdrop: { h: 640, y: 0, zoom: 1, posX: 50, opacity: 0.85 },
      mid: { h: 476, y: 0, zoom: 1, posX: 50, opacity: 0.95 },
      ledge: { h: 246, y: 0, zoom: 1, posX: 50, opacity: 1 },
    },
  },
  shapes: {
    'desktop-landscape': {
      hero: { x: 193 },
      slots: {
        1: [{ x: 1300, s: 1 }],
        2: [{ x: 1085, s: 1 }, { x: 1300, s: 1 }],
        3: [{ x: 870, s: 1 }, { x: 1085, s: 1 }, { x: 1300, s: 1 }],
      },
    },
    'pad-portrait': {
      groundY: 210,
      hero: { x: 136 },
      slots: {
        1: [{ x: 700, s: 1 }],
        2: [{ x: 505, s: 0.95 }, { x: 710, s: 1 }],
        3: [{ x: 420, s: 0.85 }, { x: 575, s: 0.85 }, { x: 730, s: 0.9 }],
      },
      layers: {
        backdrop: { h: 920, y: 0, zoom: 1, posX: 50, opacity: 0.85 },
        mid: { h: 684, y: 0, zoom: 1, posX: 50, opacity: 0.95 },
        ledge: { h: 224, y: 0, zoom: 1, posX: 50, opacity: 1 },
      },
    },
    'phone-portrait': {
      groundY: 218,
      hero: { x: 68, w: 129, h: 193 },
      slots: {
        1: [{ x: 300, s: 1 }],
        2: [{ x: 225, s: 0.65 }, { x: 330, s: 0.7 }],
        3: [{ x: 190, s: 0.5 }, { x: 265, s: 0.5 }, { x: 340, s: 0.55 }],
      },
      layers: {
        backdrop: { h: 658, y: 0, zoom: 1, posX: 50, opacity: 0.85 },
        mid: { h: 489, y: 0, zoom: 1, posX: 50, opacity: 0.95 },
        ledge: { h: 232, y: 0, zoom: 1, posX: 50, opacity: 1 },
      },
    },
    'phone-landscape': {
      groundY: 132,
      hero: { x: 135, w: 125, h: 187 },
      slots: {
        1: [{ x: 730, s: 0.66 }],
        2: [{ x: 590, s: 0.62 }, { x: 730, s: 0.62 }],
        3: [{ x: 480, s: 0.55 }, { x: 610, s: 0.55 }, { x: 740, s: 0.55 }],
      },
      layers: {
        backdrop: { h: 304, y: 0, zoom: 1, posX: 50, opacity: 0.85 },
        mid: { h: 226, y: 0, zoom: 1, posX: 50, opacity: 0.95 },
        ledge: { h: 146, y: 0, zoom: 1, posX: 50, opacity: 1 },
      },
    },
  },
};
```

- [ ] **Step 4: Create `src/battlefield.js`** — full content:

```js
// Battlefield layout resolver. Data lives in battlefield-layout.js (the file
// the ?bfedit editor rewrites); this module only merges and defaults it.
// Imports nothing DOM-touching; Node-importable (test_engine.js gates it).
import { BF as FILE_BF } from './battlefield-layout.js';

let BF = FILE_BF;
/** Editor/test hook: override the layout in effect (null = back to the file). */
export function _setBF(bf) { BF = bf || FILE_BF; }
export function bfRaw() { return BF; }

const isObj = (v) => v && typeof v === 'object' && !Array.isArray(v);
// objects merge key-wise; arrays and scalars replace wholesale (a shape that
// overrides a formation must supply the complete slot array)
function merge(base, over) {
  if (over === undefined) return base;
  if (!isObj(base) || !isObj(over)) return over;
  const out = { ...base };
  for (const k of Object.keys(over)) out[k] = merge(base[k], over[k]);
  return out;
}

/** Deep-merged layout for a stage shape (unknown shape ⇒ base). */
export function bfResolve(shape) {
  const layout = merge(BF.base, BF.shapes?.[shape]);
  return { ...layout, shared: BF.shared };
}

/** Per-actor shared modifiers with defaults. kind: 'enemies' | 'heroes'. */
export function bfActor(kind, id) {
  return { scale: 1, footY: 0, ...(BF.shared?.[kind]?.[id] ?? {}) };
}

/** Formation for an enemy count; missing counts interpolate the widest authored one. */
export function bfSlots(layout, count) {
  const authored = layout.slots?.[count];
  if (authored) return authored;
  const counts = Object.keys(layout.slots ?? {}).map(Number).filter(Number.isFinite).sort((a, b) => a - b);
  if (!counts.length) return Array.from({ length: count }, (_, i) => ({ x: 200 + i * 200, s: 1 }));
  const src = layout.slots[counts[counts.length - 1]];
  const lo = src[0], hi = src[src.length - 1];
  return Array.from({ length: count }, (_, i) => {
    const t = count === 1 ? 1 : i / (count - 1);
    return { x: Math.round(lo.x + (hi.x - lo.x) * t), s: Math.min(lo.s ?? 1, hi.s ?? 1) };
  });
}

/** Art box px for an enemy: tier size × type scale × slot s, typo-guarded. */
export function bfEnemySize(layout, key, tier, slot, stgW, stgH) {
  const t = bfActor('enemies', key);
  const raw = (layout.shared.sizes?.[tier] ?? 185) * t.scale * (slot?.s ?? 1);
  return Math.round(Math.max(56, Math.min(raw, stgH * (tier === 'boss' ? 0.4 : 0.35), stgW * 0.6)));
}
```

- [ ] **Step 5: Run to verify it passes.** Run: `npm test`. Expected: PASS, output ends `unit checks passed; monte-carlo: 300 runs, …`.

- [ ] **Step 6: Commit.**

```bash
git add src/battlefield-layout.js src/battlefield.js test/test_engine.js
git commit -m "feat: battlefield layout data file + resolver with schema gate"
```

---

### Task 2: Chrome plates — the positioned box becomes the art box

Move the below-art chrome (name/HP/facets/statuses) into an absolutely
positioned plate under each combatant, so a combatant's flow box bottom IS its
feet. No layout-file consumption yet; flexbox still places everyone. Visuals:
enemies drop toward the ground line (intended — that gap is the shipped
defect), chrome hangs where it was.

**Files:**
- Modify: `src/ui.js` (renderCombat markup only, ~lines 792–832)
- Modify: `src/styles.css` (`.enemy`, `.player-zone`, `.intent`, `.lightpool`, shadow offsets)

**Interfaces:**
- Consumes: nothing new.
- Produces: `.cplate` class (one per combatant, holds the chrome rows); `.enemy` and `.player-zone` boxes whose border-box equals the art box. Task 3 positions these boxes absolutely.

- [ ] **Step 1: Rework the hero markup in `renderCombat()`** (`src/ui.js` ~line 799). Replace the `.player-zone` block with:

```js
      <div class="player-zone">
        <div class="hero-wrap">
          <div class="hero-name">${ASPECTS[S.run.aspect].name.toUpperCase()}</div>
          ${heroArt(S.run.aspect)}
        </div>
        <div class="cplate">
          <div class="hpbar-wrap"><span class="block-chip zero p-block">${iconSvg('shield', 13)} 0</span><div class="hpbar"><div class="ghost"></div><div class="fill"></div></div><span class="hp-label p-hp"></span></div>
          <div class="status-row p-status"></div>
        </div>
      </div>
```

- [ ] **Step 2: Rework the enemy markup** (`src/ui.js` ~line 827). Replace `box.innerHTML` with:

```js
    box.innerHTML = `<div class="intent"></div>
      <div class="enemy-art" style="width:${size}px;height:${size}px"><div class="enemy-sprite">${rasterOr('enemies', en.key, enemySvg(d.art))}</div><div class="dmg-preview"></div></div>
      <div class="cplate">
        <div class="name">${afx ? `<span class="affix-name" style="color:${afx.tone}">${afx.name.toUpperCase()}</span> ` : ''}${en.name.toUpperCase()}</div>
        <div class="hpbar-wrap"><span class="block-chip zero">${iconSvg('shield', 13)} 0</span><div class="hpbar"><div class="ghost"></div><div class="fill"></div><div class="pv"></div></div><span class="hp-label"></span></div>
        <div class="facet-row"></div>
        <div class="status-row"></div>
      </div>`;
```

(All `ce.enemies[i]` / `ce.p*` lookups are class queries inside the box and need no change.)

- [ ] **Step 3: CSS.** In `src/styles.css`:

Replace the `.enemy` rule (~line 491) and `.player-zone` rule (~line 482):

```css
.player-zone { position: relative; width: 240px; transform: translateY(25px); }
.enemy { position: relative; transition: filter 0.2s, transform 0.25s; }
```

Add, right after `.enemy`:

```css
/* the chrome plate: name/HP/facets/statuses hang below the art box, out of
   flow, so the combatant's box bottom IS its feet (ground-line contract) */
.cplate { position: absolute; top: 100%; left: 50%; translate: -50% 0; display: flex; flex-direction: column; align-items: center; gap: 6px; z-index: 3; padding-top: 6px; width: max-content; max-width: 260px; }
.enemy .intent { position: absolute; bottom: calc(100% + 8px); left: 50%; translate: -50% 0; z-index: 3; }
```

`.hero-wrap` keeps its size rules for now (Task 3 moves them to the layout
file). The hero `.cplate` inherits `.player-zone`'s centering via `left: 50%`.

Re-anchor pools and shadows to the new feet line — change these existing rules:

```css
.enemy-art > .lightpool { bottom: -14px; }
.enemy-art::after { bottom: -5px; }
```

(they were `-65px` / `-51px` to reach past the in-flow chrome), and delete the
`.lightpool` / `.enemy-art > .lightpool` overrides inside the
`@container stage (max-width: 1100px)`, `(max-width: 740px)` and
`(max-height: 480px)` blocks (the base values now serve all shapes).

- [ ] **Step 4: Verify.** Run: `npx playwright test battle --project=desktop` — Expected: same pass/fail set as before this task (the two mesh-corpse reds are pre-existing, tracked by the hardening plan's Task 2; nothing NEW may fail — HP/hand/energy invariant tests all green). Run `npm test` — PASS. Manual: `npm run dev`, start a fight, confirm name/HP read below each combatant and intents float above.

- [ ] **Step 5: Commit.**

```bash
git add src/ui.js src/styles.css
git commit -m "refactor: combatant chrome into below-art plates (box bottom = feet)"
```

---

### Task 3: Data-driven geometry — the game reads the layout file

**Files:**
- Modify: `src/ui.js` (imports; `applyBattlefieldLayout()`; delete `enemyArtSize()` ~lines 898–906; resize handler ~lines 908–921; `renderCombat` call site; `window.spirebound` ~line 2701)
- Modify: `src/styles.css` (base combat rules + the three container blocks)
- Test: existing `test/e2e/geometry.spec.js` goes green (it currently fails by design)

**Interfaces:**
- Consumes: everything Task 1 exports.
- Produces: `applyBattlefieldLayout()` (module-private) and `window.spirebound.refitCombat()` — re-resolves the current shape and reapplies ground vars, layer styles, combatant positions and sizes to the live combat. The editor (Task 5) calls `refitCombat` after every edit.

- [ ] **Step 1: Confirm the failing state.** Run: `npx playwright test geometry --project=desktop`. Expected: FAIL — feet off the ground line (record the numbers in the task log).

- [ ] **Step 2: Imports + apply function in `src/ui.js`.** Add to the import block:

```js
import { bfResolve, bfActor, bfSlots, bfEnemySize } from './battlefield.js';
```

Replace the whole `enemyArtSize` function AND the resize-refit block (~lines 898–921) with:

```js
// battlefield geometry comes from src/battlefield-layout.js (edit with
// ?bfedit=1 on the dev server); this applies the resolved layout to the DOM
function applyBattlefieldLayout() {
  const cb = S.cb, ce = S.ce;
  if (!cb || !ce || S.screen !== 'combat') return;
  const L = bfResolve(stageInfo().shape);
  ce.root.style.setProperty('--ground-y', `${L.groundY}px`);
  ce.root.style.setProperty('--ledge-lip', `${L.ledgeLip}px`);
  for (const name of ['backdrop', 'mid', 'ledge']) {
    const img = ce.root.querySelector(`.sl-${name}`);
    if (!img) continue;
    const p = L.layers[name];
    img.style.height = `${p.h}px`;
    img.style.bottom = `${p.y}px`;
    img.style.opacity = p.opacity;
    img.style.scale = p.zoom === 1 ? '' : String(p.zoom);
    img.style.objectPosition = `${p.posX}% ${name === 'ledge' ? '0%' : '100%'}`;
  }
  const hero = bfActor('heroes', ASPECTS[S.run.aspect].id);
  const hw = Math.round(L.hero.w * hero.scale), hh = Math.round(L.hero.h * hero.scale);
  const pz = ce.root.querySelector('.player-zone');
  pz.style.width = `${hw}px`;
  pz.style.height = `${hh}px`;
  pz.style.left = `${Math.round(L.hero.x - hw / 2)}px`;
  pz.style.bottom = `${hero.footY}px`; // relative to .battlefield bottom = the ground line
  const slots = bfSlots(L, cb.enemies.length);
  cb.enemies.forEach((en, i) => {
    const d = ENEMIES[en.key];
    const tier = d.boss ? 'boss' : d.elite ? 'elite' : 'normal';
    const size = bfEnemySize(L, en.key, tier, slots[i], stageW(), stageH());
    const box = ce.enemies[i].root;
    box.style.left = `${Math.round(slots[i].x - size / 2)}px`;
    box.style.bottom = `${bfActor('enemies', en.key).footY}px`;
    box.style.width = box.style.height = `${size}px`;
    ce.enemies[i].art.style.width = ce.enemies[i].art.style.height = `${size}px`;
  });
}
function refitCombat() {
  applyBattlefieldLayout();
  layoutHand();
  scheduleMeshBind();
}
// rotate the phone mid-fight and the stage re-fits itself
let fitT = 0;
addEventListener('resize', () => {
  clearTimeout(fitT);
  fitT = setTimeout(() => { if (S.cb && S.ce && S.screen === 'combat') refitCombat(); }, 120);
});
```

- [ ] **Step 3: Call sites.** In `renderCombat()`: the enemy markup keeps its
  inline `width:${size}px` — compute it with the new pipeline. Replace
  `const size = enemyArtSize(d, cb.enemies.length);` (~line 822) with:

```js
    const L = bfResolve(stageInfo().shape);
    const slots = bfSlots(L, cb.enemies.length);
    const size = bfEnemySize(L, en.key, d.boss ? 'boss' : d.elite ? 'elite' : 'normal', slots[i], stageW(), stageH());
```

(hoist `L` and `slots` above the `cb.enemies.forEach` — one resolve per render).
Immediately after `S.ce = ce;` (~line 878) add `applyBattlefieldLayout();`.
Add `refitCombat` to the debug hook (~line 2701):

```js
  window.spirebound = { S, E, startCombatUI, show, meshEnabled, meshDebug, refitCombat };
```

- [ ] **Step 4: CSS — derive from the tokens, delete the magic numbers.** In `src/styles.css`:

Replace the `.battlefield` base rule (~line 481) and add positioning for the boxes:

```css
.combat-screen { --ground-y: 232px; --ledge-lip: 14px; } /* JS overwrites from the layout file */
.battlefield { position: absolute; left: 0; right: 0; top: 0; bottom: var(--ground-y); pointer-events: none; }
.enemy-zone { position: absolute; inset: 0; pointer-events: none; }
.player-zone, .enemy { position: absolute; pointer-events: auto; }
.player-zone { transform: none; }
.hero-wrap { position: relative; width: 100%; height: 100%; }
```

(the `.combat-screen` line merges into the existing `.combat-screen` rule at
line 441; `.player-zone` loses `width: 240px` and `translateY(25px)`;
`.hero-wrap` loses `width: 190px; height: 285px`; `.enemy-zone` loses its flex
properties; `.enemy` from Task 2 gains `position: absolute` via the shared
rule above — drop its `position: relative`).

Replace the `.stage-ledge` position line (~line 444) so its top edge (the glow
seam's home) sits exactly on the ground line:

```css
.stage-ledge {
  position: absolute; left: 0; right: 0; --glow-h: 120px; height: var(--glow-h);
  bottom: calc(var(--ground-y) - var(--glow-h)); z-index: 0; pointer-events: none;
  /* background / mask lines unchanged */
}
```

Update `.sl` (~line 450): add `transform-origin: 50% 100%;` (the `scale`
property from JS must grow plates from the ground up, and it composes with the
`sl-drift` transform animation instead of fighting it). Remove `height` and
`opacity` from `.sl-backdrop` / `.sl-mid` / `.sl-ledge` (JS inline now owns
them); keep `--amp`, `object-fit`, `object-position` fallbacks, `animation`.

Fix the hero entrance keyframe (~line 478) — the 25px sink is gone:

```css
@keyframes heroIn { from { opacity: 0; transform: translateX(-70px); } to { transform: none; } }
```

In the `@container stage (max-width: 1100px)` block: delete the `.battlefield`
and `.stage-ledge` lines. In the `(max-width: 740px)` block: delete
`.battlefield`, `.player-zone { width: 31cqw }`, `.hero-wrap { … }`,
`.player-zone .hpbar-wrap { width: min(150px, 33cqw) }` and change
`.stage-ledge` to only `--glow-h: 90px;`. In the `(max-height: 480px)` block:
same deletions (`.player-zone { width: 22cqw }`, `.hero-wrap { … }`) and
`.stage-ledge { --glow-h: 70px; }`. Keep every non-geometry rule (fonts, card
sizes, hand-zone, orb positions) untouched.

- [ ] **Step 5: Verify geometry goes green everywhere.** Run: `npx playwright test geometry stage battle` (all projects). Expected: geometry 13/13 PASS; stage PASS; battle unchanged (mesh-corpse reds pre-existing). Then `npm test` — PASS. Manual smoke at `http://localhost:5174/?shape=phone-portrait` and default: fights look composed, hand drag-to-play still targets enemies.

- [ ] **Step 6: Commit.**

```bash
git add src/ui.js src/styles.css
git commit -m "feat: combat geometry driven by battlefield-layout.js (geometry.spec green)"
```

---

### Task 4: Editor foundation — load, sandbox, toolbar, overlays, read-only panel

**Files:**
- Create: `src/dev/bf-editor.js`
- Modify: `src/main.js`
- Test: `test/e2e/bfeditor.spec.js` (create)

**Interfaces:**
- Consumes: `window.spirebound` (`S`, `E`, `startCombatUI`, `refitCombat`); `bfRaw`, `_setBF`, `bfResolve`, `bfActor`, `bfSlots`, `bfEnemySize` from `../battlefield.js`; `stageEl`, `stageScale`, `stageW`, `stageH`, `stageInfo` from `../stage.js`; `ENEMIES`, `ASPECTS` from `../data.js`.
- Produces: `initBfEditor()`; DOM ids `#bf-toolbar`, `#bf-panel`, `#bf-overlay`; overlay boxes `.bf-box[data-bf]` with `data-bf ∈ hero | enemy-<i> | layer-<name> | ground`; module-level `state = { working, sel, dirty }` that Task 5 builds editing onto; `syncOverlays()` and `renderPanel()` helpers.

- [ ] **Step 1: Write the failing test.** Create `test/e2e/bfeditor.spec.js`:

```js
// Battlefield editor smoke (desktop only — it is a desktop dev tool).
import { test, expect } from '@playwright/test';

test.beforeEach(({ }, testInfo) => {
  test.skip(testInfo.project.name !== 'desktop', 'editor is desktop-only');
});

test('?bfedit=1 mounts the editor over a sandbox fight', async ({ page }) => {
  await page.goto('/?bfedit=1&mesh=0');
  await expect(page.locator('#bf-toolbar')).toBeVisible();
  await expect(page.locator('#bf-panel')).toBeVisible();
  // default scenario: hero + 2 enemies + 3 layers + ground line
  await expect(page.locator('.bf-box[data-bf="hero"]')).toBeVisible();
  await expect(page.locator('.bf-box[data-bf^="enemy-"]')).toHaveCount(2);
  await expect(page.locator('.bf-box[data-bf^="layer-"]')).toHaveCount(3);
  await expect(page.locator('.bf-box[data-bf="ground"]')).toBeVisible();
});

test('a normal session never loads the editor', async ({ page }) => {
  await page.goto('/?mesh=0');
  await page.waitForFunction(() => window.spirebound);
  await expect(page.locator('#bf-toolbar')).toHaveCount(0);
});
```

- [ ] **Step 2: Run to verify it fails.** Run: `npx playwright test bfeditor --project=desktop`. Expected: FAIL — `#bf-toolbar` never appears.

- [ ] **Step 3: Hook in `src/main.js`.** After `initUI();` add:

```js
if (import.meta.env.DEV && new URLSearchParams(location.search).has('bfedit')) {
  import('./dev/bf-editor.js').then((m) => m.initBfEditor());
}
```

(`import.meta.env.DEV` is statically false in `vite build`, so Rollup
dead-code-eliminates the whole chunk — verified in Step 6.)

- [ ] **Step 4: Create `src/dev/bf-editor.js`** — foundation version (selection + read-only panel; editing lands in Task 5):

```js
// Battlefield editor — dev-only (?bfedit=1 behind import.meta.env.DEV).
// Overlays + panel edit a working copy of BF via _setBF(); Save (Task 6)
// writes src/battlefield-layout.js through the vite dev endpoint.
import { ENEMIES, ASPECTS } from '../data.js';
import { bfRaw, _setBF, bfResolve, bfActor, bfSlots, bfEnemySize } from '../battlefield.js';
import { stageEl, stageW, stageH, stageScale, stageInfo } from '../stage.js';

const SHAPES = ['phone-portrait', 'phone-landscape', 'pad-portrait', 'pad-landscape', 'desktop-landscape'];
const LAYERS = ['backdrop', 'mid', 'ledge'];
const clone = (o) => JSON.parse(JSON.stringify(o));
const state = { working: null, sel: null, dirty: false, scenario: null };

const q = () => new URLSearchParams(location.search);
function scenarioFromUrl() {
  const p = q();
  return {
    act: Math.min(2, Math.max(0, Number(p.get('bfa') ?? 0))),
    aspect: Math.min(ASPECTS.length - 1, Math.max(0, Number(p.get('bfh') ?? 0))),
    ids: (p.get('bft') ?? 'duskfang,sporeling').split(',').filter((k) => ENEMIES[k]),
  };
}
function pushScenarioToUrl() {
  const p = q();
  p.set('bfedit', '1');
  p.set('bfa', state.scenario.act);
  p.set('bfh', state.scenario.aspect);
  p.set('bft', state.scenario.ids.join(','));
  history.replaceState(null, '', `?${p}`);
}

function startSandbox() {
  const sp = window.spirebound;
  sp.S.run = sp.E.newRun(20260706, { aspect: state.scenario.aspect });
  sp.S.run.act = state.scenario.act;
  sp.startCombatUI(state.scenario.ids, 'normal');
  // player turn never ends in the sandbox, so the scene sits still
  requestAnimationFrame(() => { syncOverlays(); renderPanel(); });
}

// ---------------------------------------------------------------- overlays
// Boxes are computed from the WORKING LAYOUT (pure stage px), never measured
// from the DOM — breathe/drift animations must not wobble the outlines.
function overlayRects() {
  const shape = stageInfo().shape;
  const L = bfResolve(shape);
  const rects = [];
  const hero = bfActor('heroes', ASPECTS[state.scenario.aspect].id);
  const hw = Math.round(L.hero.w * hero.scale), hh = Math.round(L.hero.h * hero.scale);
  rects.push({ id: 'hero', x: L.hero.x - hw / 2, w: hw, h: hh, bottom: L.groundY + hero.footY });
  const slots = bfSlots(L, state.scenario.ids.length);
  state.scenario.ids.forEach((key, i) => {
    const d = ENEMIES[key];
    const tier = d.boss ? 'boss' : d.elite ? 'elite' : 'normal';
    const size = bfEnemySize(L, key, tier, slots[i], stageW(), stageH());
    rects.push({ id: `enemy-${i}`, x: slots[i].x - size / 2, w: size, h: size, bottom: L.groundY + bfActor('enemies', key).footY });
  });
  LAYERS.forEach((name) => {
    const p = L.layers[name];
    rects.push({ id: `layer-${name}`, x: 0, w: stageW(), h: p.h, bottom: p.y, layer: true });
  });
  rects.push({ id: 'ground', x: 0, w: stageW(), h: 2, bottom: L.groundY, ground: true, label: `ground ${L.groundY}px` });
  return rects;
}

let overlayEl = null;
function syncOverlays() {
  if (!overlayEl) {
    overlayEl = document.createElement('div');
    overlayEl.id = 'bf-overlay';
    stageEl().appendChild(overlayEl);
  }
  overlayEl.innerHTML = '';
  for (const r of overlayRects()) {
    const b = document.createElement('div');
    b.className = `bf-box${r.layer ? ' bf-layer' : ''}${r.ground ? ' bf-ground' : ''}${state.sel === r.id ? ' bf-sel' : ''}`;
    b.dataset.bf = r.id;
    b.style.cssText = `left:${r.x}px;bottom:${r.bottom}px;width:${r.w}px;height:${r.h}px;`;
    if (r.label) b.innerHTML = `<span class="bf-tag">${r.label}</span>`;
    if (state.sel === r.id && !r.ground) b.innerHTML += '<span class="bf-handle"></span>';
    b.addEventListener('pointerdown', (e) => onBoxPointerDown(e, r.id)); // drag lands in Task 5
    overlayEl.appendChild(b);
  }
}
function onBoxPointerDown(e, id) { select(id); } // replaced with drag logic in Task 5
function select(id) { state.sel = id; syncOverlays(); renderPanel(); }

// ---------------------------------------------------------------- panel
function fieldRows() {
  // returns [{label, get()}] for the current selection, read-only for now
  const shape = stageInfo().shape;
  const L = bfResolve(shape);
  if (!state.sel) return [];
  if (state.sel === 'hero') {
    const id = ASPECTS[state.scenario.aspect].id;
    const a = bfActor('heroes', id);
    return [
      { label: 'x (layout)', get: () => L.hero.x },
      { label: 'w (layout)', get: () => L.hero.w },
      { label: 'h (layout)', get: () => L.hero.h },
      { label: `scale (shared:${id})`, get: () => a.scale },
      { label: `footY (shared:${id})`, get: () => a.footY },
    ];
  }
  if (state.sel === 'ground') {
    return [
      { label: 'groundY (layout)', get: () => L.groundY },
      { label: 'ledgeLip (layout)', get: () => L.ledgeLip },
    ];
  }
  if (state.sel.startsWith('enemy-')) {
    const i = Number(state.sel.slice(6));
    const key = state.scenario.ids[i];
    const slots = bfSlots(L, state.scenario.ids.length);
    const a = bfActor('enemies', key);
    return [
      { label: `slot ${i} x (layout)`, get: () => slots[i].x },
      { label: `slot ${i} s (layout)`, get: () => slots[i].s },
      { label: `scale (shared:${key})`, get: () => a.scale },
      { label: `footY (shared:${key})`, get: () => a.footY },
    ];
  }
  if (state.sel.startsWith('layer-')) {
    const name = state.sel.slice(6);
    const p = L.layers[name];
    return ['h', 'y', 'zoom', 'posX', 'opacity'].map((k) => ({ label: `${name}.${k} (layout)`, get: () => p[k] }));
  }
  return [];
}
let panelEl = null;
function renderPanel() {
  if (!panelEl) {
    panelEl = document.createElement('div');
    panelEl.id = 'bf-panel';
    document.body.appendChild(panelEl);
  }
  const shape = stageInfo().shape;
  panelEl.innerHTML = `<h3>${state.sel ?? 'select something'}</h3>
    <div class="bf-scope">shape: <b>${shape}</b>${shape === 'pad-landscape' ? ' (base)' : ''}</div>
    ${fieldRows().map((f, i) => `<label>${f.label}<input type="number" step="any" data-f="${i}" value="${f.get()}" disabled></label>`).join('')}`;
}

// ---------------------------------------------------------------- toolbar
function renderToolbar() {
  const bar = document.createElement('div');
  bar.id = 'bf-toolbar';
  const shapeBtns = SHAPES.map((s) => `<button data-shape="${s}"${stageInfo().shape === s ? ' class="on"' : ''}>${s.replace('-', ' ')}</button>`).join('');
  const typeSel = (i) => `<select data-slot="${i}">${Object.keys(ENEMIES).map((k) => `<option${state.scenario.ids[i] === k ? ' selected' : ''}>${k}</option>`).join('')}</select>`;
  bar.innerHTML = `
    <span class="bf-grp">${shapeBtns}</span>
    <span class="bf-grp">act <select id="bf-act">${[0, 1, 2].map((a) => `<option value="${a}"${state.scenario.act === a ? ' selected' : ''}>${a + 1}</option>`).join('')}</select></span>
    <span class="bf-grp">hero <select id="bf-hero">${ASPECTS.map((a, i) => `<option value="${i}"${state.scenario.aspect === i ? ' selected' : ''}>${a.id}</option>`).join('')}</select></span>
    <span class="bf-grp">foes <select id="bf-count">${[1, 2, 3].map((n) => `<option${state.scenario.ids.length === n ? ' selected' : ''}>${n}</option>`).join('')}</select>
      <span id="bf-types">${state.scenario.ids.map((_, i) => typeSel(i)).join('')}</span></span>
    <span class="bf-grp bf-right"><span id="bf-dirty"></span>
      <button id="bf-copy">Copy JS</button><button id="bf-revert">Revert</button><button id="bf-save">Save</button></span>`;
  document.body.appendChild(bar);
  bar.addEventListener('click', (e) => {
    const sh = e.target.dataset?.shape;
    if (sh) {
      const p = q(); p.set('shape', sh); pushScenarioToUrl();
      const p2 = new URLSearchParams(location.search); p2.set('shape', sh);
      location.search = `?${p2}`; // stage shape is picked at boot: honest reload
    }
  });
  bar.addEventListener('change', (e) => {
    const t = e.target;
    if (t.id === 'bf-act') state.scenario.act = Number(t.value);
    else if (t.id === 'bf-hero') state.scenario.aspect = Number(t.value);
    else if (t.id === 'bf-count') {
      const n = Number(t.value);
      const pool = Object.keys(ENEMIES);
      while (state.scenario.ids.length < n) state.scenario.ids.push(pool[0]);
      state.scenario.ids.length = n;
    } else if (t.dataset.slot != null) state.scenario.ids[Number(t.dataset.slot)] = t.value;
    else return;
    pushScenarioToUrl();
    bar.remove(); renderToolbar(); // re-render selects
    startSandbox();
  });
  // Save/Revert/Copy wired in Task 6
}

const CSS = `
#bf-toolbar { position: fixed; top: 0; left: 0; right: 0; z-index: 400; display: flex; gap: 14px; align-items: center; padding: 6px 10px; background: #0b0d18f2; color: #cdd3ea; font: 12px/1.4 monospace; border-bottom: 1px solid #333a55; }
#bf-toolbar .bf-grp { display: flex; gap: 4px; align-items: center; }
#bf-toolbar .bf-right { margin-left: auto; }
#bf-toolbar button, #bf-toolbar select { font: inherit; background: #1a2036; color: inherit; border: 1px solid #3a4266; border-radius: 4px; padding: 2px 7px; cursor: pointer; }
#bf-toolbar button.on { background: #34406e; }
#bf-panel { position: fixed; top: 44px; right: 0; z-index: 400; width: 250px; max-height: calc(100vh - 60px); overflow: auto; background: #0b0d18f2; color: #cdd3ea; font: 12px/1.5 monospace; border: 1px solid #333a55; border-right: 0; padding: 10px; }
#bf-panel label { display: flex; justify-content: space-between; gap: 6px; margin: 4px 0; }
#bf-panel input { width: 76px; font: inherit; background: #1a2036; color: inherit; border: 1px solid #3a4266; border-radius: 3px; }
#bf-overlay { position: absolute; inset: 0; z-index: 300; pointer-events: none; }
#bf-overlay .bf-box { position: absolute; pointer-events: auto; border: 1px dashed #6fe3ff88; cursor: move; }
#bf-overlay .bf-box.bf-sel { border-color: #ffd76f; box-shadow: 0 0 0 1px #ffd76f44; }
#bf-overlay .bf-layer { border-color: #b98bff55; }
#bf-overlay .bf-ground { border: 0; border-top: 2px solid #ff6f9e; cursor: ns-resize; }
#bf-overlay .bf-tag { position: absolute; left: 8px; top: -18px; color: #ff9ebd; font: 11px monospace; }
#bf-overlay .bf-handle { position: absolute; right: -6px; bottom: -6px; width: 12px; height: 12px; background: #ffd76f; border-radius: 2px; cursor: nwse-resize; }
`;

export function initBfEditor() {
  const style = document.createElement('style');
  style.textContent = CSS;
  document.head.appendChild(style);
  state.working = clone(bfRaw());
  _setBF(state.working);
  state.scenario = scenarioFromUrl();
  pushScenarioToUrl();
  renderToolbar();
  startSandbox();
}
```

- [ ] **Step 5: Run the smoke.** Run: `npx playwright test bfeditor --project=desktop`. Expected: both tests PASS. Also `npm test` — PASS (editor files are not imported by anything Node-side).

- [ ] **Step 6: Build-exclusion proof.** Run: `npm run build && grep -rl "bf-toolbar" dist/ ; echo "exit=$?"`. Expected: no file listed, `exit=1` (grep found nothing). Do NOT commit `dist/`; restore it with `git checkout -- dist/` if it shows as modified.

- [ ] **Step 7: Commit.**

```bash
git add src/dev/bf-editor.js src/main.js test/e2e/bfeditor.spec.js
git commit -m "feat: battlefield editor foundation (?bfedit=1 sandbox, overlays, toolbar, panel)"
```

---

### Task 5: Editing — drag, resize, nudge, live panel, scopes

**Files:**
- Modify: `src/dev/bf-editor.js`
- Test: `test/e2e/bfeditor.spec.js` (extend)

**Interfaces:**
- Consumes: Task 4's `state`, `syncOverlays`, `renderPanel`, `onBoxPointerDown`; `window.spirebound.refitCombat` from Task 3.
- Produces: `writeField(scope, path, value)` and `applyWorking()` — Task 6's Save serializes `state.working` exactly as these leave it.

**Scope rules (the heart of this task):**
- `shared` scope → `working.shared.<path>` (type scale/footY, tier sizes).
- `base` scope → `working.base.<path>`.
- `shape` scope → `working.shapes[currentShape].<path>` (create intermediate objects). **Formations copy-on-write:** before editing one slot field at `shape` scope, if `working.shapes[shape].slots?.[count]` is missing, deep-copy the currently *resolved* formation array there first (array overrides replace wholesale — a partial array would drop its siblings).
- Defaults: positional fields (`hero.x/w/h`, `slots`, `groundY`, `ledgeLip`, `layers.*`) → `base` when the current shape is `pad-landscape`, else `shape`; actor fields (`scale`, `footY`, `sizes.*`) → `shared`. The panel shows a scope `<select>` per row so the owner can override the default.

- [ ] **Step 1: Extend the smoke test.** Append to `test/e2e/bfeditor.spec.js`:

```js
test('dragging the hero moves its x by the drag distance (stage px)', async ({ page }) => {
  await page.goto('/?bfedit=1&mesh=0');
  const hero = page.locator('.bf-box[data-bf="hero"]');
  await hero.waitFor();
  const scale = await page.evaluate(() => window.__probe.stage().scale);
  const before = await page.evaluate(() => window.__bfEditor.resolved().hero.x);
  const box = await hero.boundingBox();
  await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
  await page.mouse.down();
  await page.mouse.move(box.x + box.width / 2 + 40 * scale, box.y + box.height / 2, { steps: 5 });
  await page.mouse.up();
  const after = await page.evaluate(() => window.__bfEditor.resolved().hero.x);
  expect(after - before).toBe(40);
});

test('panel numeric edit applies live to the working layout', async ({ page }) => {
  await page.goto('/?bfedit=1&mesh=0');
  await page.locator('.bf-box[data-bf="ground"]').click();
  const input = page.locator('#bf-panel input[data-path="groundY"]');
  await input.fill('250');
  await input.press('Enter');
  const g = await page.evaluate(() => window.__bfEditor.resolved().groundY);
  expect(g).toBe(250);
  await expect(page.locator('#bf-dirty')).toHaveText(/●/);
});
```

- [ ] **Step 2: Run to verify the new tests fail.** Run: `npx playwright test bfeditor --project=desktop`. Expected: the two new tests FAIL (`window.__bfEditor` undefined / input disabled).

- [ ] **Step 3: Implement editing in `src/dev/bf-editor.js`.**

3a. Path plumbing + write + apply (add below `clone`):

```js
const getPath = (obj, path) => path.reduce((o, k) => o?.[k], obj);
function setPath(obj, path, value) {
  let o = obj;
  for (const k of path.slice(0, -1)) o = o[k] ??= {};
  o[path.at(-1)] = value;
}
function delPath(obj, path) {
  const parent = getPath(obj, path.slice(0, -1));
  if (parent) delete parent[path.at(-1)];
}
function applyWorking() {
  _setBF(state.working);
  window.spirebound.refitCombat();
  state.dirty = true;
  const d = document.getElementById('bf-dirty');
  if (d) d.textContent = '● unsaved';
  syncOverlays();
  renderPanel();
}
function writeField(scope, path, value) {
  const shape = stageInfo().shape;
  if (scope === 'shared') setPath(state.working.shared, path, value);
  else if (scope === 'base') setPath(state.working.base, path, value);
  else {
    // shape scope; formations copy-on-write (arrays replace wholesale on merge)
    if (path[0] === 'slots' && getPath(state.working.shapes?.[shape] ?? {}, ['slots', path[1]]) === undefined) {
      setPath(state.working, ['shapes', shape, 'slots', path[1]], clone(bfResolve(shape).slots[path[1]] ?? bfSlots(bfResolve(shape), Number(path[1]))));
    }
    setPath(state.working, ['shapes', shape, ...path], value);
  }
  applyWorking();
}
const defaultScope = (path) => (path[0] === 'sizes' || path[0] === 'heroes' || path[0] === 'enemies') ? 'shared'
  : (stageInfo().shape === 'pad-landscape' ? 'base' : 'shape');
```

3b. Replace `fieldRows()` — every row carries `{label, path, scope, value, overridden}` (`path` relative to its scope root; `overridden` = the current shape has an override for a positional path):

```js
function fieldRows() {
  if (!state.sel) return [];
  const shape = stageInfo().shape;
  const L = bfResolve(shape);
  const over = state.working.shapes?.[shape] ?? {};
  const pos = (label, path, value) => ({ label, path, value, scope: defaultScope(path), overridden: getPath(over, path) !== undefined });
  const sh = (label, path, value) => ({ label, path, value, scope: 'shared', overridden: false });
  if (state.sel === 'ground') return [pos('groundY', ['groundY'], L.groundY), pos('ledgeLip', ['ledgeLip'], L.ledgeLip)];
  if (state.sel === 'hero') {
    const id = ASPECTS[state.scenario.aspect].id;
    const a = bfActor('heroes', id);
    return [
      pos('x', ['hero', 'x'], L.hero.x),
      pos('w', ['hero', 'w'], L.hero.w),
      pos('h', ['hero', 'h'], L.hero.h),
      sh(`scale · ${id}`, ['heroes', id, 'scale'], a.scale),
      sh(`footY · ${id}`, ['heroes', id, 'footY'], a.footY),
    ];
  }
  if (state.sel.startsWith('enemy-')) {
    const i = Number(state.sel.slice(6));
    const key = state.scenario.ids[i];
    const d = ENEMIES[key];
    const tier = d.boss ? 'boss' : d.elite ? 'elite' : 'normal';
    const count = String(state.scenario.ids.length);
    const slot = bfSlots(L, state.scenario.ids.length)[i];
    const a = bfActor('enemies', key);
    return [
      pos(`slot x`, ['slots', count, i, 'x'], slot.x),
      pos(`slot s`, ['slots', count, i, 's'], slot.s ?? 1),
      sh(`scale · ${key}`, ['enemies', key, 'scale'], a.scale),
      sh(`footY · ${key}`, ['enemies', key, 'footY'], a.footY),
      sh(`size · tier ${tier}`, ['sizes', tier], L.shared.sizes[tier]),
    ];
  }
  if (state.sel.startsWith('layer-')) {
    const name = state.sel.slice(6);
    return ['h', 'y', 'zoom', 'posX', 'opacity'].map((k) => pos(`${name}.${k}`, ['layers', name, k], L.layers[name][k]));
  }
  return [];
}
```

(the `sizes · tier` row edits `shared.sizes.<tier>` — the one place tier base
sizes are tunable; `defaultScope` already routes `['sizes', …]` to `shared`.)

3c. Rewrite `renderPanel()` — enabled inputs, a scope select per row, and a clear-override button on overridden rows:

```js
function renderPanel() {
  if (!panelEl) { panelEl = document.createElement('div'); panelEl.id = 'bf-panel'; document.body.appendChild(panelEl); }
  const shape = stageInfo().shape;
  const rows = fieldRows();
  panelEl.innerHTML = `<h3>${state.sel ?? 'select something'}</h3>
    <div class="bf-scope">shape: <b>${shape}</b>${shape === 'pad-landscape' ? ' (base)' : ''}</div>
    ${rows.map((f, i) => `<label>${f.label}
      <span>
        <select data-scope="${i}"${f.scope === 'shared' ? ' disabled' : ''}>
          ${['base', 'shape', 'shared'].map((s) => `<option${s === f.scope ? ' selected' : ''}>${s}</option>`).join('')}
        </select>
        <input type="number" step="any" data-row="${i}" data-path="${f.path.at(-1)}" value="${f.value}">
        ${f.overridden ? `<button data-clear="${i}" title="clear this shape's override">×</button>` : ''}
      </span></label>`).join('')}`;
  panelEl.onchange = (e) => {
    const t = e.target;
    if (t.dataset.row != null) {
      const f = fieldRows()[Number(t.dataset.row)];
      const scopeSel = panelEl.querySelector(`select[data-scope="${t.dataset.row}"]`);
      const v = Number(t.value);
      if (Number.isFinite(v)) writeField(scopeSel?.value ?? f.scope, f.path, v);
    }
  };
  panelEl.onclick = (e) => {
    const c = e.target.dataset?.clear;
    if (c != null) {
      const f = fieldRows()[Number(c)];
      delPath(state.working, ['shapes', stageInfo().shape, ...f.path]);
      applyWorking();
    }
  };
}
```

3d. Replace `onBoxPointerDown` with real dragging (move + corner resize + ground drag):

```js
function onBoxPointerDown(e, id) {
  select(id);
  e.preventDefault();
  const onHandle = e.target.classList.contains('bf-handle');
  const shape = stageInfo().shape;
  // snapshot EVERYTHING at drag start; every move event writes L0 + total
  // delta, so repeated events never compound
  const L0 = clone(bfResolve(shape));
  const heroId = ASPECTS[state.scenario.aspect].id;
  const heroFoot0 = bfActor('heroes', heroId).footY;
  const enemyFoot0 = state.scenario.ids.map((k) => bfActor('enemies', k).footY);
  const start = { x: e.clientX, y: e.clientY };
  const sc = stageScale();
  const count = state.scenario.ids.length;
  const slots0 = L0.slots[count] ?? bfSlots(L0, count);
  const move = (ev) => {
    const dx = Math.round((ev.clientX - start.x) / sc);
    const dy = Math.round((ev.clientY - start.y) / sc); // screen-down = stage-down
    const posScope = defaultScope(['hero']);
    if (id === 'ground') writeField(posScope, ['groundY'], Math.max(0, L0.groundY - dy));
    else if (id === 'hero') {
      if (onHandle) {
        writeField(posScope, ['hero', 'w'], Math.max(24, L0.hero.w + dx));
        writeField(posScope, ['hero', 'h'], Math.max(24, L0.hero.h + dy));
      } else if (Math.abs(dx) >= Math.abs(dy)) writeField(posScope, ['hero', 'x'], L0.hero.x + dx);
      else writeField('shared', ['heroes', heroId, 'footY'], heroFoot0 - dy);
    } else if (id.startsWith('enemy-')) {
      const i = Number(id.slice(6));
      const key = state.scenario.ids[i];
      if (onHandle) writeField(posScope, ['slots', String(count), i, 's'], Math.max(0.1, +((slots0[i].s ?? 1) + dx / 200).toFixed(2)));
      else if (Math.abs(dx) >= Math.abs(dy)) writeField(posScope, ['slots', String(count), i, 'x'], slots0[i].x + dx);
      else writeField('shared', ['enemies', key, 'footY'], enemyFoot0[i] - dy);
    } else if (id.startsWith('layer-')) {
      const name = id.slice(6);
      if (onHandle) writeField(posScope, ['layers', name, 'h'], Math.max(10, L0.layers[name].h - dy));
      else writeField(posScope, ['layers', name, 'y'], L0.layers[name].y - dy);
    }
  };
  const up = () => { removeEventListener('pointermove', move); removeEventListener('pointerup', up); };
  addEventListener('pointermove', move);
  addEventListener('pointerup', up);
}
```

3e. Arrow-key nudging (add inside `initBfEditor()`):

```js
  addEventListener('keydown', (e) => {
    if (!state.sel || /INPUT|SELECT/.test(document.activeElement?.tagName ?? '')) return;
    const step = e.shiftKey ? 10 : 1;
    const dx = e.key === 'ArrowRight' ? step : e.key === 'ArrowLeft' ? -step : 0;
    const dy = e.key === 'ArrowUp' ? step : e.key === 'ArrowDown' ? -step : 0;
    if (!dx && !dy) { if (e.key === 'Escape') select(null); return; }
    e.preventDefault();
    const L = bfResolve(stageInfo().shape);
    const scope = defaultScope(['hero']);
    const count = state.scenario.ids.length;
    if (state.sel === 'ground' && dy) writeField(scope, ['groundY'], L.groundY + dy);
    else if (state.sel === 'hero' && dx) writeField(scope, ['hero', 'x'], L.hero.x + dx);
    else if (state.sel === 'hero' && dy) writeField('shared', ['heroes', ASPECTS[state.scenario.aspect].id, 'footY'], bfActor('heroes', ASPECTS[state.scenario.aspect].id).footY + dy);
    else if (state.sel.startsWith('enemy-')) {
      const i = Number(state.sel.slice(6));
      if (dx) writeField(scope, ['slots', String(count), i, 'x'], bfSlots(L, count)[i].x + dx);
      else writeField('shared', ['enemies', state.scenario.ids[i], 'footY'], bfActor('enemies', state.scenario.ids[i]).footY + dy);
    } else if (state.sel.startsWith('layer-')) {
      const name = state.sel.slice(6);
      if (dy) writeField(scope, ['layers', name, 'y'], L.layers[name].y + dy);
    }
  });
```

3f. Test hook (add at the end of `initBfEditor()`):

```js
  window.__bfEditor = { resolved: () => bfResolve(stageInfo().shape), working: () => state.working };
```

- [ ] **Step 4: Run the suite.** Run: `npx playwright test bfeditor --project=desktop`. Expected: all 4 tests PASS. Manual check on `http://localhost:5174/?bfedit=1`: drag hero and an enemy, resize with the corner handle, drag a layer and the ground line, nudge with arrows, edit panel numbers, switch to `?shape=phone-portrait` via the toolbar and confirm edits there land as shape overrides (× button appears).

- [ ] **Step 5: Commit.**

```bash
git add src/dev/bf-editor.js test/e2e/bfeditor.spec.js
git commit -m "feat: battlefield editor editing — drag/resize/nudge, live panel, scope writes"
```

---

### Task 6: Persistence — serializer, vite endpoint, Save/Revert/Copy

**Files:**
- Create: `src/dev/bf-serialize.js`
- Modify: `vite.config.js`
- Modify: `src/dev/bf-editor.js` (wire the three buttons)
- Test: `test/test_engine.js` (round-trip gate), `test/e2e/bfeditor.spec.js` (save payload)

**Interfaces:**
- Consumes: `state.working` from Task 5.
- Produces: `serializeBF(bf) → string` (the complete new content of `src/battlefield-layout.js`); `validateBF(bf, ids?) → string[]` (empty = valid; `ids = { enemies: string[], heroes: string[] }` optional); `POST /__bf-save` accepting the raw `BF` object as JSON, responding `{ ok: true }` or 400 `{ ok: false, problems }`.

- [ ] **Step 1: Write the failing round-trip test.** In `test/test_engine.js`, extend the battlefield block (after the existing asserts, still inside the `{ … }`); add the import next to the battlefield import:

```js
import { serializeBF, validateBF } from '../src/dev/bf-serialize.js';
```

```js
  // serializer: valid, deterministic, and a true round-trip
  assert.deepEqual(validateBF(bfRaw(), { enemies: Object.keys(ENEMIES), heroes: ASPECTS.map((a) => a.id) }), [], 'bf: file validates');
  const src1 = serializeBF(bfRaw());
  assert.ok(src1.startsWith('// Battlefield layout'), 'bf: serialized header');
  const mod = await import(`data:text/javascript,${encodeURIComponent(src1)}`);
  assert.equal(serializeBF(mod.BF), src1, 'bf: serialize(import(serialize(BF))) is byte-identical');
  assert.ok(validateBF({ base: {} }).length > 0, 'bf: broken layout rejected');
```

- [ ] **Step 2: Run to verify it fails.** Run: `npm test`. Expected: FAIL — `Cannot find module '../src/dev/bf-serialize.js'`.

- [ ] **Step 3: Create `src/dev/bf-serialize.js`:**

```js
// Deterministic serializer + validator for src/battlefield-layout.js.
// Shared by the editor (browser) and the vite save plugin (node): imports nothing.
const SHAPES = ['phone-portrait', 'phone-landscape', 'pad-portrait', 'pad-landscape', 'desktop-landscape'];
const LAYER_KEYS = ['h', 'y', 'zoom', 'posX', 'opacity'];

const HEADER = `// Battlefield layout — owned by the battlefield editor (?bfedit=1 on the dev
// server), hand edits welcome: keep the shape, keep numbers finite.
// All values are STAGE px for their shape (see src/stage.js). Conventions:
//   x       — actor's horizontal CENTER
//   footY   — feet offset from the ground line (art whose feet aren't at the
//             sprite's bottom edge), + is up
//   scale   — multiplies the tier size (sizes.normal/elite/boss)
//   slot.s  — per-formation size multiplier (keeps wide lineups on-ledge)
//   layers  — h: plate height; y: plate bottom offset from stage bottom (+up);
//             zoom: image scale inside the plate; posX: horizontal focus %
// Imports nothing; imported by src/battlefield.js only.
`;

const num = (v) => {
  const r = Math.round(v * 1000) / 1000;
  return Object.is(r, -0) ? '0' : String(r);
};
// one actor/slot/layer per line, keys in insertion-stable fixed order
function inline(obj, keyOrder = null) {
  const keys = keyOrder ? keyOrder.filter((k) => obj[k] !== undefined) : Object.keys(obj);
  const rest = Object.keys(obj).filter((k) => !keys.includes(k)); // preserves e.g. parts:{}
  return `{ ${[...keys, ...rest].map((k) => `${JSON.stringify(k).match(/^"[a-zA-Z_$][\w$]*"$/) ? k : JSON.stringify(k)}: ${typeof obj[k] === 'number' ? num(obj[k]) : JSON.stringify(obj[k])}`).join(', ')} }`;
}
function actorsBlock(map, indent) {
  return Object.keys(map).sort().map((id) => `${indent}${/^[a-zA-Z_$][\w$]*$/.test(id) ? id : JSON.stringify(id)}: ${inline(map[id], ['scale', 'footY'])},`).join('\n');
}
function layoutBlock(layout, indent) {
  const out = [];
  if (layout.groundY !== undefined) out.push(`${indent}groundY: ${num(layout.groundY)},`);
  if (layout.ledgeLip !== undefined) out.push(`${indent}ledgeLip: ${num(layout.ledgeLip)},`);
  if (layout.hero) out.push(`${indent}hero: ${inline(layout.hero, ['x', 'w', 'h'])},`);
  if (layout.slots) {
    out.push(`${indent}slots: {`);
    for (const n of Object.keys(layout.slots).sort((a, b) => a - b)) {
      out.push(`${indent}  ${n}: [${layout.slots[n].map((s) => inline(s, ['x', 's'])).join(', ')}],`);
    }
    out.push(`${indent}},`);
  }
  if (layout.layers) {
    out.push(`${indent}layers: {`);
    for (const l of ['backdrop', 'mid', 'ledge']) {
      if (layout.layers[l]) out.push(`${indent}  ${l}: ${inline(layout.layers[l], LAYER_KEYS)},`);
    }
    out.push(`${indent}},`);
  }
  return out.join('\n');
}

export function serializeBF(bf) {
  const out = [HEADER, 'export const BF = {', '  shared: {'];
  out.push(`    sizes: ${inline(bf.shared.sizes, ['normal', 'elite', 'boss'])},`);
  out.push('    heroes: {', actorsBlock(bf.shared.heroes, '      '), '    },');
  out.push('    enemies: {', actorsBlock(bf.shared.enemies, '      '), '    },');
  out.push('  },', '  base: {', layoutBlock(bf.base, '    '), '  },', '  shapes: {');
  for (const sh of SHAPES) {
    const o = bf.shapes?.[sh];
    if (o && Object.keys(o).length) out.push(`    '${sh}': {`, layoutBlock(o, '      '), '    },');
  }
  out.push('  },', '};', '');
  return out.join('\n');
}

export function validateBF(bf, ids = null) {
  const problems = [];
  const finite = (v, name) => { if (!Number.isFinite(v)) problems.push(`${name} is not a finite number (${v})`); };
  if (!bf || typeof bf !== 'object') return ['payload is not an object'];
  if (!bf.shared?.sizes || !bf.base) return ['missing shared.sizes or base'];
  for (const t of ['normal', 'elite', 'boss']) finite(bf.shared.sizes[t], `shared.sizes.${t}`);
  for (const kind of ['heroes', 'enemies']) {
    for (const [id, a] of Object.entries(bf.shared[kind] ?? {})) {
      finite(a.scale, `shared.${kind}.${id}.scale`);
      finite(a.footY, `shared.${kind}.${id}.footY`);
      if (ids && !ids[kind].includes(id)) problems.push(`shared.${kind}.${id}: unknown id`);
    }
  }
  const checkLayout = (layout, name, isBase) => {
    if (isBase) {
      finite(layout.groundY, `${name}.groundY`);
      finite(layout.ledgeLip, `${name}.ledgeLip`);
      for (const n of [1, 2, 3]) if (!Array.isArray(layout.slots?.[n])) problems.push(`${name}.slots.${n} missing`);
    }
    if (layout.groundY !== undefined) finite(layout.groundY, `${name}.groundY`);
    if (layout.hero) for (const k of Object.keys(layout.hero)) finite(layout.hero[k], `${name}.hero.${k}`);
    for (const [n, arr] of Object.entries(layout.slots ?? {})) {
      if (!Array.isArray(arr) || arr.length !== Number(n)) problems.push(`${name}.slots.${n}: needs exactly ${n} entries`);
      else arr.forEach((s, i) => { finite(s.x, `${name}.slots.${n}[${i}].x`); finite(s.s, `${name}.slots.${n}[${i}].s`); });
    }
    for (const [l, p] of Object.entries(layout.layers ?? {})) {
      if (!['backdrop', 'mid', 'ledge'].includes(l)) problems.push(`${name}.layers.${l}: unknown layer`);
      else for (const k of LAYER_KEYS) finite(p[k], `${name}.layers.${l}.${k}`);
    }
  };
  checkLayout(bf.base, 'base', true);
  for (const [sh, o] of Object.entries(bf.shapes ?? {})) {
    if (!SHAPES.includes(sh)) problems.push(`shapes.${sh}: unknown shape`);
    else checkLayout(o, `shapes.${sh}`, false);
  }
  return problems;
}
```

- [ ] **Step 4: Align the seed file with the serializer.** Run this once and eyeball the diff (comment header identical, data identical, formatting canonical):

```bash
node -e "import('./src/dev/bf-serialize.js').then(async ({ serializeBF }) => { const { BF } = await import('./src/battlefield-layout.js'); const { writeFileSync } = await import('node:fs'); writeFileSync('src/battlefield-layout.js', serializeBF(BF)); console.log('rewritten'); })"
git diff src/battlefield-layout.js
```

Expected diff: whitespace/ordering only, no value changes. Run `npm test` — the round-trip assert now sees a canonical file. Expected: PASS.

- [ ] **Step 5: Vite plugin.** Replace `vite.config.js` content with:

```js
import { defineConfig } from "vite";
import { writeFileSync, renameSync } from "node:fs";

// dev-only battlefield editor save endpoint (?bfedit=1 → POST /__bf-save)
function bfSavePlugin() {
  return {
    name: "bf-save",
    apply: "serve",
    configureServer(server) {
      server.middlewares.use("/__bf-save", (req, res) => {
        if (req.method !== "POST") { res.statusCode = 405; return res.end(); }
        let body = "";
        req.on("data", (c) => { body += c; });
        req.on("end", async () => {
          res.setHeader("content-type", "application/json");
          try {
            const [{ serializeBF, validateBF }, { ENEMIES, ASPECTS }] = await Promise.all([
              import("./src/dev/bf-serialize.js"),
              import("./src/data.js"),
            ]);
            const bf = JSON.parse(body);
            const problems = validateBF(bf, { enemies: Object.keys(ENEMIES), heroes: ASPECTS.map((a) => a.id) });
            if (problems.length) { res.statusCode = 400; return res.end(JSON.stringify({ ok: false, problems })); }
            writeFileSync("src/battlefield-layout.js.tmp", serializeBF(bf)); // never half-written
            renameSync("src/battlefield-layout.js.tmp", "src/battlefield-layout.js");
            res.end(JSON.stringify({ ok: true }));
          } catch (e) {
            res.statusCode = 400;
            res.end(JSON.stringify({ ok: false, problems: [String(e?.message ?? e)] }));
          }
        });
      });
    },
  };
}

export default defineConfig({
  plugins: [bfSavePlugin()],
  server: {
    host: "0.0.0.0",
    port: 5174,
    allowedHosts: ["macm4.tail55e87e.ts.net"],
  },
});
```

- [ ] **Step 6: Wire the buttons in `src/dev/bf-editor.js`.** Add the import
  `import { serializeBF, validateBF } from './bf-serialize.js';` and, at the
  end of `renderToolbar()` (replacing the "wired in Task 6" comment):

```js
  bar.querySelector('#bf-save').onclick = async () => {
    const problems = validateBF(state.working);
    if (problems.length) return alert(`invalid layout:\n${problems.join('\n')}`);
    const r = await fetch('/__bf-save', { method: 'POST', body: JSON.stringify(state.working) });
    const j = await r.json().catch(() => ({ ok: false, problems: [`HTTP ${r.status}`] }));
    if (!j.ok) return alert(`save failed:\n${(j.problems ?? []).join('\n')}`);
    state.dirty = false;
    document.getElementById('bf-dirty').textContent = 'saved ✓';
    // vite HMR full-reloads on the file write; scenario survives in the URL
  };
  bar.querySelector('#bf-revert').onclick = () => location.reload();
  bar.querySelector('#bf-copy').onclick = () => navigator.clipboard.writeText(serializeBF(state.working));
```

- [ ] **Step 7: Save e2e.** Append to `test/e2e/bfeditor.spec.js`:

```js
test('Save POSTs the edited layout to /__bf-save', async ({ page }) => {
  let payload = null;
  await page.route('**/__bf-save', async (route) => {
    payload = JSON.parse(route.request().postData());
    await route.fulfill({ json: { ok: true } });
  });
  await page.goto('/?bfedit=1&mesh=0');
  await page.locator('.bf-box[data-bf="ground"]').click();
  const input = page.locator('#bf-panel input[data-path="groundY"]');
  await input.fill('241');
  await input.press('Enter');
  await page.locator('#bf-save').click();
  await expect(page.locator('#bf-dirty')).toHaveText(/saved/);
  // the desktop project runs the desktop-landscape shape (not the base
  // pad-landscape), so the edit defaults to that shape's override:
  expect(payload.shapes['desktop-landscape'].groundY).toBe(241);
  expect(payload.base.groundY).toBe(232);
});
```

- [ ] **Step 8: Run everything.** Run: `npm test` — PASS (round-trip green). Run: `npx playwright test bfeditor --project=desktop` — all 5 PASS. Manual: real Save on the dev server, confirm `git diff src/battlefield-layout.js` shows exactly your edit, page reloads, scene keeps the edit, then `git checkout -- src/battlefield-layout.js` to discard the manual test edit.

- [ ] **Step 9: Commit.**

```bash
git add src/dev/bf-serialize.js src/dev/bf-editor.js src/battlefield-layout.js vite.config.js test/test_engine.js test/e2e/bfeditor.spec.js
git commit -m "feat: battlefield editor persistence — serializer, vite save endpoint, save/revert/copy"
```

---

### Task 7: Bookkeeping + full gates

**Files:**
- Modify: `docs/superpowers/plans/2026-07-06-visualisation-hardening-polish.md`
- Modify: `AGENTS.md`

- [ ] **Step 1: Verify the hardening-plan bookkeeping (already applied
2026-07-06).** `docs/superpowers/plans/2026-07-06-visualisation-hardening-polish.md`
already carries a "Parallel-execution note" section after its "Already
landed" table, a **SUPERSEDED** banner under its Task 1 heading, and updated
prerequisites on its Task 3 (baselines). Confirm all three are present and
that the class/var names they cite (`.cplate`, JS-set `--ground-y` /
`--ledge-lip`) match what Tasks 2–3 of THIS plan actually shipped; fix any
drift. Leave every other hardening task untouched.

- [ ] **Step 2: AGENTS.md note.** In `AGENTS.md` under "Conventions that will
bite you if unknown", add one bullet (and remember `CLAUDE.md` is a symlink —
one edit covers both):

```markdown
- **Combat-stage geometry lives in `src/battlefield-layout.js`**, not CSS — hero/enemy positions & sizes, formations, the 3 background plates and the ground line, per stage shape. Edit it by hand or with the dev-only editor at `http://localhost:5174/?bfedit=1` (drag/resize, per-shape overrides, Save writes the file). `src/battlefield.js` is the resolver; both must stay Node-importable and import nothing.
```

- [ ] **Step 3: Full matrix.** Run, in order:

```bash
npm test
npx playwright test stage geometry battle bfeditor
npm run build
```

Expected: engine + schema + round-trip green; stage/geometry/bfeditor fully
green across projects; battle green except the two pre-existing mesh-corpse
reds (hardening plan Task 2's territory — if that task already landed, battle
is fully green); build succeeds. Restore `dist/` if modified
(`git checkout -- dist/`) — do not commit it.

- [ ] **Step 4: Manual smoke.** One fight on desktop and one at
`?shape=phone-portrait`: combatants on the ledge, plates readable, drag a
card onto an enemy. Then `?bfedit=1`: move an enemy, Save, reload without
`bfedit` — the change persists in the real game.

- [ ] **Step 5: Commit.**

```bash
git add docs/superpowers/plans/2026-07-06-visualisation-hardening-polish.md AGENTS.md
git commit -m "docs: battlefield layout supersedes hardening ground-line tasks; agent notes"
```
