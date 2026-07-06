# Prop Art Bible

This is the production brief for the four live runtime props in Spirebound.
It should be read alongside `docs/prop-taxonomy.md`, `docs/art-study-bible.md`,
and `docs/style-bible.md` before regenerating or promoting prop artwork.

## Runtime Presentation

Props are loaded from `src/assets/props/<id>.png` through `rasterOr('props',
id, fallbackSvg)`. Missing raster assets fall back to the procedural SVGs.

Live prop ids:

| id | Screen | Runtime use | Current asset size | Production target |
|---|---|---|---:|---:|
| `campfire` | Rest site | Large centre-panel hero image | 512 x 512 | 512 x 512 RGBA |
| `chest` | Treasure | Clickable large centre-panel hero image | 512 x 409 | 512 x 409 RGBA |
| `chest-open` | Treasure | Same hero image after opening | 512 x 409 | 512 x 409 RGBA, matched to `chest` |
| `merchant` | Shop | Small shop-header portrait, about 130 px wide | 512 x 512 | 512 x 512 RGBA |

The current CSS presents raster art as an `img.raster-art` with
`object-fit: contain`. The image is not placed inside a dedicated art frame.
For that reason, generated props should be transparent-edge vignettes rather
than hard rectangular illustrations.

## Background Rule

The props can and should carry story through background detail, but the
background must stay subordinate to the readable prop silhouette.

Use this pattern:

- main subject occupies roughly 65-75% of the image;
- narrative backdrop sits immediately behind the subject as an alcove, halo,
  small stair fragment, cloth stall, wall niche, or lit vignette;
- vignette fades to transparent before the image edge;
- no hard rectangular scene border;
- no text, UI labels, watermark, or signature;
- no busy background at thumbnail size;
- check at 128 px before promotion.

For built-in image generation, generate sources on a perfectly flat `#00ff00`
chroma-key field, then remove the key locally. The narrative backdrop belongs
inside the prop vignette and must not touch the image edges.

## Shared Style

Use the approved readable stained-glass language:

- brightened interior values compared with the first dark prop prototypes;
- heavy black leading and clean pane separation;
- amber/gold warmth for safe reward/rest surfaces;
- restrained violet-blue shadows for risk and shop ambiguity;
- sharp silhouette first, decorative detail second;
- painterly depth is welcome, but avoid realistic full-scene rendering.

## Stories And Production Prompts

### `campfire`

Story: the rest-site fire is not a normal campfire. It is a watchfire rekindled
between broken tower steps, fed by ember shards and the last will of previous
climbers. It should feel safe, temporary, and warm against the tower's cold.

Prompt:

```text
Use case: stylized-concept
Asset type: Spirebound runtime prop, 512 x 512 RGBA after chroma-key removal
Primary request: a readable stained-glass fantasy campfire prop with a small narrative backdrop
Scene/backdrop: a compact vignette of broken black-stone tower steps and a faint ruined wall niche behind the fire, cold blue night haze, backdrop fades before the image edges
Subject: a central amber watchfire built from black stones, ember shards, and a subtle metal ring; the fire is the unmistakable focal silhouette
Style/medium: polished game prop illustration, illuminated stained glass, heavy black lead outlines, painterly depth, clear panes
Composition/framing: centred, three-quarter view, generous padding, subject fills about 70% of the image, readable at 128 px
Lighting/mood: warm amber core light against cool blue-violet shadows; slightly brighter than the previous dark prototypes
Color palette: amber, gold, warm parchment highlights, black lead, muted blue-violet background shadows
Materials/textures: stained glass panes, black stone, ember glow, subtle soot, no realistic smoke plume
Constraints: create on a perfectly flat solid #00ff00 chroma-key background for local background removal; the #00ff00 field must be one uniform colour with no shadows, gradients, texture, reflections, floor plane, or lighting variation; keep the vignette fully separated from the #00ff00 field with crisp edges and transparent-friendly padding; do not use #00ff00 anywhere in the subject; no cast shadow, no contact shadow, no text, no watermark
Avoid: full rectangular scene, dark unreadable silhouette, tiny background details, photorealism, cartoon flames
```

### `chest`

Story: the closed treasure chest is an old tribute coffer left by the tower's
former order. Before opening, it reads as a quiet promise. Thin ward lines imply
that reward in the tower is never completely innocent.

Prompt:

```text
Use case: stylized-concept
Asset type: Spirebound runtime prop, 512 x 409 RGBA after chroma-key removal
Primary request: a closed treasure chest prop with a small narrative alcove backdrop
Scene/backdrop: a shallow cracked chapel alcove behind the chest, a few broken glass tesserae and faint ward lines in the stone, backdrop fades before the image edges
Subject: a low heavy closed stained-glass tribute chest, black lead frame, gold bands, amber light leaking from thin seams, strong simple silhouette
Style/medium: polished game prop illustration, illuminated stained glass, heavy black lead outlines, painterly depth, clear pane geometry
Composition/framing: centred, low three-quarter view, horizontal composition for a 512 x 409 crop, all important content inside the central horizontal band, generous padding, readable at 128 px
Lighting/mood: inviting but restrained; warm amber seam glow with cool blue-violet ambient shadows; slightly brighter than the previous dark prototypes
Color palette: amber, gold, black lead, dark stone, muted blue-violet shadows
Materials/textures: stained glass panes, metal bands, black stone alcove, small etched ward marks
Constraints: create on a perfectly flat solid #00ff00 chroma-key background for local background removal; the #00ff00 field must be one uniform colour with no shadows, gradients, texture, reflections, floor plane, or lighting variation; keep the alcove vignette fully separated from the #00ff00 field with crisp edges and transparent-friendly padding; do not use #00ff00 anywhere in the subject; no cast shadow, no contact shadow, no text, no watermark
Avoid: open lid, piles of coins, full rectangular room, overly ornate boss-tier crown language, dark unreadable body
```

### `chest-open`

Story: when opened, the coffer releases stored tower light rather than a messy
pile of treasure. The player has claimed something sealed for a long time.

Prompt:

```text
Use case: stylized-concept
Asset type: Spirebound runtime prop, 512 x 409 RGBA after chroma-key removal
Primary request: an opened version of the Spirebound treasure chest prop with the same angle and footprint as the closed chest
Scene/backdrop: the same shallow cracked chapel alcove as the closed chest, now illuminated by warm released light, faint wall glyphs visible in the glow, backdrop fades before the image edges
Subject: the same low heavy stained-glass tribute chest, now open; lid raised but still within the same silhouette footprint; amber-white tower light rises from inside with a few simple card-like and relic-like silhouettes suspended in the glow
Style/medium: polished game prop illustration, illuminated stained glass, heavy black lead outlines, painterly depth, clear pane geometry
Composition/framing: centred, low three-quarter view matching the closed chest, horizontal composition for a 512 x 409 crop, no jump in object position versus the closed state, readable at 128 px
Lighting/mood: brighter reward reveal, warm amber-white core glow, cool blue-violet shadows still visible at the edges
Color palette: amber, white-gold, gold trim, black lead, dark stone, muted blue-violet shadows
Materials/textures: stained glass panes, metal bands, black stone alcove, small revealed glyphs
Constraints: create on a perfectly flat solid #00ff00 chroma-key background for local background removal; the #00ff00 field must be one uniform colour with no shadows, gradients, texture, reflections, floor plane, or lighting variation; keep the alcove vignette fully separated from the #00ff00 field with crisp edges and transparent-friendly padding; do not use #00ff00 anywhere in the subject; no cast shadow, no contact shadow, no text, no watermark
Avoid: changing to a different chest design, scattered coin pile, huge explosion, full rectangular room, overexposed white centre
```

### `merchant`

Story: the merchant is a lantern-lit trader who gathers the belongings of failed
climbers and sells them to the next one. He should feel useful, warm, and not
entirely trustworthy.

Prompt:

```text
Use case: stylized-concept
Asset type: Spirebound runtime prop, 512 x 512 RGBA after chroma-key removal
Primary request: a readable shop merchant prop with a small narrative stall backdrop
Scene/backdrop: a compact tower-market recess with a hanging lantern, a dark cloth awning, and two small shelves fading before the image edges
Subject: a hooded stained-glass merchant behind a small stall, clear shop silhouette, one warm lantern beside him, a few simplified bottles, cards, and relic shapes on the counter
Style/medium: polished game prop illustration, illuminated stained glass, heavy black lead outlines, painterly depth, clear pane geometry
Composition/framing: centred, compact portrait composition, must remain readable when displayed about 130 px wide, subject fills about 72% of the image, generous padding
Lighting/mood: warm shop light with subtle violet shadow, welcoming but suspicious; slightly brighter than the previous dark prototypes
Color palette: warm amber lantern, parchment highlights, black lead, muted violet-blue shadows, very small gold accents
Materials/textures: stained glass panes, dark fabric, black wood or stone stall, tiny glass bottles, metal trinkets
Constraints: create on a perfectly flat solid #00ff00 chroma-key background for local background removal; the #00ff00 field must be one uniform colour with no shadows, gradients, texture, reflections, floor plane, or lighting variation; keep the stall vignette fully separated from the #00ff00 field with crisp edges and transparent-friendly padding; do not use #00ff00 anywhere in the subject; no cast shadow, no contact shadow, no text, no watermark
Avoid: full character portrait without stall, crowded bazaar scene, realistic human face, tiny unreadable goods, comedy shopkeeper
```

## Review Gate

Before replacing live assets:

1. Check the alpha corners are transparent.
2. Check `campfire` and `merchant` at 512 x 512.
3. Check `chest` and `chest-open` at 512 x 409 and aligned as a pair.
4. Build a contact sheet at 128 px.
5. Preview in the game gallery and the real rest, treasure, and shop screens.
6. Only promote after the closed/open chest pair does not visibly jump.

Final readable-baseline registration proof is recorded in
`docs/prop-gallery-proof.md`. The expected gallery result is
`props - 4/4 generated` at `?gallery=1&set=readable-baseline`.
