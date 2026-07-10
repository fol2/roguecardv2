# Emberglass Phase 2 Evidence

Evidence was captured on 10 July 2026 from `codex/emberglass-phase2` after integrating current `main` at `b3f55445eb95d14f6b3f5836225883c543b0d90f`. Browser gates used the isolated `SPIREBOUND_E2E_PORT=5194` path; no process on the normal development port 5174 was reused or changed.

## Verdict

**GO.** The unit/save-safety, deterministic pacing, production build, complete partitioned Playwright, performance, canonical Darwin/Linux visual, real missing-file fallback, manual journey, media-integrity, and diff-whitespace gates all passed. No acceptance item is outstanding.

## Implemented commits

Phase 2 implementation, in delivery order:

~~~text
c4dcc2a Define Emberglass quests variants and authored copy
60f464f Hydrate Emberglass ledgers and arm quests on run end
4db45ac Harden Emberglass run-end persistence
15cf247 Persist quest snapshots and exact pending encounters
f793c1c Harden pending encounters and quest validation
0de5dbb Harden terminal outbox finalisation
668b7fb Validate persisted monument bequests
0ad7a97 Add mesh-safe enemy variant presentation
9b73a6d Correct variant shader colour transform
10ec509 Implement the Pale Ones Trail and Witchlight Lens
a2e08e8 Guard inactive Pale variant drops
4c4f45a Implement the three-stage Own Shade Trail
ef0dfa1 Cover Shade transaction failure paths
fded62c Add the flameless lantern and Usurper Gate
2a0a381 Harden Usurper shop session invariants
ed56e74 Implement the Eighth Omen Gate
174bb09 Add the Unreadable Page Trail
9ba7570 Implement the Hollow Lamplighter Trail
e3f9e33 Harden Hollow exit transactions
a97a60c Close Hollow terminal and pad gates
e3453f9 Add Emberglass ceremonies Rose Window and sealed door
4b28746 Harden Emberglass recovery and disclosures
5db600a Persist the dawn presentation outbox
53759bb Add the Emberglass Rose Window art set
5dc04b6 Harden Rose asset validation and readiness
3d1a580 Tune Emberglass progression to the long-game target
20fa18a Harden Emberglass release surfaces
~~~

Current-main integration is recorded separately: `b3f5544` (`CI wiring (#8)`) was merged into the Phase 2 branch by `b63c0d5`. This evidence report and its final release hardening are committed by the containing release commit, so the report does not self-reference a hash that did not yet exist when it was written.

## Unit and save-safety gate

Command: `npm test`

~~~text
> spirebound@1.0.0 test
> node test/test_engine.js

unit checks passed; monte-carlo: 300 runs, 1 random-agent wins, 299 deaths
~~~

This includes the Phase 2 save-shape, inherited-key rejection, exact pending-encounter resume, transactional run-end/dawn outbox, quest receipts, monument validation, Rose manifest, variant presentation, and combat-chrome regressions.

## Guided and unguided pacing gate

Command: `npm run test:progression`

~~~text
guided: median=18 p10=14 p90=22 complete=2000/2000
unguided: median=50 p10=37 p90=69 complete=1991/2000
~~~

Both deterministic 2,000-profile bands pass the long-game target.

## Production build gate

Command: `npm run build`

~~~text
vite v8.1.3 building client environment for production...
✓ 462 modules transformed.
dist/assets/index-Bd7VUW0C.css  122.99 kB │ gzip:  26.70 kB
dist/assets/index-D402KVSm.js   972.43 kB │ gzip: 272.34 kB
✓ built in 574ms
~~~

The tracked `dist/` was generated after source and art were final. Vite's existing advisory for the JavaScript chunk exceeding 500 kB was emitted; it is non-gating and the build exited successfully.

The hashed JavaScript bundle preserves upstream three.js GLSL template whitespace. `.gitattributes` exempts only `dist/assets/*.js` from Git whitespace diagnostics; source, tests, documentation, CSS, and HTML retain the standard check.

## Behavioural, geometry, stage, and visual Playwright gate

Command: `SPIREBOUND_E2E_PORT=5194 npm run test:e2e`

~~~text
test:e2e:disk
  1 passed (4.9s)

test:e2e:random-agent
  1 passed (1.2m)

test:e2e:main
  106 skipped
  128 passed (3.8m)

test:e2e:visual
  48 passed (2.9m)
~~~

The complete runner executed the disk-writing editor case once, the long random-agent case once, the remaining desktop/portrait/landscape behavioural matrix, and the one-worker visual suite. It covered variant and ordinary combat geometry, the canonical three-enemy Act 1 and Ward-bearing Act 2 formations, reduced-motion/repeated-refit behaviour, real-death survivor stability, maximum-profile stage fit, ceremonies, title medallion, full and fallback Rose Window, and the sealed summit panel.

Darwin baseline refresh and immediate no-update verification each passed all 48 visual cases. The reviewed Darwin delta is 17 files: 12 new Phase 2 cases, three intentional Vigil refreshes, landscape shop, and landscape Act 1 combat. The canonical Linux update, a forced exact landscape-shop recapture, and two no-update verifications each passed; its reviewed delta is 16 files: the same 12 new cases, three Vigil refreshes, and landscape shop. Linux Act 1 combat remained pixel-compatible with its existing canonical baseline.

