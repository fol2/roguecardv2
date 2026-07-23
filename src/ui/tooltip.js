import * as E from '../engine.js';
import { cardArtSvg } from '../art.js';
import { stageH, stageW, toStage } from '../stage.js';
import { $, $$, FINE, S, el } from './context.js';
import { contentViewFor } from './content.js';
import { rasterOr } from './assets.js';

export function createTooltip({
  tr,
  getCardFaceComposer = () => globalThis.spirebound?.combatGl?.cardFace || null,
} = {}) {
  const statuses = () => contentViewFor(S.run).statuses;
  const FACET_DESC = () => tr('ui.keywords.facetDesc');
  const KEYWORDS = () => ({
    Cracked: statuses().vulnerable.desc, Dimmed: statuses().weak.desc, Brittle: statuses().frail.desc,
    Smolder: statuses().poison.desc, Fervor: statuses().str.desc, Poise: statuses().dex.desc,
    Kindle: tr('ui.keywords.kindle'),
    Ward: tr('ui.keywords.ward'),
    Energy: tr('ui.keywords.energy'),
    Ember: tr('ui.keywords.ember'),
    Embers: tr('ui.keywords.ember'),
    Chip: tr('ui.keywords.chip'),
    Facet: FACET_DESC(), Facets: FACET_DESC(), Shatter: FACET_DESC(), Shatters: FACET_DESC(),
    Staggered: tr('ui.keywords.staggered'),
    Unplayable: tr('ui.keywords.unplayable'),
    Shard: tr('ui.keywords.shard'),
    Hex: tr('ui.keywords.hex'),
    Cinder: tr('ui.keywords.cinder'),
  });

  const tipBridge = {
    showFromBounds: () => {},
    hide: () => {},
    longPressMove: () => {},
  };

  function initTooltip() {
    const tip = $('#tooltip');
    const tipFor = (node) => {
      const content = node._tip;
      tip.innerHTML = `${content.title ? `<div class="tt-title">${content.title}</div>` : ''}<div class="tt-body">${content.body || ''}</div>${content.sub ? `<div class="tt-sub">${content.sub}</div>` : ''}`;
      tip.style.display = 'block';
    };
    const tipForContent = (content) => {
      if (!content) return;
      tip.innerHTML = `${content.title ? `<div class="tt-title">${content.title}</div>` : ''}<div class="tt-body">${content.body || ''}</div>${content.sub ? `<div class="tt-sub">${content.sub}</div>` : ''}`;
      tip.style.display = 'block';
    };
    const findTipped = (target) => {
      let node = target;
      while (node && node !== document.body && !node._tip) node = node.parentElement;
      return node && node._tip ? node : null;
    };
    const place = (cx, cy, touch) => {
      if (tip.style.display !== 'block') return;
      const { x, y } = toStage(cx, cy);
      const w = tip.offsetWidth, h = tip.offsetHeight;
      if (touch) {
        tip.style.left = `${Math.max(8, Math.min(stageW() - w - 8, x - w / 2))}px`;
        tip.style.top = `${Math.max(8, y - h - 26)}px`;
      } else {
        tip.style.left = `${Math.min(stageW() - w - 12, x + 16)}px`;
        tip.style.top = `${Math.max(8, Math.min(stageH() - h - 12, y - h / 2))}px`;
      }
    };
    // Task 23 — sprite/stage-bounds bridge for the combat pointer router.
    // Converts stage-px sprite boxes to a client anchor and reuses DOM tip chrome.
    tipBridge.showFromBounds = (content, stageBounds, { clientX, clientY, touch = false } = {}) => {
      tipForContent(content);
      if (Number.isFinite(clientX) && Number.isFinite(clientY)) {
        place(clientX, clientY, touch);
        return;
      }
      if (!stageBounds) return;
      const stage = document.getElementById('stage');
      const rect = stage?.getBoundingClientRect?.();
      if (!rect) return;
      const scaleX = rect.width / Math.max(1, stageW());
      const scaleY = rect.height / Math.max(1, stageH());
      const cx = rect.left + ((stageBounds.left ?? 0) + (stageBounds.width ?? 0) / 2) * scaleX;
      const cy = rect.top + ((stageBounds.top ?? 0) + (stageBounds.height ?? 0) / 2) * scaleY;
      place(cx, cy, touch);
    };
    tipBridge.hide = () => { tip.style.display = 'none'; };
    tipBridge.longPressMove = (event) => {
      if (FINE && event.pointerType === 'mouse') place(event.clientX, event.clientY, false);
    };
    document.addEventListener('pointerover', (event) => {
      if (!FINE || event.pointerType !== 'mouse') return;
      const node = findTipped(event.target);
      if (node) { tipFor(node); place(event.clientX, event.clientY, false); }
      else tip.style.display = 'none';
    });
    document.addEventListener('pointermove', (event) => {
      if (FINE && event.pointerType === 'mouse') place(event.clientX, event.clientY, false);
      else if (lpT && Math.hypot(event.clientX - lpX, event.clientY - lpY) > 12) { clearTimeout(lpT); lpT = 0; }
    });
    let lpT = 0, lpX = 0, lpY = 0, hideT = 0;
    document.addEventListener('pointerdown', (event) => {
      if (event.pointerType === 'mouse') return;
      tip.style.display = 'none';
      clearTimeout(hideT);
      const node = findTipped(event.target);
      if (!node) return;
      lpX = event.clientX; lpY = event.clientY;
      clearTimeout(lpT);
      lpT = setTimeout(() => { lpT = 0; tipFor(node); place(lpX, lpY, true); }, 380);
    }, true);
    const lpEnd = (event) => {
      if (event.pointerType === 'mouse') return;
      if (lpT) { clearTimeout(lpT); lpT = 0; }
      clearTimeout(hideT);
      hideT = setTimeout(() => (tip.style.display = 'none'), 1700);
    };
    document.addEventListener('pointerup', lpEnd);
    document.addEventListener('pointercancel', lpEnd);
  }

  function fmtText(text, inCombat) {
    let formatted = text
      .replace(/@(\d+)@/g, (_, n) => {
        const base = +n;
        const value = inCombat && S.cb ? E.previewAttack(S.cb, base) : base;
        const cls = value > base ? 'boosted' : value < base ? 'reduced' : '';
        return `<span class="val ${cls}">${value}</span>`;
      })
      .replace(/#(\d+)#/g, (_, n) => {
        const base = +n;
        const value = inCombat && S.cb ? E.previewBlock(S.run, S.cb, base) : base;
        const cls = value > base ? 'boosted' : value < base ? 'reduced' : '';
        return `<span class="val ${cls}">${value}</span>`;
      });
    formatted = formatted.replace(/\b(Cracked|Dimmed|Brittle|Smolder|Fervor|Poise|Kindle|Ward|Energy|Embers?|Chip|Facets?|Shatters?|Staggered|Unplayable|Shard|Hex|Cinder)\b/g, '<span class="kw">$1</span>');
    return formatted;
  }

  // Task 3 — the baked export image has no DOM `.kw` spans to hover, so a grid
  // face would otherwise lose the per-keyword tooltips the live DOM face gives.
  // Fold the glossary of keywords the card mentions into the card tip's `sub`
  // line so hovering an export face still explains them.
  function keywordLegend(renderedText) {
    const glossary = KEYWORDS();
    const seen = new Set();
    const lines = [];
    const re = /<span class="kw">([^<]+)<\/span>/g;
    let match;
    while ((match = re.exec(renderedText))) {
      const name = match[1];
      if (seen.has(name) || !glossary[name]) continue;
      seen.add(name);
      lines.push(`<b>${name}</b> — ${glossary[name]}`);
    }
    return lines.join('<br>');
  }

  function wireCardFoil(card) {
    if (FINE) {
      card.addEventListener('mousemove', (event) => {
        const rect = card.getBoundingClientRect();
        const px = (event.clientX - rect.left) / rect.width;
        const py = (event.clientY - rect.top) / rect.height;
        const inner = $('.card-inner', card);
        if (!inner) return;
        inner.style.setProperty('--ry', `${(px - 0.5) * 16}deg`);
        inner.style.setProperty('--rx', `${(0.5 - py) * 12}deg`);
        inner.style.setProperty('--mx', `${px * 100}%`);
        inner.style.setProperty('--my', `${py * 100}%`);
        inner.style.setProperty('--gx', (px - 0.5) * 60);
      });
    }
    card.addEventListener('mouseleave', () => {
      const inner = $('.card-inner', card);
      if (!inner) return;
      inner.style.setProperty('--ry', '0deg');
      inner.style.setProperty('--rx', '0deg');
    });
  }

  /**
   * DOM card host for shop / reward / overlay / (until Task 27) combat hand.
   * Default face bake is the Pixi composer export.
   * `domFace`: live CSS face (art + tint rim + fmtText) — shop / contact-compare
   * golden (public-preview) path; use when export PNGs cannot match DOM chrome.
   * `costOverlay`: bake face without the clipped in-canvas gem and mount a real
   * `.card-cost` (top/left -8) so export hosts match golden overhang.
   */
  function cardEl(inst, { inCombat = false, size = null, costOverlay = false, domFace = false } = {}) {
    const data = E.cardData(inst, S.run);
    const card = el('div', `card t-${data.type} r-${data.rarity}${inst.up ? ' upgraded' : ''}`);
    if (size) card.style.setProperty('--cw', `${size}px`);
    if (inst.uid != null) card.dataset.uid = inst.uid;
    const effectiveCost = data.cost == null
      ? null
      : (inCombat && S.cb ? E.effCost(S.run, S.cb, inst) : data.cost);
    let text = fmtText(data.text, inCombat);
    if (inst.bonus) {
      text = text.replace(/<span class="val[^"]*">(\d+)<\/span>/, (match, value) => match.replace(value, +value + inst.bonus));
    }
    card._tip = { title: data.name, body: text };

    const composer = typeof getCardFaceComposer === 'function' ? getCardFaceComposer() : null;
    const composerReady = !!composer && typeof composer.exportImage === 'function';

    // Live DOM face — the shop golden path (`domFace`) AND the degraded-boot
    // fallback (composer not booted). Identical structure to the golden
    // public-preview cardEl: art (raster or SVG), tint rim, fmtText body and
    // per-keyword tooltips — so an out-of-combat grid is NEVER a blank export
    // shell when fonts/WebGL failed to boot the Pixi composer.
    if (domFace || !composerReady) {
      const costHtml = effectiveCost != null
        ? `<div class="card-cost${effectiveCost === 0 ? ' free' : ''}">${effectiveCost}</div>`
        : '';
      card.innerHTML = `<div class="card-lift">${costHtml}<div class="card-inner">
      <div class="card-art">${rasterOr('cards', inst.id, cardArtSvg(inst.id, data.type))}</div>
      <div class="card-name">${data.name}</div>
      <div class="card-type">${data.type}</div>
      <div class="card-text"><span class="ct-inner">${text}</span></div>
      <div class="card-rarity"></div>
    </div></div>`;
      const keywords = KEYWORDS();
      $$('.kw', card).forEach((keyword) => {
        keyword._tip = { title: keyword.textContent, body: keywords[keyword.textContent] || '' };
      });
      wireCardFoil(card);
      return card;
    }

    let effectiveText = data.text;
    if (inst.bonus && typeof effectiveText === 'string') {
      effectiveText = effectiveText.replace(/@(\d+)@/g, (_, n) => `@${+n + inst.bonus}@`);
    }
    const exported = composer.exportImage(
      { id: inst.id, up: !!inst.up },
      {
        up: !!inst.up,
        // null omits the gem from the bake when a DOM `.card-cost` will overlay.
        effectiveCost: costOverlay ? null : effectiveCost,
        effectiveText,
      },
    );
    card.dataset.cardFaceKey = exported.key;
    card._cardFaceRelease = exported.release;
    // Task 3 — the baked <img> has no hoverable `.kw` spans; surface the keyword
    // glossary through the card tip so grid faces still explain their keywords.
    const legend = keywordLegend(text);
    if (legend) card._tip.sub = legend;
    const costHtml = (costOverlay && effectiveCost != null)
      ? `<div class="card-cost${effectiveCost === 0 ? ' free' : ''}">${effectiveCost}</div>`
      : '';
    card.innerHTML = `<div class="card-lift">${costHtml}<div class="card-inner card-inner-export">
      <img class="card-face-export" alt="" draggable="false"
        data-card-face-key="${exported.key}"
        src="${exported.url}"
        style="position:absolute;inset:0;width:100%;height:100%;object-fit:fill;pointer-events:none;border-radius:12px"/>
    </div></div>`;
    wireCardFoil(card);
    return card;
  }

  return Object.freeze({ initTooltip, fmtText, cardEl, tipBridge });
}
