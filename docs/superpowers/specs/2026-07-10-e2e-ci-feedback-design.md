# Spirebound — Fast-Feedback and Parallel E2E CI (design)

**Date:** 2026-07-10
**Status:** Owner-approved for implementation
**Goal:** Keep every development push useful within roughly three minutes,
while preserving the complete Playwright suite as a latest-head merge gate and
reducing its wall-clock time through safe parallelism.

## Decisions record (owner-approved)

| Question | Decision |
|---|---|
| Development switch | Pull-request Draft state is the fast-feedback mode; Ready for review is the full-gate mode |
| Draft feedback | Unit, production build, and a critical browser smoke lane run in parallel |
| Ready feedback | The complete E2E contract runs in parallel across isolated GitHub-hosted runners |
| Full-gate timing | Target at most 8 minutes wall-clock; over 10 minutes is a warning/investigation signal, not a correctness failure |
| Draft timing | Target at most 3 minutes wall-clock; timing is observational, not a hard gate |
| Merge safety | Required checks retain the exact public names `unit` and `e2e`; Ready PRs and `main` pushes require the complete gate |
| Stale work | A newer PR commit cancels the older run; a `main` push is never cancelled by a later run |
| Performance | FPS/frame-time remains nightly/manual reference evidence and is not a merge hard gate |
| Merge Queue | Not used. It does not shorten test execution and is unavailable for this user-owned public repository |

## 1. Context and measured baseline

The current `ci` workflow has one `unit` job and one monolithic `e2e` job.
The E2E job installs once, then runs these lanes serially:

1. the disk-writing battlefield editor case;
2. the reduced-motion random-agent case;
3. the non-visual desktop/portrait/landscape matrix;
4. the complete visual baseline suite.

The failed PR #14 run on 2026-07-10 measured approximately 21 seconds for the
disk case, 3.2 minutes for the random-agent lane, and 19.5 minutes in the main
matrix before failure; the visual lane never started. After repairing those
failures, the complete local main matrix passed 153 tests with 150 intentional
skips in 4.4 minutes on the development machine. The serial CI topology, not
the existence of full E2E coverage, is therefore the primary avoidable source
of wall-clock delay.

The full run also found a real Vigil safe-area overflow during its entrance
animation. The solution must retain full E2E coverage at the merge boundary,
not remove it.

## 2. Invariants

- `unit` and `e2e` remain the required status-check names. Their aggregator
  jobs must fail when any required child lane fails, is cancelled, or does not
  report success.
- A Ready PR runs the complete E2E suite against its latest head. Any new push
  while Ready runs the complete suite again.
- A Draft PR runs the fast suite on `opened`, `reopened`, `synchronize`, and
  `converted_to_draft`. Moving it to Ready triggers the complete suite through
  `ready_for_review` without requiring another commit.
- A push to `main` runs the complete unit/build and E2E gates as post-merge
  defence.
- Documentation-only changes produce successful no-op `unit` and `e2e`
  aggregators; required checks must never remain pending because a child job
  was skipped.
- Playwright retries remain zero. Faster feedback must not hide flakes.
- The battlefield-editor disk-writing test stays isolated from every other
  browser process. Parallel jobs use separate checkouts, so it no longer needs
  to block read-only E2E lanes.
- Screenshot comparison may run in parallel because it is read-only. Snapshot
  refresh remains manual and single-worker because it writes baselines.
- Each Playwright process keeps at most two workers; parallelism comes from
  separate runners so one WebGL-heavy process cannot starve another on the
  same machine.
- Failure artifacts use lane-unique names and retain screenshots/test results
  for 14 days.
- Timing targets are service objectives and warnings only. Missing or failed
  correctness evidence remains a hard failure.

## 3. Trigger and mode contract

The workflow listens to:

```yaml
push:
  branches: [main]
pull_request:
  types: [opened, reopened, synchronize, ready_for_review, converted_to_draft]
```

The mode resolver is deterministic:

| Event | PR state | Mode | Required browser evidence |
|---|---|---|---|
| `pull_request` | Draft | `smoke` | critical desktop smoke lane |
| `pull_request` | Ready | `full` | disk + random + main + visual lanes |
| `push` to `main` | n/a | `full` | disk + random + main + visual lanes |
| any above | docs-only | `noop` for affected gate | successful aggregator message |

The path filter is evaluated once in a lightweight `changes` job. It exports
`code`, `e2e`, and `mode` for every downstream job.

## 4. Parallel job topology

### 4.1 Every code-relevant push

These jobs start together after the lightweight path decision:

- `unit-tests`: CI-contract checks, engine/unit checks, asset inspection, and
  the 300-run Monte Carlo.
