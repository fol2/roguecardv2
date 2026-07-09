// Ashglass Vigil SFX (ElevenLabs samples) + WebAudio synth fallback.
// Music lives in music.js; both share this AudioContext.
import clickUrl from './assets/sfx/click.mp3';
import hoverUrl from './assets/sfx/hover.mp3';
import cardUrl from './assets/sfx/card.mp3';
import drawUrl from './assets/sfx/draw.mp3';
import slashUrl from './assets/sfx/slash.mp3';
import hitUrl from './assets/sfx/hit.mp3';
import blockedUrl from './assets/sfx/blocked.mp3';
import blockUrl from './assets/sfx/block.mp3';
import poisonUrl from './assets/sfx/poison.mp3';
import debuffUrl from './assets/sfx/debuff.mp3';
import buffUrl from './assets/sfx/buff.mp3';
import healUrl from './assets/sfx/heal.mp3';
import energyUrl from './assets/sfx/energy.mp3';
import coinUrl from './assets/sfx/coin.mp3';
import potionUrl from './assets/sfx/potion.mp3';
import deathUrl from './assets/sfx/death.mp3';
import bigDeathUrl from './assets/sfx/bigDeath.mp3';
import turnUrl from './assets/sfx/turn.mp3';
import victoryUrl from './assets/sfx/victory.mp3';
import defeatUrl from './assets/sfx/defeat.mp3';
import relicUrl from './assets/sfx/relic.mp3';
import upgradeUrl from './assets/sfx/upgrade.mp3';
import mapUrl from './assets/sfx/map.mp3';
import chipUrl from './assets/sfx/chip.mp3';
import shatterUrl from './assets/sfx/shatter.mp3';
import emberUrl from './assets/sfx/ember.mp3';
import kindleUrl from './assets/sfx/kindle.mp3';
import staggerUrl from './assets/sfx/stagger.mp3';
import artUrl from './assets/sfx/art.mp3';
import omenUrl from './assets/sfx/omen.mp3';

const DEFAULT_VOL = 0.55;
const VOL_KEY = 'spirebound_vol_sfx';
const MUTE_KEY = 'spirebound_mute_sfx';

function readVol() {
  const v = parseFloat(localStorage.getItem(VOL_KEY));
  return Number.isFinite(v) ? Math.min(1, Math.max(0, v)) : DEFAULT_VOL;
}
function readMute() {
  const legacy = localStorage.getItem('spirebound_mute');
  if (localStorage.getItem(MUTE_KEY) == null && legacy === '1') return true;
  return localStorage.getItem(MUTE_KEY) === '1';
}

let ctx = null, sfxBus = null;
let volume = readVol();
let muted = readMute();
const buffers = Object.create(null);
const loading = Object.create(null);

const SAMPLE_URLS = {
  click: clickUrl, hover: hoverUrl, card: cardUrl, draw: drawUrl,
  slash: slashUrl, hit: hitUrl, blocked: blockedUrl, block: blockUrl,
  poison: poisonUrl, debuff: debuffUrl, buff: buffUrl, heal: healUrl,
  energy: energyUrl, coin: coinUrl, potion: potionUrl, death: deathUrl,
  bigDeath: bigDeathUrl, turn: turnUrl, victory: victoryUrl, defeat: defeatUrl,
  relic: relicUrl, upgrade: upgradeUrl, map: mapUrl, chip: chipUrl,
  shatter: shatterUrl, ember: emberUrl, kindle: kindleUrl, stagger: staggerUrl,
  art: artUrl, omen: omenUrl,
};

export function ensureAudio() {
  if (ctx) return true;
  try {
    ctx = new (window.AudioContext || window.webkitAudioContext)();
    sfxBus = ctx.createGain();
    sfxBus.gain.value = muted ? 0 : volume;
    sfxBus.connect(ctx.destination);
  } catch { return false; }
  return true;
}
export function getAudioContext() { return ctx; }

function applyBusGain(ramp = 0.08) {
  if (!sfxBus || !ctx) return;
  const target = muted ? 0 : volume;
  sfxBus.gain.cancelScheduledValues(ctx.currentTime);
  sfxBus.gain.linearRampToValueAtTime(target, ctx.currentTime + ramp);
}

export function unlock() {
  if (!ensureAudio()) return;
  if (ctx.state === 'suspended') ctx.resume();
  preloadSfx();
}

export function getSfxVolume() { return volume; }
export function isSfxMuted() { return muted; }
export function setSfxVolume(v) {
  volume = Math.min(1, Math.max(0, +v || 0));
  localStorage.setItem(VOL_KEY, String(volume));
  applyBusGain();
  return volume;
}
export function setSfxMuted(on) {
  muted = !!on;
  localStorage.setItem(MUTE_KEY, muted ? '1' : '0');
  applyBusGain();
  return muted;
}
export function toggleSfxMute() { return setSfxMuted(!muted); }

