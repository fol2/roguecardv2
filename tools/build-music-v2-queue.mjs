#!/usr/bin/env node

import { readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

import { MUSIC_CATALOG } from '../src/audio-catalog.js';
import { canonicalAudioFilename } from '../src/audio-packs.js';

const EXPECTED_CUE_COUNT = 22;
const DEFAULT_PACK_ID = 'stained-glass-v2';
const THEME = 'Classical gothic stained-glass chamber music';
const SOURCE = 'docs/music-ledger.md';

function fail(message) {
  throw new Error(`Music v2 queue: ${message}`);
}

function duplicates(values) {
  const seen = new Set();
  const found = new Set();
  for (const value of values) {
    if (seen.has(value)) found.add(value);
    seen.add(value);
  }
  return [...found];
}

export function parseMusicLedger(markdown) {
  if (typeof markdown !== 'string') fail('ledger must be text');

  const heading = /^###\s+(\d+)\.\s+`([^`]+)`\s+—\s+(.+)$/gm;
  const matches = [...markdown.matchAll(heading)];
  return matches.map((match, index) => {
    const section = markdown.slice(match.index + match[0].length, matches[index + 1]?.index ?? markdown.length);
    const use = section.match(/^Use:\s*(.+)$/m)?.[1]?.trim();
    if (!use) fail(`${match[2]} is missing its Use line`);

    const marker = 'SUNO prompt:';
    const markerAt = section.indexOf(marker);
    if (markerAt < 0) fail(`${match[2]} is missing its SUNO prompt`);
    const promptBlock = section.slice(markerAt + marker.length).trim();
    const paragraphs = promptBlock.split(/\n\s*\n/).map((part) => part.trim()).filter(Boolean);
    if (paragraphs.length !== 1) fail(`${match[2]} must have exactly one SUNO prompt paragraph`);
    const prompt = paragraphs[0].split('\n').map((line) => line.trim()).filter(Boolean).join(' ');
    if (!prompt) fail(`${match[2]} has an empty SUNO prompt`);

    return {
      position: Number(match[1]),
      id: match[2],
      title: match[3].trim(),
      use,
      prompt,
    };
  });
}

export function validateMusicLedger(entries, catalogue = MUSIC_CATALOG) {
  if (!Array.isArray(entries) || !Array.isArray(catalogue)) fail('entries and catalogue must be arrays');

  const catalogueDuplicates = duplicates(catalogue.map((item) => item.id));
  if (catalogueDuplicates.length) fail(`duplicate catalogue ids: ${catalogueDuplicates.join(', ')}`);
  const ledgerDuplicates = duplicates(entries.map((item) => item.id));
  if (ledgerDuplicates.length) fail(`duplicate ledger ids: ${ledgerDuplicates.join(', ')}`);

  const catalogueById = new Map(catalogue.map((item) => [item.id, item]));
  const ledgerById = new Map(entries.map((item) => [item.id, item]));
  const missingFromLedger = catalogue.filter((item) => !ledgerById.has(item.id)).map((item) => item.id);
  const missingFromCatalogue = entries.filter((item) => !catalogueById.has(item.id)).map((item) => item.id);
  if (missingFromLedger.length) fail(`catalogue cues missing from ledger: ${missingFromLedger.join(', ')}`);
  if (missingFromCatalogue.length) fail(`ledger cues missing from catalogue: ${missingFromCatalogue.join(', ')}`);
  if (catalogue.length !== EXPECTED_CUE_COUNT) {
    fail(`catalogue has ${catalogue.length} cues; expected ${EXPECTED_CUE_COUNT}`);
  }
  if (entries.length !== EXPECTED_CUE_COUNT) {
    fail(`ledger has ${entries.length} cues; expected ${EXPECTED_CUE_COUNT}`);
  }

  for (const [index, entry] of entries.entries()) {
    if (entry.position !== index + 1) fail(`${entry.id} has position ${entry.position}; expected ${index + 1}`);
    const catalogueItem = catalogueById.get(entry.id);
    if (entry.title !== catalogueItem.title) {
      fail(`${entry.id} title differs from catalogue: ${JSON.stringify(entry.title)} != ${JSON.stringify(catalogueItem.title)}`);
    }
    if (!entry.prompt.trim()) fail(`${entry.id} has an empty SUNO prompt`);
  }
}

export function buildMusicV2ProductionSeed(markdown, catalogue = MUSIC_CATALOG, packId = DEFAULT_PACK_ID) {
  if (!/^[a-z0-9][a-z0-9-]*$/.test(packId)) fail(`invalid pack id ${JSON.stringify(packId)}`);
  const entries = parseMusicLedger(markdown);
  validateMusicLedger(entries, catalogue);
  const catalogueById = new Map(catalogue.map((item) => [item.id, item]));

  const queue = entries.map((entry) => {
    const catalogueItem = catalogueById.get(entry.id);
    const file = canonicalAudioFilename('music', entry.id);
    if (!file) fail(`${entry.id} has no canonical Music filename`);
    return {
      position: entry.position,
      id: entry.id,
      title: entry.title,
      file,
      wired: catalogueItem.wired,
      use: entry.use,
      prompt: entry.prompt,
    };
  });

  const manifestItems = Object.fromEntries(queue.map((item) => [item.id, {
    file: item.file,
    title: item.title,
    wired: item.wired,
    use: catalogueById.get(item.id).use,
    bytes: null,
    sha256: null,
    duration_seconds: null,
    codec: null,
    sample_rate_hz: null,
    channels: null,
    source_id: null,
    source_url: null,
    selected_variant: null,
  }]));

  return {
    schema_version: 1,
    pack_id: packId,
    provider: 'Suno',
    source: SOURCE,
    count: queue.length,
    queue,
    manifest_seed: {
      schema_version: 2,
      pack_id: packId,
      kind: 'music',
      theme: THEME,
      source: SOURCE,
      provenance: {
        provider: 'Suno',
        generated_at: null,
        licence_or_plan: null,
        notes: null,
      },
      items: manifestItems,
    },
  };
}

function parseArgs(argv) {
  const options = { check: false, output: null, packId: DEFAULT_PACK_ID };
  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (arg === '--check') options.check = true;
    else if (arg === '--output') options.output = argv[++index];
    else if (arg === '--pack-id') options.packId = argv[++index];
    else fail(`unknown argument ${JSON.stringify(arg)}`);
    if ((arg === '--output' || arg === '--pack-id') && !argv[index]) fail(`${arg} requires a value`);
  }
  return options;
}

function main() {
  const options = parseArgs(process.argv.slice(2));
  const markdown = readFileSync(new URL('../docs/music-ledger.md', import.meta.url), 'utf8');
  const seed = buildMusicV2ProductionSeed(markdown, MUSIC_CATALOG, options.packId);
  if (options.check) {
    process.stdout.write(`Music v2 queue valid: ${seed.count} cues for ${seed.pack_id}\n`);
    return;
  }

  const json = `${JSON.stringify(seed, null, 2)}\n`;
  if (options.output) {
    const output = resolve(options.output);
    writeFileSync(output, json);
    process.stdout.write(`${output}\n`);
  } else {
    process.stdout.write(json);
  }
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  try {
    main();
  } catch (error) {
    process.stderr.write(`${error.message}\n`);
    process.exitCode = 1;
  }
}
