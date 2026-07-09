# Meta scene plates batch 2026-07-08

Scene workflow (event-like): full narrative backgrounds, no chroma/alpha cutout.
Normalise max edge 1024px → `src/assets/meta/{fallen,ascended}.png`.

## Style suffix (both)

full narrative scene, no UI text watermark, cinematic stained-glass Spirebound mood

## fallen

- Subject (meta bible): a dark stone monument in a lightless vault, one dying lantern flame, drifting ash embers, cold blue-grey stone, no readable inscription text
- Output: `src/assets/meta/fallen.png`
- Scratch source: `scratch/meta-scene-batch-20260708/source/fallen.png`

### Exact prompt

```text
Spirebound Vigil end-of-run scene plate: a dark stone monument in a lightless vault, one dying lantern flame, drifting ash embers, cold blue-grey stone, no readable inscription text. Full narrative scene, no UI text watermark, cinematic stained-glass Spirebound mood. Wide rectangular background plate, serious cartoon-gothic stained-glass game art, depth and atmosphere, no characters, no figures, no labels, no watermark.
```

## ascended

- Subject (meta bible): the Spire crown at first dawn — warm gold light breaking over black glass pinnacles, rose-window glow, no figures required
- Output: `src/assets/meta/ascended.png`
- Scratch source: `scratch/meta-scene-batch-20260708/source/ascended.png`

### Exact prompt

```text
Spirebound Vigil end-of-run scene plate: the Spire crown at first dawn — warm gold light breaking over black glass pinnacles, rose-window glow, no figures required. Full narrative scene, no UI text watermark, cinematic stained-glass Spirebound mood. Wide rectangular background plate, serious cartoon-gothic stained-glass game art, depth and atmosphere, no characters, no figures, no labels, no watermark.
```

## Results

| id | source size | final size | final path |
|---|---|---|---|
| fallen | 1672×941 | 1024×576 | src/assets/meta/fallen.png |
| ascended | 1693×929 | 1024×562 | src/assets/meta/ascended.png |

- fallen ig: `ig_0576c32c8ad8d0a3016a4ee43c30fc8191b0450d103df000bf.png`
- ascended ig: `ig_09712e2e158d2476016a4ee4aec8048191a3270c9560a972f0.png`
- No chroma/alpha cutout (scene workflow).
- monument-node.png not overwritten.
