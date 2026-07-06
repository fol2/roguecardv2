# Ruined Camp Event Art Production Ledger

Event id: `ruinedCamp`
Event name: Ruined Camp
Taxonomy: sanctuary / safe / common / place
Worker scope: `ruinedCamp` only

## Small Story

Whoever made this camp left in the middle of a breath. The fire is still alive,
the bedrolls are torn, and a pack lies open with useful things inside. The
danger has moved on, but the silence has not.

Decision moment: the player can sit by the fire or search the abandoned packs.

## Design

Foreground: smouldering campfire and torn bedroll.
Midground: open pack with one small phial glint and a few coins.
Background: broad tree and ruin silhouettes with dawn-grey light.

Palette: warm campfire amber, muted canvas brown, cool blue-grey, tiny phial
colour accent, and black lead.

Avoided: dead bodies, active attackers, too much loot, cosy tavern mood, busy
forest scene, people, UI, text, labels, card frame, and guaranteed reward
reveal.

## GPT Image Source

Built-in image tool: `image_gen`
Generated image id: `ig_0d413076c3214625016a4afcd86d4c819189b380b415c9c129.png`
Generated source path:
`/Users/jamesto/.codex/generated_images/019f34ea-4adf-73f3-b74f-e50dd00827f2/ig_0d413076c3214625016a4afcd86d4c819189b380b415c9c129.png`
Copied source path:
`scratch/style-tests/event-production-20260706/ruinedCamp/01-gpt-image-source.png`
Source format: PNG, 1536 x 1024, RGB

Exact GPT prompt:

```text
Use case: stylized-concept
Asset type: Spirebound event art full-background source, production pass for event id ruinedCamp
Primary request: Ruined Camp, a common sanctuary event: an abandoned camp was left in the middle of a breath, with a smouldering campfire still alive beside a torn bedroll, and an open pack hinting at useful supplies without making the loot feel guaranteed.
Small story: Whoever made this camp left in the middle of a breath. The fire is still alive, the bedrolls are torn, and a pack lies open with useful things inside. The danger has moved on, but the silence has not.
Narrative read: show the smouldering campfire and torn bedroll first, the open pack with one small phial glint and a few coins second, and broad tree or ruin silhouettes in dawn-grey light third. The scene must read clearly inside a 440px event panel and still scan at 128px.
Style/medium: serious cartoon-gothic stained-glass game art; chunky black outer contour on the campfire, torn bedroll, and open pack; simplified theatrical scene; 3-5 large jewel-tone glass masses; very few thick black lead dividers; matte painterly glass texture; warm amber rim light; controlled inner glow from the campfire only; no generic fantasy illustration.
Composition/framing: wide 3:2 full-background event scene; centre-right focal campfire with torn bedroll in the foreground; midground open pack with a small phial glint and only a few coins; background two or three broad tree or ruin silhouettes with dawn-grey light planes; generous breathing room on the left and upper area; no hard card frame; no cropped fire, bedroll, pack, phial, or broad silhouettes; no action blur; stage-like vignette without baked UI.
Lighting/mood: luminous midtones; quiet sanctuary mood with unease; warm campfire amber against cool blue-grey dawn light; high value contrast on the campfire, torn bedroll, and open pack; background contrast and line count lower than the focal subject.
Palette: warm campfire amber, muted canvas brown, cool blue-grey, tiny phial colour accent, black lead.
Materials/textures: charred wood, glowing coals, torn matte canvas, scuffed leather pack, a single glass phial glint, a few dull coins, broad dawn-grey stained-glass light planes.
Constraints: no text; no labels; no watermark; no buttons; no UI chrome; no full card mockup; no people; no dead bodies; no active attackers; no cosy tavern mood; no large loot pile; no many potions; no busy forest scene; avoid detailed lattice, floor grids, tiny filigree, tiny cracks, complex architecture, and foreground clutter.
```

## Nano Banana Pro Pass

Command model flag: `--model nanobanana-pro`
Resolved model reported by script: `gemini-3-pro-image`
Ratio: `3:2`
Size: `2K`
Input image:
`scratch/style-tests/event-production-20260706/ruinedCamp/01-gpt-image-source.png`
Requested output:
`scratch/style-tests/event-production-20260706/ruinedCamp/02-nanobanana-pro-clean.png`
Saved response:
`scratch/style-tests/event-production-20260706/ruinedCamp/02-nanobanana-pro-response.json`

