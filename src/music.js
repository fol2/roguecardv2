// Music Cue layer — flat registry, lazy load, short crossfade, independent bus.
import { ensureAudio, getAudioContext } from './audio.js';
import { DEFAULT_AUDIO_SELECTION } from './audio-packs.js';
import { getAudioSource } from './audio-assets.js';
import { MUSIC_CATALOG } from './audio-catalog.js';

const CROSSFADE = 0.8;
const DEFAULT_VOL = 0.35;
const VOL_KEY = 'spirebound_vol_music';
const MUTE_KEY = 'spirebound_mute_music';

function readVol() {
  const v = parseFloat(localStorage.getItem(VOL_KEY));
  return Number.isFinite(v) ? Math.min(1, Math.max(0, v)) : DEFAULT_VOL;
}
function readMute() {
  const legacy = localStorage.getItem('spirebound_mute');
  if (localStorage.getItem(MUTE_KEY) == null && legacy === '1') return true;
  return localStorage.getItem(MUTE_KEY) === '1';
}

let volume = readVol();
let muted = readMute();
let musicBus = null;
let activeId = null;
let activeRef = null;
let activeRequestedRef = null;
let activeSrc = null;
let activeGain = null;
let playGen = 0;
const buffers = Object.create(null);
const loading = Object.create(null);
const failedRefs = new Set();

const WARM_WITH = {
  title: ['embark', 'vigil'], embark: ['map'], vigil: ['title'],
  map: ['act1Combat', 'safeNodes', 'elite'], safeNodes: ['map'],
  act1Combat: ['act1Boss', 'map', 'elite'], act1Boss: ['map', 'victory'],
  act2Combat: ['act2Boss', 'map', 'elite'], act2Boss: ['map', 'victory'],
  act3Combat: ['act3Boss', 'map', 'elite'], act3Boss: ['victory', 'defeat'],
  elite: ['map'], victory: ['title', 'vigil'], defeat: ['title', 'vigil'],
};

/** @type {Record<string, { title: string, wired: boolean, warmWith?: string[] }>} */
export const REGISTRY = Object.fromEntries(MUSIC_CATALOG.map((row) => [row.id, {
  title: row.title,
  wired: row.wired,
  ...(WARM_WITH[row.id] ? { warmWith: WARM_WITH[row.id] } : {}),
}]));

function ensureBus() {
  if (!ensureAudio()) return null;
  if (musicBus) return musicBus;
  const ctx = getAudioContext();
  musicBus = ctx.createGain();
  musicBus.gain.value = muted ? 0 : volume;
  musicBus.connect(ctx.destination);
  return musicBus;
}

function applyBusGain(ramp = 0.08) {
  if (!musicBus) return;
  const ctx = getAudioContext();
  const target = muted ? 0 : volume;
  musicBus.gain.cancelScheduledValues(ctx.currentTime);
  musicBus.gain.linearRampToValueAtTime(target, ctx.currentTime + ramp);
}

export function getMusicVolume() { return volume; }
export function isMusicMuted() { return muted; }
export function setMusicVolume(v) {
  volume = Math.min(1, Math.max(0, +v || 0));
  localStorage.setItem(VOL_KEY, String(volume));
  applyBusGain();
  return volume;
}
export function setMusicMuted(on) {
  muted = !!on;
  localStorage.setItem(MUTE_KEY, muted ? '1' : '0');
  applyBusGain();
  return muted;
}
export function toggleMusicMute() { return setMusicMuted(!muted); }

async function loadSource(source) {
  if (!source?.ref || !source.url) return null;
  if (failedRefs.has(source.ref)) return null;
  if (buffers[source.ref]) return buffers[source.ref];
  if (loading[source.ref]) return loading[source.ref];
  loading[source.ref] = (async () => {
    if (!ensureAudio()) return null;
    try {
      const res = await fetch(source.url);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const arr = await res.arrayBuffer();
      buffers[source.ref] = await getAudioContext().decodeAudioData(arr.slice(0));
      return buffers[source.ref];
    } catch {
      failedRefs.add(source.ref);
      buffers[source.ref] = null;
      return null;
    } finally {
      delete loading[source.ref];
    }
  })();
  return loading[source.ref];
}

async function loadCue(id, selection) {
  if (!REGISTRY[id]) return null;
  const selected = getAudioSource('music', id, selection);
  const base = getAudioSource('music', id, DEFAULT_AUDIO_SELECTION);
  for (const source of [selected, base]) {
    if (!source || (source !== selected && source.ref === selected?.ref)) continue;
    const buffer = await loadSource(source);
    if (buffer) return { buffer, source };
  }
  return null;
}

