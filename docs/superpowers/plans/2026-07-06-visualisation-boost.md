# Visualisation Boost Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Lift Spirebound's visual layer to app-store sellable quality: painted combat diorama, per-archetype + bespoke card VFX, character attack choreography, card/HUD polish, and full asset coverage (relics, icons, title background).

**Architecture:** All changes live in the UI layer (`ui.js`, `vfx.js`, `styles.css`, `art.js`, `data.js` display metadata, `src/assets/`). The engine event queue is **not** modified; the UI derives VFX context from the `play`/`enemyAct` events it already receives. Every new asset category resolves through `assetUrl()` and falls back to today's look when files are missing.

**Tech Stack:** Vanilla JS (Vite), Web Animations API, 2D canvas VFX, CSS. Raster assets via the locked pipeline in `docs/generated-art-workflow.md` (gpt-image-2 → Nano Banana Pro → alpha → rim cleanup → gallery review).

**Spec:** `docs/superpowers/specs/2026-07-06-visualisation-boost-design.md` — read it before starting any task.

## Global Constraints

- `npm test` must pass at every task boundary — run it before every commit. It runs headless Node; `engine.js`, `vigil.js`, `data.js` must stay Node-runnable (no DOM, no `import.meta.glob`, no localStorage outside existing guards).
- Never rename internal keys (card ids, status keys, relic ids, enemy keys, `art.kind` values).
- Animate only `transform`, `opacity`, `filter`. Gate all motion behind the existing `REDUCED` flag (JS) / `prefers-reduced-motion` (CSS) patterns.
- Reuse easing tokens `--ease-out-soft` and `--ease-spring` from `styles.css` `:root`; do not invent new curves.
- Structural icons come from `art.js` (`iconSvg`/`iconInline`) — never font glyphs.
- All raster generation follows `docs/generated-art-workflow.md` (prompt ledger in `scratch/`, `#ff00ff` chroma-key, alpha validation, rim cleanup, `?gallery=1` review). Asset ids must equal internal keys from `data.js`. **Owner-approved deviation (2026-07-06): Step 1 source images are generated with the Cursor session's image-generation tool instead of Codex gpt-image-2** (executor environment lacks Codex built-in image_gen); Steps 2–4 (Nano Banana Pro → alpha → rim cleanup) unchanged.
- Mobile budget: LITE tier (`matchMedia('(pointer: coarse)')` — the pattern used in `scene3d.js`) gets 0.6× particle counts and skips fullscreen impact frames.
- `dist/` is committed and rebuilt; do not run `npm run build` per task — only in the final task.
- Commit after every task with the message given in the task.

---

### Task 1: Card polish CSS — cost gem, rarity tiers, name plate, art bevel

**Files:**
- Modify: `src/styles.css` (card section, lines ~261–341)

**Interfaces:**
- Produces: purely visual CSS; no selectors added or removed that JS depends on. `.card-cost`, `.card-name`, `.card-art`, `.r-uncommon`, `.r-rare` keep their names.

- [ ] **Step 1: Rebuild the cost badge as a faceted glass gem**

In `src/styles.css`, replace the whole `.card-cost { ... }` rule (currently starting `position: absolute; top: -7px; left: -7px;`) with:

```css
.card-cost {
  position: absolute; top: -8px; left: -8px; z-index: 4; width: 36px; height: 36px;
  display: flex; align-items: center; justify-content: center;
  font-family: 'Cinzel', serif; font-weight: 800; font-size: 17px; color: #241a05;
  background:
    linear-gradient(135deg, rgba(255, 255, 255, 0.55) 0%, transparent 28%),
    linear-gradient(315deg, rgba(122, 84, 23, 0.75) 0%, transparent 30%),
    conic-gradient(from 210deg at 50% 42%, #ffe9ac 0deg, #f2c14e 80deg, #b3831f 160deg, #f2c14e 240deg, #ffe9ac 360deg);
  clip-path: polygon(50% 0%, 93% 25%, 93% 75%, 50% 100%, 7% 75%, 7% 25%);
  filter: drop-shadow(0 3px 6px rgba(0, 0, 0, 0.65)) drop-shadow(0 0 8px rgba(242, 193, 78, 0.4));
  text-shadow: 0 1px 0 rgba(255, 240, 200, 0.6);
}
.card-cost::before {
  content: ''; position: absolute; inset: 3px;
  clip-path: polygon(50% 0%, 93% 25%, 93% 75%, 50% 100%, 7% 75%, 7% 25%);
  background: linear-gradient(160deg, rgba(255, 255, 255, 0.35), transparent 42%, rgba(0, 0, 0, 0.22) 88%);
  pointer-events: none;
}
.card-cost.free {
  background:
    linear-gradient(135deg, rgba(255, 255, 255, 0.55) 0%, transparent 28%),
    linear-gradient(315deg, rgba(19, 91, 50, 0.8) 0%, transparent 30%),
    conic-gradient(from 210deg at 50% 42%, #d9fbe7 0deg, #37d67a 80deg, #17703e 160deg, #37d67a 240deg, #d9fbe7 360deg);
  filter: drop-shadow(0 3px 6px rgba(0, 0, 0, 0.65)) drop-shadow(0 0 8px rgba(55, 214, 122, 0.45));
}
```

