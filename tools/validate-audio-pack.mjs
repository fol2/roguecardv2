#!/usr/bin/env node

import { createHash } from 'node:crypto';
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { resolve } from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath, pathToFileURL } from 'node:url';

import { MUSIC_CATALOG, SFX_CATALOG } from '../src/audio-catalog.js';
import { BASE_AUDIO_VERSIONS, canonicalAudioFilename } from '../src/audio-packs.js';

const ROOT = resolve(fileURLToPath(new URL('..', import.meta.url)));
const VERSION_RE = /^[a-z0-9][a-z0-9-]*$/;
const CANONICAL_COUNTS = Object.freeze({ music: 22, sfx: 36 });
// Cross-ffmpeg-version MP3 duration-probe drift, measured up to ~46ms between
// the dev machine's ffmpeg 8.1.2 and CI's apt-installed build (gapless
// delay/padding decode differences). sha256 is the byte-exact integrity
// guarantee everywhere below; these only bound decoder noise, not content.
const MP3_FRAME_TOLERANCE_SECONDS = 0.05;
const MUSIC_BOUND_TOLERANCE_SECONDS = 0.05;
const DURATION_PROBE_TOLERANCE_SECONDS = 0.1;
const ISO_DATE_TIME_RE = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{1,3})?(?:Z|[+-]\d{2}:\d{2})$/;
const SHA256_RE = /^[a-f0-9]{64}$/i;
const RENDER_PROVENANCE_FILE = 'render-provenance.json';

function usage(message) {
  if (message) console.error(`error: ${message}\n`);
  console.error(`Usage:
  node tools/validate-audio-pack.mjs --kind <music|sfx> --version <pack-id> [options]

Options:
  --json                    Print the machine-readable validation report
  --manifest-seed           Print a schema-v2 provenance manifest seed
  --verify-manifest [path]  Verify a manifest (defaults to <pack>/manifest.json;
                            use - to read it from stdin)
  --help                    Show this help

The validator never writes files. New music packs must contain exactly the 22
canonical 90-120 second cues. New SFX packs must contain exactly the 36
canonical files and meet the ledger's authored target durations.`);
  process.exit(message ? 2 : 0);
}

function parseArgs(argv) {
  const args = { kind: null, version: null, json: false, manifestSeed: false, verifyManifest: null };
  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === '--help' || arg === '-h') usage();
    if (arg === '--kind') args.kind = argv[++i];
    else if (arg === '--version') args.version = argv[++i];
    else if (arg === '--json') args.json = true;
    else if (arg === '--manifest-seed') args.manifestSeed = true;
    else if (arg === '--verify-manifest') {
      const next = argv[i + 1];
      if (next && (!next.startsWith('-') || next === '-')) {
        args.verifyManifest = next;
        i += 1;
      } else {
        args.verifyManifest = true;
      }
    } else if (!['--kind', '--version'].includes(arg)) {
      usage(`unknown argument ${arg}`);
    }
  }
  if (!['music', 'sfx'].includes(args.kind)) usage('--kind must be music or sfx');
  if (!args.version || !VERSION_RE.test(args.version)) {
    usage('--version must use lower-case letters, digits, and hyphens');
  }
  const outputModes = [args.json, args.manifestSeed].filter(Boolean).length;
  if (outputModes > 1) usage('--json and --manifest-seed are mutually exclusive');
  if (args.manifestSeed && args.verifyManifest) {
    usage('--manifest-seed and --verify-manifest are separate operations');
  }
  return args;
}

function packDirectory(kind, version) {
  const root = resolve(ROOT, kind === 'music' ? 'src/assets/musics' : 'src/assets/sfx');
  return version === BASE_AUDIO_VERSIONS[kind] ? root : resolve(root, version);
}

function expectedRows(kind) {
  return kind === 'music' ? MUSIC_CATALOG : SFX_CATALOG;
}

