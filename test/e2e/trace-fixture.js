import { test as base, expect } from '@playwright/test';
import { attachBehaviourTrace } from './helpers.js';
import { readFileSync, writeFileSync } from 'node:fs';

export const test = base.extend({
  _traceFailure: [async ({ page }, use, testInfo) => {
    const originalGoto = page.goto.bind(page);
    page.goto = (target, options) => {
      const absolute = /^[a-z][a-z\d+.-]*:/i.test(String(target));
      const url = new URL(String(target), 'http://trace.invalid');
      const optedOut = url.searchParams.get('trace') === 'off';
      if (optedOut) url.searchParams.delete('trace');
      else if (!url.searchParams.has('trace')) url.searchParams.set('trace', '1');
      const tracedTarget = absolute ? url.href : `${url.pathname}${url.search}${url.hash}`;
      return originalGoto(tracedTarget, options);
    };
    await use();
    if (testInfo.status !== testInfo.expectedStatus) {
      await attachBehaviourTrace(page, testInfo);
    }
  }, { auto: true }],
});

export { expect };

export function bindTraceContract(id, actualRows) {
  const url = new URL(`./fixtures/trace/${id}.json`, import.meta.url);
  const fixture = JSON.parse(readFileSync(url, 'utf8'));
  if (process.env.UPDATE_TRACE_CONTRACTS === '1') {
    writeFileSync(url, `${JSON.stringify({ ...fixture, records: actualRows }, null, 2)}\n`);
  } else {
    expect(actualRows, `${id} diverged from its frozen real-journey projection`).toEqual(fixture.records);
  }
}
