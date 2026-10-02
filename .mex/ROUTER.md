---
name: router
description: Session bootstrap and navigation hub. Read at the start of every session before any task. Contains project state, routing table, and behavioural contract.
edges:
  - target: context/architecture.md
    condition: when working on system design, integrations, or understanding how components connect
  - target: context/stack.md
    condition: when working with specific technologies, libraries, or making tech decisions
  - target: context/conventions.md
    condition: when writing new code, reviewing code, or unsure about project patterns
  - target: context/decisions.md
    condition: when making architectural choices or understanding why something is built a certain way
  - target: context/setup.md
    condition: when setting up the dev environment or running the project for the first time
  - target: patterns/INDEX.md
    condition: when starting a task — check the pattern index for a matching pattern file
last_updated: 2026-10-02
---

# Session Bootstrap

If you haven't already read `AGENTS.md`, read it now — it contains the project identity, non-negotiables, and commands.

Then read this file fully before doing anything else in this session.

## Current Project State
**Working:**
- Dark + light theme (`data-theme`, `skockaj-theme`); sun/moon toggle; FOUC-safe bootstrap (CSP nonce)
- Branded error pages: `not-found`, `error` (`retry()`), `global-error`, product `not-found`
- `/kontakt` form + honeypot + `POST /api/v1/contact/`
- Homepage landing: hero, metrics, categories, how-it-works, benefits, shops (teal logo tiles), FAQ accordion, final CTA
- SEO: per-route metadata + canonicals, `sitemap.ts` + `robots.ts`, JSON-LD (Organization/WebSite, FAQ, Breadcrumb, Product/Offer), admin noindex
- Shared `Brand` + AA palette (`--glow-fill` / `--on-glow`)
- Filters in URL; Konfigurator; `/k/[hash]`; `/prodavnice`; cookie toast; legal pages
- **15 stores** in `src/lib/types.ts` (`STORE_NAMES` / `STORE_URLS` / `STORE_LOGOS` / `STORE_BLURBS`) + `public/logos/`
- Admin `/admin`: match queue (approve/reject + component search) **and** pending-components panel (`pending-components.tsx`, one-click approve)
- Pre-push: typecheck + sr unit + Playwright smoke
- **HTML caching**: public pages prerendered + CDN `s-maxage` (no more `force-dynamic`); static CSP in `next.config.ts`; `/admin` cookie gate stays in `src/proxy.ts`; Vercel `regions: ["fra1"]`

**Not yet built:**
- Category SEO landing pages (separate content pages)
- Owner-only stats / scrape-history panel
- Optional homepage leftovers: live "istaknute ponude", konfigurator teaser
- og:image brand card asset; GSC verification (post-ship)

**Known issues:**
- Tailwind v4 may bury global hover CSS — use `btn-*` / `card-hover` / `chip-btn` / `slot-hover`
- Next `router.replace` can lag ~1s in dev (poll in e2e)
- Next 16 `error.tsx` recovery prop is `retry()`
- `/komponente` stays dynamic (searchParams in `generateMetadata` for category titles); homepage + konfigurator are static
- CSP uses `script-src 'unsafe-inline'` (no per-request nonce) so HTML can be cached — tradeoff documented in `context/decisions.md`
- Contact `subject` empty → default "Poruka sa kontakt forme"
- FAQ accordion uses `grid-template-rows` animation
- `npm run lint` pre-existing `react-hooks/set-state-in-effect` errors in admin/catalog/cookie
- Product metadata falls back to "Proizvod nije pronađen" if API down/missing
- Public catalog only shows `approved` components — pending ones stay in `/admin`

## Routing Table

Load the relevant file based on the current task. Always load `context/architecture.md` first if not already in context this session.

| Task type | Load |
|-----------|------|
| Understanding how the system works | `context/architecture.md` |
| Working with a specific technology | `context/stack.md` |
| Writing or reviewing code | `context/conventions.md` |
| Making a design decision | `context/decisions.md` |
| Setting up or running the project | `context/setup.md` |
| Any specific task | Check `patterns/INDEX.md` for a matching pattern |

## Behavioural Contract

For every task, follow this loop:

1. **CONTEXT** — Load the relevant context file(s) from the routing table above. Check `patterns/INDEX.md` for a matching pattern. If one exists, follow it.
2. **BUILD** — Do the work. If a pattern exists, follow its Steps. If you are about to deviate from an established pattern, say so before writing any code — state the deviation and why.
3. **VERIFY** — Load `context/conventions.md` and run the Verify Checklist item by item. State each item and whether the output passes. Do not summarise — enumerate explicitly.
4. **DEBUG** — If verification fails or something breaks, check `patterns/INDEX.md` for a debug pattern. Follow it. Fix the issue and re-run VERIFY.
5. **GROW** — After meaningful work, run this binary checklist:
   - **Ground:** What changed in reality? Name the changed behavior, system, command, dependency, or workflow.
   - **Record:** If project state changed, update the "Current Project State" section above. If documented facts changed, update the relevant `context/` file surgically.
   - **Orient:** If this task can recur and no pattern exists, create one in `patterns/` using `patterns/README.md`, then add it to `patterns/INDEX.md`. If a pattern exists but you learned a gotcha, update it.
   - **Write:** Bump `last_updated` in every scaffold file you changed. Read `mex logging --json` before optional `mex log` notes: `significant` records material rationale, `checkpoints` batches useful notes at task/session boundaries, and `manual` avoids unsolicited notes. Honor explicit user log requests in every mode; mandatory workflow Activity and recovery audits remain required.
