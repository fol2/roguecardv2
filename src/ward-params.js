// Ward shell defaults — owned by ?vfxedit=1 Save (POST /__ward-save).
// Imported by mesh.js; Reset restores from these values.
export const WARD_DEFAULTS = {
  pad: 1.12,
  opacity: 0.4,
  transparency: 0,
  growMs: 560,
  sites: 32,
  edgeSoftness: 0.01,
  centerDip: 0,
  shapeVerts: 8,
  shapeJitter: 0.55,
  refraction: 2,
  transmission: 1,
  ior: 1.5,
  thickness: 0,
  normalScale: 0.5,
  roughness: 0,
  envMapIntensity: 0.72,
  tint: "#4a90bf",
  idleWobble: false,
};

/** Soft-apply after Save / HMR — mutates the shared defaults object in place. */
export function _setWardDefaults(next) {
  if (!next || typeof next !== 'object') return;
  Object.assign(WARD_DEFAULTS, next);
}

// Self-accept keeps WARD_DEFAULTS object identity stable for importers.
// mesh.js also accepts this module and syncs live wardParams → combat shells.
if (import.meta.hot) {
  import.meta.hot.accept((mod) => {
    if (!mod?.WARD_DEFAULTS) return;
    _setWardDefaults(mod.WARD_DEFAULTS);
  });
}
