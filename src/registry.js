import { hydrateContent } from './i18n/hydrate-content.js';
import { STATIC_REFERENCE_CATALOGUES } from './content-resources.js';

export const MERGE_POLICIES = Object.freeze({
  player: 'singleton', shop: 'singleton',
  cards: 'keyed-unique', statuses: 'keyed-unique', relics: 'keyed-unique',
  potions: 'keyed-unique', enemies: 'keyed-unique', events: 'keyed-unique',
  omens: 'keyed-unique', affixes: 'keyed-unique', arts: 'keyed-unique',
  deeds: 'keyed-unique', quests: 'keyed-unique', variants: 'keyed-unique',
  shadeKits: 'keyed-unique', boons: 'keyed-unique', themes: 'keyed-unique',
  aspects: 'append-unique-id', vows: 'append', questIds: 'append-unique',
  progression: 'nested-declared',
});

export const PROGRESSION_MERGE_POLICIES = Object.freeze({
  revealThresholds: 'keyed-unique',
  poolWaves: Object.freeze({
    definitions: 'keyed-unique', extensions: 'existing-key-explicit',
    members: 'append-unique', gateAssignment: 'globally-unique',
  }),
  features: 'keyed-unique-flatten',
});

const field = (kind, source = 'pack', extra = {}) => Object.freeze({ kind, source, ...extra });
const schema = (fields) => Object.freeze({ fields: Object.freeze(fields) });
export const CONTENT_SCHEMAS = Object.freeze({
  player: schema({ id: field('string'), name: field('string', 'locale'), blurb: field('string', 'locale') }),
  shop: schema({}),
  cards: schema({
    type: field('string'), rarity: field('string'), cost: field('number'), target: field('string'),
    vfx: field('string', 'pack', { reference: 'vfx-id' }), effects: field('array'), up: field('object'),
    name: field('string', 'locale'), text: field('string', 'locale'), textUp: field('string', 'locale'),
  }),
  statuses: schema({ name: field('string', 'locale'), desc: field('string', 'locale') }),
  relics: schema({ name: field('string', 'locale'), text: field('string', 'locale') }),
  potions: schema({ name: field('string', 'locale'), text: field('string', 'locale') }),
  enemies: schema({
    hp: field('array'), facets: field('number'), art: field('object'), moves: field('object'),
    ai: field('function', 'pack', { arity: 1 }), name: field('string', 'locale'),
  }),
  events: schema({
    name: field('string', 'locale'), text: field('string', 'locale'), choices: field('array'),
    onEnter: field('function', 'pack', { arity: 1 }),
    onChoose: field('function', 'pack', { arity: 1 }),
    apply: field('function', 'pack', { arity: 1 }),
    condition: field('function', 'pack', { arity: 1 }),
  }),
  omens: schema({ name: field('string', 'locale'), text: field('string', 'locale') }),
  affixes: schema({ name: field('string', 'locale'), text: field('string', 'locale') }),
  arts: schema({ name: field('string', 'locale'), text: field('string', 'locale') }),
  deeds: schema({ name: field('string', 'locale'), desc: field('string', 'locale') }),
  quests: schema({ name: field('string', 'locale') }),
  variants: schema({ base: field('string', 'pack', { reference: 'variant-base' }), name: field('string', 'locale'), dialogue: field('array', 'locale'), deathDialogue: field('string', 'locale') }),
  shadeKits: schema({ moves: field('object'), ai: field('function', 'pack', { arity: 1 }) }),
  boons: schema({ name: field('string', 'locale'), text: field('string', 'locale') }),
  themes: schema({
    legacyAct: field('object'), plates: field('object'), weather: field('object'),
    palette: field('object'), music: field('string', 'pack', { reference: 'music-id' }),
    roster: field('array'), encounters: field('array'), rewardGold: field('array'),
    mapHaze: field('string', 'pack', { reference: 'token-id' }), lanternLights: field('array'),
    bossPlates: field('object'), name: field('string', 'locale'), tagline: field('string', 'locale'),
    bossName: field('string', 'locale'),
  }),
  aspects: schema({ id: field('string'), name: field('string', 'locale'), blurb: field('string', 'locale') }),
  vows: schema({ name: field('string', 'locale'), desc: field('string', 'locale') }),
  questIds: schema({}), progression: schema({}),
});

