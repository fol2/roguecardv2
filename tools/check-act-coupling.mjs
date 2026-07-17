#!/usr/bin/env node
/**
 * Static act-coupling sweep for production JS + i18n catalogues.
 * Findings are keyed by file + ruleId + exact match + SHA-256 of the
 * whitespace-normalised containing statement (never line/column).
 */
import { createHash } from 'node:crypto';
import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import { dirname, join, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const ALLOWLIST_PATH = join(ROOT, 'test/fixtures/act-coupling-allowlist.json');

const RULES = Object.freeze([
  { ruleId: 'act-id-token', re: /\bact[1-9]\b/i },
  { ruleId: 'act-cue-key', re: /\bact[1-9](?:Combat|Boss)\b/ },
  { ruleId: 'act-compare', re: /\b(?:run\.)?act\s*(?:===?|!==?|>=?|<=?)\s*\d+/ },
  { ruleId: 'act-compare-reversed', re: /\d+\s*(?:===?|!==?|>=?|<=?)\s*(?:run\.)?act\b/ },
  { ruleId: 'act-minmax-clamp', re: /Math\.(?:min|max)\([^\n]*\bact\b[^\n]*,\s*\d+\)/ },
  { ruleId: 'acts-encounters-length', re: /\b(?:ACTS|ENCOUNTERS)\.length\b/ },
  { ruleId: 'acts-encounters-index', re: /\b(?:ACTS|ENCOUNTERS)\s*\[\s*(?:\d+|[^\]]*\bact\b[^\]]*)\]/ },
  { ruleId: 'run-act-index', re: /\b[A-Za-z_$][\w$]*(?:\.[A-Za-z_$][\w$]*)*\s*\[\s*(?:run\.)?act\s*\]/ },
  { ruleId: 'named-numeric-index', re: /\b(?:act|theme|weather|palette|haze|music|roster|encounter)\w*\s*\[\s*\d+\s*\]/i },
  { ruleId: 'player-acts-copy', re: /\b\d+\s+acts?\b/i },
  { ruleId: 'act-label-copy', re: /\bAct\s+[1-9]\b/i },
  { ruleId: 'act-switch', re: /\bswitch\s*\(\s*(?:run\.)?act\s*\)/ },
]);

const SCAN_ROOTS = ['src'];
const SKIP_DIRS = new Set(['packs', 'node_modules', 'assets', 'dist']);
const SKIP_FILES = new Set([]);

function walk(dir, out = []) {
  for (const name of readdirSync(dir)) {
    const path = join(dir, name);
    const st = statSync(path);
    if (st.isDirectory()) {
      if (SKIP_DIRS.has(name)) continue;
      // packs are excluded except we already skip packs dir under src
      walk(path, out);
      continue;
    }
    if (!/\.(js|mjs)$/.test(name) && !path.includes(`${join('src', 'i18n')}`)) continue;
    if (/\.(js|mjs)$/.test(name) || /\/i18n\//.test(path.replaceAll('\\', '/'))) {
      if (name.endsWith('.js') || name.endsWith('.mjs')) out.push(path);
    }
  }
  return out;
}

function i18nFiles() {
  const base = join(ROOT, 'src/i18n');
  if (!existsSync(base)) return [];
  const out = [];
  const walkI18n = (dir) => {
    for (const name of readdirSync(dir)) {
      const path = join(dir, name);
      if (statSync(path).isDirectory()) walkI18n(path);
      else if (name.endsWith('.js')) out.push(path);
    }
  };
  walkI18n(base);
  return out;
}

function productionFiles() {
  const files = [];
  for (const root of SCAN_ROOTS) {
    const abs = join(ROOT, root);
    if (!existsSync(abs)) continue;
    for (const path of walk(abs)) {
      const rel = relative(ROOT, path).replaceAll('\\', '/');
      if (rel.startsWith('src/packs/')) continue;
      if (SKIP_FILES.has(rel)) continue;
      files.push(path);
    }
  }
  // ensure i18n catalogues are included even if walk skipped somehow
  for (const path of i18nFiles()) {
    if (!files.includes(path)) files.push(path);
  }
  return files;
}

