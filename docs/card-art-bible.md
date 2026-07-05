# Card Art Bible

This document captures the current study notes for Spirebound card artwork. It
is intended to be read before any new card image generation pass.

The global asset style remains in [`style-bible.md`](./style-bible.md). This
file narrows that style to the 60 gameplay cards in `src/assets/cards/`.

## Purpose

Card art has one job: make the card's gameplay idea recognisable inside the
small art window while preserving the stained-glass identity of Spirebound.

The runtime already renders the card frame, cost, name, type, rarity, text,
hover glare, and keyword highlighting. The generated PNG must therefore be the
art object only, not a complete card design.

## Runtime Constraints

- Path: `src/assets/cards/<card-id>.png`.
- `<card-id>` must match the internal key in `src/data.js`.
- Format: transparent PNG, 512 x 512.
- Runtime fallback: if the PNG is missing, `cardArtSvg(cardId, type)` in
  `src/art.js` provides a procedural SVG fallback.
- Card art is placed inside `.card-art` in `src/styles.css`.
- Desktop display size is roughly 93 x 93 px inside the card art band.
- Phone portrait display size is roughly 72 x 72 px.
- Phone landscape display size is roughly 64 x 64 px.
- The in-game view uses `object-fit: contain`, so square emblems are not
  cropped, but they must survive very small display sizes.

Consequence: every card image should work as a large, simple, centred emblem or
single readable gameplay moment. Fine illustration detail is allowed only after
the main shape already reads at 64 px.

## Generation Workflow

Use the current project workflow from [`generated-art-workflow.md`](./generated-art-workflow.md):

1. Generate the source image with built-in Codex Image Gen directly.
2. Optionally clean up the selected source with Nano Banana Pro.
3. Convert to alpha locally.
4. Run outer rim cleanup when the source has a warm sticker-like edge.
5. Review in `?gallery=1` before accepting.

Do not make the shell wrappers the primary workflow for future card work. They
exist for historical/batch context, but direct Image Gen usage is the preferred
authoring path for this project.

## Locked Card Style

Use the same visual family as the character assets:

- serious cartoon-gothic stained-glass game art
- chunky dark outer silhouette
- large jewel-tone glass masses
- thick lead dividers, used sparingly
- matte painterly glass texture
- warm amber rim light, controlled rather than noisy
- soft inner glow limited to the card's focal symbol
- transparent background
- no text, labels, watermark, UI chrome, frame, cost, name, or type label

Cards should feel like small relic windows from the same cathedral world, not
generic fantasy icons.

## Card Design Principles From Study

These principles come from the repo audit plus external card-game design study.

### Visibility

The most important gameplay information must be visible where the player
actually sees the card. For Spirebound, the generated artwork does not carry
cost or rules text, but it still needs to broadcast the card's action at hand
size. The top-level read should be visible in under a second.

### Hierarchy

Treat the artwork like a gameplay diagram:

1. Primary silhouette or emblem.
2. Direction or motion.
3. One mechanic cue, such as Ward, Smolder, Kindle, Facet chip, Ember, draw, or
   Fervor.
4. Colour and glass texture.
5. Small decorative detail.

If the detail fights the main shape, remove the detail.

### Brevity

Repeated mechanics need repeated visual shorthand. Do not invent a totally new
symbol language for every card. A player should learn the visual grammar across
the deck.

### Context Of Use

Cards are fanned, hovered, dragged, and read on mobile. This makes the current
top-left cost badge and text layout important, but the generated art should not
compete with those UI elements. Avoid bright corners and heavy noise near the
outer edges of the square image unless the central silhouette remains dominant.

### Type Consistency

The card frame already colours type, but art should reinforce it:

- Attack: red, crimson, ember, sharp diagonals, cuts, shards, impact arcs.
- Skill: blue, cyan, silver, shields, wards, hands, lantern shelter, mirrored
  surfaces.
- Power: violet, gold, persistent flames, halos, vows, cathedral geometry,
  ongoing aura.
- Status: sick green, ash grey, broken glass, simple negative object.
- Curse: void purple, black lead, warped symmetry, contained hex geometry.

Do not rely on colour alone. Shape must carry the type too.

### Icon Simplicity