function parseSfxLedger() {
  const text = readFileSync(resolve(ROOT, 'docs/sfx-ledger.md'), 'utf8');
  const rows = new Map();
  const errors = [];
  const suffix = text.match(/Global suffix to keep in every prompt:\s*\n\s*>\s*(.+)$/m)?.[1]?.trim();
  if (!suffix) errors.push('SFX ledger is missing its global request-prompt suffix');
  for (const line of text.split(/\r?\n/)) {
    if (!line.startsWith('|')) continue;
    const cells = line.slice(1, line.endsWith('|') ? -1 : undefined).split('|').map((cell) => cell.trim());
    if (cells.length !== 6) continue;
    const idMatch = cells[0].match(/^`([A-Za-z][A-Za-z0-9]*)`$/);
    if (!idMatch) continue;
    const targetNumbers = [...cells[2].matchAll(/[0-9]+(?:\.[0-9]+)?/g)].map((match) => Number(match[0]));
    const requested = Number(cells[3]);
    const influence = Number(cells[4]);
    const id = idMatch[1];
    if (rows.has(id)) {
      errors.push(`SFX ledger contains duplicate id ${id}`);
      continue;
    }
    if (!targetNumbers.length || !targetNumbers.every(Number.isFinite)) {
      errors.push(`SFX ledger ${id} has no valid target duration`);
      continue;
    }
    const target = [targetNumbers[0], targetNumbers.at(-1)];
    if (target[0] <= 0 || target[1] < target[0]) {
      errors.push(`SFX ledger ${id} has invalid target range ${cells[2]}`);
    }
    if (!Number.isFinite(requested) || requested < 0.5 || requested > 30) {
      errors.push(`SFX ledger ${id} request duration must be 0.5-30 seconds`);
    }
    if (!Number.isFinite(influence) || influence < 0 || influence > 1) {
      errors.push(`SFX ledger ${id} prompt influence must be 0-1`);
    }
    if (!cells[1] || !cells[5]) errors.push(`SFX ledger ${id} is missing usage or prompt text`);
    const ledgerPrompt = cells[5].replace(/^`|`$/g, '');
    const positivePrompt = ledgerPrompt.replace(/\s+No voice,.*$/s, '').trimEnd();
    const requestPrompt = suffix ? `${positivePrompt} ${suffix}` : null;
    if (requestPrompt && requestPrompt.length > 450) {
      errors.push(`SFX ledger ${id} composes to ${requestPrompt.length} request characters; maximum is 450`);
    }
    rows.set(id, {
      usage: cells[1],
      target,
      requested,
      influence,
      ledgerPrompt,
      requestPrompt,
    });
  }
  return { rows, errors };
}

function sha256(path) {
  return createHash('sha256').update(readFileSync(path)).digest('hex');
}

function requireTool(tool) {
  const result = spawnSync(tool, ['-version'], { encoding: 'utf8' });
  if (result.error?.code === 'ENOENT') return `${tool} is required but was not found on PATH`;
  if (result.status !== 0) return `${tool} -version failed with exit ${result.status}`;
  return null;
}

function probe(path) {
  const result = spawnSync('ffprobe', [
    '-v', 'error',
    '-show_entries', 'format=duration:stream=codec_type,codec_name,sample_rate,channels',
    '-of', 'json',
    path,
  ], { encoding: 'utf8', maxBuffer: 2 * 1024 * 1024 });
  if (result.status !== 0) {
    return { error: `ffprobe failed: ${(result.stderr || '').trim() || `exit ${result.status}`}` };
  }
  let data;
  try {
    data = JSON.parse(result.stdout);
  } catch {
    return { error: 'ffprobe returned invalid JSON' };
  }
  const stream = data.streams?.find((entry) => entry.codec_type === 'audio');
  const duration = Number(data.format?.duration);
  if (!stream || !Number.isFinite(duration) || duration <= 0) {
    return { error: 'no positive-duration audio stream found' };
  }
  const decode = spawnSync('ffmpeg', [
    '-v', 'error', '-xerror', '-i', path, '-map', '0:a:0', '-f', 'null', '-',
  ], { encoding: 'utf8', maxBuffer: 2 * 1024 * 1024 });
  if (decode.status !== 0) {
    return { error: `full decode failed: ${(decode.stderr || '').trim() || `exit ${decode.status}`}` };
  }
  return {
    duration_seconds: duration,
    codec: stream.codec_name,
    sample_rate_hz: Number(stream.sample_rate),
    channels: Number(stream.channels),
  };
}

