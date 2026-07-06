# Card Art Subagent Workflow

This is the handoff protocol for using subagents during the remaining
Spirebound card-art production pass.

Subagents help with story, composition, uniqueness, and prompt drafting. The
main agent remains responsible for final prompt selection, Image Gen calls,
asset promotion, gallery checks, documentation, build/test, commit, and push.

## Required Context Before Summoning

The main agent must read these files before assigning card-art work:

- `docs/card-art-bible.md`
- `docs/card-production/card-art-baselines.md`
- `docs/card-production/drift-control.md`
- the relevant card spec file:
  - `docs/card-production/attack-card-specs.md`
  - `docs/card-production/skill-card-specs.md`
  - `docs/card-production/power-special-card-specs.md`
- the latest prompt ledger for the current batch, if it exists

Do not ask a subagent to infer the rules from memory. Put the relevant rules in
the handoff packet.

## Batch Shape

Default batch size is three cards.

For each batch:

1. Assign one subagent per card, or one design subagent for a tightly related
   trio.
2. Give each subagent the same baseline set and the same no-post-process rule.
3. Ask for story, card-art design, final prompt, and drift risks only.
4. Compare all three outputs together before generating images.
5. Generate sources with built-in Image Gen.
6. Review against the nine baselines at full size, `240 x 150`, and `120 x 75`.
7. Promote only the approved generated source bytes to
   `src/assets-readable-baseline/cards/<id>.png`.
8. Record prompts, source paths, hashes, contact sheets, and review decisions.

## Subagent Handoff Packet

Use this shape when summoning a card-design subagent:

```text
You are designing one Spirebound card-art scene. Work in UK English.

Card:
- id:
- display name:
- type:
- rarity:
- target:
- mechanics:
- nearest approved baselines:

Hard rules:
- Full-bleed rectangular card-art scene, not a badge, icon, token, logo, card
  frame, or UI mock-up.
- Foreground subject/action and background must separate at thumbnail distance.
- No text, labels, watermark, cost icon, nameplate, UI chrome, or full card
  mock-up.
- Fix light, colour, and theme in the prompt. Do not propose post-processing.
- The final gallery PNG must be the approved generated source bytes.

Use these baseline lessons:
- strike: large foreground attack silhouette against quieter red chapel glass.
- defend: figure, lantern, blue ward, and background as distinct layers.
- empower: persistent power state through pose plus inner fire.
- eclipseSlash: same attack family as strike but unique eclipse/crack silhouette.
- chisel: precise tool/action/target triangle for Facet chip.
- firstSpark: draw/kindle through hand, spark, and rising pane.
- ashBite: Smolder attack through red bite and green-orange smoke.
- smother: ward hand first, smoke secondary, visible midtone background.
- twinFangs: two-hit attack requires two separated fangs, not one slash.

Return exactly these sections:
1. Story Moment
2. Card-Art Design
3. Uniqueness Versus Baselines
4. Image Gen Prompt
5. Drift Risks
6. Thumbnail Read Check
```

## Output Requirements

The subagent output must be production-ready enough that the main agent can copy
the prompt into the batch ledger after review.

Story Moment:

- one short world-action scene
- no rules jargon unless the card's mechanic needs it
- no generic fantasy spell language

Card-Art Design:

- foreground, midground, and background
- primary silhouette
- motion direction or stable state
- mechanic cue
- palette
- separation/readability note

Uniqueness Versus Baselines:

- name the closest baseline
- explain what changes so the thumbnail cannot be mistaken for it

Image Gen Prompt:

- complete prompt, not bullet fragments
- includes card id and display name
- includes the current lighting mandate when needed
- includes constraints against text, UI, badges, and post-processing

Drift Risks:

- list concrete ways the image could fail
- include at least one risk about foreground/background separation

Thumbnail Read Check:

- describe what should still be visible at `120 x 75`
- describe the one shape that should read at `64 px`

## Main-Agent Review

After collecting subagent outputs, the main agent must:

- remove duplicated silhouettes across the batch
- tighten prompts so rarity is visible but not over-ornamented
- keep starter/common cards simple even when they look premium
- check palette variety across nearby cards
- add source-only lighting language when darkness is a risk
- reject prompts that rely on post-processing, alpha cutouts, badge shapes, or
  hidden detail

No subagent may approve a card for gallery promotion. Approval happens only
after generated images are compared with the nine baselines and checked in the
gallery.
