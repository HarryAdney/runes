# Runecast AI Handoff Report

Last updated: 2026-07-05
Repository: runes
Branch: main

## 1. Product Summary

Runecast is a Next.js 16 App Router web app for reflective Elder Futhark rune readings.

User flow:

1. User lands on home page.
2. User starts a three-rune spread.
3. Client draws runes locally for immediate UX.
4. Client posts draw data and optional question to POST /api/reading.
5. Server re-validates and re-resolves runes from server knowledgebase.
6. Server attempts AI narrative generation (Anthropic) with resilience controls.
7. If AI is unavailable, server returns deterministic knowledgebase fallback.
8. UI renders reading and allows draw again.

Core principle: The rune meaning source of truth is always server-side knowledgebase data, never trusted from client payloads.

## 2. Current Production Readiness Status

Source of truth checklist: todo.md

Completed:

- P0 items: rate limiting, abuse friction (Turnstile), request validation, AI timeout-retry-circuit-breaker, safe error handling.
- P1 items: observability, error monitoring integration, API integration tests, E2E user flow test, security headers.
- P2 items now completed in this session:
  - Expanded SEO metadata (Open Graph, Twitter cards, canonical, robots directives).
  - Added robots and sitemap metadata routes.
  - Added legal/compliance pages (privacy, terms, disclaimer).

Still open:

- Review and track dependency vulnerabilities from npm audit; patch non-breaking updates.
- Define incident response basics: on-call contact, rollback steps, and status messaging.

## 3. Architecture Overview

### Frontend and Routing

- App Router structure under app/.
- Main pages:
  - app/page.tsx (landing)
  - app/reading/page.tsx (server page; passes aiEnabled to components/ReadingClient.tsx, the client reading experience)
  - app/privacy/page.tsx
  - app/terms/page.tsx
  - app/disclaimer/page.tsx
- Shared root layout and global metadata:
  - app/layout.tsx

### API

- Endpoint: app/api/reading/route.ts
- Method: POST
- Responsibilities:
  - request id generation
  - per-IP rate limiting
  - JSON parsing and schema validation
  - spread and draw consistency checks
  - Turnstile verification (required in production: returns 503 if not configured; optional in development)
  - grounding construction
  - AI narrative generation attempt
  - fallback reading if AI unavailable
  - structured observability logging
  - safe error responses and server-side exception capture

### Domain and Business Logic

- Rune knowledgebase: lib/runes.ts
- Spread definitions: lib/spreads.ts
- Draw logic: lib/draw.ts
- Grounding and fallback composition: lib/reading.ts
- AI narrative generation: lib/anthropic.ts
- Request schema validation: lib/readingRequestSchema.ts

### Reliability and Security Controls

- Rate limiter: lib/rateLimit.ts
- Turnstile verification: lib/turnstile.ts
- Circuit breaker: lib/circuitBreaker.ts
- Security headers via proxy: proxy.ts
- Content Security Policy is nonce-based (since 2026-11-17):
  - proxy.ts generates a fresh nonce per request and sets `script-src 'nonce-…' 'strict-dynamic'` (no `'unsafe-inline'`). `'self'` and `https://challenges.cloudflare.com` remain only as a fallback for browsers without `'strict-dynamic'` support.
  - The nonce is also set on the request headers (`Content-Security-Policy`, `x-nonce`); Next.js reads it and applies it to its own scripts and to `next/script` (Turnstile) automatically.
  - app/layout.tsx calls `await connection()` so every page renders per request. Do not remove it or make pages static: static HTML has no nonce and all scripts would be blocked.
  - Never add `'unsafe-inline'` back to `script-src`; Mozilla Observatory flags it. `style-src` still allows `'unsafe-inline'` on purpose (Next fonts, Turnstile widget styles).
  - `'unsafe-eval'` is added in development only.

### Monitoring and Observability

- Structured API logs and endpoint metrics counters: lib/observability.ts
- Server exception capture (Sentry if configured): lib/errorMonitoring.server.ts
- Client exception capture (Sentry if configured): lib/errorMonitoring.client.ts
- Browser global error and unhandled rejection listener: components/ClientErrorMonitor.tsx

## 4. SEO and Metadata Work Completed

### New shared site metadata helper

- Added lib/site.ts
- Provides:
  - SITE_NAME
  - SITE_DESCRIPTION
  - SITE_TAGLINE
  - getSiteUrl()
  - getSiteOrigin()

Site URL resolution order:

1. NEXT_PUBLIC_SITE_URL
2. VERCEL_PROJECT_PRODUCTION_URL
3. VERCEL_URL
4. <http://localhost:3000> fallback

### Root metadata expansion

- app/layout.tsx now includes:
  - metadataBase from getSiteOrigin()
  - title template and default
  - canonical alternate for /
  - Open Graph metadata
  - Twitter card metadata
  - robots directives with Googlebot overrides
  - keywords and category

### Route-level metadata

- app/page.tsx includes page-specific title and description.
- app/reading/layout.tsx adds canonical and SEO text for /reading.