Icons work when they are simple, familiar, and reused. A shield can mean Ward, a
flame can mean Smolder or Ember, a crack can mean Cracked or Facet chip, and a
card silhouette can mean draw. Complex symbolic chains should stay in the rules
text, not in the artwork.

### Art Must Match Power

Visual weight affects perceived card strength. Rare and dramatic cards may have
more ceremony, but starter and common cards should still look deliberate and
premium. Do not make low-power cards look throwaway; instead make their symbols
simpler.

## Spirebound Mechanic Cues

Use these cues consistently when a card needs to show a mechanic:

| Mechanic | Visual cue |
|---|---|
| Damage | sharp red glass slash, impact shard burst, cut line |
| Multi-hit | repeated parallel cuts or a fan of shards |
| Ward | blue shield pane, held lantern light, mirrored arc |
| Draw | small card panes being pulled into light |
| Energy | candle flame, lit wick, amber spark |
| Kindle | card edge burning inward into an ember |
| Ember | small amber coal, lantern fuel bead |
| Smolder | green-orange coal smoke, ember bite, ash cloud |
| Cracked | visible fracture line through a pane |
| Facet chip | chisel mark, cracked gem corner, missing glass shard |
| Dimmed | snuffed blue-grey flame or muted eye |
| Fervor | inner red-gold blaze inside glass |
| Poise | balanced mirrored stance, clean blue line |
| Heal | hearth glow, green-gold repair seam |
| Lose HP | blood-oil drop, dark red lantern spill |
| Exhaust / burn | card pane dissolving to ash |
| All enemies | radial wave or multiple small target shards |

## Taxonomy Proposal

Card art should be generated through five axes. The first two come directly from
`src/data.js`; the others are visual-production tags used to keep the deck
coherent.

1. Rules type: `attack`, `skill`, `power`, `status`, or `curse`.
2. Rarity: `starter`, `common`, `uncommon`, `rare`, or `special`.
3. Mechanical family: the main gameplay idea that the art must read first.
4. Target geometry: `enemy`, `self`, `allEnemies`, or `none`.
5. Aspect/source flavour: Duskblade, Ashwarden, neutral lantern, or corrupted
   junk.

Current counts:

| Axis | Buckets |
|---|---|
| Type | 25 attack, 22 skill, 10 power, 2 status, 1 curse |
| Rarity | 7 starter, 11 common, 22 uncommon, 17 rare, 3 special |
| Target | 25 enemy, 25 self, 7 all-enemies, 3 none |

### Type Grammar

| Type | Shape language | Palette bias | Must avoid |
|---|---|---|---|
| Attack | diagonal cuts, shard impacts, weapon silhouettes, forward motion | crimson, ember red, black lead, small amber cores | shield-first reads, calm symmetrical mandalas |
| Skill | shields, hands, lantern shelter, mirrored arcs, prepared tools | blue, cyan, silver, warm lantern centre | aggressive blade dominance |
| Power | circular halos, rose windows, persistent flame, vow geometry | violet, gold, deep blue, controlled aura | one-off impact bursts that look like attacks |
| Status | broken fragments, dead-weight shards, ash, simple negative tokens | ash grey, sick green, ember red | premium heroic ceremony |
| Curse | warped symmetry, void centre, trap geometry, refusal-to-burn cues | void purple, black lead, toxic magenta | readable friendly power aura |

### Rarity Grammar

Rarity changes the amount of ceremony, not the base readability rule.

| Rarity | Art budget | Treatment |
|---|---|---|
| Starter | one iconic object, plain silhouette, almost no secondary detail | teach the grammar |
| Common | one mechanic plus one supporting cue | clean, fast to read, low ornament |
| Uncommon | one mechanic plus a clear combo or twist | more asymmetry, stronger focal glow |
| Rare | one ceremonial moment, larger rose-window geometry, bolder contrast | powerful but still one primary read |
| Special | deliberately uncomfortable junk/curse read | simpler, harsher, less beautiful |

Do not use rarity as an excuse for micro-panels. A rare may be more ceremonial,
but it should still be readable as a black silhouette.

### Target Geometry

