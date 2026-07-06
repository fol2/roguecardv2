# Design Council Prompt Ledger

Every generated design-council asset in this scratch set should have its prompt
recorded here with the generated image id, source path, and review outcome.

The exact prompts below were recovered from the Codex session log:
`/Users/jamesto/.codex/sessions/2026/07/05/rollout-2026-07-05T18-08-41-019f3340-effe-7803-85d9-fb765deeff39.jsonl`.

## What Worked

The approved enemy prompts stayed close to the original readable baseline:

- short subject description before extra rules
- one iconic primary read
- explicit left-facing enemy pose
- simple body-shape language
- limited palette
- no heavy ban list beyond the baseline noise controls

The failed later prompts drifted because they over-constrained the subject. The
worst drift came from banning humanoid language too hard, then adding long
enemy-vs-hero, frame-discipline, and personality clauses. The model followed
those clauses by changing rendering vocabulary and character trope, while the
approved prompts kept the stained-glass game-token style as the main instruction.

## Next Planning Note: Act 3

Approved small theme direction: **The Cracked Astral Court**.

Act 3 should not become generic void, space, or purple magic. The Obsidian
Spire top reads as a broken royal observatory: judgement eyes, crown shards,
orbit rings, star-fire, black stone, and theatrical end-times ceremony.

Common faction characteristic:

- every Act 3 enemy includes a broken orbit halo fragment
- every Act 3 enemy includes one hot magenta judgement core
- tiny tarnished-gold court accents are allowed, but only sparingly
- the orbit fragment must adapt to the creature and support the silhouette; it
  must not become a tiny stamped badge

Carry forward the successful first-three-enemies prompt structure: funny but
threatening, short subject description, one iconic primary read, explicit
left-facing enemy pose, simple body-shape language, limited palette, and no
heavy ban list beyond baseline noise controls.

Detailed Act 3 direction is recorded in `docs/act3-theme.md`.

## Current Baseline Decision

Status: approved baseline after council review.

Runtime review folder:
`src/assets-readable-baseline/`

Selection rule:

- Duskblade uses the Nano Banana alpha version.
- Ashwarden and all approved enemies use the gpt-image-2 source alpha after
  warm outer-rim cleanup, saved as each scratch folder's
  `04-no-yellow-outline.png`.
- Batch-2 approved additions are Gravewarden v2, Rootheart v2, and Alpha
  Duskfang v3. These were promoted as framed GPT-clean candidates into
  `src/assets-readable-baseline/`.
- Act 2 Batch 1 approved additions are Drowned One v2, Voltaic Eel v2, and
  Mirelurker v2. These were promoted as framed GPT-clean candidates into
  `src/assets-readable-baseline/`.
- Act 2 Batch 2 approved additions are Tidecaller, Shellback, and Deepmaw.
  These were promoted as framed GPT-clean candidates into
  `src/assets-readable-baseline/`.
- Act 2 Finale approved additions are Abyssal Knight v3, Siren v3, and
  Leviathan's Maw v2. These were promoted as framed GPT-clean candidates into
  `src/assets-readable-baseline/`.
- The Act 2 Finale v1 review candidates were rejected as comparison evidence:
  Abyssal Knight v2, Siren, and Leviathan's Maw. They were readable but drifted
  too serious, noble, and high-fantasy compared with the first approved
  enemies.
- The approved Act 2 Finale v2 pass corrected prompt drift by returning to the
  first approved enemy structure: funny but threatening, one iconic primary
  read, compact left-facing pose, limited palette, and fewer hero/enemy ban
  clauses. Elites and bosses may have a little heroic attitude, but their body
  language must remain enemy-like, odd, and funny.
- Runtime gallery registration now only exposes `live` and
  `readable-baseline`. Temporary runtime review folders were removed after
  promotion to avoid duplicate packaged assets.
- Scratch folders keep all source, alpha, Nano Banana, contact-sheet, rejected
  comparison, and prompt evidence.

Earlier temporary runtime review folders `src/assets-readable-baseline-v4/`,
`src/assets-readable-gpt-clean/`, `src/assets-readable-next/`,
`src/assets-readable-next-v2/`, `src/assets-readable-act2/`,
`src/assets-readable-act2-v2/`, `src/assets-readable-act2-finale/`, and
`src/assets-readable-act2-finale-v2/` were removed after promotion or
comparison. Scratch source folders remain as prompt and generation evidence.

## Approved Act 2 Finale Prompt Pattern

The approved finale prompt uses the first-three-enemies structure instead of a
long ban list:

```text
Primary request: <enemy>, a funny but threatening <monster/role> made of <3-5 palette materials>. Menacing idle pose, facing slightly left toward the hero. One iconic primary read: <single large silhouette hook>, <small expressive face/core>, <one or two funny threat props>. It should feel like <comic enemy personality>, funny in proportion but still an elite/boss enemy.
Readability priority: silhouette first, pose second, <main read> third, colour fourth, texture last. The subject must still be recognisable as a black shadow with all internal details removed.
Style/medium: serious cartoon-gothic stained-glass game art; chunky black silhouette; simplified exaggerated proportions; one iconic primary shape; 3-5 large stained-glass colour masses only; very few thick lead dividers; matte painterly texture; restrained broad cathedral motifs; thumbnail-readable at 128px; funny, dramatic, grave, and dangerous through bold proportions and expression.
Composition/framing: <normal/elite/boss> enemy full body, fully inside frame, facing slightly left, generous padding, no cropped silhouette hooks, no action blur.
Lighting/mood: sober gothic mood; single warm amber rim light defining the silhouette without forming a yellow outline; soft restrained inner glow limited to 1-2 focal panes; high value contrast on the main read.
Scene/backdrop: perfectly flat solid #ff00ff chroma-key background only.
Constraints: no ground plane; no floor; no shadows; no reflections; no haze touching the silhouette; no text; no labels; no watermark; no yellow outer outline; do not use #ff00ff in the subject.
```

## Act 3 Batch 1 v1 Review Contact Sheet

Status: superseded by the v2 colour-lift pass for current gallery review. These
v1 candidates remain as comparison evidence.

Contact sheet:
`act3-batch1-gpt-review-contact.png`

Act 3 note: these prompts use a flat `#00ff00` chroma-key backdrop, not
`#ff00ff`, because the shared Act 3 motif requires a hot magenta judgement
core.

## Act 3 Batch 1 v1: Void Wisp

Status: superseded by the v2 colour-lift pass. Kept in scratch as comparison
evidence.

Generated image id:
`ig_09e410fb6d91828d016a4adc44a218819183af98de7d304395`

Source:
`enemy-voidWisp/01-gpt-image-2-source.png`

Original source alpha:
`enemy-voidWisp/01-gpt-image-2-source-alpha.png`

Rim-cleaned alpha:
`enemy-voidWisp/04-no-yellow-outline.png`

Exact prompt:

```text
Use case: stylized-concept
Asset type: Spirebound Act 3 normal enemy alpha-ready source
Primary request: Void Wisp, a funny but threatening tiny runaway court candle star-flame ghost made of obsidian black lead, bruised violet glass, cold blue-white star panes, and one hot magenta judgement core. Menacing idle pose, facing slightly left toward the hero. One iconic primary read: small teardrop flame silhouette, cracked broken orbit halo used as a crooked little candlestick cage, tiny suspicious face floating above the magenta belly core. It should feel like a nervous royal observatory candle that escaped court duty, funny in proportion but still a dangerous Act 3 enemy.
Act 3 faction read: include one broken orbit halo fragment and one hot magenta judgement core, adapted to this creature's silhouette; add only tiny tarnished-gold court accents.
Readability priority: silhouette first, pose second, flame-candle silhouette third, colour fourth, texture last. The subject must still be recognisable as a black shadow with all internal details removed.
Style/medium: serious cartoon-gothic stained-glass game art; chunky black silhouette; simplified exaggerated proportions; one iconic primary shape; 3-5 large stained-glass colour masses only; very few thick lead dividers; matte painterly texture; restrained broad cathedral/court motifs; thumbnail-readable at 128px; funny, dramatic, grave, and dangerous through bold proportions and expression.
Composition/framing: normal enemy full body, fully inside frame, facing slightly left, generous padding, no cropped silhouette hooks, no action blur.
Lighting/mood: sober astral-court gothic mood; single warm amber rim light defining the silhouette without forming a yellow outline; soft restrained inner glow limited to the hot magenta judgement core and one blue-white star pane; high value contrast on the main read.
Scene/backdrop: perfectly flat solid #00ff00 chroma-key background only.
Constraints: no ground plane; no floor; no shadows; no reflections; no haze touching the silhouette; no text; no labels; no watermark; no yellow outer outline; do not use #00ff00 in the subject.
```

Review note: strongest cute/readable result in this batch. The orbit motif is
large enough to read, but the result is slightly more noble than the target
"runaway candle" personality.

## Act 3 Batch 1 v1: Obsidian Golem

Status: superseded by the v2 colour-lift pass. Kept in scratch as comparison
evidence.

Generated image id:
`ig_09e410fb6d91828d016a4adc72d4888191910448994b9e9850`

Source:
`enemy-obsidianGolem/01-gpt-image-2-source.png`

Original source alpha:
`enemy-obsidianGolem/01-gpt-image-2-source-alpha.png`

Rim-cleaned alpha:
`enemy-obsidianGolem/04-no-yellow-outline.png`

Exact prompt:

```text
Use case: stylized-concept
Asset type: Spirebound Act 3 normal enemy alpha-ready source
Primary request: Obsidian Golem, a funny but threatening squat palace brick monster made of obsidian black lead, bruised violet glass, cold blue-white star panes, and one hot magenta judgement core. Menacing idle pose, facing slightly left toward the hero. One iconic primary read: heavy square block body with tiny stubborn legs, one cracked star-core in the chest, a broken orbit ring wedged through one shoulder like a ruined arch it forgot to remove. It should feel like an overworked royal observatory doorstop trying to be scary, funny in proportion but still a dangerous Act 3 enemy.
Act 3 faction read: include one broken orbit halo fragment and one hot magenta judgement core, adapted to this creature's silhouette; add only tiny tarnished-gold court accents.
Readability priority: silhouette first, pose second, squat block body third, colour fourth, texture last. The subject must still be recognisable as a black shadow with all internal details removed.
Style/medium: serious cartoon-gothic stained-glass game art; chunky black silhouette; simplified exaggerated proportions; one iconic primary shape; 3-5 large stained-glass colour masses only; very few thick lead dividers; matte painterly texture; restrained broad cathedral/court motifs; thumbnail-readable at 128px; funny, dramatic, grave, and dangerous through bold proportions and expression.
Composition/framing: normal enemy full body, fully inside frame, facing slightly left, generous padding, no cropped silhouette hooks, no action blur.
Lighting/mood: sober astral-court gothic mood; single warm amber rim light defining the silhouette without forming a yellow outline; soft restrained inner glow limited to the hot magenta judgement core and one blue-white star pane; high value contrast on the main read.
Scene/backdrop: perfectly flat solid #00ff00 chroma-key background only.
Constraints: no ground plane; no floor; no shadows; no reflections; no haze touching the silhouette; no text; no labels; no watermark; no yellow outer outline; do not use #00ff00 in the subject.
```

Review note: strongest silhouette and physical threat in this batch. It kept the
tiny legs and orbit-arch hook, but the final pose is more front-facing and more
architectural than the prompt target.

## Act 3 Batch 1 v1: Star Cultist

Status: superseded by the v2 colour-lift pass. Kept in scratch as comparison
evidence.

Generated image id:
`ig_09e410fb6d91828d016a4adc9afdec8191a711a43e831618cc`

Source:
`enemy-starCultist/01-gpt-image-2-source.png`

Original source alpha:
`enemy-starCultist/01-gpt-image-2-source-alpha.png`

Rim-cleaned alpha:
`enemy-starCultist/04-no-yellow-outline.png`

Exact prompt:

```text
Use case: stylized-concept
Asset type: Spirebound Act 3 normal enemy alpha-ready source
Primary request: Star Cultist, a funny but threatening ridiculous little astrologer enemy made of obsidian black lead, bruised violet glass, cold blue-white star panes, and one hot magenta judgement core. Menacing idle pose, facing slightly left toward the hero. One iconic primary read: tiny hunched robed body almost hidden behind an oversized cracked orbit star-chart disc, anxious glowing eyes, and a too-large pointer staff clutched like a nervous court clerk. It should feel like a panicked royal observatory accountant who accidentally summoned judgement, funny in proportion but still a dangerous Act 3 enemy.
Act 3 faction read: include one broken orbit halo fragment and one hot magenta judgement core, adapted to this creature's silhouette; add only tiny tarnished-gold court accents.
Readability priority: silhouette first, pose second, oversized orbit-chart disc third, colour fourth, texture last. The subject must still be recognisable as a black shadow with all internal details removed.
Style/medium: serious cartoon-gothic stained-glass game art; chunky black silhouette; simplified exaggerated proportions; one iconic primary shape; 3-5 large stained-glass colour masses only; very few thick lead dividers; matte painterly texture; restrained broad cathedral/court motifs; thumbnail-readable at 128px; funny, dramatic, grave, and dangerous through bold proportions and expression.
Composition/framing: normal enemy full body, fully inside frame, facing slightly left, generous padding, no cropped silhouette hooks, no action blur.
Lighting/mood: sober astral-court gothic mood; single warm amber rim light defining the silhouette without forming a yellow outline; soft restrained inner glow limited to the hot magenta judgement core and one blue-white star pane; high value contrast on the main read.
Scene/backdrop: perfectly flat solid #00ff00 chroma-key background only.
Constraints: no ground plane; no floor; no shadows; no reflections; no haze touching the silhouette; no text; no labels; no watermark; no yellow outer outline; do not use #00ff00 in the subject.
```

Review note: clearest Act 3 faction read because the orbit-chart disc dominates
the silhouette. It may still be slightly elegant compared with the first
approved enemy personality, so a v2 should push the nervous clerk comedy if
council rejects this direction.

## Act 3 Batch 1 v2 Colour-Lift Review Contact Sheet

Status: approved by council. Current gallery candidates are parked at
`src/assets-readable-baseline/enemies/voidWisp.png`,
`src/assets-readable-baseline/enemies/obsidianGolem.png`, and
`src/assets-readable-baseline/enemies/starCultist.png`.

Contact sheet:
`act3-batch1-v2-colour-lift-review-contact.png`

Decision note: council feedback on v1 was that the designs were good, but too
dark for the game's dark backgrounds. The v2 prompts therefore preserve the
same silhouettes and personalities while asking for sharper glass colour masses.
Council approved the v2 colour-lift results. After alpha and rim cleanup, the
selected review outputs received a light colour pass:

```text
magick <04-no-yellow-outline.png> -colorspace sRGB -modulate 116,118,100 -gamma 0.93 <05-colour-lift.png>
```

This lifts midtones and saturation while leaving the black leadline structure
mostly intact.

## Act 3 Batch 1 v2: Void Wisp Colour-Lift

Status: approved. Parked at
`src/assets-readable-baseline/enemies/voidWisp.png`.

Generated image id:
`ig_09f79c52a5fdfbfb016a4ade782e8c8191a3bf20a227897839`

Source:
`enemy-voidWisp-v2/01-gpt-image-2-source.png`

Original source alpha:
`enemy-voidWisp-v2/01-gpt-image-2-source-alpha.png`

Rim-cleaned alpha:
`enemy-voidWisp-v2/04-no-yellow-outline.png`

Colour-lift alpha:
`enemy-voidWisp-v2/05-colour-lift.png`

Exact prompt:

```text
Use case: stylized-concept
Asset type: Spirebound Act 3 normal enemy alpha-ready source, v2 brighter colour pass
Primary request: Void Wisp v2, a funny but threatening tiny runaway court candle star-flame ghost made for a dark game background. Menacing idle pose, facing slightly left toward the hero. One iconic primary read: small teardrop candle-flame silhouette, cracked broken orbit halo used as a crooked candlestick cage, tiny suspicious face above a hot magenta belly judgement core. It should feel like a nervous royal observatory candle that escaped court duty, funny in proportion but still dangerous.
Colour/readability correction: the previous pass was too dark. Use sharper brighter stained-glass colours that read against a near-black combat background: electric violet, saturated sapphire blue, cold cyan-white star glass, and hot magenta. Keep obsidian black only for chunky outer silhouette and thick lead dividers, not as large unlit body panels. Large visible colour masses should dominate the subject. Avoid dull smoky navy, low-contrast charcoal slabs, and all-over black fill.
Act 3 faction read: include one broken orbit halo fragment and one hot magenta judgement core, adapted to this creature's silhouette; add only tiny tarnished-gold court accents.
Readability priority: silhouette first, pose second, bright flame-candle colour masses third, colour fourth, texture last. The subject must still be recognisable as a black shadow with all internal details removed.
Style/medium: serious cartoon-gothic stained-glass game art; chunky black silhouette; simplified exaggerated proportions; one iconic primary shape; 3-5 large bright stained-glass colour masses only; very few thick lead dividers; matte painterly texture; restrained broad cathedral/court motifs; thumbnail-readable at 128px; funny, dramatic, grave, and dangerous through bold proportions and expression.
Composition/framing: normal enemy full body, fully inside frame, facing slightly left, generous padding, no cropped silhouette hooks, no action blur.
Lighting/mood: sober astral-court gothic mood with strong internal glass brightness; single warm amber rim light defining the silhouette without forming a yellow outline; soft restrained inner glow limited to the hot magenta judgement core and one cyan-white star pane; high value contrast on the main read.
Scene/backdrop: perfectly flat solid #00ff00 chroma-key background only.
Constraints: no ground plane; no floor; no shadows; no reflections; no haze touching the silhouette; no text; no labels; no watermark; no yellow outer outline; do not use #00ff00 in the subject.
```

## Act 3 Batch 1 v2: Obsidian Golem Colour-Lift

Status: approved. Parked at
`src/assets-readable-baseline/enemies/obsidianGolem.png`.

Generated image id:
`ig_09f79c52a5fdfbfb016a4adeb53aa08191a6f690937fc4c905`

Source:
`enemy-obsidianGolem-v2/01-gpt-image-2-source.png`

Original source alpha:
`enemy-obsidianGolem-v2/01-gpt-image-2-source-alpha.png`

Rim-cleaned alpha:
`enemy-obsidianGolem-v2/04-no-yellow-outline.png`

Colour-lift alpha:
`enemy-obsidianGolem-v2/05-colour-lift.png`

Exact prompt:

```text
Use case: stylized-concept
Asset type: Spirebound Act 3 normal enemy alpha-ready source, v2 brighter colour pass
Primary request: Obsidian Golem v2, a funny but threatening squat palace brick monster made for a dark game background. Menacing idle pose, facing slightly left toward the hero. One iconic primary read: heavy square block body with tiny stubborn legs, a hot magenta cracked star-core in the chest, and a broken orbit ring wedged through one shoulder like a ruined arch it forgot to remove. It should feel like an overworked royal observatory doorstop trying to be scary, funny in proportion but still dangerous.
Colour/readability correction: the previous pass was too dark on a dark UI background. Use sharper brighter stained-glass colours: saturated amethyst violet, electric sapphire blue, cold cyan-white star panes, and hot magenta core. Keep obsidian black only for chunky outer silhouette, stone cracks, and thick lead dividers. Break up the body with broad bright glass panes instead of large black stone slabs. The golem must still read as obsidian, but not disappear against a near-black combat background.
Act 3 faction read: include one broken orbit halo fragment and one hot magenta judgement core, adapted to this creature's silhouette; add only tiny tarnished-gold court accents.
Readability priority: silhouette first, pose second, bright squat block body third, colour fourth, texture last. The subject must still be recognisable as a black shadow with all internal details removed.
Style/medium: serious cartoon-gothic stained-glass game art; chunky black silhouette; simplified exaggerated proportions; one iconic primary shape; 3-5 large bright stained-glass colour masses only; very few thick lead dividers; matte painterly texture; restrained broad cathedral/court motifs; thumbnail-readable at 128px; funny, dramatic, grave, and dangerous through bold proportions and expression.
Composition/framing: normal enemy full body, fully inside frame, facing slightly left, generous padding, no cropped silhouette hooks, no action blur.
Lighting/mood: sober astral-court gothic mood with strong internal glass brightness; single warm amber rim light defining the silhouette without forming a yellow outline; soft restrained inner glow limited to the hot magenta judgement core and one cyan-white star pane; high value contrast on the main read.
Scene/backdrop: perfectly flat solid #00ff00 chroma-key background only.
Constraints: no ground plane; no floor; no shadows; no reflections; no haze touching the silhouette; no text; no labels; no watermark; no yellow outer outline; do not use #00ff00 in the subject.
```

