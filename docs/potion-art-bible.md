# Potion Art Bible

Canonical study notes for Spirebound potion artwork. Read this before generating
or replacing any `src/assets/potions/*.png` asset.

The global asset style remains in [`style-bible.md`](./style-bible.md). The
current raster workflow remains in
[`generated-art-workflow.md`](./generated-art-workflow.md). This file narrows
both down to the seven potion phials used by the HUD, rewards, shop, and gallery.

## Purpose

Potions are tactical one-shot tools. They are not cards, relics, or full
illustrations; their job is to be recognised quickly when the player scans the
small potion slots beside the combat HUD.

The generated PNG must be a single phial object only. The runtime supplies the
slot, tooltip, menu, reward row, shop row, target mode, and all text. Do not bake
in labels, letters, UI frames, price tags, button states, shadows, or card-like
composition.

## Runtime Constraints

- Path: `src/assets/potions/<potion-id>.png`.
- `<potion-id>` must match the internal key in `src/data.js`.
- Format: transparent PNG, target maximum 256 px.
- Runtime fallback: if the PNG is missing, `potionSvg(tone)` in `src/art.js`
  provides a procedural SVG fallback.
- Desktop HUD slot is 38 x 44 px, with the fallback SVG drawn around 30 x 38 px.
- Phone portrait slot is 32 x 38 px, with the fallback SVG around 25 x 32 px.
- Phone landscape slot is 30 x 36 px.
- Gallery review is larger, but the HUD size is the real pass/fail test.

Consequence: potion art must survive at roughly 30 px high. Treat it as a game
icon with stained-glass materials, not as a miniature painting.

## Generation Workflow

Use the current project workflow from
[`generated-art-workflow.md`](./generated-art-workflow.md):

1. Generate the source image with built-in Codex Image Gen directly.
2. Clean up the selected source with Nano Banana Pro when useful.
3. Convert to alpha locally.
4. Run outer rim cleanup when the source has a warm sticker-like edge.
5. Review in `?gallery=1` and at HUD scale before accepting.

Do not use `codex exec`, `tools/imagegen.sh`, or `tools/genasset.sh` as the
primary route for future potion work. Do not fall back to `gpt-image-1.5`.
Record the exact prompt, generated image id, source path, alpha path, any
rim-cleaned path, and review outcome in the scratch set's `prompt-ledger.md`
before generating the next variation.

## Locked Potion Style

Use this as the potion-specific style block:

```text
Single centred Spirebound potion phial, serious cartoon-gothic stained-glass
game icon, chunky dark outer silhouette, simplified exaggerated bottle
proportions, one iconic readable stopper/body/core shape, 3-5 large jewel-tone
glass colour masses with very few thick lead dividers, matte painterly glass
texture, warm amber rim light, soft controlled inner glow inside the liquid or
core. Designed to remain readable at 30 px HUD size and 128 px gallery size.
Fully transparent background after alpha cutout. No text, no letters, no labels,
no watermark, no UI frame.
```

The seven phials should feel like one crafted set from the same cathedral world:
same lead-line weight, same dark silhouette strength, same warm rim logic, and
similar visual height. They should not become seven colour-swaps of the same
bottle.

## Readability Hierarchy

1. Bottle silhouette, stopper, cap, body proportion, and base.
2. One gameplay symbol or core shape.
3. Dominant tone colour.
4. Glass texture and small panes.
5. Decorative glow, bubbles, sparks, or smoke.

If the black silhouette does not distinguish the potion family, the design is
not ready. If the effect can only be recognised by colour, regenerate with a
different bottle shape, cap, base, or core.

## Current Catalogue

Keep the internal keys exact. Do not rename `venom` to `poison`; save the final
file as `src/assets/potions/venom.png`.

`Fervor` is the in-game status spelling and should remain exact when referring
to that status, even though this document otherwise uses UK English.

