# Image generation via the Codex CLI

> Historical note: this Codex CLI bridge is no longer the primary workflow for
> Spirebound art. Current raster asset work uses built-in Codex image generation
> directly, then Nano Banana Pro, then alpha cutout. See
> [`generated-art-workflow.md`](./generated-art-workflow.md).

How we generate/edit raster images (PNGs) for Spirebound — e.g. title art, promo
shots, texture references — without adding any binary-asset pipeline or paying
per-image API bills. Claude Code shells out to the **Codex CLI**, which has a
built-in image tool. This is a bridge for *authoring* assets; the game itself is
still 100% procedural SVG/WebAudio at runtime.

```
Claude Code  ──Bash──▶  codex exec '$imagegen …'  ──▶  built-in image tool  ──▶  PNG
```

## Verified environment (2026-07-04)

Everything below was confirmed on this machine, not taken on faith:

| Check | Command | Result |
|---|---|---|
| CLI present | `codex --version` | `codex-cli 0.142.5` (`/opt/homebrew/bin/codex`) |
| Image tool on | `codex features list \| grep image` | `image_generation  stable  true` |
| Auth mode | `codex login status` | **Logged in using ChatGPT** |
| Node | `node --version` | v26.4.0 |

Because auth is **ChatGPT**, image generation draws on the **ChatGPT/Codex plan
usage limits**, not per-request API billing. (Per OpenAI's Codex docs the built-in
tool is `gpt-image-2`, and they recommend setting `OPENAI_API_KEY` so large
batches bill the API instead — those two points come from OpenAI's docs and were
not independently verified here.)

## The command

```bash
codex exec --skip-git-repo-check -s workspace-write \
  '$imagegen <PROMPT>. Save the result as <RELATIVE_PATH>.' < /dev/null
```

Run it **from the directory you want the file written into**. Example that
produced a real 512×512 PNG during setup:

```bash
cd /Users/jamesto/Coding/roguecardv2/public
codex exec --skip-git-repo-check -s workspace-write \
  '$imagegen A single glowing amber ember on a pure black background, minimal, no text, no watermark. Save the result as ./ember.png' < /dev/null
```

### Flags & gotchas (learned the hard way)

- **`$imagegen`** — explicit trigger for the built-in tool (internally `image_gen`).
  The `$` must reach Codex literally: in a script, write `\$imagegen` so the shell
  doesn't expand it to an empty variable. Even without the prefix, describing an
  image task will usually invoke the tool since the feature is enabled, but the
  prefix is the reliable trigger.
- **`< /dev/null`** — closes stdin. Without it, a non-interactive `codex exec`
  prints `Reading additional input from stdin…` and can stall.
- **`--skip-git-repo-check`** — Codex refuses to run outside a *trusted* git
  directory (`Not inside a trusted directory…`). Inside this repo it's usually
  unnecessary, but it's harmless to always include, and required for scratch dirs.
- **`-s workspace-write`** — sandbox: full disk **read**, but **writes** limited to
  the cwd (+ temp). That's why you `cd` into the target dir first. This machine's
  `~/.codex/config.toml` defaults to `danger-full-access` / `approval_policy=never`;
  passing `-s workspace-write` explicitly keeps a single generation scoped and safe.
- **`-i <FILE>…`** — attach reference image(s) to the prompt, for edits or style
  matching: `codex exec -i ref.png '$imagegen make the sky darker. Save as ./out.png'`.
- **Where the file really comes from:** Codex first writes the raw output to
  `~/.codex/generated_images/<uuid>/ig_*.png` (the full-res original, kept
  permanently), then copies — and if you asked for a size, resizes via macOS
  `sips` — into the path you named. If you want the untouched original, look there.

## Using it from Claude Code

Just ask: *"generate a 16:9 hero image of X, save it under public/hero.png."*
Claude runs the command above via Bash and reports the saved path. Or call the
wrapper directly:

```bash
tools/imagegen.sh public/hero.png "A 16:9 hero banner of a glass tower lit by lanterns, ink-black sky, no text"
```

See [`../tools/imagegen.sh`](../tools/imagegen.sh) — it handles the `cd`, the
stdin close, the git-check skip, and the `\$` escaping for you.

## Notes for this repo

- Runtime art stays procedural (`src/art.js` SVG, `src/audio.js` WebAudio). Use
  Codex image-gen only for *authoring-time* raster assets (title/promo/reference).
- Generated PNGs are just files — commit them like any asset if wanted (this repo
  already tracks a few, e.g. `mob_title_portrait.png`). **Never commit unless
  explicitly asked.**
- Cost is your ChatGPT/Codex usage, so avoid gratuitous batches; reuse the
  originals cached in `~/.codex/generated_images/` before regenerating.