## Act 3 Batch 1 v2: Star Cultist Colour-Lift

Status: approved. Parked at
`src/assets-readable-baseline/enemies/starCultist.png`.

Generated image id:
`ig_09f79c52a5fdfbfb016a4adf079c1c8191b39f7c21e288a836`

Source:
`enemy-starCultist-v2/01-gpt-image-2-source.png`

Original source alpha:
`enemy-starCultist-v2/01-gpt-image-2-source-alpha.png`

Rim-cleaned alpha:
`enemy-starCultist-v2/04-no-yellow-outline.png`

Colour-lift alpha:
`enemy-starCultist-v2/05-colour-lift.png`

Exact prompt:

```text
Use case: stylized-concept
Asset type: Spirebound Act 3 normal enemy alpha-ready source, v2 brighter colour pass
Primary request: Star Cultist v2, a funny but threatening ridiculous little astrologer enemy made for a dark game background. Menacing idle pose, facing slightly left toward the hero. One iconic primary read: tiny hunched robed body almost hidden behind an oversized cracked orbit star-chart disc, anxious glowing eyes, a hot magenta judgement core on the chart, and a too-large pointer staff clutched like a nervous court clerk. It should feel like a panicked royal observatory accountant who accidentally summoned judgement, funny in proportion but still dangerous.
Colour/readability correction: the previous pass was too dark and too elegant on a dark UI background. Use sharper brighter stained-glass colours: electric violet robe panes, saturated sapphire blue orbit chart, cold cyan-white star centre, and hot magenta judgement core. Keep obsidian black only for chunky outer silhouette and thick lead dividers. Avoid a mostly black cloak; make the large chart and robe read as bright colour blocks from far away.
Act 3 faction read: include one broken orbit halo fragment and one hot magenta judgement core, adapted to this creature's silhouette; add only tiny tarnished-gold court accents.
Readability priority: silhouette first, pose second, oversized bright orbit-chart disc third, colour fourth, texture last. The subject must still be recognisable as a black shadow with all internal details removed.
Style/medium: serious cartoon-gothic stained-glass game art; chunky black silhouette; simplified exaggerated proportions; one iconic primary shape; 3-5 large bright stained-glass colour masses only; very few thick lead dividers; matte painterly texture; restrained broad cathedral/court motifs; thumbnail-readable at 128px; funny, dramatic, grave, and dangerous through bold proportions and expression.
Composition/framing: normal enemy full body, fully inside frame, facing slightly left, generous padding, no cropped silhouette hooks, no action blur.
Lighting/mood: sober astral-court gothic mood with strong internal glass brightness; single warm amber rim light defining the silhouette without forming a yellow outline; soft restrained inner glow limited to the hot magenta judgement core and one cyan-white star pane; high value contrast on the main read.
Scene/backdrop: perfectly flat solid #00ff00 chroma-key background only.
Constraints: no ground plane; no floor; no shadows; no reflections; no haze touching the silhouette; no text; no labels; no watermark; no yellow outer outline; do not use #00ff00 in the subject.
```

## Act 3 Batch 2 v1 Colour-Lift Review Contact Sheet

Status: approved by council. Current gallery candidates are parked at
`src/assets-readable-baseline/enemies/shade.png`,
`src/assets-readable-baseline/enemies/chaosHound.png`, and
`src/assets-readable-baseline/enemies/watcherEye.png`.

Contact sheet:
`act3-batch2-v1-colour-lift-review-contact.png`

Decision note: this batch follows the approved Act 3 first-batch colour
correction directly: sharp bright glass masses for dark backgrounds, `#00ff00`
chroma key, gpt-image-2 source alpha, warm outer-rim cleanup, and the light
colour-lift pass. Council approved all three v1 colour-lift candidates:

```text
magick <04-no-yellow-outline.png> -colorspace sRGB -modulate 116,118,100 -gamma 0.93 <05-colour-lift.png>
```

## Act 3 Batch 2 v1: Shade Colour-Lift

Status: approved. Parked at
`src/assets-readable-baseline/enemies/shade.png`.

Generated image id:
`ig_05ce97b0282906b7016a4ae1ed08bc8191937e77787d4d8f20`

Source:
`enemy-shade/01-gpt-image-2-source.png`

Original source alpha:
`enemy-shade/01-gpt-image-2-source-alpha.png`

Rim-cleaned alpha:
`enemy-shade/04-no-yellow-outline.png`

Colour-lift alpha:
`enemy-shade/05-colour-lift.png`

Exact prompt:

```text
Use case: stylized-concept
Asset type: Spirebound Act 3 normal enemy alpha-ready source, approved dark-background colour baseline
Primary request: Shade, a funny but threatening tattered astral-court cloak enemy made for a dark game background. Menacing idle pose, facing slightly left toward the hero. One iconic primary read: an almost-empty ragged cloak shaped like a sneaky falling curtain, a huge broken crescent orbit clasp pinning the hood, tiny suspicious magenta eyes floating in the empty face void, and two absurdly small claw hands peeking out like it is trying too hard to look scary. It should feel like a cowardly royal-court shadow pretending to be an executioner, funny in proportion but still dangerous.
Colour/readability baseline: use sharp bright stained-glass colours that read against a near-black combat background: electric violet cloak panes, saturated sapphire blue folds, cold cyan-white moon-glass highlights, and hot magenta face/core glow. Keep obsidian black only for chunky outer silhouette and thick lead dividers, not as large unlit body panels. Large visible colour masses should dominate the subject. Avoid dull smoky navy, low-contrast charcoal slabs, and all-over black fill.
Act 3 faction read: include one broken orbit halo fragment and one hot magenta judgement core, adapted to this creature's silhouette; add only tiny tarnished-gold court accents.
Readability priority: silhouette first, pose second, ragged cloak plus crescent clasp third, colour fourth, texture last. The subject must still be recognisable as a black shadow with all internal details removed.
Style/medium: serious cartoon-gothic stained-glass game art; chunky black silhouette; simplified exaggerated proportions; one iconic primary shape; 3-5 large bright stained-glass colour masses only; very few thick lead dividers; matte painterly texture; restrained broad cathedral/court motifs; thumbnail-readable at 128px; funny, dramatic, grave, and dangerous through bold proportions and expression.
Composition/framing: normal enemy full body, fully inside frame, facing slightly left, generous padding, no cropped silhouette hooks, no action blur.
Lighting/mood: sober astral-court gothic mood with strong internal glass brightness; single warm amber rim light defining the silhouette without forming a yellow outline; soft restrained inner glow limited to the hot magenta face/core and one cyan-white crescent pane; high value contrast on the main read.
Scene/backdrop: perfectly flat solid #00ff00 chroma-key background only.
Constraints: no ground plane; no floor; no shadows; no reflections; no haze touching the silhouette; no text; no labels; no watermark; no yellow outer outline; do not use #00ff00 in the subject.
```

Review note: clear cloak/crescent silhouette and strong dark-background colour.
It is the most humanoid of the batch, but reads as an empty cloak enemy rather
than a hero.

## Act 3 Batch 2 v1: Chaos Hound Colour-Lift

Status: approved. Parked at
`src/assets-readable-baseline/enemies/chaosHound.png`.

Generated image id:
`ig_05ce97b0282906b7016a4ae22fbe1c81918d89834e6b18eaef`

Source:
`enemy-chaosHound/01-gpt-image-2-source.png`

Original source alpha:
`enemy-chaosHound/01-gpt-image-2-source-alpha.png`

Rim-cleaned alpha:
`enemy-chaosHound/04-no-yellow-outline.png`

Colour-lift alpha:
`enemy-chaosHound/05-colour-lift.png`

Exact prompt:

```text
Use case: stylized-concept
Asset type: Spirebound Act 3 normal enemy alpha-ready source, approved dark-background colour baseline
Primary request: Chaos Hound, a funny but threatening broken comet dog made for a dark game background. Menacing idle pose, facing slightly left toward the hero. One iconic primary read: squat feral dog body with an oversized comet-head, tiny mad magenta eyes, jagged broken orbit collar like a cracked royal cone, a hot magenta chest spark, and a crooked star-fire tail that looks too big for its little legs. It should feel like a spoiled astral court guard dog that ate a falling star, funny in proportion but still dangerous.
Colour/readability baseline: use sharp bright stained-glass colours that read against a near-black combat background: electric violet flank panes, saturated sapphire blue legs and tail, cold cyan-white comet shards, and hot magenta chest/eyes. Keep obsidian black only for chunky outer silhouette, claws, and thick lead dividers, not as large unlit body panels. Large visible colour masses should dominate the subject. Avoid dull smoky navy, low-contrast charcoal slabs, and all-over black fill.
Act 3 faction read: include one broken orbit halo fragment as a jagged collar and one hot magenta judgement core in the chest, adapted to this creature's silhouette; add only tiny tarnished-gold court accents.
Readability priority: silhouette first, pose second, comet dog body plus orbit collar third, colour fourth, texture last. The subject must still be recognisable as a black shadow with all internal details removed.
Style/medium: serious cartoon-gothic stained-glass game art; chunky black silhouette; simplified exaggerated proportions; one iconic primary shape; 3-5 large bright stained-glass colour masses only; very few thick lead dividers; matte painterly texture; restrained broad cathedral/court motifs; thumbnail-readable at 128px; funny, dramatic, grave, and dangerous through bold proportions and expression.
Composition/framing: normal enemy full body, fully inside frame, facing slightly left, generous padding, no cropped silhouette hooks, no action blur.
Lighting/mood: sober astral-court gothic mood with strong internal glass brightness; single warm amber rim light defining the silhouette without forming a yellow outline; soft restrained inner glow limited to the hot magenta chest core and one cyan-white comet shard; high value contrast on the main read.
Scene/backdrop: perfectly flat solid #00ff00 chroma-key background only.
Constraints: no ground plane; no floor; no shadows; no reflections; no haze touching the silhouette; no text; no labels; no watermark; no yellow outer outline; do not use #00ff00 in the subject.
```

Review note: strongest enemy-body read in this batch. The orbit collar, comet
head, tail, and magenta chest core all remain legible on the dark review sheet.

## Act 3 Batch 2 v1: Watcher Eye Colour-Lift

Status: approved. Parked at
`src/assets-readable-baseline/enemies/watcherEye.png`.

Generated image id:
`ig_05ce97b0282906b7016a4ae27d7d988191b4fd44dfae02178c`

Source:
`enemy-watcherEye/01-gpt-image-2-source.png`

Original source alpha:
`enemy-watcherEye/01-gpt-image-2-source-alpha.png`

Rim-cleaned alpha:
`enemy-watcherEye/04-no-yellow-outline.png`

Colour-lift alpha:
`enemy-watcherEye/05-colour-lift.png`

Exact prompt:

```text
Use case: stylized-concept
Asset type: Spirebound Act 3 normal enemy alpha-ready source, approved dark-background colour baseline
Primary request: Watcher Eye, a funny but threatening pompous floating judgement eye made for a dark game background. Menacing idle pose, facing slightly left toward the hero. One iconic primary read: one huge annoyed eyeball inside a broken orbit ring eyelid-frame, a hot magenta judgement pupil/core, tiny over-official court tassels and miniature pointing hands that make it look like a bossy clerk, not a noble boss. It should feel like an irritated royal observatory inspector stamping everyone guilty, funny in proportion but still dangerous.
Colour/readability baseline: use sharp bright stained-glass colours that read against a near-black combat background: electric violet eyelid panes, saturated sapphire blue orbit frame, cold cyan-white sclera/star glass, and hot magenta pupil/core. Keep obsidian black only for chunky outer silhouette and thick lead dividers, not as large unlit body panels. Large visible colour masses should dominate the subject. Avoid dull smoky navy, low-contrast charcoal slabs, and all-over black fill.
Act 3 faction read: include one broken orbit halo fragment as the giant eyelid frame and one hot magenta judgement core as the pupil, adapted to this creature's silhouette; add only tiny tarnished-gold court accents.
Readability priority: silhouette first, pose second, giant eye plus broken orbit frame third, colour fourth, texture last. The subject must still be recognisable as a black shadow with all internal details removed.
Style/medium: serious cartoon-gothic stained-glass game art; chunky black silhouette; simplified exaggerated proportions; one iconic primary shape; 3-5 large bright stained-glass colour masses only; very few thick lead dividers; matte painterly texture; restrained broad cathedral/court motifs; thumbnail-readable at 128px; funny, dramatic, grave, and dangerous through bold proportions and expression.
Composition/framing: normal enemy full body floating subject, fully inside frame, facing slightly left, generous padding, no cropped silhouette hooks, no action blur.
Lighting/mood: sober astral-court gothic mood with strong internal glass brightness; single warm amber rim light defining the silhouette without forming a yellow outline; soft restrained inner glow limited to the hot magenta pupil/core and one cyan-white eye pane; high value contrast on the main read.
Scene/backdrop: perfectly flat solid #00ff00 chroma-key background only.
Constraints: no ground plane; no floor; no shadows; no reflections; no haze touching the silhouette; no text; no labels; no watermark; no yellow outer outline; do not use #00ff00 in the subject.
```

Review note: strongest faction-read in this batch through the giant eye and
broken orbit frame. It is ornate, but the single-eye silhouette remains clear.

## Act 3 Finale v1 Colour-Lift Review Contact Sheet

Status: superseded by the approved Act 3 finale v2 clean pass. These v1
candidates remain in scratch as comparison evidence because the council
considered the character ideas good, but the pictures were not clean enough:
too many micro-panes, jewellery details, halo fragments, and dangling
ornaments.

Contact sheet:
`act3-finale-v1-colour-lift-review-contact.png`

Decision note: this is the final Act 3 asset batch: two elites and the final
boss. The prompts keep the approved Act 3 dark-background colour baseline but
increase role weight: elites are larger than normal enemies, and Sovereign is
the largest final boss while still fully inside frame. The shared post-process
is the same as previous approved Act 3 batches:

```text
magick <04-no-yellow-outline.png> -colorspace sRGB -modulate 116,118,100 -gamma 0.93 <05-colour-lift.png>
```

`sovereign.png` also received an extra transparent framing pass:

```text
magick src/assets-readable-baseline/enemies/sovereign.png -background none -gravity center -extent 780x1024 enemy-sovereign/06-colour-lift-framed.png
```

## Act 3 Finale v1: Voidforged Colossus Colour-Lift

Status: superseded by the v2 clean pass. Previously parked at
`src/assets-readable-baseline/enemies/voidColossus.png`; current approved gallery
uses `enemy-voidColossus-v2/05-colour-lift.png`.

Generated image id:
`ig_03077bd474b2c3f4016a4ae666c9448191889229d294668438`

Source:
`enemy-voidColossus/01-gpt-image-2-source.png`

Original source alpha:
`enemy-voidColossus/01-gpt-image-2-source-alpha.png`

Rim-cleaned alpha:
`enemy-voidColossus/04-no-yellow-outline.png`

Colour-lift alpha:
`enemy-voidColossus/05-colour-lift.png`

Exact prompt:

```text
Use case: stylized-concept
Asset type: Spirebound Act 3 elite enemy alpha-ready source, approved dark-background colour baseline
Primary request: Voidforged Colossus, a funny but threatening Act 3 elite: an oversized royal statue court-pillar that is too heavy to move properly, made for a dark game background. Menacing idle pose, facing slightly left toward the hero. One iconic primary read: a huge squat cracked pillar body with tiny stubborn feet, a massive hot magenta cracked orbit seal in the chest, one broken orbit halo slab chained across its shoulders like a fallen courthouse arch, and one tiny annoyed face carved too low in the stone. It should feel like a pompous royal monument that came alive and immediately regretted having legs, funny in proportion but still an elite enemy.
Colour/readability baseline: use sharp bright stained-glass colours that read against a near-black combat background: electric violet pillar panes, saturated sapphire blue stone-glass blocks, cold cyan-white crack highlights, and hot magenta judgement core. Keep obsidian black only for chunky outer silhouette, stone cracks, and thick lead dividers, not as large unlit body panels. Large visible colour masses should dominate the subject. Avoid dull smoky navy, low-contrast charcoal slabs, and all-over black fill.
Act 3 faction read: include one broken orbit halo fragment as a huge shoulder arch and one hot magenta judgement core as the chest seal, adapted to this creature's silhouette; add only tiny tarnished-gold court accents.
Readability priority: silhouette first, pose second, huge squat pillar body plus chest seal third, colour fourth, texture last. The subject must still be recognisable as a black shadow with all internal details removed.
Style/medium: serious cartoon-gothic stained-glass game art; chunky black silhouette; simplified exaggerated proportions; one iconic primary shape; 3-5 large bright stained-glass colour masses only; very few thick lead dividers; matte painterly texture; restrained broad cathedral/court motifs; thumbnail-readable at 128px; funny, dramatic, grave, and dangerous through bold proportions and expression.
Composition/framing: elite enemy full body, larger than normal enemies but fully inside frame, facing slightly left, generous padding, no cropped silhouette hooks, no action blur.
Lighting/mood: sober astral-court gothic mood with strong internal glass brightness; single warm amber rim light defining the silhouette without forming a yellow outline; soft restrained inner glow limited to the hot magenta chest seal and one cyan-white crack pane; high value contrast on the main read.
Scene/backdrop: perfectly flat solid #00ff00 chroma-key background only.
Constraints: no ground plane; no floor; no shadows; no reflections; no haze touching the silhouette; no text; no labels; no watermark; no yellow outer outline; do not use #00ff00 in the subject.
```

Review note: strong elite scale and weight. The tiny face and stubborn feet keep
the funny enemy read while the chest seal and shoulder arch carry the Act 3
faction motif.

## Act 3 Finale v1: Herald of the End Colour-Lift

Status: superseded by the v2 clean pass. Previously parked at
`src/assets-readable-baseline/enemies/heraldOfEnd.png`; current approved gallery
uses `enemy-heraldOfEnd-v2/05-colour-lift.png`.

Generated image id:
`ig_0fa93476280c1fb8016a4ae6d0dbe4819184ea65577b7da129`

Source:
`enemy-heraldOfEnd/01-gpt-image-2-source.png`

Original source alpha:
`enemy-heraldOfEnd/01-gpt-image-2-source-alpha.png`

Rim-cleaned alpha:
`enemy-heraldOfEnd/04-no-yellow-outline.png`

Colour-lift alpha:
`enemy-heraldOfEnd/05-colour-lift.png`

Exact prompt:

