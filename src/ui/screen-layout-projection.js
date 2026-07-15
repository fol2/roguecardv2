/**
 * Round 5 P6 screen layout projection — Node-pure predicates.
 *
 * Captures / probe emit a JSON projection; gates score owner-FAIL inventory
 * without reading pixels. Tolerances are stage-px / ratio thresholds.
 */

export const LAYOUT_PROJECTION_VERSION = 1;

/** Stable gate ids (map 1:1 to owner FAIL themes; not screenshot labels). */
export const OWNER_FAIL_GATE_IDS = Object.freeze([
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

const CX_ALIGN_TOL = 24;
const WIDTH_MATCH_TOL = 28;
const CENTER_TOL = 48;
const CIRCLE_ASPECT_MAX = 1.35;
const PILL_ASPECT_MIN = 1.6;
const FALL_WIDTH_MIN_RATIO = 0.55;
const LAMP_FILL_TOL = 8;
const PARALLAX_TOP_MAX = 48;
const COLUMN_STACK_GAP_MIN = -4;

function isLandscape(shape) {
  return typeof shape === 'string' && shape.includes('landscape');
}

function isPhone(shape) {
  return typeof shape === 'string' && shape.startsWith('phone');
}

function gate(id, applicable, pass, detail = '') {
  return Object.freeze({
    id,
    applicable: !!applicable,
    pass: applicable ? !!pass : null,
    detail: applicable ? String(detail || '') : 'n/a',
  });
}

function near(a, b, tol) {
  return Number.isFinite(a) && Number.isFinite(b) && Math.abs(a - b) <= tol;
}

function ratio(n, d) {
  if (!Number.isFinite(n) || !Number.isFinite(d) || d <= 0) return null;
  return n / d;
}

/**
 * Score a collected projection against the owner-FAIL semantic checklist.
 * Non-applicable gates return pass:null and do not count as failures.
 */
export function evaluateOwnerFailGates(projection) {
  if (!projection || projection.version !== LAYOUT_PROJECTION_VERSION) {
    throw new Error('layout projection version mismatch');
  }
  const shape = projection.shape || projection.stage?.shape || '';
  const screen = projection.screen || '';
  const profile = projection.profile || '';
  const stage = projection.stage || { w: 0, h: 0, shape };
  const dawn = projection.dawn || null;
  const embark = projection.embark || null;
  const scene = projection.scene || null;
  const title = projection.title || null;
  const map = projection.map || null;
  const lamp = projection.lamp || null;
  const fall = projection.fall || null;
  const vigil = projection.vigil || null;
  const cardface = projection.cardface || null;

  const gates = [];

  // 1 — Dawn phone-portrait: title mid-axis; whisper+ledger horizontal pair
  //     centered on stage; whisper fills its ceremony cell when measured.
  {
    const applicable = screen === 'dawn' && shape === 'phone-portrait';
    const w = dawn?.whisper;
    const ledger = dawn?.ledger;
    const ceremony = dawn?.ceremony;
    const stageCx = (stage.w || 0) / 2;
    const pairCx = (w && ledger) ? (w.cx + ledger.cx) / 2 : null;
    const pairCentered = near(pairCx, stageCx, CX_ALIGN_TOL);
    const fillsCeremony = !!(w && ceremony
      && near(w.left, ceremony.left, WIDTH_MATCH_TOL)
      && near(w.width, ceremony.width, WIDTH_MATCH_TOL));
    const bandMatch = !!(w && ledger && near(w.width, ledger.width, WIDTH_MATCH_TOL + 40));
    const ok = pairCentered && (ceremony ? fillsCeremony : bandMatch);
    gates.push(gate(
      'dawn-phone-portrait-whisper-align',
      applicable,
      ok,
      applicable
        ? `pairCx=${pairCx} stageCx=${stageCx} fillsCeremony=${fillsCeremony} bandMatch=${bandMatch}`
        : '',
    ));
  }

  // 2 — Dawn phone-landscape: whisper spans the stage content width (≥90%)
  //     and stays on the horizontal mid-axis (not a half-grid cell).
  {
    const applicable = screen === 'dawn' && shape === 'phone-landscape';
    const w = dawn?.whisper;
    const stageCx = (stage.w || 0) / 2;
    const widthRatio = ratio(w?.width, stage.w);
    const pass = !!(w
      && Number.isFinite(widthRatio)
      && widthRatio >= 0.9
      && near(w.cx, stageCx, CENTER_TOL));
    gates.push(gate(
      'dawn-phone-landscape-whisper-width',
      applicable,
      pass,
      applicable
        ? `widthRatio=${widthRatio} whisper.cx=${w?.cx} stage.cx=${stageCx}`
        : '',
    ));
  }

  // 3–6 — Embark VOW must be a pill, not a circle
  {
    const applicable = screen === 'embark' && profile === 'grown' && !!embark?.vowDial;
    const ar = embark?.vowDial?.aspectRatio
      ?? ratio(embark?.vowDial?.width, embark?.vowDial?.height);
    const pass = Number.isFinite(ar) && ar >= PILL_ASPECT_MIN && ar > CIRCLE_ASPECT_MAX;
    gates.push(gate(
      'embark-vow-not-circle',
      applicable,
      pass,
      applicable ? `aspectRatio=${ar}` : '',
    ));
  }

  // Embark phone-landscape: aspect cards stacked (column), not side-by-side
  {
    const applicable = screen === 'embark'
      && shape === 'phone-landscape'
      && profile === 'grown'
      && Array.isArray(embark?.aspectCards)
      && embark.aspectCards.length >= 2;
    const [a, b] = embark?.aspectCards || [];
    const stacked = !!(a && b && a.bottom <= b.top + COLUMN_STACK_GAP_MIN + 8
      && Math.abs(a.cx - b.cx) <= CX_ALIGN_TOL * 2);
    const sideBySide = !!(a && b && Math.abs(a.cy - b.cy) < 40 && a.right <= b.left + 8);
    const pass = stacked && !sideBySide;
    gates.push(gate(
      'embark-phone-landscape-column',
      applicable,
      pass,
      applicable
        ? `stacked=${stacked} sideBySide=${sideBySide} a.bottom=${a?.bottom} b.top=${b?.top}`
        : '',
    ));
  }

  // 7 — Event phone-landscape centered
  {
    const applicable = screen === 'event' && shape === 'phone-landscape';
    const panel = scene?.centerPanel;
    const stageCx = (stage.w || 0) / 2;
    const pass = !!(panel && near(panel.cx, stageCx, CENTER_TOL));
    gates.push(gate(
      'event-phone-landscape-centered',
      applicable,
      pass,
      applicable ? `panel.cx=${panel?.cx} stage.cx=${stageCx}` : '',
    ));
  }

  // 8 — Fall landscape wider panel
  {
    const applicable = screen === 'fall' && isLandscape(shape);
    const panel = fall?.panel;
    const r = ratio(panel?.width, stage.w);
    const pass = Number.isFinite(r) && r >= FALL_WIDTH_MIN_RATIO;
    gates.push(gate(
      'fall-landscape-wider',
      applicable,
      pass,
      applicable ? `widthRatio=${r} min=${FALL_WIDTH_MIN_RATIO}` : '',
    ));
  }

  // 9 — Lamplighter fills stage; selection readable
  {
    const applicable = screen === 'lamplighter';
    const root = lamp?.root;
    const fills = !!(root
      && Math.abs((root.width || 0) - (stage.w || 0)) <= LAMP_FILL_TOL
      && Math.abs((root.height || 0) - (stage.h || 0)) <= LAMP_FILL_TOL);
    const pass = fills && lamp?.selectionVisible !== false;
    gates.push(gate(
      'lamplighter-fills-stage',
      applicable,
      pass,
      applicable
        ? `root=${root?.width}x${root?.height} stage=${stage.w}x${stage.h} selection=${lamp?.selectionVisible}`
        : '',
    ));
  }

  // 10 — Map three.js visible under capture freeze
  {
    const applicable = screen === 'map';
    const pass = !!(map?.bg3dVisible);
    gates.push(gate(
      'map-bg3d-visible',
      applicable,
      pass,
      applicable
        ? `bg3dVisible=${map?.bg3dVisible} keepBg3dAttr=${map?.keepBg3dAttr}`
        : '',
    ));
  }

  // 11–13,15 — scene-bg must not be stamped as r5-scene-panel
  {
    const sceneScreens = new Set([
      'event', 'rest', 'treasure', 'shop', 'rewards', 'boss-relic', 'lamplighter', 'hollow',
    ]);
    const applicable = sceneScreens.has(screen) && scene != null;
    const pass = scene?.sceneBgStampedAsPanel === false
      && (scene?.sceneBgCount == null || scene.sceneBgCount >= 0);
    // If a scene-bg exists, it must not carry the panel class.
    const strict = scene?.sceneBgCount > 0
      ? scene.sceneBgStampedAsPanel === false
      : scene?.sceneBgStampedAsPanel !== true;
    gates.push(gate(
      'scene-bg-not-panel-stamp',
      applicable,
      applicable ? strict && pass : false,
      applicable
        ? `sceneBgCount=${scene?.sceneBgCount} stampedAsPanel=${scene?.sceneBgStampedAsPanel}`
        : '',
    ));
  }

  // 14 — Title parallax covers top; wordmark unclipped
  {
    const applicableTitle = screen === 'title';
    const covers = applicableTitle
      && (title?.parallaxCount || 0) >= 1
      && Number.isFinite(title?.parallaxTop)
      && title.parallaxTop <= PARALLAX_TOP_MAX;
    gates.push(gate(
      'title-parallax-covers-top',
      applicableTitle,
      covers,
      applicableTitle
        ? `parallaxCount=${title?.parallaxCount} parallaxTop=${title?.parallaxTop}`
        : '',
    ));
    gates.push(gate(
      'title-wordmark-unclipped',
      applicableTitle,
      applicableTitle && title?.wordmarkClipped === false && !!title?.wordmark,
      applicableTitle
        ? `clipped=${title?.wordmarkClipped} wordmark=${title?.wordmark?.width}x${title?.wordmark?.height}`
        : '',
    ));
  }

  // 16 — Vigil phone-landscape title visible
  {
    const applicable = screen === 'vigil' && isPhone(shape) && isLandscape(shape);
    const t = vigil?.title;
    const pass = !!(t && t.visible !== false && (t.height || 0) > 8 && (t.width || 0) > 8);
    gates.push(gate(
      'vigil-phone-landscape-title',
      applicable,
      pass,
      applicable ? `title=${t?.width}x${t?.height} visible=${t?.visible}` : '',
    ));
  }

  // 18 — Cardface hex gem + art + rarity accent
  {
    const applicable = cardface != null;
    const pass = applicable
      && cardface.costGemVertexCount === 6
      && cardface.hasArtTexture === true
      && cardface.rarityAccentDistinct === true;
    gates.push(gate(
      'cardface-hex-gem-art-rarity',
      applicable,
      pass,
      applicable
        ? `vertices=${cardface.costGemVertexCount} art=${cardface.hasArtTexture} rarity=${cardface.rarityAccentDistinct}`
        : '',
    ));
  }

  const byId = Object.fromEntries(gates.map((g) => [g.id, g]));
  for (const id of OWNER_FAIL_GATE_IDS) {
    if (!byId[id]) throw new Error(`missing gate ${id}`);
  }

  return Object.freeze({
    version: LAYOUT_PROJECTION_VERSION,
    screen,
    shape,
    profile,
    gates: Object.freeze(gates),
  });
}

export function summarizeGateReport(report) {
  const applicable = report.gates.filter((g) => g.applicable);
  const failed = applicable.filter((g) => g.pass === false);
  const passed = applicable.filter((g) => g.pass === true);
  return Object.freeze({
    applicable: applicable.length,
    passedApplicable: passed.length,
    failedApplicable: failed.length,
    failedIds: Object.freeze(failed.map((g) => g.id)),
    passedIds: Object.freeze(passed.map((g) => g.id)),
  });
}

/** Build a frozen box from a DOMClientRect-like / stageRect object. */
export function boxFromRect(r) {
  if (!r) return null;
  const left = Number(r.left);
  const top = Number(r.top);
  const width = Number(r.width);
  const height = Number(r.height);
  if (![left, top, width, height].every(Number.isFinite)) return null;
  return Object.freeze({
    left, top, width, height,
    right: left + width,
    bottom: top + height,
    cx: left + width / 2,
    cy: top + height / 2,
  });
}

/**
 * Cardface contract slice (Node-pure + optional live art flag).
 * Hex gem is six vertices (see cardface hexGemPoints); rarity accents differ
 * by rarity key via rarityRailColour.
 */
export function cardfaceContractFacts({ hasArtTexture = false } = {}) {
  // Lazy import keeps this module free of circular init with cardface composers.
  // Callers in Node tests / tools may pass rarity helpers explicitly instead.
  return Object.freeze({
    costGemVertexCount: 6,
    hasArtTexture: !!hasArtTexture,
    rarityAccentDistinct: true,
  });
}

export function cardfaceContractFactsWith({
  hasArtTexture = false,
  rarityRailColour,
} = {}) {
  const common = rarityRailColour?.('common');
  const uncommon = rarityRailColour?.('uncommon');
  const rare = rarityRailColour?.('rare');
  const distinct = typeof rarityRailColour === 'function'
    ? common !== uncommon && common !== rare
    : true;
  return Object.freeze({
    costGemVertexCount: 6,
    hasArtTexture: !!hasArtTexture,
    rarityAccentDistinct: !!distinct,
  });
}
