# UI Chrome Assets & Combat HUD Redesign — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship a raster `src/assets/ui/` chrome kit and restyle Energy (candles), Facets (glass chips), combat HP (vial frame), End Turn (icon + short label), HUD glyphs, intents, lantern button, and map nodes (shared frame + type glyph) — presentation only.

**Architecture:** Pure helpers in `src/ui-chrome.js` (ids, SVG fallback map, energy slot states, intent id lists). `art.js` gains `uiIcon()` / `uiIconUrl()` on top of `assetUrl('ui', id)`. `ui.js` + `styles.css` consume rasters with SVG/CSS fallbacks so zero PNGs still play. Map keeps SVG overlay projection; nodes use `<image>` for frame + glyph (same pattern as monument). Engine untouched.

**Tech Stack:** Vite + vanilla JS; `assetUrl` glob; `test/test_engine.js`; imagegen via `docs/generated-art-workflow.md` + `tools/imagegen.sh`.

**Spec:** `docs/superpowers/specs/2026-07-09-ui-chrome-assets-design.md`

## File map

| File | Responsibility |
|---|---|
| `src/ui-chrome.js` | Pure: `UI_CHROME_IDS`, fallback SVG names, `energySlotStates`, `intentUiIds`, `nodeGlyphId` |
| `docs/ui-chrome-art-bible.md` | Style + per-id subjects |
| `src/art.js` | `uiIcon`, `uiIconUrl`; add SVG `menu` fallback path in `ICONS` |
| `src/ui.js` | HUD, energy, facets, HP vial, End Turn, lantern, intents, map nodes, gallery `ui` cat |
| `src/styles.css` | Candle imgs, facet imgs, vial frame, End Turn icon+label, map frame stack |
| `src/assets/ui/*.png` | Chrome kit (after generation task) |
| `src/assets/README.md` | Document `ui/` category |
| `test/test_engine.js` | Pure helper asserts; `checkManifest('ui', …)` after PNGs land |
| `scratch/ui-chrome-20260709/` | Imagegen sources / prompt-ledger (optional scratch) |

## Global Constraints

- Engine / `vigil.js` math and event shapes unchanged.
- Missing `assetUrl('ui', id)` → today's SVG or CSS look; never blank or throw.
- Replace HUD `≡` with `uiIcon('menu')` (SVG three-bar fallback in `art.js`).
- End Turn label copy locked: **`End`** (short; icon carries meaning).
- `facet-ready` asset is **optional**; default shatter-ready = CSS on `.facet-row.willshatter` / `.pip.willchip` only.
- Lantern art chip uses existing `assetUrl('arts', artId)` — do not duplicate under `ui/`.
- Map: keep DOM/SVG overlay-on-3D; do not convert nodes to HTML buttons.
- Combat chrome must not break `geometry.spec` feet ±2px (grow chrome downward / beside, not into art bottoms).
- `npm test` green at every task boundary; do not import `audio.js` / `stage.js` into engine.
- Imagegen unavailable → generation task reports **BLOCKED**; never fabricate PNGs.
- Do not commit `test-results/`, `playwright-report/`, or unrelated WIP. Commit after each task; do not push unless asked. Skip rebuilding `dist/` until the final QA task (or omit if owner prefers).

### Locked id list (`UI_CHROME_IDS`)

```
candle-lit, candle-spent,
facet-empty, facet-chipped,
hp-vial-frame, heart, coin, deck, menu, ward, end-turn, lantern,
intent-attack, intent-block, intent-buff, intent-debuff, intent-heal,
node-frame, node-monster, node-elite, node-event, node-rest, node-shop,
node-treasure, node-boss, node-monument, node-unlit
```

(`facet-ready` may appear in the bible as optional; not in the required id list.)

### SVG fallback map (`uiFallbackName`)

| ui id | `ICONS` key |
|---|---|
| `heart` | `heart` |
| `coin` | `coin` |
| `deck` | `cards` |
| `menu` | `menu` (new) |
| `ward` | `shield` |
| `lantern` | `lantern` |
| `end-turn` | `up` (temporary until PNG; acceptable) |
| `facet-empty` / `facet-chipped` | `facet` |
| `intent-attack` | `sword` |
| `intent-block` | `shield` |
| `intent-buff` | `up` |
| `intent-debuff` | `cloud` |
| `intent-heal` | `plus` |
| `candle-*` / `hp-vial-frame` / `node-*` | no glyph — CSS/structural fallback in widget code |