The Nano Banana payload was JPEG despite the requested `.png` path. It was
retained as:
`scratch/style-tests/event-production-20260706/ruinedCamp/02-nanobanana-pro-clean-original.jpg`

It was converted to a true PNG at:
`scratch/style-tests/event-production-20260706/ruinedCamp/02-nanobanana-pro-clean.png`

Converted PNG format: PNG, 2528 x 1696, RGB

Exact Nano Banana prompt:

```text
帮我将这张图片重绘和清晰化，让它细节更丰富，同时去掉原图中杂乱不必要的细节。重要：这次不做 alpha、chroma-key、cutout 或透明背景控制；请保留完整的 3:2 Spirebound event scene 和原图的叙事背景。保留仍在发光的营火、撕裂的床卷和破布作为清晰前景主体；保留一个打开的背包，里面只有一个小药瓶微光和少量硬币；背景保留宽阔树影、残破遗迹剪影和黎明蓝灰光平面。整体要像严肃 cartoon-gothic stained-glass game art：主主体有更粗的黑色外轮廓、更大的形块、更少碎裂玻璃、更少地面碎片，128px 仍然能读。背景可以有深度和叙事，但对比度和线条数量必须低于主体。保留温暖营火琥珀色、 muted canvas brown、cool blue-grey、小药瓶色彩点缀和黑铅。不要加入人物、尸体、主动攻击者、文字、UI、明显奖励堆、许多药瓶、舒适酒馆气氛、繁忙森林、玻璃碎片、地板图案、符文、复杂建筑或阻挡主体的前景物。
```

Exact command:

```bash
python3 /Users/jamesto/.codex/skills/nanobanana/scripts/nanobanana.py generate --prompt "帮我将这张图片重绘和清晰化，让它细节更丰富，同时去掉原图中杂乱不必要的细节。重要：这次不做 alpha、chroma-key、cutout 或透明背景控制；请保留完整的 3:2 Spirebound event scene 和原图的叙事背景。保留仍在发光的营火、撕裂的床卷和破布作为清晰前景主体；保留一个打开的背包，里面只有一个小药瓶微光和少量硬币；背景保留宽阔树影、残破遗迹剪影和黎明蓝灰光平面。整体要像严肃 cartoon-gothic stained-glass game art：主主体有更粗的黑色外轮廓、更大的形块、更少碎裂玻璃、更少地面碎片，128px 仍然能读。背景可以有深度和叙事，但对比度和线条数量必须低于主体。保留温暖营火琥珀色、 muted canvas brown、cool blue-grey、小药瓶色彩点缀和黑铅。不要加入人物、尸体、主动攻击者、文字、UI、明显奖励堆、许多药瓶、舒适酒馆气氛、繁忙森林、玻璃碎片、地板图案、符文、复杂建筑或阻挡主体的前景物。" --input-image scratch/style-tests/event-production-20260706/ruinedCamp/01-gpt-image-source.png --model nanobanana-pro --ratio 3:2 --size 2K --output scratch/style-tests/event-production-20260706/ruinedCamp/02-nanobanana-pro-clean.png --save-response scratch/style-tests/event-production-20260706/ruinedCamp/02-nanobanana-pro-response.json
```

## Comparison And Registration

Contact sheet:
`scratch/style-tests/event-production-20260706/ruinedCamp/comparison-sheet.png`

Registered gallery asset:
`src/assets/events/ruinedCamp.png`

Registration transform: true PNG converted from Nano Banana output, resized and
centre-cropped to 1024 x 683 so the max edge is 1024px.

## First-Read Review

Accepted for gallery registration.

The Nano Banana output improves the source by simplifying the background glass
and floor detail while keeping the centre-right campfire readable. The focal
read is correct: living campfire and torn bedroll first, open pack with one
small phial and a few coins second, dawn-grey tree and ruin silhouettes third.
It contains no text, labels, people, corpses, active attackers, UI chrome, large
loot pile, many potions, or cosy tavern mood.

Residual note: the right-side tree remains a strong shape, but it frames the
scene and stays behind the fire, bedroll, and pack read at event-panel size.
