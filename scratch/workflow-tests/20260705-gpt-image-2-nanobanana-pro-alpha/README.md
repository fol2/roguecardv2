# Workflow Test: gpt-image-2 -> Nano Banana Pro -> Alpha

Date: 2026-07-05

Status: pass with one documented alpha caveat.

## Files

- `01-gpt-image-2-source.png` — built-in image generation source.
- `01-gpt-image-2-source-alpha.png` — source chroma-key alpha check.
- `02-nanobanana-pro-cleaned.jpg` — Nano Banana Pro clean-up output.
- `03-alpha.png` — accepted final transparent PNG.
- `03-alpha-preview-dark.png` — final alpha preview on a dark background.
- `03-alpha-preview-light.png` — final alpha preview on a light background.
- `03-alpha-auto-key-black.png` — rejected evidence from naive black keying.

## Step 1 Prompt

```text
Use case: stylized-concept
Asset type: Spirebound workflow test alpha-ready source for gpt-image-2 stage
Primary request: a single full-body gothic dark-fantasy stained-glass lantern knight, original character, calm idle pose, facing slightly right, holding a small amber lantern and a glass rapier
Style/medium: premium hand-illustrated gothic dark-fantasy game art; ink-black paper-theatre silhouette plus luminous stained-glass anatomy; bold readable leaded outlines; large glass panes; restrained ornament; visible brush texture; less glossy 3D render; less generic fantasy
Composition/framing: single complete subject only; full body visible from hood to feet; generous padding on all sides; no cropped limbs; no action blur
Lighting/mood: warm amber lantern rim light, restrained inner glass glow, dark gothic mood
Scene/backdrop: perfectly flat solid #ff00ff chroma-key background only
Constraints: no ground plane; no floor; no floor line; no contact shadow; no cast shadow; no reflection; no atmospheric haze touching the silhouette; no text; no labels; no watermark; do not use #ff00ff anywhere in the subject
```

## Step 2 Command

Nano Banana prompt was used exactly, with no appended constraints:

```bash
python3 /Users/jamesto/.codex/skills/nanobanana/scripts/nanobanana.py generate \
  --prompt "帮我将这张图片重绘和清晰化，让他细节更丰富，同时去掉原图中杂乱不必要的细节" \
  --input-image scratch/workflow-tests/20260705-gpt-image-2-nanobanana-pro-alpha/01-gpt-image-2-source.png \
  --model nanobanana-pro \
  --ratio 4:5 \
  --size 1K \
  --output scratch/workflow-tests/20260705-gpt-image-2-nanobanana-pro-alpha/02-nanobanana-pro-cleaned.jpg
```

Observed model: `gemini-3-pro-image`.

## Step 3 Alpha

Naive border auto-key against the Nano Banana result made the character too
transparent, because the exact prompt changed the backdrop to black. That output
is kept as `03-alpha-auto-key-black.png`.

Accepted alpha uses border-connected background removal: only dark pixels
connected to the image edge are removed, preserving internal black lead lines,
cloak detail, and the hood void.

## Validation

`03-alpha.png`:

- format: PNG
- mode: RGBA
- size: 928 x 1152
- corner alpha: 0, 0, 0, 0
- alpha counts: 645608 transparent, 23837 partial, 399611 opaque

Known caveat: Nano Banana Pro added a lantern glow against the dark backdrop.
The connected alpha keeps that glow with the subject. Do not alter the fixed
Nano Banana prompt to prevent this; handle it in the alpha stage or reject the
asset during review.
