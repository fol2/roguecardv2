// Telemetry reducer for the proving-grounds sim harness: folds runRecords
// (tools/sim/play-run.mjs) into an integer-counter aggregate, merges worker
// partials associatively (KTD10 — `--workers N` never changes report bytes),
// and finalises report schema v1 with Wilson intervals and auto balance
// flags (spec 2026-07-17 proving-grounds, R2/R5).
//
// Design rules: the aggregate holds integer counters/sums ONLY — every rate,
// average, and Wilson bound is computed once in finalise(), so merge order
// can never perturb floating-point results. Pure Node module: it sees
// runRecords only and imports nothing from src/.

export const SCHEMA_VERSION = 1;
export const ISSUE_DETAIL_CAP = 100;

// spec thresholds ("flags" section), as consts
export const FLAG_THRESHOLDS = Object.freeze({
  cardOfferMin: 200, // card offered >= this ...
  cardPickRateFloor: 0.02, // ... and picked < this share -> card-never-picked
  cardWinRateDelta: 0.08, // winRateWhenDrafted deviating > this from overall ...
  cardWinRateMinRuns: 300, // ... over >= this many drafted runs -> outlier
  enemyKillShareMult: 2, // kill share > mult x encounter share
  winRateSpread: 0.1, // aspect or vow win-rate spread > this
  potionHoardRate: 0.6, // share of deaths holding >= 1 potion > this
});

const WILSON_Z = 1.96; // 95% two-sided normal quantile
const DEATH_KIND = { monster: 'normal', elite: 'elite', boss: 'boss' }; // node type -> spec byKind key

const SCALARS = [
  'runs', 'wins', 'deaths', 'errors', 'floorsSum',
  'fights', 'turnsSum', 'dmgDealtSum', 'dmgTakenSum', 'overkillSum',
  'energyWasteSum', 'kindleSum', 'artSum', 'potionsUsedSum',
  'deathsHoldingPotion', 'potionsHeldAtDeathSum', 'issuesTotal',
];
const COUNTER_MAPS = [
  'actReachedCounts', 'deathByActRow', 'deathByEnemy', 'deathByKind',
  'encountersByEnemy', 'fightsByEnemy', 'turnsSumByEnemy', 'hpLostSumByEnemy',
  'issueSignatures',
];
const CELL_MAPS = ['byAspect', 'byVow', 'byProfile', 'byAspectVow', 'cards', 'relics'];

const bump = (map, key, by = 1) => { map[key] = (map[key] || 0) + by; };
const rate = (num, den) => (den > 0 ? num / den : 0);
const r6 = (x) => Math.round(x * 1e6) / 1e6; // report-side rounding (deterministic)
const cmpStr = (a, b) => (a < b ? -1 : a > b ? 1 : 0); // no localeCompare: locale-independent
// total order over issue entries: seed, then profile (a seed can occur once
// per profile in a --profile both sweep), then position within the record
const issueCmp = (a, b) => a.seed - b.seed || cmpStr(a.profile, b.profile) || a.ord - b.ord;

const sliceCell = (map, key) => map[key] || (map[key] = { n: 0, wins: 0 });
const cardCell = (agg, id) => agg.cards[id] || (agg.cards[id] = {
  offered: 0, picked: 0, draftedRuns: 0, draftedWins: 0,
  winDecks: 0, lossDecks: 0, copiesWinSum: 0, copiesLossSum: 0,
});
const relicCell = (agg, id) => agg.relics[id] || (agg.relics[id] = {
  seen: 0, taken: 0, runsWith: 0, winsWith: 0,
});

export function newAggregate(meta = {}) {
  const agg = { meta: { ...meta } };
  for (const k of SCALARS) agg[k] = 0;
  for (const k of COUNTER_MAPS) agg[k] = {};
  for (const k of CELL_MAPS) agg[k] = {};
  agg.deathByKind = { normal: 0, elite: 0, boss: 0 };
  agg.issueDetail = []; // capped at ISSUE_DETAIL_CAP, always sorted by issueCmp
  return agg;
}

