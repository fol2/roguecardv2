import { createGreedyCore } from './greedy-core.mjs';
import { composeObjectives } from './objectives.mjs';

export function makePolicy(rng) {
  return composeObjectives(createGreedyCore(rng));
}