| Target | Composition cue |
|---|---|
| `enemy` | motion or pressure moves left-to-right or lower-left to upper-right; focal point is an impact, wound, or hostile target |
| `self` | central, upward, or enclosing geometry; focal point is protection, fuel, preparation, or transformation |
| `allEnemies` | radial wave, fan, storm, choir, or multiple small target shards |
| `none` | isolated dead object, broken card pane, or sealed bad token |

### Mechanical Families

Cards may belong to more than one family. For generation, pick the first family
as the main read and the second as a supporting cue.

| Family | Cards | Primary visual read |
|---|---|---|
| Direct damage | `strike`, `twinFangs`, `quickSlash`, `leechBlade`, `tempest`, `flurry`, `oblivionStrike`, `phantomBlades`, `novaflare`, `shardstorm` | blade, shard, impact, or storm |
| Facet / shatter | `eclipseSlash`, `chisel`, `heavyBlow`, `uppercut`, `executioner`, `limitBreak`, `quakeblow`, `resonantLance` | cracked pane, missing shard, chisel mark, ringing fault line |
| Ward / defence | `defend`, `smother`, `guardedStrike`, `brace`, `sidestep`, `deflect`, `bulwark`, `fortify`, `aegis`, `flawlessForm`, `bastion`, `emberdance` | shield pane, mirrored arc, held lantern wall |
| Draw / tempo | `firstSpark`, `quickSlash`, `sidestep`, `preparation`, `deflect`, `surge`, `tithe`, `nightSight` | card panes pulled into light, quick spark, eye in darkness |
| Kindle / ember economy | `firstSpark`, `preparation`, `surge`, `cripple`, `devour`, `offering`, `limitBreak`, `catalyst`, `tithe`, `pyreheart`, `emberdance`, `novaflare` | card burning inward, ember bead, lantern fuel |
| Smolder / Ashwarden | `ashBite`, `smother`, `venomStrike`, `toxicMist`, `annihilate`, `catalyst`, `virulence`, `ashenChoir` | green-orange coal smoke, ember bite, ash cloud, infectious flame |
| Debuff / control | `lunge`, `uppercut`, `cripple`, `warCry`, `executioner`, `resonantLance` | dimmed flame, cracked target, snuffed strength |
| Scaling / persistent power | `momentum`, `empower`, `agility`, `ironSkin`, `regrowth`, `ascension`, `bastion`, `frenzy`, `virulence`, `pyreheart`, `nightSight` | persistent halo, inner flame, body-state emblem |
| Risk / sacrifice | `bloodRite`, `offering`, `frenzy`, `devour` | blood-oil, overhot glass, consumed fire |
| Junk / curse | `wound`, `burn`, `hex` | broken card, cinder, trapped void sigil |

## 60-Card Production Sort

Use this sort order for production. It is not the runtime order; it is the art
pipeline order. The goal is to lock the visual language first, then generate
nearby cards while the same grammar is fresh.

Rules:

- Each internal card id appears once.
- Internal ids are the source of truth; display names can change without
  changing asset filenames.
- Keep the first hook in each family simple. Later cards can add ceremony or a
  second mechanic, but they should not steal the starter silhouette.
- If two cards look too similar in thumbnail review, the later card in this
  table must change silhouette first, palette second, detail last.

