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
  'changes', 'e2e-disk', 'e2e-random', 'e2e-main', 'e2e-visual',
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
    'e2e-main': 'success', 'e2e-visual': 'success',
  },
}).required.length, 5);

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
