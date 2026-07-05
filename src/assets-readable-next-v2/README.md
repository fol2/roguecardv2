# Readable Next V2 Asset Set

Inactive review set for the second batch-2 attempt after council rejected the
first Gravewarden / Alpha Duskfang / Rootheart pass. Council approved
Gravewarden and Rootheart from this set; Alpha Duskfang v2 was rejected because
the mouth read like a generation failure.

The folder mirrors `src/assets/<category>/<id>.png`, but normal gameplay does
not select it while the folder is named `assets-readable-next-v2`.

Council-approved baseline assets copied forward:

- `heroes/duskblade.png`
- `heroes/ashwarden.png`
- `enemies/duskfang.png`
- `enemies/sporeling.png`
- `enemies/gloomslime.png`
- `enemies/waylayer.png`
- `enemies/thornling.png`
- `enemies/ashAcolyte.png`

Batch-2 v2 review candidates:

- `enemies/gravewarden.png` — approved, promoted to readable baseline.
- `enemies/alphaFang.png` — rejected.
- `enemies/rootheart.png` — approved, promoted to readable baseline.

Asset source decisions:

- `heroes/duskblade.png` uses the Nano Banana alpha version.
- `heroes/ashwarden.png` and all approved enemies use the gpt-image-2 source
  alpha after warm outer-rim cleanup via `tools/strip-alpha-rim.py`.
- The batch-2 v2 review candidates use stronger gpt-image-2 source prompts,
  warm outer-rim cleanup, and deterministic transparent framing. Elite enemies
  are framed larger than normal enemies; Rootheart is framed larger again as
  the Act 1 boss. Nano Banana outputs are preserved in scratch as evidence but
  were not selected for this review set because GPT-clean had the stronger
  silhouette and cleaner style alignment.

These are runtime-ready PNGs normalised to a maximum edge of 1024px with alpha
preserved. Source and review artefacts remain in
`scratch/style-tests/design-council-20260705-readable-style/`.

Do not activate this folder because `enemies/alphaFang.png` was rejected. It is
retained only as rejected comparison evidence beside `assets-readable-next`.

If this set ever needed review again, use:

```bash
mv src/assets src/assets-previous
mv src/assets-readable-next-v2 src/assets
npm run build
```

Only do this once every required category/id exists in the candidate folder.

For review, open the dev gallery with:

```text
http://localhost:5174/?gallery=1&set=readable-baseline
http://localhost:5174/?gallery=1&set=readable-next-v2
```
