# Task 5 Report — Living stage: ambient weather + lantern breathing

## Scope

Implemented Task 5 exactly in:

- `src/vfx.js`
- `src/ui.js`
- `src/styles.css`

No engine/vigil imports or purity boundaries were touched.

## Implementation

### `src/vfx.js`

- Added the per-act `WEATHER` table from the brief.
- Added `weather` / `weatherAcc` state.
- Exported `setWeather(act, { boss = false, mult = 1 } = {})`.
- Wired ambient weather spawning into `tick()` immediately after the `hitstopUntil` early return.
- Kept the existing Task 4 perf protections intact:
  - no changes to `LITE`
  - no changes to DPR capping
  - no changes to bloom / point-cloud / REDUCED behaviour

### `src/ui.js`

- Added `V.setWeather(null);` in `show(name, data)` before screen dispatch.
- Added `V.setWeather(S.run.act, { boss: kind === 'boss' });` in `startCombatUI(...)`.
- Added the two breathing overlay nodes after `.stage-ledge` in combat markup:
  - `.stage-breath.b1`
  - `.stage-breath.b2`

### `src/styles.css`

- Added `.stage-breath` styling per brief.
- Added fixed `.b1` / `.b2` positions using stage container units.
- Added `@keyframes breath`.
- Added reduced-motion fallback disabling the animation.

## Commands run

### Core gates

```bash
PERF=1 npx playwright test perf --workers=1 --reporter=list
npm test
npm run build
npx playwright test --reporter=list
```

### Follow-up verification

```bash
npm run dev
PERF=1 npx playwright test test/e2e/perf.spec.js --project=portrait --workers=1 --reporter=json > tmp/task5-perf.json
npx playwright test --reporter=list
npx playwright test test/e2e/visual.spec.js -g "reward screen" --project=desktop --project=portrait --reporter=list
npx playwright test test/e2e/geometry.spec.js -g "act 1 pair" --project=portrait --reporter=list
npx playwright test test/e2e/battle.spec.js -g "random-agent mini-run" --project=desktop --reporter=list
```

### Manual screenshot check

Used a one-off Playwright script to capture the desktop reward state to:

```bash
tmp/task5-reward-desktop.png
```

Then visually compared it against:

```bash
test/e2e/visual.spec.js-snapshots/reward-desktop-darwin.png
```

## Results

### Perf gate

- First perf run hit an intermittent Playwright/navigation failure (`Execution context was destroyed`).
- Immediate rerun passed.
- JSON perf capture result:
  - average: `126.2fps`
  - p95: `14.1ms`
  - worst frame: `29.2ms`
  - frames sampled: `379`

Gate held comfortably, so no weather-rate halving was needed.

### Unit + build

- `npm test`: passed
  - `unit checks passed; monte-carlo: 300 runs, 1 random-agent wins, 299 deaths`
- `npm run build`: passed

### Playwright matrix

- A direct `npx playwright test --reporter=list` run initially failed broadly with `ERR_CONNECTION_REFUSED` from the Playwright `webServer` path.
- With an explicit long-lived `npm run dev` session active, the matrix ran correctly.
- In that manual-server matrix run:
  - visual screens passed except one transient desktop `reward` snapshot failure
  - two other failures were transient `Execution context was destroyed` cases
- Targeted reruns all passed:
  - desktop + portrait `reward screen`
  - portrait geometry `act 1 pair`
  - desktop battle `random-agent mini-run`

Interpretation: the remaining failures were harness-level intermittents, not reproducible Task 5 regressions.

## Snapshot outcome

- No baseline update was committed.
- The brief allowed baseline refresh if breathing overlays became visible in frozen screenshots.
- In practice, the committed combat/map/title/etc baselines passed as-is.
- The one transient desktop reward diff did not reproduce on targeted rerun.
- Manual visual comparison of `tmp/task5-reward-desktop.png` against the committed reward baseline showed no unexpected content change.

## Files changed for Task 5

- `src/vfx.js`
- `src/ui.js`
- `src/styles.css`
- rebuilt `dist/` outputs from `npm run build`

## Commit

Required commit message used:

```bash
Ambient per-act weather + lantern breathing (perf gate holds)
```
