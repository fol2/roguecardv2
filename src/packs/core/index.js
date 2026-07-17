// Core pack assembly — mutable authoring graph + frozen CORE_PACK.
import { definePack } from '../../registry.js';
import { PLAYER, SHOP } from './player.js';
import { CARDS } from './cards.js';
import { STATUS_INFO } from './statuses.js';
import { RELICS } from './relics.js';
import { POTIONS } from './potions.js';
import { ENEMIES } from './enemies.js';
import { EVENTS } from './events.js';
import { OMENS, AFFIXES } from './omens.js';
import { ARTS } from './arts.js';
import { DEEDS, ASPECTS, VOWS, BOONS } from './meta.js';
import {
  coreProgressionAuthoring, QUEST_IDS, buildCoreQuests, SHADE_KITS, VARIANTS,
} from './progression.js';
import { THEMES } from './themes.js';

const OVERRIDE_DOMAINS = new Set(['progression', 'quests', 'variants']);

function isPlainObject(value) {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

function cloneGraph(value, seen = new Map()) {
  if (typeof value === 'function') return value;
  if (value === null || typeof value !== 'object') return value;
  if (seen.has(value)) return seen.get(value);
  const copy = Array.isArray(value) ? [] : {};
  seen.set(value, copy);
  for (const key of Reflect.ownKeys(value)) {
    const descriptor = Object.getOwnPropertyDescriptor(value, key);
    if (!descriptor?.enumerable || !Object.hasOwn(descriptor, 'value')) continue;
    copy[key] = cloneGraph(descriptor.value, seen);
  }
  return copy;
}

function deepMergeDeclared(target, patch, path) {
  if (patch === undefined) return target;
  if (!isPlainObject(patch)) {
    throw new Error(`Unknown override path ${path}: expected plain object`);
  }
  for (const key of Object.keys(patch)) {
    const nextPath = `${path}.${key}`;
    if (!Object.hasOwn(target, key) && !isPlainObject(target[key]) && target[key] === undefined
      && !isPlainObject(patch[key])) {
      // Allow adding nested keys only under already-declared containers.
    }
    if (!Object.hasOwn(target, key)) {
      throw new Error(`Unknown override path ${nextPath}`);
    }
    if (isPlainObject(target[key]) && isPlainObject(patch[key])) {
      deepMergeDeclared(target[key], patch[key], nextPath);
    } else if (Array.isArray(target[key]) && Array.isArray(patch[key])) {
      target[key] = cloneGraph(patch[key]);
    } else if (typeof target[key] === 'function' || typeof patch[key] === 'function') {
      throw new Error(`Unknown override path ${nextPath}`);
    } else {
      target[key] = cloneGraph(patch[key]);
    }
  }
  return target;
}

/** Re-materialise Hollow quest targets and variant stat aliases from the graph. */
export function deriveCoreCouplings(authoring) {
  if (!authoring?.progression?.features?.emberglass) {
    throw new Error('deriveCoreCouplings requires progression.features.emberglass');
  }
  const eg = authoring.progression.features.emberglass;
  const quests = authoring.quests || (authoring.quests = {});
  for (const [id, row] of Object.entries(buildCoreQuests(authoring.progression.features))) {
    if (!quests[id]) quests[id] = { ...row };
    else {
      quests[id].target = row.target;
      if (id === 'hollowLamplighter') {
        if (!Array.isArray(quests[id].meetings)) quests[id].meetings = [];
      }
    }
  }
  // Hollow must be an own enumerable numeric data property (no getter).
  Object.defineProperty(quests.hollowLamplighter, 'target', {
    value: eg.hollowLamplighter.completeAt,
    writable: true,
    enumerable: true,
    configurable: true,
  });

  const variants = authoring.variants || {};
  const pale = eg.variantStats.pale;
  const shadeTier = eg.ownShade.tiers;
  if (variants.paleDuskfang) variants.paleDuskfang.statMods = pale;
  if (variants.paleDrownedOne) variants.paleDrownedOne.statMods = pale;
  if (variants.paleVoidWisp) variants.paleVoidWisp.statMods = pale;
  if (variants.ownShade1) {
    variants.ownShade1.statMods = shadeTier[0];
    variants.ownShade1.scale = shadeTier[0].scale;
  }
  if (variants.ownShade2) {
    variants.ownShade2.statMods = shadeTier[1];
    variants.ownShade2.scale = shadeTier[1].scale;
  }
  if (variants.ownShade3) {
    variants.ownShade3.statMods = shadeTier[2];
    variants.ownShade3.scale = shadeTier[2].scale;
  }
  if (variants.usurpedSovereign) {
    variants.usurpedSovereign.statMods = eg.variantStats.usurper;
  }
  return authoring;
}

/**
 * Fresh mutable complete policy-domain graph. Deep-merges only declared
 * progression / quests / variants overrides; never mutates module singletons.
 */
export function createCoreAuthoring(overrides = {}) {
  if (!isPlainObject(overrides)) throw new TypeError('createCoreAuthoring overrides must be a plain object');
  for (const key of Object.keys(overrides)) {
    if (!OVERRIDE_DOMAINS.has(key)) throw new Error(`Unknown override path ${key}`);
  }
  const authoring = {
    player: cloneGraph(PLAYER),
    shop: cloneGraph(SHOP),
    cards: cloneGraph(CARDS),
    statuses: cloneGraph(STATUS_INFO),
    relics: cloneGraph(RELICS),
    potions: cloneGraph(POTIONS),
    enemies: cloneGraph(ENEMIES),
    events: cloneGraph(EVENTS),
    omens: cloneGraph(OMENS),
    affixes: cloneGraph(AFFIXES),
    arts: cloneGraph(ARTS),
    deeds: cloneGraph(DEEDS),
    aspects: cloneGraph(ASPECTS),
    vows: cloneGraph(VOWS),
    boons: cloneGraph(BOONS),
    themes: cloneGraph(THEMES),
    questIds: cloneGraph(QUEST_IDS),
    shadeKits: cloneGraph(SHADE_KITS),
    progression: cloneGraph(coreProgressionAuthoring),
    quests: buildCoreQuests(cloneGraph(coreProgressionAuthoring).features),
    variants: cloneGraph(VARIANTS),
  };
  if (overrides.progression) deepMergeDeclared(authoring.progression, overrides.progression, 'progression');
  if (overrides.quests) deepMergeDeclared(authoring.quests, overrides.quests, 'quests');
  if (overrides.variants) deepMergeDeclared(authoring.variants, overrides.variants, 'variants');
  return deriveCoreCouplings(authoring);
}

export const CORE_PACK = definePack({
  id: 'core',
  ...createCoreAuthoring(),
});