const KNOWN_ENTRY_FIELDS = Object.freeze({
  player: new Set(['id', 'hue', 'art', 'maxHp', 'hp', 'energy', 'handSize', 'potionSlots', 'startDeck', 'deck', 'startRelic', 'startGold', 'gold', 'name', 'blurb']),
  shop: new Set(['removeCost', 'cardPrice', 'relicPrice', 'potionPrice', 'cardCount', 'relicCount', 'potionCount']),
  cards: new Set(['type', 'rarity', 'cost', 'target', 'vfx', 'effects', 'up', 'chip', 'exhaust', 'locked', 'unplayable', 'unremovable', 'endTurnDmg', 'endTurnLoseHp', 'name', 'text', 'textUp']),
  statuses: new Set(['icon', 'kind', 'name', 'desc']),
  relics: new Set(['rarity', 'glyph', 'tone', 'instant', 'locked', 'name', 'text']),
  potions: new Set(['tone', 'glyph', 'combatOnly', 'needsTarget', 'name', 'text']),
  enemies: new Set(['hp', 'facets', 'art', 'elite', 'boss', 'startStatus', 'moves', 'ai', 'name']),
  events: new Set(['glyph', 'hue', 'choices', 'name', 'text', 'onEnter', 'onChoose', 'apply', 'condition']),
  omens: new Set(['glyph', 'tone', 'mods', 'name', 'text']),
  affixes: new Set(['tone', 'mods', 'name', 'text']),
  arts: new Set(['glyph', 'tone', 'cost', 'effects', 'name', 'text']),
  deeds: new Set(['stat', 'n', 'unlocks', 'name', 'desc']),
  quests: new Set(['target', 'name', 'mode', 'inscription', 'huntName', 'huntInscription', 'progress', 'fragments', 'final', 'itemName', 'itemText', 'poor', 'bought', 'death', 'resolved', 'floorEchoes', 'pages', 'meetings']),
  variants: new Set(['id', 'base', 'tint', 'scale', 'statMods', 'drop', 'name', 'dialogue', 'deathDialogue']),
  shadeKits: new Set(['art', 'moves', 'ai']),
  boons: new Set(['ops', 'name', 'text']),
  themes: new Set(['legacyAct', 'plates', 'weather', 'palette', 'music', 'roster', 'encounters', 'rewardGold', 'mapHaze', 'lanternLights', 'bossPlates', 'name', 'tagline', 'bossName']),
  aspects: new Set(['id', 'hue', 'art', 'maxHp', 'hp', 'energy', 'handSize', 'potionSlots', 'startDeck', 'deck', 'startRelic', 'startGold', 'gold', 'name', 'blurb']),
  vows: new Set(['mods', 'name', 'desc']),
});

export class ContentValidationError extends Error {
  constructor(message, problems) {
    super(`${message}: ${problems.map((problem) => `${problem.code.replaceAll('-', ' ')} at ${problem.field}`).join('; ')}`);
    this.name = 'ContentValidationError';
    this.problems = Object.freeze(problems.map((problem) => Object.freeze(problem)));
  }
}

const PROTOCOL_FIELDS = new Set(['QUEST_STATES', 'QUEST_ACTIVE_STATES', 'TERMINAL_OUTCOMES', 'RUN_ID_RE']);
const DERIVED_FIELDS = new Set(['cardPools', 'relicPools', 'acts', 'encounters', 'rewardGold', 'reveals', 'poolGate', 'themeOrder']);
const RESERVED_FEATURES = new Set(['revealThresholds', 'poolWaves']);
const registryMetadata = new WeakMap();
const packMetadata = new WeakMap();

const actualLabel = (value) => {
  if (value === undefined) return 'missing';
  if (value === null) return 'null';
  if (Array.isArray(value)) return 'array';
  return typeof value;
};

function problem(code, { severity = 'error', packId = 'registry', domain = 'registry', entryId = 'registry', field: path = domain, expected = 'valid content', actual = 'invalid content', hint = 'Correct the declared content.' } = {}) {
  return { code, severity, packId: String(packId || 'registry'), domain: String(domain), entryId: String(entryId || domain), field: String(path), expected: String(expected), actual: String(actual), hint: String(hint) };
}

function isPlainObject(value) {
  if (value === null || typeof value !== 'object') return false;
  const proto = Object.getPrototypeOf(value);
  return proto === Object.prototype || proto === null;
}

function hookAllowed(path, value) {
  return typeof value === 'function' && (/^(?:enemies|shadeKits)\.[^.]+\.ai$/.test(path)
    || /^events\.[^.]+\.(?:onEnter|onChoose|apply|condition)$/.test(path));
}

function snapshotDescriptorFirst(value, path, packId, problems, seen = new Map()) {
  if (value === null || typeof value !== 'object') {
    if (typeof value === 'function' && !hookAllowed(path, value)) {
      problems.push(problem('function-not-allowed', { packId, domain: path.split('.')[0], entryId: path.split('.')[1] || packId, field: path, expected: 'serialisable data property', actual: 'function', hint: 'Functions are allowed only at declared behaviour hooks.' }));
    }
    return value;
  }
  if (seen.has(value)) return seen.get(value);
  const copy = Array.isArray(value) ? [] : {};
  seen.set(value, copy);
  for (const key of Reflect.ownKeys(value)) {
    const keyText = typeof key === 'symbol' ? key.toString() : key;
    const childPath = path ? `${path}.${keyText}` : keyText;
    const descriptor = Object.getOwnPropertyDescriptor(value, key);
    if (!descriptor?.enumerable) continue;
    if (!Object.hasOwn(descriptor, 'value')) {
      problems.push(problem('accessor-not-allowed', { packId, domain: path.split('.')[0] || 'pack', entryId: path.split('.')[1] || packId, field: childPath, expected: 'own enumerable data property', actual: 'accessor', hint: 'Materialise this value before registering the pack.' }));
      continue;
    }
    copy[key] = snapshotDescriptorFirst(descriptor.value, childPath, packId, problems, seen);
  }
  return copy;
}

function cloneGraph(value, seen = new Map()) {
  if (!value || typeof value !== 'object') return value;
  if (seen.has(value)) return seen.get(value);
  const copy = Array.isArray(value) ? [] : {};
  seen.set(value, copy);
  for (const key of Reflect.ownKeys(value)) {
    const descriptor = Object.getOwnPropertyDescriptor(value, key);
    if (descriptor?.enumerable && Object.hasOwn(descriptor, 'value')) copy[key] = cloneGraph(descriptor.value, seen);
  }
  return copy;
}

function freezeGraph(value, seen = new Set()) {
  if (!value || typeof value !== 'object' || seen.has(value)) return value;
  seen.add(value);
  for (const key of Reflect.ownKeys(value)) {
    const descriptor = Object.getOwnPropertyDescriptor(value, key);
    if (descriptor && Object.hasOwn(descriptor, 'value')) freezeGraph(descriptor.value, seen);
  }
  return Object.freeze(value);
}

