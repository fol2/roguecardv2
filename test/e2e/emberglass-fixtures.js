export const QIDS = [
  'paleOnes', 'ownShade', 'usurper',
  'eighthOmen', 'unreadablePage', 'hollowLamplighter',
];

const TARGET = {
  paleOnes: 9, ownShade: 3, usurper: 1,
  eighthOmen: 1, unreadablePage: 5, hollowLamplighter: 5,
};

const deeds = (wins = 0) => ({
  runs: wins, wins, slain: 0, shatters: 0, kindles: 0, perfects: 0,
  smolderKills: 0, unlitVisited: 0, embersSpent: 0, bestVow: 0, bestFloor: 0,
});

const quest = (state = 'dormant', progress = 0, memory = {}) => ({ state, progress, memory });

export function freshLedger() {
  return {
    v: 2, deeds: deeds(), unlocks: [], vowUnlocked: 0, lastFall: null,
    runsPlayed: 0,
    quests: Object.fromEntries(QIDS.map((id) => [id, quest()])),
    shards: [], whispers: 0, news: false,
  };
}

export function mixedLedger() {
  const v = freshLedger();
  v.deeds = deeds(6);
  v.runsPlayed = 8;
  v.quests.paleOnes = quest('armed');
  v.quests.ownShade = quest('revealed', 1);
  v.quests.usurper = quest('complete', 1);
  v.quests.unreadablePage = quest('revealed', 2);
  v.shards = ['usurper'];
  v.whispers = 4;
  v.news = true;
  return v;
}

export function completeLedger() {
  const v = freshLedger();
  v.deeds = deeds(24);
  v.runsPlayed = 24;
  v.quests = Object.fromEntries(QIDS.map((id) => [id, quest('complete', TARGET[id])]));
  v.shards = [...QIDS];
  v.whispers = 24;
  v.news = true;
  return v;
}

export async function seed(page, vigil) {
  await page.goto('/');
  await page.waitForFunction(() => window.spirebound && window.__probe);
  await page.evaluate((value) => {
    localStorage.removeItem('spirebound_save_v2');
    localStorage.setItem('spirebound_vigil_v2', JSON.stringify(value));
  }, vigil);
  await page.reload();
  await page.waitForFunction(() => window.spirebound && window.__probe);
}