| Order | Card | Type / rarity / target | Production lane | Unique art hook |
|---:|---|---|---|---|
| 01 | `strike` / Edge | attack / starter / enemy | Grammar anchor | single crimson blade cutting one round red pane |
| 02 | `defend` / Ward | skill / starter / self | Grammar anchor | plain blue shield pane with one amber lantern dot |
| 03 | `empower` / Inner Blaze | power / uncommon / self | Grammar anchor | red-gold flame growing inside a ribbed glass heart |
| 04 | `wound` / Shard | status / special / none | Grammar anchor | dead grey shard wedged across a broken card pane |
| 05 | `burn` / Cinder | status / special / none | Grammar anchor | smoking ember card with one hot cracked edge |
| 06 | `hex` / Hex | curse / special / none | Grammar anchor | warped purple hex sigil locked in black lead |
| 07 | `eclipseSlash` / Eclipse Slash | attack / starter / enemy | Starter identity | red blade crossing a black eclipse disc with one fracture |
| 08 | `chisel` / Chisel | attack / starter / enemy | Starter identity | small steel chisel removing a bright blue glass corner |
| 09 | `firstSpark` / First Spark | skill / starter / self | Starter identity | card pane lit from below while a second pane rises |
| 10 | `ashBite` / Ashbite | attack / starter / enemy | Starter identity | green-orange ember bite cut into a red glass edge |
| 11 | `smother` / Smother | skill / starter / enemy | Starter identity | blue ward hand pressing smoke out of a coal |
| 12 | `twinFangs` / Twin Shards | attack / common / enemy | Common foundation | two parallel red glass fangs crossing the same target chip |
| 13 | `quickSlash` / Flicker | attack / common / enemy | Common foundation | thin red slash with a small card pane flicking upward |
| 14 | `heavyBlow` / Quarry Maul | attack / common / enemy | Common foundation | squat red stone-maul pane striking a cracked facet |
| 15 | `cleave` / Fan of Glass | attack / common / allEnemies | Common foundation | broad fan of three red shards sweeping outward |
| 16 | `venomStrike` / Emberbite | attack / common / enemy | Common foundation | red fang carrying green-orange ember smoke |
| 17 | `lunge` / Dimming Cut | attack / common / enemy | Common foundation | long forward cut snuffing a small blue enemy flame |
| 18 | `guardedStrike` / Warden's Edge | attack / common / enemy | Common foundation | red blade emerging from behind a half-blue shield |
| 19 | `brace` / Held Light | skill / common / self | Common foundation | lantern held behind a simple crescent shield |
| 20 | `sidestep` / Glasstep | skill / common / self | Common foundation | blue footstep pane slipping beside a red impact line |
| 21 | `preparation` / Tinder | skill / common / self | Common foundation | neat stack of card panes beside one unlit match |
| 22 | `deflect` / Refract | skill / common / self | Common foundation | mirrored blue pane bending a red shard away |
| 23 | `leechBlade` / Thirsting Shard | attack / uncommon / enemy | Shatter and control | red blade drinking a dark oil drop from a crack |
| 24 | `tempest` / Hailglass | attack / uncommon / allEnemies | Shatter and control | circular storm of pale shards around a red core |
| 25 | `uppercut` / Ringing Blow | attack / uncommon / enemy | Shatter and control | upward bell-shaped impact splitting a pane vertically |
| 26 | `flurry` / Splinterstorm | attack / uncommon / enemy | Shatter and control | fast spiral of small red slashes around one target chip |
| 27 | `executioner` / Faultline | attack / uncommon / enemy | Shatter and control | heavy vertical judgement blade aligned with a fracture |
| 28 | `momentum` / Honing Edge | attack / uncommon / enemy | Shatter and control | blade being sharpened by a rising amber arc |
| 29 | `toxicMist` / Ashcloud | skill / uncommon / allEnemies | Shatter and control | wide green-grey smoke sheet rolling over small target shards |
| 30 | `cripple` / Gutter | skill / uncommon / enemy | Shatter and control | collapsing red flame trapped under a blue snuffer ring |
| 31 | `warCry` / Shatterhymn | skill / uncommon / allEnemies | Shatter and control | ringing mouth-bell shape sending crack waves outward |
| 32 | `quakeblow` / Quakeblow | attack / uncommon / enemy | Shatter and control | stone-red fist causing a ground-like glass fault line |
| 33 | `ashenChoir` / Ashen Choir | skill / uncommon / enemy | Shatter and control | three ash mouths singing smoke into one ember |
| 34 | `resonantLance` / Resonant Lance | attack / rare / enemy | Shatter and control | long gold-red lance vibrating through concentric cracks |
| 35 | `bulwark` / Glasswall | skill / uncommon / self | Support state | tall layered blue wall with thick lead buttresses |
| 36 | `surge` / Struck Match | skill / uncommon / self | Support state | bright match flare lighting a row of card panes |
| 37 | `fortify` / Mirrorlight | skill / uncommon / self | Support state | two mirrored shields reflecting one amber lantern |
| 38 | `bloodRite` / Blood for Oil | skill / uncommon / self | Support state | red oil drop falling into a lantern reservoir |
| 39 | `agility` / Glazier's Poise | power / uncommon / self | Support state | balanced blue figure-line standing on a fine glass point |
| 40 | `ironSkin` / Vitrify | power / uncommon / self | Support state | body-shaped pane hardening into silver-blue glass armour |
| 41 | `regrowth` / Hearthglow | power / uncommon / self | Support state | green-gold repair seam knitting a cracked pane |
| 42 | `tithe` / Tithe of Panes | skill / uncommon / self | Support state | three amber coal beads offered in a shallow lantern bowl |
| 43 | `nightSight` / Night Sight | power / uncommon / self | Support state | blue-violet eye opening inside a dark rose window |
| 44 | `emberdance` / Emberdance | skill / uncommon / self | Support state | dancing blue shield ribbons around three amber sparks |
| 45 | `oblivionStrike` / Bellstrike | attack / rare / enemy | Rare ceremony | bell hammer blade striking a black-red rose window |
| 46 | `phantomBlades` / Phantom Blades | attack / rare / enemy | Rare ceremony | three translucent red blades offset like echoes |
| 47 | `devour` / Eat the Flame | attack / rare / enemy | Rare ceremony | black maw of lead swallowing a bright ember card |
| 48 | `annihilate` / Requiem | attack / rare / allEnemies | Rare ceremony | red funeral wave breaking multiple target panes |
| 49 | `aegis` / Cathedral Glass | skill / rare / self | Rare ceremony | gold-crowned blue cathedral shield rose window |
| 50 | `offering` / Pyre Tithe | skill / rare / self | Rare ceremony | hand presenting a card into a tall amber pyre |
| 51 | `limitBreak` / Annealing Rite | skill / rare / allEnemies | Rare ceremony | furnace ring cracking many panes while a card burns clean |
| 52 | `catalyst` / Bellows | skill / rare / enemy | Rare ceremony | bellows pushing green-orange smoke into a brighter coal |
| 53 | `ascension` / Rising Litany | power / rare / self | Rare ceremony | upward stack of violet-gold vows becoming a halo |
| 54 | `bastion` / Anneal | power / rare / self | Rare ceremony | permanent blue-gold fortress shield around a lantern core |
| 55 | `frenzy` / Overglow | power / rare / self | Rare ceremony | overhot red-gold glass heart straining against lead ribs |
| 56 | `virulence` / Emberfang | power / rare / self | Rare ceremony | green-orange fang halo infecting a violet power ring |
| 57 | `pyreheart` / Pyreheart | power / rare / self | Rare ceremony | cathedral heart furnace with counted ember beads orbiting |
| 58 | `flawlessForm` / Flawless Form | skill / rare / self | Rare ceremony | perfect blue mirror-body with no cracks and hard rim light |
| 59 | `novaflare` / Novaflare | attack / rare / enemy | Rare ceremony | white-hot amber nova at the centre of red shards |
| 60 | `shardstorm` / Shardstorm | attack / rare / allEnemies | Rare ceremony | full radial storm of large red and pale glass shards |

