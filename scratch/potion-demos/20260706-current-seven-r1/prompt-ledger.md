# Current Seven Potion Generation - Round 1

Purpose: generate one candidate for every current potion in `src/data.js` using
the accepted Round 3 direction: fatter bodies, sharper saturated colour, fewer
strokes, larger colour masses, and cleaner HUD-scale silhouettes.

Current potion count: **7**.

These are scratch candidates. Existing runtime assets in `src/assets/potions/`
were not overwritten.

Approval: the user approved all seven potion candidates on 2026-07-06. The
256 px alpha versions were promoted to
`src/assets-readable-baseline/potions/` for gallery review and future use.

## Output Folders

- `source/` - copied built-in Image Gen sources on flat `#ff00ff` chroma-key
  background.
- `alpha/` - chroma-key removed alpha PNGs at source size.
- `runtime-256/` - alpha PNGs downscaled to 256 px max for runtime review.
- `review/source-contact.png` - contact sheet of source images.
- `review/runtime-256-contact-dark.png` - contact sheet of 256 px alpha images
  composited on a dark background.
- `review/readable-baseline-potions-contact-dark.png` - contact sheet from the
  promoted `src/assets-readable-baseline/potions/` files.

## Selected Candidates

| Key | Display name | Source image | Runtime review image |
|---|---|---|---|
| `healing` | Phial of Dawn | `/Users/jamesto/.codex/generated_images/019f345f-9703-7992-9141-49b16e950c26/ig_04506d4697c9a93e016a4ae2ea59248191b42cc034741e4522.png` | `runtime-256/healing.png` |
| `strength` | Phial of Fervor | `/Users/jamesto/.codex/generated_images/019f345f-9703-7992-9141-49b16e950c26/ig_04506d4697c9a93e016a4ae33e43148191ada30d97c437b488.png` | `runtime-256/strength.png` |
| `swift` | Inkdraught | `/Users/jamesto/.codex/generated_images/019f345f-9703-7992-9141-49b16e950c26/ig_04506d4697c9a93e016a4ae39d69a88191b42ca265620077a0.png` | `runtime-256/swift.png` |
| `block` | Phial of Held Light | `/Users/jamesto/.codex/generated_images/019f345f-9703-7992-9141-49b16e950c26/ig_04506d4697c9a93e016a4ae3e8e6748191bb92334a1914d87b.png` | `runtime-256/block.png` |
| `fire` | Stormglass Phial | `/Users/jamesto/.codex/generated_images/019f345f-9703-7992-9141-49b16e950c26/ig_04506d4697c9a93e016a4ae438fdbc8191b7be0bae644ebb77.png` | `runtime-256/fire.png` |
| `venom` | Smolderphial | `/Users/jamesto/.codex/generated_images/019f345f-9703-7992-9141-49b16e950c26/ig_04506d4697c9a93e016a4ae48a4a8c81918f0232713474c33f.png` | `runtime-256/venom.png` |
| `energy` | Emberphial | `/Users/jamesto/.codex/generated_images/019f345f-9703-7992-9141-49b16e950c26/ig_04506d4697c9a93e016a4ae4dd97c48191b84fc3167fb523fb.png` | `runtime-256/energy.png` |

## Shared Prompt Direction

Every image used built-in Codex Image Gen with this shared direction:

```text
Round 3 accepted direction: fatter, chunkier, wider, more squat bottle shape;
sharper saturated jewel colour; fewer strokes; fewer stained-glass seams;
larger colour blocks; clean silhouette; more graphic and icon-readable.
Style/medium: serious cartoon-gothic stained-glass game icon; chunky dark outer
silhouette; simplified exaggerated fat phial proportions; saturated jewel-tone
glass; only 2-4 large colour masses; very few thick lead dividers; subtle matte
glass texture; warm amber rim light; controlled inner glow limited to the core;
no glossy 3D render; no generic mobile-game booster art.
Scene/backdrop: perfectly flat solid #ff00ff chroma-key background only.
Constraints: no ground plane; no floor; no shadows; no reflections; no haze
touching the silhouette; no text; no letters; no labels; no watermark; no UI
chrome; do not use #ff00ff in the subject; no dense lacework; no micro-panels;
no crosshatching; no tiny repeated strokes.
```

## Per-Asset Subject Lines

- `healing`: Phial of Dawn, healing potion; rose-glass dawn healing phial with a
  fat round body, short sturdy neck, wide base, cork stopper, and warm sunrise
  core.
- `strength`: Phial of Fervor, strength potion; orange-glass Fervor phial with a
  fat angular war-fire body, broad base, sharp ember crest stopper, and hot
  triangular blaze core.
- `swift`: Inkdraught, draw potion; pale-blue inkdraught phial with a fat
  teardrop body, short sturdy neck, wide base, cork stopper, and flowing blue
  ink-current panes.
- `block`: Phial of Held Light, Ward potion; silver-blue Ward phial with a fat
  broad shield-shaped body, short sturdy neck, thick base, cork stopper, and
  bright held-light core behind a simple shield pane.
- `fire`: Stormglass Phial, targeted damage potion; red-gold stormglass phial
  with a fat wide flask body, angular storm cap, and a flame-shaped lightning
  core split through large glass panes.
- `venom`: Smolderphial, Smolder debuff potion; green Smolder phial with a fat
  squat ash-glass body, blackened stopper cap, smoky ember bubbles inside, and a
  dark coal core.
- `energy`: Emberphial, energy potion; amber Ember phial with a fat
  lantern-reservoir body, short sturdy neck, thick base, lantern-cap stopper,
  and glowing ember fuel beads inside.

## Post-Processing

Alpha was created with:

```bash
python3 /Users/jamesto/.codex/skills/.system/imagegen/scripts/remove_chroma_key.py \
  --input <source.png> \
  --out <alpha.png> \
  --auto-key border \
  --soft-matte \
  --transparent-threshold 12 \
  --opaque-threshold 220 \
  --despill
```

Then each alpha PNG was copied to `runtime-256/` and downscaled with
`sips -Z 256`.

Validation: every `runtime-256/*.png` is 256 x 256, has alpha, and has fully
transparent corners.

Promoted validation: every `src/assets-readable-baseline/potions/*.png` is
256 x 256, has alpha, and has fully transparent corners.

Promoted files:

```text
src/assets-readable-baseline/potions/block.png
src/assets-readable-baseline/potions/energy.png
src/assets-readable-baseline/potions/fire.png
src/assets-readable-baseline/potions/healing.png
src/assets-readable-baseline/potions/strength.png
src/assets-readable-baseline/potions/swift.png
src/assets-readable-baseline/potions/venom.png
```

## Notes

- Best current reads: `block`, `swift`, `venom`, `energy`.
- `healing` is clear and very readable, but its inner glow produced more partial
  alpha on the first cutout than the rest; check it carefully in game if promoted.
- `strength`, `fire`, and `energy` are intentionally different silhouettes, but
  the orange/red family still needs in-game gallery comparison before promotion.