function closeEnough(actual, expected, tolerance = 0.002) {
  return Number.isFinite(actual) && Math.abs(actual - expected) <= tolerance;
}

function nonEmptyString(value) {
  return typeof value === 'string' && value.trim().length > 0;
}

function validateSunoSourceUrl(value, sourceId, prefix, report) {
  if (value == null) return;
  if (!nonEmptyString(value)) {
    report.errors.push(`${prefix}: expected an HTTP(S) Suno URL or null`);
    return;
  }
  let source;
  try {
    source = new URL(value);
  } catch {
    report.errors.push(`${prefix}: expected an HTTP(S) Suno URL or null`);
    return;
  }
  if (!['http:', 'https:'].includes(source.protocol)) {
    report.errors.push(`${prefix}: expected an HTTP(S) Suno URL or null`);
    return;
  }
  const host = source.hostname.toLowerCase();
  const isSunoHost = host === 'suno.com'
    || host.endsWith('.suno.com')
    || host === 'suno.ai'
    || host.endsWith('.suno.ai');
  if (!isSunoHost) {
    report.errors.push(`${prefix}: expected a suno.com or suno.ai host`);
    return;
  }
  const segments = source.pathname.split('/').filter(Boolean);
  let urlSourceId = segments.at(-1) ?? '';
  if (urlSourceId.toLowerCase().endsWith('.mp3')) urlSourceId = urlSourceId.slice(0, -4);
  try {
    urlSourceId = decodeURIComponent(urlSourceId);
  } catch {
    report.errors.push(`${prefix}: contains an invalid encoded path`);
    return;
  }
  if (!nonEmptyString(sourceId) || urlSourceId !== sourceId) {
    report.errors.push(`${prefix}: URL source id must match source_id`);
  }
}

