# Ward VFX Raster Sprites Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship alpha raster sprite sheets for persistent Ward shell + one-shot Ward gain, wired through CSS `steps()` on combat actors, replacing the CSS circle `::before` ward.

**Architecture:** Generate 4-frame horizontal strips via the repo art pipeline; place under `src/assets/vfx/`; resolve with `assetUrl('vfx', …)`; UI toggles a `.ward-fx` layer when `block > 0` and spawns `.ward-gain-fx` on block-gain events. No engine changes.

**Tech Stack:** Vite asset glob; CSS sprite animation; existing combat DOM in `ui.js` / `styles.css`; optional trim of canvas `ward` archetype in `vfx.js`.

**Spec:** `docs/superpowers/specs/2026-07-09-ward-vfx-raster-design.md`

## File map

| File | Responsibility |
|---|---|
| `scratch/ward-vfx-20260709/` | Source / alpha / `prompt-ledger.md` |
| `src/assets/vfx/ward-loop.png` | Persistent 4-frame strip |
| `src/assets/vfx/ward-gain.png` | Gain 4-frame strip |
| `src/styles.css` | Remove circle `::before`; sprite CSS for `.ward-fx` / `.ward-gain-fx` |
| `src/ui.js` | Inject layers; spawn gain FX on block event |
| `src/vfx.js` | Soften/remove duplicate canvas `ward` ring once sprite ships |
| `src/assets/README.md` | One-line note for `vfx/` category (if that doc lists categories) |

## Global Constraints

- No SVG ward shell. Raster + CSS only.
- 4 frames each; horizontal strip; alpha PNG.
- `LITE` / `prefers-reduced-motion`: freeze frame 0.
- Atomic commit + push after each task (owner preference).
- Do not rewrite unrelated `char-meta.js` WIP from other agents.

---

### Task 1: Generate + promote ward sprite assets

**Files:**
- Create: `scratch/ward-vfx-20260709/prompt-ledger.md`
- Create: `scratch/ward-vfx-20260709/source/` + `alpha/`
- Create: `src/assets/vfx/ward-loop.png`, `src/assets/vfx/ward-gain.png`

**Interfaces:**
- Produces: two PNGs resolvable as `assetUrl('vfx', 'ward-loop')` and `assetUrl('vfx', 'ward-gain')`

- [ ] **Step 1: Scaffold scratch + ledger**

```bash
mkdir -p scratch/ward-vfx-20260709/{source,alpha}
```

Write `prompt-ledger.md` with shared style block (stained-glass, `#ff00ff` key, cool blue ward tone) and rows for `ward-loop` / `ward-gain`.

- [ ] **Step 2: Generate sources (gpt-image-2 / built-in image tool)**

Prompt intent (adapt to tool):

- **ward-loop:** single glass ward shell / crescent ring, 4-frame-ready subject (or generate 4 stills and composite later). Prefer one sheet if the tool can do a strip; else 4 stills → stitch.
- **ward-gain:** expanding glass ripple / shatter-light burst, same palette.

Solid `#ff00ff` background; no text; alpha-ready silhouette.

- [ ] **Step 3: Nano Banana Pro → alpha cutout → rim cleanup**

Follow `docs/generated-art-workflow.md`. Record paths + ids in the ledger.

- [ ] **Step 4: Assemble 4-frame horizontal strips**

Each cell square (e.g. 256×256); sheet 1024×256. Frames ordered left→right for loop / burst.

```bash
# example with ImageMagick if available — adjust paths
# convert f0.png f1.png f2.png f3.png +append src/assets/vfx/ward-loop.png
```

Copy finals into `src/assets/vfx/`.

- [ ] **Step 5: Smoke-resolve**

Run: `node -e "import('./src/art.js').then(a => console.log(a.assetUrl('vfx','ward-loop'), a.assetUrl('vfx','ward-gain')))"`

