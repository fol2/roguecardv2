# Spirebound — Aim Outline Halo (design)

**Date:** 2026-07-08  
**Goal:** Make card-hover target outlines more readable and game-y with selectable
halo styles (`spin` / `chase` / `solid`), editable in `?charedit=1` with a
bfedit-style **global vs character** scope, without breaking mesh float/warp
tracking or the existing `aimOn` visibility gate.  
**Predecessor:** combat aim rings (`813c124`) + charedit outline toggle fix
(`9c1fa96`).

## Decisions record (owner-approved)

| Question | Decision |
|---|---|
| Halo feel | **A + B selectable** — `spin` (dashed/spark along silhouette) and `chase` (marching pulse along edge); also keep `solid` |
| Default style | **`spin`** (A); charedit can switch to `chase` or `solid` |
| Per-mob knobs | **B** — `style`, `speed`, `color` only |
| Storage | **Approach 1** — live in `char-meta.js` (`CHAR_AIM_DEFAULT` + `CHAR_META[id].aim`) |
| Editor UX | Charedit panel; each aim field has a **scope dropdown** (`global` / `character`), like bfedit |
| Preview | Existing **aim outline preview** checkbox stays (default off) |

## Context

Combat already paints a silhouette aim ring on card hover (mesh-shared geometry
when warp is live; SVG fallback when mesh is off). Charedit can preview that
ring, but layout must respect `aimOn` so the toggle is not forced on every
frame.

This pass upgrades the ring from a single solid stroke into three styles, with
authorable global defaults and optional per-character overrides.

## Data shape

```js
export const CHAR_AIM_DEFAULT = {
  style: 'spin',      // 'spin' | 'chase' | 'solid'
  speed: 1,           // 0.25–3
  color: '#fff6ec',
};

// optional partial override on a character entry
CHAR_META[id].aim = { style?, speed?, color? };
```

**Resolve:** `{ ...CHAR_AIM_DEFAULT, ...(CHAR_META[id].aim || {}) }`.

- Missing per-id fields inherit global.
- Clearing a character field deletes that key (or the whole `aim` object if empty).
- Hero self-target may apply a runtime tint (e.g. `#e8f7ff`) without storing a
  separate hero default in meta.
- Serialize / validate / prune in `char-serialize.js` grow `aim` keys the same
  way `shadow` / `mesh` already do.

## Charedit UI

Add an **Aim outline** block near mesh/float:

1. **aim outline preview** checkbox (unchanged behaviour; default off).
2. Fields: `style` (select), `speed` (range), `color` (text/swatch).
3. Each field row has a scope `<select>`:
   - `global` → writes `CHAR_AIM_DEFAULT`
   - `character` → writes `CHAR_META[currentId].aim`
4. Override marker `●` when character differs from global; `×` clears the
   character override for that field.
5. Editing under `global` updates the default live for every character without
   an override.
6. **Save** still writes `src/char-meta.js` (defaults + table together).

## Mesh / runtime

- `charAim(id)` returns the resolved `{ style, speed, color }`.
- `meshAim(el, on, opts?)` applies resolved config; combat passes the
  enemy/hero id when enabling the ring.
- Styles share the deformed body geometry + float layout (same as today):

  | style | Behaviour |
  |---|---|
  | `spin` | Dashed / spark segments travel around the silhouette (`uTime * speed`) |
  | `chase` | Solid-ish edge with a bright pulse chasing along the perimeter |
  | `solid` | Current static dilated ring |

- Shader uniforms: `uStyle`, `uSpeed`, `uColor`, `uTime` (tick updates time).
- `aimOn` remains the visibility gate (charedit toggle + combat hover).
- **Mesh off:** SVG fallback keeps `solid` faithful; `spin` / `chase` may
  simplify or fall back to `solid` (document which in the plan).
- Combat behaviour unchanged: show ring while inspecting a card with a known
  default target (`self` / sole `enemy` / `allEnemies`); hide when armed for
  multi-target pick.

## Out of scope

- New combat targeting rules or auto-aim.
- Per-act / per-shape aim overrides (only global + character).
- Extra knobs beyond style/speed/color (dash length, width, etc.) — YAGNI.
- Regenerating raster art; engine mechanics; Playwright baseline churn unless a
  visual gate already covers combat hover (prefer probe-level checks first).

## Success criteria

1. Default combat hover uses **spin** from `CHAR_AIM_DEFAULT`.
2. Charedit can switch style to chase/solid and edit speed/color under **global**
   or **character** scope; Save persists to `char-meta.js`.
3. Character override clears cleanly back to global.
4. Outline still tracks mesh float/warp; preview toggle still works (`aimOn`).
5. Mesh-off path does not crash; at least solid remains visible.
