import { iconSvg } from '../art.js';
import * as V from '../vfx.js';
import * as music from '../music.js';
import { clearOverlay, exitMapMode } from '../scene3d.js';
import { meshClear } from '../mesh.js';
import { stageH, stageW } from '../stage.js';
import { $, S, screenEl, releaseCardFacesIn } from './context.js';
import { contentViewFor, themeForRun } from './content.js';
import { REDUCED } from './policy.js';
import { omenIconName, warmAssets } from './assets.js';
import { uiCommands } from './commands.js';

export function createNavigator({ routes, beforeShow, publishMapWarmReader, trace }) {
  const routeMap = new Map(routes);
  const routeKeys = Object.freeze([...routeMap.keys()]);

  function wipe() {
    if (REDUCED) return;
    const element = $('#wipe');
    element.classList.remove('go');
    void element.offsetWidth;
    element.classList.add('go');
    setTimeout(() => element.classList.remove('go'), 620);
  }

  let transitionSeq = 0;
  async function transition(kind, opts = {}) {
    if (kind === 'wipe') return wipe();
    if (REDUCED) return;
    const transit = $('#transit');
    if (!transit) return;
    const seq = ++transitionSeq;
    const run = (html, keyframes, duration) => {
      transit.innerHTML = html;
      transit.classList.add('on');
      const child = transit.firstElementChild;
      return child.animate(keyframes, { duration, easing: 'cubic-bezier(0.4, 0, 0.2, 1)' }).finished
        .catch(() => {})
        .finally(() => {
          if (seq !== transitionSeq) return;
          transit.classList.remove('on');
          transit.innerHTML = '';
        });
    };
    if (kind === 'combat-in') {
      const x = opts.x ?? stageW() / 2, y = opts.y ?? stageH() / 2;
      return run('<div class="tr-iris"></div>', [
        { clipPath: `circle(150% at ${x}px ${y}px)` },
        { clipPath: `circle(0% at ${x}px ${y}px)` },
      ], 480);
    }
    if (kind === 'victory-out') return run('<div class="tr-bloom"></div>', [{ opacity: 0 }, { opacity: 1, offset: 0.4 }, { opacity: 0 }], 900);
    if (kind === 'defeat') return run('<div class="tr-crack"></div>', [{ opacity: 0 }, { opacity: 1 }], 700);
    if (kind === 'act-change') {
      const omen = contentViewFor(S.run).omens[S.run.omens?.[S.run.act]];
      return run(`<div class="tr-plate"><div class="tp-act">${(themeForRun(S.run)).name.toUpperCase()}</div>
        ${omen ? `<div class="tp-omen" style="color:${omen.tone}">${iconSvg(omenIconName(S.run.omens[S.run.act]), 16)} OMEN - ${omen.name.toUpperCase()}</div>` : ''}</div>`,
      [{ opacity: 0 }, { opacity: 1, offset: 0.15 }, { opacity: 1, offset: 0.8 }, { opacity: 0 }], 2200);
    }
  }

  function liveMapWarmIds(run = S.run) {
    if (!run) return [];
    const music = themeForRun(run)?.music || {};
    const ids = [music.combat, music.boss, 'elite', 'safeNodes', 'hollowLamplighter'].filter(Boolean);
    if (run.omens?.[run.act] === 'eighthOmen') ids.push('eighthOmen');
    return ids;
  }
  publishMapWarmReader?.((run) => Object.freeze([...liveMapWarmIds(run)]));

  let activeRouteCleanup = null;
  function show(name, data) {
    const renderer = routeMap.get(name);
    if (typeof renderer !== 'function') {
      trace.emit('error.ui', {
        outcome: 'failed', attributes: { code: 'unknown-route' },
      });
      throw new Error(`Unknown UI route: ${name}`);
    }
    const previous = S.screen;
    trace.emit('screen.requested', { outcome: 'accepted', attributes: { screenId: name } });
    if (S.screen !== name && S.run) wipe();
    S.screen = name;
    if (name !== 'end') $('#toasts')?.remove();
    const checkpoint = beforeShow?.({ name, data, previous });
    activeRouteCleanup?.();
    activeRouteCleanup = null;
    if (name !== 'map') { exitMapMode(); clearOverlay(); }
    V.setWeather(null);
    const screen = screenEl();
    // Task 26 — revoke card-face object URLs before #screen replace (shop leave, etc.).
    releaseCardFacesIn(screen);
    screen.className = '';
    screen.onclick = null;
    const cleanup = renderer(data);
    if (typeof cleanup === 'function') activeRouteCleanup = cleanup;
    if (name === 'map') warmAssets();
    if (name !== 'combat' && name !== 'title') meshClear();
    if (S.screen === name && name !== 'combat' && name !== 'end') {
      if (name === 'vigil' && data?.tab === 'rose') music.play('roseWindow');
      else {
        const eighth = S.run?.omens?.[S.run.act] === 'eighthOmen' && (name === 'map' || name === 'event');
        music.playForScreen(name, eighth ? 'eighthOmen' : null);
      }
    }
    if (S.screen === 'map' && S.run) music.warm(...liveMapWarmIds());
    uiCommands.renderHud();
    trace.emit('screen.exited', { outcome: 'completed', attributes: { screenId: previous } });
    if (S.screen === name) {
      trace.emit('screen.entered', { outcome: 'completed', attributes: { screenId: name } });
    } else {
      trace.emit('screen.redirected', {
        outcome: 'completed', attributes: { fromScreenId: name, toScreenId: S.screen },
      });
    }
    trace.emit('checkpoint.ui', { outcome: 'completed', checkpoint: checkpoint?.() });
  }

  return Object.freeze({ show, transition, routeKeys });
}
