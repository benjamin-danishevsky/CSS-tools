import { describe, it, expect, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import Canvas from "../../src/components/Canvas/Canvas";
import { useGridStore } from "../../src/store/gridStore";

function resetStore() {
  useGridStore.getState().reset();
}

describe("Canvas", () => {
  beforeEach(() => {
    resetStore();
  });

  it("renders a grid container element", () => {
    const { container } = render(<Canvas />);
    const gridEl = container.querySelector("[data-testid='grid-container']");
    expect(gridEl).toBeInTheDocument();
  });

  it("applies grid-template-columns from store as inline style", () => {
    const { container } = render(<Canvas />);
    const gridEl = container.querySelector(
      "[data-testid='grid-container']",
    ) as HTMLElement;
    expect(gridEl.style.gridTemplateColumns).toBe("1fr 1fr 1fr");
  });

  it("applies grid-template-rows from store as inline style", () => {
    const { container } = render(<Canvas />);
    const gridEl = container.querySelector(
      "[data-testid='grid-container']",
    ) as HTMLElement;
    expect(gridEl.style.gridTemplateRows).toBe("1fr 1fr 1fr");
  });

  it("applies gap from store as inline style", () => {
    const { container } = render(<Canvas />);
    const gridEl = container.querySelector(
      "[data-testid='grid-container']",
    ) as HTMLElement;
    expect(gridEl.style.gap).toBe("8px");
  });

  it("renders grid items when present in store", () => {
    useGridStore.getState().addItem();
    useGridStore.getState().addItem();
    render(<Canvas />);
    const items = screen.getAllByTestId(/^grid-item-/);
    expect(items).toHaveLength(2);
  });

  it("positions grid items via inline grid-column and grid-row", () => {
    useGridStore.getState().addItem();
    const itemId = useGridStore.getState().items[0].id;
    useGridStore.getState().updateItem(itemId, {
      gridColumnStart: 1,
      gridColumnEnd: 3,
      gridRowStart: 2,
      gridRowEnd: 4,
    });
    render(<Canvas />);
    const itemEl = screen.getByTestId(`grid-item-${itemId}`) as HTMLElement;
    expect(itemEl.style.gridColumn).toBe("1 / 3");
    expect(itemEl.style.gridRow).toBe("2 / 4");
  });

  it("shows item label text", () => {
    useGridStore.getState().addItem();
    render(<Canvas />);
    expect(screen.getByText("Item 1")).toBeInTheDocument();
  });

  it("shows item grid position info", () => {
    useGridStore.getState().addItem();
    render(<Canvas />);
    expect(screen.getByText(/col 1\/2/)).toBeInTheDocument();
    expect(screen.getByText(/row 1\/2/)).toBeInTheDocument();
  });

  it("applies item background color", () => {
    useGridStore.getState().addItem();
    const item = useGridStore.getState().items[0];
    render(<Canvas />);
    const itemEl = screen.getByTestId(`grid-item-${item.id}`) as HTMLElement;
    expect(itemEl.style.backgroundColor).toBeTruthy();
  });

  it("renders empty cell placeholders for the grid", () => {
    const { container } = render(<Canvas />);
    const cells = container.querySelectorAll("[data-testid='grid-cell']");
    // 3x3 grid = 9 cells
    expect(cells.length).toBe(9);
  });

  it("selects an item when clicked", async () => {
    useGridStore.getState().addItem();
    const item = useGridStore.getState().items[0];
    render(<Canvas />);
    const itemEl = screen.getByTestId(`grid-item-${item.id}`);
    await userEvent.click(itemEl);
    expect(useGridStore.getState().selectedItemId).toBe(item.id);
  });

  it("reflects updated track definitions", () => {
    const colId = useGridStore.getState().columns[0].id;
    useGridStore.getState().updateTrack("columns", colId, {
      value: 200,
      unit: "px",
    });
    const { container } = render(<Canvas />);
    const gridEl = container.querySelector(
      "[data-testid='grid-container']",
    ) as HTMLElement;
    expect(gridEl.style.gridTemplateColumns).toBe("200px 1fr 1fr");
  });

  it("displays with display:grid style", () => {
    const { container } = render(<Canvas />);
    const gridEl = container.querySelector(
      "[data-testid='grid-container']",
    ) as HTMLElement;
    expect(gridEl.style.display).toBe("grid");
  });
});
