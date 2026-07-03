import * as Sentry from "@sentry/node";

let initialized = false;

function initServerMonitoring(): void {
  if (initialized) return;

  const dsn = process.env.SENTRY_DSN?.trim();
  if (!dsn) return;

  Sentry.init({
    dsn,
    environment: process.env.NODE_ENV,
    tracesSampleRate: 0,
  });

  initialized = true;
}

export function captureServerException(
  error: unknown,
  context: Record<string, unknown>,
): void {
  initServerMonitoring();
  if (!initialized) return;

  Sentry.captureException(error, {
    tags: {
      area: "server",
    },
    extra: context,
  });
}
