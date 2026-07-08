# Ward VFX batch prompt ledger - 2026-07-09

Generated for ward loop + gain sprite sheets. Spec: `docs/superpowers/specs/2026-07-09-ward-vfx-raster-design.md`.

## Source workflow

- Generation path: Codex built-in `$imagegen` via `tools/imagegen.sh`.
- Source outputs: `scratch/ward-vfx-20260709/source/`.
- Frame stills: `scratch/ward-vfx-20260709/frames/`.
- Alpha: `scratch/ward-vfx-20260709/alpha/` via `$CODEX_HOME/skills/.system/imagegen/scripts/remove_chroma_key.py`.
- Final sheets: `src/assets/vfx/ward-loop.png`, `src/assets/vfx/ward-gain.png` (1024×256, 4×256 cells).
- Nano Banana Pro: skipped (no GEMINI/RUNAPI key in this session); chroma-key alpha used.

## Shared prompt block

Serious cartoon-gothic stained-glass game VFX: chunky dark outer silhouette, 3-5 large cool blue / ice-glass colour masses with very few thick lead dividers, matte painterly texture, soft cyan-blue inner glow (#9fd4ff family). Square transparent-ready emblem, solid #ff00ff background, no text, no labels, no watermark. Single centred ward shell or ripple only; generous padding (~15% margin); no character, no hands, no full scene, no ground plane, no contact shadow. Do not use #ff00ff inside the subject.

## Attempts

| id | subject | source | notes |
|---|---|---|---|
| ward-loop-0 | closed cool-blue glass ward ring / crescent shell, leaded contour, calm | source/ward-loop-0.png | ok |
| ward-loop-1 | same shell, panes slightly brighter, tiny lead shift | source/ward-loop-1.png | ok |
| ward-loop-2 | same shell, glow peak | source/ward-loop-2.png | ok |
| ward-loop-3 | same shell, returning toward calm | source/ward-loop-3.png | ok |
| ward-gain-0 | tight cool glass ripple ring at centre | source/ward-gain-0.png | ok |
| ward-gain-1 | ripple expanding, light shards starting | source/ward-gain-1.png | ok |
| ward-gain-2 | wide glass burst ring, shards mid | source/ward-gain-2.png | ok |
| ward-gain-3 | fading outer ripple, shards dissolving | source/ward-gain-3.png | ok |
