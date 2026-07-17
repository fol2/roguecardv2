export function createRunScreen(deps) {
  const { S, E, setTheme, setAltitude, persistenceDialogActive, requireRunSave, show, finalisePendingRunEnd, startCombatUI, renderHud, resumeSavedCombat, routeVisitedNode, claimMonumentNode, requireBequestClear, omenBanner, themeForRun } = deps;

function resumePendingHollowRoute(run) {
  const route = run.pendingHollowRoute;
  if (!route) return false;
  const node = run.map.nodes.find((candidate) => candidate.id === route.nodeId);
  if (!node) return false;
  routeVisitedNode(node, route.type, { eventId: route.eventId });
  return true;
}
function startRun(run, resumed = false) {
  if (!resumed && persistenceDialogActive()) return;
  S.run = run;
  S.cb = null;
  setTheme(themeForRun(run));
  const curNode = run.nodeId ? run.map.nodes.find((n) => n.id === run.nodeId) : null;
  setAltitude(run.act, curNode ? curNode.row : 0);
  const continueStart = () => routeStartedRun(run, resumed, curNode);
  if (!resumed && !requireRunSave(run, continueStart, 'initial-run')) return;
  continueStart();
}
function routeStartedRun(run, resumed, curNode) {
  if (run.pendingDawn) { show('end', { won: true }); return; }
  if (run.pendingRunEnd) { finalisePendingRunEnd(run); return; }
  if (run.pendingHollow) { show('hollow', { nodeId: run.pendingHollow.nodeId }); return; }
  if (run.pendingReward) { show('reward'); return; }
  if (resumed && run.pendingCombat) {
    // died-to-reload protection: an unfinished fight restarts fresh
    const node = run.map.nodes.find((n) => n.id === run.nodeId);
    const ids = run.pendingEnemyIds || E.rollEncounter(run, run.pendingCombat, node ? node.row : 5, node);
    const resumeCombat = () => {
      S.screen = 'combat';
      startCombatUI(ids, run.pendingCombat);
      renderHud();
    };
    const resumePersistedCombat = () => resumeSavedCombat(run, resumeCombat);
    if (!run.pendingEnemyIds) {
      E.setPendingEncounter(run, run.pendingCombat, ids, run.pendingQuestId);
      if (!requireRunSave(run, resumePersistedCombat)) return;
    }
    resumePersistedCombat();
    return;
  }
  if (run.pendingHollowRoute) { resumePendingHollowRoute(run); return; }
  if (resumed && curNode?.type === 'monument' && run.monument) {
    if (!run.monument.claimed) { claimMonumentNode(curNode); return; }
    const continueMap = () => show('map');
    if (!requireBequestClear(continueMap)) return;
    continueMap();
    return;
  }
  if (E.hasPendingBossRelic(run)) { show('bossRelic'); return; }
  if (run.pendingLamplighter) { show('lamplighter'); return; } // the gift comes before the first step
  show('map');
  if (!resumed) setTimeout(() => omenBanner(run), 900);
}

  return Object.freeze({ resumePendingHollowRoute, startRun });
}
