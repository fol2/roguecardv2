# Art Study Bible

This document records the working study for Spirebound generated art. It is
intended to be reread before theme, style, card, event, enemy, prop, potion, or
title image generation work.

The short locked rules remain in [`style-bible.md`](./style-bible.md). The
mechanical pipeline remains in
[`generated-art-workflow.md`](./generated-art-workflow.md). Card-specific rules
live in [`card-art-bible.md`](./card-art-bible.md). Act 3 enemy direction lives
in [`act3-theme.md`](./act3-theme.md). Event story briefs live in
[`event-art-stories.md`](./event-art-stories.md).

## Purpose

Spirebound art must make the game easier to read, not just richer to look at.
Every image should strengthen one of these jobs:

- show the game world as glass, ink, lantern fire, and ceremony
- make a gameplay object recognisable at its real runtime size
- preserve a consistent stained-glass language across characters, cards, events,
  props, potions, and title art
- keep generated rasters as replaceable assets, with procedural SVG fallbacks

If an image is beautiful but unclear at runtime size, it has failed the brief.

## Runtime Truths

- The engine is pure logic. Generated art must not change engine behaviour.
- `src/art.js` resolves generated PNGs first and falls back to procedural SVG.
- `src/ui.js` is the only orchestrator that places art into screens.
- Asset filenames must match internal keys from `src/data.js`.
- Missing PNGs are allowed because SVG fallback remains valid.
- `src/assets/` is the live set. `src/assets-legacy/` is the previous live set
  retained for review/reference comparison.
- Final project-bound generated images must live inside the workspace, never
  only under `~/.codex/generated_images/`.

Do not rename internal ids for art direction. Display names can change; keys are
save and test anchors.

## Current Pipeline

Use this exact working order unless the project bible is updated:

```text
built-in image_gen -> Nano Banana Pro -> alpha cutout -> outer rim cleanup -> gallery review
```

Rules:

- Use Codex built-in `image_gen` directly for Step 1.
- Do not make `tools/imagegen.sh`, `tools/genasset.sh`, or `codex exec` the
  primary workflow.
- Do not fall back to `gpt-image-1.5`.
- Use Nano Banana Pro through
  `/Users/jamesto/.codex/skills/nanobanana/scripts/nanobanana.py`.
- Keep the current Nano Banana prompt fixed unless the workflow document is
  deliberately revised.
- Before another variation is generated, record the exact prompt, generated
  image id, source path, selected alpha path, rim-cleaned path if any, and
  review outcome in the relevant scratch `prompt-ledger.md`.

Every asset attempt is evidence. Keep source, rejected, and comparison material
under `scratch/style-tests/` until the council decision is clear.

## Global Style

The family is:

- serious cartoon-gothic dark fantasy
- stained glass, black lead, matte painterly panes
- chunky outer silhouette before interior detail
- 3-5 large jewel-tone colour masses
- very few thick lead dividers
- warm amber rim light, controlled inner glow
- restrained cathedral motifs as broad shapes, not filigree
- dramatic, grave, but still readable and characterful

Avoid:

- glossy 3D rendering
- generic fantasy splash art
- lacework and micro-panels
- noisy bloom, sparkles, fog, or haze on silhouette edges
- ornate armour noise that breaks thumbnail readability
- baked-in text, labels, watermark, UI frame, or card chrome

The approved enemy set shows the practical target: simpler and more readable
than the master portrait, but still in the same stained-glass world.

## Readability Ladder

Use this order for all generated art:

1. Silhouette.
2. Pose or layout.
3. Face, weapon, core symbol, or scene focal point.
4. Colour.
5. Texture and ornament.

The black-silhouette test should still identify the asset family. Internal
detail is a reward after the asset already reads.

## Prompt Discipline

What has worked:

- short subject description first
- one iconic primary read
- explicit category framing
- limited palette
- clear runtime size requirement
- baseline noise controls
- personality through proportions, not through micro-detail

What has failed:

- long defensive ban lists that become the main instruction
- over-constraining enemy-vs-hero language until the model changes trope
- asking for too many props, symbols, or narrative beats in one image
- tiny faction marks that disappear at gallery size
- clean noble humanoids for enemies

The prompt should make the image simpler, not more anxious.

## Category Contracts

