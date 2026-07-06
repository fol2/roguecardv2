# Skill Card Specs

Production handoff for the remaining SKILL card-art scenes, excluding `defend`
because `src/assets-readable-baseline/cards/defend.png` is already approved.
All prompts are for full-bleed rectangular 800 x 500 card-art scenes in the
approved readable-baseline style: serious cartoon-gothic stained glass, strong
foreground/background separation, clear at 64 px, and never a badge, emblem,
card mock-up, UI element, or transparent/chroma-key cutout.

## `firstSpark` / First Spark

id: `firstSpark`; display name: First Spark; type: skill; rarity: starter; target: self.

Story moment: The Duskblade finds the first live ember under a dead glass pane.
One card catches light, and the next pane lifts toward the hand.

Card-art design: Foreground: a large dark gloved hand cupping a small amber spark under a single blue card-shaped pane. Midground: a second pale card pane rises upward from the glow, readable as draw. Background: quiet broken chapel floor in cool blue-grey glass. Palette: sapphire, cyan, black lead, one clean amber spark. Separation/readability note: keep the hand and two card panes large, with a dark lower silhouette and a bright amber centre; at 64 px this must read as spark plus rising card, not a generic flame.

Image generation prompt:

```text
Use case: stylized-concept
Asset type: Spirebound rectangular card art scene for `firstSpark` / First Spark
Primary request: Create a wide 800 x 500 rectangular scene, not an icon and not a badge, showing a dark gloved Duskblade hand cupping a tiny amber spark beneath a blue stained-glass card pane while a second card pane rises from the light.
Gameplay read: skill; show draw and Kindle first through the rising card pane and small ember, with no attack weapon dominance. It must read clearly at 64 px in the in-game card-art band.
Story moment: The first live coal wakes under dead glass, and the next pane is pulled into the Duskblade's hand.
Style/medium: serious cartoon-gothic stained-glass game art; chunky dark silhouette; large readable jewel-glass shapes; sparse thick lead dividers; matte painterly glass texture; controlled amber rim light.
Composition/framing: wide horizontal rectangle; full-bleed chapel-floor background; foreground hand and spark; midground rising card pane; no transparent or chroma-key background; no centred emblem, badge, logo, or full card mock-up.
Palette: cool sapphire and cyan glass, black lead, muted blue-grey stone glass, one warm amber spark.
Constraints: no text, labels, watermark, UI chrome, card border, cost icon, nameplate, decorative badge, circular medallion, plain icon, photorealism, anime card art, tiny filigree, or busy background competing with the foreground action.
```

## `smother` / Smother

id: `smother`; display name: Smother; type: skill; rarity: starter; target: enemy.

Story moment: The Ashwarden answers an enemy ember with a cold warding palm.
The coal does not explode; it is pressed down until green-orange Smolder leaks out.

Card-art design: Foreground: a broad blue stained-glass ward hand presses down from the left. Midground: a single enemy coal cracks and exhales green-orange smoke. Background: simple ash-black chapel recess with one low red target shard. Palette: blue ward, sick green-orange smoke, black lead, small ember red. Separation/readability note: the hand must be the clearest shape, with the smoke as a secondary ribbon and the background nearly flat so it differs from `toxicMist`.

Image generation prompt:

```text
Use case: stylized-concept
Asset type: Spirebound rectangular card art scene for `smother` / Smother
Primary request: Create a wide 800 x 500 rectangular scene, not an icon and not a badge, showing a large blue stained-glass ward hand pressing down on a cracked enemy coal so green-orange Smolder smoke squeezes out around the fingers.
Gameplay read: skill; show Ward first through the blue protective hand, and Smolder second through the coal smoke. It must read clearly at 64 px.
Story moment: The Ashwarden denies the enemy fire, turning its heat into slow internal burn.
Style/medium: serious cartoon-gothic stained-glass game art; chunky dark silhouettes; large readable glass masses; sparse lead dividers; matte painterly glass texture; controlled amber and toxic inner glow.
Composition/framing: wide horizontal rectangle; full-bleed ash-chapel recess; foreground ward hand from the left; midground single coal target; no transparent or chroma-key background; no shield badge, emblem, logo, or full card mock-up.
Palette: sapphire blue ward glass, cyan rim, green-orange smoke, black lead, muted ash grey, small ember red target core.
Constraints: no text, labels, watermark, UI chrome, card border, cost icon, nameplate, decorative badge, circular medallion, plain icon, photorealism, anime card art, tiny filigree, or busy background competing with the hand and coal.
```

## `brace` / Held Light

id: `brace`; display name: Held Light; type: skill; rarity: common; target: self.

Story moment: The Duskblade plants a foot and hides the lantern behind a simple crescent of glass. The held light turns a small defence into a firmer stand.

Card-art design: Foreground: a crouched dark Duskblade silhouette with a lantern tucked close to the body. Midground: a bright crescent-shaped blue ward opens in front of the figure. Background: muted chapel aisle and one distant red threat line. Palette: deep blue, cyan, warm amber lantern, blue-grey stone. Separation/readability note: make this simpler than `bulwark` and less ceremonial than `aegis`; at 64 px it should read as figure, lantern, crescent shield.

Image generation prompt:

```text
Use case: stylized-concept
Asset type: Spirebound rectangular card art scene for `brace` / Held Light
Primary request: Create a wide 800 x 500 rectangular scene, not an icon and not a badge, showing the Duskblade bracing behind a simple crescent of blue stained-glass Ward while holding a small amber lantern close to the chest.
Gameplay read: skill; show straightforward Ward first, held lantern support second. It must read clearly at 64 px.
Story moment: The Duskblade sets their stance and keeps the last light alive behind a modest glass shield.
Style/medium: serious cartoon-gothic stained-glass game art; chunky dark figure silhouette; large jewel-tone glass masses; sparse thick lead dividers; matte painterly glass texture; warm amber rim light.
Composition/framing: wide horizontal rectangle; full-bleed chapel aisle background; foreground crouched figure and lantern; midground crescent ward; no transparent or chroma-key background; no centred shield emblem, badge, logo, or full card mock-up.
Palette: deep sapphire, cyan shield edge, black lead, amber lantern core, muted blue-grey chapel, one distant red threat line.
Constraints: no text, labels, watermark, UI chrome, card border, cost icon, nameplate, decorative badge, circular medallion, plain shield icon, photorealism, anime card art, tiny filigree, or busy background competing with the figure and ward.
```

## `sidestep` / Glasstep

id: `sidestep`; display name: Glasstep; type: skill; rarity: common; target: self.

Story moment: A red strike lands where the Duskblade stood a blink ago. A blue glass footprint and a rising card pane mark the escape.

Card-art design: Foreground: one bright blue glass footprint stepping sideways, with the Duskblade's dark cloak edge leaving frame. Midground: a thin red impact line misses and cracks the floor. Background: tilted chapel tiles and a small card pane flicking upward for draw. Palette: cyan-blue movement, red miss line, amber rim, cool stone. Separation/readability note: use diagonal negative space between the footprint and red strike so this reads as evasion plus tempo, not a shield wall.

Image generation prompt:

```text
Use case: stylized-concept
Asset type: Spirebound rectangular card art scene for `sidestep` / Glasstep
Primary request: Create a wide 800 x 500 rectangular scene, not an icon and not a badge, showing a bright blue stained-glass footprint slipping sideways as a red attack line cracks the empty floor where the Duskblade was, with one small card pane flicking upward from the motion.
Gameplay read: skill; show evasive Ward and draw-tempo through the side step, missed strike, and rising pane. It must read clearly at 64 px.
Story moment: The Duskblade becomes a step of glass beside the blow, already reaching for the next pane.
Style/medium: serious cartoon-gothic stained-glass game art; chunky cloak silhouette edge; large readable glass shapes; sparse lead dividers; matte painterly glass texture; controlled amber rim light.
Composition/framing: wide horizontal rectangle; full-bleed tilted chapel-floor background; foreground blue footprint; midground red miss crack; no transparent or chroma-key background; no badge, emblem, logo, or full card mock-up.
Palette: cyan and sapphire step glass, black lead, sharp crimson impact line, muted blue-grey floor, tiny amber motion rim.
Constraints: no text, labels, watermark, UI chrome, card border, cost icon, nameplate, decorative badge, circular medallion, plain arrow icon, photorealism, anime card art, tiny filigree, or busy background competing with the step.
```

## `preparation` / Tinder

id: `preparation`; display name: Tinder; type: skill; rarity: common; target: self.

Story moment: Before the climb turns violent, the Duskblade lays out dry panes and one match. Nothing has flared yet, but the next action is ready to kindle.

Card-art design: Foreground: a neat stack of two or three card panes, large and angled. Midground: one unlit match or taper leans against the stack, its tip barely amber. Background: quiet workbench altar with dark chapel arches. Palette: cool blue cards, pale wood/amber match, grey-violet background. Separation/readability note: keep it calm and organised; distinguish it from `firstSpark` by showing preparation before ignition, not an active rising spark.

Image generation prompt:

```text
Use case: stylized-concept
Asset type: Spirebound rectangular card art scene for `preparation` / Tinder
Primary request: Create a wide 800 x 500 rectangular scene, not an icon and not a badge, showing a neat stack of blue stained-glass card panes on a small chapel workbench with one unlit match resting against them, its tip holding only a tiny amber glow.
Gameplay read: skill; show draw setup first through the prepared card panes, and Kindle potential second through the unlit match. It must read clearly at 64 px.
Story moment: The Duskblade arranges the next panes and keeps the match ready before the fire starts.
Style/medium: serious cartoon-gothic stained-glass game art; chunky dark shapes; large readable glass masses; sparse lead dividers; matte painterly glass texture; restrained amber rim light.
Composition/framing: wide horizontal rectangle; full-bleed altar-workbench background; foreground card stack; midground match; no transparent or chroma-key background; no badge, emblem, logo, or full card mock-up.
Palette: cool sapphire card glass, pale cyan highlights, black lead, small amber match tip, muted grey-violet chapel shadows.
Constraints: no text, labels, watermark, UI chrome, card border, cost icon, nameplate, decorative badge, circular medallion, plain stack icon, photorealism, anime card art, tiny filigree, or busy background competing with the stack and match.
```

## `deflect` / Refract

id: `deflect`; display name: Refract; type: skill; rarity: common; target: self.

Story moment: The incoming shard does not stop; the Duskblade turns it through a mirrored pane. A new card glints in the reflection as the danger bends away.