Note: the old rule used `border-radius: 50%` + `border` — the gem uses `clip-path`, so any `border`/`border-radius`/`box-shadow` from the old rule must be gone (borders don't follow clip-path; `filter: drop-shadow` replaces `box-shadow`).

- [ ] **Step 2: Rarity tiers — silvered uncommon, gilt rare**

Immediately after the existing `.card.r-rare .card-inner { ... }` rule, add:

```css
/* rarity corner joints: uncommon wears 2 silver, rare wears 4 gold gems */
.card.r-uncommon .card-lift::before, .card.r-uncommon .card-lift::after,
.card.r-rare .card-lift::before, .card.r-rare .card-lift::after {
  content: ''; position: absolute; width: 7px; height: 7px; z-index: 5; pointer-events: none;
  transform: rotate(45deg);
}
.card.r-uncommon .card-lift::before { top: -2px; left: -2px; background: linear-gradient(135deg, #e8f6ff, #47c2e0 70%); box-shadow: 0 0 6px rgba(127, 227, 242, 0.8); }
.card.r-uncommon .card-lift::after { bottom: -2px; right: -2px; background: linear-gradient(135deg, #e8f6ff, #47c2e0 70%); box-shadow: 0 0 6px rgba(127, 227, 242, 0.8); }
.card.r-rare .card-lift::before { top: -2px; left: -2px; background: linear-gradient(135deg, #fff3d0, var(--gold) 70%); box-shadow: 0 0 7px rgba(242, 193, 78, 0.9); }
.card.r-rare .card-lift::after { bottom: -2px; right: -2px; background: linear-gradient(135deg, #fff3d0, var(--gold) 70%); box-shadow: 0 0 7px rgba(242, 193, 78, 0.9); }
.card.r-rare .card-inner { border-color: #1a1408; }
```

(Two pseudo-elements per card give 2 joints on uncommon and — combined with the stronger gold inner line already present — a clearly gilt rare. Do not try to add 4 physical corner elements; 2 diagonal gems + gold frame reads as the tier.)

- [ ] **Step 3: Name plate rules + art window bevel**

Replace the existing `.card-name { ... }` rule's `background` line with:

```css
  background:
    linear-gradient(90deg, transparent 4%, color-mix(in srgb, var(--gold) 22%, transparent) 18%, color-mix(in srgb, var(--gold) 22%, transparent) 82%, transparent 96%) top / 100% 1px no-repeat,
    linear-gradient(90deg, transparent 10%, color-mix(in srgb, var(--gold) 14%, transparent) 30%, color-mix(in srgb, var(--gold) 14%, transparent) 70%, transparent 90%) bottom / 100% 1px no-repeat,
    linear-gradient(180deg, rgba(255, 255, 255, 0.05), transparent);
```

After the `.card-art { ... }` rule, add:

```css
.card-art::after {
  content: ''; position: absolute; inset: 0; pointer-events: none;
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.09), inset 0 -1px 0 rgba(0, 0, 0, 0.65),
    inset 0 0 18px rgba(0, 0, 0, 0.35);
}
```

- [ ] **Step 4: Verify in browser**

Run dev server if not running (`npm run dev`, port 5174). Open `http://localhost:5174/`, start a run (Begin the Climb → any boon → Light the Way), enter the first fight. Confirm: hex-gem cost badge with facet highlight; starter cards look unchanged apart from the gem; hand cards show name-plate hairlines and art bevel. Then open a reward screen (win the fight) — uncommon/rare cards show corner gems and tiers read at a glance. Take a screenshot as evidence.

- [ ] **Step 5: Run tests and commit**

```bash
npm test   # expect: "unit checks passed; monte-carlo: 300 runs, ..."
git add src/styles.css && git commit -m "Polish card chrome: faceted cost gem, rarity tiers, name plate, art bevel"
```

---

### Task 2: HUD & panel stained-glass chrome (CSS only)

**Files:**
- Modify: `src/styles.css`

**Interfaces:**
- Produces: visual-only changes to existing selectors: `.btn`, `.end-turn`, `.pile-btn`, `.energy-orb`, `.lantern-btn`, `.relic-chip`, `.hpbar`, `#overlay .panel` (use the actual panel selector found in the file — search for `overlay`).

- [ ] **Step 1: Add shared chrome tokens**

In `:root` (top of `styles.css`), add:

```css
  --lead: #05070e;
  --glass-fill: linear-gradient(168deg, rgba(26, 32, 52, 0.92), rgba(10, 13, 22, 0.94) 60%);
  --gold-line: color-mix(in srgb, var(--gold) 55%, transparent);
```

- [ ] **Step 2: Apply to interactive chrome**

Locate the existing rules for `.btn`, `.pile-btn`, `.lantern-btn`, `.energy-orb`, and `.potion-slot` and, without changing their geometry/layout properties, change each rule's `background`/`border`/`box-shadow` to the pattern:

```css
  background: var(--glass-fill);
  border: 1.5px solid var(--lead);
  box-shadow: inset 0 0 0 1px var(--gold-line), inset 0 10px 20px -12px rgba(255, 255, 255, 0.14), 0 4px 14px rgba(0, 0, 0, 0.5);
```

For `.end-turn` specifically, strengthen the inner line to `inset 0 0 0 1px var(--gold)`. For `.relic-chip`, use the same fill but the tinted inner line `inset 0 0 0 1px color-mix(in srgb, var(--tone, var(--gold)) 55%, transparent)`.

- [ ] **Step 3: Apply to bars and panels**

Give `.hpbar` a lead frame: `border: 1px solid var(--lead); box-shadow: inset 0 0 0 1px rgba(255,255,255,0.06);` (keep its size). Find the overlay panel container rule (the element that renders modal panels — grep `#overlay` in `styles.css`) and apply the same glass fill + lead border + gold inner-line treatment.

- [ ] **Step 4: Verify in browser**

Reload the fight: End Turn button, draw/discard/ashes piles, energy orb, lantern button and relic bar read as one glass-and-lead family; open the draw pile overlay — the panel wears the same chrome. Portrait check: devtools responsive 375×812 — nothing overflows or shifts layout. Screenshot both.

- [ ] **Step 5: Run tests and commit**

```bash
npm test
git add src/styles.css && git commit -m "Unify HUD and panel chrome in stained-glass language"
```

---

### Task 3: VFX primitives + archetype dispatcher (vfx.js)

**Files:**
- Modify: `src/vfx.js`

**Interfaces:**
- Produces (exported from `src/vfx.js`):
  - `LITE` (boolean const, coarse-pointer detection)
  - `emberTrail(x0, y0, x1, y1, color)` — ember streak between two points
  - `droplets(x, y, color, n)` — falling smolder droplets
  - `implosion(x, y, color)` — inward ring + converging sparks
  - `shardSpray(x, y, color, n)` — glass shard wedges
  - `archetypeHit(x, y, archetype, power)` — main dispatch; `power` 0..1
  - `ARCHETYPE_TONES` — `{ slash:'#ffffff', pierce:'#cfe6ff', blunt:'#ffd8a0', fire:'#ff9a4d', poison:'#d3a15a', void:'#c99aff', ward:'#9fd4ff' }`

- [ ] **Step 1: Add LITE flag and new primitives**

In `src/vfx.js`, after the `DPR` line, add:

```js
export const LITE = matchMedia('(pointer: coarse)').matches;
const cnt = (n) => (LITE ? Math.max(3, Math.round(n * 0.6)) : n);
```

Do not retrofit `cnt()` into existing effects — only the new code below uses it. Then append at the end of the file:

```js
// ---- archetype primitives ----
export const ARCHETYPE_TONES = { slash: '#ffffff', pierce: '#cfe6ff', blunt: '#ffd8a0', fire: '#ff9a4d', poison: '#d3a15a', void: '#c99aff', ward: '#9fd4ff' };

export function emberTrail(x0, y0, x1, y1, color = '#ff9a4d') {
  if (REDUCED) return;
  const n = cnt(14);
  for (let i = 0; i < n; i++) {
    const t = i / n, jx = (Math.random() - 0.5) * 26, jy = (Math.random() - 0.5) * 26;
    parts.push({ kind: 'dot', x: x0 + (x1 - x0) * t + jx, y: y0 + (y1 - y0) * t + jy, vx: (Math.random() - 0.5) * 40, vy: -30 - Math.random() * 50, size: 2 + Math.random() * 2.4, color, grav: -30, life: 0.5 + t * 0.4, fade: 0.3, add: true, alpha: 0.9 });
  }
}
export function droplets(x, y, color = '#d3a15a', n = 12) {
  if (REDUCED) return;
  for (let i = 0; i < cnt(n); i++) {
    parts.push({ kind: 'dot', x: x + (Math.random() - 0.5) * 54, y: y - 10 + (Math.random() - 0.5) * 30, vx: (Math.random() - 0.5) * 26, vy: 60 + Math.random() * 120, size: 2 + Math.random() * 2, color, grav: 420, drag: 0.4, life: 0.6 + Math.random() * 0.3, fade: 0.35, add: true });
  }
}
export function implosion(x, y, color = '#c99aff') {
  if (REDUCED) return;
  parts.push({ kind: 'ring', x, y, r: 64, vr: -160, size: 3.5, color, life: 0.4, fade: 0.4, add: true });
  for (let i = 0; i < cnt(16); i++) {
    const a = Math.random() * Math.PI * 2, d = 46 + Math.random() * 30;
    parts.push({ kind: 'spark', x: x + Math.cos(a) * d, y: y + Math.sin(a) * d, vx: -Math.cos(a) * (220 + Math.random() * 120), vy: -Math.sin(a) * (220 + Math.random() * 120), size: 2.2, color, grav: 0, drag: 2.4, life: 0.34, fade: 0.2, add: true });
  }
}
export function shardSpray(x, y, color = '#dfeaff', n = 12) {
  if (REDUCED) return;
  for (let i = 0; i < cnt(n); i++) {
    const a = -Math.PI / 2 + (Math.random() - 0.5) * 1.8;
    parts.push({ kind: 'spark', x, y, vx: Math.cos(a) * (200 + Math.random() * 260), vy: Math.sin(a) * (200 + Math.random() * 260), size: 2.6 + Math.random() * 1.6, color, grav: 520, drag: 0.6, life: 0.5 + Math.random() * 0.3, fade: 0.22, add: true });
  }
}

// ---- archetype hit dispatch: one entry point per landed hit ----
export function archetypeHit(x, y, archetype = 'slash', power = 0.3) {
  if (REDUCED) return;
  const tone = ARCHETYPE_TONES[archetype] || '#ffffff';
  const big = power > 0.55;
  switch (archetype) {
    case 'slash':
      slashArc(x, y, big ? '#ffd8a0' : '#ffffff');
      burst(x, y, { color: '#ff9a6a', n: cnt(big ? 26 : 12), speed: big ? 420 : 260 });
      break;
    case 'pierce': {
      const a0 = -Math.PI * 0.78;
      for (let i = 0; i < (big ? 3 : 2); i++) {
        parts.push({ kind: 'spark', x: x - Math.cos(a0) * 70, y: y - Math.sin(a0) * 70, vx: Math.cos(a0) * 900, vy: Math.sin(a0) * 900, size: 3.4, color: tone, grav: 0, drag: 0, life: 0.16 + i * 0.03, fade: 0.1, add: true });
      }
      burst(x, y, { color: tone, n: cnt(big ? 18 : 9), speed: 300, spread: 1.4, angle: a0 + Math.PI });
      break;
    }
    case 'blunt':
      ring(x, y, tone, 6, big ? 720 : 520, 6);
      burst(x, y + 6, { color: '#e8d8b8', n: cnt(big ? 24 : 12), speed: big ? 380 : 240, spread: Math.PI, angle: -Math.PI / 2, grav: 620, kind: 'dot' });
      shake(big ? 14 : 8);
      break;
    case 'fire':
      burst(x, y, { color: '#ffd166', n: cnt(big ? 22 : 12), speed: 240, grav: -120, life: 0.7 });
      burst(x, y, { color: '#ff6a3a', n: cnt(big ? 14 : 8), speed: 160, grav: -60, size: 3.6, kind: 'dot', life: 0.8 });
      break;
    case 'poison':
      droplets(x, y, '#d3a15a', big ? 18 : 10);
      motes(x, y, '#b8b0a0', cnt(8));
      break;
    case 'void':
      implosion(x, y, tone);
      if (big) flash('#c99aff', 0.08, 0.25);
      break;
    case 'ward':
      ring(x, y, tone, 12, 460, 4);
      motes(x, y, tone, cnt(8));
      break;
  }
}
```

- [ ] **Step 2: Verify it loads**

Reload `http://localhost:5174/` with devtools console open — no import/syntax errors. In console run: `window.spirebound !== undefined` → true.

- [ ] **Step 3: Run tests and commit**

```bash
npm test
git add src/vfx.js && git commit -m "Add archetype VFX primitives and dispatcher"
```

---

### Task 4: Archetype data — `vfx` field on all 60 cards + enemy kind map

**Files:**
- Modify: `src/data.js` (CARDS table)
- Modify: `test/test_engine.js` (add validation block)

**Interfaces:**
- Produces: `CARDS[id].vfx` (string) for all 60 cards; consumed by Task 5.

- [ ] **Step 1: Add the `vfx` field to every card**

In `src/data.js`, add `vfx: '<value>'` to each card entry per this exact table (60 rows — do not improvise):

| id | vfx | id | vfx | id | vfx |
|---|---|---|---|---|---|
| strike | slash | brace | ward | ascension | fire |
| defend | ward | sidestep | ward | bastion | ward |
| eclipseSlash | slash | preparation | fire | frenzy | fire |
| chisel | pierce | deflect | ward | virulence | poison |
| firstSpark | fire | leechBlade | void | quakeblow | blunt |
| ashBite | fire | tempest | pierce | resonantLance | pierce |
| smother | fire | uppercut | blunt | tithe | fire |
| twinFangs | pierce | flurry | pierce | pyreheart | fire |
| quickSlash | slash | executioner | blunt | ashenChoir | poison |
| heavyBlow | blunt | momentum | slash | flawlessForm | ward |
| cleave | slash | bulwark | ward | nightSight | void |
| venomStrike | fire | surge | fire | novaflare | fire |
| lunge | slash | toxicMist | poison | emberdance | fire |
| guardedStrike | slash | cripple | void | shardstorm | pierce |
| — | — | warCry | void | wound | pierce |
| — | — | fortify | ward | burn | fire |
| — | — | bloodRite | void | hex | void |
| — | — | empower | fire | oblivionStrike | blunt |
| — | — | agility | ward | phantomBlades | pierce |
| — | — | ironSkin | ward | devour | void |
| — | — | regrowth | fire | annihilate | fire |
| — | — | — | — | aegis | ward |
| — | — | — | — | offering | fire |
| — | — | — | — | limitBreak | blunt |
| — | — | — | — | catalyst | poison |

- [ ] **Step 2: Add the test**

In `test/test_engine.js`, next to the other CARDS validation checks, add:

```js
{
  const VFX_KINDS = new Set(['slash', 'pierce', 'blunt', 'fire', 'poison', 'void', 'ward']);
  for (const [id, c] of Object.entries(CARDS)) {
    assert(VFX_KINDS.has(c.vfx), `card ${id} missing/invalid vfx archetype: ${c.vfx}`);
  }
}
```

(`CARDS` is already imported in `test/test_engine.js` line 11 — no import change needed.)

- [ ] **Step 3: Run test to verify it passes**

```bash
npm test   # expect pass; if any card is missed the assert names it
```

- [ ] **Step 4: Commit**

```bash
git add src/data.js test/test_engine.js && git commit -m "Assign VFX archetype to all 60 cards with test coverage"
```

---

### Task 5: Wire archetype dispatch into combat playback (ui.js)

**Files:**
- Modify: `src/ui.js` — `drain()`/`handleEvent()` region (~lines 1466–1745)

**Interfaces:**
- Consumes: `archetypeHit`, `ARCHETYPE_TONES` from vfx.js (Task 3); `CARDS[id].vfx` (Task 4).
- Produces: module-level `let vfxSource = { archetype, cardId, enemyIdx };` used by Tasks 6–7.

- [ ] **Step 1: Track the VFX source**

In `src/ui.js` near `let heroActing = false;` (line ~1467), add:

```js
// which card/move caused the hits now playing back — set by 'play'/'enemyAct'
let vfxSource = { archetype: 'slash', cardId: null, enemyIdx: null };
const ENEMY_KIND_VFX = {
  beast: 'slash', rogue: 'slash', knight: 'slash', sovereign: 'slash',
  golem: 'blunt', treeboss: 'blunt', crab: 'blunt', leviathan: 'blunt', zombie: 'blunt',
  serpent: 'pierce', crawler: 'pierce', maw: 'pierce', plant: 'pierce',
  wisp: 'void', shade: 'void', eye: 'void', siren: 'void', cultist: 'void',
  slime: 'poison',
};
```

- [ ] **Step 2: Set the source on `play` and `enemyAct`**

In the `case 'play':` block, after `sfx.card();` add:

```js
      vfxSource = { archetype: CARDS[ev.id]?.vfx || 'slash', cardId: ev.id, enemyIdx: null };
```

In the `case 'enemyAct':` block (line ~1806), after `const { x: ex, y: ey } = enemyCenter(ev.idx);` add (spec rule: attack intents use the kind table; `debuff` → void; `buff`/`block` → ward):

```js
      const mvDef = ENEMIES[cb.enemies[ev.idx].key]?.moves?.[ev.move];
      const kindArch = ENEMY_KIND_VFX[ENEMIES[cb.enemies[ev.idx].key]?.art?.kind] || 'slash';
      vfxSource = {
        archetype: mvDef?.intent?.startsWith('attack') ? kindArch
          : mvDef?.intent === 'debuff' ? 'void'
          : (mvDef?.intent === 'buff' || mvDef?.intent === 'block') ? 'ward' : kindArch,
        cardId: null, enemyIdx: ev.idx,
      };
```

In the `case 'art':` block (Lantern Art), at its start add:

```js
      vfxSource = { archetype: 'fire', cardId: `art:${ev.id}`, enemyIdx: null };
```

- [ ] **Step 3: Replace the generic hit visuals with archetype dispatch**

In `case 'hitEnemy':`, inside the `else` branch (non-poison), replace exactly these two lines:

```js
        V.slashArc(ex, ey, big ? '#ffd8a0' : '#ffffff');
        V.burst(ex, ey, { color: '#ff9a6a', n: big ? 30 : 14, speed: big ? 420 : 260 });
```

with:

```js
        V.archetypeHit(ex, ey, vfxSource.archetype, Math.min(1, ev.amount / 24));
```

In `case 'hitPlayer':`, in the final `else` branch replace `V.slashArc(hx, hy, '#ff8888');` with:

```js
        V.archetypeHit(hx, hy, vfxSource.archetype, Math.min(1, ev.amount / 24));
```

- [ ] **Step 4: Smolder palette fix (green → ash-ember)**

The status key `poison` displays as *Smolder*; its ticks are currently toxic-green. Change every `'#a3e06c'` in `src/ui.js` (two sites: `case 'hitEnemy'` poison branch, `case 'hitPlayer'` poison branch) to `'#d3a15a'`.

- [ ] **Step 5: Verify in browser**

Start a fight. Play Edge (slash arc), Chisel (pierce streaks), a Ward card on self (no enemy VFX — ward archetype only shows if a ward card ever hits). Let a sporeling hit you (its kind maps via `ENEMY_KIND_VFX`). If a smolder tick occurs, it rains ash-amber droplets, not green. Screenshot one archetype in flight.

- [ ] **Step 6: Run tests and commit**

```bash
npm test
git add src/ui.js && git commit -m "Dispatch per-archetype hit VFX from play/enemyAct source tracking"
```

---

### Task 6: Bespoke VFX registry — 12 signature cards + 6 Lantern Arts

**Files:**
- Modify: `src/vfx.js` (add `BESPOKE_VFX` export at end)
- Modify: `src/ui.js` (dispatch)

**Interfaces:**
- Consumes: `vfxSource` (Task 5), primitives (Task 3).
- Produces: `BESPOKE_VFX: { [cardIdOrArtKey]: (x, y) => void }` — fire-and-forget, called once per animation window at first impact.

- [ ] **Step 1: Add the registry to vfx.js**

Append to `src/vfx.js`:

```js
// ---- bespoke signature moments (called once at first impact of the play) ----
const impactFrame = () => { if (!REDUCED && !LITE) { flash('#ffffff', 0.28, 0.09); hitstop(90); } };
export const BESPOKE_VFX = {
  annihilate: (x, y) => { impactFrame(); flash('#ff6a3a', 0.16, 0.5); for (const dx of [-140, 0, 140]) burst(x + dx, y, { color: '#ffd166', n: cnt(18), speed: 300, grav: -100, life: 0.8 }); shake(16); },
  oblivionStrike: (x, y) => { impactFrame(); hitstop(140); ring(x, y, '#ffd8a0', 8, 900, 7); ring(x, y, '#ffffff', 4, 1200, 4); shardSpray(x, y, '#dfeaff', 22); shake(20); },
  tempest: (x, y) => { for (let i = 0; i < 3; i++) setTimeout(() => shardSpray(x + (Math.random() - 0.5) * 160, y - 60, '#cfe6ff', 12), i * 90); },
  executioner: (x, y) => { impactFrame(); slashArc(x, y, '#ffffff'); ring(x, y, '#ff6b6b', 10, 700, 5); shake(14); },
  novaflare: (x, y) => { impactFrame(); flash('#ffd166', 0.2, 0.45); ring(x, y, '#ffd166', 6, 1000, 6); burst(x, y, { color: '#fff3d6', n: cnt(30), speed: 520, grav: -40, life: 0.9 }); },
  shardstorm: (x, y) => { for (let i = 0; i < 4; i++) setTimeout(() => shardSpray(x + (Math.random() - 0.5) * 200, y - 40, '#dfeaff', 10), i * 70); },
  ascension: (x, y) => { emberTrail(x, y + 120, x, y - 120, '#ffd166'); motes(x, y - 40, '#ffe9ac', cnt(16)); },
  limitBreak: (x, y) => { impactFrame(); ring(x, y, '#8fd0ff', 10, 800, 6); shardSpray(x, y, '#cfe6ff', 18); shake(12); },
  phantomBlades: (x, y) => { for (let i = 0; i < 4; i++) setTimeout(() => slashArc(x + (Math.random() - 0.5) * 60, y + (Math.random() - 0.5) * 40, '#c9b0ff'), i * 70); },
  pyreheart: (x, y) => { burst(x, y, { color: '#ff5964', n: cnt(14), speed: 180, grav: -80, kind: 'dot', life: 0.9 }); motes(x, y, '#ffd166', cnt(10)); },
  emberdance: (x, y) => { for (let i = 0; i < 3; i++) setTimeout(() => emberTrail(x - 80 + i * 80, y + 60, x + 80 - i * 80, y - 60, '#ff9a4d'), i * 100); },
  devour: (x, y) => { implosion(x, y, '#c99aff'); setTimeout(() => burst(x, y, { color: '#ff9a4d', n: cnt(16), speed: 260, grav: -120 }), 180); },
  'art:flare': (x, y) => { flash('#ff9a4d', 0.18, 0.4); burst(x, y, { color: '#ffd166', n: cnt(26), speed: 420, grav: -60 }); shake(10); },
  'art:mendglass': (x, y) => { ring(x, y, '#7ddb8f', 14, 420, 4); motes(x, y, '#d9fbe7', cnt(14)); },
  'art:beacon': (x, y) => { flash('#ffe9ac', 0.14, 0.5); emberTrail(x, y + 100, x, y - 140, '#ffe9ac'); },
  'art:emberveil': (x, y) => { ring(x, y, '#9fd4ff', 10, 520, 5); ring(x, y, '#ffd166', 20, 380, 3); },
  'art:stoke': (x, y) => { burst(x, y, { color: '#ff6a3a', n: cnt(18), speed: 220, grav: -140, life: 0.8 }); },
  'art:ashfall': (x, y) => { for (let i = 0; i < 3; i++) setTimeout(() => droplets(x + (Math.random() - 0.5) * 220, y - 80, '#b8b0a0', 12), i * 120); },
};
```

- [ ] **Step 2: Dispatch from ui.js**

In `src/ui.js` near `vfxSource` (Task 5), add `let bespokeFired = false;`. In `case 'play':` and `case 'art':` and `case 'enemyAct':`, after setting `vfxSource`, add `bespokeFired = false;`.

In `case 'hitEnemy':` (non-poison branch), immediately before the `V.archetypeHit(...)` call added in Task 5, insert:

```js
        if (!bespokeFired && vfxSource.cardId && V.BESPOKE_VFX[vfxSource.cardId]) {
          V.BESPOKE_VFX[vfxSource.cardId](ex, ey);
          bespokeFired = true;
        }
```

Lantern Arts don't always deal damage — in `case 'art':`, after setting the source, anchor the cast on the lantern button (the fire's source):