function validatePackShape(pack, problems) {
  const packId = pack.id || 'unknown-pack';
  if (typeof pack.id !== 'string' || !pack.id.trim()) {
    problems.push(problem('invalid-pack-id', { packId, field: 'id', expected: 'non-empty stable pack id', actual: actualLabel(pack.id), hint: 'Give the pack a non-empty string id.' }));
  }
  for (const key of Object.keys(pack)) {
    if (key === 'id' || Object.hasOwn(MERGE_POLICIES, key)) continue;
    const code = key === 'whispers' ? 'locale-field-in-pack' : DERIVED_FIELDS.has(key) ? 'derived-field-in-pack' : PROTOCOL_FIELDS.has(key) ? 'protocol-field-in-pack' : 'unknown-domain';
    problems.push(problem(code, { packId, domain: key, entryId: packId, field: key, expected: key === 'whispers' ? 'source: locale' : 'declared mechanics domain', actual: 'pack field', hint: 'Remove this field from mechanics authoring.' }));
  }
  for (const [domain, domainSchema] of Object.entries(CONTENT_SCHEMAS)) {
    if (!Object.hasOwn(pack, domain) || ['progression', 'questIds'].includes(domain)) continue;
    const rows = ['player', 'shop'].includes(domain) ? [[packId, pack[domain]]] : Array.isArray(pack[domain]) ? pack[domain].map((row, index) => [row?.id ?? index, row]) : Object.entries(pack[domain] || {});
    for (const [entryId, row] of rows) {
      if (!row || typeof row !== 'object') continue;
      for (const key of Object.keys(row)) {
        if (KNOWN_ENTRY_FIELDS[domain] && !KNOWN_ENTRY_FIELDS[domain].has(key)) problems.push(problem('unknown-field', { severity: 'warning', packId, domain, entryId, field: `${domain}.${entryId}.${key}`, expected: 'schema-declared field', actual: 'unknown key', hint: 'Confirm the field spelling or extend the schema.' }));
      }
      for (const [key, spec] of Object.entries(domainSchema.fields)) {
        if (spec.source === 'locale' && Object.hasOwn(row, key)) {
          problems.push(problem('locale-field-in-pack', { packId, domain, entryId, field: `${domain}.${entryId}.${key}`, expected: 'source: locale', actual: 'source: pack', hint: 'Move display copy to a locale fragment.' }));
        }
      }
      if (domain === 'events') {
        for (const key of ['onEnter', 'onChoose', 'apply', 'condition']) {
          if (row[key] !== undefined && (typeof row[key] !== 'function' || row[key].length !== 1)) problems.push(problem('invalid-behaviour-hook', { packId, domain, entryId, field: `${domain}.${entryId}.${key}`, expected: 'function with arity 1', actual: typeof row[key] === 'function' ? `arity ${row[key].length}` : actualLabel(row[key]), hint: 'Declare a one-argument behaviour function.' }));
        }
      }
      if (domain === 'enemies' || domain === 'shadeKits') {
        if (row.ai !== undefined && (typeof row.ai !== 'function' || row.ai.length !== 1)) {
          problems.push(problem('invalid-behaviour-hook', { packId, domain, entryId, field: `${domain}.${entryId}.ai`, expected: 'function with arity 1', actual: typeof row.ai === 'function' ? `arity ${row.ai.length}` : actualLabel(row.ai), hint: 'Declare a one-argument behaviour function.' }));
        }
        for (const [moveId, move] of Object.entries(row.moves || {})) {
          if (move && Object.hasOwn(move, 'name')) problems.push(problem('locale-field-in-pack', { packId, domain, entryId, field: `${domain}.${entryId}.moves.${moveId}.name`, expected: 'source: locale', actual: 'source: pack', hint: 'Move the move name to the locale fragment.' }));
        }
      }
    }
  }
  for (const [id, card] of Object.entries(pack.cards || {})) {
    for (const required of ['type', 'rarity', 'cost', 'target', 'vfx', 'effects']) {
      if (!Object.hasOwn(card, required)) problems.push(problem('required-field-missing', { packId, domain: 'cards', entryId: id, field: `cards.${id}.${required}`, expected: required === 'effects' ? 'array' : 'required pack field', actual: 'missing', hint: `Declare cards.${id}.${required}.` }));
    }
  }
  for (const [id, enemy] of Object.entries(pack.enemies || {})) {
    for (const required of ['hp', 'moves', 'ai']) if (!Object.hasOwn(enemy, required)) problems.push(problem('required-field-missing', { packId, domain: 'enemies', entryId: id, field: `enemies.${id}.${required}`, expected: 'required pack field', actual: 'missing', hint: `Declare enemies.${id}.${required}.` }));
  }
  for (const [id, theme] of Object.entries(pack.themes || {})) {
    for (const required of ['legacyAct', 'plates', 'weather', 'palette', 'music', 'roster', 'encounters', 'rewardGold', 'mapHaze', 'lanternLights', 'bossPlates']) {
      if (!Object.hasOwn(theme, required)) problems.push(problem('required-field-missing', { packId, domain: 'themes', entryId: id, field: `themes.${id}.${required}`, expected: 'required theme field', actual: 'missing', hint: `Declare themes.${id}.${required}.` }));
    }
    const legacy = theme.legacyAct;
    if (legacy && (!isPlainObject(legacy.theme) || typeof legacy.boss !== 'string' || !['sky', 'fog', 'particles', 'glow', 'accent', 'ember'].every((key) => typeof legacy.theme[key] === 'string'))) {
      problems.push(problem('invalid-legacy-act', { packId, domain: 'themes', entryId: id, field: `themes.${id}.legacyAct`, expected: '{boss,theme:{sky,fog,particles,glow,accent,ember}}', actual: 'incomplete object', hint: 'Supply the exact legacy compatibility values.' }));
    }
    if (Object.hasOwn(theme, 'lanternLights') && !Array.isArray(theme.lanternLights)) {
      problems.push(problem('invalid-lantern-lights', { packId, domain: 'themes', entryId: id, field: `themes.${id}.lanternLights`, expected: 'array', actual: actualLabel(theme.lanternLights), hint: 'Declare lanternLights as an ambient light-position array.' }));
    }
    if (Object.hasOwn(theme, 'bossPlates') && !isPlainObject(theme.bossPlates)) {
      problems.push(problem('invalid-boss-plates', { packId, domain: 'themes', entryId: id, field: `themes.${id}.bossPlates`, expected: 'plain object (empty object permitted)', actual: Array.isArray(theme.bossPlates) ? 'array' : actualLabel(theme.bossPlates), hint: 'Declare bossPlates as a keyed override object; use {} when empty.' }));
    }
  }
}