### Metadata routes

- app/robots.ts
  - allows main public and legal routes
  - disallows /api/
  - references sitemap
- app/sitemap.ts
  - includes /, /reading, /privacy, /terms, /disclaimer

### Social share images

- app/opengraph-image.tsx (generated image)
- app/twitter-image.tsx (re-export of OG image config)

### Proxy matcher adjustment

- proxy.ts matcher now excludes robots.txt and sitemap.xml so metadata routes are not intercepted.

## 5. Legal and Compliance Work Completed

Added public legal pages:

- app/privacy/page.tsx
- app/terms/page.tsx
- app/disclaimer/page.tsx

Added discoverability links in global footer:

- Implemented in app/layout.tsx footer nav.

Important note:

- Current legal text is launch-ready scaffolding and should still receive legal review before public production launch.

## 6. Environment and Configuration

### Runtime variables in use

- AI and reading:
  - ANTHROPIC_API_KEY
- Abuse prevention:
  - TURNSTILE_SECRET_KEY
  - NEXT_PUBLIC_TURNSTILE_SITE_KEY
- Error monitoring:
  - SENTRY_DSN
  - NEXT_PUBLIC_SENTRY_DSN
- Canonical metadata base:
  - NEXT_PUBLIC_SITE_URL (recommended)

### Next configuration

- next.config.ts sets turbopack.root to this project directory to avoid root mis-detection caused by a parent lockfile.

### Important project instruction for future AI agents

- AGENTS.md states this Next.js version has breaking changes and agents should consult docs in node_modules/next/dist/docs before implementing framework-specific changes.

## 7. Testing and Verification State

### Unit and integration-like coverage (Vitest)

Present tests include:

- app/api/reading/route.test.ts
- lib/circuitBreaker.test.ts
- lib/draw.test.ts
- lib/observability.test.ts
- lib/rateLimit.test.ts
- lib/readingRequestSchema.test.ts
- lib/turnstile.test.ts

### End-to-end coverage (Playwright)

- tests/e2e/reading-flow.spec.ts validates home to reading to result to draw-again path.

### Validation run during this session

Executed successfully:

- npm run build
- npm run lint

Build output confirmed static routes for:

- /
- /reading
- /privacy
- /terms
- /disclaimer
- /robots.txt
- /sitemap.xml
- /opengraph-image
- /twitter-image

## 8. Dependency Security Status (Open P2 Item)

Most recent command context showed npm audit fix failed (exit code 1).

Current npm audit --json shows:

- Total vulnerabilities: 2 moderate
- Packages implicated:
  - next (via postcss advisory path)
  - postcss (GHSA-qx2v-qp2m-jg93)

Audit output currently reports a non-actionable fix path suggesting next 9.3.3, which is semver-major and older than the current Next 16 line, indicating a likely advisory mapping issue for this dependency graph.

Actionable next step for this item:

1. Track the advisory in repo docs with date and package graph evidence.
2. Re-run audit after dependency metadata updates and after any next/eslint ecosystem patch releases.
3. Avoid downgrading framework major versions to satisfy this reported fix path.

## 9. File Changes Introduced In This Session

Modified:

- app/layout.tsx
- app/page.tsx
- proxy.ts
- README.md
- todo.md

Added:

- lib/site.ts
- app/robots.ts
- app/sitemap.ts
- app/opengraph-image.tsx
- app/twitter-image.tsx
- app/reading/layout.tsx
- app/privacy/page.tsx
- app/terms/page.tsx
- app/disclaimer/page.tsx
- AI_HANDOFF.md

## 10. Known Risks and Gaps

1. Legal text quality: Good operational draft, but no legal counsel review yet.
2. Incident response runbook not yet implemented as docs or UI.
3. Dependency audit item remains open pending ecosystem-appropriate remediation.
4. In-memory limiter/circuit-breaker state is per-instance; distributed deployments require shared state or edge-native controls for strict global guarantees.
5. Observability currently logs structured events and simple in-process counters; no persistent metrics backend is configured in-repo.

## 11. Recommended Next Work Order

1. Complete remaining P2 dependency audit item with a tracked security note and safe upgrades only.
2. Implement incident response basics:
   - add an incident runbook document
   - define on-call contact and escalation steps
   - define rollback procedure
   - add service status messaging pattern
3. Optional hardening:
   - add explicit tests for metadata routes and legal page availability
   - expand E2E assertions for legal links in footer
   - add production-oriented monitoring dashboards/alerts if environment supports them

## 12. How Another AI Should Safely Continue

1. Read AGENTS.md first and treat node_modules/next/dist/docs as framework behavior authority.
2. Read todo.md to align with remaining milestone work.
3. Run baseline validation:
   - npm run lint
   - npm run test
   - npm run build
4. For API changes, preserve server authority over rune meanings and maintain fallback behavior.
5. For security changes, preserve existing proxy headers and abuse controls unless intentionally redesigning with documented impact.
6. Update this handoff file after major architecture or policy changes.
