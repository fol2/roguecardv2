// Schema-2 Full Cycle telemetry. This is intentionally separate from the
// schema-1 Round reducer in telemetry.mjs: legacy reports keep their exact API
// and bytes while the runner can place this additive source in a cycle report.
//
// Source aggregates contain only integer counters, histograms, and whole-cycle
// records. Rates and every floating-point statistic are calculated once in
// finaliseCycles(), after worker partials have been merged (KTD7).

import {
  TRIGGER_CATALOGUE,
  TRIGGER_CATALOGUE_VERSION,
  assertTriggerFunnels,
  emptyTriggerFunnel,
} from './triggers.mjs';

export const CYCLE_SCHEMA_VERSION = 2;
export const DEFAULT_BOOTSTRAP_RESAMPLES = 1_000;

const WILSON_Z = 1.96;
const TERMINAL_STATUSES = new Set(['completed', 'censored', 'failed']);
const VOLATILE_META_KEYS = new Set([
  'date', 'durationMs', 'generatedAt', 'out', 'reportPath', 'worker', 'workers',
  'workerCount', 'workerIndex', 'partition', 'partitionIndex',
]);

const clone = (value) => value == null ? value : structuredClone(value);
const cmpStr = (a, b) => a < b ? -1 : a > b ? 1 : 0;
const r6 = (value) => Math.round(value * 1e6) / 1e6;
const finiteRate = (numerator, denominator) => denominator > 0
  ? r6(numerator / denominator)
  : null;
const bump = (record, key, by = 1) => {
  record[key] = (record[key] || 0) + by;
};

const sortDeep = (value) => {
  if (Array.isArray(value)) return value.map(sortDeep);
  if (value && typeof value === 'object') {
    const out = {};
    for (const key of Object.keys(value).sort(cmpStr)) out[key] = sortDeep(value[key]);
    return out;
  }
  return value;
};

const stableJson = (value) => JSON.stringify(sortDeep(value));

function requireNonNegativeInteger(value, name) {
  if (!Number.isSafeInteger(value) || value < 0) {
    throw new TypeError(`${name} must be a non-negative safe integer`);
  }
  return value;
}

function requirePositiveInteger(value, name) {
  if (!Number.isSafeInteger(value) || value < 1) {
    throw new TypeError(`${name} must be a positive safe integer`);
  }
  return value;
}

function semanticMeta(value) {
  if (Array.isArray(value)) return value.map(semanticMeta);
  if (!value || typeof value !== 'object') return value;
  const out = {};
  for (const key of Object.keys(value).sort(cmpStr)) {
    if (!VOLATILE_META_KEYS.has(key)) out[key] = semanticMeta(value[key]);
  }
  return out;
}

function mergeMeta(left, right) {
  if (Object.keys(left).length === 0) return clone(right);
  if (Object.keys(right).length === 0) return clone(left);
  if (stableJson(left) !== stableJson(right)) {
    throw new Error('cycle aggregate metadata must match across partitions');
  }
  return clone(left);
}

function addCounterMap(left, right) {
  const out = { ...left };
  for (const [key, count] of Object.entries(right)) bump(out, key, count);
  return out;
}

function addRoundCells(left, right) {
  const out = {};
  for (const [ordinal, cell] of Object.entries(left)) out[ordinal] = { ...cell };
  for (const [ordinal, cell] of Object.entries(right)) {
    const target = out[ordinal] ||= { started: 0, dawns: 0, falls: 0, errors: 0 };
    for (const field of ['started', 'dawns', 'falls', 'errors']) target[field] += cell[field];
  }
  return out;
}

function addTimingCells(left, right) {
  const out = {};
  for (const [round, cell] of Object.entries(left)) out[round] = { ...cell };
  for (const [round, cell] of Object.entries(right)) {
    const target = out[round] ||= { events: 0, censored: 0 };
    target.events += cell.events;
    target.censored += cell.censored;
  }
  return out;
}

function mergeFunnelsInto(targets, source) {
  for (const [id, funnel] of Object.entries(source)) {
    const target = targets[id] ||= emptyTriggerFunnel();
    for (const field of ['eligible', 'attempted', 'succeeded', 'missed']) target[field] += funnel[field];
    target.reasons = addCounterMap(target.reasons, funnel.reasons);
  }
  return targets;
}

