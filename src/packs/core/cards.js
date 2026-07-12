// Core pack — card mechanics (locale-free).

export const CARDS = {
  strike: {
    type: "attack",
    rarity: "starter",
    cost: 1,
    target: "enemy",
    vfx: "slash",
    effects: [
      {
        kind: "dmg",
        n: 6,
      },
    ],
    up: {
      effects: [
        {
          kind: "dmg",
          n: 9,
        },
      ],
    },
  },
  defend: {
    type: "skill",
    rarity: "starter",
    cost: 1,
    target: "self",
    vfx: "ward",
    effects: [
      {
        kind: "block",
        n: 5,
      },
    ],
    up: {
      effects: [
        {
          kind: "block",
          n: 8,
        },
      ],
    },
  },
  eclipseSlash: {
    type: "attack",
    rarity: "starter",
    cost: 1,
    target: "enemy",
    vfx: "slash",
    effects: [
      {
        kind: "dmg",
        n: 7,
      },
      {
        kind: "status",
        who: "target",
        id: "vulnerable",
        n: 1,
      },
    ],
    up: {
      effects: [
        {
          kind: "dmg",
          n: 9,
        },
        {
          kind: "status",
          who: "target",
          id: "vulnerable",
          n: 2,
        },
      ],
    },
  },
  chisel: {
    type: "attack",
    rarity: "starter",
    cost: 1,
    target: "enemy",
    chip: 1,
    vfx: "pierce",
    effects: [
      {
        kind: "dmg",
        n: 4,
      },
    ],
    up: {
      effects: [
        {
          kind: "dmg",
          n: 7,
        },
      ],
    },
  },
  firstSpark: {
    type: "skill",
    rarity: "starter",
    cost: 0,
    target: "self",
    vfx: "fire",
    exhaust: true,
    effects: [
      {
        kind: "draw",
        n: 1,
      },
    ],
    up: {
      effects: [
        {
          kind: "draw",
          n: 2,
        },
      ],
    },
  },
  ashBite: {
    type: "attack",
    rarity: "starter",
    cost: 1,
    target: "enemy",
    vfx: "fire",
    effects: [
      {
        kind: "dmg",
        n: 5,
      },
      {
        kind: "status",
        who: "target",
        id: "poison",
        n: 2,
      },
    ],
    up: {
      effects: [
        {
          kind: "dmg",
          n: 7,
        },
        {
          kind: "status",
          who: "target",
          id: "poison",
          n: 3,
        },
      ],
    },
  },
  smother: {
    type: "skill",
    rarity: "starter",
    cost: 1,
    target: "enemy",
    vfx: "fire",
    effects: [
      {
        kind: "block",
        n: 5,
      },
      {
        kind: "status",
        who: "target",
        id: "poison",
        n: 2,
      },
    ],
    up: {
      effects: [
        {
          kind: "block",
          n: 8,
        },
        {
          kind: "status",
          who: "target",
          id: "poison",
          n: 3,
        },
      ],
    },
  },
  twinFangs: {
    type: "attack",
    rarity: "common",
    cost: 1,
    target: "enemy",
    vfx: "pierce",
    effects: [
      {
        kind: "dmg",
        n: 4,
        times: 2,
      },
    ],
    up: {
      effects: [
        {
          kind: "dmg",
          n: 6,
          times: 2,
        },
      ],
    },
  },
  quickSlash: {
    type: "attack",
    rarity: "common",
    cost: 0,
    target: "enemy",
    vfx: "slash",
    effects: [
      {
        kind: "dmg",
        n: 4,
      },
      {
        kind: "draw",
        n: 1,
      },
    ],
    up: {
      effects: [
        {
          kind: "dmg",
          n: 6,
        },
        {
          kind: "draw",
          n: 1,
        },
      ],
    },
  },
  heavyBlow: {
    type: "attack",
    rarity: "common",
    cost: 2,
    target: "enemy",
    chip: 1,
    vfx: "blunt",
    effects: [
      {
        kind: "dmg",
        n: 12,
      },
    ],
    up: {
      chip: 2,
      effects: [
        {
          kind: "dmg",
          n: 16,
        },
      ],
    },
  },
  cleave: {
    type: "attack",
    rarity: "common",
    cost: 1,
    target: "allEnemies",
    vfx: "slash",
    effects: [
      {
        kind: "dmg",
        n: 6,
      },
    ],
    up: {
      effects: [
        {
          kind: "dmg",
          n: 9,
        },
      ],
    },
  },
  venomStrike: {
    type: "attack",
    rarity: "common",
    cost: 1,
    target: "enemy",
    vfx: "fire",
    effects: [
      {
        kind: "dmg",
        n: 4,
      },
      {
        kind: "status",
        who: "target",
        id: "poison",
        n: 3,
      },
    ],
    up: {
      effects: [
        {
          kind: "dmg",
          n: 6,
        },
        {
          kind: "status",
          who: "target",
          id: "poison",
          n: 4,
        },
      ],
    },
  },
  lunge: {
    type: "attack",
    rarity: "common",
    cost: 1,
    target: "enemy",
    vfx: "slash",
    effects: [
      {
        kind: "dmg",
        n: 6,
      },
      {
        kind: "status",
        who: "target",
        id: "weak",
        n: 1,
      },
    ],
    up: {
      effects: [
        {
          kind: "dmg",
          n: 9,
        },
        {
          kind: "status",
          who: "target",
          id: "weak",
          n: 2,
        },
      ],
    },
  },
  guardedStrike: {
    type: "attack",
    rarity: "common",
    cost: 1,
    target: "enemy",
    vfx: "slash",
    effects: [
      {
        kind: "dmg",
        n: 5,
      },
      {
        kind: "block",
        n: 4,
      },
    ],
    up: {
      effects: [
        {
          kind: "dmg",
          n: 7,
        },
        {
          kind: "block",
          n: 6,
        },
      ],
    },
  },
  brace: {
    type: "skill",
    rarity: "common",
    cost: 1,
    target: "self",
    vfx: "ward",
    effects: [
      {
        kind: "block",
        n: 8,
      },
    ],
    up: {
      effects: [
        {
          kind: "block",
          n: 11,
        },
      ],
    },
  },
  sidestep: {
    type: "skill",
    rarity: "common",
    cost: 0,
    target: "self",
    vfx: "ward",
    effects: [
      {
        kind: "block",
        n: 3,
      },
      {
        kind: "draw",
        n: 1,
      },
    ],
    up: {
      effects: [
        {
          kind: "block",
          n: 5,
        },
        {
          kind: "draw",
          n: 1,
        },
      ],
    },
  },
  preparation: {
    type: "skill",
    rarity: "common",
    cost: 0,
    target: "self",
    vfx: "fire",
    exhaust: true,
    effects: [
      {
        kind: "draw",
        n: 2,
      },
    ],
    up: {
      exhaust: false,
      effects: [
        {
          kind: "draw",
          n: 2,
        },
      ],
    },
  },
  deflect: {
    type: "skill",
    rarity: "common",
    cost: 1,
    target: "self",
    vfx: "ward",
    effects: [
      {
        kind: "block",
        n: 6,
      },
      {
        kind: "draw",
        n: 1,
      },
    ],
    up: {
      effects: [
        {
          kind: "block",
          n: 9,
        },
        {
          kind: "draw",
          n: 1,
        },
      ],
    },
  },
  leechBlade: {
    type: "attack",
    rarity: "uncommon",
    cost: 2,
    target: "enemy",
    vfx: "void",
    effects: [
      {
        kind: "special",
        id: "leech",
        n: 9,
      },
    ],
    up: {
      effects: [
        {
          kind: "special",
          id: "leech",
          n: 13,
        },
      ],
    },
  },
  tempest: {
    type: "attack",
    rarity: "uncommon",
    cost: 2,
    target: "allEnemies",
    vfx: "pierce",
    effects: [
      {
        kind: "dmg",
        n: 4,
        times: 2,
      },
    ],
    up: {
      effects: [
        {
          kind: "dmg",
          n: 6,
          times: 2,
        },
      ],
    },
  },
  uppercut: {
    type: "attack",
    rarity: "uncommon",
    cost: 2,
    target: "enemy",
    chip: 1,
    vfx: "blunt",
    effects: [
      {
        kind: "dmg",
        n: 10,
      },
      {
        kind: "status",
        who: "target",
        id: "weak",
        n: 1,
      },
    ],
    up: {
      chip: 2,
      effects: [
        {
          kind: "dmg",
          n: 13,
        },
        {
          kind: "status",
          who: "target",
          id: "weak",
          n: 2,
        },
      ],
    },
  },
  flurry: {
    type: "attack",
    rarity: "uncommon",
    cost: 1,
    target: "enemy",
    vfx: "pierce",
    effects: [
      {
        kind: "dmg",
        n: 2,
        times: 3,
      },
    ],
    up: {
      effects: [
        {
          kind: "dmg",
          n: 3,
          times: 3,
        },
      ],
    },
  },
  executioner: {
    type: "attack",
    rarity: "uncommon",
    cost: 1,
    target: "enemy",
    vfx: "blunt",
    effects: [
      {
        kind: "special",
        id: "execute",
        n: 8,
        bonus: 6,
      },
    ],
    up: {
      effects: [
        {
          kind: "special",
          id: "execute",
          n: 11,
          bonus: 8,
        },
      ],
    },
  },
  momentum: {
    type: "attack",
    rarity: "uncommon",
    cost: 1,
    target: "enemy",
    vfx: "slash",
    effects: [
      {
        kind: "special",
        id: "momentum",
        n: 6,
        grow: 4,
      },
    ],
    up: {
      effects: [
        {
          kind: "special",
          id: "momentum",
          n: 8,
          grow: 6,
        },
      ],
    },
  },
  bulwark: {
    type: "skill",
    rarity: "uncommon",
    cost: 2,
    target: "self",
    vfx: "ward",
    effects: [
      {
        kind: "block",
        n: 13,
      },
    ],
    up: {
      effects: [
        {
          kind: "block",
          n: 18,
        },
      ],
    },
  },
  surge: {
    type: "skill",
    rarity: "uncommon",
    cost: 0,
    target: "self",
    vfx: "fire",
    exhaust: true,
    effects: [
      {
        kind: "energy",
        n: 1,
      },
      {
        kind: "draw",
        n: 1,
      },
    ],
    up: {
      effects: [
        {
          kind: "energy",
          n: 2,
        },
        {
          kind: "draw",
          n: 1,
        },
      ],
    },
  },
  toxicMist: {
    type: "skill",
    rarity: "uncommon",
    cost: 1,
    target: "allEnemies",
    vfx: "poison",
    effects: [
      {
        kind: "status",
        who: "allEnemies",
        id: "poison",
        n: 3,
      },
    ],
    up: {
      effects: [
        {
          kind: "status",
          who: "allEnemies",
          id: "poison",
          n: 5,
        },
      ],
    },
  },
  cripple: {
    type: "skill",
    rarity: "uncommon",
    cost: 1,
    target: "enemy",
    vfx: "void",
    exhaust: true,
    effects: [
      {
        kind: "status",
        who: "target",
        id: "str",
        n: -2,
      },
    ],
    up: {
      effects: [
        {
          kind: "status",
          who: "target",
          id: "str",
          n: -3,
        },
      ],
    },
  },
  warCry: {
    type: "skill",
    rarity: "uncommon",
    cost: 1,
    target: "allEnemies",
    vfx: "void",
    effects: [
      {
        kind: "status",
        who: "allEnemies",
        id: "weak",
        n: 1,
      },
      {
        kind: "status",
        who: "allEnemies",
        id: "vulnerable",
        n: 1,
      },
    ],
    up: {
      effects: [
        {
          kind: "status",
          who: "allEnemies",
          id: "weak",
          n: 2,
        },
        {
          kind: "status",
          who: "allEnemies",
          id: "vulnerable",
          n: 2,
        },
      ],
    },
  },
  fortify: {
    type: "skill",
    rarity: "uncommon",
    cost: 2,
    target: "self",
    vfx: "ward",
    effects: [
      {
        kind: "special",
        id: "doubleBlock",
      },
    ],
    up: {
      cost: 1,
    },
  },
  bloodRite: {
    type: "skill",
    rarity: "uncommon",
    cost: 0,
    target: "self",
    vfx: "void",
    effects: [
      {
        kind: "loseHp",
        n: 3,
      },
      {
        kind: "energy",
        n: 2,
      },
    ],
    up: {
      effects: [
        {
          kind: "loseHp",
          n: 3,
        },
        {
          kind: "energy",
          n: 3,
        },
      ],
    },
  },
  empower: {
    type: "power",
    rarity: "uncommon",
    cost: 1,
    target: "self",
    vfx: "fire",
    effects: [
      {
        kind: "status",
        who: "self",
        id: "str",
        n: 2,
      },
    ],
    up: {
      effects: [
        {
          kind: "status",
          who: "self",
          id: "str",
          n: 3,
        },
      ],
    },
  },
  agility: {
    type: "power",
    rarity: "uncommon",
    cost: 1,
    target: "self",
    vfx: "ward",
    effects: [
      {
        kind: "status",
        who: "self",
        id: "dex",
        n: 2,
      },
    ],
    up: {
      effects: [
        {
          kind: "status",
          who: "self",
          id: "dex",
          n: 3,
        },
      ],
    },
  },
  ironSkin: {
    type: "power",
    rarity: "uncommon",
    cost: 1,
    target: "self",
    vfx: "ward",
    effects: [
      {
        kind: "status",
        who: "self",
        id: "metallicize",
        n: 3,
      },
    ],
    up: {
      effects: [
        {
          kind: "status",
          who: "self",
          id: "metallicize",
          n: 4,
        },
      ],
    },
  },
  regrowth: {
    type: "power",
    rarity: "uncommon",
    cost: 1,
    target: "self",
    vfx: "fire",
    effects: [
      {
        kind: "status",
        who: "self",
        id: "regen",
        n: 2,
      },
    ],
    up: {
      effects: [
        {
          kind: "status",
          who: "self",
          id: "regen",
          n: 3,
        },
      ],
    },
  },
  oblivionStrike: {
    type: "attack",
    rarity: "rare",
    cost: 3,
    target: "enemy",
    chip: 2,
    vfx: "blunt",
    effects: [
      {
        kind: "dmg",
        n: 30,
      },
    ],
    up: {
      chip: 3,
      effects: [
        {
          kind: "dmg",
          n: 40,
        },
      ],
    },
  },
  phantomBlades: {
    type: "attack",
    rarity: "rare",
    cost: 1,
    target: "enemy",
    vfx: "pierce",
    effects: [
      {
        kind: "special",
        id: "phantom",
        n: 3,
      },
    ],
    up: {
      effects: [
        {
          kind: "special",
          id: "phantom",
          n: 4,
        },
      ],
    },
  },
  devour: {
    type: "attack",
    rarity: "rare",
    cost: 1,
    target: "enemy",
    vfx: "void",
    exhaust: true,
    effects: [
      {
        kind: "special",
        id: "devour",
        n: 10,
        embers: 3,
        heal: 4,
      },
    ],
    up: {
      effects: [
        {
          kind: "special",
          id: "devour",
          n: 13,
          embers: 4,
          heal: 6,
        },
      ],
    },
  },
  annihilate: {
    type: "attack",
    rarity: "rare",
    cost: 2,
    target: "allEnemies",
    vfx: "fire",
    effects: [
      {
        kind: "dmg",
        n: 9,
      },
      {
        kind: "status",
        who: "allEnemies",
        id: "poison",
        n: 3,
      },
    ],
    up: {
      effects: [
        {
          kind: "dmg",
          n: 12,
        },
        {
          kind: "status",
          who: "allEnemies",
          id: "poison",
          n: 4,
        },
      ],
    },
  },
  aegis: {
    type: "skill",
    rarity: "rare",
    cost: 2,
    target: "self",
    vfx: "ward",
    exhaust: true,
    effects: [
      {
        kind: "block",
        n: 30,
      },
    ],
    up: {
      effects: [
        {
          kind: "block",
          n: 40,
        },
      ],
    },
  },
  offering: {
    type: "skill",
    rarity: "rare",
    cost: 1,
    target: "self",
    vfx: "fire",
    exhaust: true,
    effects: [
      {
        kind: "special",
        id: "pyreTithe",
        draw: 3,
      },
    ],
    up: {
      effects: [
        {
          kind: "special",
          id: "pyreTithe",
          draw: 4,
        },
      ],
    },
  },
  limitBreak: {
    type: "skill",
    rarity: "rare",
    cost: 1,
    target: "allEnemies",
    vfx: "blunt",
    exhaust: true,
    effects: [
      {
        kind: "chip",
        n: 2,
      },
    ],
    up: {
      effects: [
        {
          kind: "chip",
          n: 3,
        },
      ],
    },
  },
  catalyst: {
    type: "skill",
    rarity: "rare",
    cost: 1,
    target: "enemy",
    vfx: "poison",
    exhaust: true,
    effects: [
      {
        kind: "special",
        id: "catalyst",
        n: 2,
      },
    ],
    up: {
      effects: [
        {
          kind: "special",
          id: "catalyst",
          n: 3,
        },
      ],
    },
  },
  ascension: {
    type: "power",
    rarity: "rare",
    cost: 3,
    target: "self",
    vfx: "fire",
    effects: [
      {
        kind: "status",
        who: "self",
        id: "ritual",
        n: 2,
      },
    ],
    up: {
      effects: [
        {
          kind: "status",
          who: "self",
          id: "ritual",
          n: 3,
        },
      ],
    },
  },
  bastion: {
    type: "power",
    rarity: "rare",
    cost: 3,
    target: "self",
    vfx: "ward",
    effects: [
      {
        kind: "status",
        who: "self",
        id: "barricade",
        n: 1,
      },
    ],
    up: {
      cost: 2,
    },
  },
  frenzy: {
    type: "power",
    rarity: "rare",
    cost: 2,
    target: "self",
    vfx: "fire",
    effects: [
      {
        kind: "status",
        who: "self",
        id: "vulnerable",
        n: 2,
      },
      {
        kind: "status",
        who: "self",
        id: "energized",
        n: 1,
      },
    ],
    up: {
      effects: [
        {
          kind: "status",
          who: "self",
          id: "vulnerable",
          n: 1,
        },
        {
          kind: "status",
          who: "self",
          id: "energized",
          n: 1,
        },
      ],
    },
  },
  virulence: {
    type: "power",
    rarity: "rare",
    cost: 2,
    target: "self",
    vfx: "poison",
    effects: [
      {
        kind: "status",
        who: "self",
        id: "venomous",
        n: 1,
      },
    ],
    up: {
      cost: 1,
    },
  },
  quakeblow: {
    type: "attack",
    rarity: "uncommon",
    cost: 2,
    target: "enemy",
    chip: 2,
    locked: "paneBreaker",
    vfx: "blunt",
    effects: [
      {
        kind: "dmg",
        n: 8,
      },
    ],
    up: {
      chip: 3,
      effects: [
        {
          kind: "dmg",
          n: 11,
        },
      ],
    },
  },
  resonantLance: {
    type: "attack",
    rarity: "rare",
    cost: 1,
    target: "enemy",
    locked: "paneBreaker",
    vfx: "pierce",
    effects: [
      {
        kind: "special",
        id: "shatterEcho",
        n: 7,
      },
    ],
    up: {
      effects: [
        {
          kind: "special",
          id: "shatterEcho",
          n: 10,
        },
      ],
    },
  },
  tithe: {
    type: "skill",
    rarity: "uncommon",
    cost: 1,
    target: "self",
    locked: "lanternFed",
    vfx: "fire",
    effects: [
      {
        kind: "ember",
        n: 2,
      },
      {
        kind: "draw",
        n: 1,
      },
    ],
    up: {
      effects: [
        {
          kind: "ember",
          n: 3,
        },
        {
          kind: "draw",
          n: 1,
        },
      ],
    },
  },
  pyreheart: {
    type: "power",
    rarity: "rare",
    cost: 2,
    target: "self",
    locked: "lanternFed",
    vfx: "fire",
    effects: [
      {
        kind: "status",
        who: "self",
        id: "emberflow",
        n: 1,
      },
    ],
    up: {
      cost: 1,
    },
  },
  ashenChoir: {
    type: "skill",
    rarity: "uncommon",
    cost: 1,
    target: "enemy",
    locked: "ashSermon",
    vfx: "poison",
    effects: [
      {
        kind: "status",
        who: "target",
        id: "poison",
        n: 4,
      },
    ],
    up: {
      effects: [
        {
          kind: "status",
          who: "target",
          id: "poison",
          n: 6,
        },
      ],
    },
  },
  flawlessForm: {
    type: "skill",
    rarity: "rare",
    cost: 1,
    target: "self",
    locked: "untouched",
    vfx: "ward",
    effects: [
      {
        kind: "special",
        id: "flawless",
        n: 8,
      },
    ],
    up: {
      effects: [
        {
          kind: "special",
          id: "flawless",
          n: 11,
        },
      ],
    },
  },
  nightSight: {
    type: "power",
    rarity: "uncommon",
    cost: 1,
    target: "self",
    locked: "darkWalker",
    vfx: "void",
    effects: [
      {
        kind: "status",
        who: "self",
        id: "nightsight",
        n: 1,
      },
    ],
    up: {
      cost: 0,
    },
  },
  novaflare: {
    type: "attack",
    rarity: "rare",
    cost: 2,
    target: "enemy",
    locked: "spendthrift",
    vfx: "fire",
    effects: [
      {
        kind: "special",
        id: "emberNova",
        n: 3,
      },
    ],
    up: {
      effects: [
        {
          kind: "special",
          id: "emberNova",
          n: 4,
        },
      ],
    },
  },
  emberdance: {
    type: "skill",
    rarity: "uncommon",
    cost: 0,
    target: "self",
    locked: "spendthrift",
    vfx: "fire",
    exhaust: true,
    effects: [
      {
        kind: "special",
        id: "emberdance",
        n: 3,
      },
    ],
    up: {
      effects: [
        {
          kind: "special",
          id: "emberdance",
          n: 4,
        },
      ],
    },
  },
  shardstorm: {
    type: "attack",
    rarity: "rare",
    cost: 3,
    target: "allEnemies",
    vfx: "pierce",
    locked: "hundredShards",
    effects: [
      {
        kind: "dmg",
        n: 5,
        times: 2,
      },
    ],
    up: {
      effects: [
        {
          kind: "dmg",
          n: 7,
          times: 2,
        },
      ],
    },
  },
  unreadablePage: {
    type: "curse",
    rarity: "special",
    cost: 0,
    target: "self",
    vfx: "void",
    unplayable: true,
    unremovable: true,
    effects: [],
  },
  wound: {
    type: "status",
    rarity: "special",
    cost: null,
    target: "none",
    vfx: "pierce",
    unplayable: true,
    effects: [],
  },
  burn: {
    type: "status",
    rarity: "special",
    cost: null,
    target: "none",
    vfx: "fire",
    unplayable: true,
    endTurnDmg: 2,
    effects: [],
  },
  hex: {
    type: "curse",
    rarity: "special",
    cost: null,
    target: "none",
    vfx: "void",
    unplayable: true,
    endTurnLoseHp: 1,
    effects: [],
  },
};

