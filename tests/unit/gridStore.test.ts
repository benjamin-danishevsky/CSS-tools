import { describe, it, expect, beforeEach } from "vitest";
import { useGridStore } from "../../src/store/gridStore";

function getState() {
  return useGridStore.getState();
}

function act(fn: () => void) {
  fn();
}

describe("gridStore", () => {
  beforeEach(() => {
    act(() => getState().reset());
  });

  describe("initial state", () => {
    it("starts with 3 columns of 1fr", () => {
      const { columns } = getState();
      expect(columns).toHaveLength(3);
      columns.forEach((col) => {
        expect(col.value).toBe(1);
        expect(col.unit).toBe("fr");
      });
    });

    it("starts with 3 rows of 1fr", () => {
      const { rows } = getState();
      expect(rows).toHaveLength(3);
      rows.forEach((row) => {
        expect(row.value).toBe(1);
        expect(row.unit).toBe("fr");
      });
    });

    it("starts with 8px gap", () => {
      const { gap } = getState();
      expect(gap.row).toBe(8);
      expect(gap.column).toBe(8);
    });

    it("starts with stretch alignment", () => {
      const state = getState();
      expect(state.justifyItems).toBe("stretch");
      expect(state.alignItems).toBe("stretch");
      expect(state.justifyContent).toBe("stretch");
      expect(state.alignContent).toBe("stretch");
    });

    it("starts with no items", () => {
      expect(getState().items).toHaveLength(0);
    });

    it("starts with no selected item", () => {
      expect(getState().selectedItemId).toBeNull();
    });

    it("starts with no template areas", () => {
      expect(getState().gridTemplateAreas).toBeNull();
    });
  });

  describe("column actions", () => {
    it("addColumn adds a 1fr column by default", () => {
      act(() => getState().addColumn());
      expect(getState().columns).toHaveLength(4);
      const last = getState().columns[3];
      expect(last.value).toBe(1);
      expect(last.unit).toBe("fr");
    });

    it("addColumn accepts partial track definition", () => {
      act(() => getState().addColumn({ value: 200, unit: "px" }));
      const last = getState().columns[3];
      expect(last.value).toBe(200);
      expect(last.unit).toBe("px");
    });

    it("removeColumn removes by id", () => {
      const id = getState().columns[1].id;
      act(() => getState().removeColumn(id));
      expect(getState().columns).toHaveLength(2);
      expect(getState().columns.find((c) => c.id === id)).toBeUndefined();
    });
  });

  describe("row actions", () => {
    it("addRow adds a 1fr row by default", () => {
      act(() => getState().addRow());
      expect(getState().rows).toHaveLength(4);
      const last = getState().rows[3];
      expect(last.value).toBe(1);
      expect(last.unit).toBe("fr");
    });

    it("addRow accepts partial track definition", () => {
      act(() => getState().addRow({ value: 100, unit: "px" }));
      const last = getState().rows[3];
      expect(last.value).toBe(100);
      expect(last.unit).toBe("px");
    });

    it("removeRow removes by id", () => {
      const id = getState().rows[0].id;
      act(() => getState().removeRow(id));
      expect(getState().rows).toHaveLength(2);
      expect(getState().rows.find((r) => r.id === id)).toBeUndefined();
    });
  });

  describe("updateTrack", () => {
    it("updates a column track value and unit", () => {
      const id = getState().columns[0].id;
      act(() =>
        getState().updateTrack("columns", id, { value: 200, unit: "px" }),
      );
      const updated = getState().columns.find((c) => c.id === id)!;
      expect(updated.value).toBe(200);
      expect(updated.unit).toBe("px");
    });

    it("updates a row track value only", () => {
      const id = getState().rows[0].id;
      act(() => getState().updateTrack("rows", id, { value: 2 }));
      const updated = getState().rows.find((r) => r.id === id)!;
      expect(updated.value).toBe(2);
      expect(updated.unit).toBe("fr");
    });
  });

  describe("gap", () => {
    it("setGap updates row gap only", () => {
      act(() => getState().setGap({ row: 16 }));
      expect(getState().gap.row).toBe(16);
      expect(getState().gap.column).toBe(8);
    });

    it("setGap updates column gap only", () => {
      act(() => getState().setGap({ column: 24 }));
      expect(getState().gap.row).toBe(8);
      expect(getState().gap.column).toBe(24);
    });

    it("setGap updates both", () => {
      act(() => getState().setGap({ row: 12, column: 12 }));
      expect(getState().gap).toEqual({ row: 12, column: 12 });
    });
  });

  describe("item actions", () => {
    it("addItem creates a new item spanning one cell", () => {
      act(() => getState().addItem());
      const items = getState().items;
      expect(items).toHaveLength(1);
      expect(items[0].gridColumnStart).toBe(1);
      expect(items[0].gridColumnEnd).toBe(2);
      expect(items[0].gridRowStart).toBe(1);
      expect(items[0].gridRowEnd).toBe(2);
      expect(items[0].label).toBeTruthy();
    });

    it("addItem assigns unique ids and labels", () => {
      act(() => getState().addItem());
      act(() => getState().addItem());
      const items = getState().items;
      expect(items[0].id).not.toBe(items[1].id);
      expect(items[0].label).not.toBe(items[1].label);
    });

    it("addItem assigns a color", () => {
      act(() => getState().addItem());
      expect(getState().items[0].color).toBeTruthy();
    });

    it("updateItem updates specific properties", () => {
      act(() => getState().addItem());
      const id = getState().items[0].id;
      act(() =>
        getState().updateItem(id, { gridColumnEnd: 3, label: "Header" }),
      );
      const item = getState().items.find((i) => i.id === id)!;
      expect(item.gridColumnEnd).toBe(3);
      expect(item.label).toBe("Header");
      expect(item.gridColumnStart).toBe(1);
    });

    it("removeItem removes by id", () => {
      act(() => getState().addItem());
      act(() => getState().addItem());
      const id = getState().items[0].id;
      act(() => getState().removeItem(id));
      expect(getState().items).toHaveLength(1);
      expect(getState().items.find((i) => i.id === id)).toBeUndefined();
    });

    it("removeItem clears selectedItemId if removed item was selected", () => {
      act(() => getState().addItem());
      const id = getState().items[0].id;
      act(() => getState().selectItem(id));
      expect(getState().selectedItemId).toBe(id);
      act(() => getState().removeItem(id));
      expect(getState().selectedItemId).toBeNull();
    });
  });

  describe("selectItem", () => {
    it("selects an item by id", () => {
      act(() => getState().addItem());
      const id = getState().items[0].id;
      act(() => getState().selectItem(id));
      expect(getState().selectedItemId).toBe(id);
    });

    it("deselects when passed null", () => {
      act(() => getState().addItem());
      act(() => getState().selectItem(getState().items[0].id));
      act(() => getState().selectItem(null));
      expect(getState().selectedItemId).toBeNull();
    });
  });

  describe("setAlignment", () => {
    it("sets justifyItems", () => {
      act(() => getState().setAlignment("justifyItems", "center"));
      expect(getState().justifyItems).toBe("center");
    });

    it("sets alignContent", () => {
      act(() => getState().setAlignment("alignContent", "space-between"));
      expect(getState().alignContent).toBe("space-between");
    });
  });

  describe("gridTemplateAreas", () => {
    it("setGridTemplateAreas sets areas matrix", () => {
      const areas = [
        ["header", "header"],
        ["sidebar", "main"],
      ];
      act(() => getState().setGridTemplateAreas(areas));
      expect(getState().gridTemplateAreas).toEqual(areas);
    });

    it("setGridTemplateAreas clears with null", () => {
      act(() => getState().setGridTemplateAreas([["a", "b"]]));
      act(() => getState().setGridTemplateAreas(null));
      expect(getState().gridTemplateAreas).toBeNull();
    });

    it("updateAreaName updates a specific cell", () => {
      const areas = [
        ["header", "header"],
        ["sidebar", "main"],
      ];
      act(() => getState().setGridTemplateAreas(areas));
      act(() => getState().updateAreaName(0, 1, "nav"));
      expect(getState().gridTemplateAreas![0][1]).toBe("nav");
      expect(getState().gridTemplateAreas![0][0]).toBe("header");
    });
  });

  describe("reset", () => {
    it("resets to initial state", () => {
      act(() => getState().addColumn());
      act(() => getState().addItem());
      act(() => getState().setGap({ row: 99 }));
      act(() => getState().reset());

      expect(getState().columns).toHaveLength(3);
      expect(getState().items).toHaveLength(0);
      expect(getState().gap.row).toBe(8);
    });
  });

  describe("loadPreset", () => {
    it("holy-grail preset loads a valid grid", () => {
      act(() => getState().loadPreset("holy-grail"));
      const state = getState();
      expect(state.columns.length).toBeGreaterThan(0);
      expect(state.rows.length).toBeGreaterThan(0);
      expect(state.items.length).toBeGreaterThan(0);
    });

    it("dashboard preset loads a valid grid", () => {
      act(() => getState().loadPreset("dashboard"));
      const state = getState();
      expect(state.columns.length).toBeGreaterThan(0);
      expect(state.items.length).toBeGreaterThan(0);
    });

    it("gallery preset loads a valid grid", () => {
      act(() => getState().loadPreset("gallery"));
      const state = getState();
      expect(state.columns.length).toBeGreaterThan(0);
      expect(state.items.length).toBeGreaterThan(0);
    });
  });

  describe("undo/redo", () => {
    it("undo reverts the last action", () => {
      act(() => getState().addColumn());
      expect(getState().columns).toHaveLength(4);
      act(() => getState().undo());
      expect(getState().columns).toHaveLength(3);
    });

    it("redo re-applies an undone action", () => {
      act(() => getState().addColumn());
      act(() => getState().undo());
      expect(getState().columns).toHaveLength(3);
      act(() => getState().redo());
      expect(getState().columns).toHaveLength(4);
    });
  });
});
