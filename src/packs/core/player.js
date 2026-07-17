// Core pack — player + shop mechanics (locale-free).

export const PLAYER = {
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
};

export const SHOP = {
  removeCost: 75,
  cardPrice: {
    common: [
      45,
      55,
    ],
    uncommon: [
      68,
      82,
    ],
    rare: [
      135,
      160,
    ],
  },
  relicPrice: {
    common: [
      140,
      160,
    ],
    uncommon: [
      220,
      250,
    ],
    rare: [
      270,
      300,
    ],
  },
  potionPrice: [
    48,
    62,
  ],
};