function addFunnels(left, right) {
  const out = {};
  for (const [id, funnel] of Object.entries(left)) {
    out[id] = { ...funnel, reasons: { ...funnel.reasons } };
  }
  return mergeFunnelsInto(out, right);
}

function outcomeKind(outcome) {
  if (outcome === 'win' || outcome === 'dawn') return 'dawns';
  if (outcome === 'death' || outcome === 'fall') return 'falls';
  if (outcome === 'error') return 'errors';
  throw new TypeError(`unknown Round outcome: ${String(outcome)}`);
}

function wilson(wins, n) {
  const z2 = WILSON_Z * WILSON_Z;
  const p = wins / n;
  const denominator = 1 + z2 / n;
  const centre = (p + z2 / (2 * n)) / denominator;
  const half = WILSON_Z * Math.sqrt((p * (1 - p)) / n + z2 / (4 * n * n)) / denominator;
  return [r6(Math.max(0, centre - half)), r6(Math.min(1, centre + half))];
}

function histogramRows(histogram) {
  return Object.entries(histogram)
    .map(([round, count]) => ({ round: Number(round), count }))
    .sort((a, b) => a.round - b.round);
}

function nearestRank(sorted, percentile) {
  if (sorted.length === 0) return null;
  return sorted[Math.max(0, Math.ceil(percentile * sorted.length) - 1)];
}

function descriptive(values, { histogram = true } = {}) {
  const sorted = [...values].sort((a, b) => a - b);
  const unavailable = sorted.length === 0;
  return {
    label: 'Descriptive among completed cycles only',
    n: sorted.length,
    ...(histogram ? {
      histogram: unavailable ? [] : histogramRows(sorted.reduce((out, value) => {
        bump(out, value);
        return out;
      }, {})),
    } : {}),
    p10: unavailable ? null : nearestRank(sorted, 0.1),
    p50: unavailable ? null : nearestRank(sorted, 0.5),
    p90: unavailable ? null : nearestRank(sorted, 0.9),
    availability: unavailable ? 'unavailable' : 'available',
    message: unavailable ? 'No completed cycles' : null,
  };
}

function compactVigil(vigil) {
  return {
    shards: Array.isArray(vigil?.shards) ? [...vigil.shards] : [],
    promise: vigil?.act4Promise?.status || vigil?.promise || null,
    lastFallStanding: vigil?.lastFall?.standing === true || vigil?.lastFallStanding === true,
  };
}

function compactRun(record) {
  return {
    outcome: record?.outcome || null,
    actReached: Number.isInteger(record?.actReached) ? record.actReached : null,
    floorsReached: Number.isInteger(record?.floorsReached) ? record.floorsReached : null,
    hp: Number.isFinite(record?.hp) ? record.hp : null,
    gold: Number.isFinite(record?.gold) ? record.gold : null,
  };
}

function reproductionCommand(identity) {
  const args = [
    'node tools/sim/runner.mjs',
    '--mode cycle',
    '--cycles 1',
    `--max-rounds ${identity.maxRounds}`,
    `--policy ${identity.policy}`,
    `--seed ${identity.cycleSeed}`,
  ];
  if (identity.targetId) args.push(`--target ${identity.targetId}`);
  return args.join(' ');
}

function normaliseReproduction(cycle, round, supplied = {}) {
  const identity = {
    policy: supplied.policy || cycle.policy || 'unknown',
    cycleSeed: Number.isSafeInteger(supplied.cycleSeed) ? supplied.cycleSeed : cycle.cycleSeed,
    roundOrdinal: Number.isInteger(supplied.roundOrdinal) ? supplied.roundOrdinal : round.ordinal,
    runSeed: Number.isSafeInteger(supplied.runSeed) ? supplied.runSeed : round.runSeed,
    phase: supplied.phase || 'unknown',
    triggerId: supplied.triggerId ?? cycle.targetId ?? null,
    reason: supplied.reason || 'unknown',
    targetId: supplied.targetId ?? cycle.targetId ?? null,
    vigil: compactVigil(supplied.vigil || round.vigilAfter),
    run: supplied.run ? clone(supplied.run) : compactRun(round.record),
    maxRounds: cycle.maxRounds,
  };
  return {
    policy: identity.policy,
    cycleSeed: identity.cycleSeed,
    roundOrdinal: identity.roundOrdinal,
    runSeed: identity.runSeed,
    phase: identity.phase,
    triggerId: identity.triggerId,
    reason: identity.reason,
    targetId: identity.targetId,
    vigil: identity.vigil,
    run: identity.run,
    command: reproductionCommand(identity),
  };
}

