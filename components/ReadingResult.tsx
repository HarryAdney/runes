import type { Reading } from "@/types";
import RuneCard from "@/components/RuneCard";

interface ReadingResultProps {
  reading: Reading;
}

/**
 * Renders a completed reading: the row of drawn runes, the AI overview,
 * per-position interpretation (with the knowledgebase meaning), and advice.
 * Degrades gracefully to a knowledgebase-only reading when the AI layer is off.
 */
export default function ReadingResult({ reading }: ReadingResultProps) {
  const sectionByLabel = new Map(
    reading.sections.map((s) => [s.positionLabel, s.interpretation]),
  );

  return (
    <div className="space-y-10">
      {reading.question && (
        <p className="text-center font-display text-lg italic text-muted">
          &ldquo;{reading.question}&rdquo;
        </p>
      )}

      {/* The drawn runes */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
        {reading.drawn.map((d) => (
          <RuneCard
            key={d.positionIndex}
            drawn={d}
            positionLabel={
              reading.grounding[d.positionIndex]?.positionLabel ??
              `Position ${d.positionIndex + 1}`
            }
          />
        ))}
      </div>

      {/* Overview */}
      {reading.overview && (
        <section className="space-y-2">
          <h2 className="font-display text-2xl text-accent">The Reading</h2>
          <p className="leading-relaxed text-foreground/90">
            {reading.overview}
          </p>
        </section>
      )}

      {/* Per-position interpretation */}
      <section className="space-y-6">
        {reading.grounding.map((g) => {
          const interpretation = sectionByLabel.get(g.positionLabel);
          return (
            <article
              key={g.positionLabel}
              className="rounded-xl border border-border bg-background-2/40 p-5"
            >
              <h3 className="font-display text-xl text-foreground">
                <span className="text-accent">{g.positionLabel}</span> —{" "}
                {g.runeName}
                {g.orientation === "reversed" && (
                  <span className="text-muted"> (reversed)</span>
                )}
              </h3>
              <p className="mt-1 text-sm italic text-muted">{g.meaning}</p>
              {interpretation && (
                <p className="mt-3 leading-relaxed text-foreground/90">
                  {interpretation}
                </p>
              )}
            </article>
          );
        })}
      </section>

      {/* Advice */}
      {reading.advice && (
        <section className="space-y-2 rounded-xl border border-accent-soft/40 bg-accent/5 p-5">
          <h2 className="font-display text-2xl text-accent">Guidance</h2>
          <p className="leading-relaxed text-foreground/90">{reading.advice}</p>
        </section>
      )}

      {!reading.aiAvailable && (
        <p className="text-center text-sm text-muted">
          This reading shows the runes&rsquo; traditional meanings. The
          personalised interpretation is unavailable right now.
        </p>
      )}
    </div>
  );
}
