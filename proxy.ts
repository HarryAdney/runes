import { NextResponse, type NextRequest } from "next/server";

function buildCspHeader(nonce: string): string {
  // 'strict-dynamic' lets scripts loaded by nonce-bearing scripts (Next.js
  // chunks, next/script for Turnstile, Vercel Analytics) run, and makes modern
  // browsers ignore 'self' and host allowlists. Those stay only as a fallback
  // for older browsers that do not understand 'strict-dynamic'.
  const scriptSrc = [
    `'nonce-${nonce}'`,
    "'strict-dynamic'",
    "'self'",
    "https://challenges.cloudflare.com",
  ];

  if (process.env.NODE_ENV !== "production") {
    // React uses eval in development for enhanced debugging only.
    scriptSrc.push("'unsafe-eval'");
  }

  return [
    "default-src 'self'",
    `script-src ${scriptSrc.join(" ")}`,
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: https:",
    "font-src 'self' data:",
    "connect-src 'self' https:",
    "frame-src 'self' https://challenges.cloudflare.com",
    "frame-ancestors 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "object-src 'none'",
    "upgrade-insecure-requests",
  ].join("; ");
}

export function proxy(request: NextRequest) {
  const nonce = Buffer.from(crypto.randomUUID()).toString("base64");
  const csp = buildCspHeader(nonce);

  // Next.js reads the nonce from the request CSP header during rendering and
  // applies it to its own scripts automatically.
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-nonce", nonce);
  requestHeaders.set("Content-Security-Policy", csp);

  const response = NextResponse.next({ request: { headers: requestHeaders } });

  response.headers.set("Content-Security-Policy", csp);
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set(
    "Permissions-Policy",
    "camera=(), microphone=(), geolocation=(), payment=()",
  );

  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml).*)"],
};
