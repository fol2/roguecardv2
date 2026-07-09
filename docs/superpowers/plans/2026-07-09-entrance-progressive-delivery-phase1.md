# Entrances & Progressive Delivery — Phase 1 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship the progressive-delivery engine (`spirebound_vigil_v2`, reveal ladder, pool waves) and the redesigned entrances (clean title, Embark screen, Vigil full screen) — the Emberglass chain itself is Phase 2.

**Architecture:** All logic stays engine-side and Node-testable: `data.js` gains declarative `REVEALS` / `PROGRESSION` tables, `vigil.js` gains v2 storage + a pure evaluator, `engine.js` gates pools/omens/phials off a `run.reveals` snapshot (null = fully revealed, preserving every existing test), and `ui.js` splits the crammed title into title → Embark → Vigil screens. Task order keeps the app runnable at every commit: new screens land first, the title flips to them last.

**Tech Stack:** Vite + vanilla JS; `node test/test_engine.js` (`npm test`); Playwright visual-QA kit on port 5174.

**Spec:** `docs/superpowers/specs/2026-07-09-entrance-progressive-delivery-design.md`

**Branch:** `cursor/entrance-progressive-delivery-0e31` (already created).

## File map

| File | Responsibility |
|---|---|
| `src/data.js` | `REVEALS` reveal table, `PROGRESSION.poolWaves`, derived `POOL_GATE` |
| `src/vigil.js` | `spirebound_vigil_v2` storage, v1 migration, `isRevealed` / `revealSnapshot` / `commitRunEnd` / `clearNews` |
| `src/engine.js` | `run.reveals` snapshot + `runRevealed`, wave-gated pools, gated omens/phials, `loadRun` validation |
| `src/ui.js` | Clean `renderTitle`, new `renderEmbark` / `renderVigil` screens, run-end wiring, HUD/lamplighter gating |
| `src/styles.css` | `.btn.news` pulse, `.embark-screen`, `.vigil-tabs` |
| `test/test_engine.js` | Table shape, migration, ladder, pool-wave, gating tests |
| `test/e2e/stage.spec.js` | Title/Embark overflow scenario (vow stepper moved) |
| `test/e2e/visual.spec.js` + snapshots | Title baseline re-shot; new embark/vigil shots |
| `docs/README.md` | Index rows for the new spec + plan |

## Global constraints

- `npm test` green at every task boundary. `engine.js` / `vigil.js` / `data.js` never import DOM, `audio.js`, or `stage.js`.
- **Back-compat invariant:** `newRun(seed)` with no `reveals` opt behaves exactly as today (fully revealed). Monte-carlo and `test/e2e/helpers.js` `boot()` must pass unchanged.
- `spirebound_vigil_v1` is never written or deleted; v2 lives under `spirebound_vigil_v2`.
- Internal ids immutable. All tunables go in `data.js` tables, never inline in engine/ui.
- Pulse animation is transform/opacity only and skipped when `REDUCED`.
- Do not commit `test-results/` or `playwright-report/`. Commit `dist/` only in the final sweep task.
- Commit after every task with the message given; never `--no-verify`, never amend.

---

### Task 1: Reveal & progression tables in `data.js`

**Files:**
- Modify: `src/data.js` (append after `DEEDS`, ~line 1119)
- Test: `test/test_engine.js` (append a new block after the pools block, ~line 795)

**Interfaces:**
- Produces: `REVEALS` (array of `{ id, trigger }`), `PROGRESSION` (tunables), `POOL_GATE` (derived id → reveal-id map). Consumed by `vigil.js` (Task 3), `engine.js` (Task 4).

- [ ] **Step 1: Write the failing test**

In `test/test_engine.js`, extend the `../src/data.js` import with `REVEALS, PROGRESSION, POOL_GATE`, then add after the pools block (~line 795):

```js
{
  // progressive delivery tables are well-formed
  assert.ok(Array.isArray(REVEALS) && REVEALS.length >= 6, 'reveal table present');
  assert.equal(new Set(REVEALS.map((r) => r.id)).size, REVEALS.length, 'reveal ids unique');
  for (const r of REVEALS) {
    assert.ok(r.trigger && (r.trigger.runsPlayed != null || r.trigger.wins != null), `reveal ${r.id} has a counter trigger`);
  }
  for (const id of ['lamplighter', 'phials', 'omens', 'poolWave2', 'poolWave3', 'poolFull', 'emberglass']) {
    assert.ok(REVEALS.some((r) => r.id === id), `reveal ${id} declared`);
  }
  for (const [rev, w] of Object.entries(PROGRESSION.poolWaves)) {
    assert.ok(REVEALS.some((r) => r.id === rev), `wave ${rev} matches a reveal id`);
    for (const id of w.cards) assert.ok(CARDS[id] && !CARDS[id].locked, `wave card ${id} exists, not deed-locked`);
    for (const id of w.relics) assert.ok(RELICS[id] && !RELICS[id].locked && RELICS[id].rarity !== 'boss', `wave relic ${id} exists, not deed-locked, not a crown`);
  }
  assert.ok(Object.keys(POOL_GATE.cards).length && Object.keys(POOL_GATE.relics).length, 'pool gate derived');
}
```

(`CARDS` and `RELICS` are already imported in the test file.)

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test`
Expected: FAIL — `REVEALS` is not exported.

- [ ] **Step 3: Add the tables to `src/data.js`**

Append after the `DEEDS` table (~line 1119):

```js
// ---------------------------------------------------------------- THE VIGIL: PROGRESSIVE DELIVERY
// Every pacing tunable lives in PROGRESSION. REVEALS is derived from
// revealThresholds so the ladder ids stay declarative while counts stay
// tunable in one place. The engine never reads storage for these: newRun()
// receives a snapshot. Aspects and vows keep their own unlock mechanisms.
// Cards/relics not listed in any wave are core (available from run 1).
// Deed-locked content stays deed-gated on top. Criterion: core + wave 2
// favor low-complexity picks; combo pieces and build-arounds arrive late.
// Boss crowns are never wave-gated (rollBossRelics needs its full pool).
export const PROGRESSION = {
  // structural reveal ladder — runsPlayed counts every run end (win/fall/
  // abandon); wins come from deeds. Comments name what each id unlocks.
  revealThresholds: {
    lamplighter: { runsPlayed: 1 }, // boons + Lantern Art choice
    phials: { runsPlayed: 2 },      // potion drops, shop stock, HUD slots
    omens: { runsPlayed: 3 },       // per-act omen rolls + banner
    poolWave2: { runsPlayed: 2 },   // pool widens (see poolWaves)
    poolWave3: { runsPlayed: 4 },
    poolFull: { runsPlayed: 6 },    // today's full base pool
    emberglass: { wins: 1 },        // the chain arms (Phase 2)
  },
  poolWaves: {
    poolWave2: {
      cards: ['executioner', 'momentum', 'toxicMist', 'regrowth', 'bloodRite', 'devour', 'annihilate', 'limitBreak'],
      relics: ['reapersBell', 'seersOrb', 'frozenCore'],
    },
    poolWave3: {
      cards: ['offering', 'catalyst'],
      relics: ['executionersSeal'],
    },
    poolFull: {
      cards: ['ascension', 'frenzy', 'virulence'],
      relics: ['verdantBranch', 'duskmirror'],
    },
  },
};

