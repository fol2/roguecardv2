// SPIREBOUND UI composition root: browser globals, factories and route wiring.
import * as E from '../engine.js';
import {
  ACTS, AFFIXES, ARTS, ASPECTS, BOONS, CARDS, DEEDS, ENEMIES, EVENTS,
  OMENS, POTIONS, PROGRESSION, QUESTS, QUEST_IDS, RELICS, STATUS_INFO,
  TERMINAL_OUTCOMES, VOWS, WHISPERS,
} from '../data.js';
import {
  assetSetIds, assetSetLabel, assetUrl, campfireSvg, cardArtSvg, chestSvg,
  enemySvg, eventArtSvg, heroSvg, iconInline, iconSvg, merchantSvg, potionSvg,
  uiIcon, uiIconUrl,
} from '../art.js';
import { drawBatchSchedule } from '../pile-chrome.js';
import {
  UI_CHROME_IDS, nodeGlyphId, uiFallbackName,
} from '../ui-chrome.js';
import * as V from '../vfx.js';
import * as Vigil from '../vigil.js';
import {
  invalidateSfxSelection, preloadSfx, previewSfx, setSfxObservationSink, sfx,
  unlock,
} from '../audio.js';
import * as music from '../music.js';
import { MUSIC_CATALOG, SFX_CATALOG } from '../audio-catalog.js';
import {
  applyAudioSelection, getAudioOverrideRefs, getAudioPackDefaultRef,
  getAudioSelection, getAudioSelectionProblems, getAudioSource, getAudioVersions,
} from '../audio-assets.js';
import {
  enterMapMode, kick, mapNodePos, peekMap, setAltitude, setOverlay, setTheme,
  sunrise,
} from '../scene3d.js';
import {
  meshDebug, meshDeath, meshEnabled, meshHandoff, meshRelease,
} from '../mesh.js';
import { onCharMetaChange } from '../char-meta.js';
import { getLocale, t as lookupTr } from '../i18n/index.js';
import { stageEl, stageH, stageRect, stageW, stageInfo } from '../stage.js';
import { onBFChange } from '../battlefield.js';
import { onUICChange } from '../uic.js';
import { getVersionInfo } from '../version.js';

import { createRunEffects } from './run-effects.js';
import {
  $, $$, COARSE, S, el, escHtml, presentationBarrier, screenEl, sleep, trace,
} from './context.js';
import { CORE_CONTENT, themeForRun } from './content.js';
import { UI_TOKENS, applyExperienceTokens, tokenValue } from './tokens.js';
import { REDUCED } from './policy.js';
import { ROMAN } from './format.js';
import {
  roseAssets, setDisclosedRoseStateIds, setForceRoseFallback, setRoseAssetsReady,
} from './rose.js';
import {
  combatantView, heroArt, metaBg, omenIconName, omenMark, rasterOr, relicArt,
  sceneBg,
} from './assets.js';
import { createTooltip } from './tooltip.js';
import { createOverlay } from './overlay.js';
import { bindUICommands } from './commands.js';
import { createNavigator } from './navigation.js';
import { createCombat } from './combat.js';
import { createDrain } from './drain.js';
import { installProbe } from './probe.js';
import { createTitleScreen } from './screens/title.js';
import { createEmbarkScreen } from './screens/embark.js';
import { createVigilScreen } from './screens/vigil.js';
import { createRunScreen } from './screens/run.js';
import { createLamplighterScreen } from './screens/lamplighter.js';
import { createMapScreen } from './screens/map.js';
import { createRewardScreen } from './screens/reward.js';
import { createRestScreen } from './screens/rest.js';
import { createShopScreen } from './screens/shop.js';
import { createEventScreen } from './screens/event.js';
import { createEndScreen } from './screens/end.js';
import { createGalleryScreen } from './screens/gallery.js';
import { createAudioGalleryScreen } from './screens/audio-gallery.js';

