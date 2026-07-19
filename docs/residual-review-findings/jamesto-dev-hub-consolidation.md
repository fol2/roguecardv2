# Residual Review Findings — jamesto/dev-hub-consolidation

Source: multi-model code review run `20260719-030639-086c3797` (correctness, testing, maintainability, adversarial + cross-model adversarial peer, standards, learnings, agent-native). Findings #1–#7 were applied on-branch (commit `f32d1b7c`); the items below remain open.

## Filed

- **P2 — `src/main.js:25` — Multi-param boot precedence has no executable contract** (adversarial, cross-model peer) — [#34](https://github.com/fol2/roguecardv2/issues/34)

## Recorded inline (no ticket)

- **P2 — `src/dev/routes.js:73` — Overlay routes bypass the registry loader.** Maintainability proposed unifying overlay dispatch into the registry. Kept report-only: plan KTD3 explicitly decided the registry describes routes but does not unify boot mechanisms (overlay editors need post-`initUI` injection). Revisit only if a third overlay-style tool appears.
- **P2 — `test/test_engine.js:9275` — Route contract checks extend the ~10k-line monolithic self-check.** Optional extraction to `test/test_dev_routes.mjs` invoked from `npm test`. Repo convention currently favors the monolith; user's call.

## Advisory (agent-native, future work)

- Expose the route registry via `window.__probe` for console/browser agents; consider programmatic content-registration and headless sim APIs. The Node-importable registry makes these straightforward follow-ups.
