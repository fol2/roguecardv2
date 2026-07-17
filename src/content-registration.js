import {
  createContentContext, definePack, doctorContent, joinLocaleContent,
} from './registry.js';
import { STATIC_REFERENCE_CATALOGUES } from './content-resources.js';

const TARGETS = new Set(['production', 'development', 'fixture']);
const freezeGraph = (value, seen = new Set()) => {
  if (!value || typeof value !== 'object' || seen.has(value)) return value;
  seen.add(value);
  for (const child of Object.values(value)) freezeGraph(child, seen);
  return Object.freeze(value);
};
const plain = (value) => value && typeof value === 'object' && !Array.isArray(value);

export function defineContentRegistration(input) {
  if (!plain(input)) throw new TypeError('Content registration must be an object');
  const keys = Object.keys(input);
  if (keys.length !== 4 || !['id', 'mechanics', 'locales', 'targets'].every((key) => keys.includes(key))) throw new TypeError('Content registration has exactly {id, mechanics, locales, targets}');
  if (typeof input.id !== 'string' || !input.id.trim()) throw new TypeError('Content registration id must be non-empty');
  const mechanics = definePack(input.mechanics);
  if (!plain(input.locales) || !plain(input.locales.en) || !Object.keys(input.locales.en).length) throw new TypeError('Content registration requires a non-empty locales.en catalogue');
  for (const [code, fragment] of Object.entries(input.locales)) {
    if (!/^[a-z]{2}(?:-[A-Z]{2})?$/.test(code) || !plain(fragment)) throw new TypeError(`Unknown locale shape: ${code}`);
  }
  if (!plain(input.targets) || !Object.keys(input.targets).length) throw new TypeError('Content registration requires targets');
  for (const [target, order] of Object.entries(input.targets)) {
    if (!TARGETS.has(target) || !Number.isInteger(order) || order < 0) throw new TypeError(`Invalid target or order: ${target}`);
  }
  return freezeGraph({ id: input.id, mechanics, locales: { ...input.locales }, targets: { ...input.targets } });
}

function validateManifest(manifest) {
  if (!plain(manifest) || manifest.version !== 1 || !TARGETS.has(manifest.target) || !Array.isArray(manifest.registrations)) throw new TypeError('Expected a generated version-1 content registration manifest');
  const registrations = manifest.registrations.map((row) => defineContentRegistration(row));
  const ids = new Set(), mechanicIds = new Set();
  const targetOrders = Object.fromEntries([...TARGETS].map((target) => [target, new Map()]));
  for (const registration of registrations) {
    if (ids.has(registration.id)) throw new Error(`Duplicate registration id ${registration.id}`);
    if (mechanicIds.has(registration.mechanics.id)) throw new Error(`Duplicate mechanics pack id ${registration.mechanics.id}`);
    ids.add(registration.id); mechanicIds.add(registration.mechanics.id);
    for (const [target, order] of Object.entries(registration.targets)) {
      if (targetOrders[target].has(order)) throw new Error(`Duplicate target order ${order} for ${targetOrders[target].get(order)} and ${registration.id}`);
      targetOrders[target].set(order, registration.id);
    }
  }
  return registrations;
}

function selectRegistrations(manifest, fixtures = []) {
  const registrations = validateManifest(manifest);
  if (!Array.isArray(fixtures) || fixtures.some((id) => typeof id !== 'string' || !id)) throw new TypeError('fixtures must be registration ids');
  if (manifest.target === 'production' && fixtures.length) throw new Error('Production manifests reject fixture selection');
  const fixtureSet = new Set(fixtures);
  const selected = registrations.filter((registration) => {
    if (Object.hasOwn(registration.targets, 'production')) return true;
    return fixtureSet.has(registration.id)
      && Object.hasOwn(registration.targets, manifest.target)
      && Object.hasOwn(registration.targets, 'fixture');
  });
  for (const id of fixtureSet) {
    const registration = registrations.find((row) => row.id === id);
    if (!registration || !Object.hasOwn(registration.targets, manifest.target) || !Object.hasOwn(registration.targets, 'fixture')) throw new Error(`Requested fixture ${id} is absent from generated ${manifest.target} manifest`);
  }
  const seenOrders = new Map();
  for (const registration of selected) {
    const order = registration.targets[manifest.target] ?? registration.targets.production;
    if (seenOrders.has(order)) throw new Error(`Duplicate target order ${order} for ${seenOrders.get(order)} and ${registration.id}`);
    seenOrders.set(order, registration.id);
  }
  selected.sort((a, b) => {
    const ao = a.targets[manifest.target] ?? a.targets.production;
    const bo = b.targets[manifest.target] ?? b.targets.production;
    return ao - bo || a.id.localeCompare(b.id);
  });
  return selected;
}

function buildProvenance(manifest, selected) {
  const sourceById = new Map((manifest.provenance || []).map((row) => [row.id, row.sourcePath]));
  return freezeGraph({
    target: manifest.target,
    registrationIds: selected.map(({ id }) => id),
    mechanicsPackIds: selected.map(({ mechanics }) => mechanics.id),
    registrations: selected.map((registration) => ({
      id: registration.id,
      mechanicsPackId: registration.mechanics.id,
      sourcePath: sourceById.get(registration.id) || null,
      localeCodes: Object.keys(registration.locales).sort(),
      targets: { ...registration.targets },
    })),
  });
}

export function compileContentRegistrations(manifest, {
  id, resources = STATIC_REFERENCE_CATALOGUES, localeToken = 'en', fixtures = [],
  createContext = createContentContext,
} = {}) {
  const selected = selectRegistrations(manifest, fixtures);
  const fragments = selected.map((registration) => {
    const fragment = registration.locales[localeToken];
    if (!fragment) throw new Error(`Registration ${registration.id} has no locale ${localeToken}`);
    return fragment;
  });
  const localeContent = joinLocaleContent(fragments);
  const context = createContext(selected.map(({ mechanics }) => mechanics), {
    id, resources, localeContent, localeToken,
  });
  return freezeGraph({ context, provenance: buildProvenance(manifest, selected) });
}

export function doctorContentRegistrations(manifest, {
  id = 'content-doctor', resources = STATIC_REFERENCE_CATALOGUES, localeToken = 'en', fixtures = [],
} = {}) {
  const selected = selectRegistrations(manifest, fixtures);
  const localeContent = joinLocaleContent(selected.map((registration) => {
    const fragment = registration.locales[localeToken];
    if (!fragment) throw new Error(`Registration ${registration.id} has no locale ${localeToken}`);
    return fragment;
  }));
  const provenance = buildProvenance(manifest, selected);
  const report = doctorContent(selected.map(({ mechanics }) => mechanics), {
    ...resources, localeContent, localeToken,
  });
  return freezeGraph({ id, report, provenance });
}

export function withContentRegistration(manifest, replacementInput) {
  const registrations = validateManifest(manifest);
  const replacement = defineContentRegistration(replacementInput);
  const index = registrations.findIndex(({ id }) => id === replacement.id);
  if (index < 0) throw new Error(`withContentRegistration may replace only an existing id: ${replacement.id}`);
  const original = registrations[index];
  if (JSON.stringify(original.targets) !== JSON.stringify(replacement.targets)) throw new Error('Replacement must retain target order and metadata');
  const next = [...registrations];
  next[index] = replacement;
  return freezeGraph({ ...manifest, registrations: next, provenance: [...(manifest.provenance || [])] });
}