const runEffects = createRunEffects({ engine: E, vigil: Vigil });
function tr(key, params) {
  const value = lookupTr(key, params);
  if (value === key) {
    trace.emit('i18n.missing', {
      outcome: 'failed',
      attributes: { locale: getLocale(), localeKey: key, code: 'missing-key' },
    });
  }
  return value;
}
const { initTooltip, fmtText, cardEl } = createTooltip({ tr });

let navigatorApi;
let combatApi;
let drainApi;
let screenOwners;
let readMapWarmIds = () => Object.freeze([]);

export function show(...args) {
  return navigatorApi.show(...args);
}

const combatLateCallbacks = Object.freeze({
  show: (...args) => navigatorApi.show(...args),
  transition: (...args) => navigatorApi.transition(...args),
  journalRunEnd: (...args) => screenOwners.end.journalRunEnd(...args),
});
const overlayActions = Object.freeze({
  afterAction: (...args) => combatApi.afterAction(...args),
  clearTargeting: (...args) => combatApi.clearTargeting(...args),
  drain: (...args) => drainApi.drain(...args),
  finalisePendingRunEnd: (...args) => screenOwners.end.finalisePendingRunEnd(...args),
  journalRunEnd: (...args) => screenOwners.end.journalRunEnd(...args),
  setTargeting: (...args) => combatApi.setTargeting(...args),
});
const overlay = createOverlay({
  tr,
  runEffects,
  cardEl,
  actions: overlayActions,
});
const {
  closeMenus, closeOverlay, leaveHollowDestination, openMenu, openOverlay,
  openPersistenceDialog, openSettingsPanel, persistDawnOrRetry, persistObserved,
  persistenceDialogActive, potionMenu, requireBequestClear,
  requireHollowRouteClear, requireRunSave, resumeSavedCombat, showCardGrid,
  showHelp, showRunEndPersistenceFailure, showRunSaveFailure,
  showStonePersistenceFailure, usePotionOn,
} = overlay;

combatApi = createCombat({
  tr,
  cardEl,
  overlay,
  drain: (...args) => drainApi.drain(...args),
  late: combatLateCallbacks,
});
drainApi = createDrain({
  E,
  CARDS,
  ARTS,
  STATUS_INFO,
  QUESTS,
  cardEl,
  iconSvg,
  assetUrl,
  drawBatchSchedule,
  V,
  sfx,
  kick,
  meshDeath,
  meshEnabled,
  meshHandoff,
  meshRelease,
  $,
  $$,
  S,
  el,
  escHtml,
  presentationBarrier,
  screenEl,
  sleep,
  trace,
  REDUCED,
  combatantView,
  stageW,
  stageH,
  stageRect,
  tr,
  presentation: combatApi.drainHandlers,
});

