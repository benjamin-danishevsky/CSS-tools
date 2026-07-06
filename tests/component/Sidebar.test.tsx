import { describe, it, expect, beforeEach } from "vitest";
import { render, screen, within, fireEvent } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import Sidebar from "../../src/components/Sidebar/Sidebar";
import { useGridStore } from "../../src/store/gridStore";

function resetStore() {
  useGridStore.getState().reset();
}

describe("Sidebar", () => {
  beforeEach(() => {
    resetStore();
  });

  describe("tracks section", () => {
    it("renders column track list with correct count", () => {
      render(<Sidebar />);
      const section = screen.getByTestId("columns-section");
      const trackInputs = within(section).getAllByTestId(/^track-value-/);
      expect(trackInputs).toHaveLength(3);
    });

    it("renders row track list with correct count", () => {
      render(<Sidebar />);
      const section = screen.getByTestId("rows-section");
      const trackInputs = within(section).getAllByTestId(/^track-value-/);
      expect(trackInputs).toHaveLength(3);
    });

    it("adds a column when add column button is clicked", async () => {
      render(<Sidebar />);
      const btn = screen.getByTestId("add-column-btn");
      await userEvent.click(btn);
      expect(useGridStore.getState().columns).toHaveLength(4);
    });

    it("removes a column when remove button is clicked", async () => {
      render(<Sidebar />);
      const section = screen.getByTestId("columns-section");
      const removeBtns = within(section).getAllByTestId(/^remove-track-/);
      await userEvent.click(removeBtns[0]);
      expect(useGridStore.getState().columns).toHaveLength(2);
    });

    it("adds a row when add row button is clicked", async () => {
      render(<Sidebar />);
      const btn = screen.getByTestId("add-row-btn");
      await userEvent.click(btn);
      expect(useGridStore.getState().rows).toHaveLength(4);
    });

    it("removes a row when remove button is clicked", async () => {
      render(<Sidebar />);
      const section = screen.getByTestId("rows-section");
      const removeBtns = within(section).getAllByTestId(/^remove-track-/);
      await userEvent.click(removeBtns[0]);
      expect(useGridStore.getState().rows).toHaveLength(2);
    });

    it("updates track value when input changes", async () => {
      render(<Sidebar />);
      const section = screen.getByTestId("columns-section");
      const inputs = within(section).getAllByTestId(/^track-value-/);
      const firstInput = inputs[0] as HTMLInputElement;
      await userEvent.clear(firstInput);
      await userEvent.type(firstInput, "2");
      expect(useGridStore.getState().columns[0].value).toBe(2);
    });

    it("updates track unit when select changes", async () => {
      render(<Sidebar />);
      const section = screen.getByTestId("columns-section");
      const selects = within(section).getAllByTestId(/^track-unit-/);
      await userEvent.selectOptions(selects[0], "px");
      expect(useGridStore.getState().columns[0].unit).toBe("px");
    });
  });

  describe("gap section", () => {
    it("renders row gap input with current value", () => {
      render(<Sidebar />);
      const input = screen.getByTestId("row-gap-input") as HTMLInputElement;
      expect(input.value).toBe("8");
    });

    it("renders column gap input with current value", () => {
      render(<Sidebar />);
      const input = screen.getByTestId("column-gap-input") as HTMLInputElement;
      expect(input.value).toBe("8");
    });

    it("updates row gap when input changes", async () => {
      render(<Sidebar />);
      const input = screen.getByTestId("row-gap-input");
      await userEvent.clear(input);
      await userEvent.type(input, "16");
      expect(useGridStore.getState().gap.row).toBe(16);
    });

    it("updates column gap when input changes", async () => {
      render(<Sidebar />);
      const input = screen.getByTestId("column-gap-input");
      await userEvent.clear(input);
      await userEvent.type(input, "24");
      expect(useGridStore.getState().gap.column).toBe(24);
    });
  });

  describe("alignment section", () => {
    it("renders justify-items dropdown with current value", () => {
      render(<Sidebar />);
      const select = screen.getByTestId(
        "align-justifyItems",
      ) as HTMLSelectElement;
      expect(select.value).toBe("stretch");
    });

    it("updates justifyItems when dropdown changes", async () => {
      render(<Sidebar />);
      const select = screen.getByTestId("align-justifyItems");
      await userEvent.selectOptions(select, "center");
      expect(useGridStore.getState().justifyItems).toBe("center");
    });

    it("renders align-items dropdown", () => {
      render(<Sidebar />);
      expect(screen.getByTestId("align-alignItems")).toBeInTheDocument();
    });

    it("renders justify-content dropdown", () => {
      render(<Sidebar />);
      expect(screen.getByTestId("align-justifyContent")).toBeInTheDocument();
    });

    it("renders align-content dropdown", () => {
      render(<Sidebar />);
      expect(screen.getByTestId("align-alignContent")).toBeInTheDocument();
    });

    it("updates alignContent when dropdown changes", async () => {
      render(<Sidebar />);
      const select = screen.getByTestId("align-alignContent");
      await userEvent.selectOptions(select, "space-between");
      expect(useGridStore.getState().alignContent).toBe("space-between");
    });
  });

  describe("items section", () => {
    it("renders add item button", () => {
      render(<Sidebar />);
      expect(screen.getByTestId("add-item-btn")).toBeInTheDocument();
    });

    it("adds an item when add button is clicked", async () => {
      render(<Sidebar />);
      await userEvent.click(screen.getByTestId("add-item-btn"));
      expect(useGridStore.getState().items).toHaveLength(1);
    });

    it("lists items after they are added", async () => {
      useGridStore.getState().addItem();
      useGridStore.getState().addItem();
      render(<Sidebar />);
      const itemEntries = screen.getAllByTestId(/^sidebar-item-/);
      expect(itemEntries).toHaveLength(2);
    });

    it("selects an item when its entry is clicked", async () => {
      useGridStore.getState().addItem();
      const item = useGridStore.getState().items[0];
      render(<Sidebar />);
      await userEvent.click(screen.getByTestId(`sidebar-item-${item.id}`));
      expect(useGridStore.getState().selectedItemId).toBe(item.id);
    });

    it("shows selected item edit controls", async () => {
      useGridStore.getState().addItem();
      const item = useGridStore.getState().items[0];
      useGridStore.getState().selectItem(item.id);
      render(<Sidebar />);
      expect(screen.getByTestId("item-col-start")).toBeInTheDocument();
      expect(screen.getByTestId("item-col-end")).toBeInTheDocument();
      expect(screen.getByTestId("item-row-start")).toBeInTheDocument();
      expect(screen.getByTestId("item-row-end")).toBeInTheDocument();
    });

    it("updates item grid position from edit controls", async () => {
      useGridStore.getState().addItem();
      const item = useGridStore.getState().items[0];
      useGridStore.getState().selectItem(item.id);
      render(<Sidebar />);
      const colEnd = screen.getByTestId("item-col-end") as HTMLInputElement;
      fireEvent.change(colEnd, { target: { value: "3" } });
      expect(useGridStore.getState().items[0].gridColumnEnd).toBe(3);
    });

    it("removes an item when remove button is clicked", async () => {
      useGridStore.getState().addItem();
      const item = useGridStore.getState().items[0];
      render(<Sidebar />);
      const removeBtn = screen.getByTestId(`remove-item-${item.id}`);
      await userEvent.click(removeBtn);
      expect(useGridStore.getState().items).toHaveLength(0);
    });
  });
});
