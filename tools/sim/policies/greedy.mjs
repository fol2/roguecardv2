// Win-first policy over walker-owned frozen observations. Engine previews and
// mutable run/combat state stop at tools/sim/policy-adapter.mjs.
import { createGreedyCore, WEIGHTS } from './greedy-core.mjs';

export { WEIGHTS };

export function makePolicy(rng) {
  return createGreedyCore(rng);
}
