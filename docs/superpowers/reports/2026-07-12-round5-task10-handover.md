# Round 5 handover after Task 10

Date: 12 July 2026

Implementation branch: `jamesto/round5-production-engineering-continuation`

Implementation worktree:
`/Users/jamesto/Coding/roguecardv2/.worktrees/round5-production-engineering-continuation`

## Executive status

Round 5 is deliberately stopped immediately after Task 10 on the owner's
instruction. Task 10 is complete, committed, reviewed and fully gated. No Task
11 implementation file has been created or modified.

The safe implementation checkpoint is:

```text
b41bd0efe7e4e86827b08542f6243bad1791ffe1
test: freeze the pre-registry content oracle
```

The branch tip containing this report and the checked Task 10 plan boxes is the
documentation handover checkpoint; it is intentionally not self-referenced by
SHA inside its own commit. The next executor must start from that pushed branch
tip, confirm a clean worktree, and begin at **Task 11 Step 1**.

P1 is closed at `1eb0477a981ab24a789d72862f5e919bd8a32069`.
The P2 content-table freeze is **ACTIVE** and owned by PE. Until the Task 11–15
sequence closes it, parallel work is restricted to disjoint assets and
planning. Task 11 itself is Node-pure registry infrastructure and must not move
or edit the live content tables.

The current plan has no Tasks 3 or 4. The former Phase 0.5 mobile proof lane was
formally retired and moved to an independent future specification; the active
numbering therefore goes from Task 2 to Task 5.

## Canonical documents

Read these in order before changing code:

1. Repository `AGENTS.md` and `CONTEXT-MAP.md` from the checked-out handover
   branch.
2. [Round 5 golden specification](../specs/2026-07-09-canvas-ui-shipfront-design.md).
3. [Round 5 implementation plan](../plans/2026-07-10-round5-production-engineering.md),
   starting at Task 11.
4. This report.
5. [Deferred mobile migration tooling specification](../specs/2026-07-11-mobile-migration-simulator-tooling-design.md)
   only as an exclusion boundary. Do not activate it as part of Round 5.

The owner originally named the same spec and plan under
`.worktrees/round5-production-engineering`. That older worktree contains
unrelated user work and must not be used for continuation. The complete Task 11
plan block was compared read-only and is byte-identical between the old and
continuation worktrees. The continuation branch is the authoritative execution
line because it contains the isolated P1 and Task 10 commits.

## Exact starting procedure for the next agentic AI

Prefer the existing continuation worktree:

```bash
cd /Users/jamesto/Coding/roguecardv2/.worktrees/round5-production-engineering-continuation
git fetch origin
git status --short
git branch --show-current
git rev-parse HEAD
git rev-parse origin/jamesto/round5-production-engineering-continuation
git merge-base --is-ancestor b41bd0efe7e4e86827b08542f6243bad1791ffe1 HEAD
```

Required results:

- branch is `jamesto/round5-production-engineering-continuation`;
- local and remote branch tips are equal after `git pull --ff-only`, if a pull
  is needed;
- `git status --short` is empty;
- the `merge-base --is-ancestor` command exits zero;
- no detached `round5-oracle-9c4f` worktree exists.

Then run the cheap entry gate:

```bash
npm run test:ci
npm test
```

Only after those checks should the next executor add the Task 11 failing tests.
Do not run `--write` on the Task 10 oracle again. Later P2 tasks compare against
the frozen fixture; they preserve it rather than regenerate it.

If the next executor needs a new worktree instead of the existing one, create
it from the remote continuation branch under a new unique path. Never force
move, clean, reset or repurpose either existing Round 5 worktree.

## Task 10 delivered contract

### Exact committed scope

Only these paths belong to the implementation commit:

```text
tools/capture-content-oracle.mjs
test/fixtures/round5-content-oracle-v1.json
test/test_engine.js
```

No content table, engine implementation, UI implementation, asset, baseline or
`dist/` file changed.

### Immutable provenance

```text
source SHA       9c4f7e5624b1c7eae8eb6fd3e7c27ff5ec0df5f8
source tree      5e139b938b4948f9870228e59e5fad1d256a4707
capture parent   1eb0477a981ab24a789d72862f5e919bd8a32069
parent tree      513fe4214a56865228108be8e98cbec3b1843301
tool SHA-256     4ddb09cff7454a06c3fa7302b95cfec2b2eda11ba8d51fc8b5c14a73139618ee
test SHA-256     96efcda756dbf44f655b6a3aa4f3e4a8648540f9132d3501d6ba89854fb58270
fixture SHA-256  d4c7dbb0b13928eef4b68d50982b0705bb08cf036629316ebc9002e257c8afe0
fixture bytes    14,586,441
```

The capture tool:

- is import-safe and writes only through its guarded CLI;
- requires absolute source, capture and output paths;
- resolves and compares physical roots, rejects a false capture checkout and
  rejects source/capture symlink aliases to the same physical checkout;
- proves the executing tool is the tool under the claimed capture root;
- imports data, engine and i18n only from the selected source root;
- rejects missing or additional data exports;
- sorts object keys, preserves array order, omits functions from ordinary data,
  and rejects symbols, cycles and non-finite numbers;
- captures descriptors before values and does not execute unapproved getters;
- records the sole approved legacy accessor,
  `QUESTS.hollowLamplighter.target`;
- records PR #17, #21 and #22 provenance without treating geometry or pixels as
  content ownership.

The immutable fixture contains:

- 28 content exports plus four separate protocol exports;
- raw mechanics and locale-owned path projections;
- the exact seven i18n APIs, 18 content domains and 278 UI leaves;
- hydrated alias identity inventory and English catalogue provenance;
- 27 enemy AI definitions plus two Shade AI definitions;
- 15,870 full Cartesian AI cases with legal histories, true post-`def.ai`
  combatant snapshots and production Mulberry32 state;
- a distinct Sovereign sequence that separates AI mutation from caller-applied
  `moveKey` and history progression;
- 300 deterministic agent runs for seeds `2026071000..2026071299`, each with
  exactly outcome, act, floor, HP, deck ids, relic ids and the engine's
  `run.rngState`.

### TDD and review evidence

The original missing-fixture test failed with the expected `ENOENT`. Additional
review-led regression tests failed before each repair for:

- a false capture checkout;
- harness-written `moveKey` in regular AI snapshots;
- a source/capture symlink alias to the same physical checkout.

The final exact detached `9c4f7e5` `--check --expect-monolith` run passed and
the clean detached worktree was removed. Independent final reviews reported:

```text
spec compliance: PASS — zero findings
quality: PASS — no Critical or Important findings
WebKit-safe API review: PASS
```

Review repairs included using production `engine.makeRng()` state for AI,
descriptor-first getter inspection, compact one-line JSON, exact export
partition rejection, physical-root provenance, true post-call AI snapshots and
separate Sovereign harness progression.

### Final staged gate

The complete staged `p2-base` standing profile passed:

- `npm run test:ci`: PASS;
- `npm test`: PASS, 300 runs, 1 random-agent win and 299 deaths;
- focused desktop trace/battle/audio: 59 passed, 1 intentional skip;
- production trace: 4/4 passed;
- disk-writing battlefield editor: passed and restored both source files;
- isolated random-agent browser lane: 3/3 passed;
- main non-visual matrix: 255 passed, 201 expected skips;
- serial-heavy lane: 5/5 passed;
- progression: guided median 18, p10 14, p90 22, 2000/2000 complete;
  unguided median 50, p10 37, p90 69, 1991/2000 complete.

One first browser attempt timed out after 90 seconds on a blank dev-server boot
inside the `bfeditor-disk` dependency. It changed no source. The same isolated
case immediately passed 1/1 in 4.2 seconds on a fresh strict port; the complete
staged profile then passed, including the same dependency in 5.3 seconds and a
second disk lane in 4.3 seconds. Treat this as recorded transient boot evidence,
not as an open product defect. No snapshot was updated.

## Active constraints and protected state

1. **P2 content-table freeze remains ACTIVE.** Task 11 may add the registry
   kernel and tests, but must not edit `src/data.js`, the English catalogue or
   any live content definition. Task 12 owns the controlled re-homing.
2. **The oracle is immutable.** Never run Task 10 `--write` after the first
   content move. All later comparisons use the committed fixture.
3. **Phase 0.5 is retired.** Do not run iOS Simulator, actual Safari, physical
   devices, packaging or manual device alignment. Playwright Chromium/WebKit
   browser testing remains allowed but is not mobile-support proof.
4. **Front-end ownership stays narrow.** Tasks 31, 36 and 38 are FE-owned. PE
   owns the registry, Content Lab/Manager, refactors, CI, Pixi migration,
   integration and gates. Do not reclassify Content Manager or refactoring as
   FE work.
5. **Engine/UI separation is load-bearing.** Engine and vigil remain Node-safe;
   the engine emits queue events and the UI plays them back. Do not import
   browser/audio/stage modules into engine or vigil.
6. **Internal identifiers are stable.** Follow the checked-out `AGENTS.md` and
   `CONTEXT-MAP.md`; do not infer a repo/package/save/debug rename from display
   title work occurring in another worktree.
7. **Tracked `dist/` is deferred.** Do not rebuild or commit `dist/` until the
   plan explicitly reaches Task 40.
