# Prompt Ledger - GPT -> Nano Pass Card Comparison 02

Generated on 2026-07-06 as a separate comparison slice. Regenerated on the same
date for cards 6-10 with the short Nano Banana pass prompt plus style frame
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

## Prompt Construction

Each regenerated call used:

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
  --output "scratch/style-tests/card-gpt-nano-pass-02-20260706/source/<id>-gpt-nano-pass" \
  --json
```

## Output Summary

| Card | GPT input | Input SHA-256 | Nano source output | Gallery asset | Output SHA-256 |
|---|---|---|---|---|---|
| `ashBite` / Ashbite | `src/assets/cards/ashBite.png` | `74cc98fb3c06cd322334f11d556b1a91487b5cdf257e494cc48638f8938b6dfa` | `source/ashBite-gpt-nano-pass.jpg` | `src/assets-gpt-nano-pass/cards/ashBite.jpg` | `8a569cb3c6b3ff4e5584ba58c6975479f0880f0cb73f86c6a4b2fc83a6124d0f` |
| `smother` / Smother | `src/assets/cards/smother.png` | `87930d51bd16ee5940aeef36ae7b470138c9bc32056a05a228017d0219b106eb` | `source/smother-gpt-nano-pass.jpg` | `src/assets-gpt-nano-pass/cards/smother.jpg` | `a55419a42b17eee273acff3c3431127ff0f26a7eb027a2f74da214693e97fe19` |
| `twinFangs` / Twin Shards | `src/assets/cards/twinFangs.png` | `b2f2e55acda17a8f9af4b38c6b1c435124b1fcafc66faafb5ad6059c0482bcc1` | `source/twinFangs-gpt-nano-pass.jpg` | `src/assets-gpt-nano-pass/cards/twinFangs.jpg` | `68337c5660a9cd0353fef38a9fb32da0ede6d2ddf22d5453d5bdfe06b26b20ec` |
| `quickSlash` / Flicker | `src/assets/cards/quickSlash.png` | `3c1fcea51f1b8f4611d5f3f995a59841110b596449b4822ed7a398e8776f24dd` | `source/quickSlash-gpt-nano-pass.jpg` | `src/assets-gpt-nano-pass/cards/quickSlash.jpg` | `f77b76ea0ccb470d3b665412a14ca3493e59e2c0629647b42579dc4b12038809` |
| `heavyBlow` / Quarry Maul | `src/assets/cards/heavyBlow.png` | `415456973fa4ec80d8e2ff0a195a2182f286f5dd80e3e79b306db5f098bc6e34` | `source/heavyBlow-gpt-nano-pass.jpg` | `src/assets-gpt-nano-pass/cards/heavyBlow.jpg` | `a50d9c834d70911a9abaf6c75ea07c8d2f5fcaf49840f8345f93c4472a5a048d` |

Comparison sheet: `live-vs-gpt-nano-pass-contact-02.jpg` (top row live GPT,
bottom row GPT -> Nano pass).
