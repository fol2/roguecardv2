# Aim Beams / Dashes Counts Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add independent `beams` (chase, 1–4) and `dashes` (spin, 1–4) aim knobs with defaults `beams: 1`, `dashes: 2`, editable in charedit under global/character scope, driven by mesh shader uniforms.

**Architecture:** Extend existing `CHAR_AIM_DEFAULT` / per-id `aim` / `charAim(id)` / serialize / charedit / `meshAim` path. Shader gains `uBeams` + `uDashes`; spin replaces hard-coded `* 8.0`; chase draws N evenly spaced pulse heads. Do not rewrite author-tuned `style`/`speed`/`color` already on disk — only add the new keys.

**Tech Stack:** Vite + vanilla JS; Three.js mesh layer; Node `test/test_engine.js`; browser `?charedit=1`.

**Spec:** `docs/superpowers/specs/2026-07-08-aim-beams-dashes-design.md`

## File map

| File | Responsibility |
|---|---|
| `src/char-meta.js` | Add `beams` / `dashes` on `CHAR_AIM_DEFAULT` (preserve existing style/speed/color) |
| `src/dev/char-serialize.js` | `AIM_KEYS`, count range, inline/validate/prune/serialize |
| `vite.config.js` | Optional clamp of `beams`/`dashes` on `/__char-save` aim merge |
| `src/mesh.js` | `uBeams` / `uDashes` in `AIM_FRAG` + `meshAim` |
| `src/dev/char-editor.js` | Aim rows for beams/dashes + scope |
| `test/test_engine.js` | Resolve / validate / prune / serialize for counts |

## Global Constraints

- Knobs: add only `beams` and `dashes` (integers 1–4). No width / duty-cycle knobs.
- Defaults: `beams: 1`, `dashes: 2`. Preserve any existing on-disk `style` / `speed` / `color`.
- `solid` and mesh-off SVG ignore counts (always solid).
- `aimOn` visibility gate unchanged; `layoutPlane` must not force outline on.
- `npm test` green at each task boundary; atomic commit + push after each task (per owner preference); never `--no-verify` / amend.
- bfedit bare-table `/__char-save` still works (omitted `aim` keeps file default, including new keys once present).

---

### Task 1: Data + serialize/validate for beams & dashes

**Files:**
- Modify: `src/char-meta.js`
- Modify: `src/dev/char-serialize.js`
- Modify: `vite.config.js` (aim merge clamp)
- Modify: `test/test_engine.js` (char-meta block ~1142–1154)

**Interfaces:**
- Produces:
  - `CHAR_AIM_DEFAULT` includes `beams: 1`, `dashes: 2` (plus existing style/speed/color)
  - `AIM_KEYS = ['style','speed','color','beams','dashes']`
  - `AIM_COUNT_RANGE = [1, 4]`
  - `charAim(id)` returns merged object including counts
  - validate rejects non-integer / out-of-range beams/dashes
  - serialize emits beams/dashes in `CHAR_AIM_DEFAULT` and per-id `aim`

- [ ] **Step 1: Extend failing assertions in `test/test_engine.js`**

In the char-meta block, after the existing aim asserts (or replacing the brittle `style === 'spin'` if disk already differs), ensure these run against live defaults:

```js
assert.equal(CHAR_AIM_DEFAULT.beams, 1, 'char-meta: aim default beams 1');
assert.equal(CHAR_AIM_DEFAULT.dashes, 2, 'char-meta: aim default dashes 2');
assert.equal(charAim('sporeling').beams, 1, 'char-meta: aim beams inherit');
assert.equal(charAim('sporeling').dashes, 2, 'char-meta: aim dashes inherit');
_setCharMeta({ ...CHAR_META, sporeling: { ...(CHAR_META.sporeling || {}), aim: { beams: 3, dashes: 4 } } }, { silent: true });
assert.equal(charAim('sporeling').beams, 3, 'char-meta: aim beams override');
assert.equal(charAim('sporeling').dashes, 4, 'char-meta: aim dashes override');
assert.equal(charAim('sporeling').style, CHAR_AIM_DEFAULT.style, 'char-meta: aim style still inherits when only counts overridden');
_setCharMeta(CHAR_META, { silent: true });

assert.ok(validateCharMeta({ duskblade: { aim: { beams: 0 } } }, { heroes: ASPECTS.map((a) => a.id), enemies: [] }).length > 0, 'char-meta: beams 0 rejected');
assert.ok(validateCharMeta({ duskblade: { aim: { dashes: 5 } } }, { heroes: ASPECTS.map((a) => a.id), enemies: [] }).length > 0, 'char-meta: dashes 5 rejected');
assert.ok(validateCharMeta({ duskblade: { aim: { beams: 2.5 } } }, { heroes: ASPECTS.map((a) => a.id), enemies: [] }).length > 0, 'char-meta: beams non-int rejected');

const prunedCounts = pruneCharMeta(
  { x: { aim: { ...CHAR_AIM_DEFAULT } } },
  { layout: CHAR_LAYOUT_DEFAULT, aim: CHAR_AIM_DEFAULT },
);
assert.ok(!prunedCounts.x, 'char-meta: aim equal to default (incl counts) pruned');

const srcCounts = serializeCharMeta(CHAR_META, { layout: CHAR_LAYOUT_DEFAULT, shadow: CHAR_SHADOW_DEFAULT, aim: CHAR_AIM_DEFAULT });
assert.ok(/beams:\s*1/.test(srcCounts), 'char-meta: beams in CHAR_AIM_DEFAULT serialize');
assert.ok(/dashes:\s*2/.test(srcCounts), 'char-meta: dashes in CHAR_AIM_DEFAULT serialize');
```

Keep the existing style/chase override asserts; if `CHAR_AIM_DEFAULT.style === 'spin'` is false because authors already saved chase, change that one assert to only check `AIM_STYLES.includes(CHAR_AIM_DEFAULT.style)` (import `AIM_STYLES` from char-serialize) so the suite matches disk without rewriting author taste.

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test 2>&1 | rg -n "aim default beams|aim beams|CHAR_AIM|AssertionError|not defined" | head -40`

Expected: FAIL — `beams` / `dashes` missing on default or validate not rejecting bad counts.

- [ ] **Step 3: Implement char-meta + serialize**

In `src/char-meta.js`, ensure default includes counts **without** resetting style/speed/color:

```js
export const CHAR_AIM_DEFAULT = {
  style: /* keep current on-disk value */,
  speed: /* keep */,
  color: /* keep */,
  beams: 1,
  dashes: 2,
};
```

If the file is generated-only via serialize later, hand-edit once so live default gains the two keys.

In `src/dev/char-serialize.js`:

```js
export const AIM_KEYS = ['style', 'speed', 'color', 'beams', 'dashes'];
export const AIM_COUNT_RANGE = [1, 4];
```

Update `inlineAim`:

```js
function inlineAim(obj) {
  const parts = [];
  if (obj.style !== undefined) parts.push(`style: ${str(obj.style)}`);
  if (obj.speed !== undefined) parts.push(`speed: ${num(obj.speed)}`);
  if (obj.color !== undefined) parts.push(`color: ${str(obj.color)}`);
  if (obj.beams !== undefined) parts.push(`beams: ${num(obj.beams)}`);
  if (obj.dashes !== undefined) parts.push(`dashes: ${num(obj.dashes)}`);
  return `{ ${parts.join(', ')} }`;
}
```

Update prune fallback aimDef to include `beams: 1, dashes: 2`.

In `validateCharMeta` aim branch, after color:

```js
} else if (k === 'beams' || k === 'dashes') {
  if (!Number.isFinite(v) || !Number.isInteger(v)) {
    problems.push(`${id}.aim.${k}: need integer`);
  } else {
    const [lo, hi] = AIM_COUNT_RANGE;
    if (v < lo || v > hi) problems.push(`${id}.aim.${k}: ${v} out of [${lo},${hi}]`);
  }
}
```

Update generated typedef comment / HEADER if it lists aim fields.

In `vite.config.js` after merging `aimDefault`, clamp counts (reject or coerce):

```js
for (const k of ['beams', 'dashes']) {
  const v = aimDefault[k];
  if (!Number.isInteger(v) || v < 1 || v > 4) {
    res.statusCode = 400;
    return res.end(JSON.stringify({ ok: false, problems: [`aim.${k}: need integer 1..4`] }));
  }
}
```

(If `aimIn` omitted, merged default from file already has valid counts after Step 3 file edit.)

- [ ] **Step 4: Run tests to verify pass**

Run: `npm test 2>&1 | tail -20`

Expected: `unit checks passed; monte-carlo: …`

- [ ] **Step 5: Commit + push**

```bash
git add src/char-meta.js src/dev/char-serialize.js vite.config.js test/test_engine.js
git commit -m "$(cat <<'EOF'
Add aim beams and dashes count defaults.