const screenLate = Object.freeze({
  show: (...args) => navigatorApi.show(...args),
  transition: (...args) => navigatorApi.transition(...args),
  startRun: (...args) => screenOwners.run.startRun(...args),
  finalisePendingRunEnd: (...args) => screenOwners.end.finalisePendingRunEnd(...args),
  journalRunEnd: (...args) => screenOwners.end.journalRunEnd(...args),
  resumePendingHollowRoute: (...args) => screenOwners.run.resumePendingHollowRoute(...args),
  routeVisitedNode: (...args) => screenOwners.map.routeVisitedNode(...args),
  claimMonumentNode: (...args) => screenOwners.map.claimMonumentNode(...args),
  omenBanner: (...args) => screenOwners.reward.omenBanner(...args),
  startCombatUI: (...args) => combatApi.startCombatUI(...args),
  renderHud: (...args) => combatApi.renderHud(...args),
  flyTo: (...args) => combatApi.flyTo(...args),
  tweenNum: (...args) => combatApi.tweenNum(...args),
  banner: (...args) => combatApi.banner(...args),
});
screenOwners = Object.freeze({
  title: createTitleScreen({
    S, E, Vigil, QUEST_IDS, REDUCED, tr, getLocale, getVersionInfo, trace,
    setRoseAssetsReady, setDisclosedRoseStateIds, runEffects, setTheme, themeForRun, assetUrl,
    roseAssets, escHtml, $, $$, screenEl, unlock, sfx,
    meshBindTitle: combatApi.meshBindTitle,
    semanticUiCheckpoint: combatApi.drainHandlers.semanticUiCheckpoint,
    startRun: screenLate.startRun, show: screenLate.show, showHelp, openSettingsPanel,
  }),
  embark: createEmbarkScreen({
    S, E, Vigil, ASPECTS, VOWS, ROMAN, tr, runEffects, setTheme, themeForRun, heroArt,
    screenEl, unlock, sfx, startRun: screenLate.startRun, openOverlay, closeOverlay,
    journalRunEnd: screenLate.journalRunEnd, show: screenLate.show,
  }),
  vigil: createVigilScreen({
    E, Vigil, QUESTS, QUEST_IDS, WHISPERS, DEEDS, CARDS, RELICS, ROMAN, tr,
    runEffects, setRoseAssetsReady, setDisclosedRoseStateIds, roseAssets, assetUrl,
    iconSvg, escHtml, $, $$, screenEl, setTheme, themeForRun, trace,
    semanticUiCheckpoint: combatApi.drainHandlers.semanticUiCheckpoint,
    sfx, music, show: screenLate.show,
  }),
  run: createRunScreen({
    S, E, setTheme, setAltitude, persistenceDialogActive, requireRunSave,
    show: screenLate.show, finalisePendingRunEnd: screenLate.finalisePendingRunEnd,
    startCombatUI: screenLate.startCombatUI, renderHud: screenLate.renderHud, resumeSavedCombat,
    routeVisitedNode: screenLate.routeVisitedNode, claimMonumentNode: screenLate.claimMonumentNode,
    requireBequestClear, omenBanner: screenLate.omenBanner, themeForRun,
  }),
  lamplighter: createLamplighterScreen({
    S, E, BOONS, ASPECTS, ARTS, QUESTS, REDUCED, tr, runEffects, assetUrl,
    iconSvg, fmtText, sceneBg, heroArt, escHtml, $, $$, screenEl, unlock, sfx,
    setTheme, themeForRun,
    renderHud: screenLate.renderHud, show: screenLate.show, omenBanner: screenLate.omenBanner,
    routeVisitedNode: screenLate.routeVisitedNode, persistObserved, requireRunSave,
  }),
  map: createMapScreen({
    S, E, ACTS, OMENS, PROGRESSION, QUESTS, RELICS, CARDS, COARSE, REDUCED,
    tr, runEffects, nodeGlyphId, uiIconUrl, assetUrl, iconInline, iconSvg, omenMark,
    $, $$, screenEl, unlock, sfx, music, openOverlay, closeOverlay, stageW, stageH,
    mapNodePos, enterMapMode, setOverlay, V, peekMap, trace, setAltitude,
    transition: screenLate.transition, startCombatUI: screenLate.startCombatUI, resumeSavedCombat,
    requireRunSave, resumePendingHollowRoute: screenLate.resumePendingHollowRoute,
    show: screenLate.show, showRunSaveFailure, showStonePersistenceFailure,
    requireBequestClear, flyTo: screenLate.flyTo, banner: screenLate.banner, el, escHtml,
    themeForRun, tokenValue,
  }),
  reward: createRewardScreen({
    S, E, POTIONS, RELICS, OMENS, tr, sceneBg, $, el, iconSvg, uiIcon, stageW, stageH,
    V, flyTo: screenLate.flyTo, tweenNum: screenLate.tweenNum, sfx, rasterOr, potionSvg,
    relicArt, requireRunSave, renderHud: screenLate.renderHud, show: screenLate.show,
    showCardGrid, openOverlay, closeOverlay, runEffects, setTheme, setAltitude, transition: screenLate.transition,
    assetUrl, omenIconName, screenEl, themeForRun,
  }),
  rest: createRestScreen({
    S, E, CARDS, RELICS, tr, sceneBg, rasterOr, campfireSvg, iconSvg, $, $$,
    show: screenLate.show, showCardGrid, sfx, V, stageW, stageH, requireHollowRouteClear,
    runEffects, closeOverlay, screenEl, el, chestSvg, renderHud: screenLate.renderHud,
  }),
  shop: createShopScreen({
    S, E, QUESTS, RELICS, POTIONS, tr, sceneBg, rasterOr, merchantSvg, $, el,
    cardEl, uiIcon, sfx, runEffects, renderHud: screenLate.renderHud, iconSvg, escHtml,
    requireRunSave, V, stageW, stageH, potionSvg, relicArt, showCardGrid,
    leaveHollowDestination, show: screenLate.show, screenEl,
  }),
  event: createEventScreen({
    S, E, EVENTS, RELICS, CARDS, tr, sceneBg, rasterOr, eventArtSvg, $, el, sfx,
    leaveHollowDestination, show: screenLate.show, runEffects, renderHud: screenLate.renderHud,
    showCardGrid, screenEl,
  }),
  end: createEndScreen({
    S, E, Vigil, TERMINAL_OUTCOMES, PROGRESSION, QUESTS, RELICS, CARDS, ACTS,
    themeForRun, tr, runEffects, requireRunSave, persistObserved, showRunEndPersistenceFailure,
    show: screenLate.show, presentationBarrier, trace, music, el, REDUCED, sleep,
    persistDawnOrRetry, assetUrl, iconSvg, relicArt, escHtml, $, $$, stageEl,
    sfx, screenEl, metaBg, sunrise, V, stageW, stageH, showCardGrid,
  }),
  gallery: createGalleryScreen({
    assetSetIds, assetSetLabel, ENEMIES, enemySvg, heroSvg, ASPECTS, CARDS,
    cardArtSvg, POTIONS, potionSvg, ARTS, OMENS, EVENTS, eventArtSvg, RELICS,
    DEEDS, QUEST_IDS, UI_CHROME_IDS, uiFallbackName, assetUrl, iconSvg, escHtml, screenEl,
    $, openOverlay, closeOverlay, omenIconName, BOONS, STATUS_INFO,
    campfireSvg, chestSvg, merchantSvg, CORE_CONTENT,
  }),
  audioGallery: createAudioGalleryScreen({
    SFX_CATALOG, MUSIC_CATALOG, getAudioSelection, getAudioSelectionProblems,
    getAudioSource, getAudioPackDefaultRef, getAudioOverrideRefs, getAudioVersions,
    applyAudioSelection, invalidateSfxSelection, music, preloadSfx, previewSfx,
    $, $$, escHtml, screenEl, unlock,
  }),
});
const routes = new Map([
  ['title', screenOwners.title.renderTitle],
  ['embark', screenOwners.embark.renderEmbark],
  ['vigil', screenOwners.vigil.renderVigil],
  ['lamplighter', screenOwners.lamplighter.renderLamplighter],
  ['hollow', screenOwners.lamplighter.renderHollow],
  ['map', screenOwners.map.renderMap],
  ['combat', () => {}],
  ['reward', screenOwners.reward.renderReward],
  ['bossRelic', screenOwners.reward.renderBossRelic],
  ['rest', screenOwners.rest.renderRest],
  ['treasure', screenOwners.rest.renderTreasure],
  ['shop', screenOwners.shop.renderShop],
  ['event', screenOwners.event.renderEvent],
  ['end', screenOwners.end.renderEnd],
  ['gallery', screenOwners.gallery.renderGallery],
  ['audioGallery', screenOwners.audioGallery.renderAudioGallery],
]);

