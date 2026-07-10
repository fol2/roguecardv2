# Fast-Feedback and Parallel E2E CI Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Give Draft PR pushes a parallel unit/build/browser result in roughly three minutes while making every Ready PR and `main` push pass the complete Playwright contract through parallel, latest-head shards.

**Architecture:** A dependency-free Node module owns CI mode and aggregator rules so conditional required-check behaviour is locally testable. GitHub Actions evaluates paths and Draft/Ready mode once, then fans unit, build, smoke, disk, random-agent, main, serial-heavy, and visual lanes onto isolated runners; tiny `unit` and `e2e` aggregators preserve the existing branch-protection check names.

**Tech Stack:** GitHub Actions on `ubuntu-24.04`, Node.js 24, npm, Vite, Playwright 1.61, vanilla ESM, `node:assert`.

## Global Constraints

- Preserve required status-check names exactly as `unit` and `e2e`.
- Draft pull requests run smoke mode; Ready pull requests and pushes to `main` run full mode.
- `ready_for_review` and `converted_to_draft` must trigger without a new commit.
- New PR commits cancel stale PR workflow runs; `main` runs are not cancelled.
- Documentation-only changes produce successful no-op aggregators.
- Playwright retries remain zero and each browser process uses at most two workers.
- Disk-writing E2E remains isolated; screenshot refresh remains manual and serial.
- Full CI uses three random-agent shards, ten main shards, one isolated serial-heavy job, and one visual job per canonical project.
- Draft target is at most three minutes and full target is at most eight minutes; timing is warning/reference evidence, never a correctness hard gate.
- Performance FPS/frame-time remains nightly/manual reference evidence and is not part of this workflow change.
- Preserve the existing untracked `scratch/emberglass-phase2-manual-journey.mjs` file and never stage it.
- Do not modify `AGENTS.md`.
- Use UK English in code comments and documentation.

---

**Spec:** `docs/superpowers/specs/2026-07-10-e2e-ci-feedback-design.md`

## File map

| File | Responsibility |
|---|---|
| `tools/ci-contract.mjs` | Pure Draft/Ready mode resolver and required-lane aggregator validation; dependency-free CLI for Actions |
| `test/test_ci_contract.mjs` | Direct assertions for mode, no-op, success, failure, cancelled, skipped, and missing-result cases |
| `package.json` | Reproducible CI-contract, smoke, random shard, main shard, serial-heavy, and visual-project commands |
| `test/e2e/config.spec.js` | Tagged server-contract smoke case |
| `test/e2e/stage.spec.js` | Tagged title/Embark safe-layout smoke case |
| `test/e2e/battle.spec.js` | Tagged combat smoke case and three independent random-agent cases |
| `test/e2e/emberglass.spec.js` | Tagged Rose entrance smoke case |
| `.github/workflows/ci.yml` | Single mode decision, parallel child jobs, exact-name required aggregators, unique failure artifacts |
| `README.md` | Draft versus Ready command and CI contract |
| `docs/README.md` | Spec and plan index |
| `docs/superpowers/reports/2026-07-09-emberglass-phase2-evidence.md` | PR #14 repair and first parallel-CI evidence |

### Task 1: Make CI mode and required-lane rules locally testable

**Files:**
- Create: `tools/ci-contract.mjs`
- Create: `test/test_ci_contract.mjs`
- Modify: `package.json`

**Interfaces:**
- Produces: `resolveCiMode(eventName: string, draftValue: string|boolean): 'smoke'|'full'`.
- Produces: `requiredCiLanes(gate: 'unit'|'e2e', relevant: string|boolean, mode: 'smoke'|'full'): string[]`.
- Produces: `verifyCiGate({ gate, relevant, mode, results }): { required: string[], message: string }` or throws.
- CLI: `node tools/ci-contract.mjs mode` appends `mode=<value>` to `GITHUB_OUTPUT`.
- CLI: `node tools/ci-contract.mjs gate` validates `CI_GATE`, `CI_RELEVANT`, `CI_MODE`, and `CI_RESULTS`.

