// three.js atmospheric background — the "3D" half of the 2D+3D fusion.
// The Spire here is not scenery: the map screen climbs it for real. The camera
// lives at the altitude you've earned, so act 3 fights happen above the clouds.
import * as THREE from 'three';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';
import { ACTS } from './data.js';

let renderer, scene, camera, composer, bloom;
let ptsMain, ptsAccent, nebulae = [], skyGroup;
let spireMat, beacon, beaconGlow, windowMat, treeMat, groundMat, cloudMats = [];
let weather, weatherAct = 0, weatherOp = 0.5, lightningV = 0, fgGroup, fgMat, chains = [];
const REDUCED = matchMedia('(prefers-reduced-motion: reduce)').matches;
let cur = { sky: new THREE.Color(0x0b0e1a), fog: new THREE.Color(0x141a2e), particles: new THREE.Color(0xffa04d), glow: new THREE.Color(0x66ff9e) };
let tgt = { sky: cur.sky.clone(), fog: cur.fog.clone(), particles: cur.particles.clone(), glow: cur.glow.clone() };
let mouse = { x: 0, y: 0 };
let kickV = 0;
let speedMul = 1;

// ---- the Spire: one continuous tower, all three acts stacked on it ----------
const TOWER = {
  x: 7, z: -20,            // axis
  bottom: -16, top: 54,    // geometry extent
  baseY: -6,               // altitude of act 0, row 0
  rowH: 1.06,              // world units per map row
  actGap: 4.2,             // dead zone between acts (cloud decks live here)
  azBase: Math.atan2(30, -7), // the face turned toward the default camera
  colSpread: 0.34,         // radians between map columns
};
const ROWS = 15;
const actBaseY = (act) => TOWER.baseY + act * ((ROWS - 1) * TOWER.rowH + TOWER.actGap);
function radiusAt(y) {
  const t = THREE.MathUtils.clamp((y - TOWER.bottom) / (TOWER.top - TOWER.bottom), 0, 1);
  // multi-frequency ripple: tiered ledges + fine crag so the silhouette reads
  // as built architecture, not a smooth cone
  const tier = 1 + Math.sin(t * 21) * 0.07 + Math.sin(t * 57) * 0.05 + Math.sin(t * 9 + 1.7) * 0.06;
  return Math.pow(1 - t, 1.15) * 6.2 * tier + 0.85;
}
// world position of a map node's lantern, hung on (or haloed around) the tower
export function mapNodePos(act, n) {
  const y = actBaseY(act) + n.row * TOWER.rowH + n.jy * 0.5;
  const a = TOWER.azBase + (n.col - 3 + n.jx) * TOWER.colSpread;
  const r = Math.max(radiusAt(y) + 0.5, 3.6);
  return new THREE.Vector3(TOWER.x + Math.cos(a) * r, y, TOWER.z + Math.sin(a) * r);
}

// ---- camera modes -----------------------------------------------------------
// 'ambient' = title/combat/etc: eye-level drift at the altitude you've climbed.
// 'map'     = orbiting the tower face, dollying up with your progress.
let mode = 'ambient';
let alt = actBaseY(0);        // smoothed camera altitude (world y)
let altT = actBaseY(0);       // target altitude
let mapAct = 0, mapViewRow = 0, peek = 0;
const camLookCur = new THREE.Vector3(0, actBaseY(0), -6);
const _posT = new THREE.Vector3(), _lookT = new THREE.Vector3(), _v = new THREE.Vector3(), _white = new THREE.Color(0xffffff);
const _sky = new THREE.Color(), _lightC = new THREE.Color(0xbfd4ff);

export function setAltitude(act, row) { altT = actBaseY(act) + Math.max(0, row) * TOWER.rowH; }
export function enterMapMode(act, curRow) { mode = 'map'; mapAct = act; mapViewRow = Math.max(0, curRow); peek = 0; }
export function exitMapMode() { mode = 'ambient'; }
export function peekMap(dRows) {
  peek = THREE.MathUtils.clamp(peek + dRows, -mapViewRow - 1, ROWS + 0.5 - mapViewRow);
}

