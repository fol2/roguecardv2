# SFX Ledger

Runtime samples live in `src/assets/sfx/<id>.mp3`. Playback is `sfx.<id>()` or `sfx.attack({ who, amount, blocked })` from `src/audio.js`. Preview at `?audio=1`.

No generation prompts here — usage only.

## UI

| Id | Usage |
|----|--------|
| `click` | Buttons, menus, title / embark / vigil actions, pile buttons, overlay OK/skip/close, Audio panel interactions |
| `hover` | Card hover in hand, targeting / option hover, lamplighter art hover |

## Cards

| Id | Usage |
|----|--------|
| `card` | Card play motion, toss phial, discard/exhaust fidget, shop remove, event remove-card |
| `draw` | Draw-to-hand (staggered once per card drawn) |

## Attack

Resolved by `sfx.attack({ who, amount, blocked })`. Tier uses `amount + blocked`: light ≤ 5, medium 6–15, heavy ≥ 16.

| Id | Usage |
|----|--------|
| `atkHeroLight` | Hero hits enemy, light |
| `atkHeroMed` | Hero hits enemy, medium |
| `atkHeroHeavy` | Hero hits enemy, heavy |
| `atkEnemyLight` | Enemy hits player, light |
| `atkEnemyMed` | Enemy hits player, medium |
| `atkEnemyHeavy` | Enemy hits player, heavy |

### Legacy (kept on disk; not the live attack path)

| Id | Usage |
|----|--------|
| `slash` | Old swing sample; `sfx.slash()` now routes to medium hero attack |
| `hit` | Old impact sample; `sfx.hit()` is a no-op |

## Combat

| Id | Usage |
|----|--------|
| `blocked` | Damage absorbed by Ward; thorns ping; adamant hold (“the glass holds”); guard-shatter companion |
| `block` | Gain Ward |
| `poison` | Smolder / poison apply or tick (enemy or player) |
| `debuff` | Debuff apply; burn / self damage; can’t-afford shop feedback; some notices |
| `buff` | Buff apply; power settle into glass |
| `heal` | Heal feedback (combat heal, rest heal) |
| `energy` | Energy gain sample (wired in audio; rarely called from UI today) |
| `death` | Normal enemy death |
| `bigDeath` | Elite / boss death; also boss intro sting when a boss fight starts |
| `turn` | “Your turn” banner (when turn number > 1) |
| `victory` | Fight-won SFX sting (BGM `victory` is separate, run-end only) |
| `defeat` | Fight-lost SFX sting (BGM `defeat` is separate, run-end only) |

## SHATTER / Lantern

| Id | Usage |
|----|--------|
| `chip` | Facet chip tick |
| `shatter` | Shatter burst |
| `ember` | Ember gain |
| `kindle` | Kindle / lantern feed |
| `stagger` | Enemy staggered |
| `art` | Lantern Art cast |

## Meta / map / rewards

| Id | Usage |
|----|--------|
| `coin` | Gold pickup, shop spend, reward gold fly |
| `potion` | Use or gain phial |
| `relic` | Relic gain, lamplighter confirm, unlock toasts, monument claim |
| `upgrade` | Card upgrade (rest / forge / event / reward) |
| `map` | Map enter / node travel one-shot (not map BGM) |
| `omen` | Omen banner / omen reveal on act entry |

## Notes for review

- Attack feel is owned by the six `atk*` ids, not `slash`/`hit`.
- `blocked` vs `block`: former is “hit was stopped”; latter is “you gained Ward”.
- SFX `victory` / `defeat` fire at combat end; Music Cues of the same name fire only on the final run end screen.
