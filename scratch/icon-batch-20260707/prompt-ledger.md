# Icon batch prompt ledger - 2026-07-07

Generated for Task 11 of `docs/superpowers/plans/2026-07-06-visualisation-hardening-polish.md`.

## Source workflow

- Generation path: Codex built-in `image_gen` invoked through `codex exec` / `$imagegen`.
- Style reference: `docs/refs/style-master.png`.
- Source outputs: `scratch/icon-batch-20260707/source/{omens,boons,arts}/*-source.png`.
- Alpha outputs: `scratch/icon-batch-20260707/alpha/{omens,boons,arts}/*-alpha.png`.
- Final assets: `src/assets/{omens,boons,arts}/*.png`.

## Shared prompt block

Use case: stylized-concept.

Asset type: Spirebound icon alpha-ready source.

Style/medium: Serious cartoon-gothic stained-glass game art, chunky dark outer silhouette, simplified exaggerated proportions, one iconic readable prop, 3-5 large jewel-tone glass colour masses with very few thick lead dividers, matte painterly texture, warm amber rim light, soft controlled inner glow, readable at 128px.

Composition/framing: square icon, single centred emblem or prop, generous 15 percent padding, no hands, no scene, no ground plane, no contact shadow.

Scene/backdrop: flat solid `#ff00ff` chroma-key background only.

Constraints: no text, no labels, no watermark, no UI chrome, do not use `#ff00ff` inside the subject.

## Subjects

| category | id | subject |
|---|---|---|
| omens | ashfall | grey ash falling past a cracked lantern pane |
| omens | heavyAir | a brass plumb-bob dragging chains of mist |
| omens | thinGlass | a wine-glass-thin pane, spiderweb crack blooming |
| omens | hungryDark | a black maw of smoke swallowing a candle flame |
| omens | emberWind | three embers streaking sideways on a gale line |
| omens | longNight | a moon-dial with the night arc gilded and overlong |
| omens | waningMoon | a crescent moon thinning into glass shards |
| boons | fullPurse | a fat leather purse spilling gold coins |
| boons | temperedGlass | a glass pane banded in riveted brass |
| boons | keenEye | a jeweller's loupe over a faceted gem |
| boons | warmHearth | a small hearth of stacked stones, banked coals |
| boons | emberFlask | a corked flask holding a live ember |
| boons | twinPhials | two slender phials, red and blue, crossed |
| boons | pilgrimsCache | a rope-bound bundle with a map corner showing |
| boons | venomPouch | a waxed pouch weeping one amber drop |
| arts | flare | a lantern bursting a cone of white-gold fire |
| arts | mendglass | a cracked pane re-seaming under green light |
| arts | beacon | a lantern raised on a pole, rays cutting fog |
| arts | emberveil | a curtain of sparks drawn like a veil |
| arts | stoke | a brass poker stirring a coal bed to flame |
| arts | ashfall | a lantern shaking a soft grey ash cloud downward |

## Post-processing

For each id:

```bash
python3 /Users/jamesto/.codex/skills/imagegen/scripts/remove_chroma_key.py \
  --input scratch/icon-batch-20260707/source/<category>/<id>-source.png \
  --out scratch/icon-batch-20260707/alpha/<category>/<id>-alpha.png \
  --auto-key border \
  --soft-matte \
  --transparent-threshold 24 \
  --opaque-threshold 220 \
  --despill \
  --edge-contract 1 \
  --force

python3 tools/strip-alpha-rim.py \
  --input scratch/icon-batch-20260707/alpha/<category>/<id>-alpha.png \
  --out src/assets/<category>/<id>.png \
  --radius 6 \
  --mode darken

sips -Z 512 src/assets/<category>/<id>.png
```

## Review evidence

- Contact sheets: `scratch/icon-batch-20260707/omens-contact.png`, `boons-contact.png`, `arts-contact.png`.
- Pixel validation: all final assets were opened with Pillow as RGBA, checked for `512x512`, transparent corner alpha, and non-empty alpha bounds.
- Manifest gate added in `test/test_engine.js` for `omens`, `boons`, and `arts`.