export function definePack(input) {
  const problems = [];
  const packIdDescriptor = input && typeof input === 'object' ? Object.getOwnPropertyDescriptor(input, 'id') : null;
  const packId = packIdDescriptor && Object.hasOwn(packIdDescriptor, 'value') ? packIdDescriptor.value : 'unknown-pack';
  const copy = snapshotDescriptorFirst(input, '', packId, problems);
  if (!isPlainObject(copy)) problems.push(problem('invalid-pack', { packId, field: 'pack', expected: 'plain object', actual: actualLabel(copy), hint: 'Pass a plain mechanics pack object.' }));
  else validatePackShape(copy, problems);
  if (problems.some(({ severity }) => severity === 'error')) throw new ContentValidationError('Invalid content pack', problems);
  const pack = freezeGraph(copy);
  packMetadata.set(pack, Object.freeze({ problems: Object.freeze(problems.map((item) => Object.freeze(item))) }));
  return pack;
}

function appendUnique(target, values, label, packId, errors, owners = null) {
  for (const value of values || []) {
    const id = typeof value === 'object' ? value?.id : value;
    if (target.some((entry) => (typeof entry === 'object' ? entry?.id : entry) === id)) {
      errors.push(problem('duplicate-entry', { packId, domain: label, entryId: id, field: `${label}.${id}`, expected: 'unique id', actual: 'duplicate', hint: `Remove the duplicate ${id}.` }));
    } else {
      target.push(value);
      if (owners) owners.set(id, packId);
    }
  }
}

function mergeProgression(target, incoming, packId, errors, owners) {
  if (!incoming) return;
  const thresholds = incoming.revealThresholds || {};
  const waves = incoming.poolWaves || { define: {}, extend: {} };
  const features = incoming.features || {};
  for (const [id, value] of Object.entries(thresholds)) {
    if (Object.hasOwn(target.revealThresholds, id)) errors.push(problem('duplicate-progression-threshold', { packId, domain: 'progression', entryId: id, field: `progression.revealThresholds.${id}`, expected: 'unique threshold owner', actual: 'duplicate', hint: 'Use a new threshold id.' }));
    else target.revealThresholds[id] = value;
  }
  for (const [id, value] of Object.entries(waves.define || {})) {
    if (Object.hasOwn(target.poolWaves, id)) {
      errors.push(problem('duplicate-pool-wave', { packId, domain: 'progression', entryId: id, field: `progression.poolWaves.define.${id}`, expected: 'new wave id', actual: 'duplicate', hint: 'Extend an earlier wave explicitly instead.' }));
      continue;
    }
    target.poolWaves[id] = { cards: [], relics: [] };
    for (const kind of ['cards', 'relics']) for (const member of value[kind] || []) {
      if (owners.gates.has(member)) errors.push(problem('duplicate-gate-assignment', { packId, domain: 'progression', entryId: member, field: `progression.poolWaves.define.${id}.${kind}`, expected: 'content id assigned to one gate', actual: `already assigned to ${owners.gates.get(member)}`, hint: 'Remove the second gate assignment.' }));
      else { owners.gates.set(member, id); target.poolWaves[id][kind].push(member); }
    }
  }
  for (const [id, value] of Object.entries(waves.extend || {})) {
    if (!Object.hasOwn(target.poolWaves, id)) {
      errors.push(problem('unknown-pool-wave-extension', { packId, domain: 'progression', entryId: id, field: `progression.poolWaves.extend.${id}`, expected: 'wave defined by an earlier pack', actual: 'unknown or forward target', hint: 'Move the defining pack earlier or correct the id.' }));
      continue;
    }
    for (const kind of ['cards', 'relics']) for (const member of value[kind] || []) {
      if (owners.gates.has(member)) errors.push(problem('duplicate-pool-member', { packId, domain: 'progression', entryId: member, field: `progression.poolWaves.extend.${id}.${kind}`, expected: 'new globally gated content id', actual: `already assigned to ${owners.gates.get(member)}`, hint: 'Remove the duplicate member.' }));
      else { owners.gates.set(member, id); target.poolWaves[id][kind].push(member); }
    }
  }
  for (const [id, value] of Object.entries(features)) {
    if (RESERVED_FEATURES.has(id)) errors.push(problem('reserved-progression-feature', { packId, domain: 'progression', entryId: id, field: `progression.features.${id}`, expected: 'non-reserved feature namespace', actual: 'reserved', hint: 'Choose a feature namespace other than revealThresholds or poolWaves.' }));
    else if (Object.hasOwn(target, id)) errors.push(problem('duplicate-progression-feature', { packId, domain: 'progression', entryId: id, field: `progression.features.${id}`, expected: 'unique feature namespace', actual: 'duplicate', hint: 'Choose one owning pack.' }));
    else target[id] = value;
  }
}

