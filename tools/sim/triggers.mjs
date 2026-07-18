// Versioned metric definitions for Emberglass trigger evidence. The walker
// supplies engine snapshots and a chosen action; only this observer decides
// whether the engine transition succeeded (KTD6).

export const TRIGGER_CATALOGUE_VERSION = 1;

const AUTO = 'automatic';
const CHOSEN = 'chosen-action';
const truthy = (before, after) => before?.value !== true && after?.value === true;
const present = (_before, after) => after?.value === true;
const increased = (before, after) => Number(after?.value) > Number(before?.value);

const definitions = [
  ['pale.hidden-encounter', 'encounter', AUTO, [], truthy, 'round:encounter', ['not-hidden', 'wrong-face']],
  ['pale.marked-encounter', 'encounter', AUTO, [], truthy, 'round:encounter', ['mark-missed', 'wrong-face']],
  ['pale.kill', 'encounter', AUTO, [], increased, 'round:encounter', ['combat-fall', 'variant-survived']],
  ['shade.qualifying-fall', 'round', CHOSEN, ['fall'], truthy, 'round', ['dawn', 'fall-too-early', 'quest-inactive']],
  ['shade.standing-monument', 'round', AUTO, [], truthy, 'round', ['monument-not-reached', 'monument-missed']],
  ['shade.duel', 'monument', CHOSEN, ['duel'], truthy, 'round:monument', ['claim-retry', 'clear-retry', 'reload-pending', 'not-selected']],
  ['shade.win', 'duel', AUTO, [], increased, 'round:duel', ['duel-fall', 'duel-error']],
  ['usurper.offer', 'shop-visit', AUTO, [], truthy, 'round:shop', ['wrong-act', 'quest-inactive', 'already-bought']],
  ['usurper.afford', 'shop-visit', AUTO, [], present, 'round:shop', ['insufficient-gold']],
  ['usurper.buy', 'shop-visit', CHOSEN, ['buy'], truthy, 'round:shop', ['insufficient-gold', 'not-selected', 'purchase-rejected']],
  ['usurper.transformed-summit', 'boss-encounter', AUTO, [], truthy, 'round:boss', ['lantern-not-bought', 'wrong-enemy']],
  ['usurper.kill', 'boss-encounter', AUTO, [], increased, 'round:boss', ['combat-fall', 'sovereign-survived']],
  ['eighth.active', 'round', AUTO, [], present, 'round', ['omen-inactive']],
  ['eighth.final-attempt', 'boss-encounter', AUTO, [], truthy, 'round:boss', ['fall-before-summit', 'final-fall']],
  ['eighth.dawn', 'round', CHOSEN, ['dawn'], increased, 'round', ['fall', 'simulator-error']],
  ['page.offer', 'reward', AUTO, [], truthy, 'round:reward', ['wrong-reward-ordinal', 'final-reward', 'quest-inactive']],
  ['page.take', 'reward', CHOSEN, ['take'], increased, 'round:reward', ['skipped', 'invalid-choice']],
  ['page.carry', 'boss-encounter', AUTO, [], present, 'round:boss', ['page-not-held', 'quest-inactive']],
  ['page.read', 'round', CHOSEN, ['dawn'], increased, 'round', ['fall', 'page-not-held']],
  ['hollow.due', 'round', AUTO, [], present, 'round', ['not-due', 'debt-active', 'quest-inactive']],
  ['hollow.reachable', 'round', AUTO, [], present, 'round', ['no-unlit-route']],
  ['hollow.entered', 'hollow-meeting', CHOSEN, ['enter'], truthy, 'round:hollow', ['unlit-not-chosen', 'meeting-cap']],
  ['hollow.paid', 'hollow-meeting', CHOSEN, ['pay'], truthy, 'round:hollow', ['left-unpaid', 'price-unaffordable', 'payment-rejected']],
  ['hollow.progressed', 'hollow-meeting', CHOSEN, ['pay'], increased, 'round:hollow', ['deferred-ember-debt', 'left-unpaid', 'price-unaffordable', 'payment-rejected']],
  ['shard.threshold', 'quest-completion', AUTO, [], increased, 'round:terminal', ['threshold-not-crossed', 'terminal-rejected']],
  ['act4Reveal.staged', 'round', CHOSEN, ['dawn'], truthy, 'round:terminal', ['promise-locked', 'fall', 'terminal-rejected']],
];

const freeze = (value) => {
  if (value && typeof value === 'object' && !Object.isFrozen(value)) {
    for (const child of Object.values(value)) freeze(child);
    Object.freeze(value);
  }
  return value;
};

export const TRIGGER_CATALOGUE = freeze(definitions.map(([
  id, countingUnit, attemptMode, attemptActions, observedSuccessDelta,
  deduplication, missReasons,
]) => ({
  id, countingUnit, eligibility: 'before.eligible === true',
  attempt: { mode: attemptMode, actions: attemptActions },
  observedSuccessDelta, deduplication, missReasons,
})));

const byId = new Map(TRIGGER_CATALOGUE.map((definition) => [definition.id, definition]));

export function triggerIds() {
  return TRIGGER_CATALOGUE.map(({ id }) => id);
}