8. **Preserve unrelated work.** Do not touch
   `.worktrees/round5-production-engineering`, other worktrees, or stash object
   `8bb1986381c481ba6414f08d40f81dc2b60848ca` named
   `deferred-mobile-simulator-tooling-research-2026-07-11`.

## Task 11 implementation map

Task 11 has no post-P1 plan drift. A read-only comparison found its complete
plan block byte-identical between the old and continuation worktrees. It is a
pure backend/Node task.

### Exact authorised write set

Create:

```text
src/registry.js
src/content-registration.js
src/i18n/hydrate-content.js
src/presentation-catalog.js
src/content-resources.js
src/ui/tokens.js
tools/compile-content-registrations.mjs
```

Modify:

```text
src/i18n/index.js
package.json
test/test_engine.js
test/test_module_boundaries.mjs
```

Do not touch in Task 11:

```text
src/data.js
src/i18n/en/content.js
src/engine.js
src/vigil.js
live content tables
browser UI owners
src/packs/compiled/production.js
src/packs/compiled/development.js
dist/
Simulator or mobile files
```

Task 12, not Task 11, generates and stages the compiled production and
development manifests.

### Recommended TDD order

1. Add the Task 11 failing registry, registration, schema and doctor tests and
   capture the expected `ERR_MODULE_NOT_FOUND` failure.
2. Extract the content-only hydration implementation while preserving
   `src/i18n/index.js`'s exact seven-export API and active-locale default.
3. Add and freeze the Node-pure presentation, audio, structural fallback and
   token resource catalogues, with import-boundary tests.
4. Implement descriptor-first snapshots, `CONTENT_SCHEMAS` and
   `ContentValidationError`; reject every unapproved accessor without invoking
   it.
5. Implement `definePack()`, mechanics-only `createContentRegistry()`, the exact
   merge policies, progression define/extend/feature flattening and every
   collision rule from the plan.
6. Implement `createContentContext()`: hydrate before deep freeze, preserve
   aliases, derive helpers and validate all cross-references.
7. Implement paired mechanics/locale registration validation, target
   selection, locale join, a single context-construction call, provenance and
   `withContentRegistration()`.
8. Implement the import-safe compiler and deterministic temporary-root
   `--check` tests. Do not require default production manifests yet.
9. Implement the pure doctor and stable problem formatter.
10. Run tests and both unstaged and staged `p2-base` standing gates; obtain
    independent spec and quality reviews before the Task 11 commit.

### Inventories to pin in Task 11

- 32 current data exports: 28 content plus four protocol exports.
- Seven current VFX ids: `blunt`, `fire`, `pierce`, `poison`, `slash`, `void`,
  `ward`.
- Nineteen character kinds: `beast`, `crab`, `crawler`, `cultist`, `eye`,
  `golem`, `knight`, `leviathan`, `maw`, `plant`, `rogue`, `serpent`, `shade`,
  `siren`, `slime`, `sovereign`, `treeboss`, `wisp`, `zombie`.
- 22 Music Cue ids and 36 SFX ids from the current catalogues.
- Sole behaviour functions: 27 enemy AI and two Shade AI functions, all arity
  one.
- Required aliases include `ASPECTS[0] === PLAYER`, progression variant/tier
  aliases and each reveal trigger's shared reveal-threshold object.

### Reconciliation alerts for the next executor

These are implementation cautions discovered during read-only reconnaissance;
resolve them against the exact Task 11 prose and tests before writing the
implementation:

1. The specification names a locale-owned theme `tagline`, while the current
   English `acts` rows contain only `name` and `bossName`, and Task 12 cannot
   edit that catalogue. Treat `tagline` as locale-owned but optional unless the
   golden contract is amended deliberately.
2. The Task 11 minimal theme fixture omits `bossPlates` and `lanternLights`, but
   Task 13's complete theme shape requires both. Prefer a forward-compatible
   schema/fixture that includes `lanternLights` and permits a frozen empty
   `bossPlates` object rather than changing schema during Task 13.
3. “Move `hydrateContent` byte-for-byte” conflicts with the current public
   function's default to the active bundle. Keep a content-only implementation
   that accepts explicit content, and let `i18n/index.js` retain a thin public
   wrapper preserving the active-bundle default and exact seven-API behaviour.
4. Doctor prose requires stable problem codes although one displayed example
   omits `code`. Include a stable `code` property together with the listed
   fields for every problem.
5. Structural fallback and token-id naming are underspecified. Derive and
   freeze inventories from their current single owners. Establish the
   Task-13-forward base colour/type/easing/token-id API, but do not transcribe
   the later `ROUND5_TOKENS` surface before its planned owner checkpoint.
6. No production registration modules exist yet. Exercise the compiler against
   temporary source roots; `p2-base` intentionally does not require the future
   production manifest check to pass in Task 11.

