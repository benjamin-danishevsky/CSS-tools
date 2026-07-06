import { describe, it, expect, beforeEach } from "vitest";
import { render, act } from "@testing-library/react";
import Canvas from "../../src/components/Canvas/Canvas";
import { useGridStore } from "../../src/store/gridStore";

beforeEach(() => {
  act(() => {
    useGridStore.getState().reset();
  });
});

describe("Canvas — track size labels", () => {
  it("renders a size label for each column", () => {
    const { container } = render(<Canvas />);
    const labels = container.querySelectorAll('[data-testid^="col-label-"]');
    expect(labels).toHaveLength(3);
    labels.forEach((l) => expect(l.textContent).toBe("1fr"));
  });

  it("renders a size label for each row", () => {
    const { container } = render(<Canvas />);
    const labels = container.querySelectorAll('[data-testid^="row-label-"]');
    expect(labels).toHaveLength(3);
    labels.forEach((l) => expect(l.textContent).toBe("1fr"));
  });

  it("updates the column label when its track changes", () => {
    const colId = useGridStore.getState().columns[0].id;
    const { container } = render(<Canvas />);
    act(() => {
      useGridStore.getState().updateTrack("columns", colId, {
        value: 200,
        unit: "px",
      });
    });
    const label = container.querySelector(`[data-testid="col-label-${colId}"]`);
    expect(label?.textContent).toBe("200px");
  });

  it("shows 'auto' for auto tracks", () => {
    const rowId = useGridStore.getState().rows[0].id;
    const { container } = render(<Canvas />);
    act(() => {
      useGridStore.getState().updateTrack("rows", rowId, { unit: "auto" });
    });
    const label = container.querySelector(`[data-testid="row-label-${rowId}"]`);
    expect(label?.textContent).toBe("auto");
  });
});
