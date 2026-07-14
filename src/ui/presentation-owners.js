// Node-pure presentation ownership inventory for Round 5 Task 28.
// Ownership is keyed by `{domain, eventType}` — never by event name alone.
// Combat `cb.queue` and Dawn `run.endQueue` share four quest names with
// distinct domain-qualified owners.

/** @typedef {'combat'|'end'} PresentationDomain */
/** @typedef {'pixi-combat'|'dom-end'} PresentationOwnerKind */

/**
 * Every Phase-2 presentation event that must have exactly one declared owner.
 * Combat rows are Task 28 Pixi owners; end rows remain DOM (`screens/end.js`)
 * for Task 33/P6 and must not be migrated here.
 */
export const PRESENTATION_OWNERS = Object.freeze([
  // ---- combat cb.queue (Pixi) --------------------------------------------
  { domain: 'combat', eventType: 'bossIntro', owner: 'pixi-combat' },
  { domain: 'combat', eventType: 'variantDialogue', owner: 'pixi-combat' },
  { domain: 'combat', eventType: 'chip', owner: 'pixi-combat' },
  { domain: 'combat', eventType: 'shatter', owner: 'pixi-combat' },
  { domain: 'combat', eventType: 'adamantHold', owner: 'pixi-combat' },
  { domain: 'combat', eventType: 'questReveal', owner: 'pixi-combat' },
  { domain: 'combat', eventType: 'questProgress', owner: 'pixi-combat' },
  { domain: 'combat', eventType: 'questComplete', owner: 'pixi-combat' },
  { domain: 'combat', eventType: 'questUnlock', owner: 'pixi-combat' },
  { domain: 'combat', eventType: 'monumentGift', owner: 'pixi-combat' },
  { domain: 'combat', eventType: 'hollowTithe', owner: 'pixi-combat' },
  { domain: 'combat', eventType: 'ember', owner: 'pixi-combat' },
  { domain: 'combat', eventType: 'kindle', owner: 'pixi-combat' },
  { domain: 'combat', eventType: 'art', owner: 'pixi-combat' },
  { domain: 'combat', eventType: 'staggered', owner: 'pixi-combat' },
  { domain: 'combat', eventType: 'smolderJump', owner: 'pixi-combat' },
  { domain: 'combat', eventType: 'turn', owner: 'pixi-combat' },
  { domain: 'combat', eventType: 'endTurn', owner: 'pixi-combat' },
  { domain: 'combat', eventType: 'draw', owner: 'pixi-combat' },
  { domain: 'combat', eventType: 'reshuffle', owner: 'pixi-combat' },
  { domain: 'combat', eventType: 'play', owner: 'pixi-combat' },
  { domain: 'combat', eventType: 'hitEnemy', owner: 'pixi-combat' },
  { domain: 'combat', eventType: 'die', owner: 'pixi-combat' },
  { domain: 'combat', eventType: 'hitPlayer', owner: 'pixi-combat' },
  { domain: 'combat', eventType: 'blockGain', owner: 'pixi-combat' },
  { domain: 'combat', eventType: 'status', owner: 'pixi-combat' },
  { domain: 'combat', eventType: 'heal', owner: 'pixi-combat' },
  { domain: 'combat', eventType: 'energy', owner: 'pixi-combat' },
  { domain: 'combat', eventType: 'exhaust', owner: 'pixi-combat' },
  { domain: 'combat', eventType: 'discardHand', owner: 'pixi-combat' },
  { domain: 'combat', eventType: 'toDiscard', owner: 'pixi-combat' },
  { domain: 'combat', eventType: 'enemyAct', owner: 'pixi-combat' },
  { domain: 'combat', eventType: 'intent', owner: 'pixi-combat' },
  { domain: 'combat', eventType: 'addCard', owner: 'pixi-combat' },
  { domain: 'combat', eventType: 'relicProc', owner: 'pixi-combat' },
  { domain: 'combat', eventType: 'maxHp', owner: 'pixi-combat' },
  { domain: 'combat', eventType: 'potion', owner: 'pixi-combat' },
  { domain: 'combat', eventType: 'powerConsumed', owner: 'pixi-combat' },
  { domain: 'combat', eventType: 'victory', owner: 'pixi-combat' },
  { domain: 'combat', eventType: 'defeat', owner: 'pixi-combat' },

  // ---- run.endQueue / Dawn (DOM — Task 33; do not migrate in Task 28) ----
  { domain: 'end', eventType: 'whisper', owner: 'dom-end' },
  { domain: 'end', eventType: 'questReveal', owner: 'dom-end' },
  { domain: 'end', eventType: 'questProgress', owner: 'dom-end' },
  { domain: 'end', eventType: 'questUnlock', owner: 'dom-end' },
  { domain: 'end', eventType: 'pageRead', owner: 'dom-end' },
  { domain: 'end', eventType: 'eighthResolved', owner: 'dom-end' },
  { domain: 'end', eventType: 'shadeResolved', owner: 'dom-end' },
  { domain: 'end', eventType: 'questComplete', owner: 'dom-end' },
  { domain: 'end', eventType: 'shardGrant', owner: 'dom-end' },
  { domain: 'end', eventType: 'act4Reveal', owner: 'dom-end' },
]);

const OVERLAP_QUEST_TYPES = Object.freeze([
  'questReveal', 'questProgress', 'questUnlock', 'questComplete',
]);

export function ownerKey(domain, eventType) {
  return `${domain}:${eventType}`;
}

/** Map of `domain:eventType` → owner kind. Throws on duplicate keys. */
export function buildOwnerIndex(rows = PRESENTATION_OWNERS) {
  const index = new Map();
  for (const row of rows) {
    const key = ownerKey(row.domain, row.eventType);
    if (index.has(key)) {
      throw new Error(`duplicate presentation owner for ${key}`);
    }
    index.set(key, row.owner);
  }
  return index;
}

export function ownerFor(domain, eventType, rows = PRESENTATION_OWNERS) {
  const key = ownerKey(domain, eventType);
  const index = buildOwnerIndex(rows);
  if (!index.has(key)) {
    throw new Error(`undeclared presentation owner for ${key}`);
  }
  return index.get(key);
}

/** Quest names that exist in both combat and end domains. */
export function overlappingQuestEventTypes() {
  return OVERLAP_QUEST_TYPES;
}
