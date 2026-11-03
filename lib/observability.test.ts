import { afterEach, describe, expect, it, vi } from "vitest";
import {
  clearObservabilityState,
  logAiUsage,
  observeApiRequest,
} from "@/lib/observability";

describe("observeApiRequest", () => {
  afterEach(() => {
    clearObservabilityState();
    vi.restoreAllMocks();
  });

  it("tracks total requests and errors per endpoint", () => {
    vi.spyOn(console, "info").mockImplementation(() => {});

    const a = observeApiRequest({
      route: "/api/reading",
      method: "POST",
      requestId: "r1",
      status: 200,
      durationMs: 50,
    });
    const b = observeApiRequest({
      route: "/api/reading",
      method: "POST",
      requestId: "r2",
      status: 400,
      durationMs: 75,
    });

    expect(a).toEqual({ totalRequests: 1, totalErrors: 0, errorRate: 0 });
    expect(b).toEqual({
      totalRequests: 2,
      totalErrors: 1,
      errorRate: 0.5,
    });
  });

  it("keeps metrics independent per route and method", () => {
    vi.spyOn(console, "info").mockImplementation(() => {});

    observeApiRequest({
      route: "/api/reading",
      method: "POST",
      requestId: "r1",
      status: 200,
      durationMs: 30,
    });

    const metrics = observeApiRequest({
      route: "/api/health",
      method: "GET",
      requestId: "r2",
      status: 200,
      durationMs: 10,
    });

    expect(metrics).toEqual({
      totalRequests: 1,
      totalErrors: 0,
      errorRate: 0,
    });
  });

  it("logs 5xx responses through console.error", () => {
    const infoSpy = vi.spyOn(console, "info").mockImplementation(() => {});
    const errSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    observeApiRequest({
      route: "/api/reading",
      method: "POST",
      requestId: "r3",
      status: 503,
      durationMs: 80,
    });

    expect(infoSpy).not.toHaveBeenCalled();
    expect(errSpy).toHaveBeenCalledTimes(1);
  });
});

describe("logAiUsage", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("logs token usage with an estimated cost for known models", () => {
    const infoSpy = vi.spyOn(console, "info").mockImplementation(() => {});

    logAiUsage({
      model: "claude-haiku-5-5",
      effort: "low",
      attempt: 0,
      inputTokens: 1_000_000,
      outputTokens: 1_000_000,
      requestId: "r1",
    });

    const payload = JSON.parse(infoSpy.mock.calls[0][0] as string);
    expect(payload.event).toBe("ai_usage");
    expect(payload.requestId).toBe("r1");
    expect(payload.estimatedCostUsd).toBe(0.6);
  });

  it("logs a null cost for models without pricing", () => {
    const infoSpy = vi.spyOn(console, "info").mockImplementation(() => {});

    logAiUsage({
      model: "unknown-model",
      effort: "low",
      attempt: 0,
      inputTokens: 100,
      outputTokens: 100,
    });

    const payload = JSON.parse(infoSpy.mock.calls[0][0] as string);
    expect(payload.estimatedCostUsd).toBeNull();
  });
});
