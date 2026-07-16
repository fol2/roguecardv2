// Fixed-viewport contract (hardening spec §1b): the game renders to a fixed
// virtual resolution (one of five canonical shapes) and scales uniformly,
// letterboxed. A bigger window gets bigger pixels, never more world.
import { test, expect } from '@playwright/test';
import { boot, startFight, stable } from './helpers.js';
import { completeLedger, seed, waitForDawnComplete } from './emberglass-fixtures.js';

const EXPECT_SHAPE = {
  desktop: { shape: 'desktop-landscape', w: 1458, h: 820 },
  portrait: { shape: 'phone-portrait', w: 390, h: 844 },
  landscape: { shape: 'phone-landscape', w: 844, h: 390 },
  // Playwright WebKit device projects (patched WebKit + descriptors, not Safari).
  'iphone-webkit': { shape: 'pad-portrait', w: 820, h: 1180 },
  'ipad-webkit': { shape: 'pad-landscape', w: 1180, h: 820 },
};

async function combatGeometry(page) {
  await page.waitForFunction(() => window.__probe?.geometry());
  return page.evaluate(() => window.__probe.geometry());
}

async function expectNoOverflow(page, label, explicit = [], safeExplicit = []) {
  const bad = await page.evaluate(({ selectors, safeSelectors }) => {
    const out = [];
    const tol = 1;
    const de = document.scrollingElement;
    if (de.scrollHeight > de.clientHeight || de.scrollWidth > de.clientWidth) {
      out.push(`document ${de.scrollWidth}x${de.scrollHeight} in ${de.clientWidth}x${de.clientHeight}`);
    }
    const stage = document.getElementById('stage').getBoundingClientRect();
    const rootStyle = getComputedStyle(document.documentElement);
    const stageScale = stage.width / document.getElementById('stage').offsetWidth;
    const safePx = (name) => (Number.parseFloat(rootStyle.getPropertyValue(name)) || 0) * stageScale;
    const safe = {
      left: stage.left + safePx('--sal'),
      right: stage.right - safePx('--sar'),
      top: stage.top + safePx('--sat'),
      bottom: stage.bottom - safePx('--sab'),
    };
    const inside = (inner, outer) => inner.left >= outer.left - tol && inner.right <= outer.right + tol &&
      inner.top >= outer.top - tol && inner.bottom <= outer.bottom + tol;
    const labelFor = (el) => `${el.tagName.toLowerCase()}.${String(el.className).trim().split(/\s+/).join('.')}`;

    for (const selector of selectors) {
      const nodes = [...document.querySelectorAll(selector)];
      if (!nodes.length) {
        out.push(`missing reachable ${selector}`);
        continue;
      }
      for (const el of nodes) {
        const cs = getComputedStyle(el);
        const box = el.getBoundingClientRect();
        if (cs.display === 'none' || cs.visibility === 'hidden' || box.width < 1 || box.height < 1) {
          out.push(`hidden reachable ${labelFor(el)}`);
          continue;
        }
        if (!inside(box, stage)) {
          out.push(`off-stage reachable ${labelFor(el)} [${Math.round(box.left)},${Math.round(box.top)},${Math.round(box.right)},${Math.round(box.bottom)}] in [${Math.round(stage.left)},${Math.round(stage.top)},${Math.round(stage.right)},${Math.round(stage.bottom)}]`);
        }
        const container = el.closest('.rose-slot,.rose-window,.vigil-panel,.ov-panel,.sealed-door-panel,.end-screen');
        if (container && container !== el && !inside(box, container.getBoundingClientRect())) {
          out.push(`clipped reachable ${labelFor(el)}`);
        }
        if (el.matches('.rose-pane-copy,.rose-slot') &&
            (el.scrollWidth > el.clientWidth + tol || el.scrollHeight > el.clientHeight + tol)) {
          out.push(`clipped Rose copy ${labelFor(el)} ${el.scrollWidth}x${el.scrollHeight} in ${el.clientWidth}x${el.clientHeight}`);
        }
      }
    }

    for (const selector of safeSelectors) {
      const nodes = [...document.querySelectorAll(selector)];
      if (!nodes.length) {
        out.push(`missing safe-area ${selector}`);
        continue;
      }
      for (const el of nodes) {
        const box = el.getBoundingClientRect();
        if (!inside(box, safe)) {
          out.push(`outside safe area ${labelFor(el)} [${Math.round(box.left)},${Math.round(box.top)},${Math.round(box.right)},${Math.round(box.bottom)}] in [${Math.round(safe.left)},${Math.round(safe.top)},${Math.round(safe.right)},${Math.round(safe.bottom)}]`);
        }
      }
    }

    for (const el of document.querySelectorAll('.vigil-panel,.ov-panel,.sealed-door-panel,.end-screen')) {
      const cs = getComputedStyle(el);
      if (!/(hidden|clip)/.test(cs.overflowY + cs.overflowX)) continue;
      if (el.scrollHeight > el.clientHeight + tol || el.scrollWidth > el.clientWidth + tol) {
        out.push(`clipped container ${labelFor(el)} ${el.scrollWidth}x${el.scrollHeight} in ${el.clientWidth}x${el.clientHeight}`);
      }
    }

    for (const el of document.querySelectorAll('#stage *')) {
      const cs = getComputedStyle(el);
      if (!/(auto|scroll)/.test(cs.overflowY + cs.overflowX)) continue;
      if (el.scrollWidth > el.clientWidth + tol) {
        out.push(`horizontal scroller ${labelFor(el)} ${el.scrollWidth} in ${el.clientWidth}`);
      }
      if (el.scrollHeight > el.clientHeight + tol) {
        if (el.matches('.deed-list,.whisper-log,.dawn-ceremony')) {
          const old = el.scrollTop;
          el.scrollTop = el.scrollHeight;
          const box = el.getBoundingClientRect();
          const last = el.lastElementChild?.getBoundingClientRect();
          if (!inside(box, stage) || !last || last.bottom > box.bottom + tol || last.bottom < box.top - tol) {
            out.push(`unreachable approved scroller ${labelFor(el)}`);
          }
          el.scrollTop = old;
          continue;
        }
        out.push(`${labelFor(el)} ${el.scrollWidth}x${el.scrollHeight} in ${el.clientWidth}x${el.clientHeight}`);
      }
    }
    return out;
  }, { selectors: explicit, safeSelectors: safeExplicit });
  expect(bad, `${label}: ${bad.join('; ')}`).toEqual([]);
}