- [x] **Step 1: Write the failing contract test**

Create `test/test_ci_contract.mjs`:

```js
import assert from 'node:assert/strict';
import {
  resolveCiMode,
  requiredCiLanes,
  verifyCiGate,
} from '../tools/ci-contract.mjs';

assert.equal(resolveCiMode('push', ''), 'full');
assert.equal(resolveCiMode('pull_request', true), 'smoke');
assert.equal(resolveCiMode('pull_request', 'true'), 'smoke');
assert.equal(resolveCiMode('pull_request', false), 'full');
assert.equal(resolveCiMode('pull_request', 'false'), 'full');
assert.throws(() => resolveCiMode('workflow_dispatch', false), /Unsupported CI event/);

assert.deepEqual(requiredCiLanes('unit', false, 'smoke'), ['changes']);
assert.deepEqual(requiredCiLanes('unit', true, 'smoke'), ['changes', 'unit-tests', 'build-dist']);
assert.deepEqual(requiredCiLanes('e2e', true, 'smoke'), ['changes', 'smoke-e2e']);
assert.deepEqual(requiredCiLanes('e2e', true, 'full'), [
  'changes', 'e2e-disk', 'e2e-random', 'e2e-main', 'e2e-serial', 'e2e-visual',
]);

assert.deepEqual(verifyCiGate({
  gate: 'unit', relevant: false, mode: 'smoke', results: { changes: 'success' },
}).required, ['changes']);
assert.deepEqual(verifyCiGate({
  gate: 'e2e', relevant: true, mode: 'smoke',
  results: { changes: 'success', 'smoke-e2e': 'success' },
}).required, ['changes', 'smoke-e2e']);
assert.deepEqual(verifyCiGate({
  gate: 'e2e', relevant: true, mode: 'full',
  results: {
    changes: 'success', 'e2e-disk': 'success', 'e2e-random': 'success',
    'e2e-main': 'success', 'e2e-serial': 'success', 'e2e-visual': 'success',
  },
}).required.length, 6);

for (const result of ['failure', 'cancelled', 'skipped', undefined]) {
  assert.throws(() => verifyCiGate({
    gate: 'e2e', relevant: true, mode: 'smoke',
    results: { changes: 'success', 'smoke-e2e': result },
  }), /smoke-e2e/);
}
assert.throws(() => verifyCiGate({
  gate: 'unit', relevant: true, mode: 'full',
  results: { changes: 'success', 'unit-tests': 'success', 'build-dist': 'failure' },
}), /build-dist=failure/);
assert.throws(() => requiredCiLanes('e2e', true, 'unknown'), /Unsupported CI mode/);

console.log('ci contract checks passed');
```

- [x] **Step 2: Add the red test command and run it**

Add this script before `build` in `package.json`:

```json
"test:ci": "node test/test_ci_contract.mjs"
```

Run: `npm run test:ci`
Expected: FAIL with `ERR_MODULE_NOT_FOUND` for `tools/ci-contract.mjs`.

- [x] **Step 3: Implement the dependency-free contract module**

Create `tools/ci-contract.mjs`:

```js
import { appendFileSync } from 'node:fs';
import { pathToFileURL } from 'node:url';

const UNIT_LANES = ['changes', 'unit-tests', 'build-dist'];
const SMOKE_LANES = ['changes', 'smoke-e2e'];
const FULL_E2E_LANES = ['changes', 'e2e-disk', 'e2e-random', 'e2e-main', 'e2e-serial', 'e2e-visual'];

const truthy = (value) => value === true || String(value).toLowerCase() === 'true';

export function resolveCiMode(eventName, draftValue) {
  if (eventName === 'push') return 'full';
  if (eventName === 'pull_request') return truthy(draftValue) ? 'smoke' : 'full';
  throw new Error(`Unsupported CI event: ${eventName}`);
}

export function requiredCiLanes(gate, relevant, mode) {
  if (!truthy(relevant)) return ['changes'];
  if (gate === 'unit') return [...UNIT_LANES];
  if (gate !== 'e2e') throw new Error(`Unsupported CI gate: ${gate}`);
  if (mode === 'smoke') return [...SMOKE_LANES];
  if (mode === 'full') return [...FULL_E2E_LANES];
  throw new Error(`Unsupported CI mode: ${mode}`);
}

export function verifyCiGate({ gate, relevant, mode, results }) {
  const required = requiredCiLanes(gate, relevant, mode);
  const failed = required
    .filter((lane) => results[lane] !== 'success')
    .map((lane) => `${lane}=${results[lane] ?? 'missing'}`);
  if (failed.length) throw new Error(`${gate} gate incomplete: ${failed.join(', ')}`);
  const message = required.length === 1
    ? `${gate} gate: no relevant changes`
    : `${gate} gate: ${required.slice(1).join(', ')} passed`;
  return { required, message };
}

function runCli() {
  const command = process.argv[2];
  if (command === 'mode') {
    const mode = resolveCiMode(process.env.GITHUB_EVENT_NAME, process.env.PR_DRAFT);
    if (!process.env.GITHUB_OUTPUT) throw new Error('GITHUB_OUTPUT is required');
    appendFileSync(process.env.GITHUB_OUTPUT, `mode=${mode}\n`);
    console.log(`CI mode: ${mode}`);
    return;
  }
  if (command === 'gate') {
    const result = verifyCiGate({
      gate: process.env.CI_GATE,
      relevant: process.env.CI_RELEVANT,
      mode: process.env.CI_MODE,
      results: JSON.parse(process.env.CI_RESULTS || '{}'),
    });
    console.log(result.message);
    return;
  }
  throw new Error(`Usage: node tools/ci-contract.mjs <mode|gate>`);
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  runCli();
}
```

- [x] **Step 4: Verify the contract**

Run: `npm run test:ci`
Expected: PASS ending `ci contract checks passed`.

- [x] **Step 5: Commit the contract checkpoint**

```bash
git add package.json test/test_ci_contract.mjs tools/ci-contract.mjs
git commit -m "Test the Draft and Ready CI contract"
```

### Task 2: Define the smoke subset and shardable random coverage

**Files:**
- Modify: `package.json`
- Modify: `test/e2e/config.spec.js`
- Modify: `test/e2e/stage.spec.js`
- Modify: `test/e2e/battle.spec.js`
- Modify: `test/e2e/emberglass.spec.js`

**Interfaces:**
- Produces: Playwright tag `@smoke` on four existing high-signal cases.
- Produces: three tests whose names start `random-agent mini-run:`.
- Produces commands: `test:e2e:smoke`, shardable `test:e2e:random-agent`, shardable `test:e2e:main`, and `test:e2e:visual:project`.

- [x] **Step 1: Add scripts that expose the missing contracts**

Add these scripts while preserving the existing serial `test:e2e` command:

```json
"test:e2e:smoke": "playwright test --project=desktop --no-deps --grep @smoke --workers=2",
"test:e2e:visual:project": "playwright test visual --workers=1 --no-deps"
```

Run: `npm run test:e2e:smoke -- --list`
Expected: FAIL because no tests match `@smoke`.

- [x] **Step 2: Tag exactly four smoke cases**

Change only the declarations for these existing tests by inserting the
Playwright details object `{ tag: '@smoke' }`:

```js
test('the default E2E server remains compatible with local development', { tag: '@smoke' }, () => {
test('title and embark screens fit their stage: no scrollable overflow anywhere', { tag: '@smoke' }, async ({ page }) => {
test('opening state is coherent', { tag: '@smoke' }, async ({ page }) => {
test('one shard adds a title medallion that opens the Rose', { tag: '@smoke' }, async ({ page }) => {
```

