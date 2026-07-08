# Spirebound — Aim Beams / Dashes Counts (design)

**Date:** 2026-07-08  
**Goal:** Let authors set how many chase **beams** and spin **dashes** appear on
the aim outline (each independently, range 1–4), via the same global /
character scope path as existing aim knobs.  
**Predecessor:** Aim outline halo (`docs/superpowers/specs/2026-07-08-aim-outline-halo-design.md`),
shipped as `spin` / `chase` / `solid` with `style` / `speed` / `color`.

## Decisions record (owner-approved)

| Question | Decision |
|---|---|
| What to count | **C** — separate knobs: `beams` (chase) and `dashes` (spin) |
| Defaults | **A** — `beams: 1`, `dashes: 2` |
| Storage / API | **Approach 1** — extend `CHAR_AIM_DEFAULT` + per-id `aim` (same serialize / charedit / meshAim path) |
| `solid` | Ignores both counts |
| Mesh-off SVG | Remains always solid (no CSS multi-beam) |

## Context

Chase currently draws **one** pulse head along the silhouette. Spin uses a
hard-coded dash density (`* 8.0` in the fragment shader). Authors want numbered
multiplicity without collapsing both styles into a single shared `count`.

## Data shape

```js
export const CHAR_AIM_DEFAULT = {
  style: 'spin',       // existing
  speed: 1,
  color: '#fff6ec',
  beams: 1,            // chase only — integer 1..4
  dashes: 2,           // spin only — integer 1..4
};

CHAR_META[id].aim = { style?, speed?, color?, beams?, dashes? };
```

**Resolve:** unchanged merge — `{ ...CHAR_AIM_DEFAULT, ...(CHAR_META[id].aim || {}) }`.

- Validate: `beams` / `dashes` are finite integers in `[1, 4]`.
- Prune: omit when equal to the aim default used for serialize.
- Existing saves without these keys inherit defaults on resolve (no migration
  rewrite required).

## Shader / runtime

Mesh `AIM_FRAG` gains `uBeams` and `uDashes` (floats from JS).

| style | Mapping |
|---|---|
| `spin` | Dash mask uses `uDashes` instead of hard-coded `8.0` (e.g. `fract(ang/τ * uDashes - uTime * uSpeed)`). `dashes: 2` is the intended “medium” default. |
| `chase` | `uBeams` evenly spaced pulse heads around the perimeter (phase offset `i / uBeams`). |
| `solid` | Counts unused. |

`meshAim(el, on, cfg)` sets both uniforms from resolved `cfg` (fallback 1 / 2 if
missing). Combat and charedit keep passing `charAim(id)` / `aimOf(id)`.

## Charedit UI

Aim panel adds two rows (same scope pattern as style/speed/color):

| Field | Control | Scope |
|---|---|---|
| `beams` | range + number, 1–4, step 1 | `global` / `character` |
| `dashes` | range + number, 1–4, step 1 | `global` / `character` |

- Hint: beams apply to chase; dashes apply to spin (rows stay enabled so authors
  can set defaults before switching style).
- Preview checkbox + live `meshAim` refresh unchanged.
- Save body still `{ meta, aim }` with full aim default including counts.

## Out of scope

- CSS / SVG multi-beam for `?mesh=0`.
- Extra knobs (beam width, dash duty cycle, direction).
- Retuning combat targeting rules.
- Forcing a rewrite of author-tuned `CHAR_AIM_DEFAULT.style/speed/color` already
  on disk — only **add** `beams` / `dashes` defaults when serializing.

## Success criteria

1. Global default includes `beams: 1`, `dashes: 2`; resolve fills missing keys.
2. Chase with `beams: 2|3|4` shows that many evenly spaced pulses; spin with
   `dashes: 1..4` changes segment count.
3. Charedit can edit each under global or character scope; clear × restores
   inherit; Save persists both.
4. `solid` and mesh-off paths unchanged / non-crashing.
5. Unit checks cover validate/prune/serialize for the new keys.
