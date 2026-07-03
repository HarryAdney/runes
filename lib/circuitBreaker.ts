export interface CircuitBreaker {
  canRequest(nowMs?: number): boolean;
  recordSuccess(nowMs?: number): void;
  recordFailure(nowMs?: number): void;
}

interface CircuitBreakerConfig {
  failureThreshold: number;
  cooldownMs: number;
}

/**
 * Lightweight in-memory circuit breaker for external service calls.
 */
export function createCircuitBreaker(
  config: CircuitBreakerConfig,
): CircuitBreaker {
  const { failureThreshold, cooldownMs } = config;
  let consecutiveFailures = 0;
  let openedUntilMs = 0;

  return {
    canRequest(nowMs = Date.now()): boolean {
      return nowMs >= openedUntilMs;
    },

    recordSuccess(): void {
      consecutiveFailures = 0;
      openedUntilMs = 0;
    },

    recordFailure(nowMs = Date.now()): void {
      consecutiveFailures += 1;
      if (consecutiveFailures >= failureThreshold) {
        openedUntilMs = nowMs + cooldownMs;
        consecutiveFailures = 0;
      }
    },
  };
}