Separate 1–4 chase beams and spin dashes live in CHAR_AIM_DEFAULT
with prune/validate/serialize and /__char-save clamps.
EOF
)"
git push origin HEAD
```

---

### Task 2: Mesh shader uBeams / uDashes

**Files:**
- Modify: `src/mesh.js` (`AIM_FRAG`, `makePlane` uniforms, `meshAim`)

**Interfaces:**
- Consumes: `cfg.beams`, `cfg.dashes` from `charAim` / charedit (Task 1 shape)
- Produces: `meshAim(el, on, cfg)` sets `uBeams` / `uDashes`; spin uses `uDashes`; chase uses `uBeams` heads

- [ ] **Step 1: Update `AIM_FRAG`**

Replace the style branches so counts drive multiplicity:

```glsl
// uStyle: 0 solid, 1 spin (dashed), 2 chase (pulse along edge)
// uBeams: chase head count (1..4); uDashes: spin segment count (1..4)
uniform float uBeams;
uniform float uDashes;
// ...
float ring = max(0.0, o - a);
float mask = 1.0;
float ang = atan(vUv.y - 0.5, vUv.x - 0.5);
float turn = ang / 6.2831853;
if (uStyle > 0.5 && uStyle < 1.5) {
  float n = max(1.0, uDashes);
  mask = step(0.42, fract(turn * n - uTime * uSpeed));
} else if (uStyle > 1.5) {
  float n = max(1.0, uBeams);
  float t = fract(turn - uTime * uSpeed);
  float pulse = 0.0;
  for (int i = 0; i < 4; i++) {
    if (float(i) >= n) break;
    float head = fract(t - float(i) / n);
    pulse = max(pulse, smoothstep(0.0, 0.08, head) * (1.0 - smoothstep(0.08, 0.22, head)));
  }
  mask = max(pulse, 0.28);
}
```

(Keep the existing 8-tap dilate loop unchanged.)

- [ ] **Step 2: Wire uniforms in `makePlane` + `meshAim`**

In `makePlane` aimMat uniforms add:

```js
uBeams: { value: 1 },
uDashes: { value: 2 },
```

In `meshAim`:

```js
export function meshAim(el, on, cfg = null) {
  const p = findPlane(el);
  if (!p?.outline) return false;
  p.aimOn = !!on;
  p.outline.visible = !!on;
  if (on && p.aimMat && cfg) {
    const style = cfg.style === 'chase' ? 2 : cfg.style === 'solid' ? 0 : 1;
    p.aimMat.uniforms.uStyle.value = style;
    p.aimMat.uniforms.uSpeed.value = Number.isFinite(cfg.speed) ? cfg.speed : 1;
    p.aimMat.uniforms.uColor.value.set(cfg.color || '#fff6ec');
    const beams = Number.isInteger(cfg.beams) ? cfg.beams : 1;
    const dashes = Number.isInteger(cfg.dashes) ? cfg.dashes : 2;
    p.aimMat.uniforms.uBeams.value = Math.min(4, Math.max(1, beams));
    p.aimMat.uniforms.uDashes.value = Math.min(4, Math.max(1, dashes));
  }
  return true;
}
```

Update the JSDoc on `meshAim` to mention `beams` / `dashes`.

Combat `ui.js` already spreads `charAim(...)` — no change required once Task 1 resolve includes counts.

- [ ] **Step 3: Syntax + unit check**

Run: `node --check src/mesh.js && npm test 2>&1 | tail -15`

Expected: pass (no WebGL in Node; this task is smoke + unit).

Manual (optional same session): `/?charedit=1` with preview on, style chase, temporarily hardcode `uBeams` via console `__charEditor` after Task 3 — or wait for Task 3 UI.

- [ ] **Step 4: Commit + push**

```bash
git add src/mesh.js
git commit -m "$(cat <<'EOF'
Drive spin dashes and chase beams from aim uniforms.

