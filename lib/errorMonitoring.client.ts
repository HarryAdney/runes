"use client";

import * as Sentry from "@sentry/browser";

let initialized = false;

function initClientMonitoring(): void {
  if (initialized) return;

  const dsn = process.env.NEXT_PUBLIC_SENTRY_DSN?.trim();
  if (!dsn) return;

  Sentry.init({
    dsn,
    environment: process.env.NODE_ENV,
    tracesSampleRate: 0,
  });

  initialized = true;
}

export function captureClientException(
  error: unknown,
  context: Record<string, unknown>,
): void {
  initClientMonitoring();
  if (!initialized) return;

  Sentry.captureException(error, {
    tags: {
      area: "client",
    },
    extra: context,
  });
}
