# CI-backed `p2-base` Standing Gate Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make Round 5 `p2-base` standing pass in under 10 minutes with no fidelity loss by running only local `test:ci` + `npm test`, then waiting on a new GitHub Actions aggregate check `p2-base` that reuses the existing sharded nonvisual e2e plus a new parallel progression job.

**Architecture:** Extend `tools/ci-contract.mjs` with a third mode `p2-base` for Round 5 continuation Draft PRs (nonvisual + progression, no visual). Extend `ci.yml` with `progression`, `e2e_trace_production`, `e2e_nonvisual`, and `p2-base` aggregators. Change standing profile `p2-base` to `[test:ci, npm test, wait-github-check]`. Merge required checks stay `unit` + `e2e`.

**Tech Stack:** GitHub Actions, `tools/ci-contract.mjs`, `tools/run-round5-standing-gates.mjs`, new `tools/wait-github-check.mjs`, `gh` CLI, Node `node:assert` tests in `test/test_ci_contract.mjs` + `test/test_engine.js`.

**Spec:** `docs/superpowers/specs/2026-07-12-p2-base-ci-standing-design.md`

## Global Constraints

- Do not bypass or thin tests to hit latency; move heavy lanes to CI shards only.
- Public merge required check names remain exactly `unit` and `e2e`.
- `p2-base` check excludes visual; includes unit + nonvisual e2e + progression + trace-production.
- Standing wait timeout is hard **600000 ms (10 minutes)** → FAIL.
- Wall-clock target ≤8 minutes; >10 minutes is investigation / standing failure.
- Higher standing profiles (`p2`+) stay unchanged in this plan.
- Work on branch `jamesto/round5-production-engineering-continuation` (or current Round 5 continuation worktree). Do not mix unrelated Task 11 registry WIP into these commits unless already committed separately.
- Stage exact paths; never `git add -A`.

## File map

| File | Responsibility |
|---|---|
| `tools/ci-contract.mjs` | Mode resolution (`smoke` / `p2-base` / `full`) + lane lists for `unit` / `e2e` / `p2-base` gates |
| `test/test_ci_contract.mjs` | Contract tests + workflow string assertions |
| `.github/workflows/ci.yml` | Jobs + aggregators |
| `tools/wait-github-check.mjs` | Push/clean-tree preflight + poll `p2-base` check for `HEAD` |
| `tools/run-round5-standing-gates.mjs` | `p2-base` profile = Node + wait script |
| `test/test_engine.js` | Frozen profile argv expectations + wait helper unit coverage |
| Round 5 plan / docs | Replace unstaged→staged full local `p2-base` with commit→push→standing |

---

### Task 1: CI mode `p2-base` in the contract module

**Files:**
- Modify: `tools/ci-contract.mjs`
- Modify: `test/test_ci_contract.mjs`

**Interfaces:**
- Consumes: existing `resolveCiMode` / `requiredCiLanes` / `verifyCiGate`
- Produces:
  - `isRound5StandingRef(refName: string): boolean` — true for `jamesto/round5-` and `cursor/round5-` prefixes (branch or PR head ref short name)
  - `resolveCiMode(eventName, draftValue, refName?): 'smoke' | 'p2-base' | 'full'`
  - `requiredCiLanes(gate, relevant, mode)` supports `gate: 'p2-base'` and `mode: 'p2-base'`
  - `FULL_E2E_LANES` unchanged for merge `e2e` in `full` mode
  - `P2_BASE_E2E_LANES` = nonvisual only (no visual, no smoke-e2e)
  - `P2_BASE_GATE_LANES` used by the `p2-base` aggregator

- [ ] **Step 1: Write the failing contract tests**

Replace/extend `test/test_ci_contract.mjs` so these assertions exist (keep existing smoke/full cases):