```text
Use case: stylized-concept
Asset type: Spirebound Act 3 elite enemy alpha-ready source, approved dark-background colour baseline
Primary request: Herald of the End, a funny but threatening Act 3 elite doomsday announcer made for a dark game background. Menacing idle pose, facing slightly left toward the hero. One iconic primary read: a melodramatic tiny robed herald almost swallowed by an absurdly huge cracked bell-mouth horn, with the horn rim shaped as a broken orbit halo, a hot magenta judgement core glowing inside the bell, and dangling court ribbons that look over-official. It should feel like a theatrical apocalypse crier who is much smaller than his announcement, funny in proportion but still an elite enemy.
Colour/readability baseline: use sharp bright stained-glass colours that read against a near-black combat background: electric violet robe panes, saturated sapphire blue horn panels, cold cyan-white star cracks, and hot magenta bell-core glow. Keep obsidian black only for chunky outer silhouette, horn interior edges, and thick lead dividers, not as large unlit body panels. Large visible colour masses should dominate the subject. Avoid dull smoky navy, low-contrast charcoal slabs, and all-over black fill.
Act 3 faction read: include one broken orbit halo fragment as the giant horn rim and one hot magenta judgement core inside the bell-mouth, adapted to this creature's silhouette; add only tiny tarnished-gold court accents.
Readability priority: silhouette first, pose second, giant bell-horn plus tiny herald body third, colour fourth, texture last. The subject must still be recognisable as a black shadow with all internal details removed.
Style/medium: serious cartoon-gothic stained-glass game art; chunky black silhouette; simplified exaggerated proportions; one iconic primary shape; 3-5 large bright stained-glass colour masses only; very few thick lead dividers; matte painterly texture; restrained broad cathedral/court motifs; thumbnail-readable at 128px; funny, dramatic, grave, and dangerous through bold proportions and expression.
Composition/framing: elite enemy full body, larger than normal enemies but fully inside frame, facing slightly left, generous padding around the oversized horn, no cropped silhouette hooks, no action blur.
Lighting/mood: sober astral-court gothic mood with strong internal glass brightness; single warm amber rim light defining the silhouette without forming a yellow outline; soft restrained inner glow limited to the hot magenta bell core and one cyan-white horn pane; high value contrast on the main read.
Scene/backdrop: perfectly flat solid #00ff00 chroma-key background only.
Constraints: no ground plane; no floor; no shadows; no reflections; no haze touching the silhouette; no text; no labels; no watermark; no yellow outer outline; do not use #00ff00 in the subject.
```

Review note: clear theatrical elite read. The oversized horn gives a strong
silhouette and keeps the herald from becoming a generic robed caster.

## Act 3 Finale v1: The Eternal Sovereign Colour-Lift

Status: superseded by the v2 clean pass. Previously parked at
`src/assets-readable-baseline/enemies/sovereign.png`; current approved gallery
uses `enemy-sovereign-v2/06-colour-lift-framed.png`.

Generated image id:
`ig_0eec9c7c7e95b81a016a4ae732c31c8191a2d38548adcb8ce1`

Source:
`enemy-sovereign/01-gpt-image-2-source.png`

Original source alpha:
`enemy-sovereign/01-gpt-image-2-source-alpha.png`

Rim-cleaned alpha:
`enemy-sovereign/04-no-yellow-outline.png`

Colour-lift alpha:
`enemy-sovereign/05-colour-lift.png`

Framed colour-lift alpha:
`enemy-sovereign/06-colour-lift-framed.png`

Exact prompt:

```text
Use case: stylized-concept
Asset type: Spirebound Act 3 final boss enemy alpha-ready source, approved dark-background colour baseline
Primary request: The Eternal Sovereign, the final boss: a terrifying but still readable cracked astral-court tyrant made for a dark game background. Menacing idle pose, facing slightly left toward the hero. One iconic primary read: a huge top-heavy cracked crown fused to a black-sun broken orbit halo, a short crooked robed body beneath it, an oversized judgement scepter too heavy for the small hands, and one hot magenta judgement core blazing in the chest like a royal verdict. It should feel like the entire broken court squeezed into one arrogant final ruler, dramatic and final, slightly absurd in proportion, but absolutely the boss enemy.
Colour/readability baseline: use sharp bright stained-glass colours that read against a near-black combat background: electric violet royal panes, saturated sapphire blue halo/crown glass, cold cyan-white star cracks, and hot magenta judgement core. Keep obsidian black only for chunky outer silhouette, crown cracks, and thick lead dividers, not as large unlit body panels. Large visible colour masses should dominate the subject. Avoid dull smoky navy, low-contrast charcoal slabs, all-over black fill, handsome hero-king framing, or clean noble symmetry.
Act 3 faction read: include one huge broken orbit black-sun halo behind the crown and one hot magenta judgement core in the chest, adapted to this boss silhouette; add tiny tarnished-gold court accents only as crown points and scepter trim.
Readability priority: silhouette first, pose second, giant cracked crown plus black-sun halo third, chest core and scepter fourth, texture last. The subject must still be recognisable as a black shadow with all internal details removed.
Style/medium: serious cartoon-gothic stained-glass game art; chunky black silhouette; simplified exaggerated proportions; one iconic primary shape; 3-5 large bright stained-glass colour masses only; very few thick lead dividers; matte painterly texture; restrained broad cathedral/court motifs; thumbnail-readable at 128px; funny, dramatic, grave, and dangerous through bold proportions and expression.
Composition/framing: final boss full body, largest Act 3 enemy but fully inside frame, facing slightly left, generous padding around crown, halo, and scepter, no cropped silhouette hooks, no action blur.
Lighting/mood: final astral-court gothic mood with strong internal glass brightness; single warm amber rim light defining the silhouette without forming a yellow outline; soft restrained inner glow limited to the hot magenta judgement core and one cyan-white crown crack; high value contrast on the main read.
Scene/backdrop: perfectly flat solid #00ff00 chroma-key background only.
Constraints: no ground plane; no floor; no shadows; no reflections; no haze touching the silhouette; no text; no labels; no watermark; no yellow outer outline; do not use #00ff00 in the subject.
```

Review note: strongest final-boss read so far. The crown, black-sun halo,
scepter, and chest core create a clear hierarchy; the extra framing pass keeps
the scepter and halo off the image edge without changing the artwork.

## Act 3 Finale v2 Clean Approved Contact Sheet

Status: approved. Current gallery assets are parked at
`src/assets-readable-baseline/enemies/voidColossus.png`,
`src/assets-readable-baseline/enemies/heraldOfEnd.png`, and
`src/assets-readable-baseline/enemies/sovereign.png`.

Contact sheet:
`act3-finale-v2-clean-approved-contact.png`

Decision note: council approved the v2 clean pass. v1 was considered
directionally good, but too noisy. The approved v2 pass keeps the same
character concepts and Act 3 faction read, but clamps down on micro-panels,
mosaic texture, jewellery, chains, dangling ornaments, tiny halo shards, and
busy brush noise. The goal is a cleaner game-token read: large silhouette
first, a single prop or symbol second, and broad stained-glass colour masses
third.

Shared post-process:

```text
python3 ${CODEX_HOME:-$HOME/.codex}/skills/.system/imagegen/scripts/remove_chroma_key.py --input <01-gpt-image-2-source.png> --out <01-gpt-image-2-source-alpha.png> --auto-key border --soft-matte --transparent-threshold 12 --opaque-threshold 220 --despill
python3 tools/strip-alpha-rim.py --input <01-gpt-image-2-source-alpha.png> --out <04-no-yellow-outline.png> --radius 6 --mode darken
magick <04-no-yellow-outline.png> -colorspace sRGB -modulate 116,118,100 -gamma 0.93 <05-colour-lift.png>
magick <05-colour-lift.png> -resize '1024x1024>' src/assets-readable-baseline/enemies/<id>.png
```

`sovereign.png` also received the same transparent framing correction as v1:

```text
magick src/assets-readable-baseline/enemies/sovereign.png -background none -gravity center -extent 780x1024 enemy-sovereign-v2/06-colour-lift-framed.png
```

## Act 3 Finale v2: Voidforged Colossus Clean Colour-Lift

Status: approved. Promoted to
`src/assets-readable-baseline/enemies/voidColossus.png`.

Generated image id:
`ig_01b63f3e61f6f7ca016a4aec3dae308191a8362d52fcb327e9`

Discarded v2 attempt:
`ig_0da34c7937dde582016a4aebe1431c8191bc6808d6312d2555` was saved as
`enemy-voidColossus-v2/00-v2-attempt-too-detailed-source.png`; it reduced some
v1 ornament but still had too many internal panes.

Source:
`enemy-voidColossus-v2/01-gpt-image-2-source.png`

Original source alpha:
`enemy-voidColossus-v2/01-gpt-image-2-source-alpha.png`

Rim-cleaned alpha:
`enemy-voidColossus-v2/04-no-yellow-outline.png`

Colour-lift alpha:
`enemy-voidColossus-v2/05-colour-lift.png`

Exact prompt:

```text
Use case: stylized-concept
Asset type: Spirebound Act 3 elite enemy alpha-ready source, v2 clean readability pass
Primary request: Voidforged Colossus v2, a funny but threatening Act 3 elite enemy. A huge squat royal court-pillar statue with tiny stubborn feet and one tiny annoyed face carved too low. It is too heavy to move properly. It faces slightly left toward the hero. One iconic primary read: a simple massive pillar body, one large broken orbit arch across the shoulders, one large hot magenta cracked judgement seal on the chest. Funny in proportion, still elite and dangerous.
Clean design rule: make this a clean readable game character token, not a detailed glass illustration. Use large simple silhouette blocks and plain broad glass panels. Only 3-5 major colour masses in the entire subject: dark pillar body, violet body panes, cyan orbit-arch pane, hot magenta chest seal, tiny gold accents. Use very few thick black lead dividers, no more than about 12 internal divider lines total. One big crack on the chest seal is okay; avoid all other small cracks. Keep surfaces smooth and graphic.
Style/medium: serious cartoon-gothic stained-glass dark-fantasy game art; chunky hand-inked outer contour; simplified exaggerated proportions; bold clean matte painterly shapes; readable at 128px; dramatic, grave, cute-funny in proportions. Do not make it photorealistic, do not make it ornate, do not make it glossy 3D.
Strict avoid list: no micro-panels, no mosaic texture, no stone brick segmentation, no many little glass shards, no radial rings of tiny panes, no chains, no dangling ornaments, no tiny gold studs, no lacework, no filigree, no many spikes, no dust speckles, no scattered stars, no busy brush noise, no tiny highlights, no complex anatomy segmentation.
Composition/framing: full body, bigger than normal enemies but fully inside frame, facing slightly left, generous padding, no cropped silhouette, no action blur.
Lighting/mood: one warm amber rim light defining the silhouette; soft controlled glow only from the magenta chest seal and one cyan orbit-arch pane; high value contrast; no scattered sparkles, no noisy bloom, no haze touching the silhouette.
Color palette: bright for dark game background; obsidian black lead and shadow; electric amethyst and bright violet main glass; one cyan star-glass arch pane; hot magenta judgement core; tiny tarnished-gold accents.
Readability priority: silhouette first, pose second, face/core symbol third, colour fourth, texture last. The creature must still be recognisable as a black shadow with all internal details removed.
Scene/backdrop: perfectly flat solid #00ff00 chroma-key background only.
Constraints: single complete subject only; crisp clean edges; no ground plane; no floor; no shadows; no reflections; no text; no labels; no watermark; do not use #00ff00 anywhere in the subject.
```

Review note: cleaner than v1 through broad pillar panes and one dominant chest
seal. Some gold points remain, but they are now large readable accents rather
than chains or small jewellery noise.

## Act 3 Finale v2: Herald of the End Clean Colour-Lift

Status: approved. Promoted to
`src/assets-readable-baseline/enemies/heraldOfEnd.png`.

Generated image id:
`ig_0d9fbf983cabb83c016a4aeca4ce948191951f00d490b9258d`

Source:
`enemy-heraldOfEnd-v2/01-gpt-image-2-source.png`

Original source alpha:
`enemy-heraldOfEnd-v2/01-gpt-image-2-source-alpha.png`

Rim-cleaned alpha:
`enemy-heraldOfEnd-v2/04-no-yellow-outline.png`

Colour-lift alpha:
`enemy-heraldOfEnd-v2/05-colour-lift.png`

Exact prompt:

```text
Use case: stylized-concept
Asset type: Spirebound Act 3 elite enemy alpha-ready source, v2 clean readability pass
Primary request: Herald of the End v2, a funny but threatening Act 3 elite doomsday announcer made for a dark game background. A tiny melodramatic court herald is almost swallowed by one absurdly huge cracked bell-mouth horn. Menacing idle pose, facing slightly left toward the hero. One iconic primary read: tiny robed crier, giant simple horn facing left, horn rim shaped as one broken orbit halo fragment, hot magenta judgement glow inside the bell, tiny anxious face peeking beneath the horn. It should feel like a theatrical apocalypse crier who is much smaller than his announcement, funny in proportion but still an elite enemy.
Act 3 faction read: include one broken orbit halo fragment as the giant horn rim and one hot magenta judgement core inside the bell-mouth, adapted to this creature's silhouette; add only tiny tarnished-gold court accents.
Clean design rule: make this a clean readable game character token, not a detailed glass illustration. Use one huge horn shape as the main silhouette and a small simple body shape under it. Only 3-5 major colour masses in the entire subject: dark horn shell, violet robe/body, cyan horn pane, hot magenta bell core, tiny gold trim. Use very few thick black lead dividers, no more than about 12 internal divider lines total. Keep the horn rim broad and plain. Keep surfaces smooth and graphic.
Style/medium: serious cartoon-gothic stained-glass dark-fantasy game art; chunky hand-inked outer contour; simplified exaggerated proportions; bold clean matte painterly shapes; readable at 128px; dramatic, grave, cute-funny in proportions. Do not make it photorealistic, do not make it ornate, do not make it glossy 3D.
Strict avoid list: no micro-panels, no mosaic texture, no dangling court ribbons, no hanging tags, no chains, no tassels, no lacework, no filigree, no many little glass shards, no radial rings of tiny panes, no many spikes, no dust speckles, no scattered stars, no busy brush noise, no tiny highlights, no complex robe folds, no complex anatomy segmentation.
Composition/framing: elite enemy full body, bigger than normal enemies but fully inside frame, facing slightly left, generous padding around horn rim and feet, no cropped silhouette, no action blur.
Lighting/mood: one warm amber rim light defining the silhouette; soft controlled glow only from the magenta bell core and one cyan-violet horn pane; high value contrast; no scattered sparkles, no noisy bloom, no haze touching the silhouette.
Color palette: bright for dark game background; obsidian black lead and shadow; electric amethyst and bright violet robe/horn shell; one cyan star-glass horn pane; hot magenta judgement glow inside bell; tiny tarnished-gold trim only.
Readability priority: silhouette first, pose second, horn/core/face third, colour fourth, texture last. The creature must still be recognisable as a black shadow with all internal details removed.
Scene/backdrop: perfectly flat solid #00ff00 chroma-key background only.
Constraints: single complete subject only; crisp clean edges; no ground plane; no floor; no shadows; no reflections; no text; no labels; no watermark; do not use #00ff00 anywhere in the subject.
```

Review note: cleanest silhouette in the batch. The horn is now the whole
primary read; the tiny robed body carries the funny personality without adding
many dangling pieces.

## Act 3 Finale v2: The Eternal Sovereign Clean Colour-Lift

Status: approved. Promoted to
`src/assets-readable-baseline/enemies/sovereign.png`.

Generated image id:
`ig_0afeda95cecf58d6016a4aed69201481918f973f02091d0eb9`

Discarded v2 attempt:
`ig_00e415469665f027016a4aed022bb88191bbab57cd16f67a2a` was saved as
`enemy-sovereign-v2/00-v2-attempt-too-detailed-source.png`; it still had too
many spikes, ornaments, and heroic monarch details for the clean v2 goal.

Source:
`enemy-sovereign-v2/01-gpt-image-2-source.png`

Original source alpha:
`enemy-sovereign-v2/01-gpt-image-2-source-alpha.png`

Rim-cleaned alpha:
`enemy-sovereign-v2/04-no-yellow-outline.png`

Colour-lift alpha:
`enemy-sovereign-v2/05-colour-lift.png`

Framed colour-lift alpha:
`enemy-sovereign-v2/06-colour-lift-framed.png`

Exact prompt:

```text
Use case: stylized-concept
Asset type: Spirebound Act 3 final boss enemy alpha-ready source, v2 clean readability pass
Primary request: The Eternal Sovereign v2, the final boss of Act 3, redesigned as a clean readable astral-court totem instead of a busy monarch. Menacing idle boss pose, facing slightly left toward the hero. One iconic primary read: a giant cracked crown-shaped head sitting on a simple dark robe-bell body, a single broad broken black-sun orbit halo behind it, one oversized hot magenta judgement core on the chest, and one chunky simple scepter leaning on the left. Tiny furious face under the crown. It should feel like the broken astral court became a pompous angry king-statue: grand, dangerous, a little ridiculous because the crown is too large, final-boss scale but clean.
Act 3 faction read: one huge broken orbit black-sun halo behind the crown and one hot magenta judgement core in the chest; tiny tarnished-gold court accents only on the crown tips and one scepter cap.
Clean design rule: this must be a clean game-token silhouette with very low visual noise. Use four huge readable symbols only: crown, black-sun halo, chest core, scepter. Only 3-5 major colour masses in the entire subject: dark crown/robe silhouette, bright violet robe pane, cyan halo pane, hot magenta chest core, tiny gold trim. Use thick black lead dividers, no more than about 10 internal divider lines total. Keep the halo as one or two broad broken chunks, not many fragments. Keep the crown with three large points only. Keep the robe as one bell-shaped mass with two broad panes.
Style/medium: serious cartoon-gothic stained-glass dark-fantasy game art; chunky hand-inked outer contour; simplified exaggerated proportions; bold clean matte painterly shapes; readable at 128px; dramatic, grave, funny in proportion without becoming cute; final boss authority. Do not make it photorealistic, ornate, glossy 3D, or heroic-player-like.
Strict avoid list: no micro-panels, no mosaic texture, no radial rings of tiny panes, no many halo fragments, no spiky crown forest, no many tiny spikes, no pendant jewels, no hanging ornaments, no chains, no tassels, no lacework, no filigree, no fingers, no detailed hands, no many little glass shards, no dust speckles, no scattered stars, no busy brush noise, no tiny highlights, no complex robe folds, no complex anatomy segmentation, no heroic armour.
Composition/framing: final boss full body, largest Act 3 enemy but fully inside frame, facing slightly left, generous padding around crown, halo, and scepter, no cropped silhouette hooks, no action blur.
Lighting/mood: one warm amber rim light defining the silhouette; soft controlled glow only from the magenta chest core and one cyan halo pane; high value contrast; no scattered sparkles, no noisy bloom, no haze touching the silhouette.
Color palette: bright for dark game background; obsidian black lead and shadow; electric amethyst and bright violet robe/crown glass; one cyan star-glass halo pane; hot magenta judgement core; tiny tarnished-gold trim only.
Readability priority: silhouette first, boss pose second, crown/halo/core/scepter third, colour fourth, texture last. The boss must still be recognisable as a black shadow with all internal details removed.
Scene/backdrop: perfectly flat solid #00ff00 chroma-key background only.
Constraints: single complete subject only; crisp clean edges; no ground plane; no floor; no shadows; no reflections; no text; no labels; no watermark; do not use #00ff00 anywhere in the subject.
```

Review note: cleanest boss read. The final design is more of an astral-court
totem than a humanoid monarch, which reduces heroic drift while keeping final
boss scale through the crown, black-sun halo, chest core, and scepter.

## Act 2 Finale Approved: Abyssal Knight v3

Status: approved. Promoted to
`src/assets-readable-baseline/enemies/abyssalKnight.png`. This version
reduces the noble-knight read from the previous finale pass and pushes the
enemy personality closer to the first approved monster prompts.

Generated image id:
`ig_079f681283b69a3d016a4ad2db89c481918066cba77c9c424c`

Source:
`enemy-abyssalKnight-v3/01-gpt-image-2-source.png`

Original source alpha:
`enemy-abyssalKnight-v3/01-gpt-image-2-source-alpha.png`

Rim-cleaned alpha:
`enemy-abyssalKnight-v3/04-no-yellow-outline.png`

Selected review candidate:
`enemy-abyssalKnight-v3/05-gpt-framed.png`

