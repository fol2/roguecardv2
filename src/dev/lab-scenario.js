// Bounded Lab scenario / replay URL codecs — Node-pure, no DOM/audio/stage.
// Semantic id checks live only in validateLabScenario(scenario, content).

export const LAB_SCENARIO_VERSION = 1;
export const LAB_REPLAY_VERSION = 1;
export const LAB_SCENARIO_MAX_BYTES = 8192;
export const LAB_REPLAY_MAX_BYTES = 4096;
export const LAB_MAX_ENEMIES = 4;
export const LAB_MAX_DECK = 60;

const SCENARIO_KEYS = Object.freeze([
  'v', 'mode', 'seed', 'aspectId', 'themeId', 'kind', 'omenId', 'enemies', 'deck', 'hand',
]);
const SCENARIO_KEY_SET = new Set(SCENARIO_KEYS);
const ENEMY_KEYS = Object.freeze(['id', 'variantId']);
const CARD_KEYS = Object.freeze(['id', 'up']);
const REPLAY_KEYS = Object.freeze(['v', 'kind', 'subject', 'parameters', 'endState']);
const REPLAY_KEY_SET = new Set(REPLAY_KEYS);
const REPLAY_SUBJECT_KEYS = Object.freeze(['kind', 'contentId', 'upgraded']);
const REPLAY_END_KEYS = Object.freeze(['destination', 'visible']);

function isPlainObject(value) {
  return !!value && typeof value === 'object' && !Array.isArray(value);
}

function utf8Bytes(text) {
  if (typeof TextEncoder === 'function') return new TextEncoder().encode(text).length;
  return Buffer.byteLength(text, 'utf8');
}

function encodeBase64Url(text) {
  const raw = typeof Buffer !== 'undefined'
    ? Buffer.from(text, 'utf8').toString('base64')
    : btoa(unescape(encodeURIComponent(text)));
  return raw.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '');
}

function decodeBase64Url(token) {
  if (typeof token !== 'string' || !token || /[^A-Za-z0-9\-_]/.test(token)) {
    throw new Error('invalid base64url payload');
  }
  const padded = token + '='.repeat((4 - (token.length % 4)) % 4);
  const b64 = padded.replace(/-/g, '+').replace(/_/g, '/');
  if (typeof Buffer !== 'undefined') return Buffer.from(b64, 'base64').toString('utf8');
  return decodeURIComponent(escape(atob(b64)));
}

/** Deterministic JSON: object keys sorted; arrays keep semantic order. */
export function canonicalize(value) {
  if (Array.isArray(value)) return value.map(canonicalize);
  if (isPlainObject(value)) {
    return Object.fromEntries(
      Object.keys(value).sort().map((key) => [key, canonicalize(value[key])]),
    );
  }
  return value;
}

function deepFreeze(value, seen = new Set()) {
  if (value == null || typeof value !== 'object') return value;
  if (seen.has(value)) return value;
  seen.add(value);
  if (Array.isArray(value)) {
    for (const item of value) deepFreeze(item, seen);
  } else {
    for (const child of Object.values(value)) deepFreeze(child, seen);
  }
  return Object.freeze(value);
}

function deepCopyFreeze(value) {
  return deepFreeze(structuredClone(value));
}

function assertByteBudget(text, max, label) {
  const bytes = utf8Bytes(text);
  if (bytes > max) throw new Error(`${label} exceeds ${max} serialised bytes (${bytes})`);
  return bytes;
}

function extractNamedPayload(input, name) {
  if (typeof input !== 'string') throw new Error(`${name} payload must be a string`);
  if (!input.includes('=')) return input;
  const raw = input.startsWith('?') ? input.slice(1) : input;
  if (!raw) throw new Error(`missing ${name} query key`);
  const seen = new Set();
  const values = [];
  for (const part of raw.split('&')) {
    if (!part) continue;
    const eq = part.indexOf('=');
    const key = decodeURIComponent(eq < 0 ? part : part.slice(0, eq));
    const value = decodeURIComponent(eq < 0 ? '' : part.slice(eq + 1));
    if (seen.has(key)) throw new Error(`duplicate query key: ${key}`);
    seen.add(key);
    if (key === name) values.push(value);
  }
  if (values.length === 0) throw new Error(`missing ${name} query key`);
  if (values.length !== 1) throw new Error(`duplicate query key: ${name}`);
  return values[0];
}

