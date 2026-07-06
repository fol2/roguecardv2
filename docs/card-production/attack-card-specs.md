# Attack Card Production Specs

These specs cover every remaining attack card after the approved readable-baseline milestone for `strike`, `defend`, and `empower`.

Shared lock for all prompts: full-bleed rectangular card-art scene, 800 x 500 output intent, serious cartoon-gothic stained-glass game art, foreground subject/action plus themed background, strong foreground/background separation, readable at 64 px, no badge/emblem composition, no transparent or chroma-key background, no text, labels, UI, card frame, border, cost icon, nameplate, or watermark.

## `eclipseSlash` / Eclipse Slash

- id: `eclipseSlash`
- display name: Eclipse Slash
- type: attack
- rarity: starter
- target: enemy

Story moment: The Duskblade cuts across a dead moon pane and exposes the first weakness in the enemy glass. The slash is not a finishing blow; it is a clean scoring mark that makes the next strike worse.

Card-art design: Foreground: dark Duskblade forearm and bright crimson blade crossing a black eclipse disc. Midground: one enemy glass pane split by a pale fracture. Background: sparse ruined chapel arch in muted violet-grey. Palette: black lead, crimson, amber rim, cool violet shadow. Separation/readability note: the blade and eclipse must read as two bold crossing shapes, with the fracture as the only fine detail.

Image generation prompt:

```text
Use case: stylized-concept
Asset type: Spirebound rectangular card art scene for `eclipseSlash` / Eclipse Slash
Primary request: Create a wide rectangular 800 x 500 card-art illustration, not an icon and not a badge. Show a large dark Duskblade forearm in the foreground driving a bright crimson blade diagonally across a black eclipse disc, scoring one pale crack through an enemy stained-glass pane.
Gameplay read: attack; show a sharp damage slash first, and Cracked glass second. The image must read clearly at 64 px in the in-game card art band.
Story moment: The Duskblade cuts through the dead moon reflected in chapel glass, leaving the enemy pane scored for the next blow.
Composition/framing: Wide horizontal rectangle, full-bleed illustrated background, no transparent background. Foreground blade and arm occupy about half the image height. Midground eclipse disc sits behind the blade. Background chapel arch is quiet and low detail.
Palette: Crimson blade and wound, black eclipse and lead, warm amber blade rim, muted violet-grey chapel, tiny pale crack highlight.
Separation/readability: Keep a clean halo around the blade so it does not merge with the eclipse. The background must be darker and softer than the foreground. At 64 px the viewer should read: red blade, black eclipse, pale crack.
Style/medium: Serious cartoon-gothic stained-glass game art; chunky dark silhouettes; large jewel-tone glass masses; thick lead dividers used sparingly; matte painterly glass texture; controlled inner glow only on the cut.
Constraints: No text, no labels, no watermark, no UI chrome, no card border, no cost icon, no nameplate, no full card mockup, no circular emblem, no badge, no plain icon, no transparent background, no chroma-key background, no photorealism, no anime card art, no busy filigree.
```

## `chisel` / Chisel

- id: `chisel`
- display name: Chisel
- type: attack
- rarity: starter
- target: enemy

Story moment: The Duskblade stops fighting like a duellist and works like a glazier, knocking a precise corner from the enemy's facet. The violence is small, deliberate, and cruelly useful.

Card-art design: Foreground: black-gloved hand holding a steel chisel against a bright blue enemy facet, with a red mallet impact just entering frame. Midground: one triangular glass chip popping free. Background: dark workshop-chapel stones and a muted amber lamp. Palette: steel blue, red impact spark, amber, black lead. Separation/readability note: the chisel, chip, and target facet form a simple triangle that stays clear at thumbnail size.

Image generation prompt:

```text
Use case: stylized-concept
Asset type: Spirebound rectangular card art scene for `chisel` / Chisel
Primary request: Create a wide rectangular 800 x 500 card-art illustration, not an icon and not a badge. Show a black-gloved Duskblade hand pressing a steel chisel into a bright blue enemy glass facet while a squat red mallet impact knocks one triangular chip free.
Gameplay read: attack; show Facet chip first, light damage second. The image must read clearly at 64 px in the in-game card art band.
Story moment: In the ruined glazier's chapel, the Duskblade chips away the enemy's strongest pane with one precise strike.
Composition/framing: Wide horizontal rectangle, full-bleed background. Foreground chisel and hand are large and dark. Midground target facet is a single bright pane with one missing corner. Background workshop stones, chapel ribs, and one small amber lamp stay muted.
Palette: Bright blue enemy facet, dark glove, steel grey chisel, red mallet spark, warm amber lamp, black lead lines.
Separation/readability: Use a strong dark silhouette for the hand and chisel against the blue pane. Keep only one flying chip, large enough to read, with a clear amber rim.
Style/medium: Serious cartoon-gothic stained-glass game art; chunky silhouettes; simplified theatrical scene; 3-5 large jewel-tone glass masses; matte painterly glass texture; warm amber rim light.
Constraints: No text, no labels, no watermark, no UI chrome, no card border, no cost icon, no nameplate, no full card mockup, no badge, no emblem, no transparent background, no chroma-key background, no tiny tool details, no photorealism.
```

## `ashBite` / Ashbite

- id: `ashBite`
- display name: Ashbite
- type: attack
- rarity: starter
- target: enemy

Story moment: The Ashwarden's first attack is a bite of living ash, not a clean blade stroke. It leaves a small wound that keeps burning under the glass.

Card-art design: Foreground: hooked ember-red shard like a jaw biting into a dark enemy pane. Midground: green-orange smolder smoke curling from the bite mark. Background: Ashen Woods trunks simplified into tall black lead shapes. Palette: ember red, coal black, sick green, smoky orange. Separation/readability note: the bite silhouette must be bigger than the smoke; the smoke is a secondary colour cue only.

Image generation prompt:

```text
Use case: stylized-concept
Asset type: Spirebound rectangular card art scene for `ashBite` / Ashbite
Primary request: Create a wide rectangular 800 x 500 card-art illustration, not an icon and not a badge. Show a hooked ember-red glass shard shaped like a biting jaw clamping into a dark enemy pane, with green-orange Smolder smoke leaking from the wound.
Gameplay read: attack; show bite damage first, Smolder second. The image must read clearly at 64 px in the in-game card art band.
Story moment: The Ashwarden feeds a coal-bright shard into enemy glass, and the wound begins to burn from inside.
Composition/framing: Wide horizontal rectangle, full-bleed Ashen Woods background. Foreground bite shard is large and simple. Midground enemy pane is dark with one glowing bite mark. Background trees and ashfall are broad quiet shapes.
Palette: Ember red shard, green-orange coal smoke, black lead, ash grey forest, restrained amber rim light.
Separation/readability: Keep the bite mark as the highest-contrast focal point. Smoke should form two large curls only, never a busy cloud. At 64 px the viewer should read: red bite, green smoke, dark target.
Style/medium: Serious cartoon-gothic stained-glass game art; chunky dark silhouettes; large readable glass masses; matte painterly texture; controlled inner glow at the wound.
Constraints: No text, no labels, no watermark, no UI chrome, no card border, no cost icon, no nameplate, no full card mockup, no badge, no emblem, no transparent background, no chroma-key background, no generic poison dagger, no photorealism.
```

## `twinFangs` / Twin Shards

- id: `twinFangs`
- display name: Twin Shards
- type: attack
- rarity: common
- target: enemy

Story moment: Two broken panes become paired fangs, striking the same weakness before the enemy can close. It is fast but not airy: the hits land like glass teeth.

Card-art design: Foreground: two large crimson glass fangs crossing into the same target chip from opposite diagonals. Midground: one enemy pane with two clean impact bursts. Background: red-brown chapel aisle with long shadows. Palette: crimson, black, amber impact, dark umber. Separation/readability note: the two fangs must be parallel but distinct, avoiding the single-slash read of `strike`.

Image generation prompt:

```text
Use case: stylized-concept
Asset type: Spirebound rectangular card art scene for `twinFangs` / Twin Shards
Primary request: Create a wide rectangular 800 x 500 card-art illustration, not an icon and not a badge. Show two oversized crimson glass fangs in the foreground crossing into one enemy target chip from two different diagonals, each leaving a clear amber impact notch.
Gameplay read: attack; show two-hit damage first. The image must read clearly at 64 px in the in-game card art band.
Story moment: The Duskblade snaps two broken shards into the same weak pane before the enemy can seal the wound.
Composition/framing: Wide horizontal rectangle, full-bleed chapel background. Foreground twin fangs dominate the centre. Midground target chip sits slightly right of centre. Background aisle and arches are dark, simple, and lower contrast.
Palette: Crimson glass fangs, amber impact sparks, black lead, dark umber chapel, small cool blue shadow around the target.
Separation/readability: Leave a visible dark gap between the two fangs. Keep the enemy chip simple and bright enough to catch both hits without becoming busy.
Style/medium: Serious cartoon-gothic stained-glass game art; chunky dark silhouettes; large jewel-tone panes; thick lead dividers used sparingly; matte painterly glass texture.
Constraints: No text, no labels, no watermark, no UI chrome, no card border, no cost icon, no nameplate, no full card mockup, no badge, no emblem, no transparent background, no chroma-key background, no tiny repeated knives.
```

## `quickSlash` / Flicker

- id: `quickSlash`
- display name: Flicker
- type: attack
- rarity: common
- target: enemy

Story moment: A quick cut opens the enemy, and the motion tugs a new card-pane into the lantern light. It should feel like tempo, not raw force.

Card-art design: Foreground: thin crimson slash flashing across the frame from a compact Duskblade wrist. Midground: a small pale card pane flicking upward into amber light. Background: dark blue chapel corridor with one enemy chip nicked at the edge. Palette: red slash, amber card light, blue-black corridor. Separation/readability note: make the slash a single clean streak and the card pane a clear secondary rectangle.

Image generation prompt:

```text
Use case: stylized-concept
Asset type: Spirebound rectangular card art scene for `quickSlash` / Flicker
Primary request: Create a wide rectangular 800 x 500 card-art illustration, not an icon and not a badge. Show a compact dark Duskblade wrist making one thin crimson slash across an enemy chip while a small pale card pane flicks upward into amber lantern light.
Gameplay read: attack; show quick damage first, draw tempo second. The image must read clearly at 64 px in the in-game card art band.
Story moment: The cut is so quick that it pulls the next pane of fate into the Duskblade's hand.
Composition/framing: Wide horizontal rectangle, full-bleed corridor background. Foreground wrist and red slash sit low-left to high-right. Midground card pane rises near the slash trail. Background enemy chip and chapel corridor stay muted.
Palette: Bright crimson slash, amber card glow, pale cream card pane, dark blue-black chapel, black lead.
Separation/readability: The slash must be one clean line with a small glow, not motion blur. The card pane should be a simple bright rectangle separated from the red slash by dark negative space.
Style/medium: Serious cartoon-gothic stained-glass game art; simplified scene; large readable shapes; matte glass texture; warm amber rim light.
Constraints: No text, no labels, no watermark, no UI chrome, no card border, no cost icon, no nameplate, no full card mockup, no badge, no emblem, no transparent background, no chroma-key background, no playing-card symbols.
```

## `heavyBlow` / Quarry Maul

- id: `heavyBlow`
- display name: Quarry Maul
- type: attack
- rarity: common
- target: enemy

Story moment: The Duskblade borrows the language of stonecutters: one slow maul hit that jars a facet loose. The blow should feel heavy, square, and unavoidable.

Card-art design: Foreground: squat red-black stone maul descending from upper left. Midground: enemy glass facet cracked under the impact, with one corner chipped away. Background: quarry-like chapel wall, large stone panes and dust. Palette: brick red, basalt black, amber impact, blue-grey glass. Separation/readability note: the maul silhouette is blocky, distinct from blades and fangs.

Image generation prompt:

```text
Use case: stylized-concept
Asset type: Spirebound rectangular card art scene for `heavyBlow` / Quarry Maul
Primary request: Create a wide rectangular 800 x 500 card-art illustration, not an icon and not a badge. Show a squat red-black quarry maul in the foreground smashing down into a blue-grey enemy glass facet, cracking it and knocking one thick corner chip away.
Gameplay read: attack; show heavy damage first, Facet chip second. The image must read clearly at 64 px in the in-game card art band.
Story moment: A slow stonecutter's blow turns enemy glass into quarry work.
Composition/framing: Wide horizontal rectangle, full-bleed quarry-chapel background. Foreground maul head is large and blocky, entering from upper-left. Midground target facet sits lower-right with one wide crack. Background wall is quiet, dusty, and made of a few large panes.
Palette: Brick red maul edge, basalt black silhouette, amber impact flare, cool blue-grey target glass, muted stone browns.
Separation/readability: Use a crisp dark outline around the maul and a bright value gap at the impact point. Avoid many small cracks; one main fracture and one chip are enough.
Style/medium: Serious cartoon-gothic stained-glass game art; chunky silhouettes; large jewel-tone masses; thick lead dividers used sparingly; matte painterly texture.
Constraints: No text, no labels, no watermark, no UI chrome, no card border, no cost icon, no nameplate, no full card mockup, no badge, no emblem, no transparent background, no chroma-key background, no generic warhammer pin-up.
```

## `cleave` / Fan of Glass

- id: `cleave`
- display name: Fan of Glass
- type: attack
- rarity: common
- target: allEnemies

Story moment: The Duskblade breaks one pane into a red fan that sweeps across the line of enemies. It is a broad cut, not a storm yet.

Card-art design: Foreground: three large crimson shards fanning from the Duskblade's low-left hand across the frame. Midground: three small enemy target panes each nicked by a shard. Background: simple chapel nave in dark teal and black. Palette: crimson, amber, dark teal, black lead. Separation/readability note: the three shard rays must clearly imply all-enemies while staying broad and simple.

Image generation prompt:

```text
Use case: stylized-concept
Asset type: Spirebound rectangular card art scene for `cleave` / Fan of Glass
Primary request: Create a wide rectangular 800 x 500 card-art illustration, not an icon and not a badge. Show three broad crimson glass shards fanning outward from a dark Duskblade hand in the lower-left, sweeping across three small enemy panes arranged across the midground.
Gameplay read: attack; show all-enemies sweeping damage first. The image must read clearly at 64 px in the in-game card art band.
Story moment: One cut becomes a fan of broken glass that catches every enemy in the nave.
Composition/framing: Wide horizontal rectangle, full-bleed chapel nave background. Foreground fan begins lower-left. Midground three enemy panes sit left, centre, and right, each struck by one shard. Background arches are dark teal and low contrast.
Palette: Crimson shards, amber impact points, black lead silhouettes, dark teal chapel, muted grey floor.
Separation/readability: Make exactly three main shard rays, each wide and readable. Keep enemy panes small but simple, so the fan shape reads before any detail.
Style/medium: Serious cartoon-gothic stained-glass game art; chunky silhouettes; large jewel-tone panes; matte glass texture; controlled impact glow.
Constraints: No text, no labels, no watermark, no UI chrome, no card border, no cost icon, no nameplate, no full card mockup, no badge, no emblem, no transparent background, no chroma-key background, no circular magic sigil.
```

## `venomStrike` / Emberbite

- id: `venomStrike`
- display name: Emberbite
- type: attack
- rarity: common
- target: enemy

Story moment: This is Ashbite grown sharper: a fang carrying ash-fire deep enough to spread. The hit looks small, but the smoke is already taking hold.

Card-art design: Foreground: red hooked fang-blade piercing an enemy pane at close range. Midground: thicker green-orange smolder plume threading through cracks. Background: Ashen Woods and a coal-lit chapel threshold. Palette: red fang, toxic green, ember orange, ash grey. Separation/readability note: distinguish from `ashBite` by making the fang sleeker and the smoke trail longer, not by adding more clutter.

Image generation prompt:

```text
Use case: stylized-concept
Asset type: Spirebound rectangular card art scene for `venomStrike` / Emberbite
Primary request: Create a wide rectangular 800 x 500 card-art illustration, not an icon and not a badge. Show a sleek red hooked fang-blade in the foreground piercing an enemy glass pane, with a strong green-orange Smolder plume threading through the cracks behind the point.
Gameplay read: attack; show fang strike first, stronger Smolder second. The image must read clearly at 64 px in the in-game card art band.
Story moment: The Ashwarden sets a coal-tooth under the enemy glass and lets the fire spread along its veins.
Composition/framing: Wide horizontal rectangle, full-bleed Ashen Woods chapel threshold. Foreground fang enters from lower-left. Midground enemy pane sits centre-right with two smoke-lit cracks. Background trees and doorway are muted large shapes.
Palette: Deep crimson fang, green-orange smoke, coal black, ash grey, warm amber rim, small sickly yellow core.
Separation/readability: Keep the fang as one bold silhouette and the smoke as two broad bands. The background should be desaturated and quieter than the wound.
Style/medium: Serious cartoon-gothic stained-glass game art; chunky dark silhouettes; large readable panes; matte painterly texture; controlled inner glow.
Constraints: No text, no labels, no watermark, no UI chrome, no card border, no cost icon, no nameplate, no full card mockup, no badge, no emblem, no transparent background, no chroma-key background, no snake icon, no generic poison bottle.
```

## `lunge` / Dimming Cut

- id: `lunge`
- display name: Dimming Cut
- type: attack
- rarity: common
- target: enemy

Story moment: The Duskblade overextends for a precise forward cut that snuffs the enemy's fire. The result should read as pressure and weakening, not just motion.

Card-art design: Foreground: long dark arm and narrow red blade thrusting horizontally. Midground: small blue enemy flame being sliced down to a grey ember. Background: stretched corridor perspective in muted blues. Palette: crimson, blue flame, grey smoke, black lead. Separation/readability note: the horizontal lunge shape should differ from the diagonal slash family.

Image generation prompt:

```text
Use case: stylized-concept
Asset type: Spirebound rectangular card art scene for `lunge` / Dimming Cut
Primary request: Create a wide rectangular 800 x 500 card-art illustration, not an icon and not a badge. Show a long dark Duskblade arm lunging forward with a narrow crimson blade, slicing through a small blue enemy flame so it collapses into grey smoke.
Gameplay read: attack; show forward damage first, Dimmed debuff second. The image must read clearly at 64 px in the in-game card art band.
Story moment: The Duskblade reaches too far for one exact cut and gutters the enemy's inner fire.
Composition/framing: Wide horizontal rectangle, full-bleed chapel corridor. Foreground arm and blade stretch left-to-right across the lower half. Midground blue flame target sits right of centre. Background corridor lines are muted and simple.
Palette: Crimson blade, black silhouette, blue flame, grey smoke, dark navy chapel, warm amber rim on the wrist.
Separation/readability: Give the blade a clean horizontal read with dark negative space above and below. The blue flame should be small but bright, visibly cut in two.
Style/medium: Serious cartoon-gothic stained-glass game art; chunky silhouette; large colour masses; matte glass texture; controlled glow at the flame.
Constraints: No text, no labels, no watermark, no UI chrome, no card border, no cost icon, no nameplate, no full card mockup, no badge, no emblem, no transparent background, no chroma-key background, no motion-blur smear.
```