```text
Use case: stylized-concept
Asset type: Spirebound Act 2 elite enemy alpha-ready source
Primary request: Abyssal Knight v3, a funny but threatening cursed sea-floor tin-can knight made of black lead, abyss navy glass, cold cyan oath-glow, and dull barnacle-bone panes. Menacing idle pose, facing slightly left toward the hero. One iconic primary read: an oversized bucket-bell helmet with one tiny glowing slit-eye, a crab-shell shoulder shield, tiny stubborn boots, and a ridiculous anchor-axe dragging behind because it is clearly too heavy. It should feel like a pompous little drowned knight trying to look grand, heroic only in attitude, but still a hostile elite enemy.
Readability priority: silhouette first, pose second, helmet/anchor/eye third, colour fourth, texture last. The subject must still be recognisable as a black shadow with all internal details removed.
Style/medium: serious cartoon-gothic stained-glass game art; chunky black silhouette; simplified exaggerated proportions; one iconic primary shape; 3-5 large stained-glass colour masses only; very few thick lead dividers; matte painterly texture; restrained broad cathedral motifs; thumbnail-readable at 128px; funny, dramatic, grave, and dangerous through bold proportions and expression.
Composition/framing: elite enemy full body, larger than normal enemies but compact, fully inside frame, facing slightly left, generous padding, no cropped helmet, boots, shield, or anchor-axe, no action blur.
Lighting/mood: sober drowned-gothic mood; single warm amber rim light defining the silhouette without forming a yellow outline; soft restrained inner glow limited to the eye slit and oath-core pane; high value contrast on the main read.
Palette: abyss navy, black lead, cold cyan glow, dull barnacle bone, muted steel blue.
Scene/backdrop: perfectly flat solid #ff00ff chroma-key background only.
Constraints: no ground plane; no floor; no shadows; no reflections; no haze touching the silhouette; no text; no labels; no watermark; no yellow outer outline; do not use #ff00ff in the subject.
```

## Act 2 Finale Approved: Siren v3

Status: approved. Promoted to
`src/assets-readable-baseline/enemies/siren.png`. The first corrected Siren
attempt still read too elegant and dragon-like, so v3 makes the body squatter
and funnier while preserving the elite role.

Generated image id:
`ig_06dfb9acb9df135a016a4ad3ecd80481918369777b2b441808`

Source:
`enemy-siren-v3/01-gpt-image-2-source.png`

Original source alpha:
`enemy-siren-v3/01-gpt-image-2-source-alpha.png`

Rim-cleaned alpha:
`enemy-siren-v3/04-no-yellow-outline.png`

Selected review candidate:
`enemy-siren-v3/05-gpt-framed.png`

```text
Use case: stylized-concept
Asset type: Spirebound Act 2 elite enemy alpha-ready source
Primary request: Siren v3, a funny but threatening sea-dirge monster made of black lead, violet storm glass, pale shell-ivory panes, and toxic teal song-glow. Menacing idle pose, facing slightly left toward the hero. One iconic primary read: a squat round shell-horn body with a huge open trumpet throat, one tiny furious diva eye tucked under the shell lip, two short ragged fin-sleeves, tiny hooked talons, and a chubby curled eel tail. It should feel like a cursed opera fish with stage fright trying to scream a debuff, funny in proportion but still an elite enemy.
Readability priority: silhouette first, pose second, huge shell horn/tiny eye/tail third, colour fourth, texture last. The subject must still be recognisable as a black shadow with all internal details removed.
Style/medium: serious cartoon-gothic stained-glass game art; chunky black silhouette; simplified exaggerated proportions; one iconic primary shape; 3-5 large stained-glass colour masses only; very few thick lead dividers; matte painterly texture; restrained broad cathedral motifs; thumbnail-readable at 128px; funny, dramatic, eerie, grave, and dangerous through bold proportions and expression.
Composition/framing: elite enemy full body, compact and rounded, larger than normal enemies, fully inside frame, facing slightly left, generous padding, no cropped horn, fin-sleeves, talons, or tail, no action blur. Avoid a long elegant dragon body; keep the silhouette squat, odd, and readable.
Lighting/mood: sober haunted-opera gothic mood; single warm amber rim light defining the silhouette without forming a yellow outline; soft restrained inner glow limited to the tiny eye and teal song-core inside the shell throat; high value contrast on the main read.
Palette: violet storm glass, toxic teal song-glow, black lead, pale shell ivory, muted deep-sea blue.
Scene/backdrop: perfectly flat solid #ff00ff chroma-key background only.
Constraints: no ground plane; no floor; no shadows; no reflections; no haze touching the silhouette; no text; no labels; no watermark; no yellow outer outline; do not use #ff00ff in the subject.
```

## Act 2 Finale Approved: Leviathan's Maw v2

Status: approved. Promoted to
`src/assets-readable-baseline/enemies/leviathan.png`. This version keeps
the boss size but makes the main read less severe: a huge cathedral-gate mouth,
tiny grumpy eyes, and a silly lure.

Generated image id:
`ig_06dfb9acb9df135a016a4ad38d095081919100f06e32694f22`

Source:
`enemy-leviathan-v2/01-gpt-image-2-source.png`

Original source alpha:
`enemy-leviathan-v2/01-gpt-image-2-source-alpha.png`

Rim-cleaned alpha:
`enemy-leviathan-v2/04-no-yellow-outline.png`

Selected review candidate:
`enemy-leviathan-v2/05-gpt-framed.png`

```text
Use case: stylized-concept
Asset type: Spirebound Act 2 boss enemy alpha-ready source
Primary request: Leviathans Maw v2, a huge funny but threatening deep-sea cathedral beast made of black lead, abyss teal glass, cold cyan brine glow, dull whale-bone panes, and one tiny amber lure. Menacing idle boss pose, facing slightly left toward the hero. One iconic primary read: a gigantic cathedral-gate mouth as the whole body, two tiny grumpy eyes above the gate, a silly dangling lighthouse lure, stubby fin-claws, a heavy round eel-whale back, and a crooked crown of broken ship ribs. It should feel like an ancient sea monster pretending to be a grand cathedral door, absurdly hungry and dramatic, funny in shape but still the Act 2 boss.
Readability priority: silhouette first, pose second, huge mouth/tiny eyes/lure third, colour fourth, texture last. The subject must still be recognisable as a black shadow with all internal details removed.
Style/medium: serious cartoon-gothic stained-glass game art; chunky black silhouette; simplified exaggerated proportions; one iconic primary shape; 3-5 large stained-glass colour masses only; very few thick lead dividers; matte painterly texture; restrained broad cathedral motifs; thumbnail-readable at 128px; funny, dramatic, grave, and dangerous through bold proportions and expression.
Composition/framing: boss enemy full body, visibly larger and heavier than elites, fully inside frame, facing slightly left, generous padding, no cropped jaw, crown, fins, lure, or tail, no action blur. Keep the mouth as one clean huge dark gate shape with a thick readable rim.
Lighting/mood: sober abyssal boss mood; single warm amber rim light defining the silhouette without forming a yellow outline; soft restrained inner glow limited to the cyan brine mouth-core and tiny amber lure; high value contrast on the main read.
Palette: abyss teal, deep navy, black lead, cold cyan brine glow, dull whale bone, tiny amber lure.
Scene/backdrop: perfectly flat solid #ff00ff chroma-key background only.
Constraints: no ground plane; no floor; no shadows; no reflections; no haze touching the silhouette; no text; no labels; no watermark; no yellow outer outline; do not use #ff00ff in the subject.
```

Contact sheets:

- `act2-finale-v1-v2-gpt-contact.png`
- `act2-finale-v2-gpt-review-contact.png`

## Act 2 Finale Rejected Comparison: Abyssal Knight v2

Status: rejected comparison after v2 approval. The candidate is retained in
scratch only; the temporary runtime gallery folder was removed after promotion.
The selected file was the v2 gpt-image-2 source alpha after chroma removal,
warm outer-rim cleanup, and deterministic 1024px transparent framing. It was
readable but still too serious and noble compared with the approved v3.

Generated image id:
`ig_084ca6e241937ce2016a4acffa03548191a237fdf3752657da`

Source:
`enemy-abyssalKnight-v2/01-gpt-image-2-source.png`

Original source alpha:
`enemy-abyssalKnight-v2/01-gpt-image-2-source-alpha.png`

Rim-cleaned alpha:
`enemy-abyssalKnight-v2/04-no-yellow-outline.png`

Selected review candidate:
`enemy-abyssalKnight-v2/05-gpt-framed.png`

Nano Banana evidence:
`enemy-abyssalKnight-v2/02-nanobanana-pro-cleaned.jpg`
`enemy-abyssalKnight-v2/03-alpha.png`
`enemy-abyssalKnight-v2/03-alpha-no-yellow-outline.png`
`enemy-abyssalKnight-v2/06-nanobanana-framed.png`

```text
Use case: stylized-concept
Asset type: Spirebound Act 2 elite enemy alpha-ready source
Primary request: Abyssal Knight v2, an elite cursed sea-floor knight enemy made of black lead, abyss navy glass, cold cyan oath-glow, and dull barnacle-bone panes. Menacing idle pose, facing slightly left toward the hero. One iconic primary read: a squat top-heavy hollow bell-helmet almost bigger than the body, one narrow cyan eye slit, tiny stubborn plated feet, a ridiculously oversized anchor-cleaver dragging low like it is too heavy, and a barnacle-crab shield fused onto one shoulder. It should feel elite-sized, strong, funny, dramatic, and dangerous: a pompous cursed tin-can executioner from the drowned cathedral trying to look noble but clearly a hostile monster, not a player hero.
Style/medium: serious cartoon-gothic dark-fantasy game art; instantly readable black silhouette first; one iconic primary shape; chunky hand-inked outer contour; simplified exaggerated proportions; 3-5 large stained-glass colour masses only, with very few thick lead dividers; matte painterly brush texture; restrained cathedral motifs as broad shapes, not filigree; thumbnail-readable at 128px; dramatic, fun, and grave, not cute plush, not comedic mascot; no lacework, no micro-panels, no complex anatomy segmentation, no ornate armour noise, no glossy 3D render, no generic fantasy.
Composition/framing: single complete subject, centred, generous padding on all sides, no cropped helmet, anchor-cleaver, shield, or feet; elite enemy scale larger than normal enemies but smaller than boss; compact hunched enemy posture, not tall heroic stance; readable silhouette: huge bell-helmet, one eye slit, dragging oversized anchor-cleaver, shoulder crab-shield, tiny plated feet; no action blur.
Lighting/mood: sober abyssal gothic mood; single warm amber rim light defining the silhouette without forming a yellow outline; soft restrained inner glow limited to the eye slit and oath-core pane; high value contrast on the main read; no scattered sparkles, no multi-source glow, no noisy bloom, no haze touching the silhouette.
Scene/backdrop: perfectly flat solid #ff00ff chroma-key background only.
Color palette: abyss navy, black lead, cold cyan glow, dull barnacle bone, muted steel blue; do not use #ff00ff in the subject.
Readability priority: silhouette first, pose second, helmet/anchor-cleaver/eye third, colour fourth, texture last. The subject must still be recognisable as a black shadow with all internal details removed.
Constraints: no ground plane; no floor; no shadows; no reflections; no haze touching the silhouette; no text; no labels; no watermark; no yellow outer outline; no tall noble knight stance; no handsome human face; no clean heroic armour anatomy; no extra characters.
```

## Act 2 Finale Comparison: Abyssal Knight v1

Status: comparison only. Kept in scratch because it was too noble and hero-like
for the enemy-elite brief.

Generated image id:
`ig_05feb5b8ad8abec9016a4ace35ab008191bc056fb6e5543073`

Source:
`enemy-abyssalKnight/01-gpt-image-2-source.png`

Selected comparison candidate:
`enemy-abyssalKnight/05-gpt-framed.png`

Nano Banana evidence:
`enemy-abyssalKnight/02-nanobanana-pro-cleaned.jpg`
`enemy-abyssalKnight/03-alpha.png`
`enemy-abyssalKnight/03-alpha-no-yellow-outline.png`
`enemy-abyssalKnight/06-nanobanana-framed.png`

```text
Use case: stylized-concept
Asset type: Spirebound Act 2 elite enemy alpha-ready source
Primary request: Abyssal Knight, an elite cursed sea-floor knight enemy made of black lead, abyss navy glass, cold cyan oath-glow, and dull barnacle-bone panes. Menacing idle pose, facing slightly left toward the hero. One iconic primary read: a top-heavy hollow bell-helmet armour with one narrow cyan eye slit, an absurdly oversized anchor-cleaver sword held low, a barnacle shield-shoulder, tiny stubborn plated legs, and a pompous condemned posture. It should feel elite-sized, strong, funny, dramatic, and dangerous: a self-important cursed tin-can knight from the drowned cathedral, not a player hero.
Style/medium: serious cartoon-gothic dark-fantasy game art; instantly readable black silhouette first; one iconic primary shape; chunky hand-inked outer contour; simplified exaggerated proportions; 3-5 large stained-glass colour masses only, with very few thick lead dividers; matte painterly brush texture; restrained cathedral motifs as broad shapes, not filigree; thumbnail-readable at 128px; dramatic, fun, and grave, not cute plush, not comedic mascot; no lacework, no micro-panels, no complex anatomy segmentation, no ornate armour noise, no glossy 3D render, no generic fantasy.
Composition/framing: single complete subject, centred, generous padding on all sides, no cropped helmet, sword, shield, or feet; elite enemy scale larger than normal enemies but smaller than boss; readable silhouette: huge hollow bell-helmet, one cyan eye slit, oversized anchor-cleaver sword, barnacle shield-shoulder, tiny plated legs; no action blur.
Lighting/mood: sober abyssal gothic mood; single warm amber rim light defining the silhouette without forming a yellow outline; soft restrained inner glow limited to the eye slit and oath-core pane; high value contrast on the main read; no scattered sparkles, no multi-source glow, no noisy bloom, no haze touching the silhouette.
Scene/backdrop: perfectly flat solid #ff00ff chroma-key background only.
Color palette: abyss navy, black lead, cold cyan glow, dull barnacle bone, muted steel blue; do not use #ff00ff in the subject.
Readability priority: silhouette first, pose second, helmet/sword/eye third, colour fourth, texture last. The subject must still be recognisable as a black shadow with all internal details removed.
Constraints: no ground plane; no floor; no shadows; no reflections; no haze touching the silhouette; no text; no labels; no watermark; no yellow outer outline; no noble heroic champion stance; no handsome human face; no extra characters.
```

## Act 2 Finale Rejected Comparison: Siren

Status: rejected comparison after v2 approval. The candidate is retained in
scratch only; the temporary runtime gallery folder was removed after promotion.
The selected file was the gpt-image-2 source alpha after chroma removal, warm
outer-rim cleanup, and deterministic 1024px transparent framing. It drifted too
elegant and dragon-like compared with the approved squat shell-horn v3.

Generated image id:
`ig_05feb5b8ad8abec9016a4ace726a8081918755b7f11a2b6978`

Source:
`enemy-siren/01-gpt-image-2-source.png`

Original source alpha:
`enemy-siren/01-gpt-image-2-source-alpha.png`

Rim-cleaned alpha:
`enemy-siren/04-no-yellow-outline.png`

Selected review candidate:
`enemy-siren/05-gpt-framed.png`

Nano Banana evidence:
`enemy-siren/02-nanobanana-pro-cleaned.jpg`
`enemy-siren/03-alpha.png`
`enemy-siren/03-alpha-no-yellow-outline.png`
`enemy-siren/06-nanobanana-framed.png`

```text
Use case: stylized-concept
Asset type: Spirebound Act 2 elite enemy alpha-ready source
Primary request: Siren, an elite sea-dirge monster enemy made of black lead, violet storm glass, pale shell ivory panes, and toxic teal song-glow. Menacing idle pose, facing slightly left toward the hero. One iconic primary read: a theatrical shell-megaphone throat and mask as the main head shape, a hunched eel-tail body, two ragged fin-wings like opera sleeves, hooked talon hands, and a tiny furious diva eye. It should feel elite-sized, funny, dramatic, eerie, and dangerous: a cursed drowned opera singer that debuffs with a dirge, heals itself, and shrieks; monster first, not a pretty human mermaid or hero.
Style/medium: serious cartoon-gothic dark-fantasy game art; instantly readable black silhouette first; one iconic primary shape; chunky hand-inked outer contour; simplified exaggerated proportions; 3-5 large stained-glass colour masses only, with very few thick lead dividers; matte painterly brush texture; restrained cathedral motifs as broad shapes, not filigree; thumbnail-readable at 128px; dramatic, fun, and grave, not cute plush, not comedic mascot; no lacework, no micro-panels, no complex anatomy segmentation, no ornate armour noise, no glossy 3D render, no generic fantasy.
Composition/framing: single complete subject, centred, generous padding on all sides, no cropped wings, talons, tail, or shell throat; elite enemy scale larger than normal enemies but smaller than boss; readable silhouette: huge shell-megaphone throat, hunched eel body, ragged fin-wings, hooked talons, tiny diva eye; no action blur.
Lighting/mood: sober haunted-opera gothic mood; single warm amber rim light defining the silhouette without forming a yellow outline; soft restrained inner glow limited to the eye and teal song-core in the shell throat; high value contrast on the main read; no scattered sparkles, no multi-source glow, no noisy bloom, no haze touching the silhouette.
Scene/backdrop: perfectly flat solid #ff00ff chroma-key background only.
Color palette: violet storm glass, toxic teal song-glow, black lead, pale shell ivory, muted deep-sea blue; do not use #ff00ff in the subject.
Readability priority: silhouette first, pose second, shell throat/wings/talons third, colour fourth, texture last. The subject must still be recognisable as a black shadow with all internal details removed.
Constraints: no ground plane; no floor; no shadows; no reflections; no haze touching the silhouette; no text; no labels; no watermark; no yellow outer outline; no attractive human face; no mermaid pin-up pose; no heroic upright champion pose; no extra characters.
```

## Act 2 Finale Rejected Comparison: Leviathan's Maw

Status: rejected comparison after v2 approval. The candidate is retained in
scratch only; the temporary runtime gallery folder was removed after promotion.
The selected file was the gpt-image-2 source alpha after chroma removal, warm
outer-rim cleanup, and deterministic 1024px transparent framing. It used a
larger boss framing target than normal enemies but read too severe compared
with the approved v2.

Generated image id:
`ig_05feb5b8ad8abec9016a4aceb5afdc81918af502f159782b0a`

Source:
`enemy-leviathan/01-gpt-image-2-source.png`

Original source alpha:
`enemy-leviathan/01-gpt-image-2-source-alpha.png`

Rim-cleaned alpha:
`enemy-leviathan/04-no-yellow-outline.png`

Selected review candidate:
`enemy-leviathan/05-gpt-framed.png`

Nano Banana evidence:
`enemy-leviathan/02-nanobanana-pro-cleaned.jpg`
`enemy-leviathan/03-alpha.png`
`enemy-leviathan/03-alpha-no-yellow-outline.png`
`enemy-leviathan/06-nanobanana-framed.png`

