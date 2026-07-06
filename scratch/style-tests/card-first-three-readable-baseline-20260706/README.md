# Card First Three Readable Baseline

Generated on 2026-07-06 with built-in Codex Image Gen.

These are the first three cards from the 60-card production sort in
`docs/card-art-bible.md`, parked in the inactive gallery set:

- `src/assets-readable-baseline/cards/strike.png`
- `src/assets-readable-baseline/cards/defend.png`
- `src/assets-readable-baseline/cards/empower.png`

## Files

- `source/strike-source.png` - built-in Image Gen source on flat green key.
- `source/defend-source.png` - built-in Image Gen source on flat green key.
- `source/empower-source.png` - built-in Image Gen source on flat green key.
- `alpha/*-alpha.png` - local chroma-key alpha outputs before final 512 px
  normalisation.
- `readability-contact.png` - dark-background 128 px and 64 px review sheet.

## Processing

1. Generated with built-in Image Gen on a flat `#00ff00` chroma-key background.
2. Removed the key with
   `/Users/jamesto/.codex/skills/.system/imagegen/scripts/remove_chroma_key.py`.
3. Resized and centred each alpha output to 512 x 512 with ImageMagick.

## Read

- `strike` is the busiest of the three, but the red diagonal blade and circular
  impact still read at 64 px.
- `defend` is the cleanest starter grammar image and should remain the shield
  baseline for later Ward cards.
- `empower` reads as a power emblem without becoming rare-level cathedral
  ceremony.
