# Round 5 — CI-backed `p2-base` standing gate (design)

**Date:** 2026-07-12  
**Status:** Owner-approved for implementation  
**Goal:** Keep `p2-base` standing fidelity equal to today’s local profile
(Node + nonvisual Playwright lanes + progression), while compressing agent
wall-clock to **under 10 minutes** by reusing the already-sharded public
GitHub Actions gate instead of re-running that browser matrix serially on one
machine.

**Related:** [`2026-07-10-e2e-ci-feedback-design.md`](2026-07-10-e2e-ci-feedback-design.md)
(Draft/Ready parallel E2E; ≤8 min full-gate target; >10 min investigation
signal). This document does not weaken that merge gate; it redefines how Round 5
**standing** consumes a `p2-base`-equivalent subset of it.

## Decisions record (owner-approved)

| Question | Decision |
|---|---|
| Authority for browser + progression fidelity | GitHub Actions on the exact commit SHA (public repo → Actions is free) |
| Local residual for `p2-base` | Only `npm run test:ci` and `npm test` |
| Progression | Move into CI as a parallel full-mode job; remove from local `p2-base` |
| Standing pass definition | Local Node green **and** GitHub check `p2-base` green on that SHA |
| Wall-clock | Target ≤8 minutes; **>10 minutes is failure/investigation**, not success |
| Visual suite | **Excluded** from `p2-base` (legacy local `p2-base` never included visual) |
| Evidence acquisition | Must push the tip; standing uses `gh` to wait on the SHA’s `p2-base` check |
| Unstaged → staged double standing | **Removed** for `p2-base`. Flow: local Node → exact-path commit → push → standing |
| Implementation approach | Extend existing `ci.yml` + change standing runner (Approach A). No local multi-shard Playwright clone. No separate duplicate workflow file. |
| Merge required checks | Unchanged public names: `unit` and `e2e` (full `e2e` still includes visual) |
| Higher profiles (`p2`+) | Out of scope for this change; may later follow the same pattern |

## 1. Context and problem

Today’s Round 5 `p2-base` standing profile runs locally, in series:

1. `npm run test:ci`
2. `npm test`
3. focused desktop Playwright (`trace` / `battle` / `audio`, `--workers=1`)
4. `test:e2e:trace-production`
5. `test:e2e:nonvisual` (disk → random-agent → main → serial)
6. `test:progression`

On a single Mac this commonly takes **40–70 minutes**. CI already runs the
expensive nonvisual surface with **10 `e2e_main` shards** and **3 random-agent
shards**, with a documented full-gate objective of ≤8 minutes. Standing copied
the **coverage list** but not the **parallel topology**, so agents pay an hour
of serial wall-clock for fidelity CI already provides for free.

Fidelity must not be reduced. Speed must come from **who runs the heavy lanes**
and **when standing is allowed to start**, not from deleting tests.

## 2. Invariants

- No bypass: a task that requires `p2-base` is not done until standing PASS.
- Standing PASS for `p2-base` requires both:
  - local `test:ci` + `npm test` exit 0 on the tree that becomes `HEAD`, and
  - GitHub check named exactly **`p2-base`** successful for that `HEAD` SHA.
- The `p2-base` check’s child coverage must be **≥** legacy local `p2-base`
  fidelity for: CI contract/boundaries, unit/monte-carlo, nonvisual e2e lanes
  (disk, random-agent, main, serial), and progression.
- Visual e2e remains required for Ready/`main` via the existing **`e2e`**
  aggregator; it is **not** part of standing `p2-base`.
- Playwright retries stay 0.
- Dirty working tree or unpushed `HEAD` cannot PASS standing (prevents
  “local green, CI proved a different tree”).
- Missing `gh` auth, missing check, CI failure, or >10 minute wait → hard FAIL.
- Branch protection / merge still uses `unit` + `e2e` only unless a later task
  explicitly adds `p2-base` as required.

## 3. Fidelity map

| Legacy local `p2-base` step | New home |
|---|---|
| `npm run test:ci` | Local standing Phase + existing CI `unit_tests` |
| `npm test` | Local standing Phase + existing CI `unit_tests` |
| focused `trace`/`battle`/`audio` desktop | Covered by CI `e2e_main` / related nonvisual shards (subset of full matrix). Not re-run locally. |
| `test:e2e:trace-production` | Retain as CI coverage if not already represented; if absent from current full e2e, add an explicit CI job under `e2e_nonvisual` so fidelity is not silently dropped. |
| `test:e2e:disk` | CI `e2e_disk` |
| `test:e2e:random-agent` | CI `e2e_random` (3 shards) |
| `test:e2e:main` | CI `e2e_main` (10 shards) |
| `test:e2e:serial` | CI `e2e_serial` |
| `test:progression` | New CI `progression` job (full mode, parallel) |
| visual | Not in legacy `p2-base`; stays only under full `e2e` |

Implementation plan must inventory whether `trace-production` is already inside
the nonvisual matrix; if not, add it under `e2e_nonvisual` before flipping
standing.

## 4. CI shape (extend `ci.yml`)

