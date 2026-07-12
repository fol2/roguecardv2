// SPIREBOUND — all game content. Pure data, no DOM.
// Display strings hydrate from src/i18n (default locale: en).

import { hydrateContent, getContent } from './i18n/index.js';

export const PLAYER = {
  id: 'duskblade',
  hue: 225, art: 'flare',
  maxHp: 72,
  energy: 3,
  handSize: 5,
  potionSlots: 3,
  startDeck: ['strike', 'strike', 'strike', 'strike', 'defend', 'defend', 'defend', 'eclipseSlash', 'chisel', 'firstSpark'],
  startRelic: 'emberHeart',
  startGold: 99
};

export const ACTS = [
  { boss: 'rootheart',
    theme: { sky: 0x0c1410, fog: 0x13241a, particles: 0xffa04d, glow: 0x66ff9e, accent: '#7ddb8f', ember: '#ff9a4d' }
  },
  { boss: 'leviathan',
    theme: { sky: 0x081420, fog: 0x0d2233, particles: 0x53e8ff, glow: 0x2fb8ff, accent: '#5fd6e8', ember: '#53e8ff' }
  },
  { boss: 'sovereign',
    theme: { sky: 0x120a1e, fog: 0x1e1230, particles: 0xc27bff, glow: 0xff4fd8, accent: '#c99aff', ember: '#ff6fe0' }
  },
];

// ---------------------------------------------------------------- CARDS
// effects ops: dmg{n,times} block{n} draw{n} energy{n} heal{n} loseHp{n}
//   status{who:'target'|'self'|'allEnemies', id, n}  special{id,n}  addCard{id,n,where}
// text tokens: @n@ = attack number (str/vuln/weak-adjusted in UI), #n# = block number (dex/frail-adjusted)

