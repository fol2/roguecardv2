// Production content context — compiled registration manifest only.
import { compileContentRegistrations } from './content-registration.js';
import { STATIC_REFERENCE_CATALOGUES } from './content-resources.js';
import { CONTENT_REGISTRATION_MANIFEST } from './packs/compiled/production.js';

const compiled = compileContentRegistrations(CONTENT_REGISTRATION_MANIFEST, {
  id: 'core',
  resources: STATIC_REFERENCE_CATALOGUES,
  localeToken: 'en',
});

/** @private full frozen core content context */
export const CORE_CONTENT = compiled.context;

/** @private compiled registration provenance */
export const _CORE_CONTENT_PROVENANCE = compiled.provenance;
