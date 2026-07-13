// Isolated Lab replay preview — descriptor data only; no engine/persistence.
// Resolves `kind` through a fixed presentation-factory map and disposes cleanly.

const FACTORIES = Object.freeze({
  'card-flight': (host, descriptor) => {
    const subject = descriptor.subject || {};
    const panel = document.createElement('div');
    panel.className = 'lab-replay-card-flight';
    panel.setAttribute('data-replay-kind', 'card-flight');
    panel.innerHTML = `<div class="lab-replay-card" data-content-id="${escapeAttr(subject.contentId || '')}" data-upgraded="${subject.upgraded ? '1' : '0'}">
      <span class="lab-replay-card-id">${escapeText(subject.contentId || 'card')}</span>
      <span class="lab-replay-card-dest">${escapeText(descriptor.endState?.destination || '')}</span>
    </div>`;
    host.appendChild(panel);
    // Brief motion for presence — CSS class drives a short transform.
    requestAnimationFrame(() => panel.classList.add('lab-replay-run'));
    return () => { panel.remove(); };
  },
});

function escapeAttr(value) {
  return String(value).replace(/[&<>"']/g, (ch) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
  }[ch]));
}

function escapeText(value) {
  return escapeAttr(value);
}

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
  const dispose = factory(host, descriptor) || (() => {});
  return { ok: true, dispose };
}

export function supportedReplayKinds() {
  return Object.freeze(Object.keys(FACTORIES));
}