function assertCardRow(row, path, problems) {
  if (!isPlainObject(row)) {
    problems.push({ path, code: 'shape', message: `${path} must be { id, up }` });
    return;
  }
  for (const key of Object.keys(row)) {
    if (!CARD_KEYS.includes(key)) {
      problems.push({ path: `${path}.${key}`, code: 'unknown-field', message: `unknown field ${path}.${key}` });
    }
  }
  if (typeof row.id !== 'string' || !row.id) {
    problems.push({ path: `${path}.id`, code: 'shape', message: `${path}.id must be a non-empty string` });
  }
  if (typeof row.up !== 'boolean') {
    problems.push({ path: `${path}.up`, code: 'shape', message: `${path}.up must be boolean` });
  }
}

function assertEnemyRow(row, path, problems) {
  if (!isPlainObject(row)) {
    problems.push({ path, code: 'shape', message: `${path} must be { id, variantId }` });
    return;
  }
  for (const key of Object.keys(row)) {
    if (!ENEMY_KEYS.includes(key)) {
      problems.push({ path: `${path}.${key}`, code: 'unknown-field', message: `unknown field ${path}.${key}` });
    }
  }
  if (typeof row.id !== 'string' || !row.id) {
    problems.push({ path: `${path}.id`, code: 'shape', message: `${path}.id must be a non-empty string` });
  }
  if (!(row.variantId === null || typeof row.variantId === 'string')) {
    problems.push({
      path: `${path}.variantId`, code: 'shape',
      message: `${path}.variantId must be null or string`,
    });
  }
}

function assertScenarioShape(value) {
  const problems = [];
  if (!isPlainObject(value)) {
    const err = new Error('lab scenario must be a plain object');
    err.problems = [{ path: '', code: 'shape', message: err.message }];
    throw err;
  }
  for (const key of Object.keys(value)) {
    if (!SCENARIO_KEY_SET.has(key)) {
      problems.push({ path: key, code: 'unknown-field', message: `unknown field ${key}` });
    }
  }
  for (const key of SCENARIO_KEYS) {
    if (!Object.hasOwn(value, key)) {
      problems.push({ path: key, code: 'shape', message: `missing field ${key}` });
    }
  }
  if (value.v !== LAB_SCENARIO_VERSION) {
    problems.push({ path: 'v', code: 'version', message: `unsupported scenario version: ${value.v}` });
  }
  if (typeof value.mode !== 'string' || !value.mode) {
    problems.push({ path: 'mode', code: 'shape', message: 'mode must be a non-empty string' });
  }
  if (!Number.isInteger(value.seed)) {
    problems.push({ path: 'seed', code: 'shape', message: 'seed must be an integer' });
  }
  for (const key of ['aspectId', 'themeId', 'kind', 'omenId']) {
    if (typeof value[key] !== 'string' || !value[key]) {
      problems.push({ path: key, code: 'shape', message: `${key} must be a non-empty string` });
    }
  }
  if (!Array.isArray(value.enemies)) {
    problems.push({ path: 'enemies', code: 'shape', message: 'enemies must be an array' });
  } else {
    if (value.enemies.length > LAB_MAX_ENEMIES) {
      problems.push({
        path: 'enemies', code: 'limit',
        message: `enemies exceeds ${LAB_MAX_ENEMIES} (got ${value.enemies.length})`,
      });
    }
    value.enemies.forEach((row, i) => assertEnemyRow(row, `enemies[${i}]`, problems));
  }
  if (!Array.isArray(value.deck)) {
    problems.push({ path: 'deck', code: 'shape', message: 'deck must be an array' });
  } else {
    if (value.deck.length > LAB_MAX_DECK) {
      problems.push({
        path: 'deck', code: 'limit',
        message: `deck exceeds ${LAB_MAX_DECK} ids (got ${value.deck.length})`,
      });
    }
    value.deck.forEach((row, i) => assertCardRow(row, `deck[${i}]`, problems));
  }
  if (!Array.isArray(value.hand)) {
    problems.push({ path: 'hand', code: 'shape', message: 'hand must be an array' });
  } else {
    value.hand.forEach((row, i) => assertCardRow(row, `hand[${i}]`, problems));
  }
  if (problems.length) {
    const err = new Error(problems.map((p) => p.message).join('; '));
    err.problems = problems;
    throw err;
  }
  return {
    v: value.v,
    mode: value.mode,
    seed: value.seed,
    aspectId: value.aspectId,
    themeId: value.themeId,
    kind: value.kind,
    omenId: value.omenId,
    enemies: value.enemies.map((row) => ({ id: row.id, variantId: row.variantId })),
    deck: value.deck.map((row) => ({ id: row.id, up: row.up })),
    hand: value.hand.map((row) => ({ id: row.id, up: row.up })),
  };
}