export const CARDS = {
  // ---- starters
  strike: {
    type: 'attack', rarity: 'starter', cost: 1, target: 'enemy',
    vfx: 'slash',
    effects: [{ kind: 'dmg', n: 6 }],
    up: { effects: [{ kind: 'dmg', n: 9 }] },
  },
  defend: {
    type: 'skill', rarity: 'starter', cost: 1, target: 'self',
    vfx: 'ward',
    effects: [{ kind: 'block', n: 5 }],
    up: { effects: [{ kind: 'block', n: 8 }] },
  },
  eclipseSlash: {
    type: 'attack', rarity: 'starter', cost: 1, target: 'enemy',
    vfx: 'slash',
    effects: [{ kind: 'dmg', n: 7 }, { kind: 'status', who: 'target', id: 'vulnerable', n: 1 }],
    up: {
      effects: [{ kind: 'dmg', n: 9 }, { kind: 'status', who: 'target', id: 'vulnerable', n: 2 }],
    },
  },
  chisel: {
    type: 'attack', rarity: 'starter', cost: 1, target: 'enemy', chip: 1,
    vfx: 'pierce',
    effects: [{ kind: 'dmg', n: 4 }],
    up: { effects: [{ kind: 'dmg', n: 7 }] },
  },
  firstSpark: {
    type: 'skill', rarity: 'starter', cost: 0, target: 'self',
    vfx: 'fire',
    exhaust: true, effects: [{ kind: 'draw', n: 1 }],
    up: { effects: [{ kind: 'draw', n: 2 }] },
  },
  // ---- Ashwarden starters
  ashBite: {
    type: 'attack', rarity: 'starter', cost: 1, target: 'enemy',
    vfx: 'fire',
    effects: [{ kind: 'dmg', n: 5 }, { kind: 'status', who: 'target', id: 'poison', n: 2 }],
    up: { effects: [{ kind: 'dmg', n: 7 }, { kind: 'status', who: 'target', id: 'poison', n: 3 }] },
  },
  smother: {
    type: 'skill', rarity: 'starter', cost: 1, target: 'enemy',
    vfx: 'fire',
    effects: [{ kind: 'block', n: 5 }, { kind: 'status', who: 'target', id: 'poison', n: 2 }],
    up: { effects: [{ kind: 'block', n: 8 }, { kind: 'status', who: 'target', id: 'poison', n: 3 }] },
  },

  // ---- common attacks
  twinFangs: {
    type: 'attack', rarity: 'common', cost: 1, target: 'enemy',
    vfx: 'pierce',
    effects: [{ kind: 'dmg', n: 4, times: 2 }],
    up: { effects: [{ kind: 'dmg', n: 6, times: 2 }] },
  },
  quickSlash: {
    type: 'attack', rarity: 'common', cost: 0, target: 'enemy',
    vfx: 'slash',
    effects: [{ kind: 'dmg', n: 4 }, { kind: 'draw', n: 1 }],
    up: { effects: [{ kind: 'dmg', n: 6 }, { kind: 'draw', n: 1 }] },
  },
  heavyBlow: {
    type: 'attack', rarity: 'common', cost: 2, target: 'enemy', chip: 1,
    vfx: 'blunt',
    effects: [{ kind: 'dmg', n: 12 }],
    up: { chip: 2, effects: [{ kind: 'dmg', n: 16 }] },
  },
  cleave: {
    type: 'attack', rarity: 'common', cost: 1, target: 'allEnemies',
    vfx: 'slash',
    effects: [{ kind: 'dmg', n: 6 }],
    up: { effects: [{ kind: 'dmg', n: 9 }] },
  },
  venomStrike: {
    type: 'attack', rarity: 'common', cost: 1, target: 'enemy',
    vfx: 'fire',
    effects: [{ kind: 'dmg', n: 4 }, { kind: 'status', who: 'target', id: 'poison', n: 3 }],
    up: {
      effects: [{ kind: 'dmg', n: 6 }, { kind: 'status', who: 'target', id: 'poison', n: 4 }],
    },
  },
  lunge: {
    type: 'attack', rarity: 'common', cost: 1, target: 'enemy',
    vfx: 'slash',
    effects: [{ kind: 'dmg', n: 6 }, { kind: 'status', who: 'target', id: 'weak', n: 1 }],
    up: {
      effects: [{ kind: 'dmg', n: 9 }, { kind: 'status', who: 'target', id: 'weak', n: 2 }],
    },
  },
  guardedStrike: {
    type: 'attack', rarity: 'common', cost: 1, target: 'enemy',
    vfx: 'slash',
    effects: [{ kind: 'dmg', n: 5 }, { kind: 'block', n: 4 }],
    up: {
      effects: [{ kind: 'dmg', n: 7 }, { kind: 'block', n: 6 }],
    },
  },

  // ---- common skills
  brace: {
    type: 'skill', rarity: 'common', cost: 1, target: 'self',
    vfx: 'ward',
    effects: [{ kind: 'block', n: 8 }],
    up: { effects: [{ kind: 'block', n: 11 }] },
  },
  sidestep: {
    type: 'skill', rarity: 'common', cost: 0, target: 'self',
    vfx: 'ward',
    effects: [{ kind: 'block', n: 3 }, { kind: 'draw', n: 1 }],
    up: { effects: [{ kind: 'block', n: 5 }, { kind: 'draw', n: 1 }] },
  },
  preparation: {
    type: 'skill', rarity: 'common', cost: 0, target: 'self',
    vfx: 'fire',
    exhaust: true, effects: [{ kind: 'draw', n: 2 }],
    up: { exhaust: false, effects: [{ kind: 'draw', n: 2 }] },
  },
  deflect: {
    type: 'skill', rarity: 'common', cost: 1, target: 'self',
    vfx: 'ward',
    effects: [{ kind: 'block', n: 6 }, { kind: 'draw', n: 1 }],
    up: { effects: [{ kind: 'block', n: 9 }, { kind: 'draw', n: 1 }] },
  },

  // ---- uncommon attacks
  leechBlade: {
    type: 'attack', rarity: 'uncommon', cost: 2, target: 'enemy',
    vfx: 'void',
    effects: [{ kind: 'special', id: 'leech', n: 9 }],
    up: { effects: [{ kind: 'special', id: 'leech', n: 13 }] },
  },
  tempest: {
    type: 'attack', rarity: 'uncommon', cost: 2, target: 'allEnemies',
    vfx: 'pierce',
    effects: [{ kind: 'dmg', n: 4, times: 2 }],
    up: { effects: [{ kind: 'dmg', n: 6, times: 2 }] },
  },
  uppercut: {
    type: 'attack', rarity: 'uncommon', cost: 2, target: 'enemy', chip: 1,
    vfx: 'blunt',
    effects: [
      { kind: 'dmg', n: 10 },
      { kind: 'status', who: 'target', id: 'weak', n: 1 },
    ],
    up: {
 chip: 2,
      effects: [
        { kind: 'dmg', n: 13 },
        { kind: 'status', who: 'target', id: 'weak', n: 2 },
      ],
    },
  },
  flurry: {
    type: 'attack', rarity: 'uncommon', cost: 1, target: 'enemy',
    vfx: 'pierce',
    effects: [{ kind: 'dmg', n: 2, times: 3 }],
    up: { effects: [{ kind: 'dmg', n: 3, times: 3 }] },
  },
  executioner: {
    type: 'attack', rarity: 'uncommon', cost: 1, target: 'enemy',
    vfx: 'blunt',
    effects: [{ kind: 'special', id: 'execute', n: 8, bonus: 6 }],
    up: { effects: [{ kind: 'special', id: 'execute', n: 11, bonus: 8 }] },
  },
  momentum: {
    type: 'attack', rarity: 'uncommon', cost: 1, target: 'enemy',
    vfx: 'slash',
    effects: [{ kind: 'special', id: 'momentum', n: 6, grow: 4 }],
    up: { effects: [{ kind: 'special', id: 'momentum', n: 8, grow: 6 }] },
  },

  // ---- uncommon skills
  bulwark: {
    type: 'skill', rarity: 'uncommon', cost: 2, target: 'self',
    vfx: 'ward',
    effects: [{ kind: 'block', n: 13 }],
    up: { effects: [{ kind: 'block', n: 18 }] },
  },
  surge: {
    type: 'skill', rarity: 'uncommon', cost: 0, target: 'self',
    vfx: 'fire',
    exhaust: true,
    effects: [{ kind: 'energy', n: 1 }, { kind: 'draw', n: 1 }],
    up: { effects: [{ kind: 'energy', n: 2 }, { kind: 'draw', n: 1 }] },
  },
  toxicMist: {
    type: 'skill', rarity: 'uncommon', cost: 1, target: 'allEnemies',
    vfx: 'poison',
    effects: [{ kind: 'status', who: 'allEnemies', id: 'poison', n: 3 }],
    up: { effects: [{ kind: 'status', who: 'allEnemies', id: 'poison', n: 5 }] },
  },
  cripple: {
    type: 'skill', rarity: 'uncommon', cost: 1, target: 'enemy',
    vfx: 'void',
    exhaust: true,
    effects: [{ kind: 'status', who: 'target', id: 'str', n: -2 }],
    up: { effects: [{ kind: 'status', who: 'target', id: 'str', n: -3 }] },
  },
  warCry: {
    type: 'skill', rarity: 'uncommon', cost: 1, target: 'allEnemies',
    vfx: 'void',
    effects: [
      { kind: 'status', who: 'allEnemies', id: 'weak', n: 1 },
      { kind: 'status', who: 'allEnemies', id: 'vulnerable', n: 1 },
    ],
    up: {
      effects: [
        { kind: 'status', who: 'allEnemies', id: 'weak', n: 2 },
        { kind: 'status', who: 'allEnemies', id: 'vulnerable', n: 2 },
      ],
    },
  },
  fortify: {
    type: 'skill', rarity: 'uncommon', cost: 2, target: 'self',
    vfx: 'ward',
    effects: [{ kind: 'special', id: 'doubleBlock' }],
    up: { cost: 1,},
  },
  bloodRite: {
    type: 'skill', rarity: 'uncommon', cost: 0, target: 'self',
    vfx: 'void',
    effects: [{ kind: 'loseHp', n: 3 }, { kind: 'energy', n: 2 }],
    up: { effects: [{ kind: 'loseHp', n: 3 }, { kind: 'energy', n: 3 }] },
  },

  // ---- uncommon powers
  empower: {
    type: 'power', rarity: 'uncommon', cost: 1, target: 'self',
    vfx: 'fire',
    effects: [{ kind: 'status', who: 'self', id: 'str', n: 2 }],
    up: { effects: [{ kind: 'status', who: 'self', id: 'str', n: 3 }] },
  },
  agility: {
    type: 'power', rarity: 'uncommon', cost: 1, target: 'self',
    vfx: 'ward',
    effects: [{ kind: 'status', who: 'self', id: 'dex', n: 2 }],
    up: { effects: [{ kind: 'status', who: 'self', id: 'dex', n: 3 }] },
  },
  ironSkin: {
    type: 'power', rarity: 'uncommon', cost: 1, target: 'self',
    vfx: 'ward',
    effects: [{ kind: 'status', who: 'self', id: 'metallicize', n: 3 }],
    up: { effects: [{ kind: 'status', who: 'self', id: 'metallicize', n: 4 }] },
  },
  regrowth: {
    type: 'power', rarity: 'uncommon', cost: 1, target: 'self',
    vfx: 'fire',
    effects: [{ kind: 'status', who: 'self', id: 'regen', n: 2 }],
    up: { effects: [{ kind: 'status', who: 'self', id: 'regen', n: 3 }] },
  },

  // ---- rare attacks
  oblivionStrike: {
    type: 'attack', rarity: 'rare', cost: 3, target: 'enemy', chip: 2,
    vfx: 'blunt',
    effects: [{ kind: 'dmg', n: 30 }],
    up: { chip: 3, effects: [{ kind: 'dmg', n: 40 }] },
  },
  phantomBlades: {
    type: 'attack', rarity: 'rare', cost: 1, target: 'enemy',
    vfx: 'pierce',
    effects: [{ kind: 'special', id: 'phantom', n: 3 }],
    up: { effects: [{ kind: 'special', id: 'phantom', n: 4 }] },
  },
  devour: {
    type: 'attack', rarity: 'rare', cost: 1, target: 'enemy',
    vfx: 'void',
    exhaust: true,
    effects: [{ kind: 'special', id: 'devour', n: 10, embers: 3, heal: 4 }],
    up: { effects: [{ kind: 'special', id: 'devour', n: 13, embers: 4, heal: 6 }] },
  },
  annihilate: {
    type: 'attack', rarity: 'rare', cost: 2, target: 'allEnemies',
    vfx: 'fire',
    effects: [{ kind: 'dmg', n: 9 }, { kind: 'status', who: 'allEnemies', id: 'poison', n: 3 }],
    up: {
      effects: [{ kind: 'dmg', n: 12 }, { kind: 'status', who: 'allEnemies', id: 'poison', n: 4 }],
    },
  },

  // ---- rare skills
  aegis: {
    type: 'skill', rarity: 'rare', cost: 2, target: 'self',
    vfx: 'ward',
    exhaust: true, effects: [{ kind: 'block', n: 30 }],
    up: { effects: [{ kind: 'block', n: 40 }] },
  },
  offering: {
    type: 'skill', rarity: 'rare', cost: 1, target: 'self',
    vfx: 'fire',
    exhaust: true,
    effects: [{ kind: 'special', id: 'pyreTithe', draw: 3 }],
    up: {
      effects: [{ kind: 'special', id: 'pyreTithe', draw: 4 }],
    },
  },
  limitBreak: {
    type: 'skill', rarity: 'rare', cost: 1, target: 'allEnemies',
    vfx: 'blunt',
    exhaust: true,
    effects: [{ kind: 'chip', n: 2 }],
    up: { effects: [{ kind: 'chip', n: 3 }] },
  },
  catalyst: {
    type: 'skill', rarity: 'rare', cost: 1, target: 'enemy',
    vfx: 'poison',
    exhaust: true,
    effects: [{ kind: 'special', id: 'catalyst', n: 2 }],
    up: { effects: [{ kind: 'special', id: 'catalyst', n: 3 }] },
  },

  // ---- rare powers
  ascension: {
    type: 'power', rarity: 'rare', cost: 3, target: 'self',
    vfx: 'fire',
    effects: [{ kind: 'status', who: 'self', id: 'ritual', n: 2 }],
    up: { effects: [{ kind: 'status', who: 'self', id: 'ritual', n: 3 }] },
  },
  bastion: {
    type: 'power', rarity: 'rare', cost: 3, target: 'self',
    vfx: 'ward',
    effects: [{ kind: 'status', who: 'self', id: 'barricade', n: 1 }],
    up: { cost: 2 },
  },
  frenzy: {
    type: 'power', rarity: 'rare', cost: 2, target: 'self',
    vfx: 'fire',
    effects: [
      { kind: 'status', who: 'self', id: 'vulnerable', n: 2 },
      { kind: 'status', who: 'self', id: 'energized', n: 1 },
    ],
    up: {
      effects: [
        { kind: 'status', who: 'self', id: 'vulnerable', n: 1 },
        { kind: 'status', who: 'self', id: 'energized', n: 1 },
      ],
    },
  },
  virulence: {
    type: 'power', rarity: 'rare', cost: 2, target: 'self',
    vfx: 'poison',
    effects: [{ kind: 'status', who: 'self', id: 'venomous', n: 1 }],
    up: { cost: 1 },
  },

  // ---- the vigil's unlockables (locked out of pools until their deed is done)
  quakeblow: {
    type: 'attack', rarity: 'uncommon', cost: 2, target: 'enemy', chip: 2, locked: 'paneBreaker',
    vfx: 'blunt',
    effects: [{ kind: 'dmg', n: 8 }],
    up: { chip: 3, effects: [{ kind: 'dmg', n: 11 }] },
  },
  resonantLance: {
    type: 'attack', rarity: 'rare', cost: 1, target: 'enemy', locked: 'paneBreaker',
    vfx: 'pierce',
    effects: [{ kind: 'special', id: 'shatterEcho', n: 7 }],
    up: { effects: [{ kind: 'special', id: 'shatterEcho', n: 10 }] },
  },
  tithe: {
    type: 'skill', rarity: 'uncommon', cost: 1, target: 'self', locked: 'lanternFed',
    vfx: 'fire',
    effects: [{ kind: 'ember', n: 2 }, { kind: 'draw', n: 1 }],
    up: { effects: [{ kind: 'ember', n: 3 }, { kind: 'draw', n: 1 }] },
  },
  pyreheart: {
    type: 'power', rarity: 'rare', cost: 2, target: 'self', locked: 'lanternFed',
    vfx: 'fire',
    effects: [{ kind: 'status', who: 'self', id: 'emberflow', n: 1 }],
    up: { cost: 1 },
  },
  ashenChoir: {
    type: 'skill', rarity: 'uncommon', cost: 1, target: 'enemy', locked: 'ashSermon',
    vfx: 'poison',
    effects: [{ kind: 'status', who: 'target', id: 'poison', n: 4 }],
    up: { effects: [{ kind: 'status', who: 'target', id: 'poison', n: 6 }] },
  },
  flawlessForm: {
    type: 'skill', rarity: 'rare', cost: 1, target: 'self', locked: 'untouched',
    vfx: 'ward',
    effects: [{ kind: 'special', id: 'flawless', n: 8 }],
    up: { effects: [{ kind: 'special', id: 'flawless', n: 11 }] },
  },
  nightSight: {
    type: 'power', rarity: 'uncommon', cost: 1, target: 'self', locked: 'darkWalker',
    vfx: 'void',
    effects: [{ kind: 'status', who: 'self', id: 'nightsight', n: 1 }],
    up: { cost: 0 },
  },
  novaflare: {
    type: 'attack', rarity: 'rare', cost: 2, target: 'enemy', locked: 'spendthrift',
    vfx: 'fire',
    effects: [{ kind: 'special', id: 'emberNova', n: 3 }],
    up: { effects: [{ kind: 'special', id: 'emberNova', n: 4 }] },
  },
  emberdance: {
    type: 'skill', rarity: 'uncommon', cost: 0, target: 'self', locked: 'spendthrift',
    vfx: 'fire',
    exhaust: true,
    effects: [{ kind: 'special', id: 'emberdance', n: 3 }],
    up: { effects: [{ kind: 'special', id: 'emberdance', n: 4 }] },
  },
  shardstorm: {
    type: 'attack', rarity: 'rare', cost: 3, target: 'allEnemies',
    vfx: 'pierce',
    locked: 'hundredShards',
    effects: [{ kind: 'dmg', n: 5, times: 2 }],
    up: { effects: [{ kind: 'dmg', n: 7, times: 2 }] },
  },

  // ---- statuses / curses
  unreadablePage: {
    type: 'curse', rarity: 'special', cost: 0,
    target: 'self', vfx: 'void', unplayable: true, unremovable: true,
    effects: [],
  },
  wound: {
    type: 'status', rarity: 'special', cost: null, target: 'none',
    vfx: 'pierce',
 unplayable: true, effects: [],
  },
  burn: {
    type: 'status', rarity: 'special', cost: null, target: 'none',
    vfx: 'fire',
    unplayable: true, endTurnDmg: 2, effects: [],
  },
  hex: {
    type: 'curse', rarity: 'special', cost: null, target: 'none',
    vfx: 'void',
    unplayable: true, endTurnLoseHp: 1, effects: [],
  },
};