export function validateMusicRenderProvenance(renderProvenance, context, report) {
  const { version, expected, mediaById } = context;
  const prefix = RENDER_PROVENANCE_FILE;
  if (!renderProvenance || typeof renderProvenance !== 'object' || Array.isArray(renderProvenance)) {
    report.errors.push(`${prefix}: expected a JSON object`);
    return false;
  }
  if (renderProvenance.schema_version !== 1) report.errors.push(`${prefix}.schema_version: expected 1`);
  if (renderProvenance.pack_id !== version) report.errors.push(`${prefix}.pack_id: expected ${version}`);
  if (renderProvenance.kind !== 'music') report.errors.push(`${prefix}.kind: expected music`);
  if (!SHA256_RE.test(renderProvenance.selection_sha256 ?? '')) {
    report.errors.push(`${prefix}.selection_sha256: expected a SHA-256 hex digest`);
  }
  if (!renderProvenance.provenance
    || typeof renderProvenance.provenance !== 'object'
    || Array.isArray(renderProvenance.provenance)) {
    report.errors.push(`${prefix}.provenance: expected an object`);
  }
  if (renderProvenance.provenance?.provider !== 'Suno') {
    report.errors.push(`${prefix}.provenance.provider: expected Suno`);
  }
  if (!nonEmptyString(renderProvenance.provenance?.licence_or_plan)) {
    report.errors.push(`${prefix}.provenance.licence_or_plan: expected a populated value`);
  }
  if (!renderProvenance.items || typeof renderProvenance.items !== 'object' || Array.isArray(renderProvenance.items)) {
    report.errors.push(`${prefix}.items: expected an object`);
    return false;
  }

  const expectedIds = expected.map((row) => row.id).sort();
  const provenanceIds = Object.keys(renderProvenance.items).sort();
  const missing = expectedIds.filter((id) => !provenanceIds.includes(id));
  const extra = provenanceIds.filter((id) => !expectedIds.includes(id));
  if (missing.length) report.errors.push(`${prefix}.items: missing ids: ${missing.join(', ')}`);
  if (extra.length) report.errors.push(`${prefix}.items: unknown ids: ${extra.join(', ')}`);

  const seenSourceIds = new Set();
  for (const row of expected) {
    const item = renderProvenance.items[row.id];
    const media = mediaById.get(row.id);
    const itemPrefix = `${prefix}.items.${row.id}`;
    if (!item || typeof item !== 'object' || Array.isArray(item)) {
      report.errors.push(`${itemPrefix}: expected an object`);
      continue;
    }
    if (!media) continue;
    const filename = canonicalAudioFilename('music', row.id);
    if (item.file !== filename) report.errors.push(`${itemPrefix}.file: expected ${filename}`);
    if (item.bytes !== media.bytes) report.errors.push(`${itemPrefix}.bytes: expected ${media.bytes}`);
    if (!SHA256_RE.test(item.sha256 ?? '')) {
      report.errors.push(`${itemPrefix}.sha256: expected a SHA-256 hex digest`);
    }
    if (item.sha256 !== media.sha256) report.errors.push(`${itemPrefix}.sha256: does not match output file`);
    if (!SHA256_RE.test(item.candidate_sha256 ?? '')) {
      report.errors.push(`${itemPrefix}.candidate_sha256: expected a SHA-256 hex digest`);
    }
    if (!nonEmptyString(item.source_id)) {
      report.errors.push(`${itemPrefix}.source_id: expected a populated Suno source id`);
    } else if (seenSourceIds.has(item.source_id)) {
      report.errors.push(`${itemPrefix}.source_id: duplicate Suno source id ${item.source_id}`);
    } else {
      seenSourceIds.add(item.source_id);
    }
    if (!nonEmptyString(item.selected_variant)) {
      report.errors.push(`${itemPrefix}.selected_variant: expected a populated value`);
    }
    validateSunoSourceUrl(item.source_url, item.source_id, `${itemPrefix}.source_url`, report);
  }
  return true;
}

