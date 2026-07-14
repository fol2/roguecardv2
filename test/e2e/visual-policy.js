// Frozen Pixi-era screenshot tolerance policy (Round 5 Task 24).
// QA owns this map; PE does not tune ratios to make diffs green.
// Every toHaveScreenshot call must pass an explicit suite key from this map.

export const VISUAL_DIFF_RATIOS = Object.freeze({
  legacy: 0.01,
  p4Combat: 0.01,
  p5Cards: 0.01,
  p6Screens: 0.01,
  p7Shipfront: 0.01,
});

export const VISUAL_SUITE_KEYS = Object.freeze(Object.keys(VISUAL_DIFF_RATIOS));

/** Resolve Playwright screenshot expect options for a declared suite key. */
export function screenshotDiffOptions(suiteKey) {
  if (!Object.prototype.hasOwnProperty.call(VISUAL_DIFF_RATIOS, suiteKey)) {
    throw new Error(`unknown visual suite key: ${suiteKey}`);
  }
  return Object.freeze({
    maxDiffPixelRatio: VISUAL_DIFF_RATIOS[suiteKey],
    animations: 'disabled',
    caret: 'hide',
  });
}
