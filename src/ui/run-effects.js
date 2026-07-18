// DOM-free transaction coordination for normal game runs. Presentation,
// retries and navigation remain with their caller. Ephemeral Lab runs receive
// success-shaped suppression without storage / Vigil / stats side effects.
import { buildDawnQueue, createTerminalCoordinator } from '../run-lifecycle.js';

function labResult(engine, run, outcome) {
  return Object.freeze({
    kind: 'lab-result',
    outcome: outcome ?? run?.pendingRunEnd?.outcome ?? null,
    contentId: engine.contentIdFor(run),
    accepted: true,
    ephemeral: true,
  });
}

export function createRunEffects({ engine, vigil }) {
  if (!engine || typeof engine !== 'object') throw new TypeError('run effects require an engine');
  if (!vigil || typeof vigil !== 'object') throw new TypeError('run effects require a Vigil adapter');

  const requireRun = (run, label) => {
    if (run == null || typeof run !== 'object') {
      throw new TypeError(`${label} requires a run`);
    }
  };

  const ephemeral = (run) => !!engine.isEphemeralRun?.(run);
  const persistRun = (run) => engine.saveRun(run);

  let coordinator = null;
  const terminal = () => (coordinator ??= createTerminalCoordinator({
    commitVigil: (run, outcome) => vigil.commitTerminalVigil(run, outcome),
    commitStats: (run, won) => engine.commitRunStats(run, won),
    saveRun: persistRun,
    clearSave: (runId) => engine.clearSave(runId),
    loadVigil: () => vigil.loadVigil(),
    claimAct4Promise: (runId) => vigil.claimAct4Promise(runId),
  }));

  const clearBequest = (run) => {
    requireRun(run, 'clearBequest');
    if (ephemeral(run)) return true;
    return vigil.clearBequest();
  };

  const effects = {
    advanceDawn: (run, nextCursor) => {
      if (ephemeral(run)) return true;
      return terminal().advanceDawn(run, nextCursor);
    },
    beginShadeDuel: (run, persist = (action) => action()) => {
      if (ephemeral(run)) return Object.freeze({ status: 'ready' });
      return engine.beginShadeDuel(run, () => persist(() => clearBequest(run)));
    },
    buildDawnQueue,
    buyQuestItem: (run, itemId) => {
      if (ephemeral(run)) return Object.freeze({ ok: true, reason: null });
      return engine.buyQuestItem(run, itemId);
    },
    clearBequest,
    clearNews: () => vigil.clearNews(),
    clearVigil: () => vigil.clearVigil(),
    completeDawn: (run) => {
      if (ephemeral(run)) return true;
      return terminal().completeDawn(run);
    },
    completeHollowRoute: (run) => {
      if (ephemeral(run)) return true;
      return engine.completePendingHollowRoute(run);
    },
    finaliseRunEnd: (run, {
      revealThreshold,
      persist,
      onPersistenceFailure,
      onFinalised,
    }) => {
      if (ephemeral(run)) {
        return labResult(engine, run, run.pendingRunEnd?.outcome);
      }
      const outcome = run.pendingRunEnd?.outcome;
      return engine.finaliseTerminalOutbox(
        run,
        () => persist(() => terminal().finalise(run, { revealThreshold })),
        onPersistenceFailure,
        (result) => onFinalised({ ...result, outcome }),
      );
    },
    journalRunEnd: (run, outcome) => {
      // In-memory journal only — no storage / Vigil / stats. Needed so callers
      // still see pendingRunEnd before Lab-result finalisation.
      return engine.journalTerminalOutcome(run, outcome);
    },
    payHollowPrice: (run) => {
      if (ephemeral(run)) {
        return Object.freeze({ ok: true, deferred: false, message: 'paid' });
      }
      return engine.payHollowPrice(run);
    },
    resumeShadeDuel: (run, persist = (action) => action()) => {
      if (ephemeral(run)) return Object.freeze({ status: 'ready' });
      return engine.resumeShadeDuel(run, () => persist(() => clearBequest(run)));
    },
    saveRun: (run) => {
      if (ephemeral(run)) return true;
      return persistRun(run);
    },
    setBequest: (run, act, row, bequest) => {
      requireRun(run, 'setBequest');
      if (ephemeral(run)) return true;
      return vigil.setBequest(act, row, bequest);
    },
    stageHollowExit: (run) => {
      if (ephemeral(run)) {
        return Object.freeze({
          kind: 'destination', nodeId: null, type: null, eventId: null,
        });
      }
      return engine.stageHollowExit(run);
    },
    syncVigil: () => {
      let current = vigil.syncVigil();
      const saved = engine.loadRun?.();
      if (saved?.pendingDawn?.events?.some((event) => event?.t === 'act4Reveal')) {
        try {
          if (terminal().repairPendingDawn(saved)) current = vigil.loadVigil();
        } catch {
          // The saved queue is the repair witness; leave it intact for the
          // next sync rather than making a transient storage failure fatal.
        }
      }
      return current;
    },
  };
  return Object.freeze(effects);
}
