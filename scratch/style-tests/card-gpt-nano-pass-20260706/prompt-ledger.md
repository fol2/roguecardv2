# Prompt Ledger - GPT -> Nano Pass Card Comparison 01

Generated on 2026-07-06 as a separate comparison set. Regenerated on the same
date for cards 1-5 with the short Nano Banana pass prompt plus style frame
only. These files do not replace the live card assets.

Mode: image-to-image Nano Banana Pro pass over existing live GPT card art via
`/Users/jamesto/.codex/skills/nanobanana/scripts/nanobanana.py`.

Model settings: `--model nanobanana-pro --ratio 3:2 --size 2K`. Nano Banana Pro
does not support the exact 16:10 card ratio used by the original GPT prompts,
so this comparison uses the closest supported wide ratio without local crop or
resize.

No post-processing rule: final gallery files under
`src/assets-gpt-nano-pass/cards/` are byte-for-byte copies of the accepted Nano
Banana Pro source outputs. No brightness, contrast, colour, crop, resize, format
conversion, or metadata stripping was applied to those final files. The contact
sheet in this folder is review-only and is not a source asset.

First-five selection: gallery/data order, `strike`, `defend`, `eclipseSlash`,
`chisel`, `firstSpark`.

## Prompt Construction

Each regenerated Nano Banana Pro call used:

1. the short Nano Banana pass prompt below;
2. the style frame only, with no appended stored GPT prompt and no identity
   check block;
3. the existing live GPT image as `--input-image src/assets/cards/<id>.png`.

Prompt:

```text
帮我将这张图片重绘和清晰化，让它细节更丰富，同时去掉原图中杂乱不必要的细节。

Style frame only: Spirebound card art; serious cartoon-gothic dark fantasy; full-bleed horizontal rectangular scene; stained-glass game illustration with chunky black lead lines, matte painterly glass panes, bold foreground subject clearly separated from a quieter narrative background, 3-5 large jewel-tone colour masses, warm amber rim light, crisp contrast, readable at 64px. Keep the input image's core composition, subject action, palette family, and gameplay read. Do not add text, UI, frame, border, watermark, or card mockup.
```

Command shape:

```bash
python3 /Users/jamesto/.codex/skills/nanobanana/scripts/nanobanana.py generate \
  --prompt "<short pass prompt + style frame only>" \
  --input-image "src/assets/cards/<id>.png" \
  --model nanobanana-pro \
  --ratio 3:2 \
  --size 2K \
  --output "scratch/style-tests/card-gpt-nano-pass-20260706/source/<id>-gpt-nano-pass" \
  --json
```

## Output Summary

| Card | GPT input | Input SHA-256 | Nano source output | Gallery asset | Output SHA-256 |
|---|---|---|---|---|---|
| `strike` / Edge | `src/assets/cards/strike.png` | `6951eea1cd0a7e6cbd894a8dcc5cf9ea83a673820f1933a260eb658cee3e5020` | `source/strike-gpt-nano-pass.jpg` | `src/assets-gpt-nano-pass/cards/strike.jpg` | `31af59c1f805138615b76a6b8ac7b58b98874e9e211dac1564ab64c922fff6fe` |
| `defend` / Ward | `src/assets/cards/defend.png` | `27ba4afd0fd3144461de14d395f5c5ee722b4ab42dc2bac43d5d1aa42f04224d` | `source/defend-gpt-nano-pass.jpg` | `src/assets-gpt-nano-pass/cards/defend.jpg` | `b4449e6cb179f6a5d29c21aefba51274f1cb66a0951a223cecce04ba4c7397ee` |
| `eclipseSlash` / Eclipse Slash | `src/assets/cards/eclipseSlash.png` | `44427ab21e40c4266aebff969f1ce7676e977d89a28151b8943b4b8543f00a8a` | `source/eclipseSlash-gpt-nano-pass.jpg` | `src/assets-gpt-nano-pass/cards/eclipseSlash.jpg` | `c9eed49e7d40651fec3e39ffe97758aa7ac1fbb99cc0b0fe6af9223825617790` |
| `chisel` / Chisel | `src/assets/cards/chisel.png` | `db138ef053d6de80866b3325a8833e248b253a18a66f58cd118635c7976151bd` | `source/chisel-gpt-nano-pass.jpg` | `src/assets-gpt-nano-pass/cards/chisel.jpg` | `d69ad3f73dd1d19e7ff00e01136be8f4f8cc0daeb87444a0172730162d6efe83` |
| `firstSpark` / First Spark | `src/assets/cards/firstSpark.png` | `bc48f49b6753c76c6fe4bb98f0224301e6da02ccea7bedd7ac4fe7e671a5f6a4` | `source/firstSpark-gpt-nano-pass.jpg` | `src/assets-gpt-nano-pass/cards/firstSpark.jpg` | `eb1b257f3f35faafe73176c0d9d7b2e3f56357db85bdb5cd19e6313af32bc7b3` |

