import { pathToFileURL } from 'node:url';
import { readdir, readFile, writeFile, mkdir, stat } from 'node:fs/promises';
import { dirname, relative, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineContentRegistration } from '../src/content-registration.js';

const here = dirname(fileURLToPath(import.meta.url));
const projectRoot = resolve(here, '..');
const normalPath = (value) => value.split(sep).join('/');

export async function discoverContentRegistrations(sourceRoot) {
  const root = resolve(sourceRoot);
  let entries;
  try { entries = await readdir(root, { withFileTypes: true }); } catch (error) {
    if (error.code === 'ENOENT') return [];
    throw error;
  }
  const discovered = [];
  for (const entry of entries.sort((a, b) => a.name.localeCompare(b.name))) {
    if (!entry.isDirectory() || entry.name === 'compiled') continue;
    const sourcePath = resolve(root, entry.name, 'registration.js');
    try {
      if (!(await stat(sourcePath)).isFile()) continue;
    } catch (error) {
      if (error.code === 'ENOENT') continue;
      throw error;
    }
    const imported = await import(`${pathToFileURL(sourcePath).href}?content-registration=${encodeURIComponent(entry.name)}`);
    discovered.push(Object.freeze({
      sourcePath: normalPath(relative(root, sourcePath)),
      modulePath: sourcePath,
      registration: defineContentRegistration(imported.default),
    }));
  }
  return Object.freeze(discovered.sort((a, b) => a.registration.id.localeCompare(b.registration.id)));
}

function targetRows(discovered, target) {
  const rows = discovered.filter(({ registration }) => {
    if (Object.hasOwn(registration.targets, target)) return true;
    // Development and fixture manifests always include the production base.
    if ((target === 'development' || target === 'fixture')
      && Object.hasOwn(registration.targets, 'production')) return true;
    return false;
  });
  return rows.sort((a, b) => {
    const ao = a.registration.targets[target] ?? a.registration.targets.production;
    const bo = b.registration.targets[target] ?? b.registration.targets.production;
    return ao - bo || a.registration.id.localeCompare(b.registration.id);
  });
}

export function renderContentRegistrationManifest(discovered, target, { outputPath = null } = {}) {
  if (!['production', 'development', 'fixture'].includes(target)) throw new TypeError(`Unknown content target ${target}`);
  const rows = targetRows([...discovered], target);
  const importPath = (row) => {
    if (!outputPath || !row.modulePath) return `../${row.sourcePath}`;
    const specifier = normalPath(relative(dirname(resolve(outputPath)), row.modulePath));
    return specifier.startsWith('.') ? specifier : `./${specifier}`;
  };
  const imports = rows.map((row, index) => `import registration${index} from ${JSON.stringify(importPath(row))};`);
  const registrationRefs = rows.map((_, index) => `registration${index}`).join(', ');
  const provenance = rows.map(({ registration, sourcePath }) => `    Object.freeze({ id: ${JSON.stringify(registration.id)}, sourcePath: ${JSON.stringify(`src/packs/${sourcePath}`)}, targets: Object.freeze(${JSON.stringify(registration.targets)}) })`).join(',\n');
  return `${imports.join('\n')}${imports.length ? '\n\n' : ''}export const CONTENT_REGISTRATION_MANIFEST = Object.freeze({\n  version: 1,\n  target: ${JSON.stringify(target)},\n  registrations: Object.freeze([${registrationRefs}]),\n  provenance: Object.freeze([${provenance ? `\n${provenance},\n  ` : ''}]),\n});\n`;
}

export async function compileRegistrationFiles({ sourceRoot, outputs, check = false }) {
  const discovered = await discoverContentRegistrations(sourceRoot);
  if (!discovered.length && check) return Object.freeze({ checked: 0, written: 0 });
  let checked = 0, written = 0;
  for (const [target, output] of Object.entries(outputs)) {
    const path = resolve(output);
    const expected = renderContentRegistrationManifest(discovered, target, { outputPath: path });
    if (check) {
      let actual;
      try { actual = await readFile(path, 'utf8'); } catch (error) {
        if (error.code === 'ENOENT') throw new Error(`Missing generated content manifest: ${path}`);
        throw error;
      }
      if (actual !== expected) throw new Error(`Stale or non-deterministic content manifest: ${path}`);
      checked++;
    } else {
      await mkdir(dirname(path), { recursive: true });
      await writeFile(path, expected);
      written++;
    }
  }
  return Object.freeze({ checked, written });
}

function parseArgs(argv) {
  const options = { check: false, sourceRoot: resolve(projectRoot, 'src/packs'), target: null, output: null };
  for (let index = 0; index < argv.length; index++) {
    const arg = argv[index];
    if (arg === '--check') options.check = true;
    else if (arg === '--source-root') options.sourceRoot = resolve(argv[++index]);
    else if (arg === '--target') options.target = argv[++index];
    else if (arg === '--output') options.output = resolve(argv[++index]);
    else throw new Error(`Unknown argument ${arg}`);
  }
  if ((options.target && !options.output) || (!options.target && options.output)) throw new Error('--target and --output must be supplied together');
  return options;
}

async function main(argv) {
  const options = parseArgs(argv);
  const outputs = options.target
    ? { [options.target]: options.output }
    : {
      production: resolve(projectRoot, 'src/packs/compiled/production.js'),
      development: resolve(projectRoot, 'src/packs/compiled/development.js'),
    };
  await compileRegistrationFiles({ sourceRoot: options.sourceRoot, outputs, check: options.check });
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  main(process.argv.slice(2)).catch((error) => {
    process.stderr.write(`${error.stack || error}\n`);
    process.exitCode = 1;
  });
}
