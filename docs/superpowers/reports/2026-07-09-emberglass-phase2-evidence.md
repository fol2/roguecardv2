# Emberglass Phase 2 Evidence

Evidence was closed on 10 July 2026 from `codex/emberglass-phase2`. Final
application/test checkpoint `42757814480e84c1ab02b0857683054c6fe0b378`
is linearly based on current `main`
`d048640b962ccd17663e37bc0d1c8c5c692567b5`; `main` is its merge-base and the
checkpoint is 39 commits ahead, zero behind. All local browser gates used
isolated ports 5327–5345. Port 5174 was not reused or changed.

## Verdict

**GO.** Every Phase 2 acceptance item is implemented and evidenced: the enemy
variant engine, all six Emberglass quests, persistence/recovery, whispers and
dawn ceremonies, atomic Rose Window art and labelled fallback, title medallion,
sealed Act 3 promise, deterministic pacing, unit/save safety, production build,
complete Playwright matrix, unchanged performance budget, canonical Darwin and
Linux pixels, and the continuous manual journey.

## Implemented commits

Final rebased delivery order:

~~~text
421d33d Define Emberglass quests variants and authored copy
8648829 Hydrate Emberglass ledgers and arm quests on run end
73c6828 Harden Emberglass run-end persistence
e4cecd1 Persist quest snapshots and exact pending encounters
3437b74 Harden pending encounters and quest validation
0e58bd6 Harden terminal outbox finalisation
35aaec6 Validate persisted monument bequests
0d68f72 Add mesh-safe enemy variant presentation
9a5fc90 Correct variant shader colour transform
df80f2e Implement the Pale Ones Trail and Witchlight Lens
bc985dc Guard inactive Pale variant drops
6c24b65 Implement the three-stage Own Shade Trail
88543c2 Cover Shade transaction failure paths
3d81670 Add the flameless lantern and Usurper Gate
de56faa Harden Usurper shop session invariants
8ca42f4 Implement the Eighth Omen Gate
deeb4b2 Add the Unreadable Page Trail
921bedc Implement the Hollow Lamplighter Trail
65cc470 Harden Hollow exit transactions
01a9881 Close Hollow terminal and pad gates
b370651 Add Emberglass ceremonies Rose Window and sealed door
89a74e7 Harden Emberglass recovery and disclosures
f2c4977 Persist the dawn presentation outbox
8bbefce Add the Emberglass Rose Window art set
0304549 Harden Rose asset validation and readiness
9dab3ae Tune Emberglass progression to the long-game target
cc49a57 Harden Emberglass release surfaces
b03d2b9 Verify and ship Emberglass Phase 2
f2c6a23 Harden Phase 2 release guarantees
9c91e2b Close Phase 2 review findings
073402a Unify Phase 2 persistence recovery
3e0a38e Bound Phase 2 save compatibility
e4dd347 Refresh Phase 2 Rose baselines
e18badc Memoise failed SFX fallbacks
0f51c84 Prevent Rose pane label clipping
358281f Stabilise sealed door visual capture
9801ec7 Correct the Requiem performance fixture
b821739 Record final Emberglass evidence artefacts
4275781 Preserve sealed door visual timeout
~~~

The containing documentation commit deliberately is not self-referenced.

## Unit and save-safety gate

Command: `npm test`

~~~text
unit checks passed; monte-carlo: 300 runs, 1 random-agent wins, 299 deaths
~~~

This covers save-shape rejection, exact pending encounter/reward recovery,
terminal and dawn outboxes, quest receipts, monument/bequest validation,
variant presentation, Rose PNG parsing, inherited-key rejection, and the
existing audio/content contracts. Full output:
[`emberglass-phase2-unit.log`](artifacts/logs/emberglass-phase2-unit.log)
(SHA-256 `314c38f242ed0947c6a6ab40e1db53296cc2ad603f710be423e329c1a7947973`).

## Guided and unguided pacing gate

Command, run twice: `npm run test:progression`

~~~text
guided: median=18 p10=14 p90=22 complete=2000/2000
unguided: median=50 p10=37 p90=69 complete=1991/2000
~~~

Both 2,000-profile runs were byte-identical. Logs:
[`run 1`](artifacts/logs/emberglass-phase2-progression-1.log) and
[`run 2`](artifacts/logs/emberglass-phase2-progression-2.log), each SHA-256
`ed0e038b0da9c35db6895b38e8fe4ec9f7db4b0039cea48c4bcb1aa1a21f4e71`.

## Production build gate

Command: `npm run build`

~~~text
✓ 523 modules transformed.
dist/assets/index-DfL4Yp0p.css  126.69 kB │ gzip: 27.33 kB
dist/assets/index-Ch_Qq82P.js 1,005.63 kB │ gzip: 287.65 kB
✓ built in 949ms
~~~

