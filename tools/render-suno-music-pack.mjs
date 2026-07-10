#!/usr/bin/env node

import { createHash } from 'node:crypto';
import {
  existsSync,
  lstatSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  readdirSync,
  realpathSync,
  renameSync,
  rmSync,
  statSync,
  writeFileSync,
} from 'node:fs';
import { basename, dirname, resolve, sep } from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath, pathToFileURL } from 'node:url';

import { MUSIC_CATALOG } from '../src/audio-catalog.js';
import { BASE_AUDIO_VERSIONS, canonicalAudioFilename } from '../src/audio-packs.js';

const ROOT = resolve(fileURLToPath(new URL('..', import.meta.url)));
const MUSIC_ROOT = resolve(ROOT, 'src/assets/musics');
const EXPECTED_CUE_COUNT = 22;
const VERSION_RE = /^[a-z0-9][a-z0-9-]*$/;
const TOKEN_RE = /^[A-Za-z0-9][A-Za-z0-9._-]*$/;
const SOURCE_ID_RE = /^[A-Za-z0-9][A-Za-z0-9_-]*$/;
const PROVENANCE_FILE = 'render-provenance.json';
const DURATION_TOLERANCE_SECONDS = 0.05;
const LOUDNESS_TOLERANCE_LU = 0.75;
const TRUE_PEAK_TOLERANCE_DB = 0.5;

export const DEFAULT_RENDER_SETTINGS = Object.freeze({
  minimum_duration_seconds: 90,
  maximum_duration_seconds: 120,
  crossfade_seconds: 3,
  tail_exclusion_seconds: 4,
  minimum_tempo_factor: 0.935,
  integrated_loudness_lufs: -20,
  true_peak_dbtp: -3,
  loudness_range_lu: 11,
  sample_rate_hz: 48000,
  channels: 2,
  bitrate_kbps: 192,
  crossfade_curve: 'qua',
  edge_window_seconds: 0.25,
  minimum_edge_rms_dbfs: -55,
  maximum_edge_rms_delta_db: 15,
  minimum_seam_energy_delta_db: -9,
  maximum_seam_energy_delta_db: 3.5,
  maximum_boundary_jump: 0.08,
  maximum_boundary_jump_ratio: 8,
});

function fail(message) {
  throw new Error(`Suno Music renderer: ${message}`);
}

function sha256File(path) {
  return createHash('sha256').update(readFileSync(path)).digest('hex');
}

function sha256Text(value) {
  return createHash('sha256').update(value).digest('hex');
}

function fixed(value, digits = 6) {
  return Number(Number(value).toFixed(digits));
}

function command(tool, args, options = {}) {
  const result = spawnSync(tool, args, {
    encoding: Object.hasOwn(options, 'encoding') ? options.encoding : 'utf8',
    maxBuffer: options.maxBuffer ?? 16 * 1024 * 1024,
    stdio: options.stdio,
  });
  if (result.error?.code === 'ENOENT') fail(`${tool} is required but was not found on PATH`);
  if (result.error) fail(`${tool} could not start: ${result.error.message}`);
  if (result.status !== 0) {
    const detail = typeof result.stderr === 'string' ? result.stderr.trim() : '';
    fail(`${tool} failed with exit ${result.status}${detail ? `: ${detail}` : ''}`);
  }
  return result;
}

function requireAudioTools() {
  command('ffmpeg', ['-version']);
  command('ffprobe', ['-version']);
}

export function parseCandidateFilename(filename) {
  if (typeof filename !== 'string' || basename(filename) !== filename || !filename.endsWith('.mp3')) {
    fail(`candidate ${JSON.stringify(filename)} must be an MP3 basename`);
  }
  const parts = filename.slice(0, -4).split('--');
  if (parts.length !== 3) {
    fail(`candidate ${JSON.stringify(filename)} must be named <cue>--<variant>--<suno-id>.mp3`);
  }
  const [cue, selectedVariant, sourceId] = parts;
  if (!TOKEN_RE.test(cue)) fail(`${filename}: invalid cue token`);
  if (!TOKEN_RE.test(selectedVariant)) fail(`${filename}: invalid variant token`);
  if (!SOURCE_ID_RE.test(sourceId)) fail(`${filename}: invalid Suno source id`);
  return { cue, selectedVariant, sourceId };
}

function normaliseHttpUrl(value, label) {
  if (value == null) return null;
  if (typeof value !== 'string' || !value.trim()) fail(`${label} must be an HTTP(S) URL or null`);
  let url;
  try {
    url = new URL(value);
  } catch {
    fail(`${label} must be an HTTP(S) URL or null`);
  }
  if (!['http:', 'https:'].includes(url.protocol)) fail(`${label} must be an HTTP(S) URL or null`);
  return value;
}

function rejectUnknownKeys(value, allowed, label) {
  const unknown = Object.keys(value).filter((key) => !allowed.includes(key));
  if (unknown.length) fail(`${label} contains unknown keys: ${unknown.join(', ')}`);
}

