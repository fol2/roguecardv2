# Emberglass Rose Window prompt ledger

## Built-in image generation prompt

```text
Use case: stylized-concept
Asset type: Spirebound meta mural, opaque square full-scene art
Primary request: Create one 1024 x 1024 square stained-glass mural designed to sit behind a six-pane circular rose-window frame. It must read as one continuous scene: six lower narrative symbols converge into a black-and-gold stair rising above the broken crown of the Eternal Sovereign, ending at a sealed obsidian door with one thin white-gold seam. Around the circle include, clockwise from the top, three pale figures carrying a cold shard down a black stair; a standing memorial shadow facing its living self; an empty lantern beneath a false crown; seven readable abstract marks broken by an eighth dark stroke; five pages turning into one stair-map; and a gaunt lamplighter surrendering the last flame.
Style/medium: serious cartoon-gothic dark-fantasy stained glass; chunky dark lead contours; six large readable colour masses; matte painterly glass texture; thumbnail-readable; restrained cathedral geometry, not ornate church decoration.
Palette: black obsidian, smoke violet, cold cyan, dead white, tarnished gold, one restrained ember-orange focal seam.
Composition: central door and stair remain readable through six equal radial pane masks; keep important subjects away from pane boundaries and the central 14 percent boss; no outer frame because a deterministic lead frame will be overlaid.
Constraints: opaque square artwork; no text, letters, numbers, labels, logo, watermark, UI, card frame, people worshipping, modern architecture, open door, landscape beyond the door, or playable Act 4 scene.
```

## Source 01

- Generated ID: `019f493d-568c-7142-b01a-1a90862c8e31/exec-5af40105-9d4a-4ca5-942e-36889dbe81c7.png`
- Local source: `source-01-rejected.png`
- Dimensions and mode: 1254 x 1254, RGB
- Selection: rejected before Nano Banana clean-up
- Review verdict: missing the Eighth Omen's seven marks and eighth breaking stroke; see `rejection-notes.md`.

## Source 02

- Generated ID: `019f493d-568c-7142-b01a-1a90862c8e31/exec-3c5f1885-45ee-4747-8d85-d66550d36007.png`
- Local source: `source-02-rejected.png`
- Dimensions and mode: 1254 x 1254, RGB
- Selection: rejected before normative clean-up
- Review verdict: sealed door consumes the top quest mask and the Eighth Omen is absent; see `rejection-notes.md`.

## Nano Banana composition repair 02

```text
Recompose only the contents of this existing square stained-glass mural so it aligns with six fixed equal radial masks. Clockwise from the top, the six sectors must be exactly: three pale figures carrying one cold shard down a black stair; a standing memorial shadow facing its living self; an empty lantern beneath a false crown; seven simple abstract marks broken by one eighth dark stroke; five pages turning into one stair-map; and a gaunt lamplighter surrendering the last flame. Keep one narrow black-and-gold stair as the continuous central connective motif and keep the sealed obsidian door with one thin white-gold seam above it, but do not let the door replace or create a seventh sector. Keep every quest subject well inside its own sector and outside the central 14 percent boss. Preserve the serious cartoon-gothic stained-glass style, chunky black lead, matte texture, black obsidian, smoke violet, cold cyan, dead white, tarnished gold, and one restrained ember-orange seam. Change no other design intent. No text, letters, numbers, labels, logo, watermark, UI, open door, door landscape, church congregation, modern architecture, or playable Act 4 scene.
```

- Input: `source-02-rejected.png`
- Output: `composition-repair-02.jpg`
- Model: Nano Banana Pro (`gemini-3-pro-image`)
- Output dimensions and encoding: 1024 x 1024, RGB JPEG payload
- SHA-256: `fc0a967bf754f031fbb0e8895d33cebbf2506415e847039142810c83ad098e34`
- Selection: rejected before normative clean-up
- Review verdict: the edit retained the seven-region composition and omitted the Eighth Omen; see `rejection-notes.md`.

## Built-in coordinate-contract generation prompt

