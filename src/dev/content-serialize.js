// Deterministic schema-driven serialiser for Content Manager (?contentedit=1).
// Node-pure: imports only registry schemas. Split/ownership from CONTENT_SCHEMAS.source.

import { CONTENT_SCHEMAS } from '../registry.js';

export const CONTENT_SAVE_VERSION = 1;
export const CONTENT_SAVE_MAX_BYTES = 1_048_576;
export const EDITABLE_PACK_IDS = Object.freeze(['core']);
export const EDITABLE_DOMAINS = Object.freeze(['cards', 'relics', 'potions', 'themes']);

export const DOMAIN_MECHANICS_PATH = Object.freeze({
  cards: 'src/packs/core/cards.js',
  relics: 'src/packs/core/relics.js',
  potions: 'src/packs/core/potions.js',
  themes: 'src/packs/core/themes.js',
});

export const DOMAIN_LOCALE_PATH = Object.freeze({
  cards: 'src/i18n/en/content.js',
  relics: 'src/i18n/en/content.js',
  potions: 'src/i18n/en/content.js',
  themes: 'src/i18n/en/content.js',
});

export const DOMAIN_MECHANICS_EXPORT = Object.freeze({
  cards: 'CARDS',
  relics: 'RELICS',
  potions: 'POTIONS',
  themes: 'THEMES',
});

export const DOMAIN_LOCALE_EXPORT = Object.freeze({
  cards: 'cards',
  relics: 'relics',
  potions: 'potions',
  themes: 'acts',
});

const MECHANICS_HEADERS = Object.freeze({
  cards: '// Core pack — card mechanics (locale-free).\n\n',
  relics: '// Core pack — relic mechanics (locale-free).\n\n',
  potions: '// Core pack — potion mechanics (locale-free).\n\n',
  themes: '// Core pack — three complete theme records (locale-free display).\n\n',
});

const PATHISH_KEYS = new Set([
  'path', 'file', 'filepath', 'filePath', 'mechanicsFile', 'localeFile',
  'mechanicsPath', 'localePath', 'target', 'dest', 'destination',
]);

/** Own keys that must never be copied or emitted — assignment can mutate [[Prototype]]. */
const PROTOTYPE_KEYS = new Set(['__proto__', 'prototype', 'constructor']);

function assertSafeKey(key, path) {
  if (PROTOTYPE_KEYS.has(key)) {
    throw new Error(`forbidden prototype/meta key at ${path}: ${key}`);
  }
}

function defineOwnData(target, key, value) {
  Object.defineProperty(target, key, {
    value,
    writable: true,
    enumerable: true,
    configurable: true,
  });
}

function isPlainObject(value) {
  if (value === null || typeof value !== 'object' || Array.isArray(value)) return false;
  const proto = Object.getPrototypeOf(value);
  return proto === Object.prototype || proto === null;
}

function schemaFields(domain) {
  const schema = CONTENT_SCHEMAS[domain];
  if (!schema) throw new Error(`Unknown content domain: ${domain}`);
  return schema.fields || {};
}

export function fieldOwnership(domain) {
  return Object.entries(schemaFields(domain)).map(([name, field]) => Object.freeze({
    name,
    kind: field.kind,
    source: field.source,
    ...(field.reference ? { reference: field.reference } : {}),
    ...(field.arity != null ? { arity: field.arity } : {}),
  }));
}

export function materialiseOwnData(value, path = 'value') {
  if (value === null || typeof value !== 'object') {
    if (typeof value === 'function') throw new Error(`function not allowed at ${path}`);
    if (typeof value === 'symbol') throw new Error(`symbol not allowed at ${path}`);
    if (typeof value === 'bigint') throw new Error(`bigint not allowed at ${path}`);
    if (typeof value === 'number' && !Number.isFinite(value)) throw new Error(`non-finite number at ${path}`);
    return value;
  }
  if (Array.isArray(value)) {
    return value.map((item, index) => materialiseOwnData(item, `${path}[${index}]`));
  }
  if (!isPlainObject(value)) throw new Error(`non-plain object at ${path}`);
  const out = Object.create(null);
  for (const key of Reflect.ownKeys(value)) {
    if (typeof key === 'symbol') throw new Error(`symbol key not allowed at ${path}`);
    assertSafeKey(key, path);
    const descriptor = Object.getOwnPropertyDescriptor(value, key);
    if (!descriptor?.enumerable) continue;
    if (!Object.hasOwn(descriptor, 'value')) {
      throw new Error(`accessor not allowed at ${path}.${key}`);
    }
    defineOwnData(out, key, materialiseOwnData(descriptor.value, `${path}.${key}`));
  }
  return out;
}