## `guardedStrike` / Warden's Edge

- id: `guardedStrike`
- display name: Warden's Edge
- type: attack
- rarity: common
- target: enemy

Story moment: The Duskblade attacks from behind a raised ward, cutting only when the blue glass catches the return blow. It is the first hybrid of blade and shelter.

Card-art design: Foreground: half-blue ward pane held like a shield, with a crimson blade emerging from behind it. Midground: enemy pane hit by the blade and a red counterstrike breaking against the ward. Background: quiet chapel steps. Palette: sapphire, crimson, amber, black lead. Separation/readability note: shield and blade overlap but must not merge; use opposite colours and clear silhouettes.

Image generation prompt:

```text
Use case: stylized-concept
Asset type: Spirebound rectangular card art scene for `guardedStrike` / Warden's Edge
Primary request: Create a wide rectangular 800 x 500 card-art illustration, not an icon and not a badge. Show a dark Duskblade figure striking from behind a half-blue stained-glass ward pane, with a crimson blade emerging past the shield into an enemy pane.
Gameplay read: attack; show damage first, Ward second. The image must read clearly at 64 px in the in-game card art band.
Story moment: The Duskblade lets the ward catch the answer while the edge finds the opening.
Composition/framing: Wide horizontal rectangle, full-bleed chapel steps background. Foreground blue ward occupies left-centre. Crimson blade cuts from behind it toward the right. Midground enemy pane takes the hit; one red counterstrike breaks on the ward.
Palette: Sapphire and cyan ward, crimson blade, amber lantern rim, black figure silhouette, muted grey chapel.
Separation/readability: Keep a dark outline between the blue ward and red blade. The shield should be a half-pane, not a centred emblem, and the blade should clearly exit from behind it.
Style/medium: Serious cartoon-gothic stained-glass game art; chunky dark silhouette; large readable glass masses; matte painterly texture.
Constraints: No text, no labels, no watermark, no UI chrome, no card border, no cost icon, no nameplate, no full card mockup, no badge, no emblem, no transparent background, no chroma-key background, no plain shield icon.
```

## `leechBlade` / Thirsting Shard

- id: `leechBlade`
- display name: Thirsting Shard
- type: attack
- rarity: uncommon
- target: enemy

Story moment: A red shard opens the enemy and drinks the dark oil of the wound back toward the wielder. The healing should feel unsettling, not pastoral.

Card-art design: Foreground: crimson blade embedded in a cracked enemy pane, pulling a dark red oil drop along its edge. Midground: thin green-gold repair thread leading back to a shadowed Duskblade hand. Background: dim apse with muted rose glass. Palette: crimson, black oil, green-gold heal seam, violet-grey. Separation/readability note: one oil drop and one return thread are enough; avoid literal blood spray.

Image generation prompt:

```text
Use case: stylized-concept
Asset type: Spirebound rectangular card art scene for `leechBlade` / Thirsting Shard
Primary request: Create a wide rectangular 800 x 500 card-art illustration, not an icon and not a badge. Show a crimson glass blade embedded in a cracked enemy pane, drawing one dark red oil drop along the blade edge toward a shadowed Duskblade hand, with a thin green-gold repair seam returning to the wielder.
Gameplay read: attack; show blade damage first, healing from unblocked damage second. The image must read clearly at 64 px in the in-game card art band.
Story moment: The shard drinks from the wound and mends its bearer with stolen heat.
Composition/framing: Wide horizontal rectangle, full-bleed dim apse background. Foreground blade and oil drop are large. Midground cracked enemy pane sits right of centre. Background rose glass and altar are muted and low contrast.
Palette: Crimson blade, black-red oil, green-gold heal thread, violet-grey chapel, amber rim light, black lead.
Separation/readability: Keep the oil drop large and isolated against the blade. The healing thread should be a single readable line, not a web.
Style/medium: Serious cartoon-gothic stained-glass game art; chunky silhouettes; large jewel-tone shapes; matte painterly glass texture; controlled glow only on wound and repair seam.
Constraints: No text, no labels, no watermark, no UI chrome, no card border, no cost icon, no nameplate, no full card mockup, no badge, no emblem, no transparent background, no chroma-key background, no gore splash, no photorealism.
```

## `tempest` / Hailglass

- id: `tempest`
- display name: Hailglass
- type: attack
- rarity: uncommon
- target: allEnemies

Story moment: The chapel air freezes into pale glass and hammers every enemy twice. This is weather made of window shards, not a sword flourish.

Card-art design: Foreground: circular sweep of large pale shards around a small red storm core. Midground: several enemy panes struck by hail from different angles. Background: storm-dark vaulted ceiling. Palette: pale blue glass, crimson core, icy white, black lead. Separation/readability note: the ring of hail must be readable as all-enemies and multi-hit without becoming a snow cloud.

Image generation prompt:

```text
Use case: stylized-concept
Asset type: Spirebound rectangular card art scene for `tempest` / Hailglass
Primary request: Create a wide rectangular 800 x 500 card-art illustration, not an icon and not a badge. Show a circular sweep of large pale glass hail shards spinning around a small crimson storm core, striking multiple enemy panes across the scene.
Gameplay read: attack; show all-enemies damage first, repeated hail hits second. The image must read clearly at 64 px in the in-game card art band.
Story moment: The vault chills and falls inward, turning chapel air into a storm of hard glass.
Composition/framing: Wide horizontal rectangle, full-bleed vaulted ceiling background. Foreground hail ring arcs across the frame. Midground three enemy panes are hit at separate points. Background storm vault stays dark and simple.
Palette: Pale blue glass, icy white highlights, crimson core, black lead, dark navy ceiling, small amber impact glints.
Separation/readability: Use 6-8 large shards, not many tiny flecks. Keep the crimson core small but bright, and place enemy panes behind the hail ring with lower contrast.
Style/medium: Serious cartoon-gothic stained-glass game art; chunky silhouettes; large glass masses; matte texture; controlled glow on shard impacts.
Constraints: No text, no labels, no watermark, no UI chrome, no card border, no cost icon, no nameplate, no full card mockup, no badge, no emblem, no transparent background, no chroma-key background, no generic lightning storm.
```