| Key | Display name | Tone | Gameplay read | Art hook | Prompt subject seed |
|---|---|---|---|---|---|
| `healing` | Phial of Dawn | `#ff6b81` | Heal 20 HP | Rose dawn phial, round life-giving body, warm sunrise core | a rose-glass dawn healing phial with a round rose body and warm sunrise core |
| `strength` | Phial of Fervor | `#ff8c5a` | Gain 2 Fervor | Angular orange war-fire phial, sharp ember stopper, triangular hot panes | an orange-glass Fervor phial with an angular war-flame body and sharp ember stopper |
| `swift` | Inkdraught | `#8fd0ff` | Draw 3 cards | Tall blue inkdrop phial, slanted neck, flowing ink-current panes | a pale-blue inkdraught phial with a tall narrow body and flowing ink-current panes |
| `block` | Phial of Held Light | `#9aa7b8` | Gain 12 Ward | Silver ward phial, shield-shaped body, broad stable base, held-light core | a silver-glass Ward phial with a shield-shaped body and held-light core |
| `fire` | Stormglass Phial | `#ffd166` | Deal 20 targeted damage | Red-gold stormglass, flame-shaped inner core, split storm panes | a red-gold stormglass phial with a flame-shaped inner core and storm-split panes |
| `venom` | Smolderphial | `#a3e06c` | Apply 7 Smolder | Green ash-smoke phial, ember bubbles, dark coal core, dangerous but not generic poison | a green Smolder phial with smoky ember bubbles and a dark coal core |
| `energy` | Emberphial | `#ff9a4d` | Gain 3 Embers | Amber lantern-fuel phial, reservoir body, glowing ember core distinct from strength | an amber Ember phial with a lantern-reservoir body and glowing ember core |

## Approved Baseline Direction

The approved current potion set is in
`src/assets-readable-baseline/potions/`. Source images, alpha cutouts, 256 px
runtime candidates, prompt notes, and review sheets are retained in
`scratch/potion-demos/20260706-current-seven-r1/`.

Approved shape and colour direction:

- fat, chunky, wide, squat phial bodies
- short sturdy necks and broad bases
- sharp saturated jewel colours
- fewer strokes and fewer stained-glass seams
- larger colour masses, usually 2-4 major panes
- clear black silhouette before texture
- no labels, letters, UI frames, floor, shadows, or baked text

This direction supersedes thinner vial variants for the current potion set. Use
it when writing future individual potion prompts.

## Prompt Template

Use this shape for Step 1. Replace the bracketed fields, then append any
asset-specific constraints from the catalogue.

```text
Use case: stylized-concept
Asset type: Spirebound potion alpha-ready source
Primary request: <display name>, <prompt subject seed>. Make it a single
centred potion phial, not a card, not a full scene, and not a UI icon inside a
frame.
Gameplay read: <effect>. Show the effect through bottle silhouette and core
shape first, colour second, small detail last. The phial must remain readable at
30 px in the in-game potion HUD slot.
Style/medium: serious cartoon-gothic stained-glass game icon; chunky dark outer
silhouette; simplified exaggerated phial proportions; 3-5 large jewel-tone glass
colour masses only; very few thick lead dividers; matte painterly glass texture;
warm amber rim light; controlled inner glow limited to the liquid or focal core;
no glossy 3D render, no generic mobile-game booster art.
Composition/framing: square alpha-ready source; single complete centred phial;
generous padding; comparable visual height to the existing potion set; no
cropped stopper, cork, base, smoke, bubbles, flame, or glass points.
Lighting/mood: sober gothic mood; high value contrast on the main silhouette;
glow supports the gameplay read but does not obscure the dark lead outline.
Palette: dominant <tone colour and named family>, black lead, restrained warm
amber rim light.
Scene/backdrop: perfectly flat solid #ff00ff chroma-key background only.
Constraints: no ground plane; no floor; no shadows; no reflections; no haze
touching the silhouette; no text; no letters; no labels; no watermark; no UI
chrome; do not use #ff00ff in the subject.
```

For Step 2, use the fixed Nano Banana Pro prompt in
[`generated-art-workflow.md`](./generated-art-workflow.md). Do not rewrite that
prompt unless the workflow document changes.

## Review Gate

Before promoting any potion asset:

