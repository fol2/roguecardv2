// DOM-free transaction coordination for normal game runs. Presentation,
// retries and navigation remain with their caller.

export function createRunEffects({ engine, vigil }) {
  if (!engine || typeof engine !== 'object') throw new TypeError('run effects require an engine');
  if (!vigil || typeof vigil !== 'object') throw new TypeError('run effects require a Vigil adapter');

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

  const clearBequest = () => vigil.clearBequest();

  const effects = {
    advanceDawn: (run, nextCursor) => engine.advancePendingDawn(run, nextCursor),
    beginShadeDuel: (run, persist = (action) => action()) =>
      engine.beginShadeDuel(run, () => persist(clearBequest)),
    buildDawnQueue,
    buyQuestItem: (run, itemId) => engine.buyQuestItem(run, itemId),
    clearBequest,
    clearNews: () => vigil.clearNews(),
    clearVigil: () => vigil.clearVigil(),
    completeDawn: (run) => engine.completePendingDawn(run),
    completeHollowRoute: (run) => engine.completePendingHollowRoute(run),
    finaliseRunEnd: (run, {
      revealThreshold,
      persist,
      onPersistenceFailure,
      onFinalised,
    }) => {
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
    journalRunEnd: (run, outcome) => engine.journalTerminalOutcome(run, outcome),
    payHollowPrice: (run) => engine.payHollowPrice(run),
    resumeShadeDuel: (run, persist = (action) => action()) =>
      engine.resumeShadeDuel(run, () => persist(clearBequest)),
    saveRun: (run) => engine.saveRun(run),
    setBequest: (act, row, bequest) => vigil.setBequest(act, row, bequest),
    stageHollowExit: (run) => engine.stageHollowExit(run),
    syncVigil: () => vigil.syncVigil(),
  };
  return Object.freeze(effects);
}
