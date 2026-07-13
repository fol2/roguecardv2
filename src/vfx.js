// 2D canvas VFX overlay + floating text + screen shake.
// All coordinates are STAGE px (the fixed virtual resolution, src/stage.js);
// the canvas backing store carries the real on-screen density.
import { stageW, stageH, stageScale, stageRect } from './stage.js';
import { VFX_IDS } from './presentation-catalog.js';
const REDUCED = matchMedia('(prefers-reduced-motion: reduce)').matches;
let canvas, ctx2, floatLayer, shakeEl;
let parts = [];
let flashes = [];
let shakeV = 0, shakeX = 0, shakeY = 0;
let hitstopUntil = 0;
let weather = null;
let weatherAcc = 0;
let weatherSpec = null;

export const LITE = matchMedia('(pointer: coarse)').matches;
// backing texels per stage px: real density (device DPR × stage scale), capped
// — sparks don't need more, and LITE devices need fill-rate headroom.
const DPR = () => Math.min(devicePixelRatio * stageScale(), LITE ? 1 : 2);
const cnt = (n) => (LITE ? Math.max(2, Math.round(n * 0.4)) : n);

export function initVfx() {
  canvas = document.getElementById('vfx');
  ctx2 = canvas.getContext('2d');
  floatLayer = document.getElementById('floaties');
  shakeEl = document.getElementById('shake');
  const fit = () => { canvas.width = stageW() * DPR(); canvas.height = stageH() * DPR(); };
  fit();
  addEventListener('resize', fit); // registered after stage.js's — scale is fresh
  requestAnimationFrame(tick);
}

// test-harness freeze: stop the particle loop and blank the canvas so
// screenshots are deterministic (one-way per page; only __probe calls this)
let frozen = false;
export function freezeVfx() {
  frozen = true;
  parts = [];
  flashes = [];
  if (ctx2) ctx2.clearRect(0, 0, canvas.width, canvas.height);
}

/** Apply theme weather record (from packs/core themes). Pass null to clear. */
export function setWeather(weatherRecord, { boss = false, mult = 1 } = {}) {
  parts = parts.filter((p) => !p.weather);
  weatherSpec = weatherRecord || null;
  weather = weatherSpec ? { boss, mult } : null;
  weatherAcc = 0;
}