## `uppercut` / Ringing Blow

- id: `uppercut`
- display name: Ringing Blow
- type: attack
- rarity: uncommon
- target: enemy

Story moment: The blow rises from below and rings the enemy like a cracked bell. Its fire dims while the facet splits.

Card-art design: Foreground: dark fist or short maul driving upward into a bell-shaped enemy pane. Midground: vertical fracture and pale sound rings; a small blue flame guttering. Background: hanging chapel bells in dark silhouette. Palette: red-orange impact, brass gold, blue dimmed flame, black lead. Separation/readability note: the upward motion is the unique hook; avoid a generic overhead smash.

Image generation prompt:

```text
Use case: stylized-concept
Asset type: Spirebound rectangular card art scene for `uppercut` / Ringing Blow
Primary request: Create a wide rectangular 800 x 500 card-art illustration, not an icon and not a badge. Show a dark upward fist or short maul striking the underside of a bell-shaped enemy glass pane, splitting it vertically while pale sound rings shake a small blue flame dim.
Gameplay read: attack; show upward damage first, Facet chip and Dimmed second. The image must read clearly at 64 px in the in-game card art band.
Story moment: The Duskblade rings the enemy's glass from below, cracking the pane and guttering its fire.
Composition/framing: Wide horizontal rectangle, full-bleed bell chapel background. Foreground upward strike rises from lower-left. Midground bell-shaped pane sits centre with one vertical crack. Background hanging bells are dark silhouettes.
Palette: Red-orange impact, brass gold ring light, blue flame, black lead, muted charcoal chapel.
Separation/readability: Keep the upward arm and bell pane as large simple shapes. Use two broad sound rings only, separated from the background by pale value contrast.
Style/medium: Serious cartoon-gothic stained-glass game art; chunky dark silhouettes; large panes; matte painterly texture; warm amber rim light.
Constraints: No text, no labels, no watermark, no UI chrome, no card border, no cost icon, no nameplate, no full card mockup, no badge, no emblem, no transparent background, no chroma-key background, no boxing glove caricature.
```

## `flurry` / Splinterstorm

- id: `flurry`
- display name: Splinterstorm
- type: attack
- rarity: uncommon
- target: enemy

Story moment: The enemy is trapped in a tight spiral of quick splinter cuts. It is focused, not all-enemies: many hits on one target.

Card-art design: Foreground: dark Duskblade silhouette anchored low-left, hand releasing a spiral of three red shard slashes. Midground: one central enemy chip caught in the spiral. Background: muted chapel window warped by speed. Palette: red shards, amber impacts, black, deep purple. Separation/readability note: three hits should be visible as separate arcs around one target, not a general storm.

Image generation prompt:

```text
Use case: stylized-concept
Asset type: Spirebound rectangular card art scene for `flurry` / Splinterstorm
Primary request: Create a wide rectangular 800 x 500 card-art illustration, not an icon and not a badge. Show a dark Duskblade silhouette releasing three distinct crimson shard slashes in a tight spiral around one central enemy glass chip.
Gameplay read: attack; show three-hit focused damage first. The image must read clearly at 64 px in the in-game card art band.
Story moment: Splinters circle one enemy faster than it can turn its pane away.
Composition/framing: Wide horizontal rectangle, full-bleed muted chapel window background. Foreground Duskblade hand anchors the lower-left. Midground spiral and target chip occupy the centre. Background panes are stretched and low detail.
Palette: Crimson shard arcs, amber impact dots, black silhouette, deep purple background, small cool blue target edge.
Separation/readability: Make exactly three red arcs, separated by dark negative space. The single enemy chip must remain the centre of the composition.
Style/medium: Serious cartoon-gothic stained-glass game art; chunky silhouettes; large readable shapes; matte glass texture; controlled glow on each hit.
Constraints: No text, no labels, no watermark, no UI chrome, no card border, no cost icon, no nameplate, no full card mockup, no badge, no emblem, no transparent background, no chroma-key background, no dense particle cloud.
```

## `executioner` / Faultline

- id: `executioner`
- display name: Faultline
- type: attack
- rarity: uncommon
- target: enemy

Story moment: The Duskblade waits until the enemy is already cracked, then aligns the final blade with the fault. It should feel like judgement using an existing fracture.

Card-art design: Foreground: heavy vertical black-red blade descending along a bright fracture line. Midground: enemy pane already cracked, with the fracture glowing beneath the blade. Background: austere tribunal chapel, tall shadows. Palette: black, crimson, white crack, amber edge. Separation/readability note: the card's identity is one vertical line and one existing fault, not a guillotine prop.

Image generation prompt:

```text
Use case: stylized-concept
Asset type: Spirebound rectangular card art scene for `executioner` / Faultline
Primary request: Create a wide rectangular 800 x 500 card-art illustration, not an icon and not a badge. Show a heavy black-red blade descending vertically along an existing bright fracture in an enemy glass pane, as if the blade is using the faultline as its guide.
Gameplay read: attack; show damage first, bonus against Cracked glass second. The image must read clearly at 64 px in the in-game card art band.
Story moment: The Duskblade does not make a new wound; it sentences the old crack to open.
Composition/framing: Wide horizontal rectangle, full-bleed austere tribunal chapel background. Foreground blade is a tall central silhouette. Midground enemy pane sits behind it with one glowing vertical crack. Background pillars are dark and simple.
Palette: Black-red blade, bright white fracture, crimson glass, amber rim light, muted charcoal chapel.
Separation/readability: The blade and crack must align but stay distinguishable: dark blade edge beside bright crack glow. Remove extra fractures that weaken the single-line read.
Style/medium: Serious cartoon-gothic stained-glass game art; chunky silhouettes; large panes; matte painterly glass texture; controlled inner glow along the fault.
Constraints: No text, no labels, no watermark, no UI chrome, no card border, no cost icon, no nameplate, no full card mockup, no badge, no emblem, no transparent background, no chroma-key background, no literal scaffold.
```

