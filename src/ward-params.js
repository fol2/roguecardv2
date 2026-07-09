// Ward shell defaults — owned by ?vfxedit=1 Save (POST /__ward-save).
// Imported by mesh.js; Reset restores from these values.
export const WARD_DEFAULTS = {
  pad: 1.24,             // shell size vs body (constant during grow — no zoom)
  opacity: 1,            // material opacity at full grow
  transparency: 0,       // 0 = dense fill, 1 = clear see-through (scales alphaMap fill)
  growMs: 560,           // Grow / Clear duration (ms)
  sites: 16,             // Voronoi facet count (rebake)
  edgeSoftness: 0.22,    // 0 = sharp oval edge, higher = soft shaded falloff
  centerDip: 0.38,       // center thinness (0 = solid, higher = gem dip; not rim-only)
  refraction: 1,         // master: scales transmission + thickness + normalScale
  transmission: 1,
  ior: 1.4,
  thickness: 0.14,
  normalScale: 1.35,     // Voronoi seam strength (grow ramps this 0→full)
  roughness: 0.03,
  envMapIntensity: 0.08, // env reflection
  tint: '#c5e8ff',
  idleWobble: false,     // off by default — shell stays still
};

/** Soft-apply after Save / HMR — mutates the shared defaults object in place. */
export function _setWardDefaults(next) {
  if (!next || typeof next !== 'object') return;
  Object.assign(WARD_DEFAULTS, next);
}

if (import.meta.hot) {
  import.meta.hot.accept((mod) => {
    if (!mod?.WARD_DEFAULTS) return;
    _setWardDefaults(mod.WARD_DEFAULTS);
  });
}