```text
Use case: stylized-concept
Asset type: Spirebound Act 2 boss enemy alpha-ready source
Primary request: Leviathan's Maw, the Act 2 boss, a huge funny but terrifying deep-sea cathedral beast made of black lead, abyss teal glass, cold cyan brine glow, and dull whale-bone panes. Menacing idle boss pose, facing slightly left toward the hero. One iconic primary read: a gigantic cathedral-gate mouth as the whole body, tiny angry eyes above the gate, a crown of broken ship ribs, two squat fin-claws gripping the water, a heavy eel-whale back, and a ridiculous dangling lighthouse-lure like bait. It should feel boss-sized, unique, dramatic, strong, and interesting: an ancient sea monster that thinks it is a cathedral door and wants to swallow the whole stage, funny in shape but genuinely dangerous.
Style/medium: serious cartoon-gothic dark-fantasy game art; instantly readable black silhouette first; one iconic primary shape; chunky hand-inked outer contour; simplified exaggerated proportions; 3-5 large stained-glass colour masses only, with very few thick lead dividers; matte painterly brush texture; restrained cathedral motifs as broad shapes, not filigree; thumbnail-readable at 128px; dramatic, fun, and grave, not cute plush, not comedic mascot; no lacework, no micro-panels, no complex anatomy segmentation, no ornate armour noise, no glossy 3D render, no generic fantasy.
Composition/framing: single complete subject, centred, generous padding on all sides, no cropped jaw, crown, fins, lure, or tail; boss scale visibly larger and heavier than elites; readable silhouette: massive cathedral-gate mouth, tiny angry eyes, ship-rib crown, squat fin-claws, heavy eel-whale back, dangling lighthouse-lure; no action blur.
Lighting/mood: sober abyssal boss mood; single warm amber rim light defining the silhouette without forming a yellow outline; soft restrained inner glow limited to the cyan brine mouth-core and lighthouse-lure; high value contrast on the main read; no scattered sparkles, no multi-source glow, no noisy bloom, no haze touching the silhouette.
Scene/backdrop: perfectly flat solid #ff00ff chroma-key background only.
Color palette: abyss teal, deep navy, black lead, cold cyan brine glow, dull whale bone, tiny amber lure; do not use #ff00ff in the subject.
Readability priority: silhouette first, pose second, mouth/crown/lure third, colour fourth, texture last. The subject must still be recognisable as a black shadow with all internal details removed.
Constraints: mouth must be a clean huge dark gate shape with a thick readable rim, not a broken generation artifact; no ground plane; no floor; no shadows; no reflections; no haze touching the silhouette; no text; no labels; no watermark; no yellow outer outline; no heroic upright champion pose; no human anatomy; no extra characters.
```

## Act 2 Batch 2 Approved: Tidecaller

Status: approved. Promoted to
`src/assets-readable-baseline/enemies/tidecaller.png`. The selected file is the
gpt-image-2 source alpha after chroma removal, warm outer-rim cleanup, and
deterministic 1024px transparent framing. Nano Banana Pro evidence was good but
is retained for comparison only because council approved the GPT version.

Generated image id:
`ig_009d43f3738ece25016a4ac7e6578881919a6899634ffd70d9`

Source:
`enemy-tidecaller/01-gpt-image-2-source.png`

Original source alpha:
`enemy-tidecaller/01-gpt-image-2-source-alpha.png`

Rim-cleaned alpha:
`enemy-tidecaller/04-no-yellow-outline.png`

Selected review candidate:
`enemy-tidecaller/05-gpt-framed.png`

Nano Banana evidence:
`enemy-tidecaller/02-nanobanana-pro-cleaned.jpg`
`enemy-tidecaller/03-alpha.png`
`enemy-tidecaller/03-alpha-no-yellow-outline.png`
`enemy-tidecaller/06-nanobanana-framed.png`

```text
Use case: stylized-concept
Asset type: Spirebound Act 2 enemy alpha-ready source
Primary request: Tidecaller, a funny but threatening tide cultist enemy made of black lead, sea-cyan glass, storm-blue panes, and a small warm amber shell-lantern glow. Menacing idle pose, facing slightly left toward the hero. One iconic primary read: a squat wobbling sea-priest wrapped in a huge spiral conch hood, one glowing eye peeking from the shell, a tiny robe body, tiny puddle feet, and an oversized crooked tide-staff shaped like a wave hook. It should feel like a bossy little beach prophet ordering waves around, weird and interesting but still dangerous; enemy token, not heroic.
Style/medium: serious cartoon-gothic dark-fantasy game art; instantly readable black silhouette first; one iconic primary shape; chunky hand-inked outer contour; simplified exaggerated proportions; 3-5 large stained-glass colour masses only, with very few thick lead dividers; matte painterly brush texture; restrained cathedral motifs as broad shapes, not filigree; thumbnail-readable at 128px; dramatic, fun, and grave, not cute plush, not comedic mascot; no lacework, no micro-panels, no complex anatomy segmentation, no ornate armour noise, no glossy 3D render, no generic fantasy.
Composition/framing: single complete subject, centred, generous padding on all sides, no cropped limbs or staff; normal enemy scale; readable silhouette: huge spiral conch hood, one eye, crooked wave-hook staff, tiny robe body, puddle feet; no action blur.
Lighting/mood: sober gothic mood; single warm amber rim light defining the silhouette without forming a yellow outline; soft restrained inner glow limited to the eye and shell-lantern pane; high value contrast on the main read; no scattered sparkles, no multi-source glow, no noisy bloom, no haze touching the silhouette.
Scene/backdrop: perfectly flat solid #ff00ff chroma-key background only.
Color palette: sea cyan, storm blue, black lead, small amber shell-lantern, pale foam highlights; do not use #ff00ff in the subject.
Readability priority: silhouette first, pose second, face/staff/core symbol third, colour fourth, texture last. The subject must still be recognisable as a black shadow with all internal details removed.
Constraints: no ground plane; no floor; no shadows; no reflections; no haze touching the silhouette; no text; no labels; no watermark; no yellow outer outline; no heroic upright champion pose; no human-like handsome face; no extra characters.
```

## Act 2 Batch 2 Approved: Shellback

Status: approved. Promoted to
`src/assets-readable-baseline/enemies/shellback.png`. The selected file is the
gpt-image-2 source alpha after chroma removal, warm outer-rim cleanup, and
deterministic 1024px transparent framing. Nano Banana Pro evidence was good but
is retained for comparison only because council approved the GPT version.

Generated image id:
`ig_009d43f3738ece25016a4ac82635048191bc7c6e38f3bb8540`

Source:
`enemy-shellback/01-gpt-image-2-source.png`

Original source alpha:
`enemy-shellback/01-gpt-image-2-source-alpha.png`

Rim-cleaned alpha:
`enemy-shellback/04-no-yellow-outline.png`

Selected review candidate:
`enemy-shellback/05-gpt-framed.png`

Nano Banana evidence:
`enemy-shellback/02-nanobanana-pro-cleaned.jpg`
`enemy-shellback/03-alpha.png`
`enemy-shellback/03-alpha-no-yellow-outline.png`
`enemy-shellback/06-nanobanana-framed.png`

```text
Use case: stylized-concept
Asset type: Spirebound Act 2 enemy alpha-ready source
Primary request: Shellback, a funny but threatening armoured crab-turtle enemy made of black lead, barnacle ivory glass, rust-red shell panes, and teal water glow. Menacing idle pose, facing slightly left toward the hero. One iconic primary read: a huge domed fortress shell almost bigger than the body, tiny furious crab eyes under the shell rim, one oversized snapper claw held forward, one tiny shield-like claw tucked in, and squat sideways legs. It should feel like a grumpy old harbour bunker that snaps at ankles, cute and interesting but still durable and dangerous; enemy token, not heroic.
Style/medium: serious cartoon-gothic dark-fantasy game art; instantly readable black silhouette first; one iconic primary shape; chunky hand-inked outer contour; simplified exaggerated proportions; 3-5 large stained-glass colour masses only, with very few thick lead dividers; matte painterly brush texture; restrained cathedral motifs as broad shapes, not filigree; thumbnail-readable at 128px; dramatic, fun, and grave, not cute plush, not comedic mascot; no lacework, no micro-panels, no complex anatomy segmentation, no ornate armour noise, no glossy 3D render, no generic fantasy.
Composition/framing: single complete subject, centred, generous padding on all sides, no cropped limbs or claws; normal enemy scale but sturdier than the first Act 2 enemies; readable silhouette: huge domed shell, tiny angry eyes, one giant claw, short legs; no action blur.
Lighting/mood: sober gothic mood; single warm amber rim light defining the silhouette without forming a yellow outline; soft restrained inner glow limited to the eyes and one teal shell-core pane; high value contrast on the main read; no scattered sparkles, no multi-source glow, no noisy bloom, no haze touching the silhouette.
Scene/backdrop: perfectly flat solid #ff00ff chroma-key background only.
Color palette: rust red shell, barnacle ivory, black lead, teal water glow, dull coral accents; do not use #ff00ff in the subject.
Readability priority: silhouette first, pose second, face/claw/shell third, colour fourth, texture last. The subject must still be recognisable as a black shadow with all internal details removed.
Constraints: no ground plane; no floor; no shadows; no reflections; no haze touching the silhouette; no text; no labels; no watermark; no yellow outer outline; no heroic upright champion pose; no human anatomy; no extra characters.
```

## Act 2 Batch 2 Approved: Deepmaw

Status: approved. Promoted to
`src/assets-readable-baseline/enemies/deepmaw.png`. The selected file is the
gpt-image-2 source alpha after chroma removal, warm outer-rim cleanup, and
deterministic 1024px transparent framing. Nano Banana Pro evidence was good but
is retained for comparison only because council approved the GPT version.

Generated image id:
`ig_009d43f3738ece25016a4ac865b7e88191b3b63aed96751300`

Source:
`enemy-deepmaw/01-gpt-image-2-source.png`

Original source alpha:
`enemy-deepmaw/01-gpt-image-2-source-alpha.png`

Rim-cleaned alpha:
`enemy-deepmaw/04-no-yellow-outline.png`

Selected review candidate:
`enemy-deepmaw/05-gpt-framed.png`

Nano Banana evidence:
`enemy-deepmaw/02-nanobanana-pro-cleaned.jpg`
`enemy-deepmaw/03-alpha.png`
`enemy-deepmaw/03-alpha-no-yellow-outline.png`
`enemy-deepmaw/06-nanobanana-framed.png`

```text
Use case: stylized-concept
Asset type: Spirebound Act 2 enemy alpha-ready source
Primary request: Deepmaw, a funny but threatening deep-sea maw monster made of black lead, abyss blue glass, sickly cyan lure glow, and dull bone tooth panes. Menacing idle pose, facing slightly left toward the hero. One iconic primary read: a huge round open bucket-mouth as the whole body, tiny angry eyes above it, a dangling luminous lure on a bent stalk, stubby fins, and two ridiculous little feet. It should feel like a greedy deep-sea trap with a silly oversized appetite, cute and interesting but still dangerous; enemy token, not heroic.
Style/medium: serious cartoon-gothic dark-fantasy game art; instantly readable black silhouette first; one iconic primary shape; chunky hand-inked outer contour; simplified exaggerated proportions; 3-5 large stained-glass colour masses only, with very few thick lead dividers; matte painterly brush texture; restrained cathedral motifs as broad shapes, not filigree; thumbnail-readable at 128px; dramatic, fun, and grave, not cute plush, not comedic mascot; no lacework, no micro-panels, no complex anatomy segmentation, no ornate armour noise, no glossy 3D render, no generic fantasy.
Composition/framing: single complete subject, centred, generous padding on all sides, no cropped fins, feet, teeth, or lure; bigger normal enemy scale; readable silhouette: one huge round bucket mouth, bent lure stalk, tiny eyes, stubby fins, tiny feet; no action blur.
Lighting/mood: sober gothic mood; single warm amber rim light defining the silhouette without forming a yellow outline; soft restrained inner glow limited to the cyan lure and deep mouth core; high value contrast on the main read; no scattered sparkles, no multi-source glow, no noisy bloom, no haze touching the silhouette.
Scene/backdrop: perfectly flat solid #ff00ff chroma-key background only.
Color palette: abyss blue, black lead, sickly cyan lure glow, dull bone teeth, small cold violet shadows; do not use #ff00ff in the subject.
Readability priority: silhouette first, pose second, mouth/lure/eyes third, colour fourth, texture last. The subject must still be recognisable as a black shadow with all internal details removed.
Constraints: the mouth must be a clean single dark oval with a thick rim, not a broken generation artifact; simple readable teeth only, not scattered detached teeth; no ground plane; no floor; no shadows; no reflections; no haze touching the silhouette; no text; no labels; no watermark; no yellow outer outline; no heroic upright champion pose; no human anatomy; no extra characters.
```

## Act 2 Batch 1 V2 Approved: Drowned One

Status: approved. Promoted to
`src/assets-readable-baseline/enemies/drownedOne.png`. The temporary runtime
review folders were removed after gallery cleanup; v1/v2 comparison evidence
remains in scratch. The selected file is the gpt-image-2 source alpha after
chroma removal, warm outer-rim cleanup, and deterministic 1024px transparent
framing.

Generated image id:
`ig_05e370144e91c3fb016a4ac0f9e6288191bb478f36598b260e`

Source:
`enemy-drownedOne-v2/01-gpt-image-2-source.png`

Original source alpha:
`enemy-drownedOne-v2/01-gpt-image-2-source-alpha.png`

Rim-cleaned alpha:
`enemy-drownedOne-v2/04-no-yellow-outline.png`

Selected review candidate:
`enemy-drownedOne-v2/05-gpt-framed.png`

Nano Banana evidence:
`enemy-drownedOne-v2/02-nanobanana-pro-cleaned.jpg`
`enemy-drownedOne-v2/03-alpha.png`
`enemy-drownedOne-v2/06-nanobanana-framed.png`

```text
Use case: stylized-concept
Asset type: Spirebound Act 2 enemy alpha-ready source
Primary request: Drowned One v2, a funny but threatening drowned diving-bell ghoul made of black lead, deep sea-teal glass, pale corpse-blue panes, and one sickly green lantern glow. Menacing idle pose, facing slightly left toward the hero. One iconic primary read: an oversized drooping diving-bell head with one huge round bubble eye and a tiny pouty gurgle-mouth, two absurdly long dripping hook-claws, a glowing anchor-stone belly, and tiny wobbling puddle feet. It should feel like a soaked little troublemaker trying to look scary, weirdly charming but still dangerous.
Readability priority: silhouette first, pose second, face/weapon/core symbol third, colour fourth, texture last. The subject must still be recognisable as a black shadow with all internal details removed. Use game-character readability principles: defining primary characteristic, clear value pattern, coherent limited palette, rest/detail balance, high contrast at eye/anchor belly/claws, no visual noise.
Style/medium: serious cartoon-gothic dark-fantasy game art; instantly readable black silhouette first; one iconic primary shape, weapon, or pose; chunky hand-inked outer contour; simplified exaggerated proportions; 3-5 large stained-glass colour masses only, with very few thick lead dividers; matte painterly brush texture; restrained cathedral motifs as broad shapes, not filigree; thumbnail-readable at 128px; dramatic and grave, with enemy personality carried by bold proportions and expression; no lacework, no micro-panels, no complex anatomy segmentation, no ornate armour noise, no glossy 3D render, no generic fantasy.
Composition/framing: normal enemy full body, fully inside frame, menacing idle pose, facing slightly left, about 14% clean margin; single complete subject; generous padding; no cropped claws; no action blur. Large readable silhouette: oversized diving-bell head, one bubble eye, tiny pout mouth, long dripping hook-claws, glowing anchor belly, tiny puddle feet.
Lighting/mood: sober drowned-gothic mood; single warm amber rim light defining the silhouette; soft restrained inner glow limited to 1-2 focal panes such as bubble eye and anchor belly; high value contrast on the main read; no scattered sparkles, no multi-source glow, no noisy bloom, no haze touching the silhouette.
Palette: deep sea teal glass, pale corpse blue, black lead, sickly green glow, dull ivory claws.
Scene/backdrop: perfectly flat solid #ff00ff chroma-key background only.
Constraints: no ground plane; no floor; no shadows; no reflections; no haze touching the silhouette; no text; no labels; no watermark; do not use #ff00ff in the subject.
```

## Act 2 Batch 1 V2 Approved: Voltaic Eel

Status: approved. Promoted to
`src/assets-readable-baseline/enemies/voltEel.png`. The temporary runtime
review folders were removed after gallery cleanup; v1/v2 comparison evidence
remains in scratch. The selected file is the gpt-image-2 source alpha after
chroma removal, warm outer-rim cleanup, and deterministic 1024px transparent
framing.

Generated image id:
`ig_05e370144e91c3fb016a4ac13dfcfc8191a744b9bdb73fb629`

Source:
`enemy-voltEel-v2/01-gpt-image-2-source.png`

Original source alpha:
`enemy-voltEel-v2/01-gpt-image-2-source-alpha.png`

Rim-cleaned alpha:
`enemy-voltEel-v2/04-no-yellow-outline.png`

Selected review candidate:
`enemy-voltEel-v2/05-gpt-framed.png`

Nano Banana evidence:
`enemy-voltEel-v2/02-nanobanana-pro-cleaned.jpg`
`enemy-voltEel-v2/03-alpha.png`
`enemy-voltEel-v2/06-nanobanana-framed.png`

```text
Use case: stylized-concept
Asset type: Spirebound Act 2 enemy alpha-ready source
Primary request: Voltaic Eel v2, a funny but threatening electric eel enemy made of black lead, electric cyan glass, deep blue shadow panes, and hot yellow lightning core. Menacing idle pose, facing slightly left toward the hero. One iconic primary read: a plump S-shaped eel curled into a lightning-bolt question mark, with a smug tiny squinting eye, a short blunt snout, two oversized fin-spikes like silly storm ears, and a bright jagged lightning belly stripe. It should feel like an overconfident live wire showing off, comic attitude but still sharp and dangerous.
Readability priority: silhouette first, pose second, face/weapon/core symbol third, colour fourth, texture last. The subject must still be recognisable as a black shadow with all internal details removed. Use game-character readability principles: defining primary characteristic, clear value pattern, coherent limited palette, rest/detail balance, high contrast at eye/lightning stripe/fins, no visual noise.
Style/medium: serious cartoon-gothic dark-fantasy game art; instantly readable black silhouette first; one iconic primary shape, weapon, or pose; chunky hand-inked outer contour; simplified exaggerated proportions; 3-5 large stained-glass colour masses only, with very few thick lead dividers; matte painterly brush texture; restrained cathedral motifs as broad shapes, not filigree; thumbnail-readable at 128px; dramatic and grave, with enemy personality carried by bold proportions and expression; no lacework, no micro-panels, no complex anatomy segmentation, no ornate armour noise, no glossy 3D render, no generic fantasy.
Composition/framing: small fast enemy full body, fully inside frame, menacing idle pose, facing slightly left, about 16% clean margin; single complete subject; generous padding; no cropped tail; no action blur. Large readable silhouette: plump S-curve question-mark body, lightning belly stripe, two oversized fin-spikes, tiny smug eye, blunt snout, tail kept inside frame.
Lighting/mood: sober storm-gothic mood; single warm amber rim light defining the silhouette; soft restrained inner glow limited to 1-2 focal panes such as lightning belly stripe and tiny eye; high value contrast on the main read; no scattered sparkles, no multi-source glow, no noisy bloom, no haze touching the silhouette.
Palette: electric cyan glass, hot yellow core, black lead, deep blue shadow, small white spark highlights.
Scene/backdrop: perfectly flat solid #ff00ff chroma-key background only.
Constraints: no ground plane; no floor; no shadows; no reflections; no haze touching the silhouette; no text; no labels; no watermark; do not use #ff00ff in the subject.
```

## Act 2 Batch 1 V2 Approved: Mirelurker

Status: approved. Promoted to
`src/assets-readable-baseline/enemies/mirelurker.png`. The temporary runtime
review folders were removed after gallery cleanup; v1/v2 comparison evidence
remains in scratch. The selected file is the gpt-image-2 source alpha after
chroma removal, warm outer-rim cleanup, and deterministic 1024px transparent
framing.

Generated image id:
`ig_05e370144e91c3fb016a4ac185d28481919d958ef79619d1e9`

Source:
`enemy-mirelurker-v2/01-gpt-image-2-source.png`

Original source alpha:
`enemy-mirelurker-v2/01-gpt-image-2-source-alpha.png`

Rim-cleaned alpha:
`enemy-mirelurker-v2/04-no-yellow-outline.png`

Selected review candidate:
`enemy-mirelurker-v2/05-gpt-framed.png`

Nano Banana evidence:
`enemy-mirelurker-v2/02-nanobanana-pro-cleaned.jpg`
`enemy-mirelurker-v2/03-alpha.png`
`enemy-mirelurker-v2/06-nanobanana-framed.png`

