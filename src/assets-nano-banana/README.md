# Nano Banana Pro Asset Set

Comparison-only raster set for reviewing Nano Banana Pro card art against the
current live GPT-generated card assets.

Normal gameplay still uses the `live` set in `src/assets/`. This folder is
registered as the `nano-banana` gallery set in `src/art.js` so it can be opened
with:

```text
http://localhost:5174/?gallery=1&set=nano-banana
```

First comparison slice, generated on 2026-07-06:

- `cards/strike.jpg`
- `cards/defend.jpg`
- `cards/eclipseSlash.jpg`
- `cards/chisel.jpg`
- `cards/firstSpark.jpg`

Second comparison slice, generated on 2026-07-06:

- `cards/ashBite.jpg`
- `cards/smother.jpg`
- `cards/twinFangs.jpg`
- `cards/quickSlash.jpg`
- `cards/heavyBlow.jpg`

Source prompts, rejected evidence, hashes, and the live-vs-Nano contact sheet
are recorded in:

```text
scratch/style-tests/card-nano-banana-pro-comparison-20260706/prompt-ledger.md
scratch/style-tests/card-nano-banana-pro-comparison-02-20260706/prompt-ledger.md
```

The accepted gallery files are byte-for-byte copies of the Nano Banana Pro
source outputs. Do not apply local brightness, contrast, colour, crop, resize,
format conversion, or metadata-stripping passes to this comparison set.
