// 2D canvas VFX overlay + floating text + screen shake.
const REDUCED = matchMedia('(prefers-reduced-motion: reduce)').matches;
let canvas, ctx2, floatLayer, shakeEl;
let parts = [];
let flashes = [];
let shakeV = 0, shakeX = 0, shakeY = 0;
let hitstopUntil = 0;

// a DPR-3 phone doesn't need a 9x pixel canvas for sparks — cap at 2
const DPR = () => Math.min(devicePixelRatio, 2);
export const LITE = matchMedia('(pointer: coarse)').matches;
const cnt = (n) => (LITE ? Math.max(3, Math.round(n * 0.6)) : n);

export function initVfx() {
  canvas = document.getElementById('vfx');
  ctx2 = canvas.getContext('2d');
  floatLayer = document.getElementById('floaties');
  shakeEl = document.getElementById('shake');
  const fit = () => { canvas.width = innerWidth * DPR(); canvas.height = innerHeight * DPR(); };
  fit();
  addEventListener('resize', fit);
  requestAnimationFrame(tick);
}

let lastT = 0;
function tick(t) {
  requestAnimationFrame(tick);
  const dt = Math.min(0.05, (t - lastT) / 1000 || 0.016);
  lastT = t;
  if (t < hitstopUntil) return; // freeze frame
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
    ctx2.fillRect(0, 0, innerWidth, innerHeight);
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
export function hitstop(ms = 60) { if (REDUCED) return; hitstopUntil = performance.now() + ms; }
export function flash(color = '#fff', alpha = 0.18, dur = 0.25) { if (REDUCED) return; flashes.push({ color, alpha, dur, life: dur }); }

export function burst(x, y, { color = '#ffd166', n = 18, speed = 260, spread = Math.PI * 2, angle = 0, size = 3, grav = 300, kind = 'spark', add = true, life = 0.5 } = {}) {
  if (REDUCED) return;
  for (let i = 0; i < n; i++) {
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
  for (let i = 0; i < n; i++) {
    parts.push({ kind: 'dot', x: x + (Math.random() - 0.5) * 60, y: y + (Math.random() - 0.5) * 40, vx: (Math.random() - 0.5) * 30, vy: -40 - Math.random() * 60, size: 2.5 + Math.random() * 2.5, color, grav: -20, life: 0.9 + Math.random() * 0.5, fade: 0.5, add: true, alpha: 0.9 });
  }
}

export function floatText(x, y, text, cls = '') {
  const el = document.createElement('div');
  el.className = `floaty ${cls}`;
  el.innerHTML = text; // trusted: only our own strings/icons ever flow here
  el.style.left = `${x}px`;
  el.style.top = `${y}px`;
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

// glass death: clone the creature's svg into a fan of clip-path shards and
// throw them outward — the body literally breaks apart along the light.
export function shatter(el) {
  const vis = el.querySelector('svg') || el.querySelector('img.raster-art');
  const r = el.getBoundingClientRect();
  if (!vis || !r.width) return;
  if (REDUCED) { el.style.visibility = 'hidden'; return; }
  const html = vis.tagName === 'svg'
    ? vis.outerHTML
    : `<img src="${vis.src}" alt="" style="width:100%;height:100%;object-fit:contain;display:block">`;
  const cx = 50 + (Math.random() - 0.5) * 14, cy = 52 + (Math.random() - 0.5) * 14;
  const K = 11;
  const ring = [];
  for (let i = 0; i < K; i++) {
    const a = (i / K) * Math.PI * 2 + (Math.random() - 0.5) * 0.34;
    const rr = 78 + Math.random() * 22;
    ring.push([cx + Math.cos(a) * rr, cy + Math.sin(a) * rr, a]);
  }
  for (let i = 0; i < K; i++) {
    const [x1, y1] = ring[i], [x2, y2] = ring[(i + 1) % K];
    const w = document.createElement('div');
    w.style.cssText = `position:fixed;left:${r.left}px;top:${r.top}px;width:${r.width}px;height:${r.height}px;pointer-events:none;z-index:57;clip-path:polygon(${cx}% ${cy}%,${x1.toFixed(1)}% ${y1.toFixed(1)}%,${x2.toFixed(1)}% ${y2.toFixed(1)}%);`;
    w.innerHTML = html;
    floatLayer.appendChild(w);
    const midA = ring[i][2] + Math.PI / K;
    const dist = 55 + Math.random() * 120;
    const dx = Math.cos(midA) * dist, dy = Math.sin(midA) * dist * 0.7;
    const rot = (Math.random() - 0.5) * 110;
    w.animate(
      [
        { transform: 'translate(0,0) rotate(0deg)', opacity: 1 },
        { transform: `translate(${(dx * 0.55).toFixed(0)}px,${(dy * 0.55 - 16).toFixed(0)}px) rotate(${(rot * 0.5).toFixed(0)}deg)`, opacity: 0.95, offset: 0.4 },
        { transform: `translate(${dx.toFixed(0)}px,${(dy + 110).toFixed(0)}px) rotate(${rot.toFixed(0)}deg)`, opacity: 0 },
      ],
      { duration: 780 + Math.random() * 300, easing: 'cubic-bezier(.3,.3,.6,1)' }
    ).onfinish = () => w.remove();
  }
  el.style.visibility = 'hidden';
}

export const centerOf = (el) => {
  const r = el.getBoundingClientRect();
  return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
};

// ---- archetype primitives ----
export const ARCHETYPE_TONES = { slash: '#ffffff', pierce: '#cfe6ff', blunt: '#ffd8a0', fire: '#ff9a4d', poison: '#d3a15a', void: '#c99aff', ward: '#9fd4ff' };

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
      burst(x, y, { color: '#ff9a6a', n: cnt(big ? 26 : 12), speed: big ? 420 : 260 });
      break;
    case 'pierce': {
      const a0 = -Math.PI * 0.78;
      for (let i = 0; i < (big ? 3 : 2); i++) {
        parts.push({ kind: 'spark', x: x - Math.cos(a0) * 70, y: y - Math.sin(a0) * 70, vx: Math.cos(a0) * 900, vy: Math.sin(a0) * 900, size: 3.4, color: tone, grav: 0, drag: 0, life: 0.16 + i * 0.03, fade: 0.1, add: true });
      }
      burst(x, y, { color: tone, n: cnt(big ? 18 : 9), speed: 300, spread: 1.4, angle: a0 + Math.PI });
      break;
    }
    case 'blunt':
      ring(x, y, tone, 6, big ? 720 : 520, 6);
      burst(x, y + 6, { color: '#e8d8b8', n: cnt(big ? 24 : 12), speed: big ? 380 : 240, spread: Math.PI, angle: -Math.PI / 2, grav: 620, kind: 'dot' });
      shake(big ? 14 : 8);
      break;
    case 'fire':
      burst(x, y, { color: '#ffd166', n: cnt(big ? 22 : 12), speed: 240, grav: -120, life: 0.7 });
      burst(x, y, { color: '#ff6a3a', n: cnt(big ? 14 : 8), speed: 160, grav: -60, size: 3.6, kind: 'dot', life: 0.8 });
      break;
    case 'poison':
      droplets(x, y, '#d3a15a', big ? 18 : 10);
      motes(x, y, '#b8b0a0', cnt(8));
      break;
    case 'void':
      implosion(x, y, tone);
      if (big) flash('#c99aff', 0.08, 0.25);
      break;
    case 'ward':
      ring(x, y, tone, 12, 460, 4);
      motes(x, y, tone, cnt(8));
      break;
  }
}