export function normaliseSelection(mapping, version, catalogue = MUSIC_CATALOG) {
  if (!mapping || typeof mapping !== 'object' || Array.isArray(mapping)) fail('selection must be a JSON object');
  rejectUnknownKeys(mapping, ['schema_version', 'pack_id', 'provenance', 'items'], 'selection');
  if (mapping.schema_version !== 1) fail('selection.schema_version must be 1');
  if (mapping.pack_id !== version) fail(`selection.pack_id must be ${version}`);
  if (mapping.provenance == null || typeof mapping.provenance !== 'object' || Array.isArray(mapping.provenance)) {
    fail('selection.provenance must be an object');
  }
  rejectUnknownKeys(
    mapping.provenance,
    ['provider', 'generated_at', 'licence_or_plan', 'notes'],
    'selection.provenance',
  );
  if (mapping.provenance.provider !== 'Suno') fail('selection.provenance.provider must be Suno');
  for (const key of ['generated_at', 'licence_or_plan', 'notes']) {
    if (!Object.hasOwn(mapping.provenance, key)) fail(`selection.provenance.${key} is required (null is allowed)`);
    if (mapping.provenance[key] != null && typeof mapping.provenance[key] !== 'string') {
      fail(`selection.provenance.${key} must be a string or null`);
    }
  }
  if (!mapping.items || typeof mapping.items !== 'object' || Array.isArray(mapping.items)) {
    fail('selection.items must be an object');
  }
  if (!Array.isArray(catalogue) || catalogue.length !== EXPECTED_CUE_COUNT) {
    fail(`Music catalogue must contain exactly ${EXPECTED_CUE_COUNT} cues`);
  }
  const catalogueIds = catalogue.map((row) => row.id);
  if (new Set(catalogueIds).size !== EXPECTED_CUE_COUNT) fail('Music catalogue contains duplicate cue ids');
  const mappedIds = Object.keys(mapping.items);
  const missing = catalogueIds.filter((id) => !mappedIds.includes(id));
  const extra = mappedIds.filter((id) => !catalogueIds.includes(id));
  if (missing.length) fail(`selection.items is missing cues: ${missing.join(', ')}`);
  if (extra.length) fail(`selection.items contains unknown cues: ${extra.join(', ')}`);

  const items = {};
  const seenFiles = new Set();
  for (const row of catalogue) {
    const item = mapping.items[row.id];
    if (!item || typeof item !== 'object' || Array.isArray(item)) {
      fail(`selection.items.${row.id} must be an object`);
    }
    rejectUnknownKeys(
      item,
      ['file', 'selected_variant', 'source_id', 'source_url'],
      `selection.items.${row.id}`,
    );
    if (typeof item.file !== 'string') fail(`selection.items.${row.id}.file must be a string`);
    const parsed = parseCandidateFilename(item.file);
    if (parsed.cue !== row.id) {
      fail(`selection.items.${row.id}.file names cue ${parsed.cue}`);
    }
    if (item.selected_variant != null && item.selected_variant !== parsed.selectedVariant) {
      fail(`selection.items.${row.id}.selected_variant differs from its filename`);
    }
    if (item.source_id != null && item.source_id !== parsed.sourceId) {
      fail(`selection.items.${row.id}.source_id differs from its filename`);
    }
    if (seenFiles.has(item.file)) fail(`candidate ${item.file} is selected more than once`);
    seenFiles.add(item.file);
    items[row.id] = {
      file: item.file,
      selected_variant: parsed.selectedVariant,
      source_id: parsed.sourceId,
      source_url: normaliseHttpUrl(item.source_url, `selection.items.${row.id}.source_url`),
    };
  }

  return {
    schema_version: 1,
    pack_id: version,
    provenance: {
      provider: 'Suno',
      generated_at: mapping.provenance.generated_at,
      licence_or_plan: mapping.provenance.licence_or_plan,
      notes: mapping.provenance.notes,
    },
    items,
  };
}

