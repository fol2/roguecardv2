# Aim Outline Halo Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship selectable aim-outline styles (`spin` / `chase` / `solid`) with global defaults + per-character overrides, editable in `?charedit=1` via bfedit-style scope dropdowns, while keeping mesh float/warp tracking and the `aimOn` visibility gate.

**Architecture:** Aim config lives in `char-meta.js` (`CHAR_AIM_DEFAULT` + `CHAR_META[id].aim`). Resolve with `charAim(id)`. Mesh outline shader gains style/speed/time uniforms; combat/`meshAim` pass resolved config. Charedit Aim block writes either global or character scope; `/__char-save` persists both table and aim default.

**Tech Stack:** Vite + vanilla JS; Three.js mesh layer; Node `test/test_engine.js` for meta serialize/validate; browser `?charedit=1` for visual verify.

**Spec:** `docs/superpowers/specs/2026-07-08-aim-outline-halo-design.md`

## File map

| File | Responsibility |
|---|---|
| `src/char-meta.js` | `CHAR_AIM_DEFAULT`, `charAim(id)`, HMR assign for aim default |
| `src/dev/char-serialize.js` | AIM keys/ranges; prune/validate/serialize aim + default |
| `vite.config.js` | `/__char-save` accepts `{ meta, aim? }` (or bare table for bfedit compat) |
| `src/mesh.js` | Shader styles; `meshAim(el, on, cfg)`; tick `uTime` |
| `src/ui.js` | `updatePreviews` / charedit callers pass `charAim(id)` (+ hero tint) |
| `src/dev/char-editor.js` | Aim panel + scope dropdowns + preview |
| `src/styles.css` | Aim panel row layout only if needed |
| `test/test_engine.js` | charAim resolve + serialize/validate/prune aim |

## Global Constraints

- Engine / `vigil.js` untouched; no new combat targeting rules.
- Knobs only: `style`, `speed`, `color` (YAGNI on width/dash length).
- Default style is **`spin`**; styles are `'spin' | 'chase' | 'solid'`.
- `aimOn` remains the visibility gate — `layoutPlane` must never force outline on.
- Mesh-off SVG fallback: keep **solid** faithful; `spin`/`chase` fall back to solid (no crash).
- `npm test` green at every task boundary; commit after each task; never `--no-verify` / amend.
- bfedit’s `/__char-save` of a bare table must keep working (aim default unchanged on disk if omitted).

---

### Task 1: Aim data + serialize/validate

**Files:**
- Modify: `src/char-meta.js`
- Modify: `src/dev/char-serialize.js`
- Modify: `vite.config.js` (`/__char-save` body shape)
- Modify: `test/test_engine.js` (char-meta block ~1126–1146)
- Modify: `src/dev/char-editor.js` / `src/dev/bf-editor.js` only if save payload must change for compile (prefer vite accepting both shapes so bfedit stays `JSON.stringify(state.meta)`)

**Interfaces:**
- Produces:
  - `CHAR_AIM_DEFAULT: { style: 'spin', speed: 1, color: '#fff6ec' }`
  - `charAim(id: string) => { style, speed, color }`
  - `AIM_KEYS = ['style','speed','color']`
  - `AIM_STYLES = ['spin','chase','solid']`
  - `AIM_SPEED_RANGE = [0.25, 3]`
  - `serializeCharMeta(table, { layout, shadow, aim })` emits `export const CHAR_AIM_DEFAULT = …`
  - `/__char-save` body: either legacy bare table **or** `{ meta, aim }`

- [ ] **Step 1: Extend the failing assertions in `test/test_engine.js`**

In the existing char-meta block, after the current imports, add:

```js
const {
  CHAR_META, CHAR_LAYOUT_DEFAULT, CHAR_SHADOW_DEFAULT, CHAR_AIM_DEFAULT,
  charLayout, charShadow, charMesh, charAim, _setCharMeta,
} = await import('../src/char-meta.js');
const { serializeCharMeta, validateCharMeta, pruneCharMeta, AIM_KEYS } = await import('../src/dev/char-serialize.js');

assert.equal(CHAR_AIM_DEFAULT.style, 'spin', 'char-meta: aim default style spin');
assert.deepEqual(charAim('sporeling'), { ...CHAR_AIM_DEFAULT }, 'char-meta: aim inherits global');
_setCharMeta({ ...CHAR_META, sporeling: { ...(CHAR_META.sporeling || {}), aim: { style: 'chase', speed: 2 } } }, { silent: true });
assert.equal(charAim('sporeling').style, 'chase', 'char-meta: aim style override');
assert.equal(charAim('sporeling').color, CHAR_AIM_DEFAULT.color, 'char-meta: aim color inherits');
_setCharMeta(CHAR_META, { silent: true }); // restore

assert.ok(validateCharMeta({ duskblade: { aim: { style: 'nope' } } }, { heroes: ASPECTS.map((a) => a.id), enemies: [] }).length > 0, 'char-meta: bad aim style rejected');
const prunedAim = pruneCharMeta({ x: { aim: { style: 'spin', speed: 1, color: '#fff6ec' } } }, { layout: CHAR_LAYOUT_DEFAULT, aim: CHAR_AIM_DEFAULT });
assert.ok(!prunedAim.x, 'char-meta: aim equal to default pruned');
const srcAim = serializeCharMeta(CHAR_META, { layout: CHAR_LAYOUT_DEFAULT, shadow: CHAR_SHADOW_DEFAULT, aim: CHAR_AIM_DEFAULT });
assert.ok(srcAim.includes('export const CHAR_AIM_DEFAULT'), 'char-meta: aim default serialized');
assert.ok(srcAim.includes("style: 'spin'") || srcAim.includes('style: "spin"'), 'char-meta: spin in default');
```

(Adjust string quote check to match whatever `serializeCharMeta` emits for string fields.)

- [ ] **Step 2: Run test to verify it fails**

Run: `node --test 2>/dev/null; npm test 2>&1 | rg -n "char-meta: aim|CHAR_AIM|not defined|AssertionError" | head -40`

Expected: FAIL — `CHAR_AIM_DEFAULT` / `charAim` missing (or similar).

- [ ] **Step 3: Implement `char-meta.js` aim API**

Add near the top (after shadow default):

```js
export const CHAR_AIM_DEFAULT = { style: 'spin', speed: 1, color: '#fff6ec' };
```

Extend typedef / comments to include `aim?: Partial<typeof CHAR_AIM_DEFAULT>`.

Add:

```js
export function charAim(id) {
  return { ...CHAR_AIM_DEFAULT, ...((_live[id] || {}).aim || {}) };
}
```

In HMR accept:

```js
Object.assign(CHAR_AIM_DEFAULT, mod.CHAR_AIM_DEFAULT);
```

- [ ] **Step 4: Implement serialize / validate / prune for aim**

In `char-serialize.js`:

```js
export const AIM_KEYS = ['style', 'speed', 'color'];
export const AIM_STYLES = ['spin', 'chase', 'solid'];
export const AIM_SPEED_RANGE = [0.25, 3];
```

- `entryLine`: if `entry.aim` has keys, emit `aim: { style: '…', speed: …, color: '…' }` (strings quoted).
- `pruneCharMeta`: copy aim fields that differ from `defaults.aim` (or from `CHAR_AIM_DEFAULT` shape); drop empty `aim`.
- `validateCharMeta`: allow key `aim`; validate `style ∈ AIM_STYLES`, finite `speed` in range, `color` is non-empty string matching `/^#[0-9a-fA-F]{6}$/`.
- `serializeCharMeta`: after `CHAR_SHADOW_DEFAULT`, emit:

```js
export const CHAR_AIM_DEFAULT = { style: 'spin', speed: 1, color: '#fff6ec' };
```

using `defaults.aim` values (quote `style`/`color` as JS strings). Update generated typedef to include `aim?`.

Update HEADER comment to mention aim outline defaults.

- [ ] **Step 5: Teach `/__char-save` both payload shapes**

In `vite.config.js` `/__char-save` handler, after `JSON.parse(body)`:

```js
const payload = JSON.parse(body);
const table = payload?.meta && typeof payload.meta === 'object' && !Array.isArray(payload.meta)
  ? payload.meta
  : payload;
const aimIn = payload?.aim && typeof payload.aim === 'object' ? payload.aim : null;
// validate table as today…
const aimDefault = aimIn
  ? { ...CHAR_AIM_DEFAULT, ...aimIn }
  : { ...CHAR_AIM_DEFAULT };
// optionally validate aimDefault fields; reject bad style/speed/color
const next = serializeCharMeta(table, {
  layout: CHAR_LAYOUT_DEFAULT,
  shadow: CHAR_SHADOW_DEFAULT,
  aim: aimDefault,
});
```

