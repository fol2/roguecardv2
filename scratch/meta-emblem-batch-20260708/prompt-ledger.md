# Meta emblem batch prompt ledger - 2026-07-08

Generated for Task 5 (deed, bequest, monument-node emblem rasters). Normative subjects: `docs/meta-art-bible.md`.

## Source workflow

- Generation path: Codex built-in `image_gen` via `tools/imagegen.sh`.
- Source outputs: `scratch/meta-emblem-batch-20260708/source/<id>.png`.
- Alpha outputs: `scratch/meta-emblem-batch-20260708/alpha/<id>.png`.
- Final assets:
  - deeds → `src/assets/deeds/<id>.png`
  - bequests → `src/assets/bequests/<id>.png`
  - monument-node → `src/assets/meta/monument-node.png`

## Shared prompt block

Serious cartoon-gothic stained-glass game art: chunky dark outer silhouette, simplified exaggerated proportions, one iconic readable prop or pose, 3-5 large jewel-tone glass colour masses with very few thick lead dividers, matte painterly texture, warm amber rim light, soft controlled inner glow. Designed to remain readable at 32px and 128px. Square transparent-ready emblem, solid #ff00ff background, no text, no labels, no watermark. Single centred emblem or prop only; generous padding (~15% margin); no hands, no full scene, no ground plane, no contact shadow. Do not use #ff00ff inside the subject.

## Attempts

| id | subject | source | notes |
|---|---|---|---|
| paneBreaker | a shattered facet diamond spilling bright shards | source/paneBreaker.png | ok |
| lanternFed | a lantern mouth accepting a burning card pane as fuel | source/lanternFed.png | ok |
| ashSermon | green-grey Smolder ribbons claiming a fallen glass body | source/ashSermon.png | ok |
| untouched | an uncracked mirror pane with a tight cyan aura | source/untouched.png | ok |
| darkWalker | an unlit lantern silhouette on a black path | source/darkWalker.png | ok |
| spendthrift | embers streaming from an open lantern into a spell burst | source/spendthrift.png | ok |
| hundredShards | a heap of one hundred tiny glass shards, readable as many not counted | source/hundredShards.png | ok |
| firstDawn | a single sunrise wedge over a black spire tip | source/firstDawn.png | ok |
| relic | a carved stone niche holding a glowing relic silhouette | source/relic.png | ok |
| card | a stone tablet bearing one upright card pane | source/card.png | ok |
| gold | a stone cache spilling warm gold coins | source/gold.png | ok |
| monument-node | a small standing stone marker with a single memorial flame, readable at 32px | source/monument-node.png | ok |
