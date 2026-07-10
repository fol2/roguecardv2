// Deterministic runtime audio-selection JSON serialiser. Validation lives in
// audio-packs.js and is shared by tests, the browser loader, and Vite backend.

function orderedBus(bus = {}) {
  return {
    version: bus.version,
    overrides: Object.fromEntries(Object.entries(bus.overrides ?? {}).sort(([a], [b]) => a.localeCompare(b))),
  };
}

export function serializeAudioSelection(selection) {
  return `${JSON.stringify({
    music: orderedBus(selection.music),
    sfx: orderedBus(selection.sfx),
  }, null, 2)}\n`;
}
