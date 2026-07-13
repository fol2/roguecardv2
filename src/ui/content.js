// UI-owned full presentation content resolver (core default + ephemeral binding).
import { CORE_CONTENT } from '../content.js';
import { contentIdFor, isEphemeralRun } from '../engine.js';
import { themeForAct } from '../registry.js';

/** @type {WeakMap<object, object>} */
const RUN_PRESENTATION_CONTENT = new WeakMap();

/**
 * Bind a recursively frozen content context to an engine-marked ephemeral run.
 * The bound object must be the same context identity used for `newRun`.
 */
export function bindRunContent(run, content) {
  if (!isEphemeralRun(run)) {
    throw new Error('bindRunContent requires an ephemeral run');
  }
  if (!content || typeof content !== 'object') {
    throw new TypeError('bindRunContent requires a frozen content context');
  }
  if (contentIdFor(run) !== content.id) {
    throw new Error(`bindRunContent content id mismatch: run=${contentIdFor(run)} content=${content.id}`);
  }
  RUN_PRESENTATION_CONTENT.set(run, content);
}

/** Full presentation content view for a run. Unbound / normal → imported CORE_CONTENT. */
export function contentViewFor(run) {
  if (run != null && RUN_PRESENTATION_CONTENT.has(run)) {
    return RUN_PRESENTATION_CONTENT.get(run);
  }
  return CORE_CONTENT;
}

/** Resolved theme record for the run's current act index. */
export function themeForRun(run) {
  const content = contentViewFor(run);
  const index = Number.isInteger(run?.act) ? run.act : 0;
  return themeForAct(content, index);
}

export { CORE_CONTENT };
