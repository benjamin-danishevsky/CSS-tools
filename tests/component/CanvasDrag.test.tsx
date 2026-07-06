import { describe, it, expect, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import Canvas from "../../src/components/Canvas/Canvas";
import { useGridStore } from "../../src/store/gridStore";

beforeEach(() => {
  useGridStore.getState().reset();
});

describe("Canvas — track resize", () => {
  it("renders a column resize handle per column", () => {
    const { container } = render(<Canvas />);
    const handles = container.querySelectorAll('[data-testid^="col-resize-"]');
    expect(handles).toHaveLength(3);
  });

  it("renders a row resize handle per row", () => {
    const { container } = render(<Canvas />);
    const handles = container.querySelectorAll('[data-testid^="row-resize-"]');
    expect(handles).toHaveLength(3);
  });

  it("uses a col-resize cursor on column handles", () => {
    const { container } = render(<Canvas />);
    const handle = container.querySelector(
      '[data-testid^="col-resize-"]',
    ) as HTMLElement;
    expect(handle.style.cursor).toBe("col-resize");
  });

  it("uses a row-resize cursor on row handles", () => {
    const { container } = render(<Canvas />);
    const handle = container.querySelector(
      '[data-testid^="row-resize-"]',
    ) as HTMLElement;
    expect(handle.style.cursor).toBe("row-resize");
  });

  it("resizes an fr column by dragging its boundary", () => {
    const colId = useGridStore.getState().columns[0].id;
    const { container } = render(<Canvas />);
    const handle = container.querySelector(
      `[data-testid="col-resize-${colId}"]`,
    ) as HTMLElement;

    fireEvent.pointerDown(handle, { clientX: 100, clientY: 0, pointerId: 1 });
    fireEvent.pointerMove(handle, { clientX: 150, clientY: 0, pointerId: 1 });
    fireEvent.pointerUp(handle, { clientX: 150, clientY: 0, pointerId: 1 });

    // 1fr + 50px / 50 = 2fr
    expect(useGridStore.getState().columns[0].value).toBe(2);
  });

  it("resizes a row by dragging its boundary", () => {
    const rowId = useGridStore.getState().rows[0].id;
    const { container } = render(<Canvas />);
    const handle = container.querySelector(
      `[data-testid="row-resize-${rowId}"]`,
    ) as HTMLElement;

    fireEvent.pointerDown(handle, { clientX: 0, clientY: 100, pointerId: 1 });
    fireEvent.pointerMove(handle, { clientX: 0, clientY: 200, pointerId: 1 });
    fireEvent.pointerUp(handle, { clientX: 0, clientY: 200, pointerId: 1 });

    // 1fr + 100px / 50 = 3fr
    expect(useGridStore.getState().rows[0].value).toBe(3);
  });
});

describe("Canvas — item drag-to-place", () => {
  // Give each mocked cell a 100x100 rect based on its data-row/data-col.
  function mockCellRects(container: HTMLElement) {
    container.querySelectorAll('[data-testid="grid-cell"]').forEach((cell) => {
      const el = cell as HTMLElement;
      const row = Number(el.dataset.row);
      const col = Number(el.dataset.col);
      el.getBoundingClientRect = () =>
        ({
          left: (col - 1) * 100,
          top: (row - 1) * 100,
          right: col * 100,
          bottom: row * 100,
          width: 100,
          height: 100,
          x: (col - 1) * 100,
          y: (row - 1) * 100,
          toJSON: () => {},
        }) as DOMRect;
    });
  }

  it("moves an item to the cell it is dropped on", () => {
    useGridStore.getState().addItem();
    const item = useGridStore.getState().items[0];
    const { container } = render(<Canvas />);
    mockCellRects(container);

    const itemEl = screen.getByTestId(`grid-item-${item.id}`);
    // Drag from cell (1,1) to cell (2,2): drop point (150,150).
    fireEvent.pointerDown(itemEl, { clientX: 50, clientY: 50, pointerId: 1 });
    fireEvent.pointerMove(itemEl, { clientX: 150, clientY: 150, pointerId: 1 });
    fireEvent.pointerUp(itemEl, { clientX: 150, clientY: 150, pointerId: 1 });

    const updated = useGridStore.getState().items[0];
    expect(updated.gridColumnStart).toBe(2);
    expect(updated.gridColumnEnd).toBe(3);
    expect(updated.gridRowStart).toBe(2);
    expect(updated.gridRowEnd).toBe(3);
  });

  it("shows a drag preview while dragging", () => {
    useGridStore.getState().addItem();
    const item = useGridStore.getState().items[0];
    const { container } = render(<Canvas />);
    mockCellRects(container);

    const itemEl = screen.getByTestId(`grid-item-${item.id}`);
    fireEvent.pointerDown(itemEl, { clientX: 50, clientY: 50, pointerId: 1 });
    fireEvent.pointerMove(itemEl, { clientX: 150, clientY: 150, pointerId: 1 });

    expect(screen.getByTestId("drag-preview")).toBeInTheDocument();
  });
});
