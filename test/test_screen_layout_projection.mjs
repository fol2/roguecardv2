/**
 * Node-pure gates for Round 5 P6 owner-FAIL layout projection.
 * Evidence is JSON predicates — not screenshot taste.
 */
import assert from 'node:assert/strict';
import {
  LAYOUT_PROJECTION_VERSION,
  OWNER_FAIL_GATE_IDS,
  evaluateOwnerFailGates,
  summarizeGateReport,
} from '../src/ui/screen-layout-projection.js';

assert.equal(LAYOUT_PROJECTION_VERSION, 1);
assert.deepEqual(OWNER_FAIL_GATE_IDS, [
  'dawn-phone-portrait-whisper-align',
  'dawn-phone-landscape-whisper-width',
  'embark-vow-not-circle',
  'embark-phone-landscape-column',
  'event-phone-landscape-centered',
  'fall-landscape-wider',
  'lamplighter-fills-stage',
  'map-bg3d-visible',
  'scene-bg-not-panel-stamp',
  'title-parallax-covers-top',
  'title-wordmark-unclipped',
  'vigil-phone-landscape-title',
  'cardface-hex-gem-art-rarity',
]);

function box(left, top, width, height) {
  return {
    left, top, width, height,
    right: left + width,
    bottom: top + height,
    cx: left + width / 2,
    cy: top + height / 2,
  };
}

function base(overrides = {}) {
  return {
    version: LAYOUT_PROJECTION_VERSION,
    screen: 'title',
    shape: 'desktop-landscape',
    profile: 'grown',
    stage: { w: 1280, h: 720, shape: 'desktop-landscape' },
    ...overrides,
  };
}

// --- RED cases: known owner-FAIL shapes must FAIL predicates ---

{
  // Pair shoved to the left — not stage-centered.
  const report = evaluateOwnerFailGates(base({
    screen: 'dawn',
    shape: 'phone-portrait',
    stage: { w: 390, h: 844, shape: 'phone-portrait' },
    dawn: {
      whisper: box(10, 200, 100, 40),
      ledger: box(120, 200, 100, 120),
      ceremony: box(10, 180, 100, 80),
    },
  }));
  const gate = report.gates.find((g) => g.id === 'dawn-phone-portrait-whisper-align');
  assert.equal(gate.applicable, true);
  assert.equal(gate.pass, false, 'off-center pair must fail');
}

{
  const report = evaluateOwnerFailGates(base({
    screen: 'dawn',
    shape: 'phone-landscape',
    stage: { w: 844, h: 390, shape: 'phone-landscape' },
    dawn: {
      whisper: box(40, 40, 300, 40), // half-grid, not full span
    },
  }));
  assert.equal(report.gates.find((g) => g.id === 'dawn-phone-landscape-whisper-width').pass, false);
}

{
  const report = evaluateOwnerFailGates(base({
    screen: 'embark',
    shape: 'phone-landscape',
    profile: 'grown',
    embark: {
      vowDial: { ...box(400, 500, 120, 120), aspectRatio: 1 },
      aspectCards: [box(100, 80, 400, 120), box(520, 80, 400, 120)],
    },
  }));
  assert.equal(report.gates.find((g) => g.id === 'embark-vow-not-circle').pass, false);
  assert.equal(report.gates.find((g) => g.id === 'embark-phone-landscape-column').pass, false);
}

{
  const report = evaluateOwnerFailGates(base({
    screen: 'event',
    shape: 'phone-landscape',
    scene: {
      sceneBgCount: 1,
      sceneBgStampedAsPanel: true,
      centerPanel: box(900, 40, 300, 400),
    },
    stage: { w: 740, h: 360, shape: 'phone-landscape' },
  }));
  assert.equal(report.gates.find((g) => g.id === 'scene-bg-not-panel-stamp').pass, false);
  assert.equal(report.gates.find((g) => g.id === 'event-phone-landscape-centered').pass, false);
}

{
  const report = evaluateOwnerFailGates(base({
    screen: 'title',
    shape: 'desktop-landscape',
    title: {
      parallaxCount: 3,
      parallaxTop: 200,
      wordmark: box(400, 40, 400, 80),
      wordmarkClipped: true,
    },
    stage: { w: 1280, h: 720, shape: 'desktop-landscape' },
  }));
  assert.equal(report.gates.find((g) => g.id === 'title-parallax-covers-top').pass, false);
  assert.equal(report.gates.find((g) => g.id === 'title-wordmark-unclipped').pass, false);
}

{
  const report = evaluateOwnerFailGates(base({
    screen: 'map',
    map: { bg3dVisible: false, keepBg3dAttr: false },
  }));
  assert.equal(report.gates.find((g) => g.id === 'map-bg3d-visible').pass, false);
}

{
  const report = evaluateOwnerFailGates(base({
    screen: 'shop',
    cardface: {
      costGemVertexCount: 4,
      hasArtTexture: false,
      rarityAccentDistinct: false,
    },
  }));
  assert.equal(report.gates.find((g) => g.id === 'cardface-hex-gem-art-rarity').pass, false);
}

// --- GREEN cases: remediated shapes must PASS ---