export function createContentRegistry(packs) {
  if (!Array.isArray(packs)) throw new TypeError('createContentRegistry requires an ordered pack array');
  const errors = [];
  const normalised = [];
  const packIds = new Set();
  const declaredDomains = new Set();
  for (const candidate of packs) {
    const pack = definePack(candidate);
    if (packIds.has(pack.id)) errors.push(problem('duplicate-pack', { packId: pack.id, entryId: pack.id, field: `packs.${pack.id}`, expected: 'unique pack registration', actual: 'duplicate pack', hint: 'Register each pack once.' }));
    else {
      packIds.add(pack.id);
      normalised.push(pack);
      for (const domain of Object.keys(MERGE_POLICIES)) if (Object.hasOwn(pack, domain)) declaredDomains.add(domain);
    }
  }
  const registry = {};
  const owners = Object.fromEntries(Object.keys(MERGE_POLICIES).map((key) => [key, new Map()]));
  for (const [domain, policy] of Object.entries(MERGE_POLICIES)) {
    registry[domain] = policy === 'singleton' ? undefined : policy.startsWith('append') ? [] : policy === 'nested-declared' ? { revealThresholds: {}, poolWaves: {} } : {};
  }
  const progressionOwners = { gates: new Map() };
  for (const pack of normalised) {
    for (const [domain, policy] of Object.entries(MERGE_POLICIES)) {
      if (!Object.hasOwn(pack, domain)) continue;
      const incoming = pack[domain];
      if (policy === 'singleton') {
        if (registry[domain] !== undefined) errors.push(problem('duplicate-singleton', { packId: pack.id, domain, entryId: domain, field: domain, expected: 'one owning pack', actual: 'duplicate singleton', hint: `Remove the second ${domain} declaration.` }));
        else { registry[domain] = incoming; owners[domain].set(domain, pack.id); }
      } else if (policy === 'keyed-unique') {
        for (const [id, value] of Object.entries(incoming || {})) {
          if (Object.hasOwn(registry[domain], id)) errors.push(problem('duplicate-entry', { packId: pack.id, domain, entryId: id, field: `${domain}.${id}`, expected: 'unique content id', actual: `already owned by ${owners[domain].get(id)}`, hint: 'Rename or remove one entry.' }));
          else { registry[domain][id] = value; owners[domain].set(id, pack.id); }
        }
      } else if (policy === 'append-unique-id' || policy === 'append-unique') appendUnique(registry[domain], incoming, domain, pack.id, errors, owners[domain]);
      else if (policy === 'append') for (const value of incoming || []) { registry[domain].push(value); owners[domain].set(registry[domain].length - 1, pack.id); }
      else mergeProgression(registry.progression, incoming, pack.id, errors, progressionOwners);
    }
  }
  if (errors.length) throw new ContentValidationError('Content registry merge failed', errors);
  const frozen = freezeGraph(registry);
  registryMetadata.set(frozen, {
    packs: normalised,
    packIds: normalised.map(({ id }) => id),
    owners,
    declaredDomains,
    problems: normalised.flatMap((pack) => packMetadata.get(pack)?.problems || []),
  });
  return frozen;
}

function referenceProblem(code, domain, entryId, path, expected, actual, packId = 'registry') {
  return problem(code, { packId, domain, entryId, field: path, expected, actual, hint: `Register a valid ${expected} or correct ${path}.` });
}

export function validateContentReferences(registry, resources = STATIC_REFERENCE_CATALOGUES, { includeAssets = false } = {}) {
  const problems = [];
  const meta = registryMetadata.get(registry);
  const owner = (domain, id) => meta?.owners?.[domain]?.get(id) || 'registry';
  for (const [id, card] of Object.entries(registry.cards || {})) {
    if (card.vfx && !resources.vfxIds?.has(card.vfx)) problems.push(referenceProblem('unknown-vfx-id', 'cards', id, `cards.${id}.vfx`, 'vfx-id', card.vfx, owner('cards', id)));
  }
  for (const domain of ['enemies', 'shadeKits']) for (const [id, row] of Object.entries(registry[domain] || {})) {
    const kind = row.art?.kind;
    if (kind && !resources.characterKindIds?.has(kind)) problems.push(referenceProblem('unknown-character-kind-id', domain, id, `${domain}.${id}.art.kind`, 'character-kind-id', kind, owner(domain, id)));
  }
  for (const [id, theme] of Object.entries(registry.themes || {})) {
    if (theme.music && !resources.musicIds?.has(theme.music)) problems.push(referenceProblem('unknown-music-id', 'themes', id, `themes.${id}.music`, 'music-id', theme.music, owner('themes', id)));
    const tokenRefs = [['mapHaze', theme.mapHaze], ...Object.entries(theme.palette || {}).map(([key, value]) => [`palette.${key}`, value])];
    for (const [key, value] of tokenRefs) if (typeof value === 'string' && !resources.tokenIds?.has(value)) problems.push(referenceProblem('unknown-token-id', 'themes', id, `themes.${id}.${key}`, 'token-id', value, owner('themes', id)));
    if (includeAssets && resources.assetManifest) for (const [key, value] of Object.entries(theme.plates || {})) {
      if (typeof value === 'string' && !resources.assetManifest.has(value)) problems.push(referenceProblem('asset-missing', 'themes', id, `themes.${id}.plates.${key}`, 'asset-id present in supplied manifest', value, owner('themes', id)));
    }
  }
  const variantBases = new Set(['hero', ...Object.keys(registry.enemies || {})]);
  for (const [id, variant] of Object.entries(registry.variants || {})) if (variant.base && !variantBases.has(variant.base)) problems.push(referenceProblem('unknown-variant-base', 'variants', id, `variants.${id}.base`, 'variant-base', variant.base, owner('variants', id)));
  return problems;
}

