import { beforeEach, describe, expect, it, vi } from "vitest";
import type { NextRequest } from "next/server";
import { POST } from "@/app/api/reading/route";
import { generateReadingNarrative, isAiConfigured } from "@/lib/anthropic";

vi.mock("@/lib/anthropic", () => ({
  generateReadingNarrative: vi.fn(),
  isAiConfigured: vi.fn(() => true),
}));

const mockedGenerateReadingNarrative = vi.mocked(generateReadingNarrative);
const mockedIsAiConfigured = vi.mocked(isAiConfigured);

function createRequest(body: unknown): NextRequest {
  const request = new Request("http://localhost:3000/api/reading", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
  return request as unknown as NextRequest;
}

function validBody() {
  return {
    spreadId: "three-rune",
    question: "What do I need to know?",
    drawn: [
      { runeId: "fehu", positionIndex: 0, orientation: "upright" },
      { runeId: "uruz", positionIndex: 1, orientation: "reversed" },
      { runeId: "thurisaz", positionIndex: 2, orientation: "upright" },
    ],
  };
}

describe("POST /api/reading", () => {
  beforeEach(() => {
    mockedGenerateReadingNarrative.mockReset();
    vi.spyOn(console, "info").mockImplementation(() => {});
    vi.spyOn(console, "error").mockImplementation(() => {});
  });

  it("returns AI reading when narrative generation succeeds", async () => {
    mockedGenerateReadingNarrative.mockResolvedValue({
      overview: "A coherent arc appears.",
      sections: [
        { positionLabel: "Past", interpretation: "The past shaped your path." },
        { positionLabel: "Present", interpretation: "The present asks for strength." },
        { positionLabel: "Future", interpretation: "The future opens through action." },
      ],
      advice: "Act with patience and discipline.",
    });

    const res = await POST(createRequest(validBody()));
    const data = (await res.json()) as { aiAvailable: boolean; overview: string | null };

    expect(res.status).toBe(200);
    expect(res.headers.get("x-request-id")).toBeTruthy();
    expect(data.aiAvailable).toBe(true);
    expect(data.overview).toBe("A coherent arc appears.");
  });

  it("returns fallback reading when AI narrative is unavailable", async () => {
    mockedGenerateReadingNarrative.mockResolvedValue(null);

    const res = await POST(createRequest(validBody()));
    const data = (await res.json()) as {
      aiAvailable: boolean;
      overview: string | null;
      advice: string | null;
      sections: unknown[];
      grounding: unknown[];
    };

    expect(res.status).toBe(200);
    expect(data.aiAvailable).toBe(false);
    expect(data.overview).toBeNull();
    expect(data.advice).toBeNull();
    expect(data.sections).toHaveLength(0);
    expect(data.grounding).toHaveLength(3);
  });

  it("flags a failed AI call as enabled so the UI can show a notice", async () => {
    mockedIsAiConfigured.mockReturnValue(true);
    mockedGenerateReadingNarrative.mockResolvedValue(null);

    const res = await POST(createRequest(validBody()));
    const data = (await res.json()) as { aiAvailable: boolean; aiEnabled: boolean };

    expect(data.aiAvailable).toBe(false);
    expect(data.aiEnabled).toBe(true);
  });

  it("flags AI as not enabled when no key is configured", async () => {
    mockedIsAiConfigured.mockReturnValue(false);
    mockedGenerateReadingNarrative.mockResolvedValue(null);

    const res = await POST(createRequest(validBody()));
    const data = (await res.json()) as { aiAvailable: boolean; aiEnabled: boolean };

    expect(data.aiAvailable).toBe(false);
    expect(data.aiEnabled).toBe(false);
  });

  it("returns 400 for invalid JSON payload", async () => {
    const malformed = new Request("http://localhost:3000/api/reading", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: "{",
    }) as unknown as NextRequest;

    const res = await POST(malformed);
    const data = (await res.json()) as { error: string; requestId: string };

    expect(res.status).toBe(400);
    expect(data.error).toBe("Invalid JSON body.");
    expect(data.requestId).toBeTruthy();
  });
});