---

### Task 1: Pure helpers + menu SVG + bible + gallery hook

**Files:**
- Create: `src/ui-chrome.js`
- Create: `docs/ui-chrome-art-bible.md`
- Create: `src/assets/ui/.gitkeep` (empty dir until PNGs)
- Modify: `src/art.js` — add `menu` to `ICONS`; export `uiIcon` / `uiIconUrl`
- Modify: `src/ui.js` — import helpers; add `ui` to gallery `cats`
- Modify: `test/test_engine.js` — assert pure helpers

**Interfaces:**
- Produces:
  - `UI_CHROME_IDS: string[]`
  - `uiFallbackName(id: string) → string | null`
  - `energySlotStates(energy: number, energyMax: number) → ('lit'|'spent')[]`
  - `intentUiIds(intent: string) → string[]` (ui ids without `intent-` prefix stripped — return full ids like `intent-attack`)
  - `nodeGlyphId(type: string, unlit: boolean) → string` (`node-unlit` or `node-${type}`)
  - `uiIcon(id, size=18) → html string`
  - `uiIconUrl(id) → string | null`
- Consumes: `assetUrl`, `iconSvg`, `ICONS` / `hasIcon`

- [ ] **Step 1: Add failing tests in `test/test_engine.js`**

Near other pure-module blocks:

```js
import {
  UI_CHROME_IDS, uiFallbackName, energySlotStates, intentUiIds, nodeGlyphId,
} from '../src/ui-chrome.js';

assert.ok(UI_CHROME_IDS.includes('candle-lit'));
assert.ok(UI_CHROME_IDS.includes('node-monument'));
assert.equal(UI_CHROME_IDS.length, 27);
assert.equal(uiFallbackName('deck'), 'cards');
assert.equal(uiFallbackName('ward'), 'shield');
assert.equal(uiFallbackName('menu'), 'menu');
assert.equal(uiFallbackName('node-frame'), null);
assert.deepEqual(energySlotStates(2, 3), ['lit', 'lit', 'spent']);
assert.deepEqual(energySlotStates(0, 3), ['spent', 'spent', 'spent']);
assert.deepEqual(energySlotStates(5, 3), ['lit', 'lit', 'lit', 'lit', 'lit']); // length follows max(energy, energyMax)
assert.deepEqual(intentUiIds('attack'), ['intent-attack']);
assert.deepEqual(intentUiIds('attack_debuff'), ['intent-attack', 'intent-debuff']);
assert.deepEqual(intentUiIds('block'), ['intent-block']);
assert.deepEqual(intentUiIds('mystery'), ['intent-attack']);
assert.equal(nodeGlyphId('elite', false), 'node-elite');
assert.equal(nodeGlyphId('monster', true), 'node-unlit');
```

- [ ] **Step 2: Run tests — expect FAIL**

Run: `npm test`  
Expected: fail resolving `../src/ui-chrome.js` or missing exports.

- [ ] **Step 3: Implement `src/ui-chrome.js`**

```js
export const UI_CHROME_IDS = [
  'candle-lit', 'candle-spent',
  'facet-empty', 'facet-chipped',
  'hp-vial-frame', 'heart', 'coin', 'deck', 'menu', 'ward', 'end-turn', 'lantern',
  'intent-attack', 'intent-block', 'intent-buff', 'intent-debuff', 'intent-heal',
  'node-frame', 'node-monster', 'node-elite', 'node-event', 'node-rest', 'node-shop',
  'node-treasure', 'node-boss', 'node-monument', 'node-unlit',
];

const FALLBACK = {
  heart: 'heart', coin: 'coin', deck: 'cards', menu: 'menu', ward: 'shield',
  lantern: 'lantern', 'end-turn': 'up',
  'facet-empty': 'facet', 'facet-chipped': 'facet',
  'intent-attack': 'sword', 'intent-block': 'shield', 'intent-buff': 'up',
  'intent-debuff': 'cloud', 'intent-heal': 'plus',
};

export function uiFallbackName(id) {
  return Object.prototype.hasOwnProperty.call(FALLBACK, id) ? FALLBACK[id] : null;
}

export function energySlotStates(energy, energyMax) {
  const e = Math.max(0, Math.floor(Number(energy) || 0));
  const m = Math.max(e, Math.max(0, Math.floor(Number(energyMax) || 0)));
  return Array.from({ length: m }, (_, i) => (i < e ? 'lit' : 'spent'));
}

export function intentUiIds(intent) {
  const key = String(intent || '');
  if (key === 'block') return ['intent-block'];
  if (key === 'buff') return ['intent-buff'];
  if (key === 'debuff') return ['intent-debuff'];
  if (key === 'heal') return ['intent-heal'];
  if (key.startsWith('attack')) {
    const ids = ['intent-attack'];
    if (key === 'attack_debuff') ids.push('intent-debuff');
    if (key === 'attack_block') ids.push('intent-block');
    if (key === 'attack_buff') ids.push('intent-buff');
    return ids;
  }
  return ['intent-attack'];
}

export function nodeGlyphId(type, unlit) {
  if (unlit) return 'node-unlit';
  const t = String(type || 'monster');
  return `node-${t}`;
}
```

