#!/usr/bin/env node
/**
 * Task 12A — compare core pack candidates against the live monolith.
 * Never writes the oracle; never imports a candidate through src/data.js.
 */
import assert from 'node:assert/strict';
import { access } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import * as live from '../src/data.js';
import * as english from '../src/i18n/en/content.js';
import {
  CONTENT_SCHEMAS, createContentContext, definePack, joinLocaleContent,
} from '../src/registry.js';
import { STATIC_REFERENCE_CATALOGUES } from '../src/content-resources.js';
import {
  CONTENT_EXPORT_NAMES, canonicalise, canonicalJson, sha256,
} from './capture-content-oracle.mjs';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const coreDir = path.join(root, 'src/packs/core');

const DOMAIN_FILES = Object.freeze({
  player: 'player.js',
  cards: 'cards.js',
  statuses: 'statuses.js',
  relics: 'relics.js',
  potions: 'potions.js',
  enemies: 'enemies.js',
  events: 'events.js',
  omens: 'omens.js',
  arts: 'arts.js',
  meta: 'meta.js',
  progression: 'progression.js',
  themes: 'themes.js',
});

const DOMAIN_LIVE = Object.freeze({
  player: ['PLAYER', 'SHOP'],
  cards: ['CARDS'],
  statuses: ['STATUS_INFO'],
  relics: ['RELICS'],
  potions: ['POTIONS'],
  enemies: ['ENEMIES'],
  events: ['EVENTS'],
  omens: ['OMENS', 'AFFIXES'],
  arts: ['ARTS'],
  meta: ['DEEDS', 'ASPECTS', 'VOWS', 'BOONS'],
  progression: ['PROGRESSION', 'QUEST_IDS', 'QUESTS', 'SHADE_KITS', 'VARIANTS'],
  themes: ['ACTS', 'ENCOUNTERS', 'REWARD_GOLD'],
});

const HOOK_PATHS = [
  [/^enemies\.[^.]+\.ai$/, 'enemies'],
  [/^shadeKits\.[^.]+\.ai$/, 'shadeKits'],
  [/^events\.[^.]+\.(?:onEnter|onChoose|apply|condition)$/, 'events'],
];

const VIEW_MAP = Object.freeze({
  PLAYER: 'player', ACTS: 'acts', CARDS: 'cards', CARD_POOLS: 'cardPools',
  STATUS_INFO: 'statuses', RELICS: 'relics', RELIC_POOLS: 'relicPools',
  POTIONS: 'potions', ENEMIES: 'enemies', ENCOUNTERS: 'encounters',
  EVENTS: 'events', REWARD_GOLD: 'rewardGold', SHOP: 'shop', OMENS: 'omens',
  AFFIXES: 'affixes', ARTS: 'arts', DEEDS: 'deeds', PROGRESSION: 'progression',
  REVEALS: 'reveals', POOL_GATE: 'poolGate', QUEST_IDS: 'questIds',
  WHISPERS: 'whispers', QUESTS: 'quests', SHADE_KITS: 'shadeKits',
  VARIANTS: 'variants', ASPECTS: 'aspects', VOWS: 'vows', BOONS: 'boons',
});

function fail(message) {
  console.error(message);
  process.exitCode = 1;
}

async function fileExists(filePath) {
  try {
    await access(filePath);
    return true;
  } catch {
    return false;
  }
}

async function importCandidate(domain) {
  const relative = DOMAIN_FILES[domain];
  if (!relative) throw new Error(`unknown domain ${domain}`);
  const filePath = path.join(coreDir, relative);
  if (!(await fileExists(filePath))) {
    throw new Error(`candidate file missing: src/packs/core/${relative}`);
  }
  return import(`${pathToFileURL(filePath).href}?domain=${domain}&t=${Date.now()}`);
}

function localeFields(domain) {
  return new Set(Object.entries(CONTENT_SCHEMAS[domain]?.fields || {})
    .filter(([, spec]) => spec.source === 'locale')
    .map(([key]) => key));
}

function assertDataProperty(object, key, where) {
  const descriptor = Object.getOwnPropertyDescriptor(object, key);
  if (!descriptor) throw new Error(`${where}: missing own property`);
  if (!descriptor.enumerable) throw new Error(`${where}: not enumerable`);
  if (!Object.hasOwn(descriptor, 'value')) throw new Error(`${where}: accessor not allowed`);
  return descriptor.value;
}