## `momentum` / Honing Edge

- id: `momentum`
- display name: Honing Edge
- type: attack
- rarity: uncommon
- target: enemy

Story moment: Each play sharpens the same edge, building into a stronger future strike. The image should show growth through repeated honing, not a static buff icon.

Card-art design: Foreground: crimson blade drawn across a glowing amber whetstone arc. Midground: two larger echo-arcs ahead of the blade aiming at a target chip. Background: forge-chapel wall with restrained gold panes. Palette: amber, crimson, black, smoky gold. Separation/readability note: make the growth cue a series of bigger arcs, not small numbers or symbols.

Image generation prompt:

```text
Use case: stylized-concept
Asset type: Spirebound rectangular card art scene for `momentum` / Honing Edge
Primary request: Create a wide rectangular 800 x 500 card-art illustration, not an icon and not a badge. Show a crimson blade being drawn across a glowing amber whetstone arc in the foreground, with two larger red-gold echo arcs ahead of it aimed at a single enemy chip.
Gameplay read: attack; show damage now first, growing damage over repeated plays second. The image must read clearly at 64 px in the in-game card art band.
Story moment: Every pass over the stone teaches the blade to cut deeper next time.
Composition/framing: Wide horizontal rectangle, full-bleed forge-chapel background. Foreground blade and whetstone arc sit left-centre. Midground two growing arcs lead toward a target chip on the right. Background forge panes are warm but quiet.
Palette: Crimson blade, amber honing glow, smoky gold background, black lead, small cool target highlight.
Separation/readability: Make the three arcs clearly increase in size and brightness while staying broad. Keep the target chip simple and secondary.
Style/medium: Serious cartoon-gothic stained-glass game art; chunky silhouettes; large glass masses; matte painterly texture; warm controlled glow.
Constraints: No text, no labels, no watermark, no UI chrome, no card border, no cost icon, no nameplate, no full card mockup, no badge, no emblem, no transparent background, no chroma-key background, no numeric symbols.
```

## `oblivionStrike` / Bellstrike

- id: `oblivionStrike`
- display name: Bellstrike
- type: attack
- rarity: rare
- target: enemy

Story moment: A ceremonial bell hammer falls into a black-red rose window and the whole pane answers like a death knell. This is the rare, decisive shatter strike.

Card-art design: Foreground: massive bell-hammer blade, black silhouette with red edge, striking a central rose window. Midground: concentric cracks and two large chipped facets flying free. Background: cathedral bell tower geometry, dark gold and violet. Palette: black-red, gold, crimson, violet. Separation/readability note: rare ceremony can be richer, but the hammer, rose window, and cracks remain the only read.

Image generation prompt:

```text
Use case: stylized-concept
Asset type: Spirebound rectangular card art scene for `oblivionStrike` / Bellstrike
Primary request: Create a wide rectangular 800 x 500 card-art illustration, not an icon and not a badge. Show a massive black bell-hammer blade with a crimson edge striking a black-red rose window enemy pane, sending two large facet chips outward and concentric cracks through the glass.
Gameplay read: attack; show huge damage first, extra Facet chip second. The image must read clearly at 64 px in the in-game card art band.
Story moment: The bell of endings is struck directly into enemy glass.
Composition/framing: Wide horizontal rectangle, full-bleed bell-tower cathedral background. Foreground hammer blade dominates from upper-left. Midground rose window target sits centre-right. Background tower ribs and gold-violet panes add rare ceremony without crowding the impact.
Palette: Black-red hammer, crimson rose glass, dark gold bell light, muted violet shadows, bright amber crack highlights.
Separation/readability: Keep the hammer silhouette very dark against the glowing rose window. Use only two large flying chips and broad concentric cracks.
Style/medium: Serious cartoon-gothic stained-glass game art; chunky silhouettes; rare ceremonial composition; large jewel-tone panes; matte painterly texture; warm amber rim.
Constraints: No text, no labels, no watermark, no UI chrome, no card border, no cost icon, no nameplate, no full card mockup, no badge, no emblem, no transparent background, no chroma-key background, no ornate micro-panels.
```

## `phantomBlades` / Phantom Blades

- id: `phantomBlades`
- display name: Phantom Blades
- type: attack
- rarity: rare
- target: enemy

Story moment: Every card in hand becomes a ghost edge, layering impossible cuts over the real one. The image should imply many blades without turning into clutter.

Card-art design: Foreground: one solid crimson blade held by a dark hand, with three translucent red-violet blade echoes offset behind it. Midground: small pale card panes feeding the echoes. Background: dim mirror chapel. Palette: crimson, violet, pale card glass, black. Separation/readability note: echoes are large and translucent, not dozens of knives.

Image generation prompt:

```text
Use case: stylized-concept
Asset type: Spirebound rectangular card art scene for `phantomBlades` / Phantom Blades
Primary request: Create a wide rectangular 800 x 500 card-art illustration, not an icon and not a badge. Show one solid crimson blade in a dark Duskblade hand, with three large translucent red-violet phantom blade echoes offset behind it and small pale card panes feeding those echoes.
Gameplay read: attack; show multiple phantom damage blades first, card-in-hand scaling second. The image must read clearly at 64 px in the in-game card art band.
Story moment: The Duskblade's hand fills with every possible edge the deck has not yet spent.
Composition/framing: Wide horizontal rectangle, full-bleed mirror chapel background. Foreground solid blade sits sharp and dark. Midground three phantom blades fan behind it toward one enemy pane. Background mirrors and card panes are quiet.
Palette: Crimson real blade, translucent violet-red echoes, pale cream card panes, black lead, cool blue mirror shadows, amber rim light.
Separation/readability: Make the real blade darkest and most opaque. Keep exactly three phantom echoes, each broad and separated by value gaps, so the thumbnail reads as layered blades.
Style/medium: Serious cartoon-gothic stained-glass game art; chunky silhouettes; rare but controlled ceremony; matte glass texture; soft inner glow in the echoes.
Constraints: No text, no labels, no watermark, no UI chrome, no card border, no cost icon, no nameplate, no full card mockup, no badge, no emblem, no transparent background, no chroma-key background, no dozens of tiny blades.
```

