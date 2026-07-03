// SPIREBOUND — all game content. Pure data, no DOM.

export const PLAYER = {
  name: 'The Duskblade',
  maxHp: 72,
  energy: 3,
  handSize: 5,
  potionSlots: 3,
  startDeck: ['strike', 'strike', 'strike', 'strike', 'strike', 'defend', 'defend', 'defend', 'defend', 'eclipseSlash'],
  startRelic: 'emberHeart',
  startGold: 99,
};

export const ACTS = [
  {
    name: 'The Ashen Woods', boss: 'rootheart', bossName: 'The Rootheart',
    theme: { sky: 0x0c1410, fog: 0x13241a, particles: 0xffa04d, glow: 0x66ff9e, accent: '#7ddb8f', ember: '#ff9a4d' },
  },
  {
    name: 'The Sunken City', boss: 'leviathan', bossName: "Leviathan's Maw",
    theme: { sky: 0x081420, fog: 0x0d2233, particles: 0x53e8ff, glow: 0x2fb8ff, accent: '#5fd6e8', ember: '#53e8ff' },
  },
  {
    name: 'The Obsidian Spire', boss: 'sovereign', bossName: 'The Eternal Sovereign',
    theme: { sky: 0x120a1e, fog: 0x1e1230, particles: 0xc27bff, glow: 0xff4fd8, accent: '#c99aff', ember: '#ff6fe0' },
  },
];

// ---------------------------------------------------------------- CARDS
// effects ops: dmg{n,times} block{n} draw{n} energy{n} heal{n} loseHp{n}
//   status{who:'target'|'self'|'allEnemies', id, n}  special{id,n}  addCard{id,n,where}
// text tokens: @n@ = attack number (str/vuln/weak-adjusted in UI), #n# = block number (dex/frail-adjusted)

