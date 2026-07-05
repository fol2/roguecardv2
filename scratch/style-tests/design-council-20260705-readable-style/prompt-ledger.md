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
- Batch-2 rejected comparison sets are kept in `src/assets-readable-next/` and
  `src/assets-readable-next-v2/`; scratch folders keep all source, alpha,
  Nano Banana, and prompt evidence.

Earlier temporary runtime review folders `src/assets-readable-baseline-v4/` and
`src/assets-readable-gpt-clean/` were removed after promotion. Scratch source
folders remain as prompt and generation evidence.

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