function localeFieldNames(domain) {
  return new Set(Object.entries(schemaFields(domain))
    .filter(([, spec]) => spec.source === 'locale')
    .map(([name]) => name));
}

function packFieldNames(domain) {
  return new Set(Object.entries(schemaFields(domain))
    .filter(([, spec]) => spec.source === 'pack')
    .map(([name]) => name));
}

function functionFieldNames(domain) {
  return new Set(Object.entries(schemaFields(domain))
    .filter(([, spec]) => spec.kind === 'function')
    .map(([name]) => name));
}

export function splitBySource(domain, joinedEntry) {
  if (!EDITABLE_DOMAINS.includes(domain)) throw new Error(`domain not editable: ${domain}`);
  const row = materialiseOwnData(joinedEntry, domain);
  const localeNames = localeFieldNames(domain);
  const packNames = packFieldNames(domain);
  const functionNames = functionFieldNames(domain);
  const known = new Set([...localeNames, ...packNames, ...functionNames]);
  const mechanics = Object.create(null);
  const display = Object.create(null);
  const warnings = [];
  for (const key of Object.keys(row)) {
    assertSafeKey(key, domain);
    const value = row[key];
    if (typeof value === 'function' || functionNames.has(key)) {
      throw new Error(`function field not serialisable at ${domain}.${key}`);
    }
    if (localeNames.has(key)) defineOwnData(display, key, value);
    else if (packNames.has(key) || !known.has(key)) {
      if (!known.has(key)) warnings.push(`unknown-field:${domain}.${key}`);
      defineOwnData(mechanics, key, value);
    }
  }
  return { mechanics, display, warnings };
}

export function joinBySource(domain, mechanics, display) {
  const out = Object.create(null);
  const mech = mechanics && typeof mechanics === 'object' ? mechanics : {};
  const disp = display && typeof display === 'object' ? display : {};
  for (const key of Object.keys(mech)) {
    assertSafeKey(key, domain);
    defineOwnData(out, key, mech[key]);
  }
  for (const key of Object.keys(disp)) {
    assertSafeKey(key, domain);
    defineOwnData(out, key, disp[key]);
  }
  return out;
}

function jsKey(key) {
  assertSafeKey(key, 'literal');
  return /^[a-zA-Z_$][\w$]*$/.test(key) ? key : JSON.stringify(String(key));
}

function jsLiteral(value, indent) {
  const pad = '  '.repeat(indent);
  const inner = '  '.repeat(indent + 1);
  if (value === null) return 'null';
  if (typeof value === 'boolean') return value ? 'true' : 'false';
  if (typeof value === 'number') {
    if (!Number.isFinite(value)) throw new Error('non-finite number');
    return Object.is(value, -0) ? '0' : String(value);
  }
  if (typeof value === 'string') return JSON.stringify(value);
  if (typeof value === 'function') throw new Error('function not serialisable');
  if (Array.isArray(value)) {
    if (!value.length) return '[]';
    return `[\n${value.map((item) => `${inner}${jsLiteral(item, indent + 1)},`).join('\n')}\n${pad}]`;
  }
  // Object.create(null) rows from materialiseOwnData are intentional.
  if (value === null || typeof value !== 'object') throw new Error('non-plain object not serialisable');
  const proto = Object.getPrototypeOf(value);
  if (proto !== Object.prototype && proto !== null) {
    throw new Error('non-plain object not serialisable');
  }
  const keys = Object.keys(value);
  if (!keys.length) return '{}';
  return `{\n${keys.map((key) => `${inner}${jsKey(key)}: ${jsLiteral(value[key], indent + 1)},`).join('\n')}\n${pad}}`;
}

