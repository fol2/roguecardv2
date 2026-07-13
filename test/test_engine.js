// Engine self-check: unit math + asset manifest + monte-carlo random-agent full runs.
import assert from 'node:assert';
import { mkdirSync, mkdtempSync, readFileSync, readdirSync, rmSync, symlinkSync, writeFileSync, cpSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { inflateSync } from 'node:zlib';
import { createServer as createViteServer } from 'vite';
import {
  newRun, startCombat, playCard, endTurn, drawCards, makeCard, makeVariant, cardData, availableNodes, genMap,
  rollEncounter, rollEvent, applyEventOps, applyNodeEventChoice, finalizeNodeEventChoice, claimTreasure, claimBossRelic, nodeRewardClaimed, nodeEventInFlight, saveRun, loadRun, genCombatRewards, genShop, buyQuestItem, gainRelic, randomRelic,
  rollBossRelics, addCardToDeck, removableCards, removeCardFromDeck, upgradeCardInDeck, gainPotion, usePotion,
  MAP_ROWS, runRng, healPlayer, previewPlay, visitNode, claimMonument, grantBequest, markShadeFall, resolveCombatant, cardPool, relicPool,
  gainEmbers, kindleFromHand, canKindle, canPlay, canUseArt, useArt, rollOmen, restHealFrac, effCost,
  previewBlock, previewEnemyDmg, rollCardReward, vowMods, runRevealed,
  revealQuest, advanceQuest, setPendingEncounter, clearPendingEncounter,
  setPendingReward, takePendingReward, clearPendingReward, pendingRewardHasUntaken, hasPendingBossRelic, recordRunEnd, commitRunStats,
  stagePendingDawn, advancePendingDawn, completePendingDawn, loadStats, paleVariantForAct,
  applyBoon, reverseBoon, payHollowPrice, stageHollowExit,
  shopSessionKey, shopStockForSession,
  finaliseTerminalOutbox, journalTerminalOutcome, savedRunRequiresFinalisation,
  SHADE_DUEL_TX, shadeVictorySkipsRewards, shadeLossBequestState,
  contentIdFor, isEphemeralRun, themeCount, isFinalTheme, _normaliseRunSnapshotForTest,
} from '../src/engine.js';
import * as EngineApi from '../src/engine.js';
import { CARDS, ENEMIES, EVENTS, CARD_POOLS, RELIC_POOLS, ARTS, OMENS, AFFIXES, ASPECTS, VOWS, BOONS, RELICS, POTIONS, STATUS_INFO, DEEDS, REVEALS, PROGRESSION, POOL_GATE, QUEST_IDS, QUESTS, WHISPERS, SHADE_KITS, VARIANTS, ACTS, ENCOUNTERS, REWARD_GOLD, PLAYER } from '../src/data.js';
import { _setStore, _setRng, loadVigil, saveVigil, syncVigil, commitRunToVigil, evaluateDeeds, setBequest, clearBequest, bequestOptions, isRevealed, revealSnapshot, commitRunEnd, commitPendingRunEnd, clearNews, questSnapshot, whisperAt } from '../src/vigil.js';
import { bfResolve, bfActor, bfSlots, bfEnemySize, bfEnemyFrame, bfEnemyFootX, bfEnemyFootY, bfEnemyZOrder, bfHeroY, _setBF, bfRaw } from '../src/battlefield.js';
import { serializeBF, validateBF } from '../src/dev/bf-serialize.js';
import { uicResolve, _setUIC, uicRaw, relicBarLayout } from '../src/uic.js';
import { serializeUIC, validateUIC } from '../src/dev/bfui-serialize.js';
import { pileTier, pileFanLayers, pileFanAngleDeg, flightSchedule, drawBatchSchedule, PILE_IDS, PILE_FAN_DEG, PILE_FAN_MAX_DEG, PILE_FAN_MAX_LAYERS } from '../src/pile-chrome.js';
import {
  UI_CHROME_IDS, uiFallbackName, energySlotStates, intentUiIds, nodeGlyphId,
} from '../src/ui-chrome.js';
import { BASE_AUDIO_VERSIONS, DEFAULT_AUDIO_SELECTION, audioRefFromPath, canonicalAudioFilename, normaliseAudioSelection, rankAudioRefs, resolveAudioRef, validateAudioSelection } from '../src/audio-packs.js';
import { serializeAudioSelection } from '../src/dev/audio-selection-serialize.js';
import { fetchAudioSelectionJson } from '../src/audio-selection-fetch.js';
import { createChoiceLatch } from '../src/choice-latch.js';
import { formatVersionDisplay } from '../src/version.js';
import { MUSIC_CATALOG } from '../src/audio-catalog.js';
import {
  resolveCombatCue, resolveScreenCue, dawnEventCue, SCREEN_CUES, QUEST_COMBAT_CUES,
} from '../src/music-resolve.js';
import { t, getLocale, setLocale, getContent } from '../src/i18n/index.js';
import {
  createBehaviourTrace, FORBIDDEN_TRACE_KEYS, TRACE_END_OUTCOMES,
  TRACE_POINT_OUTCOMES, TRACE_VERSION,
} from '../src/ui/behaviour-trace.js';
import { createPresentationBarrier } from '../src/ui/presentation-barrier.js';
import * as RunEffectsModule from '../src/ui/run-effects.js';
const FormatModule = await import('../src/ui/format.js');
const CommandsModule = await import('../src/ui/commands.js');
import {
  allocateStrictE2EPort, runWithStrictE2EPort,
} from '../tools/run-with-strict-e2e-port.mjs';
import {
  STANDING_GATE_PROFILES, runStandingGates,
} from '../tools/run-round5-standing-gates.mjs';
import {
  CONTENT_EXPORT_NAMES, PROTOCOL_EXPORT_NAMES, canonicalise, canonicalJson,
  assertCaptureWorktreeIdentity, captureContentOracle, captureLiveContentOracle,
  descriptorInventory, inspectExactSourceRoot, inspectSourceRoot,
} from '../tools/capture-content-oracle.mjs';
import {
  CONTENT_SCHEMAS, MERGE_POLICIES, PROGRESSION_MERGE_POLICIES,
  createContentContext, createContentRegistry, definePack, doctorContent,
  formatContentReport, isFinalTheme as registryIsFinalTheme, joinLocaleContent, themeById, themeForAct,
} from '../src/registry.js';
import {
  compileContentRegistrations, defineContentRegistration,
  doctorContentRegistrations, withContentRegistration,
} from '../src/content-registration.js';
import { STATIC_REFERENCE_CATALOGUES } from '../src/content-resources.js';
import {
  discoverContentRegistrations, renderContentRegistrationManifest,
  compileRegistrationFiles,
} from '../tools/compile-content-registrations.mjs';
import { CORE_CONTENT, _CORE_CONTENT_PROVENANCE } from '../src/content.js';
import { createCoreAuthoring } from '../src/packs/core/index.js';
import * as englishContent from '../src/i18n/en/content.js';
import { resolveAtmosphere } from '../src/theme-atmosphere.js';
import { createDevRegistry } from '../src/packs/dev.js';
import {
  SAMPLE_PACK, SAMPLE_LOCALE_EN, sampleCard, sampleEnemy, sampleTheme,
} from '../src/packs/_sample/index.js';
import {
  CORE_CONTENT as UI_CORE_CONTENT,
  bindRunContent, contentViewFor, themeForRun,
} from '../src/ui/content.js';
import {
  encodeLabScenario, decodeLabScenario, validateLabScenario,
  encodeReplayDescriptor, decodeReplayDescriptor, normalizeReplayDescriptor,
} from '../src/dev/lab-scenario.js';
import {
  FORBIDDEN_PRODUCTION_MARKERS, scanProductionSurface,
} from '../tools/verify-production-surface.mjs';
import { CHAR_META } from '../src/char-meta.js';
import {
  CHARACTER_KIND_IDS, STRUCTURAL_FALLBACK_IDS, VFX_IDS,
} from '../src/presentation-catalog.js';
import { SFX_CATALOG } from '../src/audio-catalog.js';
import { UI_TOKEN_IDS } from '../src/ui/tokens.js';
import {
  QUEST_STATES, QUEST_ACTIVE_STATES, TERMINAL_OUTCOMES, RUN_ID_RE,
} from '../src/content-protocol.js';

function makeTunedContent(overrides = {}, id = 'tuned', mutateAuthoring = null) {
  const authoring = createCoreAuthoring(overrides);
  if (typeof mutateAuthoring === 'function') mutateAuthoring(authoring);
  const pack = definePack({ id, ...authoring });
  return createContentContext([pack], {
    id,
    resources: STATIC_REFERENCE_CATALOGUES,
    localeContent: englishContent,
    localeToken: 'en',
  });
}

{
  const oracle = JSON.parse(readFileSync(new URL('./fixtures/round5-content-oracle-v1.json', import.meta.url), 'utf8'));
  assert.equal(oracle.version, 1);
  assert.equal(oracle.contentExports.length, 28);
  assert.deepEqual(oracle.contentExports.map((row) => row.name), CONTENT_EXPORT_NAMES);
  assert.equal(PROTOCOL_EXPORT_NAMES.length, 4);
  assert.deepEqual(Object.keys(oracle.protocolExports), [
    'QUEST_STATES', 'QUEST_ACTIVE_STATES', 'TERMINAL_OUTCOMES', 'RUN_ID_RE',
  ]);
  assert.deepEqual(oracle.protocolExports.QUEST_STATES, ['dormant', 'armed', 'revealed', 'complete']);
  assert.deepEqual(oracle.protocolExports.QUEST_ACTIVE_STATES, ['armed', 'revealed']);
  assert.deepEqual(oracle.protocolExports.TERMINAL_OUTCOMES, ['win', 'death', 'abandon']);
  const runIdPattern = new RegExp(
    oracle.protocolExports.RUN_ID_RE.source, oracle.protocolExports.RUN_ID_RE.flags,
  );
  for (const id of ['run-alpha-1', 'legacy-abc-def', 'run-a-b-c-d']) assert.match(id, runIdPattern);
  for (const id of ['run-a', '__proto__', 'run-a-b-c-d-e', 'RUN-a-b']) assert.doesNotMatch(id, runIdPattern);
  assert.equal(oracle.enemyAi.length, Object.values(ENEMIES).filter((e) => e.ai).length);
  assert.equal(oracle.shadeAi.length, Object.values(SHADE_KITS).filter((e) => e.ai).length);
  assert.equal(oracle.enemyAi.length + oracle.shadeAi.length, 29);
  assert.ok([...oracle.enemyAi, ...oracle.shadeAi].every((row) => row.arity === 1));
  assert.deepEqual(oracle.i18n.apis, [
    'getContent', 'getLocale', 'hydrateContent', 'lookup',
    'registerLocale', 'setLocale', 't',
  ]);
  assert.equal(oracle.i18n.defaultLocale, 'en');
  assert.equal(Object.keys(oracle.i18n.domains).length, 18);
  assert.equal(oracle.i18n.uiLeafCount, 278);
  assert.match(oracle.i18n.catalogueSha256, /^[a-f0-9]{64}$/);
  assert.ok(oracle.i18n.hydratedAliases.some((paths) =>
    paths.includes('ASPECTS.0') && paths.includes('PLAYER')));
  assert.match(oracle.rawMechanics.sha256, /^[a-f0-9]{64}$/);
  assert.match(oracle.rawMechanics.descriptorSha256, /^[a-f0-9]{64}$/);
  assert.equal(oracle.rawMechanics.value.CARDS.strike.name, undefined);
  assert.equal(oracle.rawMechanics.value.CARDS.strike.type, CARDS.strike.type);
  assert.ok(oracle.rawMechanics.mechanicsPaths.includes('CARDS.strike.type'));
  assert.ok(oracle.rawMechanics.localeOwnedPaths.includes('CARDS.strike.name'));
  assert.ok(oracle.rawMechanics.localeOwnedPaths.includes('ACTS.0.bossName'));
  assert.ok(oracle.rawMechanics.localeOwnedPaths.includes('ASPECTS.0.blurb'));
  assert.ok(oracle.rawMechanics.mechanicsPaths.every((path) => !/^(?:src|test)\//.test(path)));
  assert.ok(oracle.rawMechanics.localeOwnedPaths.every((path) => !/^(?:src|test)\//.test(path)));
  assert.deepEqual(oracle.descriptors.accessors, [{
    path: 'QUESTS.hollowLamplighter.target', value: QUESTS.hollowLamplighter.target,
  }]);
  assert.match(oracle.monteCarlo.sha256, /^[a-f0-9]{64}$/);
  assert.deepEqual(oracle.monteCarlo.seeds, [2026071000, 2026071299]);
  assert.equal(oracle.monteCarlo.count, 300);
  assert.equal(oracle.monteCarlo.records.length, 300);
  assert.ok(oracle.monteCarlo.records.every((row) =>
    canonicalJson(Object.keys(row).sort()) === canonicalJson([
      'act', 'deckIds', 'engineRngState', 'floor', 'hp', 'outcome', 'relicIds',
    ])));
  assert.deepEqual(oracle.sovereignSequence.map((row) => row.returned), [
    'ascend', 'starfall', 'ruin', 'annihilation',
  ]);
  assert.equal(oracle.sovereignSequence[0].self.moveKey, null,
    'Sovereign post-call snapshot precedes harness progression');
  assert.ok(oracle.sovereignSequence.every((row) =>
    row.progression.moveKey === row.returned
    && row.progression.lastMoves.at(-1) === row.returned),
  'Sovereign harness progression is recorded separately');
  assert.equal(oracle.provenance.sourceSha,
    '9c4f7e5624b1c7eae8eb6fd3e7c27ff5ec0df5f8');
  assert.match(oracle.provenance.sourceTree, /^[a-f0-9]{40}$/);
  assert.match(oracle.provenance.captureParentHead, /^[a-f0-9]{40}$/);
  assert.match(oracle.provenance.captureParentTree, /^[a-f0-9]{40}$/);
  assert.match(oracle.provenance.captureInputs.toolSha256, /^[a-f0-9]{64}$/);
  assert.match(oracle.provenance.captureInputs.testSha256, /^[a-f0-9]{64}$/);
  assert.notEqual(oracle.provenance.captureParentHead, oracle.provenance.sourceSha);
  assert.deepEqual(oracle.provenance.sourceModules, {
    data: 'src/data.js', engine: 'src/engine.js', i18n: 'src/i18n/index.js',
  });
  assert.deepEqual(oracle.provenance.pr17, {
    base: 'b285b815509d5c700b2b76847302c01bc595db47',
    head: '5cd1c555219a18e25b8ffa11646e7899d6764fd2',
    merge: '40eb3576870f2a94b50e1a616ec40d4c37075018',
  });
  assert.deepEqual(oracle.provenance.pr17Paths, [
    'src/battlefield-layout.js', 'src/styles.css', 'src/ui.js',
    'test/e2e/geometry.spec.js',
    'test/e2e/visual.spec.js-snapshots/combat-act1-landscape-linux.png',
    'test/e2e/visual.spec.js-snapshots/combat-act2-landscape-linux.png',
    'test/e2e/visual.spec.js-snapshots/combat-act2-portrait-linux.png',
  ]);
  assert.deepEqual(oracle.provenance.pr21, {
    base: '40eb3576870f2a94b50e1a616ec40d4c37075018',
    head: 'c42279609f2379cd6be6ba695205a131f029de28',
    merge: '45677c1a676d19b1590192a4dbaf8425801dc97e',
  });
  assert.deepEqual(oracle.provenance.pr22, {
    base: '45677c1a676d19b1590192a4dbaf8425801dc97e',
    head: 'fe330a077ba847900f08be0121b65081b84e21ae',
    merge: '9c4f7e5624b1c7eae8eb6fd3e7c27ff5ec0df5f8',
  });
  for (const row of [...oracle.enemyAi, ...oracle.shadeAi]) {
    assert.match(row.functionSha256, /^[a-f0-9]{64}$/);
    const lastHistory = new Set(row.cases.map((entry) => entry.last).filter(Boolean));
    const prevHistory = new Set(row.cases.map((entry) => entry.prev).filter(Boolean));
    assert.deepEqual([...lastHistory].sort(), [...row.moveKeys].sort(), `${row.id}: complete last keys`);
    assert.deepEqual([...prevHistory].sort(), [...row.moveKeys].sort(), `${row.id}: complete prev keys`);
    assert.ok(row.cases.every((entry) => row.moveKeys.includes(entry.returned)), `${row.id}: legal returns`);
    assert.ok(row.cases.every((entry) => entry.self.moveKey === null),
      `${row.id}: snapshots precede harness intent progression`);
    assert.equal(row.cases.length, 5 * (row.moveKeys.length + 1) ** 2 * 3 * 2,
      `${row.id}: full Cartesian schedule`);
  }
  const rngCase = oracle.enemyAi.flatMap((row) => row.cases)
    .find((entry) => entry.rng.calls > 0);
  assert.ok(rngCase, 'AI oracle includes a production-RNG consumer');
  const expectedRng = EngineApi.makeRng(rngCase.seed);
  for (let call = 0; call < rngCase.rng.calls; call++) expectedRng();
  assert.equal(rngCase.rng.state, expectedRng.getState(), 'AI oracle records production Mulberry32 state');
}

// Task 12A Step 1: live monolith still matches the frozen oracle legs.
{
  const expected = JSON.parse(readFileSync(new URL('./fixtures/round5-content-oracle-v1.json', import.meta.url), 'utf8'));
  const actual = await captureLiveContentOracle();
  assert.deepEqual(actual.contentExports, expected.contentExports);
  assert.deepEqual(actual.protocolExports, expected.protocolExports);
  assert.deepEqual(actual.enemyAi, expected.enemyAi);
  assert.deepEqual(actual.shadeAi, expected.shadeAi);
  assert.deepEqual(actual.rawMechanics, expected.rawMechanics);
  assert.deepEqual(actual.i18n, expected.i18n);
  assert.equal(actual.monteCarlo.sha256, expected.monteCarlo.sha256);
}

// Oracle helpers are import-safe, deterministic and source-root selected.
{
  assert.equal(canonicalJson({ z: 1, fn() {}, a: [2, 1] }), '{"a":[2,1],"z":1}');
  for (const value of [NaN, Infinity, Symbol('x'), 1n]) {
    assert.throws(() => canonicalise(value), /non-finite|unsupported/);
  }
  const cycle = {};
  cycle.self = cycle;
  assert.throws(() => canonicalise(cycle), /cyclic/);
  let unexpectedGetterCalls = 0;
  const unexpected = {};
  Object.defineProperty(unexpected, 'trap', {
    enumerable: true,
    get() { unexpectedGetterCalls++; return 1; },
  });
  assert.deepEqual(descriptorInventory({ ROOT: unexpected }).accessors, [{ path: 'ROOT.trap' }]);
  assert.equal(unexpectedGetterCalls, 0, 'descriptor inventory never executes an unapproved getter');

  const roots = [];
  const makeRoot = (marker, dataSource = null) => {
    const root = mkdtempSync(join(tmpdir(), `spirebound-oracle-${marker}-`));
    roots.push(root);
    mkdirSync(join(root, 'src/i18n/en'), { recursive: true });
    writeFileSync(join(root, 'src/data.js'), dataSource
      || `export const PLAYER = { id: ${JSON.stringify(marker)} };\n`);
    writeFileSync(join(root, 'src/engine.js'), `export const marker = ${JSON.stringify(marker)};\n`);
    writeFileSync(join(root, 'src/i18n/index.js'), [
      `const content = { marker: ${JSON.stringify(marker)} };`,
      `export const getLocale = () => ${JSON.stringify(`locale-${marker}`)};`,
      'export const getContent = () => content;',
    ].join('\n'));
    writeFileSync(join(root, 'src/i18n/en/content.js'), `export const marker = ${JSON.stringify(marker)};\n`);
    writeFileSync(join(root, 'src/i18n/en/ui.js'), `export const ui = { marker: ${JSON.stringify(marker)} };\n`);
    return root;
  };
  try {
    const falseCaptureRoot = mkdtempSync(join(tmpdir(), 'spirebound-oracle-false-capture-'));
    roots.push(falseCaptureRoot);
    mkdirSync(join(falseCaptureRoot, 'tools'), { recursive: true });
    writeFileSync(join(falseCaptureRoot, 'tools/capture-content-oracle.mjs'), '// not the executing tool\n');
    assert.throws(() => assertCaptureWorktreeIdentity(falseCaptureRoot),
      /captureWorktree does not contain the executing oracle tool/);
    const aliasParent = mkdtempSync(join(tmpdir(), 'spirebound-oracle-alias-parent-'));
    roots.push(aliasParent);
    const actualCaptureRoot = fileURLToPath(new URL('..', import.meta.url));
    const captureAlias = join(aliasParent, 'capture-alias');
    symlinkSync(actualCaptureRoot, captureAlias, 'dir');
    await assert.rejects(captureContentOracle({
      sourceWorktree: actualCaptureRoot,
      captureWorktree: captureAlias,
    }), /source and capture worktrees must be distinct/);
    const first = await inspectSourceRoot(makeRoot('first'));
    const second = await inspectSourceRoot(makeRoot('second'));
    assert.equal(first.data.PLAYER.id, 'first');
    assert.equal(first.i18n.defaultLocale, 'locale-first');
    assert.equal(first.i18n.ui.marker, 'first');
    assert.equal(second.data.PLAYER.id, 'second');
    assert.equal(second.i18n.defaultLocale, 'locale-second');
    assert.equal(second.i18n.ui.marker, 'second');
    assert.notEqual(first.dataSha256, second.dataSha256);
    assert.notEqual(first.i18nSha256, second.i18nSha256);
    const completeExports = [...CONTENT_EXPORT_NAMES, ...PROTOCOL_EXPORT_NAMES]
      .map((name) => `export const ${name} = {};`).join('\n');
    const extraRoot = makeRoot('extra', `${completeExports}\nexport const EXTRA = {};\n`);
    await assert.rejects(inspectExactSourceRoot(extraRoot), /undeclared: EXTRA/);
  } finally {
    for (const root of roots) rmSync(root, { recursive: true, force: true });
  }
}

function freshCombat(enemyIds = ['sporeling']) {
  const run = newRun(12345);
  const cb = startCombat(run, enemyIds);
  return { run, cb };
}
function forceHand(run, cb, ids) {
  cb.hand = ids.map((id) => makeCard(run, id));
}

// ---- Round 5 P1 shared UI module boundaries -------------------------------
{
  assert.deepEqual(Object.keys(FormatModule), ['ROMAN'], 'format exposes only ROMAN');
  assert.deepEqual(Object.keys(CommandsModule), ['bindUICommands', 'uiCommands'],
    'commands exposes only the binder and frozen facade');
  assert.deepEqual(FormatModule.ROMAN, ['0', 'I', 'II', 'III', 'IV', 'V']);
  assert.equal(Object.isFrozen(FormatModule.ROMAN), true, 'ROMAN is immutable');
  assert.equal(Object.isFrozen(CommandsModule.uiCommands), true, 'command facade is immutable');

  const exportNames = (source) => {
    const names = new Set();
    for (const match of source.matchAll(/\bexport\s+(?:async\s+)?(?:const|let|function|class)\s+([\w$]+)/g)) names.add(match[1]);
    for (const match of source.matchAll(/\bexport\s*\{([^}]+)\}/g)) {
      for (const entry of match[1].split(',')) {
        const name = entry.trim().split(/\s+as\s+/).at(-1);
        if (name) names.add(name);
      }
    }
    return [...names].sort();
  };
  const sourceOf = (name) => readFileSync(new URL(`../src/ui/${name}.js`, import.meta.url), 'utf8');
  assert.deepEqual(exportNames(sourceOf('context')), [
    '$', '$$', 'COARSE', 'FINE', 'FORCE_INPUT', 'S', 'el', 'escHtml',
    'presentationBarrier', 'screenEl', 'sleep', 'terminalNavigationLocked', 'trace',
  ].sort(), 'context exact browser-owned export surface');
  assert.deepEqual(exportNames(sourceOf('policy')), ['REDUCED'],
    'policy exact browser-owned export surface');
  assert.deepEqual(exportNames(sourceOf('rose')), [
    'getRoseState', 'roseAssets', 'setDisclosedRoseStateIds', 'setForceRoseFallback', 'setRoseAssetsReady',
  ], 'rose exact browser-owned export surface');
  assert.deepEqual(exportNames(sourceOf('assets')), [
    'aimRing', 'combatantView', 'heroArt', 'hudRelic', 'metaBg', 'omenIconName',
    'omenMark', 'rasterOr', 'relicArt', 'sceneBg', 'warmAssets',
  ], 'assets exports only consumers used outside its owner');
  assert.deepEqual(exportNames(sourceOf('tooltip')), ['createTooltip']);
  assert.deepEqual(exportNames(sourceOf('overlay')), ['createOverlay']);
  assert.deepEqual(exportNames(sourceOf('navigation')), ['createNavigator']);
  const screenFactories = {
    title: ['createTitleScreen', ['renderTitle']],
    embark: ['createEmbarkScreen', ['renderEmbark']],
    vigil: ['createVigilScreen', ['renderVigil']],
    run: ['createRunScreen', ['resumePendingHollowRoute', 'startRun']],
    lamplighter: ['createLamplighterScreen', ['renderLamplighter', 'renderHollow']],
    map: ['createMapScreen', ['renderMap', 'routeVisitedNode', 'claimMonumentNode']],
    reward: ['createRewardScreen', ['renderReward', 'renderBossRelic', 'omenBanner']],
    rest: ['createRestScreen', ['renderRest', 'renderTreasure']],
    shop: ['createShopScreen', ['renderShop']],
    event: ['createEventScreen', ['renderEvent']],
    end: ['createEndScreen', ['journalRunEnd', 'finalisePendingRunEnd', 'renderEnd']],
    gallery: ['createGalleryScreen', ['renderGallery']],
    'audio-gallery': ['createAudioGalleryScreen', ['renderAudioGallery']],
  };
  for (const [name, [factory, surface]] of Object.entries(screenFactories)) {
    const source = sourceOf(`screens/${name}`);
    assert.deepEqual(exportNames(source), [factory], `${name} screen exposes only its factory`);
    const returned = source.match(/return\s+Object\.freeze\(\{\s*([^}]+?)\s*\}\);/)?.[1]
      .split(',').map((entry) => entry.trim()).filter(Boolean);
    assert.deepEqual(returned, surface, `${name} screen returns its exact frozen surface`);
  }

  const uiSource = readFileSync(new URL('../src/ui.js', import.meta.url), 'utf8');
  assert.equal(uiSource.trim(), "export { initUI, show } from './ui/index.js';",
    'src/ui.js stays a thin re-export');
  assert.ok(uiSource.split('\n').length <= 5, 'src/ui.js stays within five lines');
  const overlaySource = sourceOf('overlay');
  const navigationSource = sourceOf('navigation');
  assert.doesNotMatch(uiSource, /\b(?:function|const|let)\s+(?:openPersistenceDialog|persistenceDialogTransaction|wipe|transitionSeq)\b/,
    'shared overlay and navigation owners have no duplicate monolith bindings');
  assert.match(overlaySource, /import\s*\{\s*createChoiceLatch\s*\}/,
    'overlay retains the one-shot choice guard owner');
  assert.match(navigationSource, /function\s+wipe\s*\(/);
  assert.match(navigationSource, /let\s+transitionSeq\s*=\s*0/);
  assert.match(navigationSource, /const\s+routeMap\s*=\s*new Map\(routes\)/,
    'navigator owns a private route Map copy');
  assert.match(navigationSource, /const\s+routeKeys\s*=\s*Object\.freeze\(\[\.\.\.routeMap\.keys\(\)\]\)/,
    'navigator freezes the ordered route-key snapshot');
  const combatSource = sourceOf('combat');
  const markerStart = combatSource.indexOf('/** Resting hand-fan top');
  const markerEndText = 'let chromeClampRaf = 0;';
  const markerEnd = combatSource.indexOf(markerEndText, markerStart) + markerEndText.length + 1;
  assert.ok(markerStart >= 0 && markerEnd > markerStart, 'PR17 geometry marker boundary remains in combat.js');
  assert.equal(
    createHash('sha256').update(combatSource.slice(markerStart, markerEnd)).digest('hex'),
    'e534720a00981eebe19e7e601b3c4e17d9b05f0d685e996f92360df2ac08766a',
    'PR17 hand/chrome geometry block remains byte-identical',
  );
}

// Freeze the predecessor locale-key multiset and lazy keyword decoration.
{
  const expectedTrKeys = [
    'ui.brand.tagline', 'ui.brand.title', 'ui.brand.title', 'ui.combat.affixTitle', 'ui.combat.ashes', 'ui.combat.ashesPileAria',
    'ui.combat.ashesSub', 'ui.combat.ashesTitle', 'ui.combat.buff', 'ui.combat.debuff', 'ui.combat.discard', 'ui.combat.discardPileAria',
    'ui.combat.discardPileTitle', 'ui.combat.draw', 'ui.combat.drawPileAria', 'ui.combat.drawPileSub', 'ui.combat.drawPileTitle', 'ui.combat.end',
    'ui.combat.enemyTurn', 'ui.combat.energyAria', 'ui.combat.facetsBody', 'ui.combat.facetsTitle', 'ui.combat.glassHolds', 'ui.combat.guardShattered',
    'ui.combat.guardShattered', 'ui.combat.lanternBody', 'ui.combat.lanternBodyLead', 'ui.combat.lanternSub', 'ui.combat.lanternTitle', 'ui.combat.lanternTitleArt',
    'ui.combat.monumentGift', 'ui.combat.perfectBanner', 'ui.combat.reshuffle', 'ui.combat.shatter', 'ui.combat.staggered', 'ui.combat.staggered',
    'ui.combat.staggeredTipBody', 'ui.combat.staggeredTipTitle', 'ui.combat.stoneRemembers', 'ui.combat.yourTurn', 'ui.common.cancel', 'ui.common.cancel',
    'ui.common.continue', 'ui.common.continue', 'ui.common.continue', 'ui.common.continue', 'ui.common.retry', 'ui.common.retry',
    'ui.common.skip', 'ui.dawn.act4RevealCopy', 'ui.dawn.eighthResolvedKicker', 'ui.dawn.pageKicker', 'ui.dawn.questCompleteKicker', 'ui.dawn.questProgressKicker',
    'ui.dawn.questRevealKicker', 'ui.dawn.questUnlockKicker', 'ui.dawn.reloadSaved', 'ui.dawn.saveFailedClear', 'ui.dawn.saveFailedCursor', 'ui.dawn.saveFailedTitle',
    'ui.dawn.shadeResolvedKicker', 'ui.dawn.shardGrantCopy', 'ui.dawn.whisperKicker', 'ui.dawn.witchlightCopy', 'ui.dawn.witchlightLens', 'ui.embark.aspectLabel',
    'ui.embark.noVows', 'ui.embark.subChoose', 'ui.embark.subWait', 'ui.embark.title', 'ui.embark.warnSaved', 'ui.end.ascended',
    'ui.end.ascendedSub', 'ui.end.bequestDone', 'ui.end.bequestNote.card', 'ui.end.bequestNote.gold', 'ui.end.bequestNote.goldCache', 'ui.end.bequestNote.relic',
    'ui.end.bequestTitle', 'ui.end.bequestUnpaid', 'ui.end.cardsPlayed', 'ui.end.deckSize', 'ui.end.dmgDealt', 'ui.end.dmgTaken',
    'ui.end.elitesBosses', 'ui.end.fallen', 'ui.end.fallenSub', 'ui.end.finalDeckTitle', 'ui.end.floors', 'ui.end.returnVigil',
    'ui.end.runTime', 'ui.end.slain', 'ui.end.unlock.ashwarden', 'ui.end.unlock.aspect', 'ui.end.unlock.card', 'ui.end.unlock.header',
    'ui.end.unlock.relic', 'ui.end.viewDeck', 'ui.event.chooseCardSub', 'ui.event.chooseCardTitle', 'ui.event.duplicateSub', 'ui.event.duplicateTitle',
    'ui.event.removeSub', 'ui.event.removeTitle', 'ui.event.upgradeSub', 'ui.event.upgradeTitle', 'ui.help.climbBody', 'ui.help.climbTitle',
    'ui.help.combatBody', 'ui.help.combatTitle', 'ui.help.firesBody', 'ui.help.firesTitle', 'ui.help.glassBody', 'ui.help.glassTitle',
    'ui.help.lanternBody', 'ui.help.lanternTitle', 'ui.help.title', 'ui.help.vigilBody', 'ui.help.vigilTitle', 'ui.help.wardBody',
    'ui.help.wardTitle', 'ui.hollow.kicker', 'ui.hollow.payPrice', 'ui.hollow.pricePaid', 'ui.hollow.pricePaid', 'ui.hollow.returnLater',
    'ui.hollow.routeFailed', 'ui.hollow.routeSaveFailed', 'ui.hollow.saveFailed', 'ui.hollow.title', 'ui.hud.deckAria', 'ui.hud.deckCount',
    'ui.hud.deckTitle', 'ui.hud.menuAria', 'ui.hud.omenSub', 'ui.hud.omenTitle', 'ui.hud.potionTip', 'ui.hud.tossPotion',
    'ui.hud.usePotion', 'ui.keywords.chip', 'ui.keywords.cinder', 'ui.keywords.ember', 'ui.keywords.ember', 'ui.keywords.energy',
    'ui.keywords.facetDesc', 'ui.keywords.hex', 'ui.keywords.kindle', 'ui.keywords.shard', 'ui.keywords.staggered', 'ui.keywords.unplayable',
    'ui.keywords.ward', 'ui.lamp.artHint', 'ui.lamp.artLabel', 'ui.lamp.boonLabel', 'ui.lamp.sub', 'ui.lamp.title',
    'ui.map.click', 'ui.map.drag', 'ui.map.hint.boss', 'ui.map.hint.elite', 'ui.map.hint.event', 'ui.map.hint.monster',
    'ui.map.hint.rest', 'ui.map.hint.shop', 'ui.map.hint.treasure', 'ui.map.node.elite', 'ui.map.node.event', 'ui.map.node.monster',
    'ui.map.node.rest', 'ui.map.node.shop', 'ui.map.node.treasure', 'ui.map.scroll', 'ui.map.sealedDoor.aria', 'ui.map.sealedDoor.inscription',
    'ui.map.sealedDoor.label', 'ui.map.sealedDoor.return', 'ui.map.sealedDoor.sub', 'ui.map.sealedDoor.title', 'ui.map.survey', 'ui.map.tap',
    'ui.map.travelHere', 'ui.map.unlitBody', 'ui.map.unlitTitle', 'ui.map.witchlightBody', 'ui.map.witchlightTitle', 'ui.menu.abandon',
    'ui.menu.abandonConfirmBody', 'ui.menu.abandonConfirmTitle', 'ui.menu.abandonRun', 'ui.menu.back', 'ui.menu.beginAnew', 'ui.menu.beginAnew',
    'ui.menu.beginAnewBody', 'ui.menu.beginAnewTitle', 'ui.menu.beginClimb', 'ui.menu.beginClimb', 'ui.menu.chooseBoon', 'ui.menu.close',
    'ui.menu.close', 'ui.menu.continueClimb', 'ui.menu.fightOn', 'ui.menu.howToPlay', 'ui.menu.howToPlay', 'ui.menu.keepClimbing',
    'ui.menu.keepClimbing', 'ui.menu.lightTheWay', 'ui.menu.mute', 'ui.menu.mute', 'ui.menu.return', 'ui.menu.settings',
    'ui.menu.settings', 'ui.menu.theVigil', 'ui.menu.theVigil', 'ui.menu.unmute', 'ui.menu.unmute', 'ui.persistence.hollowRouteBody',
    'ui.persistence.reloadClimb', 'ui.persistence.reloadClimb', 'ui.persistence.reloadDestination', 'ui.persistence.reloadDuel', 'ui.persistence.reloadFinalisation', 'ui.persistence.retryFinalisation',
    'ui.persistence.retrySave', 'ui.persistence.retrySave', 'ui.persistence.retrySave', 'ui.persistence.retrySave', 'ui.persistence.runSaveBody', 'ui.persistence.runSaveRetryFail',
    'ui.persistence.saveFailedTitle', 'ui.persistence.saveFailedTitle', 'ui.persistence.stoneBody', 'ui.persistence.stoneTitle', 'ui.persistence.vigilBody', 'ui.persistence.vigilTitle',
    'ui.rest.healedFloat', 'ui.rest.restBtn', 'ui.rest.restHeal', 'ui.rest.smithBtn', 'ui.rest.smithSub', 'ui.rest.sub',
    'ui.rest.title', 'ui.rest.upgradeSub', 'ui.rest.upgradeTitle', 'ui.rest.upgradedSub', 'ui.rest.upgradedTitle', 'ui.reward.addCardRow',
    'ui.reward.bossRelicSub', 'ui.reward.bossRelicTitle', 'ui.reward.bossVanquished', 'ui.reward.cardAdded', 'ui.reward.chooseCardSub', 'ui.reward.chooseCardTitle',
    'ui.reward.eliteSlain', 'ui.reward.goldRow', 'ui.reward.leaveConfirmBody', 'ui.reward.leaveConfirmNo', 'ui.reward.leaveConfirmTitle', 'ui.reward.leaveConfirmYes',
    'ui.reward.perfectSeal', 'ui.reward.potionSlotsFull', 'ui.reward.takeNone', 'ui.reward.victory', 'ui.rose.dormantPane', 'ui.rose.finalWhisper',
    'ui.rose.openLabel', 'ui.rose.paneDark', 'ui.rose.selectedPane', 'ui.rose.shardRecovered', 'ui.rose.shardRecoveredShort', 'ui.rose.shardRecoveredShort',
    'ui.rose.unknownPane', 'ui.rose.whisperLogTitle', 'ui.settings.debugLabel', 'ui.settings.eraseEverything', 'ui.settings.music', 'ui.settings.resetConfirmBody',
    'ui.settings.resetConfirmTitle', 'ui.settings.resetSave', 'ui.settings.resetWarn', 'ui.settings.sfx', 'ui.settings.title', 'ui.shop.cardRemoval.desc',
    'ui.shop.cardRemoval.pickSub', 'ui.shop.cardRemoval.pickTitle', 'ui.shop.cardRemoval.title', 'ui.shop.greeting', 'ui.shop.leave', 'ui.shop.potionSlotsFull',
    'ui.shop.title', 'ui.treasure.coinsOnly', 'ui.treasure.empty', 'ui.treasure.empty', 'ui.treasure.openBtn', 'ui.treasure.relicClaim',
    'ui.treasure.sub', 'ui.treasure.title', 'ui.vigil.deeds', 'ui.vigil.roseWindow',
  ];
  const readJsRecursively = (directory) => readdirSync(directory, { withFileTypes: true })
    .flatMap((entry) => entry.isDirectory()
      ? readJsRecursively(new URL(`${entry.name}/`, directory))
      : entry.name.endsWith('.js') ? [readFileSync(new URL(entry.name, directory), 'utf8')] : []);
  const uiSources = [
    readFileSync(new URL('../src/ui.js', import.meta.url), 'utf8'),
    ...readJsRecursively(new URL('../src/ui/', import.meta.url)),
  ].join('\n');
  const actualTrKeys = [...uiSources.matchAll(/\btr\(\s*(['"])([^'"\n]+)\1/g)].map((match) => match[2]);
  assert.deepEqual(actualTrKeys.sort(), [...expectedTrKeys].sort(),
    'P1 extraction preserves the post-PR22 tr(...) locale-key multiset');
  assert.match(uiSources, /(?:const|function)\s+FACET_DESC\b[\s\S]*?=>\s*tr\(/,
    'FACET_DESC remains a lazy locale factory');
  assert.match(uiSources, /(?:const|function)\s+KEYWORDS\b[\s\S]*?=>\s*\(\{/, 'KEYWORDS remains a lazy factory');
  assert.match(uiSources, /\$\$\(\s*['"]\.kw['"]\s*,\s*(?:c|card)\s*\)/,
    'keyword decoration visits every keyword node on the card');
}

// ---- Round 5 normal Phase 2 transaction seam ------------------------------
{
  assert.deepEqual(Object.keys(RunEffectsModule), ['createRunEffects'],
    'run-effects exposes only its dependency-injected factory');
  const calls = [];
  const engine = {
    saveRun(run) { calls.push(['saveRun', run.runId]); return true; },
    buyQuestItem(run, itemId) { calls.push(['buyQuestItem', run.runId, itemId]); return { ok: true, reason: null }; },
    payHollowPrice(run) { calls.push(['payHollowPrice', run.runId]); return { ok: true, deferred: false, message: 'paid' }; },
    stageHollowExit(run) { calls.push(['stageHollowExit', run.runId]); return { kind: 'destination', nodeId: 'n1', type: 'shop', eventId: null }; },
    completePendingHollowRoute(run) { calls.push(['completePendingHollowRoute', run.runId]); return true; },
    beginShadeDuel(run, clear) { calls.push(['beginShadeDuel', run.runId]); return { status: clear() ? 'ready' : 'retry' }; },
    resumeShadeDuel(run, clear) { calls.push(['resumeShadeDuel', run.runId]); return { status: clear() ? 'ready' : 'retry' }; },
    journalTerminalOutcome(run, outcome) {
      calls.push(['journalTerminalOutcome', run.runId, outcome]);
      run.pendingRunEnd = { outcome };
      return run.pendingRunEnd;
    },
    stagePendingDawn(run, events, newUnlocks) {
      calls.push(['stagePendingDawn', run.runId, events.map((event) => event.t), [...newUnlocks]]);
      run.pendingRunEnd = null;
      run.pendingDawn = { events, cursor: 0, newUnlocks };
      return true;
    },
    recordRunEnd(run, won) { calls.push(['recordRunEnd', run.runId, won]); return true; },
    finaliseTerminalOutbox(run, persist, blocked, finalised) {
      calls.push(['finaliseTerminalOutbox', run.runId]);
      const result = persist();
      if (result?.accepted !== true) { blocked(); return false; }
      finalised(result);
      return true;
    },
    advancePendingDawn(run, nextCursor) { calls.push(['advancePendingDawn', run.runId, nextCursor]); return true; },
    completePendingDawn(run) { calls.push(['completePendingDawn', run.runId]); return true; },
  };
  const vigil = {
    syncVigil() { calls.push(['syncVigil']); return { shards: [] }; },
    setBequest(act, row, bequest) { calls.push(['setBequest', act, row, bequest]); return true; },
    clearBequest() { calls.push(['clearBequest']); return true; },
    clearNews() { calls.push(['clearNews']); return { news: false }; },
    clearVigil() { calls.push(['clearVigil']); return true; },
    commitPendingRunEnd(run, acknowledge) {
      calls.push(['commitPendingRunEnd', run.runId]);
      run.runEndResult = { whisper: 'The glass remembers.', newShards: ['hollowLamplighter'], vigil: { shards: ['hollowLamplighter'] } };
      run.vigilResult = { newUnlocks: ['aspect2'] };
      return {
        accepted: acknowledge(run), outcome: run.pendingRunEnd?.outcome || 'win',
        newUnlocks: ['aspect2'], ledger: run.runEndResult,
      };
    },
  };
  const effects = RunEffectsModule.createRunEffects({ engine, vigil });
  assert.deepEqual(Object.keys(effects), [
    'advanceDawn', 'beginShadeDuel', 'buildDawnQueue', 'buyQuestItem',
    'clearBequest', 'clearNews', 'clearVigil', 'completeDawn', 'completeHollowRoute', 'finaliseRunEnd',
    'journalRunEnd', 'payHollowPrice', 'resumeShadeDuel', 'saveRun',
    'setBequest', 'stageHollowExit', 'syncVigil',
  ], 'the normal effects adapter has one frozen caller-facing surface');
  assert.equal(Object.isFrozen(effects), true);

  const run = { runId: 'run-effects', endQueue: [{ t: 'questComplete', id: 'hollowLamplighter' }], shards: [] };
  assert.equal(effects.saveRun(run), true, 'initial and ordinary saves preserve their boolean result');
  assert.deepEqual(effects.buyQuestItem(run, 'flamelessLantern'), { ok: true, reason: null });
  assert.deepEqual(effects.payHollowPrice(run), { ok: true, deferred: false, message: 'paid' });
  assert.deepEqual(effects.stageHollowExit(run), { kind: 'destination', nodeId: 'n1', type: 'shop', eventId: null });
  assert.equal(effects.completeHollowRoute(run), true);
  assert.deepEqual(effects.beginShadeDuel(run), { status: 'ready' });
  let shadeAcknowledgements = 0;
  assert.deepEqual(effects.resumeShadeDuel(run, (action) => {
    shadeAcknowledgements++;
    return action();
  }), { status: 'ready' });
  assert.equal(shadeAcknowledgements, 1,
    'Shade recovery keeps caller-supplied persistence observation around the bequest acknowledgement');
  assert.equal(effects.setBequest(run, 2, 7, { kind: 'gold', amount: 50 }), true);
  assert.equal(effects.clearBequest(run), true);
  assert.deepEqual(effects.clearNews(), { news: false });
  assert.equal(effects.clearVigil(), true);
  assert.deepEqual(effects.syncVigil(), { shards: [] });

  assert.deepEqual(effects.journalRunEnd(run, 'win'), { outcome: 'win' });
  assert.equal(effects.saveRun(run), true);
  let blocked = 0;
  let completed = null;
  const finalised = effects.finaliseRunEnd(run, {
    revealThreshold: 1,
    persist: (action) => { calls.push(['persist']); return action(); },
    onPersistenceFailure: () => { blocked++; },
    onFinalised: (result) => { calls.push(['onFinalised']); completed = result; },
  });
  assert.equal(finalised, true);
  assert.equal(blocked, 0);
  assert.equal(completed.outcome, 'win');
  assert.deepEqual(completed.newUnlocks, ['aspect2']);
  assert.equal(run.pendingRunEnd, null);
  assert.deepEqual(run.pendingDawn.events.map((event) => event.t), [
    'whisper', 'shardGrant', 'act4Reveal',
  ], 'Dawn construction removes the superseded completion and preserves canonical order');
  assert.deepEqual(calls.slice(calls.findIndex(([name]) => name === 'journalTerminalOutcome')), [
    ['journalTerminalOutcome', 'run-effects', 'win'],
    ['saveRun', 'run-effects'],
    ['finaliseTerminalOutbox', 'run-effects'],
    ['persist'],
    ['commitPendingRunEnd', 'run-effects'],
    ['stagePendingDawn', 'run-effects', ['whisper', 'shardGrant', 'act4Reveal'], ['aspect2']],
    ['onFinalised'],
  ], 'terminal journalling, finalisation, durable commit and Dawn staging have one order');

  const queueSource = [{ t: 'pageRead', index: 1, text: 'page' }];
  const queueRun = { endQueue: queueSource, shards: ['a'] };
  const queueLedger = { newShards: ['b'], vigil: { shards: ['a', 'b'] } };
  const queue = effects.buildDawnQueue(queueRun, queueLedger, 2);
  queueSource[0].index = 9;
  queueLedger.newShards.push('c');
  assert.deepEqual(queue, [
    { t: 'pageRead', index: 1, text: 'page' },
    { t: 'shardGrant', id: 'b' },
    { t: 'act4Reveal' },
  ], 'Dawn queue snapshots source events and shard ids');
  assert.equal(effects.advanceDawn(run, 1), true);
  assert.equal(effects.completeDawn(run), true);

  let retryBlocked = 0;
  const retryRun = { runId: 'run-retry', pendingRunEnd: { outcome: 'death' } };
  assert.equal(effects.finaliseRunEnd(retryRun, {
    revealThreshold: 1,
    persist: () => ({ accepted: false }),
    onPersistenceFailure: () => { retryBlocked++; },
    onFinalised: () => assert.fail('a rejected commit must not continue'),
  }), false);
  assert.equal(retryBlocked, 1, 'rejected finalisation retains the caller-owned retry path');

  const runEffectsSource = readFileSync(new URL('../src/ui/run-effects.js', import.meta.url), 'utf8');
  const uiSource = readFileSync(new URL('../src/ui.js', import.meta.url), 'utf8');
  const combatSource = readFileSync(new URL('../src/ui/combat.js', import.meta.url), 'utf8');
  const overlaySource = readFileSync(new URL('../src/ui/overlay.js', import.meta.url), 'utf8');
  const screenSources = readdirSync(new URL('../src/ui/screens/', import.meta.url))
    .filter((name) => name.endsWith('.js'))
    .map((name) => readFileSync(new URL(`../src/ui/screens/${name}`, import.meta.url), 'utf8'))
    .join('\n');
  const readUiOwners = (directory, prefix = '') => readdirSync(directory, { withFileTypes: true })
    .flatMap((entry) => entry.isDirectory()
      ? readUiOwners(new URL(`${entry.name}/`, directory), `${prefix}${entry.name}/`)
      : entry.name.endsWith('.js')
        ? [[`${prefix}${entry.name}`, readFileSync(new URL(entry.name, directory), 'utf8')]]
        : []);
  const uiOwnerEntries = readUiOwners(new URL('../src/ui/', import.meta.url))
    .filter(([name]) => name !== 'run-effects.js');
  const uiOwnersSource = `${uiSource}\n${uiOwnerEntries.map(([, source]) => source).join('\n')}`;
  const uiWithoutOverlay = `${uiSource}\n${uiOwnerEntries
    .filter(([name]) => name !== 'overlay.js')
    .map(([, source]) => source).join('\n')}`;
  const endSource = readFileSync(new URL('../src/ui/screens/end.js', import.meta.url), 'utf8');
  assert.doesNotMatch(runEffectsSource, /\b(?:window|document|location|HTMLElement|requestAnimationFrame)\b/,
    'run-effects stays DOM-free and Node-runnable');
  for (const owner of [
    'saveRun', 'buyQuestItem', 'payHollowPrice', 'stageHollowExit', 'completePendingHollowRoute',
    'beginShadeDuel', 'resumeShadeDuel', 'journalTerminalOutcome',
    'finaliseTerminalOutbox', 'stagePendingDawn', 'advancePendingDawn',
    'completePendingDawn',
  ]) {
    assert.doesNotMatch(uiOwnersSource, new RegExp(`\\bE\\.${owner}\\s*\\(`), `${owner} has one owner in run-effects`);
    assert.equal((runEffectsSource.match(new RegExp(`\\bengine\\.${owner}\\s*\\(`, 'g')) || []).length, 1,
      `${owner} has exactly one engine delegation in run-effects`);
  }
  for (const owner of ['syncVigil', 'commitPendingRunEnd', 'setBequest', 'clearBequest', 'clearNews', 'clearVigil']) {
    const bareOwnerPattern = new RegExp(`(?<![.\\w])${owner}\\s*\\(`);
    const vigilNamespacePattern = new RegExp(`\\bVigil\\.${owner}\\s*\\(`);
    assert.match(`Vigil.${owner}()`, vigilNamespacePattern,
      `${owner} guard recognises a forbidden Vigil namespace call`);
    assert.doesNotMatch(uiOwnersSource, bareOwnerPattern, `${owner} has no bare UI owner`);
    assert.doesNotMatch(uiOwnersSource, vigilNamespacePattern, `${owner} has no Vigil namespace UI owner`);
    assert.equal((runEffectsSource.match(new RegExp(`\\bvigil\\.${owner}\\s*\\(`, 'g')) || []).length, 1,
      `${owner} has exactly one Vigil delegation in run-effects`);
  }
  assert.match(endSource, /runEffects\.finaliseRunEnd\s*\(/,
    'the extracted end-screen owner delegates mutation');
  assert.doesNotMatch(uiOwnersSource, /function\s+dawnQueue\s*\(/,
    'Dawn queue construction has no duplicate UI owner');
  assert.doesNotMatch(uiWithoutOverlay, /function\s+openPersistenceDialog\s*\(/,
    'retry UI has no duplicate screen or orchestrator owner');
  assert.match(overlaySource, /function\s+openPersistenceDialog\s*\(/,
    'retry UI is physically owned by overlay');
  assert.match(overlaySource, /let\s+persistenceDialogTransaction\s*=\s*null/,
    'overlay alone owns the persistence dialog transaction');
  assert.match(endSource, /function\s+(?:renderEnd|finalisePendingRunEnd)\s*\(/,
    'end-screen presentation is physically owned by its leaf module');
  assert.match(combatSource, /function\s+(?:startCombatUI|renderCombat)\s*\(/,
    'combat is physically owned by its extracted module');
  assert.doesNotMatch(uiSource, /function\s+(?:startCombatUI|renderCombat)\s*\(/,
    'the thin public UI entry retains no combat implementation');
}

// ---- Round 5 always-on presentation barrier -------------------------------
{
  const barrier = createPresentationBarrier({ strict: true });
  const order = [];
  const outer = barrier.begin('outer');
  const inner = barrier.begin('inner');
  assert.equal(barrier.activeCount(), 2, 'presentation barrier: nested tokens count');
  const idle = barrier.whenIdle().then(() => order.push('idle'));
  outer.finish();
  await Promise.resolve();
  assert.deepEqual(order, [], 'presentation barrier: nested work keeps whenIdle pending');
  inner.cancel();
  await idle;
  assert.deepEqual(order, ['idle'], 'presentation barrier: whenIdle resolves after final token');
  assert.equal(barrier.assertIdle(), true, 'presentation barrier: idle assertion');
  assert.throws(() => inner.finish(), /already finished/, 'presentation barrier: strict double finish');

  const runtime = createPresentationBarrier();
  const token = runtime.begin('runtime');
  assert.equal(token.finish(), true);
  assert.equal(token.finish(), false, 'presentation barrier: runtime double finish is idempotent');
  const destroyed = runtime.begin('destroyed');
  runtime.destroy();
  assert.equal(runtime.activeCount(), 0, 'presentation barrier: destroy cancels owned tokens');
  assert.equal(destroyed.finish(), false, 'presentation barrier: destroyed token fails open');
  assert.throws(() => runtime.begin('late'), /destroyed/, 'presentation barrier: begin after destroy rejected');
}

// ---- Round 5 semantic UI behaviour trace and standing gates ----------------
{
  assert.equal(TRACE_VERSION, 1);
  assert.deepEqual([...TRACE_END_OUTCOMES], [
    'completed', 'settled', 'cancelled', 'skipped', 'failed',
  ]);
  assert.deepEqual([...TRACE_POINT_OUTCOMES], [
    'accepted', 'rejected', 'completed', 'cancelled', 'failed',
  ]);
  assert.equal(Object.isFrozen(FORBIDDEN_TRACE_KEYS), true);
  assert.deepEqual([...FORBIDDEN_TRACE_KEYS], [
    'text', 'copy', 'html', 'label', 'run', 'cb', 'save', 'snapshot',
    'dom', 'pixi', 'pointerX', 'pointerY', 'frame', 'tick',
  ]);
  for (const [set, member, invented] of [
    [FORBIDDEN_TRACE_KEYS, 'html', 'invented-private-field'],
    [TRACE_END_OUTCOMES, 'settled', 'invented-end'],
    [TRACE_POINT_OUTCOMES, 'accepted', 'invented-point'],
  ]) {
    assert.throws(() => set.add(invented), /immutable/i);
    assert.throws(() => set.delete(member), /immutable/i);
    assert.throws(() => set.clear(), /immutable/i);
    assert.equal(set.has(member), true);
    assert.equal(set.has(invented), false);
    const owners = [];
    set.forEach((_value, _key, owner) => owners.push(owner));
    assert.ok(owners.length > 0);
    assert.ok(owners.every((owner) => owner === set), 'forEach exposes only the read-only facade');
    assert.equal(set.valueOf(), set, 'valueOf cannot expose mutable backing storage');
    assert.throws(() => Set.prototype.add.call(set, invented), TypeError);
    assert.throws(() => Set.prototype.delete.call(set, member), TypeError);
    assert.throws(() => Set.prototype.clear.call(set), TypeError);
    assert.equal(set.has(member), true);
    assert.equal(set.has(invented), false);
  }
  assert.equal(TRACE_END_OUTCOMES.size, 5);
  assert.deepEqual([...TRACE_END_OUTCOMES.keys()], [...TRACE_END_OUTCOMES]);
  assert.deepEqual([...TRACE_END_OUTCOMES.values()], [...TRACE_END_OUTCOMES]);
  assert.deepEqual([...TRACE_END_OUTCOMES.entries()], [...TRACE_END_OUTCOMES].map((value) => [value, value]));
  assert.equal(Object.prototype.toString.call(TRACE_END_OUTCOMES), '[object Set]');

  let now = 10;
  const trace = createBehaviourTrace({
    enabled: true, strict: true, capacity: 8, segment: 'page-a', now: () => now++,
    policy: () => ({ screen: 'combat', renderer: 'dom', motion: 'full', tier: 'full' }),
  });
  const input = trace.emit('input.card-drag', {
    phase: 'point', outcome: 'accepted', attributes: { uid: 7 },
  });
  const span = trace.begin('presentation.card-flight', {
    causeSeq: input.seq, correlationId: 'play-7', attributes: { uid: 7 },
  });
  span.finish('settled', { checkpoint: { queueDepth: 0 } });
  assert.deepEqual(trace.read({ format: 'contract' }).records.map((r) =>
    [r.seq, r.eventName, r.phase, r.outcome ?? null]), [
    [1, 'input.card-drag', 'point', 'accepted'],
    [2, 'presentation.card-flight', 'start', null],
    [3, 'presentation.card-flight', 'end', 'settled'],
  ]);
  const reset = trace.read({ after: { segment: 'page-old', seq: 99 }, format: 'records' });
  assert.equal(reset.reset, true);
  assert.equal(reset.records[0].seq, 1);
  assert.deepEqual(trace.assertIntegrity(), { ok: true, errors: [] });
  assert.throws(() => span.finish('settled'), /already finished/);
}
{
  const trace = createBehaviourTrace({ enabled: true, strict: true, segment: 'validation', now: () => 1 });
  const cycle = {};
  cycle.self = cycle;
  const malformed = [
    [{ attributes: { fn: () => {} } }, /function|JSON-safe/],
    [{ attributes: { cycle } }, /cycle|cyclic/],
    [{ attributes: { amount: Infinity } }, /finite/],
    [{ attributes: { semanticId: 'x'.repeat(129) } }, /128 bytes/],
    [{ attributes: { nested: { html: '<b>no</b>' } } }, /forbidden.*html/i],
    [{ attributes: { clientX: 12, clientY: 15 } }, /pointer/i],
    [{ attributes: { nested: { x: 12 } } }, /pointer/i],
    [{ attributes: { pointerType: 'touch' } }, /pointer/i],
    [{ attributes: { pressure: 0.5 } }, /pointer/i],
    [{ attributes: { tiltX: 12, tiltY: 15, twist: 2 } }, /pointer/i],
    [{ attributes: { altitudeAngle: 0.2, azimuthAngle: 0.4, persistentDeviceId: 9 } }, /pointer/i],
    [{ attributes: { altKey: false, ctrlKey: false, shiftKey: false, metaKey: false } }, /pointer/i],
    [{ attributes: { width: 20, height: 30, isPrimary: true, buttons: 1 } }, /pointer/i],
    [{ attributes: { seed: 1, act: 2, hp: 30, deck: ['strike'] } }, /save-shaped/i],
  ];
  for (const [details, pattern] of malformed) {
    assert.throws(() => trace.emit('input.invalid', { phase: 'point', ...details }), pattern);
  }
  for (const key of ['__proto__', 'Prototype', 'CONSTRUCTOR', '__pro-to__', 'pro.to.type', 'con struc-tor']) {
    const polluted = JSON.parse(`{"${key}":{"polluted":true}}`);
    assert.throws(() => trace.emit('input.invalid', { attributes: polluted }), /meta|prototype|forbidden/i);
  }
  for (const key of ['HtMl', 'html.', 'NAME', 'Value', 'Title', 'Description', 'Body', 'Message', 'Content', 'Tooltip', 'ariaLabel', 'ARIA-LABEL', 'aria label']) {
    assert.throws(() => trace.emit('input.invalid', {
      attributes: { [key]: 'edge' },
    }), /forbidden|privacy/i);
  }
  assert.throws(() => trace.emit('input.invalid', { attributes: { semanticId: 'Edge' } }), /lower-case-initial semantic token/i);
  assert.throws(() => trace.emit('input.invalid', { checkpoint: { state: 'Edge' } }), /lower-case-initial semantic token/i);
  assert.throws(() => trace.begin('presentation.invalid', {
    replay: { v: 1, presentationId: 'flight', fixtureId: 'card-7', params: { state: 'Edge' } },
  }), /lower-case-initial semantic token/i);
  assert.throws(() => trace.emit('', { attributes: { id: 'edge' } }), /non-empty|stable semantic token/i);
  assert.throws(() => trace.emit('input.invalid', { reason: '' }), /non-empty|stable semantic token/i);
  assert.throws(() => trace.emit('input.invalid', { correlationId: '' }), /non-empty|stable semantic token/i);
  assert.throws(() => trace.emit('input.invalid', { attributes: { id: '' } }), /non-empty|lower-case-initial semantic token/i);
  assert.throws(() => createBehaviourTrace({ enabled: true, strict: true, segment: '' }), /non-empty|stable semantic token/i);
  const emptyPolicy = createBehaviourTrace({
    enabled: true, strict: true, segment: 'empty-policy', now: () => 1,
    policy: () => ({ screen: '' }),
  });
  assert.throws(() => emptyPolicy.emit('checkpoint.policy'), /non-empty|stable semantic token/i);
  const safePayload = trace.emit('checkpoint.safe-payload', {
    attributes: {
      semanticId: 'unreadablePage',
      localeKey: 'ui.menu.beginClimb',
      actionId: 'beginClimb',
    },
  });
  assert.equal(Object.getPrototypeOf(safePayload.attributes), null);
  assert.equal(Object.hasOwn(safePayload.attributes, 'polluted'), false);
  assert.deepEqual(Object.keys(safePayload.attributes), ['semanticId', 'localeKey', 'actionId']);
  assert.deepEqual({ ...safePayload.attributes }, {
    semanticId: 'unreadablePage', localeKey: 'ui.menu.beginClimb', actionId: 'beginClimb',
  });
  assert.doesNotThrow(() => trace.emit('checkpoint.semantic-layout', {
    attributes: {
      type: 'damage', target: 'enemy-1', width: 2, height: 3,
      detail: 'compact', view: 'combat',
    },
  }));
  assert.throws(() => trace.emit('input.invalid', { phase: 'end' }), /point/);
  assert.throws(() => trace.emit('input.invalid', { outcome: 'settled' }), /point outcome/);
  assert.throws(() => trace.begin('presentation.invalid', { outcome: 'settled' }), /start|outcome/);
  assert.throws(() => trace.begin('presentation.invalid', {
    replay: { v: 1, presentationId: 'flight', fixtureId: 'card-7', unexpected: true },
  }), /Replay Descriptor.*unexpected/i);
  assert.throws(() => trace.begin('presentation.invalid', {
    attributes: { replay: { v: 1, presentationId: 'flight', fixtureId: 'card-7' } },
  }), /Replay Descriptor.*top-level/i);
  const replaySpan = trace.begin('presentation.valid', {
    replay: {
      v: 1, presentationId: 'card-flight', fixtureId: 'card-7', locale: 'en-GB',
      params: { cardId: 'strike', upgraded: false, count: 1 },
    },
  });
  replaySpan.finish('settled');
  assert.equal(trace.read({ format: 'records' }).records.at(-2).replay.presentationId, 'card-flight');

  const replay = (params) => trace.begin('presentation.bounded', {
    replay: { v: 1, presentationId: 'bounded', fixtureId: 'fixture', params },
  });
  let tooDeep = { value: 1 };
  for (let index = 0; index < 7; index += 1) tooDeep = { nested: tooDeep };
  assert.throws(() => replay(tooDeep), /Replay Descriptor.*depth/i);
  assert.throws(() => replay(Object.fromEntries(
    Array.from({ length: 33 }, (_, index) => [`key${index}`, index]),
  )), /Replay Descriptor.*key/i);
  assert.throws(() => replay(Array.from({ length: 33 }, (_, index) => index)), /Replay Descriptor.*array/i);
  const guardedOversizedArray = Array(33);
  Object.defineProperty(guardedOversizedArray, 0, {
    enumerable: true,
    get() { throw new Error('Replay Descriptor copied before checking its array bound'); },
  });
  assert.throws(() => replay(guardedOversizedArray), /Replay Descriptor.*array limit/i);
  assert.throws(() => replay(Array.from({ length: 32 }, () => ({ a: 1, b: 2 }))), /Replay Descriptor.*node/i);
  assert.throws(() => replay(Array.from({ length: 32 }, (_, index) => `v${index}${'x'.repeat(124)}`)), /Replay Descriptor.*serialised bytes/i);
}
{
  let identityCalls = 0;
  const trace = createBehaviourTrace({
    enabled: true,
    strict: true,
    segment: 'resettable',
    now: () => 1,
    identity: () => {
      identityCalls += 1;
      return { appVersion: '0.5.0' };
    },
  });
  trace.emit('checkpoint.before-reset');
  const oldCursor = trace.read({ format: 'records' }).cursor;
  trace.reset();
  trace.emit('checkpoint.after-reset');
  const resetRead = trace.read({ after: oldCursor, format: 'records' });
  assert.equal(resetRead.reset, true);
  assert.notEqual(resetRead.segment, oldCursor.segment);
  assert.equal(resetRead.records[0].seq, 1);
  assert.equal(resetRead.records[0].eventName, 'checkpoint.after-reset');
  assert.equal(identityCalls, 2, 'identity is injected exactly once for each segment generation');
}
{
  let now = 100;
  const trace = createBehaviourTrace({
    enabled: true,
    strict: true,
    capacity: 3,
    segment: 'overflow',
    now: () => now++,
  });
  for (let index = 0; index < 5; index += 1) {
    trace.emit('checkpoint.counter', { attributes: { index } });
  }
  const read = trace.read({ format: 'records' });
  assert.ok(read.dropped > 0);
  assert.ok(read.records.length <= 3);
  assert.equal(read.records.filter((record) => record.eventName === 'error.trace-overflow').length, 1);
  assert.equal(read.records.find((record) => record.eventName === 'error.trace-overflow').attributes.dropped, read.dropped);
  assert.equal(trace.assertIntegrity().ok, false);
}
{
  let now = 1;
  const trace = createBehaviourTrace({
    enabled: true, strict: true, capacity: 1, segment: 'capacity-one', now: () => now++,
  });
  trace.emit('checkpoint.first');
  const oldCursor = trace.read({ format: 'records' }).cursor;
  trace.emit('checkpoint.second');
  const reset = trace.read({ after: oldCursor, format: 'records' });
  assert.equal(reset.reset, true);
  assert.equal(reset.records.length, 1);
  assert.equal(reset.records[0].eventName, 'error.trace-overflow');
  assert.equal(reset.firstSeq, reset.lastSeq);
  assert.equal(reset.cursor.seq, reset.lastSeq);
  assert.equal(reset.dropped, 2);
  assert.equal(reset.records[0].attributes.dropped, 2);
  const caughtUp = trace.read({ after: reset.cursor, format: 'records' });
  assert.equal(caughtUp.reset, false);
  assert.deepEqual(caughtUp.records, []);
}
{
  const trace = createBehaviourTrace({ enabled: true, strict: true, segment: 'orphan', now: () => 1 });
  const span = trace.begin('presentation.orphan');
  assert.deepEqual(trace.activeSpans(), [{ seq: 1, eventName: 'presentation.orphan', correlationId: null }]);
  assert.equal(trace.assertIntegrity().ok, false);
  span.finish('cancelled');
  assert.deepEqual(trace.activeSpans(), []);
  assert.equal(trace.assertIntegrity().ok, true);
}
{
  const trace = createBehaviourTrace({ enabled: false, strict: true, segment: 'disabled' });
  assert.equal(trace.enabled, false);
  assert.equal(trace.emit('input.noop'), null);
  assert.equal(trace.begin('presentation.noop').finish('settled'), null);
  assert.deepEqual(trace.activeSpans(), []);
  const read = trace.read({ format: 'records' });
  assert.equal(Object.isFrozen(read), true);
  assert.deepEqual(read, {
    v: 1,
    enabled: false,
    format: 'records',
    segment: 'disabled',
    firstSeq: 0,
    lastSeq: 0,
    dropped: 0,
    reset: false,
    header: {
      v: 1, enabled: false, segment: 'disabled', firstSeq: 0, lastSeq: 0,
      dropped: 0, reset: false, identity: {},
    },
    cursor: { segment: 'disabled', seq: 0 },
    records: [],
    text: null,
    ndjson: null,
  });
}
{
  let now = 20;
  const trace = createBehaviourTrace({
    enabled: true,
    strict: true,
    segment: 'projection',
    now: () => now += 1.25,
    identity: () => ({ appVersion: '0.5.0', buildKind: 'dev', gitSha: 'abc1234', locale: 'en-GB' }),
    policy: () => ({ screen: 'combat', renderer: 'dom', motion: 'reduced', tier: 'lite' }),
  });
  const point = trace.emit('input.card-drag', {
    outcome: 'cancelled', reason: 'pointercancel', correlationId: 'drag-1',
    attributes: { uid: 7, stable: true },
  });
  trace.emit('checkpoint.queue', { outcome: 'completed', causeSeq: point.seq, attributes: { depth: 0 } });

  const initial = trace.read({ format: 'contract' });
  assert.equal(initial.reset, false);
  assert.equal(initial.header.identity.gitSha, undefined);
  assert.equal(JSON.stringify(initial).includes('atMs'), false);
  assert.equal(JSON.stringify(initial).includes('abc1234'), false);
  assert.equal(Object.isFrozen(initial.records[0]), true);

  const incremental = trace.read({ after: { segment: 'projection', seq: 1 }, format: 'records' });
  assert.equal(incremental.reset, false);
  assert.equal(incremental.header, null);
  assert.deepEqual(incremental.records.map((record) => record.seq), [2]);
  const caughtUp = trace.read({ after: incremental.cursor, format: 'text' });
  assert.equal(caughtUp.header, null);
  assert.equal(caughtUp.text, '');

  const foreign = trace.read({ after: { segment: 'other-page', seq: 1 }, format: 'text' });
  assert.equal(foreign.reset, true);
  assert.ok(foreign.text.startsWith('# trace '));
  const textLines = foreign.text.split('\n');
  assert.equal(textLines.length, 3);
  assert.match(textLines[1], /^\+000000\.0ms \[projection:1\] input\.card-drag phase=point outcome=cancelled screen=combat renderer=dom reason=pointercancel cause=- correlation=drag-1 attrs=\{"stable":true,"uid":7\}$/);
  assert.match(textLines[2], /\[projection:2\].*reason=- cause=1 correlation=- attrs=\{"depth":0\}$/);

  const ndjson = trace.read({ after: { segment: 'stale', seq: 999 }, format: 'ndjson' });
  assert.equal(ndjson.records.length, 0);
  assert.equal(ndjson.text, null);
  const rows = ndjson.ndjson.split('\n').map((line) => JSON.parse(line));
  assert.equal(rows[0].kind, 'trace-header');
  assert.deepEqual(rows.slice(1).map((row) => row.seq), [1, 2]);
  assert.equal(rows[0].identity.gitSha, 'abc1234');

  assert.throws(() => createBehaviourTrace({ enabled: true, strict: true, identity: () => ({ appVersion: 'v0.5' }) }), /appVersion/);
  assert.throws(() => createBehaviourTrace({ enabled: true, strict: true, identity: () => ({ buildKind: 'beta' }) }), /buildKind/);
  assert.throws(() => createBehaviourTrace({ enabled: true, strict: true, identity: () => ({ gitSha: 'long-and-invalid' }) }), /gitSha/);
  assert.throws(() => createBehaviourTrace({ enabled: true, strict: true, identity: () => ({ locale: '<script>' }) }), /locale/);
}
{
  let now = 1;
  const trace = createBehaviourTrace({ enabled: true, strict: false, segment: 'runtime', now: () => now++ });
  assert.equal(trace.emit('input.bad', { attributes: { html: '<b>bad</b>' } }), null);
  const span = trace.begin('presentation.good');
  assert.equal(span.finish('not-an-outcome'), null);
  assert.equal(span.finish('settled'), null);
  const errors = trace.read({ format: 'records' }).records.filter((record) => record.eventName === 'error.trace-integrity');
  assert.equal(errors.length, 3);
  assert.equal(trace.assertIntegrity().ok, false);
}
{
  let nowCalls = 0;
  const brokenNow = createBehaviourTrace({
    enabled: true,
    strict: false,
    capacity: 1,
    segment: 'broken-now',
    now: () => {
      nowCalls += 1;
      throw new Error('clock unavailable');
    },
  });
  assert.doesNotThrow(() => brokenNow.emit('checkpoint.clock'));
  assert.equal(nowCalls, 1, 'integrity fallback never retries a broken clock');
  assert.doesNotThrow(() => brokenNow.emit('checkpoint.clock'));
  assert.equal(nowCalls, 2);
  const overflow = brokenNow.read({ format: 'records' });
  assert.ok(overflow.records.length <= 1);
  assert.equal(overflow.records.filter((record) => record.eventName === 'error.trace-overflow').length, 1);

  let policyCalls = 0;
  const brokenPolicy = createBehaviourTrace({
    enabled: true,
    strict: false,
    segment: 'broken-policy',
    now: () => 1,
    policy: () => {
      policyCalls += 1;
      throw new Error('policy unavailable');
    },
  });
  assert.doesNotThrow(() => brokenPolicy.emit('checkpoint.policy'));
  assert.equal(policyCalls, 1, 'integrity fallback never retries a broken policy');
  assert.equal(brokenPolicy.read({ format: 'records' }).records[0].eventName, 'error.trace-integrity');

  let brokenIdentity;
  assert.doesNotThrow(() => {
    brokenIdentity = createBehaviourTrace({
      enabled: true,
      strict: false,
      segment: 'broken-identity',
      identity: () => { throw new Error('identity unavailable'); },
    });
  });
  assert.equal(brokenIdentity.read({ format: 'records' }).records[0].eventName, 'error.trace-integrity');
  assert.doesNotThrow(() => createBehaviourTrace({
    enabled: true,
    strict: false,
    segment: 'malformed-identity',
    identity: () => ({ buildKind: 'preview' }),
  }));
  let malformedDependencies;
  assert.doesNotThrow(() => {
    malformedDependencies = createBehaviourTrace({
      enabled: true,
      strict: false,
      segment: 'malformed-dependencies',
      now: null,
      policy: 'not-a-function',
      identity: 7,
    });
  });
  assert.equal(
    malformedDependencies.read({ format: 'records' }).records
      .filter((record) => record.eventName === 'error.trace-integrity').length,
    3,
  );
}
{
  const malformed = createBehaviourTrace({
    enabled: true, strict: false, capacity: 4, segment: 'bounded-diagnostics', now: () => 1,
  });
  for (let index = 0; index < 10_000; index += 1) {
    malformed.emit('checkpoint.invalid', { attributes: { title: 'edge' } });
  }
  assert.ok(malformed.read({ format: 'records' }).records.length <= 4);
  const malformedIntegrity = malformed.assertIntegrity();
  assert.match(malformedIntegrity.errors.join('\n'), /dropped 9996 integrity diagnostic/i);
  assert.ok(malformedIntegrity.errors.length <= 6);

  const spans = createBehaviourTrace({
    enabled: true, strict: false, capacity: 3, segment: 'bounded-spans', now: () => 1,
  });
  for (let index = 0; index < 10_000; index += 1) spans.begin('presentation.open');
  assert.equal(spans.activeSpans().length, 3);
  const spanIntegrity = spans.assertIntegrity();
  assert.match(spanIntegrity.errors.join('\n'), /dropped 9994 integrity diagnostic/i);
  assert.ok(spanIntegrity.errors.length <= 8);

  const strictSpans = createBehaviourTrace({
    enabled: true, strict: true, capacity: 2, segment: 'strict-span-cap', now: () => 1,
  });
  strictSpans.begin('presentation.first');
  strictSpans.begin('presentation.second');
  const beforeRejectedSpan = strictSpans.read({ format: 'records' }).lastSeq;
  assert.throws(() => strictSpans.begin('presentation.third'), /active span capacity/i);
  assert.equal(strictSpans.activeSpans().length, 2);
  assert.equal(strictSpans.read({ format: 'records' }).lastSeq, beforeRejectedSpan);
}
{
  const importProbe = spawnSync(process.execPath, ['--input-type=commonjs', '--eval', `
    const childProcess = require('node:child_process');
    const net = require('node:net');
    const { syncBuiltinESMExports } = require('node:module');
    childProcess.spawnSync = () => { throw new Error('spawn during import'); };
    net.createServer = () => { throw new Error('allocation during import'); };
    syncBuiltinESMExports();
    (async () => {
      await import(${JSON.stringify(new URL('../tools/run-with-strict-e2e-port.mjs', import.meta.url).href)});
      await import(${JSON.stringify(new URL('../tools/run-round5-standing-gates.mjs', import.meta.url).href)});
      process.stdout.write('import-only');
    })().catch((error) => { console.error(error); process.exitCode = 1; });
  `], { encoding: 'utf8' });
  assert.equal(importProbe.status, 0, importProbe.stderr);
  assert.equal(importProbe.stdout, 'import-only');

  let allocationCalls = 0;
  let spawnCalls = 0;
  assert.equal(typeof allocateStrictE2EPort, 'function');
  assert.equal(allocationCalls, 0, 'strict-port import performs no allocation');
  assert.equal(spawnCalls, 0, 'strict-port import performs no spawn');
  await assert.rejects(
    runWithStrictE2EPort({ argv: [], allocatePort: async () => { allocationCalls += 1; return 60001; } }),
    /non-empty argv/,
  );
  assert.equal(allocationCalls, 0, 'invalid argv is rejected before allocation');
  await assert.rejects(
    runWithStrictE2EPort({ argv: ['npm', 'test'], allocatePort: async () => 5174 }),
    /5174/,
  );
  const calls = [];
  const result = await runWithStrictE2EPort({
    argv: ['npm', 'run', 'test:e2e:main'],
    env: { HOME: '/tmp/home', SPIREBOUND_E2E_PORT: '49999' },
    allocatePort: async () => 60002,
    spawn: (command, args, options) => {
      spawnCalls += 1;
      calls.push({ command, args, options });
      return { status: 0, signal: null };
    },
  });
  assert.equal(result.port, 60002);
  assert.deepEqual(calls[0].command, 'npm');
  assert.deepEqual(calls[0].args, ['run', 'test:e2e:main']);
  assert.equal(calls[0].options.shell, false);
  assert.equal(calls[0].options.stdio, 'inherit');
  assert.equal(calls[0].options.env.HOME, '/tmp/home');
  assert.equal(calls[0].options.env.SPIREBOUND_E2E_PORT, '60002');

  const fakeServer = {
    unref() {},
    once() {},
    listen(_options, listener) { listener(); },
    address() { return { port: 5174 }; },
    close(listener) { listener(); },
  };
  await assert.rejects(
    allocateStrictE2EPort({ createServer: () => fakeServer }),
    /5174/,
  );
}
{
  const commands = {
    'p1-node': [
      ['npm', 'run', 'test:ci'],
      ['npm', 'test'],
    ],
    'p1-dom': [
      ['npm', 'run', 'test:ci'],
      ['npm', 'test'],
      ['npx', 'playwright', 'test', 'trace', 'battle', 'audio', '--project=desktop', '--workers=1'],
      ['npm', 'run', 'test:e2e:trace-production'],
    ],
    'p1-complete': [['npm', 'run', 'test:ci'], ['npm', 'test'], ['npx', 'playwright', 'test', 'trace', 'battle', 'audio', '--project=desktop', '--workers=1'], ['npm', 'run', 'test:e2e:trace-production'], ['npm', 'run', 'test:e2e:nonvisual']],
    'p2-base': [['npm', 'run', 'test:ci'], ['npm', 'test'], ['node', 'tools/wait-github-check.mjs', '--check', 'p2-base', '--timeout-ms', '600000']],
    p2: [['npm', 'run', 'test:ci'], ['npm', 'test'], ['node', 'tools/wait-github-check.mjs', '--check', 'p2-base', '--timeout-ms', '600000'], ['npm', 'run', 'test:content-registrations'], ['npm', 'run', 'test:act-coupling']],
    p3: [['npm', 'run', 'test:ci'], ['npm', 'test'], ['node', 'tools/wait-github-check.mjs', '--check', 'p2-base', '--timeout-ms', '600000'], ['npm', 'run', 'test:content-registrations'], ['npm', 'run', 'test:act-coupling'], ['node', 'tools/verify-production-surface.mjs'], ['npm', 'run', 'test:e2e:content-disk']],
    p4: [['npm', 'run', 'test:ci'], ['npm', 'test'], ['node', 'tools/wait-github-check.mjs', '--check', 'p2-base', '--timeout-ms', '600000'], ['npm', 'run', 'test:content-registrations'], ['npm', 'run', 'test:act-coupling'], ['node', 'tools/verify-production-surface.mjs'], ['npm', 'run', 'test:e2e:content-disk'], ['npm', 'run', 'test:e2e:webkit'], ['npm', 'run', 'test:e2e:perf'], ['node', 'tools/check-bundle-budget.mjs']],
    p5: [['npm', 'run', 'test:ci'], ['npm', 'test'], ['node', 'tools/wait-github-check.mjs', '--check', 'p2-base', '--timeout-ms', '600000'], ['npm', 'run', 'test:content-registrations'], ['npm', 'run', 'test:act-coupling'], ['node', 'tools/verify-production-surface.mjs'], ['npm', 'run', 'test:e2e:content-disk'], ['npm', 'run', 'test:e2e:webkit'], ['npm', 'run', 'test:e2e:perf'], ['node', 'tools/check-bundle-budget.mjs'], ['npm', 'run', 'test:e2e:leak']],
    p6: [['npm', 'run', 'test:ci'], ['npm', 'test'], ['node', 'tools/wait-github-check.mjs', '--check', 'p2-base', '--timeout-ms', '600000'], ['npm', 'run', 'test:content-registrations'], ['npm', 'run', 'test:act-coupling'], ['node', 'tools/verify-production-surface.mjs'], ['npm', 'run', 'test:e2e:content-disk'], ['npm', 'run', 'test:e2e:webkit'], ['npm', 'run', 'test:e2e:perf'], ['node', 'tools/check-bundle-budget.mjs'], ['npm', 'run', 'test:e2e:leak'], ['npx', 'playwright', 'test', 'p6-screens', 'end-ceremony', 'contrast', 'stage', 'trace', '--project=desktop', '--project=portrait', '--project=landscape', '--workers=1', '--no-deps']],
    full: [['npm', 'run', 'test:ci'], ['npm', 'test'], ['node', 'tools/wait-github-check.mjs', '--check', 'p2-base', '--timeout-ms', '600000'], ['npm', 'run', 'test:content-registrations'], ['npm', 'run', 'test:act-coupling'], ['node', 'tools/verify-production-surface.mjs'], ['npm', 'run', 'test:e2e:content-disk'], ['npm', 'run', 'test:e2e:webkit'], ['npm', 'run', 'test:e2e:perf'], ['node', 'tools/check-bundle-budget.mjs'], ['npm', 'run', 'test:e2e:leak'], ['npx', 'playwright', 'test', 'p6-screens', 'end-ceremony', 'contrast', 'stage', 'trace', '--project=desktop', '--project=portrait', '--project=landscape', '--workers=1', '--no-deps'], ['npm', 'run', 'test:e2e:visual']],
  };
  assert.equal(Object.isFrozen(STANDING_GATE_PROFILES), true);
  for (const [profile, expected] of Object.entries(commands)) {
    assert.deepEqual(STANDING_GATE_PROFILES[profile].map((row) => row.argv), expected, `standing gates: ${profile} literal cumulative commands`);
    assert.equal(Object.isFrozen(STANDING_GATE_PROFILES[profile]), true);
  }
  const optionalRows = Object.values(STANDING_GATE_PROFILES).flat().filter((row) => row.optional);
  assert.ok(optionalRows.length > 0);
  assert.ok(optionalRows.every((row) => row.argv.join(' ') === 'npm run test:e2e:content-disk'));

  let nextPort = 61000;
  const spawned = [];
  const recorded = [];
  const result = await runStandingGates({
    profile: 'p1-dom',
    allocatePort: async () => ++nextPort,
    spawn: (command, args, options) => {
      spawned.push({ command, args, options });
      return { status: 0, signal: null };
    },
    record: (row) => recorded.push(row),
  });
  assert.equal(result.status, 0);
  assert.deepEqual(spawned.map((call) => [call.command, ...call.args]), commands['p1-dom']);
  assert.deepEqual(spawned.filter((call) => call.options.env.SPIREBOUND_E2E_PORT).map((call) => Number(call.options.env.SPIREBOUND_E2E_PORT)), [61001, 61002]);
  assert.ok(spawned.every((call) => call.options.shell === false));
  assert.deepEqual(recorded.map((row) => row.status), [0, 0, 0, 0]);

  const p2BaseSpawned = [];
  const p2BaseResult = await runStandingGates({
    profile: 'p2-base',
    allocatePort: async () => { throw new Error('p2-base profile allocated a port'); },
    spawn: (executable, args, options) => {
      p2BaseSpawned.push({ argv: [executable, ...args], options });
      return { status: 0, signal: null };
    },
    record: () => {},
  });
  assert.equal(p2BaseResult.status, 0);
  assert.deepEqual(p2BaseSpawned.map((call) => call.argv), commands['p2-base']);
  assert.equal(p2BaseSpawned[0].options.timeout, undefined);
  assert.equal(p2BaseSpawned[1].options.timeout, undefined);
  assert.equal(p2BaseSpawned[2].options.timeout, 600000);

  let fullPort = 62000;
  const fullSpawned = [];
  const fullResult = await runStandingGates({
    profile: 'full',
    allocatePort: async () => ++fullPort,
    isOptionalAvailable: () => false,
    spawn: (executable, args, options) => {
      fullSpawned.push({ executable, args, options });
      return { status: 0, signal: null };
    },
    record: () => {},
  });
  assert.equal(fullResult.status, 0);
  assert.deepEqual(
    fullSpawned.map(({ executable, args }) => [executable, ...args]),
    commands.full.filter((argv) => argv.join(' ') !== 'npm run test:e2e:content-disk'),
  );
  const fullPorts = fullSpawned
    .map((call) => Number(call.options.env.SPIREBOUND_E2E_PORT))
    .filter(Number.isInteger);
  assert.equal(fullPorts.length, 5);
  assert.equal(new Set(fullPorts).size, fullPorts.length);
  assert.ok(fullPorts.every((port) => port !== 5174));

  let fullPresentPort = 63000;
  const fullPresentSpawned = [];
  const fullPresentResult = await runStandingGates({
    profile: 'full',
    allocatePort: async () => ++fullPresentPort,
    isOptionalAvailable: () => true,
    spawn: (executable, args, options) => {
      fullPresentSpawned.push({ executable, args, options });
      return { status: 0, signal: null };
    },
    record: () => {},
  });
  assert.equal(fullPresentResult.status, 0);
  assert.deepEqual(
    fullPresentSpawned.map(({ executable, args }) => [executable, ...args]),
    commands.full,
  );
  const fullPresentPorts = fullPresentSpawned
    .map((call) => Number(call.options.env.SPIREBOUND_E2E_PORT))
    .filter(Number.isInteger);
  assert.equal(fullPresentPorts.length, 6);
  assert.equal(new Set(fullPresentPorts).size, fullPresentPorts.length);
  assert.ok(fullPresentPorts.every((port) => port !== 5174));

  let failures = 0;
  const failFast = await runStandingGates({
    profile: 'p1-node',
    spawn: () => ({ status: ++failures === 1 ? 7 : 0, signal: null }),
    allocatePort: async () => { throw new Error('Node-only profile allocated a port'); },
    record: () => {},
  });
  assert.equal(failFast.status, 7);
  assert.equal(failures, 1);
  await assert.rejects(runStandingGates({ profile: 'not-a-profile' }), /Unknown standing-gate profile/);
}
{
  const { runCommand, waitGithubCheck } = await import('../tools/wait-github-check.mjs');
  const cleanRepo = Object.freeze({
    getGitStatusPorcelain: () => '',
    getHeadSha: () => 'abc123',
    getUpstreamSha: () => 'abc123',
  });
  const ghVersionOk = { code: 0, stdout: 'gh version 2.0.0', stderr: '' };
  const killedCommand = await runCommand([
    process.execPath, '--eval', 'setInterval(() => {}, 1000)',
  ], { timeoutMs: 20 });
  assert.equal(killedCommand.code, 124);
  assert.equal(killedCommand.timedOut, true);
  assert.match(killedCommand.stderr, /command timed out after 20 ms/);
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
  await assert.rejects(
    () => waitGithubCheck({
      checkName: 'p2-base',
      ...cleanRepo,
      runCommand: async (argv) => {
        if (argv[0] === 'gh' && argv[1] === '--version') return { code: 127, stdout: '', stderr: 'gh: command not found' };
        return { code: 0, stdout: '', stderr: '' };
      },
    }),
    /gh CLI is required.*command not found/i,
  );
  await assert.rejects(
    () => waitGithubCheck({
      checkName: 'p2-base',
      ...cleanRepo,
      runCommand: async (argv) => {
        if (argv[0] === 'gh' && argv[1] === '--version') return ghVersionOk;
        if (argv[0] === 'gh' && argv[1] === 'api') return { code: 1, stdout: '[]', stderr: '' };
        return { code: 0, stdout: '', stderr: '' };
      },
    }),
    /gh check-runs failed with exit code 1/i,
  );
  const failed = await waitGithubCheck({
    checkName: 'p2-base',
    timeoutMs: 1000,
    pollMs: 10,
    ...cleanRepo,
    runCommand: async (argv) => {
      if (argv[0] === 'gh' && argv[1] === '--version') return ghVersionOk;
      if (argv[0] === 'gh' && argv[1] === 'api') {
        return {
          code: 0,
          stdout: JSON.stringify({
            check_runs: [{
              name: 'p2-base',
              status: 'completed',
              conclusion: 'failure',
              html_url: 'https://example/fail',
            }],
          }),
          stderr: '',
        };
      }
      return { code: 0, stdout: '', stderr: '' };
    },
  });
  assert.equal(failed.status, 1);
  assert.equal(failed.url, 'https://example/fail');
  const waitForCheckRow = (row) => waitGithubCheck({
    checkName: 'p2-base',
    timeoutMs: 1000,
    pollMs: 10,
    ...cleanRepo,
    runCommand: async (argv) => {
      if (argv[0] === 'gh' && argv[1] === '--version') return ghVersionOk;
      if (argv[0] === 'gh' && argv[1] === 'api') {
        return {
          code: 0,
          stdout: JSON.stringify({ check_runs: [{ name: 'p2-base', html_url: 'https://example/non-success', ...row }] }),
          stderr: '',
        };
      }
      return { code: 0, stdout: '', stderr: '' };
    },
  });
  for (const row of [
    { status: 'completed', conclusion: 'skipped' },
    { status: 'completed', conclusion: 'neutral' },
    { state: 'SKIPPED' },
    { state: 'SUCCESS', conclusion: 'neutral' },
  ]) {
    const nonSuccess = await waitForCheckRow(row);
    assert.equal(nonSuccess.status, 1);
    assert.equal(nonSuccess.url, 'https://example/non-success');
  }
  let clock = 0;
  const slept = [];
  const timedOut = await waitGithubCheck({
    checkName: 'p2-base',
    timeoutMs: 25,
    pollMs: 10,
    now: () => clock,
    sleep: async (ms) => { slept.push(ms); clock += ms; },
    ...cleanRepo,
    runCommand: async (argv) => {
      if (argv[0] === 'gh' && argv[1] === '--version') return ghVersionOk;
      if (argv[0] === 'gh' && argv[1] === 'api') return { code: 0, stdout: JSON.stringify({ check_runs: [] }), stderr: '' };
      return { code: 0, stdout: '', stderr: '' };
    },
  });
  assert.equal(timedOut.status, 1);
  assert.deepEqual(slept, [10, 10, 5]);
  const hungStarted = Date.now();
  const hung = await waitGithubCheck({
    checkName: 'p2-base',
    timeoutMs: 20,
    pollMs: 1,
    ...cleanRepo,
    runCommand: async (argv) => {
      if (argv[0] === 'gh' && argv[1] === '--version') return ghVersionOk;
      if (argv[0] === 'gh' && argv[1] === 'api') return new Promise(() => {});
      return { code: 0, stdout: '', stderr: '' };
    },
  });
  assert.equal(hung.status, 1);
  assert.ok(Date.now() - hungStarted < 500, 'hung gh command is bounded by the wait timeout');
  const apiCalls = [];
  const ok = await waitGithubCheck({
    checkName: 'p2-base',
    timeoutMs: 1000,
    pollMs: 10,
    now: (() => { let t = 0; return () => { t += 5; return t; }; })(),
    sleep: async () => {},
    ...cleanRepo,
    runCommand: async (argv) => {
      if (argv[0] === 'gh' && argv[1] === '--version') return ghVersionOk;
      if (argv[0] === 'gh' && argv[1] === 'api') {
        apiCalls.push(argv);
        return {
          code: 0,
          stdout: JSON.stringify({
            check_runs: [{
              name: 'p2-base',
              status: 'completed',
              conclusion: 'success',
              html_url: 'https://example/run',
            }],
          }),
          stderr: '',
        };
      }
      return { code: 0, stdout: '', stderr: '' };
    },
  });
  assert.equal(ok.status, 0);
  assert.equal(ok.url, 'https://example/run');
  assert.equal(apiCalls.length, 1);
  assert.deepEqual(apiCalls[0].slice(0, 4), ['gh', 'api', '--method', 'GET']);
  assert.match(apiCalls[0][4], /repos\/\{owner\}\/\{repo\}\/commits\/abc123\/check-runs\?per_page=100/);
  assert.equal(apiCalls[0].includes('checks'), false);
}

// ---- unit checks -----------------------------------------------------------
{
  assert.equal(formatVersionDisplay('1.2.3', 'abc1234', true), '1.2.3');
  assert.equal(formatVersionDisplay('1.2.3', 'abc1234', false), '1.2.3+abc1234');
  assert.equal(formatVersionDisplay('1.2.3', '', false), '1.2.3+unknown');
  assert.equal(formatVersionDisplay('1.2.3', 'unknown', false), '1.2.3+unknown');
}
{
  let aborted = false;
  const neverResolves = (_url, { signal }) => new Promise((_resolve, reject) => {
    signal.addEventListener('abort', () => {
      aborted = true;
      reject(new Error('aborted'));
    }, { once: true });
  });
  await assert.rejects(
    fetchAudioSelectionJson('/audio-selection.json', { fetchImpl: neverResolves, timeoutMs: 5 }),
    /timed out after 5 ms/,
    'audio selection: a stalled host response cannot block boot indefinitely',
  );
  assert.equal(aborted, true, 'audio selection: timeout aborts the stalled request');
  await assert.rejects(
    fetchAudioSelectionJson('/audio-selection.json', {
      fetchImpl: () => { throw new Error('synchronous fetch failure'); },
      timeoutMs: 5,
    }),
    /synchronous fetch failure/,
    'audio selection: a synchronous fetch failure still clears its timeout',
  );
}
{
  const inventory = {
    music: ['stained-glass-v1/title.mp3'],
    sfx: ['ashglass-v1/click.mp3'],
  };
  const selection = {
    music: { version: BASE_AUDIO_VERSIONS.music, overrides: {} },
    sfx: { version: BASE_AUDIO_VERSIONS.sfx, overrides: {} },
  };
  assert.equal(
    resolveAudioRef('music', 'title', inventory, selection),
    'stained-glass-v1/title.mp3',
    'audio packs: base Music Cue resolves by canonical filename',
  );
  inventory.music.push('draft/title-alt.mp3');
  selection.music.overrides.title = 'draft/title-alt.mp3';
  assert.equal(
    resolveAudioRef('music', 'title', inventory, selection),
    'draft/title-alt.mp3',
    'audio packs: a per-Cue file override wins over the selected pack',
  );
  inventory.music.push('stained-glass-v2/title.mp3');
  selection.music = { version: 'stained-glass-v2', overrides: { title: 'missing/nope.mp3' } };
  assert.equal(
    resolveAudioRef('music', 'title', inventory, selection),
    'stained-glass-v2/title.mp3',
    'audio packs: an unavailable override falls through to the selected pack',
  );
  const invalid = validateAudioSelection(selection, inventory);
  assert.ok(
    invalid.some((problem) => problem.includes('music.overrides.title')),
    'audio packs: selection validation rejects an unavailable override',
  );
  assert.ok(
    invalid.some((problem) => problem.includes('music.version') && problem.includes('incomplete')),
    'audio packs: whole-pack selection rejects an incomplete version',
  );
  const defaults = {
    music: { version: BASE_AUDIO_VERSIONS.music, overrides: {} },
    sfx: { version: BASE_AUDIO_VERSIONS.sfx, overrides: {} },
  };
  assert.deepEqual(DEFAULT_AUDIO_SELECTION, defaults, 'audio packs: runtime fallback selects both immutable base packs');
  assert.deepEqual(
    JSON.parse(serializeAudioSelection(defaults)),
    defaults,
    'audio packs: persisted selection serialises as deterministic JSON',
  );
  assert.equal(
    audioRefFromPath('music', './assets/musics/title.mp3'),
    'stained-glass-v1/title.mp3',
    'audio packs: current root Music files belong to the immutable base version',
  );
  assert.equal(
    audioRefFromPath('sfx', './assets/sfx/ashglass-v2/click-soft.mp3'),
    'ashglass-v2/click-soft.mp3',
    'audio packs: version directory becomes the stable selectable asset ref',
  );
  assert.equal(
    audioRefFromPath('music', './assets/musics/stained-glass-v1/title.mp3'),
    null,
    'audio packs: the base version id is reserved for root files',
  );
  assert.deepEqual(
    rankAudioRefs('sfx', 'click', [
      'ashglass-v2/art.mp3',
      'ashglass-v2/click.mp3',
      'ashglass-v1/hover.mp3',
      'ashglass-v1/click.mp3',
      'draft/click-soft.mp3',
    ], { exclude: 'ashglass-v1/click.mp3' }),
    [
      'ashglass-v2/click.mp3',
      'ashglass-v1/hover.mp3',
      'ashglass-v2/art.mp3',
      'draft/click-soft.mp3',
    ],
    'audio packs: gallery omits pack default and ranks other same-action versions first',
  );
  const currentFiles = (kind, dir) => readdirSync(new URL(dir, import.meta.url), { withFileTypes: true })
    .filter((entry) => entry.isFile() && entry.name.endsWith('.mp3'))
    .map((entry) => `${BASE_AUDIO_VERSIONS[kind]}/${entry.name}`)
    .sort();
  const currentInventory = {
    music: currentFiles('music', '../src/assets/musics/'),
    sfx: currentFiles('sfx', '../src/assets/sfx/'),
  };
  assert.equal(currentInventory.music.length, 22, 'audio packs: base music version keeps all 22 Music Cues');
  assert.equal(currentInventory.sfx.length, 36, 'audio packs: base SFX version keeps all 36 physical samples');
  assert.deepEqual(
    validateAudioSelection(DEFAULT_AUDIO_SELECTION, currentInventory),
    [],
    'audio packs: both immutable base versions are complete and selectable',
  );
  const musicManifest = JSON.parse(readFileSync(new URL('../src/assets/musics/manifest.json', import.meta.url), 'utf8'));
  const sfxManifest = JSON.parse(readFileSync(new URL('../src/assets/sfx/manifest.json', import.meta.url), 'utf8'));
  assert.equal(musicManifest.pack_id, BASE_AUDIO_VERSIONS.music, 'audio packs: base Music manifest has a stable version id');
  assert.equal(Object.keys(musicManifest.items).length, 22, 'audio packs: base Music manifest covers every Cue');
  assert.equal(Object.values(musicManifest.items).filter((item) => item.wired).length, 22, 'audio packs: all 22 Music Cues are live');
  assert.equal(Object.values(musicManifest.items).filter((item) => !item.wired).length, 0, 'audio packs: no Music Cues remain unwired');
  for (const [id, item] of Object.entries(musicManifest.items)) {
    assert.equal(item.file, canonicalAudioFilename('music', id), `audio packs: ${id} keeps its canonical Music filename`);
    assert.ok(currentInventory.music.includes(`${BASE_AUDIO_VERSIONS.music}/${item.file}`), `audio packs: ${id} Music file exists`);
  }
  assert.equal(sfxManifest.pack_id, BASE_AUDIO_VERSIONS.sfx, 'audio packs: base SFX manifest has a stable version id');
  assert.equal(Object.keys(sfxManifest.items).length, 36, 'audio packs: base SFX manifest covers every physical sample');
  for (const [id, item] of Object.entries(sfxManifest.items)) {
    assert.ok(item.requested_duration_seconds >= 0.5, `audio packs: ${id} records ElevenLabs request duration`);
    assert.ok(item.prompt_influence >= 0 && item.prompt_influence <= 1, `audio packs: ${id} records prompt influence`);
  }
  assert.ok(MUSIC_CATALOG.every((row) => row.wired), 'audio catalog: every Music Cue is wired');
  const sampleMusic = { combat: 'paleOnes', boss: 'usurper' };
  assert.equal(resolveCombatCue('monster', sampleMusic), 'paleOnes');
  assert.equal(resolveCombatCue('elite', sampleMusic), 'elite');
  assert.equal(resolveCombatCue('boss', sampleMusic), 'usurper');
  assert.equal(resolveCombatCue('monster', { combat: 'act1Combat', boss: 'act1Boss' }, { questId: 'paleOnes' }), 'paleOnes');
  assert.equal(resolveCombatCue('monster', { combat: 'act2Combat', boss: 'act2Boss' }, { questId: 'ownShade' }), 'shadeDuel');
  assert.equal(resolveCombatCue('boss', { combat: 'act3Combat', boss: 'act3Boss' }, { questId: 'usurper' }), 'usurper');
  assert.equal(resolveCombatCue('elite', sampleMusic, { omenId: 'eighthOmen' }), 'eighthOmen');
  assert.equal(resolveCombatCue('boss', { combat: 'act1Combat', boss: 'act1Boss' }, { omenId: 'eighthOmen' }), 'act1Boss', 'Eighth Omen does not steal boss cues');
  assert.equal(resolveCombatCue('monster', sampleMusic, { questId: 'paleOnes', omenId: 'eighthOmen' }), 'paleOnes');
  assert.equal(resolveScreenCue('hollow'), 'hollowLamplighter');
  assert.equal(resolveScreenCue('map', 'eighthOmen'), 'eighthOmen');
  assert.equal(resolveScreenCue('reward'), null, 'reward holds the cue selected before navigation');
  assert.equal(resolveScreenCue('bossRelic'), null, 'boss relic holds the cue selected before navigation');
  assert.equal(SCREEN_CUES.lamplighter, 'map');
  assert.equal(dawnEventCue({ t: 'pageRead' }), 'unreadablePage');
  assert.equal(dawnEventCue({ t: 'act4Reveal' }), 'sealedDoor');
  assert.equal(dawnEventCue({ t: 'whisper' }), null);
  const completeV2Inventory = {
    music: [
      ...currentInventory.music,
      ...Object.keys(musicManifest.items).map((id) => `stained-glass-v2/${canonicalAudioFilename('music', id)}`),
    ],
    sfx: [
      ...currentInventory.sfx,
      ...Object.keys(sfxManifest.items).map((id) => `ashglass-v2/${canonicalAudioFilename('sfx', id)}`),
    ],
  };
  const independentV2Selection = {
    music: { version: 'stained-glass-v2', overrides: {} },
    sfx: { version: BASE_AUDIO_VERSIONS.sfx, overrides: {} },
  };
  assert.deepEqual(
    validateAudioSelection(independentV2Selection, completeV2Inventory),
    [],
    'audio packs: a complete Music v2 can switch independently of SFX',
  );
  assert.equal(
    resolveAudioRef('music', 'title', completeV2Inventory, independentV2Selection),
    'stained-glass-v2/title.mp3',
    'audio packs: complete Music v2 resolves its canonical Cue file',
  );
  const bothV2Selection = {
    ...independentV2Selection,
    sfx: { version: 'ashglass-v2', overrides: {} },
  };
  assert.deepEqual(
    validateAudioSelection(bothV2Selection, completeV2Inventory),
    [],
    'audio packs: a complete SFX v2 can switch without changing the Music contract',
  );
  assert.equal(
    resolveAudioRef('sfx', 'atkHeroMed', completeV2Inventory, bothV2Selection),
    'ashglass-v2/atkHeroMed.mp3',
    'audio packs: complete SFX v2 resolves its canonical gameplay file',
  );
  // public/audio-selection.json is the ?audio=1 Save target — any valid installed
  // selection is allowed (whole packs and/or per-id overrides), not a pinned v2 default.
  const persistedRaw = readFileSync(new URL('../public/audio-selection.json', import.meta.url), 'utf8');
  const persistedSelection = JSON.parse(persistedRaw);
  assert.deepEqual(
    validateAudioSelection(persistedSelection, completeV2Inventory),
    [],
    'audio packs: ?audio=1 save (public/audio-selection.json) is valid for the installed inventory',
  );
  const accepted = normaliseAudioSelection(persistedSelection, completeV2Inventory);
  assert.deepEqual(accepted.problems, [], 'audio packs: ?audio=1 save normalises without falling back to base packs');
  assert.deepEqual(
    accepted.selection,
    {
      music: { version: persistedSelection.music.version, overrides: { ...persistedSelection.music.overrides } },
      sfx: { version: persistedSelection.sfx.version, overrides: { ...persistedSelection.sfx.overrides } },
    },
    'audio packs: ?audio=1 save keeps the chosen versions and overrides',
  );
  assert.equal(
    persistedRaw,
    serializeAudioSelection(accepted.selection),
    'audio packs: public/audio-selection.json matches the gallery Save serialiser',
  );
  const rejected = normaliseAudioSelection({
    music: { version: 'missing', overrides: {} },
    sfx: { version: BASE_AUDIO_VERSIONS.sfx, overrides: {} },
  }, currentInventory);
  assert.deepEqual(rejected.selection, DEFAULT_AUDIO_SELECTION, 'audio packs: invalid runtime data falls back to both base packs');
  assert.ok(rejected.problems.length > 0, 'audio packs: invalid runtime data retains diagnostics');
  assert.ok(
    validateAudioSelection({ ...defaults, extra: true }, currentInventory).some((problem) => problem.includes('unknown key')),
    'audio packs: selection schema rejects unknown root keys',
  );
  const generatorCheck = spawnSync(
    'python3',
    ['tools/gen-sfx-from-ledger.py', '--check-ledger'],
    { encoding: 'utf8' },
  );
  assert.equal(generatorCheck.status, 0, `SFX ledger generator contract: ${generatorCheck.stderr}`);
  const generatorReport = JSON.parse(generatorCheck.stdout);
  assert.equal(generatorReport.count, 36, 'SFX ledger: generation parameters cover all physical ids');
  assert.ok(generatorReport.min_requested_duration_seconds >= 0.5, 'SFX ledger: API request duration honours the 0.5s minimum');
  assert.ok(generatorReport.distinct_prompt_influences.length > 1, 'SFX ledger: prompt influence is tuned per id');
  assert.deepEqual(generatorReport.loop, [false], 'SFX ledger: every generated request is a one-shot');
  assert.deepEqual(generatorReport.model_id, ['eleven_text_to_sound_v2'], 'SFX ledger: generator pins the accepted model');
  assert.ok(generatorReport.target_ranges > 1, 'SFX ledger: post-trim targets remain distinct from request duration');
  assert.equal(generatorReport.exact_targets, true, 'SFX ledger: downloaded v2 trim targets stay exact');
  assert.equal(generatorReport.global_suffix_applied, true, 'SFX ledger: every API prompt receives the anti-musical suffix');
  assert.equal(generatorReport.target_fit_enforced, true, 'SFX ledger: exact post-trim targets are enforced');
  assert.match(generatorReport.target_fit_example, /atempo=.*atrim=duration=0\.080/, 'SFX ledger: short micro-sounds are stretched without silence padding');
  assert.equal(generatorReport.silence_padding, false, 'SFX ledger: target fitting never manufactures silent tails');
  assert.equal(generatorReport.mono_compatible_mix, true, 'SFX ledger: generated one-shots are centred for mono playback');
  assert.equal(generatorReport.output_sample_rate_hz, 48000, 'SFX ledger: generated one-shots use a stable 48 kHz delivery rate');
  assert.deepEqual(generatorReport.parameters.hover, { target: 0.08, request: 0.5, influence: 0.5 }, 'SFX ledger: v2 hover contract is exact');
  assert.deepEqual(generatorReport.parameters.atkHeroMed, { target: 0.38, request: 0.5, influence: 0.62 }, 'SFX ledger: v2 main attack contract is exact');
  assert.deepEqual(generatorReport.parameters.bigDeath, { target: 1.3, request: 1.3, influence: 0.68 }, 'SFX ledger: v2 boss-death contract is exact');
  assert.deepEqual(generatorReport.parameters.slash, { target: 0.3, request: 0.5, influence: 0.45 }, 'SFX ledger: v2 legacy compatibility contract remains generatable');
  assert.deepEqual(generatorReport.parameters.hit, { target: 0.22, request: 0.5, influence: 0.45 }, 'SFX ledger: v2 legacy hit contract remains generatable');
  const musicLedger = readFileSync(new URL('../docs/music-ledger.md', import.meta.url), 'utf8');
  const musicPrompts = musicLedger.split('SUNO prompt:').slice(1).map((section) => section.split('\n').find((line) => line.trim()));
  assert.equal(musicPrompts.length, 22, 'Music ledger: all 22 Cue prompts remain present');
  assert.ok(musicPrompts.every((prompt) => /seamless/i.test(prompt)), 'Music ledger: every v2 prompt asks for seamless playback');
  assert.ok(musicPrompts.every((prompt) => /90–120 seconds/i.test(prompt)), 'Music ledger: every v2 prompt requests 90–120 seconds');
  assert.ok(musicPrompts.every((prompt) => /no hard ending/i.test(prompt)), 'Music ledger: every v2 prompt rejects hard endings');
  assert.ok(musicPrompts.every((prompt) => /no fadeout/i.test(prompt)), 'Music ledger: every v2 prompt rejects fadeouts');
  assert.match(musicLedger, /fragile four-note minor-key idea/, 'Music ledger: downloaded v2 lantern motif law is preserved');
  const installedAudioGates = [
    ['Music v2 media/provenance manifest', ['tools/validate-audio-pack.mjs', '--kind', 'music', '--version', 'stained-glass-v2', '--verify-manifest']],
    ['SFX v2 media/provenance manifest', ['tools/validate-audio-pack.mjs', '--kind', 'sfx', '--version', 'ashglass-v2', '--verify-manifest']],
    ['Suno provenance forgery regression', ['test/test_validate_audio_pack_provenance.mjs']],
    ['Suno deterministic renderer regression', ['test/test_render_suno_music_pack.mjs']],
    ['Music v2 exact queue regression', ['test/test_music_v2_queue.mjs']],
  ];
  for (const [label, args] of installedAudioGates) {
    const result = spawnSync('node', args, { encoding: 'utf8' });
    assert.equal(result.status, 0, `${label}: ${result.stderr || result.stdout}`);
  }
}
{
  const latch = createChoiceLatch();
  assert.equal(latch.claim(), true, 'the first choice claims the interaction');
  assert.equal(latch.claim(), false, 'a second rapid choice is rejected');
  assert.equal(latch.locked, true, 'the latch exposes its settled state');
}
{
  assert.equal(shadeVictorySkipsRewards({ pendingQuestId: 'ownShade' }), true);
  assert.equal(shadeVictorySkipsRewards({ pendingQuestId: 'paleOnes' }), false);
  assert.deepEqual(shadeLossBequestState({
    questScratch: { ownShade: { fall: { bequest: { kind: 'gold', amount: 50 } } } },
  }), { unpaidBequest: true, offerNewBequest: false });
  assert.deepEqual(shadeLossBequestState({ questScratch: { ownShade: { fall: { bequest: null } } } }),
    { unpaidBequest: false, offerNewBequest: true });
}
{
  const previousLocalStorage = globalThis.localStorage;
  const makeStandingShade = (seed) => {
    const quests = Object.fromEntries(QUEST_IDS.map((id) => [id, {
      state: id === 'ownShade' ? 'revealed' : 'dormant', progress: 0, memory: {},
    }]));
    return newRun(seed, {
      quests,
      monument: {
        act: 1, row: 7, bequest: { kind: 'gold', amount: 50 }, standing: true, shadeAspect: 1,
      },
    });
  };
  try {
    const persisted = new Map();
    let writes = 0;
    let rejectWrite = () => false;
    globalThis.localStorage = {
      getItem: (key) => persisted.get(key) ?? null,
      setItem: (key, value) => {
        writes++;
        if (rejectWrite(writes)) throw new Error('quota');
        persisted.set(key, value);
      },
      removeItem: (key) => persisted.delete(key),
    };

    const rejectedSaveRun = makeStandingShade(4261);
    const rejectedSaveBefore = structuredClone(rejectedSaveRun);
    rejectWrite = () => true;
    assert.deepEqual(EngineApi.beginShadeDuel(rejectedSaveRun, () => true), {
      status: SHADE_DUEL_TX.RETRY_CLAIM, durablePending: false, duel: null,
    });
    assert.deepEqual(rejectedSaveRun, rejectedSaveBefore,
      'a rejected pending-duel save rolls every Shade claim mutation back inside the engine');

    writes = 0;
    rejectWrite = () => false;
    const rejectedClearRun = makeStandingShade(4262);
    const rejectedClearBefore = structuredClone(rejectedClearRun);
    assert.deepEqual(EngineApi.beginShadeDuel(rejectedClearRun, () => false), {
      status: SHADE_DUEL_TX.RETRY_CLAIM, durablePending: false, duel: null,
    });
    assert.deepEqual(rejectedClearRun, rejectedClearBefore);
    assert.deepEqual(loadRun(), rejectedClearBefore,
      'an accepted rollback replaces the durable pending duel with the exact pre-claim run');

    writes = 0;
    rejectWrite = (attempt) => attempt === 2;
    const reloadRun = makeStandingShade(4263);
    const reloadBefore = structuredClone(reloadRun);
    assert.deepEqual(EngineApi.beginShadeDuel(reloadRun, () => false), {
      status: SHADE_DUEL_TX.RELOAD_PENDING, durablePending: true, duel: null,
    });
    assert.deepEqual(reloadRun, reloadBefore, 'the failed rollback also restores the live object');
    const durablePending = loadRun();
    assert.equal(durablePending.monument.claimed, true);
    assert.equal(durablePending.pendingQuestId, 'ownShade');
    assert.deepEqual(durablePending.questScratch.ownShade.pendingBequest, { kind: 'gold', amount: 50 });

    rejectWrite = () => false;
    assert.deepEqual(EngineApi.resumeShadeDuel(durablePending, () => false), {
      status: SHADE_DUEL_TX.RETRY_CLEAR, durablePending: true,
    });
    assert.deepEqual(EngineApi.resumeShadeDuel(durablePending, () => true), {
      status: SHADE_DUEL_TX.READY, durablePending: true,
    });

    writes = 0;
    const readyRun = makeStandingShade(4264);
    const ready = EngineApi.beginShadeDuel(readyRun, () => true);
    assert.equal(ready.status, SHADE_DUEL_TX.READY);
    assert.equal(ready.durablePending, true);
    assert.equal(ready.duel.variantId, 'ownShade1');
    assert.equal(readyRun.monument.claimed, true);
    assert.equal(readyRun.pendingQuestId, 'ownShade');
  } finally {
    if (previousLocalStorage) globalThis.localStorage = previousLocalStorage;
    else delete globalThis.localStorage;
  }
}
{
  // Title and Embark must preserve a terminal outbox instead of abandoning it.
  for (const outcome of ['win', 'death']) {
    const run = newRun(422 + outcome.length);
    run.pendingRunEnd = { outcome };
    assert.equal(savedRunRequiresFinalisation(run), true, `${outcome} resumes finalisation from entry screens`);
    assert.strictEqual(journalTerminalOutcome(run, outcome), run.pendingRunEnd, `${outcome} may resume idempotently`);
    assert.throws(
      () => journalTerminalOutcome(run, 'abandon'),
      /terminal outcome cannot change from .* to abandon/,
      `${outcome} cannot be overwritten by Begin Anew`,
    );
    assert.equal(run.pendingRunEnd.outcome, outcome, `${outcome} survives the destructive action`);
  }
  assert.equal(savedRunRequiresFinalisation({ pendingDawn: { events: [], cursor: 0, newUnlocks: [] } }), true,
    'a staged dawn resumes its presentation instead of exposing a destructive title action');
  const dawn = newRun(425);
  dawn.pendingDawn = { events: [], cursor: 0, newUnlocks: [] };
  assert.throws(() => journalTerminalOutcome(dawn, 'abandon'), /staged dawn cannot be replaced/,
    'a destructive global action cannot overwrite a staged dawn');
  assert.deepEqual(dawn.pendingDawn, { events: [], cursor: 0, newUnlocks: [] });
  assert.equal(dawn.pendingRunEnd, null);
}
{
  // Persistence failures are retryable; a screen continuation is outside that catch and runs once.
  const run = newRun(424);
  let persistenceAttempts = 0;
  let failures = 0;
  let continuations = 0;
  const fail = () => { failures++; };
  assert.equal(finaliseTerminalOutbox(run, () => {
    persistenceAttempts++;
    throw new Error('quota');
  }, fail, () => { continuations++; }), false);
  assert.equal(finaliseTerminalOutbox(run, () => {
    persistenceAttempts++;
    return { accepted: false };
  }, fail, () => { continuations++; }), false);
  assert.equal(failures, 2, 'only persistence rejection opens retry handling');
  assert.equal(continuations, 0);

  assert.throws(() => finaliseTerminalOutbox(run, () => {
    persistenceAttempts++;
    return { accepted: true, outcome: 'win' };
  }, fail, () => {
    continuations++;
    throw new Error('screen failed');
  }), /screen failed/, 'continuation errors escape the persistence catch');
  assert.equal(failures, 2, 'a screen error is never reported as a storage failure');
  assert.equal(continuations, 1);

  assert.equal(finaliseTerminalOutbox(run, () => {
    persistenceAttempts++;
    return { accepted: true };
  }, fail, () => { continuations++; }), true, 'a started continuation is already finalised');
  assert.equal(persistenceAttempts, 3, 'a continuation exception cannot replay persistence');
  assert.equal(continuations, 1, 'a continuation exception cannot replay the screen action');
}
{
  const run = newRun(1);
  assert.match(run.runId, /^run-[a-z0-9-]+$/, 'new runs own a stable receipt id');
  assert.notEqual(newRun(1).runId, run.runId, 'same-seed runs still receive distinct ids');
  assert.equal(run.pendingReward, null);
  assert.equal(run.pendingRunEnd, null);
  assert.equal(run.player.deck.length, 10, 'starter deck');
  assert.equal(run.player.hp, 72);
  assert.ok(run.map.nodes.length > 20, 'map has nodes');
  for (const n of run.map.nodes) {
    if (n.row < MAP_ROWS - 1) assert.ok(n.next.length > 0, `node ${n.id} has exits`);
    for (const id of n.next) assert.ok(run.map.nodes.find((m) => m.id === id), 'edge target exists');
  }
  assert.ok(availableNodes(run).length > 0, 'start choices exist');
}
{
  const base = {
    name: 'Base', hp: [100, 120], facets: 4, art: { kind: 'beast', hue: 20, size: 1 },
    startStatus: { thorns: 1 },
    moves: { hit: { name: 'Hit', intent: 'attack', dmg: 10 }, guard: { name: 'Guard', intent: 'block', block: 8 } },
    ai: () => 'hit',
  };
  const variant = {
    id: 'testVariant', base: 'base', name: 'Wrong Glass',
    tint: { hue: 90, saturation: 0.5, brightness: 1.1 }, scale: 1.2,
    statMods: { hpMult: 1.25, dmgMult: 1.3, addStatuses: { str: 2 } },
    dialogue: ['Speak.'], drop: null,
  };
  const made = makeVariant(base, variant);
  assert.deepEqual(made.hp, [125, 150]);
  assert.equal(made.moves.hit.dmg, 13);
  assert.equal(made.moves.guard.block, 8, 'damage scaling does not change block');
  assert.deepEqual(made.startStatus, { thorns: 1, str: 2 });
  assert.equal(base.moves.hit.dmg, 10, 'base definition not mutated');

  const run = newRun(420);
  const cb = startCombat(run, ['paleDuskfang']);
  assert.equal(cb.enemies[0].key, 'duskfang');
  assert.equal(cb.enemies[0].variantId, 'paleDuskfang');
  assert.equal(cb.enemies[0].presentation.artId, 'duskfang');
  assert.ok(cb.enemies[0].maxHp > 30);

  const bossCb = startCombat(newRun(421), ['usurpedSovereign'], 'boss');
  assert.deepEqual(bossCb.queue.slice(0, 4).map((event) => event.t),
    ['bossIntro', 'variantDialogue', 'variantDialogue', 'variantDialogue']);
  assert.match(bossCb.queue[1].text, /^Duskblade\./, 'dialogue expands the aspect name without its article');
  const ashBossCb = startCombat(newRun(422, { aspect: 1 }), ['usurpedSovereign'], 'boss');
  assert.match(ashBossCb.queue[1].text, /^Ashwarden\./,
    'variant dialogue expands the alternate aspect name without its article');

  const shadeQuests = Object.fromEntries(QUEST_IDS.map((id) => [id, {
    state: id === 'ownShade' ? 'armed' : 'dormant', progress: 0, memory: {},
  }]));
  const shadeRun = newRun(423, { quests: shadeQuests });
  const shadeCb = startCombat(shadeRun, ['ownShade1']);
  assert.equal(shadeRun.quests.ownShade.state, 'revealed',
    'meeting an armed Shade reveals its Trail even if the duel is later lost');
  assert.ok(shadeCb.queue.some((event) => event.t === 'questReveal' && event.id === 'ownShade'));
  assert.equal(shadeCb.queue.some((event) => event.t === 'variantDialogue' &&
    event.text === QUESTS.ownShade.fragments[0]), false,
  'a living Shade does not reveal its defeated story fragment');
  shadeCb.enemies[0].hp = 1;
  forceHand(shadeRun, shadeCb, ['strike']);
  shadeCb.player.energy = 3;
  playCard(shadeRun, shadeCb, shadeCb.hand[0].uid, 0);
  const shadeDeath = shadeCb.queue.findIndex((event) => event.t === 'die');
  const shadeFragment = shadeCb.queue.findIndex((event) => event.t === 'variantDialogue' &&
    event.text === QUESTS.ownShade.fragments[0]);
  const shadeVictory = shadeCb.queue.findIndex((event) => event.t === 'victory');
  assert.ok(shadeDeath >= 0 && shadeDeath < shadeFragment && shadeFragment < shadeVictory,
    'a defeated Shade speaks its stage fragment after death and before victory');
}
{
  const run = newRun(420);
  const boss = run.map.nodes.find((node) => node.type === 'boss');
  visitNode(run, boss);
  setPendingEncounter(run, 'boss', ['rootheart']);
  assert.equal(hasPendingBossRelic(run), false, 'an unfinished boss fight is not a relic ceremony');
  clearPendingEncounter(run);
  assert.equal(hasPendingBossRelic(run), true, 'a cleared visited Act 1 boss resumes its relic ceremony');
  claimBossRelic(run, null);
  assert.equal(hasPendingBossRelic(run), true, 'a saved relic claim still resumes the act transition');
  run.act = 2;
  assert.equal(hasPendingBossRelic(run), false, 'the final boss never offers a boss relic');
}
{
  const quests = Object.fromEntries(QUEST_IDS.map((id) => [id, {
    state: id === 'paleOnes' ? 'armed' : 'dormant', progress: 0, memory: {},
  }]));
  const run = newRun(410, { quests });

  const dormantEvents = [];
  const dormant = advanceQuest(run, 'ownShade', QUESTS.ownShade.target, dormantEvents);
  assert.equal(dormant.state, 'dormant', 'a dormant quest stays dormant');
  assert.equal(dormant.progress, 0, 'a dormant quest cannot progress');
  assert.deepEqual(dormantEvents, [], 'a dormant quest emits no events');
  assert.deepEqual(run.questCompletions, [], 'a dormant quest cannot complete');

  const armedEvents = [];
  const armed = advanceQuest(run, 'paleOnes', 1, armedEvents);
  assert.equal(armed.state, 'revealed', 'an armed quest reveals before progressing');
  assert.equal(armed.progress, 1, 'an armed quest can progress');
  assert.deepEqual(armedEvents.map((e) => e.t), ['questReveal', 'questProgress']);
}
{
  const { run, cb } = freshCombat();
  assert.equal(cb.hand.length, 5, 'draw 5');
  assert.equal(cb.player.energy, 3, 'energy 3');
  const e = cb.enemies[0];
  forceHand(run, cb, ['strike']);
  const hp0 = e.hp;
  assert.ok(playCard(run, cb, cb.hand[0].uid, 0), 'strike plays');
  assert.equal(e.hp, Math.max(0, hp0 - 6), 'strike deals 6');
}
{
  // vulnerable multiplies, str adds, weak reduces
  const { run, cb } = freshCombat(['gravewarden']);
  const e = cb.enemies[0];
  e.statuses.vulnerable = 2;
  cb.player.statuses.str = 2;
  forceHand(run, cb, ['strike']);
  const hp0 = e.hp;
  playCard(run, cb, cb.hand[0].uid, 0);
  assert.equal(hp0 - e.hp, Math.floor((6 + 2) * 1.5), 'vuln+str math');
  cb.player.statuses.weak = 1;
  forceHand(run, cb, ['strike']);
  const hp1 = e.hp;
  playCard(run, cb, cb.hand[0].uid, 0);
  assert.equal(hp1 - e.hp, Math.floor(Math.floor((6 + 2) * 0.75) * 1.5), 'weak math');
}
{
  // previewPlay predicts exactly what playCard then does, without touching state
  const { run, cb } = freshCombat(['gravewarden']);
  const e = cb.enemies[0];
  e.statuses.vulnerable = 2;
  e.block = 5;
  cb.player.statuses.str = 3;
  forceHand(run, cb, ['strike']);
  const snap = JSON.stringify({ e, p: cb.player, hand: cb.hand });
  const pv = previewPlay(run, cb, cb.hand[0], 0);
  assert.equal(JSON.stringify({ e, p: cb.player, hand: cb.hand }), snap, 'preview is pure');
  assert.equal(pv.total, Math.floor((6 + 3) * 1.5), 'preview total matches math');
  assert.equal(pv.loss, pv.total - 5, 'preview subtracts target block');
  assert.equal(pv.lethal, pv.loss >= e.hp, 'lethal flag consistent');
  const hp0 = e.hp, b0 = e.block;
  playCard(run, cb, cb.hand[0].uid, 0);
  assert.equal(hp0 - e.hp, pv.loss, 'engine agrees with its own preview');
  assert.ok(b0 > e.block, 'block was consumed');
  // block preview obeys dex + frail
  forceHand(run, cb, ['defend']);
  cb.player.statuses.dex = 2;
  cb.player.statuses.frail = 1;
  const pvb = previewPlay(run, cb, cb.hand[0], null);
  assert.equal(pvb.block, Math.floor((5 + 2) * 0.75), 'block preview dex+frail');
}
{
  // killing blows say so, overkill is measured, untouched wins are perfect
  const { run, cb } = freshCombat(['sporeling']);
  const e = cb.enemies[0];
  e.hp = 4;
  forceHand(run, cb, ['strike']);
  cb.queue.length = 0;
  playCard(run, cb, cb.hand[0].uid, 0);
  const hit = cb.queue.find((ev) => ev.t === 'hitEnemy');
  assert.ok(hit.killingBlow, 'killing blow flagged');
  assert.equal(hit.overkill, 2, 'overkill = damage past zero');
  const win = cb.queue.find((ev) => ev.t === 'victory');
  assert.ok(win && win.perfect, 'no damage taken = perfect');
}
{
  // a scratched win is not perfect
  const { run, cb } = freshCombat(['sporeling']);
  const e = cb.enemies[0];
  cb.player.hp -= 0; // sanity: damage must come through the engine
  e.hp = 1;
  forceHand(run, cb, ['strike']);
  // engine-inflicted chip damage first
  cb.player.block = 0;
  cb.counters.hpLost = 0;
  // simulate a poison tick through the real path
  cb.player.statuses.poison = 1;
  endTurn(run, cb); // enemy acts, poison ticks at player turn start
  if (!cb.over) {
    forceHand(run, cb, ['strike']);
    playCard(run, cb, cb.hand[0].uid, 0);
    const win = cb.queue.find((ev) => ev.t === 'victory');
    assert.ok(win, 'combat won');
    assert.equal(win.perfect, false, 'damage taken spoils perfect');
  }
}
{
  // block + frail
  const { run, cb } = freshCombat(['gravewarden']);
  forceHand(run, cb, ['defend']);
  playCard(run, cb, cb.hand[0].uid);
  assert.equal(cb.player.block, 5, 'defend 5');
  cb.player.statuses.frail = 1;
  forceHand(run, cb, ['defend']);
  playCard(run, cb, cb.hand[0].uid);
  assert.equal(cb.player.block, 5 + 3, 'frail block 3');
}
{
  // poison ticks on enemy at its turn
  const { run, cb } = freshCombat(['gravewarden']);
  forceHand(run, cb, ['venomStrike']);
  const e = cb.enemies[0];
  playCard(run, cb, cb.hand[0].uid, 0);
  assert.equal(e.statuses.poison, 3);
  const hpAfterHit = e.hp;
  endTurn(run, cb);
  assert.equal(e.statuses.poison, 2, 'poison decrements');
  assert.ok(e.hp <= hpAfterHit - 3, 'poison damage applied');
}
{
  // kill -> victory + emberHeart heal
  const { run, cb } = freshCombat(['sporeling']);
  cb.enemies[0].hp = 3;
  cb.player.hp = 40;
  forceHand(run, cb, ['strike']);
  playCard(run, cb, cb.hand[0].uid, 0);
  assert.equal(cb.result, 'win');
  assert.equal(run.player.hp, 46, 'emberheart heals 6');
}
{
  // exhaust + unplayable + energy limit
  const { run, cb } = freshCombat(['gravewarden']);
  forceHand(run, cb, ['preparation', 'wound', 'oblivionStrike']);
  const prep = cb.hand[0], wound = cb.hand[1], obl = cb.hand[2];
  assert.ok(playCard(run, cb, prep.uid), 'preparation plays');
  assert.ok(cb.exhaust.find((c) => c.uid === prep.uid), 'preparation exhausted');
  assert.equal(playCard(run, cb, wound.uid), false, 'wound unplayable');
  cb.player.energy = 2;
  assert.equal(playCard(run, cb, obl.uid, 0), false, 'not enough energy for 3-cost');
}
{
  // card data upgrade merge
  const c = makeCard(newRun(2), 'strike', true);
  assert.equal(cardData(c).effects[0].n, 9, 'upgraded edge 9');
  assert.equal(cardData(c).name, 'Edge+');
  const q = makeCard(newRun(2), 'heavyBlow', true);
  assert.equal(cardData(q).chip, 2, 'upgrade merges chip bonus');
}
{
  // locked content stays out of base pools and enters with its unlock token
  assert.ok(!CARD_POOLS.uncommon.includes('quakeblow'), 'locked card out of pool');
  assert.ok(!RELIC_POOLS.rare.includes('prismCharm'), 'locked relic out of pool');
  const run = newRun(48, { unlocks: ['card:quakeblow', 'relic:prismCharm'] });
  assert.ok(cardPool(run, 'uncommon').includes('quakeblow'), 'deed pays out into the pool');
  assert.ok(relicPool(run, 'rare').includes('prismCharm'), 'relic unlock reaches the pool');
}
{
  // Crowns rewrite rules
  const runA = newRun(49);
  gainRelic(runA, 'crownOfCinders');
  const cbA = startCombat(runA, ['gravewarden']);
  assert.equal(cbA.emberCap, 12, 'cinders: deeper lantern');
  assert.equal(cbA.embers, 2, 'cinders: starts lit');
  const runB = newRun(50);
  gainRelic(runB, 'crownOfTithes');
  const cbB = startCombat(runB, ['gravewarden']);
  forceHand(runB, cbB, ['strike', 'strike', 'strike']);
  const b0 = cbB.player.block;
  assert.ok(kindleFromHand(runB, cbB, cbB.hand[0].uid), 'first kindle');
  assert.ok(kindleFromHand(runB, cbB, cbB.hand[0].uid), 'tithes: second kindle');
  assert.equal(kindleFromHand(runB, cbB, cbB.hand[0].uid), false, 'but not a third');
  assert.equal(cbB.player.block, b0 + 6, 'each kindling grants 3 Ward');
  const runC = newRun(51);
  gainRelic(runC, 'crownOfTheHearth');
  const cbC = startCombat(runC, ['sporeling']);
  cbC.player.hp = 30;
  runC.player.hp = 30;
  cbC.embers = 5;
  cbC.enemies[0].hp = 1;
  forceHand(runC, cbC, ['strike']);
  playCard(runC, cbC, cbC.hand[0].uid, 0);
  assert.equal(cbC.result, 'win');
  // emberHeart 6 + hearth 5*3+1(death ember? death ember granted before win... enemy died => win first) — hearth heals embers*3
  assert.ok(runC.player.hp >= 30 + 6 + 15, 'hearth: unspent embers become blood');
  const runD = newRun(52);
  gainRelic(runD, 'shatterersCrown');
  const cbD = startCombat(runD, ['gravewarden']);
  assert.equal(cbD.enemies[0].facetMax, 4, 'shatterer: thinner glass');
  assert.equal(cbD.enemies[0].statuses.str, 1, 'shatterer: angrier glass');
  const runE = newRun(53);
  gainRelic(runE, 'hollowCrown');
  assert.equal(runE.player.energyMax, 4, 'hollow: +1 energy');
  assert.equal(runE.player.maxHp, 62, 'hollow: -10 maxHp');
}
{
  // new specials: shatterEcho doubles vs Cracked/Staggered and previews it
  const { run, cb } = freshCombat(['gravewarden']);
  forceHand(run, cb, ['resonantLance']);
  const e = cb.enemies[0];
  const pv0 = previewPlay(run, cb, cb.hand[0], 0);
  assert.equal(pv0.total, 7, 'quiet glass: base 7');
  e.statuses.vulnerable = 1;
  const pv1 = previewPlay(run, cb, cb.hand[0], 0);
  assert.equal(pv1.total, Math.floor(14 * 1.5), 'cracked glass: doubled then ×1.5');
  const hp0 = e.hp;
  playCard(run, cb, cb.hand[0].uid, 0);
  assert.equal(hp0 - e.hp, pv1.loss, 'echo preview parity');
  // emberNova scales with the lantern
  const { run: r2, cb: c2 } = freshCombat(['gravewarden']);
  c2.embers = 4;
  forceHand(r2, c2, ['novaflare']);
  const pv2 = previewPlay(r2, c2, c2.hand[0], 0);
  assert.equal(pv2.total, 12, 'nova: 3 × 4 embers');
  const h0 = c2.enemies[0].hp;
  playCard(r2, c2, c2.hand[0].uid, 0);
  assert.equal(h0 - c2.enemies[0].hp, pv2.loss, 'nova preview parity');
}
{
  // pyre tithe burns the rest of the hand, feeds the lantern, draws anew
  const { run, cb } = freshCombat(['gravewarden']);
  forceHand(run, cb, ['offering', 'wound', 'strike', 'hex']);
  cb.embers = 0;
  cb.draw = [makeCard(run, 'strike'), makeCard(run, 'strike'), makeCard(run, 'strike')];
  playCard(run, cb, cb.hand[0].uid);
  // 3 others burned (hex CAN burn by pyre — the card's power) + the tithe itself kindles
  assert.equal(cb.embers, 4, 'three panes + the tithe itself fed the lantern');
  assert.equal(cb.hand.length, 3, 'drew 3 fresh cards');
  assert.equal(cb.exhaust.length, 4, 'ashes hold them all');
}
{
  // eat the flame: a kill swallows fire even as the fight ends
  const { run, cb } = freshCombat(['sporeling', 'sporeling']);
  cb.enemies[0].hp = 5;
  forceHand(run, cb, ['devour']);
  playCard(run, cb, cb.hand[0].uid, 0);
  assert.ok(cb.embers >= 4, 'devour embers (3) + death ember (1)');
  // flawless form doubles while untouched
  const { run: r2, cb: c2 } = freshCombat(['gravewarden']);
  forceHand(r2, c2, ['flawlessForm']);
  playCard(r2, c2, c2.hand[0].uid);
  assert.equal(c2.player.block, 16, 'untouched: 8 + 8');
  c2.counters.hpLost = 3;
  forceHand(r2, c2, ['flawlessForm']);
  playCard(r2, c2, c2.hand[0].uid);
  assert.equal(c2.player.block, 16 + 8, 'scratched: just 8');
  // emberdance converts the lantern to ward
  const { run: r3, cb: c3 } = freshCombat(['gravewarden']);
  c3.embers = 4;
  forceHand(r3, c3, ['emberdance']);
  playCard(r3, c3, c3.hand[0].uid);
  // 4 embers × 3 ward, then the kindle of emberdance itself re-lights 1 ember
  assert.equal(c3.player.block, 12, 'emberdance ward');
  assert.equal(c3.embers, 1, 'lantern spilled, then fed by its own burning');
}
{
  // omens: every entry's mods actually hook the engine — and its previews
  const withOmen = (id, enemies = ['gravewarden']) => {
    const run = newRun(60);
    run.omens = [id];
    const cb = startCombat(run, enemies);
    return { run, cb };
  };
  { // ashfall: enemies start smoldering; their blows leave ash on you
    const { run, cb } = withOmen('ashfall', ['sporeling']);
    assert.equal(cb.enemies[0].statuses.poison, 2, 'ashfall smolders them');
    cb.enemies[0].moveKey = 'spit';
    cb.queue.length = 0;
    endTurn(run, cb);
    assert.ok(cb.queue.find((ev) => ev.t === 'status' && ev.who === 'player' && ev.id === 'poison'), 'their blows smolder you');
  }
  { // heavy air: ward swells identically in play and preview
    const { run, cb } = withOmen('heavyAir');
    assert.equal(previewBlock(run, cb, 5), Math.round(5 * 1.25), 'preview holds the light');
    forceHand(run, cb, ['defend']);
    playCard(run, cb, cb.hand[0].uid);
    assert.equal(cb.player.block, Math.round(5 * 1.25), 'play agrees');
  }
  { // thin glass: smaller gauges, harder blows (mirrored in the intent preview)
    const { run, cb } = withOmen('thinGlass', ['sporeling']);
    assert.equal(cb.enemies[0].facetMax, 2, 'sporeling glass thinned to the floor');
    cb.enemies[0].moveKey = 'spit';
    const p = previewEnemyDmg(run, cb, cb.enemies[0]);
    const hp0 = cb.player.hp;
    endTurn(run, cb);
    assert.equal(hp0 - cb.player.hp, p.dmg, 'intent preview tells the omen truth');
  }
  { // hungry dark: dearer shops, richer choices
    const runA = newRun(61); runA.omens = ['hungryDark'];
    const runB = newRun(61); runB.omens = [];
    assert.equal(rollCardReward(runB).length + 1, (runB.omens = ['hungryDark'], rollCardReward(runA).length), 'one more choice');
    const runC = newRun(61); runC.omens = ['hungryDark'];
    const runD = newRun(61); runD.omens = [];
    const shopC = genShop(runC), shopD = genShop(runD);
    assert.equal(shopC.cards[0].price, Math.round(shopD.cards[0].price * 1.25), 'the dark eats coin');
  }
  { // ember wind: a lit lantern, a lighter hand
    const { cb } = withOmen('emberWind');
    assert.equal(cb.embers, 2, 'sparks ride the wind');
    assert.equal(cb.hand.length, 4, 'draw 4');
  }
  { // long night: tougher glass, richer purses
    const runA = newRun(63); runA.omens = ['longNight'];
    const runB = newRun(63); runB.omens = [];
    const cbA = startCombat(runA, ['gravewarden']);
    const cbB = startCombat(runB, ['gravewarden']);
    assert.equal(cbA.enemies[0].maxHp, Math.round(cbB.enemies[0].maxHp * 1.12), 'they carry more life');
    const runC = newRun(63); runC.omens = ['longNight'];
    const runD = newRun(63); runD.omens = [];
    assert.equal(genCombatRewards(runC, 'normal').gold, Math.round(genCombatRewards(runD, 'normal').gold * 1.4), 'victory pays more');
  }
  { // waning moon: the first card is cheap, the fire heals less
    const { run, cb } = withOmen('waningMoon');
    forceHand(run, cb, ['strike', 'strike']);
    assert.equal(effCost(run, cb, cb.hand[0]), 0, 'first card discounted');
    playCard(run, cb, cb.hand[0].uid, 0);
    assert.equal(effCost(run, cb, cb.hand[0]), 1, 'only the first');
    assert.equal(restHealFrac(run), 0.2, 'rest sites dimmed');
  }
}
{
  // elite affixes: each title keeps its promise
  const withAffix = (affix) => {
    const run = newRun(62);
    run.omens = [];
    return { run, cb: startCombat(run, ['gravewarden'], 'elite', { affix }) };
  };
  const { cb: rolled } = (() => { const run = newRun(65); run.omens = []; return { cb: startCombat(run, ['gravewarden'], 'elite') }; })();
  assert.ok(AFFIXES[rolled.affix], 'every elite wears a title');
  const { cb: vit } = withAffix('vitrified');
  assert.equal(vit.facetMax, undefined); // affix lives on enemies, not cb
  assert.equal(vit.enemies[0].facetMax, 7, 'vitrified: thicker glass');
  const runP = newRun(62); runP.omens = [];
  const plain = startCombat(runP, ['gravewarden'], 'normal');
  assert.equal(vit.enemies[0].maxHp, Math.round(plain.enemies[0].maxHp * 1.15), 'vitrified: +15% HP');
  assert.equal(withAffix('veiled').cb.enemies[0].block, 15, 'veiled: starts warded');
  assert.equal(withAffix('fervent').cb.enemies[0].statuses.str, 2, 'fervent: starts stoked');
  { // adamant: the first shatter holds, the second lands
    const { run, cb } = withAffix('adamant');
    const e = cb.enemies[0];
    e.chips = e.facetMax - 1;
    forceHand(run, cb, ['strike']);
    cb.queue.length = 0;
    playCard(run, cb, cb.hand[0].uid, 0);
    assert.ok(cb.queue.find((ev) => ev.t === 'adamantHold'), 'the glass holds');
    assert.ok(!e.flags.staggered, 'no stagger the first time');
    assert.equal(cb.embers, 0, 'no embers spill');
    e.chips = e.facetMax - 1;
    forceHand(run, cb, ['strike']);
    playCard(run, cb, cb.hand[0].uid, 0);
    assert.ok(e.flags.staggered, 'the second shatter lands');
  }
  { // ember-fat: double gold
    const runA = newRun(66); runA.omens = [];
    const runB = newRun(66); runB.omens = [];
    assert.equal(genCombatRewards(runA, 'elite', 'emberFat').gold, genCombatRewards(runB, 'elite').gold * 2, 'slaying it pays double');
  }
  { // cinder-veined: its blows leave smolder
    const { run, cb } = withAffix('cinderVeined');
    cb.enemies[0].moveKey = 'crush';
    cb.queue.length = 0;
    endTurn(run, cb);
    assert.ok(cb.queue.find((ev) => ev.t === 'status' && ev.who === 'player' && ev.id === 'poison'), 'cinders cling');
  }
}
{
  // unlit lanterns: sane fraction, never on protected rows, bounty attached
  let unlit = 0, total = 0;
  for (let s = 0; s < 60; s++) {
    const run = newRun(9000 + s * 13);
    for (const n of run.map.nodes) {
      total++;
      if (n.unlit) {
        unlit++;
        assert.ok(n.row > 0 && n.row !== 8 && n.row < MAP_ROWS - 2, 'unlit stays off protected rows');
        assert.ok(n.bounty >= 12, 'the dark owes a bounty');
      }
    }
  }
  const frac = unlit / total;
  assert.ok(frac > 0.05 && frac < 0.25, `unlit fraction sane (${frac.toFixed(3)})`);
  // every omen rolled at run start is a real omen
  for (let s = 0; s < 20; s++) assert.ok(OMENS[newRun(700 + s).omens[0]], 'run begins under a real sky');
}
{
  // smoldering coal + bell of endings + prism charm
  const run = newRun(54, { unlocks: ['relic:smolderingCoal'] });
  gainRelic(run, 'smolderingCoal');
  const cb = startCombat(run, ['sporeling', 'sporeling']);
  assert.ok(cb.enemies.every((e) => e.statuses.poison === 2), 'coal: enemies smolder from the start');
  const run2 = newRun(55);
  gainRelic(run2, 'bellOfEndings');
  gainRelic(run2, 'prismCharm');
  const cb2 = startCombat(run2, ['gravewarden', 'gravewarden']);
  const [a, b] = cb2.enemies;
  const bHp = b.hp;
  a.chips = a.facetMax - 1;
  forceHand(run2, cb2, ['strike']);
  playCard(run2, cb2, cb2.hand[0].uid, 0);
  assert.equal(bHp - b.hp, 4, 'the bell tolls for the other glass');
  assert.equal(cb2.embers, 4, 'prism: first shatter spills double');
}
{
  // events all resolvable
  const run = newRun(7);
  for (const [id, ev] of Object.entries(EVENTS)) {
    for (const ch of ev.choices) {
      assert.ok(Array.isArray(ch.ops), `${id}/${ch.label} ops`);
    }
  }
  const { pending } = applyEventOps(run, [{ gold: 50 }, { pickRemove: true }]);
  assert.equal(run.player.gold, 149);
  assert.deepEqual(pending, ['remove']);
}
{
  // Bone Gambler: wins are possible, outcomes are announced, each event node resets
  const ops = EVENTS.gambler.choices[0].ops;
  const winRun = newRun(1);
  winRun.player.gold = 100;
  const win = applyEventOps(winRun, ops, () => 0); // r < 0.45 → win branch
  assert.equal(winRun.player.gold, 170, 'win pays 40 then grants 110 (net +70)');
  assert.ok(win.log.some((L) => L.text && /110|win|favour|favor|claim/i.test(L.text)),
    'win must announce an outcome (silent rolls look like permanent losses)');

  const loseRun = newRun(1);
  loseRun.player.gold = 100;
  const lose = applyEventOps(loseRun, ops, () => 0.5); // 0.45 ≤ r < 1 → lose branch
  assert.equal(loseRun.player.gold, 60, 'lose keeps the 40-gold stake');
  assert.ok(lose.log.some((L) => L.text && /lose|lost|wager|scatter|rattle/i.test(L.text)),
    'lose must announce an outcome');

  const multi = newRun(42);
  multi.player.gold = 500;
  const eventNodes = multi.map.nodes.filter((n) => n.type === 'event');
  assert.ok(eventNodes.length >= 2, 'map offers more than one event node');
  const deltas = [];
  for (const node of eventNodes.slice(0, 2)) {
    visitNode(multi, node);
    const gold0 = multi.player.gold;
    const once = applyNodeEventChoice(multi, ops);
    assert.equal(once.already, false, `fresh gamble on node ${node.id}`);
    finalizeNodeEventChoice(multi);
    assert.equal(node.rewardClaimed, true);
    deltas.push(multi.player.gold - gold0);
  }
  assert.ok(deltas.every((d) => d === 70 || d === -40), 'each node rolls independently');
  const again = applyNodeEventChoice(multi, ops);
  assert.equal(again.already, true, 'same node cannot be gambled twice');
}
{
  // node rewards: treasure, events, and boss relics are idempotent per node/act
  const run = newRun(88);
  const treasure = run.map.nodes.find((n) => n.type === 'treasure') || run.map.nodes.find((n) => n.row === 8);
  assert.ok(treasure, 'map has a treasure node');
  run.nodeId = treasure.id;
  const relics0 = run.player.relics.length;
  const gold0 = run.player.gold;
  const first = claimTreasure(run);
  assert.equal(first.already, false);
  const second = claimTreasure(run);
  assert.equal(second.already, true);
  assert.equal(run.player.relics.length - relics0, first.relicId ? 1 : 0);
  if (!first.relicId) assert.equal(run.player.gold - gold0, 60);
  assert.equal(treasure.rewardClaimed, true);

  const runEv = newRun(89);
  const eventNode = runEv.map.nodes.find((n) => n.type === 'event') || runEv.map.nodes[5];
  runEv.nodeId = eventNode.id;
  const ops = EVENTS.voidChest.choices[0].ops;
  const ev1 = applyNodeEventChoice(runEv, ops);
  assert.equal(ev1.already, false);
  assert.equal(nodeRewardClaimed(runEv), false, 'event not settled until pending finalizes');
  assert.equal(nodeEventInFlight(runEv), true);
  const relicsAfterFirst = runEv.player.relics.length;
  const hpAfterFirst = runEv.player.hp;
  const ev2 = applyNodeEventChoice(runEv, ops);
  assert.equal(ev2.already, true);
  assert.equal(runEv.player.relics.length, relicsAfterFirst);
  assert.equal(runEv.player.hp, hpAfterFirst);
  finalizeNodeEventChoice(runEv);
  assert.equal(eventNode.rewardClaimed, true);
  assert.equal(nodeEventInFlight(runEv), false);

  const runPending = newRun(94);
  const pendingNode = runPending.map.nodes.find((n) => n.type === 'event') || runPending.map.nodes[5];
  runPending.nodeId = pendingNode.id;
  const pendingOps = [{ gold: 25 }, { pickRemove: true }];
  const mid = applyNodeEventChoice(runPending, pendingOps);
  assert.equal(mid.already, false);
  assert.deepEqual(mid.pending, ['remove']);
  assert.equal(nodeEventInFlight(runPending), true);
  assert.equal(nodeRewardClaimed(runPending), false);
  finalizeNodeEventChoice(runPending);
  assert.equal(pendingNode.rewardClaimed, true);

  const runBoss = newRun(90);
  const picks = rollBossRelics(runBoss);
  assert.ok(picks.length, 'boss relic pool');
  const beforeBoss = runBoss.player.relics.length;
  const br1 = claimBossRelic(runBoss, picks[0]);
  assert.equal(br1.already, false);
  const br2 = claimBossRelic(runBoss, picks[1] || picks[0]);
  assert.equal(br2.already, true);
  assert.equal(runBoss.player.relics.length - beforeBoss, 1);

  const runOrphan = newRun(91);
  runOrphan.nodeId = null;
  const orphan1 = claimTreasure(runOrphan);
  assert.equal(orphan1.already, false);
  assert.equal(runOrphan.orphanRewardClaimed, true);
  const orphan2 = claimTreasure(runOrphan);
  assert.equal(orphan2.already, true);

  const runXfer = newRun(92);
  runXfer.nodeId = null;
  claimTreasure(runXfer);
  const xferNode = runXfer.map.nodes.find((n) => n.type === 'treasure') || runXfer.map.nodes.find((n) => n.row === 8);
  visitNode(runXfer, xferNode);
  assert.equal(xferNode.rewardClaimed, true, 'orphan claim transfers to node on visitNode');
  assert.equal(claimTreasure(runXfer).already, true);

  const runOrphanRes = newRun(95);
  runOrphanRes.nodeId = null;
  applyNodeEventChoice(runOrphanRes, [{ pickRemove: true }]);
  assert.equal(runOrphanRes.orphanRewardResolving, true);
  const resNode = runOrphanRes.map.nodes.find((n) => n.type === 'event') || runOrphanRes.map.nodes[5];
  visitNode(runOrphanRes, resNode);
  assert.equal(resNode.rewardResolving, true, 'orphan resolving transfers to node on visitNode');
  assert.equal(runOrphanRes.orphanRewardResolving, false);

  const saved = JSON.parse(JSON.stringify(run));
  assert.equal(claimTreasure(saved).already, true, 'rewardClaimed survives JSON round-trip');
  const savedBoss = JSON.parse(JSON.stringify(runBoss));
  assert.equal(claimBossRelic(savedBoss, picks[0]).already, true, 'bossRelicAct survives JSON round-trip');
  assert.equal(nodeRewardClaimed(saved), true);

  const store = new Map();
  const prevLs = globalThis.localStorage;
  try {
    globalThis.localStorage = {
      getItem: (k) => store.get(k) ?? null,
      setItem: (k, v) => { store.set(k, v); },
      removeItem: (k) => { store.delete(k); },
    };
    const runLoad = newRun(93);
    const loadNode = runLoad.map.nodes.find((n) => n.type === 'treasure') || runLoad.map.nodes.find((n) => n.row === 8);
    runLoad.nodeId = loadNode.id;
    claimTreasure(runLoad);
    delete runLoad.bossRelicAct;
    delete runLoad.orphanRewardClaimed;
    delete runLoad.orphanRewardResolving;
    delete runLoad.pendingHollow;
    delete runLoad.pendingHollowRoute;
    delete runLoad.pendingDawn;
    delete runLoad.boonReceipt;
    saveRun(runLoad);
    const reloaded = loadRun();
    assert.ok(reloaded, 'loadRun returns saved run');
    reloaded.nodeId = loadNode.id;
    assert.equal(reloaded.bossRelicAct, -1, 'loadRun self-heals bossRelicAct');
    assert.equal(reloaded.orphanRewardClaimed, false, 'loadRun self-heals orphanRewardClaimed');
    assert.equal(reloaded.orphanRewardResolving, false, 'loadRun self-heals orphanRewardResolving');
    assert.equal(reloaded.pendingHollow, null, 'loadRun self-heals pendingHollow');
    assert.equal(reloaded.pendingHollowRoute, null, 'loadRun self-heals pendingHollowRoute');
    assert.equal(reloaded.pendingDawn, null, 'loadRun self-heals pendingDawn');
    assert.equal(reloaded.boonReceipt, null, 'loadRun self-heals boonReceipt');
    assert.equal(claimTreasure(reloaded).already, true, 'reward flags survive loadRun round-trip');

    const runEvLoad = newRun(96);
    const evNode = runEvLoad.map.nodes.find((n) => n.type === 'event') || runEvLoad.map.nodes[5];
    runEvLoad.nodeId = evNode.id;
    applyNodeEventChoice(runEvLoad, [{ gold: 15 }]);
    assert.equal(evNode.rewardResolving, true);
    saveRun(runEvLoad);
    const reloadedEv = loadRun();
    assert.ok(reloadedEv);
    const savedEvNode = reloadedEv.map.nodes.find((n) => n.id === evNode.id);
    reloadedEv.nodeId = evNode.id;
    assert.equal(savedEvNode.rewardResolving, true, 'rewardResolving survives loadRun round-trip');
    assert.equal(applyNodeEventChoice(reloadedEv, [{ gold: 99 }]).already, true);

    const saveQuests = Object.fromEntries(QUEST_IDS.map((id) => [id, {
      state: id === 'paleOnes' ? 'armed' : 'dormant', progress: 0, memory: {},
    }]));
    const pending = newRun(411, { quests: saveQuests });
    setPendingEncounter(pending, 'monster', ['paleDuskfang'], 'paleOnes');
    saveRun(pending);
    assert.deepEqual(loadRun().pendingEnemyIds, ['paleDuskfang']);
    assert.equal(saveRun(pending), true, 'saveRun acknowledges durable storage');
    const workingSetItem = globalThis.localStorage.setItem;
    globalThis.localStorage.setItem = () => { throw new Error('quota'); };
    assert.equal(saveRun(pending), false, 'saveRun reports a rejected write');
    globalThis.localStorage.setItem = workingSetItem;

    clearPendingEncounter(pending);
    assert.equal(saveRun(pending), true, 'victory clear requires a durable checkpoint');
    const cleared = loadRun();
    assert.equal(cleared.pendingCombat, null, 'victory checkpoint clears pending combat on reload');
    assert.equal(cleared.pendingEnemyIds, null, 'victory checkpoint clears exact enemies on reload');
    assert.equal(cleared.pendingQuestId, null, 'victory checkpoint clears pending quest on reload');

    const rewardPending = newRun(416, { quests: saveQuests });
    setPendingReward(rewardPending, 'elite', {
      gold: 25, cards: ['strike', 'defend'], potion: 'healing', relic: 'ironTalisman',
    }, true);
    saveRun(rewardPending);
    let rewardReload = loadRun();
    assert.deepEqual(rewardReload.pendingReward, rewardPending.pendingReward, 'pending reward survives reload exactly');
    const rewardGold0 = rewardReload.player.gold;
    assert.equal(takePendingReward(rewardReload, 'gold'), true);
    assert.equal(saveRun(rewardReload), true);
    rewardReload = loadRun();
    assert.equal(rewardReload.pendingReward.taken.gold, true);
    assert.equal(rewardReload.player.gold, rewardGold0 + 25);
    assert.equal(takePendingReward(rewardReload, 'gold'), false, 'reloaded taken reward stays idempotent');

    const pageQuests = Object.fromEntries(QUEST_IDS.map((id) => [id, {
      state: id === 'unreadablePage' ? 'armed' : 'dormant', progress: 0, memory: {},
    }]));
    const pageRewardRun = newRun(419, { quests: pageQuests });
    const firstPageRewards = genCombatRewards(pageRewardRun, 'monster');
    setPendingReward(pageRewardRun, 'monster', firstPageRewards);
    assert.ok(!pageRewardRun.pendingReward.rewards.cards.includes('unreadablePage'));
    clearPendingReward(pageRewardRun);
    const exactPageRewards = genCombatRewards(pageRewardRun, 'monster');
    setPendingReward(pageRewardRun, 'monster', exactPageRewards);
    const exactPageOutbox = structuredClone(pageRewardRun.pendingReward);
    assert.ok(exactPageOutbox.rewards.cards.includes('unreadablePage'));
    assert.equal(saveRun(pageRewardRun), true);
    const pageRewardReload = loadRun();
    assert.deepEqual(pageRewardReload.pendingReward, exactPageOutbox,
      'reload resumes the exact generated Page choice and taken state');
    assert.deepEqual(pageRewardReload.questScratch.unreadablePage, { rewardOrdinal: 2, offered: true },
      'reload does not regenerate or re-advance the Page offer');

    for (const outcome of ['win', 'death', 'abandon']) {
      const finalPending = newRun(417, { quests: saveQuests });
      finalPending.pendingRunEnd = { outcome };
      saveRun(finalPending);
      assert.deepEqual(loadRun().pendingRunEnd, { outcome }, `${outcome} run-end journal survives reload`);
    }

    for (const marker of ['meeting', 'destination']) {
      const terminalHollow = newRun(marker === 'meeting' ? 426 : 427, { quests: saveQuests });
      const node = terminalHollow.map.nodes[0];
      node.type = 'rest';
      terminalHollow.nodeId = node.id;
      terminalHollow.map.visited.push(node.id);
      if (marker === 'meeting') {
        terminalHollow.pendingHollow = {
          nodeId: node.id, type: 'rest', paid: false, deferred: false, answer: null,
        };
      } else {
        terminalHollow.pendingHollowRoute = { nodeId: node.id, type: 'rest', eventId: null };
      }

      journalTerminalOutcome(terminalHollow, 'abandon');
      assert.equal(terminalHollow.pendingHollow, null, `${marker} marker clears before terminal journalling`);
      assert.equal(terminalHollow.pendingHollowRoute, null, `${marker} route clears before terminal journalling`);
      assert.deepEqual(terminalHollow.pendingRunEnd, { outcome: 'abandon' });
      assert.equal(saveRun(terminalHollow), true, `${marker} terminal outbox saves`);

      let failures = 0;
      assert.equal(finaliseTerminalOutbox(
        terminalHollow,
        () => ({ accepted: false }),
        () => { failures++; },
        () => assert.fail(`${marker} rejected finalisation must not continue`),
      ), false, `${marker} failed finalisation remains retryable`);
      assert.equal(failures, 1);
      const terminalReload = loadRun();
      assert.ok(terminalReload, `${marker} failed finalisation reloads the durable run`);
      assert.equal(savedRunRequiresFinalisation(terminalReload), true,
        `${marker} failed finalisation resumes its terminal outbox after reload`);
      assert.deepEqual(terminalReload.pendingRunEnd, { outcome: 'abandon' });
      assert.equal(terminalReload.pendingHollow, null);
      assert.equal(terminalReload.pendingHollowRoute, null);
    }

    const legacyId = newRun(418, { quests: saveQuests });
    delete legacyId.runId;
    saveRun(legacyId);
    const healedLegacy = loadRun();
    assert.match(healedLegacy.runId, /^legacy-[a-z0-9-]+$/, 'legacy run id self-heals deterministically');
    const healedId = healedLegacy.runId;
    saveRun(healedLegacy);
    assert.equal(loadRun().runId, healedId, 'healed legacy run id remains stable');

    const legacyPending = newRun(413, { quests: saveQuests });
    legacyPending.pendingCombat = 'monster';
    delete legacyPending.pendingEnemyIds;
    delete legacyPending.pendingQuestId;
    saveRun(legacyPending);
    const backfill = loadRun();
    assert.equal(backfill.pendingEnemyIds, null, 'legacy pending save self-heals missing enemy ids');
    setPendingEncounter(backfill, 'monster', ['paleDuskfang'], 'paleOnes');
    globalThis.localStorage.setItem = () => { throw new Error('quota'); };
    assert.equal(saveRun(backfill), false, 'rejected backfill is not durable');
    globalThis.localStorage.setItem = workingSetItem;
    assert.equal(loadRun().pendingEnemyIds, null, 'rejected backfill leaves the stored encounter unmodified');
    assert.equal(saveRun(backfill), true, 'legacy backfill can be retried');
    assert.deepEqual(loadRun().pendingEnemyIds, ['paleDuskfang'], 'accepted backfill survives reload');

    const monumentRun = newRun(425, {
      monument: { act: 1, row: 7, bequest: { kind: 'card', id: 'oblivionStrike', up: true } },
    });
    assert.equal(saveRun(monumentRun), true);
    const monumentReload = loadRun();
    assert.deepEqual(monumentReload.monument, {
      act: 1, row: 7, bequest: { kind: 'card', id: 'oblivionStrike', up: true }, claimed: false,
    }, 'a Phase 1 monument survives save/load exactly');
    const monumentDeckSize = monumentReload.player.deck.length;
    assert.deepEqual(claimMonument(monumentReload), { kind: 'card', id: 'oblivionStrike', up: true });
    assert.equal(monumentReload.monument.claimed, true, 'claim state is a persisted boolean');
    assert.equal(saveRun(monumentReload), true);
    const claimedMonumentReload = loadRun();
    assert.equal(claimedMonumentReload.monument.claimed, true);
    assert.equal(claimedMonumentReload.player.deck.length, monumentDeckSize + 1);
    assert.equal(claimMonument(claimedMonumentReload), null, 'a reloaded monument cannot pay twice');

    const standingMonumentRun = newRun(426, {
      monument: { act: 1, row: 8, bequest: { kind: 'gold', amount: 50 }, standing: true, shadeAspect: 1 },
    });
    assert.equal(saveRun(standingMonumentRun), true);
    assert.deepEqual(loadRun().monument, {
      act: 1, row: 8, bequest: { kind: 'gold', amount: 50 }, standing: true, shadeAspect: 1, claimed: false,
    }, 'a standing Shade monument survives save/load exactly');

    const phase2NormalMonumentRun = newRun(427, {
      monument: { act: 1, row: 6, bequest: { kind: 'gold', amount: 40 }, standing: false },
    });
    assert.equal(saveRun(phase2NormalMonumentRun), true);
    assert.deepEqual(loadRun().monument, {
      act: 1, row: 6, bequest: { kind: 'gold', amount: 40 }, standing: false, claimed: false,
    }, 'a Phase 2 normal monument keeps its explicit non-standing marker');

    const legacyHollowComplete = newRun(429, { quests: saveQuests });
    legacyHollowComplete.quests.hollowLamplighter = {
      state: 'complete', progress: QUESTS.hollowLamplighter.target,
      memory: { eligibleMisses: 0 },
    };
    assert.equal(saveRun(legacyHollowComplete), true);
    assert.deepEqual(loadRun().quests.hollowLamplighter, {
      state: 'complete', progress: QUESTS.hollowLamplighter.target, memory: {},
    }, 'the preceding build\'s completed Hollow pity residue self-heals on load');

    const rejectSaved = (label, mutate) => {
      const bad = newRun(412, { quests: saveQuests });
      mutate(bad);
      saveRun(bad);
      assert.equal(loadRun(), null, label);
    };
    const validDawnEvents = () => [
      { t: 'whisper', text: 'The climb continues.' },
      { t: 'questReveal', id: 'paleOnes' },
      { t: 'questProgress', id: 'paleOnes', progress: 3, target: QUESTS.paleOnes.target },
      { t: 'questUnlock', id: 'insight:witchlightLens' },
      { t: 'pageRead', index: 2, text: 'A durable page.' },
      { t: 'eighthResolved', text: 'Eight becomes one.' },
      { t: 'shadeResolved', text: 'The shade remembers.' },
      { t: 'questComplete', id: 'paleOnes' },
      { t: 'shardGrant', id: 'paleOnes' },
      { t: 'act4Reveal' },
    ];
    const setPendingDawn = (r, overrides = {}) => {
      r.pendingDawn = {
        events: validDawnEvents(), cursor: 0, newUnlocks: ['aspect2'], ...overrides,
      };
    };
    const validDawn = newRun(428, { quests: saveQuests });
    setPendingDawn(validDawn);
    assert.equal(saveRun(validDawn), true);
    assert.deepEqual(loadRun().pendingDawn, validDawn.pendingDawn,
      'an exact dawn presentation outbox round-trips');
    const terminalQueue = newRun(430, { quests: saveQuests });
    terminalQueue.pendingRunEnd = { outcome: 'win' };
    terminalQueue.endQueue = validDawnEvents().filter((event) =>
      !['whisper', 'shardGrant', 'act4Reveal'].includes(event.t));
    assert.equal(saveRun(terminalQueue), true);
    const acceptedTerminalQueue = loadRun();
    assert.ok(acceptedTerminalQueue, 'the strict shared schema accepts canonical terminal quest events');
    assert.equal(stagePendingDawn(acceptedTerminalQueue, acceptedTerminalQueue.endQueue, []), true,
      'every accepted canonical terminal event can enter the dawn outbox');
    rejectSaved('unknown variant', (r) => setPendingEncounter(r, 'monster', ['paleUnknown'], 'paleOnes'));
    rejectSaved('unknown quest record', (r) => { r.quests.unknown = { state: 'armed', progress: 0, memory: {} }; });
    rejectSaved('invalid quest state', (r) => { r.quests.paleOnes.state = 'waiting'; });
    rejectSaved('negative quest progress', (r) => { r.quests.paleOnes.progress = -1; });
    rejectSaved('dormant quest with progress', (r) => { r.quests.ownShade.progress = 1; });
    rejectSaved('complete quest below target', (r) => {
      r.quests.ownShade = { state: 'complete', progress: QUESTS.ownShade.target - 1, memory: {} };
    });
    rejectSaved('active quest at completion target', (r) => {
      r.quests.ownShade = { state: 'revealed', progress: QUESTS.ownShade.target, memory: {} };
    });
    rejectSaved('dormant Eighth with guarantee memory', (r) => {
      r.quests.eighthOmen.memory = { dueIn: 1 };
    });
    rejectSaved('seen Eighth with a second guarantee', (r) => {
      r.quests.eighthOmen = { state: 'revealed', progress: 0, memory: { seen: true, dueIn: 1 } };
    });
    rejectSaved('dormant Hollow with ember debt', (r) => {
      r.quests.hollowLamplighter.memory = { emberDebt: 1 };
    });
    rejectSaved('advanced Hollow with ember debt', (r) => {
      r.quests.hollowLamplighter = { state: 'revealed', progress: 1, memory: { emberDebt: 1 } };
    });
    rejectSaved('unknown shard', (r) => { r.shards = ['unknown']; });
    rejectSaved('unknown scratch key', (r) => { r.questScratch.unknown = {}; });
    rejectSaved('malformed scratch', (r) => { r.questScratch.paleOnes = { hiddenDue: 'yes' }; });
    rejectSaved('unknown completion', (r) => { r.questCompletions = ['unknown']; });
    rejectSaved('unknown end event', (r) => { r.endQueue = [{ t: 'mystery' }]; });
    rejectSaved('fractional end-queue quest progress', (r) => {
      r.endQueue = [{
        t: 'questProgress', id: 'paleOnes', progress: 1.5, target: QUESTS.paleOnes.target,
      }];
    });
    rejectSaved('stale end-queue quest target', (r) => {
      r.endQueue = [{
        t: 'questProgress', id: 'paleOnes', progress: 1, target: QUESTS.paleOnes.target - 1,
      }];
    });
    rejectSaved('end-queue quest progress past target', (r) => {
      r.endQueue = [{
        t: 'questProgress', id: 'ownShade', progress: QUESTS.ownShade.target + 1,
        target: QUESTS.ownShade.target,
      }];
    });
    rejectSaved('extra end-queue quest event key', (r) => {
      r.endQueue = [{ t: 'questReveal', id: 'paleOnes', extra: true }];
    });
    rejectSaved('unknown marked-node variant', (r) => { r.map.nodes[0].questVariantId = 'paleUnknown'; });
    rejectSaved('malformed run id', (r) => { r.runId = '__proto__'; });
    rejectSaved('invalid pending run end', (r) => { r.pendingRunEnd = { outcome: 'retreat' }; });
    rejectSaved('extra pending run-end key', (r) => { r.pendingRunEnd = { outcome: 'win', extra: true }; });
    rejectSaved('unknown pending dawn event', (r) => setPendingDawn(r, { events: [{ t: 'mystery' }] }));
    rejectSaved('extra pending dawn marker key', (r) => {
      setPendingDawn(r);
      r.pendingDawn.extra = true;
    });
    rejectSaved('missing pending dawn cursor', (r) => {
      setPendingDawn(r);
      delete r.pendingDawn.cursor;
    });
    rejectSaved('fractional pending dawn cursor', (r) => setPendingDawn(r, { cursor: 0.5 }));
    rejectSaved('pending dawn cursor past the queue', (r) => setPendingDawn(r, { cursor: 99 }));
    rejectSaved('extra pending dawn event key', (r) => {
      const events = validDawnEvents();
      events[0].extra = true;
      setPendingDawn(r, { events });
    });
    rejectSaved('unknown pending dawn quest', (r) => {
      setPendingDawn(r, { events: [{ t: 'questReveal', id: 'toString' }] });
    });
    rejectSaved('invalid pending dawn quest target', (r) => {
      setPendingDawn(r, { events: [{ t: 'questProgress', id: 'paleOnes', progress: 3, target: 99 }] });
    });
    rejectSaved('invalid pending dawn persisted copy', (r) => {
      setPendingDawn(r, { events: [{ t: 'eighthResolved', text: 8 }] });
    });
    rejectSaved('unknown pending dawn unlock', (r) => setPendingDawn(r, { newUnlocks: ['card:toString'] }));
    rejectSaved('duplicate pending dawn unlock', (r) => setPendingDawn(r, { newUnlocks: ['aspect2', 'aspect2'] }));
    rejectSaved('pending dawn excludes pending run end', (r) => {
      setPendingDawn(r);
      r.pendingRunEnd = { outcome: 'win' };
    });
    rejectSaved('pending dawn excludes pending combat', (r) => {
      setPendingDawn(r);
      setPendingEncounter(r, 'monster', ['sporeling']);
    });
    rejectSaved('pending dawn excludes pending reward', (r) => {
      setPendingDawn(r);
      setPendingReward(r, 'monster', { gold: 1, cards: ['strike'], potion: null, relic: null });
    });
    rejectSaved('negative pending reward gold', (r) => {
      setPendingReward(r, 'monster', { gold: 1, cards: ['strike'], potion: null, relic: null });
      r.pendingReward.rewards.gold = -1;
    });
    rejectSaved('invalid pending reward kind', (r) => {
      setPendingReward(r, 'event', { gold: 1, cards: ['strike'], potion: null, relic: null });
    });
    rejectSaved('duplicate pending reward cards', (r) => {
      setPendingReward(r, 'monster', { gold: 1, cards: ['strike', 'strike'], potion: null, relic: null });
    });
    rejectSaved('unknown pending reward card', (r) => {
      setPendingReward(r, 'monster', { gold: 1, cards: ['strike'], potion: null, relic: null });
      r.pendingReward.rewards.cards = ['toString'];
    });
    rejectSaved('unknown pending reward potion', (r) => {
      setPendingReward(r, 'monster', { gold: 1, cards: ['strike'], potion: null, relic: null });
      r.pendingReward.rewards.potion = 'constructor';
    });
    rejectSaved('unknown pending reward relic', (r) => {
      setPendingReward(r, 'monster', { gold: 1, cards: ['strike'], potion: null, relic: null });
      r.pendingReward.rewards.relic = 'toString';
    });
    rejectSaved('invalid pending reward taken flag', (r) => {
      setPendingReward(r, 'monster', { gold: 1, cards: ['strike'], potion: null, relic: null });
      r.pendingReward.taken.card = 'yes';
    });
    rejectSaved('missing pending reward taken flag', (r) => {
      setPendingReward(r, 'monster', { gold: 1, cards: ['strike'], potion: null, relic: null });
      delete r.pendingReward.taken.card;
    });
    rejectSaved('invalid pending reward perfect flag', (r) => {
      setPendingReward(r, 'monster', { gold: 1, cards: ['strike'], potion: null, relic: null });
      r.pendingReward.perfect = 1;
    });
    rejectSaved('extra pending reward key', (r) => {
      setPendingReward(r, 'monster', { gold: 1, cards: ['strike'], potion: null, relic: null });
      r.pendingReward.extra = true;
    });
    rejectSaved('extra pending reward payload key', (r) => {
      setPendingReward(r, 'monster', { gold: 1, cards: ['strike'], potion: null, relic: null });
      r.pendingReward.rewards.extra = true;
    });
    rejectSaved('missing Hollow node', (r) => {
      r.pendingHollow = { nodeId: 'missing', type: 'event', paid: false, deferred: false, answer: null };
    });
    rejectSaved('mismatched Hollow type', (r) => {
      r.pendingHollow = {
        nodeId: r.map.nodes[0].id, type: r.map.nodes[0].type === 'event' ? 'shop' : 'event',
        paid: false, deferred: false, answer: null,
      };
    });
    rejectSaved('extra Hollow field', (r) => {
      r.pendingHollow = {
        nodeId: r.map.nodes[0].id, type: r.map.nodes[0].type,
        paid: false, deferred: false, answer: null, extra: true,
      };
    });
    rejectSaved('unpaid Hollow answer', (r) => {
      r.pendingHollow = {
        nodeId: r.map.nodes[0].id, type: r.map.nodes[0].type,
        paid: false, deferred: false, answer: 'too early',
      };
    });
    const setPendingHollow = (r) => {
      const node = r.map.nodes[0];
      r.nodeId = node.id;
      if (!r.map.visited.includes(node.id)) r.map.visited.push(node.id);
      r.pendingHollow = {
        nodeId: node.id, type: node.type,
        paid: false, deferred: false, answer: null,
      };
    };
    rejectSaved('Hollow meeting must be the current visited node', (r) => {
      setPendingHollow(r);
      r.nodeId = null;
    });
    rejectSaved('Hollow meeting rejects an unvisited current node', (r) => {
      setPendingHollow(r);
      r.map.visited = r.map.visited.filter((id) => id !== r.nodeId);
    });
    rejectSaved('Hollow meeting excludes pending combat', (r) => {
      setPendingHollow(r);
      setPendingEncounter(r, 'monster', ['sporeling']);
    });
    rejectSaved('Hollow meeting excludes pending reward', (r) => {
      setPendingHollow(r);
      setPendingReward(r, 'monster', { gold: 1, cards: ['strike'], potion: null, relic: null });
    });
    rejectSaved('Hollow meeting excludes pending run end', (r) => {
      setPendingHollow(r);
      r.pendingRunEnd = { outcome: 'death' };
    });
    rejectSaved('pending dawn excludes a Hollow meeting', (r) => {
      setPendingHollow(r);
      setPendingDawn(r);
    });
    const firstEventId = Object.keys(EVENTS)[0];
    const setHollowRoute = (r, type = 'rest', eventId = null) => {
      const node = r.map.nodes[0];
      node.type = type;
      r.nodeId = node.id;
      if (!r.map.visited.includes(node.id)) r.map.visited.push(node.id);
      r.pendingHollowRoute = { nodeId: node.id, type, eventId };
    };
    const validHollowRoute = newRun(497, { quests: saveQuests });
    setHollowRoute(validHollowRoute, 'event', firstEventId);
    assert.equal(saveRun(validHollowRoute), true);
    assert.deepEqual(loadRun().pendingHollowRoute, validHollowRoute.pendingHollowRoute,
      'valid exact Hollow destination route round-trips');
    const heldHollowRoute = structuredClone(validHollowRoute.pendingHollowRoute);
    globalThis.localStorage.setItem = () => { throw new Error('quota'); };
    assert.equal(EngineApi.completePendingHollowRoute(validHollowRoute), false,
      'a rejected Hollow-route clear is not acknowledged');
    assert.deepEqual(validHollowRoute.pendingHollowRoute, heldHollowRoute,
      'the engine restores the live Hollow route after a rejected clear');
    globalThis.localStorage.setItem = workingSetItem;
    assert.equal(EngineApi.completePendingHollowRoute(validHollowRoute), true,
      'the same Hollow-route clear can be retried');
    assert.equal(validHollowRoute.pendingHollowRoute, null);
    assert.equal(loadRun().pendingHollowRoute, null,
      'the accepted engine transaction clears the durable Hollow route');
    rejectSaved('missing Hollow route node', (r) => {
      r.pendingHollowRoute = { nodeId: 'missing', type: 'rest', eventId: null };
    });
    rejectSaved('mismatched Hollow route type', (r) => {
      const node = r.map.nodes[0];
      node.type = 'rest';
      r.pendingHollowRoute = { nodeId: node.id, type: 'shop', eventId: null };
    });
    rejectSaved('Hollow route must be the current visited node', (r) => {
      setHollowRoute(r);
      r.nodeId = null;
    });
    rejectSaved('Hollow route rejects an unvisited current node', (r) => {
      setHollowRoute(r);
      r.map.visited = r.map.visited.filter((id) => id !== r.nodeId);
    });
    rejectSaved('combat cannot be a Hollow destination marker', (r) => setHollowRoute(r, 'monster'));
    rejectSaved('Hollow event route requires exact event identity', (r) => setHollowRoute(r, 'event'));
    rejectSaved('unknown Hollow route event', (r) => setHollowRoute(r, 'event', 'toString'));
    rejectSaved('non-event Hollow route rejects event identity', (r) => setHollowRoute(r, 'shop', firstEventId));
    rejectSaved('extra Hollow route field', (r) => {
      setHollowRoute(r);
      r.pendingHollowRoute.extra = true;
    });
    rejectSaved('Hollow route excludes pending meeting', (r) => {
      setHollowRoute(r);
      r.pendingHollow = {
        nodeId: r.map.nodes[0].id, type: r.map.nodes[0].type,
        paid: false, deferred: false, answer: null,
      };
    });
    rejectSaved('Hollow route excludes pending combat', (r) => {
      setHollowRoute(r);
      setPendingEncounter(r, 'monster', ['sporeling']);
    });
    rejectSaved('Hollow route excludes pending reward', (r) => {
      setHollowRoute(r);
      setPendingReward(r, 'monster', { gold: 1, cards: ['strike'], potion: null, relic: null });
    });
    rejectSaved('Hollow route excludes pending run end', (r) => {
      setHollowRoute(r);
      r.pendingRunEnd = { outcome: 'death' };
    });
    rejectSaved('pending dawn excludes a Hollow destination', (r) => {
      setHollowRoute(r);
      setPendingDawn(r);
    });
    const receipt = {
      id: 'fullPurse',
      playerDelta: { gold: 120, hp: 0, maxHp: 0, energyMax: 0 },
      statsGoldEarned: 120, relicsAdded: [], potionSlotsAdded: [],
    };
    const validReceiptRun = newRun(498, { quests: saveQuests });
    applyBoon(validReceiptRun, 'fullPurse');
    saveRun(validReceiptRun);
    assert.deepEqual(loadRun().boonReceipt, validReceiptRun.boonReceipt, 'valid boon receipt round-trips');

    const paymentQuests = structuredClone(saveQuests);
    paymentQuests.hollowLamplighter = { state: 'revealed', progress: 1, memory: {} };
    const paymentRun = newRun(499, { quests: paymentQuests });
    const paymentNode = paymentRun.map.nodes[0];
    paymentRun.nodeId = paymentNode.id;
    paymentRun.map.visited.push(paymentNode.id);
    paymentRun.pendingHollow = {
      nodeId: paymentNode.id, type: paymentNode.type,
      paid: false, deferred: false, answer: null,
    };
    paymentRun.player.gold = 160;
    const paidOnce = payHollowPrice(paymentRun);
    assert.equal(saveRun(paymentRun), true);
    const paidReload = loadRun();
    const paidSnapshot = { gold: paidReload.player.gold, progress: paidReload.quests.hollowLamplighter.progress };
    assert.deepEqual(payHollowPrice(paidReload), paidOnce, 'reloaded paid meeting is idempotent');
    assert.deepEqual({ gold: paidReload.player.gold, progress: paidReload.quests.hollowLamplighter.progress }, paidSnapshot);

    rejectSaved('unknown receipt boon', (r) => { r.boon = 'unknown'; r.boonReceipt = { ...receipt, id: 'unknown' }; });
    rejectSaved('unknown boon without receipt', (r) => { r.boon = 'toString'; });
    rejectSaved('incomplete player delta', (r) => {
      r.boon = 'fullPurse';
      r.boonReceipt = { ...receipt, playerDelta: { gold: 120 } };
    });
    rejectSaved('negative stats delta', (r) => { r.boon = 'fullPurse'; r.boonReceipt = { ...receipt, statsGoldEarned: -1 }; });
    rejectSaved('unknown receipt relic', (r) => { r.boon = 'fullPurse'; r.boonReceipt = { ...receipt, relicsAdded: ['unknown'] }; });
    rejectSaved('invalid potion slot', (r) => {
      r.boon = 'fullPurse';
      r.boonReceipt = { ...receipt, potionSlotsAdded: [{ index: 999, id: 'fire' }] };
    });
    rejectSaved('extra receipt field', (r) => {
      r.boon = 'fullPurse';
      r.boonReceipt = { ...receipt, extra: true };
    });
    rejectSaved('extra player delta field', (r) => {
      r.boon = 'fullPurse';
      r.boonReceipt = { ...receipt, playerDelta: { ...receipt.playerDelta, extra: 0 } };
    });
    rejectSaved('extra potion record field', (r) => {
      r.boon = 'fullPurse';
      r.boonReceipt = { ...receipt, potionSlotsAdded: [{ index: 0, id: 'fire', extra: true }] };
    });
    rejectSaved('inherited monument card toString', (r) => {
      r.monument = { act: 0, row: 5, bequest: { kind: 'card', id: 'toString', up: false }, claimed: false };
    });
    rejectSaved('inherited monument relic constructor', (r) => {
      r.monument = { act: 0, row: 5, bequest: { kind: 'relic', id: 'constructor' }, claimed: false };
    });
    rejectSaved('unknown monument field', (r) => {
      r.monument = { act: 0, row: 5, bequest: null, claimed: false, unknown: true };
    });
    rejectSaved('invalid monument act type', (r) => {
      r.monument = { act: '0', row: 5, bequest: null, claimed: false };
    });
    rejectSaved('invalid monument row type', (r) => {
      r.monument = { act: 0, row: 5.5, bequest: null, claimed: false };
    });
    rejectSaved('invalid monument claimed type', (r) => {
      r.monument = { act: 0, row: 5, bequest: null, claimed: 'false' };
    });
    rejectSaved('missing monument claimed flag', (r) => {
      r.monument = { act: 0, row: 5, bequest: null };
    });
    rejectSaved('invalid monument standing type', (r) => {
      r.monument = { act: 1, row: 5, bequest: null, standing: 'true', shadeAspect: 1, claimed: false };
    });
    rejectSaved('standing monument missing shade aspect', (r) => {
      r.monument = { act: 1, row: 5, bequest: null, standing: true, claimed: false };
    });
    rejectSaved('standing monument invalid shade aspect', (r) => {
      r.monument = { act: 1, row: 5, bequest: null, standing: true, shadeAspect: 2, claimed: false };
    });
    rejectSaved('normal monument cannot carry shade aspect', (r) => {
      r.monument = { act: 1, row: 5, bequest: null, standing: false, shadeAspect: 1, claimed: false };
    });
    for (const inheritedId of ['toString', 'constructor']) {
      rejectSaved(`inherited deck card ${inheritedId}`, (r) => { r.player.deck[0].id = inheritedId; });
      rejectSaved(`inherited player relic ${inheritedId}`, (r) => { r.player.relics = [inheritedId]; });
      rejectSaved(`inherited player potion ${inheritedId}`, (r) => { r.player.potions[0] = inheritedId; });
      rejectSaved(`inherited lantern art ${inheritedId}`, (r) => { r.art = inheritedId; });
      rejectSaved(`inherited omen ${inheritedId}`, (r) => { r.omens = [inheritedId]; });
      rejectSaved(`inherited pending enemy ${inheritedId}`, (r) => setPendingEncounter(r, 'monster', [inheritedId]));
      rejectSaved(`inherited marked variant ${inheritedId}`, (r) => { r.map.nodes[0].questVariantId = inheritedId; });
      rejectSaved(`inherited card bequest ${inheritedId}`, (r) => {
        r.questScratch.ownShade = { pendingBequest: { kind: 'card', id: inheritedId } };
      });
      rejectSaved(`inherited relic bequest ${inheritedId}`, (r) => {
        r.questScratch.ownShade = { pendingBequest: { kind: 'relic', id: inheritedId } };
      });
    }
  } finally {
    if (prevLs) globalThis.localStorage = prevLs;
    else delete globalThis.localStorage;
  }
}
{
  // Legacy stats plus run-save cleanup are exactly once across a failed clear.
  const store = new Map();
  const prevLs = globalThis.localStorage;
  let rejectRunClear = true;
  try {
    globalThis.localStorage = {
      getItem: (k) => store.get(k) ?? null,
      setItem: (k, v) => { store.set(k, v); },
      removeItem: (k) => {
        if (k === 'spirebound_save_v2' && rejectRunClear) throw new Error('busy');
        store.delete(k);
      },
    };
    const run = newRun(419);
    run.pendingRunEnd = { outcome: 'win' };
    saveRun(run);
    assert.equal(recordRunEnd(run, true), false, 'failed run-save cleanup is retryable');
    assert.equal(loadStats().runs, 1);
    assert.equal(loadStats().wins, 1);
    assert.equal(loadStats().lastRunId, run.runId);
    assert.ok(loadRun(), 'failed cleanup leaves the final journal resumable');

    rejectRunClear = false;
    assert.equal(recordRunEnd(loadRun(), true), true, 'cleanup retry succeeds');
    assert.equal(loadStats().runs, 1, 'cleanup retry cannot double-count runs');
    assert.equal(loadStats().wins, 1, 'cleanup retry cannot double-count wins');
    assert.equal(loadRun(), null, 'accepted cleanup removes the current run last');

    const newerRun = newRun(423);
    const newerSnapshot = JSON.stringify(newerRun);
    saveRun(newerRun);
    assert.equal(recordRunEnd(run, true), true, 'stale cleanup is an accepted no-op');
    assert.equal(loadRun().runId, newerRun.runId, 'stale run A cleanup leaves newer run B intact');
    assert.equal(store.get('spirebound_save_v2'), newerSnapshot, 'stale cleanup leaves run B byte-for-byte intact');
    assert.equal(loadStats().runs, 1, 'stale cleanup cannot recount run A');
  } finally {
    if (prevLs) globalThis.localStorage = prevLs;
    else delete globalThis.localStorage;
  }
}
{
  // A winning terminal journal becomes a durable, cursor-acknowledged dawn
  // presentation before its run save may be removed.
  const store = new Map();
  const writes = [];
  const prevLs = globalThis.localStorage;
  let rejectStatsWrite = false;
  let rejectRunWrite = false;
  let rejectRunClear = false;
  try {
    globalThis.localStorage = {
      getItem: (k) => store.get(k) ?? null,
      setItem: (k, v) => {
        writes.push(k);
        if (k === 'spirebound_stats_v1' && rejectStatsWrite) throw new Error('stats busy');
        if (k === 'spirebound_save_v2' && rejectRunWrite) throw new Error('run busy');
        store.set(k, v);
      },
      removeItem: (k) => {
        if (k === 'spirebound_save_v2' && rejectRunClear) throw new Error('clear busy');
        store.delete(k);
      },
    };
    const events = [
      { t: 'whisper', text: 'The climb continues.' },
      { t: 'eighthResolved', text: 'PERSIST THIS EXACT EIGHTH COPY' },
      { t: 'shardGrant', id: 'paleOnes' },
    ];
    const run = newRun(429);
    run.pendingRunEnd = { outcome: 'win' };
    assert.equal(saveRun(run), true);

    rejectStatsWrite = true;
    assert.equal(stagePendingDawn(run, events, ['aspect2']), false,
      'a rejected stats receipt cannot expose a dawn presentation');
    assert.deepEqual(run.pendingRunEnd, { outcome: 'win' });
    assert.equal(run.pendingDawn, null);
    assert.equal(loadStats().runs, 0);
    assert.deepEqual(loadRun().pendingRunEnd, { outcome: 'win' });

    rejectStatsWrite = false;
    rejectRunWrite = true;
    writes.length = 0;
    assert.equal(stagePendingDawn(run, events, ['aspect2']), false,
      'a rejected dawn staging write restores the reloadable terminal journal');
    assert.deepEqual(writes, ['spirebound_stats_v1', 'spirebound_save_v2'],
      'the stats receipt is committed before the dawn outbox is attempted');
    assert.deepEqual(run.pendingRunEnd, { outcome: 'win' });
    assert.equal(run.pendingDawn, null);
    assert.deepEqual(loadRun().pendingRunEnd, { outcome: 'win' });
    assert.equal(loadStats().runs, 1);
    assert.equal(loadStats().wins, 1);
    const statsReceipt = store.get('spirebound_stats_v1');

    rejectRunWrite = false;
    assert.equal(stagePendingDawn(run, events, ['aspect2']), true, 'dawn staging is retryable');
    assert.equal(run.pendingRunEnd, null);
    assert.deepEqual(run.pendingDawn, { events, cursor: 0, newUnlocks: ['aspect2'] });
    assert.deepEqual(loadRun().pendingDawn, run.pendingDawn, 'the presentation survives reload exactly');
    assert.equal(store.get('spirebound_stats_v1'), statsReceipt, 'staging retry cannot recount the run');
    assert.equal(savedRunRequiresFinalisation(loadRun()), true);

    assert.equal(advancePendingDawn(run, 2), false, 'a cursor may acknowledge only the next panel');
    assert.equal(advancePendingDawn(run, 1), true);
    assert.equal(loadRun().pendingDawn.cursor, 1);
    rejectRunWrite = true;
    assert.equal(advancePendingDawn(run, 2), false, 'a rejected cursor acknowledgement remains retryable');
    assert.equal(run.pendingDawn.cursor, 1, 'a rejected acknowledgement rolls back in memory');
    assert.equal(loadRun().pendingDawn.cursor, 1, 'a rejected acknowledgement leaves the durable cursor untouched');
    rejectRunWrite = false;
    assert.equal(advancePendingDawn(run, 2), true);
    assert.equal(advancePendingDawn(run, 3), true);
    assert.equal(completePendingDawn(run), true, 'an acknowledged queue can clear its durable run');
    assert.equal(run.pendingDawn, null);
    assert.equal(loadRun(), null);
    assert.equal(store.get('spirebound_stats_v1'), statsReceipt);

    const clearRetry = newRun(430);
    clearRetry.pendingRunEnd = { outcome: 'win' };
    assert.equal(saveRun(clearRetry), true);
    assert.equal(stagePendingDawn(clearRetry, [{ t: 'shadeResolved', text: 'Still here.' }], []), true);
    assert.equal(completePendingDawn(clearRetry), false, 'an unfinished queue cannot clear its save');
    assert.equal(advancePendingDawn(clearRetry, 1), true);
    rejectRunClear = true;
    assert.equal(completePendingDawn(clearRetry), false, 'a rejected final clear stays locked and retryable');
    assert.equal(clearRetry.pendingDawn.cursor, 1);
    assert.deepEqual(loadRun().pendingDawn, clearRetry.pendingDawn,
      'a clear failure leaves the fully acknowledged outbox reloadable');
    rejectRunClear = false;
    assert.equal(completePendingDawn(clearRetry), true);
    assert.equal(loadRun(), null);
    assert.equal(commitRunStats(clearRetry, true), true, 'the committed stats receipt remains idempotent');
    assert.equal(loadStats().runs, 2);
    assert.equal(loadStats().wins, 2);
  } finally {
    if (prevLs) globalThis.localStorage = prevLs;
    else delete globalThis.localStorage;
  }
}
{
  // all enemies have valid ai over 30 turns
  const run = newRun(9);
  const rng = runRng(run);
  for (const [id, d] of Object.entries(ENEMIES)) {
    const self = { flags: {}, statuses: {}, hp: d.hp[0], maxHp: d.hp[0] };
    const hist = [];
    for (let t = 1; t <= 30; t++) {
      const mv = d.ai({ turn: t, last: hist[hist.length - 1], prev: hist[hist.length - 2], rng, hpFrac: Math.max(0.05, 1 - t * 0.04), self });
      assert.ok(d.moves[mv], `${id} ai returns valid move (${mv})`);
      hist.push(mv);
    }
  }
}
{
  // chips: an attack that draws unblocked blood chips once per card
  const { run, cb } = freshCombat(['gravewarden']); // 5 facets
  const e = cb.enemies[0];
  assert.equal(e.facetMax, 5, 'elite facets');
  assert.equal(e.chips, 0);
  forceHand(run, cb, ['twinFangs']); // 4×2 — multi-hit still chips once
  playCard(run, cb, cb.hand[0].uid, 0);
  assert.equal(e.chips, 1, 'multi-hit chips once');
  e.block = 99;
  forceHand(run, cb, ['strike']);
  playCard(run, cb, cb.hand[0].uid, 0);
  assert.equal(e.chips, 1, 'a fully-warded blow chips nothing');
  e.block = 0;
  cb.player.statuses.beacon = 1;
  forceHand(run, cb, ['strike']);
  playCard(run, cb, cb.hand[0].uid, 0);
  assert.equal(e.chips, 3, 'beacon chips +1');
  endTurn(run, cb);
  assert.ok(!cb.player.statuses.beacon, 'beacon burns out at end of turn');
}
{
  // shatter: stagger + Cracked + embers, gauge resets, glass anneals harder
  const { run, cb } = freshCombat(['gravewarden']);
  const e = cb.enemies[0];
  e.chips = e.facetMax - 1;
  forceHand(run, cb, ['strike']);
  cb.queue.length = 0;
  playCard(run, cb, cb.hand[0].uid, 0);
  assert.ok(cb.queue.find((ev) => ev.t === 'shatter'), 'shatter event');
  assert.ok(e.flags.staggered, 'staggered');
  assert.equal(e.statuses.vulnerable, 2, 'shattered glass is Cracked');
  assert.equal(e.chips, 0, 'gauge reset');
  assert.equal(e.facetMax, 6, 'glass anneals: threshold +1');
  assert.equal(cb.embers, 2, 'embers spill to the lantern');
  assert.equal(run.stats.shatters, 1);
  // the staggered enemy loses its action but its pattern still advances
  const hp0 = cb.player.hp, moves0 = e.lastMoves.length;
  e.statuses.ritual = 2;
  cb.queue.length = 0;
  endTurn(run, cb);
  assert.equal(cb.player.hp, hp0, 'staggered enemy deals nothing');
  assert.ok(cb.queue.find((ev) => ev.t === 'staggered'), 'stagger played back');
  assert.ok(!cb.queue.find((ev) => ev.t === 'enemyAct'), 'no move executed');
  assert.equal(e.lastMoves.length, moves0 + 1, 'skipped move still recorded');
  assert.ok((e.statuses.str || 0) >= 2, 'litany still ticked while staggered');
  assert.ok(!e.flags.staggered, 'stagger spent');
  assert.ok(e.moveKey, 'next intent computed');
}
{
  // embers cap; kindling is once a turn, curses refuse, junk burns fine
  const { run, cb } = freshCombat(['gravewarden']);
  cb.embers = 0;
  const g1 = gainEmbers(run, cb, 4);
  assert.equal(g1, 4);
  assert.equal(gainEmbers(run, cb, 99), 5, 'gain clamps at the cap');
  assert.equal(cb.embers, 9);
  cb.queue.length = 0;
  assert.equal(gainEmbers(run, cb, 5), 0, 'no gain at cap');
  assert.ok(!cb.queue.find((ev) => ev.t === 'ember'), 'no phantom ember event');
  forceHand(run, cb, ['wound', 'hex', 'strike']);
  const [wound, hex, strike] = cb.hand;
  assert.equal(kindleFromHand(run, cb, hex.uid), false, 'hexes cling to the hand');
  cb.embers = 0;
  assert.ok(kindleFromHand(run, cb, wound.uid), 'junk burns fine');
  assert.equal(cb.embers, 1, 'kindling feeds the lantern');
  assert.ok(cb.exhaust.find((c) => c.uid === wound.uid), 'kindled = burned away');
  assert.equal(kindleFromHand(run, cb, strike.uid), false, 'once per turn');
  assert.equal(run.stats.kindles, 1, 'deed counted');
  endTurn(run, cb);
  if (!cb.over) assert.ok(kindleFromHand(run, cb, cb.hand[0]?.uid), 'the rite renews next turn');
}
{
  // exhaust itself feeds the lantern (preparation exhausts on play)
  const { run, cb } = freshCombat(['gravewarden']);
  forceHand(run, cb, ['preparation']);
  playCard(run, cb, cb.hand[0].uid);
  assert.equal(cb.embers, 1, 'exhaust grants an ember');
}
{
  // smolder jumps on shatter (other host) and on death; lost with the last
  const { run, cb } = freshCombat(['sporeling', 'sporeling']);
  const [a, b] = cb.enemies;
  a.statuses.poison = 4;
  a.chips = a.facetMax - 1;
  forceHand(run, cb, ['strike']);
  cb.queue.length = 0;
  playCard(run, cb, cb.hand[0].uid, 0);
  if (a.hp > 0) { // survived the strike: shatter moved the smolder
    assert.ok(!a.statuses.poison, 'smolder left the shattered host');
    assert.equal(b.statuses.poison, 4, 'smolder found new glass');
    assert.ok(cb.queue.find((ev) => ev.t === 'smolderJump'), 'jump played back');
  }
  // death jump
  const { run: r2, cb: c2 } = freshCombat(['sporeling', 'sporeling']);
  c2.enemies[0].hp = 1;
  c2.enemies[0].statuses.poison = 3;
  forceHand(r2, c2, ['strike']);
  playCard(r2, c2, c2.hand[0].uid, 0);
  assert.equal(c2.enemies[1].statuses.poison, 3, 'smolder outlives its vessel');
  assert.equal(c2.embers, 1, 'a death spills one ember');
  // last host: the fire dies with it
  const { run: r3, cb: c3 } = freshCombat(['sporeling']);
  c3.enemies[0].hp = 1;
  c3.enemies[0].statuses.poison = 5;
  forceHand(r3, c3, ['strike']);
  playCard(r3, c3, c3.hand[0].uid, 0);
  assert.equal(c3.result, 'win', 'combat over, nothing to jump to');
}
{
  // Lantern Arts: every art fires, pays its embers, and keeps to once a turn
  for (const [id, art] of Object.entries(ARTS)) {
    const { run, cb } = freshCombat(['gravewarden', 'sporeling']);
    run.art = id;
    cb.embers = 9;
    assert.ok(canUseArt(run, cb), `${id} usable at 9 embers`);
    const hp0 = cb.enemies.map((e) => e.hp);
    const php0 = cb.player.hp;
    assert.ok(useArt(run, cb), `${id} fires`);
    assert.equal(cb.embers, 9 - art.cost, `${id} paid ${art.cost}`);
    assert.equal(run.stats.embersSpent, art.cost, `${id} deed counted`);
    assert.equal(useArt(run, cb), false, `${id} once per turn`);
    for (const fx of art.effects) {
      if (fx.kind === 'dmg') cb.enemies.forEach((e, i) => assert.ok(e.hp <= hp0[i] - fx.n || e.hp <= 0, `${id} hurt all`));
      if (fx.kind === 'status' && fx.who !== 'self') cb.enemies.forEach((e) => e.hp > 0 && assert.ok(e.statuses[fx.id] >= fx.n, `${id} afflicted all`));
      if (fx.kind === 'status' && fx.who === 'self') assert.ok(cb.player.statuses[fx.id] >= fx.n, `${id} self status`);
      if (fx.kind === 'block') assert.ok(cb.player.block >= fx.n, `${id} warded`);
      if (fx.kind === 'heal') assert.ok(cb.player.hp >= php0, `${id} healed`);
    }
  }
  // too poor: the lantern refuses
  const { run, cb } = freshCombat(['gravewarden']);
  run.art = 'flare';
  cb.embers = ARTS.flare.cost - 1;
  assert.equal(canUseArt(run, cb), false, 'not enough embers');
  // beacon: the art's status actually chips extra
  const { run: r2, cb: c2 } = freshCombat(['gravewarden']);
  r2.art = 'beacon';
  c2.embers = 9;
  useArt(r2, c2);
  forceHand(r2, c2, ['strike']);
  playCard(r2, c2, c2.hand[0].uid, 0);
  assert.equal(c2.enemies[0].chips, 2, 'beacon-lit attack chips twice');
}
{
  // previewPlay predicts the shatter it then delivers
  const { run, cb } = freshCombat(['gravewarden']);
  const e = cb.enemies[0];
  e.chips = e.facetMax - 1;
  forceHand(run, cb, ['strike']);
  const snap = JSON.stringify({ e, p: cb.player, embers: cb.embers });
  const pv = previewPlay(run, cb, cb.hand[0], 0);
  assert.equal(JSON.stringify({ e, p: cb.player, embers: cb.embers }), snap, 'shatter preview is pure');
  assert.equal(pv.chips, 1, 'one chip predicted');
  assert.ok(pv.willShatter, 'shatter predicted');
  playCard(run, cb, cb.hand[0].uid, 0);
  assert.ok(e.facetMax === 6 && e.chips === 0, 'and delivered');
  // a warded target predicts no chips
  e.block = 99;
  forceHand(run, cb, ['strike']);
  const pv2 = previewPlay(run, cb, cb.hand[0], 0);
  assert.equal(pv2.chips, 0, 'no blood, no chip');
  assert.ok(!pv2.willShatter);
}
{
  // every card's effects reference valid kinds/statuses
  const kinds = new Set(['dmg', 'block', 'draw', 'energy', 'heal', 'loseHp', 'status', 'special', 'addCard', 'chip', 'ember']);
  for (const [id, c] of Object.entries(CARDS)) {
    for (const fx of c.effects) assert.ok(kinds.has(fx.kind), `${id} fx kind`);
    if (c.up && c.up.effects) for (const fx of c.up.effects) assert.ok(kinds.has(fx.kind), `${id}+ fx kind`);
  }
}
{
  const VFX_KINDS = new Set(['slash', 'pierce', 'blunt', 'fire', 'poison', 'void', 'ward']);
  for (const [id, c] of Object.entries(CARDS)) {
    assert(VFX_KINDS.has(c.vfx), `card ${id} missing/invalid vfx archetype: ${c.vfx}`);
  }
}
{
  // the vigil: deeds accumulate, thresholds unlock, storage is Node-safe
  _setStore(null);
  assert.equal(loadVigil().deeds.runs, 0, 'fresh vigil');
  const run = newRun(42);
  run.stats.shatters = 15;
  run.floorsClimbed = 9;
  const { vigil, newUnlocks } = commitRunToVigil(run, false);
  assert.equal(vigil.deeds.runs, 1, 'run counted');
  assert.equal(vigil.deeds.shatters, 15, 'deed stat folded in');
  assert.ok(newUnlocks.includes('card:quakeblow'), 'shatter deed pays out');
  assert.equal(vigil.news, true, 'deed progress pulses the Vigil');
  assert.deepEqual(commitRunToVigil(run, false).newUnlocks, newUnlocks, 'receipt returns the original idempotent result');
  assert.equal(loadVigil().deeds.runs, 1, 'no double count');
  // a win unlocks the second aspect and the first vow
  const run2 = newRun(43);
  const w = commitRunToVigil(run2, true);
  assert.ok(w.vigil.unlocks.includes('aspect2'), 'first dawn unlocks the Ashwarden');
  assert.equal(w.vigil.vowUnlocked, 1, 'vow I offered after a win');
  assert.deepEqual(syncVigil().unlocks, w.vigil.unlocks, 'sync finds nothing more owed');
  // bequests round-trip
  assert.equal(setBequest(1, 7, { kind: 'gold', amount: 50 }), true, 'bequest write persisted');
  assert.deepEqual(loadVigil().lastFall, { act: 1, row: 7, bequest: { kind: 'gold', amount: 50 }, standing: false });
  assert.equal(clearBequest(), true, 'bequest clear persisted');
  assert.equal(loadVigil().lastFall, null, 'monument claimed and cleared');
  _setStore(null);
}
{
  // deed-bar progress (no new unlock) still pulses the Vigil — design §3
  _setStore(null);
  // seed past the shatter deed threshold so +1 shatter unlocks nothing new
  const seed = loadVigil();
  seed.deeds.shatters = 15;
  seed.unlocks = evaluateDeeds(seed);
  saveVigil(seed);
  clearNews();
  const run = newRun(420);
  run.stats.shatters = 1;
  run.floorsClimbed = 0;
  const { vigil, newUnlocks } = commitRunToVigil(run, false);
  assert.equal(newUnlocks.length, 0, 'no new unlock this run');
  assert.equal(vigil.deeds.shatters, 16, 'deed bar moved');
  assert.equal(vigil.news, true, 'deed progress alone pulses the Vigil');
  _setStore(null);
}
{
  // pools: base content without unlocks, unknown unlock tokens ignored
  const run = newRun(44);
  assert.deepEqual(cardPool(run, 'common'), CARD_POOLS.common);
  assert.deepEqual(relicPool(run, 'boss'), RELIC_POOLS.boss);
  const run2 = newRun(44, { unlocks: ['card:doesNotExist', 'relic:alsoNot'] });
  assert.deepEqual(cardPool(run2, 'common'), CARD_POOLS.common, 'unknown card unlock ignored');
  assert.deepEqual(relicPool(run2, 'common'), RELIC_POOLS.common, 'unknown relic unlock ignored');
}
{
  // progressive delivery tables are well-formed; thresholds live in PROGRESSION
  assert.ok(PROGRESSION.revealThresholds && typeof PROGRESSION.revealThresholds === 'object', 'reveal thresholds in PROGRESSION');
  assert.ok(Array.isArray(REVEALS) && REVEALS.length >= 6, 'reveal table present');
  assert.equal(new Set(REVEALS.map((r) => r.id)).size, REVEALS.length, 'reveal ids unique');
  assert.deepEqual(
    Object.fromEntries(REVEALS.map((r) => [r.id, r.trigger])),
    PROGRESSION.revealThresholds,
    'REVEALS derived from PROGRESSION.revealThresholds',
  );
  for (const r of REVEALS) {
    assert.ok(r.trigger && (r.trigger.runsPlayed != null || r.trigger.wins != null || r.trigger.shards != null), `reveal ${r.id} has a counter trigger`);
  }
  for (const id of ['lamplighter', 'phials', 'omens', 'poolWave2', 'poolWave3', 'poolFull', 'emberglass', 'act4']) {
    assert.ok(REVEALS.some((r) => r.id === id), `reveal ${id} declared`);
  }
  assert.equal(PROGRESSION.revealThresholds.act4.shards, QUEST_IDS.length, 'Act 4 waits for all quest shards');
  for (const [rev, w] of Object.entries(PROGRESSION.poolWaves)) {
    assert.ok(REVEALS.some((r) => r.id === rev), `wave ${rev} matches a reveal id`);
    for (const id of w.cards) assert.ok(CARDS[id] && !CARDS[id].locked, `wave card ${id} exists, not deed-locked`);
    for (const id of w.relics) assert.ok(RELICS[id] && !RELICS[id].locked && RELICS[id].rarity !== 'boss', `wave relic ${id} exists, not deed-locked, not a crown`);
  }
  assert.ok(Object.keys(POOL_GATE.cards).length && Object.keys(POOL_GATE.relics).length, 'pool gate derived');
}
{
  const ids = ['paleOnes', 'ownShade', 'usurper', 'eighthOmen', 'unreadablePage', 'hollowLamplighter'];
  assert.deepEqual(QUEST_IDS, ids);
  assert.deepEqual(Object.keys(QUESTS), ids);
  assert.equal(QUESTS.paleOnes.mode, 'Trail');
  assert.equal(QUESTS.ownShade.mode, 'Trail');
  assert.equal(QUESTS.usurper.mode, 'Gate');
  assert.equal(QUESTS.eighthOmen.mode, 'Gate');
  assert.equal(QUESTS.unreadablePage.mode, 'Trail');
  assert.equal(QUESTS.hollowLamplighter.mode, 'Trail');
  assert.equal(WHISPERS.length, 24);
  assert.equal(WHISPERS.at(-1), 'The climb continues.');
  assert.deepEqual(Object.keys(SHADE_KITS).sort(), ['ashwarden', 'duskblade']);
  for (const [id, v] of Object.entries(VARIANTS)) {
    assert.equal(v.id, id);
    assert.ok(v.base === 'hero' || ENEMIES[v.base], 'variant base exists: ' + id);
    assert.ok(v.tint && Number.isFinite(v.scale) && v.scale > 0);
    assert.ok(Number.isFinite(v.statMods.hpMult) && Number.isFinite(v.statMods.dmgMult));
    assert.ok(Array.isArray(v.dialogue));
  }
  const P = PROGRESSION.emberglass;
  assert.deepEqual(P.armWins, [2, 4, 6, 8, 10]);
  assert.equal(P.paleOnes.lensAt, 3);
  assert.equal(P.paleOnes.completeAt, 9);
  assert.equal(P.ownShade.completeAt, 3);
  assert.equal(P.usurper.price, 650);
  assert.equal(P.usurper.completeAt, 1);
  assert.equal(P.eighthOmen.guaranteeRuns, 2);
  assert.equal(P.eighthOmen.recurrenceChance, 1 / 3);
  assert.equal(P.eighthOmen.completeAt, 1);
  assert.equal(P.unreadablePage.completeAt, 5);
  assert.equal(P.hollowLamplighter.completeAt, 5);
}
{
  const q = Object.fromEntries(QUEST_IDS.map((id) => [id, { state: id === 'usurper' ? 'armed' : 'dormant', progress: 0, memory: {} }]));
  const run = newRun(450, { quests: q });
  run.act = 0;
  assert.deepEqual(genShop(run).questItems, []);
  const earlyGold = run.player.gold;
  assert.deepEqual(buyQuestItem(run, 'flamelessLantern'), { ok: false, reason: 'act' });
  assert.equal(run.player.gold, earlyGold, 'an early direct purchase cannot spend gold');
  assert.deepEqual(run.questScratch, {}, 'an early direct purchase cannot write scratch state');
  run.act = 1;
  let shop = genShop(run);
  assert.equal(shop.questItems[0].price, 650);
  assert.equal(shop.cards.length, 5, 'quest stock never displaces ordinary cards');
  assert.equal(genShop(run).questItems.length, 1, 'every qualifying shop repeats the fixed item until purchase');
  assert.equal(run.quests.usurper.state, 'revealed', 'first sight reveals inscription');
  const poorGold = run.player.gold;
  const poorScratch = structuredClone(run.questScratch);
  assert.deepEqual(buyQuestItem(run, 'flamelessLantern'), { ok: false, reason: 'gold' });
  assert.equal(run.player.gold, poorGold, 'an unaffordable purchase cannot spend gold');
  assert.deepEqual(run.questScratch, poorScratch, 'an unaffordable purchase cannot write scratch state');
  run.player.gold = 650;
  assert.deepEqual(buyQuestItem(run, 'flamelessLantern'), { ok: true, reason: null });
  assert.equal(run.player.gold, 0);
  run.player.gold = 650;
  const boughtScratch = structuredClone(run.questScratch);
  assert.deepEqual(buyQuestItem(run, 'flamelessLantern'), { ok: false, reason: 'bought' });
  assert.equal(run.player.gold, 650, 'a duplicate purchase cannot spend gold');
  assert.deepEqual(run.questScratch, boughtScratch, 'a duplicate purchase cannot rewrite scratch state');
  assert.deepEqual(genShop(run).questItems, [], 'later shops omit the item bought in this run');
  run.act = 2;
  assert.deepEqual(rollEncounter(run, 'boss', 14), ['usurpedSovereign']);
  setPendingEncounter(run, 'boss', rollEncounter(run, 'boss', 14));
  assert.deepEqual(run.pendingEnemyIds, ['usurpedSovereign'], 'the exact Usurper identity is held pending');
  clearPendingEncounter(run);

  const boss = startCombat(run, ['usurpedSovereign'], 'boss');
  boss.enemies[0].hp = 1;
  forceHand(run, boss, ['strike']);
  boss.player.energy = 3;
  playCard(run, boss, boss.hand[0].uid, 0);
  assert.equal(run.quests.usurper.state, 'complete');
  assert.equal(run.questCompletions.filter((id) => id === 'usurper').length, 1);
  const deathLine = boss.queue.findIndex((event) => event.t === 'variantDialogue' && event.text === QUESTS.usurper.death);
  const victory = boss.queue.findIndex((event) => event.t === 'victory');
  assert.ok(deathLine >= 0 && deathLine < victory, 'the authored death line and drop queue before victory');
}
{
  const inactive = newRun(454);
  const gold = inactive.player.gold;
  assert.deepEqual(buyQuestItem(inactive, 'wrongItem'), { ok: false, reason: 'unknown' });
  assert.deepEqual(buyQuestItem(inactive, 'flamelessLantern'), { ok: false, reason: 'inactive' });
  assert.equal(inactive.player.gold, gold, 'unknown and inactive purchases cannot spend gold');
  assert.deepEqual(inactive.questScratch, {}, 'unknown and inactive purchases cannot write scratch state');
}
{
  const quests = Object.fromEntries(QUEST_IDS.map((id) => [id, { state: id === 'usurper' ? 'armed' : 'dormant', progress: 0, memory: {} }]));
  const run = newRun(455, { quests });
  run.nodeId = 'shared-shop-coordinate';
  run.act = 0;
  const shopSession = {};
  const ineligible = shopStockForSession(shopSession, run);
  const actOneKey = shopSessionKey(run);
  assert.deepEqual(ineligible.questItems, []);

  run.act = 1;
  assert.notEqual(shopSessionKey(run), actOneKey, 'act identity is part of the shop session key');
  const eligible = shopStockForSession(shopSession, run);
  assert.notStrictEqual(eligible, ineligible, 'the same node coordinate in another act regenerates stock');
  assert.equal(eligible.questItems.length, 1, 'the regenerated Act 2 shop gains eligible quest stock');
  run.player.gold = 650;
  assert.deepEqual(buyQuestItem(run, 'flamelessLantern'), { ok: true, reason: null });
  eligible.questItems[0].sold = true;
  assert.strictEqual(shopStockForSession(shopSession, run), eligible,
    'a same-shop rerender preserves the sold row');

  const nextRun = newRun(456, { quests: run.quests });
  nextRun.nodeId = run.nodeId;
  nextRun.act = run.act;
  assert.notEqual(shopSessionKey(nextRun), shopSessionKey(run), 'run identity is part of the shop session key');
  const nextStock = shopStockForSession(shopSession, nextRun);
  assert.notStrictEqual(nextStock, eligible, 'the same node coordinate in another run regenerates stock');
  assert.equal(nextStock.questItems.length, 1);
  assert.equal(nextStock.questItems[0].sold, false, 'a new run cannot inherit the prior shop row state');
}
{
  assert.ok(OMENS.eighthOmen, 'the Eighth Omen is registered as a real omen');
  assert.deepEqual(OMENS.eighthOmen.mods, { allCombatsAffixed: true });
  assert.equal(QUESTS.eighthOmen.floorEchoes.length, 4);
  _setStore(null);
  let v = loadVigil();
  v.quests.eighthOmen = { state: 'armed', progress: 0, memory: { dueIn: 2 } };
  saveVigil(v);

  EngineApi._setQuestRng(() => 0.9); // first post-arm run misses its 1/3 chance
  const first = newRun(460, { quests: questSnapshot(v), reveals: [] });
  assert.equal(first.omens[0], null, 'a missed special roll does not leak generic omens early');
  assert.deepEqual(first.questScratch.eighthOmen, { active: false });
  assert.equal(first.quests.eighthOmen.memory.dueIn, 1);
  let out = commitRunEnd(first, 'abandon');
  assert.equal(out.vigil.quests.eighthOmen.memory.dueIn, 1, 'miss persists the guarantee countdown');

  EngineApi._setQuestRng(() => 0.9); // chance no longer matters: second run is forced
  const forced = newRun(461, { quests: questSnapshot(out.vigil), reveals: [] });
  assert.equal(forced.omens[0], 'eighthOmen');
  assert.deepEqual(forced.questScratch.eighthOmen, { active: true });
  assert.equal(forced.quests.eighthOmen.memory.seen, true);
  assert.equal('dueIn' in forced.quests.eighthOmen.memory, false);
  for (const act of [1, 2]) {
    forced.act = act;
    forced.omens.push(EngineApi.omenEnabled(forced) ? rollOmen(forced) : null);
    assert.equal(forced.omens[act], 'eighthOmen', 'live act transition keeps Eighth in act ' + (act + 1));
  }
  forced.act = 1;
  const cb = startCombat(forced, ['duskfang'], 'normal');
  assert.ok(cb.affix, 'non-boss combat receives one affix');

  forced.act = 2;
  forced.player.deck = forced.player.deck.filter((c) => c.id !== 'unreadablePage');
  const boss = startCombat(forced, ['sovereign'], 'boss');
  assert.equal(boss.affix, null, 'the final boss remains un-affixed');
  boss.enemies[0].hp = 1;
  forceHand(forced, boss, ['strike']);
  boss.player.energy = 3;
  playCard(forced, boss, boss.hand[0].uid, 0);
  assert.equal(forced.quests.eighthOmen.state, 'complete');
  assert.equal(forced.questCompletions.filter((id) => id === 'eighthOmen').length, 1);
  assert.deepEqual(forced.endQueue.filter((event) => event.t === 'eighthResolved'), [{
    t: 'eighthResolved', text: QUESTS.eighthOmen.resolved,
  }], 'the Eighth producer persists the canonical authored copy once');
  const forcedReceiptSnapshot = JSON.stringify(forced);
  commitRunToVigil(forced, true);
  out = commitRunEnd(forced, 'win');
  assert.equal('dueIn' in out.vigil.quests.eighthOmen.memory, false, 'forced-run deletion persists');
  const committedWhispers = out.vigil.whispers;
  const receiptRetry = commitRunEnd(JSON.parse(forcedReceiptSnapshot), 'win');
  assert.equal('dueIn' in receiptRetry.vigil.quests.eighthOmen.memory, false,
    'fresh-object receipt retry preserves the authoritative dueIn deletion');
  assert.equal(receiptRetry.vigil.whispers, committedWhispers,
    'fresh-object receipt retry cannot consume another global whisper');
  assert.deepEqual(receiptRetry.completed, ['eighthOmen']);

  const firstHitQ = questSnapshot(out.vigil);
  firstHitQ.eighthOmen = { state: 'armed', progress: 0, memory: { dueIn: 2 } };
  EngineApi._setQuestRng(() => 0.1);
  const firstHit = newRun(462, { quests: firstHitQ, reveals: [] });
  assert.equal(firstHit.omens[0], 'eighthOmen', 'first post-arm run may hit the 1/3 roll');
  assert.equal('dueIn' in firstHit.quests.eighthOmen.memory, false);

  const recurrenceQ = questSnapshot(out.vigil);
  recurrenceQ.eighthOmen = { state: 'revealed', progress: 0, memory: { seen: true } };
  EngineApi._setQuestRng(() => 0.2);
  assert.equal(newRun(463, { quests: recurrenceQ, reveals: [] }).omens[0], 'eighthOmen');
  EngineApi._setQuestRng(() => 0.9);
  assert.equal(newRun(464, { quests: recurrenceQ, reveals: [] }).omens[0], null);

  const ordinary = newRun(465, { reveals: ['omens'] });
  assert.notEqual(ordinary.omens[0], 'eighthOmen', 'an unarmed generic omen roll cannot leak the special omen');

  EngineApi._setQuestRng(null);
  _setStore(null);
}
{
  // Task 12B: simultaneous frozen core + tuned contexts (no global PROGRESSION mutation).
  const core = CORE_CONTENT;
  const tuned = makeTunedContent({
    progression: { features: { emberglass: {
      eighthOmen: { guaranteeRuns: 4, saveDueInMax: 4 },
      paleOnes: { hiddenPerRun: 2, markedAct1: 2 },
      hollowLamplighter: { maxMeetingsPerRun: 2, emberDebt: 4, saveEmberDebtMax: 4 },
      unreadablePage: { completeAt: 6 },
    } } },
  }, 'tuned-context');
  assert.equal(Object.isFrozen(core), true, 'core context is frozen');
  assert.equal(Object.isFrozen(tuned), true, 'tuned context is frozen');
  assert.throws(() => { core.progression.emberglass.eighthOmen.guaranteeRuns = 99; }, TypeError,
    'core context nested writes throw');
  assert.throws(() => { tuned.progression.emberglass.paleOnes.hiddenPerRun = 99; }, TypeError,
    'tuned context nested writes throw');
  assert.notEqual(tuned.progression.emberglass.eighthOmen.guaranteeRuns,
    core.progression.emberglass.eighthOmen.guaranteeRuns,
    'tuned context does not observe core progression');
  assert.equal(tuned.quests.hollowLamplighter.target, core.quests.hollowLamplighter.target,
    'Hollow target re-derived from tuned progression completeAt unless overridden');
  assert.equal(tuned.quests.unreadablePage.target, 6);
  assert.equal(tuned.variants.paleDuskfang.statMods,
    tuned.progression.emberglass.variantStats.pale,
    'tuned variant stat aliases re-derived from the clone');

  EngineApi._setQuestRng(() => 0.99);
  const questSet = (activeId, memory = {}) => Object.fromEntries(QUEST_IDS.map((id) => [id, {
    state: id === activeId ? 'revealed' : 'dormant', progress: 0,
    memory: id === activeId ? { ...memory } : {},
  }]));
  const eighthQuests = Object.fromEntries(QUEST_IDS.map((id) => [id, {
    state: id === 'eighthOmen' ? 'armed' : 'dormant', progress: 0,
    memory: id === 'eighthOmen' ? { dueIn: 4 } : {},
  }]));
  const missed = newRun(466, { ephemeral: true, content: tuned, quests: eighthQuests, reveals: [] });
  assert.equal(contentIdFor(missed), 'tuned-context');
  assert.equal(isEphemeralRun(missed), true);
  assert.deepEqual(missed.questScratch.eighthOmen, { active: false });
  assert.equal(missed.quests.eighthOmen.memory.dueIn, 3,
    'a configured four-run guarantee decrements instead of assuming two');
  eighthQuests.eighthOmen.memory.dueIn = 1;
  const forced = newRun(467, { ephemeral: true, content: tuned, quests: eighthQuests, reveals: [] });
  assert.deepEqual(forced.questScratch.eighthOmen, { active: true },
    'the final configured guarantee run remains forced');

  const hidden = newRun(468, { ephemeral: true, content: tuned, quests: questSet('paleOnes'), reveals: [] });
  assert.equal(hidden.questScratch.paleOnes.hiddenRemaining, 2);
  assert.equal(rollEncounter(hidden, 'monster', 1)[0], 'paleDuskfang');
  assert.equal(rollEncounter(hidden, 'monster', 2)[0], 'paleDuskfang');
  assert.ok(!rollEncounter(hidden, 'monster', 3)[0].startsWith('pale'),
    'hiddenPerRun controls the exact unmarked encounter count');

  const marked = newRun(469, {
    ephemeral: true, content: tuned,
    quests: questSet('paleOnes'), unlocks: ['insight:witchlightLens'], reveals: [],
  });
  const actOneCandidates = marked.map.nodes.filter((node) => node.row === 0 && node.type === 'monster');
  assert.equal(actOneCandidates.filter((node) => node.questMarked).length,
    Math.min(2, actOneCandidates.length), 'markedAct1 controls distinct marked nodes');

  const hollow = newRun(470, {
    ephemeral: true, content: tuned,
    quests: questSet('hollowLamplighter', {
      eligibleMisses: tuned.progression.emberglass.hollowLamplighter.pityEligibleRuns - 1,
    }),
    reveals: [],
  });
  const meetingNodes = hollow.map.nodes.slice(0, 3);
  meetingNodes.forEach((node) => { node.unlit = true; node.bounty = 0; });
  assert.equal(visitNode(hollow, meetingNodes[0]).hollow, true);
  hollow.pendingHollow = null;
  assert.equal(visitNode(hollow, meetingNodes[1]).hollow, true);
  hollow.pendingHollow = null;
  assert.equal(visitNode(hollow, meetingNodes[2]).hollow, undefined,
    'maxMeetingsPerRun caps later eligible nodes');
  assert.equal(hollow.questScratch.hollowLamplighter.meetings, 2);

  const debtHollow = newRun(473, {
    ephemeral: true, content: tuned,
    quests: questSet('hollowLamplighter', {
      eligibleMisses: tuned.progression.emberglass.hollowLamplighter.pityEligibleRuns - 1,
    }),
    reveals: [],
  });
  const debtNodes = debtHollow.map.nodes.slice(0, 2);
  debtNodes.forEach((node) => { node.unlit = true; node.bounty = 0; });
  assert.equal(visitNode(debtHollow, debtNodes[0]).hollow, true);
  assert.equal(payHollowPrice(debtHollow).deferred, true);
  const debtCombat = startCombat(debtHollow, ['sporeling']);
  gainEmbers(debtHollow, debtCombat, tuned.progression.emberglass.hollowLamplighter.emberDebt - 1);
  assert.equal(debtHollow.quests.hollowLamplighter.memory.emberDebt, 1);
  debtHollow.pendingHollow = null;
  assert.equal(visitNode(debtHollow, debtNodes[1]).hollow, undefined,
    'an outstanding deferred ember price blocks a repeated meeting');
  assert.equal(debtHollow.quests.hollowLamplighter.memory.emberDebt, 1,
    'a later unlit node cannot reset an outstanding ember debt');
  assert.equal(debtHollow.questScratch.hollowLamplighter.meetings, 1);

  const completeHollow = newRun(474, {
    ephemeral: true, content: tuned,
    quests: Object.fromEntries(QUEST_IDS.map((id) => [id, {
      state: id === 'hollowLamplighter' ? 'revealed' : 'dormant',
      progress: id === 'hollowLamplighter' ? tuned.quests.hollowLamplighter.target - 1 : 0,
      memory: id === 'hollowLamplighter'
        ? { eligibleMisses: tuned.progression.emberglass.hollowLamplighter.pityEligibleRuns - 1 }
        : {},
    }])),
    reveals: [],
  });
  const completeNodes = completeHollow.map.nodes.slice(0, 2);
  completeNodes.forEach((node) => { node.unlit = true; node.bounty = 0; });
  assert.equal(visitNode(completeHollow, completeNodes[0]).hollow, true);
  assert.equal(payHollowPrice(completeHollow).ok, true);
  assert.equal(completeHollow.quests.hollowLamplighter.state, 'complete');
  completeHollow.pendingHollow = null;
  assert.equal(visitNode(completeHollow, completeNodes[1]).hollow, undefined,
    'a completed Hollow Trail cannot open another meeting');
  assert.equal(completeHollow.questScratch.hollowLamplighter.meetings, 1);

  const shadeTierIds = Object.keys(tuned.variants)
    .filter((id) => /^ownShade[1-9]\d*$/.test(id))
    .sort((a, b) => Number(a.slice('ownShade'.length)) - Number(b.slice('ownShade'.length)));
  assert.equal(tuned.progression.emberglass.ownShade.tiers.length, tuned.quests.ownShade.target,
    'each fixed Shade stage has one authored stat tier');
  assert.deepEqual(shadeTierIds,
    tuned.progression.emberglass.ownShade.tiers.map((_, index) => `ownShade${index + 1}`),
    'each fixed Shade stage has one contiguous combat variant');
  assert.equal(tuned.quests.hollowLamplighter.meetings.length, tuned.quests.hollowLamplighter.target,
    'each configured Hollow completion step has one authored price conversation');

  // Core run must not observe tuned progression / encounters / cards.
  const coreRun = newRun(480);
  assert.equal(contentIdFor(coreRun), 'core');
  assert.equal(isEphemeralRun(coreRun), false);
  assert.equal(themeCount(coreRun), 3);
  assert.equal(isFinalTheme({ ...coreRun, act: 2 }), true);
  assert.equal(cardData(makeCard(coreRun, 'strike'), coreRun).name, cardData(makeCard(missed, 'strike'), missed).name);
  const corePale = newRun(482, { quests: questSet('paleOnes'), reveals: [] });
  assert.equal(corePale.questScratch.paleOnes.hiddenRemaining, 1);
  assert.notEqual(hidden.questScratch.paleOnes.hiddenRemaining, corePale.questScratch.paleOnes.hiddenRemaining);

  assert.throws(() => newRun(1, { ephemeral: true, content: tuned, art: 'not-a-real-art' }), /unknown art/);
  assert.throws(() => newRun(1, { ephemeral: true, content: { id: 'raw' } }), /frozen|missing domain/i);
  assert.throws(() => newRun(1, { ephemeral: true, content: tuned, boon: 'not-a-real-boon' }), /unknown boon/);

  const previousLocalStorage = globalThis.localStorage;
  const mem = new Map();
  try {
    globalThis.localStorage = {
      getItem: (key) => mem.get(key) ?? null,
      setItem: (key, value) => mem.set(key, value),
      removeItem: (key) => mem.delete(key),
    };

    const ephemeral = newRun(481, { ephemeral: true, content: tuned });
    assert.equal(saveRun(ephemeral), true, 'ephemeral saveRun returns predecessor success');
    assert.equal(mem.size, 0, 'ephemeral saveRun does not touch storage');
    assert.equal(commitRunStats(ephemeral, true), true);
    assert.equal(mem.size, 0, 'ephemeral commitRunStats does not touch storage');
    assert.equal(recordRunEnd(ephemeral, false), true);
    assert.equal(mem.size, 0, 'ephemeral recordRunEnd does not touch storage');

    const high = makeTunedContent({
      progression: { features: { emberglass: {
        paleOnes: { hiddenPerRun: 2 },
        eighthOmen: { guaranteeRuns: 4, saveDueInMax: 4 },
        hollowLamplighter: { emberDebt: 4, saveEmberDebtMax: 4, maxMeetingsPerRun: 2 },
        unreadablePage: { completeAt: 6 },
      } } },
    }, 'tuned-high');
    const low = makeTunedContent({
      progression: { features: { emberglass: {
        paleOnes: { hiddenPerRun: 1 },
        eighthOmen: { guaranteeRuns: 1, saveDueInMax: 2 },
        hollowLamplighter: { emberDebt: 2, saveEmberDebtMax: 3, maxMeetingsPerRun: 1 },
      } } },
    }, 'tuned-low');

    const historicalQuests = questSet('paleOnes');
    historicalQuests.hollowLamplighter = {
      state: 'revealed', progress: 1, memory: { eligibleMisses: 0 },
    };
    const historical = newRun(471, { content: high, quests: historicalQuests, reveals: [] });
    historical.questScratch.hollowLamplighter = {
      due: true, met: true, meetings: 2, debtActive: false,
    };
    assert.equal(saveRun(historical), true);
    const durableHistorical = JSON.parse(mem.get('spirebound_save_v2'));
    const historicalReload = _normaliseRunSnapshotForTest(durableHistorical, low);
    assert.ok(historicalReload, 'lower tuning does not invalidate historical scheduler counters');
    assert.equal(contentIdFor(historicalReload), 'tuned-low');
    assert.equal(historicalReload.questScratch.paleOnes.hiddenRemaining, 2);
    assert.equal(historicalReload.questScratch.hollowLamplighter.meetings, 2);
    assert.equal(rollEncounter(historicalReload, 'monster', 1)[0], 'paleDuskfang');
    assert.ok(!rollEncounter(historicalReload, 'monster', 2)[0].startsWith('pale'),
      'the current lower hidden-fight cap governs future encounters');

    const inconsistentPale = structuredClone(durableHistorical);
    inconsistentPale.questScratch.paleOnes.hiddenDue = false;
    assert.equal(_normaliseRunSnapshotForTest(inconsistentPale, low), null,
      'redundant Pale scheduler fields must agree');
    const inconsistentHollow = structuredClone(durableHistorical);
    inconsistentHollow.questScratch.hollowLamplighter.met = false;
    assert.equal(_normaliseRunSnapshotForTest(inconsistentHollow, low), null,
      'redundant Hollow scheduler fields must agree');

    const dynamicSave = newRun(472, { content: high });
    dynamicSave.quests.eighthOmen = { state: 'armed', progress: 0, memory: { dueIn: 4 } };
    dynamicSave.quests.hollowLamplighter = { state: 'revealed', progress: 0, memory: { emberDebt: 4 } };
    dynamicSave.endQueue = [{ t: 'pageRead', index: 6, text: 'A sixth configured page.' }];
    assert.equal(saveRun(dynamicSave), true);
    assert.ok(_normaliseRunSnapshotForTest(JSON.parse(mem.get('spirebound_save_v2')), high),
      'configured guarantee, ember debt, and Page target pass save validation');

    const compatibilitySave = newRun(475);
    compatibilitySave.quests.eighthOmen = {
      state: 'armed', progress: 0, memory: { dueIn: PROGRESSION.emberglass.eighthOmen.guaranteeRuns },
    };
    compatibilitySave.quests.hollowLamplighter = {
      state: 'revealed', progress: 0,
      memory: { emberDebt: PROGRESSION.emberglass.hollowLamplighter.emberDebt },
    };
    assert.equal(saveRun(compatibilitySave), true);
    assert.ok(loadRun(), 'core loadRun still accepts shipped memory contracts');

    const excessiveDue = structuredClone(JSON.parse(mem.get('spirebound_save_v2')));
    excessiveDue.quests.eighthOmen.memory.dueIn =
      PROGRESSION.emberglass.eighthOmen.saveDueInMax + 1;
    mem.set('spirebound_save_v2', JSON.stringify(excessiveDue));
    assert.equal(loadRun(), null, 'Eighth historical compatibility remains schema-bounded');
    const excessiveDebt = structuredClone(compatibilitySave);
    excessiveDebt.quests.hollowLamplighter.memory.emberDebt =
      PROGRESSION.emberglass.hollowLamplighter.saveEmberDebtMax + 1;
    mem.set('spirebound_save_v2', JSON.stringify(excessiveDebt));
    assert.equal(loadRun(), null, 'Hollow historical compatibility remains schema-bounded');
    assert.equal(_normaliseRunSnapshotForTest(excessiveDebt, low), null,
      'explicit tuned normaliser rejects above-ceiling ember debt');
  } finally {
    EngineApi._setQuestRng(null);
    if (previousLocalStorage) globalThis.localStorage = previousLocalStorage;
    else delete globalThis.localStorage;
  }
}
{
  // Task 12B fix: dawn validators must observe the run-bound quest targets.
  assert.equal(QUESTS.unreadablePage.target, 5, 'core Unreadable Page target remains 5');
  const dawnTuned = makeTunedContent({
    progression: { features: { emberglass: { unreadablePage: { completeAt: 6 } } } },
  }, 'dawn-tuned');
  assert.equal(dawnTuned.quests.unreadablePage.target, 6);
  const prevLs = globalThis.localStorage;
  const store = new Map();
  try {
    globalThis.localStorage = {
      getItem: (k) => store.get(k) ?? null,
      setItem: (k, v) => store.set(k, v),
      removeItem: (k) => store.delete(k),
    };
    const dawnRun = newRun(512, { content: dawnTuned });
    dawnRun.pendingRunEnd = { outcome: 'win' };
    assert.equal(saveRun(dawnRun), true);
    const tunedDawnEvents = [
      { t: 'pageRead', index: 6, text: 'SIXTH PAGE — Tuned ceiling.' },
      { t: 'questProgress', id: 'unreadablePage', progress: 6, target: 6 },
    ];
    assert.equal(stagePendingDawn(dawnRun, tunedDawnEvents, []), true,
      'stagePendingDawn accepts tuned pageRead/questProgress targets');
    assert.equal(dawnRun.pendingDawn.events.length, 2);
    assert.equal(advancePendingDawn(dawnRun, 1), true,
      'advancePendingDawn re-validates against run-bound content');
    assert.equal(advancePendingDawn(dawnRun, 2), true);
    assert.equal(completePendingDawn(dawnRun), true,
      'completePendingDawn re-validates against run-bound content');

    const coreDawn = newRun(513);
    coreDawn.pendingRunEnd = { outcome: 'win' };
    assert.equal(saveRun(coreDawn), true);
    assert.equal(stagePendingDawn(coreDawn, tunedDawnEvents, []), false,
      'core content still rejects above-ceiling dawn events');
  } finally {
    if (prevLs) globalThis.localStorage = prevLs;
    else delete globalThis.localStorage;
  }
}
{
  // Task 12B fix: run-capable cardData callers must pass run.
  const cardTuned = makeTunedContent({}, 'card-tuned', (authoring) => {
    authoring.cards.strike.cost = 2;
    authoring.cards.strike.effects = [{ kind: 'dmg', n: 99 }];
    authoring.cards.burn.endTurnDmg = 7;
    authoring.cards.defend.unremovable = true;
    authoring.cards.hex.type = 'skill';
  });
  const tunedRun = newRun(514, { ephemeral: true, content: cardTuned });
  const strike = makeCard(tunedRun, 'strike');
  assert.equal(cardData(strike).cost, 1, 'one-argument cardData stays on the core catalogue');
  assert.equal(cardData(strike).effects[0].n, 6);
  assert.equal(cardData(strike, tunedRun).cost, 2, 'run-bound cardData observes tuned cost');
  assert.equal(cardData(strike, tunedRun).effects[0].n, 99, 'run-bound cardData observes tuned effects');

  assert.ok(!removableCards(tunedRun).some((c) => c.id === 'defend'),
    'removableCards observes tuned unremovable via run');
  const defend = tunedRun.player.deck.find((c) => c.id === 'defend');
  assert.ok(defend);
  assert.equal(removeCardFromDeck(tunedRun, defend.uid), false,
    'removeCardFromDeck observes tuned unremovable via run');

  const previewCb = startCombat(tunedRun, ['gravewarden']);
  const handStrike = previewCb.hand.find((c) => c.id === 'strike') || (() => {
    const c = makeCard(tunedRun, 'strike');
    previewCb.hand.push(c);
    return c;
  })();
  assert.equal(effCost(tunedRun, previewCb, handStrike), 2, 'effCost observes tuned cost via run');
  assert.equal(canPlay(tunedRun, previewCb, handStrike, 0), true);
  assert.equal(previewPlay(tunedRun, previewCb, handStrike, 0).hits[0].dmg, 99,
    'previewPlay observes tuned damage via run');

  const kindleRun = newRun(516, { ephemeral: true, content: cardTuned });
  const kindleCombat = startCombat(kindleRun, ['sporeling']);
  const tunedHex = makeCard(kindleRun, 'hex');
  kindleCombat.hand = [tunedHex];
  assert.equal(cardData(tunedHex).type, 'curse', 'one-argument cardData still sees core hex as curse');
  assert.equal(canKindle(kindleRun, kindleCombat, tunedHex), true,
    'canKindle observes tuned type via run (hex retuned off curse)');

  const burnRun = newRun(517, { ephemeral: true, content: cardTuned });
  const burnCb = startCombat(burnRun, ['sporeling']);
  burnCb.hand = [makeCard(burnRun, 'burn')];
  burnCb.queue.length = 0;
  endTurn(burnRun, burnCb);
  const burnHit = burnCb.queue.find((e) => e.t === 'hitPlayer' && e.source === 'burn');
  assert.equal(burnHit?.amount, 7, 'endTurn observes tuned endTurnDmg via run');

  const playRun = newRun(518, { ephemeral: true, content: cardTuned });
  const playCb = startCombat(playRun, ['gravewarden']);
  const playStrike = playCb.hand.find((c) => c.id === 'strike') || (() => {
    const c = makeCard(playRun, 'strike');
    playCb.hand.push(c);
    return c;
  })();
  playCb.enemies[0].block = 0;
  playCb.queue.length = 0;
  assert.equal(playCard(playRun, playCb, playStrike.uid, 0), true);
  const hit = playCb.queue.find((e) => e.t === 'hitEnemy');
  assert.equal(hit?.amount, 99, 'playCard applies tuned damage via run-bound cardData');
}
{
  const q = Object.fromEntries(QUEST_IDS.map((id) => [id, {
    state: id === 'unreadablePage' ? 'armed' : 'dormant', progress: 0, memory: {},
  }]));
  const run = newRun(470, { quests: q });
  assert.equal(CARDS.unreadablePage?.unplayable, true, 'the Page is an unplayable special card');
  assert.equal(CARDS.unreadablePage?.unremovable, true, 'the Page cannot be removed');
  assert.ok(!Object.values(CARD_POOLS).flat().includes('unreadablePage'), 'the Page stays out of normal pools');

  const first = rollCardReward(run);
  assert.ok(!first.includes('unreadablePage'));
  const second = rollCardReward(run);
  assert.ok(second.includes('unreadablePage'));
  assert.ok(!rollCardReward(run).includes('unreadablePage'), 'offered once per run');
  assert.equal(run.quests.unreadablePage.state, 'revealed');
  assert.deepEqual(run.questScratch.unreadablePage, { rewardOrdinal: 3, offered: true });

  const page = addCardToDeck(run, 'unreadablePage');
  assert.equal(removeCardFromDeck(run, page.uid), false);
  assert.ok(run.player.deck.some((c) => c.uid === page.uid));
  assert.ok(!removableCards(run).some((c) => c.id === 'unreadablePage'));
  const ordinaryCard = removableCards(run)[0];
  assert.equal(removeCardFromDeck(run, ordinaryCard.uid), true, 'ordinary cards remain removable');
  assert.equal(removeCardFromDeck(run, ordinaryCard.uid), false, 'a missing card is not removed twice');

  const onlyPage = newRun(471, { quests: q });
  onlyPage.player.deck = [];
  addCardToDeck(onlyPage, 'unreadablePage');
  assert.deepEqual(removableCards(onlyPage), [], 'an all-Page deck has no impossible removal choice');

  run.act = 2;
  const cb = startCombat(run, ['sovereign'], 'boss');
  cb.enemies[0].hp = 1;
  forceHand(run, cb, ['strike']);
  cb.player.energy = 3;
  playCard(run, cb, cb.hand[0].uid, 0);
  assert.equal(run.quests.unreadablePage.progress, 1);
  assert.deepEqual(run.endQueue.filter((e) => e.t === 'pageRead'), [{
    t: 'pageRead', index: 1, text: QUESTS.unreadablePage.pages[0],
  }]);

  const twoPages = newRun(472, { quests: q });
  addCardToDeck(twoPages, 'unreadablePage');
  addCardToDeck(twoPages, 'unreadablePage');
  twoPages.act = 2;
  const twoPageBoss = startCombat(twoPages, ['sovereign'], 'boss');
  twoPageBoss.enemies[0].hp = 1;
  forceHand(twoPages, twoPageBoss, ['strike']);
  twoPageBoss.player.energy = 3;
  playCard(twoPages, twoPageBoss, twoPageBoss.hand[0].uid, 0);
  assert.equal(twoPages.quests.unreadablePage.progress, 1, 'one page-reading per winning run');
  assert.equal(twoPages.endQueue.filter((e) => e.t === 'pageRead').length, 1);

  const finalPageQ = structuredClone(q);
  finalPageQ.unreadablePage = { state: 'revealed', progress: 4, memory: {} };
  const finalPage = newRun(473, { quests: finalPageQ });
  addCardToDeck(finalPage, 'unreadablePage');
  finalPage.act = 2;
  const finalPageBoss = startCombat(finalPage, ['sovereign'], 'boss');
  finalPageBoss.enemies[0].hp = 1;
  forceHand(finalPage, finalPageBoss, ['strike']);
  finalPageBoss.player.energy = 3;
  playCard(finalPage, finalPageBoss, finalPageBoss.hand[0].uid, 0);
  assert.equal(finalPage.quests.unreadablePage.state, 'complete');
  const finalPageRead = finalPage.endQueue.find((e) => e.t === 'pageRead');
  assert.deepEqual(finalPageRead, { t: 'pageRead', index: 5, text: QUESTS.unreadablePage.pages[4] });
  journalTerminalOutcome(finalPage, 'win');
  assert.deepEqual(finalPage.pendingRunEnd, { outcome: 'win' });
  assert.deepEqual(finalPage.endQueue.find((e) => e.t === 'pageRead'), finalPageRead,
    'the exact authored reading remains in the terminal outbox');

  const ordinary = newRun(474, { quests: q });
  addCardToDeck(ordinary, 'unreadablePage');
  ordinary.act = 2;
  const ordinaryCombat = startCombat(ordinary, ['sporeling'], 'normal');
  ordinaryCombat.enemies[0].hp = 1;
  forceHand(ordinary, ordinaryCombat, ['strike']);
  ordinaryCombat.player.energy = 3;
  playCard(ordinary, ordinaryCombat, ordinaryCombat.hand[0].uid, 0);
  assert.equal(ordinary.quests.unreadablePage.progress, 0, 'ordinary victories do not read the Page');

  const midBoss = newRun(475, { quests: q });
  addCardToDeck(midBoss, 'unreadablePage');
  midBoss.act = 1;
  const midBossCombat = startCombat(midBoss, ['leviathan'], 'boss');
  midBossCombat.enemies[0].hp = 1;
  forceHand(midBoss, midBossCombat, ['strike']);
  midBossCombat.player.energy = 3;
  playCard(midBoss, midBossCombat, midBossCombat.hand[0].uid, 0);
  assert.equal(midBoss.quests.unreadablePage.progress, 0, 'mid-act boss victories do not read the Page');

  const finalReward = newRun(476, { quests: q });
  finalReward.act = 2;
  rollCardReward(finalReward);
  assert.ok(!rollCardReward(finalReward, 'boss').includes('unreadablePage'), 'the final boss has no Page reward');
  assert.deepEqual(finalReward.questScratch.unreadablePage, { rewardOrdinal: 1 },
    'a non-existent final reward does not advance the offer ordinal');
}
{
  const q = Object.fromEntries(QUEST_IDS.map((id) => [id, { state: id === 'paleOnes' ? 'armed' : 'dormant', progress: 0, memory: {} }]));
  const run = newRun(410, { quests: q, shards: ['paleOnes'] });
  q.paleOnes.state = 'complete';
  assert.equal(run.quests.paleOnes.state, 'armed', 'run owns a deep snapshot');
  assert.deepEqual(run.shards, ['paleOnes']);

  const events = [];
  assert.equal(revealQuest(run, 'paleOnes', events).state, 'revealed');
  assert.equal(events[0].t, 'questReveal');
  advanceQuest(run, 'paleOnes', 9, events);
  assert.equal(run.quests.paleOnes.state, 'complete');
  assert.deepEqual(run.questCompletions, ['paleOnes']);
  advanceQuest(run, 'paleOnes', 1, events);
  assert.deepEqual(run.questCompletions, ['paleOnes'], 'completion emitted once');

  setPendingEncounter(run, 'monster', ['paleDuskfang'], 'paleOnes');
  assert.deepEqual(run.pendingEnemyIds, ['paleDuskfang']);
  assert.equal(run.pendingQuestId, 'paleOnes');
  clearPendingEncounter(run);
  assert.equal(run.pendingCombat, null);
  assert.equal(run.pendingEnemyIds, null);
  assert.equal(run.pendingQuestId, null);
}
{
  const run = newRun(429);
  const cb = startCombat(run, ['paleDuskfang']);
  cb.enemies[0].hp = 1;
  forceHand(run, cb, ['strike']);
  cb.player.energy = 3;
  assert.doesNotThrow(
    () => playCard(run, cb, cb.hand[0].uid, 0),
    'a Pale variant drop is inert without an active quest snapshot',
  );
  assert.ok(!run.unlocks.includes('insight:witchlightLens'));
}
{
  const quests = Object.fromEntries(QUEST_IDS.map((id) => [id, { state: id === 'paleOnes' ? 'armed' : 'dormant', progress: 0, memory: {} }]));
  assert.deepEqual(
    [0, 1, 2].map(paleVariantForAct),
    ['paleDuskfang', 'paleDrownedOne', 'paleVoidWisp'],
    'each act maps to its fixed Pale variant',
  );
  const run = newRun(430, { quests, unlocks: [] });
  assert.deepEqual(EngineApi.questDisclosure(run, 'paleOnes'), {
    name: 'Hunt the Pale Ones',
    inscription: QUESTS.paleOnes.huntInscription,
    progress: 0,
    target: PROGRESSION.emberglass.paleOnes.lensAt,
  }, 'before the Lens, the Pale entry is a distinct 0/3 hunt');
  const first = rollEncounter(run, 'monster', 0, run.map.nodes.find((n) => n.row === 0));
  assert.deepEqual(first, ['paleDuskfang'], 'first ordinary fight is hidden guaranteed ambush');
  assert.notDeepEqual(rollEncounter(run, 'monster', 1), ['paleDuskfang'], 'only one hidden ambush per run');

  const cb = startCombat(run, ['paleDuskfang']);
  assert.equal(run.quests.paleOnes.state, 'revealed', 'Pale contact reveals the Trail before the kill');
  assert.equal(run.quests.paleOnes.progress, 0, 'contact alone does not award a mote');
  assert.ok(cb.queue.some((e) => e.t === 'questReveal' && e.id === 'paleOnes'));
  cb.enemies[0].hp = 1;
  forceHand(run, cb, ['strike']);
  cb.player.energy = 3;
  playCard(run, cb, cb.hand[0].uid, 0);
  assert.equal(run.quests.paleOnes.progress, 1);
  assert.equal(run.quests.paleOnes.state, 'revealed');
  assert.deepEqual(cb.queue.find((event) => event.t === 'questProgress'), {
    t: 'questProgress', id: 'paleOnes', progress: 1,
    target: PROGRESSION.emberglass.paleOnes.lensAt,
  }, 'the hidden hunt discloses Pale kills against the 3-kill Lens threshold');

  run.quests.paleOnes.progress = 2;
  const cb3 = startCombat(run, ['paleDuskfang']);
  cb3.enemies[0].hp = 1;
  forceHand(run, cb3, ['strike']);
  cb3.player.energy = 3;
  playCard(run, cb3, cb3.hand[0].uid, 0);
  assert.ok(run.unlocks.includes('insight:witchlightLens'));
  assert.deepEqual(cb3.queue.find((event) => event.t === 'questProgress'), {
    t: 'questProgress', id: 'paleOnes', progress: 3,
    target: PROGRESSION.emberglass.paleOnes.lensAt,
  }, 'the third hidden Pale closes the Hunt the Pale Ones disclosure');
  assert.deepEqual(EngineApi.questDisclosure(run, 'paleOnes'), {
    name: QUESTS.paleOnes.name,
    inscription: QUESTS.paleOnes.inscription,
    progress: 3,
    target: QUESTS.paleOnes.target,
  }, 'the Lens changes the same cumulative ledger into the 3/9 mote hunt');

  const cb4 = startCombat(run, ['paleDuskfang']);
  cb4.enemies[0].hp = 1;
  forceHand(run, cb4, ['strike']);
  cb4.player.energy = 3;
  playCard(run, cb4, cb4.hand[0].uid, 0);
  assert.deepEqual(cb4.queue.find((event) => event.t === 'questProgress'), {
    t: 'questProgress', id: 'paleOnes', progress: 4,
    target: QUESTS.paleOnes.target,
  }, 'after the Lens unlocks, Pale progress switches to the 9-mote total');

  const marked = newRun(431, { quests: run.quests, unlocks: run.unlocks });
  assert.equal(marked.map.nodes.filter((n) => n.questVariantId).length, 1);
  const mark = marked.map.nodes.find((n) => n.questVariantId);
  assert.equal(mark.row, 0);
  assert.equal(mark.questVariantId, 'paleDuskfang');
  assert.equal(mark.type, 'monster', 'a marked node keeps its base monster type');

  marked.questScratch.paleOnes.markedAct2 = true;
  marked.act = 1;
  marked.map = genMap(marked);
  const act1Marks = marked.map.nodes.filter((n) => n.questVariantId);
  assert.equal(act1Marks.length, 1, 'the locked Act 1 conditional adds one marked node');
  assert.equal(act1Marks[0].questVariantId, 'paleDrownedOne');
  assert.equal(act1Marks[0].type, 'monster');

  marked.questScratch.paleOnes.markedAct2 = false;
  marked.map = genMap(marked);
  assert.equal(marked.map.nodes.filter((n) => n.questVariantId).length, 0,
    'Act 1 has no marked node when its locked conditional is false');

  marked.questScratch.paleOnes.markedAct2 = true;
  marked.act = 2;
  marked.map = genMap(marked);
  assert.equal(marked.map.nodes.filter((n) => n.questVariantId).length, 0,
    'Act 2 never adds a marked Pale node');

  run.quests.paleOnes.progress = 8;
  const cb9 = startCombat(run, ['paleDuskfang']);
  cb9.enemies[0].hp = 1;
  forceHand(run, cb9, ['strike']);
  cb9.player.energy = 3;
  playCard(run, cb9, cb9.hand[0].uid, 0);
  assert.equal(run.quests.paleOnes.state, 'complete');
  assert.deepEqual(run.questCompletions, ['paleOnes']);
}
{
  const run = newRun(414);
  const rewards = {
    gold: 40,
    cards: ['strike', 'defend', 'chisel'],
    potion: 'healing',
    relic: 'ironTalisman',
  };
  setPendingReward(run, 'elite', rewards, true);
  assert.deepEqual(run.pendingReward, {
    kind: 'elite',
    rewards,
    taken: { gold: false, potion: false, relic: false, card: false },
    perfect: true,
  });
  assert.notStrictEqual(run.pendingReward.rewards, rewards, 'pending reward owns its payload');
  assert.notStrictEqual(run.pendingReward.rewards.cards, rewards.cards, 'pending reward owns its card list');

  const gold0 = run.player.gold;
  assert.equal(takePendingReward(run, 'gold'), true);
  assert.equal(takePendingReward(run, 'gold'), false, 'gold cannot be claimed twice');
  assert.equal(run.player.gold, gold0 + rewards.gold);

  assert.equal(takePendingReward(run, 'potion'), true);
  assert.equal(takePendingReward(run, 'potion'), false, 'potion cannot be claimed twice');
  assert.equal(run.player.potions.filter((id) => id === rewards.potion).length, 1);

  assert.equal(takePendingReward(run, 'relic'), true);
  assert.equal(takePendingReward(run, 'relic'), false, 'relic cannot be claimed twice');
  assert.equal(run.player.relics.filter((id) => id === rewards.relic).length, 1);

  const deck0 = run.player.deck.length;
  assert.equal(takePendingReward(run, 'card', 'strike'), true);
  assert.equal(takePendingReward(run, 'card', 'defend'), false, 'card choice is final');
  assert.equal(run.player.deck.length, deck0 + 1);

  const skipped = newRun(415);
  setPendingReward(skipped, 'monster', { gold: 1, cards: ['strike'], potion: null, relic: null });
  assert.equal(pendingRewardHasUntaken(skipped), true, 'fresh reward still has untaken rows');
  assert.equal(takePendingReward(skipped, 'card', null), true, 'skipping is a final card choice');
  assert.equal(takePendingReward(skipped, 'card', 'strike'), false, 'a skipped card cannot be reclaimed');
  assert.equal(pendingRewardHasUntaken(skipped), true, 'skipped card still leaves gold untaken');
  assert.equal(takePendingReward(skipped, 'gold'), true);
  assert.equal(pendingRewardHasUntaken(skipped), false, 'gold+card settle clears untaken');

  assert.equal(pendingRewardHasUntaken(run), false, 'fully claimed pending has nothing left');
  clearPendingReward(run);
  assert.equal(run.pendingReward, null);
  assert.equal(pendingRewardHasUntaken(run), false, 'cleared pending is not untaken');
}
{
  // vigil v2: fresh shape, and one-way migration from v1 that leaves v1 intact
  _setStore(null);
  const fresh = loadVigil();
  assert.equal(fresh.v, 2, 'fresh vigil is v2');
  assert.equal(fresh.runsPlayed, 0);
  assert.deepEqual(fresh.shards, []);
  assert.deepEqual(Object.keys(fresh.quests), QUEST_IDS);
  assert.ok(QUEST_IDS.every((id) => fresh.quests[id].state === 'dormant'));
  assert.equal(fresh.news, false);

  // a veteran v1 profile migrates: counters carry, news pulses once, v1 stays
  const mem = new Map([
    ['spirebound_vigil_v1', JSON.stringify({
      v: 1,
      deeds: { runs: 40, wins: 9, slain: 500, shatters: 90, kindles: 60, perfects: 12, smolderKills: 60, unlitVisited: 30, embersSpent: 900, bestVow: 5, bestFloor: 45 },
      unlocks: ['aspect2', 'card:quakeblow'], vowUnlocked: 5,
      lastFall: { act: 1, row: 7, bequest: { kind: 'gold', amount: 50 } },
    })],
  ]);
  _setStore({ getItem: (k) => (mem.has(k) ? mem.get(k) : null), setItem: (k, v) => mem.set(k, v), removeItem: (k) => mem.delete(k) });
  const mig = loadVigil();
  assert.equal(mig.v, 2);
  assert.equal(mig.runsPlayed, 40, 'runsPlayed seeded from v1 deeds.runs');
  assert.equal(mig.deeds.wins, 9);
  assert.ok(mig.unlocks.includes('card:quakeblow'), 'unlocks carried');
  assert.equal(mig.vowUnlocked, 5);
  assert.deepEqual(mig.lastFall, { act: 1, row: 7, bequest: { kind: 'gold', amount: 50 } });
  assert.equal(mig.news, true, 'veterans get one pulse at the new Vigil');
  assert.ok(mem.has('spirebound_vigil_v2'), 'v2 persisted');
  assert.ok(mem.has('spirebound_vigil_v1'), 'v1 backup untouched');
  assert.equal(loadVigil().runsPlayed, 40, 'migration idempotent (reads v2 now)');
  _setStore(null);
}
{
  // Hydration repairs are durable: a malformed-but-readable v2 ledger is
  // canonicalised once, then the next load is a read-only no-op.
  const malformed = {
    v: 2,
    deeds: { wins: 0 },
    unlocks: [],
    vowUnlocked: 0,
    lastFall: null,
    runsPlayed: 0,
    quests: {
      paleOnes: { state: 'waiting', progress: '3.8', memory: [] },
      ownShade: { state: 'revealed', progress: 999, memory: {}, extra: true },
      eighthOmen: { state: 'armed', progress: 0, memory: { dueIn: 999, seen: 'yes', extra: true } },
      hollowLamplighter: {
        state: 'revealed', progress: 0,
        memory: { eligibleMisses: '2.8', emberDebt: 999, extra: true },
      },
      unknown: { state: 'complete', progress: 1, memory: {} },
    },
    shards: ['paleOnes', 'unknown', 'paleOnes'],
    whispers: '4.9',
    news: false,
    receipts: { deeds: null, runEnd: null },
  };
  const mem = new Map([['spirebound_vigil_v2', JSON.stringify(malformed)]]);
  let writes = 0;
  _setStore({
    getItem: (key) => mem.get(key) ?? null,
    setItem: (key, value) => { writes++; mem.set(key, value); },
    removeItem: (key) => mem.delete(key),
  });
  const repaired = loadVigil();
  assert.equal(repaired.quests.paleOnes.state, 'dormant', 'invalid quest state is repaired');
  assert.equal(repaired.quests.paleOnes.progress, 0, 'a dormant repair cannot retain hidden progress');
  assert.deepEqual(repaired.quests.paleOnes.memory, {}, 'invalid quest memory is repaired');
  assert.equal(repaired.quests.ownShade.progress, QUESTS.ownShade.target - 1,
    'an incomplete state cannot acquire completion through malformed progress');
  assert.deepEqual(repaired.quests.eighthOmen.memory, {
    dueIn: PROGRESSION.emberglass.eighthOmen.guaranteeRuns,
  }, 'Eighth memory is canonicalised to the configured guarantee');
  assert.deepEqual(repaired.quests.hollowLamplighter.memory, {
    eligibleMisses: 2,
    emberDebt: PROGRESSION.emberglass.hollowLamplighter.emberDebt,
  }, 'Hollow memory is canonicalised to configured bounds');
  assert.deepEqual(Object.keys(repaired.quests), QUEST_IDS, 'missing and unknown quest records are repaired');
  assert.deepEqual(repaired.shards, ['paleOnes'], 'unknown and duplicate shards are removed');
  assert.equal(repaired.whispers, 4, 'whisper count is canonicalised');
  assert.equal(writes, 1, 'all repairs are persisted in one write');
  const durable = mem.get('spirebound_vigil_v2');
  assert.deepEqual(loadVigil(), repaired, 'the canonical ledger reloads identically');
  assert.equal(mem.get('spirebound_vigil_v2'), durable, 'the second load leaves canonical bytes untouched');
  assert.equal(writes, 1, 'the second load does not repeat a missed repair write');

  const stateInvalid = structuredClone(repaired);
  stateInvalid.quests.eighthOmen = {
    state: 'complete', progress: 0, memory: { dueIn: 1, seen: true },
  };
  stateInvalid.quests.hollowLamplighter = {
    state: 'dormant', progress: 4, memory: { eligibleMisses: 2, emberDebt: 3 },
  };
  mem.set('spirebound_vigil_v2', JSON.stringify(stateInvalid));
  const stateRepaired = loadVigil();
  assert.deepEqual(stateRepaired.quests.eighthOmen, {
    state: 'complete', progress: QUESTS.eighthOmen.target, memory: { seen: true },
  }, 'complete Eighth memory cannot retain a future guarantee');
  assert.deepEqual(stateRepaired.quests.hollowLamplighter, {
    state: 'dormant', progress: 0, memory: {},
  }, 'dormant Hollow memory cannot retain misses or an ember debt');

  const previousLocalStorage = globalThis.localStorage;
  const runStore = new Map();
  globalThis.localStorage = {
    getItem: (key) => runStore.get(key) ?? null,
    setItem: (key, value) => runStore.set(key, value),
    removeItem: (key) => runStore.delete(key),
  };
  const hydratedRun = newRun(400, { quests: questSnapshot(stateRepaired), shards: stateRepaired.shards });
  assert.equal(saveRun(hydratedRun), true);
  assert.ok(loadRun(), 'a hydrated Vigil snapshot passes the stricter run-save loader');
  const noDebtCombat = startCombat(hydratedRun, ['sporeling']);
  const embersBefore = noDebtCombat.embers;
  gainEmbers(hydratedRun, noDebtCombat, 3);
  assert.equal(noDebtCombat.embers, Math.min(noDebtCombat.emberCap, embersBefore + 3),
    'a dormant Hollow cannot confiscate ordinary combat embers');
  assert.ok(!noDebtCombat.queue.some((event) => event.t === 'hollowTithe'));
  if (previousLocalStorage) globalThis.localStorage = previousLocalStorage;
  else delete globalThis.localStorage;
  _setStore(null);
}
{
  _setStore({ getItem: () => null, setItem: () => { throw new Error('quota'); }, removeItem: () => {} });
  assert.equal(saveVigil({ v: 2 }), false, 'saveVigil reports a rejected write');
  _setStore(null);
}
{
  _setStore(null);
  _setRng(() => 0);
  let v = loadVigil();
  assert.deepEqual(Object.keys(v.quests), QUEST_IDS);
  assert.ok(QUEST_IDS.every((id) => v.quests[id].state === 'dormant'));

  v.deeds.wins = 1;
  saveVigil(v);
  v = loadVigil();
  assert.equal(v.quests.paleOnes.state, 'armed', 'Phase 1 v2 save hydrates Pale opener');
  assert.ok(QUEST_IDS.slice(1).every((id) => v.quests[id].state === 'dormant'));

  const won = newRun(401);
  won.quests = questSnapshot(v);
  commitRunToVigil(won, true); // deeds.wins is now 2
  let out = commitRunEnd(won, 'win');
  assert.equal(out.vigil.runsPlayed, 1);
  assert.equal(out.whisper, WHISPERS[0]);
  assert.deepEqual(out.armed, ['ownShade']);
  assert.equal(out.vigil.quests.ownShade.state, 'armed');
  assert.equal(out.vigil.whispers, 1);

  assert.deepEqual(commitRunEnd(won, 'win'), out, 'same run returns the cached result');

  const completed = newRun(402);
  completed.quests = questSnapshot(out.vigil);
  completed.quests.paleOnes = { state: 'complete', progress: 9, memory: {} };
  completed.questCompletions = ['paleOnes'];
  out = commitRunEnd(completed, 'death');
  assert.deepEqual(out.newShards, ['paleOnes']);
  assert.deepEqual(out.vigil.shards, ['paleOnes']);
  assert.equal(out.whisper, null, 'death does not consume a global whisper');

  const duplicate = newRun(403);
  duplicate.quests = questSnapshot(out.vigil);
  duplicate.questCompletions = ['paleOnes'];
  out = commitRunEnd(duplicate, 'abandon');
  assert.deepEqual(out.newShards, []);
  assert.deepEqual(out.vigil.shards, ['paleOnes']);

  assert.equal(whisperAt(1), WHISPERS[0]);
  assert.equal(whisperAt(999), WHISPERS.at(-1));

  _setStore(null);
  for (let win = 1; win <= 10; win++) {
    const before = loadVigil();
    const cadenceRun = newRun(4100 + win);
    cadenceRun.quests = questSnapshot(before);
    commitRunToVigil(cadenceRun, true);
    const cadence = commitRunEnd(cadenceRun, 'win').vigil;
    const expectedArmed = 1 + Math.floor(win / 2);
    assert.equal(QUEST_IDS.filter((id) => cadence.quests[id].state !== 'dormant').length,
      expectedArmed, 'one opener plus one quest per even win ' + win);
    if (win === 1) assert.equal(cadence.quests.ownShade.state, 'dormant');
  }
  assert.ok(QUEST_IDS.every((id) => loadVigil().quests[id].state !== 'dormant'),
    'all six quests are armed by win 10');

  const veteran = loadVigil();
  veteran.deeds.wins = 40;
  for (const id of QUEST_IDS.slice(1)) veteran.quests[id] = { state: 'dormant', progress: 0, memory: {} };
  saveVigil(veteran);
  const veteranWin = newRun(404);
  veteranWin.quests = questSnapshot(veteran);
  commitRunToVigil(veteranWin, true);
  out = commitRunEnd(veteranWin, 'win');
  assert.equal(out.armed.length, 1, 'post-Phase-1 veteran catches up one quest per future win');

  _setRng(null);
  _setStore(null);
}
{
  // A run end is committed only after the Vigil write becomes durable.
  _setStore(null);
  const initial = loadVigil();
  const persisted = new Map([['spirebound_vigil_v2', JSON.stringify(initial)]]);
  let rejectWrites = true;
  let acceptedWrites = 0;
  _setStore({
    getItem: (k) => (persisted.has(k) ? persisted.get(k) : null),
    setItem: (k, v) => {
      if (rejectWrites) throw new Error('quota');
      acceptedWrites++;
      persisted.set(k, v);
    },
    removeItem: (k) => persisted.delete(k),
  });

  const retryable = newRun(405);
  retryable.quests = questSnapshot(loadVigil());
  assert.throws(
    () => commitRunEnd(retryable, 'abandon'),
    /Vigil storage rejected the run end; retry when storage is available/,
  );
  assert.ok(!Object.hasOwn(retryable, 'runEndCommitted'), 'failed write leaves the run uncommitted');
  assert.ok(!Object.hasOwn(retryable, 'runEndResult'), 'failed write leaves no cached result');
  assert.equal(loadVigil().runsPlayed, 0, 'failed write does not advance durable state');
  assert.equal(acceptedWrites, 0);

  rejectWrites = false;
  const committed = commitRunEnd(retryable, 'abandon');
  assert.equal(committed.vigil.runsPlayed, 1);
  assert.equal(retryable.runEndCommitted, true);
  assert.equal(loadVigil().runsPlayed, 1, 'recovery retry persists exactly once');
  assert.equal(acceptedWrites, 1);
  assert.strictEqual(commitRunEnd(retryable, 'abandon'), committed, 'successful retry is then cached');
  assert.equal(loadVigil().runsPlayed, 1, 'cached repeat cannot double-commit');
  assert.equal(acceptedWrites, 1);

  _setStore(null);
}
{
  // Every journalled outcome treats legacy stats/save cleanup as the final gate.
  for (const outcome of ['win', 'death', 'abandon']) {
    _setStore(null);
    const run = newRun(421 + outcome.length);
    run.quests = questSnapshot(loadVigil());
    run.pendingRunEnd = { outcome };
    let cleanupCalls = 0;
    const rejected = commitPendingRunEnd(run, (_run, won) => {
      cleanupCalls++;
      assert.equal(won, outcome === 'win');
      return false;
    });
    assert.equal(rejected.accepted, false, `${outcome} waits for cleanup acknowledgement`);
    assert.equal(rejected.ledger.vigil.runsPlayed, 1);
    assert.equal(rejected.newUnlocks.length >= 0, true);
    assert.equal(loadVigil().deeds.runs, outcome === 'abandon' ? 0 : 1, `${outcome} preserves its existing deed semantics`);

    const accepted = commitPendingRunEnd(run, () => { cleanupCalls++; return true; });
    assert.equal(accepted.accepted, true, `${outcome} cleanup can be retried`);
    assert.equal(cleanupCalls, 2);
    assert.equal(loadVigil().runsPlayed, 1, `${outcome} retry cannot duplicate the run-end ledger`);
    assert.equal(loadVigil().deeds.runs, outcome === 'abandon' ? 0 : 1, `${outcome} retry cannot duplicate deeds`);
  }
  _setStore(null);
}
{
  // Run-id receipts make both Vigil stages exactly once across failure and reload.
  _setStore(null);
  _setRng(() => 0);
  const initial = loadVigil();
  initial.deeds.wins = 1;
  initial.quests.paleOnes.state = 'armed';
  const persisted = new Map([['spirebound_vigil_v2', JSON.stringify(initial)]]);
  let rejectWrites = false;
  let acceptedWrites = 0;
  _setStore({
    getItem: (k) => (persisted.has(k) ? persisted.get(k) : null),
    setItem: (k, v) => {
      if (rejectWrites) throw new Error('quota');
      acceptedWrites++;
      persisted.set(k, v);
    },
    removeItem: (k) => persisted.delete(k),
  });

  const run = newRun(406);
  run.quests = questSnapshot(loadVigil());
  run.quests.paleOnes.state = 'complete';
  run.quests.paleOnes.progress = QUESTS.paleOnes.target;
  run.questCompletions = ['paleOnes'];
  run.pendingRunEnd = { outcome: 'win' };
  const savedRun = JSON.stringify(run);

  rejectWrites = true;
  assert.throws(
    () => commitRunToVigil(run, true),
    /Vigil storage rejected the deed commit; retry when storage is available/,
  );
  assert.ok(!Object.hasOwn(run, 'vigilCommitted'), 'rejected deed write leaves no marker');
  assert.ok(!Object.hasOwn(run, 'vigilResult'), 'rejected deed write leaves no cache');
  assert.equal(loadVigil().deeds.wins, 1);
  assert.equal(acceptedWrites, 0);

  rejectWrites = false;
  const deeds = commitRunToVigil(run, true);
  assert.equal(deeds.vigil.deeds.wins, 2);
  assert.equal(loadVigil().receipts.deeds.runId, run.runId);
  assert.equal(acceptedWrites, 1);
  assert.throws(() => commitRunToVigil(run, false), /does not match durable deed receipt/, 'same-object deed retries preserve their semantic input');

  const afterDeedReload = JSON.parse(savedRun);
  const receiptDeeds = commitRunToVigil(afterDeedReload, true);
  assert.deepEqual(receiptDeeds.newUnlocks, deeds.newUnlocks);
  assert.equal(loadVigil().deeds.wins, 2, 'deed receipt prevents reload duplication');
  assert.equal(acceptedWrites, 1, 'fresh deed receipt lookup performs no write');

  rejectWrites = true;
  assert.throws(
    () => commitRunEnd(afterDeedReload, 'win'),
    /Vigil storage rejected the run end; retry when storage is available/,
  );
  assert.ok(!Object.hasOwn(afterDeedReload, 'runEndCommitted'));
  assert.ok(!Object.hasOwn(afterDeedReload, 'runEndResult'));
  assert.equal(loadVigil().runsPlayed, 0);
  assert.equal(loadVigil().whispers, 0);
  assert.equal(acceptedWrites, 1);

  rejectWrites = false;
  const finalReload = JSON.parse(savedRun);
  commitRunToVigil(finalReload, true);
  const ended = commitRunEnd(finalReload, 'win');
  assert.equal(ended.vigil.deeds.wins, 2);
  assert.equal(ended.vigil.runsPlayed, 1);
  assert.equal(ended.vigil.whispers, 1);
  assert.deepEqual(ended.completed, ['paleOnes'], 'the durable receipt records quest completion');
  assert.deepEqual(ended.newShards, ['paleOnes'], 'the durable receipt records the granted shard');
  assert.deepEqual(ended.armed, ['ownShade'], 'the win arms the next dormant quest');
  assert.equal(ended.vigil.quests.ownShade.state, 'armed');
  assert.equal(loadVigil().receipts.runEnd.runId, run.runId);
  assert.equal(acceptedWrites, 2, 'deeds and run end each require exactly one accepted write');
  assert.throws(() => commitRunEnd(finalReload, 'death'), /does not match durable receipt/, 'same-object end retries preserve their semantic input');

  const duplicateReload = JSON.parse(savedRun);
  assert.deepEqual(commitRunToVigil(duplicateReload, true).newUnlocks, deeds.newUnlocks);
  const duplicateEnd = commitRunEnd(duplicateReload, 'win');
  assert.equal(duplicateEnd.vigil.deeds.wins, 2);
  assert.equal(duplicateEnd.vigil.runsPlayed, 1);
  assert.equal(duplicateEnd.vigil.whispers, 1);
  assert.deepEqual(duplicateEnd.newShards, ['paleOnes']);
  assert.deepEqual(duplicateEnd.armed, ['ownShade']);
  assert.equal(loadVigil().deeds.wins, 2, 'fresh reload cannot duplicate deeds');
  assert.equal(loadVigil().runsPlayed, 1, 'fresh reload cannot duplicate run end');
  assert.equal(acceptedWrites, 2, 'third fresh retry performs zero additional writes');
  assert.throws(() => commitRunToVigil(JSON.parse(savedRun), false), /does not match durable deed receipt/);
  assert.throws(() => commitRunEnd(JSON.parse(savedRun), 'death'), /does not match durable receipt/);

  _setRng(null);
  _setStore(null);
}
{
  // the reveal ladder: counters only ever open doors
  _setStore(null);
  let v = loadVigil();
  assert.deepEqual(revealSnapshot(v), [], 'a fresh profile sees only the core game');
  assert.ok(!isRevealed(v, 'lamplighter') && !isRevealed(v, 'emberglass'));
  assert.ok(!isRevealed(v, 'nonsense'), 'unknown reveal ids are never revealed');

  // Begin Anew (abandon a saved climb) must advance the ladder — same ledger
  // path as confirmAbandon — so the next run's snapshot sees new reveals.
  const abandoned = newRun(300, { reveals: [] });
  v = commitRunEnd(abandoned, 'abandon').vigil;
  assert.equal(v.runsPlayed, 1, 'Begin Anew counts as a run end');
  assert.ok(isRevealed(v, 'lamplighter'), 'abandon unlocks Lamplighter for the next climb');
  const afterAbandon = newRun(3001, { reveals: revealSnapshot(v) });
  assert.ok(runRevealed(afterAbandon, 'lamplighter'), 'next run receives the post-abandon snapshot');
  _setStore(null);
  v = loadVigil();

  // run ends advance the ladder — win, fall, or abandon alike — exactly once
  const r1 = newRun(301);
  v = commitRunEnd(r1, 'abandon').vigil;
  assert.equal(v.runsPlayed, 1);
  assert.equal(commitRunEnd(r1, 'abandon').vigil.runsPlayed, 1, 'commitRunEnd idempotent per run');
  assert.ok(isRevealed(v, 'lamplighter'), 'run 2 gets the Lamplighter');
  assert.equal(v.news, true, 'crossing a reveal pulses the Vigil');
  assert.equal(clearNews().news, false, 'opening the Vigil clears the pulse');

  v = commitRunEnd(newRun(302), 'abandon').vigil;
  assert.ok(isRevealed(v, 'phials') && isRevealed(v, 'poolWave2'), 'runsPlayed 2 tier');
  v = commitRunEnd(newRun(303), 'abandon').vigil;
  assert.ok(isRevealed(v, 'omens'), 'runsPlayed 3 tier');
  commitRunEnd(newRun(304), 'abandon');
  v = commitRunEnd(newRun(305), 'abandon').vigil;
  assert.ok(isRevealed(v, 'poolWave3'), 'runsPlayed 4 tier (already crossed)');
  v = commitRunEnd(newRun(306), 'abandon').vigil;
  assert.ok(isRevealed(v, 'poolFull'), 'runsPlayed 6 tier');
  assert.ok(!isRevealed(v, 'emberglass'), 'wins-gated reveal still dark');

  // a win reveals the emberglass chain and marks news
  const wr = newRun(307);
  commitRunToVigil(wr, true);
  v = commitRunEnd(wr, 'win').vigil;
  assert.ok(isRevealed(v, 'emberglass'), 'first dawn arms the chain');
  assert.equal(v.news, true, 'unlocks pulse the Vigil too');
  _setStore(null);
}
{
  // run.reveals gating: null (default) = today's game; a snapshot narrows it
  const full = newRun(310);
  assert.equal(full.reveals, null, 'no opt = fully revealed');
  assert.ok(runRevealed(full, 'phials') && runRevealed(full, 'poolFull'));
  assert.deepEqual(cardPool(full, 'rare'), CARD_POOLS.rare, 'default pools unchanged');
  assert.deepEqual(relicPool(full, 'rare'), RELIC_POOLS.rare);
  assert.ok(OMENS[full.omens[0]], 'default runs climb under a sky');

  const core = newRun(311, { reveals: [] });
  assert.ok(!runRevealed(core, 'phials'));
  assert.ok(!cardPool(core, 'rare').includes('frenzy'), 'build-around rare held back');
  assert.ok(!cardPool(core, 'uncommon').includes('toxicMist'), 'wave-2 uncommon held back');
  assert.ok(cardPool(core, 'common').includes('twinFangs'), 'core commons present');
  assert.ok(!relicPool(core, 'rare').includes('duskmirror'), 'late relic held back');
  assert.deepEqual(relicPool(core, 'boss'), RELIC_POOLS.boss, 'boss crowns never gated');
  assert.equal(core.omens[0], null, 'run 1 climbs under a clear sky');
  assert.equal(gainPotion(core, 'healing'), false, 'phials hidden');
  for (let s = 0; s < 12; s++) {
    assert.equal(genCombatRewards(newRun(320 + s, { reveals: [] }), 'normal').potion, null, 'no potion drops pre-reveal');
  }
  const shopC = genShop(newRun(312, { reveals: [] }));
  assert.equal(shopC.potions.length, 0, 'merchant stocks no phials pre-reveal');

  const mid = newRun(313, { reveals: ['omens', 'phials', 'poolWave2'] });
  assert.ok(OMENS[mid.omens[0]], 'omen rolls once revealed');
  assert.equal(gainPotion(mid, 'healing'), true);
  assert.ok(cardPool(mid, 'rare').includes('devour'), 'wave 2 open');
  assert.ok(!cardPool(mid, 'rare').includes('frenzy'), 'later waves still closed');

  // deed unlocks pierce the waves
  const dl = newRun(314, { reveals: [], unlocks: ['card:quakeblow', 'relic:prismCharm'] });
  assert.ok(cardPool(dl, 'uncommon').includes('quakeblow'));
  assert.ok(relicPool(dl, 'rare').includes('prismCharm'));
}
{
  // every event with a phial-granting choice keeps a non-potion alternative,
  // so hiding phial choices pre-reveal never leaves an event unanswerable
  for (const [id, ev] of Object.entries(EVENTS)) {
    const nonPotion = ev.choices.filter((ch) => !ch.ops.some((op) => op.potion));
    assert.ok(nonPotion.length >= 1, `event ${id} needs a non-potion choice`);
  }
}
{
  // monuments: a bequest is claimed exactly once
  const run = newRun(45, { monument: { act: 0, row: 5, bequest: { kind: 'gold', amount: 60 } } });
  const g0 = run.player.gold;
  const b = claimMonument(run);
  assert.equal(b.kind, 'gold');
  assert.equal(run.player.gold, g0 + 60, 'gold bequest paid');
  assert.equal(claimMonument(run), null, 'stone gives only once');
  const run3 = newRun(45, { monument: { act: 1, row: 3, bequest: { kind: 'card', id: 'oblivionStrike', up: true } } });
  claimMonument(run3);
  const got = run3.player.deck.find((c) => c.id === 'oblivionStrike');
  assert.ok(got && got.up, 'card bequest arrives upgraded');
}
{
  // Your Own Shade: eligible deaths stand, their gift waits for victory, and
  // each fallen aspect returns through the three-stage duel.
  _setStore(null);
  const v = loadVigil();
  v.quests.ownShade.state = 'armed';
  saveVigil(v);

  const tooEarly = newRun(4390, { quests: questSnapshot(v) });
  assert.equal(markShadeFall(tooEarly, 0, 7), false, 'Act 1 index 0 cannot carve a standing Shade');
  assert.equal(tooEarly.questScratch.ownShade, undefined);
  const dormantQuests = questSnapshot(v);
  dormantQuests.ownShade.state = 'dormant';
  const dormantFall = newRun(4391, { quests: dormantQuests });
  assert.equal(markShadeFall(dormantFall, 1, 7), false, 'a dormant Shade quest cannot mark a fall');
  const completeQuests = questSnapshot(v);
  completeQuests.ownShade = { state: 'complete', progress: 3, memory: {} };
  const completeFall = newRun(4392, { quests: completeQuests });
  assert.equal(markShadeFall(completeFall, 1, 7), false, 'a completed Shade quest cannot mark another fall');

  const fallen = newRun(440, { aspect: 1, quests: questSnapshot(v) });
  fallen.act = 1;
  assert.equal(markShadeFall(fallen, 1, 7), true);
  let out = commitRunEnd(fallen, 'death');
  assert.deepEqual(out.vigil.lastFall, {
    act: 1, row: 7, bequest: null, standing: true, shadeAspect: 1,
  });

  setBequest(1, 7, { kind: 'gold', amount: 50 });
  assert.equal(loadVigil().lastFall.standing, true);
  assert.equal(loadVigil().lastFall.shadeAspect, 1);

  const tierIds = [];
  for (let stage = 0; stage < 3; stage++) {
    const tierQuests = questSnapshot(loadVigil());
    tierQuests.ownShade = { state: 'revealed', progress: stage, memory: {} };
    const tierRun = newRun(4400 + stage, {
      aspect: 0, quests: tierQuests, monument: loadVigil().lastFall,
    });
    const tierDuel = claimMonument(tierRun);
    const id = `ownShade${stage + 1}`;
    tierIds.push(tierDuel.variantId);
    assert.equal(tierDuel.variantId, id, `progress ${stage} selects Shade tier ${stage + 1}`);
    const resolved = resolveCombatant(tierRun, id);
    const mods = PROGRESSION.emberglass.ownShade.tiers[stage];
    assert.deepEqual(resolved.def.hp, [Math.round(110 * mods.hpMult), Math.round(110 * mods.hpMult)]);
    assert.equal(resolved.def.moves.ashbite.dmg, Math.round(SHADE_KITS.ashwarden.moves.ashbite.dmg * mods.dmgMult));
    assert.equal(resolved.def.startStatus.str || 0, mods.addStatuses.str || 0);
    assert.equal(resolved.presentation.scale, mods.scale);
  }
  assert.deepEqual(tierIds, ['ownShade1', 'ownShade2', 'ownShade3']);

  const next = newRun(441, { aspect: 0, quests: questSnapshot(loadVigil()), monument: loadVigil().lastFall });
  next.act = 1;
  next.map = genMap(next);
  const beforeDuelGold = next.player.gold;
  const duel = claimMonument(next);
  assert.equal(duel.kind, 'shadeDuel');
  assert.equal(duel.variantId, 'ownShade1');
  assert.equal(next.player.gold, beforeDuelGold, 'a standing stone does not pay before victory');
  const shade = resolveCombatant(next, duel.variantId);
  assert.equal(shade.presentation.artId, 'ashwarden', 'uses fallen aspect, not current aspect');

  for (let stage = 0; stage < 3; stage++) {
    next.quests.ownShade.state = 'revealed';
    next.quests.ownShade.progress = stage;
    const id = 'ownShade' + (stage + 1);
    const cb = startCombat(next, [id], 'monster');
    cb.enemies[0].hp = 1;
    forceHand(next, cb, ['strike']);
    cb.player.energy = 3;
    playCard(next, cb, cb.hand[0].uid, 0);
    assert.equal(next.quests.ownShade.progress, stage + 1);
    if (stage === 0) {
      assert.equal(next.player.gold, beforeDuelGold + 50, 'the won duel pays the held gift');
      assert.ok(cb.queue.some((e) => e.t === 'monumentGift' && e.bequest.amount === 50));
      assert.equal(next.questScratch.ownShade.pendingBequest, undefined, 'a paid gift cannot replay');
    }
  }
  assert.equal(next.quests.ownShade.state, 'complete');
  assert.equal(next.endQueue.filter((e) => e.t === 'shadeResolved' && e.text === QUESTS.ownShade.final).length, 1);

  const unpaid = { kind: 'gold', amount: 50 };
  const lostDuel = newRun(442, {
    aspect: 0, quests: questSnapshot(loadVigil()),
    monument: { act: 1, row: 7, bequest: unpaid, standing: true, shadeAspect: 1 },
  });
  lostDuel.act = 1;
  assert.equal(claimMonument(lostDuel).kind, 'shadeDuel');
  assert.equal(markShadeFall(lostDuel, 1, 7), true);
  out = commitRunEnd(lostDuel, 'death');
  assert.deepEqual(out.vigil.lastFall.bequest, unpaid, 'a lost duel preserves the unpaid gift');
  setBequest(1, 7, { kind: 'gold', amount: 99 });
  assert.deepEqual(loadVigil().lastFall.bequest, unpaid, 'later defeat selection cannot overwrite the unpaid gift');

  const claimedNormal = newRun(443, {
    aspect: 0, quests: questSnapshot(loadVigil()),
    monument: { act: 1, row: 6, bequest: { kind: 'gold', amount: 40 }, standing: false },
  });
  const beforeGold = claimedNormal.player.gold;
  assert.equal(claimMonument(claimedNormal).kind, 'gold');
  assert.equal(claimedNormal.player.gold, beforeGold + 40);
  assert.equal(markShadeFall(claimedNormal, 1, 8), true);
  out = commitRunEnd(claimedNormal, 'death');
  assert.equal(out.vigil.lastFall.bequest, null, 'an already-paid normal monument is not duplicated');

  const directGift = newRun(444);
  const giftQueue = [];
  const giftGold = directGift.player.gold;
  grantBequest(directGift, { kind: 'gold', amount: 12 }, giftQueue);
  assert.equal(directGift.player.gold, giftGold + 12);
  assert.deepEqual(giftQueue, [{ t: 'monumentGift', bequest: { kind: 'gold', amount: 12 } }]);
  _setStore(null);
}
{
  // A rejected post-victory checkpoint reloads the accepted pending duel. The
  // replay pays the held gift once; the unsaved in-memory victory is discarded.
  const previousLocalStorage = globalThis.localStorage;
  const persisted = new Map();
  let rejectWrites = false;
  try {
    globalThis.localStorage = {
      getItem: (key) => persisted.get(key) ?? null,
      setItem: (key, value) => {
        if (rejectWrites) throw new Error('quota');
        persisted.set(key, value);
      },
      removeItem: (key) => persisted.delete(key),
    };
    const quests = Object.fromEntries(QUEST_IDS.map((id) => [id, {
      state: id === 'ownShade' ? 'revealed' : 'dormant', progress: 0, memory: {},
    }]));
    const run = newRun(445, {
      quests,
      monument: { act: 1, row: 7, bequest: { kind: 'gold', amount: 50 }, standing: true, shadeAspect: 1 },
    });
    const startGold = run.player.gold;
    const duel = claimMonument(run);
    setPendingEncounter(run, 'monster', [duel.variantId], 'ownShade');
    assert.equal(saveRun(run), true, 'the pending duel is the durable pre-combat checkpoint');

    const winShade = (candidate) => {
      const cb = startCombat(candidate, candidate.pendingEnemyIds, candidate.pendingCombat);
      cb.enemies[0].hp = 1;
      forceHand(candidate, cb, ['strike']);
      cb.player.energy = 3;
      playCard(candidate, cb, cb.hand[0].uid, 0);
      assert.equal(cb.result, 'win');
    };

    const rejectedVictory = loadRun();
    winShade(rejectedVictory);
    assert.equal(rejectedVictory.player.gold, startGold + 50);
    assert.equal(shadeVictorySkipsRewards(rejectedVictory), true, 'the ownShade checkpoint bypasses ordinary rewards');
    clearPendingEncounter(rejectedVictory);
    rejectWrites = true;
    assert.equal(saveRun(rejectedVictory), false, 'the post-victory checkpoint reports quota rejection');

    rejectWrites = false;
    const replay = loadRun();
    assert.equal(replay.player.gold, startGold, 'reload discards the uncheckpointed gift');
    assert.equal(replay.quests.ownShade.progress, 0);
    assert.equal(replay.pendingQuestId, 'ownShade');
    assert.deepEqual(replay.questScratch.ownShade.pendingBequest, { kind: 'gold', amount: 50 });
    winShade(replay);
    clearPendingEncounter(replay);
    assert.equal(saveRun(replay), true);

    const settled = loadRun();
    assert.equal(settled.player.gold, startGold + 50, 'the replayed victory pays exactly once');
    assert.equal(settled.quests.ownShade.progress, 1);
    assert.equal(settled.pendingCombat, null);
    assert.equal(settled.questScratch.ownShade.pendingBequest, undefined);
    assert.equal(claimMonument(settled), null, 'the claimed stone cannot replay after the accepted victory');
  } finally {
    if (previousLocalStorage) globalThis.localStorage = previousLocalStorage;
    else delete globalThis.localStorage;
  }
}
{
  // A rejected Shade-loss run-end receipt leaves no partial standing gift. A
  // fresh-object retry persists it once and the receipt makes later retries inert.
  _setStore(null);
  const initial = loadVigil();
  initial.quests.ownShade = { state: 'revealed', progress: 0, memory: {} };
  const persisted = new Map([['spirebound_vigil_v2', JSON.stringify(initial)]]);
  let rejectWrites = true;
  let acceptedWrites = 0;
  _setStore({
    getItem: (key) => persisted.get(key) ?? null,
    setItem: (key, value) => {
      if (rejectWrites) throw new Error('quota');
      acceptedWrites++;
      persisted.set(key, value);
    },
    removeItem: (key) => persisted.delete(key),
  });
  const unpaid = { kind: 'gold', amount: 50 };
  const lost = newRun(446, {
    quests: questSnapshot(loadVigil()),
    monument: { act: 1, row: 7, bequest: unpaid, standing: true, shadeAspect: 1 },
  });
  lost.act = 1;
  claimMonument(lost);
  assert.equal(markShadeFall(lost, 1, 8), true);
  const savedLoss = JSON.stringify(lost);
  assert.throws(() => commitRunEnd(lost, 'death'), /Vigil storage rejected the run end/);
  assert.equal(loadVigil().lastFall, null, 'a rejected receipt writes no partial standing monument');
  assert.equal(acceptedWrites, 0);

  rejectWrites = false;
  const accepted = commitRunEnd(JSON.parse(savedLoss), 'death');
  assert.deepEqual(accepted.vigil.lastFall, {
    act: 1, row: 8, bequest: unpaid, standing: true, shadeAspect: 0,
  });
  assert.equal(acceptedWrites, 1, 'fall and receipt share one accepted write');
  const retry = commitRunEnd(JSON.parse(savedLoss), 'death');
  assert.deepEqual(retry.vigil.lastFall.bequest, unpaid);
  assert.equal(acceptedWrites, 1, 'fresh-object receipt retry cannot duplicate the standing gift');
  _setStore(null);
}
{
  // bequestOptions offers the best of what was carried
  const run = newRun(46);
  gainRelic(run, 'duskmirror');
  gainRelic(run, 'basaltIdol');
  addCardToDeck(run, 'oblivionStrike', true);
  const opts = bequestOptions(run);
  assert.ok(opts.find((o) => o.kind === 'relic' && o.id === 'duskmirror'), 'rarest relic offered');
  assert.ok(opts.find((o) => o.kind === 'card' && o.id === 'oblivionStrike'), 'best card offered');
  assert.ok(opts.find((o) => o.kind === 'gold'), 'gold cache offered');
}
{
  // visitNode pays unlit bounties exactly once
  const run = newRun(47);
  const node = run.map.nodes.find((n) => n.row === 0);
  node.unlit = true;
  node.bounty = 20;
  const g0 = run.player.gold;
  const { type, bounty } = visitNode(run, node);
  assert.equal(type, node.type, 'true face revealed');
  assert.equal(bounty, 20);
  assert.equal(run.player.gold, g0 + 20, 'bounty paid');
  assert.equal(run.stats.unlitVisited, 1, 'deed counted');
  assert.equal(visitNode(run, node).bounty, 0, 'a lit lantern pays nothing');
}
{
  // aspects: the Ashwarden is a distinct kit
  assert.equal(ASPECTS.length, 2, 'two aspects');
  assert.equal(ASPECTS[0].id, 'duskblade');
  assert.equal(ASPECTS[1].id, 'ashwarden');
  const ash = newRun(50, { aspect: 1 });
  assert.equal(ash.player.maxHp, 80, 'Ashwarden is tankier');
  assert.equal(ash.player.hp, 80);
  assert.ok(ash.player.relics.includes('ashenCore'), 'Ashwarden starts with the Ashen Core');
  assert.equal(ash.art, 'ashfall', 'Ashwarden favors Ashfall');
  assert.equal(ash.player.deck.length, 10, 'Ashwarden deck is 10');
  assert.ok(ash.player.deck.some((c) => c.id === 'ashBite'), 'Ashwarden brings Ashbite');
  assert.ok(RELICS.ashenCore, 'Ashen Core relic exists');
  // ashenCore steeps every enemy in Smolder at the bell
  const acb = startCombat(ash, ['sporeling', 'sporeling']);
  for (const e of acb.enemies) assert.ok(e.statuses.poison >= 3, 'Ashen Core smolders the field');
  // an out-of-range aspect index is clamped, never a crash
  assert.equal(newRun(50, { aspect: 9 }).aspect, ASPECTS.length - 1, 'aspect clamped');
}
{
  // vows: the difficulty ladder stacks cumulatively
  assert.equal(VOWS.length, 5, 'five vows');
  assert.equal(vowMods({ vow: 0 }).hpMult, 1, 'no vow, no burden');
  assert.ok(Math.abs(vowMods({ vow: 1 }).hpMult - 1.12) < 1e-9, 'Vow I hardens the glass');
  assert.equal(vowMods({ vow: 2 }).enemyDmgBonus, 1, 'Vow II sharpens their blows');
  assert.equal(vowMods({ vow: 3 }).bossFacetDelta, 1, 'Vow III armors the boss');
  assert.equal(vowMods({ vow: 4 }).startHex, true, 'Vow IV marks the climber');
  assert.equal(vowMods({ vow: 5 }).restHealFrac, 0.2, 'Vow V wanes the rest');
  assert.equal(vowMods({ vow: 9 }).startHex, true, 'vow level clamps to the ladder');
  // Vow II adds exactly +1 to what an enemy hits for (mirrored in the intent preview)
  const base = newRun(51), hard = newRun(51, { vow: 2 });
  const eb = startCombat(base, ['sporeling']), eh = startCombat(hard, ['sporeling']);
  const db = previewEnemyDmg(base, eb, eb.enemies[0]), dh = previewEnemyDmg(hard, eh, eh.enemies[0]);
  if (db) assert.equal(dh.dmg, db.dmg + 1, 'Vow II preview shows +1 damage');
  // Vow III thickens the boss facet gauge by one
  const bb = newRun(52), bh = newRun(52, { vow: 3 });
  const cbb = startCombat(bb, ['rootheart'], 'boss'), cbh = startCombat(bh, ['rootheart'], 'boss');
  assert.equal(cbh.enemies[0].facetMax, cbb.enemies[0].facetMax + 1, 'Vow III boss holds one more facet');
  // Vow IV seeds a Hex into the starting deck
  const marked = newRun(53, { vow: 4 });
  assert.equal(marked.player.deck.length, 11, 'the marked climb one card heavier');
  assert.ok(marked.player.deck.some((c) => c.id === 'hex'), 'and it is a Hex');
  // Vow V drains the campfire
  assert.ok(restHealFrac(newRun(54, { vow: 5 })) <= 0.2, 'Vow V rest heals no more than a fifth');
}
{
  // boons: every Lamplighter gift resolves cleanly through the event-op executor
  for (const [id, boon] of Object.entries(BOONS)) {
    const run = newRun(55);
    assert.doesNotThrow(() => applyEventOps(run, boon.ops), `boon ${id} applies`);
  }
  const purse = newRun(55);
  const g0 = purse.player.gold;
  applyEventOps(purse, BOONS.fullPurse.ops);
  assert.equal(purse.player.gold, g0 + 120, 'A Full Purse pays out');
  const glass = newRun(55);
  const hp0 = glass.player.maxHp;
  applyEventOps(glass, BOONS.temperedGlass.ops);
  assert.equal(glass.player.maxHp, hp0 + 14, 'Tempered Glass raises Max HP');
}
{
  const pityMisses = PROGRESSION.emberglass.hollowLamplighter.pityEligibleRuns - 1;
  const q = Object.fromEntries(QUEST_IDS.map((id) => [id, {
    state: id === 'hollowLamplighter' ? 'armed' : 'dormant', progress: 0,
    memory: id === 'hollowLamplighter' ? { eligibleMisses: pityMisses } : {},
  }]));
  const run = newRun(480, { quests: q, lamplighter: true });
  assert.equal(run.questScratch.hollowLamplighter.due, true, 'configured pity forces the eligible run');

  const unlit = run.map.nodes.find((n) => n.unlit);
  assert.ok(unlit, 'scenario has an unlit node');
  const visit = visitNode(run, unlit);
  assert.equal(visit.hollow, true);
  assert.ok(run.pendingHollow);
  assert.equal(run.quests.hollowLamplighter.state, 'revealed');

  let pay = payHollowPrice(run);
  assert.deepEqual(pay, { ok: true, deferred: true, message: QUESTS.hollowLamplighter.meetings[0].accepted });
  assert.equal(run.quests.hollowLamplighter.memory.emberDebt, 3);
  assert.deepEqual(payHollowPrice(run), pay, 'the same meeting is idempotent');

  const cb = startCombat(run, ['sporeling']);
  gainEmbers(run, cb, 2);
  assert.equal(cb.embers, 0);
  gainEmbers(run, cb, 1);
  assert.equal(run.quests.hollowLamplighter.progress, 1);

  const openMeeting = (seed, previous) => {
    const quests = Object.fromEntries(QUEST_IDS.map((id) => [id, {
      state: id === 'hollowLamplighter' ? previous.state : 'dormant',
      progress: id === 'hollowLamplighter' ? previous.progress : 0,
      memory: id === 'hollowLamplighter'
        ? { ...previous.memory, eligibleMisses: pityMisses } : {},
    }]));
    const next = newRun(seed, { quests });
    const node = next.map.nodes.find((n) => n.unlit);
    assert.ok(node);
    assert.equal(visitNode(next, node).hollow, true);
    return next;
  };

  const goldRun = openMeeting(481, run.quests.hollowLamplighter);
  goldRun.player.gold = 160;
  pay = payHollowPrice(goldRun);
  assert.equal(pay.ok, true);
  assert.equal(goldRun.player.gold, 0);
  assert.deepEqual(payHollowPrice(goldRun), pay);

  const hpRun = openMeeting(482, goldRun.quests.hollowLamplighter);
  hpRun.player.maxHp = 42;
  hpRun.player.hp = 42;
  pay = payHollowPrice(hpRun);
  assert.equal(pay.ok, true);
  assert.equal(hpRun.player.maxHp, 30);
  assert.deepEqual(payHollowPrice(hpRun), pay);

  const boonRun = openMeeting(483, hpRun.quests.hollowLamplighter);
  applyBoon(boonRun, 'temperedGlass');
  pay = payHollowPrice(boonRun);
  assert.equal(pay.ok, true);
  assert.equal(boonRun.boon, null);
  assert.deepEqual(payHollowPrice(boonRun), pay);

  const finalRun = openMeeting(484, boonRun.quests.hollowLamplighter);
  finalRun.player.hp = 40;
  pay = payHollowPrice(finalRun);
  assert.equal(pay.ok, true);
  assert.equal(finalRun.player.hp, 1);
  assert.equal(finalRun.quests.hollowLamplighter.state, 'complete');
  assert.deepEqual(payHollowPrice(finalRun), pay);

  for (const [i, id] of Object.keys(BOONS).entries()) {
    const bq = Object.fromEntries(QUEST_IDS.map((qid) => [qid, {
      state: qid === 'hollowLamplighter' ? 'revealed' : 'dormant',
      progress: qid === 'hollowLamplighter' ? 3 : 0, memory: {},
    }]));
    const br = newRun(490 + i, { quests: bq });
    br.pendingHollow = {
      nodeId: br.map.nodes[0].id, type: br.map.nodes[0].type,
      paid: false, deferred: false, answer: null,
    };
    const before = structuredClone({
      hp: br.player.hp, maxHp: br.player.maxHp, energyMax: br.player.energyMax,
      gold: br.player.gold, relics: br.player.relics, potions: br.player.potions,
      goldEarned: br.stats.goldEarned,
    });
    applyBoon(br, id);
    assert.equal(payHollowPrice(br).ok, true, id + ' can be surrendered');
    assert.deepEqual({
      hp: br.player.hp, maxHp: br.player.maxHp, energyMax: br.player.energyMax,
      gold: br.player.gold, relics: br.player.relics, potions: br.player.potions,
      goldEarned: br.stats.goldEarned,
    }, before, id + ' reverses every recorded delta');
  }

  const crown = newRun(499, { quests: q });
  const crownBefore = {
    hp: crown.player.hp, maxHp: crown.player.maxHp,
    energyMax: crown.player.energyMax, relics: [...crown.player.relics],
  };
  gainRelic(crown, 'hollowCrown');
  crown.boon = 'keenEye';
  crown.boonReceipt = {
    id: 'keenEye',
    playerDelta: { gold: 0, hp: crown.player.hp - crownBefore.hp,
      maxHp: crown.player.maxHp - crownBefore.maxHp,
      energyMax: crown.player.energyMax - crownBefore.energyMax },
    statsGoldEarned: 0,
    relicsAdded: ['hollowCrown'], potionSlotsAdded: [],
  };
  assert.equal(reverseBoon(crown), true);
  assert.deepEqual({
    hp: crown.player.hp, maxHp: crown.player.maxHp,
    energyMax: crown.player.energyMax, relics: crown.player.relics,
  }, crownBefore, 'instant relic max-HP and energy effects reverse');

  _setStore(null);
  const debtVigil = loadVigil();
  debtVigil.quests.hollowLamplighter = {
    state: 'armed', progress: 0, memory: { eligibleMisses: pityMisses },
  };
  saveVigil(debtVigil);
  const debtRun = newRun(520, { quests: questSnapshot(debtVigil) });
  const debtNode = debtRun.map.nodes.find((n) => n.unlit);
  assert.ok(debtNode);
  visitNode(debtRun, debtNode);
  assert.equal(payHollowPrice(debtRun).deferred, true);
  const debtCombat = startCombat(debtRun, ['sporeling']);
  gainEmbers(debtRun, debtCombat, 2);
  let debtOut = commitRunEnd(debtRun, 'death');
  assert.equal(debtOut.vigil.quests.hollowLamplighter.memory.emberDebt, 1);

  const carry = newRun(521, { quests: questSnapshot(debtOut.vigil) });
  assert.deepEqual(carry.questScratch.hollowLamplighter,
    { due: false, met: false, meetings: 0, debtActive: true });
  const carryCombat = startCombat(carry, ['sporeling']);
  gainEmbers(carry, carryCombat, 1);
  assert.equal(carry.quests.hollowLamplighter.progress, 1);
  debtOut = commitRunEnd(carry, 'abandon');
  assert.equal('emberDebt' in debtOut.vigil.quests.hollowLamplighter.memory, false,
    'cleared debt stays deleted after the authoritative merge');
  assert.equal('emberDebt' in loadVigil().quests.hollowLamplighter.memory, false,
    'cleared debt is absent from the stored authoritative Vigil');
  _setStore(null);
}
{
  const makeHollowMeeting = (seed, progress, type) => {
    const quests = Object.fromEntries(QUEST_IDS.map((id) => [id, {
      state: id === 'hollowLamplighter' ? 'revealed' : 'dormant',
      progress: id === 'hollowLamplighter' ? progress : 0,
      memory: {},
    }]));
    const run = newRun(seed, { quests });
    const node = run.map.nodes[0];
    node.type = type;
    run.nodeId = node.id;
    run.map.visited.push(node.id);
    run.questScratch.hollowLamplighter = { due: true, met: true, debtActive: false };
    run.pendingHollow = {
      nodeId: node.id, type, paid: false, deferred: false, answer: null,
    };
    return { run, node };
  };

  const failures = [
    {
      label: 'insufficient gold', progress: 1, type: 'event',
      prepare: (run) => { run.player.gold = PROGRESSION.emberglass.hollowLamplighter.gold - 1; },
    },
    {
      label: 'insufficient Max HP', progress: 2, type: 'rest',
      prepare: (run) => { run.player.maxHp = 41; run.player.hp = 41; },
    },
    {
      label: 'spent boon', progress: 3, type: 'shop',
      prepare: (run) => { applyBoon(run, 'fullPurse'); run.player.gold = 0; },
    },
  ];
  const previousLocalStorage = globalThis.localStorage;
  const hollowSaveStore = new Map();
  globalThis.localStorage = {
    getItem: (key) => hollowSaveStore.get(key) ?? null,
    setItem: (key, value) => { hollowSaveStore.set(key, value); },
    removeItem: (key) => { hollowSaveStore.delete(key); },
  };
  for (const [i, spec] of failures.entries()) {
    const { run, node } = makeHollowMeeting(530 + i, spec.progress, spec.type);
    spec.prepare(run);
    const before = structuredClone({
      progress: run.quests.hollowLamplighter.progress,
      gold: run.player.gold, hp: run.player.hp, maxHp: run.player.maxHp,
      boon: run.boon, boonReceipt: run.boonReceipt,
    });
    assert.equal(payHollowPrice(run).ok, false, spec.label + ' cannot pay');
    const route = stageHollowExit(run);
    assert.deepEqual({ kind: route.kind, nodeId: route.nodeId, type: route.type },
      { kind: 'destination', nodeId: node.id, type: spec.type }, spec.label + ' can return later');
    assert.equal(run.pendingHollow, null);
    assert.deepEqual(run.pendingHollowRoute, {
      nodeId: node.id, type: spec.type,
      eventId: spec.type === 'event' ? route.eventId : null,
    });
    if (spec.type === 'event') assert.ok(Object.hasOwn(EVENTS, route.eventId));
    assert.deepEqual({
      progress: run.quests.hollowLamplighter.progress,
      gold: run.player.gold, hp: run.player.hp, maxHp: run.player.maxHp,
      boon: run.boon, boonReceipt: run.boonReceipt,
    }, before, spec.label + ' leave does not charge or advance');
    assert.equal(saveRun(run), true, spec.label + ' Return Later transaction saves');
    const reloaded = loadRun();
    assert.ok(reloaded, spec.label + ' Return Later transaction reloads');
    assert.deepEqual(reloaded.pendingHollowRoute, run.pendingHollowRoute,
      spec.label + ' reload retains the exact destination');
    assert.equal(reloaded.questScratch.hollowLamplighter.met, true,
      spec.label + ' reload retains the one-meeting-per-run latch');
    assert.deepEqual({
      progress: reloaded.quests.hollowLamplighter.progress,
      gold: reloaded.player.gold, hp: reloaded.player.hp, maxHp: reloaded.player.maxHp,
      boon: reloaded.boon, boonReceipt: reloaded.boonReceipt,
    }, before, spec.label + ' reload retains no payment or progress');
    const laterQuests = structuredClone(reloaded.quests);
    laterQuests.hollowLamplighter.memory.eligibleMisses =
      PROGRESSION.emberglass.hollowLamplighter.pityEligibleRuns - 1;
    const later = newRun(540 + i, { quests: laterQuests });
    assert.equal(later.questScratch.hollowLamplighter.due, true,
      spec.label + ' remains eligible for the same price in a later run');
    assert.equal(later.quests.hollowLamplighter.progress, before.progress,
      spec.label + ' later eligibility does not imply payment');
    assert.equal(run.questScratch.hollowLamplighter.met, true,
      spec.label + ' leave keeps the one-meeting-per-run latch');
  }
  if (previousLocalStorage) globalThis.localStorage = previousLocalStorage;
  else delete globalThis.localStorage;

  const combatMeeting = makeHollowMeeting(533, 2, 'monster');
  combatMeeting.run.pendingHollow.paid = true;
  combatMeeting.run.pendingHollow.answer = QUESTS.hollowLamplighter.meetings[1].paid;
  const combatRoute = stageHollowExit(combatMeeting.run);
  assert.equal(combatRoute.kind, 'combat');
  assert.deepEqual(combatRoute.enemyIds, combatMeeting.run.pendingEnemyIds);
  assert.equal(combatMeeting.run.pendingHollow, null);
  assert.equal(combatMeeting.run.pendingHollowRoute, null);
  assert.equal(combatMeeting.run.pendingCombat, 'monster');
  assert.ok(combatMeeting.run.pendingEnemyIds.length > 0, 'combat route journals exact enemies before save');

  _setStore(null);
  const vigil = loadVigil();
  vigil.quests.hollowLamplighter = { state: 'revealed', progress: 1, memory: {} };
  saveVigil(vigil);
  const left = makeHollowMeeting(534, 1, 'rest').run;
  left.quests = questSnapshot(vigil);
  left.questScratch.hollowLamplighter = { due: true, met: true, debtActive: false };
  stageHollowExit(left);
  left.pendingHollowRoute = null;
  let out = commitRunEnd(left, 'death');
  assert.equal(out.vigil.quests.hollowLamplighter.memory.eligibleMisses, 0,
    'returning later ends only this run meeting');
  const pityRuns = PROGRESSION.emberglass.hollowLamplighter.pityEligibleRuns;
  for (let misses = 1; misses < pityRuns; misses++) {
    const laterEligible = newRun(534 + misses, { quests: questSnapshot(out.vigil) });
    assert.ok(laterEligible.questScratch.hollowLamplighter,
      'an unpaid price remains eligible in a later run');
    laterEligible.questScratch.hollowLamplighter = { due: false, met: false, debtActive: false };
    out = commitRunEnd(laterEligible, 'death');
    assert.equal(out.vigil.quests.hollowLamplighter.memory.eligibleMisses, misses);
  }
  const pityRetry = newRun(535 + pityRuns, { quests: questSnapshot(out.vigil) });
  assert.equal(pityRetry.questScratch.hollowLamplighter.due, true,
    'an unpaid price returns under the normal pity guarantee');
  _setStore(null);
}
{
  // monuments in the map: the last fall stands in its own act, nowhere else
  const run = newRun(56, { monument: { act: 0, row: 6, bequest: { kind: 'gold', amount: 60 } } });
  const mons = run.map.nodes.filter((n) => n.type === 'monument');
  assert.equal(mons.length, 1, 'exactly one monument node');
  const m = mons[0];
  assert.ok(m.row > 0 && m.row < MAP_ROWS - 2 && m.row !== 8, 'monument on a lawful row');
  assert.ok(!m.unlit, 'a monument is never hidden');
  // a monument bound to a later act does not litter this one
  const early = newRun(56, { monument: { act: 2, row: 5, bequest: { kind: 'gold', amount: 60 } } });
  assert.equal(early.map.nodes.filter((n) => n.type === 'monument').length, 0, 'act-2 monument absent on act 0');
  // and the bequest→setBequest→next-run→claim loop pays exactly once
  _setStore(null);
  const fallen = newRun(56);
  fallen.player.gold = 50;
  const offer = bequestOptions(fallen).find((o) => o.kind === 'gold');
  setBequest(0, 6, offer);
  const next = newRun(57, { monument: loadVigil().lastFall });
  const g0 = next.player.gold;
  const claimed = claimMonument(next);
  assert.equal(claimed.kind, 'gold', 'gold recovered from the stone');
  assert.equal(next.player.gold, g0 + offer.amount, 'the exact cache returns');
  assert.equal(claimMonument(next), null, 'the stone gives once');
  clearBequest();
  _setStore(null);
}
{
  // pile ceremony queue payloads: discardHand uids, reshuffle n, toDiscard uid
  const { run, cb } = freshCombat();
  forceHand(run, cb, ['defend', 'strike', 'defend']);
  const H = cb.hand.length;
  const handUids = cb.hand.map((c) => c.uid);
  cb.queue.length = 0;
  endTurn(run, cb);
  const dh = cb.queue.filter((e) => e.t === 'discardHand');
  assert.equal(dh.length, 1, 'one discardHand event');
  assert.equal(dh[0].uids.length, H, 'discardHand carries hand size');
  assert.deepEqual(dh[0].uids, handUids, 'discardHand uids match pre-clear hand');

  const { run: r2, cb: c2 } = freshCombat();
  c2.draw = [];
  c2.discard = [makeCard(r2, 'strike'), makeCard(r2, 'defend'), makeCard(r2, 'strike')];
  const nDiscard = c2.discard.length;
  c2.queue.length = 0;
  drawCards(r2, c2, 1);
  const rs = c2.queue.find((e) => e.t === 'reshuffle');
  assert.ok(rs && Number.isInteger(rs.n) && rs.n > 0, 'reshuffle carries n');
  assert.equal(rs.n, nDiscard, 'reshuffle n is pre-move discard size');

  const { run: r3, cb: c3 } = freshCombat();
  forceHand(r3, c3, ['defend']);
  const playUid = c3.hand[0].uid;
  c3.queue.length = 0;
  assert.ok(playCard(r3, c3, playUid), 'defend plays');
  assert.ok(c3.queue.some((e) => e.t === 'toDiscard' && e.uid === playUid), 'non-exhaust skill emits toDiscard');
}

// ---- i18n: locale catalogue + hydrate parity --------------------------------
{
  assert.equal(getLocale(), 'en');
  assert.equal(t('cards.strike.name'), 'Edge');
  assert.equal(t('cards.unreadablePage.name'), 'The Unreadable Page');
  assert.equal(t('status.poison.name'), 'Smolder');
  assert.equal(t('relics.emberHeart.name'), 'Emberheart');
  assert.equal(t('omens.eighthOmen.name'), 'The Eighth Omen');
  assert.equal(t('enemies.sporeling.moves.spit.name'), 'Spore Spit');
  assert.equal(t('quests.paleOnes.name'), 'The Pale Ones');
  assert.equal(t('ui.menu.beginClimb'), 'Begin the Climb');
  assert.equal(t('ui.vigil.roseWindow'), 'Rose Window');
  assert.equal(t('ui.help.title'), 'How to Play');
  assert.equal(t('ui.shop.title'), 'THE MERCHANT');
  assert.equal(t('ui.rest.title'), 'REST SITE');
  assert.equal(t('ui.hollow.title'), 'THE HOLLOW LAMPLIGHTER');
  assert.equal(t('ui.dawn.whisperKicker'), 'A whisper reaches the dawn');
  assert.equal(t('ui.settings.resetConfirmTitle'), 'Reset Save?');
  assert.equal(t('ui.common.continue'), 'Continue');
  assert.equal(t('ui.treasure.openBtn'), 'Open the Chest');
  assert.equal(t('ui.persistence.retrySave'), 'Retry Save');
  assert.equal(t('ui.reward.bossRelicTitle'), 'A BOSS RELIC CALLS');
  assert.equal(t('ui.map.sealedDoor.title'), 'THE SEALED DOOR');
  assert.equal(t('ui.hollow.kicker', { current: 2, total: 5 }), 'THE UNLIT WAY · PRICE 2 OF 5');
  assert.equal(t('ui.end.fallenSub', { floor: 12 }), 'Here ended a climb, on floor <b>12</b>.<br>The Spire keeps what it takes — but the Vigil remembers.');
  assert.equal(t('missing.key.zzz'), 'missing.key.zzz');
  assert.equal(t('ui.smoke.hello', { name: 'Spire' }), 'Hello, Spire');
  assert.equal(setLocale('nope'), false, 'unknown locale ignored');
  assert.equal(getLocale(), 'en');

  const content = getContent();
  const tables = [
    ['cards', CARDS, ['name', 'text']],
    ['status', STATUS_INFO, ['name', 'desc']],
    ['relics', RELICS, ['name', 'text']],
    ['potions', POTIONS, ['name', 'text']],
    ['arts', ARTS, ['name', 'text']],
    ['boons', BOONS, ['name', 'text']],
    ['omens', OMENS, ['name', 'text']],
    ['affixes', AFFIXES, ['name', 'text']],
    ['deeds', DEEDS, ['name', 'desc']],
  ];
  for (const [key, table, fields] of tables) {
    for (const id of Object.keys(table)) {
      assert.ok(content[key][id], `locale has ${key}.${id}`);
      for (const f of fields) {
        assert.equal(table[id][f], content[key][id][f], `${key}.${id}.${f} hydrated`);
      }
    }
  }
  for (const id of Object.keys(CARDS)) {
    if (content.cards[id].textUp != null) {
      assert.equal(CARDS[id].up.text, content.cards[id].textUp, `card ${id} textUp`);
    }
  }
  for (const [id, e] of Object.entries(ENEMIES)) {
    assert.equal(e.name, content.enemies[id].name, `enemy ${id}.name`);
    for (const mk of Object.keys(e.moves)) {
      assert.equal(e.moves[mk].name, content.enemies[id].moves[mk].name, `enemy ${id}.${mk}`);
    }
  }
  for (const [id, ev] of Object.entries(EVENTS)) {
    assert.equal(ev.name, content.events[id].name, `event ${id}.name`);
    assert.equal(ev.text, content.events[id].text, `event ${id}.text`);
    (ev.choices || []).forEach((ch, i) => {
      assert.equal(ch.label, content.events[id].choices[i].label, `event ${id} choice ${i} label`);
      assert.equal(ch.sub, content.events[id].choices[i].sub, `event ${id} choice ${i} sub`);
    });
  }
  for (const id of Object.keys(QUESTS)) {
    assert.equal(QUESTS[id].name, content.quests[id].name, `quest ${id}.name`);
    assert.equal(QUESTS[id].mode, content.quests[id].mode, `quest ${id}.mode`);
    assert.equal(typeof QUESTS[id].target, 'number', `quest ${id}.target stays mechanic`);
  }
  ACTS.forEach((a, i) => {
    assert.equal(a.name, content.acts[i].name, `act ${i}.name`);
    assert.equal(a.bossName, content.acts[i].bossName, `act ${i}.bossName`);
  });
  VOWS.forEach((v, i) => {
    assert.equal(v.name, content.vows[i].name, `vow ${i}.name`);
    assert.equal(v.desc, content.vows[i].desc, `vow ${i}.desc`);
  });
  for (const a of ASPECTS) {
    assert.equal(a.name, content.aspects[a.id].name, `aspect ${a.id}.name`);
    assert.equal(a.blurb, content.aspects[a.id].blurb, `aspect ${a.id}.blurb`);
  }
  assert.equal(ASPECTS[0], PLAYER, 'ASPECTS[0] shares PLAYER identity after hydrate');
  assert.equal(PLAYER.name, content.aspects.duskblade.name);
  for (const [id, v] of Object.entries(VARIANTS)) {
    assert.ok(Array.isArray(v.dialogue), `variant ${id}.dialogue is array`);
    assert.equal(v.name, content.variants[id].name, `variant ${id}.name`);
  }
  assert.equal(t('ui.rose.finalWhisper'), 'The final whisper returns at every dawn.');
  assert.equal(t('ui.rose.dormantPane', { n: 2 }), 'Dormant Emberglass pane 2');
  assert.equal(WHISPERS.length, 24);
  assert.equal(WHISPERS.at(-1), 'The climb continues.');
  assert.deepEqual(WHISPERS, content.whispers);
  assert.equal(VARIANTS.ownShade1.name, content.variants.ownShade1.name);
  assert.equal(VARIANTS.ownShade1.deathDialogue, content.variants.ownShade1.deathDialogue);
  assert.equal(SHADE_KITS.duskblade.moves.eclipse.name, content.shadeKits.duskblade.moves.eclipse.name);
  assert.equal(QUESTS.hollowLamplighter.meetings.length, 5);
  assert.equal(QUESTS.hollowLamplighter.meetings[0].ask, content.quests.hollowLamplighter.meetings[0].ask);
  assert.equal(cardData(makeCard(newRun(2), 'strike', true)).name, 'Edge+');
}

// ---- monte-carlo: random agent plays full runs -----------------------------
function randomAgentRun(seed) {
  // a real climber picks an aspect, swears some vows, takes a boon, and may
  // walk into a monument left by a past self — exercise all of it
  const aspect = seed % 2;
  const vow = seed % 3;
  const boonIds = Object.keys(BOONS);
  const monument = seed % 4 === 0 ? { act: 0, row: 5, bequest: { kind: 'gold', amount: 40 } } : null;
  const run = newRun(seed, { aspect, vow, monument });
  applyEventOps(run, BOONS[boonIds[seed % boonIds.length]].ops);
  const rnd = (() => { let s = seed ^ 0x9e3779b9; const r = () => { s = (s * 1664525 + 1013904223) | 0; return ((s >>> 0) / 4294967296); }; return r; })();
  const choice = (arr) => arr[Math.floor(rnd() * arr.length)];
  let guard = 0;
  while (guard++ < 400) {
    const options = availableNodes(run);
    assert.ok(options.length > 0, 'always somewhere to go');
    const node = choice(options);
    const { type } = visitNode(run, node);
    if (type === 'monster' || type === 'elite' || type === 'boss') {
      const enc = rollEncounter(run, type, node.row);
      const cb = startCombat(run, enc, type);
      let turnGuard = 0;
      while (!cb.over && turnGuard++ < 200) {
        // play random playable cards
        let played = true, safety = 0;
        while (played && !cb.over && safety++ < 30) {
          played = false;
          const playable = cb.hand.filter((c) => {
            const d = cardData(c);
            if (d.unplayable) return false;
            return (d.cost ?? 99) <= cb.player.energy;
          });
          if (playable.length && rnd() < 0.9) {
            const card = choice(playable);
            const living = cb.enemies.map((e, i) => (e.hp > 0 ? i : -1)).filter((i) => i >= 0);
            const ok = playCard(run, cb, card.uid, living.length ? choice(living) : null);
            played = ok;
          }
        }
        // the agent kindles and uses its art sometimes, like a player would
        if (!cb.over && cb.hand.length && rnd() < 0.25) kindleFromHand(run, cb, choice(cb.hand).uid);
        if (!cb.over && canUseArt(run, cb) && rnd() < 0.4) useArt(run, cb);
        if (!cb.over) endTurn(run, cb);
        assert.ok(cb.embers >= 0 && cb.embers <= cb.emberCap, 'embers in range');
        for (const e of cb.enemies) if (e.hp > 0) assert.ok(e.chips < e.facetMax, 'chips below threshold');
        cb.queue.length = 0; // drain
      }
      assert.ok(cb.over, `combat terminates (${enc.join()},turns=${turnGuard})`);
      if (cb.result === 'loss') return { dead: true, run };
      const rw = genCombatRewards(run, type, cb.affix);
      run.player.gold += rw.gold;
      if (rw.cards.length && rnd() < 0.8) addCardToDeck(run, choice(rw.cards));
      if (rw.potion) gainPotion(run, rw.potion);
      if (rw.relic) gainRelic(run, rw.relic);
      if (type === 'boss') {
        if (run.act >= 2) return { won: true, run };
        const bosses = rollBossRelics(run);
        if (bosses.length) gainRelic(run, choice(bosses));
        run.act++;
        run.nodeId = null;
        run.map = genMap(run);
        healPlayer(run, Math.round(run.player.maxHp * 0.3));
      }
    } else if (type === 'rest') {
      if (rnd() < 0.5) healPlayer(run, Math.round(run.player.maxHp * 0.3));
      else {
        const up = run.player.deck.filter((c) => !c.up && CARDS[c.id].up);
        if (up.length) upgradeCardInDeck(run, choice(up).uid);
      }
    } else if (type === 'event') {
      const ev = EVENTS[rollEvent(run)];
      const valid = ev.choices.filter((c) => !c.needGold || run.player.gold >= c.needGold);
      const { pending } = applyEventOps(run, choice(valid).ops);
      for (const p of pending) {
        if (p === 'remove' && run.player.deck.length > 1) removeCardFromDeck(run, choice(run.player.deck).uid);
        else if (p === 'upgrade') { const u = run.player.deck.filter((c) => !c.up); if (u.length) upgradeCardInDeck(run, choice(u).uid); }
        else if (p === 'duplicate') addCardToDeck(run, choice(run.player.deck).id);
        else if (p.pickCard) addCardToDeck(run, choice(CARD_POOLS.common));
      }
    } else if (type === 'shop') {
      const shop = genShop(run);
      for (const it of [...shop.cards, ...shop.relics, ...shop.potions]) {
        if (!it.sold && it.price <= run.player.gold && rnd() < 0.4) {
          run.player.gold -= it.price;
          it.sold = true;
          if (shop.cards.includes(it)) addCardToDeck(run, it.id);
          else if (shop.relics.includes(it)) gainRelic(run, it.id);
          else gainPotion(run, it.id);
        }
      }
    } else if (type === 'treasure') {
      const r = randomRelic(run);
      if (r) gainRelic(run, r);
    } else if (type === 'monument') {
      claimMonument(run); // recover what a past self left in the stone
    }
    assert.ok(run.player.hp > 0, 'alive after node');
    assert.ok(run.player.hp <= run.player.maxHp, 'hp <= maxHp');
  }
  throw new Error('run did not terminate');
}

// ---- asset manifest --------------------------------------------------------
// Every content id ships its painted art, and no orphaned file lingers after a
// rename. Runs both directions so a card/relic/enemy rename that forgets the
// PNG (or the data key) fails here instead of falling back to SVG in the wild.
{
  const assetIds = (cat) => new Set(
    readdirSync(new URL(`../src/assets/${cat}`, import.meta.url))
      .filter((f) => /\.(png|jpg)$/i.test(f))
      .map((f) => f.replace(/\.(png|jpg)$/i, '')),
  );
  const checkManifest = (cat, requiredIds, optionalIds = []) => {
    const have = assetIds(cat);
    const required = new Set(requiredIds);
    const known = new Set([...requiredIds, ...optionalIds]);
    for (const id of required) assert.ok(have.has(id), `asset missing: src/assets/${cat}/${id} (data id has no art)`);
    for (const id of have) assert.ok(known.has(id), `orphan asset: src/assets/${cat}/${id} (art has no data id)`);
  };
  const paeth = (left, up, upperLeft) => {
    const estimate = left + up - upperLeft;
    const leftDistance = Math.abs(estimate - left);
    const upDistance = Math.abs(estimate - up);
    const upperLeftDistance = Math.abs(estimate - upperLeft);
    if (leftDistance <= upDistance && leftDistance <= upperLeftDistance) return left;
    return upDistance <= upperLeftDistance ? up : upperLeft;
  };
  const readPng = (url) => {
    const bytes = readFileSync(url);
    const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
    assert.ok(bytes.subarray(0, signature.length).equals(signature), `${url}: invalid PNG signature`);

    let offset = signature.length;
    let header = null;
    let ended = false;
    const compressed = [];
    while (offset + 12 <= bytes.length) {
      const length = bytes.readUInt32BE(offset);
      const type = bytes.toString('ascii', offset + 4, offset + 8);
      const dataStart = offset + 8;
      const dataEnd = dataStart + length;
      assert.ok(dataEnd + 4 <= bytes.length, `${url}: truncated ${type} chunk`);
      if (type === 'IHDR') {
        assert.equal(length, 13, `${url}: invalid IHDR length`);
        assert.equal(header, null, `${url}: duplicate IHDR`);
        header = {
          width: bytes.readUInt32BE(dataStart),
          height: bytes.readUInt32BE(dataStart + 4),
          bitDepth: bytes[dataStart + 8],
          colourType: bytes[dataStart + 9],
          compression: bytes[dataStart + 10],
          filter: bytes[dataStart + 11],
          interlace: bytes[dataStart + 12],
        };
      } else if (type === 'IDAT') {
        compressed.push(bytes.subarray(dataStart, dataEnd));
      } else if (type === 'IEND') {
        ended = true;
        break;
      }
      offset = dataEnd + 4;
    }

    assert.ok(header, `${url}: missing IHDR`);
    assert.ok(ended, `${url}: missing IEND`);
    assert.ok(compressed.length, `${url}: missing IDAT`);
    assert.equal(header.bitDepth, 8, `${url}: PNG must use 8-bit channels`);
    assert.ok(header.colourType === 2 || header.colourType === 6,
      `${url}: PNG must be RGB or RGBA`);
    assert.equal(header.compression, 0, `${url}: unsupported PNG compression`);
    assert.equal(header.filter, 0, `${url}: unsupported PNG filter method`);
    assert.equal(header.interlace, 0, `${url}: PNG must be non-interlaced`);

    const channels = header.colourType === 6 ? 4 : 3;
    const stride = header.width * channels;
    const filtered = inflateSync(Buffer.concat(compressed));
    assert.equal(filtered.length, (stride + 1) * header.height,
      `${url}: unexpected inflated PNG length`);
    const pixels = Buffer.alloc(stride * header.height);
    let source = 0;
    for (let y = 0; y < header.height; y++) {
      const filterType = filtered[source++];
      assert.ok(filterType >= 0 && filterType <= 4, `${url}: unsupported PNG row filter ${filterType}`);
      const rowStart = y * stride;
      for (let x = 0; x < stride; x++) {
        const target = rowStart + x;
        const left = x >= channels ? pixels[target - channels] : 0;
        const up = y > 0 ? pixels[target - stride] : 0;
        const upperLeft = y > 0 && x >= channels ? pixels[target - stride - channels] : 0;
        let predictor = 0;
        if (filterType === 1) predictor = left;
        else if (filterType === 2) predictor = up;
        else if (filterType === 3) predictor = Math.floor((left + up) / 2);
        else if (filterType === 4) predictor = paeth(left, up, upperLeft);
        pixels[target] = (filtered[source++] + predictor) & 0xff;
      }
    }

    const alpha = new Set();
    if (channels === 4) {
      for (let i = 3; i < pixels.length; i += channels) alpha.add(pixels[i]);
    }
    return { ...header, channels, alpha };
  };
  checkManifest('cards', Object.keys(CARDS).filter((id) => id !== 'unreadablePage'), ['unreadablePage']);
  checkManifest('enemies', Object.keys(ENEMIES));
  checkManifest('relics', Object.keys(RELICS));
  checkManifest('potions', Object.keys(POTIONS));
  checkManifest('events', Object.keys(EVENTS));
  checkManifest('omens', Object.keys(OMENS).filter((id) => id !== 'eighthOmen'), ['eighthOmen']);
  checkManifest('boons', Object.keys(BOONS));
  checkManifest('arts', Object.keys(ARTS));
  checkManifest('heroes', ASPECTS.map((a) => a.id));
  checkManifest('stage', [1, 2, 3].flatMap((a) => ['backdrop', 'mid', 'ledge'].map((l) => `act${a}-${l}`)));
  checkManifest('props', ['campfire', 'chest', 'chest-open', 'merchant']);
  checkManifest('statuses', Object.keys(STATUS_INFO));
  checkManifest('deeds', Object.keys(DEEDS));
  checkManifest('bequests', ['relic', 'card', 'gold']);
  const ROSE_OPTIONAL = [
    'emberglass-mural', 'emberglass-frame',
    ...QUEST_IDS.map((id) => 'emberglass-mask-' + id),
  ];
  checkManifest('meta', ['fallen', 'ascended', 'monument-node'], ROSE_OPTIONAL);
  {
    const roseIds = [
      'emberglass-mural', 'emberglass-frame',
      ...QUEST_IDS.map((id) => 'emberglass-mask-' + id),
    ];
    const present = roseIds.filter((id) => assetIds('meta').has(id));
    assert.ok(present.length === 0 || present.length === roseIds.length,
      `Rose assets are atomic: found ${present.length}/${roseIds.length}`);
    if (present.length) {
      for (const id of roseIds) {
        const image = readPng(new URL(`../src/assets/meta/${id}.png`, import.meta.url));
        assert.deepEqual([image.width, image.height], [1024, 1024], `${id}: expected 1024×1024`);
        if (id === 'emberglass-mural') {
          assert.ok(image.colourType === 2 || image.colourType === 6, `${id}: expected RGB or RGBA`);
          if (image.colourType === 6) {
            assert.deepEqual([...image.alpha].sort((a, b) => a - b), [255], `${id}: RGBA mural must be opaque`);
          }
        } else {
          assert.equal(image.colourType, 6, `${id}: frame and masks must be RGBA`);
          assert.deepEqual([...image.alpha].sort((a, b) => a - b), [0, 255],
            `${id}: alpha must be exactly binary`);
        }
      }
    }
  }
  checkManifest('ui', UI_CHROME_IDS);
}

// ---- pile chrome helpers (pure) ----
{
  assert.equal(pileTier(0), 0);
  assert.equal(pileTier(1), 1);
  assert.equal(pileTier(4), 4);
  assert.equal(pileTier(5), 5);
  assert.equal(pileTier(99), 5);
  assert.equal(pileTier(-1), 0);

  assert.equal(pileFanLayers(0), 0);
  assert.equal(pileFanLayers(1), 1);
  assert.equal(pileFanLayers(8), 8);
  assert.equal(pileFanLayers(99), PILE_FAN_MAX_LAYERS);
  // 3 cards @ 5° → ±5°
  assert.equal(pileFanAngleDeg(0, 3), -5);
  assert.equal(pileFanAngleDeg(1, 3), 0);
  assert.equal(pileFanAngleDeg(2, 3), 5);
  // 7 cards still at preferred 5° (span 30)
  assert.equal(pileFanAngleDeg(0, 7), -15);
  assert.equal(pileFanAngleDeg(6, 7), 15);
  // 16 cards: average step = 30/15 = 2°
  assert.equal(pileFanAngleDeg(0, 16), -15);
  assert.equal(pileFanAngleDeg(8, 16), 1);
  assert.equal(pileFanAngleDeg(15, 16), 15);
  const layersCap = pileFanLayers(99);
  assert.ok(
    pileFanAngleDeg(layersCap - 1, layersCap) - pileFanAngleDeg(0, layersCap) <= PILE_FAN_MAX_DEG + 1e-9
  );

  const s1 = flightSchedule(1, 400);
  assert.ok(s1.awaitMs <= 400 && s1.awaitMs >= 200);
  const s10 = flightSchedule(10, 400);
  assert.ok(s10.stagger <= s1.stagger || s10.stagger <= 48);
  assert.ok(s10.awaitMs <= 480, 'large n stays near budget');
  assert.ok(s10.stagger >= 8);

  const d5 = drawBatchSchedule(5, 500);
  assert.equal(d5.stagger, 100);
  assert.ok(d5.flightDur >= 160 && d5.flightDur <= 280);
  assert.equal(d5.awaitMs, d5.flightDur + 400);
  const d1 = drawBatchSchedule(1, 500);
  assert.equal(d1.stagger, 0);
  assert.ok(d1.flightDur <= 280);

  assert.deepEqual(PILE_IDS, ['draw', 'discard', 'ashes']);
}

// ---- ui chrome helpers (pure) ----
{
  assert.ok(UI_CHROME_IDS.includes('candle-lit'));
  assert.ok(UI_CHROME_IDS.includes('node-monument'));
  assert.equal(UI_CHROME_IDS.length, 27);
  assert.equal(uiFallbackName('deck'), 'cards');
  assert.equal(uiFallbackName('ward'), 'shield');
  assert.equal(uiFallbackName('menu'), 'menu');
  assert.equal(uiFallbackName('node-frame'), null);
  assert.deepEqual(energySlotStates(2, 3), ['lit', 'lit', 'spent']);
  assert.deepEqual(energySlotStates(0, 3), ['spent', 'spent', 'spent']);
  assert.deepEqual(energySlotStates(5, 3), ['lit', 'lit', 'lit', 'lit', 'lit']); // length follows max(energy, energyMax)
  assert.deepEqual(intentUiIds('attack'), ['intent-attack']);
  assert.deepEqual(intentUiIds('attack_debuff'), ['intent-attack', 'intent-debuff']);
  assert.deepEqual(intentUiIds('block'), ['intent-block']);
  assert.deepEqual(intentUiIds('mystery'), ['intent-attack']);
  assert.equal(nodeGlyphId('elite', false), 'node-elite');
  assert.equal(nodeGlyphId('monster', true), 'node-unlit');
}

// Load through Vite so import.meta.glob is resolved and this checks the actual
// iconSvg output used by the browser, not merely the structural registry source.
{
  const vite = await createViteServer({ server: { middlewareMode: true }, appType: 'custom', logLevel: 'silent' });
  let paleMote, emptyLantern, eighthOmen, emberglassIcons;
  try {
    const { iconSvg } = await vite.ssrLoadModule('/src/art.js');
    paleMote = iconSvg('paleMote', 18);
    emptyLantern = iconSvg('emptyLantern', 18);
    eighthOmen = iconSvg('eighthOmen', 18);
    emberglassIcons = Object.fromEntries(
      ['emberglassShard', 'roseWindow', 'unreadablePage', 'hollowLantern', 'sealedDoor']
        .map((id) => [id, iconSvg(id, 18)]),
    );
  } finally {
    await vite.close();
  }
  assert.match(paleMote, /<path\b[^>]*\bd="[^"]+"[^>]*>/,
    'paleMote iconSvg output contains a non-empty path d');
  assert.match(emptyLantern, /<path\b[^>]*\bd="[^"]+"[^>]*>/,
    'emptyLantern iconSvg output contains a non-empty path d');
  const brokenLeads = [...eighthOmen.matchAll(/<path(?=[^>]*class="broken-lead")(?=[^>]*\bd="([^"]+)")[^>]*>/g)];
  assert.equal(brokenLeads.length, 6, 'the broken omen icon has six disconnected structural strokes');
  assert.ok(brokenLeads.every((match) => match[1].trim().length > 0),
    'every broken omen stroke has real non-empty path output');
  assert.equal(eighthOmen.replace(/<[^>]+>/g, '').trim(), '',
    'the broken omen icon contains no font glyph');
  for (const [id, svg] of Object.entries(emberglassIcons)) {
    assert.match(svg, /<path\b[^>]*\bd="[^"]+"[^>]*>/,
      `${id} iconSvg output contains a non-empty path d`);
    assert.equal(svg.replace(/<[^>]+>/g, '').trim(), '',
      `${id} icon contains no font glyph`);
  }
}

// ---- battlefield layout schema (spec 2026-07-06-battlefield-editor-design) ----
{
  const shapes = ['phone-portrait', 'phone-landscape', 'pad-portrait', 'pad-landscape', 'desktop-landscape'];
  for (const sh of shapes) {
    const L = bfResolve(sh);
    assert.ok(Number.isFinite(L.groundY) && L.groundY > 0, `bf: ${sh} groundY`);
    assert.ok(Number.isFinite(L.ledgeLip), `bf: ${sh} ledgeLip`);
    for (const k of ['x', 'w', 'h']) assert.ok(Number.isFinite(L.hero[k]), `bf: ${sh} hero.${k}`);
    assert.ok(Number.isFinite(bfHeroY(L)), `bf: ${sh} hero.y`);
    for (const n of [1, 2, 3]) {
      const slots = bfSlots(L, n);
      assert.equal(slots.length, n, `bf: ${sh} slots(${n})`);
      for (const s of slots) assert.ok(Number.isFinite(s.x) && s.s > 0, `bf: ${sh} slots(${n}) entry`);
    }
    for (const layer of ['backdrop', 'mid', 'ledge']) {
      for (const k of ['h', 'y', 'x', 'zoom', 'posX', 'posY', 'opacity', 'drift']) {
        assert.ok(Number.isFinite(L.layers[layer][k]), `bf: ${sh} layers.${layer}.${k}`);
      }
    }
    for (const t of ['normal', 'elite', 'boss']) assert.ok(L.shared.sizes[t] > 0, `bf: ${sh} sizes.${t}`);
  }
  for (const key of Object.keys(ENEMIES)) {
    const a = bfActor('enemies', key);
    assert.ok(Number.isFinite(a.scale) && Number.isFinite(a.footY), `bf: enemy actor ${key}`);
  }
  for (const a of ASPECTS) {
    const h = bfActor('heroes', a.id);
    assert.ok(Number.isFinite(h.scale) && Number.isFinite(h.footY), `bf: hero actor ${a.id}`);
  }
  // slot interpolation fallback: a count with no authored formation still lays out
  assert.equal(bfSlots(bfResolve('pad-landscape'), 4).length, 4, 'bf: slot fallback');
  // clamp guard: absurd tier sizes are no longer capped to the stage frame
  const L = bfResolve('pad-landscape');
  _setBF({ ...bfRaw(), shared: { ...bfRaw().shared, sizes: { normal: 99999, elite: 99999, boss: 99999 } } });
  assert.equal(bfEnemySize(bfResolve('pad-landscape'), 'duskfang', 'normal', { x: 0, s: 1 }, 1180, 820),
    Math.round(99999 * bfActor('enemies', 'duskfang').scale), 'bf: no stage size clamp');
  _setBF(null);
  // depth: lower slot lift draws in front
  assert.deepEqual(bfEnemyZOrder([{ y: 40 }, { y: 0 }], ['a', 'b']), [1, 2], 'bf: enemy z-order by bottom');
  assert.equal(bfEnemyFootY({ footY: 5 }, 'duskfang'), 5, 'bf: slot footY override');
  assert.equal(bfEnemyFootY({}, 'duskfang'), bfActor('enemies', 'duskfang').footY, 'bf: shared footY fallback');
  assert.equal(bfEnemyFootX({ footX: 12 }, 'duskfang'), 12, 'bf: slot footX override');
  assert.equal(bfEnemyFootX({}, 'duskfang'), 0, 'bf: shared footX default');
  const portrait = bfResolve('phone-portrait', 2);
  const [portraitSingle] = bfSlots(portrait, 1);
  assert.deepEqual(
    bfEnemyFrame(portrait, 'sovereign', 'boss', portraitSingle, 390, 844,
      VARIANTS.usurpedSovereign.scale),
    { size: 233, left: 84, bottom: 0 },
    'bf: portrait Usurper frame keeps sovereign footX, slot footY, and presentation scale',
  );
  assert.deepEqual(
    bfEnemyFrame(bfResolve('phone-portrait', 0), 'leviathan', 'boss',
      bfSlots(bfResolve('phone-portrait', 0), 1)[0], 390, 844),
    { size: 374, left: -37, bottom: 0 },
    'bf: oversized portrait actor frame preserves the authored horizontal foot anchor',
  );
  const stageShapes = {
    'phone-portrait': [390, 844],
    'phone-landscape': [844, 390],
    'pad-portrait': [820, 1180],
    'pad-landscape': [1180, 820],
    'desktop-landscape': [1458, 820],
  };
  for (const [shape, [stageWidth, stageHeight]] of Object.entries(stageShapes)) {
    for (const act of [0, 1, 2]) {
      const layout = bfResolve(shape, act);
      const [slot] = bfSlots(layout, 1);
      for (const [key, enemy] of Object.entries(ENEMIES)) {
        const tier = enemy.boss ? 'boss' : enemy.elite ? 'elite' : 'normal';
        const frame = bfEnemyFrame(layout, key, tier, slot, stageWidth, stageHeight);
        const top = stageHeight - layout.groundY - frame.bottom - frame.size;
        assert.ok(top >= 8,
          `bf: ${shape} act ${act} single ${key} root stays below the 8px stage crown (top ${top})`);
        assert.equal(frame.left,
          Math.round(slot.x - frame.size / 2 + bfEnemyFootX(slot, key)),
          `bf: ${shape} act ${act} single ${key} preserves its authored horizontal foot anchor`);
      }
    }
  }
  _setBF({ ...bfRaw(), shapes: { 'pad-landscape': { hero: { y: 12 } } } });
  assert.equal(bfHeroY(bfResolve('pad-landscape', 0)), 12, 'bf: hero.y pad-landscape shape override');
  _setBF({ ...bfRaw(), shapes: { 'desktop-landscape': { hero: { y: 24 } } } });
  assert.equal(bfHeroY(bfResolve('desktop-landscape', 0)), 24, 'bf: hero.y desktop shape override');
  _setBF(null);
  // act layer merges per shape (after base + shape)
  const raw = bfRaw();
  const baseGY = bfResolve('desktop-landscape', 0).groundY;
  _setBF({
    ...raw,
    shapes: {
      ...raw.shapes,
      'desktop-landscape': {
        ...raw.shapes['desktop-landscape'],
        acts: { ...raw.shapes['desktop-landscape']?.acts, 1: { groundY: baseGY + 42 } },
      },
    },
  });
  assert.equal(bfResolve('desktop-landscape', 0).groundY, baseGY, 'bf: act override does not leak to other acts');
  assert.equal(bfResolve('desktop-landscape', 1).groundY, baseGY + 42, 'bf: act override applies to that act');
  assert.equal(bfResolve('phone-portrait', 1).groundY, bfResolve('phone-portrait', 0).groundY, 'bf: act override does not leak across shapes');
  _setBF(null);
  assert.equal(bfResolve('pad-landscape').groundY, L.groundY, 'bf: _setBF(null) restores the file');
  // serializer: valid, deterministic, and a true round-trip
  assert.deepEqual(validateBF(bfRaw(), { enemies: Object.keys(ENEMIES), heroes: ASPECTS.map((a) => a.id) }), [], 'bf: file validates');
  const src1 = serializeBF(bfRaw());
  assert.ok(src1.startsWith('// Battlefield layout'), 'bf: serialized header');
  const mod = await import(`data:text/javascript,${encodeURIComponent(src1)}`);
  assert.equal(serializeBF(mod.BF), src1, 'bf: serialize(import(serialize(BF))) is byte-identical');
  assert.ok(validateBF({ base: {} }).length > 0, 'bf: broken layout rejected');
}

// ---- UI chrome layout (?bfuiedit=1) ------------------------------------------
{
  const shapes = ['phone-portrait', 'phone-landscape', 'pad-portrait', 'pad-landscape', 'desktop-landscape'];
  const widgets = ['energy', 'lantern', 'endTurn', 'draw', 'discard', 'ashes', 'hud', 'omen', 'relics', 'hand'];
  for (const sh of shapes) {
    const L = uicResolve(sh);
    for (const id of widgets) {
      assert.ok(L[id], `uic: ${sh} ${id}`);
      for (const [k, v] of Object.entries(L[id])) {
        assert.ok(Number.isFinite(v), `uic: ${sh} ${id}.${k}`);
      }
    }
    for (const id of ['endTurn', 'discard', 'ashes']) {
      assert.ok(Number.isFinite(L[id].right), `uic: ${sh} ${id}.right`);
      assert.equal(L[id].left, undefined, `uic: ${sh} ${id} stays right-anchored`);
    }
    assert.ok(Number.isFinite(L.energy.left) && Number.isFinite(L.energy.bottom), `uic: ${sh} energy edges`);
    assert.ok(Number.isFinite(L.hud.height) && Number.isFinite(L.hud.scale), `uic: ${sh} hud unit`);
    assert.ok(Number.isFinite(L.omen.top) && Number.isFinite(L.omen.scale), `uic: ${sh} omen unit`);
    assert.ok(Number.isFinite(L.relics.top) && Number.isFinite(L.relics.scale), `uic: ${sh} relics unit`);
    assert.ok(Number.isFinite(L.hand.bottom) && Number.isFinite(L.hand.scale), `uic: ${sh} hand unit`);
    assert.notEqual(L.omen.scale, undefined, `uic: ${sh} omen scale independent of hud`);
    assert.notEqual(L.relics.scale, undefined, `uic: ${sh} relics scale independent of hud`);
  }
  const baseE = uicResolve('desktop-landscape').energy.bottom;
  _setUIC({
    ...uicRaw(),
    shapes: { ...uicRaw().shapes, 'desktop-landscape': { energy: { left: 24, bottom: baseE + 17 } } },
  });
  assert.equal(uicResolve('desktop-landscape').energy.bottom, baseE + 17, 'uic: shape override');
  assert.equal(uicResolve('phone-portrait').energy.bottom, uicRaw().shapes['phone-portrait'].energy.bottom, 'uic: override does not leak');
  _setUIC(null);
  assert.equal(uicResolve('desktop-landscape').energy.bottom, baseE, 'uic: _setUIC(null) restores');
  {
    const L = uicResolve('desktop-landscape');
    assert.deepEqual(relicBarLayout(L, true), L.relics, 'uic: omen present keeps relic origin');
    assert.deepEqual(relicBarLayout(L, false), { ...L.relics, left: L.omen.left, top: L.omen.top },
      'uic: empty omen packs relics from omen seat');
    assert.equal(relicBarLayout(null, false), null, 'uic: missing layout yields null');
  }
  assert.equal(validateUIC(uicRaw()).ok, true, 'uic: file validates');
  assert.deepEqual(validateUIC(uicRaw()).problems, [], 'uic: no problems');
  const src1 = serializeUIC(uicRaw());
  assert.ok(src1.startsWith('// UI chrome layout'), 'uic: serialized header');
  const mod = await import(`data:text/javascript,${encodeURIComponent(src1)}`);
  assert.equal(serializeUIC(mod.UIC), src1, 'uic: serialize round-trip byte-identical');
  assert.equal(validateUIC({ base: {} }).ok, false, 'uic: broken layout rejected');
}

// ---- char-meta table (?charedit=1) -------------------------------------------
{
  const {
    CHAR_META, CHAR_LAYOUT_DEFAULT, CHAR_SHADOW_DEFAULT, CHAR_AIM_DEFAULT,
    charLayout, charShadow, charMesh, charAim, _setCharMeta,
  } = await import('../src/char-meta.js');
  const { serializeCharMeta, validateCharMeta, pruneCharMeta, AIM_STYLES } = await import('../src/dev/char-serialize.js');
  assert.equal(validateCharMeta(CHAR_META, {
    heroes: ASPECTS.map((a) => a.id), enemies: Object.keys(ENEMIES),
  }).length, 0, 'char-meta: table validates');
  const lay = charLayout('duskblade');
  assert.equal(lay.footY, -30, 'char-meta: duskblade footY migrated');
  const c = charShadow('duskblade');
  assert.ok(c.sy > 0 && c.sy < 1, 'char-meta: duskblade shadow flattened');
  assert.equal(charLayout('sporeling').scale, 0.62, 'char-meta: sporeling scale migrated');
  assert.deepEqual(charMesh('duskfang'), {}, 'char-meta: no mesh override by default');
  assert.equal(charMesh('duskblade').breathe, 1.6, 'char-meta: duskblade mesh tuning applied');
  assert.ok(AIM_STYLES.includes(CHAR_AIM_DEFAULT.style), 'char-meta: aim default style valid');
  assert.ok(Number.isInteger(CHAR_AIM_DEFAULT.beams) && CHAR_AIM_DEFAULT.beams >= 1 && CHAR_AIM_DEFAULT.beams <= 4, 'char-meta: aim default beams in 1..4');
  assert.ok(Number.isInteger(CHAR_AIM_DEFAULT.dashes) && CHAR_AIM_DEFAULT.dashes >= 1 && CHAR_AIM_DEFAULT.dashes <= 4, 'char-meta: aim default dashes in 1..4');
  assert.ok(Number.isFinite(CHAR_AIM_DEFAULT.width) && CHAR_AIM_DEFAULT.width >= 0.006 && CHAR_AIM_DEFAULT.width <= 0.06, 'char-meta: aim default width in range');
  assert.deepEqual(charAim('sporeling'), { ...CHAR_AIM_DEFAULT }, 'char-meta: aim inherits global');
  assert.equal(charAim('sporeling').beams, CHAR_AIM_DEFAULT.beams, 'char-meta: aim beams inherit');
  assert.equal(charAim('sporeling').dashes, CHAR_AIM_DEFAULT.dashes, 'char-meta: aim dashes inherit');
  assert.equal(charAim('sporeling').width, CHAR_AIM_DEFAULT.width, 'char-meta: aim width inherit');
  _setCharMeta({ ...CHAR_META, sporeling: { ...(CHAR_META.sporeling || {}), aim: { style: 'chase', speed: 2 } } }, { silent: true });
  assert.equal(charAim('sporeling').style, 'chase', 'char-meta: aim style override');
  assert.equal(charAim('sporeling').color, CHAR_AIM_DEFAULT.color, 'char-meta: aim color inherits');
  _setCharMeta({ ...CHAR_META, sporeling: { ...(CHAR_META.sporeling || {}), aim: { beams: 3, dashes: 4, width: 0.03 } } }, { silent: true });
  assert.equal(charAim('sporeling').beams, 3, 'char-meta: aim beams override');
  assert.equal(charAim('sporeling').dashes, 4, 'char-meta: aim dashes override');
  assert.equal(charAim('sporeling').width, 0.03, 'char-meta: aim width override');
  assert.equal(charAim('sporeling').style, CHAR_AIM_DEFAULT.style, 'char-meta: aim style still inherits when only counts overridden');
  _setCharMeta(CHAR_META, { silent: true });
  assert.ok(validateCharMeta({ duskblade: { aim: { style: 'nope' } } }, { heroes: ASPECTS.map((a) => a.id), enemies: [] }).length > 0, 'char-meta: bad aim style rejected');
  assert.ok(validateCharMeta({ duskblade: { aim: { beams: 0 } } }, { heroes: ASPECTS.map((a) => a.id), enemies: [] }).length > 0, 'char-meta: beams 0 rejected');
  assert.ok(validateCharMeta({ duskblade: { aim: { dashes: 5 } } }, { heroes: ASPECTS.map((a) => a.id), enemies: [] }).length > 0, 'char-meta: dashes 5 rejected');
  assert.ok(validateCharMeta({ duskblade: { aim: { beams: 2.5 } } }, { heroes: ASPECTS.map((a) => a.id), enemies: [] }).length > 0, 'char-meta: beams non-int rejected');
  assert.ok(validateCharMeta({ duskblade: { aim: { width: 0.001 } } }, { heroes: ASPECTS.map((a) => a.id), enemies: [] }).length > 0, 'char-meta: width too thin rejected');
  assert.ok(validateCharMeta({ duskblade: { aim: { width: 0.1 } } }, { heroes: ASPECTS.map((a) => a.id), enemies: [] }).length > 0, 'char-meta: width too thick rejected');
  const prunedAim = pruneCharMeta({ x: { aim: { ...CHAR_AIM_DEFAULT } } }, { layout: CHAR_LAYOUT_DEFAULT, aim: CHAR_AIM_DEFAULT });
  assert.ok(!prunedAim.x, 'char-meta: aim equal to default pruned');
  const prunedCounts = pruneCharMeta(
    { x: { aim: { ...CHAR_AIM_DEFAULT } } },
    { layout: CHAR_LAYOUT_DEFAULT, aim: CHAR_AIM_DEFAULT },
  );
  assert.ok(!prunedCounts.x, 'char-meta: aim equal to default (incl counts) pruned');
  const src = serializeCharMeta(CHAR_META, { layout: CHAR_LAYOUT_DEFAULT, shadow: CHAR_SHADOW_DEFAULT, aim: CHAR_AIM_DEFAULT });
  assert.ok(src.includes('export const CHAR_META'), 'char-meta: serialized');
  assert.ok(src.includes('export const CHAR_AIM_DEFAULT'), 'char-meta: aim default serialized');
  assert.ok(new RegExp(`beams:\\s*${CHAR_AIM_DEFAULT.beams}`).test(src), 'char-meta: beams in CHAR_AIM_DEFAULT serialize');
  assert.ok(new RegExp(`dashes:\\s*${CHAR_AIM_DEFAULT.dashes}`).test(src), 'char-meta: dashes in CHAR_AIM_DEFAULT serialize');
  assert.ok(/width:\s*/.test(src), 'char-meta: width in CHAR_AIM_DEFAULT serialize');
  assert.ok(validateCharMeta({ nope: { scale: 1 } }, { heroes: [], enemies: [] }).length > 0, 'char-meta: unknown id rejected');
  assert.ok(!pruneCharMeta({ x: { scale: 1 } }, { layout: CHAR_LAYOUT_DEFAULT }).x, 'char-meta: default scale pruned');
  // bfActor reads char-meta, not BF.shared
  assert.equal(bfActor('heroes', 'duskblade').footY, -30, 'bfActor: from char-meta');
  assert.equal(bfActor('enemies', 'leviathan').scale, 4, 'bfActor: leviathan scale from char-meta');
}

// ---- char feet scan (auto-detect ox/oy) --------------------------------------
{
  const { containBottom, feetFromAlpha, feetToOriginPct } = await import('../src/dev/char-feet-scan.js');
  const box = containBottom(100, 200, 100, 200);
  assert.equal(box.ox, 0, 'feet-scan: full-bleed ox');
  assert.equal(box.oy, 0, 'feet-scan: full-bleed oy');
  // letterbox: tall art in wide box → bottom-aligned
  const lb = containBottom(50, 100, 200, 100);
  assert.ok(Math.abs(lb.s - 1) < 1e-9, 'feet-scan: letterbox scale');
  assert.equal(lb.oy, 0, 'feet-scan: bottom-aligned');
  assert.equal(lb.ox, 75, 'feet-scan: centered X');

  // 8×8: opaque L-shape with a thin tip at bottom and a wider foot row above
  const w = 8, h = 8;
  const data = new Uint8ClampedArray(w * h * 4);
  const set = (x, y) => { const i = (y * w + x) * 4; data[i] = 255; data[i + 3] = 255; };
  // body mass mid
  for (let y = 1; y <= 4; y++) for (let x = 2; x <= 5; x++) set(x, y);
  // wider foot row at y=5 (span 4)
  for (let x = 2; x <= 5; x++) set(x, 5);
  // single-pixel cape tip at y=7 (should be skipped for footRow)
  set(3, 7);
  const feet = feetFromAlpha(data, w, h);
  assert.ok(feet, 'feet-scan: found feet');
  assert.equal(feet.footRow, 5, 'feet-scan: skips thin tip');
  assert.ok(feet.footX >= 2 && feet.footX <= 5, 'feet-scan: footX in span');

  const pct = feetToOriginPct({ footX: 50, footRow: 199 }, 100, 200, 100, 200);
  assert.equal(pct.ox, 50, 'feet-scan: origin ox');
  assert.equal(pct.oy, 99.5, 'feet-scan: origin oy near bottom');
}

// ---- Round 5 Task 11: content registry, registrations and doctor ------------
{
  assert.deepEqual(MERGE_POLICIES, Object.freeze({
    player: 'singleton', shop: 'singleton',
    cards: 'keyed-unique', statuses: 'keyed-unique', relics: 'keyed-unique',
    potions: 'keyed-unique', enemies: 'keyed-unique', events: 'keyed-unique',
    omens: 'keyed-unique', affixes: 'keyed-unique', arts: 'keyed-unique',
    deeds: 'keyed-unique', quests: 'keyed-unique', variants: 'keyed-unique',
    shadeKits: 'keyed-unique', boons: 'keyed-unique', themes: 'keyed-unique',
    aspects: 'append-unique-id', vows: 'append', questIds: 'append-unique',
    progression: 'nested-declared',
  }));
  assert.deepEqual(PROGRESSION_MERGE_POLICIES, Object.freeze({
    revealThresholds: 'keyed-unique',
    poolWaves: Object.freeze({
      definitions: 'keyed-unique', extensions: 'existing-key-explicit',
      members: 'append-unique', gateAssignment: 'globally-unique',
    }),
    features: 'keyed-unique-flatten',
  }));
  assert.ok(Object.isFrozen(CONTENT_SCHEMAS));
  assert.equal(CONTENT_SCHEMAS.themes.fields.bossPlates.kind, 'object');
  assert.equal(CONTENT_SCHEMAS.themes.fields.lanternLights.kind, 'array');
  assert.equal(CONTENT_SCHEMAS.themes.fields.tagline.source, 'locale');

  const sampleInput = {
    id: 'sample',
    cards: { sampleCard: {
      type: 'attack', rarity: 'common', cost: 1,
      target: 'enemy', vfx: 'slash', effects: [{ kind: 'dmg', n: 1 }],
    } },
    enemies: { sampleEnemy: {
      hp: [1, 1], facets: 2,
      moves: { wait: { intent: 'buff' } }, ai: (_ctx) => 'wait',
    } },
  };
  const sample = definePack(sampleInput);
  const sampleLocale = {
    cards: { sampleCard: { name: 'Sample', text: 'Deal @1@ damage.' } },
    enemies: { sampleEnemy: { name: 'Sample Enemy', moves: { wait: { name: 'Wait' } } } },
  };
  sampleInput.cards.sampleCard.effects[0].n = 99;
  assert.equal(sample.cards.sampleCard.effects[0].n, 1, 'definePack snapshots caller-owned data');
  assert.equal(sample.enemies.sampleEnemy.ai, sampleInput.enemies.sampleEnemy.ai,
    'declared behaviour hooks retain function identity');
  const registry = createContentRegistry([sample]);
  assert.equal(registry.cards.sampleCard.name, undefined);
  assert.equal(registry.enemies.sampleEnemy.ai.length, 1);
  assert.equal(Object.isFrozen(registry.cards), true);
  assert.equal(Object.isFrozen(registry.cards.sampleCard.effects), true);
  assert.throws(() => { registry.cards.sampleCard.effects[0].n = 2; }, TypeError);
  assert.throws(() => createContentRegistry([sample, sample]), /duplicate pack.*sample/i);
  const sample2 = definePack({ id: 'sample2', cards: { sampleCard: sample.cards.sampleCard } });
  assert.throws(() => createContentRegistry([sample, sample2]), /duplicate.*sampleCard/i);
  assert.throws(() => definePack({ id: 'bad', cards: { bad: { text: 'locale leak' } } }),
    /source.*locale|cards\.bad/i);
  assert.throws(() => definePack({ id: 'bad-protocol', QUEST_STATES: [] }), /protocol|unknown domain/i);
  assert.throws(() => definePack({ id: 'bad-whispers', whispers: [] }), /locale-field-in-pack|whispers/i);
  assert.throws(() => definePack({ id: 'bad-reveals', reveals: [] }), /derived|unknown domain|reveals/i);
  let getterRuns = 0;
  const accessorCard = {};
  Object.defineProperty(accessorCard, 'cost', { enumerable: true, get() { getterRuns++; return 1; } });
  assert.throws(() => definePack({ id: 'accessor', cards: { accessorCard } }), (error) =>
    error.problems.some((problem) => problem.code === 'accessor-not-allowed'
      && problem.field === 'cards.accessorCard.cost'));
  assert.equal(getterRuns, 0, 'descriptor validation never invokes accessors');
  assert.throws(() => definePack({ id: 'function-data', cards: { bad: { cost: () => 1 } } }),
    /function|cards\.bad\.cost/i);

  const coreProgression = definePack({
    id: 'progression-core',
    aspects: [{ id: 'aspectA', hp: 1 }],
    progression: {
      revealThresholds: { poolWave2: { runsPlayed: 2 } },
      poolWaves: { define: { poolWave2: { cards: ['executioner'], relics: ['reapersBell'] } }, extend: {} },
      features: { emberglass: { enabled: true, nested: { value: 1 } } },
    },
  });
  const expansionProgression = definePack({
    id: 'progression-expansion',
    progression: {
      revealThresholds: { expansionGate: { runsPlayed: 7 } },
      poolWaves: {
        define: { expansionGate: { cards: ['expansionCard'], relics: [] } },
        extend: { poolWave2: { cards: ['expansionCommon'], relics: [] } },
      },
      features: { expansionQuest: { enabled: true } },
    },
  });
  const progressionRegistry = createContentRegistry([coreProgression, expansionProgression]);
  assert.deepEqual(progressionRegistry.progression, {
    revealThresholds: { poolWave2: { runsPlayed: 2 }, expansionGate: { runsPlayed: 7 } },
    poolWaves: {
      poolWave2: { cards: ['executioner', 'expansionCommon'], relics: ['reapersBell'] },
      expansionGate: { cards: ['expansionCard'], relics: [] },
    },
    emberglass: { enabled: true, nested: { value: 1 } },
    expansionQuest: { enabled: true },
  });
  assert.throws(() => { progressionRegistry.progression.emberglass.nested.value = 2; }, TypeError);
  const secondExtension = definePack({ id: 'progression-extension-2', progression: {
    revealThresholds: {}, poolWaves: { define: {}, extend: { poolWave2: { cards: ['later'], relics: [] } } }, features: {},
  } });
  assert.deepEqual(createContentRegistry([coreProgression, expansionProgression, secondExtension])
    .progression.poolWaves.poolWave2.cards, ['executioner', 'expansionCommon', 'later']);
  const progressionFailures = [
    { id: 'forward', progression: { revealThresholds: {}, poolWaves: { define: {}, extend: { later: { cards: [], relics: [] } } }, features: {} } },
    { id: 'threshold', progression: { revealThresholds: { poolWave2: {} }, poolWaves: { define: {}, extend: {} }, features: {} } },
    { id: 'wave', progression: { revealThresholds: {}, poolWaves: { define: { poolWave2: { cards: [], relics: [] } }, extend: {} }, features: {} } },
    { id: 'feature', progression: { revealThresholds: {}, poolWaves: { define: {}, extend: {} }, features: { emberglass: {} } } },
    { id: 'reserved', progression: { revealThresholds: {}, poolWaves: { define: {}, extend: {} }, features: { poolWaves: {} } } },
    { id: 'member', progression: { revealThresholds: {}, poolWaves: { define: {}, extend: { poolWave2: { cards: ['executioner'], relics: [] } } }, features: {} } },
    { id: 'gate', progression: { revealThresholds: {}, poolWaves: { define: { other: { cards: ['executioner'], relics: [] } }, extend: {} }, features: {} } },
  ];
  for (const bad of progressionFailures) {
    assert.throws(() => createContentRegistry([coreProgression, definePack(bad)]), /progression|poolWave2|emberglass|duplicate|reserved|extension/i);
  }
  assert.throws(() => createContentRegistry([coreProgression,
    definePack({ id: 'aspect-duplicate', aspects: [{ id: 'aspectA' }] })]), /aspectA|duplicate/i);

  assert.throws(() => definePack({
    id: 'bad-theme',
    themes: {
      bad: {
        name: 'Locale leak',
        plates: { background: 'x' },
        weather: { kind: 'ash' },
        palette: {},
        music: 'combat',
        roster: [],
        encounters: [],
        rewardGold: [1, 2],
        mapHaze: 'haze',
        lanternLights: [],
        bossPlates: [],
      },
    },
  }), (error) => {
    assert.ok(error.problems.length >= 2, 'invalid theme aggregates every problem');
    assert.ok(error.problems.some((problem) => problem.code === 'locale-field-in-pack'
      && problem.field === 'themes.bad.name'));
    assert.ok(error.problems.some((problem) => problem.code === 'required-field-missing'
      && problem.field === 'themes.bad.legacyAct'));
    assert.ok(error.problems.some((problem) => problem.code === 'invalid-boss-plates'
      && problem.field === 'themes.bad.bossPlates'));
    assert.ok(!error.problems.some((problem) => problem.code === 'unknown-field'
      && problem.severity === 'error'), 'success path must not depend on unknown-key failures');
    return true;
  });

  const completeTheme = {
    legacyAct: { boss: 'sampleEnemy', theme: {
      sky: '#000', fog: '#111', particles: '#222', glow: '#333', accent: '#444', ember: '#555',
    } },
    plates: { background: 'theme/bg', midground: 'theme/mid', foreground: 'theme/fg' },
    atmosphere: 'ash',
    weather: { kind: 'ash', intensity: 1 }, palette: { accent: 'accent', haze: 'haze' },
    music: { map: 'map', combat: 'combat', boss: 'combat', victory: 'combat' },
    roster: { normal: ['sampleEnemy'], elite: [], boss: ['sampleEnemy'] },
    encounters: { weak: [['sampleEnemy']], normal: [['sampleEnemy']], elite: [['sampleEnemy']], boss: [['sampleEnemy']] },
    rewardGold: { normal: [10, 20], elite: [10, 20], boss: [10, 20] },
    mapHaze: 'haze', lanternLights: [], bossPlates: {},
  };
  const completePack = definePack({
    id: 'complete',
    player: { id: 'aspectA', hp: 10, gold: 0, deck: ['sampleCard'] },
    shop: { cardCount: 1, relicCount: 1, potionCount: 1 },
    cards: sample.cards, statuses: {}, relics: {}, potions: {}, enemies: sample.enemies,
    events: {}, omens: {}, affixes: {}, arts: {}, deeds: {}, quests: {}, variants: {},
    shadeKits: {}, boons: {}, themes: { actOne: completeTheme },
    aspects: [{ id: 'aspectA', hp: 10 }], vows: [], questIds: [],
    progression: { revealThresholds: {}, poolWaves: { define: { core: { cards: ['sampleCard'], relics: [] } }, extend: {} }, features: {} },
  });
  const completeLocale = {
    cards: {
      sampleCard: { name: 'Sample', text: 'Deal @1@ damage.', textUp: 'Deal @2@ damage.' },
    },
    enemies: sampleLocale.enemies,
    acts: [{ name: 'The Sample', bossName: 'Sample Enemy', tagline: 'Optional words' }],
    aspects: { aspectA: { name: 'Aspect A', blurb: 'An aspect.' } }, whispers: ['A whisper.'],
  };
  const resources = {
    ...STATIC_REFERENCE_CATALOGUES,
    vfxIds: new Set([...STATIC_REFERENCE_CATALOGUES.vfxIds, 'slash']),
    musicIds: new Set([...STATIC_REFERENCE_CATALOGUES.musicIds, 'combat']),
    tokenIds: new Set([...STATIC_REFERENCE_CATALOGUES.tokenIds, 'accent', 'haze']),
    assetManifest: new Set(['theme/bg', 'theme/mid', 'theme/fg']),
  };
  assert.throws(() => createContentContext([sample], {
    id: 'incomplete', resources, localeContent: sampleLocale, localeToken: 'en',
  }), /player|themes/i);
  const context = createContentContext([completePack], {
    id: 'fixture-context', resources, localeContent: completeLocale, localeToken: 'en',
  });
  assert.equal(context.contextVersion, 1);
  assert.deepEqual(context.packIds, ['complete']);
  assert.equal(context.cards.sampleCard.name, 'Sample');
  assert.equal(context.acts[0].name, 'The Sample');
  assert.equal(context.acts[0].theme.sky, '#000');
  assert.deepEqual(context.encounters, [{
    weak: [['sampleEnemy']], normal: [['sampleEnemy']], elite: [['sampleEnemy']], boss: [['sampleEnemy']],
  }]);
  assert.deepEqual(context.rewardGold, [{ normal: [10, 20], elite: [10, 20], boss: [10, 20] }]);
  assert.equal(context.themes.actOne.id, 'actOne');
  assert.deepEqual(context.cardPools.common, ['sampleCard']);
  assert.equal(context.poolGate.cards.sampleCard, 'core');
  assert.deepEqual(context.reveals, []);
  assert.deepEqual(context.whispers, ['A whisper.']);
  assert.equal(themeById(context, 'actOne'), context.themes.actOne);
  assert.equal(themeById(context, 'missing'), null);
  assert.equal(themeForAct(context, 0), context.themes.actOne);
  assert.equal(themeForAct(context, -1), null);
  assert.equal(registryIsFinalTheme(context, 0), true);
  assert.equal(registryIsFinalTheme(context, 1), false);
  assert.throws(() => { context.quests.extra = {}; }, TypeError);
  assert.throws(() => createContentContext([completePack], {
    id: '', resources, localeContent: completeLocale, localeToken: 'en',
  }), /non-empty|id/i);
  assert.throws(() => createContentContext([completePack], {
    id: 'no-locale', resources, localeContent: {}, localeToken: '',
  }), /locale/i);

  const revealPack = definePack({
    id: 'reveal-order',
    player: completePack.player, shop: completePack.shop, cards: completePack.cards,
    statuses: {}, relics: {}, potions: {}, enemies: completePack.enemies, events: {},
    omens: {}, affixes: {}, arts: {}, deeds: {}, quests: {}, variants: {}, shadeKits: {},
    boons: {}, themes: completePack.themes, aspects: completePack.aspects, vows: [],
    questIds: [],
    progression: {
      revealThresholds: { firstGate: { runsPlayed: 1 }, secondGate: { runsPlayed: 2 } },
      poolWaves: { define: { firstGate: { cards: ['sampleCard'], relics: [] } }, extend: {} },
      features: {},
    },
  });
  const revealContext = createContentContext([revealPack], {
    id: 'reveal-context', resources, localeContent: completeLocale, localeToken: 'en',
  });
  assert.deepEqual(revealContext.reveals.map((row) => row.id), ['firstGate', 'secondGate']);
  assert.equal(revealContext.reveals[0].trigger, revealContext.progression.revealThresholds.firstGate);

  assert.deepEqual(joinLocaleContent([
    { cards: { a: { name: 'A' } }, whispers: ['one'] },
    { cards: { b: { name: 'B' } }, whispers: ['two'] },
  ]), { cards: { a: { name: 'A' }, b: { name: 'B' } }, whispers: ['one', 'two'] });

  const bootWithoutAssets = createContentContext([completePack], {
    id: 'boot-no-assets',
    resources: { ...resources, assetManifest: new Set() },
    localeContent: completeLocale, localeToken: 'en',
  });
  assert.equal(bootWithoutAssets.themes.actOne.plates.background, 'theme/bg',
    'missing raster inventory is not a production-boot error');

  const badVfxPack = definePack({
    id: 'bad-vfx',
    player: completePack.player, shop: completePack.shop,
    cards: { badVfxCard: {
      type: 'attack', rarity: 'common', cost: 1, target: 'enemy', vfx: 'not-a-vfx',
      effects: [{ kind: 'dmg', n: 1 }],
    } },
    statuses: {}, relics: {}, potions: {}, enemies: completePack.enemies, events: {},
    omens: {}, affixes: {}, arts: {}, deeds: {}, quests: {}, variants: {}, shadeKits: {},
    boons: {}, themes: completePack.themes, aspects: completePack.aspects, vows: [],
    questIds: [],
    progression: completePack.progression,
  });
  const badVfxLocale = {
    ...completeLocale,
    cards: { badVfxCard: { name: 'Bad', text: 'Bad.' } },
  };
  let bootVfxProblem = null;
  try {
    createContentContext([badVfxPack], {
      id: 'bad-vfx-boot', resources, localeContent: badVfxLocale, localeToken: 'en',
    });
  } catch (error) {
    bootVfxProblem = error.problems.find((problem) => problem.code === 'unknown-vfx-id');
  }
  assert.ok(bootVfxProblem, 'boot rejects unknown card VFX');
  const doctorVfxReport = doctorContent([badVfxPack], {
    ...resources, localeContent: badVfxLocale, localeToken: 'en',
  });
  const doctorVfxProblem = doctorVfxReport.problems.find((problem) => problem.code === 'unknown-vfx-id');
  assert.ok(doctorVfxProblem, 'doctor rejects unknown card VFX');
  assert.equal(bootVfxProblem.field, doctorVfxProblem.field);
  assert.equal(bootVfxProblem.code, doctorVfxProblem.code);
  assert.equal(bootVfxProblem.field, 'cards.badVfxCard.vfx');

  const doctorReport = doctorContent([completePack], {
    ...resources, localeContent: completeLocale, localeToken: 'en', assetManifest: new Set(),
  });
  assert.equal(doctorReport.ok, false);
  assert.ok(doctorReport.problems.every((problem) => problem.code && problem.severity
    && problem.packId && problem.domain && problem.entryId && problem.field
    && problem.expected && problem.actual && problem.hint));
  assert.ok(doctorReport.problems.some((problem) => problem.code === 'asset-missing'
    && problem.field.includes('themes.actOne.plates')));
  assert.equal(doctorReport.domains.themes.entries.find((entry) => entry.id === 'actOne').badges.art.status,
    'missing', 'art badge is missing when asset refs fail the supplied manifest');
  assert.equal(doctorReport.domains.cards.entries.find((entry) => entry.id === 'sampleCard').badges.art.status,
    'not-applicable', 'art badge is not-applicable when an entry has no asset refs');
  const doctorArtComplete = doctorContent([completePack], {
    ...resources, localeContent: completeLocale, localeToken: 'en',
  });
  assert.equal(doctorArtComplete.domains.themes.entries.find((entry) => entry.id === 'actOne').badges.art.status,
    'complete', 'art badge is complete when assetManifest is supplied and every ref resolves');
  assert.equal(doctorArtComplete.domains.cards.entries.find((entry) => entry.id === 'sampleCard').badges.art.status,
    'not-applicable');

  const relicPack = definePack({
    id: 'relic-locale-gap',
    player: completePack.player, shop: completePack.shop, cards: completePack.cards,
    statuses: {}, relics: { gapRelic: { rarity: 'common', glyph: '◆', tone: 'ash' } },
    potions: {}, enemies: completePack.enemies, events: {}, omens: {}, affixes: {}, arts: {},
    deeds: {}, quests: {}, variants: {}, shadeKits: {}, boons: {}, themes: completePack.themes,
    aspects: completePack.aspects, vows: [], questIds: [], progression: completePack.progression,
  });
  const relicLocaleGap = doctorContent([relicPack], {
    ...resources, localeContent: completeLocale, localeToken: 'en',
  });
  assert.ok(relicLocaleGap.problems.some((problem) => problem.code === 'locale-field-missing'
    && problem.field === 'relics.gapRelic.name'),
  'schema-driven locale coverage reports exact-path locale-field-missing');
  assert.ok(relicLocaleGap.problems.some((problem) => problem.code === 'locale-field-missing'
    && problem.field === 'relics.gapRelic.text'));
  assert.equal(relicLocaleGap.domains.relics.entries.find((entry) => entry.id === 'gapRelic').badges.locale.status,
    'missing', 'missing required locale-owned fields prevent a false locale: complete badge');
  const actsWithoutTagline = {
    ...completeLocale,
    acts: [{ name: 'The Sample', bossName: 'Sample Enemy' }],
  };
  assert.doesNotThrow(() => createContentContext([completePack], {
    id: 'optional-tagline', resources, localeContent: actsWithoutTagline, localeToken: 'en',
  }), 'optional tagline remains optional');

  const progressionMergeDoctor = doctorContent([
    coreProgression,
    definePack({
      id: 'dup-progression-threshold',
      progression: {
        revealThresholds: { poolWave2: { runsPlayed: 9 } },
        poolWaves: { define: {}, extend: {} },
        features: {},
      },
    }),
  ], { ...resources, localeContent: completeLocale, localeToken: 'en' });
  assert.ok(progressionMergeDoctor.domains.progression.problems.some((problem) =>
    problem.severity === 'error'
    && problem.code === 'duplicate-progression-threshold'
    && problem.entryId === 'poolWave2'),
  'progression domain surfaces merge errors whose entryId is a threshold id');
  const progressionEntry = progressionMergeDoctor.domains.progression.entries
    .find((entry) => entry.id === 'progression');
  assert.ok(progressionEntry, 'progression inventory is a synthetic singleton row');
  assert.equal(progressionEntry.complete, false,
    'progression entry is incomplete when a merge problem uses a non-matching entryId');
  assert.ok(progressionEntry.problems.some((problem) => problem.code === 'duplicate-progression-threshold'
    && problem.entryId === 'poolWave2'),
  'unmatched progression problems fold into the synthetic progression entry');
  assert.equal(progressionMergeDoctor.domains.progression.complete, 0,
    'domain complete count is not falsely green when progression has errors');

  const orphanActsLocale = {
    ...completeLocale,
    acts: [
      { name: 'The Sample', bossName: 'Sample Enemy', tagline: 'Optional words' },
      { name: 'Orphan Act', bossName: 'Nobody', tagline: 'Extra' },
    ],
  };
  const orphanActsDoctor = doctorContent([completePack], {
    ...resources, localeContent: orphanActsLocale, localeToken: 'en',
  });
  assert.ok(orphanActsDoctor.problems.some((problem) => problem.code === 'orphan-locale-entry'
    && problem.domain === 'themes'
    && problem.field === 'acts.1'
    && problem.entryId === '1'),
  'extra localeContent.acts rows report orphan-locale-entry like other domains');

  assert.deepEqual(Object.keys(doctorReport.domains).sort(), Object.keys(MERGE_POLICIES).sort());
  for (const domain of Object.values(doctorReport.domains)) {
    for (const entry of domain.entries) {
      assert.deepEqual(Object.keys(entry.badges).sort(), ['art', 'audio', 'charMeta', 'locale', 'pool', 'vfx']);
      assert.ok(entry.links.gallery && entry.links.lab);
    }
  }
  const formatted = formatContentReport(doctorReport);
  assert.equal(typeof formatted, 'string');
  assert.match(formatted, /cards|themes/);

  const registration = defineContentRegistration({
    id: 'core-registration', mechanics: completePack,
    locales: { en: completeLocale }, targets: { production: 0, development: 0 },
  });
  assert.deepEqual(Object.keys(registration), ['id', 'mechanics', 'locales', 'targets']);
  assert.ok(Object.isFrozen(registration.targets));
  for (const bad of [
    { id: 'no-en', mechanics: completePack, locales: {}, targets: { production: 0 } },
    { id: 'empty-en', mechanics: completePack, locales: { en: {} }, targets: { production: 0 } },
    { id: 'bad-locale', mechanics: completePack, locales: { '': completeLocale, en: completeLocale }, targets: { production: 0 } },
    { id: 'bad-target', mechanics: completePack, locales: { en: completeLocale }, targets: { production: -1 } },
    { id: 'unknown-target', mechanics: completePack, locales: { en: completeLocale }, targets: { mystery: 0 } },
  ]) assert.throws(() => defineContentRegistration(bad), /locale|target|English|en/i);

  const fixturePack = definePack({ id: 'fixture-pack', cards: { fixtureCard: {
    type: 'skill', rarity: 'common', cost: 0, target: 'self', vfx: 'slash', effects: [],
  } } });
  const fixtureRegistration = defineContentRegistration({
    id: 'fixture-registration', mechanics: fixturePack,
    locales: { en: { cards: { fixtureCard: { name: 'Fixture', text: 'Fixture.', textUp: 'Fixture+' } } } },
    targets: { development: 1, fixture: 1 },
  });
  const manifest = Object.freeze({
    version: 1, target: 'development',
    registrations: Object.freeze([registration, fixtureRegistration]),
    provenance: Object.freeze([
      { id: registration.id, sourcePath: 'src/packs/core/registration.js' },
      { id: fixtureRegistration.id, sourcePath: 'src/packs/_sample/registration.js' },
    ]),
  });
  let createContextCalls = 0;
  const compiled = compileContentRegistrations(manifest, {
    id: 'compiled', resources, localeToken: 'en', fixtures: ['fixture-registration'],
    createContext: (...args) => {
      createContextCalls += 1;
      return createContentContext(...args);
    },
  });
  assert.equal(createContextCalls, 1, 'compileContentRegistrations invokes createContentContext exactly once');
  assert.deepEqual(compiled.context.packIds, ['complete', 'fixture-pack']);
  assert.equal(compiled.context.cards.fixtureCard.name, 'Fixture');
  assert.deepEqual(compiled.provenance.registrationIds, ['core-registration', 'fixture-registration']);
  assert.throws(() => compileContentRegistrations({
    version: 1, target: 'production', registrations: [registration],
  }, {
    id: 'production-fixtures', resources, localeToken: 'en', fixtures: ['fixture-registration'],
  }), /production.*fixture|fixture selection/i);
  assert.throws(() => compileContentRegistrations(manifest, {
    id: 'missing-fixture', resources, localeToken: 'en', fixtures: ['absent'],
  }), /fixture.*absent|absent.*fixture/i);
  assert.throws(() => compileContentRegistrations({ ...manifest, registrations: [registration, registration] }, {
    id: 'duplicate-registration', resources, localeToken: 'en', fixtures: [],
  }), /duplicate registration/i);
  const duplicateMechanics = defineContentRegistration({
    id: 'other-registration', mechanics: completePack, locales: { en: completeLocale }, targets: { development: 2 },
  });
  assert.throws(() => compileContentRegistrations({ ...manifest, registrations: [registration, duplicateMechanics] }, {
    id: 'duplicate-mechanics', resources, localeToken: 'en', fixtures: [],
  }), /duplicate mechanics|complete/i);
  const sameOrder = defineContentRegistration({
    id: 'same-order', mechanics: fixturePack, locales: { en: completeLocale }, targets: { development: 0 },
  });
  assert.throws(() => compileContentRegistrations({ ...manifest, registrations: [registration, sameOrder] }, {
    id: 'duplicate-order', resources, localeToken: 'en', fixtures: [],
  }), /order|duplicate/i);
  const replacement = defineContentRegistration({
    id: fixtureRegistration.id, mechanics: definePack({ id: 'fixture-replacement' }),
    locales: { en: { cards: { replacement: { name: 'Replacement' } } } },
    targets: fixtureRegistration.targets,
  });
  const replacedManifest = withContentRegistration(manifest, replacement);
  assert.equal(replacedManifest.registrations.length, manifest.registrations.length);
  assert.equal(replacedManifest.registrations[1].mechanics.id, 'fixture-replacement');
  assert.deepEqual(replacedManifest.registrations.map((row) => row.id), manifest.registrations.map((row) => row.id));
  assert.throws(() => withContentRegistration(manifest,
    defineContentRegistration({ id: 'new', mechanics: fixturePack, locales: { en: completeLocale }, targets: { development: 3 } })),
  /replace|existing/i);
  const registrationDoctor = doctorContentRegistrations(manifest, {
    id: 'doctor', resources: { ...resources, assetManifest: new Set() }, localeToken: 'en', fixtures: ['fixture-registration'],
  });
  assert.ok(registrationDoctor.report && registrationDoctor.provenance);

  const tempRoot = mkdtempSync(join(tmpdir(), 'glassvow-content-registrations-'));
  try {
    const sourceRoot = join(tempRoot, 'src', 'packs');
    mkdirSync(join(sourceRoot, 'core'), { recursive: true });
    mkdirSync(join(sourceRoot, 'expansion'), { recursive: true });
    mkdirSync(join(sourceRoot, '_sample'), { recursive: true });
    writeFileSync(join(sourceRoot, 'core', 'registration.js'), 'export default { id: "core", mechanics: { id: "core-pack" }, locales: { en: { cards: { core: { name: "Core" } } } }, targets: { production: 0 } };\n');
    writeFileSync(join(sourceRoot, 'expansion', 'registration.js'), 'export default { id: "expansion", mechanics: { id: "expansion-pack" }, locales: { en: { cards: { expansion: { name: "Expansion" } } } }, targets: { production: 1, development: 1 } };\n');
    writeFileSync(join(sourceRoot, '_sample', 'registration.js'), 'export default { id: "sample", mechanics: { id: "sample-pack" }, locales: { en: { cards: { sample: { name: "Sample" } } } }, targets: { development: 2, fixture: 2 } };\n');
    const discovered = await discoverContentRegistrations(sourceRoot);
    assert.deepEqual(discovered.map((row) => row.registration.id), ['core', 'expansion', 'sample']);
    const productionSource = renderContentRegistrationManifest(discovered, 'production');
    assert.match(productionSource, /core\/registration\.js/);
    assert.match(productionSource, /expansion\/registration\.js/);
    assert.doesNotMatch(productionSource, /_sample|sample\/registration\.js/);
    assert.ok(productionSource.endsWith('\n'));
    assert.equal(productionSource, renderContentRegistrationManifest(discovered, 'production'));
    const developmentSource = renderContentRegistrationManifest(discovered, 'development');
    assert.match(developmentSource, /core\/registration\.js/,
      'development manifest includes production-base registrations even without a development target key');
    assert.match(developmentSource, /expansion\/registration\.js/);
    assert.match(developmentSource, /_sample\/registration\.js/);
    assert.ok(developmentSource.indexOf('core/registration.js')
      < developmentSource.indexOf('_sample/registration.js'));
    const fixtureSource = renderContentRegistrationManifest(discovered, 'fixture');
    assert.match(fixtureSource, /core\/registration\.js/);
    assert.match(fixtureSource, /expansion\/registration\.js/);
    assert.match(fixtureSource, /_sample\/registration\.js/);
    assert.doesNotMatch(fixtureSource, new RegExp(tempRoot.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));
  } finally {
    rmSync(tempRoot, { recursive: true, force: true });
  }
}

// ---- Task 13: fourth-theme registry + theme-music combat cues --------------
{
  const sampleEnemy = { hp: [8, 8], facets: 1, art: { kind: 'wisp' }, moves: { wait: { intent: 'block', block: 1 } }, ai: (_ctx) => 'wait' };
  const sampleCard = {
    type: 'attack', rarity: 'common', cost: 1, target: 'enemy', vfx: 'slash',
    effects: [{ kind: 'dmg', n: 1 }],
  };
  const baseTheme = {
    legacyAct: { boss: 'sampleEnemy', theme: {
      sky: 1, fog: 2, particles: 3, glow: 4, accent: '#444', ember: '#555',
    } },
    plates: { backdrop: 'theme/bg', mid: 'theme/mid', ledge: 'theme/fg' },
    atmosphere: 'ash',
    weather: { rate: 1, colors: ['#fff'], vx: [0, 1], vy: [1, 2], size: [1, 2], drift: 0.1, emberRate: 0.1 },
    palette: { tint: 'gold', glow: 'gold', haze: 'text-dim' },
    music: { map: 'map', combat: 'combat', boss: 'combat', victory: 'victory' },
    roster: { normal: ['sampleEnemy'], elite: [], boss: ['sampleEnemy'] },
    encounters: { weak: [['sampleEnemy']], normal: [['sampleEnemy']], elite: [['sampleEnemy']], boss: [['sampleEnemy']] },
    rewardGold: { normal: [1, 1], elite: [1, 1], boss: [1, 1] },
    mapHaze: 'text-dim', lanternLights: [], bossPlates: {},
  };
  const fourThemes = {
    actOne: baseTheme,
    actTwo: { ...baseTheme, atmosphere: 'mire', music: { map: 'map', combat: 'shadeDuel', boss: 'usurper', victory: 'victory' }, rewardGold: { normal: [2, 2], elite: [2, 2], boss: [2, 2] } },
    actThree: { ...baseTheme, atmosphere: 'astral', music: { map: 'map', combat: 'eighthOmen', boss: 'sealedDoor', victory: 'victory' }, rewardGold: { normal: [3, 3], elite: [3, 3], boss: [3, 3] } },
    // Explicit astral with ash-like falling vy — prove atmosphere wins over heuristic.
    sampleTheme: {
      ...baseTheme,
      atmosphere: 'astral',
      weather: { ...baseTheme.weather, vy: [10, 26] },
      music: { map: 'map', combat: 'paleOnes', boss: 'usurper', victory: 'victory' },
      rewardGold: { normal: [4, 4], elite: [4, 4], boss: [4, 4] },
    },
  };
  const fourPack = definePack({
    id: 'four-theme',
    player: { id: 'aspectA', hp: 10, gold: 0, deck: ['sampleCard'] },
    shop: { cardCount: 1, relicCount: 1, potionCount: 1 },
    cards: { sampleCard }, statuses: {}, relics: {}, potions: {},
    enemies: { sampleEnemy }, events: {}, omens: {}, affixes: {}, arts: {}, deeds: {},
    quests: {}, variants: {}, shadeKits: {}, boons: {}, themes: fourThemes,
    aspects: [{ id: 'aspectA', hp: 10 }], vows: [], questIds: [],
    progression: { revealThresholds: {}, poolWaves: { define: { core: { cards: ['sampleCard'], relics: [] } }, extend: {} }, features: {} },
  });
  const fourLocale = {
    cards: { sampleCard: { name: 'Sample', text: 'Deal @1@ damage.' } },
    enemies: { sampleEnemy: { name: 'Sample Enemy', moves: { wait: { name: 'Wait' } } } },
    acts: [
      { name: 'One', bossName: 'B1', tagline: 't' },
      { name: 'Two', bossName: 'B2', tagline: 't' },
      { name: 'Three', bossName: 'B3', tagline: 't' },
      { name: 'Sample', bossName: 'Sample Enemy', tagline: 'fourth' },
    ],
    aspects: { aspectA: { name: 'Aspect A', blurb: 'An aspect.' } }, whispers: ['A whisper.'],
  };
  const fourResources = {
    ...STATIC_REFERENCE_CATALOGUES,
    vfxIds: new Set([...STATIC_REFERENCE_CATALOGUES.vfxIds, 'slash']),
    musicIds: new Set([...STATIC_REFERENCE_CATALOGUES.musicIds, 'combat']),
    assetManifest: new Set(['theme/bg', 'theme/mid', 'theme/fg']),
  };
  const four = createContentContext([fourPack], {
    id: 'four-theme-context', resources: fourResources, localeContent: fourLocale, localeToken: 'en',
  });
  assert.equal(themeForAct(four, 3).id, 'sampleTheme');
  assert.deepEqual(four.rewardGold[3], { normal: [4, 4], elite: [4, 4], boss: [4, 4] });
  assert.equal(registryIsFinalTheme(four, 3), true);
  assert.equal(registryIsFinalTheme(four, 2), false);
  // Atmosphere comes from the theme record, not weather.vy heuristics.
  assert.equal(resolveAtmosphere(themeForAct(four, 3)), 'astral');
  assert.equal(resolveAtmosphere({ weather: { vy: [10, 26] } }), 'ash', 'vy-only fallback still works');
  const themeMusic = { combat: 'paleOnes', boss: 'usurper' };
  assert.equal(resolveCombatCue('monster', themeMusic), 'paleOnes');
  assert.equal(resolveCombatCue('boss', themeMusic), 'usurper');
  assert.equal(resolveCombatCue('elite', themeMusic), 'elite');

  assert.deepEqual(CORE_CONTENT.themeOrder, ['act1', 'act2', 'act3']);
  assert.deepEqual(
    CORE_CONTENT.themeOrder.map((id) => CORE_CONTENT.themes[id].atmosphere),
    ['ash', 'mire', 'astral'],
  );
  for (const themeId of CORE_CONTENT.themeOrder) {
    const theme = CORE_CONTENT.themes[themeId];
    assert.equal(theme.id, themeId);
    for (const key of [
      'legacyAct', 'plates', 'atmosphere', 'weather', 'palette', 'music', 'roster', 'encounters',
      'rewardGold', 'mapHaze', 'lanternLights', 'bossPlates',
    ]) assert.ok(Object.hasOwn(theme, key), `core theme ${themeId} missing ${key}`);
    assert.equal(resolveAtmosphere(theme), theme.atmosphere);
    assert.equal(typeof theme.music.map, 'string');
    assert.equal(typeof theme.music.combat, 'string');
    assert.equal(typeof theme.music.boss, 'string');
    assert.equal(typeof theme.music.victory, 'string');
    assert.ok(theme.roster.normal && theme.roster.elite && theme.roster.boss);
    assert.ok(!Object.hasOwn(theme.legacyAct, 'name'));
    assert.ok(!Object.hasOwn(theme.legacyAct, 'bossName'));
  }
  assert.equal(ACTS.length, 3);
  assert.equal(ENCOUNTERS.length, 3);
  assert.equal(REWARD_GOLD.length, 3);
  assert.deepEqual(REWARD_GOLD, CORE_CONTENT.rewardGold);
  assert.deepEqual(ENCOUNTERS, CORE_CONTENT.encounters);

  const {
    BASE_COLOUR, BASE_TYPE, BASE_EASING, TOKEN_IDS, createExperienceTokens,
    cssVariables, applyExperienceTokens, UI_TOKENS,
  } = await import('../src/ui/tokens.js');
  assert.ok(TOKEN_IDS.has('gold'));
  assert.equal(BASE_COLOUR.gold, UI_TOKENS.gold);
  assert.ok(BASE_TYPE['font-body']);
  assert.ok(BASE_EASING['ease-out-soft']);
  const tokens = createExperienceTokens({ gold: '#f2c14e', 'ease-out-soft': BASE_EASING['ease-out-soft'] });
  assert.deepEqual(cssVariables(tokens)['--r5-gold'], '#f2c14e');
  const fakeRoot = { style: { props: Object.create(null), setProperty(k, v) { this.props[k] = v; } } };
  applyExperienceTokens(fakeRoot, tokens);
  assert.equal(fakeRoot.style.props['--r5-gold'], '#f2c14e');
  const cssText = readFileSync(new URL('../src/styles.css', import.meta.url), 'utf8');
  for (const banned of ['#f4e7c5', '#ece7df', '#aaa6b8', '#8fd0ff']) {
    assert.ok(!cssText.includes(banned), `styles.css must not embed Round 5 raw literal ${banned}`);
  }
}

// ---- Task 14: isolated sample pack + fourth-theme fixture -------------------
{
  const sha256 = (value) => createHash('sha256').update(value).digest('hex');
  const projectRoot = fileURLToPath(new URL('..', import.meta.url));

  assert.equal(Object.hasOwn(CORE_CONTENT.cards, 'sampleCard'), false);
  assert.equal(Object.hasOwn(CORE_CONTENT.enemies, 'sampleEnemy'), false);
  assert.equal(Object.hasOwn(CORE_CONTENT.themes, 'sampleTheme'), false);
  assert.equal(CORE_CONTENT.acts.length, 3);
  assert.equal(ACTS.length, 3);

  const coreOnly = createDevRegistry({ fixtures: [] });
  assert.deepEqual(coreOnly.context.packIds, ['core']);
  assert.deepEqual(coreOnly.context.themeOrder, ['act1', 'act2', 'act3']);
  assert.equal(Object.hasOwn(coreOnly.context.cards, 'sampleCard'), false);
  assert.deepEqual(coreOnly.provenance.registrationIds, ['core']);

  const sampleReg = createDevRegistry({ fixtures: ['sample'] });
  assert.equal(sampleReg.context.id, 'dev:_sample');
  assert.deepEqual(sampleReg.context.packIds, ['core', 'sample']);
  assert.deepEqual(sampleReg.provenance.registrationIds, ['core', 'sample']);
  assert.ok(sampleReg.context.cards.sampleCard);
  assert.ok(sampleReg.context.enemies.sampleEnemy);
  assert.ok(sampleReg.context.themes.sampleTheme);
  assert.equal(sampleReg.context.themeOrder.at(-1), 'sampleTheme');
  assert.equal(sampleReg.context.acts.length, 4);
  assert.equal(sampleReg.context.acts[3].name, 'Test Gallery');
  assert.equal(sampleReg.context.acts[3].bossName, 'Test Pane');
  assert.deepEqual(sampleReg.context.rewardGold[3], { normal: [1, 1], elite: [1, 1], boss: [1, 1] });
  assert.equal(sampleReg.context.cards.sampleCard.name, 'Test Spark');
  assert.equal(sampleReg.context.enemies.sampleEnemy.name, 'Test Pane');
  assert.equal(sampleReg.context.enemies.sampleEnemy.moves.wait.name, 'Wait');

  const sampleMusic = sampleReg.context.themes.sampleTheme.music;
  assert.equal(resolveCombatCue('monster', sampleMusic), 'paleOnes');
  assert.equal(resolveCombatCue('boss', sampleMusic), 'usurper');
  assert.equal(resolveCombatCue('elite', sampleMusic), 'elite');

  assert.throws(() => createDevRegistry({ fixtures: ['sample'], packs: [] }), /Unknown createDevRegistry option/);
  assert.throws(() => createDevRegistry({ fixtures: ['sample', 'sample'] }), /Duplicate fixture/);
  assert.throws(() => createDevRegistry({ fixtures: ['missing'] }), /Unknown fixture|absent/i);
  assert.throws(() => createDevRegistry({ fixtures: ['core'] }), /development\+fixture|lacks/i);
  const productionManifestModule = await import('../src/packs/compiled/production.js');
  assert.throws(() => compileContentRegistrations(
    productionManifestModule.CONTENT_REGISTRATION_MANIFEST,
    { id: 'prod-fixtures', fixtures: ['sample'] },
  ), /production.*fixture|fixture selection/i);

  const productionManifestSource = readFileSync(new URL('../src/packs/compiled/production.js', import.meta.url), 'utf8');
  const developmentManifestSource = readFileSync(new URL('../src/packs/compiled/development.js', import.meta.url), 'utf8');
  assert.doesNotMatch(productionManifestSource, /_sample|sample\/registration/);
  assert.match(developmentManifestSource, /_sample\/registration\.js/);
  assert.match(developmentManifestSource, /"sample"/);

  // Mechanics fixtures must not own display strings.
  for (const [label, row] of [
    ['sampleCard', sampleCard],
    ['sampleEnemy', sampleEnemy],
    ['sampleTheme', sampleTheme],
  ]) {
    const json = JSON.stringify(row);
    assert.doesNotMatch(json, /"(?:name|text|tagline|bossName|dialogue)"\s*:/,
      `${label} mechanics must not embed locale display fields`);
  }
  assert.equal(SAMPLE_PACK.cards.sampleCard.effects[0].n, 3);
  assert.equal(SAMPLE_LOCALE_EN.cards.sampleCard.name, 'Test Spark');
  assert.equal(SAMPLE_LOCALE_EN.acts.sampleTheme.name, 'Test Gallery');
  assert.deepEqual(Object.keys(SAMPLE_LOCALE_EN).sort(), [
    'acts', 'affixes', 'arts', 'aspects', 'boons', 'cards', 'deeds', 'enemies',
    'events', 'omens', 'potions', 'quests', 'relics', 'shadeKits', 'status',
    'variants', 'vows', 'whispers',
  ].sort());

  const exerciseSampleJourney = (content, seed, label) => {
    const run = newRun(seed, { ephemeral: true, content });
    assert.equal(contentIdFor(run), content.id, `${label} content id`);
    assert.equal(isEphemeralRun(run), true);
    assert.equal(themeCount(run), 4, `${label} theme count`);
    assert.ok(run.player.deck.length > 0, `${label} starter deck`);
    assert.ok(run.map?.nodes?.length > 0, `${label} map`);
    assert.equal(isFinalTheme(run), false, `${label} act 0 non-final`);
    run.act = 2;
    assert.equal(isFinalTheme(run), false, `${label} Act 3 (index 2) non-final with sample`);
    run.act = 3;
    assert.equal(isFinalTheme(run), true, `${label} theme index 3 final`);
    const enc = rollEncounter(run, 'monster', 5);
    assert.deepEqual(enc, ['sampleEnemy'], `${label} sample encounter`);
    const cb = startCombat(run, enc, 'normal');
    assert.equal(cb.enemies[0].key, 'sampleEnemy');
    assert.equal(cb.enemies[0].name, 'Test Pane');
    assert.deepEqual(EngineApi.enemyMove(cb.enemies[0]), { intent: 'block', block: 1, name: 'Wait' });
    const boss = startCombat(run, ['sampleEnemy'], 'boss');
    assert.equal(boss.enemies[0].key, 'sampleEnemy');
    assert.equal(boss.enemies[0].hp, 12);
    const spark = makeCard(run, 'sampleCard');
    assert.equal(cardData(spark, run).name, 'Test Spark');
    return run;
  };

  // Isolation in both call orders (no module-global current context).
  {
    const sampleFirst = createDevRegistry({ fixtures: ['sample'] }).context;
    const sampleRunA = exerciseSampleJourney(sampleFirst, 1401, 'sample-then-core');
    const coreRunA = newRun(1402);
    assert.equal(contentIdFor(coreRunA), 'core');
    assert.equal(themeCount(coreRunA), 3);
    assert.ok(!coreRunA.player.deck.some((id) => id === 'sampleCard'));
    coreRunA.act = 2;
    assert.equal(isFinalTheme(coreRunA), true);
    assert.equal(isEphemeralRun(coreRunA), false);
    assert.equal(contentIdFor(sampleRunA), 'dev:_sample');
    assert.equal(themeCount(sampleRunA), 4);

    const coreRunB = newRun(1403);
    const sampleSecond = createDevRegistry({ fixtures: ['sample'] }).context;
    const sampleRunB = exerciseSampleJourney(sampleSecond, 1404, 'core-then-sample');
    assert.equal(contentIdFor(coreRunB), 'core');
    assert.equal(themeCount(coreRunB), 3);
    assert.equal(contentIdFor(sampleRunB), 'dev:_sample');
  }

  // Engine-owned persistence writes are success-shaped no-ops for sample runs.
  const previousLocalStorage = globalThis.localStorage;
  const mem = new Map();
  try {
    globalThis.localStorage = {
      getItem: (key) => mem.get(key) ?? null,
      setItem: (key, value) => mem.set(key, value),
      removeItem: (key) => mem.delete(key),
    };
    const ephemeralSample = newRun(1405, {
      ephemeral: true,
      content: createDevRegistry({ fixtures: ['sample'] }).context,
    });
    assert.equal(saveRun(ephemeralSample), true);
    assert.equal(mem.size, 0);
    assert.equal(commitRunStats(ephemeralSample, true), true);
    assert.equal(mem.size, 0);
    assert.equal(recordRunEnd(ephemeralSample, false), true);
    assert.equal(mem.size, 0);
  } finally {
    globalThis.localStorage = previousLocalStorage;
  }

  // Future paired Act 4 data-drop proof (temporary tree; worktree stays clean).
  const protectedHashes = Object.freeze({
    content: sha256(readFileSync(join(projectRoot, 'src/content.js'))),
    i18n: sha256(readFileSync(join(projectRoot, 'src/i18n/index.js'))),
    i18nEn: sha256(readFileSync(join(projectRoot, 'src/i18n/en/index.js'))),
    engine: sha256(readFileSync(join(projectRoot, 'src/engine.js'))),
    actCoupling: sha256(spawnSync('npm', ['run', '-s', 'test:act-coupling'], {
      cwd: projectRoot, encoding: 'utf8',
    }).stdout || ''),
  });
  const tempRoot = mkdtempSync(join(tmpdir(), 'glassvow-act4-drop-'));
  try {
    const tempSrc = join(tempRoot, 'src');
    cpSync(join(projectRoot, 'src'), tempSrc, { recursive: true });
    const packsRoot = join(tempSrc, 'packs');
    const productionPath = join(packsRoot, 'compiled/production.js');
    const developmentPath = join(packsRoot, 'compiled/development.js');
    const productionBefore = sha256(readFileSync(productionPath));
    const developmentBefore = sha256(readFileSync(developmentPath));

    const act4Dir = join(packsRoot, '_act4_drop');
    mkdirSync(act4Dir, { recursive: true });
    writeFileSync(join(act4Dir, 'theme.js'), `export const act4Theme = {
  legacyAct: { boss: 'rootheart', theme: {
    sky: 1, fog: 2, particles: 3, glow: 4, accent: '#111', ember: '#222',
  } },
  plates: { backdrop: 'act1-backdrop', mid: 'act1-mid', ledge: 'act1-ledge' },
  atmosphere: 'mire',
  weather: { rate: 1, colors: ['#aaa'], vx: [0, 1], vy: [1, 2], size: [1, 2], drift: 0.1, emberRate: 0.1 },
  palette: { tint: 'good', glow: 'gold', haze: 'text-dim' },
  music: { map: 'map', combat: 'shadeDuel', boss: 'sealedDoor', victory: 'victory' },
  roster: { normal: ['sporeling'], elite: [], boss: ['rootheart'] },
  encounters: { weak: [['sporeling']], normal: [['sporeling']], elite: [['sporeling']], boss: [['rootheart']] },
  rewardGold: { normal: [9, 9], elite: [9, 9], boss: [9, 9] },
  mapHaze: 'text-dim', lanternLights: [], bossPlates: {},
};
`);
    writeFileSync(join(act4Dir, 'locale-en.js'), `export const ACT4_LOCALE_EN = {
  cards: {}, status: {}, relics: {}, potions: {}, arts: {}, boons: {},
  enemies: {}, events: {}, omens: {}, affixes: {},
  acts: { act4: { name: 'The Fourth Climb', bossName: 'The Fourth Keeper', tagline: 'Paired drop.' } },
  aspects: {}, vows: {}, deeds: {}, quests: {}, whispers: [], variants: {}, shadeKits: {},
};
`);
    writeFileSync(join(act4Dir, 'index.js'), `import { definePack } from '../../registry.js';
import { act4Theme } from './theme.js';
export const ACT4_PACK = definePack({ id: 'act4', themes: { act4: act4Theme } });
`);
    writeFileSync(join(act4Dir, 'registration.js'), `import { defineContentRegistration } from '../../content-registration.js';
import { ACT4_PACK } from './index.js';
import { ACT4_LOCALE_EN } from './locale-en.js';
export default defineContentRegistration({
  id: 'act4',
  mechanics: ACT4_PACK,
  locales: { en: ACT4_LOCALE_EN },
  targets: { production: 3, development: 3, fixture: 3 },
});
`);

    await compileRegistrationFiles({
      sourceRoot: packsRoot,
      outputs: { production: productionPath, development: developmentPath },
    });
    const productionAfterDrop = readFileSync(productionPath, 'utf8');
    const developmentAfterDrop = readFileSync(developmentPath, 'utf8');
    assert.match(productionAfterDrop, /_act4_drop\/registration\.js/);
    assert.doesNotMatch(productionAfterDrop, /_sample/);
    assert.match(developmentAfterDrop, /_act4_drop\/registration\.js/);
    assert.match(developmentAfterDrop, /_sample\/registration\.js/);

    const prodManifest = (await import(`${pathToFileURL(productionPath).href}?drop=${Date.now()}`))
      .CONTENT_REGISTRATION_MANIFEST;
    const prodCompiled = compileContentRegistrations(prodManifest, {
      id: 'production-act4', resources: STATIC_REFERENCE_CATALOGUES, localeToken: 'en',
    });
    assert.deepEqual(prodCompiled.provenance.registrationIds, ['core', 'act4']);
    assert.deepEqual(prodCompiled.context.themeOrder, ['act1', 'act2', 'act3', 'act4']);
    assert.equal(prodCompiled.context.themeOrder.at(-1), 'act4');
    assert.equal(registryIsFinalTheme(prodCompiled.context, 3), true);
    assert.deepEqual(prodCompiled.context.rewardGold[3], { normal: [9, 9], elite: [9, 9], boss: [9, 9] });
    assert.equal(prodCompiled.context.acts[3].name, 'The Fourth Climb');
    assert.equal(prodCompiled.context.acts[3].bossName, 'The Fourth Keeper');
    assert.equal(prodCompiled.context.acts[3].tagline, 'Paired drop.');

    const devManifest = (await import(`${pathToFileURL(developmentPath).href}?drop=${Date.now() + 1}`))
      .CONTENT_REGISTRATION_MANIFEST;
    assert.deepEqual(devManifest.provenance.map((row) => row.id), ['core', 'act4', 'sample']);
    const devCompiled = compileContentRegistrations(devManifest, {
      id: 'dev-act4-sample', resources: STATIC_REFERENCE_CATALOGUES, localeToken: 'en',
      fixtures: ['sample'],
    });
    assert.deepEqual(devCompiled.provenance.registrationIds, ['core', 'act4', 'sample']);
    assert.deepEqual(devCompiled.context.themeOrder, ['act1', 'act2', 'act3', 'act4', 'sampleTheme']);
    assert.equal(devCompiled.context.themes.sampleTheme.name, 'Test Gallery');
    assert.equal(devCompiled.context.acts[4].name, 'Test Gallery');
    const dropSampleRun = newRun(1410, { ephemeral: true, content: devCompiled.context });
    dropSampleRun.act = 4;
    assert.equal(isFinalTheme(dropSampleRun), true);
    assert.deepEqual(rollEncounter(dropSampleRun, 'monster', 5), ['sampleEnemy']);

    const walk = (dir, base = dir) => {
      const out = [];
      for (const entry of readdirSync(dir, { withFileTypes: true })) {
        const full = join(dir, entry.name);
        const rel = full.slice(base.length + 1).split('\\').join('/');
        if (entry.isDirectory()) out.push(...walk(full, base));
        else out.push(rel);
      }
      return out;
    };
    const originalPackFiles = new Set(walk(join(projectRoot, 'src/packs')).map((p) => `packs/${p}`));
    const tempPackFiles = walk(packsRoot).map((p) => `packs/${p}`);
    const delta = tempPackFiles.filter((p) => !originalPackFiles.has(p)
      && p !== 'packs/compiled/production.js'
      && p !== 'packs/compiled/development.js');
    assert.ok(delta.every((p) => p.startsWith('packs/_act4_drop/')),
      `unexpected pack delta outside _act4_drop: ${delta.join(',')}`);
    assert.ok(delta.some((p) => p.endsWith('registration.js')));

    assert.equal(sha256(readFileSync(join(projectRoot, 'src/content.js'))), protectedHashes.content);
    assert.equal(sha256(readFileSync(join(projectRoot, 'src/i18n/index.js'))), protectedHashes.i18n);
    assert.equal(sha256(readFileSync(join(projectRoot, 'src/i18n/en/index.js'))), protectedHashes.i18nEn);
    assert.equal(sha256(readFileSync(join(projectRoot, 'src/engine.js'))), protectedHashes.engine);

    rmSync(act4Dir, { recursive: true, force: true });
    await compileRegistrationFiles({
      sourceRoot: packsRoot,
      outputs: { production: productionPath, development: developmentPath },
    });
    assert.equal(sha256(readFileSync(productionPath)), productionBefore,
      'production manifest returns to baseline after Act 4 removal');
    assert.equal(sha256(readFileSync(developmentPath)), developmentBefore,
      'development manifest returns to baseline after Act 4 removal');
    const restoredDev = (await import(`${pathToFileURL(developmentPath).href}?restored=${Date.now()}`))
      .CONTENT_REGISTRATION_MANIFEST;
    const restored = compileContentRegistrations(restoredDev, {
      id: 'dev-restored', resources: STATIC_REFERENCE_CATALOGUES, localeToken: 'en',
      fixtures: ['sample'],
    });
    assert.deepEqual(restored.context.themeOrder, ['act1', 'act2', 'act3', 'sampleTheme']);
    exerciseSampleJourney(restored.context, 1411, 'post-act4-removal');
  } finally {
    rmSync(tempRoot, { recursive: true, force: true });
  }

  assert.equal(sha256(readFileSync(join(projectRoot, 'src/content.js'))), protectedHashes.content);
  assert.equal(sha256(readFileSync(join(projectRoot, 'src/i18n/index.js'))), protectedHashes.i18n);
  assert.equal(sha256(readFileSync(join(projectRoot, 'src/i18n/en/index.js'))), protectedHashes.i18nEn);
  assert.equal(sha256(readFileSync(join(projectRoot, 'src/engine.js'))), protectedHashes.engine);
  assert.equal(sha256(spawnSync('npm', ['run', '-s', 'test:act-coupling'], {
    cwd: projectRoot, encoding: 'utf8',
  }).stdout || ''), protectedHashes.actCoupling);

  assert.doesNotMatch(
    readFileSync(join(projectRoot, 'src/packs/compiled/production.js'), 'utf8'),
    /_act4_drop|_sample/,
  );
}

// ---- Task 15: aggregate P2 registry equivalence / doctor / freeze ----------
{
  const sha256 = (value) => createHash('sha256').update(value).digest('hex');
  const projectRoot = fileURLToPath(new URL('..', import.meta.url));
  const assetsRoot = join(projectRoot, 'src', 'assets');

  const walkAssetKeys = (dir, out = []) => {
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
      const path = join(dir, entry.name);
      if (entry.isDirectory()) walkAssetKeys(path, out);
      else if (/\.(png|jpg|jpeg|webp)$/i.test(entry.name)) {
        const rel = path.slice(assetsRoot.length + 1).split(/[/\\]/).join('/');
        const slash = rel.indexOf('/');
        if (slash > 0) {
          const category = rel.slice(0, slash);
          const id = rel.slice(slash + 1).replace(/\.(png|jpg|jpeg|webp)$/i, '');
          out.push(`${category}/${id}`);
        }
      }
    }
    return out;
  };

  const resourceManifest = {
    assetManifest: new Set(walkAssetKeys(assetsRoot)),
    vfxIds: new Set(VFX_IDS),
    characterKindIds: new Set(CHARACTER_KIND_IDS),
    fallbackIds: new Set(STRUCTURAL_FALLBACK_IDS),
    musicIds: new Set(MUSIC_CATALOG.map(({ id }) => id)),
    sfxIds: new Set(SFX_CATALOG.map(({ id }) => id)),
    tokenIds: new Set(UI_TOKEN_IDS),
    // Documented default-fallback: missing CHAR_META keys use CHAR_*_DEFAULT.
    charMetaIds: new Set(Object.keys(CHAR_META)),
    charMetaDefaultFallback: true,
  };

  assert.deepEqual([...resourceManifest.vfxIds].sort(), [...STATIC_REFERENCE_CATALOGUES.vfxIds].sort());
  assert.deepEqual([...resourceManifest.characterKindIds].sort(), [...STATIC_REFERENCE_CATALOGUES.characterKindIds].sort());
  assert.deepEqual([...resourceManifest.fallbackIds].sort(), [...STATIC_REFERENCE_CATALOGUES.fallbackIds].sort());
  assert.deepEqual([...resourceManifest.musicIds].sort(), [...STATIC_REFERENCE_CATALOGUES.musicIds].sort());
  assert.deepEqual([...resourceManifest.sfxIds].sort(), [...STATIC_REFERENCE_CATALOGUES.sfxIds].sort());
  assert.deepEqual([...resourceManifest.tokenIds].sort(), [...STATIC_REFERENCE_CATALOGUES.tokenIds].sort());

  const productionManifestModule = await import('../src/packs/compiled/production.js');
  const PRODUCTION_CONTENT_REGISTRATION_MANIFEST = productionManifestModule.CONTENT_REGISTRATION_MANIFEST;
  const doctorResources = { ...STATIC_REFERENCE_CATALOGUES, ...resourceManifest };
  const registrationDoctor = doctorContentRegistrations(PRODUCTION_CONTENT_REGISTRATION_MANIFEST, {
    resources: doctorResources, localeToken: 'en',
  });
  assert.equal(registrationDoctor.report.ok, true, 'production doctor has zero errors');
  assert.equal(registrationDoctor.report.summary.errors, 0);
  assert.equal(registrationDoctor.report.problems.some((p) => p.code === 'asset-missing'), false,
    'production doctor has zero asset-missing with filesystem assetManifest');
  for (const [domain, row] of Object.entries(registrationDoctor.report.domains)) {
    assert.equal(row.complete, row.total, `domain ${domain} complete === total`);
  }
  for (const entry of registrationDoctor.report.domains.themes.entries) {
    assert.equal(entry.badges.art.status, 'complete',
      `theme ${entry.id} art badge is complete when plates resolve against assetManifest`);
  }
  const formattedDoctor = formatContentReport(registrationDoctor.report);
  assert.match(formattedDoctor, /^content: ok/);
  console.log(formattedDoctor.trimEnd());

  const expectedExports = [
    'PLAYER', 'ACTS', 'CARDS', 'CARD_POOLS', 'STATUS_INFO', 'RELICS', 'RELIC_POOLS', 'POTIONS',
    'ENEMIES', 'ENCOUNTERS', 'EVENTS', 'REWARD_GOLD', 'SHOP', 'OMENS', 'AFFIXES', 'ARTS', 'DEEDS',
    'PROGRESSION', 'REVEALS', 'POOL_GATE', 'QUEST_IDS', 'WHISPERS', 'QUESTS', 'SHADE_KITS',
    'VARIANTS', 'ASPECTS', 'VOWS', 'BOONS',
    'QUEST_STATES', 'QUEST_ACTIVE_STATES', 'TERMINAL_OUTCOMES', 'RUN_ID_RE',
  ];
  assert.deepEqual([...CONTENT_EXPORT_NAMES, ...PROTOCOL_EXPORT_NAMES], expectedExports);
  assert.equal(expectedExports.length, 32);
  const dataNamespace = await import('../src/data.js');
  for (const name of expectedExports) {
    assert.ok(Object.hasOwn(dataNamespace, name), `data.js exports ${name}`);
  }
  assert.deepEqual(QUEST_STATES, ['dormant', 'armed', 'revealed', 'complete']);
  assert.deepEqual(QUEST_ACTIVE_STATES, ['armed', 'revealed']);
  assert.deepEqual(TERMINAL_OUTCOMES, ['win', 'death', 'abandon']);
  assert.equal(RUN_ID_RE.source, dataNamespace.RUN_ID_RE.source);
  assert.equal(RUN_ID_RE.flags, dataNamespace.RUN_ID_RE.flags);
  for (const domain of Object.keys(CORE_CONTENT)) {
    assert.ok(!PROTOCOL_EXPORT_NAMES.includes(domain), `protocol ${domain} is not a pack domain`);
  }
  assert.equal(Object.hasOwn(CORE_CONTENT, 'QUEST_STATES'), false);
  assert.equal(Object.hasOwn(CORE_CONTENT, 'RUN_ID_RE'), false);

  for (const schema of Object.values(CONTENT_SCHEMAS)) {
    for (const [fieldName, field] of Object.entries(schema.fields || {})) {
      assert.ok(field.source === 'pack' || field.source === 'locale',
        `schema field ${fieldName} source must be pack|locale`);
    }
  }
  for (const [domain, row] of Object.entries(registrationDoctor.report.domains)) {
    for (const entry of row.entries) {
      if (entry.badges.locale.status !== 'not-applicable') {
        assert.equal(entry.badges.locale.status, 'complete',
          `${domain}.${entry.id} locale badge`);
      }
      if (['cards', 'relics'].includes(domain)) {
        assert.equal(entry.badges.pool.status, 'complete',
          `${domain}.${entry.id} pool membership or schema no-pool`);
      }
    }
  }

  // Task 15 three-leg golden equality (Task 12A shape) + Task 10 catalogue legs.
  const oracle = JSON.parse(readFileSync(new URL('./fixtures/round5-content-oracle-v1.json', import.meta.url), 'utf8'));
  const liveOracle = await captureLiveContentOracle();
  assert.deepEqual(liveOracle.contentExports, oracle.contentExports);
  assert.deepEqual(liveOracle.protocolExports, oracle.protocolExports);
  assert.deepEqual(liveOracle.enemyAi, oracle.enemyAi);
  assert.deepEqual(liveOracle.shadeAi, oracle.shadeAi);
  assert.deepEqual(liveOracle.rawMechanics, oracle.rawMechanics);
  assert.deepEqual(liveOracle.i18n, oracle.i18n);
  assert.equal(liveOracle.monteCarlo.sha256, oracle.monteCarlo.sha256);
  assert.equal(Object.keys(oracle.i18n.domains).length, 18);
  assert.equal(Object.keys(liveOracle.i18n.domains).length, 18);
  assert.deepEqual(Object.keys(liveOracle.i18n.domains).sort(), Object.keys(oracle.i18n.domains).sort());
  assert.equal(liveOracle.i18n.catalogueSha256, oracle.i18n.catalogueSha256);
  assert.match(oracle.i18n.catalogueSha256, /^[a-f0-9]{64}$/);
  assert.equal(oracle.rawMechanics.value.CARDS.strike.name, undefined);
  assert.equal(oracle.rawMechanics.value.CARDS.strike.type, CARDS.strike.type);
  assert.ok(oracle.rawMechanics.mechanicsPaths.includes('CARDS.strike.type'));
  assert.ok(oracle.rawMechanics.localeOwnedPaths.includes('CARDS.strike.name'));
  assert.equal(oracle.provenance.sourceSha, '9c4f7e5624b1c7eae8eb6fd3e7c27ff5ec0df5f8');
  assert.match(oracle.provenance.sourceTree, /^[a-f0-9]{40}$/);
  assert.throws(() => definePack({ id: 'p2-locale-leak', cards: {
    leak: { type: 'attack', rarity: 'common', cost: 1, target: 'enemy', vfx: 'slash', effects: [], name: 'Leak' },
  } }), /locale.field.in.pack|source.*locale/i);

  assert.equal(getLocale(), 'en');
  const i18nApis = ['getContent', 'getLocale', 'hydrateContent', 'lookup', 'registerLocale', 'setLocale', 't'];
  const i18nModule = await import('../src/i18n/index.js');
  assert.deepEqual(Object.keys(i18nModule).filter((k) => i18nApis.includes(k)).sort(), i18nApis.sort());
  assert.equal(i18nModule.setLocale('zz'), false);
  assert.equal(getLocale(), 'en');
  assert.equal(PLAYER.name, getContent().aspects.duskblade.name);
  assert.equal(ASPECTS[0], PLAYER);

  // No save key/shape change vs the 9c4f7e5 contract.
  const engineSource = readFileSync(join(projectRoot, 'src/engine.js'), 'utf8');
  assert.match(engineSource, /const SAVE_KEY = 'spirebound_save_v2'/);
  assert.match(engineSource, /const STATS_KEY = 'spirebound_stats_v1'/);
  assert.match(readFileSync(join(projectRoot, 'src/vigil.js'), 'utf8'), /spirebound_vigil_v2/);
  assert.doesNotMatch(engineSource, /spirebound_save_v3/);
  assert.doesNotMatch(engineSource, /localStorage\.setItem\([^)]*contentId/);

  const coreAccessors = descriptorInventory({ CORE_CONTENT }).accessors;
  assert.deepEqual(coreAccessors, [], 'core context has no schema-visible accessors');
  assert.equal(Object.isFrozen(CORE_CONTENT), true);
  assert.throws(() => { CORE_CONTENT.themeOrder.push('x'); }, TypeError);
  assert.equal(CORE_CONTENT.quests.hollowLamplighter.target, 5,
    'materialised Hollow target retains Phase 2 numeric value');
  const hollowDesc = Object.getOwnPropertyDescriptor(CORE_CONTENT.quests.hollowLamplighter, 'target');
  assert.equal(hollowDesc.get, undefined);
  assert.equal(hollowDesc.value, 5);

  const authoringSnap = createCoreAuthoring();
  authoringSnap.cards.strike.cost = 99;
  assert.equal(CORE_CONTENT.cards.strike.cost, CARDS.strike.cost);
  assert.notEqual(CORE_CONTENT.cards.strike.cost, 99);

  const tuned = makeTunedContent({}, 'p2-tuned', (authoring) => {
    authoring.progression.features.emberglass.hollowLamplighter.completeAt = 5;
  });
  assert.equal(tuned.quests.hollowLamplighter.target, 5);
  assert.equal(Object.isFrozen(tuned), true);
  const coreRun = newRun(1501);
  const sampleReg = createDevRegistry({ fixtures: ['sample'] });
  const sampleRun = newRun(1502, { ephemeral: true, content: sampleReg.context });
  assert.equal(contentIdFor(coreRun), 'core');
  assert.equal(contentIdFor(sampleRun), 'dev:_sample');
  assert.equal(themeCount(coreRun), 3);
  assert.equal(themeCount(sampleRun), 4);
  assert.equal(isEphemeralRun(sampleRun), true);
  assert.equal(isEphemeralRun(coreRun), false);
  assert.equal(Object.hasOwn(CORE_CONTENT.cards, 'sampleCard'), false,
    'P2 equivalence is not claimed from an assembly-only sample');

  // Sample locale badges complete via development+fixture doctor.
  const developmentManifestModule = await import('../src/packs/compiled/development.js');
  const sampleDoctor = doctorContentRegistrations(
    developmentManifestModule.CONTENT_REGISTRATION_MANIFEST,
    { resources: doctorResources, localeToken: 'en', fixtures: ['sample'] },
  );
  assert.equal(sampleDoctor.report.ok, true, 'sample/dev doctor has zero errors');
  for (const [domain, row] of Object.entries(sampleDoctor.report.domains)) {
    for (const entry of row.entries) {
      if (entry.badges.locale.status !== 'not-applicable') {
        assert.equal(entry.badges.locale.status, 'complete',
          `sample ${domain}.${entry.id} locale badge`);
      }
    }
  }
  assert.ok(sampleDoctor.report.domains.cards.entries.some((e) => e.id === 'sampleCard'));
  assert.ok(sampleDoctor.report.domains.themes.entries.some((e) => e.id === 'sampleTheme'));
  assert.deepEqual(Object.keys(SAMPLE_LOCALE_EN).sort(), [
    'acts', 'affixes', 'arts', 'aspects', 'boons', 'cards', 'deeds', 'enemies',
    'events', 'omens', 'potions', 'quests', 'relics', 'shadeKits', 'status',
    'variants', 'vows', 'whispers',
  ].sort());

  // Task 12B: tuned high/low save-validation projections.
  {
    const high = makeTunedContent({
      progression: { features: { emberglass: {
        paleOnes: { hiddenPerRun: 2 },
        eighthOmen: { guaranteeRuns: 4, saveDueInMax: 4 },
        hollowLamplighter: { emberDebt: 4, saveEmberDebtMax: 4, maxMeetingsPerRun: 2 },
        unreadablePage: { completeAt: 6 },
      } } },
    }, 'p2-tuned-high');
    const low = makeTunedContent({
      progression: { features: { emberglass: {
        paleOnes: { hiddenPerRun: 1 },
        eighthOmen: { guaranteeRuns: 1, saveDueInMax: 2 },
        hollowLamplighter: { emberDebt: 2, saveEmberDebtMax: 3, maxMeetingsPerRun: 1 },
      } } },
    }, 'p2-tuned-low');
    const prevLs = globalThis.localStorage;
    const mem = new Map();
    try {
      globalThis.localStorage = {
        getItem: (key) => mem.get(key) ?? null,
        setItem: (key, value) => mem.set(key, value),
        removeItem: (key) => mem.delete(key),
      };
      const questSet = (activeId) => Object.fromEntries(QUEST_IDS.map((id) => [id, {
        state: id === activeId ? 'revealed' : 'dormant', progress: 0, memory: {},
      }]));
      const historicalQuests = questSet('paleOnes');
      historicalQuests.hollowLamplighter = {
        state: 'revealed', progress: 1, memory: { eligibleMisses: 0 },
      };
      const historical = newRun(1510, { content: high, quests: historicalQuests, reveals: [] });
      historical.questScratch.hollowLamplighter = {
        due: true, met: true, meetings: 2, debtActive: false,
      };
      assert.equal(saveRun(historical), true);
      const durable = JSON.parse(mem.get('spirebound_save_v2'));
      const reloaded = _normaliseRunSnapshotForTest(durable, low);
      assert.ok(reloaded, 'lower tuning accepts historical scheduler counters');
      assert.equal(contentIdFor(reloaded), 'p2-tuned-low');
      assert.equal(reloaded.questScratch.paleOnes.hiddenRemaining, 2);
      assert.equal(reloaded.questScratch.hollowLamplighter.meetings, 2);
      const dynamic = newRun(1511, { content: high });
      dynamic.quests.eighthOmen = { state: 'armed', progress: 0, memory: { dueIn: 4 } };
      dynamic.quests.hollowLamplighter = { state: 'revealed', progress: 0, memory: { emberDebt: 4 } };
      dynamic.endQueue = [{ t: 'pageRead', index: 6, text: 'A sixth configured page.' }];
      assert.equal(saveRun(dynamic), true);
      assert.ok(_normaliseRunSnapshotForTest(JSON.parse(mem.get('spirebound_save_v2')), high),
        'high tuning accepts configured guarantee/debt/Page target');
      const excessiveDebt = structuredClone(dynamic);
      excessiveDebt.quests.hollowLamplighter.memory.emberDebt =
        high.progression.emberglass.hollowLamplighter.saveEmberDebtMax + 1;
      assert.equal(_normaliseRunSnapshotForTest(excessiveDebt, low), null,
        'tuned normaliser rejects above-ceiling ember debt');
    } finally {
      if (prevLs) globalThis.localStorage = prevLs;
      else delete globalThis.localStorage;
    }
  }

  // CORE_CONTENT compiled with static catalogues only (no filesystem assetManifest).
  assert.deepEqual(_CORE_CONTENT_PROVENANCE.registrationIds, ['core']);
  assert.equal(Object.hasOwn(STATIC_REFERENCE_CATALOGUES, 'assetManifest'), false);
  const contentSource = readFileSync(join(projectRoot, 'src/content.js'), 'utf8');
  assert.match(contentSource, /STATIC_REFERENCE_CATALOGUES/);
  assert.doesNotMatch(contentSource, /assetManifest/);

  // Negative: unknown VFX + unknown music share stable code/entry/field across boot+doctor.
  const coreRegistration = (await import('../src/packs/core/registration.js')).default;
  const corePack = coreRegistration.mechanics;
  const coreLocale = coreRegistration.locales.en;
  const orphanLocale = {
    ...coreLocale,
    acts: { ...coreLocale.acts, orphanAct: { name: 'Orphan', bossName: 'Nobody', tagline: 'Extra' } },
  };
  const orphanDoctor = doctorContent([corePack], {
    ...STATIC_REFERENCE_CATALOGUES, localeContent: orphanLocale, localeToken: 'en',
  });
  assert.ok(orphanDoctor.problems.some((p) => p.code === 'orphan-locale-entry'),
    'orphan locale rows are reported');
  const negAuthoring = createCoreAuthoring();
  negAuthoring.cards.strike = { ...negAuthoring.cards.strike, vfx: 'not-a-live-vfx' };
  negAuthoring.themes.act1 = {
    ...negAuthoring.themes.act1,
    music: { ...negAuthoring.themes.act1.music, combat: 'not-a-live-cue' },
  };
  const badPack = definePack({ id: 'p2-neg-vfx-music', ...negAuthoring });
  let bootProblems = [];
  try {
    createContentContext([badPack], {
      id: 'p2-neg', resources: STATIC_REFERENCE_CATALOGUES, localeContent: coreLocale, localeToken: 'en',
    });
  } catch (error) {
    bootProblems = error.problems || [];
  }
  const doctorNeg = doctorContent([badPack], {
    ...STATIC_REFERENCE_CATALOGUES, localeContent: coreLocale, localeToken: 'en',
  });
  for (const code of ['unknown-vfx-id', 'unknown-music-id']) {
    const bootHit = bootProblems.find((p) => p.code === code);
    const doctorHit = doctorNeg.problems.find((p) => p.code === code);
    assert.ok(bootHit, `boot reports ${code}`);
    assert.ok(doctorHit, `doctor reports ${code}`);
    assert.equal(bootHit.field, doctorHit.field);
    assert.equal(bootHit.entryId, doctorHit.entryId);
    assert.equal(bootHit.code, doctorHit.code);
  }
  assert.equal(CONTENT_SCHEMAS.cards.fields.vfx.reference, 'vfx-id');
  assert.equal(CONTENT_SCHEMAS.themes.fields.music.kind, 'object');
  assert.equal(CONTENT_SCHEMAS.themes.fields.music.reference, 'music-id',
    'Manager schema music reference kind matches VFX-style music-id');

  // Neither schema nor UI modules carry an independent id enum.
  const registrySource = readFileSync(join(projectRoot, 'src/registry.js'), 'utf8');
  assert.doesNotMatch(registrySource, /(?:VFX_IDS|MUSIC_CATALOG|CHARACTER_KIND_IDS)\s*=/);
  assert.doesNotMatch(registrySource, /new Set\(\[\s*['\"]slash['\"]/);
  for (const rel of ['src/ui/assets.js', 'src/ui/content.js', 'src/ui/context.js']) {
    const src = readFileSync(join(projectRoot, rel), 'utf8');
    assert.doesNotMatch(src, /(?:const|let|var)\s+(?:VFX_IDS|MUSIC_IDS|CHARACTER_KIND_IDS)\s*=/,
      `${rel} must not define an independent id enum`);
  }

  // Negative: missing raster is doctor-only; runtime boot fallback remains valid.
  const missingAssetDoctor = doctorContent([corePack], {
    ...STATIC_REFERENCE_CATALOGUES, localeContent: coreLocale, localeToken: 'en',
    assetManifest: new Set([...resourceManifest.assetManifest]
      .filter((key) => key !== `stage/${corePack.themes.act1.plates.backdrop}`)),
  });
  const assetProblem = missingAssetDoctor.problems.find((p) => p.code === 'asset-missing'
    && p.field === 'themes.act1.plates.backdrop');
  assert.ok(assetProblem, 'doctor reports asset-missing at exact plate path');
  assert.doesNotThrow(() => createContentContext([corePack], {
    id: 'p2-asset-boot',
    resources: { ...STATIC_REFERENCE_CATALOGUES, assetManifest: new Set() },
    localeContent: coreLocale, localeToken: 'en',
  }), 'missing raster inventory is not a createContentContext error');

  // Music contract (Task 6/13): five exports, 22 live cues, Rose/Hollow/Dawn/summit, fourth theme.
  const musicResolveSource = readFileSync(join(projectRoot, 'src/music-resolve.js'), 'utf8');
  const musicExports = [...musicResolveSource.matchAll(/^export (?:const|function) (\w+)/gm)]
    .map((m) => m[1]).sort();
  assert.deepEqual(musicExports, [
    'QUEST_COMBAT_CUES', 'SCREEN_CUES', 'dawnEventCue', 'resolveCombatCue', 'resolveScreenCue',
  ].sort());
  assert.equal(MUSIC_CATALOG.length, 22);
  assert.ok(MUSIC_CATALOG.every((row) => row.wired));
  assert.equal(QUEST_COMBAT_CUES.paleOnes, 'paleOnes');
  assert.equal(resolveCombatCue('monster', { combat: 'act1Combat' }, { questId: 'paleOnes' }), 'paleOnes');
  assert.equal(resolveCombatCue('monster', { combat: 'act1Combat' }, { omenId: 'eighthOmen' }), 'eighthOmen');
  assert.equal(resolveCombatCue('boss', { combat: 'act1Combat', boss: 'act1Boss' }, { omenId: 'eighthOmen' }), 'act1Boss');
  assert.equal(SCREEN_CUES.hollow, 'hollowLamplighter');
  assert.equal(resolveScreenCue('hollow'), 'hollowLamplighter');
  assert.equal(SCREEN_CUES.vigil, 'vigil');
  assert.equal(resolveScreenCue('vigil'), 'vigil');
  assert.ok(MUSIC_CATALOG.some((row) => row.id === 'roseWindow'), 'Rose Window cue remains live');
  assert.equal(dawnEventCue({ t: 'pageRead' }), 'unreadablePage');
  assert.equal(dawnEventCue({ t: 'act4Reveal' }), 'sealedDoor');
  assert.ok(MUSIC_CATALOG.some((row) => row.id === 'sealedDoor'), 'summit sealedDoor cue remains live');
  assert.equal(resolveScreenCue('map', 'eighthOmen'), 'eighthOmen');
  assert.equal(resolveScreenCue('reward'), null);
  assert.equal(resolveScreenCue('bossRelic'), null);
  const fourthThemeMusic = { combat: 'paleOnes', boss: 'usurper' };
  assert.equal(resolveCombatCue('monster', fourthThemeMusic), 'paleOnes');
  assert.equal(resolveCombatCue('boss', fourthThemeMusic), 'usurper');
  assert.doesNotMatch(musicResolveSource, /Math\.min\([^)]*2[^)]*\)|act\$\{|`act\$\{/);
  assert.doesNotMatch(musicResolveSource, /from ['\"]\.\/(?:audio|music|stage|ui)/);

  // Compiler freshness + paired Act-4 drop/restore (Task 14 equivalent inside aggregate).
  const checkCompile = spawnSync('npm', ['run', '-s', 'test:content-registrations'], {
    cwd: projectRoot, encoding: 'utf8',
  });
  assert.equal(checkCompile.status, 0, checkCompile.stderr || checkCompile.stdout);
  const productionBefore = sha256(readFileSync(join(projectRoot, 'src/packs/compiled/production.js')));
  const developmentBefore = sha256(readFileSync(join(projectRoot, 'src/packs/compiled/development.js')));
  assert.match(productionBefore, /^[a-f0-9]{64}$/);
  assert.match(developmentBefore, /^[a-f0-9]{64}$/);
  assert.doesNotMatch(readFileSync(join(projectRoot, 'src/packs/compiled/production.js'), 'utf8'), /_sample/);
  assert.match(readFileSync(join(projectRoot, 'src/packs/compiled/development.js'), 'utf8'), /_sample/);

  const protectedHashes = Object.freeze({
    content: sha256(readFileSync(join(projectRoot, 'src/content.js'))),
    i18n: sha256(readFileSync(join(projectRoot, 'src/i18n/index.js'))),
    i18nEn: sha256(readFileSync(join(projectRoot, 'src/i18n/en/index.js'))),
    engine: sha256(readFileSync(join(projectRoot, 'src/engine.js'))),
    actCoupling: sha256(spawnSync('npm', ['run', '-s', 'test:act-coupling'], {
      cwd: projectRoot, encoding: 'utf8',
    }).stdout || ''),
  });
  const tempRoot = mkdtempSync(join(tmpdir(), 'glassvow-t15-act4-'));
  try {
    const tempSrc = join(tempRoot, 'src');
    cpSync(join(projectRoot, 'src'), tempSrc, { recursive: true });
    const packsRoot = join(tempSrc, 'packs');
    const productionPath = join(packsRoot, 'compiled/production.js');
    const developmentPath = join(packsRoot, 'compiled/development.js');
    const act4Dir = join(packsRoot, '_act4_drop');
    mkdirSync(act4Dir, { recursive: true });
    writeFileSync(join(act4Dir, 'theme.js'), `export const act4Theme = {
  legacyAct: { boss: 'rootheart', theme: {
    sky: 1, fog: 2, particles: 3, glow: 4, accent: '#111', ember: '#222',
  } },
  plates: { backdrop: 'act1-backdrop', mid: 'act1-mid', ledge: 'act1-ledge' },
  atmosphere: 'mire',
  weather: { rate: 1, colors: ['#aaa'], vx: [0, 1], vy: [1, 2], size: [1, 2], drift: 0.1, emberRate: 0.1 },
  palette: { tint: 'good', glow: 'gold', haze: 'text-dim' },
  music: { map: 'map', combat: 'shadeDuel', boss: 'sealedDoor', victory: 'victory' },
  roster: { normal: ['sporeling'], elite: [], boss: ['rootheart'] },
  encounters: { weak: [['sporeling']], normal: [['sporeling']], elite: [['sporeling']], boss: [['rootheart']] },
  rewardGold: { normal: [9, 9], elite: [9, 9], boss: [9, 9] },
  mapHaze: 'text-dim', lanternLights: [], bossPlates: {},
};
`);
    writeFileSync(join(act4Dir, 'locale-en.js'), `export const ACT4_LOCALE_EN = {
  cards: {}, status: {}, relics: {}, potions: {}, arts: {}, boons: {},
  enemies: {}, events: {}, omens: {}, affixes: {},
  acts: { act4: { name: 'The Fourth Climb', bossName: 'The Fourth Keeper', tagline: 'Paired drop.' } },
  aspects: {}, vows: {}, deeds: {}, quests: {}, whispers: [], variants: {}, shadeKits: {},
};
`);
    writeFileSync(join(act4Dir, 'index.js'), `import { definePack } from '../../registry.js';
import { act4Theme } from './theme.js';
export const ACT4_PACK = definePack({ id: 'act4', themes: { act4: act4Theme } });
`);
    writeFileSync(join(act4Dir, 'registration.js'), `import { defineContentRegistration } from '../../content-registration.js';
import { ACT4_PACK } from './index.js';
import { ACT4_LOCALE_EN } from './locale-en.js';
export default defineContentRegistration({
  id: 'act4',
  mechanics: ACT4_PACK,
  locales: { en: ACT4_LOCALE_EN },
  targets: { production: 3, development: 3, fixture: 3 },
});
`);
    await compileRegistrationFiles({
      sourceRoot: packsRoot,
      outputs: { production: productionPath, development: developmentPath },
    });
    const productionAfterDrop = readFileSync(productionPath, 'utf8');
    const developmentAfterDrop = readFileSync(developmentPath, 'utf8');
    assert.match(productionAfterDrop, /_act4_drop\/registration\.js/);
    assert.doesNotMatch(productionAfterDrop, /_sample/);
    assert.match(developmentAfterDrop, /_act4_drop\/registration\.js/);
    assert.match(developmentAfterDrop, /_sample\/registration\.js/);
    const prodManifest = (await import(`${pathToFileURL(productionPath).href}?t15drop=${Date.now()}`))
      .CONTENT_REGISTRATION_MANIFEST;
    const prodCompiled = compileContentRegistrations(prodManifest, {
      id: 't15-production-act4', resources: STATIC_REFERENCE_CATALOGUES, localeToken: 'en',
    });
    assert.deepEqual(prodCompiled.provenance.registrationIds, ['core', 'act4']);
    assert.deepEqual(prodCompiled.context.themeOrder, ['act1', 'act2', 'act3', 'act4']);
    assert.equal(prodCompiled.context.acts[3].name, 'The Fourth Climb');
    rmSync(act4Dir, { recursive: true, force: true });
    await compileRegistrationFiles({
      sourceRoot: packsRoot,
      outputs: { production: productionPath, development: developmentPath },
    });
    assert.equal(sha256(readFileSync(productionPath)), productionBefore,
      'production manifest returns to baseline after Act 4 removal');
    assert.equal(sha256(readFileSync(developmentPath)), developmentBefore,
      'development manifest returns to baseline after Act 4 removal');
    const restoredDev = (await import(`${pathToFileURL(developmentPath).href}?t15restored=${Date.now()}`))
      .CONTENT_REGISTRATION_MANIFEST;
    const restored = compileContentRegistrations(restoredDev, {
      id: 't15-dev-restored', resources: STATIC_REFERENCE_CATALOGUES, localeToken: 'en',
      fixtures: ['sample'],
    });
    assert.deepEqual(restored.context.themeOrder, ['act1', 'act2', 'act3', 'sampleTheme']);
  } finally {
    rmSync(tempRoot, { recursive: true, force: true });
  }
  assert.equal(sha256(readFileSync(join(projectRoot, 'src/content.js'))), protectedHashes.content);
  assert.equal(sha256(readFileSync(join(projectRoot, 'src/i18n/index.js'))), protectedHashes.i18n);
  assert.equal(sha256(readFileSync(join(projectRoot, 'src/i18n/en/index.js'))), protectedHashes.i18nEn);
  assert.equal(sha256(readFileSync(join(projectRoot, 'src/engine.js'))), protectedHashes.engine);
  const actCouplingAfter = spawnSync('npm', ['run', '-s', 'test:act-coupling'], {
    cwd: projectRoot, encoding: 'utf8',
  });
  assert.equal(actCouplingAfter.status, 0, actCouplingAfter.stderr || actCouplingAfter.stdout);
  assert.equal(sha256(actCouplingAfter.stdout || ''), protectedHashes.actCoupling,
    'act-coupling stdout hash unchanged through Act-4 drop/restore');
  assert.doesNotMatch(readFileSync(join(projectRoot, 'src/packs/compiled/production.js'), 'utf8'), /_act4_drop/);

  // No HMR accept on pack/locale/data/registry — edits force full-page reload.
  const noHmrPaths = [
    'src/data.js', 'src/registry.js', 'src/packs/_sample/locale-en.js',
  ];
  for (const rel of noHmrPaths) {
    assert.doesNotMatch(readFileSync(join(projectRoot, rel), 'utf8'), /import\.meta\.hot|hot\.accept/,
      `${rel} must not own an HMR accept handler`);
  }
  const walkJs = (dir, out = []) => {
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
      const path = join(dir, entry.name);
      if (entry.isDirectory()) walkJs(path, out);
      else if (entry.name.endsWith('.js')) out.push(path);
    }
    return out;
  };
  for (const path of [
    ...walkJs(join(projectRoot, 'src/packs/core')),
    ...walkJs(join(projectRoot, 'src/i18n/en')),
  ]) {
    assert.doesNotMatch(readFileSync(path, 'utf8'), /import\.meta\.hot|hot\.accept/,
      `${path} must not own an HMR accept handler`);
  }
}

// ---- Task 16A: ephemeral presentation binding + run-effects isolation -------
{
  // Re-run green Task 12B/14 engine facts against the compiled sample registry.
  // A failure here returns to P2 — do not “fix” it in UI binding.
  const sampleReg = createDevRegistry({ fixtures: ['sample'] });
  const dev = sampleReg.context;
  assert.equal(dev.id, 'dev:_sample');
  assert.equal(Object.isFrozen(dev), true);
  assert.ok(dev.cards.sampleCard);
  assert.ok(dev.enemies.sampleEnemy);
  assert.equal(dev.themeOrder.at(-1), 'sampleTheme');
  assert.doesNotMatch(
    readFileSync(new URL('../src/packs/dev.js', import.meta.url), 'utf8'),
    /CORE_PACK|SAMPLE_PACK|locale-en/,
    'Lab/dev registry must not import pack or locale fragments directly',
  );

  {
    const sampleRun = newRun(1601, { ephemeral: true, content: dev });
    assert.equal(contentIdFor(sampleRun), 'dev:_sample');
    assert.equal(isEphemeralRun(sampleRun), true);
    assert.equal(themeCount(sampleRun), 4);
    sampleRun.act = 3;
    assert.equal(isFinalTheme(sampleRun), true);
    assert.deepEqual(rollEncounter(sampleRun, 'monster', 5), ['sampleEnemy']);
    const coreRun = newRun(1602);
    assert.equal(contentIdFor(coreRun), 'core');
    assert.equal(isEphemeralRun(coreRun), false);
    assert.equal(themeCount(coreRun), 3);
  }

  // Presentation binding: bind after newRun; identity + theme resolution.
  {
    const sampleRun = newRun(1603, { ephemeral: true, content: dev });
    bindRunContent(sampleRun, dev);
    assert.equal(contentIdFor(sampleRun), 'dev:_sample');
    assert.equal(contentViewFor(sampleRun), dev);
    sampleRun.act = dev.themeOrder.indexOf('sampleTheme');
    assert.equal(themeForRun(sampleRun).id, 'sampleTheme');
    assert.ok(contentViewFor(sampleRun).cards.sampleCard);
    assert.ok(contentViewFor(sampleRun).enemies.sampleEnemy);
    assert.ok(contentViewFor(sampleRun).themes.sampleTheme);
    assert.equal(contentViewFor(sampleRun).statuses, dev.statuses);
  }

  // Non-ephemeral binding throws; normal run view is exact imported CORE_CONTENT.
  {
    const normal = newRun(1604);
    assert.throws(() => bindRunContent(normal, CORE_CONTENT), /ephemeral/i);
    assert.equal(contentViewFor(normal), CORE_CONTENT);
    assert.equal(contentViewFor(normal), UI_CORE_CONTENT);
    assert.equal(themeForRun(normal).id, CORE_CONTENT.themeOrder[0]);
  }

  // Mismatched content id rejects bind.
  {
    const sampleRun = newRun(1605, { ephemeral: true, content: dev });
    assert.throws(() => bindRunContent(sampleRun, CORE_CONTENT), /content id|mismatch/i);
  }

  // Simultaneous core/sample isolation in both call orders (presentation + engine).
  {
    const sampleA = newRun(1606, { ephemeral: true, content: dev });
    bindRunContent(sampleA, dev);
    const coreA = newRun(1607);
    assert.equal(contentViewFor(sampleA), dev);
    assert.equal(contentViewFor(coreA), CORE_CONTENT);
    assert.equal(contentIdFor(sampleA), 'dev:_sample');
    assert.equal(contentIdFor(coreA), 'core');
    sampleA.act = dev.themeOrder.indexOf('sampleTheme');
    assert.equal(themeForRun(sampleA).id, 'sampleTheme');
    assert.notEqual(themeForRun(coreA).id, 'sampleTheme');

    const coreB = newRun(1608);
    const sampleB = newRun(1609, { ephemeral: true, content: dev });
    bindRunContent(sampleB, dev);
    assert.equal(contentViewFor(coreB), CORE_CONTENT);
    assert.equal(contentViewFor(sampleB), dev);
    sampleB.act = dev.themeOrder.indexOf('sampleTheme');
    assert.equal(themeForRun(sampleB).id, 'sampleTheme');
  }

  // Ephemeral run-effects: sentinel stores stay byte-identical; success shapes.
  {
    const snap = (store) => JSON.stringify([...store.entries()].sort(([a], [b]) => (a < b ? -1 : 1)));
    const runStore = new Map();
    const statsStore = new Map();
    const vigilStore = new Map([['spirebound_vigil_v2', JSON.stringify({
      v: 2, shards: [], unlocks: [], reveals: [], news: false, bequest: null,
    })]]);
    const beforeRun = snap(runStore);
    const beforeStats = snap(statsStore);
    const beforeVigil = snap(vigilStore);

    const engine = {
      ...EngineApi,
      isEphemeralRun,
      contentIdFor,
      saveRun(run) {
        if (isEphemeralRun(run)) return true;
        runStore.set('save', JSON.stringify(run.runId));
        return true;
      },
      journalTerminalOutcome(run, outcome) {
        return EngineApi.journalTerminalOutcome(run, outcome);
      },
      finaliseTerminalOutbox(...args) { return EngineApi.finaliseTerminalOutbox(...args); },
      stagePendingDawn(run, events, unlocks) {
        runStore.set('dawn', JSON.stringify({ events, unlocks }));
        return true;
      },
      recordRunEnd(run) {
        statsStore.set('end', JSON.stringify({ id: run.runId, won: false }));
        return true;
      },
      advancePendingDawn(run, cursor) {
        runStore.set('dawnCursor', String(cursor));
        return true;
      },
      completePendingDawn(run) {
        runStore.set('dawnClear', run.runId);
        return true;
      },
      buyQuestItem(run, itemId) {
        runStore.set('buy', itemId);
        return { ok: true, reason: null };
      },
      payHollowPrice(run) {
        runStore.set('hollowPay', run.runId);
        return { ok: true, deferred: false, message: 'paid' };
      },
      stageHollowExit(run) {
        runStore.set('hollowExit', run.runId);
        return { kind: 'destination', nodeId: 'n1', type: 'shop', eventId: null };
      },
      completePendingHollowRoute(run) {
        runStore.set('hollowClear', run.runId);
        return true;
      },
      beginShadeDuel(run, clear) {
        runStore.set('shadeBegin', run.runId);
        return { status: clear() ? 'ready' : 'retry' };
      },
      resumeShadeDuel(run, clear) {
        runStore.set('shadeResume', run.runId);
        return { status: clear() ? 'ready' : 'retry' };
      },
      sealedSummitShardThreshold() { return 1; },
    };
    const vigil = {
      syncVigil() {
        vigilStore.set('sync', '1');
        return { shards: [] };
      },
      setBequest(act, row, bequest) {
        vigilStore.set('bequest', JSON.stringify({ act, row, bequest }));
        return true;
      },
      clearBequest() {
        vigilStore.set('bequest', null);
        return true;
      },
      clearNews() {
        vigilStore.set('news', 'cleared');
        return { news: false };
      },
      clearVigil() {
        vigilStore.set('cleared', '1');
        return true;
      },
      commitPendingRunEnd(run, acknowledge) {
        vigilStore.set('commit', run.runId);
        run.runEndResult = { whisper: 'x', newShards: [], vigil: { shards: [] } };
        run.vigilResult = { newUnlocks: [] };
        return {
          accepted: acknowledge(run),
          outcome: run.pendingRunEnd?.outcome || 'win',
          newUnlocks: [],
          ledger: run.runEndResult,
        };
      },
    };
    const effects = RunEffectsModule.createRunEffects({ engine, vigil });
    const ephemeral = newRun(1610, { ephemeral: true, content: dev });
    bindRunContent(ephemeral, dev);

    assert.equal(effects.saveRun(ephemeral), true);
    assert.deepEqual(effects.buyQuestItem(ephemeral, 'flamelessLantern'), { ok: true, reason: null });
    assert.deepEqual(effects.payHollowPrice(ephemeral), { ok: true, deferred: false, message: 'paid' });
    assert.ok(effects.stageHollowExit(ephemeral)?.kind);
    assert.equal(effects.completeHollowRoute(ephemeral), true);
    assert.deepEqual(effects.beginShadeDuel(ephemeral), { status: 'ready' });
    assert.deepEqual(effects.resumeShadeDuel(ephemeral), { status: 'ready' });
    assert.equal(effects.setBequest(ephemeral, 1, 2, { kind: 'gold', amount: 10 }), true);
    assert.equal(effects.clearBequest(ephemeral), true);
    assert.deepEqual(effects.journalRunEnd(ephemeral, 'win'), { outcome: 'win' });

    let finalisedCalls = 0;
    const winResult = effects.finaliseRunEnd(ephemeral, {
      revealThreshold: 1,
      persist: (action) => action(),
      onPersistenceFailure: () => assert.fail('ephemeral must not hit persistence failure'),
      onFinalised: () => { finalisedCalls++; },
    });
    assert.equal(winResult?.kind, 'lab-result');
    assert.equal(winResult.outcome, 'win');
    assert.equal(winResult.ephemeral, true);
    assert.equal(winResult.accepted, true);
    assert.equal(winResult.contentId, 'dev:_sample');
    assert.equal(Object.isFrozen(winResult), true);
    assert.equal(finalisedCalls, 0, 'Lab-result path must not enter Dawn/Fall onFinalised');

    const fallRun = newRun(1611, { ephemeral: true, content: dev });
    bindRunContent(fallRun, dev);
    effects.journalRunEnd(fallRun, 'death');
    const fallResult = effects.finaliseRunEnd(fallRun, {
      revealThreshold: 1,
      persist: (action) => action(),
      onPersistenceFailure: () => assert.fail('ephemeral fall must not persist'),
      onFinalised: () => assert.fail('ephemeral fall must not present Fall'),
    });
    assert.equal(fallResult?.kind, 'lab-result');
    assert.equal(fallResult.outcome, 'death');

    const abandonRun = newRun(1612, { ephemeral: true, content: dev });
    bindRunContent(abandonRun, dev);
    effects.journalRunEnd(abandonRun, 'abandon');
    const abandonResult = effects.finaliseRunEnd(abandonRun, {
      revealThreshold: 1,
      persist: (action) => action(),
      onPersistenceFailure: () => assert.fail('ephemeral abandon must not persist'),
      onFinalised: () => assert.fail('ephemeral abandon must not present'),
    });
    assert.equal(abandonResult?.kind, 'lab-result');
    assert.equal(abandonResult.outcome, 'abandon');

    assert.equal(effects.advanceDawn(ephemeral, 1), true);
    assert.equal(effects.completeDawn(ephemeral), true);

    assert.equal(snap(runStore), beforeRun, 'ephemeral effects must not write run-save sentinel');
    assert.equal(snap(statsStore), beforeStats, 'ephemeral effects must not write stats sentinel');
    assert.equal(snap(vigilStore), beforeVigil, 'ephemeral effects must not write Vigil sentinel');
  }

  // Normal journeys still mutate through the same adapter (post-Phase-2 order).
  {
    const calls = [];
    const engine = {
      saveRun(run) { calls.push(['saveRun', run.runId]); return true; },
      buyQuestItem(run, itemId) { calls.push(['buyQuestItem', itemId]); return { ok: true, reason: null }; },
      payHollowPrice(run) { calls.push(['payHollowPrice']); return { ok: true, deferred: false, message: 'paid' }; },
      stageHollowExit(run) { calls.push(['stageHollowExit']); return { kind: 'destination', nodeId: 'n1', type: 'shop', eventId: null }; },
      completePendingHollowRoute(run) { calls.push(['completePendingHollowRoute']); return true; },
      beginShadeDuel(run, clear) { calls.push(['beginShadeDuel']); return { status: clear() ? 'ready' : 'retry' }; },
      resumeShadeDuel(run, clear) { calls.push(['resumeShadeDuel']); return { status: clear() ? 'ready' : 'retry' }; },
      journalTerminalOutcome(run, outcome) {
        calls.push(['journalTerminalOutcome', outcome]);
        run.pendingRunEnd = { outcome };
        return run.pendingRunEnd;
      },
      stagePendingDawn(run, events, newUnlocks) {
        calls.push(['stagePendingDawn', events.map((e) => e.t), [...newUnlocks]]);
        run.pendingRunEnd = null;
        run.pendingDawn = { events, cursor: 0, newUnlocks };
        return true;
      },
      recordRunEnd(run, won) { calls.push(['recordRunEnd', won]); return true; },
      finaliseTerminalOutbox(run, persist, blocked, finalised) {
        calls.push(['finaliseTerminalOutbox']);
        const result = persist();
        if (result?.accepted !== true) { blocked(); return false; }
        finalised(result);
        return true;
      },
      advancePendingDawn(run, nextCursor) { calls.push(['advancePendingDawn', nextCursor]); return true; },
      completePendingDawn(run) { calls.push(['completePendingDawn']); return true; },
      isEphemeralRun: () => false,
      contentIdFor: () => 'core',
    };
    const vigil = {
      syncVigil() { calls.push(['syncVigil']); return { shards: [] }; },
      setBequest(act, row, bequest) { calls.push(['setBequest', act, row]); return true; },
      clearBequest() { calls.push(['clearBequest']); return true; },
      clearNews() { calls.push(['clearNews']); return { news: false }; },
      clearVigil() { calls.push(['clearVigil']); return true; },
      commitPendingRunEnd(run, acknowledge) {
        calls.push(['commitPendingRunEnd']);
        run.runEndResult = { whisper: 'ok', newShards: ['hollowLamplighter'], vigil: { shards: ['hollowLamplighter'] } };
        run.vigilResult = { newUnlocks: ['aspect2'] };
        return {
          accepted: acknowledge(run), outcome: 'win',
          newUnlocks: ['aspect2'], ledger: run.runEndResult,
        };
      },
    };
    const effects = RunEffectsModule.createRunEffects({ engine, vigil });
    const run = { runId: 'normal-16a', endQueue: [], shards: [], pendingRunEnd: null };
    assert.equal(effects.saveRun(run), true);
    assert.equal(effects.setBequest(run, 2, 7, { kind: 'gold', amount: 50 }), true);
    assert.equal(effects.clearBequest(run), true);
    effects.journalRunEnd(run, 'win');
    let completed = null;
    assert.equal(effects.finaliseRunEnd(run, {
      revealThreshold: 1,
      persist: (action) => action(),
      onPersistenceFailure: () => assert.fail('normal finalise must accept'),
      onFinalised: (result) => { completed = result; },
    }), true);
    assert.equal(completed.outcome, 'win');
    assert.ok(run.pendingDawn);
    assert.equal(effects.advanceDawn(run, 1), true);
    assert.equal(effects.completeDawn(run), true);
    assert.ok(calls.some(([name]) => name === 'commitPendingRunEnd'));
    assert.ok(calls.some(([name]) => name === 'stagePendingDawn'));
    assert.ok(calls.some(([name]) => name === 'setBequest'));
  }

  // Source: UI mutators for terminal/Vigil/stats/Dawn/Hollow/Shard/bequest live only in run-effects.
  {
    const runEffectsSource = readFileSync(new URL('../src/ui/run-effects.js', import.meta.url), 'utf8');
    const readUiOwners = (directory, prefix = '') => readdirSync(directory, { withFileTypes: true })
      .flatMap((entry) => entry.isDirectory()
        ? readUiOwners(new URL(`${entry.name}/`, directory), `${prefix}${entry.name}/`)
        : entry.name.endsWith('.js')
          ? [[`${prefix}${entry.name}`, readFileSync(new URL(entry.name, directory), 'utf8')]]
          : []);
    const uiOwnersSource = readUiOwners(new URL('../src/ui/', import.meta.url))
      .filter(([name]) => name !== 'run-effects.js')
      .map(([, source]) => source)
      .join('\n');
    for (const owner of [
      'saveRun', 'buyQuestItem', 'payHollowPrice', 'stageHollowExit', 'completePendingHollowRoute',
      'beginShadeDuel', 'resumeShadeDuel', 'journalTerminalOutcome',
      'finaliseTerminalOutbox', 'stagePendingDawn', 'advancePendingDawn', 'completePendingDawn',
      'recordRunEnd', 'commitRunStats',
    ]) {
      assert.doesNotMatch(uiOwnersSource, new RegExp(`\\bE\\.${owner}\\s*\\(`),
        `16A: ${owner} remains owned by run-effects`);
    }
    for (const owner of ['syncVigil', 'commitPendingRunEnd', 'setBequest', 'clearBequest', 'clearNews', 'clearVigil', 'commitRunEnd', 'commitRunToVigil']) {
      assert.doesNotMatch(uiOwnersSource, new RegExp(`(?<![.\\w])${owner}\\s*\\(`),
        `16A: bare ${owner} must not appear outside run-effects`);
      assert.doesNotMatch(uiOwnersSource, new RegExp(`\\bVigil\\.${owner}\\s*\\(`),
        `16A: Vigil.${owner} must not appear outside run-effects`);
    }
    assert.match(runEffectsSource, /isEphemeralRun|lab-result/,
      'run-effects must own ephemeral Lab-result suppression');
  }

  // Active-run UI modules resolve catalogues through contentViewFor; title/gallery stay core-only.
  // screens/run.js routes via themeForRun only (no catalogue table reads) — not in this list.
  {
    const CORE_CATALOGUE_ALLOWLIST = new Set([
      'index.js',
      'probe.js',
      'rose.js',
      'screens/title.js',
      'screens/gallery.js',
      'screens/audio-gallery.js',
      'screens/vigil.js',
      'screens/embark.js',
    ]);
    const ACTIVE_RUN_MODULES = [
      'assets.js', 'navigation.js', 'combat.js', 'drain.js', 'overlay.js', 'tooltip.js',
      'screens/map.js', 'screens/lamplighter.js', 'screens/reward.js',
      'screens/rest.js', 'screens/shop.js', 'screens/event.js', 'screens/end.js',
    ];
    const catalogueImport = /import\s*\{[^}]*\b(?:CARDS|RELICS|ENEMIES|POTIONS|OMENS|AFFIXES|ARTS|STATUS_INFO)\b[^}]*\}\s*from\s*['"][^'"]*data\.js['"]/;
    const readUi = (rel) => readFileSync(new URL(`../src/ui/${rel}`, import.meta.url), 'utf8');
    for (const rel of ACTIVE_RUN_MODULES) {
      const source = readUi(rel);
      assert.doesNotMatch(source, catalogueImport,
        `${rel} must not import active catalogues from data.js`);
      assert.match(source, /contentViewFor/,
        `${rel} must resolve active-run catalogues through contentViewFor`);
    }
    assert.doesNotMatch(readUi('screens/run.js'), /void\s+runCatalogues\s*\(\s*\)/,
      'run.js must not use a vacuous void runCatalogues() gate');
    assert.doesNotMatch(readUi('screens/run.js'), catalogueImport,
      'screens/run.js must not import active catalogues from data.js');
    assert.match(readUi('screens/run.js'), /themeForRun/,
      'screens/run.js resolves presentation theme through themeForRun');
    for (const rel of CORE_CATALOGUE_ALLOWLIST) {
      const source = readUi(rel);
      // Allowlist may keep CORE_CONTENT / data catalogues; must not bind sample ids.
      assert.doesNotMatch(source, /sampleCard|sampleEnemy|sampleTheme|_sample/,
        `${rel} core-only allowlist must not hard-code sample ids`);
    }
    assert.match(readUi('content.js'), /RUN_PRESENTATION_CONTENT|WeakMap/,
      'presentation binding owns a WeakMap');
    assert.match(readUi('content.js'), /bindRunContent/,
      'bindRunContent is exported from ui/content.js');
  }

  // Card presentation + scene plates must use the run-bound context (not CORE / actN defaults).
  {
    const sampleRun = newRun(1620, { ephemeral: true, content: dev });
    bindRunContent(sampleRun, dev);
    const sampleCardKey = Object.keys(dev.cards).find((id) => !Object.hasOwn(CORE_CONTENT.cards, id));
    assert.ok(sampleCardKey, 'sample registry exposes a non-core card');
    assert.equal(cardData({ id: sampleCardKey }), undefined,
      'one-arg cardData stays on CORE and cannot resolve a sample-only card');
    assert.equal(cardData({ id: sampleCardKey }, sampleRun)?.name, dev.cards[sampleCardKey].name,
      'run-bound cardData resolves the sample card through the presentation path');
    assert.equal(contentViewFor(sampleRun).cards[sampleCardKey]?.name, dev.cards[sampleCardKey].name);

    sampleRun.act = dev.themeOrder.indexOf('sampleTheme');
    const theme = themeForRun(sampleRun);
    assert.equal(theme.id, 'sampleTheme');
    assert.equal(theme.plates.backdrop, 'act1-backdrop',
      'sampleTheme reuses act1 plates — sceneBg must not invent act4-backdrop from act index');
    assert.notEqual(theme.plates.backdrop, `act${sampleRun.act + 1}-backdrop`);

    const readUi = (rel) => readFileSync(new URL(`../src/ui/${rel}`, import.meta.url), 'utf8');
    const cardPresentationFiles = [
      'tooltip.js', 'combat.js', 'overlay.js', 'screens/reward.js',
    ];
    for (const rel of cardPresentationFiles) {
      const source = readUi(rel);
      const oneArg = [...source.matchAll(/\bE\.cardData\s*\(\s*([^)]+)\s*\)/g)]
        .filter((m) => !m[1].includes(','));
      assert.equal(oneArg.length, 0,
        `16A: ${rel} must pass the active run into every E.cardData call`);
    }
    const assetsSource = readUi('assets.js');
    assert.match(assetsSource, /themeForRun/,
      'sceneBg resolves plates through themeForRun');
    assert.match(assetsSource, /plates/,
      'sceneBg reads theme.plates');
    assert.doesNotMatch(assetsSource, /act\$\{\s*\(?\s*S\.run/,
      'sceneBg must not hard-code act${n}-backdrop from the act index');
  }

  // setBequest / clearBequest require a run — omitted run must not fail open to Vigil.
  {
    const calls = [];
    const effects = RunEffectsModule.createRunEffects({
      engine: { isEphemeralRun, contentIdFor },
      vigil: {
        setBequest(...args) { calls.push(['setBequest', ...args]); return true; },
        clearBequest() { calls.push(['clearBequest']); return true; },
      },
    });
    assert.throws(() => effects.clearBequest(), /run/i);
    assert.throws(() => effects.clearBequest(null), /run/i);
    assert.throws(() => effects.setBequest(2, 7, { kind: 'gold', amount: 1 }), /run/i);
    assert.throws(() => effects.setBequest(null, 2, 7, { kind: 'gold', amount: 1 }), /run/i);
    assert.deepEqual(calls, [], 'omitted/null run must not touch Vigil bequest APIs');
  }
}

// ---- Task 16B: bounded Lab scenario / replay codecs -----------------------
{
  const core = CORE_CONTENT;
  const sampleReg = createDevRegistry({ fixtures: ['sample'] });
  const dev = sampleReg.context;

  const scenario = {
    v: 1, mode: 'combat', seed: 20260710, aspectId: 'duskblade',
    themeId: 'act1', kind: 'normal', omenId: 'thinGlass',
    enemies: [
      { id: 'sporeling', variantId: null },
      { id: 'duskfang', variantId: 'paleDuskfang' },
    ],
    deck: [{ id: 'strike', up: false }, { id: 'defend', up: false }],
    hand: [{ id: 'strike', up: false }],
  };

  // Exact round-trip against core.
  assert.deepEqual(
    validateLabScenario(decodeLabScenario(encodeLabScenario(scenario)), core),
    scenario,
  );

  // Deterministic key order: shuffled input keys still encode identically.
  const shuffled = {
    hand: scenario.hand, enemies: scenario.enemies, deck: scenario.deck,
    omenId: scenario.omenId, kind: scenario.kind, themeId: scenario.themeId,
    aspectId: scenario.aspectId, seed: scenario.seed, mode: scenario.mode, v: scenario.v,
  };
  assert.equal(encodeLabScenario(shuffled), encodeLabScenario(scenario));

  // Decoded values are deep-frozen copies.
  const decoded = decodeLabScenario(encodeLabScenario(scenario));
  assert.equal(Object.isFrozen(decoded), true);
  assert.equal(Object.isFrozen(decoded.enemies), true);
  assert.equal(Object.isFrozen(decoded.enemies[0]), true);
  assert.equal(Object.isFrozen(decoded.deck), true);
  assert.throws(() => { decoded.seed = 1; }, TypeError);
  assert.throws(() => { decoded.enemies.push({ id: 'x', variantId: null }); }, TypeError);

  // Sample scenario: passes against dev, fails against core with all unknown ids.
  const sampleScenario = {
    v: 1, mode: 'combat', seed: 20260711, aspectId: 'duskblade',
    themeId: 'sampleTheme', kind: 'normal', omenId: 'thinGlass',
    enemies: [{ id: 'sampleEnemy', variantId: null }],
    deck: [{ id: 'sampleCard', up: false }],
    hand: [{ id: 'sampleCard', up: false }],
  };
  assert.deepEqual(
    validateLabScenario(decodeLabScenario(encodeLabScenario(sampleScenario)), dev),
    sampleScenario,
  );
  let sampleVsCoreErr;
  try {
    validateLabScenario(sampleScenario, core);
  } catch (err) {
    sampleVsCoreErr = err;
  }
  assert.ok(sampleVsCoreErr, 'sample ids must fail against core');
  const reported = String(sampleVsCoreErr.message) + JSON.stringify(sampleVsCoreErr.problems || []);
  assert.match(reported, /sampleTheme/);
  assert.match(reported, /sampleEnemy/);
  assert.match(reported, /sampleCard/);

  // decodeLabScenario rejects duplicate query keys.
  const token = encodeLabScenario(scenario);
  assert.throws(() => decodeLabScenario(`scenario=${token}&scenario=${token}`), /duplicate/i);
  assert.throws(() => decodeLabScenario(`?scenario=${token}&foo=1&foo=2`), /duplicate/i);

  // Decode from a single scenario= query key works and stays frozen.
  assert.deepEqual(decodeLabScenario(`?scenario=${token}`), scenario);

  // Shape limits: >4 enemies, >60 deck, version ≠ 1, size caps.
  assert.throws(() => decodeLabScenario(encodeLabScenario({
    ...scenario,
    enemies: [1, 2, 3, 4, 5].map(() => ({ id: 'sporeling', variantId: null })),
  })), /enemies|4/i);
  assert.throws(() => decodeLabScenario(encodeLabScenario({
    ...scenario,
    deck: Array.from({ length: 61 }, () => ({ id: 'strike', up: false })),
  })), /deck|60/i);
  assert.throws(() => decodeLabScenario(encodeLabScenario({ ...scenario, v: 2 })), /version/i);

  // Oversized scenario payload (>8192 serialised bytes).
  const fatDeck = Array.from({ length: 60 }, (_, i) => ({
    id: `strike_${'x'.repeat(120)}_${i}`, up: false,
  }));
  const fatScenario = { ...scenario, deck: fatDeck };
  let fatEncoded;
  try {
    fatEncoded = encodeLabScenario(fatScenario);
  } catch (err) {
    fatEncoded = null;
    assert.match(String(err.message), /8192|size|bytes/i);
  }
  if (fatEncoded != null) {
    assert.throws(() => decodeLabScenario(fatEncoded), /8192|size|bytes/i);
  }

  // Oversized replay payload (>4096 serialised bytes).
  const fatReplay = {
    v: 1,
    kind: 'card-flight',
    subject: { kind: 'card', contentId: 'strike', upgraded: false },
    parameters: { destination: 'discard', motion: 'full', pad: 'y'.repeat(5000) },
    endState: { destination: 'discard', visible: false },
  };
  let fatReplayEncoded;
  try {
    fatReplayEncoded = encodeReplayDescriptor(fatReplay);
  } catch (err) {
    fatReplayEncoded = null;
    assert.match(String(err.message), /4096|size|bytes/i);
  }
  if (fatReplayEncoded != null) {
    assert.throws(() => decodeReplayDescriptor(fatReplayEncoded), /4096|size|bytes/i);
  }

  // decode is shape-only — does not consult imported core tables for semantic ids.
  const nonsense = {
    v: 1, mode: 'combat', seed: 1, aspectId: 'noSuchAspect',
    themeId: 'noSuchTheme', kind: 'normal', omenId: 'noSuchOmen',
    enemies: [{ id: 'noSuchEnemy', variantId: null }],
    deck: [{ id: 'noSuchCard', up: false }],
    hand: [],
  };
  assert.deepEqual(decodeLabScenario(encodeLabScenario(nonsense)), nonsense,
    'decodeLabScenario must not silently validate against core tables');

  // Replay descriptor round-trip; no commands/engine/save/DOM fields.
  const replay = {
    v: 1,
    kind: 'card-flight',
    subject: { kind: 'card', contentId: 'strike', upgraded: false },
    parameters: { destination: 'discard', motion: 'full' },
    endState: { destination: 'discard', visible: false },
  };
  assert.deepEqual(decodeReplayDescriptor(encodeReplayDescriptor(replay)), replay);
  const frozenReplay = decodeReplayDescriptor(encodeReplayDescriptor(replay));
  assert.equal(Object.isFrozen(frozenReplay), true);
  assert.throws(() => decodeReplayDescriptor(encodeReplayDescriptor({ ...replay, v: 2 })), /version/i);
  assert.throws(() => decodeReplayDescriptor(encodeReplayDescriptor({
    ...replay, command: { type: 'playCard' },
  })), /command|unknown|field/i);
  assert.throws(() => decodeReplayDescriptor(encodeReplayDescriptor({
    ...replay, engineState: {},
  })), /engine|unknown|field/i);
  assert.throws(() => decodeReplayDescriptor(encodeReplayDescriptor({
    ...replay, save: {},
  })), /save|unknown|field/i);

  // Enemy row rules: compatible variant, own-shade special case, mismatches aggregate.
  validateLabScenario({
    ...scenario,
    enemies: [{ id: 'shade', variantId: 'ownShade1' }],
  }, core);
  let variantErr;
  try {
    validateLabScenario({
      ...scenario,
      enemies: [
        { id: 'sporeling', variantId: 'paleDuskfang' },
        { id: 'duskfang', variantId: 'ownShade1' },
        { id: 'shade', variantId: 'paleDuskfang' },
      ],
    }, core);
  } catch (err) {
    variantErr = err;
  }
  assert.ok(variantErr, 'mismatched variants must fail validation');
  const variantReport = String(variantErr.message) + JSON.stringify(variantErr.problems || []);
  assert.match(variantReport, /paleDuskfang/);
  assert.match(variantReport, /ownShade1/);

  // Stage core + sample climb scenarios through newRun with aspect/omen/theme/seed parity.
  // Unknown ids fail before RNG or run mutation (validate first).
  {
    let mutated = false;
    const bogus = { ...scenario, aspectId: 'missingAspect', themeId: 'missingTheme', omenId: 'missingOmen' };
    assert.throws(() => validateLabScenario(bogus, core), /missingAspect|missingTheme|missingOmen/);
    assert.equal(mutated, false);

    const stageClimb = (raw, content) => {
      const validated = validateLabScenario(raw, content);
      const aspect = content.aspects.findIndex((row) => row.id === validated.aspectId);
      assert.ok(aspect >= 0, 'validated aspectId must resolve');
      const themeIndex = content.themeOrder.indexOf(validated.themeId);
      assert.ok(themeIndex >= 0, 'validated themeId must resolve');
      const beforeCards = [];
      const run = newRun(validated.seed, {
        aspect,
        ephemeral: true,
        content,
      });
      // aspectId selected starting aspect/deck before cards were made inside newRun.
      assert.equal(content.aspects[run.aspect].id, validated.aspectId);
      assert.deepEqual(run.player.deck.map((c) => c.id), content.aspects[aspect].startDeck);
      assert.deepEqual(beforeCards, [], 'no cards exist before newRun');
      run.act = themeIndex;
      while (run.omens.length <= themeIndex) run.omens.push(null);
      run.omens[themeIndex] = validated.omenId;
      assert.equal(run.omens[run.act], validated.omenId,
        'omenId occupies the selected act slot before combat setup');
      assert.equal(run.act, themeIndex, 'themeId selects the correct numeric act');
      run.rngState = validated.seed;
      run.map = genMap(run);
      const combatIds = validated.enemies.map((row) => row.variantId ?? row.id);
      const cb = startCombat(run, combatIds, validated.kind);
      return { run, cb, validated, combatIds };
    };

    const coreClimb = {
      v: 1, mode: 'combat', seed: 20260712, aspectId: 'ashwarden',
      themeId: 'act2', kind: 'normal', omenId: 'thinGlass',
      enemies: [
        { id: 'sporeling', variantId: null },
        { id: 'shade', variantId: 'ownShade2' },
      ],
      deck: [{ id: 'defend', up: false }],
      hand: [{ id: 'defend', up: false }],
    };
    const a = stageClimb(coreClimb, core);
    const b = stageClimb(coreClimb, core);
    assert.deepEqual(
      a.run.map.nodes.map((n) => ({ id: n.id, type: n.type, next: n.next })),
      b.run.map.nodes.map((n) => ({ id: n.id, type: n.type, next: n.next })),
      'fixed seed produces the same map on URL reload',
    );
    assert.deepEqual(a.combatIds, ['sporeling', 'ownShade2']);
    assert.equal(a.cb.enemies[0].variantId, null);
    assert.equal(a.cb.enemies[1].variantId, 'ownShade2');

    const sampleClimb = {
      v: 1, mode: 'combat', seed: 20260713, aspectId: 'duskblade',
      themeId: 'sampleTheme', kind: 'normal', omenId: 'thinGlass',
      enemies: [{ id: 'sampleEnemy', variantId: null }],
      deck: [{ id: 'sampleCard', up: false }],
      hand: [{ id: 'sampleCard', up: false }],
    };
    const s = stageClimb(sampleClimb, dev);
    assert.equal(s.run.act, dev.themeOrder.indexOf('sampleTheme'));
    assert.equal(contentIdFor(s.run), 'dev:_sample');
    assert.equal(s.cb.enemies[0].key || s.cb.enemies[0].id || s.combatIds[0], 'sampleEnemy');
  }

  // Legacy numeric opts.aspect and normal rolled-omen path retain exact parity.
  {
    const legacyA = newRun(4242, { aspect: 1 });
    const legacyB = newRun(4242, { aspect: 1 });
    assert.equal(legacyA.aspect, 1);
    assert.equal(core.aspects[legacyA.aspect].id, 'ashwarden');
    assert.deepEqual(legacyA.player.deck.map((c) => c.id), legacyB.player.deck.map((c) => c.id));
    assert.deepEqual(
      legacyA.map.nodes.map((n) => ({ id: n.id, type: n.type })),
      legacyB.map.nodes.map((n) => ({ id: n.id, type: n.type })),
    );
    const rolled = newRun(4243);
    assert.equal(rolled.omens.length >= 1, true);
    assert.ok(rolled.omens[0] == null || Object.hasOwn(core.omens, rolled.omens[0]));
  }

  // Codec module stays Node-pure (no DOM/audio/stage imports).
  {
    const source = readFileSync(new URL('../src/dev/lab-scenario.js', import.meta.url), 'utf8');
    assert.doesNotMatch(source, /from\s+['"]\.\.\/(audio|music|stage|ui)\b/);
    assert.doesNotMatch(source, /document\.|window\.|localStorage/);
  }
}


// ---- Task 19: schema-driven Content Manager serialiser ----
{
  const {
    EDITABLE_DOMAINS, EDITABLE_PACK_IDS, CONTENT_SAVE_VERSION,
    DOMAIN_MECHANICS_PATH, DOMAIN_LOCALE_PATH, DOMAIN_MECHANICS_EXPORT, DOMAIN_LOCALE_EXPORT,
    fieldOwnership, splitBySource, joinBySource,
    serializeMechanicsModule, serializeLocaleExport, applyLocaleExportToSource,
    validateContentSavePayload, materialiseOwnData,
  } = await import('../src/dev/content-serialize.js');

  assert.deepEqual([...EDITABLE_DOMAINS], ['cards', 'relics', 'potions', 'themes']);
  assert.deepEqual([...EDITABLE_PACK_IDS], ['core']);
  assert.equal(CONTENT_SAVE_VERSION, 1);
  for (const domain of EDITABLE_DOMAINS) {
    assert.match(DOMAIN_MECHANICS_PATH[domain], /^src\/packs\/core\//);
    assert.equal(DOMAIN_LOCALE_PATH[domain], 'src/i18n/en/content.js');
    assert.ok(DOMAIN_MECHANICS_EXPORT[domain]);
    assert.ok(DOMAIN_LOCALE_EXPORT[domain]);
  }
  assert.equal(DOMAIN_LOCALE_EXPORT.themes, 'acts');

  // Field ownership comes only from CONTENT_SCHEMAS (Manager/Lab/doctor share it).
  const cardFields = fieldOwnership('cards');
  assert.deepEqual(cardFields.map((f) => f.name), Object.keys(CONTENT_SCHEMAS.cards.fields));
  assert.equal(cardFields.find((f) => f.name === 'cost').source, 'pack');
  assert.equal(cardFields.find((f) => f.name === 'text').source, 'locale');
  assert.equal(cardFields.find((f) => f.name === 'name').source, 'locale');
  const themeFields = fieldOwnership('themes');
  assert.equal(themeFields.find((f) => f.name === 'tagline').source, 'locale');
  assert.equal(themeFields.find((f) => f.name === 'atmosphere').source, 'pack');

  // Lab + doctor + Manager share ordered registration provenance.
  const labProv = createDevRegistry({ fixtures: ['sample'] }).provenance;
  const doctorProv = doctorContentRegistrations(
    (await import('../src/packs/compiled/development.js')).CONTENT_REGISTRATION_MANIFEST,
    { fixtures: ['sample'] },
  ).provenance;
  assert.deepEqual(labProv.registrationIds, doctorProv.registrationIds);
  assert.deepEqual(
    labProv.registrations.map((r) => ({ id: r.id, mechanicsPackId: r.mechanicsPackId, sourcePath: r.sourcePath, targets: r.targets })),
    doctorProv.registrations.map((r) => ({ id: r.id, mechanicsPackId: r.mechanicsPackId, sourcePath: r.sourcePath, targets: r.targets })),
  );

  // Joined round-trip for a card.
  const strikeJoined = {
    type: 'attack', rarity: 'starter', cost: 1, target: 'enemy', vfx: 'slash',
    effects: [{ kind: 'dmg', n: 6 }],
    up: { effects: [{ kind: 'dmg', n: 9 }] },
    name: 'Edge', text: 'Deal @6@ damage.', textUp: 'Deal @9@ damage.',
  };
  const splitCard = splitBySource('cards', strikeJoined);
  assert.equal(splitCard.mechanics.name, undefined);
  assert.equal(splitCard.mechanics.text, undefined);
  assert.equal(splitCard.display.name, 'Edge');
  assert.equal(splitCard.mechanics.cost, 1);
  assert.deepEqual(joinBySource('cards', splitCard.mechanics, splitCard.display), strikeJoined);

  // Theme round-trip (locale lives under acts indices, mechanics under theme ids).
  const themeJoined = {
    atmosphere: 'ash', mapHaze: 'text-dim', lanternLights: [], bossPlates: {},
    legacyAct: { boss: 'rootheart', theme: { sky: 1, fog: 2, particles: 3, glow: 4, accent: '#a', ember: '#b' } },
    plates: { backdrop: 'a', mid: 'b', ledge: 'c' },
    weather: { rate: 1 }, palette: { tint: 'good' }, music: { map: 'map' },
    roster: { normal: [], elite: [], boss: [] },
    encounters: { weak: [], strong: [], elite: [], boss: [] },
    rewardGold: { combat: [10, 20], elite: [30, 40], boss: [50, 60], treasure: [5, 10] },
    name: 'The Ashen Woods', bossName: 'The Rootheart', tagline: 'optional',
  };
  const splitTheme = splitBySource('themes', themeJoined);
  assert.equal(splitTheme.display.name, 'The Ashen Woods');
  assert.equal(splitTheme.mechanics.name, undefined);
  assert.equal(splitTheme.mechanics.atmosphere, 'ash');
  assert.deepEqual(joinBySource('themes', splitTheme.mechanics, splitTheme.display), themeJoined);

  // Unknown non-function extension: warn, preserve byte-for-byte across serialise→parse→serialise.
  const withExt = {
    type: 'attack', rarity: 'common', cost: 1, target: 'enemy', vfx: 'slash', effects: [],
    customExt: 42,
    name: 'X', text: 'Y',
  };
  const splitExt = splitBySource('cards', withExt);
  assert.equal(splitExt.mechanics.customExt, 42);
  assert.ok(splitExt.warnings.some((w) => /customExt|unknown/i.test(w)));
  const order = ['extCard'];
  const mechMod = serializeMechanicsModule('cards', { extCard: splitExt.mechanics }, { order });
  assert.equal(mechMod.endsWith('\n'), true);
  assert.equal(mechMod.endsWith('\n\n'), false);
  const locMod = serializeLocaleExport('cards', { extCard: splitExt.display }, { order });
  assert.equal(locMod.endsWith('\n'), true);
  // Deterministic: second serialise identical.
  assert.equal(serializeMechanicsModule('cards', { extCard: splitExt.mechanics }, { order }), mechMod);
  assert.equal(serializeLocaleExport('cards', { extCard: splitExt.display }, { order }), locMod);
  // Parse round-trip preserves extension.
  const tmpDir = mkdtempSync(join(tmpdir(), 'content-ser-'));
  try {
    const mechPath = join(tmpDir, 'cards.tmp.mjs');
    writeFileSync(mechPath, mechMod);
    const parsed = await import(`${pathToFileURL(mechPath).href}?t=${Date.now()}`);
    assert.equal(parsed.CARDS.extCard.customExt, 42);
    const again = serializeMechanicsModule('cards', parsed.CARDS, { order });
    assert.equal(again, mechMod);
  } finally {
    rmSync(tmpDir, { recursive: true, force: true });
  }

  // Reject functions / ai in editable domains.
  assert.throws(() => splitBySource('cards', { ...strikeJoined, ai: () => {} }), /function|ai/i);
  assert.throws(() => materialiseOwnData({ get x() { return 1; } }, 'row'), /accessor/i);
  assert.throws(() => serializeMechanicsModule('cards', { bad: { ...splitCard.mechanics, boom: () => 1 } }, { order: ['bad'] }), /function/i);

  // Reject prototype / meta keys — JSON-parsed own keys must not pollute or serialise.
  for (const key of ['__proto__', 'prototype', 'constructor']) {
    const polluted = JSON.parse(`{"a":1,"${key}":{"polluted":true}}`);
    assert.throws(() => materialiseOwnData(polluted, 'row'), /prototype|meta|forbidden/i);
    const outProbe = (() => {
      try { return materialiseOwnData(polluted, 'row'); } catch { return null; }
    })();
    assert.equal(outProbe, null);
    assert.throws(
      () => serializeMechanicsModule('cards', {
        bad: { ...splitCard.mechanics, ...JSON.parse(`{"${key}":{"n":1}}`) },
      }, { order: ['bad'] }),
      /prototype|meta|forbidden/i,
    );
    assert.throws(
      () => serializeMechanicsModule('cards', {
        [key]: splitCard.mechanics,
      }, { order: [key] }),
      /prototype|meta|forbidden/i,
    );
  }
  {
    // Independent probe shape: assignment to out['__proto__'] must never succeed.
    const raw = JSON.parse('{"a":1,"__proto__":{"polluted":true}}');
    let threw = false;
    try {
      const out = materialiseOwnData(raw, 'row');
      assert.equal(out.polluted, undefined);
      assert.notEqual(Object.getPrototypeOf(out)?.polluted, true);
    } catch (err) {
      threw = /prototype|meta|forbidden/i.test(String(err?.message ?? err));
    }
    assert.equal(threw, true);
  }

  // Payload validation: version, pack, domain, order uniqueness, projection match, path traversal.
  const goodPayload = {
    v: 1, packId: 'core', locale: 'en', domain: 'cards',
    order: ['strike'],
    mechanics: { strike: splitCard.mechanics },
    display: { strike: splitCard.display },
  };
  assert.deepEqual(validateContentSavePayload(goodPayload), []);
  assert.ok(validateContentSavePayload({ ...goodPayload, v: 2 }).some((p) => /version/i.test(p)));
  assert.ok(validateContentSavePayload({ ...goodPayload, packId: 'other' }).some((p) => /pack/i.test(p)));
  assert.ok(validateContentSavePayload({ ...goodPayload, domain: 'enemies' }).some((p) => /domain/i.test(p)));
  assert.ok(validateContentSavePayload({ ...goodPayload, order: ['strike', 'strike'] }).some((p) => /unique|duplicate/i.test(p)));
  assert.ok(validateContentSavePayload({ ...goodPayload, order: ['strike'], mechanics: {}, display: { strike: splitCard.display } }).some((p) => /order|projection|mechanics/i.test(p)));
  assert.ok(validateContentSavePayload({ ...goodPayload, path: '../etc/passwd' }).some((p) => /path/i.test(p)));
  assert.ok(validateContentSavePayload({ ...goodPayload, mechanicsFile: 'src/packs/core/../../evil.js' }).some((p) => /path/i.test(p)));

  // Locale splice preserves surrounding exports.
  const sampleLocale = `// hdr\n\nexport const cards = {\n  a: { name: "A" },\n};\n\nexport const relics = {\n  r: { name: "R" },\n};\n`;
  const nextCards = serializeLocaleExport('cards', { a: { name: 'B', text: 't' } }, { order: ['a'] });
  const spliced = applyLocaleExportToSource(sampleLocale, 'cards', nextCards);
  assert.match(spliced, /name: "B"/);
  assert.match(spliced, /export const relics/);
  assert.doesNotMatch(spliced, /name: "A"/);

  // Vite config retains SPIRE defines + existing save endpoints beside __content-save.
  // Pin the full PR #18 marker set (not a vacuous subset of identifier strings).
  const viteSrc = readFileSync(new URL('../vite.config.js', import.meta.url), 'utf8');
  for (const marker of [
    '__SPIRE_VERSION__',
    '__SPIRE_GIT_SHA__',
    '__SPIRE_RELEASE__',
    'SPIRE_EMBED_SHA',
    'command === "serve"',
    '"unknown"',
    'SPIRE_RELEASE === "1"',
  ]) {
    assert.ok(viteSrc.includes(marker), `Vite marker missing: ${marker}`);
  }
  for (const route of [
    '__audio-save',
    '__bf-save',
    '__char-save',
    '__bfui-save',
    '__ward-save',
    '__content-save',
  ]) {
    assert.match(viteSrc, new RegExp(`middlewares\\.use\\("/${route}"`));
  }
  assert.match(viteSrc, /export default defineConfig\(\(\{ command \}\) =>/);
  assert.doesNotMatch(viteSrc, /export default \{/);
}

// ---- Task 19: content manager source contracts ----
{
  const managerPath = new URL('../src/ui/dev/content-manager.js', import.meta.url);
  const managerSource = readFileSync(managerPath, 'utf8');
  assert.match(managerSource, /compileContentRegistrations/);
  assert.match(managerSource, /DEVELOPMENT_CONTENT_REGISTRATION_MANIFEST/);
  assert.match(managerSource, /fieldOwnership/);
  assert.match(managerSource, /__content-save/);
  assert.doesNotMatch(managerSource, /from\s+['"][^'"]*packs\/(core|_sample)\//);
  assert.doesNotMatch(managerSource, /PACK_IDS\s*=/);
  const shellSource = readFileSync(new URL('../src/ui/dev/shell.js', import.meta.url), 'utf8');
  assert.match(shellSource, /id:\s*['"]contentedit['"][\s\S]*?available:\s*true/);
  const mainSource = readFileSync(new URL('../src/main.js', import.meta.url), 'utf8');
  assert.match(mainSource, /contentedit/);
  assert.match(mainSource, /ui\/dev\/content-manager/);
}

// ---- Task 18: content doctor dashboard source contracts ----
{
  const doctorPath = new URL('../src/ui/dev/doctor.js', import.meta.url);
  const doctorSource = readFileSync(doctorPath, 'utf8');
  assert.match(doctorSource, /doctorContentRegistrations/);
  assert.match(doctorSource, /DEVELOPMENT_CONTENT_REGISTRATION_MANIFEST/);
  assert.match(doctorSource, /fixtures:\s*\[\s*['"]sample['"]\s*\]/);
  assert.doesNotMatch(doctorSource, /from\s+['"][^'"]*packs\/(core|_sample|act4)/);
  assert.doesNotMatch(doctorSource, /from\s+['"][^'"]*i18n\/en/);
  assert.doesNotMatch(doctorSource, /from\s+['"][^'"]*locale-en/);
  assert.doesNotMatch(doctorSource, /PACK_IDS\s*=/);
  assert.doesNotMatch(doctorSource, /packList\s*=/);
  assert.doesNotMatch(doctorSource, /packs:\s*\[\s*['"]core['"]/);
  const shellPath = new URL('../src/ui/dev/shell.js', import.meta.url);
  const shellSource = readFileSync(shellPath, 'utf8');
  assert.match(shellSource, /data-dev-shell/);
  assert.match(shellSource, /data-dev-route=/);
  for (const route of ['gallery', 'audio', 'bfedit', 'bfuiedit', 'charedit', 'vfxedit', 'lab', 'dashboard', 'contentedit']) {
    assert.match(shellSource, new RegExp(`id:\\s*['"]${route}['"]`));
    assert.match(shellSource, new RegExp(`href:\\s*['"]\\?${route}=1['"]`));
  }
  assert.match(shellSource, /iconSvg/);
  assert.doesNotMatch(shellSource, /⚔|♛|✓|✗/);
}

// ---- Task 17: production-surface verifier marker list + Lab codec normalize ----
{
  // Pin the full frozen inventory — deleting any marker must fail this gate.
  assert.deepEqual([...FORBIDDEN_PRODUCTION_MARKERS], [
    '__content-save',
    'Content Lab',
    '_sample',
    'data-dev-shell',
    'data-content-doctor',
    'contentedit',
    'data-lab-root',
    'createDevRegistry',
    'ui/dev/lab',
    'ui/dev/doctor',
    'ui/dev/content-manager',
    'ui/dev/shell',
  ]);
  assert.equal(FORBIDDEN_PRODUCTION_MARKERS.length, 12);
  assert.equal(Object.isFrozen(FORBIDDEN_PRODUCTION_MARKERS), true);
  // scan helper rejects markers when planted in a synthetic file set.
  const tmp = mkdtempSync(join(tmpdir(), 'spire-surface-'));
  try {
    writeFileSync(join(tmp, 'index.html'), '<script src="/assets/x.js"></script>\n');
    mkdirSync(join(tmp, 'assets'));
    writeFileSync(join(tmp, 'assets', 'x.js'), 'console.log("Content Lab")\n');
    const hits = scanProductionSurface(tmp);
    assert.ok(hits.some((h) => h.marker === 'Content Lab'));
  } finally {
    rmSync(tmp, { recursive: true, force: true });
  }

  const replay = {
    v: 1,
    kind: 'card-flight',
    subject: { kind: 'card', contentId: 'strike', upgraded: false },
    parameters: { destination: 'discard', motion: 'full' },
    endState: { destination: 'discard', visible: false },
  };
  assert.deepEqual(normalizeReplayDescriptor(replay), replay);
  assert.equal(Object.isFrozen(normalizeReplayDescriptor(replay)), true);

  // Production UI modules must not branch on sample ids.
  {
    const uiRoot = new URL('../src/ui/', import.meta.url);
    const walk = (dir, rel = '') => {
      for (const entry of readdirSync(dir, { withFileTypes: true })) {
        const nextRel = rel ? `${rel}/${entry.name}` : entry.name;
        if (entry.isDirectory()) {
          if (entry.name === 'dev') continue; // Lab/doctor are DEV-only
          walk(join(dir, entry.name), nextRel);
        } else if (entry.name.endsWith('.js')) {
          const source = readFileSync(join(dir, entry.name), 'utf8');
          assert.doesNotMatch(source, /sampleTheme|sampleEnemy|sampleCard/,
            `${nextRel} must not branch on sample content ids`);
        }
      }
    };
    walk(fileURLToPath(uiRoot));
  }
}

let wins = 0, deaths = 0;
const RUNS = 300;
for (let i = 0; i < RUNS; i++) {
  const res = randomAgentRun(1000 + i * 7919);
  if (res.won) wins++;
  else deaths++;
}
assert.equal(wins + deaths, RUNS);
console.log(`unit checks passed; monte-carlo: ${RUNS} runs, ${wins} random-agent wins, ${deaths} deaths`);