```text
Use case: stylized-concept
Asset type: Spirebound meta mural, opaque square full-scene art aligned to deterministic masks
Primary request: Create one square dark-fantasy stained-glass mural with exactly six equal radial wedge-shaped narrative sectors around one small central circular boss. Count exactly six sectors, never seven. Place these six subjects at fixed clock positions: at 12 o'clock, three pale figures carrying one cold shard down a black stair; at 2 o'clock, a standing memorial shadow facing its living self; at 4 o'clock, an empty lantern held beneath a false crown; at 6 o'clock, exactly seven simple pale-gold abstract marks visibly broken by one thick eighth black stroke; at 8 o'clock, five pages turning into one stair-map; at 10 o'clock, a gaunt lamplighter surrendering the last flame. Centre every subject well inside its own sector and keep all subjects away from radial boundaries and the central 14 percent boss.
Continuous motif: a narrow black-and-gold stair connects the six stories through the centre and rises to a small sealed obsidian door with one thin white-gold seam. The door is a central connective motif only: it must not occupy, replace, split, or create a narrative sector. Keep the door visibly closed, with no view beyond it.
Style/medium: serious cartoon-gothic dark-fantasy stained glass; chunky dark lead contours within the illustration; six large readable colour masses; matte painterly glass texture; thumbnail-readable; restrained cathedral geometry.
Palette: black obsidian, smoke violet, cold cyan, dead white, tarnished gold, one restrained ember-orange accent only at the closed door seam.
Composition: full opaque square; exact six-sector radial clock layout; no outer frame because a deterministic lead frame will be overlaid; subjects readable through six equal masks.
Constraints: no seventh sector or pane; no text, letters, numbers, labels, logo, watermark, UI, card frame, people worshipping, modern architecture, open door, landscape beyond the door, or playable Act 4 scene.
```

## Source 03

- Generated ID: `019f493d-568c-7142-b01a-1a90862c8e31/exec-bda50435-8f12-4a74-9f01-36b628627d75.png`
- Local source: `source-03-selected.png`
- Dimensions and mode: 1254 x 1254, RGB
- Selection: selected for the normative Nano Banana clean-up
- Review verdict: passes the six-sector coordinate gate and keeps the sealed door and stair as a central connective motif rather than a seventh pane.

## Normative Nano Banana clean-up 03

```text
帮我将这张图片重绘和清晰化，让它细节更丰富，同时去掉原图中杂乱不必要的细节。重要：这次不做 alpha、chroma-key、cutout 或透明背景控制；请严格保留完整的 1:1 Spirebound Emberglass mural、六个径向叙事区域、中央黑金阶梯和顶部封闭的黑曜石门。加强粗黑 lead contours 和六个大色块，减少碎玻璃、微小装饰和背景噪音，让 160px 仍能读到阶梯与封闭门。背景对比度必须低于六个主体。保留黑曜石、烟紫、冷青、死白、旧金和单一 ember-orange 门缝。不要加入文字、数字、UI、logo、水印、开放的门、门后风景、第七个 pane、教堂人群或可游玩的 Act 4 场景。
```

- Input: `source-03-selected.png`
- Output: `cleaned-candidate-03.jpg`
- Model: Nano Banana Pro (`gemini-3-pro-image`)
- Output dimensions and mode: 1024 x 1024, RGB
- SHA-256: `3698eec5a05f1b98235f9b26961c49e00233357eb62a9566e510478467355ca5`
- Selection: rejected after content count review
- Review verdict: the clean-up materially improved 160 px readability and retained the exact six-sector geometry, but the Omen pane had one extra pale mark.

## Nano Banana count repair 04

```text
Change only the bottom 6 o’clock tarnished-gold Eighth Omen sector. It currently contains eight separate pale-gold shard-shaped abstract marks plus one thick black diagonal stroke. Remove exactly one pale-gold mark so the final sector contains exactly seven separate pale-gold abstract marks, all clearly visible, crossed and broken by exactly one single thick black diagonal stroke which is the eighth mark. Keep the black stroke single and unbranched. Preserve every other pixel and design decision as closely as possible: do not change the other five narrative sectors, their subjects, the six-pane geometry, the central circular boss, the closed obsidian door, the black-and-gold stair, the lead contours, palette, square crop, or background. No text, letters, numbers, labels, logo, watermark, UI, open door, door landscape, church congregation, modern architecture, or playable Act 4 scene.
```

- Input: `cleaned-candidate-03.jpg`
- Output: `cleaned-candidate-04.jpg`
- Model: Nano Banana Pro (`gemini-3-pro-image`)
- Output dimensions and mode: 1024 x 1024, RGB
- SHA-256: `d1c7b7d192b0f8202b44d2a7785b48af7b7cbafa35d7b9ef5ea5b9c4317190fa`
- Selection: rejected after content count review
- Review verdict: retained the clean composition but failed to remove the extra pale mark.

## Built-in precise-object edit 05

```text
Use case: precise-object-edit
Asset type: Spirebound Emberglass mural correction
Primary request: Edit only the bottom 6 o’clock tarnished-gold Eighth Omen pane. Make the symbol exactly seven separate pale-gold abstract shard marks crossed and broken by exactly one single thick black diagonal stroke; the black stroke is the eighth mark. Remove any extra pale-gold shard so there are seven pale marks, not eight. Keep all seven clearly separated and countable.
Constraints: change only the symbol inside the bottom tarnished-gold pane. Preserve the other five panes pixel-for-pixel as closely as possible, including all characters and objects. Preserve exactly six radial panes, the central circular boss, closed obsidian door, black-and-gold stair, lead contours, palette, square crop, and matte stained-glass style. No text, letters, numbers, labels, logo, watermark, UI, extra pane, open door, or landscape beyond the door.
```