export const CARDS = {
  // ---- starters
  strike: {
    name: 'Strike', type: 'attack', rarity: 'starter', cost: 1, target: 'enemy',
    text: 'Deal @6@ damage.', effects: [{ kind: 'dmg', n: 6 }],
    up: { text: 'Deal @9@ damage.', effects: [{ kind: 'dmg', n: 9 }] },
  },
  defend: {
    name: 'Defend', type: 'skill', rarity: 'starter', cost: 1, target: 'self',
    text: 'Gain #5# Block.', effects: [{ kind: 'block', n: 5 }],
    up: { text: 'Gain #8# Block.', effects: [{ kind: 'block', n: 8 }] },
  },
  eclipseSlash: {
    name: 'Eclipse Slash', type: 'attack', rarity: 'starter', cost: 1, target: 'enemy',
    text: 'Deal @7@ damage. Apply 1 Vulnerable.',
    effects: [{ kind: 'dmg', n: 7 }, { kind: 'status', who: 'target', id: 'vulnerable', n: 1 }],
    up: {
      text: 'Deal @9@ damage. Apply 2 Vulnerable.',
      effects: [{ kind: 'dmg', n: 9 }, { kind: 'status', who: 'target', id: 'vulnerable', n: 2 }],
    },
  },

  // ---- common attacks
  twinFangs: {
    name: 'Twin Fangs', type: 'attack', rarity: 'common', cost: 1, target: 'enemy',
    text: 'Deal @4@ damage twice.', effects: [{ kind: 'dmg', n: 4, times: 2 }],
    up: { text: 'Deal @6@ damage twice.', effects: [{ kind: 'dmg', n: 6, times: 2 }] },
  },
  quickSlash: {
    name: 'Quick Slash', type: 'attack', rarity: 'common', cost: 0, target: 'enemy',
    text: 'Deal @4@ damage. Draw 1 card.', effects: [{ kind: 'dmg', n: 4 }, { kind: 'draw', n: 1 }],
    up: { text: 'Deal @6@ damage. Draw 1 card.', effects: [{ kind: 'dmg', n: 6 }, { kind: 'draw', n: 1 }] },
  },
  heavyBlow: {
    name: 'Heavy Blow', type: 'attack', rarity: 'common', cost: 2, target: 'enemy',
    text: 'Deal @14@ damage.', effects: [{ kind: 'dmg', n: 14 }],
    up: { text: 'Deal @20@ damage.', effects: [{ kind: 'dmg', n: 20 }] },
  },
  cleave: {
    name: 'Cleave', type: 'attack', rarity: 'common', cost: 1, target: 'allEnemies',
    text: 'Deal @6@ damage to ALL enemies.', effects: [{ kind: 'dmg', n: 6 }],
    up: { text: 'Deal @9@ damage to ALL enemies.', effects: [{ kind: 'dmg', n: 9 }] },
  },
  venomStrike: {
    name: 'Venom Strike', type: 'attack', rarity: 'common', cost: 1, target: 'enemy',
    text: 'Deal @4@ damage. Apply 3 Poison.',
    effects: [{ kind: 'dmg', n: 4 }, { kind: 'status', who: 'target', id: 'poison', n: 3 }],
    up: {
      text: 'Deal @6@ damage. Apply 4 Poison.',
      effects: [{ kind: 'dmg', n: 6 }, { kind: 'status', who: 'target', id: 'poison', n: 4 }],
    },
  },
  lunge: {
    name: 'Lunge', type: 'attack', rarity: 'common', cost: 1, target: 'enemy',
    text: 'Deal @6@ damage. Apply 1 Weak.',
    effects: [{ kind: 'dmg', n: 6 }, { kind: 'status', who: 'target', id: 'weak', n: 1 }],
    up: {
      text: 'Deal @9@ damage. Apply 2 Weak.',
      effects: [{ kind: 'dmg', n: 9 }, { kind: 'status', who: 'target', id: 'weak', n: 2 }],
    },
  },
  guardedStrike: {
    name: 'Guarded Strike', type: 'attack', rarity: 'common', cost: 1, target: 'enemy',
    text: 'Deal @5@ damage. Gain #4# Block.',
    effects: [{ kind: 'dmg', n: 5 }, { kind: 'block', n: 4 }],
    up: {
      text: 'Deal @7@ damage. Gain #6# Block.',
      effects: [{ kind: 'dmg', n: 7 }, { kind: 'block', n: 6 }],
    },
  },

  // ---- common skills
  brace: {
    name: 'Brace', type: 'skill', rarity: 'common', cost: 1, target: 'self',
    text: 'Gain #8# Block.', effects: [{ kind: 'block', n: 8 }],
    up: { text: 'Gain #11# Block.', effects: [{ kind: 'block', n: 11 }] },
  },
  sidestep: {
    name: 'Sidestep', type: 'skill', rarity: 'common', cost: 0, target: 'self',
    text: 'Gain #3# Block. Draw 1 card.', effects: [{ kind: 'block', n: 3 }, { kind: 'draw', n: 1 }],
    up: { text: 'Gain #5# Block. Draw 1 card.', effects: [{ kind: 'block', n: 5 }, { kind: 'draw', n: 1 }] },
  },
  preparation: {
    name: 'Preparation', type: 'skill', rarity: 'common', cost: 0, target: 'self',
    text: 'Draw 2 cards. Exhaust.', exhaust: true, effects: [{ kind: 'draw', n: 2 }],
    up: { text: 'Draw 2 cards.', exhaust: false, effects: [{ kind: 'draw', n: 2 }] },
  },
  deflect: {
    name: 'Deflect', type: 'skill', rarity: 'common', cost: 1, target: 'self',
    text: 'Gain #6# Block. Draw 1 card.', effects: [{ kind: 'block', n: 6 }, { kind: 'draw', n: 1 }],
    up: { text: 'Gain #9# Block. Draw 1 card.', effects: [{ kind: 'block', n: 9 }, { kind: 'draw', n: 1 }] },
  },

  // ---- uncommon attacks
  leechBlade: {
    name: 'Leech Blade', type: 'attack', rarity: 'uncommon', cost: 2, target: 'enemy',
    text: 'Deal @9@ damage. Heal for half the unblocked damage.',
    effects: [{ kind: 'special', id: 'leech', n: 9 }],
    up: { text: 'Deal @13@ damage. Heal for half the unblocked damage.', effects: [{ kind: 'special', id: 'leech', n: 13 }] },
  },
  tempest: {
    name: 'Tempest', type: 'attack', rarity: 'uncommon', cost: 2, target: 'allEnemies',
    text: 'Deal @4@ damage to ALL enemies twice.', effects: [{ kind: 'dmg', n: 4, times: 2 }],
    up: { text: 'Deal @6@ damage to ALL enemies twice.', effects: [{ kind: 'dmg', n: 6, times: 2 }] },
  },
  uppercut: {
    name: 'Uppercut', type: 'attack', rarity: 'uncommon', cost: 2, target: 'enemy',
    text: 'Deal @10@ damage. Apply 1 Weak and 1 Vulnerable.',
    effects: [
      { kind: 'dmg', n: 10 },
      { kind: 'status', who: 'target', id: 'weak', n: 1 },
      { kind: 'status', who: 'target', id: 'vulnerable', n: 1 },
    ],
    up: {
      text: 'Deal @13@ damage. Apply 2 Weak and 2 Vulnerable.',
      effects: [
        { kind: 'dmg', n: 13 },
        { kind: 'status', who: 'target', id: 'weak', n: 2 },
        { kind: 'status', who: 'target', id: 'vulnerable', n: 2 },
      ],
    },
  },
  flurry: {
    name: 'Flurry', type: 'attack', rarity: 'uncommon', cost: 1, target: 'enemy',
    text: 'Deal @2@ damage 3 times.', effects: [{ kind: 'dmg', n: 2, times: 3 }],
    up: { text: 'Deal @3@ damage 3 times.', effects: [{ kind: 'dmg', n: 3, times: 3 }] },
  },
  executioner: {
    name: 'Executioner', type: 'attack', rarity: 'uncommon', cost: 1, target: 'enemy',
    text: 'Deal @8@ damage. Vulnerable enemies take 6 more.',
    effects: [{ kind: 'special', id: 'execute', n: 8, bonus: 6 }],
    up: { text: 'Deal @11@ damage. Vulnerable enemies take 8 more.', effects: [{ kind: 'special', id: 'execute', n: 11, bonus: 8 }] },
  },
  momentum: {
    name: 'Momentum', type: 'attack', rarity: 'uncommon', cost: 1, target: 'enemy',
    text: 'Deal @6@ damage. Each play, this card gains +4 damage this combat.',
    effects: [{ kind: 'special', id: 'momentum', n: 6, grow: 4 }],
    up: { text: 'Deal @8@ damage. Each play, this card gains +6 damage this combat.', effects: [{ kind: 'special', id: 'momentum', n: 8, grow: 6 }] },
  },

  // ---- uncommon skills
  bulwark: {
    name: 'Bulwark', type: 'skill', rarity: 'uncommon', cost: 2, target: 'self',
    text: 'Gain #13# Block.', effects: [{ kind: 'block', n: 13 }],
    up: { text: 'Gain #18# Block.', effects: [{ kind: 'block', n: 18 }] },
  },
  surge: {
    name: 'Surge', type: 'skill', rarity: 'uncommon', cost: 0, target: 'self',
    text: 'Gain 1 Energy. Draw 1 card. Exhaust.', exhaust: true,
    effects: [{ kind: 'energy', n: 1 }, { kind: 'draw', n: 1 }],
    up: { text: 'Gain 2 Energy. Draw 1 card. Exhaust.', effects: [{ kind: 'energy', n: 2 }, { kind: 'draw', n: 1 }] },
  },
  toxicMist: {
    name: 'Toxic Mist', type: 'skill', rarity: 'uncommon', cost: 1, target: 'allEnemies',
    text: 'Apply 3 Poison to ALL enemies.',
    effects: [{ kind: 'status', who: 'allEnemies', id: 'poison', n: 3 }],
    up: { text: 'Apply 5 Poison to ALL enemies.', effects: [{ kind: 'status', who: 'allEnemies', id: 'poison', n: 5 }] },
  },
  cripple: {
    name: 'Cripple', type: 'skill', rarity: 'uncommon', cost: 1, target: 'enemy',
    text: "Reduce an enemy's Strength by 2. Exhaust.", exhaust: true,
    effects: [{ kind: 'status', who: 'target', id: 'str', n: -2 }],
    up: { text: "Reduce an enemy's Strength by 3. Exhaust.", effects: [{ kind: 'status', who: 'target', id: 'str', n: -3 }] },
  },
  warCry: {
    name: 'War Cry', type: 'skill', rarity: 'uncommon', cost: 1, target: 'allEnemies',
    text: 'Apply 1 Weak and 1 Vulnerable to ALL enemies.',
    effects: [
      { kind: 'status', who: 'allEnemies', id: 'weak', n: 1 },
      { kind: 'status', who: 'allEnemies', id: 'vulnerable', n: 1 },
    ],
    up: {
      text: 'Apply 2 Weak and 2 Vulnerable to ALL enemies.',
      effects: [
        { kind: 'status', who: 'allEnemies', id: 'weak', n: 2 },
        { kind: 'status', who: 'allEnemies', id: 'vulnerable', n: 2 },
      ],
    },
  },
  fortify: {
    name: 'Fortify', type: 'skill', rarity: 'uncommon', cost: 2, target: 'self',
    text: 'Double your Block.', effects: [{ kind: 'special', id: 'doubleBlock' }],
    up: { cost: 1, text: 'Double your Block.' },
  },
  bloodRite: {
    name: 'Blood Rite', type: 'skill', rarity: 'uncommon', cost: 0, target: 'self',
    text: 'Lose 3 HP. Gain 2 Energy.',
    effects: [{ kind: 'loseHp', n: 3 }, { kind: 'energy', n: 2 }],
    up: { text: 'Lose 3 HP. Gain 3 Energy.', effects: [{ kind: 'loseHp', n: 3 }, { kind: 'energy', n: 3 }] },
  },

  // ---- uncommon powers
  empower: {
    name: 'Empower', type: 'power', rarity: 'uncommon', cost: 1, target: 'self',
    text: 'Gain 2 Strength.', effects: [{ kind: 'status', who: 'self', id: 'str', n: 2 }],
    up: { text: 'Gain 3 Strength.', effects: [{ kind: 'status', who: 'self', id: 'str', n: 3 }] },
  },
  agility: {
    name: 'Agility', type: 'power', rarity: 'uncommon', cost: 1, target: 'self',
    text: 'Gain 2 Dexterity.', effects: [{ kind: 'status', who: 'self', id: 'dex', n: 2 }],
    up: { text: 'Gain 3 Dexterity.', effects: [{ kind: 'status', who: 'self', id: 'dex', n: 3 }] },
  },
  ironSkin: {
    name: 'Iron Skin', type: 'power', rarity: 'uncommon', cost: 1, target: 'self',
    text: 'At the end of your turn, gain 3 Block.',
    effects: [{ kind: 'status', who: 'self', id: 'metallicize', n: 3 }],
    up: { text: 'At the end of your turn, gain 4 Block.', effects: [{ kind: 'status', who: 'self', id: 'metallicize', n: 4 }] },
  },
  regrowth: {
    name: 'Regrowth', type: 'power', rarity: 'uncommon', cost: 1, target: 'self',
    text: 'At the end of your turn, heal 2 HP.',
    effects: [{ kind: 'status', who: 'self', id: 'regen', n: 2 }],
    up: { text: 'At the end of your turn, heal 3 HP.', effects: [{ kind: 'status', who: 'self', id: 'regen', n: 3 }] },
  },

  // ---- rare attacks
  oblivionStrike: {
    name: 'Oblivion Strike', type: 'attack', rarity: 'rare', cost: 3, target: 'enemy',
    text: 'Deal @30@ damage.', effects: [{ kind: 'dmg', n: 30 }],
    up: { text: 'Deal @40@ damage.', effects: [{ kind: 'dmg', n: 40 }] },
  },
  phantomBlades: {
    name: 'Phantom Blades', type: 'attack', rarity: 'rare', cost: 1, target: 'enemy',
    text: 'Deal @3@ damage for each card in your hand.',
    effects: [{ kind: 'special', id: 'phantom', n: 3 }],
    up: { text: 'Deal @4@ damage for each card in your hand.', effects: [{ kind: 'special', id: 'phantom', n: 4 }] },
  },
  devour: {
    name: 'Devour', type: 'attack', rarity: 'rare', cost: 1, target: 'enemy',
    text: 'Deal @10@ damage. If this kills the enemy, gain 3 Max HP. Exhaust.', exhaust: true,
    effects: [{ kind: 'special', id: 'devour', n: 10, maxHp: 3 }],
    up: { text: 'Deal @13@ damage. If this kills the enemy, gain 4 Max HP. Exhaust.', effects: [{ kind: 'special', id: 'devour', n: 13, maxHp: 4 }] },
  },
  annihilate: {
    name: 'Annihilate', type: 'attack', rarity: 'rare', cost: 2, target: 'allEnemies',
    text: 'Deal @9@ damage and apply 3 Poison to ALL enemies.',
    effects: [{ kind: 'dmg', n: 9 }, { kind: 'status', who: 'allEnemies', id: 'poison', n: 3 }],
    up: {
      text: 'Deal @12@ damage and apply 4 Poison to ALL enemies.',
      effects: [{ kind: 'dmg', n: 12 }, { kind: 'status', who: 'allEnemies', id: 'poison', n: 4 }],
    },
  },

  // ---- rare skills
  aegis: {
    name: 'Aegis', type: 'skill', rarity: 'rare', cost: 2, target: 'self',
    text: 'Gain #30# Block. Exhaust.', exhaust: true, effects: [{ kind: 'block', n: 30 }],
    up: { text: 'Gain #40# Block. Exhaust.', effects: [{ kind: 'block', n: 40 }] },
  },
  offering: {
    name: 'Offering', type: 'skill', rarity: 'rare', cost: 0, target: 'self',
    text: 'Lose 6 HP. Gain 2 Energy. Draw 3 cards. Exhaust.', exhaust: true,
    effects: [{ kind: 'loseHp', n: 6 }, { kind: 'energy', n: 2 }, { kind: 'draw', n: 3 }],
    up: {
      text: 'Lose 6 HP. Gain 2 Energy. Draw 5 cards. Exhaust.',
      effects: [{ kind: 'loseHp', n: 6 }, { kind: 'energy', n: 2 }, { kind: 'draw', n: 5 }],
    },
  },
  limitBreak: {
    name: 'Limit Break', type: 'skill', rarity: 'rare', cost: 1, target: 'self',
    text: 'Double your Strength. Exhaust.', exhaust: true,
    effects: [{ kind: 'special', id: 'limitBreak' }],
    up: { text: 'Double your Strength.', exhaust: false },
  },
  catalyst: {
    name: 'Catalyst', type: 'skill', rarity: 'rare', cost: 1, target: 'enemy',
    text: "Double an enemy's Poison. Exhaust.", exhaust: true,
    effects: [{ kind: 'special', id: 'catalyst', n: 2 }],
    up: { text: "Triple an enemy's Poison. Exhaust.", effects: [{ kind: 'special', id: 'catalyst', n: 3 }] },
  },

  // ---- rare powers
  ascension: {
    name: 'Dark Ascension', type: 'power', rarity: 'rare', cost: 3, target: 'self',
    text: 'At the start of each turn, gain 2 Strength.',
    effects: [{ kind: 'status', who: 'self', id: 'ritual', n: 2 }],
    up: { text: 'At the start of each turn, gain 3 Strength.', effects: [{ kind: 'status', who: 'self', id: 'ritual', n: 3 }] },
  },
  bastion: {
    name: 'Bastion', type: 'power', rarity: 'rare', cost: 3, target: 'self',
    text: 'Block no longer expires at the start of your turn.',
    effects: [{ kind: 'status', who: 'self', id: 'barricade', n: 1 }],
    up: { cost: 2 },
  },
  frenzy: {
    name: 'Frenzy', type: 'power', rarity: 'rare', cost: 2, target: 'self',
    text: 'Gain 2 Vulnerable. At the start of each turn, gain 1 Energy.',
    effects: [
      { kind: 'status', who: 'self', id: 'vulnerable', n: 2 },
      { kind: 'status', who: 'self', id: 'energized', n: 1 },
    ],
    up: {
      text: 'Gain 1 Vulnerable. At the start of each turn, gain 1 Energy.',
      effects: [
        { kind: 'status', who: 'self', id: 'vulnerable', n: 1 },
        { kind: 'status', who: 'self', id: 'energized', n: 1 },
      ],
    },
  },
  virulence: {
    name: 'Virulence', type: 'power', rarity: 'rare', cost: 2, target: 'self',
    text: 'Whenever you play an Attack, apply 1 Poison to the enemy.',
    effects: [{ kind: 'status', who: 'self', id: 'venomous', n: 1 }],
    up: { cost: 1 },
  },

  // ---- statuses / curses
  wound: {
    name: 'Wound', type: 'status', rarity: 'special', cost: null, target: 'none',
    text: 'Unplayable.', unplayable: true, effects: [],
  },
  burn: {
    name: 'Burn', type: 'status', rarity: 'special', cost: null, target: 'none',
    text: 'Unplayable. At the end of your turn, take 2 damage if this is in your hand.',
    unplayable: true, endTurnDmg: 2, effects: [],
  },
  hex: {
    name: 'Hex', type: 'curse', rarity: 'special', cost: null, target: 'none',
    text: 'Unplayable. At the end of your turn, lose 1 HP if this is in your hand.',
    unplayable: true, endTurnLoseHp: 1, effects: [],
  },
};