Comparison sheet: `live-vs-gpt-nano-pass-contact.jpg` (top row live GPT,
bottom row GPT -> Nano pass).

## `strike` / Edge

Live GPT source record, not appended to the Nano prompt:
`scratch/style-tests/card-first-three-separation-readable-baseline-20260706/prompt-ledger.md`

Input image: `src/assets/cards/strike.png`

Source output: `source/strike-gpt-nano-pass.jpg`

Gallery asset: `src/assets-gpt-nano-pass/cards/strike.jpg`

Review note: accepted for comparison set; preserves the blade/read window
composition and increases line clarity without adding a frame.

## `defend` / Ward

Live GPT source record, not appended to the Nano prompt:
`scratch/style-tests/card-first-three-separation-readable-baseline-20260706/prompt-ledger.md`

Input image: `src/assets/cards/defend.png`

Source output: `source/defend-gpt-nano-pass.jpg`

Gallery asset: `src/assets-gpt-nano-pass/cards/defend.jpg`

Review note: accepted for comparison set; preserves the blue ward wall, lantern,
and incoming red strike while increasing local clarity.

## `eclipseSlash` / Eclipse Slash

Live GPT source record, not appended to the Nano prompt:
`scratch/style-tests/card-production-batch-01-20260706/prompt-ledger.md`

Input image: `src/assets/cards/eclipseSlash.png`

Source output: `source/eclipseSlash-gpt-nano-pass.jpg`

Gallery asset: `src/assets-gpt-nano-pass/cards/eclipseSlash.jpg`

Review note: accepted for comparison set; preserves the eclipse/slash read.
The pass slightly shifts the chapel framing and softens some crimson intensity,
so this should be judged against the live card before promotion.

## `chisel` / Chisel

Live GPT source record, not appended to the Nano prompt:
`scratch/style-tests/card-production-batch-01-20260706/prompt-ledger.md`

Input image: `src/assets/cards/chisel.png`

Source output: `source/chisel-gpt-nano-pass.jpg`

Gallery asset: `src/assets-gpt-nano-pass/cards/chisel.jpg`

Review note: accepted for comparison set; preserves the full-bleed hand/chisel
against blue glass and avoids the inset-frame failure seen in the direct
text-to-image Nano Banana comparison.

## `firstSpark` / First Spark

Live GPT source record, not appended to the Nano prompt:
`scratch/style-tests/card-production-batch-01-20260706/prompt-ledger.md`

Input image: `src/assets/cards/firstSpark.png`

Source output: `source/firstSpark-gpt-nano-pass.jpg`

Gallery asset: `src/assets-gpt-nano-pass/cards/firstSpark.jpg`

Review note: accepted for comparison set; preserves the hand, spark, and rising
card pane. The pass makes the background architecture cleaner but slightly more
dominant, so thumbnail review matters before any promotion decision.
