// Isolated Lab replay preview — descriptor data only; no engine/persistence.
// Combat ceremonies reuse createCombatPresentation (same factory as combat-gl).

import { Application, Container } from 'pixi.js';
import { createCombatPresentation } from '../ui/combat-presentation.js';

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

function attachReplayStub(host, kind, reason) {
  const stub = document.createElement('div');
  stub.className = 'lab-replay-stub';
  stub.setAttribute('data-replay-kind', String(kind || 'unknown'));
  stub.setAttribute('data-replay-stub', reason || 'failed');
  stub.textContent = reason ? `Replay preview unavailable (${reason})` : 'Replay preview';
  host.appendChild(stub);
  return stub;
}

/**
 * @param {HTMLElement} host
 * @param {object} descriptor
 * @returns {{ ok: boolean, reason?: string, ready?: Promise<'settled'|'failed'>, dispose: () => void }}
 */
export function renderReplayPreview(host, descriptor) {
  if (!host) return { ok: false, reason: 'missing-host', dispose: () => {} };
  if (!descriptor || typeof descriptor !== 'object') {
    return { ok: false, reason: 'unsupported-presentation', dispose: () => {} };
  }
  const kind = descriptor.kind;
  const factory = FACTORIES[kind];
  if (typeof factory !== 'function') {
    return { ok: false, reason: 'unsupported-presentation', dispose: () => {} };
  }

  let disposeFn = () => {};
  let cancelled = false;
  const marker = document.createElement('div');
  marker.className = 'lab-replay-pending';
  marker.setAttribute('data-replay-kind', String(kind));
  marker.textContent = 'Loading replay preview…';
  host.appendChild(marker);

  const ready = Promise.resolve()
    .then(() => factory(host, descriptor))
    .then((dispose) => {
      if (cancelled) {
        try { dispose?.(); } catch { /* */ }
        return 'failed';
      }
      try { marker.remove(); } catch { /* */ }
      disposeFn = typeof dispose === 'function' ? dispose : () => {};
      // Canvas-only hosts are "empty" to Playwright (textContent-based). Keep a
      // durable text stub so e2e and operators can observe a settled preview.
      if (!host.querySelector('[data-replay-stub]')) {
        attachReplayStub(host, kind, 'settled');
      }
      return 'settled';
    })
    .catch(() => {
      try { marker.remove(); } catch { /* */ }
      if (!cancelled && !host.querySelector('[data-replay-stub]')) {
        attachReplayStub(host, kind, 'failed');
      }
      return 'failed';
    });

  return {
    ok: true,
    ready,
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
