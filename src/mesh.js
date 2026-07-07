// Mesh vertex-warp layer — one WebGL canvas, one plane-stack per combatant/title hero.
// Idle only (intensity ~0.45 combat default); hit/attack stays in vfx.js. Falls back to static <img>.
// Plane positions/sizes are STAGE px (fixed virtual resolution, src/stage.js).
//
// GLASS (the shipped "Panel B" architecture, 2026-07-07 — see docs/glass-crack-rendering.md):
// every combatant is a stack of planes sharing one deformed geometry —
//   body  (opaque once cracked, so it lands in the transmission back-buffer)
//   fire  (opaque ADDITIVE seam-glow at death: the glass refracts the burning cracks)
//   glass (MeshPhysicalMaterial transmission wearing baked crack alpha + normal maps)
//   beams (additive light shafts escaping the silhouette, scaled past the body)
// The old "Panel A" per-fragment Voronoi refraction shader is superseded; crack
// sites live in JS now and drive canvas bakes instead of shader uniforms.
import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { stageW, stageH, stageScale, stageRect } from './stage.js';

const SEG_X = 24, SEG_Y = 36, INTENSITY = 0.45;
const REDUCED = matchMedia('(prefers-reduced-motion: reduce)').matches;
const TOUCH = new URLSearchParams(location.search).get('input') === 'touch';
// LITE (coarse pointer / touch): transmission + canvas re-bakes are too costly on
// low-power GPUs, so the glass stays dormant and cracks fall back to drawn SVG.
const LITE = TOUCH || matchMedia('(pointer: coarse)').matches;
// Mesh is cheap — only skip for reduced-motion or explicit touch mode (?input=touch).
export const meshEnabled = () => {
  const q = new URLSearchParams(location.search);
  if (q.get('mesh') === '0') return false;
  if (q.get('mesh') === '1') return true;
  return !REDUCED && !TOUCH;
};

// ---- approved glass + beam measures (user sign-off 2026-07-07) ----
const GLASS_AREA = 0.45;   // how far the glass reaches past each crack site (uv)
const GLASS_FEATHER = 1;   // edge softness: 1 = fade from the core, no visible disc
const GLASS_ALPHA = 1;     // shell opacity
const BEAM_STR = 2.5;      // how hard the light escapes
const BEAM_REACH = 1.1;    // how far the shafts stretch
const BEAM_DECAY = 1.55;   // how fast a ray dies along its length
const BEAM_PAD = 1.6;      // beams plane is padded past the body so rays leave the sprite
const BAKE_N = 192;        // bake resolution: crack maps are soft — 192² keeps rebakes quick

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
let envReady = false; // PMREM environment + lights, added lazily with the first glass shell
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

// ---- body shader: raster art + hit flash. uCut > 0 flips it opaque (alpha
// discard) so the body lands in the transmission back-buffer for the glass ----
const BODY_VERT = /* glsl */`
  varying vec2 vUv;
  void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }
`;
const BODY_FRAG = /* glsl */`
  varying vec2 vUv;
  uniform sampler2D map;
  uniform float uFlash;  // white hit beat
  uniform float uCut;    // 0 = soft transparent edges; >0 = opaque with alpha discard
  void main() {
    vec4 base = texture2D(map, vUv);
    if (uCut > 0.0 && base.a < uCut) discard;
    gl_FragColor = vec4(base.rgb + uFlash * base.a, uCut > 0.0 ? 1.0 : base.a);
    // sRGB texture decodes to linear on sample — convert back on output or the
    // body renders darker than the raster it replaces (no tone mapping either:
    // ACES is for the PBR glass, the body must stay UI-accurate)
    #include <colorspace_fragment>
  }
`;

