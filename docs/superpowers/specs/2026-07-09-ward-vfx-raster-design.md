# Spirebound — Ward VFX Raster Sprites (design)

**Date:** 2026-07-09  
**Goal:** Replace the CSS circle ward shell and thin canvas gain flash with
**alpha raster sprite sheets** (persistent loop + one-shot gain), driven by CSS
`steps()` / short playback — no SVG rings.  
**Predecessor:** combat `.warded::before` pulse (`styles.css`) + `vfx` archetype
`ward` (`ring` + `motes`).

## Decisions record (owner-approved)

| Question | Decision |
|---|---|
| Medium | **Raster assets** (gpt-image-2 → Nano Banana Pro → alpha), not SVG |
| Persistent | **B** — short sprite (2–4 frames) + CSS `steps()` loop |
| Gain moment | **B** — short sprite (2–4 frames) play-once then remove |
| Scope | Tiny VFX-only; no engine / block math / per-id tint / mesh-follow |

## Context

Today:

- **Persistent:** `.hero-wrap.warded::before` / `.enemy-art.warded::before` —
  perfect circle + blue `box-shadow` pulse.
- **Gain:** canvas `ring` + `motes` (`ARCHETYPE_TONES.ward`); float text still
  uses `shield` SVG icon (keep as readout).

Authors want stained-glass-readable ward FX that match the rest of the raster
pipeline.

## Assets

| Role | Path (proposed) | Layout |
|---|---|---|
| Persistent loop | `src/assets/vfx/ward-loop.png` | Horizontal strip, **4** frames, square cells, alpha |
| Gain burst | `src/assets/vfx/ward-gain.png` | Horizontal strip, **4** frames, square cells, alpha |

- Subject: cool blue / ice-glass ward shell or ripple; leaded contour; generous
  padding; solid `#ff00ff` key for cutout; no text / ground / cast shadow.
- Tone family: `#9fd4ff` / cool glass (matches existing ward VFX colour).
- Scratch + `prompt-ledger.md` under `scratch/ward-vfx-20260709/` before promote.

Resolved via existing `assetUrl('vfx', 'ward-loop')` / `assetUrl('vfx', 'ward-gain')`
(`art.js` glob already covers `assets/<category>/<id>.png`).

## Runtime

### Persistent

- When `block > 0`, show a `.ward-fx` layer on hero / enemy art (replace
  `::before` circle).
- CSS sprite: `background-image` + `background-size: 400% 100%` +
  `@keyframes` with `steps(4)` slow loop (~2–2.4s).
- `mix-blend-mode: screen` (or soft-light) + mild opacity pulse optional.
- `LITE` / `prefers-reduced-motion`: freeze on frame 0 (no steps animation).
- Missing asset → no layer (or keep a minimal CSS fallback only if needed for
  readability; prefer null + chip still shows Ward number).

### Gain

- On `block` gain event (existing drain path that floats `blockf`), spawn a
  short-lived `.ward-gain-fx` at actor centre.
- Same strip layout; play-once `steps(4)` (~0.35–0.5s) then remove node.
- Canvas `ward` archetype can stay as a light underlay **or** be dropped once
  the sprite reads well (prefer drop duplicate ring to avoid double-flash).

## Out of scope

- SVG / procedural shield rings for the shell.
- Per-character ward colour; mesh silhouette follow.
- Changing block math, chips, or float-number format.
- Full status-icon redesign.

## Success criteria

1. With Ward, hero/enemy show looping raster shell (not CSS circle).
2. Gaining Ward plays one-shot raster burst once.
3. `LITE` / reduced-motion: static first frame, no loop thrash.
4. Assets live under `src/assets/vfx/` with scratch ledger; `npm test` green.
