# Spirebound — Multi-language (i18n) locale extraction (design / brainstorm)

**Date:** 2026-07-09 (rebased / re-assessed 2026-07-11)
**Goal:** Make every player-facing string loadable from a locale catalogue so the
game can later swap languages — **without shipping any non-English translation
in this pass**. First slice = extract English into locale files + a tiny
lookup API; behaviour and copy stay identical.
**Executor:** a lower-grade agentic LLM. Every workstream must be broken into
mechanical, individually-verifiable tasks in the implementation plan; nothing
may rely on executor taste or judgement.
**Predecessors:** inherits engine purity, Node-runnable `data.js` / `engine.js` /
`vigil.js`, fixed stage, and save-id immutability from
`2026-07-06-visualisation-hardening-polish-design.md` and
`2026-07-09-entrance-progressive-delivery-design.md`. Localisation was
explicitly **out of scope** there; this spec opens that workstream at the
smallest useful cut.
**Rebase (2026-07-11):** re-extracted against Emberglass Phase 2 content
(`QUESTS`, `WHISPERS`, `VARIANTS`, `SHADE_KITS`, `unreadablePage`, `eighthOmen`)
plus app-versioning / audio / CI surfaces on `main`.

## Decisions record (owner-facing — locked for slice 1)

| Question | Decision |
|---|---|
| Scope of this pass | **English extraction + plumbing only.** No second language, no language picker UI, no RTL, no font packing |
| What "ready for other languages" means | A second locale is adding a parallel catalogue under `src/i18n/<locale>/` and calling `setLocale(code)` — not rewriting call sites again |
| Where strings live today | Content in `src/data.js` (incl. Emberglass `QUESTS`/`WHISPERS`/`VARIANTS`/`SHADE_KITS`) + chrome in `src/ui.js`; shell in `index.html` + `manifest.webmanifest` |
| Internal ids | **Immutable.** `strike`, `poison`, `vulnerable`, rarity keys, move keys stay English machine ids forever (saves + tests) |
| Display vs mechanics | Mechanics (`effects`, costs, `mods`, AI) stay in `data.js`. Display fields (`name`, `text`, `desc`, `blurb`, choice labels, …) move into the locale catalogue |
| File format | **ES modules exporting plain nested objects** (`src/i18n/en/*.js`). Not JSON (comments + co-location with JS tooling matter; Vite already eats ESM) |
| Lookup API | Tiny `t(key, params?)` + `setLocale` / `getLocale` in `src/i18n/index.js`. No i18n library dependency |
| How `data.js` stays usable | Content tables keep the **same field shape** (`name`, `text`, …) but values are filled from the active locale at module init via a hydrate helper — so `engine.js` / tests keep reading `CARDS.strike.name` unchanged |
| Engine purity | `engine.js` / `vigil.js` must **not** import UI. They may import `i18n` only if `i18n` stays Node-safe (no DOM, no `localStorage`, no `audio`/`stage`). Preferred: hydrate inside `data.js` so engine keeps importing `data.js` only |
| Default locale | `'en'`. Missing key → return the key string in dev-visible form (and never throw in production paths) |
| Markup in card text | Keep `@n@` / `#n#` tokens and English keyword words inside locale strings for slice 1. Do **not** redesign `fmtText` / keyword regex yet |
| Plural / ICU | Slice 1 uses simple `{param}` replacement only. No plural rules, no gender. Document composers that will need ICU later |
| Upgrade suffix | Keep `name + '+'` in `cardData()` for now (locale-neutral). Per-locale upgrade markers are a later concern |
| Shell / PWA | Out of slice 1 code path (static English). Catalogue may still list `meta.*` keys for a later pass |
| Tests | `npm test` must stay green with **identical** English assertions (`Edge+`, etc.). No locale switching in unit tests yet |

## Context (why this pass)