function makePlane(url, profile, seed, img) {
  const geo = new THREE.PlaneGeometry(2, 2, SEG_X, SEG_Y);
  const base = geo.attributes.position.array.slice();
  const p = {
    geo, base, profile, seed, el: null, aspect: artAspect(img, null) || 2 / 3,
    sites: [], death: 0, glass: null, fire: null, beams: null, bodyPx: null,
  };
  const tex = loadTex(url, (t) => { p.aspect = artAspect(img, t); });
  p.tex = tex;
  const uniforms = { map: { value: tex }, uFlash: { value: 0 }, uCut: { value: 0 } };
  const mat = new THREE.ShaderMaterial({ uniforms, vertexShader: BODY_VERT, fragmentShader: BODY_FRAG, transparent: true, depthTest: false, depthWrite: false });
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

// ---- crack bakes (ports of the approved glass-compare playground bakes) ----
// Body-alpha lookup at bake resolution, cached per plane.
function bodyPixels(p) {
  if (p.bodyPx) return p.bodyPx;
  const im = p.tex?.image;
  if (!im?.width) return null;
  const c = Object.assign(document.createElement('canvas'), { width: BAKE_N, height: BAKE_N });
  const ctx = c.getContext('2d');
  ctx.drawImage(im, 0, 0, BAKE_N, BAKE_N);
  p.bodyPx = ctx.getImageData(0, 0, BAKE_N, BAKE_N).data;
  return p.bodyPx;
}
const siteXY = (p) => p.sites.map((s) => ({ x: s.u * BAKE_N, y: (1 - s.v) * BAKE_N })); // canvas y-down vs uv

// Crack-region mask: bright where the glass fractured AND we're on the body,
// feathering to 0 at the region edge. The shell wears this as its alpha, so
// glass exists ONLY at the cracks — no hard disc boundary.
function bakeCrackMask(p) {
  const N = BAKE_N, alpha = bodyPixels(p);
  const c = Object.assign(document.createElement('canvas'), { width: N, height: N });
  const ctx = c.getContext('2d');
  const out = ctx.createImageData(N, N);
  const S = siteXY(p);
  const R = GLASS_AREA * N, inner = R * (1 - 0.9 * GLASS_FEATHER);
  for (let y = 0; y < N; y++) for (let x = 0; x < N; x++) {
    const i = (y * N + x) * 4;
    let t = 0;
    if (alpha[i + 3] > 90) {
      let d1 = 1e12;
      for (const s of S) { const dx = x - s.x, dy = y - s.y, d = dx * dx + dy * dy; if (d < d1) d1 = d; }
      const d = Math.sqrt(d1);
      t = d <= inner ? 1 : d >= R ? 0 : 1 - (d - inner) / (R - inner);
      t = t * t * (3 - 2 * t); // smoothstep: no visible ring at either boundary
    }
    const on = Math.round(255 * t);
    out.data[i] = out.data[i + 1] = out.data[i + 2] = on; out.data[i + 3] = 255;
  }
  ctx.putImageData(out, 0, 0);
  return c;
}

// Shattered-glass normal map: each Voronoi cell is a shard tilted its own way →
// the normal jumps at seams → transmission refracts the crack for free.
function bakeCrackNormal(p) {
  const N = BAKE_N;
  const c = Object.assign(document.createElement('canvas'), { width: N, height: N });
  const ctx = c.getContext('2d'), img = ctx.createImageData(N, N);
  const S = siteXY(p);
  for (let y = 0; y < N; y++) for (let x = 0; x < N; x++) {
    let d1 = 1e12, d2 = 1e12, s1 = null, s2 = null;
    for (const s of S) { const dx = x - s.x, dy = y - s.y, d = dx * dx + dy * dy; if (d < d1) { d2 = d1; s2 = s1; d1 = d; s1 = s; } else if (d < d2) { d2 = d; s2 = s; } }
    let nx = 0, ny = 0;
    const edge = Math.sqrt(d2) - Math.sqrt(d1);
    const SEAM = N * 0.0137; // ~3.5px at the playground's 256 bake
    if (s2 && edge < SEAM) { // FLAT except at seams: bevel across the crack
      const vx = s1.x - s2.x, vy = s1.y - s2.y, vl = Math.hypot(vx, vy) || 1;
      const k = (1 - edge / SEAM) * 0.95;
      nx = (vx / vl) * k; ny = -(vy / vl) * k;
    }
    const nz = Math.sqrt(Math.max(0.05, 1 - nx * nx - ny * ny));
    const i = (y * N + x) * 4;
    img.data[i] = (nx * 0.5 + 0.5) * 255;
    img.data[i + 1] = (ny * 0.5 + 0.5) * 255;
    img.data[i + 2] = (nz * 0.5 + 0.5) * 255;
    img.data[i + 3] = 255;
  }
  ctx.putImageData(img, 0, 0);
  return c;
}

// Fire-in-the-cracks: warm light hugging the seam bisectors, masked to the
// feathered crack region and the body. Tight — the beams carry the escape.
function bakeSeamGlow(p) {
  const N = BAKE_N, alpha = bodyPixels(p);
  const c = Object.assign(document.createElement('canvas'), { width: N, height: N });
  const ctx = c.getContext('2d');
  const out = ctx.createImageData(N, N);
  const S = siteXY(p);
  if (S.length >= 2) {
    const R = GLASS_AREA * N, inner = R * (1 - 0.9 * GLASS_FEATHER);
    const CORE = N * 0.0102, HALO = N * 0.0215; // ~2.6 / 5.5px at the 256 bake
    for (let y = 0; y < N; y++) for (let x = 0; x < N; x++) {
      const i = (y * N + x) * 4;
      if (alpha[i + 3] <= 90) continue;
      let d1 = 1e12, d2 = 1e12;
      for (const s of S) { const dx = x - s.x, dy = y - s.y, d = dx * dx + dy * dy; if (d < d1) { d2 = d1; d1 = d; } else if (d < d2) d2 = d; }
      const dd = Math.sqrt(d1);
      let reg = dd <= inner ? 1 : dd >= R ? 0 : 1 - (dd - inner) / (R - inner);
      reg = reg * reg * (3 - 2 * reg);
      if (reg <= 0) continue;
      const edge = Math.sqrt(d2) - dd;
      const core = Math.max(0, 1 - edge / CORE);        // white-hot crack line
      const halo = Math.max(0, 1 - edge / HALO) * 0.2;  // just enough bloom to not alias
      const glow = Math.min(1, core + halo) * reg;
      if (glow <= 0.02) continue;
      out.data[i] = Math.round(255 * glow);             // ember-warm: 1.0 / 0.62 / 0.22
      out.data[i + 1] = Math.round(158 * glow);
      out.data[i + 2] = Math.round(56 * glow);
      out.data[i + 3] = 255;
    }
  }
  ctx.putImageData(out, 0, 0);
  return c;
}

// Light ESCAPES the vessel: zoom-blur the seam glow away from the impact centroid
// so every crack throws a shaft outward — baked onto a padded canvas so the rays
// genuinely leave the sprite bounds. No silhouette/radius mask (one once pinned
// the rays inside the mob whenever a kill spread sites across the whole body).
function bakeCrackBeams(p) {
  const seam = bakeSeamGlow(p);
  const M = Math.round(BAKE_N * BEAM_PAD), off = (M - BAKE_N) / 2;
  const c = Object.assign(document.createElement('canvas'), { width: M, height: M });
  const ctx = c.getContext('2d');
  let cu = 0.5, cv = 0.5;
  if (p.sites.length) {
    cu = p.sites.reduce((a, s) => a + s.u, 0) / p.sites.length;
    cv = 1 - p.sites.reduce((a, s) => a + s.v, 0) / p.sites.length;
  }
  const px = off + cu * BAKE_N, py = off + cv * BAKE_N;
  ctx.globalCompositeOperation = 'lighter';
  const STEPS = 26;
  for (let i = 1; i <= STEPS; i++) {
    const t = i / STEPS;
    const s = 1 + t * BEAM_REACH;
    ctx.globalAlpha = Math.min(1, 0.06 * BEAM_STR * (1 - t) ** BEAM_DECAY);
    ctx.setTransform(s, 0, 0, s, px - px * s, py - py * s);
    ctx.drawImage(seam, off, off);
  }
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.globalAlpha = 1;
  return c;
}

// ---- the glass stack ----
function ensureEnv() {
  if (envReady || !renderer) return;
  envReady = true;
  const pmrem = new THREE.PMREMGenerator(renderer);
  scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
  scene.environmentIntensity = 0.45; // dim: the glass should refract the body, not the room
  const dir = new THREE.DirectionalLight(0xdfeaff, 1.8);
  dir.position.set(-1.4, 1.8, 2);
  scene.add(dir);
  scene.add(new THREE.AmbientLight(0x2a3446, 0.6));
}

const canvasTex = (c, srgb = false) => {
  const t = new THREE.CanvasTexture(c);
  if (srgb) t.colorSpace = THREE.SRGBColorSpace;
  return t;
};
function disposeLayer(p, key) {
  const m = p[key];
  if (!m) return;
  scene.remove(m);
  for (const k of ['map', 'alphaMap', 'normalMap']) m.material[k]?.dispose?.();
  m.material.dispose();
  p[key] = null;
}
// Rebake + rebuild the transmission shell from the current sites (each landed
// hit reshapes the fracture region, so the maps must follow).
function buildGlass(p) {
  ensureEnv();
  disposeLayer(p, 'glass');
  const mat = new THREE.MeshPhysicalMaterial({
    transmission: 1, ior: 1.4, thickness: 0.12, roughness: 0.03, metalness: 0,
    normalMap: canvasTex(bakeCrackNormal(p)), normalScale: new THREE.Vector2(1.3, 1.3),
    alphaMap: canvasTex(bakeCrackMask(p)), transparent: true, alphaTest: 0.01, opacity: GLASS_ALPHA,
    clearcoat: 0.3, clearcoatRoughness: 0.2, envMapIntensity: 0.4,
    depthTest: false, depthWrite: false,
  });
  const mesh = new THREE.Mesh(p.geo, mat); // shares the warped geometry — glass rides the body
  mesh.renderOrder = 3;
  scene.add(mesh);
  p.glass = mesh;
}
// Fire between body and glass. transparent: FALSE is load-bearing — transmission
// samples a back-buffer of the OPAQUE scene only; opaque+additive puts the fire
// in that buffer so the glass refracts the burning cracks (black adds nothing).
function buildFire(p) {
  disposeLayer(p, 'fire');
  const mat = new THREE.MeshBasicMaterial({
    map: canvasTex(bakeSeamGlow(p), true), transparent: false, blending: THREE.AdditiveBlending,
    depthTest: false, depthWrite: false,
  });
  mat.color.setScalar(0);
  const mesh = new THREE.Mesh(p.geo, mat);
  mesh.renderOrder = 2;
  scene.add(mesh);
  p.fire = mesh;
}
// Beams live in the transparent pass (drawn after the glass, never refracted)
// on their own static, padded plane — the rays must leave the sprite bounds.
function buildBeams(p) {
  disposeLayer(p, 'beams');
  const mat = new THREE.MeshBasicMaterial({
    map: canvasTex(bakeCrackBeams(p), true), transparent: true, blending: THREE.AdditiveBlending,
    depthTest: false, depthWrite: false, opacity: 0,
  });
  const mesh = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), mat);
  mesh.renderOrder = 4;
  scene.add(mesh);
  p.beams = mesh;
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