function normaliseIssue(cycle, round, issue) {
  const reproduction = normaliseReproduction(cycle, round, issue?.repro || {
    phase: issue?.phase,
    reason: issue?.kind,
  });
  return {
    kind: issue?.kind || 'cycle-issue',
    phase: issue?.phase || reproduction.phase,
    message: String(issue?.message || issue?.kind || 'Cycle issue'),
    stack: typeof issue?.stack === 'string' ? issue.stack : null,
    triggerId: reproduction.triggerId,
    reason: reproduction.reason,
    targetId: reproduction.targetId,
    reproduction,
  };
}

const issueCmp = (left, right) =>
  left.reproduction.cycleSeed - right.reproduction.cycleSeed ||
  left.reproduction.roundOrdinal - right.reproduction.roundOrdinal ||
  left.reproduction.runSeed - right.reproduction.runSeed ||
  cmpStr(left.kind, right.kind) || cmpStr(left.phase, right.phase) ||
  cmpStr(left.message, right.message) || cmpStr(stableJson(left), stableJson(right));

function cycleFunnel(cycle, id) {
  let out = emptyTriggerFunnel();
  for (const round of cycle.rounds) {
    const funnel = round.record?.triggerFunnels?.[id];
    if (funnel) out = addFunnels({ [id]: out }, { [id]: funnel })[id];
  }
  return out;
}

function targetMissIssue(cycle) {
  if (cycle.policy !== 'coverage' || !cycle.targetId) return null;
  const funnel = cycleFunnel(cycle, cycle.targetId);
  if (funnel.succeeded > 0) return null;
  const reasons = Object.keys(funnel.reasons).sort(cmpStr);
  let observedMiss = null;
  for (const round of cycle.rounds) {
    const event = (round.record?.triggerEvents || []).find(({ triggerId, missed }) =>
      triggerId === cycle.targetId && missed === 1);
    if (event) { observedMiss = { round, event }; break; }
  }
  const round = observedMiss?.round || cycle.rounds.at(-1);
  const reason = observedMiss?.event?.reason || reasons[0] || 'not-observed';
  const phase = observedMiss?.event?.phase || 'terminal';
  const reproduction = normaliseReproduction(cycle, round, {
    ...(observedMiss?.event?.repro || {}),
    phase, triggerId: cycle.targetId, reason, targetId: cycle.targetId,
  });
  return {
    kind: 'target-missed',
    phase,
    message: `Coverage target '${cycle.targetId}' did not succeed (${reason})`,
    stack: null,
    triggerId: cycle.targetId,
    reason,
    targetId: cycle.targetId,
    reproduction,
  };
}

function assertCycleShape(cycle, aggregate) {
  requireNonNegativeInteger(cycle?.cycleSeed, 'cycle.cycleSeed');
  requirePositiveInteger(cycle?.maxRounds, 'cycle.maxRounds');
  if (aggregate.maxRounds != null && aggregate.maxRounds !== cycle.maxRounds) {
    throw new Error(`cycle maxRounds ${cycle.maxRounds} does not match aggregate maxRounds ${aggregate.maxRounds}`);
  }
  if (!Array.isArray(cycle.rounds) || cycle.rounds.length === 0) {
    throw new TypeError('cycle.rounds must contain at least one attempted Round');
  }
  const status = cycle.terminal?.status;
  if (!TERMINAL_STATUSES.has(status)) throw new TypeError(`unknown cycle terminal status: ${String(status)}`);
  cycle.rounds.forEach((round, index) => {
    if (round?.ordinal !== index + 1) throw new Error('cycle Round ordinals must be contiguous and one-based');
    requireNonNegativeInteger(round.runSeed, `cycle.rounds[${index}].runSeed`);
    outcomeKind(round.record?.outcome);
    const funnels = round.record?.triggerFunnels || {};
    assertTriggerFunnels(funnels);
    const version = round.record?.triggerCatalogueVersion;
    if (Object.keys(funnels).length > 0 && version !== TRIGGER_CATALOGUE_VERSION) {
      throw new Error(`trigger catalogue version mismatch: ${String(version)}`);
    }
  });
  if (status === 'completed') {
    if (!Number.isInteger(cycle.stagedRound) || cycle.stagedRound < 1 ||
        cycle.stagedRound > cycle.rounds.length) {
      throw new Error('completed cycle requires an observed stagedRound');
    }
  }
  if (status === 'censored' && cycle.rounds.length !== cycle.maxRounds) {
    throw new Error('censored cycle must retain every attempted Round through maxRounds');
  }
  if (status === 'failed' && outcomeKind(cycle.rounds.at(-1).record?.outcome) !== 'errors') {
    throw new Error('failed cycle must end on an errored Round');
  }
}