Run: `npm run test:e2e:smoke -- --list`
Expected: exactly four desktop tests listed.

- [x] **Step 3: Split the random-agent loop into independent cases**

Replace the existing single `random-agent mini-run: three fights, zero
playback errors` test with:

```js
const RANDOM_AGENT_FIGHTS = [
  { name: 'sporeling pair', ids: ['sporeling', 'sporeling'] },
  { name: 'duskfang and sporeling', ids: ['duskfang', 'sporeling'] },
  { name: 'gloomslime', ids: ['gloomslime'] },
];

for (const scenario of RANDOM_AGENT_FIGHTS) {
  test(`random-agent mini-run: ${scenario.name}`, async ({ page }) => {
    test.setTimeout(240_000);
    const errors = collectErrors(page);
    await boot(page);
    await startFight(page, scenario.ids);
    const outcome = await page.evaluate(async () => {
      const p = window.__probe;
      for (let turn = 0; turn < 40; turn++) {
        let st = p.state();
        if (st.screen !== 'combat' || st.over) break;
        let played = true;
        while (played) {
          st = p.state();
          if (st.screen !== 'combat' || st.over) break;
          played = false;
          const target = st.enemies.findIndex((enemy) => enemy.hp > 0);
          for (const card of st.hand) {
            if (await p.play(card.uid, target)) {
              played = true;
              break;
            }
          }
        }
        st = p.state();
        if (st.screen !== 'combat' || st.over) break;
        await p.endTurn();
      }
      return p.state();
    });
    expect(
      outcome.screen === 'combat' && !outcome.over,
      'fight must reach a terminal state',
    ).toBe(false);
    expectNoErrors(errors, `mini-run fight vs ${scenario.ids.join('+')}`);
  });
}
```

- [x] **Step 4: Verify every shard selects useful work**

Run:

```bash
npm run test:e2e:random-agent -- --list
npm run test:e2e:random-agent -- --list --shard=1/3
npm run test:e2e:random-agent -- --list --shard=2/3
npm run test:e2e:random-agent -- --list --shard=3/3
npm run test:e2e:main -- --list --shard=1/10
npm run test:e2e:main -- --list --shard=2/10
npm run test:e2e:main -- --list --shard=3/10
npm run test:e2e:main -- --list --shard=4/10
npm run test:e2e:main -- --list --shard=5/10
npm run test:e2e:main -- --list --shard=6/10
npm run test:e2e:main -- --list --shard=7/10
npm run test:e2e:main -- --list --shard=8/10
npm run test:e2e:main -- --list --shard=9/10
npm run test:e2e:main -- --list --shard=10/10
```

Expected: three random tests overall, one in each random shard, and at least
one non-visual test in every main shard.

- [x] **Step 5: Run the new fast cases**

Run:

```bash
SPIREBOUND_E2E_PORT=5210 npm run test:e2e:smoke
SPIREBOUND_E2E_PORT=5211 npm run test:e2e:random-agent
```

Expected: four smoke tests and three random-agent tests pass with no retries.

- [x] **Step 6: Commit the browser partition checkpoint**

```bash
git add package.json src/styles.css test/e2e/config.spec.js test/e2e/stage.spec.js \
  test/e2e/battle.spec.js test/e2e/emberglass-fixtures.js \
  test/e2e/emberglass.spec.js test/e2e/helpers.js dist/index.html dist/assets
git commit -m "Stabilise and partition Phase 2 Playwright coverage"
```

Execution note: the already-approved PR #14 Linux stability repair overlapped
the tagged battle, stage, and Emberglass specs. It was included with its
helpers, opacity-only Vigil entrance fix, and rebuilt `dist/` in `d6d0ffc` so
this checkpoint remains independently buildable.

### Task 3: Replace serial GitHub CI with Draft/Ready parallel gates

