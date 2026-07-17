// Dev/test fourth theme — Act 1 plates + registered non-actN Music Cue ids.

export const sampleTheme = {
  legacyAct: {
    boss: 'sampleEnemy',
    theme: {
      sky: 791568,
      fog: 1254426,
      particles: 16752717,
      glow: 6750110,
      accent: '#7ddb8f',
      ember: '#ff9a4d',
    },
  },
  plates: {
    backdrop: 'act1-backdrop',
    mid: 'act1-mid',
    ledge: 'act1-ledge',
  },
  atmosphere: 'ash',
  weather: {
    rate: 1,
    colors: ['#b8b0a0', '#8a8378'],
    vx: [-6, 6],
    vy: [10, 26],
    size: [1.4, 2.6],
    drift: 0.4,
    emberRate: 0.5,
  },
  palette: {
    tint: 'good',
    glow: 'gold',
    haze: 'text-dim',
  },
  music: {
    map: 'map',
    combat: 'paleOnes',
    boss: 'usurper',
    victory: 'victory',
  },
  roster: {
    normal: ['sampleEnemy'],
    elite: [],
    boss: ['sampleEnemy'],
  },
  encounters: {
    weak: [['sampleEnemy']],
    normal: [['sampleEnemy']],
    elite: [['sampleEnemy']],
    boss: [['sampleEnemy']],
  },
  rewardGold: {
    normal: [1, 1],
    elite: [1, 1],
    boss: [1, 1],
  },
  mapHaze: 'text-dim',
  lanternLights: [],
  bossPlates: {},
};