The game is English-only. Display names are already partly separated from
internal keys (the "native tongue" rename: `poison` → Smolder, `strike` → Edge),
but the English prose still lives **inside** content tables and is **hardcoded**
across `ui.js` screens. Adding a second language today would mean hunting
string literals. This pass builds the catalogue and the seam so translation
work can start from files, not from a 4k-line UI module.

Inventory (approximate):

| Bucket | Where | ~Unique phrases |
|---|---|---|
| Content tables | `src/data.js` | 350–400 |
| UI chrome + help | `src/ui.js` | 180–220 |
| Runtime composers | `src/ui.js` (`intentFor`, floats, event logs) | 40–50 templates |
| Shell | `index.html`, `manifest.webmanifest` | 6–8 |
| Engine prose | `src/engine.js` (1 fallback event line) | 1 |

Hard spots (deferred past slice 1, but the catalogue must not paint us into a corner):

1. `fmtText()` keyword highlighter is an English word list (`Cracked|Smolder|…`).
2. Card `text` duplicates numbers that also live in `effects` (only `@n@`/`#n#` are live).
3. Sentence builders (`Intends to…`, `Gained <b>…`) concatenate English grammar.
4. `.toUpperCase()` on act/omen/boss names.
5. Card `type` / `rarity` rendered as raw enum strings in places.

## Invariants (violating any fails review)

- Internal content ids never change. Locale keys are derived from those ids
  (`cards.strike.name`), not from English display words.
- `data.js`, `engine.js`, `vigil.js`, `battlefield*.js` stay Node-runnable:
  no DOM, no `audio.js`, no `stage.js`. The i18n module must be equally pure.
- `cardData()`, preview mirrors, and combat math stay behaviour-identical.
- `loadRun` validation still keys off content ids, not display names.
- `npm test` green at every task boundary; English assertion strings may stay
  until a later locale-aware test pass.
- No new npm dependencies for i18n.
- No player-visible language control in this pass.
- `dist/` rebuild only if an implementation plan task explicitly requires it
  (design-only PRs leave `dist/` alone).

## 1. Goal & scope

**In scope (slice 1 — "extract English, stay ready")**

| Workstream | Deliverable |
|---|---|
| Catalogue layout | `src/i18n/en/content.js` + `src/i18n/en/ui.js` (+ thin `en/index.js` merge) |
| Lookup API | `src/i18n/index.js`: `t`, `setLocale`, `getLocale`, `{param}` interpolate |
| Content hydrate | `data.js` display fields sourced from `en` catalogue; mechanics untouched |
| UI chrome extract | Hardcoded screen/button/map/combat labels in `ui.js` → `t('ui.…')` |
| Smoke readiness | Documented recipe: copy `en/` → `xx/`, translate values, `setLocale('xx')` |
| Tests | Unit check that `t('cards.strike.name') === 'Edge'` and hydrate parity |

**Out of scope**

- Any non-English translation
- Language picker / settings persistence for locale
- RTL / CJK typography / font subsetting
- Redesigning `@n@` markup or keyword highlighting
- ICU plural/gender
- Rewriting intent/event sentence composers (catalogue keys may be stubbed)
- `src/dev/*`, gallery labels, Playwright baseline text churn (unless a task breaks them)
- Changing lore voice or renaming display terms

**Success criteria**

- Game plays and reads exactly as today in English.
- A greppable catalogue holds the extracted English; adding `src/i18n/zh-Hant/`
  (example) would not require touching card/relic tables again.
- `npm test` green; no new dependency.

## 2. Options considered

### A. Keep strings in `data.js`; add parallel overlays later

Pros: zero risk now. Cons: does not meet "extract to a text file" or prepare
call sites; second language still rewrites `data.js`.

**Rejected** for this goal.

### B. Strip display fields from `data.js`; every read goes through `t()`

Pros: purest separation. Cons: invasive — `engine.js` `cardData()`, enemy
move names on the queue, and many tests would change in one bang; higher
regression surface.