export function reduceRecord(agg, rec) {
  const win = rec.outcome === 'win';
  agg.runs++;
  if (win) agg.wins++;
  else if (rec.outcome === 'death') agg.deaths++;
  else agg.errors++;
  agg.floorsSum += rec.floorsReached;
  bump(agg.actReachedCounts, rec.actReached);
  const slices = [
    [agg.byAspect, rec.cell.aspect], [agg.byVow, rec.cell.vow],
    [agg.byProfile, rec.profile], [agg.byAspectVow, `${rec.cell.aspect}|${rec.cell.vow}`],
  ];
  for (const [map, key] of slices) {
    const c = sliceCell(map, key);
    c.n++;
    if (win) c.wins++;
  }
  if (rec.outcome === 'death' && rec.death) {
    bump(agg.deathByActRow, `${rec.death.act}|${rec.death.row}`);
    bump(agg.deathByEnemy, rec.death.enemy);
    bump(agg.deathByKind, DEATH_KIND[rec.death.kind] || rec.death.kind);
    agg.potionsHeldAtDeathSum += rec.potionsHeldAtDeath;
    if (rec.potionsHeldAtDeath > 0) agg.deathsHoldingPotion++;
  }
  for (const f of rec.fights) {
    agg.fights++;
    agg.turnsSum += f.turns;
    agg.dmgDealtSum += f.dmgDealt;
    agg.dmgTakenSum += f.dmgTaken;
    agg.overkillSum += f.overkill;
    agg.energyWasteSum += f.energyWaste;
    agg.kindleSum += f.kindles;
    agg.artSum += f.arts;
    agg.potionsUsedSum += f.potionsUsed;
    // encounter counts are per enemy instance; per-fight averages use the
    // distinct-per-fight denominator so a paired spawn is one fight, not two
    for (const id of f.enemies) bump(agg.encountersByEnemy, id);
    for (const id of new Set(f.enemies)) {
      bump(agg.fightsByEnemy, id);
      bump(agg.turnsSumByEnemy, id, f.turns);
      bump(agg.hpLostSumByEnemy, id, f.dmgTaken);
    }
  }
  const drafted = new Set();
  for (const d of rec.drafts) {
    for (const id of d.offered) cardCell(agg, id).offered++;
    if (d.picked) {
      cardCell(agg, d.picked).picked++;
      drafted.add(d.picked);
    }
  }
  for (const s of rec.shops) {
    // A shop is another real offer/pick surface. Folding its card choices
    // here keeps the report's generic `offered` / `picked` counters honest;
    // draftedRuns remains once-per-run even when a card is bought twice.
    for (const id of s.offered.cards) cardCell(agg, id).offered++;
    for (const it of s.bought) {
      if (it.kind !== 'card') continue;
      cardCell(agg, it.id).picked++;
      drafted.add(it.id);
    }
  }
  for (const id of drafted) {
    const c = cardCell(agg, id);
    c.draftedRuns++;
    if (win) c.draftedWins++;
  }
  if (rec.outcome !== 'error') { // error runs are neither wins nor losses
    const copies = {};
    for (const c of rec.deck) bump(copies, c.id);
    for (const [id, n] of Object.entries(copies)) {
      const c = cardCell(agg, id);
      if (win) { c.winDecks++; c.copiesWinSum += n; }
      else { c.lossDecks++; c.copiesLossSum += n; }
    }
  }
  const seenRelics = new Set();
  for (const b of rec.bossRelics) {
    for (const id of b.offered) {
      relicCell(agg, id).seen++;
      seenRelics.add(id);
    }
  }
  for (const s of rec.shops) {
    for (const id of s.offered.relics) {
      relicCell(agg, id).seen++;
      seenRelics.add(id);
    }
  }
  for (const id of new Set(rec.relics)) {
    // The final held set is the only runRecord field covering every current
    // acquisition path (boss, shop, auto reward, treasure and starting
    // loadout). Relics are unique, so this is exactly once per run and avoids
    // double-counting the boss/shop decisions above.
    const r = relicCell(agg, id);
    // Auto combat rewards and treasure have no separate offer record, but a
    // held relic was necessarily seen. Count that opportunity unless this run
    // already recorded the same relic on a boss/shop offer surface.
    if (!seenRelics.has(id)) r.seen++;
    r.taken++;
    r.runsWith++;
    if (win) r.winsWith++;
  }
  if (rec.issues.length) {
    const summary = {
      outcome: rec.outcome, actReached: rec.actReached, floorsReached: rec.floorsReached,
      fights: rec.fights.length, hp: rec.hp, gold: rec.gold,
    };
    rec.issues.forEach((iss, ord) => {
      agg.issuesTotal++;
      bump(agg.issueSignatures, `${iss.kind}|${String(iss.message).split('\n')[0]}`);
      agg.issueDetail.push({
        seed: iss.seed, profile: rec.profile, ord, phase: iss.phase, kind: iss.kind,
        message: iss.message, stack: iss.stack ?? null, summary,
      });
    });
    // keep the smallest CAP by (seed, profile, ord) — min-k selection is
    // associative under merge, so worker partitioning never changes the set
    agg.issueDetail.sort(issueCmp);
    if (agg.issueDetail.length > ISSUE_DETAIL_CAP) agg.issueDetail.length = ISSUE_DETAIL_CAP;
  }
  return agg;
}

