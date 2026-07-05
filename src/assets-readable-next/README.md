# Readable Next Asset Set

Inactive review set for the first batch-2 attempt. This version was
disapproved by council because the elite and boss enemies were not strong,
unique, colourful, funny, or interesting enough.

The folder mirrors `src/assets/<category>/<id>.png`, but normal gameplay does
not select it while the folder is named `assets-readable-next`.

Council-approved baseline assets copied forward:

- `heroes/duskblade.png`
- `heroes/ashwarden.png`
- `enemies/duskfang.png`
- `enemies/sporeling.png`
- `enemies/gloomslime.png`
- `enemies/waylayer.png`
- `enemies/thornling.png`
- `enemies/ashAcolyte.png`

Disapproved batch-2 candidates kept for comparison:

- `enemies/gravewarden.png`
- `enemies/alphaFang.png`
- `enemies/rootheart.png`

Asset source decisions:

- `heroes/duskblade.png` uses the Nano Banana alpha version.
- `heroes/ashwarden.png` and all approved enemies use the gpt-image-2 source
  alpha after warm outer-rim cleanup via `tools/strip-alpha-rim.py`.
- The batch-2 review candidates use the gpt-image-2 source alpha after warm
  outer-rim cleanup, then deterministic transparent framing to 1024px with a
  clean margin. Nano Banana outputs are preserved as evidence in scratch, but
  were not selected for this review set because they drifted or kept magenta
  edge artefacts.

These are runtime-ready PNGs normalised to a maximum edge of 1024px with alpha
preserved. Source and review artefacts remain in
`scratch/style-tests/design-council-20260705-readable-style/`.

Do not activate this folder. It is retained only as rejected comparison evidence.

If this set ever needed review again, use:

```bash
mv src/assets src/assets-previous
mv src/assets-readable-next src/assets
npm run build
```

Only do this once every required category/id exists in the candidate folder.

For review, open the dev gallery with:

```text
http://localhost:5174/?gallery=1&set=readable-baseline
http://localhost:5174/?gallery=1&set=readable-next
```
