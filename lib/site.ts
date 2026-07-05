const SITE_NAME = "Runecast";

const SITE_DESCRIPTION =
  "Draw the Elder Futhark and receive a reflective rune reading grounded in traditional meanings.";

const SITE_TAGLINE = "Elder Futhark rune readings for reflection and entertainment.";

function ensureProtocol(url: string): string {
  return /^https?:\/\//i.test(url) ? url : `https://${url}`;
}

function trimTrailingSlash(url: string): string {
  return url.endsWith("/") ? url.slice(0, -1) : url;
}

export function getSiteUrl(): string {
  const configuredUrl =
    process.env.NEXT_PUBLIC_SITE_URL?.trim() ||
    process.env.VERCEL_PROJECT_PRODUCTION_URL?.trim() ||
    process.env.VERCEL_URL?.trim();

  if (configuredUrl) {
    return trimTrailingSlash(ensureProtocol(configuredUrl));
  }

  return "http://localhost:3000";
}

export function getSiteOrigin(): URL {
  return new URL(getSiteUrl());
}

export { SITE_DESCRIPTION, SITE_NAME, SITE_TAGLINE };