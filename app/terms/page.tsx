import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Terms of Use",
  description:
    "Terms governing access to Runecast, acceptable use of the service, and the limits of the entertainment-based readings provided.",
  alternates: {
    canonical: "/terms",
  },
};

export default function TermsPage() {
  return (
    <main className="mx-auto w-full max-w-3xl flex-1 px-6 py-14">
      <div className="space-y-8 rounded-3xl border border-border bg-background-2/30 p-8 sm:p-10">
        <header className="space-y-3">
          <p className="text-xs uppercase tracking-[0.25em] text-accent-soft">
            Terms
          </p>
          <h1 className="font-display text-4xl text-foreground">Terms of Use</h1>
          <p className="max-w-2xl text-sm leading-relaxed text-muted">
            These terms describe the basic conditions for using Runecast before
            the site is made publicly available.
          </p>
        </header>

        <section className="space-y-3 text-sm leading-relaxed text-foreground/90">
          <h2 className="font-display text-2xl text-accent">Entertainment service</h2>
          <p>
            Runecast provides reflective rune readings for entertainment and
            personal reflection only. The service does not provide medical,
            legal, financial, mental health, or other professional advice.
          </p>
        </section>

        <section className="space-y-3 text-sm leading-relaxed text-foreground/90">
          <h2 className="font-display text-2xl text-accent">Acceptable use</h2>
          <p>
            You agree not to abuse the service, interfere with its availability,
            bypass rate limits or abuse protections, attempt unauthorized
            access, or submit unlawful or harmful content through the reading
            form.
          </p>
        </section>

        <section className="space-y-3 text-sm leading-relaxed text-foreground/90">
          <h2 className="font-display text-2xl text-accent">Availability and changes</h2>
          <p>
            The site may change, pause, or stop without notice. Features,
            models, output quality, and availability may vary, especially while
            the product is being prepared for public launch.
          </p>
        </section>

        <section className="space-y-3 text-sm leading-relaxed text-foreground/90">
          <h2 className="font-display text-2xl text-accent">Liability limits</h2>
          <p>
            To the extent permitted by law, the operator is not liable for
            decisions made in reliance on readings, nor for indirect or
            consequential losses arising from use or inability to use the site.
          </p>
          <p>
            Return to <Link className="text-accent hover:text-accent-soft" href="/">Runecast</Link>.
          </p>
        </section>
      </div>
    </main>
  );
}