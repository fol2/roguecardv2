# Prompt Ledger - GPT -> Nano Pass Card Comparison 03

Generated on 2026-07-06 as a separate comparison slice for cards 11-20.
`venomStrike` and `leechBlade` were regenerated on the same date by user
request with the same dedicated prompt. These files do not replace the live card
assets.

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
  --output "scratch/style-tests/card-gpt-nano-pass-03-20260706/source/<id>-gpt-nano-pass.jpg" \
  --json
```

## Output Summary

| Card | GPT input | Input SHA-256 | Nano source output | Gallery asset | Output SHA-256 |
|---|---|---|---|---|---|
| `cleave` / Fan of Glass | `src/assets/cards/cleave.png` | `4c1f84f4d639c8346acb36a1617f2122bda3bd1cd295032dbc44a4ffc2efd366` | `source/cleave-gpt-nano-pass.jpg` | `src/assets-gpt-nano-pass/cards/cleave.jpg` | `31dc2761e29c073485e08e2130adc8330b251cc99e823384a5f98245a6e4ea9f` |
| `venomStrike` / Emberbite | `src/assets/cards/venomStrike.png` | `395e3b6edc15a129f0e0bbb3863c668498ee0e0f7473d9fbd317d597998d79cc` | `source/venomStrike-gpt-nano-pass.jpg` | `src/assets-gpt-nano-pass/cards/venomStrike.jpg` | `e610ea21ca9bfbe8ba642db23dc2aa6a742232c027f9c9f4ae93b42c39ecac82` |
| `lunge` / Dimming Cut | `src/assets/cards/lunge.png` | `67ccb0aa5eea021b67c5f687d8139dc17b35a71cecf7104a0d233f19a0d8511d` | `source/lunge-gpt-nano-pass.jpg` | `src/assets-gpt-nano-pass/cards/lunge.jpg` | `5057e0c3a56db47d7d1dd37dbbe70b81a0bb73985c68a6bf2dccdf7e81f802c3` |
| `guardedStrike` / Warden's Edge | `src/assets/cards/guardedStrike.png` | `758438ac5243f9497cb27f2107928b2c599d01450e706e57dc5e995224b3c9ff` | `source/guardedStrike-gpt-nano-pass.jpg` | `src/assets-gpt-nano-pass/cards/guardedStrike.jpg` | `ff26e612fc63cb4bfb6d6bd3d1e20eb2f652a5215f47dca8d4e7706d868a3712` |
| `brace` / Held Light | `src/assets/cards/brace.png` | `9c05b598dd55923ddd67a57a4cd83554c55470cc59f169674d2cf286fb392568` | `source/brace-gpt-nano-pass.jpg` | `src/assets-gpt-nano-pass/cards/brace.jpg` | `976127a6b15980f6db30618eba87a61b8bf2a2653fa49490aeb836c4bc8ddede` |
| `sidestep` / Glasstep | `src/assets/cards/sidestep.png` | `050a605f87c0b33bb87a0ad7d66374f5bb8b76c2117fccdcd5e704968d079e74` | `source/sidestep-gpt-nano-pass.jpg` | `src/assets-gpt-nano-pass/cards/sidestep.jpg` | `a5c6748fd5922255180738a0daf4194b3f49497accdddda69662b8dbd34f9864` |
| `preparation` / Tinder | `src/assets/cards/preparation.png` | `1431a51a1afef19bca1903be62e50ca4868037228e196757cf36061ff07dde65` | `source/preparation-gpt-nano-pass.jpg` | `src/assets-gpt-nano-pass/cards/preparation.jpg` | `916ee556c320eaec29b7fa946d5bab4a3762733eebf28634eaa15e520c814f95` |
| `deflect` / Refract | `src/assets/cards/deflect.png` | `ff20229796a230f3c41912b2a546c993059a52580b490ed77e2c82494d9744f4` | `source/deflect-gpt-nano-pass.jpg` | `src/assets-gpt-nano-pass/cards/deflect.jpg` | `4f54700c98b6c4022c5265834a4449173ce033c7dd2a2d2f1ebded5d62c5bd08` |
| `leechBlade` / Thirsting Shard | `src/assets/cards/leechBlade.png` | `8f7d7e06398dfcbc5bf9217f6db2e2bc41c92051dff56c16c47eb24fbe1dbb5c` | `source/leechBlade-gpt-nano-pass.jpg` | `src/assets-gpt-nano-pass/cards/leechBlade.jpg` | `9d5457c051274f8fd244044b5750e2e58b76f7c308d5713f1d828146d38567bf` |
| `tempest` / Hailglass | `src/assets/cards/tempest.png` | `f7a43d79923802fe9e7aa702390e89c5f15973259f39ad0f38e41dcf0f1d4542` | `source/tempest-gpt-nano-pass.jpg` | `src/assets-gpt-nano-pass/cards/tempest.jpg` | `8b75e73f924156a4dfd9e7e83f62461579639822f3f00382c5dc47a005a76418` |

Comparison sheet: `live-vs-gpt-nano-pass-contact-03.jpg`. Rows 1 and 3 show
live GPT inputs; rows 2 and 4 show the accepted GPT -> Nano pass outputs.

Redo comparison sheet: `venomStrike-leechBlade-redo-contact.jpg`. Columns show
live input, previous accepted pass, and redo candidate for each card.

## Rejected And Superseded Evidence

| Card | Rejected source | Reason | SHA-256 |
|---|---|---|---|
| `lunge` / Dimming Cut | `source/lunge-gpt-nano-pass-v1-rejected-drift.jpg` | drifted into a clean character-illustration read instead of preserving the live card composition | `61961e9946c083f879e281ed8b165096ac95df8d6af02a7ea51c8d4fc961b009` |
| `venomStrike` / Emberbite | `source/venomStrike-gpt-nano-pass-v1-superseded-by-redo.jpg` | superseded by user-requested redo using the same prompt | `1be9d17c148b612400aff79a9917f6d654e3dfd2055e2fe4547f280019d784c9` |
| `leechBlade` / Thirsting Shard | `source/leechBlade-gpt-nano-pass-v1-superseded-by-redo.jpg` | superseded by user-requested redo using the same prompt | `14e49f12161d087d967e01ab0f3a0272e4c4b96e40e6c005e2b77f491934c11e` |
| `leechBlade` / Thirsting Shard | `source/leechBlade-gpt-nano-pass-redo.jpg` | rejected because it drifted into a character-duel illustration instead of preserving the live card composition | `33a17961636adc01221387e2b768d8b9e7029845f6f142529c0f8f80416647be` |