// map overlay: the UI registers lantern anchor points; every frame we hand back
// their screen positions so the clickable DOM nodes can ride the 3D tower.
let overlayAnchors = null, overlayCb = null;
export function setOverlay(anchors, cb) { overlayAnchors = anchors; overlayCb = cb; }
export function clearOverlay() { overlayAnchors = null; overlayCb = null; }

function spriteTex(stops) {
  const c = document.createElement('canvas');
  c.width = c.height = 128;
  const g = c.getContext('2d');
  const grad = g.createRadialGradient(64, 64, 0, 64, 64, 64);
  for (const [o, col] of stops) grad.addColorStop(o, col);
  g.fillStyle = grad;
  g.fillRect(0, 0, 128, 128);
  const tex = new THREE.CanvasTexture(c);
  return tex;
}

function makePoints(count, size, spreadX, spreadY, spreadZ, opacity) {
  const geo = new THREE.BufferGeometry();
  const pos = new Float32Array(count * 3);
  const seeds = new Float32Array(count);
  for (let i = 0; i < count; i++) {
    pos[i * 3] = (Math.random() - 0.5) * spreadX;
    pos[i * 3 + 1] = (Math.random() - 0.5) * spreadY;
    pos[i * 3 + 2] = -Math.random() * spreadZ;
    seeds[i] = Math.random() * Math.PI * 2;
  }
  geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  geo.userData.seeds = seeds;
  const mat = new THREE.PointsMaterial({
    size, map: spriteTex([[0, 'rgba(255,255,255,1)'], [0.35, 'rgba(255,255,255,.6)'], [1, 'rgba(255,255,255,0)']]),
    transparent: true, opacity, depthWrite: false, blending: THREE.AdditiveBlending, sizeAttenuation: true,
  });
  return new THREE.Points(geo, mat);
}

// mobile tier: a phone GPU gets the same night, thinner — fewer motes, no MSAA
// (bloom soft-blurs everything anyway), a lower DPR ceiling, half-res bloom
const LITE = new URLSearchParams(location.search).get('input') === 'touch' || matchMedia('(pointer: coarse)').matches;

