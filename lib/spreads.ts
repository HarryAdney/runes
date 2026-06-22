import type { Spread } from "@/types";

/**
 * Spread (draw method) definitions. Each position carries a `role` describing
 * how that slot should be interpreted — this is fed to the AI layer as grounding.
 *
 * Adding a new spread (single rune, five-rune cross, etc.) is just a new entry
 * here plus a layout in the UI; no other code needs to change.
 */
export const SPREADS: Spread[] = [
  {
    id: "three-rune",
    name: "Three-Rune Spread",
    description:
      "The classic spread. Three runes trace the arc of a situation from where it has come, through where it stands, to where it is heading.",
    positions: [
      {
        label: "Past",
        role: "The roots of the matter — past influences and what has shaped the present situation.",
      },
      {
        label: "Present",
        role: "The heart of the matter — the present circumstances and the forces at play right now.",
      },
      {
        label: "Future",
        role: "The likely direction — where the current path leads if it continues, and what is emerging.",
      },
    ],
  },
];

export const DEFAULT_SPREAD_ID = "three-rune";

/** Look up a spread by its id. */
export function getSpreadById(id: string): Spread | undefined {
  return SPREADS.find((s) => s.id === id);
}
