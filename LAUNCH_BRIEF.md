# Runecast Launch Brief

Last updated: 2026-08-14
Supersedes: `OPERATOR_BRIEF.md`, `todo.md`

---

## Current Status

**Launch-ready.** All P0–P2 engineering items are complete. Two non-blocking decisions remain before going public, both owned by the operator rather than engineering.

---

## What Is Runecast

A Next.js 16 App Router web app for reflective Elder Futhark rune readings. Users draw three runes; the server generates an AI-narrative via Anthropic, falling back to a deterministic knowledgebase response if the AI is unavailable.

---

## Completed Work

### P0 — Critical (all done)

- Per-IP rate limiting on `POST /api/reading` with burst control.
- Bot/abuse friction via Cloudflare Turnstile.
- Request payload validation with strict schema and bounds checks (Zod).
- AI call resilience: server-side timeouts, retries, and circuit breaking.
- Safe error handling: no sensitive data leaks to clients.

### P1 — High Priority (all done)

- Structured observability: request IDs, endpoint latency, error rate metrics.
- Production error monitoring integration (Sentry) for both server and client.
- Integration tests for `/api/reading` (success, invalid input, fallback paths).
- E2E test for the core user journey (home → reading → result → draw again).
- Security headers via `proxy.ts`: CSP, `frame-ancestors`, referrer policy, etc. The CSP uses a per-request nonce with `'strict-dynamic'` (no `'unsafe-inline'` in `script-src`), so all pages render dynamically.

### P2 — Launch Polish (all done)

- Open Graph, Twitter cards, canonical URLs, and robots directives.
- `robots.txt` and `sitemap.xml` metadata routes.
- Legal/compliance pages: privacy, terms, disclaimer — all linked from the global footer.
- Dependency vulnerabilities resolved: `npm audit` reports **0 vulnerabilities** as of this date.
- Legal text scaffolding is in place (see open item below for sign-off).

---

## Verification State

Run these before every deployment:

| Command | Expected result |
| --- | --- |
| `npm test` | 7 files, 30 tests — all pass |
| `npm run lint` | 0 errors |
| `npm run build` | Clean production build |
| `npm audit` | 0 vulnerabilities |
| `npm run test:e2e` | Core user journey passes |

---

## Open Items Before Public Launch

These are operator decisions, not engineering tasks.

### 1. Legal text sign-off

The privacy, terms, and disclaimer pages contain launch-ready scaffolding text. A qualified reviewer should read and approve each page before Runecast is publicly accessible.

**Owner:** Operator / legal reviewer.
**Blocking:** Yes — do not launch to the public without approval.

### 2. Incident response assignment

No finalized runbook exists. Define and record:

- On-call contact or support email.
- Severity levels (e.g., site down vs. degraded AI vs. UI bug).
- Rollback steps (redeploy previous Vercel deployment).
- User-facing status message template.

**Owner:** Operator
**Blocking:** Recommended before launch; risk is slower response to production incidents.

---

## Post-Launch Growth Items (P3)

These are not launch-blocking. Pick them up after the app is stable and live.

- ~~Finalize domain and production hosting configuration.~~ Done 17 Nov 2026: Vercel + `runemaiden.app` (OpenProvider DNS → Vercel). See README → Deployment.
- Add ad placements only after performance and policy checks pass.
- Begin promotion/advertising once reliability KPIs are stable.
- Revisit rate limit and circuit breaker state management if scaling beyond a single instance (current in-memory state is acceptable for early launch).

---

## Environment Variables Required in Production

| Variable | Purpose |
| --- | --- |
| `ANTHROPIC_API_KEY` | AI narrative generation |
| `TURNSTILE_SECRET_KEY` | Server-side Turnstile abuse check |
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY` | Client-side Turnstile widget |
| `SENTRY_DSN` | Server error capture |
| `NEXT_PUBLIC_SENTRY_DSN` | Client error capture |
| `NEXT_PUBLIC_SITE_URL` | Canonical URL base (recommended) |

---

## Architecture Quick Reference

| Layer | Location |
| --- | --- |
| Pages | `app/page.tsx`, `app/reading/`, `app/privacy/`, `app/terms/`, `app/disclaimer/` |
| API endpoint | `app/api/reading/route.ts` |
| Rune knowledgebase | `lib/runes.ts` |
| Spread definitions | `lib/spreads.ts` |
| Draw logic | `lib/draw.ts` |
| AI generation | `lib/anthropic.ts` |
| Fallback + grounding | `lib/reading.ts` |
| Schema validation | `lib/readingRequestSchema.ts` |
| Rate limiting | `lib/rateLimit.ts` |
| Turnstile | `lib/turnstile.ts` |
| Circuit breaker | `lib/circuitBreaker.ts` |
| Security headers | `proxy.ts` |
| Observability | `lib/observability.ts` |
| Error monitoring | `lib/errorMonitoring.server.ts`, `lib/errorMonitoring.client.ts` |
| Site metadata helpers | `lib/site.ts` |

For deeper technical context, see `AI_HANDOFF.md`.
