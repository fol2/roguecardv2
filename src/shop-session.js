// Stable shop cache identity. Dependency-free so the session seam remains
// directly testable in Node alongside the pure engine.
export function shopSessionKey(run) {
  return `${run.runId}:${run.act}:${run.nodeId ?? ''}`;
}

export function shopStockForSession(session, run, generate) {
  const key = shopSessionKey(run);
  if (!session.stock || session.key !== key) {
    session.stock = generate(run);
    session.key = key;
  }
  return session.stock;
}