export function newCycleAggregate(meta = {}) {
  const bootstrapResamples = meta.bootstrapResamples ?? DEFAULT_BOOTSTRAP_RESAMPLES;
  requirePositiveInteger(bootstrapResamples, 'bootstrapResamples');
  const maxRounds = meta.maxRounds == null ? null : requirePositiveInteger(meta.maxRounds, 'maxRounds');
  return {
    // Worker identity and wall-clock fields never belong to source telemetry.
    // The runner may retain them in its outer report metadata, but stripping
    // them here makes partials from different workers merge-compatible and
    // keeps the bootstrap seed semantic.
    meta: semanticMeta(meta),
    maxRounds,
    bootstrapResamples,
    counts: { started: 0, completed: 0, censored: 0, failed: 0, totalRounds: 0 },
    roundCells: {},
    completedHistogram: {},
    thresholdHistogram: {},
    deliveryHistogram: {},
    timingCells: {},
    suffixClusters: [],
    funnels: {},
    issues: [],
    triggerCatalogueVersion: null,
  };
}

export function reduceCycle(aggregate, cycle) {
  assertCycleShape(cycle, aggregate);
  if (aggregate.maxRounds == null) aggregate.maxRounds = cycle.maxRounds;
  aggregate.counts.started++;
  aggregate.counts[cycle.terminal.status]++;
  aggregate.counts.totalRounds += cycle.rounds.length;

  const outcomes = [];
  for (const round of cycle.rounds) {
    const kind = outcomeKind(round.record.outcome);
    const cell = aggregate.roundCells[round.ordinal] ||= {
      started: 0, dawns: 0, falls: 0, errors: 0,
    };
    cell.started++;
    cell[kind]++;
    outcomes.push(kind === 'dawns' ? 1 : 0);

    if (round.record.triggerCatalogueVersion != null) {
      if (aggregate.triggerCatalogueVersion != null &&
          aggregate.triggerCatalogueVersion !== round.record.triggerCatalogueVersion) {
        throw new Error('cycle aggregate mixed trigger catalogue versions');
      }
      aggregate.triggerCatalogueVersion = round.record.triggerCatalogueVersion;
    }
    mergeFunnelsInto(aggregate.funnels, round.record.triggerFunnels || {});
    for (const issue of round.record.issues || []) {
      aggregate.issues.push(normaliseIssue(cycle, round, issue));
    }
  }

  const completed = cycle.terminal.status === 'completed';
  const completionRound = completed ? cycle.stagedRound : null;
  let perfectSuffixStart = null;
  if (completed) {
    bump(aggregate.completedHistogram, completionRound);
    bump(aggregate.deliveryHistogram, completionRound);
    const cell = aggregate.timingCells[completionRound] ||= { events: 0, censored: 0 };
    cell.events++;
    let suffixIsPerfect = true;
    for (let index = outcomes.length - 1; index >= 0; index -= 1) {
      suffixIsPerfect = suffixIsPerfect && outcomes[index] === 1;
      if (suffixIsPerfect) perfectSuffixStart = index + 1;
    }
    if (perfectSuffixStart == null) {
      throw new Error('completed cycle must end with a Dawn perfect suffix');
    }
  } else if (cycle.terminal.status === 'censored') {
    const censorRound = cycle.terminal.round ?? cycle.rounds.length;
    requirePositiveInteger(censorRound, 'cycle.terminal.round');
    const cell = aggregate.timingCells[censorRound] ||= { events: 0, censored: 0 };
    cell.censored++;
  }
  if (cycle.thresholdRound != null) {
    requirePositiveInteger(cycle.thresholdRound, 'cycle.thresholdRound');
    bump(aggregate.thresholdHistogram, cycle.thresholdRound);
  }

  aggregate.suffixClusters.push({
    cycleSeed: cycle.cycleSeed,
    policy: cycle.policy || 'unknown',
    targetId: cycle.targetId || null,
    completed,
    outcomes,
    perfectSuffixStart,
  });
  const missed = targetMissIssue(cycle);
  if (missed) aggregate.issues.push(missed);
  return aggregate;
}

