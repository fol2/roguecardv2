# Mesh warp spike

Decision record: cutout/rig animation = NO GO, FFD = NO GO.
**GO: per-vertex mesh warp** — one full portrait on a subdivided three.js plane,
feet pinned, sway/breathe/bob/head-tilt/cloth ripple. Intensity sweet spot ~0.2–0.3.
Hit/attack/death reactions stay in the game's existing VFX layer (`src/vfx.js`).

## View

```bash
npm run spike:mesh
```

Open http://127.0.0.1:5199/ — toggles: animate, wireframe, intensity slider.
