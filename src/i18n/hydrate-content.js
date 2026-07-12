// Content-only locale hydration. Node-safe and independent of UI catalogues.

function applyStrings(row, loc) {
  if (!row || !loc) return;
  for (const [k, v] of Object.entries(loc)) {
    if (typeof v === 'string') row[k] = v;
    else if (Array.isArray(v)) row[k] = v.map((item) => (typeof item === 'string' ? item : { ...item }));
  }
}

/**
 * Copy display fields from locale content onto mechanic tables.
 */
export function hydrateContent(tables, content) {
  if (content.cards && tables.CARDS) {
    for (const [id, loc] of Object.entries(content.cards)) {
      const row = tables.CARDS[id];
      if (!row || !loc) continue;
      if (loc.name != null) row.name = loc.name;
      if (loc.text != null) row.text = loc.text;
      if (loc.textUp != null) {
        if (!row.up) row.up = {};
        row.up.text = loc.textUp;
      }
    }
  }

  for (const [key, tableKey] of [
    ['status', 'STATUS_INFO'],
    ['relics', 'RELICS'],
    ['potions', 'POTIONS'],
    ['arts', 'ARTS'],
    ['boons', 'BOONS'],
    ['omens', 'OMENS'],
    ['affixes', 'AFFIXES'],
    ['deeds', 'DEEDS'],
  ]) {
    if (content[key] && tables[tableKey]) {
      for (const [id, loc] of Object.entries(content[key])) {
        applyStrings(tables[tableKey][id], loc);
      }
    }
  }

  if (content.enemies && tables.ENEMIES) {
    for (const [id, loc] of Object.entries(content.enemies)) {
      const row = tables.ENEMIES[id];
      if (!row || !loc) continue;
      if (loc.name != null) row.name = loc.name;
      if (loc.moves && row.moves) {
        for (const [mk, mv] of Object.entries(loc.moves)) {
          if (row.moves[mk] && mv?.name != null) row.moves[mk].name = mv.name;
        }
      }
    }
  }

  if (content.events && tables.EVENTS) {
    for (const [id, loc] of Object.entries(content.events)) {
      const row = tables.EVENTS[id];
      if (!row || !loc) continue;
      if (loc.name != null) row.name = loc.name;
      if (loc.text != null) row.text = loc.text;
      if (loc.choices && row.choices) {
        for (const [i, ch] of Object.entries(loc.choices)) {
          const dest = row.choices[Number(i)];
          if (dest) applyStrings(dest, ch);
        }
      }
    }
  }

  if (content.acts && tables.ACTS) {
    for (const [i, loc] of Object.entries(content.acts)) applyStrings(tables.ACTS[Number(i)], loc);
  }
  if (content.vows && tables.VOWS) {
    for (const [i, loc] of Object.entries(content.vows)) applyStrings(tables.VOWS[Number(i)], loc);
  }
  if (content.aspects && tables.ASPECTS) {
    for (const a of tables.ASPECTS) applyStrings(a, content.aspects[a.id]);
  }
  if (content.aspects && tables.PLAYER) {
    applyStrings(tables.PLAYER, content.aspects[tables.PLAYER.id]);
  }

  if (content.quests && tables.QUESTS) {
    for (const [id, loc] of Object.entries(content.quests)) {
      const row = tables.QUESTS[id];
      if (!row || !loc) continue;
      for (const [k, v] of Object.entries(loc)) {
        if (typeof v === 'string') row[k] = v;
        else if (Array.isArray(v) && v.length && typeof v[0] === 'object') {
          // Prefer in-place fill so shared refs (e.g. HOLLOW_LAMPLIGHTER_MEETINGS) stay valid.
          if (Array.isArray(row[k])) {
            row[k].length = 0;
            for (const item of v) row[k].push({ ...item });
          } else {
            row[k] = v.map((item) => ({ ...item }));
          }
        } else if (Array.isArray(v)) {
          row[k] = v.slice();
        }
      }
    }
  }

  if (content.whispers && tables.WHISPERS) {
    // Replace array contents in place so existing imports keep the same reference.
    tables.WHISPERS.length = 0;
    for (const line of content.whispers) tables.WHISPERS.push(line);
  }

  if (content.variants && tables.VARIANTS) {
    for (const [id, loc] of Object.entries(content.variants)) {
      const row = tables.VARIANTS[id];
      if (!row || !loc) continue;
      if (loc.name != null) row.name = loc.name;
      if (typeof loc.deathDialogue === 'string') row.deathDialogue = loc.deathDialogue;
      // Engine always spreads dialogue — keep an array even when the locale has none.
      row.dialogue = Array.isArray(loc.dialogue) ? loc.dialogue.slice() : [];
    }
  }

  if (content.shadeKits && tables.SHADE_KITS) {
    for (const [id, loc] of Object.entries(content.shadeKits)) {
      const row = tables.SHADE_KITS[id];
      if (!row || !loc?.moves || !row.moves) continue;
      for (const [mk, mv] of Object.entries(loc.moves)) {
        if (row.moves[mk] && mv?.name != null) row.moves[mk].name = mv.name;
      }
    }
  }

  return tables;
}