// derived: id + trigger pairs for isRevealed / revealSnapshot / save validation
export const REVEALS = Object.entries(PROGRESSION.revealThresholds).map(([id, trigger]) => ({ id, trigger }));

// derived: content id -> the reveal id that admits it into the pools
export const POOL_GATE = (() => {
  const gate = { cards: {}, relics: {} };
  for (const [rev, w] of Object.entries(PROGRESSION.poolWaves)) {
    for (const id of w.cards) gate.cards[id] = rev;
    for (const id of w.relics) gate.relics[id] = rev;
  }
  return gate;
})();
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test`
Expected: PASS (ends with the usual `unit checks passed; monte-carlo: 300 runs, ...`).

- [ ] **Step 5: Commit**

```bash
git add src/data.js test/test_engine.js
git commit -m "Add REVEALS/PROGRESSION/POOL_GATE progressive-delivery tables"
```

---

### Task 2: `spirebound_vigil_v2` storage + one-way v1 migration

**Files:**
- Modify: `src/vigil.js` (`KEY` constant ~line 6, `loadVigil` ~lines 30–47)
- Test: `test/test_engine.js`

**Interfaces:**
- Produces: `loadVigil()` now returns the v2 shape (`runsPlayed`, `quests`, `shards`, `whispers`, `news` added); migration seeds v2 from v1/stats exactly once and never touches the v1 key. All existing callers (`syncVigil`, `commitRunToVigil`, `setBequest`, …) keep working — they read/write via `loadVigil`/`saveVigil`.

- [ ] **Step 1: Write the failing test**

Add to `test/test_engine.js` after the Task 1 block:

```js
{
  // vigil v2: fresh shape, and one-way migration from v1 that leaves v1 intact
  _setStore(null);
  const fresh = loadVigil();
  assert.equal(fresh.v, 2, 'fresh vigil is v2');
  assert.equal(fresh.runsPlayed, 0);
  assert.deepEqual(fresh.shards, []);
  assert.deepEqual(fresh.quests, {});
  assert.equal(fresh.news, false);

  // a veteran v1 profile migrates: counters carry, news pulses once, v1 stays
  const mem = new Map([
    ['spirebound_vigil_v1', JSON.stringify({
      v: 1,
      deeds: { runs: 40, wins: 9, slain: 500, shatters: 90, kindles: 60, perfects: 12, smolderKills: 60, unlitVisited: 30, embersSpent: 900, bestVow: 5, bestFloor: 45 },
      unlocks: ['aspect2', 'card:quakeblow'], vowUnlocked: 5,
      lastFall: { act: 1, row: 7, bequest: { kind: 'gold', amount: 50 } },
    })],
  ]);
  _setStore({ getItem: (k) => (mem.has(k) ? mem.get(k) : null), setItem: (k, v) => mem.set(k, v), removeItem: (k) => mem.delete(k) });
  const mig = loadVigil();
  assert.equal(mig.v, 2);
  assert.equal(mig.runsPlayed, 40, 'runsPlayed seeded from v1 deeds.runs');
  assert.equal(mig.deeds.wins, 9);
  assert.ok(mig.unlocks.includes('card:quakeblow'), 'unlocks carried');
  assert.equal(mig.vowUnlocked, 5);
  assert.deepEqual(mig.lastFall, { act: 1, row: 7, bequest: { kind: 'gold', amount: 50 } });
  assert.equal(mig.news, true, 'veterans get one pulse at the new Vigil');
  assert.ok(mem.has('spirebound_vigil_v2'), 'v2 persisted');
  assert.ok(mem.has('spirebound_vigil_v1'), 'v1 backup untouched');
  assert.equal(loadVigil().runsPlayed, 40, 'migration idempotent (reads v2 now)');
  _setStore(null);
}
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test`
Expected: FAIL — `fresh.v` is `1` / `runsPlayed` undefined.

- [ ] **Step 3: Implement v2 storage in `src/vigil.js`**

Replace the `KEY` constant (line 6) with:

```js
const KEY = 'spirebound_vigil_v2';
const KEY_V1 = 'spirebound_vigil_v1'; // read-only: migration source, never written
```

Replace the whole `loadVigil` function (lines 30–47) with:

```js
export function loadVigil() {
  let raw = null;
  try { raw = getStore().getItem(KEY); } catch { /* private mode */ }
  let v = null;
  try { v = JSON.parse(raw); } catch { /* corrupted */ }
  if (!v) v = migrateToV2();
  const out = {
    v: 2, deeds: {}, unlocks: [], vowUnlocked: 0, lastFall: null,
    runsPlayed: 0, quests: {}, shards: [], whispers: 0, news: false,
    ...(v || {}),
  };
  out.v = 2;
  out.deeds = { ...DEFAULT_DEEDS, ...(out.deeds || {}) };
  if (!Array.isArray(out.unlocks)) out.unlocks = [];
  if (!Array.isArray(out.shards)) out.shards = [];
  if (!out.quests || typeof out.quests !== 'object') out.quests = {};
  return out;
}