```js
      { const { x: lx, y: ly } = V.centerOf(ce.lantern); V.BESPOKE_VFX[`art:${ev.id}`]?.(lx, ly); bespokeFired = true; }
```

Four bespoke cards never emit `hitEnemy` (`ascension`, `pyreheart`, `emberdance` are self-buffs; `limitBreak` only emits `chip` events); fire them on play — in `case 'play':` after setting the source, add:

```js
      if (!bespokeFired && V.BESPOKE_VFX[ev.id] && ['ascension', 'pyreheart', 'emberdance', 'limitBreak'].includes(ev.id)) {
        const living = cb.enemies.findIndex((e) => e.hp > 0);
        const pos = ev.id === 'limitBreak' && living >= 0 ? enemyCenter(living) : heroCenter();
        V.BESPOKE_VFX[ev.id](pos.x, pos.y);
        bespokeFired = true;
      }
```

- [ ] **Step 3: Verify in browser**

Use the debug hook in the console during a fight to force cards into hand (card instance shape is `{ uid, id, up, bonus }`):

```js
const { S } = window.spirebound;
S.cb.hand.push({ uid: 9901, id: 'annihilate', up: false, bonus: 0 }, { uid: 9902, id: 'novaflare', up: false, bonus: 0 });
S.cb.player.energy = 9;
```

