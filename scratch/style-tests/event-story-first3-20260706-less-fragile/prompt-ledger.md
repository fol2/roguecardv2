# Event Story First Three - Less-Fragile Prompt Ledger

Date: 2026-07-06
Mode: built-in image_gen
Status: second pass reviewed

This set responds to the review note: "Less piece of glass please less fragile
please." The prompts keep the small event stories, but push the rendering away
from mosaic fragmentation and towards heavier, simpler forms.

## Outputs

| Event | Source image | Built-in generated image id |
|---|---|---|
| `forgottenShrine` | `forgottenShrine/01-built-in-source.png` | `ig_08e02298dce5bd51016a4aee2fe7288191a9fff4565c76a008.png` |
| `woundedKnight` | `woundedKnight/01-built-in-source.png` | `ig_08e02298dce5bd51016a4aee6a21e881918e7e2d1cd4933d26.png` |
| `voidChest` | `voidChest/01-built-in-source.png` | `ig_08e02298dce5bd51016a4aeea3c320819184d7215695ca73a3.png` |

Review sheets:

- `contact-sheet.jpg`
- `v1-vs-v2-contact.jpg`

## First Read

- `forgottenShrine` failed review. It is less glass-fragile than v1, but the
  prompt still invited too many blockers, offerings, ground fragments, and
  background details.
- `woundedKnight` passed review. Larger armour masses, plainer stage floor, and
  less glass-shard fragility are close enough to continue.
- `voidChest` passed review. Heavy black iron, fewer violet panes, and simpler
  background are close enough to continue.

## Clean Prompt Lesson For Forgotten Shrine

The Shrine prompt should be shorter and more positive. Avoid a long blocker
list because it still makes the model think about vines, runes, windows, grids,
shards, and offerings. The next prompt should describe one heavy shrine, one
offering bowl, one broad root arch, and a plain floor.

Use the words "stone altar" or "monolith shrine" more than "stained glass".
Keep stained-glass language only for colour and glow.

## Clean Prompt Candidate - Forgotten Shrine

```text
Use case: stylized-concept
Asset type: Spirebound event art story demo, Forgotten Shrine clean prompt
Primary request: Forgotten Shrine, a cursed sanctuary event at the moment before the player chooses to pray, desecrate, or leave. Show one heavy moss-covered stone altar in the foreground, shaped like a small monolith shrine with a single amber eye-shaped glow in its centre. At its base is one simple offering bowl with two pale bones and one dull silver coin. Behind it is one huge dark root arch and a soft chapel wall silhouette.
Small story: Travellers once left unwanted memories here. The shrine kept those bargains, and now its single amber eye has opened for the player.
Narrative read: show the solid shrine first, the single offering bowl second, and the broad root arch third. It must read inside a 440px event panel and at 128px.
Style/medium: serious cartoon-gothic dark fantasy game art; carved stone and moss, not glass mosaic; chunky black outer contour; broad toy-like silhouette; 3-4 large colour masses; almost no interior linework; matte painterly texture; controlled amber glow.
Composition/framing: wide 3:2 event scene; centre-right shrine focal; plain dark stage floor; foreground/midground/background depth; generous breathing room; no frame.
Lighting/mood: luminous midtones; warm amber shrine glow against cool green-blue background; background softer and simpler than the shrine.
Palette: dark moss green, old grey stone, warm amber, dull bone, muted silver, black lead accents.
Constraints: no text, no UI, no characters, no visible reward, no extra offerings, no small shards, no floor pattern.
```

## Prompt - Forgotten Shrine

```text
Use case: stylized-concept
Asset type: Spirebound event art story demo, first-three event set, less-fragile second pass
Primary request: Forgotten Shrine, a cursed sanctuary event at the moment before the player chooses to pray, desecrate, or leave. A heavy moss-eaten stone shrine sits in the foreground as one solid chunky carved form, with one simple eye-like stone seam faintly awake. A few large offerings of bone and tarnished silver rest at its base, plus one broad cracked card slab half-buried in moss. Behind it, two huge root arches and one dim chapel wall mass suggest an old place that learned the shape of bargains.
Small story: Climbers once fed this shrine with silver, bone, and unwanted memories. The stone learned the shape of their bargains; now a fresh glimmer hums at the base and something inside the shrine is awake.
Round direction: less glass pieces, less fragile. Use stained-glass influence only in colour and glow, not as many little panes. Forms should feel carved, weighty, and durable.
Narrative read: show the solid moss shrine first, the few chunky offerings second, and the broad root-chapel background third. The image must read clearly inside a 440px event panel and still scan at 128px.
Style/medium: serious cartoon-gothic dark fantasy game art; stained-glass inspired but not mosaic-heavy; chunky black outer contour on the shrine; broad toy-like silhouette; 3-5 large colour masses; at most 5 interior lead-divider strokes on the shrine; matte painterly stone and moss texture; controlled amber inner glow.
Composition/framing: wide 3:2 full event scene with background included; centre-right shrine focal; foreground/midground/background depth; generous breathing room; no hard card frame; no cropped shrine or offering props.
Lighting/mood: luminous midtones, old sacred but dangerous mood; warm amber shrine glow against cooler moss-green and stone-blue background light; background lower contrast and fewer lines than the shrine.
Palette: jade moss, tarnished silver, old bone, amber shrine warmth, muted stone blue, black lead.
Constraints: no text; no labels; no watermark; no buttons; no UI chrome; no full card mockup; no guaranteed gold pile; no visible monster; no tiny runes; no dense vines; no detailed window lattice; no floor grid; no mosaic shards; no piles of small glass pieces; no hairline cracks; no fragile filigree; background must have fewer lines than the subject.
```