// one-way, idempotent: v1 (or the pre-vigil stats ledger) seeds v2 exactly
// once; the v1 key is left in place as a backup and never written again.
function migrateToV2() {
  let v1 = null, stats = null;
  try { v1 = JSON.parse(getStore().getItem(KEY_V1)); } catch { /* none */ }
  try { stats = JSON.parse(getStore().getItem(STATS_KEY)); } catch { /* none */ }
  const out = {
    v: 2, deeds: { ...DEFAULT_DEEDS }, unlocks: [], vowUnlocked: 0, lastFall: null,
    runsPlayed: 0, quests: {}, shards: [], whispers: 0, news: false,
  };
  if (v1) {
    out.deeds = { ...DEFAULT_DEEDS, ...(v1.deeds || {}) };
    out.unlocks = Array.isArray(v1.unlocks) ? [...v1.unlocks] : [];
    out.vowUnlocked = v1.vowUnlocked || 0;
    out.lastFall = v1.lastFall || null;
    out.news = true; // a veteran's first look at the new Vigil
  } else if (stats) {
    out.deeds.runs = stats.runs || 0;
    out.deeds.wins = stats.wins || 0;
    if (out.deeds.wins > 0) out.vowUnlocked = 1;
  }
  out.runsPlayed = Math.max(out.deeds.runs || 0, stats?.runs || 0);
  saveVigil(out);
  return out;
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test`
Expected: PASS — including the pre-existing vigil block (~line 762), which now runs against v2 transparently.

- [ ] **Step 5: Commit**

```bash
git add src/vigil.js test/test_engine.js
git commit -m "Move the Vigil to spirebound_vigil_v2 with one-way v1 migration"
```

---

### Task 3: Reveal evaluator + `commitRunEnd` + news flag

**Files:**
- Modify: `src/vigil.js` (imports line 4, new exports after `syncVigil` ~line 69, one line in `commitRunToVigil`)
- Test: `test/test_engine.js`

**Interfaces:**
- Produces: `isRevealed(vigil, id)`, `revealSnapshot(vigil)`, `commitRunEnd(run)` (idempotent per run; increments `runsPlayed` on every run end, sets `news` when reveals cross), `clearNews()`. Consumed by `ui.js` (Tasks 5–8).

- [ ] **Step 1: Write the failing test**

Add to `test/test_engine.js` (extend the `../src/vigil.js` import with `isRevealed, revealSnapshot, commitRunEnd, clearNews`):

```js
{
  // the reveal ladder: counters only ever open doors
  _setStore(null);
  let v = loadVigil();
  assert.deepEqual(revealSnapshot(v), [], 'a fresh profile sees only the core game');
  assert.ok(!isRevealed(v, 'lamplighter') && !isRevealed(v, 'emberglass'));
  assert.ok(!isRevealed(v, 'nonsense'), 'unknown reveal ids are never revealed');

  // run ends advance the ladder — win, fall, or abandon alike — exactly once
  const r1 = newRun(301);
  v = commitRunEnd(r1);
  assert.equal(v.runsPlayed, 1);
  assert.equal(commitRunEnd(r1).runsPlayed, 1, 'commitRunEnd idempotent per run');
  assert.ok(isRevealed(v, 'lamplighter'), 'run 2 gets the Lamplighter');
  assert.equal(v.news, true, 'crossing a reveal pulses the Vigil');
  assert.equal(clearNews().news, false, 'opening the Vigil clears the pulse');

  v = commitRunEnd(newRun(302));
  assert.ok(isRevealed(v, 'phials') && isRevealed(v, 'poolWave2'), 'runsPlayed 2 tier');
  v = commitRunEnd(newRun(303));
  assert.ok(isRevealed(v, 'omens'), 'runsPlayed 3 tier');
  commitRunEnd(newRun(304));
  v = commitRunEnd(newRun(305));
  assert.ok(isRevealed(v, 'poolWave3'), 'runsPlayed 4 tier (already crossed)');
  v = commitRunEnd(newRun(306));
  assert.ok(isRevealed(v, 'poolFull'), 'runsPlayed 6 tier');
  assert.ok(!isRevealed(v, 'emberglass'), 'wins-gated reveal still dark');

  // a win reveals the emberglass chain and marks news
  const wr = newRun(307);
  commitRunToVigil(wr, true);
  v = loadVigil();
  assert.ok(isRevealed(v, 'emberglass'), 'first dawn arms the chain');
  assert.equal(v.news, true, 'unlocks pulse the Vigil too');
  _setStore(null);
}
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test`
Expected: FAIL — `isRevealed` is not exported.

- [ ] **Step 3: Implement in `src/vigil.js`**

Extend the import (line 4):

```js
import { DEEDS, CARDS, RELICS, REVEALS } from './data.js';
```

Add after `syncVigil` (~line 69):

```js
// ---------------------------------------------------------------- reveals
// The structural ladder (REVEALS in data.js) evaluated against the ledger.
export function isRevealed(vigil, id) {
  const r = REVEALS.find((x) => x.id === id);
  if (!r) return false;
  const t = r.trigger;
  if (t.runsPlayed != null && (vigil.runsPlayed || 0) < t.runsPlayed) return false;
  if (t.wins != null && (vigil.deeds.wins || 0) < t.wins) return false;
  return true;
}
export function revealSnapshot(vigil) {
  return REVEALS.filter((r) => isRevealed(vigil, r.id)).map((r) => r.id);
}

// every run end — win, fall, or abandon — advances the ledger that paces the
// reveals. Separate from commitRunToVigil so deed semantics (win/fall only)
// stay untouched. Idempotent per run.
export function commitRunEnd(run) {
  if (run.runEndCommitted) return loadVigil();
  run.runEndCommitted = true;
  const v = loadVigil();
  const before = revealSnapshot(v).length;
  v.runsPlayed++;
  if (revealSnapshot(v).length > before) v.news = true;
  saveVigil(v);
  return v;
}

export function clearNews() {
  const v = loadVigil();
  if (v.news) { v.news = false; saveVigil(v); }
  return v;
}
```

In `commitRunToVigil`, after folding deed counters and `v.unlocks.push(...newUnlocks);`, pulse on any deed-bar movement (design §3 — not only threshold unlocks):

```js
  // pulse on any deed-bar movement (not only threshold unlocks) — design §3
  const deedProgressed = Object.keys(DEFAULT_DEEDS).some((k) => v.deeds[k] !== beforeDeeds[k]);
  if (deedProgressed || newUnlocks.length) v.news = true;
```

(Snapshot `beforeDeeds = { ...v.deeds }` at the start of the fold.)

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/vigil.js test/test_engine.js
git commit -m "Add reveal evaluator, commitRunEnd ledger, and Vigil news flag"
```

---

### Task 4: Engine gating — `run.reveals`, pool waves, omens, phials

**Files:**
- Modify: `src/engine.js` (imports line 2, `newRun` ~21–45, pools ~195–206, `gainPotion` ~309, `genCombatRewards` ~351–359, `genShop` ~388, `loadRun` ~1166–1186)
- Test: `test/test_engine.js`

**Interfaces:**
- Produces: `runRevealed(run, id)` (exported), `newRun` accepts `opts.reveals` (array snapshot; absent/null = fully revealed), pools/omens/phials honor it, `loadRun` validates/heals it.

- [ ] **Step 1: Write the failing test**

Add to `test/test_engine.js` (extend the `../src/engine.js` import with `runRevealed`, and with `gainPotion`, `genCombatRewards`, `genShop` if not already imported):

```js
{
  // run.reveals gating: null (default) = today's game; a snapshot narrows it
  const full = newRun(310);
  assert.equal(full.reveals, null, 'no opt = fully revealed');
  assert.ok(runRevealed(full, 'phials') && runRevealed(full, 'poolFull'));
  assert.deepEqual(cardPool(full, 'rare'), CARD_POOLS.rare, 'default pools unchanged');
  assert.deepEqual(relicPool(full, 'rare'), RELIC_POOLS.rare);
  assert.ok(OMENS[full.omens[0]], 'default runs climb under a sky');

  const core = newRun(311, { reveals: [] });
  assert.ok(!runRevealed(core, 'phials'));
  assert.ok(!cardPool(core, 'rare').includes('frenzy'), 'build-around rare held back');
  assert.ok(!cardPool(core, 'uncommon').includes('toxicMist'), 'wave-2 uncommon held back');
  assert.ok(cardPool(core, 'common').includes('twinFangs'), 'core commons present');
  assert.ok(!relicPool(core, 'rare').includes('duskmirror'), 'late relic held back');
  assert.deepEqual(relicPool(core, 'boss'), RELIC_POOLS.boss, 'boss crowns never gated');
  assert.equal(core.omens[0], null, 'run 1 climbs under a clear sky');
  assert.equal(gainPotion(core, 'healing'), false, 'phials hidden');
  for (let s = 0; s < 12; s++) {
    assert.equal(genCombatRewards(newRun(320 + s, { reveals: [] }), 'normal').potion, null, 'no potion drops pre-reveal');
  }
  const shopC = genShop(newRun(312, { reveals: [] }));
  assert.equal(shopC.potions.length, 0, 'merchant stocks no phials pre-reveal');

  const mid = newRun(313, { reveals: ['omens', 'phials', 'poolWave2'] });
  assert.ok(OMENS[mid.omens[0]], 'omen rolls once revealed');
  assert.equal(gainPotion(mid, 'healing'), true);
  assert.ok(cardPool(mid, 'rare').includes('devour'), 'wave 2 open');
  assert.ok(!cardPool(mid, 'rare').includes('frenzy'), 'later waves still closed');

  // deed unlocks pierce the waves
  const dl = newRun(314, { reveals: [], unlocks: ['card:quakeblow', 'relic:prismCharm'] });
  assert.ok(cardPool(dl, 'uncommon').includes('quakeblow'));
  assert.ok(relicPool(dl, 'rare').includes('prismCharm'));
}
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test`
Expected: FAIL — `runRevealed` is not exported.

- [ ] **Step 3: Implement in `src/engine.js`**

Extend the import (line 2) with `REVEALS` and `POOL_GATE`:

```js
import { ASPECTS, VOWS, CARDS, CARD_POOLS, RELICS, RELIC_POOLS, POTIONS, ENEMIES, ENCOUNTERS, EVENTS, REWARD_GOLD, SHOP, ARTS, OMENS, AFFIXES, REVEALS, POOL_GATE } from './data.js';
```

Update the `newRun` opts comment (line 20):

```js
// opts: { aspect, vow, unlocks (vigil snapshot), reveals (vigil snapshot; null/absent = fully revealed), monument (last fall), lamplighter }
```

In `newRun`, after the `unlocks:` line (~28) add:

```js
    reveals: opts.reveals ? [...opts.reveals] : null,
```

and change the omen roll (line 43) to:

```js
  run.omens.push(runRevealed(run, 'omens') ? rollOmen(run) : null);
```

In the helpers section, above `cardPool` (~line 193), add:

```js
// structural reveals: run.reveals is a snapshot of vigil reveal ids taken at
// newRun time; null (tests, dev hooks, pre-reveal saves) means fully revealed.
export const runRevealed = (run, id) => run.reveals == null || run.reveals.includes(id);
```

Replace `cardPool` / `relicPool` (~195–206) with:

```js
export function cardPool(run, tier) {
  const extra = (run.unlocks || [])
    .filter((u) => u.startsWith('card:')).map((u) => u.slice(5))
    .filter((id) => CARDS[id] && CARDS[id].rarity === tier);
  let base = CARD_POOLS[tier];
  if (run.reveals != null) base = base.filter((id) => !POOL_GATE.cards[id] || run.reveals.includes(POOL_GATE.cards[id]));
  return extra.length ? [...base, ...extra] : base;
}
export function relicPool(run, tier) {
  const extra = (run.unlocks || [])
    .filter((u) => u.startsWith('relic:')).map((u) => u.slice(6))
    .filter((id) => RELICS[id] && RELICS[id].rarity === tier);
  let base = RELIC_POOLS[tier];
  if (run.reveals != null) base = base.filter((id) => !POOL_GATE.relics[id] || run.reveals.includes(POOL_GATE.relics[id]));
  return extra.length ? [...base, ...extra] : base;
}
```

In `gainPotion` (~309), add as the first line of the function body:

```js
  if (!runRevealed(run, 'phials')) return false;
```

In `genCombatRewards` (~356), change the potion line to (note: `rng()` stays first so the revealed-case stream is byte-identical to today):

```js
  if (kind !== 'boss' && rng() < 0.4 && runRevealed(run, 'phials')) rw.potion = pick(rng, Object.keys(POTIONS));
```

In `genShop` (~388), wrap the potion loop:

```js
  const potions = [];
  if (runRevealed(run, 'phials')) {
    for (let i = 0; i < 2; i++) potions.push({ id: pick(rng, Object.keys(POTIONS)), price: price(SHOP.potionPrice, disc), sold: false });
  }
```

In `loadRun` (~1178–1183):

- change the omen validation line to:

```js
    if (!(run.omens || []).every((id) => id == null || OMENS[id])) return null;
```

- after the `run.unlocks ??= [];` self-heal line add:

```js
    run.reveals ??= null;
    if (run.reveals != null && !(Array.isArray(run.reveals) && run.reveals.every((id) => REVEALS.some((r) => r.id === id)))) return null;
```

- change the omen backfill loop to:

```js
    while (run.omens.length <= run.act) run.omens.push(runRevealed(run, 'omens') ? rollOmen(run) : null);
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test`
Expected: PASS — including monte-carlo (default runs are fully revealed) and the pre-existing pool tests (~line 788).

- [ ] **Step 5: Commit**

```bash
git add src/engine.js test/test_engine.js
git commit -m "Gate pools, omens, and phials behind run.reveals snapshots"
```

---

### Task 5: UI run-end wiring + in-run gating

**Files:**
- Modify: `src/ui.js` (vigil import line 6, `renderHud` ~255–303, `confirmAbandon` ~373, `renderLamplighter` boon draw ~621, `victoryFlow` ~2317, `defeatFlow` ~2330, `advanceAct` ~2467)

No engine-visible behaviour change for fully-revealed runs; `npm test` + `npm run build` are the gates.

- [ ] **Step 1: Extend the vigil import (line 6)**

```js
import { syncVigil, loadVigil, commitRunToVigil, setBequest, clearBequest, bequestOptions, isRevealed, revealSnapshot, commitRunEnd, clearNews } from './vigil.js';
```

(`isRevealed` / `revealSnapshot` / `clearNews` get call sites in Tasks 6–8; `loadVigil` is removed again in Task 7 when `showVigil` dies.)

- [ ] **Step 2: Advance the ledger at every run end**

In `victoryFlow` (~2317), after the `commitRunToVigil(run, true)` line add:

```js
    commitRunEnd(run); // the ledger that paces reveals counts every ending
```

In `defeatFlow` (~2330), after `commitRunToVigil(run, false);` add:

```js
  commitRunEnd(run);
```

In `confirmAbandon` (~373), change the `yes` branch to:

```js
      if (a === 'yes') { commitRunEnd(S.run); E.recordRunEnd(S.run, false); S.run = null; S.cb = null; closeOverlay(); stopAmbience(); show('title'); }
```

- [ ] **Step 3: Gate the HUD phial slots**

In `renderHud`, change the hide condition (line 258) to also cover the screens added in Tasks 6–7:

```js
  if (!S.run || S.screen === 'title' || S.screen === 'embark' || S.screen === 'vigil' || S.screen === 'end' || S.screen === 'lamplighter') { hud.classList.remove('show'); document.body.classList.remove('low-hp'); return; }
```

Change the potion-slot template (line 272) to:

```js
        ${E.runRevealed(S.run, 'phials') ? p.potions.map((id, i) => `<button class="potion-slot ${id ? 'full' : ''}" data-slot="${i}">${id ? rasterOr('potions', id, potionSvg(POTIONS[id].tone)) : ''}</button>`).join('') : ''}
```

And guard the tooltip loop (~296) against absent slots:

```js
  p.potions.forEach((id, i) => {
    if (!id) return;
    const slot = $(`.potion-slot[data-slot="${i}"]`, hud);
    if (!slot) return;
```

(keep the rest of that loop unchanged).

- [ ] **Step 4: Keep phial boons out of pre-reveal Lamplighter draws**

In `renderLamplighter` (~621), change the boon pool line to:

```js
    const pool = Object.keys(BOONS).filter((id) => E.runRevealed(run, 'phials') || !BOONS[id].ops.some((op) => op.potion));
```

- [ ] **Step 5: Gate act-change omen rolls**

In `advanceAct` (~2467):

```js
  run.omens.push(E.runRevealed(run, 'omens') ? E.rollOmen(run) : null); // each act climbs under its own sky
```

(`omenBanner`, the HUD omen chip, the map title, and the act-change plate already null-check the omen.)

- [ ] **Step 6: Verify**

Run: `npm test` — PASS.
Run: `npm run build` — clean Vite build, no import errors (do not commit `dist/`).

- [ ] **Step 7: Commit**

```bash
git add src/ui.js
git commit -m "Wire commitRunEnd into run ends and gate phials/omens in the UI"
```

---

### Task 6: The Embark screen (and the unlocks bug fix)

The title keeps its old layout for now; Embark is reachable via `window.spirebound.show('embark')` until Task 8 flips the title. The app stays fully playable at this commit.

**Files:**
- Modify: `src/ui.js` (`show()` map ~486–489; new `renderEmbark` after `renderTitle`), `src/styles.css`

- [ ] **Step 1: Route the screen**

In `show()` (~486), add `embark` to the renderer map:

```js
  ({
    title: renderTitle, embark: renderEmbark, map: renderMap, combat: () => {}, reward: renderReward, rest: renderRest,
    shop: renderShop, event: renderEvent, treasure: renderTreasure, bossRelic: renderBossRelic, end: renderEnd,
  })[name](data);
```

- [ ] **Step 2: Add `renderEmbark` after `renderTitle`**

```js
// EMBARK — where a climb is configured. Grows as the Vigil reveals more: a
// fresh profile sees a single Begin button; the aspect choice arrives with
// 'aspect2', the vow ladder with the first dawn.
function renderEmbark() {
  stopAmbience();
  setTheme(0);
  const vigil = syncVigil();
  const saved = E.loadRun();
  const sel = (S.title ||= { aspect: 0, vow: 0 });
  const hasAspects = vigil.unlocks.includes('aspect2');
  if (!hasAspects) sel.aspect = 0;
  sel.vow = Math.max(0, Math.min(sel.vow | 0, vigil.vowUnlocked));
  const aspectRow = hasAspects ? `<div class="embark-label">Who carries the lantern</div>
    <div class="aspect-row">${ASPECTS.map((a, i) => `
      <button class="aspect-card${sel.aspect === i ? ' on' : ''}" data-a="asp" data-i="${i}">
        <div class="asp-hero">${heroArt(i)}</div>
        <div class="asp-name">${a.name}</div>
        <div class="asp-blurb">${a.blurb}</div>
      </button>`).join('')}</div>` : '';
  const vowLine = sel.vow === 0
    ? 'The Spire as it is. No vows sworn.'
    : VOWS.slice(0, sel.vow).map((v) => `<b style="color:#ff9a4d">${v.name}</b> — ${v.desc}`).join('<br>');
  const vowBlock = vigil.vowUnlocked > 0 ? `<div class="vow-block">
      <div class="vow-stepper">
        <button class="vow-btn" data-a="vow-"${sel.vow === 0 ? ' disabled' : ''}>−</button>
        <div class="vow-level">VOW ${ROMAN[sel.vow]}<span class="vow-max"> / ${ROMAN[vigil.vowUnlocked] || '0'}</span></div>
        <button class="vow-btn" data-a="vow+"${sel.vow < vigil.vowUnlocked ? '' : ' disabled'}>+</button>
      </div>
      <div class="vow-desc">${vowLine}</div>
    </div>` : '';
  const sc = screenEl();
  sc.innerHTML = `<div class="embark-screen screen-enter">
    <div class="embark-title">THE CLIMB BEGINS</div>
    <div class="embark-sub">${hasAspects || vigil.vowUnlocked > 0 ? 'Choose how you meet the Spire.' : 'The lantern is lit. The Spire waits.'}</div>
    ${aspectRow}
    ${vowBlock}
    ${saved ? '<div class="embark-warn">Beginning anew abandons your saved climb.</div>' : ''}
    <div class="title-btns">
      <button class="btn btn-primary" data-a="begin">${saved ? 'Begin Anew' : 'Begin the Climb'}</button>
      <button class="btn ghost" data-a="back">Back</button>
    </div>
  </div>`;
  const beginClimb = () => {
    const v = syncVigil(); // re-read after abandon so the next snapshot sees new reveals
    startRun(E.newRun(undefined, {
      aspect: sel.aspect,
      vow: sel.vow,
      lamplighter: isRevealed(v, 'lamplighter'),
      monument: v.lastFall,
      unlocks: v.unlocks, // the fix: deed unlocks finally reach live pools
      reveals: revealSnapshot(v),
    }));
  };
  sc.onclick = (e) => {
    const t = e.target.closest('[data-a]');
    if (!t || t.disabled) return;
    const a = t.dataset.a;
    unlock(); sfx.click();
    if (a === 'asp') { sel.aspect = +t.dataset.i; renderEmbark(); }
    else if (a === 'vow-') { sel.vow = Math.max(0, sel.vow - 1); renderEmbark(); }
    else if (a === 'vow+') { sel.vow = Math.min(vigil.vowUnlocked, sel.vow + 1); renderEmbark(); }
    else if (a === 'back') show('title');
    else if (a === 'begin') {
      // Spec §3: title stays "Begin the Climb"; Begin Anew confirmation lives
      // on Embark. Abandon advances runsPlayed like confirmAbandon.
      if (!saved) { beginClimb(); return; }
      openOverlay(`<div class="panel ov-panel" style="text-align:center">
        <div class="ov-title">Begin Anew?</div>
        <div class="ov-sub">Your saved climb will be lost to the void.</div>
        <div class="ov-actions"><button class="btn danger" data-a="yes">Begin Anew</button><button class="btn ghost" data-a="no">Keep Climbing</button></div>
      </div>`, (root) => {
        root.onclick = (ev) => {
          const ans = ev.target.dataset.a;
          if (ans === 'yes') {
            const abandoned = E.loadRun();
            if (abandoned) {
              commitRunEnd(abandoned);
              E.recordRunEnd(abandoned, false);
            }
            S.run = null; S.cb = null;
            closeOverlay();
            beginClimb();
          }
          if (ans === 'no') closeOverlay();
        };
      });
    }
  };
}
```

- [ ] **Step 3: Add the CSS**

Append to `src/styles.css`:

```css
/* ---- entrance redesign: embark screen */
.embark-screen {
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 14px;
  padding: 20px;
  text-align: center;
}
.embark-title { font-size: 26px; letter-spacing: 4px; color: #ffd166; }
.embark-sub { opacity: 0.75; font-size: 14px; }
.embark-label { font-size: 12px; letter-spacing: 2px; text-transform: uppercase; opacity: 0.6; }
.embark-warn { color: #ff8d8d; font-size: 12px; }
```

(`.aspect-row`, `.vow-block`, `.title-btns` already exist and are screen-agnostic.)

- [ ] **Step 4: Verify**

Run: `npm test` — PASS. Run: `npm run build` — clean.
With `npm run dev` running, open `http://localhost:5174/`, run `window.spirebound.show('embark')` in the console: fresh profile shows the zero-section Embark; Begin starts a run with no Lamplighter.

- [ ] **Step 5: Commit**

```bash
git add src/ui.js src/styles.css
git commit -m "Add the growing Embark screen; pass vigil unlocks+reveals into newRun"
```

---

### Task 7: The Vigil as a full screen

**Files:**
- Modify: `src/ui.js` (`show()` map, replace `showVigil` ~559–589 with `renderVigil`, old title's vigil handler, vigil import), `src/styles.css`

- [ ] **Step 1: Route the screen**

In `show()`'s renderer map, add `vigil: renderVigil,` after `embark: renderEmbark,`.

- [ ] **Step 2: Replace `showVigil` with `renderVigil`**

Delete the whole `showVigil` function and add in its place:

```js
// THE VIGIL — the hall between climbs. Phase 1 ships the Deeds tab; the
// Emberglass rose window joins it when the chain arms (Phase 2).
function renderVigil() {
  stopAmbience();
  setTheme(0);
  const v = clearNews(); // opening the hall reads the news
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
  sc.innerHTML = `<div class="center-panel screen-enter"><div class="panel vigil-panel">
    <div class="ov-title">The Vigil</div>
    <div class="ov-sub">${v.deeds.runs} climbs · ${v.deeds.wins} dawns · deepest Vow: ${ROMAN[v.deeds.bestVow] || '—'}</div>
    <div class="vigil-tabs"><button class="vtab on" data-a="tab-deeds">Deeds</button></div>
    <div class="deed-list">${deedRows}</div>
    <div class="ov-actions"><button class="btn" data-a="back">Return</button></div>
  </div></div>`;
  sc.onclick = (e) => {
    const t = e.target.closest('[data-a]');
    if (!t) return;
    sfx.click();
    if (t.dataset.a === 'back') show('title');
  };
}
```

In the (still old) `renderTitle`, change the vigil handler line:

```js
    else if (a === 'vigil') show('vigil');
```

Drop `loadVigil` from the vigil import (line 6) — `renderVigil` uses `clearNews`.

Confirm nothing else references the old overlay:

Run: `grep -n "showVigil\|loadVigil" src/ui.js`
Expected: no matches.

- [ ] **Step 3: Add the CSS**

Append to `src/styles.css`:

```css
/* ---- entrance redesign: vigil screen tabs */
#screen .vigil-panel { max-height: 90cqh; }
.vigil-tabs { display: flex; gap: 8px; justify-content: center; margin: 4px 0 10px; }
.vigil-tabs .vtab {
  background: none;
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 6px;
  padding: 4px 14px;
  color: inherit;
  font: inherit;
  font-size: 13px;
  opacity: 0.6;
  cursor: pointer;
}
.vigil-tabs .vtab.on { opacity: 1; border-color: rgba(255, 209, 102, 0.6); }
```

- [ ] **Step 4: Verify**

Run: `npm test` — PASS. Run: `npm run build` — clean.
In the dev server, click The Vigil on the title: full screen with Deeds tab renders; Return goes back to the title.

- [ ] **Step 5: Commit**

```bash
git add src/ui.js src/styles.css
git commit -m "Promote the Vigil from overlay to a tabbed full screen"
```

---

### Task 8: Clean title screen + Vigil news pulse

**Files:**
- Modify: `src/ui.js` (`renderTitle` ~496–557), `src/styles.css`

- [ ] **Step 1: Replace `renderTitle`**

Replace the whole function with:

```js
function renderTitle() {
  stopAmbience();
  setTheme(0);
  const vigil = syncVigil(); // reconcile any owed unlocks (e.g. seeded from old stats)
  const saved = E.loadRun();
  const d = vigil.deeds;
  const banner = assetUrl('title-background', 'background');
  const titleText = assetUrl('title', 'title');
  const sc = screenEl();
  sc.innerHTML = `<div class="title-screen screen-enter">
    ${banner ? `<div class="title-banner"><div class="title-banner-frame"><img class="raster-art" src="${banner}" alt=""></div></div>` : ''}
    <div class="logo${titleText ? ' logo-raster' : ''}">${titleText ? `<img class="title-wordmark" src="${titleText}" alt="SPIREBOUND">` : 'SPIREBOUND'}</div>
    <div class="tagline">A Roguelite Deckbuilder · The Vigil Remembers</div>
    <div class="title-btns">
      ${saved ? '<button class="btn" data-a="continue">Continue Climb</button>' : ''}
      <button class="btn" data-a="embark">Begin the Climb</button>
      <button class="btn ghost${vigil.news && !REDUCED ? ' news' : ''}" data-a="vigil">The Vigil</button>
      <button class="btn ghost" data-a="help">How to Play</button>
      <button class="btn ghost" data-a="mute">${isMuted() ? 'Unmute' : 'Mute'}</button>
    </div>
    <div class="title-stats">${d.runs} climbs · ${d.wins} dawns · ${d.slain} slain${vigil.unlocks.length ? ` · ${vigil.unlocks.length} secrets unearthed` : ''}</div>
  </div>`;
  sc.onclick = (e) => {
    const t = e.target.closest('[data-a]');
    if (!t || t.disabled) return;
    const a = t.dataset.a;
    unlock(); sfx.click();
    if (a === 'embark') show('embark');
    else if (a === 'continue' && saved) startRun(saved, true);
    else if (a === 'vigil') show('vigil');
    else if (a === 'help') showHelp();
    else if (a === 'mute') { toggleMute(); renderTitle(); }
  };
  meshBindTitle();
}
```

The aspect row, vow stepper, and their handlers now live only on Embark. `ROMAN` (line 495) stays — Embark and the Vigil screen use it.

- [ ] **Step 2: Add the pulse CSS**

Append to `src/styles.css`:

```css
/* ---- entrance redesign: Vigil news pulse */
.btn.news { position: relative; }
.btn.news::after {
  content: '';
  position: absolute;
  inset: -3px;
  border-radius: inherit;
  border: 1px solid rgba(255, 209, 102, 0.85);
  pointer-events: none;
  animation: vigil-news 1.6s ease-in-out infinite;
}
@keyframes vigil-news {
  0%, 100% { opacity: 0.25; transform: scale(1); }
  50% { opacity: 0.9; transform: scale(1.04); }
}
```

- [ ] **Step 3: Verify**

Run: `npm test` — PASS. Run: `npm run build` — clean.
In the dev server on a fresh profile: title shows only the button column (no aspects, no vows); Begin the Climb opens Embark; Back returns.

- [ ] **Step 4: Commit**

```bash
git add src/ui.js src/styles.css
git commit -m "Strip the title screen to entrances only, add Vigil news pulse"
```

---

### Task 9: Playwright updates

**Files:**
- Modify: `test/e2e/stage.spec.js` (title overflow test, ~56–89), `test/e2e/visual.spec.js` (~74–80), `test/e2e/visual.spec.js-snapshots/` (regenerated)

- [ ] **Step 1: Update the overflow scenario in `stage.spec.js`**

Replace the `title screen fits its stage` test (lines 56–89) with:

```js
test('title and embark screens fit their stage: no scrollable overflow anywhere', async ({ page }) => {
  await boot(page);
  // the fullest profile a veteran can produce: saved run (Continue button),
  // both aspects, vow stepper at V with the five-line vow ledger, and the
  // Vigil news pulse — the vow content now lives on the Embark screen
  await page.evaluate(() => {
    localStorage.setItem('spirebound_vigil_v2', JSON.stringify({
      v: 2,
      deeds: { runs: 40, wins: 9, slain: 500, shatters: 90, kindles: 60, perfects: 12, smolderKills: 60, unlitVisited: 30, embersSpent: 900, bestVow: 5, bestFloor: 45 },
      unlocks: ['aspect2'], vowUnlocked: 5, lastFall: null,
      runsPlayed: 40, quests: {}, shards: [], whispers: 0, news: true,
    }));
    window.spirebound.E.saveRun(window.spirebound.E.newRun(1234, { aspect: 0 }));
  });
  await page.reload();
  await page.waitForFunction(() => window.spirebound && window.__probe);
  const scan = () => page.evaluate(() => {
    const out = [];
    const de = document.scrollingElement;
    if (de.scrollHeight > de.clientHeight || de.scrollWidth > de.clientWidth) {
      out.push(`document ${de.scrollWidth}x${de.scrollHeight} in ${de.clientWidth}x${de.clientHeight}`);
    }
    for (const el of document.querySelectorAll('#stage *')) {
      const cs = getComputedStyle(el);
      if (!/(auto|scroll)/.test(cs.overflowY + cs.overflowX)) continue;
      if (el.scrollHeight > el.clientHeight + 1 || el.scrollWidth > el.clientWidth + 1) {
        out.push(`${el.tagName.toLowerCase()}.${String(el.className).split(' ').join('.')} ${el.scrollWidth}x${el.scrollHeight} in ${el.clientWidth}x${el.clientHeight}`);
      }
    }
    return out;
  });
  const badTitle = await scan();
  expect(badTitle, `title: ${badTitle.join('; ')}`).toEqual([]);
  await page.click('[data-a="embark"]');
  for (let i = 0; i < 5; i++) await page.click('[data-a="vow+"]');
  await page.waitForTimeout(600);
  const badEmbark = await scan();
  expect(badEmbark, `embark: ${badEmbark.join('; ')}`).toEqual([]);
});
```

- [ ] **Step 2: Add embark/vigil shots to `visual.spec.js`**

Change the screens loop (~line 74) to:

```js
for (const screen of ['shop', 'rest', 'treasure', 'embark', 'vigil']) {
```

- [ ] **Step 3: Refresh baselines and run the kit**

```bash
npx playwright install chromium   # once, if launch fails
npm run test:e2e:update
npm run test:e2e
```

Expected: `test:e2e` green. The `title` baseline changes (aspect row/vow stepper gone) and `embark.png` / `vigil.png` appear — eyeball all three diffs before committing. If a snapshot shows a broken layout (clipped panel, overlapping buttons), fix the CSS from Tasks 6–8 rather than accepting the baseline.

- [ ] **Step 4: Commit**

```bash
git add test/e2e/stage.spec.js test/e2e/visual.spec.js test/e2e/visual.spec.js-snapshots
git commit -m "Retarget e2e overflow/visual coverage at the new entrance screens"
```

---

### Task 10: Final sweep — full verification, manual smoke, docs, dist

**Files:**
- Modify: `docs/README.md` (Active implementation specs table), `dist/` (rebuild)

- [ ] **Step 1: Full automated verification**

```bash
npm test
npm run test:e2e
npm run build
```

Expected: all green; build clean.

- [ ] **Step 2: Manual GUI smoke (fresh-profile journey)**

With `npm run dev` on port 5174, in a clean browser profile (or after `localStorage.clear()` + reload):

1. Title shows only Begin the Climb / The Vigil / How to Play / Mute (no Continue, no aspects, no vows).
2. Begin the Climb → Embark shows zero sections and "The lantern is lit." → Begin → **no Lamplighter**, straight to the Act 1 map, **no omen banner**, HUD has **no phial slots**.
3. Abandon the run via the HUD menu. Back at the title, run in the console: `JSON.parse(localStorage.getItem('spirebound_vigil_v2')).runsPlayed` → `1`.
4. Begin again → the **Lamplighter appears** (boon choices exclude phial-granting boons). Abandon; third run: HUD **shows phial slots**; abandon once more; fourth run: **omen banner appears** on the map.
5. Veteran check — paste the v2 seed from Task 9's stage.spec into the console (with `news: true`), reload: Vigil button **pulses**; Embark shows **both aspects and the vow stepper**; The Vigil opens the full screen with the Deeds tab and the pulse is gone after returning to the title.
6. Bug-fix check — in the console:

```js
localStorage.setItem('spirebound_vigil_v2', JSON.stringify({ v: 2, deeds: { runs: 40, wins: 9, slain: 0, shatters: 90, kindles: 0, perfects: 0, smolderKills: 0, unlitVisited: 0, embersSpent: 0, bestVow: 0, bestFloor: 0 }, unlocks: ['card:quakeblow'], vowUnlocked: 1, lastFall: null, runsPlayed: 40, quests: {}, shards: [], whispers: 0, news: false }));
```

Reload → Begin → on the map run `window.spirebound.S.run.unlocks` → contains `'card:quakeblow'` (previously always `[]` from the live path).

Record a demo video of the fresh-profile journey (steps 1–4) for the walkthrough.

- [ ] **Step 3: Update the docs index**

In `docs/README.md`, add to the Active implementation specs table:

```markdown
| [`superpowers/specs/2026-07-09-entrance-progressive-delivery-design.md`](superpowers/specs/2026-07-09-entrance-progressive-delivery-design.md) | **Current** — progressive delivery engine, entrance redesign, Emberglass chain (Phase 2 pending) |
| [`superpowers/plans/2026-07-09-entrance-progressive-delivery-phase1.md`](superpowers/plans/2026-07-09-entrance-progressive-delivery-phase1.md) | Executor plan, Phase 1 (delivery engine + entrances) |
```

- [ ] **Step 4: Rebuild and commit dist + docs**

```bash
npm run build
git add docs/README.md dist
git commit -m "Rebuild dist and index the entrance/progressive-delivery docs"
```

---

## Self-review checklist (for the executor, after all tasks)

1. **Spec coverage (Phase 1 scope):** reveal engine (Tasks 1, 3, 4), v2 + migration (Task 2), pool waves (Tasks 1, 4), `commitRunEnd` on abandon (Task 5), entrances (Tasks 6–8), pulse (Task 8), unlocks bug fix (Task 6), Playwright updates (Task 9). Rose window, variants, quests, whispers, title medallion = Phase 2 by design.
2. **Back-compat:** `newRun` default fully-revealed asserted in Task 4 tests; monte-carlo and e2e `boot()` untouched.
3. **Naming consistency:** `runRevealed` (engine, per-run snapshot) vs `isRevealed` (vigil, per-profile); `commitRunEnd` vs `commitRunToVigil`; reveal ids identical across `REVEALS`, `PROGRESSION.poolWaves`, and every call site.