let lastT = 0;
function tick(t) {
  if (frozen) return;
  requestAnimationFrame(tick);
  const dt = Math.min(0.05, (t - lastT) / 1000 || 0.016);
  lastT = t;
  if (t < hitstopUntil) return; // freeze frame
  if (weather && weatherSpec && !REDUCED) {
    const w = weatherSpec;
    weatherAcc += dt * w.rate * (weather.boss ? 1.4 : 1) * weather.mult * (LITE ? 0.6 : 1);
    while (weatherAcc >= 1) {
      weatherAcc -= 1;
      const ember = Math.random() < w.emberRate * 0.1;
      const rnd = (a) => a[0] + Math.random() * (a[1] - a[0]);
      parts.push({
        kind: 'dot',
        weather: true,
        x: Math.random() * stageW(), y: ember ? stageH() + 6 : -6,
        vx: rnd(w.vx), vy: ember ? -rnd([14, 34]) : rnd(w.vy),
        size: rnd(w.size) * (ember ? 1.3 : 1),
        color: ember ? '#ffd166' : w.colors[(Math.random() * w.colors.length) | 0],
        grav: 0, drag: w.drift * 0.1,
        life: 9, fade: 3, add: ember, alpha: ember ? 0.9 : 0.35,
      });
    }
  }
  const dpr = DPR();
  ctx2.clearRect(0, 0, canvas.width, canvas.height);
  ctx2.save();
  ctx2.scale(dpr, dpr);
  // particles
  parts = parts.filter((p) => (p.life -= dt) > 0);
  for (const p of parts) {
    p.x += p.vx * dt; p.y += p.vy * dt;
    p.vy += (p.grav || 0) * dt;
    p.vx *= 1 - (p.drag || 0) * dt; p.vy *= 1 - (p.drag || 0) * dt;
    const a = Math.min(1, p.life / (p.fade || 0.3));
    ctx2.globalAlpha = a * (p.alpha ?? 1);
    ctx2.globalCompositeOperation = p.add ? 'lighter' : 'source-over';
    if (p.kind === 'spark') {
      const len = Math.hypot(p.vx, p.vy) * 0.045 + 2;
      const ang = Math.atan2(p.vy, p.vx);
      ctx2.strokeStyle = p.color;
      ctx2.lineWidth = p.size * a;
      ctx2.beginPath();
      ctx2.moveTo(p.x, p.y);
      ctx2.lineTo(p.x - Math.cos(ang) * len, p.y - Math.sin(ang) * len);
      ctx2.stroke();
    } else if (p.kind === 'ring') {
      p.r += p.vr * dt;
      ctx2.strokeStyle = p.color;
      ctx2.lineWidth = Math.max(0.5, p.size * a);
      ctx2.beginPath();
      ctx2.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx2.stroke();
    } else if (p.kind === 'slash') {
      p.prog = Math.min(1, (p.prog || 0) + dt / p.dur);
      const sweep = p.arc * p.prog;
      ctx2.strokeStyle = p.color;
      ctx2.lineCap = 'round';
      for (let i = 0; i < 3; i++) {
        ctx2.globalAlpha = a * (0.9 - i * 0.3);
        ctx2.lineWidth = (p.size - i * 3) * (1 - p.prog * 0.6);
        ctx2.beginPath();
        ctx2.arc(p.x, p.y, p.r + i * 7, p.a0, p.a0 + sweep);
        ctx2.stroke();
      }
    } else {
      ctx2.fillStyle = p.color;
      ctx2.beginPath();
      ctx2.arc(p.x, p.y, p.size * a, 0, Math.PI * 2);
      ctx2.fill();
    }
  }
  ctx2.globalCompositeOperation = 'source-over';
  ctx2.globalAlpha = 1;
  // flashes
  flashes = flashes.filter((f) => (f.life -= dt) > 0);
  for (const f of flashes) {
    ctx2.globalAlpha = (f.life / f.dur) * f.alpha;
    ctx2.fillStyle = f.color;
    ctx2.fillRect(0, 0, stageW(), stageH());
  }
  ctx2.restore();
  // shake spring
  if (shakeV > 0.1 || Math.abs(shakeX) > 0.1) {
    shakeX = (Math.random() - 0.5) * shakeV;
    shakeY = (Math.random() - 0.5) * shakeV;
    shakeV *= Math.pow(0.001, dt); // decay
    shakeEl.style.transform = `translate(${shakeX.toFixed(1)}px,${shakeY.toFixed(1)}px)`;
  } else if (shakeEl.style.transform) {
    shakeEl.style.transform = '';
    shakeV = 0;
  }
}

export function shake(power = 8) { if (REDUCED) return; shakeV = Math.max(shakeV, power); }
/**
 * Round 5 shake offset reader. The Pixi world root subscribes to this on
 * every ticker so its transform stays glued to `#shake`'s DOM transform.
 * Returns the exact stage-px offset currently applied to `#shake`.
 */
export function readShakeOffset() { return { x: shakeX, y: shakeY }; }
export function hitstop(ms = 60) { if (REDUCED) return; hitstopUntil = performance.now() + ms; }
export function flash(color = '#fff', alpha = 0.18, dur = 0.25) { if (REDUCED) return; flashes.push({ color, alpha, dur, life: dur }); }

