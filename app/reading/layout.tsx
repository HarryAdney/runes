import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Three-Rune Reading",
  description:
    "Cast a past, present, and future rune spread and receive a grounded reflective reading.",
  alternates: {
    canonical: "/reading",
  },
};

export default function ReadingLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}