export const CARD_POOLS = (() => {
  const pools = { common: [], uncommon: [], rare: [] };
  for (const [id, c] of Object.entries(CARDS)) if (pools[c.rarity] && !c.locked) pools[c.rarity].push(id);
  return pools;
})();

// ---------------------------------------------------------------- STATUSES (display metadata)
// The native tongue: internal keys are engine plumbing, the names are the game's own.
export const STATUS_INFO = {
  str: { icon: '⚔', kind: 'buff' },
  dex: { icon: '🛡', kind: 'buff' },
  vulnerable: { icon: '◎', kind: 'debuff' },
  weak: { icon: '↓', kind: 'debuff' },
  frail: { icon: '✖', kind: 'debuff' },
  poison: { icon: '☠', kind: 'debuff' },
  thorns: { icon: '❈', kind: 'buff' },
  ritual: { icon: '☽', kind: 'buff' },
  metallicize: { icon: '⬡', kind: 'buff' },
  regen: { icon: '❋', kind: 'buff' },
  barricade: { icon: '☗', kind: 'buff' },
  energized: { icon: '✦', kind: 'buff' },
  venomous: { icon: '☠', kind: 'buff' },
  rampage: { icon: '⤴', kind: 'buff' },
  beacon: { icon: '☀', kind: 'buff' },
  emberflow: { icon: '♥', kind: 'buff' },
  nightsight: { icon: '☾', kind: 'buff' },
};

