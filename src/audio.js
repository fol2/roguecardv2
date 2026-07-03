// WebAudio-synthesized SFX + ambient drone. No assets.
let ctx = null, master = null, ambGain = null, ambNodes = [];
let muted = localStorage.getItem('spirebound_mute') === '1';

function ensure() {
  if (ctx) return true;
  try {
    ctx = new (window.AudioContext || window.webkitAudioContext)();
    master = ctx.createGain();
    master.gain.value = muted ? 0 : 0.5;
    master.connect(ctx.destination);
  } catch { return false; }
  return true;
}
export function unlock() { if (ensure() && ctx.state === 'suspended') ctx.resume(); }
export function isMuted() { return muted; }
export function toggleMute() {
  muted = !muted;
  localStorage.setItem('spirebound_mute', muted ? '1' : '0');
  if (master) master.gain.linearRampToValueAtTime(muted ? 0 : 0.5, ctx.currentTime + 0.1);
  return muted;
}

function env(node, t0, a, peak, d) {
  node.gain.setValueAtTime(0.0001, t0);
  node.gain.exponentialRampToValueAtTime(peak, t0 + a);
  node.gain.exponentialRampToValueAtTime(0.0001, t0 + a + d);
}
function tone(freq, { type = 'sine', a = 0.005, d = 0.2, peak = 0.3, slide = 0, delay = 0 } = {}) {
  if (!ensure()) return;
  const t0 = ctx.currentTime + delay;
  const o = ctx.createOscillator(), g = ctx.createGain();
  o.type = type;
  o.frequency.setValueAtTime(freq, t0);
  if (slide) o.frequency.exponentialRampToValueAtTime(Math.max(20, freq + slide), t0 + a + d);
  env(g, t0, a, peak, d);
  o.connect(g).connect(master);
  o.start(t0); o.stop(t0 + a + d + 0.05);
}
function noise({ a = 0.002, d = 0.15, peak = 0.25, f0 = 800, f1 = 300, q = 1, type = 'bandpass', delay = 0 } = {}) {
  if (!ensure()) return;
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
  src.connect(flt).connect(g).connect(master);
  src.start(t0); src.stop(t0 + a + d + 0.05);
}

export const sfx = {
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
};

const ACT_ROOTS = [55, 49, 41.2]; // A1, G1, E1
export function setAmbience(actIdx) {
  if (!ensure()) return;
  stopAmbience();
  ambGain = ctx.createGain();
  ambGain.gain.value = 0;
  ambGain.connect(master);
  const root = ACT_ROOTS[actIdx] || 55;
  const flt = ctx.createBiquadFilter();
  flt.type = 'lowpass'; flt.frequency.value = 320; flt.Q.value = 0.6;
  flt.connect(ambGain);
  for (const [mult, det, vol] of [[1, 0, 0.5], [1.5, 3, 0.22], [2, -4, 0.3], [3, 2, 0.1]]) {
    const o = ctx.createOscillator(), g = ctx.createGain();
    o.type = 'sawtooth'; o.frequency.value = root * mult; o.detune.value = det;
    g.gain.value = vol;
    o.connect(g).connect(flt);
    o.start();
    ambNodes.push(o, g);
  }
  const lfo = ctx.createOscillator(), lfoG = ctx.createGain();
  lfo.frequency.value = 0.07; lfoG.gain.value = 90;
  lfo.connect(lfoG).connect(flt.frequency);
  lfo.start();
  ambNodes.push(lfo, lfoG, flt);
  ambGain.gain.linearRampToValueAtTime(0.11, ctx.currentTime + 3);
}
export function stopAmbience() {
  if (!ambGain) return;
  const g = ambGain, nodes = ambNodes;
  g.gain.linearRampToValueAtTime(0, ctx.currentTime + 1.2);
  setTimeout(() => { nodes.forEach((n) => { try { n.stop?.(); } catch { /* gain nodes */ } try { n.disconnect(); } catch { /* ok */ } }); try { g.disconnect(); } catch { /* ok */ } }, 1500);
  ambGain = null; ambNodes = [];
}