export function burst(x, y, { color = '#ffd166', n = 18, speed = 260, spread = Math.PI * 2, angle = 0, size = 3, grav = 300, kind = 'spark', add = true, life = 0.5 } = {}) {
  if (REDUCED) return;
  for (let i = 0; i < cnt(n); i++) {
    const a = angle + (Math.random() - 0.5) * spread;
    const v = speed * (0.35 + Math.random() * 0.75);
    parts.push({ kind, x, y, vx: Math.cos(a) * v, vy: Math.sin(a) * v, size: size * (0.6 + Math.random() * 0.8), color, grav, drag: 1.6, life: life * (0.6 + Math.random() * 0.8), fade: 0.25, add });
  }
}
export function ring(x, y, color, r0 = 8, speed = 420, size = 4) {
  if (REDUCED) return;
  parts.push({ kind: 'ring', x, y, r: r0, vr: speed, size, color, life: 0.45, fade: 0.45, add: true });
}
export function slashArc(x, y, color = '#fff') {
  if (REDUCED) return;
  const a0 = -Math.PI * 0.85 + (Math.random() - 0.5) * 0.6;
  parts.push({ kind: 'slash', x, y, r: 46 + Math.random() * 18, a0, arc: Math.PI * 0.8, prog: 0, dur: 0.14, size: 13, color, life: 0.3, fade: 0.18, add: true });
}
export function motes(x, y, color, n = 10) {
  if (REDUCED) return;
  for (let i = 0; i < cnt(n); i++) {
    parts.push({ kind: 'dot', x: x + (Math.random() - 0.5) * 60, y: y + (Math.random() - 0.5) * 40, vx: (Math.random() - 0.5) * 30, vy: -40 - Math.random() * 60, size: 2.5 + Math.random() * 2.5, color, grav: -20, life: 0.9 + Math.random() * 0.5, fade: 0.5, add: true, alpha: 0.9 });
  }
}

export function floatText(x, y, text, cls = '', { tint = '', dx = 0 } = {}) {
  const el = document.createElement('div');
  el.className = `floaty ${cls}`;
  el.innerHTML = text; // trusted: only our own strings/icons ever flow here
  el.style.left = `${x + dx}px`;
  el.style.top = `${y}px`;
  if (tint) el.style.color = tint;
  floatLayer.appendChild(el);
  const drift = (Math.random() - 0.5) * 40;
  const isCrit = cls.includes('crit');
  const rot = isCrit ? (Math.random() - 0.5) * 16 : cls.includes('dmg') ? (Math.random() - 0.5) * 8 : 0;
  let kf, dur = 1100;
  if (isCrit) {
    // crits blaze: white-hot overshoot, a held beat, then the drift
    dur = 1250;
    kf = [
      { transform: 'translate(-50%,-50%) scale(0.5)', opacity: 0, filter: 'brightness(3)' },
      { transform: `translate(-50%,-92%) scale(1.45) rotate(${rot}deg)`, opacity: 1, filter: 'brightness(1.9)', offset: 0.13 },
      { transform: `translate(-50%,-110%) scale(1.05) rotate(${rot}deg)`, opacity: 1, filter: 'brightness(1)', offset: 0.34 },
      { transform: `translate(calc(-50% + ${drift}px),-230%) scale(0.98) rotate(${rot}deg)`, opacity: 0, filter: 'brightness(1)' },
    ];
  } else if (cls.includes('poisonf')) {
    // poison drips down instead of floating up
    kf = [
      { transform: 'translate(-50%,-50%) scale(0.7)', opacity: 0 },
      { transform: 'translate(-50%,-26%) scale(1.05)', opacity: 1, offset: 0.2 },
      { transform: `translate(calc(-50% + ${drift * 0.4}px),80%) scale(0.88)`, opacity: 0 },
    ];
  } else {
    kf = [
      { transform: 'translate(-50%,-50%) scale(0.6)', opacity: 0 },
      { transform: `translate(-50%,-90%) scale(1.15) rotate(${rot}deg)`, opacity: 1, offset: 0.18 },
      { transform: `translate(calc(-50% + ${drift}px),-230%) scale(0.95) rotate(${rot}deg)`, opacity: 0 },
    ];
  }
  el.animate(kf, { duration: dur, easing: 'cubic-bezier(.2,.7,.3,1)' }).onfinish = () => el.remove();
}

