import { connection } from "next/server";
import ReadingClient from "@/components/ReadingClient";
import { isAiConfigured } from "@/lib/anthropic";

export default async function ReadingPage() {
  // Render per request so the page always matches the runtime environment,
  // the same one /api/reading uses, rather than whatever was set at build time.
  await connection();

  return <ReadingClient aiEnabled={isAiConfigured()} />;
}
