# Hardening Task 4 Perf Evidence

Task: `docs/superpowers/plans/2026-07-06-visualisation-hardening-polish.md` Task 4.
Date run: 2026-07-07.

## Baseline Clarification

The plan records the hand-off state as 28.7fps. That is historical context from
2026-07-06. Before changing Task 4 in the main worktree, the current-state
baseline was re-measured with the same gate and failed lower in that run:

```text
PERF=1 npx playwright test perf --workers=1 --reporter=list

1 failed
[portrait] perf.spec.js: AoE effect burst holds the frame budget at 4x CPU throttle
average fps during the burst (got 18.2)
Expected: >= 55
Received: 18.23002983092189
```

Because list output only surfaced the failed assertion, the baseline was also
re-run from a detached `182d576` worktree with the exact perf spec path and JSON
reporter to capture the full annotation:

```text
PERF=1 npx playwright test test/e2e/perf.spec.js --project=portrait --workers=1 --reporter=json

status=failed avg 60.3fps, p95 frame 33.3ms, worst 431.6ms over 188 frames
Error: p95 frame time in ms (got 33.3)
```

## Intermediate Measurement

After applying the plan's four listed candidates in the main worktree, the same
gate still failed in that immediate run:

```text
PERF=1 npx playwright test perf --workers=1 --reporter=list

1 failed
[portrait] perf.spec.js: AoE effect burst holds the frame budget at 4x CPU throttle
average fps during the burst (got 53.0)
Expected: >= 55
Received: 52.96960868680677
```

The same plan-candidate state was then reproduced in the detached `182d576`
worktree with the exact perf spec path and JSON reporter to capture p95:

```text
PERF=1 npx playwright test test/e2e/perf.spec.js --project=portrait --workers=1 --reporter=json

status=passed avg 101.7fps, p95 frame 20.3ms, worst 43.0ms over 307 frames
```

The conflicting intermediate averages show the perf gate is sensitive to
machine/GPU load. The final patch keeps the additional LITE VFX canvas DPR cap
because it was the change that made the main worktree gate pass in the original
Task 4 run and gives the LITE tier more fill-rate headroom.

## Passing Measurement

After additionally capping the LITE VFX canvas DPR at 1, the same gate passed.
The JSON reporter annotation for the passing portrait test was:

```text
PERF=1 npx playwright test perf --workers=1 --reporter=json

avg 125.2fps, p95 frame 14.2ms, worst 22.4ms over 376 frames
expected: 1
skipped: 2
unexpected: 0
```

The gate itself remains unchanged in `test/e2e/perf.spec.js`: average fps must
be at least 55 and p95 frame time must be at most 22ms.

## Task 4 Gate

The task boundary gate then passed:

```text
npm test && npm run build && npx playwright test --reporter=list

npm test: passed
npm run build: passed
Playwright: 65 passed, 40 skipped
```

The mutative BF editor disk-write test is still covered, but runs alone because
it writes `src/battlefield-layout.js` and causes Vite to full-reload unrelated
parallel Playwright pages:

```text
npm run test:e2e:bfeditor-disk

1 passed
```