test('viewport maps to its canonical stage shape', async ({ page }) => {
  const want = EXPECT_SHAPE[test.info().project.name];
  await boot(page);
  const st = await page.evaluate(() => window.__probe.stage());
  expect(st.shape).toBe(want.shape);
  expect(st.w).toBe(want.w);
  expect(st.h).toBe(want.h);
  // uniform scale + centered letterbox: the stage's real box keeps the
  // stage aspect exactly and never overflows the window
  const box = await page.evaluate(() => {
    const r = document.getElementById('stage').getBoundingClientRect();
    return { l: r.left, t: r.top, w: r.width, h: r.height, iw: innerWidth, ih: innerHeight };
  });
  expect(box.w / box.h).toBeCloseTo(want.w / want.h, 2);
  expect(box.w).toBeLessThanOrEqual(box.iw + 0.5);
  expect(box.h).toBeLessThanOrEqual(box.ih + 0.5);
  expect(box.l).toBeCloseTo((box.iw - box.w) / 2, 0);
  expect(box.t).toBeCloseTo((box.ih - box.h) / 2, 0);
});

test('P1 shared UI modules preserve exact browser boundaries and live commands', async ({ page }) => {
  await boot(page, { query: 'trace=1' });
  expect(await page.evaluate(() => window.__probe.routes())).toEqual([
    'title', 'embark', 'vigil', 'lamplighter', 'hollow', 'map', 'combat',
    'reward', 'bossRelic', 'rest', 'treasure', 'shop', 'event', 'end',
    'gallery', 'audioGallery',
  ]);
  const result = await page.evaluate(async () => {
    const modules = {
      context: await import('/src/ui/context.js'),
      policy: await import('/src/ui/policy.js'),
      format: await import('/src/ui/format.js'),
      rose: await import('/src/ui/rose.js'),
      commands: await import('/src/ui/commands.js'),
    };
    const boundary = {
      show: typeof window.spirebound.show,
      state: typeof window.spirebound.S,
      trace: typeof window.__probe.behaviourTrace,
    };
    const screen = document.getElementById('screen');
    const stale = () => {};
    screen.onclick = stale;
    const beforeUnknown = window.spirebound.S.screen;
    let unknownError = null;
    try { window.spirebound.show('missing-route'); } catch (error) { unknownError = error.message; }
    const unknown = {
      error: unknownError,
      screen: window.spirebound.S.screen,
      sameScreen: window.spirebound.S.screen === beforeUnknown,
      staleClickPreserved: screen.onclick === stale,
      traced: window.__probe.behaviourTrace().records.some((entry) =>
        entry.eventName === 'error.ui' && entry.attributes?.code === 'unknown-route'),
    };
    screen.onclick = stale;
    modules.commands.uiCommands.show('embark');
    const showCommand = {
      screen: window.spirebound.S.screen,
      rendered: !!screen.querySelector('.embark-screen'),
      staleClickReplaced: screen.onclick !== stale,
    };
    window.spirebound.S.run = window.spirebound.E.newRun(7717);
    window.spirebound.S.cb = null;
    window.spirebound.S.screen = 'map';
    modules.commands.uiCommands.renderHud();
    const hud = document.getElementById('hud');
    const renderHudCommand = {
      visible: hud.classList.contains('show'),
      gold: hud.querySelector('.gold-num')?.textContent,
      deckCount: hud.querySelector('.deck-count')?.textContent,
    };
    modules.commands.uiCommands.show('title');
    screen.querySelector('[data-a="help"]').click();
    const overlay = document.getElementById('overlay');
    const overlayBeforeClose = {
      open: overlay.classList.contains('open'),
      hasContent: overlay.childElementCount > 0,
    };
    modules.commands.uiCommands.closeOverlay();
    const closeOverlayCommand = {
      before: overlayBeforeClose,
      open: overlay.classList.contains('open'),
      empty: overlay.innerHTML === '',
    };
    modules.commands.uiCommands.startCombat(['sporeling'], 'normal');
    const live = { screen: window.spirebound.S.screen, enemies: window.spirebound.S.cb.enemies.length };
    return {
      boundary,
      exports: Object.fromEntries(Object.entries(modules).map(([name, mod]) => [name, Object.keys(mod).sort()])),
      unknown,
      showCommand,
      renderHudCommand,
      closeOverlayCommand,
      live,
    };
  });
  expect(result.boundary).toEqual({ show: 'function', state: 'object', trace: 'function' });
  expect(result.exports.context).toEqual([
    '$', '$$', 'COARSE', 'FINE', 'FORCE_INPUT', 'S', 'el', 'escHtml',
    'presentationBarrier', 'releaseCardFacesIn', 'screenEl', 'sleep', 'terminalNavigationLocked', 'trace',
  ].sort());
  expect(result.exports.policy).toEqual(['REDUCED']);
  expect(result.exports.format).toEqual(['ROMAN']);
  expect(result.exports.rose).toEqual([
    'TITLE_ROSE_PHASES', 'decodeRoseImage', 'getRoseState', 'roseAssets', 'setDisclosedRoseStateIds',
    'setForceRoseFallback', 'setRoseAssetsReady', 'setRoseDecodeFailed', 'titleRosePhase',
  ]);
  expect(result.exports.commands).toEqual(['bindUICommands', 'uiCommands']);
  expect(result.unknown).toEqual({
    error: 'Unknown UI route: missing-route',
    screen: 'title',
    sameScreen: true,
    staleClickPreserved: true,
    traced: true,
  });
  expect(result.showCommand).toEqual({ screen: 'embark', rendered: true, staleClickReplaced: true });
  expect(result.renderHudCommand).toEqual({ visible: true, gold: '99', deckCount: '10' });
  expect(result.closeOverlayCommand).toEqual({
    before: { open: true, hasContent: true },
    open: false,
    empty: true,
  });
  expect(result.live).toEqual({ screen: 'combat', enemies: 1 });
});

