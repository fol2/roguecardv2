# Humming Chest Event Production Ledger

## Event

- Event id: `voidChest`
- Event name: Humming Chest
- Runtime target: `src/assets/events/voidChest.png`
- Readable-baseline target: `src/assets-readable-baseline/events/voidChest.png`

## Small Story

This treasury alcove was sealed from the outside, not the inside. The lock has
already broken and the chest keeps singing the note that ruined the last hand
that touched it. The image freezes the moment before the player opens it or
walks away.

## Design

Foreground: massive black iron chest with two large violet side panels, one
broken amber lock, and one mouth-like lid seam. Midground: one broken key.
Background: broad treasury arches and coloured light pools. Palette: black
iron, luminous violet, cold blue background masses, warm amber lock light, and
one tiny sickly green danger accent.

Avoided reads: visible relic, damage outcome, monster emerging from the chest,
reward pile, glass-shard field, detailed lattice, and floor grid.

## GPT Source

- Tool: built-in Codex `image_gen`
- Generated image id: `ig_08e02298dce5bd51016a4aeea3c320819184d7215695ca73a3.png`
- Source path: `scratch/style-tests/event-production-20260706/voidChest/01-gpt-image-source.png`
- Original evidence folder: `scratch/style-tests/event-story-first3-20260706-less-fragile/`

### Exact GPT Prompt

```text
Use case: stylized-concept
Asset type: Spirebound event art story demo, first-three event set, less-fragile second pass
Primary request: Humming Chest, a rare danger-gamble event at the moment before the player chooses to open it or leave. A massive black iron chest sits in the foreground as one heavy chunky object, with only two large violet side panels, a broken amber lock, and one simple mouth-like lid seam that hints at teeth without opening. A single broken key rests nearby; behind it, two huge treasury arch shapes and broad pools of coloured light imply temptation and danger.
Small story: This treasury alcove was sealed from the outside, not the inside. The lock has already broken and the chest keeps singing the note that ruined the last hand that touched it; it may contain a relic, or it may only be bait.
Round direction: less glass pieces, less fragile. The chest should feel like heavy black iron and large solid panels, not a fragile glass mosaic. Use stained-glass influence only in the big violet glow and colour masses.
Narrative read: show the heavy chest silhouette first, the broken lock and simple mouth-like seam second, and the ruined treasury alcove third. The image must read clearly inside a 440px event panel and still scan at 128px.
Style/medium: serious cartoon-gothic dark fantasy game art; stained-glass inspired but not mosaic-heavy; chunky black outer contour on the chest; broad toy-like silhouette; 3-5 large colour masses; at most 5 interior divider strokes on the chest; matte painterly iron; luminous violet panels; warm amber broken lock glow; tiny sickly green danger glint.
Composition/framing: wide 3:2 full event scene with background included; centre-right chest focal; clear foreground, midground, and background depth; generous breathing room; no hard card frame; no cropped chest, lid, lock, seam, or key; plain dark stage floor, not cobblestones.
Lighting/mood: luminous midtones, dangerous temptation mood; warm lock light against cool violet-blue treasury light; background lower contrast and fewer lines than the chest.
Palette: black iron, luminous violet, cold blue background masses, warm amber lock light, tiny sickly green danger accent.
Constraints: no text; no labels; no watermark; no buttons; no UI chrome; no full card mockup; do not show a relic clearly; do not show the damage outcome; no monster emerging from the chest; no small glass shards; no hairline cracks; no fragile filigree; no detailed window lattice; no floor grid; no cobblestone detail; no busy background architecture; background must have fewer lines than the subject.
```

## Nano Banana Pro Clean-Up

- Model alias: `nanobanana-pro`
- Resolved model: `gemini-3-pro-image`
- Ratio: `3:2`
- Size: `2K`
- Output path: `scratch/style-tests/event-production-20260706/voidChest/02-nanobanana-pro-clean.png`
- Original payload path: `scratch/style-tests/event-production-20260706/voidChest/02-nanobanana-pro-clean-original.jpg`
- Response path: `scratch/style-tests/event-production-20260706/voidChest/02-nanobanana-pro-response.json`

### Exact Nano Banana Prompt

```text
帮我将这张图片重绘和清晰化，让它细节更丰富，同时去掉原图中杂乱不必要的细节。重要：这次不做 alpha、chroma-key、cutout 或透明背景控制；请保留完整的 3:2 Spirebound event scene 和原图的叙事背景。保留 massive black iron chest as the clear foreground subject, with two large violet side panels, one broken amber lock, and one simple mouth-like lid seam that hints at teeth without opening; 保留 one single broken key as the midground choice prop；背景保留 two or three huge treasury arch shapes and broad pools of coloured light. 整体要像严肃 cartoon-gothic stained-glass game art：主主体有更粗的黑色外轮廓、更大的形块、更少碎裂玻璃、更少地面碎片，128px 仍然能读。背景可以有深度和叙事，但对比度和线条数量必须低于 chest。保留 black iron, luminous violet, cold blue background masses, warm amber lock light, and tiny sickly green danger accent. 不要加入文字、UI、清楚的 relic、怪物冒出、伤害结果、明显奖励堆、玻璃碎片、地板图案、符文、复杂建筑或阻挡主体的前景物。
```

## First-Read Review

Approved for production promotion. The Nano Banana pass preserves the heavy
chest read and danger seam while making the treasury background broader and less
fragile. The result keeps the gamble unresolved and does not show a relic or
damage outcome.

Registered outputs:

- `src/assets/events/voidChest.png`
- `src/assets-readable-baseline/events/voidChest.png`