export const CARD_POOLS = (() => {
  const pools = { common: [], uncommon: [], rare: [] };
  for (const [id, c] of Object.entries(CARDS)) if (pools[c.rarity]) pools[c.rarity].push(id);
  return pools;
})();

// ---------------------------------------------------------------- STATUSES (display metadata)
export const STATUS_INFO = {
  str: { name: 'Strength', icon: '⚔', kind: 'buff', desc: 'Attacks deal +N damage.' },
  dex: { name: 'Dexterity', icon: '🛡', kind: 'buff', desc: 'Block cards grant +N Block.' },
  vulnerable: { name: 'Vulnerable', icon: '◎', kind: 'debuff', desc: 'Takes 50% more attack damage. Wears off each turn.' },
  weak: { name: 'Weak', icon: '↓', kind: 'debuff', desc: 'Deals 25% less attack damage. Wears off each turn.' },
  frail: { name: 'Frail', icon: '✖', kind: 'debuff', desc: 'Block gained reduced 25%. Wears off each turn.' },
  poison: { name: 'Poison', icon: '☠', kind: 'debuff', desc: 'Loses N HP at the start of its turn, then Poison drops by 1.' },
  thorns: { name: 'Thorns', icon: '❈', kind: 'buff', desc: 'Attackers take N damage back.' },
  ritual: { name: 'Ritual', icon: '☽', kind: 'buff', desc: 'Gains N Strength at the start of each turn.' },
  metallicize: { name: 'Iron Skin', icon: '⬡', kind: 'buff', desc: 'Gains N Block at the end of each turn.' },
  regen: { name: 'Regen', icon: '❋', kind: 'buff', desc: 'Heals N HP at the end of each turn.' },
  barricade: { name: 'Bastion', icon: '☗', kind: 'buff', desc: 'Block no longer expires.' },
  energized: { name: 'Energized', icon: '✦', kind: 'buff', desc: 'Gain N extra Energy at the start of each turn.' },
  venomous: { name: 'Venomous', icon: '☠', kind: 'buff', desc: 'Attacks apply N Poison.' },
  rampage: { name: 'Rampage', icon: '⤴', kind: 'buff', desc: 'Attack grows stronger with each use.' },
};

