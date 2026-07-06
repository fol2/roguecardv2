# Act 3 Stage Layers — Prompt Ledger

Date: 2026-07-06  
Pipeline: Cursor image generation → `#00ff00` chroma alpha (NOT `#ff00ff` — Act 3 uses hot magenta in scenery)

## Why green key

Act 3 palette includes hot magenta judgement glow, heat-lightning, and fracture seams. Magenta chroma (`#ff00ff`) keys out subject pixels. Use **bright lime `#00ff00`** for sky/void areas only; green must not appear in painted art.

## Outputs

| Asset | Source | Alpha |
|---|---|---|
| `act3-backdrop` | `act3-backdrop/01-greenkey-source.png` | `act3-backdrop/04-greenkey-alpha.png` |
| `act3-mid` | `act3-mid/01-greenkey-source.png` | `act3-mid/04-greenkey-alpha.png` |
| `act3-ledge` | `act3-ledge/01-greenkey-source.png` | `act3-ledge/04-greenkey-alpha.png` |

Alpha command: `remove_chroma_key.py --key 00ff00 --soft-matte --transparent-threshold 20 --opaque-threshold 220 --despill --edge-contract 1`

## Prompts (style block + subject)

- **act3-backdrop:** Obsidian crag spires, storm sky, broken-orbit ring behind peaks, magenta heat-lightning at horizon; bottom-anchored; flat `#00ff00` above.
- **act3-mid:** Shattered basalt colonnade, floating fractured halo fragment, ember weather; magenta/violet accents; flat `#00ff00` elsewhere.
- **act3-ledge:** Black glassy obsidian platform top, magenta light seams in fractures, sharp chipped lip; flat `#00ff00` above back edge.

## Validation (2026-07-06)

- Top corners alpha = 0 on all three
- Magenta ground cracks / fracture glow remain opaque (sample lower-half alpha = 255)
- Partial-pixel fringe low (1.7k–12k vs 500k+ on failed magenta-key pass)
