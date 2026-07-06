# Spirebound — Battlefield layout file + in-game editor (design)

**Date:** 2026-07-06
**Goal:** Replace the hand-tuned combat-stage CSS magic numbers with one
hand-editable, data-driven layout file (`src/battlefield.js`) covering hero,
enemies, the three background plates and the ground line — per viewport shape,
with shared values where sharing makes sense — plus a dev-only in-game editor
(`?bfedit=1`) with drag-to-move, drag-to-resize, a numeric parameter panel,
and a Vite dev endpoint that writes the file back to disk.
**Prerequisite (landed):** the fixed virtual stage (`src/stage.js`, spec
`2026-07-06-visualisation-hardening-polish-design.md` §1b). Five canonical
shapes, uniform scale, everything in deterministic stage px — the reason a
px-exact layout file is now possible.
**Supersedes:** Tasks 1, 4 and 5 of the hardening plan
(`docs/superpowers/plans/2026-07-06-visualisation-hardening-polish.md`) —
ground-line unification and the combatant chrome-plate refactor happen here,
driven by the layout file instead of CSS tokens alone. The rest of that plan
is untouched; `geometry.spec` remains the acceptance gate.

## Decisions record (owner-approved)

| Question | Decision |
|---|---|
| Editor scope | Battlefield only: hero, monsters (position/size/formation), 3 background layers, ground line. Combat chrome (energy orb, lantern, end turn, piles, hand) untouched |
| Enemy positioning model | Formation slots per enemy count (1/2/3) + shared per-type modifiers (scale, footY) |
| Viewport sharing | Global `shared` values + one `base` layout (pad-landscape) + per-shape overrides deep-merged over base |
| Save workflow | Vite dev plugin, `POST /__bf-save` writes `src/battlefield.js`; HMR reloads. Copy-JS button as fallback |
| Relation to hardening plan | Layout file becomes the single source of truth for ground line / positions; plan Tasks 1/4/5 superseded, `geometry.spec` unchanged as validator |
| Future-proofing | Extensible schema: open id-keyed maps for heroes/enemies; reserved optional `parts: {}` per actor for the parked rigging spike. No attachment implementation this pass |
| Architecture | Approach A: runtime layout module + dev-only in-game editor overlay + Vite write-back endpoint |

## Invariants (violating any fails review)

- `src/battlefield.js` imports nothing (same tier as `data.js`) and is
  Node-importable — `npm test` gains a schema sanity check.
- `engine.js` / `vigil.js` never touch the layout file; layout is pure
  presentation. Engine tests unaffected.
- The editor module (`src/dev/bf-editor.js`) loads only behind `?bfedit=1`
  via dynamic import and is excluded from the production bundle; the save
  endpoint exists only on the vite dev server. `npm run build` output
  contains neither.
- First commit's layout values are transcribed from today's CSS: rendering
  before/after the refactor is visually identical until the owner edits.
- Feet-on-ground contract: hero art bottom and every living enemy art bottom
  within ±2px of the ground line at every shape (`geometry.spec`, unchanged).
- `stage.spec` geometry bit-equality across window resizes still holds —
  layout depends only on the stage shape, never on window px.
- The serializer is deterministic (fixed key order, fixed header comment):
  saving twice with no edits produces a byte-identical file; diffs stay
  reviewable and the file stays pleasant to hand-edit.
- All numbers are stage px for their shape. Client px never enters the file
  (editor converts pointer input at the boundary via `toStage()`).

## 1. The layout file — `src/battlefield.js`

