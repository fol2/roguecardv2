# Meta art bible

Raster direction for Vigil end-of-run and meta surfaces:
`src/assets/meta/*.png`, `src/assets/deeds/*.png`, `src/assets/bequests/*.png`.

## Scene plates (`meta/fallen`, `meta/ascended`)

Full narrative backgrounds (not cutouts). Same production spirit as event art:
rectangular scene, background is part of the story, no UI/text/watermark.
Normalise max edge **1024px**. UI displays them dimmed + blurred behind glass panels.

| id | subject |
|---|---|
| fallen | a dark stone monument in a lightless vault, one dying lantern flame, drifting ash embers, cold blue-grey stone, no readable inscription text |
| ascended | the Spire crown at first dawn — warm gold light breaking over black glass pinnacles, rose-window glow, no figures required |

## Emblems (512×512 alpha, ~15% margin — same style block as status/icon bibles)

### Deeds (`deeds/<id>.png`)

| id | subject |
|---|---|
| paneBreaker | a shattered facet diamond spilling bright shards |
| lanternFed | a lantern mouth accepting a burning card pane as fuel |
| ashSermon | green-grey Smolder ribbons claiming a fallen glass body |
| untouched | an uncracked mirror pane with a tight cyan aura |
| darkWalker | an unlit lantern silhouette on a black path |
| spendthrift | embers streaming from an open lantern into a spell burst |
| hundredShards | a heap of one hundred tiny glass shards (readable as many, not counted) |
| firstDawn | a single sunrise wedge over a black spire tip |

### Bequest kinds (`bequests/<id>.png`)

| id | subject |
|---|---|
| relic | a carved stone niche holding a glowing relic silhouette |
| card | a stone tablet bearing one upright card pane |
| gold | a stone cache spilling warm gold coins |

### Map monument (`meta/monument-node.png`)

| id | subject |
|---|---|
| monument-node | a small standing stone marker with a single memorial flame, readable at ~32px |

## Emberglass Rose Window

All eight files are 1024×1024 and share one coordinate system. Pane order is clockwise from the top:

1. paleOnes — three pale figures carrying a cold shard down a black stair
2. ownShade — a standing memorial shadow facing its living self
3. usurper — an empty lantern held beneath a false crown
4. eighthOmen — seven readable marks broken by an eighth dark stroke
5. unreadablePage — five pages turning into one stair-map
6. hollowLamplighter — a gaunt keeper surrendering the last flame

The complete mural is one continuous scene: the six lower symbols converge into a black-and-gold stair above the Eternal Sovereign's crown; at the top is a sealed obsidian door with a thin white-gold seam. No readable text, UI, logo, card frame, modern architecture, church congregation, or playable Act 4 scene.

emberglass-frame is transparent black lead: two circular rims, a small central boss, and six broad equal radial panes. Masks are binary-alpha derivatives of the approved frame geometry, never independently generated. The title medallion is the same composite at small scale. If any file is absent, gameplay uses the labelled fallback.
