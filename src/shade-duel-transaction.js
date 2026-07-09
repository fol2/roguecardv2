// Pure ordering decisions for the cross-store Shade monument transaction.
// All persistence and mutations are injected so this stays Node-safe.
export const SHADE_DUEL_TX = Object.freeze({
  READY: 'ready',
  RETRY_CLAIM: 'retryClaim',
  RETRY_CLEAR: 'retryClear',
  RELOAD_PENDING: 'reloadPending',
});

export function settleShadeDuel({ phase, saveRun, clearBequest, rollbackClaim }) {
  if (phase === 'claim') {
    if (saveRun() !== true) {
      rollbackClaim();
      return { status: SHADE_DUEL_TX.RETRY_CLAIM, durablePending: false };
    }
  } else if (phase !== 'resume') {
    throw new Error('Shade duel transaction phase must be claim or resume');
  }

  if (clearBequest() === true) {
    return { status: SHADE_DUEL_TX.READY, durablePending: true };
  }
  if (phase === 'resume') {
    return { status: SHADE_DUEL_TX.RETRY_CLEAR, durablePending: true };
  }

  rollbackClaim();
  if (saveRun() === true) {
    return { status: SHADE_DUEL_TX.RETRY_CLAIM, durablePending: false };
  }
  return { status: SHADE_DUEL_TX.RELOAD_PENDING, durablePending: true };
}

export function shadeVictorySkipsRewards(run) {
  return run?.pendingQuestId === 'ownShade';
}

export function shadeLossBequestState(run) {
  const unpaidBequest = run?.questScratch?.ownShade?.fall?.bequest != null;
  return { unpaidBequest, offerNewBequest: !unpaidBequest };
}