```js
import {
  resolveCiMode,
  requiredCiLanes,
  verifyCiGate,
  isRound5StandingRef,
} from '../tools/ci-contract.mjs';

assert.equal(isRound5StandingRef('jamesto/round5-production-engineering-continuation'), true);
assert.equal(isRound5StandingRef('cursor/round5-foo'), true);
assert.equal(isRound5StandingRef('cursor/entrance-progressive-delivery-0e31'), false);
assert.equal(isRound5StandingRef('main'), false);

assert.equal(resolveCiMode('pull_request', true, 'feature/x'), 'smoke');
assert.equal(resolveCiMode('pull_request', true, 'jamesto/round5-production-engineering-continuation'), 'p2-base');
assert.equal(resolveCiMode('pull_request', false, 'jamesto/round5-x'), 'full');
assert.equal(resolveCiMode('push', '', 'main'), 'full');

assert.deepEqual(requiredCiLanes('e2e', true, 'p2-base'), [
  'changes', 'e2e-disk', 'e2e-random', 'e2e-main', 'e2e-serial', 'e2e-trace-production',
]);
assert.deepEqual(requiredCiLanes('p2-base', true, 'p2-base'), [
  'changes', 'unit', 'e2e-nonvisual', 'progression',
]);
assert.deepEqual(requiredCiLanes('p2-base', false, 'p2-base'), ['changes']);
assert.deepEqual(requiredCiLanes('e2e', true, 'full'), [
  'changes', 'e2e-disk', 'e2e-random', 'e2e-main', 'e2e-serial', 'e2e-visual',
]);
```

Also assert `verifyCiGate` for `gate: 'p2-base'` succeeds when unit/e2e-nonvisual/progression are success, and throws when progression is missing.

- [ ] **Step 2: Run tests to verify they fail**

Run: `node test/test_ci_contract.mjs`  
Expected: FAIL (missing exports / unsupported mode)

- [ ] **Step 3: Implement contract helpers**

In `tools/ci-contract.mjs`:

```js
const P2_BASE_E2E_LANES = [
  'changes', 'e2e-disk', 'e2e-random', 'e2e-main', 'e2e-serial', 'e2e-trace-production',
];
const P2_BASE_GATE_LANES = ['changes', 'unit', 'e2e-nonvisual', 'progression'];

export function isRound5StandingRef(refName = '') {
  const name = String(refName).replace(/^refs\/heads\//, '');
  return name.startsWith('jamesto/round5-') || name.startsWith('cursor/round5-');
}

export function resolveCiMode(eventName, draftValue, refName = '') {
  if (eventName === 'push') return 'full';
  if (eventName === 'pull_request') {
    if (!truthy(draftValue)) return 'full';
    return isRound5StandingRef(refName) ? 'p2-base' : 'smoke';
  }
  throw new Error(`Unsupported CI event: ${eventName}`);
}

export function requiredCiLanes(gate, relevant, mode) {
  if (!truthy(relevant)) return ['changes'];
  if (gate === 'unit') return [...UNIT_LANES];
  if (gate === 'p2-base') {
    if (mode === 'smoke') return ['changes'];
    return [...P2_BASE_GATE_LANES];
  }
  if (gate !== 'e2e') throw new Error(`Unsupported CI gate: ${gate}`);
  if (mode === 'smoke') return [...SMOKE_LANES];
  if (mode === 'p2-base') return [...P2_BASE_E2E_LANES];
  if (mode === 'full') return [...FULL_E2E_LANES];
  throw new Error(`Unsupported CI mode: ${mode}`);
}
```

Update CLI `mode` command to pass ref:

```js
const mode = resolveCiMode(
  process.env.GITHUB_EVENT_NAME,
  process.env.PR_DRAFT,
  process.env.CI_REF_NAME || process.env.GITHUB_HEAD_REF || process.env.GITHUB_REF_NAME || '',
);
```

- [ ] **Step 4: Re-run contract tests**

Run: `node test/test_ci_contract.mjs`  
Expected: PASS (workflow string asserts may still fail until Task 2 — if so, temporarily keep only logic asserts in this commit, or expect Step 4 pass after implementing helpers while workflow asserts are updated in Task 2). Prefer: move workflow `assert.match` updates into Task 2; Task 1 commit only logic tests that pass.

- [ ] **Step 5: Commit**

```bash
git add tools/ci-contract.mjs test/test_ci_contract.mjs
git commit -m "feat: add p2-base CI mode to the contract"
```

---