function orderEntry(domain, entry, source) {
  const fields = schemaFields(domain);
  const preferred = Object.keys(fields).filter((name) => {
    const spec = fields[name];
    if (spec.kind === 'function') return false;
    if (spec.source !== source) return false;
    return Object.hasOwn(entry, name);
  });
  const rest = Object.keys(entry).filter((key) => !preferred.includes(key));
  const ordered = Object.create(null);
  for (const key of [...preferred, ...rest]) {
    assertSafeKey(key, domain);
    defineOwnData(ordered, key, entry[key]);
  }
  return ordered;
}

function orderTable(order, table, domain, source) {
  const out = Object.create(null);
  for (const id of order) {
    assertSafeKey(id, domain);
    if (!Object.hasOwn(table, id)) continue;
    defineOwnData(out, id, orderEntry(domain, materialiseOwnData(table[id], `${domain}.${id}`), source));
  }
  return out;
}

export function serializeMechanicsModule(domain, table, { order } = {}) {
  if (!EDITABLE_DOMAINS.includes(domain)) throw new Error(`domain not editable: ${domain}`);
  const ids = order || Object.keys(table);
  const ordered = orderTable(ids, table, domain, 'pack');
  for (const id of Object.keys(ordered)) {
    materialiseOwnData(ordered[id], `${domain}.${id}`);
  }
  const exportName = DOMAIN_MECHANICS_EXPORT[domain];
  const header = MECHANICS_HEADERS[domain] || '';
  return `${header}export const ${exportName} = ${jsLiteral(ordered, 0)};\n`;
}

export function serializeLocaleExport(domain, table, { order } = {}) {
  if (!EDITABLE_DOMAINS.includes(domain)) throw new Error(`domain not editable: ${domain}`);
  const exportName = DOMAIN_LOCALE_EXPORT[domain];
  let ordered;
  if (domain === 'themes') {
    // Theme locale catalogue is indexed by theme order position (acts.0/1/2).
    const ids = order || Object.keys(table);
    ordered = Object.create(null);
    for (let index = 0; index < ids.length; index++) {
      const id = ids[index];
      assertSafeKey(id, domain);
      const row = table[id] ?? table[index] ?? table[String(index)];
      if (!row) continue;
      defineOwnData(ordered, index, orderEntry(domain, materialiseOwnData(row, `acts.${index}`), 'locale'));
    }
  } else {
    const ids = order || Object.keys(table);
    ordered = orderTable(ids, table, domain, 'locale');
  }
  return `export const ${exportName} = ${jsLiteral(ordered, 0)};\n`;
}

export function applyLocaleExportToSource(source, exportName, exportSource) {
  const marker = `export const ${exportName} =`;
  const start = source.indexOf(marker);
  if (start < 0) throw new Error(`locale export not found: ${exportName}`);
  let i = start + marker.length;
  while (i < source.length && /\s/.test(source[i])) i++;
  if (source[i] !== '{') throw new Error(`locale export ${exportName} is not an object literal`);
  let depth = 0;
  let end = -1;
  for (; i < source.length; i++) {
    const ch = source[i];
    if (ch === '{') depth++;
    else if (ch === '}') {
      depth--;
      if (depth === 0) {
        end = i + 1;
        break;
      }
    } else if (ch === '"' || ch === "'" || ch === '`') {
      const quote = ch;
      i++;
      while (i < source.length) {
        if (source[i] === '\\') { i += 2; continue; }
        if (source[i] === quote) break;
        i++;
      }
    }
  }
  if (end < 0) throw new Error(`locale export ${exportName} is unclosed`);
  let replaceEnd = end;
  if (source[replaceEnd] === ';') replaceEnd++;
  if (source[replaceEnd] === '\n') replaceEnd++;
  const replacement = exportSource.endsWith('\n') ? exportSource : `${exportSource}\n`;
  return `${source.slice(0, start)}${replacement}${source.slice(replaceEnd)}`;
}

