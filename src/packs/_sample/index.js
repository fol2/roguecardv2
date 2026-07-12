// Sample pack assembly — card, enemy, and fourth mini theme only.
import { definePack } from '../../registry.js';
import { sampleCard } from './card.js';
import { sampleEnemy } from './enemy.js';
import { sampleTheme } from './theme.js';

export { sampleCard } from './card.js';
export { sampleEnemy } from './enemy.js';
export { sampleTheme } from './theme.js';
export { SAMPLE_LOCALE_EN } from './locale-en.js';

export const SAMPLE_PACK = definePack({
  id: 'sample',
  cards: { sampleCard },
  enemies: { sampleEnemy },
  themes: { sampleTheme },
});
