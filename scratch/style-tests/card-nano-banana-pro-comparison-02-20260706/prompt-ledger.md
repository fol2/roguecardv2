# Prompt Ledger - Nano Banana Pro Card Comparison 02

Generated on 2026-07-06 as a separate comparison slice. These files do not
replace the live card assets.

Mode: Nano Banana Pro direct text-to-image via
`/Users/jamesto/.codex/skills/nanobanana/scripts/nanobanana.py`.

Model settings: `--model nanobanana-pro --ratio 3:2 --size 2K`. Nano Banana Pro
does not support the exact 16:10 card ratio used by the original GPT prompts,
so this comparison uses the closest supported wide ratio without local crop or
resize.

No post-processing rule: final gallery files under
`src/assets-nano-banana/cards/` are byte-for-byte copies of the accepted Nano
Banana Pro source outputs. No brightness, contrast, colour, crop, resize, format
conversion, or metadata stripping was applied to those final files. The contact
sheet in this folder is review-only and is not a source asset.

## Prompt Construction

Each call used the shared direct-comparison adapter below plus the exact stored
source prompt from the per-card prompt ledger.

Shared adapter:

```text
Nano Banana Pro direct comparison pass for Spirebound card art. Use the stored Image Gen prompt below as the source of truth for subject, story, gameplay read, style, palette, separation/readability, and constraints. Canvas override: Nano Banana Pro does not offer exact 16:10 or 800 x 500 output here, so generate a wide horizontal 3:2 full-bleed rectangular scene and ignore exact 16:10 / 800 x 500 pixel wording if it appears. Do not make a full card mockup, badge, icon, UI frame, text, label, watermark, transparent background, chroma-key, cutout, inset image, grey matte, nested picture frame, empty padding, or poster layout. No local post-processing will be used, so lighting, contrast, colour, foreground/background separation, and framing must be correct in the generated image itself.
```

`smother` v2 used the same adapter plus a stronger rerun correction:

```text
Critical correction for this rerun: the artwork must fill the entire canvas edge to edge as one continuous illustrated scene. No grey matte, no white matte, no black border, no empty padding, no nested rectangle, no inner picture frame, no poster layout, no card mockup, no UI frame. The sapphire-blue ward hand, cracked enemy coal, green-orange Smolder smoke, and ash chapel background must all be part of the same full-bleed scene.
```

Command shape:

```bash
python3 /Users/jamesto/.codex/skills/nanobanana/scripts/nanobanana.py generate \
  --prompt "<shared adapter + stored source prompt>" \
  --model nanobanana-pro \
  --ratio 3:2 \
  --size 2K \
  --output "scratch/style-tests/card-nano-banana-pro-comparison-02-20260706/source/<id>-nanobanana-pro" \
  --json
```

## Output Summary

| Card | Source prompt record | Source output | Gallery asset | Output SHA-256 |
|---|---|---|---|---|
| `ashBite` / Ashbite | `scratch/style-tests/card-production-batch-02-20260706/prompt-ledger.md` | `source/ashBite-nanobanana-pro.jpg` | `src/assets-nano-banana/cards/ashBite.jpg` | `5f96890595ec78904d995c8d3382cc100b86e76ab10049c2299ca27c5ee7b1ce` |
| `smother` / Smother | `scratch/style-tests/card-production-batch-02-20260706/prompt-ledger.md` | `source/smother-nanobanana-pro-v2.jpg` | `src/assets-nano-banana/cards/smother.jpg` | `8afef723e692df3e5f20b8f82df5f3953bfcacf9e6a033da3dd3e4df60f5d730` |
| `twinFangs` / Twin Shards | `scratch/style-tests/card-production-batch-02-20260706/prompt-ledger.md` | `source/twinFangs-nanobanana-pro.jpg` | `src/assets-nano-banana/cards/twinFangs.jpg` | `77a14f99bb0ab02bfac0874d3c24381cd373bc73f39a2adcf17a5abbe4082d01` |
| `quickSlash` / Flicker | `scratch/style-tests/card-production-batch-03-20260706/prompt-ledger.md` | `source/quickSlash-nanobanana-pro.jpg` | `src/assets-nano-banana/cards/quickSlash.jpg` | `03200c2d3d8d5ace76fbb87a140e1d0e258a1440bd149523a992a0b1692b1083` |
| `heavyBlow` / Quarry Maul | `scratch/style-tests/card-production-batch-03-20260706/prompt-ledger.md` | `source/heavyBlow-nanobanana-pro.jpg` | `src/assets-nano-banana/cards/heavyBlow.jpg` | `c9c6c5f90767ab5c4f4f62e34f2d3ce25aa7b5468a278674a121c8802030609d` |

Rejected evidence:

| Card | Rejected source | Reason | SHA-256 |
|---|---|---|---|
| `smother` | `source/smother-nanobanana-pro-v1-rejected-inset-frame.jpg` | inset image with grey matte, not full-bleed card art | `9cf9c393e9fcfcaadd5607fabd1f14b43f4192e56c672b6c556ecada9e122f32` |

Comparison sheet: `live-vs-nano-banana-pro-contact-02.jpg` (top row live,
bottom row Nano Banana Pro).