export function planRenderDurations(sourceDuration, settings = DEFAULT_RENDER_SETTINGS) {
  const minimum = Number(settings.minimum_duration_seconds);
  const maximum = Number(settings.maximum_duration_seconds);
  const crossfade = Number(settings.crossfade_seconds);
  const tailExclusion = Number(settings.tail_exclusion_seconds);
  const minimumTempo = Number(settings.minimum_tempo_factor);
  if (![sourceDuration, minimum, maximum, crossfade, tailExclusion, minimumTempo].every(Number.isFinite)) {
    fail('render durations must be finite');
  }
  if (minimum <= 0 || maximum < minimum) fail('invalid output duration range');
  if (crossfade <= 0 || crossfade * 2 >= minimum) fail('crossfade must be positive and shorter than half the minimum duration');
  if (tailExclusion < 0 || tailExclusion >= minimum) fail('tail exclusion must be non-negative and shorter than the minimum duration');
  if (minimumTempo <= 0 || minimumTempo > 1) fail('minimum tempo factor must be greater than zero and no more than one');
  const usableDuration = sourceDuration - tailExclusion;
  const sourceWindow = Math.min(usableDuration, maximum + crossfade);
  if (sourceWindow <= crossfade) fail(`source is too short after the ${tailExclusion}s terminal fade exclusion`);
  const preTempoDuration = sourceWindow - crossfade;
  const outputDuration = Math.max(minimum, Math.min(maximum, preTempoDuration));
  const tempo = preTempoDuration / outputDuration;
  if (tempo < minimumTempo || tempo > 1) {
    fail(
      `source is ${sourceDuration.toFixed(3)}s; excluding its last ${tailExclusion}s and a ${crossfade}s loop overlap `
      + `would require unsafe tempo factor ${tempo.toFixed(6)} (minimum ${minimumTempo})`,
    );
  }
  return {
    tail_exclusion_seconds: fixed(sourceDuration - sourceWindow),
    source_window_seconds: fixed(sourceWindow),
    pre_tempo_duration_seconds: fixed(preTempoDuration),
    output_duration_seconds: fixed(outputDuration),
    tempo_factor: fixed(tempo, 9),
  };
}

export function probeAudio(path, { decode = false } = {}) {
  const result = command('ffprobe', [
    '-v', 'error',
    '-show_entries', 'format=duration:stream=codec_type,codec_name,sample_rate,channels',
    '-of', 'json',
    path,
  ]);
  let data;
  try {
    data = JSON.parse(result.stdout);
  } catch {
    fail(`${path}: ffprobe returned invalid JSON`);
  }
  const stream = data.streams?.find((entry) => entry.codec_type === 'audio');
  const duration = Number(data.format?.duration);
  if (!stream || !Number.isFinite(duration) || duration <= 0) fail(`${path}: no positive-duration audio stream`);
  if (decode) {
    command('ffmpeg', ['-nostdin', '-v', 'error', '-xerror', '-i', path, '-map', '0:a:0', '-f', 'null', '-']);
  }
  return {
    duration_seconds: duration,
    codec: stream.codec_name,
    sample_rate_hz: Number(stream.sample_rate),
    channels: Number(stream.channels),
  };
}

function analyseLoudness(path, settings) {
  const filter = [
    `loudnorm=I=${settings.integrated_loudness_lufs}`,
    `TP=${settings.true_peak_dbtp}`,
    `LRA=${settings.loudness_range_lu}`,
    'print_format=json',
  ].join(':');
  const result = command('ffmpeg', [
    '-nostdin', '-hide_banner', '-v', 'info', '-i', path,
    '-map', '0:a:0', '-af', filter, '-f', 'null', '-',
  ]);
  const match = result.stderr.match(/\{\s*"input_i"[\s\S]*?\}/g)?.at(-1);
  if (!match) fail(`${path}: loudnorm did not return measurements`);
  let measured;
  try {
    measured = JSON.parse(match);
  } catch {
    fail(`${path}: loudnorm returned invalid JSON`);
  }
  const values = {
    input_i: Number(measured.input_i),
    input_tp: Number(measured.input_tp),
    input_lra: Number(measured.input_lra),
    input_thresh: Number(measured.input_thresh),
    target_offset: Number(measured.target_offset),
  };
  if (!Object.values(values).every(Number.isFinite)) fail(`${path}: loudness measurements are not finite`);
  return values;
}

function rmsDb(buffer, startSample, endSample, channel = 0, channels = 1) {
  const start = Math.max(0, Math.floor(startSample));
  const end = Math.min(buffer.length / (4 * channels), Math.ceil(endSample));
  if (end <= start) fail('loop edge analysis received an empty sample window');
  let sumSquares = 0;
  for (let index = start; index < end; index += 1) {
    const sample = buffer.readFloatLE(((index * channels) + channel) * 4);
    sumSquares += sample * sample;
  }
  const rms = Math.sqrt(sumSquares / (end - start));
  return { rms, dbfs: 20 * Math.log10(Math.max(rms, 1e-12)) };
}

function localDerivativeRms(buffer, ranges, channel = 0, channels = 1) {
  let sumSquares = 0;
  let count = 0;
  const sampleCount = buffer.length / (4 * channels);
  for (const [rawStart, rawEnd] of ranges) {
    const start = Math.max(1, Math.floor(rawStart));
    const end = Math.min(sampleCount, Math.ceil(rawEnd));
    for (let index = start; index < end; index += 1) {
      const delta = buffer.readFloatLE(((index * channels) + channel) * 4)
        - buffer.readFloatLE(((((index - 1) * channels) + channel) * 4));
      sumSquares += delta * delta;
      count += 1;
    }
  }
  return count ? Math.sqrt(sumSquares / count) : 0;
}

