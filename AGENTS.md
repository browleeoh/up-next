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
- Watch-time totals should now come from a shared calculator that combines watched movie runtime, persisted TV episode `runtimeMinutes`, and full-series estimates from TV `totalEpisodes`; keep episode/runtime metadata durable instead of relying on expiring TMDB cache entries at render time.
- Repo-local Base UI accessibility guidance lives in `skills/base-ui-accessibility`; use it for accessibility-sensitive UI refactors and convert any unsupported Base UI Tailwind docs utilities to Tailwind v3-compatible arbitrary values.
- Search state on `src/routes/search.tsx` is URL-driven; richer search now uses explicit `year`, `genre`, and `personId/personName` params instead of hidden parsing so back/forward navigation and shared links preserve refinements.
- Person-based search is suggestion-driven: use TMDB `search/person` to offer explicit chips, then switch results to `combined_credits` when selected; keep `All / Movies / TV Shows` as a scope toggle, not a separate search flow.
- The search route owns live query state end-to-end: `SearchInput` debounces URL updates by 300ms and the legacy Zustand `searchQuery` in `src/lib/stores/ui.store.ts` is currently unused by the route.
- Browser verification note: direct `agent-browser --engine lightpanda` works against `vite preview` and simple local HTTP servers, but fails against the Vite dev server in this repo (`CDP response channel closed`). On preview, Lightpanda can navigate and snapshot routes, but `indexedDB` is `undefined`, so Dexie-backed TMDB cache access prevents async search data from loading even though direct `fetch` to TMDB succeeds. Chrome-backed `agent-browser` remains the reliable choice for full interactive local verification unless the app adds an IndexedDB-free fallback for browserless environments.
- Base UI adoption should stay behind thin app-level wrappers in `src/components/ui/` so feature components keep local styling and avoid importing Base UI primitives directly.
- The current Base UI package surface comes from `@base-ui-components/react/*` subpath imports; confirm wrapper APIs against local `node_modules` types before refactoring because parts such as radio render as namespaces like `Radio.Root`.