// Public batch reducer used by workers and by the split/merge determinism
// checks. Keeping this tiny also makes the intended runRecord[] -> aggregate
// contract explicit instead of asking every caller to reproduce the fold.
export function reduce(records, meta = {}) {
  const agg = newAggregate(meta);
  for (const record of records) reduceRecord(agg, record);
  return agg;
}

const addCounterMaps = (a, b) => {
  const out = { ...a };
  for (const [k, v] of Object.entries(b)) out[k] = (out[k] || 0) + v;
  return out;
};
const addCellMaps = (a, b) => {
  const out = {};
  for (const k of Object.keys(a)) out[k] = { ...a[k] };
  for (const [k, cell] of Object.entries(b)) {
    if (!out[k]) { out[k] = { ...cell }; continue; }
    for (const f of Object.keys(cell)) out[k][f] = (out[k][f] || 0) + cell[f];
  }
  return out;
};

// associative, non-mutating merge of two partial aggregates (KTD10)
export function merge(a, b) {
  const out = newAggregate({ ...a.meta, ...b.meta });
  for (const k of SCALARS) out[k] = a[k] + b[k];
  for (const k of COUNTER_MAPS) out[k] = addCounterMaps(a[k], b[k]);
  for (const k of CELL_MAPS) out[k] = addCellMaps(a[k], b[k]);
  out.issueDetail = [...a.issueDetail, ...b.issueDetail].sort(issueCmp).slice(0, ISSUE_DETAIL_CAP);
  return out;
}

// Wilson score interval, 95% two-sided; n = 0 -> total uncertainty [0, 1]
export function wilson(wins, n) {
  if (!(n > 0)) return { lo: 0, hi: 1 };
  const z = WILSON_Z, z2 = z * z;
  const p = wins / n;
  const denom = 1 + z2 / n;
  const centre = (p + z2 / (2 * n)) / denom;
  const half = (z * Math.sqrt((p * (1 - p)) / n + z2 / (4 * n * n))) / denom;
  return { lo: Math.max(0, centre - half), hi: Math.min(1, centre + half) };
}

const finaliseSlice = (cells) => {
  const out = {};
  for (const [k, c] of Object.entries(cells)) {
    const w = wilson(c.wins, c.n);
    out[k] = { n: c.n, wins: c.wins, winRate: r6(rate(c.wins, c.n)), wilson95: [r6(w.lo), r6(w.hi)] };
  }
  return out;
};
const avgByKey = (sums, counts) => {
  const out = {};
  for (const [id, s] of Object.entries(sums)) out[id] = r6(rate(s, counts[id] || 0));
  return out;
};
const pct = (x) => `${r6(x * 100)}%`;