- Open `http://localhost:5174/?gallery=1`.
- Inspect the potion in the `potions` gallery row.
- Inspect it in a real HUD slot when possible.
- Shrink the candidate mentally or with a contact sheet to 38 x 44 px, 32 x
  38 px, 30 x 36 px, and 128 px.
- Check the output is PNG or WebP with alpha.
- Check all four corners are transparent.
- Check no key-colour fringe, opaque/checkered background, yellow sticker rim,
  baked shadow, floor, text, label, watermark, price tag, or UI frame remains.
- Check enclosed bottle holes, handles, and gaps are transparent if they are
  supposed to be empty background.
- Check the full stopper, bottle, base, and effect shape are not cropped.
- Check same-family colours are still distinct by silhouette: `strength` versus
  `energy`, `fire` versus `strength`, and `healing` versus `fire`.
- Check the filename matches the internal key from `src/data.js`.

Reject and regenerate if the asset only works at full size, if it is just a
colour variant of another bottle, or if its most memorable feature is unrelated
to the potion's effect.

## Common Failures

| Failure | Correction |
|---|---|
| Colour-only variants collapse at HUD size | Change the bottle silhouette, stopper, base, or inner core before changing palette |
| Too many stained-glass seams become grey mush | Reduce to 3-5 larger panes and strengthen the dark outer contour |
| Nano Banana changes the background to black or white | Use border-connected removal, not global keying, so lead lines and highlights survive |
| Warm yellow sticker rim appears around the alpha edge | Run `tools/strip-alpha-rim.py` in darken mode and re-check the corners |
| The old fallback glyph is copied too literally | Treat the glyph as a semantic hint, not as text or a label |
| `strength`, `fire`, and `energy` all read as orange flames | Give each a different body: angular war-fire, storm-split flame core, lantern reservoir |
| `block.png` is much narrower than the rest of the set | Future candidates should be centred in a 256 px canvas with comparable visual height unless there is a deliberate reason |
| File is saved as `poison.png` | Rename the candidate workflow, not the game key; final asset must be `venom.png` |

## External Study Sources

- Daniel Solis,
  ["Three Principles of Card Design: Visibility, Hierarchy, Brevity"](https://danielsolisblog.blogspot.com/2024/02/three-principles-of-card-design.html)
  - keep the player's scan path simple: visibility first, hierarchy second,
    brevity third.
- Wizards of the Coast,
  ["Stages of Design"](https://magic.wizards.com/en/news/making-magic/stages-of-design)
  - individual pieces should be exciting, but a mature game needs repeated
    structure and consistent templates.
- Dylan Mangini,
  ["4 Layout Tips for Designing Card Games"](https://medium.com/%40dylanmangini/4-layout-tips-for-designing-card-games-17cc98b89b96)
  - leave breathing room and design for the actual way players hold, scan, and
    use cards.
- Slay the Spire Wiki,
  ["Potions"](https://slay-the-spire.fandom.com/wiki/Potions)
  - useful genre reminder: potions are immediate tactical resources rather than
    card plays.
- Untapped.gg,
  ["Slay the Spire 2 Potion List"](https://sts2.untapped.gg/en/potions)
  - effect families are visually distinguished; potion art should be semantic,
    not only palette-based.
- 80 Level,
  ["Character Design: Shape Language and Readability"](https://medium.com/%40EightyLevel/character-design-shape-language-and-readability-6ee4bb6f98a6)
  - block in large readable shapes first; detail everywhere becomes noise.
- Lunar Academy,
  ["What Is Your Character's Silhouette Telling You?"](https://www.lunaracademy.co/post/what-is-your-characters-silhouette-telling-you?utm_campaign=silhouette_blog&utm_medium=social&utm_source=linkedin)
  - a design should remain recognisable as a black silhouette.
- GameDev StackExchange,
  ["How do you make small icons look good?"](https://gamedev.stackexchange.com/questions/185027/how-do-you-make-small-icons-look-good)
  - test icons at the final display sizes because runtime scaling changes the
    read.
- Adobe Design,
  ["How to design effective icons, Part 1"](https://adobe.design/ideas/how-to-design-effective-icons-part-1)
  - define style and canvas rules early so simple and complex icons feel like
    one set.
