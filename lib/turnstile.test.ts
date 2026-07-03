import { afterEach, describe, expect, it, vi } from "vitest";
import { isTurnstileConfigured, verifyTurnstileToken } from "@/lib/turnstile";

describe("turnstile", () => {
  const originalSecret = process.env.TURNSTILE_SECRET_KEY;
  const originalSiteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

  afterEach(() => {
    process.env.TURNSTILE_SECRET_KEY = originalSecret;
    process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY = originalSiteKey;
    vi.unstubAllGlobals();
  });

  it("reports configured only when both env vars are present", () => {
    process.env.TURNSTILE_SECRET_KEY = "secret";
    process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY = "site";
    expect(isTurnstileConfigured()).toBe(true);

    process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY = "";
    expect(isTurnstileConfigured()).toBe(false);
  });

  it("returns false when secret is missing", async () => {
    process.env.TURNSTILE_SECRET_KEY = "";
    const ok = await verifyTurnstileToken("token");
    expect(ok).toBe(false);
  });

  it("returns true when verify endpoint succeeds", async () => {
    process.env.TURNSTILE_SECRET_KEY = "secret";
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ success: true }),
      }),
    );

    const ok = await verifyTurnstileToken("token", "127.0.0.1");
    expect(ok).toBe(true);
  });

  it("returns false when verify endpoint fails", async () => {
    process.env.TURNSTILE_SECRET_KEY = "secret";
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: false,
      }),
    );

    const ok = await verifyTurnstileToken("token");
    expect(ok).toBe(false);
  });
});
