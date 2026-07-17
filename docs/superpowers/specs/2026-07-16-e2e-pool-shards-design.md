# E2E pool shards — duration-balanced CI without hand-peeling

**Date:** 2026-07-16 · **Status:** Current
**Supersedes** the per-suite peel topology grown out of
[`2026-07-10-e2e-ci-feedback-design.md`](2026-07-10-e2e-ci-feedback-design.md) /
[`2026-07-12-p2-base-ci-standing-design.md`](2026-07-12-p2-base-ci-standing-design.md)
(the mode/aggregate contract from those specs is unchanged).

## Problem

The nonvisual Playwright gate had grown into 12 hand-peeled job families
(`audio ×6`, `heavy ×10`, `battle ×8`, … `main ×4`) — 68 leaf jobs per
`p2-base` run, ~155 machine-minutes, ~60 of them pure per-job setup. Playwright
`--shard` splits by test count, not duration, so every newly slow spec skewed a
family and forced another manual peel (`E2E_MAIN_PEEL`). The peels also opened
a local coverage hole: `test:e2e:nonvisual` silently lost the
audio/battle/emberglass/heavy suites.

## Shape

One pool lane replaces all 12 families. Special lanes stay: `e2e aux`
(disk-writing editors + `@serial` + trace-production, one cold start),
`e2e random ×3` (own config), and full-mode-only `webkit` / `leak` /
`visual ×3`.

- `SPIREBOUND_E2E_SUITE=pool` (playwright.config.js) = every nonvisual spec ×
  {desktop, portrait, landscape}, ignoring only `visual|leak|perf` and
  `trace-production` (dedicated lanes). `npm run test:e2e:pool` runs it whole;
  `test:e2e:nonvisual` = disk → random-agent → pool → serial (hole closed).
- `tools/e2e-shard.mjs --shard k/N` runs bucket *k* of a deterministic plan:
  1. `playwright test --list --reporter=json` enumerates exactly what the pool
     would run (config drift is impossible by construction);
  2. units = (project × spec file), weighted by `tools/e2e-shard-timings.json`
     (summed per-test seconds from real CI runs; unknown units fall back to
     `count × 8s`);
  3. units heavier than 300s are pre-split into slices via Playwright's native
     in-file `--shard`, so no single spec file can skew a bucket;
  4. deterministic LPT bin-packing → N buckets; every matrix job computes the
     identical plan, so bucket union ≡ pool (contract-tested in
     `test/test_ci_contract.mjs`).
- `ci.yml` runs `e2e pool k/${{ strategy.job-total }}` over one matrix list
  (currently 20). `fail-fast: false` everywhere: one run reports the complete
  failure list instead of one failure per family per push.
- Slow-spec relevance (`changes.outputs.e2e_slow`) no longer toggles *lanes*;
  it narrows the *pool* via `SPIREBOUND_E2E_SKIP_SLOW=1`
  (audio/hollow-transaction/rewards/stage testIgnore) — the gate contract in
  `tools/ci-contract.mjs` needs no slow special-casing.
- Aggregates are unchanged and stay the branch-protection anchors:
  `unit`, `e2e`, `e2e nonvisual`, `p2-base`.

## Operating it

- **A bucket is slow / balance drifted:** refresh weights —
  `PLAYWRIGHT_JSON_OUTPUT_NAME=report.json npm run test:e2e:pool` (or download
  a CI shard's report) then `node tools/e2e-shard.mjs --record report.json`.
  Commit the regenerated timings file. Stale timings degrade balance only,
  never coverage.
- **Gate too slow overall:** grow the one matrix list in `ci.yml`. The command
  self-adjusts via `strategy.job-total`.
- **Inspect the plan:** `node tools/e2e-shard.mjs --plan 20`.
- **Never** hand-peel a suite back into its own lane; that path is
  contract-blocked (`test_ci_contract.mjs` rejects family lanes reappearing).

## Measured baseline (run 29484816194, tip 55324cc6)

68 leaf jobs, 155 machine-min, slowest leaf 7m01s, per-family shard counts
hand-tuned. Pool plan at N=20 from the same measured durations: buckets within
±0.7% (≈635–644 summed seconds each), ~24 leaf jobs total in `p2-base` mode.
