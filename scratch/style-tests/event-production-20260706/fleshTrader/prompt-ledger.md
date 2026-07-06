# Flesh Trader Event Art Prompt Ledger

## Scope

- Event id: `fleshTrader`
- Event name: The Flesh Trader
- Output target: `src/assets/events/fleshTrader.png`
- Production folder: `scratch/style-tests/event-production-20260706/fleshTrader/`
- Workflow: built-in GPT image source -> Nano Banana Pro full-scene clean-up -> comparison sheet -> 1024px gallery registration

## Story

The trader wears a merchant's coat because customers trust coats more than faces.
He does not ask for gold. His scales measure warmth, breath, and the future years
inside the body. The relic in his hand is real, which makes the offer worse.

Decision moment: the relic is visible in one hand while the other hand measures
the player's life without touching it.

## Design

Foreground: long-fingered merchant-coat figure offering a warm gold relic.

Midground: small balance scale with a red glass heart-weight.

Background: broad market-tent and alley arch shapes fading into bruised magenta
shadow.

Palette: bruised magenta, merchant black, warm relic gold, sparing pale
flesh-pink glass, red glass heart-weight, black lead, restrained amber lantern
light.

Avoided: gore, exposed organs, extra customers, text price tags, normal friendly
shopkeeper read, UI, labels, watermark, reward piles, busy market detail.

## Step 1 - Built-In GPT Image Source

Tool: built-in `image_gen`

Generated image id: `ig_05629b6aeb15ae7a016a4afb13182c819182c46174ab2256bc.png`

Default source path:
`/Users/jamesto/.codex/generated_images/019f34e3-cda3-7673-8be1-ec7f8c440d84/ig_05629b6aeb15ae7a016a4afb13182c819182c46174ab2256bc.png`

Copied source path:
`scratch/style-tests/event-production-20260706/fleshTrader/01-gpt-image-source.png`

Source file facts: PNG, 1536 x 1024, RGB.

Exact GPT prompt:

```text
Use case: stylized-concept
Asset type: Spirebound event art full-background source
Primary request: The Flesh Trader, a cursed bargain event: a long-fingered figure in a trusted merchant's coat offers one real glowing relic while the other hand measures the player's life without touching it.
Small story: The trader wears a merchant's coat because customers trust coats more than faces. He does not ask for gold; his scales measure warmth, breath, and future years, and the relic in his hand is real, which makes the offer worse.
Narrative read: show the merchant-coat figure first, the warm relic second, the balance scale with a red glass heart-weight third, and the market-tent or alley arches fading into magenta shadow fourth. It must read inside a 440px event panel and still scan at 128px.
Style/medium: serious cartoon-gothic stained-glass game art; sturdy event illustration; chunky black outer contour on the main figure; 3-5 large jewel-tone glass colour masses on the subject; broad soft stained-glass background planes, not fine lattice; very few thick black lead dividers; matte painterly glass texture; warm amber relic glow; controlled eerie pink glass highlights.
Composition/framing: wide 3:2 full event scene; centre-right figure focal; foreground/midground/background depth; generous clean breathing room toward the left and upper-left; no hard card frame; no cropped hands, relic, coat, balance scale, or arches; stage-like vignette without UI.
Lighting/mood: luminous midtones; high value contrast on the merchant figure and relic; background lower contrast and fewer lines than the subject; gothic bargain mood without crushing darkness.
Palette: bruised magenta, merchant black, warm relic gold, sparing pale flesh-pink glass, red glass heart-weight, black lead, restrained amber lantern light.
Scene/backdrop: broad market-tent or alley arches fading into magenta shadow, with only two or three huge place cues and no busy stalls.
Constraints: no text; no labels; no watermark; no buttons; no UI chrome; no full card mockup; no guaranteed reward pile; no gore; no exposed organs; no extra customers; no normal friendly shopkeeper expression; no price tags; avoid thin strokes; avoid many cracks; avoid fragile glass filigree; avoid detailed window lattice; avoid floor tile grid; avoid busy market architecture; background must have fewer lines and lower contrast than the figure.
```

GPT first-read review:

- Strong centre-right trader silhouette, warm relic, and red heart-weight scale.
- Clear market-tent and alley background in bruised magenta.
- No text, UI, customers, gore, exposed organs, or price tags observed.
- Good source for Nano Banana Pro clean-up; some interior detail was busier than
  the final event-art target.

## Step 2 - Nano Banana Pro Clean-Up

Command model alias: `nanobanana-pro`

Resolved model: `gemini-3-pro-image`

Settings:

- `--ratio 3:2`
- `--size 2K`
- `--input-image scratch/style-tests/event-production-20260706/fleshTrader/01-gpt-image-source.png`
- `--output scratch/style-tests/event-production-20260706/fleshTrader/02-nanobanana-pro-clean.png`
- `--save-response scratch/style-tests/event-production-20260706/fleshTrader/02-nanobanana-pro-response.json`

Exact Nano Banana prompt:

```text
帮我将这张图片重绘和清晰化，让它细节更丰富，同时去掉原图中杂乱不必要的细节。重要：这次不做 alpha、chroma-key、cutout 或透明背景控制；请保留完整的 3:2 Spirebound event scene 和原图的叙事背景。保留长手指、穿商人外套的前景交易者作为清晰前景主体；保留他手中发光的金色遗物，以及旁边带红色玻璃心脏砝码的小天平；背景保留宽阔的市场帐篷、巷道拱门和逐渐褪入洋红阴影的远处空间。整体要像严肃 cartoon-gothic stained-glass game art：主主体有更粗的黑色外轮廓、更大的形块、更少碎裂玻璃、更少地面碎片，128px 仍然能读。背景可以有深度和叙事，但对比度和线条数量必须低于主体。保留 bruised magenta、merchant black、warm relic gold、少量 pale flesh-pink glass、red glass heart-weight、black lead 的配色。不要加入人物、文字、UI、明显奖励堆、额外顾客、价格标签、血腥内容、裸露器官、额外供品、玻璃碎片、地板图案、符文、复杂建筑或阻挡主体的前景物；不要把他画成普通友善店主。
```

Output paths:

- Raw Nano Banana response: `scratch/style-tests/event-production-20260706/fleshTrader/02-nanobanana-pro-response.json`
- Original returned payload: `scratch/style-tests/event-production-20260706/fleshTrader/02-nanobanana-pro-clean-original.jpg`
- Converted true PNG: `scratch/style-tests/event-production-20260706/fleshTrader/02-nanobanana-pro-clean.png`

Output note: Nano Banana returned `image/jpeg` despite the requested `.png`
filename. The JPEG payload was retained as `02-nanobanana-pro-clean-original.jpg`
and converted to a true PNG at `02-nanobanana-pro-clean.png`.

Clean output file facts: PNG, 2528 x 1696, RGB.

Nano first-read review:

- Cleaner subject read than the GPT source, with stronger black contour and
  broader glass masses.
- Relic, long fingers, merchant coat, and red glass heart-weight scale remain
  immediately legible.
- Background keeps the market-tent and alley-arch story while staying lower
  contrast than the figure.
- No extra customers, text, UI, price tags, gore, or exposed organs observed.
- Accepted for gallery registration after normalising to max edge 1024px.

## Comparison And Registration

Comparison sheet:
`scratch/style-tests/event-production-20260706/fleshTrader/comparison-sheet.png`

Registered event asset:
`src/assets/events/fleshTrader.png`

Registered file facts: PNG, 1024 x 683, RGB, max edge 1024px.
