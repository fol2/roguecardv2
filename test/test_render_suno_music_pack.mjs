import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { mkdtempSync, readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { resolve } from 'node:path';
import { spawnSync } from 'node:child_process';

import { MUSIC_CATALOG } from '../src/audio-catalog.js';
import {
  DEFAULT_RENDER_SETTINGS,
  analyseLoopSeam,
  normaliseSelection,
  parseCandidateFilename,
  planRenderDurations,
  probeAudio,
  renderLoopedCandidate,
} from '../tools/render-suno-music-pack.mjs';

function sha256(path) {
  return createHash('sha256').update(readFileSync(path)).digest('hex');
}

function run(tool, args) {
  const result = spawnSync(tool, args, { encoding: 'utf8' });
  assert.equal(result.status, 0, `${tool} failed: ${result.stderr}`);
}

assert.deepEqual(
  parseCandidateFilename('act1Combat--b--4b29f954-ea6d-42e0-9fb1-3c43f9b36a0c.mp3'),
  {
    cue: 'act1Combat',
    selectedVariant: 'b',
    sourceId: '4b29f954-ea6d-42e0-9fb1-3c43f9b36a0c',
  },
  'candidate filename keeps the cue, selected variant, and stable Suno id',
);
assert.throws(
  () => parseCandidateFilename('../title--a--source.mp3'),
  /must be an MP3 basename/,
  'candidate paths cannot escape the candidate directory',
);
assert.throws(
  () => parseCandidateFilename('title-a-source.mp3'),
  /must be named <cue>--<variant>--<suno-id>/,
  'candidate filenames fail closed when separators are ambiguous',
);

const selection = {
  schema_version: 1,
  pack_id: 'stained-glass-v2-test',
  provenance: {
    provider: 'Suno',
    generated_at: '2026-07-10T12:00:00Z',
    licence_or_plan: 'Suno Pro',
    notes: null,
  },
  items: Object.fromEntries(MUSIC_CATALOG.map((row, index) => [row.id, {
    file: `${row.id}--v${index + 1}--source-${index + 1}.mp3`,
    source_url: `https://suno.com/song/source-${index + 1}`,
  }])),
};
const normalised = normaliseSelection(selection, selection.pack_id);
assert.equal(Object.keys(normalised.items).length, 22, 'selection contains the exact 22-cue catalogue');
assert.equal(normalised.items.title.selected_variant, 'v1', 'variant is derived from the selected filename');
assert.equal(normalised.items.title.source_id, 'source-1', 'source id is derived and retained');
assert.equal(normalised.items.title.source_url, 'https://suno.com/song/source-1', 'source URL is retained');
const missing = structuredClone(selection);
delete missing.items.defeat;
assert.throws(
  () => normaliseSelection(missing, missing.pack_id),
  /missing cues: defeat/,
  'an incomplete pack cannot render',
);
const mismatched = structuredClone(selection);
mismatched.items.title.source_id = 'different-id';
assert.throws(
  () => normaliseSelection(mismatched, mismatched.pack_id),
  /source_id differs from its filename/,
  'explicit provenance cannot disagree with the filename',
);

assert.deepEqual(
  planRenderDurations(94),
  {
    tail_exclusion_seconds: 4,
    source_window_seconds: 90,
    pre_tempo_duration_seconds: 87,
    output_duration_seconds: 90,
    tempo_factor: 0.966666667,
  },
  'a short source excludes its fade tail then stretches gently after the loop crossfade',
);
assert.deepEqual(
  planRenderDurations(100),
  {
    tail_exclusion_seconds: 4,
    source_window_seconds: 96,
    pre_tempo_duration_seconds: 93,
    output_duration_seconds: 93,
    tempo_factor: 1,
  },
  'a normal source excludes its terminal fade and overlapped crossfade duration',
);
assert.deepEqual(
  planRenderDurations(180),
  {
    tail_exclusion_seconds: 57,
    source_window_seconds: 123,
    pre_tempo_duration_seconds: 120,
    output_duration_seconds: 120,
    tempo_factor: 1,
  },
  'a long Suno render is deterministically bounded at 120 seconds',
);
assert.throws(() => planRenderDurations(90), /unsafe tempo factor/, 'sources too short for a fade-safe loop fail closed');

const ffmpeg = spawnSync('ffmpeg', ['-version'], { encoding: 'utf8' });
const ffprobe = spawnSync('ffprobe', ['-version'], { encoding: 'utf8' });
if (ffmpeg.status === 0 && ffprobe.status === 0) {
  const root = mkdtempSync(resolve(tmpdir(), 'spirebound-music-renderer-'));
  try {
    const input = resolve(root, 'synthetic.mp3');
    const first = resolve(root, 'first.mp3');
    const second = resolve(root, 'second.mp3');
    run('ffmpeg', [
      '-nostdin', '-hide_banner', '-v', 'error',
      '-f', 'lavfi', '-i', 'sine=frequency=317:sample_rate=48000:duration=3.2',
      '-ac', '2', '-c:a', 'libmp3lame', '-b:a', '192k', input,
    ]);
    const settings = {
      ...DEFAULT_RENDER_SETTINGS,
      minimum_duration_seconds: 3,
      maximum_duration_seconds: 4,
      crossfade_seconds: 0.5,
      tail_exclusion_seconds: 0.2,
      minimum_tempo_factor: 0.5,
      edge_window_seconds: 0.1,
    };
    renderLoopedCandidate(input, first, resolve(root, 'work-first'), settings);
    renderLoopedCandidate(input, second, resolve(root, 'work-second'), settings);
    const media = probeAudio(first, { decode: true });
    assert.equal(media.codec, 'mp3', 'synthetic render is MP3');
    assert.equal(media.sample_rate_hz, 48000, 'synthetic render is 48 kHz');
    assert.equal(media.channels, 2, 'synthetic render is stereo');
    assert.ok(media.duration_seconds >= 2.95 && media.duration_seconds <= 4.05, 'synthetic render obeys its test duration range');
    const seam = analyseLoopSeam(first, media, settings);
    assert.ok(Number.isFinite(seam.seam_energy_delta_db), 'synthetic loop has a measured crossfade seam');
    assert.ok(Number.isFinite(seam.boundary_jump_ratio), 'synthetic loop has a measured edge-discontinuity ratio');
    assert.equal(seam.channels.length, 2, 'loop QA measures both stereo channels independently');
    assert.ok(
      seam.maximum_seam_energy_delta_db <= settings.maximum_seam_energy_delta_db,
      'quadratic crossfade does not create an accepted seam swell',
    );
    assert.equal(sha256(first), sha256(second), 'identical inputs and settings produce byte-identical MP3s');
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
}

console.log('Suno Music renderer checks passed');
