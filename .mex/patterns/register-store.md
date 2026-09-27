---
name: register-store
description: Adding a shop to the frontend store directory (names, URLs, logos, blurbs).
last_updated: 2026-09-27
---

# Pattern: Register a store in the frontend

Trigger: backend adds a new `stores` row / shop scraper.

## Steps
1. Add the slug to all four maps in `src/lib/types.ts`:
   - `STORE_NAMES` — display name
   - `STORE_URLS` — public homepage URL
   - `STORE_LOGOS` — `/logos/<file>` asset
   - `STORE_BLURBS` — one-line Serbian blurb for `/prodavnice`
2. Drop the logo into `public/logos/` (svg/png/webp). Prefer the site's real header logo.
3. `npm run typecheck` (maps are plain objects — typos fail silently until runtime).
4. Pre-push runs typecheck + unit + Playwright smoke.

## Gotchas
- `ACTIVE_STORES = Object.keys(STORE_NAMES)` — a missing map entry hides the shop from `/prodavnice`.
- Logo filenames must match `STORE_LOGOS` exactly (extension included).
- Blurb language is Serbian; names keep the shop's own casing (`eKupi`, `ePlaneta`).