export function warm(...ids) {
  ids.flat().forEach((id) => { if (REGISTRY[id]) loadCue(id); });
}

function fadeOutCurrent() {
  if (!activeSrc || !activeGain) return;
  const ctx = getAudioContext();
  const src = activeSrc, g = activeGain;
  activeSrc = null;
  activeGain = null;
  activeRef = null;
  activeRequestedRef = null;
  try {
    g.gain.cancelScheduledValues(ctx.currentTime);
    g.gain.linearRampToValueAtTime(0.0001, ctx.currentTime + CROSSFADE);
    src.stop(ctx.currentTime + CROSSFADE + 0.05);
  } catch { /* already stopped */ }
  setTimeout(() => { try { src.disconnect(); } catch { /* ok */ } try { g.disconnect(); } catch { /* ok */ } }, (CROSSFADE + 0.1) * 1000);
}

async function playInternal(cueId, { force = false, selection } = {}) {
  const entry = REGISTRY[cueId];
  if (!entry || (!entry.wired && !force)) return;
  const requestedSource = getAudioSource('music', cueId, selection);
  if (!requestedSource) return;
  if (cueId === activeId && activeRequestedRef === requestedSource.ref && activeSrc) {
    if (entry.warmWith) warm(entry.warmWith);
    return;
  }
  if (!ensureBus()) return;
  const gen = ++playGen;
  const loaded = await loadCue(cueId, selection);
  if (gen !== playGen) return; // superseded
  if (!loaded) return;
  const ctx = getAudioContext();
  fadeOutCurrent();
  const src = ctx.createBufferSource();
  src.buffer = loaded.buffer;
  src.loop = true;
  const g = ctx.createGain();
  g.gain.setValueAtTime(0.0001, ctx.currentTime);
  g.gain.linearRampToValueAtTime(1, ctx.currentTime + CROSSFADE);
  src.connect(g).connect(musicBus);
  src.start();
  activeId = cueId;
  activeRef = loaded.source.ref;
  activeRequestedRef = requestedSource.ref;
  activeSrc = src;
  activeGain = g;
  if (entry.warmWith) warm(entry.warmWith);
}

/** Play a Music Cue. Unwired / unknown cues no-op. Same cue re-entry is a no-op. */
export function play(cueId) { return playInternal(cueId); }

/** Dev/gallery: play even if the cue is not wired into live screens yet. Optional selection previews unsaved overrides. */
export function preview(cueId, selection) { return playInternal(cueId, { force: true, selection }); }

export function stop() {
  playGen++;
  activeId = null;
  activeRef = null;
  activeRequestedRef = null;
  fadeOutCurrent();
}

export function currentCue() { return activeId; }
export function currentAudioRef() { return activeRef; }
export function currentRequestedAudioRef() { return activeRequestedRef; }

/** Re-resolve the active cue after a hot-applied selection change. */
export function invalidateMusicSelection() {
  if (!activeId) {
    activeRequestedRef = null;
    return;
  }
  const next = getAudioSource('music', activeId);
  if (next?.ref && next.ref !== activeRef) {
    activeRequestedRef = null;
    return playInternal(activeId, { force: true });
  }
  activeRequestedRef = next?.ref ?? null;
}

/** Screen → cue. Combat / run-end / Act 1–2 boss victory resolve elsewhere.
 *  reward / bossRelic omit on purpose: normal/elite keep the combat cue;
 *  Act 1/2 boss wins already switched to `victory` in victoryFlow(). */
export const SCREEN_CUES = {
  title: 'title',
  embark: 'embark',
  vigil: 'vigil',
  map: 'map',
  shop: 'safeNodes',
  rest: 'safeNodes',
  treasure: 'safeNodes',
  event: 'map',
  lamplighter: 'map',
};

export function playForScreen(name) {
  const cue = SCREEN_CUES[name];
  if (cue) return play(cue);
}

export function playForCombat(kind, actIdx) {
  const act = Math.max(0, Math.min(2, actIdx | 0)) + 1;
  if (kind === 'boss') return play(`act${act}Boss`);
  if (kind === 'elite') return play('elite');
  return play(`act${act}Combat`);
}

export function playForRunEnd(won) {
  return play(won ? 'victory' : 'defeat');
}
