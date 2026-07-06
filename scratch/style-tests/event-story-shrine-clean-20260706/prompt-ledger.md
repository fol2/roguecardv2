# Forgotten Shrine Clean Prompt - Prompt Ledger

Date: 2026-07-06
Mode: built-in image_gen baseline -> Nano Banana Pro clean-up
Status: Nano Banana full-scene clean-up, pending review

This pass responds to the failed `forgottenShrine` less-fragile result. The
prompt is deliberately shorter and more positive: one stone altar, one offering
bowl, one root arch, one soft chapel silhouette.

## Output

| Event | Source image | Built-in generated image id |
|---|---|---|
| `forgottenShrine` | `forgottenShrine/01-built-in-source.png` | `ig_06162c8cbaa750dc016a4af28d12f08191b6be05c19bdedfdf.png` |

Review sheets:

- `contact-sheet.jpg`
- `v2-vs-v3-contact.jpg`
- `contact-sheet-nanobanana.jpg`
- `v3-vs-nanobanana-contact.jpg`

## First Read

The clean prompt improved the failed Shrine direction. The subject is now one
solid moss-covered stone altar, the offering area is restrained, and the
background supports the story without turning into a field of fragments. The
trade-off is that it is less explicitly stained-glass than the approved Knight
and Chest, but it is much less fragile.

## Nano Banana Pro Clean-Up

This pass follows the current generated-art workflow's Step 2 model route, but
without alpha, chroma-key, cutout, or transparent-background control. The goal is
to keep the full narrative event background while making the Shrine sturdier,
cleaner, and more readable.

| Event | Input image | Nano Banana output | Raw response |
|---|---|---|---|
| `forgottenShrine` | `forgottenShrine/01-built-in-source.png` | `forgottenShrine/02-nanobanana-pro-clean.png` | `forgottenShrine/02-nanobanana-pro-response.json` |

Model/settings:

- Model alias: `nanobanana-pro`
- Resolved model: `gemini-3-pro-image`
- Ratio: `3:2`
- Size: `2K`
- Original model payload returned JPEG; retained as
  `forgottenShrine/02-nanobanana-pro-clean-original.jpg`, then converted to a
  true PNG at `forgottenShrine/02-nanobanana-pro-clean.png`.

First read: the Nano Banana version is more explicitly cartoon-gothic and
stained-glass-readable. The foreground subject has a heavier contour, the
background now carries the root-arch and chapel story in clearer layers, and the
piece feels less fragile than the clean prompt baseline. The trade-off is that
the altar has drifted slightly toward a small chapel doorway, and the offering
bowl is more prominent than in the source. It still avoids the failed blockers:
no extra characters, no glass-shard field, no reward pile, and no dense lattice.

### Prompt - Nano Banana Pro Full-Scene Clean-Up

```text
帮我将这张图片重绘和清晰化，让它细节更丰富，同时去掉原图中杂乱不必要的细节。重要：这次不做 alpha、chroma-key、cutout 或透明背景控制；请保留完整的 3:2 Spirebound event scene 和原图的叙事背景。保留一个厚重、覆满苔藓的石质祭坛作为清晰前景主体，中央只有一个琥珀色眼形微光；保留一个简单供碗，碗里只有两根苍白骨头和一枚暗银硬币；背景保留一组巨大的黑色树根拱形和柔和的废 chapel 墙影。整体要像严肃 cartoon-gothic stained-glass game art：主主体有更粗的黑色外轮廓、更大的形块、更少碎裂玻璃、更少地面碎片，128px 仍然能读。背景可以有深度和叙事，但对比度和线条数量必须低于祭坛。保留暗苔藓绿、旧灰石、暖琥珀、暗银、苍白骨色、冷绿蓝背景。不要加入人物、文字、UI、明显奖励堆、额外供品、玻璃碎片、地板图案、符文、复杂建筑或阻挡主体的前景物。
```

## Prompt - Forgotten Shrine Clean Prompt

```text
Use case: stylized-concept
Asset type: Spirebound event art story demo, Forgotten Shrine clean prompt
Primary request: Forgotten Shrine, a cursed sanctuary event at the moment before the player chooses to pray, desecrate, or leave. Show one heavy moss-covered stone altar in the foreground, shaped like a small monolith shrine with a single amber eye-shaped glow in its centre. At its base is one simple offering bowl with two pale bones and one dull silver coin. Behind it is one huge dark root arch and a soft chapel wall silhouette.
Small story: Travellers once left unwanted memories here. The shrine kept those bargains, and now its single amber eye has opened for the player.
Narrative read: show the solid shrine first, the single offering bowl second, and the broad root arch third. It must read inside a 440px event panel and at 128px.
Style/medium: serious cartoon-gothic dark fantasy game art; carved stone and moss, not glass mosaic; chunky black outer contour; broad toy-like silhouette; 3-4 large colour masses; almost no interior linework; matte painterly texture; controlled amber glow.
Composition/framing: wide 3:2 event scene; centre-right shrine focal; plain dark stage floor; foreground/midground/background depth; generous breathing room; no frame.
Lighting/mood: luminous midtones; warm amber shrine glow against cool green-blue background; background softer and simpler than the shrine.
Palette: dark moss green, old grey stone, warm amber, dull bone, muted silver, black lead accents.
Constraints: no text, no UI, no characters, no visible reward, no extra offerings, no small shards, no floor pattern.
```
