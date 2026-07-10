// Node-safe audio-pack contract. Imports the pure catalogue only; browser URL wiring lives in
// audio-assets.js so engine/vigil never gain a browser-only dependency.
import { MUSIC_CATALOG, SFX_CATALOG } from './audio-catalog.js';

export const AUDIO_KINDS = ['music', 'sfx'];
export const BASE_AUDIO_VERSIONS = Object.freeze({
  music: 'stained-glass-v1',
  sfx: 'ashglass-v1',
});
export const DEFAULT_AUDIO_SELECTION = Object.freeze({
  music: Object.freeze({ version: BASE_AUDIO_VERSIONS.music, overrides: Object.freeze({}) }),
  sfx: Object.freeze({ version: BASE_AUDIO_VERSIONS.sfx, overrides: Object.freeze({}) }),
});

const IDS = {
  music: new Set(MUSIC_CATALOG.map((row) => row.id)),
  sfx: new Set(SFX_CATALOG.map((row) => row.id)),
};

const isObject = (value) => !!value && typeof value === 'object' && !Array.isArray(value);

export function canonicalAudioFilename(kind, id) {
  if (!IDS[kind]?.has(id)) return null;
  if (kind === 'sfx') return `${id}.mp3`;
  return `${id.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase()}.mp3`;
}

export function audioRefFromPath(kind, modulePath) {
  if (!IDS[kind] || typeof modulePath !== 'string') return null;
  const root = kind === 'music' ? './assets/musics/' : './assets/sfx/';
  if (!modulePath.startsWith(root)) return null;
  const parts = modulePath.slice(root.length).split('/');
  if (parts.length < 1 || parts.length > 2) return null;
  const filename = parts.at(-1);
  if (!/^[A-Za-z0-9][A-Za-z0-9._-]*\.mp3$/.test(filename)) return null;
  if (parts.length === 1) return `${BASE_AUDIO_VERSIONS[kind]}/${filename}`;
  const version = parts[0];
  if (!/^[a-z0-9][a-z0-9-]*$/.test(version)) return null;
  if (version === BASE_AUDIO_VERSIONS[kind]) return null;
  return `${version}/${filename}`;
}

export function resolveAudioRef(kind, id, inventory, selection) {
  const filename = canonicalAudioFilename(kind, id);
  if (!filename) return null;
  const available = new Set(inventory?.[kind] ?? []);
  const override = selection?.[kind]?.overrides?.[id];
  if (override && available.has(override)) return override;
  const selectedVersion = selection?.[kind]?.version ?? BASE_AUDIO_VERSIONS[kind];
  const selectedRef = `${selectedVersion}/${filename}`;
  if (available.has(selectedRef)) return selectedRef;
  const baseRef = `${BASE_AUDIO_VERSIONS[kind]}/${filename}`;
  return available.has(baseRef) ? baseRef : null;
}

export function audioVersions(kind, inventory, { completeOnly = false } = {}) {
  if (!IDS[kind]) return [];
  const available = new Set(inventory?.[kind] ?? []);
  const versions = [...new Set([...available].map((ref) => String(ref).split('/', 1)[0]).filter(Boolean))].sort();
  if (!completeOnly) return versions;
  return versions.filter((version) => [...IDS[kind]].every((id) => {
    const filename = canonicalAudioFilename(kind, id);
    return available.has(`${version}/${filename}`);
  }));
}

export function validateAudioSelection(selection, inventory) {
  const problems = [];
  if (!isObject(selection)) return ['selection: expected object'];
  for (const key of Object.keys(selection)) {
    if (!AUDIO_KINDS.includes(key)) problems.push(`selection.${key}: unknown key`);
  }
  for (const kind of AUDIO_KINDS) {
    const config = selection[kind];
    if (!isObject(config)) {
      problems.push(`${kind}: expected object`);
      continue;
    }
    for (const key of Object.keys(config)) {
      if (!['version', 'overrides'].includes(key)) problems.push(`${kind}.${key}: unknown key`);
    }
    const { version, overrides } = config;
    const available = new Set(inventory?.[kind] ?? []);
    if (typeof version !== 'string' || !version) {
      problems.push(`${kind}.version: expected non-empty string`);
    } else if (!audioVersions(kind, inventory, { completeOnly: true }).includes(version)) {
      problems.push(`${kind}.version: unknown or incomplete pack ${version}`);
    }
    if (!isObject(overrides)) {
      problems.push(`${kind}.overrides: expected object`);
      continue;
    }
    for (const [id, ref] of Object.entries(overrides)) {
      if (!IDS[kind].has(id)) problems.push(`${kind}.overrides.${id}: unknown id`);
      else if (typeof ref !== 'string' || !available.has(ref)) problems.push(`${kind}.overrides.${id}: unavailable asset ${ref}`);
    }
  }
  return problems;
}

export function normaliseAudioSelection(selection, inventory) {
  const problems = validateAudioSelection(selection, inventory);
  if (problems.length) return { selection: DEFAULT_AUDIO_SELECTION, problems };
  return {
    selection: {
      music: { version: selection.music.version, overrides: { ...selection.music.overrides } },
      sfx: { version: selection.sfx.version, overrides: { ...selection.sfx.overrides } },
    },
    problems: [],
  };
}