Card-art design: Foreground: an angled mirrored blue pane held by a dark hand. Midground: a red shard ray hits the pane and bends sharply away. Background: one pale card pane appears in the reflection, set against quiet arches. Palette: cyan mirror, red shard, silver lead, amber rim. Separation/readability note: keep the red ray and blue mirror as two bold diagonals; distinguish from `sidestep` by showing refraction rather than movement.

Image generation prompt:

```text
Use case: stylized-concept
Asset type: Spirebound rectangular card art scene for `deflect` / Refract
Primary request: Create a wide 800 x 500 rectangular scene, not an icon and not a badge, showing a dark hand holding an angled mirrored blue stained-glass pane as a red shard ray hits it and bends away, with one pale card pane visible in the reflection.
Gameplay read: skill; show Ward by redirection first, draw second through the reflected card pane. It must read clearly at 64 px.
Story moment: The Duskblade answers force with angle, turning a killing shard into a new opening.
Style/medium: serious cartoon-gothic stained-glass game art; chunky dark silhouette; large readable glass shapes; sparse thick lead dividers; matte painterly glass texture; sharp controlled rim light.
Composition/framing: wide horizontal rectangle; full-bleed quiet chapel background; foreground angled mirror pane; midground red ray bending away; no transparent or chroma-key background; no shield badge, emblem, logo, or full card mock-up.
Palette: bright cyan and sapphire mirror glass, silver lead, black hand silhouette, crimson shard ray, small amber edge light.
Constraints: no text, labels, watermark, UI chrome, card border, cost icon, nameplate, decorative badge, circular medallion, plain mirror icon, photorealism, anime card art, tiny filigree, or busy background competing with the angled refraction.
```

## `bulwark` / Glasswall

id: `bulwark`; display name: Glasswall; type: skill; rarity: uncommon; target: self.

Story moment: The Duskblade stops advancing and lets the cathedral answer.
Layered panes rise from the floor like a temporary fortress.

Card-art design: Foreground: the Duskblade appears small and dark behind the lower edge of the wall. Midground: a tall layered blue glass wall with thick lead buttresses dominates the frame. Background: dim nave columns visible through the panes. Palette: heavy sapphire, cyan edges, black lead, subdued amber lantern. Separation/readability note: make the wall vertical and massive, clearly heavier than `brace`; no draw, smoke, or motion cues.

Image generation prompt:

```text
Use case: stylized-concept
Asset type: Spirebound rectangular card art scene for `bulwark` / Glasswall
Primary request: Create a wide 800 x 500 rectangular scene, not an icon and not a badge, showing a massive layered blue stained-glass wall rising from the chapel floor, with thick black lead buttresses and a small dark Duskblade silhouette protected behind it.
Gameplay read: skill; show high Ward first through scale and weight. It must read clearly at 64 px.
Story moment: The cathedral glass rises as a temporary fortress between the Duskblade and the night.
Style/medium: serious cartoon-gothic stained-glass game art; chunky dark silhouettes; large jewel-tone panes; sparse heavy lead dividers; matte painterly glass texture; controlled amber lantern rim.
Composition/framing: wide horizontal rectangle; full-bleed nave background; foreground small protected figure; midground towering wall; no transparent or chroma-key background; no centred shield emblem, badge, logo, or full card mock-up.
Palette: deep sapphire and cyan wall panes, black lead buttresses, muted blue-grey columns, small amber lantern dot.
Constraints: no text, labels, watermark, UI chrome, card border, cost icon, nameplate, decorative badge, circular medallion, plain shield icon, photorealism, anime card art, tiny filigree, or busy background competing with the wall silhouette.
```

## `surge` / Struck Match

id: `surge`; display name: Struck Match; type: skill; rarity: uncommon; target: self.

Story moment: A match scrapes across black lead and the whole hand wakes.
The flare gives the Duskblade one urgent breath of speed.

Card-art design: Foreground: a large match head ignites in a bright amber-white flare. Midground: a row of blue card panes lights one by one, with the nearest pane lifting. Background: dark workbench and chapel glass. Palette: amber-white flare, blue card panes, black lead, smoky violet shadows. Separation/readability note: make the match flare distinct from `firstSpark` by using a larger horizontal strike and multiple lit panes; energy must read as speed, not an attack blast.

Image generation prompt:

```text
Use case: stylized-concept
Asset type: Spirebound rectangular card art scene for `surge` / Struck Match
Primary request: Create a wide 800 x 500 rectangular scene, not an icon and not a badge, showing a large match head striking across black lead and flaring bright amber-white, lighting a row of blue stained-glass card panes with the nearest pane lifting into motion.
Gameplay read: skill; show Energy, draw, and Kindle as a fast ignition of prepared panes. It must read clearly at 64 px.
Story moment: One hard strike wakes the hand and gives the Duskblade a brief rush of light.
Style/medium: serious cartoon-gothic stained-glass game art; chunky dark silhouettes; large readable glass shapes; sparse lead dividers; matte painterly glass texture; bright but controlled amber flare.
Composition/framing: wide horizontal rectangle; full-bleed dark workbench-chapel background; foreground match flare; midground row of card panes; no transparent or chroma-key background; no badge, emblem, logo, or full card mock-up.
Palette: amber-white ignition, orange rim, sapphire and cyan cards, black lead, smoky violet-blue shadows.
Constraints: no text, labels, watermark, UI chrome, card border, cost icon, nameplate, decorative badge, circular medallion, plain lightning icon, photorealism, anime card art, tiny filigree, or busy background competing with the struck match.
```

