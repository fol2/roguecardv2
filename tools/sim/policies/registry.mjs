import { makePolicy as makeCoveragePolicy } from './coverage.mjs';
import { makePolicy as makeGreedyPolicy } from './greedy.mjs';
import { makePolicy as makeProgressionPolicy } from './progression.mjs';
import { makePolicy as makeRandomPolicy } from './random.mjs';

const freeze = (value) => {
  if (value && typeof value === 'object' && !Object.isFrozen(value)) {
    for (const child of Object.values(value)) freeze(child);
    Object.freeze(value);
  }
  return value;
};

const interpretation = (id, label, balanceEligible) => Object.freeze({ id, label, balanceEligible });
const targetSelection = Object.freeze({ accepted: false, required: false });

const definitions = [
  {
    id: 'random', version: 1, modes: ['round'], knowledgeClass: 'baseline',
    factory: makeRandomPolicy, includeInLegacyRoundSweep: true,
    reportInterpretation: interpretation('floor-baseline', 'Seeded floor baseline', true),
    targetSelection,
  },
  {
    id: 'greedy', version: 1, modes: ['round'], knowledgeClass: 'player-visible',
    factory: makeGreedyPolicy, includeInLegacyRoundSweep: true,
    reportInterpretation: interpretation('win-first-machine', 'Win-first machine-policy evidence', true),
    targetSelection,
  },
  {
    id: 'progression', version: 1, modes: ['round', 'cycle'], knowledgeClass: 'player-visible',
    factory: makeProgressionPolicy, includeInLegacyRoundSweep: false,
    reportInterpretation: interpretation('goal-directed-machine', 'Goal-directed machine-policy evidence', true),
    targetSelection,
  },
  {
    id: 'coverage', version: 1, modes: ['cycle'], knowledgeClass: 'coverage-only',
    factory: makeCoveragePolicy, includeInLegacyRoundSweep: false,
    reportInterpretation: interpretation('qa-operational-only', 'QA-only operational evidence', false),
    targetSelection: { accepted: true, required: false, default: 'rotation', rotation: 'deterministic' },
  },
];

export const POLICY_REGISTRY = freeze(definitions.map((definition) => ({
  ...definition,
  modes: [...definition.modes],
  targetSelection: { ...definition.targetSelection },
})));

const byId = new Map(POLICY_REGISTRY.map((definition) => [definition.id, definition]));

export function getPolicyDefinition(id) {
  return byId.get(id) || null;
}

export function policyIdsForMode(mode) {
  return POLICY_REGISTRY.filter((definition) => definition.modes.includes(mode)).map(({ id }) => id);
}

export function legacyRoundPolicyIds() {
  return POLICY_REGISTRY.filter(({ includeInLegacyRoundSweep }) => includeInLegacyRoundSweep).map(({ id }) => id);
}

const SAFE_METADATA = freeze({
  schemaVersion: 1,
  defaults: { round: 'greedy', cycle: 'progression' },
  policies: POLICY_REGISTRY.map(({
    id, version, modes, knowledgeClass, reportInterpretation, targetSelection,
  }) => ({ id, version, modes: [...modes], knowledgeClass, reportInterpretation, targetSelection })),
});

export function policyMetadata() {
  return SAFE_METADATA;
}
