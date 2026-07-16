import {
  R5_SCREEN_END_STATES,
  DURATION_MS,
  compositionProfile,
  compositionGrownFrom,
  screenPresentationAttrs,
} from '../tokens.js';
import { runNamedCeremony } from '../tween.js';
import { decodeRoseImage } from '../rose.js';

export function createVigilScreen(deps) {
  const {
    E, Vigil, QUESTS, QUEST_IDS, WHISPERS, DEEDS, CARDS, RELICS, ROMAN, tr, runEffects,
    setRoseAssetsReady, setDisclosedRoseStateIds, roseAssets, assetUrl, iconSvg, escHtml,
    $, $$, screenEl, setTheme, themeForRun, trace, semanticUiCheckpoint, sfx, music, show,
    REDUCED, COARSE, presentationBarrier,
  } = deps;

const ROSE_LABEL_POSITIONS = [
  [50, 15], [78, 34], [78, 69], [50, 84], [22, 69], [22, 34],
];

function presentationPolicy() {
  return {
    motion: REDUCED ? 'reduced' : 'full',
    lite: !!COARSE,
    reduced: !!REDUCED,
  };
}

function rootAttrs(profile, endState) {
  const attrs = screenPresentationAttrs(presentationPolicy());
  return `data-r5-profile="${profile}" data-r5-state="${endState}" data-tier="${attrs.tier}" data-motion="${attrs.motion}"`;
}

function rosePaneStateId(state) {
  if (state === 'armed') return 'rose-pane-armed';
  if (state === 'revealed') return 'rose-pane-revealed';
  if (state === 'complete') return 'rose-pane-complete';
  return 'rose-pane-dormant';
}

function rosePaneCopy(vigil, id, record) {
  const quest = QUESTS[id];
  const disclosure = E.questDisclosure(vigil, id);
  if (record.state === 'armed') return '<div class="rose-pane-mystery">???</div>';
  if (record.state === 'revealed') return `<div class="rose-pane-name">${escHtml(disclosure.name)}</div>
    <div class="rose-pane-inscription">${escHtml(disclosure.inscription)}</div>
    <div class="rose-pane-progress">${disclosure.progress}/${disclosure.target}</div>`;
  if (record.state === 'complete') return `<div class="rose-pane-name">${escHtml(quest.name)}</div>
    <div class="rose-pane-progress">${escHtml(tr('ui.rose.shardRecoveredShort'))}</div>`;
  return '';
}

function rosePaneControl(vigil, id, record, index, selected, assets) {
  const state = record.state;
  const disclosure = E.questDisclosure(vigil, id);
  const name = state === 'dormant'
    ? tr('ui.rose.dormantPane', { n: index + 1 })
    : state === 'armed'
      ? tr('ui.rose.unknownPane', { n: index + 1 })
      : state === 'revealed'
        ? `${disclosure.name}, ${disclosure.progress} of ${disclosure.target}`
        : tr('ui.rose.shardRecovered', { name: QUESTS[id].name });
  const [x, y] = ROSE_LABEL_POSITIONS[index];
  const style = assets ? ` style="--rose-x:${x}%;--rose-y:${y}%"` : '';
  return `<button type="button" class="rose-pane-select${assets ? '' : ' slot-control'}" data-a="rose-pane" data-index="${index}"
    aria-label="${escHtml(name)}" aria-controls="rose-pane-detail" aria-pressed="${selected ? 'true' : 'false'}"${style}></button>`;
}

function roseDetailCopy(vigil, id, record) {
  const quest = QUESTS[id];
  const disclosure = E.questDisclosure(vigil, id);
  if (record.state === 'armed') return '<div class="rose-detail-mystery">???</div>';
  if (record.state === 'revealed') return `<div class="rose-detail-name">${escHtml(disclosure.name)}</div>
    <div class="rose-detail-inscription">${escHtml(disclosure.inscription)}</div>
    <div class="rose-detail-progress">${disclosure.progress}/${disclosure.target}</div>`;
  if (record.state === 'complete') return `<div class="rose-detail-name">${escHtml(quest.name)}</div>
    <div class="rose-detail-progress">${escHtml(tr('ui.rose.shardRecoveredShort'))}</div>`;
  return `<div class="rose-detail-dormant">${escHtml(tr('ui.rose.paneDark'))}</div>`;
}

function rosePaneDetailHtml(v, index) {
  const id = QUEST_IDS[index];
  const record = v.quests[id] || { state: 'dormant', progress: 0, memory: {} };
  const state = ['armed', 'revealed', 'complete'].includes(record.state) ? record.state : 'dormant';
  return `<section id="rose-pane-detail" class="rose-pane-detail ${state}" role="region"
    aria-label="${escHtml(tr('ui.rose.selectedPane'))}" aria-live="polite" data-index="${index}">${roseDetailCopy(v, id, { ...record, state })}</section>`;
}

function initialRosePaneIndex(v) {
  for (const state of ['revealed', 'armed', 'complete']) {
    const index = QUEST_IDS.findIndex((id) => v.quests[id]?.state === state);
    if (index >= 0) return index;
  }
  return 0;
}

function rosePaneHtml(v, assets, id, index, selected) {
  const record = v.quests[id] || { state: 'dormant', progress: 0, memory: {} };
  const state = ['armed', 'revealed', 'complete'].includes(record.state) ? record.state : 'dormant';
  const stateClasses = state === 'complete' ? 'complete lit' : state;
  const identity = state === 'dormant' ? '' : ` data-quest="${id}"`;
  const copy = rosePaneCopy(v, id, { ...record, state });
  if (!assets) {
    const mark = state === 'complete' ? 'emberglassShard' : 'roseWindow';
    return `<div class="rose-pane rose-slot ${stateClasses}" data-index="${index}" data-r5-state="${rosePaneStateId(state)}"${identity}>
      <span class="rose-slot-mark">${iconSvg(mark, 34)}</span>
      <div class="rose-pane-copy" aria-hidden="true">${copy}</div>
      ${rosePaneControl(v, id, record, index, selected, assets)}
    </div>`;
  }
  const [x, y] = ROSE_LABEL_POSITIONS[index];
  return `<div class="rose-pane ${stateClasses}" data-index="${index}" data-r5-state="${rosePaneStateId(state)}"${identity} style="--rose-x:${x}%;--rose-y:${y}%">
    <div class="rose-pane-art" style="--rose-mural:url('${escHtml(assets.mural)}');--rose-mask:url('${escHtml(assets.masks[id])}')"></div>
    <div class="rose-pane-copy" aria-hidden="true">${copy}</div>
    ${rosePaneControl(v, id, record, index, selected, assets)}
  </div>`;
}

function whisperLogHtml(v) {
  const heard = WHISPERS.slice(0, Math.min(v.whispers, WHISPERS.length));
  const rows = heard.map((line, i) => `<div class="whisper-row"><span>${i + 1}</span><i>${escHtml(line)}</i></div>`);
  if (v.whispers > WHISPERS.length) {
    rows.push(`<div class="whisper-row final"><span>∞</span><i>${escHtml(tr('ui.rose.finalWhisper'))}</i></div>`);
  }
  const ready = heard.length > 0;
  return `<div class="whisper-log"${ready ? ' data-r5-state="rose-whispers-ready"' : ''}>
    <div class="whisper-log-title">${tr('ui.rose.whisperLogTitle')}</div>
    ${rows.join('')}
  </div>`;
}

function roseSurfaceHtml(v, assets) {
  const selected = initialRosePaneIndex(v);
  const panes = QUEST_IDS.map((id, i) => rosePaneHtml(v, assets, id, i, i === selected)).join('');
  const sixShards = QUEST_IDS.every((id) => v.quests[id]?.state === 'complete' || v.shards?.includes(id));
  const sixAttr = sixShards ? ' data-r5-state="rose-six-shards"' : '';
  if (!assets) {
    return `<div class="rose-view"${sixAttr}>
      <div class="rose-window rose-fallback" data-r5-state="rose-fallback-ready">${panes}</div>
      ${rosePaneDetailHtml(v, selected)}
      ${whisperLogHtml(v)}
    </div>`;
  }
  const urls = [assets.mural, assets.frame, ...QUEST_IDS.map((id) => assets.masks[id])];
  return `<div class="rose-view"${sixAttr}>
    <div class="rose-window rose-assets" data-r5-state="rose-raster-ready">
      <div class="rose-backdrop"></div>
      ${panes}
      <img class="rose-frame" src="${escHtml(assets.frame)}" alt="">
      <div class="rose-preload" aria-hidden="true">${urls.map((url) => `<img src="${escHtml(url)}" alt="">`).join('')}</div>
    </div>
    ${rosePaneDetailHtml(v, selected)}
    ${whisperLogHtml(v)}
  </div>`;
}

function selectRosePane(root, v, index) {
  if (!Number.isInteger(index) || index < 0 || index >= QUEST_IDS.length) return;
  const detail = $('#rose-pane-detail', root);
  if (!detail) return;
  const id = QUEST_IDS[index];
  const record = v.quests[id] || { state: 'dormant', progress: 0, memory: {} };
  const state = ['armed', 'revealed', 'complete'].includes(record.state) ? record.state : 'dormant';
  detail.className = `rose-pane-detail ${state}`;
  detail.dataset.index = String(index);
  detail.dataset.r5State = 'rose-pane-selected';
  detail.innerHTML = roseDetailCopy(v, id, { ...record, state });
  $$('.rose-pane-select', root).forEach((control) => {
    control.setAttribute('aria-pressed', control.dataset.index === String(index) ? 'true' : 'false');
  });
  $$('.rose-pane', root).forEach((pane) => {
    if (pane.dataset.index === String(index)) pane.dataset.r5Selected = '1';
    else delete pane.dataset.r5Selected;
  });
}

function decodeRoseAssets(root) {
  const rose = $('.rose-window.rose-assets', root);
  if (!rose) return;
  const images = $$('.rose-preload img', rose);
  Promise.all(images.map(decodeRoseImage))
    .then(() => {
      if (!rose.isConnected) return;
      rose.classList.add('ready');
      setRoseAssetsReady(true);
      trace.emit('checkpoint.ui', { outcome: 'completed', checkpoint: semanticUiCheckpoint() });
    })
    .catch(() => {});
}

function renderVigil({ tab = 'deeds' } = {}) {
  setRoseAssetsReady(false);
  setTheme(themeForRun({ act: 0 }));
  const v = runEffects.clearNews(); // opening the hall reads the news
  setDisclosedRoseStateIds(Object.entries(Vigil.questSnapshot(v))
    .map(([id, record]) => `${id}:${record.state}`));
  const hasRose = Vigil.isRevealed(v, 'emberglass');
  const assets = roseAssets();
  const profile = compositionProfile(compositionGrownFrom(v));
  const endState = R5_SCREEN_END_STATES.vigilReady;
  const deedRows = Object.entries(DEEDS).map(([id, deed]) => {
    const cur = v.deeds[deed.stat] || 0;
    const done = cur >= deed.n;
    const pct = Math.min(100, Math.round((cur / deed.n) * 100));
    const rewards = deed.unlocks.map((u) => {
      if (u === 'aspect2') return 'The Ashwarden';
      const [k, rid] = u.split(':');
      return k === 'card' ? (CARDS[rid]?.name || rid) : (RELICS[rid]?.name || rid);
    }).join(', ');
    const du = assetUrl('deeds', id);
    const art = du
      ? `<img class="deed-art" src="${du}" alt="">`
      : `<span class="deed-art-fallback">${iconSvg(`deed-${id}`, 40)}</span>`;
    return `<div class="deed-row${done ? ' done' : ''}">
      ${art}
      <div class="deed-body">
        <div class="deed-head"><span class="deed-name">${done ? '✦ ' : ''}${deed.name}</span><span class="deed-count">${Math.min(cur, deed.n)}/${deed.n}</span></div>
        <div class="deed-desc">${deed.desc} → <i>${rewards}</i></div>
        <div class="deed-bar"><span style="width:${pct}%"></span></div>
      </div>
    </div>`;
  }).join('');
  const sc = screenEl();
  const draw = (requested) => {
    const active = requested === 'rose' && hasRose ? 'rose' : 'deeds';
    const roseAbsent = !hasRose ? ' data-r5-rose="rose-absent"' : '';
    sc.innerHTML = `<div class="center-panel screen-enter r5-scene-panel r5-vigil" ${rootAttrs(profile, 'rest')}${roseAbsent}><div class="panel vigil-panel${active === 'rose' ? ' rose-tab-open' : ''}">
      <div class="ov-title r5-scene-header">${tr('ui.menu.theVigil')}</div>
      <div class="ov-sub">${v.deeds.runs} climbs · ${v.deeds.wins} dawns · deepest Vow: ${ROMAN[v.deeds.bestVow] || '—'}</div>
      <div class="vigil-tabs">
        <button class="vtab${active === 'deeds' ? ' on' : ''}" data-a="tab-deeds">${tr('ui.vigil.deeds')}</button>
        ${hasRose ? `<button class="vtab${active === 'rose' ? ' on' : ''}" data-a="tab-rose">${tr('ui.vigil.roseWindow')}</button>` : ''}
      </div>
      ${active === 'rose' ? roseSurfaceHtml(v, assets) : `<div class="deed-list">${deedRows}</div>`}
      <div class="ov-actions"><button class="btn" data-a="back">${tr('ui.menu.return')}</button></div>
    </div></div>`;
    const root = $('.r5-vigil', sc);
    void runNamedCeremony({
      name: 'vigil',
      endState,
      barrier: presentationBarrier,
      trace,
      from: 0,
      to: 1,
      duration: DURATION_MS.screen,
      easing: 'outSoft',
      policy: presentationPolicy(),
      onUpdate() {},
    }).done.then(() => {
      if (root?.isConnected) root.dataset.r5State = endState;
    }).catch(() => {
      if (root?.isConnected) root.dataset.r5State = endState;
    });
    if (active === 'rose') decodeRoseAssets(sc);
  };
  draw(tab);
  sc.onclick = (e) => {
    const t = e.target.closest('[data-a]');
    if (!t) return;
    sfx.click();
    if (t.dataset.a === 'tab-deeds') {
      draw('deeds');
      music.play('vigil');
    } else if (t.dataset.a === 'tab-rose' && hasRose) {
      draw('rose');
      music.play('roseWindow');
    } else if (t.dataset.a === 'rose-pane') selectRosePane(sc, v, Number(t.dataset.index));
    else if (t.dataset.a === 'back') show('title');
  };
}

  return Object.freeze({ renderVigil });
}