The tracked `dist/` is byte-clean against checkpoint `4275781`. Vite's existing
chunk-size advisory is non-gating. Full output:
[`emberglass-phase2-build.log`](artifacts/logs/emberglass-phase2-build.log)
(SHA-256 `1bae0eb83e9c7a6db75b27f24a60ba9caeb066d6db6eb75f5d978a4590fa7f91`).

## Behavioural, geometry, stage, and visual Playwright gate

Command: `SPIREBOUND_E2E_PORT=5343 npm run test:e2e`

~~~text
test:e2e:disk          1 passed (4.9s)
test:e2e:random-agent  1 passed (1.2m)
test:e2e:main          151 passed, 146 expected project skips (4.1m)
test:e2e:visual        48 passed (2.9m)
~~~

The complete partitioned runner covered the disk-writing editor once, the long
random-agent once, the desktop/portrait/landscape behavioural matrix, and the
single-worker visual suite. It exercised all quest and recovery surfaces,
variant and ordinary combat geometry, reduced-motion/repeated refits, real
deaths, maximum-profile stage fit, title medallion, full/fallback Rose Window,
five canonical Rose-detail shapes, and the sealed-door action and pixels.
Full output:
[`emberglass-phase2-e2e.log`](artifacts/logs/emberglass-phase2-e2e.log)
(SHA-256 `384ee381e97b99046e90fb87377c7933ad7d4ed3fec6ed2df735ddf35ad46512`).
Final `git diff --check` exited 0 with no output.

## Performance gate

The unchanged budget is portrait/LITE, three enemies, two Requiem plays,
three-second rAF sampling, 4× CPU throttle, average at least 55 fps, and p95 at
most 22 ms.

The first two release attempts failed p95 at `88.65 fps / 28.4 ms` and
`85.33 fps / 29.1 ms`. Those failures are retained in
[`attempt 1`](artifacts/logs/emberglass-phase2-perf.log) and
[`attempt 2`](artifacts/logs/emberglass-phase2-perf-attempt-2.log). The same
failure reproduced on old checkpoint `b63c0d5`, ruling out a Phase 2 runtime
regression.

Root cause was a false fixture contract: Sporelings have 13–17 HP, so two
nine-damage Requiems killed all three and measured three complete death rites
despite the test saying corpses were excluded. The TDD red proved minimum HP 14
against the required `>18` invariant
([`fixture red`](artifacts/logs/emberglass-phase2-perf-fixture-red.log)). Commit
`9801ec7` uses three Duskfangs, asserts a three-enemy fixture and three survivors,
and uses the first rAF callback solely as the time baseline. It does not change
the product VFX or either budget number.

The raw diagnostic recorded a cold corrected fixture at `94.27 fps / 21.8 ms`
p95 and an effect-warmed fixture at `94.56 fps / 21.5 ms`; all enemies survived,
so no warm-up exception was needed. Diagnostic JSON:
[`emberglass-phase2-perf-diagnostic.json`](artifacts/logs/emberglass-phase2-perf-diagnostic.json)
(SHA-256 `58f0c4e765e87a1c0845b22899a23f22028934ce3f88306cd77d6fb86d064e46`).

Two consecutive final-checkpoint runs, with no other Playwright/WebGL process,
both passed:

~~~text
port 5344: PERF_RESULT {"avgFps":103.6,"p95FrameMs":20.9,"worstFrameMs":35.5,"frames":311,"project":"portrait"}
port 5345: PERF_RESULT {"avgFps":100.07,"p95FrameMs":21.3,"worstFrameMs":34.5,"frames":301,"project":"portrait"}
~~~

Logs: [`run 1`](artifacts/logs/emberglass-phase2-perf-final-1.log), SHA-256
`72a221f0d4e2b38bea7389daa08e9c1c5e3c44e992b2679a80535ddbc7bdd232`;
[`run 2`](artifacts/logs/emberglass-phase2-perf-final-2.log), SHA-256
`8ae45378c3e671086710bf20980a9adf213695d5d221e452927746885344b670`.
The host was an AC-powered Apple M4 Mac, macOS 26.5.2 arm64, with a 144 Hz
primary display, Node 22.23.1, npm 10.9.8, Playwright 1.61.1, and Chrome for
Testing 149.0.7827.55.

## Rose art review

**Accepted.** The atomic set is exactly eight 1024 × 1024 PNGs: one opaque RGB
mural, one RGBA frame, and six RGBA binary-alpha masks. The dependency-free PNG
gate rejects malformed, interlaced, partial, or non-binary-alpha assets. Exact
hashes are in [`rose-assets-sha256.txt`](artifacts/linux/rose-assets-sha256.txt);
the mural SHA-256 is
`1b3f2385bf228ec7eeb01d96e0d28ce4dbebaeeeba1c2bf21e6b37a7d924f162`.