## Prototype Demos To Pitch

Generate prototype demos under `scratch/style-tests/` first, review as contact
sheets, and promote nothing until one direction is approved.

Approved Round 2 pitch artifacts live in
[`artifacts/card-prototype-demos/`](./artifacts/card-prototype-demos/):

- `prototype-1-type-grammar-r2.png`
- `prototype-2-rarity-ladder-r2.png`
- `prototype-3-signature-mechanics-r2.png`

These pitch sheets were created with built-in Codex Image Gen. They are not
production card assets: they use review backgrounds and sheet layouts rather
than final per-card transparent PNGs.

The exact Round 2 prompts are stored in
[`artifacts/card-prototype-demos/prompt-ledger.md`](./artifacts/card-prototype-demos/prompt-ledger.md).

Round 1 feedback: too dark; rarity ladder did not pass because the shields felt
like repeated panels rather than distinct rarity tiers.

Round 2 correction: brighter review ground, higher-value jewel glass, no
black-on-black details, and rarity escalation through silhouette, material,
halo/arch structure, and ceremony.

### Prototype 1: Type Grammar Contact Sheet

Goal: prove that the five rules types are distinguishable at 64 px while still
belonging to one stained-glass deck.

Cards:

- `strike` / Edge: attack, starter, direct damage.
- `defend` / Ward: skill, starter, defence.
- `empower` / Inner Blaze: power, uncommon, persistent Fervor.
- `burn` / Cinder: status, special, harmful dead card.
- `hex` / Hex: curse, special, refusal-to-burn curse.

