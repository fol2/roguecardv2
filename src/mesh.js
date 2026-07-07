// Mesh vertex-warp layer — one WebGL canvas, one plane per combatant/title hero.
// Idle only (intensity ~0.45 combat default); hit/attack stays in vfx.js. Falls back to static <img>.
// Plane positions/sizes are STAGE px (fixed virtual resolution, src/stage.js).
import * as THREE from 'three';
import { stageW, stageH, stageScale, stageRect } from './stage.js';

const SEG_X = 24, SEG_Y = 36, INTENSITY = 0.45;
const REDUCED = matchMedia('(prefers-reduced-motion: reduce)').matches;
const TOUCH = new URLSearchParams(location.search).get('input') === 'touch';
// LITE (coarse pointer / touch): the per-fragment refraction loop is too costly on
// low-power GPUs, so the crack shader stays dormant and cracks fall back to drawn SVG.
const LITE = TOUCH || matchMedia('(pointer: coarse)').matches;
// Mesh is cheap — only skip for reduced-motion or explicit touch mode (?input=touch).
export const meshEnabled = () => {
  const q = new URLSearchParams(location.search);
  if (q.get('mesh') === '0') return false;
  if (q.get('mesh') === '1') return true;
  return !REDUCED && !TOUCH;
};

const bell = (v, c, s) => Math.exp(-((v - c) ** 2) / (2 * s * s));
// deform weights by body archetype (data.js art.kind); float = whole-body hover scale
const PROFILE = {
  wisp: { sway: 0.55, bob: 1.85, breathe: 0.95, head: 0.4, cloth: 0, pin: 1.05, float: 1.35 },
  beast: { sway: 1.15, bob: 0.85, breathe: 0.65, head: 0.55, cloth: 0.2, float: 0 },
  slime: { sway: 0.55, bob: 0.55, breathe: 1.35, head: 0, cloth: 0.55, pin: 1.2, float: 0.25 },
  rogue: { sway: 1, bob: 1, breathe: 1, head: 1, cloth: 0.8, float: 0 },
  plant: { sway: 0.7, bob: 0.75, breathe: 0.85, head: 0.25, cloth: 1.15, pin: 1.1, float: 0.55 },
  cultist: { sway: 0.95, bob: 0.95, breathe: 1, head: 0.85, cloth: 0.7, float: 0 },
  golem: { sway: 0.28, bob: 0.25, breathe: 0.35, head: 0.15, cloth: 0, float: 0 },
  treeboss: { sway: 0.4, bob: 0.3, breathe: 0.5, head: 0.2, cloth: 0.6, float: 0 },
  zombie: { sway: 0.7, bob: 0.5, breathe: 0.6, head: 0.4, cloth: 0.3, float: 0 },
  serpent: { sway: 0.95, bob: 0.65, breathe: 0.45, head: 0.35, cloth: 0.15, float: 0.15 },
  crawler: { sway: 0.9, bob: 0.6, breathe: 0.55, head: 0.45, cloth: 0.1, float: 0 },
  crab: { sway: 0.5, bob: 0.35, breathe: 0.4, head: 0.2, cloth: 0, float: 0 },
  maw: { sway: 0.65, bob: 0.45, breathe: 0.7, head: 0.5, cloth: 0, float: 0.1 },
  knight: { sway: 0.85, bob: 0.7, breathe: 0.75, head: 0.7, cloth: 0.5, float: 0 },
  siren: { sway: 1.05, bob: 1.25, breathe: 0.8, head: 0.6, cloth: 0.9, pin: 1.1, float: 0.85 },
  leviathan: { sway: 0.35, bob: 0.25, breathe: 0.45, head: 0.3, cloth: 0.2, float: 0 },
  shade: { sway: 0.9, bob: 1.05, breathe: 0.7, head: 0.5, cloth: 0.6, pin: 1.1, float: 0.7 },
  eye: { sway: 0.35, bob: 1.45, breathe: 1, head: 0, cloth: 0, pin: 0.95, float: 1.2 },
  sovereign: { sway: 0.45, bob: 0.35, breathe: 0.55, head: 0.45, cloth: 0.35, float: 0 },
  humanoid: { sway: 1, bob: 1, breathe: 1, head: 1, cloth: 0.85, float: 0 },
};

let renderer, scene, camera, planes = [], raf = 0, W = 1, H = 1;
const texCache = new Map();
const loader = new THREE.TextureLoader();

