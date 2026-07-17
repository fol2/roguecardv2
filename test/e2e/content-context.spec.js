// Task 16A — pure presentation resolvers against bound core/sample contexts.
// Does not assign S.run, add a hidden route, or hard-code sample ids in production modules.
import { test, expect } from './trace-fixture.js';
import { collectErrors, expectNoErrors } from './helpers.js';

test('content context binds simultaneous core and sample without S.run', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'desktop', 'content-context is a desktop Vite module check');
  const errors = collectErrors(page);
  await page.goto('/?mesh=0');
  await page.waitForFunction(() => window.spirebound && window.__probe);

  const result = await page.evaluate(async () => {
    const { newRun, contentIdFor, isEphemeralRun, cardData } = await import('/src/engine.js');
    const { createDevRegistry } = await import('/src/packs/dev.js');
    const {
      CORE_CONTENT, bindRunContent, contentViewFor, themeForRun,
    } = await import('/src/ui/content.js');
    const { combatantView } = await import('/src/ui/assets.js');

    const { context: sample } = createDevRegistry({ fixtures: ['sample'] });
    const coreRun = newRun(2601);
    const sampleRun = newRun(2602, { ephemeral: true, content: sample });
    bindRunContent(sampleRun, sample);

    // Never assign the active game run — resolvers take an explicit run argument.
    const before = window.spirebound.S.run;

    const coreTheme = themeForRun(coreRun);
    sampleRun.act = sample.themeOrder.indexOf(
      Object.keys(sample.themes).find((id) => !Object.hasOwn(CORE_CONTENT.themes, id)),
    );
    const sampleTheme = themeForRun(sampleRun);
    const coreCards = contentViewFor(coreRun).cards;
    const sampleCards = contentViewFor(sampleRun).cards;
    const sampleEnemyKey = Object.keys(contentViewFor(sampleRun).enemies)
      .find((id) => !Object.hasOwn(CORE_CONTENT.enemies, id));
    const sampleCardKey = Object.keys(sampleCards)
      .find((id) => !Object.hasOwn(CORE_CONTENT.cards, id));

    const boundCard = cardData({ id: sampleCardKey }, sampleRun);
    const coreOnlyCard = cardData({ id: sampleCardKey });

    const enemyView = combatantView({
      key: sampleEnemyKey,
      presentation: null,
    }, sampleRun);

    return {
      beforeWasNull: before == null,
      afterStillNull: window.spirebound.S.run == null,
      coreId: contentIdFor(coreRun),
      sampleId: contentIdFor(sampleRun),
      sampleEphemeral: isEphemeralRun(sampleRun),
      coreViewIsCore: contentViewFor(coreRun) === CORE_CONTENT,
      sampleViewIsSample: contentViewFor(sampleRun) === sample,
      coreThemeId: coreTheme.id,
      sampleThemeId: sampleTheme.id,
      sampleThemeBackdrop: sampleTheme.plates?.backdrop ?? null,
      actIndexBackdrop: `act${sampleRun.act + 1}-backdrop`,
      sampleCardKey,
      sampleEnemyKey,
      sampleCardName: sampleCards[sampleCardKey]?.name,
      boundCardName: boundCard?.name ?? null,
      coreOnlyCardDefined: coreOnlyCard != null,
      enemyArtKind: enemyView.kind,
      coreHasSampleCard: Object.hasOwn(coreCards, sampleCardKey),
    };
  });

  expect(result.beforeWasNull).toBe(true);
  expect(result.afterStillNull).toBe(true);
  expect(result.coreId).toBe('core');
  expect(result.sampleId).toBe('dev:_sample');
  expect(result.sampleEphemeral).toBe(true);
  expect(result.coreViewIsCore).toBe(true);
  expect(result.sampleViewIsSample).toBe(true);
  expect(result.sampleThemeId).toBe('sampleTheme');
  expect(result.coreThemeId).not.toBe('sampleTheme');
  expect(result.sampleThemeBackdrop).toBeTruthy();
  expect(result.sampleThemeBackdrop).not.toBe(result.actIndexBackdrop);
  expect(result.sampleCardKey).toBeTruthy();
  expect(result.sampleEnemyKey).toBeTruthy();
  expect(result.sampleCardName).toBeTruthy();
  expect(result.boundCardName).toBe(result.sampleCardName);
  expect(result.coreOnlyCardDefined).toBe(false);
  expect(result.coreHasSampleCard).toBe(false);
  expect(result.enemyArtKind).toBeTruthy();

  // Production UI modules must not embed the sample fixture ids.
  const productionHits = await page.evaluate(async () => {
    const mods = [
      '/src/ui/content.js',
      '/src/ui/run-effects.js',
      '/src/ui/combat.js',
      '/src/ui/assets.js',
      '/src/ui/tooltip.js',
      '/src/ui/screens/map.js',
      '/src/ui/screens/gallery.js',
      '/src/ui/screens/title.js',
    ];
    const hits = [];
    for (const url of mods) {
      const src = await (await fetch(url)).text();
      if (/sampleCard|sampleEnemy|sampleTheme/.test(src)) hits.push(url);
    }
    return hits;
  });
  expect(productionHits).toEqual([]);

  const cardDataSites = await page.evaluate(async () => {
    const mods = [
      '/src/ui/tooltip.js',
      '/src/ui/combat.js',
      '/src/ui/overlay.js',
      '/src/ui/screens/reward.js',
    ];
    const oneArg = [];
    for (const url of mods) {
      const src = await (await fetch(url)).text();
      for (const m of src.matchAll(/\bE\.cardData\s*\(\s*([^)]+)\s*\)/g)) {
        if (!m[1].includes(',')) oneArg.push(`${url}:${m[0]}`);
      }
    }
    return oneArg;
  });
  expect(cardDataSites).toEqual([]);

  const sceneBgSource = await page.evaluate(async () => {
    const src = await (await fetch('/src/ui/assets.js')).text();
    return {
      usesThemeForRun: /themeForRun/.test(src),
      usesPlates: /plates/.test(src),
      hardCodedActBackdrop: /act\$\{\s*\(?\s*S\.run/.test(src),
    };
  });
  expect(sceneBgSource.usesThemeForRun).toBe(true);
  expect(sceneBgSource.usesPlates).toBe(true);
  expect(sceneBgSource.hardCodedActBackdrop).toBe(false);

  expectNoErrors(errors);
});
