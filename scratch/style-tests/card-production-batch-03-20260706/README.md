# Card Production Batch 03

Generated on 2026-07-06 with built-in Codex Image Gen.

Batch cards:

- `quickSlash` / Flicker
- `heavyBlow` / Quarry Maul
- `cleave` / Fan of Glass

Reference order in contact sheets:

1. `strike`
2. `eclipseSlash`
3. `twinFangs`
4. `chisel`
5. `firstSpark`
6. `ashBite`
7. `smother`
8. `quickSlash`
9. `heavyBlow`
10. `cleave`

Review sheets:

- `readability-contact-240.png` - review at `240 x 150`.
- `readability-contact-120.png` - review at `120 x 75`.

## Source Outputs

- `quickSlash` rejected v1:
  `/Users/jamesto/.codex/generated_images/019f345e-db31-7052-9925-781d26dd1edb/ig_03ea78698d0e1fe1016a4b099fbfd0819181b065ab1c122469.png`
- `quickSlash` approved generated source:
  `/Users/jamesto/.codex/generated_images/019f345e-db31-7052-9925-781d26dd1edb/ig_03ea78698d0e1fe1016a4b09dff7bc8191b67be1e5a732cd2b.png`
- `heavyBlow` approved generated source:
  `/Users/jamesto/.codex/generated_images/019f345e-db31-7052-9925-781d26dd1edb/ig_03ea78698d0e1fe1016a4b0a2283f08191a3b1220a12ca4e07.png`
- `cleave` approved generated source:
  `/Users/jamesto/.codex/generated_images/019f345e-db31-7052-9925-781d26dd1edb/ig_03ea78698d0e1fe1016a4b0a6220c88191b3878943c4afd619.png`

The exact prompts are recorded in `prompt-ledger.md`.

## Final Gallery Assets

- `src/assets-readable-baseline/cards/quickSlash.png`
- `src/assets-readable-baseline/cards/heavyBlow.png`
- `src/assets-readable-baseline/cards/cleave.png`

## Correction Notes

- `quickSlash` v1 was rejected because the slash was too large and too close to
  the `strike` silhouette. v2 keeps the fast attack read but adds a clearer
  single rising card pane and a smaller, lower slash.
- `heavyBlow` was accepted because the blocky maul silhouette separates it from
  blade and fang attacks, while the blue-grey facet keeps the Facet-chip read.
- `cleave` was accepted because the three broad shard rays read as all-enemies
  damage without drifting into `shardstorm`.

Final gallery assets are byte-for-byte copies of the approved generated
sources. No resize, crop, metadata strip, brightness, contrast, gamma,
saturation, or colour-grading pass is applied to the approved files.

## Source/Gallery Hash Check

```text
3c1fcea51f1b8f4611d5f3f995a59841110b596449b4822ed7a398e8776f24dd  source/quickSlash-source-v2-approved-generated.png
3c1fcea51f1b8f4611d5f3f995a59841110b596449b4822ed7a398e8776f24dd  final/quickSlash.png
3c1fcea51f1b8f4611d5f3f995a59841110b596449b4822ed7a398e8776f24dd  src/assets-readable-baseline/cards/quickSlash.png

415456973fa4ec80d8e2ff0a195a2182f286f5dd80e3e79b306db5f098bc6e34  source/heavyBlow-source-v1-approved-generated.png
415456973fa4ec80d8e2ff0a195a2182f286f5dd80e3e79b306db5f098bc6e34  final/heavyBlow.png
415456973fa4ec80d8e2ff0a195a2182f286f5dd80e3e79b306db5f098bc6e34  src/assets-readable-baseline/cards/heavyBlow.png

4c1f84f4d639c8346acb36a1617f2122bda3bd1cd295032dbc44a4ffc2efd366  source/cleave-source-v1-approved-generated.png
4c1f84f4d639c8346acb36a1617f2122bda3bd1cd295032dbc44a4ffc2efd366  final/cleave.png
4c1f84f4d639c8346acb36a1617f2122bda3bd1cd295032dbc44a4ffc2efd366  src/assets-readable-baseline/cards/cleave.png
```

Rejected source:

```text
5cc1bfac48cba9042059dcc6488797caae6ff2078f008e3e74a570c9f8e7801d  source/quickSlash-source-v1-rejected-too-close-to-strike.png
```

## Review Decision

- `quickSlash`: approved generated source v2. The short red slash and single
  rising card pane stay distinct from `strike` at `120 x 75`.
- `heavyBlow`: approved generated source. The blocky maul reads first; the
  amber impact and blue-grey target facet remain visible at thumbnail size.
- `cleave`: approved generated source. The three broad red shards read as a
  fan/all-enemies attack and do not collapse into one slash or a shard storm.