export function getTriggerDefinition(id) {
  return byId.get(id) || null;
}

export const emptyTriggerFunnel = () => ({
  eligible: 0, attempted: 0, succeeded: 0, missed: 0, reasons: {},
});
const integer = (value) => Number.isInteger(value) && value >= 0;

export function assertTriggerFunnels(funnels) {
  if (!funnels || typeof funnels !== 'object' || Array.isArray(funnels)) {
    throw new TypeError('trigger funnels must be a record');
  }
  for (const [id, funnel] of Object.entries(funnels)) {
    const definition = byId.get(id);
    if (!definition) throw new TypeError(`unknown trigger funnel: ${id}`);
    for (const key of ['eligible', 'attempted', 'succeeded', 'missed']) {
      if (!integer(funnel?.[key])) throw new TypeError(`${id}.${key} must be a non-negative integer`);
    }
    if (!(funnel.succeeded <= funnel.attempted && funnel.attempted <= funnel.eligible)) {
      throw new Error(`${id} violates succeeded <= attempted <= eligible`);
    }
    if (funnel.missed !== funnel.eligible - funnel.succeeded) {
      throw new Error(`${id}.missed must equal eligible - succeeded`);
    }
    let reasons = 0;
    for (const [reason, count] of Object.entries(funnel.reasons || {})) {
      if (!definition.missReasons.includes(reason)) throw new Error(`${id} has unknown miss reason: ${reason}`);
      if (!integer(count)) throw new TypeError(`${id}.reasons.${reason} must be a non-negative integer`);
      reasons += count;
    }
    if (reasons !== funnel.missed) throw new Error(`${id} miss reasons must close the funnel`);
  }
  return funnels;
}

const compactVigil = (vigil) => ({
  shards: Array.isArray(vigil?.shards) ? [...vigil.shards] : [],
  promise: vigil?.act4Promise?.status || null,
  lastFallStanding: vigil?.lastFall?.standing === true,
});

export function createTriggerObserver(identity = {}) {
  const baseRepro = Object.freeze({
    policy: identity.policy || 'unknown',
    cycleSeed: Number.isInteger(identity.cycleSeed) ? identity.cycleSeed : null,
    roundOrdinal: Number.isInteger(identity.roundOrdinal) ? identity.roundOrdinal : 1,
    runSeed: Number.isInteger(identity.runSeed) ? identity.runSeed : null,
    targetId: identity.targetId || null,
    vigil: compactVigil(identity.vigil),
  });
  const seen = new Set();
  const events = [];
  const counts = Object.fromEntries(TRIGGER_CATALOGUE.map(({ id }) => [id, emptyTriggerFunnel()]));

  const observe = (id, sample) => {
    const definition = byId.get(id);
    if (!definition) throw new TypeError(`unknown trigger: ${id}`);
    if (sample && (Object.hasOwn(sample, 'succeeded') || Object.hasOwn(sample, 'success'))) {
      throw new TypeError('trigger success is observer-owned');
    }
    if (typeof sample?.unitId !== 'string' || !sample.unitId) throw new TypeError(`${id} requires unitId`);
    const dedupeKey = `${id}:${definition.deduplication}:${sample.unitId}`;
    if (seen.has(dedupeKey)) return null;
    if (sample.before?.eligible !== true) return null;
    seen.add(dedupeKey);

    const attempted = definition.attempt.mode === AUTO
      ? sample.intent?.automatic === true
      : definition.attempt.actions.includes(sample.intent?.action);
    const succeeded = attempted && definition.observedSuccessDelta(sample.before, sample.after, sample);
    const reason = succeeded ? null : (sample.after?.reason || sample.intent?.reason || null);
    if (!succeeded && !definition.missReasons.includes(reason)) {
      throw new Error(`${id} requires a closed miss reason (received ${String(reason)})`);
    }
    const funnel = (counts[id] ||= emptyTriggerFunnel());
    funnel.eligible++;
    if (attempted) funnel.attempted++;
    if (succeeded) funnel.succeeded++;
    else {
      funnel.missed++;
      funnel.reasons[reason] = (funnel.reasons[reason] || 0) + 1;
    }
    const evidence = freeze({
      catalogueVersion: TRIGGER_CATALOGUE_VERSION,
      triggerId: id,
      countingUnit: definition.countingUnit,
      unitId: sample.unitId,
      phase: sample.phase || 'unknown',
      eligible: 1,
      attempted: attempted ? 1 : 0,
      succeeded: succeeded ? 1 : 0,
      missed: succeeded ? 0 : 1,
      reason,
      intent: sample.intent ? { ...sample.intent } : null,
      before: sample.before ? { ...sample.before } : null,
      after: sample.after ? { ...sample.after } : null,
      repro: {
        ...baseRepro,
        phase: sample.phase || 'unknown',
        triggerId: id,
        reason,
        run: sample.runSummary ? { ...sample.runSummary } : null,
      },
    });
    events.push(evidence);
    return evidence;
  };

  return Object.freeze({
    observe,
    events: () => [...events],
    funnels: () => assertTriggerFunnels(structuredClone(counts)),
  });
}
