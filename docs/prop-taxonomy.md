# Prop Taxonomy

This is the working taxonomy for Spirebound generated props. Use it with
`docs/art-study-bible.md` and `docs/style-bible.md` before generating,
reviewing, or promoting prop assets.

## Prop Types

| Type | Role | Examples | Art job |
|---|---|---|---|
| Node Props | Main screen anchors for map-node destinations | campfire, chest, merchant stall | Make the current place instantly readable. |
| Reward Props | Objects that frame a payout or pickup | reliquary chest, coin coffer, relic plinth, potion rack | Clarify what the player is receiving without fighting UI text. |
| Event Props | Single iconic object for a narrative choice | silvered mirror, shrine, idol, bone cup, forge anvil | Tell the event story through one object rather than a full scene. |
| System Props | Reusable UI or ceremony objects | lantern shard, ember vessel, shatter shard, omen seal, vow tablet | Build shared visual grammar for repeated mechanics. |
| Ritual Props | High-ceremony objects for bosses, vows, monuments, crowns, endings | crowned tablet, dawn gate fragment, monument, boss key | Carry rare identity moments and theme escalation. |

## Rarity Language

Avoid generic stars or text labels. Rarity should come from material richness,
glow strength, lead weight, and ceremony.

| Rarity | Visual treatment | Use |
|---|---|---|
| Plain Glass | low glow, simple silhouette, mostly black lead and one colour family | baseline interactables and low-stakes event support |
| Kindled | amber core, modest gold trim, clear warmth | healing, reward, fuel, safe interaction |
| Oathbound | heavier black lead, blue/violet glass, ceremonial shape, cold inner light | dangerous choices, vows, irreversible event moments |
| Crowned | gold crown geometry, black stone/lead mass, one hot judgement core, strongest silhouette | boss-tier ritual props, crowns, monuments, final-act ceremony |

## Prototype Pitch Set

Scratch location:

`scratch/prop-taxonomy-demos/20260705/`

Value-lift pass after first council feedback:

`scratch/prop-taxonomy-demos/20260705-value-lift/`

| Demo | Type | Rarity | File | Purpose |
|---|---|---|---|---|
| Kindled reward chest | Reward Prop | Kindled | `01-kindled-reward-chest-alpha.png` | Tests a readable reward container with amber interaction core. |
| Oathbound silvered mirror | Event Prop | Oathbound | `02-oathbound-event-mirror-alpha.png` | Tests event storytelling as a single object, not a scene. |
| Crowned vow monument | Ritual Prop | Crowned | `03-crowned-ritual-monument-alpha.png` | Tests rare ceremony language with final-act magenta core. |

The value-lift pass keeps the same three categories and improves UI-distance
read with brighter interior glass and clearer focal cores. Its contact sheets:

- `scratch/prop-taxonomy-demos/20260705-value-lift/contact-sheet.png`
- `scratch/prop-taxonomy-demos/20260705-value-lift/comparison-v1-v2-contact-sheet.png`

## Current Recommendation

Use the three-demo set as the pitch baseline:

- Keep **Kindled** as the default positive-interaction rarity for reward, rest,
  fuel, and safe pickups.
- Keep **Oathbound** for events where the object implies a bargain, vow, curse,
  or irreversible choice.
- Reserve **Crowned** for rare ritual surfaces: boss keys, vow monuments, crown
  relic presentation, and final-act objects.

Council feedback from the first pitch: the silhouettes are distinct from
distance, which is the right foundation. The shared adjustment for the next
round is value lift: keep the black-lead outline and strong silhouette, but raise
interior midtones and focal glow slightly so props do not read too dark in the
game UI.

The next production pass should generate props in small matched groups, not
single isolated assets. For example:

1. Closed/open reward object pair.
2. Three event objects from different risk bands.
3. One system prop family: ember vessel, omen seal, vow tablet.

Review them as a contact sheet at 128 px before considering runtime promotion.