function projectMechanics(value, domain, where = domain) {
  if (typeof value === 'function') return undefined;
  if (value === null || typeof value !== 'object') return value;
  if (Array.isArray(value)) {
    return value.map((item, index) => projectMechanics(item, domain, `${where}[${index}]`));
  }
  const strip = localeFields(domain);
  const out = {};
  for (const key of Object.keys(value).sort()) {
    const descriptor = Object.getOwnPropertyDescriptor(value, key);
    if (!descriptor?.enumerable) continue;
    const childWhere = `${where}.${key}`;
    if (!Object.hasOwn(descriptor, 'value')) {
      if (childWhere === 'quests.hollowLamplighter.target') {
        // Live exception — compare observable numeric value only at runtime leg.
        continue;
      }
      throw new Error(`${childWhere}: unexpected accessor in mechanics projection`);
    }
    if (strip.has(key)) continue;
    if ((domain === 'enemies' || domain === 'shadeKits') && key === 'moves') {
      const moves = {};
      for (const [moveId, move] of Object.entries(descriptor.value || {})) {
        const copy = projectMechanics(move, domain, `${childWhere}.${moveId}`);
        if (copy && typeof copy === 'object') delete copy.name;
        moves[moveId] = copy;
      }
      out.moves = moves;
      continue;
    }
    if (domain === 'cards' && key === 'up') {
      const up = projectMechanics(descriptor.value, domain, childWhere);
      if (up && typeof up === 'object') {
        delete up.text;
        delete up.name;
      }
      out.up = up;
      continue;
    }
    if (domain === 'events' && key === 'choices') {
      out.choices = (descriptor.value || []).map((choice, index) => {
        const copy = projectMechanics(choice, domain, `${childWhere}[${index}]`);
        if (copy && typeof copy === 'object') {
          delete copy.text;
          delete copy.label;
        }
        return copy;
      });
      continue;
    }
    const projected = projectMechanics(descriptor.value, domain, childWhere);
    if (projected !== undefined) out[key] = projected;
  }
  return out;
}

function collectHooks(value, pathPrefix, hooks) {
  if (typeof value === 'function') {
    if (HOOK_PATHS.some(([re]) => re.test(pathPrefix))) {
      hooks.push({ path: pathPrefix, source: Function.prototype.toString.call(value), arity: value.length });
    }
    return;
  }
  if (!value || typeof value !== 'object') return;
  for (const key of Object.keys(value)) {
    const descriptor = Object.getOwnPropertyDescriptor(value, key);
    if (!descriptor?.enumerable || !Object.hasOwn(descriptor, 'value')) continue;
    collectHooks(descriptor.value, pathPrefix ? `${pathPrefix}.${key}` : key, hooks);
  }
}

function compareCanonical(label, actual, expected) {
  const left = canonicalJson(actual);
  const right = canonicalJson(expected);
  if (left !== right) {
    throw new Error(`${label} mismatch\nactual sha ${sha256(left)}\nexpected sha ${sha256(right)}`);
  }
}

function liveDomainProjection(domain) {
  if (domain === 'player') {
    return {
      player: projectMechanics(live.PLAYER, 'player', 'player'),
      shop: projectMechanics(live.SHOP, 'shop', 'shop'),
    };
  }
  if (domain === 'cards') return { cards: projectMechanics(live.CARDS, 'cards', 'cards') };
  if (domain === 'statuses') return { statuses: projectMechanics(live.STATUS_INFO, 'statuses', 'statuses') };
  if (domain === 'relics') return { relics: projectMechanics(live.RELICS, 'relics', 'relics') };
  if (domain === 'potions') return { potions: projectMechanics(live.POTIONS, 'potions', 'potions') };
  if (domain === 'enemies') return { enemies: projectMechanics(live.ENEMIES, 'enemies', 'enemies') };
  if (domain === 'events') return { events: projectMechanics(live.EVENTS, 'events', 'events') };
  if (domain === 'omens') {
    return {
      omens: projectMechanics(live.OMENS, 'omens', 'omens'),
      affixes: projectMechanics(live.AFFIXES, 'affixes', 'affixes'),
    };
  }
  if (domain === 'arts') return { arts: projectMechanics(live.ARTS, 'arts', 'arts') };
  if (domain === 'meta') {
    return {
      deeds: projectMechanics(live.DEEDS, 'deeds', 'deeds'),
      aspects: projectMechanics(live.ASPECTS, 'aspects', 'aspects'),
      vows: projectMechanics(live.VOWS, 'vows', 'vows'),
      boons: projectMechanics(live.BOONS, 'boons', 'boons'),
    };
  }
  if (domain === 'progression') {
    const progression = {
      revealThresholds: canonicalise(live.PROGRESSION.revealThresholds),
      poolWaves: {
        define: canonicalise(live.PROGRESSION.poolWaves),
        extend: {},
      },
      features: { emberglass: canonicalise(live.PROGRESSION.emberglass) },
    };
    const quests = {};
    for (const [id, row] of Object.entries(live.QUESTS)) {
      quests[id] = { target: live.QUESTS[id].target };
      if (id === 'hollowLamplighter') quests[id].meetings = [];
    }
    return {
      progression,
      questIds: canonicalise(live.QUEST_IDS),
      quests: canonicalise(quests),
      shadeKits: projectMechanics(live.SHADE_KITS, 'shadeKits', 'shadeKits'),
      variants: projectMechanics(live.VARIANTS, 'variants', 'variants'),
    };
  }
  if (domain === 'themes') {
    return null; // handled specially
  }
  throw new Error(`unsupported domain ${domain}`);
}

