import type { DrawnRune } from "@/types";

interface RuneCardProps {
  drawn: DrawnRune;
  positionLabel: string;
}

/** A single drawn rune: position, large glyph, name, and orientation. */
export default function RuneCard({ drawn, positionLabel }: RuneCardProps) {
  const isReversed = drawn.orientation === "reversed";

  return (
    <figure className="flex flex-col items-center gap-3 rounded-2xl border border-border bg-background-2/60 px-6 py-7 text-center shadow-lg shadow-black/30">
      <span className="text-xs uppercase tracking-[0.25em] text-accent-soft">
        {positionLabel}
      </span>
      <span
        className="font-display text-7xl leading-none text-accent transition-transform"
        style={isReversed ? { transform: "rotate(180deg)" } : undefined}
        aria-hidden="true"
      >
        {drawn.rune.glyph}
      </span>
      <figcaption className="space-y-0.5">
        <span className="block font-display text-xl text-foreground">
          {drawn.rune.name}
        </span>
        <span className="block text-xs uppercase tracking-widest text-muted">
          {isReversed ? "Reversed" : "Upright"}
        </span>
      </figcaption>
    </figure>
  );
}