## `toxicMist` / Ashcloud

id: `toxicMist`; display name: Ashcloud; type: skill; rarity: uncommon; target: allEnemies.

Story moment: The Ashwarden breathes across the battlefield and every enemy pane begins to smoke from inside. The cloud is broad, low, and inevitable.

Card-art design: Foreground: a sweeping green-grey smoke sheet rolls from left to right. Midground: three small red enemy target shards are partly swallowed by the cloud. Background: low ash chapel arches, desaturated and simple. Palette: green-grey ash, orange coal cores, muted red targets, black lead. Separation/readability note: distinguish from `smother` by avoiding a hand and making the all-enemy geometry obvious through multiple target shards under one wide cloud.

Image generation prompt:

```text
Use case: stylized-concept
Asset type: Spirebound rectangular card art scene for `toxicMist` / Ashcloud
Primary request: Create a wide 800 x 500 rectangular scene, not an icon and not a badge, showing a broad green-grey Smolder cloud rolling across the whole frame and swallowing three small red enemy glass shards, each with an orange coal core starting to smoke.
Gameplay read: skill; show all-enemy Smolder first through one wide cloud covering multiple targets. It must read clearly at 64 px.
Story moment: Ash rolls across the battlefield and every hostile pane begins to burn from within.
Style/medium: serious cartoon-gothic stained-glass game art; chunky readable silhouettes; large smoke and glass masses; sparse lead dividers; matte painterly glass texture; controlled toxic-orange inner glow.
Composition/framing: wide horizontal rectangle; full-bleed ash-chapel background; foreground smoke sheet; midground three target shards; no transparent or chroma-key background; no cloud badge, emblem, logo, or full card mock-up.
Palette: smoky green-grey, sick orange ember cores, muted crimson target glass, black lead, desaturated blue-grey chapel.
Constraints: no text, labels, watermark, UI chrome, card border, cost icon, nameplate, decorative badge, circular medallion, plain cloud icon, photorealism, anime card art, tiny filigree, or busy background competing with the smoke wave.
```

## `cripple` / Gutter

id: `cripple`; display name: Gutter; type: skill; rarity: uncommon; target: enemy.

Story moment: The enemy's inner blaze is caught under a snuffer ring. Its Fervor collapses into a weak ember while the Duskblade keeps the spent heat.

Card-art design: Foreground: a blue-black snuffer ring descends over a red enemy flame. Midground: a cracked target pane gutters downward, with a tiny ember bead escaping toward the Duskblade side. Background: dark chapel alcove. Palette: red flame, cold blue snuffer, amber ember bead, ash grey. Separation/readability note: the collapsed flame shape must read first; the small ember cue should be secondary so this stays a debuff card, not `surge`.

Image generation prompt:

```text
Use case: stylized-concept
Asset type: Spirebound rectangular card art scene for `cripple` / Gutter
Primary request: Create a wide 800 x 500 rectangular scene, not an icon and not a badge, showing a cold blue-black stained-glass snuffer ring pressing down over a red enemy flame inside a cracked target pane, while one tiny amber ember bead escapes toward the Duskblade side.
Gameplay read: skill; show Fervor loss and Kindle through a guttering enemy flame and a small captured ember. It must read clearly at 64 px.
Story moment: The Duskblade snuffs the enemy fire and saves the last useful heat.
Style/medium: serious cartoon-gothic stained-glass game art; chunky dark silhouettes; large readable glass masses; sparse lead dividers; matte painterly texture; controlled ember glow.
Composition/framing: wide horizontal rectangle; full-bleed dark chapel alcove; foreground snuffer ring; midground collapsing flame target; no transparent or chroma-key background; no badge, emblem, logo, or full card mock-up.
Palette: cold sapphire and black snuffer, crimson guttering flame, amber ember bead, ash grey panes, muted violet shadows.
Constraints: no text, labels, watermark, UI chrome, card border, cost icon, nameplate, decorative badge, circular medallion, plain debuff icon, photorealism, anime card art, tiny filigree, or busy background competing with the snuffed flame.
```

## `warCry` / Shatterhymn

id: `warCry`; display name: Shatterhymn; type: skill; rarity: uncommon; target: allEnemies.

Story moment: The Duskblade does not shout like a soldier; the chapel itself rings. The hymn dims enemy fires and scores cracks through every hostile pane.

Card-art design: Foreground: a dark bell-mouth or mask silhouette releases visible blue-violet sound waves. Midground: three enemy panes around the frame show one crack and one dimmed flame each. Background: echoing chapel vault, simple and dark. Palette: blue-violet sound, pale crack lines, dull red enemy glass, black lead. Separation/readability note: use concentric wave bands and multiple target shards; keep it clearly sonic and all-enemy, not smoke or blade impact.

Image generation prompt:

```text
Use case: stylized-concept
Asset type: Spirebound rectangular card art scene for `warCry` / Shatterhymn
Primary request: Create a wide 800 x 500 rectangular scene, not an icon and not a badge, showing a dark bell-mouth mask silhouette releasing blue-violet ringing waves across three enemy glass panes, cracking each pane and dimming the small flames inside them.
Gameplay read: skill; show all-enemy Dimmed and Cracked through sound waves striking multiple targets. It must read clearly at 64 px.
Story moment: The chapel sings through the Duskblade and every hostile pane loses its nerve.
Style/medium: serious cartoon-gothic stained-glass game art; chunky dark silhouette; large readable wave bands and target panes; sparse lead dividers; matte painterly glass texture; controlled cold glow.
Composition/framing: wide horizontal rectangle; full-bleed vaulted chapel background; foreground bell-mouth silhouette; midground three cracked target panes; no transparent or chroma-key background; no badge, emblem, logo, or full card mock-up.
Palette: deep blue-violet sound waves, pale cyan crack lines, muted crimson enemy glass, black lead, dull orange dimmed flames.
Constraints: no text, labels, watermark, UI chrome, card border, cost icon, nameplate, decorative badge, circular medallion, plain mouth icon, photorealism, anime card art, tiny filigree, or busy background competing with the wave geometry.
```

## `fortify` / Mirrorlight

id: `fortify`; display name: Mirrorlight; type: skill; rarity: uncommon; target: self.

Story moment: The Duskblade turns one ward into two by catching the lantern in opposed mirrors. The defence grows without moving forward.

Card-art design: Foreground: one amber lantern hangs low and central. Midground: two mirrored blue shield panes face each other, each reflecting the lantern into a larger ward surface. Background: dark symmetrical chapel aisle. Palette: mirrored cyan-blue, silver lead, warm amber, deep navy. Separation/readability note: make the doubled symmetry obvious and controlled; this should not look like `brace` because the lantern multiplies through mirrors rather than sitting behind one shield.

Image generation prompt:

```text
Use case: stylized-concept
Asset type: Spirebound rectangular card art scene for `fortify` / Mirrorlight
Primary request: Create a wide 800 x 500 rectangular scene, not an icon and not a badge, showing one amber lantern between two facing mirrored blue stained-glass ward panes, with each mirror reflecting the light into a larger shield surface.
Gameplay read: skill; show doubled Ward through mirrored defence and multiplied lantern light. It must read clearly at 64 px.
Story moment: One held light becomes two walls when the Duskblade finds the right angle.
Style/medium: serious cartoon-gothic stained-glass game art; chunky dark shapes; large readable mirror panes; sparse thick lead dividers; matte painterly glass texture; controlled amber glow.
Composition/framing: wide horizontal rectangle; full-bleed symmetrical chapel aisle background; foreground lantern; midground facing mirror-shields; no transparent or chroma-key background; no centred emblem, badge, logo, or full card mock-up.
Palette: sapphire and cyan mirror glass, silver lead, black chapel shadows, strong amber lantern core, restrained gold rim.
Constraints: no text, labels, watermark, UI chrome, card border, cost icon, nameplate, decorative badge, circular medallion, plain shield icon, photorealism, anime card art, tiny filigree, or busy background competing with the doubled mirror shape.
```

## `bloodRite` / Blood for Oil

id: `bloodRite`; display name: Blood for Oil; type: skill; rarity: uncommon; target: self.

Story moment: The Duskblade pays for speed with a dark red drop. The lantern accepts blood-oil and burns hotter for a turn.

Card-art design: Foreground: a large blood-red oil drop falls from a cut black glove. Midground: the drop enters a lantern reservoir and turns into two amber flames. Background: ritual workbench with restrained chapel geometry. Palette: dark red, amber oil fire, black lead, muted blue shadows. Separation/readability note: keep the red drop and lantern reservoir huge and simple; avoid gore detail and distinguish it from `offering` by showing bodily cost, not burning cards.

Image generation prompt:

```text
Use case: stylized-concept
Asset type: Spirebound rectangular card art scene for `bloodRite` / Blood for Oil
Primary request: Create a wide 800 x 500 rectangular scene, not an icon and not a badge, showing a large dark red blood-oil drop falling from a cut black glove into a stained-glass lantern reservoir, where it becomes two bright amber flames.
Gameplay read: skill; show sacrifice for Energy through blood-oil feeding the lantern. It must read clearly at 64 px.
Story moment: The Duskblade buys one more burst of speed by giving the lantern a living drop.
Style/medium: serious cartoon-gothic stained-glass game art; chunky dark silhouettes; large readable glass masses; sparse lead dividers; matte painterly glass texture; controlled ritual glow.
Composition/framing: wide horizontal rectangle; full-bleed ritual workbench background; foreground falling blood-oil drop; midground lantern reservoir and flames; no transparent or chroma-key background; no badge, emblem, logo, or full card mock-up.
Palette: deep oxblood red, amber-gold lantern fire, black lead, muted blue and violet chapel shadows, small cyan rim on glass.
Constraints: no text, labels, watermark, UI chrome, card border, cost icon, nameplate, decorative badge, circular medallion, plain heart icon, explicit gore, photorealism, anime card art, tiny filigree, or busy background competing with the drop and lantern.
```

## `aegis` / Cathedral Glass

id: `aegis`; display name: Cathedral Glass; type: skill; rarity: rare; target: self.

Story moment: The Duskblade calls up a shield too large for one body. A crowned cathedral window descends and seals the blow away.