export function analyseLoopSeam(path, media, settings = DEFAULT_RENDER_SETTINGS) {
  const result = command('ffmpeg', [
    '-nostdin', '-hide_banner', '-v', 'error', '-xerror', '-i', path,
    '-map', '0:a:0', '-ac', String(settings.channels), '-ar', String(settings.sample_rate_hz),
    '-f', 'f32le', '-',
  ], { encoding: null, maxBuffer: 64 * 1024 * 1024 });
  const pcm = result.stdout;
  const channels = settings.channels;
  if (!Buffer.isBuffer(pcm) || pcm.length % (4 * channels) !== 0) {
    fail(`${path}: could not decode interleaved PCM for loop edge analysis`);
  }
  const sampleCount = pcm.length / (4 * channels);
  const rate = settings.sample_rate_hz;
  const decodedDuration = sampleCount / rate;
  if (Math.abs(decodedDuration - media.duration_seconds) > 0.1) {
    fail(`${path}: decoded duration differs from the container duration by more than 0.1s`);
  }
  const edgeSamples = Math.round(settings.edge_window_seconds * rate);
  const crossfadeSamples = Math.round(settings.crossfade_seconds * rate);
  if (sampleCount < crossfadeSamples * 2 || sampleCount < edgeSamples * 2) {
    fail(`${path}: output is too short for loop edge analysis`);
  }
  const derivativeSamples = Math.min(edgeSamples, 2048);
  const channelStats = [];
  for (let channel = 0; channel < channels; channel += 1) {
    const firstEdge = rmsDb(pcm, 0, edgeSamples, channel, channels);
    const lastEdge = rmsDb(pcm, sampleCount - edgeSamples, sampleCount, channel, channels);
    const firstCrossfade = rmsDb(pcm, 0, crossfadeSamples, channel, channels);
    const preSeam = rmsDb(
      pcm,
      sampleCount - (crossfadeSamples * 2),
      sampleCount - crossfadeSamples,
      channel,
      channels,
    );
    const seam = rmsDb(pcm, sampleCount - crossfadeSamples, sampleCount, channel, channels);
    const firstSample = pcm.readFloatLE(channel * 4);
    const lastSample = pcm.readFloatLE((((sampleCount - 1) * channels) + channel) * 4);
    const boundaryJump = Math.abs(firstSample - lastSample);
    const derivativeRms = localDerivativeRms(pcm, [
      [1, derivativeSamples],
      [sampleCount - derivativeSamples, sampleCount],
    ], channel, channels);
    const boundaryJumpRatio = boundaryJump / Math.max(derivativeRms, 1e-9);
    const edgeDelta = Math.abs(firstEdge.dbfs - lastEdge.dbfs);
    const seamReference = (firstCrossfade.dbfs + preSeam.dbfs) / 2;
    const seamEnergyDelta = seam.dbfs - seamReference;

    if (firstEdge.dbfs < settings.minimum_edge_rms_dbfs || lastEdge.dbfs < settings.minimum_edge_rms_dbfs) {
      fail(`${path}: channel ${channel + 1} loop edge is near-silent (${firstEdge.dbfs.toFixed(2)} / ${lastEdge.dbfs.toFixed(2)} dBFS)`);
    }
    if (edgeDelta > settings.maximum_edge_rms_delta_db) {
      fail(`${path}: channel ${channel + 1} first/last loop-edge energy differs by ${edgeDelta.toFixed(2)} dB`);
    }
    if (seamEnergyDelta < settings.minimum_seam_energy_delta_db) {
      fail(`${path}: channel ${channel + 1} crossfade seam drops ${Math.abs(seamEnergyDelta).toFixed(2)} dB below adjacent material`);
    }
    if (seamEnergyDelta > settings.maximum_seam_energy_delta_db) {
      fail(`${path}: channel ${channel + 1} crossfade seam swells ${seamEnergyDelta.toFixed(2)} dB above adjacent material`);
    }
    if (boundaryJump > settings.maximum_boundary_jump
      || boundaryJumpRatio > settings.maximum_boundary_jump_ratio) {
      fail(
        `${path}: channel ${channel + 1} loop boundary jump ${boundaryJump.toFixed(6)} is `
        + `${boundaryJumpRatio.toFixed(2)}x local sample motion`,
      );
    }
    channelStats.push({
      channel: channel + 1,
      first_edge_rms_dbfs: fixed(firstEdge.dbfs, 2),
      last_edge_rms_dbfs: fixed(lastEdge.dbfs, 2),
      edge_rms_delta_db: fixed(edgeDelta, 2),
      seam_rms_dbfs: fixed(seam.dbfs, 2),
      seam_energy_delta_db: fixed(seamEnergyDelta, 2),
      boundary_jump: fixed(boundaryJump, 6),
      boundary_jump_ratio: fixed(boundaryJumpRatio, 2),
    });
  }
  const seamDeltas = channelStats.map((entry) => entry.seam_energy_delta_db);
  return {
    decoded_duration_seconds: fixed(decodedDuration),
    first_edge_rms_dbfs: Math.min(...channelStats.map((entry) => entry.first_edge_rms_dbfs)),
    last_edge_rms_dbfs: Math.min(...channelStats.map((entry) => entry.last_edge_rms_dbfs)),
    edge_rms_delta_db: Math.max(...channelStats.map((entry) => entry.edge_rms_delta_db)),
    seam_rms_dbfs: Math.max(...channelStats.map((entry) => entry.seam_rms_dbfs)),
    seam_energy_delta_db: fixed(seamDeltas.reduce((sum, value) => sum + value, 0) / channels, 2),
    minimum_seam_energy_delta_db: Math.min(...seamDeltas),
    maximum_seam_energy_delta_db: Math.max(...seamDeltas),
    boundary_jump: Math.max(...channelStats.map((entry) => entry.boundary_jump)),
    boundary_jump_ratio: Math.max(...channelStats.map((entry) => entry.boundary_jump_ratio)),
    channels: channelStats,
  };
}