Aim outline shader reads uDashes/uBeams so multiplicity follows
resolved charAim config instead of hard-coded single-head / *8.
EOF
)"
git push origin HEAD
```

---

### Task 3: Charedit beams / dashes rows

**Files:**
- Modify: `src/dev/char-editor.js` (aim row renderer + imports + `aimScope` init)

**Interfaces:**
- Consumes: `AIM_KEYS`, `AIM_COUNT_RANGE` from `char-serialize.js`; `aimOf` / `writeAim` / scope helpers already in editor
- Produces: UI rows for `beams` / `dashes`; save already posts full `state.aimDefault`

- [ ] **Step 1: Import count range + extend aimScope**

```js
import {
  … AIM_KEYS, AIM_STYLES, AIM_SPEED_RANGE, AIM_COUNT_RANGE, …
} from './char-serialize.js';
```

Ensure `state.aimScope` includes `beams` / `dashes` (either hardcode in initial object or derive from `AIM_KEYS` on init):

```js
aimScope: Object.fromEntries(AIM_KEYS.map((k) => [k, 'global'])),
```

`syncAimScopes` already loops `AIM_KEYS` — once keys include beams/dashes it stays correct.

- [ ] **Step 2: Render beams/dashes controls in `aimRows`**

Inside the `AIM_KEYS.map` in `renderPanel`, after the `speed` branch (before the color default), handle counts:

```js
if (k === 'beams' || k === 'dashes') {
  const [lo, hi] = AIM_COUNT_RANGE;
  return `<label class="ce-aim-row${over ? ' on' : ''}">
    <span>${k}${over ? ' ●' : ''}</span>
    <span class="ce-aim-pair">
      <input type="range" min="${lo}" max="${hi}" step="1" data-aim="${k}" value="${aim[k]}">
      <input type="number" min="${lo}" max="${hi}" step="1" data-aim="${k}" value="${aim[k]}">
    </span>
    ${scopeSel}${clear}
  </label>`;
}
```

Update the aim hint line to mention counts:

```html
<p class="ce-sub">beams → chase; dashes → spin (1–4). Scope chooses where the next edit writes. × clears character override.</p>
```

- [ ] **Step 3: Wire input coercion for integers**

In the existing `[data-aim]` handler, when `k === 'beams' || k === 'dashes'`:

```js
if (k === 'speed' || k === 'beams' || k === 'dashes') {
  v = Number(v);
  if (!Number.isFinite(v)) return;
  if (k === 'beams' || k === 'dashes') v = Math.min(4, Math.max(1, Math.round(v)));
  panel.querySelectorAll(`input[data-aim="${k}"]`).forEach((n) => { if (n !== inp) n.value = String(v); });
}
```

`writeAim` / `applyAimPreview` already refresh mesh — no further change if `previewAimCfg` uses `aimOf`.

- [ ] **Step 4: Manual verify**

Run: `npm run dev` → open `http://127.0.0.1:5174/?charedit=1&char=voidWisp`

1. Anim + aim outline preview on.
2. Style `chase`, beams 1 → 4: see 1..4 pulses.
3. Style `spin`, dashes 1 → 4: segment count changes.
4. Character scope override beams on one id; switch character → inherit global; clear ×.
5. Save → reload → values persist in `src/char-meta.js`.

Run: `npm test 2>&1 | tail -15` — still green.

- [ ] **Step 5: Commit + push**

```bash
git add src/dev/char-editor.js
git commit -m "$(cat <<'EOF'
Add charedit beams and dashes aim controls.

Authors can set chase beam and spin dash counts (1–4) under
global or character scope with live mesh preview.
EOF
)"
git push origin HEAD
```

---

## Plan self-review

| Spec requirement | Task |
|---|---|
| `beams` / `dashes` on `CHAR_AIM_DEFAULT` (1 / 2) | Task 1 |
| Per-id partial override + resolve | Task 1 (`charAim`) |
| Validate integer 1–4; prune; serialize | Task 1 |
| Preserve on-disk style/speed/color | Task 1 constraint |
| Shader `uBeams` / `uDashes`; spin + chase mapping | Task 2 |
| `solid` / mesh-off ignore counts | Task 2 (unused) + existing SVG |
| Charedit rows + scope + save | Task 3 |
| Unit checks for new keys | Task 1 |

No TBD/placeholder steps. Signatures stay `charAim(id)`, `meshAim(el, on, cfg)`, save `{ meta, aim }`.
