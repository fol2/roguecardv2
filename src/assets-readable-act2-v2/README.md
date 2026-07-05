# Readable Act 2 V2 Approved Asset Set

Inactive approved asset set for the second Act 2 enemy pass. This folder mirrors
`src/assets/<category>/<id>.png`, but normal gameplay does not select it while
the folder is named `assets-readable-act2-v2`.

This set starts from `assets-readable-act2` and replaces the first three Act 2
enemies with council-approved v2 gpt-image-2 candidates that push the direction
further toward funny, interesting, and characterful enemies:

- `enemies/drownedOne.png`
- `enemies/voltEel.png`
- `enemies/mirelurker.png`

V1 remains available for comparison through:

```text
http://localhost:5174/?gallery=1&set=readable-act2
```

V2 approved review URL:

```text
http://localhost:5174/?gallery=1&set=readable-act2-v2
```

Act 2 v2 source decisions:

- The approved candidates use the gpt-image-2 source alpha after chroma removal,
  warm outer-rim cleanup via `tools/strip-alpha-rim.py`, and deterministic
  1024px transparent framing.
- Nano Banana Pro evidence is retained in scratch for each v2 enemy, but the
  gpt-image-2 framed candidates are the approved v2 selections.
- Source prompts, generated ids, alpha outputs, and contact sheets are recorded
  in `scratch/style-tests/design-council-20260705-readable-style/`.

When the whole set has passed review, activate it with a folder swap:

```bash
mv src/assets src/assets-previous
mv src/assets-readable-act2-v2 src/assets
npm run build
```

Only do this once every required category/id exists in the candidate folder.
