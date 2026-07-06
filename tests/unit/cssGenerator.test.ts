import { describe, it, expect } from "vitest";
import { generateCSS } from "../../src/lib/cssGenerator";
import type { GridState } from "../../src/types/grid";

function makeState(overrides: Partial<GridState> = {}): GridState {
  return {
    columns: [
      { id: "c1", value: 1, unit: "fr" },
      { id: "c2", value: 2, unit: "fr" },
      { id: "c3", value: 1, unit: "fr" },
    ],
    rows: [
      { id: "r1", value: 0, unit: "auto" },
      { id: "r2", value: 1, unit: "fr" },
      { id: "r3", value: 0, unit: "auto" },
    ],
    gap: { row: 16, column: 16 },
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

describe("cssGenerator", () => {
  it("generates basic container CSS", () => {
    const css = generateCSS(makeState());
    expect(css).toContain("display: grid;");
    expect(css).toContain("grid-template-columns: 1fr 2fr 1fr;");
    expect(css).toContain("grid-template-rows: auto 1fr auto;");
    expect(css).toContain("gap: 16px;");
  });

  it("uses separate row/column gap when they differ", () => {
    const css = generateCSS(makeState({ gap: { row: 8, column: 16 } }));
    expect(css).toContain("row-gap: 8px;");
    expect(css).toContain("column-gap: 16px;");
    expect(css).not.toMatch(/^\s+gap:/m);
  });

  it("includes alignment properties when not stretch", () => {
    const css = generateCSS(
      makeState({ justifyItems: "center", alignItems: "start" }),
    );
    expect(css).toContain("justify-items: center;");
    expect(css).toContain("align-items: start;");
  });

  it("omits alignment properties when stretch (default)", () => {
    const css = generateCSS(makeState());
    expect(css).not.toContain("justify-items:");
    expect(css).not.toContain("align-items:");
    expect(css).not.toContain("justify-content:");
    expect(css).not.toContain("align-content:");
  });

  it("generates item rules with grid-column and grid-row", () => {
    const css = generateCSS(
      makeState({
        items: [
          {
            id: "1",
            label: "Header",
            color: "#ff0000",
            gridColumnStart: 1,
            gridColumnEnd: 4,
            gridRowStart: 1,
            gridRowEnd: 2,
          },
        ],
      }),
    );
    expect(css).toContain(".item-1");
    expect(css).toContain("grid-column: 1 / 4;");
    expect(css).toContain("grid-row: 1 / 2;");
  });

  it("includes item self-alignment when set", () => {
    const css = generateCSS(
      makeState({
        items: [
          {
            id: "1",
            label: "Box",
            color: "#ff0000",
            gridColumnStart: 1,
            gridColumnEnd: 2,
            gridRowStart: 1,
            gridRowEnd: 2,
            justifySelf: "center",
            alignSelf: "end",
          },
        ],
      }),
    );
    expect(css).toContain("justify-self: center;");
    expect(css).toContain("align-self: end;");
  });

  it("omits item self-alignment when not set", () => {
    const css = generateCSS(
      makeState({
        items: [
          {
            id: "1",
            label: "Box",
            color: "#ff0000",
            gridColumnStart: 1,
            gridColumnEnd: 2,
            gridRowStart: 1,
            gridRowEnd: 2,
          },
        ],
      }),
    );
    expect(css).not.toContain("justify-self:");
    expect(css).not.toContain("align-self:");
  });

  it("generates multiple item rules numbered sequentially", () => {
    const css = generateCSS(
      makeState({
        items: [
          {
            id: "a",
            label: "A",
            color: "#ff0000",
            gridColumnStart: 1,
            gridColumnEnd: 2,
            gridRowStart: 1,
            gridRowEnd: 2,
          },
          {
            id: "b",
            label: "B",
            color: "#00ff00",
            gridColumnStart: 2,
            gridColumnEnd: 3,
            gridRowStart: 1,
            gridRowEnd: 2,
          },
        ],
      }),
    );
    expect(css).toContain(".item-1");
    expect(css).toContain(".item-2");
  });

  it("includes grid-template-areas when set", () => {
    const css = generateCSS(
      makeState({
        gridTemplateAreas: [
          ["header", "header", "header"],
          ["sidebar", "main", "main"],
          ["footer", "footer", "footer"],
        ],
      }),
    );
    expect(css).toContain("grid-template-areas:");
    expect(css).toContain('"header header header"');
    expect(css).toContain('"sidebar main main"');
    expect(css).toContain('"footer footer footer"');
  });

  it("omits grid-template-areas when null", () => {
    const css = generateCSS(makeState());
    expect(css).not.toContain("grid-template-areas");
  });

  it("wraps output in .container selector", () => {
    const css = generateCSS(makeState());
    expect(css).toMatch(/^\.container\s*\{/);
  });

  it("handles px-only columns", () => {
    const css = generateCSS(
      makeState({
        columns: [
          { id: "1", value: 200, unit: "px" },
          { id: "2", value: 300, unit: "px" },
        ],
      }),
    );
    expect(css).toContain("grid-template-columns: 200px 300px;");
  });
});
