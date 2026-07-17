import { STRUCTURAL_FALLBACK_IDS } from './presentation-catalog.js';

export const UI_CHROME_IDS = [
  'candle-lit', 'candle-spent',
  'facet-empty', 'facet-chipped',
  'hp-vial-frame', 'heart', 'coin', 'deck', 'menu', 'ward', 'end-turn', 'lantern',
  'intent-attack', 'intent-block', 'intent-buff', 'intent-debuff', 'intent-heal',
  'node-frame', 'node-monster', 'node-elite', 'node-event', 'node-rest', 'node-shop',
  'node-treasure', 'node-boss', 'node-monument', 'node-unlit',
];

const FALLBACK = {
  heart: 'heart', coin: 'coin', deck: 'cards', menu: 'menu', ward: 'shield',
  lantern: 'lantern', 'end-turn': 'up',
  'facet-empty': 'facet', 'facet-chipped': 'facet',
  'intent-attack': 'sword', 'intent-block': 'shield', 'intent-buff': 'up',
  'intent-debuff': 'cloud', 'intent-heal': 'plus',
};

for (const id of Object.values(FALLBACK)) {
  if (!STRUCTURAL_FALLBACK_IDS.includes(id)) {
    throw new Error(`ui-chrome FALLBACK id ${id} missing from presentation-catalog`);
  }
}

export function uiFallbackName(id) {
  return Object.prototype.hasOwnProperty.call(FALLBACK, id) ? FALLBACK[id] : null;
}

export function energySlotStates(energy, energyMax) {
  const e = Math.max(0, Math.floor(Number(energy) || 0));
  const m = Math.max(e, Math.max(0, Math.floor(Number(energyMax) || 0)));
  return Array.from({ length: m }, (_, i) => (i < e ? 'lit' : 'spent'));
}

export function intentUiIds(intent) {
  const key = String(intent || '');
  if (key === 'block') return ['intent-block'];
  if (key === 'buff') return ['intent-buff'];
  if (key === 'debuff') return ['intent-debuff'];
  if (key === 'heal') return ['intent-heal'];
  if (key.startsWith('attack')) {
    const ids = ['intent-attack'];
    if (key === 'attack_debuff') ids.push('intent-debuff');
    if (key === 'attack_block') ids.push('intent-block');
    if (key === 'attack_buff') ids.push('intent-buff');
    return ids;
  }
  return ['intent-attack'];
}

export function nodeGlyphId(type, unlit) {
  if (unlit) return 'node-unlit';
  const t = String(type || 'monster');
  return `node-${t}`;
}