- Input: `cleaned-candidate-04.jpg`
- Generated ID: `019f493d-568c-7142-b01a-1a90862c8e31/exec-2eea2d2e-616d-45ef-8337-02fe63f89dff.png`
- Local candidate: `cleaned-candidate-05-selected.png`
- Temporary promotion path: `src/assets/meta/emberglass-mural.png` (superseded)
- Candidate dimensions and mode: 1254 x 1254, RGB
- Promotion dimensions and mode: 1024 x 1024, RGB PNG
- Selection: rejected at the deterministic composite gate
- Review verdict: semantic content passed, but its painted rim, spokes, and oversized boss conflicted with the real frame and masks, clipped subjects, and obscured the door/stair silhouette.

## Built-in frameless geometry edit 06

```text
Use case: precise-object-edit
Asset type: Spirebound Emberglass mural aligned beneath a deterministic overlay
Input images: Image 1 is the mural edit target. Image 2 is the exact transparent frame geometry reference only.
Primary request: Recompose Image 1 so its painted content fits cleanly beneath Image 2's six deterministic masks. Remove every painted outer rim, circular ring, radial spoke, pane border, and central boss outline from Image 1. Do not copy or redraw Image 2's frame lines inside the mural. The mural itself must be frameless full-square stained-glass art; Image 2 will supply all structural lead on top.
Coordinate contract: on the 1024 x 1024 square, keep every important quest subject entirely between radius 90 and radius 350 from centre (512,512), with generous clearance from the six radial boundaries. The centre radius 70 must contain only quiet low-contrast black-violet glass, with no subject, ring, door, or stair. Keep background glass across the full square, but lower contrast outside radius 380 because masks will crop it.
Six fixed sectors clockwise from the top: top sector contains three pale figures carrying one cold shard down a black stair, plus a small visibly closed obsidian door with one thin white-gold seam at the top end of that same stair; upper-right contains a memorial shadow facing its living self; lower-right contains an empty lantern beneath a false crown; bottom contains exactly seven separate pale-gold abstract marks broken by exactly one single thick black stroke as the eighth mark; lower-left contains five pages turning into one stair-map; upper-left contains a gaunt lamplighter surrendering the last flame. Keep each subject compact and centred inside its sector so no head, hand, crown, page, mark, shard, flame, door, or stair is clipped by Image 2's inner circular crop or radial gaps.
Style/medium: retain serious cartoon-gothic dark-fantasy stained glass, matte painterly glass, simplified chunky subject contours, six readable colour masses, thumbnail readability.
Palette: black obsidian, smoke violet, cold cyan, dead white, tarnished gold, one restrained ember-orange accent at the closed door seam.
Constraints: exactly six narrative sectors; no painted frame, rim, spoke, ring, or boss; no seventh pane; no text, letters, numbers, labels, logo, watermark, UI, card frame, worshippers, modern architecture, open door, landscape beyond the door, or playable Act 4 scene.
```

- Inputs: `src/assets/meta/emberglass-mural.png` candidate 05 and `src/assets/meta/emberglass-frame.png`
- Generated ID: `019f493d-568c-7142-b01a-1a90862c8e31/exec-fb91bc40-565f-45b2-b414-59033ce9352e.png`
- Local source: `frameless-source-06.png`
- Source dimensions and mode: 1254 x 1254, RGB PNG
- Source SHA-256: `437ddbf071fb0551f3928ab3456f1df930c8e76645e131fc40b357a3ec5de067`
- Selection: selected for deterministic placement
- Review verdict: removes all competing structural lead while preserving the exact quest content and seven-plus-one Omen symbol.

## Deterministic placement 07

```bash
magick frameless-source-06.png -resize 700x700! -gravity center -background '#070912' -extent 1024x1024 cleaned-candidate-07-selected.png
```

- Input: `frameless-source-06.png`
- Selected candidate: `cleaned-candidate-07-selected.png`
- Promoted path: `src/assets/meta/emberglass-mural.png`
- Dimensions and mode: 1024 x 1024, RGB PNG
- SHA-256: `1b3f2385bf228ec7eeb01d96e0d28ce4dbebaeeeba1c2bf21e6b37a7d924f162`
- Selection: accepted over the 760 px placement because it keeps safer outer and radial clearance
- Review verdict: exact mask/frame composite has one structural lead system, no clipped critical subject, no seventh pane, and a readable closed-door/stair silhouette at 160 px; browser shape review follows.