Pitch: a five-tile contact sheet with the same camera, same alpha, and no card
frame. This should answer the basic question: can a player tell attack, skill,
power, status, and curse apart before reading text?

Acceptance gate: each image reads as its type in colour and in black silhouette.
If this fails, do not generate wider batches.

### Prototype 2: Rarity Ladder In One Mechanic

Goal: test how rarity should escalate without losing the one-symbol rule.

Cards:

- `defend` / Ward: starter defence, plain shield pane.
- `brace` / Held Light: common defence, shield plus held lantern.
- `bulwark` / Glasswall: uncommon defence, heavier wall silhouette.
- `aegis` / Cathedral Glass: rare defence, ceremonial shield rose window.
- `bastion` / Anneal: rare power, permanent ward state rather than one block.

Pitch: one family, five intensity levels. The common mistake is making rare art
too ornate; this prototype should establish how much ceremony is enough.

Acceptance gate: `aegis` and `bastion` can be richer, but `defend` must not look
cheap and the whole ladder must still be legible at hand size.

### Prototype 3: Signature Mechanics Pack

Goal: test Spirebound-specific mechanics that make the deck different from a
generic fantasy card set.

Cards:

- `chisel` / Chisel: Facet chip.
- `eclipseSlash` / Eclipse Slash: damage plus Cracked.
- `firstSpark` / First Spark: draw plus Kindle.
- `tithe` / Tithe of Panes: Ember economy.
- `ashBite` / Ashbite: Smolder attack.
- `catalyst` / Bellows: Smolder doubling plus Kindle.

Pitch: six cards covering shatter/facet, kindle/ember, and smolder. This is the
most important identity test after the type grammar.

Acceptance gate: the images should feel impossible to drop into an ordinary
deckbuilder without losing meaning. If they feel like stock sword/shield/spell
icons, the theme is not strong enough.

## Composition Rules For Cards

- Square emblem or single moment, centred.
- Dark vignette edges are allowed, but the file must keep transparent corners.
- Leave generous alpha around any protruding shards or flame.
- No whole card frame. No scroll, parchment, mana symbol, nameplate, text box,
  cost badge, rarity badge, or UI border.
- Prefer one focal object over a full scene.
- Avoid tiny repeated stained-glass panels; use 3-5 larger panes when possible.
- Avoid photographic lighting, glossy 3D render, anime card-art tropes, and
  generic fantasy spell icons.
- The black silhouette test must still identify the card family.

## Prompt Template

Use this shape for a new card prompt:

```text
Use case: stylized-concept
Asset type: Spirebound card art alpha-ready source
Primary request: <card name>, <one sentence that translates the card text into a single emblem or moment>.
Gameplay read: <attack|skill|power|status|curse>; show <primary mechanic cue> first, <secondary cue> second. The image must read clearly at 64 px in the in-game card art window.
Style/medium: serious cartoon-gothic stained-glass game art; chunky dark silhouette; simplified emblem-like composition; 3-5 large jewel-tone glass masses; very few thick lead dividers; matte painterly glass texture; warm amber rim light; controlled inner glow only at the focal symbol; no generic fantasy icon.
Composition/framing: square transparent PNG source; single centred emblem or single compact gameplay moment; generous padding; no card frame; no cropped shards or flames; no action blur; dark vignette edge only if corners remain transparent.
Lighting/mood: sober gothic mood; high value contrast on the main shape; glow supports the mechanic but does not obscure the silhouette.
Palette: <type palette plus one mechanic colour>.
Scene/backdrop: transparent background or perfectly flat chroma-key background for alpha removal.
Constraints: no text; no labels; no watermark; no cost icon; no nameplate; no UI chrome; no full card mockup; no ground plane; no shadows; no reflections.
```

## Prompt Examples

### Attack