### Task 2: Workflow jobs and aggregators

**Files:**
- Modify: `.github/workflows/ci.yml`
- Modify: `test/test_ci_contract.mjs` (workflow string assertions)

**Interfaces:**
- Consumes: `tools/ci-contract.mjs` mode output including `p2-base`
- Produces: GitHub checks named `e2e nonvisual`, `progression`, `p2-base` (job `name:` fields), plus existing `unit` / `e2e`

- [ ] **Step 1: Extend the `changes` mode step env**

In `.github/workflows/ci.yml` job `changes` step `mode`:

```yaml
      - id: mode
        run: node tools/ci-contract.mjs mode
        env:
          PR_DRAFT: ${{ github.event.pull_request.draft }}
          CI_REF_NAME: ${{ github.head_ref || github.ref_name }}
```

- [ ] **Step 2: Add shared full-or-standing condition helpers via mode**

Define job `if` expressions:

- Nonvisual / progression / trace-production children:
  `needs.changes.outputs.e2e == 'true' && (needs.changes.outputs.mode == 'full' || needs.changes.outputs.mode == 'p2-base')`
- Visual children: keep `mode == 'full'` only
- Smoke: keep `mode == 'smoke'`

- [ ] **Step 3: Add `e2e_trace_production` job**

Mirror `e2e_serial` shape:

```yaml
  e2e_trace_production:
    name: e2e trace-production
    needs: changes
    if: needs.changes.outputs.e2e == 'true' && (needs.changes.outputs.mode == 'full' || needs.changes.outputs.mode == 'p2-base')
    runs-on: ubuntu-24.04
    timeout-minutes: 10
    steps:
      - uses: actions/checkout@9c091bb21b7c1c1d1991bb908d89e4e9dddfe3e0 # v7.0.0
        with:
          persist-credentials: false
      - uses: actions/setup-node@48b55a011bda9f5d6aeb4c2d9c7362e8dae4041e # v6.4.0
        with:
          node-version: 24
          cache: npm
      - run: npm ci
      - run: npx playwright install --with-deps chromium
      - run: npm run test:e2e:trace-production
      - name: Verify clean checkout
        if: always()
        run: test -z "$(git status --porcelain --untracked-files=all)"
```

Update existing `e2e_disk` / `e2e_random` / `e2e_main` / `e2e_serial` `if:` to the full-or-`p2-base` expression from Step 2.

- [ ] **Step 4: Add `progression` job**

```yaml
  progression:
    name: progression
    needs: changes
    if: needs.changes.outputs.code == 'true' && (needs.changes.outputs.mode == 'full' || needs.changes.outputs.mode == 'p2-base')
    runs-on: ubuntu-24.04
    timeout-minutes: 15
    steps:
      - uses: actions/checkout@9c091bb21b7c1c1d1991bb908d89e4e9dddfe3e0 # v7.0.0
        with:
          persist-credentials: false
      - uses: actions/setup-node@48b55a011bda9f5d6aeb4c2d9c7362e8dae4041e # v6.4.0
        with:
          node-version: 24
          cache: npm
      - run: npm ci
      - run: npm run test:progression
```

(No Playwright install.)

- [ ] **Step 5: Add aggregators `e2e_nonvisual` and `p2-base`; rewire `e2e`**

```yaml
  e2e_nonvisual:
    name: e2e nonvisual
    if: always()
    needs: [changes, e2e_disk, e2e_random, e2e_main, e2e_serial, e2e_trace_production]
    runs-on: ubuntu-24.04
    timeout-minutes: 5
    steps:
      - uses: actions/checkout@9c091bb21b7c1c1d1991bb908d89e4e9dddfe3e0 # v7.0.0
        with:
          persist-credentials: false
      - run: node tools/ci-contract.mjs gate
        env:
          CI_GATE: e2e
          CI_RELEVANT: ${{ needs.changes.outputs.e2e }}
          CI_MODE: ${{ needs.changes.outputs.mode == 'full' && 'p2-base' || needs.changes.outputs.mode }}
          CI_RESULTS: >-
            {"changes":"${{ needs.changes.result }}","e2e-disk":"${{ needs.e2e_disk.result }}","e2e-random":"${{ needs.e2e_random.result }}","e2e-main":"${{ needs.e2e_main.result }}","e2e-serial":"${{ needs.e2e_serial.result }}","e2e-trace-production":"${{ needs.e2e_trace_production.result }}"}
```