One hand-editable JS module with a header comment ("owned by the battlefield
editor — hand edits welcome, keep the shape"). Structure:

```js
export const BF = {
  // ---- shared across ALL viewport shapes ----
  shared: {
    sizes: { normal: 185, elite: 230, boss: 280 },   // base art box, px
    enemies: {                                        // per enemy TYPE, all ids in ENEMIES
      sporeling:  { scale: 0.9,  footY: 0 },          // scale multiplies tier size;
      alphaFang:  { scale: 1.1,  footY: -4 },         // footY: feet offset when art's feet
      // …                                            // aren't at the sprite's bottom edge
    },
    heroes: {                                         // per aspect id (duskblade, ashwarden, …)
      duskblade: { scale: 1, footY: 0 },
    },
  },
  // ---- base layout (= pad-landscape, 1180×820) ----
  base: {
    groundY: 232,                    // ground line, px from stage bottom
    ledgeLip: 14,                    // painted lip rising behind the feet, px
    hero: { x: 190, w: 190, h: 285 },// x = horizontal CENTER; feet sit on ground line
    slots: {                         // formations keyed by enemy count
      1: [{ x: 880, s: 1 }],
      2: [{ x: 800, s: 1 }, { x: 1030, s: 0.95 }],
      3: [{ x: 730, s: 0.95 }, { x: 930, s: 1 }, { x: 1110, s: 0.9 }],
    },
    layers: {                        // the three painted plates (per-act IMAGES, shared geometry)
      backdrop: { h: 640, y: 0, zoom: 1, posX: 50, opacity: 0.85 },
      mid:      { h: 476, y: 0, zoom: 1, posX: 50, opacity: 0.95 },
      ledge:    { h: 246, y: 0, zoom: 1, posX: 50, opacity: 1 },
    },
  },
  // ---- per-shape overrides, deep-merged over base ----
  shapes: {
    'phone-portrait':    { groundY: 132, hero: { x: 96 }, slots: { /* … */ } },
    'phone-landscape':   { /* … */ },
    'pad-portrait':      { /* … */ },
    'desktop-landscape': { hero: { x: 260 } },  // shares 820 height with base; mostly x shifts
  },
};
export function bfResolve(shape) { /* deep-merge base ← shapes[shape]; fill defaults */ }
```

Conventions and semantics:

- **Stage px everywhere**, exact per shape (no vw/vh).
- **Vertical rule:** combatants always stand feet-on-ground:
  `bottom = groundY + type.footY` (px from stage bottom). There is no
  per-slot y — one groundY moves everyone, and the ±2px geometry contract is
  true by construction. `footY` exists only to correct art whose feet aren't
  at the sprite's bottom edge.
- **Enemy art size** = `sizes[tier] × shared.enemies[type].scale × slot.s`,
  replacing the `enemyArtSize()` formula in `ui.js`. One safety clamp
  survives (art never exceeds stage bounds) as a typo guard. Slot `s` keeps
  wide lineups on-ledge on phones.
- **Layers:** `h` = plate height px; `y` = vertical offset px (±, move
  up/down); `zoom` = scale of the image inside its box (enlarge/shrink);
  `posX` = horizontal focus % (choose which part of the painting shows —
  zoom + posX together give stretch/narrow control); `opacity`. The `sl-drift`
  breathing animation and per-act image selection (`assetUrl('stage',
  'actN-layer')`) are unchanged. If per-act *geometry* is ever wanted, an
  optional `layersByAct` override slots in without schema breakage.
- **Extensibility:** `shared.heroes` / `shared.enemies` are open maps keyed
  by internal id; a new hero or enemy is one new line (the editor lists
  whatever exists in `ASPECTS` / `ENEMIES`). Every actor entry may carry an
  optional `parts: {}` object — reserved for the parked cutout-rigging
  spike; `bfResolve` ignores it today and the serializer preserves it.
- **Fallbacks (hand-edit resilience):** missing shape ⇒ base; missing type
  entry ⇒ `{ scale: 1, footY: 0 }`; missing slot formation for an unusual
  count ⇒ even interpolation between the outermost defined slots. The game
  never crashes on an incomplete file.

## 2. Runtime wiring (`ui.js` + `styles.css`)

`renderCombat()` (and the existing debounced resize refit) calls
`bfResolve(stageInfo().shape)` and applies:

- **Ground tokens:** `--ground-y` / `--ledge-lip` set as CSS custom
  properties on `.combat-screen`. `.stage-ledge`, its glow seam
  (`::before`), and the `.sl-ledge` plate top become `calc()` off these two
  vars — the hardening spec's §1 derivations, driven by the file.
- **Absolute combatant slots:** `.battlefield` flex `space-between` layout is
  removed. Hero: `left: (x − w·scale/2)px; bottom: calc(var(--ground-y) +
  footY·1px)`. Each enemy box likewise from its formation slot. The four
  container-query blocks drop their `.battlefield` inset / `.player-zone`
  width / `.hero-wrap` size overrides; those numbers move into the per-shape
  sections of the layout file (seeded from today's values).
- **Chrome plates (absorbs plan Tasks 4–5):** the below-art rows (`.name`,
  `.hpbar-wrap`, `.facet-row`, `.status-row`) of enemies AND hero move into
  an absolutely-positioned plate anchored `top: 100%` of the art box, so the
  positioned box IS the art box and box-bottom = feet. All `ce.*` lookups
  are class queries inside the box and survive; the `.player-zone`
  `translateY(25px)` sink is deleted; `.intent` chip stays put; `.lightpool`
  re-anchors to the art box bottom.
- **Layers:** the three `<img class="sl">` elements receive inline
  height/bottom/opacity, `transform: scale(zoom)` on the drift wrapper
  variable, and `object-position: posX%`.
- **Followers need no work:** mesh planes, lightpools, VFX anchors,
  drag-targeting all track element rects per frame.
- Enemy count is fixed for a fight (no summons in the engine); slot layout
  is chosen once from the starting count, matching current behaviour.

## 3. The editor — `src/dev/bf-editor.js` (dev-only)

**Entry:** `http://localhost:5174/?bfedit=1` (combinable with `?shape=…`).
`main.js` dynamic-imports the module behind the flag. The editor starts a
**sandbox fight** through the existing `window.spirebound` debug hook with
enemy actions frozen, and mounts a toolbar + side panel.

**Toolbar:** shape switcher (5 buttons — reloads with the matching
`?shape=`, since shape is chosen at boot; editor state round-trips through
the URL), scenario controls (act 1/2/3 for the background plates, enemy
count 1/2/3, per-slot enemy type, hero aspect), **Save**, **Revert** (reload
last saved), **Copy JS** fallback, dirty indicator showing which scope the
last edit landed in.

**Direct manipulation:** every editable object (hero, each enemy, each
layer) gets a dashed outline and grab surface; the ground line renders as a
ruler with its px value. Drag moves (pointer → `toStage()`, whole-px snap):
combatants horizontally (x; vertical drag edits `footY` with a
feet-are-ground-anchored hint), layers vertically (`y`). A corner handle
resizes: hero w/h; enemy → slot `s` or shared type `scale` (toggle in
panel); layer → `h` / `zoom`. Arrow keys nudge ±1px, Shift ±10px, Esc
deselects.

**Parameter panel:** numeric inputs for every field of the selection,
live-applied. Each edit carries an explicit **scope**: `shared` (type/tier
values, all shapes), `base` (pad-landscape layout, inherited by all), or
`this shape` (override for the current shape only). Defaults: on
pad-landscape positional edits go to base; on other shapes to that shape's
override; size/footY edits to shared. The panel always shows provenance
(inherited vs overridden) with a clear-override button.

## 4. Save path — vite dev plugin

A ~40-line plugin in `vite.config.js`, dev server only: `POST /__bf-save`
receives the layout object, validates (known shape keys, known enemy/hero
ids, all numbers finite, slots 1–3 present), and writes `src/battlefield.js`
via the deterministic serializer (fixed key order, fixed header,
write-temp-then-rename so the file is never half-written). Vite HMR reloads
the module. Invalid payload ⇒ 400 + editor toast; nothing written.

## 5. Testing & migration

- `npm test` gains a battlefield schema check: Node-imports, all 5 shapes
  resolve, slot formations exist for counts 1–3, every `ENEMIES`/`ASPECTS`
  id resolves (explicitly or by default).
- `geometry.spec` unchanged — now validates the layout file's truth.
- `stage.spec` unchanged (bit-equality across resize follows from
  shape-only dependence).
- One editor smoke e2e: open `?bfedit=1`, drag the hero 40px, intercept the
  POST, assert the payload's hero x moved by 40.
- `visual.spec` baselines: still uncaptured (per the hardening plan); no
  conflict.
- Hardening plan bookkeeping: mark Tasks 1, 4, 5 superseded with a pointer
  to this spec; Tasks 2, 3 and 6+ (mesh lifecycle, baselines, perf, polish)
  proceed unchanged on top.

## Out of scope (this pass)

Combat chrome positioning (energy orb, lantern, end turn, piles, hand zone);
attachment/rig parts implementation (schema slot reserved only); per-act
layer geometry (schema-compatible extension); editing on a production build;
touch-input editing (the editor is a desktop dev tool, though it can *view*
phone shapes via the switcher).
