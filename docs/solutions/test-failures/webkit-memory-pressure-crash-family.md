---
title: WebKit e2e crashes from renderer memory accumulation — the fresh-browser-shard medicine
date: 2026-07-19
category: test-failures
module: e2e-ci
problem_type: test_failure
component: testing_framework
symptoms:
  - "Error: page.reload: Page crashed on a WebKit project mid-suite (stage.spec.js:512, iphone-webkit)"
  - "page.goto / reload hangs on late tests of a long WebKit invocation until the 90s test timeout"
  - "Only WebKit projects (iphone-webkit / ipad-webkit) affected; the same specs pass on Chromium projects"
root_cause: memory_leak
resolution_type: test_fix
severity: high
tags: [webkit, playwright, page-crashed, webgl, memory-pressure, ci-flake, shard]
---

# WebKit e2e crashes from renderer memory accumulation — the fresh-browser-shard medicine

## Problem

WebKit Playwright runs against this WebGL-heavy game (full three.js scene + Pixi combat layer per page) crash or hang on *late* tests of a long invocation. Four occurrences on 2026-07-19 alone, always the same signature and always WebKit-only.

## Symptoms

- `Error: page.reload: Page crashed` — most recently `stage.spec.js:512` on `iphone-webkit` in run 29704272438
- Earlier the same day: three trace.spec.js failures (crash at a second WebGL boot in one test, reload-hangs on late tests ~#49 of an invocation) — per this session's investigation; those traces predate this doc
- The failing test index matters: early tests pass, late tests die. Which *specific* test fails drifts from run to run — that drift is the fingerprint of accumulation, not a broken test

## What Didn't Work

- **Blaming and patching the individual failing test** — the family reappears at a different line number in the same or a neighbouring spec. The failing test is the victim, not the cause.
- **Raising timeouts** — a crashed renderer never comes back; budget has nothing to do with it.
- **One browser instance across all six WebKit specs** (original layout) — this was the direct cause per this session's diagnosis: WebKit's renderer accumulates memory across many WebGL-heavy page navigations in a single browser process until a late navigation dies.

## Solution

Bound how many WebGL page-boots any single WebKit browser process serves, by splitting the run into multiple *separate Playwright invocations* — a separate invocation is a fresh browser process. Applied incrementally as the family recurred:

1. Webkit lane split into core/lab/screens invocations, then core split per device (`iphone` / `ipad` CI matrix segments).
2. `trace` runs as two invocations per device (`--shard=1/2`, `--shard=2/2`).
3. After the 4th occurrence hit `stage.spec.js`, stage got the same split (PR #52). Current shape in `package.json:40`:

```json
"test:e2e:webkit-core-iphone": "npm run test:e2e:webkit-stage -- --project=iphone-webkit --shard=1/2 && node tools/run-with-strict-e2e-port.mjs -- npm run test:e2e:webkit-stage -- --project=iphone-webkit --shard=2/2 && ... (trace 1/2, trace 2/2)"
```

with `test:e2e:webkit-stage` = `playwright test stage --workers=1 --no-deps` (`package.json:42`). Verified: the first post-merge full run on main after PR #52 was green.

## Why This Works

Playwright reuses one browser process per invocation. This app's pages are unusually heavy (three.js + bloom + Pixi WebGL contexts per navigation), and WebKit under CI software rendering accumulates renderer memory across navigations rather than fully releasing it — per this session's diagnosis, eventually a `reload`/`goto` crashes the renderer. `&&`-chaining several short invocations resets the browser process between chunks, capping accumulation below the crash threshold while keeping one CI job per device segment.

## Prevention

- **When this family reappears in another WebKit segment (lab or screens are the remaining unsplit ones), apply the same medicine**: split that segment's script into `--shard=1/2 && --shard=2/2` invocations per device. It is a package.json-only change — but BOTH pin files (`test/test_ci_contract.mjs` AND `test/test_module_boundaries.mjs`) pin these script strings verbatim and must be updated together (run `npm run test:ci` to find every pin).
- Recognise the family by its signature before debugging: WebKit-only + late-test crash/hang + drifting test index ⇒ accumulation, not a test bug. Do not start by editing the failing test.
- Within a single test, avoid booting the full WebGL scene twice in one page on WebKit — open a fresh page for a second boot (and remember `patchTracedGoto` must be applied manually to extra pages in trace specs).

## Related Issues

- PR #47 (webkit lane/device splits, fresh-page-per-boot fix), PR #52 (stage shards, this doc's trigger)
- `AGENTS.md` § CI documents the lane layout; `test/test_ci_contract.mjs` carries the family's history in the `webkit-core` pin comments