// Voronoi partition of the glass from its crack sites — the shatter breaks the
// body along the exact seams the crack shader showed. Sites live in texture uv
// (v points up); clip-path speaks y-down percentages, so v flips at this boundary.
const _bounds = [[0, 0], [100, 0], [100, 100], [0, 100]];
const _siteXY = (s) => [s.u * 100, (1 - s.v) * 100];
// keep the half of poly closer to F than O. The side test is linear in p, so the
// crossing is exact — bisection here drifted and produced overlapping cells.
function _clipHalf(poly, F, O) {
  const f = (p) => (p[0] - F[0]) ** 2 + (p[1] - F[1]) ** 2 - (p[0] - O[0]) ** 2 - (p[1] - O[1]) ** 2;
  const out = [];
  for (let i = 0; i < poly.length; i++) {
    const a = poly[i], b = poly[(i + 1) % poly.length];
    const fa = f(a), fb = f(b);
    const ix = () => { const t = fa / (fa - fb); return [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t]; };
    if (fa <= 0 && fb <= 0) out.push(b);
    else if (fa <= 0) out.push(ix());
    else if (fb <= 0) { out.push(ix()); out.push(b); }
  }
  return out;
}
// The crack sites carve fine cells where the blows landed; sparse jittered
// background sites let the final web race across the intact glass as larger
// slabs. Every seam through the cracked region IS a seam the shader lit.
function _voronoiParts(rawSites) {
  const sites = [];
  for (const s of rawSites || []) {
    if (!sites.some((q) => Math.hypot(q.u - s.u, q.v - s.v) < 0.02)) sites.push({ u: s.u, v: s.v });
  }
  if (sites.length < 3) return null;
  const aug = sites.slice();
  for (let gu = 0.1; gu < 1; gu += 0.21) for (let gv = 0.09; gv < 1; gv += 0.21) {
    const u = gu + (Math.random() - 0.5) * 0.12, v = gv + (Math.random() - 0.5) * 0.12;
    if (!aug.some((q) => Math.hypot(q.u - u, q.v - v) < 0.13)) aug.push({ u, v });
  }
  const pts = aug.map(_siteXY);
  const parts = [];
  for (let i = 0; i < pts.length; i++) {
    let poly = _bounds.map((p) => [...p]);
    for (let j = 0; j < pts.length && poly.length >= 3; j++) if (j !== i) poly = _clipHalf(poly, pts[i], pts[j]);
    if (poly.length < 3) continue;
    let area = 0, cx = 0, cy = 0;
    for (let k = 0; k < poly.length; k++) {
      const [x0, y0] = poly[k], [x1, y1] = poly[(k + 1) % poly.length];
      area += x0 * y1 - x1 * y0; cx += x0; cy += y0;
    }
    if (Math.abs(area) * 0.5 < 0.3) continue;
    parts.push({ poly, cx: cx / poly.length, cy: cy / poly.length });
  }
  if (parts.length < 3) return null;
  // the blow's centre: where the real cracks clustered — shards fly from here
  const ix = sites.reduce((s, p) => s + p.u, 0) / sites.length * 100;
  const iy = sites.reduce((s, p) => s + (1 - p.v), 0) / sites.length * 100;
  return { parts, ix, iy };
}
function _radialParts() {
  const cx = 50 + (Math.random() - 0.5) * 14, cy = 52 + (Math.random() - 0.5) * 14;
  const parts = [];
  for (let i = 0; i < 11; i++) {
    const a0 = (i / 11) * Math.PI * 2 + (Math.random() - 0.5) * 0.34;
    const a1 = ((i + 1) / 11) * Math.PI * 2 + (Math.random() - 0.5) * 0.34;
    const rr = 88 + Math.random() * 12;
    parts.push({
      poly: [[cx, cy], [cx + Math.cos(a0) * rr, cy + Math.sin(a0) * rr * 0.85], [cx + Math.cos(a1) * rr, cy + Math.sin(a1) * rr * 0.85]],
      cx: cx + Math.cos((a0 + a1) * 0.5) * rr * 0.45,
      cy: cy + Math.sin((a0 + a1) * 0.5) * rr * 0.38,
    });
  }
  return { parts, ix: cx, iy: cy };
}