- [ ] **Step 4: Add `menu` SVG + `uiIcon` / `uiIconUrl` in `src/art.js`**

In `ICONS`, add:

```js
menu: `<path d="M5 7.5 h14 M5 12 h14 M5 16.5 h14" stroke-width="2.4"/>`,
```

Near `iconSvg` exports:

```js
import { uiFallbackName } from './ui-chrome.js';
// If art.js must stay free of cycles: duplicate the tiny FALLBACK map here instead of importing.
// Prefer: keep FALLBACK only in ui-chrome.js and import it (ui-chrome imports nothing).
```

`ui-chrome.js` imports nothing — safe for `art.js` to import.

```js
import { uiFallbackName } from './ui-chrome.js';

export function uiIconUrl(id) {
  return assetUrl('ui', id);
}

export function uiIcon(id, size = 18) {
  const u = assetUrl('ui', id);
  if (u) {
    return `<img class="ui-icon" src="${u}" width="${size}" height="${size}" alt="" draggable="false">`;
  }
  const fb = uiFallbackName(id);
  return fb ? iconSvg(fb, size) : '';
}
```

- [ ] **Step 5: Author `docs/ui-chrome-art-bible.md`**

Create with style block matching icon bible, composition rules for 14–24px silhouette readability, and a subject table covering every `UI_CHROME_IDS` row (one line each). Note `facet-ready` as optional / CSS-default. Note lantern art portraits stay in `arts/`.

- [ ] **Step 6: Gallery + `.gitkeep`**

- `src/assets/ui/.gitkeep`
- In `renderGallery` `cats`, add:

```js
ui: UI_CHROME_IDS.map((k) => [k, () => {
  const fb = uiFallbackName(k);
  return fb ? iconSvg(fb, 64) : `<div class="title-banner-ph">${k}</div>`;
}]),
```

Import `UI_CHROME_IDS`, `uiFallbackName` from `./ui-chrome.js`. Import `uiIcon` from `./art.js` when later tasks need it (gallery can use `iconSvg` only for now).

- [ ] **Step 7: Run tests — expect PASS**

Run: `npm test`  
Expected: ends with `unit checks passed; monte-carlo: …`

- [ ] **Step 8: Commit**

```bash
git add src/ui-chrome.js src/art.js src/ui.js src/assets/ui/.gitkeep \
  docs/ui-chrome-art-bible.md test/test_engine.js
git commit -m "$(cat <<'EOF'
Add UI chrome helpers, bible, and gallery hook.

EOF
)"
```

---

### Task 2: HUD glyphs (heart, coin, deck, menu)

**Files:**
- Modify: `src/ui.js` — `renderHud` (~250–270)
- Modify: `src/styles.css` — `.ui-icon` sizing inside `.hud-stat` / `.icon-btn`

**Interfaces:**
- Consumes: `uiIcon` from `art.js`
- Produces: HUD never uses `≡`

- [ ] **Step 1: Wire HUD markup**

Replace:

```js
${iconSvg('heart', 14)}
${iconSvg('coin', 14)}
${iconSvg('cards', 19)}
<button class="icon-btn" data-act="menu">≡</button>
```

With:

```js
${uiIcon('heart', 14)}
${uiIcon('coin', 14)}
${uiIcon('deck', 19)}
<button class="icon-btn" data-act="menu" aria-label="Menu">${uiIcon('menu', 19)}</button>
```

Also replace other HUD-scale `iconSvg('coin', …)` in rewards/shop price rows that should share the kit (same `uiIcon('coin', 14)`). Leave large decorative sites alone if they already use different art.

