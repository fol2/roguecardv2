import { assertObservation, deriveObservation } from './observation.mjs';

export const SHADE_SETUP_TARGET_ID = 'shade.qualifying-fall';
export const OBJECTIVE_PRIORITIES = Object.freeze(['active', 'preserve', 'prepare']);

// The catalogue describes observations; this graph describes how a policy can
// reach them. Dependencies are intentionally expressed only in trigger ids so
// the policy layer remains Node-pure and cannot inspect engine state.
export const OBJECTIVE_PREREQUISITES = Object.freeze({
  'pale.marked-encounter': Object.freeze(['pale.hidden-encounter']),
  'pale.kill': Object.freeze(['pale.hidden-encounter', 'pale.marked-encounter']),
  'shade.standing-monument': Object.freeze([SHADE_SETUP_TARGET_ID]),
  'shade.duel': Object.freeze(['shade.standing-monument']),
  'shade.win': Object.freeze(['shade.duel']),
  'usurper.afford': Object.freeze(['usurper.offer']),
  'usurper.buy': Object.freeze(['usurper.afford']),
  'usurper.transformed-summit': Object.freeze(['usurper.buy']),
  'usurper.kill': Object.freeze(['usurper.transformed-summit']),
  'eighth.final-attempt': Object.freeze(['eighth.active']),
  'eighth.dawn': Object.freeze(['eighth.final-attempt']),
  'page.take': Object.freeze(['page.offer']),
  'page.carry': Object.freeze(['page.take']),
  'page.read': Object.freeze(['page.carry']),
  'hollow.reachable': Object.freeze(['hollow.due']),
  'hollow.entered': Object.freeze(['hollow.reachable']),
  'hollow.paid': Object.freeze(['hollow.entered']),
  'hollow.progressed': Object.freeze(['hollow.paid']),
  'shard.threshold': Object.freeze([
    'pale.kill', 'shade.win', 'usurper.kill', 'eighth.dawn', 'page.read', 'hollow.progressed',
  ]),
  'act4Reveal.staged': Object.freeze(['shard.threshold']),
});

export function objectiveDependsOn(targetId, prerequisiteId) {
  if (targetId === prerequisiteId) return false;
  const seen = new Set();
  const pending = [...(OBJECTIVE_PREREQUISITES[targetId] || [])];
  while (pending.length) {
    const candidate = pending.pop();
    if (candidate === prerequisiteId) return true;
    if (seen.has(candidate)) continue;
    seen.add(candidate);
    pending.push(...(OBJECTIVE_PREREQUISITES[candidate] || []));
  }
  return false;
}

export function objectivePriorityFor(targetId, supportedTargetIds) {
  if (!targetId || !Array.isArray(supportedTargetIds)) return undefined;
  if (supportedTargetIds.includes(targetId)) return 'active';
  return supportedTargetIds.some((candidate) => objectiveDependsOn(targetId, candidate))
    ? 'prepare'
    : undefined;
}

const score = (action) => Number.isFinite(action.genericScore) ? action.genericScore : 0;
const deterministicRank = (a, b) => score(b) - score(a)
  || (a.order ?? 0) - (b.order ?? 0)
  || (a.key < b.key ? -1 : a.key > b.key ? 1 : 0);

const canChooseFall = (observation) => observation.objective?.targetId === SHADE_SETUP_TARGET_ID &&
  observation.objective.currentEligibility === true;

const legalForObjective = (observation, action) => action.kind !== 'fall' ||
  observation.phase === 'terminal' || canChooseFall(observation);

function objectiveActions(observation) {
  const allowed = observation.legalActions.filter((action) => legalForObjective(observation, action));
  for (const priority of OBJECTIVE_PRIORITIES) {
    const candidates = allowed.filter((action) => action.objectivePriority === priority).sort(deterministicRank);
    if (candidates.length) return candidates;
  }
  return [];
}

function affordablePlan(observation, preferred, generic) {
  let gold = observation.state.gold;
  const byKey = new Map(observation.legalActions.map((action) => [action.key, action]));
  const plan = [];
  const targetId = observation.objective?.targetId;
  if (targetId === 'usurper.buy' || objectiveDependsOn(targetId, 'usurper.buy')) {
    for (const key of preferred) {
      const action = byKey.get(key);
      if (action && !action.sold && action.price <= gold) return [key];
    }
    return [];
  }
  for (const key of [...preferred, ...generic]) {
    if (plan.includes(key)) continue;
    const action = byKey.get(key);
    if (!action || action.sold || action.price > gold) continue;
    plan.push(key);
    gold -= action.price;
  }
  return plan;
}

export function composeObjectives(basePolicy) {
  if (!basePolicy || typeof basePolicy.decide !== 'function') throw new TypeError('objective policy requires a base policy');
  return Object.freeze({
    decide(input) {
      const observation = assertObservation(input);
      const eligibleActions = observation.legalActions.filter((action) => legalForObjective(observation, action));
      const baseObservation = eligibleActions.length === observation.legalActions.length
        ? observation
        : deriveObservation(observation, eligibleActions);
      const generic = basePolicy.decide(baseObservation);
      if (!observation.objective) return generic;
      const targeted = objectiveActions(observation);
      if (observation.phase === 'shop' && observation.objective.targetId === 'usurper.buy') {
        return affordablePlan(observation, targeted.map(({ key }) => key), []);
      }
      if (!targeted.length) return generic;
      if (observation.phase === 'shop') {
        return affordablePlan(observation, targeted.map(({ key }) => key), Array.isArray(generic) ? generic : [generic]);
      }
      return targeted[0].key;
    },
  });
}
