#!/usr/bin/env node
// Minimal static server for scratch/cutout-spike — independent of the game dev server.
import { createServer } from 'node:http';
import { readFileSync, statSync, existsSync } from 'node:fs';
import { join, extname } from 'node:path';
import { fileURLToPath } from 'node:url';

// repo root so /node_modules/three is importable; '/' lands on the mesh spike
const root = join(fileURLToPath(new URL('.', import.meta.url)), '..');
const port = Number(process.env.SPIKE_PORT || 5199);
const types = { '.html': 'text/html', '.js': 'text/javascript', '.png': 'image/png', '.json': 'application/json' };

createServer((req, res) => {
  const urlPath = decodeURIComponent((req.url || '/').split('?')[0]);
  const path = join(root, urlPath === '/' ? '/scratch/mesh-spike/mesh.html' : urlPath);
  if (!path.startsWith(root) || !existsSync(path) || !statSync(path).isFile()) {
    res.writeHead(404); res.end('not found'); return;
  }
  res.writeHead(200, { 'Content-Type': types[extname(path)] || 'application/octet-stream', 'Cache-Control': 'no-store' });
  res.end(readFileSync(path));
}).listen(port, '127.0.0.1', () => {
  console.log(`cutout spike: http://127.0.0.1:${port}/rig.html`);
});
