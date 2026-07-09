# AGENTS.md

Guidance for AI coding agents (Claude Code, Cursor, Codex, …) working in this repository. `CLAUDE.md` is a symlink to this file, so Claude Code picks it up automatically.

## What this is

**Spirebound** — a complete browser roguelite deckbuilder (Vite + vanilla JS + three.js, no UI framework). Combat art, cards, relics, enemies, events, and stage plates are raster assets in `src/assets/` (resolved through `assetUrl()` with SVG fallbacks); structural UI icons and status chips are hand-drawn SVG in `src/art.js`; SFX are sample-backed with synth fallback (`src/audio.js`); BGM is a Music Cue layer (`src/music.js`, assets in `src/assets/musics/`). Deeper design/lore context lives in `README.md`.

## Agent skills

### Issue tracker

Issues live in GitHub Issues, and external PRs are also a triage surface. See `docs/agents/issue-tracker.md`.

### Triage labels

Use the default five-label triage vocabulary. See `docs/agents/triage-labels.md`.

### Domain docs

Use a multi-context domain documentation layout. See `docs/agents/domain.md`.

## Commands

```bash
npm install
npm run dev          # Vite dev server (host 0.0.0.0, port 5174 — see vite.config.js)
npm run build        # static bundle → dist/
npm run preview      # serve the built dist/
npm test             # node test/test_engine.js — unit checks + 300-run monte-carlo bot
npm run test:e2e     # Playwright visual-QA kit (geometry, battle, stage, visual, perf)
npm run test:e2e:update   # refresh screenshot baselines
npm run test:e2e:perf     # fps gate only (single worker)
```

- **Tests are a single self-check script**, not a framework. `npm test` runs the whole of `test/test_engine.js` (plain `node`, `node:assert`). There is no test runner or `-t` filter — to run a subset, comment out blocks in that file. Any assertion failure exits non-zero.
- **Playwright** (`test/e2e/`) is separate from `npm test` and requires Chromium (`npx playwright install chromium` once if launch fails). It reuses the dev server on port 5174. Spec: `docs/superpowers/specs/2026-07-06-visualisation-hardening-polish-design.md` §3.
- **`dist/` is committed** and rebuilt into the repo, so `npm run build` produces large diffs — that is expected here, not a mistake.

## Cursor Cloud specific instructions

Standard commands are in `README.md` and `package.json` (`dev`, `build`, `preview`, `test`, `test:e2e`). Notes that are non-obvious:

- **Dev server port is 5174** (`vite.config.js` overrides Vite's default 5173).
- **`allowedHosts` is restrictive.** `vite.config.js` `DEV_ALLOWED_HOSTS` is `[".ts.net"]` (suffix: any Tailscale MagicDNS name). `localhost`/`127.0.0.1` work out of the box. Prefer `http://<server-magicdns>:5174/?bfuiedit=1` (or `?bfedit=1`) over a raw `100.x` Tailscale IP — IPs are not in the allowlist and will get Vite’s “host is not allowed”. Editor Save (`/__bf-save`, `/__bfui-save`, …) is same-origin only (any host that can load the DEV page may POST). Restart `npm run dev` after pulling Save-gate / `allowedHosts` changes.
- **Tests need no browser/service.** `npm test` runs `node test/test_engine.js` (unit checks + a 300-run monte-carlo). Expected output ends with a line like `unit checks passed; monte-carlo: 300 runs, ...` — the monte-carlo is mostly deaths by design (a random agent), so a low win count is normal, not a failure.
- **No lint tooling** is configured (no ESLint/Prettier); "lint" for this repo is effectively `npm test` + `npm run build`.
- **Combat scene render delay:** when a fight starts, the three.js enemy can pop in a beat after the scene loads. This is expected rendering latency, not a bug.

## Architecture

### The golden rule: the engine is pure, the UI plays it back

`src/engine.js` holds all game logic and is deliberately free of DOM/rendering. Instead of drawing, engine functions **push animation events into `cb.queue`**; `src/ui.js` `drain()`s that queue and turns each event into DOM/VFX/SFX. Keep this separation intact — it is why `npm test` can drive full runs headless in Node. When you add a mechanic, the engine emits a new event *type* and the UI grows a handler for it; the engine must not reach into the DOM.

Consequence: **every damage/block calculation has a pure preview mirror** (`previewPlay`, `previewBlock`, `previewEnemyDmg`) that the UI uses to show lethal/ghost numbers. If you change combat math, update its preview mirror or the parity tests break.

### Module dependency graph (import direction is load-bearing)

```
data.js   ← pure content tables + constants, imports nothing
art.js    ← pure procedural SVG + assetUrl(); imports nothing
stage.js  ← fixed virtual viewport; imports nothing
audio.js  ← WebAudio SFX + shared AudioContext; UNGUARDED top-level localStorage (browser-only)
music.js  ← Music Cue registry + BGM playback; imports audio.js only (browser-only)
engine.js ← imports data.js only         (game logic; localStorage save/load is try/catch-guarded → no-ops in Node)
vigil.js  ← imports data.js only         (meta-progression; Node-safe storage adapter + _setStore() test hook)
scene3d.js← imports three + data.js + stage.js  (the 3D tower / camera)
vfx.js    ← 2D canvas combat VFX; imports stage.js
mesh.js   ← WebGL character warp; imports stage.js
ui.js     ← imports ALL of the above     (the only orchestrator; owns the DOM)
main.js   ← initStage → initScene → initVfx → initMesh → initUI
```

**Never import `audio.js` or `music.js` from `engine.js` or `vigil.js`** — top-level `localStorage` access throws in Node and would break the tests. Engine and vigil are the two modules that must stay Node-runnable. **`stage.js` is browser-only** (DOM) — same import ban for engine/vigil.

### Fixed virtual stage (`src/stage.js`, spec §1b)

All game layers live inside `#stage` in `index.html`. The stage picks one of five canonical shapes (phone/pad portrait & landscape, plus `desktop-landscape` ≈16:9 for wide monitors), sizes itself at that virtual resolution, and scales uniformly into the window. **Layout code speaks stage px**; pointer events speak client px — convert at the boundary with `toStage()` / `stageRect()`. CSS layout breakpoints query the stage (`@container stage`), not the window; use `cqw`/`cqh` instead of `vw`/`vh`. `?shape=<name>` forces a shape for tests/dev.

### Screens & the single #screen element

All screens (title, embark, map, combat, rewards, lamplighter, end/bequest, vigil) render into one `#screen` div. `show()` is the switcher and **must clear `sc.onclick`** — a stale title-screen click delegate once hijacked reward-screen buttons. The 3D map nodes are DOM elements projected onto the three.js tower every frame via `setOverlay(anchors, cb)`; the map literally *is* the tower.

### Persistence & save-shape validation

localStorage keys: `spirebound_save_v2` (current run), `spirebound_stats_v1` (lifetime stats), `spirebound_vigil_v2` (meta-progression; one-way migrate from `spirebound_vigil_v1` on first load, v1 left as read-only backup), `spirebound_vol_music` / `spirebound_mute_music` / `spirebound_vol_sfx` / `spirebound_mute_sfx` (independent audio buses; legacy `spirebound_mute` migrates into both mutes). `loadRun` validates every content id on load — this doubles as the shield against stale content after an HMR edit or a card/relic rename. `run.pendingCombat` guards against reload-to-skip-fight.

### The four game systems (all in engine + data, surfaced by ui)

SHATTER (facets/chips/shatter/embers/kindle + Lantern Arts), Omens & the Unlit Way (per-act rule twists, unlit nodes, elite affixes), the Vigil (aspects, vows, lamplighter boons, monuments/bequests, deed unlocks, and the progressive-delivery reveal ladder — the only module that persists across runs), and the "native tongue" rename. Lamplighter / phials / omens / pool waves are gated by `REVEALS`/`PROGRESSION` in `data.js` (evaluated via `vigil.js`); a fresh profile's first climb is the curated core only. See the "Reckoning Round" notes in the project memory and `README.md` for the full mechanics.

## Conventions that will bite you if unknown

- **Internal keys ≠ display names.** The de-clone renamed display strings only (Block→Ward, poison→Smolder, etc.) in `STATUS_INFO`/card text; the *internal* status keys and card ids (`poison`, `vulnerable`, `str`, id `'strike'`/`'defend'`) are unchanged to protect saves and test anchors. Change display text in the data tables, never the keys.
- **Structural UI icons must come from `art.js`** (`iconSvg`/`iconInline`) — never font glyphs like ⚔/♛ for map nodes, intents, shields, or piles. Font glyphs render as tofu on non-Mac platforms. Decorative relic/status sigils are the deliberate exception.
- **`window.spirebound = { S, E, startCombatUI, show }`** and **`window.__probe`** (ui.js) are console/test hooks — god-mode bots, geometry readers, battle drivers. The probe reports coordinates in **stage px**.
- **Combat-stage geometry lives in `src/battlefield-layout.js`**, not CSS — hero/enemy positions & sizes, formations, the 3 background plates and the ground line, per stage shape. Edit it by hand or with the dev-only editor at `http://localhost:5174/?bfedit=1` (drag/resize, per-shape overrides, Save writes the file). `src/battlefield.js` is the resolver; both must stay Node-importable and import nothing.
- **Audio gallery:** `http://localhost:5174/?audio=1` lists every SFX and Music Cue with where-used notes; click to preview (`src/audio-catalog.js`). Art gallery remains `?gallery=1`.
- **Combat chrome geometry lives in `src/ui-chrome-layout.js`**, not CSS — energy / lantern / end-turn / piles / top HUD unit, per stage shape. Dev editor: `http://localhost:5174/?bfuiedit=1` (Save → `POST /__bfui-save`). Resolver is `src/uic.js` (not `src/ui-chrome.js`, which is asset helpers). Safe-area is baked into the numbers.
- **Mobile is first-class**: three layout regimes inside the fixed stage (`@container stage` max-width 1100 / 740, and max-height 480 landscape) with drag-to-play, safe-area insets, and a lower-perf `LITE` render tier on coarse pointers.

## Authoring raster images

Combat art, cards, relics, and most props are already raster in `src/assets/`.
For **new** authoring-time assets (promos, one-offs, council review candidates)
shell out to the Codex CLI's built-in image tool. Full workflow, flags, and
gotchas are in `docs/imagegen.md`; the ready-to-run wrapper is `tools/imagegen.sh`.
Promotion workflow: `docs/generated-art-workflow.md`.

## Git

`dist/` is tracked and regenerated (expect big diffs). Do not commit unless explicitly asked.

## Documentation

Index of specs, asset bibles, and the visual-QA kit: [`docs/README.md`](docs/README.md). Active executor work: `docs/superpowers/plans/2026-07-06-visualisation-hardening-polish.md`.