| Category | Runtime job | Primary rule |
|---|---|---|
| `heroes` | player identity in combat | full body, facing slightly right, calm idle |
| `enemies` | threat read in combat | full body, facing slightly left, one funny/threatening silhouette |
| `cards` | gameplay cue inside a small art window | centred emblem or single compact moment |
| `props` | location/object shorthand | single centred object |
| `potions` | inventory phial read | one centred phial, dominant tone colour |
| `events` | decision-scene mood and narrative hook | wide transparent scene, centre-right focal |
| `title/title` | title identity | transparent single-word wordmark |
| `title-background/background` | optional first impression | wide 16:9 background, no UI clutter |

## Event Taxonomy

The engine currently cycles through event ids without a rarity table. The
rarity below is an art and design planning tag, not engine behaviour.

Use four tags for every event:

- Event type: `sanctuary`, `bargain`, `craft`, `danger`, `encounter`.
- Risk tier: `safe`, `priced`, `gamble`, `cursed`, `omen`.
- Rarity: `common`, `uncommon`, `rare`, `mythic`.
- Visual role: `object`, `place`, `figure`, `ritual`.

Definitions:

- `sanctuary`: healing, respite, cleansing, or recovery tension.
- `bargain`: explicit trade, temptation, or corrupt deal.
- `craft`: deck shaping, upgrade, duplicate, study, or transformation.
- `danger`: trap-like uncertainty where the object itself is the threat.
- `encounter`: named figure interaction.
- `safe`: mostly upside, or a leave option with no implied cost.
- `priced`: clear cost for clear reward.
- `gamble`: probabilistic or hidden branch.
- `cursed`: high upside with deck, HP, max HP, or moral corruption.
- `omen`: reserved for future act/theme rule events.

Current mapping:

| Event id | Type | Risk | Rarity | Visual role |
|---|---|---|---|---|
| `forgottenShrine` | `sanctuary` | `cursed` | `uncommon` | `ritual` |
| `woundedKnight` | `encounter` | `priced` | `uncommon` | `figure` |
| `voidChest` | `danger` | `gamble` | `rare` | `object` |
| `emberFountain` | `sanctuary` | `safe` | `common` | `ritual` |
| `forge` | `craft` | `safe` | `uncommon` | `place` |
| `gambler` | `bargain` | `gamble` | `rare` | `figure` |
| `mirror` | `craft` | `priced` | `rare` | `object` |
| `library` | `craft` | `safe` | `uncommon` | `place` |
| `fleshTrader` | `bargain` | `cursed` | `rare` | `figure` |
| `cursedIdol` | `bargain` | `cursed` | `rare` | `object` |
| `ruinedCamp` | `sanctuary` | `safe` | `common` | `place` |

Pitch prototypes for this taxonomy live in
`scratch/style-tests/event-taxonomy-prototypes-20260705/`:

- `woundedKnight`: `encounter` / `priced` / `uncommon` / `figure`.
- `voidChest`: `danger` / `gamble` / `rare` / `object`.
- `forge`: `craft` / `safe` / `uncommon` / `place`.

Use the contact sheet in that folder when discussing whether the taxonomy reads
visually before producing the full event set.

Round 2 response to review: the first prototype pass was too dark. The brighter
pitch set lives in
`scratch/style-tests/event-taxonomy-prototypes-20260705-round2/`. For event art,
prefer luminous midtones, visible stained-glass backlight, and clear warm/cool
separation over black dungeon ambience. Gothic mood should come from shape,
glass, and contrast, not from crushing the whole image into darkness.

Round 3 response to review: the brighter pass still felt too fragile because
background windows, floor grids, and fine armour/forge lines dominated. The
fewer-strokes pitch set lives in
`scratch/style-tests/event-taxonomy-prototypes-20260705-round3/`. For event art,
borrow the hero/enemy stroke language directly:

- chunky black outer contour first
- broad toy-like silhouette
- 3-5 large colour masses
- very few thick lead dividers
- no background lattice, floor grid, hairline cracks, crosshatching, or
  fragile filigree
- if a limit is needed, specify "at most 8 interior lead-divider strokes"

The trade-off is that events become closer to staged object/figure clusters and
less like full environment paintings. That is acceptable if the event still
communicates the choice tension at panel size.

