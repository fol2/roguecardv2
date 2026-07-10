const PORT_ERROR = 'SPIREBOUND_E2E_PORT must be an integer from 1 to 65535';

export function e2eServerSettings(configuredPort) {
  const isolated = configuredPort !== undefined;
  const portText = configuredPort ?? '5174';
  if (!/^\d{1,5}$/.test(portText)) throw new Error(PORT_ERROR);

  const port = Number(portText);
  if (port < 1 || port > 65535) throw new Error(PORT_ERROR);

  return {
    port,
    isolated,
    origin: isolated ? `http://127.0.0.1:${port}` : 'http://localhost:5174',
    command: isolated
      ? `npm run dev -- --host 127.0.0.1 --port ${port} --strictPort`
      : 'npm run dev',
    reuseExistingServer: !isolated,
  };
}