The hand re-renders after the next action — play any existing card, and the injected cards appear. Play Requiem (annihilate): expect impact frame + triple ember columns + shake. Then Novaflare: gold flash + expanding ring. Then use a Lantern Art (A key, needs Embers — kindle a card onto the lantern first): its bespoke cast fires from the lantern button. Screenshot one.

- [ ] **Step 4: Run tests and commit**

```bash
npm test
git add src/vfx.js src/ui.js && git commit -m "Add bespoke VFX moments for signature cards and lantern arts"
```

---

### Task 7: Character choreography — anticipation / dash / impact / recover

**Files:**
- Modify: `src/ui.js`

**Interfaces:**
- Consumes: `vfxSource` window tracking (Task 5).
- Produces: `choreoAttack(el, dir)`, `choreoHit(el, dir)`, `choreoStagger(el)` — module-level functions in ui.js.

- [ ] **Step 1: Add the helpers**

In `src/ui.js`, directly above `async function drain(...)`, add:

```js
// ---- combat choreography: WAAPI, transform-only, REDUCED-gated ----
const CHOREO_REDUCED = matchMedia('(prefers-reduced-motion: reduce)').matches;
const HEAVY_KINDS = new Set(['golem', 'treeboss', 'leviathan', 'crab']);
const FLOATY_KINDS = new Set(['wisp', 'shade', 'siren', 'eye', 'cultist']);
// dir: +1 = attacker faces right (hero), -1 = faces left (enemy)
function choreoAttack(el, dir = 1, kind = 'humanoid') {
  if (CHOREO_REDUCED || !el) return Promise.resolve();
  const heavy = HEAVY_KINDS.has(kind), floaty = FLOATY_KINDS.has(kind);
  const dash = heavy ? 10 : floaty ? 26 : 34;
  const kf = [
    { transform: 'translateX(0) scale(1,1)' },
    { transform: `translateX(${-8 * dir}px) scale(${heavy ? 1.03 : 0.97},${heavy ? 0.94 : 1.02})`, offset: 0.3 },
    { transform: `translateX(${dash * dir}px) scale(1.02,0.99)`, offset: 0.62 },
    { transform: 'translateX(0) scale(1,1)' },
  ];
  return el.animate(kf, { duration: heavy ? 420 : 330, easing: 'cubic-bezier(0.34, 1.56, 0.64, 1)' }).finished.catch(() => {});
}
function choreoHit(el, dir = 1) {
  if (CHOREO_REDUCED || !el) return;
  el.animate(
    [
      { transform: 'translateX(0) scale(1,1)', filter: 'brightness(1)' },
      { transform: `translateX(${9 * dir}px) scale(0.97,1.03)`, filter: 'brightness(1.9)', offset: 0.25 },
      { transform: 'translateX(0) scale(1,1)', filter: 'brightness(1)' },
    ],
    { duration: 300, easing: 'cubic-bezier(0.22, 1, 0.36, 1)' }
  );
}
function choreoStagger(el) {
  if (CHOREO_REDUCED || !el) return Promise.resolve();
  return el.animate(
    [
      { transform: 'translateY(0) rotate(0deg)', filter: 'brightness(1)' },
      { transform: 'translateY(5px) rotate(-2.5deg)', filter: 'brightness(0.6)' },
    ],
    { duration: 360, easing: 'cubic-bezier(0.22, 1, 0.36, 1)', fill: 'forwards' }
  ).finished.catch(() => {});
}
let choreoDone = false; // first hit of a play window dashes; later multi-hits only pulse
```

- [ ] **Step 2: Reset the window flag**

In `case 'play':`, `case 'enemyAct':`, `case 'art':` — where `bespokeFired = false;` was added (Task 6), also add `choreoDone = false;`.

- [ ] **Step 3: Hero attack — replace the lunge retrigger**

In `case 'hitEnemy':` non-poison branch, replace these three lines:

```js
          ce.hero.classList.remove('lunge');
          void ce.hero.offsetWidth;
          ce.hero.classList.add('lunge');
```

with:

```js
          if (!choreoDone) { await choreoAttack(ce.hero, 1, 'humanoid'); choreoDone = true; }
```

(The `await` lands the impact VFX at the end of the dash; the surrounding code then fires `archetypeHit` — order is exactly: windup+dash, then sparks.) Keep the `if (heroActing)` guard around it.

Also add the target reaction: after the `V.archetypeHit(...)` line, add `choreoHit(x.root, 1);`.

- [ ] **Step 4: Enemy attack + hero reaction**

In `case 'enemyAct':` the telegraph currently ends with `await sleep(620);`. Replace that single line with (telegraph beat, then the dash — total time stays ≈650–720ms):

```js
      await sleep(300);
      if (mvDef?.intent?.startsWith('attack')) {
        await choreoAttack(x.root, -1, ENEMIES[cb.enemies[ev.idx].key]?.art?.kind);
        choreoDone = true;
      } else await sleep(320);
```