function candidateDomainProjection(domain, mod) {
  if (domain === 'player') {
    return {
      player: projectMechanics(mod.PLAYER, 'player', 'player'),
      shop: projectMechanics(mod.SHOP, 'shop', 'shop'),
    };
  }
  if (domain === 'cards') return { cards: projectMechanics(mod.CARDS, 'cards', 'cards') };
  if (domain === 'statuses') return { statuses: projectMechanics(mod.STATUS_INFO, 'statuses', 'statuses') };
  if (domain === 'relics') return { relics: projectMechanics(mod.RELICS, 'relics', 'relics') };
  if (domain === 'potions') return { potions: projectMechanics(mod.POTIONS, 'potions', 'potions') };
  if (domain === 'enemies') return { enemies: projectMechanics(mod.ENEMIES, 'enemies', 'enemies') };
  if (domain === 'events') return { events: projectMechanics(mod.EVENTS, 'events', 'events') };
  if (domain === 'omens') {
    return {
      omens: projectMechanics(mod.OMENS, 'omens', 'omens'),
      affixes: projectMechanics(mod.AFFIXES, 'affixes', 'affixes'),
    };
  }
  if (domain === 'arts') return { arts: projectMechanics(mod.ARTS, 'arts', 'arts') };
  if (domain === 'meta') {
    return {
      deeds: projectMechanics(mod.DEEDS, 'deeds', 'deeds'),
      aspects: projectMechanics(mod.ASPECTS, 'aspects', 'aspects'),
      vows: projectMechanics(mod.VOWS, 'vows', 'vows'),
      boons: projectMechanics(mod.BOONS, 'boons', 'boons'),
    };
  }
  if (domain === 'progression') {
    const target = assertDataProperty(mod.QUESTS.hollowLamplighter, 'target', 'quests.hollowLamplighter.target');
    assert.equal(target, live.PROGRESSION.emberglass.hollowLamplighter.completeAt);
    assert.equal(target, 5);
    return {
      progression: canonicalise(mod.coreProgressionAuthoring),
      questIds: canonicalise(mod.QUEST_IDS),
      quests: canonicalise(Object.fromEntries(Object.entries(mod.QUESTS).map(([id, row]) => {
        const out = { target: assertDataProperty(row, 'target', `quests.${id}.target`) };
        if (id === 'hollowLamplighter') out.meetings = [];
        return [id, out];
      }))),
      shadeKits: projectMechanics(mod.SHADE_KITS, 'shadeKits', 'shadeKits'),
      variants: projectMechanics(mod.VARIANTS, 'variants', 'variants'),
    };
  }
  throw new Error(`unsupported domain ${domain}`);
}

function compareHooks(domain, candidateRoot, liveRoot, prefix) {
  const candidateHooks = [];
  const liveHooks = [];
  collectHooks(candidateRoot, prefix, candidateHooks);
  collectHooks(liveRoot, prefix, liveHooks);
  compareCanonical(`${domain} behaviour hooks`, candidateHooks, liveHooks);
}

