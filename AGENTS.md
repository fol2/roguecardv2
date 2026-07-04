# SPIREBOUND

A 100% client-side browser roguelite deckbuilder (vanilla JS + Vite + three.js). No backend, database, secrets, or external services — game logic, art (procedural SVG), and audio (WebAudio) all run in the browser; meta-progression persists to `localStorage`.

## Cursor Cloud specific instructions

Standard commands are in `README.md` and `package.json` (`dev`, `build`, `preview`, `test`). Notes that are non-obvious:

- **Dev server port is 5174, not 5173.** `vite.config.js` overrides the port; `README.md` still says 5173. Access the running game at `http://localhost:5174/`.
- **`allowedHosts` is restrictive.** `vite.config.js` only allows a specific Tailscale hostname. `localhost`/`127.0.0.1` work out of the box; if serving to another external host, add it to `allowedHosts` (do not commit throwaway hosts).
- **Tests need no browser/service.** `npm test` runs `node test/test_engine.js` (unit checks + a 300-run monte-carlo). Expected output ends with a line like `unit checks passed; monte-carlo: 300 runs, ...` — the monte-carlo is mostly deaths by design (a random agent), so a low win count is normal, not a failure.
- **No lint tooling** is configured (no ESLint/Prettier); "lint" for this repo is effectively `npm test` + `npm run build`.
- **Combat scene render delay:** when a fight starts, the three.js enemy can pop in a beat after the scene loads. This is expected rendering latency, not a bug.