// ---------------------------------------------------------------- RELICS
export const RELICS = {
  emberHeart: { rarity: 'starter', glyph: '♥', tone: '#ff5964'},
  ashenCore: { rarity: 'starter', glyph: '☁', tone: '#d3a15a'},

  basaltIdol: { rarity: 'common', glyph: '☗', tone: '#9aa7b8'},
  warFetish: { rarity: 'common', glyph: '⚔', tone: '#ff8c5a'},
  riverPearl: { rarity: 'common', glyph: '◉', tone: '#6fd6e8'},
  travelersPack: { rarity: 'common', glyph: '⌘', tone: '#c9a86a'},
  emberLantern: { rarity: 'common', glyph: '☀', tone: '#ffd166'},
  vialOfLife: { rarity: 'common', glyph: '♣', tone: '#7ddb8f'},
  thornBand: { rarity: 'common', glyph: '❈', tone: '#a3e06c'},
  sweetRoot: { rarity: 'common', glyph: '✿', tone: '#ff9ecb', instant: true },

  gravebloom: { rarity: 'uncommon', glyph: '❀', tone: '#b18cff'},
  silkFan: { rarity: 'uncommon', glyph: '⛉', tone: '#8fd0ff'},
  reapersBell: { rarity: 'uncommon', glyph: '♫', tone: '#d8c27a'},
  executionersSeal: { rarity: 'uncommon', glyph: '✠', tone: '#ff6b6b'},
  ironTalisman: { rarity: 'uncommon', glyph: '◈', tone: '#c0c8d4'},
  merchantsMark: { rarity: 'uncommon', glyph: '¤', tone: '#f2c14e'},
  seersOrb: { rarity: 'uncommon', glyph: '☉', tone: '#9be8d8'},

  frozenCore: { rarity: 'rare', glyph: '❆', tone: '#a8e6ff'},
  verdantBranch: { rarity: 'rare', glyph: '⚕', tone: '#7ddb8f'},
  sunBlossom: { rarity: 'rare', glyph: '❂', tone: '#ffd166'},
  wardingCharm: { rarity: 'rare', glyph: '⛨', tone: '#8fa8ff'},
  duskmirror: { rarity: 'rare', glyph: '◐', tone: '#c99aff'},

  // the vigil's unlockables
  smolderingCoal: { rarity: 'uncommon', glyph: '♨', tone: '#ff9a4d', locked: 'ashSermon'},
  thiefOfWicks: { rarity: 'uncommon', glyph: '☄', tone: '#c9a86a', locked: 'darkWalker'},
  prismCharm: { rarity: 'rare', glyph: '◬', tone: '#9be8d8', locked: 'untouched'},
  bellOfEndings: { rarity: 'rare', glyph: '♪', tone: '#dfeaff', locked: 'hundredShards'},

  // Crowns: each act-boss offers one, and each rewrites a rule of the climb
  crownOfCinders: { rarity: 'boss', glyph: '♛', tone: '#ff9a4d'},
  hollowCrown: { rarity: 'boss', glyph: '♕', tone: '#b18cff', instant: true },
  crownOfTithes: { rarity: 'boss', glyph: '♜', tone: '#d8c27a'},
  shatterersCrown: { rarity: 'boss', glyph: '♚', tone: '#8fd0ff'},
  crownOfTheHearth: { rarity: 'boss', glyph: '♥', tone: '#ff5964'}
};

export const RELIC_POOLS = (() => {
  const pools = { common: [], uncommon: [], rare: [], boss: [] };
  for (const [id, r] of Object.entries(RELICS)) if (pools[r.rarity] && !r.locked) pools[r.rarity].push(id);
  return pools;
})();

// ---------------------------------------------------------------- PHIALS
export const POTIONS = {
  healing: { tone: '#ff6b81', glyph: '♥', combatOnly: false },
  strength: { tone: '#ff8c5a', glyph: '⚔', combatOnly: true },
  swift: { tone: '#8fd0ff', glyph: '»', combatOnly: true },
  block: { tone: '#9aa7b8', glyph: '☗', combatOnly: true },
  fire: { tone: '#ffd166', glyph: '✹', combatOnly: true, needsTarget: true },
  venom: { tone: '#a3e06c', glyph: '☠', combatOnly: true, needsTarget: true },
  energy: { tone: '#ff9a4d', glyph: '✦', combatOnly: true }
};

// ---------------------------------------------------------------- ENEMIES
// move: {name, intent, dmg?, times?, block?, heal?, fx?:[{who:'player'|'self'|'allies', id, n}], addCards?:{id,n}}
// ai(ctx) -> move key. ctx: {turn, last, prev, rng, hpFrac}

