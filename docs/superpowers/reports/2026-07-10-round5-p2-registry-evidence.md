# Round 5 P2 registry equivalence evidence

Date: 12 July 2026  
Branch: `jamesto/round5-production-engineering-continuation`  
Worktree: `.worktrees/round5-production-engineering-continuation`  
Base tip (Task 14 docs checkpoint): `04f73f7a5a6f7aea40d4191ad094575cb408f36f`  
Implementation commit: **none** (Task 15 left uncommitted for independent review)

## Status

P2 content-table freeze remains **ACTIVE** until ordered reviewer cycles pass and
the closing SHA is appended to the execution ledger. This report records the
Task 15 implementation evidence that closes the registry equivalence gate on
the working tree.

## Commit range

```text
1eb0477a..04f73f7a   P1 close → Task 14 checkpoint (committed history)
04f73f7a + working tree   Task 15 aggregate doctor, probe, theme-profile, docs
```

## Commands

| Command | Result |
| --- | --- |
| `npm test` | pass — `unit checks passed; monte-carlo: 300 runs, …` including printed `formatContentReport` |
| `npm run test:content-registrations` | pass — production/development manifests fresh |
| `npm run test:act-coupling` | pass — 14 findings, all allowlisted |
| `node tools/run-with-strict-e2e-port.mjs -- npx playwright test theme-profile --project=desktop --project=portrait --project=landscape --workers=1 --no-deps` | **3 passed** |
| `node tools/run-with-strict-e2e-port.mjs -- npx playwright test theme-profile geometry stage audio --project=desktop --project=portrait --project=landscape --workers=1` | **100 passed / 84 skipped** |

Standing / GitHub CI: **not run** in this dispatch (controller cadence).

## Export inventory (exact 32)

```text
PLAYER, ACTS, CARDS, CARD_POOLS, STATUS_INFO, RELICS, RELIC_POOLS, POTIONS,
ENEMIES, ENCOUNTERS, EVENTS, REWARD_GOLD, SHOP, OMENS, AFFIXES, ARTS, DEEDS,
PROGRESSION, REVEALS, POOL_GATE, QUEST_IDS, WHISPERS, QUESTS, SHADE_KITS,
VARIANTS, ASPECTS, VOWS, BOONS,
QUEST_STATES, QUEST_ACTIVE_STATES, TERMINAL_OUTCOMES, RUN_ID_RE
```

28 content views + 4 protocol constants. Protocol values stay outside every
pack/context domain.

## Doctor (production registration + filesystem assetManifest)

```text
content: ok (0 errors, 0 warnings)
player: 1/1 complete … progression: 1/1 complete
```

Every domain `complete === total`. Locale badges complete (or not-applicable).
Pool badges complete via rarity pool membership or schema-level no-pool
(starter/special/locked). `CHAR_META` ids injected with documented
default-fallback policy. Physical `assetManifest` is doctor/test-only;
`CORE_CONTENT` compiles with `STATIC_REFERENCE_CATALOGUES` only.

Doctor call shape (spec-compliance fix):
`doctorContentRegistrations(MANIFEST, { resources: { ...STATIC_REFERENCE_CATALOGUES, ...resourceManifest }, localeToken: 'en' })`
so filesystem keys land under `resources.assetManifest`. Theme plate bare ids
resolve as `stage/${id}` against that manifest; art badges for plated themes
are `complete`. Negative: drop `stage/${backdrop}` → `asset-missing` at
`themes.act1.plates.backdrop`; `createContentContext` without inventory still boots.

Sample/dev doctor (`fixtures: ['sample']`) also reports ok with complete locale
badges for sample card/theme entries; sample locale retains the 18-domain shape.

## Generated manifests

| File | SHA-256 |
| --- | --- |
| `src/packs/compiled/production.js` | `5081305705f505ad1d89cccb07577f3f2c3d430e012c5d8ff4d92f19fc348196` |
| `src/packs/compiled/development.js` | `099e7ebc916fa0b68cb0a583f0090240424a2c63ab762680f03ad6bf261a92fb` |