navigatorApi = createNavigator({
  routes,
  beforeShow: () => {
    closeMenus();
    $('#tooltip').style.display = 'none';
    return combatApi.drainHandlers.semanticUiCheckpoint;
  },
  publishMapWarmReader: (reader) => { readMapWarmIds = reader; },
  trace,
});

const probeContext = Object.freeze({
  $, $$, S, E, CORE_CONTENT, combatantView, openPersistenceDialog, presentationBarrier,
  readMapWarmIds: (...args) => readMapWarmIds(...args),
  setForceRoseFallback, stageH, stageInfo, stageRect, stageW, tr, usePotionOn,
});
const probe = installProbe({
  context: probeContext,
  combat: combatApi,
  drain: drainApi,
  navigator: navigatorApi,
  trace,
});

let fitTimer = 0;
function installGlobalOwners() {
  document.addEventListener('pointerdown', () => unlock(), { once: true });
  document.addEventListener('contextmenu', (event) => {
    if (!S.targeting) return;
    event.preventDefault();
    combatApi.clearTargeting();
  });
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      if (S.targeting) combatApi.clearTargeting();
      else if ($('#overlay').classList.contains('open') && $('#overlay')._closable) closeOverlay();
    }
    if ((event.key === 'e' || event.key === 'E') && S.screen === 'combat' && !S.busy) {
      combatApi.onEndTurn();
    }
    if ((event.key === 'a' || event.key === 'A') && S.screen === 'combat' && !S.busy) {
      S.ce?.lantern?.click();
    }
  });
  $('#overlay').addEventListener('pointerdown', (event) => {
    if (event.target === $('#overlay') && $('#overlay')._closable) closeOverlay();
  });
  window.addEventListener('resize', () => {
    clearTimeout(fitTimer);
    fitTimer = setTimeout(() => {
      if (S.cb && S.ce && S.screen === 'combat') combatApi.refitCombat();
    }, 120);
  });
  window.addEventListener('error', () => trace.emit('error.ui', {
    outcome: 'failed', attributes: { code: 'window-error' },
  }));
  window.addEventListener('unhandledrejection', () => trace.emit('error.ui', {
    outcome: 'failed', attributes: { code: 'unhandled-rejection' },
  }));
}