async function checkDomain(domain) {
  const mod = await importCandidate(domain);
  if (domain === 'themes') {
    await checkThemes(mod);
    console.log(`ok domain ${domain}`);
    return;
  }
  const expected = liveDomainProjection(domain);
  const actual = candidateDomainProjection(domain, mod);
  compareCanonical(`${domain} raw mechanics`, actual, expected);

  if (domain === 'enemies') compareHooks(domain, mod.ENEMIES, live.ENEMIES, 'enemies');
  if (domain === 'events') compareHooks(domain, mod.EVENTS, live.EVENTS, 'events');
  if (domain === 'progression') {
    compareHooks(domain, mod.SHADE_KITS, live.SHADE_KITS, 'shadeKits');
  }

  // Hydrated runtime compatibility for the domain's live export names.
  for (const exportName of DOMAIN_LIVE[domain]) {
    if (exportName === 'PROGRESSION') {
      const flat = {
        revealThresholds: mod.coreProgressionAuthoring.revealThresholds,
        poolWaves: mod.coreProgressionAuthoring.poolWaves.define,
        emberglass: mod.coreProgressionAuthoring.features.emberglass,
      };
      compareCanonical('PROGRESSION', flat, {
        revealThresholds: live.PROGRESSION.revealThresholds,
        poolWaves: live.PROGRESSION.poolWaves,
        emberglass: live.PROGRESSION.emberglass,
      });
      continue;
    }
    if (exportName === 'QUESTS') {
      for (const id of Object.keys(live.QUESTS)) {
        assert.equal(mod.QUESTS[id].target, live.QUESTS[id].target, `QUESTS.${id}.target`);
      }
      const hollowDesc = Object.getOwnPropertyDescriptor(mod.QUESTS.hollowLamplighter, 'target');
      assert.ok(Object.hasOwn(hollowDesc, 'value'), 'hollow target must be data property');
      continue;
    }
    if (exportName === 'ASPECTS') {
      compareCanonical('ASPECTS mechanics', projectMechanics(mod.ASPECTS, 'aspects'), projectMechanics(live.ASPECTS, 'aspects'));
      continue;
    }
    if (exportName === 'VARIANTS') {
      compareCanonical('VARIANTS mechanics', projectMechanics(mod.VARIANTS, 'variants'), projectMechanics(live.VARIANTS, 'variants'));
      continue;
    }
    if (exportName === 'SHADE_KITS') {
      compareCanonical('SHADE_KITS mechanics', projectMechanics(mod.SHADE_KITS, 'shadeKits'), projectMechanics(live.SHADE_KITS, 'shadeKits'));
      continue;
    }
    const candidateValue = mod[exportName];
    const liveValue = live[exportName];
    const schemaDomain = {
      PLAYER: 'player', SHOP: 'shop', CARDS: 'cards', STATUS_INFO: 'statuses',
      RELICS: 'relics', POTIONS: 'potions', ENEMIES: 'enemies', EVENTS: 'events',
      OMENS: 'omens', AFFIXES: 'affixes', ARTS: 'arts', DEEDS: 'deeds',
      VOWS: 'vows', BOONS: 'boons', QUEST_IDS: null,
    }[exportName];
    if (schemaDomain) {
      compareCanonical(exportName, projectMechanics(candidateValue, schemaDomain), projectMechanics(liveValue, schemaDomain));
    } else {
      compareCanonical(exportName, candidateValue, liveValue);
    }
  }
  console.log(`ok domain ${domain}`);
}

async function checkThemes(mod) {
  const themeIds = Object.keys(mod.THEMES);
  assert.deepEqual(themeIds, ['act1', 'act2', 'act3']);
  for (const [index, themeId] of themeIds.entries()) {
    const theme = mod.THEMES[themeId];
    for (const required of [
      'legacyAct', 'plates', 'weather', 'palette', 'music', 'roster',
      'encounters', 'rewardGold', 'mapHaze', 'lanternLights', 'bossPlates',
    ]) {
      assert.ok(Object.hasOwn(theme, required), `themes.${themeId}.${required}`);
      const descriptor = Object.getOwnPropertyDescriptor(theme, required);
      assert.ok(Object.hasOwn(descriptor, 'value'), `themes.${themeId}.${required} must be data`);
    }
    assert.equal(theme.name, undefined, 'theme name is locale-owned');
    assert.equal(theme.tagline, undefined, 'theme tagline is locale-owned');
    assert.equal(theme.bossName, undefined, 'theme bossName is locale-owned');
    // Presentation fields required for createContentContext.
    assert.equal(typeof theme.music, 'string');
    assert.ok(STATIC_REFERENCE_CATALOGUES.musicIds.has(theme.music), `music ${theme.music}`);
    assert.ok(STATIC_REFERENCE_CATALOGUES.tokenIds.has(theme.mapHaze), `mapHaze ${theme.mapHaze}`);
    for (const value of Object.values(theme.palette)) {
      assert.ok(STATIC_REFERENCE_CATALOGUES.tokenIds.has(value), `palette token ${value}`);
    }
    assert.ok(Array.isArray(theme.lanternLights));
    assert.equal(Object.getPrototypeOf(theme.bossPlates), Object.prototype);

    const loc = english.acts[index] || english.acts[String(index)] || {};
    const projectedAct = {
      boss: theme.legacyAct.boss,
      theme: theme.legacyAct.theme,
      ...(loc.name !== undefined ? { name: loc.name } : {}),
      ...(loc.tagline !== undefined ? { tagline: loc.tagline } : {}),
      ...(loc.bossName !== undefined ? { bossName: loc.bossName } : {}),
    };
    compareCanonical(`ACTS[${index}]`, projectedAct, live.ACTS[index]);
    compareCanonical(`ENCOUNTERS[${index}]`, theme.encounters, live.ENCOUNTERS[index]);
    compareCanonical(`REWARD_GOLD[${index}]`, theme.rewardGold, live.REWARD_GOLD[index]);
  }
}