test('asset gallery query boots every category and opens and closes its lightbox', async ({ page }) => {
  test.skip(test.info().project.name !== 'desktop', 'developer gallery runs once on desktop');
  await page.goto('/?gallery=1');
  await expect(page.locator('.gallery-mode .g-cell').first()).toBeVisible();
  expect(await page.locator('.gallery-mode .g-cell').count()).toBeGreaterThan(50);
  await page.locator('.gallery-mode .g-open').first().click();
  await expect(page.locator('#overlay.open .gallery-lightbox')).toBeVisible();
  await page.locator('#overlay [data-a="close"]').click();
  await expect(page.locator('#overlay.open')).toHaveCount(0);
});

test('pending Lamplighter routes once, owns one cue, and persists Begin before Map', async ({ page }) => {
  test.skip(test.info().project.name !== 'desktop', 'Lamplighter transaction runs once on desktop');
  await page.goto('/?trace=1');
  await page.waitForFunction(() => window.spirebound && window.__probe);
  await page.evaluate(() => {
    localStorage.clear();
    const run = window.spirebound.E.newRun(88771, { lamplighter: true, reveals: ['lamplighter'] });
    window.spirebound.E.saveRun(run);
  });
  await page.reload();
  await page.waitForFunction(() => window.spirebound && window.__probe);
  const cursor = await page.evaluate(() => window.__probe.behaviourTrace().lastSeq);
  await page.locator('[data-a="continue"]').click();
  await expect(page.locator('.lamp-screen')).toBeVisible();
  await expect.poll(() => page.evaluate((after) => window.__probe.behaviourTrace().records
    .filter((record) => record.seq > after && record.eventName === 'audio.music-request' &&
      record.attributes?.id === 'map' && record.attributes?.mode === 'active').length, cursor),
  { timeout: 20_000 }).toBe(1);
  expect(await page.evaluate((after) => {
    const records = window.__probe.behaviourTrace().records.filter((record) => record.seq > after);
    return {
      requested: records.filter((record) => record.eventName === 'screen.requested' && record.attributes?.screenId === 'lamplighter').length,
      entered: records.filter((record) => record.eventName === 'screen.entered' && record.attributes?.screenId === 'lamplighter').length,
    };
  }, cursor)).toEqual({ requested: 1, entered: 1 });
  await page.locator('.lamp-boon').first().click();
  await page.locator('[data-a="begin"]').click();
  await expect(page.locator('.map-screen')).toBeVisible();
  expect(await page.evaluate(() => {
    const durable = window.spirebound.E.loadRun();
    return {
      screen: window.spirebound.S.screen,
      livePending: !!window.spirebound.S.run.pendingLamplighter,
      durablePending: !!durable?.pendingLamplighter,
      boon: durable?.boon ?? null,
      lampCleared: window.spirebound.S.lamp === null,
    };
  })).toEqual({ screen: 'map', livePending: false, durablePending: false, boon: expect.any(String), lampCleared: true });
});