// Back-compat aliases (old single mute → SFX bus only). Prefer the SFX-named API.
export function isMuted() { return muted; }
export function toggleMute() { return toggleSfxMute(); }

function env(node, t0, a, peak, d) {
  node.gain.setValueAtTime(0.0001, t0);
  node.gain.exponentialRampToValueAtTime(peak, t0 + a);
  node.gain.exponentialRampToValueAtTime(0.0001, t0 + a + d);
}
function tone(freq, { type = 'sine', a = 0.005, d = 0.2, peak = 0.3, slide = 0, delay = 0 } = {}) {
  if (!ensureAudio()) return;
  const t0 = ctx.currentTime + delay;
  const o = ctx.createOscillator(), g = ctx.createGain();
  o.type = type;
  o.frequency.setValueAtTime(freq, t0);
  if (slide) o.frequency.exponentialRampToValueAtTime(Math.max(20, freq + slide), t0 + a + d);
  env(g, t0, a, peak, d);
  o.connect(g).connect(sfxBus);
  o.start(t0); o.stop(t0 + a + d + 0.05);
}
function noise({ a = 0.002, d = 0.15, peak = 0.25, f0 = 800, f1 = 300, q = 1, type = 'bandpass', delay = 0 } = {}) {
  if (!ensureAudio()) return;
  const t0 = ctx.currentTime + delay;
  const len = Math.ceil(ctx.sampleRate * (a + d + 0.05));
  const buf = ctx.createBuffer(1, len, ctx.sampleRate);
  const ch = buf.getChannelData(0);
  for (let i = 0; i < len; i++) ch[i] = Math.random() * 2 - 1;
  const src = ctx.createBufferSource(); src.buffer = buf;
  const flt = ctx.createBiquadFilter(); flt.type = type; flt.Q.value = q;
  flt.frequency.setValueAtTime(f0, t0);
  flt.frequency.exponentialRampToValueAtTime(Math.max(40, f1), t0 + a + d);
  const g = ctx.createGain();
  env(g, t0, a, peak, d);
  src.connect(flt).connect(g).connect(sfxBus);
  src.start(t0); src.stop(t0 + a + d + 0.05);
}

async function loadSample(name) {
  if (buffers[name] || !SAMPLE_URLS[name]) return buffers[name] || null;
  if (loading[name]) return loading[name];
  loading[name] = (async () => {
    if (!ensureAudio()) return null;
    try {
      const res = await fetch(SAMPLE_URLS[name]);
      const arr = await res.arrayBuffer();
      buffers[name] = await ctx.decodeAudioData(arr.slice(0));
      return buffers[name];
    } catch {
      buffers[name] = null;
      return null;
    } finally {
      delete loading[name];
    }
  })();
  return loading[name];
}

function playSample(name, { gain = 0.85 } = {}) {
  if (!ensureAudio()) return false;
  const buf = buffers[name];
  if (!buf) {
    loadSample(name);
    return false;
  }
  const src = ctx.createBufferSource();
  src.buffer = buf;
  const g = ctx.createGain();
  g.gain.value = gain;
  src.connect(g).connect(sfxBus);
  src.start();
  return true;
}

function play(name, fallback, opts) {
  if (playSample(name, opts)) return;
  fallback();
  loadSample(name);
}

export function preloadSfx() {
  if (!ensureAudio()) return;
  Object.keys(SAMPLE_URLS).forEach((k) => { loadSample(k); });
}