const OPTIONAL_LOCALE_FIELDS = new Set(['tagline']);
const localeDomain = (domain) => ({ statuses: 'status', themes: 'acts' }[domain] || domain);
const localeOwnedFieldEntries = (domain) => Object.entries(CONTENT_SCHEMAS[domain]?.fields || {})
  .filter(([key, spec]) => spec.source === 'locale' && !OPTIONAL_LOCALE_FIELDS.has(key));

function validateLocaleCoverage(registry, localeContent, packId = 'registry') {
  const problems = [];
  // player display strings live under aspects[player.id]; do not invent a player locale domain.
  for (const domain of Object.keys(CONTENT_SCHEMAS)) {
    if (domain === 'player') continue;
    const fieldEntries = localeOwnedFieldEntries(domain);
    const needsMoveNames = domain === 'enemies' || domain === 'shadeKits';
    if (!fieldEntries.length && !needsMoveNames) continue;
    const locKey = localeDomain(domain);
    const locRows = localeContent?.[locKey] || {};
    let rows;
    if (domain === 'themes') {
      rows = Object.keys(registry.themes || {}).map((themeId, index) => [index, registry.themes[themeId], themeId]);
    } else if (Array.isArray(registry[domain])) {
      rows = registry[domain].map((row, index) => [row?.id ?? String(index), row]);
    } else {
      rows = Object.entries(registry[domain] || {});
    }
    for (const rowTuple of rows) {
      const [locId, row, entryId = locId] = rowTuple;
      const loc = Array.isArray(locRows) ? locRows[locId] : locRows?.[locId];
      for (const [key, spec] of fieldEntries) {
        const path = `${locKey}.${locId}.${key}`;
        if (spec.kind === 'array') {
          if (!Array.isArray(loc?.[key])) {
            problems.push(problem('locale-field-missing', {
              packId, domain, entryId: String(entryId), field: path,
              expected: 'locale array', actual: actualLabel(loc?.[key]), hint: 'Add the missing locale field.',
            }));
          }
          continue;
        }
        if (typeof loc?.[key] !== 'string' || !loc[key]) {
          problems.push(problem('locale-field-missing', {
            packId, domain, entryId: String(entryId), field: path,
            expected: 'non-empty locale string', actual: actualLabel(loc?.[key]), hint: 'Add the missing locale field.',
          }));
        }
      }
      if (needsMoveNames && row?.moves) {
        for (const moveId of Object.keys(row.moves)) {
          if (typeof loc?.moves?.[moveId]?.name !== 'string' || !loc.moves[moveId].name) {
            problems.push(problem('locale-field-missing', {
              packId, domain, entryId: String(entryId),
              field: `${locKey}.${locId}.moves.${moveId}.name`,
              expected: 'locale move name', actual: 'missing', hint: 'Add the missing move name.',
            }));
          }
        }
      }
    }
    const ids = new Set(rows.map(([id]) => String(id)));
    for (const id of Object.keys(locRows || {})) {
      if (!ids.has(String(id))) {
        problems.push(problem('orphan-locale-entry', {
          packId, domain, entryId: id, field: `${locKey}.${id}`,
          expected: 'matching mechanics entry', actual: 'orphan locale entry',
          hint: 'Remove it or register its mechanics entry.',
        }));
      }
    }
  }
  return problems;
}

function mergeLocaleValue(current, incoming, path = 'locale') {
  if (Array.isArray(incoming)) return [...(Array.isArray(current) ? current : []), ...cloneGraph(incoming)];
  if (!isPlainObject(incoming)) return incoming;
  const output = isPlainObject(current) ? { ...current } : {};
  for (const key of Reflect.ownKeys(incoming)) {
    const descriptor = Object.getOwnPropertyDescriptor(incoming, key);
    if (!descriptor?.enumerable) continue;
    if (!Object.hasOwn(descriptor, 'value')) throw new ContentValidationError('Invalid locale fragment', [problem('accessor-not-allowed', { domain: 'locale', entryId: String(key), field: `${path}.${String(key)}`, expected: 'own enumerable data property', actual: 'accessor', hint: 'Materialise locale values before registration.' })]);
    output[key] = mergeLocaleValue(output[key], descriptor.value, `${path}.${String(key)}`);
  }
  return output;
}

export function joinLocaleContent(fragments) {
  let joined = {};
  for (const fragment of fragments || []) {
    if (!isPlainObject(fragment)) throw new TypeError('Locale fragments must be plain objects');
    for (const key of Reflect.ownKeys(fragment)) {
      const descriptor = Object.getOwnPropertyDescriptor(fragment, key);
      if (!descriptor?.enumerable) continue;
      if (!Object.hasOwn(descriptor, 'value')) throw new ContentValidationError('Invalid locale fragment', [problem('accessor-not-allowed', { domain: 'locale', entryId: String(key), field: `locale.${String(key)}`, expected: 'own enumerable data property', actual: 'accessor', hint: 'Materialise locale values before registration.' })]);
      joined[key] = mergeLocaleValue(joined[key], descriptor.value, `locale.${String(key)}`);
    }
  }
  return joined;
}

