#!/usr/bin/env node
// Write baseline-manifest.json for Linux visual snapshots.
// Schema: { schemaVersion, sourceSha, files: [{ path, bytes, sha256 }] }
// Paths are relative to the snapshot directory, sorted, Linux-only.

import { createHash } from 'node:crypto';
import {
  existsSync, mkdirSync, readdirSync, readFileSync, statSync, writeFileSync,
} from 'node:fs';
import { dirname, join, relative, resolve, sep } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

export const BASELINE_MANIFEST_SCHEMA_VERSION = 1;
export const LINUX_SNAPSHOT_SUFFIX = '-linux.png';

function isLinuxSnapshotName(name) {
  return typeof name === 'string' && name.endsWith(LINUX_SNAPSHOT_SUFFIX) && !name.includes('..');
}

function assertWithinRoot(root, candidate) {
  const resolvedRoot = resolve(root) + sep;
  const resolved = resolve(candidate);
  if (resolved !== resolve(root) && !resolved.startsWith(resolvedRoot)) {
    throw new Error(`path escapes snapshot root: ${candidate}`);
  }
  return resolved;
}

function sha256Of(buffer) {
  return createHash('sha256').update(buffer).digest('hex');
}

/** Collect allowlisted Linux snapshot rows under snapshotDir (stable sort). */
export function collectLinuxSnapshotRows(snapshotDir) {
  const root = resolve(snapshotDir);
  if (!existsSync(root)) throw new Error(`snapshot directory missing: ${root}`);
  const names = readdirSync(root).filter(isLinuxSnapshotName).sort();
  const files = [];
  for (const name of names) {
    const abs = assertWithinRoot(root, join(root, name));
    const buf = readFileSync(abs);
    const st = statSync(abs);
    if (!st.isFile()) throw new Error(`not a file: ${name}`);
    files.push(Object.freeze({
      path: name.replaceAll('\\', '/'),
      bytes: buf.byteLength,
      sha256: sha256Of(buf),
    }));
  }
  return Object.freeze(files);
}

export function buildBaselineManifest({ sourceSha, files }) {
  const sha = String(sourceSha || '').trim();
  if (!/^[0-9a-f]{7,40}$/i.test(sha)) {
    throw new Error(`invalid sourceSha: ${sourceSha}`);
  }
  if (!Array.isArray(files)) throw new TypeError('files must be an array');
  const sorted = [...files].sort((a, b) => a.path.localeCompare(b.path));
  for (let i = 0; i < sorted.length; i += 1) {
    const row = sorted[i];
    if (!row || typeof row.path !== 'string' || !isLinuxSnapshotName(row.path)) {
      throw new Error(`non-allowlisted snapshot path: ${row?.path}`);
    }
    if (row.path.includes('..') || row.path.includes('/') || row.path.includes('\\')) {
      throw new Error(`path traversal rejected: ${row.path}`);
    }
    if (!Number.isInteger(row.bytes) || row.bytes < 0) {
      throw new Error(`invalid bytes for ${row.path}`);
    }
    if (typeof row.sha256 !== 'string' || !/^[0-9a-f]{64}$/i.test(row.sha256)) {
      throw new Error(`invalid sha256 for ${row.path}`);
    }
    if (i > 0 && sorted[i - 1].path === row.path) {
      throw new Error(`duplicate path: ${row.path}`);
    }
  }
  return Object.freeze({
    schemaVersion: BASELINE_MANIFEST_SCHEMA_VERSION,
    sourceSha: sha.toLowerCase(),
    files: Object.freeze(sorted.map((row) => Object.freeze({ ...row }))),
  });
}

export function writeBaselineManifest({
  snapshotDir,
  sourceSha,
  outPath = null,
} = {}) {
  const root = resolve(snapshotDir);
  const files = collectLinuxSnapshotRows(root);
  const manifest = buildBaselineManifest({ sourceSha, files });
  const dest = resolve(outPath || join(root, 'baseline-manifest.json'));
  mkdirSync(dirname(dest), { recursive: true });
  writeFileSync(dest, `${JSON.stringify(manifest, null, 2)}\n`);
  return manifest;
}

function parseArgs(argv) {
  const out = { snapshotDir: null, sourceSha: null, outPath: null };
  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === '--snapshot-dir') out.snapshotDir = argv[++i];
    else if (arg === '--source-sha') out.sourceSha = argv[++i];
    else if (arg === '--out') out.outPath = argv[++i];
    else if (arg === '--help' || arg === '-h') out.help = true;
    else throw new Error(`unknown argument: ${arg}`);
  }
  return out;
}

async function main(argv) {
  const args = parseArgs(argv);
  if (args.help) {
    process.stdout.write(
      'Usage: node tools/write-baseline-manifest.mjs --snapshot-dir <dir> --source-sha <sha> [--out <file>]\n',
    );
    return;
  }
  if (!args.snapshotDir || !args.sourceSha) {
    throw new Error('--snapshot-dir and --source-sha are required');
  }
  const manifest = writeBaselineManifest({
    snapshotDir: args.snapshotDir,
    sourceSha: args.sourceSha,
    outPath: args.outPath,
  });
  process.stdout.write(
    `wrote baseline-manifest.json (${manifest.files.length} linux snapshots, sha=${manifest.sourceSha})\n`,
  );
}

if (import.meta.url === pathToFileURL(process.argv[1]).href
    || process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  main(process.argv.slice(2)).catch((error) => {
    process.stderr.write(`${error.message || error}\n`);
    process.exitCode = 1;
  });
}
