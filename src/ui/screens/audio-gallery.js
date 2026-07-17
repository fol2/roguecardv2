export function createAudioGalleryScreen(deps) {
  const { SFX_CATALOG, MUSIC_CATALOG, getAudioSelection, getAudioSelectionProblems, getAudioSource, getAudioPackDefaultRef, getAudioOverrideRefs, getAudioVersions, applyAudioSelection, invalidateSfxSelection, music, preloadSfx, previewSfx, $, $$, escHtml, screenEl, unlock } = deps;

function renderAudioGallery() {
  const sc = screenEl();
  sc.className = 'gallery-mode audio-gallery-mode';
  const selection = getAudioSelection();
  const selectionProblems = getAudioSelectionProblems();
  const sourceControl = (kind, id) => {
    const source = getAudioSource(kind, id);
    const state = source?.overridden ? 'override' : source?.fallback ? 'base fallback' : 'pack';
    const ref = source?.ref ?? 'missing';
    if (!import.meta.env.DEV) {
      return `<span class="ag-source-read" title="${escHtml(state)}">${escHtml(ref)}</span>`;
    }
    const packDefault = getAudioPackDefaultRef(kind, id, selection) ?? 'missing';
    const selected = selection[kind].overrides[id] ?? '';
    const options = getAudioOverrideRefs(kind, id, { exclude: packDefault }).map((assetRef) => `
      <option value="${escHtml(assetRef)}" ${assetRef === selected ? 'selected' : ''}>${escHtml(assetRef)}</option>`).join('');
    return `<select class="ag-source" data-source-kind="${kind}" data-source-id="${escHtml(id)}" aria-label="Override ${escHtml(id)}">
      <option value="" ${selected ? '' : 'selected'}>Pack default · ${escHtml(packDefault)}</option>${options}
    </select>`;
  };
  const draftSelection = () => {
    if (!import.meta.env.DEV) return getAudioSelection();
    const payload = {
      music: { version: $('#ag-music-version', sc)?.value || selection.music.version, overrides: {} },
      sfx: { version: $('#ag-sfx-version', sc)?.value || selection.sfx.version, overrides: {} },
    };
    $$('.ag-source', sc).forEach((select) => {
      if (select.value) payload[select.dataset.sourceKind].overrides[select.dataset.sourceId] = select.value;
    });
    return payload;
  };
  const previewButton = '<button type="button" class="ag-preview" data-a="preview" aria-label="Preview">▶</button>';
  const sfxGroups = {};
  for (const row of SFX_CATALOG) (sfxGroups[row.group] ||= []).push(row);
  const sfxHtml = Object.entries(sfxGroups).map(([group, rows]) => `
    <h3 class="ag-sub">${escHtml(group)}</h3>
    <div class="ag-list">${rows.map((row) => `
      <div class="ag-row" data-kind="sfx" data-id="${escHtml(row.id)}"
        ${row.play === 'attack' ? `data-attack-who="${escHtml(row.attack.who)}" data-attack-amount="${row.attack.amount}"` : ''}>
        ${previewButton}
        <span class="ag-id">${escHtml(row.id)}</span>
        <span class="ag-use">${escHtml(row.use)}</span>
        <span class="ag-badge ${row.note ? '' : 'ag-badge-empty'}">${row.note ? escHtml(row.note) : ''}</span>
        ${sourceControl('sfx', row.id)}
      </div>`).join('')}</div>`).join('');
  const musicHtml = `<div class="ag-list">${MUSIC_CATALOG.map((row) => `
    <div class="ag-row ${row.wired ? '' : 'ag-unwired'}" data-kind="music" data-id="${escHtml(row.id)}">
      ${previewButton}
      <span class="ag-id">${escHtml(row.id)}</span>
      <span class="ag-title">${escHtml(row.title)}</span>
      <span class="ag-use">${escHtml(row.use)}</span>
      <span class="ag-badge">${row.wired ? 'wired' : 'unwired'}</span>
      ${sourceControl('music', row.id)}
    </div>`).join('')}</div>`;
  const versionSelect = (kind, label) => `<label>${label}
    <select id="ag-${kind}-version">${getAudioVersions(kind, { completeOnly: true }).map((version) => `
      <option value="${escHtml(version)}" ${version === selection[kind].version ? 'selected' : ''}>${escHtml(version)}</option>`).join('')}
    </select>
  </label>`;
  const diagnostics = selectionProblems.length
    ? `<div class="ag-config-errors">Using base packs: ${selectionProblems.map(escHtml).join(' · ')}</div>`
    : '';
  const editorHtml = import.meta.env.DEV ? `
    <section class="ag-editor" aria-label="Audio backend selection">
      <div><b>Runtime audio selection</b><span>Whole-pack versions must be complete. Individual overrides may use any installed <code>&lt;version&gt;/&lt;file&gt;</code>.</span></div>
      <div class="ag-editor-controls">
        ${versionSelect('music', 'Music version')}
        ${versionSelect('sfx', 'SFX version')}
        <button type="button" data-a="clear-overrides">Clear overrides</button>
        <button type="button" class="ag-save" data-a="save-audio">Save</button>
        <span id="ag-save-status" role="status"></span>
      </div>
      <p>Changing a row chooses that exact file for gameplay. ▶ previews the current row choice, including unsaved overrides. The current root assets remain the base versions.</p>
      ${diagnostics}
    </section>` : `
    <p class="ag-note">Active packs: Music <code>${escHtml(selection.music.version)}</code> · SFX <code>${escHtml(selection.sfx.version)}</code>. Production is read-only; the host supplies <code>audio-selection.json</code>.</p>
    ${diagnostics}`;
  sc.innerHTML = `<div class="g-toolbar">
    <div><b>Audio gallery</b> · use ▶ to preview · <a href="?">back to game</a> · <a href="?gallery=1">art gallery</a></div>
    <nav>
      <a href="#ag-sfx">SFX</a>
      <a href="#ag-music">Music</a>
      <button type="button" class="ag-stop" data-a="stop">Stop music</button>
    </nav>
  </div>
  ${editorHtml}
  <p class="ag-note">SFX are one-shots. Music loops until you pick another cue or Stop. Every Music Cue is wired into live screens after Emberglass Phase 2.</p>
  <h2 class="g-head" id="ag-sfx">SFX — ${SFX_CATALOG.length}</h2>
  ${sfxHtml}
  <h2 class="g-head" id="ag-music">Music — ${MUSIC_CATALOG.length}</h2>
  ${musicHtml}`;
  sc.onclick = async (e) => {
    const stop = e.target.closest('[data-a="stop"]');
    if (stop) { music.stop(); return; }
    if (import.meta.env.DEV) {
      const clear = e.target.closest('[data-a="clear-overrides"]');
      if (clear) {
        $$('.ag-source', sc).forEach((select) => { select.value = ''; });
        $('#ag-save-status', sc).textContent = 'Overrides cleared locally — Save to persist.';
        return;
      }
      const save = e.target.closest('[data-a="save-audio"]');
      if (save) {
        const status = $('#ag-save-status', sc);
        const payload = {
          music: { version: $('#ag-music-version', sc).value, overrides: {} },
          sfx: { version: $('#ag-sfx-version', sc).value, overrides: {} },
        };
        $$('.ag-source', sc).forEach((select) => {
          if (select.value) payload[select.dataset.sourceKind].overrides[select.dataset.sourceId] = select.value;
        });
        save.disabled = true;
        status.textContent = 'Saving…';
        try {
          const response = await fetch('/__audio-save', {
            method: 'POST',
            headers: { 'content-type': 'application/json' },
            body: JSON.stringify(payload),
          });
          const result = await response.json();
          if (!response.ok || !result.ok) throw new Error((result.problems ?? [`HTTP ${response.status}`]).join(' · '));
          applyAudioSelection(payload);
          invalidateSfxSelection();
          music.invalidateMusicSelection();
          preloadSfx();
          const hash = location.hash;
          renderAudioGallery();
          if (hash) location.hash = hash;
          const nextStatus = $('#ag-save-status');
          if (nextStatus) nextStatus.textContent = 'Saved ✓';
        } catch (error) {
          save.disabled = false;
          status.textContent = `Save failed: ${String(error?.message ?? error)}`;
        }
        return;
      }
    }
    const preview = e.target.closest('[data-a="preview"]');
    const row = preview?.closest('.ag-row');
    if (!row) return;
    unlock();
    const id = row.dataset.id;
    const draft = draftSelection();
    if (row.dataset.kind === 'sfx') {
      music.stop();
      previewSfx(id, draft);
      return;
    }
    music.preview(id, draft);
  };
}

  return Object.freeze({ renderAudioGallery });
}