### 4.1 New job: `progression`

- Command: `npm run test:progression`
- Runs in **full** mode only (Ready PR, `main` push, and Round 5 continuation
  refs defined in §5), parallel with other full jobs
- Draft / docs-only: skipped with aggregator no-op success (same pattern as
  existing e2e children)

### 4.2 New aggregator: `e2e_nonvisual`

- `needs`: `e2e_disk`, `e2e_random`, `e2e_main`, `e2e_serial` (and
  `trace-production` if added as its own job)
- Does **not** need `e2e_visual`
- Fails if any required child fails, is cancelled, or fails to report success

### 4.3 Existing aggregator: `e2e`

- Continues to mean the complete browser gate for merge
- `needs`: everything `e2e_nonvisual` needs **plus** `e2e_visual`
- Public required check name remains **`e2e`**

### 4.4 New aggregator: `p2-base` (standing signal)

- `needs`: `unit`, `e2e_nonvisual`, `progression`
- This is the **single** check name the standing runner waits on
- Not added to branch protection by this design
- Timing: target ≤8 minutes wall-clock; >10 minutes is an investigation signal
  for CI owners and a hard timeout for standing wait

## 5. Which refs produce `p2-base` children

Standing must not depend on Draft smoke-only runs (those omit full nonvisual).

Full `p2-base` children (unit path + nonvisual lanes + progression) run when:

1. push to `main`, or
2. pull request is Ready / `ready_for_review`, or
3. branch name matches Round 5 continuation prefixes:
   - `jamesto/round5-**`
   - `cursor/round5-**`

On prefix-matched Draft branches: run **`p2-base` children** (including
progression and nonvisual shards) even if visual remains Ready-only, so agents
can push and wait without forcing Ready.

Ordinary unrelated Draft feature branches keep today’s Draft fast path.

## 6. Standing runner behaviour

`npm run test:round5:standing -- --profile p2-base` becomes:

1. **Local Phase:** `test:ci` then `npm test`. Any non-zero → FAIL.
2. **Git preflight:**
   - inside a git work tree with `origin`
   - `HEAD` exists on the tracked remote branch (pushed)
   - working tree clean
   - `gh` authenticated
3. **CI Phase:** resolve check run named `p2-base` for `HEAD` SHA; poll until
   success, failure, or **>10 minutes** elapsed waiting → FAIL with run URL
4. **Ledger:** append profile, SHA, check URL, local duration, CI wait
   duration, status

Profiles other than `p2-base` are unchanged by this design unless a later spec
says otherwise.

## 7. Agent / Round 5 plan flow change

Replace legacy:

- unstaged full `p2-base` → stage exact paths → staged full `p2-base` → commit

With:

1. Finish implementation + required reviews  
2. Local `test:ci` + `npm test` (iteration may use only this)  
3. Exact-path commit per task  
4. Push  
5. `npm run test:round5:standing -- --profile p2-base` (Node + wait `p2-base`)  
6. Only then treat standing as PASS for handoff/commit closure steps that
   previously required a second local full gate

Starting a standing wait does not mean the task is complete if reviews or plan
steps remain open.

## 8. Error contract

| Condition | Result |
|---|---|
| Local Node fails | FAIL; do not query CI |
| Dirty tree / unpushed HEAD | FAIL with explicit fix instruction |
| `gh` missing or unauthorized | FAIL (never fake green) |
| `p2-base` check absent for SHA | FAIL; instruct push to a §5 ref or mark Ready |
| CI red | FAIL; print failed jobs + URLs |
| Wait >10 minutes | FAIL as infrastructure/timeout investigation |
| CI green + local green | PASS |

## 9. Acceptance criteria

1. Local `p2-base` standing no longer launches Playwright nonvisual or
   progression long runs.
2. Local standing still runs `test:ci` and `npm test`.
3. CI provides parallel `progression`, `e2e_nonvisual`, and aggregate
   `p2-base`.
4. Merge required checks remain `unit` and `e2e` (visual retained on `e2e`).
5. `p2-base` fidelity ≥ legacy local profile for Node + nonvisual + progression;
   visual remains intentionally excluded.
6. Happy-path standing wall-clock target **<10 minutes** (≤8 objective).
7. Ledger records SHA, check URL, and outcome; failure modes in §8 are hard.
8. Round 5 plan / standing docs updated to the commit → push → wait model.

## 10. Non-goals

- Local multi-process Playwright sharding to mimic CI
- Redefining `p2` / `p3` / … standing profiles in this change
- Adding `p2-base` to branch protection
- Deleting or thinning tests to hit the latency target
- Soft-passing when CI evidence is missing

## 11. Open implementation notes (for the plan, not unresolved product questions)

- Confirm `trace-production` coverage path under `e2e_nonvisual` before flip.
- Exact `gh` polling flags / API (`gh run list` vs check-runs) chosen in plan
  with a unit/contract test where practical.
- Document expected `gh` scopes for private-worker agents.
- Update the standing-gate unit assertions in `test/test_engine.js` that freeze
  today’s `p2-base` argv list.
