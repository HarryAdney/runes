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



## Deploy to Vercel

This project is a standard Next.js app, so you can deploy it directly to Vercel—no static export or custom Vercel configuration is needed.

Push the project to GitHub, then in Vercel choose Add New → Project and import the repository.
Keep the detected Next.js framework and default build settings (npm run build). Leave the output directory at its default.
In Project Settings → Environment Variables, add:
TURNSTILE_SECRET_KEY and NEXT_PUBLIC_TURNSTILE_SITE_KEY — required for production readings. Create a Cloudflare Turnstile widget and configure it for the domain(s) you’ll use. Set these before building, especially the NEXT_PUBLIC_ key.
ANTHROPIC_API_KEY — optional; without it, readings still work using the traditional meanings.
NEXT_PUBLIC_SITE_URL — recommended; set it to your production URL, such as https://yourdomain.com.
SENTRY_DSN and NEXT_PUBLIC_SENTRY_DSN — optional.
Assign variables to the environments you’ll use. Preview deployments run in production mode too, so add the Turnstile keys to Preview if you want readings to work there. Redeploy after changing environment variables.
After deployment, test a reading on the production URL and confirm the Turnstile challenge works. Add a custom domain in Vercel if needed.
The project’s environment-variable notes are in .env.example and README.md. One caveat: its rate limiter is in memory, so on Vercel it is per server instance, not a dependable global limit; use shared storage if you later need strict cross-instance rate limiting.