# Readable Baseline Asset Set

Inactive candidate asset set for the silhouette-first Spirebound raster style.

The folder mirrors `src/assets/<category>/<id>.png`, but normal gameplay does
not select it while the folder is named `assets-readable-baseline`.

Council-approved baseline assets:

- `heroes/duskblade.png`
- `heroes/ashwarden.png`
- `enemies/duskfang.png`
- `enemies/sporeling.png`
- `enemies/gloomslime.png`
- `enemies/waylayer.png`
- `enemies/thornling.png`
- `enemies/ashAcolyte.png`
- `enemies/gravewarden.png`
- `enemies/alphaFang.png`
- `enemies/rootheart.png`
- `enemies/drownedOne.png`
- `enemies/voltEel.png`
- `enemies/mirelurker.png`
- `enemies/tidecaller.png`
- `enemies/shellback.png`
- `enemies/deepmaw.png`
- `enemies/abyssalKnight.png`
- `enemies/siren.png`
- `enemies/leviathan.png`
- `enemies/voidWisp.png`
- `enemies/obsidianGolem.png`
- `enemies/starCultist.png`
- `enemies/shade.png`
- `enemies/chaosHound.png`
- `enemies/watcherEye.png`
- `potions/healing.png`
- `potions/strength.png`
- `potions/swift.png`
- `potions/block.png`
- `potions/fire.png`
- `potions/venom.png`
- `potions/energy.png`
- `cards/strike.png`
- `cards/defend.png`
- `cards/empower.png`

Asset source decisions:

- `heroes/duskblade.png` uses the Nano Banana alpha version.
- `heroes/ashwarden.png` and all approved enemies use the gpt-image-2 source
  alpha after warm outer-rim cleanup via `tools/strip-alpha-rim.py`.
- `enemies/gravewarden.png` and `enemies/rootheart.png` use the approved v2
  gpt-image-2 framed candidates from the batch-2 elite/boss pass.
- `enemies/alphaFang.png` uses the approved v3 gpt-image-2 framed candidate;
  v2 was rejected because the mouth read like a generation failure.
- `enemies/drownedOne.png`, `enemies/voltEel.png`, and
  `enemies/mirelurker.png` use the approved Act 2 v2 gpt-image-2 framed
  candidates. Act 2 v1 remains available as rejected comparison evidence in
  scratch.
- `enemies/tidecaller.png`, `enemies/shellback.png`, and
  `enemies/deepmaw.png` use the approved Act 2 batch 2 gpt-image-2 framed
  candidates. Nano Banana Pro comparisons remain in scratch only.
- `enemies/abyssalKnight.png`, `enemies/siren.png`, and
  `enemies/leviathan.png` use the approved Act 2 finale drift-correction
  gpt-image-2 framed candidates: Abyssal Knight v3, Siren v3, and
  Leviathan's Maw v2.
- `enemies/voidWisp.png`, `enemies/obsidianGolem.png`, and
  `enemies/starCultist.png` use the council-approved Act 3 first-batch v2
  colour-lift candidates. They use the gpt-image-2 source alpha after warm
  outer-rim cleanup, then a light colour-lift pass
  (`modulate 116,118` plus gamma `0.93`) so the stained-glass masses read on
  dark combat backgrounds. The source prompt used `#00ff00` chroma-key instead
  of `#ff00ff` because Act 3 requires hot magenta judgement cores.
- `enemies/shade.png`, `enemies/chaosHound.png`, and
  `enemies/watcherEye.png` use the council-approved Act 3 second-batch v1
  colour-lift candidates. They follow the approved Act 3 first batch
  dark-background colour baseline and the same outer-rim cleanup plus light
  colour-lift pass.
- `potions/healing.png`, `potions/strength.png`, `potions/swift.png`,
  `potions/block.png`, `potions/fire.png`, `potions/venom.png`, and
  `potions/energy.png` are the council-approved current potion set from
  `scratch/potion-demos/20260706-current-seven-r1/`. They use built-in Image
  Gen flat `#ff00ff` chroma-key sources, local chroma-key alpha removal, and
  final 256 x 256 potion-icon normalisation. The approved direction is fat,
  chunky, saturated, low-stroke stained-glass phials for HUD readability.
- `cards/strike.png`, `cards/defend.png`, and `cards/empower.png` are the
  approved first card-art milestone from the 60-card production sort in
  `docs/card-art-bible.md`. Earlier badge-style cards were rejected because
  they looked like floating emblems rather than card art. The approved
  candidates use built-in Image Gen full-bleed rectangular scene sources with
  strong foreground/background separation, normalised to `800 x 500`.

Prompt decision:

- The approved Act 2 finale prompt shape is the first-three-enemies pattern:
  funny but threatening, one iconic primary read, compact left-facing enemy
  pose, limited palette, and fewer hero/enemy ban clauses.
- The rejected finale v1 prompt drifted too serious because it overused
  elite/boss/noble-danger language, long frame-discipline clauses, and too many
  no-hero/no-human constraints. The approved v2 allows a little heroic attitude
  for elites and bosses, but keeps the body language enemy-like and funny.

Enemy and hero assets are runtime-ready PNGs normalised to a maximum edge of
1024px with alpha preserved. Potion assets are normalised to 256 x 256 with
alpha preserved. Card assets are full-bleed rectangular PNGs normalised to
800 x 500. Source and review artefacts remain in
`scratch/style-tests/design-council-20260705-readable-style/`; potion source,
alpha, prompts, and contact sheets remain in
`scratch/potion-demos/20260706-current-seven-r1/`; card source, prompts, and
comparison sheets remain in
`scratch/style-tests/card-first-three-separation-readable-baseline-20260706/`.

Gallery cleanup:

- Runtime gallery registration now only exposes `live` and `readable-baseline`.
- Temporary runtime review folders were removed after promotion. Scratch source
  folders, exact prompts, generated ids, alpha outputs, and contact sheets are
  retained as evidence.

When the whole set has passed review, activate it with a folder swap:

```bash
mv src/assets src/assets-previous
mv src/assets-readable-baseline src/assets
npm run build
```

Only do this once every required category/id exists in the candidate folder.

For review, open the dev gallery with:

```text
http://localhost:5174/?gallery=1&set=readable-baseline
```
