// Unit coverage for tools/affected-specs.mjs — fake graphs for rules, live
// smoke against the real src/ tree for graph size + curated-map freshness.
import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
import {
  TOUCHPOINT_MAP,
  buildImportGraph,
  impactSet,
  matchTouchpoints,
  selectPlan,
  runPlan,
  isWatchIgnored,
} from '../tools/affected-specs.mjs';

function fakeGraph(edges) {
  // edges: { importer: [imported, ...] }
  const forward = new Map();
  const reverse = new Map();
  const ensure = (map, key) => {
    if (!map.has(key)) map.set(key, new Set());
    return map.get(key);
  };
  for (const [from, tos] of Object.entries(edges)) {
    ensure(forward, from);
    ensure(reverse, from);
    for (const to of tos) {
      ensure(forward, from).add(to);
      ensure(reverse, to).add(from);
      ensure(forward, to);
    }
  }
  return { forward, reverse, nodes: [...forward.keys()].sort() };
}

{
  // Reverse transitive closure: leaf → mid → top
  const g = fakeGraph({
    'src/ui/index.js': ['src/engine.js', 'src/ui/drain.js'],
    'src/ui/drain.js': ['src/engine.js'],
    'src/main.js': ['src/ui.js'],
    'src/ui.js': ['src/ui/index.js'],
    'src/engine.js': ['src/data.js'],
    'src/data.js': [],
  });
  const fromEngine = impactSet(['src/engine.js'], g.reverse);
  assert.equal(fromEngine.has('src/engine.js'), true);
  assert.equal(fromEngine.has('src/ui/drain.js'), true);
  assert.equal(fromEngine.has('src/ui/index.js'), true);
  assert.equal(fromEngine.has('src/ui.js'), true);
  assert.equal(fromEngine.has('src/main.js'), true);
  assert.equal(fromEngine.has('src/data.js'), false, 'importers only — not callees');

  const fromData = impactSet(['src/data.js'], g.reverse);
  assert.equal(fromData.has('src/engine.js'), true);
  assert.equal(fromData.has('src/main.js'), true);
}

{
  // (a) changed e2e spec → that spec only
  const g = fakeGraph({ 'src/engine.js': [] });
  const plan = selectPlan(['test/e2e/rewards.spec.js'], { graph: g });
  assert.equal(plan.fullSuiteFor, null);
  assert.deepEqual(plan.specs, ['test/e2e/rewards.spec.js']);
  assert.equal(plan.npmTest, false);
  assert.equal(plan.testCi, false);
}

{
  // (a) unit test / helper → npm test + test:ci
  const g = fakeGraph({ 'src/engine.js': [] });
  const unit = selectPlan(['test/test_engine.js'], { graph: g });
  assert.equal(unit.npmTest, true);
  assert.equal(unit.testCi, true);
  assert.deepEqual(unit.commands.slice(0, 2), ['npm test', 'npm run test:ci']);

  const helper = selectPlan(['test/e2e/helpers.js'], { graph: g });
  assert.equal(helper.npmTest, true);
  assert.equal(helper.testCi, true);
}

{
  // (b) engine core / packs → npm test + battle + stage
  const g = fakeGraph({
    'src/ui/index.js': ['src/engine.js'],
    'src/engine.js': ['src/data.js'],
    'src/data.js': [],
    'src/packs/core/cards.js': [],
  });
  const plan = selectPlan(['src/engine.js'], { graph: g });
  assert.equal(plan.npmTest, true);
  assert.ok(plan.specs.includes('test/e2e/battle.spec.js'));
  assert.ok(plan.specs.includes('test/e2e/stage.spec.js'));
  assert.equal(plan.commands[0], 'npm test');

  const packs = selectPlan(['src/packs/core/cards.js'], { graph: g });
  assert.equal(packs.npmTest, true);
  assert.ok(packs.specs.includes('test/e2e/battle.spec.js'));
}

