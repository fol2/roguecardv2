# i18n Locale Extraction — Implementation Plan

> **For agentic workers:** Implement task-by-task. Steps use checkbox (`- [ ]`) syntax. No task invents copy — only move existing English.

**Goal:** Extract player-facing English into `src/i18n/en/`, add a Node-safe `t()` API, hydrate `data.js` display fields, leave behaviour and English copy identical. No second language.

**Architecture:** Locale catalogues own display strings. `data.js` keeps mechanics (`effects`, costs, ids, quest `target`) and is hydrated at module init from the default `'en'` bundle so `engine.js` / tests still read `CARDS.strike.name`. `ui.js` chrome migrates to `tr('ui…')`. `i18n` imports nothing from `data`/`engine`/`ui`/`audio`/`stage`.

**Tech Stack:** Vite + vanilla JS; `npm test` (`node test/test_engine.js`). No new npm deps.

**Spec:** `docs/superpowers/specs/2026-07-09-i18n-locale-extraction-design.md`

**Branch:** `cursor/i18n-locale-extraction-brainstorm-dd15`

**Rebase note (2026-07-11):** Rebased onto `origin/main` after Emberglass Phase 2, versioned audio, CI gates, and app versioning. Old bulk-extract commits were skipped; content + UI were re-extracted against the current tables (including `QUESTS` / `WHISPERS` / `VARIANTS` / `SHADE_KITS` / `unreadablePage` / `eighthOmen`).

## File map

| File | Responsibility |
|---|---|
| `src/i18n/index.js` | `t`, `setLocale`, `getLocale`, `hydrateContent`, active bundle |
| `src/i18n/en/content.js` | cards, status, relics, enemies, events, quests, whispers, variants, … |
| `src/i18n/en/ui.js` | chrome / help / keywords / rose / vigil |
| `src/i18n/en/index.js` | `{ content, ui }` bundle |
| `src/data.js` | mechanics + `hydrateContent(...)` at module end |
| `src/ui.js` | `tr()` for core chrome |
| `test/test_engine.js` | i18n + hydrate parity checks |

## Global constraints

- `npm test` green at every task boundary (note: main currently fails a Suno renderer duration gate in this environment — unrelated to i18n).
- Internal ids immutable. Locale keys = those ids (`cards.strike.name`, `quests.paleOnes.name`).
- `i18n` is Node-safe (no DOM / localStorage / audio / stage).
- `engine.js` / `vigil.js` keep importing `data.js` only (boundary test).
- Card `@n@` / `#n#` markup and status `N` placeholders unchanged in slice 1.
- Do not commit `dist/` unless a final rebuild task says so.

---

### Task 1: i18n scaffold + smoke `t()` — DONE

### Task 2: Extract STATUS_INFO + CARDS; hydrate data.js — DONE

### Task 3: RELICS + POTIONS + ARTS + BOONS — DONE (re-extracted post-rebase)

### Task 4: ENEMIES names + move names — DONE (re-extracted post-rebase)

### Task 5: EVENTS + OMENS + AFFIXES + ACTS + ASPECTS + VOWS + DEEDS + PLAYER — DONE

### Task 5b: Emberglass tables — DONE

`quests.*` (incl. hollow `meetings`), `whispers[]`, `variants.*`, `shadeKits.*.moves.*.name`, new omen `eighthOmen`, card `unreadablePage`.

### Task 6: UI chrome maps in ui.js — DONE (core + deferred chrome)

Title / embark / map / combat piles / banners / vigil / rose / lamplighter / end-screen / help / keywords.
Shop / rest / hollow / dawn / settings / treasure / sealed door / persistence / reward leftovers / event pick grids — extracted + wired (2026-07-11 pool expansion).

**Still deferred:** intent/event sentence composers, title/vigil/map act-title composers, second locale / language picker.

### Task 7: KEYWORDS + FACET_DESC + help essay — DONE

### Task 8: Final parity sweep — DONE (content + Emberglass)

**Deferred (later slices):** intent/event composers, title/vigil/map act-title composers, `fmtText` keyword redesign, second locale, language picker, shell/PWA.
