# GPT -> Nano Pass Card Comparison Ledger

This ledger tracks image-to-image `gpt-image-2 -> Nano Banana Pro` comparison
candidates. It is separate from `generated-card-ledger.md`, because these assets
are not approved replacements for the live card art.

Gallery set:

```text
http://localhost:5174/?gallery=1&set=gpt-nano-pass
```

Production rule for this comparison set: keep the current live assets in
`src/assets/cards/`; place GPT-to-Nano candidates in
`src/assets-gpt-nano-pass/cards/`; copy accepted source bytes directly without
local visual post-processing.

## Comparison 01 - First Five Gallery/Data Cards

Generated on 2026-07-06 with Nano Banana Pro image-to-image:
`--model nanobanana-pro --ratio 3:2 --size 2K`. Regenerated for this slice with
the short Nano Banana pass prompt plus style frame only, replacing the earlier
long adapter/identity-check pass.

| Card | Review status | GPT input | GPT -> Nano asset | Prompt ledger |
|---|---|---|---|---|
| `strike` / Edge | awaiting user review | `src/assets/cards/strike.png` | `src/assets-gpt-nano-pass/cards/strike.jpg` | `scratch/style-tests/card-gpt-nano-pass-20260706/prompt-ledger.md` |
| `defend` / Ward | awaiting user review | `src/assets/cards/defend.png` | `src/assets-gpt-nano-pass/cards/defend.jpg` | `scratch/style-tests/card-gpt-nano-pass-20260706/prompt-ledger.md` |
| `eclipseSlash` / Eclipse Slash | awaiting user review | `src/assets/cards/eclipseSlash.png` | `src/assets-gpt-nano-pass/cards/eclipseSlash.jpg` | `scratch/style-tests/card-gpt-nano-pass-20260706/prompt-ledger.md` |
| `chisel` / Chisel | awaiting user review | `src/assets/cards/chisel.png` | `src/assets-gpt-nano-pass/cards/chisel.jpg` | `scratch/style-tests/card-gpt-nano-pass-20260706/prompt-ledger.md` |
| `firstSpark` / First Spark | awaiting user review | `src/assets/cards/firstSpark.png` | `src/assets-gpt-nano-pass/cards/firstSpark.jpg` | `scratch/style-tests/card-gpt-nano-pass-20260706/prompt-ledger.md` |

Review artifact:

```text
scratch/style-tests/card-gpt-nano-pass-20260706/live-vs-gpt-nano-pass-contact.jpg
```

## Comparison 02 - Next Five Gallery/Data Cards

Generated on 2026-07-06 with Nano Banana Pro image-to-image:
`--model nanobanana-pro --ratio 3:2 --size 2K`. Regenerated for this slice with
the short Nano Banana pass prompt plus style frame only, replacing the earlier
long adapter/identity-check pass.

| Card | Review status | GPT input | GPT -> Nano asset | Prompt ledger |
|---|---|---|---|---|
| `ashBite` / Ashbite | awaiting user review | `src/assets/cards/ashBite.png` | `src/assets-gpt-nano-pass/cards/ashBite.jpg` | `scratch/style-tests/card-gpt-nano-pass-02-20260706/prompt-ledger.md` |
| `smother` / Smother | awaiting user review | `src/assets/cards/smother.png` | `src/assets-gpt-nano-pass/cards/smother.jpg` | `scratch/style-tests/card-gpt-nano-pass-02-20260706/prompt-ledger.md` |
| `twinFangs` / Twin Shards | awaiting user review | `src/assets/cards/twinFangs.png` | `src/assets-gpt-nano-pass/cards/twinFangs.jpg` | `scratch/style-tests/card-gpt-nano-pass-02-20260706/prompt-ledger.md` |
| `quickSlash` / Flicker | awaiting user review | `src/assets/cards/quickSlash.png` | `src/assets-gpt-nano-pass/cards/quickSlash.jpg` | `scratch/style-tests/card-gpt-nano-pass-02-20260706/prompt-ledger.md` |
| `heavyBlow` / Quarry Maul | awaiting user review | `src/assets/cards/heavyBlow.png` | `src/assets-gpt-nano-pass/cards/heavyBlow.jpg` | `scratch/style-tests/card-gpt-nano-pass-02-20260706/prompt-ledger.md` |