Import `CHAR_AIM_DEFAULT` from `char-meta.js` in that Promise.all.

Keep bfedit’s bare-table POST working (aim stays current file default).

- [ ] **Step 6: Run tests**

Run: `npm test 2>&1 | tail -20`

Expected: `unit checks passed; monte-carlo: …`

- [ ] **Step 7: Commit**

```bash
git add src/char-meta.js src/dev/char-serialize.js vite.config.js test/test_engine.js
git commit -m "$(cat <<'EOF'
Add CHAR_AIM_DEFAULT and per-id aim resolve/serialize.

Global spin/chase/solid aim knobs live in char-meta with prune/validate,
and /__char-save accepts optional aim defaults beside the character table.
EOF
)"
```

---

### Task 2: Mesh shader styles (spin / chase / solid)

**Files:**
- Modify: `src/mesh.js` (`AIM_FRAG`, `makePlane` uniforms, `tick`, `meshAim`)
- Modify: `src/ui.js` (`updatePreviews` meshAim calls)

**Interfaces:**
- Consumes: `charAim(id)` from Task 1
- Produces: `meshAim(el, on, cfg?: { style, speed, color })` — when `cfg` omitted, keep prior uniforms; color string still accepted as 3rd arg for one release? Prefer **only** object/`cfg` — update all call sites in this task.
  - Suggested signature: `meshAim(el, on, cfg = null)` where `cfg` is `{ style, speed, color } | string` — if string, treat as color with style/speed unchanged or default solid. Cleaner: **require object** and update call sites.

- [ ] **Step 1: Expand `AIM_FRAG` with style modes**

Replace outline fragment with uniforms `uStyle` (0 solid, 1 spin, 2 chase), `uSpeed`, `uColor`, `uWidth`, `uTime`, `map`:

```glsl
// solid: current dilate ring
// spin: ring * dashed mask rotating with uTime*uSpeed around UV centroid of alpha
// chase: ring * soft pulse that travels around the perimeter angle
```

Implementation sketch (keep tight):

```glsl
uniform float uStyle; // 0 solid, 1 spin, 2 chase
uniform float uSpeed;
uniform float uTime;
// … existing dilate to get `ring` …
float ang = atan(vUv.y - 0.5, vUv.x - 0.5); // coarse; good enough for halo
float mask = 1.0;
if (uStyle > 0.5 && uStyle < 1.5) {
  // spin dashes
  mask = step(0.45, fract(ang / 6.2831853 * 8.0 - uTime * uSpeed));
} else if (uStyle > 1.5) {
  // chase pulse
  float head = fract(ang / 6.2831853 - uTime * uSpeed);
  mask = smoothstep(0.0, 0.08, head) * (1.0 - smoothstep(0.08, 0.22, head));
  mask = max(mask, 0.25); // keep a dim base ring so target stays readable
}
float aOut = ring * mask;
if (aOut < 0.04) discard;
gl_FragColor = vec4(uColor, min(1.0, aOut * 1.8));
```

Tune dash count / pulse width so the silhouette still reads as “target” first.

- [ ] **Step 2: Wire uniforms + tick**

In `makePlane` aim material:

```js
uniforms: {
  map: { value: tex },
  uColor: { value: new THREE.Color('#fff6ec') },
  uWidth: { value: 0.018 },
  uStyle: { value: 1 }, // spin default
  uSpeed: { value: 1 },
  uTime: { value: 0 },
},
```

In `tick`, after deform/layout:

```js
if (p.aimMat && p.aimOn) p.aimMat.uniforms.uTime.value = sec;
```

- [ ] **Step 3: Update `meshAim` to take config**

```js
import { charAim } from './char-meta.js'; // only if mesh resolves itself — prefer UI passes cfg to avoid mesh→char-meta if already imported… mesh already imports charMesh from char-meta, so OK.

export function meshAim(el, on, cfg = null) {
  const p = findPlane(el);
  if (!p?.outline) return false;
  p.aimOn = !!on;
  p.outline.visible = !!on;
  if (on && p.aimMat && cfg) {
    const style = cfg.style === 'chase' ? 2 : cfg.style === 'solid' ? 0 : 1;
    p.aimMat.uniforms.uStyle.value = style;
    p.aimMat.uniforms.uSpeed.value = cfg.speed ?? 1;
    p.aimMat.uniforms.uColor.value.set(cfg.color || '#fff6ec');
  }
  return true;
}
```

