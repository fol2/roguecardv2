import { spawnSync } from 'node:child_process';
import { appendFileSync, mkdirSync, readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { allocateStrictE2EPort } from './run-with-strict-e2e-port.mjs';
import { e2eServerSettings } from '../playwright-server.js';

const command = (argv, { playwright = false, optional = false } = {}) =>
  Object.freeze({ argv: Object.freeze(argv), playwright, optional });

const CI = command(['npm', 'run', 'test:ci']);
const NODE = command(['npm', 'test']);
const TRACE = command(
  ['npx', 'playwright', 'test', 'trace', 'battle', 'audio', '--project=desktop', '--workers=1'],
  { playwright: true },
);
const TRACE_PRODUCTION = command(['npm', 'run', 'test:e2e:trace-production'], { playwright: true });
const NONVISUAL = command(['npm', 'run', 'test:e2e:nonvisual'], { playwright: true });
const PROGRESSION = command(['npm', 'run', 'test:progression']);
const REGISTRATIONS = command(['npm', 'run', 'test:content-registrations']);
const ACT_COUPLING = command(['npm', 'run', 'test:act-coupling']);
const PRODUCTION_SURFACE = command(['node', 'tools/verify-production-surface.mjs']);
const CONTENT_DISK = command(['npm', 'run', 'test:e2e:content-disk'], { playwright: true, optional: true });
const WEBKIT = command(['npm', 'run', 'test:e2e:webkit'], { playwright: true });
const PERF = command(['npm', 'run', 'test:e2e:perf'], { playwright: true });
const BUNDLE = command(['node', 'tools/check-bundle-budget.mjs']);
const LEAK = command(['npm', 'run', 'test:e2e:leak'], { playwright: true });
const P6_SCREENS = command([
  'npx', 'playwright', 'test', 'p6-screens', 'end-ceremony', 'contrast', 'stage', 'trace',
  '--project=desktop', '--project=portrait', '--project=landscape', '--workers=1', '--no-deps',
], { playwright: true });
const VISUAL = command(['npm', 'run', 'test:e2e:visual'], { playwright: true });

const freezeProfile = (rows) => Object.freeze(rows);
export const STANDING_GATE_PROFILES = Object.freeze({
  'p1-node': freezeProfile([CI, NODE]),
  'p1-dom': freezeProfile([CI, NODE, TRACE, TRACE_PRODUCTION]),
  'p1-complete': freezeProfile([CI, NODE, TRACE, TRACE_PRODUCTION, NONVISUAL]),
  'p2-base': freezeProfile([CI, NODE, TRACE, TRACE_PRODUCTION, NONVISUAL, PROGRESSION]),
  p2: freezeProfile([CI, NODE, TRACE, TRACE_PRODUCTION, NONVISUAL, PROGRESSION, REGISTRATIONS, ACT_COUPLING]),
  p3: freezeProfile([CI, NODE, TRACE, TRACE_PRODUCTION, NONVISUAL, PROGRESSION, REGISTRATIONS, ACT_COUPLING, PRODUCTION_SURFACE, CONTENT_DISK]),
  p4: freezeProfile([CI, NODE, TRACE, TRACE_PRODUCTION, NONVISUAL, PROGRESSION, REGISTRATIONS, ACT_COUPLING, PRODUCTION_SURFACE, CONTENT_DISK, WEBKIT, PERF, BUNDLE]),
  p5: freezeProfile([CI, NODE, TRACE, TRACE_PRODUCTION, NONVISUAL, PROGRESSION, REGISTRATIONS, ACT_COUPLING, PRODUCTION_SURFACE, CONTENT_DISK, WEBKIT, PERF, BUNDLE, LEAK]),
  p6: freezeProfile([CI, NODE, TRACE, TRACE_PRODUCTION, NONVISUAL, PROGRESSION, REGISTRATIONS, ACT_COUPLING, PRODUCTION_SURFACE, CONTENT_DISK, WEBKIT, PERF, BUNDLE, LEAK, P6_SCREENS]),
  full: freezeProfile([CI, NODE, TRACE, TRACE_PRODUCTION, NONVISUAL, PROGRESSION, REGISTRATIONS, ACT_COUPLING, PRODUCTION_SURFACE, CONTENT_DISK, WEBKIT, PERF, BUNDLE, LEAK, P6_SCREENS, VISUAL]),
});

function optionalScriptExists(argv) {
  if (argv.join(' ') !== 'npm run test:e2e:content-disk') return true;
  const packageJson = JSON.parse(readFileSync(new URL('../package.json', import.meta.url), 'utf8'));
  return Boolean(packageJson.scripts?.['test:e2e:content-disk']);
}

function portEnvironment(env, port) {
  const inherited = { ...env };
  delete inherited.SPIREBOUND_E2E_PORT;
  if (port !== null) inherited.SPIREBOUND_E2E_PORT = String(port);
  return inherited;
}

function validateAllocatedPort(port, usedPorts) {
  if (!Number.isInteger(port) || port < 1 || port > 65535 || port === 5174) {
    throw new Error(`standing-gate allocator returned invalid strict port ${port}`);
  }
  if (usedPorts.has(port)) throw new Error(`standing-gate allocator reused port ${port}`);
  const settings = e2eServerSettings(String(port));
  if (settings.reuseExistingServer || !settings.isolated || !settings.command.includes('--strictPort')) {
    throw new Error(`standing-gate port ${port} is not strict and isolated`);
  }
  usedPorts.add(port);
  return port;
}

export async function runStandingGates({
  profile,
  spawn = spawnSync,
  allocatePort = allocateStrictE2EPort,
  isOptionalAvailable = (row) => optionalScriptExists(row.argv),
  record = () => {},
  env = process.env,
} = {}) {
  const rows = STANDING_GATE_PROFILES[profile];
  if (!rows) throw new Error(`Unknown standing-gate profile: ${profile}`);
  const usedPorts = new Set();
  const results = [];
  for (const row of rows) {
    if (row.optional && !await isOptionalAvailable(row)) continue;
    const port = row.playwright
      ? validateAllocatedPort(await allocatePort(), usedPorts)
      : null;
    if (port !== null) process.stdout.write(`Round 5 ${profile} strict E2E port: ${port}\n`);
    const child = spawn(row.argv[0], row.argv.slice(1), {
      shell: false,
      stdio: 'inherit',
      env: portEnvironment(env, port),
    });
    const status = Number.isInteger(child?.status) ? child.status : 1;
    const result = Object.freeze({
      kind: 'round5-standing-gate',
      profile,
      argv: row.argv,
      port,
      status,
      signal: child?.signal ?? null,
    });
    results.push(result);
    await record(result);
    if (status !== 0 || result.signal) {
      return Object.freeze({ profile, status, signal: result.signal, results: Object.freeze(results) });
    }
  }
  return Object.freeze({ profile, status: 0, signal: null, results: Object.freeze(results) });
}

function ledgerRecorder(row) {
  const path = resolve('.superpowers/sdd/progress.md');
  mkdirSync(dirname(path), { recursive: true });
  appendFileSync(path, `${JSON.stringify(row)}\n`);
}

function parseProfile(argv) {
  if (argv.length !== 2 || argv[0] !== '--profile' || !argv[1]) {
    throw new Error('Usage: node tools/run-round5-standing-gates.mjs --profile <profile>');
  }
  return argv[1];
}

async function runCli() {
  const profile = parseProfile(process.argv.slice(2));
  const result = await runStandingGates({ profile, record: ledgerRecorder });
  if (result.signal) {
    process.kill(process.pid, result.signal);
    return;
  }
  process.exitCode = result.status;
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  runCli().catch((error) => {
    console.error(error.message);
    process.exitCode = 1;
  });
}