function loadTex(url, onLoad) {
  if (texCache.has(url)) {
    const t = texCache.get(url);
    if (t.image?.width) onLoad?.(t);
    return t;
  }
  const t = loader.load(url, (tex) => {
    tex.colorSpace = THREE.SRGBColorSpace;
    onLoad?.(tex);
  });
  texCache.set(url, t);
  return t;
}

function artAspect(img, tex) {
  if (img?.naturalWidth > 0) return img.naturalWidth / img.naturalHeight;
  const im = tex?.image;
  if (im?.width > 0) return im.width / im.height;
  return 1;
}

function containSize(w, h, aspect) {
  if (!aspect || aspect <= 0) return { w, h };
  if (aspect >= w / h) return { w, h: w / aspect };
  return { w: h * aspect, h };
}

// ---- cracked-glass refraction shader ----
// The body is glass. Each landed hit drops a cluster of Voronoi "sites" onto the
// texture; the fragment shader assigns every fragment to its nearest site (a glass
// shard), refracts the body through that shard (a per-shard UV offset), and lights
// the shard seams (reflection). The crack is the seam discontinuity — never drawn.
const MAXSITES = 56;
const CRACK_VERT = /* glsl */`
  varying vec2 vUv;
  void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }
`;
const CRACK_FRAG = /* glsl */`
  #define MAXSITES ${MAXSITES}
  varying vec2 vUv;
  uniform sampler2D map;
  uniform vec4 uSites[MAXSITES];   // xy = site uv, zw = that shard's refraction offset
  uniform int uSiteCount;
  uniform float uCrack;            // global crack strength (fade-in / death ramp)
  uniform float uCrackR;           // how far a shard's fracture reaches, in aspect-uv
  uniform float uAspect;
  uniform float uDeath;            // 0..1: seams glow warm as the vessel fails
  uniform float uFlash;            // white hit beat
  void main() {
    vec2 uv = vUv;
    vec4 base = texture2D(map, uv);
    if (uSiteCount == 0) { gl_FragColor = vec4(base.rgb + uFlash * base.a, base.a); return; } // intact glass — no loop
    vec2 pt = vec2(uv.x * uAspect, uv.y);
    float d1 = 1e9, d2 = 1e9;
    vec2 off1 = vec2(0.0);
    for (int i = 0; i < MAXSITES; i++) {
      if (i >= uSiteCount) break;
      vec4 s = uSites[i];
      float d = distance(pt, vec2(s.x * uAspect, s.y));
      if (d < d1) { d2 = d1; d1 = d; off1 = s.zw; }
      else if (d < d2) { d2 = d; }
    }
    float within = 1.0 - smoothstep(uCrackR * 0.55, uCrackR, d1); // fade fracture → intact glass
    float g = uCrack * within;
    vec2 ruv = uv + off1 * g;                                     // refract through this shard
    vec4 rc = texture2D(map, ruv);
    vec3 col = mix(base.rgb, rc.rgb, rc.a);                       // don't drag transparent edges inward
    float edge = d2 - d1;
    float seam = (1.0 - smoothstep(0.0, 0.011, edge)) * within;  // soft glow band along the bisector
    float core = (1.0 - smoothstep(0.0, 0.0035, edge)) * within; // crisp bright crack line
    if (seam > 0.001) {                                          // chromatic bevel at the seam
      float ca = 0.006 * g + 0.002;
      col.r = mix(col.r, texture2D(map, ruv + vec2(ca, 0.0)).r, rc.a * seam);
      col.b = mix(col.b, texture2D(map, ruv - vec2(ca, 0.0)).b, rc.a * seam);
    }
    vec3 hi = mix(vec3(0.86, 0.93, 1.0), vec3(1.0, 0.64, 0.24), uDeath); // cool glass → warm fire
    col += hi * (seam * 0.3 + core * 0.95) * base.a * (1.0 + uDeath);  // seam glow + bright core
    col *= 1.0 - core * 0.22 * base.a;                          // thin dark score under the line
    col += uFlash * base.a;
    gl_FragColor = vec4(col, base.a);
  }
`;