export const ENEMIES = {
  // ============ ACT 1
  sporeling: { hp: [13, 17], facets: 3, art: { kind: 'wisp', hue: 95, size: 0.72 },
    moves: {
      spit: { intent: 'attack', dmg: 4 },
      grow: { intent: 'buff', fx: [{ who: 'self', id: 'str', n: 1 }] }
    },
    ai: ({ turn }) => (turn % 3 === 2 ? 'grow' : 'spit')
  },
  duskfang: { hp: [26, 30], art: { kind: 'beast', hue: 22, size: 1 },
    moves: {
      howl: { intent: 'buff', fx: [{ who: 'self', id: 'str', n: 2 }] },
      bite: { intent: 'attack', dmg: 7 },
      rend: { intent: 'attack', dmg: 4, times: 2 }
    },
    ai: ({ turn, last, rng }) => {
      if (turn === 1) return 'howl';
      if (last !== 'howl' && rng() < 0.18) return 'howl';
      return last === 'bite' ? 'rend' : 'bite';
    }
  },
  gloomslime: { hp: [30, 34], art: { kind: 'slime', hue: 150, size: 1 },
    moves: {
      slam: { intent: 'attack', dmg: 8 },
      ooze: { intent: 'attack_debuff', dmg: 3, fx: [{ who: 'player', id: 'weak', n: 2 }] },
      harden: { intent: 'attack_block', dmg: 4, block: 6 }
    },
    ai: ({ turn }) => ['ooze', 'slam', 'harden'][(turn - 1) % 3]
  },
  waylayer: { hp: [28, 32], art: { kind: 'rogue', hue: 0, size: 0.95 },
    moves: {
      stab: { intent: 'attack', dmg: 9 },
      smoke: { intent: 'block', block: 8 },
      trick: { intent: 'attack_debuff', dmg: 4, fx: [{ who: 'player', id: 'frail', n: 2 }] }
    },
    ai: ({ turn, rng }) => (turn === 1 ? 'trick' : rng() < 0.55 ? 'stab' : rng() < 0.5 ? 'smoke' : 'trick')
  },
  thornling: { hp: [18, 22], facets: 3, art: { kind: 'plant', hue: 80, size: 0.85 },
    startStatus: { thorns: 2 },
    moves: {
      prick: { intent: 'attack', dmg: 6 },
      bristle: { intent: 'buff', fx: [{ who: 'self', id: 'thorns', n: 2 }] },
      burst: { intent: 'attack', dmg: 10 }
    },
    ai: ({ turn }) => (turn % 4 === 0 ? 'burst' : turn % 2 === 1 ? 'prick' : 'bristle')
  },
  ashAcolyte: { hp: [34, 38], art: { kind: 'cultist', hue: 28, size: 1 },
    moves: {
      ritual: { intent: 'buff', fx: [{ who: 'self', id: 'ritual', n: 2 }] },
      scorch: { intent: 'attack', dmg: 6 }
    },
    ai: ({ turn }) => (turn === 1 ? 'ritual' : 'scorch')
  },
  gravewarden: { hp: [70, 76], elite: true, art: { kind: 'golem', hue: 210, size: 1.25 },
    moves: {
      crush: { intent: 'attack', dmg: 12 },
      entomb: { intent: 'debuff', fx: [{ who: 'player', id: 'frail', n: 2 }, { who: 'player', id: 'vulnerable', n: 2 }] },
      bulwark: { intent: 'attack_block', dmg: 6, block: 12 }
    },
    ai: ({ turn }) => ['entomb', 'crush', 'bulwark', 'crush'][(turn - 1) % 4]
  },
  alphaFang: { hp: [64, 70], elite: true, art: { kind: 'beast', hue: 350, size: 1.3 },
    moves: {
      howl: { intent: 'buff', fx: [{ who: 'self', id: 'str', n: 3 }] },
      savage: { intent: 'attack', dmg: 5, times: 2 },
      throat: { intent: 'attack', dmg: 13 }
    },
    ai: ({ turn, last }) => (turn === 1 || turn % 4 === 0 ? 'howl' : last === 'savage' ? 'throat' : 'savage')
  },
  rootheart: { hp: [150, 150], boss: true, art: { kind: 'treeboss', hue: 100, size: 1.6 },
    moves: {
      awaken: { intent: 'buff', block: 10, fx: [{ who: 'self', id: 'str', n: 2 }] },
      lash: { intent: 'attack', dmg: 12 },
      spores: { intent: 'attack_debuff', dmg: 5, fx: [{ who: 'player', id: 'poison', n: 4 }, { who: 'player', id: 'weak', n: 2 }] },
      entangle: { intent: 'attack_debuff', dmg: 7, addCards: { id: 'wound', n: 2 } },
      slam: { intent: 'attack', dmg: 22 }
    },
    ai: ({ turn }) => (turn === 1 ? 'awaken' : turn % 4 === 0 ? 'slam' : ['lash', 'spores', 'entangle'][(turn - 2) % 3])
  },

  // ============ ACT 2
  drownedOne: { hp: [38, 44], art: { kind: 'zombie', hue: 185, size: 1 },
    moves: {
      claw: { intent: 'attack', dmg: 11 },
      frenzy: { intent: 'attack', dmg: 4, times: 3 },
      gurgle: { intent: 'attack_debuff', dmg: 5, fx: [{ who: 'player', id: 'weak', n: 2 }] }
    },
    ai: ({ hpFrac, last, rng }) => (hpFrac < 0.5 && last !== 'frenzy' ? 'frenzy' : rng() < 0.6 ? 'claw' : 'gurgle')
  },
  voltEel: { hp: [30, 36], art: { kind: 'serpent', hue: 190, size: 0.9 },
    moves: {
      shock: { intent: 'attack_block', dmg: 7, block: 5 },
      discharge: { intent: 'attack', dmg: 12 },
      coil: { intent: 'buff', block: 8, fx: [{ who: 'self', id: 'str', n: 1 }] }
    },
    ai: ({ turn }) => ['shock', 'coil', 'discharge'][(turn - 1) % 3]
  },
  mirelurker: { hp: [34, 40], art: { kind: 'crawler', hue: 160, size: 0.95 },
    moves: {
      sting: { intent: 'attack_debuff', dmg: 6, fx: [{ who: 'player', id: 'poison', n: 3 }] },
      burrow: { intent: 'block', block: 10 },
      barb: { intent: 'attack', dmg: 9 }
    },
    ai: ({ turn, rng }) => (turn % 3 === 0 ? 'burrow' : rng() < 0.55 ? 'sting' : 'barb')
  },
  tidecaller: { hp: [42, 48], art: { kind: 'cultist', hue: 195, size: 1.05 },
    moves: {
      surge: { intent: 'buff', fx: [{ who: 'allies', id: 'str', n: 2 }] },
      bolt: { intent: 'attack', dmg: 9 },
      undertow: { intent: 'attack_debuff', dmg: 4, fx: [{ who: 'player', id: 'frail', n: 2 }] }
    },
    ai: ({ turn }) => (turn === 1 ? 'surge' : turn % 3 === 0 ? 'undertow' : 'bolt')
  },
  shellback: { hp: [50, 56], art: { kind: 'crab', hue: 15, size: 1.15 },
    moves: {
      snap: { intent: 'attack', dmg: 10 },
      shell: { intent: 'block', block: 13, fx: [{ who: 'self', id: 'thorns', n: 1 }] },
      jet: { intent: 'attack', dmg: 6, times: 2 }
    },
    ai: ({ turn }) => ['snap', 'shell', 'jet', 'shell'][(turn - 1) % 4]
  },
  deepmaw: { hp: [54, 60], art: { kind: 'maw', hue: 200, size: 1.2 },
    moves: {
      bite: { intent: 'attack', dmg: 14 },
      lure: { intent: 'debuff', fx: [{ who: 'player', id: 'vulnerable', n: 2 }] },
      swallow: { intent: 'attack_buff', dmg: 8, heal: 8 }
    },
    ai: ({ turn }) => ['lure', 'bite', 'swallow'][(turn - 1) % 3]
  },
  abyssalKnight: { hp: [108, 116], elite: true, art: { kind: 'knight', hue: 215, size: 1.3 },
    moves: {
      blade: { intent: 'attack', dmg: 15 },
      oath: { intent: 'buff', block: 14, fx: [{ who: 'self', id: 'str', n: 2 }] },
      condemn: { intent: 'debuff', fx: [{ who: 'player', id: 'vulnerable', n: 2 }, { who: 'player', id: 'weak', n: 2 }] },
      execute: { intent: 'attack', dmg: 9, times: 2 }
    },
    ai: ({ turn }) => ['condemn', 'blade', 'oath', 'execute'][(turn - 1) % 4]
  },
  siren: { hp: [92, 100], elite: true, art: { kind: 'siren', hue: 280, size: 1.15 },
    moves: {
      song: { intent: 'debuff', fx: [{ who: 'player', id: 'weak', n: 2 }, { who: 'player', id: 'frail', n: 2 }] },
      rend: { intent: 'attack', dmg: 12 },
      mend: { intent: 'heal', heal: 12, block: 6 },
      shriek: { intent: 'attack', dmg: 7, times: 2 }
    },
    ai: ({ turn, hpFrac, last }) => {
      if (hpFrac < 0.55 && last !== 'mend') return 'mend';
      return ['song', 'rend', 'shriek'][(turn - 1) % 3];
    }
  },
  leviathan: { hp: [260, 260], boss: true, art: { kind: 'leviathan', hue: 195, size: 1.7 },
    moves: {
      tide: { intent: 'buff', block: 15, fx: [{ who: 'self', id: 'str', n: 1 }] },
      crush: { intent: 'attack', dmg: 17 },
      brine: { intent: 'attack_debuff', dmg: 6, fx: [{ who: 'player', id: 'poison', n: 5 }, { who: 'player', id: 'weak', n: 2 }] },
      consume: { intent: 'heal', heal: 20, block: 10 },
      cataclysm: { intent: 'attack', dmg: 30 }
    },
    ai: ({ turn }) => (turn === 1 ? 'tide' : turn % 4 === 0 ? 'cataclysm' : ['crush', 'brine', 'consume'][(turn - 2) % 3])
  },

  // ============ ACT 3
  voidWisp: { hp: [26, 30], facets: 3, art: { kind: 'wisp', hue: 275, size: 0.78 },
    moves: {
      zap: { intent: 'attack', dmg: 7 },
      siphon: { intent: 'attack_buff', dmg: 5, heal: 5 }
    },
    ai: ({ rng }) => (rng() < 0.6 ? 'zap' : 'siphon')
  },
  obsidianGolem: { hp: [64, 72], art: { kind: 'golem', hue: 270, size: 1.3 },
    moves: {
      pound: { intent: 'attack', dmg: 14 },
      harden: { intent: 'block', block: 14 },
      quake: { intent: 'attack_debuff', dmg: 10, fx: [{ who: 'player', id: 'frail', n: 2 }] }
    },
    ai: ({ turn }) => ['pound', 'harden', 'quake'][(turn - 1) % 3]
  },
  starCultist: { hp: [46, 52], art: { kind: 'cultist', hue: 290, size: 1.05 },
    moves: {
      ritual: { intent: 'buff', fx: [{ who: 'self', id: 'ritual', n: 3 }] },
      scorch: { intent: 'attack', dmg: 9 }
    },
    ai: ({ turn }) => (turn === 1 ? 'ritual' : 'scorch')
  },
  shade: { hp: [42, 48], art: { kind: 'shade', hue: 260, size: 1 },
    moves: {
      slash: { intent: 'attack', dmg: 6, times: 2 },
      gloom: { intent: 'attack_debuff', dmg: 6, fx: [{ who: 'player', id: 'weak', n: 2 }] },
      vanish: { intent: 'block', block: 12 }
    },
    ai: ({ turn, rng }) => (turn % 3 === 0 ? 'vanish' : rng() < 0.5 ? 'slash' : 'gloom')
  },
  chaosHound: { hp: [56, 64], art: { kind: 'beast', hue: 315, size: 1.1 },
    startStatus: { rampage: 1 },
    moves: {
      bite: { intent: 'attack', dmg: 9, ramp: 3 },
      howl: { intent: 'buff', fx: [{ who: 'self', id: 'str', n: 2 }] }
    },
    ai: ({ turn }) => (turn % 4 === 0 ? 'howl' : 'bite')
  },
  watcherEye: { hp: [48, 56], art: { kind: 'eye', hue: 250, size: 1.05 },
    moves: {
      gaze: { intent: 'attack_debuff', dmg: 8, fx: [{ who: 'player', id: 'vulnerable', n: 2 }] },
      beam: { intent: 'attack', dmg: 15 },
      blink: { intent: 'attack_block', dmg: 5, block: 10 }
    },
    ai: ({ turn }) => ['gaze', 'beam', 'blink'][(turn - 1) % 3]
  },
  voidColossus: { hp: [155, 168], elite: true, art: { kind: 'golem', hue: 305, size: 1.5 },
    moves: {
      slam: { intent: 'attack', dmg: 20 },
      fortify: { intent: 'buff', block: 18, fx: [{ who: 'self', id: 'str', n: 2 }] },
      shatter: { intent: 'attack_debuff', dmg: 8, fx: [{ who: 'player', id: 'frail', n: 3 }] }
    },
    ai: ({ turn }) => ['shatter', 'slam', 'fortify', 'slam'][(turn - 1) % 4]
  },
  heraldOfEnd: { hp: [128, 142], elite: true, art: { kind: 'shade', hue: 335, size: 1.4 },
    moves: {
      doom: { intent: 'debuff', fx: [{ who: 'player', id: 'poison', n: 7 }] },
      reave: { intent: 'attack', dmg: 16 },
      flame: { intent: 'attack', dmg: 8, times: 2 },
      rise: { intent: 'buff', fx: [{ who: 'self', id: 'str', n: 3 }] }
    },
    ai: ({ turn }) => (turn % 4 === 0 ? 'rise' : ['doom', 'reave', 'flame'][(turn - 1) % 3])
  },
  sovereign: { hp: [330, 330], boss: true, art: { kind: 'sovereign', hue: 285, size: 1.8 },
    moves: {
      scepter: { intent: 'attack', dmg: 18 },
      gravitas: { intent: 'buff', block: 20, fx: [{ who: 'self', id: 'str', n: 2 }] },
      starfall: { intent: 'attack', dmg: 11, times: 2 },
      ruin: { intent: 'attack_debuff', dmg: 4, fx: [{ who: 'player', id: 'poison', n: 4 }, { who: 'player', id: 'weak', n: 2 }, { who: 'player', id: 'frail', n: 2 }] },
      ascend: { intent: 'buff', block: 30, fx: [{ who: 'self', id: 'str', n: 4 }] },
      annihilation: { intent: 'attack', dmg: 34 }
    },
    ai: (ctx) => {
      const e = ctx.self;
      if (ctx.hpFrac <= 0.5 && !e.flags.ascended) { e.flags.ascended = true; return 'ascend'; }
      if (e.flags.ascended) {
        e.flags.p2 = (e.flags.p2 || 0) + 1;
        return e.flags.p2 % 3 === 0 ? 'annihilation' : ['scepter', 'starfall', 'ruin', 'gravitas'][e.flags.p2 % 4];
      }
      return ['scepter', 'gravitas', 'starfall', 'ruin'][(ctx.turn - 1) % 4];
    }
  }
};

