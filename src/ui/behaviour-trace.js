function immutableSet(values) {
  const backing = new Set(values);
  const immutable = () => { throw new TypeError('trace contract sets are immutable'); };
  const facade = {
    get size() { return backing.size; },
    has(value) { return backing.has(value); },
    keys() { return backing.keys(); },
    values() { return backing.values(); },
    entries() { return backing.entries(); },
    [Symbol.iterator]() { return backing[Symbol.iterator](); },
    forEach(callback, thisArg) {
      if (typeof callback !== 'function') throw new TypeError('callback must be a function');
      for (const value of backing) callback.call(thisArg, value, value, facade);
    },
    add: immutable,
    delete: immutable,
    clear: immutable,
    valueOf() { return facade; },
    get [Symbol.toStringTag]() { return 'Set'; },
  };
  return Object.freeze(facade);
}

export const TRACE_VERSION = 1;
export const TRACE_END_OUTCOMES = immutableSet([
  'completed', 'settled', 'cancelled', 'skipped', 'failed',
]);
export const TRACE_POINT_OUTCOMES = immutableSet([
  'accepted', 'rejected', 'completed', 'cancelled', 'failed',
]);

export const FORBIDDEN_TRACE_KEYS = immutableSet([
  'text', 'copy', 'html', 'label', 'run', 'cb', 'save', 'snapshot',
  'dom', 'pixi', 'pointerX', 'pointerY', 'frame', 'tick',
]);

const FORMATS = new Set(['records', 'contract', 'text', 'ndjson']);
const POLICY_KEYS = new Set(['screen', 'renderer', 'motion', 'tier']);
const DETAIL_KEYS = new Set([
  'phase', 'outcome', 'reason', 'causeSeq', 'correlationId',
  'attributes', 'checkpoint', 'replay',
]);
const REPLAY_KEYS = new Set(['v', 'presentationId', 'fixtureId', 'locale', 'params']);
const POINTER_KEYS = new Set([
  'x', 'y', 'clientX', 'clientY', 'pageX', 'pageY', 'screenX', 'screenY',
  'offsetX', 'offsetY', 'movementX', 'movementY', 'pointerId',
  'pressure', 'tangentialPressure', 'tiltX', 'tiltY', 'twist', 'pointerType',
  'altitudeAngle', 'azimuthAngle', 'persistentDeviceId', 'isPrimary', 'button',
  'buttons', 'altKey', 'ctrlKey', 'metaKey', 'shiftKey', 'layerX', 'layerY',
  'touches', 'changedTouches', 'nativeEvent', 'event', 'timeStamp', 'eventPhase', 'isTrusted',
  'bubbles', 'cancelBubble', 'cancelable', 'composed', 'defaultPrevented',
  'returnValue', 'sourceCapabilities',
  'composedPath', 'getCoalescedEvents', 'getPredictedEvents',
]);
const REPLAY_MAX_DEPTH = 6;
const REPLAY_MAX_NODES = 64;
const REPLAY_MAX_KEYS_PER_OBJECT = 32;
const REPLAY_MAX_TOTAL_KEYS = 128;
const REPLAY_MAX_ARRAY_LENGTH = 32;
const REPLAY_MAX_SERIALISED_BYTES = 4096;
const SEMVER_RE = /^\d+\.\d+\.\d+(?:-[0-9A-Za-z.-]+)?(?:\+[0-9A-Za-z.-]+)?$/;
const SHA_RE = /^(?:[0-9a-f]{7,12}|unknown)$/;
const LOCALE_RE = /^[A-Za-z]{2,3}(?:-[A-Za-z0-9]{2,8})*$/;
const STABLE_TOKEN_RE = /^[A-Za-z0-9][A-Za-z0-9._:/-]{0,127}$/;
const PAYLOAD_TOKEN_RE = /^[a-z0-9][A-Za-z0-9._:/-]{0,127}$/;
const META_KEYS = new Set(['proto', 'prototype', 'constructor']);
const COPY_LIKE_KEYS = new Set([
  'name', 'value', 'title', 'description', 'body', 'message', 'content',
  'tooltip', 'arialabel',
]);