export function initScene() {
  const canvas = document.getElementById('bg3d');
  renderer = new THREE.WebGLRenderer({ canvas, antialias: !LITE, alpha: false });
  renderer.setPixelRatio(Math.min(devicePixelRatio, LITE ? 1.35 : 1.75));
  scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(cur.fog.getHex(), 0.055);
  camera = new THREE.PerspectiveCamera(58, 1, 0.1, 120);
  camera.position.set(0, alt, 10);

  ptsMain = makePoints(LITE ? 480 : 900, 0.16, 46, 26, 40, 0.75);
  ptsAccent = makePoints(LITE ? 130 : 240, 0.32, 46, 26, 34, 0.5);
  scene.add(ptsMain, ptsAccent);

  // nebulae ride skyGroup: they track the camera's altitude with a slight lag
  // so the "sky" ascends with you while still parallaxing.
  skyGroup = new THREE.Group();
  scene.add(skyGroup);
  const nebTex = spriteTex([[0, 'rgba(255,255,255,.75)'], [0.4, 'rgba(255,255,255,.25)'], [1, 'rgba(255,255,255,0)']]);
  for (let i = 0; i < (LITE ? 5 : 7); i++) {
    const mat = new THREE.SpriteMaterial({ map: nebTex, transparent: true, opacity: 0.1 + Math.random() * 0.1, depthWrite: false, blending: THREE.AdditiveBlending });
    const s = new THREE.Sprite(mat);
    const sc = 14 + Math.random() * 22;
    s.scale.set(sc, sc * 0.7, 1);
    s.position.set((Math.random() - 0.5) * 40, (Math.random() - 0.5) * 18 - 3, -12 - Math.random() * 22);
    s.userData.wob = Math.random() * Math.PI * 2;
    skyGroup.add(s);
    nebulae.push(s);
  }

  // THE SPIRE — the real one. The whole run climbs this single tower.
  const profile = [];
  const SEGS = 56;
  for (let i = 0; i <= SEGS; i++) {
    const t = i / SEGS;
    const y = TOWER.bottom + t * (TOWER.top - TOWER.bottom);
    profile.push(new THREE.Vector2(radiusAt(y), y));
  }
  spireMat = new THREE.MeshBasicMaterial({ color: 0x04050b, fog: false });
  const spire = new THREE.Mesh(new THREE.LatheGeometry(profile, 9), spireMat);
  spire.position.set(TOWER.x, 0, TOWER.z);
  spire.rotation.y = 0.35;
  scene.add(spire);
  // distant sister spire, act-1-height decoration
  const prof2 = profile.map((p) => new THREE.Vector2(p.x * 0.5, p.y * 0.5 - 10));
  const spire2 = new THREE.Mesh(new THREE.LatheGeometry(prof2, 6), spireMat);
  spire2.position.set(-15, 0, -30);
  scene.add(spire2);

  // window lights scattered up the tower face — the lives inside the Spire
  {
    const n = LITE ? 70 : 120;
    windowMat = new THREE.SpriteMaterial({
      map: spriteTex([[0, 'rgba(255,255,255,.95)'], [0.4, 'rgba(255,255,255,.35)'], [1, 'rgba(255,255,255,0)']]),
      transparent: true, opacity: 0.55, depthWrite: false, blending: THREE.AdditiveBlending,
    });
    for (let i = 0; i < n; i++) {
      const y = TOWER.bottom + 6 + Math.random() * (TOWER.top - TOWER.bottom - 10);
      const a = TOWER.azBase + (Math.random() - 0.5) * 2.4;
      const r = radiusAt(y) + 0.12;
      const s = new THREE.Sprite(windowMat);
      const sc = 0.16 + Math.random() * 0.26;
      s.scale.set(sc, sc, 1);
      s.position.set(TOWER.x + Math.cos(a) * r, y, TOWER.z + Math.sin(a) * r);
      scene.add(s);
    }
  }

  // summit beacon
  beacon = new THREE.Mesh(new THREE.SphereGeometry(0.32, 12, 12), new THREE.MeshBasicMaterial({ color: 0xffffff, fog: false }));
  beacon.position.set(TOWER.x, TOWER.top + 0.9, TOWER.z);
  scene.add(beacon);
  const glowMat = new THREE.SpriteMaterial({ map: spriteTex([[0, 'rgba(255,255,255,.9)'], [0.3, 'rgba(255,255,255,.3)'], [1, 'rgba(255,255,255,0)']]), transparent: true, opacity: 0.8, depthWrite: false, blending: THREE.AdditiveBlending, fog: false });
  beaconGlow = new THREE.Sprite(glowMat);
  beaconGlow.scale.set(4, 4, 1);
  beaconGlow.position.copy(beacon.position);
  scene.add(beaconGlow);

  // ground + forest at the tower's foot — what you look down on as you climb
  groundMat = new THREE.MeshBasicMaterial({ color: 0x05070d });
  const ground = new THREE.Mesh(new THREE.CircleGeometry(70, 24), groundMat);
  ground.rotation.x = -Math.PI / 2;
  ground.position.y = -9.6;
  scene.add(ground);
  treeMat = new THREE.MeshBasicMaterial({ color: 0x060a10 });
  const treeGeo = new THREE.ConeGeometry(1, 1, 6);
  for (let i = 0; i < (LITE ? 32 : 52); i++) {
    const t = new THREE.Mesh(treeGeo, treeMat);
    let a, d, z;
    do {
      a = Math.random() * Math.PI * 2;
      d = 7 + Math.random() * 28;
      z = Math.sin(a) * d - 8;
    } while (z > 4); // never behind the camera
    const h = 2 + Math.random() * 3.4;
    t.scale.set(0.5 + Math.random() * 0.9, h, 0.5 + Math.random() * 0.9);
    t.position.set(Math.cos(a) * d, -9.6 + h / 2, z);
    scene.add(t);
  }

  // cloud decks in the act gaps — climbing to a new act punches through them
  {
    const cloudTex = spriteTex([[0, 'rgba(255,255,255,.55)'], [0.5, 'rgba(255,255,255,.22)'], [1, 'rgba(255,255,255,0)']]);
    for (const deckY of [actBaseY(1) - 2.2, actBaseY(2) - 2.2]) {
      const mat = new THREE.SpriteMaterial({ map: cloudTex, transparent: true, opacity: 0.34, depthWrite: false });
      cloudMats.push(mat);
      for (let i = 0; i < (LITE ? 10 : 16); i++) {
        const s = new THREE.Sprite(mat);
        const sc = 10 + Math.random() * 14;
        s.scale.set(sc, sc * 0.32, 1);
        let a, d, z;
        do {
          a = Math.random() * Math.PI * 2;
          d = 5 + Math.random() * 22;
          z = TOWER.z + Math.sin(a) * d;
        } while (z > -7); // the deck stays behind the play space, never in the camera's face
        s.position.set(TOWER.x + Math.cos(a) * d, deckY + (Math.random() - 0.5) * 1.6, z);
        s.userData.wob = Math.random() * Math.PI * 2;
        s.userData.cloud = true;
        scene.add(s);
        nebulae.push(s); // reuse the slow-drift update
      }
    }
  }

  // weather: one field, three behaviors — ash falls in the Woods, drowned light
  // sinks through the City, storm embers streak sideways up the Obsidian Spire
  weather = makePoints(LITE ? 170 : 300, 0.13, 44, 26, 34, 0.5);
  scene.add(weather);

  // near-foreground silhouettes: dark shards and hanging chains that frame the
  // fight and parallax against the camera's drift (faded out in map mode)
  fgGroup = new THREE.Group();
  fgGroup.position.y = alt;
  fgMat = new THREE.MeshBasicMaterial({ color: 0x020308, transparent: true, opacity: 0.96, fog: false });
  const mkFg = (geo, x, y, z, rz) => {
    const m = new THREE.Mesh(geo, fgMat);
    m.position.set(x, y, z);
    m.rotation.z = rz;
    fgGroup.add(m);
    return m;
  };
  const shardGeo = new THREE.ConeGeometry(0.55, 7.5, 5);
  mkFg(shardGeo, -4.5, -3.1, 5.3, 0.42);
  mkFg(shardGeo, -5.3, -2.6, 4.5, 0.78);
  mkFg(shardGeo, 4.7, -3.3, 5.1, -0.4);
  mkFg(shardGeo, 5.5, -2.4, 4.3, -0.82);
  const chainGeo = new THREE.CylinderGeometry(0.032, 0.032, 8, 5);
  chains = [mkFg(chainGeo, -4.1, 5.9, 5.7, 0.05), mkFg(chainGeo, 4.7, 6.1, 5.5, -0.07)];
  scene.add(fgGroup);

  // post: bloom makes the additive particles, monoliths and beacon actually glow
  composer = new EffectComposer(renderer);
  composer.addPass(new RenderPass(scene, camera));
  bloom = new UnrealBloomPass(new THREE.Vector2(innerWidth, innerHeight), 0.85, 0.55, 0.16);
  composer.addPass(bloom);
  composer.addPass(new OutputPass());

  const fit = () => {
    renderer.setSize(innerWidth, innerHeight);
    composer.setSize(innerWidth, innerHeight);
    if (LITE) bloom.setSize(innerWidth / 2, innerHeight / 2); // bloom is a blur; half-res is free glow
    camera.aspect = innerWidth / innerHeight;
    camera.updateProjectionMatrix();
  };
  fit();
  addEventListener('resize', fit);
  addEventListener('pointermove', (e) => {
    mouse.x = (e.clientX / innerWidth - 0.5) * 2;
    mouse.y = (e.clientY / innerHeight - 0.5) * 2;
  });
  setTheme(0, true);
  requestAnimationFrame(loop);
}