function compatibilityGraph(registry, localeContent) {
  const mutable = cloneGraph(registry);
  const themes = Object.entries(mutable.themes || {});
  for (const [index, [, theme]] of themes.entries()) {
    const loc = localeContent.acts?.[index] || {};
    for (const key of ['name', 'tagline', 'bossName']) if (loc[key] !== undefined) theme[key] = loc[key];
  }
  const acts = themes.map(([id, theme]) => ({
    id, ...theme.legacyAct,
    ...(theme.name !== undefined ? { name: theme.name } : {}),
    ...(theme.tagline !== undefined ? { tagline: theme.tagline } : {}),
    ...(theme.bossName !== undefined ? { bossName: theme.bossName } : {}),
  }));
  const graph = {
    PLAYER: mutable.player, CARDS: mutable.cards, STATUS_INFO: mutable.statuses,
    RELICS: mutable.relics, POTIONS: mutable.potions, ENEMIES: mutable.enemies,
    EVENTS: mutable.events, SHOP: mutable.shop, OMENS: mutable.omens,
    AFFIXES: mutable.affixes, ARTS: mutable.arts, DEEDS: mutable.deeds,
    PROGRESSION: mutable.progression, QUEST_IDS: mutable.questIds, WHISPERS: [],
    QUESTS: mutable.quests, SHADE_KITS: mutable.shadeKits, VARIANTS: mutable.variants,
    ASPECTS: mutable.aspects, VOWS: mutable.vows, BOONS: mutable.boons,
    THEMES: mutable.themes, ACTS: acts,
  };
  hydrateContent(graph, localeContent);
  return graph;
}

function derivedPools(registry) {
  const cardPools = {}, relicPools = {}, poolGate = { cards: {}, relics: {} };
  for (const [id, card] of Object.entries(registry.cards || {})) {
    if (typeof card.rarity !== 'string') continue;
    (cardPools[card.rarity] ||= []).push(id);
  }
  for (const [id, relic] of Object.entries(registry.relics || {})) {
    if (typeof relic.rarity !== 'string') continue;
    (relicPools[relic.rarity] ||= []).push(id);
  }
  for (const [gate, wave] of Object.entries(registry.progression.poolWaves || {})) {
    for (const id of wave.cards || []) poolGate.cards[id] = gate;
    for (const id of wave.relics || []) poolGate.relics[id] = gate;
  }
  return { cardPools, relicPools, poolGate };
}

export function createContentContext(packs, { id, resources = STATIC_REFERENCE_CATALOGUES, localeContent, localeToken } = {}) {
  if (typeof id !== 'string' || !id.trim()) throw new TypeError('Content context id must be a non-empty stable string');
  if (typeof localeToken !== 'string' || !localeToken.trim() || !isPlainObject(localeContent) || !Object.keys(localeContent).length) throw new TypeError('Content context requires a non-empty locale token and catalogue');
  const registry = createContentRegistry(packs);
  const metadata = registryMetadata.get(registry);
  const missing = Object.keys(MERGE_POLICIES).filter((domain) => !metadata.declaredDomains.has(domain));
  if (missing.length || !registry.player || !registry.shop || !Object.keys(registry.themes || {}).length) throw new ContentValidationError('Incomplete content context', [problem('incomplete-context', { field: missing[0] || (!registry.player ? 'player' : 'themes'), expected: 'full joined engine domain', actual: 'missing', hint: 'Register every engine domain before creating a context.' })]);
  const refProblems = validateContentReferences(registry, resources);
  const localeProblems = validateLocaleCoverage(registry, localeContent);
  const failures = [...refProblems, ...localeProblems].filter(({ severity }) => severity === 'error');
  if (failures.length) throw new ContentValidationError('Content context validation failed', failures);
  const graph = compatibilityGraph(registry, localeContent);
  const pools = derivedPools({ cards: graph.CARDS, relics: graph.RELICS, progression: graph.PROGRESSION });
  const themeOrder = Object.keys(registry.themes);
  const context = {
    contextVersion: 1, id, localeToken, packIds: [...(registryMetadata.get(registry)?.packIds || [])],
    player: graph.PLAYER, cards: graph.CARDS, cardPools: pools.cardPools,
    statuses: graph.STATUS_INFO, relics: graph.RELICS, relicPools: pools.relicPools,
    potions: graph.POTIONS, enemies: graph.ENEMIES, events: graph.EVENTS,
    rewardGold: themeOrder.map((themeId) => [...graph.THEMES[themeId].rewardGold]), shop: graph.SHOP,
    omens: graph.OMENS, affixes: graph.AFFIXES, arts: graph.ARTS, deeds: graph.DEEDS,
    progression: graph.PROGRESSION,
    reveals: Object.entries(graph.PROGRESSION.revealThresholds || {}).map(([revealId, trigger]) => ({ id: revealId, trigger })),
    poolGate: pools.poolGate, questIds: graph.QUEST_IDS, whispers: graph.WHISPERS,
    quests: graph.QUESTS, shadeKits: graph.SHADE_KITS, variants: graph.VARIANTS,
    aspects: graph.ASPECTS, vows: graph.VOWS, boons: graph.BOONS,
    themes: graph.THEMES, themeOrder, acts: graph.ACTS,
    encounters: themeOrder.map((themeId) => graph.THEMES[themeId].encounters),
  };
  return freezeGraph(context);
}

