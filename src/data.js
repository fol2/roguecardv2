// SPIREBOUND — assembler surface for the frozen core content context.
// Exact 32-name export inventory: 28 content-view aliases + 4 protocol re-exports.
// English display ownership remains in the locale overlay joined at registration.

import { CORE_CONTENT } from './content.js';
export {
  QUEST_STATES, QUEST_ACTIVE_STATES, TERMINAL_OUTCOMES, RUN_ID_RE,
} from './content-protocol.js';

export const PLAYER = CORE_CONTENT.player;
export const ACTS = CORE_CONTENT.acts;
export const CARDS = CORE_CONTENT.cards;
export const CARD_POOLS = CORE_CONTENT.cardPools;
export const STATUS_INFO = CORE_CONTENT.statuses;
export const RELICS = CORE_CONTENT.relics;
export const RELIC_POOLS = CORE_CONTENT.relicPools;
export const POTIONS = CORE_CONTENT.potions;
export const ENEMIES = CORE_CONTENT.enemies;
export const ENCOUNTERS = CORE_CONTENT.encounters;
export const EVENTS = CORE_CONTENT.events;
export const REWARD_GOLD = CORE_CONTENT.rewardGold;
export const SHOP = CORE_CONTENT.shop;
export const OMENS = CORE_CONTENT.omens;
export const AFFIXES = CORE_CONTENT.affixes;
export const ARTS = CORE_CONTENT.arts;
export const DEEDS = CORE_CONTENT.deeds;
export const PROGRESSION = CORE_CONTENT.progression;
export const REVEALS = CORE_CONTENT.reveals;
export const POOL_GATE = CORE_CONTENT.poolGate;
export const QUEST_IDS = CORE_CONTENT.questIds;
export const WHISPERS = CORE_CONTENT.whispers;
export const QUESTS = CORE_CONTENT.quests;
export const SHADE_KITS = CORE_CONTENT.shadeKits;
export const VARIANTS = CORE_CONTENT.variants;
// Preserve the live ASPECTS[0] === PLAYER identity alias required by the oracle.
export const ASPECTS = Object.freeze([PLAYER, ...CORE_CONTENT.aspects.slice(1)]);
export const VOWS = CORE_CONTENT.vows;
export const BOONS = CORE_CONTENT.boons;
