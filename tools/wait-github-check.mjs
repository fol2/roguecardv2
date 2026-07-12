#!/usr/bin/env node

import { spawn } from 'node:child_process';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

const DEFAULT_TIMEOUT_MS = 600000;
const DEFAULT_POLL_MS = 15000;

export function runCommand(argv) {
  if (!Array.isArray(argv) || argv.length === 0) {
    throw new TypeError('runCommand requires a non-empty argv array');
  }
  return new Promise((resolveCommand) => {
    const child = spawn(argv[0], argv.slice(1), {
      shell: false,
      stdio: ['ignore', 'pipe', 'pipe'],
    });
    let stdout = '';
    let stderr = '';
    child.stdout.setEncoding('utf8');
    child.stderr.setEncoding('utf8');
    child.stdout.on('data', (chunk) => { stdout += chunk; });
    child.stderr.on('data', (chunk) => { stderr += chunk; });
    child.on('error', (error) => {
      resolveCommand({ code: 127, stdout, stderr: stderr || error.message });
    });
    child.on('close', (code) => {
      resolveCommand({ code: Number.isInteger(code) ? code : 1, stdout, stderr });
    });
  });
}

function trimSha(value, label) {
  const sha = String(value || '').trim();
  if (!sha) throw new Error(`${label} resolved to an empty SHA`);
  return sha;
}

async function checkedStdout(runCommandImpl, argv, label) {
  const result = await runCommandImpl(argv);
  if (result.code !== 0) {
    const detail = String(result.stderr || result.stdout || '').trim();
    throw new Error(`${label} failed${detail ? `: ${detail}` : ''}`);
  }
  return String(result.stdout || '').trim();
}

async function defaultGitStatusPorcelain(runCommandImpl) {
  return checkedStdout(runCommandImpl, ['git', 'status', '--porcelain'], 'git status --porcelain');
}

async function defaultHeadSha(runCommandImpl) {
  return checkedStdout(runCommandImpl, ['git', 'rev-parse', 'HEAD'], 'git rev-parse HEAD');
}

async function defaultUpstreamSha(runCommandImpl) {
  return checkedStdout(runCommandImpl, ['git', 'rev-parse', '@{upstream}'], 'git rev-parse @{upstream}');
}

function parseChecks(stdout) {
  const parsed = JSON.parse(String(stdout || '[]'));
  if (Array.isArray(parsed)) return parsed;
  if (Array.isArray(parsed.check_runs)) return parsed.check_runs;
  return [];
}

function parseChecksResult(result) {
  try {
    return parseChecks(result.stdout);
  } catch (error) {
    if (result.code === 0) throw error;
    const detail = String(result.stderr || result.stdout || '').trim();
    throw new Error(`gh pr checks failed${detail ? `: ${detail}` : ''}`);
  }
}

function normalizeCheck(row) {
  const state = String(row.state || row.status || '').toUpperCase();
  const conclusion = String(row.conclusion || '').toUpperCase();
  const url = row.link || row.url || row.html_url || row.details_url;
  if (state === 'SUCCESS' || (state === 'COMPLETED' && conclusion === 'SUCCESS')) {
    return { done: true, status: 0, url };
  }
  if (state === 'FAILURE' || state === 'ERROR' || state === 'CANCELLED' || state === 'SKIPPED'
      || (state === 'COMPLETED' && conclusion && conclusion !== 'SUCCESS')) {
    return { done: true, status: 1, url };
  }
  return { done: false, status: 1, url };
}

function validateDuration(value, label) {
  const number = Number(value);
  if (!Number.isFinite(number) || number < 0) throw new TypeError(`${label} must be a non-negative number`);
  return number;
}

export async function waitGithubCheck({
  checkName,
  sha,
  timeoutMs = DEFAULT_TIMEOUT_MS,
  pollMs = DEFAULT_POLL_MS,
  sleep = (ms) => new Promise((resolveSleep) => { setTimeout(resolveSleep, ms); }),
  now = () => Date.now(),
  runCommand: runCommandImpl = runCommand,
  getGitStatusPorcelain = () => defaultGitStatusPorcelain(runCommandImpl),
  getHeadSha = () => defaultHeadSha(runCommandImpl),
  getUpstreamSha = () => defaultUpstreamSha(runCommandImpl),
} = {}) {
  if (typeof checkName !== 'string' || checkName.length === 0) {
    throw new TypeError('waitGithubCheck requires a non-empty checkName');
  }
  const timeout = validateDuration(timeoutMs, 'timeoutMs');
  const poll = validateDuration(pollMs, 'pollMs');
  const headSha = trimSha(sha ?? await getHeadSha(), 'HEAD');
  const porcelain = String(await getGitStatusPorcelain());
  if (porcelain.trim()) throw new Error('Cannot wait for GitHub checks with a dirty working tree');
  const upstreamSha = trimSha(await getUpstreamSha(), 'upstream');
  if (upstreamSha !== headSha) {
    throw new Error(`HEAD ${headSha} is not pushed to upstream ${upstreamSha}`);
  }
  const ghVersion = await runCommandImpl(['gh', '--version']);
  if (ghVersion.code !== 0) {
    const detail = String(ghVersion.stderr || ghVersion.stdout || '').trim();
    throw new Error(`gh CLI is required to wait for GitHub checks${detail ? `: ${detail}` : ''}`);
  }

  const started = now();
  for (;;) {
    const checks = await runCommandImpl(['gh', 'pr', 'checks', '--json', 'name,state,link']);
    const match = parseChecksResult(checks).find((row) => row?.name === checkName);
    if (match) {
      const outcome = normalizeCheck(match);
      if (outcome.done) return Object.freeze({ status: outcome.status, ...(outcome.url ? { url: outcome.url } : {}) });
    }
    if (now() - started > timeout) return Object.freeze({ status: 1 });
    await sleep(poll);
  }
}

function parseArgs(argv) {
  const options = { checkName: null, timeoutMs: DEFAULT_TIMEOUT_MS, pollMs: DEFAULT_POLL_MS };
  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (arg === '--check') options.checkName = argv[++index];
    else if (arg === '--timeout-ms') options.timeoutMs = Number(argv[++index]);
    else if (arg === '--poll-ms') options.pollMs = Number(argv[++index]);
    else throw new Error(`Unknown argument: ${arg}`);
  }
  if (!options.checkName) {
    throw new Error('Usage: node tools/wait-github-check.mjs --check <name> [--timeout-ms <ms>] [--poll-ms <ms>]');
  }
  return options;
}

async function runCli() {
  const options = parseArgs(process.argv.slice(2));
  const result = await waitGithubCheck(options);
  if (result.url) process.stdout.write(`${result.url}\n`);
  else if (result.status !== 0) process.stderr.write(`Timed out waiting for GitHub check ${options.checkName}\n`);
  process.exitCode = result.status;
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  runCli().catch((error) => {
    console.error(error.message);
    process.exitCode = 1;
  });
}
