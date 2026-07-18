// Policy inputs are capability records, never engine objects. This module is
// deliberately dependency-free so registry policies stay Node-pure.

export const OBSERVATION_SCHEMA_VERSION = 1;

const KNOWLEDGE_CLASSES = new Set(['baseline', 'player-visible', 'coverage-only']);
const BANNED_KEY = /^(?:run|cb|rng|engineRng|futureRng|drawPile|drawOrder|questId|armedQuestId|unrevealedQuestId|hiddenFace)$/i;

const plainRecord = (value) => value !== null && typeof value === 'object' &&
  !Array.isArray(value) && (Object.getPrototypeOf(value) === Object.prototype || Object.getPrototypeOf(value) === null);

function cloneVisible(value, path = 'observation') {
  if (value === null || typeof value === 'string' || typeof value === 'boolean') return value;
  if (typeof value === 'number') {
    if (!Number.isFinite(value)) throw new TypeError(`${path} must contain finite numbers`);
    return value;
  }
  if (Array.isArray(value)) return value.map((entry, index) => cloneVisible(entry, `${path}[${index}]`));
  if (!plainRecord(value)) throw new TypeError(`${path} must contain only visible data records`);
  const out = {};
  for (const [key, entry] of Object.entries(value)) {
    if (BANNED_KEY.test(key)) throw new TypeError(`${path}.${key} is not a policy capability`);
    if (entry === undefined) continue;
    out[key] = cloneVisible(entry, `${path}.${key}`);
  }
  return out;
}

function deepFreeze(value) {
  if (value && typeof value === 'object' && !Object.isFrozen(value)) {
    for (const entry of Object.values(value)) deepFreeze(entry);
    Object.freeze(value);
  }
  return value;
}

export function isDeepFrozen(value) {
  if (!value || typeof value !== 'object') return true;
  return Object.isFrozen(value) && Object.values(value).every(isDeepFrozen);
}

function visibleObjective(objective, knowledgeClass) {
  if (objective == null) return null;
  if (!plainRecord(objective)) throw new TypeError('objective must be a visible data record');
  const cloned = cloneVisible(objective, 'objective');
  if (knowledgeClass === 'baseline') throw new TypeError('baseline policies cannot receive an objective');
  if (knowledgeClass === 'coverage-only') {
    const keys = Object.keys(cloned).sort();
    if (keys.some((key) => key !== 'currentEligibility' && key !== 'targetId')) {
      throw new TypeError('coverage objective exposes only targetId and currentEligibility');
    }
  } else {
    if (cloned.disclosed !== true) {
      throw new TypeError('player-visible objective identity must be disclosed');
    }
    const keys = Object.keys(cloned).sort();
    if (keys.some((key) => !['currentEligibility', 'disclosed', 'targetId'].includes(key))) {
      throw new TypeError('player-visible objective exposes only disclosed target eligibility');
    }
  }
  if (typeof cloned.targetId !== 'string' || !cloned.targetId) throw new TypeError('objective.targetId is required');
  if (typeof cloned.currentEligibility !== 'boolean') throw new TypeError('objective.currentEligibility must be boolean');
  return cloned;
}

export function createObservation({
  phase, state = {}, legalActions, objective = null, knowledgeClass = 'player-visible',
}) {
  if (typeof phase !== 'string' || !phase) throw new TypeError('observation phase is required');
  if (!KNOWLEDGE_CLASSES.has(knowledgeClass)) throw new TypeError(`unknown knowledge class: ${knowledgeClass}`);
  if (!Array.isArray(legalActions) || legalActions.length === 0) {
    throw new TypeError('observation requires at least one legal action');
  }
  const actions = cloneVisible(legalActions, 'legalActions');
  const keys = new Set();
  for (const action of actions) {
    if (!plainRecord(action) || typeof action.key !== 'string' || !action.key) {
      throw new TypeError('each legal action requires a key');
    }
    if (keys.has(action.key)) throw new TypeError(`duplicate legal action key: ${action.key}`);
    keys.add(action.key);
  }
  return deepFreeze({
    schemaVersion: OBSERVATION_SCHEMA_VERSION,
    phase,
    knowledgeClass,
    state: cloneVisible(state, 'state'),
    objective: visibleObjective(objective, knowledgeClass),
    legalActions: actions,
  });
}

export function assertObservation(observation) {
  if (!isDeepFrozen(observation)) throw new TypeError('policy observation must be deeply frozen');
  if (observation?.schemaVersion !== OBSERVATION_SCHEMA_VERSION) {
    throw new TypeError(`unsupported policy observation schema: ${observation?.schemaVersion}`);
  }
  if (!Array.isArray(observation.legalActions) || observation.legalActions.length === 0) {
    throw new TypeError('policy observation has no legal actions');
  }
  if (!KNOWLEDGE_CLASSES.has(observation.knowledgeClass)) {
    throw new TypeError(`unknown knowledge class: ${observation.knowledgeClass}`);
  }
  visibleObjective(observation.objective, observation.knowledgeClass);
  const topKeys = Object.keys(observation).sort();
  if (topKeys.some((key) => ![
    'knowledgeClass', 'legalActions', 'objective', 'phase', 'schemaVersion', 'state',
  ].includes(key))) {
    // Run the capability-key check to retain an exact diagnostic such as
    // "observation.run is not a policy capability".
    cloneVisible(observation);
    throw new TypeError('policy observation contains an unknown capability');
  }
  cloneVisible(observation);
  const keys = new Set();
  for (const action of observation.legalActions) {
    if (!plainRecord(action) || typeof action.key !== 'string' || !action.key) {
      throw new TypeError('each legal action requires a key');
    }
    if (keys.has(action.key)) throw new TypeError(`duplicate legal action key: ${action.key}`);
    keys.add(action.key);
  }
  return observation;
}

export function deriveObservation(observation, legalActions) {
  assertObservation(observation);
  return createObservation({
    phase: observation.phase,
    knowledgeClass: observation.knowledgeClass,
    state: observation.state,
    objective: observation.objective,
    legalActions,
  });
}
