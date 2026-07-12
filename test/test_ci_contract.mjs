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
  'changes', 'e2e-disk', 'e2e-random', 'e2e-main', 'e2e-serial', 'e2e-trace-production',
]);
assert.deepEqual(requiredCiLanes('p2-base', true, 'p2-base'), [
  'changes', 'unit', 'e2e-nonvisual', 'progression',
]);
assert.deepEqual(requiredCiLanes('p2-base', false, 'p2-base'), ['changes']);
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
assert.deepEqual(verifyCiGate({
  gate: 'p2-base', relevant: true, mode: 'p2-base',
  results: {
    changes: 'success', unit: 'success', 'e2e-nonvisual': 'success', progression: 'success',
  },
}).required, ['changes', 'unit', 'e2e-nonvisual', 'progression']);
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
assert.match(workflow, /name: e2e main \$\{\{ matrix\.shard \}\}\/10/);
assert.match(workflow, /shard: \[1, 2, 3, 4, 5, 6, 7, 8, 9, 10\]/);
assert.match(workflow, /test:e2e:main -- --shard=\$\{\{ matrix\.shard \}\}\/10/);
assert.match(workflow, /e2e_serial:[\s\S]*?name: e2e serial[\s\S]*?npm run test:e2e:serial/);

const pkg = JSON.parse(readFileSync(new URL('../package.json', import.meta.url), 'utf8'));
assert.equal(pkg.scripts['test:e2e'], 'npm run test:e2e:nonvisual && npm run test:e2e:visual');
assert.equal(pkg.scripts['test:e2e:nonvisual'],
  'npm run test:e2e:disk && npm run test:e2e:random-agent && npm run test:e2e:main && npm run test:e2e:serial');
assert.equal(pkg.scripts['test:boundaries'], 'node test/test_module_boundaries.mjs');
assert.match(pkg.scripts['test:ci'], /npm run test:boundaries/);

const agents = readFileSync(new URL('../AGENTS.md', import.meta.url), 'utf8');
assert.match(agents, /test:e2e:perf\s+# performance reference; warns on target misses/);
assert.match(agents, /disk-writing[\s\S]*random-agent[\s\S]*main[\s\S]*serial-heavy[\s\S]*visual/);
assert.match(agents, /browser smoke[\s\S]*Draft PRs/);
assert.match(agents, /Ready PRs[\s\S]*complete parallel Playwright gate/);

console.log('ci contract checks passed');
