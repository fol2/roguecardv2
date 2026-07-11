# App versioning

Spirebound’s player-visible version comes from `package.json` `"version"`.
Vite injects it at build/dev time (`__SPIRE_VERSION__`, `__SPIRE_GIT_SHA__`,
`__SPIRE_RELEASE__`). The title screen shows the display string bottom-right.

## Display rules

| Build | Corner text |
|---|---|
| `npm run dev` | `X.Y.Z+<shortsha>` |
| `npm run build` | `X.Y.Z+<shortsha>` |
| `npm run release:build` / `SPIRE_RELEASE=1` | `X.Y.Z` |

Five quick taps on the title wordmark reveal `<sha> · dev|release`.

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
tag, or push.

Ordinary mid-sprint `npm run build` commits may keep the `+sha` suffix on
purpose so committed `dist/` is not mistaken for a formal release.

Design: [`superpowers/specs/2026-07-11-app-versioning-design.md`](superpowers/specs/2026-07-11-app-versioning-design.md).
