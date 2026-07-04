// SPIREBOUND — all game content. Pure data, no DOM.

export const PLAYER = {
  id: 'duskblade',
  name: 'The Duskblade',
  blurb: 'Glass honed to a killing edge. Strikes, shatters, and turns broken facets into fuel — a versatile climber for any night.',
  hue: 225, art: 'flare',
  maxHp: 72,
  energy: 3,
  handSize: 5,
  potionSlots: 3,
  startDeck: ['strike', 'strike', 'strike', 'strike', 'defend', 'defend', 'defend', 'eclipseSlash', 'chisel', 'firstSpark'],
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
    name: 'Edge', type: 'attack', rarity: 'starter', cost: 1, target: 'enemy',
    text: 'Deal @6@ damage.', effects: [{ kind: 'dmg', n: 6 }],
    up: { text: 'Deal @9@ damage.', effects: [{ kind: 'dmg', n: 9 }] },
  },
  defend: {
    name: 'Ward', type: 'skill', rarity: 'starter', cost: 1, target: 'self',
    text: 'Gain #5# Ward.', effects: [{ kind: 'block', n: 5 }],
    up: { text: 'Gain #8# Ward.', effects: [{ kind: 'block', n: 8 }] },
  },
  eclipseSlash: {
    name: 'Eclipse Slash', type: 'attack', rarity: 'starter', cost: 1, target: 'enemy',
    text: 'Deal @7@ damage. Apply 1 Cracked.',
    effects: [{ kind: 'dmg', n: 7 }, { kind: 'status', who: 'target', id: 'vulnerable', n: 1 }],
    up: {
      text: 'Deal @9@ damage. Apply 2 Cracked.',
      effects: [{ kind: 'dmg', n: 9 }, { kind: 'status', who: 'target', id: 'vulnerable', n: 2 }],
    },
  },
  chisel: {
    name: 'Chisel', type: 'attack', rarity: 'starter', cost: 1, target: 'enemy', chip: 1,
    text: 'Deal @4@ damage. Chip 1 extra Facet.',
    effects: [{ kind: 'dmg', n: 4 }],
    up: { text: 'Deal @7@ damage. Chip 1 extra Facet.', effects: [{ kind: 'dmg', n: 7 }] },
  },
  firstSpark: {
    name: 'First Spark', type: 'skill', rarity: 'starter', cost: 0, target: 'self',
    text: 'Draw 1 card. Kindle.', exhaust: true, effects: [{ kind: 'draw', n: 1 }],
    up: { text: 'Draw 2 cards. Kindle.', effects: [{ kind: 'draw', n: 2 }] },
  },
  // ---- Ashwarden starters
  ashBite: {
    name: 'Ashbite', type: 'attack', rarity: 'starter', cost: 1, target: 'enemy',
    text: 'Deal @5@ damage. Apply 2 Smolder.',
    effects: [{ kind: 'dmg', n: 5 }, { kind: 'status', who: 'target', id: 'poison', n: 2 }],
    up: { text: 'Deal @7@ damage. Apply 3 Smolder.', effects: [{ kind: 'dmg', n: 7 }, { kind: 'status', who: 'target', id: 'poison', n: 3 }] },
  },
  smother: {
    name: 'Smother', type: 'skill', rarity: 'starter', cost: 1, target: 'enemy',
    text: 'Gain #5# Ward. Apply 2 Smolder.',
    effects: [{ kind: 'block', n: 5 }, { kind: 'status', who: 'target', id: 'poison', n: 2 }],
    up: { text: 'Gain #8# Ward. Apply 3 Smolder.', effects: [{ kind: 'block', n: 8 }, { kind: 'status', who: 'target', id: 'poison', n: 3 }] },
  },

  // ---- common attacks
  twinFangs: {
    name: 'Twin Shards', type: 'attack', rarity: 'common', cost: 1, target: 'enemy',
    text: 'Deal @4@ damage twice.', effects: [{ kind: 'dmg', n: 4, times: 2 }],
    up: { text: 'Deal @6@ damage twice.', effects: [{ kind: 'dmg', n: 6, times: 2 }] },
  },
  quickSlash: {
    name: 'Flicker', type: 'attack', rarity: 'common', cost: 0, target: 'enemy',
    text: 'Deal @4@ damage. Draw 1 card.', effects: [{ kind: 'dmg', n: 4 }, { kind: 'draw', n: 1 }],
    up: { text: 'Deal @6@ damage. Draw 1 card.', effects: [{ kind: 'dmg', n: 6 }, { kind: 'draw', n: 1 }] },
  },
  heavyBlow: {
    name: 'Quarry Maul', type: 'attack', rarity: 'common', cost: 2, target: 'enemy', chip: 1,
    text: 'Deal @12@ damage. Chip 1 extra Facet.',
    effects: [{ kind: 'dmg', n: 12 }],
    up: { text: 'Deal @16@ damage. Chip 2 extra Facets.', chip: 2, effects: [{ kind: 'dmg', n: 16 }] },
  },
  cleave: {
    name: 'Fan of Glass', type: 'attack', rarity: 'common', cost: 1, target: 'allEnemies',
    text: 'Deal @6@ damage to ALL enemies.', effects: [{ kind: 'dmg', n: 6 }],
    up: { text: 'Deal @9@ damage to ALL enemies.', effects: [{ kind: 'dmg', n: 9 }] },
  },
  venomStrike: {
    name: 'Emberbite', type: 'attack', rarity: 'common', cost: 1, target: 'enemy',
    text: 'Deal @4@ damage. Apply 3 Smolder.',
    effects: [{ kind: 'dmg', n: 4 }, { kind: 'status', who: 'target', id: 'poison', n: 3 }],
    up: {
      text: 'Deal @6@ damage. Apply 4 Smolder.',
      effects: [{ kind: 'dmg', n: 6 }, { kind: 'status', who: 'target', id: 'poison', n: 4 }],
    },
  },
  lunge: {
    name: 'Dimming Cut', type: 'attack', rarity: 'common', cost: 1, target: 'enemy',
    text: 'Deal @6@ damage. Apply 1 Dimmed.',
    effects: [{ kind: 'dmg', n: 6 }, { kind: 'status', who: 'target', id: 'weak', n: 1 }],
    up: {
      text: 'Deal @9@ damage. Apply 2 Dimmed.',
      effects: [{ kind: 'dmg', n: 9 }, { kind: 'status', who: 'target', id: 'weak', n: 2 }],
    },
  },
  guardedStrike: {
    name: "Warden's Edge", type: 'attack', rarity: 'common', cost: 1, target: 'enemy',
    text: 'Deal @5@ damage. Gain #4# Ward.',
    effects: [{ kind: 'dmg', n: 5 }, { kind: 'block', n: 4 }],
    up: {
      text: 'Deal @7@ damage. Gain #6# Ward.',
      effects: [{ kind: 'dmg', n: 7 }, { kind: 'block', n: 6 }],
    },
  },

  // ---- common skills
  brace: {
    name: 'Held Light', type: 'skill', rarity: 'common', cost: 1, target: 'self',
    text: 'Gain #8# Ward.', effects: [{ kind: 'block', n: 8 }],
    up: { text: 'Gain #11# Ward.', effects: [{ kind: 'block', n: 11 }] },
  },
  sidestep: {
    name: 'Glasstep', type: 'skill', rarity: 'common', cost: 0, target: 'self',
    text: 'Gain #3# Ward. Draw 1 card.', effects: [{ kind: 'block', n: 3 }, { kind: 'draw', n: 1 }],
    up: { text: 'Gain #5# Ward. Draw 1 card.', effects: [{ kind: 'block', n: 5 }, { kind: 'draw', n: 1 }] },
  },
  preparation: {
    name: 'Tinder', type: 'skill', rarity: 'common', cost: 0, target: 'self',
    text: 'Draw 2 cards. Kindle.', exhaust: true, effects: [{ kind: 'draw', n: 2 }],
    up: { text: 'Draw 2 cards.', exhaust: false, effects: [{ kind: 'draw', n: 2 }] },
  },
  deflect: {
    name: 'Refract', type: 'skill', rarity: 'common', cost: 1, target: 'self',
    text: 'Gain #6# Ward. Draw 1 card.', effects: [{ kind: 'block', n: 6 }, { kind: 'draw', n: 1 }],
    up: { text: 'Gain #9# Ward. Draw 1 card.', effects: [{ kind: 'block', n: 9 }, { kind: 'draw', n: 1 }] },
  },

  // ---- uncommon attacks
  leechBlade: {
    name: 'Thirsting Shard', type: 'attack', rarity: 'uncommon', cost: 2, target: 'enemy',
    text: 'Deal @9@ damage. Heal for half the unblocked damage.',
    effects: [{ kind: 'special', id: 'leech', n: 9 }],
    up: { text: 'Deal @13@ damage. Heal for half the unblocked damage.', effects: [{ kind: 'special', id: 'leech', n: 13 }] },
  },
  tempest: {
    name: 'Hailglass', type: 'attack', rarity: 'uncommon', cost: 2, target: 'allEnemies',
    text: 'Deal @4@ damage to ALL enemies twice.', effects: [{ kind: 'dmg', n: 4, times: 2 }],
    up: { text: 'Deal @6@ damage to ALL enemies twice.', effects: [{ kind: 'dmg', n: 6, times: 2 }] },
  },
  uppercut: {
    name: 'Ringing Blow', type: 'attack', rarity: 'uncommon', cost: 2, target: 'enemy', chip: 1,
    text: 'Deal @10@ damage. Chip 1 extra Facet. Apply 1 Dimmed.',
    effects: [
      { kind: 'dmg', n: 10 },
      { kind: 'status', who: 'target', id: 'weak', n: 1 },
    ],
    up: {
      text: 'Deal @13@ damage. Chip 2 extra Facets. Apply 2 Dimmed.', chip: 2,
      effects: [
        { kind: 'dmg', n: 13 },
        { kind: 'status', who: 'target', id: 'weak', n: 2 },
      ],
    },
  },
  flurry: {
    name: 'Splinterstorm', type: 'attack', rarity: 'uncommon', cost: 1, target: 'enemy',
    text: 'Deal @2@ damage 3 times.', effects: [{ kind: 'dmg', n: 2, times: 3 }],
    up: { text: 'Deal @3@ damage 3 times.', effects: [{ kind: 'dmg', n: 3, times: 3 }] },
  },
  executioner: {
    name: 'Faultline', type: 'attack', rarity: 'uncommon', cost: 1, target: 'enemy',
    text: 'Deal @8@ damage. Cracked enemies take 6 more.',
    effects: [{ kind: 'special', id: 'execute', n: 8, bonus: 6 }],
    up: { text: 'Deal @11@ damage. Cracked enemies take 8 more.', effects: [{ kind: 'special', id: 'execute', n: 11, bonus: 8 }] },
  },
  momentum: {
    name: 'Honing Edge', type: 'attack', rarity: 'uncommon', cost: 1, target: 'enemy',
    text: 'Deal @6@ damage. Each play, this card gains +4 damage this combat.',
    effects: [{ kind: 'special', id: 'momentum', n: 6, grow: 4 }],
    up: { text: 'Deal @8@ damage. Each play, this card gains +6 damage this combat.', effects: [{ kind: 'special', id: 'momentum', n: 8, grow: 6 }] },
  },

  // ---- uncommon skills
  bulwark: {
    name: 'Glasswall', type: 'skill', rarity: 'uncommon', cost: 2, target: 'self',
    text: 'Gain #13# Ward.', effects: [{ kind: 'block', n: 13 }],
    up: { text: 'Gain #18# Ward.', effects: [{ kind: 'block', n: 18 }] },
  },
  surge: {
    name: 'Struck Match', type: 'skill', rarity: 'uncommon', cost: 0, target: 'self',
    text: 'Gain 1 Energy. Draw 1 card. Kindle.', exhaust: true,
    effects: [{ kind: 'energy', n: 1 }, { kind: 'draw', n: 1 }],
    up: { text: 'Gain 2 Energy. Draw 1 card. Kindle.', effects: [{ kind: 'energy', n: 2 }, { kind: 'draw', n: 1 }] },
  },
  toxicMist: {
    name: 'Ashcloud', type: 'skill', rarity: 'uncommon', cost: 1, target: 'allEnemies',
    text: 'Apply 3 Smolder to ALL enemies.',
    effects: [{ kind: 'status', who: 'allEnemies', id: 'poison', n: 3 }],
    up: { text: 'Apply 5 Smolder to ALL enemies.', effects: [{ kind: 'status', who: 'allEnemies', id: 'poison', n: 5 }] },
  },
  cripple: {
    name: 'Gutter', type: 'skill', rarity: 'uncommon', cost: 1, target: 'enemy',
    text: "Snuff an enemy's fire: it loses 2 Fervor. Kindle.", exhaust: true,
    effects: [{ kind: 'status', who: 'target', id: 'str', n: -2 }],
    up: { text: "Snuff an enemy's fire: it loses 3 Fervor. Kindle.", effects: [{ kind: 'status', who: 'target', id: 'str', n: -3 }] },
  },
  warCry: {
    name: 'Shatterhymn', type: 'skill', rarity: 'uncommon', cost: 1, target: 'allEnemies',
    text: 'Apply 1 Dimmed and 1 Cracked to ALL enemies.',
    effects: [
      { kind: 'status', who: 'allEnemies', id: 'weak', n: 1 },
      { kind: 'status', who: 'allEnemies', id: 'vulnerable', n: 1 },
    ],
    up: {
      text: 'Apply 2 Dimmed and 2 Cracked to ALL enemies.',
      effects: [
        { kind: 'status', who: 'allEnemies', id: 'weak', n: 2 },
        { kind: 'status', who: 'allEnemies', id: 'vulnerable', n: 2 },
      ],
    },
  },
  fortify: {
    name: 'Mirrorlight', type: 'skill', rarity: 'uncommon', cost: 2, target: 'self',
    text: 'Double your Ward.', effects: [{ kind: 'special', id: 'doubleBlock' }],
    up: { cost: 1, text: 'Double your Ward.' },
  },
  bloodRite: {
    name: 'Blood for Oil', type: 'skill', rarity: 'uncommon', cost: 0, target: 'self',
    text: 'Lose 3 HP. Gain 2 Energy.',
    effects: [{ kind: 'loseHp', n: 3 }, { kind: 'energy', n: 2 }],
    up: { text: 'Lose 3 HP. Gain 3 Energy.', effects: [{ kind: 'loseHp', n: 3 }, { kind: 'energy', n: 3 }] },
  },

  // ---- uncommon powers
  empower: {
    name: 'Inner Blaze', type: 'power', rarity: 'uncommon', cost: 1, target: 'self',
    text: 'Gain 2 Fervor.', effects: [{ kind: 'status', who: 'self', id: 'str', n: 2 }],
    up: { text: 'Gain 3 Fervor.', effects: [{ kind: 'status', who: 'self', id: 'str', n: 3 }] },
  },
  agility: {
    name: "Glazier's Poise", type: 'power', rarity: 'uncommon', cost: 1, target: 'self',
    text: 'Gain 2 Poise.', effects: [{ kind: 'status', who: 'self', id: 'dex', n: 2 }],
    up: { text: 'Gain 3 Poise.', effects: [{ kind: 'status', who: 'self', id: 'dex', n: 3 }] },
  },
  ironSkin: {
    name: 'Vitrify', type: 'power', rarity: 'uncommon', cost: 1, target: 'self',
    text: 'At the end of your turn, gain 3 Ward.',
    effects: [{ kind: 'status', who: 'self', id: 'metallicize', n: 3 }],
    up: { text: 'At the end of your turn, gain 4 Ward.', effects: [{ kind: 'status', who: 'self', id: 'metallicize', n: 4 }] },
  },
  regrowth: {
    name: 'Hearthglow', type: 'power', rarity: 'uncommon', cost: 1, target: 'self',
    text: 'At the end of your turn, heal 2 HP.',
    effects: [{ kind: 'status', who: 'self', id: 'regen', n: 2 }],
    up: { text: 'At the end of your turn, heal 3 HP.', effects: [{ kind: 'status', who: 'self', id: 'regen', n: 3 }] },
  },

  // ---- rare attacks
  oblivionStrike: {
    name: 'Bellstrike', type: 'attack', rarity: 'rare', cost: 3, target: 'enemy', chip: 2,
    text: 'Deal @30@ damage. Chip 2 extra Facets.', effects: [{ kind: 'dmg', n: 30 }],
    up: { text: 'Deal @40@ damage. Chip 3 extra Facets.', chip: 3, effects: [{ kind: 'dmg', n: 40 }] },
  },
  phantomBlades: {
    name: 'Phantom Blades', type: 'attack', rarity: 'rare', cost: 1, target: 'enemy',
    text: 'Deal @3@ damage for each card in your hand.',
    effects: [{ kind: 'special', id: 'phantom', n: 3 }],
    up: { text: 'Deal @4@ damage for each card in your hand.', effects: [{ kind: 'special', id: 'phantom', n: 4 }] },
  },
  devour: {
    name: 'Eat the Flame', type: 'attack', rarity: 'rare', cost: 1, target: 'enemy',
    text: 'Deal @10@ damage. If this kills, swallow its fire: gain 3 Embers and heal 4. Kindle.', exhaust: true,
    effects: [{ kind: 'special', id: 'devour', n: 10, embers: 3, heal: 4 }],
    up: { text: 'Deal @13@ damage. If this kills, swallow its fire: gain 4 Embers and heal 6. Kindle.', effects: [{ kind: 'special', id: 'devour', n: 13, embers: 4, heal: 6 }] },
  },
  annihilate: {
    name: 'Requiem', type: 'attack', rarity: 'rare', cost: 2, target: 'allEnemies',
    text: 'Deal @9@ damage and apply 3 Smolder to ALL enemies.',
    effects: [{ kind: 'dmg', n: 9 }, { kind: 'status', who: 'allEnemies', id: 'poison', n: 3 }],
    up: {
      text: 'Deal @12@ damage and apply 4 Smolder to ALL enemies.',
      effects: [{ kind: 'dmg', n: 12 }, { kind: 'status', who: 'allEnemies', id: 'poison', n: 4 }],
    },
  },

  // ---- rare skills
  aegis: {
    name: 'Cathedral Glass', type: 'skill', rarity: 'rare', cost: 2, target: 'self',
    text: 'Gain #30# Ward. Kindle.', exhaust: true, effects: [{ kind: 'block', n: 30 }],
    up: { text: 'Gain #40# Ward. Kindle.', effects: [{ kind: 'block', n: 40 }] },
  },
  offering: {
    name: 'Pyre Tithe', type: 'skill', rarity: 'rare', cost: 1, target: 'self',
    text: 'Burn every other card in your hand — each feeds the lantern. Draw 3 cards. Kindle.', exhaust: true,
    effects: [{ kind: 'special', id: 'pyreTithe', draw: 3 }],
    up: {
      text: 'Burn every other card in your hand — each feeds the lantern. Draw 4 cards. Kindle.',
      effects: [{ kind: 'special', id: 'pyreTithe', draw: 4 }],
    },
  },
  limitBreak: {
    name: 'Annealing Rite', type: 'skill', rarity: 'rare', cost: 1, target: 'allEnemies',
    text: 'Chip 2 Facets of every enemy. Kindle.', exhaust: true,
    effects: [{ kind: 'chip', n: 2 }],
    up: { text: 'Chip 3 Facets of every enemy. Kindle.', effects: [{ kind: 'chip', n: 3 }] },
  },
  catalyst: {
    name: 'Bellows', type: 'skill', rarity: 'rare', cost: 1, target: 'enemy',
    text: "Double an enemy's Smolder. Kindle.", exhaust: true,
    effects: [{ kind: 'special', id: 'catalyst', n: 2 }],
    up: { text: "Triple an enemy's Smolder. Kindle.", effects: [{ kind: 'special', id: 'catalyst', n: 3 }] },
  },

  // ---- rare powers
  ascension: {
    name: 'Rising Litany', type: 'power', rarity: 'rare', cost: 3, target: 'self',
    text: 'At the start of each turn, gain 2 Fervor.',
    effects: [{ kind: 'status', who: 'self', id: 'ritual', n: 2 }],
    up: { text: 'At the start of each turn, gain 3 Fervor.', effects: [{ kind: 'status', who: 'self', id: 'ritual', n: 3 }] },
  },
  bastion: {
    name: 'Anneal', type: 'power', rarity: 'rare', cost: 3, target: 'self',
    text: 'Ward no longer expires at the start of your turn.',
    effects: [{ kind: 'status', who: 'self', id: 'barricade', n: 1 }],
    up: { cost: 2 },
  },
  frenzy: {
    name: 'Overglow', type: 'power', rarity: 'rare', cost: 2, target: 'self',
    text: 'Your glass runs too hot: gain 2 Cracked. At the start of each turn, gain 1 Energy.',
    effects: [
      { kind: 'status', who: 'self', id: 'vulnerable', n: 2 },
      { kind: 'status', who: 'self', id: 'energized', n: 1 },
    ],
    up: {
      text: 'Your glass runs too hot: gain 1 Cracked. At the start of each turn, gain 1 Energy.',
      effects: [
        { kind: 'status', who: 'self', id: 'vulnerable', n: 1 },
        { kind: 'status', who: 'self', id: 'energized', n: 1 },
      ],
    },
  },
  virulence: {
    name: 'Emberfang', type: 'power', rarity: 'rare', cost: 2, target: 'self',
    text: 'Whenever you play an Attack, apply 1 Smolder to the enemy.',
    effects: [{ kind: 'status', who: 'self', id: 'venomous', n: 1 }],
    up: { cost: 1 },
  },

  // ---- the vigil's unlockables (locked out of pools until their deed is done)
  quakeblow: {
    name: 'Quakeblow', type: 'attack', rarity: 'uncommon', cost: 2, target: 'enemy', chip: 2, locked: 'paneBreaker',
    text: 'Deal @8@ damage. Chip 2 extra Facets.',
    effects: [{ kind: 'dmg', n: 8 }],
    up: { text: 'Deal @11@ damage. Chip 3 extra Facets.', chip: 3, effects: [{ kind: 'dmg', n: 11 }] },
  },
  resonantLance: {
    name: 'Resonant Lance', type: 'attack', rarity: 'rare', cost: 1, target: 'enemy', locked: 'paneBreaker',
    text: 'Deal @7@ damage. Deals double to Staggered or Cracked glass.',
    effects: [{ kind: 'special', id: 'shatterEcho', n: 7 }],
    up: { text: 'Deal @10@ damage. Deals double to Staggered or Cracked glass.', effects: [{ kind: 'special', id: 'shatterEcho', n: 10 }] },
  },
  tithe: {
    name: 'Tithe of Panes', type: 'skill', rarity: 'uncommon', cost: 1, target: 'self', locked: 'lanternFed',
    text: 'Gain 2 Embers. Draw 1 card.',
    effects: [{ kind: 'ember', n: 2 }, { kind: 'draw', n: 1 }],
    up: { text: 'Gain 3 Embers. Draw 1 card.', effects: [{ kind: 'ember', n: 3 }, { kind: 'draw', n: 1 }] },
  },
  pyreheart: {
    name: 'Pyreheart', type: 'power', rarity: 'rare', cost: 2, target: 'self', locked: 'lanternFed',
    text: 'At the start of each turn, gain 1 Ember.',
    effects: [{ kind: 'status', who: 'self', id: 'emberflow', n: 1 }],
    up: { cost: 1 },
  },
  ashenChoir: {
    name: 'Ashen Choir', type: 'skill', rarity: 'uncommon', cost: 1, target: 'enemy', locked: 'ashSermon',
    text: 'Apply 4 Smolder. When smoldering glass dies, its fire leaps on.',
    effects: [{ kind: 'status', who: 'target', id: 'poison', n: 4 }],
    up: { text: 'Apply 6 Smolder. When smoldering glass dies, its fire leaps on.', effects: [{ kind: 'status', who: 'target', id: 'poison', n: 6 }] },
  },
  flawlessForm: {
    name: 'Flawless Form', type: 'skill', rarity: 'rare', cost: 1, target: 'self', locked: 'untouched',
    text: 'Gain #8# Ward. If your glass is untouched this combat, gain #8# more.',
    effects: [{ kind: 'special', id: 'flawless', n: 8 }],
    up: { text: 'Gain #11# Ward. If your glass is untouched this combat, gain #11# more.', effects: [{ kind: 'special', id: 'flawless', n: 11 }] },
  },
  nightSight: {
    name: 'Night Sight', type: 'power', rarity: 'uncommon', cost: 1, target: 'self', locked: 'darkWalker',
    text: 'At the start of each turn, draw 1 extra card.',
    effects: [{ kind: 'status', who: 'self', id: 'nightsight', n: 1 }],
    up: { cost: 0 },
  },
  novaflare: {
    name: 'Novaflare', type: 'attack', rarity: 'rare', cost: 2, target: 'enemy', locked: 'spendthrift',
    text: 'Deal @3@ damage for every Ember in your lantern.',
    effects: [{ kind: 'special', id: 'emberNova', n: 3 }],
    up: { text: 'Deal @4@ damage for every Ember in your lantern.', effects: [{ kind: 'special', id: 'emberNova', n: 4 }] },
  },
  emberdance: {
    name: 'Emberdance', type: 'skill', rarity: 'uncommon', cost: 0, target: 'self', locked: 'spendthrift',
    text: 'Spill your lantern: gain 3 Ward for each Ember spent. Kindle.', exhaust: true,
    effects: [{ kind: 'special', id: 'emberdance', n: 3 }],
    up: { text: 'Spill your lantern: gain 4 Ward for each Ember spent. Kindle.', effects: [{ kind: 'special', id: 'emberdance', n: 4 }] },
  },
  shardstorm: {
    name: 'Shardstorm', type: 'attack', rarity: 'rare', cost: 3, target: 'allEnemies',
    locked: 'hundredShards',
    text: 'Deal @5@ damage to ALL enemies twice.',
    effects: [{ kind: 'dmg', n: 5, times: 2 }],
    up: { text: 'Deal @7@ damage to ALL enemies twice.', effects: [{ kind: 'dmg', n: 7, times: 2 }] },
  },

  // ---- statuses / curses
  wound: {
    name: 'Shard', type: 'status', rarity: 'special', cost: null, target: 'none',
    text: 'Unplayable. Broken glass rattling in your deck.', unplayable: true, effects: [],
  },
  burn: {
    name: 'Cinder', type: 'status', rarity: 'special', cost: null, target: 'none',
    text: 'Unplayable. At the end of your turn, take 2 damage if this is in your hand.',
    unplayable: true, endTurnDmg: 2, effects: [],
  },
  hex: {
    name: 'Hex', type: 'curse', rarity: 'special', cost: null, target: 'none',
    text: 'Unplayable. At the end of your turn, lose 1 HP if this is in your hand. Refuses the fire.',
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
  str: { name: 'Fervor', icon: '⚔', kind: 'buff', desc: 'The inner fire stoked: attacks deal +N damage.' },
  dex: { name: 'Poise', icon: '🛡', kind: 'buff', desc: 'Ward cards grant +N Ward.' },
  vulnerable: { name: 'Cracked', icon: '◎', kind: 'debuff', desc: 'The glass is scored: takes 50% more attack damage. Wears off each turn.' },
  weak: { name: 'Dimmed', icon: '↓', kind: 'debuff', desc: 'The fire gutters: deals 25% less attack damage. Wears off each turn.' },
  frail: { name: 'Brittle', icon: '✖', kind: 'debuff', desc: 'Ward gained reduced 25%. Wears off each turn.' },
  poison: { name: 'Smolder', icon: '☠', kind: 'debuff', desc: 'Burns from within: loses N HP at the start of its turn, then Smolder falls by 1. When smoldering glass shatters or dies, the Smolder leaps to another enemy.' },
  thorns: { name: 'Splinters', icon: '❈', kind: 'buff', desc: 'Attackers take N damage back.' },
  ritual: { name: 'Litany', icon: '☽', kind: 'buff', desc: 'Gains N Fervor at the start of each turn.' },
  metallicize: { name: 'Vitrified', icon: '⬡', kind: 'buff', desc: 'Gains N Ward at the end of each turn.' },
  regen: { name: 'Warmth', icon: '❋', kind: 'buff', desc: 'Heals N HP at the end of each turn.' },
  barricade: { name: 'Annealed', icon: '☗', kind: 'buff', desc: 'Ward no longer expires.' },
  energized: { name: 'Alight', icon: '✦', kind: 'buff', desc: 'Gain N extra Energy at the start of each turn.' },
  venomous: { name: 'Emberfang', icon: '☠', kind: 'buff', desc: 'Attacks apply N Smolder.' },
  rampage: { name: 'Crescendo', icon: '⤴', kind: 'buff', desc: 'Attack grows stronger with each use.' },
  beacon: { name: 'Beacon', icon: '☀', kind: 'buff', desc: 'Attacks chip N extra Facet(s). Fades at end of turn.' },
  emberflow: { name: 'Pyreheart', icon: '♥', kind: 'buff', desc: 'Gain N Ember(s) at the start of each turn.' },
  nightsight: { name: 'Night Sight', icon: '☾', kind: 'buff', desc: 'Draw N extra card(s) at the start of each turn.' },
};