**Files:**
- Modify: `.github/workflows/ci.yml`

**Interfaces:**
- Consumes: `node tools/ci-contract.mjs mode|gate` from Task 1.
- Consumes: the package scripts and three random-agent cases from Task 2.
- Produces: required aggregator checks named exactly `unit` and `e2e`.

- [x] **Step 1: Replace `.github/workflows/ci.yml` with the approved topology**

Use these exact triggers, decisions, lanes, matrices, and aggregator result
maps:

```yaml
name: ci

on:
  push:
    branches: [main]
  pull_request:
    types: [opened, reopened, synchronize, ready_for_review, converted_to_draft]

permissions:
  contents: read

concurrency:
  group: ci-${{ github.event.pull_request.number || github.ref }}
  cancel-in-progress: ${{ github.event_name == 'pull_request' }}

jobs:
  changes:
    name: changes
    runs-on: ubuntu-24.04
    timeout-minutes: 5
    outputs:
      code: ${{ steps.filter.outputs.code }}
      e2e: ${{ steps.filter.outputs.e2e }}
      mode: ${{ steps.mode.outputs.mode }}
    steps:
      - uses: actions/checkout@9c091bb21b7c1c1d1991bb908d89e4e9dddfe3e0 # v7.0.0
        with:
          persist-credentials: false
          fetch-depth: 0
      - id: filter
        uses: dorny/paths-filter@7b450fff21473bca461d4b92ce414b9d0420d706 # v4.0.2
        with:
          filters: |
            code:
              - 'src/**'
              - 'test/**'
              - 'tools/**'
              - 'index.html'
              - 'public/**'
              - 'package.json'
              - 'package-lock.json'
              - 'playwright*.js'
              - 'vite.config.js'
              - '.github/workflows/ci.yml'
            e2e:
              - 'src/**'
              - 'test/e2e/**'
              - 'index.html'
              - 'public/**'
              - 'package.json'
              - 'package-lock.json'
              - 'playwright*.js'
              - 'vite.config.js'
              - '.github/workflows/ci.yml'
      - id: mode
        run: node tools/ci-contract.mjs mode
        env:
          PR_DRAFT: ${{ github.event.pull_request.draft }}

  unit_tests:
    name: unit tests
    needs: changes
    if: needs.changes.outputs.code == 'true'
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
      - name: Install ffmpeg 8.1 (matches the dev machine)
        run: |
          cd /tmp
          curl -fsSLO https://github.com/BtbN/FFmpeg-Builds/releases/download/latest/ffmpeg-n8.1-latest-linux64-gpl-8.1.tar.xz
          curl -fsSL https://github.com/BtbN/FFmpeg-Builds/releases/download/latest/checksums.sha256 \
            | grep 'ffmpeg-n8.1-latest-linux64-gpl-8.1.tar.xz$' > ffmpeg.sha256
          sha256sum -c ffmpeg.sha256
          tar -xJf ffmpeg-n8.1-latest-linux64-gpl-8.1.tar.xz
          sudo install -m 755 ffmpeg-n8.1-latest-linux64-gpl-8.1/bin/ffmpeg /usr/local/bin/ffmpeg
          sudo install -m 755 ffmpeg-n8.1-latest-linux64-gpl-8.1/bin/ffprobe /usr/local/bin/ffprobe
          rm -rf ffmpeg-n8.1-latest-linux64-gpl-8.1.tar.xz ffmpeg.sha256 ffmpeg-n8.1-latest-linux64-gpl-8.1
      - run: npm run test:ci
      - run: npm test

  build_dist:
    name: build dist
    needs: changes
    if: needs.changes.outputs.code == 'true'
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
      - run: npm run build
      - name: Verify committed dist is current
        run: |
          git status --short -- dist/
          test -z "$(git status --porcelain --untracked-files=all -- dist/)"

  unit:
    name: unit
    if: always()
    needs: [changes, unit_tests, build_dist]
    runs-on: ubuntu-24.04
    timeout-minutes: 5
    steps:
      - uses: actions/checkout@9c091bb21b7c1c1d1991bb908d89e4e9dddfe3e0 # v7.0.0
        with:
          persist-credentials: false
      - run: node tools/ci-contract.mjs gate
        env:
          CI_GATE: unit
          CI_RELEVANT: ${{ needs.changes.outputs.code }}
          CI_MODE: ${{ needs.changes.outputs.mode }}
          CI_RESULTS: >-
            {"changes":"${{ needs.changes.result }}","unit-tests":"${{ needs.unit_tests.result }}","build-dist":"${{ needs.build_dist.result }}"}

  smoke_e2e:
    name: e2e smoke
    needs: changes
    if: needs.changes.outputs.e2e == 'true' && needs.changes.outputs.mode == 'smoke'
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
      - run: npm run test:e2e:smoke
      - name: Verify clean checkout
        if: always()
        run: test -z "$(git status --porcelain --untracked-files=all)"
      - uses: actions/upload-artifact@043fb46d1a93c77aae656e7c1c64a875d1fc6a0a # v7.0.1
        if: failure()
        with:
          name: playwright-smoke-${{ github.run_id }}
          path: test-results/
          retention-days: 14
          if-no-files-found: ignore

  e2e_disk:
    name: e2e disk
    needs: changes
    if: needs.changes.outputs.e2e == 'true' && needs.changes.outputs.mode == 'full'
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
      - run: npm run test:e2e:disk
      - name: Verify e2e restored the checkout
        if: always()
        run: test -z "$(git status --porcelain --untracked-files=all)"
      - uses: actions/upload-artifact@043fb46d1a93c77aae656e7c1c64a875d1fc6a0a # v7.0.1
        if: failure()
        with:
          name: playwright-disk-${{ github.run_id }}
          path: test-results/
          retention-days: 14
          if-no-files-found: ignore

  e2e_random:
    name: e2e random ${{ matrix.shard }}/3
    needs: changes
    if: needs.changes.outputs.e2e == 'true' && needs.changes.outputs.mode == 'full'
    strategy:
      fail-fast: false
      matrix:
        shard: [1, 2, 3]
    runs-on: ubuntu-24.04
    timeout-minutes: 12
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
      - run: npm run test:e2e:random-agent -- --shard=${{ matrix.shard }}/3
      - name: Verify clean checkout
        if: always()
        run: test -z "$(git status --porcelain --untracked-files=all)"
      - uses: actions/upload-artifact@043fb46d1a93c77aae656e7c1c64a875d1fc6a0a # v7.0.1
        if: failure()
        with:
          name: playwright-random-${{ matrix.shard }}-${{ github.run_id }}
          path: test-results/
          retention-days: 14
          if-no-files-found: ignore

  e2e_main:
    name: e2e main ${{ matrix.shard }}/10
    needs: changes
    if: needs.changes.outputs.e2e == 'true' && needs.changes.outputs.mode == 'full'
    strategy:
      fail-fast: false
      matrix:
        shard: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
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
      - run: npx playwright install --with-deps chromium
      - run: npm run test:e2e:main -- --shard=${{ matrix.shard }}/10
      - name: Verify clean checkout
        if: always()
        run: test -z "$(git status --porcelain --untracked-files=all)"
      - uses: actions/upload-artifact@043fb46d1a93c77aae656e7c1c64a875d1fc6a0a # v7.0.1
        if: failure()
        with:
          name: playwright-main-${{ matrix.shard }}-${{ github.run_id }}
          path: test-results/
          retention-days: 14
          if-no-files-found: ignore

  e2e_visual:
    name: e2e visual ${{ matrix.project }}
    needs: changes
    if: needs.changes.outputs.e2e == 'true' && needs.changes.outputs.mode == 'full'
    strategy:
      fail-fast: false
      matrix:
        project: [desktop, portrait, landscape]
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
      - run: npx playwright install --with-deps chromium
      - run: npm run test:e2e:visual:project -- --project=${{ matrix.project }}
      - name: Verify clean checkout
        if: always()
        run: test -z "$(git status --porcelain --untracked-files=all)"
      - uses: actions/upload-artifact@043fb46d1a93c77aae656e7c1c64a875d1fc6a0a # v7.0.1
        if: failure()
        with:
          name: playwright-visual-${{ matrix.project }}-${{ github.run_id }}
          path: test-results/
          retention-days: 14
          if-no-files-found: ignore

  e2e:
    name: e2e
    if: always()
    needs: [changes, smoke_e2e, e2e_disk, e2e_random, e2e_main, e2e_serial, e2e_visual]
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
          CI_MODE: ${{ needs.changes.outputs.mode }}
          CI_RESULTS: >-
            {"changes":"${{ needs.changes.result }}","smoke-e2e":"${{ needs.smoke_e2e.result }}","e2e-disk":"${{ needs.e2e_disk.result }}","e2e-random":"${{ needs.e2e_random.result }}","e2e-main":"${{ needs.e2e_main.result }}","e2e-serial":"${{ needs.e2e_serial.result }}","e2e-visual":"${{ needs.e2e_visual.result }}"}
```

