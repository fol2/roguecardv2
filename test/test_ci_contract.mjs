import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
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

assert.equal(resolveCiMode('push', ''), 'full');
assert.equal(resolveCiMode('push', '', 'main'), 'full');
assert.equal(resolveCiMode('pull_request', true), 'smoke');
assert.equal(resolveCiMode('pull_request', true, 'feature/x'), 'smoke');
assert.equal(resolveCiMode('pull_request', 'true'), 'smoke');
assert.equal(resolveCiMode('pull_request', true, 'jamesto/round5-production-engineering-continuation'), 'p2-base');
assert.equal(resolveCiMode('pull_request', false, 'jamesto/round5-x'), 'full');
assert.equal(resolveCiMode('pull_request', false), 'full');
assert.equal(resolveCiMode('pull_request', 'false'), 'full');
assert.throws(() => resolveCiMode('workflow_dispatch', false), /Unsupported CI event/);

assert.deepEqual(requiredCiLanes('unit', false, 'smoke'), ['changes']);
assert.deepEqual(requiredCiLanes('unit', true, 'smoke'), ['changes', 'unit-tests', 'build-dist']);
assert.deepEqual(requiredCiLanes('e2e', true, 'smoke'), ['changes', 'smoke-e2e']);
assert.deepEqual(requiredCiLanes('e2e', true, 'p2-base'), [
  'changes', 'e2e-aux', 'e2e-random', 'e2e-audio', 'e2e-heavy', 'e2e-main',
]);
assert.deepEqual(requiredCiLanes('e2e', true, 'p2-base', { slow: false }), [
  'changes', 'e2e-aux', 'e2e-random', 'e2e-main',
]);
assert.deepEqual(requiredCiLanes('p2-base', true, 'p2-base'), [
  'changes', 'unit', 'e2e-nonvisual', 'progression',
]);
assert.deepEqual(requiredCiLanes('p2-base', true, 'full'), [
  'changes', 'unit', 'e2e-nonvisual', 'progression',
]);
assert.deepEqual(requiredCiLanes('p2-base', false, 'p2-base'), ['changes']);
assert.deepEqual(requiredCiLanes('p2-base', false, 'full'), ['changes']);
assert.throws(() => requiredCiLanes('p2-base', true, 'smoke'), /Unsupported p2-base CI mode/);
assert.throws(() => requiredCiLanes('p2-base', false, 'smoke'), /Unsupported p2-base CI mode/);
assert.deepEqual(requiredCiLanes('e2e', true, 'full'), [
  'changes', 'e2e-aux', 'e2e-random', 'e2e-audio', 'e2e-heavy', 'e2e-main', 'e2e-visual',
]);
assert.deepEqual(requiredCiLanes('e2e', true, 'full', { slow: false }), [
  'changes', 'e2e-aux', 'e2e-random', 'e2e-main', 'e2e-visual',
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
    changes: 'success', 'e2e-aux': 'success', 'e2e-random': 'success',
    'e2e-audio': 'success', 'e2e-heavy': 'success', 'e2e-main': 'success',
    'e2e-visual': 'success',
  },
}).required.length, 7);
assert.deepEqual(verifyCiGate({
  gate: 'e2e', relevant: true, mode: 'p2-base', slow: false,
  results: {
    changes: 'success', 'e2e-aux': 'success', 'e2e-random': 'success',
    'e2e-main': 'success',
  },
}).required, ['changes', 'e2e-aux', 'e2e-random', 'e2e-main']);
assert.deepEqual(verifyCiGate({
  gate: 'p2-base', relevant: true, mode: 'p2-base',
  results: {
    changes: 'success', unit: 'success', 'e2e-nonvisual': 'success', progression: 'success',
  },
}).required, ['changes', 'unit', 'e2e-nonvisual', 'progression']);
assert.deepEqual(verifyCiGate({
  gate: 'p2-base', relevant: true, mode: 'full',
  results: {
    changes: 'success', unit: 'success', 'e2e-nonvisual': 'success', progression: 'success',
  },
}).required, ['changes', 'unit', 'e2e-nonvisual', 'progression']);
assert.throws(() => verifyCiGate({
  gate: 'p2-base', relevant: true, mode: 'smoke',
  results: { changes: 'success' },
}), /Unsupported p2-base CI mode/);
assert.throws(() => verifyCiGate({
  gate: 'p2-base', relevant: false, mode: 'smoke',
  results: { changes: 'success' },
}), /Unsupported p2-base CI mode/);
assert.throws(() => verifyCiGate({
  gate: 'p2-base', relevant: true, mode: 'p2-base',
  results: {
    changes: 'success', unit: 'success', 'e2e-nonvisual': 'success',
  },
}), /progression=missing/);

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