const synth = {
  click: () => { tone(660, { type: 'triangle', d: 0.05, peak: 0.12 }); },
  hover: () => { tone(880, { type: 'sine', d: 0.03, peak: 0.05 }); },
  card: () => { noise({ d: 0.12, f0: 1800, f1: 500, peak: 0.14 }); },
  draw: () => { noise({ d: 0.08, f0: 2400, f1: 900, peak: 0.08 }); },
  slash: () => { noise({ d: 0.18, f0: 3200, f1: 300, peak: 0.3, q: 1.4 }); tone(180, { type: 'sine', d: 0.12, peak: 0.25, slide: -120 }); },
  hit: () => { tone(120, { type: 'sine', d: 0.22, peak: 0.4, slide: -70 }); noise({ d: 0.1, f0: 500, f1: 120, peak: 0.2, type: 'lowpass' }); },
  blocked: () => { tone(320, { type: 'square', d: 0.08, peak: 0.1 }); noise({ d: 0.1, f0: 4000, f1: 2000, peak: 0.1, q: 6 }); },
  block: () => { tone(240, { type: 'triangle', d: 0.12, peak: 0.18 }); tone(360, { type: 'triangle', d: 0.1, peak: 0.1, delay: 0.03 }); },
  poison: () => { tone(300, { type: 'sine', d: 0.2, peak: 0.14, slide: -160 }); noise({ d: 0.22, f0: 900, f1: 300, peak: 0.08, q: 3 }); },
  debuff: () => { tone(420, { type: 'sawtooth', d: 0.25, peak: 0.08, slide: -220 }); },
  buff: () => { tone(392, { type: 'triangle', d: 0.14, peak: 0.14 }); tone(523, { type: 'triangle', d: 0.16, peak: 0.14, delay: 0.07 }); },
  heal: () => { tone(523, { type: 'sine', d: 0.2, peak: 0.14 }); tone(659, { type: 'sine', d: 0.24, peak: 0.12, delay: 0.09 }); tone(784, { type: 'sine', d: 0.3, peak: 0.1, delay: 0.18 }); },
  energy: () => { tone(700, { type: 'triangle', d: 0.1, peak: 0.12, slide: 300 }); },
  coin: () => { tone(988, { type: 'square', d: 0.06, peak: 0.08 }); tone(1319, { type: 'square', d: 0.12, peak: 0.08, delay: 0.06 }); },
  potion: () => { tone(500, { type: 'sine', d: 0.12, peak: 0.14, slide: 300 }); noise({ d: 0.14, f0: 1200, f1: 2600, peak: 0.06 }); },
  death: () => { tone(90, { type: 'sawtooth', d: 0.5, peak: 0.22, slide: -50 }); noise({ d: 0.4, f0: 600, f1: 60, peak: 0.18, type: 'lowpass' }); },
  bigDeath: () => { tone(60, { type: 'sawtooth', d: 1.1, peak: 0.32, slide: -30 }); noise({ d: 0.9, f0: 900, f1: 40, peak: 0.26, type: 'lowpass' }); },
  turn: () => { tone(392, { type: 'triangle', d: 0.1, peak: 0.1 }); tone(587, { type: 'triangle', d: 0.14, peak: 0.1, delay: 0.08 }); },
  victory: () => { [523, 659, 784, 1047].forEach((f, i) => tone(f, { type: 'triangle', d: 0.35, peak: 0.16, delay: i * 0.13 })); },
  defeat: () => { [330, 277, 220, 165].forEach((f, i) => tone(f, { type: 'sawtooth', d: 0.5, peak: 0.12, delay: i * 0.22 })); },
  relic: () => { [659, 831, 988].forEach((f, i) => tone(f, { type: 'sine', d: 0.3, peak: 0.12, delay: i * 0.09 })); },
  upgrade: () => { tone(440, { type: 'triangle', d: 0.15, peak: 0.14 }); tone(880, { type: 'triangle', d: 0.3, peak: 0.12, delay: 0.1 }); },
  map: () => { noise({ d: 0.25, f0: 500, f1: 1500, peak: 0.06 }); tone(330, { type: 'sine', d: 0.2, peak: 0.08 }); },
  chip: () => { tone(1420, { type: 'triangle', d: 0.05, peak: 0.14 }); noise({ d: 0.06, f0: 5200, f1: 3200, peak: 0.1, q: 5 }); },
  shatter: () => { noise({ d: 0.42, f0: 4200, f1: 260, peak: 0.3, q: 3.5 }); tone(220, { type: 'sine', d: 0.3, peak: 0.24, slide: -140 }); tone(1760, { type: 'triangle', d: 0.18, peak: 0.1, delay: 0.03 }); },
  ember: () => { tone(520, { type: 'sine', d: 0.12, peak: 0.12, slide: 220 }); },
  kindle: () => { noise({ d: 0.3, f0: 900, f1: 2600, peak: 0.1 }); tone(392, { type: 'sine', d: 0.22, peak: 0.1, slide: 140 }); },
  stagger: () => { tone(233, { type: 'sawtooth', d: 0.38, peak: 0.1 }); tone(247, { type: 'sawtooth', d: 0.38, peak: 0.1, delay: 0.02 }); },
  art: () => { [392, 494, 587].forEach((f, i) => tone(f, { type: 'triangle', d: 0.28, peak: 0.13, delay: i * 0.07 })); noise({ d: 0.35, f0: 1400, f1: 3200, peak: 0.07 }); },
  omen: () => { tone(98, { type: 'sine', d: 1.1, peak: 0.2 }); tone(196, { type: 'sine', d: 0.9, peak: 0.1, delay: 0.12 }); tone(147, { type: 'triangle', d: 0.8, peak: 0.06, delay: 0.3 }); },
};

export const sfx = Object.fromEntries(
  Object.keys(synth).map((name) => [name, () => play(name, synth[name])])
);

// Retired Ambience Drone — kept as no-ops so stray imports don't throw during HMR.
export function setAmbience() {}
export function stopAmbience() {}
