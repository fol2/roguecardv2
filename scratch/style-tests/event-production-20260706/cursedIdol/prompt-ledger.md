# Cursed Idol Event Art Production Ledger

Event id: `cursedIdol`
Event name: The Cursed Idol
Taxonomy: bargain / cursed / rare / object
Worker scope: `cursedIdol` only

## Small Story

The idol is valuable because everyone who understood it is already gone. It
radiates comfort like a trap with manners. The skull plinth is not a threat; it
is a receipt.

Decision moment: the idol's warmth reaches the player, but it has not yet been
lifted from the plinth.

## Design

Foreground: jade idol with a soft dangerous glow.
Midground: skull plinth and one abandoned relic chain.
Background: broad jungle-shrine stones and dark green light planes.

Palette: jade, sickly green, old bone, warm gold, and black lead.

Avoided: visible Hex card, too many skulls, living cultist, purely benevolent
mood, people, UI, text, labels, card frame, reward pile, dense vines, detailed
lattice, floor grids, tiny filigree, and busy background architecture.

## GPT Image Source

Built-in image tool: `image_gen`
Source model path: direct built-in image generation, no CLI wrapper
Generated image id: `ig_0388954615b75da0016a4afc9666708191973fcd2f23baec2d.png`
Generated source path:
`/Users/jamesto/.codex/generated_images/019f34e9-9d6b-7741-8370-25f44e4ac65a/ig_0388954615b75da0016a4afc9666708191973fcd2f23baec2d.png`
Copied source path:
`scratch/style-tests/event-production-20260706/cursedIdol/01-gpt-image-source.png`
Source format: PNG, 1536 x 1024, RGB

Exact GPT prompt:

```text
Use case: stylized-concept
Asset type: Spirebound event art full-background source, production pass for event id cursedIdol
Primary request: The Cursed Idol, a rare cursed bargain event: a jade idol sits on a skull plinth, radiating soft dangerous warmth that reaches toward the player, but it has not yet been lifted.
Small story: The idol is valuable because everyone who understood it is already gone. It radiates comfort like a trap with manners; the skull plinth is not a threat, it is a receipt.
Narrative read: show the jade idol first, the skull plinth and one abandoned relic chain second, and the broad jungle-shrine stones with dark green light planes third. The scene must read clearly inside a 440px event panel and still scan at 128px.
Style/medium: serious cartoon-gothic stained-glass game art; sturdy event illustration; chunky black outer contour on the idol and skull plinth; simplified theatrical scene; 3-5 large jewel-tone glass masses; very few thick black lead dividers; matte painterly glass texture; warm amber rim light; controlled sickly jade inner glow from the idol only; no generic fantasy illustration.
Composition/framing: wide 3:2 full-background event scene; centre-right focal idol; foreground jade idol on skull plinth; midground one abandoned relic chain; background two or three broad jungle-shrine stone slabs and dark green light planes; generous breathing room on the left and upper area; no hard card frame; no cropped idol, plinth, chain, or shrine stones; no action blur; stage-like vignette without baked UI.
Lighting/mood: luminous midtones; dangerous comfort, polite trap mood; warm gold light against sickly green and black-lead shadow; high value contrast on the idol and plinth; background contrast and line count lower than the focal subject.
Palette: jade, sickly green, old bone, warm gold, black lead.
Materials/textures: matte jade glass, old bone plinth, tarnished relic chain, weathered jungle-shrine stone, broad stained-glass light planes.
Constraints: no text; no labels; no watermark; no buttons; no UI chrome; no full card mockup; no visible Hex card; no guaranteed reward pile; no living cultist; no extra figures; no many skulls; no purely benevolent mood; avoid detailed lattice, floor grids, tiny filigree, tiny cracks, dense vines, complex architecture, extra offerings, and foreground clutter.
```

## Nano Banana Pro Pass

Command model flag: `--model nanobanana-pro`
Resolved model reported by script: `gemini-3-pro-image`
Ratio: `3:2`
Size: `2K`
Input image:
`scratch/style-tests/event-production-20260706/cursedIdol/01-gpt-image-source.png`
Requested output:
`scratch/style-tests/event-production-20260706/cursedIdol/02-nanobanana-pro-clean.png`
Saved response:
`scratch/style-tests/event-production-20260706/cursedIdol/02-nanobanana-pro-response.json`