function loopFilter(plan, settings) {
  const end = plan.source_window_seconds;
  const crossfade = settings.crossfade_seconds;
  const tailStart = fixed(end - crossfade);
  const tempo = plan.tempo_factor;
  const tempoFilter = Math.abs(tempo - 1) < 1e-9 ? 'anull' : `atempo=${tempo}`;
  return [
    `[0:a:0]atrim=start=0:end=${end},asetpts=PTS-STARTPTS,aresample=${settings.sample_rate_hz},aformat=sample_fmts=fltp:channel_layouts=stereo[src]`,
    '[src]asplit=3[headsrc][midsrc][tailsrc]',
    `[headsrc]atrim=start=0:end=${crossfade},asetpts=PTS-STARTPTS[head]`,
    `[midsrc]atrim=start=${crossfade}:end=${tailStart},asetpts=PTS-STARTPTS[mid]`,
    `[tailsrc]atrim=start=${tailStart}:end=${end},asetpts=PTS-STARTPTS[tail]`,
    `[tail][head]acrossfade=d=${crossfade}:c1=${settings.crossfade_curve}:c2=${settings.crossfade_curve}[seam]`,
    `[mid][seam]concat=n=2:v=0:a=1,${tempoFilter}[loop]`,
  ].join(';');
}

export function renderLoopedCandidate(inputPath, outputPath, workDirectory, settings = DEFAULT_RENDER_SETTINGS) {
  if (existsSync(outputPath)) fail(`refusing to overwrite ${outputPath}`);
  mkdirSync(workDirectory, { recursive: true });
  const sourceMedia = probeAudio(inputPath, { decode: true });
  if (sourceMedia.codec !== 'mp3') fail(`${inputPath}: selected Suno candidate must use the MP3 codec`);
  const plan = planRenderDurations(sourceMedia.duration_seconds, settings);
  const loopPath = resolve(workDirectory, 'loop.wav');
  command('ffmpeg', [
    '-nostdin', '-hide_banner', '-v', 'error', '-xerror', '-threads', '1',
    '-i', inputPath,
    '-filter_complex', loopFilter(plan, settings),
    '-map', '[loop]', '-vn', '-c:a', 'pcm_f32le',
    '-ar', String(settings.sample_rate_hz), '-ac', String(settings.channels),
    loopPath,
  ]);
  const measured = analyseLoudness(loopPath, settings);
  const normaliseFilter = [
    `loudnorm=I=${settings.integrated_loudness_lufs}`,
    `TP=${settings.true_peak_dbtp}`,
    `LRA=${settings.loudness_range_lu}`,
    `measured_I=${measured.input_i}`,
    `measured_TP=${measured.input_tp}`,
    `measured_LRA=${measured.input_lra}`,
    `measured_thresh=${measured.input_thresh}`,
    `offset=${measured.target_offset}`,
    'linear=true',
    'print_format=summary',
  ].join(':');
  command('ffmpeg', [
    '-nostdin', '-hide_banner', '-v', 'error', '-xerror', '-threads', '1',
    '-i', loopPath, '-map', '0:a:0', '-vn', '-af', normaliseFilter,
    '-map_metadata', '-1', '-fflags', '+bitexact', '-flags:a', '+bitexact',
    '-c:a', 'libmp3lame', '-b:a', `${settings.bitrate_kbps}k`,
    '-ar', String(settings.sample_rate_hz), '-ac', String(settings.channels),
    '-write_id3v1', '0', '-id3v2_version', '0', '-write_xing', '1',
    outputPath,
  ]);
  rmSync(loopPath, { force: true });

  const outputMedia = probeAudio(outputPath, { decode: true });
  const outputLoudness = analyseLoudness(outputPath, settings);
  validateRenderedMedia(outputPath, outputMedia, outputLoudness, settings);
  const loopSeam = analyseLoopSeam(outputPath, outputMedia, settings);
  return {
    source_media: {
      ...sourceMedia,
      duration_seconds: fixed(sourceMedia.duration_seconds),
    },
    render_plan: plan,
    output_media: {
      ...outputMedia,
      duration_seconds: fixed(outputMedia.duration_seconds),
      integrated_loudness_lufs: fixed(outputLoudness.input_i, 2),
      true_peak_dbtp: fixed(outputLoudness.input_tp, 2),
    },
    loop_seam: loopSeam,
  };
}

