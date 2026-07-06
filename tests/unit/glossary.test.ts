import { describe, it, expect } from "vitest";
import { GLOSSARY, type TermKey } from "../../src/lib/glossary";

const EXPECTED_KEYS: TermKey[] = [
  "units",
  "gap",
  "justify-items",
  "align-items",
  "justify-content",
  "align-content",
  "grid-lines",
  "self-align",
];

describe("glossary", () => {
  it("defines every expected term key", () => {
    EXPECTED_KEYS.forEach((key) => {
      expect(GLOSSARY[key]).toBeDefined();
    });
  });

  it("gives every entry a non-empty term and definition", () => {
    Object.values(GLOSSARY).forEach((entry) => {
      expect(entry.term.trim().length).toBeGreaterThan(0);
      expect(entry.short.trim().length).toBeGreaterThan(0);
    });
  });

  it("explains all four sizing units under the units key", () => {
    const short = GLOSSARY.units.short;
    expect(short).toContain("fr");
    expect(short).toContain("px");
    expect(short).toContain("%");
    expect(short).toContain("auto");
  });

  it("keeps definitions jargon-light (mentions plain concepts)", () => {
    expect(GLOSSARY.gap.short.toLowerCase()).toContain("space");
    expect(GLOSSARY["grid-lines"].short.toLowerCase()).toContain("line");
  });
});