Ensure `uiIcon` is imported from `./art.js`.

- [ ] **Step 2: CSS for img icons**

```css
.ui-icon { display: block; flex-shrink: 0; object-fit: contain; }
.hud-stat .ui-icon { width: 14px; height: 14px; }
.icon-btn .ui-icon { width: 19px; height: 19px; }
.icon-btn .gicon { /* existing */ }
```

Keep `.hud-stat .gicon` colour rules; imgs ignore `currentColor` (expected for raster).

- [ ] **Step 3: Smoke**

Run: `npm test`  
Manual (if dev server up): open a run — HUD shows heart/coin/deck/menu; menu opens.

- [ ] **Step 4: Commit**

```bash
git add src/ui.js src/styles.css
git commit -m "$(cat <<'EOF'
Wire HUD chrome icons through uiIcon helper.

EOF
)"
```

---

### Task 3: Energy candle meter

**Files:**
- Modify: `src/ui.js` — combat markup `.energy-orb`; `syncCombat` candle block (~1241–1247)
- Modify: `src/styles.css` — `.energy-orb`, `.candles`, `.candle`

**Interfaces:**
- Consumes: `energySlotStates(energy, energyMax)`, `uiIconUrl('candle-lit'|'candle-spent')`
- Produces: one slot per `max(energy, energyMax)`; lit/spent imgs or CSS fallback class

- [ ] **Step 1: Change sync to use `energySlotStates` + optional imgs**

Replace the candle sync block with:

```js
import { energySlotStates } from './ui-chrome.js';

$('.num', ce.energy).textContent = P.energy;
ce.energy.classList.toggle('spent', P.energy === 0);
const cd = $('.candles', ce.energy);
const states = energySlotStates(P.energy, P.energyMax);
const litUrl = uiIconUrl('candle-lit');
const spentUrl = uiIconUrl('candle-spent');
const same = cd.children.length === states.length
  && [...cd.children].every((el, i) => el.dataset.state === states[i]);
if (!same) {
  cd.innerHTML = states.map((st) => {
    const url = st === 'lit' ? litUrl : spentUrl;
    if (url) {
      return `<span class="candle is-${st}" data-state="${st}"><img class="ui-icon candle-img" src="${url}" alt="" draggable="false"></span>`;
    }
    return `<span class="candle ${st === 'lit' ? 'lit' : ''} is-${st}" data-state="${st}"></span>`;
  }).join('');
} else {
  [...cd.children].forEach((c, i) => {
    const st = states[i];
    c.dataset.state = st;
    c.classList.toggle('lit', st === 'lit');
    c.classList.toggle('is-lit', st === 'lit');
    c.classList.toggle('is-spent', st === 'spent');
  });
}
```

Keep `.lbl` ENERGY text or hide on small stages (existing container queries).

- [ ] **Step 2: Restyle energy chrome toward candle meter**

- Soften/remove orb `::before` comet when candles carry the read (`display: none` on `::before` or delete rule).
- Size `.candle` for imgs (~14–18px wide); `.candle-img { width: 100%; height: 100%; object-fit: contain; }`.
- Keep absolute position of `.energy-orb` (left combat chrome).
- Zero-asset path: existing `.candle.lit` CSS gradients still work when no URLs.

- [ ] **Step 3: Verify**

Run: `npm test`  
Manual: spend energy — slots extinguish; gain energy — relight; `energyMax` boost adds a slot.

- [ ] **Step 4: Commit**

```bash
git add src/ui.js src/styles.css
git commit -m "$(cat <<'EOF'
Restyle combat energy as a candle wick meter.

EOF
)"
```

---

### Task 4: Facet glass chips + combat HP vial + ward

**Files:**
- Modify: `src/ui.js` — `facetPips`, combat HP markup (`hpbar-wrap`), `syncCombat` block chips
- Modify: `src/styles.css` — `.facet-row .pip`, `.hpbar-wrap` / vial frame

**Interfaces:**
- Consumes: `uiIcon`, `uiIconUrl('facet-empty'|'facet-chipped'|'hp-vial-frame'|'ward')`
- Produces: countable chip row; vial frame around existing fill/ghost/pv

- [ ] **Step 1: Update `facetPips`**