function layerMeshes(p) {
  return [p.mesh, p.fire, p.glass, p.beams].filter(Boolean);
}
// #mesh lives INSIDE #shake now, so during a screen shake the canvas moves
// WITH the sprites — subtract the canvas' own stage offset (off) so the
// shake isn't applied twice to the planes.
const canvasOffset = () => {
  const r = renderer ? stageRect(renderer.domElement) : { left: 0, top: 0 };
  return { left: r.left, top: r.top };
};
function layoutPlane(p, t = 0, off = { left: 0, top: 0 }) {
  const show = (on) => { for (const m of layerMeshes(p)) m.visible = on; };
  if (!p.el.isConnected || !(p.el.checkVisibility?.({ visibilityProperty: true }) ?? true)) { show(false); return; }
  const r = stageRect(p.el);
  if (r.width < 2 || r.height < 2) { show(false); return; }
  const img = p.el.querySelector('.raster-art');
  p.aspect = artAspect(img, p.tex) || p.aspect || 1;
  const { w: dw, h: dh } = containSize(r.width, r.height, p.aspect);
  const fl = (p.profile.float || 0) * Math.sin(t * 1.15 + p.seed * 0.7) * 12 * INTENSITY;
  const x = r.left - off.left + r.width / 2 - W / 2, y = -(r.top - off.top + r.height / 2 - H / 2) + fl;
  const sx = (p.flip ? -1 : 1) * dw / 2, sy = dh / 2;
  show(true);
  // renderOrder tracks screen depth: feet lower on stage (larger rect.bottom) draw in front
  const depth = Math.round(r.bottom);
  const layers = [p.mesh, p.fire, p.glass, p.beams].filter(Boolean);
  layers.forEach((m, li) => { m.renderOrder = depth * 4 + li; });
  let z = 0;
  for (const m of layerMeshes(p)) {
    m.position.set(x, y, z);
    const pad = m === p.beams ? BEAM_PAD : 1; // rays overflow the sprite on purpose
    m.scale.set(sx * pad, sy * pad, 1);
    z += 0.01;
  }
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
  const off = canvasOffset();
  for (const p of planes) {
    deformPlane(p, sec);
    layoutPlane(p, sec, off);
  }
  renderer.render(scene, camera);
}