test('Eighth Omen floor echo survives its delayed real map-selection callback', async ({ page }) => {
  test.skip(test.info().project.name !== 'desktop', 'map callback runs once on desktop');
  await boot(page, { query: 'trace=1&mesh=0' });
  await page.evaluate(() => {
    window.spirebound.S.run.omens[window.spirebound.S.run.act] = 'eighthOmen';
    window.spirebound.show('map');
  });
  await page.waitForSelector('.mnode.avail');
  const beforeFloor = await page.evaluate(() => window.spirebound.S.run.floorsClimbed);
  // One assertion covers appear+copy: split waits can race the banner's short lifetime.
  const echoText = page.locator('.eighth-floor-echo .efe-text');
  const echoReady = expect(echoText).toHaveText(/\/\//, { timeout: 10_000 });
  await page.evaluate(() => {
    const node = document.querySelector('.mnode.avail');
    if (!node) throw new Error('no available map node');
    node.dispatchEvent(new MouseEvent('click', { bubbles: true }));
  });
  await expect.poll(() => page.evaluate(() => window.spirebound.S.run.floorsClimbed))
    .toBeGreaterThan(beforeFloor);
  await echoReady;
});

// Idle rotateX(0)/rotateY(0) under perspective promotes a 3D layer that Chromium
// soft-samples at non-integer stage scales — merchant row-1 card 4 looked blurred
// until hovered (hover applies a real tilt and re-rasters cleanly).
test('shop cards stay sharp at rest: no idle 3D tilt transform', async ({ page }) => {
  test.skip(test.info().project.name !== 'desktop', 'compositor soft-sample is scale-sensitive');
  await boot(page, { query: 'mesh=0', seed: 42 });
  await page.evaluate(() => {
    window.spirebound.S.run.player.gold = 999;
    window.spirebound.show('shop');
  });
  await page.waitForSelector('.cards-row .card-inner');
  await page.waitForTimeout(700);

  const transforms = await page.evaluate(() =>
    [...document.querySelectorAll('.cards-row .card-inner')].map((el) => getComputedStyle(el).transform));
  expect(transforms.length).toBe(5);
  // rotateX(0) rotateY(0) computes to matrix(1,0,0,1,0,0); transform:none stays "none"
  for (const t of transforms) expect(t).toBe('none');

  // Absolute sharpness floor: seed 42's softest card was ~600 Laplacian variance
  // while idle-3D; after transform:none it lands above ~2500. Card art differs, so
  // relative ratios across slots are not a fair gate.
  const boxes = await page.evaluate(() =>
    [...document.querySelectorAll('.cards-row .card-inner')].map((el) => {
      const r = el.getBoundingClientRect();
      return { x: r.x, y: r.y, w: r.width, h: r.height };
    }));
  const edgeScores = [];
  for (const box of boxes) {
    const clip = {
      x: Math.max(0, box.x + 10),
      y: Math.max(0, box.y + box.h * 0.55),
      width: Math.max(1, box.w - 20),
      height: Math.max(1, box.h * 0.35),
    };
    const png = await page.screenshot({ type: 'png', clip });
    const score = await page.evaluate(async (b64) => {
      const bin = atob(b64);
      const bytes = new Uint8Array(bin.length);
      for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
      const bmp = await createImageBitmap(new Blob([bytes], { type: 'image/png' }));
      const c = document.createElement('canvas');
      c.width = bmp.width;
      c.height = bmp.height;
      const g = c.getContext('2d', { willReadFrequently: true });
      g.drawImage(bmp, 0, 0);
      const { data, width, height } = g.getImageData(0, 0, c.width, c.height);
      const luma = (i) => 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
      let sum = 0, sum2 = 0, n = 0;
      for (let y = 1; y < height - 1; y++) {
        for (let x = 1; x < width - 1; x++) {
          const i = (y * width + x) * 4;
          const lap = 4 * luma(i)
            - luma(i - 4) - luma(i + 4)
            - luma(((y - 1) * width + x) * 4)
            - luma(((y + 1) * width + x) * 4);
          sum += lap;
          sum2 += lap * lap;
          n++;
        }
      }
      const mean = sum / n;
      return sum2 / n - mean * mean;
    }, Buffer.from(png).toString('base64'));
    edgeScores.push(score);
  }
  expect(
    Math.min(...edgeScores),
    `shop card sharpness scores=${edgeScores.map((s) => +s.toFixed(1))}`,
  ).toBeGreaterThan(1500);
});

// Vigil deed rows share listIn with the shop. The old keyframes left filter:blur(0px)
// (and a transform fill) on every .deed-row — same soft-sample class as merchant cards.
test('Vigil deed rows release listIn without a sticky filter/transform', async ({ page }) => {
  test.skip(test.info().project.name !== 'desktop', 'compositor soft-sample is scale-sensitive');
  await boot(page, { query: 'mesh=0' });
  await page.evaluate(() => {
    localStorage.setItem('spirebound_vigil_v2', JSON.stringify({
      v: 2,
      deeds: {
        runs: 40, wins: 9, slain: 500, shatters: 90, kindles: 60, perfects: 12,
        smolderKills: 60, unlitVisited: 30, embersSpent: 900, bestVow: 5, bestFloor: 45,
      },
      unlocks: ['aspect2'], vowUnlocked: 5, lastFall: null,
      runsPlayed: 40, quests: {}, shards: [], whispers: 12, news: true,
    }));
  });
  await page.reload();
  // initUI sets __probe before awaiting Pixi, then ends with show('title').
  // Wait for that terminal title paint so show('vigil') is not overwritten.
  await page.waitForFunction(() =>
    window.spirebound?.pixi?.status() === 'ready'
    && window.spirebound?.S?.screen === 'title'
    && document.querySelector('.title-screen, [data-a="vigil"]'), null, { timeout: 15_000 });
  await page.evaluate(() => window.spirebound.show('vigil'));
  await page.waitForSelector('.deed-list .deed-row');
  await page.waitForTimeout(700);

  const settle = await page.evaluate(() =>
    [...document.querySelectorAll('.deed-list .deed-row')].map((el) => ({
      filter: getComputedStyle(el).filter,
      transform: getComputedStyle(el).transform,
    })));
  expect(settle.length).toBeGreaterThan(3);
  for (const row of settle) {
    expect(row.filter).toBe('none');
    expect(row.transform).toBe('none');
  }

  // Tab away and back re-mounts the deed list — must not re-stick blur(0px).
  if (await page.locator('[data-a="tab-rose"]').count()) {
    await page.click('[data-a="tab-rose"]');
    await page.click('[data-a="tab-deeds"]');
    await page.waitForSelector('.deed-list .deed-row');
    await page.waitForTimeout(700);
    const again = await page.evaluate(() =>
      [...document.querySelectorAll('.deed-list .deed-row')].map((el) => getComputedStyle(el).filter));
    for (const filter of again) expect(filter).toBe('none');
  }
});

// Reward rows share the same listIn cascade as shop/Vigil.
test('reward rows release listIn without a sticky filter/transform', async ({ page }) => {
  test.skip(test.info().project.name !== 'desktop', 'compositor soft-sample is scale-sensitive');
  await boot(page, { query: 'mesh=0' });
  await page.evaluate(() => {
    const sp = window.spirebound;
    sp.E.setPendingReward(sp.S.run, 'normal', {
      gold: 25,
      cards: ['strike', 'defend', 'chisel'],
      potion: null,
      relic: null,
    });
    sp.show('reward');
  });
  await page.waitForSelector('.reward-list .reward-row');
  await page.waitForTimeout(700);
  const rows = await page.evaluate(() =>
    [...document.querySelectorAll('.reward-list .reward-row')].map((el) => ({
      filter: getComputedStyle(el).filter,
      transform: getComputedStyle(el).transform,
    })));
  expect(rows.length).toBeGreaterThan(0);
  for (const row of rows) {
    expect(row.filter).toBe('none');
    expect(row.transform).toBe('none');
  }
});

test('?shape= override forces the remaining shapes', async ({ page }) => {
  test.skip(test.info().project.name !== 'desktop', 'one project is enough');
  await boot(page, { query: 'shape=pad-portrait' });
  const st = await page.evaluate(() => window.__probe.stage());
  expect(st.shape).toBe('pad-portrait');
  expect(st.w).toBe(820);
  expect(st.h).toBe(1180);
});

test('a 4:3-ish desktop window keeps the pad-landscape stage', async ({ page }) => {
  test.skip(test.info().project.name !== 'desktop', 'window resizing is a desktop behaviour');
  await page.setViewportSize({ width: 1180, height: 820 });
  await boot(page);
  const st = await page.evaluate(() => window.__probe.stage());
  expect(st.shape).toBe('pad-landscape');
  expect(st.w).toBe(1180);
});

test('title and embark screens fit their stage: no scrollable overflow anywhere', { tag: '@smoke' }, async ({ page }) => {
  await boot(page);
  // the fullest profile a veteran can produce: saved run (Continue button),
  // both aspects, vow stepper at V with the five-line vow ledger, and the
  // Vigil news pulse — the vow content now lives on the Embark screen
  await page.evaluate(() => {
    localStorage.setItem('spirebound_vigil_v2', JSON.stringify({
      v: 2,
      deeds: { runs: 40, wins: 9, slain: 500, shatters: 90, kindles: 60, perfects: 12, smolderKills: 60, unlitVisited: 30, embersSpent: 900, bestVow: 5, bestFloor: 45 },
      unlocks: ['aspect2'], vowUnlocked: 5, lastFall: null,
      runsPlayed: 40, quests: {}, shards: [], whispers: 0, news: true,
    }));
    window.spirebound.E.saveRun(window.spirebound.E.newRun(1234, { aspect: 0 }));
  });
  await page.reload();
  await page.waitForFunction(() => window.spirebound && window.__probe);
  await expectNoOverflow(page, 'title');
  // title always says Begin the Climb (Begin Anew confirmation lives on Embark)
  await expect(page.locator('[data-a="embark"]')).toHaveText('Begin the Climb');
  await page.click('[data-a="embark"]');
  for (let i = 0; i < 5; i++) await page.click('[data-a="vow+"]');
  await page.waitForTimeout(600);
  await expectNoOverflow(page, 'embark');
});

test('maximum Emberglass profile and ceremonies fit every stage', async ({ page }) => {
  const v = completeLedger();
  v.unlocks = ['aspect2'];
  v.vowUnlocked = 5;
  v.deeds.bestVow = 5;
  await seed(page, v);
  await page.addStyleTag({
    content: `:root{--sat:32px;--sab:24px;--sal:12px;--sar:12px}
      .center-panel.screen-enter:has(.vigil-panel){animation-duration:10s!important}`,
  });
  await page.evaluate(() => {
    const sp = window.spirebound;
    sp.E.saveRun(sp.E.newRun(7001, { aspect: 1, vow: 5 }));
    sp.show('title');
  });
  await stable(page);
  await expectNoOverflow(page, 'title', [
    '.title-screen', '.title-btns', '.title-rose-medallion.ready', '[data-a="vigil"]',
  ], [
    '.title-btns', '.title-rose-medallion.ready', '[data-a="vigil"]',
  ]);
  await page.click('[data-a="vigil"]');
  await page.waitForTimeout(500);
  await expectNoOverflow(page, 'Vigil Deeds', [
    '.vigil-panel', '.vigil-tabs', '.vigil-tabs .vtab', '.deed-list', '.ov-actions', '[data-a="back"]',
  ], [
    '.vigil-panel', '.vigil-tabs', '.deed-list', '.ov-actions', '[data-a="back"]',
  ]);
  await page.click('[data-a="tab-rose"]');
  await page.waitForSelector('.rose-window.ready');
  await page.waitForTimeout(500);
  await expectNoOverflow(page, 'Vigil Rose', [
    '.vigil-panel', '.vigil-tabs', '.vigil-tabs .vtab', '.rose-view', '.rose-window',
    '.rose-pane', '.rose-pane-copy', '.rose-pane-select', '.rose-pane-detail',
    '.whisper-log', '.ov-actions', '[data-a="back"]',
  ], [
    '.vigil-panel', '.vigil-tabs', '.rose-view', '.rose-window', '.rose-pane-detail',
    '.whisper-log', '.ov-actions', '[data-a="back"]',
  ]);

  await page.evaluate(() => {
    window.__probe.forceRoseFallback(true);
    window.spirebound.show('vigil', { tab: 'rose' });
  });
  await page.waitForSelector('.rose-window.rose-fallback');
  await page.waitForTimeout(500);
  await expectNoOverflow(page, 'Vigil Rose fallback', [
    '.vigil-panel', '.vigil-tabs', '.vigil-tabs .vtab', '.rose-view', '.rose-fallback',
    '.rose-fallback .rose-slot', '.rose-fallback .rose-slot-mark', '.rose-fallback .rose-pane-copy',
    '.rose-fallback .rose-pane-select', '.rose-pane-detail',
    '.whisper-log', '.ov-actions', '[data-a="back"]',
  ], [
    '.vigil-panel', '.vigil-tabs', '.rose-view', '.rose-fallback', '.rose-pane-detail',
    '.whisper-log', '.ov-actions', '[data-a="back"]',
  ]);
  const fallbackOverlaps = await page.evaluate(() => [...document.querySelectorAll('.rose-fallback .rose-slot')]
    .flatMap((slot, index) => {
      const box = slot.getBoundingClientRect();
      const mark = slot.querySelector('.rose-slot-mark')?.getBoundingClientRect();
      const copy = slot.querySelector('.rose-pane-copy')?.getBoundingClientRect();
      if (!mark || !copy) return [];
      const issues = [];
      const inside = (r) => r.left >= box.left - 1 && r.right <= box.right + 1 &&
        r.top >= box.top - 1 && r.bottom <= box.bottom + 1;
      if (!inside(mark)) issues.push(`slot ${index}: mark escapes its pane`);
      if (!inside(copy)) issues.push(`slot ${index}: copy escapes its pane`);
      const overlapW = Math.min(mark.right, copy.right) - Math.max(mark.left, copy.left);
      const overlapH = Math.min(mark.bottom, copy.bottom) - Math.max(mark.top, copy.top);
      if (overlapW > 1 && overlapH > 1) {
        issues.push(`slot ${index}: mark/copy overlap ${Math.round(overlapW)}x${Math.round(overlapH)}`);
      }
      return issues;
    }));
  expect(fallbackOverlaps).toEqual([]);
  await page.evaluate(() => { window.__probe.forceRoseFallback(false); });

  await page.evaluate(() => {
    const sp = window.spirebound;
    const vigil = JSON.parse(localStorage.getItem('spirebound_vigil_v2'));
    sp.S.run = sp.E.newRun(7002, {
      reveals: ['omens', 'phials', 'poolWave2', 'poolWave3', 'poolFull', 'emberglass', 'act4'],
      quests: vigil.quests, shards: vigil.shards,
    });
    sp.S.run.act = 2;
    sp.S.run.map = sp.E.genMap(sp.S.run);
    sp.show('map');
  });
  await page.waitForTimeout(500);
  expect(await page.evaluate(() => [
    document.getElementById('stage').scrollLeft,
    document.getElementById('stage').scrollTop,
    document.getElementById('screen').scrollLeft,
    document.getElementById('screen').scrollTop,
  ])).toEqual([0, 0, 0, 0]);
  // The sealed door is projected from the continuously moving 3D camera.
  // Dispatch the click without Playwright's stable-box wait: this assertion
  // measures the resulting panel layout, not the map camera's animation.
  await page.locator('[data-a="sealed-door"]').dispatchEvent('click');
  await page.waitForTimeout(250);
  expect(await page.evaluate(() => [
    document.getElementById('stage').scrollLeft,
    document.getElementById('stage').scrollTop,
    document.getElementById('screen').scrollLeft,
    document.getElementById('screen').scrollTop,
  ]), 'opening the fixed door panel must not programmatically scroll the stage or screen').toEqual([0, 0, 0, 0]);
  await expectNoOverflow(page, 'sealed door', [
    '.sealed-door-panel', '.sealed-door-mark', '.door-inscription', '[data-a="close-door"]',
  ], [
    '.sealed-door-panel', '.sealed-door-panel .ov-actions', '[data-a="close-door"]',
  ]);
  const doorHeight = await page.evaluate(() => ({
    panel: document.querySelector('.sealed-door-panel').getBoundingClientRect().height,
    stage: document.getElementById('stage').getBoundingClientRect().height,
  }));
  expect(doorHeight.panel / doorHeight.stage,
    'the sealed-door promise is a centred panel, not an almost-full-height mobile sheet').toBeLessThan(0.9);
  await page.click('[data-a="close-door"]');

  await page.evaluate(() => {
    const sp = window.spirebound;
    const vigil = JSON.parse(localStorage.getItem('spirebound_vigil_v2'));
    const run = sp.E.newRun(7003, { quests: vigil.quests, shards: vigil.shards });
    run.pendingRunEnd = { outcome: 'win' };
    if (!sp.E.saveRun(run) || !sp.E.stagePendingDawn(run, [
      { t: 'whisper', text: 'The climb continues.' },
      { t: 'questReveal', id: 'unreadablePage' },
      { t: 'questProgress', id: 'unreadablePage', progress: 5, target: 5 },
      { t: 'pageRead', index: 5, text: 'FIFTH PAGE — The Rose Window is a map, not a memorial. Light it, then look above the crown.' },
      { t: 'eighthResolved', text: 'The broken glyphs resolve into a warning.' },
      { t: 'shadeResolved', text: 'The shade names the lock above the crown.' },
      { t: 'shardGrant', id: 'unreadablePage' },
      { t: 'act4Reveal' },
    ], [])) throw new Error('maximum-state dawn did not stage');
    sp.S.run = run;
    sp.show('end', { won: true });
  });
  await waitForDawnComplete(page);
  await expect(page.locator('.dawn-ceremony')).toBeVisible();
  await expect(page.locator('.dawn-event')).toHaveCount(8);
  await expectNoOverflow(page, 'dawn ceremony', [
    '.end-screen', '.end-title', '.end-screen > .ov-sub', '.dawn-ceremony',
    '.stats-grid', '.end-btns', '.end-btns button',
  ], [
    '.end-title', '.end-screen > .ov-sub', '.dawn-ceremony', '.stats-grid', '.end-btns', '.end-btns button',
  ]);
});

// Spec §6 light assertions: fresh title has no aspect row; Embark grows
// sections only as the Vigil reveals them.
test('fresh profile title has no aspect row; Embark shows zero sections', async ({ page }) => {
  test.skip(test.info().project.name !== 'desktop', 'entrance behaviour is shape-independent');
  await page.goto('/');
  await page.waitForFunction(() => window.spirebound && window.__probe);
  await page.evaluate(() => localStorage.clear());
  await page.reload();
  await page.waitForFunction(() => window.spirebound && window.__probe);
  await expect(page.locator('.title-screen .aspect-row')).toHaveCount(0);
  await expect(page.locator('.title-screen .vow-block')).toHaveCount(0);
  await expect(page.locator('[data-a="embark"]')).toHaveText('Begin the Climb');
  await expect(page.locator('[data-a="continue"]')).toHaveCount(0);
  await page.click('[data-a="embark"]');
  await expect(page.locator('.embark-screen .aspect-row')).toHaveCount(0);
  await expect(page.locator('.embark-screen .vow-block')).toHaveCount(0);
  await expect(page.locator('.embark-screen [data-a="begin"]')).toHaveText('Begin the Climb');
  await page.click('.embark-screen [data-a="back"]');
  await expect(page.locator('.title-screen')).toBeVisible();
});

test('seeded veteran Embark shows aspect and vow sections', async ({ page }) => {
  test.skip(test.info().project.name !== 'desktop', 'entrance behaviour is shape-independent');
  await page.goto('/');
  await page.waitForFunction(() => window.spirebound && window.__probe);
  await page.evaluate(() => {
    localStorage.clear();
    localStorage.setItem('spirebound_vigil_v2', JSON.stringify({
      v: 2,
      deeds: { runs: 40, wins: 9, slain: 500, shatters: 90, kindles: 60, perfects: 12, smolderKills: 60, unlitVisited: 30, embersSpent: 900, bestVow: 5, bestFloor: 45 },
      unlocks: ['aspect2'], vowUnlocked: 5, lastFall: null,
      runsPlayed: 40, quests: {}, shards: [], whispers: 0, news: false,
    }));
  });
  await page.reload();
  await page.waitForFunction(() => window.spirebound && window.__probe);
  await expect(page.locator('.title-screen .aspect-row')).toHaveCount(0);
  await page.click('[data-a="embark"]');
  await expect(page.locator('.embark-screen .aspect-row')).toHaveCount(1);
  await expect(page.locator('.embark-screen .aspect-card')).toHaveCount(2);
  await expect(page.locator('.embark-screen .vow-block')).toHaveCount(1);
});

test('Begin Anew on Embark confirms before abandoning a saved climb', async ({ page }) => {
  test.skip(test.info().project.name !== 'desktop', 'entrance behaviour is shape-independent');
  await page.goto('/');
  await page.waitForFunction(() => window.spirebound && window.__probe);
  await page.evaluate(() => {
    localStorage.clear();
    window.spirebound.E.saveRun(window.spirebound.E.newRun(1234, { aspect: 0, reveals: [] }));
  });
  await page.reload();
  await page.waitForFunction(() => window.spirebound && window.__probe);
  await expect(page.locator('[data-a="continue"]')).toHaveCount(1);
  await expect(page.locator('[data-a="embark"]')).toHaveText('Begin the Climb');
  await page.click('[data-a="embark"]');
  await expect(page.locator('.embark-screen [data-a="begin"]')).toHaveText('Begin Anew');
  await page.click('.embark-screen [data-a="begin"]');
  // confirmation modal — save must still exist until the player confirms
  await expect(page.locator('#overlay.open .ov-title')).toHaveText('Begin Anew?');
  const before = await page.evaluate(() => ({
    seed: window.spirebound.E.loadRun()?.seed,
    runsPlayed: JSON.parse(localStorage.getItem('spirebound_vigil_v2') || '{}').runsPlayed || 0,
  }));
  expect(before.seed).toBe(1234);
  await page.click('#overlay [data-a="no"]');
  await expect(page.locator('#overlay.open')).toHaveCount(0);
  expect(await page.evaluate(() => window.spirebound.E.loadRun()?.seed)).toBe(1234);
  // confirm path: abandon advances the ladder, then a new climb starts (and autosaves)
  await page.click('.embark-screen [data-a="begin"]');
  await page.click('#overlay [data-a="yes"]');
  await page.waitForFunction(() => window.spirebound.S.screen !== 'embark');
  const after = await page.evaluate(() => {
    const run = window.spirebound.E.loadRun() || window.spirebound.S.run;
    return {
      seed: run?.seed,
      runsPlayed: JSON.parse(localStorage.getItem('spirebound_vigil_v2') || '{}').runsPlayed || 0,
      reveals: run?.reveals,
      screen: window.spirebound.S.screen,
    };
  });
  expect(after.runsPlayed).toBe(before.runsPlayed + 1);
  expect(after.seed).not.toBe(1234);
  expect(after.reveals).toContain('lamplighter');
  expect(['lamplighter', 'map', 'combat']).toContain(after.screen);
});

test('window size changes scale, never layout: geometry is identical at two window sizes', async ({ page }) => {
  test.skip(test.info().project.name !== 'desktop', 'window resizing is a desktop behaviour');
  await boot(page, { query: 'mesh=0' });
  await startFight(page, ['duskfang', 'sporeling']);
  await stable(page);
  const g1 = await combatGeometry(page);
  await page.setViewportSize({ width: 1920, height: 1080 });
  await page.waitForTimeout(400);
  const g2 = await combatGeometry(page);
  // same shape (both landscape), so every stage-space measurement must be
  // bit-identical: this IS the "fixed virtual resolution" property
  expect(g2.stage.shape).toBe(g1.stage.shape);
  expect(g2.stage.scale).toBeGreaterThan(g1.stage.scale);
  const near = (a, b, label) => expect(Math.abs(a - b), `${label} (${a} vs ${b})`).toBeLessThanOrEqual(0.5);
  near(g2.groundY, g1.groundY, 'groundY');
  near(g2.heroArtBottom, g1.heroArtBottom, 'heroArtBottom');
  g1.enemyArtBottoms.forEach((b, i) => near(g2.enemyArtBottoms[i], b, `enemy ${i} bottom`));
  if (g1.slLedgeTop != null) near(g2.slLedgeTop, g1.slLedgeTop, 'slLedgeTop');
  if (g1.seamY != null) near(g2.seamY, g1.seamY, 'seamY');
});

const CANONICAL_SHAPES = [
  'phone-portrait', 'phone-landscape', 'pad-portrait', 'pad-landscape', 'desktop-landscape',
];

function rectsIntersect(a, b, gap = 0) {
  return !(a.right + gap <= b.left || b.right + gap <= a.left || a.bottom + gap <= b.top || b.bottom + gap <= a.top);
}

async function versionChromeGeometry(page) {
  return page.evaluate(() => {
    const stageEl = document.getElementById('stage');
    const stage = stageEl.getBoundingClientRect();
    const rootStyle = getComputedStyle(document.documentElement);
    const stageScale = stage.width / stageEl.offsetWidth;
    const safePx = (name) => (Number.parseFloat(rootStyle.getPropertyValue(name)) || 0) * stageScale;
    const safe = {
      left: stage.left + safePx('--sal'),
      right: stage.right - safePx('--sar'),
      top: stage.top + safePx('--sat'),
      bottom: stage.bottom - safePx('--sab'),
    };
    const boxOf = (sel) => {
      const el = document.querySelector(sel);
      if (!el) return null;
      const r = el.getBoundingClientRect();
      const cs = getComputedStyle(el);
      return {
        left: r.left, right: r.right, top: r.top, bottom: r.bottom,
        width: r.width, height: r.height,
        visible: cs.display !== 'none' && cs.visibility !== 'hidden' && r.width > 0 && r.height > 0 && !el.hidden,
      };
    };
    return {
      safe,
      label: boxOf('[data-version-display]'),
      debug: boxOf('[data-version-debug]'),
      btns: boxOf('.title-btns'),
      stats: boxOf('.title-stats'),
      rose: boxOf('.title-rose-medallion'),
      displayText: document.querySelector('[data-version-display]')?.textContent || '',
      hasDataA: !!document.querySelector('[data-version-display]')?.hasAttribute('data-a'),
    };
  });
}

test('fresh and grown Title/Embark expose fixed r5 selectors and data states', async ({ page }) => {
  test.skip(test.info().project.name !== 'desktop', 'presentation seams run once on desktop');
  await page.goto('/?trace=1');
  await page.waitForFunction(() => window.spirebound && window.__probe);
  await page.evaluate(() => localStorage.clear());
  await page.reload();
  await page.waitForFunction(() => window.spirebound && window.__probe);
  const fresh = page.locator('.title-screen.r5-title');
  await expect(fresh).toHaveAttribute('data-r5-profile', 'fresh');
  await expect(fresh).toHaveAttribute('data-r5-state', /^(igniting|title-ready)$/);
  await expect(page.locator('.r5-title-parallax[data-asset]')).toHaveCount(3);
  await expect(page.locator('.r5-title-wordmark')).toHaveCount(1);
  await expect(page.locator('.r5-title-actions')).toHaveCount(1);
  await expect(page.locator('.title-rose-medallion')).toHaveCount(0);
  await page.waitForFunction(() => document.querySelector('.r5-title')?.dataset.r5State === 'title-ready');
  await page.click('[data-a="embark"]');
  const embarkFresh = page.locator('.embark-screen.r5-embark');
  await expect(embarkFresh).toHaveAttribute('data-r5-profile', 'fresh');
  await expect(page.locator('.r5-begin-rite')).toHaveCount(1);
  await expect(page.locator('.r5-aspect-card')).toHaveCount(0);
  await expect(page.locator('.r5-vow-dial')).toHaveCount(0);

  await page.evaluate(() => {
    localStorage.setItem('spirebound_vigil_v2', JSON.stringify({
      v: 2,
      deeds: { runs: 12, wins: 3, slain: 40, shatters: 4, kindles: 2, perfects: 1, smolderKills: 2, unlitVisited: 1, embersSpent: 20, bestVow: 2, bestFloor: 18 },
      unlocks: ['aspect2'], vowUnlocked: 2, lastFall: null,
      runsPlayed: 12, quests: {}, shards: ['usurper'], whispers: 2, news: true,
    }));
  });
  await page.reload();
  await page.waitForFunction(() => window.spirebound && window.__probe);
  const grown = page.locator('.title-screen.r5-title');
  await expect(grown).toHaveAttribute('data-r5-profile', 'grown');
  await expect(page.locator('.title-rose-medallion')).toHaveCount(1);
  await page.click('[data-a="embark"]');
  await expect(page.locator('.embark-screen.r5-embark')).toHaveAttribute('data-r5-profile', 'grown');
  await expect(page.locator('.r5-aspect-card')).toHaveCount(2);
  await expect(page.locator('.r5-vow-dial')).toHaveCount(1);
  await expect(page.locator('.r5-begin-rite')).toHaveCount(1);
});

for (const shape of CANONICAL_SHAPES) {
  for (const profile of ['fresh', 'grown']) {
    test(`Title version chrome stays bottom-right inside safe area — ${shape} ${profile}`, async ({ page }) => {
      test.skip(test.info().project.name !== 'desktop', 'shape sweep forces ?shape= on desktop');
      const vigil = profile === 'fresh'
        ? {
          v: 2, deeds: { runs: 0, wins: 0, slain: 0, shatters: 0, kindles: 0, perfects: 0, smolderKills: 0, unlitVisited: 0, embersSpent: 0, bestVow: 0, bestFloor: 0 },
          unlocks: [], vowUnlocked: 0, lastFall: null, runsPlayed: 0, quests: {}, shards: [], whispers: 0, news: false,
        }
        : {
          v: 2, deeds: { runs: 8, wins: 2, slain: 30, shatters: 3, kindles: 2, perfects: 1, smolderKills: 1, unlitVisited: 1, embersSpent: 10, bestVow: 1, bestFloor: 12 },
          unlocks: ['aspect2'], vowUnlocked: 1, lastFall: null, runsPlayed: 8, quests: {}, shards: ['usurper'], whispers: 1, news: true,
        };
      await page.addInitScript((value) => {
        localStorage.removeItem('spirebound_save_v2');
        localStorage.setItem('spirebound_vigil_v2', JSON.stringify(value));
      }, vigil);
      await page.goto(`/?shape=${shape}&trace=1`);
      await page.waitForFunction(() => window.spirebound && window.__probe);
      expect(await page.evaluate(() => window.__probe.stage().shape)).toBe(shape);
      await expect(page.locator('.r5-title')).toHaveAttribute('data-r5-profile', profile);
      const expectedDisplay = await page.evaluate(async () => {
        const { getVersionInfo } = await import('/src/version.js');
        return getVersionInfo().display;
      });
      const hidden = await versionChromeGeometry(page);
      expect(hidden.displayText).toBe(expectedDisplay);
      expect(hidden.hasDataA).toBe(false);
      expect(hidden.label.visible).toBe(true);
      expect(hidden.debug.visible).toBe(false);
      const inside = (box, safe) => box.left >= safe.left - 1 && box.right <= safe.right + 1
        && box.top >= safe.top - 1 && box.bottom <= safe.bottom + 1;
      expect(inside(hidden.label, hidden.safe), 'label inside safe').toBe(true);
      expect(hidden.label.right).toBeGreaterThan((hidden.safe.left + hidden.safe.right) / 2);
      expect(hidden.label.bottom).toBeGreaterThan((hidden.safe.top + hidden.safe.bottom) / 2);
      expect(rectsIntersect(hidden.label, hidden.btns, 8)).toBe(false);
      expect(rectsIntersect(hidden.label, hidden.stats, 8)).toBe(false);
      if (hidden.rose?.visible) expect(rectsIntersect(hidden.label, hidden.rose, 24)).toBe(false);

      await page.evaluate(() => {
        const target = document.querySelector('[data-version-logo]');
        for (let i = 0; i < 5; i += 1) target.dispatchEvent(new MouseEvent('click', { bubbles: true }));
      });
      await expect(page.locator('[data-version-debug]')).toBeVisible();
      const shown = await versionChromeGeometry(page);
      expect(shown.debug.visible).toBe(true);
      expect(inside(shown.debug, shown.safe), 'debug inside safe').toBe(true);
      expect(shown.debug.right).toBeGreaterThan((shown.safe.left + shown.safe.right) / 2);
      expect(shown.debug.bottom).toBeGreaterThan((shown.safe.top + shown.safe.bottom) / 2);
      expect(rectsIntersect(shown.debug, shown.btns, 8)).toBe(false);
      expect(rectsIntersect(shown.debug, shown.stats, 8)).toBe(false);
      if (shown.rose?.visible) expect(rectsIntersect(shown.debug, shown.rose, 24)).toBe(false);
    });
  }
}