function validateRenderedMedia(label, media, loudness, settings = DEFAULT_RENDER_SETTINGS) {
  if (media.codec !== 'mp3') fail(`${label}: output codec must be MP3`);
  if (media.sample_rate_hz !== settings.sample_rate_hz) {
    fail(`${label}: output sample rate must be ${settings.sample_rate_hz} Hz`);
  }
  if (media.channels !== settings.channels) fail(`${label}: output must be stereo`);
  if (media.duration_seconds < settings.minimum_duration_seconds - DURATION_TOLERANCE_SECONDS
    || media.duration_seconds > settings.maximum_duration_seconds + DURATION_TOLERANCE_SECONDS) {
    fail(`${label}: output duration ${media.duration_seconds.toFixed(3)}s is outside ${settings.minimum_duration_seconds}-${settings.maximum_duration_seconds}s`);
  }
  if (Math.abs(loudness.input_i - settings.integrated_loudness_lufs) > LOUDNESS_TOLERANCE_LU) {
    fail(`${label}: integrated loudness ${loudness.input_i.toFixed(2)} LUFS misses target ${settings.integrated_loudness_lufs} LUFS`);
  }
  if (loudness.input_tp > settings.true_peak_dbtp + TRUE_PEAK_TOLERANCE_DB) {
    fail(`${label}: true peak ${loudness.input_tp.toFixed(2)} dBTP exceeds headroom limit`);
  }
}

function ensureSelectedCandidates(candidateDirectory, selection) {
  if (!existsSync(candidateDirectory) || !lstatSync(candidateDirectory).isDirectory()) {
    fail(`candidate directory does not exist: ${candidateDirectory}`);
  }
  const root = realpathSync(candidateDirectory);
  const catalogueIds = new Set(MUSIC_CATALOG.map((row) => row.id));
  for (const filename of readdirSync(root).filter((entry) => entry.toLowerCase().endsWith('.mp3'))) {
    const parsed = parseCandidateFilename(filename);
    if (!catalogueIds.has(parsed.cue)) fail(`${filename}: candidate names unknown cue ${parsed.cue}`);
  }
  const candidates = {};
  for (const row of MUSIC_CATALOG) {
    const selected = selection.items[row.id];
    const path = resolve(root, selected.file);
    if (!path.startsWith(`${root}${sep}`)) fail(`${selected.file}: candidate escapes its directory`);
    if (!existsSync(path)) fail(`${selected.file}: selected candidate does not exist`);
    const stat = lstatSync(path);
    if (!stat.isFile() || stat.isSymbolicLink()) fail(`${selected.file}: selected candidate must be a regular, non-symlink file`);
    const media = probeAudio(path, { decode: true });
    if (media.codec !== 'mp3') fail(`${selected.file}: selected candidate must use the MP3 codec`);
    const plan = planRenderDurations(media.duration_seconds);
    candidates[row.id] = {
      path,
      sha256: sha256File(path),
      media,
      plan,
    };
  }
  return candidates;
}

function provenanceSeed(version, selection, selectionSha256) {
  return {
    schema_version: 1,
    pack_id: version,
    kind: 'music',
    source: 'docs/music-ledger.md',
    selection_sha256: selectionSha256,
    provenance: selection.provenance,
    renderer: {
      tool: 'tools/render-suno-music-pack.mjs',
      ...DEFAULT_RENDER_SETTINGS,
      loop_method: 'middle followed by a quadratic tail-to-head crossfade; the end returns to the rotated start',
    },
    items: {},
  };
}

