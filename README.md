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

Open http://localhost:3000.

### Environment

| Variable            | Required | Notes                                                                 |
| ------------------- | -------- | --------------------------------------------------------------------- |
| `ANTHROPIC_API_KEY` | No\*     | Enables the AI interpretation layer. Model: `claude-opus-4-8`.        |

\* Without a key (or if the API call fails), the site **still works** — readings
fall back to the runes' traditional meanings, just without the personalised
interpretation. This makes the site demoable with no key and resilient in
production.

## Scripts

| Command         | What it does                          |
| --------------- | ------------------------------------- |
| `npm run dev`   | Start the dev server                  |
| `npm run build` | Production build                      |
| `npm run start` | Run the production build              |
| `npm run lint`  | Lint                                  |
| `npm run test`  | Unit tests (Vitest)                   |

## Project structure

```
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
