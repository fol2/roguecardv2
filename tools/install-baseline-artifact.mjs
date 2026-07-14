#!/usr/bin/env node
// Install a validated Linux baseline artifact into the visual snapshots dir.
// Validates schema, source SHA, exact allowlist, bytes and SHA-256 before any
// copy. Then atomically replaces only the manifest-listed Linux files.

import { createHash } from 'node:crypto';
import {
  existsSync, mkdirSync, mkdtempSync, readdirSync, readFileSync,
  renameSync, rmSync, statSync, writeFileSync,
} from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, resolve, sep } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import {
  BASELINE_MANIFEST_SCHEMA_VERSION,
  LINUX_SNAPSHOT_SUFFIX,
  buildBaselineManifest,
} from './write-baseline-manifest.mjs';

function sha256Of(buffer) {
  return createHash('sha256').update(buffer).digest('hex');
}

function assertWithin(root, candidate) {
  const resolvedRoot = resolve(root) + sep;
  const resolved = resolve(candidate);
  if (resolved !== resolve(root) && !resolved.startsWith(resolvedRoot)) {
    throw new Error(`path escapes root: ${candidate}`);
  }
  return resolved;
}

function findManifest(artifactDir) {
  const root = resolve(artifactDir);
  if (!existsSync(root)) throw new Error(`artifact directory missing: ${root}`);
  const stack = [root];
  const found = [];
  while (stack.length) {
    const dir = stack.pop();
    for (const name of readdirSync(dir)) {
      if (name === '..' || name.includes('\0')) continue;
      const abs = join(dir, name);
      const st = statSync(abs);
      if (st.isDirectory()) {
        if (name === '..') continue;
        stack.push(abs);
      } else if (name === 'baseline-manifest.json') {
        found.push(abs);
      }
    }
  }
  if (found.length !== 1) {
    throw new Error(
      `expected exactly one baseline-manifest.json under artifact, found ${found.length}`,
    );
  }
  return found[0];
}

function loadAndValidateManifest(manifestPath, expectSha) {
  const raw = JSON.parse(readFileSync(manifestPath, 'utf8'));
  if (raw.schemaVersion !== BASELINE_MANIFEST_SCHEMA_VERSION) {
    throw new Error(`unsupported baseline manifest schemaVersion: ${raw.schemaVersion}`);
  }
  const expect = String(expectSha || '').trim().toLowerCase();
  const source = String(raw.sourceSha || '').trim().toLowerCase();
  if (source !== expect) {
    throw new Error(`manifest sourceSha mismatch: got ${source}, expected ${expect}`);
  }
  // Re-run builder validation (ordering, allowlist, hash shape).
  return buildBaselineManifest({ sourceSha: source, files: raw.files });
}

function readArtifactFile(artifactRoot, relPath) {
  if (relPath.includes('..') || relPath.includes('/') || relPath.includes('\\')) {
    throw new Error(`path traversal rejected: ${relPath}`);
  }
  if (!relPath.endsWith(LINUX_SNAPSHOT_SUFFIX)) {
    throw new Error(`non-allowlisted snapshot path: ${relPath}`);
  }
  const abs = assertWithin(artifactRoot, join(artifactRoot, relPath));
  if (!existsSync(abs)) throw new Error(`missing artifact file: ${relPath}`);
  return readFileSync(abs);
}

/**
 * Validate then atomically install Linux baselines from an artifact directory.
 * @returns {string[]} sorted relative paths that were installed
 */
export function installBaselineArtifact({
  artifact,
  expectSha,
  destination,
} = {}) {
  if (!artifact || !expectSha || !destination) {
    throw new Error('--artifact, --expect-sha and --destination are required');
  }
  const artifactRoot = resolve(artifact);
  const destRoot = resolve(destination);
  const manifestPath = findManifest(artifactRoot);
  const manifestDir = dirname(manifestPath);
  const manifest = loadAndValidateManifest(manifestPath, expectSha);

  const listed = new Set(manifest.files.map((row) => row.path));
  const onDisk = new Set(
    readdirSync(manifestDir).filter((name) => name.endsWith(LINUX_SNAPSHOT_SUFFIX)),
  );
  for (const path of listed) {
    if (!onDisk.has(path)) throw new Error(`missing artifact file: ${path}`);
  }
  for (const path of onDisk) {
    if (!listed.has(path)) throw new Error(`extra artifact file: ${path}`);
  }

  const payloads = [];
  for (const row of manifest.files) {
    const buf = readArtifactFile(manifestDir, row.path);
    if (buf.byteLength !== row.bytes) {
      throw new Error(`byte size mismatch for ${row.path}: ${buf.byteLength} !== ${row.bytes}`);
    }
    const digest = sha256Of(buf);
    if (digest !== row.sha256.toLowerCase()) {
      throw new Error(`sha256 mismatch for ${row.path}`);
    }
    payloads.push({ path: row.path, buf });
  }

  // All-or-nothing: stage into a temp dir then rename into destination.
  mkdirSync(destRoot, { recursive: true });
  const staging = mkdtempSync(join(tmpdir(), 'spirebound-baseline-install-'));
  try {
    for (const { path, buf } of payloads) {
      writeFileSync(join(staging, path), buf);
    }
    const installed = [];
    for (const { path } of payloads) {
      const from = join(staging, path);
      const to = assertWithin(destRoot, join(destRoot, path));
      // Stage beside the destination then rename for same-filesystem atomicity.
      const stagedBeside = `${to}.__installing`;
      writeFileSync(stagedBeside, readFileSync(from));
      renameSync(stagedBeside, to);
      installed.push(path);
    }
    installed.sort();
    for (const path of installed) process.stdout.write(`${path}\n`);
    return installed;
  } finally {
    rmSync(staging, { recursive: true, force: true });
  }
}

function parseArgs(argv) {
  const out = { artifact: null, expectSha: null, destination: null, help: false };
  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === '--artifact') out.artifact = argv[++i];
    else if (arg === '--expect-sha') out.expectSha = argv[++i];
    else if (arg === '--destination') out.destination = argv[++i];
    else if (arg === '--help' || arg === '-h') out.help = true;
    else throw new Error(`unknown argument: ${arg}`);
  }
  return out;
}

async function main(argv) {
  const args = parseArgs(argv);
  if (args.help) {
    process.stdout.write(
      'Usage: node tools/install-baseline-artifact.mjs --artifact <dir> --expect-sha <sha> --destination <dir>\n',
    );
    return;
  }
  installBaselineArtifact(args);
}

if (import.meta.url === pathToFileURL(process.argv[1]).href
    || process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  main(process.argv.slice(2)).catch((error) => {
    process.stderr.write(`${error.message || error}\n`);
    process.exitCode = 1;
  });
}
