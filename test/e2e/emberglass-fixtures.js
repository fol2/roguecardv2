export const QIDS = [
  'paleOnes', 'ownShade', 'usurper',
  'eighthOmen', 'unreadablePage', 'hollowLamplighter',
];

export const PERSISTED_EIGHTH_TEXT = 'PERSISTED EIGHTH SENTINEL — KEEP THIS COPY';
export const PERSISTED_SHADE_TEXT = 'PERSISTED SHADE SENTINEL — KEEP THIS COPY';

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

export function pendingTerminalLedger() {
  const v = freshLedger();
  v.deeds = deeds(5);
  v.deeds.perfects = 2;
  v.unlocks = ['aspect2'];
  v.vowUnlocked = 1;
  v.runsPlayed = 5;
  for (const id of QIDS.slice(0, 5)) {
    v.quests[id] = quest('complete', TARGET[id]);
  }
  v.quests.hollowLamplighter = quest('revealed', 4);
  v.shards = QIDS.slice(0, 5);
  v.whispers = 23;
  return v;
}

export async function seed(page, vigil, url = '/') {
  await page.goto(url);
  await page.waitForFunction(() => window.spirebound && window.__probe);
  await page.evaluate((value) => {
    localStorage.removeItem('spirebound_save_v2');
    localStorage.setItem('spirebound_vigil_v2', JSON.stringify(value));
  }, vigil);
  await page.reload();
  await page.waitForFunction(() => window.spirebound && window.__probe);
  // Probe is installed before the terminal boot `show('title')`. Prefer the
  // traced app.ready marker when the behaviour trace is enabled; otherwise
  // wait for the title paint itself so mid-boot show(...) callers stay safe.
  await page.waitForFunction(() => {
    const records = window.__probe?.behaviourTrace?.()?.records;
    if (Array.isArray(records) && records.some((record) => record.eventName === 'app.ready')) {
      return true;
    }
    return window.spirebound?.S?.screen === 'title'
      && !!document.querySelector('.title-screen, .r5-title, [data-a="embark"]');
  });
}

export async function waitForDawnComplete(page, timeout = 30_000) {
  await page.waitForFunction(() => {
    const ceremony = document.querySelector('.dawn-ceremony');
    const raw = localStorage.getItem('spirebound_save_v2');
    const pending = raw ? JSON.parse(raw).pendingDawn : null;
    const root = document.querySelector('.r5-end, .end-screen');
    // Queue `.complete` alone is not closed — ledger/close still run and keep
    // end buttons locked until `dawn-closed` and the ceremony promise settles.
    const buttons = [...document.querySelectorAll('.end-btns button')];
    return ceremony?.classList.contains('complete')
      && pending == null
      && root?.dataset.r5State === 'dawn-closed'
      && buttons.length > 0
      && buttons.every((button) => !button.disabled);
  }, null, { timeout });
}

export async function stagePendingRunEnd(page, outcome) {
  await seed(page, pendingTerminalLedger());
  return page.evaluate(({ outcome: pendingOutcome, eighthText, shadeText }) => {
    const sp = window.spirebound;
    const vigil = JSON.parse(localStorage.getItem('spirebound_vigil_v2'));
    localStorage.setItem('spirebound_stats_v1', JSON.stringify({
      runs: 5, wins: 5, best: 0, lastRunId: null,
    }));
    const run = sp.E.newRun(9200 + ['win', 'death', 'abandon'].indexOf(pendingOutcome), {
      reveals: ['omens', 'phials', 'poolWave2', 'poolWave3', 'poolFull', 'emberglass'],
      quests: vigil.quests,
      shards: vigil.shards,
      unlocks: vigil.unlocks,
    });
    run.act = 2;
    run.floorsClimbed = 15;
    run.map = sp.E.genMap(run);
    if (pendingOutcome === 'win') {
      run.quests.hollowLamplighter = { state: 'complete', progress: 5, memory: {} };
      run.questCompletions = ['hollowLamplighter'];
      run.stats.perfects = 1;
      run.endQueue = [
        { t: 'questReveal', id: 'hollowLamplighter' },
        { t: 'questProgress', id: 'hollowLamplighter', progress: 5, target: 5 },
        { t: 'questComplete', id: 'hollowLamplighter' },
        { t: 'eighthResolved', text: eighthText },
        { t: 'shadeResolved', text: shadeText },
      ];
    }
    run.pendingRunEnd = { outcome: pendingOutcome };
    if (!sp.E.saveRun(run) || !sp.E.loadRun()) throw new Error('pending terminal run did not round-trip');
    return { runId: run.runId };
  }, {
    outcome,
    eighthText: PERSISTED_EIGHTH_TEXT,
    shadeText: PERSISTED_SHADE_TEXT,
  });
}
