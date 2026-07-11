import * as E from '../engine.js';
import { STATUS_INFO } from '../data.js';
import { cardArtSvg } from '../art.js';
import { stageH, stageW, toStage } from '../stage.js';
import { $, $$, FINE, S, el } from './context.js';
import { rasterOr } from './assets.js';

export function createTooltip({ tr }) {
  const FACET_DESC = () => tr('ui.keywords.facetDesc');
  const KEYWORDS = () => ({
    Cracked: STATUS_INFO.vulnerable.desc, Dimmed: STATUS_INFO.weak.desc, Brittle: STATUS_INFO.frail.desc,
    Smolder: STATUS_INFO.poison.desc, Fervor: STATUS_INFO.str.desc, Poise: STATUS_INFO.dex.desc,
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

  function initTooltip() {
    const tip = $('#tooltip');
    const tipFor = (node) => {
      const content = node._tip;
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

  function cardEl(inst, { inCombat = false, size = null } = {}) {
    const data = E.cardData(inst);
    const card = el('div', `card t-${data.type} r-${data.rarity}${inst.up ? ' upgraded' : ''}`);
    if (size) card.style.setProperty('--cw', `${size}px`);
    if (inst.uid != null) card.dataset.uid = inst.uid;
    let costHtml = '';
    if (data.cost != null) {
      const effective = inCombat && S.cb ? E.effCost(S.run, S.cb, inst) : data.cost;
      costHtml = `<div class="card-cost ${effective === 0 ? 'free' : ''}">${effective}</div>`;
    }
    let text = fmtText(data.text, inCombat);
    if (inst.bonus) text = text.replace(/<span class="val[^"]*">(\d+)<\/span>/, (match, value) => match.replace(value, +value + inst.bonus));
    card.innerHTML = `<div class="card-lift">${costHtml}<div class="card-inner">
      <div class="card-art">${rasterOr('cards', inst.id, cardArtSvg(inst.id, data.type))}</div>
      <div class="card-name">${data.name}</div>
      <div class="card-type">${data.type}</div>
      <div class="card-text"><span class="ct-inner">${text}</span></div>
      <div class="card-rarity"></div>
    </div></div>`;
    const keywords = KEYWORDS();
    $$('.kw', card).forEach((keyword) => (keyword._tip = { title: keyword.textContent, body: keywords[keyword.textContent] || '' }));
    if (FINE) card.addEventListener('mousemove', (event) => {
      const rect = card.getBoundingClientRect();
      const px = (event.clientX - rect.left) / rect.width, py = (event.clientY - rect.top) / rect.height;
      const inner = $('.card-inner', card);
      inner.style.setProperty('--ry', `${(px - 0.5) * 16}deg`);
      inner.style.setProperty('--rx', `${(0.5 - py) * 12}deg`);
      inner.style.setProperty('--mx', `${px * 100}%`);
      inner.style.setProperty('--my', `${py * 100}%`);
      inner.style.setProperty('--gx', (px - 0.5) * 60);
    });
    card.addEventListener('mouseleave', () => {
      const inner = $('.card-inner', card);
      inner.style.setProperty('--ry', '0deg');
      inner.style.setProperty('--rx', '0deg');
    });
    return card;
  }

  return Object.freeze({ initTooltip, fmtText, cardEl });
}
