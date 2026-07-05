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

Prompt decision:

- The approved Act 2 finale prompt shape is the first-three-enemies pattern:
  funny but threatening, one iconic primary read, compact left-facing enemy
  pose, limited palette, and fewer hero/enemy ban clauses.
- The rejected finale v1 prompt drifted too serious because it overused
  elite/boss/noble-danger language, long frame-discipline clauses, and too many
  no-hero/no-human constraints. The approved v2 allows a little heroic attitude
  for elites and bosses, but keeps the body language enemy-like and funny.

These are runtime-ready PNGs normalised to a maximum edge of 1024px with alpha
preserved. Source and review artefacts remain in
`scratch/style-tests/design-council-20260705-readable-style/`.

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
