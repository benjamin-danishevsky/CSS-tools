import { describe, it, expect } from "vitest";
import { generateHTML } from "../../src/lib/htmlGenerator";
import type { GridState, GridItem } from "../../src/types/grid";

function makeState(items: GridItem[] = []): GridState {
  return {
    columns: [
      { id: "c1", value: 1, unit: "fr" },
      { id: "c2", value: 1, unit: "fr" },
    ],
    rows: [{ id: "r1", value: 1, unit: "fr" }],
    gap: { row: 8, column: 8 },
    justifyItems: "stretch",
    alignItems: "stretch",
    justifyContent: "stretch",
    alignContent: "stretch",
    items,
    selectedItemId: null,
    gridTemplateAreas: null,
  };
}

function makeItem(overrides: Partial<GridItem> = {}): GridItem {
  return {
    id: "i1",
    label: "Item 1",
    color: "#6c5ce7",
    gridColumnStart: 1,
    gridColumnEnd: 2,
    gridRowStart: 1,
    gridRowEnd: 2,
    ...overrides,
  };
}

describe("htmlGenerator", () => {
  it("wraps output in a container div", () => {
    const html = generateHTML(makeState());
    expect(html).toContain('<div class="container">');
    expect(html).toContain("</div>");
  });

  it("renders one div per item", () => {
    const html = generateHTML(
      makeState([
        makeItem({ id: "a", label: "Header" }),
        makeItem({ id: "b", label: "Main" }),
      ]),
    );
    expect(html).toContain('<div class="item-1">Header</div>');
    expect(html).toContain('<div class="item-2">Main</div>');
  });

  it("numbers item classes sequentially matching the CSS", () => {
    const html = generateHTML(
      makeState([
        makeItem({ id: "a", label: "A" }),
        makeItem({ id: "b", label: "B" }),
        makeItem({ id: "c", label: "C" }),
      ]),
    );
    expect(html).toContain('class="item-1"');
    expect(html).toContain('class="item-2"');
    expect(html).toContain('class="item-3"');
  });

  it("uses the item label as text content", () => {
    const html = generateHTML(makeState([makeItem({ label: "Sidebar" })]));
    expect(html).toContain(">Sidebar</div>");
  });

  it("indents item divs by two spaces", () => {
    const html = generateHTML(makeState([makeItem({ label: "Item 1" })]));
    expect(html).toContain('\n  <div class="item-1">Item 1</div>');
  });

  it("produces an empty container when there are no items", () => {
    const html = generateHTML(makeState([]));
    expect(html).toContain('<div class="container">');
    expect(html).not.toContain("item-");
  });

  it("escapes HTML special characters in labels", () => {
    const html = generateHTML(
      makeState([makeItem({ label: "<script>alert(1)</script>" })]),
    );
    expect(html).not.toContain("<script>alert(1)</script>");
    expect(html).toContain("&lt;script&gt;");
  });

  it("escapes ampersands in labels", () => {
    const html = generateHTML(makeState([makeItem({ label: "Tom & Jerry" })]));
    expect(html).toContain("Tom &amp; Jerry");
  });
});