Round 4 approved direction: the main subjects were finally strong enough, but
events still need backgrounds and narrative. The approved narrative-background
pitch artifacts live in `docs/artifacts/event-taxonomy-prototypes/`; the
scratch working set lives in
`scratch/style-tests/event-taxonomy-prototypes-20260706-round4/`. For event art,
do not choose between "subject" and "background". Use a layered theatre scene:

- foreground subject with the strongest black contour and highest contrast
- one midground story prop that clarifies the event choice
- two or three huge background shapes that identify the place
- background line count lower than the subject line count
- background contrast lower than the subject contrast
- broad arches, furnaces, pillars, alcoves, banners, and light planes instead
  of detailed window lattice or floor grids

The background must deepen the event read without becoming the read. If the eye
sees environment detail before the decision object, the prompt is too busy.

## Event Art Bible

Events are the next most important art surface after combat because they set
tone and choice tension. Event images should read as small theatrical scenes or
object clusters, not as full card mockups and not as generic environment
paintings.

Before generating a production event image, expand the event into a small story
using [`event-art-stories.md`](./event-art-stories.md). The image should show
the decision moment from that story, not the mechanical reward outcome.

### Runtime Constraints

- Path: `src/assets/events/<event-id>.png`.
- `<event-id>` must match a key in `EVENTS` in `src/data.js`.
- UI call: `rasterOr('events', eventId, eventArtSvg(ev.glyph, ev.hue))`.
- Event panel width: about `min(660px, 92vw)`.
- Event art visual width: roughly 440px on desktop, smaller on phones.
- The live event set is a full-background 3:2 scene PNG, not an alpha cutout,
  unless a later workflow note explicitly changes this.
- Style target: wide full scene, 3:2, focal point centre-right, max 1024px.
- No baked text, choice labels, button shapes, frame, watermark, or UI chrome.
- Every production event candidate must pass through Nano Banana Pro after the
  built-in GPT image source before it is registered for gallery review.

The event art must support the written event text and choices. It should not
replace them, contradict them, or reveal a branch result that should stay
uncertain.

### Event List And Focal Reads

| Event id | Name | Required focal read |
|---|---|---|
| `forgottenShrine` | Forgotten Shrine | moss-eaten shrine, old offerings, watcher-in-stone tension |
| `woundedKnight` | The Wounded Knight | slumped crushed knight, shattered pillar, tempting relic hand |
| `voidChest` | Humming Chest | black iron chest, broken lock, danger hidden inside |
| `emberFountain` | Fountain of Embers | cracked basin, liquid ember light, non-burning sparks |
| `forge` | The Forgotten Forge | black star-metal anvil, warm forge, waiting hammers |
| `gambler` | The Bone Gambler | grinning figure, knuckle-bones, risky table ritual |
| `mirror` | The Silvered Mirror | tall intact mirror, delayed/smiling reflection cue |
| `library` | The Drowned Library | waterlogged shelves, a few glowing pages |
| `fleshTrader` | The Flesh Trader | merchant-coat figure, open hand, life-as-currency menace |
| `cursedIdol` | The Cursed Idol | jade idol, skull plinth, dangerous warmth |
| `ruinedCamp` | Ruined Camp | smouldering campfire, torn bedrolls, abandoned packs |

### Event Composition Rules

- Use one centre-right focal object or figure.
- Keep a clean left/upper area where the dark panel can breathe.
- Use foreground props only if they clarify the choice.
- Let danger be implied by shape, glow, posture, or broken glass.
- Keep the scene shallow enough to read in the event panel.
- Prefer a stage-like vignette over a deep landscape.
- Do not paint both outcomes of a random branch too literally.
- Do not show rewards as guaranteed if the event choice is risky.
- Do not add extra characters unless the event text clearly implies them.

### Event Prompt Template