- [ ] **Step 4: Update combat `updatePreviews`**

```js
import { charShadowLive, charCssFloat, charAim, onCharMetaChange } from './char-meta.js';

// hero:
const heroId = ASPECTS[S.run.aspect].id;
const heroCfg = { ...charAim(heroId), color: '#e8f7ff' }; // runtime tint
meshAim(sprite, true, heroCfg);

// enemy:
meshAim(sprite, true, charAim(en.key));
```

- [ ] **Step 5: Manual smoke (mesh on)**

Run: `npm run dev` → open combat → hover Edge / Ward.  
Expected: spin dashes on foe for Edge; blue-tinted spin on hero for Ward; no console errors.

- [ ] **Step 6: Commit**

```bash
git add src/mesh.js src/ui.js
git commit -m "$(cat <<'EOF'
Drive aim outline styles from charAim in the mesh shader.

Spin/chase/solid share the warped silhouette geometry, with combat hover
passing resolved per-id aim config (hero keeps a self-target tint).
EOF
)"
```

---

### Task 3: Charedit Aim panel (global / character scope)

**Files:**
- Modify: `src/dev/char-editor.js`
- Modify: `src/dev/char-editor.js` CSS block (inline styles at bottom) for aim rows
- Modify: `src/dev/char-editor.js` `saveMeta` body → `{ meta, aim }`
- Optionally touch: `src/styles.css` only if shared classes needed (prefer editor-local CSS)

**Interfaces:**
- Consumes: `CHAR_AIM_DEFAULT`, `charAim`, `AIM_STYLES` / ranges from serialize (import constants from `char-serialize.js`), `meshAim` / `meshAimClear`
- Produces: panel writes `state.aimDefault` or `state.meta[id].aim`; Save posts `{ meta: pruned, aim: state.aimDefault }`

- [ ] **Step 1: Extend editor state**

```js
import {
  CHAR_LAYOUT_DEFAULT, CHAR_SHADOW_DEFAULT, CHAR_AIM_DEFAULT,
  charMetaTable, _setCharMeta, charLayout, charShadow, charAim, onCharMetaChange,
} from '../char-meta.js';
import {
  … AIM_KEYS, AIM_STYLES, AIM_SPEED_RANGE,
} from './char-serialize.js';

const state = {
  …,
  outline: false,
  aimDefault: { ...CHAR_AIM_DEFAULT },
  aimScope: { style: 'global', speed: 'global', color: 'global' }, // per-field UI scope
};
```

On init / after load, `state.aimDefault = { ...CHAR_AIM_DEFAULT }`.

- [ ] **Step 2: Helper resolve for panel display**

```js
function aimOf(id) {
  return { ...state.aimDefault, ...((state.meta[id] || {}).aim || {}) };
}
function aimOverridden(id, key) {
  const a = (state.meta[id] || {}).aim;
  return !!(a && a[key] !== undefined);
}
```

- [ ] **Step 3: Render Aim block in `renderPanel`**

Place after the anim/outline checkboxes (or after mesh/float). Include:

- Keep `ce-outline` preview checkbox.
- For each of `style`, `speed`, `color`:
  - label + `●` if character override
  - control (select / range+number / text input)
  - `<select data-aim-scope="style">` options `global` | `character`
  - clear `×` when overridden

Default displayed values = `aimOf(id)` (resolved).  
When scope select is `global`, editing writes `state.aimDefault[key]` and does **not** create character override.  
When scope is `character`, editing writes `ensureEntry(id).aim[key]`.

On scope change from character→global without clear: keep override data but switch which target subsequent edits hit (bfedit pattern: scope select chooses write target; shown value can stay resolved — document in UI hint: “scope chooses where the next edit writes”).

Simpler UX (preferred for this plan):

- Scope dropdown reflects **where the value currently lives** (`character` if overridden, else `global`).
- Changing a control writes to that scope.
- Switching scope to `character` when not overridden: copy current resolved value into `meta[id].aim[key]` (copy-on-write).
- Switching scope to `global` when overridden: does not auto-delete; user hits `×` to clear (same as bfedit clear).

- [ ] **Step 4: Wire preview to resolved aim**