function computeFlags(agg, overall) {
  const T = FLAG_THRESHOLDS;
  const flags = [];
  for (const [id, c] of Object.entries(agg.cards)) {
    if (c.offered >= T.cardOfferMin && c.picked / c.offered < T.cardPickRateFloor) {
      flags.push({
        kind: 'card-never-picked', id, offered: c.offered, picked: c.picked,
        pickRate: r6(c.picked / c.offered),
        message: `card '${id}' offered ${c.offered}x but picked only ${c.picked}x (${pct(c.picked / c.offered)})`,
      });
    }
    if (c.draftedRuns >= T.cardWinRateMinRuns) {
      const wr = c.draftedWins / c.draftedRuns;
      const delta = wr - overall;
      if (Math.abs(delta) > T.cardWinRateDelta) {
        flags.push({
          kind: 'card-winrate-outlier', id, n: c.draftedRuns,
          winRateWhenDrafted: r6(wr), overall: r6(overall), delta: r6(delta),
          message: `card '${id}' win rate when drafted ${pct(wr)} vs overall ${pct(overall)} (n=${c.draftedRuns})`,
        });
      }
    }
  }
  let encTotal = 0;
  for (const n of Object.values(agg.encountersByEnemy)) encTotal += n;
  if (agg.deaths > 0 && encTotal > 0) {
    for (const [id, kills] of Object.entries(agg.deathByEnemy)) {
      const killShare = kills / agg.deaths;
      const encShare = (agg.encountersByEnemy[id] || 0) / encTotal;
      // Status damage can currently arrive from the walker as a death source
      // (`burn` / `poison`) rather than an enemy id. Retain it in deaths for
      // diagnosis, but a zero encounter denominator cannot support an enemy
      // balance claim.
      if (encShare > 0 && killShare > T.enemyKillShareMult * encShare) {
        flags.push({
          kind: 'enemy-outlier-killer', id, kills,
          killShare: r6(killShare), encounterShare: r6(encShare),
          message: `enemy '${id}' kill share ${pct(killShare)} > ${T.enemyKillShareMult}x its encounter share ${pct(encShare)}`,
        });
      }
    }
  }
  const spreadFlag = (kind, cells) => {
    const keys = Object.keys(cells).sort(cmpStr); // first key wins ties -> deterministic
    if (keys.length < 2) return;
    let min = null, max = null;
    for (const k of keys) {
      const wr = rate(cells[k].wins, cells[k].n);
      if (!min || wr < min.winRate) min = { key: k, winRate: wr };
      if (!max || wr > max.winRate) max = { key: k, winRate: wr };
    }
    const spread = max.winRate - min.winRate;
    if (spread > T.winRateSpread) {
      flags.push({
        kind, spread: r6(spread),
        min: { key: min.key, winRate: r6(min.winRate) },
        max: { key: max.key, winRate: r6(max.winRate) },
        message: `${kind === 'aspect-winrate-spread' ? 'aspect' : 'vow'} win-rate spread ${pct(spread)} (${max.key}: ${pct(max.winRate)} vs ${min.key}: ${pct(min.winRate)})`,
      });
    }
  };
  spreadFlag('aspect-winrate-spread', agg.byAspect);
  spreadFlag('vow-winrate-spread', agg.byVow);
  if (agg.deaths > 0) {
    const hoard = agg.deathsHoldingPotion / agg.deaths;
    if (hoard > T.potionHoardRate) {
      flags.push({
        kind: 'potion-hoarding', rate: r6(hoard), deaths: agg.deaths,
        message: `${pct(hoard)} of deaths happened while holding an unused potion`,
      });
    }
  }
  if (agg.issuesTotal > 0) {
    flags.push({
      kind: 'issues-present', total: agg.issuesTotal,
      message: `${agg.issuesTotal} issue(s) captured — see issues.detail / countsBySignature`,
    });
  }
  return flags.sort((x, y) => cmpStr(x.kind, y.kind) || cmpStr(x.id || '', y.id || ''));
}

