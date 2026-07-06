# Wounded Knight Event Production Ledger

## Event

- Event id: `woundedKnight`
- Event name: The Wounded Knight
- Runtime target: `src/assets/events/woundedKnight.png`
- Readable-baseline target: `src/assets-readable-baseline/events/woundedKnight.png`

## Small Story

A knight dragged a relic out of a broken chapel battle and made it as far as one
shattered pillar. His offered hand asks for mercy; his fallen purse and broken
blade tempt the player to take what remains. The image freezes the moment before
aid, theft, or leaving.

## Design

Foreground: crushed wounded knight slumped by one broken pillar, holding one
small warm relic. Midground: one simple fallen purse and one broad broken blade.
Background: broad ruined chapel arches and cold blue light. Palette: luminous
bruised blue, pale silver-blue chapel light, black lead, warm amber relic light,
muted red wound accent, and small tarnished-gold purse accent.

Avoided reads: heroic standing posture, gore, extra soldiers, excessive armour
segments, glass-shard field, detailed window lattice, and floor grid.

## GPT Source

- Tool: built-in Codex `image_gen`
- Generated image id: `ig_08e02298dce5bd51016a4aee6a21e881918e7e2d1cd4933d26.png`
- Source path: `scratch/style-tests/event-production-20260706/woundedKnight/01-gpt-image-source.png`
- Original evidence folder: `scratch/style-tests/event-story-first3-20260706-less-fragile/`

### Exact GPT Prompt

```text
Use case: stylized-concept
Asset type: Spirebound event art story demo, first-three event set, less-fragile second pass
Primary request: The Wounded Knight, a priced encounter event at the moment before the player chooses to aid him, loot him, or leave. A crushed knight slumps in the foreground against a single broken pillar, still breathing behind a damaged visor, holding out a small warm relic. Nearby, one simple fallen purse and one broad broken blade tempt theft; behind him, two huge soft chapel arch shapes and cold blue light show where he fell.
Small story: A knight dragged a relic out of a broken chapel battle and made it as far as one shattered pillar. His offered hand asks for mercy; his fallen purse and broken blade tempt the player to take what remains.
Round direction: less glass pieces, less fragile. The knight should be built from a few large solid armour plates, not many segmented glass panes. Use stained-glass influence only in colour and glow, not as many little shards.
Narrative read: show the wounded knight and offered relic first, the purse and broken blade second, and the lonely ruined chapel third. The image must read clearly inside a 440px event panel and still scan at 128px.
Style/medium: serious cartoon-gothic dark fantasy game art; stained-glass inspired but not mosaic-heavy; chunky black outer contour on the knight; broad toy-like silhouette; 3-5 large colour masses; at most 6 interior armour divider strokes total; matte painterly metal and glass glow; warm amber relic light; controlled blue visor glow.
Composition/framing: wide 3:2 full event scene with background included; centre-right knight focal; clear foreground, midground, and background depth; generous breathing room; no hard card frame; no cropped knight, relic, pillar, purse, or broken blade; plain dark stage floor, not cobblestones.
Lighting/mood: luminous midtones, merciful but morally tense mood; warm relic light against cool blue ruined chapel light; background lower contrast and fewer lines than the knight.
Palette: luminous bruised blue, pale silver-blue chapel light, black lead, warm amber relic light, muted red wound accent, small tarnished-gold purse accent.
Constraints: no text; no labels; no watermark; no buttons; no UI chrome; no full card mockup; no heroic standing posture; no gore; no extra soldiers; no excessive armour segments; no small glass shards; no hairline cracks; no detailed window lattice; no floor grid; no cobblestone detail; no busy background architecture; background must have fewer lines than the subject.
```

## Nano Banana Pro Clean-Up

- Model alias: `nanobanana-pro`
- Resolved model: `gemini-3-pro-image`
- Ratio: `3:2`
- Size: `2K`
- Output path: `scratch/style-tests/event-production-20260706/woundedKnight/02-nanobanana-pro-clean.png`
- Original payload path: `scratch/style-tests/event-production-20260706/woundedKnight/02-nanobanana-pro-clean-original.jpg`
- Response path: `scratch/style-tests/event-production-20260706/woundedKnight/02-nanobanana-pro-response.json`

### Exact Nano Banana Prompt

```text
帮我将这张图片重绘和清晰化，让它细节更丰富，同时去掉原图中杂乱不必要的细节。重要：这次不做 alpha、chroma-key、cutout 或透明背景控制；请保留完整的 3:2 Spirebound event scene 和原图的叙事背景。保留 crushed wounded knight slumped by one broken pillar as the clear foreground subject, holding one small warm relic; 保留 one simple fallen purse and one broad broken blade as midground choice props；背景保留 two or three huge soft chapel arch shapes and cold blue ruined chapel light. 整体要像严肃 cartoon-gothic stained-glass game art：主主体有更粗的黑色外轮廓、更大的形块、更少碎裂玻璃、更少地面碎片，128px 仍然能读。背景可以有深度和叙事，但对比度和线条数量必须低于 knight。保留 luminous bruised blue, pale silver-blue chapel light, black lead, warm amber relic light, muted red wound accent, and small tarnished-gold purse accent. 不要加入文字、UI、额外士兵、血腥、英雄站姿、明显奖励堆、玻璃碎片、地板图案、符文、复杂建筑或阻挡主体的前景物。
```

## First-Read Review

Approved for production promotion. The Nano Banana pass keeps the wounded figure
and offered relic readable while making the armour masses sturdier and the
chapel background broader. The choice remains unresolved: the relic is offered,
but no reward is shown as already collected.

Registered outputs:

- `src/assets/events/woundedKnight.png`
- `src/assets-readable-baseline/events/woundedKnight.png`

