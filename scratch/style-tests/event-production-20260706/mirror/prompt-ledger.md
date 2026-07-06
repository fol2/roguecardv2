# Mirror Event Production Prompt Ledger

Event id: `mirror`
Event name: The Silvered Mirror
Worker scope: `mirror` only

## Story And Design

Small story: The mirror survived the collapse because it wanted to. Every person who stood before it left a little delay behind; now the reflection moves half a breath late and smiles a fraction early, while the mirror remains intact.

Decision moment: the player has not chosen to duplicate, shatter, or leave. The reflection is out of sync, but the shattering outcome has not happened.

Design: foreground tall silver mirror with a simplified delayed silhouette inside; midground one sharp fallen stone and a reflected card-shaped glass pane; background broad rubble arches and cold moonlit glass planes. Palette: silver blue, pale cyan, violet shadow, small amber edge light, and black lead.

Avoided: detailed player portrait, horror-face excess, already-shattered mirror outcome, tiny mirror filigree, text, UI, reward callouts, and busy background architecture.

## GPT Image Source

Mode: built-in `image_gen` direct, one GPT image source.

Generated image id: `ig_0284468ea133a038016a4afb064978819196792cf8f2e3b1ee.png`

Original generated source path:

```text
/Users/jamesto/.codex/generated_images/019f34e3-cb85-75b3-b3b1-691f1722033d/ig_0284468ea133a038016a4afb064978819196792cf8f2e3b1ee.png
```

Workspace source copy:

```text
scratch/style-tests/event-production-20260706/mirror/01-gpt-image-source.png
```

Exact GPT prompt:

```text
Use case: stylized-concept
Asset type: Spirebound event art full-background source
Primary request: The Silvered Mirror, a rare craft event: a tall intact silver mirror survived a collapsed hall because it wanted to; the reflection inside moves half a breath late and smiles a fraction early, offering either a copy or a clean break.
Small story: Every person who stood before the mirror left a little delay behind. The player has not chosen to duplicate, shatter, or leave; the mirror is still whole.
Narrative read: show the tall intact silver mirror first, the slightly delayed silhouette inside second, one sharp fallen stone and a reflected card-shaped pane third, and broad rubble arches with cold moonlit glass fourth. The image must read clearly inside a 440px event panel and still scan at 128px.
Style/medium: serious cartoon-gothic stained-glass game art; sturdy theatrical event scene; chunky black outer contour on the main mirror; simplified object cluster; 3-5 large jewel-tone glass masses; very few thick lead dividers; matte painterly glass texture; controlled inner glow from the mirror glass; small warm amber rim light; not glossy 3D, not generic fantasy splash art.
Composition/framing: wide 3:2 full-background event scene; centre-right focal mirror; foreground/midground/background depth; clean left and upper breathing room; no hard card frame; no cropped mirror, stone, or reflected card pane; no action blur; stage-like vignette without UI.
Lighting/mood: luminous midtones; sober gothic decision-scene mood; high value contrast on the mirror silhouette; cold moonlit glass in the background lower contrast than the mirror; violet shadows under rubble; glow supports choice tension without obscuring the silhouette.
Palette: silver blue, pale cyan, violet shadow, small amber edge light, black lead.
Scene/backdrop: broad narrative background with two or three simple place cues: rubble arches, broken chapel stones, cold moonlit glass planes. Background contrast and line count must be lower than the mirror.
Constraints: full-background scene, no alpha, no chroma-key, no transparent background. No text; no labels; no watermark; no buttons; no UI chrome; no full card mockup; no detailed player portrait; no horror-face excess; no shattered outcome already happening; no tiny mirror filigree; no detailed lattice, floor grids, busy architecture, piles of rewards, runes, or foreground objects blocking the mirror.
```

First-read review: strong centre-right mirror and clear collapsed moonlit hall. The source had good palette and composition, but the reflected figure was too portrait-like and the background/floor detail was busier than the approved event direction. Kept as the required GPT source for Nano Banana Pro clean-up.

## Nano Banana Pro Clean-Up

Script:

```text
/Users/jamesto/.codex/skills/nanobanana/scripts/nanobanana.py generate
```

Model/settings:

```text
--model nanobanana-pro
resolved model: gemini-3-pro-image
--ratio 3:2
--size 2K
--input-image scratch/style-tests/event-production-20260706/mirror/01-gpt-image-source.png
--output scratch/style-tests/event-production-20260706/mirror/02-nanobanana-pro-clean.png
--save-response scratch/style-tests/event-production-20260706/mirror/02-nanobanana-pro-response.json
```

Exact Nano Banana prompt:

```text
帮我将这张图片重绘和清晰化，让它细节更丰富，同时去掉原图中杂乱不必要的细节。重要：这次不做 alpha、chroma-key、cutout 或透明背景控制；请保留完整的 3:2 Spirebound event scene 和原图的叙事背景。保留高大的完整银镜作为清晰前景主体；保留镜中半拍延迟的简化黑色人形倒影、一个尖锐落石和一块被反射的卡牌形玻璃；背景保留宽阔倒塌拱门、冷月光玻璃面和简化碎石废墟。整体要像严肃 cartoon-gothic stained-glass game art：主主体有更粗的黑色外轮廓、更大的形块、更少碎裂玻璃、更少地面碎片，128px 仍然能读。背景可以有深度和叙事，但对比度和线条数量必须低于主体。保留银蓝、浅青、紫罗兰阴影、少量琥珀边缘光和黑色铅线的配色。不要加入人物、详细玩家肖像、恐怖脸、文字、UI、明显奖励堆、额外供品、玻璃碎片、地板图案、符文、复杂建筑、碎裂中的镜子或阻挡主体的前景物。
```

Output handling:

- The script saved JPEG payload bytes despite the `.png` output name.
- Retained original payload as `02-nanobanana-pro-clean-original.jpg`.
- Converted it to a true PNG at `02-nanobanana-pro-clean.png`.
- Saved raw response JSON at `02-nanobanana-pro-response.json`.

First-read review: accepted for gallery registration. Nano Banana Pro simplified the source into a more readable cartoon-gothic event panel, strengthened the mirror contour, brightened the cold stained-glass planes, and reduced fragile texture. Remaining caveats: the delayed reflection still has a sinister smile, and the reflected card pane reads partly as a glass shard at small size, but the intact mirror and delayed-reflection decision moment are clear.

## Comparison And Registration

Comparison sheet:

```text
scratch/style-tests/event-production-20260706/mirror/comparison-sheet.jpg
```

Registered gallery asset:

```text
src/assets/events/mirror.png
```

Registration note: `src/assets/events/mirror.png` was replaced only for event id `mirror`, using the Nano Banana Pro PNG normalised to a max edge of 1024px and centred to exact 3:2 output dimensions (`1024 x 683`).
