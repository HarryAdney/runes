import type {
  DrawnRune,
  GroundingEntry,
  Reading,
  Spread,
} from "@/types";

/**
 * Build the deterministic, knowledgebase-derived facts for a draw.
 *
 * For each drawn position this resolves the position's interpretive role and the
 * exact meaning text for the rune in its drawn orientation. This is the factual
 * scaffold handed to the AI layer, and is also what the fallback renders directly.
 */
export function buildGrounding(
  drawn: DrawnRune[],
  spread: Spread,
): GroundingEntry[] {
  return drawn.map((d) => {
    const position = spread.positions[d.positionIndex];
    const meaning =
      d.orientation === "reversed" && d.rune.reversed !== null
        ? d.rune.reversed
        : d.rune.upright;

    return {
      positionLabel: position?.label ?? `Position ${d.positionIndex + 1}`,
      positionRole: position?.role ?? "",
      runeName: d.rune.name,
      runeGlyph: d.rune.glyph,
      orientation: d.rune.reversed === null ? "upright" : d.orientation,
      meaning,
      keywords: d.rune.keywords,
    };
  });
}

/**
 * Assemble a knowledgebase-only reading (no AI narrative). Used as the fallback
 * when the AI layer is unavailable, and as the base the AI layer enriches.
 */
export function buildFallbackReading(
  drawn: DrawnRune[],
  spread: Spread,
  question: string | null,
  aiEnabled: boolean,
): Reading {
  return {
    spreadName: spread.name,
    question,
    drawn,
    grounding: buildGrounding(drawn, spread),
    overview: null,
    sections: [],
    advice: null,
    aiAvailable: false,
    aiEnabled,
  };
}

/** Render the grounding facts as a compact text block for the AI prompt. */
export function groundingToPromptText(grounding: GroundingEntry[]): string {
  return grounding
    .map((g, i) => {
      const orient = g.orientation === "reversed" ? " (reversed)" : "";
      return [
        `${i + 1}. Position: ${g.positionLabel} — ${g.positionRole}`,
        `   Rune drawn: ${g.runeName}${orient}`,
        `   Keywords: ${g.keywords.join(", ")}`,
        `   Authoritative meaning: ${g.meaning}`,
      ].join("\n");
    })
    .join("\n\n");
}