let bloomBase = 0.85;
export function setTheme(actIdx, instant = false) {
  const th = ACTS[Math.min(actIdx, ACTS.length - 1)].theme;
  tgt.sky.setHex(th.sky);
  tgt.fog.setHex(th.fog);
  tgt.particles.setHex(th.particles);
  tgt.glow.setHex(th.glow);
  bloomBase = 0.85;
  weatherAct = Math.min(actIdx, 2);
  weatherOp = [0.5, 0.42, 0.62][weatherAct];
  if (instant) for (const k of Object.keys(cur)) cur[k].copy(tgt[k]);
}
// victory: dawn floods in from behind the Spire — the only daylight in the game
export function sunrise() {
  tgt.sky.setHex(0x5a3452);
  tgt.fog.setHex(0x8a4a55);
  tgt.particles.setHex(0xffd9a0);
  tgt.glow.setHex(0xffc478);
  bloomBase = 1.2;
  weatherOp = 0.12; // the storm is over
}
export function kick(power = 1) { kickV = Math.min(2.2, kickV + power); speedMul = Math.min(7, speedMul + power * 2.4); }

// test-harness freeze: stop the render loop, then draw one final frame at a
// FIXED timestamp so every time-based term (camera bob, beacon pulse, node
// projection) lands on the same phase in every test run (one-way per page)
let frozen = false;
export function freezeScene() {
  frozen = true;
  frame(9e6);
}

