// Offscreen aria-live combat announcer. Combat moved DOM->Pixi, leaving the
// accessibility tree empty; this rides the SAME cb.queue event stream that
// drain.js plays back (drain forwards each raw engine event here) and turns the
// meaningful beats into polite screen-reader announcements.
//
// Golden rule: no game logic. This only reads events + content views to phrase
// what already happened. Fully dependency-injected (no top-level DOM) so it is
// Node-testable exactly like createDrain.

const SR_ONLY = 'position:absolute;width:1px;height:1px;margin:-1px;border:0;'
  + 'padding:0;overflow:hidden;clip:rect(0 0 0 0);clip-path:inset(50%);white-space:nowrap;';

// English-baseline phrasing (matches the codebase's existing a11y precedent,
// e.g. the "Restoring visuals" toast); localising these connectives is a
// documented follow-up. Content names inside them are already localised.
export function createA11yLog({ document, S, contentViewFor }) {
  const runCatalogues = () => contentViewFor(S.run);
  const cardName = (id) => runCatalogues()?.cards?.[id]?.name || id;
  const statusName = (id) => runCatalogues()?.statuses?.[id]?.name || id;
  const enemyName = (idx) => S.cb?.enemies?.[idx]?.name || 'Enemy';
  // `who` is 'player' or an enemy index; verb agreement differs for "You".
  const whoName = (who) => (who === 'player' ? 'You' : enemyName(who));
  const verb = (who, base) => (who === 'player' ? base : `${base}s`);

  let region = null;
  let lastMsg = '';
  let nudge = false;
  function ensureRegion() {
    if (region || typeof document === 'undefined') return region;
    region = document.createElement('div');
    region.id = 'combat-a11y-log';
    region.setAttribute('role', 'log');
    region.setAttribute('aria-live', 'polite');
    region.setAttribute('aria-atomic', 'true');
    region.style.cssText = SR_ONLY;
    (document.body || document.documentElement)?.appendChild(region);
    return region;
  }

  function announce(msg) {
    if (!msg) return;
    const node = ensureRegion();
    if (!node) return;
    // A polite region ignores a repeated identical value; toggle a trailing
    // space so consecutive writes always differ (repeated multi-hit lines etc).
    nudge = msg === lastMsg ? !nudge : false;
    node.textContent = nudge ? `${msg} ` : msg;
    lastMsg = msg;
  }

  /** Turn-start / reshuffle draws: one summary line instead of per-card spam. */
  function drew(ids) {
    if (!ids || !ids.length) return;
    const names = ids.map(cardName).join(', ');
    announce(`Drew ${ids.length === 1 ? names : `${ids.length} cards: ${names}`}.`);
  }

  /** Phrase a single raw engine event. Unmeaningful types announce nothing. */
  function phrase(ev) {
    switch (ev.t) {
      case 'play': return `Played ${cardName(ev.id)}.`;
      case 'hitEnemy':
        if (ev.amount > 0) {
          return `${enemyName(ev.idx)} takes ${ev.amount}${ev.poison ? ' Smolder' : ''} damage.`;
        }
        return ev.blocked > 0 ? `${enemyName(ev.idx)} blocks the hit.` : null;
      case 'hitPlayer':
        if (ev.amount > 0) return `You take ${ev.amount}${ev.source === 'poison' ? ' Smolder' : ''} damage.`;
        return ev.blocked > 0 ? 'You block the hit.' : null;
      case 'blockGain': return `${whoName(ev.who)} ${verb(ev.who, 'gain')} ${ev.n} Ward.`;
      case 'heal': return `${whoName(ev.who)} ${verb(ev.who, 'heal')} ${ev.n}.`;
      case 'status': return `${whoName(ev.who)}: ${ev.n > 0 ? '+' : ''}${ev.n} ${statusName(ev.id)}.`;
      case 'enemyAct': return `${enemyName(ev.idx)}: ${ev.name}.`;
      case 'die': return `${enemyName(ev.idx)} shatters.`;
      case 'turn': return 'Your turn.';
      case 'endTurn': return 'Enemy turn.';
      case 'victory': return ev.perfect ? 'Flawless victory.' : 'Victory.';
      case 'defeat': return 'Defeat.';
      default: return null;
    }
  }

  /** Never let an announcement failure break queue playback. */
  function note(ev) {
    try {
      const msg = phrase(ev);
      if (msg) announce(msg);
    } catch { /* a11y is best-effort; playback must not stall */ }
  }

  return Object.freeze({ note, drew, announce, regionEl: () => region });
}
