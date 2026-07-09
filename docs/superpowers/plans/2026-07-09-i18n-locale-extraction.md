# i18n Locale Extraction — Implementation Plan

> **For agentic workers:** Implement task-by-task. Steps use checkbox (`- [ ]`) syntax. No task invents copy — only move existing English.

**Goal:** Extract player-facing English into `src/i18n/en/`, add a Node-safe `t()` API, hydrate `data.js` display fields, leave behaviour and English copy identical. No second language.

**Architecture:** Locale catalogues own display strings. `data.js` keeps mechanics (`effects`, costs, ids) and is hydrated at module init from the default `'en'` bundle so `engine.js` / tests still read `CARDS.strike.name`. `ui.js` chrome migrates to `t('ui…')` in later tasks. `i18n` imports nothing from `data`/`engine`/`ui`/`audio`/`stage`.

**Tech Stack:** Vite + vanilla JS; `npm test` (`node test/test_engine.js`). No new npm deps.

**Spec:** `docs/superpowers/specs/2026-07-09-i18n-locale-extraction-design.md`

**Branch:** `cursor/i18n-locale-extraction-brainstorm-dd15`

## File map

| File | Responsibility |
|---|---|
| `src/i18n/index.js` | `t`, `setLocale`, `getLocale`, `hydrateContent`, active bundle |
| `src/i18n/en/content.js` | cards, status, (later) relics, enemies, events, … |
| `src/i18n/en/ui.js` | chrome / help / keywords (later tasks) |
| `src/i18n/en/index.js` | `{ content, ui }` bundle |
| `src/data.js` | mechanics + call `hydrateContent` at end of module |
| `src/ui.js` | later: `t('ui…')` for chrome |
| `test/test_engine.js` | i18n + hydrate parity checks |

## Global constraints

- `npm test` green at every task boundary.
- Internal ids immutable. Locale keys = those ids (`cards.strike.name`).
- `i18n` is Node-safe (no DOM / localStorage / audio / stage).
- `engine.js` / `vigil.js` keep importing `data.js` only (not `i18n` directly).
- Status `desc` keeps `N` placeholder in slice 1 (ui.js `\bN\b` replace unchanged).
- Card `@n@` / `#n#` markup unchanged.
- Do not commit `dist/` unless a final rebuild task says so.
- Commit after every task; never `--no-verify`, never amend.

---

### Task 1: i18n scaffold + smoke `t()`

**Files:**
- Create: `src/i18n/index.js`, `src/i18n/en/index.js`, `src/i18n/en/content.js`, `src/i18n/en/ui.js`
- Test: `test/test_engine.js`

- [ ] **Step 1: Write failing test**

Import `{ t, getLocale, setLocale }` from `../src/i18n/index.js`. Assert:

```js
{
  assert.equal(getLocale(), 'en');
  assert.equal(t('cards.strike.name'), 'Edge');
  assert.equal(t('missing.key.zzz'), 'missing.key.zzz');
  assert.equal(t('ui.smoke.hello', { name: 'Spire' }), 'Hello, Spire');
}
```

(Smoke ui key lives in `en/ui.js` temporarily; cards key lands in Task 2 — for Task 1 put a stub `cards: { strike: { name: 'Edge' } }` in `en/content.js`.)

- [ ] **Step 2: Run test — expect FAIL** (module missing)

- [ ] **Step 3: Implement API**

`t(key, params?)`: walk dot path in active bundle (flatten `content` + `ui` under one lookup, or support `cards.*` from `bundle.content` and `ui.*` from `bundle.ui`). `{param}` replace. Missing → return key.

`setLocale(code)`: swap bundle if registered; default only `'en'`. Fixture locale optional for tests.

- [ ] **Step 4: `npm test` green**

- [ ] **Step 5: Commit** — `Add i18n scaffold with t() and en bundle.`

---

### Task 2: Extract STATUS_INFO + CARDS; hydrate data.js

**Files:**
- Modify: `src/i18n/en/content.js`, `src/data.js`
- Test: `test/test_engine.js`

- [ ] **Step 1: Parity test**

```js
{
  for (const id of Object.keys(CARDS)) {
    assert.ok(CARDS[id].name, `card ${id} has name`);
    assert.ok(typeof CARDS[id].text === 'string', `card ${id} has text`);
  }
  for (const id of Object.keys(STATUS_INFO)) {
    assert.ok(STATUS_INFO[id].name, `status ${id} has name`);
    assert.ok(STATUS_INFO[id].desc, `status ${id} has desc`);
  }
  assert.equal(t('cards.strike.name'), 'Edge');
  assert.equal(t('status.poison.name'), 'Smolder');
  assert.equal(cardData(makeCard(newRun(2), 'strike', true)).name, 'Edge+');
}
```

- [ ] **Step 2: Move all card `name`/`text`/`up.text` → `content.cards[id]` as `name`/`text`/`textUp`**

- [ ] **Step 3: Move STATUS_INFO `name`/`desc` → `content.status[id]`** (keep `icon`/`kind` in data.js)

- [ ] **Step 4: Strip those fields from data.js; call `hydrateContent({ CARDS, STATUS_INFO }, content)` at module end (before or after CARD_POOLS — pools don't need display fields)**

- [ ] **Step 5: `npm test` green**

- [ ] **Step 6: Commit** — `Hydrate card and status display strings from en locale.`

---

### Task 3: RELICS + POTIONS + ARTS + BOONS

Same pattern: locale keys `relics.*`, `potions.*`, `arts.*`, `boons.*` with `name`/`text`. Hydrate. Parity loop. Commit.

---

### Task 4: ENEMIES names + move names

`enemies.{id}.name`, `enemies.{id}.moves.{moveKey}.name`. Hydrate onto `ENEMIES`. Parity. Commit.

---

### Task 5: EVENTS + OMENS + AFFIXES + ACTS + ASPECTS + VOWS + DEEDS + PLAYER blurb

Narrative tables. Event choices: `choices.{i}.label` / `.sub`. Commit.

---

### Task 6: UI chrome maps in ui.js

Title / embark / map node labels / combat piles / end-turn / common buttons → `en/ui.js` + `t()`. Byte-identical English. Commit.

---

### Task 7: KEYWORDS + FACET_DESC + help essay

Move into `en/ui.js`. `fmtText` still uses English word list (slice 3 later). Commit.

---

### Task 8: Final parity sweep

- Every content id has required locale keys (fail test if missing).
- Document "add a language" recipe in spec §10 still accurate.
- `npm test` green. Update `docs/README.md` plan row if needed.
- Commit: `Finish i18n slice-1 extraction parity sweep.`

**Out of this plan:** composers, fmtText redesign, second locale, picker, shell/PWA, `dist/` rebuild.