export function initMesh() {
  const canvas = document.getElementById('mesh');
  if (!canvas || renderer) return;
  renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true, powerPreference: 'high-performance' });
  renderer.setClearColor(0, 0);
  // ACES for the PBR glass shell (tuned under it in the playground). Body planes
  // are raw ShaderMaterial — untouched by tone mapping, colors stay UI-accurate.
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.1;
  scene = new THREE.Scene();
  camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 100);
  camera.position.z = 10;
  resize();
  addEventListener('resize', resize);
}

function disposePlane(p) {
  p.el?.classList.remove('mesh-live');
  disposeLayer(p, 'glass');
  disposeLayer(p, 'fire');
  disposeLayer(p, 'beams');
  scene.remove(p.mesh);
  p.geo.dispose();
  p.mesh.material.dispose();
}

export function meshClear() {
  cancelAnimationFrame(raf);
  raf = 0;
  for (const p of planes) disposePlane(p);
  planes = [];
  document.documentElement.classList.remove('mesh-on');
  renderer?.render(scene, camera);
}

/** Remove the plane bound to el (or any descendant of el) — the DOM <img> becomes visible again the same frame. */
export function meshRelease(el) {
  const i = planes.findIndex((p) => p.el === el || (p.el && el.contains && el.contains(p.el)));
  if (i < 0) return;
  disposePlane(planes[i]);
  planes.splice(i, 1);
  if (!planes.length) document.documentElement.classList.remove('mesh-on');
  renderer?.render(scene, camera);
}

