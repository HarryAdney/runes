import Link from "next/link";
import { SPREADS } from "@/lib/spreads";

export default function Home() {
  const runeGlyphs = "ᚠ ᚢ ᚦ ᚨ ᚱ ᚲ ᚷ ᚹ ᚺ ᚾ ᛁ ᛃ ᛇ ᛈ ᛉ ᛋ ᛏ ᛒ ᛖ ᛗ ᛚ ᛜ ᛞ ᛟ";

  return (
    <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col items-center justify-center gap-10 px-6 py-20 text-center">
      <p
        className="font-display text-2xl tracking-[0.3em] text-accent/70"
        aria-hidden="true"
      >
        {runeGlyphs}
      </p>

      <div className="space-y-5">
        <h1 className="font-display text-5xl text-foreground sm:text-6xl">
          Runecast
        </h1>
        <p className="mx-auto max-w-xl text-lg leading-relaxed text-foreground/80">
          The Elder Futhark is the oldest runic alphabet — twenty-four marks the
          Norse and Germanic peoples used not only to write, but to seek counsel.
          Cast the runes, and read in them a reflection of your own question.
        </p>
      </div>

      <Link
        href="/reading"
        className="rounded-full bg-accent px-8 py-3 font-medium text-background transition-colors hover:bg-accent-soft"
      >
        Begin a reading
      </Link>

      <section className="mt-8 max-w-xl space-y-2 text-sm text-muted">
        <h2 className="font-display text-base uppercase tracking-widest text-accent-soft">
          {SPREADS[0].name}
        </h2>
        <p>{SPREADS[0].description}</p>
      </section>

      <p className="mt-4 max-w-md text-xs leading-relaxed text-muted/70">
        Rune readings are offered here for reflection and entertainment. Treat
        what you find as a mirror for your own thinking, not a prediction of
        fixed events.
      </p>
    </main>
  );
}
