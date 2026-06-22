import type { DrawnRune, Orientation, Rune, Spread } from "@/types";
import { RUNES } from "@/lib/runes";

/**
 * Fisher–Yates shuffle over a copy of the input array. Pure: does not mutate
 * the source. Accepts an injectable RNG so the draw is deterministic in tests.
 */
function shuffle<T>(items: readonly T[], rng: () => number = Math.random): T[] {
  const out = [...items];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

/**
 * Pick an orientation for a rune. Runes with no reversed form (symmetrical
 * glyphs and the blank rune) are always upright; everything else is a coin flip.
 */
function pickOrientation(rune: Rune, rng: () => number): Orientation {
  if (rune.reversed === null) return "upright";
  return rng() < 0.5 ? "reversed" : "upright";
}

/**
 * Draw the runes for a spread: shuffle the full set, take one per position
 * without replacement, and assign each an orientation.
 *
 * Pure aside from the RNG. Pass a seeded `rng` for deterministic tests.
 */
export function drawForSpread(
  spread: Spread,
  rng: () => number = Math.random,
  pool: readonly Rune[] = RUNES,
): DrawnRune[] {
  const count = spread.positions.length;
  if (count > pool.length) {
    throw new Error(
      `Spread "${spread.id}" needs ${count} runes but the pool has ${pool.length}.`,
    );
  }

  const picks = shuffle(pool, rng).slice(0, count);
  return picks.map((rune, positionIndex) => ({
    rune,
    orientation: pickOrientation(rune, rng),
    positionIndex,
  }));
}
