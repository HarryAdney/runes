import { describe, expect, it } from "vitest";
import { parseReadingRequest } from "@/lib/readingRequestSchema";

describe("parseReadingRequest", () => {
  it("accepts and normalizes a valid payload", () => {
    const parsed = parseReadingRequest({
      spreadId: "three-rune",
      question: "What should I focus on?",
      challengeToken: "token",
      drawn: [
        {
          runeId: "fehu",
          positionIndex: 0,
          orientation: "upright",
        },
      ],
    });

    expect(parsed.success).toBe(true);
    if (!parsed.success) return;

    expect(parsed.data.drawn[0]?.runeId).toBe("fehu");
    expect(parsed.data.challengeToken).toBe("token");
  });

  it("accepts rune.id and normalizes it to runeId", () => {
    const parsed = parseReadingRequest({
      spreadId: "three-rune",
      drawn: [
        {
          rune: { id: "uruz" },
          positionIndex: 1,
          orientation: "reversed",
        },
      ],
    });

    expect(parsed.success).toBe(true);
    if (!parsed.success) return;
    expect(parsed.data.drawn[0]?.runeId).toBe("uruz");
  });

  it("rejects missing spread id", () => {
    const parsed = parseReadingRequest({
      drawn: [{ runeId: "fehu", positionIndex: 0, orientation: "upright" }],
    });
    expect(parsed.success).toBe(false);
  });

  it("rejects drawn entries without rune references", () => {
    const parsed = parseReadingRequest({
      spreadId: "three-rune",
      drawn: [{ positionIndex: 0, orientation: "upright" }],
    });
    expect(parsed.success).toBe(false);
  });

  it("rejects out-of-range position indexes", () => {
    const parsed = parseReadingRequest({
      spreadId: "three-rune",
      drawn: [{ runeId: "fehu", positionIndex: 99, orientation: "upright" }],
    });
    expect(parsed.success).toBe(false);
  });
});
