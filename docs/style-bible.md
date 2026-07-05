# Style bible — generated raster assets

Locked art direction for all `src/assets/` PNGs. Every generation goes through
`tools/genasset.sh`, which prepends the style block and attaches the master
reference — do not free-hand prompts.

## Master reference

`docs/refs/style-master.png` — the approved Duskblade portrait (spike `c1_hero_full`).
Always passed as `--image` so gpt-image-2 matches palette, lead-line weight and lighting.

## Style block (prepended to every prompt)

> Illuminated stained-glass painterly style: bold dark leaded outlines dividing
> the figure into glass panels, jewel-tone translucent colours, warm amber
> lantern rim light, subtle inner glow. Fully transparent background (alpha
> channel). No text, no labels, no watermark.

## Per-category composition

| Category | Composition | Max size (px, `sips -Z`) |
|---|---|---|
| `heroes` | full body, calm idle pose, **facing slightly right**, feet grounded, ~10% margin | 1024 |
| `enemies` | full body, menacing idle, **facing slightly left** (toward the hero), ~10% margin | 1024 |
| `cards` | single centred emblem or moment, square crop, dark vignette edges | 512 |
| `props` | single centred object (chest / campfire / merchant stall) | 512 |
| `potions` | single centred phial, tone colour dominant | 256 |
| `events` | wide scene, 3:2, focal point centre-right | 1024 |
| `title` | wide hero banner, 16:9 | 1536 |

Facing rule exists because combat lays hero left, enemies right. The master ref
faces left — mirror heroes at generation time ("facing slightly right") rather
than flipping the file, so lantern light stays consistent.

## Naming

`src/assets/<category>/<id>.png` — `<id>` is the **internal key** from
`src/data.js` (`ENEMIES` key, `ASPECTS[i].id`, card id, potion id, event id).
Never rename keys for art. Props use: `campfire`, `chest`, `chest-open`, `merchant`.

## Animation note

Idle motion is runtime mesh vertex warp (one image per character — see
`scratch/mesh-spike/`), intensity ~0.25. Art must therefore be a **single
complete figure** — no motion blur, no action pose, no cropped limbs.
Hit/attack/death stay in `src/vfx.js`.

## QA

Every batch goes through `?gallery=1` (dev contact sheet) before it ships.
Reject: wrong facing, opaque/checkered background, style drift (compare against
master ref), cropped silhouettes, baked-in text.
