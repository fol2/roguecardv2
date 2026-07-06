# `gambler` Event Art Production Ledger

Date: 2026-07-06

Event id: `gambler`

Event name: The Bone Gambler

## Small Story

The gambler has played this table through several disasters and keeps the
losing bones. He offers one throw because one throw is enough: the cup is
tilted, the bones are not yet cast, and the wager remains voluntary.

## Design Brief

- Foreground: grinning bone gambler, bone cup tilted in one hand, open palm in
  the other.
- Midground: simple ritual table with three chunky bone dice and one small coin
  stack.
- Background: broad tavern-crypt arch shapes with low amber light.
- Palette: bone white, old gold, smoky violet, warm amber, black lead.
- Avoid: visible dice text, visible dice result, guaranteed money pile, crowd,
  UI, labels, watermark, dense lattice, floor grids, tiny filigree.

## GPT Image Source

Built-in image generation was used directly. No CLI fallback, `codex exec`,
`tools/imagegen.sh`, `tools/genasset.sh`, alpha, transparent background, or
chroma-key was used.

Generated image id:

```text
ig_0c231fa0668f0660016a4afb1c15208191959acf897741edde.png
```

Original generated source path:

```text
/Users/jamesto/.codex/generated_images/019f34e3-ca10-7f32-b702-422f0d2a940b/ig_0c231fa0668f0660016a4afb1c15208191959acf897741edde.png
```

Workspace source copy:

```text
scratch/style-tests/event-production-20260706/gambler/01-gpt-image-source.png
```

Source dimensions: 1536 x 1024 PNG, RGB.

### Exact GPT Prompt

```text
Use case: stylized-concept
Asset type: Spirebound event art full-background source
Primary request: The Bone Gambler, a rare bargain-gamble event. Show the decision moment: a grinning bone gambler tilts a bone cup, one open palm inviting the wager, but the bones have not yet been cast and the bet is still voluntary.
Small story: The gambler has played this table through several disasters and keeps the losing bones. He offers one throw because one throw is enough; the cup rattles with old knuckles and the table bears old pressure marks from desperate hands.
Narrative read: show the grinning figure with bone cup first, the voluntary open palm and risky table ritual second, the tavern-crypt setting third. The image must read clearly inside a 440px event panel and still scan at 128px.
Style/medium: serious cartoon-gothic stained-glass game art; chunky black outer contour on the main figure; simplified theatrical scene; 3-5 large jewel-tone glass masses; very few thick lead dividers; matte painterly glass texture; warm amber rim light; controlled inner glow limited to the cup, grin, and coin glints; no generic fantasy illustration.
Composition/framing: wide 3:2 full event scene; centre-right foreground figure; foreground/midground/background depth; generous breathing room on the left/upper side; no hard rectangular frame; no cropped cup, palm, table, or focal head; no action blur; stage-like vignette without baked UI.
Scene/backdrop: midground simple ritual table with three chunky blank bone dice and one small old-gold coin stack; background has two or three broad tavern-crypt arch shapes and low amber light planes, lower contrast and fewer lines than the figure.
Lighting/mood: luminous midtones; sober gothic decision mood; warm amber table light against smoky violet shadow; high value contrast on the main read without crushing darkness.
Palette: bone white, old gold, smoky violet, warm amber, black lead.
Constraints: full-background 3:2 scene, not a cutout; no alpha; no transparent background; no chroma-key; no text; no labels; no watermark; no buttons; no UI chrome; no full card mockup; no visible numbers, letters, or outcome marks on dice; do not show the throw already resolved; no guaranteed money pile; no crowd; avoid detailed lattice, floor grids, tiny filigree, busy background architecture, extra gamblers, extra offerings, runes, or foreground objects blocking the figure.
```

## Nano Banana Pro Clean-Up

Input image:

```text
scratch/style-tests/event-production-20260706/gambler/01-gpt-image-source.png
```

Model and settings:

```text
script: /Users/jamesto/.codex/skills/nanobanana/scripts/nanobanana.py generate
model alias: nanobanana-pro
resolved model: gemini-3-pro-image
ratio: 3:2
size: 2K
response id: v1_Chc0ZnRLYXVTcENlcUZrZFVQaWY2V3dRRRIXNGZ0S2F1U3BDZXFGa2RVUGlmNld3UUU
response status: completed
```

The script saved a JPEG payload at the requested `.png` path. It was retained as
`02-nanobanana-pro-clean-original.jpg` and converted to a true PNG at
`02-nanobanana-pro-clean.png`.

Output paths:

```text
scratch/style-tests/event-production-20260706/gambler/02-nanobanana-pro-clean-original.jpg
scratch/style-tests/event-production-20260706/gambler/02-nanobanana-pro-clean.png
scratch/style-tests/event-production-20260706/gambler/02-nanobanana-pro-response.json
```

Clean PNG dimensions: 2528 x 1696 PNG, RGB.

### Exact Nano Banana Prompt

```text
帮我将这张图片重绘和清晰化，让它细节更丰富，同时去掉原图中杂乱不必要的细节。重要：这次不做 alpha、chroma-key、cutout 或透明背景控制；请保留完整的 3:2 Spirebound event scene 和原图的叙事背景。保留前景咧嘴的骨赌徒作为清晰主体：一只手倾斜骨杯，另一只手摊开邀请下注，下注仍然是自愿选择。保留中景简单仪式赌桌、三粒粗大的骨骰和一小叠旧金币；但骰子不能显示点数、文字、符号或胜负结果，看起来像尚未掷出或尚未揭示的骨块，不要像已经落定的结果。背景保留两三个宽大的酒馆墓穴拱形和低暖琥珀光。整体要像严肃 cartoon-gothic stained-glass game art：主主体有更粗的黑色外轮廓、更大的形块、更少碎裂玻璃、更少桌面和地面碎线，128px 仍然能读。背景可以有深度和叙事，但对比度和线条数量必须低于主体。保留骨白、旧金、烟紫、暖琥珀、黑铅 palette。不要加入额外人物、文字、UI、明显奖励堆、更多金币、观众、额外供品、玻璃碎片、地板图案、符文、复杂建筑或阻挡主体的前景物。
```

## Comparison Sheet

```text
scratch/style-tests/event-production-20260706/gambler/contact-sheet.png
```

Contact sheet layout: GPT source on the left, Nano Banana Pro clean-up on the
right.

## Gallery Registration

The final gallery asset was normalised from `02-nanobanana-pro-clean.png` with a
small south-preserving crop to keep the foreground props, then resized to a max
edge of 1024px.

Registered path:

```text
src/assets/events/gambler.png
```

Registered dimensions: 1024 x 683 PNG, RGB.

## First-Read Review

Accepted for gallery registration.

- The grinning figure, tilted bone cup, and open palm read immediately.
- The table ritual is clear, with three unmarked bone dice and a small coin
  stack rather than a guaranteed reward pile.
- The Nano Banana pass removed visible dice outcome marks and simplified the
  background compared with the GPT source.
- Caveat: the table still has more lead-line geometry than ideal, but the main
  figure remains the highest-contrast read and the background stays secondary.
