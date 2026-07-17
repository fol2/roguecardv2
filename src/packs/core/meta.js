// Core pack — deeds / aspects / vows / boons (locale-free).

export const DEEDS = {
  paneBreaker: {
    stat: "shatters",
    n: 15,
    unlocks: [
      "card:quakeblow",
      "card:resonantLance",
    ],
  },
  lanternFed: {
    stat: "kindles",
    n: 20,
    unlocks: [
      "card:tithe",
      "card:pyreheart",
    ],
  },
  ashSermon: {
    stat: "smolderKills",
    n: 10,
    unlocks: [
      "card:ashenChoir",
      "relic:smolderingCoal",
    ],
  },
  untouched: {
    stat: "perfects",
    n: 3,
    unlocks: [
      "card:flawlessForm",
      "relic:prismCharm",
    ],
  },
  darkWalker: {
    stat: "unlitVisited",
    n: 6,
    unlocks: [
      "card:nightSight",
      "relic:thiefOfWicks",
    ],
  },
  spendthrift: {
    stat: "embersSpent",
    n: 30,
    unlocks: [
      "card:novaflare",
      "card:emberdance",
    ],
  },
  hundredShards: {
    stat: "slain",
    n: 100,
    unlocks: [
      "card:shardstorm",
      "relic:bellOfEndings",
    ],
  },
  firstDawn: {
    stat: "wins",
    n: 1,
    unlocks: [
      "aspect2",
    ],
  },
};

export const ASPECTS = [
  {
    id: "duskblade",
    hue: 225,
    art: "flare",
    maxHp: 72,
    energy: 3,
    handSize: 5,
    potionSlots: 3,
    startDeck: [
      "strike",
      "strike",
      "strike",
      "strike",
      "defend",
      "defend",
      "defend",
      "eclipseSlash",
      "chisel",
      "firstSpark",
    ],
    startRelic: "emberHeart",
    startGold: 99,
  },
  {
    id: "ashwarden",
    hue: 26,
    art: "ashfall",
    unlock: "aspect2",
    maxHp: 80,
    energy: 3,
    handSize: 5,
    potionSlots: 3,
    startDeck: [
      "ashBite",
      "ashBite",
      "ashBite",
      "ashBite",
      "defend",
      "defend",
      "defend",
      "smother",
      "smother",
      "firstSpark",
    ],
    startRelic: "ashenCore",
    startGold: 99,
  },
];

export const VOWS = [
  {
    mods: {
      hpMult: 1.12,
    },
  },
  {
    mods: {
      enemyDmgBonus: 1,
    },
  },
  {
    mods: {
      bossFacetDelta: 1,
    },
  },
  {
    mods: {
      startHex: true,
    },
  },
  {
    mods: {
      restHealFrac: 0.2,
    },
  },
];

export const BOONS = {
  fullPurse: {
    ops: [
      {
        gold: 120,
      },
    ],
  },
  temperedGlass: {
    ops: [
      {
        maxHp: 14,
      },
    ],
  },
  keenEye: {
    ops: [
      {
        addRelic: "random",
      },
    ],
  },
  warmHearth: {
    ops: [
      {
        maxHp: 6,
      },
      {
        heal: 1,
      },
    ],
  },
  emberFlask: {
    ops: [
      {
        potion: "fire",
      },
      {
        potion: "healing",
      },
    ],
  },
  twinPhials: {
    ops: [
      {
        potion: "swift",
      },
      {
        potion: "energy",
      },
    ],
  },
  pilgrimsCache: {
    ops: [
      {
        gold: 60,
      },
      {
        potion: "block",
      },
    ],
  },
  venomPouch: {
    ops: [
      {
        gold: 40,
      },
      {
        potion: "venom",
      },
    ],
  },
};