```text
Primary request: Edge, a single crimson stained-glass blade cutting through a
round red pane, with a clean fracture line and a few large shards.
Gameplay read: attack; show direct damage first, sharp glass impact second.
Palette: crimson glass, black lead, small amber impact core.
```

### Skill

```text
Primary request: Ward, a blue cathedral shield pane holding back a thin red
impact crack, with a steady lantern glow behind it.
Gameplay read: skill; show Ward first, protection from incoming damage second.
Palette: deep blue, cyan, silver lead, warm amber core.
```

### Power

```text
Primary request: Inner Blaze, a persistent red-gold flame sealed inside a dark
glass heart pane, surrounded by a restrained violet halo.
Gameplay read: power; show ongoing Fervor first, lasting aura second.
Palette: violet glass, black lead, red-gold inner fire.
```

### Status

```text
Primary request: Cinder, a broken card-shaped glass shard with a small ash-red
coal burning at one corner.
Gameplay read: status; show unwanted burn damage first, dead card weight
second.
Palette: ash grey, ember red, black lead.
```

### Curse

```text
Primary request: Hex, a warped purple-black glass sigil trapped inside a
cracked hexagonal pane.
Gameplay read: curse; show harmful persistent curse first, refusal to burn
second.
Palette: void purple, black lead, sick magenta glow.
```

## Review Gate

Before promoting any new card asset:

- Open the game gallery at `http://localhost:5174/?gallery=1`.
- Check `cards - 60/60 generated`.
- Inspect the target card at gallery size.
- Inspect the same card in actual hand/reward/deck views if possible.
- Check alpha corners are transparent.
- Check the card is readable at 128 px and still recognisable around 64 px.
- Check no text, labels, frame, cost badge, watermark, or UI chrome is baked in.
- Check the art does not make the gameplay text harder to read.
- Check the type family still matches attack/skill/power/status/curse.
- Check the internal filename matches `src/data.js`.

Reject and regenerate if the image only works as full-size art, if it needs the
card name to be understood, or if the most memorable detail is not related to
the card's mechanic.

## External Study Sources

- Daniel Solis,
  ["Three Principles of Card Design: Visibility, Hierarchy, Brevity"](https://danielsolisblog.blogspot.com/2024/02/three-principles-of-card-design.html)
  - useful framing for how players scan cards.
- Joseph Z Chen,
  ["Anatomy of a Card"](https://fantastic-factories.medium.com/anatomy-of-a-card-840cdc2404c1)
  - useful notes on name, art, cost, effect, type, and hand/table context.
- Matt Paquette & Co.,
  ["Tabletop Graphic Design: Game Cards 101"](https://www.mattpaquette.com/design-blog/2018/7/9/tabletop-graphic-design-card-framworks-101)
  - spacing, typography, contrast, and production consistency.
- Dylan Mangini,
  ["4 Layout Tips for Designing Card Games"](https://medium.com/%40dylanmangini/4-layout-tips-for-designing-card-games-17cc98b89b96)
  - spacing, visual hierarchy, UI/UX context, and font restraint.
- Game Developer / GDC,
  ["Hearthstone: How to Create an Immersive User Interface"](https://www.gamedeveloper.com/design/video-designing-an-immersive-user-interface-for-i-hearthstone-i-)
  - reminder that digital card games are UI-heavy and need tactile feedback.
- Wizards of the Coast,
  ["Anatomy of a Magic Card"](https://magic.wizards.com/en/news/feature/anatomy-magic-card-2006-10-21)
  - reference for long-standing card information architecture.
- Board Game Design Course,
  ["How to Use Icons to Make Your Game Awesome"](https://boardgamedesigncourse.com/how-to-use-icons-to-make-your-game-awesome/)
  - icons should support flow and avoid rulebook lookup.
- The Dark Imp,
  ["Can icons make or break your game?"](https://www.thedarkimp.com/blog/2023/12/06/can-icons-make-or-break-your-game/)
  - simpler icons are more reliable, especially for common concepts.
- Kallabis, Bertram, and Rupp,
  ["Deceptive Game Design? Investigating the Impact of Visual Card Style on Player Perception"](https://arxiv.org/abs/2506.18648)
  - visual style can affect perceived card strength, so art intensity should be
  deliberate.