- [x] **Step 2: Parse and inspect the workflow locally**

Run:

```bash
yq eval '.' .github/workflows/ci.yml >/dev/null
rg -n '^  (unit|e2e):|name: (unit|e2e)$|fail-fast: false|ready_for_review|converted_to_draft' .github/workflows/ci.yml
```

Expected: YAML parses; exactly one aggregator named `unit`, exactly one named
`e2e`, both PR state-change triggers exist, and every full matrix disables
fail-fast.

- [x] **Step 3: Exercise aggregator CLI success and failure**

Run:

```bash
CI_GATE=e2e CI_RELEVANT=true CI_MODE=smoke \
CI_RESULTS='{"changes":"success","smoke-e2e":"success"}' \
node tools/ci-contract.mjs gate

! CI_GATE=e2e CI_RELEVANT=true CI_MODE=full \
CI_RESULTS='{"changes":"success","e2e-disk":"success","e2e-random":"success","e2e-main":"failure","e2e-serial":"success","e2e-visual":"success"}' \
node tools/ci-contract.mjs gate
```

Expected: smoke prints a passed message; the synthetic full failure exits
non-zero naming `e2e-main=failure`.

- [x] **Step 4: Commit the workflow checkpoint**

```bash
git add .github/workflows/ci.yml
git commit -m "Parallelise Draft and Ready CI gates"
```

