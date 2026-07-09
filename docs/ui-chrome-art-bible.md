# UI chrome art bible

Raster direction for `src/assets/ui/*.png`. These icons are optional: UI call
sites prefer raster when present and fall back to procedural SVG (via
`uiFallbackName` → `iconSvg`) or a placeholder when no asset exists.

## Style block

> Serious cartoon-gothic stained-glass game art: chunky dark outer silhouette,
> simplified exaggerated proportions, one iconic readable prop or pose, 3-5
> large jewel-tone glass colour masses with very few thick lead dividers,
> matte painterly texture, warm amber rim light, soft controlled inner glow.
> Designed to remain readable at 128px. No text, no labels, no watermark.

## Composition

- Single centred emblem or prop only; generous padding (~15% margin)
- Square transparent-alpha icon
- **Silhouette-first at 14–24px:** outer contour must read as the subject when
  shrunk to HUD / intent / map-glyph size; avoid fine interior detail that
  collapses into mud
- No hands, no scene, no ground plane, no contact shadow (except map
  `node-frame` which is a medallion bezel, not a scene)
- Suggested source sizes: 128–256 for HUD/intent/facet pips; 256–512 for
  candles / end-turn / lantern; 512 for `hp-vial-frame` and `node-frame`

## Notes

- **`facet-ready`** is optional and **not** in `UI_CHROME_IDS`. Default
  shatter-ready feedback is CSS on `.facet-row.willshatter` / `.pip.willchip`
  only; do not require a third pip PNG.
- **Lantern Art portraits** stay under `src/assets/arts/` (and SVG `art-*`).
  Do not duplicate art portraits into `ui/`; the lantern button’s `.lb-art`
  continues to use `assetUrl('arts', artId)`.

## Subject Table

| category | id | subject |
|---|---|---|
| ui | candle-lit | a short wax candle with a bright amber wick flame |
| ui | candle-spent | the same candle snuffed — grey wax, cold wick stub |
| ui | facet-empty | an intact diamond glass chip, clear panes |
| ui | facet-chipped | the same chip with a lit crack / missing corner |
| ui | hp-vial-frame | ornate stained-glass vial bezel (frame only, hollow centre) |
| ui | heart | a compact glass heart emblem for HUD HP |
| ui | coin | a brass coin with a simple embossed mark |
| ui | deck | a small stacked pair of cards, edge-on readable |
| ui | menu | three thick horizontal bars (hamburger), lead-lined |
| ui | ward | a heraldic shield pane (Ward / block chip) |
| ui | end-turn | an upward arrow / turn-advance glyph in glass |
| ui | lantern | a hanging lantern body with warm inner glow |
| ui | intent-attack | a sword blade silhouette (attack intent) |
| ui | intent-block | a shield silhouette (block / Ward intent) |
| ui | intent-buff | an upward chevron / rise glyph (buff intent) |
| ui | intent-debuff | a dark cloud / miasma blot (debuff intent) |
| ui | intent-heal | a plus / cross of light (heal intent) |
| ui | node-frame | shared circular map medallion frame / bezel |
| ui | node-monster | combat node glyph — sword or claw mark |
| ui | node-elite | elite node glyph — crowned / heavier mark |
| ui | node-event | event node glyph — question / omen swirl |
| ui | node-rest | rest node glyph — campfire / hearth spark |
| ui | node-shop | shop node glyph — coin or merchant mark |
| ui | node-treasure | treasure node glyph — chest latch |
| ui | node-boss | boss node glyph — skull or heavy crown |
| ui | node-monument | Vigil monument glyph — standing stone with ember |
| ui | node-unlit | Unlit Way glyph — dimmed / crossed lantern |
