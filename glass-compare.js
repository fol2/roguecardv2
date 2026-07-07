// SIDE-BY-SIDE (worktree throwaway): our custom crack shader vs three.js
// MeshPhysicalMaterial(transmission) — same body, same crack seed. Click to reseed.
import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';

const URL_ = '/src/assets/enemies/duskfang.png';
const SIZE = 400;
const renderers = [];

// ---------- shared Voronoi crack sites ----------
let sites = [];
let level = 3;
let onBodyFn = null; // set once the body loads: keeps fractures on the silhouette
// persistent impact clusters, so raising the level RETAINS earlier cracks (like real damage)
let clusters = [];
const siteTotal = () => clusters.reduce((a, c) => a + c.sites.length, 0);
function addCluster() {
  let tries = 0;
  while (tries++ < 400) {
    const u = 0.16 + Math.random() * 0.68, v = 0.12 + Math.random() * 0.74;
    if (onBodyFn && !onBodyFn(u, v)) continue;                          // on the body only
    if (clusters.some((c) => Math.hypot(c.u - u, c.v - v) < 0.14)) continue; // spread out
    const s = [], n = 5 + (Math.random() * 3 | 0);
    for (let k = 0; k < n; k++) {
      const a = Math.random() * 6.283, r = Math.random() * 0.05;
      const ta = Math.random() * 6.283, tm = 0.011 + Math.random() * 0.019;
      s.push({ u: u + Math.cos(a) * r, v: v + Math.sin(a) * r, ox: Math.cos(ta) * tm, oy: Math.sin(ta) * tm });
    }
    clusters.push({ u, v, sites: s });
    return true;
  }
  return false;
}
function seed(lv = level) {
  level = lv;
  const target = [0, 1, 2, 4, 7, 11][lv] ?? 0;       // 0 = pristine, 5 = shattered
  if (clusters.length > target) clusters.length = target;              // lower level: keep the earliest cracks
  while (clusters.length < target && siteTotal() < 54) if (!addCluster()) break; // higher: add, retaining prior
  sites = clusters.flatMap((c) => c.sites).slice(0, 56);
}
function reseed() { clusters = []; seed(level); }                      // fresh pattern at the current level

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// ---------- crack-guided shatter (mirrors src/vfx.js) ----------
// clip-path space: texture u left→right, v flipped so y=0 is top (matches captured canvas)
const BOUNDS = [[0, 0], [100, 0], [100, 100], [0, 100]];
const siteXY = (s) => [s.u * 100, (1 - s.v) * 100];
// keep the half of poly closer to F than O — the side test is linear, so the
// crossing is exact (the old bisection drifted and produced overlapping cells)
function clipHalf(poly, F, O) {
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
// fine Voronoi cells where the blows landed (the seams the shader lit), plus
// sparse background sites so the final web breaks intact glass into larger slabs
function voronoiParts(rawSites) {
  const gens = [];
  for (const s of rawSites || []) {
    if (!gens.some((q) => Math.hypot(q.u - s.u, q.v - s.v) < 0.02)) gens.push({ u: s.u, v: s.v });
  }
  if (gens.length < 3) return null;
  const aug = gens.slice();
  for (let gu = 0.1; gu < 1; gu += 0.21) for (let gv = 0.09; gv < 1; gv += 0.21) {
    const u = gu + (Math.random() - 0.5) * 0.12, v = gv + (Math.random() - 0.5) * 0.12;
    if (!aug.some((q) => Math.hypot(q.u - u, q.v - v) < 0.13)) aug.push({ u, v });
  }
  const pts = aug.map(siteXY);
  const parts = [];
  for (let i = 0; i < pts.length; i++) {
    let poly = BOUNDS.map((p) => [...p]);
    for (let j = 0; j < pts.length && poly.length >= 3; j++) if (j !== i) poly = clipHalf(poly, pts[i], pts[j]);
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
  const ix = gens.reduce((s, p) => s + p.u, 0) / gens.length * 100;
  const iy = gens.reduce((s, p) => s + (1 - p.v), 0) / gens.length * 100;
  return { parts, ix, iy };
}
function radialParts() {
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
// one plan, two panels: precompute every shard's cell AND flight so A and B
// shatter identically — a fair compare of the two glass looks
function prepareShatter(siteList) {
  const { parts, ix, iy } = voronoiParts(siteList) || radialParts();
  return parts.map((c) => {
    let dx = c.cx - ix, dy = c.cy - iy;
    const len = Math.hypot(dx, dy) || 1;
    const near = Math.max(0, 1 - len / 75); // closer to the blow = more energy
    const dist = (46 + Math.random() * 92) * (0.85 + near * 0.75);
    return {
      pts: c.poly.map((p) => `${p[0].toFixed(2)}% ${p[1].toFixed(2)}%`).join(','),
      // ballistic launch (per-second velocities), not a canned displacement
      vx: (dx / len) * dist * 2.6,
      vy: (dy / len) * dist * 1.7 - (70 + Math.random() * 170), // outward + an upward kick off the blow
      vr: (Math.random() - 0.5) * 260,
      maxY: Math.max(...c.poly.map((p) => p[1])), // lowest vertex % — where this shard meets the floor
    };
  });
}

// real physics: gravity, tumble, a damped floor bounce, then the shard dies out.
// Integrated per-frame (semi-implicit Euler) instead of a keyframe flight.
function shatterInto(layer, capture, plan) {
  const html = `<img src="${capture}" alt="" style="width:100%;height:100%;object-fit:contain;display:block">`;
  const H = layer.clientHeight || 420;
  const G = 2400; // px/s² — glass is heavy; the fall should read fast
  const shards = plan.map((sh) => {
    const w = document.createElement('div');
    w.style.cssText = `position:absolute;inset:0;clip-path:polygon(${sh.pts});will-change:transform,opacity;`;
    w.innerHTML = html;
    layer.appendChild(w);
    return { el: w, x: 0, y: 0, vx: sh.vx, vy: sh.vy, rot: 0, vr: sh.vr, maxY: sh.maxY, bounced: 0 };
  });
  return new Promise((res) => {
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
        const floor = H * (1 - s.maxY / 100) + 2; // this shard's own lowest edge hits the ground
        if (s.y > floor && s.vy > 0 && s.bounced < 2) {
          s.y = floor;
          s.vy *= -(0.34 - s.bounced * 0.12); // damped clink, weaker second bounce
          s.vx *= 0.6; s.vr *= 0.5; s.bounced++;
        }
        const fade = t < 650 ? 1 : Math.max(0, 1 - (t - 650) / 380);
        s.el.style.transform = `translate3d(${s.x.toFixed(1)}px,${s.y.toFixed(1)}px,0) rotate(${s.rot.toFixed(1)}deg)`;
        s.el.style.opacity = fade.toFixed(3);
        if (fade <= 0 || s.y > H * 1.4) { s.el.remove(); s.el = null; } else live++;
      }
      if (live) requestAnimationFrame(step); else res();
    };
    requestAnimationFrame(step);
  });
}

// body image, for baking the silhouette + crack normal map
const bodyImg = new Image();
let bodyReady = false;

// Panel B glass-region tuning (sliders): how far the glass reaches past each
// crack site, how softly its edge fades, and the shell's overall opacity.
// Defaults are the user-approved look (2026-07-07): area .45 / feather 1 / alpha 1.
let B_AREA = 0.45, B_FEATHER = 1, B_ALPHA = 1;

// Ignite beam tuning (sliders): how hard the light escapes (strength), how far
// the shafts stretch (reach), and how fast a ray dies along its length (decay —
// low = rays persist, flood-like; high = they gutter out quickly). NO silhouette
// or radius mask: the whole point is that the light is NOT bounded to the mob.
// Defaults are the user-approved measure (2026-07-07): 2.5 / 1.1 / 1.55.
let BEAM_STR = 2.5, BEAM_REACH = 1.1, BEAM_DECAY = 1.55;

// bake a crack-region mask: bright where the glass has fractured AND we're on the
// body, feathering to 0 at the region edge — no hard disc boundary. The
// transmission shell wears this as its alpha, so glass exists ONLY at the cracks.
function bakeCrackMask() {
  const N = 256, c = Object.assign(document.createElement('canvas'), { width: N, height: N });
  const ctx = c.getContext('2d');
  ctx.drawImage(bodyImg, 0, 0, N, N);
  const alpha = ctx.getImageData(0, 0, N, N).data;
  const out = ctx.createImageData(N, N);
  const S = sites.map((s) => ({ x: s.u * N, y: (1 - s.v) * N })); // canvas is y-down vs texture flipY
  const R = B_AREA * N;
  const inner = R * (1 - 0.9 * B_FEATHER); // feather 0 = hard edge, 1 = fade from the core
  for (let y = 0; y < N; y++) for (let x = 0; x < N; x++) {
    const i = (y * N + x) * 4;
    let d1 = 1e12; for (const s of S) { const dx = x - s.x, dy = y - s.y, d = dx * dx + dy * dy; if (d < d1) d1 = d; }
    let t = 0;
    if (alpha[i + 3] > 90) {
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

// bake the fire-in-the-cracks emissive map for B's ignite: warm light along the
// seam bisectors (the same seams the normal map bevels), masked to the feathered
// crack region and the body — the PBR twin of A's uDeath seam ramp.
function bakeSeamGlow() {
  const N = 256, c = Object.assign(document.createElement('canvas'), { width: N, height: N });
  const ctx = c.getContext('2d');
  ctx.drawImage(bodyImg, 0, 0, N, N);
  const alpha = ctx.getImageData(0, 0, N, N).data;
  const out = ctx.createImageData(N, N);
  const S = sites.map((s) => ({ x: s.u * N, y: (1 - s.v) * N }));
  if (S.length >= 2) {
    const R = B_AREA * N, inner = R * (1 - 0.9 * B_FEATHER);
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
      // tight: the light lives IN the seam (beams carry the escape, not a region wash)
      const core = Math.max(0, 1 - edge / 2.6);        // white-hot crack line
      const halo = Math.max(0, 1 - edge / 5.5) * 0.2;  // just enough bloom to not alias
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

// light ESCAPES the vessel: zoom-blur the seam glow away from the impact centroid
// so every crack throws a shaft of light outward — "lightbeam from the crack",
// not "light up the region". Drawn as a screen-blended overlay above either panel.
function bakeCrackBeams() {
  const N = 256;
  const seam = bakeSeamGlow();
  const c = Object.assign(document.createElement('canvas'), { width: N, height: N });
  const ctx = c.getContext('2d');
  let cx = 0.5, cy = 0.5;
  if (sites.length) {
    cx = sites.reduce((a, s) => a + s.u, 0) / sites.length;
    cy = 1 - sites.reduce((a, s) => a + s.v, 0) / sites.length;
  }
  const px = cx * N, py = cy * N;
  ctx.globalCompositeOperation = 'lighter';
  const STEPS = 26;
  for (let i = 1; i <= STEPS; i++) {
    const t = i / STEPS;
    const s = 1 + t * BEAM_REACH;                                       // how far the shafts stretch
    ctx.globalAlpha = Math.min(1, 0.06 * BEAM_STR * (1 - t) ** BEAM_DECAY); // rays gutter out along their length
    ctx.setTransform(s, 0, 0, s, px - px * s, py - py * s);
    ctx.drawImage(seam, 0, 0);
  }
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.globalAlpha = 1;
  // (no radius/silhouette mask here — a centroid-bounded mask once pinned the
  // rays inside the mob whenever a kill spread the sites across the whole body)
  return c;
}

// bake a shattered-glass normal map from the same sites: each Voronoi cell is a
// glass shard tilted its own way → the normal jumps at seams → transmission refracts
// the crack for free. Flat (128,128,255) outside the fractured region.
function bakeCrackNormal() {
  const N = 256, c = Object.assign(document.createElement('canvas'), { width: N, height: N });
  const ctx = c.getContext('2d'), img = ctx.createImageData(N, N);
  const S = sites.map((s) => ({ x: s.u * N, y: (1 - s.v) * N })); // canvas is y-down vs texture flipY
  for (let y = 0; y < N; y++) for (let x = 0; x < N; x++) {
    let d1 = 1e12, d2 = 1e12, s1 = null, s2 = null;
    for (const s of S) { const dx = x - s.x, dy = y - s.y, d = dx * dx + dy * dy; if (d < d1) { d2 = d1; s2 = s1; d1 = d; s1 = s; } else if (d < d2) { d2 = d; s2 = s; } }
    let nx = 0, ny = 0;
    const edge = Math.sqrt(d2) - Math.sqrt(d1);
    if (s2 && edge < 3.5) {                                 // FLAT except at seams: bevel across the crack
      const vx = s1.x - s2.x, vy = s1.y - s2.y, vl = Math.hypot(vx, vy) || 1;
      const k = (1 - edge / 3.5) * 0.95;
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

// ---------- Panel A: our custom shader ----------
const CRACK_VERT = `varying vec2 vUv; void main(){ vUv=uv; gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0); }`;
const CRACK_FRAG = `
  #define MAXSITES 56
  varying vec2 vUv; uniform sampler2D map; uniform vec4 uSites[MAXSITES];
  uniform int uSiteCount; uniform float uCrack; uniform float uCrackR; uniform float uAspect; uniform float uDeath;
  void main(){
    vec2 uv=vUv; vec4 base=texture2D(map,uv);
    if(uSiteCount==0){ gl_FragColor=base; return; }
    vec2 pt=vec2(uv.x*uAspect,uv.y); float d1=1e9,d2=1e9; vec2 off1=vec2(0.0);
    for(int i=0;i<MAXSITES;i++){ if(i>=uSiteCount)break; vec4 s=uSites[i]; float d=distance(pt,vec2(s.x*uAspect,s.y));
      if(d<d1){d2=d1;d1=d;off1=s.zw;} else if(d<d2){d2=d;} }
    float within=1.0-smoothstep(uCrackR*0.48,uCrackR*1.02,d1); float g=uCrack*within; vec2 ruv=uv+off1*g*1.15;
    vec4 rc=texture2D(map,ruv); vec3 col=mix(base.rgb,rc.rgb,rc.a);
    float edge=d2-d1; float seam=(1.0-smoothstep(0.0,0.013,edge))*within; float core=(1.0-smoothstep(0.0,0.0042,edge))*within;
    if(seam>0.001){ float ca=0.0075*g+0.0025; col.r=mix(col.r,texture2D(map,ruv+vec2(ca,0.0)).r,rc.a*seam); col.b=mix(col.b,texture2D(map,ruv-vec2(ca,0.0)).b,rc.a*seam);}
    vec3 hi=mix(vec3(0.86,0.93,1.0),vec3(1.0,0.64,0.24),uDeath);
    col+=hi*(seam*0.34+core*1.05)*base.a*(1.0+uDeath); col*=1.0-core*0.26*base.a;
    gl_FragColor=vec4(col,base.a);
  }`;

function panelShader(canvas, tex) {
  const r = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  r.setPixelRatio(Math.min(devicePixelRatio, 2)); r.setSize(SIZE, SIZE, false); renderers.push(r);
  const scene = new THREE.Scene(), cam = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 10); cam.position.z = 2;
  const uSites = Array.from({ length: 56 }, () => new THREE.Vector4());
  const uniforms = { map: { value: tex }, uSites: { value: uSites }, uSiteCount: { value: 0 }, uCrack: { value: 1 }, uCrackR: { value: 0.138 }, uAspect: { value: 1 }, uDeath: { value: 0 } };
  const mat = new THREE.ShaderMaterial({ uniforms, vertexShader: CRACK_VERT, fragmentShader: CRACK_FRAG, transparent: true });
  scene.add(new THREE.Mesh(new THREE.PlaneGeometry(2, 2), mat));
  return {
    canvas,
    render(death = 0) {
      sites.slice(0, 56).forEach((s, i) => uSites[i].set(s.u, s.v, s.ox, s.oy));
      uniforms.uSiteCount.value = Math.min(sites.length, 56);
      uniforms.uAspect.value = (tex.image?.width || 1) / (tex.image?.height || 1);
      uniforms.uDeath.value = death;
      r.render(scene, cam);
    },
    setDeath(death) { this.render(death); }, // uniform-only; already cheap
    capture(death = 1) {
      sites.slice(0, 56).forEach((s, i) => uSites[i].set(s.u, s.v, s.ox, s.oy));
      uniforms.uSiteCount.value = Math.min(sites.length, 56);
      uniforms.uAspect.value = (tex.image?.width || 1) / (tex.image?.height || 1);
      uniforms.uDeath.value = death;
      r.render(scene, cam);
      return canvas.toDataURL('image/png');
    },
  };
}

// ---------- Panel B: three MeshPhysicalMaterial(transmission) ----------
function panelGlass(canvas, tex) {
  const r = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  r.setPixelRatio(Math.min(devicePixelRatio, 2)); r.setSize(SIZE, SIZE, false); renderers.push(r);
  r.toneMapping = THREE.ACESFilmicToneMapping; r.toneMappingExposure = 1.1;
  const scene = new THREE.Scene(), cam = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 10); cam.position.z = 3;
  const pmrem = new THREE.PMREMGenerator(r);
  scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
  scene.environmentIntensity = 0.45; // dim the studio env so glass refracts the body, not the room
  const dir = new THREE.DirectionalLight(0xdfeaff, 1.8); dir.position.set(-1.4, 1.8, 2); scene.add(dir);
  scene.add(new THREE.AmbientLight(0x2a3446, 0.6));
  // body behind (opaque silhouette so it lands in the transmission back-buffer)
  const body = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), new THREE.MeshBasicMaterial({ map: tex, transparent: false, alphaTest: 0.35 }));
  scene.add(body);
  // glass shell in front — refracts the body through the crack normal map.
  // Ignite is NOT the glass's emissive (the soft alphaMap + tone mapping crush
  // it): it's a separate additive fire plane sandwiched between body and glass —
  // a transparent light source behind the glass, lighting the cracks from within.
  let glass, fire;
  function build(death = 0) {
    if (glass) { scene.remove(glass); glass.material.dispose(); }
    if (fire) { scene.remove(fire); fire.material.map?.dispose(); fire.material.dispose(); fire = null; }
    const mask = new THREE.CanvasTexture(bakeCrackMask());
    const nrm = new THREE.CanvasTexture(bakeCrackNormal());
    const mat = new THREE.MeshPhysicalMaterial({
      transmission: 1, ior: 1.4, thickness: 0.12, roughness: 0.03, metalness: 0,
      normalMap: nrm, normalScale: new THREE.Vector2(1.3, 1.3),
      // soft feathered mask + opacity — no alphaTest, so no hard disc edge
      alphaMap: mask, transparent: true, alphaTest: 0.01, opacity: B_ALPHA,
      clearcoat: 0.3, clearcoatRoughness: 0.2, envMapIntensity: 0.4,
    });
    const glowTex = new THREE.CanvasTexture(bakeSeamGlow());
    glowTex.colorSpace = THREE.SRGBColorSpace;
    // transparent: FALSE is load-bearing — transmission glass shows a back-buffer
    // of the OPAQUE scene only. Opaque+additive puts the fire in that buffer, so
    // the glass itself refracts the burning cracks (black adds nothing anyway).
    const fm = new THREE.MeshBasicMaterial({
      map: glowTex, transparent: false, blending: THREE.AdditiveBlending,
      depthWrite: false, depthTest: false,
    });
    fm.color.setScalar(death); // fire intensity: 0 = dark (adds nothing), 1 = full blaze
    fire = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), fm);
    fire.position.z = 0.02;  // body (0) < fire < glass shell (0.04)
    fire.renderOrder = 1;    // after the body within the opaque pass
    scene.add(fire);
    glass = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), mat); glass.position.z = 0.04;
    scene.add(glass);
  }
  return {
    canvas,
    render(death = 0) { build(death); r.render(scene, cam); },
    // fast ramp path: tint the already-built fire plane, no texture re-bake
    setDeath(death) { if (!fire) build(death); fire.material.color.setScalar(death); r.render(scene, cam); },
    capture(death = 0) { build(death); r.render(scene, cam); return canvas.toDataURL('image/png'); },
  };
}

// ---------- boot ----------
bodyImg.onerror = () => { document.body.insertAdjacentHTML('afterbegin', '<p style="color:#f88;padding:12px">body image failed to load</p>'); };
bodyImg.onload = () => {
  bodyReady = true;
  // silhouette lookup so fracture clusters land on the body, not the transparent bg
  const SN = 84, sc = Object.assign(document.createElement('canvas'), { width: SN, height: SN });
  const sctx = sc.getContext('2d'); sctx.drawImage(bodyImg, 0, 0, SN, SN);
  const sa = sctx.getImageData(0, 0, SN, SN).data;
  onBodyFn = (u, v) => { const x = Math.max(0, Math.min(SN - 1, u * SN | 0)), y = Math.max(0, Math.min(SN - 1, (1 - v) * SN | 0)); return sa[(y * SN + x) * 4 + 3] > 80; };

  const tex = new THREE.Texture(bodyImg); tex.colorSpace = THREE.SRGBColorSpace; tex.needsUpdate = true;
  const A = panelShader(document.getElementById('a'), tex);
  const B = panelGlass(document.getElementById('b'), tex);
  const frameA = document.getElementById('frame-a');
  const frameB = document.getElementById('frame-b');
  const shardA = frameA.querySelector('.shards');
  const shardB = frameB.querySelector('.shards');
  const count = document.getElementById('count');
  const barBtns = [...document.querySelectorAll('.bar button')];
  let killing = false;
  const draw = (death = 0) => {
    A.render(death); B.render(death);
    if (death === 0) document.querySelectorAll('canvas.beams').forEach((cv) => { cv.style.opacity = '0'; });
    if (count) count.textContent = `${sites.length} shards`;
  };
  const setLevel = (lv) => {
    if (killing) return;
    seed(lv); draw();
    document.querySelectorAll('[data-lvl]').forEach((b) => b.classList.toggle('on', +b.dataset.lvl === lv));
  };
  document.querySelectorAll('[data-lvl]').forEach((b) => { b.onclick = () => setLevel(+b.dataset.lvl); });
  document.getElementById('reseed').onclick = () => { if (!killing) { reseed(); draw(); } };
  // beam overlays: screen-blended canvases above each panel carrying the escaping
  // light shafts — the same bake for A and B, so the compare stays fair
  const beamFor = (frame) => {
    const cv = document.createElement('canvas');
    cv.className = 'beams'; cv.width = cv.height = 256;
    cv.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;pointer-events:none;mix-blend-mode:screen;opacity:0;';
    frame.appendChild(cv);
    return cv;
  };
  const beamA = beamFor(frameA), beamB = beamFor(frameB);
  const setBeams = (e) => {
    // beams lag the seam warm-up, then surge: light has to FIND the crack first
    const op = Math.min(1, Math.max(0, e * 1.35 - 0.35));
    beamA.style.opacity = beamB.style.opacity = op.toFixed(3);
  };
  // the fire builds, it doesn't switch on: the seams warm first, then the light
  // breaks OUT of the cracks as shafts — the beat that reads as a vessel failing
  const igniteAnim = (dur = 420) => new Promise((done) => {
    B.render(0); // full rebuild once (current sites/sliders); ramp is then tint-only
    const bake = bakeCrackBeams();
    for (const cv of [beamA, beamB]) { const g = cv.getContext('2d'); g.clearRect(0, 0, 256, 256); g.drawImage(bake, 0, 0); }
    const t0 = performance.now();
    const step = () => {
      const t = Math.min(1, (performance.now() - t0) / dur);
      const e = t * t * (3 - 2 * t); // smoothstep: slow warm-up, fast blaze, soft land
      A.setDeath(e); B.setDeath(e); setBeams(e);
      if (t < 1) requestAnimationFrame(step); else done();
    };
    requestAnimationFrame(step);
  });
  document.getElementById('ignite').onclick = () => { if (!killing) igniteAnim(); };
  // live beam tuning: hold the panels at full blaze and re-bake the shafts as the
  // slider moves — auto-ignites first so there's always something to look at
  const relight = () => {
    A.setDeath(1); B.render(1);
    const bake = bakeCrackBeams();
    for (const cv of [beamA, beamB]) { const g = cv.getContext('2d'); g.clearRect(0, 0, 256, 256); g.drawImage(bake, 0, 0); }
    setBeams(1);
  };
  // Panel B glass-region sliders: area = reach past each crack site, feather =
  // edge softness (kills the visible circle), alpha = shell opacity
  const wireSlider = (id, set, after = () => draw()) => {
    const inp = document.getElementById(id), lbl = document.getElementById(id + 'v');
    inp.oninput = () => { set(+inp.value); lbl.textContent = (+inp.value).toFixed(2); if (!killing) after(); };
  };
  wireSlider('barea', (v) => { B_AREA = v; });
  wireSlider('bfeather', (v) => { B_FEATHER = v; });
  wireSlider('balpha', (v) => { B_ALPHA = v; });
  wireSlider('bmstr', (v) => { BEAM_STR = v; }, relight);
  wireSlider('bmreach', (v) => { BEAM_REACH = v; }, relight);
  wireSlider('bmdecay', (v) => { BEAM_DECAY = v; }, relight);
  window.__cmp = { A, B, draw, igniteAnim, relight, beamA, beamB }; // console/test hook
  document.getElementById('kill').onclick = async () => {
    if (killing) return;
    killing = true;
    barBtns.forEach((b) => { b.disabled = true; });
    // death rite: one last web of fractures, the light breaks out, and the INSTANT
    // it peaks the vessel gives — no held beat between blaze and break
    for (let k = 0; k < 3; k++) addCluster();
    sites = clusters.flatMap((c) => c.sites).slice(0, 56);
    draw(0);
    await sleep(80);
    await igniteAnim(level > 3 ? 420 : 300); // animated 0→1 ramp, not a snap
    const plan = prepareShatter(sites.slice()); // shared cells + flight: A and B break identically
    const capA = A.capture(1);
    const capB = B.capture(1); // B's shards carry the fired-up seams too
    frameA.classList.add('shattering');
    frameB.classList.add('shattering');
    shardA.replaceChildren();
    shardB.replaceChildren();
    // the light leaves WITH the glass: beams die as the shards take flight.
    // NB: cancel on finish — a lingering fill:'forwards' animation outranks the
    // inline style and would pin the overlay invisible for every later ignite.
    for (const cv of [beamA, beamB]) {
      const anim = cv.animate([{ opacity: cv.style.opacity }, { opacity: 0 }], { duration: 200, fill: 'forwards' });
      anim.onfinish = () => { cv.style.opacity = '0'; anim.cancel(); };
    }
    await Promise.all([
      shatterInto(shardA, capA, plan),
      shatterInto(shardB, capB, plan),
    ]);
    setBeams(0);
    frameA.classList.remove('shattering');
    frameB.classList.remove('shattering');
    shardA.replaceChildren();
    shardB.replaceChildren();
    draw(0);
    killing = false;
    barBtns.forEach((b) => { b.disabled = false; });
    if (count) count.textContent = `${sites.length} shards · re-killed`;
  };
  setLevel(3);
};
bodyImg.src = URL_;

// dispose renderers on hot-reload so repeated edits can't pile up WebGL contexts
if (import.meta.hot) import.meta.hot.dispose(() => renderers.forEach((r) => r.dispose()));