export function validateContentSavePayload(payload) {
  const problems = [];
  if (!isPlainObject(payload)) return ['payload must be a plain object'];
  for (const key of Object.keys(payload)) {
    if (PATHISH_KEYS.has(key)) problems.push(`path field not allowed: ${key}`);
  }
  if (payload.v !== CONTENT_SAVE_VERSION) problems.push(`unsupported version: ${payload.v}`);
  if (!EDITABLE_PACK_IDS.includes(payload.packId)) problems.push(`pack not editable: ${payload.packId}`);
  if (payload.locale !== 'en') problems.push(`locale not editable: ${payload.locale}`);
  if (!EDITABLE_DOMAINS.includes(payload.domain)) problems.push(`domain not editable: ${payload.domain}`);
  if (!Array.isArray(payload.order) || !payload.order.length) problems.push('order must be a non-empty array');
  else {
    const seen = new Set();
    for (const id of payload.order) {
      if (typeof id !== 'string' || !id) problems.push(`invalid order id: ${id}`);
      else if (seen.has(id)) problems.push(`duplicate order id: ${id}`);
      else seen.add(id);
    }
  }
  if (!isPlainObject(payload.mechanics)) problems.push('mechanics must be a plain object');
  if (!isPlainObject(payload.display)) problems.push('display must be a plain object');
  if (isPlainObject(payload.mechanics) && isPlainObject(payload.display) && Array.isArray(payload.order)) {
    for (const id of payload.order) {
      if (!Object.hasOwn(payload.mechanics, id)) problems.push(`order id missing from mechanics projection: ${id}`);
      if (payload.domain === 'themes') {
        // display may be keyed by theme id or by acts index; checked in save handler deeply
        const hasId = Object.hasOwn(payload.display, id);
        const hasIndex = payload.order.some((themeId, index) => themeId === id
          && (Object.hasOwn(payload.display, index) || Object.hasOwn(payload.display, String(index))));
        if (!hasId && !hasIndex) problems.push(`order id missing from display projection: ${id}`);
      } else if (!Object.hasOwn(payload.display, id)) {
        problems.push(`order id missing from display projection: ${id}`);
      }
    }
  }
  return problems;
}

export function buildOrderedMechanicsTable(domain, order, mechanics) {
  return orderTable(order, mechanics, domain, 'pack');
}

export function buildOrderedDisplayTable(domain, order, display) {
  if (domain === 'themes') {
    const out = Object.create(null);
    for (let index = 0; index < order.length; index++) {
      const id = order[index];
      assertSafeKey(id, domain);
      const row = display[id] ?? display[index] ?? display[String(index)];
      if (!row) throw new Error(`display projection missing theme ${id}`);
      defineOwnData(out, id, orderEntry(domain, materialiseOwnData(row, `themes.${id}`), 'locale'));
    }
    return out;
  }
  return orderTable(order, display, domain, 'locale');
}

function canonicalJson(value) {
  if (value === null || typeof value !== 'object') return JSON.stringify(value);
  if (Array.isArray(value)) return `[${value.map(canonicalJson).join(',')}]`;
  const keys = Object.keys(value).sort();
  return `{${keys.map((key) => `${JSON.stringify(key)}:${canonicalJson(value[key])}`).join(',')}}`;
}

function sameData(a, b) {
  return canonicalJson(a) === canonicalJson(b);
}

function unlinkQuiet(unlinkSync, path) {
  try { unlinkSync(path); } catch { /* ignore missing */ }
}

/**
 * Validate a Content Manager save against the joined development registration
 * candidate, then atomically write only the sources whose semantics changed.
 * Filesystem and dynamic import are injected so unit/e2e own the IO boundary.
 */
