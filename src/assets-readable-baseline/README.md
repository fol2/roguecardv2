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

Asset source decisions:

- `heroes/duskblade.png` uses the Nano Banana alpha version.
- `heroes/ashwarden.png` and all approved enemies use the gpt-image-2 source
  alpha after warm outer-rim cleanup via `tools/strip-alpha-rim.py`.

These are runtime-ready PNGs normalised to a maximum edge of 1024px with alpha
preserved. Source and review artefacts remain in
`scratch/style-tests/design-council-20260705-readable-style/`.

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
