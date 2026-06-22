import { describe, it, expect } from "vitest";
import { drawForSpread } from "@/lib/draw";
import { RUNES } from "@/lib/runes";
import { getSpreadById } from "@/lib/spreads";
import type { Spread } from "@/types";

const threeRune = getSpreadById("three-rune") as Spread;

/** Deterministic RNG (mulberry32) so draws are reproducible in tests. */
function seeded(seed: number): () => number {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

describe("drawForSpread", () => {
  it("draws one rune per spread position", () => {
    const drawn = drawForSpread(threeRune, seeded(1));
    expect(drawn).toHaveLength(threeRune.positions.length);
  });

  it("assigns each drawn rune a distinct position index in order", () => {
    const drawn = drawForSpread(threeRune, seeded(2));
    expect(drawn.map((d) => d.positionIndex)).toEqual([0, 1, 2]);
  });

  it("never draws the same rune twice", () => {
    const drawn = drawForSpread(threeRune, seeded(3));
    const ids = drawn.map((d) => d.rune.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("only produces valid orientations", () => {
    const drawn = drawForSpread(threeRune, seeded(4));
    for (const d of drawn) {
      expect(["upright", "reversed"]).toContain(d.orientation);
    }
  });

  it("never marks a non-invertible rune as reversed across many draws", () => {
    for (let seed = 0; seed < 200; seed++) {
      const drawn = drawForSpread(threeRune, seeded(seed));
      for (const d of drawn) {
        if (d.rune.reversed === null) {
          expect(d.orientation).toBe("upright");
        }
      }
    }
  });

  it("is deterministic for a given seed", () => {
    const a = drawForSpread(threeRune, seeded(42));
    const b = drawForSpread(threeRune, seeded(42));
    expect(a.map((d) => `${d.rune.id}:${d.orientation}`)).toEqual(
      b.map((d) => `${d.rune.id}:${d.orientation}`),
    );
  });

  it("can eventually produce a reversed rune (orientation is not stuck)", () => {
    let sawReversed = false;
    for (let seed = 0; seed < 100 && !sawReversed; seed++) {
      const drawn = drawForSpread(threeRune, seeded(seed));
      sawReversed = drawn.some((d) => d.orientation === "reversed");
    }
    expect(sawReversed).toBe(true);
  });

  it("throws if the spread needs more runes than the pool holds", () => {
    const tooBig: Spread = {
      ...threeRune,
      positions: RUNES.map((_, i) => ({ label: `p${i}`, role: "" })).concat({
        label: "overflow",
        role: "",
      }),
    };
    expect(() => drawForSpread(tooBig, seeded(1))).toThrow();
  });
});
