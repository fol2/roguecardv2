# Chest-Open Nano Banana Pass

Date: 2026-07-06

Scope: run Nano Banana Pro over the approved GPT-image-2 `chest-open` review
source. This pass is for review only. No alpha pipeline, runtime promotion, or
gallery registration has been done yet.

## Inputs And Outputs

| Stage | Path | Notes |
|---|---|---|
| GPT input | `../prop-chest-open-gpt-image-2-20260706/source/chest-open-gpt-image-2-review-source.png` | 1402 x 1122 RGB source. |
| Nano original | `nano/chest-open-nanobanana-pre-alpha-original.jpg` | Original Nano output bytes; model returned JPEG. |
| Nano review PNG | `nano/chest-open-nanobanana-pre-alpha.png` | Converted PNG copy for review; still on green pre-alpha background. |
| Raw response | `nano/chest-open-nanobanana-response.json` | Raw response from the Nano tool. |
| Comparison sheet | `review/chest-open-nanobanana-comparison.png` | Closed reference, GPT source, Nano pass. |
| Soft alpha candidate | `final/chest-open-alpha-soft.png` | First local chroma-key alpha candidate. |
| Edge-contract alpha candidate | `final/chest-open-alpha-edge-contract.png` | Cleaner local chroma-key alpha candidate. |
| Selected full-size alpha | `final/chest-open-nanobanana-alpha.png` | Edge-contract alpha with partial-edge green spill cleanup. |
| Runtime-size final | `final/chest-open-nanobanana-alpha-512x409.png` | Selected 512 x 409 RGBA candidate. |
| Alpha candidate review | `review/chest-open-alpha-candidates.png` | Nano pre-alpha, soft alpha, edge-contract alpha. |
| Alpha pipeline contact | `review/chest-open-alpha-pipeline-contact.png` | Nano pre-alpha, selected alpha, runtime final. |
| Closed/open runtime review | `review/chest-closed-open-runtime-512x409.png` | 512 x 409 closed/open comparison. |

## Nano Banana Prompt

```text
帮我将这张图片重绘和清晰化，让它细节更丰富，同时去掉原图中杂乱不必要的细节。重要：背景不是艺术内容，必须逐像素保持为纯 #00ff00 chroma-key 背景；不要把背景改成白色、灰色、黑色、渐变、地面或任何场景；背景必须完全平整、单一颜色、无渐变、无纹理、无光照、无光晕、无阴影。请严格延续 alpha-ready 要求：主体完整、无裁切、无地面、无地线、无接触阴影、无投影、无反射、无贴边雾气、无文字、无标签、无水印；不要在主体中使用 #00ff00。Style frame only: Spirebound runtime prop art; serious cartoon-gothic dark fantasy; stained-glass game illustration with chunky black lead lines, matte painterly glass panes, bold opened treasure chest foreground clearly separated from a quieter chapel alcove vignette, 3-5 large jewel-tone colour masses, warm amber-white reward light, crisp contrast, readable at 128px. Keep the input image's core composition, open lid, low three-quarter angle, gold-black coffer silhouette, lock plate, glowing interior, floating card-like and relic-like silhouettes, cracked chapel alcove, faint ward-line story cues, palette family, and horizontal footprint. The open chest must remain recognisably the same chest as the closed reference: do not redesign the box, do not change camera angle, do not make the lid too tall, and do not move the object footprint. The alcove is part of the prop but must stay subordinate and fade before the image edge. Do not close the lid, do not add piles of coins, text, UI, frame, border, watermark, card mockup, floor plane, cast shadow, or a full rectangular room.
```

Command:

```bash
python3 /Users/jamesto/.codex/skills/nanobanana/scripts/nanobanana.py generate \
  --prompt "<prompt above>" \
  --input-image scratch/prop-chest-open-gpt-image-2-20260706/source/chest-open-gpt-image-2-review-source.png \
  --model nanobanana-pro \
  --ratio 5:4 \
  --size 2K \
  --output scratch/prop-chest-open-nanobanana-20260706/nano/chest-open-nanobanana-pre-alpha.png \
  --save-response scratch/prop-chest-open-nanobanana-20260706/nano/chest-open-nanobanana-response.json \
  --json
```

Observed model: `gemini-3-pro-image`.

## Hashes

```text
a08c85c64d02acf6205139dba0c3d071d9b28f307936e013105df370ebf7c579  GPT input
510d687cb30a19b7a119667f7e71afecf4c783df62397c69dde136ad9cf729e5  Nano original JPG
1cf420139c21a775c33300ba76cbf83e8605546413f412368421c3700eb1a1d8  Nano review PNG
c92d0f254e4ae89de20ed8ca4ad3d78cef352b86b49f1cbb0ae2bd7e0d781338  Comparison sheet
3f8afa9621e4d6db6a28cf93bf0646c34909fe34e12721f9e6d613093a6bb130  Soft alpha
5fab0e2e13301a3e04f5c7ea16eaabc75967a11d89184cff468a7ebf5424f1da  Edge-contract alpha
833e052fd4ac99996609cbb0b019270e7f41ef918f72ffb32547caaf557d5377  Selected full-size alpha
5bbcdc0b1d416cca9c21b7b2b03c5117cbce9e9199c5c388a132f726a62db137  Runtime-size final
31af7ca4fc9e924c0786d382a4d024bdc218290d208cbb1c4c61b9e0c9f7602a  Closed/open runtime review
66f3e859f23e5cd76180a570fdcaf222fbc9ca07260b3369ada114617295b771  Alpha pipeline contact
```

## Alpha Pipeline

Soft candidate:

```bash
python3 /Users/jamesto/.codex/skills/imagegen/scripts/remove_chroma_key.py \
  --input scratch/prop-chest-open-nanobanana-20260706/nano/chest-open-nanobanana-pre-alpha.png \
  --out scratch/prop-chest-open-nanobanana-20260706/final/chest-open-alpha-soft.png \
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
  --input scratch/prop-chest-open-nanobanana-20260706/nano/chest-open-nanobanana-pre-alpha.png \
  --out scratch/prop-chest-open-nanobanana-20260706/final/chest-open-alpha-edge-contract.png \
  --auto-key border \
  --soft-matte \
  --transparent-threshold 32 \
  --opaque-threshold 160 \
  --despill \
  --edge-contract 1 \
  --force
```

Selected full-size alpha is based on the edge-contract candidate. The cleanup
only desaturated green dominance on semi-transparent edge pixels, so the central
green relic gem remains intact.

The 512 x 409 runtime candidate was fit from the selected alpha bbox to a
474 x 380 content box and pasted at `(19, 8)`, keeping the visual baseline close
to the closed chest reference.

Validation:

```text
path: final/chest-open-nanobanana-alpha-512x409.png
size: 512 x 409
mode: RGBA
corner alpha: 0, 0, 0, 0
alpha bbox: (19, 8, 493, 388)
alpha counts: 85,952 transparent; 6,640 partial; 116,816 opaque
sha256: 5bbcdc0b1d416cca9c21b7b2b03c5117cbce9e9199c5c388a132f726a62db137
```

## Review Note

The Nano pass keeps the open-state read, the same chapel alcove, and the same
reward-light story. It is slightly cleaner than the GPT source, but the chest is
tight at the bottom edge. If approved, the alpha/runtime step should add a small
transparent padding buffer or crop-fit carefully so the bottom feet do not feel
clipped.

Alpha update: the runtime-size candidate now adds that padding buffer and aligns
the open chest baseline with the closed chest review image.