// glass death: the body breaks into the Voronoi cells its cracks defined and the
// pieces fly out from the impact cluster. opts.capture carries the refracted frame.
export function shatter(el, opts = {}) {
  const vis = el.querySelector('svg:not(.cracks-overlay)') || el.querySelector('img.raster-art');
  const r = opts.rect || stageRect(el);
  if ((!vis && !opts.capture) || !r.width) return;
  if (REDUCED) { el.style.visibility = 'hidden'; return; }
  const html = opts.capture
    ? `<img src="${opts.capture}" alt="" style="width:100%;height:100%;object-fit:contain;display:block">`
    : vis.tagName === 'svg'
      ? vis.outerHTML
      : `<img src="${vis.src}" alt="" style="width:100%;height:100%;object-fit:contain;display:block">`;

  const { parts: cells, ix, iy } = _voronoiParts(opts.sites) || _radialParts();
  // ballistic shards: launched off the blow, pulled by gravity, tumbling, with a
  // damped bounce where each shard's own lowest edge meets the ground line (the
  // body art is bottom-anchored, so the rect's bottom IS the creature's feet)
  const G = 2400; // px/s² — glass is heavy; the fall should read fast
  const shards = [];
  for (const c of cells) {
    const pts = c.poly.map((p) => `${p[0].toFixed(2)}% ${p[1].toFixed(2)}%`).join(',');
    const w = document.createElement('div');
    w.style.cssText = `position:fixed;left:${r.left}px;top:${r.top}px;width:${r.width}px;height:${r.height}px;pointer-events:none;z-index:57;clip-path:polygon(${pts});will-change:transform,opacity;`;
    w.innerHTML = html;
    floatLayer.appendChild(w);
    let dx = c.cx - ix, dy = c.cy - iy;
    const len = Math.hypot(dx, dy) || 1;
    const near = Math.max(0, 1 - len / 75); // closer to the blow = more energy
    const speed = (120 + Math.random() * 240) * (0.85 + near * 0.75);
    shards.push({
      el: w, x: 0, y: 0, rot: 0, bounced: 0,
      vx: (dx / len) * speed,
      vy: (dy / len) * speed * 0.65 - (60 + Math.random() * 150), // outward + an upward kick
      vr: (Math.random() - 0.5) * 260,
      maxY: Math.max(...c.poly.map((p) => p[1])), // lowest vertex % — its personal floor
    });
  }
  let last = performance.now();
  const T0 = last;
  const step = (now) => {
    const dt = Math.min(0.032, (now - last) / 1000); last = now;
    const t = now - T0;
    let live = 0;
    for (const s of shards) {
      if (!s.el) continue;
      s.vy += G * dt;
      s.x += s.vx * dt; s.y += s.vy * dt; s.rot += s.vr * dt;
      const floor = r.height * (1 - s.maxY / 100) + 2;
      if (s.y > floor && s.vy > 0 && s.bounced < 2) {
        s.y = floor;
        s.vy *= -(0.34 - s.bounced * 0.12); // damped clink, weaker second bounce
        s.vx *= 0.6; s.vr *= 0.5; s.bounced++;
      }
      const fade = t < 650 ? 1 : Math.max(0, 1 - (t - 650) / 380);
      s.el.style.transform = `translate3d(${s.x.toFixed(1)}px,${s.y.toFixed(1)}px,0) rotate(${s.rot.toFixed(1)}deg)`;
      s.el.style.opacity = fade.toFixed(3);
      if (fade <= 0 || s.y > r.height * 1.5) { s.el.remove(); s.el = null; } else live++;
    }
    if (live) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
  el.style.visibility = 'hidden';
}

// centre of an element in STAGE px — the coordinate every effect layer speaks
export const centerOf = (el) => {
  const r = stageRect(el);
  return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
};

// ---- archetype primitives ----
export const ARCHETYPE_TONES = Object.freeze(Object.fromEntries(VFX_IDS.map((id) => {
  const tones = {
    slash: '#ffffff', pierce: '#cfe6ff', blunt: '#ffd8a0', fire: '#ff9a4d',
    poison: '#d3a15a', void: '#c99aff', ward: '#9fd4ff',
  };
  return [id, tones[id] || '#ffffff'];
})));

export function emberTrail(x0, y0, x1, y1, color = '#ff9a4d') {
  if (REDUCED) return;
  const n = cnt(14);
  for (let i = 0; i < n; i++) {
    const t = i / n, jx = (Math.random() - 0.5) * 26, jy = (Math.random() - 0.5) * 26;
    parts.push({ kind: 'dot', x: x0 + (x1 - x0) * t + jx, y: y0 + (y1 - y0) * t + jy, vx: (Math.random() - 0.5) * 40, vy: -30 - Math.random() * 50, size: 2 + Math.random() * 2.4, color, grav: -30, life: 0.5 + t * 0.4, fade: 0.3, add: true, alpha: 0.9 });
  }
}
export function droplets(x, y, color = '#d3a15a', n = 12) {
  if (REDUCED) return;
  for (let i = 0; i < cnt(n); i++) {
    parts.push({ kind: 'dot', x: x + (Math.random() - 0.5) * 54, y: y - 10 + (Math.random() - 0.5) * 30, vx: (Math.random() - 0.5) * 26, vy: 60 + Math.random() * 120, size: 2 + Math.random() * 2, color, grav: 420, drag: 0.4, life: 0.6 + Math.random() * 0.3, fade: 0.35, add: true });
  }
}
export function implosion(x, y, color = '#c99aff') {
  if (REDUCED) return;
  parts.push({ kind: 'ring', x, y, r: 64, vr: -160, size: 3.5, color, life: 0.4, fade: 0.4, add: true });
  for (let i = 0; i < cnt(16); i++) {
    const a = Math.random() * Math.PI * 2, d = 46 + Math.random() * 30;
    parts.push({ kind: 'spark', x: x + Math.cos(a) * d, y: y + Math.sin(a) * d, vx: -Math.cos(a) * (220 + Math.random() * 120), vy: -Math.sin(a) * (220 + Math.random() * 120), size: 2.2, color, grav: 0, drag: 2.4, life: 0.34, fade: 0.2, add: true });
  }
}
export function shardSpray(x, y, color = '#dfeaff', n = 12) {
  if (REDUCED) return;
  for (let i = 0; i < cnt(n); i++) {
    const a = -Math.PI / 2 + (Math.random() - 0.5) * 1.8;
    parts.push({ kind: 'spark', x, y, vx: Math.cos(a) * (200 + Math.random() * 260), vy: Math.sin(a) * (200 + Math.random() * 260), size: 2.6 + Math.random() * 1.6, color, grav: 520, drag: 0.6, life: 0.5 + Math.random() * 0.3, fade: 0.22, add: true });
  }
}

// ---- archetype hit dispatch: one entry point per landed hit ----
export function archetypeHit(x, y, archetype = 'slash', power = 0.3) {
  if (REDUCED) return;
  const tone = ARCHETYPE_TONES[archetype] || '#ffffff';
  const big = power > 0.55;
  switch (archetype) {
    case 'slash':
      slashArc(x, y, big ? '#ffd8a0' : '#ffffff');
      burst(x, y, { color: '#ff9a6a', n: big ? 26 : 12, speed: big ? 420 : 260 });
      break;
    case 'pierce': {
      const a0 = -Math.PI * 0.78;
      for (let i = 0; i < (big ? 3 : 2); i++) {
        parts.push({ kind: 'spark', x: x - Math.cos(a0) * 70, y: y - Math.sin(a0) * 70, vx: Math.cos(a0) * 900, vy: Math.sin(a0) * 900, size: 3.4, color: tone, grav: 0, drag: 0, life: 0.16 + i * 0.03, fade: 0.1, add: true });
      }
      burst(x, y, { color: tone, n: big ? 18 : 9, speed: 300, spread: 1.4, angle: a0 + Math.PI });
      break;
    }
    case 'blunt':
      ring(x, y, tone, 6, big ? 720 : 520, 6);
      burst(x, y + 6, { color: '#e8d8b8', n: big ? 24 : 12, speed: big ? 380 : 240, spread: Math.PI, angle: -Math.PI / 2, grav: 620, kind: 'dot' });
      shake(big ? 14 : 8);
      break;
    case 'fire':
      burst(x, y, { color: '#ffd166', n: big ? 22 : 12, speed: 240, grav: -120, life: 0.7 });
      burst(x, y, { color: '#ff6a3a', n: big ? 14 : 8, speed: 160, grav: -60, size: 3.6, kind: 'dot', life: 0.8 });
      break;
    case 'poison':
      droplets(x, y, '#d3a15a', big ? 18 : 10);
      motes(x, y, '#b8b0a0', 8);
      break;
    case 'void':
      implosion(x, y, tone);
      if (big) flash('#c99aff', 0.08, 0.25);
      break;
    case 'ward':
      // meshWard owns the gemstone shell; keep a light mote underlay only
      motes(x, y, tone, big ? 8 : 5);
      break;
  }
}

// ---- bespoke signature moments (called once at first impact of the play) ----
const impactFrame = () => { if (!REDUCED && !LITE) { flash('#ffffff', 0.28, 0.09); hitstop(90); } };
export const BESPOKE_VFX = {
  annihilate: (x, y) => { impactFrame(); flash('#ff6a3a', 0.16, 0.5); for (const dx of [-140, 0, 140]) burst(x + dx, y, { color: '#ffd166', n: 18, speed: 300, grav: -100, life: 0.8 }); shake(16); },
  oblivionStrike: (x, y) => { impactFrame(); hitstop(140); ring(x, y, '#ffd8a0', 8, 900, 7); ring(x, y, '#ffffff', 4, 1200, 4); shardSpray(x, y, '#dfeaff', 22); shake(20); },
  tempest: (x, y) => { for (let i = 0; i < 3; i++) setTimeout(() => shardSpray(x + (Math.random() - 0.5) * 160, y - 60, '#cfe6ff', 12), i * 90); },
  executioner: (x, y) => { impactFrame(); slashArc(x, y, '#ffffff'); ring(x, y, '#ff6b6b', 10, 700, 5); shake(14); },
  novaflare: (x, y) => { impactFrame(); flash('#ffd166', 0.2, 0.45); ring(x, y, '#ffd166', 6, 1000, 6); burst(x, y, { color: '#fff3d6', n: 30, speed: 520, grav: -40, life: 0.9 }); },
  shardstorm: (x, y) => { for (let i = 0; i < 4; i++) setTimeout(() => shardSpray(x + (Math.random() - 0.5) * 200, y - 40, '#dfeaff', 10), i * 70); },
  ascension: (x, y) => { emberTrail(x, y + 120, x, y - 120, '#ffd166'); motes(x, y - 40, '#ffe9ac', 16); },
  limitBreak: (x, y) => { impactFrame(); ring(x, y, '#8fd0ff', 10, 800, 6); shardSpray(x, y, '#cfe6ff', 18); shake(12); },
  phantomBlades: (x, y) => { for (let i = 0; i < 4; i++) setTimeout(() => slashArc(x + (Math.random() - 0.5) * 60, y + (Math.random() - 0.5) * 40, '#c9b0ff'), i * 70); },
  pyreheart: (x, y) => { burst(x, y, { color: '#ff5964', n: 14, speed: 180, grav: -80, kind: 'dot', life: 0.9 }); motes(x, y, '#ffd166', 10); },
  emberdance: (x, y) => { for (let i = 0; i < 3; i++) setTimeout(() => emberTrail(x - 80 + i * 80, y + 60, x + 80 - i * 80, y - 60, '#ff9a4d'), i * 100); },
  devour: (x, y) => { implosion(x, y, '#c99aff'); setTimeout(() => burst(x, y, { color: '#ff9a4d', n: 16, speed: 260, grav: -120 }), 180); },
  'art:flare': (x, y) => { flash('#ff9a4d', 0.18, 0.4); burst(x, y, { color: '#ffd166', n: 26, speed: 420, grav: -60 }); shake(10); },
  'art:mendglass': (x, y) => { ring(x, y, '#7ddb8f', 14, 420, 4); motes(x, y, '#d9fbe7', 14); },
  'art:beacon': (x, y) => { flash('#ffe9ac', 0.14, 0.5); emberTrail(x, y + 100, x, y - 140, '#ffe9ac'); },
  'art:emberveil': (x, y) => { ring(x, y, '#9fd4ff', 10, 520, 5); ring(x, y, '#ffd166', 20, 380, 3); },
  'art:stoke': (x, y) => { burst(x, y, { color: '#ff6a3a', n: 18, speed: 220, grav: -140, life: 0.8 }); },
  'art:ashfall': (x, y) => { for (let i = 0; i < 3; i++) setTimeout(() => droplets(x + (Math.random() - 0.5) * 220, y - 80, '#b8b0a0', 12), i * 120); },
};
