# Round 5 P7 ship-front hand-off

**Date:** 2026-07-16 (UTC) / local close 2026-07-17  
**Branch:** `jamesto/round5-production-engineering-continuation`  
**Worktree:** `.worktrees/round5-production-engineering-continuation`  
**Label:** provisional / marketing-only (store kit + public icons)

## Decision: P7 ship-front source + kit integrated

Task 38 FE package merged; Task 39 wired resolvers, captured the five store
shots + raw WebM, derived public icons, and recorded this hand-off. Task 40 owns
Full-Round gate, visual baseline refresh, `dist/` rebuild, and the PR.

This record makes **no** store-listing publication claim and no App Store /
Play Store submission claim.

---

## Tip SHAs (frozen)

| Role | SHA | Notes |
|---|---|---|
| PE_PRE_FE_P7 | `f6eb6c293b925fac37d9cb0de1cff77b9847ecf8` | Pre-merge PE tip (optional-asset allowlist) |
| FE_HEAD | `b0b039d615dd3cad032d638542bfe2d5aa4c6b22` | FE report hand-off (backdrop = original act plates; mid/ledge = B) |
| FE_P7_MERGE | `a3722658fa872b7750561e233510f6b5ed40e25f` | `art: merge approved Round 5 FE ship-front package` |
| Initial wire source | `1b855ba85fb445c363bec9f8fb8d0a31914507cf` | `feat: wire the provisional Round 5 ship-front source` |
| **P7 store capture source** | `ccbbc2252dd0b5c4563265a82d683a391d022192` | Exact HEAD used for `capture:store-kit` + `gen-icons --public-only` |

Rollback of FE merge only: `git revert -m 1 a3722658fa872b7750561e233510f6b5ed40e25f`.

---

## Asset interface (consumed)

Thirteen promoted PNGs under `src/assets/`:

- Boss plates (backdrop = original act bytes; mid/ledge = arm B):  
  `rootheart-{backdrop,mid,ledge}`, `leviathan-{backdrop,mid,ledge}`,  
  `sovereign-{backdrop,mid,ledge}`
- Title layers: `title/round5-{back,mid,foreground}`
- Unlock toast: `meta/unlock-toast-frame`

Wiring:

- `src/ui/shipfront-assets.js` — pure `resolveCombatPlates` / title / unlock /
  shot-list validator
- `src/packs/core/themes.js` — `bossPlates` for rootheart / leviathan / sovereign
- `src/ui/combat.js` — resolver + `data-plate-id` on `.sl-*`
- `src/ui/screens/end.js` + `src/styles.css` — unlock toast frame
- Freeze keep flag: `keepCombat` → `data-freeze-keep-combat` (store-kit combat/boss)

---

## Store kit evidence

Generated under `docs/store-assets/round5/` from capture source
`ccbbc2252dd0b5c4563265a82d683a391d022192`:

| Shot | Seed | Profile | Review note |
|---|---:|---|---|
| `title.png` | 50101 | fresh | Brand wordmark + Begin the Climb CTA |
| `combat.png` | 50102 | fresh | Hand + Duskfang + act-standard plates (no boss override) |
| `map.png` | 50103 | fresh | Path choice / Act 1 map HUD |
| `rose-window.png` | 50104 | grown | Rose Window tab open (grown Vigil / emberglass) |
| `boss.png` | 50105 | grown | Rootheart + boss plates + HUD |

Also: `raw-reference.webm`, `manifest.json` (`sourceSha` equals capture source;
`derivedPublicAssets` lists the four public icons).

Public outputs (from `tools/gen-icons.sh --public-only --source docs/store-assets/round5/title.png`):

- `public/icon-180.png`, `public/icon-512.png`, `public/og.png`, `public/feature-graphic.png`

Shot schema matches `docs/store-shot-list.md`. Listing copy / age-rating checklist:
`docs/store-listing-content.md`.

---

## Gate evidence (Task 39 Step 6)

| Command | Expected |
|---|---|
| `npm test` | unit + monte-carlo green |
| `node tools/run-with-strict-e2e-port.mjs -- npx playwright test stage battle p6-screens trace --project=desktop --workers=1 --no-deps` | focused green |
| `npm run test:round5:standing -- --profile p6` | standing green at evidence tip |

Capture commands (no-fallback):

```bash
node tools/run-with-strict-e2e-port.mjs -- npm run capture:store-kit
tools/gen-icons.sh --public-only --source docs/store-assets/round5/title.png
```

---

## Owner decisions carried forward

- Backdrop plates: **original** live act1/2/3 backdrop bytes (not arm A).
- Mid / ledge: arm **B**.
- Title ×3 + unlock toast: promote.
- Store kit outputs: **provisional / marketing-only**.