// ---------------------------------------------------------------- RELICS
export const RELICS = {
  emberHeart: { name: 'Emberheart', rarity: 'starter', glyph: '♥', tone: '#ff5964', text: 'At the end of combat, heal 6 HP.' },

  basaltIdol: { name: 'Basalt Idol', rarity: 'common', glyph: '☗', tone: '#9aa7b8', text: 'Begin each combat with 10 Block.' },
  warFetish: { name: 'War Fetish', rarity: 'common', glyph: '⚔', tone: '#ff8c5a', text: 'Begin each combat with 1 Strength.' },
  riverPearl: { name: 'River Pearl', rarity: 'common', glyph: '◉', tone: '#6fd6e8', text: 'Begin each combat with 1 Dexterity.' },
  travelersPack: { name: "Traveler's Pack", rarity: 'common', glyph: '⌘', tone: '#c9a86a', text: 'Draw 2 extra cards on your first turn.' },
  emberLantern: { name: 'Ember Lantern', rarity: 'common', glyph: '☀', tone: '#ffd166', text: 'Gain 1 extra Energy on your first turn.' },
  vialOfLife: { name: 'Vial of Life', rarity: 'common', glyph: '♣', tone: '#7ddb8f', text: 'Heal 2 HP at the start of each combat.' },
  thornBand: { name: 'Thorn Band', rarity: 'common', glyph: '❈', tone: '#a3e06c', text: 'Begin each combat with 2 Thorns.' },
  sweetRoot: { name: 'Sweet Root', rarity: 'common', glyph: '✿', tone: '#ff9ecb', text: 'On pickup: gain 8 Max HP.', instant: true },

  gravebloom: { name: 'Gravebloom', rarity: 'uncommon', glyph: '❀', tone: '#b18cff', text: 'After combat, if at or below 50% HP, heal 10.' },
  silkFan: { name: 'Silk Fan', rarity: 'uncommon', glyph: '⛉', tone: '#8fd0ff', text: 'Every 3rd card you play each combat grants 3 Block.' },
  reapersBell: { name: "Reaper's Bell", rarity: 'uncommon', glyph: '♫', tone: '#d8c27a', text: 'When an enemy dies, gain 1 Energy and draw 1 card.' },
  executionersSeal: { name: "Executioner's Seal", rarity: 'uncommon', glyph: '✠', tone: '#ff6b6b', text: 'Every 10th Attack you play deals double damage.' },
  ironTalisman: { name: 'Iron Talisman', rarity: 'uncommon', glyph: '◈', tone: '#c0c8d4', text: 'Every 3rd Attack you play grants 1 Strength.' },
  merchantsMark: { name: "Merchant's Mark", rarity: 'uncommon', glyph: '¤', tone: '#f2c14e', text: 'Shop prices are 25% lower.' },
  seersOrb: { name: "Seer's Orb", rarity: 'uncommon', glyph: '☉', tone: '#9be8d8', text: 'Card rewards offer 1 additional choice.' },

  frozenCore: { name: 'Frozen Core', rarity: 'rare', glyph: '❆', tone: '#a8e6ff', text: 'Unspent Energy carries over between turns.' },
  verdantBranch: { name: 'Verdant Branch', rarity: 'rare', glyph: '⚕', tone: '#7ddb8f', text: 'Whenever a card is Exhausted, draw 1 card.' },
  sunBlossom: { name: 'Sun Blossom', rarity: 'rare', glyph: '❂', tone: '#ffd166', text: 'All healing is increased by 50%.' },
  wardingCharm: { name: 'Warding Charm', rarity: 'rare', glyph: '⛨', tone: '#8fa8ff', text: 'Enemy attacks that would deal 5 or less damage deal 1.' },
  duskmirror: { name: 'Duskmirror', rarity: 'rare', glyph: '◐', tone: '#c99aff', text: 'The first card you play each turn costs 0.' },

  obsidianHeart: { name: 'Obsidian Heart', rarity: 'boss', glyph: '♦', tone: '#b18cff', text: 'Gain 1 Energy each turn. On pickup: lose 8 Max HP.', instant: true },
  philosophersStone: { name: "Philosopher's Stone", rarity: 'boss', glyph: '▣', tone: '#ffd166', text: 'Gain 1 Energy each turn. All enemies start with 1 Strength.' },
  blackBlood: { name: 'Black Blood', rarity: 'boss', glyph: '♥', tone: '#8c1d2f', text: 'Replaces Emberheart. At the end of combat, heal 12 HP.', replaces: 'emberHeart' },
  pandorasBox: { name: "Pandora's Box", rarity: 'boss', glyph: '▩', tone: '#d8a0ff', text: 'On pickup: transform all Strikes and Defends into random cards.', instant: true },
  voidCrown: { name: 'Void Crown', rarity: 'boss', glyph: '♛', tone: '#ff4fd8', text: 'Gain 1 Energy each turn. Start each combat with a Wound in your draw pile.' },
};

