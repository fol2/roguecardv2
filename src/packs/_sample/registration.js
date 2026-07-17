// Paired sample registration — development/fixture only (order 9000 sentinel).
import { defineContentRegistration } from '../../content-registration.js';
import { SAMPLE_PACK } from './index.js';
import { SAMPLE_LOCALE_EN } from './locale-en.js';

export default defineContentRegistration({
  id: 'sample',
  mechanics: SAMPLE_PACK,
  locales: { en: SAMPLE_LOCALE_EN },
  targets: { development: 9000, fixture: 9000 },
});
