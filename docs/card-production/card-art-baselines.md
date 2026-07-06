# Card Art Baselines

These nine approved card images are the current production baseline for
Spirebound card art. Treat them as references for all future 60-card work, not
just as finished assets.

The baseline job is to stop drift. Every new card should be compared against
these images for composition, readability, lighting, and gameplay grammar before
it is promoted to `src/assets/cards/`.

## Baseline Rule

Card art is full-bleed rectangular scene art. It is not a badge, icon, token,
logo, card frame, or UI mock-up.

Foreground and background must be separate enough to read at the in-game card
art size. If colour, theme, value, or contrast needs correction, fix it in the
Image Gen prompt. Do not rescue approved card art with local brightness,
contrast, gamma, saturation, colour grading, crop, resize, or metadata-stripping
passes.

From Batch 02 onward, the approved gallery PNG must be a byte-for-byte copy of
the approved generated source. The first six approved cards remain accepted
legacy baseline assets exactly as committed; do not reprocess them.

## Approved Reference Set

| Card | Production role | What it teaches | Gallery asset | Prompt and source record | SHA-256 |
|---|---|---|---|---|---|
| `strike` / Edge | Attack anchor | One large foreground blade can carry the whole read; red chapel background stays quieter. | `src/assets-readable-baseline/cards/strike.png` | `scratch/style-tests/card-first-three-separation-readable-baseline-20260706/prompt-ledger.md` | `6951eea1cd0a7e6cbd894a8dcc5cf9ea83a673820f1933a260eb658cee3e5020` |
| `defend` / Ward | Skill anchor | Dark figure, amber lantern, blue ward wall, and chapel arches remain distinct layers. | `src/assets-readable-baseline/cards/defend.png` | `scratch/style-tests/card-first-three-separation-readable-baseline-20260706/prompt-ledger.md` | `27ba4afd0fd3144461de14d395f5c5ee722b4ab42dc2bac43d5d1aa42f04224d` |
| `empower` / Inner Blaze | Power anchor | Persistent state reads through a body pose plus chest fire, not a spell icon. | `src/assets-readable-baseline/cards/empower.png` | `scratch/style-tests/card-first-three-separation-readable-baseline-20260706/prompt-ledger.md` | `5cd9f15c2516eb78049b345ed1be79f80e8f2dd3814ee08b9b4bb15f9e2c853a` |
| `eclipseSlash` / Eclipse Slash | Starter attack extension | Keeps the `strike` family but adds eclipse disc and crack so the thumbnail is unique. | `src/assets-readable-baseline/cards/eclipseSlash.png` | `scratch/style-tests/card-production-batch-01-20260706/prompt-ledger.md` | `44427ab21e40c4266aebff969f1ce7676e977d89a28151b8943b4b8543f00a8a` |
| `chisel` / Chisel | Facet/shatter anchor | Tool, hand, target pane, and missing chip create a precise mechanic diagram. | `src/assets-readable-baseline/cards/chisel.png` | `scratch/style-tests/card-production-batch-01-20260706/prompt-ledger.md` | `db138ef053d6de80866b3325a8833e248b253a18a66f58cd118635c7976151bd` |
| `firstSpark` / First Spark | Draw/kindle anchor | Small ember and rising card pane read as tempo/fuel without weapon dominance. | `src/assets-readable-baseline/cards/firstSpark.png` | `scratch/style-tests/card-production-batch-01-20260706/prompt-ledger.md` | `bc48f49b6753c76c6fe4bb98f0224301e6da02ccea7bedd7ac4fe7e671a5f6a4` |
| `ashBite` / Ashbite | Smolder attack anchor | Red hooked bite, target pane, and green-orange smoke separate from a visible Ashen Woods background. | `src/assets-readable-baseline/cards/ashBite.png` | `scratch/style-tests/card-production-batch-02-20260706/prompt-ledger.md` | `74cc98fb3c06cd322334f11d556b1a91487b5cdf257e494cc48638f8938b6dfa` |
| `smother` / Smother | Ward plus Smolder anchor | Blue ward hand reads first; smoke and coal remain secondary; background keeps midtone detail. | `src/assets-readable-baseline/cards/smother.png` | `scratch/style-tests/card-production-batch-02-20260706/prompt-ledger.md` | `87930d51bd16ee5940aeef36ae7b470138c9bc32056a05a228017d0219b106eb` |
| `twinFangs` / Twin Shards | Multi-hit attack anchor | Two red fangs stay separate through a visible gap and two amber impacts. | `src/assets-readable-baseline/cards/twinFangs.png` | `scratch/style-tests/card-production-batch-02-20260706/prompt-ledger.md` | `b2f2e55acda17a8f9af4b38c6b1c435124b1fcafc66faafb5ad6059c0482bcc1` |

## How To Use The Baselines

Before generating a new card, pick the nearest baseline by gameplay family:

- Direct attack: compare against `strike`, `eclipseSlash`, and `twinFangs`.
- Facet or shatter: compare against `chisel` and `eclipseSlash`.
- Ward or defence: compare against `defend` and `smother`.
- Draw, kindle, or tempo: compare against `firstSpark`.
- Power or persistent state: compare against `empower`.
- Smolder or Ashwarden cards: compare against `ashBite` and `smother`.

The new card must have a different thumbnail silhouette from the nearest
baseline. Change silhouette first, composition second, palette third, and small
detail last.

## Prompt Lighting Baseline

Batch 02 established the current correction language for light and colour:

```text
Lighting mandate: The scene must be lit like the approved Batch 01 Spirebound
card art: rich stained-glass midtones, bright coloured foreground light, deep
black outlines only, and crisp contrast. Do not make a mostly black night
scene. Do not grey out the shadows. Use visible background glass panels behind
the subject so the background has detail but stays quieter than the main action.
```

Use that kind of wording in the prompt whenever a source starts too dark or too
flat. Do not create a local post-processed variant.