## Prompt - Wounded Knight

```text
Use case: stylized-concept
Asset type: Spirebound event art story demo, first-three event set, less-fragile second pass
Primary request: The Wounded Knight, a priced encounter event at the moment before the player chooses to aid him, loot him, or leave. A crushed knight slumps in the foreground against a single broken pillar, still breathing behind a damaged visor, holding out a small warm relic. Nearby, one simple fallen purse and one broad broken blade tempt theft; behind him, two huge soft chapel arch shapes and cold blue light show where he fell.
Small story: A knight dragged a relic out of a broken chapel battle and made it as far as one shattered pillar. His offered hand asks for mercy; his fallen purse and broken blade tempt the player to take what remains.
Round direction: less glass pieces, less fragile. The knight should be built from a few large solid armour plates, not many segmented glass panes. Use stained-glass influence only in colour and glow, not as many little shards.
Narrative read: show the wounded knight and offered relic first, the purse and broken blade second, and the lonely ruined chapel third. The image must read clearly inside a 440px event panel and still scan at 128px.
Style/medium: serious cartoon-gothic dark fantasy game art; stained-glass inspired but not mosaic-heavy; chunky black outer contour on the knight; broad toy-like silhouette; 3-5 large colour masses; at most 6 interior armour divider strokes total; matte painterly metal and glass glow; warm amber relic light; controlled blue visor glow.
Composition/framing: wide 3:2 full event scene with background included; centre-right knight focal; clear foreground, midground, and background depth; generous breathing room; no hard card frame; no cropped knight, relic, pillar, purse, or broken blade; plain dark stage floor, not cobblestones.
Lighting/mood: luminous midtones, merciful but morally tense mood; warm relic light against cool blue ruined chapel light; background lower contrast and fewer lines than the knight.
Palette: luminous bruised blue, pale silver-blue chapel light, black lead, warm amber relic light, muted red wound accent, small tarnished-gold purse accent.
Constraints: no text; no labels; no watermark; no buttons; no UI chrome; no full card mockup; no heroic standing posture; no gore; no extra soldiers; no excessive armour segments; no small glass shards; no hairline cracks; no detailed window lattice; no floor grid; no cobblestone detail; no busy background architecture; background must have fewer lines than the subject.
```

## Prompt - Humming Chest

```text
Use case: stylized-concept
Asset type: Spirebound event art story demo, first-three event set, less-fragile second pass
Primary request: Humming Chest, a rare danger-gamble event at the moment before the player chooses to open it or leave. A massive black iron chest sits in the foreground as one heavy chunky object, with only two large violet side panels, a broken amber lock, and one simple mouth-like lid seam that hints at teeth without opening. A single broken key rests nearby; behind it, two huge treasury arch shapes and broad pools of coloured light imply temptation and danger.
Small story: This treasury alcove was sealed from the outside, not the inside. The lock has already broken and the chest keeps singing the note that ruined the last hand that touched it; it may contain a relic, or it may only be bait.
Round direction: less glass pieces, less fragile. The chest should feel like heavy black iron and large solid panels, not a fragile glass mosaic. Use stained-glass influence only in the big violet glow and colour masses.
Narrative read: show the heavy chest silhouette first, the broken lock and simple mouth-like seam second, and the ruined treasury alcove third. The image must read clearly inside a 440px event panel and still scan at 128px.
Style/medium: serious cartoon-gothic dark fantasy game art; stained-glass inspired but not mosaic-heavy; chunky black outer contour on the chest; broad toy-like silhouette; 3-5 large colour masses; at most 5 interior divider strokes on the chest; matte painterly iron; luminous violet panels; warm amber broken lock glow; tiny sickly green danger glint.
Composition/framing: wide 3:2 full event scene with background included; centre-right chest focal; clear foreground, midground, and background depth; generous breathing room; no hard card frame; no cropped chest, lid, lock, seam, or key; plain dark stage floor, not cobblestones.
Lighting/mood: luminous midtones, dangerous temptation mood; warm lock light against cool violet-blue treasury light; background lower contrast and fewer lines than the chest.
Palette: black iron, luminous violet, cold blue background masses, warm amber lock light, tiny sickly green danger accent.
Constraints: no text; no labels; no watermark; no buttons; no UI chrome; no full card mockup; do not show a relic clearly; do not show the damage outcome; no monster emerging from the chest; no small glass shards; no hairline cracks; no fragile filigree; no detailed window lattice; no floor grid; no cobblestone detail; no busy background architecture; background must have fewer lines than the subject.
```
