import { expect, test } from '@playwright/test';
import { readFileSync } from 'node:fs';

const fixture = (name) => JSON.parse(readFileSync(
  new URL(`./fixtures/sim/${name}.json`, import.meta.url), 'utf8',
));

function progressionRoundFixture(label, winRate = null) {
  const report = structuredClone(fixture('schema-1-round'));
  report.meta.label = label;
  report.meta.config.policy = 'progression';
  report.policies.progression = report.policies.greedy;
  delete report.policies.greedy;
  report.policies.progression.meta = {
    ...report.policies.progression.meta,
    mode: 'round', policyId: 'progression', policyVersion: 1,
    knowledgeClass: 'player-visible',
    interpretation: {
      id: 'goal-directed-machine', label: 'Goal-directed machine-policy evidence',
      balanceEligible: true,
    },
  };
  if (winRate != null) report.policies.progression.headline.winRate = winRate;
  return report;
}

function rateCell(n, wins) {
  const rate = wins / n; const z = 1.96; const denominator = 1 + z * z / n;
  const centre = (rate + z * z / (2 * n)) / denominator;
  const margin = z * Math.sqrt(rate * (1 - rate) / n + z * z / (4 * n * n)) / denominator;
  return { n, wins, winRate: rate, wilson95: [centre - margin, centre + margin] };
}

function balanceRoundFixture(label, ashwardenRate = 0.92) {
  const report = structuredClone(fixture('schema-1-round'));
  report.meta.label = label;
  report.meta.runs = 2000;
  const section = report.policies.greedy; const headline = section.headline;
  section.meta = {
    ...section.meta, mode: 'round', runs: 2000, policyId: 'greedy', policyVersion: 1,
    knowledgeClass: 'player-visible',
    interpretation: { id: 'win-first-machine', label: 'Win-first machine-policy evidence', balanceEligible: true },
  };
  const totalWins = 758 + Math.round(ashwardenRate * 1000);
  const overall = rateCell(2000, totalWins);
  Object.assign(headline, { wins: overall.wins, winRate: overall.winRate, wilson95: overall.wilson95, actReach: [2000, 1900, 1800, totalWins] });
  headline.byAspect = {
    0: rateCell(1000, 758),
    1: rateCell(1000, Math.round(ashwardenRate * 1000)),
  };
  const freshWins = Math.round(totalWins * 0.47735);
  headline.byProfile = {
    fresh: rateCell(1000, freshWins),
    revealed: rateCell(1000, totalWins - freshWins),
  };
  const ashVow0Wins = Math.round((ashwardenRate + 0.08) * 500);
  const ashVow5Wins = Math.round((ashwardenRate - 0.08) * 500);
  headline.byAspectVow = {
    '0|0': rateCell(500, 430),
    '0|5': rateCell(500, 328),
    '1|0': rateCell(500, ashVow0Wins),
    '1|5': rateCell(500, ashVow5Wins),
  };
  headline.byVow = {
    0: rateCell(1000, 430 + ashVow0Wins),
    5: rateCell(1000, 328 + ashVow5Wins),
  };
  section.cards = {
    strike: { offered: 100, picked: ashwardenRate === 0.92 ? 25 : 50, winRateWhenDrafted: 0.8 },
    zeroOffer: { offered: 0, picked: 0, winRateWhenDrafted: null },
    ...(ashwardenRate === 0.92 ? { sourceOnly: { offered: 10, picked: 3, winRateWhenDrafted: 0.7 } } : {}),
  };
  return report;
}

function cycleRound(ordinal, atRisk, dawns, falls = atRisk - dawns) {
  const stats = rateCell(atRisk, dawns);
  return { ordinal, atRisk, started: atRisk, dawns, falls, errors: 0, winRate: stats.winRate, wilson95: stats.wilson95 };
}