Important: when mode is `full`, `e2e_nonvisual` must still only require nonvisual lanes. Implement this cleanly in contract by adding gate `e2e-nonvisual` OR pass `CI_MODE=p2-base` always into this aggregator (recommended: always verify with mode `p2-base` / lanes `P2_BASE_E2E_LANES` via `CI_GATE=e2e` and `CI_MODE=p2-base` hard-coded for this job). Prefer hard-coding `CI_MODE: p2-base` for `e2e_nonvisual` so full runs still validate the nonvisual subset independently of visual.

```yaml
  p2-base:
    name: p2-base
    if: always()
    needs: [changes, unit, e2e_nonvisual, progression]
    runs-on: ubuntu-24.04
    timeout-minutes: 5
    steps:
      - uses: actions/checkout@9c091bb21b7c1c1d1991bb908d89e4e9dddfe3e0 # v7.0.0
        with:
          persist-credentials: false
      - run: node tools/ci-contract.mjs gate
        env:
          CI_GATE: p2-base
          CI_RELEVANT: ${{ needs.changes.outputs.code == 'true' || needs.changes.outputs.e2e == 'true' }}
          CI_MODE: ${{ needs.changes.outputs.mode }}
          CI_RESULTS: >-
            {"changes":"${{ needs.changes.result }}","unit":"${{ needs.unit.result }}","e2e-nonvisual":"${{ needs.e2e_nonvisual.result }}","progression":"${{ needs.progression.result }}"}
```

Keep job `e2e` needing visual children + smoke as today; add `e2e_trace_production` into its `CI_RESULTS` only if you also add it to `FULL_E2E_LANES`. **Do not** add trace-production into merge `e2e` full lane list unless you also add the job to `needs:` of `e2e`. Spec requires trace-production under `p2-base` / `e2e_nonvisual` only; merge `e2e` may omit it. So: `e2e` `needs` stays without forcing trace-production; `e2e_nonvisual` includes it.

Update `e2e` job `needs` to include `e2e_nonvisual` optionally? Spec: `e2e` needs nonvisual children + visual. Simplest: leave `e2e` needing the leaf jobs directly (disk/random/main/serial/visual/smoke) as today, and let `e2e_nonvisual` be a parallel aggregate for standing. Avoid double-failure coupling. **Chosen approach:** `e2e` continues to need leaf jobs (unchanged list + unchanged FULL_E2E_LANES). `e2e_nonvisual` is separate for standing.

- [ ] **Step 6: Update workflow assertions in `test/test_ci_contract.mjs`**

Add matches for:

- `name: p2-base`
- `name: e2e nonvisual`
- `name: progression`
- `name: e2e trace-production`
- `test:e2e:trace-production`
- `test:progression`
- mode env `CI_REF_NAME`

- [ ] **Step 7: Run contract tests**

Run: `node test/test_ci_contract.mjs`  
Expected: `ci contract checks passed`

- [ ] **Step 8: Commit**

```bash
git add .github/workflows/ci.yml test/test_ci_contract.mjs tools/ci-contract.mjs
git commit -m "ci: add p2-base aggregate with progression and nonvisual"
```

---

### Task 3: `wait-github-check` + standing profile flip

**Files:**
- Create: `tools/wait-github-check.mjs`
- Modify: `tools/run-round5-standing-gates.mjs`
- Modify: `test/test_engine.js` (standing profile freeze + wait unit tests)
- Modify: `test/test_module_boundaries.mjs` only if it freezes standing script strings

**Interfaces:**
- Produces: `waitGithubCheck({ checkName, sha, timeoutMs, pollMs, sleep, now, runCommand, getGitStatusPorcelain, getHeadSha, getUpstreamSha }) -> { status: 0|1, url?: string }`
- CLI: `node tools/wait-github-check.mjs --check p2-base --timeout-ms 600000`
- `STANDING_GATE_PROFILES['p2-base']` argv list becomes exactly:
  1. `['npm', 'run', 'test:ci']`
  2. `['npm', 'test']`
  3. `['node', 'tools/wait-github-check.mjs', '--check', 'p2-base', '--timeout-ms', '600000']`