```js
function facetPips(en, ghost = 0) {
  if (en.facetMax > 8) {
    return `<span class="pipnum">${uiIcon('facet-chipped', 11)} ${en.chips}${ghost ? `<i>+${ghost}</i>` : ''}/${en.facetMax}</span>`;
  }
  const emptyU = uiIconUrl('facet-empty');
  const chipU = uiIconUrl('facet-chipped');
  let h = '';
  for (let i = 0; i < en.facetMax; i++) {
    const filled = i < en.chips;
    const will = !filled && i < en.chips + ghost;
    const cls = `pip${filled ? ' filled' : ''}${will ? ' willchip' : ''}`;
    if (emptyU || chipU) {
      const src = filled || will ? (chipU || emptyU) : (emptyU || chipU);
      h += `<span class="${cls}"><img class="ui-icon facet-img" src="${src}" alt="" draggable="false"></span>`;
    } else {
      h += `<span class="${cls}"></span>`;
    }
  }
  return h;
}
```

Preserve existing preview code that sets `willchip` / `willshatter` classes on the row.

- [ ] **Step 2: HP vial frame + ward icon**

In combat hero/enemy markup, wrap `.hpbar` (not the whole wrap) so fill layers stay:

```html
<div class="hpbar-wrap">
  <span class="block-chip …">${uiIcon('ward', 13)} 0</span>
  <div class="hp-vial">
    <img class="hp-vial-frame" src="…" alt="" hidden-or-omitted-if-missing>
    <div class="hpbar">…</div>
  </div>
  <span class="hp-label …"></span>
</div>
```

If `uiIconUrl('hp-vial-frame')` is null, omit the `<img>` and keep today's bar look.

In `syncCombat`, replace `iconSvg('shield', 13)` with `uiIcon('ward', 13)` for player and enemy block chips.

- [ ] **Step 3: CSS**

```css
.hp-vial { position: relative; flex: 1; display: flex; align-items: center; }
.hp-vial-frame {
  position: absolute; inset: -4px -6px; width: auto; height: calc(100% + 8px);
  pointer-events: none; object-fit: fill; z-index: 2;
}
.hp-vial .hpbar { position: relative; z-index: 1; width: 100%; }
.facet-row .pip .facet-img { width: 10px; height: 10px; display: block; }
.facet-row .pip.filled { /* keep glow; may drop old background diamond if img present */ }
```

Do not move enemy/hero art bottoms — only chrome below art.

- [ ] **Step 4: Verify**

Run: `npm test`  
If Playwright available: `npx playwright test geometry --reporter=list` (or project subset) — feet ±2px still green.

- [ ] **Step 5: Commit**

```bash
git add src/ui.js src/styles.css
git commit -m "$(cat <<'EOF'
Restyle facet chips and combat HP vial chrome.

EOF
)"
```

---

### Task 5: End Turn icon+label + lantern body + arts chip

**Files:**
- Modify: `src/ui.js` — combat markup End Turn + lantern; lantern art sync (~973)
- Modify: `src/styles.css` — `.end-turn`, `.lantern-btn .lb-ic`, `.lb-art`

**Interfaces:**
- Consumes: `uiIcon('end-turn')`, `uiIcon('lantern')`, `assetUrl('arts', artId)`
- Produces: label text **`End`**; no `≡`; arts chip prefers PNG

- [ ] **Step 1: Markup**

Replace:

```html
<button class="btn end-turn">End Turn</button>
…
<span class="lb-ic">${iconSvg('lantern', 26)}</span>
```

With:

```html
<button class="btn end-turn" type="button"><span class="et-ic">${uiIcon('end-turn', 22)}</span><span class="et-lbl">End</span></button>
…
<span class="lb-ic">${uiIcon('lantern', 26)}</span>
```

- [ ] **Step 2: Lantern art chip uses arts raster**

Where `.lb-art` is filled (~973):

```js
const artId = S.run.art;
const art = ARTS[artId];
const artU = assetUrl('arts', artId);
const glyph = artU
  ? `<img class="ui-icon lb-art-img" src="${artU}" alt="" draggable="false">`
  : uiIcon(`art-${artId}`, 16) || iconSvg(`art-${artId}`, 16);
// Note: art-* are not ui/ ids — keep iconSvg(`art-${artId}`) for SVG fallback.
$('.lb-art', ce.lantern).innerHTML = `<i>${artU ? `<img class="ui-icon lb-art-img" src="${artU}" width="16" height="16" alt="">` : iconSvg(`art-${artId}`, 16)}</i>${art.cost}`;
```

Do **not** call `uiIcon('art-…')`.

