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

The temporary runtime review folders `src/assets-readable-baseline-v4/` and
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
