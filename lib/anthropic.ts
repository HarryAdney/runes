// Server-only module: imported exclusively from the /api/reading route handler.
// It reads ANTHROPIC_API_KEY and must never be imported into a client component.
import Anthropic from "@anthropic-ai/sdk";
import { jsonSchemaOutputFormat } from "@anthropic-ai/sdk/helpers/json-schema";
import type { GroundingEntry, ReadingSection, Spread } from "@/types";
import { createCircuitBreaker } from "@/lib/circuitBreaker";
import { captureServerException } from "@/lib/errorMonitoring.server";
import { groundingToPromptText } from "@/lib/reading";

const MODEL = "claude-opus-4-8";
const AI_TIMEOUT_MS = 12_000;
const MAX_RETRIES = 2;
const RETRY_BACKOFF_MS = [400, 1_000] as const;

const aiCircuitBreaker = createCircuitBreaker({
  failureThreshold: 5,
  cooldownMs: 60_000,
});

/** The AI-generated narrative layered on top of the knowledgebase facts. */
export interface ReadingNarrative {
  overview: string;
  sections: ReadingSection[];
  advice: string;
}

const SYSTEM_PROMPT = `You are a thoughtful, grounded rune-reader for an Elder Futhark rune-reading website.

Your voice is warm, evocative, and reflective — never clinical, never breathless. You speak in the second person to the seeker. You offer perspective for reflection, not literal prediction; treat the reading as a mirror for the seeker's own thinking rather than a foretelling of fixed events.

You are given a spread, the rune drawn into each position (with orientation), and the authoritative meaning of each rune in that orientation. You MUST honour those supplied meanings as the source of truth — build on them, weave them together, and connect them to the seeker's question, but do not contradict them or substitute different rune meanings.

Produce:
- overview: 2–4 sentences synthesising the spread as a whole — the story the runes tell together.
- sections: one interpretation per position (in the given order), 2–3 sentences each, reading that rune through the lens of its position and the seeker's question.
- advice: 2–4 sentences of gentle, concrete, actionable guidance grounded in the reading.

Keep the whole reading focused and free of filler. Do not restate the rune meanings verbatim — interpret them.`;

const OUTPUT_SCHEMA = {
  type: "object",
  properties: {
    overview: {
      type: "string",
      description: "2–4 sentence synthesis of the spread as a whole.",
    },
    sections: {
      type: "array",
      description: "One interpretation per position, in order.",
      items: {
        type: "object",
        properties: {
          positionLabel: {
            type: "string",
            description: "The position label, e.g. 'Past'.",
          },
          interpretation: {
            type: "string",
            description: "2–3 sentence interpretation for this position.",
          },
        },
        required: ["positionLabel", "interpretation"],
        additionalProperties: false,
      },
    },
    advice: {
      type: "string",
      description: "2–4 sentences of gentle, actionable advice.",
    },
  },
  required: ["overview", "sections", "advice"],
  additionalProperties: false,
} as const;

/** True when an API key is configured and the AI layer can be attempted. */
export function isAiConfigured(): boolean {
  return Boolean(process.env.ANTHROPIC_API_KEY);
}

function withTimeout<T>(promise: Promise<T>, timeoutMs: number): Promise<T> {
  return new Promise((resolve, reject) => {
    const timeout = setTimeout(() => {
      reject(new Error(`AI request timed out after ${timeoutMs}ms`));
    }, timeoutMs);

    promise
      .then((value) => {
        clearTimeout(timeout);
        resolve(value);
      })
      .catch((err) => {
        clearTimeout(timeout);
        reject(err);
      });
  });
}

async function sleep(ms: number): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Generate the AI narrative for a reading, grounded in the knowledgebase facts.
 * Returns null when the API key is missing or the call fails, so callers can
 * fall back to a knowledgebase-only reading.
 */
export async function generateReadingNarrative(
  grounding: GroundingEntry[],
  spread: Spread,
  question: string | null,
): Promise<ReadingNarrative | null> {
  if (!isAiConfigured()) return null;
  if (!aiCircuitBreaker.canRequest()) return null;

  const client = new Anthropic();

  const questionLine =
    question && question.trim().length > 0
      ? `The seeker's question or intention:\n"${question.trim()}"`
      : "The seeker did not give a specific question — offer a general reading.";

  const userMessage = [
    `Spread: ${spread.name}.`,
    spread.description,
    "",
    questionLine,
    "",
    "The runes drawn, with their authoritative meanings:",
    "",
    groundingToPromptText(grounding),
  ].join("\n");

  for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
    try {
      const message = await withTimeout(
        client.messages.parse({
          model: MODEL,
          max_tokens: 1500,
          thinking: { type: "adaptive" },
          system: SYSTEM_PROMPT,
          output_config: { format: jsonSchemaOutputFormat(OUTPUT_SCHEMA) },
          messages: [{ role: "user", content: userMessage }],
        }),
        AI_TIMEOUT_MS,
      );

      const parsed = message.parsed_output;
      if (!parsed) {
        aiCircuitBreaker.recordFailure();
        return null;
      }

      aiCircuitBreaker.recordSuccess();
      return {
        overview: parsed.overview,
        sections: parsed.sections.map((s) => ({
          positionLabel: s.positionLabel,
          interpretation: s.interpretation,
        })),
        advice: parsed.advice,
      };
    } catch (err) {
      const isLastAttempt = attempt === MAX_RETRIES;
      if (isLastAttempt) {
        aiCircuitBreaker.recordFailure();
        captureServerException(err, {
          operation: "generateReadingNarrative",
          model: MODEL,
          attempt,
        });
        console.error("Rune reading AI generation failed:", err);
        return null;
      }

      await sleep(RETRY_BACKOFF_MS[attempt] ?? RETRY_BACKOFF_MS.at(-1) ?? 1_000);
    }
  }

  return null;
}