function makePlane(url, profile, seed, img) {
  const geo = new THREE.PlaneGeometry(2, 2, SEG_X, SEG_Y);
  const base = geo.attributes.position.array.slice();
  const p = { geo, base, profile, seed, el: null, aspect: artAspect(img, null) || 2 / 3, siteCount: 0 };
  const tex = loadTex(url, (t) => { p.aspect = artAspect(img, t); });
  p.tex = tex;
  const uniforms = {
    map: { value: tex },
    uSites: { value: Array.from({ length: MAXSITES }, () => new THREE.Vector4()) },
    uSiteCount: { value: 0 },
    uCrack: { value: 1 },
    uCrackR: { value: 0.12 },
    uAspect: { value: p.aspect },
    uDeath: { value: 0 },
    uFlash: { value: 0 },
  };
  const mat = new THREE.ShaderMaterial({ uniforms, vertexShader: CRACK_VERT, fragmentShader: CRACK_FRAG, transparent: true, depthTest: false, depthWrite: false });
  p.mat = mat;
  const mesh = new THREE.Mesh(geo, mat);
  mesh.renderOrder = 1;
  scene.add(mesh);
  p.mesh = mesh;
  if (img && !img.complete) {
    img.addEventListener('load', () => { p.aspect = artAspect(img, tex); }, { once: true });
  }
  return p;
}

function deformPlane(p, t) {
  const pos = p.geo.attributes.position;
  const pr = p.profile;
  for (let i = 0; i < pos.count; i++) {
    const x0 = p.base[i * 3], y0 = p.base[i * 3 + 1];
    const v = (y0 + 1) / 2;
    const w = Math.pow(v, pr.pin ?? 1.6);
    let dx = 0, dy = 0;
    dx += 0.028 * w * pr.sway * Math.sin(t * 0.9 + p.seed);
    dx += 0.010 * w * w * pr.sway * Math.sin(t * 1.7 + 1 + p.seed * 0.3);
    const chest = bell(v, 0.62, 0.12);
    dx += x0 * 0.020 * chest * pr.breathe * Math.sin(t * 2.2 + p.seed * 0.5);
    dy += 0.012 * chest * pr.breathe * Math.sin(t * 2.2 + p.seed * 0.5);
    dy += 0.014 * w * pr.bob * Math.sin(t * 1.1 + 0.4 + p.seed);
    dx += 0.012 * Math.max(0, (v - 0.8) / 0.2) * pr.head * Math.sin(t * 0.7 + p.seed);
    dx += 0.010 * Math.max(0, (0.45 - v) / 0.45) * w * pr.cloth * Math.sin(v * 12 - t * 2.5 + p.seed);
    pos.array[i * 3] = x0 + dx * INTENSITY;
    pos.array[i * 3 + 1] = y0 + dy * INTENSITY;
  }
  pos.needsUpdate = true;
}

function layoutPlane(p, t = 0) {
  if (!p.el.isConnected || !(p.el.checkVisibility?.({ visibilityProperty: true }) ?? true)) { p.mesh.visible = false; return; }
  const r = stageRect(p.el);
  if (r.width < 2 || r.height < 2) { p.mesh.visible = false; return; }
  const img = p.el.querySelector('.raster-art');
  p.aspect = artAspect(img, p.tex) || p.aspect || 1;
  p.mat.uniforms.uAspect.value = p.aspect;
  const { w: dw, h: dh } = containSize(r.width, r.height, p.aspect);
  const fl = (p.profile.float || 0) * Math.sin(t * 1.15 + p.seed * 0.7) * 12 * INTENSITY;
  p.mesh.visible = true;
  p.mesh.position.set(r.left + r.width / 2 - W / 2, -(r.top + r.height / 2 - H / 2) + fl, 0);
  p.mesh.scale.set((p.flip ? -1 : 1) * dw / 2, dh / 2, 1);
}

function resize() {
  W = stageW(); H = stageH();
  renderer.setPixelRatio(Math.min(devicePixelRatio * stageScale(), 2));
  renderer.setSize(W, H, false); // CSS stays 100% of the stage
  camera.left = -W / 2; camera.right = W / 2;
  camera.top = H / 2; camera.bottom = -H / 2;
  camera.updateProjectionMatrix();
}

function tick(t) {
  if (!planes.length) return;
  const sec = t * 0.001;
  for (const p of planes) {
    deformPlane(p, sec);
    layoutPlane(p, sec);
  }
  renderer.render(scene, camera);
}

export function initMesh() {
  const canvas = document.getElementById('mesh');
  if (!canvas || renderer) return;
  renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true, powerPreference: 'high-performance' });
  renderer.setClearColor(0, 0);
  scene = new THREE.Scene();
  camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 100);
  camera.position.z = 10;
  resize();
  addEventListener('resize', resize);
}

