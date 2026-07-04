# AGENTS.md

Guidance for AI coding agents (Claude Code, Cursor, Codex, …) working in this repository. `CLAUDE.md` is a symlink to this file, so Claude Code picks it up automatically.

## What this is

**Spirebound** — a complete browser roguelite deckbuilder (Vite + vanilla JS + three.js, no UI framework). All art is procedural SVG (`src/art.js`), all audio is WebAudio-synthesized (`src/audio.js`); there are no binary runtime assets. Deeper design/lore context lives in `README.md`.

## Commands

```bash
npm install
npm run dev      # Vite dev server (host 0.0.0.0, port 5174 — see vite.config.js)
npm run build    # static bundle → dist/
npm run preview  # serve the built dist/
npm test         # node test/test_engine.js — unit checks + 300-run monte-carlo bot
```

- **Tests are a single self-check script**, not a framework. `npm test` runs the whole of `test/test_engine.js` (plain `node`, `node:assert`). There is no test runner or `-t` filter — to run a subset, comment out blocks in that file. Any assertion failure exits non-zero.
- **`dist/` is committed** and rebuilt into the repo, so `npm run build` produces large diffs — that is expected here, not a mistake.

## Cursor Cloud specific instructions

Standard commands are in `README.md` and `package.json` (`dev`, `build`, `preview`, `test`). Notes that are non-obvious:

- **Dev server port is 5174, not 5173.** `vite.config.js` overrides the port; `README.md` still says 5173. Access the running game at `http://localhost:5174/`.
- **`allowedHosts` is restrictive.** `vite.config.js` only allows a specific Tailscale hostname. `localhost`/`127.0.0.1` work out of the box; if serving to another external host, add it to `allowedHosts` (do not commit throwaway hosts).
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
art.js    ← pure procedural SVG, imports nothing
audio.js  ← WebAudio; has UNGUARDED top-level localStorage (browser-only)
engine.js ← imports data.js only         (game logic; localStorage save/load is try/catch-guarded → no-ops in Node)
vigil.js  ← imports data.js only         (meta-progression; Node-safe storage adapter + _setStore() test hook)
scene3d.js← imports three + data.js       (the 3D tower / camera)
vfx.js    ← 2D canvas combat VFX
ui.js     ← imports ALL of the above     (the only orchestrator; owns the DOM)
main.js   ← wires initScene/initVfx/initUI
```

**Never import `audio.js` from `engine.js` or `vigil.js`** — its top-level `localStorage` access throws in Node and would break the tests. Engine and vigil are the two modules that must stay Node-runnable.

### Screens & the single #screen element

All screens (title, map, combat, rewards, lamplighter, end/bequest, vigil panel) render into one `#screen` div. `show()` is the switcher and **must clear `sc.onclick`** — a stale title-screen click delegate once hijacked reward-screen buttons. The 3D map nodes are DOM elements projected onto the three.js tower every frame via `setOverlay(anchors, cb)`; the map literally *is* the tower.

### Persistence & save-shape validation

localStorage keys: `spirebound_save_v2` (current run), `spirebound_stats_v1` (lifetime stats), `spirebound_vigil_v1` (meta-progression), `spirebound_mute`. `loadRun` validates every content id on load — this doubles as the shield against stale content after an HMR edit or a card/relic rename. `run.pendingCombat` guards against reload-to-skip-fight.

### The four game systems (all in engine + data, surfaced by ui)

SHATTER (facets/chips/shatter/embers/kindle + Lantern Arts), Omens & the Unlit Way (per-act rule twists, unlit nodes, elite affixes), the Vigil (aspects, vows, lamplighter boons, monuments/bequests, deed unlocks — the only module that persists across runs), and the "native tongue" rename. See the "Reckoning Round" notes in the project memory and `README.md` for the full mechanics.

## Conventions that will bite you if unknown

- **Internal keys ≠ display names.** The de-clone renamed display strings only (Block→Ward, poison→Smolder, etc.) in `STATUS_INFO`/card text; the *internal* status keys and card ids (`poison`, `vulnerable`, `str`, id `'strike'`/`'defend'`) are unchanged to protect saves and test anchors. Change display text in the data tables, never the keys.
- **Structural UI icons must come from `art.js`** (`iconSvg`/`iconInline`) — never font glyphs like ⚔/♛ for map nodes, intents, shields, or piles. Font glyphs render as tofu on non-Mac platforms. Decorative relic/status sigils are the deliberate exception.
- **`window.spirebound = { S, E, startCombatUI, show }`** (ui.js) is a console debug hook for browser/agent testing — e.g. god-mode bots via `agent-browser eval`.
- **Mobile is first-class**, two breakpoints (≤740px portrait, ≤480px-height landscape) with drag-to-play, safe-area insets, and a lower-perf `LITE` render tier on coarse pointers. Combat-stage geometry (ledge offsets, hand fit) is hand-tuned in the media queries — retune it when you touch the battlefield layout.

## Authoring raster images

The game ships zero raster runtime assets, but for **authoring-time** art (title/promo/reference PNGs) shell out to the Codex CLI's built-in image tool. Full workflow, flags, and gotchas are in `docs/imagegen.md`; the ready-to-run wrapper is `tools/imagegen.sh`.

## Git

`dist/` is tracked and regenerated (expect big diffs). Do not commit unless explicitly asked.