- [ ] **Step 1: Write failing standing profile expectation**

In `test/test_engine.js` commands map, change only `p2-base`:

```js
'p2-base': [
  ['npm', 'run', 'test:ci'],
  ['npm', 'test'],
  ['node', 'tools/wait-github-check.mjs', '--check', 'p2-base', '--timeout-ms', '600000'],
],
```

Leave `p2`+ profiles unchanged.

Add a focused unit block importing `waitGithubCheck`:

```js
{
  const { waitGithubCheck } = await import('../tools/wait-github-check.mjs');
  await assert.rejects(
    () => waitGithubCheck({
      checkName: 'p2-base',
      getGitStatusPorcelain: () => ' M src/x.js',
      getHeadSha: () => 'abc',
      getUpstreamSha: () => 'abc',
      runCommand: async () => ({ code: 0, stdout: '', stderr: '' }),
    }),
    /dirty working tree/i,
  );
  await assert.rejects(
    () => waitGithubCheck({
      checkName: 'p2-base',
      getGitStatusPorcelain: () => '',
      getHeadSha: () => 'abc',
      getUpstreamSha: () => 'def',
      runCommand: async () => ({ code: 0, stdout: '', stderr: '' }),
    }),
    /not pushed|upstream/i,
  );
  const ok = await waitGithubCheck({
    checkName: 'p2-base',
    timeoutMs: 1000,
    pollMs: 10,
    now: (() => { let t = 0; return () => { t += 5; return t; }; })(),
    sleep: async () => {},
    getGitStatusPorcelain: () => '',
    getHeadSha: () => 'abc123',
    getUpstreamSha: () => 'abc123',
    runCommand: async (argv) => {
      if (argv[0] === 'gh' && argv.includes('checks')) {
        return {
          code: 0,
          stdout: JSON.stringify([{ name: 'p2-base', state: 'SUCCESS', link: 'https://example/run' }]),
          stderr: '',
        };
      }
      return { code: 0, stdout: '', stderr: '' };
    },
  });
  assert.equal(ok.status, 0);
}
```

- [ ] **Step 2: Run the standing-related tests to see red**

Run: `node --test` is not used; run full `npm test` is heavy. Prefer:

```bash
node -e "import('./test/test_engine.js')" 
```

or comment-local: run `npm test` if no lighter harness exists. Expected: FAIL on profile mismatch / missing module.

- [ ] **Step 3: Implement `tools/wait-github-check.mjs`**

Behaviour:

1. Resolve `HEAD` SHA (`git rev-parse HEAD`)
2. Fail if `git status --porcelain` non-empty
3. Fail if upstream SHA (`git rev-parse @{upstream}`) ≠ HEAD
4. Fail if `gh` missing (`gh --version`)
5. Poll `gh api` or `gh pr checks` / `gh api repos/{owner}/{repo}/commits/{sha}/check-runs` until a check run with **name exactly `p2-base`** is `completed`+`success`, or failed, or `now - start > timeoutMs`
6. Prefer: `gh api repos/:owner/:repo/commits/:sha/check-runs --paginate` and find `name === checkName` (job name `p2-base`)
7. Print URL on success/fail; exit 0/1

Keep functions exported for injection. Default `timeoutMs = 600000`, `pollMs = 15000`.

- [ ] **Step 4: Flip standing profile**

In `tools/run-round5-standing-gates.mjs`:

```js
const WAIT_P2_BASE = command([
  'node', 'tools/wait-github-check.mjs', '--check', 'p2-base', '--timeout-ms', '600000',
]);
// ...
'p2-base': freezeProfile([CI, NODE, WAIT_P2_BASE]),
```

`WAIT_P2_BASE` must have `playwright: false` so no port allocation.

- [ ] **Step 5: Run unit checks**

Run: `npm run test:ci` and ensure the standing block in `npm test` passes. If full `npm test` is required by boundaries, run `npm test`.

