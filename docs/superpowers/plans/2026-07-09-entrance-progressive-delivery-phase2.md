# Entrances & Progressive Delivery — Phase 2 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (- [ ]) syntax for tracking.

**Goal:** Ship the data-driven enemy-variant engine and the complete six-quest Emberglass chain, including whispers, Rose Window, title medallion, sealed summit door, save-safe progression, and pacing proof.

**Architecture:** data.js remains the single declarative source for quest copy, variants, and every threshold, count, price, probability, and stat tier. vigil.js owns cross-run hydration, arming, whispers, shards, and outcome commits; engine.js owns run snapshots and pure quest hooks; ui.js only projects state and drains event queues. Variants retain a base enemy/layout key plus a separate variant identity and presentation record so existing battlefield, VFX, asset, and save contracts remain intact.

**Tech Stack:** Vite + vanilla JavaScript + Three.js; node test/test_engine.js through npm test; Playwright visual-QA on port 5174; optional raster art through the documented gpt-image-2 → Nano Banana Pro workflow.

## Global Constraints

- Keep engine.js, vigil.js, data.js, and battlefield files Node-runnable. They must not import DOM, audio.js, music.js, stage.js, or mesh.js.
- Preserve the module graph: engine.js and vigil.js import data.js only. Do not add a shared browser module beneath them.
- Existing internal card, relic, status, enemy, omen, reveal, and save IDs are immutable. New IDs are fixed by this plan.
- Calling newRun(seed) without quest options keeps all existing structural systems fully revealed and leaves Emberglass hooks dormant. This preserves the Monte Carlo and Playwright boot contract.
- spirebound_vigil_v1 remains untouched. Existing Phase 1 spirebound_vigil_v2 records must be hydrated in place because they will never re-run v1 migration.
- All quest scratch state and exact pending enemy IDs live in spirebound_save_v2 and pass loadRun validation.
- Every threshold, target, price, probability, guarantee window, and Shade tier lives under PROGRESSION.emberglass in data.js.
- No playable Act 4, new enemy base art, combat-maths or preview-mirror changes, audio wiring, localisation, daily seeds, achievements, or unlock-toast art.
- Variant tint must work in both CSS fallback and the normal mesh shader. Variant scale changes resolved art size while retaining the base foot anchor.
- Zero new Rose PNGs must still yield a complete labelled six-slot Rose Window. The title medallion is absent unless all eight Rose assets exist.
- npm test is green at every task boundary. Rebuild tracked dist only in the final task.
- Use UK English in code comments and player copy.
- The current main checkout contains unrelated changes in ui.js, styles.css, audio, SFX, and dist. At execution time first use superpowers:using-git-worktrees, create an isolated codex/ branch, stage exact paths, and never use git add -A.
- Commit commands below are execution checkpoints. Run them only after the owner authorises plan execution; never amend and never bypass hooks.

---