function normalisePrivacyKey(key) {
  return key.toLowerCase().replace(/[^a-z0-9]/g, '');
}

const PRIVATE_KEYS = new Set([
  ...[...FORBIDDEN_TRACE_KEYS].map(normalisePrivacyKey),
  ...COPY_LIKE_KEYS,
]);
const NORMALISED_POINTER_KEYS = new Set([...POINTER_KEYS].map(normalisePrivacyKey));

function deepFreeze(value, seen = new Set()) {
  if (value === null || typeof value !== 'object' || seen.has(value)) return value;
  seen.add(value);
  for (const child of Object.values(value)) deepFreeze(child, seen);
  return Object.freeze(value);
}

function utf8Length(value) {
  return new TextEncoder().encode(value).length;
}

function assertStableString(value, name, { locale = false } = {}) {
  if (typeof value !== 'string' || utf8Length(value) > 128) {
    throw new TypeError(`${name} must be a string of at most 128 bytes`);
  }
  if (!value) throw new TypeError(`${name} must be a non-empty stable semantic token`);
  if (!(locale ? LOCALE_RE : STABLE_TOKEN_RE).test(value)) {
    throw new TypeError(`${name} must be a non-empty stable semantic token`);
  }
  return value;
}

function isDomOrEvent(value) {
  if (typeof Node !== 'undefined' && value instanceof Node) return true;
  if (typeof Event !== 'undefined' && value instanceof Event) return true;
  if (!value || typeof value !== 'object') return false;
  const name = value.constructor?.name ?? '';
  return /(?:Node|Element|Document|Event)$/.test(name) ||
    ('nodeType' in value && 'nodeName' in value);
}

function copyJson(value, { path = 'payload', seen = new Set(), allowReplayKey = false } = {}) {
  if (value === null || typeof value === 'boolean') return value;
  if (typeof value === 'number') {
    if (!Number.isFinite(value)) throw new TypeError(`${path} numbers must be finite`);
    return value;
  }
  if (typeof value === 'string') {
    if (utf8Length(value) > 128) throw new TypeError(`${path} strings must be at most 128 bytes`);
    if (!PAYLOAD_TOKEN_RE.test(value)) {
      throw new TypeError(`${path} strings must be non-empty lower-case-initial semantic tokens, not player-facing copy`);
    }
    return value;
  }
  if (typeof value === 'function') throw new TypeError(`${path} cannot contain a function; values must be JSON-safe`);
  if (typeof value === 'undefined' || typeof value === 'bigint' || typeof value === 'symbol') {
    throw new TypeError(`${path} must be JSON-safe`);
  }
  if (isDomOrEvent(value)) throw new TypeError(`${path} cannot contain DOM nodes or raw pointer events`);
  if (seen.has(value)) throw new TypeError(`${path} cannot contain cyclic values`);
  seen.add(value);

  let result;
  if (Array.isArray(value)) {
    result = value.map((item, index) => copyJson(item, {
      path: `${path}[${index}]`, seen, allowReplayKey,
    }));
  } else {
    const prototype = Object.getPrototypeOf(value);
    if (prototype !== Object.prototype && prototype !== null) {
      throw new TypeError(`${path} must contain plain JSON-safe objects`);
    }
    const keys = Object.keys(value);
    if (keys.includes('seed') && keys.includes('act') && keys.includes('hp') && keys.includes('deck')) {
      throw new TypeError(`${path} cannot contain a save-shaped payload`);
    }
    result = Object.create(null);
    for (const key of keys) {
      if (!key || utf8Length(key) > 128) throw new TypeError(`${path} contains an invalid JSON key`);
      const privacyKey = normalisePrivacyKey(key);
      if (META_KEYS.has(privacyKey)) throw new TypeError(`${path} contains forbidden prototype/meta key ${key}`);
      if (PRIVATE_KEYS.has(privacyKey)) throw new TypeError(`${path} contains forbidden privacy key ${key}`);
      if (NORMALISED_POINTER_KEYS.has(privacyKey)) throw new TypeError(`${path} cannot contain raw pointer coordinate/event key ${key}`);
      if (privacyKey === 'replay' && !allowReplayKey) {
        throw new TypeError('Replay Descriptor must be supplied through the top-level replay field');
      }
      result[key] = copyJson(value[key], { path: `${path}.${key}`, seen, allowReplayKey });
    }
  }
  seen.delete(value);
  return result;
}

