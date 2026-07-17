// Node-pure inventories mirrored from the current browser presentation owners.
const freezeIds = (values) => Object.freeze([...values]);

export const VFX_IDS = freezeIds(['slash', 'pierce', 'blunt', 'fire', 'poison', 'void', 'ward']);
export const CHARACTER_KIND_IDS = freezeIds([
  'beast', 'crab', 'crawler', 'cultist', 'eye', 'golem', 'knight', 'leviathan',
  'maw', 'plant', 'rogue', 'serpent', 'shade', 'siren', 'slime', 'sovereign',
  'treeboss', 'wisp', 'zombie',
]);
export const STRUCTURAL_FALLBACK_IDS = freezeIds([
  'cards', 'cloud', 'coin', 'facet', 'heart', 'lantern', 'menu', 'plus',
  'shield', 'sword', 'up',
]);
