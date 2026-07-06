# Event Production Batch - 2026-07-06

This scratch set records the production pass for all eleven Spirebound events.
It first covered the eight events that still needed production art, then closed
the first-three gap by promoting all three approved first events through the
same Nano Banana production standard.

## Scope

First three now promoted through Nano Banana and registered:

- `forgottenShrine`
- `woundedKnight`
- `voidChest`

Remaining eight produced in this batch:

- `emberFountain`
- `forge`
- `gambler`
- `mirror`
- `library`
- `fleshTrader`
- `cursedIdol`
- `ruinedCamp`

## Workflow

Each event now follows the same flow:

```text
small story -> design -> GPT image source -> Nano Banana Pro full-scene clean-up -> src/assets/events/<event-id>.png
```

Event art deliberately keeps its narrative background. This batch does not use
alpha, chroma-key, cutout, or transparent-background control.

Nano Banana settings for every event:

- Model alias: `nanobanana-pro`
- Resolved model: `gemini-3-pro-image`
- Ratio: `3:2`
- Size: `2K`

Nano Banana returned JPEG payloads for these jobs despite `.png` output paths.
Each event folder keeps the original payload when available as
`02-nanobanana-pro-clean-original.jpg`, a true PNG conversion at
`02-nanobanana-pro-clean.png`, and the raw response JSON.

## Review Evidence

- Full 11-event gallery contact sheet:
  `event-production-final-11-contact.jpg`
- Interim progress sheet:
  `event-production-progress-contact.jpg`
- Per-event evidence:
  `<event-id>/prompt-ledger.md`
  `<event-id>/01-gpt-image-source.png`
  `<event-id>/02-nanobanana-pro-clean.png`
  `<event-id>/02-nanobanana-pro-response.json`
  `<event-id>/comparison-sheet.*`

## Gallery Registration

The dev gallery discovers event art through the existing asset glob in
`src/art.js`; no code registration change was needed. Each produced event was
registered by replacing its matching runtime asset:

| Event id | Runtime asset |
|---|---|
| `forgottenShrine` | `src/assets/events/forgottenShrine.png` |
| `woundedKnight` | `src/assets/events/woundedKnight.png` |
| `voidChest` | `src/assets/events/voidChest.png` |
| `emberFountain` | `src/assets/events/emberFountain.png` |
| `forge` | `src/assets/events/forge.png` |
| `gambler` | `src/assets/events/gambler.png` |
| `mirror` | `src/assets/events/mirror.png` |
| `library` | `src/assets/events/library.png` |
| `fleshTrader` | `src/assets/events/fleshTrader.png` |
| `cursedIdol` | `src/assets/events/cursedIdol.png` |
| `ruinedCamp` | `src/assets/events/ruinedCamp.png` |

All final runtime assets are PNGs normalised to max edge 1024 px. The complete
set is also mirrored under `src/assets-readable-baseline/events/` so the
readable-baseline gallery set can review the same event art without changing
the live set registration.