export async function runContentSaveTransaction(payload, {
  root,
  readFileSync,
  writeFileSync,
  renameSync,
  unlinkSync,
  importModule,
  definePack,
  defineContentRegistration,
  withContentRegistration,
  compileContentRegistrations,
  doctorContentRegistrations,
  developmentManifest,
  createCoreAuthoring,
  englishCatalogue,
}) {
  const problems = validateContentSavePayload(payload);
  if (problems.length) return { ok: false, status: 400, problems };

  const { domain, order } = payload;
  let mechanicsTable;
  let displayTable;
  try {
    mechanicsTable = buildOrderedMechanicsTable(domain, order, payload.mechanics);
    displayTable = buildOrderedDisplayTable(domain, order, payload.display);
  } catch (error) {
    return { ok: false, status: 400, problems: [String(error?.message ?? error)] };
  }

  // Locale-owned fields must never enter the mechanics serialiser and vice versa.
  for (const id of order) {
    for (const key of Object.keys(mechanicsTable[id] || {})) {
      if (localeFieldNames(domain).has(key)) {
        return { ok: false, status: 400, problems: [`locale field in mechanics: ${domain}.${id}.${key}`] };
      }
    }
    for (const key of Object.keys(displayTable[id] || {})) {
      if (schemaFields(domain)[key]?.source === 'pack') {
        return { ok: false, status: 400, problems: [`pack field in display: ${domain}.${id}.${key}`] };
      }
    }
  }

  const mechRel = DOMAIN_MECHANICS_PATH[domain];
  const locRel = DOMAIN_LOCALE_PATH[domain];
  const mechPath = `${root}/${mechRel}`.replace(/\\/g, '/');
  const locPath = `${root}/${locRel}`.replace(/\\/g, '/');
  const mechImportTmp = `${mechPath}.tmp.mjs`;
  const locImportTmp = `${locPath}.${domain}.tmp.mjs`;
  const mechBackup = `${mechPath}.round5-backup`;
  const locBackup = `${locPath}.round5-backup`;
  const mechWriteTmp = `${mechPath}.write.tmp.mjs`;
  const locWriteTmp = `${locPath}.write.tmp.mjs`;
  const owned = [mechImportTmp, locImportTmp, mechBackup, locBackup, mechWriteTmp, locWriteTmp];

  const cleanupOwned = () => {
    for (const path of owned) unlinkQuiet(unlinkSync, path);
  };

  try {
    const mechSource = serializeMechanicsModule(domain, mechanicsTable, { order });
    const locExportSource = serializeLocaleExport(domain, displayTable, { order });
    writeFileSync(mechImportTmp, mechSource);
    writeFileSync(locImportTmp, locExportSource);

    const mechMod = await importModule(mechImportTmp);
    const locMod = await importModule(locImportTmp);
    const mechExport = DOMAIN_MECHANICS_EXPORT[domain];
    const locExport = DOMAIN_LOCALE_EXPORT[domain];
    const importedMechanics = mechMod[mechExport];
    const importedDisplayRaw = locMod[locExport];
    if (!sameData(importedMechanics, mechanicsTable)) {
      cleanupOwned();
      return { ok: false, status: 500, problems: ['imported mechanics do not match serialised candidate'] };
    }

    // Rebuild display keyed by order ids for themes (acts uses numeric keys).
    let importedDisplay = importedDisplayRaw;
    if (domain === 'themes') {
      importedDisplay = {};
      for (let index = 0; index < order.length; index++) {
        importedDisplay[order[index]] = importedDisplayRaw[index] ?? importedDisplayRaw[String(index)];
      }
    }
    if (!sameData(importedDisplay, displayTable)) {
      cleanupOwned();
      return { ok: false, status: 500, problems: ['imported display do not match serialised candidate'] };
    }

    const authoring = createCoreAuthoring();
    authoring[domain] = importedMechanics;
    const pack = definePack({ id: 'core', ...authoring });
    const localesEn = Object.fromEntries(
      Object.entries(englishCatalogue).filter(([, value]) => value !== undefined),
    );
    localesEn[locExport] = importedDisplayRaw;

    const coreReg = developmentManifest.registrations.find((row) => row.id === 'core');
    if (!coreReg) {
      cleanupOwned();
      return { ok: false, status: 500, problems: ['core registration missing from development manifest'] };
    }
    const candidate = defineContentRegistration({
      id: coreReg.id,
      mechanics: pack,
      locales: { en: localesEn },
      targets: { ...coreReg.targets },
    });
    const nextManifest = withContentRegistration(developmentManifest, candidate);
    const compiled = compileContentRegistrations(nextManifest, {
      id: 'content-save-candidate',
      fixtures: ['sample'],
    });
    const doctor = doctorContentRegistrations(nextManifest, {
      id: 'content-save-doctor',
      fixtures: ['sample'],
    });
    if (!doctor.report.ok) {
      cleanupOwned();
      return {
        ok: false,
        status: 400,
        problems: doctor.report.problems
          .filter((p) => p.severity === 'error')
          .map((p) => `${p.code} at ${p.field}`),
      };
    }
    // Prove candidate compilation observed the imported replacement values.
    {
      const firstId = order[0];
      const observedPack = candidate.mechanics[domain]?.[firstId];
      if (!observedPack || !sameData(observedPack, importedMechanics[firstId])) {
        cleanupOwned();
        return { ok: false, status: 500, problems: [`candidate pack missed mechanics.${firstId}`] };
      }
      // Touch compiled context so a green doctor/compile path is required.
      const row = domain === 'themes'
        ? compiled.context.themes?.[firstId]
        : compiled.context[domain]?.[firstId];
      if (!row) {
        cleanupOwned();
        return { ok: false, status: 500, problems: [`candidate compilation missing ${domain}.${firstId}`] };
      }
    }

    const liveMechMod = await importModule(mechPath);
    const liveMechanics = liveMechMod[mechExport];
    const liveLocMod = await importModule(locPath);
    const liveLocaleDomain = liveLocMod[locExport];
    let liveDisplay = liveLocaleDomain;
    if (domain === 'themes') {
      liveDisplay = {};
      for (let index = 0; index < order.length; index++) {
        liveDisplay[order[index]] = liveLocaleDomain[index] ?? liveLocaleDomain[String(index)];
      }
    }

    const mechChanged = !sameData(liveMechanics, importedMechanics);
    const locChanged = !sameData(liveDisplay, importedDisplay);
    if (!mechChanged && !locChanged) {
      cleanupOwned();
      return { ok: true, status: 200, wrote: { mechanics: false, locale: false } };
    }

    const originalMech = readFileSync(mechPath, 'utf8');
    const originalLoc = readFileSync(locPath, 'utf8');
    const nextLoc = locChanged
      ? applyLocaleExportToSource(originalLoc, locExport, locExportSource)
      : originalLoc;

    let wroteMech = false;
    let wroteLoc = false;
    try {
      if (mechChanged) {
        writeFileSync(mechBackup, originalMech);
        writeFileSync(mechWriteTmp, mechSource);
        renameSync(mechWriteTmp, mechPath);
        wroteMech = true;
      }
      if (locChanged) {
        writeFileSync(locBackup, originalLoc);
        writeFileSync(locWriteTmp, nextLoc);
        renameSync(locWriteTmp, locPath);
        wroteLoc = true;
      }
    } catch (error) {
      if (wroteMech) writeFileSync(mechPath, originalMech);
      if (wroteLoc) writeFileSync(locPath, originalLoc);
      cleanupOwned();
      return { ok: false, status: 500, problems: [String(error?.message ?? error)] };
    }

    unlinkQuiet(unlinkSync, mechBackup);
    unlinkQuiet(unlinkSync, locBackup);
    unlinkQuiet(unlinkSync, mechImportTmp);
    unlinkQuiet(unlinkSync, locImportTmp);
    unlinkQuiet(unlinkSync, mechWriteTmp);
    unlinkQuiet(unlinkSync, locWriteTmp);
    return {
      ok: true,
      status: 200,
      wrote: { mechanics: wroteMech, locale: wroteLoc },
      provenance: doctor.provenance,
    };
  } catch (error) {
    cleanupOwned();
    return { ok: false, status: 500, problems: [String(error?.message ?? error)] };
  }
}