function verifyProvenance(actual, expected, candidates) {
  if (!actual || typeof actual !== 'object' || Array.isArray(actual)) fail(`${PROVENANCE_FILE}: expected a JSON object`);
  for (const key of ['schema_version', 'pack_id', 'kind', 'source', 'selection_sha256']) {
    if (actual[key] !== expected[key]) fail(`${PROVENANCE_FILE}.${key} does not match the selection/render contract`);
  }
  if (JSON.stringify(actual.provenance) !== JSON.stringify(expected.provenance)) {
    fail(`${PROVENANCE_FILE}.provenance does not match the selection`);
  }
  if (JSON.stringify(actual.renderer) !== JSON.stringify(expected.renderer)) {
    fail(`${PROVENANCE_FILE}.renderer does not match this renderer version`);
  }
  for (const row of MUSIC_CATALOG) {
    const item = actual.items?.[row.id];
    const selected = expected.items[row.id];
    if (!item || typeof item !== 'object') fail(`${PROVENANCE_FILE}.items.${row.id} is missing`);
    for (const key of ['file', 'candidate_file', 'candidate_sha256', 'selected_variant', 'source_id', 'source_url']) {
      if (item[key] !== selected[key]) fail(`${PROVENANCE_FILE}.items.${row.id}.${key} does not match`);
    }
    if (item.candidate_sha256 !== candidates[row.id].sha256) {
      fail(`${PROVENANCE_FILE}.items.${row.id}.candidate_sha256 no longer matches the selected candidate`);
    }
  }
  const actualIds = Object.keys(actual.items ?? {});
  const expectedIds = MUSIC_CATALOG.map((row) => row.id);
  if (actualIds.length !== expectedIds.length || actualIds.some((id) => !expectedIds.includes(id))) {
    fail(`${PROVENANCE_FILE}.items must contain exactly the ${EXPECTED_CUE_COUNT} catalogue cues`);
  }
}

function expectedProvenanceItems(selection, candidates) {
  const items = {};
  for (const row of MUSIC_CATALOG) {
    const selected = selection.items[row.id];
    items[row.id] = {
      file: canonicalAudioFilename('music', row.id),
      candidate_file: selected.file,
      candidate_sha256: candidates[row.id].sha256,
      selected_variant: selected.selected_variant,
      source_id: selected.source_id,
      source_url: selected.source_url,
    };
  }
  return items;
}

function verifyRenderedPack(outputDirectory, selection, candidates, selectionSha256) {
  if (!existsSync(outputDirectory) || !lstatSync(outputDirectory).isDirectory()) {
    fail(`rendered pack does not exist: ${outputDirectory}`);
  }
  const expectedFiles = MUSIC_CATALOG.map((row) => canonicalAudioFilename('music', row.id)).sort();
  const actualFiles = readdirSync(outputDirectory).filter((file) => file.toLowerCase().endsWith('.mp3')).sort();
  const missing = expectedFiles.filter((file) => !actualFiles.includes(file));
  const extra = actualFiles.filter((file) => !expectedFiles.includes(file));
  if (missing.length) fail(`rendered pack is missing: ${missing.join(', ')}`);
  if (extra.length) fail(`rendered pack has unexpected MP3s: ${extra.join(', ')}`);

  const expected = provenanceSeed(selection.pack_id, selection, selectionSha256);
  expected.items = expectedProvenanceItems(selection, candidates);
  const provenancePath = resolve(outputDirectory, PROVENANCE_FILE);
  if (!existsSync(provenancePath)) fail(`${PROVENANCE_FILE} is missing`);
  let actual;
  try {
    actual = JSON.parse(readFileSync(provenancePath, 'utf8'));
  } catch (error) {
    fail(`${PROVENANCE_FILE} is not valid JSON: ${error.message}`);
  }
  verifyProvenance(actual, expected, candidates);

  for (const row of MUSIC_CATALOG) {
    const item = actual.items[row.id];
    const path = resolve(outputDirectory, item.file);
    const media = probeAudio(path, { decode: true });
    const loudness = analyseLoudness(path, DEFAULT_RENDER_SETTINGS);
    validateRenderedMedia(item.file, media, loudness);
    analyseLoopSeam(path, media, DEFAULT_RENDER_SETTINGS);
    if (item.sha256 !== sha256File(path)) fail(`${PROVENANCE_FILE}.items.${row.id}.sha256 does not match output`);
    if (Number(item.bytes) !== statSync(path).size) fail(`${PROVENANCE_FILE}.items.${row.id}.bytes does not match output`);
  }
}

function renderPack(outputDirectory, selection, candidates, selectionSha256) {
  if (existsSync(outputDirectory)) fail(`refusing to overwrite existing pack ${outputDirectory}`);
  mkdirSync(dirname(outputDirectory), { recursive: true });
  const staging = mkdtempSync(resolve(dirname(outputDirectory), `.${selection.pack_id}.render-`));
  try {
    const provenance = provenanceSeed(selection.pack_id, selection, selectionSha256);
    for (const row of MUSIC_CATALOG) {
      const selected = selection.items[row.id];
      const candidate = candidates[row.id];
      const filename = canonicalAudioFilename('music', row.id);
      const outputPath = resolve(staging, filename);
      const work = resolve(staging, `.work-${row.id}`);
      const result = renderLoopedCandidate(candidate.path, outputPath, work);
      rmSync(work, { recursive: true, force: true });
      if (sha256File(candidate.path) !== candidate.sha256) {
        fail(`${selected.file}: candidate changed while the pack was rendering`);
      }
      provenance.items[row.id] = {
        file: filename,
        bytes: statSync(outputPath).size,
        sha256: sha256File(outputPath),
        candidate_file: selected.file,
        candidate_sha256: candidate.sha256,
        selected_variant: selected.selected_variant,
        source_id: selected.source_id,
        source_url: selected.source_url,
        ...result,
      };
    }
    writeFileSync(resolve(staging, PROVENANCE_FILE), `${JSON.stringify(provenance, null, 2)}\n`);
    if (existsSync(outputDirectory)) fail(`refusing to overwrite existing pack ${outputDirectory}`);
    renameSync(staging, outputDirectory);
  } catch (error) {
    rmSync(staging, { recursive: true, force: true });
    throw error;
  }
}

