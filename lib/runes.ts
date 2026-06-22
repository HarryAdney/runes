import type { Rune } from "@/types";

/**
 * The rune knowledgebase: the 24 runes of the Elder Futhark plus the blank
 * "Wyrd" rune, in traditional order across the three aettir.
 *
 * This file is the single authoritative source for what each rune is and means.
 * It is plain data with no code dependencies, so it can be reviewed and edited
 * directly. Meanings are concise, traditional interpretations.
 *
 * Runes whose glyph is symmetrical have no distinct reversed (merkstave) form
 * and carry `reversed: null`; the draw logic always renders them upright. This
 * follows the commonly used non-invertible set: Gebo, Hagalaz, Isa, Jera,
 * Eihwaz, Sowilo, Ingwaz, Dagaz — plus the blank rune.
 */
export const RUNES: Rune[] = [
  // ── Freyr's Aett ─────────────────────────────────────────────
  {
    id: "fehu",
    name: "Fehu",
    glyph: "ᚠ",
    phoneme: "F",
    keywords: ["wealth", "abundance", "new beginnings"],
    upright:
      "Wealth earned and held wisely — material gain, prosperity, and the energy to start something new. Reward flows from effort.",
    reversed:
      "Loss, financial setback, or wealth that slips away. A warning against greed, overreach, or holding too tightly.",
    element: "Freyr's Aett",
  },
  {
    id: "uruz",
    name: "Uruz",
    glyph: "ᚢ",
    phoneme: "U",
    keywords: ["strength", "vitality", "raw power"],
    upright:
      "Untamed strength, health, and the will to push through. A surge of vital energy and the courage to shape circumstances.",
    reversed:
      "Weakness, missed opportunity, or strength misapplied. Energy turned inward as illness, doubt, or domination.",
    element: "Freyr's Aett",
  },
  {
    id: "thurisaz",
    name: "Thurisaz",
    glyph: "ᚦ",
    phoneme: "TH",
    keywords: ["catalyst", "conflict", "protection"],
    upright:
      "A sharp, reactive force — protection, a needed catalyst, or a test that forces growth. Act with deliberation.",
    reversed:
      "Danger ignored, rash action, or defencelessness. Conflict that wounds rather than clears the way.",
    element: "Freyr's Aett",
  },
  {
    id: "ansuz",
    name: "Ansuz",
    glyph: "ᚨ",
    phoneme: "A",
    keywords: ["communication", "wisdom", "insight"],
    upright:
      "Insight, inspired words, and meaningful messages. Wisdom arrives — listen for guidance and speak with clarity.",
    reversed:
      "Miscommunication, deception, or advice that misleads. Words fail or are not heard; question what you are told.",
    element: "Freyr's Aett",
  },
  {
    id: "raidho",
    name: "Raidho",
    glyph: "ᚱ",
    phoneme: "R",
    keywords: ["journey", "movement", "right action"],
    upright:
      "A journey, literal or inner, taken in good order. Progress, rhythm, and doing the right thing at the right time.",
    reversed:
      "Disruption, delay, or a journey gone awry. Plans stall; the path feels forced or out of step.",
    element: "Freyr's Aett",
  },
  {
    id: "kenaz",
    name: "Kenaz",
    glyph: "ᚲ",
    phoneme: "K",
    keywords: ["vision", "creativity", "revelation"],
    upright:
      "The torch in the dark — knowledge, creative fire, and clarity that reveals what was hidden. A breakthrough in understanding.",
    reversed:
      "The light dimmed — confusion, creative block, or a loss of insight just when it is needed.",
    element: "Freyr's Aett",
  },
  {
    id: "gebo",
    name: "Gebo",
    glyph: "ᚷ",
    phoneme: "G",
    keywords: ["gift", "partnership", "exchange"],
    upright:
      "A gift, union, or fair exchange. Generosity and balanced partnership — what is given and received binds people together.",
    reversed: null,
    element: "Freyr's Aett",
  },
  {
    id: "wunjo",
    name: "Wunjo",
    glyph: "ᚹ",
    phoneme: "W / V",
    keywords: ["joy", "harmony", "fellowship"],
    upright:
      "Joy, contentment, and belonging. Goals achieved in harmony with others; a settled, well-earned happiness.",
    reversed:
      "Sorrow, discord, or delayed fulfilment. Things feel out of joint; happiness is just out of reach.",
    element: "Freyr's Aett",
  },

  // ── Heimdall's Aett ──────────────────────────────────────────
  {
    id: "hagalaz",
    name: "Hagalaz",
    glyph: "ᚺ",
    phoneme: "H",
    keywords: ["disruption", "upheaval", "cleansing"],
    upright:
      "The hailstorm — sudden disruption beyond your control that clears the ground for what comes next. Endure, then rebuild.",
    reversed: null,
    element: "Heimdall's Aett",
  },
  {
    id: "nauthiz",
    name: "Nauthiz",
    glyph: "ᚾ",
    phoneme: "N",
    keywords: ["need", "constraint", "resilience"],
    upright:
      "Necessity and constraint — hardship that teaches patience and self-reliance. Recognise the need and work with it.",
    reversed:
      "Need denied or deepened — want, restlessness, and lessons refused. Constraint becomes self-defeating.",
    element: "Heimdall's Aett",
  },
  {
    id: "isa",
    name: "Isa",
    glyph: "ᛁ",
    phoneme: "I",
    keywords: ["stillness", "pause", "patience"],
    upright:
      "Ice — a standstill that asks for patience. Hold; do not force movement. A time to wait, reflect, and conserve energy.",
    reversed: null,
    element: "Heimdall's Aett",
  },
  {
    id: "jera",
    name: "Jera",
    glyph: "ᛃ",
    phoneme: "J / Y",
    keywords: ["harvest", "cycles", "reward"],
    upright:
      "The harvest — reward that arrives in its own season. Patient effort comes to fruition; honour natural cycles.",
    reversed: null,
    element: "Heimdall's Aett",
  },
  {
    id: "eihwaz",
    name: "Eihwaz",
    glyph: "ᛇ",
    phoneme: "EI",
    keywords: ["endurance", "transformation", "the axis"],
    upright:
      "The yew tree — endurance, reliable strength, and the axis between worlds. Steadiness carries you through transformation.",
    reversed: null,
    element: "Heimdall's Aett",
  },
  {
    id: "perthro",
    name: "Perthro",
    glyph: "ᛈ",
    phoneme: "P",
    keywords: ["mystery", "fate", "chance"],
    upright:
      "The dice-cup — fate, hidden things, and chance. Secrets surface and the unknown plays its hand; trust the unfolding.",
    reversed:
      "Stagnation, unwelcome surprises, or secrets that stay buried. Luck withheld; do not gamble on the hidden.",
    element: "Heimdall's Aett",
  },
  {
    id: "algiz",
    name: "Algiz",
    glyph: "ᛉ",
    phoneme: "Z",
    keywords: ["protection", "guidance", "higher self"],
    upright:
      "The protective shield — a connection to higher guidance and a warning instinct that keeps you safe. Stand your ground.",
    reversed:
      "Vulnerability or guidance ignored. Defences are down; you may be exposed to harm or hidden influence.",
    element: "Heimdall's Aett",
  },
  {
    id: "sowilo",
    name: "Sowilo",
    glyph: "ᛋ",
    phoneme: "S",
    keywords: ["sun", "success", "wholeness"],
    upright:
      "The sun — vitality, success, and clarity of purpose. Energy and good fortune light the way; wholeness and victory.",
    reversed: null,
    element: "Heimdall's Aett",
  },

  // ── Tyr's Aett ───────────────────────────────────────────────
  {
    id: "tiwaz",
    name: "Tiwaz",
    glyph: "ᛏ",
    phoneme: "T",
    keywords: ["justice", "courage", "sacrifice"],
    upright:
      "The warrior's rune — justice, honour, and the courage to do what is right, even at a cost. Victory through integrity.",
    reversed:
      "Injustice, waning courage, or sacrifice for the wrong cause. Energy and resolve drain away.",
    element: "Tyr's Aett",
  },
  {
    id: "berkano",
    name: "Berkano",
    glyph: "ᛒ",
    phoneme: "B",
    keywords: ["growth", "renewal", "nurture"],
    upright:
      "The birch — new growth, birth, and nurture. Quiet beginnings, healing, and the care that lets something flourish.",
    reversed:
      "Stunted growth, anxiety, or family strife. Plans fail to take root; something needs tending it is not receiving.",
    element: "Tyr's Aett",
  },
  {
    id: "ehwaz",
    name: "Ehwaz",
    glyph: "ᛖ",
    phoneme: "E",
    keywords: ["partnership", "trust", "progress"],
    upright:
      "The horse — trusted partnership, loyalty, and steady forward movement. Two working as one carry each other onward.",
    reversed:
      "Mistrust, restlessness, or movement without direction. A partnership falters or pulls in opposite ways.",
    element: "Tyr's Aett",
  },
  {
    id: "mannaz",
    name: "Mannaz",
    glyph: "ᛗ",
    phoneme: "M",
    keywords: ["self", "humanity", "community"],
    upright:
      "Humanity — the self in relation to others, intellect, and shared purpose. Support is found in community and self-knowledge.",
    reversed:
      "Isolation, self-deception, or strained relationships. You may be your own obstacle, or cut off from help.",
    element: "Tyr's Aett",
  },
  {
    id: "laguz",
    name: "Laguz",
    glyph: "ᛚ",
    phoneme: "L",
    keywords: ["water", "intuition", "flow"],
    upright:
      "Water — intuition, emotion, and the unconscious. Go with the flow and trust your instincts; what is felt runs deep.",
    reversed:
      "Confusion, emotional overwhelm, or intuition ignored. Currents pull you off course; avoid murky decisions.",
    element: "Tyr's Aett",
  },
  {
    id: "ingwaz",
    name: "Ingwaz",
    glyph: "ᛜ",
    phoneme: "NG",
    keywords: ["fertility", "completion", "potential"],
    upright:
      "The seed — gestation brought to completion, fertility, and stored potential released at the right moment. A chapter closes well.",
    reversed: null,
    element: "Tyr's Aett",
  },
  {
    id: "dagaz",
    name: "Dagaz",
    glyph: "ᛞ",
    phoneme: "D",
    keywords: ["breakthrough", "dawn", "awakening"],
    upright:
      "The dawn — breakthrough, awakening, and a decisive turning point. Darkness gives way to clarity and a fresh beginning.",
    reversed: null,
    element: "Tyr's Aett",
  },
  {
    id: "othala",
    name: "Othala",
    glyph: "ᛟ",
    phoneme: "O",
    keywords: ["heritage", "home", "legacy"],
    upright:
      "Ancestral home — heritage, belonging, and what is truly yours to keep. Security built on legacy and lasting values.",
    reversed:
      "Loss of inheritance, rootlessness, or clinging to the past. What once gave security now confines you.",
    element: "Tyr's Aett",
  },

  // ── The Blank Rune ───────────────────────────────────────────
  {
    id: "wyrd",
    name: "Wyrd (Blank)",
    glyph: "◻",
    phoneme: "",
    keywords: ["the unknowable", "fate", "trust"],
    upright:
      "The blank rune — fate, the unknowable, and that which is not yet yours to see. An invitation to trust and to let go of needing certainty.",
    reversed: null,
    element: "The Blank Rune",
  },
];

/** Look up a rune by its id. */
export function getRuneById(id: string): Rune | undefined {
  return RUNES.find((r) => r.id === id);
}
