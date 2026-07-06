# Power And Special Card Specs

Scope: remaining power, status, and curse card-art prompt specs after the
approved readable-baseline milestone for `strike`, `defend`, and `empower`.
`empower` is intentionally excluded.

Global production rule: every image is a full-bleed 800x500 rectangular
card-art scene, not a badge, icon, card mock-up, transparent cut-out, or
chroma-key source. Keep the serious cartoon-gothic stained-glass style, strong
foreground/background separation, large readable shapes, and no baked-in text,
labels, UI, cost, frame, or nameplate.

## `agility` / Glazier's Poise

- id / display name / type / rarity / target: `agility` / Glazier's Poise /
  power / uncommon / self

Story moment: The Duskblade stops fighting and becomes a single calm line in
the glass. Every later Ward will come from balance rather than force.

Card-art design: Foreground: a tall dark Duskblade silhouette balanced on one
needle-thin blue glass point, sword lowered and body still. Midground: two clean
mirrored cyan ward arcs hold around the shoulders like a lasting posture, not a
parry. Background: quiet violet chapel floor panes and a dim rose-window echo.
Palette: sapphire, cyan, blue-violet shadow, small amber lantern rim.
Separation/readability: black figure against pale arcs, simple floor geometry,
and a clear halo gap around the body; at 64 px it should read as a poised figure
on a blue point.

Image generation prompt:

```text
Use case: stylized-concept
Asset type: Spirebound rectangular card art scene for `agility` / Glazier's Poise
Primary request: Create a wide 800x500 rectangular card-art illustration, not an icon and not a badge. Show the Duskblade as a tall dark foreground silhouette balanced on one needle-thin blue glass point, sword lowered, with two clean mirrored cyan ward arcs around the shoulders to show a lasting state of Poise.
Gameplay read: power; show persistent Poise and balance first, future Ward support second. This is an ongoing self-state, not a dodge, attack, or one-off impact. The image must read clearly at 64 px in the in-game card art band.
Story moment: The Duskblade becomes a calm glazier's line in a ruined chapel, turning balance into protection for later turns.
Style/medium: serious cartoon-gothic stained-glass game art; chunky dark silhouette; large readable jewel-glass shapes; very few thick lead dividers; matte painterly glass texture; warm amber rim light; controlled inner glow only on the blue poise arcs.
Composition/framing: wide horizontal rectangle, full-bleed background, clear foreground/midground/background layering. Foreground figure on a fine blue point; midground mirrored ward arcs; background quiet violet chapel floor and dim rose-window echo. No centred emblem, no isolated badge, no floating logo.
Palette: sapphire and cyan Poise arcs, black silhouette, blue-violet chapel shadow, small warm amber lantern rim.
Separation/readability direction: strong dark body silhouette, clean cyan arcs, quieter lower-contrast background, visible negative space around the figure. At 64 px the viewer should read: poised dark figure, blue balance point, lasting ward arcs.
Constraints: no text, no labels, no watermark, no UI chrome, no card frame, no cost icon, no nameplate, no full card mockup, no decorative badge, no circular medallion, no plain icon, no transparent background, no chroma-key background, no photorealism, no anime card art, no tiny filigree, no busy background competing with the subject.
```

## `ironSkin` / Vitrify

- id / display name / type / rarity / target: `ironSkin` / Vitrify / power /
  uncommon / self

Story moment: The Duskblade lets kiln-cold glass close over the skin. The body
becomes a slow machine for renewing Ward at each turn's end.

Card-art design: Foreground: dark torso and arm silhouette half-encased in
angular silver-blue glass armour. Midground: large hexagonal panes lock over the
shoulders and ribs like hardening plates. Background: muted violet forge-chapel
with a low amber kiln glow. Palette: steel blue, silver, deep violet, black
lead, restrained amber. Separation/readability: bright armour plates wrap a
simple dark body shape while the forge stays soft; at 64 px it should read as a
figure vitrified into armour.

Image generation prompt:

```text
Use case: stylized-concept
Asset type: Spirebound rectangular card art scene for `ironSkin` / Vitrify
Primary request: Create a wide 800x500 rectangular card-art illustration, not an icon and not a badge. Show a dark Duskblade torso and arm in the foreground, half-encased in angular silver-blue stained-glass armour plates, with large hexagonal panes locking over the shoulders and ribs.
Gameplay read: power; show persistent vitrified armour first, recurring Ward second. This is a hardened body-state that keeps returning at turn end, not a shield block against a single hit.
Story moment: In a muted forge-chapel, kiln-cold glass seals over the Duskblade's skin and turns the body into a slow warding engine.
Style/medium: serious cartoon-gothic stained-glass game art; chunky dark silhouette; large readable jewel-glass masses; sparse thick lead dividers; matte painterly glass texture; warm amber rim light; controlled inner glow on the hardening plates.
Composition/framing: wide horizontal rectangle, full-bleed background. Foreground dark upper body and silver-blue armour plates; midground locking hex panes; background soft violet forge arches with a low amber kiln glow. No centred armour emblem, no isolated badge, no floating logo.
Palette: steel blue, silver cyan, black lead, deep violet forge shadow, restrained amber kiln rim.
Separation/readability direction: bright armour edges around a simple dark body, large plate shapes, muted background with fewer panes. At 64 px the viewer should read: dark figure becoming silver-blue glass armour.
Constraints: no text, no labels, no watermark, no UI chrome, no card frame, no cost icon, no nameplate, no full card mockup, no decorative badge, no circular medallion, no plain icon, no transparent background, no chroma-key background, no photorealism, no anime card art, no tiny filigree, no black-on-black detail, no busy background competing with the foreground subject.
```

## `regrowth` / Hearthglow

- id / display name / type / rarity / target: `regrowth` / Hearthglow / power /
  uncommon / self

Story moment: The lantern's old warmth finds the cracks and patiently seals
them. It is not a burst of healing, but a hearth that keeps returning.

Card-art design: Foreground: kneeling dark figure with one cracked glass hand
and chest pane exposed. Midground: green-gold repair seams stitch across the
cracks from a low hearth glow. Background: ruined shrine hearth, soft and dark,
with only a few large panes. Palette: green-gold, warm amber, moss shadow, deep
violet, black lead. Separation/readability: luminous repair seams cross a dark
silhouette and the hearth sits behind as support; at 64 px it should read as
the body being slowly mended.

Image generation prompt:

```text
Use case: stylized-concept
Asset type: Spirebound rectangular card art scene for `regrowth` / Hearthglow
Primary request: Create a wide 800x500 rectangular card-art illustration, not an icon and not a badge. Show a kneeling dark Duskblade silhouette in the foreground with a cracked glass hand and chest pane, while green-gold repair seams stitch the cracks closed from a low hearth glow.
Gameplay read: power; show persistent healing warmth first, slow crack repair second. This is a recurring self-state, not a single potion splash or nature spell.
Story moment: In a broken shrine, the lantern's old hearthlight returns each turn and patiently seals the Duskblade's damaged glass.
Style/medium: serious cartoon-gothic stained-glass game art; chunky dark silhouettes; large readable jewel-tone glass masses; sparse thick lead dividers; matte painterly glass texture; warm amber rim light; controlled inner glow along the green-gold repair seams.
Composition/framing: wide horizontal rectangle, full-bleed background. Foreground kneeling figure and exposed cracked pane; midground clear repair seams; background quiet ruined hearth and dark chapel stones. No centred healing emblem, no isolated badge, no floating logo.
Palette: green-gold repair light, warm amber hearth, moss-green shadow, deep violet chapel, black lead.
Separation/readability direction: bright repair seam over a dark body, simple kneeling silhouette, lower-contrast hearth background, darkened edges. At 64 px the viewer should read: cracked figure being mended by green-gold hearthlight.
Constraints: no text, no labels, no watermark, no UI chrome, no card frame, no cost icon, no nameplate, no full card mockup, no decorative badge, no circular medallion, no plain icon, no transparent background, no chroma-key background, no photorealism, no anime card art, no tiny filigree, no busy background competing with the repair action.
```

## `ascension` / Rising Litany

- id / display name / type / rarity / target: `ascension` / Rising Litany /
  power / rare / self

Story moment: Each vow rises above the climber until the body becomes the base
of a permanent hymn of fire. The power is ceremonial, but still one clear
upward read.