function cycleCandidateFixture() {
  const report = structuredClone(fixture('schema-2-progression'));
  report.meta.label = 'Schema 2 progression candidate'; report.meta.gitRev = 'fixture2b'; report.meta.totalRounds = 9;
  const section = report.policies.progression;
  section.meta.totalRounds = 9;
  section.rounds = [cycleRound(1, 2, 2), cycleRound(2, 2, 2), cycleRound(3, 2, 2), cycleRound(4, 1, 1), cycleRound(5, 1, 1), cycleRound(6, 1, 1)];
  Object.assign(section.progressiveSuffix.rounds[0], { clusters: 2, wins: 7, n: 7, winRate: 1, clusterBootstrap95: [1, 1] });
  Object.assign(section.completion.counts, { completed: 1, censored: 1, failed: 0, timingPopulation: 2 });
  Object.assign(section.completion.rates, { completion: 0.5, censoring: 0.5, failure: 0 });
  Object.assign(section.completion.completedOnly, { n: 1, histogram: [{ round: 3, count: 1 }], meanRounds: 3, p10: 3, p50: 3, p90: 3 });
  Object.assign(section.completion.threshold, { histogram: [{ round: 3, count: 1 }] });
  Object.assign(section.completion.delivery, { histogram: [{ round: 3, count: 1 }] });
  Object.assign(section.completion.kaplanMeier.restrictedMeanRounds, { through: 6, value: 4.5 });
  Object.assign(section.progressiveSuffix.perfectSuffixStart, { p10: 1, p50: 1, p90: 1 });
  section.triggers.funnels['act4Reveal.staged'] = { eligible: 1, attempted: 1, succeeded: 1, missed: 0, reasons: {} };
  return report;
}

function emptyCandidateCellFixture() {
  const report = balanceRoundFixture('Round candidate with an empty retained cell', 0.84);
  report.policies.greedy.headline.byAspectVow['0|5'] = { n: 0, wins: 0, winRate: null, wilson95: [null, null] };
  return report;
}

function incompleteProvenanceFixture() {
  const report = balanceRoundFixture('Round candidate without policy version', 0.84);
  delete report.policies.greedy.meta.policyVersion;
  return report;
}

function ineligibleCandidateFixture() {
  const report = balanceRoundFixture('Round candidate excluded from balance', 0.84);
  report.policies.greedy.meta.interpretation.balanceEligible = false;
  return report;
}

function differentHorizonFixture() {
  const report = cycleCandidateFixture();
  report.meta.label = 'Schema 2 progression with a different horizon';
  report.meta.config.maxRounds = 7;
  report.policies.progression.meta.maxRounds = 7;
  return report;
}

function missingJointFixture() {
  const report = balanceRoundFixture('Round without retained joint grain');
  delete report.policies.greedy.headline.byAspectVow;
  return report;
}

const REPORTS = Object.freeze({
  'schema-1-round.json': fixture('schema-1-round'),
  'schema-1-balance-round.json': balanceRoundFixture('Round balance norm'),
  'schema-1-balance-round-b.json': balanceRoundFixture('Round balance candidate', 0.84),
  'schema-1-balance-empty-cell.json': emptyCandidateCellFixture(),
  'schema-1-balance-no-joint.json': missingJointFixture(),
  'schema-1-balance-incomplete-provenance.json': incompleteProvenanceFixture(),
  'schema-1-balance-ineligible.json': ineligibleCandidateFixture(),
  'schema-1-progression-round.json': progressionRoundFixture('Schema 1 Progression Round fixture'),
  'schema-1-progression-round-b.json': progressionRoundFixture('Schema 1 Progression Round B fixture', 0.5),
  'schema-2-progression.json': fixture('schema-2-progression'),
  'schema-2-progression-b.json': cycleCandidateFixture(),
  'schema-2-progression-horizon.json': differentHorizonFixture(),
  'schema-2-coverage-censored.json': fixture('schema-2-coverage-censored'),
});

const METADATA = Object.freeze({
  schemaVersion: 2,
  modes: ['round', 'cycle'],
  defaults: {
    round: 'greedy', cycle: 'progression', mode: 'round', runs: 10_000,
    cycles: 100, maxRounds: 100, profile: 'revealed', workers: 'auto',
    label: 'proving-grounds',
  },
  limits: {
    maxRounds: 1000, runs: 1_000_000, cycles: 1_000_000, workers: 32,
    cycleRounds: 100_000, suffixBootstrapDraws: 100_000_000,
  },
  targets: ['page.take', 'shade.qualifying-fall', 'usurper.buy'],
  policies: [
    { id: 'random', modes: ['round'], knowledgeClass: 'baseline' },
    { id: 'greedy', modes: ['round'], knowledgeClass: 'player-visible' },
    {
      id: 'progression', modes: ['round', 'cycle'], knowledgeClass: 'player-visible',
      reportInterpretation: { id: 'goal-directed-machine', label: 'Goal-directed machine-policy evidence', balanceEligible: true },
    },
    {
      id: 'coverage', modes: ['cycle'], knowledgeClass: 'coverage-only',
      reportInterpretation: { id: 'qa-operational-only', label: 'QA-only operational evidence', balanceEligible: false },
    },
  ],
});

