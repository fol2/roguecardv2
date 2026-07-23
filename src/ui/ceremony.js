// Loot ceremonies — the reward moments that deserve a held breath. A rare card
// pull and a boss-relic plinth reveal, both mounted as a full-stage `.r5-ceremony`
// layer above every screen and choreographed as beats (anticipation → reveal →
// flourish → settle) that a stylesheet interpolates from a single `data-beat`.
//
// Pure presentation: the engine has already granted the loot before we play. We
// only add a layer, walk the beats, then remove it and resolve. REDUCED shows a
// calm static reveal (no motion); LITE (coarse pointers) keeps every beat but
// cheaper and shorter. Dependency-injected in the `src/ui/` module style so it
// stays testable and never reaches for globals.

import { runPhasedCeremony } from './tween.js';

export function createCeremony(deps) {
  const {
    stageEl, el, cardEl, relicArt, plinthSvg, iconSvg, sfx,
    contentViewFor, S, E, presentationBarrier, trace, REDUCED, COARSE,
  } = deps;

  const tier = () => (REDUCED ? 'reduced' : COARSE ? 'lite' : 'full');

  function mount(variant, tone) {
    const layer = el('div', `r5-ceremony ${variant}`);
    layer.dataset.tier = tier();
    layer.dataset.beat = 'idle';
    layer.setAttribute('role', 'status');
    layer.setAttribute('aria-live', 'polite');
    if (tone) layer.style.setProperty('--cer-tone', tone);
    (stageEl() || document.body).appendChild(layer);
    return layer;
  }

  // Drive the beats. Removing the layer also releases any exported card-face
  // object URL held by cardEl (mirrors overlay's releaseCardFacesIn).
  function play(name, endState, layer, beats) {
    const remove = () => {
      const face = layer.querySelector('.cer-card');
      if (face && typeof face._cardFaceRelease === 'function') face._cardFaceRelease();
      layer.remove();
    };

    if (REDUCED) {
      // No motion: land the composed reveal, sound its keynote, hold, resolve.
      layer.dataset.beat = 'reveal';
      beats.find((b) => b.sfx)?.sfx?.();
      return new Promise((resolve) => { setTimeout(() => { remove(); resolve(); }, 820); });
    }

    const lite = !!COARSE;
    const phases = beats.map((b) => ({
      id: b.id,
      run: () => new Promise((resolve) => {
        layer.dataset.beat = b.id;
        b.sfx?.();
        setTimeout(resolve, lite ? (b.lite ?? Math.round(b.ms * 0.72)) : b.ms);
      }),
    }));
    return runPhasedCeremony({
      name, endState, barrier: presentationBarrier, trace, policy: { lite }, phases,
    }).done.then(remove, remove);
  }

  // ---- rare / boss card pull -------------------------------------------------
  function playCardPull(inst) {
    const data = E.cardData(inst, S.run);
    const layer = mount('r5-ceremony--card');
    layer.setAttribute('aria-label', data.name);
    // Rarity is carried by the card's own gold/holo frame (cardface language);
    // the caption stays a gilt ornament + name, reusing the reward screen motif
    // and adding no new i18n surface.
    layer.innerHTML = `
      <div class="cer-scrim"></div>
      <div class="cer-rays" aria-hidden="true"></div>
      <div class="cer-gloriole" aria-hidden="true">${iconSvg('roseWindow', 320)}</div>
      <div class="cer-stage"><div class="cer-card-slot"><span class="cer-sweep" aria-hidden="true"></span></div></div>
      <div class="cer-caption">
        <span class="cer-kicker" aria-hidden="true">✦ ✦ ✦</span>
        <span class="cer-name"></span>
      </div>`;
    layer.querySelector('.cer-name').textContent = data.name;
    const slot = layer.querySelector('.cer-card-slot');
    // No inline size: the ceremony stylesheet owns `--cw` so the hero card scales
    // responsively (clamped via container units) across stage shapes.
    const face = cardEl(inst);
    face.classList.add('cer-card');
    slot.insertBefore(face, slot.firstChild);
    return play('card-pull', 'rewards-ready', layer, [
      { id: 'anticipation', ms: 460 },
      { id: 'reveal', ms: 540, lite: 400, sfx: () => sfx.kindle?.() },
      { id: 'flourish', ms: 780, lite: 540, sfx: () => sfx.upgrade?.() },
      { id: 'settle', ms: 340, lite: 260 },
    ]);
  }

  // ---- boss-relic plinth reveal ---------------------------------------------
  // `kicker` is the already-translated caption the boss-relic screen holds (kept
  // out of this module so it adds no new tr() locale-key to the frozen UI set).
  function playBossRelic(id, { kicker = '' } = {}) {
    const relic = contentViewFor(S.run).relics[id] || {};
    const tone = relic.tone || '#f2c14e';
    const layer = mount('r5-ceremony--relic', tone);
    layer.setAttribute('aria-label', `${kicker} — ${relic.name || ''}`);
    layer.innerHTML = `
      <div class="cer-scrim"></div>
      <div class="cer-rays" aria-hidden="true"></div>
      <div class="cer-plinth-wrap">
        <div class="cer-halo" aria-hidden="true"></div>
        <div class="cer-plinth" aria-hidden="true">${plinthSvg(tone)}</div>
        <div class="cer-relic">${relicArt(id, 104)}</div>
      </div>
      <div class="cer-caption">
        <span class="cer-kicker cer-kicker--boss"></span>
        <span class="cer-name"></span>
        <span class="cer-desc"></span>
      </div>`;
    layer.querySelector('.cer-kicker').textContent = kicker;
    layer.querySelector('.cer-name').textContent = relic.name || '';
    layer.querySelector('.cer-desc').textContent = relic.text || '';
    return play('boss-relic-grant', 'boss-relic-ready', layer, [
      { id: 'rise', ms: 500 },
      { id: 'kindle', ms: 560, lite: 420, sfx: () => sfx.relic?.() },
      { id: 'crown', ms: 820, lite: 560, sfx: () => sfx.kindle?.() },
      { id: 'settle', ms: 360, lite: 280 },
    ]);
  }

  return Object.freeze({ playCardPull, playBossRelic });
}