function validateManifest(manifest, context, report) {
  const {
    kind,
    version,
    expected,
    mediaById,
    sfxLedger,
    renderProvenance,
  } = context;
  if (!manifest || typeof manifest !== 'object' || Array.isArray(manifest)) {
    report.errors.push('manifest: expected a JSON object');
    return;
  }
  if (manifest.schema_version !== 2) report.errors.push('manifest.schema_version: expected 2');
  if (manifest.pack_id !== version) report.errors.push(`manifest.pack_id: expected ${version}`);
  if (manifest.kind !== kind) report.errors.push(`manifest.kind: expected ${kind}`);
  const expectedProvider = kind === 'music' ? 'Suno' : 'ElevenLabs';
  const expectedTheme = kind === 'music' ? 'Classical gothic stained-glass chamber music' : 'Ashglass Vigil';
  const expectedSource = kind === 'music' ? 'docs/music-ledger.md' : 'docs/sfx-ledger.md';
  if (manifest.theme !== expectedTheme) report.errors.push(`manifest.theme: expected ${expectedTheme}`);
  if (manifest.source !== expectedSource) report.errors.push(`manifest.source: expected ${expectedSource}`);
  if (!manifest.provenance || typeof manifest.provenance !== 'object' || Array.isArray(manifest.provenance)) {
    report.errors.push('manifest.provenance: expected an object');
  }
  if (manifest.provenance?.provider !== expectedProvider) {
    report.errors.push(`manifest.provenance.provider: expected ${expectedProvider}`);
  }
  for (const key of ['generated_at', 'licence_or_plan', 'notes']) {
    if (!Object.hasOwn(manifest.provenance ?? {}, key)) report.errors.push(`manifest.provenance.${key}: missing`);
  }
  if (!nonEmptyString(manifest.provenance?.generated_at)
    || !ISO_DATE_TIME_RE.test(manifest.provenance.generated_at)
    || Number.isNaN(Date.parse(manifest.provenance.generated_at))) {
    report.errors.push('manifest.provenance.generated_at: expected a populated ISO date-time');
  }
  if (!nonEmptyString(manifest.provenance?.licence_or_plan)) {
    report.errors.push('manifest.provenance.licence_or_plan: expected a populated value');
  }
  if (manifest.provenance?.notes != null && typeof manifest.provenance.notes !== 'string') {
    report.errors.push('manifest.provenance.notes: expected a string or null');
  }
  if (!manifest.items || typeof manifest.items !== 'object' || Array.isArray(manifest.items)) {
    report.errors.push('manifest.items: expected an object');
    return;
  }
  const manifestIds = Object.keys(manifest.items).sort();
  const expectedIds = expected.map((row) => row.id).sort();
  const missing = expectedIds.filter((id) => !manifestIds.includes(id));
  const extra = manifestIds.filter((id) => !expectedIds.includes(id));
  if (missing.length) report.errors.push(`manifest.items: missing ids: ${missing.join(', ')}`);
  if (extra.length) report.errors.push(`manifest.items: unknown ids: ${extra.join(', ')}`);

  const itemsWithoutStableSource = [];
  for (const row of expected) {
    const item = manifest.items[row.id];
    const media = mediaById.get(row.id);
    const prefix = `manifest.items.${row.id}`;
    if (!item || typeof item !== 'object' || Array.isArray(item)) {
      report.errors.push(`${prefix}: expected an object`);
      continue;
    }
    if (!media) continue;
    const filename = canonicalAudioFilename(kind, row.id);
    if (item.file !== filename) report.errors.push(`${prefix}.file: expected ${filename}`);
    if (item.bytes !== media.bytes) report.errors.push(`${prefix}.bytes: expected ${media.bytes}`);
    if (item.sha256 !== media.sha256) report.errors.push(`${prefix}.sha256: does not match file`);
    // sha256 above is the byte-exact integrity guarantee; ffprobe's MP3 duration
    // estimate itself varies by ~1 frame across ffmpeg builds/versions (gapless
    // delay/padding heuristics), so this check only needs frame-level tolerance.
    if (!closeEnough(Number(item.duration_seconds), media.duration_seconds, DURATION_PROBE_TOLERANCE_SECONDS)) {
      report.errors.push(`${prefix}.duration_seconds: expected ${media.duration_seconds.toFixed(6)}`);
    }
    if (item.codec !== media.codec) report.errors.push(`${prefix}.codec: expected ${media.codec}`);
    if (Number(item.sample_rate_hz) !== media.sample_rate_hz) {
      report.errors.push(`${prefix}.sample_rate_hz: expected ${media.sample_rate_hz}`);
    }
    if (Number(item.channels) !== media.channels) report.errors.push(`${prefix}.channels: expected ${media.channels}`);
    for (const key of ['source_id', 'source_url', 'selected_variant']) {
      if (!Object.hasOwn(item, key)) report.errors.push(`${prefix}.${key}: missing`);
      else if (item[key] != null && typeof item[key] !== 'string') {
        report.errors.push(`${prefix}.${key}: expected a string or null`);
      }
    }
    if (!nonEmptyString(item.selected_variant)) {
      report.errors.push(`${prefix}.selected_variant: expected the selected candidate label`);
    }
    if (!nonEmptyString(item.source_id) && !nonEmptyString(item.source_url)) itemsWithoutStableSource.push(row.id);
    if (nonEmptyString(item.source_url)) {
      try {
        const source = new URL(item.source_url);
        if (!['http:', 'https:'].includes(source.protocol)) throw new Error('bad protocol');
      } catch {
        report.errors.push(`${prefix}.source_url: expected an HTTP(S) URL or null`);
      }
    }
    if (kind === 'music') {
      if (item.title !== row.title) report.errors.push(`${prefix}.title: expected catalogue title`);
      if (item.use !== row.use) report.errors.push(`${prefix}.use: expected catalogue use`);
      if (item.wired !== row.wired) report.errors.push(`${prefix}.wired: expected ${row.wired}`);
    } else {
      const authored = sfxLedger.get(row.id);
      if (item.usage !== authored?.usage) report.errors.push(`${prefix}.usage: expected ledger usage`);
      if (JSON.stringify(item.target_after_trim_seconds) !== JSON.stringify(authored?.target)) {
        report.errors.push(`${prefix}.target_after_trim_seconds: expected ledger target`);
      }
      if (Number(item.requested_duration_seconds) !== authored?.requested) {
        report.errors.push(`${prefix}.requested_duration_seconds: expected ledger request`);
      }
      if (Number(item.prompt_influence) !== authored?.influence) {
        report.errors.push(`${prefix}.prompt_influence: expected ledger value`);
      }
      if (item.ledger_prompt !== authored?.ledgerPrompt) {
        report.errors.push(`${prefix}.ledger_prompt: expected exact ledger prompt`);
      }
      if (item.request_prompt !== authored?.requestPrompt) {
        report.errors.push(`${prefix}.request_prompt: expected exact ElevenLabs request prompt`);
      }
    }
  }
  if (itemsWithoutStableSource.length && !nonEmptyString(manifest.provenance?.notes)) {
    report.errors.push(
      `manifest provenance: ${itemsWithoutStableSource.length} item(s) have no source_id/source_url; `
      + 'provenance.notes must document why the provider supplied no stable source reference',
    );
  }

  if (kind === 'music' && renderProvenance !== undefined) {
    const canCrossCheck = validateMusicRenderProvenance(
      renderProvenance,
      { version, expected, mediaById },
      report,
    );
    if (!canCrossCheck) return;
    if (manifest.provenance?.provider !== renderProvenance.provenance?.provider) {
      report.errors.push('manifest.provenance.provider: must match render-provenance.json');
    }
    if (manifest.provenance?.licence_or_plan !== renderProvenance.provenance?.licence_or_plan) {
      report.errors.push('manifest.provenance.licence_or_plan: must match render-provenance.json');
    }
    for (const row of expected) {
      const manifestItem = manifest.items?.[row.id];
      const provenanceItem = renderProvenance.items?.[row.id];
      if (!manifestItem || !provenanceItem) continue;
      for (const key of ['source_id', 'source_url', 'selected_variant']) {
        if (manifestItem[key] !== provenanceItem[key]) {
          report.errors.push(`manifest.items.${row.id}.${key}: must match render-provenance.json`);
        }
      }
      for (const key of ['file', 'bytes', 'sha256']) {
        if (manifestItem[key] !== provenanceItem[key]) {
          report.errors.push(`manifest.items.${row.id}.${key}: must match render-provenance.json`);
        }
      }
    }
  }
}

