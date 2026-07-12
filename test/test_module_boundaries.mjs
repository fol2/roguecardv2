import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';

const importSpecifiers = (relativePath) => {
  const source = readFileSync(new URL(relativePath, import.meta.url), 'utf8');
  return [...source.matchAll(/^import\b[^\n]*\bfrom\s+['"]([^'"]+)['"];?/gm)]
    .map((match) => match[1]);
};

const sourceBlock = (source, marker) => {
  const markerIndex = source.indexOf(marker);
  assert.notEqual(markerIndex, -1, `source block marker must exist: ${marker}`);
  const start = source.indexOf('{', markerIndex + marker.length - 1);
  assert.notEqual(start, -1, `source block must open: ${marker}`);
  let depth = 0;
  for (let index = start; index < source.length; index += 1) {
    if (source[index] === '{') depth += 1;
    if (source[index] === '}') depth -= 1;
    if (depth === 0) return source.slice(start + 1, index);
  }
  assert.fail(`source block must close: ${marker}`);
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

const musicResolve = await import('../src/music-resolve.js');
assert.deepEqual(Object.keys(musicResolve).sort(), [
  'QUEST_COMBAT_CUES', 'SCREEN_CUES', 'dawnEventCue', 'resolveCombatCue', 'resolveScreenCue',
].sort(), 'music-resolve must keep exactly the five PR16 exports');
assert.deepEqual(importSpecifiers('../src/music-resolve.js'), [], 'music-resolve remains Node-pure');
const musicResolveSource = readFileSync(new URL('../src/music-resolve.js', import.meta.url), 'utf8');
assert.doesNotMatch(musicResolveSource, /behaviour-trace|\bdocument\b|\bwindow\b|stage\.js/, 'music-resolve must not import browser owners');

const packageJson = JSON.parse(readFileSync(new URL('../package.json', import.meta.url), 'utf8'));
assert.equal(packageJson.scripts['test:e2e'], 'npm run test:e2e:nonvisual && npm run test:e2e:visual');
assert.equal(packageJson.scripts['test:e2e:nonvisual'], 'npm run test:e2e:disk && npm run test:e2e:random-agent && npm run test:e2e:main && npm run test:e2e:serial');
assert.equal(packageJson.scripts['content:compile'], 'node tools/compile-content-registrations.mjs');
assert.equal(packageJson.scripts['test:content-registrations'], 'node tools/compile-content-registrations.mjs --check');

for (const modulePath of [
  '../src/registry.js', '../src/content-registration.js',
  '../src/presentation-catalog.js', '../src/content-resources.js',
  '../src/ui/tokens.js', '../src/i18n/hydrate-content.js',
  '../tools/compile-content-registrations.mjs',
]) {
  const source = readFileSync(new URL(modulePath, import.meta.url), 'utf8');
  const imports = importSpecifiers(modulePath).join('\n');
  assert.doesNotMatch(imports, /(?:ui\.js|stage\.js|audio\.js|music\.js|audio-assets|vite)/,
    `${modulePath} imports no browser, playback or Vite owner`);
  assert.doesNotMatch(source, /\b(?:document|window|localStorage)\b|import\.meta\.glob/,
    `${modulePath} stays Node-pure and DOM-free`);
}
const registryImports = importSpecifiers('../src/registry.js');
assert.ok(registryImports.includes('./i18n/hydrate-content.js'));
assert.ok(!registryImports.some((specifier) => /i18n\/index\.js|i18n\/en\/ui\.js/.test(specifier)));
const dataSource = readFileSync(new URL('../src/data.js', import.meta.url), 'utf8');
for (const name of ['QUEST_ACTIVE_STATES', 'QUEST_STATES', 'RUN_ID_RE', 'TERMINAL_OUTCOMES']) {
  assert.match(dataSource, new RegExp(`export const ${name}\\b`), `${name} remains owned by data.js platform/save grammar`);
}
const defaultPlaywright = readFileSync(new URL('../playwright.config.js', import.meta.url), 'utf8');
const productionPlaywright = readFileSync(new URL('../playwright.trace-production.config.js', import.meta.url), 'utf8');
const productionTraceSpec = readFileSync(new URL('./e2e/trace-production.spec.js', import.meta.url), 'utf8');
assert.match(defaultPlaywright, /testIgnore:\s*\/trace-production\\\.spec\\\.js\//);
assert.match(productionPlaywright, /testMatch:\s*\/trace-production\\\.spec\\\.js\//);
assert.match(productionPlaywright, /testIgnore:\s*\[\]/);
assert.match(productionPlaywright, /spirebound-trace-production-\$\{server\.port\}/,
  'production trace output directory must be deterministic for teardown');
assert.match(productionPlaywright, /trap cleanup EXIT INT TERM/,
  'production trace web server must clean its bundle on shutdown');
assert.match(productionTraceSpec, /test\.afterAll\([\s\S]*?rmSync\(productionOutDir, \{ recursive: true, force: true \}\)/,
  'production trace suite must clean its exact task-owned bundle after tests');

const uiSource = readFileSync(new URL('../src/ui.js', import.meta.url), 'utf8');
const combatSource = readFileSync(new URL('../src/ui/combat.js', import.meta.url), 'utf8');
const drainSource = readFileSync(new URL('../src/ui/drain.js', import.meta.url), 'utf8');
const probeSource = readFileSync(new URL('../src/ui/probe.js', import.meta.url), 'utf8');
const uiIndexSource = readFileSync(new URL('../src/ui/index.js', import.meta.url), 'utf8');
const overlaySource = readFileSync(new URL('../src/ui/overlay.js', import.meta.url), 'utf8');
const readUiSources = (directory, prefix = '') => Object.fromEntries(
  readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    if (entry.isDirectory()) {
      return Object.entries(readUiSources(new URL(`${entry.name}/`, directory), `${prefix}${entry.name}/`));
    }
    return entry.name.endsWith('.js')
      ? [[`${prefix}${entry.name}`, readFileSync(new URL(entry.name, directory), 'utf8')]]
      : [];
  }),
);
const uiModuleSources = readUiSources(new URL('../src/ui/', import.meta.url));
const aggregateUiSource = [uiSource, ...Object.values(uiModuleSources)].join('\n');
assert.doesNotMatch(aggregateUiSource, /\['armed', 'revealed'\]/,
  'recursive UI sources use QUEST_ACTIVE_STATES rather than duplicating quest protocol values');
assert.doesNotMatch(aggregateUiSource, /\['win', 'death', 'abandon'\]/,
  'recursive UI sources use TERMINAL_OUTCOMES rather than duplicating terminal protocol values');
const screenSources = Object.fromEntries(readdirSync(new URL('../src/ui/screens/', import.meta.url))
  .filter((name) => name.endsWith('.js'))
  .map((name) => [name, readFileSync(new URL(`../src/ui/screens/${name}`, import.meta.url), 'utf8')]));
const mapSource = screenSources['map.js'];
const audioGallerySource = screenSources['audio-gallery.js'];

const exportedNames = (source) => {
  const names = new Set();
  for (const match of source.matchAll(/\bexport\s+(?:async\s+)?(?:const|let|function|class)\s+([\w$]+)/g)) {
    names.add(match[1]);
  }
  for (const match of source.matchAll(/\bexport\s*\{([^}]+)\}/g)) {
    for (const entry of match[1].split(',')) names.add(entry.trim().split(/\s+as\s+/).at(-1));
  }
  return [...names].filter(Boolean).sort();
};
const shorthandKeys = (source, marker) => sourceBlock(source, marker)
  .split('\n')
  .map((line) => line.match(/^\s*([A-Za-z_$][\w$]*)\s*,?\s*$/)?.[1])
  .filter(Boolean)
  .sort();
const objectLiteralKeys = (source, marker) => sourceBlock(source, marker)
  .split('\n')
  .map((line) => line.match(/^\s*([A-Za-z_$][\w$]*)\s*(?::|,)/)?.[1])
  .filter(Boolean)
  .sort();
const combatKeys = [
  'startCombatUI', 'renderCombat', 'refitCombat', 'renderHud', 'meshBindTitle',
  'syncCombat', 'syncHand', 'setTargeting', 'clearTargeting', 'doPlay',
  'onEndTurn', 'useLanternArt', 'afterAction', 'banner', 'flyTo', 'tweenNum',
  'freeze', 'startRig', 'drainHandlers',
].sort();
const drainHandlerKeys = [
  'addCrack', 'banner', 'bumpPile', 'captureCardAnchor', 'choreoAttack',
  'choreoHit', 'choreoStagger', 'clearPileVisualOverride', 'enemyCenter',
  'flyCardBacks', 'flyTo', 'handFaceSize', 'handSeatCenter', 'heroCenter',
  'holdPendingPileArrivals', 'holdPileVisual', 'igniteVessel', 'layoutHand',
  'peekCardAnchor', 'pileCardByUid', 'pileFaceSize', 'releasePileVisual',
  'renderHud', 'scheduleHandReveal', 'semanticUiCheckpoint', 'syncCombat',
  'syncHand', 'syncPileWidgets', 'syncWardMesh', 'takeCardAnchor',
  'hasPileVisualOverride', 'readPileVisualOverride', 'setPileVisualOverride',
  'replacePileVisualOverride', 'clearDrawRevealPlan', 'setDrawRevealPlan',
  'deleteDrawRevealPlan', 'setCardFlightAnchor',
].sort();
assert.deepEqual(exportedNames(combatSource), ['createCombat'], 'combat has one ESM factory export');
assert.deepEqual(exportedNames(drainSource), ['createDrain'], 'drain has one ESM factory export');
assert.deepEqual(exportedNames(probeSource), ['installProbe'], 'probe has one ESM installer export');
assert.deepEqual(exportedNames(uiIndexSource), ['initUI', 'show'], 'UI index has the exact public surface');
assert.deepEqual(shorthandKeys(probeSource, 'export function installProbe({'), [
  'combat', 'context', 'drain', 'navigator', 'trace',
].sort(), 'probe installer accepts exactly the five architectural owners');
assert.match(uiIndexSource, /const probeContext = Object\.freeze\(\{/,
  'the UI composition root freezes ordinary probe dependencies in one context');
assert.deepEqual(objectLiteralKeys(uiIndexSource, 'const probe = installProbe({'), [
  'combat', 'context', 'drain', 'navigator', 'trace',
].sort(), 'the UI composition root calls the probe installer with exactly five owners');
assert.deepEqual(shorthandKeys(combatSource, 'const drainHandlers = Object.freeze({'), drainHandlerKeys,
  'combat owns the exact literal 38-key drain presentation surface');
assert.deepEqual(shorthandKeys(combatSource, 'return Object.freeze({'), combatKeys,
  'combat owns the exact literal 19-key caller surface');
assert.match(drainSource, /return\s+Object\.freeze\(\{\s*drain\s*\}\)/,
  'drain returns only its frozen drain operation');
assert.match(drainSource, /createDrain\(\{[\s\S]*?\bQUESTS\b[\s\S]*?presentation[\s\S]*?\}\)/,
  'drain explicitly receives the quest catalogue used by questReveal playback');
assert.match(drainSource, /createDrain\(\{[\s\S]*?\bcardEl\b[\s\S]*?presentation[\s\S]*?\}\)/,
  'drain explicitly receives the immutable card renderer used by recovery flights');
assert.match(uiIndexSource, /createDrain\(\{[\s\S]*?\bQUESTS\s*,[\s\S]*?presentation:\s*combatApi\.drainHandlers/,
  'the UI composition root supplies QUESTS to drain');
assert.match(uiIndexSource, /createDrain\(\{[\s\S]*?\bcardEl\s*,[\s\S]*?presentation:\s*combatApi\.drainHandlers/,
  'the UI composition root supplies the card renderer to drain');
assert.doesNotMatch(drainSource, /(^|[^.\w])handFaceSize\(/m,
  'drain must call handFaceSize only through the frozen presentation surface');
assert.match(drainSource, /cardEl\(src\.inst,\s*\{\s*inCombat:\s*true,\s*size:\s*layoutW\s*\}\)/,
  'drain recovery reconstructs a missing live card through its injected renderer');
assert.doesNotMatch(combatSource, /\bmeshHandoff\b/,
  'combat must not retain the drain-owned mesh handoff dependency');
assert.doesNotMatch(drainSource, /\b(?:pileVisualOverride|drawRevealPlan|cardFlightAnchor)\b/,
  'drain cannot directly name combat-owned mutable bindings');
assert.doesNotMatch(importSpecifiers('../src/ui/combat.js').join('\n'), /(?:drain|screens|navigation|index)\.js/,
  'combat imports no drain, screen, navigator or index owner');
assert.doesNotMatch(importSpecifiers('../src/ui/drain.js').join('\n'), /(?:combat|screens|navigation|index)\.js/,
  'drain imports no combat, screen, navigator or index owner');
for (const name of Object.keys(screenSources)) {
  assert.deepEqual(importSpecifiers(`../src/ui/screens/${name}`), [],
    `${name} receives dependencies and stays a leaf`);
  assert.doesNotMatch(screenSources[name], /(?:from\s+|import\s*\()['"][^'"]*(?:\/screens\/|\/navigation\.js|\/index\.js|\/ui\.js|pixi)[^'"]*['"]/i,
    `${name} must not import screens, navigation, index, ui or Pixi`);
}
const audioAssetsSource = readFileSync(new URL('../src/audio-assets.js', import.meta.url), 'utf8');
assert.match(audioAssetsSource, /!\.\/assets\/musics\/_raw\/\*\*/,
  'Music Vite glob must exclude authoring-time _raw assets');
assert.match(audioAssetsSource, /!\.\/assets\/sfx\/_raw\/\*\*/,
  'SFX Vite glob must exclude authoring-time _raw assets');
assert.match(audioGallerySource, /applyAudioSelection\(payload\);\s*invalidateSfxSelection\(\);\s*music\.invalidateMusicSelection\(\);/,
  'PR15 hot apply must update selection then invalidate both gameplay caches');
const rawPointerSource = aggregateUiSource;
const rawPointerHandlers = [...rawPointerSource.matchAll(
  /addEventListener\(['"]pointermove['"],[\s\S]*?=>\s*\{([\s\S]*?)\n\s*\}\);/g,
)];
assert.ok(rawPointerHandlers.length >= 3, 'source gate must inspect every inline raw pointermove owner');
for (const [index, match] of rawPointerHandlers.entries()) {
  assert.doesNotMatch(match[1], /trace\.(?:emit|begin)/,
    `raw pointermove handler ${index + 1} must not emit trace records`);
}
const aimMoveSource = sourceBlock(combatSource, 'function aimMove(e) {');
assert.doesNotMatch(aimMoveSource, /trace\.(?:emit|begin)/,
  'named raw pointer owner aimMove must not emit trace records');
const tweenNumSource = sourceBlock(combatSource, 'function tweenNum(node, from, to, ms = 640) {');
const igniteVesselSource = sourceBlock(combatSource, 'function igniteVessel(x, dur = 200) {');
const animationLoopOwners = [
  ['map coast', sourceBlock(mapSource, 'const coast = () => {')],
  ['tweenNum step', sourceBlock(tweenNumSource, 'const step = (now) => {')],
  ['living-glass rigTick', sourceBlock(combatSource, 'function rigTick(t) {')],
  ['igniteVessel step', sourceBlock(igniteVesselSource, 'const step = () => {')],
];
for (const [name, ownerSource] of animationLoopOwners) {
  assert.match(ownerSource, /requestAnimationFrame\(/, `${name} source guard must own an rAF loop`);
  assert.doesNotMatch(ownerSource, /trace\.(?:emit|begin)/, `${name} loop must not emit trace records`);
}
assert.doesNotMatch([uiSource, combatSource, drainSource, uiIndexSource, probeSource].join('\n'),
  /function\s+usePotionOn\s*\(/,
  'usePotionOn must not retain a duplicate monolith owner after overlay extraction');
assert.equal((overlaySource.match(/function\s+usePotionOn\s*\(/g) || []).length, 1,
  'overlay must own exactly one traced usePotionOn handler');
for (const [marker, source] of [
  ['function usePotionOn(', overlaySource],
  ['function selectMapNode(', mapSource],
  ['function useLanternArt(', combatSource],
  ['function doKindle(', combatSource],
  ['function doPlay(', combatSource],
  ['function onEndTurn(', combatSource],
]) {
  const ownerSource = sourceBlock(source, marker);
  assert.match(ownerSource, /catch\s*\(/, `${marker} must close its trace span on failure`);
  assert.match(ownerSource, /finish\('failed'/, `${marker} must record a failed terminal span`);
}
for (const marker of [
  'function flyCardBacks(fromList, toEl, budgetMs, opts = {}) {',
  'function handleDrawWave(',
]) {
  const ownerSource = sourceBlock(
    marker.startsWith('function handleDrawWave(') ? drainSource : combatSource,
    marker,
  );
  assert.match(ownerSource, /catch\s*\(/, `${marker} must close every owned span on failure`);
  assert.match(ownerSource, /finish\('failed'/, `${marker} must record failed terminal spans`);
}

const fixtureDirectory = new URL('./e2e/fixtures/trace/', import.meta.url);
const fixtureManifest = JSON.parse(readFileSync(new URL('manifest.json', fixtureDirectory), 'utf8'));
assert.equal(fixtureManifest.fixtures.length, 18, 'Task 6 trace manifest owns all frozen journeys');
assert.deepEqual(
  readdirSync(fixtureDirectory).filter((name) => name.endsWith('.json')).sort(),
  ['manifest.json', ...fixtureManifest.fixtures.map((id) => `${id}.json`)].sort(),
  'Task 6 trace fixture directory must equal the manifest exactly',
);
for (const fixtureId of fixtureManifest.fixtures) {
  const source = readFileSync(new URL(`${fixtureId}.json`, fixtureDirectory), 'utf8');
  const fixture = JSON.parse(source);
  assert.equal(fixture.journey, fixtureId);
  assert.ok(fixture.records.length > 0, `${fixtureId} must contain frozen semantic evidence`);
  assert.doesNotMatch(source, /atMs|gitSha|runId|instanceId|assetUrl|https?:/, `${fixtureId} excludes unstable/private fields`);
}

for (const spec of [
  'trace.spec.js', 'battle.spec.js', 'audio.spec.js', 'emberglass.spec.js',
  'emberglass-persistence.spec.js', 'hollow-transaction.spec.js',
]) {
  const source = readFileSync(new URL(`./e2e/${spec}`, import.meta.url), 'utf8');
  assert.doesNotMatch(source, /from ['"]@playwright\/test['"]/, `${spec} must use the automatic trace failure fixture`);
  assert.match(source, /from ['"]\.\/trace-fixture\.js['"]/, `${spec} must import the automatic trace failure fixture`);
}
const traceContractSpecs = [
  './e2e/trace.spec.js', './e2e/emberglass-persistence.spec.js',
  './e2e/emberglass.spec.js', './e2e/hollow-transaction.spec.js',
].map((path) => readFileSync(new URL(path, import.meta.url), 'utf8')).join('\n');
const boundFixtureIds = [...traceContractSpecs.matchAll(/bindTraceContract\(['"]([^'"]+)['"]/g)]
  .map((match) => match[1]);
boundFixtureIds.push(...[...traceContractSpecs.matchAll(
  /expectPersistenceTrace\([^,]+,\s*['"][^'"]+['"],\s*['"]([^'"]+)['"]/g,
)].map((match) => match[1]));
const uniqueBoundFixtureIds = [...new Set(boundFixtureIds)].sort();
assert.deepEqual(uniqueBoundFixtureIds, [...fixtureManifest.fixtures].sort(),
  'every frozen Task 6 fixture must bind to at least one real journey comparison/update call');
const traceSpecSource = readFileSync(new URL('./e2e/trace.spec.js', import.meta.url), 'utf8');
const traceOwnedFixtureIds = [...traceSpecSource.matchAll(/bindTraceContract\(['"]([^'"]+)['"]/g)]
  .map((match) => match[1]);
assert.deepEqual([...new Set(traceOwnedFixtureIds)].sort(), [...fixtureManifest.fixtures].sort(),
  'the exact playwright test trace update command must own all frozen Task 6 fixtures');

// Task 12A — compiled core registration graph stays off the live engine/data path.
{
  const contentSource = readFileSync(new URL('../src/content.js', import.meta.url), 'utf8');
  assert.match(contentSource, /CONTENT_REGISTRATION_MANIFEST/);
  assert.match(contentSource, /compileContentRegistrations/);
  assert.doesNotMatch(contentSource, /\b(?:definePack|joinLocaleContent|createContentContext)\s*\(/);
  assert.doesNotMatch(contentSource, /packs\s*:\s*\[|registrations\s*:\s*\[/);
  assert.doesNotMatch(contentSource, /i18n\/en\/(?:index|ui)\.js/);
  assert.doesNotMatch(contentSource, /from\s+['"]\.\/packs\/core\//);

  const productionManifest = readFileSync(new URL('../src/packs/compiled/production.js', import.meta.url), 'utf8');
  const developmentManifest = readFileSync(new URL('../src/packs/compiled/development.js', import.meta.url), 'utf8');
  assert.match(productionManifest, /from\s+['"]\.\.\/core\/registration\.js['"]/);
  assert.doesNotMatch(productionManifest, /_sample|development\/|fixture/);
  assert.equal([...productionManifest.matchAll(/from\s+['"][^'"]+registration\.js['"]/g)].length, 1);
  assert.match(developmentManifest, /from\s+['"]\.\.\/core\/registration\.js['"]/);

  const registrationSource = readFileSync(new URL('../src/packs/core/registration.js', import.meta.url), 'utf8');
  assert.match(registrationSource, /i18n\/en\/content\.js/);
  assert.doesNotMatch(registrationSource, /i18n\/en\/(?:index|ui)\.js/);

  const dataStillMonolith = readFileSync(new URL('../src/data.js', import.meta.url), 'utf8');
  assert.doesNotMatch(dataStillMonolith, /from\s+['"]\.\/(?:content|content-protocol|packs)\b/);
  const engineStillDataOnly = importSpecifiers('../src/engine.js');
  assert.deepEqual(engineStillDataOnly, ['./data.js']);

  for (const modulePath of [
    '../src/content.js', '../src/packs/core/index.js', '../src/packs/core/registration.js',
    '../src/packs/core/progression.js', '../tools/check-core-candidate.mjs',
  ]) {
    const source = readFileSync(new URL(modulePath, import.meta.url), 'utf8');
    assert.doesNotMatch(source, /\b(?:document|window|localStorage)\b|import\.meta\.glob/,
      `${modulePath} stays Node-pure`);
  }
}

console.log('module boundary checks passed');