async function checkAll() {
  const contentPath = path.join(root, 'src/content.js');
  if (!(await fileExists(contentPath))) throw new Error('src/content.js missing');
  const { CORE_CONTENT } = await import(`${pathToFileURL(contentPath).href}?all=${Date.now()}`);
  assert.equal(CORE_CONTENT.id, 'core');
  assert.deepEqual(CORE_CONTENT.themeOrder, ['act1', 'act2', 'act3']);

  for (const name of CONTENT_EXPORT_NAMES) {
    const viewKey = VIEW_MAP[name];
    assert.ok(viewKey, `missing view map for ${name}`);
    compareCanonical(name, CORE_CONTENT[viewKey], live[name]);
  }

  // Exactly 29 arity-one enemy/shade AI functions; schedules via toString + live parity.
  let aiCount = 0;
  for (const [id, row] of Object.entries(CORE_CONTENT.enemies)) {
    if (typeof row.ai !== 'function') continue;
    assert.equal(row.ai.length, 1, `${id} ai arity`);
    assert.equal(row.ai.toString(), live.ENEMIES[id].ai.toString(), `${id} ai source`);
    aiCount++;
  }
  for (const [id, row] of Object.entries(CORE_CONTENT.shadeKits)) {
    assert.equal(typeof row.ai, 'function');
    assert.equal(row.ai.length, 1, `${id} shade ai arity`);
    assert.equal(row.ai.toString(), live.SHADE_KITS[id].ai.toString(), `${id} shade ai source`);
    aiCount++;
  }
  assert.equal(aiCount, 29, 'exactly 29 enemy/shade AI functions');

  const hollowDesc = Object.getOwnPropertyDescriptor(CORE_CONTENT.quests.hollowLamplighter, 'target');
  assert.ok(Object.hasOwn(hollowDesc, 'value'), 'context hollow target is data property');
  assert.equal(CORE_CONTENT.quests.hollowLamplighter.target, 5);

  // Joined candidate still definePack-valid when rebuilt from authoring API.
  const { createCoreAuthoring } = await import(pathToFileURL(path.join(coreDir, 'index.js')).href);
  const pack = definePack({ id: 'core-check', ...createCoreAuthoring() });
  const localeContent = joinLocaleContent([Object.fromEntries(
    Object.entries(english).filter(([, value]) => value !== undefined),
  )]);
  const ctx = createContentContext([pack], {
    id: 'core-check',
    resources: STATIC_REFERENCE_CATALOGUES,
    localeContent,
    localeToken: 'en',
  });
  for (const name of CONTENT_EXPORT_NAMES) {
    compareCanonical(`rebuilt ${name}`, ctx[VIEW_MAP[name]], live[name]);
  }
  console.log('ok all');
}

function parseArgs(argv) {
  const options = { domain: null, all: false };
  for (let index = 0; index < argv.length; index++) {
    const arg = argv[index];
    if (arg === '--all') options.all = true;
    else if (arg === '--domain') options.domain = argv[++index];
    else throw new Error(`Unknown argument ${arg}`);
  }
  if (options.all === Boolean(options.domain)) throw new Error('select exactly one of --all or --domain');
  return options;
}

async function main(argv) {
  const options = parseArgs(argv);
  if (options.all) await checkAll();
  else await checkDomain(options.domain);
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  main(process.argv.slice(2)).catch((error) => {
    fail(error?.stack || error);
  });
}
