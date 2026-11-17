# Runecast — Elder Futhark Rune Readings

A small Next.js site that gives visitors a reflective rune reading. A visitor
optionally enters a question, draws three runes (Past / Present / Future), and
receives a reading.

The reading is **hybrid**:

- A typed **knowledgebase** ([`lib/runes.ts`](lib/runes.ts)) is the authoritative
  source for the 24 Elder Futhark runes plus the blank "Wyrd" rune, each with
  upright and reversed meanings. [`lib/spreads.ts`](lib/spreads.ts) defines the
  spread and how each position is read.
- The draw ([`lib/draw.ts`](lib/draw.ts)) and grounding
  ([`lib/reading.ts`](lib/reading.ts)) deterministically supply the meaning of
  each drawn rune in its position.
- A **Claude-generated layer** ([`lib/anthropic.ts`](lib/anthropic.ts)) weaves
  those authoritative meanings into a personalised reading and advice, grounded
  so it never invents or contradicts the rune meanings.

The Claude call runs server-side in [`app/api/reading/route.ts`](app/api/reading/route.ts),
so the API key never reaches the browser.

## Setup

```bash
npm install
cp .env.example .env.local   # then add your ANTHROPIC_API_KEY
npm run dev
```

Open <http://localhost:3000>

### Environment

| Variable | Required | Notes |
| --- | --- | --- |
| `ANTHROPIC_API_KEY` | No\* | Enables the AI interpretation layer. Model: `claude-haiku-5-5`. |
| `TURNSTILE_SECRET_KEY` | Production: yes | Server-side Turnstile secret for abuse prevention. In production, readings fail with a 503 until both Turnstile values are set. Optional in development. |
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY` | Production: yes | Client-side Turnstile widget key. Must be set before `npm run build`, because `NEXT_PUBLIC_` values are inlined at build time. |
| `SENTRY_DSN` | Optional | Server-side error capture for API/runtime failures. |
| `NEXT_PUBLIC_SENTRY_DSN` | Optional | Browser/runtime error capture for frontend issues. |
| `NEXT_PUBLIC_SITE_URL` | Recommended | Canonical site origin for SEO metadata, `robots.txt`, and `sitemap.xml`. |

\* Without a key (or if the API call fails), the site **still works** — readings
fall back to the runes' traditional meanings, just without the personalised
interpretation. This makes the site demoable with no key and resilient in
production.

If `NEXT_PUBLIC_SITE_URL` is not set, the app falls back to deployment-provided
Vercel URLs when available, then `http://localhost:3000` in local development.

### Deployment (Vercel)

- **Hosting:** Vercel project `runes`, deployed from `main` on GitHub. Vercel URL:
  `https://runes-bay.vercel.app`. Custom domain: `https://runemaiden.app`.
- **Domain/DNS:** registered at OpenProvider. DNS stays at OpenProvider, with the
  A record (`@`) and `www` record set to the values shown in Vercel → Settings →
  Domains. Vercel issues and renews the SSL certificate automatically, so no
  third-party certificate is needed.
- **Secrets:** add `TURNSTILE_SECRET_KEY` and `ANTHROPIC_API_KEY` in Vercel as the
  **Secret** type. Never put real values in `.env.example` or any tracked file;
  real values live only in Vercel and in the git-ignored `.env`.
- **Turnstile hostnames:** the Cloudflare Turnstile widget only works on hostnames
  listed under the widget's *Hostname management*. The list currently holds
  `runes-bay.vercel.app`, `runemaiden.app` and `www.runemaiden.app`, entered as
  bare hostnames (no `https://`, no trailing `/`). Preview deployment URLs are
  not on the list, so Turnstile fails on them with error `110200` unless you add
  them.
- Redeploy after changing environment variables. Hostname changes in Cloudflare
  take effect without a redeploy.

### Troubleshooting

| Symptom | Cause | Fix |
| --- | --- | --- |
| Console shows `TurnstileError ... 110200`; the reading page shows "Unable to connect" | The page's hostname isn't on the Turnstile widget's hostname list | Add the bare hostname in Cloudflare → Turnstile → widget → Hostname management |
| `/api/reading` returns 503 in production | Turnstile env vars are missing | Set both Turnstile variables in Vercel and redeploy |
| Vercel marks a variable "Needs Attention" | The value is empty, or Vercel has detected it as exposed | Fill it in, or rotate the key at the provider and save the new value |

## Scripts

| Command         | What it does                          |
| --------------- | ------------------------------------- |
| `npm run dev`   | Start the dev server                  |
| `npm run build` | Production build                      |
| `npm run start` | Run the production build              |
| `npm run lint`  | Lint                                  |
| `npm run test`  | Unit tests (Vitest)                   |

## Project structure

``` tsx
app/
  page.tsx                 Landing page
  reading/page.tsx         Draw screen (client component)
  api/reading/route.ts     POST endpoint: grounds the draw + calls Claude
lib/
  runes.ts                 The rune knowledgebase (25 entries)
  spreads.ts               Spread definitions
  draw.ts                  Pure draw logic (seedable RNG)
  reading.ts               Grounding / fallback composition
  anthropic.ts             Server-only Claude wrapper + fallback
components/
  RuneCard.tsx             A single drawn rune
  ReadingResult.tsx        The rendered reading
types.ts                   Shared types
```

## Adding a new spread

Add an entry to [`lib/spreads.ts`](lib/spreads.ts) with its positions and each
position's interpretive `role`. The draw, grounding, and AI layers are all
spread-agnostic; only the UI layout for the new shape needs attention.

## Note

Readings are for reflection and entertainment — a mirror for your own thinking,
not a prediction of fixed events.