### Task 4: Document, verify, and measure the change

**Files:**
- Modify: `README.md`
- Modify: `docs/README.md`
- Track: `docs/superpowers/specs/2026-07-10-e2e-ci-feedback-design.md`
- Track: `docs/superpowers/plans/2026-07-10-e2e-ci-feedback.md`
- Modify: `docs/superpowers/reports/2026-07-09-emberglass-phase2-evidence.md`

**Interfaces:**
- Produces: operator-facing Draft/Ready contract and exact reproduction commands.
- Produces: first GitHub full-run timing evidence for the new topology.

- [x] **Step 1: Update root README operational commands**

Add after the existing E2E command block:

```markdown
CI uses two pull-request modes. Draft pushes run `npm test`, `npm run build`,
and `npm run test:e2e:smoke` in parallel. Marking a PR Ready for review runs
the complete Playwright gate across isolated random-agent, main, serial-heavy,
visual, and disk-writing jobs; later Ready pushes rerun that full gate. `npm run test:e2e`
remains the complete serial local equivalent. CI wall-clock targets are
warnings, not correctness gates.
```

- [x] **Step 2: Index the plan next to the spec**

Add this row to `docs/README.md` immediately after the E2E CI design row:

```markdown
| [`superpowers/plans/2026-07-10-e2e-ci-feedback.md`](superpowers/plans/2026-07-10-e2e-ci-feedback.md) | Executor plan — CI contract, smoke tags, shardable random coverage, and parallel GitHub gate |
```