- `build-dist`: production Vite build and byte-clean committed-`dist/` proof.
- `smoke-e2e`: Draft PRs only; four tagged, high-signal browser checks covering
  server configuration, title/Embark layout, combat boot/invariants, and the
  Emberglass Rose entrance.

The `unit` aggregator requires both `unit-tests` and `build-dist` for
code-relevant changes. Splitting them reduces wall-clock time without changing
the existing required-check contract.

### 4.2 Ready PRs and `main`

Full E2E fans out immediately; it does not wait for `unit` or `build-dist`:

| Lane | Parallel shape | Contract |
|---|---:|---|
| `e2e-disk` | 1 job | Real battlefield-editor save, one worker, clean-checkout proof |
| `e2e-random` | 3 shards | One deterministic seeded fight per shard, reduced motion, one worker each |
| `e2e-main` | 4 shards | All non-visual desktop/portrait/landscape tests, two workers per runner |
| `e2e-visual` | 3 jobs | One canonical Playwright project per runner, one worker, read-only Linux baselines |

All matrix strategies use `fail-fast: false` so one failure does not erase
other diagnostic evidence. The final `e2e` aggregator requires every full
lane to report success.

The build runs once in `build-dist`; Playwright continues to serve source with
Vite, so E2E jobs do not wait for or download `dist/`. This preserves the
shortest critical path while still making the production bundle a required
parallel gate.

## 5. Smoke and random-agent contracts

Smoke coverage is an explicit Playwright `@smoke` tag, not a dynamic
changed-test selector. The initial set is:

1. the default E2E server remains compatible with local development;
2. title and Embark screens fit without overflow;
3. combat opening state and DOM/engine invariants agree;
4. one Emberglass shard exposes a working title medallion and Rose Window.

These tests also remain in the full main suite. Smoke is a feedback subset,
never a substitute for the Ready gate.

The existing random-agent test is split into three independently seeded cases
using the same agent loop and assertions. Local `npm run test:e2e:random-agent`
still runs all cases; CI adds Playwright `--shard=N/3` so each runner executes
one case. The refactor may increase coverage by ensuring an early loss in one
fight cannot suppress the other two cases.

## 6. Required-check aggregation

A small Node-safe CI contract module owns mode selection and gate validation.
It has no dependencies and is covered by a direct assertion script. It must:

- return `smoke` only for Draft pull requests and `full` otherwise;
- treat irrelevant/doc-only changes as a successful no-op;
- require both unit child jobs for the `unit` gate;
- require only `smoke-e2e` in smoke mode;
- require disk, random, main, and visual results in full mode;
- reject `failure`, `cancelled`, `skipped`, or missing results for a required
  lane.

This keeps conditional-result logic out of ad-hoc shell expressions and makes
the branch-protection contract locally testable.

## 7. Developer and operator interface

The package scripts expose reproducible local equivalents:

```bash
npm run test:ci
npm run test:e2e:smoke
npm run test:e2e:random-agent -- --shard=1/3
npm run test:e2e:main -- --shard=1/4
npm run test:e2e:visual:project -- --project=desktop
```

`npm run test:e2e` remains the complete serial local gate. This avoids making
ordinary local verification open ten browser processes on one machine.

## 8. Observability, rollout, and rollback

- GitHub's job graph and durations are the timing source of truth. After the
  first three Ready/full runs, record median Draft and full wall-clock times in
  the implementation evidence.
- A Draft run exceeding three minutes or a full run exceeding ten minutes is
  investigated for queueing, install time, or an imbalanced shard. It does not
  turn a green correctness run red.
- The first implementation lands on PR #14 while it is Ready, so the new
  workflow proves the complete topology before merge.
- Rollback is one workflow reversion plus removal of the auxiliary CI scripts;
  product code, save data, and baselines are unaffected.
- If runner concurrency proves lower than expected, reduce main shards from
  four to three before removing any test coverage.

## 9. Out of scope

- Merge Queue adoption or repository ownership changes.
- Removing Playwright from the merge gate.
- Retrying flaky tests instead of fixing them.
- A third-party test-selection service.
- Making performance targets blocking.
- Parallel local execution of the complete suite.

## 10. Acceptance criteria

- Draft pushes report successful required `unit` and `e2e` checks using only
  the fast lanes for code-relevant changes.
- Converting a Draft PR to Ready starts the complete gate without another
  commit.
- Ready pushes and `main` pushes require all full E2E lanes.
- A synthetic failed/missing child result makes the matching aggregator fail
  in local CI-contract tests.
- `npm test`, `npm run build`, `npm run test:ci`, smoke, all random-agent
  shards, all main shards, and all visual projects pass locally.
- The first GitHub Ready run is green and records real lane durations; target
  is at most 8 minutes, with over 10 minutes reported as a warning rather than
  a failed correctness gate.