Expected: standing profile assertions PASS; waitGithubCheck injection tests PASS.

- [ ] **Step 6: Commit**

```bash
git add tools/wait-github-check.mjs tools/run-round5-standing-gates.mjs test/test_engine.js
git commit -m "feat: wait on GitHub p2-base check for standing"
```

---

### Task 4: Docs and Round 5 plan standing ritual

**Files:**
- Modify: `docs/superpowers/plans/2026-07-10-round5-production-engineering.md` (standing/`p2-base` verify steps only — replace unstaged→staged double local full gate with commit→push→`test:round5:standing`)
- Modify: `docs/README.md` if plan index entry needed
- Optional short note in `AGENTS.md` Cursor Cloud section: Round 5 `p2-base` standing is CI-backed; requires `gh` auth and pushed tip

**Interfaces:**
- Produces: docs matching spec §7 flow; no code behaviour change

- [ ] **Step 1: Patch Round 5 plan Task 11 Step 7 (and any later tasks that copy the same ritual)**

Replace the verify block pattern:

```bash
npm test
npm run test:round5:standing -- --profile p2-base
git add ...
npm run test:round5:standing -- --profile p2-base
git commit -m "..."
```

With:

```bash
npm run test:ci
npm test
git add <exact paths>
git commit -m "..."
git push
npm run test:round5:standing -- --profile p2-base
```

Add one sentence pointing at `docs/superpowers/specs/2026-07-12-p2-base-ci-standing-design.md`.

Search the plan for other `test:round5:standing -- --profile p2-base` double-run rituals and apply the same transformation.

- [ ] **Step 2: Commit**

```bash
git add docs/superpowers/plans/2026-07-10-round5-production-engineering.md docs/README.md AGENTS.md
git commit -m "docs: switch Round 5 p2-base standing to CI wait"
```

---

### Task 5: End-to-end sanity on the continuation branch

**Files:** none (verification only)

- [ ] **Step 1: Push the docs/CI/standing commits** (if not already) to `origin/jamesto/round5-production-engineering-continuation`

- [ ] **Step 2: Confirm CI mode**

On the Draft PR for that branch, open the `changes` job log and expect `CI mode: p2-base`. Confirm jobs `progression`, `e2e trace-production`, `e2e nonvisual`, `p2-base` appear; `e2e visual` does **not** appear.

- [ ] **Step 3: Local standing dry run against a green SHA**

```bash
git status --porcelain  # must be empty
npm run test:round5:standing -- --profile p2-base
```

Expected: local Node runs, then wait script polls until `p2-base` success in **<10 minutes**, ledger line appended under `.superpowers/sdd/progress.md`.

- [ ] **Step 4: Negative checks (manual)**

- Dirty tree → standing fails before `gh`
- Unpushed commit → standing fails

- [ ] **Step 5: Record evidence in the Round 5 ledger / handover note** (SHA, run URL, wall-clock)

No commit required unless adding a short report under `docs/superpowers/reports/`.

---

## Spec coverage self-check

| Spec requirement | Task |
|---|---|
| Local residual = `test:ci` + `npm test` | Task 3 |
| Progression on CI parallel | Task 2 |
| `e2e_nonvisual` + `p2-base` aggregators | Task 2 |
| Exclude visual from `p2-base` | Task 1 mode + Task 2 ifs |
| Round 5 Draft prefix → standing children without visual | Task 1 + 2 |
| Merge `unit`/`e2e` unchanged | Task 2 (`e2e` leaf needs unchanged) |
| Push + `gh` wait on SHA | Task 3 |
| Dirty/unpushed/timeout hard fail | Task 3 |
| Remove unstaged/staged double standing | Task 4 |
| Trace-production under nonvisual fidelity | Task 2 `e2e_trace_production` |
| <10 min timeout | Task 3 `--timeout-ms 600000` |
| Higher profiles unchanged | Task 3 |

## Placeholder scan

None intentional. Implementers must not leave `CI_MODE` ternary ambiguity: for `e2e_nonvisual` job hard-code `CI_MODE=p2-base` as stated in Task 2 Step 5.
