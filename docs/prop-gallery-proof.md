# Prop Gallery Registration Proof

This file records the final gallery registration check for the approved
runtime prop set.

## Expected Gallery URL

```text
http://localhost:5174/?gallery=1&set=readable-baseline
```

The `props` section should report:

```text
props - 4/4 generated
```

The four generated cells are:

- `campfire`
- `chest`
- `chest-open`
- `merchant`

## Verification

Checked against `origin/main` after `c3c35b3`.

Readable-baseline prop files:

| File | Size | Alpha |
|---|---:|---|
| `src/assets-readable-baseline/props/campfire.png` | 512 x 512 | RGBA, transparent corners |
| `src/assets-readable-baseline/props/chest.png` | 512 x 409 | RGBA, transparent corners |
| `src/assets-readable-baseline/props/chest-open.png` | 512 x 409 | RGBA, transparent corners |
| `src/assets-readable-baseline/props/merchant.png` | 512 x 512 | RGBA, transparent corners |

Gallery code path:

- `src/art.js` registers the `readable-baseline` asset set with root
  `assets-readable-baseline`.
- `src/ui.js` lists the four prop ids in the gallery `props` category.
- `renderGallery()` calls `assetUrl(cat, id, gallerySet)` for each prop id.
- The built bundle contains all four readable-baseline prop mappings:
  `assets-readable-baseline/props/campfire.png`,
  `assets-readable-baseline/props/chest.png`,
  `assets-readable-baseline/props/chest-open.png`, and
  `assets-readable-baseline/props/merchant.png`.

If the props are not visible in a local checkout, the usual cause is that the
checkout is behind `origin/main` or is running an older Vite dev server cache.
Fetch/pull the current `main`, restart the dev server, then open the URL above.