In `paintActor` when enabling outline:

```js
const cfg = aimOf(id);
if (state.outline) meshAim(sprite, true, isHero(id) ? { ...cfg, color: '#e8f7ff' } : cfg);
```

On `#ce-outline` change, same cfg (no full remesh if mesh-live).

When aim fields change under preview-on, call `meshAim(sprite, true, cfg)` again so style/speed/color update live.

- [ ] **Step 5: Update `saveMeta`**

```js
const pruned = pruneCharMeta(state.meta, {
  layout: CHAR_LAYOUT_DEFAULT,
  shadow: CHAR_SHADOW_DEFAULT,
  aim: state.aimDefault,
});
…
body: JSON.stringify({ meta: pruned, aim: state.aimDefault }),
```

After success, `Object.assign(CHAR_AIM_DEFAULT, state.aimDefault)` (or rely on HMR) and `_setCharMeta(pruned)`.

- [ ] **Step 6: Manual verify in charedit**

Run: open `http://127.0.0.1:5174/?charedit=1&char=voidWisp`

1. Enable anim + aim outline preview → see **spin**.
2. Set style scope global → `chase` → all chars without override follow.
3. Switch voidWisp style to character → `solid` → only that id.
4. Clear × → back to global chase.
5. Save → reload charedit → values persist in `src/char-meta.js`.

- [ ] **Step 7: Run unit tests + commit**

Run: `npm test 2>&1 | tail -15`

```bash
git add src/dev/char-editor.js src/char-meta.js src/dev/char-serialize.js vite.config.js
# include any file touched for save payload
git commit -m "$(cat <<'EOF'
Add charedit aim panel with global/character scope.

Authors can preview spin/chase/solid, edit speed and color per scope, and
save CHAR_AIM_DEFAULT beside per-id aim overrides.
EOF
)"
```

---

### Task 4: SVG fallback + combat polish + docs touch

**Files:**
- Modify: `src/ui.js` (`aimRing` / CSS class if needed)
- Modify: `src/styles.css` (optional animation for solid-only fallback — keep minimal)
- Modify: `docs/superpowers/specs/2026-07-08-aim-outline-halo-design.md` only if mesh-off behaviour needs a one-line note (optional)

**Interfaces:**
- Consumes: `charAim`
- Produces: mesh-off path shows solid ring; no throw when style is spin/chase

- [ ] **Step 1: Document mesh-off behaviour in code comment**

Near `aimRing` in `ui.js`:

```js
// Mesh-off: SVG feMorphology ring is always solid. Fancy styles need WebGL.
```

Do **not** invent CSS spin for SVG in this task (YAGNI).

- [ ] **Step 2: Ensure `aim-mesh` still hides SVG when mesh owns the ring**

Existing CSS:

```css
.enemy.aim-target:not(.aim-mesh) .aim-ring,
.hero-wrap.aim-target:not(.aim-mesh) .aim-ring { opacity: 1; }
```

No change if still correct.

- [ ] **Step 3: Verify `?mesh=0` combat hover**

Open `/?mesh=0`, start fight, hover Edge → solid SVG ring visible; no errors.

- [ ] **Step 4: Final `npm test` + commit**

```bash
npm test 2>&1 | tail -15
git add src/ui.js src/styles.css
git commit -m "$(cat <<'EOF'
Keep mesh-off aim rings on solid SVG fallback.

Fancy spin/chase stay WebGL-only so the no-mesh path never crashes or
double-draws against aim-mesh.
EOF
)"
```

---

## Plan self-review

| Spec requirement | Task |
|---|---|
| `CHAR_AIM_DEFAULT` + per-id `aim` | Task 1 |
| Resolve merge | Task 1 (`charAim`) |
| Serialize/validate/prune + save | Task 1 + Task 3 save |
| Styles spin/chase/solid on mesh | Task 2 |
| Tracks float/warp + `aimOn` | Task 2 (existing layout + aimOn) |
| Charedit scope dropdown global/character | Task 3 |
| Preview checkbox | Task 3 |
| Combat hover uses resolved aim | Task 2 |
| Mesh-off solid fallback | Task 4 |
| No extra knobs / no targeting changes | Global constraints |

No TBD/placeholder steps. Signatures: `charAim(id)`, `meshAim(el, on, cfg)`, save `{ meta, aim }` consistent across tasks.