**Rejected for slice 1** (good end-state; too wide for the first cut).

### C. Hydrate `data.js` from locale modules (recommended)

- Locale files own the English strings.
- At `data.js` load, a pure `hydrateContent(locale.content)` copies
  `name` / `text` / … onto the mechanic tables (or builds the exported tables
  with both halves).
- `ui.js` chrome uses `t('ui…')` directly.
- `engine.js` keeps importing `data.js` only; still sees `.name` / `.text`.

Pros: matches "extract to files", keeps engine/tests stable, second locale =
swap catalogue + re-hydrate (or hydrate on `setLocale`). Cons: two-step mental
model (catalogue + hydrated tables). Acceptable.

**Chosen.**

### D. JSON / CSV for translators

Useful later for external translators. Slice 1 stays ESM so authors keep
comments and the existing JS review flow. A JSON export script can be a
follow-up tool, not a runtime format.

## 3. Catalogue shape

```
src/i18n/
  index.js              # t(), setLocale(), getLocale(), active bundle
  en/
    index.js            # export default { ...content, ...ui } or { content, ui }
    content.js          # cards, relics, statuses, enemies, events, …
    ui.js               # title, map, combat chrome, help, keywords, …
```

### Key conventions

- Dot paths, stable ids: `cards.strike.name`, `cards.strike.text`,
  `cards.strike.textUp` (upgrade text; maps from today's `up.text`).
- Status: `status.poison.name`, `status.poison.desc` — use `{n}` in desc
  instead of bare `N` when touching a string (migrate on extract).
- Enemies: `enemies.sporeling.name`, `enemies.sporeling.moves.bite.name`.
- Events: `events.forgottenShrine.name`, `.text`,
  `.choices.0.label`, `.choices.0.sub`, `.rolls.<id>.text` as needed.
- Parallel tables: `relics.*`, `potions.*`, `omens.*`, `affixes.*`,
  `arts.*`, `boons.*`, `deeds.*`, `vows.*`, `acts.0.name`, `aspects.duskblade.*`.
- UI: `ui.title.tagline`, `ui.combat.endTurn`, `ui.map.node.monster`,
  `ui.help.sections.climb.title`, …
- Enums (extract early, small): `ui.cardType.attack`, `ui.rarity.common`.

### `t()` contract (slice 1)

```js
t('cards.strike.name')                    // → 'Edge'
t('ui.map.actTitle', { act: 1, name, boss }) // → 'ACT 1 — …'
```

- Params: `{name}` → string replace only.
- Unknown key: return key (optionally `console.warn` once in dev).
- `setLocale('en')` is a no-op today; later loads another bundle and
  re-hydrates content tables **before** the next screen render.

### Content module pattern (illustrative)

```js
// src/i18n/en/content.js
export const cards = {
  strike: {
    name: 'Edge',
    text: 'Deal @6@ damage.',
    textUp: 'Deal @9@ damage.',
  },
  // …
};

export const status = {
  poison: {
    name: 'Smolder',
    desc: 'Burns from within: loses {n} HP at the start of its turn, …',
  },
};
```

```js
// data.js (mechanic half stays; display filled from locale)
strike: {
  type: 'attack', rarity: 'starter', cost: 1, target: 'enemy',
  vfx: 'slash',
  effects: [{ kind: 'dmg', n: 6 }],
  up: { effects: [{ kind: 'dmg', n: 9 }] },
},
// after hydrate: CARDS.strike.name / .text / .up.text present again
```

Hydrate must run once at module init for the default locale so Node tests that
`import { CARDS } from '../src/data.js'` see English immediately.

## 4. Extraction order (minimal → wider)

Do **not** boil the ocean in one PR. Recommended task order for the plan:

| Step | Extract | Why first |
|---|---|---|
| 1 | i18n API + empty/`en` scaffold + one smoke key | Proves Node-safe import graph |
| 2 | `STATUS_INFO` + `CARDS` names/texts | Highest player reading time; tests already anchor `Edge+` |
| 3 | `RELICS`, `POTIONS`, `ARTS`, `BOONS` | Same table shape |
| 4 | `ENEMIES` names + move names | Intent tooltips |
| 5 | `EVENTS` + omens/affixes/acts/aspects/vows/deeds | Narrative surfaces |
| 6 | `ui.js` chrome maps (title, map nodes, combat piles, buttons) | Unblocks language-ready menus |
| 7 | `KEYWORDS` / `FACET_DESC` / help essay | Large but isolated |
| 8 | Stub keys for composers (`ui.intent.*`) without switching call sites yet | Documents the seam |

Each step leaves the game English-identical and `npm test` green.

## 5. Explicit non-goals / later slices

| Later slice | Notes |
|---|---|
| Slice 2 — composers | Replace `intentFor` / event log concat with `t('ui.intent.attack', …)` |
| Slice 3 — `fmtText` | Locale-aware keyword maps; highlight by token ids not English words |
| Slice 4 — second locale | e.g. `zh-Hant` or `zh-HK`; font + stage overflow QA |
| Slice 5 — picker | Title/Vigil control + `localStorage` locale key |
| Slice 6 — shell | Per-locale `index.html` title / manifest injection |

## 6. Risks & mitigations

| Risk | Mitigation |
|---|---|
| Hydrate drift (locale missing a new card field) | Unit test: every `CARDS`/`RELICS`/… id has required locale keys |
| Accidental id rename while extracting | Keys must equal existing object keys; review diffs as move-only |
| `ui.js` half-migrated (some `t()`, some literals) | Allowed mid-plan; finish chrome maps before claiming slice 1 done |
| Bundle size | ESM objects tree-shake poorly if merged wrong — keep one active locale imported; lazy `import()` for future locales is fine |
| HMR / save validation | Still validates ids; display-only edits must not touch ids |

## 7. Testing plan (slice 1)

- Extend `test/test_engine.js` (or a tiny `test/test_i18n.js` imported from it —
  prefer extending the single self-check script per AGENTS.md) with:
  - `t('cards.strike.name') === 'Edge'`
  - `cardData({ id: 'strike', up: true }).name === 'Edge+'`
  - Parity: every card id has `name` + `text` after hydrate
- No Playwright baseline updates expected if copy is byte-identical.
- Manual smoke: title → embark → one fight → reward — eyes only for typos.

## 8. Open questions for owner (defaults if unanswered)

| # | Question | Default if silent |
|---|---|---|
| 1 | First *real* target language after English? (affects font/QA priority, not slice 1 code) | Document as unknown; keep API locale-code agnostic |
| 2 | Prefer nested objects vs flat key files for translator handoff? | Nested ESM now; optional JSON export tool later |
| 3 | Should slice 1 already extract the full help essay? | Yes, into `ui.help.*`, because it is the largest single chrome blob |
| 4 | Re-hydrate on `setLocale` in slice 1, or only default-locale init? | Default-locale init only; `setLocale` swaps the `t()` bundle and is tested with a tiny fixture locale in unit tests |

## 9. Suggested implementation plan shape (next doc)

A follow-up `docs/superpowers/plans/2026-07-09-i18n-locale-extraction.md`
should break §4 into mechanical tasks (one PR-able chunk each): scaffold →
statuses/cards → relics/potions → enemies → events/meta → ui chrome →
keywords/help → parity tests. No task may require inventing copy; only move
existing English.

## 10. Success sketch — "ready for another language"

After slice 1, adding a language is:

1. `cp -r src/i18n/en src/i18n/<code>`
2. Translate values (not keys).
3. Register the bundle in `src/i18n/index.js`.
4. Call `setLocale('<code>')` before UI boot (wiring the control is slice 5).
5. Play through and fix overflow / keyword map (slice 3–4).

No further surgery to `CARDS` mechanic rows.
