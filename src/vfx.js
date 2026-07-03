// 2D canvas VFX overlay + floating text + screen shake.
let canvas, ctx2, floatLayer, shakeEl;
let parts = [];
let flashes = [];
let shakeV = 0, shakeX = 0, shakeY = 0;
let hitstopUntil = 0;

export function initVfx() {
  canvas = document.getElementById('vfx');
  ctx2 = canvas.getContext('2d');
  floatLayer = document.getElementById('floaties');
  shakeEl = document.getElementById('shake');
  const fit = () => { canvas.width = innerWidth * devicePixelRatio; canvas.height = innerHeight * devicePixelRatio; };
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
  const dpr = devicePixelRatio;
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

export function shake(power = 8) { shakeV = Math.max(shakeV, power); }
export function hitstop(ms = 60) { hitstopUntil = performance.now() + ms; }
export function flash(color = '#fff', alpha = 0.18, dur = 0.25) { flashes.push({ color, alpha, dur, life: dur }); }

export function burst(x, y, { color = '#ffd166', n = 18, speed = 260, spread = Math.PI * 2, angle = 0, size = 3, grav = 300, kind = 'spark', add = true, life = 0.5 } = {}) {
  for (let i = 0; i < n; i++) {
    const a = angle + (Math.random() - 0.5) * spread;
    const v = speed * (0.35 + Math.random() * 0.75);
    parts.push({ kind, x, y, vx: Math.cos(a) * v, vy: Math.sin(a) * v, size: size * (0.6 + Math.random() * 0.8), color, grav, drag: 1.6, life: life * (0.6 + Math.random() * 0.8), fade: 0.25, add });
  }
}
export function ring(x, y, color, r0 = 8, speed = 420, size = 4) {
  parts.push({ kind: 'ring', x, y, r: r0, vr: speed, size, color, life: 0.45, fade: 0.45, add: true });
}
export function slashArc(x, y, color = '#fff') {
  const a0 = -Math.PI * 0.85 + (Math.random() - 0.5) * 0.6;
  parts.push({ kind: 'slash', x, y, r: 46 + Math.random() * 18, a0, arc: Math.PI * 0.8, prog: 0, dur: 0.14, size: 13, color, life: 0.3, fade: 0.18, add: true });
}
export function motes(x, y, color, n = 10) {
  for (let i = 0; i < n; i++) {
    parts.push({ kind: 'dot', x: x + (Math.random() - 0.5) * 60, y: y + (Math.random() - 0.5) * 40, vx: (Math.random() - 0.5) * 30, vy: -40 - Math.random() * 60, size: 2.5 + Math.random() * 2.5, color, grav: -20, life: 0.9 + Math.random() * 0.5, fade: 0.5, add: true, alpha: 0.9 });
  }
}

export function floatText(x, y, text, cls = '') {
  const el = document.createElement('div');
  el.className = `floaty ${cls}`;
  el.textContent = text;
  el.style.left = `${x}px`;
  el.style.top = `${y}px`;
  floatLayer.appendChild(el);
  const drift = (Math.random() - 0.5) * 40;
  el.animate(
    [
      { transform: 'translate(-50%,-50%) scale(0.6)', opacity: 0 },
      { transform: 'translate(-50%,-90%) scale(1.15)', opacity: 1, offset: 0.18 },
      { transform: `translate(calc(-50% + ${drift}px),-230%) scale(0.95)`, opacity: 0 },
    ],
    { duration: 1100, easing: 'cubic-bezier(.2,.7,.3,1)' }
  ).onfinish = () => el.remove();
}

export const centerOf = (el) => {
  const r = el.getBoundingClientRect();
  return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
};