## `devour` / Eat the Flame

- id: `devour`
- display name: Eat the Flame
- type: attack
- rarity: rare
- target: enemy

Story moment: The Duskblade kills by swallowing the enemy's fire into the lantern, gaining heat and mending through the theft. It should feel hungry, ritualistic, and dangerous.

Card-art design: Foreground: black lead maw or lantern mouth opening around a bright ember card. Midground: enemy flame being pulled from a cracked pane into the maw; tiny green-gold repair glint on the wielder's hand. Background: dark shrine with Ashwarden smoke. Palette: black, ember orange, red, green-gold. Separation/readability note: the maw and ember are the read; healing and Embers stay subtle.

Image generation prompt:

```text
Use case: stylized-concept
Asset type: Spirebound rectangular card art scene for `devour` / Eat the Flame
Primary request: Create a wide rectangular 800 x 500 card-art illustration, not an icon and not a badge. Show a black lead lantern-maw in the foreground swallowing a bright ember card and pulling a flame out of a cracked enemy pane, with a small green-gold repair glint on a shadowed hand.
Gameplay read: attack; show lethal flame consumption first, Embers and healing second. The image must read clearly at 64 px in the in-game card art band.
Story moment: The enemy's last fire is eaten before it can rise, and the stolen heat mends the bearer.
Composition/framing: Wide horizontal rectangle, full-bleed dark shrine background. Foreground lantern-maw opens left-centre. Midground ember card and flame stream pull from the enemy pane on the right. Background smoke and shrine ribs are muted.
Palette: Deep black lead maw, white-hot ember orange, crimson wound, green-gold repair glint, ash grey smoke, warm amber rim.
Separation/readability: The maw should be a large black shape around one bright ember. Keep the flame stream simple and thick; avoid many sparks.
Style/medium: Serious cartoon-gothic stained-glass game art; chunky silhouettes; rare ritual scene; large jewel-tone panes; matte painterly texture; controlled glow.
Constraints: No text, no labels, no watermark, no UI chrome, no card border, no cost icon, no nameplate, no full card mockup, no badge, no emblem, no transparent background, no chroma-key background, no cartoon monster face, no gore.
```

## `annihilate` / Requiem

- id: `annihilate`
- display name: Requiem
- type: attack
- rarity: rare
- target: allEnemies

Story moment: A red funeral hymn rolls through the chapel and burns every enemy pane from within. This is not a single weapon strike; it is a killing wave carrying ash-fire.

Card-art design: Foreground: broad crimson requiem wave shaped like a low choir ribbon. Midground: multiple enemy panes cracking and filling with green-orange smolder. Background: dark nave with tall mourning windows. Palette: funeral red, smolder green-orange, black, muted violet. Separation/readability note: all-enemies should read as several target panes caught by one wave.

Image generation prompt:

```text
Use case: stylized-concept
Asset type: Spirebound rectangular card art scene for `annihilate` / Requiem
Primary request: Create a wide rectangular 800 x 500 card-art illustration, not an icon and not a badge. Show a broad crimson funeral wave, like a low choir ribbon of glass, rolling across several enemy panes and filling their cracks with green-orange Smolder.
Gameplay read: attack; show all-enemies damage first, Smolder applied to all enemies second. The image must read clearly at 64 px in the in-game card art band.
Story moment: The chapel sings a killing requiem, and every hostile pane begins to burn from inside.
Composition/framing: Wide horizontal rectangle, full-bleed dark nave background. Foreground crimson wave sweeps left-to-right across the lower-middle. Midground three enemy panes are caught in the wave. Background mourning windows are tall, muted, and simple.
Palette: Deep funeral crimson, green-orange smolder cores, black lead, muted violet nave, small amber highlights.
Separation/readability: Make the wave one broad readable ribbon. Keep enemy panes as three simple shapes with visible smolder cracks, not many tiny targets.
Style/medium: Serious cartoon-gothic stained-glass game art; chunky silhouettes; rare ceremonial scene; large glass masses; matte painterly texture; controlled inner glow.
Constraints: No text, no labels, no watermark, no UI chrome, no card border, no cost icon, no nameplate, no full card mockup, no badge, no emblem, no transparent background, no chroma-key background, no musical-note symbols, no crowded choir faces.
```

## `quakeblow` / Quakeblow

- id: `quakeblow`
- display name: Quakeblow
- type: attack
- rarity: uncommon
- target: enemy

Story moment: The Breaker of Panes drives force through the floor of the glass world, cracking the enemy from beneath. It is an unlock card and should feel earned, but still blunt and readable.

Card-art design: Foreground: stone-red gauntlet or fist slamming into a glass floor. Midground: thick fault line racing upward into a standing enemy pane, knocking out two facets. Background: basalt chapel floor and low arches. Palette: basalt black, red stone, amber crack, blue-grey target. Separation/readability note: the ground fault gives a unique silhouette versus maul and uppercut cards.

Image generation prompt:

```text
Use case: stylized-concept
Asset type: Spirebound rectangular card art scene for `quakeblow` / Quakeblow
Primary request: Create a wide rectangular 800 x 500 card-art illustration, not an icon and not a badge. Show a stone-red gauntlet slamming into a glass floor in the foreground, sending a thick amber fault line upward into a standing enemy pane and knocking out two large facet chips.
Gameplay read: attack; show quake impact first, extra Facet chip second. The image must read clearly at 64 px in the in-game card art band.
Story moment: The Breaker of Panes hits the ground and lets the crack climb into the enemy.
Composition/framing: Wide horizontal rectangle, full-bleed basalt chapel floor. Foreground fist impact sits lower-left. Midground fault line travels diagonally to the enemy pane on the right. Background low arches are dark and restrained.
Palette: Stone red gauntlet, basalt black floor, amber fault glow, blue-grey enemy pane, black lead, dusty orange impact.
Separation/readability: Make the fault line broad and singular. Use two large chips only, separated from the target by bright amber rim light.
Style/medium: Serious cartoon-gothic stained-glass game art; chunky silhouettes; large panes; matte painterly texture; controlled impact glow.
Constraints: No text, no labels, no watermark, no UI chrome, no card border, no cost icon, no nameplate, no full card mockup, no badge, no emblem, no transparent background, no chroma-key background, no generic earthquake cracks covering the whole image.
```

