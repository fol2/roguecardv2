import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const importSpecifiers = (relativePath) => {
  const source = readFileSync(new URL(relativePath, import.meta.url), 'utf8');
  return [...source.matchAll(/^import\b[^\n]*\bfrom\s+['"]([^'"]+)['"];?/gm)]
    .map((match) => match[1]);
};

for (const modulePath of ['../src/engine.js', '../src/vigil.js']) {
  assert.deepEqual(
    importSpecifiers(modulePath),
    ['./data.js'],
    `${modulePath} must import only the Node-safe data module`,
  );
}

const data = await import('../src/data.js');
assert.deepEqual(data.QUEST_STATES, ['dormant', 'armed', 'revealed', 'complete']);
assert.deepEqual(data.QUEST_ACTIVE_STATES, ['armed', 'revealed']);
assert.deepEqual(data.TERMINAL_OUTCOMES, ['win', 'death', 'abandon']);
assert.equal(data.RUN_ID_RE?.test('run-abc-def'), true);
assert.equal(data.RUN_ID_RE?.test('not-a-run'), false);

for (const modulePath of [
  '../src/engine.js',
  '../src/vigil.js',
  '../src/ui.js',
  '../tools/emberglass-pacing.mjs',
]) {
  const source = readFileSync(new URL(modulePath, import.meta.url), 'utf8');
  assert.doesNotMatch(source, /\['armed', 'revealed'\]/, `${modulePath} must use QUEST_ACTIVE_STATES`);
  assert.doesNotMatch(source, /\['win', 'death', 'abandon'\]/, `${modulePath} must use TERMINAL_OUTCOMES`);
}

const engine = readFileSync(new URL('../src/engine.js', import.meta.url), 'utf8');
assert.doesNotMatch(engine, /const plainObject =/, 'loadRun must reuse the module record validator');
assert.doesNotMatch(engine, /const exactKeys =/, 'loadRun must reuse the module exact-key validator');
assert.doesNotMatch(engine, /shadeAspect === 0 \|\|[^\n]*shadeAspect === 1/, 'aspect validation must follow ASPECTS.length');

console.log('module boundary checks passed');