**Spec:** docs/superpowers/specs/2026-07-09-entrance-progressive-delivery-design.md
**Phase 1 hand-off:** docs/superpowers/plans/2026-07-09-entrance-progressive-delivery-phase1.md
**Phase 1 merge:** c2ad33e, Progressive delivery engine + entrance redesign (Phase 1) (#6)

## Scope check

Keep one Phase 2 plan. The variant resolver, shared quest ledger, six engine hooks, dawn ceremonies, Rose Window, and sealed-door reveal share one save shape and one testable progression chain; splitting them would create intermediate branches that cannot complete or display their own state safely.

## Execution preflight

After owner approval, use superpowers:using-git-worktrees to create the isolated codex/ execution branch. Materialise this approved plan at the same repository-relative path in that worktree with apply_patch before product edits, then include it in Task 1's exact-path commit. This authoring turn deliberately leaves the plan uncommitted and does not touch the user's unrelated dirty files.

## Decision lock

1. The six detailed quest sections are canonical: **2 Gates and 4 Trails**. The scope table's 3 Gates / 3 Trails wording is an editorial error corrected in Task 1.
2. Quest IDs are paleOnes, ownShade, usurper, eighthOmen, unreadablePage, and hollowLamplighter.
3. Pale Ones uses duskfang, drownedOne, and voidWisp as Act 1–3 bases. Before the Lens, the first ordinary fight of each run is a hidden Pale ambush until three motes; after the Lens, one Act 1 row-zero node and, on a 50% roll, one Act 2 row-zero node are visibly marked. Nine motes complete it.
4. Shade captures the aspect of the qualifying death, uses hero art with the existing shade layout/VFX anchor, and has three fixed tiers. Bequest payment waits until the duel is won.
5. The Usurper lantern costs 650 gold and appears in every Act 2+ merchant until bought. Buying it affects only that run.
6. The Eighth Omen is forced on the second run after arming if it did not occur on the first, then recurs at 1/3. Every non-boss combat receives one affix. Per-floor broken echoes are separate copy and never consume WHISPERS.
7. The Unreadable Page replaces the last choice in the second eligible card reward of a run. One winning run advances one page regardless of copies; five winning runs complete it.
8. Hollow appearance rolls 50% per run and is forced by the second eligible run. It triggers on the first unlit node, at most once per run. Prices are: next 3 earned embers, 160 gold, 12 Max HP while leaving at least 30, the tracked reversible Lamplighter boon receipt, then current HP down to 1.
9. The unique whisper prefix is shown in the Vigil; after line 24, line 24 repeats only on dawn screens and the log states that it repeats.
10. Six shards derive reveal act4. The sealed door is a non-path Act 3 summit emblem and one promise panel; it never changes nodeId or starts a fourth act.
11. The Rose art set is atomic: mural, frame, and six masks. The title miniature reuses it.
12. Phase 2 leaves the already-registered hidden-suite music cues unwired because audio is out of scope.
13. Existing Phase 1 veterans above ten wins do not receive five quests at once: after the Pale opener, exactly one dormant quest catches up on each future winning run.
14. The mural is generative art; the lead frame and six masks are deterministic derivatives of one coordinate system so the panes cannot drift out of alignment.

## File map

| File | Phase 2 responsibility |
|---|---|
| src/data.js | QUESTS, WHISPERS, VARIANTS, SHADE_KITS, Eighth Omen, Unreadable Page, all PROGRESSION tunables |
| src/vigil.js | In-place v2 hydration, injectable arming RNG, outcome commit, whisper/shard ledger, standing monument |
| src/engine.js | Quest snapshots/transitions, pending encounter validation, variant resolver, six hook implementations |
| src/ui.js | Variant presentation, quest event playback, special shop/Hollow surfaces, dawn ceremonies, Rose/door/title surfaces |
| src/mesh.js | Variant hue/saturation/brightness uniforms and debug proof |
| src/art.js | Page glyph plus structural mote, shard, Rose, broken-omen, and sealed-door SVG fallbacks |
| src/styles.css | Variant, dialogue, Rose, medallion, door, responsive, and reduced-motion presentation |
| test/test_engine.js | Table, hydration, state-machine, save, hook, and pacing gates |
| test/e2e/emberglass.spec.js | Rose disclosure, news, medallion, and door behaviour |
| test/e2e/battle.spec.js | Mesh-on / mesh-off variant parity |
| test/e2e/geometry.spec.js | Scaled-variant feet contract |
| test/e2e/stage.spec.js | Maximum Phase 2 profile overflow |
| test/e2e/visual.spec.js | Title medallion, Rose, and sealed-door baselines |
| tools/gen-emberglass-frame.py | Deterministic aligned frame and six alpha masks |
| tools/emberglass-pacing.mjs | Guided/unguided deterministic pacing simulation |
| docs/meta-art-bible.md | Mural, pane order, frame, masks, and fallback art direction |
| docs/README.md | Phase 2 plan/status index |
| dist/ | One final Vite rebuild only |

---

### Task 1: Freeze the Phase 2 data contract and authored copy

**Files:**
- Create/track: docs/superpowers/plans/2026-07-09-entrance-progressive-delivery-phase2.md (this approved plan)
- Modify: docs/superpowers/specs/2026-07-09-entrance-progressive-delivery-design.md:77-85
- Modify: src/data.js:1121-1156
- Test: test/test_engine.js (append after the Phase 1 progression-table block)

**Interfaces:**
- Produces: QUEST_IDS: string[], QUESTS: Record<string, QuestDefinition>, WHISPERS: string[24], SHADE_KITS, VARIANTS, and PROGRESSION.emberglass.
- Consumed by: every later task. No later task may invent player copy or a numeric quest rule.

- [ ] **Step 1: Write the failing table-contract test**

Extend the data import with QUEST_IDS, QUESTS, WHISPERS, SHADE_KITS, and VARIANTS, then add:

~~~js
{
  const ids = ['paleOnes', 'ownShade', 'usurper', 'eighthOmen', 'unreadablePage', 'hollowLamplighter'];
  assert.deepEqual(QUEST_IDS, ids);
  assert.deepEqual(Object.keys(QUESTS), ids);
  assert.equal(QUESTS.paleOnes.mode, 'Trail');
  assert.equal(QUESTS.ownShade.mode, 'Trail');
  assert.equal(QUESTS.usurper.mode, 'Gate');
  assert.equal(QUESTS.eighthOmen.mode, 'Gate');
  assert.equal(QUESTS.unreadablePage.mode, 'Trail');
  assert.equal(QUESTS.hollowLamplighter.mode, 'Trail');
  assert.equal(WHISPERS.length, 24);
  assert.equal(WHISPERS.at(-1), 'The climb continues.');
  assert.deepEqual(Object.keys(SHADE_KITS).sort(), ['ashwarden', 'duskblade']);
  for (const [id, v] of Object.entries(VARIANTS)) {
    assert.equal(v.id, id);
    assert.ok(v.base === 'hero' || ENEMIES[v.base], 'variant base exists: ' + id);
    assert.ok(v.tint && Number.isFinite(v.scale) && v.scale > 0);
    assert.ok(Number.isFinite(v.statMods.hpMult) && Number.isFinite(v.statMods.dmgMult));
    assert.ok(Array.isArray(v.dialogue));
  }
  const P = PROGRESSION.emberglass;
  assert.deepEqual(P.armWins, [2, 4, 6, 8, 10]);
  assert.equal(P.paleOnes.lensAt, 3);
  assert.equal(P.paleOnes.completeAt, 9);
  assert.equal(P.ownShade.completeAt, 3);
  assert.equal(P.usurper.price, 650);
  assert.equal(P.usurper.completeAt, 1);
  assert.equal(P.eighthOmen.guaranteeRuns, 2);
  assert.equal(P.eighthOmen.recurrenceChance, 1 / 3);
  assert.equal(P.eighthOmen.completeAt, 1);
  assert.equal(P.unreadablePage.completeAt, 5);
  assert.equal(P.hollowLamplighter.completeAt, 5);
}
~~~

- [ ] **Step 2: Run the test and verify the red state**

Run: npm test
Expected: FAIL because QUEST_IDS is not exported.

- [ ] **Step 3: Correct the taxonomy sentence in the spec**

Change the scope row to:

~~~markdown
| Emberglass chain | Six quests (**2 Gates, 4 Trails**), arming cadence, hint states, whispers, rose window UI, sealed summit door |
~~~

Do not change the six detailed quest headings or mechanics.

- [ ] **Step 4: Add the complete data contract**

Add this emberglass member inside the existing PROGRESSION object:

~~~js
emberglass: {
  armWins: [2, 4, 6, 8, 10],
  paleOnes: {
    lensAt: 3, completeAt: 9, hiddenPerRun: 1,
    markedAct1: 1, markedAct2Chance: 0.5,
  },
  ownShade: {
    minDeathAct: 1, completeAt: 3,
    tiers: [
      { hpMult: 1, dmgMult: 1, addStatuses: {}, scale: 1.05 },
      { hpMult: 1.25, dmgMult: 1.15, addStatuses: { str: 1 }, scale: 1.12 },
      { hpMult: 1.55, dmgMult: 1.3, addStatuses: { str: 2 }, scale: 1.2 },
    ],
  },
  usurper: { minShopAct: 1, referencePurse: 260, priceMultiplier: 2.5, price: 650, completeAt: 1 },
  eighthOmen: { guaranteeRuns: 2, recurrenceChance: 1 / 3, completeAt: 1 },
  unreadablePage: { offerRewardOrdinal: 2, completeAt: 5 },
  hollowLamplighter: {
    appearanceChance: 0.5, pityEligibleRuns: 2, maxMeetingsPerRun: 1,
    completeAt: 5, emberDebt: 3, gold: 160, maxHp: 12, minMaxHpAfter: 30, finalHp: 1,
  },
  variantStats: {
    pale: { hpMult: 1.18, dmgMult: 1.1, addStatuses: { str: 1 } },
    usurper: { hpMult: 1.25, dmgMult: 1.15, addStatuses: { str: 2 } },
  },
},
~~~

Append after POOL_GATE:

~~~js
export const QUEST_IDS = [
  'paleOnes', 'ownShade', 'usurper',
  'eighthOmen', 'unreadablePage', 'hollowLamplighter',
];

export const WHISPERS = [
  'There is a colour the Spire refuses to name.',
  'A pale hand has touched the dark side of the glass.',
  'Six spaces wait where no window stands.',
  'The dead climb twice: once in flesh, once in memory.',
  'A lantern without flame is still a key.',
  'Count the panes that do not catch the dawn.',
  'A page can be read only after it survives the summit.',
  'The eighth sign is not written among the seven.',
  'The gaunt keeper remembers the road you did not take.',
  'Pale motes gather like frost around a hidden seam.',
  'Your monument does not always lie down.',
  'The merchant keeps one cold thing beneath the counter.',
  'Broken glyphs are the shadow of a complete sentence.',
  'Five pages make a chapter; five prices make a confession.',
  'Three deaths will teach your shade to speak plainly.',
  'The Vigil has a window, though no wall holds it.',
  'Each shard lights one pane of Emberglass.',
  'The Pale Ones are not hunting you. They are pointing upward.',
  'The Sovereign is a mask worn below the final stair.',
  'When six panes burn, look beyond the summit.',
  'There is a sealed door above the crown.',
  'Its inscription has waited longer than the Vigil.',
  'Bring six shards to the Rose Window.',
  'The climb continues.',
];

export const QUESTS = {
  paleOnes: {
    name: 'The Pale Ones', mode: 'Trail', target: PROGRESSION.emberglass.paleOnes.completeAt,
    inscription: 'Hunt the Pale Ones. Gather nine motes from glass that has forgotten colour.',
    progress: ['No mote answers the Lens.', 'The first pale mote chills the lantern.'],
  },
  ownShade: {
    name: 'Your Own Shade', mode: 'Trail', target: PROGRESSION.emberglass.ownShade.completeAt,
    inscription: 'Defeat the self that remembers falling. Three shades must fall.',
    fragments: [
      'I remember the stone. You walked away before I stopped calling.',
      'Each climber leaves a shape behind. The Spire has learned to wear ours.',
      'Above the Sovereign there is no dawn — only a door pretending to be the sky.',
    ],
    final: 'We were never climbing out. We were carrying light to the lock.',
  },
  usurper: {
    name: 'The Usurper', mode: 'Gate', target: PROGRESSION.emberglass.usurper.completeAt,
    inscription: 'Carry the lantern with no flame to the summit and unmask the Usurper.',
    itemName: 'A Lantern with No Flame',
    itemText: 'Cold glass. No wick. The merchant will not say who left it.',
    poor: 'Cold goods, warm price. Come back carrying a dawn\'s worth of gold.',
    bought: 'Now the summit knows what you carry.',
    death: 'The mask is broken. Look above.',
  },
  eighthOmen: {
    name: 'The Eighth Omen', mode: 'Gate', target: PROGRESSION.emberglass.eighthOmen.completeAt,
    inscription: 'Reach dawn beneath the Eighth Omen.',
    resolved: 'THE EIGHTH OMEN WAS NEVER AN OMEN. IT WAS THE SHADOW OF A DOOR.',
    floorEchoes: [
      '// THE PANE WATCHES //', '// EIGHT IS NOT A NUMBER //',
      '// CARRY THE WRONG LIGHT UPWARD //', '// THE CROWN IS A MASK //',
    ],
  },
  unreadablePage: {
    name: 'The Unreadable Page', mode: 'Trail', target: PROGRESSION.emberglass.unreadablePage.completeAt,
    inscription: 'Win five dawns carrying the Unreadable Page.',
    pages: [
      'FIRST PAGE — Six panes were cut from one fire, then scattered before the first Vigil.',
      'SECOND PAGE — Pale figures carried the shards down so the thing above could not follow.',
      'THIRD PAGE — A climber died standing and saw a stair where the summit should have ended.',
      'FOURTH PAGE — The Sovereign took an empty lantern and wore a king\'s shape over the lock.',
      'FIFTH PAGE — The Rose Window is a map, not a memorial. Light it, then look above the crown.',
    ],
  },
  hollowLamplighter: {
    name: 'The Hollow Lamplighter', mode: 'Trail', target: PROGRESSION.emberglass.hollowLamplighter.completeAt,
    inscription: 'Pay the Hollow Lamplighter five prices along the Unlit Way.',
    meetings: [
      {
        ask: 'Your lantern is noisy. Give me the next three embers it catches.',
        accepted: 'The next three embers belong to the hollow lantern.',
        paid: 'Six panes were carried away from a window no wall could hold.',
        cannot: 'Promise the embers now. The lantern will pay before you do.',
      },
      {
        ask: 'Gold remembers every hand. Let one hundred and sixty pieces forget yours.',
        paid: 'The Pale Ones watch the paths that point above the crown.',
        cannot: 'Your purse is warm, but not warm enough.',
      },
      {
        ask: 'The Spire counts the vessel. Give me twelve measures of yours.',
        paid: 'Your standing dead have seen the stair above the Sovereign.',
        cannot: 'I will not hollow you below thirty. Return with a larger vessel.',
      },
      {
        ask: 'The first keeper gave you a boon. Give me the gift, not the gratitude.',
        paid: 'The empty lantern is the token that purchases an audience with the mask.',
        cannot: 'You have spent the gift already. Bring me one that is still yours.',
      },
      {
        ask: 'Last price: leave this lantern with one heartbeat. The rest belongs to the dark.',
        paid: 'Light the panes. The door will know you.',
        cannot: 'One heartbeat is enough. Refusal is the only poverty left.',
      },
    ],
  },
};

export const SHADE_KITS = {
  duskblade: {
    moves: {
      eclipse: { name: 'Remembered Eclipse', intent: 'attack_debuff', dmg: 12, fx: [{ who: 'player', id: 'vulnerable', n: 1 }] },
      chisel: { name: 'Remembered Chisel', intent: 'attack_debuff', dmg: 8, fx: [{ who: 'player', id: 'frail', n: 1 }] },
      spark: { name: 'First Spark, Last Light', intent: 'buff', block: 10, fx: [{ who: 'self', id: 'str', n: 2 }] },
    },
    ai: ({ turn }) => ['eclipse', 'chisel', 'spark'][(turn - 1) % 3],
  },
  ashwarden: {
    moves: {
      ashbite: { name: 'Remembered Ashbite', intent: 'attack_debuff', dmg: 10, fx: [{ who: 'player', id: 'poison', n: 2 }] },
      smother: { name: 'Remembered Smother', intent: 'attack_block', dmg: 6, block: 12 },
      ashfall: { name: 'First Ash, Last Breath', intent: 'debuff', fx: [{ who: 'player', id: 'poison', n: 5 }, { who: 'player', id: 'weak', n: 1 }] },
    },
    ai: ({ turn }) => ['ashbite', 'smother', 'ashfall'][(turn - 1) % 3],
  },
};

const pale = PROGRESSION.emberglass.variantStats.pale;
const shadeTier = PROGRESSION.emberglass.ownShade.tiers;
export const VARIANTS = {
  paleDuskfang: { id: 'paleDuskfang', base: 'duskfang', name: 'Pale Duskfang', tint: { hue: 165, saturation: 0.45, brightness: 1.18 }, scale: 1.08, statMods: pale, dialogue: [], drop: { quest: 'paleOnes', kind: 'paleMote', n: 1 } },
  paleDrownedOne: { id: 'paleDrownedOne', base: 'drownedOne', name: 'Pale Drowned One', tint: { hue: 120, saturation: 0.38, brightness: 1.2 }, scale: 1.1, statMods: pale, dialogue: [], drop: { quest: 'paleOnes', kind: 'paleMote', n: 1 } },
  paleVoidWisp: { id: 'paleVoidWisp', base: 'voidWisp', name: 'Pale Void Wisp', tint: { hue: -90, saturation: 0.32, brightness: 1.25 }, scale: 1.12, statMods: pale, dialogue: [], drop: { quest: 'paleOnes', kind: 'paleMote', n: 1 } },
  ownShade1: { id: 'ownShade1', base: 'hero', name: 'The Shade That Fell', tint: { hue: 35, saturation: 0.25, brightness: 0.62 }, scale: shadeTier[0].scale, statMods: shadeTier[0], dialogue: [QUESTS.ownShade.fragments[0]], drop: { quest: 'ownShade', kind: 'shadeMemory', n: 1 } },
  ownShade2: { id: 'ownShade2', base: 'hero', name: 'The Shade That Returned', tint: { hue: 20, saturation: 0.2, brightness: 0.55 }, scale: shadeTier[1].scale, statMods: shadeTier[1], dialogue: [QUESTS.ownShade.fragments[1]], drop: { quest: 'ownShade', kind: 'shadeMemory', n: 1 } },
  ownShade3: { id: 'ownShade3', base: 'hero', name: 'The Shade That Remembers', tint: { hue: 0, saturation: 0.16, brightness: 0.48 }, scale: shadeTier[2].scale, statMods: shadeTier[2], dialogue: [QUESTS.ownShade.fragments[2]], drop: { quest: 'ownShade', kind: 'shadeMemory', n: 1 } },
  usurpedSovereign: {
    id: 'usurpedSovereign', base: 'sovereign', name: 'The Usurper',
    tint: { hue: 105, saturation: 0.65, brightness: 1.08 }, scale: 1.15,
    statMods: PROGRESSION.emberglass.variantStats.usurper,
    dialogue: [
      '{aspect}. At last, the lantern brings me a name.',
      'The Sovereign was a mask. You have paid to meet the face beneath it.',
      'Break me, and the empty lantern will remember fire.',
    ],
    drop: { quest: 'usurper', kind: 'shard', n: 1 },
  },
};
~~~

The tint hue is a delta in degrees, not an absolute hue.

- [ ] **Step 5: Run the green gate and commit**

Run: npm test
Expected: PASS ending with unit checks passed and the 300-run Monte Carlo line.

~~~bash
git add docs/superpowers/plans/2026-07-09-entrance-progressive-delivery-phase2.md \
  docs/superpowers/specs/2026-07-09-entrance-progressive-delivery-design.md src/data.js test/test_engine.js
git commit -m "Define Emberglass quests variants and authored copy"
~~~


---

### Task 2: Hydrate v2 profiles and make run-end commits quest-aware

**Files:**
- Modify: src/data.js (add act4 reveal threshold)
- Modify: src/vigil.js:4-169
- Modify: test/test_engine.js (Phase 1 vigil/reveal blocks and new quest-ledger block)

**Interfaces:**
- Produces: _setRng(fn|null), questSnapshot(vigil), whisperAt(count), and commitRunEnd(run, outcome).
- commitRunEnd outcome is exactly win, death, or abandon.
- commitRunEnd returns { vigil, whisper, armed, completed, newShards }.
- Later tasks put run-local quest records in run.quests and earned-order IDs in run.questCompletions.

- [ ] **Step 1: Write failing hydration, arming, and exactly-once tests**

Extend the vigil import with _setRng, questSnapshot, and whisperAt. Add:

~~~js
{
  _setStore(null);
  _setRng(() => 0);
  let v = loadVigil();
  assert.deepEqual(Object.keys(v.quests), QUEST_IDS);
  assert.ok(QUEST_IDS.every((id) => v.quests[id].state === 'dormant'));

  v.deeds.wins = 1;
  saveVigil(v);
  v = loadVigil();
  assert.equal(v.quests.paleOnes.state, 'armed', 'Phase 1 v2 save hydrates Pale opener');
  assert.ok(QUEST_IDS.slice(1).every((id) => v.quests[id].state === 'dormant'));

  const won = newRun(401);
  won.quests = questSnapshot(v);
  commitRunToVigil(won, true); // deeds.wins is now 2
  let out = commitRunEnd(won, 'win');
  assert.equal(out.vigil.runsPlayed, 1);
  assert.equal(out.whisper, WHISPERS[0]);
  assert.deepEqual(out.armed, ['ownShade']);
  assert.equal(out.vigil.quests.ownShade.state, 'armed');
  assert.equal(out.vigil.whispers, 1);

  assert.deepEqual(commitRunEnd(won, 'win'), out, 'same run returns the cached result');

  const completed = newRun(402);
  completed.quests = questSnapshot(out.vigil);
  completed.quests.paleOnes = { state: 'complete', progress: 9, memory: {} };
  completed.questCompletions = ['paleOnes'];
  out = commitRunEnd(completed, 'death');
  assert.deepEqual(out.newShards, ['paleOnes']);
  assert.deepEqual(out.vigil.shards, ['paleOnes']);
  assert.equal(out.whisper, null, 'death does not consume a global whisper');

  const duplicate = newRun(403);
  duplicate.quests = questSnapshot(out.vigil);
  duplicate.questCompletions = ['paleOnes'];
  out = commitRunEnd(duplicate, 'abandon');
  assert.deepEqual(out.newShards, []);
  assert.deepEqual(out.vigil.shards, ['paleOnes']);

  assert.equal(whisperAt(1), WHISPERS[0]);
  assert.equal(whisperAt(999), WHISPERS.at(-1));

  _setStore(null);
  for (let win = 1; win <= 10; win++) {
    const before = loadVigil();
    const cadenceRun = newRun(4100 + win);
    cadenceRun.quests = questSnapshot(before);
    commitRunToVigil(cadenceRun, true);
    const cadence = commitRunEnd(cadenceRun, 'win').vigil;
    const expectedArmed = 1 + Math.floor(win / 2);
    assert.equal(QUEST_IDS.filter((id) => cadence.quests[id].state !== 'dormant').length,
      expectedArmed, 'one opener plus one quest per even win ' + win);
    if (win === 1) assert.equal(cadence.quests.ownShade.state, 'dormant');
  }
  assert.ok(QUEST_IDS.every((id) => loadVigil().quests[id].state !== 'dormant'),
    'all six quests are armed by win 10');

  const veteran = loadVigil();
  veteran.deeds.wins = 40;
  for (const id of QUEST_IDS.slice(1)) veteran.quests[id] = { state: 'dormant', progress: 0, memory: {} };
  saveVigil(veteran);
  const veteranWin = newRun(404);
  veteranWin.quests = questSnapshot(veteran);
  commitRunToVigil(veteranWin, true);
  out = commitRunEnd(veteranWin, 'win');
  assert.equal(out.armed.length, 1, 'post-Phase-1 veteran catches up one quest per future win');

  _setRng(null);
  _setStore(null);
}
~~~

Update every existing Phase 1 test assignment from v = commitRunEnd(run) to v = commitRunEnd(run, 'abandon').vigil. For the winning reveal test, call commitRunToVigil(run, true) followed by commitRunEnd(run, 'win'). Extend the reveal-table trigger assertion to accept trigger.shards alongside runsPlayed and wins.

- [ ] **Step 2: Run the test and verify the red state**

Run: npm test
Expected: FAIL because _setRng and questSnapshot are not exported.

- [ ] **Step 3: Add act4 and implement deterministic hydration**

Add this reveal threshold beside emberglass:

~~~js
act4: { shards: 6 }, // derived sealed-door surface, no playable act
~~~

Because QUEST_IDS is declared later, use the literal 6 in revealThresholds and assert it equals QUEST_IDS.length in the test. This is the only duplicated structural cardinality; the actual completion check reads the threshold.

In vigil.js import QUEST_IDS, QUESTS, WHISPERS, and PROGRESSION. Add:

~~~js
const QUEST_STATES = ['dormant', 'armed', 'revealed', 'complete'];
let armRng = Math.random;
export function _setRng(fn) { armRng = typeof fn === 'function' ? fn : Math.random; }

const blankQuest = () => ({ state: 'dormant', progress: 0, memory: {} });
const cloneQuest = (q) => ({
  state: QUEST_STATES.includes(q?.state) ? q.state : 'dormant',
  progress: Math.max(0, Math.floor(Number(q?.progress) || 0)),
  memory: q?.memory && typeof q.memory === 'object' && !Array.isArray(q.memory) ? { ...q.memory } : {},
});

function hydrateV2(v) {
  let changed = false;
  const quests = {};
  for (const id of QUEST_IDS) {
    quests[id] = cloneQuest(v.quests?.[id] || blankQuest());
    const normalisedProgress = quests[id].progress;
    quests[id].progress = Math.min(QUESTS[id].target, quests[id].progress);
    if (quests[id].progress !== normalisedProgress) changed = true;
    if (!v.quests?.[id]) changed = true;
  }
  v.quests = quests;
  if ((v.deeds?.wins || 0) >= 1 && v.quests.paleOnes.state === 'dormant') {
    v.quests.paleOnes.state = 'armed';
    v.news = true;
    changed = true;
  }
  v.shards = [...new Set((Array.isArray(v.shards) ? v.shards : []).filter((id) => QUEST_IDS.includes(id)))];
  v.whispers = Math.max(0, Math.floor(Number(v.whispers) || 0));
  return changed;
}

export function questSnapshot(vigil) {
  return Object.fromEntries(QUEST_IDS.map((id) => [id, cloneQuest(vigil.quests[id])]));
}

export function whisperAt(count) {
  if (count <= 0) return null;
  return WHISPERS[Math.min(count, WHISPERS.length) - 1];
}
~~~

Call hydrateV2(out) in loadVigil after the base shape is assembled. If it returns true, persist with getStore().setItem(KEY, JSON.stringify(out)); do not call migrateToV2 and never touch KEY_V1.

Extend isRevealed:

~~~js
if (t.shards != null && (vigil.shards || []).length < t.shards) return false;
~~~

- [ ] **Step 4: Replace commitRunEnd with the structured transaction**

Use this rank and merge contract:

~~~js
const STATE_RANK = { dormant: 0, armed: 1, revealed: 2, complete: 3 };

function mergeRunQuests(v, run) {
  const completed = [];
  for (const id of QUEST_IDS) {
    if (!run.quests?.[id]) continue;
    const from = cloneQuest(run.quests[id]);
    const to = v.quests[id];
    if (STATE_RANK[from.state] > STATE_RANK[to.state]) to.state = from.state;
    to.progress = Math.max(to.progress, from.progress);
    // A run receives the whole memory snapshot. Treat it as authoritative so
    // deleting dueIn or emberDebt survives the cross-run merge.
    to.memory = { ...from.memory };
    if (to.state === 'complete' && !v.shards.includes(id)) completed.push(id);
  }
  const ordered = [
    ...(run.questCompletions || []).filter((id) => completed.includes(id)),
    ...QUEST_IDS.filter((id) => completed.includes(id) && !(run.questCompletions || []).includes(id)),
  ];
  return ordered;
}

export function commitRunEnd(run, outcome = 'abandon') {
  if (!['win', 'death', 'abandon'].includes(outcome)) throw new Error('invalid run outcome: ' + outcome);
  if (run.runEndResult) return run.runEndResult;
  run.runEndCommitted = true;

  const v = loadVigil();
  const beforeRevealCount = revealSnapshot(v).length;
  const before = JSON.stringify({
    quests: v.quests, shards: v.shards, unlocks: v.unlocks, whispers: v.whispers,
  });
  const completed = mergeRunQuests(v, run);
  for (const id of completed) v.shards.push(id);
  for (const id of run.unlocks || []) if (!v.unlocks.includes(id)) v.unlocks.push(id);

  v.runsPlayed++;
  const armed = [];
  let whisper = null;
  if (outcome === 'win') {
    v.whispers++;
    whisper = whisperAt(v.whispers);
    const wins = v.deeds.wins || 0;
    const dormant = QUEST_IDS.slice(1).filter((id) => v.quests[id].state === 'dormant');
    const armWins = PROGRESSION.emberglass.armWins;
    const catchUp = wins > armWins.at(-1) && dormant.length > 0;
    if (armWins.includes(wins) || catchUp) {
      if (dormant.length) {
        const id = dormant[Math.min(dormant.length - 1, Math.floor(armRng() * dormant.length))];
        v.quests[id].state = 'armed';
        if (id === 'eighthOmen') v.quests[id].memory.dueIn = PROGRESSION.emberglass.eighthOmen.guaranteeRuns;
        armed.push(id);
      }
    }
  }

  const after = JSON.stringify({
    quests: v.quests, shards: v.shards, unlocks: v.unlocks, whispers: v.whispers,
  });
  const revealLanded = revealSnapshot(v).length > beforeRevealCount;
  if (before !== after || revealLanded) v.news = true;
  saveVigil(v);
  run.runEndResult = { vigil: v, whisper, armed, completed, newShards: completed };
  return run.runEndResult;
}
~~~

The beforeRevealCount line and revealLanded comparison are both inside the function, preventing every old profile from pulsing forever.
The authoritative memory replacement is intentional: run snapshots are complete, not sparse patches. It is what makes `delete q.memory.dueIn` and `delete q.memory.emberDebt` persist; a run with no record for an ID is skipped and cannot wipe a newer Vigil record.

- [ ] **Step 5: Run the green gate and commit**

Run: npm test
Expected: PASS, including Phase 1 ladder tests updated for the structured return.

~~~bash
git add src/data.js src/vigil.js test/test_engine.js
git commit -m "Hydrate Emberglass ledgers and arm quests on run end"
~~~

---

### Task 3: Snapshot quest state into runs and validate pending variants

**Files:**
- Modify: src/engine.js:2-47, 1176-1204
- Modify: src/ui.js:9, 636-645, 725-741, 978-984, 3409-3432
- Test: test/test_engine.js

**Interfaces:**
- Produces: questRecord(run,id), revealQuest(run,id,queue), advanceQuest(run,id,n,queue), setPendingEncounter(run,kind,enemyIds,questId), and clearPendingEncounter(run).
- newRun opts add quests and shards.
- run.pendingEnemyIds stores exact base or VARIANTS IDs. run.pendingQuestId is null or a QUEST_IDS value.

- [ ] **Step 1: Write failing run-snapshot and save-validation tests**

~~~js
{
  const q = Object.fromEntries(QUEST_IDS.map((id) => [id, { state: id === 'paleOnes' ? 'armed' : 'dormant', progress: 0, memory: {} }]));
  const run = newRun(410, { quests: q, shards: ['paleOnes'] });
  q.paleOnes.state = 'complete';
  assert.equal(run.quests.paleOnes.state, 'armed', 'run owns a deep snapshot');
  assert.deepEqual(run.shards, ['paleOnes']);

  const events = [];
  assert.equal(revealQuest(run, 'paleOnes', events).state, 'revealed');
  assert.equal(events[0].t, 'questReveal');
  advanceQuest(run, 'paleOnes', 9, events);
  assert.equal(run.quests.paleOnes.state, 'complete');
  assert.deepEqual(run.questCompletions, ['paleOnes']);
  advanceQuest(run, 'paleOnes', 1, events);
  assert.deepEqual(run.questCompletions, ['paleOnes'], 'completion emitted once');

  setPendingEncounter(run, 'monster', ['paleDuskfang'], 'paleOnes');
  assert.deepEqual(run.pendingEnemyIds, ['paleDuskfang']);
  assert.equal(run.pendingQuestId, 'paleOnes');
  clearPendingEncounter(run);
  assert.equal(run.pendingCombat, null);
  assert.equal(run.pendingEnemyIds, null);
  assert.equal(run.pendingQuestId, null);
}
~~~

Inside the existing temporary-localStorage try block, add this exact save matrix:

~~~js
  const saveQuests = Object.fromEntries(QUEST_IDS.map((id) => [id, {
    state: id === 'paleOnes' ? 'armed' : 'dormant', progress: 0, memory: {},
  }]));
  const pending = newRun(411, { quests: saveQuests });
  setPendingEncounter(pending, 'monster', ['paleDuskfang'], 'paleOnes');
  saveRun(pending);
  assert.deepEqual(loadRun().pendingEnemyIds, ['paleDuskfang']);

  const rejectSaved = (label, mutate) => {
    const bad = newRun(412, { quests: saveQuests });
    mutate(bad);
    saveRun(bad);
    assert.equal(loadRun(), null, label);
  };
  rejectSaved('unknown variant', (r) => setPendingEncounter(r, 'monster', ['paleUnknown'], 'paleOnes'));
  rejectSaved('unknown quest record', (r) => { r.quests.unknown = { state: 'armed', progress: 0, memory: {} }; });
  rejectSaved('invalid quest state', (r) => { r.quests.paleOnes.state = 'waiting'; });
  rejectSaved('negative quest progress', (r) => { r.quests.paleOnes.progress = -1; });
  rejectSaved('unknown shard', (r) => { r.shards = ['unknown']; });
  rejectSaved('unknown scratch key', (r) => { r.questScratch.unknown = {}; });
  rejectSaved('malformed scratch', (r) => { r.questScratch.paleOnes = { hiddenDue: 'yes' }; });
  rejectSaved('unknown completion', (r) => { r.questCompletions = ['unknown']; });
  rejectSaved('unknown end event', (r) => { r.endQueue = [{ t: 'mystery' }]; });
  rejectSaved('unknown marked-node variant', (r) => { r.map.nodes[0].questVariantId = 'paleUnknown'; });
~~~

- [ ] **Step 2: Run the test and verify the red state**

Run: npm test
Expected: FAIL because revealQuest is not exported.

- [ ] **Step 3: Add the run-local quest helpers**

Import QUEST_IDS, QUESTS, and VARIANTS. In newRun add:

~~~js
quests: opts.quests
  ? Object.fromEntries(QUEST_IDS.map((id) => [id, {
      state: opts.quests[id]?.state || 'dormant',
      progress: Math.min(QUESTS[id].target,
        Math.max(0, Math.floor(Number(opts.quests[id]?.progress) || 0))),
      memory: { ...(opts.quests[id]?.memory || {}) },
    }]))
  : {},
shards: [...(opts.shards || [])],
questScratch: {},
questCompletions: [],
endQueue: [],
pendingCombat: null,
pendingEnemyIds: null,
pendingQuestId: null,
~~~

Add:

~~~js
export function questRecord(run, id) {
  return run.quests && QUEST_IDS.includes(id) ? run.quests[id] || null : null;
}

export function revealQuest(run, id, queue = run.endQueue) {
  const q = questRecord(run, id);
  if (!q || q.state === 'dormant') return q;
  if (q.state === 'armed') {
    q.state = 'revealed';
    queue?.push({ t: 'questReveal', id });
  }
  return q;
}

export function advanceQuest(run, id, n = 1, queue = run.endQueue) {
  const q = revealQuest(run, id, queue);
  if (!q || q.state === 'complete' || n <= 0) return q;
  q.progress = Math.min(QUESTS[id].target, q.progress + n);
  queue?.push({ t: 'questProgress', id, progress: q.progress, target: QUESTS[id].target });
  if (q.progress >= QUESTS[id].target) {
    q.state = 'complete';
    if (!run.questCompletions.includes(id)) run.questCompletions.push(id);
    queue?.push({ t: 'questComplete', id });
  }
  return q;
}

export function setPendingEncounter(run, kind, enemyIds, questId = null) {
  run.pendingCombat = kind;
  run.pendingEnemyIds = [...enemyIds];
  run.pendingQuestId = questId ??
    enemyIds.map((id) => VARIANTS[id]?.drop?.quest).find((id) => QUEST_IDS.includes(id)) ?? null;
}

export function clearPendingEncounter(run) {
  run.pendingCombat = null;
  run.pendingEnemyIds = null;
  run.pendingQuestId = null;
}
~~~

- [ ] **Step 4: Extend loadRun and live UI wiring**

Self-heal additive fields before validation so a pre-Phase-2 v2 run remains resumable:

~~~js
run.quests ??= {};
run.shards ??= [];
run.questScratch ??= {};
run.questCompletions ??= [];
run.endQueue ??= [];
run.pendingEnemyIds ??= null;
run.pendingQuestId ??= null;
~~~

Then validate:

~~~js
const plainObject = (x) => x && typeof x === 'object' && !Array.isArray(x);
const onlyKeys = (x, keys) => Object.keys(x).every((k) => keys.includes(k));
const optionalBool = (x, k) => x[k] == null || typeof x[k] === 'boolean';
const validBequest = (b) => b == null || (plainObject(b) && (
  (b.kind === 'card' && !!CARDS[b.id] && optionalBool(b, 'up')) ||
  (b.kind === 'relic' && !!RELICS[b.id]) ||
  (b.kind === 'gold' && Number.isFinite(b.amount) && b.amount >= 0)
));
const validMemory = (id, m) => {
  if (!plainObject(m)) return false;
  if (id === 'eighthOmen') return onlyKeys(m, ['dueIn', 'seen']) &&
    (m.dueIn == null || m.dueIn === 1 || m.dueIn === 2) && optionalBool(m, 'seen');
  if (id === 'hollowLamplighter') return onlyKeys(m, ['eligibleMisses', 'emberDebt']) &&
    (m.eligibleMisses == null || (Number.isInteger(m.eligibleMisses) && m.eligibleMisses >= 0)) &&
    (m.emberDebt == null || (Number.isInteger(m.emberDebt) && m.emberDebt >= 1 && m.emberDebt <= 3));
  return onlyKeys(m, []);
};
const validQuest = (id, q) =>
  plainObject(q) &&
  ['dormant', 'armed', 'revealed', 'complete'].includes(q.state) &&
  Number.isInteger(q.progress) && q.progress >= 0 && q.progress <= QUESTS[id].target &&
  validMemory(id, q.memory);
const validEnemyId = (id) => !!ENEMIES[id] || !!VARIANTS[id];

const validScratch = (scratch) => {
  if (!plainObject(scratch) || Object.keys(scratch).some((id) => !QUEST_IDS.includes(id))) return false;
  for (const [id, x] of Object.entries(scratch)) {
    if (!plainObject(x)) return false;
    if (id === 'paleOnes' && !(onlyKeys(x, ['hiddenDue', 'markedAct2']) && optionalBool(x, 'hiddenDue') && optionalBool(x, 'markedAct2'))) return false;
    if (id === 'usurper' && !(onlyKeys(x, ['bought']) && optionalBool(x, 'bought'))) return false;
    if (id === 'eighthOmen' && !(onlyKeys(x, ['active']) && optionalBool(x, 'active'))) return false;
    if (id === 'unreadablePage' && !(onlyKeys(x, ['rewardOrdinal', 'offered']) &&
      (x.rewardOrdinal == null || (Number.isInteger(x.rewardOrdinal) && x.rewardOrdinal >= 0)) && optionalBool(x, 'offered'))) return false;
    if (id === 'hollowLamplighter' && !(onlyKeys(x, ['due', 'met', 'debtActive']) &&
      optionalBool(x, 'due') && optionalBool(x, 'met') && optionalBool(x, 'debtActive'))) return false;
    if (id === 'ownShade') {
      const fall = x.fall;
      const validFall = fall == null || (plainObject(fall) && onlyKeys(fall, ['act', 'row', 'shadeAspect', 'bequest']) &&
        Number.isInteger(fall.act) && fall.act >= 0 && fall.act <= 2 && Number.isInteger(fall.row) && fall.row >= 0 &&
        (fall.shadeAspect === 0 || fall.shadeAspect === 1) && validBequest(fall.bequest));
      if (!(onlyKeys(x, ['fall', 'pendingBequest']) && validFall && validBequest(x.pendingBequest))) return false;
    }
  }
  return true;
};

const validEndEvent = (e) => {
  if (!plainObject(e) || typeof e.t !== 'string') return false;
  if (['questReveal', 'questComplete'].includes(e.t)) return QUEST_IDS.includes(e.id);
  if (e.t === 'questProgress') return QUEST_IDS.includes(e.id) && Number.isFinite(e.progress) && Number.isFinite(e.target);
  if (e.t === 'questUnlock') return e.id === 'insight:witchlightLens';
  if (e.t === 'pageRead') return Number.isInteger(e.index) && e.index >= 1 && e.index <= 5 && typeof e.text === 'string';
  if (e.t === 'eighthResolved' || e.t === 'shadeResolved') return typeof e.text === 'string';
  return false;
};

if (!plainObject(run.quests)) return null;
if (Object.keys(run.quests).some((id) => !QUEST_IDS.includes(id))) return null;
if (Object.entries(run.quests).some(([id, q]) => !validQuest(id, q))) return null;
if (!(Array.isArray(run.shards) && run.shards.every((id) => QUEST_IDS.includes(id)) && new Set(run.shards).size === run.shards.length)) return null;
if (!validScratch(run.questScratch)) return null;
if (!(Array.isArray(run.questCompletions) && run.questCompletions.every((id) => QUEST_IDS.includes(id)) && new Set(run.questCompletions).size === run.questCompletions.length)) return null;
if (!(Array.isArray(run.endQueue) && run.endQueue.every(validEndEvent))) return null;
if (run.pendingCombat != null && !['monster', 'elite', 'boss'].includes(run.pendingCombat)) return null;
if (run.pendingEnemyIds != null && !(Array.isArray(run.pendingEnemyIds) && run.pendingEnemyIds.length && run.pendingEnemyIds.every(validEnemyId))) return null;
if (run.pendingQuestId != null && !QUEST_IDS.includes(run.pendingQuestId)) return null;
if (run.pendingEnemyIds != null && run.pendingCombat == null) return null;
if (run.pendingQuestId != null && run.pendingCombat == null) return null;
if (!run.map.nodes.every((n) =>
  (n.questVariantId == null || !!VARIANTS[n.questVariantId]) &&
  (n.questMarked == null || typeof n.questMarked === 'boolean'))) return null;
~~~

In renderEmbark pass quests: questSnapshot(v) and shards: v.shards. Import questSnapshot from vigil.js.

Replace every combat start with exact pending IDs:

~~~js
const ids = run.pendingEnemyIds || E.rollEncounter(run, run.pendingCombat, node ? node.row : 5, node);
if (!run.pendingEnemyIds) E.setPendingEncounter(run, run.pendingCombat, ids, run.pendingQuestId);
startCombatUI(ids, run.pendingCombat);
~~~

When entering a new combat, roll once, call setPendingEncounter, save, then start it. On victory call clearPendingEncounter.

Update every run-end call:
- confirmed abandon: commitRunEnd(run, 'abandon')
- final victory: commitRunEnd(run, 'win')
- defeat: commitRunEnd(run, 'death')

- [ ] **Step 5: Run gates and commit**

Run: npm test && npm run build -- --outDir /tmp/spirebound-phase2-build --emptyOutDir
Expected: both PASS; no undefined import or Vite error.

~~~bash
git add src/engine.js src/ui.js test/test_engine.js
git commit -m "Persist quest snapshots and exact pending encounters"
~~~

---

### Task 4: Build the variant resolver and mesh-safe presentation

**Files:**
- Modify: src/engine.js:2, 424-511
- Modify: src/ui.js:1009-1122, 1186-1229, 2320-2421, 3315-3333, 4131-4200
- Modify: src/mesh.js:195-230, 280-315, 1117-1135, 1241-1250
- Modify: src/styles.css:650-725, 1322-1353
- Test: test/test_engine.js
- Test: test/e2e/battle.spec.js

**Interfaces:**
- Produces: makeVariant(baseDef,variantDef), resolveCombatant(run,id), cb.enemies[].variantId, cb.enemies[].def, and cb.enemies[].presentation.
- presentation is { artCategory, artId, layoutKey, kind, hue, tint, scale }.
- cb.enemies[].key remains an existing ENEMIES key. For hero shades it is shade; variantId carries ownShade1/2/3.

- [ ] **Step 1: Write failing pure variant tests**

~~~js
{
  const base = {
    name: 'Base', hp: [100, 120], facets: 4, art: { kind: 'beast', hue: 20, size: 1 },
    startStatus: { thorns: 1 },
    moves: { hit: { name: 'Hit', intent: 'attack', dmg: 10 }, guard: { name: 'Guard', intent: 'block', block: 8 } },
    ai: () => 'hit',
  };
  const variant = {
    id: 'testVariant', base: 'base', name: 'Wrong Glass',
    tint: { hue: 90, saturation: 0.5, brightness: 1.1 }, scale: 1.2,
    statMods: { hpMult: 1.25, dmgMult: 1.3, addStatuses: { str: 2 } },
    dialogue: ['Speak.'], drop: null,
  };
  const made = makeVariant(base, variant);
  assert.deepEqual(made.hp, [125, 150]);
  assert.equal(made.moves.hit.dmg, 13);
  assert.equal(made.moves.guard.block, 8, 'damage scaling does not change block');
  assert.deepEqual(made.startStatus, { thorns: 1, str: 2 });
  assert.equal(base.moves.hit.dmg, 10, 'base definition not mutated');

  const run = newRun(420);
  const cb = startCombat(run, ['paleDuskfang']);
  assert.equal(cb.enemies[0].key, 'duskfang');
  assert.equal(cb.enemies[0].variantId, 'paleDuskfang');
  assert.equal(cb.enemies[0].presentation.artId, 'duskfang');
  assert.ok(cb.enemies[0].maxHp > 30);
}
~~~

- [ ] **Step 2: Run the test and verify the red state**

Run: npm test
Expected: FAIL because makeVariant is not exported.

- [ ] **Step 3: Implement the pure resolver**

~~~js
const scaleMoveDamage = (move, mult) => ({
  ...move,
  ...(move.dmg == null ? {} : { dmg: Math.max(0, Math.round(move.dmg * mult)) }),
});

export function makeVariant(baseDef, variantDef) {
  const mods = variantDef.statMods || {};
  const hpMult = mods.hpMult ?? 1;
  const dmgMult = mods.dmgMult ?? 1;
  return {
    ...baseDef,
    name: variantDef.name,
    hp: baseDef.hp.map((n) => Math.max(1, Math.round(n * hpMult))),
    moves: Object.fromEntries(Object.entries(baseDef.moves).map(([id, move]) => [id, scaleMoveDamage(move, dmgMult)])),
    startStatus: { ...(baseDef.startStatus || {}), ...(mods.addStatuses || {}) },
    variantId: variantDef.id,
    dialogue: [...variantDef.dialogue],
    drop: variantDef.drop,
  };
}

function heroShadeBase(run) {
  const aspectIndex = run.monument?.shadeAspect ?? run.aspect ?? 0;
  const aspect = ASPECTS[aspectIndex] || ASPECTS[0];
  const kit = SHADE_KITS[aspect.id];
  return {
    name: aspect.name + ' Shade', hp: [110, 110], facets: 6, boss: true,
    art: ENEMIES.shade.art, moves: kit.moves, ai: kit.ai,
    presentation: {
      artCategory: 'heroes', artId: aspect.id, layoutKey: 'shade',
      kind: 'humanoid', hue: aspect.hue || 0,
    },
  };
}

export function resolveCombatant(run, id) {
  const variant = VARIANTS[id];
  if (!variant) {
    const def = ENEMIES[id];
    return {
      def, baseKey: id, variantId: null,
      presentation: {
        artCategory: 'enemies', artId: id, layoutKey: id,
        kind: def.art.kind, hue: def.art.hue, tint: null, scale: 1,
      },
    };
  }
  const base = variant.base === 'hero' ? heroShadeBase(run) : ENEMIES[variant.base];
  const def = makeVariant(base, variant);
  const basePresentation = base.presentation || {
    artCategory: 'enemies', artId: variant.base, layoutKey: variant.base,
    kind: base.art.kind, hue: base.art.hue,
  };
  return {
    def, baseKey: variant.base === 'hero' ? 'shade' : variant.base, variantId: variant.id,
    presentation: { ...basePresentation, tint: variant.tint, scale: variant.scale },
  };
}
~~~

In startCombat resolve each requested ID once. Store key: resolved.baseKey, variantId, def, and presentation. computeIntents calls e.def.ai; enemyMove returns e.def.moves[e.moveKey]. Queue bossIntro first and then one variantDialogue event per dialogue line, replacing {aspect} with ASPECTS[run.aspect].name without the leading “The ”.

- [ ] **Step 4: Make every visual path consume presentation**

Use one helper in ui.js:

~~~js
const combatantView = (en) => {
  const p = en.presentation || {};
  return {
    artCategory: p.artCategory || 'enemies',
    artId: p.artId || en.key,
    layoutKey: p.layoutKey || en.key,
    kind: p.kind || ENEMIES[en.key].art.kind,
    hue: p.hue ?? ENEMIES[en.key].art.hue,
    tint: p.tint || null,
    scale: p.scale || 1,
  };
};
~~~

Apply it at every audited direct lookup:
- combat DOM art/name: ui.js 1090-1103
- battlefield size and foot anchor: 1214-1225
- aim metadata: ui.js:1894
- rig/shadow metadata: 2397-2400
- mesh binding: 2415-2420
- move/VFX choreography: 3315-3333

Compute size as base battlefield size multiplied by view.scale; continue passing view.layoutKey to bfEnemyFootX, bfEnemyFootY, bfEnemyZOrder, and char metadata. Put data-base-id, data-variant-id, and data-art-id on .enemy. CSS fallback applies:

~~~js
if (view.tint) {
  box.style.setProperty('--variant-hue', view.tint.hue + 'deg');
  box.style.setProperty('--variant-sat', String(view.tint.saturation));
  box.style.setProperty('--variant-bright', String(view.tint.brightness));
}
~~~

~~~css
.enemy[data-variant-id] .enemy-sprite {
  filter: hue-rotate(var(--variant-hue, 0deg))
          saturate(var(--variant-sat, 1))
          brightness(var(--variant-bright, 1));
}
.variant-dialogue {
  max-width: min(660px, 86cqw);
  border-color: rgba(210, 226, 255, 0.48);
  background: rgba(8, 10, 18, 0.94);
}
~~~

Do not use transform: scale on the sprite.

Replace the immediate boss banner in startCombatUI with queue event handling:
- bossIntro uses the existing boss-banner markup and 2100 ms timing.
- variantDialogue uses escHtml(ev.text), the class turn-banner variant-dialogue, and 1800 ms.
- REDUCED uses 80 ms and no keyframe.

Extend __probe.state enemies with key, variantId, artId, hp, maxHp, and block.

- [ ] **Step 5: Carry tint through the mesh shader and prove both modes**

Add BODY_FRAG uniforms uHue, uSaturation, and uBrightness. Place this helper at shader-global scope after the uniforms and before `void main()`:

~~~glsl
vec3 hueRotate(vec3 c, float a) {
  const mat3 toYiq = mat3(
    0.299, 0.587, 0.114,
    0.596, -0.275, -0.321,
    0.212, -0.523, 0.311
  );
  const mat3 toRgb = mat3(
    1.0, 0.956, 0.621,
    1.0, -0.272, -0.647,
    1.0, -1.106, 1.703
  );
  vec3 yiq = toYiq * c;
  float h = atan(yiq.z, yiq.y) + a;
  float chroma = length(yiq.yz) * uSaturation;
  return toRgb * vec3(yiq.x, chroma * cos(h), chroma * sin(h));
}
~~~

Inside `main()`, after the base texture sample and before `gl_FragColor`, add:

~~~glsl
base.rgb = clamp(hueRotate(base.rgb, uHue) * uBrightness, 0.0, 1.0);
~~~

Initialise makePlane's body uniforms with `uHue:{value:0}`, `uSaturation:{value:1}`, and `uBrightness:{value:1}`. Change meshBind's entry JSDoc and loop to accept `variantId` and `tint`, then immediately after makePlane add:

~~~js
p.variantId = variantId ?? null;
p.mat.uniforms.uHue.value = THREE.MathUtils.degToRad(tint?.hue || 0);
p.mat.uniforms.uSaturation.value = tint?.saturation ?? 1;
p.mat.uniforms.uBrightness.value = tint?.brightness ?? 1;
~~~

Append this exact field to meshDebug's return object:

~~~js
variants: planes.map((p) => ({
  id: p.variantId,
  hue: p.mat.uniforms.uHue.value,
  saturation: p.mat.uniforms.uSaturation.value,
  brightness: p.mat.uniforms.uBrightness.value,
})),
~~~

Add these executable cases to battle.spec.js:

~~~js
async function startShadeAndSeeDialogue(page, query) {
  await boot(page, { query });
  const dialogue = page.locator('.variant-dialogue');
  await page.evaluate(() => window.spirebound.startCombatUI(['ownShade1'], 'monster'));
  await expect(dialogue).toContainText('I remember the stone', { timeout: 7000 });
  await settle(page);
}

test('variant tint and identity reach the live mesh', async ({ page }) => {
  const errors = collectErrors(page);
  await startShadeAndSeeDialogue(page, 'mesh=1');
  await expectMeshLive(page);
  const result = await page.evaluate(() => ({
    enemy: window.__probe.state().enemies[0],
    mesh: window.spirebound.meshDebug().variants.find((v) => v.id === 'ownShade1'),
  }));
  expect(result.enemy).toMatchObject({ key: 'shade', variantId: 'ownShade1', artId: 'duskblade', maxHp: 110 });
  expect(result.mesh).toBeTruthy();
  expect(Math.abs(result.mesh.hue)).toBeGreaterThan(0.01);
  expect(result.mesh.saturation).toBeCloseTo(0.25, 5);
  await expect(page.locator('.enemy[data-base-id="shade"][data-variant-id="ownShade1"][data-art-id="duskblade"]')).toHaveCount(1);
  await expectInvariants(page, 'shade mesh variant');
  expectNoErrors(errors, 'shade mesh variant');
});

test('variant CSS fallback matches mesh-off identity and stats', async ({ page }) => {
  const errors = collectErrors(page);
  await startShadeAndSeeDialogue(page, 'mesh=0');
  const enemy = await probeState(page).then((s) => s.enemies[0]);
  expect(enemy).toMatchObject({ key: 'shade', variantId: 'ownShade1', artId: 'duskblade', maxHp: 110 });
  await expect(page.locator('.enemy[data-variant-id="ownShade1"] .name')).toContainText('THE SHADE THAT FELL');
  const filter = await page.locator('.enemy[data-variant-id="ownShade1"] .enemy-sprite')
    .evaluate((el) => getComputedStyle(el).filter);
  expect(filter).not.toBe('none');
  expect((await page.evaluate(() => window.spirebound.meshDebug().planes))).toBe(0);
  await expectInvariants(page, 'shade CSS variant');
  expectNoErrors(errors, 'shade CSS variant');
});
~~~

Run:

~~~bash
npm test
npx playwright test test/e2e/battle.spec.js --project=desktop --reporter=list
npm run build -- --outDir /tmp/spirebound-phase2-build --emptyOutDir
~~~

Expected: all PASS.

~~~bash
git add src/engine.js src/ui.js src/mesh.js src/styles.css test/test_engine.js test/e2e/battle.spec.js
git commit -m "Add mesh-safe enemy variant presentation"
~~~

---

### Task 5: Implement the Pale Ones Trail and Witchlight Lens

**Files:**
- Modify: src/engine.js (newRun, genMap, rollEncounter, startCombat, onEnemyDeath)
- Modify: src/ui.js (map nodes and encounter call)
- Modify: src/styles.css (marked node)
- Test: test/test_engine.js

**Interfaces:**
- Consumes: questRecord/revealQuest/advanceQuest, VARIANTS, run.unlocks.
- Produces: preparePaleRun(run), paleVariantForAct(act), node.questVariantId, and unlock token insight:witchlightLens.

- [ ] **Step 1: Write failing deterministic Trail tests**

~~~js
{
  const quests = Object.fromEntries(QUEST_IDS.map((id) => [id, { state: id === 'paleOnes' ? 'armed' : 'dormant', progress: 0, memory: {} }]));
  const run = newRun(430, { quests, unlocks: [] });
  const first = rollEncounter(run, 'monster', 0, run.map.nodes.find((n) => n.row === 0));
  assert.deepEqual(first, ['paleDuskfang'], 'first ordinary fight is hidden guaranteed ambush');
  assert.notDeepEqual(rollEncounter(run, 'monster', 1), ['paleDuskfang'], 'only one hidden ambush per run');

  const cb = startCombat(run, ['paleDuskfang']);
  cb.enemies[0].hp = 1;
  forceHand(run, cb, ['strike']);
  cb.player.energy = 3;
  playCard(run, cb, cb.hand[0].uid, 0);
  assert.equal(run.quests.paleOnes.progress, 1);
  assert.equal(run.quests.paleOnes.state, 'revealed');

  run.quests.paleOnes.progress = 2;
  const cb3 = startCombat(run, ['paleDuskfang']);
  cb3.enemies[0].hp = 1;
  forceHand(run, cb3, ['strike']);
  cb3.player.energy = 3;
  playCard(run, cb3, cb3.hand[0].uid, 0);
  assert.ok(run.unlocks.includes('insight:witchlightLens'));

  const marked = newRun(431, { quests: run.quests, unlocks: run.unlocks });
  assert.equal(marked.map.nodes.filter((n) => n.questVariantId).length, 1);
  const mark = marked.map.nodes.find((n) => n.questVariantId);
  assert.equal(mark.row, 0);
  assert.equal(mark.questVariantId, 'paleDuskfang');

  run.quests.paleOnes.progress = 8;
  const cb9 = startCombat(run, ['paleDuskfang']);
  cb9.enemies[0].hp = 1;
  forceHand(run, cb9, ['strike']);
  cb9.player.energy = 3;
  playCard(run, cb9, cb9.hand[0].uid, 0);
  assert.equal(run.quests.paleOnes.state, 'complete');
  assert.deepEqual(run.questCompletions, ['paleOnes']);
}
~~~

Use the forceHand plus playCard sequence shown above; do not export hitEnemy solely for tests.

- [ ] **Step 2: Run red**

Run: npm test
Expected: FAIL because rollEncounter returns a normal encounter.

- [ ] **Step 3: Implement the hidden and marked spawn contract**

~~~js
const PALE_BY_ACT = ['paleDuskfang', 'paleDrownedOne', 'paleVoidWisp'];
export const paleVariantForAct = (act) => PALE_BY_ACT[clamp(act | 0, 0, 2)];

function preparePaleRun(run) {
  const q = questRecord(run, 'paleOnes');
  if (!q || !['armed', 'revealed'].includes(q.state)) return;
  const lens = run.unlocks.includes('insight:witchlightLens');
  run.questScratch.paleOnes = {
    hiddenDue: !lens && q.progress < PROGRESSION.emberglass.paleOnes.lensAt,
    markedAct2: lens && runRng(run)() < PROGRESSION.emberglass.paleOnes.markedAct2Chance,
  };
}
~~~

Call preparePaleRun after the base run object exists and before genMap. In genMap, if the Lens is present:
- Act 0: mark one row-zero monster node.
- Act 1: mark one row-zero monster only when markedAct2 is true.
- Act 2: do not add another; the contract is one or two per whole run.
- Set questVariantId and questMarked; do not change node.type.

In rollEncounter(run,type,row,node):
- if node.questVariantId exists, return [node.questVariantId].
- otherwise, for type monster only, consume hiddenDue and return [paleVariantForAct(run.act)].
- hidden nodes expose no class, tooltip, or different map glyph.

- [ ] **Step 4: Implement contact, drops, Lens, and map projection**

When startCombat resolves a variant whose drop.quest is paleOnes, call revealQuest(run,'paleOnes',cb.queue). In onEnemyDeath insert this block after kill stats and before the existing all-enemies-dead winCombat early return, so the last enemy's drop cannot be skipped:

~~~js
if (e.def.drop?.quest === 'paleOnes') {
  const q = advanceQuest(run, 'paleOnes', e.def.drop.n, cb.queue);
  if (q.progress >= PROGRESSION.emberglass.paleOnes.lensAt &&
      !run.unlocks.includes('insight:witchlightLens')) {
    run.unlocks.push('insight:witchlightLens');
    cb.queue.push({ t: 'questUnlock', id: 'insight:witchlightLens' });
  }
}
~~~

In renderMap add pale-marked only when node.questMarked is true. Use iconSvg('paleMote',18) inside a small lens halo, title “Witchlight trembles”, and body “Pale glass waits here.” CSS may animate opacity only; REDUCED is static.

- [ ] **Step 5: Run green and commit**

Run: npm test && npm run build -- --outDir /tmp/spirebound-phase2-build --emptyOutDir
Expected: PASS.

~~~bash
git add src/engine.js src/ui.js src/styles.css test/test_engine.js
git commit -m "Implement the Pale Ones Trail and Witchlight Lens"
~~~


---

### Task 6: Implement Your Own Shade and standing monuments

**Files:**
- Modify: src/engine.js (fall marker, monument claim, Shade resolver/drop)
- Modify: src/vigil.js (standing lastFall and bequest preservation)
- Modify: src/ui.js:990-1006, 3409-3432, 3909-3978
- Test: test/test_engine.js

**Interfaces:**
- Produces: markShadeFall(run,act,row), claimMonument(run) returning either a normal bequest or { kind:'shadeDuel', variantId, bequest }, and grantBequest(run,bequest,queue).
- lastFall adds standing:boolean and shadeAspect:0|1.
- pendingQuestId ownShade suppresses ordinary combat rewards and returns to the map after a won duel.

- [ ] **Step 1: Write failing standing, capture, and three-tier tests**

~~~js
{
  _setStore(null);
  const v = loadVigil();
  v.quests.ownShade.state = 'armed';
  saveVigil(v);

  const fallen = newRun(440, { aspect: 1, quests: questSnapshot(v) });
  fallen.act = 1;
  markShadeFall(fallen, 1, 7);
  let out = commitRunEnd(fallen, 'death');
  assert.deepEqual(out.vigil.lastFall, {
    act: 1, row: 7, bequest: null, standing: true, shadeAspect: 1,
  });

  setBequest(1, 7, { kind: 'gold', amount: 50 });
  assert.equal(loadVigil().lastFall.standing, true);
  assert.equal(loadVigil().lastFall.shadeAspect, 1);

  const next = newRun(441, { aspect: 0, quests: questSnapshot(loadVigil()), monument: loadVigil().lastFall });
  next.act = 1;
  next.map = genMap(next);
  const duel = claimMonument(next);
  assert.equal(duel.kind, 'shadeDuel');
  assert.equal(duel.variantId, 'ownShade1');
  const shade = resolveCombatant(next, duel.variantId);
  assert.equal(shade.presentation.artId, 'ashwarden', 'uses fallen aspect, not current aspect');

  for (let stage = 0; stage < 3; stage++) {
    next.quests.ownShade.state = 'revealed';
    next.quests.ownShade.progress = stage;
    const id = 'ownShade' + (stage + 1);
    const cb = startCombat(next, [id], 'monster');
    cb.enemies[0].hp = 1;
    forceHand(next, cb, ['strike']);
    cb.player.energy = 3;
    playCard(next, cb, cb.hand[0].uid, 0);
    assert.equal(next.quests.ownShade.progress, stage + 1);
  }
  assert.equal(next.quests.ownShade.state, 'complete');
  assert.ok(next.endQueue.some((e) => e.t === 'shadeResolved' && e.text === QUESTS.ownShade.final));

  const unpaid = { kind: 'gold', amount: 50 };
  const lostDuel = newRun(442, {
    aspect: 0, quests: questSnapshot(loadVigil()),
    monument: { act: 1, row: 7, bequest: unpaid, standing: true, shadeAspect: 1 },
  });
  lostDuel.act = 1;
  assert.equal(claimMonument(lostDuel).kind, 'shadeDuel');
  markShadeFall(lostDuel, 1, 7);
  out = commitRunEnd(lostDuel, 'death');
  assert.deepEqual(out.vigil.lastFall.bequest, unpaid, 'a lost duel preserves the unpaid gift');
  setBequest(1, 7, { kind: 'gold', amount: 99 });
  assert.deepEqual(loadVigil().lastFall.bequest, unpaid, 'later defeat selection cannot overwrite the unpaid gift');
  _setStore(null);
}
~~~

- [ ] **Step 2: Run red**

Run: npm test
Expected: FAIL because markShadeFall is not exported.

- [ ] **Step 3: Record and preserve standing falls**

~~~js
export function markShadeFall(run, act, row) {
  const q = questRecord(run, 'ownShade');
  if (!q || q.state === 'dormant' || q.state === 'complete') return false;
  if (act < PROGRESSION.emberglass.ownShade.minDeathAct) return false;
  run.questScratch.ownShade ||= {};
  const bequest = run.questScratch.ownShade.pendingBequest ?? run.monument?.bequest ?? null;
  run.questScratch.ownShade.fall = { act, row, shadeAspect: run.aspect, bequest };
  return true;
}
~~~

In defeatFlow compute fallAct/fallRow first, call markShadeFall, then commit. In commitRunEnd, before save:

~~~js
const fall = run.questScratch?.ownShade?.fall;
if (outcome === 'death' && fall) {
  v.lastFall = { act: fall.act, row: fall.row, bequest: fall.bequest ?? null, standing: true, shadeAspect: fall.shadeAspect };
}
~~~

Change setBequest so a matching existing standing lastFall preserves standing, shadeAspect, and any non-null existing bequest; it uses the supplied bequest only when the matching standing record has no prior gift. A non-matching normal bequest gets standing:false.

- [ ] **Step 4: Split monument duel from bequest payment**

When monument.standing is true, claimMonument:
- sets monument.claimed true;
- stores its bequest under run.questScratch.ownShade.pendingBequest;
- returns variant ownShade + min(3, progress+1);
- does not grant the bequest yet.

Add grantBequest using the old card/relic/gold code and queue {t:'monumentGift',bequest}. In the same pre-winCombat drop block established by Task 5, a Shade drop calls advanceQuest, grants the pending bequest, and clears it. If the third advance completes the quest, append `{t:'shadeResolved',text:QUESTS.ownShade.final}` to run.endQueue exactly once.

In claimMonumentNode, call setPendingEncounter with kind monster, `[variantId]`, and questId ownShade; then call saveRun(run); only after that save succeeds call clearBequest and start combat instead of returning to the map. On resume, a pending ownShade encounter also clears the matching persisted bequest after load, making the sequence idempotent across a crash between save and clear.

In victoryFlow, capture pendingQuestId before clearPendingEncounter. If it is ownShade, save and show map without genCombatRewards. On loss, the normal defeat flow records a new standing fall when Act 2+, so the next run re-offers the current tier.
If that Shade loss carried pendingBequest, renderEnd suppresses the ordinary new-bequest picker and shows “The unpaid gift remains in the standing stone”; this prevents the later UI call from replacing the preserved gift.

- [ ] **Step 5: Run green and commit**

Run: npm test && npm run build -- --outDir /tmp/spirebound-phase2-build --emptyOutDir
Expected: PASS.

~~~bash
git add src/engine.js src/vigil.js src/ui.js test/test_engine.js
git commit -m "Implement the three-stage Own Shade Trail"
~~~

---

### Task 7: Implement the Usurper Gate

**Files:**
- Modify: src/engine.js (genShop, rollEncounter, variant drop)
- Modify: src/ui.js:3685-3784
- Modify: src/styles.css (quest shop item)
- Test: test/test_engine.js

**Interfaces:**
- genShop returns questItems: [] or [{ id:'flamelessLantern', name, text, price:650, sold:false }].
- Produces: buyQuestItem(run,itemId): { ok, reason }.
- run.questScratch.usurper.bought is same-run only.

- [ ] **Step 1: Write failing shop/boss tests**

~~~js
{
  const q = Object.fromEntries(QUEST_IDS.map((id) => [id, { state: id === 'usurper' ? 'armed' : 'dormant', progress: 0, memory: {} }]));
  const run = newRun(450, { quests: q });
  run.act = 0;
  assert.deepEqual(genShop(run).questItems, []);
  run.act = 1;
  let shop = genShop(run);
  assert.equal(shop.questItems[0].price, 650);
  assert.equal(run.quests.usurper.state, 'revealed', 'first sight reveals inscription');
  assert.deepEqual(buyQuestItem(run, 'flamelessLantern'), { ok: false, reason: 'gold' });
  run.player.gold = 650;
  assert.deepEqual(buyQuestItem(run, 'flamelessLantern'), { ok: true, reason: null });
  assert.equal(run.player.gold, 0);
  run.act = 2;
  assert.deepEqual(rollEncounter(run, 'boss', 14), ['usurpedSovereign']);
}
~~~

Append this exact kill assertion:

~~~js
  const boss = startCombat(run, ['usurpedSovereign'], 'boss');
  boss.enemies[0].hp = 1;
  forceHand(run, boss, ['strike']);
  boss.player.energy = 3;
  playCard(run, boss, boss.hand[0].uid, 0);
  assert.equal(run.quests.usurper.state, 'complete');
  assert.equal(run.questCompletions.filter((id) => id === 'usurper').length, 1);
~~~

- [ ] **Step 2: Run red**

Run: npm test
Expected: FAIL because questItems is undefined.

- [ ] **Step 3: Add persistent availability and same-run purchase**

In genShop initialise questItems. If Usurper is armed/revealed, incomplete, act >= minShopAct, and not bought, call revealQuest and append the fixed item. It is generated by every qualifying shop; it is not a random slot and never displaces ordinary stock.

~~~js
export function buyQuestItem(run, itemId) {
  if (itemId !== 'flamelessLantern') return { ok: false, reason: 'unknown' };
  const q = questRecord(run, 'usurper');
  if (!q || !['armed', 'revealed'].includes(q.state)) return { ok: false, reason: 'inactive' };
  const price = PROGRESSION.emberglass.usurper.price;
  if (run.player.gold < price) return { ok: false, reason: 'gold' };
  run.player.gold -= price;
  run.questScratch.usurper = { bought: true };
  return { ok: true, reason: null };
}
~~~

In rollEncounter, before the normal boss pool, return usurpedSovereign only when act===2 and bought. In onEnemyDeath's pre-winCombat drop block, its drop advances usurper by one with cb.queue.

- [ ] **Step 4: Render the authored item and dialogue**

Render questItems after relics. Use iconSvg('emptyLantern'), the authored name/text, and exact price. An unaffordable click displays QUESTS.usurper.poor; a successful purchase displays QUESTS.usurper.bought and marks only the current shop row sold. Later shops omit it because run scratch is bought.

The variant intro replaces {aspect} with Duskblade or Ashwarden. Its death queue uses QUESTS.usurper.death. Do not wire the usurper music cue.

- [ ] **Step 5: Run green and commit**

Run: npm test && npm run build -- --outDir /tmp/spirebound-phase2-build --emptyOutDir
Expected: PASS.

~~~bash
git add src/engine.js src/ui.js src/styles.css test/test_engine.js
git commit -m "Add the flameless lantern and Usurper Gate"
~~~

---

### Task 8: Implement the Eighth Omen Gate

**Files:**
- Modify: src/data.js:1018-1057
- Modify: src/engine.js:21-65, 424-430, 1062-1072
- Modify: src/art.js (structural broken-omen icon)
- Modify: src/ui.js (omen banner and per-floor echo)
- Modify: src/styles.css
- Test: test/test_engine.js

**Interfaces:**
- Adds OMENS.eighthOmen with mods { allCombatsAffixed:true }.
- Persistent quest memory uses dueIn:1|2 and seen:boolean.
- Run scratch uses eighthOmen.active:boolean.
- Adds the Node-safe test hook _setQuestRng(fn|null); production falls back to runRng(run).

- [ ] **Step 1: Write failing guarantee, recurrence, and victory tests**

~~~js
{
  _setStore(null);
  let v = loadVigil();
  v.quests.eighthOmen = { state: 'armed', progress: 0, memory: { dueIn: 2 } };
  saveVigil(v);

  _setQuestRng(() => 0.9); // first post-arm run misses its 1/3 chance
  const first = newRun(460, { quests: questSnapshot(v) });
  assert.notEqual(first.omens[0], 'eighthOmen');
  assert.equal(first.quests.eighthOmen.memory.dueIn, 1);
  let out = commitRunEnd(first, 'abandon');
  assert.equal(out.vigil.quests.eighthOmen.memory.dueIn, 1, 'miss persists the guarantee countdown');

  _setQuestRng(() => 0.9); // chance no longer matters: second run is forced
  const forced = newRun(461, { quests: questSnapshot(out.vigil) });
  assert.equal(forced.omens[0], 'eighthOmen');
  assert.equal('dueIn' in forced.quests.eighthOmen.memory, false);
  forced.act = 1;
  assert.equal(rollOmen(forced), 'eighthOmen', 'whole run stays under Eighth');
  const cb = startCombat(forced, ['duskfang'], 'normal');
  assert.ok(cb.affix, 'non-boss combat receives one affix');

  forced.act = 2;
  forced.player.deck = forced.player.deck.filter((c) => c.id !== 'unreadablePage');
  const boss = startCombat(forced, ['sovereign'], 'boss');
  boss.enemies[0].hp = 1;
  forceHand(forced, boss, ['strike']);
  boss.player.energy = 3;
  playCard(forced, boss, boss.hand[0].uid, 0);
  assert.equal(forced.quests.eighthOmen.state, 'complete');
  commitRunToVigil(forced, true);
  out = commitRunEnd(forced, 'win');
  assert.equal('dueIn' in out.vigil.quests.eighthOmen.memory, false, 'forced-run deletion persists');

  const firstHitQ = questSnapshot(out.vigil);
  firstHitQ.eighthOmen = { state: 'armed', progress: 0, memory: { dueIn: 2 } };
  _setQuestRng(() => 0.1);
  const firstHit = newRun(462, { quests: firstHitQ });
  assert.equal(firstHit.omens[0], 'eighthOmen', 'first post-arm run may hit the 1/3 roll');
  assert.equal('dueIn' in firstHit.quests.eighthOmen.memory, false);

  const recurrenceQ = questSnapshot(out.vigil);
  recurrenceQ.eighthOmen = { state: 'revealed', progress: 0, memory: { seen: true } };
  _setQuestRng(() => 0.2);
  assert.equal(newRun(463, { quests: recurrenceQ }).omens[0], 'eighthOmen');
  _setQuestRng(() => 0.9);
  assert.notEqual(newRun(464, { quests: recurrenceQ }).omens[0], 'eighthOmen');

  _setQuestRng(null);
  _setStore(null);
}
~~~

- [ ] **Step 2: Run red**

Run: npm test
Expected: FAIL because OMENS.eighthOmen does not exist.

- [ ] **Step 3: Add the omen and scheduling**

Add:

~~~js
eighthOmen: {
  name: 'The Eighth Omen', glyph: null, tone: '#e8e0ff',
  text: 'Every lesser battle bears a title. The broken words follow every floor.',
  mods: { allCombatsAffixed: true },
},
~~~

Add:

~~~js
let questRngOverride = null;
export function _setQuestRng(fn) { questRngOverride = typeof fn === 'function' ? fn : null; }
const questRoll = (run) => questRngOverride ? questRngOverride() : runRng(run)();

function prepareEighthOmen(run) {
  const q = questRecord(run, 'eighthOmen');
  if (!q || !['armed', 'revealed'].includes(q.state)) return;
  const due = q.memory.dueIn;
  let active = false;
  if (due === 2) {
    active = questRoll(run) < PROGRESSION.emberglass.eighthOmen.recurrenceChance;
    if (!active) q.memory.dueIn = 1;
  } else if (due === 1) {
    active = true;
  } else if (q.memory.seen) {
    active = questRoll(run) < PROGRESSION.emberglass.eighthOmen.recurrenceChance;
  }
  run.questScratch.eighthOmen = { active };
  if (active) {
    q.memory.seen = true;
    delete q.memory.dueIn;
    revealQuest(run, 'eighthOmen', run.endQueue);
  }
}
~~~

Call prepareEighthOmen after the run object and questScratch exist but before the first omen roll. `rollOmen` returns eighthOmen when run.questScratch.eighthOmen.active is true; otherwise it samples `Object.keys(OMENS).filter(id => id !== 'eighthOmen')`, so the special omen can never leak into an unarmed run. Active forces it for every act.

startCombat chooses one affix for kind elite or when omenMods(run).allCombatsAffixed && kind !== boss. Boss remains un-affixed. Full Act 3 boss victory under active Eighth advances the quest once and pushes {t:'eighthResolved',text:QUESTS.eighthOmen.resolved} to run.endQueue.

- [ ] **Step 4: Render broken glyphs and separate floor echoes**

Add iconSvg('eighthOmen') to art.js using six disconnected lead strokes and no font glyph. The omen banner uses class broken-omen and that icon. On each entered floor under Eighth, display the next QUESTS.eighthOmen.floorEchoes line by floorsClimbed modulo four. Do not modify vigil.whispers.

CSS uses small translate/opacity jitter; REDUCED renders a static readable icon and text.

At the same boundary, replace the manifest helper with:

~~~js
const checkManifest = (cat, requiredIds, optionalIds = []) => {
  const have = assetIds(cat);
  const required = new Set(requiredIds);
  const known = new Set([...requiredIds, ...optionalIds]);
  for (const id of required) assert.ok(have.has(id), `asset missing: src/assets/${cat}/${id} (data id has no art)`);
  for (const id of have) assert.ok(known.has(id), `orphan asset: src/assets/${cat}/${id} (art has no data id)`);
};
checkManifest('omens', Object.keys(OMENS).filter((id) => id !== 'eighthOmen'), ['eighthOmen']);
~~~

All pre-existing omen assets remain required and unknown files remain rejected. Task 9 reuses this helper for the Page.

- [ ] **Step 5: Run green and commit**

Run: npm test && npm run build -- --outDir /tmp/spirebound-phase2-build --emptyOutDir
Expected: PASS.

~~~bash
git add src/data.js src/engine.js src/art.js src/ui.js src/styles.css test/test_engine.js
git commit -m "Implement the Eighth Omen Gate"
~~~

---

### Task 9: Implement the Unreadable Page Trail

**Files:**
- Modify: src/data.js:37-504
- Modify: src/art.js:357-364
- Modify: src/engine.js:325-344, 1062-1072, 1157-1166
- Modify: src/ui.js:450-475, 3498-3521, 3758-3777, 3858-3872
- Test: test/test_engine.js

**Interfaces:**
- Adds CARDS.unreadablePage with unplayable:true and unremovable:true.
- Produces: removableCards(run), and removeCardFromDeck returns boolean.
- run.questScratch.unreadablePage.rewardOrdinal/offered cap the offer at one per run.

- [ ] **Step 1: Write failing offer/removal/page-reading tests**

~~~js
{
  const q = Object.fromEntries(QUEST_IDS.map((id) => [id, { state: id === 'unreadablePage' ? 'armed' : 'dormant', progress: 0, memory: {} }]));
  const run = newRun(470, { quests: q });
  const first = rollCardReward(run);
  assert.ok(!first.includes('unreadablePage'));
  const second = rollCardReward(run);
  assert.ok(second.includes('unreadablePage'));
  assert.ok(!rollCardReward(run).includes('unreadablePage'), 'offered once per run');
  assert.equal(run.quests.unreadablePage.state, 'revealed');

  const page = addCardToDeck(run, 'unreadablePage');
  assert.equal(removeCardFromDeck(run, page.uid), false);
  assert.ok(run.player.deck.some((c) => c.uid === page.uid));
  assert.ok(!removableCards(run).some((c) => c.id === 'unreadablePage'));

  run.act = 2;
  const cb = startCombat(run, ['sovereign'], 'boss');
  cb.enemies[0].hp = 1;
  forceHand(run, cb, ['strike']);
  cb.player.energy = 3;
  playCard(run, cb, cb.hand[0].uid, 0);
  assert.equal(run.quests.unreadablePage.progress, 1);
  assert.equal(run.endQueue.filter((e) => e.t === 'pageRead').length, 1);

  const twoPages = newRun(471, { quests: q });
  addCardToDeck(twoPages, 'unreadablePage');
  addCardToDeck(twoPages, 'unreadablePage');
  twoPages.act = 2;
  const twoPageBoss = startCombat(twoPages, ['sovereign'], 'boss');
  twoPageBoss.enemies[0].hp = 1;
  forceHand(twoPages, twoPageBoss, ['strike']);
  twoPageBoss.player.energy = 3;
  playCard(twoPages, twoPageBoss, twoPageBoss.hand[0].uid, 0);
  assert.equal(twoPages.quests.unreadablePage.progress, 1, 'one page-reading per winning run');

  const finalPageQ = structuredClone(q);
  finalPageQ.unreadablePage = { state: 'revealed', progress: 4, memory: {} };
  const finalPage = newRun(472, { quests: finalPageQ });
  addCardToDeck(finalPage, 'unreadablePage');
  finalPage.act = 2;
  const finalPageBoss = startCombat(finalPage, ['sovereign'], 'boss');
  finalPageBoss.enemies[0].hp = 1;
  forceHand(finalPage, finalPageBoss, ['strike']);
  finalPageBoss.player.energy = 3;
  playCard(finalPage, finalPageBoss, finalPageBoss.hand[0].uid, 0);
  assert.equal(finalPage.quests.unreadablePage.state, 'complete');
  assert.equal(finalPage.endQueue.find((e) => e.t === 'pageRead').index, 5);
}
~~~

- [ ] **Step 2: Run red**

Run: npm test
Expected: FAIL because CARDS.unreadablePage is missing.

- [ ] **Step 3: Add the special card and deterministic injection**

~~~js
unreadablePage: {
  name: 'The Unreadable Page', type: 'curse', rarity: 'special', cost: 0,
  target: 'self', unplayable: true, unremovable: true,
  text: 'It cannot be played or removed. Carry it to dawn and it may read itself.',
  effects: [],
},
~~~

Add unreadablePage:'▤' to CARD_GLYPHS. Do not add it to CARD_POOLS and do not require a raster.

In rollCardReward, increment rewardOrdinal only while the quest is armed/revealed and incomplete. On ordinal 2, replace the final ordinary choice with unreadablePage, set offered, and reveal the quest. Never inject into boss card rewards after the final boss.

- [ ] **Step 4: Enforce removal and final-win reading**

~~~js
export const removableCards = (run) => run.player.deck.filter((c) => !cardData(c).unremovable);

export function removeCardFromDeck(run, uid) {
  const i = run.player.deck.findIndex((c) => c.uid === uid);
  if (i < 0 || cardData(run.player.deck[i]).unremovable) return false;
  run.player.deck.splice(i, 1);
  return true;
}
~~~

Use removableCards in merchant and event removal pickers. If empty, resolve without opening an impossible picker.

On full final-boss victory, if the deck contains at least one Page and the quest is active, advance exactly one and enqueue:

~~~js
run.endQueue.push({
  t: 'pageRead',
  index: run.quests.unreadablePage.progress,
  text: QUESTS.unreadablePage.pages[run.quests.unreadablePage.progress - 1],
});
~~~

- [ ] **Step 5: Preserve strict manifest fallback, run green, and commit**

Reuse checkManifest's optionalIds parameter from Task 8 and replace the card call with:

~~~js
checkManifest('cards', Object.keys(CARDS).filter((id) => id !== 'unreadablePage'), ['unreadablePage']);
~~~

Existing card assets remain required and unknown files remain rejected.

Run: npm test && npm run build -- --outDir /tmp/spirebound-phase2-build --emptyOutDir
Expected: PASS with no missing Page raster.

~~~bash
git add src/data.js src/art.js src/engine.js src/ui.js test/test_engine.js
git commit -m "Add the Unreadable Page Trail"
~~~

---

### Task 10: Implement the Hollow Lamplighter and reversible boon price

**Files:**
- Modify: src/engine.js (newRun, visitNode, gainEmbers, applyBoon, payHollowPrice)
- Modify: src/vigil.js (eligible-run pity memory)
- Modify: src/ui.js:544-547, 725-815, 964-1006
- Modify: src/styles.css
- Test: test/test_engine.js

**Interfaces:**
- Produces: applyBoon(run,id), reverseBoon(run), payHollowPrice(run), and run.pendingHollow.
- applyBoon returns/stores boonReceipt `{id,playerDelta,statsGoldEarned,relicsAdded,potionSlotsAdded}`.
- payHollowPrice returns { ok, deferred, message }.

- [ ] **Step 1: Write failing appearance, five-price, and debt tests**

~~~js
{
  const q = Object.fromEntries(QUEST_IDS.map((id) => [id, {
    state: id === 'hollowLamplighter' ? 'armed' : 'dormant', progress: 0,
    memory: id === 'hollowLamplighter' ? { eligibleMisses: 1 } : {},
  }]));
  const run = newRun(480, { quests: q, lamplighter: true });
  assert.equal(run.questScratch.hollowLamplighter.due, true, 'pity forces second eligible run');

  const unlit = run.map.nodes.find((n) => n.unlit);
  assert.ok(unlit, 'scenario has an unlit node');
  const visit = visitNode(run, unlit);
  assert.equal(visit.hollow, true);
  assert.ok(run.pendingHollow);
  assert.equal(run.quests.hollowLamplighter.state, 'revealed');

  let pay = payHollowPrice(run);
  assert.deepEqual(pay, { ok: true, deferred: true, message: QUESTS.hollowLamplighter.meetings[0].accepted });
  assert.equal(run.quests.hollowLamplighter.memory.emberDebt, 3);

  const cb = startCombat(run, ['sporeling']);
  gainEmbers(run, cb, 2);
  assert.equal(cb.embers, 0);
  gainEmbers(run, cb, 1);
  assert.equal(run.quests.hollowLamplighter.progress, 1);

  run.quests.hollowLamplighter.progress = 1;
  run.player.gold = 160;
  assert.equal(payHollowPrice(run).ok, true);
  assert.equal(run.player.gold, 0);

  run.quests.hollowLamplighter.progress = 2;
  run.player.maxHp = 42;
  run.player.hp = 42;
  assert.equal(payHollowPrice(run).ok, true);
  assert.equal(run.player.maxHp, 30);

  run.quests.hollowLamplighter.progress = 3;
  applyBoon(run, 'temperedGlass');
  assert.equal(payHollowPrice(run).ok, true);
  assert.equal(run.boon, null);

  run.quests.hollowLamplighter.progress = 4;
  run.player.hp = 40;
  assert.equal(payHollowPrice(run).ok, true);
  assert.equal(run.player.hp, 1);
  assert.equal(run.quests.hollowLamplighter.state, 'complete');

  for (const [i, id] of Object.keys(BOONS).entries()) {
    const bq = Object.fromEntries(QUEST_IDS.map((qid) => [qid, {
      state: qid === 'hollowLamplighter' ? 'revealed' : 'dormant',
      progress: qid === 'hollowLamplighter' ? 3 : 0, memory: {},
    }]));
    const br = newRun(490 + i, { quests: bq });
    br.pendingHollow = { nodeId: br.map.nodes[0].id, type: br.map.nodes[0].type };
    const before = structuredClone({
      hp: br.player.hp, maxHp: br.player.maxHp, energyMax: br.player.energyMax,
      gold: br.player.gold, relics: br.player.relics, potions: br.player.potions,
      goldEarned: br.stats.goldEarned,
    });
    applyBoon(br, id);
    assert.equal(payHollowPrice(br).ok, true, id + ' can be surrendered');
    assert.deepEqual({
      hp: br.player.hp, maxHp: br.player.maxHp, energyMax: br.player.energyMax,
      gold: br.player.gold, relics: br.player.relics, potions: br.player.potions,
      goldEarned: br.stats.goldEarned,
    }, before, id + ' reverses every recorded delta');
  }

  const crown = newRun(499, { quests: q });
  const crownBefore = {
    hp: crown.player.hp, maxHp: crown.player.maxHp,
    energyMax: crown.player.energyMax, relics: [...crown.player.relics],
  };
  gainRelic(crown, 'hollowCrown');
  crown.boon = 'keenEye';
  crown.boonReceipt = {
    id: 'keenEye',
    playerDelta: { gold: 0, hp: crown.player.hp - crownBefore.hp,
      maxHp: crown.player.maxHp - crownBefore.maxHp,
      energyMax: crown.player.energyMax - crownBefore.energyMax },
    statsGoldEarned: 0,
    relicsAdded: ['hollowCrown'], potionSlotsAdded: [],
  };
  assert.equal(reverseBoon(crown), true);
  assert.deepEqual({
    hp: crown.player.hp, maxHp: crown.player.maxHp,
    energyMax: crown.player.energyMax, relics: crown.player.relics,
  }, crownBefore, 'instant relic max-HP and energy effects reverse');

  _setStore(null);
  const debtVigil = loadVigil();
  debtVigil.quests.hollowLamplighter = {
    state: 'armed', progress: 0, memory: { eligibleMisses: 1 },
  };
  saveVigil(debtVigil);
  const debtRun = newRun(520, { quests: questSnapshot(debtVigil) });
  const debtNode = debtRun.map.nodes.find((n) => n.unlit);
  assert.ok(debtNode);
  visitNode(debtRun, debtNode);
  assert.equal(payHollowPrice(debtRun).deferred, true);
  const debtCombat = startCombat(debtRun, ['sporeling']);
  gainEmbers(debtRun, debtCombat, 2);
  let debtOut = commitRunEnd(debtRun, 'death');
  assert.equal(debtOut.vigil.quests.hollowLamplighter.memory.emberDebt, 1);

  const carry = newRun(521, { quests: questSnapshot(debtOut.vigil) });
  assert.deepEqual(carry.questScratch.hollowLamplighter,
    { due: false, met: false, debtActive: true });
  const carryCombat = startCombat(carry, ['sporeling']);
  gainEmbers(carry, carryCombat, 1);
  assert.equal(carry.quests.hollowLamplighter.progress, 1);
  debtOut = commitRunEnd(carry, 'abandon');
  assert.equal('emberDebt' in debtOut.vigil.quests.hollowLamplighter.memory, false,
    'cleared debt stays deleted after the authoritative merge');
  _setStore(null);
}
~~~

- [ ] **Step 2: Run red**

Run: npm test
Expected: FAIL because applyBoon and payHollowPrice do not exist.

- [ ] **Step 3: Roll and persist the encounter**

At newRun, for an active incomplete Hollow quest:

~~~js
const hq = questRecord(run, 'hollowLamplighter');
if (hq && ['armed', 'revealed'].includes(hq.state)) {
  if (hq.memory.emberDebt > 0) {
    run.questScratch.hollowLamplighter = { due: false, met: false, debtActive: true };
  } else {
    const misses = hq.memory.eligibleMisses || 0;
    const due = misses >= PROGRESSION.emberglass.hollowLamplighter.pityEligibleRuns - 1 ||
      runRng(run)() < PROGRESSION.emberglass.hollowLamplighter.appearanceChance;
    run.questScratch.hollowLamplighter = { due, met: false, debtActive: false };
  }
}
~~~

In visitNode capture wasUnlit before deleting node.unlit. If due, not met, and wasUnlit:
- mark met;
- reveal quest;
- set run.pendingHollow={nodeId:node.id,type:node.type};
- return hollow:true with the existing type/bounty.

In vigil.js, after mergeRunQuests and before save, update pity only when the run contains Hollow scratch:

~~~js
const hs = run.questScratch?.hollowLamplighter;
const persistedHollow = v.quests.hollowLamplighter;
if (hs && !hs.debtActive && ['armed', 'revealed'].includes(persistedHollow.state)) {
  persistedHollow.memory.eligibleMisses = hs.met
    ? 0
    : (persistedHollow.memory.eligibleMisses || 0) + 1;
}
if (persistedHollow.state === 'complete') delete persistedHollow.memory.eligibleMisses;
~~~

At most one meeting occurs because met is saved in the run.

startRun checks pendingHollow before map and reopens the Hollow screen, preventing reload skips. Leaving the Hollow screen clears pendingHollow and routes the already-visited node exactly once without calling visitNode again.

loadRun self-heals pendingHollow and boonReceipt to null. It accepts pendingHollow only as null or a plain object whose nodeId identifies an existing run.map node and whose type exactly matches that node's monster, elite, boss, rest, shop, treasure, event, or monument type. It accepts boonReceipt only when its id exists in BOONS and equals run.boon; playerDelta has exactly finite signed gold/hp/maxHp/energyMax values; statsGoldEarned is finite and non-negative; relicsAdded is an array of RELICS ids; and potionSlotsAdded is an array of `{index,id}` records with a valid slot and POTIONS id. Unknown receipt fields or invalid pending data reject the save. Add one negative save fixture per rejected component.

Extend Task 3's rejectSaved matrix inside the same temporary-localStorage block:

~~~js
  rejectSaved('missing Hollow node', (r) => { r.pendingHollow = { nodeId: 'missing', type: 'event' }; });
  rejectSaved('mismatched Hollow type', (r) => {
    r.pendingHollow = { nodeId: r.map.nodes[0].id, type: r.map.nodes[0].type === 'event' ? 'shop' : 'event' };
  });
  const receipt = {
    id: 'fullPurse',
    playerDelta: { gold: 120, hp: 0, maxHp: 0, energyMax: 0 },
    statsGoldEarned: 120, relicsAdded: [], potionSlotsAdded: [],
  };
  const validReceiptRun = newRun(498, { quests: saveQuests });
  applyBoon(validReceiptRun, 'fullPurse');
  saveRun(validReceiptRun);
  assert.deepEqual(loadRun().boonReceipt, validReceiptRun.boonReceipt, 'valid boon receipt round-trips');
  rejectSaved('unknown receipt boon', (r) => { r.boon = 'unknown'; r.boonReceipt = { ...receipt, id: 'unknown' }; });
  rejectSaved('incomplete player delta', (r) => {
    r.boon = 'fullPurse';
    r.boonReceipt = { ...receipt, playerDelta: { gold: 120 } };
  });
  rejectSaved('negative stats delta', (r) => { r.boon = 'fullPurse'; r.boonReceipt = { ...receipt, statsGoldEarned: -1 }; });
  rejectSaved('unknown receipt relic', (r) => { r.boon = 'fullPurse'; r.boonReceipt = { ...receipt, relicsAdded: ['unknown'] }; });
  rejectSaved('invalid potion slot', (r) => {
    r.boon = 'fullPurse';
    r.boonReceipt = { ...receipt, potionSlotsAdded: [{ index: 999, id: 'fire' }] };
  });
~~~

- [ ] **Step 4: Track and reverse the boon receipt**

Replace direct UI applyEventOps for Lamplighter boons with:

~~~js
const multisetAdded = (after, before) => {
  const left = new Map();
  for (const id of before) left.set(id, (left.get(id) || 0) + 1);
  return after.filter((id) => {
    const n = left.get(id) || 0;
    if (n) { left.set(id, n - 1); return false; }
    return true;
  });
};

export function applyBoon(run, id) {
  if (!BOONS[id]) throw new Error('unknown boon: ' + id);
  const before = {
    gold: run.player.gold, hp: run.player.hp, maxHp: run.player.maxHp,
    energyMax: run.player.energyMax, goldEarned: run.stats.goldEarned,
    relics: [...run.player.relics], potions: [...run.player.potions],
  };
  applyEventOps(run, BOONS[id].ops);
  run.boon = id;
  run.boonReceipt = {
    id,
    playerDelta: {
      gold: run.player.gold - before.gold,
      hp: run.player.hp - before.hp,
      maxHp: run.player.maxHp - before.maxHp,
      energyMax: run.player.energyMax - before.energyMax,
    },
    statsGoldEarned: run.stats.goldEarned - before.goldEarned,
    relicsAdded: multisetAdded(run.player.relics, before.relics),
    potionSlotsAdded: run.player.potions.flatMap((potionId, index) =>
      potionId && before.potions[index] !== potionId ? [{ index, id: potionId }] : []),
  };
  return run.boonReceipt;
}

export function reverseBoon(run) {
  const receipt = run.boonReceipt;
  if (!receipt || run.boon !== receipt.id) return false;
  const d = receipt.playerDelta;
  if (d.gold > 0 && run.player.gold < d.gold) return false;
  const needed = new Map();
  for (const id of receipt.relicsAdded) needed.set(id, (needed.get(id) || 0) + 1);
  for (const [id, n] of needed) {
    if (run.player.relics.filter((x) => x === id).length < n) return false;
  }
  if (receipt.potionSlotsAdded.some(({ index, id }) => run.player.potions[index] !== id)) return false;

  for (const id of receipt.relicsAdded) {
    const index = run.player.relics.lastIndexOf(id);
    run.player.relics.splice(index, 1);
  }
  for (const { index } of receipt.potionSlotsAdded) run.player.potions[index] = null;
  run.player.gold -= d.gold;
  run.player.energyMax = Math.max(1, run.player.energyMax - d.energyMax);
  run.player.maxHp = Math.max(1, run.player.maxHp - d.maxHp);
  run.player.hp = clamp(run.player.hp - d.hp, 1, run.player.maxHp);
  run.stats.goldEarned = Math.max(0, run.stats.goldEarned - receipt.statsGoldEarned);
  run.boon = null;
  run.boonReceipt = null;
  return true;
}
~~~

The receipt records numeric side effects as well as objects, so instant relics such as sweetRoot and hollowCrown are reversed without boon-ID branches. The all-BOONS loop proves the live table; the crafted hollowCrown case above pins maxHp:-10 and energyMax:+1 even though keenEye's ordinary rarity roll may not select it.

- [ ] **Step 5: Implement all five prices and the ember diversion**

Implement the price transaction exactly:

~~~js
export function payHollowPrice(run) {
  const q = questRecord(run, 'hollowLamplighter');
  if (!run.pendingHollow || !q || !['armed', 'revealed'].includes(q.state)) {
    return { ok: false, deferred: false, message: '' };
  }
  const meeting = QUESTS.hollowLamplighter.meetings[q.progress];
  const fail = () => ({ ok: false, deferred: false, message: meeting.cannot });
  if (q.progress === 0) {
    q.memory.emberDebt = PROGRESSION.emberglass.hollowLamplighter.emberDebt;
    return { ok: true, deferred: true, message: meeting.accepted };
  }
  if (q.progress === 1) {
    const price = PROGRESSION.emberglass.hollowLamplighter.gold;
    if (run.player.gold < price) return fail();
    run.player.gold -= price;
  } else if (q.progress === 2) {
    const price = PROGRESSION.emberglass.hollowLamplighter.maxHp;
    if (run.player.maxHp - price < PROGRESSION.emberglass.hollowLamplighter.minMaxHpAfter) return fail();
    run.player.maxHp -= price;
    run.player.hp = Math.min(run.player.hp, run.player.maxHp);
  } else if (q.progress === 3) {
    if (!reverseBoon(run)) return fail();
  } else if (q.progress === 4) {
    run.player.hp = PROGRESSION.emberglass.hollowLamplighter.finalHp;
  } else return fail();
  advanceQuest(run, 'hollowLamplighter', 1, run.endQueue);
  return { ok: true, deferred: false, message: meeting.paid };
}
~~~

At the top of positive gainEmbers, divert `tithe = Math.min(n,q.memory.emberDebt)` before applying the ember-cap calculation, decrement the debt, and push `{t:'hollowTithe',n:tithe,remaining}`. When remaining reaches zero, delete emberDebt, call `advanceQuest(run,'hollowLamplighter',1,cb.queue)`, and include `paid:QUESTS.hollowLamplighter.meetings[0].paid` on that final hollowTithe event. Continue the original function with `n -= tithe`; negative spending is unchanged. After a run-end merge, assert a cleared debt is absent from loadVigil to prove authoritative memory replacement.

Extract the existing post-visit type switch from enterNode into `routeVisitedNode(node,type)`. After visitNode, if result.hollow is true, save and call show('hollow',{nodeId:node.id}); otherwise call routeVisitedNode. Add show('hollow') to the router. The `.hollow-lamplighter` screen uses the gaunt CSS/SVG silhouette, exact meeting ask, `[data-a=hollow-pay]`, `.hollow-answer`, and a disabled `[data-a=hollow-continue]`. Pay calls payHollowPrice, writes its message, and enables Continue only on ok. Continue copies pendingHollow, clears it, saves, finds the already-visited node by nodeId, and calls routeVisitedNode(node,pending.type) without visitNode. On resume, startRun routes pendingHollow to this screen before map. REDUCED removes entrance motion.

Run: npm test && npm run build -- --outDir /tmp/spirebound-phase2-build --emptyOutDir
Expected: PASS.

~~~bash
git add src/engine.js src/vigil.js src/ui.js src/styles.css test/test_engine.js
git commit -m "Implement the Hollow Lamplighter Trail"
~~~


---

### Task 11: Add dawn ceremonies, Rose Window fallback, title medallion, and sealed door

**Files:**
- Modify: src/art.js (structural fallbacks)
- Modify: src/ui.js:560-724, 817-927, 3409-3432, 3878-3980, 4038-4045
- Modify: src/styles.css
- Modify: test/test_engine.js (optional-art manifest)
- Create: test/e2e/emberglass-fixtures.js
- Test: test/e2e/emberglass.spec.js (create)

**Interfaces:**
- renderVigil({tab:'deeds'|'rose'}={}) is the only Vigil renderer.
- roseAssets() returns null or { mural, frame, masks:Record<questId,url> }; partial sets return null.
- Rose DOM contracts: .rose-window, .rose-pane[data-quest], .rose-fallback, .whisper-log, .whisper-row.
- Title contract: .title-rose-medallion[data-a=rose].
- Door contract: .sealed-door[data-a=sealed-door] and .sealed-door-panel.

- [ ] **Step 1: Write failing disclosure and door Playwright cases**

Create test/e2e/emberglass-fixtures.js with reusable v2 ledgers and a seeder that first navigates to the app origin, writes storage, reloads, and waits for window.spirebound.

Use these complete fixture helpers:

~~~js
export const QIDS = [
  'paleOnes', 'ownShade', 'usurper',
  'eighthOmen', 'unreadablePage', 'hollowLamplighter',
];
const TARGET = {
  paleOnes: 9, ownShade: 3, usurper: 1,
  eighthOmen: 1, unreadablePage: 5, hollowLamplighter: 5,
};
const deeds = (wins = 0) => ({
  runs: wins, wins, slain: 0, shatters: 0, kindles: 0, perfects: 0,
  smolderKills: 0, unlitVisited: 0, embersSpent: 0, bestVow: 0, bestFloor: 0,
});
const quest = (state = 'dormant', progress = 0, memory = {}) => ({ state, progress, memory });

export function freshLedger() {
  return {
    v: 2, deeds: deeds(), unlocks: [], vowUnlocked: 0, lastFall: null,
    runsPlayed: 0,
    quests: Object.fromEntries(QIDS.map((id) => [id, quest()])),
    shards: [], whispers: 0, news: false,
  };
}

export function mixedLedger() {
  const v = freshLedger();
  v.deeds = deeds(6);
  v.runsPlayed = 8;
  v.quests.paleOnes = quest('armed');
  v.quests.ownShade = quest('revealed', 1);
  v.quests.usurper = quest('complete', 1);
  v.quests.unreadablePage = quest('revealed', 2);
  v.shards = ['usurper'];
  v.whispers = 4;
  v.news = true;
  return v;
}

export function completeLedger() {
  const v = freshLedger();
  v.deeds = deeds(24);
  v.runsPlayed = 24;
  v.quests = Object.fromEntries(QIDS.map((id) => [id, quest('complete', TARGET[id])]));
  v.shards = [...QIDS];
  v.whispers = 24;
  v.news = true;
  return v;
}

export async function seed(page, vigil) {
  await page.goto('/');
  await page.waitForFunction(() => window.spirebound && window.__probe);
  await page.evaluate((value) => {
    localStorage.removeItem('spirebound_save_v2');
    localStorage.setItem('spirebound_vigil_v2', JSON.stringify(value));
  }, vigil);
  await page.reload();
  await page.waitForFunction(() => window.spirebound && window.__probe);
}
~~~

Start emberglass.spec.js with:

~~~js
import { test, expect } from '@playwright/test';
import { freshLedger, mixedLedger, completeLedger, seed } from './emberglass-fixtures.js';

test.beforeEach(() => {
  test.skip(test.info().project.name !== 'desktop', 'Emberglass behaviour runs once on desktop');
});
~~~

The file must then contain these tests:

~~~js
test('fresh profile exposes no Rose tab or medallion', async ({ page }) => {
  await seed(page, freshLedger());
  await page.click('[data-a="vigil"]');
  await expect(page.locator('[data-a="tab-rose"]')).toHaveCount(0);
  await page.click('[data-a="back"]');
  await expect(page.locator('.title-rose-medallion')).toHaveCount(0);
});

test('Rose panes disclose only their current state', async ({ page }) => {
  const v = mixedLedger(); // dormant, armed, revealed, complete in fixed quest order
  await seed(page, v);
  await page.click('[data-a="vigil"]');
  await page.click('[data-a="tab-rose"]');
  await expect(page.locator('.rose-pane[data-quest="paleOnes"]')).toHaveClass(/armed/);
  await expect(page.locator('.rose-pane[data-quest="paleOnes"]')).toContainText('???');
  await expect(page.locator('.rose-pane[data-quest="ownShade"]')).toContainText('1/3');
  await expect(page.locator('.rose-pane[data-quest="usurper"]')).toHaveClass(/complete/);
  await expect(page.locator('.rose-pane.dormant')).not.toContainText('Hollow');
  await expect(page.locator('.whisper-row')).toHaveCount(v.whispers);
});

test('opening Vigil clears only the news pulse', async ({ page }) => {
  const v = mixedLedger();
  await seed(page, v);
  await page.click('[data-a="vigil"]');
  const stored = await page.evaluate(() => JSON.parse(localStorage.getItem('spirebound_vigil_v2')));
  expect(stored.news).toBe(false);
  expect(stored.quests).toEqual(v.quests);
  expect(stored.shards).toEqual(v.shards);
  expect(stored.whispers).toBe(v.whispers);
});

test('six shards expose a promise, never Act 4 gameplay', async ({ page }) => {
  const v = completeLedger();
  await seed(page, v);
  await page.evaluate(() => {
    const sp = window.spirebound;
    sp.S.run = sp.E.newRun(9001, {
      reveals: ['omens', 'phials', 'poolWave2', 'poolWave3', 'poolFull', 'emberglass', 'act4'],
      quests: JSON.parse(localStorage.getItem('spirebound_vigil_v2')).quests,
      shards: JSON.parse(localStorage.getItem('spirebound_vigil_v2')).shards,
    });
    sp.S.run.act = 2;
    sp.S.run.map = sp.E.genMap(sp.S.run);
    sp.show('map');
  });
  await expect(page.locator('[data-a="sealed-door"]')).toHaveCount(1);
  await page.click('[data-a="sealed-door"]');
  await expect(page.locator('.sealed-door-panel')).toContainText('the climb continues');
  expect(await page.evaluate(() => window.spirebound.S.run.act)).toBe(2);
  expect(await page.evaluate(() => window.spirebound.S.run.nodeId)).toBe(null);
});
~~~

Do not rely on mutable global profile state; every helper call above returns a new complete ledger object.

- [ ] **Step 2: Run red**

Run: npx playwright test test/e2e/emberglass.spec.js --project=desktop --reporter=list
Expected: FAIL because tab-rose and sealed-door do not exist.

- [ ] **Step 3: Render queue-driven dawn ceremonies**

In victoryFlow preserve ordering:

~~~js
const { newUnlocks } = commitRunToVigil(run, true);
const ledger = commitRunEnd(run, 'win');
E.recordRunEnd(run, true);
show('end', { won: true, newUnlocks, ledger });
~~~

Defeat passes the death ledger but renders no new ceremony, preserving the spec. In renderEnd, for a win, create a .dawn-ceremony queue in this order:
1. ledger.whisper, if non-null;
2. run.endQueue events in their existing order;
3. one shardGrant event per ledger.newShards;
4. act4Reveal when the sixth shard is newly gained.

Before adding the dawn renderer, extend combat handleEvent so every engine event has an explicit consumer:

~~~js
case 'questReveal':
  banner(`${QUESTS[ev.id].mode.toUpperCase()} REVEALED — ${QUESTS[ev.id].name}`);
  break;
case 'questProgress':
  banner(`${QUESTS[ev.id].name} — ${ev.progress}/${ev.target}`);
  break;
case 'questComplete':
  banner(`${QUESTS[ev.id].name.toUpperCase()} — COMPLETE`);
  break;
case 'questUnlock':
  banner(ev.id === 'insight:witchlightLens' ? 'WITCHLIGHT LENS — PALE PATHS REVEALED' : ev.id);
  break;
case 'hollowTithe':
  banner(ev.remaining > 0 ? `${ev.remaining} EMBERS STILL OWED` : ev.paid);
  break;
case 'monumentGift':
  banner('THE STONE RETURNS ITS GIFT');
  break;
~~~

These cases are presentation-only. `hollowTithe` is consumed in the combat queue and is not copied into run.endQueue.

Implement one async drainEndQueue(events,host):
- whisper: one italic line headed “A whisper reaches the dawn”.
- questReveal: quest mode/name plus its now-visible inscription.
- questProgress: quest name and exact `progress/target`.
- questUnlock: the Witchlight Lens title and “Pale paths will now be marked.”
- pageRead: Page number and exact text.
- eighthResolved: broken glyphs resolve to exact text.
- shadeResolved: the exact QUESTS.ownShade.final text.
- questComplete: no separate card when the same event has a following shardGrant.
- shardGrant: iconSvg('emberglassShard'), quest name, “One pane answers.”
- act4Reveal: iconSvg('sealedDoor'), “Six panes burn. Something waits above the crown.”
- REDUCED uses 40 ms between panels; normal uses 550 ms opacity/translate transitions.

After the last panel is appended, drainEndQueue adds `.complete` to the `.dawn-ceremony` host; tests wait on that class rather than racing the first panel.

No event mutates engine or Vigil state.

- [ ] **Step 4: Build the Rose and title surfaces with an atomic fallback**

Add:

~~~js
const ROSE_ASSET_IDS = {
  mural: 'emberglass-mural',
  frame: 'emberglass-frame',
  masks: Object.fromEntries(QUEST_IDS.map((id) => [id, 'emberglass-mask-' + id])),
};

function roseAssets() {
  const mural = assetUrl('meta', ROSE_ASSET_IDS.mural);
  const frame = assetUrl('meta', ROSE_ASSET_IDS.frame);
  const masks = Object.fromEntries(QUEST_IDS.map((id) => [id, assetUrl('meta', ROSE_ASSET_IDS.masks[id])]));
  return mural && frame && Object.values(masks).every(Boolean) ? { mural, frame, masks } : null;
}
~~~

renderVigil accepts data and defaults to deeds. It calls clearNews once per opening, not on tab rerender. Rose tab exists only when isRevealed(v,'emberglass').

Pane rules:
- dormant: include the geometric pane but no data-quest identity, title, or copy visible to the player; Playwright may address a neutral .rose-pane.dormant by index only.
- armed: data-quest plus ??? only.
- revealed: name, inscription, and progress/target.
- complete: name, “Shard recovered”, lit class, and mural slice.

If roseAssets is null, use six CSS/SVG slots inside .rose-fallback. If present, each pane uses the same mural background and its exact mask URL; preload all eight URLs with hidden img elements and add .ready after decode.

The whisper log renders WHISPERS.slice(0,Math.min(v.whispers,WHISPERS.length)). If v.whispers exceeds 24, append “The final whisper returns at every dawn.”

On title, show a medallion only when v.shards.length>=1 and roseAssets() is non-null. Click show('vigil',{tab:'rose'}). No CSS fallback medallion.

- [ ] **Step 5: Add the non-path door, fallbacks, tests, and commit**

Add art.js icons: paleMote, emberglassShard, roseWindow, emptyLantern, eighthOmen, unreadablePage, hollowLantern, and sealedDoor. They are paths in the structural ICONS table, never font glyphs.

When `run.act===2`, `runRevealed(run,'act4')`, and `run.shards.length >= PROGRESSION.revealThresholds.act4.shards`, render a separate summit button above the boss projection. The explicit shard guard keeps `newRun()`'s fully-revealed compatibility default from showing the door with an empty shard snapshot. It is not in run.map.nodes. Clicking opens:

~~~html
<div class="panel sealed-door-panel">
  <div class="ov-title">THE SEALED DOOR</div>
  <div class="sealed-door-mark">${iconSvg('sealedDoor', 96)}</div>
  <div class="ov-sub">Six panes burn behind you. The lock answers, but does not open.</div>
  <div class="door-inscription">the climb continues</div>
  <div class="ov-actions"><button class="btn" data-a="close-door">Return to the summit</button></div>
</div>
~~~

Opening/closing must not alter act, map, nodeId, or save.

Keep the optional omen/Page calls from Tasks 8-9. Replace the meta call with:

~~~js
const ROSE_OPTIONAL = [
  'emberglass-mural', 'emberglass-frame',
  ...QUEST_IDS.map((id) => 'emberglass-mask-' + id),
];
checkManifest('meta', ['fallen', 'ascended', 'monument-node'], ROSE_OPTIONAL);
~~~

Existing asset IDs remain required and orphan checking remains exact.

Run:

~~~bash
npm test
npx playwright test test/e2e/emberglass.spec.js --project=desktop --reporter=list
npm run build -- --outDir /tmp/spirebound-phase2-build --emptyOutDir
~~~

Expected: PASS using the fallback because art is not promoted yet.

~~~bash
git add src/art.js src/ui.js src/styles.css test/test_engine.js test/e2e/emberglass-fixtures.js test/e2e/emberglass.spec.js
git commit -m "Add Emberglass ceremonies Rose Window and sealed door"
~~~

---

### Task 12: Author, generate, align, and promote the Rose art set

**Files:**
- Modify: docs/meta-art-bible.md
- Modify: src/assets/README.md
- Create: tools/gen-emberglass-frame.py
- Create: src/assets/meta/emberglass-mural.png
- Create: src/assets/meta/emberglass-frame.png
- Create: src/assets/meta/emberglass-mask-paleOnes.png
- Create: src/assets/meta/emberglass-mask-ownShade.png
- Create: src/assets/meta/emberglass-mask-usurper.png
- Create: src/assets/meta/emberglass-mask-eighthOmen.png
- Create: src/assets/meta/emberglass-mask-unreadablePage.png
- Create: src/assets/meta/emberglass-mask-hollowLamplighter.png
- Modify: src/ui.js (gallery registration)
- Test: test/test_engine.js (atomic dimensions and alpha)

**Interfaces:**
- Consumes: the eight IDs from roseAssets.
- Produces: one atomic 1024×1024 set. Mural is opaque; frame and masks are RGBA.
- Required execution sub-skill: imagegen for the mural source. Do not invoke tools/imagegen.sh or codex exec.

- [ ] **Step 1: Amend the art bible before generation**

Add this normative section:

~~~markdown
## Emberglass Rose Window

All eight files are 1024×1024 and share one coordinate system. Pane order is clockwise from the top:

1. paleOnes — three pale figures carrying a cold shard down a black stair
2. ownShade — a standing memorial shadow facing its living self
3. usurper — an empty lantern held beneath a false crown
4. eighthOmen — seven readable marks broken by an eighth dark stroke
5. unreadablePage — five pages turning into one stair-map
6. hollowLamplighter — a gaunt keeper surrendering the last flame

The complete mural is one continuous scene: the six lower symbols converge into a black-and-gold stair above the Eternal Sovereign's crown; at the top is a sealed obsidian door with a thin white-gold seam. No readable text, UI, logo, card frame, modern architecture, church congregation, or playable Act 4 scene.

emberglass-frame is transparent black lead: two circular rims, a small central boss, and six broad equal radial panes. Masks are binary-alpha derivatives of the approved frame geometry, never independently generated. The title medallion is the same composite at small scale. If any file is absent, gameplay uses the labelled fallback.
~~~

- [ ] **Step 2: Generate the mural source with the exact prompt**

Invoke the built-in image tool directly with:

~~~text
Use case: stylized-concept
Asset type: Spirebound meta mural, opaque square full-scene art
Primary request: Create one 1024 x 1024 square stained-glass mural designed to sit behind a six-pane circular rose-window frame. It must read as one continuous scene: six lower narrative symbols converge into a black-and-gold stair rising above the broken crown of the Eternal Sovereign, ending at a sealed obsidian door with one thin white-gold seam. Around the circle include, clockwise from the top, three pale figures carrying a cold shard down a black stair; a standing memorial shadow facing its living self; an empty lantern beneath a false crown; seven readable abstract marks broken by an eighth dark stroke; five pages turning into one stair-map; and a gaunt lamplighter surrendering the last flame.
Style/medium: serious cartoon-gothic dark-fantasy stained glass; chunky dark lead contours; six large readable colour masses; matte painterly glass texture; thumbnail-readable; restrained cathedral geometry, not ornate church decoration.
Palette: black obsidian, smoke violet, cold cyan, dead white, tarnished gold, one restrained ember-orange focal seam.
Composition: central door and stair remain readable through six equal radial pane masks; keep important subjects away from pane boundaries and the central 14 percent boss; no outer frame because a deterministic lead frame will be overlaid.
Constraints: opaque square artwork; no text, letters, numbers, labels, logo, watermark, UI, card frame, people worshipping, modern architecture, open door, landscape beyond the door, or playable Act 4 scene.
~~~

Save the returned source and generated ID evidence under scratch/style-tests/emberglass-rose-window-20260709/. Run the fixed Nano Banana clean-up for a full-background scene, preserving the square composition and lowering background detail. Record source, prompt, generated ID, cleaned path, selection, and review verdict in prompt-ledger.md using apply_patch. Promote the accepted cleaned mural to src/assets/meta/emberglass-mural.png. If generation is unavailable, mark this task BLOCKED and leave the fallback intact; never fabricate an asset.

Use this exact Nano Banana prompt:

~~~text
帮我将这张图片重绘和清晰化，让它细节更丰富，同时去掉原图中杂乱不必要的细节。重要：这次不做 alpha、chroma-key、cutout 或透明背景控制；请严格保留完整的 1:1 Spirebound Emberglass mural、六个径向叙事区域、中央黑金阶梯和顶部封闭的黑曜石门。加强粗黑 lead contours 和六个大色块，减少碎玻璃、微小装饰和背景噪音，让 160px 仍能读到阶梯与封闭门。背景对比度必须低于六个主体。保留黑曜石、烟紫、冷青、死白、旧金和单一 ember-orange 门缝。不要加入文字、数字、UI、logo、水印、开放的门、门后风景、第七个 pane、教堂人群或可游玩的 Act 4 场景。
~~~

- [ ] **Step 3: Create the deterministic frame/mask generator**

Create tools/gen-emberglass-frame.py with this complete implementation:

~~~python
#!/usr/bin/env python3
from pathlib import Path
from PIL import Image, ImageDraw

N = 1024
C = N // 2
OUT = Path(__file__).resolve().parents[1] / "src/assets/meta"
QUESTS = [
    "paleOnes", "ownShade", "usurper",
    "eighthOmen", "unreadablePage", "hollowLamplighter",
]
OUT.mkdir(parents=True, exist_ok=True)

frame = Image.new("RGBA", (N, N), (0, 0, 0, 0))
d = ImageDraw.Draw(frame)
lead = (6, 7, 12, 255)
gold = (92, 73, 36, 255)
outer = (82, 82, 942, 942)
inner = (132, 132, 892, 892)
boss = (442, 442, 582, 582)
d.ellipse(outer, outline=lead, width=34)
d.ellipse(inner, outline=gold, width=8)
d.ellipse(boss, outline=lead, width=28)
for i in range(6):
    angle = -120 + i * 60
    import math
    x1 = C + int(70 * math.cos(math.radians(angle)))
    y1 = C + int(70 * math.sin(math.radians(angle)))
    x2 = C + int(430 * math.cos(math.radians(angle)))
    y2 = C + int(430 * math.sin(math.radians(angle)))
    d.line((x1, y1, x2, y2), fill=lead, width=28)
frame.save(OUT / "emberglass-frame.png")

for i, quest in enumerate(QUESTS):
    alpha = Image.new("L", (N, N), 0)
    a = ImageDraw.Draw(alpha)
    start = -120 + i * 60 + 2
    end = start + 56
    a.pieslice(inner, start=start, end=end, fill=255)
    a.ellipse(boss, fill=0)
    rgba = Image.new("RGBA", (N, N), (255, 255, 255, 0))
    rgba.putalpha(alpha)
    rgba.save(OUT / ("emberglass-mask-" + quest + ".png"))
~~~

Run:

~~~bash
python3 tools/gen-emberglass-frame.py
python3 - <<'PY'
from pathlib import Path
from PIL import Image
for p in sorted(Path("src/assets/meta").glob("emberglass-*.png")):
    im = Image.open(p)
    assert im.size == (1024, 1024), (p, im.size)
    print(p, im.mode, im.size)
PY
~~~

Expected: eight 1024×1024 files; frame/masks RGBA; mural RGB or RGBA.

- [ ] **Step 4: Register and visually review the atomic set**

Add all eight IDs to the meta gallery list in ui.js. In src/assets/README.md record the atomic/fallback rule and exact generator command.

Open http://localhost:5174/?gallery=1 and then the seeded Rose Window in desktop, phone portrait, and phone landscape. Reject if:
- any important subject crosses into the wrong mask;
- frame/mask edges differ by more than one pixel;
- the door reads as open;
- text or a seventh pane appears;
- the 160 px medallion loses the sealed-door/stair silhouette.

- [ ] **Step 5: Run atomic art tests and commit**

Extend the test imports with `spawnSync` from node:child_process and `fileURLToPath` from node:url, then add this block inside the existing asset-manifest scope immediately after the meta check (where assetIds is available):

~~~js
{
  const roseIds = [
    'emberglass-mural', 'emberglass-frame',
    ...QUEST_IDS.map((id) => 'emberglass-mask-' + id),
  ];
  const present = roseIds.filter((id) => assetIds('meta').has(id));
  assert.ok(present.length === 0 || present.length === roseIds.length,
    `Rose assets are atomic: found ${present.length}/${roseIds.length}`);
  if (present.length) {
    const files = roseIds.map((id) => fileURLToPath(
      new URL(`../src/assets/meta/${id}.png`, import.meta.url)));
    const check = String.raw`
import sys
from PIL import Image
for path in sys.argv[1:]:
    image = Image.open(path)
    assert image.size == (1024, 1024), (path, image.size)
    if path.endswith('emberglass-mural.png'):
        assert image.mode in ('RGB', 'RGBA'), (path, image.mode)
        if image.mode == 'RGBA':
            assert image.getchannel('A').getextrema() == (255, 255), path
    else:
        assert image.mode == 'RGBA', (path, image.mode)
        assert image.getchannel('A').getextrema() == (0, 255), path
`;
    const checked = spawnSync('python3', ['-c', check, ...files], { encoding: 'utf8' });
    assert.equal(checked.status, 0, checked.stderr || checked.stdout);
  }
}
~~~

This allows zero Rose files or all eight and fails a partial set. It asserts every image is 1024×1024, frame/masks have transparent and opaque alpha, and an RGBA mural is fully opaque. Dark corners remain valid.

Run: npm test && npm run build -- --outDir /tmp/spirebound-phase2-build --emptyOutDir
Expected: PASS, gallery loads every file, and no orphan manifest failure.

~~~bash
git add docs/meta-art-bible.md src/assets/README.md tools/gen-emberglass-frame.py src/assets/meta/emberglass-*.png src/ui.js test/test_engine.js
git commit -m "Add the Emberglass Rose Window art set"
~~~

---

### Task 13: Prove and tune the 20-win / 50-win pacing target

**Files:**
- Create: tools/emberglass-pacing.mjs
- Modify: package.json (add test:progression)

**Interfaces:**
- Consumes only public data/vigil/engine exports from Tasks 1-10.
- Produces deterministic medians and p10/p90 for guided and unguided models.
- Acceptance: guided median 18-24 wins; unguided median 40-65 wins; at least 1,980 of 2,000 runs in each model complete by 100 wins.

- [ ] **Step 1: Create the simulator against real transitions**

The simulator must:
1. run 2,000 seeds per model;
2. use the public shop, reward, monument, combat-death, Hollow-price, run-end, and persistence APIs rather than advancing quest counters directly;
3. model one successful summit per counted iteration; qualifying Shade deaths are real additional failed runs and therefore raise runsPlayed but not the reported win metric;
4. never assign a quest state or shard directly;
5. use these player policies:

~~~js
const POLICY = {
  guided: {
    shadeChance: 0.5, usurperChance: 0.5,
    pageChance: 1, visitUnlitChance: 1,
  },
  unguided: {
    palePostLensChance: 0.1,
    shadeChance: 0.12, usurperChance: 0.08,
    pageChance: 0.15, visitUnlitChance: 0.25,
  },
};
~~~

Use this complete tools/emberglass-pacing.mjs implementation:

~~~js
import { PROGRESSION, QUEST_IDS } from '../src/data.js';
import {
  newRun, cardData, drawCards, playCard, startCombat, genMap, rollEncounter,
  visitNode, gainEmbers, genShop, buyQuestItem, rollCardReward, addCardToDeck,
  markShadeFall, claimMonument, applyBoon, payHollowPrice,
} from '../src/engine.js';
import {
  _setStore, _setRng, loadVigil, questSnapshot, revealSnapshot,
  commitRunToVigil, commitRunEnd, setBequest, clearBequest,
} from '../src/vigil.js';

const N = 2000;
const MAX_WINS = 100;
const POLICY = {
  guided: {
    shadeChance: 0.5, usurperChance: 0.5,
    pageChance: 1, visitUnlitChance: 1,
  },
  unguided: {
    palePostLensChance: 0.1,
    shadeChance: 0.12, usurperChance: 0.08,
    pageChance: 0.15, visitUnlitChance: 0.25,
  },
};

function mulberry32(seed) {
  return () => {
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const active = (q) => q && (q.state === 'armed' || q.state === 'revealed');

function killWithRealCombat(run, enemyId, kind = 'monster') {
  const cb = startCombat(run, [enemyId], kind);
  cb.enemies[0].hp = 1;
  cb.player.energy = 99;
  let attack = cb.hand.find((c) => cardData(c).type === 'attack' && !cardData(c).unplayable);
  for (let i = 0; !attack && i < 20; i++) {
    drawCards(run, cb, 1);
    attack = cb.hand.find((c) => cardData(c).type === 'attack' && !cardData(c).unplayable);
  }
  if (!attack || !playCard(run, cb, attack.uid, 0) || cb.result !== 'win') {
    throw new Error('pacing combat fixture failed against ' + enemyId);
  }
  return cb;
}

function maybeCreateStandingFall(v, mode, rng, seed) {
  const p = POLICY[mode];
  if (!active(v.quests.ownShade) || v.lastFall?.standing || rng() >= p.shadeChance) return v;
  const fall = newRun(seed, {
    quests: questSnapshot(v), shards: v.shards, unlocks: v.unlocks,
    reveals: revealSnapshot(v), monument: v.lastFall,
  });
  fall.act = 1;
  if (!markShadeFall(fall, 1, 7)) throw new Error('Shade fall hook did not arm');
  commitRunToVigil(fall, false);
  commitRunEnd(fall, 'death');
  setBequest(1, 7, { kind: 'gold', amount: 50 });
  return loadVigil();
}

function pursuePale(run, mode, rng) {
  const q = run.quests.paleOnes;
  if (!active(q)) return;
  const lens = run.unlocks.includes('insight:witchlightLens');
  if (!lens) {
    const node = run.map.nodes.find((n) => n.type === 'monster');
    const ids = rollEncounter(run, 'monster', node?.row || 0, node);
    const pale = ids.find((id) => id.startsWith('pale'));
    if (!pale) throw new Error('guaranteed pre-Lens Pale encounter missing');
    killWithRealCombat(run, pale);
    return;
  }
  for (const act of [0, 1]) {
    run.act = act;
    run.map = genMap(run);
    const node = run.map.nodes.find((n) => n.questVariantId);
    if (!node) continue;
    if (mode === 'guided' || rng() < POLICY.unguided.palePostLensChance) {
      killWithRealCombat(run, rollEncounter(run, 'monster', node.row, node)[0]);
    }
  }
}

function pursueShade(run, vigil) {
  if (!active(run.quests.ownShade) || !vigil.lastFall?.standing) return;
  const duel = claimMonument(run);
  if (!duel || duel.kind !== 'shadeDuel') throw new Error('standing monument did not create a duel');
  clearBequest();
  killWithRealCombat(run, duel.variantId);
}

function pursueUsurper(run, mode, rng) {
  if (!active(run.quests.usurper) || rng() >= POLICY[mode].usurperChance) return;
  run.act = PROGRESSION.emberglass.usurper.minShopAct;
  const shop = genShop(run);
  if (!shop.questItems.some((item) => item.id === 'flamelessLantern')) {
    throw new Error('Usurper shop item missing');
  }
  run.player.gold = Math.max(run.player.gold, PROGRESSION.emberglass.usurper.price);
  if (!buyQuestItem(run, 'flamelessLantern').ok) throw new Error('Usurper purchase failed');
}

function pursuePage(run, mode, rng) {
  if (!active(run.quests.unreadablePage) || rng() >= POLICY[mode].pageChance) return;
  rollCardReward(run, 'normal');
  const second = rollCardReward(run, 'normal');
  if (!second.includes('unreadablePage')) throw new Error('second reward did not offer Page');
  addCardToDeck(run, 'unreadablePage');
}

function findUnlit(run) {
  for (const act of [0, 1, 2]) {
    run.act = act;
    run.map = genMap(run);
    const node = run.map.nodes.find((n) => n.unlit);
    if (node) return node;
  }
  throw new Error('eligible run generated no unlit node');
}

function pursueHollow(run, mode, rng) {
  const q = run.quests.hollowLamplighter;
  if (!active(q)) return;
  if (q.memory.emberDebt > 0) {
    const cb = startCombat(run, ['sporeling']);
    gainEmbers(run, cb, q.memory.emberDebt);
    return;
  }
  if (!run.questScratch.hollowLamplighter?.due ||
      rng() >= POLICY[mode].visitUnlitChance) return;
  const node = findUnlit(run);
  const visit = visitNode(run, node);
  if (!visit.hollow || !run.pendingHollow) throw new Error('Hollow visit hook failed');
  if (q.progress === 1) run.player.gold = Math.max(run.player.gold, PROGRESSION.emberglass.hollowLamplighter.gold);
  if (q.progress === 2) {
    run.player.maxHp = Math.max(run.player.maxHp,
      PROGRESSION.emberglass.hollowLamplighter.minMaxHpAfter + PROGRESSION.emberglass.hollowLamplighter.maxHp);
    run.player.hp = run.player.maxHp;
  }
  if (q.progress === 3 && !run.boonReceipt) applyBoon(run, 'fullPurse');
  const paid = payHollowPrice(run);
  if (!paid.ok) throw new Error('Hollow price failed at progress ' + q.progress);
  if (paid.deferred) {
    const cb = startCombat(run, ['sporeling']);
    gainEmbers(run, cb, PROGRESSION.emberglass.hollowLamplighter.emberDebt);
  }
  run.pendingHollow = null;
}

function finishSummit(run) {
  run.act = 2;
  run.map = genMap(run);
  const [bossId] = rollEncounter(run, 'boss', 14);
  killWithRealCombat(run, bossId, 'boss');
}

function simulate(mode, seed) {
  _setStore(null);
  const rng = mulberry32(seed);
  _setRng(mulberry32(seed ^ 0x5f3759df));
  for (let win = 1; win <= MAX_WINS; win++) {
    let v = loadVigil();
    v = maybeCreateStandingFall(v, mode, rng, seed * 10000 + win * 2);
    const run = newRun(seed * 10000 + win * 2 + 1, {
      quests: questSnapshot(v), shards: v.shards, unlocks: v.unlocks,
      reveals: revealSnapshot(v), monument: v.lastFall,
    });
    pursuePale(run, mode, rng);
    pursueShade(run, v);
    pursueUsurper(run, mode, rng);
    pursuePage(run, mode, rng);
    pursueHollow(run, mode, rng);
    finishSummit(run);
    commitRunToVigil(run, true);
    const out = commitRunEnd(run, 'win');
    if (out.vigil.shards.length === QUEST_IDS.length) return out.vigil.deeds.wins;
  }
  return null;
}

const percentile = (xs, p) => xs[Math.floor((xs.length - 1) * p)];
function report(mode) {
  const raw = Array.from({ length: N }, (_, i) => simulate(mode, 20260709 + i));
  const wins = raw.filter(Number.isFinite).sort((a, b) => a - b);
  const result = {
    complete: wins.length,
    p10: percentile(wins, 0.1),
    median: percentile(wins, 0.5),
    p90: percentile(wins, 0.9),
  };
  console.log(mode + ': median=' + result.median + ' p10=' + result.p10 +
    ' p90=' + result.p90 + ' complete=' + result.complete + '/' + N);
  return result;
}

const guided = report('guided');
const unguided = report('unguided');
const pass =
  guided.complete >= 1980 && guided.median >= 18 && guided.median <= 24 &&
  unguided.complete >= 1980 && unguided.median >= 40 && unguided.median <= 65;
_setRng(null);
_setStore(null);
if (!pass) process.exitCode = 1;
~~~

The script assigns only scenario resources/act position and enemy HP; every quest transition comes from the same public hook used by live play. It never assigns quest state, progress, memory, or shards, and stops at six shards. It prints exactly:

~~~text
guided: median=INTEGER p10=INTEGER p90=INTEGER complete=INTEGER/2000
unguided: median=INTEGER p10=INTEGER p90=INTEGER complete=INTEGER/2000
~~~

- [ ] **Step 2: Add and run the script**

Add:

~~~json
"test:progression": "node tools/emberglass-pacing.mjs"
~~~

Run: npm run test:progression
Expected: both deterministic lines print. If both acceptance bands already pass, skip Step 3; otherwise the command exits 1 and Step 3 changes data only.

- [ ] **Step 3: Tune data only**

If the guided median is below 18, lower Hollow appearanceChance no lower than 0.4, raise pityEligibleRuns no higher than 3, or lower markedAct2Chance no lower than 0.4. If it is above 24, reverse those changes up to 0.6, 2, and 0.6 respectively. If the unguided median is outside 40-65, adjust only those same three real data tunables, one at a time, rerunning both models after each change. Do not change quest target counts, arm wins, offer ordinal, or simulation policy to make the test pass.

Record the accepted values in a short comment beside PROGRESSION.emberglass. No engine/UI refactor is allowed in this step.

- [ ] **Step 4: Run regression and reproducibility gates**

Run twice:

~~~bash
npm run test:progression
npm run test:progression
npm test
~~~

Expected: identical percentile output on both simulator runs; npm test PASS.

- [ ] **Step 5: Commit**

~~~bash
git add tools/emberglass-pacing.mjs package.json src/data.js
git commit -m "Tune Emberglass progression to the long-game target"
~~~

---

### Task 14: Full Playwright, manual journey, docs, and tracked dist

**Files:**
- Modify: test/e2e/emberglass.spec.js
- Modify: test/e2e/geometry.spec.js
- Modify: test/e2e/stage.spec.js
- Modify: test/e2e/visual.spec.js
- Modify: test/e2e/visual.spec.js-snapshots/
- Modify: docs/README.md
- Modify: dist/ (generated)
- Create: docs/superpowers/reports/2026-07-09-emberglass-phase2-evidence.md

**Interfaces:**
- Consumes every Phase 2 surface.
- Produces the final go/no-go evidence and only then the tracked distribution.

- [ ] **Step 1: Finish behavioural and geometry coverage**

Append to geometry.spec.js; existing `measure`, `assertGrounded`, `collectErrors`, and `expectNoErrors` are reused:

~~~js
for (const variant of [
  { id: 'paleDuskfang', act: 0 },
  { id: 'usurpedSovereign', act: 2 },
]) {
  test(`scaled variant keeps its feet and chrome inside the stage — ${variant.id}`, async ({ page }) => {
    const errors = collectErrors(page);
    await boot(page, { query: 'mesh=0' });
    await page.evaluate((act) => { window.spirebound.S.run.act = act; }, variant.act);
    await startFight(page, [variant.id], variant.act === 2 ? 'boss' : 'monster');
    await stable(page);
    assertGrounded(await measure(page), variant.id);
    const outside = await page.evaluate(() => {
      const stage = document.getElementById('stage').getBoundingClientRect();
      return [...document.querySelectorAll(
        '.hero-wrap,.enemy,.energy-orb,.lantern-btn,.end-turn,.pile-btn,.variant-dialogue')]
        .filter((el) => {
          const r = el.getBoundingClientRect();
          return r.left < stage.left - 2 || r.right > stage.right + 2 ||
            r.top < stage.top - 2 || r.bottom > stage.bottom + 2;
        })
        .map((el) => el.className);
    });
    expect(outside).toEqual([]);
    expectNoErrors(errors, variant.id);
  });
}
~~~

Because geometry.spec.js runs in all three Playwright projects, this pins desktop, portrait, and landscape.

In stage.spec.js import `completeLedger` and `seed` from emberglass-fixtures.js and extract the existing scan body into:

~~~js
async function expectNoOverflow(page, label) {
  const bad = await page.evaluate(() => {
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
  expect(bad, `${label}: ${bad.join('; ')}`).toEqual([]);
}
~~~

Add this all-project maximum-state test:

~~~js
test('maximum Emberglass profile and ceremonies fit every stage', async ({ page }) => {
  const v = completeLedger();
  v.unlocks = ['aspect2'];
  v.vowUnlocked = 5;
  v.deeds.bestVow = 5;
  await seed(page, v);
  await page.evaluate(() => {
    const sp = window.spirebound;
    sp.E.saveRun(sp.E.newRun(7001, { aspect: 1, vow: 5 }));
    sp.show('title');
  });
  await expectNoOverflow(page, 'title');
  await page.click('[data-a="vigil"]');
  await expectNoOverflow(page, 'Vigil Deeds');
  await page.click('[data-a="tab-rose"]');
  await page.waitForSelector('.rose-window.ready');
  await expectNoOverflow(page, 'Vigil Rose');

  await page.evaluate(() => {
    const sp = window.spirebound;
    const v = JSON.parse(localStorage.getItem('spirebound_vigil_v2'));
    sp.S.run = sp.E.newRun(7002, {
      reveals: ['omens', 'phials', 'poolWave2', 'poolWave3', 'poolFull', 'emberglass', 'act4'],
      quests: v.quests, shards: v.shards,
    });
    sp.S.run.act = 2;
    sp.S.run.map = sp.E.genMap(sp.S.run);
    sp.show('map');
  });
  await page.click('[data-a="sealed-door"]');
  await expectNoOverflow(page, 'sealed door');

  await page.evaluate(() => {
    const sp = window.spirebound;
    const v = JSON.parse(localStorage.getItem('spirebound_vigil_v2'));
    sp.S.run = sp.E.newRun(7003, { quests: v.quests, shards: v.shards });
    sp.S.run.endQueue = [
      { t: 'pageRead', index: 5, text: 'FIFTH PAGE — The Rose Window is a map, not a memorial. Light it, then look above the crown.' },
      { t: 'questComplete', id: 'unreadablePage' },
    ];
    sp.show('end', {
      won: true, newUnlocks: [],
      ledger: { whisper: 'The climb continues.', newShards: ['unreadablePage'], vigil: v },
    });
  });
  await page.waitForSelector('.dawn-ceremony.complete');
  await expectNoOverflow(page, 'dawn ceremony');
});
~~~

After Task 12 has promoted the complete art set, append this behavioural case to emberglass.spec.js so the non-fallback title route is covered:

~~~js
test('one shard adds a title medallion that opens the Rose', async ({ page }) => {
  const v = mixedLedger();
  await seed(page, v);
  await expect(page.locator('.title-rose-medallion[data-a="rose"]')).toHaveCount(1);
  await page.click('[data-a="rose"]');
  await expect(page.locator('[data-a="tab-rose"]')).toHaveClass(/active/);
  await expect(page.locator('.rose-window.ready')).toHaveCount(1);
});
~~~

Run:

~~~bash
npx playwright test test/e2e/emberglass.spec.js --project=desktop --reporter=list
npx playwright test test/e2e/battle.spec.js --project=desktop --reporter=list
npx playwright test test/e2e/geometry.spec.js --reporter=list
npx playwright test test/e2e/stage.spec.js --reporter=list
~~~

Expected: all PASS.

- [ ] **Step 2: Add and review visual baselines**

Import `mixedLedger`, `completeLedger`, and `seed` from emberglass-fixtures.js, then append:

~~~js
test('title with Emberglass medallion', async ({ page }) => {
  await seed(page, mixedLedger());
  await page.waitForSelector('.title-rose-medallion[data-a="rose"]');
  await shoot(page, 'title-emberglass');
});

test('Rose Window with mixed disclosure states', async ({ page }) => {
  const v = mixedLedger();
  v.whispers = 12;
  await seed(page, v);
  await page.click('[data-a="vigil"]');
  await page.click('[data-a="tab-rose"]');
  await page.waitForSelector('.rose-window.ready');
  await shoot(page, 'rose-window');
});

test('sealed summit promise', async ({ page }) => {
  const v = completeLedger();
  await seed(page, v);
  await page.evaluate(() => {
    const sp = window.spirebound;
    const v = JSON.parse(localStorage.getItem('spirebound_vigil_v2'));
    sp.S.run = sp.E.newRun(7100, {
      reveals: ['omens', 'phials', 'poolWave2', 'poolWave3', 'poolFull', 'emberglass', 'act4'],
      quests: v.quests, shards: v.shards,
    });
    sp.S.run.act = 2;
    sp.S.run.map = sp.E.genMap(sp.S.run);
    sp.show('map');
  });
  await waitMapSettled(page);
  await page.click('[data-a="sealed-door"]');
  await page.waitForSelector('.sealed-door-panel');
  await shoot(page, 'sealed-door');
});
~~~

The `.rose-window.ready` wait is mandatory because CSS masks/backgrounds are not covered by img.decode in stable(). The ordinary fresh title baseline must not change.

Capture on the canonical Linux snapshot runner:

~~~bash
npx playwright test test/e2e/visual.spec.js --update-snapshots --reporter=list
~~~

Expected: only the three named Phase 2 baselines are new or intentionally changed. Do not accept unrelated macOS re-renders.

- [ ] **Step 3: Run the manual GUI smoke and record evidence**

With npm run dev on port 5174, record one demo video and the exact observed state in the evidence report:

1. Wiped profile has no Rose tab/medallion.
2. Seed win 1; next run's first ordinary fight is an unmarked Pale variant.
3. First contact reveals ??? → inscription; three kills add insight:witchlightLens; the next map visibly marks a Pale node.
4. Seed each remaining quest and prove one real hook: standing Shade duel, unaffordable/bought lantern, Eighth broken banner/affix, second reward Page, Hollow unlit meeting/ember tithe.
5. Open a mixed Rose fallback with the eight art files temporarily moved outside src/assets, then restore them and prove the full mural.
6. Earn the sixth shard; title medallion opens Rose; Act 3 summit door opens one panel and remains Act 3.
7. Reload during a pending variant fight and confirm the same variant ID resumes.
8. Confirm the hidden Phase 2 music cues remain unwired.

Do not claim a gate closed without the video path and exact command outputs in the report.

- [ ] **Step 4: Run the complete release gate**

~~~bash
npm test
npm run test:progression
npm run build
npm run test:e2e
npm run test:e2e:perf
git diff --check
~~~

Expected:
- npm test ends with 300-run Monte Carlo success;
- both pacing bands pass;
- all Playwright projects pass;
- perf remains average >=55 fps and p95 <=22 ms;
- build succeeds;
- diff check prints nothing.

- [ ] **Step 5: Update docs, write the evidence verdict, and commit exact paths**

In docs/README.md replace the current spec row and insert the Phase 2 plan/report rows with exactly:

~~~markdown
| [`superpowers/specs/2026-07-09-entrance-progressive-delivery-design.md`](superpowers/specs/2026-07-09-entrance-progressive-delivery-design.md) | **Complete** — progressive delivery and entrances shipped in Phase 1; Emberglass chain shipped in Phase 2 |
| [`superpowers/plans/2026-07-09-entrance-progressive-delivery-phase1.md`](superpowers/plans/2026-07-09-entrance-progressive-delivery-phase1.md) | Executor plan, Phase 1 (delivery engine + entrances — **shipped**) |
| [`superpowers/plans/2026-07-09-entrance-progressive-delivery-phase2.md`](superpowers/plans/2026-07-09-entrance-progressive-delivery-phase2.md) | Executor plan, Phase 2 (variants + six Emberglass quests + Rose Window — **shipped**) |
| [`superpowers/reports/2026-07-09-emberglass-phase2-evidence.md`](superpowers/reports/2026-07-09-emberglass-phase2-evidence.md) | Phase 2 release evidence: pacing, unit/build/e2e/perf gates, art review, and manual journey |
~~~

Write the evidence report with these exact headings, pasting unedited command output beneath each gate and recording `GO` only if every acceptance statement is true:

~~~markdown
# Emberglass Phase 2 Evidence

## Verdict
## Implemented commits
## Unit and save-safety gate
## Guided and unguided pacing gate
## Production build gate
## Behavioural, geometry, stage, and visual Playwright gate
## Performance gate
## Rose art review
## Canonical snapshot host
## Manual journey and demo recording
## Known caveats
~~~

The report must contain the actual commit hashes, both percentile lines, snapshot OS/architecture, absolute or repository-relative demo path, the eight-asset review decision, and the fact that hidden Phase 2 cues remain unwired. A missing output or video is a `NO-GO`, not an empty section.

Task 14 Step 4 already performed the one tracked `npm run build` after source and art were final; documentation does not change the bundle. Inspect git status and stage exact paths only:

~~~bash
git add docs/README.md docs/superpowers/reports/2026-07-09-emberglass-phase2-evidence.md \
  test/e2e/emberglass.spec.js test/e2e/geometry.spec.js test/e2e/stage.spec.js \
  test/e2e/visual.spec.js test/e2e/visual.spec.js-snapshots dist
git commit -m "Verify and ship Emberglass Phase 2"
~~~

Do not stage unrelated audio/SFX/UI work from the original dirty checkout.

---

## Plan self-review checklist

1. **Spec coverage:** Task 1 fixes the taxonomy and owns all copy/tunables; Tasks 2-3 own persistence/save safety; Task 4 owns variants and mesh parity; Tasks 5-10 implement all six quests; Task 11 owns whispers, ceremonies, Rose, medallion, and door; Task 12 owns the atomic art set; Task 13 proves pacing; Task 14 owns automated/manual release evidence.
2. **Purity:** data/vigil/engine remain Node-safe and engine/vigil import data only. UI is the only DOM/audio orchestrator.
3. **Quest IDs:** paleOnes, ownShade, usurper, eighthOmen, unreadablePage, hollowLamplighter are identical in data, saves, masks, DOM selectors, tests, and progression.
4. **State names:** dormant, armed, revealed, complete only. Shards store quest IDs in earned order.
5. **Run outcome names:** win, death, abandon only.
6. **Variant identity:** requested variant ID is persisted; combat key/layout remains a base ENEMIES key; presentation carries art/tint/scale.
7. **Fallback:** Page, Eighth glyph, sealed door, and full Rose remain functional without new raster files; existing asset strictness is not weakened.
8. **Pacing:** target counts and arm cadence are not changed to game the model; only declared appearance, pity, and marked-node probabilities may be adjusted inside locked bounds.
9. **Act 4 boundary:** act4 reveals only a non-path emblem and promise panel.
10. **Audio boundary:** no Phase 2 cue is wired.
11. **Working tree:** plan creation changes only this plan file; execution begins in an isolated worktree and stages exact paths.