Expected: two non-null URLs (under Vite/node may need a tiny check script or `npm run build` import — if Node can't resolve Vite glob, verify files exist and defer URL check to Task 2 in browser).

- [ ] **Step 6: Commit + push**

```bash
git add scratch/ward-vfx-20260709 src/assets/vfx/ward-loop.png src/assets/vfx/ward-gain.png
git commit -m "$(cat <<'EOF'
Add ward loop and gain raster sprite sheets.

Four-frame alpha strips for persistent Ward shell and one-shot gain
burst, authored via the standard image pipeline.
EOF
)"
git push origin HEAD
```

---

### Task 2: Wire persistent `.ward-fx` sprite (replace CSS circle)

**Files:**
- Modify: `src/styles.css` (remove / disable `.warded::before` circle; add `.ward-fx`)
- Modify: `src/ui.js` (inject `.ward-fx` in hero / enemy art markup; keep `warded` class toggle)

**Interfaces:**
- Consumes: `assetUrl('vfx', 'ward-loop')`
- Produces: visible looping shell when `block > 0`

- [ ] **Step 1: CSS**

Remove or neutralize:

```css
.hero-wrap.warded::before, .enemy-art.warded::before { … }
```

Add:

```css
.ward-fx {
  position: absolute; inset: -6%; z-index: 2; pointer-events: none;
  background-repeat: no-repeat; background-position: 0 0;
  background-size: 400% 100%;
  mix-blend-mode: screen; opacity: 0.85;
}
.warded > .ward-fx, .warded .ward-fx { /* ensure visible only when parent warded — or toggle display in JS */ }
.hero-wrap.warded .ward-fx, .enemy-art.warded .ward-fx {
  animation: wardLoop 2.4s steps(4) infinite;
}
@keyframes wardLoop {
  to { background-position: 100% 0; }
}
@media (prefers-reduced-motion: reduce) {
  .hero-wrap.warded .ward-fx, .enemy-art.warded .ward-fx { animation: none; }
}
/* LITE: mirror existing pattern that kills wardPulse */
```

Set `background-image` via inline style or CSS variable from JS when URL exists.

- [ ] **Step 2: DOM**

In combat hero / enemy art HTML, add:

```html
<div class="ward-fx" hidden></div>
```

When applying `warded` (existing toggles ~`ce.hero.classList.toggle('warded', P.block > 0)` and enemy art), also:

```js
const url = assetUrl('vfx', 'ward-loop');
const fx = /* .ward-fx under actor */;
if (fx) {
  if (url && block > 0) {
    fx.hidden = false;
    fx.style.backgroundImage = `url(${url})`;
  } else {
    fx.hidden = true;
  }
}
```

- [ ] **Step 3: Manual check**

Play Defend / gain Ward → shell loops on hero; enemy with block shows shell.

- [ ] **Step 4: Commit + push**

```bash
git add src/styles.css src/ui.js
git commit -m "$(cat <<'EOF'
Replace CSS ward circle with looping raster sprite.

Combat actors show a four-frame glass ward shell while block > 0,
with motion frozen under LITE and reduced-motion.
EOF
)"
git push origin HEAD
```

---

### Task 3: Wire one-shot `.ward-gain-fx` + trim canvas ward

**Files:**
- Modify: `src/styles.css` (`.ward-gain-fx` + keyframes play-once)
- Modify: `src/ui.js` (on block-gain float path, spawn FX)
- Modify: `src/vfx.js` (drop or soften `case 'ward':` ring to avoid double flash)

**Interfaces:**
- Consumes: `assetUrl('vfx', 'ward-gain')`
- Produces: one-shot burst at actor centre on Ward gain

- [ ] **Step 1: CSS play-once**

```css
.ward-gain-fx {
  position: absolute; inset: -12%; z-index: 6; pointer-events: none;
  background-repeat: no-repeat; background-size: 400% 100%;
  mix-blend-mode: screen;
  animation: wardGain 0.42s steps(4) forwards;
}
@keyframes wardGain {
  to { background-position: 100% 0; opacity: 0; }
}
```

- [ ] **Step 2: Spawn helper in `ui.js`**

Near the existing `block` / `blockf` float handling:

```js
function playWardGain(root) {
  const url = assetUrl('vfx', 'ward-gain');
  if (!url || !root) return;
  const el = document.createElement('div');
  el.className = 'ward-gain-fx';
  el.style.backgroundImage = `url(${url})`;
  root.appendChild(el);
  el.addEventListener('animationend', () => el.remove(), { once: true });
}
```

Call when player/enemy gains block (the drain branch that already floats `blockf`).

- [ ] **Step 3: Trim canvas duplicate**

In `vfx.js` `case 'ward':`, either no-op particles or keep only subtle motes (no expanding `ring`) so the sprite owns the read.

- [ ] **Step 4: `npm test` + manual**

Run: `npm test 2>&1 | tail -15`

Manual: play Defend → gain burst once + loop remains.

- [ ] **Step 5: Commit + push**

```bash
git add src/styles.css src/ui.js src/vfx.js
git commit -m "$(cat <<'EOF'
Add one-shot ward gain sprite and drop duplicate canvas ring.

Block gains play a four-frame raster burst; the looping shell remains
the persistent Ward read.
EOF
)"
git push origin HEAD
```

---

## Plan self-review

| Spec requirement | Task |
|---|---|
| Raster pipeline + ledger | Task 1 |
| `ward-loop` / `ward-gain` under `assets/vfx/` | Task 1 |
| Persistent steps() loop; replace CSS circle | Task 2 |
| LITE / reduced-motion freeze | Task 2 |
| Gain play-once sprite | Task 3 |
| Avoid double-flash with canvas ward | Task 3 |

No TBD steps. Asset generation may need human/tool approval mid-Task 1 if image tools are gated.
