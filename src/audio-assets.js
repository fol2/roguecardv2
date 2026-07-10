// Browser-only bridge from the Node-safe audio-pack contract to Vite asset
// URLs. Every installed version is compiled; MP3 bytes remain lazy network
// loads until audio.js/music.js fetch a resolved URL.
import {
  BASE_AUDIO_VERSIONS,
  DEFAULT_AUDIO_SELECTION,
  audioRefFromPath,
  audioVersions,
  normaliseAudioSelection,
  rankAudioRefs,
  resolveAudioRef,
} from './audio-packs.js';
import { fetchAudioSelectionJson } from './audio-selection-fetch.js';

const MUSIC_MODULES = import.meta.glob('./assets/musics/**/*.mp3', {
  eager: true,
  query: '?url',
  import: 'default',
});
const SFX_MODULES = import.meta.glob('./assets/sfx/**/*.mp3', {
  eager: true,
  query: '?url',
  import: 'default',
});

function indexModules(kind, modules) {
  const urls = Object.create(null);
  for (const [path, url] of Object.entries(modules)) {
    const ref = audioRefFromPath(kind, path);
    if (!ref) continue;
    if (urls[ref]) throw new Error(`duplicate ${kind} asset ref: ${ref}`);
    urls[ref] = url;
  }
  return urls;
}

const URLS = {
  music: indexModules('music', MUSIC_MODULES),
  sfx: indexModules('sfx', SFX_MODULES),
};

export const AUDIO_INVENTORY = Object.freeze({
  music: Object.freeze(Object.keys(URLS.music).sort()),
  sfx: Object.freeze(Object.keys(URLS.sfx).sort()),
});

let activeSelection = DEFAULT_AUDIO_SELECTION;
let selectionProblems = [];

export async function loadAudioSelection(url = `${import.meta.env.BASE_URL}audio-selection.json`) {
  try {
    const candidate = await fetchAudioSelectionJson(url);
    return applyAudioSelection(candidate);
  } catch (error) {
    activeSelection = DEFAULT_AUDIO_SELECTION;
    selectionProblems = [`audio-selection.json: ${String(error?.message ?? error)}`];
    if (selectionProblems.length) console.warn('[audio-selection]', ...selectionProblems);
    return activeSelection;
  }
}

/** Apply a validated/normalised selection in-memory (gallery hot-save). */
export function applyAudioSelection(candidate) {
  const result = normaliseAudioSelection(candidate, AUDIO_INVENTORY);
  activeSelection = result.selection;
  selectionProblems = result.problems;
  if (selectionProblems.length) console.warn('[audio-selection]', ...selectionProblems);
  return activeSelection;
}

export function getAudioSelection() { return activeSelection; }
export function getAudioSelectionProblems() { return [...selectionProblems]; }
export function getAudioVersions(kind, options) { return audioVersions(kind, AUDIO_INVENTORY, options); }
export function getAudioRefs(kind) { return [...(AUDIO_INVENTORY[kind] ?? [])]; }
export function getAudioOverrideRefs(kind, id, { exclude = null } = {}) {
  return rankAudioRefs(kind, id, AUDIO_INVENTORY[kind] ?? [], { exclude });
}

export function getAudioSource(kind, id, selection = activeSelection) {
  const ref = resolveAudioRef(kind, id, AUDIO_INVENTORY, selection);
  if (!ref) return null;
  const override = selection?.[kind]?.overrides?.[id];
  const baseVersion = BASE_AUDIO_VERSIONS[kind];
  return {
    ref,
    url: URLS[kind]?.[ref] ?? null,
    overridden: ref === override,
    fallback: !override && selection?.[kind]?.version !== baseVersion && ref.startsWith(`${baseVersion}/`),
  };
}

/** Pack-default ref for an id (ignores any per-id override). */
export function getAudioPackDefaultRef(kind, id, selection = activeSelection) {
  const packOnly = {
    music: { version: selection.music.version, overrides: {} },
    sfx: { version: selection.sfx.version, overrides: {} },
  };
  // Keep other overrides out of the way; pack default for this id only needs version.
  return resolveAudioRef(kind, id, AUDIO_INVENTORY, packOnly);
}
