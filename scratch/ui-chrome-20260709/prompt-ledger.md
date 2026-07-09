# UI chrome prompt ledger — 2026-07-09

Pipeline: Cursor `GenerateImage` (silhouette-first chrome icons) → border-connected
light-background alpha cutout → `sips`/LANCZOS normalize 512² → `tools/strip-alpha-rim.py`
`--radius 6 --mode darken` → promote to `src/assets/ui/<id>.png`.

Style block (shared):

> Serious cartoon-gothic stained-glass game art: chunky dark outer silhouette,
> simplified exaggerated proportions, one iconic readable prop, 3-5 large
> jewel-tone glass colour masses with thick lead dividers, matte painterly
> texture, warm amber rim light, soft controlled inner glow. Designed to remain
> readable at 128px. Square transparent-friendly icon, ~15% padding. No text,
> no labels, no watermark, no hands, no ground, no contact shadow.

| id | subject prompt (primary request) | source | alpha | promoted |
|---|---|---|---|---|
| candle-lit | short wax candle with bright amber wick flame | `source/candle-lit.png` | `alpha/` + `rim/` | `src/assets/ui/candle-lit.png` |
| candle-spent | same candle snuffed — grey wax, cold wick stub | `source/candle-spent.png` | same | yes |
| facet-empty | intact diamond glass chip, clear panes | `source/facet-empty.png` | same | yes |
| facet-chipped | same chip with lit crack / missing corner | `source/facet-chipped.png` | same | yes |
| hp-vial-frame | ornate stained-glass vial bezel (frame only, hollow centre) | `source/hp-vial-frame.png` | hollow enclosed cleanup | yes |
| heart | compact glass heart emblem for HUD HP | `source/heart.png` | same | yes |
| coin | brass coin with simple embossed mark | `source/coin.png` | same | yes |
| deck | small stacked pair of cards, edge-on readable | `source/deck.png` | same | yes |
| menu | three thick horizontal bars (hamburger), lead-lined | `source/menu.png` | same | yes |
| ward | heraldic shield pane (Ward / block chip) | `source/ward.png` | same | yes |
| end-turn | upward arrow / turn-advance glyph in glass | `source/end-turn.png` | same | yes |
| lantern | hanging lantern body with warm inner glow | `source/lantern.png` | same | yes |
| intent-attack | sword blade silhouette (attack intent) | `source/intent-attack.png` | same | yes |
| intent-block | shield silhouette (block / Ward intent) | `source/intent-block.png` | same | yes |
| intent-buff | upward chevron / rise glyph (buff intent) | `source/intent-buff.png` | same | yes |
| intent-debuff | dark cloud / miasma blot (debuff intent) | `source/intent-debuff.png` | same | yes |
| intent-heal | plus / cross of light (heal intent) | `source/intent-heal.png` | same | yes |
| node-frame | shared circular map medallion frame / bezel (hollow) | `source/node-frame.png` | hollow enclosed cleanup | yes |
| node-monster | combat node glyph — sword or claw mark | `source/node-monster.png` | same | yes |
| node-elite | elite node glyph — crowned / heavier mark | `source/node-elite.png` | same | yes |
| node-event | event node glyph — question / omen swirl | `source/node-event.png` | same | yes |
| node-rest | rest node glyph — campfire / hearth spark | `source/node-rest.png` | same | yes |
| node-shop | shop node glyph — coin or merchant mark | `source/node-shop.png` | same | yes |
| node-treasure | treasure node glyph — chest latch | `source/node-treasure.png` | same | yes |
| node-boss | boss node glyph — skull or heavy crown | `source/node-boss.png` | same | yes |
| node-monument | Vigil monument glyph — standing stone with ember | `source/node-monument.png` | same | yes |
| node-unlit | Unlit Way glyph — dimmed / crossed lantern | `source/node-unlit.png` | same | yes |

Notes:

- GenerateImage returned RGB on near-white backgrounds (no native alpha); alpha
  was produced locally via border-connected flood + enclosed-hole cleanup.
- Nano Banana Pro polish was skipped for this chrome batch (silhouette-first
  HUD glyphs; Cursor GenerateImage sources were sufficient after cutout).
- All 27 ids match `UI_CHROME_IDS` in `src/ui-chrome.js`.
