# Chest Nano Banana Alpha Pass

Date: 2026-07-06

Scope: regenerate only the closed `chest` prop, using the recent card-art
workflow shape: built-in Image Gen source -> Nano Banana Pro image-to-image
clean-up -> local alpha pipeline. The open chest is intentionally not generated
in this pass.

## Output Summary

| Stage | Path | Notes |
|---|---|---|
| GPT source | `source/01-gpt-image-2-source.png` | Built-in Image Gen source on flat `#00ff00`. |
| Nano pre-alpha | `nano/02-nanobanana-pre-alpha.png` | True PNG conversion for review; still has the flat `#00ff00` background. |
| Nano original | `nano/02-nanobanana-pre-alpha-original.jpg` | Byte-for-byte original Nano output; the script returned JPEG bytes. |
| Raw Nano response | `nano/02-nanobanana-response.json` | Stored raw API response. |
| Selected full-size alpha | `final/03-alpha-cleaner-strong-despill.png` | Chroma-key alpha plus stronger green-spill cleanup. |
| Runtime-size final | `final/chest-nanobanana-alpha-512x409.png` | Selected 512 x 409 RGBA candidate. |
| Contact sheet | `review/chest-nanobanana-pipeline-contact.png` | Source, Nano pre-alpha, selected alpha, final. |

## Story Lock

The closed treasure chest is an old tribute coffer left by the tower's former
order. Before opening, it should read as a quiet promise. Thin ward lines imply
that reward in the tower is never completely innocent.

This closed chest must remain pairable with a later `chest-open` pass: same low
three-quarter angle, same horizontal footprint, same chapel alcove, same
gold-black stained-glass coffer identity.

## Step 1 Prompt - Built-In Image Gen

```text
Use case: stylized-concept
Asset type: Spirebound runtime prop alpha-ready source, closed treasure chest, final target 512 x 409 RGBA after chroma-key removal
Primary request: Create a closed treasure chest prop with a small narrative alcove backdrop. It must be suitable as the closed state for a later matching open-chest version.
Story moment: An old tribute coffer left by the tower's former order sits sealed in a shallow cracked chapel alcove. Before opening, it reads as a quiet promise; thin ward lines imply the reward is not completely innocent.
Scene/backdrop: The prop includes a compact shallow cracked chapel alcove immediately behind the chest, with a few broken glass tesserae and faint ward lines etched in the stone. This alcove is part of the prop vignette and must fade before the image edges. Outside the vignette is only flat chroma key.
Subject: A low, heavy, closed stained-glass tribute chest; black lead frame; gold bands; amber light leaking from thin seams; strong simple readable silhouette; no open lid and no visible coins.
Style/medium: Serious cartoon-gothic stained-glass game art; polished game prop illustration; heavy black lead outlines; large readable jewel-glass panes; matte painterly glass texture; warm amber rim light; painterly depth but not photorealistic.
Composition/framing: Horizontal composition for 512 x 409 runtime art; centred low three-quarter view; chest occupies about 65-70% of the image width; alcove sits behind it and is lower contrast than the chest; generous padding on all sides; no cropped corners; readable at 128 px.
Lighting/mood: Inviting but restrained; warm amber seam glow with cool blue-violet ambient shadows; slightly brightened interior values, not too dark.
Color palette: Amber, gold, black lead, dark stone, muted blue-violet shadows, small pale glass highlights.
Alpha/chroma instruction: Create on a perfectly flat solid #00ff00 chroma-key background for local background removal. The #00ff00 field must be one uniform colour with no shadows, gradients, texture, reflections, floor plane, lighting variation, halo, or vignette. Keep the chest and alcove fully separated from the #00ff00 field with crisp edges and transparent-friendly padding. Do not use #00ff00 anywhere in the chest, alcove, ward lines, glow, or glass.
Constraints: no cast shadow, no contact shadow, no floor plane extending to edges, no text, no labels, no watermark, no UI, no card frame, no full rectangular room, no piles of coins, no crown/boss-tier ornament, no dark unreadable body, no photorealism, no anime card art.
```

Generated source:

`/Users/jamesto/.codex/generated_images/019f3461-7cb7-7b62-97be-c2e5f810867d/ig_02e8c1fbeb3c9a41016a4be37c08688191823f7d0503aa076f.png`

## Step 2 Prompt - Nano Banana Pro

This is the recent card-art Nano pass pattern adapted for an alpha-ready prop.
Unlike the approved full-background card pass, the Nano prompt explicitly carries
forward the `#00ff00` alpha colour requirement.