function validateReplayBounds(value, depth = 0, state = { nodes: 0, keys: 0 }) {
  if (depth > REPLAY_MAX_DEPTH) {
    throw new TypeError(`Replay Descriptor params exceed depth limit ${REPLAY_MAX_DEPTH}`);
  }
  state.nodes += 1;
  if (state.nodes > REPLAY_MAX_NODES) {
    throw new TypeError(`Replay Descriptor params exceed node limit ${REPLAY_MAX_NODES}`);
  }
  if (Array.isArray(value)) {
    if (value.length > REPLAY_MAX_ARRAY_LENGTH) {
      throw new TypeError(`Replay Descriptor params exceed array limit ${REPLAY_MAX_ARRAY_LENGTH}`);
    }
    for (const item of value) validateReplayBounds(item, depth + 1, state);
    return;
  }
  if (!value || typeof value !== 'object') return;
  const keys = Object.keys(value);
  if (keys.length > REPLAY_MAX_KEYS_PER_OBJECT) {
    throw new TypeError(`Replay Descriptor params exceed key limit ${REPLAY_MAX_KEYS_PER_OBJECT}`);
  }
  state.keys += keys.length;
  if (state.keys > REPLAY_MAX_TOTAL_KEYS) {
    throw new TypeError(`Replay Descriptor params exceed total key limit ${REPLAY_MAX_TOTAL_KEYS}`);
  }
  for (const item of Object.values(value)) validateReplayBounds(item, depth + 1, state);
}

function validateReplay(value) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    throw new TypeError('Replay Descriptor must be an object');
  }
  for (const key of Object.keys(value)) {
    if (!REPLAY_KEYS.has(key)) throw new TypeError(`Replay Descriptor has unexpected field ${key}`);
  }
  if (value.v !== 1) throw new TypeError('Replay Descriptor v must be 1');
  assertStableString(value.presentationId, 'Replay Descriptor presentationId');
  assertStableString(value.fixtureId, 'Replay Descriptor fixtureId');
  if (value.locale !== undefined) assertStableString(value.locale, 'Replay Descriptor locale', { locale: true });
  const result = {
    v: 1,
    presentationId: value.presentationId,
    fixtureId: value.fixtureId,
  };
  if (value.locale !== undefined) result.locale = value.locale;
  if (value.params !== undefined) {
    validateReplayBounds(value.params);
    result.params = copyJson(value.params, { path: 'Replay Descriptor.params' });
    if (utf8Length(JSON.stringify(result.params)) > REPLAY_MAX_SERIALISED_BYTES) {
      throw new TypeError(`Replay Descriptor params exceed serialised bytes limit ${REPLAY_MAX_SERIALISED_BYTES}`);
    }
  }
  return deepFreeze(result);
}

