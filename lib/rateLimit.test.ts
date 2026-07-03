import { describe, expect, it } from "vitest";
import { createFixedWindowRateLimiter } from "@/lib/rateLimit";

describe("createFixedWindowRateLimiter", () => {
  it("allows up to the configured number of requests per window", () => {
    const limiter = createFixedWindowRateLimiter({
      limit: 3,
      windowMs: 60_000,
    });

    const a = limiter.check("ip:1", 1_000);
    const b = limiter.check("ip:1", 1_001);
    const c = limiter.check("ip:1", 1_002);

    expect(a.allowed).toBe(true);
    expect(a.remaining).toBe(2);
    expect(b.allowed).toBe(true);
    expect(b.remaining).toBe(1);
    expect(c.allowed).toBe(true);
    expect(c.remaining).toBe(0);
  });

  it("blocks requests over the limit and returns retry-after", () => {
    const limiter = createFixedWindowRateLimiter({
      limit: 2,
      windowMs: 60_000,
    });

    limiter.check("ip:2", 10_000);
    limiter.check("ip:2", 10_100);
    const blocked = limiter.check("ip:2", 10_200);

    expect(blocked.allowed).toBe(false);
    expect(blocked.remaining).toBe(0);
    expect(blocked.retryAfterSeconds).toBeGreaterThan(0);
  });

  it("resets usage after the time window passes", () => {
    const limiter = createFixedWindowRateLimiter({
      limit: 1,
      windowMs: 1_000,
    });

    const first = limiter.check("ip:3", 5_000);
    const blocked = limiter.check("ip:3", 5_500);
    const afterReset = limiter.check("ip:3", 6_001);

    expect(first.allowed).toBe(true);
    expect(blocked.allowed).toBe(false);
    expect(afterReset.allowed).toBe(true);
    expect(afterReset.remaining).toBe(0);
  });

  it("tracks different keys independently", () => {
    const limiter = createFixedWindowRateLimiter({
      limit: 1,
      windowMs: 60_000,
    });

    const keyAFirst = limiter.check("ip:a", 1_000);
    const keyASecond = limiter.check("ip:a", 1_500);
    const keyBFirst = limiter.check("ip:b", 1_500);

    expect(keyAFirst.allowed).toBe(true);
    expect(keyASecond.allowed).toBe(false);
    expect(keyBFirst.allowed).toBe(true);
  });
});
