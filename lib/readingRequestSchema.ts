import { z } from "zod";

const runeRefSchema = z.object({
  id: z.string().trim().min(1).max(64),
});

const drawnInputSchema = z
  .object({
    runeId: z.string().trim().min(1).max(64).optional(),
    rune: runeRefSchema.optional(),
    positionIndex: z.number().int().min(0).max(24),
    orientation: z.enum(["upright", "reversed"]),
  })
  .superRefine((value, ctx) => {
    if (!value.runeId && !value.rune?.id) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Each drawn rune must include runeId or rune.id",
      });
    }
  });

const readingRequestSchema = z.object({
  spreadId: z.string().trim().min(1).max(64),
  question: z.string().max(1000).nullable().optional(),
  challengeToken: z.string().max(2048).nullable().optional(),
  drawn: z.array(drawnInputSchema).min(1).max(25),
});

export type NormalizedReadingRequest = {
  spreadId: string;
  question: string | null;
  challengeToken: string | null;
  drawn: Array<{
    runeId: string;
    positionIndex: number;
    orientation: "upright" | "reversed";
  }>;
};

export function parseReadingRequest(
  input: unknown,
):
  | {
      success: true;
      data: NormalizedReadingRequest;
    }
  | {
      success: false;
    } {
  const parsed = readingRequestSchema.safeParse(input);
  if (!parsed.success) return { success: false };

  return {
    success: true,
    data: {
      spreadId: parsed.data.spreadId,
      question: parsed.data.question ?? null,
      challengeToken: parsed.data.challengeToken ?? null,
      drawn: parsed.data.drawn.map((item) => ({
        runeId: item.runeId ?? item.rune!.id,
        positionIndex: item.positionIndex,
        orientation: item.orientation,
      })),
    },
  };
}