Card-art design: Foreground: dark Duskblade standing still on chapel steps,
sword lowered. Midground: stacked violet-gold vow panes rise from the chest into
a tall halo, with small red-gold Fervor flames repeating upward. Background:
high cathedral shaft and dim rose window. Palette: violet, gold, red-gold
Fervor, black lead, cool blue shadows. Separation/readability: large dark figure
below a bright vertical vow stack, quieter edges; at 64 px it should read as a
figure being permanently lifted by a rising litany.

Image generation prompt:

```text
Use case: stylized-concept
Asset type: Spirebound rectangular card art scene for `ascension` / Rising Litany
Primary request: Create a wide 800x500 rectangular card-art illustration, not an icon and not a badge. Show the Duskblade standing still on chapel steps in the foreground, sword lowered, while stacked violet-gold vow panes rise from the chest into a tall halo with small red-gold Fervor flames climbing upward.
Gameplay read: rare power; show ongoing start-of-turn Fervor first, ceremonial ascent second. This is a lasting vow-state, not an attack blast or single spell impact.
Story moment: The climber becomes the base of a permanent hymn, and each turn the litany lifts more inner fire into the body.
Style/medium: serious cartoon-gothic stained-glass game art; chunky dark silhouette; large readable jewel-glass masses; sparse thick lead dividers; matte painterly glass texture; warm amber rim light; controlled inner glow in the vow stack.
Composition/framing: wide horizontal rectangle, full-bleed background. Foreground standing figure; midground vertical vow panes and Fervor flames; background high cathedral shaft and dim rose window. Rare power ceremony, but one primary upward shape. No centred emblem, no isolated badge, no floating logo.
Palette: deep violet, antique gold, red-gold Fervor, black lead, cool blue side shadows.
Separation/readability direction: dark figure anchored below bright vertical halo, broad panes, quiet background edges, clear negative space around the vow stack. At 64 px the viewer should read: still figure, rising golden-violet litany, inner fire increasing.
Constraints: no text, no labels, no watermark, no UI chrome, no card frame, no cost icon, no nameplate, no full card mockup, no decorative badge, no circular medallion, no plain icon, no transparent background, no chroma-key background, no photorealism, no anime card art, no tiny filigree, no busy background competing with the rising power.
```

## `bastion` / Anneal

- id / display name / type / rarity / target: `bastion` / Anneal / power /
  rare / self

Story moment: The ward is not raised for a blow; it is fused into the climb
itself. Held light becomes architecture around the lantern.

Card-art design: Foreground: still Duskblade silhouette and amber lantern core
inside a permanent blue-gold glass fortress. Midground: thick buttress panes
interlock around the figure, forming a durable ward shell with no incoming
attack. Background: dim violet cathedral nave, softened. Palette: sapphire,
cyan, gold, amber, black lead, violet shadow. Separation/readability: fortress
shield shape is broad and bright around a dark figure; at 64 px it should read
as lasting ward architecture, distinct from a one-off block.

Image generation prompt:

```text
Use case: stylized-concept
Asset type: Spirebound rectangular card art scene for `bastion` / Anneal
Primary request: Create a wide 800x500 rectangular card-art illustration, not an icon and not a badge. Show a still dark Duskblade silhouette and amber lantern core enclosed inside a permanent blue-gold stained-glass fortress, with thick buttress panes interlocking around the figure.
Gameplay read: rare power; show Ward that no longer expires first, durable annealed architecture second. This is a lasting defensive state, not a moment of blocking an incoming strike.
Story moment: Held light hardens into architecture around the lantern, becoming a bastion that stays with the climber.
Style/medium: serious cartoon-gothic stained-glass game art; chunky dark silhouette; large readable jewel-glass panes; sparse thick lead dividers; matte painterly glass texture; warm amber rim light; controlled inner glow from the lantern core.
Composition/framing: wide horizontal rectangle, full-bleed background. Foreground figure and lantern core; midground broad blue-gold fortress ward shell; background dim violet cathedral nave. No red impact line, no incoming attack, no centred shield emblem, no isolated badge, no floating logo.
Palette: sapphire, cyan, old gold, warm amber lantern, black lead, muted violet nave.
Separation/readability direction: bright fortress shape around the dark figure, clean silhouette, broad buttresses, quiet low-contrast background. At 64 px the viewer should read: permanent blue-gold ward fortress around a lantern.
Constraints: no text, no labels, no watermark, no UI chrome, no card frame, no cost icon, no nameplate, no full card mockup, no decorative badge, no circular medallion, no plain icon, no transparent background, no chroma-key background, no photorealism, no anime card art, no tiny filigree, no busy background competing with the fortress silhouette.
```