Compiler `--check` green. Production excludes `_sample`; development includes it.
Task 15 aggregate re-runs the paired Act-4 filesystem drop/compile/restore
inside its own block (temp tree; protected content/i18n/engine **and**
`test:act-coupling` stdout hashes unchanged; production/development SHAs return
to baseline). Freeze remains **ACTIVE** (not RELEASED).

## Locale / i18n / Task 10 legs (reasserted in Task 15 aggregate)

- Default locale `en`; exact seven APIs; unknown `setLocale('zz')` → false/no-op.
- **Three-leg golden equality** reasserted in the Task 15 close (Task 12A shape):
  `captureLiveContentOracle()` vs `test/fixtures/round5-content-oracle-v1.json`
  for `contentExports`, `protocolExports`, `enemyAi`, `shadeAi`, `rawMechanics`,
  `i18n`, and `monteCarlo.sha256`. Command: `npm test` (aggregate block);
  result: pass (deep equality holds on the working tree).
- Live oracle also matches frozen Task 10 fixture: 18-domain catalogue ownership,
  `catalogueSha256`, raw-mechanics vs locale paths, provenance `sourceSha`
  `9c4f7e5624b1c7eae8eb6fd3e7c27ff5ec0df5f8`.
- Mechanics reject locale-owned fields (`locale-field-in-pack`); orphan locale
  rows report `orphan-locale-entry`.
- Module-init hydrated aliases (`ASPECTS[0] === PLAYER`) retained.
- Save keys unchanged: `spirebound_save_v2` / `spirebound_stats_v1` /
  `spirebound_vigil_v2` (no `spirebound_save_v3`).

## Freeze / isolation

- Core context deep-frozen; `descriptorInventory` reports **no accessors**.
- Hollow `target` is materialised numeric `5` (Phase 2 value).
- Simultaneous core + sample engine runs isolated; sample not in production.
- Task 12B high/low `_normaliseRunSnapshotForTest` projections reasserted in
  the aggregate (historical counters under lower tuning; high ceiling accepts
  configured guarantee/debt/Page; above-ceiling debt rejected).

## Music contract (PR #16 / Task 13) — aggregate cases

- Exactly five `music-resolve.js` exports.
- 22/22 live catalogue rows.
- Quest / Eighth / boss priority; Hollow → `hollowLamplighter`; Vigil/Rose live
  cues; Dawn `pageRead` → `unreadablePage`; summit `act4Reveal` → `sealedDoor`;
  reward/boss-relic no-request hold; non-`actN` fourth theme.
- Schema reference parity: `cards.vfx.reference === 'vfx-id'` and
  `themes.music.reference === 'music-id'`.
- No independent id enum in `registry.js` / UI content modules.
- Act-coupling allowlist residue: 14 rows; no numeric three-act cue clamp.

## HMR / reload policy

`src/data.js`, `src/registry.js`, `src/packs/core/**`, `src/i18n/en/**`, and
`src/packs/_sample/locale-en.js` contain no `import.meta.hot` accept handlers.
Pack or locale edits deliberately force Vite full-page reload.

## Browser theme journey

`__probe.stageCoreTheme({ themeId, seed })` stages each of `act1`/`act2`/`act3`
through real `newRun` + map regen + first normal encounter + real
`startCombatUI`. Desktop / portrait / landscape Chromium each visit all three
themes, verify plates resolve for the three production themes, weather, combat
Music Cue, one card play, End Turn, emulated stage shape, locale `en`, and
trace integrity.

WebKit phone/pad projects and the same `theme-profile` rerun are **deferred to
Task 20**.

## Freeze ledger

Do not append `P2 content-table freeze: RELEASED` until independent spec +
quality reviews pass and the Task 15 commits land. Until then the freeze stays
**ACTIVE**.
