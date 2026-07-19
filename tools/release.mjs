#!/usr/bin/env node
import { spawnSync } from 'node:child_process';
import { createInterface } from 'node:readline';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const BUMPS = new Set(['patch', 'minor', 'major']);

const POLICY = {
  patch: 'bugfix / polish',
  minor: 'new content / systems',
  major: 'save or rules incompatibility / large rewrite',
};

function readVersion() {
  return JSON.parse(readFileSync(resolve('package.json'), 'utf8')).version;
}

function run(cmd, args, opts = {}) {
  const r = spawnSync(cmd, args, { stdio: 'inherit', shell: false, ...opts });
  if (r.status !== 0) process.exit(r.status ?? 1);
}

function askBump() {
  return new Promise((resolveAsk) => {
    const rl = createInterface({ input: process.stdin, output: process.stdout });
    console.log('Semver bump (game-oriented):');
    for (const [k, v] of Object.entries(POLICY)) console.log(`  ${k.padEnd(6)} — ${v}`);
    rl.question('Choose patch / minor / major: ', (answer) => {
      rl.close();
      resolveAsk(String(answer || '').trim().toLowerCase());
    });
  });
}

const argBump = String(process.argv[2] || '').toLowerCase();
let bump;
if (process.argv[2]) {
  if (!BUMPS.has(argBump)) {
    console.error(`Invalid bump: ${argBump}`);
    process.exit(1);
  }
  bump = argBump;
} else {
  bump = await askBump();
  if (!BUMPS.has(bump)) {
    console.error(`Invalid bump: ${bump}`);
    process.exit(1);
  }
}

const before = readVersion();
run('npm', ['version', bump, '--no-git-tag-version']);
const after = readVersion();

run('npm', ['run', 'release:build'], {
  env: { ...process.env, SPIRE_RELEASE: '1' },
});

console.log(`
Release build ready: ${before} → ${after}

Suggested next steps (not run automatically):
  git add package.json package-lock.json src
  git commit -m "release: v${after}"
  git tag v${after}
  git push && git push origin v${after}
`);
