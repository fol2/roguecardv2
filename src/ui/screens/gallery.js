export function createGalleryScreen(deps) {
  const { assetSetIds, assetSetLabel, ENEMIES, enemySvg, heroSvg, ASPECTS, CARDS, cardArtSvg, POTIONS, potionSvg, ARTS, OMENS, EVENTS, eventArtSvg, RELICS, DEEDS, QUEST_IDS, UI_CHROME_IDS, uiFallbackName, assetUrl, iconSvg, escHtml, screenEl, $, openOverlay, closeOverlay, omenIconName, BOONS, STATUS_INFO, campfireSvg, chestSvg, merchantSvg, CORE_CONTENT } = deps;

let galleryLightboxWired = false;
function wireGalleryLightbox() {
  if (galleryLightboxWired) return;
  galleryLightboxWired = true;
  const ov = $('#overlay');
  ov.addEventListener('pointerdown', (e) => {
    if (e.target === ov && ov._closable) closeOverlay();
  });
  globalThis.document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && ov.classList.contains('open') && ov._closable) closeOverlay();
  });
}
function openGalleryLightbox(trigger, gallerySet) {
  const cat = trigger.dataset.cat || '';
  const id = trigger.dataset.id || '';
  const url = trigger.dataset.url || '';
  const art = trigger.querySelector('.g-art-stage');
  const title = `${id} / ${cat}`;
  const svg = art?.querySelector('svg');
  const svgUrl = svg ? `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg.outerHTML)}` : '';
  const artHtml = url
    ? `<img class="gallery-lightbox-img" src="${escHtml(url)}" alt="${escHtml(id)}">`
    : (svgUrl ? `<img class="gallery-lightbox-img" src="${escHtml(svgUrl)}" alt="${escHtml(id)}">` : (art ? art.innerHTML : ''));
  openOverlay(`<div class="gallery-lightbox" role="dialog" aria-modal="true" aria-label="${escHtml(title)}">
    <button class="gallery-lightbox-close" type="button" data-a="close" aria-label="Close">&times;</button>
    <div class="gallery-lightbox-meta"><b>${escHtml(id)}</b><span>${escHtml(cat)} - ${escHtml(assetSetLabel(gallerySet))}</span></div>
    <div class="gallery-lightbox-art">${artHtml}</div>
  </div>`, (root) => {
    $('[data-a="close"]', root).onclick = () => closeOverlay();
  }, true);
}
function renderGallery() {
  wireGalleryLightbox();
  const params = new URLSearchParams(location.search);
  const requestedSet = params.get('set') || params.get('assetSet') || 'live';
  const gallerySet = assetSetIds().includes(requestedSet) ? requestedSet : 'live';
  const setLinks = assetSetIds().map((set) => {
    const q = new URLSearchParams(location.search);
    q.set('gallery', '1');
    q.set('set', set);
    return `<a class="${set === gallerySet ? 'active' : ''}" href="?${q.toString()}">${assetSetLabel(set)}</a>`;
  }).join('');
  const cats = {
    omens: Object.keys(OMENS).map((k) => [k, () => iconSvg(omenIconName(k), 64)]),
    boons: Object.keys(BOONS).map((k) => [k, () => iconSvg(`boon-${k}`, 64)]),
    arts: Object.keys(ARTS).map((k) => [k, () => iconSvg(`art-${k}`, 64)]),
    statuses: Object.keys(STATUS_INFO).map((k) => [k, () => iconSvg(`st-${k}`, 64)]),
    heroes: ASPECTS.map((a, i) => [a.id, () => heroSvg(i)]),
    enemies: Object.entries(ENEMIES).map(([k, d]) => [k, () => enemySvg(d.art)]),
    cards: Object.entries(CARDS).map(([k, d]) => [k, () => cardArtSvg(k, d.type)]),
    potions: Object.entries(POTIONS).map(([k, p]) => [k, () => potionSvg(p.tone)]),
    props: [['campfire', campfireSvg], ['chest', () => chestSvg(false)], ['chest-open', () => chestSvg(true)], ['merchant', merchantSvg]],
    events: Object.entries(EVENTS).map(([k, ev]) => [k, () => eventArtSvg(ev.glyph, ev.hue)]),
    title: [['title', () => '<div class="title-banner-ph">title</div>']],
    'title-background': [['background', () => '<div class="title-banner-ph">background</div>']],
    stage: (CORE_CONTENT?.themeOrder || []).flatMap((themeId) => {
      const plates = CORE_CONTENT.themes[themeId]?.plates || {};
      return ['backdrop', 'mid', 'ledge'].map((l) => [plates[l] || `${themeId}-${l}`, () => '<div class="title-banner-ph">stage</div>']);
    }),
    relics: Object.entries(RELICS).map(([k, r]) => [k, () => `<div class="title-banner-ph" style="color:${r.tone}">${r.glyph}</div>`]),
    deeds: Object.keys(DEEDS).map((k) => [k, () => iconSvg(`deed-${k}`, 64)]),
    bequests: ['relic', 'card', 'gold'].map((k) => [k, () => iconSvg(`bequest-${k}`, 64)]),
    meta: [
      'fallen', 'ascended', 'monument-node',
      'emberglass-mural', 'emberglass-frame', ...QUEST_IDS.map((id) => `emberglass-mask-${id}`),
    ].map((k) => [k, () => `<div class="title-banner-ph">${k}</div>`]),
    piles: ['draw', 'discard', 'ashes'].map((k) => [k, () => `<div class="title-banner-ph">${k}</div>`]),
    ui: UI_CHROME_IDS.map((k) => [k, () => {
      const fb = uiFallbackName(k);
      return fb ? iconSvg(fb, 64) : `<div class="title-banner-ph">${k}</div>`;
    }]),
  };
  screenEl().className = 'gallery-mode';
  screenEl().innerHTML = `<div class="g-toolbar">
    <div><b>Asset set:</b> ${assetSetLabel(gallerySet)}</div>
    <nav>${setLinks}</nav>
  </div>` + Object.entries(cats).map(([cat, items]) => {
    const done = items.filter(([id]) => assetUrl(cat, id, gallerySet)).length;
    return `<h2 class="g-head">${cat} — ${done}/${items.length} generated</h2>
      <div class="gallery">${items.map(([id, svg]) => {
        const u = assetUrl(cat, id, gallerySet);
        return `<div class="g-cell ${u ? 'g-png' : 'g-svg'}"><button class="g-art g-open" type="button" data-cat="${escHtml(cat)}" data-id="${escHtml(id)}" data-url="${u ? escHtml(u) : ''}" aria-label="Enlarge ${escHtml(id)}"><span class="g-art-stage">${u ? `<img class="raster-art" src="${escHtml(u)}" alt="">` : svg()}</span></button>
          <div class="g-label">${escHtml(id)}<span class="g-badge">${u ? 'PNG' : 'SVG'}</span></div></div>`;
      }).join('')}</div>`;
  }).join('');
  screenEl().onclick = (e) => {
    const trigger = e.target.closest('.g-open');
    if (!trigger) return;
    openGalleryLightbox(trigger, gallerySet);
  };
}

  return Object.freeze({ renderGallery });
}
