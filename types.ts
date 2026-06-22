// Shared domain types for the rune-reading app.

/** A single rune in the knowledgebase. The blank "Wyrd" rune has `reversed: null`. */
export interface Rune {
  /** Stable slug, e.g. "fehu". */
  id: string;
  /** Display name, e.g. "Fehu". */
  name: string;
  /** Unicode runic glyph (U+16A0–U+16FF), e.g. "ᚠ". Empty string for the blank rune. */
  glyph: string;
  /** Phonetic value, e.g. "F". Empty for the blank rune. */
  phoneme: string;
  /** Short keyword tags summarising the rune. */
  keywords: string[];
  /** Upright meaning (1–2 sentences). */
  upright: string;
  /** Reversed (merkstave) meaning, or null if the rune has no reversed form. */
  reversed: string | null;
  /** Optional thematic grouping (e.g. an aett name). */
  element?: string;
}

export type Orientation = "upright" | "reversed";

/** One position within a spread and how it should be read. */
export interface SpreadPosition {
  /** Short label shown to the visitor, e.g. "Past". */
  label: string;
  /** The interpretive lens for this slot, used to ground the reading. */
  role: string;
}

/** A spread / draw method: a named, ordered set of positions. */
export interface Spread {
  id: string;
  name: string;
  description: string;
  positions: SpreadPosition[];
}

/** A rune as it was drawn into a specific position of a spread. */
export interface DrawnRune {
  rune: Rune;
  orientation: Orientation;
  /** Index into the spread's `positions` array. */
  positionIndex: number;
}

/** The deterministic, knowledgebase-derived facts for one drawn position. */
export interface GroundingEntry {
  positionLabel: string;
  positionRole: string;
  runeName: string;
  runeGlyph: string;
  orientation: Orientation;
  /** The exact meaning text from the knowledgebase for this orientation. */
  meaning: string;
  keywords: string[];
}

/** The per-position narrative Claude produces for the reading. */
export interface ReadingSection {
  positionLabel: string;
  interpretation: string;
}

/** The full reading returned to the client. */
export interface Reading {
  spreadName: string;
  question: string | null;
  drawn: DrawnRune[];
  /** Knowledgebase facts per position; always present (used by UI + fallback). */
  grounding: GroundingEntry[];
  /** Opening synthesis. Null when the AI layer is unavailable. */
  overview: string | null;
  /** Per-position interpretation. Empty when the AI layer is unavailable. */
  sections: ReadingSection[];
  /** Closing, actionable advice. Null when the AI layer is unavailable. */
  advice: string | null;
  /** False when the reading was assembled from the knowledgebase only. */
  aiAvailable: boolean;
}

/** Request body for POST /api/reading. */
export interface ReadingRequest {
  spreadId: string;
  question?: string | null;
  drawn: DrawnRune[];
}
