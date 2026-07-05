# Workflow Test: Nano Banana Background Lock Prompt

Date: 2026-07-05

Status: alpha pass, background-lock prompt fail.

Goal: rerun `gpt-image-2 -> Nano Banana Pro -> alpha` after improving the
second prompt to explicitly request a pure `#ff00ff` background that follows the
first alpha-ready prompt.

## Files

- `01-gpt-image-2-source.png` — new built-in image generation source.
- `01-gpt-image-2-source-alpha.png` — Step 1 alpha output, kept for final
  decision comparison.
- `02-nanobanana-pro-bglock.jpg` — first improved Nano Banana Pro attempt.
- `02b-nanobanana-pro-bglock-strict.jpg` — stricter retry.
- `03-alpha.png` — accepted Nano Banana transparent PNG from the stricter retry.
- `03-alpha-preview-dark.png` — final alpha preview on a dark background.
- `03-alpha-preview-magenta.png` — final alpha preview on magenta.
- `03-alpha-preview-light.png` — final alpha preview on a light background.

## Step 1 Prompt

```text
Use case: stylized-concept
Asset type: Spirebound workflow test v2 alpha-ready source for gpt-image-2 stage
Primary request: a single full-body gothic dark-fantasy stained-glass lantern knight, original character, calm idle pose, facing slightly right, holding a small amber lantern and a glass rapier
Style/medium: premium hand-illustrated gothic dark-fantasy game art; ink-black paper-theatre silhouette plus luminous stained-glass anatomy; bold readable leaded outlines; large glass panes; restrained ornament; visible brush texture; less glossy 3D render; less generic fantasy
Composition/framing: single complete subject only; full body visible from hood to feet; generous padding on all sides; no cropped limbs; no action blur
Lighting/mood: warm amber lantern rim light, restrained inner glass glow, dark gothic mood
Scene/backdrop: perfectly flat solid #ff00ff chroma-key background only
Constraints: no ground plane; no floor; no floor line; no contact shadow; no cast shadow; no reflection; no atmospheric haze touching the silhouette; no text; no labels; no watermark; do not use #ff00ff anywhere in the subject
```

## Step 2 Prompt A

```text
帮我将这张图片重绘和清晰化，让他细节更丰富，同时去掉原图中杂乱不必要的细节。请严格延续第一步的 alpha-ready 要求：主体必须保持完整、无裁切、无地面、无地线、无接触阴影、无投影、无反射、无贴边雾气、无文字、无标签、无水印；背景必须保持为完全平整的纯 #ff00ff 单色 chroma-key 背景，无渐变、无纹理、无光晕、无阴影；不要在主体中使用 #ff00ff。
```

Observed result: Nano Banana Pro changed the background to grey/white with a
pink gradient, not `#ff00ff`.

## Step 2 Prompt B

```text
帮我将这张图片重绘和清晰化，让他细节更丰富，同时去掉原图中杂乱不必要的细节。重要：背景不是艺术内容，必须逐像素保持为纯 #ff00ff chroma-key 背景；不要把背景改成白色、灰色、粉色渐变、黑色或任何场景；背景必须完全平整、单一颜色、无渐变、无纹理、无光照、无光晕、无阴影。请严格延续第一步的 alpha-ready 要求：主体完整、无裁切、无地面、无地线、无接触阴影、无投影、无反射、无贴边雾气、无文字、无标签、无水印；不要在主体中使用 #ff00ff。
```

Observed result: Nano Banana Pro changed the background to plain white, not
`#ff00ff`. This is still much easier to alpha than the previous black-backdrop
test.

Command shape used for both attempts:

```bash
python3 /Users/jamesto/.codex/skills/nanobanana/scripts/nanobanana.py generate \
  --prompt "<prompt above>" \
  --input-image scratch/workflow-tests/20260705-gpt-image-2-nanobanana-pro-alpha-bglock/01-gpt-image-2-source.png \
  --model nanobanana-pro \
  --ratio 4:5 \
  --size 1K \
  --output <attempt-output.jpg>
```

Observed model: `gemini-3-pro-image`.

## Step 3 Alpha

Accepted alpha uses border-connected near-white background removal from
`02b-nanobanana-pro-bglock-strict.jpg`. This preserves internal bright glass
highlights because only near-white pixels connected to the image border are
removed.

After that pass, an enclosed-background cleanup removes sizeable non-border
background components. This specifically fixes the held lantern ring: the empty
space inside the ring was near-white background, but it was enclosed by the
metal ring and therefore not connected to the image border. Tiny bright armour
highlights remain opaque.

Validation for `01-gpt-image-2-source-alpha.png`:

- format: PNG
- mode: RGBA
- size: 1024 x 1536
- corner alpha: 0, 0, 0, 0
- alpha counts: 959829 transparent, 32658 partial, 580377 opaque

Validation for `03-alpha.png`:

- format: PNG
- mode: RGBA
- size: 928 x 1152
- corner alpha: 0, 0, 0, 0
- alpha counts: 603801 transparent, 27005 partial, 438250 opaque

Conclusion: prompt-only `#ff00ff` background locking did not work with Nano
Banana Pro in this test. The stricter prompt improved the alpha path by
producing a plain white background, but the workflow should not assume Nano will
respect `#ff00ff`. Keep both alpha candidates for final art decisions:
`01-gpt-image-2-source-alpha.png` and `03-alpha.png`.
