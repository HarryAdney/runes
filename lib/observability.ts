interface EndpointMetrics {
  totalRequests: number;
  totalErrors: number;
  errorRate: number;
}

interface EndpointCounter {
  totalRequests: number;
  totalErrors: number;
}

interface ApiObservationInput {
  route: string;
  method: string;
  requestId: string;
  status: number;
  durationMs: number;
  context?: Record<string, unknown>;
}

const endpointCounters = new Map<string, EndpointCounter>();

function getEndpointKey(route: string, method: string): string {
  return `${method.toUpperCase()} ${route}`;
}

function isErrorStatus(status: number): boolean {
  return status >= 400;
}

function round(value: number): number {
  return Math.round(value * 1000) / 1000;
}

export function observeApiRequest(input: ApiObservationInput): EndpointMetrics {
  const endpointKey = getEndpointKey(input.route, input.method);
  const existing = endpointCounters.get(endpointKey) ?? {
    totalRequests: 0,
    totalErrors: 0,
  };

  existing.totalRequests += 1;
  if (isErrorStatus(input.status)) {
    existing.totalErrors += 1;
  }
  endpointCounters.set(endpointKey, existing);

  const errorRate =
    existing.totalRequests > 0
      ? existing.totalErrors / existing.totalRequests
      : 0;

  const metrics: EndpointMetrics = {
    totalRequests: existing.totalRequests,
    totalErrors: existing.totalErrors,
    errorRate: round(errorRate),
  };

  const payload = {
    ts: new Date().toISOString(),
    level: input.status >= 500 ? "error" : "info",
    event: "api_request",
    route: input.route,
    method: input.method,
    status: input.status,
    durationMs: input.durationMs,
    requestId: input.requestId,
    metrics,
    context: input.context ?? {},
  };

  if (input.status >= 500) {
    console.error(JSON.stringify(payload));
  } else {
    console.info(JSON.stringify(payload));
  }

  return metrics;
}

export function logServerError(event: string, data: Record<string, unknown>): void {
  console.error(
    JSON.stringify({
      ts: new Date().toISOString(),
      level: "error",
      event,
      ...data,
    }),
  );
}

// Exported for deterministic unit tests.
export function clearObservabilityState(): void {
  endpointCounters.clear();
}
