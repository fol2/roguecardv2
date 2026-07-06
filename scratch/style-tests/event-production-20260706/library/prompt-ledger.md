# Event Production Prompt Ledger - `library`

Event id: `library`  
Event name: The Drowned Library  
Worker scope: only `library`

## Story

Game context: choose a card from five, or heal among the stacks.

Small story: The library drowned slowly enough that some books learned to glow underwater. Most shelves are pulp, but a few pages still rise like fish around a dry ledge where a traveller could rest.

Decision moment: the player has found the glowing pages and the quiet resting place in the same flooded aisle.

Artwork design: foreground glowing pages floating above shallow water; midground waterlogged shelf and a dry stack of books like a small bed; background broad submerged arches and blue-green light planes.

Palette: deep teal, pale page gold, water blue, soft green, and black lead.

Avoid: readable text on pages, monster in water, deep landscape, too many books.

## GPT Image Source

Built-in generated image id: `ig_0ab3b677d3c0f5b0016a4afb1c015c8191918ef486afed6740.png`

Original generated source path: `/Users/jamesto/.codex/generated_images/019f34e3-cc5d-7a32-9cdd-ccb004236fb5/ig_0ab3b677d3c0f5b0016a4afb1c015c8191918ef486afed6740.png`

Workspace source path: `scratch/style-tests/event-production-20260706/library/01-gpt-image-source.png`

Generated source format: PNG, 1536x1024.

Exact GPT prompt:

```text
Use case: stylized-concept
Asset type: Spirebound event art full-background source
Primary request: The Drowned Library, an uncommon craft/safe place event: glowing pages float above shallow water in a flooded library aisle, with a dry stack of books like a small bed beside a waterlogged shelf; broad submerged arches and blue-green light planes reveal the drowned place.
Small story: The library drowned slowly enough that some books learned to glow underwater. Most shelves are pulp, but a few pages still rise like fish around a dry ledge where a traveller could rest.
Decision moment: the player has found the glowing pages and the quiet resting place in the same flooded aisle, before choosing to study or recover.
Narrative read: show the floating glowing pages first, the dry resting stack of books and waterlogged shelf second, and the broad submerged library arches third. The image must read clearly inside a 440px event panel and still scan on mobile.
Style/medium: serious cartoon-gothic stained-glass game art; sturdy theatrical event illustration; chunky black outer contour on the foreground glowing pages and dry book stack; simplified broad shapes; 3-5 large jewel-tone colour masses; very few thick lead dividers; matte painterly glass texture; warm pale page-gold inner glow; controlled soft green underwater glow; no generic fantasy illustration.
Composition/framing: wide 3:2 full event scene; centre-right focal cluster; foreground/midground/background depth; clean left and upper breathing room; no hard rectangular frame; no cropped focal pages or resting stack; no action blur; stage-like vignette without baked UI.
Lighting/mood: luminous midtones; sober gothic decision-scene mood; high value contrast on the glowing pages and dry resting place; background lower contrast and lower line count than the foreground; deep teal water and black lead should frame the pale page-gold glow without crushing the scene into darkness.
Palette: deep teal, water blue, soft green, pale page gold, black lead, restrained amber lantern warmth only at the page glow.
Scene/backdrop: shallow flooded aisle with one waterlogged shelf in the midground and two or three huge submerged arch shapes in the background; blue-green light planes, broad and low-detail, no detailed lattice or floor grid.
Constraints: full-background event scene, not an alpha cutout; no text; no readable words or symbols on pages; no labels; no watermark; no buttons; no UI chrome; no full card mockup; no guaranteed reward reveal; no people; no monster in the water; no deep landscape; no excessive books; no detailed window lattice; no floor grids; no tiny filigree; no busy architecture; no foreground object blocking the pages or resting stack.
```

First-read review: strong drowned-aisle read, clear page glow, clear shelf/resting stack, and useful blue-green arch backdrop. It has more small water and stone detail than the target, so it was passed to Nano Banana Pro for simplification and cleaner panel readability.

## Nano Banana Pro Clean-Up

Input image: `scratch/style-tests/event-production-20260706/library/01-gpt-image-source.png`

Model/settings: `nanobanana-pro` resolved to `gemini-3-pro-image`; `--ratio 3:2`; `--size 2K`; `generate`; one input image; response saved.

Response id: `v1_ChduZnRLYXB1Z05OVEhuc0VQbzRibWtBURIXbmZ0S2FwdWdOTlRIbnNFUG80Ym1rQVE`

Exact command output note: the script saved the requested `.png` path with payload type `[image/jpeg]`. The JPEG payload was retained as `02-nanobanana-pro-clean-original.jpg` and converted to a true PNG at `02-nanobanana-pro-clean.png`.

Exact Nano Banana prompt:

```text
帮我将这张图片重绘和清晰化，让它细节更丰富，同时去掉原图中杂乱不必要的细节。重要：这次不做 alpha、chroma-key、cutout 或透明背景控制；请保留完整的 3:2 Spirebound event scene 和原图的叙事背景。保留发光书页和浅水前景作为清晰前景主体；保留像小床一样的干书堆与水浸书架；背景保留宽阔的水下拱门、蓝绿色光面和浅水图书馆走廊。整体要像严肃 cartoon-gothic stained-glass game art：主主体有更粗的黑色外轮廓、更大的形块、更少碎裂玻璃、更少地面碎片，128px 仍然能读。背景可以有深度和叙事，但对比度和线条数量必须低于主体。保留深青色、浅纸金色、水蓝、柔和绿色和黑色铅线的 palette。不要加入人物、文字、UI、明显奖励堆、额外供品、玻璃碎片、地板图案、符文、复杂建筑、怪物、水中生物、深远风景、过多书本或阻挡发光书页与休息书堆的前景物。
```

Outputs:

- `scratch/style-tests/event-production-20260706/library/02-nanobanana-pro-response.json`
- `scratch/style-tests/event-production-20260706/library/02-nanobanana-pro-clean-original.jpg` - JPEG payload, 2528x1696.
- `scratch/style-tests/event-production-20260706/library/02-nanobanana-pro-clean.png` - true PNG conversion, 2528x1696.
- `scratch/style-tests/event-production-20260706/library/comparison-sheet.png` - GPT source and Nano Banana comparison.
- `src/assets/events/library.png` - gallery/runtime asset, Nano Banana output cropped to 3:2 and normalised to max edge 1024px, 1024x683.

First-read review: accepted for gallery registration. The Nano pass keeps the glowing pages, dry book-bed, drowned shelf, shallow water, and submerged arches. It simplifies the linework, increases the foreground page read, avoids readable page text, avoids creatures, and keeps the background lower contrast than the focal shelf/pages. Minor caveat: the book stack is still slightly busy, but it reads as the intended resting place at event-panel scale.
