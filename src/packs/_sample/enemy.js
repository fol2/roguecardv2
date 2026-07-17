// Dev/test sample enemy — mechanics only (display lives in locale-en.js).

export const sampleEnemy = {
  hp: [12, 12],
  facets: 2,
  art: { kind: 'wisp', hue: 180, size: 0.8 },
  moves: { wait: { intent: 'block', block: 1 } },
  ai: (_ctx) => 'wait',
};