{
  // (c) curated touchpoint — rewards screen
  const g = fakeGraph({
    'src/ui/screens/reward.js': [],
  });
  const plan = selectPlan(['src/ui/screens/reward.js'], { graph: g });
  assert.equal(plan.fullSuiteFor, null);
  assert.ok(plan.specs.includes('test/e2e/rewards.spec.js'));
  assert.equal(plan.npmTest, false);

  const audio = selectPlan(['src/audio.js'], {
    graph: fakeGraph({ 'src/audio.js': [] }),
  });
  assert.deepEqual(audio.specs, ['test/e2e/audio.spec.js']);

  const bf = selectPlan(['src/battlefield.js'], {
    graph: fakeGraph({ 'src/battlefield.js': [] }),
  });
  assert.ok(bf.specs.includes('test/e2e/bfeditor.spec.js'));
  assert.ok(bf.specs.includes('test/e2e/battle.spec.js'));

  const chrome = selectPlan(['src/ui-chrome-layout.js'], {
    graph: fakeGraph({ 'src/ui-chrome-layout.js': [] }),
  });
  assert.deepEqual(chrome.specs, ['test/e2e/bfuieditor.spec.js']);

  const stage = selectPlan(['src/stage.js'], {
    graph: fakeGraph({ 'src/stage.js': [] }),
  });
  assert.ok(stage.specs.includes('test/e2e/geometry.spec.js'));
  assert.ok(stage.specs.includes('test/e2e/visual.spec.js'));

  const dev = selectPlan(['src/dev/hub.js'], {
    graph: fakeGraph({ 'src/dev/hub.js': [] }),
  });
  assert.ok(dev.specs.includes('test/e2e/dev-tools.spec.js'));
  assert.ok(dev.specs.includes('test/e2e/lab.spec.js'));
  assert.ok(dev.specs.includes('test/e2e/sim-lab.spec.js'));

  const trace = selectPlan(['src/ui/behaviour-trace.js'], {
    graph: fakeGraph({ 'src/ui/behaviour-trace.js': [] }),
  });
  assert.ok(trace.specs.includes('test/e2e/trace.spec.js'));
}

{
  // (d) FULL SUITE fallback — unmapped src + outside src/test
  const g = fakeGraph({ 'src/engine.js': [] });
  const outside = selectPlan(['vite.config.js'], { graph: g });
  assert.equal(outside.fullSuiteFor, 'vite.config.js');
  assert.deepEqual(outside.commands, ['FULL SUITE REQUIRED (vite.config.js)']);
  assert.equal(outside.npmTest, false);
  assert.deepEqual(outside.specs, []);

  const docsOnly = selectPlan(['AGENTS.md', 'docs/README.md'], { graph: g });
  assert.equal(docsOnly.fullSuiteFor, null);
  assert.deepEqual(docsOnly.commands, []);

  const unmapped = selectPlan(['src/no-such-module-zzz.js'], {
    graph: fakeGraph({ 'src/no-such-module-zzz.js': [] }),
    touchpoints: [['src/audio', ['test/e2e/audio.spec.js']]],
  });
  assert.equal(unmapped.fullSuiteFor, 'src/no-such-module-zzz.js');
  assert.match(unmapped.commands[0], /^FULL SUITE REQUIRED/);
}

{
  // Longest-prefix touchpoint wins
  assert.deepEqual(
    matchTouchpoints('src/ui/screens/reward.js'),
    ['test/e2e/rewards.spec.js'],
  );
}

{
  // Live smoke against the real tree
  const g = buildImportGraph();
  assert.ok(g.nodes.length > 30, `expected >30 src modules, got ${g.nodes.length}`);
  const fromEngine = impactSet(['src/engine.js'], g.reverse);
  assert.ok(
    fromEngine.has('src/ui/index.js') || fromEngine.has('src/ui.js'),
    'engine impact must reach the UI entry',
  );
  for (const [prefix, specs] of TOUCHPOINT_MAP) {
    for (const spec of specs) {
      assert.ok(existsSync(spec), `stale touchpoint ${prefix} → missing ${spec}`);
    }
  }
}