The Nano Banana payload was JPEG despite the requested `.png` path. It was
retained as:
`scratch/style-tests/event-production-20260706/cursedIdol/02-nanobanana-pro-clean-original.jpg`

It was converted to a true PNG at:
`scratch/style-tests/event-production-20260706/cursedIdol/02-nanobanana-pro-clean.png`

Converted PNG format: PNG, 2528 x 1696, RGB

Exact Nano Banana prompt:

```text
帮我将这张图片重绘和清晰化，让它细节更丰富，同时去掉原图中杂乱不必要的细节。重要：这次不做 alpha、chroma-key、cutout 或透明背景控制；请保留完整的 3:2 Spirebound event scene 和原图的叙事背景。保留翡翠玉石神像和骷髅基座作为清晰前景主体；保留一条被遗弃的遗物链；背景保留宽阔的丛林神殿石板、深绿色光平面和昏暗的神龛轮廓。整体要像严肃 cartoon-gothic stained-glass game art：主主体有更粗的黑色外轮廓、更大的形块、更少碎裂玻璃、更少地面碎片，128px 仍然能读。背景可以有深度和叙事，但对比度和线条数量必须低于主体。保留 jade、sickly green、old bone、warm gold 和 black lead 的配色。不要加入人物、文字、UI、Hex 卡牌、明显奖励堆、活着的邪教徒、额外供品、太多骷髅、玻璃碎片、地板图案、符文、复杂建筑、密集藤蔓或阻挡主体的前景物；不要把神像画得纯粹善意或友好。
```

Exact command:

```bash
python3 /Users/jamesto/.codex/skills/nanobanana/scripts/nanobanana.py generate --prompt "帮我将这张图片重绘和清晰化，让它细节更丰富，同时去掉原图中杂乱不必要的细节。重要：这次不做 alpha、chroma-key、cutout 或透明背景控制；请保留完整的 3:2 Spirebound event scene 和原图的叙事背景。保留翡翠玉石神像和骷髅基座作为清晰前景主体；保留一条被遗弃的遗物链；背景保留宽阔的丛林神殿石板、深绿色光平面和昏暗的神龛轮廓。整体要像严肃 cartoon-gothic stained-glass game art：主主体有更粗的黑色外轮廓、更大的形块、更少碎裂玻璃、更少地面碎片，128px 仍然能读。背景可以有深度和叙事，但对比度和线条数量必须低于主体。保留 jade、sickly green、old bone、warm gold 和 black lead 的配色。不要加入人物、文字、UI、Hex 卡牌、明显奖励堆、活着的邪教徒、额外供品、太多骷髅、玻璃碎片、地板图案、符文、复杂建筑、密集藤蔓或阻挡主体的前景物；不要把神像画得纯粹善意或友好。" --input-image scratch/style-tests/event-production-20260706/cursedIdol/01-gpt-image-source.png --model nanobanana-pro --ratio 3:2 --size 2K --output scratch/style-tests/event-production-20260706/cursedIdol/02-nanobanana-pro-clean.png --save-response scratch/style-tests/event-production-20260706/cursedIdol/02-nanobanana-pro-response.json
```

## Comparison And Registration

Comparison sheet:
`scratch/style-tests/event-production-20260706/cursedIdol/comparison-sheet.png`

The comparison sheet places the GPT source on the left and the Nano Banana Pro
clean-up on the right.

Registered gallery asset:
`src/assets/events/cursedIdol.png`

Registration transform: true PNG converted from Nano Banana output, resized and
centre-cropped to 1024 x 683 so the max edge is 1024px and the event scene stays
near 3:2.

## First-Read Review

Accepted for gallery registration.

The Nano Banana output improves the source by simplifying the jungle-shrine
background, strengthening the idol's black contour, and making the jade warmth
read clearly as dangerous comfort rather than a friendly blessing. The focal
read is correct: jade idol first, skull plinth second, abandoned relic chain
third, broad shrine stones and green light planes last.

No text, labels, UI chrome, Hex card, living cultist, reward pile, extra figures,
or excessive skull clutter observed. Residual note: the floor still carries
visible lead lines at full size, but they are lower contrast than the idol and
plinth and should not dominate at event-panel size.
