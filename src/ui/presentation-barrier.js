// Node-pure ownership for detached presentation work. The trace observes these
// boundaries, but synchronisation never depends on trace being enabled.
export function createPresentationBarrier({ strict = false } = {}) {
  let destroyed = false;
  let nextId = 1;
  const active = new Map();
  let waiters = [];

  const flush = () => {
    if (active.size) return;
    const pending = waiters;
    waiters = [];
    for (const resolve of pending) resolve(true);
  };

  function begin(kind) {
    if (destroyed) throw new Error('presentation barrier is destroyed');
    if (typeof kind !== 'string' || !kind) throw new TypeError('presentation kind must be a non-empty string');
    const id = nextId++;
    const state = { kind, finished: false };
    active.set(id, state);

    const close = () => {
      if (state.finished || !active.has(id)) {
        if (strict) throw new Error(`presentation token ${id} already finished`);
        return false;
      }
      state.finished = true;
      active.delete(id);
      flush();
      return true;
    };
    return Object.freeze({ finish: close, cancel: close });
  }

  function whenIdle() {
    if (!active.size) return Promise.resolve(true);
    return new Promise((resolve) => waiters.push(resolve));
  }

  function assertIdle() {
    if (active.size) throw new Error(`presentation barrier has ${active.size} active token(s)`);
    return true;
  }

  function destroy() {
    if (destroyed) return false;
    destroyed = true;
    for (const state of active.values()) state.finished = true;
    active.clear();
    flush();
    return true;
  }

  return Object.freeze({
    begin,
    activeCount: () => active.size,
    whenIdle,
    assertIdle,
    destroy,
  });
}
