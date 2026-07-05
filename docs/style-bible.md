# Style bible — generated raster assets

Locked art direction for all `src/assets/` PNGs. Current generation workflow is
documented in [`generated-art-workflow.md`](./generated-art-workflow.md):
`gpt-image-2 -> Nano Banana Pro -> alpha cutout -> gallery review`.

## Master reference

`docs/refs/style-master.png` — the approved Duskblade portrait (spike
`c1_hero_full`). Use it as a style reference when matching palette, lead-line
weight, glass texture, and lantern lighting.

## Style block (prepended to every prompt)

> Serious cartoon-gothic stained-glass game art: chunky dark outer silhouette,
> simplified exaggerated proportions, one iconic readable prop or pose, 3-5
> large jewel-tone glass colour masses with very few thick lead dividers, matte
> painterly texture, warm amber rim light, soft controlled inner glow. Designed
> to remain readable at 128px. Fully transparent background (alpha channel). No
> text, no labels, no watermark.

## Readability priority

Silhouette first, pose second, face/weapon/core symbol third, colour fourth,
texture last. The subject must still be recognisable as a black shadow with all
internal details removed. Avoid lacework, micro-panels, complex anatomy
segmentation, ornate armour noise, scattered sparkles, noisy bloom, and glossy
3D rendering.

Enemy characters should still have personality. Keep them serious inside the
world, but let them be cute, funny, or interesting through compact proportions,
expressive faces, and one memorable threat shape. Do not push them into heroic
stance, elegant armour, noble cloak, or protagonist framing.

## Per-category composition

| Category | Composition | Max size (px, `sips -Z`) |
|---|---|---|
| `heroes` | full body, calm idle pose, **facing slightly right**, feet grounded, ~10% margin | 1024 |
| `enemies` | full body, menacing idle, **facing slightly left** (toward the hero), ~12-18% margin | 1024 |
| `cards` | single centred emblem or moment, square crop, dark vignette edges | 512 |
| `props` | single centred object (chest / campfire / merchant stall) | 512 |
| `potions` | single centred phial, tone colour dominant | 256 |
| `events` | wide scene, 3:2, focal point centre-right | 1024 |
| `title` | wide hero banner, 16:9 | 1536 |

Facing rule exists because combat lays hero left, enemies right. The master ref
faces left — mirror heroes at generation time ("facing slightly right") rather
than flipping the file, so lantern light stays consistent.

Enemy art can be humanoid-monster, but should not read like a hero. Goblin,
troll, orc, cultist, imp, and beast forms are allowed when they use enemy shape
language: crooked posture, low centre of gravity, feral or grubby proportions,
asymmetry, and one readable threat shape. Avoid noble cloaks, elegant armour,
upright protagonist poses, clean symmetry, and knight/priest/warden silhouettes.

## Naming

`src/assets/<category>/<id>.png` — `<id>` is the **internal key** from
`src/data.js` (`ENEMIES` key, `ASPECTS[i].id`, card id, potion id, event id).
Never rename keys for art. Props use: `campfire`, `chest`, `chest-open`, `merchant`.

Inactive candidate sets can mirror the same structure under
`src/assets-readable-baseline/`. Normal gameplay continues to select the `live`
set from `src/assets`; only use folder swaps once the candidate set is complete.

The dev gallery should stay clean after promotion: keep only `live` and
`readable-baseline` registered in `ASSET_SETS` in `src/art.js`. Temporary
runtime review folders can be registered during an active council pass, but
remove them after approval or rejection; keep the source prompts and comparison
evidence in scratch instead.

## Animation note

Idle motion is runtime mesh vertex warp (one image per character — see
`scratch/mesh-spike/`), intensity ~0.25. Art must therefore be a **single
complete figure** — no motion blur, no action pose, no cropped limbs.
Hit/attack/death stay in `src/vfx.js`.

## QA

Every batch goes through `?gallery=1` (dev contact sheet) before it ships.
Reject: wrong facing, opaque/checkered background, style drift (compare against
master ref), cropped silhouettes, baked-in text.
