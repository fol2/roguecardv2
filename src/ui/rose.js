import { QUEST_IDS } from '../data.js';
import { assetUrl } from '../art.js';

const ROSE_ASSET_IDS = {
  mural: 'emberglass-mural',
  frame: 'emberglass-frame',
  masks: Object.fromEntries(QUEST_IDS.map((id) => [id, `emberglass-mask-${id}`])),
};
let forceRoseFallback = false;
let roseAssetsReady = false;
let disclosedRoseStateIds = [];

export function roseAssets() {
  if (forceRoseFallback) return null;
  const mural = assetUrl('meta', ROSE_ASSET_IDS.mural);
  const frame = assetUrl('meta', ROSE_ASSET_IDS.frame);
  const masks = Object.fromEntries(QUEST_IDS.map((id) => [id, assetUrl('meta', ROSE_ASSET_IDS.masks[id])]));
  return mural && frame && Object.values(masks).every(Boolean) ? { mural, frame, masks } : null;
}

export function setForceRoseFallback(on) {
  forceRoseFallback = !!on;
  roseAssetsReady = false;
  return forceRoseFallback;
}

export function setRoseAssetsReady(on) {
  roseAssetsReady = !!on;
  return roseAssetsReady;
}

export function setDisclosedRoseStateIds(ids) {
  disclosedRoseStateIds = Array.isArray(ids) ? [...ids] : [];
  return [...disclosedRoseStateIds];
}

export function getRoseState() {
  return Object.freeze({
    fallback: forceRoseFallback,
    ready: roseAssetsReady,
    stateIds: Object.freeze([...disclosedRoseStateIds]),
  });
}