```text
Use case: stylized-concept
Asset type: Spirebound event art full-background source
Primary request: <event name>, <one-sentence narrative scene tied to the event text and choices>.
Narrative read: show <main object/figure> first, <choice tension> second, <world cue> third. The image must read clearly inside the event panel at roughly 440px wide and still scan on mobile.
Style/medium: serious cartoon-gothic stained-glass game art; chunky dark silhouette; simplified theatrical scene; 3-5 large jewel-tone glass masses; very few thick lead dividers; matte painterly glass texture; warm amber rim light; controlled inner glow only at the focal object; no generic fantasy illustration.
Composition/framing: wide 3:2 full event scene; centre-right focal point; foreground/midground/background depth; no hard rectangular frame; no cropped focal props; no action blur; stage-like vignette without baked UI.
Lighting/mood: sober gothic decision-scene mood; high value contrast on the main read; glow supports the event tension but does not obscure the silhouette.
Palette: <event-specific palette plus black lead and restrained amber lantern light>.
Scene/backdrop: broad narrative background with two or three simple place cues; background contrast and line count lower than the subject.
Constraints: no text; no labels; no watermark; no buttons; no UI chrome; no card frame; no ground shadow; no reflection; no guaranteed reward reveal unless the event text guarantees it.
```

## Card Design Lessons Applied To Spirebound

External card design study reinforced these rules:

- Art must serve information hierarchy.
- Repeated concepts should develop repeated symbols.
- Text and rules areas need quiet, high-contrast backgrounds.
- Important gameplay information belongs where the player sees it during real
  use, especially when cards are fanned, hovered, dragged, or read on mobile.
- Icons help when they are consistent; they hurt when one symbol means several
  unrelated things.
- Visual intensity changes perceived card strength, so art weight must be
  deliberate.

For Spirebound, generated card PNGs must not carry cost, name, rules text,
rarity, or card frame. Runtime UI already owns those. The generated image owns
only the emblem or moment that helps the player remember the card's action.

## Theme Development Rules

When creating a new theme, biome, act, or asset family:

1. Define the world object first: shrine, court, drowned city, forge, lantern,
   spire, etc.
2. Define one shared motif that can mutate across silhouettes.
3. Define a limited palette.
4. Define what the theme is not.
5. Write three example subjects to check that the motif is flexible.
6. Test in gallery before making the whole set.

Shared motifs must support silhouette. A tiny badge or small repeated mark is
not enough.

## Review Gate

Before accepting generated art:

- Open `http://localhost:5174/?gallery=1`.
- Check the asset in its real category and set.
- Check the actual runtime screen when possible.
- Confirm transparent corners or intended alpha shape.
- Check no key-colour fringe, yellow sticker rim, text, labels, watermark, or
  UI chrome.
- Check the id and path match `src/data.js`.
- Compare against `docs/refs/style-master.png` and the approved enemy/contact
  sheets.
- Shrink mentally to 128px. If the main read disappears, reject.
- For event art, verify it supports the event text and does not promise an
  unchosen branch outcome.
- For card art, verify it does not compete with card text or cost.

Use `npm run build` after final asset activation when the shipped `dist/` needs
to be regenerated. Do not commit unless explicitly asked.

## External Study Sources

- Wizards of the Coast,
  [Anatomy of a Magic Card](https://magic.wizards.com/en/news/feature/anatomy-magic-card-2006-10-21):
  long-standing card information architecture around name, cost, type, rules,
  rarity, and combat values.
- Matt Paquette & Co.,
  [Tabletop Graphic Design: Game Cards 101](https://www.mattpaquette.com/design-blog/2018/7/9/tabletop-graphic-design-card-framworks-101):
  hierarchy, ergonomics, spacing, and designing the frame before commissioning
  art.
- Dylan Mangini,
  [4 Layout Tips for Designing Card Games](https://medium.com/%40dylanmangini/4-layout-tips-for-designing-card-games-17cc98b89b96):
  spacing, visual hierarchy, context of use, and font restraint.
- Daniel Solis,
  [5 Graphic Design and Typography Tips for your Card Game](https://danielsolisblog.blogspot.com/2011/11/5-graphic-design-and-typography-tips.html):
  repeated text can become symbols, and art should communicate what the card
  does.
- Rebecca Sweeton Yoo,
  [The UX Design of Board Games, Part 2: Iconography](https://www.linkedin.com/pulse/ux-design-board-games-part-2-iconography-rebecca-sweeton-yoo-):
  icon consistency matters more than decorative variety.
- Cloudfall Studios,
  [Game Design Tips from Slay the Spire](https://www.cloudfallstudios.com/blog/2020/11/2/game-design-tips-reverse-engineering-slay-the-spires-decisions):
  deckbuilder cards solve tactical problems and should make those problems
  legible.

These sources are not style references. They are usability references for how
Spirebound's own stained-glass art should behave.