// encounter pools: arrays of enemy-id arrays
export const ENCOUNTERS = [
  { // act 1
    weak: [['sporeling', 'sporeling'], ['duskfang'], ['gloomslime'], ['sporeling', 'sporeling', 'sporeling']],
    normal: [
      ['duskfang', 'sporeling'], ['ashAcolyte'], ['waylayer'], ['thornling', 'thornling'],
      ['gloomslime', 'sporeling'], ['duskfang', 'duskfang'], ['waylayer', 'sporeling'],
    ],
    elite: [['gravewarden'], ['alphaFang']],
    boss: [['rootheart']],
  },
  { // act 2
    weak: [['voltEel'], ['mirelurker'], ['drownedOne']],
    normal: [
      ['drownedOne', 'voltEel'], ['tidecaller', 'mirelurker'], ['shellback'], ['deepmaw'],
      ['drownedOne', 'drownedOne'], ['tidecaller', 'voltEel'], ['mirelurker', 'mirelurker'],
    ],
    elite: [['abyssalKnight'], ['siren']],
    boss: [['leviathan']],
  },
  { // act 3
    weak: [['voidWisp', 'voidWisp'], ['shade'], ['starCultist']],
    normal: [
      ['obsidianGolem'], ['shade', 'voidWisp'], ['chaosHound'], ['watcherEye'],
      ['starCultist', 'voidWisp'], ['shade', 'shade'], ['chaosHound', 'voidWisp'], ['watcherEye', 'starCultist'],
    ],
    elite: [['voidColossus'], ['heraldOfEnd']],
    boss: [['sovereign']],
  },
];

// ---------------------------------------------------------------- EVENTS
// choice ops executed in order: gold±n, hp±n, maxHp±n, heal frac, addCard, addRelic('random'|id),
// pickRemove, pickUpgrade, pickDuplicate, pickCard(pool), potion, roll:[{p, ops, text}]
export const EVENTS = {
  forgottenShrine: { glyph: '⛩', hue: 45,
    choices: [
      { ops: [{ pickRemove: true }] },
      { ops: [{ gold: 90 }, { addCard: 'hex' }] },
      { ops: [] },
    ]
  },
  woundedKnight: { glyph: '⚔', hue: 210,
    choices: [
      { ops: [{ hp: -8 }, { addRelic: 'random' }] },
      { ops: [{ gold: 65 }, { addCard: 'hex' }] },
      { ops: [] },
    ]
  },
  voidChest: { glyph: '▣', hue: 280,
    choices: [
      {
        ops: [{ roll: [{ p: 0.55, ops: [{ addRelic: 'random' }]}, { p: 0.45, ops: [{ hp: -12 }]}] }]
      },
      { ops: [] },
    ]
  },
  emberFountain: { glyph: '❂', hue: 30,
    choices: [
      { ops: [{ heal: 0.35 }] },
      { ops: [{ potion: 'healing' }] },
      { ops: [] },
    ]
  },
  forge: { glyph: '⚒', hue: 15,
    choices: [
      { ops: [{ pickUpgrade: true }] },
      { ops: [] },
    ]
  },
  gambler: { glyph: '⚄', hue: 50,
    choices: [
      { needGold: 40,
        ops: [{ gold: -40 }, { roll: [
          { id: 'win', p: 0.45, ops: [{ gold: 110 }] },
          { id: 'lose', p: 0.55, ops: [] },
        ] }]
      },
      { ops: [] },
    ]
  },
  mirror: { glyph: '◐', hue: 220,
    choices: [
      { ops: [{ pickDuplicate: true }] },
      { ops: [{ hp: -6 }, { pickRemove: true }] },
      { ops: [] },
    ]
  },
  library: { glyph: '❦', hue: 190,
    choices: [
      { ops: [{ pickCard: 5 }] },
      { ops: [{ heal: 0.2 }] },
    ]
  },
  fleshTrader: { glyph: '♠', hue: 320,
    choices: [
      { ops: [{ maxHp: -8 }, { addRelic: 'random' }] },
      { ops: [] },
    ]
  },
  cursedIdol: { glyph: '☿', hue: 100,
    choices: [
      { ops: [{ addRelic: 'random' }, { addCard: 'hex' }] },
      { ops: [] },
    ]
  },
  ruinedCamp: { glyph: '⛺', hue: 35,
    choices: [
      { ops: [{ heal: 0.15 }] },
      { ops: [{ gold: 45 }, { potion: 'random' }] },
    ]
  }
};

export const REWARD_GOLD = [
  { normal: [12, 20], elite: [28, 38], boss: [70, 80] },
  { normal: [18, 28], elite: [35, 48], boss: [85, 100] },
  { normal: [24, 36], elite: [45, 60], boss: [100, 120] },
];

export const SHOP = {
  removeCost: 75,
  cardPrice: { common: [45, 55], uncommon: [68, 82], rare: [135, 160] },
  relicPrice: { common: [140, 160], uncommon: [220, 250], rare: [270, 300] },
  potionPrice: [48, 62],
};

