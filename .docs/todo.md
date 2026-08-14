# Production Readiness Mitigation Plan

## P0 — Critical (Do First)

- [x] Add API rate limiting on `POST /api/reading` (per-IP + short burst control).
- [x] Add bot/abuse friction for the reading endpoint (captcha or equivalent challenge).
- [x] Add request payload validation with a schema validator (strict shape + bounds checks).
- [x] Enforce server-side timeouts/retries/circuit-breaking for AI calls to control cost and latency.
- [x] Add robust error handling with safe client messages and no sensitive data leakage.

## P1 — High Priority (Before Public Launch)

- [x] Add observability: structured logs, request IDs, endpoint latency, error rate metrics.
- [x] Integrate production error monitoring/alerting (e.g., Sentry) for API + app runtime errors.
- [x] Add integration tests for `/api/reading` success, invalid input, and fallback paths.
- [x] Add E2E tests for core user journey (home -> reading -> result -> draw again).
- [x] Add security headers (CSP, frame-ancestors, referrer-policy, etc.) via Next config/middleware.

## P2 — Medium Priority (Launch Polish)

- [x] Expand SEO metadata (Open Graph, Twitter cards, canonical, robots directives).
- [x] Add `robots.txt` and `sitemap.xml`.
- [x] Add legal/compliance pages (privacy policy, terms, clearer entertainment disclaimer).
- [ ] Review and track dependency vulnerabilities from `npm audit`; patch non-breaking updates.
- [ ] Define incident response basics: on-call contact, rollback steps, and service status messaging.

## P3 — Growth / Business

- [ ] Get a domain and production hosting configuration finalized.
- [ ] Add ad placements only after performance + policy checks pass.
- [ ] Start promotion/advertising once reliability KPIs are stable.