function stripComments(source) {
  return source
    .replace(/\/\*[\s\S]*?\*\//g, (m) => m.replace(/[^\n]/g, ' '))
    .replace(/(^|[^:])\/\/.*$/gm, '$1');
}

function statementContext(source, index) {
  let start = index;
  while (start > 0 && !/[;{}]/.test(source[start - 1]) && source[start - 1] !== '\n') start -= 1;
  // extend to previous non-empty line start for multi-token statements
  while (start > 0 && source[start - 1] !== '\n') start -= 1;
  let end = index;
  while (end < source.length && !/[;{}]/.test(source[end])) end += 1;
  if (end < source.length && source[end] === ';') end += 1;
  return source.slice(start, end);
}

function normalise(text) {
  return text.replace(/\s+/g, ' ').trim();
}

function contextHash(statement) {
  return createHash('sha256').update(normalise(statement)).digest('hex');
}

function lineCol(source, index) {
  const before = source.slice(0, index);
  const line = before.split('\n').length;
  const col = before.length - before.lastIndexOf('\n');
  return { line, col };
}

function findArrayLiteralActIndexes(source, fileRel, findings) {
  const re = /(\[[^\]]*\])\s*\[\s*((?:run\.)?act)\s*\]/g;
  let m;
  while ((m = re.exec(source))) {
    const match = m[0];
    const stmt = statementContext(source, m.index);
    const { line, col } = lineCol(source, m.index);
    findings.push({
      file: fileRel, ruleId: 'array-literal-act-index', match, contextHash: contextHash(stmt),
      statement: normalise(stmt), line, col,
    });
  }
}