/** Brightness beat for hits — CSS filters don't reach WebGL planes. */
export function meshFlash(el, ms = 160) {
  const p = findPlane(el);
  if (!p) return;
  p.mat.uniforms.uFlash.value = 0.9;
  setTimeout(() => { if (p.mat) p.mat.uniforms.uFlash.value = 0; }, ms);
}

const MAXSITES = 56;
const clampUv = (x) => Math.max(0.05, Math.min(0.95, x));
function findPlane(el) {
  return planes.find((q) => q.el === el || (el.contains && el.contains(q.el)));
}
/** Fracture the glass at (u,v) in body-UV (0..1) — a cluster of shards grows the
 *  transmission shell. Returns false if el has no warp plane (caller falls back
 *  to the drawn crack). */
export function meshCrack(el, u = 0.32 + Math.random() * 0.36, v = 0.3 + Math.random() * 0.4) {
  if (LITE) return false; // drawn-crack fallback keeps the low-power tier cheap
  const p = findPlane(el);
  if (!p || !bodyPixels(p)) return false; // texture not decoded yet — drawn fallback
  const n = 5 + (Math.random() * 3 | 0);
  for (let k = 0; k < n; k++) {
    const a = Math.random() * Math.PI * 2, r = Math.random() * 0.052;
    if (p.sites.length >= MAXSITES) break;
    p.sites.push({ u: clampUv(u + Math.cos(a) * r), v: clampUv(v + Math.sin(a) * r) });
  }
  // cracked glass must sit in the transmission back-buffer: flip the body opaque
  if (p.mat.uniforms.uCut.value === 0) {
    p.mat.uniforms.uCut.value = 0.35;
    p.mat.transparent = false;
    p.mat.needsUpdate = true;
  }
  buildGlass(p);
  if (p.death > 0) buildFire(p); // mid-death recrack: keep the fire on the new seams
  return true;
}
/** Ramp the fire + escaping beams as the vessel fails (0..1). Returns false if no plane. */
export function meshDeath(el, amt) {
  if (LITE) return false; // drawn ignite handles the low-power tier
  const p = findPlane(el);
  if (!p) return false;
  if (amt > 0 && !p.fire) { buildFire(p); buildBeams(p); }
  p.death = amt;
  if (p.fire) p.fire.material.color.setScalar(amt);
  // beams lag the seam warm-up, then surge: light has to FIND the crack first
  if (p.beams) p.beams.material.opacity = Math.min(1, Math.max(0, amt * 1.35 - 0.35));
  return true;
}