## `resonantLance` / Resonant Lance

- id: `resonantLance`
- display name: Resonant Lance
- type: attack
- rarity: rare
- target: enemy

Story moment: A lance of ringing glass finds panes already staggered or cracked and doubles the harm by vibrating through the flaw. It is precision plus ceremony.

Card-art design: Foreground: long gold-red lance crossing almost the full width, vibrating with pale duplicate edges. Midground: cracked enemy pane pierced at its centre, concentric rings travelling through the fault. Background: bell-chapel and rose-window geometry in dark blue. Palette: gold, red, pale sound rings, deep blue. Separation/readability note: the lance must remain the dominant straight shape; resonance appears as few large rings.

Image generation prompt:

```text
Use case: stylized-concept
Asset type: Spirebound rectangular card art scene for `resonantLance` / Resonant Lance
Primary request: Create a wide rectangular 800 x 500 card-art illustration, not an icon and not a badge. Show a long gold-red glass lance crossing nearly the full width of the image, piercing the centre of a cracked enemy pane while broad pale resonance rings travel along the fracture.
Gameplay read: attack; show precise lance damage first, double damage against Cracked or Staggered glass second. The image must read clearly at 64 px in the in-game card art band.
Story moment: The lance sings through the flaw, making the old crack carry twice the force.
Composition/framing: Wide horizontal rectangle, full-bleed bell-chapel background. Foreground lance is the main straight silhouette from left to right. Midground cracked target pane sits right of centre. Background rose geometry is dark and low contrast.
Palette: Gold-red lance, pale ivory resonance rings, crimson crack glow, deep blue chapel, black lead, small amber highlights.
Separation/readability: Keep the lance as one clean line with two ghosted vibration edges only. Use three large resonance rings, not many ripples.
Style/medium: Serious cartoon-gothic stained-glass game art; chunky silhouettes; rare ceremonial scene; large jewel-tone panes; matte painterly glass texture.
Constraints: No text, no labels, no watermark, no UI chrome, no card border, no cost icon, no nameplate, no full card mockup, no badge, no emblem, no transparent background, no chroma-key background, no sci-fi laser beam.
```

## `novaflare` / Novaflare

- id: `novaflare`
- display name: Novaflare
- type: attack
- rarity: rare
- target: enemy

Story moment: The lantern spends its stored Embers in one white-hot flare. The enemy is not hit by a blade; it is caught at the centre of a burst of paid fire.

Card-art design: Foreground: open lantern mouth releasing a white-hot amber nova. Midground: enemy pane silhouetted against the blast with red shards flying outward. Background: dark spire chamber with faint ember beads orbiting the lantern. Palette: white amber, gold, crimson, black. Separation/readability note: the nova core must not wash out the whole image; keep a dark lantern silhouette and dark outer frame.

Image generation prompt:

```text
Use case: stylized-concept
Asset type: Spirebound rectangular card art scene for `novaflare` / Novaflare
Primary request: Create a wide rectangular 800 x 500 card-art illustration, not an icon and not a badge. Show a dark open lantern in the foreground releasing a white-hot amber nova into an enemy pane, with large crimson shards thrown outward from the blast.
Gameplay read: attack; show Ember-powered nova damage first. The image must read clearly at 64 px in the in-game card art band.
Story moment: Stored Embers leave the lantern at once and become a single flare bright enough to break the enemy.
Composition/framing: Wide horizontal rectangle, full-bleed dark spire chamber background. Foreground lantern silhouette anchors left-centre. Midground nova core and enemy pane sit centre-right. Background has a few faint ember beads orbiting in darkness.
Palette: White-hot amber core, gold flare, crimson shards, black lantern and lead, dark violet chamber, tiny orange ember beads.
Separation/readability: Preserve a strong dark lantern silhouette and dark edge vignette around the bright nova. Use broad rays and large shards, not overexposed noise.
Style/medium: Serious cartoon-gothic stained-glass game art; chunky silhouettes; rare ceremonial action; large jewel-tone panes; matte painterly texture; controlled inner glow.
Constraints: No text, no labels, no watermark, no UI chrome, no card border, no cost icon, no nameplate, no full card mockup, no badge, no emblem, no transparent background, no chroma-key background, no generic fireball in empty space.
```

## `shardstorm` / Shardstorm

- id: `shardstorm`
- display name: Shardstorm
- type: attack
- rarity: rare
- target: allEnemies

Story moment: After a hundred kills, the whole field remembers how to break. Large red and pale shards become a controlled storm that batters every enemy twice.

Card-art design: Foreground: radial storm of large red and pale shards around a dark calm eye. Midground: several enemy panes at the edge of the storm, each struck by two broad shard trails. Background: high spire window collapsing into darkness. Palette: crimson, pale glass, amber impacts, black, violet. Separation/readability note: rare density is allowed, but only with large shard shapes and a clear central eye.

Image generation prompt:

```text
Use case: stylized-concept
Asset type: Spirebound rectangular card art scene for `shardstorm` / Shardstorm
Primary request: Create a wide rectangular 800 x 500 card-art illustration, not an icon and not a badge. Show a radial storm of large crimson and pale glass shards circling a dark calm eye, battering several enemy panes around the edge with two broad shard trails each.
Gameplay read: attack; show all-enemies damage first, repeated storm hits second. The image must read clearly at 64 px in the in-game card art band.
Story moment: The battlefield becomes a stained-glass storm, and every hostile pane is struck more than once.
Composition/framing: Wide horizontal rectangle, full-bleed high spire window background. Foreground storm ring fills most of the frame. Midground enemy panes sit around the outer arc. Background spire window collapses into dark violet and black.
Palette: Crimson shards, pale blue-white glass, amber impact points, black lead, dark violet spire, small smoky gold highlights.
Separation/readability: Use 10-12 large shards maximum, not a cloud of splinters. Keep a dark central eye and clear outer enemy panes so the storm reads at thumbnail size.
Style/medium: Serious cartoon-gothic stained-glass game art; chunky silhouettes; rare ceremonial action; large jewel-tone glass masses; matte painterly texture; controlled impact glow.
Constraints: No text, no labels, no watermark, no UI chrome, no card border, no cost icon, no nameplate, no full card mockup, no badge, no emblem, no transparent background, no chroma-key background, no fine particle confetti.
```