// ---------------------------------------------------------------- RELICS
export const RELICS = {
  emberHeart: { name: 'Emberheart', rarity: 'starter', glyph: '♥', tone: '#ff5964', text: 'At the end of combat, heal 6 HP.' },
  ashenCore: { name: 'Ashen Core', rarity: 'starter', glyph: '☁', tone: '#d3a15a', text: 'Enemies begin each combat with 3 Smolder.' },

  basaltIdol: { name: 'Basalt Idol', rarity: 'common', glyph: '☗', tone: '#9aa7b8', text: 'Begin each combat with 10 Ward.' },
  warFetish: { name: 'War Fetish', rarity: 'common', glyph: '⚔', tone: '#ff8c5a', text: 'Begin each combat with 1 Fervor.' },
  riverPearl: { name: 'River Pearl', rarity: 'common', glyph: '◉', tone: '#6fd6e8', text: 'Begin each combat with 1 Poise.' },
  travelersPack: { name: "Traveler's Pack", rarity: 'common', glyph: '⌘', tone: '#c9a86a', text: 'Draw 2 extra cards on your first turn.' },
  emberLantern: { name: 'Ember Lantern', rarity: 'common', glyph: '☀', tone: '#ffd166', text: 'Gain 1 extra Energy on your first turn.' },
  vialOfLife: { name: 'Vial of Life', rarity: 'common', glyph: '♣', tone: '#7ddb8f', text: 'Heal 2 HP at the start of each combat.' },
  thornBand: { name: 'Thorn Band', rarity: 'common', glyph: '❈', tone: '#a3e06c', text: 'Begin each combat with 2 Splinters.' },
  sweetRoot: { name: 'Sweet Root', rarity: 'common', glyph: '✿', tone: '#ff9ecb', text: 'On pickup: gain 8 Max HP.', instant: true },

  gravebloom: { name: 'Gravebloom', rarity: 'uncommon', glyph: '❀', tone: '#b18cff', text: 'After combat, if at or below 50% HP, heal 10.' },
  silkFan: { name: 'Silk Fan', rarity: 'uncommon', glyph: '⛉', tone: '#8fd0ff', text: 'Every 3rd card you play each combat grants 3 Ward.' },
  reapersBell: { name: "Reaper's Bell", rarity: 'uncommon', glyph: '♫', tone: '#d8c27a', text: 'When an enemy dies, gain 1 Energy and draw 1 card.' },
  executionersSeal: { name: "Executioner's Seal", rarity: 'uncommon', glyph: '✠', tone: '#ff6b6b', text: 'Every 10th Attack you play deals double damage.' },
  ironTalisman: { name: 'Iron Talisman', rarity: 'uncommon', glyph: '◈', tone: '#c0c8d4', text: 'Every 3rd Attack you play grants 1 Fervor.' },
  merchantsMark: { name: "Merchant's Mark", rarity: 'uncommon', glyph: '¤', tone: '#f2c14e', text: 'Shop prices are 25% lower.' },
  seersOrb: { name: "Seer's Orb", rarity: 'uncommon', glyph: '☉', tone: '#9be8d8', text: 'Card rewards offer 1 additional choice.' },

  frozenCore: { name: 'Frozen Core', rarity: 'rare', glyph: '❆', tone: '#a8e6ff', text: 'Unspent Energy carries over between turns.' },
  verdantBranch: { name: 'Verdant Branch', rarity: 'rare', glyph: '⚕', tone: '#7ddb8f', text: 'Whenever a card is Kindled or burned away, draw 1 card.' },
  sunBlossom: { name: 'Sun Blossom', rarity: 'rare', glyph: '❂', tone: '#ffd166', text: 'All healing is increased by 50%.' },
  wardingCharm: { name: 'Warding Charm', rarity: 'rare', glyph: '⛨', tone: '#8fa8ff', text: 'Enemy attacks that would deal 5 or less damage deal 1.' },
  duskmirror: { name: 'Duskmirror', rarity: 'rare', glyph: '◐', tone: '#c99aff', text: 'The first card you play each turn costs 0.' },

  // the vigil's unlockables
  smolderingCoal: { name: 'Smoldering Coal', rarity: 'uncommon', glyph: '♨', tone: '#ff9a4d', locked: 'ashSermon', text: 'Enemies begin each combat with 2 Smolder.' },
  thiefOfWicks: { name: 'Thief of Wicks', rarity: 'uncommon', glyph: '☄', tone: '#c9a86a', locked: 'darkWalker', text: 'Unlit lanterns pay double bounty.' },
  prismCharm: { name: 'Prism Charm', rarity: 'rare', glyph: '◬', tone: '#9be8d8', locked: 'untouched', text: 'Your first Shatter each combat spills 2 extra Embers.' },
  bellOfEndings: { name: 'Bell of Endings', rarity: 'rare', glyph: '♪', tone: '#dfeaff', locked: 'hundredShards', text: 'Whenever glass Shatters, every other enemy takes 4 damage.' },

  // Crowns: each act-boss offers one, and each rewrites a rule of the climb
  crownOfCinders: { name: 'Crown of Cinders', rarity: 'boss', glyph: '♛', tone: '#ff9a4d', text: 'Your lantern holds 12 Embers and begins each combat holding 2.' },
  hollowCrown: { name: 'Hollow Crown', rarity: 'boss', glyph: '♕', tone: '#b18cff', text: 'Gain 1 Energy each turn. The glass dims: on pickup, lose 10 Max HP.', instant: true },
  crownOfTithes: { name: 'Crown of Tithes', rarity: 'boss', glyph: '♜', tone: '#d8c27a', text: 'You may kindle twice each turn, and each kindling grants 3 Ward.' },
  shatterersCrown: { name: "Shatterer's Crown", rarity: 'boss', glyph: '♚', tone: '#8fd0ff', text: 'Enemy glass runs thin: all facet gauges are 1 smaller. Enemies begin with 1 Fervor.' },
  crownOfTheHearth: { name: 'Crown of the Hearth', rarity: 'boss', glyph: '♥', tone: '#ff5964', text: 'At the end of combat, heal 3 HP for every Ember still in your lantern.' },
};