function validateIdentity(value) {
  if (value === undefined || value === null) return deepFreeze({});
  if (typeof value !== 'object' || Array.isArray(value)) throw new TypeError('identity must return an object');
  const allowed = new Set(['appVersion', 'buildKind', 'gitSha', 'locale']);
  for (const key of Object.keys(value)) {
    if (!allowed.has(key)) throw new TypeError(`identity has unexpected field ${key}`);
  }
  const result = {};
  if (value.appVersion !== undefined) {
    if (typeof value.appVersion !== 'string' || !SEMVER_RE.test(value.appVersion)) {
      throw new TypeError('identity appVersion must be semver');
    }
    result.appVersion = value.appVersion;
  }
  if (value.buildKind !== undefined) {
    if (!['dev', 'ordinary', 'release'].includes(value.buildKind)) {
      throw new TypeError('identity buildKind must be dev, ordinary or release');
    }
    result.buildKind = value.buildKind;
  }
  if (value.gitSha !== undefined) {
    if (typeof value.gitSha !== 'string' || !SHA_RE.test(value.gitSha)) {
      throw new TypeError('identity gitSha must be a short SHA or unknown');
    }
    result.gitSha = value.gitSha;
  }
  if (value.locale !== undefined) {
    assertStableString(value.locale, 'identity locale', { locale: true });
    result.locale = value.locale;
  }
  return deepFreeze(result);
}

function validatePolicy(value) {
  if (value === undefined || value === null) return {};
  if (typeof value !== 'object' || Array.isArray(value)) throw new TypeError('trace policy must return an object');
  const result = {};
  for (const [key, item] of Object.entries(value)) {
    if (!POLICY_KEYS.has(key)) throw new TypeError(`trace policy has unexpected field ${key}`);
    result[key] = assertStableString(item, `trace policy ${key}`);
  }
  return result;
}

function validateDetails(details, phase) {
  if (details === undefined) details = {};
  if (!details || typeof details !== 'object' || Array.isArray(details)) {
    throw new TypeError(`${phase} details must be an object`);
  }
  for (const key of Object.keys(details)) {
    if (!DETAIL_KEYS.has(key)) throw new TypeError(`${phase} details have unexpected field ${key}`);
  }
  if (details.phase !== undefined && details.phase !== phase) {
    throw new TypeError(`${phase === 'point' ? 'emit' : 'begin'} accepts ${phase} phase only`);
  }
  if (phase === 'start' && details.outcome !== undefined) {
    throw new TypeError('start records cannot have an outcome');
  }
  if (phase === 'point' && details.outcome !== undefined && !TRACE_POINT_OUTCOMES.has(details.outcome)) {
    throw new TypeError(`invalid point outcome ${details.outcome}`);
  }
  if (details.reason !== undefined) assertStableString(details.reason, `${phase} reason`);
  if (details.correlationId !== undefined) assertStableString(details.correlationId, `${phase} correlationId`);
  if (details.causeSeq !== undefined && (!Number.isInteger(details.causeSeq) || details.causeSeq < 1)) {
    throw new TypeError(`${phase} causeSeq must be a positive integer`);
  }
  const result = {};
  if (details.outcome !== undefined) result.outcome = details.outcome;
  if (details.reason !== undefined) result.reason = details.reason;
  if (details.causeSeq !== undefined) result.causeSeq = details.causeSeq;
  if (details.correlationId !== undefined) result.correlationId = details.correlationId;
  if (details.attributes !== undefined) {
    result.attributes = copyJson(details.attributes, { path: `${phase}.attributes` });
  }
  if (details.checkpoint !== undefined) {
    result.checkpoint = copyJson(details.checkpoint, { path: `${phase}.checkpoint` });
  }
  if (details.replay !== undefined) result.replay = validateReplay(details.replay);
  return result;
}

function contractCopy(value) {
  if (Array.isArray(value)) return value.map(contractCopy);
  if (!value || typeof value !== 'object') return value;
  const result = {};
  for (const [key, item] of Object.entries(value)) {
    const lower = key.toLowerCase();
    if (key === 'atMs' || key === 'gitSha' ||
        lower === 'runid' || lower === 'instanceid' || lower === 'generatedid' ||
        lower === 'asseturl' || lower === 'url' || lower.endsWith('url')) continue;
    result[key] = contractCopy(item);
  }
  return result;
}

