# Domain Docs

How the engineering skills should consume this repo's domain documentation when exploring the codebase.

## Layout

This repo uses a multi-context domain documentation layout.

Read `CONTEXT-MAP.md` at the repo root first. It points at the relevant per-context `CONTEXT.md` files. Also read `docs/adr/` for system-wide decisions and any context-scoped `docs/adr/` directories near the context being changed.

If these files do not exist yet, proceed silently. The domain-modeling flow creates them lazily when terms or decisions are resolved.

## Use the glossary's vocabulary

When output names a domain concept, use the term as defined in the relevant `CONTEXT.md`. Do not drift to synonyms the glossary explicitly avoids.

If the concept is not in the glossary yet, either reconsider the term or note the gap for domain modeling.

## Flag ADR conflicts

If output contradicts an existing ADR, surface it explicitly rather than silently overriding.
