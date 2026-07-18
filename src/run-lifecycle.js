// Node-pure run lifecycle coordination. Browser storage, in-memory simulator
// storage, and failure-injection fixtures all arrive through explicit ports.
import { RUN_ID_RE, TERMINAL_OUTCOMES } from './content-protocol.js';
import { advancedDawnSnapshot, applyPendingDawnSnapshot, pendingDawnSnapshot } from './engine.js';

const validRunId = (id) => typeof id === 'string' && RUN_ID_RE.test(id);
const copyEvents = (events) => Array.isArray(events)
  ? events.map((event) => ({ ...event }))
  : [];

export function buildDawnQueue(run, ledger, revealThreshold) {
  const events = [];
  if (ledger?.whisper != null) events.push({ t: 'whisper', text: ledger.whisper });
  events.push(...copyEvents(run?.endQueue));
  const newShards = Array.isArray(ledger?.newShards) ? [...ledger.newShards] : [];
  for (const id of newShards) events.push({ t: 'shardGrant', id });

  const promise = ledger?.vigil?.act4Promise;
  const before = new Set(run?.shards || []);
  const after = new Set(ledger?.vigil?.shards || [...before, ...newShards]);
  const legacyCrossing = promise == null && Number.isFinite(revealThreshold) &&
    newShards.length > 0 && before.size < revealThreshold && after.size >= revealThreshold;
  if (promise?.status === 'pending' || legacyCrossing) events.push({ t: 'act4Reveal' });

  return events.filter((event, index, queue) => {
    if (event.t === 'act4Reveal') {
      return queue.findIndex((candidate) => candidate.t === 'act4Reveal') === index;
    }
    return !(event.t === 'questComplete' &&
      queue.slice(index + 1).some((later) => later.t === 'shardGrant' && later.id === event.id));
  });
}

function resultWithAcceptance(terminal, accepted) {
  return {
    accepted,
    outcome: terminal.outcome,
    newUnlocks: [...(terminal.newUnlocks || [])],
    ledger: terminal.ledger,
  };
}

function requirePort(ports, name) {
  if (typeof ports?.[name] !== 'function') {
    throw new TypeError(`terminal coordinator requires ${name} port`);
  }
  return ports[name];
}

export function createTerminalCoordinator(ports) {
  const commitVigil = requirePort(ports, 'commitVigil');
  const commitStats = requirePort(ports, 'commitStats');
  const saveRun = requirePort(ports, 'saveRun');
  const saveDawnCursor = typeof ports.saveDawnCursor === 'function' ? ports.saveDawnCursor : saveRun;
  const clearSave = requirePort(ports, 'clearSave');
  const loadVigil = requirePort(ports, 'loadVigil');
  const claimAct4Promise = requirePort(ports, 'claimAct4Promise');

  const repairPendingDawn = (run) => {
    if (!run?.pendingDawn?.events?.some((event) => event?.t === 'act4Reveal')) return true;
    if (!validRunId(run.runId)) return false;
    const promise = loadVigil()?.act4Promise;
    if (promise?.status === 'pending') return claimAct4Promise(run.runId) === true;
    return promise?.status === 'staged' && promise.provenance === 'runtime' &&
      promise.runId === run.runId;
  };

  const finalise = (run, { revealThreshold } = {}) => {
    const outcome = run?.pendingRunEnd?.outcome;
    if (!TERMINAL_OUTCOMES.includes(outcome)) throw new Error('run has no valid pending outcome');
    const terminal = commitVigil(run, outcome);
    if (!terminal || terminal.outcome !== outcome || !terminal.ledger) {
      throw new Error('Vigil terminal port returned an invalid receipt');
    }

    if (commitStats(run, outcome === 'win') !== true) {
      return resultWithAcceptance(terminal, false);
    }

    if (outcome !== 'win') {
      return resultWithAcceptance(terminal, clearSave(run.runId) === true);
    }

    const events = buildDawnQueue(run, terminal.ledger, revealThreshold);
    const snapshot = pendingDawnSnapshot(run, events, terminal.newUnlocks);
    if (!snapshot || saveRun(snapshot) !== true) return resultWithAcceptance(terminal, false);

    if (events.some((event) => event.t === 'act4Reveal') &&
        claimAct4Promise(run.runId) !== true) {
      return resultWithAcceptance(terminal, false);
    }
    applyPendingDawnSnapshot(run, snapshot);
    return resultWithAcceptance(terminal, true);
  };

  const advanceDawn = (run, nextCursor) => {
    const snapshot = advancedDawnSnapshot(run, nextCursor);
    if (!snapshot) return false;
    if (saveDawnCursor(snapshot) !== true) return false;
    run.pendingDawn.cursor = nextCursor;
    return true;
  };

  const completeDawn = (run) => {
    const pending = run?.pendingDawn;
    if (!pending || !Array.isArray(pending.events) || pending.cursor !== pending.events.length ||
        !validRunId(run.runId) || clearSave(run.runId) !== true) return false;
    run.pendingDawn = null;
    return true;
  };

  return Object.freeze({ finalise, repairPendingDawn, advanceDawn, completeDawn });
}
