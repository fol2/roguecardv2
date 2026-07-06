# Prompt Ledger - GPT -> Nano Pass Card Comparison 04

Generated on 2026-07-06 as a separate comparison slice for cards 21-30.
`warCry` was regenerated on the same date by user request with the same
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
  --output "scratch/style-tests/card-gpt-nano-pass-04-20260706/source/<id>-gpt-nano-pass.jpg" \
  --json
```

## Output Summary

| Card | GPT input | Input SHA-256 | Nano source output | Gallery asset | Output SHA-256 |
|---|---|---|---|---|---|
| `uppercut` / Ringing Blow | `src/assets/cards/uppercut.png` | `2d1788a61496b2c64775bba616d01ef0e31eec2712a562aa68739cf647961c85` | `source/uppercut-gpt-nano-pass.jpg` | `src/assets-gpt-nano-pass/cards/uppercut.jpg` | `40c25933a2e961869c3d4a26c1a959c48aaf3a9089a5a3feb76255fe69957304` |
| `flurry` / Splinterstorm | `src/assets/cards/flurry.png` | `62da46088421b12f391378b07313036347086d63f74d08a0fc822be8ee38f72f` | `source/flurry-gpt-nano-pass.jpg` | `src/assets-gpt-nano-pass/cards/flurry.jpg` | `b8f7252802431d56ee4a5d30702e53c6bfdac57692c23be4c03a77cfdec7d8ea` |
| `executioner` / Faultline | `src/assets/cards/executioner.png` | `f51b02cc24987ee0bb838905e886149e53385ff1d22afc0c0a857cd70ed6d0fd` | `source/executioner-gpt-nano-pass.jpg` | `src/assets-gpt-nano-pass/cards/executioner.jpg` | `bb37e614d3125cad297820cfc0dd4ca1b16b8e2ef3e6c93739c5c13306e25d5c` |
| `momentum` / Honing Edge | `src/assets/cards/momentum.png` | `b8c906d775b9e5001f7506d21257320bfd3c5b493171035ec347aaf027c44ff8` | `source/momentum-gpt-nano-pass.jpg` | `src/assets-gpt-nano-pass/cards/momentum.jpg` | `9df2d4f27d21f6c067fce7d375fa342d3dc835e6fdf2382094127e4bae1dad24` |
| `bulwark` / Glasswall | `src/assets/cards/bulwark.png` | `3e50201dc16679f3f01985da5ee4c18ddd3ddc7300febfa1e848b86d98e3f483` | `source/bulwark-gpt-nano-pass.jpg` | `src/assets-gpt-nano-pass/cards/bulwark.jpg` | `b3ef6a0a6a5e33f2fa8b4b26f6b4f08c9579e5f718c0e81f6f14e6f427848b8c` |
| `surge` / Struck Match | `src/assets/cards/surge.png` | `53ece83f77ac8a3f28b98ddcdfdce6fcc43267e3652856b55cfbe2d337b075e4` | `source/surge-gpt-nano-pass.jpg` | `src/assets-gpt-nano-pass/cards/surge.jpg` | `24b3371af0940d928859f85c94679ae614493fd22015509a275ab9c8830e89b3` |
| `toxicMist` / Ashcloud | `src/assets/cards/toxicMist.png` | `2b1d7160a4a3ddc53663b5f82ba767d95aa7a4775fe8281ff60bce902adef4e4` | `source/toxicMist-gpt-nano-pass.jpg` | `src/assets-gpt-nano-pass/cards/toxicMist.jpg` | `bc4203c5328e87ce7b7fc2b159f7b71e793d3007e552b0abbb9af8aa2786fd14` |
| `cripple` / Gutter | `src/assets/cards/cripple.png` | `179bafd1afb4a46cbd125d6fd903115f0bd341c4c6d250514fd676c4df96d527` | `source/cripple-gpt-nano-pass.jpg` | `src/assets-gpt-nano-pass/cards/cripple.jpg` | `d60d2d10b0a1ec76ae0de382314decccd71a54ded3638ca83fff982fa5c08cf2` |
| `warCry` / Shatterhymn | `src/assets/cards/warCry.png` | `09a52cb770eff68c1ad8b04b8154a46e3e4f93404e705fb5b23f83fe84e5760d` | `source/warCry-gpt-nano-pass.jpg` | `src/assets-gpt-nano-pass/cards/warCry.jpg` | `8bd0659bc04e5c6f69df31a6a239a0b7eabb2645cd372aed99f59a7db4d50ab6` |
| `fortify` / Mirrorlight | `src/assets/cards/fortify.png` | `68df315923df427d6b063a4a77abadfd46381679594c1eddff1c796a7f32cc08` | `source/fortify-gpt-nano-pass.jpg` | `src/assets-gpt-nano-pass/cards/fortify.jpg` | `1173df7cc6ddd5fd49a481321d12f22ec74e0f5a51d3e2a999efd968ca6fe2b7` |

Comparison sheet: `live-vs-gpt-nano-pass-contact-04.jpg`. Rows 1 and 3 show
live GPT inputs; rows 2 and 4 show the accepted GPT -> Nano pass outputs.

Redo comparison sheet:
`../card-gpt-nano-pass-redo-20260706/warCry-oblivionStrike-quakeblow-ashenChoir-nightSight-redo-contact.jpg`.
Rows show live GPT inputs, superseded GPT -> Nano pass outputs, and accepted
redo outputs.

## Rejected And Superseded Evidence

| Card | Superseded source | Reason | SHA-256 |
|---|---|---|---|
| `warCry` / Shatterhymn | `source/warCry-gpt-nano-pass-v1-superseded-by-redo.jpg` | superseded by user-requested redo using the same prompt | `ac8c45bdbc7d646e592fdba62c2d2f9a76e706539d89364806b91fddab2efe22` |