- [x] **Step 3: Run the complete local verification**

Run:

```bash
npm run test:ci
npm test
npm run build
git diff --check
yq eval '.' .github/workflows/ci.yml >/dev/null
SPIREBOUND_E2E_PORT=5210 npm run test:e2e:smoke
SPIREBOUND_E2E_PORT=5211 npm run test:e2e:random-agent
for shard in 1 2 3 4 5 6 7 8 9 10; do
  SPIREBOUND_E2E_PORT=$((5211 + shard)) npm run test:e2e:main -- --shard=$shard/10
done
SPIREBOUND_E2E_PORT=5220 npm run test:e2e:serial
for project in desktop portrait landscape; do
  case "$project" in
    desktop) port=5216 ;;
    portrait) port=5217 ;;
    landscape) port=5218 ;;
  esac
  SPIREBOUND_E2E_PORT=$port npm run test:e2e:visual:project -- --project=$project
done
```

Expected: every command exits zero; the ten main shards plus serial-heavy
lane collectively cover the same non-visual test set; the three visual jobs collectively cover all 48
Linux baseline comparisons.

- [x] **Step 4: Rebuild twice and verify deterministic tracked output**

Run:

```bash
npm run build
find dist -type f -print0 | sort -z | xargs -0 shasum -a 256 > /tmp/spirebound-dist-1.sha256
npm run build
find dist -type f -print0 | sort -z | xargs -0 shasum -a 256 > /tmp/spirebound-dist-2.sha256
diff -u /tmp/spirebound-dist-1.sha256 /tmp/spirebound-dist-2.sha256
```

Expected: both builds pass and the hash diff is empty.

- [x] **Step 5: Record local evidence and commit exact paths**

Append the commands, counts, durations, and pending GitHub measurement to the
Phase 2 evidence report. Then run:

```bash
git add README.md docs/README.md \
  docs/superpowers/specs/2026-07-10-e2e-ci-feedback-design.md \
  docs/superpowers/plans/2026-07-10-e2e-ci-feedback.md \
  docs/superpowers/reports/2026-07-09-emberglass-phase2-evidence.md \
  dist/index.html dist/assets
git commit -m "Document and verify fast-feedback CI"
```

Never stage `scratch/emberglass-phase2-manual-journey.mjs`.

- [x] **Step 6: Push PR #14 and measure the Ready/full run**

```bash
git push origin codex/emberglass-phase2
gh pr checks 14 --watch --interval 10
```

Expected: required `unit` and `e2e` aggregators pass on the pushed head. Record
each child lane duration, total wall-clock duration, and whether the 8-minute
target was met. A duration miss is a warning; any failed child lane is a hard
blocker to diagnose and fix.

Actual: Ready/full run `29124111872` passed at head `2412b17` in 9m28s.
The eight-minute target was missed by 1m28s, below the ten-minute warning
threshold and therefore recorded as timing reference rather than a blocker.

## Self-review record

- Spec coverage: every trigger, mode, shard, aggregator, no-op, artifact,
  timing, rollback, and performance-reference requirement maps to Tasks 1–4.
- Placeholder scan: no `TBD`, `TODO`, deferred error-handling instruction, or
  unnamed test step remains.
- Interface consistency: lane keys in `tools/ci-contract.mjs`, its tests, and
  workflow `CI_RESULTS` maps are exactly `changes`, `unit-tests`, `build-dist`,
  `smoke-e2e`, `e2e-disk`, `e2e-random`, `e2e-main`, `e2e-serial`, and `e2e-visual`.