// aggregate -> report (schema v1). Non-mutating; all derived stats computed here.
export function finalise(agg) {
  const runs = agg.runs;
  const overall = rate(agg.wins, runs);
  const w = wilson(agg.wins, runs);
  const reached = (act) => { // cumulative funnel: runs whose furthest act >= act
    let n = 0;
    for (const [k, c] of Object.entries(agg.actReachedCounts)) if (Number(k) >= act) n += c;
    return n;
  };
  const headline = {
    wins: agg.wins,
    winRate: r6(overall),
    wilson95: [r6(w.lo), r6(w.hi)],
    byAspect: finaliseSlice(agg.byAspect),
    byVow: finaliseSlice(agg.byVow),
    byProfile: finaliseSlice(agg.byProfile),
    byAspectVow: finaliseSlice(agg.byAspectVow), // additive extension (plan U3): joint aspect x vow cells
    actReach: [reached(0), reached(1), reached(2), agg.wins],
    avgFloorsReached: r6(rate(agg.floorsSum, runs)),
  };
  const deaths = {
    byActRow: Object.entries(agg.deathByActRow)
      .map(([k, count]) => { const [act, row] = k.split('|').map(Number); return [act, row, count]; })
      .sort((x, y) => x[0] - y[0] || x[1] - y[1]),
    byEnemy: { ...agg.deathByEnemy },
    byKind: { ...agg.deathByKind },
    avgHpLostPerFight: avgByKey(agg.hpLostSumByEnemy, agg.fightsByEnemy),
    encountersByEnemy: { ...agg.encountersByEnemy }, // additive extension (plan U3): encounter-share denominator
  };
  const cards = {};
  for (const [id, c] of Object.entries(agg.cards)) {
    cards[id] = {
      offered: c.offered,
      picked: c.picked,
      inWinningDecks: c.winDecks,
      inLosingDecks: c.lossDecks,
      winRateWhenDrafted: c.draftedRuns > 0 ? r6(c.draftedWins / c.draftedRuns) : null,
      avgCopiesWin: c.winDecks > 0 ? r6(c.copiesWinSum / c.winDecks) : null,
      avgCopiesLoss: c.lossDecks > 0 ? r6(c.copiesLossSum / c.lossDecks) : null,
    };
  }
  const relics = {};
  for (const [id, r] of Object.entries(agg.relics)) {
    relics[id] = {
      seen: r.seen,
      taken: r.taken,
      winRateWhenTaken: r.runsWith > 0 ? r6(r.winsWith / r.runsWith) : null,
    };
  }
  const economy = {
    avgTurnsPerFight: avgByKey(agg.turnsSumByEnemy, agg.fightsByEnemy),
    dmgDealtPerTurn: r6(rate(agg.dmgDealtSum, agg.turnsSum)),
    dmgTakenPerTurn: r6(rate(agg.dmgTakenSum, agg.turnsSum)),
    avgOverkill: r6(rate(agg.overkillSum, agg.fights)),
    energyWastePerTurn: r6(rate(agg.energyWasteSum, agg.turnsSum)),
    kindleRate: r6(rate(agg.kindleSum, agg.turnsSum)),
    artRate: r6(rate(agg.artSum, agg.turnsSum)),
    potionsUsed: r6(rate(agg.potionsUsedSum, runs)), // avg per run
    potionsHeldAtDeath: r6(rate(agg.deathsHoldingPotion, agg.deaths)), // share of deaths holding >= 1
  };
  const issues = {
    detail: [...agg.issueDetail].sort(issueCmp).map((e) => ({
      seed: e.seed, profile: e.profile, phase: e.phase, kind: e.kind,
      message: e.message, stack: e.stack, summary: e.summary,
    })),
    countsBySignature: { ...agg.issueSignatures }, // counts ALL issues, incl. the detailed 100
    total: agg.issuesTotal,
  };
  return sortDeep({
    meta: { ...agg.meta, schema: SCHEMA_VERSION, runs },
    headline, deaths, cards, relics, economy, issues,
    flags: computeFlags(agg, overall),
  });
}

const sortDeep = (v) => {
  if (Array.isArray(v)) return v.map(sortDeep);
  if (v && typeof v === 'object') {
    const out = {};
    for (const k of Object.keys(v).sort(cmpStr)) out[k] = sortDeep(v[k]);
    return out;
  }
  return v;
};

// stable serialisation: every object emitted with sorted keys, so the same
// aggregate always produces byte-identical output (R2)
export function serialise(report) {
  return `${JSON.stringify(sortDeep(report), null, 2)}\n`;
}
