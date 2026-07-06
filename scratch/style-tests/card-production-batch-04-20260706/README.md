# Card Production Batch 04

Generated on 2026-07-06 with built-in Codex Image Gen.

Batch cards:

- `venomStrike` / Emberbite
- `lunge` / Dimming Cut
- `guardedStrike` / Warden's Edge

Reference order in contact sheets:

1. `ashBite`
2. `smother`
3. `strike`
4. `quickSlash`
5. `defend`
6. `venomStrike`
7. `lunge`
8. `guardedStrike`

Review sheets:

- `readability-contact-240.png` - review at `240 x 150`.
- `readability-contact-120.png` - review at `120 x 75`.

## Source Outputs

- `venomStrike` rejected v1:
  `/Users/jamesto/.codex/generated_images/019f345e-db31-7052-9925-781d26dd1edb/ig_0afdc83ec987ba3c016a4b0c7fbbb88191b92950425bcea13b.png`
- `venomStrike` approved generated source:
  `/Users/jamesto/.codex/generated_images/019f345e-db31-7052-9925-781d26dd1edb/ig_0afdc83ec987ba3c016a4b0cc8f6308191bc2498ccb22179b7.png`
- `lunge` approved generated source:
  `/Users/jamesto/.codex/generated_images/019f345e-db31-7052-9925-781d26dd1edb/ig_0afdc83ec987ba3c016a4b0d0ef3308191b4e48978934499f5.png`
- `guardedStrike` approved generated source:
  `/Users/jamesto/.codex/generated_images/019f345e-db31-7052-9925-781d26dd1edb/ig_0afdc83ec987ba3c016a4b0d5cfd208191a11413f55982d4bd.png`

The exact prompts are recorded in `prompt-ledger.md`.

## Final Gallery Assets

- `src/assets-readable-baseline/cards/venomStrike.png`
- `src/assets-readable-baseline/cards/lunge.png`
- `src/assets-readable-baseline/cards/guardedStrike.png`

## Correction Notes

- `venomStrike` v1 was rejected because the field became too busy with small
  leadline/mosaic detail. v2 uses a larger hooked fang, broad smoke ribbons,
  and quieter background panes.
- `lunge` was accepted because the long horizontal thrust and small fading blue
  flame separate it from `quickSlash`, `strike`, and Smolder cards.
- `guardedStrike` was accepted because the red blade reads first and the
  half-blue ward reads second; it does not collapse into a pure shield card.

Final gallery assets are byte-for-byte copies of the approved generated
sources. No resize, crop, metadata strip, brightness, contrast, gamma,
saturation, or colour-grading pass is applied to the approved files.

## Source/Gallery Hash Check

```text
395e3b6edc15a129f0e0bbb3863c668498ee0e0f7473d9fbd317d597998d79cc  source/venomStrike-source-v2-approved-generated.png
395e3b6edc15a129f0e0bbb3863c668498ee0e0f7473d9fbd317d597998d79cc  final/venomStrike.png
395e3b6edc15a129f0e0bbb3863c668498ee0e0f7473d9fbd317d597998d79cc  src/assets-readable-baseline/cards/venomStrike.png

67ccb0aa5eea021b67c5f687d8139dc17b35a71cecf7104a0d233f19a0d8511d  source/lunge-source-v1-approved-generated.png
67ccb0aa5eea021b67c5f687d8139dc17b35a71cecf7104a0d233f19a0d8511d  final/lunge.png
67ccb0aa5eea021b67c5f687d8139dc17b35a71cecf7104a0d233f19a0d8511d  src/assets-readable-baseline/cards/lunge.png

758438ac5243f9497cb27f2107928b2c599d01450e706e57dc5e995224b3c9ff  source/guardedStrike-source-v1-approved-generated.png
758438ac5243f9497cb27f2107928b2c599d01450e706e57dc5e995224b3c9ff  final/guardedStrike.png
758438ac5243f9497cb27f2107928b2c599d01450e706e57dc5e995224b3c9ff  src/assets-readable-baseline/cards/guardedStrike.png
```

Rejected source:

```text
80894e77970e1829d944f2980431258fb3546dd3d3a9c0fd1fb4ef80ce723441  source/venomStrike-source-v1-rejected-busy-mosaic.png
```

## Review Decision

- `venomStrike`: approved generated source v2. The longer red hook and
  green-orange smoke trail read as a sharper Ashwarden attack without becoming
  `ashBite` again.
- `lunge`: approved generated source. The horizontal red thrust and fading blue
  flame keep the Dimmed/control read clear at `120 x 75`.
- `guardedStrike`: approved generated source. The red blade remains the first
  read and the blue half-ward remains a secondary layer.

