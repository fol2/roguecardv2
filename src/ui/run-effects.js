// DOM-free transaction coordination for normal game runs. Presentation,
// retries and navigation remain with their caller. Ephemeral Lab runs receive
// success-shaped suppression without storage / Vigil / stats side effects.

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

  const buildDawnQueue = (run, ledger, revealThreshold) => {
    const events = [];
    if (ledger?.whisper != null) events.push({ t: 'whisper', text: ledger.whisper });
    events.push(...(run.endQueue || []).map((event) => ({ ...event })));
    const newShards = Array.isArray(ledger?.newShards) ? [...ledger.newShards] : [];
    for (const id of newShards) events.push({ t: 'shardGrant', id });
    const before = new Set(run.shards || []);
    const after = new Set(ledger?.vigil?.shards || [...before, ...newShards]);
    if (newShards.length && before.size < revealThreshold && after.size >= revealThreshold) {
      events.push({ t: 'act4Reveal' });
    }
    return events.filter((event, index, queue) => !(event.t === 'questComplete' &&
      queue.slice(index + 1).some((later) => later.t === 'shardGrant' && later.id === event.id)));
  };

  const clearBequest = (run) => {
    requireRun(run, 'clearBequest');
    if (ephemeral(run)) return true;
    return vigil.clearBequest();
  };

  const effects = {
    advanceDawn: (run, nextCursor) => {
      if (ephemeral(run)) return true;
      return engine.advancePendingDawn(run, nextCursor);
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
      return engine.completePendingDawn(run);
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
      const acknowledgeRunEnd = outcome === 'win'
        ? (candidate) => engine.stagePendingDawn(
            candidate,
            buildDawnQueue(candidate, candidate.runEndResult, revealThreshold),
            candidate.vigilResult?.newUnlocks || [],
          )
        : engine.recordRunEnd;
      return engine.finaliseTerminalOutbox(
        run,
        () => persist(() => vigil.commitPendingRunEnd(run, acknowledgeRunEnd)),
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
      return engine.saveRun(run);
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
    syncVigil: () => vigil.syncVigil(),
  };
  return Object.freeze(effects);
}