export const RELIC_POOLS = (() => {
  const pools = { common: [], uncommon: [], rare: [], boss: [] };
  for (const [id, r] of Object.entries(RELICS)) if (pools[r.rarity] && !r.locked) pools[r.rarity].push(id);
  return pools;
})();

// ---------------------------------------------------------------- PHIALS
export const POTIONS = {
  healing: { name: 'Phial of Dawn', tone: '#ff6b81', glyph: '♥', text: 'Heal 20 HP.', combatOnly: false },
  strength: { name: 'Phial of Fervor', tone: '#ff8c5a', glyph: '⚔', text: 'Gain 2 Fervor.', combatOnly: true },
  swift: { name: 'Inkdraught', tone: '#8fd0ff', glyph: '»', text: 'Draw 3 cards.', combatOnly: true },
  block: { name: 'Phial of Held Light', tone: '#9aa7b8', glyph: '☗', text: 'Gain 12 Ward.', combatOnly: true },
  fire: { name: 'Stormglass Phial', tone: '#ffd166', glyph: '✹', text: 'Deal 20 damage to an enemy.', combatOnly: true, needsTarget: true },
  venom: { name: 'Smolderphial', tone: '#a3e06c', glyph: '☠', text: 'Apply 7 Smolder to an enemy.', combatOnly: true, needsTarget: true },
  energy: { name: 'Emberphial', tone: '#ff9a4d', glyph: '✦', text: 'Gain 3 Embers.', combatOnly: true },
};

