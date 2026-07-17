import { spawnSync } from 'node:child_process';
import { createServer } from 'node:net';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { e2eServerSettings } from '../playwright-server.js';

export async function allocateStrictE2EPort({ createServer: createServerImpl = createServer } = {}) {
  return new Promise((resolvePort, reject) => {
    const server = createServerImpl();
    server.unref();
    server.once('error', reject);
    server.listen({ host: '127.0.0.1', port: 0, exclusive: true }, () => {
      const address = server.address();
      const port = typeof address === 'object' && address ? address.port : null;
      server.close((error) => {
        if (error) reject(error);
        else if (!Number.isInteger(port)) reject(new Error('strict E2E port allocation returned no port'));
        else if (port === 5174) reject(new Error('strict E2E allocator must reject shared port 5174'));
        else resolvePort(port);
      });
    });
  });
}

function validateStrictPort(port) {
  if (!Number.isInteger(port) || port < 1 || port > 65535) {
    throw new Error(`strict E2E allocator returned invalid port ${port}`);
  }
  if (port === 5174) throw new Error('strict E2E allocator must never return shared port 5174');
  const settings = e2eServerSettings(String(port));
  if (settings.port !== port || !settings.isolated || settings.reuseExistingServer ||
      !settings.command.includes('--strictPort')) {
    throw new Error(`port ${port} does not produce strict isolated E2E server settings`);
  }
  return port;
}

export async function runWithStrictE2EPort({
  argv,
  spawn = spawnSync,
  env = process.env,
  allocatePort = allocateStrictE2EPort,
} = {}) {
  if (!Array.isArray(argv) || argv.length === 0 || argv.some((item) => typeof item !== 'string' || item.length === 0)) {
    throw new TypeError('runWithStrictE2EPort requires a non-empty argv array');
  }
  const port = validateStrictPort(await allocatePort());
  process.stdout.write(`Round 5 strict E2E port: ${port}\n`);
  const child = spawn(argv[0], argv.slice(1), {
    shell: false,
    stdio: 'inherit',
    env: { ...env, SPIREBOUND_E2E_PORT: String(port) },
  });
  const status = Number.isInteger(child?.status) ? child.status : child?.signal ? 1 : 1;
  return Object.freeze({ port, status, signal: child?.signal ?? null });
}

async function runCli() {
  if (process.argv[2] !== '--' || process.argv.length < 4) {
    throw new Error('Usage: node tools/run-with-strict-e2e-port.mjs -- <argv...>');
  }
  const result = await runWithStrictE2EPort({ argv: process.argv.slice(3) });
  if (result.signal) {
    process.kill(process.pid, result.signal);
    return;
  }
  process.exitCode = result.status;
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  runCli().catch((error) => {
    console.error(error.message);
    process.exitCode = 1;
  });
}
