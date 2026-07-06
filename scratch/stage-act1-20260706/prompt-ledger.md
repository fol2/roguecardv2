# Act 1 Stage Layers — Prompt Ledger

Date: 2026-07-06  
Pipeline: Cursor image generation (Step 1 deviation) → Nano Banana Pro → border-connected / `#ff00ff` alpha → `sips -Z 1536`

## Outputs

| Asset | Step 1 source | Nano Banana | Final alpha pick |
|---|---|---|---|
| `act1-backdrop` | `act1-backdrop/01-cursor-source.png` | `act1-backdrop/02-nanobanana-pro-clean.jpg` | `act1-backdrop/03-final-alpha.png` (cursor source, border key, threshold 24) |
| `act1-mid` | `act1-mid/01-cursor-source.png` | `act1-mid/02-nanobanana-pro-clean.jpg` | `act1-mid/03-final-alpha.png` (cursor source, border key, threshold 24) |
| `act1-ledge` | `act1-ledge/01-cursor-source.png` | `act1-ledge/02-nanobanana-pro-clean.jpg` | `act1-ledge/04-nano-ff00ff-alpha.png` (nano clean, explicit `#ff00ff` key) |

## Step 1 prompts (Cursor image gen)

Style block: serious cartoon-gothic stained-glass game art; chunky dark contours; 3–5 jewel-tone masses; matte painterly texture; warm amber rim light; flat `#ff00ff` chroma-key elsewhere.

- **act1-backdrop:** Distant burnt-forest treeline of the Ashen Woods at night from the Spire stone face; charred pine silhouettes, ash-mist, faint amber window lights; broad low-contrast shapes; bottom-anchored; upper third fades out.
- **act1-mid:** Broken gothic stone arch + two hanging iron lanterns on chains; ash sifting; bottom-anchored; flat `#ff00ff` elsewhere.
- **act1-ledge:** Wide battlement ledge top — dark slate flagstones, amber lantern pools, chipped gothic lip, embers in cracks; irregular back edge; flat `#ff00ff` above.

## Alpha notes

- Nano Banana preserved `#ff00ff` on ledge clean-up; explicit `--key ff00ff` gave clean top transparency.
- Backdrop/mid: cursor Step 1 alphas keyed cleaner than Nano Banana (which shifted key colour on 2K JPEG).
- Backdrop top-right corner alpha 95 (minor fringe) — acceptable for gallery v1.

## Review

- Gallery: `?gallery=1` → stage 3/9
- In-game: Act 1 fight — backdrop behind tower haze, mid frames enemies, ledge under combatants
