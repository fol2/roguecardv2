import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

import { MUSIC_CATALOG } from '../src/audio-catalog.js';
import {
  buildMusicV2ProductionSeed,
  parseMusicLedger,
  validateMusicLedger,
} from '../tools/build-music-v2-queue.mjs';

const ledger = readFileSync(new URL('../docs/music-ledger.md', import.meta.url), 'utf8');
const entries = parseMusicLedger(ledger);
const seed = buildMusicV2ProductionSeed(ledger);

assert.equal(seed.count, 22);
assert.equal(seed.queue.length, 22);
assert.equal(seed.queue[0].id, 'title');
assert.equal(seed.queue[0].title, 'Stained Glass Inscription');
assert.equal(seed.queue[0].file, 'title.mp3');
assert.equal(seed.queue[0].use, 'title screen, calm first impression.');
assert.equal(seed.manifest_seed.items.title.use, 'Title screen');
assert.equal(seed.queue.at(-1).id, 'defeat');
assert.equal(seed.queue.at(-1).file, 'defeat.mp3');
assert.equal(seed.manifest_seed.schema_version, 2);
assert.deepEqual(Object.keys(seed.manifest_seed.items), seed.queue.map((item) => item.id));
assert.equal(JSON.stringify(buildMusicV2ProductionSeed(ledger)), JSON.stringify(seed), 'output is deterministic');

assert.throws(
  () => validateMusicLedger(entries, [...MUSIC_CATALOG, MUSIC_CATALOG[0]]),
  /duplicate catalogue ids: title/,
);
assert.throws(
  () => validateMusicLedger([...entries, entries[0]], MUSIC_CATALOG),
  /duplicate ledger ids: title/,
);
assert.throws(
  () => validateMusicLedger(entries.slice(0, -1), MUSIC_CATALOG),
  /catalogue cues missing from ledger: defeat/,
);
assert.throws(
  () => validateMusicLedger(entries, MUSIC_CATALOG.slice(0, -1)),
  /ledger cues missing from catalogue: defeat/,
);
assert.throws(
  () => validateMusicLedger(entries.map((item) => item.id === 'title' ? { ...item, title: 'Changed' } : item), MUSIC_CATALOG),
  /title differs from catalogue/,
);

process.stdout.write('Music v2 queue checks passed\n');
