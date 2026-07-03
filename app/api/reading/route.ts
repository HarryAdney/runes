import type { NextRequest } from "next/server";
import type { DrawnRune, Reading } from "@/types";
import { getRuneById } from "@/lib/runes";
import { getSpreadById } from "@/lib/spreads";
import { buildFallbackReading, buildGrounding } from "@/lib/reading";
import { generateReadingNarrative } from "@/lib/anthropic";
import { readingRateLimiter } from "@/lib/rateLimit";
import { parseReadingRequest } from "@/lib/readingRequestSchema";
import { isTurnstileConfigured, verifyTurnstileToken } from "@/lib/turnstile";

function getClientIp(request: NextRequest): string {
  const forwardedFor = request.headers.get("x-forwarded-for");
  if (forwardedFor) {
    const first = forwardedFor.split(",")[0]?.trim();
    if (first) return first;
  }

  const realIp = request.headers.get("x-real-ip")?.trim();
  if (realIp) return realIp;

  return "unknown";
}

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
  const requestId = crypto.randomUUID();

  const ip = getClientIp(request);
  const limit = readingRateLimiter.check(`reading:${ip}`);
  if (!limit.allowed) {
    return Response.json(
      {
        error: "Too many readings requested. Please wait and try again.",
        requestId,
      },
      {
        status: 429,
        headers: {
          "Retry-After": String(limit.retryAfterSeconds),
          "X-RateLimit-Limit": String(limit.limit),
          "X-RateLimit-Remaining": "0",
          "X-RateLimit-Reset": String(Math.floor(limit.resetAt / 1000)),
          "X-Request-Id": requestId,
        },
      },
    );
  }

  const rateLimitHeaders = {
    "X-RateLimit-Limit": String(limit.limit),
    "X-RateLimit-Remaining": String(limit.remaining),
    "X-RateLimit-Reset": String(Math.floor(limit.resetAt / 1000)),
    "X-Request-Id": requestId,
  };

  const errorResponse = (message: string, status: number) =>
    Response.json(
      {
        error: message,
        requestId,
      },
      {
        status,
        headers: rateLimitHeaders,
      },
    );

  try {
    if (process.env.NODE_ENV === "production" && !isTurnstileConfigured()) {
      return errorResponse("Challenge verification is not configured.", 503);
    }

    let rawBody: unknown;
    try {
      rawBody = await request.json();
    } catch {
      return errorResponse("Invalid JSON body.", 400);
    }

    const parsedBody = parseReadingRequest(rawBody);
    if (!parsedBody.success) {
      return errorResponse("Invalid request payload.", 400);
    }

    const body = parsedBody.data;

    const spread = getSpreadById(body.spreadId);
    if (!spread) {
      return errorResponse("Unknown spread.", 400);
    }

    const drawn = resolveDrawn(body.drawn);
    if (!drawn || drawn.length !== spread.positions.length) {
      return errorResponse("Drawn runes do not match the spread.", 400);
    }

    const question =
      typeof body.question === "string" && body.question.trim().length > 0
        ? body.question.trim().slice(0, 1000)
        : null;

    if (isTurnstileConfigured()) {
      const challengeToken =
        typeof body.challengeToken === "string"
          ? body.challengeToken.trim()
          : "";

      if (!challengeToken) {
        return errorResponse("Challenge verification is required.", 400);
      }

      const challengeOk = await verifyTurnstileToken(
        challengeToken,
        ip === "unknown" ? undefined : ip,
      );
      if (!challengeOk) {
        return errorResponse(
          "Challenge verification failed. Please try again.",
          403,
        );
      }
    }

    const grounding = buildGrounding(drawn, spread);
    const narrative = await generateReadingNarrative(
      grounding,
      spread,
      question,
    );

    if (!narrative) {
      // AI layer unavailable (no key or call failed) — knowledgebase-only reading.
      const fallback = buildFallbackReading(drawn, spread, question);
      return Response.json(fallback satisfies Reading, {
        headers: rateLimitHeaders,
      });
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

    return Response.json(reading, { headers: rateLimitHeaders });
  } catch (err) {
    console.error("reading-api unexpected error", {
      requestId,
      name: err instanceof Error ? err.name : "unknown",
    });
    return errorResponse("An unexpected error occurred. Please try again.", 500);
  }
}
