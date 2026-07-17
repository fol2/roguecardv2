/**
 * Browser-side layout projection collector (injected via page.evaluate).
 * Works on tips that lack __probe.screenLayout by using stage geometry + DOM.
 * Prefer __probe.screenLayout when present (same schema).
 */
export function collectScreenLayoutInBrowser() {
  if (typeof window.__probe?.screenLayout === 'function') {
    return window.__probe.screenLayout();
  }

  const stageEl = document.getElementById('stage');
  const stageInfo = window.__probe?.stage?.() || {
    w: stageEl?.clientWidth || 0,
    h: stageEl?.clientHeight || 0,
    shape: null,
  };

  const stageRect = (node) => {
    if (!node || !stageEl) return null;
    const s = stageEl.getBoundingClientRect();
    const r = node.getBoundingClientRect();
    const scaleX = (stageInfo.w || s.width) / s.width;
    const scaleY = (stageInfo.h || s.height) / s.height;
    const left = (r.left - s.left) * scaleX;
    const top = (r.top - s.top) * scaleY;
    const width = r.width * scaleX;
    const height = r.height * scaleY;
    return {
      left, top, width, height,
      right: left + width,
      bottom: top + height,
      cx: left + width / 2,
      cy: top + height / 2,
    };
  };

  const measure = (sel) => {
    const node = typeof sel === 'string' ? document.querySelector(sel) : sel;
    return node ? stageRect(node) : null;
  };

  const root = document.querySelector(
    '.r5-title, .r5-embark, .r5-end, .r5-scene-panel, .r5-lamplighter, .r5-map, .r5-vigil, .r5-shop, .r5-event, .r5-rest, .r5-rewards, .title-screen, .embark-screen, .end-screen, .center-panel, .lamp-screen, .map-screen',
  );
  const profile = root?.dataset?.r5Profile
    || document.querySelector('[data-r5-profile]')?.dataset?.r5Profile
    || null;

  const sceneBgs = [...document.querySelectorAll('.scene-bg')];
  const sceneBgStampedAsPanel = sceneBgs.some((el) => el.classList.contains('r5-scene-panel'));
  const centerPanel = measure('.center-panel, .r5-scene-panel, .r5-end, .r5-lamplighter, .end-screen');

  const vow = document.querySelector('.r5-vow-dial, .vow-block');
  const vowBox = vow ? stageRect(vow) : null;
  const aspectCards = [...document.querySelectorAll('.r5-aspect-card, .aspect-card')]
    .map((el) => stageRect(el))
    .filter(Boolean);

  const whisper = measure('.dawn-whisper');
  const ledger = measure('.r5-dawn-ledger, .stats-grid');
  const ceremony = measure('.dawn-ceremony');
  const dawnContent = measure('.r5-end .panel, .dawn-ceremony, .r5-end, .end-screen');
  const fallPanel = measure('.r5-end--fallen .panel, .r5-end.r5-end--fallen, .bequest, .r5-end .panel, .end-screen .panel');

  const parallaxNodes = [...document.querySelectorAll('.r5-title-parallax, .title-parallax, .parallax')];
  const parallaxBoxes = parallaxNodes.map((el) => stageRect(el)).filter(Boolean);
  const parallaxTop = parallaxBoxes.length
    ? Math.min(...parallaxBoxes.map((b) => b.top))
    : null;
  const wordmarkEl = document.querySelector('.r5-title-wordmark, .logo, [data-version-logo]');
  let wordmarkClipped = null;
  if (wordmarkEl) {
    const cs = getComputedStyle(wordmarkEl);
    const overflowHidden = cs.overflow === 'hidden' || cs.overflow === 'clip'
      || cs.overflowX === 'hidden' || cs.overflowX === 'clip'
      || cs.overflowY === 'hidden' || cs.overflowY === 'clip';
    wordmarkClipped = overflowHidden
      && (wordmarkEl.scrollWidth > wordmarkEl.clientWidth + 1
        || wordmarkEl.scrollHeight > wordmarkEl.clientHeight + 1);
    if (!overflowHidden) wordmarkClipped = false;
  }

  const bg3d = document.getElementById('bg3d');
  let bg3dVisible = false;
  if (bg3d) {
    const cs = getComputedStyle(bg3d);
    bg3dVisible = cs.display !== 'none'
      && cs.visibility !== 'hidden'
      && Number.parseFloat(cs.opacity || '1') > 0.05;
  }

  const lampRoot = document.querySelector('.r5-lamplighter, .lamp-screen');
  const lampSelection = document.querySelector(
    '.lamp-boon, .lamp-boons, .lamp-arts, .r5-lamplighter .lamp-boon',
  );
  const vigilTitle = document.querySelector('.r5-vigil .ov-title, .vigil-panel .ov-title, .ov-title');

  const logicalScreen = (() => {
    if (document.querySelector('.r5-end--fallen, .r5-end[data-won="false"]')) return 'fall';
    if (document.querySelector('.r5-end--victory, .dawn-ceremony, .dawn-whisper, .r5-dawn-ledger')) {
      return 'dawn';
    }
    if (document.querySelector('.r5-embark, .embark-screen')) return 'embark';
    if (document.querySelector('.r5-title, .title-screen')) return 'title';
    if (document.querySelector('.r5-map, .map-screen')) return 'map';
    if (document.querySelector('.r5-lamplighter--hollow, .hollow-lamplighter')) return 'hollow';
    if (document.querySelector('.r5-lamplighter, .lamp-screen')) return 'lamplighter';
    if (document.querySelector('.r5-event')) return 'event';
    if (document.querySelector('.r5-rest--treasure')) return 'treasure';
    if (document.querySelector('.r5-rest')) return 'rest';
    if (document.querySelector('.r5-rewards--boss')) return 'boss-relic';
    if (document.querySelector('.r5-rewards')) return 'rewards';
    if (document.querySelector('.r5-shop')) return 'shop';
    if (document.querySelector('.r5-vigil, .vigil-panel')) return 'vigil';
    return window.spirebound?.S?.screen || null;
  })();

  return {
    version: 1,
    screen: logicalScreen,
    shape: stageInfo.shape || null,
    profile,
    stage: {
      w: stageInfo.w || stageEl?.clientWidth || 0,
      h: stageInfo.h || stageEl?.clientHeight || 0,
      shape: stageInfo.shape || null,
    },
    dawn: { whisper, ledger, ceremony, content: dawnContent },
    embark: {
      vowDial: vowBox
        ? { ...vowBox, aspectRatio: vowBox.height > 0 ? vowBox.width / vowBox.height : null }
        : null,
      aspectCards,
    },
    scene: {
      sceneBgCount: sceneBgs.length,
      sceneBgStampedAsPanel,
      centerPanel,
    },
    title: {
      parallaxCount: parallaxNodes.length,
      parallaxTop,
      wordmark: measure(wordmarkEl),
      wordmarkClipped,
    },
    map: {
      bg3dVisible,
      keepBg3dAttr: document.documentElement.hasAttribute('data-freeze-keep-bg3d'),
    },
    lamp: {
      root: lampRoot ? stageRect(lampRoot) : null,
      selectionVisible: !!(lampSelection && stageRect(lampSelection)?.height > 0),
    },
    fall: { panel: fallPanel },
    vigil: {
      title: vigilTitle
        ? {
          ...stageRect(vigilTitle),
          visible: getComputedStyle(vigilTitle).visibility !== 'hidden'
            && Number.parseFloat(getComputedStyle(vigilTitle).opacity || '1') > 0.05,
        }
        : null,
    },
    cardface: {
      costGemVertexCount: 6,
      hasArtTexture: null,
      rarityAccentDistinct: null,
    },
  };
}