// ---------------------------------------------------------------- ENEMIES
// move: {name, intent, dmg?, times?, block?, heal?, fx?:[{who:'player'|'self'|'allies', id, n}], addCards?:{id,n}}
// ai(ctx) -> move key. ctx: {turn, last, prev, rng, hpFrac}

export const ENEMIES = {
  // ============ ACT 1
  sporeling: {
    name: 'Sporeling', hp: [13, 17], facets: 3, art: { kind: 'wisp', hue: 95, size: 0.72 },
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
    name: 'Thornling', hp: [18, 22], facets: 3, art: { kind: 'plant', hue: 80, size: 0.85 },
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
    name: 'Void Wisp', hp: [26, 30], facets: 3, art: { kind: 'wisp', hue: 275, size: 0.78 },
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
      { label: 'Bottle it', sub: 'Gain a Phial of Dawn.', ops: [{ potion: 'healing' }] },
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

// ---------------------------------------------------------------- OMENS
// One rolled per act: a rule the night imposes on everyone. Every omen gives
// with one hand and takes with the other. The engine reads only `mods`.
export const OMENS = {
  ashfall: {
    name: 'Ashfall', glyph: '☁', tone: '#d3f2a1',
    text: 'Ash chokes every fire: enemies begin combat with 2 Smolder, but their blows leave 1 Smolder on you.',
    mods: { enemyStartStatus: { poison: 2 }, playerHitApplies: { poison: 1 } },
  },
  heavyAir: {
    name: 'Heavy Air', glyph: '☗', tone: '#8fd0ff',
    text: 'The air holds light like water: all Ward gained is increased by a quarter — yours and theirs.',
    mods: { wardMult: 1.25 },
  },
  thinGlass: {
    name: 'Thin Glass', glyph: '◬', tone: '#dfeaff',
    text: 'Tonight all glass runs thin: every facet gauge is 1 smaller, but enemy blows strike 2 harder.',
    mods: { facetDelta: -1, enemyDmgBonus: 2 },
  },
  hungryDark: {
    name: 'The Hungry Dark', glyph: '☾', tone: '#c99aff',
    text: 'The dark eats coin but sharpens choice: shop prices are a quarter higher, and card rewards offer 1 more choice.',
    mods: { shopMult: 1.25, rewardChoiceBonus: 1 },
  },
  emberWind: {
    name: 'Ember Wind', glyph: '✦', tone: '#ff9a4d',
    text: 'Sparks ride the wind into your lantern: begin each combat with 2 Embers, but draw 4 cards instead of 5.',
    mods: { startEmbers: 2, drawDelta: -1 },
  },
  longNight: {
    name: 'The Long Night', glyph: '★', tone: '#b18cff',
    text: 'The climb stretches on: enemies carry 12% more life, but every victory pays 40% more gold.',
    mods: { hpMult: 1.12, goldMult: 1.4 },
  },
  waningMoon: {
    name: 'Waning Moon', glyph: '◐', tone: '#ffe9ac',
    text: 'The moon spends her last light on you: your first card each turn costs 1 less, but rest sites heal only 20%.',
    mods: { firstCardDiscount: 1, restHealFrac: 0.2 },
  },
};

// ---------------------------------------------------------------- ELITE AFFIXES
// Every elite arrives wearing a title. The title is a promise.
export const AFFIXES = {
  vitrified: { name: 'Vitrified', tone: '#8fd0ff', text: 'Thicker glass: +2 facets and +15% HP.', mods: { facetDelta: 2, hpMult: 1.15 } },
  cinderVeined: { name: 'Cinder-Veined', tone: '#ff9a4d', text: 'Its blows leave 1 Smolder on you.', mods: { attackApplies: { poison: 1 } } },
  adamant: { name: 'Adamant', tone: '#d8c27a', text: 'The first time its glass would shatter, it holds.', mods: { adamant: true } },
  emberFat: { name: 'Ember-Fat', tone: '#ffe9ac', text: 'Slaying it pays double gold.', mods: { goldMult: 2 } },
  veiled: { name: 'Veiled', tone: '#9aa7b8', text: 'Begins the fight behind 15 Ward.', mods: { startBlock: 15 } },
  fervent: { name: 'Fervent', tone: '#ff8d8d', text: 'Begins the fight with 2 Fervor.', mods: { startStatus: { str: 2 } } },
};

// ---------------------------------------------------------------- LANTERN ARTS
// The hero's own voice: one Art per run, always at hand, paid in Embers,
// once per turn. All target-free by design — the lantern doesn't aim, it answers.
export const ARTS = {
  flare: {
    name: 'Flare', glyph: '✹', tone: '#ff9a4d', cost: 3,
    text: 'The lantern vents. Deal 7 damage to ALL enemies and apply 2 Smolder.',
    effects: [{ kind: 'dmg', n: 7 }, { kind: 'status', who: 'allEnemies', id: 'poison', n: 2 }],
  },
  mendglass: {
    name: 'Mendglass', glyph: '❋', tone: '#8fe8a0', cost: 4,
    text: 'Warm light knits the cracks. Heal 8 HP.',
    effects: [{ kind: 'heal', n: 8 }],
  },
  beacon: {
    name: 'Beacon', glyph: '☀', tone: '#ffe9ac', cost: 2,
    text: 'Raise the light. Your attacks chip 1 extra facet this turn.',
    effects: [{ kind: 'status', who: 'self', id: 'beacon', n: 1 }],
  },
  emberveil: {
    name: 'Emberveil', glyph: '⛨', tone: '#8fd0ff', cost: 3,
    text: 'A curtain of held fire. Gain 12 Ward.',
    effects: [{ kind: 'block', n: 12 }],
  },
  stoke: {
    name: 'Stoke', glyph: '✦', tone: '#c99aff', cost: 4,
    text: 'Feed the flame to the hand that carries it. Gain 1 Energy and draw 2 cards.',
    effects: [{ kind: 'energy', n: 1 }, { kind: 'draw', n: 2 }],
  },
  ashfall: {
    name: 'Ashfall', glyph: '☁', tone: '#d3f2a1', cost: 3,
    text: "The Ashwarden's breath. Apply 3 Smolder to ALL enemies and gain 5 Ward.",
    effects: [{ kind: 'status', who: 'allEnemies', id: 'poison', n: 3 }, { kind: 'block', n: 5 }],
  },
};

// ---------------------------------------------------------------- THE VIGIL: DEEDS
// Lifetime feats, tallied across every climb. Crossing a threshold unlocks
// content into the pools ('card:id' / 'relic:id') or the second Aspect.
// stat = key in the vigil's deed counters (fed from run.stats at run end).
export const DEEDS = {
  paneBreaker: { name: 'Breaker of Panes', desc: 'Shatter 15 facets', stat: 'shatters', n: 15, unlocks: ['card:quakeblow', 'card:resonantLance'] },
  lanternFed: { name: 'The Lantern Fed', desc: 'Kindle 20 cards by hand', stat: 'kindles', n: 20, unlocks: ['card:tithe', 'card:pyreheart'] },
  ashSermon: { name: 'Sermon of Ash', desc: 'Let Smolder claim 10 lives', stat: 'smolderKills', n: 10, unlocks: ['card:ashenChoir', 'relic:smolderingCoal'] },
  untouched: { name: 'The Glass Untouched', desc: 'Win 3 fights without a scratch', stat: 'perfects', n: 3, unlocks: ['card:flawlessForm', 'relic:prismCharm'] },
  darkWalker: { name: 'Walker of Unlit Ways', desc: 'Enter 6 unlit lanterns', stat: 'unlitVisited', n: 6, unlocks: ['card:nightSight', 'relic:thiefOfWicks'] },
  spendthrift: { name: 'Fire Given Freely', desc: 'Spend 30 embers on Lantern Arts', stat: 'embersSpent', n: 30, unlocks: ['card:novaflare', 'card:emberdance'] },
  hundredShards: { name: 'A Hundred Shards', desc: 'Slay 100 creatures', stat: 'slain', n: 100, unlocks: ['card:shardstorm', 'relic:bellOfEndings'] },
  firstDawn: { name: 'The First Dawn', desc: 'Reach the sunrise once', stat: 'wins', n: 1, unlocks: ['aspect2'] },
};

// ---------------------------------------------------------------- THE VIGIL: ASPECTS
// Who carries the lantern. Each aspect is a whole kit — HP, starting deck, relic,
// and the Lantern Art it favors. ASPECTS[0] is the Duskblade (== PLAYER); the
// Ashwarden is earned by reaching the first dawn (deed 'firstDawn' → 'aspect2').
export const ASPECTS = [
  PLAYER,
  {
    id: 'ashwarden',
    name: 'The Ashwarden',
    blurb: 'Smoke given a shape. Lets the Smolder do the killing and kindles its own hand to feed the lantern. Slower, but it endures — and everything it touches burns.',
    hue: 26, art: 'ashfall', unlock: 'aspect2',
    maxHp: 80,
    energy: 3,
    handSize: 5,
    potionSlots: 3,
    startDeck: ['ashBite', 'ashBite', 'ashBite', 'ashBite', 'defend', 'defend', 'defend', 'smother', 'smother', 'firstSpark'],
    startRelic: 'ashenCore',
    startGold: 99,
  },
];

// ---------------------------------------------------------------- THE VIGIL: VOWS
// The difficulty ladder. Running at Vow N imposes vows 1..N, cumulatively.
// Winning at Vow N unlocks Vow N+1. Mods are read by the engine's vowMods().
export const VOWS = [
  { name: 'Vow of Iron', desc: 'Every creature is harder to break — enemy HP +12%.', mods: { hpMult: 1.12 } },
  { name: 'Vow of Malice', desc: 'Their blows land heavier — enemy attacks deal +1.', mods: { enemyDmgBonus: 1 } },
  { name: 'Vow of the Deep', desc: 'Bosses armor their cores — boss Facets +1.', mods: { bossFacetDelta: 1 } },
  { name: 'Vow of the Mark', desc: 'You climb already cursed — begin every run with a Hex.', mods: { startHex: true } },
  { name: 'Vow of the Waning', desc: 'The dark drinks your rest — campfires heal 20%, not 30%.', mods: { restHealFrac: 0.2 } },
];

// ---------------------------------------------------------------- THE VIGIL: BOONS
// The Lamplighter's gift. At run start, choose 1 of 3 drawn from this pool.
// ops reuse the event-op executor; kept non-interactive so the gift resolves at once.
export const BOONS = {
  fullPurse: { name: 'A Full Purse', text: 'Set out with 120 extra gold.', ops: [{ gold: 120 }] },
  temperedGlass: { name: 'Tempered Glass', text: 'Raise your Max HP by 14.', ops: [{ maxHp: 14 }] },
  keenEye: { name: 'A Keeper\'s Eye', text: 'Begin with a random relic.', ops: [{ addRelic: 'random' }] },
  warmHearth: { name: 'A Warm Hearth', text: 'Mend to full and gain 6 Max HP.', ops: [{ maxHp: 6 }, { heal: 1 }] },
  emberFlask: { name: 'Ember Flask', text: 'Pack a Fire Phial and a Draught of Vigor.', ops: [{ potion: 'fire' }, { potion: 'healing' }] },
  twinPhials: { name: 'Twin Phials', text: 'Pack a Swift Phial and an Energy Phial.', ops: [{ potion: 'swift' }, { potion: 'energy' }] },
  pilgrimsCache: { name: "Pilgrim's Cache", text: 'Gain 60 gold and a Ward Phial.', ops: [{ gold: 60 }, { potion: 'block' }] },
  venomPouch: { name: 'A Pouch of Ash', text: 'Gain 40 gold and a Venom Phial.', ops: [{ gold: 40 }, { potion: 'venom' }] },
};
