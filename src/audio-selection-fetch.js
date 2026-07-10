const DEFAULT_TIMEOUT_MS = 3000;

/**
 * Fetch the host-owned audio selection without allowing a stalled response to
 * hold the game boot forever. Kept Node-safe so the timeout behaviour has a
 * fast unit test rather than depending on a browser/network race.
 */
export async function fetchAudioSelectionJson(
  url,
  { fetchImpl = globalThis.fetch, timeoutMs = DEFAULT_TIMEOUT_MS } = {},
) {
  if (typeof fetchImpl !== 'function') throw new TypeError('fetch implementation is required');
  if (!Number.isFinite(timeoutMs) || timeoutMs <= 0) throw new RangeError('timeoutMs must be positive');

  const controller = new AbortController();
  let timer;
  const timeout = new Promise((_, reject) => {
    timer = setTimeout(() => {
      reject(new Error(`timed out after ${timeoutMs} ms`));
      controller.abort();
    }, timeoutMs);
  });
  const request = Promise.resolve().then(() => fetchImpl(url, {
    cache: 'no-store',
    signal: controller.signal,
  })).then(async (response) => {
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return response.json();
  });

  try {
    return await Promise.race([request, timeout]);
  } finally {
    clearTimeout(timer);
  }
}