```text
Use case: stylized-concept
Asset type: Spirebound Act 2 enemy alpha-ready source
Primary request: Mirelurker v2, a funny but threatening swamp-burrow crawler made of black lead, murky jade glass, acid green panes, and dull mud-brown shell glass. Menacing idle pose, facing slightly left toward the hero. One iconic primary read: a squat grumpy mud-bug hiding under an oversized cracked turtle-shell helmet, with one giant squinting lantern eye, two tiny shovel claws held too seriously, and one enormous hooked venom barb tail raised over its back like a question mark. It should feel like a ridiculous angry swamp trap that thinks it is a knight, cute and interesting but still poisonous and dangerous.
Readability priority: silhouette first, pose second, face/weapon/core symbol third, colour fourth, texture last. The subject must still be recognisable as a black shadow with all internal details removed. Use game-character readability principles: defining primary characteristic, clear value pattern, coherent limited palette, rest/detail balance, high contrast at eye/barb/claws, no visual noise.
Style/medium: serious cartoon-gothic dark-fantasy game art; instantly readable black silhouette first; one iconic primary shape, weapon, or pose; chunky hand-inked outer contour; simplified exaggerated proportions; 3-5 large stained-glass colour masses only, with very few thick lead dividers; matte painterly brush texture; restrained cathedral motifs as broad shapes, not filigree; thumbnail-readable at 128px; dramatic and grave, with enemy personality carried by bold proportions and expression; no lacework, no micro-panels, no complex anatomy segmentation, no ornate armour noise, no glossy 3D render, no generic fantasy.
Composition/framing: normal enemy full body, fully inside frame, menacing idle pose, facing slightly left, about 16% clean margin; single complete subject; generous padding; no cropped barb tail; no action blur. Large readable silhouette: oversized cracked shell helmet, one giant squinting eye, tiny shovel claws, raised hooked barb tail, low squat mudbug body.
Lighting/mood: sober swamp-gothic mood; single warm amber rim light defining the silhouette; soft restrained inner glow limited to 1-2 focal panes such as giant swamp-lantern eye and venom barb; high value contrast on the main read; no scattered sparkles, no multi-source glow, no noisy bloom, no haze touching the silhouette.
Palette: murky jade glass, acid green glow, black lead, dull mud brown shell, pale barb tip.
Scene/backdrop: perfectly flat solid #ff00ff chroma-key background only.
Constraints: no ground plane; no floor; no shadows; no reflections; no haze touching the silhouette; no text; no labels; no watermark; do not use #ff00ff in the subject.
```

## Act 2 Batch 1 Review: Drowned One

Status: superseded by approved v2. Kept in scratch as comparison evidence only;
the temporary runtime gallery folder was removed after promotion. The candidate
is the gpt-image-2 source alpha after chroma removal, warm outer-rim cleanup,
and deterministic 1024px transparent framing.

Generated image id:
`ig_0f81a2e65989a619016a4abb50e0948191838913614037e315`

Source:
`enemy-drownedOne/01-gpt-image-2-source.png`

Original source alpha:
`enemy-drownedOne/01-gpt-image-2-source-alpha.png`

Rim-cleaned alpha:
`enemy-drownedOne/04-no-yellow-outline.png`

Selected review candidate:
`enemy-drownedOne/05-gpt-framed.png`

Nano Banana evidence:
`enemy-drownedOne/02-nanobanana-pro-cleaned.jpg`
`enemy-drownedOne/03-alpha.png`
`enemy-drownedOne/06-nanobanana-framed.png`

```text
Use case: stylized-concept
Asset type: Spirebound Act 2 enemy alpha-ready source
Primary request: Drowned One, a soggy drowned bell-ghoul made of black lead, deep sea-teal glass, pale corpse-blue panes, and one sickly green lantern glow. Menacing idle pose, facing slightly left toward the hero. One iconic primary read: a drooping bell-shaped wet hood/head with one round bubble eye, two long dripping claw arms, and a little anchor-stone belly, like a sad soaked troublemaker that can suddenly frenzy.
Readability priority: silhouette first, pose second, face/weapon/core symbol third, colour fourth, texture last. The subject must still be recognisable as a black shadow with all internal details removed. Use game-character readability principles: defining primary characteristic, clear value pattern, coherent limited palette, rest/detail balance, high contrast at eye/anchor belly, no visual noise.
Style/medium: serious cartoon-gothic dark-fantasy game art; instantly readable black silhouette first; one iconic primary shape, weapon, or pose; chunky hand-inked outer contour; simplified exaggerated proportions; 3-5 large stained-glass colour masses only, with very few thick lead dividers; matte painterly brush texture; restrained cathedral motifs as broad shapes, not filigree; thumbnail-readable at 128px; dramatic and grave, with enemy personality carried by bold proportions and expression; no lacework, no micro-panels, no complex anatomy segmentation, no ornate armour noise, no glossy 3D render, no generic fantasy.
Composition/framing: normal enemy full body, fully inside frame, menacing idle pose, facing slightly left, about 12% clean margin; single complete subject; generous padding; no cropped claws; no action blur. Large readable silhouette: drooping bell hood head, one bubble eye, long dripping claws, anchor-stone belly, tiny puddle feet.
Lighting/mood: sober drowned-gothic mood; single warm amber rim light defining the silhouette; soft restrained inner glow limited to 1-2 focal panes such as bubble eye and anchor belly; high value contrast on the main read; no scattered sparkles, no multi-source glow, no noisy bloom, no haze touching the silhouette.
Palette: deep sea teal glass, pale corpse blue, black lead, sickly green glow, dull ivory claws.
Scene/backdrop: perfectly flat solid #ff00ff chroma-key background only.
Constraints: no ground plane; no floor; no shadows; no reflections; no haze touching the silhouette; no text; no labels; no watermark; do not use #ff00ff in the subject.
```

## Act 2 Batch 1 Review: Voltaic Eel

Status: superseded by approved v2. Kept in scratch as comparison evidence only;
the temporary runtime gallery folder was removed after promotion. The candidate
is the gpt-image-2 source alpha after chroma removal, warm outer-rim cleanup,
and deterministic 1024px transparent framing.

Generated image id:
`ig_0f81a2e65989a619016a4abb7851dc81919359a73a4878ba27`

Source:
`enemy-voltEel/01-gpt-image-2-source.png`

Original source alpha:
`enemy-voltEel/01-gpt-image-2-source-alpha.png`

Rim-cleaned alpha:
`enemy-voltEel/04-no-yellow-outline.png`

Selected review candidate:
`enemy-voltEel/05-gpt-framed.png`

Nano Banana evidence:
`enemy-voltEel/02-nanobanana-pro-cleaned.jpg`
`enemy-voltEel/03-alpha.png`
`enemy-voltEel/06-nanobanana-framed.png`

```text
Use case: stylized-concept
Asset type: Spirebound Act 2 enemy alpha-ready source
Primary request: Voltaic Eel, a crackling electric eel enemy made of black lead, electric cyan glass, deep blue shadow panes, and hot yellow lightning core. Menacing idle pose, facing slightly left toward the hero. One iconic primary read: a thick S-shaped eel body curled like a question mark, one tiny angry eye, two short fin-spikes, and a bright lightning-bolt belly stripe, like a smug live wire with fins.
Readability priority: silhouette first, pose second, face/weapon/core symbol third, colour fourth, texture last. The subject must still be recognisable as a black shadow with all internal details removed. Use game-character readability principles: defining primary characteristic, clear value pattern, coherent limited palette, rest/detail balance, high contrast at eye/lightning stripe, no visual noise.
Style/medium: serious cartoon-gothic dark-fantasy game art; instantly readable black silhouette first; one iconic primary shape, weapon, or pose; chunky hand-inked outer contour; simplified exaggerated proportions; 3-5 large stained-glass colour masses only, with very few thick lead dividers; matte painterly brush texture; restrained cathedral motifs as broad shapes, not filigree; thumbnail-readable at 128px; dramatic and grave, with enemy personality carried by bold proportions and expression; no lacework, no micro-panels, no complex anatomy segmentation, no ornate armour noise, no glossy 3D render, no generic fantasy.
Composition/framing: small fast enemy full body, fully inside frame, menacing idle pose, facing slightly left, about 14% clean margin; single complete subject; generous padding; no cropped tail; no action blur. Large readable silhouette: S-curve question-mark eel body, lightning belly stripe, two fin-spikes, tiny angry eye, blunt snout, tail kept inside frame.
Lighting/mood: sober storm-gothic mood; single warm amber rim light defining the silhouette; soft restrained inner glow limited to 1-2 focal panes such as lightning belly stripe and tiny eye; high value contrast on the main read; no scattered sparkles, no multi-source glow, no noisy bloom, no haze touching the silhouette.
Palette: electric cyan glass, hot yellow core, black lead, deep blue shadow, small white spark highlights.
Scene/backdrop: perfectly flat solid #ff00ff chroma-key background only.
Constraints: no ground plane; no floor; no shadows; no reflections; no haze touching the silhouette; no text; no labels; no watermark; do not use #ff00ff in the subject.
```

## Act 2 Batch 1 Review: Mirelurker

Status: superseded by approved v2. Kept in scratch as comparison evidence only;
the temporary runtime gallery folder was removed after promotion. The candidate
is the gpt-image-2 source alpha after chroma removal, warm outer-rim cleanup,
and deterministic 1024px transparent framing.

Generated image id:
`ig_0f81a2e65989a619016a4abba30ebc81918a1a99e947f00f49`

Source:
`enemy-mirelurker/01-gpt-image-2-source.png`

Original source alpha:
`enemy-mirelurker/01-gpt-image-2-source-alpha.png`

Rim-cleaned alpha:
`enemy-mirelurker/04-no-yellow-outline.png`

Selected review candidate:
`enemy-mirelurker/05-gpt-framed.png`

Nano Banana evidence:
`enemy-mirelurker/02-nanobanana-pro-cleaned.jpg`
`enemy-mirelurker/03-alpha.png`
`enemy-mirelurker/06-nanobanana-framed.png`

```text
Use case: stylized-concept
Asset type: Spirebound Act 2 enemy alpha-ready source
Primary request: Mirelurker, a swamp-burrow crawler made of black lead, murky jade glass, acid green panes, and dull mud-brown shell glass. Menacing idle pose, facing slightly left toward the hero. One iconic primary read: a low crab-larva body hunched forward, one oversized venom barb tail raised like a hooked question mark, two tiny shovel claws, and a squinting swamp-lantern eye, like a grumpy mud bug about to sting then burrow.
Readability priority: silhouette first, pose second, face/weapon/core symbol third, colour fourth, texture last. The subject must still be recognisable as a black shadow with all internal details removed. Use game-character readability principles: defining primary characteristic, clear value pattern, coherent limited palette, rest/detail balance, high contrast at eye/barb, no visual noise.
Style/medium: serious cartoon-gothic dark-fantasy game art; instantly readable black silhouette first; one iconic primary shape, weapon, or pose; chunky hand-inked outer contour; simplified exaggerated proportions; 3-5 large stained-glass colour masses only, with very few thick lead dividers; matte painterly brush texture; restrained cathedral motifs as broad shapes, not filigree; thumbnail-readable at 128px; dramatic and grave, with enemy personality carried by bold proportions and expression; no lacework, no micro-panels, no complex anatomy segmentation, no ornate armour noise, no glossy 3D render, no generic fantasy.
Composition/framing: normal enemy full body, fully inside frame, menacing idle pose, facing slightly left, about 14% clean margin; single complete subject; generous padding; no cropped barb tail; no action blur. Large readable silhouette: low oval shell, raised hooked barb tail, two shovel claws, one squinting lantern eye, squat mudbug feet.
Lighting/mood: sober swamp-gothic mood; single warm amber rim light defining the silhouette; soft restrained inner glow limited to 1-2 focal panes such as swamp-lantern eye and venom barb; high value contrast on the main read; no scattered sparkles, no multi-source glow, no noisy bloom, no haze touching the silhouette.
Palette: murky jade glass, acid green glow, black lead, dull mud brown shell, pale barb tip.
Scene/backdrop: perfectly flat solid #ff00ff chroma-key background only.
Constraints: no ground plane; no floor; no shadows; no reflections; no haze touching the silhouette; no text; no labels; no watermark; do not use #ff00ff in the subject.
```

## Approved Hero: Duskblade

Status: approved. Current baseline uses the Nano Banana alpha version. The GPT
source alpha was recovered and rim-cleaned, but it is evidence only for this
asset.

Generated image id:
`ig_0e1b54eba4f9aa1d016a4a9313e9808191a74dd9525cbed639`

Source:
`hero-duskblade/01-gpt-image-2-source.png`

Original source alpha:
`hero-duskblade/01-gpt-image-2-source-alpha.png`

Non-baseline GPT-clean alpha evidence:
`hero-duskblade/04-no-yellow-outline.png`

```text
Use case: stylized-concept
Asset type: Spirebound hero alpha-ready source
Primary request: The Duskblade, a hooded glass knight hero with one iconic crescent blade and a small lantern-core in the chest, calm grave idle pose, facing slightly right, designed for a browser roguelite deckbuilder character sprite.
Readability priority: silhouette first, pose second, face/weapon/core symbol third, colour fourth, texture last. The subject must still be recognisable as a black shadow with all internal details removed.
Style/medium: serious cartoon-gothic dark-fantasy game art; instantly readable black silhouette first; one iconic primary shape, weapon, or pose; chunky hand-inked outer contour; simplified exaggerated proportions; 3-5 large stained-glass colour masses only, with very few thick lead dividers; matte painterly brush texture; restrained cathedral motifs as broad shapes, not filigree; thumbnail-readable at 128px; dramatic and grave, not cute or comedic; no lacework, no micro-panels, no complex anatomy segmentation, no ornate armour noise, no glossy 3D render, no generic fantasy.
Composition/framing: full body, calm idle pose, facing slightly right, feet grounded, about 10% margin; single complete subject; generous padding; no cropped limbs; no action blur.
Lighting/mood: sober gothic mood; single warm amber rim light defining the silhouette; soft restrained inner glow limited to 1-2 focal panes such as face, chest, weapon, or core symbol; high value contrast on the main read; no scattered sparkles, no multi-source glow, no noisy bloom, no haze touching the silhouette.
Scene/backdrop: perfectly flat solid #ff00ff chroma-key background only.
Constraints: no ground plane; no floor; no shadows; no reflections; no haze touching the silhouette; no text; no labels; no watermark; do not use #ff00ff in the subject.
```

## Enemy Batch 2 V3 Approved: Alpha Duskfang

Status: approved. Promoted to `src/assets-readable-baseline/enemies/alphaFang.png`.
The selected file is the gpt-image-2 source alpha after warm outer-rim cleanup
and deterministic 1024px transparent framing. This retry keeps the mouth small
and shifts the primary read to the crown-mane and spiked alpha collar.

Generated image id:
`ig_09dde500110270a3016a4ab7fbe4cc819190a203082a420cb9`

Source:
`enemy-alphaFang-v3/01-gpt-image-2-source.png`

Original source alpha:
`enemy-alphaFang-v3/01-gpt-image-2-source-alpha.png`

Rim-cleaned alpha:
`enemy-alphaFang-v3/04-no-yellow-outline.png`

Selected review candidate:
`enemy-alphaFang-v3/05-gpt-framed.png`

Nano Banana evidence:
`enemy-alphaFang-v3/02-nanobanana-pro-cleaned.jpg`
`enemy-alphaFang-v3/03-alpha.png`
`enemy-alphaFang-v3/06-nanobanana-framed.png`

```text
Use case: stylized-concept
Asset type: Spirebound elite enemy alpha-ready source
Primary request: Alpha Duskfang, an elite pack-boss dusk beast made of black lead, hot crimson glass, bone fang panes, and sharp violet shadow masses. Menacing idle pose, facing slightly left toward the hero. One iconic primary read: a tall three-spike red glass howl-crown mane and a heavy spiked alpha collar around the shoulders, with one narrow amber eye slit, oversized front paws, and a small closed jagged snarl. It should feel stronger than normal Duskfang: a smug dangerous pack leader puffing itself up, funny in attitude but still threatening. Keep the mouth small and closed; no huge open mouth, no crescent maw, no detached teeth, no screaming jaw.
Readability priority: silhouette first, pose second, face/weapon/core symbol third, colour fourth, texture last. The subject must still be recognisable as a black shadow with all internal details removed. Use game-character readability principles: defining primary characteristic, clear value pattern, coherent limited palette, rest/detail balance, high contrast at eye/crown/collar, no visual noise.
Style/medium: serious cartoon-gothic dark-fantasy game art; instantly readable black silhouette first; one iconic primary shape, weapon, or pose; chunky hand-inked outer contour; simplified exaggerated proportions; 3-5 large stained-glass colour masses only, with very few thick lead dividers; matte painterly brush texture; restrained cathedral motifs as broad shapes, not filigree; thumbnail-readable at 128px; dramatic and grave, with enemy personality carried by bold proportions and expression; no lacework, no micro-panels, no complex anatomy segmentation, no ornate armour noise, no glossy 3D render, no generic fantasy.
Composition/framing: elite-size full body, larger than a normal enemy but fully inside frame, menacing idle pose, facing slightly left, about 12% clean margin; single complete subject; generous padding; no cropped limbs; no action blur. Large readable silhouette: three-spike howl-crown mane, spiked shoulder collar, oversized paws, low beast stance, small closed snarl, tail kept inside frame.
Lighting/mood: sober gothic mood; single warm amber rim light defining the silhouette; soft restrained inner glow limited to 1-2 focal panes such as eye slit and collar core; high value contrast on the main read; no scattered sparkles, no multi-source glow, no noisy bloom, no haze touching the silhouette.
Palette: hot crimson glass, black lead, bright amber eye, bone fang/collar panes, deep violet shadow.
Scene/backdrop: perfectly flat solid #ff00ff chroma-key background only.
Constraints: no ground plane; no floor; no shadows; no reflections; no haze touching the silhouette; no text; no labels; no watermark; do not use #ff00ff in the subject.
```

## Enemy Batch 2 V4 Unused Evidence: Alpha Duskfang

Status: unused evidence. Generated while exploring a smaller mouth and
crown/collar primary read, but council selected v3.

Generated image id:
`ig_09dde500110270a3016a4ab885952481918b5329b0045314dc`

Source:
`enemy-alphaFang-v4/01-gpt-image-2-source.png`

Original source alpha:
`enemy-alphaFang-v4/01-gpt-image-2-source-alpha.png`

Rim-cleaned alpha:
`enemy-alphaFang-v4/04-no-yellow-outline.png`

Framed candidate:
`enemy-alphaFang-v4/05-gpt-framed.png`

```text
Use case: stylized-concept
Asset type: Spirebound elite enemy alpha-ready source
Primary request: Alpha Duskfang, an elite stained-glass dusk beast, menacing idle pose, facing slightly left toward the hero. One iconic primary read: a chunky three-point crimson glass crown-mane rising from the back, a big round spiked bone collar around a glowing amber throat-core, one narrow amber eye, oversized front paws, and a small closed sly grin under a short snout. It should be a funny smug pack boss, bigger and stronger than normal Duskfang, but still a readable monster token rather than a heroic creature. Keep the mouth tiny and closed; the collar and crown-mane are the main shapes, not the teeth.
Readability priority: silhouette first, pose second, face/weapon/core symbol third, colour fourth, texture last. The subject must still be recognisable as a black shadow with all internal details removed. Use game-character readability principles: defining primary characteristic, clear value pattern, coherent limited palette, rest/detail balance, high contrast at eye/collar core/crown, no visual noise.
Style/medium: serious cartoon-gothic dark-fantasy game art; instantly readable black silhouette first; one iconic primary shape, weapon, or pose; chunky hand-inked outer contour; simplified exaggerated proportions; 3-5 large stained-glass colour masses only, with very few thick lead dividers; matte painterly brush texture; restrained cathedral motifs as broad shapes, not filigree; thumbnail-readable at 128px; dramatic and grave, with enemy personality carried by bold proportions and expression; no lacework, no micro-panels, no complex anatomy segmentation, no ornate armour noise, no glossy 3D render, no generic fantasy.
Composition/framing: elite-size full body, larger than a normal enemy but fully inside frame, menacing idle pose, facing slightly left, about 12% clean margin; single complete subject; generous padding; no cropped limbs; no action blur. Large readable silhouette: three-point crown-mane, circular spiked collar, oversized paws, compact low beast stance, tiny closed grin, tail kept inside frame.
Lighting/mood: sober gothic mood; single warm amber rim light defining the silhouette; soft restrained inner glow limited to 1-2 focal panes such as eye slit and collar core; high value contrast on the main read; no scattered sparkles, no multi-source glow, no noisy bloom, no haze touching the silhouette.
Palette: hot crimson glass, black lead, bright amber eye and collar core, bone collar panes, deep violet shadow.
Scene/backdrop: perfectly flat solid #ff00ff chroma-key background only.
Constraints: no ground plane; no floor; no shadows; no reflections; no haze touching the silhouette; no text; no labels; no watermark; do not use #ff00ff in the subject.
```

