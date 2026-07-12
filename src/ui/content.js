// UI-owned full presentation content resolver (core default; Task 16 adds ephemeral binding).
import { CORE_CONTENT } from '../content.js';
import { themeForAct } from '../registry.js';

/** Full presentation content view for a run. P2: always core. */
export function contentViewFor(_run) {
  return CORE_CONTENT;
}

/** Resolved theme record for the run's current act index. */
export function themeForRun(run) {
  const content = contentViewFor(run);
  const index = Number.isInteger(run?.act) ? run.act : 0;
  return themeForAct(content, index);
}

export { CORE_CONTENT };
