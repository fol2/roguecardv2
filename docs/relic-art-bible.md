# Relic art bible

Raster direction for all `src/assets/relics/*.png`. Workflow: Cursor image generation → `#ff00ff` alpha cutout → `sips -Z 512`. Internal relic **ids** are immutable keys; only display strings change in `data.js`.

## Style block

> Serious cartoon-gothic stained-glass game art: chunky dark outer silhouette, simplified exaggerated proportions, one iconic readable prop or pose, 3–5 large jewel-tone glass colour masses with very few thick lead dividers, matte painterly texture, warm amber rim light, soft controlled inner glow. Designed to remain readable at 128px. No text, no labels, no watermark.

## Composition

- Single centred object only; generous padding (~15% margin)
- 4:5 portrait plate, alpha-ready flat `#ff00ff` background
- No hands, no scene, no ground plane, no contact shadow
- Final size cap: **512px** (`sips -Z 512`)

## Per-relic subject seeds

| id | subject prompt seed |
|---|---|
| emberHeart | a fist-sized heart of banked embers in a glass shell, warm red-orange glow |
| ashenCore | a cracked sphere of compacted grey ash with smoldering amber veins |
| basaltIdol | a squat carved basalt idol figure, stone-grey with faint blue ward glow |
| warFetish | a bundle of bone shards and red cord tied into a small war totem |
| riverPearl | a large luminous teal pearl cradled in a silver wire mount |
| travelersPack | a worn leather traveller's satchel with a bedroll strap and hanging tin cup |
| emberLantern | a small brass storm-lantern with an oversized ember blazing inside |
| vialOfLife | a corked glass vial of luminous green liquid with a leaf suspended inside |
| thornBand | a bracelet of woven black briar with glass thorns |
| sweetRoot | a gnarled pink-tinged root vegetable with a soft healthy glow |
| gravebloom | a pale violet flower blooming from a shard of gravestone |
| silkFan | a folded pale-blue silk hand fan with silver ribs |
| reapersBell | a small tarnished bronze hand-bell with a skull-shaped clapper |
| executionersSeal | a heavy red wax seal stamped with an axe sigil on black ribbon |
| ironTalisman | a rough-forged iron talisman disc on a chain, hammer-marked |
| merchantsMark | a gold merchant's coin-stamp with an embossed purse sigil |
| seersOrb | a crystal scrying orb on a small clawed stand, teal inner mist |
| frozenCore | a fist of blue ice that never melts, frost breathing off it |
| verdantBranch | a living green branch with tiny glass leaves budding |
| sunBlossom | a golden sunflower-like bloom radiating warm light |
| wardingCharm | a hexagonal blue charm tile painted with a shield rune, on a cord |
| duskmirror | a small oval hand-mirror reflecting a twilight sky instead of the room |
| smolderingCoal | a single large coal split with glowing orange fissures |
| thiefOfWicks | a snuffed candle-stub bundle tied with wick-thread, faint smoke |
| prismCharm | a triangular glass prism splitting one lantern beam into a fan of colour |
| bellOfEndings | a tall dark chapel bell with a glowing crack down its face |
| crownOfCinders | a jagged crown of charred wood points, each tipped with a live ember |
| hollowCrown | a regal gold crown with a dark hollow void where the head would be |
| crownOfTithes | a gold crown made of stacked coins and hanging scale-chains |
| shatterersCrown | a crown of broken glass shards catching light on their fracture edges |
| crownOfTheHearth | a warm copper crown shaped like a ring of hearth-flames |

The five `crown*` relics share a family read (crown silhouette first) while differing in material.