function manifestSeed(context) {
  const { kind, version, expected, mediaById, sfxLedger } = context;
  const items = {};
  for (const row of expected) {
    const media = mediaById.get(row.id);
    const common = {
      file: canonicalAudioFilename(kind, row.id),
      bytes: media.bytes,
      sha256: media.sha256,
      duration_seconds: Number(media.duration_seconds.toFixed(6)),
      codec: media.codec,
      sample_rate_hz: media.sample_rate_hz,
      channels: media.channels,
      source_id: null,
      source_url: null,
      selected_variant: null,
    };
    if (kind === 'music') {
      items[row.id] = {
        ...common,
        title: row.title,
        wired: row.wired,
        use: row.use,
      };
    } else {
      const authored = sfxLedger.get(row.id);
      items[row.id] = {
        ...common,
        requested_duration_seconds: authored.requested,
        target_after_trim_seconds: authored.target,
        prompt_influence: authored.influence,
        ledger_prompt: authored.ledgerPrompt,
        request_prompt: authored.requestPrompt,
        usage: authored.usage,
      };
    }
  }
  return {
    schema_version: 2,
    pack_id: version,
    kind,
    theme: kind === 'music' ? 'Classical gothic stained-glass chamber music' : 'Ashglass Vigil',
    source: kind === 'music' ? 'docs/music-ledger.md' : 'docs/sfx-ledger.md',
    provenance: {
      provider: kind === 'music' ? 'Suno' : 'ElevenLabs',
      generated_at: null,
      licence_or_plan: null,
      notes: null,
    },
    items,
  };
}