{
  // Horizontal pair centered on stage mid; whisper fills ceremony cell.
  const report = evaluateOwnerFailGates(base({
    screen: 'dawn',
    shape: 'phone-portrait',
    stage: { w: 390, h: 844, shape: 'phone-portrait' },
    dawn: {
      whisper: box(20, 400, 160, 40),
      ledger: box(210, 380, 160, 120),
      ceremony: box(20, 380, 160, 80),
    },
  }));
  assert.equal(report.gates.find((g) => g.id === 'dawn-phone-portrait-whisper-align').pass, true);
}

{
  const report = evaluateOwnerFailGates(base({
    screen: 'dawn',
    shape: 'phone-landscape',
    stage: { w: 844, h: 390, shape: 'phone-landscape' },
    dawn: {
      whisper: box(24, 40, 796, 40),
    },
  }));
  assert.equal(report.gates.find((g) => g.id === 'dawn-phone-landscape-whisper-width').pass, true);
}

{
  const report = evaluateOwnerFailGates(base({
    screen: 'embark',
    shape: 'phone-landscape',
    profile: 'grown',
    embark: {
      vowDial: { ...box(200, 300, 340, 56), aspectRatio: 340 / 56 },
      aspectCards: [box(180, 60, 380, 100), box(180, 170, 380, 100)],
    },
  }));
  assert.equal(report.gates.find((g) => g.id === 'embark-vow-not-circle').pass, true);
  assert.equal(report.gates.find((g) => g.id === 'embark-phone-landscape-column').pass, true);
}

{
  const report = evaluateOwnerFailGates(base({
    screen: 'event',
    shape: 'phone-landscape',
    stage: { w: 740, h: 360, shape: 'phone-landscape' },
    scene: {
      sceneBgCount: 1,
      sceneBgStampedAsPanel: false,
      centerPanel: box(170, 20, 400, 320),
    },
  }));
  assert.equal(report.gates.find((g) => g.id === 'scene-bg-not-panel-stamp').pass, true);
  assert.equal(report.gates.find((g) => g.id === 'event-phone-landscape-centered').pass, true);
}

{
  const report = evaluateOwnerFailGates(base({
    screen: 'fall',
    shape: 'desktop-landscape',
    stage: { w: 1280, h: 720, shape: 'desktop-landscape' },
    fall: { panel: box(240, 40, 800, 640) },
  }));
  assert.equal(report.gates.find((g) => g.id === 'fall-landscape-wider').pass, true);
}

{
  const report = evaluateOwnerFailGates(base({
    screen: 'lamplighter',
    shape: 'phone-portrait',
    stage: { w: 390, h: 844, shape: 'phone-portrait' },
    lamp: {
      root: box(0, 0, 390, 844),
      selectionVisible: true,
    },
  }));
  assert.equal(report.gates.find((g) => g.id === 'lamplighter-fills-stage').pass, true);
}

{
  const report = evaluateOwnerFailGates(base({
    screen: 'map',
    map: { bg3dVisible: true, keepBg3dAttr: true },
  }));
  assert.equal(report.gates.find((g) => g.id === 'map-bg3d-visible').pass, true);
}

{
  const report = evaluateOwnerFailGates(base({
    screen: 'title',
    stage: { w: 1280, h: 720, shape: 'desktop-landscape' },
    title: {
      parallaxCount: 3,
      parallaxTop: 0,
      wordmark: box(440, 80, 400, 90),
      wordmarkClipped: false,
    },
  }));
  assert.equal(report.gates.find((g) => g.id === 'title-parallax-covers-top').pass, true);
  assert.equal(report.gates.find((g) => g.id === 'title-wordmark-unclipped').pass, true);
}

{
  const report = evaluateOwnerFailGates(base({
    screen: 'vigil',
    shape: 'phone-landscape',
    vigil: { title: { ...box(40, 12, 200, 28), visible: true } },
  }));
  assert.equal(report.gates.find((g) => g.id === 'vigil-phone-landscape-title').pass, true);
}

{
  const report = evaluateOwnerFailGates(base({
    screen: 'shop',
    cardface: {
      costGemVertexCount: 6,
      hasArtTexture: true,
      rarityAccentDistinct: true,
    },
  }));
  assert.equal(report.gates.find((g) => g.id === 'cardface-hex-gem-art-rarity').pass, true);
}

{
  const ok = evaluateOwnerFailGates(base({
    screen: 'embark',
    shape: 'phone-landscape',
    profile: 'grown',
    embark: {
      vowDial: { ...box(200, 300, 340, 56), aspectRatio: 340 / 56 },
      aspectCards: [box(180, 60, 380, 100), box(180, 170, 380, 100)],
    },
    scene: { sceneBgCount: 0, sceneBgStampedAsPanel: false, centerPanel: null },
    cardface: {
      costGemVertexCount: 6,
      hasArtTexture: true,
      rarityAccentDistinct: true,
    },
  }));
  const summary = summarizeGateReport(ok);
  assert.equal(summary.failedApplicable, 0);
  assert.ok(summary.passedApplicable >= 2);
}

console.log('screen-layout-projection unit checks passed');
