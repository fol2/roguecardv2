import { MUSIC_CATALOG, SFX_CATALOG } from './audio-catalog.js';
import { CHARACTER_KIND_IDS, STRUCTURAL_FALLBACK_IDS, VFX_IDS } from './presentation-catalog.js';
import { UI_TOKEN_IDS } from './ui/tokens.js';

const frozenSet = (values) => {
  const target = new Set(values);
  return Object.freeze(new Proxy(target, {
    get(set, key) {
      if (key === 'add' || key === 'delete' || key === 'clear') {
        return () => { throw new TypeError('Static reference catalogues are immutable'); };
      }
      const value = Reflect.get(set, key, set);
      return typeof value === 'function' ? value.bind(set) : value;
    },
  }));
};

export const STATIC_REFERENCE_CATALOGUES = Object.freeze({
  vfxIds: frozenSet(VFX_IDS),
  characterKindIds: frozenSet(CHARACTER_KIND_IDS),
  fallbackIds: frozenSet(STRUCTURAL_FALLBACK_IDS),
  musicIds: frozenSet(MUSIC_CATALOG.map(({ id }) => id)),
  sfxIds: frozenSet(SFX_CATALOG.map(({ id }) => id)),
  tokenIds: frozenSet(UI_TOKEN_IDS),
});