let lt = 0;
function loop(t) {
  if (frozen) return;
  requestAnimationFrame(loop);
  frame(t);
}
function frame(t) {
  const dt = Math.min(0.05, (t - lt) / 1000 || 0.016);
  lt = t;
  const time = t / 1000;
  for (const k of Object.keys(cur)) cur[k].lerp(tgt[k], Math.min(1, dt * 1.4));
  // heat lightning on the Obsidian Spire: a silent flash silhouettes the tower
  if (weatherAct === 2 && !REDUCED && Math.random() < dt / 11) lightningV = 0.7 + Math.random() * 0.5;
  lightningV *= Math.pow(0.008, dt);
  scene.background = _sky.copy(cur.sky).lerp(_lightC, Math.min(0.6, lightningV * 0.5));
  scene.fog.color.copy(cur.fog).lerp(_lightC, Math.min(0.4, lightningV * 0.3));
  ptsMain.material.color.copy(cur.particles);
  ptsAccent.material.color.copy(cur.glow);
  for (const n of nebulae) {
    if (!n.userData.cloud) n.material.color.copy(cur.fog).lerp(cur.particles, 0.5);
    n.position.x += Math.sin(time * 0.08 + n.userData.wob) * 0.004;
  }
  spireMat.color.copy(cur.sky).multiplyScalar(0.42);
  groundMat.color.copy(cur.sky).multiplyScalar(0.3);
  treeMat.color.copy(cur.sky).multiplyScalar(0.38);
  windowMat.color.copy(cur.glow);
  for (const m of cloudMats) m.color.copy(cur.fog).lerp(_white, 0.42); // moonlit cloud sea — lighter than the sky
  beacon.material.color.copy(cur.glow);
  beaconGlow.material.color.copy(cur.glow);
  const pulse = 0.65 + Math.sin(time * 1.7) * 0.25;
  beaconGlow.material.opacity = pulse;
  beaconGlow.scale.setScalar(3.2 + pulse * 1.6);
  ptsAccent.material.opacity = 0.42 + Math.sin(time * 0.9) * 0.12;
  speedMul += (1 - speedMul) * Math.min(1, dt * 2.5);

  // particle field wraps around the camera's altitude so it climbs with you
  const cy = camera.position.y;
  for (const [pts, rate] of [[ptsMain, 1], [ptsAccent, 0.55]]) {
    const pos = pts.geometry.attributes.position;
    const seeds = pts.geometry.userData.seeds;
    for (let i = 0; i < pos.count; i++) {
      let y = pos.getY(i) + dt * rate * speedMul * (0.35 + (seeds[i] % 1) * 0.5);
      let x = pos.getX(i) + Math.sin(time * 0.5 + seeds[i]) * dt * 0.18;
      if (y > cy + 14) { y = cy - 14; x = (Math.random() - 0.5) * 46; }
      if (y < cy - 15) y = cy - 14; // camera outran the field (act jump): catch up
      pos.setY(i, y);
      pos.setX(i, x);
    }
    pos.needsUpdate = true;
  }
  kickV *= Math.pow(0.02, dt);

  // ---- weather ----------------------------------------------------------
  {
    weather.material.opacity += (weatherOp - weather.material.opacity) * Math.min(1, dt * 1.2);
    if (weatherAct === 0) weather.material.color.copy(cur.particles).lerp(_white, 0.55);      // pale ash
    else if (weatherAct === 1) weather.material.color.copy(cur.glow).lerp(_white, 0.25);      // drowned motes
    else weather.material.color.copy(cur.particles);                                          // storm embers
    const pos = weather.geometry.attributes.position;
    const seeds = weather.geometry.userData.seeds;
    for (let i = 0; i < pos.count; i++) {
      let x = pos.getX(i), y = pos.getY(i);
      const s = seeds[i] % 1;
      if (weatherAct === 0) { y -= dt * (0.45 + s * 0.55); x += Math.sin(time * 0.7 + seeds[i]) * dt * 0.5; }
      else if (weatherAct === 1) { y -= dt * (0.14 + s * 0.2); x += Math.sin(time * 0.35 + seeds[i]) * dt * 0.9; }
      else { x -= dt * (3.4 + s * 2.8); y -= dt * (0.5 + s * 0.5); }
      if (y < cy - 14) y += 28;
      if (y > cy + 14) y -= 28;
      if (x < -23) x += 46;
      if (x > 23) x -= 46;
      pos.setX(i, x);
      pos.setY(i, y);
    }
    pos.needsUpdate = true;
  }

  // ---- camera state machine --------------------------------------------
  alt += (altT - alt) * Math.min(1, dt * 1.6);
  skyGroup.position.y = cy * 0.93 + Math.sin(time * 0.3) * 0.2;
  // narrow screens see a narrower slice of the world: back the camera off in
  // proportion so the lantern route never falls out of frame on a phone
  const af = Math.max(1, 1.05 / camera.aspect);
  if (mode === 'map') {
    const viewRow = THREE.MathUtils.clamp(mapViewRow + 1.6 + peek, 1.2, ROWS + 0.4);
    const camH = actBaseY(mapAct) + viewRow * TOWER.rowH;
    const rp = Math.max(radiusAt(camH), 3.1);
    const d = (rp + 8.2) * af - kickV * 0.4;
    const az = TOWER.azBase + mouse.x * 0.06;
    _posT.set(TOWER.x + Math.cos(az) * d, camH + 1.1 - mouse.y * 0.5, TOWER.z + Math.sin(az) * d);
    _lookT.set(TOWER.x, camH + 1.9, TOWER.z);
  } else {
    // slow breathing dolly + a push-in on big hits
    _posT.set(mouse.x * 0.9, alt - mouse.y * 0.55 + Math.sin(time * 0.22) * 0.25, 10 + Math.sin(time * 0.1) * 0.3 - kickV * 0.9);
    _lookT.set(0, alt, -6);
  }
  // foreground silhouettes ride the camera's altitude with a lag (= parallax
  // on climbs) and get out of the way while the map orbits the tower
  fgGroup.position.y += (cy - fgGroup.position.y) * Math.min(1, dt * 2.2);
  fgMat.opacity += ((mode === 'map' ? 0 : 0.96) - fgMat.opacity) * Math.min(1, dt * 3);
  chains[0].rotation.z = 0.05 + Math.sin(time * 0.5) * 0.028;
  chains[1].rotation.z = -0.07 + Math.sin(time * 0.42 + 2) * 0.024;
  camera.position.lerp(_posT, Math.min(1, dt * 2.2));
  camLookCur.lerp(_lookT, Math.min(1, dt * 2.2));
  camera.lookAt(camLookCur);
  camera.rotation.z += Math.sin(time * 0.13) * 0.012 + kickV * (Math.random() - 0.5) * 0.012;

  // ---- project map lanterns to screen space for the DOM overlay ---------
  if (overlayCb && overlayAnchors) {
    const out = [];
    for (const a of overlayAnchors) {
      _v.copy(a.pos).project(camera);
      const dist = camera.position.distanceTo(a.pos);
      out.push({
        id: a.id,
        x: (_v.x * 0.5 + 0.5) * innerWidth,
        y: (-_v.y * 0.5 + 0.5) * innerHeight,
        s: THREE.MathUtils.clamp((9 * af) / dist, 0.4, 1.3),
        fade: _v.z > 1 ? 0 : THREE.MathUtils.clamp(1.3 - Math.abs(a.pos.y - camLookCur.y) / (7.5 * af), 0.1, 1),
      });
    }
    overlayCb(out);
  }

  bloom.strength = bloomBase + kickV * 0.55 + lightningV * 0.45; // big hits (and lightning) make the world flare
  composer.render();
}
