# Spirebound — App Versioning (design)

**Date:** 2026-07-11
**Status:** Owner-approved for implementation
**Goal:** Establish a single source of truth for the app version, show it on
the title screen, and provide a repeatable release build convention without
automating git commit/tag/push.

## Decisions record (owner-approved)

| Question | Decision |
|---|---|
| Purpose | Display for players/testers **and** a repeatable release convention |
| Source of truth | `package.json` `"version"` |
| Title corner format | Release: `1.0.0`. Non-release: `1.0.0+a1b2c3d` |
| Release vs non-release | Explicit `SPIRE_RELEASE=1` (via `release:build` / `release` script). Ordinary `build` and `dev` are non-release |
| Release automation | `npm run release` script: bump + release build + printed next steps. No auto commit/tag/push. No CHANGELOG yet |
| Semver policy | Game-oriented: `patch` = bugfix/polish; `minor` = new content/systems; `major` = save/rules incompatibility or large rewrite |
| UI surface | Title screen bottom-right label; logo multi-tap reveals debug detail. Settings panel out of scope |
| Injection approach | Vite `define` at build/dev time |

## 1. Context

The repo already uses Git. `package.json` has `"version": "1.0.0"` but nothing
reads it. There are no version tags, no CHANGELOG, and no title-screen version
label. `dist/` is committed and rebuilt often for mid-sprint fixes, so every
`npm run build` must **not** look like a formal release.

The title screen is rendered by `renderTitle()` in `src/ui.js`. Version UI
belongs there (plus a little CSS), not in the engine.

## 2. Invariants

- `package.json` `"version"` is the only authored version string.
- `engine.js` and `vigil.js` must not import version helpers or Vite-injected
  globals in a way that breaks Node tests.
- Ordinary `npm run build` embeds a non-release display string (semver + short
  git SHA when available).
- Only builds with `SPIRE_RELEASE=1` embed a clean semver display string.
- `npm run release` never commits, tags, or pushes; it only mutates version
  files, runs the release build, and prints suggested git commands.
- Missing git SHA fails soft: use `unknown` → display `X.Y.Z+unknown` for
  non-release builds. Release builds still show clean `X.Y.Z`.

## 3. Build-time injection

`vite.config.js` defines three compile-time constants:

| Constant | Value |
|---|---|
| `__SPIRE_VERSION__` | `package.json` `"version"` string |
| `__SPIRE_GIT_SHA__` | `git rev-parse --short HEAD`, or `"unknown"` on failure |
| `__SPIRE_RELEASE__` | `true` when `process.env.SPIRE_RELEASE === '1'`, else `false` |

A tiny module `src/version.js` exports:

- `formatVersionDisplay(version, gitSha, isRelease)` — pure; if `isRelease`
  return `version`, else return `` `${version}+${gitSha || 'unknown'}` ``
- `getVersionInfo()` — thin wrapper reading the three `__SPIRE_*__` defines and
  returning `{ version, gitSha, release, display }` for the UI

Unit tests call `formatVersionDisplay` only (no Vite). The module must not
touch DOM, audio, or stage.

`npm run dev` always runs with `__SPIRE_RELEASE__ === false`.

Scripts:

- `release:build` → `SPIRE_RELEASE=1 vite build` (or equivalent cross-platform
  env invocation used elsewhere in the repo)
- `release` → `node tools/release.mjs`

## 4. Title screen UI

- Bottom-right corner of `.title-screen`: muted, small text showing the display
  string. Not a button; does not participate in `[data-a]` click routing.
- Layout stays in stage coordinates / existing title CSS. Must not cover
  `.title-btns` or collide badly with `.title-stats` on small shapes.
- **Logo gesture:** 5 taps within 2 seconds on the logo/wordmark temporarily
  reveals debug detail: short SHA and whether this is a release build (even
  when the corner already shows a clean release semver). Dismiss on timeout
  (~3s) or another tap. Use `aria-live="polite"` for the transient detail.
- Settings and other screens: out of scope.

## 5. Release script

`tools/release.mjs` (invoked as `npm run release`):

1. Prompt for `patch` / `minor` / `major`, with one-line reminders of the
   game-oriented semver policy.
2. Run `npm version <type> --no-git-tag-version` so only version fields change.
3. Run `SPIRE_RELEASE=1` production build so `dist/` carries the clean version.
4. Print suggested next steps, including commit message hint and
   `git tag vX.Y.Z` — do not execute commit/tag/push.

No CHANGELOG generation. No GitHub Release API calls.

## 6. Documentation

Add a short “App versioning” note (README subsection or a small doc linked from
`docs/README.md`) covering:

- source of truth;
- non-release vs release display;
- when to bump patch/minor/major;
- the `npm run release` flow and the manual git steps after it.

## 7. Testing

- Unit: display-string formatting for release, non-release with SHA, and
  missing SHA (`unknown`). Prefer testing the pure helper without Vite.
- Manual smoke: title corner shows a version; logo multi-tap shows debug.
- Visual baselines: do **not** add a new screenshot gate for this feature up
  front. If existing title visuals flake on the new label, prefer a stable
  low-contrast treatment or a targeted mask/ignore — decide only if needed.

## 8. Non-goals

- Automatic git commit, tag, or push
- CHANGELOG.md (deferred)
- Version display in Settings or combat HUD
- Coupling version to save-format migrations (major bump is a human signal only)
- Publishing to npm

## 9. Implementation touch list

- `vite.config.js` — define injection
- `src/version.js` — pure format/debug helpers (new)
- `src/ui.js` — `renderTitle()` label + logo gesture
- title CSS in `src/styles.css` (or equivalent)
- `tools/release.mjs` — new
- `package.json` — scripts; version remains source of truth
- short docs note + unit assertions in `test/test_engine.js` (or a tiny
  adjacent test module imported by it, matching repo practice)