export function mergeCycleAggregates(left, right) {
  if (left.bootstrapResamples !== right.bootstrapResamples) {
    throw new Error('cycle aggregate bootstrap resamples must match');
  }
  if (left.maxRounds != null && right.maxRounds != null && left.maxRounds !== right.maxRounds) {
    throw new Error('cycle aggregate maxRounds must match');
  }
  if (left.triggerCatalogueVersion != null && right.triggerCatalogueVersion != null &&
      left.triggerCatalogueVersion !== right.triggerCatalogueVersion) {
    throw new Error('cycle aggregate trigger catalogue versions must match');
  }
  const out = newCycleAggregate(mergeMeta(left.meta, right.meta));
  out.maxRounds = left.maxRounds ?? right.maxRounds;
  out.triggerCatalogueVersion = left.triggerCatalogueVersion ?? right.triggerCatalogueVersion;
  for (const field of Object.keys(out.counts)) out.counts[field] = left.counts[field] + right.counts[field];
  out.roundCells = addRoundCells(left.roundCells, right.roundCells);
  out.completedHistogram = addCounterMap(left.completedHistogram, right.completedHistogram);
  out.thresholdHistogram = addCounterMap(left.thresholdHistogram, right.thresholdHistogram);
  out.deliveryHistogram = addCounterMap(left.deliveryHistogram, right.deliveryHistogram);
  out.timingCells = addTimingCells(left.timingCells, right.timingCells);
  out.suffixClusters = [...left.suffixClusters.map(clone), ...right.suffixClusters.map(clone)];
  out.funnels = addFunnels(left.funnels, right.funnels);
  out.issues = [...left.issues.map(clone), ...right.issues.map(clone)];
  return out;
}

function hashText(text) {
  let hash = 0x811c9dc5;
  for (let index = 0; index < text.length; index += 1) {
    hash ^= text.charCodeAt(index);
    hash = Math.imul(hash, 0x01000193);
  }
  return hash >>> 0;
}

function mixSeed(seed, ordinal) {
  let value = seed ^ Math.imul(ordinal, 0x9e3779b1);
  value = Math.imul(value ^ (value >>> 16), 0x21f0aaad);
  value = Math.imul(value ^ (value >>> 15), 0x735a2d97);
  return (value ^ (value >>> 15)) >>> 0;
}

function mulberry32(seed) {
  let state = seed >>> 0;
  return () => {
    state = (state + 0x6d2b79f5) >>> 0;
    let value = state;
    value = Math.imul(value ^ (value >>> 15), value | 1);
    value ^= value + Math.imul(value ^ (value >>> 7), value | 61);
    return ((value ^ (value >>> 14)) >>> 0) / 4294967296;
  };
}

function bootstrapInterval(contributions, resamples, seed) {
  if (contributions.length === 0) return [null, null];
  const random = mulberry32(seed);
  const rates = [];
  for (let replicate = 0; replicate < resamples; replicate += 1) {
    let dawns = 0;
    let n = 0;
    for (let draw = 0; draw < contributions.length; draw += 1) {
      const sampled = contributions[Math.floor(random() * contributions.length)];
      dawns += sampled.dawns;
      n += sampled.n;
    }
    if (n > 0) rates.push(dawns / n);
  }
  rates.sort((a, b) => a - b);
  return [r6(nearestRank(rates, 0.025)), r6(nearestRank(rates, 0.975))];
}

function finaliseRounds(aggregate) {
  return Object.entries(aggregate.roundCells)
    .map(([ordinal, cell]) => ({
      ordinal: Number(ordinal),
      atRisk: cell.started,
      started: cell.started,
      dawns: cell.dawns,
      falls: cell.falls,
      errors: cell.errors,
      winRate: r6(cell.dawns / cell.started),
      wilson95: wilson(cell.dawns, cell.started),
    }))
    .sort((a, b) => a.ordinal - b.ordinal);
}

