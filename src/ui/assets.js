import { assetList, assetUrl, heroSvg, iconSvg } from '../art.js';
import { S, escHtml } from './context.js';
import { contentViewFor, themeForRun } from './content.js';

export const rasterOr = (cat, id, svg) => {
  const url = assetUrl(cat, id);
  return url ? `<img class="raster-art" src="${url}" alt="">` : svg;
};

export function sceneBg() {
  const theme = themeForRun(S.run);
  const plate = theme?.plates?.backdrop;
  const url = plate ? assetUrl('stage', plate) : null;
  const themeId = theme?.id || theme?.themeId || '';
  const attrs = `class="scene-bg r5-scene-panel"${themeId ? ` data-r5-theme="${escHtml(String(themeId))}"` : ''}${plate ? ` data-r5-plate="${escHtml(String(plate))}"` : ''}`;
  return url
    ? `<div ${attrs} style="background-image:url('${url}')"></div>`
    : `<div ${attrs} data-r5-plate="empty" aria-hidden="true"></div>`;
}

export function metaBg(id) {
  const url = assetUrl('meta', id);
  return url ? `<div class="meta-bg" style="background-image:url('${url}')"></div>` : '';
}

export const relicArt = (rid, size = 22) => {
  const url = assetUrl('relics', rid);
  const glyph = contentViewFor(S.run).relics[rid]?.glyph || '◈';
  return url ? `<img class="raster-art relic-art" src="${url}" alt="" style="width:${size}px;height:${size}px">` : glyph;
};

export const hudRelic = (rid) => {
  const url = assetUrl('relics', rid);
  const glyph = contentViewFor(S.run).relics[rid]?.glyph || '◈';
  return url ? `<img class="relic-art hud-relic-art" src="${url}" alt="">` : `<span class="hud-relic-fallback">${glyph}</span>`;
};

export const omenIconName = (oid) => oid === 'eighthOmen' ? 'eighthOmen' : `omen-${oid}`;
export const omenMark = (oid, imgClass, fallbackClass, size = 22) => {
  const url = assetUrl('omens', oid);
  return url ? `<img class="${imgClass}" src="${url}" alt="">` : `<span class="${fallbackClass}">${iconSvg(omenIconName(oid), size)}</span>`;
};

export const aimRing = (url, kind) => url
  ? `<svg class="aim-ring" aria-hidden="true"><image href="${escHtml(url)}" x="0" y="0" width="100%" height="100%" preserveAspectRatio="xMidYMax meet" filter="url(#aim-outline-${kind})"/></svg>`
  : '';

export const heroArt = (index) => {
  const aspects = contentViewFor(S.run).aspects;
  const url = assetUrl('heroes', aspects[index].id);
  if (!url) return `<div class="hero-sprite">${heroSvg(index)}</div>`;
  return `<div class="hero-sprite">${aimRing(url, 'self')}${rasterOr('heroes', aspects[index].id, heroSvg(index))}<svg class="cracks-overlay" viewBox="0 0 200 200"><g class="cracks"></g></svg></div>`;
};

export const combatantView = (enemy, run = S.run) => {
  const presentation = enemy.presentation || {};
  const enemies = contentViewFor(run).enemies;
  return {
    artCategory: presentation.artCategory || 'enemies',
    artId: presentation.artId || enemy.key,
    layoutKey: presentation.layoutKey || enemy.key,
    kind: presentation.kind || enemies[enemy.key].art.kind,
    hue: presentation.hue ?? enemies[enemy.key].art.hue,
    tint: presentation.tint || null,
    scale: presentation.scale || 1,
  };
};

let assetsWarmed = false;
export function warmAssets() {
  if (assetsWarmed) return;
  assetsWarmed = true;
  for (const url of [...assetList('enemies'), ...assetList('heroes')]) new Image().src = url;
}
