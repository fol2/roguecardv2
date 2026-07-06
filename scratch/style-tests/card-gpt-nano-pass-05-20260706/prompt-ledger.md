# Prompt Ledger - GPT -> Nano Pass Card Comparison 05

Generated on 2026-07-06 as a separate comparison slice for cards 31-40.
`oblivionStrike` was regenerated on the same date by user request with the same
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
  --output "scratch/style-tests/card-gpt-nano-pass-05-20260706/source/<id>-gpt-nano-pass.jpg" \
  --json
```

## Output Summary

| Card | GPT input | Input SHA-256 | Nano source output | Gallery asset | Output SHA-256 |
|---|---|---|---|---|---|
| `bloodRite` / Blood for Oil | `src/assets/cards/bloodRite.png` | `e42bb8335edf1eea8bf7b6d09d8a0fc4f9b2f37cbe499bf9d53dab9e11a9b819` | `source/bloodRite-gpt-nano-pass.jpg` | `src/assets-gpt-nano-pass/cards/bloodRite.jpg` | `47555f6bf7f1aae93033f16f50131de97aeef2471ed2dc4827248145fed56b19` |
| `empower` / Inner Blaze | `src/assets/cards/empower.png` | `5cd9f15c2516eb78049b345ed1be79f80e8f2dd3814ee08b9b4bb15f9e2c853a` | `source/empower-gpt-nano-pass.jpg` | `src/assets-gpt-nano-pass/cards/empower.jpg` | `b398dc23344f89aa5955023793aed00c5ef8512cab3cb6b9fb7b40cbf39ecca7` |
| `agility` / Glazier's Poise | `src/assets/cards/agility.png` | `d52502516786ed92e2cd9b1c28b1192ab1b402b417899a156f2fb141bcba8960` | `source/agility-gpt-nano-pass.jpg` | `src/assets-gpt-nano-pass/cards/agility.jpg` | `f388a871433c50f567fba99c6beec8f3f6faf9ae23268b43b05bd91fc76ca639` |
| `ironSkin` / Vitrify | `src/assets/cards/ironSkin.png` | `e8fab6e254cda288d85b07460c357f36035c180aeaf805ae277e76d9c5de9239` | `source/ironSkin-gpt-nano-pass.jpg` | `src/assets-gpt-nano-pass/cards/ironSkin.jpg` | `61d72fd70ae3b4b1c977c27619afe71f48682ad480f74579b52f8cd17be3060c` |
| `regrowth` / Hearthglow | `src/assets/cards/regrowth.png` | `5d683d364d2c2ccab573fd28ef4d2f2a41f32789a99a735171e95bed608306df` | `source/regrowth-gpt-nano-pass.jpg` | `src/assets-gpt-nano-pass/cards/regrowth.jpg` | `25e70995e53870120289b588b29fb849150e3967e470c97a30f39190080e0224` |
| `oblivionStrike` / Bellstrike | `src/assets/cards/oblivionStrike.png` | `c771ff21786ca5b4bca043ecb5674536925ad1f3a6b9bf854a8ffef3247d589e` | `source/oblivionStrike-gpt-nano-pass.jpg` | `src/assets-gpt-nano-pass/cards/oblivionStrike.jpg` | `3e56a1b056a94af021d91d9b7a81df7aeba6275c93e5d0e55d7a044ca06fc01d` |
| `phantomBlades` / Phantom Blades | `src/assets/cards/phantomBlades.png` | `8f61c49671c7e7a00bf8dceaa54a4a6ffc23dcf6ff40419f31ec2549fa1e469d` | `source/phantomBlades-gpt-nano-pass.jpg` | `src/assets-gpt-nano-pass/cards/phantomBlades.jpg` | `c5edec732c6722835e65362fc155c8be168fb889eea27d5e4a48221ab3a55068` |
| `devour` / Eat the Flame | `src/assets/cards/devour.png` | `16a7d4baee34da8a1b6d40748cce9db7e0c01c1009d9f9ee664d14e801c40744` | `source/devour-gpt-nano-pass.jpg` | `src/assets-gpt-nano-pass/cards/devour.jpg` | `0db186c887ce3eeec8488a9266c8bf33c6be70139bb67c83507a50bc641a896e` |
| `annihilate` / Requiem | `src/assets/cards/annihilate.png` | `13c12d03371fb750402e70f501b44cdbe5b05acf20eba47d8a40c07e9e9f2147` | `source/annihilate-gpt-nano-pass.jpg` | `src/assets-gpt-nano-pass/cards/annihilate.jpg` | `f8fe087d18d7dbcb95f9aa5c2128f5f14c923a5bff82963d3270be4b8e65aca6` |
| `aegis` / Cathedral Glass | `src/assets/cards/aegis.png` | `18a4c880bb6c452410f1ba1607a769935d123a259b75c2eb27255ab70f827752` | `source/aegis-gpt-nano-pass.jpg` | `src/assets-gpt-nano-pass/cards/aegis.jpg` | `d19d7ffe75ee8ca110dec545f7d6409c4ecb2613ae65dc870d8868f5c386dcec` |

Comparison sheet: `live-vs-gpt-nano-pass-contact-05.jpg`. Rows 1 and 3 show
live GPT inputs; rows 2 and 4 show the accepted GPT -> Nano pass outputs.

Redo comparison sheet:
`../card-gpt-nano-pass-redo-20260706/warCry-oblivionStrike-quakeblow-ashenChoir-nightSight-redo-contact.jpg`.
Rows show live GPT inputs, superseded GPT -> Nano pass outputs, and accepted
redo outputs.

## Rejected And Superseded Evidence

| Card | Superseded source | Reason | SHA-256 |
|---|---|---|---|
| `oblivionStrike` / Bellstrike | `source/oblivionStrike-gpt-nano-pass-v1-superseded-by-redo.jpg` | superseded by user-requested redo using the same prompt | `ed1a415fca2f096b04f950bca7b37f7ed965c8f40c3fa5df22a55bde3a35bfec` |
