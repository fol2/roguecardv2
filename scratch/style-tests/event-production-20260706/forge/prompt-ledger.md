# Forge Event Art Production Ledger

Event id: `forge`
Event name: The Forgotten Forge
Taxonomy: craft / safe / uncommon / place
Worker scope: `forge` only

## Small Story

The forge outlived its smiths. Its hammers still hang in order and the anvil
still holds heat, waiting for a hand brave enough to place a card in the old
work-light.

Decision moment: the hot card pane rests on the anvil and the hammer has not
yet fallen.

## Design

Foreground: black star-metal anvil with a hot card-shaped glass pane.
Midground: one oversized hammer and the furnace mouth.
Background: broad forge arches and amber-blue heat planes.

Palette: black star-metal, ember orange, deep cobalt, tarnished gold, pale
furnace glow, black lead.

Avoided: many chains, busy machinery, sparks covering the silhouette, shop mood,
people, UI, text, labels, card frame, and guaranteed reward reveal.

## GPT Image Source

Built-in image tool: `image_gen`
Generated image id: `ig_0a135e50e68aba6a016a4afb147a908191b8f38aae39327d5f.png`
Generated source path:
`/Users/jamesto/.codex/generated_images/019f34e3-c938-7eb0-8705-0097a53d347f/ig_0a135e50e68aba6a016a4afb147a908191b8f38aae39327d5f.png`
Copied source path:
`scratch/style-tests/event-production-20260706/forge/01-gpt-image-source.png`
Source format: PNG, 1536 x 1024, RGB

Exact GPT prompt:

```text
Use case: stylized-concept
Asset type: Spirebound event art full-background source, production pass for event id forge
Primary request: The Forgotten Forge, an uncommon craft event: the hot card-shaped glass pane rests on a black star-metal anvil in the old work-light, and the hammer has not yet fallen.
Small story: The forge outlived its smiths. Its hammers still hang in order and the anvil still holds heat, waiting for a hand brave enough to place a card in the old work-light.
Narrative read: show the black star-metal anvil first, the hot card-shaped glass pane second, the oversized waiting hammer and old forge setting third. The scene must read clearly inside a 440px event panel and still scan at 128px.
Style/medium: serious cartoon-gothic stained-glass game art; chunky black outer contour on the anvil and card pane; simplified theatrical scene; 3-5 large jewel-tone glass masses; very few thick black lead dividers; matte painterly glass texture; warm amber rim light; controlled inner glow from the hot card pane and furnace mouth; no generic fantasy illustration.
Composition/framing: wide 3:2 full-background event scene; centre-right focal anvil; foreground anvil and hot card pane; midground one oversized hammer and one furnace mouth; background two or three broad forge arches and amber-blue heat planes; generous breathing room on the left and upper area; no hard card frame; no cropped anvil, card pane, hammer, or furnace mouth; no action blur; stage-like vignette without baked UI.
Lighting/mood: luminous midtones; solemn craft mood; bright ember furnace heat against cool deep cobalt-black chamber light; high value contrast on the anvil and card pane; background contrast and line count lower than the focal subject.
Palette: black star-metal, ember orange, deep cobalt, tarnished gold, pale furnace glow, black lead.
Materials/textures: heavy matte black metal, thick leaded glass, tarnished hammered gold, glowing heat-softened glass pane, broad stained-glass light planes.
Constraints: no text; no labels; no watermark; no buttons; no UI chrome; no full card mockup; no guaranteed reward reveal; no people; no many chains; no busy machinery; no sparks covering the silhouette; no shop mood; avoid detailed lattice, floor grids, tiny filigree, tiny cracks, complex architecture, and foreground clutter.
```

## Nano Banana Pro Pass

Command model flag: `--model nanobanana-pro`
Resolved model reported by script: `gemini-3-pro-image`
Ratio: `3:2`
Size: `2K`
Input image:
`scratch/style-tests/event-production-20260706/forge/01-gpt-image-source.png`
Requested output:
`scratch/style-tests/event-production-20260706/forge/02-nanobanana-pro-clean.png`
Saved response:
`scratch/style-tests/event-production-20260706/forge/02-nanobanana-pro-response.json`