function summary(name) {
  const report = REPORTS[name];
  const section = Object.values(report.policies)[0];
  return {
    name,
    label: report.meta.label,
    schema: report.meta.schema,
    mode: report.meta.mode,
    policy: report.meta.config.policy,
    runs: report.meta.runs || 0,
    cycles: report.meta.cycles || 0,
    totalRounds: report.meta.totalRounds || 0,
    winRate: section.headline?.winRate ?? null,
  };
}

async function openLab(page, names, onRun = null, { unavailable = new Set() } = {}) {
  await page.route('**/__sim-metadata', (route) => route.fulfill({ json: METADATA }));
  await page.route('**/__sim-reports', (route) => route.fulfill({ json: names.map(summary) }));
  await page.route(/\/__sim-report\?/, (route) => {
    const name = new URL(route.request().url()).searchParams.get('f');
    if (unavailable.has(name)) return route.fulfill({ status: 404, json: { problems: [`report unavailable: ${name}`] } });
    return route.fulfill({ json: REPORTS[name] });
  });
  await page.route('**/__sim-status', (route) => route.fulfill({ json: { running: false } }));
  await page.route('**/__sim-run', async (route) => {
    const payload = route.request().postDataJSON();
    onRun?.(payload);
    await route.fulfill({ status: 202, json: { ok: true, config: payload } });
  });
  await page.goto('/?sim=1');
  await expect(page.getByRole('heading', { name: 'Proving Grounds' })).toBeVisible();
}

test('real simulation endpoint rejects work and count limits consistently', async ({ request }) => {
  const metadataResponse = await request.get('/__sim-metadata');
  expect(metadataResponse.ok()).toBe(true);
  const metadata = await metadataResponse.json();
  expect(metadata.limits).toMatchObject(METADATA.limits);

  for (const data of [
    { mode: 'round', runs: metadata.limits.runs + 1, policy: 'greedy', profile: 'revealed' },
    { mode: 'cycle', cycles: metadata.limits.cycles + 1, maxRounds: 1, policy: 'progression' },
    { mode: 'cycle', cycles: 101, maxRounds: 1000, policy: 'progression' },
    { mode: 'round', runs: 1, policy: 'greedy', profile: 'revealed', workers: metadata.limits.workers + 1 },
  ]) {
    const response = await request.post('/__sim-run', { data });
    expect(response.status()).toBe(400);
    expect((await response.json()).problems.length).toBeGreaterThan(0);
  }
});

