// Opt-in floor baseline over the same frozen legal-action seam as every other
// policy. Decisions consume only this policy's seeded RNG stream.
import { assertObservation } from './observation.mjs';

export function makePolicy(rng) {
  if (typeof rng !== 'function') throw new TypeError('random policy requires a seeded RNG');
  const choice = (actions) => actions[Math.floor(rng() * actions.length)];
  let combatKey = null;
  let combatTurn = -1;
  let combatPhase = 'play';
  let plays = 0;

  return Object.freeze({
    decide(input) {
      const observation = assertObservation(input);
      if (observation.knowledgeClass !== 'baseline') {
        throw new TypeError('random policy requires baseline knowledge class');
      }
      const { legalActions, phase, state } = observation;
      if (phase === 'node') return choice(legalActions).key;
      if (phase === 'combat') {
        if (state.combatKey !== combatKey || state.turn !== combatTurn) {
          combatKey = state.combatKey;
          combatTurn = state.turn;
          combatPhase = 'play';
          plays = 0;
        }
        if (combatPhase === 'play') {
          const playable = legalActions.filter(({ kind }) => kind === 'play');
          const groups = [...new Set(playable.map(({ group }) => group))];
          if (groups.length && plays < 30 && rng() < 0.9) {
            plays++;
            const group = choice(groups);
            return choice(playable.filter((action) => action.group === group)).key;
          }
          combatPhase = 'kindle';
        }
        if (combatPhase === 'kindle') {
          combatPhase = 'art';
          const kindle = legalActions.filter(({ kind, randomEligible }) => kind === 'kindle' && randomEligible !== false);
          if (kindle.length && rng() < 0.25) return choice(kindle).key;
        }
        if (combatPhase === 'art') {
          combatPhase = 'end';
          const art = legalActions.find(({ kind }) => kind === 'art');
          if (art && rng() < 0.4) return art.key;
        }
        return legalActions.find(({ kind }) => kind === 'end').key;
      }
      if (phase === 'card-reward') {
        const cards = legalActions.filter(({ kind }) => kind === 'card');
        return cards.length && rng() < 0.8
          ? choice(cards).key
          : legalActions.find(({ kind }) => kind === 'skip').key;
      }
      if (phase === 'boss-relic' || phase === 'event-choice' || phase === 'lamplighter' ||
          phase === 'hollow' || phase === 'monument' || phase === 'terminal' || phase === 'bequest') {
        return choice(legalActions).key;
      }
      if (phase === 'rest') {
        const heal = legalActions.find(({ kind }) => kind === 'heal');
        if (rng() < 0.5) return heal.key;
        const upgrades = legalActions.filter(({ kind }) => kind === 'upgrade');
        return upgrades.length ? choice(upgrades).key : heal.key;
      }
      if (phase === 'event-pending') {
        const options = legalActions.filter(({ kind }) => kind !== 'skip');
        return options.length ? choice(options).key : legalActions[0].key;
      }
      if (phase === 'shop') {
        let gold = state.gold;
        const plan = [];
        for (const action of legalActions.slice().sort((a, b) => a.order - b.order)) {
          if (!action.sold && action.price <= gold && rng() < 0.4) {
            plan.push(action.key);
            gold -= action.price;
          }
        }
        return plan;
      }
      throw new TypeError(`unknown policy phase: ${phase}`);
    },
  });
}
