import { appendFileSync } from 'node:fs';
import { pathToFileURL } from 'node:url';

const UNIT_LANES = ['changes', 'unit-tests', 'build-dist'];
const SMOKE_LANES = ['changes', 'smoke-e2e'];
const FULL_E2E_LANES = ['changes', 'e2e-aux', 'e2e-random', 'e2e-heavy', 'e2e-main', 'e2e-visual'];
const P2_BASE_E2E_LANES = [
  'changes', 'e2e-aux', 'e2e-random', 'e2e-heavy', 'e2e-main',
];
const P2_BASE_GATE_LANES = ['changes', 'unit', 'e2e-nonvisual', 'progression'];

const truthy = (value) => value === true || String(value).toLowerCase() === 'true';

export function isRound5StandingRef(refName = '') {
  const name = String(refName).replace(/^refs\/heads\//, '');
  return name.startsWith('jamesto/round5-') || name.startsWith('cursor/round5-');
}

export function resolveCiMode(eventName, draftValue, refName = '') {
  if (eventName === 'push') return 'full';
  if (eventName === 'pull_request') {
    if (!truthy(draftValue)) return 'full';
    return isRound5StandingRef(refName) ? 'p2-base' : 'smoke';
  }
  throw new Error(`Unsupported CI event: ${eventName}`);
}

export function requiredCiLanes(gate, relevant, mode) {
  if (gate === 'p2-base') {
    if (mode !== 'p2-base' && mode !== 'full') throw new Error(`Unsupported p2-base CI mode: ${mode}`);
    if (!truthy(relevant)) return ['changes'];
    return [...P2_BASE_GATE_LANES];
  }
  if (!truthy(relevant)) return ['changes'];
  if (gate === 'unit') return [...UNIT_LANES];
  if (gate !== 'e2e') throw new Error(`Unsupported CI gate: ${gate}`);
  if (mode === 'smoke') return [...SMOKE_LANES];
  if (mode === 'p2-base') return [...P2_BASE_E2E_LANES];
  if (mode === 'full') return [...FULL_E2E_LANES];
  throw new Error(`Unsupported CI mode: ${mode}`);
}

export function verifyCiGate({ gate, relevant, mode, results }) {
  const required = requiredCiLanes(gate, relevant, mode);
  const failed = required
    .filter((lane) => results[lane] !== 'success')
    .map((lane) => `${lane}=${results[lane] ?? 'missing'}`);
  if (failed.length) throw new Error(`${gate} gate incomplete: ${failed.join(', ')}`);
  const message = required.length === 1
    ? `${gate} gate: no relevant changes`
    : `${gate} gate: ${required.slice(1).join(', ')} passed`;
  return { required, message };
}

function runCli() {
  const command = process.argv[2];
  if (command === 'mode') {
    const mode = resolveCiMode(
      process.env.GITHUB_EVENT_NAME,
      process.env.PR_DRAFT,
      process.env.CI_REF_NAME || process.env.GITHUB_HEAD_REF || process.env.GITHUB_REF_NAME || '',
    );
    if (!process.env.GITHUB_OUTPUT) throw new Error('GITHUB_OUTPUT is required');
    appendFileSync(process.env.GITHUB_OUTPUT, `mode=${mode}\n`);
    console.log(`CI mode: ${mode}`);
    return;
  }
  if (command === 'gate') {
    const result = verifyCiGate({
      gate: process.env.CI_GATE,
      relevant: process.env.CI_RELEVANT,
      mode: process.env.CI_MODE,
      results: JSON.parse(process.env.CI_RESULTS || '{}'),
    });
    console.log(result.message);
    return;
  }
  throw new Error('Usage: node tools/ci-contract.mjs <mode|gate>');
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  runCli();
}