export function themeById(context, id) {
  return context?.themes && Object.hasOwn(context.themes, id) ? context.themes[id] : null;
}
export function themeForAct(context, index) {
  return Number.isInteger(index) && index >= 0 && index < (context?.themeOrder?.length || 0) ? themeById(context, context.themeOrder[index]) : null;
}
export function isFinalTheme(context, index) {
  return Number.isInteger(index) && index >= 0 && index === (context?.themeOrder?.length || 0) - 1;
}

const badge = (status = 'not-applicable', refs = []) => Object.freeze({ status, refs: Object.freeze(refs) });
export function doctorContent(packs, resources = STATIC_REFERENCE_CATALOGUES) {
  let registry;
  let problems = [];
  try { registry = createContentRegistry(packs); } catch (error) {
    if (!(error instanceof ContentValidationError)) throw error;
    problems = [...error.problems];
    registry = Object.fromEntries(Object.entries(MERGE_POLICIES).map(([domain, policy]) => [domain, policy.startsWith('append') ? [] : {}]));
  }
  const localeContent = resources.localeContent || {};
  problems.push(...(registryMetadata.get(registry)?.problems || []));
  problems.push(...validateContentReferences(registry, resources, { includeAssets: true }));
  problems.push(...validateLocaleCoverage(registry, localeContent));
  const meta = registryMetadata.get(registry);
  const domainReports = {};
  for (const [domain, policy] of Object.entries(MERGE_POLICIES)) {
    let rows;
    if (policy === 'singleton') rows = registry[domain] ? [[domain, registry[domain]]] : [];
    else if (policy.startsWith('append')) rows = (registry[domain] || []).map((row, index) => [row?.id ?? String(index), row]);
    else if (domain === 'progression') rows = [['progression', registry.progression]];
    else rows = Object.entries(registry[domain] || {});
    const inventoryIds = new Set(rows.map(([id]) => String(id)));
    const unmatchedDomainProblems = problems.filter((item) => item.domain === domain
      && !inventoryIds.has(String(item.entryId)));
    // Synthetic singleton inventories (player/shop/progression) absorb domain problems whose
    // entryId is a nested member id rather than the inventory row id.
    const foldUnmatched = (policy === 'singleton' || domain === 'progression') && rows.length === 1;
    const entries = rows.map(([entryId, row]) => {
      let entryProblems = problems.filter((item) => item.domain === domain && String(item.entryId) === String(entryId));
      if (foldUnmatched) entryProblems = [...entryProblems, ...unmatchedDomainProblems];
      const complete = !entryProblems.some(({ severity }) => severity === 'error');
      const refsFor = (kind) => entryProblems.filter((item) => item.code.includes(kind)).map(({ field: path }) => path);
      const assetProblemRefs = refsFor('asset');
      const plateRefs = domain === 'themes' && row?.plates && typeof row.plates === 'object'
        ? Object.values(row.plates).filter((value) => typeof value === 'string')
        : [];
      const artStatus = assetProblemRefs.length
        ? 'missing'
        : (plateRefs.length && resources.assetManifest ? 'complete' : 'not-applicable');
      return Object.freeze({
        id: String(entryId), packId: meta?.owners?.[domain]?.get(entryId) || meta?.owners?.[domain]?.get(domain) || 'registry', complete,
        badges: Object.freeze({
          locale: badge(refsFor('locale').length ? 'missing' : 'complete', refsFor('locale')),
          art: badge(artStatus, assetProblemRefs),
          vfx: badge(refsFor('vfx').length ? 'missing' : domain === 'cards' ? 'complete' : 'not-applicable', refsFor('vfx')),
          charMeta: badge(refsFor('character').length ? 'missing' : ['enemies', 'shadeKits'].includes(domain) ? 'complete' : 'not-applicable', refsFor('character')),
          audio: badge(refsFor('music').length || refsFor('sfx').length ? 'missing' : domain === 'themes' ? 'complete' : 'not-applicable', [...refsFor('music'), ...refsFor('sfx')]),
          pool: badge(['cards', 'relics'].includes(domain) ? 'complete' : 'not-applicable', []),
        }),
        links: Object.freeze({ gallery: Object.freeze({ route: 'gallery', domain, id: String(entryId) }), lab: Object.freeze({ route: 'lab', domain, id: String(entryId) }) }),
        problems: Object.freeze(entryProblems),
      });
    });
    domainReports[domain] = Object.freeze({ total: entries.length, complete: entries.filter((entry) => entry.complete).length, problems: Object.freeze(problems.filter((item) => item.domain === domain)), entries: Object.freeze(entries) });
  }
  const errors = problems.filter(({ severity }) => severity === 'error').length;
  const warnings = problems.filter(({ severity }) => severity === 'warning').length;
  return freezeGraph({ ok: errors === 0, summary: { packs: packs.length, entries: Object.values(domainReports).reduce((sum, domain) => sum + domain.total, 0), errors, warnings }, domains: domainReports, problems });
}

export function formatContentReport(report) {
  const lines = [`content: ${report.ok ? 'ok' : 'problems'} (${report.summary.errors} errors, ${report.summary.warnings} warnings)`];
  for (const [domain, row] of Object.entries(report.domains)) lines.push(`${domain}: ${row.complete}/${row.total} complete`);
  for (const item of report.problems) lines.push(`${item.severity} ${item.code} ${item.field}: expected ${item.expected}; got ${item.actual}`);
  return `${lines.join('\n')}\n`;
}
