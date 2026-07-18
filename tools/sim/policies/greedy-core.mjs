import { assertObservation } from './observation.mjs';

// Shared tuning surface. Engine-dependent preview arithmetic lives in the
// walker adapter; this core sees only its frozen, precomputed result.
export const WEIGHTS = Object.freeze({
  lethal: 1000,
  dmg: 1.0,
  overkill: 0.45,
  shatter: 15,
  chip: 2.75,
  block: 1.45,
  cost: 1.3,
  draw: 4.0,
  energy: 6.5,
  ember: 2.5,
  heal: 1.4,
  selfHpLoss: 2.4,
  vulnerable: 6.0,
  weak: 7.0,
  poison: 2.2,
  enemyStrDown: 5.5,
  selfStr: 10,
  selfDex: 8,
  selfMetallicize: 10,
  selfRegen: 8,
  selfRitual: 13,
  selfBarricade: 9,
  selfEnergized: 9,
  selfVenomous: 8,
  selfNightSight: 7,
  selfEmberflow: 8,
  selfBeacon: 5,
  kindleFloor: 2,
  draftFloor: 5.5,
  largeDeck: 25,
  largeDeckStep: 0.6,
  eliteHpFloor: 0.65,
  elitePowerFloor: 27,
  restHealHp: 0.55,
  shopGold: 150,
  actTwoReserve: 75,
});

const byOrder = (a, b) => (a.order ?? 0) - (b.order ?? 0) || (a.key < b.key ? -1 : a.key > b.key ? 1 : 0);
const byUid = (a, b) => (a.uid ?? 0) - (b.uid ?? 0) || byOrder(a, b);
const score = (action) => Number.isFinite(action.genericScore) ? action.genericScore : 0;

function best(actions, chooseTie) {
  const top = Math.max(...actions.map(score));
  return chooseTie(actions.filter((action) => Math.abs(score(action) - top) < 1e-9));
}

function chooseDraft(observation, chooseTie) {
  const cards = observation.legalActions.filter(({ kind }) => kind === 'card');
  if (!cards.length) return observation.legalActions.find(({ kind }) => kind === 'skip')?.key ?? null;
  const top = Math.max(...cards.map(score));
  if (top < observation.state.draftFloor) {
    return observation.legalActions.find(({ kind }) => kind === 'skip')?.key ?? null;
  }
  return chooseTie(cards.filter((action) => score(action) === top)).key;
}

function chooseShop(observation) {
  let gold = observation.state.gold;
  const reserve = observation.state.reserve;
  let freePotionSlots = observation.state.freePotionSlots;
  const plan = [];
  const buy = (action) => {
    if (!action.sold && action.price <= gold && gold - action.price >= reserve) {
      plan.push(action.key);
      gold -= action.price;
      return true;
    }
    return false;
  };
  const relics = observation.legalActions.filter(({ kind }) => kind === 'buy-relic')
    .sort((a, b) => score(b) - score(a) || a.price - b.price || byOrder(a, b));
  for (const action of relics) buy(action);
  for (const action of observation.legalActions.filter(({ kind }) => kind === 'buy-potion').sort(byOrder)) {
    if (freePotionSlots > 0 && buy(action)) freePotionSlots--;
  }
  const cards = observation.legalActions.filter(({ kind }) => kind === 'buy-card')
    .sort((a, b) => score(b) - score(a) || a.price - b.price || byOrder(a, b));
  for (const action of cards) if (score(action) >= observation.state.draftFloor) buy(action);
  return plan;
}

export function createGreedyCore(rng, knowledgeClass = 'player-visible') {
  if (typeof rng !== 'function') throw new TypeError('greedy policy requires a seeded RNG');
  const chooseTie = (actions) => actions.length === 1
    ? actions[0]
    : actions[Math.floor(rng() * actions.length)];

  return Object.freeze({
    decide(input) {
      const observation = assertObservation(input);
      if (observation.knowledgeClass !== knowledgeClass) {
        throw new TypeError(`policy requires ${knowledgeClass} knowledge class`);
      }
      const { legalActions, phase } = observation;
      if (phase === 'node') {
        return legalActions.slice().sort((a, b) => score(b) - score(a)
          || (a.col ?? 0) - (b.col ?? 0) || byOrder(a, b))[0].key;
      }
      if (phase === 'combat') {
        const end = legalActions.find(({ kind }) => kind === 'end');
        if (observation.state.decisionOrdinal >= 36) return end.key;
        const plays = legalActions.filter(({ kind }) => kind === 'play');
        if (plays.length) {
          const top = Math.max(...plays.map(score));
          if (top > 0) return chooseTie(plays.filter((action) => Math.abs(score(action) - top) < 1e-9)).key;
        }
        for (const kind of ['potion', 'art']) {
          const action = legalActions.find((entry) => entry.kind === kind && entry.greedyEligible !== false);
          if (action) return action.key;
        }
        const kindle = legalActions.filter(({ kind, greedyEligible }) => kind === 'kindle' && greedyEligible !== false)
          .sort((a, b) => score(a) - score(b) || byUid(a, b))[0];
        return kindle?.key ?? end.key;
      }
      if (phase === 'card-reward') return chooseDraft(observation, chooseTie);
      if (phase === 'boss-relic' || phase === 'event-choice' || phase === 'lamplighter' ||
          phase === 'hollow' || phase === 'monument' || phase === 'terminal' || phase === 'bequest') {
        return best(legalActions, chooseTie).key;
      }
      if (phase === 'rest') {
        const heal = legalActions.find(({ kind }) => kind === 'heal');
        const upgrade = legalActions.filter(({ kind }) => kind === 'upgrade')
          .sort((a, b) => score(b) - score(a) || byUid(a, b))[0];
        return observation.state.hpRatio <= WEIGHTS.restHealHp || !upgrade ? heal.key : upgrade.key;
      }
      if (phase === 'event-pending') {
        if (observation.state.operation === 'pickCard') return chooseDraft(observation, chooseTie);
        const options = legalActions.filter(({ kind }) => kind !== 'skip');
        if (!options.length) return legalActions[0].key;
        if (observation.state.operation === 'remove') {
          return options.slice().sort((a, b) => score(a) - score(b) || byUid(a, b))[0].key;
        }
        return options.slice().sort((a, b) => score(b) - score(a) || byUid(a, b))[0].key;
      }
      if (phase === 'shop') return chooseShop(observation);
      throw new TypeError(`unknown policy phase: ${phase}`);
    },
  });
}
