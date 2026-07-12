// Dev-only content registry — compiled development manifest + generic fixtures.
import { compileContentRegistrations } from '../content-registration.js';
import { STATIC_REFERENCE_CATALOGUES } from '../content-resources.js';
import { CONTENT_REGISTRATION_MANIFEST } from './compiled/development.js';

const ALLOWED_KEYS = new Set(['fixtures']);

function assertFixtureSelection(manifest, fixtures) {
  if (!Array.isArray(fixtures) || fixtures.some((id) => typeof id !== 'string' || !id)) {
    throw new TypeError('fixtures must be registration ids');
  }
  if (new Set(fixtures).size !== fixtures.length) {
    throw new Error('Duplicate fixture id');
  }
  for (const id of fixtures) {
    const registration = manifest.registrations.find((row) => row.id === id);
    if (!registration) throw new Error(`Unknown fixture id: ${id}`);
    if (!Object.hasOwn(registration.targets, 'development')
      || !Object.hasOwn(registration.targets, 'fixture')) {
      throw new Error(`Fixture ${id} lacks development+fixture targets`);
    }
  }
}

/**
 * Compile the generated development manifest with an optional fixture-id list.
 * `fixtures: []` → complete core; `fixtures: ['sample']` → core + sample.
 * @param {{ fixtures?: string[] }} [options]
 */
export function createDevRegistry(options = {}) {
  if (!options || typeof options !== 'object' || Array.isArray(options)) {
    throw new TypeError('createDevRegistry options must be a plain object');
  }
  for (const key of Object.keys(options)) {
    if (!ALLOWED_KEYS.has(key)) throw new TypeError(`Unknown createDevRegistry option: ${key}`);
  }
  const fixtures = options.fixtures ?? [];
  assertFixtureSelection(CONTENT_REGISTRATION_MANIFEST, fixtures);
  const fixtureFolders = fixtures.map((fid) => {
    const row = (CONTENT_REGISTRATION_MANIFEST.provenance || [])
      .find((entry) => entry.id === fid);
    const match = typeof row?.sourcePath === 'string'
      ? row.sourcePath.match(/(?:^|\/)packs\/([^/]+)\//)
      : null;
    return match ? match[1] : fid;
  });
  const id = fixtures.length ? `dev:${fixtureFolders.join('+')}` : 'dev';
  return compileContentRegistrations(CONTENT_REGISTRATION_MANIFEST, {
    id,
    resources: STATIC_REFERENCE_CATALOGUES,
    localeToken: 'en',
    fixtures,
  });
}