{
  // Over-selection regression: curated map + FULL fallback are CHANGED-only;
  // impact feeds rule (b) only (composition roots must not cascade touchpoints).
  assert.ok(existsSync('src/ui/screens/reward.js'), 'reward screen must exist');
  assert.ok(existsSync('src/packs/core/cards.js'), 'cards pack must exist');
  const g = buildImportGraph();

  const reward = selectPlan(['src/ui/screens/reward.js'], { graph: g });
  assert.equal(reward.fullSuiteFor, null);
  assert.deepEqual(reward.specs, ['test/e2e/rewards.spec.js']);
  assert.ok(!reward.specs.includes('test/e2e/battle.spec.js'));
  assert.ok(!reward.specs.includes('test/e2e/p6-screens.spec.js'));
  assert.equal(reward.npmTest, false);
  assert.ok(
    reward.impact.includes('src/ui/index.js') || reward.impact.includes('src/ui.js'),
    'reward edit still impacts the UI composition root',
  );

  const cards = selectPlan(['src/packs/core/cards.js'], { graph: g });
  assert.equal(cards.npmTest, true, 'packs hit must set npmTest via rule (b)');
  assert.ok(cards.specs.includes('test/e2e/battle.spec.js'), 'packs hit must include battle via rule (b)');
}

{
  // Watch mode: ignore noise dirs; engine hits keep plain npm test
  const g = fakeGraph({ 'src/engine.js': [] });
  const watched = selectPlan(['src/engine.js'], { graph: g });
  assert.equal(watched.npmTest, true);
  assert.equal(watched.commands[0], 'npm test');
  assert.equal(isWatchIgnored('test-results/foo'), true);
  assert.equal(isWatchIgnored('dist/index.js'), true);
  assert.equal(isWatchIgnored('node_modules/x'), true);
  assert.equal(isWatchIgnored('.git/HEAD'), true);
  assert.equal(isWatchIgnored('src/engine.js'), false);
}

{
  // Drain playback: changed drain.js triggers node test
  const g = fakeGraph({ 'src/ui/drain.js': [] });
  const plan = selectPlan(['src/ui/drain.js'], { graph: g });
  assert.equal(plan.drainPlayback, true, 'drain.js change sets drainPlayback');
  assert.ok(plan.commands.includes('node test/test_drain_playback.mjs'), 'drain test command included');
  assert.ok(plan.specs.includes('test/e2e/battle.spec.js'), 'battle.spec still in specs via touchpoint');
  assert.ok(plan.specs.includes('test/e2e/presentation.spec.js'), 'presentation.spec in specs via touchpoint');
}

{
  // Drain playback: presentation-owners.js also triggers
  const g = fakeGraph({ 'src/ui/presentation-owners.js': [] });
  const plan = selectPlan(['src/ui/presentation-owners.js'], { graph: g });
  assert.equal(plan.drainPlayback, true, 'presentation-owners.js change sets drainPlayback');
  assert.ok(plan.commands.includes('node test/test_drain_playback.mjs'), 'drain test command included');
}

{
  // Drain playback: non-drain changes don't trigger drainPlayback
  const g = fakeGraph({
    'src/ui/index.js': [],
    'src/ui/drain.js': [],
  });
  const plan = selectPlan(['src/ui/index.js'], { graph: g });
  assert.equal(plan.drainPlayback, false, 'non-drain changes do not trigger drainPlayback');
  assert.equal(plan.npmTest, false, 'index.js change alone does not set npmTest');
}

{
  // Drain playback: impact-only reach must NOT trigger (changed-files-only rule)
  const g = fakeGraph({ 'src/ui/drain.js': ['src/ui/behaviour-trace.js'] });
  const plan = selectPlan(['src/ui/behaviour-trace.js'], { graph: g });
  assert.equal(plan.impact.includes('src/ui/drain.js'), true, 'drain.js is in the impact set');
  assert.equal(plan.drainPlayback, false, 'impacted-only drain.js does not trigger drainPlayback');
}

{
  // runPlan executes the drain playback command, before any playwright specs
  const g = fakeGraph({ 'src/ui/drain.js': [] });
  const plan = selectPlan(['src/ui/drain.js'], { graph: g });
  const invoked = [];
  const status = runPlan(plan, {
    spawn: (cmd, args) => { invoked.push([cmd, ...args].join(' ')); return { status: 0 }; },
  });
  assert.equal(status, 0);
  assert.equal(invoked[0], 'node test/test_drain_playback.mjs', 'drain test runs first');
  assert.ok(invoked[1]?.startsWith('npx playwright test'), 'playwright specs run after');
}

console.log('test_affected_specs: ok');