## `frenzy` / Overglow

- id / display name / type / rarity / target: `frenzy` / Overglow / power /
  rare / self

Story moment: The Duskblade overfeeds the inner fire until the body cracks, but
the candles around it keep relighting. The state is powerful and dangerous at
the same time.

Card-art design: Foreground: hunched dark figure with an overhot red-gold glass
heart straining against black lead ribs. Midground: visible Cracked lines split
the torso while a row of small amber energy candles reignites behind it.
Background: dark forge chapel with overheated red panes kept soft. Palette:
red-gold, hot amber, black lead, dark crimson, violet smoke. Separation/readability:
the glowing heart and candle row sit on a strong black body shape; at 64 px it
should read as an overcharged, cracked persistent state, not an attack.

Image generation prompt:

```text
Use case: stylized-concept
Asset type: Spirebound rectangular card art scene for `frenzy` / Overglow
Primary request: Create a wide 800x500 rectangular card-art illustration, not an icon and not a badge. Show the Duskblade as a hunched dark foreground silhouette with an overhot red-gold glass heart straining against black lead ribs, cracked lines visible across the torso, and small amber energy candles reigniting behind it.
Gameplay read: rare power; show dangerous ongoing energy gain first, self-inflicted Cracked glass second. This is a persistent overheat state, not a weapon swing, explosion, or one-off attack.
Story moment: The inner fire is fed too hard; the body cracks under the heat, but every turn the candles come back alight.
Style/medium: serious cartoon-gothic stained-glass game art; chunky dark silhouette; large readable jewel-glass shapes; sparse thick lead dividers; matte painterly glass texture; warm amber rim light; controlled inner glow concentrated in the heart and candle flames.
Composition/framing: wide horizontal rectangle, full-bleed background. Foreground hunched figure and glowing heart; midground crack lines and reigniting candles; background dark forge chapel with soft overheated panes. No target, no impact burst, no centred heart emblem, no isolated badge, no floating logo.
Palette: hot red-gold heart, amber candles, black lead ribs, dark crimson glass, violet smoke shadows.
Separation/readability direction: highest contrast on the heart inside a clear black silhouette, simple candle row, muted forge background. At 64 px the viewer should read: overhot cracked figure and returning energy flames.
Constraints: no text, no labels, no watermark, no UI chrome, no card frame, no cost icon, no nameplate, no full card mockup, no decorative badge, no circular medallion, no plain icon, no transparent background, no chroma-key background, no photorealism, no anime card art, no tiny filigree, no busy background competing with the overglow state.
```

## `virulence` / Emberfang

- id / display name / type / rarity / target: `virulence` / Emberfang / power /
  rare / self

Story moment: The Ashwarden does not strike yet. Smolder settles into the
blade-hand so every later attack carries a living ember bite.

Card-art design: Foreground: dark Ashwarden/Duskblade figure in profile, blade
held low and still. Midground: green-orange fanged smoke halo coils around the
weapon hand and wrist, with small coal teeth embedded in a violet power ring.
Background: ashen chapel, muted and smoky. Palette: sick green, ember orange,
violet, black lead, ash grey. Separation/readability: green-orange fang crescent
cuts around the black silhouette while the background stays matte; at 64 px it
should read as a lasting infectious attack aura, not the attack itself.

Image generation prompt:

```text
Use case: stylized-concept
Asset type: Spirebound rectangular card art scene for `virulence` / Emberfang
Primary request: Create a wide 800x500 rectangular card-art illustration, not an icon and not a badge. Show a dark Ashwarden-like Duskblade figure in profile, blade held low and still, with a green-orange fanged smoke halo coiling around the weapon hand and wrist.
Gameplay read: rare power; show persistent Smolder-on-attack aura first, infectious ember fang second. The figure is preparing future contaminated strikes, not attacking now.
Story moment: Smolder settles into the blade-hand, so every later attack will leave a living ember bite.
Style/medium: serious cartoon-gothic stained-glass game art; chunky dark silhouette; large readable jewel-glass masses; sparse thick lead dividers; matte painterly glass texture; warm amber rim light; controlled sickly inner glow in the fanged smoke.
Composition/framing: wide horizontal rectangle, full-bleed background. Foreground still figure and low blade; midground green-orange fanged smoke and small coal teeth set into a violet power ring; background muted ashen chapel. No enemy impact, no lunging attack, no centred fang emblem, no isolated badge, no floating logo.
Palette: sick green smoke, ember orange coals, muted violet power ring, ash grey background, black lead silhouette.
Separation/readability direction: bright fanged crescent around a simple dark figure, smoky background kept low contrast, clear edge light on the weapon hand. At 64 px the viewer should read: green-orange fang aura on a still combatant.
Constraints: no text, no labels, no watermark, no UI chrome, no card frame, no cost icon, no nameplate, no full card mockup, no decorative badge, no circular medallion, no plain icon, no transparent background, no chroma-key background, no photorealism, no anime card art, no tiny filigree, no busy background competing with the fanged aura.
```

## `pyreheart` / Pyreheart

- id / display name / type / rarity / target: `pyreheart` / Pyreheart / power /
  rare / self

Story moment: The lantern is rebuilt as a furnace-heart. Each turn, it pulses
and drops a new Ember into the climb.

Card-art design: Foreground: dark Duskblade torso with the lantern fused into a
large cathedral-heart furnace. Midground: counted amber ember beads orbit and
feed inward toward the heart, clearly separate from any attack burst.
Background: violet-gold furnace chapel and rose arch, subdued. Palette: amber,
gold, red-orange, violet, black lead. Separation/readability: heart furnace is
one large bright mass inside a dark silhouette; ember beads form a simple ring;
at 64 px it should read as an ongoing Ember engine.

Image generation prompt:

```text
Use case: stylized-concept
Asset type: Spirebound rectangular card art scene for `pyreheart` / Pyreheart
Primary request: Create a wide 800x500 rectangular card-art illustration, not an icon and not a badge. Show a dark Duskblade torso in the foreground with the lantern fused into a large cathedral-heart furnace, while amber ember beads orbit and feed inward toward the heart.
Gameplay read: rare power; show ongoing Ember generation first, furnace-heart state second. This is a persistent lantern engine, not an attack nova or fireball.
Story moment: The climber's lantern becomes a furnace-heart that pulses at the start of each turn and drops new Embers into the climb.
Style/medium: serious cartoon-gothic stained-glass game art; chunky dark silhouette; large readable jewel-glass shapes; sparse thick lead dividers; matte painterly glass texture; warm amber rim light; controlled inner glow in the heart furnace and ember beads.
Composition/framing: wide horizontal rectangle, full-bleed background. Foreground torso and heart furnace; midground simple orbit of ember beads; background subdued violet-gold furnace chapel and rose arch. Rare power ceremony, but one central readable engine shape. No centred heart badge, no isolated emblem, no floating logo.
Palette: bright amber and gold heart furnace, red-orange ember cores, black lead silhouette, muted violet chapel shadow.
Separation/readability direction: large bright heart inside a dark torso, simple bead orbit, background lower contrast and darker at edges. At 64 px the viewer should read: glowing pyre heart with orbiting Embers.
Constraints: no text, no labels, no watermark, no UI chrome, no card frame, no cost icon, no nameplate, no full card mockup, no decorative badge, no circular medallion, no plain icon, no transparent background, no chroma-key background, no photorealism, no anime card art, no tiny filigree, no busy background competing with the heart furnace.
```

## `nightSight` / Night Sight

- id / display name / type / rarity / target: `nightSight` / Night Sight /
  power / uncommon / self

Story moment: On the Unlit Way, the climber learns to read the dark itself.
Cards slide into view each turn from a place the lantern cannot fully reach.

Card-art design: Foreground: dark Duskblade silhouette with a low amber lantern
held close to the ground. Midground: a large blue-violet eye opens inside a dark
rose window, and two or three pale card panes drift into the lantern beam.
Background: near-black Unlit Way arches, simple and quiet. Palette: indigo,
blue-violet, cyan-white card edges, amber lantern, black lead. Separation/readability:
eye and card panes are bright against a near-black background; at 64 px it
should read as night vision plus extra cards, not a curse.

Image generation prompt:

```text
Use case: stylized-concept
Asset type: Spirebound rectangular card art scene for `nightSight` / Night Sight
Primary request: Create a wide 800x500 rectangular card-art illustration, not an icon and not a badge. Show a dark Duskblade silhouette holding a low amber lantern in the foreground, while a large blue-violet eye opens inside a dark rose window and two or three pale card panes drift into the lantern beam.
Gameplay read: power; show persistent Night Sight and extra draw first, cards pulled from darkness second. This is a lasting self-state, not a one-turn draw trick or hostile curse.
Story moment: On the Unlit Way, the climber learns to read the dark itself, and unseen cards slide into sight at the start of each turn.
Style/medium: serious cartoon-gothic stained-glass game art; chunky dark silhouette; large readable jewel-glass shapes; sparse thick lead dividers; matte painterly glass texture; warm amber rim light; controlled inner glow in the eye and card panes.
Composition/framing: wide horizontal rectangle, full-bleed background. Foreground low lantern and figure; midground blue-violet eye plus drifting card panes; background near-black Unlit Way arches. No centred eye emblem, no isolated badge, no floating logo.
Palette: deep indigo, blue-violet eye, cyan-white card pane edges, warm amber lantern, black lead.
Separation/readability direction: bright eye and card panes against near-black arches, clear amber lantern pool, simple silhouette. At 64 px the viewer should read: lantern, night eye, cards emerging from darkness.
Constraints: no text, no labels, no watermark, no UI chrome, no card frame, no cost icon, no nameplate, no full card mockup, no decorative badge, no circular medallion, no plain icon, no transparent background, no chroma-key background, no photorealism, no anime card art, no tiny filigree, no busy background competing with the eye and card panes.
```

## `wound` / Shard

- id / display name / type / rarity / target: `wound` / Shard / status /
  special / none

Story moment: A dead shard has no power and no ritual. It only rattles in the
deck and cuts the hand that draws it.

Card-art design: Foreground: one heavy ash-grey glass shard wedged diagonally
across a broken rectangular pane, like junk lodged in the deck. Midground:
small dull splinters and dust, with no heroic glow. Background: cold stone floor
or ruined chapel table, soft and low contrast. Palette: ash grey, dead blue,
black lead, a tiny dried dark-red nick. Separation/readability: shard silhouette
crosses a lighter cracked pane, with harsh simple geometry; at 64 px it should
read as unwanted broken glass.

Image generation prompt:

```text
Use case: stylized-concept
Asset type: Spirebound rectangular card art scene for `wound` / Shard
Primary request: Create a wide 800x500 rectangular card-art illustration, not an icon and not a badge. Show one heavy ash-grey glass shard wedged diagonally across a broken rectangular glass pane in the foreground, with small dull splinters and dust around it.
Gameplay read: status; show unwanted dead shard first, harmful junk card weight second. It should feel damaging and useless, but still production-quality.
Story moment: A dead piece of broken glass rattles in the deck and cuts the hand that draws it.
Style/medium: serious cartoon-gothic stained-glass game art; chunky dark shard silhouette; large readable broken glass masses; sparse thick lead dividers; matte dusty texture; almost no glow; sober and uncomfortable rather than heroic.
Composition/framing: wide horizontal rectangle, full-bleed background. Foreground diagonal shard and broken pane; midground small splinters; background cold stone floor or ruined chapel table, soft and muted. No centred shard emblem, no isolated badge, no floating logo.
Palette: ash grey, dead blue-grey, black lead, faint dried dark-red nick, cold stone shadow.
Separation/readability direction: dark shard over lighter cracked pane, very simple geometry, low-detail background, no ornate ceremony. At 64 px the viewer should read: junk shard stuck in broken glass.
Constraints: no text, no labels, no watermark, no UI chrome, no card frame, no cost icon, no nameplate, no full card mockup, no decorative badge, no circular medallion, no plain icon, no transparent background, no chroma-key background, no photorealism, no anime card art, no tiny filigree, no premium heroic ceremony, no busy background.
```

## `burn` / Cinder

- id / display name / type / rarity / target: `burn` / Cinder / status /
  special / none

Story moment: The card has already caught. It sits in the hand like a coal that
punishes waiting.

