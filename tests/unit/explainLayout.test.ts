import { describe, it, expect } from "vitest";
import { explainLayout } from "../../src/lib/explainLayout";
import type { GridState, GridItem } from "../../src/types/grid";

function makeState(overrides: Partial<GridState> = {}): GridState {
  return {
    columns: [
      { id: "c1", value: 1, unit: "fr" },
      { id: "c2", value: 1, unit: "fr" },
      { id: "c3", value: 1, unit: "fr" },
    ],
    rows: [
      { id: "r1", value: 1, unit: "fr" },
      { id: "r2", value: 1, unit: "fr" },
      { id: "r3", value: 1, unit: "fr" },
    ],
    gap: { row: 8, column: 8 },
    justifyItems: "stretch",
    alignItems: "stretch",
    justifyContent: "stretch",
    alignContent: "stretch",
    items: [],
    selectedItemId: null,
    gridTemplateAreas: null,
    ...overrides,
  };
}

function item(overrides: Partial<GridItem> = {}): GridItem {
  return {
    id: "i1",
    label: "Box",
    color: "#000",
    gridColumnStart: 1,
    gridColumnEnd: 2,
    gridRowStart: 1,
    gridRowEnd: 2,
    ...overrides,
  };
}

function joined(state: GridState): string {
  return explainLayout(state).join(" ");
}

describe("explainLayout", () => {
  it("returns an array of sentences", () => {
    const result = explainLayout(makeState());
    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBeGreaterThan(0);
  });

  it("summarizes equal columns and rows", () => {
    const text = joined(makeState());
    expect(text).toContain("3 equal columns");
    expect(text).toContain("3 equal rows");
  });

  it("describes mixed column sizes in plain language", () => {
    const text = joined(
      makeState({
        columns: [
          { id: "a", value: 200, unit: "px" },
          { id: "b", value: 1, unit: "fr" },
          { id: "c", value: 1, unit: "fr" },
        ],
      }),
    );
    expect(text).toContain("3 columns");
    expect(text).toContain("200px");
    expect(text.toLowerCase()).toContain("fixed");
    expect(text.toLowerCase()).toContain("leftover space");
  });

  it("describes a uniform gap", () => {
    expect(joined(makeState({ gap: { row: 16, column: 16 } }))).toContain(
      "16px gap between cells",
    );
  });

  it("describes an asymmetric gap", () => {
    const text = joined(makeState({ gap: { row: 8, column: 20 } }));
    expect(text).toContain("between rows");
    expect(text).toContain("between columns");
  });

  it("omits alignment sentences when everything is the default stretch", () => {
    const text = joined(makeState());
    expect(text.toLowerCase()).not.toContain("aligned");
  });

  it("explains non-default item alignment", () => {
    const text = joined(makeState({ justifyItems: "center" }));
    expect(text.toLowerCase()).toContain("centered");
  });

  it("explains container content alignment", () => {
    const text = joined(makeState({ justifyContent: "space-between" }));
    expect(text.toLowerCase()).toContain("horizontally");
  });

  it("notes when there are no items yet", () => {
    expect(joined(makeState()).toLowerCase()).toContain("no items");
  });

  it("describes a spanning item using cell numbers, not line numbers", () => {
    const text = joined(
      makeState({
        items: [
          item({
            label: "Header",
            gridColumnStart: 1,
            gridColumnEnd: 4,
            gridRowStart: 1,
            gridRowEnd: 2,
          }),
        ],
      }),
    );
    // grid-column 1 / 4 covers columns 1–3, grid-row 1 / 2 covers row 1.
    expect(text).toContain("Header");
    expect(text).toContain("columns 1–3");
    expect(text).toContain("row 1");
  });

  it("describes a single-cell item without a range", () => {
    const text = joined(makeState({ items: [item({ label: "Cell" })] }));
    expect(text).toContain("column 1");
    expect(text).toContain("row 1");
    expect(text).not.toContain("columns 1–1");
  });

  it("mentions named areas when present", () => {
    const text = joined(
      makeState({
        gridTemplateAreas: [
          ["header", "header"],
          ["main", "main"],
        ],
      }),
    );
    expect(text.toLowerCase()).toContain("named areas");
    expect(text).toContain("header");
  });
});
