// Music Cue layer — flat registry, lazy load, short crossfade, independent bus.
import { ensureAudio, getAudioContext } from './audio.js';

import titleUrl from './assets/musics/title.mp3';
import embarkUrl from './assets/musics/embark.mp3';
import vigilUrl from './assets/musics/vigil.mp3';
import roseWindowUrl from './assets/musics/rose-window.mp3';
import mapUrl from './assets/musics/map.mp3';
import safeNodesUrl from './assets/musics/safe-nodes.mp3';
import act1CombatUrl from './assets/musics/act1-combat.mp3';
import act1BossUrl from './assets/musics/act1-boss.mp3';
import act2CombatUrl from './assets/musics/act2-combat.mp3';
import act2BossUrl from './assets/musics/act2-boss.mp3';
import act3CombatUrl from './assets/musics/act3-combat.mp3';
import act3BossUrl from './assets/musics/act3-boss.mp3';
import eliteUrl from './assets/musics/elite.mp3';
import paleOnesUrl from './assets/musics/pale-ones.mp3';
import shadeDuelUrl from './assets/musics/shade-duel.mp3';
import usurperUrl from './assets/musics/usurper.mp3';
import eighthOmenUrl from './assets/musics/eighth-omen.mp3';
import unreadablePageUrl from './assets/musics/unreadable-page.mp3';
import hollowLamplighterUrl from './assets/musics/hollow-lamplighter.mp3';
import sealedDoorUrl from './assets/musics/sealed-door.mp3';
import victoryUrl from './assets/musics/victory.mp3';
import defeatUrl from './assets/musics/defeat.mp3';

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
let activeSrc = null;
let activeGain = null;
let playGen = 0;
const buffers = Object.create(null);
const loading = Object.create(null);

/** @type {Record<string, { url: string, title: string, wired: boolean, warmWith?: string[] }>} */
export const REGISTRY = {
  title: { url: titleUrl, title: 'Stained Glass Inscription', wired: true, warmWith: ['embark', 'vigil'] },
  embark: { url: embarkUrl, title: 'Light Your Lantern', wired: true, warmWith: ['map'] },
  vigil: { url: vigilUrl, title: 'Monuments in the Dark', wired: true, warmWith: ['title'] },
  roseWindow: { url: roseWindowUrl, title: 'Six Dark Panes', wired: false },
  map: { url: mapUrl, title: 'Lanterns on the Face of the Spire', wired: true, warmWith: ['act1Combat', 'safeNodes', 'elite'] },
  safeNodes: { url: safeNodesUrl, title: 'Cold Goods, Warm Price', wired: true, warmWith: ['map'] },
  act1Combat: { url: act1CombatUrl, title: 'Ashen Woods Scherzo', wired: true, warmWith: ['act1Boss', 'map', 'elite'] },
  act1Boss: { url: act1BossUrl, title: 'The Rootheart Awakens', wired: true, warmWith: ['map', 'victory'] },
  act2Combat: { url: act2CombatUrl, title: 'Sunken City Waltz', wired: true, warmWith: ['act2Boss', 'map', 'elite'] },
  act2Boss: { url: act2BossUrl, title: "Leviathan's Maw", wired: true, warmWith: ['map', 'victory'] },
  act3Combat: { url: act3CombatUrl, title: 'The Cracked Astral Court', wired: true, warmWith: ['act3Boss', 'map', 'elite'] },
  act3Boss: { url: act3BossUrl, title: 'The Eternal Sovereign', wired: true, warmWith: ['victory', 'defeat'] },
  elite: { url: eliteUrl, title: 'Named Afflictions', wired: true, warmWith: ['map'] },
  paleOnes: { url: paleOnesUrl, title: 'Witchlight Motes', wired: false },
  shadeDuel: { url: shadeDuelUrl, title: 'The Duel That Remembers', wired: false },
  usurper: { url: usurperUrl, title: 'Lantern With No Flame', wired: false },
  eighthOmen: { url: eighthOmenUrl, title: 'Broken Glyph Run', wired: false },
  unreadablePage: { url: unreadablePageUrl, title: 'It Reads Itself', wired: false },
  hollowLamplighter: { url: hollowLamplighterUrl, title: 'The Unlit Way', wired: false },
  sealedDoor: { url: sealedDoorUrl, title: 'The Climb Continues', wired: false },
  victory: { url: victoryUrl, title: 'The Only Sunrise', wired: true, warmWith: ['title', 'vigil'] },
  defeat: { url: defeatUrl, title: 'A Mark in the Dark', wired: true, warmWith: ['title', 'vigil'] },
};

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

async function loadCue(id) {
  const entry = REGISTRY[id];
  if (!entry) return null;
  if (buffers[id]) return buffers[id];
  if (loading[id]) return loading[id];
  loading[id] = (async () => {
    if (!ensureAudio()) return null;
    try {
      const res = await fetch(entry.url);
      const arr = await res.arrayBuffer();
      buffers[id] = await getAudioContext().decodeAudioData(arr.slice(0));
      return buffers[id];
    } catch {
      buffers[id] = null;
      return null;
    } finally {
      delete loading[id];
    }
  })();
  return loading[id];
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
  try {
    g.gain.cancelScheduledValues(ctx.currentTime);
    g.gain.linearRampToValueAtTime(0.0001, ctx.currentTime + CROSSFADE);
    src.stop(ctx.currentTime + CROSSFADE + 0.05);
  } catch { /* already stopped */ }
  setTimeout(() => { try { src.disconnect(); } catch { /* ok */ } try { g.disconnect(); } catch { /* ok */ } }, (CROSSFADE + 0.1) * 1000);
}

/** Play a Music Cue. Unwired / unknown cues no-op. Same cue re-entry is a no-op. */
export async function play(cueId) {
  const entry = REGISTRY[cueId];
  if (!entry || !entry.wired) return;
  if (cueId === activeId && activeSrc) {
    if (entry.warmWith) warm(entry.warmWith);
    return;
  }
  if (!ensureBus()) return;
  const gen = ++playGen;
  activeId = cueId;
  const buf = await loadCue(cueId);
  if (gen !== playGen || activeId !== cueId) return; // superseded
  if (!buf) return;
  const ctx = getAudioContext();
  fadeOutCurrent();
  const src = ctx.createBufferSource();
  src.buffer = buf;
  src.loop = true;
  const g = ctx.createGain();
  g.gain.setValueAtTime(0.0001, ctx.currentTime);
  g.gain.linearRampToValueAtTime(1, ctx.currentTime + CROSSFADE);
  src.connect(g).connect(musicBus);
  src.start();
  activeSrc = src;
  activeGain = g;
  if (entry.warmWith) warm(entry.warmWith);
}

export function stop() {
  playGen++;
  activeId = null;
  fadeOutCurrent();
}

export function currentCue() { return activeId; }

/** Screen → cue. Combat / run-end resolve elsewhere.
 *  reward / bossRelic omit on purpose: keep the combat cue until the player
 *  actually lands on the node-pick map. */
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
