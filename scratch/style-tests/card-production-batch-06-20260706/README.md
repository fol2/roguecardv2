# Card Production Batch 06

Generated on 2026-07-06 with built-in Codex Image Gen.

Batch cards:

- `deflect` / Refract
- `leechBlade` / Thirsting Shard
- `tempest` / Hailglass

Reference order in contact sheets:

1. `defend`
2. `smother`
3. `sidestep`
4. `firstSpark`
5. `strike`
6. `ashBite`
7. `venomStrike`
8. `cleave`
9. `twinFangs`
10. `deflect`
11. `leechBlade`
12. `tempest`

Review sheets:

- `readability-contact-240.png` - review at `240 x 150`.
- `readability-contact-120.png` - review at `120 x 75`.

## Source Outputs

- `deflect` rejected v1:
  `/Users/jamesto/.codex/generated_images/019f345e-db31-7052-9925-781d26dd1edb/ig_075363ba590ef926016a4b12d91ddc8191b1f57d4b0c21e2ae.png`
- `deflect` approved generated source v2:
  `/Users/jamesto/.codex/generated_images/019f345e-db31-7052-9925-781d26dd1edb/ig_07d93a6cbff11daf016a4b14b68d888191af5dde4a733cd74a.png`
- `leechBlade` rejected v1:
  `/Users/jamesto/.codex/generated_images/019f345e-db31-7052-9925-781d26dd1edb/ig_075363ba590ef926016a4b1318b33481918e5d0d802def7ec7.png`
- `leechBlade` approved generated source v2:
  `/Users/jamesto/.codex/generated_images/019f345e-db31-7052-9925-781d26dd1edb/ig_07d93a6cbff11daf016a4b14f9d3048191a874d547f0a5e9f6.png`
- `tempest` approved generated source:
  `/Users/jamesto/.codex/generated_images/019f345e-db31-7052-9925-781d26dd1edb/ig_075363ba590ef926016a4b13b3c460819197c9debc3f781223.png`

The exact prompts are recorded in `prompt-ledger.md`.

## Final Gallery Assets

- `src/assets-readable-baseline/cards/deflect.png`
- `src/assets-readable-baseline/cards/leechBlade.png`
- `src/assets-readable-baseline/cards/tempest.png`

## Correction Notes

- `deflect` v1 was rejected because the red ray read too close to one straight
  beam passing through the pane. v2 locks a visible kink: incoming ray, contact
  point, and a separate outgoing segment.
- `leechBlade` v1 was rejected because the oil and healing cue were too small
  at thumbnail distance. v2 enlarges the dark oil bead and keeps one readable
  green-gold repair seam.
- `tempest` v1 was accepted because the pale shard ring, small crimson core,
  and three struck panes remain readable at `120 x 75`.

Final gallery assets are byte-for-byte copies of the approved generated
sources. No resize, crop, metadata strip, brightness, contrast, gamma,
saturation, or colour-grading pass is applied to the approved files.

## Source/Gallery Hash Check

```text
ff20229796a230f3c41912b2a546c993059a52580b490ed77e2c82494d9744f4  source/deflect-source-v2-approved-generated.png
ff20229796a230f3c41912b2a546c993059a52580b490ed77e2c82494d9744f4  final/deflect.png
ff20229796a230f3c41912b2a546c993059a52580b490ed77e2c82494d9744f4  src/assets-readable-baseline/cards/deflect.png

8f7d7e06398dfcbc5bf9217f6db2e2bc41c92051dff56c16c47eb24fbe1dbb5c  source/leechBlade-source-v2-approved-generated.png
8f7d7e06398dfcbc5bf9217f6db2e2bc41c92051dff56c16c47eb24fbe1dbb5c  final/leechBlade.png
8f7d7e06398dfcbc5bf9217f6db2e2bc41c92051dff56c16c47eb24fbe1dbb5c  src/assets-readable-baseline/cards/leechBlade.png

f7a43d79923802fe9e7aa702390e89c5f15973259f39ad0f38e41dcf0f1d4542  source/tempest-source-v1-approved-generated.png
f7a43d79923802fe9e7aa702390e89c5f15973259f39ad0f38e41dcf0f1d4542  final/tempest.png
f7a43d79923802fe9e7aa702390e89c5f15973259f39ad0f38e41dcf0f1d4542  src/assets-readable-baseline/cards/tempest.png
```

Rejected sources:

```text
9c8019cbda46f28ef9395f77143832d289b4834ead725437d01545eb084c87d0  source/deflect-source-v1-rejected-straight-ray.png
7fab5220c64ba5bb512f018693c9182de0ef982f3b9974a77527b4cc8ef3ca69  source/leechBlade-source-v1-rejected-small-heal-read.png
```

## Review Decision

- `deflect`: approved generated source v2. The hand, blue mirror pane, and
  bent red ray are distinct at `120 x 75`; the reflected card pane remains
  secondary.
- `leechBlade`: approved generated source v2. The red blade reads first, with
  the oil bead and green-gold repair seam visible enough to carry the healing
  twist.
- `tempest`: approved generated source. The hail ring reads as all-enemies
  damage, and the three target panes prevent it from collapsing into a generic
  storm.

