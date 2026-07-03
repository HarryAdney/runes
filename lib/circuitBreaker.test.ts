import { describe, expect, it } from "vitest";
import { createCircuitBreaker } from "@/lib/circuitBreaker";

describe("createCircuitBreaker", () => {
  it("allows requests while below the failure threshold", () => {
    const breaker = createCircuitBreaker({
      failureThreshold: 3,
      cooldownMs: 1_000,
    });

    expect(breaker.canRequest(0)).toBe(true);
    breaker.recordFailure(100);
    expect(breaker.canRequest(200)).toBe(true);
    breaker.recordFailure(300);
    expect(breaker.canRequest(400)).toBe(true);
  });

  it("opens after threshold failures and closes after cooldown", () => {
    const breaker = createCircuitBreaker({
      failureThreshold: 2,
      cooldownMs: 5_000,
    });

    breaker.recordFailure(1_000);
    breaker.recordFailure(1_100);

    expect(breaker.canRequest(1_101)).toBe(false);
    expect(breaker.canRequest(6_099)).toBe(false);
    expect(breaker.canRequest(6_100)).toBe(true);
  });

  it("resets on success", () => {
    const breaker = createCircuitBreaker({
      failureThreshold: 2,
      cooldownMs: 5_000,
    });

    breaker.recordFailure(100);
    breaker.recordSuccess(200);
    breaker.recordFailure(300);

    expect(breaker.canRequest(301)).toBe(true);
  });
});
