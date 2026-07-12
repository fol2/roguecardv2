#!/usr/bin/env node

import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { mkdirSync, readFileSync, realpathSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

export const CONTENT_EXPORT_NAMES = Object.freeze([
  'PLAYER', 'ACTS', 'CARDS', 'CARD_POOLS', 'STATUS_INFO', 'RELICS',
  'RELIC_POOLS', 'POTIONS', 'ENEMIES', 'ENCOUNTERS', 'EVENTS',
  'REWARD_GOLD', 'SHOP', 'OMENS', 'AFFIXES', 'ARTS', 'DEEDS',
  'PROGRESSION', 'REVEALS', 'POOL_GATE', 'QUEST_IDS', 'WHISPERS',
  'QUESTS', 'SHADE_KITS', 'VARIANTS', 'ASPECTS', 'VOWS', 'BOONS',
]);

export const PROTOCOL_EXPORT_NAMES = Object.freeze([
  'QUEST_STATES', 'QUEST_ACTIVE_STATES', 'TERMINAL_OUTCOMES', 'RUN_ID_RE',
]);

const I18N_APIS = Object.freeze([
  'getContent', 'getLocale', 'hydrateContent', 'lookup',
  'registerLocale', 'setLocale', 't',
]);

const CONTENT_DOMAIN_TO_EXPORT = Object.freeze({
  cards: 'CARDS', status: 'STATUS_INFO', relics: 'RELICS', potions: 'POTIONS',
  arts: 'ARTS', boons: 'BOONS', enemies: 'ENEMIES', events: 'EVENTS',
  omens: 'OMENS', affixes: 'AFFIXES', acts: 'ACTS', aspects: 'ASPECTS',
  vows: 'VOWS', deeds: 'DEEDS', quests: 'QUESTS', whispers: 'WHISPERS',
  variants: 'VARIANTS', shadeKits: 'SHADE_KITS',
});

const SOURCE_SHA = '9c4f7e5624b1c7eae8eb6fd3e7c27ff5ec0df5f8';
const EXECUTING_TOOL_PATH = fileURLToPath(import.meta.url);

function isObject(value) {
  return value !== null && typeof value === 'object';
}

function assertNoSymbols(value, where) {
  if (!isObject(value)) return;
  const symbol = Reflect.ownKeys(value).find((key) => typeof key === 'symbol');
  if (symbol) throw new TypeError(`${where}: symbol key is not canonical`);
}

export function canonicalise(value, where = '$', active = new WeakSet()) {
  if (typeof value === 'function' || typeof value === 'undefined') return undefined;
  if (typeof value === 'symbol' || typeof value === 'bigint') {
    throw new TypeError(`${where}: unsupported ${typeof value}`);
  }
  if (typeof value === 'number' && !Number.isFinite(value)) {
    throw new TypeError(`${where}: non-finite number`);
  }
  if (!isObject(value)) return value;
  if (value instanceof RegExp) return { source: value.source, flags: value.flags };
  if (active.has(value)) throw new TypeError(`${where}: cyclic value`);
  assertNoSymbols(value, where);
  active.add(value);
  try {
    if (Array.isArray(value)) {
      const result = [];
      for (let index = 0; index < value.length; index++) {
        const item = canonicalise(value[index], `${where}[${index}]`, active);
        if (item !== undefined) result.push(item);
      }
      return result;
    }
    const result = {};
    for (const key of Object.keys(value).sort()) {
      const item = canonicalise(value[key], `${where}.${key}`, active);
      if (item !== undefined) result[key] = item;
    }
    return result;
  } finally {
    active.delete(value);
  }
}

export function canonicalJson(value) {
  return JSON.stringify(canonicalise(value));
}

export function sha256(value) {
  const bytes = typeof value === 'string' || Buffer.isBuffer(value)
    ? value : canonicalJson(value);
  return createHash('sha256').update(bytes).digest('hex');
}

function importUrl(root, relativePath) {
  return pathToFileURL(path.join(root, relativePath)).href;
}

function requireAbsoluteRoot(root, label) {
  if (!path.isAbsolute(root)) throw new TypeError(`${label} must be an absolute root`);
  return path.resolve(root);
}

export function assertCaptureWorktreeIdentity(captureWorktree) {
  const captureRoot = requireAbsoluteRoot(captureWorktree, 'captureWorktree');
  const claimedToolPath = path.join(captureRoot, 'tools/capture-content-oracle.mjs');
  let executingTool;
  let claimedTool;
  try {
    executingTool = realpathSync(EXECUTING_TOOL_PATH);
    claimedTool = realpathSync(claimedToolPath);
  } catch (error) {
    throw new Error('captureWorktree does not contain the executing oracle tool', { cause: error });
  }
  if (executingTool !== claimedTool) {
    throw new Error('captureWorktree does not contain the executing oracle tool');
  }
  return path.dirname(path.dirname(claimedTool));
}

async function importSourceModules(sourceRoot) {
  const [data, engine, i18n, english, ui] = await Promise.all([
    import(importUrl(sourceRoot, 'src/data.js')),
    import(importUrl(sourceRoot, 'src/engine.js')),
    import(importUrl(sourceRoot, 'src/i18n/index.js')),
    import(importUrl(sourceRoot, 'src/i18n/en/content.js')),
    import(importUrl(sourceRoot, 'src/i18n/en/ui.js')),
  ]);
  return { data, engine, i18n, english, ui };
}

export async function inspectSourceRoot(sourceWorktree) {
  const sourceRoot = requireAbsoluteRoot(sourceWorktree, 'sourceWorktree');
  const { data, i18n, ui } = await importSourceModules(sourceRoot);
  const dataValue = canonicalise({ PLAYER: data.PLAYER });
  const i18nValue = canonicalise({
    defaultLocale: i18n.getLocale(), content: i18n.getContent(), ui: ui.ui,
  });
  return {
    data: dataValue,
    dataSha256: sha256(dataValue),
    i18n: i18nValue,
    i18nSha256: sha256(i18nValue),
  };
}

export async function inspectExactSourceRoot(sourceWorktree) {
  const sourceRoot = requireAbsoluteRoot(sourceWorktree, 'sourceWorktree');
  const { data } = await importSourceModules(sourceRoot);
  assertExactDataExports(data);
  return Object.keys(data).sort();
}

function git(root, args) {
  return execFileSync('git', ['-C', root, ...args], { encoding: 'utf8' }).trim();
}

function sourceProjection(data) {
  assertExactDataExports(data);
  const contentExports = CONTENT_EXPORT_NAMES.map((name) => ({
    name,
    value: canonicalise(data[name], name),
  }));
  const protocolExports = {
    QUEST_STATES: canonicalise(data.QUEST_STATES),
    QUEST_ACTIVE_STATES: canonicalise(data.QUEST_ACTIVE_STATES),
    TERMINAL_OUTCOMES: canonicalise(data.TERMINAL_OUTCOMES),
    RUN_ID_RE: canonicalise(data.RUN_ID_RE),
  };
  return { contentExports, protocolExports };
}

export function assertExactDataExports(data) {
  const expected = [...CONTENT_EXPORT_NAMES, ...PROTOCOL_EXPORT_NAMES].sort();
  const actual = Object.keys(data).sort();
  if (canonicalJson(actual) !== canonicalJson(expected)) {
    const missing = expected.filter((name) => !actual.includes(name));
    const extra = actual.filter((name) => !expected.includes(name));
    throw new Error(`data export partition drift; missing: ${missing.join(', ') || 'none'}; undeclared: ${extra.join(', ') || 'none'}`);
  }
}

function countLeaves(value) {
  if (!isObject(value)) return 1;
  return Object.values(value).reduce((total, child) => total + countLeaves(child), 0);
}

function leafPaths(value, prefix = '') {
  if (!isObject(value)) return [prefix];
  return Object.keys(value).sort().flatMap((key) =>
    leafPaths(value[key], prefix ? `${prefix}.${key}` : key));
}

function removedLeafPaths(full, reduced, prefix = '') {
  if (!isObject(full)) return [];
  const result = [];
  for (const key of Object.keys(full).sort()) {
    const next = prefix ? `${prefix}.${key}` : key;
    if (!isObject(reduced) || !Object.prototype.hasOwnProperty.call(reduced, key)) {
      result.push(...leafPaths(full[key], next));
    } else {
      result.push(...removedLeafPaths(full[key], reduced[key], next));
    }
  }
  return result;
}

export function descriptorInventory(roots) {
  const accessors = [];
  const descriptors = [];
  const visit = (value, currentPath, active) => {
    if (!isObject(value) || active.has(value)) return;
    assertNoSymbols(value, currentPath);
    active.add(value);
    try {
      for (const key of Object.keys(value).sort()) {
        const descriptor = Object.getOwnPropertyDescriptor(value, key);
        const entryPath = `${currentPath}.${key}`;
        const row = {
          path: entryPath,
          enumerable: !!descriptor.enumerable,
          configurable: !!descriptor.configurable,
          kind: descriptor.get || descriptor.set ? 'accessor' : 'data',
        };
        if ('writable' in descriptor) row.writable = !!descriptor.writable;
        descriptors.push(row);
        if (row.kind === 'accessor') {
          accessors.push({ path: entryPath });
        } else if (typeof descriptor.value !== 'function') {
          visit(descriptor.value, entryPath, active);
        }
      }
    } finally {
      active.delete(value);
    }
  };
  for (const [name, value] of Object.entries(roots)) visit(value, name, new WeakSet());
  return { accessors, sha256: sha256(descriptors) };
}

function aliasInventory(roots) {
  const seen = new WeakMap();
  const groups = [];
  const active = new WeakSet();
  const visit = (value, currentPath) => {
    if (!isObject(value) || active.has(value)) return;
    let paths = seen.get(value);
    if (!paths) {
      paths = [];
      groups.push(paths);
    }
    paths.push(currentPath);
    seen.set(value, paths);
    if (paths.length > 1) return;
    active.add(value);
    try {
      for (const key of Object.keys(value).sort()) {
        const descriptor = Object.getOwnPropertyDescriptor(value, key);
        if (descriptor && 'value' in descriptor && typeof descriptor.value !== 'function') {
          visit(descriptor.value, `${currentPath}.${key}`);
        }
      }
    } finally {
      active.delete(value);
    }
  };
  for (const [name, value] of Object.entries(roots)) visit(value, name);
  return groups.filter((paths) => paths.length > 1)
    .map((paths) => paths.sort()).sort((a, b) => a[0].localeCompare(b[0]));
}

function cloneMechanics(data, englishContent) {
  const result = Object.fromEntries(CONTENT_EXPORT_NAMES.map((name) => [name, data[name]]));
  const projected = canonicalise(result);
  const remove = (object, key) => {
    if (object && Object.prototype.hasOwnProperty.call(object, key)) delete object[key];
  };
  for (const [id, row] of Object.entries(projected.CARDS || {})) {
    const locale = englishContent.cards?.[id] || {};
    if ('name' in locale) remove(row, 'name');
    if ('text' in locale) remove(row, 'text');
    if ('textUp' in locale && row.up) remove(row.up, 'text');
  }
  for (const tableName of ['STATUS_INFO', 'RELICS', 'POTIONS', 'ARTS', 'BOONS', 'OMENS', 'AFFIXES', 'DEEDS']) {
    const domain = Object.keys(CONTENT_DOMAIN_TO_EXPORT).find((key) => CONTENT_DOMAIN_TO_EXPORT[key] === tableName);
    const localeTable = englishContent[domain] || {};
    for (const [id, loc] of Object.entries(localeTable)) {
      for (const key of Object.keys(loc)) remove(projected[tableName]?.[id], key);
    }
  }
  for (const [id, row] of Object.entries(projected.ENEMIES || {})) {
    const locale = englishContent.enemies?.[id] || {};
    if ('name' in locale) remove(row, 'name');
    for (const [moveId, move] of Object.entries(row.moves || {})) {
      if (locale.moves?.[moveId]?.name != null) remove(move, 'name');
    }
  }
  for (const [id, row] of Object.entries(projected.EVENTS || {})) {
    const locale = englishContent.events?.[id] || {};
    for (const key of Object.keys(locale).filter((key) => key !== 'choices')) remove(row, key);
    for (const [index, choice] of (row.choices || []).entries()) {
      for (const key of Object.keys(locale.choices?.[index] || {})) remove(choice, key);
    }
  }
  for (const [index, row] of (projected.ACTS || []).entries()) {
    for (const key of Object.keys(englishContent.acts?.[index] || {})) remove(row, key);
  }
  for (const [index, row] of (projected.VOWS || []).entries()) {
    for (const key of Object.keys(englishContent.vows?.[index] || {})) remove(row, key);
  }
  for (const row of projected.ASPECTS || []) {
    for (const key of Object.keys(englishContent.aspects?.[row.id] || {})) remove(row, key);
  }
  for (const key of Object.keys(englishContent.aspects?.[projected.PLAYER?.id] || {})) {
    remove(projected.PLAYER, key);
  }
  for (const [id, row] of Object.entries(projected.QUESTS || {})) {
    for (const key of Object.keys(englishContent.quests?.[id] || {})) remove(row, key);
  }
  projected.WHISPERS = [];
  for (const [id, row] of Object.entries(projected.VARIANTS || {})) {
    for (const key of Object.keys(englishContent.variants?.[id] || {})) remove(row, key);
  }
  for (const [id, row] of Object.entries(projected.SHADE_KITS || {})) {
    const locale = englishContent.shadeKits?.[id] || {};
    for (const [moveId, move] of Object.entries(row.moves || {})) {
      if (locale.moves?.[moveId]?.name != null) remove(move, 'name');
    }
  }
  return projected;
}

function makeCountedRng(engine, seed) {
  const source = engine.makeRng(seed);
  let calls = 0;
  const rng = () => {
    calls++;
    return source();
  };
  return { rng, snapshot: () => ({ calls, state: source.getState() }) };
}

function liveEnemy(engine, data, id, shadeAspect = null) {
  const run = engine.newRun(20260710, shadeAspect == null ? {} : {
    monument: { act: 0, row: 0, bequest: null, shadeAspect },
  });
  if (shadeAspect != null) run.monument = { act: 0, row: 0, bequest: null, shadeAspect };
  const cb = engine.startCombat(run, [id], id === 'sovereign' ? 'boss' : 'normal');
  const self = cb.enemies[0];
  self.flags = {};
  self.lastMoves = [];
  self.moveKey = null;
  self.statuses = { ...(self.statuses || {}) };
  return self;
}

function cloneSelf(self) {
  const clone = {
    ...self,
    def: self.def,
    presentation: canonicalise(self.presentation),
    statuses: canonicalise(self.statuses),
    flags: canonicalise(self.flags),
    lastMoves: [...self.lastMoves],
  };
  return clone;
}

function captureAiRows(engine, data) {
  const turns = [1, 2, 3, 4, 7];
  const hpFractions = [1, 0.49, 0.1];
  const seeds = [1, 20260710];
  const capture = (id, makeSelf) => {
    const prototype = makeSelf();
    const def = prototype.def;
    const moveKeys = Object.keys(def.moves);
    const histories = [null, ...moveKeys];
    const cases = [];
    for (const turn of turns) for (const last of histories) for (const prev of histories) {
      for (const hpFrac of hpFractions) for (const seed of seeds) {
        const self = cloneSelf(makeSelf());
        self.hp = Math.max(1, Math.round(self.maxHp * hpFrac));
        self.lastMoves = [prev, last].filter((value) => value != null);
        const counted = makeCountedRng(engine, seed);
        const returned = self.def.ai({ turn, last, prev, hpFrac, rng: counted.rng, self });
        if (!moveKeys.includes(returned)) throw new Error(`${id}: AI returned unknown move ${returned}`);
        cases.push({ turn, last, prev, hpFrac, seed, returned, rng: counted.snapshot(), self: canonicalise(self) });
      }
    }
    return { id, arity: def.ai.length, functionSha256: sha256(def.ai.toString()), moveKeys, cases };
  };
  const enemyAi = Object.entries(data.ENEMIES).filter(([, def]) => typeof def.ai === 'function')
    .map(([id]) => capture(id, () => liveEnemy(engine, data, id)));
  const shadeIds = Object.keys(data.SHADE_KITS);
  const shadeAi = shadeIds.map((id, index) => {
    const selfFactory = () => liveEnemy(engine, data, 'ownShade1', index);
    return capture(id, selfFactory);
  });
  return { enemyAi, shadeAi };
}

function captureSovereign(engine, data) {
  const self = liveEnemy(engine, data, 'sovereign');
  self.hp = Math.floor(self.maxHp * 0.49);
  const results = [];
  const counted = makeCountedRng(engine, 20260710);
  for (let index = 0; index < 4; index++) {
    const returned = self.def.ai({
      turn: index + 1, last: self.lastMoves.at(-1), prev: self.lastMoves.at(-2),
      hpFrac: self.hp / self.maxHp, rng: counted.rng, self,
    });
    const postCallSelf = canonicalise(self);
    self.moveKey = returned;
    self.lastMoves.push(returned);
    results.push({
      returned,
      rng: counted.snapshot(),
      self: postCallSelf,
      progression: canonicalise({ moveKey: self.moveKey, lastMoves: self.lastMoves }),
    });
  }
  if (results[0].returned !== 'ascend' || results[0].self.flags.ascended !== true
    || results[3].returned !== 'annihilation') {
    throw new Error('Sovereign mutation sequence drifted');
  }
  return results;
}

function randomAgentRun(seed, engine, data) {
  const aspect = seed % 2;
  const vow = seed % 3;
  const boonIds = Object.keys(data.BOONS);
  const monument = seed % 4 === 0 ? { act: 0, row: 5, bequest: { kind: 'gold', amount: 40 } } : null;
  const run = engine.newRun(seed, { aspect, vow, monument });
  engine.applyEventOps(run, data.BOONS[boonIds[seed % boonIds.length]].ops);
  let state = (seed ^ 0x9e3779b9) | 0;
  const rnd = () => {
    state = (Math.imul(state, 1664525) + 1013904223) | 0;
    return (state >>> 0) / 4294967296;
  };
  const choice = (array) => array[Math.floor(rnd() * array.length)];
  let guard = 0;
  while (guard++ < 400) {
    const node = choice(engine.availableNodes(run));
    const { type } = engine.visitNode(run, node);
    if (['monster', 'elite', 'boss'].includes(type)) {
      const encounter = engine.rollEncounter(run, type, node.row);
      const combat = engine.startCombat(run, encounter, type);
      let turnGuard = 0;
      while (!combat.over && turnGuard++ < 200) {
        let played = true;
        let safety = 0;
        while (played && !combat.over && safety++ < 30) {
          played = false;
          const playable = combat.hand.filter((card) => {
            const definition = engine.cardData(card);
            return !definition.unplayable && (definition.cost ?? 99) <= combat.player.energy;
          });
          if (playable.length && rnd() < 0.9) {
            const card = choice(playable);
            const living = combat.enemies.map((enemy, index) => enemy.hp > 0 ? index : -1)
              .filter((index) => index >= 0);
            played = engine.playCard(run, combat, card.uid, living.length ? choice(living) : null);
          }
        }
        if (!combat.over && combat.hand.length && rnd() < 0.25) {
          engine.kindleFromHand(run, combat, choice(combat.hand).uid);
        }
        if (!combat.over && engine.canUseArt(run, combat) && rnd() < 0.4) engine.useArt(run, combat);
        if (!combat.over) engine.endTurn(run, combat);
        combat.queue.length = 0;
      }
      if (!combat.over) throw new Error(`oracle combat did not terminate: ${encounter.join(',')}`);
      if (combat.result === 'loss') return { outcome: 'death', run, rngState: state };
      const reward = engine.genCombatRewards(run, type, combat.affix);
      run.player.gold += reward.gold;
      if (reward.cards.length && rnd() < 0.8) engine.addCardToDeck(run, choice(reward.cards));
      if (reward.potion) engine.gainPotion(run, reward.potion);
      if (reward.relic) engine.gainRelic(run, reward.relic);
      if (type === 'boss') {
        if (run.act >= 2) return { outcome: 'win', run, rngState: state };
        const bosses = engine.rollBossRelics(run);
        if (bosses.length) engine.gainRelic(run, choice(bosses));
        run.act++;
        run.nodeId = null;
        run.map = engine.genMap(run);
        engine.healPlayer(run, Math.round(run.player.maxHp * 0.3));
      }
    } else if (type === 'rest') {
      if (rnd() < 0.5) engine.healPlayer(run, Math.round(run.player.maxHp * 0.3));
      else {
        const candidates = run.player.deck.filter((card) => !card.up && data.CARDS[card.id].up);
        if (candidates.length) engine.upgradeCardInDeck(run, choice(candidates).uid);
      }
    } else if (type === 'event') {
      const event = data.EVENTS[engine.rollEvent(run)];
      const valid = event.choices.filter((option) => !option.needGold || run.player.gold >= option.needGold);
      const { pending } = engine.applyEventOps(run, choice(valid).ops);
      for (const operation of pending) {
        if (operation === 'remove' && run.player.deck.length > 1) engine.removeCardFromDeck(run, choice(run.player.deck).uid);
        else if (operation === 'upgrade') {
          const candidates = run.player.deck.filter((card) => !card.up);
          if (candidates.length) engine.upgradeCardInDeck(run, choice(candidates).uid);
        } else if (operation === 'duplicate') engine.addCardToDeck(run, choice(run.player.deck).id);
        else if (operation.pickCard) engine.addCardToDeck(run, choice(data.CARD_POOLS.common));
      }
    } else if (type === 'shop') {
      const shop = engine.genShop(run);
      for (const item of [...shop.cards, ...shop.relics, ...shop.potions]) {
        if (!item.sold && item.price <= run.player.gold && rnd() < 0.4) {
          run.player.gold -= item.price;
          item.sold = true;
          if (shop.cards.includes(item)) engine.addCardToDeck(run, item.id);
          else if (shop.relics.includes(item)) engine.gainRelic(run, item.id);
          else engine.gainPotion(run, item.id);
        }
      }
    } else if (type === 'treasure') {
      const relic = engine.randomRelic(run);
      if (relic) engine.gainRelic(run, relic);
    } else if (type === 'monument') engine.claimMonument(run);
  }
  throw new Error('oracle random-agent run did not terminate');
}

function captureMonteCarlo(engine, data) {
  const runs = [];
  for (let seed = 2026071000; seed <= 2026071299; seed++) {
    const result = randomAgentRun(seed, engine, data);
    const run = result.run;
    runs.push({
      outcome: result.outcome, act: run.act, floor: run.floorsClimbed,
      hp: run.player.hp, deckIds: run.player.deck.map((card) => card.id),
      relicIds: [...run.player.relics], engineRngState: run.rngState,
    });
  }
  return { seeds: [2026071000, 2026071299], count: runs.length, records: runs, sha256: sha256(runs) };
}

function provenance(sourceRoot, captureRoot) {
  const toolPath = path.join(captureRoot, 'tools/capture-content-oracle.mjs');
  const testPath = path.join(captureRoot, 'test/test_engine.js');
  return {
    sourceSha: git(sourceRoot, ['rev-parse', 'HEAD']),
    sourceTree: git(sourceRoot, ['rev-parse', 'HEAD^{tree}']),
    captureParentHead: git(captureRoot, ['rev-parse', 'HEAD']),
    captureParentTree: git(captureRoot, ['rev-parse', 'HEAD^{tree}']),
    captureInputs: {
      toolSha256: sha256(readFileSync(toolPath)),
      testSha256: sha256(readFileSync(testPath)),
    },
    sourceModules: { data: 'src/data.js', engine: 'src/engine.js', i18n: 'src/i18n/index.js' },
    pr17: {
      base: 'b285b815509d5c700b2b76847302c01bc595db47',
      head: '5cd1c555219a18e25b8ffa11646e7899d6764fd2',
      merge: '40eb3576870f2a94b50e1a616ec40d4c37075018',
    },
    pr17Paths: [
      'src/battlefield-layout.js', 'src/styles.css', 'src/ui.js',
      'test/e2e/geometry.spec.js',
      'test/e2e/visual.spec.js-snapshots/combat-act1-landscape-linux.png',
      'test/e2e/visual.spec.js-snapshots/combat-act2-landscape-linux.png',
      'test/e2e/visual.spec.js-snapshots/combat-act2-portrait-linux.png',
    ],
    pr21: {
      base: '40eb3576870f2a94b50e1a616ec40d4c37075018',
      head: 'c42279609f2379cd6be6ba695205a131f029de28',
      merge: '45677c1a676d19b1590192a4dbaf8425801dc97e',
    },
    pr22: {
      base: '45677c1a676d19b1590192a4dbaf8425801dc97e',
      head: 'fe330a077ba847900f08be0121b65081b84e21ae',
      merge: SOURCE_SHA,
    },
  };
}

export async function captureContentOracle({ sourceWorktree, captureWorktree }) {
  const sourceRoot = realpathSync(requireAbsoluteRoot(sourceWorktree, 'sourceWorktree'));
  const captureRoot = assertCaptureWorktreeIdentity(captureWorktree);
  if (sourceRoot === captureRoot) throw new Error('source and capture worktrees must be distinct');
  const { data, engine, i18n, english, ui } = await importSourceModules(sourceRoot);
  const roots = Object.fromEntries(CONTENT_EXPORT_NAMES.map((name) => [name, data[name]]));
  const descriptors = descriptorInventory(roots);
  if (descriptors.accessors.length !== 1
    || descriptors.accessors[0].path !== 'QUESTS.hollowLamplighter.target') {
    throw new Error(`unexpected accessor inventory: ${JSON.stringify(descriptors.accessors)}`);
  }
  descriptors.accessors[0].value = canonicalise(data.QUESTS.hollowLamplighter.target);
  const { contentExports, protocolExports } = sourceProjection(data);
  const englishContent = Object.fromEntries(Object.keys(CONTENT_DOMAIN_TO_EXPORT)
    .map((domain) => [domain, english[domain]]));
  const raw = cloneMechanics(data, englishContent);
  const hydrated = canonicalise(roots);
  const mechanicsPaths = leafPaths(raw);
  const localeOwnedPaths = removedLeafPaths(hydrated, raw);
  const i18nExports = Object.keys(i18n).sort();
  if (canonicalJson(i18nExports) !== canonicalJson(I18N_APIS)) {
    throw new Error(`unexpected i18n API surface: ${i18nExports.join(', ')}`);
  }
  const domains = canonicalise(englishContent);
  const uiCatalogue = canonicalise(ui.ui);
  const ai = captureAiRows(engine, data);
  const hydratedAliases = aliasInventory(roots);
  return {
    version: 1,
    contentExports,
    protocolExports,
    rawMechanics: {
      value: raw,
      sha256: sha256(raw),
      mechanicsPaths,
      localeOwnedPaths,
      descriptorSha256: descriptors.sha256,
    },
    descriptors,
    i18n: {
      apis: i18nExports,
      defaultLocale: i18n.getLocale(),
      domains,
      ui: uiCatalogue,
      uiLeafCount: countLeaves(uiCatalogue),
      catalogueSha256: sha256({ content: domains, ui: uiCatalogue }),
      provenance: ['src/i18n/en/content.js', 'src/i18n/en/ui.js', 'src/i18n/en/index.js'],
      hydratedAliases,
    },
    enemyAi: ai.enemyAi,
    shadeAi: ai.shadeAi,
    sovereignSequence: captureSovereign(engine, data),
    monteCarlo: captureMonteCarlo(engine, data),
    provenance: provenance(sourceRoot, captureRoot),
  };
}

function parseCli(argv) {
  const options = { write: false, check: false, expectMonolith: false };
  for (let index = 0; index < argv.length; index++) {
    const argument = argv[index];
    if (argument === '--write') options.write = true;
    else if (argument === '--check') options.check = true;
    else if (argument === '--expect-monolith') options.expectMonolith = true;
    else if (['--source-worktree', '--capture-worktree', '--output'].includes(argument)) {
      const value = argv[++index];
      if (!value) throw new Error(`${argument} requires a value`);
      const key = argument === '--source-worktree' ? 'sourceWorktree'
        : argument === '--capture-worktree' ? 'captureWorktree' : 'output';
      options[key] = value;
    } else throw new Error(`unknown argument: ${argument}`);
  }
  if (options.write === options.check) throw new Error('select exactly one of --write or --check');
  for (const key of ['sourceWorktree', 'captureWorktree', 'output']) {
    if (!options[key] || !path.isAbsolute(options[key])) throw new Error(`${key} must be absolute`);
  }
  return options;
}

async function main(argv) {
  const options = parseCli(argv);
  if (options.expectMonolith) {
    const dataSource = readFileSync(path.join(options.sourceWorktree, 'src/data.js'), 'utf8');
    if (/from\s+['"]\.\/(?:registry|packs)\b/.test(dataSource)) {
      throw new Error('--expect-monolith rejected registry/pack imports');
    }
  }
  const oracle = await captureContentOracle(options);
  if (options.expectMonolith && oracle.provenance.sourceSha !== SOURCE_SHA) {
    throw new Error(`expected source ${SOURCE_SHA}, received ${oracle.provenance.sourceSha}`);
  }
  const output = `${JSON.stringify(oracle)}\n`;
  if (options.write) {
    mkdirSync(path.dirname(options.output), { recursive: true });
    writeFileSync(options.output, output, { flag: 'wx' });
  }
  else if (readFileSync(options.output, 'utf8') !== output) throw new Error('content oracle mismatch');
}

const direct = process.argv[1]
  && path.resolve(process.argv[1]) === path.resolve(fileURLToPath(import.meta.url));
if (direct) {
  main(process.argv.slice(2)).catch((error) => {
    console.error(error?.stack || error);
    process.exitCode = 1;
  });
}
