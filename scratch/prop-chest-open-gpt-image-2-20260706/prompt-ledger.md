# Chest-Open GPT Promotion

Date: 2026-07-06

Scope: `chest-open` was regenerated from the approved closed chest image using
built-in GPT-image-2 image-to-image, then converted through the local alpha
pipeline. This GPT opened state was selected for live promotion over the later
Nano Banana opened variant because the blink validation kept the treasure chest
footprint closer to the closed state.

## Inputs And Outputs

| Stage | Path | Notes |
|---|---|---|
| Closed reference | `../prop-chest-nanobanana-20260706/final/chest-nanobanana-alpha-512x409.png` | Identity reference used for the image-to-image generation. |
| GPT source | `source/chest-open-gpt-image-2-review-source.png` | Built-in GPT-image-2 review source on green pre-alpha background. |
| Soft alpha candidate | `final/chest-open-gpt-alpha-soft.png` | First local chroma-key alpha candidate. |
| Edge-contract alpha candidate | `final/chest-open-gpt-alpha-edge-contract.png` | Cleaner alpha candidate used as the selected base. |
| Selected full-size alpha | `final/chest-open-gpt-alpha.png` | Edge-contract alpha with semi-transparent green spill cleanup. |
| Runtime-size final | `final/chest-open-gpt-alpha-512x409.png` | 512 x 409 RGBA candidate promoted to `src/assets/props/chest-open.png`. |
| Blink validation | `review/chest-closed-gpt-open-validation-blink.gif` | Closed/open blink test with fixed centre and baseline guides. |
| GPT/Nano comparison | `review/chest-open-gpt-vs-nano-runtime-comparison.png` | Closed, GPT opened, and Nano opened runtime comparison. |

Original generated source:

```text
/Users/jamesto/.codex/generated_images/019f3461-7cb7-7b62-97be-c2e5f810867d/ig_00e6f0ed3c84810a016a4be6c4673881919939c8b4d44e4a43.png
```

## GPT-Image-2 Prompt

```text
Use the provided reference image as the edit target and style/identity reference. Generate an opened version of the same Spirebound treasure chest prop for review.

Use case: precise-object-edit
Asset type: Spirebound runtime prop review candidate for `chest-open`, intended final target 512 x 409 RGBA after later alpha processing
Input image role: edit target and identity lock. Preserve the same chest design, same chapel alcove, same low three-quarter camera angle, same horizontal footprint, same stone arch silhouette, same gold-black stained-glass material language, same ward-line story cues, same palette family, and same transparent-edge vignette composition.

Primary edit: Open the chest. The lid should be raised upward/backward but still visibly attached to the same coffer and still within roughly the same overall footprint. The chest must read as the open state of the exact same closed chest, not a redesign.

Story moment: The old tribute coffer releases stored tower light rather than a messy pile of treasure. The player has claimed something sealed for a long time.

Subject requirements: the same low heavy stained-glass tribute chest, now open; warm amber-white tower light rising from inside; a few simple card-like and relic-like silhouettes suspended in the glow. Keep the chest front, lock plate, gold bands, black lead lines, and side panels recognisably consistent with the reference.

Scene/backdrop: preserve the same shallow cracked chapel alcove, now slightly illuminated by the warm released light. Keep the alcove lower contrast than the chest. The backdrop should still fade before the image edges.

Composition/framing: centred, low three-quarter view matching the reference; horizontal prop image; no jump in object position versus the closed state; generous transparent-friendly padding; readable at 128 px. Keep the open lid below the top of the alcove arch so it does not make the asset too tall.

Style/medium: serious cartoon-gothic stained-glass game art; chunky black lead outlines; matte painterly glass panes; polished game prop illustration; bright but controlled reward reveal.

Lighting/mood: brighter than the closed chest, warm amber-white core glow, but not overexposed. Cool blue-violet shadows still visible at the alcove edges.

Alpha/chroma request for this gpt-image-2 review source: if a background is needed, use a perfectly flat solid #00ff00 chroma-key field outside the prop vignette only. Do not use #00ff00 in the subject. No cast shadow, contact shadow, floor plane, text, labels, UI, watermark, frame, full rectangular room, scattered coin pile, huge explosion, or changed chest design.
```

## Alpha Pipeline

Soft alpha candidate:

```bash
python3 /Users/jamesto/.codex/skills/imagegen/scripts/remove_chroma_key.py \
  --input scratch/prop-chest-open-gpt-image-2-20260706/source/chest-open-gpt-image-2-review-source.png \
  --out scratch/prop-chest-open-gpt-image-2-20260706/final/chest-open-gpt-alpha-soft.png \
  --auto-key border \
  --soft-matte \
  --transparent-threshold 24 \
  --opaque-threshold 220 \
  --despill \
  --force
```

Edge-contract candidate:

```bash
python3 /Users/jamesto/.codex/skills/imagegen/scripts/remove_chroma_key.py \
  --input scratch/prop-chest-open-gpt-image-2-20260706/source/chest-open-gpt-image-2-review-source.png \
  --out scratch/prop-chest-open-gpt-image-2-20260706/final/chest-open-gpt-alpha-edge-contract.png \
  --auto-key border \
  --soft-matte \
  --transparent-threshold 32 \
  --opaque-threshold 160 \
  --despill \
  --edge-contract 1 \
  --force
```

The selected alpha is based on the edge-contract candidate. A narrow cleanup
pass only desaturated green spill on semi-transparent edge pixels, preserving
the central green relic gem.

The 512 x 409 runtime candidate was fit from the selected alpha bbox to a
475 x 380 content box and pasted at `(18, 8)`, matching the closed chest
baseline at `y=388`.

## Validation

```text
path: final/chest-open-gpt-alpha-512x409.png
size: 512 x 409
mode: RGBA
corner alpha: 0, 0, 0, 0
alpha bbox: (18, 8, 493, 388)
alpha counts: 85,900 transparent; 5,574 partial; 117,934 opaque
sha256: 19e5b5101463cba1845e4d535499964b2756ffdf7924bb4b8c65d710d73bfa50
```

Live promotion:

```text
src/assets/props/chest.png      63f4e1cdc1c9f71b81f22cdcf369ef60f5819029389ec8233af303da1f8bb219
src/assets/props/chest-open.png 19e5b5101463cba1845e4d535499964b2756ffdf7924bb4b8c65d710d73bfa50
```