function sortedCopy(value) {
  if (Array.isArray(value)) return value.map(sortedCopy);
  if (!value || typeof value !== 'object') return value;
  return Object.fromEntries(Object.keys(value).sort().map((key) => [key, sortedCopy(value[key])]));
}

function escapeField(value) {
  if (value === undefined || value === null || value === '') return '-';
  return String(value).replace(/[\u0000-\u001f\u007f]/g, (character) =>
    `\\u${character.charCodeAt(0).toString(16).padStart(4, '0')}`);
}

function textRecord(record, originAt) {
  const elapsed = Math.max(0, record.atMs - originAt).toFixed(1).padStart(8, '0');
  const attributes = record.attributes ?? {};
  return `+${elapsed}ms [${escapeField(record.segment)}:${record.seq}] ${escapeField(record.eventName)}` +
    ` phase=${record.phase} outcome=${escapeField(record.outcome)}` +
    ` screen=${escapeField(record.screen)} renderer=${escapeField(record.renderer)}` +
    ` reason=${escapeField(record.reason)} cause=${escapeField(record.causeSeq)}` +
    ` correlation=${escapeField(record.correlationId)} attrs=${JSON.stringify(sortedCopy(attributes))}`;
}

function headerFor({ enabled, segment, firstSeq, lastSeq, dropped, reset, identity, contract }) {
  const selectedIdentity = contract ? contractCopy(identity) : identity;
  return deepFreeze({
    v: TRACE_VERSION, enabled, segment, firstSeq, lastSeq, dropped, reset,
    identity: selectedIdentity,
  });
}

