# Event Production Batch - 2026-07-06

This scratch set records the production pass for the eight remaining Spirebound
events after the first three gallery-registered events.

## Scope

Already registered before this batch:

- `forgottenShrine`
- `woundedKnight`
- `voidChest`

Produced in this batch:

- `emberFountain`
- `forge`
- `gambler`
- `mirror`
- `library`
- `fleshTrader`
- `cursedIdol`
- `ruinedCamp`

## Workflow

Each produced event followed the same flow:

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
Each event folder keeps the original payload as
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
| `emberFountain` | `src/assets/events/emberFountain.png` |
| `forge` | `src/assets/events/forge.png` |
| `gambler` | `src/assets/events/gambler.png` |
| `mirror` | `src/assets/events/mirror.png` |
| `library` | `src/assets/events/library.png` |
| `fleshTrader` | `src/assets/events/fleshTrader.png` |
| `cursedIdol` | `src/assets/events/cursedIdol.png` |
| `ruinedCamp` | `src/assets/events/ruinedCamp.png` |

All final runtime assets are PNGs normalised to max edge 1024 px.