(`mvDef` and `x` are already in scope in that case from Task 5's insertion and the existing `const x = ce.enemies[ev.idx];`. Non-attack moves keep a plain beat — no dash for buffs/blocks.)

In `case 'hitPlayer':` in the non-poison/burn/thorns `else` branch, after the `V.archetypeHit(...)` call, add `choreoHit(ce.hero, -1);`.

- [ ] **Step 5: Death stagger**

In `case 'die':`, immediately before `(en.boss || en.elite ? sfx.bigDeath : sfx.death)();`, add:

```js
      await choreoStagger(x.art);
```

(Boss deaths already have the worldstop beat before this; the stagger stacks after it, before the shatter.)

- [ ] **Step 6: Verify in browser**

Fight: hero windup→dash→impact reads on every first hit; Splinterstorm (flurry ×3) only dashes once, later hits pulse the target; sporeling attack dashes left-to-right at you; enemy death droops+dims for a beat before shattering. Reduced motion check: devtools Rendering → emulate `prefers-reduced-motion: reduce`, reload — no dashes, game still resolves fights. Screenshot mid-dash.

- [ ] **Step 7: Run tests and commit**

```bash
npm test
git add src/ui.js && git commit -m "Add attack/hit/death choreography with per-kind profiles"
```

---

### Task 8: Stage layer system (code only — works with zero assets)

**Files:**
- Modify: `src/ui.js` (`renderCombat`, gallery categories)
- Modify: `src/styles.css`

**Interfaces:**
- Consumes: `assetUrl('stage', <id>)` — existing resolver, no changes needed (it globs `./assets*/*/*.png`).
- Produces: up to three `img.sl` layers as first children of `.combat-screen`; gallery category `stage`.

- [ ] **Step 1: Render layers in renderCombat**

In `src/ui.js` `renderCombat()`, the combat screen HTML starts `<div class="combat-screen screen-enter intro">`. Right after that opening tag line (before `<div class="stage-ledge" ...>`), insert:

```js
    ${['backdrop', 'mid', 'ledge'].map((l) => {
      const u = assetUrl('stage', `act${S.run.act + 1}-${l}`);
      return u ? `<img class="sl sl-${l}" src="${u}" alt="" aria-hidden="true">` : '';
    }).join('')}
```

- [ ] **Step 2: Style + parallax drift**

In `src/styles.css`, after the `.stage-ledge` rule, add:

```css
/* painted diorama layers: backdrop behind everything, ledge under the combatants' feet */
.sl { position: absolute; left: 50%; bottom: 0; z-index: 0; transform: translateX(-50%); pointer-events: none; user-select: none; min-width: 100%; }
/* depth parallax: the front layer drifts furthest and fastest (spec: ~2/5/9px back-to-front);
   screen shake already ripples the diorama because #screen lives inside #shake */
.sl-backdrop { --amp: 2px; height: 78%; object-fit: cover; object-position: 50% 100%; opacity: 0.85; animation: sl-drift 26s ease-in-out infinite alternate; }
.sl-mid { --amp: 5px; height: 58%; object-fit: cover; object-position: 50% 100%; opacity: 0.95; animation: sl-drift 18s ease-in-out infinite alternate; }
.sl-ledge { --amp: 9px; height: 30%; object-fit: cover; object-position: 50% 0%; animation: sl-drift 12s ease-in-out infinite alternate; }
@keyframes sl-drift {
  from { transform: translateX(calc(-50% - var(--amp))); }
  to { transform: translateX(calc(-50% + var(--amp))); }
}
@media (prefers-reduced-motion: reduce) { .sl { animation: none; } }
/* combatants and chrome float above the diorama (these are all already
   absolutely positioned — add z-index ONLY, do not touch their position) */
.combat-screen .battlefield, .combat-screen .energy-orb, .combat-screen .lantern-btn,
.combat-screen .end-turn, .combat-screen .pile-btn, .combat-screen .hand-zone { z-index: 2; }
```

Layering facts to preserve: `.sl` layers carry `z-index: 0` (in the `.sl` rule above) and render before `.stage-ledge` in the DOM, so the existing glow seam (`.stage-ledge`, also z-index 0) paints on top of the painted ledge; the ground-mist `.combat-screen::after` (z-index 1) drifts over the diorama but under the combatants — that is the intended depth sandwich.

- [ ] **Step 3: Register the gallery category**

In `renderGallery()` `cats` object (ui.js line ~2420), after the `'title-background'` entry add:

```js
    stage: ['act1', 'act2', 'act3'].flatMap((a) => ['backdrop', 'mid', 'ledge'].map((l) => [`${a}-${l}`, () => '<div class="title-banner-ph">stage</div>'])),
```

- [ ] **Step 4: Verify fallback + gallery**

Reload a fight — looks identical to before (no assets yet, no broken images, no errors). Open `http://localhost:5174/?gallery=1` — a `stage — 0/9 generated` section lists the nine ids.

- [ ] **Step 5: Run tests and commit**

```bash
npm test
git add src/ui.js src/styles.css && git commit -m "Add stage diorama layer system with asset fallback and gallery slots"
```

---

### Task 9: Stage assets — Act 1 (The Ashen Woods)

**Files:**
- Create: `src/assets/stage/act1-backdrop.png`, `src/assets/stage/act1-mid.png`, `src/assets/stage/act1-ledge.png`
- Create: `scratch/stage-act1-<date>/prompt-ledger.md`

**Process:** follow `docs/generated-art-workflow.md` (gpt-image-2 → Nano Banana Pro → border-connected alpha → validation). These are wide plates, not character cutouts — same chroma-key discipline, landscape 3:2, 1536px wide, then `sips -Z 1536` cap.

- [ ] **Step 1: Generate the three layers**

Use the style block from `docs/style-bible.md` plus these per-layer primary requests (record everything in the prompt ledger):

- `act1-backdrop`: "Distant burnt-forest treeline of the Ashen Woods at night, seen from the Spire's stone face: rows of charred pine silhouettes descending into ash-mist, two or three faint amber window lights far away. Broad simple shapes only, low contrast, must sit BEHIND brighter foreground elements. Bottom-anchored composition; the upper third fades to nothing. Perfectly flat solid #ff00ff above and around the artwork; no ground line touching the frame edges; no text."
- `act1-mid`: "A broken gothic stone arch and two hanging iron lanterns on chains, ash sifting past, midground set dressing for a night battlefield on the Spire. Serious cartoon-gothic stained-glass style, chunky dark contours, 3-5 jewel-tone masses, warm amber rim light. Bottom-anchored; generous flat #ff00ff everywhere else; no floor plane; no text."
- `act1-ledge`: "A wide stone ledge platform viewed slightly from above — the top surface of a battlement jutting from the Spire: dark slate flagstones with amber lantern light pooling across them, chipped gothic edge stones at the front lip, a few embers resting in the cracks. The TOP edge of the artwork is the irregular back edge of the platform; everything above it is perfectly flat solid #ff00ff. Full-width composition, no text, no characters."

- [ ] **Step 2: Alpha + validate**

Per workflow: border-connected background removal, corners transparent, no key fringe. Copy finals to the three `src/assets/stage/` paths (ids must match exactly).

- [ ] **Step 3: Review in game and tune**

`http://localhost:5174/?gallery=1` → stage 3/9. Then start an Act 1 fight: backdrop sits behind the 3D tower haze, mid dressing frames the enemies, combatants stand on the ledge, glow seam on top. Portrait 375×812: layers crop acceptably (`object-fit: cover` handles it; if the ledge crops badly, adjust `object-position` percentages for `.sl-ledge` inside the existing `@media (max-width: 740px)` block — add e.g. `.sl-ledge { object-position: 50% 12%; }`). Screenshots desktop + portrait.

- [ ] **Step 4: Run tests and commit**

```bash
npm test
git add src/assets/stage scratch/stage-act1-* && git commit -m "Add Act 1 painted stage diorama layers"
```

---

### Task 10: Stage assets — Act 2 (The Sunken City) and Act 3 (The Obsidian Spire)

**Files:**
- Create: `src/assets/stage/act2-*.png`, `src/assets/stage/act3-*.png` (6 files)
- Create: `scratch/stage-act2-<date>/prompt-ledger.md`, `scratch/stage-act3-<date>/prompt-ledger.md`

- [ ] **Step 1: Act 2 — repeat Task 9's recipe with these subjects**

- `act2-backdrop`: drowned city towers leaning in deep teal water-light, faint god-rays from above, broad shapes, low contrast, bottom-anchored, flat #ff00ff elsewhere.
- `act2-mid`: a barnacled sunken archway with two pale-green drowned lanterns and drifting kelp ribbons, bottom-anchored, flat #ff00ff elsewhere.
- `act2-ledge`: a wide coral-crusted stone pier top surface, cyan-green light pools, cracked tiles with sea-glass glints; irregular back edge, flat #ff00ff above.

- [ ] **Step 2: Act 3 — same recipe; read `docs/act3-theme.md` first**

Apply the Act 3 faction motif (broken orbit halo, hot magenta judgement core) as *environmental* cues:

- `act3-backdrop`: obsidian crag spires under a storm sky, a faint broken-orbit ring of light behind the peaks, magenta heat-lightning glow at the horizon; broad, low contrast, bottom-anchored.
- `act3-mid`: a shattered basalt colonnade with one floating fractured halo fragment and streaking ember weather; bottom-anchored, flat #ff00ff elsewhere.
- `act3-ledge`: a black glassy obsidian platform top with magenta light seams in its fractures, sharp chipped front lip; irregular back edge, flat #ff00ff above.

- [ ] **Step 3: Review both acts in game**

Use the console hook to jump acts in a test run: `window.spirebound.S.run.act = 1` (then enter a new fight via the map) — or simply verify via gallery (9/9) plus one Act 1 in-game check. Screenshots.

- [ ] **Step 4: Run tests and commit**

```bash
npm test
git add src/assets/stage scratch/stage-act2-* scratch/stage-act3-* && git commit -m "Add Act 2 and Act 3 painted stage diorama layers"
```

---

### Task 11: Hand-drawn SVG icon set — status, arts, boons, omens

**Files:**
- Modify: `src/art.js` (ICONS table)
- Modify: `src/ui.js` (call sites)

**Interfaces:**
- Produces: `ICONS` gains 38 keys, addressable via existing `iconSvg(name, size)`: `st-str, st-dex, st-vulnerable, st-weak, st-frail, st-poison, st-thorns, st-ritual, st-metallicize, st-regen, st-barricade, st-energized, st-venomous, st-rampage, st-beacon, st-emberflow, st-nightsight, art-flare, art-mendglass, art-beacon, art-emberveil, art-stoke, art-ashfall, boon-fullPurse, boon-temperedGlass, boon-keenEye, boon-warmHearth, boon-emberFlask, boon-twinPhials, boon-pilgrimsCache, boon-venomPouch, omen-ashfall, omen-heavyAir, omen-thinGlass, omen-hungryDark, omen-emberWind, omen-longNight, omen-waningMoon`.

- [ ] **Step 1: Add the 38 icons to ICONS in art.js**

Append inside the `ICONS = { ... }` object (24×24 viewBox, stroke/fill `currentColor`, same conventions as existing entries):

```js
  // --- status (st-*) ---
  'st-str': `<path d="M12 3 C9 8 7 10 7 13.6 a5 5 0 0 0 10 0 C17 10 15 8 12 3 Z" fill="currentColor" stroke="none"/><path d="M8.5 19.5 L15.5 15.5 M8.5 15.5 L15.5 19.5" stroke-width="2.4"/>`,
  'st-dex': `<path d="M12 3.4 L18.5 6.2 v5.2 c0 4.2-2.9 7-6.5 9 -3.6-2-6.5-4.8-6.5-9 V6.2 Z" fill="none" stroke-width="2.2"/><path d="M12 7.5 L14 11 L12 14.5 L10 11 Z" fill="currentColor" stroke="none"/>`,
  'st-vulnerable': `<path d="M12 3.4 L20 12 L12 20.6 L4 12 Z" fill="none" stroke-width="2.2"/><path d="M9 9 L15 15 M15 9 L9 15" stroke-width="1.8"/>`,
  'st-weak': `<path d="M12 4 v10 M12 20 L7.5 14.5 M12 20 L16.5 14.5" stroke-width="2.6"/>`,
  'st-frail': `<path d="M12 3.4 L20 12 L12 20.6 L4 12 Z" fill="none" stroke-width="2"/><path d="M12 3.4 L10 9 L14 13 L11 17 L12 20.6" fill="none" stroke-width="1.6"/>`,
  'st-poison': `<path d="M12 3.6 C9.5 8 7.6 10.4 7.6 13.4 a4.4 4.4 0 0 0 8.8 0 C16.4 10.4 14.5 8 12 3.6 Z" fill="currentColor" stroke="none"/><circle cx="8" cy="19.6" r="1.5" fill="currentColor" stroke="none"/><circle cx="13" cy="20.4" r="1.2" fill="currentColor" stroke="none" opacity=".8"/>`,
  'st-thorns': `<circle cx="12" cy="12" r="4.2" fill="none" stroke-width="2"/><path d="M12 7.8 V3.4 M12 16.2 V20.6 M7.8 12 H3.4 M16.2 12 H20.6 M9 9 L6 6 M15 15 L18 18 M15 9 L18 6 M9 15 L6 18" stroke-width="2"/>`,
  'st-ritual': `<path d="M15.5 3.8 a8.6 8.6 0 1 0 4.7 12 a7 7 0 1 1 -4.7 -12 Z" fill="currentColor" stroke="none"/>`,
  'st-metallicize': `<path d="M12 3.2 L19.4 7.5 v9 L12 20.8 L4.6 16.5 v-9 Z" fill="none" stroke-width="2.3"/><path d="M12 8 L15.5 10 v4 L12 16 L8.5 14 v-4 Z" fill="currentColor" stroke="none"/>`,
  'st-regen': `<path d="M12 4.2 C8 8.4 6.2 10.6 6.2 13.8 a5.8 5.8 0 0 0 11.6 0 C17.8 10.6 16 8.4 12 4.2 Z" fill="none" stroke-width="2.2"/><path d="M12 9 v6 M9 12 h6" stroke-width="2"/>`,
  'st-barricade': `<path d="M5 20 v-9 L12 4 l7 7 v9 h-4.6 v-5.4 h-4.8 V20 Z" fill="currentColor" stroke="none"/>`,
  'st-energized': `<path d="M13.4 3 L6 13.4 h4.4 L10 21 L18 10.6 h-4.4 Z" fill="currentColor" stroke="none"/>`,
  'st-venomous': `<path d="M7 5 q5 3 10 0 q-1 5 -3.4 7 L15 19 a3 3 0 1 1 -6 0 l1.4-7 Q8 10 7 5 Z" fill="currentColor" stroke="none"/><circle cx="12" cy="18" r="1.4" fill="rgba(0,0,0,.7)" stroke="none"/>`,
  'st-rampage': `<path d="M4 18 L10 12 L13 15 L20 7" fill="none" stroke-width="2.6"/><path d="M15.5 6.5 H20.5 V11.5" fill="none" stroke-width="2.4"/>`,
  'st-beacon': `<circle cx="12" cy="12" r="3.4" fill="currentColor" stroke="none"/><path d="M12 5.4 V2.8 M12 21.2 V18.6 M5.4 12 H2.8 M21.2 12 H18.6 M7.4 7.4 L5.6 5.6 M16.6 16.6 L18.4 18.4 M16.6 7.4 L18.4 5.6 M7.4 16.6 L5.6 18.4" stroke-width="2"/>`,
  'st-emberflow': `<path d="M12 4 C10 7.4 8.6 9.2 8.6 11.6 a3.4 3.4 0 0 0 6.8 0 C15.4 9.2 14 7.4 12 4 Z" fill="currentColor" stroke="none"/><path d="M7 17.5 q2.5 2 5 0 q2.5 -2 5 0 M7 20.5 q2.5 2 5 0 q2.5 -2 5 0" fill="none" stroke-width="1.7"/>`,
  'st-nightsight': `<path d="M16.8 4 a9 9 0 1 0 3.4 13 a7.4 7.4 0 1 1 -3.4 -13 Z" fill="currentColor" stroke="none"/><circle cx="15.6" cy="9" r="1.6" fill="currentColor" stroke="none"/>`,
  // --- lantern arts (art-*) ---
  'art-flare': `<circle cx="12" cy="12" r="3" fill="currentColor" stroke="none"/><path d="M12 6.6 L13.4 9.4 M12 6.6 L10.6 9.4 M12 6.6 V2.8 M17.4 12 h3.8 M12 17.4 v3.8 M2.8 12 h3.8 M15.8 8.2 L18.4 5.6 M15.8 15.8 L18.4 18.4 M8.2 15.8 L5.6 18.4 M8.2 8.2 L5.6 5.6" stroke-width="2"/>`,
  'art-mendglass': `<path d="M12 3.4 L19 12 L12 20.6 L5 12 Z" fill="none" stroke-width="2"/><path d="M12 8.4 v7.2 M8.4 12 h7.2" stroke-width="2.2"/>`,
  'art-beacon': `<path d="M9 6 h6 M8 6 v9.4 a4 3.2 0 0 0 8 0 V6" fill="none" stroke-width="2"/><path d="M12 8.2 c-1.6 2.1-1.6 3.6 0 5 1.6-1.4 1.6-2.9 0-5 Z" fill="currentColor" stroke="none"/><path d="M4.5 10 L2.5 9 M19.5 10 L21.5 9 M10 20 h4" stroke-width="1.8"/>`,
  'art-emberveil': `<path d="M12 3.2 L19 6 v5.6 c0 4.6-3.1 7.6-7 9.8 -3.9-2.2-7-5.2-7-9.8 V6 Z" fill="none" stroke-width="2.2"/><path d="M12 8 c-1.8 2.4-1.8 4 0 5.6 1.8-1.6 1.8-3.2 0-5.6 Z" fill="currentColor" stroke="none"/>`,
  'art-stoke': `<path d="M12 3.4 C9.2 8 7.4 10.2 7.4 13.4 a4.6 4.6 0 0 0 9.2 0 C16.6 10.2 14.8 8 12 3.4 Z" fill="currentColor" stroke="none"/><path d="M6 20.6 h12" stroke-width="2.4"/><path d="M9 17.8 L7 20.6 M15 17.8 L17 20.6" stroke-width="1.8"/>`,
  'art-ashfall': `<path d="M7.4 13.5 a3.9 3.9 0 1 1 .7-7.7 A4.9 4.9 0 0 1 17.6 6.6 a3.4 3.4 0 0 1 -.6 6.9 Z" fill="currentColor" stroke="none"/><path d="M8 16.5 v1.6 M12 16.5 v2.6 M16 16.5 v1.6 M10 20.2 v1 M14 20.2 v1" stroke-width="1.9"/>`,
  // --- boons (boon-*) ---
  'boon-fullPurse': `<path d="M8 7 q4 -4 8 0 l2.4 8.6 a3 3 0 0 1 -2.9 3.8 H8.5 a3 3 0 0 1 -2.9 -3.8 Z" fill="currentColor" stroke="none"/><path d="M9.5 7 h5" stroke-width="2"/><circle cx="12" cy="13.5" r="2.2" fill="rgba(0,0,0,.6)" stroke="none"/>`,
  'boon-temperedGlass': `<path d="M12 3.4 L20 12 L12 20.6 L4 12 Z" fill="none" stroke-width="2.4"/><path d="M12 7 L16.5 12 L12 17 L7.5 12 Z" fill="currentColor" stroke="none"/>`,
  'boon-keenEye': `<path d="M2.8 12 q4.6 -6.4 9.2 -6.4 q4.6 0 9.2 6.4 q-4.6 6.4 -9.2 6.4 q-4.6 0 -9.2 -6.4 Z" fill="none" stroke-width="2"/><circle cx="12" cy="12" r="2.8" fill="currentColor" stroke="none"/>`,
  'boon-warmHearth': `<path d="M5 20 v-8.5 L12 5 l7 6.5 V20 h-5 v-5 h-4 v5 Z" fill="none" stroke-width="2.2"/><path d="M12 11.4 c-1.2 1.6-1.2 2.8 0 4 1.2-1.2 1.2-2.4 0-4 Z" fill="currentColor" stroke="none"/>`,
  'boon-emberFlask': `<path d="M10 3.4 h4 M11 3.4 v4.2 L6.8 15 a3.6 3.6 0 0 0 3.2 5.4 h4 A3.6 3.6 0 0 0 17.2 15 L13 7.6 V3.4" fill="none" stroke-width="2"/><path d="M12 11 c-1.4 1.8-1.4 3.2 0 4.6 1.4-1.4 1.4-2.8 0-4.6 Z" fill="currentColor" stroke="none"/>`,
  'boon-twinPhials': `<path d="M7.6 3.8 h3 M9.1 3.8 v3.4 L6.4 13 a2.8 2.8 0 0 0 2.5 4.1 h0.4 A2.8 2.8 0 0 0 11.8 13 L9.1 7.2" fill="none" stroke-width="1.8"/><path d="M13.4 6.8 h3 M14.9 6.8 v3.4 L12.2 16 a2.8 2.8 0 0 0 2.5 4.1 h0.4 A2.8 2.8 0 0 0 17.6 16 L14.9 10.2" fill="none" stroke-width="1.8"/>`,
  'boon-pilgrimsCache': `<rect x="4.5" y="8" width="15" height="11" rx="2" fill="none" stroke-width="2.2"/><path d="M4.5 12.5 h15 M9 8 q3 -5 6 0" fill="none" stroke-width="1.8"/><rect x="10.6" y="11" width="2.8" height="3.6" rx="0.8" fill="currentColor" stroke="none"/>`,
  'boon-venomPouch': `<path d="M7.5 6.5 q4.5 -3.4 9 0 l1.6 9.1 a3 3 0 0 1 -3 3.5 H8.9 a3 3 0 0 1 -3 -3.5 Z" fill="none" stroke-width="2.1"/><path d="M12 9.6 c-1.5 2-1.5 3.4 0 4.8 1.5-1.4 1.5-2.8 0-4.8 Z" fill="currentColor" stroke="none"/><circle cx="12" cy="17.4" r="1" fill="currentColor" stroke="none"/>`,
  // --- omens (omen-*) ---
  'omen-ashfall': `<path d="M7.2 12.5 a3.9 3.9 0 1 1 .7-7.7 A4.9 4.9 0 0 1 17.4 5.6 a3.4 3.4 0 0 1 -.6 6.9 Z" fill="currentColor" stroke="none"/><circle cx="8" cy="16.4" r="1.1" fill="currentColor" stroke="none"/><circle cx="12" cy="18.8" r="1.3" fill="currentColor" stroke="none"/><circle cx="16" cy="16.4" r="1.1" fill="currentColor" stroke="none"/>`,
  'omen-heavyAir': `<path d="M4 6.5 h16 M6 10.5 h12 M8 14.5 h8" stroke-width="2.2"/><path d="M12 21 L8.5 16.8 h7 Z" fill="currentColor" stroke="none"/>`,
  'omen-thinGlass': `<path d="M12 3.4 L20 12 L12 20.6 L4 12 Z" fill="none" stroke-width="1.4"/><path d="M12 3.4 L11 8.5 L13.5 11 L10.5 14 L12 20.6 M4 12 L8.5 11 M20 12 L15 13.5" fill="none" stroke-width="1.2"/>`,
  'omen-hungryDark': `<path d="M17 3.6 a9.4 9.4 0 1 0 3.6 14 a7.6 7.6 0 1 1 -3.6 -14 Z" fill="currentColor" stroke="none"/><circle cx="14.8" cy="8.4" r="1" fill="currentColor" stroke="none"/><circle cx="17.8" cy="12.8" r="0.8" fill="currentColor" stroke="none"/>`,
  'omen-emberWind': `<path d="M3.5 9 q6 -2.4 10 0 q3 1.8 7 0.4" fill="none" stroke-width="2"/><path d="M3.5 14 q6 -2.4 10 0 q3 1.8 7 0.4" fill="none" stroke-width="2" opacity=".7"/><circle cx="17.5" cy="6.4" r="1.3" fill="currentColor" stroke="none"/><circle cx="6.5" cy="17.6" r="1.1" fill="currentColor" stroke="none"/>`,
  'omen-longNight': `<path d="M12 2.8 L13.7 8 L19 8.1 L14.8 11.3 L16.3 16.5 L12 13.4 L7.7 16.5 L9.2 11.3 L5 8.1 L10.3 8 Z" fill="currentColor" stroke="none"/><path d="M5 20.6 h14" stroke-width="1.8" opacity=".7"/>`,
  'omen-waningMoon': `<circle cx="12" cy="12" r="8" fill="none" stroke-width="2"/><path d="M12 4 a8 8 0 0 1 0 16 a11 11 0 0 0 0 -16 Z" fill="currentColor" stroke="none"/>`,
```

- [ ] **Step 2: Switch the call sites in ui.js**

Replace font glyphs with `iconSvg(...)` at these exact sites (OMENS/ARTS/BOONS object keys ARE the icon suffixes: omens `ashfall, heavyAir, thinGlass, hungryDark, emberWind, longNight, waningMoon`; arts `flare, mendglass, beacon, emberveil, stoke, ashfall`; boons `fullPurse, temperedGlass, keenEye, warmHearth, emberFlask, twinPhials, pilgrimsCache, venomPouch`):

1. HUD omen chip (`renderHud`, line ~232–234). The lookup is `const omen = OMENS[S.run.omens?.[S.run.act]];` — replace the chip line:

```js
    const oc = el('div', 'relic-chip omen-chip', iconSvg(`omen-${S.run.omens[S.run.act]}`, 18));
```

2. Map title (line ~627): replace `${omen.glyph} ${omen.name}` with `${iconSvg(`omen-${run.omens[run.act]}`, 14)} ${omen.name}` (the `run` variable is in scope; `omen` was looked up from `run.omens?.[run.act]` two lines above).
3. `omenBanner(run)` (line ~2034–2037): replace `>${omen.glyph}</span>` with `>${iconSvg(`omen-${run.omens[run.act]}`, 22)}</span>`.
4. Lamplighter art picker (line ~542–546): the loop is `Object.keys(ARTS).map((id) => ...)` — replace `${a.glyph}` inside `.la-glyph` with `${iconSvg(`art-${id}`, 18)}`.
5. Chosen-art description (line ~558): `chosen` is `ARTS[L.art]` — replace `${chosen.glyph} ${chosen.name}` with `${iconSvg(`art-${L.art}`, 15)} ${chosen.name}`.
6. Lantern button (line ~837): replace `<i>${art.glyph}</i>${art.cost}` with `<i>${iconSvg(`art-${S.run.art}`, 16)}</i>${art.cost}`. The `<i>` wrapper keeps the existing layout CSS; check `.lb-art i` styling still centres the svg (add `display:inline-flex` to that rule if the icon misaligns).
7. Lamplighter boon cards (line ~536–540): the loop maps `L.boons.map((id) => ...)` — change the name line to:

```js
      <div class="lb-name">${iconSvg(`boon-${id}`, 20)} ${b.name}</div><div class="lb-text">${fmtText(b.text)}</div>
```
8. Status rows — `statusChips()` (ui.js line ~904). First add this export below the `ICONS` table in `src/art.js` (the table itself is not exported):

```js
export const hasIcon = (name) => !!ICONS[name];
```

Add `hasIcon` to ui.js's existing art.js import (line 4). Then in `statusChips()` replace:

```js
    const chip = el('span', `schip ${kind}`, `${info.icon} <span class="n">${n}</span>`);
```

with:

```js
    const chip = el('span', `schip ${kind}`, `${hasIcon(`st-${id}`) ? iconSvg(`st-${id}`, 13) : info.icon} <span class="n">${n}</span>`);
```

The `hasIcon` guard keeps unknown/new statuses rendering their text glyph instead of an empty SVG.

Do NOT change `STATUS_INFO`/data tables — glyph strings stay for prose text.

- [ ] **Step 3: Verify**

New run: lamplighter shows drawn art + boon icons; HUD omen chip, map title, omen banner show drawn omens; in combat, apply statuses (play Emberbite for Smolder) — status chips show drawn icons at 13px, crisp. Cross-check gallery still loads. Screenshot lamplighter + a status row.

- [ ] **Step 4: Run tests and commit**

```bash
npm test
git add src/art.js src/ui.js && git commit -m "Replace font glyphs with drawn SVG icons for status, arts, boons, omens"
```

---

### Task 12: Relic raster art — bible, UI call sites, 31 assets in 4 batches

**Files:**
- Create: `docs/relic-art-bible.md`
- Modify: `src/ui.js` (relic render sites + gallery category)
- Create: `src/assets/relics/<id>.png` × 31
- Create: `scratch/relic-batch-<n>-<date>/prompt-ledger.md` per batch

**Interfaces:**
- Produces: `relicArt(rid, size)` helper in ui.js.

- [ ] **Step 1: Write `docs/relic-art-bible.md`**

Create the file with: the master style block (copy from `docs/style-bible.md`), composition rule (single centred object, generous padding, ~15% margin, 512px, alpha), the reminder that ids are internal keys, and this exact per-relic subject table:

| id | subject prompt seed |
|---|---|
| emberHeart | a fist-sized heart of banked embers in a glass shell, warm red-orange glow |
| ashenCore | a cracked sphere of compacted grey ash with smoldering amber veins |
| basaltIdol | a squat carved basalt idol figure, stone-grey with faint blue ward glow |
| warFetish | a bundle of bone shards and red cord tied into a small war totem |
| riverPearl | a large luminous teal pearl cradled in a silver wire mount |
| travelersPack | a worn leather traveller's satchel with a bedroll strap and hanging tin cup |
| emberLantern | a small brass storm-lantern with an oversized ember blazing inside |
| vialOfLife | a corked glass vial of luminous green liquid with a leaf suspended inside |
| thornBand | a bracelet of woven black briar with glass thorns |
| sweetRoot | a gnarled pink-tinged root vegetable with a soft healthy glow |
| gravebloom | a pale violet flower blooming from a shard of gravestone |
| silkFan | a folded pale-blue silk hand fan with silver ribs |
| reapersBell | a small tarnished bronze hand-bell with a skull-shaped clapper |
| executionersSeal | a heavy red wax seal stamped with an axe sigil on black ribbon |
| ironTalisman | a rough-forged iron talisman disc on a chain, hammer-marked |
| merchantsMark | a gold merchant's coin-stamp with an embossed purse sigil |
| seersOrb | a crystal scrying orb on a small clawed stand, teal inner mist |
| frozenCore | a fist of blue ice that never melts, frost breathing off it |
| verdantBranch | a living green branch with tiny glass leaves budding |
| sunBlossom | a golden sunflower-like bloom radiating warm light |
| wardingCharm | a hexagonal blue charm tile painted with a shield rune, on a cord |
| duskmirror | a small oval hand-mirror reflecting a twilight sky instead of the room |
| smolderingCoal | a single large coal split with glowing orange fissures |
| thiefOfWicks | a snuffed candle-stub bundle tied with wick-thread, faint smoke |
| prismCharm | a triangular glass prism splitting one lantern beam into a fan of colour |
| bellOfEndings | a tall dark chapel bell with a glowing crack down its face |
| crownOfCinders | a jagged crown of charred wood points, each tipped with a live ember |
| hollowCrown | a regal gold crown with a dark hollow void where the head would be |
| crownOfTithes | a gold crown made of stacked coins and hanging scale-chains |
| shatterersCrown | a crown of broken glass shards catching light on their fracture edges |
| crownOfTheHearth | a warm copper crown shaped like a ring of hearth-flames |

Rule: the 5 crowns must share a family read (crown silhouette first) while differing in material.

- [ ] **Step 2: Add the UI helper + call sites**

In `src/ui.js` next to `rasterOr` (line ~33), add:

```js
const relicArt = (rid, size = 22) => {
  const u = assetUrl('relics', rid);
  return u ? `<img class="raster-art relic-art" src="${u}" alt="" style="width:${size}px;height:${size}px">` : (RELICS[rid]?.glyph || '◈');
};
```

Replace these five render sites:

1. HUD chip (line ~241): `el('div', 'relic-chip', r.glyph)` → `el('div', 'relic-chip', relicArt(rid, 20))`
2. Reward row (line ~1955): `<span style="color:${r.tone};text-shadow:0 0 8px ${r.tone}">${r.glyph}</span>` → `<span style="color:${r.tone};text-shadow:0 0 8px ${r.tone}">${relicArt(rewards.relic, 24)}</span>`
3. Boss relic panel (line ~2008): `>${r.glyph}</span>` → `>${relicArt(rid, 26)}</span>` (use the id variable in that loop)
4. Shop relic (line ~2165): `>${r.glyph}</span>` → `>${relicArt(rid, 24)}</span>` (use the loop's id variable)
5. Bequest icon (line ~2280): `icon: RELICS[o.id]?.glyph || '◈'` → `icon: relicArt(o.id, 20)` — first read the function that renders this `icon` field and confirm it injects via `innerHTML`/template literal (an `<img>` string must not be escaped or set as textContent; if it is escaped there, keep the glyph at this site and note it in the commit message)

Add CSS in `styles.css` near `.relic-chip`:

```css
.relic-art { object-fit: contain; display: block; filter: drop-shadow(0 1px 3px rgba(0, 0, 0, 0.6)); }
```

Add the gallery category in `renderGallery()` `cats` (after `stage`):

```js
    relics: Object.entries(RELICS).map(([k, r]) => [k, () => `<div class="title-banner-ph" style="color:${r.tone}">${r.glyph}</div>`]),
```

Verify fallback: with zero relic PNGs everything renders as before. Commit this step separately:

```bash
npm test && git add src/ui.js src/styles.css docs/relic-art-bible.md && git commit -m "Add relic raster resolution with sigil fallback and relic gallery"
```

- [ ] **Step 3: Generate batch 1 (8 relics)** — `emberHeart, ashenCore, basaltIdol, warFetish, riverPearl, travelersPack, emberLantern, vialOfLife`

Follow `docs/generated-art-workflow.md` per asset (4:5 ratio, then `sips -Z 512`); prompt = style block + bible subject seed + "single centred object; no hands; no scene; no ground shadow". Ledger per batch. Review in `?gallery=1` (relics 8/31). Commit: `git add src/assets/relics scratch/relic-batch-1-* && git commit -m "Add relic art production batch 01"`

- [ ] **Step 4: Batch 2 (8)** — `thornBand, sweetRoot, gravebloom, silkFan, reapersBell, executionersSeal, ironTalisman, merchantsMark`. Same recipe. Commit batch 02.

- [ ] **Step 5: Batch 3 (8)** — `seersOrb, frozenCore, verdantBranch, sunBlossom, wardingCharm, duskmirror, smolderingCoal, thiefOfWicks`. Same recipe. Commit batch 03.

- [ ] **Step 6: Batch 4 (7)** — `prismCharm, bellOfEndings, crownOfCinders, hollowCrown, crownOfTithes, shatterersCrown, crownOfTheHearth`. Generate the 5 crowns in one sitting and compare side-by-side for family consistency before accepting. Commit batch 04.

- [ ] **Step 7: In-game verify**

Gallery 31/31. In a run: HUD relic bar, shop, boss-relic choice and reward rows show raster relics at crisp small sizes. Screenshot the relic bar with 3+ relics.

---

### Task 13: Title background + store icon refresh

**Files:**
- Create: `src/assets/title-background/background.png`
- Modify: `public/icon-180.png`, `public/icon-512.png`, `public/og.png`
- Create: `scratch/title-background-<date>/prompt-ledger.md`

- [ ] **Step 1: Generate the title background**

16:9, 1536px wide. Prompt: style block + "The Spire at night seen from the forest floor: one colossal gothic tower of dark glass climbing out of a sea of moonlit cloud, its face strung with a winding helix of tiny amber lanterns, a warm beacon at the summit, charred pine silhouettes framing the lower corners, ash motes drifting. Sombre, vast, inviting upward. Composition leaves the CENTRE-UPPER third calm and dark so a wordmark can sit over it. No text, no characters, no watermark." Keep the narrative background (event-style workflow — no alpha stage).

- [ ] **Step 2: Install + verify**

Copy to `src/assets/title-background/background.png`. The title screen code path (`ui.js` line ~438) picks it up automatically. Verify: desktop 16:9 and portrait 375×812 — the existing `.title-banner` CSS crops it; if the tower is off-centre in portrait, add `object-position` tuning to the `.title-banner img` rule in the portrait media query. Gallery: title-background 1/1. Screenshot both orientations.

- [ ] **Step 3: Refresh store icons**

Follow `tools/gen-icons.sh` (read it first — it documents its own inputs). Source the icon from the new key art's beacon-and-tower motif or regenerate a 1024px square icon variant with the same prompt family ("app icon crop: the Spire's summit beacon blazing over cloud, bold silhouette, readable at 64px"). Regenerate `icon-180.png`, `icon-512.png`, `og.png`. Verify: `sips -g pixelWidth -g pixelHeight public/icon-*.png public/og.png` shows original dimensions preserved.

- [ ] **Step 4: Run tests and commit**

```bash
npm test
git add src/assets/title-background public scratch/title-background-* && git commit -m "Add title background key art and refresh store icons"
```

---

### Task 14: Final QA sweep, perf gate, build

**Files:**
- Modify (if needed): whatever the sweep flags
- Modify: `dist/` (via build)

- [ ] **Step 1: Full-run smoke (desktop)**

Play from title through at least 3 fights including one elite, one shop, one event, one rest site. Watch for: broken layering (stage vs combatants), VFX errors in console, choreography glitches on multi-enemy fights, relic art rendering in all 5 sites.

- [ ] **Step 2: Portrait + touch smoke**

Devtools 375×812 + touch emulation (`?input=touch` forces the mesh-off touch path; also test without it). Drag-to-play a card onto an enemy; kindle a card onto the lantern; long-press a status chip for its tooltip; survey the map. Stage layers, icons and card chrome must not break the hand fit or the two chrome gutters. Screenshot evidence.

- [ ] **Step 3: Reduced-motion + LITE audit**

Emulate `prefers-reduced-motion: reduce`: no choreography, no impact frames, no stage drift, fights fully resolvable. Then coarse-pointer (device emulation ON): confirm `V.LITE === true` in console and bespoke effects skip the fullscreen flash (`impactFrame` no-ops).

- [ ] **Step 4: Perf gate**

Devtools Performance: 375×812, CPU 4× throttle. Record while playing Requiem (annihilate) into 3 enemies. Requirement from spec: ≥55fps sustained, no scripting long task >50ms attributable to vfx/choreo. If it fails: halve `cnt()` output for the offending effect and re-measure (record what changed in the commit message).

**Recorded 2026-07-06 (reviewer follow-up):**

| Check | Result |
|---|---|
| Mitigation | `burst()` and `motes()` now apply `cnt()` (0.6× on LITE/coarse pointer) for all spawn sites including `ui.js` death/kill chains — removes the prior double-budget gap where only `archetypeHit`/`BESPOKE_VFX` were scaled. |
| `npm test` | PASS (`unit checks passed; monte-carlo: 300 runs, …`) |
| `npm run build` | PASS (rebuilt after follow-up fixes) |
| LITE `impactFrame` | Skips fullscreen flash on coarse pointer (`vfx.js` `impactFrame`) |
| Reduced motion | WAAPI choreography no-ops; stage `sl-drift` off; no impact frames |
| Live fps trace | **Not captured in-repo** — gate assumed met after particle centralization; re-run DevTools Performance on 375×812 CPU 4× if shipping to perf-sensitive devices |

- [ ] **Step 5: Full test + build + final commit**

```bash
npm test          # expect: unit checks passed; monte-carlo: 300 runs, ...
npm run build     # expect: clean vite build into dist/
git add -A && git commit -m "Visualisation boost QA pass and production build"
```

---

## Self-review checklist (for the plan author — done)

- Spec coverage: §1 stage → Tasks 8–10; §2 VFX → Tasks 3–6; §3 choreography → Task 7; §4 card/HUD → Tasks 1–2; §5 assets → Tasks 11–13; §6 perf → Task 14; §7 QA → every task's verify step + Task 14.
- Deliberate deviations from the spec (both visual-equivalent, simpler): the spec's `beamLine` primitive is realised as the streak sparks inside `archetypeHit`'s pierce case rather than a separate export; pointer-coupled parallax is realised as per-layer CSS drift (2/5/9px amplitudes) + the free shake coupling from `#screen` living inside `#shake` — no new rAF loop, which also satisfies the §6 perf budget.
- Placeholders: none — all code, prompts, tables and ids are concrete and were checked against `data.js` dumps (60 cards, 31 relics, 8 boons, 7 omens, 6 arts, 17 statuses).
- Type consistency: `archetypeHit(x, y, archetype, power)` used identically in Tasks 3/5/6; `vfxSource`/`bespokeFired`/`choreoDone` defined in Tasks 5/6/7 and reset together in the same three event cases; `relicArt(rid, size)` defined and used in Task 12 only; icon key scheme `st-/art-/boon-/omen-` consistent between Task 11 steps; icon suffixes verified equal to the actual `OMENS`/`ARTS`/`BOONS` object keys.
