---
name: decisions
description: Key architectural and technical decisions with reasoning. Load when making design choices or understanding why something is built a certain way.
triggers:
  - "why do we"
  - "why is it"
  - "decision"
  - "alternative"
  - "we chose"
edges:
  - target: context/architecture.md
    condition: when a decision relates to system structure
  - target: context/stack.md
    condition: when a decision relates to technology choice
# Decisions usually ground sparsely; add only symbols that implement the decision.
# Entry shape: { node: "function:<tier-1-id>", fingerprint: "mh:64:<hex>" }
grounds_to: []
last_updated: 2026-10-02
---

# Decisions

<!-- If a decision names its concrete implementation point, link it as below;
     do not anchor vague concepts:
```markdown
[`someFunction()`](mex://function:<tier-1-id>)
```
-->

<!-- HOW TO USE THIS FILE:
     Each decision follows the format below.
     When a decision changes: DO NOT delete the old entry.
     Mark it as superseded, add the new entry above it.
     The history must be preserved — this is the event clock. -->

## Decision Log

### Prefer cacheable HTML over per-request CSP nonces
**Date:** 2026-10-02
**Status:** Active
**Decision:** Use a static CSP (`script-src 'self' 'unsafe-inline'`) in `next.config.ts` and drop `force-dynamic`/nonce plumbing so public pages can be prerendered and CDN-cached. Pin Vercel functions to `fra1` via `vercel.json`.
**Reasoning:** Nonce CSP requires dynamic rendering (Next.js docs), so every hit paid full SSR + transatlantic TTFB (`x-vercel-id: fra1::iad1`). Homepage is public marketing content; `s-maxage` + static prerender removes that cost. Measured local TTFB after fix: ~7ms cache HIT vs ~250–370ms SSR.
**Alternatives considered:** Keep nonce + force-dynamic (status quo — slow); experimental SRI/hash CSP (still blocks Next inline flight scripts without hashes for every payload); ISR only without CSP change (still no-store if layout stays dynamic).
**Consequences:** XSS surface for inline scripts is weaker than nonce CSP (accepted for this public site). `src/proxy.ts` only gates `/admin`. Data routes use ISR (`revalidate = 3600`) instead of SSR. `/komponente` remains dynamic because `generateMetadata` reads `searchParams` for category titles.

<!-- Document key decisions using the format below.
     Include decisions that: are non-obvious, have important constraints,
     or where the reasoning prevents future mistakes.
     Do not document every decision — only ones where "why" matters.
     Minimum 3 decision entries during initial population. If you cannot identify 3,
     write placeholder entries with "[TO DETERMINE]" and explain what decision is pending.

     Format for each entry:

     ### [Decision Title]
     **Date:** YYYY-MM-DD (check git history for real dates when possible)
     **Status:** Active | Superseded by [title]
     **Decision:** [What was decided, in one sentence]
     **Reasoning:** [Why this was chosen]
     **Alternatives considered:** [What else was considered and why it was rejected]
     **Consequences:** [What this means for the codebase going forward]

     Example:

     ### Use PostgreSQL for all persistent storage
     **Date:** 2024-03-01
     **Status:** Active
     **Decision:** All persistent data lives in PostgreSQL, no secondary databases.
     **Reasoning:** Simplicity — one database to operate, backup, and reason about.
     **Alternatives considered:** Redis for sessions (rejected — adds operational complexity for minimal gain), MongoDB for user preferences (rejected — relational model fits our data).
     **Consequences:** No caching layer at database level. Application-level caching if needed.

     Example of a superseded entry:

     ### Use Redis for session storage
     **Date:** 2024-02-15
     **Status:** Superseded by "Use PostgreSQL for all persistent storage"
     **Decision:** Store user sessions in Redis.
     **Reasoning:** Fast read/write for session data.
     **Alternatives considered:** PostgreSQL (chosen later due to operational simplicity).
     **Consequences:** ~~Requires Redis infrastructure alongside PostgreSQL.~~
     **Superseded because:** Maintaining two data stores added operational complexity
     without meaningful performance benefit for our scale. -->