/** Harvest crack-site UVs for a site-guided shatter (empty if no plane / no hits). */
export function meshCrackSites(el) {
  const p = findPlane(el);
  return p ? p.sites.map((s) => ({ u: s.u, v: s.v })) : [];
}

/** Snapshot the burning glass body (body+fire+glass, beams excluded — they die
 *  with the shatter), harvest sites, then release the plane — one beat for V.shatter. */
export function meshHandoff(el) {
  const p = findPlane(el);
  if (!p || !renderer || LITE) return null;
  const sec = performance.now() * 0.001;
  const off = canvasOffset();
  const mine = new Set(layerMeshes(p));
  const vis = [];
  scene.traverse((o) => { if (o.isMesh) { vis.push([o, o.visible]); o.visible = mine.has(o) && o !== p.beams; } });
  deformPlane(p, sec);
  layoutPlane(p, sec, off);
  if (p.beams) p.beams.visible = false;
  renderer.render(scene, camera);
  for (const [o, v] of vis) o.visible = v;

  const r = stageRect(p.el);
  const { w: dw, h: dh } = containSize(r.width, r.height, p.aspect);
  const dpr = renderer.getPixelRatio();
  // canvas pixel (0,0) = stage point (off.left, off.top) — read in canvas space
  const sx = (r.left - off.left + r.width / 2 - dw / 2) * dpr;
  const sy = (r.top - off.top + r.height / 2 - dh / 2) * dpr;
  const sw = Math.max(1, Math.round(dw * dpr));
  const sh = Math.max(1, Math.round(dh * dpr));
  const cap = document.createElement('canvas');
  cap.width = sw;
  cap.height = sh;
  cap.getContext('2d').drawImage(renderer.domElement, sx, sy, sw, sh, 0, 0, sw, sh);

  const sites = meshCrackSites(el);
  const rect = { left: r.left, top: r.top, width: r.width, height: r.height };
  // the light leaves WITH the glass: detach the beams and let them gutter out
  // while the shards fly, instead of vanishing the same frame as the body
  const beams = p.beams;
  if (beams) {
    p.beams = null;
    const t0 = performance.now(), from = beams.material.opacity;
    const fade = (now) => {
      const t = Math.min(1, (now - t0) / 200);
      beams.material.opacity = from * (1 - t);
      if (t < 1) {
        // the released plane may have been the last one — the main loop stops
        // rendering then, so the fade must drive its own frames
        if (!planes.length) renderer?.render(scene, camera);
        requestAnimationFrame(fade);
      } else {
        scene.remove(beams); beams.material.map?.dispose(); beams.material.dispose();
        renderer?.render(scene, camera);
      }
    };
    requestAnimationFrame(fade);
  }
  meshRelease(el);
  return { capture: cap.toDataURL('image/png'), sites, rect };
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

/** Mesh-only float lift in stage px (0 = feet on ground). CSS idle bob is separate. */
export function meshLift(el) {
  const p = findPlane(el);
  if (!p) return 0;
  const t = performance.now() * 0.001;
  return Math.max(0, (p.profile.float || 0) * Math.sin(t * 1.15 + p.seed * 0.7) * 12 * INTENSITY);
}

export const meshDebug = () => ({
  enabled: meshEnabled(),
  planes: planes.length,
  renderer: !!renderer,
  looping: !!raf,
  intensity: INTENSITY,
  sites: planes.reduce((m, p) => Math.max(m, p.sites.length), 0),
  death: planes.reduce((m, p) => Math.max(m, p.death), 0),
  glass: planes.filter((p) => p.glass).length,
});

export function meshProfile(kind) { return PROFILE[kind] || PROFILE.humanoid; }