function parseArgs(argv) {
  const options = { candidates: null, selection: null, version: null, dryRun: false, check: false };
  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (arg === '--candidates') options.candidates = argv[++index];
    else if (arg === '--selection') options.selection = argv[++index];
    else if (arg === '--version') options.version = argv[++index];
    else if (arg === '--dry-run') options.dryRun = true;
    else if (arg === '--check') options.check = true;
    else if (arg === '--help' || arg === '-h') options.help = true;
    else fail(`unknown argument ${JSON.stringify(arg)}`);
    if (['--candidates', '--selection', '--version'].includes(arg) && !argv[index]) fail(`${arg} requires a value`);
  }
  if (options.help) return options;
  if (!options.candidates || !options.selection || !options.version) {
    fail('--candidates, --selection, and --version are required');
  }
  if (!VERSION_RE.test(options.version)) fail('--version must use lower-case letters, digits, and hyphens');
  if (options.version === BASE_AUDIO_VERSIONS.music) fail(`${BASE_AUDIO_VERSIONS.music} is immutable`);
  if (options.dryRun && options.check) fail('--dry-run and --check are mutually exclusive');
  return options;
}

function printUsage() {
  process.stdout.write(`Usage:
  node tools/render-suno-music-pack.mjs \\
    --candidates <directory> \\
    --selection <selection.json> \\
    --version <pack-id> [--dry-run|--check]

Candidate names must be <cue>--<variant>--<suno-id>.mp3. The selection file
must be schema version 1 with exact catalogue keys under items. Rendering writes
an atomic 22-cue pack to src/assets/musics/<pack-id>/ and never overwrites an
existing directory or the immutable stained-glass-v1 pack.

Every render excludes at least the source's final four seconds before making a
three-second quadratic tail-to-head loop seam. It then applies two-pass EBU
R128 normalisation (-20 LUFS, -3 dBTP) and emits stereo 48 kHz / 192 kbps MP3.
Near-silent or energy-mismatched edges and discontinuous seams fail closed.

Selection shape:
  {
    "schema_version": 1,
    "pack_id": "stained-glass-v2",
    "provenance": {
      "provider": "Suno",
      "generated_at": null,
      "licence_or_plan": null,
      "notes": null
    },
    "items": {
      "title": {
        "file": "title--a--<suno-id>.mp3",
        "source_url": "https://suno.com/song/<suno-id>"
      }
    }
  }

--dry-run fully decodes and validates all selected sources without writing.
--check validates an existing pack, its loudness/media contract, hashes, and
render-provenance.json against the same candidates and selection file.
`);
}

function main() {
  const options = parseArgs(process.argv.slice(2));
  if (options.help) {
    printUsage();
    return;
  }
  requireAudioTools();
  const selectionPath = resolve(options.selection);
  let selectionText;
  let mapping;
  try {
    selectionText = readFileSync(selectionPath, 'utf8');
    mapping = JSON.parse(selectionText);
  } catch (error) {
    fail(`cannot read selection JSON: ${error.message}`);
  }
  const selection = normaliseSelection(mapping, options.version);
  const selectionSha256 = sha256Text(selectionText);
  const candidateDirectory = resolve(options.candidates);
  const candidates = ensureSelectedCandidates(candidateDirectory, selection);
  const outputDirectory = resolve(MUSIC_ROOT, options.version);

  if (options.dryRun) {
    if (existsSync(outputDirectory)) fail(`refusing to overwrite existing pack ${outputDirectory}`);
    process.stdout.write(`${JSON.stringify({
      ok: true,
      mode: 'dry-run',
      version: options.version,
      output_directory: outputDirectory,
      cue_count: MUSIC_CATALOG.length,
      items: Object.fromEntries(MUSIC_CATALOG.map((row) => [row.id, {
        candidate: selection.items[row.id].file,
        output: canonicalAudioFilename('music', row.id),
        ...candidates[row.id].plan,
      }])),
    }, null, 2)}\n`);
    return;
  }
  if (options.check) {
    verifyRenderedPack(outputDirectory, selection, candidates, selectionSha256);
    process.stdout.write(`PASS ${options.version}: ${EXPECTED_CUE_COUNT} deterministic Music renders verified\n`);
    return;
  }
  renderPack(outputDirectory, selection, candidates, selectionSha256);
  process.stdout.write(`${outputDirectory}\n`);
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  try {
    main();
  } catch (error) {
    process.stderr.write(`${error.message}\n`);
    process.exitCode = 1;
  }
}