function finaliseKaplanMeier(aggregate) {
  const population = aggregate.counts.completed + aggregate.counts.censored;
  if (population === 0) {
    return {
      population: {
        n: 0, completed: 0, censored: 0, failedExcluded: aggregate.counts.failed,
      },
      cells: [],
      quantiles: { p10: null, p50: null, p90: null },
      restrictedMeanRounds: { through: aggregate.maxRounds, value: null },
      availability: 'unavailable',
    };
  }
  let atRisk = population;
  let survival = 1;
  let restrictedMean = 0;
  const cells = [];
  const quantiles = { p10: null, p50: null, p90: null };
  const thresholds = { p10: 0.9, p50: 0.5, p90: 0.1 };
  for (let round = 1; round <= aggregate.maxRounds; round += 1) {
    const source = aggregate.timingCells[round] || { events: 0, censored: 0 };
    restrictedMean += survival;
    if (source.events > atRisk || source.events + source.censored > atRisk) {
      throw new Error(`Kaplan-Meier cell at Round ${round} exceeds its at-risk population`);
    }
    if (source.events > 0) survival *= 1 - source.events / atRisk;
    for (const [key, threshold] of Object.entries(thresholds)) {
      if (quantiles[key] == null && survival <= threshold) quantiles[key] = round;
    }
    cells.push({
      round, atRisk, events: source.events, censored: source.censored,
      survival: r6(survival),
    });
    atRisk -= source.events + source.censored;
  }
  if (atRisk !== 0) {
    throw new Error(`${atRisk} timing observation(s) extend beyond maxRounds`);
  }
  return {
    population: {
      n: population,
      completed: aggregate.counts.completed,
      censored: aggregate.counts.censored,
      failedExcluded: aggregate.counts.failed,
    },
    cells,
    quantiles,
    restrictedMeanRounds: { through: aggregate.maxRounds, value: r6(restrictedMean) },
    availability: 'available',
  };
}

function finaliseSuffix(aggregate, bootstrapSeed) {
  const clusters = [...aggregate.suffixClusters].sort((left, right) =>
    left.cycleSeed - right.cycleSeed || cmpStr(left.policy, right.policy) ||
    cmpStr(left.targetId || '', right.targetId || '') ||
    cmpStr(left.outcomes.join(''), right.outcomes.join('')) ||
    cmpStr(stableJson(left), stableJson(right)));
  const lastOrdinal = clusters.reduce((max, cluster) => Math.max(max, cluster.outcomes.length), 0);
  const rounds = [];
  for (let ordinal = 1; ordinal <= lastOrdinal; ordinal += 1) {
    const contributions = clusters
      .filter((cluster) => cluster.outcomes.length >= ordinal)
      .map((cluster) => {
        const suffix = cluster.outcomes.slice(ordinal - 1);
        return { n: suffix.length, dawns: suffix.reduce((sum, win) => sum + win, 0) };
      });
    const n = contributions.reduce((sum, cell) => sum + cell.n, 0);
    const dawns = contributions.reduce((sum, cell) => sum + cell.dawns, 0);
    rounds.push({
      ordinal,
      clusters: contributions.length,
      n,
      wins: dawns,
      winRate: r6(dawns / n),
      clusterBootstrap95: bootstrapInterval(
        contributions,
        aggregate.bootstrapResamples,
        mixSeed(bootstrapSeed, ordinal),
      ),
    });
  }
  const perfectValues = clusters
    .filter((cluster) => cluster.completed)
    .map((cluster) => cluster.perfectSuffixStart);
  return {
    metadata: {
      method: 'whole-cycle cluster bootstrap percentile 95%',
      resamples: aggregate.bootstrapResamples,
      seed: bootstrapSeed,
      unit: 'cycle',
    },
    rounds,
    perfectSuffixStart: descriptive(perfectValues),
  };
}

