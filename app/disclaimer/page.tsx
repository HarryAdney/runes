import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Entertainment Disclaimer",
  description:
    "Clear guidance on what Runecast readings are for, what they are not for, and when users should seek qualified professional advice.",
  alternates: {
    canonical: "/disclaimer",
  },
};

export default function DisclaimerPage() {
  return (
    <main className="mx-auto w-full max-w-3xl flex-1 px-6 py-14">
      <div className="space-y-8 rounded-3xl border border-border bg-background-2/30 p-8 sm:p-10">
        <header className="space-y-3">
          <p className="text-xs uppercase tracking-[0.25em] text-accent-soft">
            Disclaimer
          </p>
          <h1 className="font-display text-4xl text-foreground">
            Entertainment Disclaimer
          </h1>
          <p className="max-w-2xl text-sm leading-relaxed text-muted">
            Rune readings on this site are intended as prompts for reflection,
            not as a source of factual prediction or professional instruction.
          </p>
        </header>

        <section className="space-y-3 text-sm leading-relaxed text-foreground/90">
          <h2 className="font-display text-2xl text-accent">What readings mean here</h2>
          <p>
            A Runecast reading combines traditional rune meanings with generated
            reflective language. It is meant to help users think, journal, or
            frame a question from another angle.
          </p>
        </section>

        <section className="space-y-3 text-sm leading-relaxed text-foreground/90">
          <h2 className="font-display text-2xl text-accent">What readings are not</h2>
          <p>
            Readings must not be treated as medical, legal, financial,
            employment, safety, or mental health advice. If a situation has real
            consequences, users should rely on qualified professionals and their
            own judgment.
          </p>
        </section>

        <section className="space-y-3 text-sm leading-relaxed text-foreground/90">
          <h2 className="font-display text-2xl text-accent">Emergency situations</h2>
          <p>
            If someone is in danger or needs urgent support, they should contact
            local emergency services or an appropriate crisis resource rather
            than rely on this site.
          </p>
          <p>
            Return to <Link className="text-accent hover:text-accent-soft" href="/">Runecast</Link>.
          </p>
        </section>
      </div>
    </main>
  );
}