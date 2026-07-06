import { describe, it, expect, beforeEach } from "vitest";
import { render, screen, within, fireEvent, act } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import App from "../../src/App";
import { useGridStore } from "../../src/store/gridStore";

beforeEach(() => {
  act(() => {
    useGridStore.getState().reset();
  });
  useGridStore.temporal.getState().clear();
  document.documentElement.classList.remove("dark");
  localStorage.clear();
});

describe("App — full build flow (UI only)", () => {
  it("builds a complete layout from the UI, kept in sync across panels", async () => {
    render(<App />);

    // Start: default 3x3, no items.
    const codeOutput = screen.getByTestId("code-output");
    const gridContainer = screen.getByTestId("grid-container") as HTMLElement;
    expect(codeOutput.textContent).toContain(
      "grid-template-columns: 1fr 1fr 1fr;",
    );
    expect(gridContainer.style.gridTemplateColumns).toBe("1fr 1fr 1fr");

    // 1. Change the first column to 200px via the sidebar.
    const colId = useGridStore.getState().columns[0].id;
    const colSection = screen.getByTestId("columns-section");
    const firstValue = within(colSection).getByTestId(`track-value-${colId}`);
    fireEvent.change(firstValue, { target: { value: "200" } });
    const firstUnit = within(colSection).getByTestId(`track-unit-${colId}`);
    await userEvent.selectOptions(firstUnit, "px");

    // Canvas AND code panel both reflect the change (single source of truth).
    expect(gridContainer.style.gridTemplateColumns).toBe("200px 1fr 1fr");
    expect(codeOutput.textContent).toContain(
      "grid-template-columns: 200px 1fr 1fr;",
    );

    // 2. Add an item. ("Item 1" appears in both the canvas and the sidebar
    // list — scope the assertion to the canvas.)
    await userEvent.click(screen.getByTestId("add-item-btn"));
    expect(within(gridContainer).getByText("Item 1")).toBeInTheDocument();
    expect(codeOutput.textContent).toContain(".item-1");

    // 3. Position it to span two columns via the item editor.
    const item = useGridStore.getState().items[0];
    await userEvent.click(screen.getByTestId(`sidebar-item-${item.id}`));
    fireEvent.change(screen.getByTestId("item-col-end"), {
      target: { value: "3" },
    });
    expect(codeOutput.textContent).toContain("grid-column: 1 / 3;");

    // 4. Adjust the gap.
    fireEvent.change(screen.getByTestId("row-gap-input"), {
      target: { value: "20" },
    });
    fireEvent.change(screen.getByTestId("column-gap-input"), {
      target: { value: "20" },
    });
    expect(codeOutput.textContent).toContain("gap: 20px;");
    expect(gridContainer.style.gap).toBe("20px");
  });

  it("stays in sync when a preset is loaded from the toolbar", async () => {
    render(<App />);
    await userEvent.click(screen.getByTestId("preset-holy-grail"));

    const codeOutput = screen.getByTestId("code-output");
    const gridContainer = screen.getByTestId("grid-container") as HTMLElement;

    // Holy Grail = 200px 1fr 200px columns, with named areas.
    expect(gridContainer.style.gridTemplateColumns).toBe("200px 1fr 200px");
    expect(codeOutput.textContent).toContain(
      "grid-template-columns: 200px 1fr 200px;",
    );
    expect(codeOutput.textContent).toContain("grid-template-areas:");
  });

  it("undo from the toolbar reverts a sidebar change across panels", async () => {
    render(<App />);
    const gridContainer = screen.getByTestId("grid-container") as HTMLElement;

    await userEvent.click(screen.getByTestId("add-column-btn"));
    expect(gridContainer.style.gridTemplateColumns).toBe("1fr 1fr 1fr 1fr");

    await userEvent.click(screen.getByTestId("undo-btn"));
    expect(gridContainer.style.gridTemplateColumns).toBe("1fr 1fr 1fr");
  });
});
