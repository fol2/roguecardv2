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

const REPORTS = Object.freeze({
  'schema-1-round.json': fixture('schema-1-round'),
  'schema-1-progression-round.json': progressionRoundFixture('Schema 1 Progression Round fixture'),
  'schema-1-progression-round-b.json': progressionRoundFixture('Schema 1 Progression Round B fixture', 0.5),
  'schema-2-progression.json': fixture('schema-2-progression'),
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

async function openLab(page, names, onRun = null) {
  await page.route('**/__sim-metadata', (route) => route.fulfill({ json: METADATA }));
  await page.route('**/__sim-reports', (route) => route.fulfill({ json: names.map(summary) }));
  await page.route(/\/__sim-report\?/, (route) => {
    const name = new URL(route.request().url()).searchParams.get('f');
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

  await page.getByLabel('Simulation mode').selectOption('round');
  await expect(form.locator('[name="target"]')).toHaveCount(0);
  await expect(form.locator('[name="cycles"]')).toHaveCount(0);
  await expect(form.locator('[name="maxRounds"]')).toHaveCount(0);
  await expect(form.locator('[name="profile"]')).toBeVisible();
});

test('narrow coverage report keeps controls usable and wide evidence inside explicit overflow', async ({ page }) => {
  await page.setViewportSize({ width: 360, height: 780 });
  await openLab(page, ['schema-2-coverage-censored.json']);

  await expect(page.getByLabel('Simulation mode')).toBeVisible();
  await expect(page.getByRole('tab', { name: 'Cycle / Progress' })).toBeVisible();
  const overflow = await page.getByRole('table', { name: /Version 1 trigger funnel/ }).evaluate((table) => {
    const wrapper = table.closest('.pg-table-wrap');
    return { scrollWidth: wrapper.scrollWidth, clientWidth: wrapper.clientWidth };
  });
  expect(overflow.scrollWidth).toBeGreaterThan(overflow.clientWidth);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
});