function assertReplayShape(value) {
  const problems = [];
  if (!isPlainObject(value)) {
    const err = new Error('replay descriptor must be a plain object');
    err.problems = [{ path: '', code: 'shape', message: err.message }];
    throw err;
  }
  for (const key of Object.keys(value)) {
    if (!REPLAY_KEY_SET.has(key)) {
      problems.push({ path: key, code: 'unknown-field', message: `unknown field ${key}` });
    }
  }
  for (const key of REPLAY_KEYS) {
    if (!Object.hasOwn(value, key)) {
      problems.push({ path: key, code: 'shape', message: `missing field ${key}` });
    }
  }
  if (value.v !== LAB_REPLAY_VERSION) {
    problems.push({ path: 'v', code: 'version', message: `unsupported replay version: ${value.v}` });
  }
  if (typeof value.kind !== 'string' || !value.kind) {
    problems.push({ path: 'kind', code: 'shape', message: 'kind must be a non-empty string' });
  }
  if (!isPlainObject(value.subject)) {
    problems.push({ path: 'subject', code: 'shape', message: 'subject must be an object' });
  } else {
    for (const key of Object.keys(value.subject)) {
      if (!REPLAY_SUBJECT_KEYS.includes(key)) {
        problems.push({ path: `subject.${key}`, code: 'unknown-field', message: `unknown field subject.${key}` });
      }
    }
    if (typeof value.subject.kind !== 'string') {
      problems.push({ path: 'subject.kind', code: 'shape', message: 'subject.kind must be a string' });
    }
    if (typeof value.subject.contentId !== 'string') {
      problems.push({ path: 'subject.contentId', code: 'shape', message: 'subject.contentId must be a string' });
    }
    if (typeof value.subject.upgraded !== 'boolean') {
      problems.push({ path: 'subject.upgraded', code: 'shape', message: 'subject.upgraded must be boolean' });
    }
  }
  if (!isPlainObject(value.parameters)) {
    problems.push({ path: 'parameters', code: 'shape', message: 'parameters must be an object' });
  } else {
    for (const [key, child] of Object.entries(value.parameters)) {
      if (child != null && typeof child === 'object') {
        problems.push({
          path: `parameters.${key}`, code: 'shape',
          message: `parameters.${key} must be a primitive`,
        });
      }
    }
  }
  if (!isPlainObject(value.endState)) {
    problems.push({ path: 'endState', code: 'shape', message: 'endState must be an object' });
  } else {
    for (const key of Object.keys(value.endState)) {
      if (!REPLAY_END_KEYS.includes(key)) {
        problems.push({ path: `endState.${key}`, code: 'unknown-field', message: `unknown field endState.${key}` });
      }
    }
    if (typeof value.endState.destination !== 'string') {
      problems.push({ path: 'endState.destination', code: 'shape', message: 'endState.destination must be a string' });
    }
    if (typeof value.endState.visible !== 'boolean') {
      problems.push({ path: 'endState.visible', code: 'shape', message: 'endState.visible must be boolean' });
    }
  }
  // Forbidden auto-run / engine / save / command surfaces.
  for (const banned of ['command', 'commands', 'engineState', 'engine', 'save', 'saveSnapshot', 'dom', 'autoRun']) {
    if (Object.hasOwn(value, banned)) {
      problems.push({ path: banned, code: 'forbidden', message: `forbidden field ${banned}` });
    }
  }
  if (problems.length) {
    const err = new Error(problems.map((p) => p.message).join('; '));
    err.problems = problems;
    throw err;
  }
  return {
    v: value.v,
    kind: value.kind,
    subject: {
      kind: value.subject.kind,
      contentId: value.subject.contentId,
      upgraded: value.subject.upgraded,
    },
    parameters: { ...value.parameters },
    endState: {
      destination: value.endState.destination,
      visible: value.endState.visible,
    },
  };
}

function serializeScenario(scenario) {
  const shaped = assertScenarioShape(scenario);
  const json = JSON.stringify(canonicalize(shaped));
  assertByteBudget(json, LAB_SCENARIO_MAX_BYTES, 'lab scenario');
  return { shaped, json };
}

function serializeReplay(descriptor) {
  const shaped = assertReplayShape(descriptor);
  const json = JSON.stringify(canonicalize(shaped));
  assertByteBudget(json, LAB_REPLAY_MAX_BYTES, 'replay descriptor');
  return { shaped, json };
}

export function encodeLabScenario(scenario) {
  const { json } = serializeScenario(scenario);
  return encodeBase64Url(json);
}

