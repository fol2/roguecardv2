# Status art bible

Raster direction for `src/assets/statuses/*.png`. Optional: UI prefers raster when present and falls back to `art.js` `st-*` SVG icons.

## Style block

> Serious cartoon-gothic stained-glass game art: chunky dark outer silhouette, simplified exaggerated proportions, one iconic readable prop or pose, 3-5 large jewel-tone glass colour masses with very few thick lead dividers, matte painterly texture, warm amber rim light, soft controlled inner glow. Designed to remain readable at 32px and 128px. No text, no labels, no watermark.

## Composition

- Single centred emblem or prop only; generous padding (~15% margin)
- Square transparent-alpha icon, final size 512x512
- No hands, no full scene, no ground plane, no contact shadow
- Final size cap: **512px** (`sips -Z 512`)
- Squint test: at 32px the silhouette must still read as the status

## Subject Table

| id | display (do not use as filename) | subject |
|---|---|---|
| str | Fervor | a stoked lantern flame rising through cracked amber glass |
| dex | Poise | a blue glass ward crescent braced like a poised stance |
| vulnerable | Cracked | a diamond pane with a bright scored X fault |
| weak | Dimmed | a guttering blue flame bent downward |
| frail | Brittle | a thin wine-glass pane spiderweb-cracked |
| poison | Smolder | a coal ember trailing green-grey smoke ribbons |
| thorns | Splinters | a glass orb bristling with outward crystal spikes |
| ritual | Litany | a crescent moon of leaded glass dripping wax-light |
| metallicize | Vitrified | a hexagonal vitrified plate with cool iron sheen |
| regen | Warmth | a green repair vine knitting a cracked blue pane |
| barricade | Annealed | a fortified glass bastion block, annealed and solid |
| energized | Alight | a lightning-bolt shard of white-gold glass |
| venomous | Emberfang | a hooked glass fang weeping one amber Smolder drop |
| rampage | Crescendo | three rising attack arcs growing larger |
| beacon | Beacon | a sunburst lantern chip casting facet-cutting rays |
| emberflow | Pyreheart | a heart-shaped furnace coal orbiting tiny embers |
| nightsight | Night Sight | a crescent eye-lantern revealing one hidden glint |
