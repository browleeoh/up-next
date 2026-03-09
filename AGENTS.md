# Ralph Agent Instructions

## Overview

Ralph is an autonomous AI agent loop that runs AI coding tools (Claude Code) repeatedly until all PRD items are complete. Each iteration is a fresh instance with clean context.

## Key Files

- `prompt.md` - Instructions given to each AMP instance
- `CLAUDE.md` - Instructions given to each Claude Code instance

## Patterns

- Each iteration spawns a fresh AI instance (Amp or Claude Code) with clean context
- Memory persists via git history, `progress.txt`, and `prd.json`
- Stories should be small enough to complete in one context window
- Always update AGENTS.md with discovered patterns for future iterations
- Watch time is currently surfaced in two UI locations: the dashboard home route (`src/routes/index.tsx`) and the stats page (`src/routes/stats.tsx`); changes to this feature should verify both placements intentionally.
- Repo-local Base UI accessibility guidance lives in `skills/base-ui-accessibility`; use it for accessibility-sensitive UI refactors and convert any unsupported Base UI Tailwind docs utilities to Tailwind v3-compatible arbitrary values.
