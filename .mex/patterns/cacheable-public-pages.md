# Pattern: Cacheable public pages

Use when changing rendering, CSP, or Vercel deploy config for public routes.

## Why this exists

Root layout once used `export const dynamic = "force-dynamic"` plus per-request CSP nonces from `src/proxy.ts`. That forced SSR on every view and produced `x-vercel-cache: MISS` + `Cache-Control: private, no-cache, no-store` on HTML (slow first load from RS → US origin).

## Steps

1. **Do not reintroduce per-request nonces** on public layouts. Nonce CSP requires dynamic rendering and disables static/ISR HTML caching (see Next.js CSP guide).
2. Keep **static CSP + security headers** in `next.config.ts` `headers()` so they apply to prerendered responses.
3. Keep **`src/proxy.ts` limited to `/admin`** cookie redirects. Do not match all pages just for headers.
4. Marketing/shell pages stay **static** (no `headers()`/`cookies()`/`searchParams` in the tree).
5. API-backed pages use **ISR**: `export const revalidate = …` + `generateStaticParams` (can return `[]` for on-demand). Server `fetch` must set `next: { revalidate }` — Next 15+ defaults `fetch` to no-store (see `apiFetch`).
6. Vercel function region is **`fra1`** in `vercel.json` (`regions`). Do not use deprecated `preferredRegion`.
7. `error-demo` (always throws) must stay `force-dynamic` so builds can prerender the rest of the app.

## Verify

- `npm run build` shows `○ /` (Static) and `●`/ISR for data routes
- `curl -D- /` shows `Cache-Control: s-maxage=…` (not `no-store`) and no CSP `nonce-`
- `/logos/*` has long `Cache-Control`
- `/admin` still redirects to `/admin/login` without the cookie

## Gotchas

- `searchParams` in `generateMetadata` (e.g. `/komponente?kategorija=`) forces that route dynamic — intentional for category SEO titles.
- Client `apiFetch` ignores `next: { revalidate }`; only server reads get ISR.