## Enemy Batch 2 V2 Approved: Gravewarden

Status: approved. Promoted to `src/assets-readable-baseline/enemies/gravewarden.png`.
The selected file is the gpt-image-2 source alpha after warm outer-rim cleanup
and deterministic 1024px transparent framing.

Generated image id:
`ig_0a38f271d4399ea3016a4ab562e244819585c0ae78f53c4233`

Source:
`enemy-gravewarden-v2/01-gpt-image-2-source.png`

Original source alpha:
`enemy-gravewarden-v2/01-gpt-image-2-source-alpha.png`

Rim-cleaned alpha:
`enemy-gravewarden-v2/04-no-yellow-outline.png`

Selected review candidate:
`enemy-gravewarden-v2/05-gpt-framed.png`

Nano Banana evidence:
`enemy-gravewarden-v2/02-nanobanana-pro-cleaned.jpg`
`enemy-gravewarden-v2/03-alpha.png`
`enemy-gravewarden-v2/06-nanobanana-framed.png`

```text
Use case: stylized-concept
Asset type: Spirebound elite enemy alpha-ready source
Primary request: Gravewarden, an elite walking cemetery-gate monster made of black lead, cold cobalt glass, bone-white tombstone panes, and a sharp amber grave-lamp glow. Menacing idle pose, facing slightly left toward the hero. One iconic primary read: a huge arched tomb-bell torso like a cemetery gate, one tiny angry lantern eye under the arch, two oversized gravestone fists, and squat stomp feet. It should feel stronger than normal enemies: a grumpy tomb doorman who can entomb you, heavy and funny but dangerous.
Readability priority: silhouette first, pose second, face/weapon/core symbol third, colour fourth, texture last. The subject must still be recognisable as a black shadow with all internal details removed. Use game-character readability principles: defining primary characteristic, clear value pattern, coherent limited palette, rest/detail balance, high contrast at eye/core, no visual noise.
Style/medium: serious cartoon-gothic dark-fantasy game art; instantly readable black silhouette first; one iconic primary shape, weapon, or pose; chunky hand-inked outer contour; simplified exaggerated proportions; 3-5 large stained-glass colour masses only, with very few thick lead dividers; matte painterly brush texture; restrained cathedral motifs as broad shapes, not filigree; thumbnail-readable at 128px; dramatic and grave, with enemy personality carried by bold proportions and expression; no lacework, no micro-panels, no complex anatomy segmentation, no ornate armour noise, no glossy 3D render, no generic fantasy.
Composition/framing: elite-size full body, larger than a normal enemy but fully inside frame, menacing idle pose, facing slightly left, about 12% clean margin; single complete subject; generous padding; no cropped limbs; no action blur. Large readable silhouette: tomb-bell arch body, one lantern eye, two gravestone fists, squat stomp feet.
Lighting/mood: sober gothic mood; single warm amber rim light defining the silhouette; soft restrained inner glow limited to 1-2 focal panes such as lantern eye and tomb-bell crack; high value contrast on the main read; no scattered sparkles, no multi-source glow, no noisy bloom, no haze touching the silhouette.
Palette: cold cobalt blue glass, bone-white tombstone glass, black lead, saturated amber eye/core, small moss-green cracks.
Scene/backdrop: perfectly flat solid #ff00ff chroma-key background only.
Constraints: no ground plane; no floor; no shadows; no reflections; no haze touching the silhouette; no text; no labels; no watermark; do not use #ff00ff in the subject.
```

## Enemy Batch 2 V2 Rejected: Alpha Duskfang

Status: rejected. Council approved the stronger elite direction but rejected the
mouth because it read like a generation failure. Keep as evidence only; the next
retry should avoid a huge open crescent maw as the primary shape.

Generated image id:
`ig_0a38f271d4399ea3016a4ab5a0322481958f63660861433a93`

Source:
`enemy-alphaFang-v2/01-gpt-image-2-source.png`

Original source alpha:
`enemy-alphaFang-v2/01-gpt-image-2-source-alpha.png`

Rim-cleaned alpha:
`enemy-alphaFang-v2/04-no-yellow-outline.png`

Selected review candidate:
`enemy-alphaFang-v2/05-gpt-framed.png`

Nano Banana evidence:
`enemy-alphaFang-v2/02-nanobanana-pro-cleaned.jpg`
`enemy-alphaFang-v2/03-alpha.png`
`enemy-alphaFang-v2/06-nanobanana-framed.png`

```text
Use case: stylized-concept
Asset type: Spirebound elite enemy alpha-ready source
Primary request: Alpha Duskfang, an elite pack-boss dusk beast made of black lead, hot crimson glass, bone fang panes, and sharp violet shadow masses. Menacing idle pose, facing slightly left toward the hero. One iconic primary read: a huge glowing crescent maw and a three-spike red glass howl-crown mane, with oversized front paws and a cocky raised chest, like a smug dangerous pack leader trying to look twice as big as the normal Duskfang.
Readability priority: silhouette first, pose second, face/weapon/core symbol third, colour fourth, texture last. The subject must still be recognisable as a black shadow with all internal details removed. Use game-character readability principles: defining primary characteristic, clear value pattern, coherent limited palette, rest/detail balance, high contrast at maw/eye, no visual noise.
Style/medium: serious cartoon-gothic dark-fantasy game art; instantly readable black silhouette first; one iconic primary shape, weapon, or pose; chunky hand-inked outer contour; simplified exaggerated proportions; 3-5 large stained-glass colour masses only, with very few thick lead dividers; matte painterly brush texture; restrained cathedral motifs as broad shapes, not filigree; thumbnail-readable at 128px; dramatic and grave, with enemy personality carried by bold proportions and expression; no lacework, no micro-panels, no complex anatomy segmentation, no ornate armour noise, no glossy 3D render, no generic fantasy.
Composition/framing: elite-size full body, larger than a normal enemy but fully inside frame, menacing idle pose, facing slightly left, about 12% clean margin; single complete subject; generous padding; no cropped limbs; no action blur. Large readable silhouette: crescent maw, three-spike howl-crown mane, oversized paws, low beast stance, raised chest, tail kept inside frame.
Lighting/mood: sober gothic mood; single warm amber rim light defining the silhouette; soft restrained inner glow limited to 1-2 focal panes such as crescent maw and eye slit; high value contrast on the main read; no scattered sparkles, no multi-source glow, no noisy bloom, no haze touching the silhouette.
Palette: hot crimson glass, black lead, bright amber maw, bone fang panes, deep violet shadow.
Scene/backdrop: perfectly flat solid #ff00ff chroma-key background only.
Constraints: no ground plane; no floor; no shadows; no reflections; no haze touching the silhouette; no text; no labels; no watermark; do not use #ff00ff in the subject.
```

## Enemy Batch 2 V2 Approved: Rootheart

Status: approved. Promoted to `src/assets-readable-baseline/enemies/rootheart.png`.
The selected file is the gpt-image-2 source alpha after warm outer-rim cleanup
and deterministic 1024px transparent framing.

Generated image id:
`ig_0a38f271d4399ea3016a4ab5de9c548195bb3c89ed4a611e7f`

Source:
`enemy-rootheart-v2/01-gpt-image-2-source.png`

Original source alpha:
`enemy-rootheart-v2/01-gpt-image-2-source-alpha.png`

Rim-cleaned alpha:
`enemy-rootheart-v2/04-no-yellow-outline.png`

Selected review candidate:
`enemy-rootheart-v2/05-gpt-framed.png`

Nano Banana evidence:
`enemy-rootheart-v2/02-nanobanana-pro-cleaned.jpg`
`enemy-rootheart-v2/03-alpha.png`
`enemy-rootheart-v2/06-nanobanana-framed.png`

```text
Use case: stylized-concept
Asset type: Spirebound Act 1 boss enemy alpha-ready source
Primary request: The Rootheart, the first act boss, a giant living heart-tree shrine made of black lead, saturated emerald glass, hot amber sap, and dark root-brown panes. Menacing idle pose, facing slightly left toward the hero. One iconic primary read: a massive glowing heart-shaped trunk as the whole torso, a huge amber weak-point heart window, two chunky root arms like grabbing hooks, and a crooked crown of branch-antlers. It must feel boss-sized, stronger than elites, unique and memorable: an ancient forest boss with a dramatic exposed heart, angry old-tree face, and weirdly theatrical grumpy personality.
Readability priority: silhouette first, pose second, face/weapon/core symbol third, colour fourth, texture last. The subject must still be recognisable as a black shadow with all internal details removed. Use game-character readability principles: defining primary characteristic, clear value pattern, coherent limited palette, rest/detail balance, high contrast at heart/core, no visual noise.
Style/medium: serious cartoon-gothic dark-fantasy game art; instantly readable black silhouette first; one iconic primary shape, weapon, or pose; chunky hand-inked outer contour; simplified exaggerated proportions; 3-5 large stained-glass colour masses only, with very few thick lead dividers; matte painterly brush texture; restrained cathedral motifs as broad shapes, not filigree; thumbnail-readable at 128px; dramatic and grave, with enemy personality carried by bold proportions and expression; no lacework, no micro-panels, no complex anatomy segmentation, no ornate armour noise, no glossy 3D render, no generic fantasy.
Composition/framing: boss-size full body, clearly larger than elites but fully inside frame, menacing idle pose, facing slightly left, about 10% clean margin; single complete subject; generous padding; no cropped branch tips; no cropped limbs; no action blur. Huge readable silhouette: heart-shaped trunk torso, glowing heart window, two root-hook arms, three crooked branch-antlers, squat root base.
Lighting/mood: sober gothic mood; single warm amber rim light defining the silhouette; strong controlled inner glow limited to 1-2 focal panes such as the huge heart window and one angry eye slit; high value contrast on the main read; no scattered sparkles, no multi-source glow, no noisy bloom, no haze touching the silhouette.
Palette: saturated emerald glass, hot amber-orange sap heart, black lead, dark root-brown glass, sharp ivory bark highlights.
Scene/backdrop: perfectly flat solid #ff00ff chroma-key background only.
Constraints: no ground plane; no floor; no shadows; no reflections; no haze touching the silhouette; no text; no labels; no watermark; do not use #ff00ff in the subject.
```

## Approved Hero: Ashwarden

Status: approved. GPT source alpha recovered, rim-cleaned, and promoted to the
current `readable-baseline` baseline set.

Generated image id:
`ig_0ed675c899fbe41e016a4a9a8e5ba08191afa2de521a26239f`

Source:
`hero-ashwarden/01-gpt-image-2-source.png`

Original source alpha:
`hero-ashwarden/01-gpt-image-2-source-alpha.png`

Selected GPT-clean alpha candidate:
`hero-ashwarden/04-no-yellow-outline.png`

```text
Use case: stylized-concept
Asset type: Spirebound hero alpha-ready source
Primary request: The Ashwarden, a smoke-and-ash guardian hero, heavy calm idle pose, facing slightly right. One iconic primary read: a tall ember censer-maul held low in one hand, with a broad ash-cloak shaped like a furnace door and a glowing coal-heart in the chest. The character should feel slow, durable, priestly, and dangerous, like smoke given armour.
Readability priority: silhouette first, pose second, face/weapon/core symbol third, colour fourth, texture last. The subject must still be recognisable as a black shadow with all internal details removed. Use game-character readability principles: defining primary characteristic, clear value pattern, coherent limited palette, rest/detail balance, high contrast near chest/weapon, no visual noise.
Style/medium: serious cartoon-gothic dark-fantasy game art; instantly readable black silhouette first; one iconic primary shape, weapon, or pose; chunky hand-inked outer contour; simplified exaggerated proportions; 3-5 large stained-glass colour masses only, with very few thick lead dividers; matte painterly brush texture; restrained cathedral motifs as broad shapes, not filigree; thumbnail-readable at 128px; dramatic and grave, not cute or comedic; no lacework, no micro-panels, no complex anatomy segmentation, no ornate armour noise, no glossy 3D render, no generic fantasy.
Composition/framing: full body, calm idle pose, facing slightly right, feet grounded, about 10% margin; single complete subject; generous padding; no cropped limbs; no action blur. Big triangular hood, barrel chest, furnace-door cloak, oversized censer-maul silhouette.
Lighting/mood: sober gothic mood; single warm ember-amber rim light defining the silhouette; soft restrained inner glow limited to 1-2 focal panes such as coal-heart and censer head; high value contrast on the main read; no scattered sparkles, no multi-source glow, no noisy bloom, no haze touching the silhouette.
Palette: charcoal black, ash grey, ember orange, muted brass, one dull smoke-blue shadow mass.
Scene/backdrop: perfectly flat solid #ff00ff chroma-key background only.
Constraints: no ground plane; no floor; no shadows; no reflections; no haze touching the silhouette; no text; no labels; no watermark; do not use #ff00ff in the subject.
```

## Approved Enemy: Duskfang

Status: approved. GPT source alpha recovered, rim-cleaned, and promoted to the
current `readable-baseline` baseline set.

Generated image id:
`ig_0e1b54eba4f9aa1d016a4a93492bdc8191954b513dfb774a88`

Source:
`enemy-duskfang/01-gpt-image-2-source.png`

Original source alpha:
`enemy-duskfang/01-gpt-image-2-source-alpha.png`

Selected GPT-clean alpha candidate:
`enemy-duskfang/04-no-yellow-outline.png`

```text
Use case: stylized-concept
Asset type: Spirebound enemy alpha-ready source
Primary request: Duskfang, a prowling wolf-like dusk beast made of black lead and amber-red glass, with one iconic crescent maw, hunched shoulders, blade-like hackles, and glowing eye slit; menacing idle pose, facing slightly left toward the hero, designed for a browser roguelite deckbuilder enemy sprite.
Readability priority: silhouette first, pose second, face/weapon/core symbol third, colour fourth, texture last. The subject must still be recognisable as a black shadow with all internal details removed.
Style/medium: serious cartoon-gothic dark-fantasy game art; instantly readable black silhouette first; one iconic primary shape, weapon, or pose; chunky hand-inked outer contour; simplified exaggerated proportions; 3-5 large stained-glass colour masses only, with very few thick lead dividers; matte painterly brush texture; restrained cathedral motifs as broad shapes, not filigree; thumbnail-readable at 128px; dramatic and grave, not cute or comedic; no lacework, no micro-panels, no complex anatomy segmentation, no ornate armour noise, no glossy 3D render, no generic fantasy.
Composition/framing: full body, menacing idle pose, facing slightly left, about 10% margin; single complete subject; generous padding; no cropped limbs; no action blur.
Lighting/mood: sober gothic mood; single warm amber rim light defining the silhouette; soft restrained inner glow limited to 1-2 focal panes such as eye, maw, chest, or core symbol; high value contrast on the main read; no scattered sparkles, no multi-source glow, no noisy bloom, no haze touching the silhouette.
Scene/backdrop: perfectly flat solid #ff00ff chroma-key background only.
Constraints: no ground plane; no floor; no shadows; no reflections; no haze touching the silhouette; no text; no labels; no watermark; do not use #ff00ff in the subject.
```

## Approved Enemy: Sporeling

Status: approved. GPT source alpha recovered, rim-cleaned, and promoted to the
current `readable-baseline` baseline set.

Generated image id:
`ig_0ed675c899fbe41e016a4a9ad0a8c481918b70c515edf51722`

Source:
`enemy-sporeling/01-gpt-image-2-source.png`

Original source alpha:
`enemy-sporeling/01-gpt-image-2-source-alpha.png`

Selected GPT-clean alpha candidate:
`enemy-sporeling/04-no-yellow-outline.png`

```text
Use case: stylized-concept
Asset type: Spirebound enemy alpha-ready source
Primary request: Sporeling, a tiny floating fungal glass creature, menacing idle pose, facing slightly left toward the hero. One iconic primary read: an oversized umbrella-cap mushroom silhouette with a single glowing eye under the cap and two dangling root legs, like a poisonous little lantern-spore.
Readability priority: silhouette first, pose second, face/weapon/core symbol third, colour fourth, texture last. The subject must still be recognisable as a black shadow with all internal details removed. Use game-character readability principles: defining primary characteristic, clear value pattern, coherent limited palette, rest/detail balance, high contrast at eye/core, no visual noise.
Style/medium: serious cartoon-gothic dark-fantasy game art; instantly readable black silhouette first; one iconic primary shape, weapon, or pose; chunky hand-inked outer contour; simplified exaggerated proportions; 3-5 large stained-glass colour masses only, with very few thick lead dividers; matte painterly brush texture; restrained cathedral motifs as broad shapes, not filigree; thumbnail-readable at 128px; dramatic and grave, not cute or comedic; no lacework, no micro-panels, no complex anatomy segmentation, no ornate armour noise, no glossy 3D render, no generic fantasy.
Composition/framing: full body, menacing idle pose, facing slightly left, about 10% margin; single complete subject; generous padding; no cropped limbs; no action blur. Small creature but large readable silhouette: broad cap, one eye, tiny body, two root legs, one spore sac.
Lighting/mood: sober gothic mood; single warm amber rim light defining the silhouette; soft restrained inner glow limited to 1-2 focal panes such as eye and spore sac; high value contrast on the main read; no scattered sparkles, no multi-source glow, no noisy bloom, no haze touching the silhouette.
Palette: poisonous moss green, dull yellow glass eye, black lead, muted ivory stem, small amber core.
Scene/backdrop: perfectly flat solid #ff00ff chroma-key background only.
Constraints: no ground plane; no floor; no shadows; no reflections; no haze touching the silhouette; no text; no labels; no watermark; do not use #ff00ff in the subject.
```

## Approved Enemy: Gloomslime

Status: approved. GPT source alpha recovered, rim-cleaned, and promoted to the
current `readable-baseline` baseline set.

Generated image id:
`ig_0ed675c899fbe41e016a4a9af91abc81918725dba1d939c08d`

Source:
`enemy-gloomslime/01-gpt-image-2-source.png`

Original source alpha:
`enemy-gloomslime/01-gpt-image-2-source-alpha.png`

Selected GPT-clean alpha candidate:
`enemy-gloomslime/04-no-yellow-outline.png`

