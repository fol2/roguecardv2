import { QUEST_IDS } from '../data.js';
import { assetUrl } from '../art.js';

export { TITLE_ROSE_PHASES, titleRosePhase } from './tokens.js';

const ROSE_ASSET_IDS = {
  mural: 'emberglass-mural',
  frame: 'emberglass-frame',
  masks: Object.fromEntries(QUEST_IDS.map((id) => [id, `emberglass-mask-${id}`])),
};
let forceRoseFallback = false;
let roseAssetsReady = false;
let roseDecodeFailed = false;
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
  roseDecodeFailed = false;
  return forceRoseFallback;
}

export function setRoseAssetsReady(on) {
  roseAssetsReady = !!on;
  if (on) roseDecodeFailed = false;
  return roseAssetsReady;
}

export function setRoseDecodeFailed(on) {
  roseDecodeFailed = !!on;
  if (on) roseAssetsReady = false;
  return roseDecodeFailed;
}

export function setDisclosedRoseStateIds(ids) {
  disclosedRoseStateIds = Array.isArray(ids) ? [...ids] : [];
  return [...disclosedRoseStateIds];
}

export function getRoseState() {
  return Object.freeze({
    fallback: forceRoseFallback,
    ready: roseAssetsReady,
    decodeFailed: roseDecodeFailed,
    stateIds: Object.freeze([...disclosedRoseStateIds]),
  });
}
