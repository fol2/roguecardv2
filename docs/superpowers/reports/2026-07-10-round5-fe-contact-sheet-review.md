# Round 5 FE contact-sheet / asset promotion hand-off

**Date:** 2026-07-17
**FE branch:** `jamesto/round5-front-end-p7`
**PE tip at FE base:** `98e153b8` (`jamesto/round5-production-engineering-continuation`)

## Commits

| Role | SHA | Message |
|---|---|---|
| Preparation (docs + scratch candidates) | `f098c1f6` | docs: prepare the Round 5 ship-front candidates |
| Asset promotion (exactly 13 PNGs) | `5516aba8` | art: promote approved Round 5 ship-front assets |
| Hand-off report | `5a199630` lineage | docs: record / repair the Round 5 asset promotion hand-off |
| Backdrop correction | tip after this commit | art: use original act backdrops for boss plates |

## Owner decisions (13/13)

A/B test applied to boss mid/ledge only:

- Backdrop → **original** live act plates (`act1/2/3-backdrop` bytes copied into boss backdrop paths). Not arm A.
- Mid / ledge → arm B (prompt-only; white-void alpha re-applied where needed)
- Title ×3 + unlock toast → promote (single candidate set)

| # | Final path | Decision | Source | SHA-256 |
|---|---|---|---|---|
| 1 | `src/assets/stage/rootheart-backdrop.png` | promote | original `act1-backdrop` | `9efa43aed645789c1e8d5ba995ae9fbaf4fbd22b6280efbc83eb0ce2c659d743` |
| 2 | `src/assets/stage/rootheart-mid.png` | promote | B — prompt-only | `02934979993732aea96de4f8168f879fc50e717b9ce617b49b0c5726657e72b0` |
| 3 | `src/assets/stage/rootheart-ledge.png` | promote | B — prompt-only | `843489d24eadeb07bed7c5fbb896cff1540f562238e7f94f7cb2cd45e364bcbc` |
| 4 | `src/assets/stage/leviathan-backdrop.png` | promote | original `act2-backdrop` | `3961239760244fcdcb2fb3513a512d080a983d6675b081cd68f8a278a4efff55` |
| 5 | `src/assets/stage/leviathan-mid.png` | promote | B — prompt-only | `56778d5e8bcb8f7996aff2eedcc0aef8ba2608d25c061d20667393f8028d8e53` |
| 6 | `src/assets/stage/leviathan-ledge.png` | promote | B — prompt-only | `b9748a5e18a1d75c33fd0f76d5adf41978c902e89f8edae74bb4d7b00586c7fd` |
| 7 | `src/assets/stage/sovereign-backdrop.png` | promote | original `act3-backdrop` | `b5e9409f1a9854461c84fa51e0f3d0fffd0d8c333b0782ebdac8b8c3306bd0c4` |
| 8 | `src/assets/stage/sovereign-mid.png` | promote | B — prompt-only | `178920e562a90edd5c48b070cf4e29e946aa4b4add6a6c0706504b81e079e360` |
| 9 | `src/assets/stage/sovereign-ledge.png` | promote | B — prompt-only | `dd3604fc15ce8cf449b129ae0f53e9f718ba61cebdc80f7ef3292e5a062065f9` |
| 10 | `src/assets/title/round5-back.png` | promote | non-boss title layer | `a00c44d1c31f2239404d397dfa0852c00b106a05fe6ac26bcb23f02316100c31` |
| 11 | `src/assets/title/round5-mid.png` | promote | non-boss title layer | `695a967b3fd7d2971ccdf465e8aa3293ac0ba9e00f43a70dbc739a10a60c892d` |
| 12 | `src/assets/title/round5-foreground.png` | promote | non-boss title layer | `bf4c77031588042ccd0a2973d97d8a9416269198d45b058f77043c79aaccf116` |
| 13 | `src/assets/meta/unlock-toast-frame.png` | promote | non-boss unlock frame | `7271641a5c54050ba90116d5f282412c961994fac2ad5e20e439bee318e8c8c0` |

## Crop / contact-sheet evidence

- Stage A contact sheet: `scratch/style-tests/round5/stage/contact-sheet.png`
- Stage B candidates: `scratch/style-tests/round5/stage/b/`
- A/B review page: `scratch/style-tests/round5/stage/review-ab.html`
- Title contact sheet: `scratch/style-tests/round5/title/contact-sheet.png`
- Meta contact sheet: `scratch/style-tests/round5/meta/contact-sheet.png`
- Prompt ledgers: `scratch/style-tests/round5/{stage,stage/b,title,meta}/prompt-ledger.md`

## Exact FE write set (promotion paths)

Exactly these thirteen final paths — no theme/manifest/wiring edits on FE:

```
src/assets/stage/rootheart-backdrop.png
src/assets/stage/rootheart-mid.png
src/assets/stage/rootheart-ledge.png
src/assets/stage/leviathan-backdrop.png
src/assets/stage/leviathan-mid.png
src/assets/stage/leviathan-ledge.png
src/assets/stage/sovereign-backdrop.png
src/assets/stage/sovereign-mid.png
src/assets/stage/sovereign-ledge.png
src/assets/title/round5-back.png
src/assets/title/round5-mid.png
src/assets/title/round5-foreground.png
src/assets/meta/unlock-toast-frame.png
```

## Frozen final-path interface (for PE Task 39)

PE must merge this report-hand-off head and wire:

- theme `bossPlates` for `rootheart` / `leviathan` / `sovereign` → the three plate ids each (backdrop bytes match act originals; mid/ledge are B)
- absent boss override → act-standard plates
- title layers `round5-back` / `round5-mid` / `round5-foreground` with legacy `title.png` / title-background fallback
- `unlock-toast-frame` with existing deed/content illustration fallback

## PE rollback requirements (PE must record)

Before/when merging, PE records in the P7 hand-off:

- `PE_PRE_FE_P7` (pre-merge SHA)
- `FE_P7_MERGE` (merge commit)
- rollback: `git revert -m 1 "$FE_P7_MERGE"`

FE does not edit PE theme/capture code.