- [ ] **Step 3: CSS**

```css
.end-turn {
  display: flex; flex-direction: column; align-items: center; justify-content: center;
  gap: 4px; padding: 10px 16px; min-width: 64px;
  /* reduce plate-button chrome: lighter border/shadow than generic .btn if needed */
}
.end-turn .et-lbl {
  font-family: 'Cinzel', serif; font-size: 12px; letter-spacing: 0.14em; font-weight: 700;
}
.end-turn .et-ic .ui-icon, .end-turn .et-ic .gicon { width: 22px; height: 22px; }
.lantern-btn .lb-art-img { width: 16px; height: 16px; object-fit: contain; }
```

Keep `.enemy-phase` dim + `pointer-events: none`.

- [ ] **Step 4: Verify + commit**

Run: `npm test`

```bash
git add src/ui.js src/styles.css
git commit -m "$(cat <<'EOF'
Restyle End Turn control and lantern button art.

EOF
)"
```

---

### Task 6: Intent icons

**Files:**
- Modify: `src/ui.js` — `intentFor` (~1152–1172)

**Interfaces:**
- Consumes: `intentUiIds`, `uiIcon`
- Produces: same tip/text behaviour; icons from kit

- [ ] **Step 1: Rewrite icon assembly in `intentFor`**

```js
function intentFor(e) {
  const cb = S.cb;
  const mv = E.enemyMove(e);
  const p = E.previewEnemyDmg(S.run, cb, e);
  const ids = intentUiIds(mv.intent);
  let icon = ids.map((id, i) => uiIcon(id, i === 0 ? 19 : 14)).join('');
  let txt = '';
  if (mv.intent.startsWith('attack')) {
    txt = p.times > 1 ? `${p.dmg}×${p.times}` : `${p.dmg}`;
  }
  // tipBits unchanged from current code…
  return { icon, txt, tip: { title: mv.name, body: `Intends to ${tipBits.join(', ') || 'act'}.` } };
}
```

Keep staggered state on SVG `stagger` (out of kit).

- [ ] **Step 2: Verify + commit**

Run: `npm test`

```bash
git add src/ui.js
git commit -m "$(cat <<'EOF'
Wire enemy intent icons to the UI chrome kit.

EOF
)"
```

---

### Task 7: Map node frame + type glyphs

**Files:**
- Modify: `src/ui.js` — map node loop (~701–718)
- Modify: `src/styles.css` — only if HTML/CSS extras needed; prefer SVG attributes

**Interfaces:**
- Consumes: `nodeGlyphId`, `uiIconUrl('node-frame')`, `uiIconUrl(glyphId)`
- Produces: `<image>` frame + glyph; SVG `iconInline` fallback

- [ ] **Step 1: Replace iconHtml construction**

```js
import { nodeGlyphId } from './ui-chrome.js';

const glyphId = nodeGlyphId(n.type, dark);
const frameU = uiIconUrl('node-frame');
const glyphU = uiIconUrl(glyphId);
// Prefer kit; monument meta raster remains fallback for monument when glyph missing
const monUrl = (n.type === 'monument' && !glyphU) ? assetUrl('meta', 'monument-node') : null;
let iconHtml;
if (frameU || glyphU || monUrl) {
  const gs = isz;
  const fs = Math.round(r * 2);
  const frame = frameU
    ? `<image class="nframe" href="${frameU}" x="${-fs / 2}" y="${-fs / 2}" width="${fs}" height="${fs}" />`
    : `<circle class="bg" r="${dark ? 16 * tf : r}"/>`;
  const glyph = (glyphU || monUrl)
    ? `<image class="nglyph" href="${glyphU || monUrl}" x="${-gs / 2}" y="${-gs / 2}" width="${gs}" height="${gs}" />`
    : `<g class="icg">${iconInline(dark ? 'unlitLantern' : NODE_ICONS[n.type], dark ? Math.round(17 * tf) : isz)}</g>`;
  iconHtml = `${frame}${glyph}`;
} else {
  iconHtml = `<circle class="bg" r="${dark ? 16 * tf : r}"/><g class="icg">${iconInline(dark ? 'unlitLantern' : NODE_ICONS[n.type], dark ? Math.round(17 * tf) : isz)}</g>`;
}
dots += `<g class="${cls}" data-node="${n.id}" style="--d:${n.row * 34}ms">
  <g class="nwrap">${iconHtml}</g>
</g>`;
```