export function createBehaviourTrace({
  enabled = false,
  strict = false,
  capacity = 4096,
  segment = `page-${globalThis.crypto?.randomUUID?.() ?? Math.random().toString(36).slice(2)}`,
  now = () => performance.now(),
  policy = () => ({}),
  identity = () => ({}),
} = {}) {
  if (!Number.isInteger(capacity) || capacity < 1) throw new TypeError('trace capacity must be a positive integer');
  assertStableString(segment, 'trace segment');
  const dependencyErrors = [];
  if (typeof now !== 'function') {
    const error = new TypeError('trace now option must be a function');
    if (strict) throw error;
    dependencyErrors.push(error);
    now = () => 0;
  }
  if (typeof policy !== 'function') {
    const error = new TypeError('trace policy option must be a function');
    if (strict) throw error;
    dependencyErrors.push(error);
    policy = () => ({});
  }
  if (typeof identity !== 'function') {
    const error = new TypeError('trace identity option must be a function');
    if (strict) throw error;
    dependencyErrors.push(error);
    identity = () => ({});
  }

  const initialSegment = segment;
  let activeSegment = initialSegment;
  let segmentGeneration = 0;
  let identityValue = deepFreeze({});
  let identityError = null;
  try {
    identityValue = validateIdentity(identity());
  } catch (error) {
    if (strict) throw error;
    identityError = error;
  }
  const records = [];
  const spans = new Map();
  const integrityErrors = [];
  let integrityDiagnosticDrops = 0;
  let nextSeq = 1;
  let dropped = 0;
  let overflowed = false;
  let originAt = null;
  let lastAt = null;

  function makeRecord(eventName, phase, details = {}) {
    assertStableString(eventName, 'trace eventName');
    const atMs = now();
    if (!Number.isFinite(atMs)) throw new TypeError('trace timestamp must be finite');
    if (lastAt !== null && atMs < lastAt) throw new TypeError('trace timestamp must be monotonic');
    const policyValue = validatePolicy(policy());
    if (originAt === null) originAt = atMs;
    lastAt = atMs;
    const record = {
      v: TRACE_VERSION,
      segment: activeSegment,
      seq: nextSeq++,
      atMs,
      eventName,
      phase,
      ...policyValue,
      ...details,
    };
    return deepFreeze(record);
  }

  function makeInternalRecord(eventName, attributes) {
    const atMs = lastAt ?? 0;
    if (originAt === null) originAt = atMs;
    lastAt = atMs;
    return deepFreeze({
      v: TRACE_VERSION,
      segment: activeSegment,
      seq: nextSeq++,
      atMs,
      eventName,
      phase: 'point',
      outcome: 'failed',
      attributes: deepFreeze(attributes),
    });
  }

  function updateOverflowRecord() {
    const index = records.findIndex((record) => record.eventName === 'error.trace-overflow');
    if (index >= 0) {
      records[index] = deepFreeze({
        ...records[index],
        attributes: deepFreeze({ dropped }),
      });
      return;
    }
    const marker = makeInternalRecord('error.trace-overflow', { dropped });
    records.push(marker);
    if (records.length > capacity) {
      records.shift();
      dropped += 1;
      records[records.length - 1] = deepFreeze({
        ...marker,
        attributes: deepFreeze({ dropped }),
      });
    }
  }

  function append(record, { overflowMarker = true } = {}) {
    records.push(record);
    if (records.length > capacity) {
      records.shift();
      dropped += 1;
      overflowed = true;
    }
    if (overflowed && overflowMarker) updateOverflowRecord();
    return record;
  }

  function recordIntegrity(message) {
    const boundedMessage = String(message).slice(0, 256);
    if (integrityErrors.length >= capacity) {
      integrityErrors.shift();
      integrityDiagnosticDrops += 1;
    }
    integrityErrors.push(boundedMessage);
    if (!enabled) return null;
    const record = makeInternalRecord('error.trace-integrity', { code: 'invalid-observation' });
    return append(record);
  }

  function rejectObservation(error, { abandon } = {}) {
    let message = 'unknown trace integrity error';
    try {
      message = error instanceof Error ? error.message : String(error);
    } catch {}
    if (strict) throw error;
    if (abandon) abandon();
    recordIntegrity(message);
    return null;
  }

  function emit(eventName, details = {}) {
    if (!enabled) return null;
    try {
      const validated = validateDetails(details, 'point');
      return append(makeRecord(eventName, 'point', validated));
    } catch (error) {
      return rejectObservation(error);
    }
  }

  function begin(eventName, details = {}) {
    if (!enabled) return deepFreeze({ finish: () => null });
    if (spans.size >= capacity) {
      rejectObservation(new Error(`active span capacity ${capacity} exceeded`));
      return deepFreeze({ finish: () => null });
    }
    let validated;
    let start;
    try {
      validated = validateDetails(details, 'start');
      start = append(makeRecord(eventName, 'start', validated));
    } catch (error) {
      rejectObservation(error);
      return deepFreeze({ finish: () => null });
    }

    const state = {
      seq: start.seq,
      eventName,
      correlationId: validated.correlationId ?? null,
      finished: false,
    };
    spans.set(start.seq, state);

    const finish = (outcome, patch = {}) => {
      const abandon = () => {
        state.finished = true;
        spans.delete(start.seq);
      };
      if (state.finished || !spans.has(start.seq)) {
        return rejectObservation(new Error(`span ${start.seq} already finished`));
      }
      try {
        if (!TRACE_END_OUTCOMES.has(outcome)) throw new TypeError(`invalid end outcome ${outcome}`);
        const endDetails = validateDetails(patch, 'end');
        if (endDetails.outcome !== undefined) throw new TypeError('end outcome must be supplied as finish argument');
        const inherited = { ...endDetails, outcome };
        const causeSeq = endDetails.causeSeq ?? validated.causeSeq;
        const correlationId = endDetails.correlationId ?? validated.correlationId;
        if (causeSeq !== undefined) inherited.causeSeq = causeSeq;
        if (correlationId !== undefined) inherited.correlationId = correlationId;
        const end = makeRecord(eventName, 'end', inherited);
        abandon();
        return append(end);
      } catch (error) {
        return rejectObservation(error, { abandon });
      }
    };
    return deepFreeze({ finish });
  }

  function activeSpans() {
    return deepFreeze([...spans.values()].map(({ seq, eventName, correlationId }) => ({
      seq, eventName, correlationId,
    })));
  }

  function assertIntegrity() {
    const errors = [];
    if (integrityDiagnosticDrops > 0) {
      errors.push(`trace dropped ${integrityDiagnosticDrops} integrity diagnostic(s)`);
    }
    errors.push(...integrityErrors);
    if (overflowed) errors.push(`trace dropped ${dropped} record(s)`);
    for (const span of spans.values()) errors.push(`orphan span ${span.seq} ${span.eventName}`);
    return deepFreeze({ ok: errors.length === 0, errors });
  }

  function read({ after = null, format = 'records' } = {}) {
    if (!FORMATS.has(format)) throw new TypeError(`Unknown trace format ${format}`);
    const firstSeq = records[0]?.seq ?? 0;
    const lastSeq = records.at(-1)?.seq ?? 0;
    const cursorSeq = after?.seq;
    const sameSegment = after !== null && after?.segment === activeSegment;
    const staleSeq = sameSegment && (!Number.isInteger(cursorSeq) || cursorSeq < Math.max(0, firstSeq - 1) || cursorSeq > lastSeq);
    const resetRead = after !== null && (!sameSegment || staleSeq);
    const includeHeader = after === null || resetRead;
    const selected = sameSegment && !staleSeq
      ? records.filter((record) => record.seq > cursorSeq)
      : [...records];
    const contract = format === 'contract';
    const header = includeHeader ? headerFor({
      enabled: Boolean(enabled), segment: activeSegment, firstSeq, lastSeq, dropped,
      reset: resetRead, identity: identityValue, contract,
    }) : null;
    let projectedRecords = [];
    let text = null;
    let ndjson = null;
    if (format === 'records') projectedRecords = selected;
    if (format === 'contract') projectedRecords = selected.map((record) => deepFreeze(contractCopy(record)));
    if (format === 'text') {
      const lines = [];
      if (header) lines.push(`# trace ${JSON.stringify(header)}`);
      lines.push(...selected.map((record) => textRecord(record, originAt ?? record.atMs)));
      text = lines.join('\n');
    }
    if (format === 'ndjson') {
      const rows = [];
      if (header) rows.push({ kind: 'trace-header', ...header });
      rows.push(...selected);
      ndjson = rows.map((row) => JSON.stringify(row)).join('\n');
    }
    return deepFreeze({
      v: TRACE_VERSION,
      enabled: Boolean(enabled),
      format,
      segment: activeSegment,
      firstSeq,
      lastSeq,
      dropped,
      reset: resetRead,
      header,
      cursor: { segment: activeSegment, seq: lastSeq },
      records: projectedRecords,
      text,
      ndjson,
    });
  }

  function reset() {
    if (spans.size && strict) throw new Error('cannot reset trace with active spans');
    let nextIdentity = deepFreeze({});
    let nextIdentityError = null;
    try {
      nextIdentity = validateIdentity(identity());
    } catch (error) {
      if (strict) throw error;
      nextIdentityError = error;
    }
    records.length = 0;
    spans.clear();
    integrityErrors.length = 0;
    integrityDiagnosticDrops = 0;
    nextSeq = 1;
    dropped = 0;
    overflowed = false;
    originAt = null;
    lastAt = null;
    segmentGeneration += 1;
    const suffix = `-r${segmentGeneration}`;
    activeSegment = `${initialSegment.slice(0, 128 - suffix.length)}${suffix}`;
    identityValue = nextIdentity;
    if (nextIdentityError) rejectObservation(nextIdentityError);
    return null;
  }

  for (const dependencyError of dependencyErrors) rejectObservation(dependencyError);
  if (identityError) rejectObservation(identityError);

  return deepFreeze({
    emit, begin, read, activeSpans, assertIntegrity, reset,
    enabled: Boolean(enabled),
  });
}
