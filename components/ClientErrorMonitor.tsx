"use client";

import { useEffect } from "react";
import { captureClientException } from "@/lib/errorMonitoring.client";

export default function ClientErrorMonitor() {
  useEffect(() => {
    const onError = (event: ErrorEvent) => {
      captureClientException(event.error ?? event.message, {
        source: "window.error",
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
      });
    };

    const onUnhandledRejection = (event: PromiseRejectionEvent) => {
      captureClientException(event.reason, {
        source: "window.unhandledrejection",
      });
    };

    window.addEventListener("error", onError);
    window.addEventListener("unhandledrejection", onUnhandledRejection);

    return () => {
      window.removeEventListener("error", onError);
      window.removeEventListener("unhandledrejection", onUnhandledRejection);
    };
  }, []);

  return null;
}
