export function createTitleScreen(deps) {
  const { S, E, Vigil, QUEST_IDS, REDUCED, tr, getLocale, getVersionInfo, trace, setRoseAssetsReady, setDisclosedRoseStateIds, runEffects, setTheme, assetUrl, roseAssets, escHtml, $, $$, screenEl, unlock, sfx, meshBindTitle, semanticUiCheckpoint, startRun, show, showHelp, openSettingsPanel } = deps;

function titleRoseMedallion(v, assets) {
  if (!assets || v.shards.length < 1) return '';
  const panes = QUEST_IDS.filter((id) => v.shards.includes(id)).map((id) =>
    `<span class="title-rose-pane" style="--rose-mural:url('${escHtml(assets.mural)}');--rose-mask:url('${escHtml(assets.masks[id])}')"></span>`).join('');
  const urls = [assets.mural, assets.frame, ...QUEST_IDS.map((id) => assets.masks[id])];
  return `<button class="title-rose-medallion" data-a="rose" aria-label="${tr('ui.rose.openLabel')}" disabled>
    <span class="title-rose-composite">${panes}<img src="${escHtml(assets.frame)}" alt=""></span>
    <span class="title-rose-preload" aria-hidden="true">${urls.map((url) => `<img src="${escHtml(url)}" alt="">`).join('')}</span>
  </button>`;
}

function decodeTitleRoseAssets(root) {
  const medallion = $('.title-rose-medallion', root);
  if (!medallion) return;
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
      setRoseAssetsReady(true);
      trace.emit('checkpoint.ui', { outcome: 'completed', checkpoint: semanticUiCheckpoint() });
    })
    .catch(() => {});
}

let destroyTitle = () => {};
function renderTitle() {
  destroyTitle();
  setRoseAssetsReady(false);
  setTheme(0);
  const vigil = runEffects.syncVigil(); // reconcile any owed unlocks (e.g. seeded from old stats)
  setDisclosedRoseStateIds(Object.entries(Vigil.questSnapshot(vigil))
    .map(([id, record]) => `${id}:${record.state}`));
  const saved = E.loadRun();
  if (E.savedRunRequiresFinalisation(saved)) { startRun(saved, true); return; }
  const d = vigil.deeds;
  const banner = assetUrl('title-background', 'background');
  const titleText = assetUrl('title', 'title');
  const rose = roseAssets();
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
  const sc = screenEl();
  sc.innerHTML = `<div class="title-screen screen-enter">
    ${banner ? `<div class="title-banner"><div class="title-banner-frame"><img class="raster-art" src="${banner}" alt=""></div></div>` : ''}
    <div class="logo${titleText ? ' logo-raster' : ''}" data-version-logo>${titleText ? `<img class="title-wordmark" src="${titleText}" alt="${tr('ui.brand.title')}">` : tr('ui.brand.title')}</div>
    <div class="tagline">${tr('ui.brand.tagline')}</div>
    ${titleRoseMedallion(vigil, rose)}
    <div class="title-btns">
      ${saved ? `<button class="btn" data-a="continue">${tr('ui.menu.continueClimb')}</button>` : ''}
      <button class="btn" data-a="embark">${tr('ui.menu.beginClimb')}</button>
      <button class="btn ghost${vigil.news && !REDUCED ? ' news' : ''}" data-a="vigil">${tr('ui.menu.theVigil')}</button>
      <button class="btn ghost" data-a="help">${tr('ui.menu.howToPlay')}</button>
      <button class="btn ghost" data-a="settings">Settings</button>
    </div>
    <div class="title-stats">${d.runs} climbs · ${d.wins} dawns · ${d.slain} slain${vigil.unlocks.length ? ` · ${vigil.unlocks.length} secrets unearthed` : ''}</div>
    <div class="title-version" data-version-display aria-label="App version">${escHtml(ver.display)}</div>
    <div class="title-version-debug" data-version-debug aria-live="polite" hidden></div>
  </div>`;
  decodeTitleRoseAssets(sc);
  const logo = sc.querySelector('[data-version-logo]');
  const debugEl = sc.querySelector('[data-version-debug]');
  let taps = [];
  let debugTimer = 0;
  let destroyed = false;
  const ownsDebugSurface = () => S.screen === 'title' && debugEl?.isConnected && screenEl().contains(debugEl);
  const hideDebug = () => {
    if (destroyed) return;
    clearTimeout(debugTimer);
    debugTimer = 0;
    if (!debugEl || debugEl.hidden) return;
    debugEl.hidden = true;
    debugEl.textContent = '';
    if (!ownsDebugSurface()) return;
    trace.emit('app.version-debug', { outcome: 'completed', attributes: { action: 'hidden', controlId: 'title-version' } });
  };
  const showDebug = () => {
    if (!ownsDebugSurface()) return;
    debugEl.hidden = false;
    debugEl.textContent = `${ver.gitSha} · ${ver.release ? 'release' : 'dev'}`;
    trace.emit('app.version-debug', { outcome: 'completed', attributes: { action: 'shown', controlId: 'title-version' } });
    clearTimeout(debugTimer);
    debugTimer = setTimeout(hideDebug, 3000);
  };
  const onLogoClick = (e) => {
    e.stopPropagation();
    const now = performance.now();
    taps = taps.filter((t) => now - t < 2000);
    taps.push(now);
    if (taps.length >= 5) {
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