// ---------------------------------------------------------------- OMENS
// One rolled per act: a rule the night imposes on everyone. Every omen gives
// with one hand and takes with the other. The engine reads only `mods`.
export const OMENS = {
  eighthOmen: { glyph: null, tone: '#e8e0ff',
    mods: { allCombatsAffixed: true }
  },
  ashfall: { glyph: '☁', tone: '#d3f2a1',
    mods: { enemyStartStatus: { poison: 2 }, playerHitApplies: { poison: 1 } }
  },
  heavyAir: { glyph: '☗', tone: '#8fd0ff',
    mods: { wardMult: 1.25 }
  },
  thinGlass: { glyph: '◬', tone: '#dfeaff',
    mods: { facetDelta: -1, enemyDmgBonus: 2 }
  },
  hungryDark: { glyph: '☾', tone: '#c99aff',
    mods: { shopMult: 1.25, rewardChoiceBonus: 1 }
  },
  emberWind: { glyph: '✦', tone: '#ff9a4d',
    mods: { startEmbers: 2, drawDelta: -1 }
  },
  longNight: { glyph: '★', tone: '#b18cff',
    mods: { hpMult: 1.12, goldMult: 1.4 }
  },
  waningMoon: { glyph: '◐', tone: '#ffe9ac',
    mods: { firstCardDiscount: 1, restHealFrac: 0.2 }
  }
};

// ---------------------------------------------------------------- ELITE AFFIXES
// Every elite arrives wearing a title. The title is a promise.
export const AFFIXES = {
  vitrified: { tone: '#8fd0ff', mods: { facetDelta: 2, hpMult: 1.15 } },
  cinderVeined: { tone: '#ff9a4d', mods: { attackApplies: { poison: 1 } } },
  adamant: { tone: '#d8c27a', mods: { adamant: true } },
  emberFat: { tone: '#ffe9ac', mods: { goldMult: 2 } },
  veiled: { tone: '#9aa7b8', mods: { startBlock: 15 } },
  fervent: { tone: '#ff8d8d', mods: { startStatus: { str: 2 } } }
};

// ---------------------------------------------------------------- LANTERN ARTS
// The hero's own voice: one Art per run, always at hand, paid in Embers,
// once per turn. All target-free by design — the lantern doesn't aim, it answers.
export const ARTS = {
  flare: { glyph: '✹', tone: '#ff9a4d', cost: 3,
    effects: [{ kind: 'dmg', n: 7 }, { kind: 'status', who: 'allEnemies', id: 'poison', n: 2 }]
  },
  mendglass: { glyph: '❋', tone: '#8fe8a0', cost: 4,
    effects: [{ kind: 'heal', n: 8 }]
  },
  beacon: { glyph: '☀', tone: '#ffe9ac', cost: 2,
    effects: [{ kind: 'status', who: 'self', id: 'beacon', n: 1 }]
  },
  emberveil: { glyph: '⛨', tone: '#8fd0ff', cost: 3,
    effects: [{ kind: 'block', n: 12 }]
  },
  stoke: { glyph: '✦', tone: '#c99aff', cost: 4,
    effects: [{ kind: 'energy', n: 1 }, { kind: 'draw', n: 2 }]
  },
  ashfall: { glyph: '☁', tone: '#d3f2a1', cost: 3,
    effects: [{ kind: 'status', who: 'allEnemies', id: 'poison', n: 3 }, { kind: 'block', n: 5 }]
  }
};

// ---------------------------------------------------------------- THE VIGIL: DEEDS
// Lifetime feats, tallied across every climb. Crossing a threshold unlocks
// content into the pools ('card:id' / 'relic:id') or the second Aspect.
// stat = key in the vigil's deed counters (fed from run.stats at run end).
export const DEEDS = {
  paneBreaker: { stat: 'shatters', n: 15, unlocks: ['card:quakeblow', 'card:resonantLance'] },
  lanternFed: { stat: 'kindles', n: 20, unlocks: ['card:tithe', 'card:pyreheart'] },
  ashSermon: { stat: 'smolderKills', n: 10, unlocks: ['card:ashenChoir', 'relic:smolderingCoal'] },
  untouched: { stat: 'perfects', n: 3, unlocks: ['card:flawlessForm', 'relic:prismCharm'] },
  darkWalker: { stat: 'unlitVisited', n: 6, unlocks: ['card:nightSight', 'relic:thiefOfWicks'] },
  spendthrift: { stat: 'embersSpent', n: 30, unlocks: ['card:novaflare', 'card:emberdance'] },
  hundredShards: { stat: 'slain', n: 100, unlocks: ['card:shardstorm', 'relic:bellOfEndings'] },
  firstDawn: { stat: 'wins', n: 1, unlocks: ['aspect2'] }
};

const HOLLOW_LAMPLIGHTER_MEETINGS = [];

// ---------------------------------------------------------------- THE VIGIL: PROGRESSIVE DELIVERY
// Every pacing tunable lives in PROGRESSION. REVEALS is derived from
// revealThresholds so the ladder ids stay declarative while counts stay
// tunable in one place. The engine never reads storage for these: newRun()
// receives a snapshot. Aspects and vows keep their own unlock mechanisms.
// Cards/relics not listed in any wave are core (available from run 1).
// Deed-locked content stays deed-gated on top. Criterion: core + wave 2
// favor low-complexity picks; combo pieces and build-arounds arrive late.
// Boss crowns are never wave-gated (rollBossRelics needs its full pool).
export const PROGRESSION = {
  // structural reveal ladder — runsPlayed counts every run end (win/fall/
  // abandon); wins come from deeds. Comments name what each id unlocks.
  revealThresholds: {
    lamplighter: { runsPlayed: 1 }, // boons + Lantern Art choice
    phials: { runsPlayed: 2 },      // potion drops, shop stock, HUD slots
    omens: { runsPlayed: 3 },       // per-act omen rolls + banner
    poolWave2: { runsPlayed: 2 },   // pool widens (see poolWaves)
    poolWave3: { runsPlayed: 4 },
    poolFull: { runsPlayed: 6 },    // today's full base pool
    emberglass: { wins: 1 },        // the chain arms (Phase 2)
    act4: { shards: 6 }, // derived sealed-door surface, no playable act
  },
  poolWaves: {
    poolWave2: {
      cards: ['executioner', 'momentum', 'toxicMist', 'regrowth', 'bloodRite', 'devour', 'annihilate', 'limitBreak'],
      relics: ['reapersBell', 'seersOrb', 'frozenCore'],
    },
    poolWave3: {
      cards: ['offering', 'catalyst'],
      relics: ['executionersSeal'],
    },
    poolFull: {
      cards: ['ascension', 'frenzy', 'virulence'],
      relics: ['verdantBranch', 'duskmirror'],
    },
  },
  emberglass: {
    // Accepted 2,000-seed pacing: Act II mark 0.6, Hollow chance 0.2 and pity 3 (guided 18; unguided 50).
    armWins: [2, 4, 6, 8, 10],
    paleOnes: {
      lensAt: 3, completeAt: 9, hiddenPerRun: 1,
      markedAct1: 1, markedAct2Chance: 0.6,
    },
    ownShade: {
      minDeathAct: 1, completeAt: 3,
      tiers: [
        { hpMult: 1, dmgMult: 1, addStatuses: {}, scale: 1.05 },
        { hpMult: 1.25, dmgMult: 1.15, addStatuses: { str: 1 }, scale: 1.12 },
        { hpMult: 1.55, dmgMult: 1.3, addStatuses: { str: 2 }, scale: 1.2 },
      ],
    },
    usurper: { minShopAct: 1, referencePurse: 260, priceMultiplier: 2.5, price: 650, completeAt: 1 },
    eighthOmen: {
      guaranteeRuns: 2, saveDueInMax: 2, recurrenceChance: 1 / 3, completeAt: 1,
    },
    unreadablePage: { offerRewardOrdinal: 2, completeAt: 5 },
    hollowLamplighter: {
      appearanceChance: 0.2, pityEligibleRuns: 3, maxMeetingsPerRun: 1,
      completeAt: 5,
      emberDebt: 3, saveEmberDebtMax: 3,
      gold: 160, maxHp: 12, minMaxHpAfter: 30, finalHp: 1,
    },
    variantStats: {
      pale: { hpMult: 1.18, dmgMult: 1.1, addStatuses: { str: 1 } },
      usurper: { hpMult: 1.25, dmgMult: 1.15, addStatuses: { str: 2 } },
    },
  },
};

