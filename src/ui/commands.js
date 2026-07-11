const bound = Object.create(null);

export function bindUICommands(next) {
  Object.assign(bound, next);
}

function call(name, args) {
  if (typeof bound[name] !== 'function') throw new Error(`UI command not bound: ${name}`);
  return bound[name](...args);
}

export const uiCommands = Object.freeze({
  show: (...args) => call('show', args),
  startCombat: (...args) => call('startCombat', args),
  renderHud: (...args) => call('renderHud', args),
  closeOverlay: (...args) => call('closeOverlay', args),
});
