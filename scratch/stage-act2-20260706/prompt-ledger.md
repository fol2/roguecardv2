# Act 2 Stage Layers — Prompt Ledger

Date: 2026-07-06  
Pipeline: Cursor image generation → `#ff00ff` chroma alpha (no Nano Banana)

## Outputs

| Asset | Source | Alpha |
|---|---|---|
| `act2-backdrop` | `act2-backdrop/01-cursor-source.png` | `act2-backdrop/02-final-alpha.png` (border key, threshold 24) |
| `act2-mid` | `act2-mid/01-cursor-source.png` | `act2-mid/02-final-alpha.png` |
| `act2-ledge` | `act2-ledge/01-cursor-source.png` | `act2-ledge/02-final-alpha.png` (`--key ff00ff`) |

## Prompts

- **act2-backdrop:** Drowned city towers, deep teal water-light, god-rays; flat `#ff00ff` above.
- **act2-mid:** Barnacled sunken arch, pale-green drowned lanterns, kelp; flat `#ff00ff` elsewhere.
- **act2-ledge:** Coral-crusted pier top, cyan-green light pools, sea-glass glints; flat `#ff00ff` above.
