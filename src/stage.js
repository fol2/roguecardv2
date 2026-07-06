// The fixed virtual stage. The game renders at one of four canonical
// iPhone/iPad resolutions and scales uniformly into the real window,
// letterboxed like a console title. The camera never sees more world on a
// bigger monitor; every element keeps its designed size relative to the frame.
//
// Coordinate spaces, and the one rule:
//   - "stage px" (virtual): what all layout/JS positioning code speaks.
//   - "client px" (real): what pointer events and getBoundingClientRect speak.
//   Convert at the boundary with toStage()/stageRect(); never mix.
//
// Imports nothing; imported by scene3d/vfx/mesh/ui/main. Never import from
// engine.js or vigil.js (they must stay Node-runnable).

// Each shape lands on exactly one of the four hand-tuned layout regimes in
// styles.css: phone-portrait → the ≤740 block, phone-landscape → the
// ≤480-height block, pad-portrait → the ≤1100 block, pad-landscape → the
// full desktop layout (1180 > 1100). iPad numbers are the 11" class.
const SHAPES = {
  'phone-portrait': { w: 390, h: 844 },
  'pad-portrait': { w: 820, h: 1180 },
  'pad-landscape': { w: 1180, h: 820 },
  'phone-landscape': { w: 844, h: 390 },
};
// phone↔pad boundary: geometric mean of the neighbouring supported aspects
const PORTRAIT_SPLIT = Math.sqrt((390 / 844) * (820 / 1180)); // ≈ 0.567
const LANDSCAPE_SPLIT = Math.sqrt((1180 / 820) * (844 / 390)); // ≈ 1.765

const Q = new URLSearchParams(location.search);
const FORCE_SHAPE = Q.get('shape'); // e.g. ?shape=phone-portrait (tests/dev)
const TOUCH = Q.get('input') ? Q.get('input') === 'touch' : matchMedia('(pointer: coarse)').matches;

let shape = 'pad-landscape';
let scale = 1, offX = 0, offY = 0, el = null;

function pickShape() {
  if (FORCE_SHAPE && SHAPES[FORCE_SHAPE]) return FORCE_SHAPE;
  const a = innerWidth / Math.max(1, innerHeight);
  if (TOUCH) {
    // a real device gets its native shape…
    if (a < PORTRAIT_SPLIT) return 'phone-portrait';
    if (a > LANDSCAPE_SPLIT) return 'phone-landscape';
  }
  // …a desktop window gets the pad experience for its orientation (a 16:9
  // monitor pillarboxes the pad stage rather than blowing up the phone one)
  return a < 1 ? 'pad-portrait' : 'pad-landscape';
}

function apply() {
  shape = pickShape();
  const { w, h } = SHAPES[shape];
  scale = Math.min(innerWidth / w, innerHeight / h);
  offX = (innerWidth - w * scale) / 2;
  offY = (innerHeight - h * scale) / 2;
  el.style.width = `${w}px`;
  el.style.height = `${h}px`;
  el.style.left = `${offX}px`;
  el.style.top = `${offY}px`;
  el.style.transform = `scale(${scale})`; // uniform — even at 1, so the containing block never flips
  document.documentElement.dataset.vp = shape;
}

export function initStage() {
  el = document.getElementById('stage');
  apply();
  // stage re-fits before the game layers: scene/vfx/mesh register their
  // resize handlers later, and ui's combat refit is debounced past this
  addEventListener('resize', apply);
}

export const stageW = () => SHAPES[shape].w;
export const stageH = () => SHAPES[shape].h;
export const stageScale = () => scale;
export const stageEl = () => el;
export const stageInfo = () => ({ shape, w: SHAPES[shape].w, h: SHAPES[shape].h, scale });
/** client px → stage px */
export const toStage = (x, y) => ({ x: (x - offX) / scale, y: (y - offY) / scale });
/** getBoundingClientRect, mapped into stage px */
export function stageRect(elm) {
  const r = elm.getBoundingClientRect();
  return {
    left: (r.left - offX) / scale, top: (r.top - offY) / scale,
    right: (r.right - offX) / scale, bottom: (r.bottom - offY) / scale,
    width: r.width / scale, height: r.height / scale,
  };
}
