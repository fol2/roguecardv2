# Prompt Ledger - GPT -> Nano Pass Card Comparison 07

Generated on 2026-07-06 as a separate comparison slice for cards 51-60.
`ashenChoir` and `nightSight` were regenerated on the same date by user request
with the same dedicated prompt. These files do not replace the live card assets.

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
  --output "scratch/style-tests/card-gpt-nano-pass-07-20260706/source/<id>-gpt-nano-pass.jpg" \
  --json
```

## Output Summary

| Card | GPT input | Input SHA-256 | Nano source output | Gallery asset | Output SHA-256 |
|---|---|---|---|---|---|
| `pyreheart` / Pyreheart | `src/assets/cards/pyreheart.png` | `aab5c6b49b9f6334c3995e6bfa7c5328e7a32365a4490fe26b3c9562f8f2412b` | `source/pyreheart-gpt-nano-pass.jpg` | `src/assets-gpt-nano-pass/cards/pyreheart.jpg` | `8c0bc26deff09f62f5bf8b300c9e4992ab7607ef88d9edf28c2f15a353ca6257` |
| `ashenChoir` / Ashen Choir | `src/assets/cards/ashenChoir.png` | `50c309efd4661ba444f5670e8f6360acd48d19b55da0da0bf289943ff150e4b3` | `source/ashenChoir-gpt-nano-pass.jpg` | `src/assets-gpt-nano-pass/cards/ashenChoir.jpg` | `93b42c3b25dd2a881307b7bf120c29cf3eacc36915fe562fb59ef264ba800047` |
| `flawlessForm` / Flawless Form | `src/assets/cards/flawlessForm.png` | `05fe8489327c9c0750da57d7eb9ec5777766b44e0ffd489e677b38636f09ef8d` | `source/flawlessForm-gpt-nano-pass.jpg` | `src/assets-gpt-nano-pass/cards/flawlessForm.jpg` | `e0332ecaaa78f2a92d1d42c64dd266d23460321c8d92085b12a39ef49177a65f` |
| `nightSight` / Night Sight | `src/assets/cards/nightSight.png` | `76774a8ca0d4730cc2d677d89ea3f2976cb3be4290903ba49b87b15c2f9697ed` | `source/nightSight-gpt-nano-pass.jpg` | `src/assets-gpt-nano-pass/cards/nightSight.jpg` | `7c2e9a7ea9aed28739bc54e496297c940e4211f965ab10c8df2dfa56c644819e` |
| `novaflare` / Novaflare | `src/assets/cards/novaflare.png` | `fdced24c578285a35415cb0a0288a490c5a6454fdfcf6dd1fd2048bfad80dec8` | `source/novaflare-gpt-nano-pass.jpg` | `src/assets-gpt-nano-pass/cards/novaflare.jpg` | `e256d75cf3a278f14b0b2146959f14c7564121e1a4d2744922f0d41e7ee53a7f` |
| `emberdance` / Emberdance | `src/assets/cards/emberdance.png` | `f6a337ec0733f20790ec9eb9ab4348125ea4207e7117f2940fa5cf963b9d1240` | `source/emberdance-gpt-nano-pass.jpg` | `src/assets-gpt-nano-pass/cards/emberdance.jpg` | `2f5b5619f16a4093db163c9203dadb7ec52873d461197ca10d51a92dc8b91b24` |
| `shardstorm` / Shardstorm | `src/assets/cards/shardstorm.png` | `5114e5cfcea251cafab937ff0da7fc9b6419e2e12e1f5862520a0feaabea24d3` | `source/shardstorm-gpt-nano-pass.jpg` | `src/assets-gpt-nano-pass/cards/shardstorm.jpg` | `744c87f822b5d40309c4f33006cef865cb0dfff7ae74f9319b1731a741e0d679` |
| `wound` / Shard | `src/assets/cards/wound.png` | `506d61d77f086d1289b33317990545474ae057e742e3c5784a82558ad0843504` | `source/wound-gpt-nano-pass.jpg` | `src/assets-gpt-nano-pass/cards/wound.jpg` | `738b8f24f81337693b129c22ef3fe0b0be752767a897842c8a32ac959733ecac` |
| `burn` / Cinder | `src/assets/cards/burn.png` | `8643a26008902e4440b0f91966c18277497bb6ccf2bf031e34fdb2a69163296d` | `source/burn-gpt-nano-pass.jpg` | `src/assets-gpt-nano-pass/cards/burn.jpg` | `943443e73874326e5846c1a5df95a32fecdab6b6a4f92eb2757812ba9b6a2399` |
| `hex` / Hex | `src/assets/cards/hex.png` | `b9f796e43c648e85067f77a7a069b860f59c162327d14f812017326787c8755b` | `source/hex-gpt-nano-pass.jpg` | `src/assets-gpt-nano-pass/cards/hex.jpg` | `c812bbbcbd53a50ad3c1671a55d8dd0d4ca4d59201aab27d976cb22f42ee1dd6` |

Comparison sheet: `live-vs-gpt-nano-pass-contact-07.jpg`. Rows 1 and 3 show
live GPT inputs; rows 2 and 4 show the accepted GPT -> Nano pass outputs.

Redo comparison sheet:
`../card-gpt-nano-pass-redo-20260706/warCry-oblivionStrike-quakeblow-ashenChoir-nightSight-redo-contact.jpg`.
Rows show live GPT inputs, superseded GPT -> Nano pass outputs, and accepted
redo outputs.

## Rejected And Superseded Evidence

| Card | Superseded source | Reason | SHA-256 |
|---|---|---|---|
| `ashenChoir` / Ashen Choir | `source/ashenChoir-gpt-nano-pass-v1-superseded-by-redo.jpg` | superseded by user-requested redo using the same prompt | `0c42b7ceb09aff475cab7b9db57ef952995871a56e15b20400bcce2c2bc65b0a` |
| `nightSight` / Night Sight | `source/nightSight-gpt-nano-pass-v1-superseded-by-redo.jpg` | superseded by user-requested redo using the same prompt | `fb101120ade1cfcf0ffc1c92e54ff27d27733c2022f0ae1a028e246df715562e` |
