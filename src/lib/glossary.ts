export type TermKey =
  | "units"
  | "gap"
  | "justify-items"
  | "align-items"
  | "justify-content"
  | "align-content"
  | "grid-lines"
  | "self-align";

export interface GlossaryEntry {
  /** Display name shown as the tooltip heading. */
  term: string;
  /** One-line, jargon-free definition. */
  short: string;
}

export const GLOSSARY: Record<TermKey, GlossaryEntry> = {
  units: {
    term: "Sizing units",
    short:
      "fr = a flexible share of the leftover space · px = a fixed size in pixels · % = a share of the container · auto = just big enough to fit its content.",
  },
  gap: {
    term: "Gap",
    short: "The empty space between grid cells, measured in pixels.",
  },
  "justify-items": {
    term: "justify-items",
    short:
      "Positions every item horizontally inside its cell — left, right, center, or stretch to fill the width.",
  },
  "align-items": {
    term: "align-items",
    short:
      "Positions every item vertically inside its cell — top, bottom, center, or stretch to fill the height.",
  },
  "justify-content": {
    term: "justify-content",
    short:
      "When the whole grid is narrower than the container, this positions it horizontally (and can spread the columns apart).",
  },
  "align-content": {
    term: "align-content",
    short:
      "When the whole grid is shorter than the container, this positions it vertically (and can spread the rows apart).",
  },
  "grid-lines": {
    term: "Grid lines & spans",
    short:
      "Grid lines are numbered starting at 1. An item runs from a start line to an end line — for example 1 to 3 spans the two tracks in between.",
  },
  "self-align": {
    term: "justify-self / align-self",
    short:
      "Overrides the container's alignment for this one item — horizontally (justify-self) and vertically (align-self).",
  },
};