export const RELIC_POOLS = (() => {
  const pools = { common: [], uncommon: [], rare: [], boss: [] };
  for (const [id, r] of Object.entries(RELICS)) if (pools[r.rarity]) pools[r.rarity].push(id);
  return pools;
})();

// ---------------------------------------------------------------- POTIONS
export const POTIONS = {
  healing: { name: 'Healing Potion', tone: '#ff6b81', glyph: '♥', text: 'Heal 20 HP.', combatOnly: false },
  strength: { name: 'Potion of Might', tone: '#ff8c5a', glyph: '⚔', text: 'Gain 2 Strength.', combatOnly: true },
  swift: { name: 'Swiftness Draught', tone: '#8fd0ff', glyph: '»', text: 'Draw 3 cards.', combatOnly: true },
  block: { name: 'Stoneskin Tonic', tone: '#9aa7b8', glyph: '☗', text: 'Gain 12 Block.', combatOnly: true },
  fire: { name: 'Flask of Fire', tone: '#ffd166', glyph: '✹', text: 'Deal 20 damage to an enemy.', combatOnly: true, needsTarget: true },
  venom: { name: 'Venom Vial', tone: '#a3e06c', glyph: '☠', text: 'Apply 7 Poison to an enemy.', combatOnly: true, needsTarget: true },
  energy: { name: 'Aether Philter', tone: '#c99aff', glyph: '✦', text: 'Gain 2 Energy.', combatOnly: true },
};

// ---------------------------------------------------------------- ENEMIES
// move: {name, intent, dmg?, times?, block?, heal?, fx?:[{who:'player'|'self'|'allies', id, n}], addCards?:{id,n}}
// ai(ctx) -> move key. ctx: {turn, last, prev, rng, hpFrac}