Final `git diff --check` output:

~~~text
~~~

The command exited 0 with no output.

## Performance gate

Command: `SPIREBOUND_E2E_PORT=5194 npm run test:e2e:perf`

~~~text
PERF_RESULT {"avgFps":107.9,"p95FrameMs":20.8,"worstFrameMs":34.4,"frames":324,"project":"portrait"}
  ✓  1 [portrait] › test/e2e/perf.spec.js:18:1 › AoE effect burst holds the frame budget at 4x CPU throttle (14.4s)

  1 passed (14.9s)
~~~

The acceptance budget is average at least 55 fps and p95 at most 22 ms; both pass.

## Rose art review

**Accepted.** The atomic set contains exactly eight 1024 × 1024 PNGs: one opaque RGB mural, one RGBA frame, and six RGBA binary-alpha quest masks (`paleOnes`, `ownShade`, `usurper`, `eighthOmen`, `unreadablePage`, and `hollowLamplighter`). The accepted frameless source edit is `019f493d-568c-7142-b01a-1a90862c8e31/exec-fb91bc40-565f-45b2-b414-59033ce9352e.png`; its final mural SHA-256 is `1b3f2385bf228ec7eeb01d96e0d28ce4dbebaeeeba1c2bf21e6b37a7d924f162`.

Visual review accepted the centred 700 px composition at authored size and at a 160 px readability check: six distinct story panes share one lead system, the seven-plus-one Omen language reads as intended, and the closed door/stair remains legible. The frame and all six panes align with the mural as one system.

The strict real-world fallback smoke used a throwaway source tree with all eight files physically absent and did not call `forceRoseFallback`:

~~~json
{"medallion":0,"fallback":1,"panes":6,"forced":false}
~~~

Thus the manifest fails atomically: no partial medallion/mural is shown, while the labelled six-pane fallback remains usable.

## Canonical snapshot host

Darwin snapshots were captured on macOS 26.5.2 (build 25F84), arm64, Node 22.23.1, npm 10.9.8, Playwright 1.61.1.

Linux snapshots were captured in Vercel Sandbox project `vercel-sandbox-default-project`, scope `fol2s-projects`, using `mcr.microsoft.com/playwright:v1.61.1-noble`: Ubuntu 24.04.4 LTS, x86_64, kernel 5.10.174, Node 24.17.0, npm 11.13.0, Playwright 1.61.1. The source bundle was `b63c0d5` plus the final uncommitted Task 14 text patch, including the combat-clamp fix. The retrieved results archive SHA-256 is `f0469d7e8a231e324d2afda1d803b738a1dd7942be6b6e26c97c34ab35be7367`; local capture evidence was retained at `/tmp/emberglass-p2-linux-202607101028-results` for this run. The sandbox and its nested Docker daemon were stopped and removed after retrieval.

## Manual journey and demo recording

One continuous BrowserContext/Page recording covered all eight acceptance chapters, using the complete Rose origin at 5194 and a throwaway true-missing-file origin at 5196:

~~~text
1: PASS — fresh profile has neither Rose tab nor title medallion
2: PASS — win-one hydration arms Pale and the first unmarked monster resolves to paleDuskfang
3: PASS — contact reveals the inscription; three kills grant Lens; next map marks a Pale node
4: PASS — Shade, lantern, Eighth, Page, and Hollow each exercised a real hook
5: PASS — true missing-file origin renders fallback; full origin decodes all eight Rose assets
6: PASS — production dawn grants shard six; medallion opens six lit panes; door remains an Act 3 promise
7: PASS — pending usurpedSovereign survives save/load and resumes with the same variant ID
8: PASS — all eight Phase 2 music cues are registered but wired:false and absent from SCREEN_CUES
BROWSER ERROR GATE PASS — zero pageerror/console.error events
FINAL: GO
~~~

Recording: [`artifacts/emberglass-phase2-manual-journey.webm`](artifacts/emberglass-phase2-manual-journey.webm)

Media verification:

~~~text
ffprobe: PASS — matroska/webm; VP8 video; 1600x900; 25 fps; 112.320000 seconds; 13,672,270 bytes
ffmpeg full decode: PASS — zero decode errors
SHA-256: 875ae8bb7b2effac04686d9c801ef3f4716a9c1a471fce2860ab834e79b10b1b
Visual frame review: PASS — 23 broad samples plus 39 detailed samples reviewed from chapters 1-8
~~~

The eight unwired cue IDs are `roseWindow`, `paleOnes`, `shadeDuel`, `usurper`, `eighthOmen`, `unreadablePage`, `hollowLamplighter`, and `sealedDoor`.

## Known caveats

- The eight hidden-suite music cues remain intentionally registered but unwired; Phase 2 audio was out of scope.
- The summit door is deliberately a non-path Act 3 promise. It does not enter or claim an implemented Act 4.
- Rose delivery is atomic. If any one of the eight raster files is unavailable, the complete labelled fallback replaces the art set.
- Darwin and Linux visual baselines are reviewed separately and intentionally have the 17-versus-16 delta described above.
- The existing Vite chunk-size advisory remains; it did not fail the production build or performance budget.
