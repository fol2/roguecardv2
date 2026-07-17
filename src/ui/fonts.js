// Round 5 self-hosted font boot. Seven WOFF2 URLs are resolved through Vite
// `?url` at build time (same-origin, hashed filenames); this module preloads
// and constructs FontFace objects and only resolves once every family/weight
// FE relies on reports loaded. `loadRound5Fonts` is idempotent.

import cinzel500 from '@fontsource/cinzel/files/cinzel-latin-500-normal.woff2?url';
import cinzel700 from '@fontsource/cinzel/files/cinzel-latin-700-normal.woff2?url';
import cinzel800 from '@fontsource/cinzel/files/cinzel-latin-800-normal.woff2?url';
import alegreya400 from '@fontsource/alegreya/files/alegreya-latin-400-normal.woff2?url';
import alegreya500 from '@fontsource/alegreya/files/alegreya-latin-500-normal.woff2?url';
import alegreya700 from '@fontsource/alegreya/files/alegreya-latin-700-normal.woff2?url';
import alegreya400i from '@fontsource/alegreya/files/alegreya-latin-400-italic.woff2?url';

export const ROUND5_FONT_FACES = Object.freeze([
  Object.freeze({ family: 'Cinzel', weight: '500', style: 'normal', url: cinzel500 }),
  Object.freeze({ family: 'Cinzel', weight: '700', style: 'normal', url: cinzel700 }),
  Object.freeze({ family: 'Cinzel', weight: '800', style: 'normal', url: cinzel800 }),
  Object.freeze({ family: 'Alegreya', weight: '400', style: 'normal', url: alegreya400 }),
  Object.freeze({ family: 'Alegreya', weight: '500', style: 'normal', url: alegreya500 }),
  Object.freeze({ family: 'Alegreya', weight: '700', style: 'normal', url: alegreya700 }),
  Object.freeze({ family: 'Alegreya', weight: '400', style: 'italic', url: alegreya400i }),
]);

const READINESS_PROBES = Object.freeze([
  '700 16px Cinzel',
  '400 16px Alegreya',
  'italic 400 16px Alegreya',
]);

let bootedForDocument = null;

function injectPreload(doc, url) {
  const existing = doc.head?.querySelector?.(`link[rel="preload"][href="${url}"]`);
  if (existing) return existing;
  const link = doc.createElement('link');
  link.rel = 'preload';
  link.as = 'font';
  link.type = 'font/woff2';
  link.href = url;
  link.crossOrigin = 'anonymous';
  doc.head.appendChild(link);
  return link;
}

async function loadFace(doc, face) {
  const fontFace = new FontFace(
    face.family,
    `url(${face.url}) format('woff2')`,
    { weight: face.weight, style: face.style, display: 'swap' },
  );
  await fontFace.load();
  doc.fonts.add(fontFace);
  return fontFace;
}

/**
 * Preload every self-hosted Round 5 WOFF2 and add matching FontFace records
 * to `doc.fonts`. Resolves only after every readiness probe reports loaded.
 */
export async function loadRound5Fonts(doc = globalThis.document) {
  if (!doc || !doc.fonts) throw new Error('loadRound5Fonts requires a document with fonts API');
  if (bootedForDocument === doc) return ROUND5_FONT_FACES;

  for (const face of ROUND5_FONT_FACES) injectPreload(doc, face.url);
  await Promise.all(ROUND5_FONT_FACES.map((face) => loadFace(doc, face)));

  await Promise.all(READINESS_PROBES.map((probe) => doc.fonts.load(probe)));
  await doc.fonts.ready;

  for (const probe of READINESS_PROBES) {
    if (!doc.fonts.check(probe)) {
      throw new Error(`Round 5 font readiness probe failed: ${probe}`);
    }
  }
  bootedForDocument = doc;
  return ROUND5_FONT_FACES;
}

/** Test-only reset so `loadRound5Fonts` can be re-run against a fresh document. */
export function _resetRound5FontsForTests() {
  bootedForDocument = null;
}
