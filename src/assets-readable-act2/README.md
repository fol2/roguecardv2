# Readable Act 2 Review Asset Set

Inactive review asset set for the next Act 2 enemy pass. This folder mirrors
`src/assets/<category>/<id>.png`, but normal gameplay does not select it while
the folder is named `assets-readable-act2`.

This set starts from the approved `assets-readable-baseline` folder and adds the
first three Act 2 enemies for design-council review:

- `enemies/drownedOne.png`
- `enemies/voltEel.png`
- `enemies/mirelurker.png`

Inherited approved baseline assets:

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

Act 2 candidate source decisions:

- The review candidates use the gpt-image-2 source alpha after chroma removal,
  warm outer-rim cleanup via `tools/strip-alpha-rim.py`, and deterministic
  1024px transparent framing.
- Source prompts, generated ids, alpha outputs, and contact sheets are recorded
  in `scratch/style-tests/design-council-20260705-readable-style/`.
- Nano Banana evidence is part of the workflow, but the gpt-image-2 framed
  candidates remain the current review images unless council chooses otherwise.

For review, open the dev gallery with:

```text
http://localhost:5174/?gallery=1&set=readable-act2
```

When the whole set has passed review, activate it with a folder swap:

```bash
mv src/assets src/assets-previous
mv src/assets-readable-act2 src/assets
npm run build
```

Only do this once every required category/id exists in the candidate folder.