// derived: id + trigger pairs for isRevealed / revealSnapshot / save validation
export const REVEALS = Object.entries(PROGRESSION.revealThresholds).map(([id, trigger]) => ({ id, trigger }));

// derived: content id -> the reveal id that admits it into the pools
export const POOL_GATE = (() => {
  const gate = { cards: {}, relics: {} };
  for (const [rev, w] of Object.entries(PROGRESSION.poolWaves)) {
    for (const id of w.cards) gate.cards[id] = rev;
    for (const id of w.relics) gate.relics[id] = rev;
  }
  return gate;
})();

export const QUEST_IDS = [
  'paleOnes', 'ownShade', 'usurper',
  'eighthOmen', 'unreadablePage', 'hollowLamplighter',
];

export const QUEST_STATES = Object.freeze(['dormant', 'armed', 'revealed', 'complete']);
export const QUEST_ACTIVE_STATES = Object.freeze(['armed', 'revealed']);
export const TERMINAL_OUTCOMES = Object.freeze(['win', 'death', 'abandon']);
export const RUN_ID_RE = /^(?:run|legacy)-[a-z0-9]+(?:-[a-z0-9]+){1,3}$/;

export const WHISPERS = [
];

export const QUESTS = {
  paleOnes: { target: PROGRESSION.emberglass.paleOnes.completeAt
  },
  ownShade: { target: PROGRESSION.emberglass.ownShade.completeAt
  },
  usurper: { target: PROGRESSION.emberglass.usurper.completeAt
  },
  eighthOmen: { target: PROGRESSION.emberglass.eighthOmen.completeAt
  },
  unreadablePage: { target: PROGRESSION.emberglass.unreadablePage.completeAt
  },
  hollowLamplighter: {
    get target() { return PROGRESSION.emberglass.hollowLamplighter.completeAt; },
    meetings: HOLLOW_LAMPLIGHTER_MEETINGS
  }
};

export const SHADE_KITS = {
  duskblade: {
    moves: {
      eclipse: { intent: 'attack_debuff', dmg: 12, fx: [{ who: 'player', id: 'vulnerable', n: 1 }] },
      chisel: { intent: 'attack_debuff', dmg: 8, fx: [{ who: 'player', id: 'frail', n: 1 }] },
      spark: { intent: 'buff', block: 10, fx: [{ who: 'self', id: 'str', n: 2 }] }
    },
    ai: ({ turn }) => ['eclipse', 'chisel', 'spark'][(turn - 1) % 3]
  },
  ashwarden: {
    moves: {
      ashbite: { intent: 'attack_debuff', dmg: 10, fx: [{ who: 'player', id: 'poison', n: 2 }] },
      smother: { intent: 'attack_block', dmg: 6, block: 12 },
      ashfall: { intent: 'debuff', fx: [{ who: 'player', id: 'poison', n: 5 }, { who: 'player', id: 'weak', n: 1 }] }
    },
    ai: ({ turn }) => ['ashbite', 'smother', 'ashfall'][(turn - 1) % 3]
  }
};

const pale = PROGRESSION.emberglass.variantStats.pale;
const shadeTier = PROGRESSION.emberglass.ownShade.tiers;
export const VARIANTS = {
  paleDuskfang: { id: 'paleDuskfang', base: 'duskfang', tint: { hue: 165, saturation: 0.45, brightness: 1.18 }, scale: 1.08, statMods: pale, drop: { quest: 'paleOnes', kind: 'paleMote', n: 1 } },
  paleDrownedOne: { id: 'paleDrownedOne', base: 'drownedOne', tint: { hue: 120, saturation: 0.38, brightness: 1.2 }, scale: 1.1, statMods: pale, drop: { quest: 'paleOnes', kind: 'paleMote', n: 1 } },
  paleVoidWisp: { id: 'paleVoidWisp', base: 'voidWisp', tint: { hue: -90, saturation: 0.32, brightness: 1.25 }, scale: 1.12, statMods: pale, drop: { quest: 'paleOnes', kind: 'paleMote', n: 1 } },
  ownShade1: { id: 'ownShade1', base: 'hero', tint: { hue: 35, saturation: 0.25, brightness: 0.62 }, scale: shadeTier[0].scale, statMods: shadeTier[0], drop: { quest: 'ownShade', kind: 'shadeMemory', n: 1 } },
  ownShade2: { id: 'ownShade2', base: 'hero', tint: { hue: 20, saturation: 0.2, brightness: 0.55 }, scale: shadeTier[1].scale, statMods: shadeTier[1], drop: { quest: 'ownShade', kind: 'shadeMemory', n: 1 } },
  ownShade3: { id: 'ownShade3', base: 'hero', tint: { hue: 0, saturation: 0.16, brightness: 0.48 }, scale: shadeTier[2].scale, statMods: shadeTier[2], drop: { quest: 'ownShade', kind: 'shadeMemory', n: 1 } },
  usurpedSovereign: {
    id: 'usurpedSovereign', base: 'sovereign',
    tint: { hue: 105, saturation: 0.65, brightness: 1.08 }, scale: 1.15,
    statMods: PROGRESSION.emberglass.variantStats.usurper,
    drop: { quest: 'usurper', kind: 'shard', n: 1 }
  }
};

// ---------------------------------------------------------------- THE VIGIL: ASPECTS
// Who carries the lantern. Each aspect is a whole kit — HP, starting deck, relic,
// and the Lantern Art it favors. ASPECTS[0] is the Duskblade (== PLAYER); the
// Ashwarden is earned by reaching the first dawn (deed 'firstDawn' → 'aspect2').
export const ASPECTS = [
  PLAYER,
  {
    id: 'ashwarden',
    hue: 26, art: 'ashfall', unlock: 'aspect2',
    maxHp: 80,
    energy: 3,
    handSize: 5,
    potionSlots: 3,
    startDeck: ['ashBite', 'ashBite', 'ashBite', 'ashBite', 'defend', 'defend', 'defend', 'smother', 'smother', 'firstSpark'],
    startRelic: 'ashenCore',
    startGold: 99
  },
];

// ---------------------------------------------------------------- THE VIGIL: VOWS
// The difficulty ladder. Running at Vow N imposes vows 1..N, cumulatively.
// Winning at Vow N unlocks Vow N+1. Mods are read by the engine's vowMods().
export const VOWS = [
  { mods: { hpMult: 1.12 } },
  { mods: { enemyDmgBonus: 1 } },
  { mods: { bossFacetDelta: 1 } },
  { mods: { startHex: true } },
  { mods: { restHealFrac: 0.2 } },
];

// ---------------------------------------------------------------- THE VIGIL: BOONS
// The Lamplighter's gift. At run start, choose 1 of 3 drawn from this pool.
// ops reuse the event-op executor; kept non-interactive so the gift resolves at once.
export const BOONS = {
  fullPurse: { ops: [{ gold: 120 }] },
  temperedGlass: { ops: [{ maxHp: 14 }] },
  keenEye: { ops: [{ addRelic: 'random' }] },
  warmHearth: { ops: [{ maxHp: 6 }, { heal: 1 }] },
  emberFlask: { ops: [{ potion: 'fire' }, { potion: 'healing' }] },
  twinPhials: { ops: [{ potion: 'swift' }, { potion: 'energy' }] },
  pilgrimsCache: { ops: [{ gold: 60 }, { potion: 'block' }] },
  venomPouch: { ops: [{ gold: 40 }, { potion: 'venom' }] }
};

// Display strings from active locale (default en)
hydrateContent({
  CARDS, STATUS_INFO, RELICS, POTIONS, ARTS, BOONS,
  ENEMIES, EVENTS, OMENS, AFFIXES, ACTS, ASPECTS, VOWS, DEEDS, PLAYER,
  QUESTS, WHISPERS, VARIANTS, SHADE_KITS,
}, getContent());