```text
帮我将这张图片重绘和清晰化，让它细节更丰富，同时去掉原图中杂乱不必要的细节。重要：背景不是艺术内容，必须逐像素保持为纯 #00ff00 chroma-key 背景；不要把背景改成白色、灰色、黑色、渐变、地面或任何场景；背景必须完全平整、单一颜色、无渐变、无纹理、无光照、无光晕、无阴影。请严格延续第一步的 alpha-ready 要求：主体完整、无裁切、无地面、无地线、无接触阴影、无投影、无反射、无贴边雾气、无文字、无标签、无水印；不要在主体中使用 #00ff00。Style frame only: Spirebound runtime prop art; serious cartoon-gothic dark fantasy; stained-glass game illustration with chunky black lead lines, matte painterly glass panes, bold closed treasure chest foreground clearly separated from a quieter chapel alcove vignette, 3-5 large jewel-tone colour masses, warm amber rim light, crisp contrast, readable at 128px. Keep the input image's core composition, closed lid, low three-quarter angle, gold-black coffer silhouette, amber seam glow, cracked chapel alcove, faint ward-line story cues, palette family, and horizontal footprint. The alcove is part of the prop but must stay subordinate and fade before the image edge. Do not open the lid, do not add coins, text, UI, frame, border, watermark, card mockup, floor plane, cast shadow, or a full rectangular room.
```

Command:

```bash
python3 /Users/jamesto/.codex/skills/nanobanana/scripts/nanobanana.py generate \
  --prompt "<prompt above>" \
  --input-image scratch/prop-chest-nanobanana-20260706/source/01-gpt-image-2-source.png \
  --model nanobanana-pro \
  --ratio 5:4 \
  --size 2K \
  --output scratch/prop-chest-nanobanana-20260706/nano/02-nanobanana-pre-alpha.png \
  --save-response scratch/prop-chest-nanobanana-20260706/nano/02-nanobanana-response.json \
  --json
```

Observed model: `gemini-3-pro-image`.

Nano preserved the green background, but returned JPEG bytes. The original bytes
are kept as `nano/02-nanobanana-pre-alpha-original.jpg`, and a true PNG review
copy is kept as `nano/02-nanobanana-pre-alpha.png`.

## Step 3 Alpha Pipeline

Baseline alpha candidates:

```bash
python3 /Users/jamesto/.codex/skills/imagegen/scripts/remove_chroma_key.py \
  --input scratch/prop-chest-nanobanana-20260706/nano/02-nanobanana-pre-alpha.png \
  --out scratch/prop-chest-nanobanana-20260706/final/03-alpha-soft.png \
  --auto-key border \
  --soft-matte \
  --transparent-threshold 24 \
  --opaque-threshold 220 \
  --despill \
  --force
```

```bash
python3 /Users/jamesto/.codex/skills/imagegen/scripts/remove_chroma_key.py \
  --input scratch/prop-chest-nanobanana-20260706/nano/02-nanobanana-pre-alpha.png \
  --out scratch/prop-chest-nanobanana-20260706/final/03-alpha-edge-contract.png \
  --auto-key border \
  --soft-matte \
  --transparent-threshold 24 \
  --opaque-threshold 220 \
  --despill \
  --edge-contract 1 \
  --force
```

Selected cleaner alpha:

```bash
python3 /Users/jamesto/.codex/skills/imagegen/scripts/remove_chroma_key.py \
  --input scratch/prop-chest-nanobanana-20260706/nano/02-nanobanana-pre-alpha.png \
  --out scratch/prop-chest-nanobanana-20260706/final/03-alpha-cleaner.png \
  --auto-key border \
  --soft-matte \
  --transparent-threshold 32 \
  --opaque-threshold 160 \
  --despill \
  --edge-contract 1 \
  --force
```

The Nano pass left a soft green spill in the lower alcove haze. The selected
alpha therefore uses an additional edge/spill cleanup that reduces green-channel
dominance on surviving keyed pixels without changing the chest's amber glass,
gold bands, or black leading.

## Validation

Runtime final:

```text
path: final/chest-nanobanana-alpha-512x409.png
size: 512 x 409
mode: RGBA
corner alpha: 0, 0, 0, 0
alpha bbox: (25, 12, 485, 388)
alpha counts: 94,275 transparent; 11,050 partial; 104,083 opaque
sha256: 63f4e1cdc1c9f71b81f22cdcf369ef60f5819029389ec8233af303da1f8bb219
```

Source hashes:

```text
809777d753284131d464952caab3f6a2221752deeb57b13b806f6312c3d54849  source/01-gpt-image-2-source.png
b14f46f5f49ad2e25bbf78fd6edbee6c07e49fdc1eb7dcf83949c22598596eda  nano/02-nanobanana-pre-alpha-original.jpg
5e6e925b0016d8059e87bc7033679780ae1eeb6d50012b664f4b038ed2fd648a  nano/02-nanobanana-pre-alpha.png
63f4e1cdc1c9f71b81f22cdcf369ef60f5819029389ec8233af303da1f8bb219  final/chest-nanobanana-alpha-512x409.png
```

## Review Note

The final is a strong closed-state candidate: the coffer stays closed, the
silhouette is readable at runtime size, the chapel alcove now gives story, and
the transparent edges are valid. Before promoting, regenerate or revise
`chest-open` against this exact footprint so the closed/open pair does not jump.
