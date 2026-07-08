// PNG alpha → cast-shadow ox/oy for ?charedit=1.
// Maps scanned feet into the art box using the same contain + center-bottom
// layout combat / the editor use. Does NOT move the sprite — only suggests origin %.

const ALPHA = 90; // match mesh body bake threshold

/** object-fit:contain + object-position:center bottom → drawn image rect in the box. */
export function containBottom(nw, nh, bw, bh) {
  if (nw <= 0 || nh <= 0 || bw <= 0 || bh <= 0) return null;
  const s = Math.min(bw / nw, bh / nh);
  const dw = nw * s;
  const dh = nh * s;
  return { s, dw, dh, ox: (bw - dw) / 2, oy: bh - dh };
}

/**
 * Lowest solid foot contact in image pixels.
 * Skips single-pixel cape/hem tips: prefers the lowest row whose opaque span
 * is at least ~8% of the silhouette width (min 3px).
 * @returns {{ footX: number, footRow: number, bbox: {x0:number,x1:number,y0:number,y1:number} } | null}
 */
export function feetFromAlpha(data, w, h, { alpha = ALPHA } = {}) {
  if (!data || w < 2 || h < 2) return null;
  let x0 = w, x1 = -1, y0 = h, y1 = -1;
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      if (data[(y * w + x) * 4 + 3] <= alpha) continue;
      if (x < x0) x0 = x;
      if (x > x1) x1 = x;
      if (y < y0) y0 = y;
      if (y > y1) y1 = y;
    }
  }
  if (x1 < 0) return null;
  const silW = Math.max(1, x1 - x0 + 1);
  const minSpan = Math.max(3, Math.round(silW * 0.08));

  let footRow = -1;
  let spanL = 0;
  let spanR = 0;
  for (let y = y1; y >= y0; y--) {
    let l = -1, r = -1;
    for (let x = x0; x <= x1; x++) {
      if (data[(y * w + x) * 4 + 3] <= alpha) continue;
      if (l < 0) l = x;
      r = x;
    }
    if (l < 0) continue;
    if (r - l + 1 >= minSpan) {
      footRow = y;
      spanL = l;
      spanR = r;
      break;
    }
    // keep falling through for a wider row; if none, use absolute bottom tip
    if (footRow < 0) {
      footRow = y;
      spanL = l;
      spanR = r;
    }
  }
  if (footRow < 0) return null;

  // mass-weighted X on the foot row ±1 for stability
  let mass = 0;
  let mx = 0;
  for (let y = Math.max(y0, footRow - 1); y <= Math.min(y1, footRow + 1); y++) {
    for (let x = x0; x <= x1; x++) {
      const a = data[(y * w + x) * 4 + 3];
      if (a <= alpha) continue;
      mass += a;
      mx += x * a;
    }
  }
  const footX = mass > 0 ? mx / mass : (spanL + spanR) / 2;
  return { footX, footRow, bbox: { x0, x1, y0, y1 } };
}

/** Image-px feet → art-box origin % (0..100). */
export function feetToOriginPct(feet, nw, nh, bw, bh) {
  const box = containBottom(nw, nh, bw, bh);
  if (!box || !feet) return null;
  const { s, ox, oy } = box;
  const px = ox + feet.footX * s;
  const py = oy + feet.footRow * s;
  return {
    ox: Math.round(Math.max(0, Math.min(100, (px / bw) * 100)) * 10) / 10,
    oy: Math.round(Math.max(0, Math.min(100, (py / bh) * 100)) * 10) / 10,
  };
}

/** Decode ImageData from a loaded HTMLImageElement (or OffscreenCanvas source). */
export function imageAlphaData(img, maxSide = 256) {
  const nw = img.naturalWidth || img.width;
  const nh = img.naturalHeight || img.height;
  if (!nw || !nh) return null;
  const scale = Math.min(1, maxSide / Math.max(nw, nh));
  const w = Math.max(1, Math.round(nw * scale));
  const h = Math.max(1, Math.round(nh * scale));
  const c = Object.assign(document.createElement('canvas'), { width: w, height: h });
  const ctx = c.getContext('2d', { willReadFrequently: true });
  ctx.drawImage(img, 0, 0, w, h);
  return { data: ctx.getImageData(0, 0, w, h).data, w, h, nw, nh, scale };
}

/**
 * @param {string} url
 * @param {number} boxW art box width (combat px)
 * @param {number} boxH art box height
 * @returns {Promise<{ ox: number, oy: number, footX: number, footRow: number } | null>}
 */
export function scanShadowOrigin(url, boxW, boxH) {
  return new Promise((resolve) => {
    if (!url || !(boxW > 0) || !(boxH > 0)) return resolve(null);
    const img = new Image();
    img.onload = () => {
      try {
        const pack = imageAlphaData(img);
        if (!pack) return resolve(null);
        const feet = feetFromAlpha(pack.data, pack.w, pack.h);
        if (!feet) return resolve(null);
        // feet are in downscaled px — map back to natural image space for contain math
        const nat = {
          footX: feet.footX / pack.scale,
          footRow: feet.footRow / pack.scale,
          bbox: feet.bbox,
        };
        const pct = feetToOriginPct(nat, pack.nw, pack.nh, boxW, boxH);
        if (!pct) return resolve(null);
        resolve({ ...pct, footX: nat.footX, footRow: nat.footRow });
      } catch {
        resolve(null);
      }
    };
    img.onerror = () => resolve(null);
    img.src = url;
  });
}