export function decodeLabScenario(input) {
  const token = extractNamedPayload(input, 'scenario');
  const json = decodeBase64Url(token);
  assertByteBudget(json, LAB_SCENARIO_MAX_BYTES, 'lab scenario');
  let parsed;
  try {
    parsed = JSON.parse(json);
  } catch {
    throw new Error('lab scenario payload is not valid JSON');
  }
  return deepCopyFreeze(assertScenarioShape(parsed));
}

export function encodeReplayDescriptor(descriptor) {
  const { json } = serializeReplay(descriptor);
  return encodeBase64Url(json);
}

export function decodeReplayDescriptor(input) {
  const token = extractNamedPayload(input, 'replay');
  const json = decodeBase64Url(token);
  assertByteBudget(json, LAB_REPLAY_MAX_BYTES, 'replay descriptor');
  let parsed;
  try {
    parsed = JSON.parse(json);
  } catch {
    throw new Error('replay descriptor payload is not valid JSON');
  }
  return deepCopyFreeze(assertReplayShape(parsed));
}

/** Shape-normalise a Lab Replay Descriptor without base64url encoding. */
export function normalizeReplayDescriptor(descriptor) {
  return deepCopyFreeze(assertReplayShape(descriptor));
}

function aspectIds(content) {
  return (content?.aspects || []).map((row) => row?.id).filter((id) => typeof id === 'string');
}

function variantCompatible(baseId, variantId, variants) {
  const variant = variants?.[variantId];
  if (!variant) return { ok: false, reason: 'unknown-variant' };
  // Declared own-shade exception: id 'shade' with ownShadeN where base === 'hero'.
  if (baseId === 'shade' && /^ownShade[1-9]\d*$/.test(variantId)) {
    return variant.base === 'hero'
      ? { ok: true }
      : { ok: false, reason: 'own-shade-base' };
  }
  if (variant.base === baseId) return { ok: true };
  return { ok: false, reason: 'base-mismatch' };
}

/**
 * Sole semantic-id check. Aggregates every unknown/mismatched id against the
 * caller-supplied frozen content context. Returns a deep-frozen copy.
 */
export function validateLabScenario(scenario, content) {
  if (!content || typeof content !== 'object') {
    throw new TypeError('validateLabScenario requires an explicit content context');
  }
  const shaped = assertScenarioShape(scenario);
  const problems = [];
  const aspects = aspectIds(content);
  if (!aspects.includes(shaped.aspectId)) {
    problems.push({
      path: 'aspectId', code: 'unknown-id', id: shaped.aspectId,
      message: `unknown aspectId: ${shaped.aspectId}`,
    });
  }
  const themes = content.themes || {};
  const themeOrder = content.themeOrder || [];
  if (!(Object.hasOwn(themes, shaped.themeId) || themeOrder.includes(shaped.themeId))) {
    problems.push({
      path: 'themeId', code: 'unknown-id', id: shaped.themeId,
      message: `unknown themeId: ${shaped.themeId}`,
    });
  }
  if (!Object.hasOwn(content.omens || {}, shaped.omenId)) {
    problems.push({
      path: 'omenId', code: 'unknown-id', id: shaped.omenId,
      message: `unknown omenId: ${shaped.omenId}`,
    });
  }
  shaped.enemies.forEach((row, i) => {
    const path = `enemies[${i}]`;
    if (!Object.hasOwn(content.enemies || {}, row.id)) {
      problems.push({
        path: `${path}.id`, code: 'unknown-id', id: row.id,
        message: `unknown enemy id: ${row.id}`,
      });
    }
    if (row.variantId != null) {
      const check = variantCompatible(row.id, row.variantId, content.variants);
      if (!check.ok) {
        problems.push({
          path: `${path}.variantId`, code: 'variant-mismatch', id: row.variantId,
          message: `mismatched variantId: ${row.variantId} for enemy ${row.id}`,
        });
      }
    }
  });
  const checkCard = (row, path) => {
    if (!Object.hasOwn(content.cards || {}, row.id)) {
      problems.push({
        path: `${path}.id`, code: 'unknown-id', id: row.id,
        message: `unknown card id: ${row.id}`,
      });
    }
  };
  shaped.deck.forEach((row, i) => checkCard(row, `deck[${i}]`));
  shaped.hand.forEach((row, i) => checkCard(row, `hand[${i}]`));

  if (problems.length) {
    const err = new Error(problems.map((p) => p.message).join('; '));
    err.problems = problems;
    throw err;
  }
  return deepCopyFreeze(shaped);
}
