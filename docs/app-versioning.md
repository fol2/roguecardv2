# App versioning

Glassvow’s player-visible version comes from `package.json` `"version"` (package `"name"` remains the engineering id `spirebound`).
Vite injects it at build/dev time (`__SPIRE_VERSION__`, `__SPIRE_GIT_SHA__`,
`__SPIRE_RELEASE__`). The title screen shows the display string bottom-right.

## Display rules

| Build | Corner text |
|---|---|
| `npm run dev` | `X.Y.Z+<shortsha>` |
| `npm run build` (local / CI `dist/`) | `X.Y.Z+unknown` |
| `SPIRE_EMBED_SHA=1 npm run build` | `X.Y.Z+<shortsha>` (local smoke only) |
| `npm run release:build` / `SPIRE_RELEASE=1` | `X.Y.Z` |

Ordinary production builds keep a stable SHA placeholder so mid-sprint
bundles are not mistaken for a formal release. Five quick taps on the title
wordmark reveal `<sha> · dev|release`.

## When to bump

- **patch** — bugfix / polish
- **minor** — new content / systems
- **major** — save or rules incompatibility / large rewrite

## Release flow

```bash
npm run release          # prompts for patch|minor|major
# or: npm run release -- patch
```

The script bumps `package.json`, runs a release build into `dist/`, then prints
suggested `git commit` / `git tag vX.Y.Z` commands. It does **not** commit,
tag, or push. `dist/` is gitignored — build it locally or take the CI push
artifact; do not stage it.

Ordinary mid-sprint `npm run build` shows `+unknown` on purpose so a local or
CI bundle is not mistaken for a formal release (which is clean `X.Y.Z` via
`release:build`).

Design: [`superpowers/specs/2026-07-11-app-versioning-design.md`](superpowers/specs/2026-07-11-app-versioning-design.md).