function finaliseTriggers(aggregate) {
  const funnels = {};
  for (const definition of TRIGGER_CATALOGUE) {
    funnels[definition.id] = aggregate.funnels[definition.id]
      ? clone(aggregate.funnels[definition.id])
      : emptyTriggerFunnel();
  }
  assertTriggerFunnels(funnels);
  return {
    catalogueVersion: aggregate.triggerCatalogueVersion ?? TRIGGER_CATALOGUE_VERSION,
    definitions: TRIGGER_CATALOGUE.map((definition) => ({
      id: definition.id,
      countingUnit: definition.countingUnit,
      eligibility: definition.eligibility,
      attempt: clone(definition.attempt),
      observedSuccessDelta: definition.observedSuccessDelta.name || 'catalogue-defined',
      deduplication: definition.deduplication,
      missReasons: [...definition.missReasons],
    })),
    funnels,
  };
}

export function finaliseCycles(aggregate) {
  if (aggregate.counts.started === 0 || aggregate.maxRounds == null) {
    throw new Error('cannot finalise an empty cycle aggregate');
  }
  if (aggregate.counts.started !==
      aggregate.counts.completed + aggregate.counts.censored + aggregate.counts.failed) {
    throw new Error('cycle terminal counts do not close');
  }
  const completedValues = Object.entries(aggregate.completedHistogram)
    .flatMap(([round, count]) => Array(count).fill(Number(round)));
  const completedOnlyBase = descriptive(completedValues);
  const completedOnly = {
    label: completedOnlyBase.label,
    n: completedOnlyBase.n,
    histogram: completedOnlyBase.histogram,
    meanRounds: completedValues.length > 0
      ? r6(completedValues.reduce((sum, value) => sum + value, 0) / completedValues.length)
      : null,
    p10: completedOnlyBase.p10,
    p50: completedOnlyBase.p50,
    p90: completedOnlyBase.p90,
    availability: completedOnlyBase.availability,
    message: completedOnlyBase.message,
  };
  const semantic = semanticMeta(aggregate.meta);
  const bootstrapSeed = hashText(stableJson({
    schema: CYCLE_SCHEMA_VERSION,
    mode: 'cycle',
    config: semantic,
  }));
  const result = {
    meta: {
      ...clone(aggregate.meta),
      schema: CYCLE_SCHEMA_VERSION,
      mode: 'cycle',
      cycles: aggregate.counts.started,
      totalRounds: aggregate.counts.totalRounds,
      maxRounds: aggregate.maxRounds,
      triggerCatalogueVersion: aggregate.triggerCatalogueVersion ?? TRIGGER_CATALOGUE_VERSION,
      statisticalDefinitions: {
        ordinal: 'Dawn rate by reached Round ordinal with Wilson score 95% interval',
        completedOnly: 'Descriptive timing among completed cycles only',
        kaplanMeier: 'Completed events plus max-Round censors; failed cycles excluded',
        restrictedMean: `Restricted mean Rounds through ${aggregate.maxRounds}`,
        suffix: 'Pooled attempted Rounds from ordinal onward; whole-cycle cluster bootstrap 95%',
        percentile: 'Nearest-rank empirical percentile',
      },
    },
    rounds: finaliseRounds(aggregate),
    completion: {
      counts: {
        started: aggregate.counts.started,
        completed: aggregate.counts.completed,
        censored: aggregate.counts.censored,
        failed: aggregate.counts.failed,
        timingPopulation: aggregate.counts.completed + aggregate.counts.censored,
      },
      rates: {
        completion: finiteRate(aggregate.counts.completed, aggregate.counts.started),
        censoring: finiteRate(aggregate.counts.censored, aggregate.counts.started),
        failure: finiteRate(aggregate.counts.failed, aggregate.counts.started),
      },
      threshold: {
        label: 'Round of six-Shard threshold',
        n: Object.values(aggregate.thresholdHistogram).reduce((sum, count) => sum + count, 0),
        histogram: histogramRows(aggregate.thresholdHistogram),
      },
      delivery: {
        label: 'Round of durable act4Reveal delivery',
        n: aggregate.counts.completed,
        histogram: histogramRows(aggregate.deliveryHistogram),
      },
      completedOnly,
      kaplanMeier: finaliseKaplanMeier(aggregate),
    },
    progressiveSuffix: finaliseSuffix(aggregate, bootstrapSeed),
    triggers: finaliseTriggers(aggregate),
    issues: [...aggregate.issues].sort(issueCmp),
  };
  return sortDeep(result);
}

export function serialiseCycles(report) {
  return `${JSON.stringify(sortDeep(report), null, 2)}\n`;
}