export const ENEMIES = {
  // ============ ACT 1
  sporeling: {
    name: 'Sporeling', hp: [13, 17], art: { kind: 'wisp', hue: 95, size: 0.72 },
    moves: {
      spit: { name: 'Spore Spit', intent: 'attack', dmg: 4 },
      grow: { name: 'Bloom', intent: 'buff', fx: [{ who: 'self', id: 'str', n: 1 }] },
    },
    ai: ({ turn }) => (turn % 3 === 2 ? 'grow' : 'spit'),
  },
  duskfang: {
    name: 'Duskfang', hp: [26, 30], art: { kind: 'beast', hue: 22, size: 1 },
    moves: {
      howl: { name: 'Howl', intent: 'buff', fx: [{ who: 'self', id: 'str', n: 2 }] },
      bite: { name: 'Bite', intent: 'attack', dmg: 7 },
      rend: { name: 'Rend', intent: 'attack', dmg: 4, times: 2 },
    },
    ai: ({ turn, last, rng }) => {
      if (turn === 1) return 'howl';
      if (last !== 'howl' && rng() < 0.18) return 'howl';
      return last === 'bite' ? 'rend' : 'bite';
    },
  },
  gloomslime: {
    name: 'Gloomslime', hp: [30, 34], art: { kind: 'slime', hue: 150, size: 1 },
    moves: {
      slam: { name: 'Slam', intent: 'attack', dmg: 8 },
      ooze: { name: 'Corrosive Ooze', intent: 'attack_debuff', dmg: 3, fx: [{ who: 'player', id: 'weak', n: 2 }] },
      harden: { name: 'Congeal', intent: 'attack_block', dmg: 4, block: 6 },
    },
    ai: ({ turn }) => ['ooze', 'slam', 'harden'][(turn - 1) % 3],
  },
  waylayer: {
    name: 'Waylayer', hp: [28, 32], art: { kind: 'rogue', hue: 0, size: 0.95 },
    moves: {
      stab: { name: 'Stab', intent: 'attack', dmg: 9 },
      smoke: { name: 'Smokescreen', intent: 'block', block: 8 },
      trick: { name: 'Dirty Trick', intent: 'attack_debuff', dmg: 4, fx: [{ who: 'player', id: 'frail', n: 2 }] },
    },
    ai: ({ turn, rng }) => (turn === 1 ? 'trick' : rng() < 0.55 ? 'stab' : rng() < 0.5 ? 'smoke' : 'trick'),
  },
  thornling: {
    name: 'Thornling', hp: [18, 22], art: { kind: 'plant', hue: 80, size: 0.85 },
    startStatus: { thorns: 2 },
    moves: {
      prick: { name: 'Prick', intent: 'attack', dmg: 6 },
      bristle: { name: 'Bristle', intent: 'buff', fx: [{ who: 'self', id: 'thorns', n: 2 }] },
      burst: { name: 'Spike Burst', intent: 'attack', dmg: 10 },
    },
    ai: ({ turn }) => (turn % 4 === 0 ? 'burst' : turn % 2 === 1 ? 'prick' : 'bristle'),
  },
  ashAcolyte: {
    name: 'Ash Acolyte', hp: [34, 38], art: { kind: 'cultist', hue: 28, size: 1 },
    moves: {
      ritual: { name: 'Dark Ritual', intent: 'buff', fx: [{ who: 'self', id: 'ritual', n: 2 }] },
      scorch: { name: 'Scorch', intent: 'attack', dmg: 6 },
    },
    ai: ({ turn }) => (turn === 1 ? 'ritual' : 'scorch'),
  },
  gravewarden: {
    name: 'Gravewarden', hp: [70, 76], elite: true, art: { kind: 'golem', hue: 210, size: 1.25 },
    moves: {
      crush: { name: 'Crush', intent: 'attack', dmg: 12 },
      entomb: { name: 'Entomb', intent: 'debuff', fx: [{ who: 'player', id: 'frail', n: 2 }, { who: 'player', id: 'vulnerable', n: 2 }] },
      bulwark: { name: 'Bulwark', intent: 'attack_block', dmg: 6, block: 12 },
    },
    ai: ({ turn }) => ['entomb', 'crush', 'bulwark', 'crush'][(turn - 1) % 4],
  },
  alphaFang: {
    name: 'Alpha Duskfang', hp: [64, 70], elite: true, art: { kind: 'beast', hue: 350, size: 1.3 },
    moves: {
      howl: { name: 'Alpha Howl', intent: 'buff', fx: [{ who: 'self', id: 'str', n: 3 }] },
      savage: { name: 'Savage', intent: 'attack', dmg: 5, times: 2 },
      throat: { name: 'Throat Rip', intent: 'attack', dmg: 13 },
    },
    ai: ({ turn, last }) => (turn === 1 || turn % 4 === 0 ? 'howl' : last === 'savage' ? 'throat' : 'savage'),
  },
  rootheart: {
    name: 'The Rootheart', hp: [150, 150], boss: true, art: { kind: 'treeboss', hue: 100, size: 1.6 },
    moves: {
      awaken: { name: 'Awaken', intent: 'buff', block: 10, fx: [{ who: 'self', id: 'str', n: 2 }] },
      lash: { name: 'Root Lash', intent: 'attack', dmg: 12 },
      spores: { name: 'Choking Spores', intent: 'attack_debuff', dmg: 5, fx: [{ who: 'player', id: 'poison', n: 4 }, { who: 'player', id: 'weak', n: 2 }] },
      entangle: { name: 'Entangle', intent: 'attack_debuff', dmg: 7, addCards: { id: 'wound', n: 2 } },
      slam: { name: 'Colossal Slam', intent: 'attack', dmg: 22 },
    },
    ai: ({ turn }) => (turn === 1 ? 'awaken' : turn % 4 === 0 ? 'slam' : ['lash', 'spores', 'entangle'][(turn - 2) % 3]),
  },

  // ============ ACT 2
  drownedOne: {
    name: 'Drowned One', hp: [38, 44], art: { kind: 'zombie', hue: 185, size: 1 },
    moves: {
      claw: { name: 'Claw', intent: 'attack', dmg: 11 },
      frenzy: { name: 'Frenzy', intent: 'attack', dmg: 4, times: 3 },
      gurgle: { name: 'Gurgle', intent: 'attack_debuff', dmg: 5, fx: [{ who: 'player', id: 'weak', n: 2 }] },
    },
    ai: ({ hpFrac, last, rng }) => (hpFrac < 0.5 && last !== 'frenzy' ? 'frenzy' : rng() < 0.6 ? 'claw' : 'gurgle'),
  },
  voltEel: {
    name: 'Voltaic Eel', hp: [30, 36], art: { kind: 'serpent', hue: 190, size: 0.9 },
    moves: {
      shock: { name: 'Shock', intent: 'attack_block', dmg: 7, block: 5 },
      discharge: { name: 'Discharge', intent: 'attack', dmg: 12 },
      coil: { name: 'Coil', intent: 'buff', block: 8, fx: [{ who: 'self', id: 'str', n: 1 }] },
    },
    ai: ({ turn }) => ['shock', 'coil', 'discharge'][(turn - 1) % 3],
  },
  mirelurker: {
    name: 'Mirelurker', hp: [34, 40], art: { kind: 'crawler', hue: 160, size: 0.95 },
    moves: {
      sting: { name: 'Venom Sting', intent: 'attack_debuff', dmg: 6, fx: [{ who: 'player', id: 'poison', n: 3 }] },
      burrow: { name: 'Burrow', intent: 'block', block: 10 },
      barb: { name: 'Barb', intent: 'attack', dmg: 9 },
    },
    ai: ({ turn, rng }) => (turn % 3 === 0 ? 'burrow' : rng() < 0.55 ? 'sting' : 'barb'),
  },
  tidecaller: {
    name: 'Tidecaller', hp: [42, 48], art: { kind: 'cultist', hue: 195, size: 1.05 },
    moves: {
      surge: { name: 'Tidal Blessing', intent: 'buff', fx: [{ who: 'allies', id: 'str', n: 2 }] },
      bolt: { name: 'Water Bolt', intent: 'attack', dmg: 9 },
      undertow: { name: 'Undertow', intent: 'attack_debuff', dmg: 4, fx: [{ who: 'player', id: 'frail', n: 2 }] },
    },
    ai: ({ turn }) => (turn === 1 ? 'surge' : turn % 3 === 0 ? 'undertow' : 'bolt'),
  },
  shellback: {
    name: 'Shellback', hp: [50, 56], art: { kind: 'crab', hue: 15, size: 1.15 },
    moves: {
      snap: { name: 'Snap', intent: 'attack', dmg: 10 },
      shell: { name: 'Shell Up', intent: 'block', block: 13, fx: [{ who: 'self', id: 'thorns', n: 1 }] },
      jet: { name: 'Water Jet', intent: 'attack', dmg: 6, times: 2 },
    },
    ai: ({ turn }) => ['snap', 'shell', 'jet', 'shell'][(turn - 1) % 4],
  },
  deepmaw: {
    name: 'Deepmaw', hp: [54, 60], art: { kind: 'maw', hue: 200, size: 1.2 },
    moves: {
      bite: { name: 'Bite', intent: 'attack', dmg: 14 },
      lure: { name: 'Luminous Lure', intent: 'debuff', fx: [{ who: 'player', id: 'vulnerable', n: 2 }] },
      swallow: { name: 'Swallow', intent: 'attack_buff', dmg: 8, heal: 8 },
    },
    ai: ({ turn }) => ['lure', 'bite', 'swallow'][(turn - 1) % 3],
  },
  abyssalKnight: {
    name: 'Abyssal Knight', hp: [108, 116], elite: true, art: { kind: 'knight', hue: 215, size: 1.3 },
    moves: {
      blade: { name: 'Voidblade', intent: 'attack', dmg: 15 },
      oath: { name: 'Dark Oath', intent: 'buff', block: 14, fx: [{ who: 'self', id: 'str', n: 2 }] },
      condemn: { name: 'Condemn', intent: 'debuff', fx: [{ who: 'player', id: 'vulnerable', n: 2 }, { who: 'player', id: 'weak', n: 2 }] },
      execute: { name: 'Execute', intent: 'attack', dmg: 9, times: 2 },
    },
    ai: ({ turn }) => ['condemn', 'blade', 'oath', 'execute'][(turn - 1) % 4],
  },
  siren: {
    name: 'Siren', hp: [92, 100], elite: true, art: { kind: 'siren', hue: 280, size: 1.15 },
    moves: {
      song: { name: 'Dirge', intent: 'debuff', fx: [{ who: 'player', id: 'weak', n: 2 }, { who: 'player', id: 'frail', n: 2 }] },
      rend: { name: 'Talon Rend', intent: 'attack', dmg: 12 },
      mend: { name: 'Mend', intent: 'heal', heal: 12, block: 6 },
      shriek: { name: 'Shriek', intent: 'attack', dmg: 7, times: 2 },
    },
    ai: ({ turn, hpFrac, last }) => {
      if (hpFrac < 0.55 && last !== 'mend') return 'mend';
      return ['song', 'rend', 'shriek'][(turn - 1) % 3];
    },
  },
  leviathan: {
    name: "Leviathan's Maw", hp: [260, 260], boss: true, art: { kind: 'leviathan', hue: 195, size: 1.7 },
    moves: {
      tide: { name: 'Rising Tide', intent: 'buff', block: 15, fx: [{ who: 'self', id: 'str', n: 1 }] },
      crush: { name: 'Crushing Jaws', intent: 'attack', dmg: 17 },
      brine: { name: 'Black Brine', intent: 'attack_debuff', dmg: 6, fx: [{ who: 'player', id: 'poison', n: 5 }, { who: 'player', id: 'weak', n: 2 }] },
      consume: { name: 'Consume the Deep', intent: 'heal', heal: 20, block: 10 },
      cataclysm: { name: 'Cataclysm', intent: 'attack', dmg: 30 },
    },
    ai: ({ turn }) => (turn === 1 ? 'tide' : turn % 4 === 0 ? 'cataclysm' : ['crush', 'brine', 'consume'][(turn - 2) % 3]),
  },

  // ============ ACT 3
  voidWisp: {
    name: 'Void Wisp', hp: [26, 30], art: { kind: 'wisp', hue: 275, size: 0.78 },
    moves: {
      zap: { name: 'Void Zap', intent: 'attack', dmg: 7 },
      siphon: { name: 'Siphon', intent: 'attack_buff', dmg: 5, heal: 5 },
    },
    ai: ({ rng }) => (rng() < 0.6 ? 'zap' : 'siphon'),
  },
  obsidianGolem: {
    name: 'Obsidian Golem', hp: [64, 72], art: { kind: 'golem', hue: 270, size: 1.3 },
    moves: {
      pound: { name: 'Pound', intent: 'attack', dmg: 14 },
      harden: { name: 'Harden', intent: 'block', block: 14 },
      quake: { name: 'Quake', intent: 'attack_debuff', dmg: 10, fx: [{ who: 'player', id: 'frail', n: 2 }] },
    },
    ai: ({ turn }) => ['pound', 'harden', 'quake'][(turn - 1) % 3],
  },
  starCultist: {
    name: 'Star Cultist', hp: [46, 52], art: { kind: 'cultist', hue: 290, size: 1.05 },
    moves: {
      ritual: { name: 'Star Ritual', intent: 'buff', fx: [{ who: 'self', id: 'ritual', n: 3 }] },
      scorch: { name: 'Starfire', intent: 'attack', dmg: 9 },
    },
    ai: ({ turn }) => (turn === 1 ? 'ritual' : 'scorch'),
  },
  shade: {
    name: 'Shade', hp: [42, 48], art: { kind: 'shade', hue: 260, size: 1 },
    moves: {
      slash: { name: 'Dual Slash', intent: 'attack', dmg: 6, times: 2 },
      gloom: { name: 'Gloom', intent: 'attack_debuff', dmg: 6, fx: [{ who: 'player', id: 'weak', n: 2 }] },
      vanish: { name: 'Vanish', intent: 'block', block: 12 },
    },
    ai: ({ turn, rng }) => (turn % 3 === 0 ? 'vanish' : rng() < 0.5 ? 'slash' : 'gloom'),
  },
  chaosHound: {
    name: 'Chaos Hound', hp: [56, 64], art: { kind: 'beast', hue: 315, size: 1.1 },
    startStatus: { rampage: 1 },
    moves: {
      bite: { name: 'Chaos Bite', intent: 'attack', dmg: 9, ramp: 3 },
      howl: { name: 'Warp Howl', intent: 'buff', fx: [{ who: 'self', id: 'str', n: 2 }] },
    },
    ai: ({ turn }) => (turn % 4 === 0 ? 'howl' : 'bite'),
  },
  watcherEye: {
    name: 'Watcher Eye', hp: [48, 56], art: { kind: 'eye', hue: 250, size: 1.05 },
    moves: {
      gaze: { name: 'Piercing Gaze', intent: 'attack_debuff', dmg: 8, fx: [{ who: 'player', id: 'vulnerable', n: 2 }] },
      beam: { name: 'Ruin Beam', intent: 'attack', dmg: 15 },
      blink: { name: 'Blink', intent: 'attack_block', dmg: 5, block: 10 },
    },
    ai: ({ turn }) => ['gaze', 'beam', 'blink'][(turn - 1) % 3],
  },
  voidColossus: {
    name: 'Voidforged Colossus', hp: [155, 168], elite: true, art: { kind: 'golem', hue: 305, size: 1.5 },
    moves: {
      slam: { name: 'Void Slam', intent: 'attack', dmg: 20 },
      fortify: { name: 'Fortify', intent: 'buff', block: 18, fx: [{ who: 'self', id: 'str', n: 2 }] },
      shatter: { name: 'Shatter', intent: 'attack_debuff', dmg: 8, fx: [{ who: 'player', id: 'frail', n: 3 }] },
    },
    ai: ({ turn }) => ['shatter', 'slam', 'fortify', 'slam'][(turn - 1) % 4],
  },
  heraldOfEnd: {
    name: 'Herald of the End', hp: [128, 142], elite: true, art: { kind: 'shade', hue: 335, size: 1.4 },
    moves: {
      doom: { name: 'Doomsong', intent: 'debuff', fx: [{ who: 'player', id: 'poison', n: 7 }] },
      reave: { name: 'Reave', intent: 'attack', dmg: 16 },
      flame: { name: 'Black Flame', intent: 'attack', dmg: 8, times: 2 },
      rise: { name: 'Apotheosis', intent: 'buff', fx: [{ who: 'self', id: 'str', n: 3 }] },
    },
    ai: ({ turn }) => (turn % 4 === 0 ? 'rise' : ['doom', 'reave', 'flame'][(turn - 1) % 3]),
  },
  sovereign: {
    name: 'The Eternal Sovereign', hp: [330, 330], boss: true, art: { kind: 'sovereign', hue: 285, size: 1.8 },
    moves: {
      scepter: { name: 'Scepter Strike', intent: 'attack', dmg: 18 },
      gravitas: { name: 'Gravitas', intent: 'buff', block: 20, fx: [{ who: 'self', id: 'str', n: 2 }] },
      starfall: { name: 'Starfall', intent: 'attack', dmg: 11, times: 2 },
      ruin: { name: 'Word of Ruin', intent: 'attack_debuff', dmg: 4, fx: [{ who: 'player', id: 'poison', n: 4 }, { who: 'player', id: 'weak', n: 2 }, { who: 'player', id: 'frail', n: 2 }] },
      ascend: { name: 'Ascend', intent: 'buff', block: 30, fx: [{ who: 'self', id: 'str', n: 4 }] },
      annihilation: { name: 'Annihilation', intent: 'attack', dmg: 34 },
    },
    ai: (ctx) => {
      const e = ctx.self;
      if (ctx.hpFrac <= 0.5 && !e.flags.ascended) { e.flags.ascended = true; return 'ascend'; }
      if (e.flags.ascended) {
        e.flags.p2 = (e.flags.p2 || 0) + 1;
        return e.flags.p2 % 3 === 0 ? 'annihilation' : ['scepter', 'starfall', 'ruin', 'gravitas'][e.flags.p2 % 4];
      }
      return ['scepter', 'gravitas', 'starfall', 'ruin'][(ctx.turn - 1) % 4];
    },
  },
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
  forgottenShrine: {
    name: 'Forgotten Shrine', glyph: '⛩', hue: 45,
    text: 'A moss-eaten shrine hums with old power. Offerings of bone and silver litter its base. Something watches from inside the stone.',
    choices: [
      { label: 'Pray', sub: 'Remove a card from your deck.', ops: [{ pickRemove: true }] },
      { label: 'Desecrate', sub: 'Gain 90 gold. Gain a Hex.', ops: [{ gold: 90 }, { addCard: 'hex' }] },
      { label: 'Leave', sub: '', ops: [] },
    ],
  },
  woundedKnight: {
    name: 'The Wounded Knight', glyph: '⚔', hue: 210,
    text: 'A knight slumps against a shattered pillar, breath rattling behind a crushed visor. One gauntlet clutches a relic; the other beckons you closer.',
    choices: [
      { label: 'Aid him', sub: 'Lose 8 HP. He rewards you with a relic.', ops: [{ hp: -8 }, { addRelic: 'random' }] },
      { label: 'Loot him', sub: 'Gain 65 gold. Gain a Hex.', ops: [{ gold: 65 }, { addCard: 'hex' }] },
      { label: 'Leave', sub: '', ops: [] },
    ],
  },
  voidChest: {
    name: 'Humming Chest', glyph: '▣', hue: 280,
    text: 'A black iron chest sits alone in the gloom, humming a note you feel in your teeth. Its lock is already broken.',
    choices: [
      {
        label: 'Open it', sub: 'It might hold a relic... or teeth.',
        ops: [{ roll: [{ p: 0.55, ops: [{ addRelic: 'random' }], text: 'Inside: a relic, warm as a heartbeat.' }, { p: 0.45, ops: [{ hp: -12 }], text: 'Teeth. You pull back a mangled hand. (-12 HP)' }] }],
      },
      { label: 'Leave', sub: '', ops: [] },
    ],
  },
  emberFountain: {
    name: 'Fountain of Embers', glyph: '❂', hue: 30,
    text: 'Liquid light pools in a cracked basin, throwing sparks that do not burn. It smells of summer and old victories.',
    choices: [
      { label: 'Bathe', sub: 'Heal 35% of your Max HP.', ops: [{ heal: 0.35 }] },
      { label: 'Bottle it', sub: 'Gain a Healing Potion.', ops: [{ potion: 'healing' }] },
      { label: 'Leave', sub: '', ops: [] },
    ],
  },
  forge: {
    name: 'The Forgotten Forge', glyph: '⚒', hue: 15,
    text: 'An anvil of black star-metal, still warm. Hammers hang in racks, waiting for hands that died an age ago.',
    choices: [
      { label: 'Temper', sub: 'Upgrade a card.', ops: [{ pickUpgrade: true }] },
      { label: 'Leave', sub: '', ops: [] },
    ],
  },
  gambler: {
    name: 'The Bone Gambler', glyph: '⚄', hue: 50,
    text: 'A grinning figure rattles a cup of knuckle-bones. "One throw, stranger. Fortune loves the reckless."',
    choices: [
      {
        label: 'Bet 40 gold', sub: '45% chance to win 110 gold.', needGold: 40,
        ops: [{ gold: -40 }, { roll: [{ p: 0.45, ops: [{ gold: 110 }], text: 'The bones land your way. +110 gold.' }, { p: 0.55, ops: [], text: 'The bones betray you. The gambler grins wider.' }] }],
      },
      { label: 'Walk away', sub: '', ops: [] },
    ],
  },
  mirror: {
    name: 'The Silvered Mirror', glyph: '◐', hue: 220,
    text: 'A tall mirror stands in the rubble, unbroken. Your reflection moves half a breath behind you — and it is smiling.',
    choices: [
      { label: 'Reflect', sub: 'Duplicate a card in your deck.', ops: [{ pickDuplicate: true }] },
      { label: 'Shatter it', sub: 'Lose 6 HP. Remove a card from your deck.', ops: [{ hp: -6 }, { pickRemove: true }] },
      { label: 'Leave', sub: '', ops: [] },
    ],
  },
  library: {
    name: 'The Drowned Library', glyph: '❦', hue: 190,
    text: 'Shelves of waterlogged grimoires stretch into the dark. Most are pulp — but a few pages still glow faintly.',
    choices: [
      { label: 'Study', sub: 'Choose 1 of 5 cards to add to your deck.', ops: [{ pickCard: 5 }] },
      { label: 'Rest among the stacks', sub: 'Heal 20% of your Max HP.', ops: [{ heal: 0.2 }] },
    ],
  },
  fleshTrader: {
    name: 'The Flesh Trader', glyph: '♠', hue: 320,
    text: '"Vitality is a currency," purrs a thing wearing a merchant\'s coat. "And you look flush with it." Long fingers open to reveal a relic.',
    choices: [
      { label: 'Trade', sub: 'Lose 8 Max HP. Gain a relic.', ops: [{ maxHp: -8 }, { addRelic: 'random' }] },
      { label: 'Refuse', sub: '', ops: [] },
    ],
  },
  cursedIdol: {
    name: 'The Cursed Idol', glyph: '☿', hue: 100,
    text: 'A jade idol sits on a plinth of skulls, radiating a soft warmth. It has clearly been left here for a reason.',
    choices: [
      { label: 'Take it', sub: 'Gain a relic. Gain a Hex.', ops: [{ addRelic: 'random' }, { addCard: 'hex' }] },
      { label: 'Leave it', sub: '', ops: [] },
    ],
  },
  ruinedCamp: {
    name: 'Ruined Camp', glyph: '⛺', hue: 35,
    text: 'A campfire, still smoldering. Bedrolls, torn. Whoever slept here left in a hurry — and left their packs behind.',
    choices: [
      { label: 'Rest', sub: 'Heal 15% of your Max HP.', ops: [{ heal: 0.15 }] },
      { label: 'Scavenge', sub: 'Gain 45 gold and a random potion.', ops: [{ gold: 45 }, { potion: 'random' }] },
    ],
  },
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
