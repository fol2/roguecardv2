import {
  TITLE_PARALLAX_LAYER_IDS,
  TITLE_PARALLAX_FALLBACK_ID,
  R5_SCREEN_END_STATES,
  VERSION_GESTURE,
  compositionProfile,
  screenPresentationAttrs,
  titleRosePhase,
} from '../tokens.js';
import { runNamedCeremony } from '../tween.js';
import { setRoseDecodeFailed } from '../rose.js';

/** Once-per-page-session wordmark ignition. */
let titleIgnitionDone = false;

export function createTitleScreen(deps) {
  const {
    S, E, Vigil, QUEST_IDS, REDUCED, COARSE, tr, getLocale, getVersionInfo, trace,
    setRoseAssetsReady, setDisclosedRoseStateIds, runEffects, setTheme, themeForRun,
    assetUrl, roseAssets, escHtml, $, $$, screenEl, unlock, sfx, meshBindTitle,
    semanticUiCheckpoint, startRun, show, showHelp, openSettingsPanel,
    presentationBarrier,
  } = deps;

  function titleParallaxHtml() {
    const fallback = assetUrl('title', TITLE_PARALLAX_FALLBACK_ID);
    const layers = ['back', 'mid', 'front'];
    return TITLE_PARALLAX_LAYER_IDS.map((id, index) => {
      const url = assetUrl('title', id) || fallback;
      if (!url) return '';
      return `<div class="r5-title-parallax" data-layer="${layers[index]}" data-asset="${escHtml(id)}">
        <img class="raster-art" src="${escHtml(url)}" alt="">
      </div>`;
    }).join('');
  }

  function titleRoseMedallion(v, assets, phase) {
    if (phase === 'absent') return '';
    const label = tr('ui.rose.openLabel');
    if (phase === 'fallback') {
      return `<button type="button" class="title-rose-medallion title-rose-fallback ready" data-a="rose" data-r5-state="ready" aria-label="${escHtml(label)}"></button>`;
    }
    const panes = QUEST_IDS.filter((id) => v.shards.includes(id)).map((id) =>
      `<span class="title-rose-pane" style="--rose-mural:url('${escHtml(assets.mural)}');--rose-mask:url('${escHtml(assets.masks[id])}')"></span>`).join('');
    const urls = [assets.mural, assets.frame, ...QUEST_IDS.map((id) => assets.masks[id])];
    const state = phase === 'ready' ? 'ready' : phase === 'inert' ? 'inert' : 'loading';
    const readyClass = phase === 'ready' ? ' ready' : '';
    const disabled = phase === 'ready' ? '' : ' disabled';
    return `<button type="button" class="title-rose-medallion${readyClass}" data-a="rose" data-r5-state="${state}" aria-label="${escHtml(label)}"${disabled}>
    <span class="title-rose-composite">${panes}<img src="${escHtml(assets.frame)}" alt=""></span>
    <span class="title-rose-preload" aria-hidden="true">${urls.map((url) => `<img src="${escHtml(url)}" alt="">`).join('')}</span>
  </button>`;
  }

  function decodeTitleRoseAssets(root) {
    const medallion = $('.title-rose-medallion', root);
    if (!medallion || medallion.classList.contains('title-rose-fallback')) return;
    if (REDUCED) {
      medallion.disabled = false;
      medallion.classList.add('ready');
      medallion.dataset.r5State = 'ready';
      setRoseDecodeFailed(false);
      setRoseAssetsReady(true);
      trace.emit('checkpoint.ui', { outcome: 'completed', checkpoint: semanticUiCheckpoint() });
      return;
    }
    const images = $$('.title-rose-preload img', medallion);
    const decode = (image) => {
      if (image.decode) return image.decode();
      if (image.complete) return image.naturalWidth ? Promise.resolve() : Promise.reject(new Error('Rose asset failed to load'));
      return new Promise((resolve, reject) => {
        image.addEventListener('load', resolve, { once: true });
        image.addEventListener('error', reject, { once: true });
      });
    };
    Promise.all(images.map(decode))
      .then(() => {
        if (!medallion.isConnected) return;
        medallion.disabled = false;
        medallion.classList.add('ready');
        medallion.dataset.r5State = 'ready';
        setRoseDecodeFailed(false);
        setRoseAssetsReady(true);
        trace.emit('checkpoint.ui', { outcome: 'completed', checkpoint: semanticUiCheckpoint() });
      })
      .catch(() => {
        if (!medallion.isConnected) return;
        medallion.disabled = true;
        medallion.classList.remove('ready');
        medallion.dataset.r5State = 'inert';
        setRoseDecodeFailed(true);
        setRoseAssetsReady(false);
      });
  }

  function presentationPolicy() {
    return {
      motion: REDUCED ? 'reduced' : 'full',
      lite: !!COARSE,
      reduced: !!REDUCED,
    };
  }

  let destroyTitle = () => {};
  function renderTitle() {
    destroyTitle();
    setRoseAssetsReady(false);
    setRoseDecodeFailed(false);
    setTheme(themeForRun({ act: 0 }));
    const vigil = runEffects.syncVigil(); // reconcile any owed unlocks (e.g. seeded from old stats)
    setDisclosedRoseStateIds(Object.entries(Vigil.questSnapshot(vigil))
      .map(([id, record]) => `${id}:${record.state}`));
    const saved = E.loadRun();
    if (E.savedRunRequiresFinalisation(saved)) { startRun(saved, true); return; }
    const d = vigil.deeds;
    const banner = assetUrl('title-background', 'background');
    const titleText = assetUrl('title', 'title');
    const rose = roseAssets();
    const rosePhase = titleRosePhase({
      shardCount: vigil.shards.length,
      assets: rose,
      ready: false,
      decodeFailed: false,
      forcedFallback: !rose && vigil.shards.length > 0,
    });
    const grown = vigil.shards.length > 0
      || vigil.unlocks.length > 0
      || vigil.news
      || (d?.runs | 0) > 0
      || (vigil.runsPlayed | 0) > 0;
    const profile = compositionProfile(grown);
    const attrs = screenPresentationAttrs(presentationPolicy());
    const ignite = !titleIgnitionDone;
    if (ignite) titleIgnitionDone = true;
    const initialState = ignite && !REDUCED
      ? R5_SCREEN_END_STATES.titleIgniting
      : R5_SCREEN_END_STATES.titleReady;
    const ver = getVersionInfo();
    trace.emit('app.version', {
      outcome: 'completed',
      attributes: {
        controlId: 'title-version',
        locale: getLocale(),
        release: ver.release,
        shaState: ver.gitSha === 'unknown' ? 'unknown' : 'known',
      },
    });
    const versionDefaultState = attrs.motion === 'reduced'
      ? ` data-r5-state="${R5_SCREEN_END_STATES.titleVersionDefault}"`
      : '';
    const sc = screenEl();
    sc.innerHTML = `<div class="title-screen r5-title screen-enter" data-r5-profile="${profile}" data-r5-state="${initialState}" data-tier="${attrs.tier}" data-motion="${attrs.motion}">
    ${titleParallaxHtml()}
    ${banner ? `<div class="title-banner"><div class="title-banner-frame"><img class="raster-art" src="${banner}" alt=""></div></div>` : ''}
    <div class="logo r5-title-wordmark${titleText ? ' logo-raster' : ''}" data-version-logo data-r5-state="${initialState}">${titleText ? `<img class="title-wordmark" src="${titleText}" alt="${tr('ui.brand.title')}">` : tr('ui.brand.title')}</div>
    <div class="tagline">${tr('ui.brand.tagline')}</div>
    ${titleRoseMedallion(vigil, rose, rosePhase)}
    <div class="title-btns r5-title-actions">
      ${saved ? `<button class="btn" data-a="continue" data-r5-state="rest">${tr('ui.menu.continueClimb')}</button>` : ''}
      <button class="btn" data-a="embark" data-r5-state="rest">${tr('ui.menu.beginClimb')}</button>
      <button class="btn ghost${vigil.news && !REDUCED ? ' news' : ''}" data-a="vigil" data-r5-state="rest">${tr('ui.menu.theVigil')}</button>
      <button class="btn ghost" data-a="help" data-r5-state="rest">${tr('ui.menu.howToPlay')}</button>
      <button class="btn ghost" data-a="settings" data-r5-state="rest">${tr('ui.menu.settings')}</button>
    </div>
    <div class="title-stats">${d.runs} climbs · ${d.wins} dawns · ${d.slain} slain${vigil.unlocks.length ? ` · ${vigil.unlocks.length} secrets unearthed` : ''}</div>
    <div class="title-version" data-version-display aria-label="App version"${versionDefaultState}>${escHtml(ver.display)}</div>
    <div class="title-version-debug" data-version-debug aria-live="polite" hidden></div>
  </div>`;
    decodeTitleRoseAssets(sc);
    const root = $('.r5-title', sc);
    const wordmark = $('.r5-title-wordmark', sc);
    const logo = sc.querySelector('[data-version-logo]');
    const versionEl = sc.querySelector('[data-version-display]');
    const debugEl = sc.querySelector('[data-version-debug]');
    let taps = [];
    let debugTimer = 0;
    let destroyed = false;
    const ownsDebugSurface = () => S.screen === 'title' && debugEl?.isConnected && screenEl().contains(debugEl);
    const syncVersionReducedStates = (debugVisible) => {
      if (attrs.motion !== 'reduced') {
        versionEl?.removeAttribute('data-r5-state');
        debugEl?.removeAttribute('data-r5-state');
        return;
      }
      if (versionEl) versionEl.dataset.r5State = R5_SCREEN_END_STATES.titleVersionDefault;
      if (!debugEl) return;
      if (debugVisible) debugEl.dataset.r5State = R5_SCREEN_END_STATES.titleVersionDebug;
      else debugEl.removeAttribute('data-r5-state');
    };
    const hideDebug = () => {
      if (destroyed) return;
      clearTimeout(debugTimer);
      debugTimer = 0;
      if (!debugEl || debugEl.hidden) return;
      debugEl.hidden = true;
      debugEl.textContent = '';
      syncVersionReducedStates(false);
      if (!ownsDebugSurface()) return;
      trace.emit('app.version-debug', { outcome: 'completed', attributes: { action: 'hidden', controlId: 'title-version' } });
    };
    const showDebug = () => {
      if (!ownsDebugSurface()) return;
      debugEl.hidden = false;
      debugEl.textContent = `${ver.gitSha} · ${ver.release ? 'release' : 'dev'}`;
      syncVersionReducedStates(true);
      trace.emit('app.version-debug', { outcome: 'completed', attributes: { action: 'shown', controlId: 'title-version' } });
      clearTimeout(debugTimer);
      debugTimer = setTimeout(hideDebug, VERSION_GESTURE.hideMs);
    };
    const onLogoClick = (e) => {
      e.stopPropagation();
      const now = performance.now();
      taps = taps.filter((t) => now - t < VERSION_GESTURE.windowMs);
      taps.push(now);
      if (taps.length >= VERSION_GESTURE.taps) {
        taps = [];
        if (debugEl && !debugEl.hidden) hideDebug();
        else showDebug();
      }
    };
    logo?.addEventListener('click', onLogoClick);
    sc.onclick = (e) => {
      const t = e.target.closest('[data-a]');
      if (!t || t.disabled) return;
      const a = t.dataset.a;
      unlock(); sfx.click();
      if (a === 'embark') show('embark');
      else if (a === 'continue' && saved) startRun(saved, true);
      else if (a === 'vigil') show('vigil');
      else if (a === 'rose') show('vigil', { tab: 'rose' });
      else if (a === 'help') showHelp();
      else if (a === 'settings') openSettingsPanel();
    };
    meshBindTitle();

    const settleIgnition = () => {
      if (destroyed || !root?.isConnected) return;
      root.dataset.r5State = R5_SCREEN_END_STATES.titleReady;
      if (wordmark) wordmark.dataset.r5State = R5_SCREEN_END_STATES.titleReady;
    };
    const afterPaint = (cb) => {
      if (typeof requestAnimationFrame !== 'function') {
        const timer = setTimeout(cb, 0);
        return () => clearTimeout(timer);
      }
      // Double-rAF: first callback runs after the current frame is committed, so
      // `igniting` is visible for at least one paint before we settle.
      let inner = 0;
      const outer = requestAnimationFrame(() => {
        inner = requestAnimationFrame(cb);
      });
      return () => {
        cancelAnimationFrame(outer);
        if (inner) cancelAnimationFrame(inner);
      };
    };

    if (ignite) {
      sfx.kindle?.();
      // PE owns the once-per-session state flip + span; FE CSS (Task 35) animates
      // `data-r5-state` igniting → title-ready. Ceremony stays durationless so
      // boot-time title never leaks presentationIdle into unrelated tests.
      const ceremony = runNamedCeremony({
        name: 'title-ignition',
        endState: R5_SCREEN_END_STATES.titleReady,
        barrier: presentationBarrier,
        trace,
        from: { opacity: 0, spacing: 8 },
        to: { opacity: 1, spacing: 2 },
        duration: 0,
        easing: 'outSoft',
        policy: presentationPolicy(),
        onUpdate() { /* FE stylesheet owns visual interpolation once imported */ },
      });
      let cancelPaint = () => {};
      void ceremony.done.then(() => {
        if (destroyed) return;
        if (REDUCED) {
          settleIgnition();
          return;
        }
        // Full motion: keep `igniting` through at least one paint frame.
        cancelPaint = afterPaint(settleIgnition);
      }).catch(() => {
        if (!destroyed) settleIgnition();
      });
      destroyTitle = () => {
        if (destroyed) return;
        destroyed = true;
        cancelPaint();
        ceremony.cancel();
        clearTimeout(debugTimer);
        debugTimer = 0;
        taps = [];
        logo?.removeEventListener('click', onLogoClick);
      };
      return destroyTitle;
    }

    destroyTitle = () => {
      if (destroyed) return;
      destroyed = true;
      clearTimeout(debugTimer);
      debugTimer = 0;
      taps = [];
      logo?.removeEventListener('click', onLogoClick);
    };
    return destroyTitle;
  }

  return Object.freeze({ renderTitle });
}