Card-art design: Foreground: a small dark Duskblade silhouette stands under a vast gold-crowned blue shield. Midground: a rose-window shield face fills most of the image, with large panes and one amber core. Background: dim nave arches receding behind it. Palette: saturated sapphire, cyan, gold crown, amber centre, black lead. Separation/readability note: this is the rare Ward ceremony; make it grander than `bulwark` through crown and rose-window geometry, but keep the silhouette simple enough to read at thumbnail size.

Image generation prompt:

```text
Use case: stylized-concept
Asset type: Spirebound rectangular card art scene for `aegis` / Cathedral Glass
Primary request: Create a wide 800 x 500 rectangular scene, not an icon and not a badge, showing a vast gold-crowned blue cathedral-glass shield descending in front of a small dark Duskblade silhouette, with a simple rose-window face and one warm amber centre.
Gameplay read: skill; show rare high Ward and Kindle through ceremonial shield glass and a contained lantern core. It must read clearly at 64 px.
Story moment: The cathedral lends its largest window to the Duskblade for one decisive defence.
Style/medium: serious cartoon-gothic stained-glass game art; chunky dark silhouette; large jewel-tone panes; sparse thick lead dividers; matte painterly glass texture; controlled gold and amber glow.
Composition/framing: wide horizontal rectangle; full-bleed nave background; foreground protected figure; midground crowned shield rose window dominating the frame; no transparent or chroma-key background; no shield badge, emblem, logo, or full card mock-up.
Palette: rich sapphire and cyan glass, black lead, restrained gold crown, amber lantern core, muted blue-grey cathedral.
Constraints: no text, labels, watermark, UI chrome, card border, cost icon, nameplate, decorative badge, circular medallion, plain shield icon, photorealism, anime card art, tiny filigree, or busy background competing with the cathedral shield.
```

## `offering` / Pyre Tithe

id: `offering`; display name: Pyre Tithe; type: skill; rarity: rare; target: self.

Story moment: The Duskblade feeds the pyre with the rest of the hand and receives new panes in the ashlight. This is sacrifice as economy, not punishment.

Card-art design: Foreground: a black gloved hand presents a card pane into a tall amber pyre. Midground: several other card panes dissolve upward as ash and ember beads, while three new blue panes emerge from the side glow. Background: ritual chapel pyre niche. Palette: amber pyre, blue cards, black lead, ash grey, violet shadows. Separation/readability note: distinguish from `bloodRite` by showing card sacrifice and renewal; the pyre and card panes must be larger than the ash detail.

Image generation prompt:

```text
Use case: stylized-concept
Asset type: Spirebound rectangular card art scene for `offering` / Pyre Tithe
Primary request: Create a wide 800 x 500 rectangular scene, not an icon and not a badge, showing a black gloved hand presenting one blue stained-glass card pane into a tall amber pyre while several other panes dissolve into ash and ember beads, with three fresh blue panes emerging from the side glow.
Gameplay read: skill; show burning other cards, lantern fuel, draw, and Kindle through card panes entering and leaving the pyre. It must read clearly at 64 px.
Story moment: The Duskblade pays the pyre in panes and receives a brighter hand in return.
Style/medium: serious cartoon-gothic stained-glass game art; chunky dark silhouettes; large readable glass masses; sparse lead dividers; matte painterly glass texture; controlled pyre glow.
Composition/framing: wide horizontal rectangle; full-bleed ritual chapel niche background; foreground hand and card; midground tall pyre and new panes; no transparent or chroma-key background; no badge, emblem, logo, or full card mock-up.
Palette: amber-gold pyre, sapphire and cyan card panes, black lead, ash grey smoke, muted violet chapel shadows.
Constraints: no text, labels, watermark, UI chrome, card border, cost icon, nameplate, decorative badge, circular medallion, plain flame icon, photorealism, anime card art, tiny filigree, or busy background competing with the hand, pyre, and panes.
```

## `limitBreak` / Annealing Rite

id: `limitBreak`; display name: Annealing Rite; type: skill; rarity: rare; target: allEnemies.

Story moment: The furnace bell rings and every enemy facet shows its hidden fracture. One clean burning pane marks the rite's cost and fuel.

Card-art design: Foreground: a bright circular furnace ring occupies the centre, with a single card pane burning clean at the lower edge. Midground: three enemy glass panes around the ring crack at their facet corners. Background: dark forge-cathedral wall. Palette: amber furnace, red cracks, blue-grey enemy panes, black lead. Separation/readability note: make the all-enemy chip geometry radial and readable; distinguish from `warCry` by using heat rings and facet cracks, not sound waves.

Image generation prompt:

```text
Use case: stylized-concept
Asset type: Spirebound rectangular card art scene for `limitBreak` / Annealing Rite
Primary request: Create a wide 800 x 500 rectangular scene, not an icon and not a badge, showing a bright amber furnace ring cracking the facet corners of three enemy glass panes around it, while one blue card pane burns cleanly at the lower foreground edge.
Gameplay read: skill; show all-enemy Facet chipping and Kindle through radial furnace heat, cracked panes, and the burning card. It must read clearly at 64 px.
Story moment: The annealing rite exposes every weak corner in the hostile glass and feeds itself on one clean pane.
Style/medium: serious cartoon-gothic stained-glass game art; chunky dark silhouettes; large readable ring and target panes; sparse heavy lead dividers; matte painterly glass texture; controlled furnace glow.
Composition/framing: wide horizontal rectangle; full-bleed forge-cathedral background; foreground burning card pane; midground furnace ring and three cracked enemy panes; no transparent or chroma-key background; no badge, emblem, logo, or full card mock-up.
Palette: amber and white-hot furnace core, crimson fracture lines, blue-grey target glass, black lead, smoky violet shadows.
Constraints: no text, labels, watermark, UI chrome, card border, cost icon, nameplate, decorative badge, circular medallion, plain explosion icon, photorealism, anime card art, tiny filigree, or busy background competing with the furnace ring and cracked targets.
```

