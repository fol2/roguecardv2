// Immutable content-protocol constants — never pack merge targets.
// Re-exported through src/data.js so engine/vigil keep a sole ./data.js import.

export const QUEST_STATES = Object.freeze(['dormant', 'armed', 'revealed', 'complete']);
export const QUEST_ACTIVE_STATES = Object.freeze(['armed', 'revealed']);
export const TERMINAL_OUTCOMES = Object.freeze(['win', 'death', 'abandon']);
export const RUN_ID_RE = /^(?:run|legacy)-[a-z0-9]+(?:-[a-z0-9]+){1,3}$/;