const workflow = readFileSync(new URL('../.github/workflows/ci.yml', import.meta.url), 'utf8');
assert.match(workflow, /CI_REF_NAME: \$\{\{ github\.head_ref \|\| github\.ref_name \}\}/);
assert.match(workflow, /name: p2-base/);
assert.match(workflow, /p2-base:[\s\S]*?if: always\(\) && \(needs\.changes\.outputs\.mode == 'full' \|\| needs\.changes\.outputs\.mode == 'p2-base'\)/);
assert.match(workflow, /name: e2e nonvisual/);
assert.match(workflow, /name: progression/);
assert.match(workflow, /name: e2e aux/);
assert.match(workflow, /npm run test:progression/);
assert.match(workflow, /npm run test:e2e:disk/);
assert.match(workflow, /npm run test:e2e:trace-production/);
assert.match(workflow, /npm run test:e2e:serial/);
assert.match(workflow, /\.\/\.github\/actions\/setup-playwright/);
assert.match(workflow, /ffmpeg-n8\.1\.2-22-g94138f6973-linux64-gpl-8\.1/);
assert.match(workflow, /autobuild-2026-07-11-13-13/);
assert.match(workflow, /e2e_slow:/);
assert.match(workflow, /name: e2e audio \$\{\{ matrix\.shard \}\}\/6/);
assert.match(workflow, /name: e2e heavy \$\{\{ matrix\.shard \}\}\/5/);
assert.match(workflow, /name: e2e main \$\{\{ matrix\.shard \}\}\/15/);
assert.match(workflow, /test:e2e:audio -- --shard=\$\{\{ matrix\.shard \}\}\/6/);
assert.match(workflow, /test:e2e:heavy -- --shard=\$\{\{ matrix\.shard \}\}\/5/);
assert.match(workflow, /SPIREBOUND_E2E_SUITE=main npm run test:e2e:main -- --shard=\$\{\{ matrix\.shard \}\}\/15/);
assert.match(workflow, /fail-fast: true/);
assert.doesNotMatch(workflow, /fail-fast: false/);
assert.match(workflow, /CI_SLOW_RELEVANT/);
assert.match(workflow, /e2e_nonvisual:[\s\S]*?CI_GATE: e2e[\s\S]*?CI_MODE: p2-base/);
assert.match(workflow, /e2e-aux/);
assert.match(workflow, /e2e-audio/);
assert.match(workflow, /e2e-heavy/);
assert.doesNotMatch(workflow, /name: e2e disk/);
assert.doesNotMatch(workflow, /name: e2e serial/);
assert.doesNotMatch(workflow, /name: e2e trace-production/);

const pkg = JSON.parse(readFileSync(new URL('../package.json', import.meta.url), 'utf8'));
assert.equal(pkg.scripts['test:e2e'], 'npm run test:e2e:nonvisual && npm run test:e2e:visual');
assert.equal(pkg.scripts['test:e2e:nonvisual'],
  'npm run test:e2e:disk && npm run test:e2e:random-agent && npm run test:e2e:main && npm run test:e2e:serial');
assert.match(pkg.scripts['test:e2e:audio'], /^playwright test audio /);
assert.match(pkg.scripts['test:e2e:heavy'], /hollow-transaction rewards stage/);
assert.doesNotMatch(pkg.scripts['test:e2e:heavy'], /\baudio\b/);
assert.equal(pkg.scripts['test:boundaries'], 'node test/test_module_boundaries.mjs');
assert.match(pkg.scripts['test:ci'], /npm run test:boundaries/);

const playwright = readFileSync(new URL('../playwright.config.js', import.meta.url), 'utf8');
assert.match(playwright, /SPIREBOUND_E2E_SUITE/);
assert.match(playwright, /E2E_SLOW_SPECS/);

const agents = readFileSync(new URL('../AGENTS.md', import.meta.url), 'utf8');
assert.match(agents, /test:e2e:perf\s+# performance reference; warns on target misses/);
assert.match(agents, /disk-writing[\s\S]*random-agent[\s\S]*main[\s\S]*serial-heavy[\s\S]*visual/);
assert.match(agents, /browser smoke[\s\S]*Draft PRs/);
assert.match(agents, /Ready PRs[\s\S]*complete parallel Playwright gate/);

console.log('ci contract checks passed');