function findSwitchCases(source, fileRel, findings) {
  const switchRe = /\bswitch\s*\(\s*((?:run\.)?act)\s*\)\s*\{/g;
  let m;
  while ((m = switchRe.exec(source))) {
    let depth = 1;
    let i = m.index + m[0].length;
    const bodyStart = i;
    while (i < source.length && depth > 0) {
      if (source[i] === '{') depth += 1;
      else if (source[i] === '}') depth -= 1;
      i += 1;
    }
    const body = source.slice(bodyStart, i - 1);
    const caseRe = /\bcase\s+(\d+)\s*:/g;
    let c;
    while ((c = caseRe.exec(body))) {
      const abs = bodyStart + c.index;
      const stmt = statementContext(source, abs);
      const { line, col } = lineCol(source, abs);
      findings.push({
        file: fileRel, ruleId: 'act-switch-case', match: c[0].trim(),
        contextHash: contextHash(stmt), statement: normalise(stmt), line, col,
      });
    }
  }
}

export function scanSource(source, fileRel) {
  const code = stripComments(source);
  const findings = [];
  for (const { ruleId, re } of RULES) {
    const flags = re.flags.includes('g') ? re.flags : `${re.flags}g`;
    const global = new RegExp(re.source, flags);
    let m;
    while ((m = global.exec(code))) {
      const match = m[0];
      const stmt = statementContext(code, m.index);
      const { line, col } = lineCol(source, m.index);
      findings.push({
        file: fileRel, ruleId, match, contextHash: contextHash(stmt),
        statement: normalise(stmt), line, col,
      });
    }
  }
  findArrayLiteralActIndexes(code, fileRel, findings);
  findSwitchCases(code, fileRel, findings);
  return findings;
}

function findingKey(f) {
  return `${f.file}\0${f.ruleId}\0${f.match}\0${f.contextHash}`;
}

function loadAllowlist() {
  if (!existsSync(ALLOWLIST_PATH)) return [];
  return JSON.parse(readFileSync(ALLOWLIST_PATH, 'utf8'));
}

function compare(findings, allowlist) {
  const allowed = new Map(allowlist.map((row) => [findingKey(row), row]));
  const unexpected = [];
  const used = new Set();
  for (const f of findings) {
    const key = findingKey(f);
    if (allowed.has(key)) used.add(key);
    else unexpected.push(f);
  }
  const stale = allowlist.filter((row) => !used.has(findingKey(row)));
  return { unexpected, stale };
}

function selfTest() {
  const accept = [
    "const id = 'neutral';",
    'run.act = loaded.act;',
    'const x = themeForRun(run);',
  ];
  const reject = [
    { src: 'if (run.act >= 2) {}', ruleId: 'act-compare' },
    { src: 'if (2 <= run.act) {}', ruleId: 'act-compare-reversed' },
    { src: 'const a = ACTS[0];', ruleId: 'acts-encounters-index' },
    { src: 'const e = ENCOUNTERS[run.act];', ruleId: 'acts-encounters-index' },
    { src: 'const w = WEATHER[act];', ruleId: 'run-act-index' },
    { src: "const x = ['a','b','c'][run.act];", ruleId: 'array-literal-act-index' },
    { src: 'const h = palette[1];', ruleId: 'named-numeric-index' },
    { src: 'Math.min(act, 2)', ruleId: 'act-minmax-clamp' },
    { src: 'const n = ACTS.length;', ruleId: 'acts-encounters-length' },
    { src: 'play(act2Boss)', ruleId: 'act-cue-key' },
    { src: 'defeat the boss of each of the 3 acts.', ruleId: 'player-acts-copy' },
    { src: 'Reach Act 3', ruleId: 'act-label-copy' },
    { src: 'switch (run.act) { case 0: break; case 2: break; }', ruleId: 'act-switch-case' },
  ];
  for (const src of accept) {
    const findings = scanSource(src, 'fixture.js');
    if (findings.length) {
      console.error('self-test expected accept:', src, findings);
      process.exit(1);
    }
  }
  for (const { src, ruleId } of reject) {
    const findings = scanSource(src, 'fixture.js');
    if (!findings.some((f) => f.ruleId === ruleId)) {
      console.error('self-test expected reject', ruleId, 'in', src, 'got', findings);
      process.exit(1);
    }
  }
  console.log('act-coupling self-test passed');
}

function main(argv) {
  if (argv.includes('--self-test')) {
    selfTest();
    return;
  }
  const files = productionFiles();
  const findings = [];
  for (const path of files) {
    const rel = relative(ROOT, path).replaceAll('\\', '/');
    findings.push(...scanSource(readFileSync(path, 'utf8'), rel));
  }
  // de-dupe identical keys
  const uniq = new Map();
  for (const f of findings) uniq.set(findingKey(f), f);
  const all = [...uniq.values()].sort((a, b) =>
    a.file.localeCompare(b.file) || a.ruleId.localeCompare(b.ruleId) || a.match.localeCompare(b.match));
  const allowlist = loadAllowlist();
  const { unexpected, stale } = compare(all, allowlist);
  if (argv.includes('--dump')) {
    console.log(JSON.stringify(all, null, 2));
    return;
  }
  if (unexpected.length || stale.length) {
    if (unexpected.length) {
      console.error(`Unexpected act-coupling findings (${unexpected.length}):`);
      for (const f of unexpected) {
        console.error(`  ${f.file}:${f.line}:${f.col} [${f.ruleId}] ${JSON.stringify(f.match)}`);
        console.error(`    hash=${f.contextHash}`);
        console.error(`    stmt=${f.statement.slice(0, 160)}`);
      }
    }
    if (stale.length) {
      console.error(`Stale allowlist entries (${stale.length}):`);
      for (const row of stale) {
        console.error(`  ${row.file} [${row.ruleId}] ${JSON.stringify(row.match)} hash=${row.contextHash}`);
      }
    }
    process.exit(1);
  }
  console.log(`act-coupling: ${all.length} findings, all allowlisted (${allowlist.length} rows)`);
}

const isMain = process.argv[1] && fileURLToPath(import.meta.url) === resolve(process.argv[1]);
if (isMain) main(process.argv.slice(2));
