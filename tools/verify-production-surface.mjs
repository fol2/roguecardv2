#!/usr/bin/env node
// Build to a fresh temporary directory and reject every known DEV-only marker
// from emitted production chunks. Never reads tracked dist/.

import { mkdtempSync, readFileSync, readdirSync, rmSync, statSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

export const FORBIDDEN_PRODUCTION_MARKERS = Object.freeze([
  '__content-save',
  'Content Lab',
  '_sample',
  'data-dev-shell',
  'data-content-doctor',
  'contentedit',
  'data-lab-root',
  'createDevRegistry',
  'dev/lab',
  'dev/doctor',
  'dev/content-manager',
  'dev/hub',
  'data-dev-chrome',
  'data-dev-home',
  'Proving Grounds',
  'ui/dev/shell',
  '__sim-run',
]);

const ROOT = resolve(fileURLToPath(new URL('..', import.meta.url)));

function collectFiles(dir, out = []) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) collectFiles(path, out);
    else out.push(path);
  }
  return out;
}

function resolveEntryChunks(outDir) {
  const htmlPath = join(outDir, 'index.html');
  const html = readFileSync(htmlPath, 'utf8');
  const refs = new Set();
  for (const match of html.matchAll(/(?:src|href)="([^"]+\.(?:js|css|mjs))"/g)) {
    refs.add(join(outDir, match[1].replace(/^\//, '')));
  }
  // Follow same-directory hashed chunks referenced by entry scripts.
  const assets = join(outDir, 'assets');
  try {
    if (statSync(assets).isDirectory()) {
      for (const file of collectFiles(assets)) {
        if (/\.(js|mjs|css)$/.test(file)) refs.add(file);
      }
    }
  } catch {
    /* no assets dir */
  }
  return [...refs];
}

export function scanProductionSurface(outDir, markers = FORBIDDEN_PRODUCTION_MARKERS) {
  const files = resolveEntryChunks(outDir);
  const hits = [];
  for (const file of files) {
    let text;
    try {
      text = readFileSync(file, 'utf8');
    } catch {
      continue;
    }
    for (const marker of markers) {
      if (text.includes(marker)) {
        hits.push({ file, marker });
      }
    }
  }
  return hits;
}

export function verifyProductionSurface({
  root = ROOT,
  build = true,
  outDir = null,
} = {}) {
  const temp = outDir || mkdtempSync(join(tmpdir(), 'spirebound-prod-surface-'));
  let ownedTemp = !outDir;
  try {
    if (build) {
      const result = spawnSync(
        process.platform === 'win32' ? 'npm.cmd' : 'npm',
        ['run', 'build', '--', '--outDir', temp],
        {
          cwd: root,
          encoding: 'utf8',
          env: {
            ...process.env,
            SPIRE_RELEASE: '1',
          },
        },
      );
      if (result.status !== 0) {
        const detail = `${result.stdout || ''}\n${result.stderr || ''}`.trim();
        throw new Error(`production build failed\n${detail}`);
      }
    }
    const hits = scanProductionSurface(temp);
    if (hits.length) {
      const lines = hits.map((h) => `${h.marker} in ${h.file}`).join('\n');
      throw new Error(`production surface leaked DEV markers:\n${lines}`);
    }
    return { ok: true, outDir: temp, markers: [...FORBIDDEN_PRODUCTION_MARKERS] };
  } finally {
    if (ownedTemp) {
      try { rmSync(temp, { recursive: true, force: true }); } catch { /* ignore */ }
    }
  }
}

if (process.argv[1] && fileURLToPath(import.meta.url) === resolve(process.argv[1])) {
  try {
    const result = verifyProductionSurface();
    console.log(`production surface clean (${result.markers.length} markers checked)`);
  } catch (error) {
    console.error(error.message || error);
    process.exit(1);
  }
}