The accepted frameless source edit is
`019f493d-568c-7142-b01a-1a90862c8e31/exec-fb91bc40-565f-45b2-b414-59033ce9352e.png`.
Authoring decisions and prompts remain in
[`prompt-ledger.md`](../../../scratch/style-tests/emberglass-rose-window-20260709/prompt-ledger.md).
The mural, frame, six panes, seven-plus-one Omen language, labels, and
"Shard recovered" controls were reviewed at authored size, thumbnail size, and
all five canonical stage shapes without clipping.

The real fallback origin physically removed all eight files and did not use the
test-only fallback switch. It produced no title medallion and one usable,
labelled six-pane fallback. Thus a partial art set can never leak into the UI.

## Canonical snapshot host

Darwin capture used checkpoint `0829fed`, macOS 26.5.2 arm64, Node 22.23.1,
npm 10.9.8, and Playwright 1.61.1. Update on port 5327 and immediate no-update
verification on 5328 each passed 48/48 with zero residual diff. Logs:
[`update`](artifacts/logs/emberglass-phase2-darwin-visual-update.log) and
[`verify`](artifacts/logs/emberglass-phase2-darwin-visual-verify.log).

Canonical Linux capture used the exact allow-listed `0829fed` source archive in
`mcr.microsoft.com/playwright:v1.61.1-noble` on Ubuntu 24.04.4 x86_64,
Node 24.17.0 and npm 11.13.0. Update on port 5314 and immediate no-update
verification on 5315 each passed 48/48. All 48 PNG checksums and runner records
are in [`artifacts/linux/`](artifacts/linux/). The complete archive is
[`emberglass-phase2-linux-visual-evidence-0829fed.tar.gz`](artifacts/linux/emberglass-phase2-linux-visual-evidence-0829fed.tar.gz),
SHA-256 `f24fb694d6ff2385f0e83e80bb660f3a693fe29b883d67a0b487ddca3ae7d87c`.
The Docker image digest is
`sha256:5b8f294aff9041b7191c34a4bab3ac270157a28774d4b0660e9743297b697e48`.
Sandbox lifecycle files prove permanent removal and an empty post-removal list.

The final checkpoint has the same `src` tree, visual-spec blob, Vite/Playwright
configuration, `index.html`, and `dist` tree as `0829fed`. The only changes on
those capture surfaces are the six reviewed Linux Rose baseline outputs copied
back from that exact run.

## Manual journey and demo recording

One continuous BrowserContext/Page recording used the complete origin at 5329
and a real eight-file-absent origin at 5330. It passed all eight chapters:

~~~text
1. Fresh profile: no Rose tab or title medallion.
2. Win-one hydration: first unmarked fight becomes paleDuskfang.
3. Contact, three motes, Lens, then a visibly marked Pale node.
4. Real Shade, lantern, Eighth, Page, and Hollow hooks.
5. Real missing-file fallback, then all eight full-art files decoded.
6. Sixth shard, title medallion, six lit panes, Act 3 promise only.
7. Exact pending usurpedSovereign survives save/load.
8. All eight Phase 2 cues remain registered but unwired.
BROWSER ERROR GATE: zero pageerror and console.error events.
~~~

Recording:
[`emberglass-phase2-manual-journey.webm`](artifacts/emberglass-phase2-manual-journey.webm),
VP8 1600 × 900 at 25 fps, 116.88 seconds, 14,327,646 bytes, SHA-256
`aecf172985966bb5c5ab6cdb24bb633f63d8c94ae472d9a57c79866a60e4bc92`.
Full decode read 2,922/2,922 frames with zero errors. The broad and detailed
contact sheets were visually inspected; the white sample is the intentional
transition flash. Journey log:
[`emberglass-phase2-manual-journey.log`](artifacts/logs/emberglass-phase2-manual-journey.log).

The unwired cue IDs are `roseWindow`, `paleOnes`, `shadeDuel`, `usurper`,
`eighthOmen`, `unreadablePage`, `hollowLamplighter`, and `sealedDoor`.

## Known caveats

- The eight Phase 2 Music Cues remain intentionally registered but unwired.
- The summit door is a non-path Act 3 promise; there is no playable Act 4.
- Rose delivery is atomic: one unavailable raster selects the complete labelled
  fallback.
- Darwin and Linux baselines remain host-specific and were verified separately.
- Vite's existing large-chunk advisory remains non-gating; build and performance
  budgets pass.
- `scratch/emberglass-phase2-manual-journey.mjs` is an unstaged local recorder,
  not a release deliverable.

Final source/environment provenance is in
[`emberglass-phase2-source-environment.txt`](artifacts/logs/emberglass-phase2-source-environment.txt).
The final artifact checksum manifest is
[`emberglass-phase2-final-sha256.txt`](artifacts/emberglass-phase2-final-sha256.txt),
SHA-256 `4c602e5b2a2fa9139007a7fc4149492a1986a446c4f4936f89e2c61a605b0626`.
