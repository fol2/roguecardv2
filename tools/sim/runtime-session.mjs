import {
  _captureQuestRngAdapter,
  _restoreQuestRngAdapter,
  _setQuestRng,
} from '../../src/engine.js';
import {
  _captureRuntimeAdapters,
  _restoreRuntimeAdapters,
  _setRng,
  _setStore,
} from '../../src/vigil.js';

const STORAGE_METHODS = Object.freeze(['getItem', 'setItem', 'removeItem']);

function assertStorage(storage) {
  if (!storage || STORAGE_METHODS.some((name) => typeof storage[name] !== 'function')) {
    throw new TypeError('simulator storage requires getItem, setItem, and removeItem');
  }
  return storage;
}

export function createMemoryStore(initial = []) {
  const entries = initial instanceof Map
    ? [...initial.entries()]
    : Array.isArray(initial) ? initial : Object.entries(initial || {});
  const values = new Map(entries.map(([key, value]) => [String(key), String(value)]));
  return Object.freeze({
    getItem: (key) => values.has(String(key)) ? values.get(String(key)) : null,
    setItem: (key, value) => { values.set(String(key), String(value)); },
    removeItem: (key) => { values.delete(String(key)); },
    snapshot: () => new Map(values),
  });
}

function installGlobalStorage(storage) {
  const descriptor = Object.getOwnPropertyDescriptor(globalThis, 'localStorage');
  Object.defineProperty(globalThis, 'localStorage', {
    configurable: true,
    enumerable: descriptor?.enumerable ?? false,
    writable: true,
    value: storage,
  });
  return () => {
    if (descriptor) Object.defineProperty(globalThis, 'localStorage', descriptor);
    else delete globalThis.localStorage;
  };
}

export function withSimulatorRuntime(options, callback) {
  if (typeof callback !== 'function') throw new TypeError('simulator runtime requires a callback');
  const storage = assertStorage(options?.store || createMemoryStore());
  if (typeof options?.armingRng !== 'function' || typeof options?.questRng !== 'function') {
    throw new TypeError('simulator runtime requires seeded arming and quest RNG adapters');
  }

  const vigilSnapshot = _captureRuntimeAdapters();
  const questSnapshot = _captureQuestRngAdapter();
  const restoreGlobalStorage = installGlobalStorage(storage);
  try {
    _setStore(storage);
    _setRng(options.armingRng);
    _setQuestRng(options.questRng);
    const session = Object.freeze({
      store: storage,
      installRoundRng({ armingRng, questRng }) {
        if (typeof armingRng !== 'function' || typeof questRng !== 'function') {
          throw new TypeError('Round RNG adapters must be seeded functions');
        }
        _setRng(armingRng);
        _setQuestRng(questRng);
      },
    });
    return callback(session);
  } finally {
    try {
      _restoreQuestRngAdapter(questSnapshot);
    } finally {
      try {
        _restoreRuntimeAdapters(vigilSnapshot);
      } finally {
        restoreGlobalStorage();
      }
    }
  }
}