Review artifact:

```text
scratch/style-tests/card-gpt-nano-pass-02-20260706/live-vs-gpt-nano-pass-contact-02.jpg
```

## Comparison 03 - Cards 11-20

Generated on 2026-07-06 with Nano Banana Pro image-to-image:
`--model nanobanana-pro --ratio 3:2 --size 2K`. This slice uses the dedicated
short Nano Banana pass prompt plus style frame only; no stored GPT prompt or
identity check is appended.

| Card | Review status | GPT input | GPT -> Nano asset | Prompt ledger |
|---|---|---|---|---|
| `cleave` / Fan of Glass | awaiting user review | `src/assets/cards/cleave.png` | `src/assets-gpt-nano-pass/cards/cleave.jpg` | `scratch/style-tests/card-gpt-nano-pass-03-20260706/prompt-ledger.md` |
| `venomStrike` / Emberbite | awaiting user review; redone by user request | `src/assets/cards/venomStrike.png` | `src/assets-gpt-nano-pass/cards/venomStrike.jpg` | `scratch/style-tests/card-gpt-nano-pass-03-20260706/prompt-ledger.md` |
| `lunge` / Dimming Cut | awaiting user review; v1 rejected for drift, v2 in gallery | `src/assets/cards/lunge.png` | `src/assets-gpt-nano-pass/cards/lunge.jpg` | `scratch/style-tests/card-gpt-nano-pass-03-20260706/prompt-ledger.md` |
| `guardedStrike` / Warden's Edge | awaiting user review | `src/assets/cards/guardedStrike.png` | `src/assets-gpt-nano-pass/cards/guardedStrike.jpg` | `scratch/style-tests/card-gpt-nano-pass-03-20260706/prompt-ledger.md` |
| `brace` / Held Light | awaiting user review | `src/assets/cards/brace.png` | `src/assets-gpt-nano-pass/cards/brace.jpg` | `scratch/style-tests/card-gpt-nano-pass-03-20260706/prompt-ledger.md` |
| `sidestep` / Glasstep | awaiting user review | `src/assets/cards/sidestep.png` | `src/assets-gpt-nano-pass/cards/sidestep.jpg` | `scratch/style-tests/card-gpt-nano-pass-03-20260706/prompt-ledger.md` |
| `preparation` / Tinder | awaiting user review | `src/assets/cards/preparation.png` | `src/assets-gpt-nano-pass/cards/preparation.jpg` | `scratch/style-tests/card-gpt-nano-pass-03-20260706/prompt-ledger.md` |
| `deflect` / Refract | awaiting user review | `src/assets/cards/deflect.png` | `src/assets-gpt-nano-pass/cards/deflect.jpg` | `scratch/style-tests/card-gpt-nano-pass-03-20260706/prompt-ledger.md` |
| `leechBlade` / Thirsting Shard | awaiting user review; redone by user request, first redo rejected for drift | `src/assets/cards/leechBlade.png` | `src/assets-gpt-nano-pass/cards/leechBlade.jpg` | `scratch/style-tests/card-gpt-nano-pass-03-20260706/prompt-ledger.md` |
| `tempest` / Hailglass | awaiting user review | `src/assets/cards/tempest.png` | `src/assets-gpt-nano-pass/cards/tempest.jpg` | `scratch/style-tests/card-gpt-nano-pass-03-20260706/prompt-ledger.md` |

Review artifact:

```text
scratch/style-tests/card-gpt-nano-pass-03-20260706/live-vs-gpt-nano-pass-contact-03.jpg
```