## `catalyst` / Bellows

id: `catalyst`; display name: Bellows; type: skill; rarity: rare; target: enemy.

Story moment: The Ashwarden does not add new fire; they force the enemy's old Smolder to breathe. The coal brightens dangerously as bellows push poison-orange smoke through it.

Card-art design: Foreground: dark leather-and-glass bellows, large and angled, push air into frame. Midground: one enemy coal swells from dull green smoke to a bright orange-green burn. Background: ash-forge alcove, quiet. Palette: green-orange Smolder, amber coal, black bellows, cold blue shadows. Separation/readability note: keep this single-target and tool-driven; it must not become a broad mist card like `toxicMist` or a choir scene like `ashenChoir`.

Image generation prompt:

```text
Use case: stylized-concept
Asset type: Spirebound rectangular card art scene for `catalyst` / Bellows
Primary request: Create a wide 800 x 500 rectangular scene, not an icon and not a badge, showing large dark stained-glass bellows forcing air into a single enemy coal, making its green-orange Smolder smoke double into a brighter dangerous burn.
Gameplay read: skill; show Smolder amplification and Kindle through the bellows, one target coal, and intensified ember smoke. It must read clearly at 64 px.
Story moment: The Ashwarden feeds an existing sickness of fire until it becomes impossible to contain.
Style/medium: serious cartoon-gothic stained-glass game art; chunky dark tool silhouette; large readable glass masses; sparse lead dividers; matte painterly texture; controlled toxic ember glow.
Composition/framing: wide horizontal rectangle; full-bleed ash-forge alcove background; foreground bellows; midground single coal target; no transparent or chroma-key background; no badge, emblem, logo, or full card mock-up.
Palette: toxic green-orange smoke, amber-white coal core, black bellows and lead, muted blue-grey forge shadows, small cyan rim.
Constraints: no text, labels, watermark, UI chrome, card border, cost icon, nameplate, decorative badge, circular medallion, plain potion icon, photorealism, anime card art, tiny filigree, or busy background competing with the bellows and coal.
```

## `tithe` / Tithe of Panes

id: `tithe`; display name: Tithe of Panes; type: skill; rarity: uncommon; target: self.

Story moment: The Duskblade counts out ember beads into a shallow lantern bowl. A fresh pane rises as proof that the tithe has been accepted.

Card-art design: Foreground: three amber coal beads sit in or fall into a shallow blue-black lantern bowl. Midground: one blue card pane lifts from the bowl glow. Background: simple offering ledge and quiet cathedral tiles. Palette: amber beads, cyan bowl edge, sapphire card pane, grey-violet shadows. Separation/readability note: make this feel like measured resource economy, not sacrifice; distinguish from `offering` by using small counted beads instead of burning cards.

Image generation prompt:

```text
Use case: stylized-concept
Asset type: Spirebound rectangular card art scene for `tithe` / Tithe of Panes
Primary request: Create a wide 800 x 500 rectangular scene, not an icon and not a badge, showing three distinct amber ember beads being offered into a shallow blue-black lantern bowl, with one blue stained-glass card pane rising from the bowl's glow.
Gameplay read: skill; show Ember economy and draw through counted beads, lantern bowl, and rising card pane. It must read clearly at 64 px.
Story moment: The Duskblade pays the lantern in measured coals and receives a new pane.
Style/medium: serious cartoon-gothic stained-glass game art; chunky dark shapes; large readable beads and card pane; sparse lead dividers; matte painterly glass texture; controlled amber glow.
Composition/framing: wide horizontal rectangle; full-bleed offering ledge and cathedral-tile background; foreground ember beads and bowl; midground rising card pane; no transparent or chroma-key background; no badge, emblem, logo, or full card mock-up.
Palette: amber coal beads, sapphire and cyan card glass, black lead, muted grey-violet tiles, small gold rim light.
Constraints: no text, labels, watermark, UI chrome, card border, cost icon, nameplate, decorative badge, circular medallion, plain coin icon, photorealism, anime card art, tiny filigree, or busy background competing with the beads and card pane.
```

## `ashenChoir` / Ashen Choir

id: `ashenChoir`; display name: Ashen Choir; type: skill; rarity: uncommon; target: enemy.

Story moment: Three ash mouths sing into one enemy ember until the Smolder learns a tune. When that pane dies, the song is ready to leap.

Card-art design: Foreground: three small ash-mouth silhouettes arranged like a grim choir, not cute faces. Midground: their green-orange smoke streams converge into a single enemy coal. Background: dark choir stall with muted stained-glass ribs. Palette: ash grey, green-orange smoke, ember red, black lead. Separation/readability note: keep the three-mouth triangle and one target coal clear; distinguish from `toxicMist` by showing directed song streams, not a blanket cloud.

Image generation prompt:

```text
Use case: stylized-concept
Asset type: Spirebound rectangular card art scene for `ashenChoir` / Ashen Choir
Primary request: Create a wide 800 x 500 rectangular scene, not an icon and not a badge, showing three grim ash-mouth silhouettes singing narrow green-orange Smolder streams into one enemy coal, making the coal glow as if the fire could leap onward.
Gameplay read: skill; show single-target Smolder and spreading death echo through the choir triangle and one charged ember. It must read clearly at 64 px.
Story moment: The ash choir teaches the enemy ember a song that will carry after shattering.
Style/medium: serious cartoon-gothic stained-glass game art; chunky dark silhouettes; large readable smoke streams and coal; sparse lead dividers; matte painterly glass texture; controlled toxic ember glow.
Composition/framing: wide horizontal rectangle; full-bleed dark choir-stall background; foreground three ash mouths; midground converging smoke and target coal; no transparent or chroma-key background; no badge, emblem, logo, or full card mock-up.
Palette: ash grey mouths, toxic green-orange smoke, ember red coal, black lead, muted blue-violet chapel ribs.
Constraints: no text, labels, watermark, UI chrome, card border, cost icon, nameplate, decorative badge, circular medallion, plain music icon, photorealism, anime card art, tiny filigree, or busy background competing with the choir and coal.
```

## `flawlessForm` / Flawless Form

id: `flawlessForm`; display name: Flawless Form; type: skill; rarity: rare; target: self.

Story moment: For one breath the Duskblade's glass has no crack, chip, or old mistake. The perfect body turns defence into a mirror-bright state.

Card-art design: Foreground: a full dark-blue mirror-body silhouette stands upright, faceless and uncracked, edged by hard cyan light. Midground: a clean blue ward aura hugs the body rather than forming a wall. Background: quiet dark cathedral glass with broken panes kept far behind. Palette: pristine cyan, deep sapphire, black lead, small amber heart-light. Separation/readability note: the unbroken body shape must read before the aura; avoid shield-wall language so it differs from `aegis` and `bulwark`.

Image generation prompt:

```text
Use case: stylized-concept
Asset type: Spirebound rectangular card art scene for `flawlessForm` / Flawless Form
Primary request: Create a wide 800 x 500 rectangular scene, not an icon and not a badge, showing a pristine dark-blue mirror-glass Duskblade body standing upright, faceless and completely uncracked, with a tight clean cyan ward aura hugging the silhouette and a tiny amber heart-light inside.
Gameplay read: skill; show perfect untouched Ward through an unbroken mirror body, not a shield wall. It must read clearly at 64 px.
Story moment: The Duskblade holds a flawless shape for one breath, reflecting every threat away.
Style/medium: serious cartoon-gothic stained-glass game art; chunky elegant silhouette; large clean glass masses; sparse lead dividers; matte painterly glass texture; hard controlled rim light.
Composition/framing: wide horizontal rectangle; full-bleed dark cathedral-glass background; foreground flawless body; midground tight ward aura; no transparent or chroma-key background; no badge, emblem, logo, or full card mock-up.
Palette: pristine cyan rim, deep sapphire body glass, black lead, tiny amber inner light, muted violet-blue broken panes far behind.
Constraints: no text, labels, watermark, UI chrome, card border, cost icon, nameplate, decorative badge, circular medallion, plain body icon, photorealism, anime card art, tiny filigree, cracks on the main body, or busy background competing with the flawless silhouette.
```

## `emberdance` / Emberdance

id: `emberdance`; display name: Emberdance; type: skill; rarity: uncommon; target: self.

Story moment: The Duskblade spills the lantern and catches the flying embers in blue ward ribbons. Each spark becomes a moving pane of protection before it burns out.

Card-art design: Foreground: three amber embers arc out from a tilted lantern. Midground: blue shield ribbons spiral around them in a dance, forming partial ward curves. Background: dark chapel floor with faint circular motion marks. Palette: amber sparks, cyan-blue ribbons, black lead, violet shadows. Separation/readability note: make this kinetic and circular, not a static shield; the counted embers must remain visible inside the ward motion.

Image generation prompt:

```text
Use case: stylized-concept
Asset type: Spirebound rectangular card art scene for `emberdance` / Emberdance
Primary request: Create a wide 800 x 500 rectangular scene, not an icon and not a badge, showing three bright amber embers spilling from a tilted lantern while blue stained-glass ward ribbons spiral around them like a controlled dance, forming partial shield curves in motion.
Gameplay read: skill; show spending Embers into Ward through visible counted sparks becoming blue protection ribbons. It must read clearly at 64 px.
Story moment: The Duskblade spills the lantern on purpose and catches each coal as a moving ward.
Style/medium: serious cartoon-gothic stained-glass game art; chunky dark lantern silhouette; large readable ribbon shapes; sparse lead dividers; matte painterly glass texture; controlled amber and cyan glow.
Composition/framing: wide horizontal rectangle; full-bleed dark chapel-floor background; foreground tilted lantern and embers; midground spiralling ward ribbons; no transparent or chroma-key background; no badge, emblem, logo, or full card mock-up.
Palette: bright amber ember beads, sapphire and cyan ward ribbons, black lead, muted violet-blue floor glass, small gold rim light.
Constraints: no text, labels, watermark, UI chrome, card border, cost icon, nameplate, decorative badge, circular medallion, plain flame icon, photorealism, anime card art, tiny filigree, or busy background competing with the embers and ribbon motion.
```
