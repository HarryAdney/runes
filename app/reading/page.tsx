"use client";

import { useState } from "react";
import Link from "next/link";
import type { DrawnRune, Reading } from "@/types";
import { drawForSpread } from "@/lib/draw";
import { getSpreadById, DEFAULT_SPREAD_ID } from "@/lib/spreads";
import ReadingResult from "@/components/ReadingResult";

const spread = getSpreadById(DEFAULT_SPREAD_ID)!;

type Status = "idle" | "loading" | "done" | "error";

export default function ReadingPage() {
  const [question, setQuestion] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [reading, setReading] = useState<Reading | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function cast() {
    setStatus("loading");
    setError(null);
    setReading(null);

    // The draw happens here, in the browser, for immediacy.
    const drawn: DrawnRune[] = drawForSpread(spread);
    const trimmed = question.trim();

    try {
      const res = await fetch("/api/reading", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          spreadId: spread.id,
          question: trimmed.length > 0 ? trimmed : null,
          drawn,
        }),
      });

      if (!res.ok) {
        throw new Error(`Request failed (${res.status})`);
      }

      const data = (await res.json()) as Reading;
      setReading(data);
      setStatus("done");
    } catch (err) {
      console.error(err);
      setError("The runes are quiet right now. Please try casting again.");
      setStatus("error");
    }
  }

  return (
    <main className="mx-auto w-full max-w-2xl flex-1 px-6 py-14">
      <header className="mb-10 text-center">
        <Link
          href="/"
          className="text-xs uppercase tracking-[0.25em] text-accent-soft hover:text-accent"
        >
          ← Runecast
        </Link>
        <h1 className="mt-4 font-display text-4xl text-foreground">
          {spread.name}
        </h1>
        <p className="mx-auto mt-2 max-w-md text-sm text-muted">
          {spread.description}
        </p>
      </header>

      {status !== "done" && (
        <div className="space-y-5">
          <label className="block space-y-2">
            <span className="font-display text-lg text-foreground">
              Your question or intention{" "}
              <span className="text-sm text-muted">(optional)</span>
            </span>
            <textarea
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              maxLength={1000}
              rows={3}
              placeholder="What is on your mind? Leave blank for a general reading."
              className="w-full resize-none rounded-xl border border-border bg-background-2/60 p-4 text-foreground placeholder:text-muted/60 focus:border-accent-soft focus:outline-none"
            />
          </label>

          <button
            onClick={cast}
            disabled={status === "loading"}
            className="w-full rounded-full bg-accent px-8 py-3 font-medium text-background transition-colors hover:bg-accent-soft disabled:cursor-not-allowed disabled:opacity-60"
          >
            {status === "loading"
              ? "Casting the runes…"
              : "Draw three runes"}
          </button>

          {error && (
            <p className="text-center text-sm text-accent">{error}</p>
          )}
        </div>
      )}

      {status === "done" && reading && (
        <div className="space-y-10">
          <ReadingResult reading={reading} />
          <div className="flex justify-center">
            <button
              onClick={() => {
                setStatus("idle");
                setReading(null);
              }}
              className="rounded-full border border-accent-soft px-8 py-3 font-medium text-accent transition-colors hover:bg-accent/10"
            >
              Draw again
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