## Remaining task inventory

### P2 — registry and content equivalence

- Task 11 `[PE]`: implement the registry kernel, schemas and doctor.
- Task 12 `[PE]`: re-home the complete core pack without changing exports.
- Task 13 `[PE]`: extract theme consumers and enforce no act coupling.
- Task 14 `[PE]`: add the isolated dev/test sample pack and fourth-theme
  fixture.
- Task 15 `[PE]`: close P2 registry equivalence, doctor and documentation.

### P3 — authoring and developer surfaces

- Task 16 `[PE]`: bind ephemeral presentation/effects and add the pure Lab URL
  codec.
- Task 17 `[PE]`: build Content Lab, replay preview and live trace transcript.
- Task 18 `[PE]`: add the content doctor dashboard and dev launcher.
- Task 19 `[PE]`: add the optional schema-driven Content Manager.
- Task 20 `[PE]`: extend CI for trace, registries and Playwright WebKit.

### P4 — production Pixi runtime and combat chrome

- Task 21 `[PE]`: bootstrap the production Pixi runtime, tokens and recovery.
- Task 22 `[PE]`: migrate all combat chrome except the DOM hand.
- Task 23 `[PE]`: cut over the sole combat input router, tooltip and Probe v2.
- Task 24 `[PE]`: add P4 trace parity, WebKit, performance and recovery gates.
- Task 25 `[PE]`: close the P4 to P5 gate or select the P4 prefix exit.

### P5 — Pixi hand and combat completion

- Task 26 `[PE]`: build the single card-face composer and bounded cache.
- Task 27 `[PE]`: migrate the hand, targeting and keyboard path to Pixi.
- Task 28 `[PE]`: migrate all combat floaters, banners and pile ceremonies.
- Task 29 `[PE]`: enforce P5 DOM, cache, leak, performance and CI closure.
- Task 30 `[PE]`: close P5 and publish the P6 hand-off.

### P6 — ship-front screens

- Task 31 `[FE]`: author the exclusive Round 5 screen stylesheet.
- Task 32 `[PE]`: implement Title and Embark presentation seams.
- Task 33 `[PE]`: implement Fall and Dawn ceremonies.
- Task 34 `[PE]`: implement remaining P6 screens and deterministic capture.
- Task 35 `[PE]`: integrate FE CSS and produce P6 contact sheets.
- Task 36 `[FE]`: critique the P6 contact sheets mechanically.
- Task 37 `[PE]`: close P6 after the blocking owner checkpoint.

### P7 and final delivery

- Task 38 `[FE]`: author and promote the exact P7 visual package.
- Task 39 `[PE]`: integrate P7 assets and build the provisional ship-front kit.
- Task 40 `[PE]`: run the Full-Round gate, rebuild `dist/` and open the PR.

Tasks 31, 36 and 38 require the separate FE agent. Their work can run in
parallel only where the plan's ownership map proves the paths are disjoint.
Every other remaining task is PE-owned.

## Completed delivery history on this branch

Important stable checkpoints, in order:

```text
fd5b6789  docs: retire Round 5 Simulator phase
27e9486d  docs: close Round 5 retirement gate
a78e860f  feat: add the semantic UI behaviour trace
1d78574a  feat: trace real UI behaviour boundaries
1e093af6  refactor: extract the Phase 2 transaction seam
9531c09b  refactor: extract shared UI services
942c605d  refactor: extract non-combat UI screens
0a52abc2  docs: separate deferred mobile proof contracts
ce1de074  test: reconcile PR21 Darwin reward baselines
fc075a63  refactor: decompose the UI behind stable contracts
1eb0477a  docs: close Round 5 P1
b41bd0ef  test: freeze the pre-registry content oracle
```

The detailed intermediate planning/review commits remain in branch history;
do not squash or rebase them merely to shorten this list.

## Handover acceptance checklist

Before the next agent claims it has started Task 11, it should be able to state
all of the following truthfully:

- [ ] I am on the pushed continuation branch tip containing this report.
- [ ] My worktree is clean and I have not touched the older Round 5 worktree or
      the preserved stash.
- [ ] I read `AGENTS.md`, `CONTEXT-MAP.md`, the golden spec, Task 11 in full and
      this report.
- [ ] I understand that Phase 0.5 is retired and no mobile-device proof is in
      scope.
- [ ] I understand that the P2 content-table freeze is active.
- [ ] I will not regenerate the Task 10 oracle.
- [ ] I will begin with Task 11's failing tests and remain inside its exact
      eleven-path write set.
- [ ] I will keep Task 11 Node-pure and obtain independent spec/quality review
      plus unstaged and staged `p2-base` gates before committing.