export function meshClear() {
  cancelAnimationFrame(raf);
  raf = 0;
  for (const p of planes) {
    p.el?.classList.remove('mesh-live');
    scene.remove(p.mesh);
    p.geo.dispose();
    p.mesh.material.dispose();
  }
  planes = [];
  document.documentElement.classList.remove('mesh-on');
  renderer?.render(scene, camera);
}

/** Remove the plane bound to el (or any descendant of el) — the DOM <img> becomes visible again the same frame. */
export function meshRelease(el) {
  const i = planes.findIndex((p) => p.el === el || (el.contains && el.contains(p.el)));
  if (i < 0) return;
  const p = planes[i];
  p.el.classList.remove('mesh-live');
  scene.remove(p.mesh);
  p.geo.dispose();
  p.mesh.material.dispose();
  planes.splice(i, 1);
  if (!planes.length) document.documentElement.classList.remove('mesh-on');
  renderer?.render(scene, camera);
}

/** Brightness beat for hits — CSS filters don't reach WebGL planes. */
export function meshFlash(el, ms = 160) {
  const p = planes.find((q) => q.el === el || (el.contains && el.contains(q.el)));
  if (!p) return;
  p.mat.uniforms.uFlash.value = 0.9;
  setTimeout(() => { if (p.mat) p.mat.uniforms.uFlash.value = 0; }, ms);
}

const clampUv = (x) => Math.max(0.05, Math.min(0.95, x));
function addSite(p, u, v) {
  if (p.siteCount >= MAXSITES) return;
  const a = Math.random() * Math.PI * 2, m = 0.009 + Math.random() * 0.016; // this shard's refraction
  p.mat.uniforms.uSites.value[p.siteCount].set(u, v, Math.cos(a) * m, Math.sin(a) * m);
  p.siteCount++;
  p.mat.uniforms.uSiteCount.value = p.siteCount;
}
/** Fracture the glass at (u,v) in body-UV (0..1) — a cluster of shards. Returns
 *  false if el has no warp plane (caller falls back to the drawn crack). */
export function meshCrack(el, u = 0.32 + Math.random() * 0.36, v = 0.3 + Math.random() * 0.4) {
  if (LITE) return false; // drawn-crack fallback keeps the low-power tier cheap
  const p = planes.find((q) => q.el === el || (el.contains && el.contains(q.el)));
  if (!p) return false;
  const n = 5 + (Math.random() * 3 | 0);
  for (let k = 0; k < n; k++) {
    const a = Math.random() * Math.PI * 2, r = Math.random() * 0.045;
    addSite(p, clampUv(u + Math.cos(a) * r), clampUv(v + Math.sin(a) * r));
  }
  return true;
}
/** Ramp the warm seam-glow as the vessel fails (0..1). Returns false if no plane. */
export function meshDeath(el, amt) {
  if (LITE) return false; // drawn ignite handles the low-power tier
  const p = planes.find((q) => q.el === el || (el.contains && el.contains(q.el)));
  if (!p) return false;
  p.mat.uniforms.uDeath.value = amt;
  return true;
}

/** @param {{ el: Element, url: string, kind?: string }[]} entries */
export function meshBind(entries) {
  meshClear();
  if (!meshEnabled()) return;
  if (!renderer) initMesh();
  if (!renderer) return;
  for (const { el, url, kind, flip } of entries) {
    if (!url || !el) continue;
    const img = el.querySelector('.raster-art');
    if (!img) continue;
    el.classList.add('mesh-live');
    const profile = PROFILE[kind] || PROFILE.humanoid;
    const seed = Math.random() * 10;
    const p = makePlane(url, profile, seed, img);
    p.el = el;
    p.flip = !!flip;
    p.profile = profile;
    planes.push(p);
  }
  if (!planes.length) return;
  document.documentElement.classList.add('mesh-on');
  const loop = (t) => { raf = requestAnimationFrame(loop); tick(t); };
  raf = requestAnimationFrame(loop);
}

export const meshDebug = () => ({
  enabled: meshEnabled(),
  planes: planes.length,
  renderer: !!renderer,
  looping: !!raf,
  intensity: INTENSITY,
  sites: planes.reduce((m, p) => Math.max(m, p.siteCount || 0), 0),
  death: planes.reduce((m, p) => Math.max(m, p.mat?.uniforms?.uDeath?.value || 0), 0),
});

export function meshProfile(kind) { return PROFILE[kind] || PROFILE.humanoid; }