When `frameU` exists, avoid double circle+frame (use frame as bg). When only glyph exists, keep circle bg.

- [ ] **Step 2: Verify map still projects**

Manual: map pan/click; unlit nodes secret; monument readable.  
Run: `npm test`

- [ ] **Step 3: Commit**

```bash
git add src/ui.js src/styles.css
git commit -m "$(cat <<'EOF'
Compose map nodes from shared frame and type glyphs.

EOF
)"
```

---

### Task 8: Generate & promote `src/assets/ui/*.png` + manifest

**Files:**
- Create: `src/assets/ui/<id>.png` for every `UI_CHROME_IDS` entry
- Create (optional): `scratch/ui-chrome-20260709/prompt-ledger.md`
- Modify: `src/assets/README.md` — list `ui/` kit
- Modify: `test/test_engine.js` — `checkManifest('ui', UI_CHROME_IDS)`
- Remove: `src/assets/ui/.gitkeep` once real PNGs exist

**Interfaces:**
- Consumes: `docs/ui-chrome-art-bible.md`, `tools/imagegen.sh`
- Produces: full kit on disk; bidirectional manifest

- [ ] **Step 1: Generate assets**

Follow `docs/generated-art-workflow.md`. Silhouette-first; 512² for frames/candles/vial; normalize with `sips -Z 512` (or 256 for tiny glyphs if bible says so — prefer 512 source).

If imagegen is unavailable, stop and report **BLOCKED** with the remaining id list. Do not invent PNGs.

- [ ] **Step 2: Promote into `src/assets/ui/`**

One file per id; transparent PNG; no baked text.

- [ ] **Step 3: Manifest gate**

```js
import { UI_CHROME_IDS } from '../src/ui-chrome.js';
// inside existing manifest block:
checkManifest('ui', UI_CHROME_IDS);
```

- [ ] **Step 4: README**

Append a short `ui/` section listing the kit purpose + pointer to `docs/ui-chrome-art-bible.md`.

- [ ] **Step 5: Run `npm test` — expect PASS (manifest included)**

- [ ] **Step 6: Commit**

```bash
git add src/assets/ui src/assets/README.md test/test_engine.js docs/ui-chrome-art-bible.md scratch/ui-chrome-20260709
git commit -m "$(cat <<'EOF'
Add UI chrome raster kit and manifest gate.

EOF
)"
```

---

### Task 9: Final QA

**Files:**
- Possibly: `test/e2e/visual.spec.js-snapshots/` if baselines are armed and owner wants updates
- Optionally: `dist/` via `npm run build` only if this repo expects it in the same PR

- [ ] **Step 1: Engine + build**

```bash
npm test
npm run build
```

Expected: unit checks passed; build succeeds.

- [ ] **Step 2: Playwright smoke (if Chromium installed)**

```bash
npx playwright test stage geometry battle --reporter=list
```

Expected: green (skips OK). If `visual.spec` baselines exist and fail on chrome pixels, run `npm run test:e2e:update` only for intentional chrome diffs and commit snapshots in a separate commit.

- [ ] **Step 3: Manual checklist**

- Desktop combat: candles, facets, HP vial, End (`End` label), lantern arts chip, intents  
- Phone-portrait: same chrome readable, no overlap into hand  
- Map: frame+glyph; unlit; monument  
- `?gallery=1` → `ui` section 27/27  

- [ ] **Step 4: Commit QA-only fixes if any; final message**

```bash
git commit -m "$(cat <<'EOF'
Finish UI chrome assets QA pass.

EOF
)"
```

---

## Spec coverage (self-review)

| Spec item | Task |
|---|---|
| `src/assets/ui/` kit + ids | 1, 8 |
| Soften ≤20px raster exception | 1–2, bible |
| Energy candle/wick | 3 |
| Facet glass chip row | 4 |
| HP split roles + ward | 4 |
| End Turn icon + short label (`End`) | 5 |
| Lantern body + arts chip | 5 |
| Intent icons | 6 |
| Map shared frame + glyphs | 7 |
| Art bible + gallery | 1, 8 |
| Manifest optional→required when PNGs land | 8 |
| Engine untouched / fallbacks | Global + all tasks |
| QA | 9 |

**Placeholders:** none intentional.  
**Type consistency:** `UI_CHROME_IDS` length 27; `energySlotStates` / `intentUiIds` / `nodeGlyphId` / `uiIcon` names stable across tasks.
