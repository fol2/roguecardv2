const TERMINAL_OUTCOMES = ['win', 'death', 'abandon'];
const continuedRuns = new WeakSet();

export function savedRunRequiresFinalisation(run) {
  return TERMINAL_OUTCOMES.includes(run?.pendingRunEnd?.outcome);
}

export function journalTerminalOutcome(run, outcome) {
  if (!TERMINAL_OUTCOMES.includes(outcome)) throw new Error(`invalid terminal outcome: ${outcome}`);
  const current = run.pendingRunEnd?.outcome;
  if (current != null) {
    if (current !== outcome) throw new Error(`terminal outcome cannot change from ${current} to ${outcome}`);
    return run.pendingRunEnd;
  }
  run.pendingReward = null;
  run.pendingCombat = null;
  run.pendingEnemyIds = null;
  run.pendingQuestId = null;
  run.pendingHollow = null;
  run.pendingHollowRoute = null;
  run.pendingRunEnd = { outcome };
  return run.pendingRunEnd;
}

export function finaliseTerminalOutbox(run, persist, onFailure, onFinalised) {
  if (continuedRuns.has(run)) return true;
  let result = null;
  let failed = false;
  let failure = null;
  try {
    result = persist();
  } catch (error) {
    failed = true;
    failure = error;
  }
  if (failed || result?.accepted !== true) {
    onFailure(failure);
    return false;
  }
  continuedRuns.add(run);
  onFinalised(result);
  return true;
}
