import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "Learn what data Runecast collects, how rune reading requests are processed, and how abuse-prevention and error monitoring data are handled.",
  alternates: {
    canonical: "/privacy",
  },
};

export default function PrivacyPage() {
  return (
    <main className="mx-auto w-full max-w-3xl flex-1 px-6 py-14">
      <div className="space-y-8 rounded-3xl border border-border bg-background-2/30 p-8 sm:p-10">
        <header className="space-y-3">
          <p className="text-xs uppercase tracking-[0.25em] text-accent-soft">
            Privacy
          </p>
          <h1 className="font-display text-4xl text-foreground">Privacy Policy</h1>
          <p className="max-w-2xl text-sm leading-relaxed text-muted">
            Runecast is a lightweight entertainment site. We only collect the
            data needed to generate readings, protect the service from abuse,
            and diagnose failures.
          </p>
        </header>

        <section className="space-y-3 text-sm leading-relaxed text-foreground/90">
          <h2 className="font-display text-2xl text-accent">What we process</h2>
          <p>
            When you request a reading, the service receives the question or
            intention you submit, the drawn runes sent by the client, basic
            request metadata such as IP-derived rate-limit state, and challenge
            verification data used to reduce automated abuse.
          </p>
          <p>
            If AI interpretation is enabled, the reading payload is sent
            server-side to Anthropic to generate reflective text. The API key is
            never exposed to the browser.
          </p>
        </section>

        <section className="space-y-3 text-sm leading-relaxed text-foreground/90">
          <h2 className="font-display text-2xl text-accent">Why we process it</h2>
          <p>
            Submitted data is used to deliver the requested reading, keep the
            site reliable, detect abuse, and investigate operational issues.
            Logs and monitoring data should not be used to profile visitors or
            for unrelated marketing purposes.
          </p>
        </section>

        <section className="space-y-3 text-sm leading-relaxed text-foreground/90">
          <h2 className="font-display text-2xl text-accent">Retention and sharing</h2>
          <p>
            Reading content and operational telemetry should be retained only as
            long as needed for service delivery, troubleshooting, and security.
            Third-party processors may include hosting, challenge verification,
            AI inference, and error-monitoring providers.
          </p>
          <p>
            Do not submit sensitive personal, medical, financial, or legal
            information in your question. This site is not designed to process
            sensitive categories of data.
          </p>
        </section>

        <section className="space-y-3 text-sm leading-relaxed text-foreground/90">
          <h2 className="font-display text-2xl text-accent">Contact and updates</h2>
          <p>
            The operator should publish a contact method before launch so users
            can raise privacy questions or deletion requests. Material changes
            to this policy should be reflected on this page.
          </p>
          <p>
            Return to <Link className="text-accent hover:text-accent-soft" href="/">Runecast</Link>.
          </p>
        </section>
      </div>
    </main>
  );
}