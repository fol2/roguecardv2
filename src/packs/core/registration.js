// Paired core registration — mechanics + existing English content catalogue.
import { defineContentRegistration } from '../../content-registration.js';
import { CORE_PACK } from './index.js';
import * as englishContent from '../../i18n/en/content.js';

const localesEn = Object.fromEntries(
  Object.entries(englishContent).filter(([, value]) => value !== undefined),
);

export default defineContentRegistration({
  id: 'core',
  mechanics: CORE_PACK,
  locales: { en: localesEn },
  targets: { production: 0, development: 0 },
});
