# Prompt Ledger - GPT -> Nano Pass Card Comparison 06

Generated on 2026-07-06 as a separate comparison slice for cards 41-50.
`quakeblow` was regenerated on the same date by user request with the same
dedicated prompt. These files do not replace the live card assets.

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

Each Nano Banana Pro call used:

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
  --output "scratch/style-tests/card-gpt-nano-pass-06-20260706/source/<id>-gpt-nano-pass.jpg" \
  --json
```

## Output Summary

| Card | GPT input | Input SHA-256 | Nano source output | Gallery asset | Output SHA-256 |
|---|---|---|---|---|---|
| `offering` / Pyre Tithe | `src/assets/cards/offering.png` | `786f7e2ae3f3d17e5363524c89dfc19a944390ad827a1080fc4f052e0255654f` | `source/offering-gpt-nano-pass.jpg` | `src/assets-gpt-nano-pass/cards/offering.jpg` | `96fcdb32b4f56521f3ec3d84d38905fdd46c55ac77ecbd6b5d6dce2aa6dccf2c` |
| `limitBreak` / Annealing Rite | `src/assets/cards/limitBreak.png` | `c1917eff769dca10d384727fc31fbdd38558da9c311c16a7815ba2d0096a54ad` | `source/limitBreak-gpt-nano-pass.jpg` | `src/assets-gpt-nano-pass/cards/limitBreak.jpg` | `6dac3faae74e118000e2d974c34c5d9e04dcb14af2ad819765599d529bc58971` |
| `catalyst` / Bellows | `src/assets/cards/catalyst.png` | `14e80d95bf1f9ba66ed12df521ff265b917b1856ef05adf57ea2a47a80ab4305` | `source/catalyst-gpt-nano-pass.jpg` | `src/assets-gpt-nano-pass/cards/catalyst.jpg` | `cff57b57ea744b435b8fdee04da133214c7a39f0d6605b9090b048c52bdb06ea` |
| `ascension` / Rising Litany | `src/assets/cards/ascension.png` | `9f054b26e180049770427ccd5bc7c373c31ff38d785419015755ca5c89c58f9b` | `source/ascension-gpt-nano-pass.jpg` | `src/assets-gpt-nano-pass/cards/ascension.jpg` | `2db13225364782f6bc0449f7d5964f34af49434ec6daf038b3ab039a6c800519` |
| `bastion` / Anneal | `src/assets/cards/bastion.png` | `a9b76dc47fb7f27c888a22c9d302e2d415629f091ff3cedaed87df08ab128c10` | `source/bastion-gpt-nano-pass.jpg` | `src/assets-gpt-nano-pass/cards/bastion.jpg` | `c5635d00bc60a4c87a94c637058c8bff84a9daed789f3bf30691cf4318109975` |
| `frenzy` / Overglow | `src/assets/cards/frenzy.png` | `3caa70e41dc33292c6bb9e2cd5de82c7ef57cd73b541a788e2e9bf649aafc8d0` | `source/frenzy-gpt-nano-pass.jpg` | `src/assets-gpt-nano-pass/cards/frenzy.jpg` | `f313ed25d984fe028f5935ca15d89ae6ec4a6c282680931ca6b4d08ccb0bceea` |
| `virulence` / Emberfang | `src/assets/cards/virulence.png` | `bf18643a514988c476c57dbcd3cdd208eadf3363105c29ad186f6a79698046aa` | `source/virulence-gpt-nano-pass.jpg` | `src/assets-gpt-nano-pass/cards/virulence.jpg` | `813b659f2ba8e6fb3fdd3a84a8fd15f3a26ed2fc5860a565b5527c662b5fc7b8` |
| `quakeblow` / Quakeblow | `src/assets/cards/quakeblow.png` | `dd82d1cc7596287391d729cb338372c445f9c91ae7cf708645baf789c3266512` | `source/quakeblow-gpt-nano-pass.jpg` | `src/assets-gpt-nano-pass/cards/quakeblow.jpg` | `8cca52e6a46a201d2bb7775257c0eeb397e00a86eb532686cf72098803529c47` |
| `resonantLance` / Resonant Lance | `src/assets/cards/resonantLance.png` | `111d019209b7877584c056880a826668b314730421da3171081de02866d9d39f` | `source/resonantLance-gpt-nano-pass.jpg` | `src/assets-gpt-nano-pass/cards/resonantLance.jpg` | `88ac7f98e6d461b1d4af67024b3e7328eb54a7e2907afdb47b6d4530ef297406` |
| `tithe` / Tithe of Panes | `src/assets/cards/tithe.png` | `af9bd06e7ceb84ebbfa480fb4de31388e7c05edaea9b7465e74e0b2bae8037d5` | `source/tithe-gpt-nano-pass.jpg` | `src/assets-gpt-nano-pass/cards/tithe.jpg` | `950580316f933dd788c85a65b2de6cd8f591f3aacec52b53afd6213c5ce35f22` |

Comparison sheet: `live-vs-gpt-nano-pass-contact-06.jpg`. Rows 1 and 3 show
live GPT inputs; rows 2 and 4 show the accepted GPT -> Nano pass outputs.

Redo comparison sheet:
`../card-gpt-nano-pass-redo-20260706/warCry-oblivionStrike-quakeblow-ashenChoir-nightSight-redo-contact.jpg`.
Rows show live GPT inputs, superseded GPT -> Nano pass outputs, and accepted
redo outputs.

## Rejected And Superseded Evidence

| Card | Superseded source | Reason | SHA-256 |
|---|---|---|---|
| `quakeblow` / Quakeblow | `source/quakeblow-gpt-nano-pass-v1-superseded-by-redo.jpg` | superseded by user-requested redo using the same prompt | `df3597749b9c6b7aee6221d75c36a345d6b0f0b4886abca215e6c920fad998ee` |
