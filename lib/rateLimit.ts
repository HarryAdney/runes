export interface RateLimitResult {
  allowed: boolean;
  limit: number;
  remaining: number;
  resetAt: number;
  retryAfterSeconds: number;
}

interface Bucket {
  count: number;
  windowStart: number;
  lastSeen: number;
}

interface FixedWindowRateLimiterConfig {
  limit: number;
  windowMs: number;
  idleTtlMs?: number;
}

export interface RateLimiter {
  check(key: string, nowMs?: number): RateLimitResult;
}

/**
 * In-memory fixed-window limiter.
 *
 * Suitable as first-line abuse mitigation in a single runtime instance.
 * For multi-instance/serverless scale, move this state to shared storage.
 */
export function createFixedWindowRateLimiter(
  config: FixedWindowRateLimiterConfig,
): RateLimiter {
  const { limit, windowMs, idleTtlMs = windowMs * 5 } = config;
  const buckets = new Map<string, Bucket>();
  let lastCleanupMs = 0;

  function cleanup(nowMs: number) {
    if (nowMs - lastCleanupMs < windowMs) return;
    lastCleanupMs = nowMs;

    for (const [key, bucket] of buckets) {
      if (nowMs - bucket.lastSeen >= idleTtlMs) {
        buckets.delete(key);
      }
    }
  }

  function check(key: string, nowMs = Date.now()): RateLimitResult {
    cleanup(nowMs);

    let bucket = buckets.get(key);
    if (!bucket || nowMs - bucket.windowStart >= windowMs) {
      bucket = { count: 0, windowStart: nowMs, lastSeen: nowMs };
      buckets.set(key, bucket);
    }

    bucket.lastSeen = nowMs;
    const resetAt = bucket.windowStart + windowMs;

    if (bucket.count >= limit) {
      const retryAfterSeconds = Math.max(1, Math.ceil((resetAt - nowMs) / 1000));
      return {
        allowed: false,
        limit,
        remaining: 0,
        resetAt,
        retryAfterSeconds,
      };
    }

    bucket.count += 1;
    return {
      allowed: true,
      limit,
      remaining: Math.max(0, limit - bucket.count),
      resetAt,
      retryAfterSeconds: 0,
    };
  }

  return { check };
}

export const readingRateLimiter = createFixedWindowRateLimiter({
  limit: 10,
  windowMs: 60_000,
});
