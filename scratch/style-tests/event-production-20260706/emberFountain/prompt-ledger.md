# Ember Fountain Event Production Ledger

## Event

- Event id: `emberFountain`
- Event name: Fountain of Embers
- Taxonomy: sanctuary / safe / common / ritual
- Runtime target: `src/assets/events/emberFountain.png`

## Small Story

A battle was won here long ago, and the fountain kept the warmth of that victory after the names were forgotten. Its embers are liquid rather than flame. They mend glass, but only while the basin still remembers kindness. The image freezes the decision moment: sparks rise without burning, inviting either a healing bath or a careful bottle.

## Design

Foreground: cracked basin filled with liquid ember light. Midground: small empty phial and worn kneeling stone. Background: broad courtyard arches and soft summer-gold haze. Palette: ember orange, dawn pink, warm gold, pale stone, black lead, with a tiny rose-glass accent.

Avoided reads: lava danger, violent fire, skull motifs, guaranteed potion emphasis, busy garden, UI, text, labels, card frame, and reward callout.

## GPT Source

- Tool: built-in Codex `image_gen`
- Source model path: direct built-in image generation, no CLI wrapper
- Generated image id: `ig_00eef41b9d42ae01016a4afb0b66188191af04af988d54f586.png`
- Original generated path: `/Users/jamesto/.codex/generated_images/019f34e3-c86b-7773-9a9b-3e5f11901dfe/ig_00eef41b9d42ae01016a4afb0b66188191af04af988d54f586.png`
- Workspace source path: `scratch/style-tests/event-production-20260706/emberFountain/01-gpt-image-source.png`
- Source dimensions: 1536 x 1024 RGB PNG

### Exact GPT Prompt

```text
Use case: stylized-concept
Asset type: Spirebound event art full-background source
Primary request: Fountain of Embers, a sanctuary event: sparks rise from a cracked courtyard fountain filled with liquid ember warmth, inviting either a healing bath or a careful bottle without showing the result.
Small story: A battle was won here long ago, and the fountain kept the warmth of that victory after the names were forgotten. Its embers are liquid rather than flame; they mend glass while the basin still remembers kindness.
Narrative read: show the cracked basin filled with liquid ember light first, the small empty phial and worn kneeling stone second, and the broad courtyard arches third. It must read inside a 440px event panel and still scan at 128px.
Style/medium: serious cartoon-gothic stained-glass game art; sturdy event illustration; chunky black outer contour on the cracked basin; 3-5 large jewel-tone glass masses; very few thick lead dividers; matte painterly glass texture; controlled ember inner glow; no generic fantasy illustration.
Composition/framing: wide 3:2 full event scene; centre-right cracked basin focal; foreground/midground/background depth; generous breathing room in the left and upper areas; no hard card frame; no cropped basin, phial, kneeling stone, or arches.
Lighting/mood: luminous midtones; soft summer-gold haze in the background; warm ember-orange light against dawn-pink and pale-stone courtyard tones; background lower contrast than the basin.
Palette: ember orange, dawn pink, warm gold, pale stone, black lead, tiny rose-glass highlights.
Constraints: no text; no labels; no watermark; no buttons; no UI chrome; no full card mockup; no people; avoid lava danger; avoid violent fire; avoid skull motifs; avoid guaranteed potion emphasis; avoid busy garden; avoid detailed lattice, floor grids, tiny filigree, many sparks, and busy background architecture; background must have fewer lines than the basin.
```

## Nano Banana Pro Clean-Up

- Command model: `nanobanana-pro`
- Resolved model: `gemini-3-pro-image`
- Ratio: `3:2`
- Size: `2K`
- Input image: `scratch/style-tests/event-production-20260706/emberFountain/01-gpt-image-source.png`
- Output path: `scratch/style-tests/event-production-20260706/emberFountain/02-nanobanana-pro-clean.png`
- Original payload path: `scratch/style-tests/event-production-20260706/emberFountain/02-nanobanana-pro-clean-original.jpg`
- Response path: `scratch/style-tests/event-production-20260706/emberFountain/02-nanobanana-pro-response.json`
- Output note: Nano Banana Pro returned JPEG bytes despite the requested `.png` extension, so the original payload was retained as `02-nanobanana-pro-clean-original.jpg` and converted to a true RGB PNG at `02-nanobanana-pro-clean.png`.

### Exact Nano Banana Prompt

```text
帮我将这张图片重绘和清晰化，让它细节更丰富，同时去掉原图中杂乱不必要的细节。重要：这次不做 alpha、chroma-key、cutout 或透明背景控制；请保留完整的 3:2 Spirebound event scene 和原图的叙事背景。保留 cracked basin filled with liquid ember light 作为清晰前景主体；保留 small empty phial and worn kneeling stone；背景保留 broad courtyard arches, soft summer-gold haze, and pale stone courtyard planes. 整体要像严肃 cartoon-gothic stained-glass game art：主主体有更粗的黑色外轮廓、更大的形块、更少碎裂玻璃、更少地面碎片，128px 仍然能读。背景可以有深度和叙事，但对比度和线条数量必须低于主体。保留 ember orange, dawn pink, warm gold, pale stone, and black lead palette. 不要加入人物、文字、UI、明显奖励堆、额外供品、玻璃碎片、地板图案、符文、复杂建筑或阻挡主体的前景物。
```

## First-Read Review

Accepted for gallery registration. The Nano Banana Pro pass keeps the fountain as the immediate centre-right read, simplifies the basin stones and courtyard planes, preserves the phial and kneeling stone, and keeps the background arches lower contrast than the subject. The scene reads as warm liquid ember rather than dangerous lava, has no people, text, UI, skull motifs, or obvious reward pile, and keeps the healing/potion choice implied rather than resolved.

Comparison sheet: `scratch/style-tests/event-production-20260706/emberFountain/comparison-sheet.png`

Registered output: `src/assets/events/emberFountain.png`, normalised from the Nano Banana Pro PNG to max edge 1024 px.