export function initUI() {
  applyExperienceTokens(document.documentElement, UI_TOKENS);
  music.configureThemeMusic({
    themes: CORE_CONTENT.themes,
    themeOrder: CORE_CONTENT.themeOrder,
  });
  bindUICommands({
    show,
    startCombat: combatApi.startCombatUI,
    renderHud: combatApi.renderHud,
    closeOverlay,
  });
  const bootQuery = new URLSearchParams(location.search);
  const audioOutcome = (result) => ['sample', 'synth-fallback', 'playing'].includes(result)
    ? 'completed'
    : 'rejected';
  setSfxObservationSink(({ id, mode, result }) => trace.emit(
    id === 'audio-context' ? 'audio.unlock' : 'audio.sfx-request',
    { outcome: audioOutcome(result), attributes: { id, mode, result } },
  ));
  music.setMusicObservationSink(({ id, mode, result }) => trace.emit('audio.music-request', {
    outcome: audioOutcome(result),
    attributes: { id, mode, result },
  }));

  window.__probe = Object.freeze({
    behaviourTrace: ({ after = null, format = 'records' } = {}) => trace.read({ after, format }),
    traceIntegrity: () => trace.assertIntegrity(),
  });
  if (bootQuery.has('gallery')) return show('gallery');
  if (bootQuery.has('audio')) return show('audioGallery');

  window.spirebound = {
    S,
    E,
    startCombatUI: combatApi.startCombatUI,
    show,
    meshEnabled,
    meshDebug,
    refitCombat: combatApi.refitCombat,
  };
  window.__probe = probe;
  initTooltip();
  installGlobalOwners();
  combatApi.startRig();

  const softCombat = () => {
    if (S.screen === 'combat' && S.cb && S.ce) combatApi.refitCombat();
  };
  onCharMetaChange(softCombat);
  onBFChange(softCombat);
  onUICChange(softCombat);
  show('title');
  trace.emit('renderer.ready', {
    outcome: 'completed', attributes: { rendererId: 'dom' },
  });
  trace.emit('app.ready', { outcome: 'completed' });
}