test('schema 2 cycle evidence renders and replacing it with schema 1 falls back to Headline', async ({ page }) => {
  await openLab(page, ['schema-2-progression.json', 'schema-1-round.json']);

  await expect(page.getByText('Goal-directed machine-policy evidence').first()).toBeVisible();
  await expect(page.getByText('This is not observed player win-rate proof.')).toBeVisible();
  await expect(page.getByText('Act IV promise', { exact: false }).first()).toBeVisible();

  const cycleTab = page.getByRole('tab', { name: 'Cycle / Progress' });
  await cycleTab.focus();
  await page.keyboard.press('Enter');
  await expect(cycleTab).toHaveAttribute('aria-selected', 'true');
  await expect(page.getByRole('heading', { name: 'Round Dawn rate' })).toBeVisible();
  await expect(page.getByRole('table', { name: /Round ordinal Dawn rates/ })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Rounds to the Act IV promise' })).toBeVisible();

  await page.getByRole('button', { name: /Schema 1 Round fixture/ }).click();
  await expect(page.getByRole('tab', { name: 'Headline' })).toHaveAttribute('aria-selected', 'true');
  await expect(page.getByRole('heading', { name: 'Run verdict' })).toBeVisible();
  await expect(page.getByRole('tab', { name: 'Cycle / Progress' })).toHaveCount(0);
});

test('Round progression is labelled as machine-policy evidence, not player telemetry', async ({ page }) => {
  await openLab(page, ['schema-1-progression-round.json']);
  await expect(page.getByText('Goal-directed machine-policy evidence').first()).toBeVisible();
  await expect(page.getByText('This is not observed player win-rate proof.')).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Machine-policy signals' })).toBeVisible();
});

test('balance entry names both characters and leads into the Pivot Explorer', async ({ page }) => {
  await openLab(page, ['schema-1-balance-round.json']);

  await expect(page.getByRole('heading', { name: 'Strongest balance signal' })).toBeVisible();
  await expect(page.getByText('Ashwarden leads Duskblade by 16.2 pp')).toBeVisible();
  await expect(page.getByText('Duskblade', { exact: true }).first()).toBeVisible();
  await expect(page.getByText('Ashwarden', { exact: true }).first()).toBeVisible();
  await expect(page.getByRole('form', { name: 'Run simulation' })).toHaveCount(0);

  await page.getByRole('button', { name: 'Open Pivot Explorer' }).click();
  await expect(page.getByRole('tab', { name: 'Explorer' })).toHaveAttribute('aria-selected', 'true');
  await expect(page.getByRole('heading', { name: 'Pivot Explorer' })).toBeVisible();
});

test('Pivot Explorer composes Character by Vow, guards absent grains, and inspects evidence', async ({ page }) => {
  await openLab(page, ['schema-1-balance-round.json']);
  await page.getByRole('tab', { name: 'Explorer' }).click();

  await expect(page.getByLabel('Dataset')).toHaveValue('win-rate');
  await expect(page.getByLabel('Rows')).toHaveValue('aspect');
  await expect(page.getByLabel('Columns')).toHaveValue('vow');
  const pivot = page.getByRole('table', { name: 'Pivot Explorer values' });
  await expect(pivot.getByRole('rowheader', { name: 'Duskblade' })).toBeVisible();
  await expect(pivot.getByRole('rowheader', { name: 'Ashwarden' })).toBeVisible();
  await expect(pivot.getByRole('columnheader', { name: 'Vow 0' })).toBeVisible();
  await expect(pivot.getByRole('columnheader', { name: 'Vow 5' })).toBeVisible();

  await pivot.getByRole('button', { name: /Duskblade · Vow 5/ }).click();
  const inspector = page.getByRole('region', { name: 'Evidence inspector' });
  await expect(inspector.getByText('328 / 500')).toBeVisible();
  await expect(inspector.getByText('95% Wilson interval')).toBeVisible();

  await page.getByLabel('Filter').selectOption('vow=5');
  await expect(page.getByRole('columnheader', { name: 'Vow 5' })).toBeVisible();
  await expect(page.getByRole('columnheader', { name: 'Vow 0' })).toHaveCount(0);

  await page.getByLabel('Rows').selectOption('profile');
  await expect(page.getByText('Joint grain not present')).toBeVisible();
  await expect(page.getByText(/Profile × Vow/)).toBeVisible();
  await expect(page.getByRole('table', { name: 'Pivot Explorer values' })).toHaveCount(0);
});

test('Pivot Explorer blocks a supported joint grain when the report did not retain its cells', async ({ page }) => {
  await openLab(page, ['schema-1-balance-no-joint.json']);
  await page.getByRole('tab', { name: 'Explorer' }).click();

  await expect(page.getByText('Joint grain not present')).toBeVisible();
  await expect(page.getByText(/Character × Vow/)).toBeVisible();
  await expect(page.getByRole('table', { name: 'Pivot Explorer values' })).toHaveCount(0);
});

test('Pivot Explorer compares compatible report sources and restores an exact saved view', async ({ page }) => {
  await openLab(page, ['schema-1-balance-round.json', 'schema-1-balance-round-b.json']);
  await page.getByRole('tab', { name: 'Explorer' }).click();

  await page.getByLabel('Candidate report').selectOption('schema-1-balance-round-b.json');
  await expect(page.getByText('Compatible delta')).toBeVisible();
  await expect(page.getByRole('table', { name: 'Pivot Explorer values' }).getByText(/−8.0 pp/).first()).toBeVisible();

  await page.getByLabel('Saved view name').fill('Character vow norm');
  await page.getByRole('button', { name: 'Save view' }).click();
  await page.getByLabel('Rows').selectOption('vow');
  await page.getByRole('button', { name: 'Load saved view Character vow norm' }).click();
  await expect(page.getByLabel('Rows')).toHaveValue('aspect');
  await expect(page.getByLabel('Columns')).toHaveValue('vow');
  await expect(page.getByLabel('Candidate report')).toHaveValue('schema-1-balance-round-b.json');
});

test('comparison requires explicit eligible provenance and a matching Cycle horizon', async ({ page }) => {
  await openLab(page, [
    'schema-1-balance-round.json',
    'schema-1-balance-incomplete-provenance.json',
    'schema-1-balance-ineligible.json',
  ]);
  await page.getByRole('tab', { name: 'Explorer' }).click();

  await page.getByLabel('Candidate report').selectOption('schema-1-balance-incomplete-provenance.json');
  await expect(page.getByText('Candidate provenance incomplete')).toBeVisible();
  await expect(page.getByText('Compatible delta')).toHaveCount(0);

  await page.getByLabel('Candidate report').selectOption('schema-1-balance-ineligible.json');
  await expect(page.getByText('Balance eligibility required')).toBeVisible();
  await expect(page.getByText('Compatible delta')).toHaveCount(0);

  await page.unrouteAll({ behavior: 'wait' });
  await openLab(page, ['schema-2-progression.json', 'schema-2-progression-horizon.json']);
  await page.getByRole('tab', { name: 'Explorer' }).click();
  await page.getByLabel('Candidate report').selectOption('schema-2-progression-horizon.json');
  await expect(page.getByText('Incompatible evidence universes')).toBeVisible();
  await expect(page.getByRole('columnheader', { name: 'Δ Dawn' })).toHaveCount(0);

  await page.getByRole('tab', { name: 'Compare' }).click();
  await expect(page.getByText('Incompatible evidence universes')).toBeVisible();
});

test('candidate joint grain is guarded bilaterally', async ({ page }) => {
  await openLab(page, ['schema-1-balance-round.json', 'schema-1-balance-no-joint.json']);
  await page.getByRole('tab', { name: 'Explorer' }).click();
  await page.getByLabel('Candidate report').selectOption('schema-1-balance-no-joint.json');

  await expect(page.getByText('Candidate grain not present')).toBeVisible();
  const pivot = page.getByRole('table', { name: 'Pivot Explorer values' });
  await expect(pivot.getByRole('rowheader', { name: 'Duskblade' })).toBeVisible();
  await pivot.getByRole('button', { name: /Duskblade · Vow 5/ }).click();
  await expect(page.getByRole('region', { name: 'Evidence inspector' }).locator('dt', { hasText: 'Candidate value' }).locator('+ dd')).toHaveText('Unavailable');
});

test('win-rate pivot keeps an empty candidate rate unavailable and inspects the selected measure', async ({ page }) => {
  await openLab(page, ['schema-1-balance-round.json', 'schema-1-balance-empty-cell.json']);
  await page.getByRole('tab', { name: 'Explorer' }).click();
  await page.getByLabel('Candidate report').selectOption('schema-1-balance-empty-cell.json');

  let pivot = page.getByRole('table', { name: 'Pivot Explorer values' });
  await pivot.getByRole('button', { name: /Duskblade · Vow 5/ }).click();
  const inspector = page.getByRole('region', { name: 'Evidence inspector' });
  await expect(inspector.locator('dt', { hasText: 'Candidate value' }).locator('+ dd')).toHaveText('Unavailable');
  await expect(inspector.locator('dt', { hasText: 'Candidate − Source' }).locator('+ dd')).toHaveText('—');

  await page.getByLabel('Measure').selectOption('wins');
  pivot = page.getByRole('table', { name: 'Pivot Explorer values' });
  await pivot.getByRole('button', { name: /Duskblade · Vow 5/ }).click();
  await expect(inspector.locator('dt', { hasText: 'Measure' }).locator('+ dd')).toHaveText('Wins');
  await expect(inspector.locator('dt', { hasText: 'Source value' }).locator('+ dd')).toHaveText('328');
  await expect(inspector.locator('dt', { hasText: 'Candidate value' }).locator('+ dd')).toHaveText('0');

  await page.getByLabel('Measure').selectOption('n');
  await page.getByRole('table', { name: 'Pivot Explorer values' }).getByRole('button', { name: /Duskblade · Vow 5/ }).click();
  await expect(inspector.locator('dt', { hasText: 'Measure' }).locator('+ dd')).toHaveText('Population');
  await expect(inspector.locator('dt', { hasText: 'Source value' }).locator('+ dd')).toHaveText('500');
});

test('saved views fail closed when their exact source or candidate report disappears in-session', async ({ page }) => {
  const unavailable = new Set();
  await openLab(page, ['schema-1-balance-round.json', 'schema-1-balance-round-b.json'], null, { unavailable });
  await page.getByRole('tab', { name: 'Explorer' }).click();
  await page.getByLabel('Saved view name').fill('Exact source');
  await page.getByRole('button', { name: 'Save view' }).click();

  unavailable.add('schema-1-balance-round.json');
  await page.getByLabel('Rows').selectOption('vow');
  await page.getByRole('button', { name: 'Load saved view Exact source' }).click();
  await expect(page.locator('.pg-banner.error')).toContainText('Could not load saved view: report unavailable');
  await expect(page.locator('#pg-heading')).toContainText('Round balance norm');
  await expect(page.getByLabel('Rows')).toHaveValue('vow');

  unavailable.clear();
  await page.getByLabel('Candidate report').selectOption('schema-1-balance-round-b.json');
  await expect(page.getByText('Compatible delta')).toBeVisible();
  await page.getByLabel('Saved view name').fill('Exact candidate');
  await page.getByRole('button', { name: 'Save view' }).click();

  unavailable.add('schema-1-balance-round-b.json');
  await page.getByLabel('Rows').selectOption('aspect');
  await page.getByRole('button', { name: 'Load saved view Exact candidate' }).click();
  await expect(page.locator('.pg-banner.error')).toContainText('Could not load saved view: report unavailable');
  await expect(page.getByLabel('Rows')).toHaveValue('aspect');
  await expect(page.getByLabel('Candidate report')).toHaveValue('schema-1-balance-round-b.json');
});

test('aggregate pivots keep zero denominators and missing candidate cells unavailable', async ({ page }) => {
  await openLab(page, ['schema-1-balance-round.json', 'schema-1-balance-round-b.json']);
  await page.getByRole('tab', { name: 'Explorer' }).click();
  await page.getByLabel('Candidate report').selectOption('schema-1-balance-round-b.json');
  await page.getByLabel('Dataset').selectOption('cards');

  const pivot = page.getByRole('table', { name: 'Pivot Explorer values' });
  const zeroOffer = pivot.getByRole('row').filter({ hasText: 'zeroOffer' });
  await expect(zeroOffer.getByRole('button')).toHaveText('—');
  await zeroOffer.getByRole('button').click();
  const inspector = page.getByRole('region', { name: 'Evidence inspector' });
  await expect(inspector.getByText('0 / 0').first()).toBeVisible();
  await expect(inspector.locator('dt', { hasText: 'Source value' }).locator('+ dd')).toHaveText('—');

  const sourceOnly = pivot.getByRole('row').filter({ hasText: 'sourceOnly' });
  await expect(sourceOnly).toContainText('—');
  await expect(sourceOnly).not.toContainText('−30.0 pp');
  await pivot.getByRole('button', { name: 'Inspect strike pickRate' }).click();
  await expect(inspector.getByText('25 / 100')).toBeVisible();
  await expect(inspector.getByText('50 / 100')).toBeVisible();
  await expect(inspector.getByText('Candidate provenance')).toBeVisible();
});

test('Cycle Pivot Explorer keeps Round and progressive-suffix denominators explicit', async ({ page }) => {
  await openLab(page, ['schema-2-progression.json']);
  await page.getByRole('tab', { name: 'Explorer' }).click();

  await expect(page.getByLabel('Dataset')).toHaveValue('cycle-rounds');
  const pivot = page.getByRole('table', { name: 'Pivot Explorer values' });
  await expect(pivot.getByRole('columnheader', { name: 'At risk' })).toBeVisible();
  await expect(pivot.getByRole('columnheader', { name: 'Dawn rate', exact: true })).toBeVisible();
  await expect(pivot.getByRole('columnheader', { name: 'Suffix attempts' })).toBeVisible();
  await expect(pivot.getByRole('columnheader', { name: 'Suffix Dawn rate' })).toBeVisible();
  await expect(page.getByText('Whole-cycle cluster bootstrap')).toBeVisible();
  await pivot.getByRole('button', { name: 'Inspect Round 1 Dawn rate' }).click();
  const inspector = page.getByRole('region', { name: 'Evidence inspector' });
  await expect(inspector.getByText('1 / 2')).toBeVisible();
  await expect(inspector.getByText('95% Wilson interval')).toBeVisible();
});

test('Cycle measures, compatible deltas, and completion evidence are functional', async ({ page }) => {
  await openLab(page, ['schema-2-progression.json', 'schema-2-progression-b.json']);
  await page.getByRole('tab', { name: 'Explorer' }).click();
  await page.getByLabel('Candidate report').selectOption('schema-2-progression-b.json');

  await page.getByLabel('Measure').selectOption('dawn');
  let pivot = page.getByRole('table', { name: 'Pivot Explorer values' });
  await expect(pivot.getByRole('columnheader', { name: 'Suffix attempts' })).toHaveCount(0);
  await expect(pivot.getByRole('columnheader', { name: 'Δ Dawn' })).toBeVisible();
  await expect(pivot.getByText('+50.0 pp')).toBeVisible();

  await page.getByLabel('Measure').selectOption('suffix');
  await expect(pivot.getByRole('columnheader', { name: 'At risk' })).toHaveCount(0);
  await expect(pivot.getByRole('columnheader', { name: 'Δ suffix' })).toBeVisible();

  await page.getByLabel('Dataset').selectOption('cycle-completion');
  pivot = page.getByRole('table', { name: 'Pivot Explorer values' });
  await pivot.getByRole('button', { name: 'Inspect Completion rate' }).click();
  const inspector = page.getByRole('region', { name: 'Evidence inspector' });
  await expect(inspector.getByText('2 / 2')).toBeVisible();
  await expect(inspector.getByText('1 / 2')).toBeVisible();
  await expect(inspector.getByText('Descriptive cycle proportion; no interval stored')).toBeVisible();
  await expect(inspector.getByText('50.0%')).toBeVisible();
  await expect(inspector.getByText('Candidate provenance')).toBeVisible();
});

test('coverage Explorer renders the complete trigger funnel and preserves zero-attempt uncertainty', async ({ page }) => {
  await openLab(page, ['schema-2-coverage-censored.json']);
  await page.getByRole('tab', { name: 'Explorer' }).click();

  const pivot = page.getByRole('table', { name: 'Pivot Explorer values' });
  for (const heading of ['Eligible', 'Attempted', 'Succeeded', 'Missed', 'Success rate', 'Miss reasons']) {
    await expect(pivot.getByRole('columnheader', { name: heading })).toBeVisible();
  }
  const buy = pivot.getByRole('row').filter({ hasText: 'usurper.buy' });
  await expect(buy.getByRole('button', { name: /Success rate/ })).toHaveText('—');
  await buy.getByRole('button', { name: /Success rate/ }).click();
  const inspector = page.getByRole('region', { name: 'Evidence inspector' });
  await expect(inspector.getByText('0 / 0')).toBeVisible();
  await expect(inspector.getByText('Attempt success proportion; no interval stored')).toBeVisible();
});

test('Compare derives a shared Progressive Round policy from compatible reports', async ({ page }) => {
  await openLab(page, ['schema-1-progression-round.json', 'schema-1-progression-round-b.json']);
  await page.getByRole('tab', { name: 'Compare' }).click();

  await expect(page.locator('#pg-compare-policy')).toHaveValue('progression');
  const compareCard = page.getByRole('heading', { name: 'A/B balance glass' }).locator('..');
  await expect(compareCard).toBeVisible();
  await expect(compareCard.getByText('Goal-directed machine-policy evidence')).toBeVisible();
  await expect(compareCard.getByText('Not observed player win-rate proof.')).toBeVisible();
  await expect(page.getByText('Policy provenance differs')).toHaveCount(0);
});

test('all-censored coverage opens trigger-first, excludes Compare, and copies explicit-target repro by keyboard', async ({ page }) => {
  await page.addInitScript(() => {
    window.__simCopiedText = '';
    Object.defineProperty(navigator, 'clipboard', {
      configurable: true,
      value: {
        writeText: async (text) => { window.__simCopiedText = text; },
        readText: async () => window.__simCopiedText,
      },
    });
  });
  await openLab(page, ['schema-2-coverage-censored.json', 'schema-2-progression.json']);

  await expect(page.getByRole('tab', { name: 'Cycle / Progress' })).toHaveAttribute('aria-selected', 'true');
  await expect(page.getByRole('tab', { name: 'Compare' })).toHaveCount(0);
  await expect(page.getByText('QA operational evidence').first()).toBeVisible();
  await expect(page.getByText('No completed cycles')).toBeVisible();
  await expect(page.getByText('Unavailable', { exact: true }).first()).toBeVisible();
  const triggerHeading = page.getByRole('heading', { name: 'Quest and trigger funnels' });
  const roundHeading = page.getByRole('heading', { name: 'Round Dawn rate' });
  const [triggerBox, roundBox] = await Promise.all([triggerHeading.boundingBox(), roundHeading.boundingBox()]);
  expect(triggerBox.y).toBeLessThan(roundBox.y);

  const issuesTab = page.getByRole('tab', { name: 'Issues' });
  await issuesTab.focus();
  await page.keyboard.press(' ');
  const copy = page.getByRole('button', { name: 'Copy reproduction for cycle 701' });
  await expect(copy).toBeVisible();
  await copy.focus();
  await page.keyboard.press('Enter');
  await expect(copy).toHaveText('Copied');
  await expect.poll(() => page.evaluate(() => window.__simCopiedText)).toContain(
    '--mode cycle --cycles 1 --max-rounds 3 --policy coverage --target usurper.buy',
  );
});

test('mode and policy controls expose Target only for coverage and submit an explicit target', async ({ page }) => {
  let submitted = null;
  await openLab(page, ['schema-2-progression.json'], (payload) => { submitted = payload; });
  await page.getByRole('button', { name: 'New sweep' }).click();
  const form = page.getByRole('form', { name: 'Run simulation' });

  await expect(form.locator('[name="runs"]')).toHaveValue(String(METADATA.defaults.runs));
  await expect(form.locator('[name="profile"]')).toHaveValue(METADATA.defaults.profile);
  await expect(form.locator('[name="label"]')).toHaveValue(METADATA.defaults.label);

  await page.getByLabel('Simulation mode').selectOption('cycle');
  await expect(form.locator('[name="cycles"]')).toBeVisible();
  await expect(form.locator('[name="maxRounds"]')).toBeVisible();
  await expect(form.locator('[name="profile"]')).toHaveCount(0);
  await expect(form.locator('[name="target"]')).toHaveCount(0);
  await form.locator('[name="policy"]').selectOption('coverage');
  await expect(form.getByLabel('Target')).toBeVisible();
  await form.getByLabel('Target').selectOption('usurper.buy');
  await form.locator('[name="cycles"]').fill('0');
  await form.locator('[name="maxRounds"]').fill('1001');
  await form.getByRole('button', { name: 'Run simulation' }).click();
  expect(await form.locator('[name="cycles"]').evaluate((input) => input.checkValidity())).toBe(false);
  expect(await form.locator('[name="maxRounds"]').evaluate((input) => input.checkValidity())).toBe(false);
  expect(submitted).toBeNull();
  await form.locator('[name="cycles"]').fill('101');
  await form.locator('[name="maxRounds"]').fill('1000');
  await form.getByRole('button', { name: 'Run simulation' }).click();
  expect(await form.locator('[name="cycles"]').evaluate((input) => input.checkValidity())).toBe(false);
  expect(submitted).toBeNull();
  await form.locator('[name="cycles"]').fill('1');
  await form.locator('[name="maxRounds"]').fill('3');
  await form.getByRole('button', { name: 'Run simulation' }).click();
  await expect.poll(() => submitted).toMatchObject({
    mode: 'cycle', cycles: 1, maxRounds: 3, policy: 'coverage', target: 'usurper.buy',
  });

  await page.getByRole('button', { name: 'New sweep' }).click();
  await page.getByLabel('Simulation mode').selectOption('round');
  await expect(form.locator('[name="target"]')).toHaveCount(0);
  await expect(form.locator('[name="cycles"]')).toHaveCount(0);
  await expect(form.locator('[name="maxRounds"]')).toHaveCount(0);
  await expect(form.locator('[name="profile"]')).toBeVisible();
});

test('narrow coverage report keeps controls usable and wide evidence inside explicit overflow', async ({ page }) => {
  await page.setViewportSize({ width: 360, height: 780 });
  await openLab(page, ['schema-2-coverage-censored.json']);

  await page.getByRole('button', { name: 'New sweep' }).click();
  await expect(page.getByLabel('Simulation mode')).toBeVisible();
  await expect(page.getByRole('tab', { name: 'Cycle / Progress' })).toBeVisible();
  const overflow = await page.getByRole('table', { name: /Version 1 trigger funnel/ }).evaluate((table) => {
    const wrapper = table.closest('.pg-table-wrap');
    return { scrollWidth: wrapper.scrollWidth, clientWidth: wrapper.clientWidth };
  });
  expect(overflow.scrollWidth).toBeGreaterThan(overflow.clientWidth);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
});

test('narrow Pivot Explorer keeps shelves in-flow and confines the matrix overflow', async ({ page }) => {
  await page.setViewportSize({ width: 360, height: 780 });
  await openLab(page, ['schema-1-balance-round.json']);
  await page.getByRole('tab', { name: 'Explorer' }).click();

  await expect(page.getByLabel('Dataset')).toBeVisible();
  await expect(page.getByLabel('Candidate report')).toBeVisible();
  const overflow = await page.getByRole('table', { name: 'Pivot Explorer values' }).evaluate((table) => {
    const wrapper = table.closest('.pg-table-wrap');
    return { scrollWidth: wrapper.scrollWidth, clientWidth: wrapper.clientWidth };
  });
  expect(overflow.scrollWidth).toBeGreaterThan(overflow.clientWidth);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
});
