# Event Story First Three - Prompt Ledger

Date: 2026-07-06
Mode: built-in image_gen
Status: first pass, pending review

This set generates the first three `EVENTS` entries from `src/data.js` using
the small-story briefs in `docs/event-art-stories.md`.

## Outputs

| Event | Source image | Built-in generated image id |
|---|---|---|
| `forgottenShrine` | `forgottenShrine/01-built-in-source.png` | `ig_0022704930ba0f45016a4aebc1a65c819191e13a86421bbe2f.png` |
| `woundedKnight` | `woundedKnight/01-built-in-source.png` | `ig_0022704930ba0f45016a4aebf974788191a9b27bb7862449ab.png` |
| `voidChest` | `voidChest/01-built-in-source.png` | `ig_0022704930ba0f45016a4aec303c808191974bdb2a72e9a8ea.png` |

Review sheet:

- `contact-sheet.jpg`

## First Read

- `forgottenShrine` has the strongest new story identity, but should be lifted
  brighter and simplified if it goes to a second pass.
- `woundedKnight` keeps the approved mercy/theft story read, but still carries
  too many armour and floor details.
- `voidChest` remains the cleanest danger-gamble read, with a strong chest
  silhouette and useful treasury context.

## Prompt - Forgotten Shrine

```text
Use case: stylized-concept
Asset type: Spirebound event art story demo, first-three event set, full narrative background
Primary request: Forgotten Shrine, a cursed sanctuary event at the moment before the player chooses to pray, desecrate, or leave. A moss-eaten shrine sits in the foreground with one eye-like stone seam faintly awake; offerings of bone and tarnished silver lie at its base, and one cracked card shard is half-buried in moss. Behind it, broad root arches and dim chapel stones suggest an old place that learned the shape of bargains.
Small story: Climbers once fed this shrine with silver, bone, and unwanted memories. The stone learned the shape of their bargains; now a fresh glimmer hums at the base and something inside the shrine is awake.
Narrative read: show the moss-eaten shrine first, the offering pile and cracked card shard second, and the root-chapel background third. The image must read clearly inside a 440px event panel and still scan at 128px.
Style/medium: serious cartoon-gothic stained-glass game art; sturdy event illustration; chunky black outer contour on the shrine; 3-5 large jewel-tone colour masses; very few thick lead dividers; matte painterly glass texture; controlled amber inner glow; no generic fantasy illustration.
Composition/framing: wide 3:2 full event scene with background included; centre-right shrine focal; clear foreground, midground, and background depth; generous breathing room; no hard card frame; no cropped shrine or offering props.
Lighting/mood: luminous midtones, old sacred but dangerous mood; warm amber shrine glow against cooler moss-green and stone-blue background light; background lower contrast and fewer lines than the shrine.
Palette: jade moss, tarnished silver, old bone, amber shrine warmth, muted stone blue, black lead.
Constraints: no text; no labels; no watermark; no buttons; no UI chrome; no full card mockup; no guaranteed gold pile; no visible monster; avoid tiny runes; avoid dense vines; avoid detailed window lattice; avoid floor grids; avoid busy temple architecture; background must have fewer lines than the subject.
```

## Prompt - Wounded Knight

```text
Use case: stylized-concept
Asset type: Spirebound event art story demo, first-three event set, full narrative background
Primary request: The Wounded Knight, a priced encounter event at the moment before the player chooses to aid him, loot him, or leave. A crushed stained-glass knight slumps in the foreground against a broken pillar, still breathing behind a damaged visor, holding out a small warm relic. Nearby, a fallen purse and broken blade tempt theft; behind him, broad chapel arches and cold blue glass light show where he fell.
Small story: A knight dragged a relic out of a broken chapel battle and made it as far as one shattered pillar. His offered hand asks for mercy; his fallen purse and broken blade tempt the player to take what remains.
Narrative read: show the wounded knight and offered relic first, the purse and broken blade second, and the lonely ruined chapel third. The image must read clearly inside a 440px event panel and still scan at 128px.
Style/medium: serious cartoon-gothic stained-glass game art; sturdy event illustration; chunky black outer contour on the knight; broad toy-like silhouette; 3-5 large jewel-tone colour masses; very few thick lead dividers; matte painterly glass texture; warm amber relic glow; controlled blue visor glow.
Composition/framing: wide 3:2 full event scene with background included; centre-right knight focal; clear foreground, midground, and background depth; generous breathing room; no hard card frame; no cropped knight, relic, pillar, purse, or broken blade.
Lighting/mood: luminous midtones, merciful but morally tense mood; warm relic light against cool blue ruined chapel light; background lower contrast and fewer lines than the knight.
Palette: luminous bruised blue glass, pale silver-blue chapel light, black lead, warm amber relic light, muted red wound pane, small tarnished-gold purse accent.
Constraints: no text; no labels; no watermark; no buttons; no UI chrome; no full card mockup; no heroic standing posture; no gore; no extra soldiers; avoid excessive armour segments; avoid detailed window lattice; avoid floor grids; avoid busy background architecture; background must have fewer lines than the subject.
```

## Prompt - Humming Chest

```text
Use case: stylized-concept
Asset type: Spirebound event art story demo, first-three event set, full narrative background
Primary request: Humming Chest, a rare danger-gamble event at the moment before the player chooses to open it or leave. A chunky black iron stained-glass chest sits in the foreground with violet glass panels, a broken amber lock, and a mouth-like lid seam that hints at teeth without opening. A broken key and cracked stone step sit nearby; behind it, broad treasury arches and coloured light pools imply temptation and danger.
Small story: This treasury alcove was sealed from the outside, not the inside. The lock has already broken and the chest keeps singing the note that ruined the last hand that touched it; it may contain a relic, or it may only be bait.
Narrative read: show the chest silhouette first, the broken lock and mouth-like seam second, and the ruined treasury alcove third. The image must read clearly inside a 440px event panel and still scan at 128px.
Style/medium: serious cartoon-gothic stained-glass game art; sturdy event illustration; chunky black outer contour on the chest; broad toy-like silhouette; 3-5 large jewel-tone colour masses; very few thick lead dividers; matte painterly glass texture; luminous violet chest panels; warm amber broken lock glow; small sickly green danger glint.
Composition/framing: wide 3:2 full event scene with background included; centre-right chest focal; clear foreground, midground, and background depth; generous breathing room; no hard card frame; no cropped chest, lid, lock, seam, or key.
Lighting/mood: luminous midtones, dangerous temptation mood; warm lock light against cool violet-blue treasury light; background lower contrast and fewer lines than the chest.
Palette: black iron lead, luminous violet glass, cold blue background panes, warm amber lock light, tiny sickly green danger accent.
Constraints: no text; no labels; no watermark; no buttons; no UI chrome; no full card mockup; do not show a relic clearly; do not show the damage outcome; no monster emerging from the chest; avoid thin strokes; avoid many cracks; avoid fragile glass filigree; avoid detailed window lattice; avoid floor grids; avoid busy background architecture; background must have fewer lines than the subject.
```
