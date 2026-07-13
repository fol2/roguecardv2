// Round 5 bundle-budget guard. Builds a fresh production bundle to a
// temporary directory, resolves the entry script from the emitted index.html,
// gzips it at level 9 and fails if the size exceeds
// `test/budgets/round5-bundle.json#maxEntryGzipBytes`.
//
// Usage:
//   node tools/check-bundle-budget.mjs                  # verify
//   node tools/check-bundle-budget.mjs --update-baseline  # rewrites the
//   prePixiEntryGzipBytes snapshot without touching the max — reserved for
//   the owner-approved bootstrap step.

import { spawnSync } from 'node:child_process';
import { existsSync, mkdtempSync, readFileSync, rmSync, writeFileSync, statSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, resolve, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { gzipSync } from 'node:zlib';

const HERE = dirname(fileURLToPath(import.meta.url));
const REPO = resolve(HERE, '..');
const BUDGET_PATH = 'test/budgets/round5-bundle.json';

function readBudget() {
  const text = readFileSync(resolve(REPO, BUDGET_PATH), 'utf8');
  return JSON.parse(text);
}

function writeBudget(payload) {
  writeFileSync(
    resolve(REPO, BUDGET_PATH),
    `${JSON.stringify(payload, null, 2)}\n`,
  );
}

function extractEntry(indexHtml) {
  const match = indexHtml.match(/<script[^>]*type="module"[^>]*src="([^"]+)"/);
  if (!match) throw new Error('Could not resolve entry script from dist/index.html');
  return match[1].replace(/^\/+/, '');
}

function buildTo(outDir) {
  const result = spawnSync('npx', ['vite', 'build', '--outDir', outDir], {
    cwd: REPO,
    stdio: 'inherit',
    env: { ...process.env },
  });
  if (result.status !== 0) throw new Error(`vite build failed with exit ${result.status}`);
}

function measureEntryGzip(outDir) {
  const indexHtml = readFileSync(join(outDir, 'index.html'), 'utf8');
  const entryRel = extractEntry(indexHtml);
  const entryPath = join(outDir, entryRel);
  if (!existsSync(entryPath)) throw new Error(`entry script missing: ${entryPath}`);
  const entryBytes = readFileSync(entryPath);
  const gzipBytes = gzipSync(entryBytes, { level: 9 }).length;
  return {
    entryRel,
    entryBytes: statSync(entryPath).size,
    gzipBytes,
  };
}

function roundToKb(bytes) {
  return Math.ceil((bytes * 1.10) / 1024) * 1024;
}

async function main(argv) {
  const write = argv.includes('--update-baseline');
  const outDir = mkdtempSync(join(tmpdir(), 'spirebound-round5-budget-'));
  try {
    buildTo(outDir);
    const measurement = measureEntryGzip(outDir);
    const budget = readBudget();
    if (write) {
      budget.prePixiEntryGzipBytes = measurement.gzipBytes;
      budget.entryRel = measurement.entryRel;
      budget.entryBytes = measurement.entryBytes;
      writeBudget(budget);
      process.stdout.write(
        `updated baseline: ${measurement.gzipBytes} gzip bytes (entry ${measurement.entryRel})\n`,
      );
      return;
    }
    const { maxEntryGzipBytes, prePixiEntryGzipBytes } = budget;
    if (!Number.isFinite(maxEntryGzipBytes)) {
      // Bootstrap moment (Task 21 Step 10): derive the ceiling from the just-
      // measured minimal bootstrap and persist it so future runs enforce it.
      const derived = roundToKb(measurement.gzipBytes);
      budget.minimalBootstrapGzipBytes = measurement.gzipBytes;
      budget.entryRel = measurement.entryRel;
      budget.entryBytes = measurement.entryBytes;
      budget.maxEntryGzipBytes = derived;
      writeBudget(budget);
      process.stdout.write(
        `bootstrap: minimal ${measurement.gzipBytes} gzip; maxEntryGzipBytes set to ${derived}\n`,
      );
      return;
    }
    process.stdout.write(
      `entry ${measurement.entryRel}: ${measurement.gzipBytes} gzip bytes (max ${maxEntryGzipBytes}, pre-Pixi baseline ${prePixiEntryGzipBytes})\n`,
    );
    if (measurement.gzipBytes > maxEntryGzipBytes) {
      throw new Error(
        `entry gzip ${measurement.gzipBytes} exceeds maxEntryGzipBytes ${maxEntryGzipBytes}`,
      );
    }
  } finally {
    rmSync(outDir, { recursive: true, force: true });
  }
}

try {
  await main(process.argv.slice(2));
} catch (error) {
  process.stderr.write(`${error.message}\n`);
  process.exit(1);
}
