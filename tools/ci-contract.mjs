import { appendFileSync } from 'node:fs';
import { pathToFileURL } from 'node:url';

const UNIT_LANES = ['changes', 'unit-tests', 'build-dist'];
const SMOKE_LANES = ['changes', 'smoke-e2e'];
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

/** Core nonvisual lanes always required when e2e is relevant. */
function e2eCoreLanes(mode) {
  if (mode === 'p2-base') {
    return ['changes', 'e2e-aux', 'e2e-random', 'e2e-battle', 'e2e-emberglass', 'e2e-main'];
  }
  if (mode === 'full') {
    return ['changes', 'e2e-aux', 'e2e-random', 'e2e-battle', 'e2e-emberglass', 'e2e-main', 'e2e-visual'];
  }
  return null;
}

/**
 * @param {string} gate
 * @param {unknown} relevant
 * @param {string} mode
 * @param {{ slow?: unknown }} [opts] - when slow is explicitly false, omit audio/heavy
 */
export function requiredCiLanes(gate, relevant, mode, opts = {}) {
  if (gate === 'p2-base') {
    if (mode !== 'p2-base' && mode !== 'full') throw new Error(`Unsupported p2-base CI mode: ${mode}`);
    if (!truthy(relevant)) return ['changes'];
    return [...P2_BASE_GATE_LANES];
  }
  if (!truthy(relevant)) return ['changes'];
  if (gate === 'unit') return [...UNIT_LANES];
  if (gate !== 'e2e') throw new Error(`Unsupported CI gate: ${gate}`);
  if (mode === 'smoke') return [...SMOKE_LANES];
  const core = e2eCoreLanes(mode);
  if (!core) throw new Error(`Unsupported CI mode: ${mode}`);
  // Default slow=true so standing / unspecified callers keep full fidelity.
  if (opts.slow !== undefined && !truthy(opts.slow)) return core;
  const withSlow = [...core];
  const battleIdx = withSlow.indexOf('e2e-battle');
  withSlow.splice(battleIdx, 0, 'e2e-audio', 'e2e-heavy');
  return withSlow;
}

export function verifyCiGate({ gate, relevant, mode, results, slow }) {
  const required = requiredCiLanes(gate, relevant, mode, { slow });
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
      slow: process.env.CI_SLOW_RELEVANT,
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