Card-art design: Foreground: scorched broken rectangular glass pane, its lower
corner a hot cinder with one cracked ember edge. Midground: smoke ribbon, ash
flakes, and a dull orange heat seam. Background: charred altar slab, muted and
grainy. Palette: ash black, warm grey, ember red, orange, black lead.
Separation/readability: one hot corner is the focal point while the rest is
dead matte glass; at 64 px it should read as a harmful burning junk card.

Image generation prompt:

```text
Use case: stylized-concept
Asset type: Spirebound rectangular card art scene for `burn` / Cinder
Primary request: Create a wide 800x500 rectangular card-art illustration, not an icon and not a badge. Show a scorched broken rectangular glass pane in the foreground, mostly dead ash-grey, with one lower corner glowing as a hot cinder and a cracked ember edge.
Gameplay read: status; show unwanted burn damage first, dead card weight second. It should feel harmful in the hand, not like a useful fire power.
Story moment: The card has already caught, and waiting with it in hand is like holding a coal.
Style/medium: serious cartoon-gothic stained-glass game art; chunky broken silhouette; large readable ash and ember glass shapes; sparse thick lead dividers; matte dusty texture; controlled hot glow only at the cinder corner.
Composition/framing: wide horizontal rectangle, full-bleed background. Foreground scorched pane and hot corner; midground smoke ribbon, ash flakes, and dull heat seam; background charred altar slab, muted and grainy. No centred flame emblem, no isolated badge, no floating logo.
Palette: ash black, warm grey, ember red, orange cinder glow, black lead.
Separation/readability direction: hot cinder corner contrasts with a dead matte pane, simple smoke shape, quiet charred background. At 64 px the viewer should read: burnt junk pane with one dangerous ember corner.
Constraints: no text, no labels, no watermark, no UI chrome, no card frame, no cost icon, no nameplate, no full card mockup, no decorative badge, no circular medallion, no plain icon, no transparent background, no chroma-key background, no photorealism, no anime card art, no tiny filigree, no heroic fireball, no busy background.
```

## `hex` / Hex

- id / display name / type / rarity / target: `hex` / Hex / curse / special /
  none

Story moment: The curse refuses the lantern's mercy. It locks itself into the
glass and drinks from the climber at the end of each turn.

Card-art design: Foreground: warped purple-black hexagonal window embedded in a
black lead trap, with bent lead locks crossing it. Midground: toxic magenta and
sick-green glints pulse inside the cracked geometry, but the shape stays
contained and hostile. Background: distorted shrine panes bending inward,
muted. Palette: void purple, black lead, toxic magenta, sick green, cold grey.
Separation/readability: bright warped hex centre is trapped by matte black lead
against a quiet background; at 64 px it should read as a curse that refuses to
burn, not a friendly power aura.

Image generation prompt:

```text
Use case: stylized-concept
Asset type: Spirebound rectangular card art scene for `hex` / Hex
Primary request: Create a wide 800x500 rectangular card-art illustration, not an icon and not a badge. Show a warped purple-black hexagonal window embedded in a black lead trap in the foreground, with bent lead locks crossing the cracked geometry and toxic magenta light trapped inside.
Gameplay read: curse; show harmful persistent Hex first, refusal to burn second. It should feel hostile, trapped, and unwanted, not like a usable power.
Story moment: The curse locks itself into the glass and refuses the lantern's mercy, feeding from the climber whenever it remains in hand.
Style/medium: serious cartoon-gothic stained-glass game art; chunky black lead silhouette; large readable warped glass masses; sparse thick dividers; matte painterly glass texture; controlled toxic inner glow; uncomfortable and elegant, not heroic.
Composition/framing: wide horizontal rectangle, full-bleed background. Foreground trapped warped hex window; midground bent lead locks and sick glints; background distorted shrine panes bending inward, muted and low contrast. No centred emblem, no isolated badge, no floating logo, no friendly halo.
Palette: void purple, black lead, toxic magenta, small sick-green glints, cold grey shrine shadow.
Separation/readability direction: bright purple-magenta curse centre trapped by matte black lead, quiet distorted background, large simple hex geometry. At 64 px the viewer should read: trapped purple Hex curse that will not burn.
Constraints: no text, no labels, no watermark, no UI chrome, no card frame, no cost icon, no nameplate, no full card mockup, no decorative badge, no circular medallion, no plain icon, no transparent background, no chroma-key background, no photorealism, no anime card art, no tiny filigree, no friendly power aura, no busy background.
```
