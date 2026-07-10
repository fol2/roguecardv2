import assert from 'node:assert/strict';
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { resolve } from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

import { MUSIC_CATALOG } from '../src/audio-catalog.js';
import { validateMusicRenderProvenance } from '../tools/validate-audio-pack.mjs';

const ROOT = resolve(fileURLToPath(new URL('..', import.meta.url)));
const VALIDATOR = resolve(ROOT, 'tools/validate-audio-pack.mjs');
const PACK = resolve(ROOT, 'src/assets/musics/stained-glass-v2');
const installedManifest = JSON.parse(readFileSync(resolve(PACK, 'manifest.json'), 'utf8'));
const installedRenderProvenance = JSON.parse(readFileSync(resolve(PACK, 'render-provenance.json'), 'utf8'));
const mediaById = new Map(MUSIC_CATALOG.map((row) => [row.id, {
  bytes: installedManifest.items[row.id].bytes,
  sha256: installedManifest.items[row.id].sha256,
}]));

function inspectRenderProvenance(value) {
  const report = { errors: [] };
  const structurallyValid = validateMusicRenderProvenance(value, {
    version: 'stained-glass-v2',
    expected: MUSIC_CATALOG,
    mediaById,
  }, report);
  return { structurallyValid, errors: report.errors };
}

function runValidator(extraArgs = []) {
  return spawnSync(process.execPath, [
    VALIDATOR,
    '--kind', 'music',
    '--version', 'stained-glass-v2',
    '--verify-manifest',
    ...extraArgs,
  ], {
    cwd: ROOT,
    encoding: 'utf8',
    maxBuffer: 16 * 1024 * 1024,
  });
}

const inspected = inspectRenderProvenance(installedRenderProvenance);
assert.equal(inspected.structurallyValid, true);
assert.deepEqual(inspected.errors, [], 'installed render provenance must satisfy its strict schema');

const malformedRenderProvenance = structuredClone(installedRenderProvenance);
malformedRenderProvenance.selection_sha256 = 'not-a-sha';
malformedRenderProvenance.pack_id = 'wrong-pack';
malformedRenderProvenance.kind = 'sfx';
malformedRenderProvenance.provenance.provider = 'Forged provider';
malformedRenderProvenance.items.title.source_url = 'https://suno.com/song/different-source-id';
delete malformedRenderProvenance.items.defeat;
malformedRenderProvenance.items.unknownCue = structuredClone(malformedRenderProvenance.items.title);
const malformedReport = inspectRenderProvenance(malformedRenderProvenance);
for (const expected of [
  'render-provenance.json.pack_id: expected stained-glass-v2',
  'render-provenance.json.kind: expected music',
  'render-provenance.json.selection_sha256: expected a SHA-256 hex digest',
  'render-provenance.json.provenance.provider: expected Suno',
  'render-provenance.json.items: missing ids: defeat',
  'render-provenance.json.items: unknown ids: unknownCue',
  'render-provenance.json.items.title.source_url: URL source id must match source_id',
]) {
  assert.ok(malformedReport.errors.includes(expected), `missing strict render-provenance error: ${expected}`);
}

const valid = runValidator();
assert.equal(valid.status, 0, `installed Suno manifest must pass:\n${valid.stdout}${valid.stderr}`);
assert.match(valid.stdout, /PASS music stained-glass-v2: 22\/22 canonical MP3s decoded/);

const temporary = mkdtempSync(resolve(tmpdir(), 'spirebound-forged-music-provenance-'));
try {
  const forgedPath = resolve(temporary, 'manifest.json');
  const forged = structuredClone(installedManifest);
  forged.provenance.provider = 'Forged provider';
  forged.provenance.licence_or_plan = 'Forged plan';
  forged.items.title.source_id = 'forged-source-id';
  forged.items.title.source_url = 'https://example.com/not-suno';
  forged.items.title.selected_variant = 'forged-variant';
  forged.items.embark.bytes += 1;
  forged.items.embark.sha256 = '0'.repeat(64);
  writeFileSync(forgedPath, `${JSON.stringify(forged, null, 2)}\n`);

  const rejected = runValidator([forgedPath]);
  const output = `${rejected.stdout}${rejected.stderr}`;
  assert.notEqual(rejected.status, 0, 'forged Suno provenance must fail validation');
  for (const expected of [
    'manifest.provenance.provider: must match render-provenance.json',
    'manifest.provenance.licence_or_plan: must match render-provenance.json',
    'manifest.items.title.source_id: must match render-provenance.json',
    'manifest.items.title.source_url: must match render-provenance.json',
    'manifest.items.title.selected_variant: must match render-provenance.json',
    'manifest.items.embark.bytes: must match render-provenance.json',
    'manifest.items.embark.sha256: must match render-provenance.json',
  ]) {
    assert.match(output, new RegExp(expected.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));
  }
} finally {
  rmSync(temporary, { recursive: true, force: true });
}

console.log('Audio pack strict-provenance checks passed');
