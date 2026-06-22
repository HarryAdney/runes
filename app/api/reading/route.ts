import type { NextRequest } from "next/server";
import type { DrawnRune, Reading, ReadingRequest } from "@/types";
import { getRuneById } from "@/lib/runes";
import { getSpreadById } from "@/lib/spreads";
import { buildFallbackReading, buildGrounding } from "@/lib/reading";
import { generateReadingNarrative } from "@/lib/anthropic";

/**
 * Re-resolve the drawn runes from the request against the server-side
 * knowledgebase. We trust only the rune id, orientation, and position index
 * from the client — the meanings always come from our own data.
 */
function resolveDrawn(raw: unknown): DrawnRune[] | null {
  if (!Array.isArray(raw)) return null;
  const drawn: DrawnRune[] = [];

  for (const item of raw) {
    if (typeof item !== "object" || item === null) return null;
    const rec = item as Record<string, unknown>;

    const runeId =
      typeof rec.rune === "object" && rec.rune !== null
        ? (rec.rune as Record<string, unknown>).id
        : rec.runeId;
    const positionIndex = rec.positionIndex;
    const orientation = rec.orientation;

    if (typeof runeId !== "string") return null;
    if (typeof positionIndex !== "number") return null;
    if (orientation !== "upright" && orientation !== "reversed") return null;

    const rune = getRuneById(runeId);
    if (!rune) return null;

    drawn.push({
      rune,
      // A symmetrical / blank rune is always read upright.
      orientation: rune.reversed === null ? "upright" : orientation,
      positionIndex,
    });
  }

  return drawn;
}

export async function POST(request: NextRequest) {
  let body: ReadingRequest;
  try {
    body = (await request.json()) as ReadingRequest;
  } catch {
    return Response.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const spread = getSpreadById(body.spreadId);
  if (!spread) {
    return Response.json({ error: "Unknown spread." }, { status: 400 });
  }

  const drawn = resolveDrawn(body.drawn);
  if (!drawn || drawn.length !== spread.positions.length) {
    return Response.json(
      { error: "Drawn runes do not match the spread." },
      { status: 400 },
    );
  }

  const question =
    typeof body.question === "string" && body.question.trim().length > 0
      ? body.question.trim().slice(0, 1000)
      : null;

  const grounding = buildGrounding(drawn, spread);
  const narrative = await generateReadingNarrative(grounding, spread, question);

  if (!narrative) {
    // AI layer unavailable (no key or call failed) — knowledgebase-only reading.
    const fallback = buildFallbackReading(drawn, spread, question);
    return Response.json(fallback satisfies Reading);
  }

  const reading: Reading = {
    spreadName: spread.name,
    question,
    drawn,
    grounding,
    overview: narrative.overview,
    sections: narrative.sections,
    advice: narrative.advice,
    aiAvailable: true,
  };

  return Response.json(reading);
}