The Nano Banana payload was JPEG despite the requested `.png` path. It was
retained as:
`scratch/style-tests/event-production-20260706/forge/02-nanobanana-pro-clean-original.jpg`

It was converted to a true PNG at:
`scratch/style-tests/event-production-20260706/forge/02-nanobanana-pro-clean.png`

Converted PNG format: PNG, 2528 x 1696, RGB

Exact Nano Banana prompt:

```text
帮我将这张图片重绘和清晰化，让它细节更丰富，同时去掉原图中杂乱不必要的细节。重要：这次不做 alpha、chroma-key、cutout 或透明背景控制；请保留完整的 3:2 Spirebound event scene 和原图的叙事背景。保留黑色星铁铁砧和炽热卡牌形玻璃片作为清晰前景主体；保留一个超大锤子和一个炉口；背景保留宽阔锻炉拱门、琥珀蓝热平面和苍白炉光。整体要像严肃 cartoon-gothic stained-glass game art：主主体有更粗的黑色外轮廓、更大的形块、更少碎裂玻璃、更少地面碎片，128px 仍然能读。背景可以有深度和叙事，但对比度和线条数量必须低于主体。保留黑色星铁、余烬橙、深钴蓝、失泽金、苍白炉光和黑铅。不要加入人物、文字、UI、明显奖励堆、额外供品、玻璃碎片、地板图案、符文、复杂建筑、许多链条、繁忙机械、遮挡主体的火花或阻挡主体的前景物。
```

Exact command:

```bash
python3 /Users/jamesto/.codex/skills/nanobanana/scripts/nanobanana.py generate --prompt "帮我将这张图片重绘和清晰化，让它细节更丰富，同时去掉原图中杂乱不必要的细节。重要：这次不做 alpha、chroma-key、cutout 或透明背景控制；请保留完整的 3:2 Spirebound event scene 和原图的叙事背景。保留黑色星铁铁砧和炽热卡牌形玻璃片作为清晰前景主体；保留一个超大锤子和一个炉口；背景保留宽阔锻炉拱门、琥珀蓝热平面和苍白炉光。整体要像严肃 cartoon-gothic stained-glass game art：主主体有更粗的黑色外轮廓、更大的形块、更少碎裂玻璃、更少地面碎片，128px 仍然能读。背景可以有深度和叙事，但对比度和线条数量必须低于主体。保留黑色星铁、余烬橙、深钴蓝、失泽金、苍白炉光和黑铅。不要加入人物、文字、UI、明显奖励堆、额外供品、玻璃碎片、地板图案、符文、复杂建筑、许多链条、繁忙机械、遮挡主体的火花或阻挡主体的前景物。" --input-image scratch/style-tests/event-production-20260706/forge/01-gpt-image-source.png --model nanobanana-pro --ratio 3:2 --size 2K --output scratch/style-tests/event-production-20260706/forge/02-nanobanana-pro-clean.png --save-response scratch/style-tests/event-production-20260706/forge/02-nanobanana-pro-response.json
```

## Comparison And Registration

Contact sheet:
`scratch/style-tests/event-production-20260706/forge/03-contact-sheet.png`

Registered gallery asset:
`src/assets/events/forge.png`

Registration transform: true PNG converted from Nano Banana output, resized and
centre-cropped to 1024 x 683 so the max edge is 1024px.

## First-Read Review

Accepted for gallery registration.

The Nano Banana output improves the source by simplifying the glass texture and
making the anvil/card pane/hammer read cleaner at event-panel size. The focal
read is correct: hot card pane on black star-metal anvil first, waiting hammer
and furnace second, broad forge arches third. It contains no text, labels,
people, UI chrome, obvious reward pile, or shop-counter mood.

Residual note: the floor still has visible lead lines at full size, but they
are lower contrast than the anvil and should not dominate at the intended event
panel size.
