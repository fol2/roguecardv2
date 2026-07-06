# Card Production Batch 05

Generated on 2026-07-06 with built-in Codex Image Gen.

Batch cards:

- `brace` / Held Light
- `sidestep` / Glasstep
- `preparation` / Tinder

Reference order in contact sheets:

1. `defend`
2. `guardedStrike`
3. `firstSpark`
4. `quickSlash`
5. `brace`
6. `sidestep`
7. `preparation`

Review sheets:

- `readability-contact-240.png` - review at `240 x 150`.
- `readability-contact-120.png` - review at `120 x 75`.

## Source Outputs

- `brace` rejected v1:
  `/Users/jamesto/.codex/generated_images/019f345e-db31-7052-9925-781d26dd1edb/ig_07a772fb45d3d1e8016a4b0f785c2c8191b5b4ddfb93acdfcd.png`
- `brace` approved generated source:
  `/Users/jamesto/.codex/generated_images/019f345e-db31-7052-9925-781d26dd1edb/ig_07a772fb45d3d1e8016a4b0fc1b30c8191a10e5aa20dbdecba.png`
- `sidestep` approved generated source:
  `/Users/jamesto/.codex/generated_images/019f345e-db31-7052-9925-781d26dd1edb/ig_07a772fb45d3d1e8016a4b100fc6f88191b4b01f1e62ae8148.png`
- `preparation` approved generated source:
  `/Users/jamesto/.codex/generated_images/019f345e-db31-7052-9925-781d26dd1edb/ig_07a772fb45d3d1e8016a4b105c0d748191bb4709deeb995abc.png`

The exact prompts are recorded in `prompt-ledger.md`.

## Final Gallery Assets

- `src/assets-readable-baseline/cards/brace.png`
- `src/assets-readable-baseline/cards/sidestep.png`
- `src/assets-readable-baseline/cards/preparation.png`

## Correction Notes

- `brace` v1 was rejected because the ward felt too large and ceremonial for a
  common defensive skill. v2 keeps the crouched figure, amber lantern, and
  simpler blue crescent read.
- `sidestep` was accepted because the blue glass step reads first, the red
  missed strike reads second, and the card pane remains secondary.
- `preparation` was accepted because the stacked blue panes and tiny unlit
  match read as pre-ignition setup rather than `firstSpark`.

Final gallery assets are byte-for-byte copies of the approved generated
sources. No resize, crop, metadata strip, brightness, contrast, gamma,
saturation, or colour-grading pass is applied to the approved files.

## Source/Gallery Hash Check

```text
9c05b598dd55923ddd67a57a4cd83554c55470cc59f169674d2cf286fb392568  source/brace-source-v2-approved-generated.png
9c05b598dd55923ddd67a57a4cd83554c55470cc59f169674d2cf286fb392568  final/brace.png
9c05b598dd55923ddd67a57a4cd83554c55470cc59f169674d2cf286fb392568  src/assets-readable-baseline/cards/brace.png

050a605f87c0b33bb87a0ad7d66374f5bb8b76c2117fccdcd5e704968d079e74  source/sidestep-source-v1-approved-generated.png
050a605f87c0b33bb87a0ad7d66374f5bb8b76c2117fccdcd5e704968d079e74  final/sidestep.png
050a605f87c0b33bb87a0ad7d66374f5bb8b76c2117fccdcd5e704968d079e74  src/assets-readable-baseline/cards/sidestep.png

1431a51a1afef19bca1903be62e50ca4868037228e196757cf36061ff07dde65  source/preparation-source-v1-approved-generated.png
1431a51a1afef19bca1903be62e50ca4868037228e196757cf36061ff07dde65  final/preparation.png
1431a51a1afef19bca1903be62e50ca4868037228e196757cf36061ff07dde65  src/assets-readable-baseline/cards/preparation.png
```

Rejected source:

```text
bc2e988d7b7e5fa3320e62076baae09733c6632eee2585b52e93a6ab8ca8d17b  source/brace-source-v1-rejected-too-grand.png
```

## Review Decision

- `brace`: approved generated source v2. The crouched figure, amber lantern,
  and blue crescent ward separate at `120 x 75`.
- `sidestep`: approved generated source. The blue glass step is the first read;
  the missed red strike and small rising pane stay secondary.
- `preparation`: approved generated source. The card stack and tiny unlit match
  read as calm setup without active ignition.

