import type { Metadata } from "next";
import Link from "next/link";
import { connection } from "next/server";
import { Geist, Cormorant_Garamond } from "next/font/google";
import ClientErrorMonitor from "@/components/ClientErrorMonitor";
import { getSiteOrigin, SITE_DESCRIPTION, SITE_NAME } from "@/lib/site";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const cormorant = Cormorant_Garamond({
  variable: "--font-serif",
  weight: ["400", "500", "600"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: getSiteOrigin(),
  title: {
    default: `${SITE_NAME} | Elder Futhark Rune Readings`,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  keywords: [
    "runes",
    "rune reading",
    "elder futhark",
    "norse divination",
    "reflective guidance",
  ],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_GB",
    url: "/",
    siteName: SITE_NAME,
    title: `${SITE_NAME} | Elder Futhark Rune Readings`,
    description: SITE_DESCRIPTION,
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_NAME} | Elder Futhark Rune Readings`,
    description: SITE_DESCRIPTION,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  category: "lifestyle",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // The CSP uses a per-request nonce (see proxy.ts), which Next.js can only
  // apply to dynamically rendered pages. Static HTML would carry no nonce and
  // every script would be blocked.
  await connection();

  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${cormorant.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <ClientErrorMonitor />
        {children}
        <footer className="border-t border-border/70 bg-background-2/35">
          <div className="mx-auto flex w-full max-w-5xl flex-col gap-3 px-6 py-6 text-sm text-muted sm:flex-row sm:items-center sm:justify-between">
            <p>
              Readings are for reflection and entertainment, not a prediction of fixed events.
            </p>
            <nav className="flex flex-wrap gap-x-5 gap-y-2 text-foreground/80">
              <Link className="hover:text-accent" href="/">
                Home
              </Link>
              <Link className="hover:text-accent" href="/privacy">
                Privacy
              </Link>
              <Link className="hover:text-accent" href="/terms">
                Terms
              </Link>
              <Link className="hover:text-accent" href="/disclaimer">
                Disclaimer
              </Link>
            </nav>
          </div>
        </footer>
      </body>
    </html>
  );
}
