// three.js atmospheric background — the "3D" half of the 2D+3D fusion.
import * as THREE from 'three';
import { ACTS } from './data.js';

let renderer, scene, camera;
let ptsMain, ptsAccent, monoliths = [], nebulae = [];
let cur = { sky: new THREE.Color(0x0b0e1a), fog: new THREE.Color(0x141a2e), particles: new THREE.Color(0xffa04d), glow: new THREE.Color(0x66ff9e) };
let tgt = { sky: cur.sky.clone(), fog: cur.fog.clone(), particles: cur.particles.clone(), glow: cur.glow.clone() };
let mouse = { x: 0, y: 0 };
let kickV = 0;
let speedMul = 1;

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

export function initScene() {
  const canvas = document.getElementById('bg3d');
  renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: false });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 1.75));
  scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(cur.fog.getHex(), 0.055);
  camera = new THREE.PerspectiveCamera(58, 1, 0.1, 100);
  camera.position.set(0, 0, 10);

  ptsMain = makePoints(900, 0.16, 46, 26, 40, 0.75);
  ptsAccent = makePoints(240, 0.32, 46, 26, 34, 0.5);
  scene.add(ptsMain, ptsAccent);

  // monoliths — slow-rotating wireframe relics deep in the fog
  const geos = [
    new THREE.IcosahedronGeometry(3.4, 0),
    new THREE.TorusKnotGeometry(2.2, 0.5, 64, 8, 2, 3),
    new THREE.OctahedronGeometry(2.6, 0),
  ];
  geos.forEach((g, i) => {
    const m = new THREE.Mesh(g, new THREE.MeshBasicMaterial({ wireframe: true, transparent: true, opacity: 0.16 }));
    m.position.set([-11, 12, 0][i], [3, -2, 7][i], [-16, -20, -26][i]);
    m.userData.spin = 0.05 + i * 0.02;
    scene.add(m);
    monoliths.push(m);
  });

  // nebula billboards
  const nebTex = spriteTex([[0, 'rgba(255,255,255,.75)'], [0.4, 'rgba(255,255,255,.25)'], [1, 'rgba(255,255,255,0)']]);
  for (let i = 0; i < 7; i++) {
    const mat = new THREE.SpriteMaterial({ map: nebTex, transparent: true, opacity: 0.1 + Math.random() * 0.1, depthWrite: false, blending: THREE.AdditiveBlending });
    const s = new THREE.Sprite(mat);
    const sc = 14 + Math.random() * 22;
    s.scale.set(sc, sc * 0.7, 1);
    s.position.set((Math.random() - 0.5) * 40, (Math.random() - 0.5) * 18 - 3, -12 - Math.random() * 22);
    s.userData.wob = Math.random() * Math.PI * 2;
    scene.add(s);
    nebulae.push(s);
  }

  const fit = () => {
    renderer.setSize(innerWidth, innerHeight);
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

export function setTheme(actIdx, instant = false) {
  const th = ACTS[Math.min(actIdx, ACTS.length - 1)].theme;
  tgt.sky.setHex(th.sky);
  tgt.fog.setHex(th.fog);
  tgt.particles.setHex(th.particles);
  tgt.glow.setHex(th.glow);
  if (instant) for (const k of Object.keys(cur)) cur[k].copy(tgt[k]);
}
export function kick(power = 1) { kickV = Math.min(2.2, kickV + power); speedMul = Math.min(7, speedMul + power * 2.4); }

let lt = 0;
function loop(t) {
  requestAnimationFrame(loop);
  const dt = Math.min(0.05, (t - lt) / 1000 || 0.016);
  lt = t;
  const time = t / 1000;
  for (const k of Object.keys(cur)) cur[k].lerp(tgt[k], Math.min(1, dt * 1.4));
  scene.background = cur.sky;
  scene.fog.color.copy(cur.fog);
  ptsMain.material.color.copy(cur.particles);
  ptsAccent.material.color.copy(cur.glow);
  for (const m of monoliths) {
    m.material.color.copy(cur.glow);
    m.rotation.y += m.userData.spin * dt;
    m.rotation.x += m.userData.spin * 0.6 * dt;
    m.position.y += Math.sin(time * 0.3 + m.userData.spin * 40) * 0.0035;
  }
  for (const n of nebulae) {
    n.material.color.copy(cur.fog).lerp(cur.particles, 0.5);
    n.position.x += Math.sin(time * 0.08 + n.userData.wob) * 0.004;
  }
  speedMul += (1 - speedMul) * Math.min(1, dt * 2.5);
  for (const [pts, rate] of [[ptsMain, 1], [ptsAccent, 0.55]]) {
    const pos = pts.geometry.attributes.position;
    const seeds = pts.geometry.userData.seeds;
    for (let i = 0; i < pos.count; i++) {
      let y = pos.getY(i) + dt * rate * speedMul * (0.35 + (seeds[i] % 1) * 0.5);
      let x = pos.getX(i) + Math.sin(time * 0.5 + seeds[i]) * dt * 0.18;
      if (y > 14) { y = -14; x = (Math.random() - 0.5) * 46; }
      pos.setY(i, y);
      pos.setX(i, x);
    }
    pos.needsUpdate = true;
  }
  kickV *= Math.pow(0.02, dt);
  camera.position.x += (mouse.x * 0.9 - camera.position.x) * dt * 2;
  camera.position.y += (-mouse.y * 0.55 + Math.sin(time * 0.22) * 0.25 - camera.position.y) * dt * 2;
  camera.position.z = 10 - kickV * 0.55;
  camera.rotation.z = Math.sin(time * 0.13) * 0.012 + kickV * (Math.random() - 0.5) * 0.012;
  camera.lookAt(0, 0, -6);
  renderer.render(scene, camera);
}