function readManifest(option, directory) {
  const path = option === true ? resolve(directory, 'manifest.json') : option;
  if (path === '-') return { path: '<stdin>', data: JSON.parse(readFileSync(0, 'utf8')) };
  return { path: resolve(path), data: JSON.parse(readFileSync(resolve(path), 'utf8')) };
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  const directory = packDirectory(args.kind, args.version);
  const expected = expectedRows(args.kind);
  const expectedFiles = new Set(expected.map((row) => canonicalAudioFilename(args.kind, row.id)));
  const report = {
    ok: false,
    kind: args.kind,
    version: args.version,
    directory,
    expected_count: expected.length,
    actual_count: 0,
    errors: [],
    warnings: [],
    items: {},
  };

  for (const tool of ['ffprobe', 'ffmpeg']) {
    const error = requireTool(tool);
    if (error) report.errors.push(error);
  }
  if (expected.length !== CANONICAL_COUNTS[args.kind]) {
    report.errors.push(`${args.kind} catalogue has ${expected.length} ids; expected ${CANONICAL_COUNTS[args.kind]}`);
  }
  const expectedIds = expected.map((row) => row.id);
  if (new Set(expectedIds).size !== expectedIds.length) report.errors.push(`${args.kind} catalogue contains duplicate ids`);
  if (expectedFiles.size !== expected.length) report.errors.push(`${args.kind} catalogue contains duplicate canonical filenames`);
  let actualFiles = [];
  try {
    if (!statSync(directory).isDirectory()) report.errors.push(`pack path is not a directory: ${directory}`);
    else actualFiles = readdirSync(directory).filter((file) => file.toLowerCase().endsWith('.mp3')).sort();
  } catch (error) {
    report.errors.push(`cannot read pack directory ${directory}: ${error.message}`);
  }
  report.actual_count = actualFiles.length;
  const missingFiles = [...expectedFiles].filter((file) => !actualFiles.includes(file)).sort();
  const extraFiles = actualFiles.filter((file) => !expectedFiles.has(file));
  if (missingFiles.length) report.errors.push(`missing canonical files: ${missingFiles.join(', ')}`);
  if (extraFiles.length) report.errors.push(`unexpected MP3 files: ${extraFiles.join(', ')}`);

  const parsedSfxLedger = args.kind === 'sfx' ? parseSfxLedger() : { rows: new Map(), errors: [] };
  const sfxLedger = parsedSfxLedger.rows;
  report.errors.push(...parsedSfxLedger.errors);
  if (args.kind === 'sfx') {
    const catalogueIds = new Set(expected.map((row) => row.id));
    const missingLedger = [...catalogueIds].filter((id) => !sfxLedger.has(id)).sort();
    const extraLedger = [...sfxLedger.keys()].filter((id) => !catalogueIds.has(id)).sort();
    if (missingLedger.length) report.errors.push(`SFX ledger is missing catalogue ids: ${missingLedger.join(', ')}`);
    if (extraLedger.length) report.errors.push(`SFX ledger has unknown ids: ${extraLedger.join(', ')}`);
  }

  const mediaById = new Map();
  for (const row of expected) {
    const filename = canonicalAudioFilename(args.kind, row.id);
    if (!actualFiles.includes(filename)) continue;
    const path = resolve(directory, filename);
    const media = probe(path);
    if (media.error) {
      report.errors.push(`${filename}: ${media.error}`);
      report.items[row.id] = { file: filename, error: media.error };
      continue;
    }
    const info = {
      file: filename,
      bytes: statSync(path).size,
      sha256: sha256(path),
      ...media,
    };
    if (media.codec !== 'mp3') report.errors.push(`${filename}: expected MP3 codec, got ${media.codec}`);
    if (!Number.isInteger(media.sample_rate_hz) || media.sample_rate_hz <= 0) {
      report.errors.push(`${filename}: invalid sample rate ${media.sample_rate_hz}`);
    }
    if (![1, 2].includes(media.channels)) report.errors.push(`${filename}: expected mono or stereo, got ${media.channels}`);
    if (args.version !== BASE_AUDIO_VERSIONS[args.kind]) {
      if (args.kind === 'music') {
        if (media.duration_seconds < 90 - MUSIC_BOUND_TOLERANCE_SECONDS
          || media.duration_seconds > 120 + MUSIC_BOUND_TOLERANCE_SECONDS) {
          report.errors.push(`${filename}: ${media.duration_seconds.toFixed(3)}s is outside the authored 90-120s range`);
        }
      } else {
        const target = sfxLedger.get(row.id)?.target;
        if (target && (media.duration_seconds < target[0] - MP3_FRAME_TOLERANCE_SECONDS
          || media.duration_seconds > target[1] + MP3_FRAME_TOLERANCE_SECONDS)) {
          report.errors.push(`${filename}: ${media.duration_seconds.toFixed(3)}s misses ledger target ${target[0]}-${target[1]}s`);
        }
      }
    }
    mediaById.set(row.id, info);
    report.items[row.id] = info;
  }

  let renderProvenance;
  if (args.verifyManifest
    && args.kind === 'music'
    && args.version !== BASE_AUDIO_VERSIONS.music) {
    const renderProvenancePath = resolve(directory, RENDER_PROVENANCE_FILE);
    if (existsSync(renderProvenancePath)) {
      report.render_provenance = renderProvenancePath;
      try {
        renderProvenance = JSON.parse(readFileSync(renderProvenancePath, 'utf8'));
      } catch (error) {
        report.errors.push(`${RENDER_PROVENANCE_FILE}: ${error.message}`);
      }
    } else {
      report.warnings.push(`${RENDER_PROVENANCE_FILE} not found; Suno provenance cross-check was skipped`);
    }
  }

  if (args.verifyManifest) {
    try {
      const manifest = readManifest(args.verifyManifest, directory);
      report.manifest = manifest.path;
      validateManifest(
        manifest.data,
        {
          kind: args.kind,
          version: args.version,
          expected,
          mediaById,
          sfxLedger,
          renderProvenance,
        },
        report,
      );
    } catch (error) {
      report.errors.push(`manifest: ${error.message}`);
    }
  }
  if (args.version === BASE_AUDIO_VERSIONS[args.kind]) {
    report.warnings.push('immutable base pack: current v2 authored duration policy was not applied');
  }
  report.ok = report.errors.length === 0;

  if (args.manifestSeed) {
    if (!report.ok) {
      console.error(report.errors.join('\n'));
      process.exit(1);
    }
    console.log(`${JSON.stringify(manifestSeed({ kind: args.kind, version: args.version, expected, mediaById, sfxLedger }), null, 2)}\n`);
  } else if (args.json) {
    console.log(`${JSON.stringify(report, null, 2)}\n`);
  } else {
    const status = report.ok ? 'PASS' : 'FAIL';
    console.log(`${status} ${args.kind} ${args.version}: ${mediaById.size}/${expected.length} canonical MP3s decoded`);
    for (const warning of report.warnings) console.log(`WARN ${warning}`);
    for (const error of report.errors) console.error(`ERROR ${error}`);
  }
  process.exit(report.ok ? 0 : 1);
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) main();