```text
Use case: stylized-concept
Asset type: Spirebound enemy alpha-ready source
Primary request: Gloomslime, a heavy glass ooze monster, menacing idle pose, facing slightly left toward the hero. One iconic primary read: a squat bell-shaped slime body with a huge crescent mouth cut through the front, one drooping crown-horn, and two stubby dripping arms. It should read as slow, sticky, corrosive, and gloomy.
Readability priority: silhouette first, pose second, face/weapon/core symbol third, colour fourth, texture last. The subject must still be recognisable as a black shadow with all internal details removed. Use game-character readability principles: defining primary characteristic, clear value pattern, coherent limited palette, rest/detail balance, high contrast at mouth/core, no visual noise.
Style/medium: serious cartoon-gothic dark-fantasy game art; instantly readable black silhouette first; one iconic primary shape, weapon, or pose; chunky hand-inked outer contour; simplified exaggerated proportions; 3-5 large stained-glass colour masses only, with very few thick lead dividers; matte painterly brush texture; restrained cathedral motifs as broad shapes, not filigree; thumbnail-readable at 128px; dramatic and grave, not cute or comedic; no lacework, no micro-panels, no complex anatomy segmentation, no ornate armour noise, no glossy 3D render, no generic fantasy.
Composition/framing: full body, menacing idle pose, facing slightly left, about 10% margin; single complete subject; generous padding; no cropped limbs; no action blur. Big squat bell silhouette, crescent mouth, one crown-horn, dripping arms, heavy base.
Lighting/mood: sober gothic mood; single warm amber rim light defining the silhouette; soft restrained inner glow limited to 1-2 focal panes such as mouth and central ooze core; high value contrast on the main read; no scattered sparkles, no multi-source glow, no noisy bloom, no haze touching the silhouette.
Palette: deep teal green, black lead, sickly yellow-green glow, smoky blue shadow, small amber rim accents.
Scene/backdrop: perfectly flat solid #ff00ff chroma-key background only.
Constraints: no ground plane; no floor; no shadows; no reflections; no haze touching the silhouette; no text; no labels; no watermark; do not use #ff00ff in the subject.
```

## Rejected V3 Enemy Attempt

Status: rejected for style drift. Sources are kept only as evidence.

- `enemy-waylayer-v3/01-gpt-image-2-source.png`
- `enemy-thornling-v3/01-gpt-image-2-source.png`
- `enemy-ashAcolyte-v3/01-gpt-image-2-source.png`

These prompts fixed left-facing direction and enemy personality, but they added
too many non-style clauses. For the next attempt, keep the successful approved
enemy prompt shape and change only the primary request, composition detail, and
palette.

## Enemy Retry V4: Waylayer

Status: approved after outer-rim cleanup. Preferred candidate is the gpt-image-2
source alpha with the warm yellow outline muted to dark lead, because the Nano
Banana clean-up drifted toward cloth-and-skin fantasy rendering.

Generated image id:
`ig_0c344c47d0e29018016a4aa83b6e5481949056292e77d28067`

Source:
`enemy-waylayer-v4/01-gpt-image-2-source.png`

Original source alpha:
`enemy-waylayer-v4/01-gpt-image-2-source-alpha.png`

Selected alpha candidate:
`enemy-waylayer-v4/04-no-yellow-outline.png`

Alternate clean-up alpha:
`enemy-waylayer-v4/03-alpha.png`

```text
Use case: stylized-concept
Asset type: Spirebound enemy alpha-ready source
Primary request: Waylayer, a squat goblin-like roadside ambusher made of black lead and smoky red glass, menacing idle pose, facing slightly left toward the hero. One iconic primary read: an oversized hooked dagger held low in both hands, a crooked sack-hood with one glowing eye, and tiny wide-set feet, like a mischievous dirty-trick bandit from a stained-glass road shrine.
Readability priority: silhouette first, pose second, face/weapon/core symbol third, colour fourth, texture last. The subject must still be recognisable as a black shadow with all internal details removed. Use game-character readability principles: defining primary characteristic, clear value pattern, coherent limited palette, rest/detail balance, high contrast at eye/weapon, no visual noise.
Style/medium: serious cartoon-gothic dark-fantasy game art; instantly readable black silhouette first; one iconic primary shape, weapon, or pose; chunky hand-inked outer contour; simplified exaggerated proportions; 3-5 large stained-glass colour masses only, with very few thick lead dividers; matte painterly brush texture; restrained cathedral motifs as broad shapes, not filigree; thumbnail-readable at 128px; dramatic and grave, with compact mischievous enemy personality; no lacework, no micro-panels, no complex anatomy segmentation, no ornate armour noise, no glossy 3D render, no generic fantasy.
Composition/framing: full body, menacing idle pose, facing slightly left, centred with about 12% clean margin; single complete subject; generous padding; no cropped limbs; no action blur. Small enemy but large readable silhouette: hooked dagger, one eye, sack hood, crouched feet, low ambush posture.
Lighting/mood: sober gothic mood; single warm amber rim light defining the silhouette; soft restrained inner glow limited to 1-2 focal panes such as eye and dagger notch; high value contrast on the main read; no scattered sparkles, no multi-source glow, no noisy bloom, no haze touching the silhouette.
Palette: smoky crimson glass, black lead, dull leather brown, small amber eye, muted bone dagger edge.
Scene/backdrop: perfectly flat solid #ff00ff chroma-key background only.
Constraints: no ground plane; no floor; no shadows; no reflections; no haze touching the silhouette; no text; no labels; no watermark; do not use #ff00ff in the subject.
```

## Enemy Retry V4: Thornling

Status: approved after outer-rim cleanup. Preferred candidate is the gpt-image-2
source alpha with the warm yellow outline muted to dark lead. The left-facing
instruction produced a mostly frontal read, but the silhouette, glass masses, and
enemy personality are close to the approved first-three enemy direction.

Generated image id:
`ig_04d58434874e193b016a4aa8fb58a481919bff9ac786fe202b`

Source:
`enemy-thornling-v4/01-gpt-image-2-source.png`

Original source alpha:
`enemy-thornling-v4/01-gpt-image-2-source-alpha.png`

Selected alpha candidate:
`enemy-thornling-v4/04-no-yellow-outline.png`

Alternate clean-up alpha:
`enemy-thornling-v4/03-alpha.png`

```text
Use case: stylized-concept
Asset type: Spirebound enemy alpha-ready source
Primary request: Thornling, a small bramble sprout monster made of black lead, thorn-green glass, and dull amber sap panes, menacing idle pose, facing slightly left toward the hero. One iconic primary read: a round spiked seedpod body like a tiny mace, two crooked thorn-antlers, a squinting glowing face, and stubby root feet planted in a puffed-up angry stance, like a funny little burr trying to be terrifying.
Readability priority: silhouette first, pose second, face/weapon/core symbol third, colour fourth, texture last. The subject must still be recognisable as a black shadow with all internal details removed. Use game-character readability principles: defining primary characteristic, clear value pattern, coherent limited palette, rest/detail balance, high contrast at face/thorns, no visual noise.
Style/medium: serious cartoon-gothic dark-fantasy game art; instantly readable black silhouette first; one iconic primary shape, weapon, or pose; chunky hand-inked outer contour; simplified exaggerated proportions; 3-5 large stained-glass colour masses only, with very few thick lead dividers; matte painterly brush texture; restrained cathedral motifs as broad shapes, not filigree; thumbnail-readable at 128px; dramatic and grave, with compact mischievous enemy personality; no lacework, no micro-panels, no complex anatomy segmentation, no ornate armour noise, no glossy 3D render, no generic fantasy.
Composition/framing: full body, menacing idle pose, facing slightly left, centred with about 12% clean margin; single complete subject; generous padding; no cropped limbs; no action blur. Small creature but large readable silhouette: round thornball body, two thorn-antlers, squint face, stubby root feet, bristling outline.
Lighting/mood: sober gothic mood; single warm amber rim light defining the silhouette; soft restrained inner glow limited to 1-2 focal panes such as face and sap core; high value contrast on the main read; no scattered sparkles, no multi-source glow, no noisy bloom, no haze touching the silhouette.
Palette: dark thorn green glass, black lead, dull amber sap, muted moss shadow, tiny ivory thorn tips.
Scene/backdrop: perfectly flat solid #ff00ff chroma-key background only.
Constraints: no ground plane; no floor; no shadows; no reflections; no haze touching the silhouette; no text; no labels; no watermark; do not use #ff00ff in the subject.
```

## Enemy Retry V4: Ash Acolyte

Status: approved after outer-rim cleanup. Preferred candidate is the gpt-image-2
source alpha with the warm yellow outline muted to dark lead. The Nano Banana
clean-up alpha is kept as evidence only because it left an opaque black rectangle
after background removal.

Generated image id:
`ig_05e0b87299f2bdee016a4aa9ba05dc8191b15245070e74335c`

Source:
`enemy-ashAcolyte-v4/01-gpt-image-2-source.png`

Original source alpha:
`enemy-ashAcolyte-v4/01-gpt-image-2-source-alpha.png`

Selected alpha candidate:
`enemy-ashAcolyte-v4/04-no-yellow-outline.png`

Rejected clean-up alpha:
`enemy-ashAcolyte-v4/03-alpha.png`

```text
Use case: stylized-concept
Asset type: Spirebound enemy alpha-ready source
Primary request: Ash Acolyte, a squat ash-imp acolyte made of black lead, charcoal glass, and ember-orange panes, menacing idle pose, facing slightly left toward the hero. One iconic primary read: an oversized melted candle-mask head with two soft wax horns, a tiny soot-black body, and a little coal bowl clutched at the belly, like a bashful ritual troublemaker who is still dangerous.
Readability priority: silhouette first, pose second, face/weapon/core symbol third, colour fourth, texture last. The subject must still be recognisable as a black shadow with all internal details removed. Use game-character readability principles: defining primary characteristic, clear value pattern, coherent limited palette, rest/detail balance, high contrast at mask/coal bowl, no visual noise.
Style/medium: serious cartoon-gothic dark-fantasy game art; instantly readable black silhouette first; one iconic primary shape, weapon, or pose; chunky hand-inked outer contour; simplified exaggerated proportions; 3-5 large stained-glass colour masses only, with very few thick lead dividers; matte painterly brush texture; restrained cathedral motifs as broad shapes, not filigree; thumbnail-readable at 128px; dramatic and grave, with compact mischievous enemy personality; no lacework, no micro-panels, no complex anatomy segmentation, no ornate armour noise, no glossy 3D render, no generic fantasy.
Composition/framing: full body, menacing idle pose, facing slightly left, centred with about 12% clean margin; single complete subject; generous padding; no cropped limbs; no action blur. Small enemy but large readable silhouette: candle-mask head, wax horns, coal bowl, tiny hunched body, stubby feet, left-facing ritual posture.
Lighting/mood: sober gothic mood; single warm amber rim light defining the silhouette; soft restrained inner glow limited to 1-2 focal panes such as candle-mask eyes and coal bowl; high value contrast on the main read; no scattered sparkles, no multi-source glow, no noisy bloom, no haze touching the silhouette.
Palette: charcoal black glass, ember orange, ashen grey, dull wax ivory, small warm amber core.
Scene/backdrop: perfectly flat solid #ff00ff chroma-key background only.
Constraints: no ground plane; no floor; no shadows; no reflections; no haze touching the silhouette; no text; no labels; no watermark; do not use #ff00ff in the subject.
```

## Enemy Batch 2 V1 Rejected: Gravewarden

Status: disapproved. The candidate was kept in `readable-next` for comparison,
but council judged the elite/boss batch not strong, unique, colourful, funny, or
interesting enough.

Generated image id:
`ig_0cad2c415dfb8680016a4ab2240e8881918849a572c11ff198`

Source:
`enemy-gravewarden/01-gpt-image-2-source.png`

Original source alpha:
`enemy-gravewarden/01-gpt-image-2-source-alpha.png`

Rim-cleaned alpha:
`enemy-gravewarden/04-no-yellow-outline.png`

Selected review candidate:
`enemy-gravewarden/05-gpt-framed.png`

Nano Banana evidence:
`enemy-gravewarden/02-nanobanana-pro-cleaned.jpg`
`enemy-gravewarden/03-alpha.png`
`enemy-gravewarden/06-nanobanana-framed.png`

```text
Use case: stylized-concept
Asset type: Spirebound enemy alpha-ready source
Primary request: Gravewarden, a squat grave-golem elite made of black lead, cold blue-grey glass, and dull tombstone ivory panes, menacing idle pose, facing slightly left toward the hero. One iconic primary read: a huge arched tombstone shield fused to the front of its body, one tiny glowing grave-lamp eye under a cracked stone brow, and two heavy blocky hands like cemetery gate weights. It should read as slow, stubborn, ancient, and a little mournfully funny, like a cemetery monument that woke up angry.
Readability priority: silhouette first, pose second, face/weapon/core symbol third, colour fourth, texture last. The subject must still be recognisable as a black shadow with all internal details removed. Use game-character readability principles: defining primary characteristic, clear value pattern, coherent limited palette, rest/detail balance, high contrast at eye/shield, no visual noise.
Style/medium: serious cartoon-gothic dark-fantasy game art; instantly readable black silhouette first; one iconic primary shape, weapon, or pose; chunky hand-inked outer contour; simplified exaggerated proportions; 3-5 large stained-glass colour masses only, with very few thick lead dividers; matte painterly brush texture; restrained cathedral motifs as broad shapes, not filigree; thumbnail-readable at 128px; dramatic and grave, with compact mischievous enemy personality; no lacework, no micro-panels, no complex anatomy segmentation, no ornate armour noise, no glossy 3D render, no generic fantasy.
Composition/framing: full body, menacing idle pose, facing slightly left, centred with about 14% clean margin; single complete subject; generous padding; no cropped limbs; no action blur. Elite enemy with large readable silhouette: arched tombstone shield body, tiny grave-lamp eye, heavy block hands, squat planted stance.
Lighting/mood: sober gothic mood; single warm amber rim light defining the silhouette; soft restrained inner glow limited to 1-2 focal panes such as grave-lamp eye and cracked shield rune; high value contrast on the main read; no scattered sparkles, no multi-source glow, no noisy bloom, no haze touching the silhouette.
Palette: cold blue-grey glass, black lead, dull tombstone ivory, muted moss green shadow, small warm amber eye.
Scene/backdrop: perfectly flat solid #ff00ff chroma-key background only.
Constraints: no ground plane; no floor; no shadows; no reflections; no haze touching the silhouette; no text; no labels; no watermark; do not use #ff00ff in the subject.
```

## Enemy Batch 2 V1 Rejected: Alpha Duskfang

Status: disapproved. The candidate was kept in `readable-next` for comparison,
but council judged the elite/boss batch not strong, unique, colourful, funny, or
interesting enough.

Generated image id:
`ig_0cad2c415dfb8680016a4ab24beab48191ba143f8ac1595636`

Source:
`enemy-alphaFang/01-gpt-image-2-source.png`

Original source alpha:
`enemy-alphaFang/01-gpt-image-2-source-alpha.png`

Rim-cleaned alpha:
`enemy-alphaFang/04-no-yellow-outline.png`

Selected review candidate:
`enemy-alphaFang/05-gpt-framed.png`

Nano Banana evidence:
`enemy-alphaFang/02-nanobanana-pro-cleaned.jpg`
`enemy-alphaFang/03-alpha.png`
`enemy-alphaFang/06-nanobanana-framed.png`

```text
Use case: stylized-concept
Asset type: Spirebound enemy alpha-ready source
Primary request: Alpha Duskfang, an elite wolf-like dusk beast made of black lead, blood-red glass, and smoky violet shadow panes, menacing idle pose, facing slightly left toward the hero. One iconic primary read: a giant crescent-moon maw almost bigger than its head, a raised alpha mane of three blade-like hackles, and oversized front paws planted wide like a swaggering pack boss. It should read as feral, proud, dangerous, and a little theatrically smug rather than heroic.
Readability priority: silhouette first, pose second, face/weapon/core symbol third, colour fourth, texture last. The subject must still be recognisable as a black shadow with all internal details removed. Use game-character readability principles: defining primary characteristic, clear value pattern, coherent limited palette, rest/detail balance, high contrast at maw/eye, no visual noise.
Style/medium: serious cartoon-gothic dark-fantasy game art; instantly readable black silhouette first; one iconic primary shape, weapon, or pose; chunky hand-inked outer contour; simplified exaggerated proportions; 3-5 large stained-glass colour masses only, with very few thick lead dividers; matte painterly brush texture; restrained cathedral motifs as broad shapes, not filigree; thumbnail-readable at 128px; dramatic and grave, with compact mischievous enemy personality; no lacework, no micro-panels, no complex anatomy segmentation, no ornate armour noise, no glossy 3D render, no generic fantasy.
Composition/framing: full body, menacing idle pose, facing slightly left, centred with about 14% clean margin; single complete subject; generous padding; no cropped limbs; no action blur. Elite enemy with large readable silhouette: crescent maw, raised blade hackles, wide front paws, low predator stance, tail curve kept inside the frame.
Lighting/mood: sober gothic mood; single warm amber rim light defining the silhouette; soft restrained inner glow limited to 1-2 focal panes such as eye slit and crescent maw; high value contrast on the main read; no scattered sparkles, no multi-source glow, no noisy bloom, no haze touching the silhouette.
Palette: deep blood-red glass, black lead, smoky violet shadow, dull bone fang panes, small amber eye.
Scene/backdrop: perfectly flat solid #ff00ff chroma-key background only.
Constraints: no ground plane; no floor; no shadows; no reflections; no haze touching the silhouette; no text; no labels; no watermark; do not use #ff00ff in the subject.
```

## Enemy Batch 2 V1 Rejected: Rootheart

Status: disapproved. The candidate was kept in `readable-next` for comparison,
but council judged the elite/boss batch not strong, unique, colourful, funny, or
interesting enough. Rootheart also needed a clearer Act 1 boss scale and sharper
colour read.

Generated image id:
`ig_0cad2c415dfb8680016a4ab2953be481919d87404b0cdbc533`

Source:
`enemy-rootheart/01-gpt-image-2-source.png`

Original source alpha:
`enemy-rootheart/01-gpt-image-2-source-alpha.png`

Rim-cleaned alpha:
`enemy-rootheart/04-no-yellow-outline.png`

Selected review candidate:
`enemy-rootheart/05-gpt-framed.png`

Nano Banana evidence:
`enemy-rootheart/02-nanobanana-pro-cleaned.jpg`
`enemy-rootheart/03-alpha.png`
`enemy-rootheart/06-nanobanana-framed.png`

```text
Use case: stylized-concept
Asset type: Spirebound enemy alpha-ready source
Primary request: The Rootheart, an Act 1 boss monster made of black lead, dark root-brown glass, moss green panes, and dull amber sap glow, menacing idle pose, facing slightly left toward the hero. One iconic primary read: a huge hollow heart-shaped tree stump torso with a glowing amber sap-heart inside, two short root-claw arms, and a crown of three crooked branch antlers. It should read as ancient, heavy, wounded, dangerous, and oddly soulful, like a forest shrine that became a boss.
Readability priority: silhouette first, pose second, face/weapon/core symbol third, colour fourth, texture last. The subject must still be recognisable as a black shadow with all internal details removed. Use game-character readability principles: defining primary characteristic, clear value pattern, coherent limited palette, rest/detail balance, high contrast at sap-heart/face, no visual noise.
Style/medium: serious cartoon-gothic dark-fantasy game art; instantly readable black silhouette first; one iconic primary shape, weapon, or pose; chunky hand-inked outer contour; simplified exaggerated proportions; 3-5 large stained-glass colour masses only, with very few thick lead dividers; matte painterly brush texture; restrained cathedral motifs as broad shapes, not filigree; thumbnail-readable at 128px; dramatic and grave, with compact mischievous enemy personality; no lacework, no micro-panels, no complex anatomy segmentation, no ornate armour noise, no glossy 3D render, no generic fantasy.
Composition/framing: full body boss sprite, menacing idle pose, facing slightly left, centred and scaled smaller with about 18% clean magenta margin on every side; single complete subject; generous padding; no cropped limbs; no action blur. Boss enemy with large readable silhouette: heart-stump torso, glowing sap-heart window, three branch antlers, root-claw arms, squat root base, every branch tip fully inside the frame.
Lighting/mood: sober gothic mood; single warm amber rim light defining the silhouette; soft restrained inner glow limited to 1-2 focal panes such as sap-heart and hollow eye slit; high value contrast on the main read; no scattered sparkles, no multi-source glow, no noisy bloom, no haze touching the silhouette.
Palette: dark root-brown glass, black lead, moss green shadow, dull amber sap, muted bark grey.
Scene/backdrop: perfectly flat solid #ff00ff chroma-key background only.
Constraints: no ground plane; no floor; no shadows; no reflections; no haze touching the silhouette; no text; no labels; no watermark; do not use #ff00ff in the subject.
```
