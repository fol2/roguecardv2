// Isolated Lab replay preview — descriptor data only; no engine/persistence.
// Combat ceremonies reuse createCombatPresentation (same factory as combat-gl).

import { Application, Container } from 'pixi.js';
import { createCombatPresentation } from '../combat-presentation.js';

/**
 * Thin adapter: boot an ephemeral Pixi app + createCombatPresentation, run the
 * ceremony, dispose without mutating the live combat engine.
 * @param {HTMLElement} host
 * @param {object} descriptor
 * @returns {Promise<() => void>}
 */
async function replayCardFlight(host, descriptor) {
  const canvas = document.createElement('canvas');
  canvas.width = 320;
  canvas.height = 220;
  canvas.className = 'lab-replay-canvas';
  canvas.setAttribute('data-replay-kind', 'card-flight');
  host.appendChild(canvas);

  const app = new Application();
  await app.init({
    canvas,
    width: 320,
    height: 220,
    backgroundAlpha: 0,
    antialias: false,
    autoDensity: false,
    preference: 'webgl',
  });
  const parent = new Container();
  parent.label = 'lab-replay-root';
  app.stage.addChild(parent);

  const presentation = createCombatPresentation({
    parent,
    canvas,
    pixiApp: app,
    policy: () => ({
      tier: 'full',
      motion: descriptor.parameters?.motion === 'reduced' ? 'reduced' : 'full',
    }),
  });

  const contentId = descriptor.subject?.contentId || 'strike';
  const upgraded = !!descriptor.subject?.upgraded;
  const fromList = [{
    x: 48,
    y: 170,
    w: 64,
    h: 96,
    inst: { id: contentId, up: upgraded, uid: 'lab-replay-0' },
  }];
  const dest = { x: 260, y: 48 };
  const flight = presentation.flyCardBacks(fromList, dest, {
    ceremony: 'discard',
    face: 'back',
    uids: ['lab-replay-0'],
    budgetMs: 440,
  });

  // Keep the settled ceremony visible until Lab dispose — do not auto-clear.
  await Promise.resolve(flight).catch(() => {});

  let disposed = false;
  return () => {
    if (disposed) return;
    disposed = true;
    try { presentation.destroy(); } catch { /* */ }
    try { app.destroy(true); } catch { /* */ }
    try { canvas.remove(); } catch { /* */ }
  };
}

const FACTORIES = Object.freeze({
  'card-flight': replayCardFlight,
});

/**
 * @param {HTMLElement} host
 * @param {object} descriptor Lab Replay Descriptor (`kind` / `subject` / …)
 * @returns {{ ok: true, dispose: () => void } | { ok: false, reason: string }}
 */
export function renderReplayPreview(host, descriptor) {
  if (!host || typeof host.replaceChildren !== 'function') {
    throw new TypeError('renderReplayPreview requires a host element');
  }
  host.replaceChildren();
  if (!descriptor || typeof descriptor !== 'object') {
    return { ok: false, reason: 'unsupported-presentation' };
  }
  const kind = descriptor.kind;
  const factory = FACTORIES[kind];
  if (typeof factory !== 'function') {
    return { ok: false, reason: 'unsupported-presentation' };
  }

  let disposeFn = () => {};
  let cancelled = false;
  const marker = document.createElement('div');
  marker.className = 'lab-replay-pending';
  marker.setAttribute('data-replay-kind', String(kind));
  host.appendChild(marker);

  Promise.resolve()
    .then(() => factory(host, descriptor))
    .then((dispose) => {
      if (cancelled) {
        try { dispose?.(); } catch { /* */ }
        return;
      }
      try { marker.remove(); } catch { /* */ }
      disposeFn = typeof dispose === 'function' ? dispose : () => {};
    })
    .catch(() => {
      try { marker.remove(); } catch { /* */ }
    });

  return {
    ok: true,
    dispose: () => {
      cancelled = true;
      try { disposeFn(); } catch { /* */ }
      host.replaceChildren();
    },
  };
}

export function supportedReplayKinds() {
  return Object.freeze(Object.keys(FACTORIES));
}
