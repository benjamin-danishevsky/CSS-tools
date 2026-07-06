import { describe, it, expect } from "vitest";
import {
  findCellAtPoint,
  clampStart,
  resizeTrackValue,
  type CellRect,
} from "../../src/lib/dragMath";
import type { TrackDefinition } from "../../src/types/grid";

const cells: CellRect[] = [
  { row: 1, col: 1, left: 0, top: 0, right: 100, bottom: 100 },
  { row: 1, col: 2, left: 100, top: 0, right: 200, bottom: 100 },
  { row: 2, col: 1, left: 0, top: 100, right: 100, bottom: 200 },
  { row: 2, col: 2, left: 100, top: 100, right: 200, bottom: 200 },
];

describe("dragMath", () => {
  describe("findCellAtPoint", () => {
    it("returns the cell containing the point", () => {
      expect(findCellAtPoint(cells, 50, 50)).toEqual({ row: 1, col: 1 });
      expect(findCellAtPoint(cells, 150, 150)).toEqual({ row: 2, col: 2 });
      expect(findCellAtPoint(cells, 150, 50)).toEqual({ row: 1, col: 2 });
    });

    it("returns null when the point is outside every cell", () => {
      expect(findCellAtPoint(cells, 500, 500)).toBeNull();
      expect(findCellAtPoint(cells, -10, -10)).toBeNull();
    });

    it("treats the right/bottom edge as exclusive", () => {
      // x === right of cell (1,1) should fall into cell (1,2)
      expect(findCellAtPoint(cells, 100, 50)).toEqual({ row: 1, col: 2 });
    });
  });

  describe("clampStart", () => {
    it("leaves an in-range start unchanged", () => {
      expect(clampStart(2, 1, 3)).toBe(2);
    });

    it("clamps a start that would push the span past the end", () => {
      // span 2 in a 3-track grid: max start is 2
      expect(clampStart(3, 2, 3)).toBe(2);
    });

    it("clamps a start below 1 up to 1", () => {
      expect(clampStart(0, 1, 3)).toBe(1);
      expect(clampStart(-5, 1, 3)).toBe(1);
    });

    it("clamps a start beyond the track count", () => {
      expect(clampStart(5, 1, 3)).toBe(3);
    });

    it("returns 1 when the span fills the whole grid", () => {
      expect(clampStart(2, 3, 3)).toBe(1);
    });
  });

  describe("resizeTrackValue", () => {
    const track = (
      unit: TrackDefinition["unit"],
      value: number,
    ): TrackDefinition => ({
      id: "t",
      unit,
      value,
    });

    it("adds the pixel delta directly for px tracks", () => {
      expect(resizeTrackValue(track("px", 200), 50, 1000)).toBe(250);
    });

    it("clamps px tracks to a minimum of 10", () => {
      expect(resizeTrackValue(track("px", 200), -300, 1000)).toBe(10);
    });

    it("scales the delta for fr tracks (50px per 1fr)", () => {
      expect(resizeTrackValue(track("fr", 1), 50, 1000)).toBe(2);
      expect(resizeTrackValue(track("fr", 1), 25, 1000)).toBe(1.5);
    });

    it("clamps fr tracks to a minimum of 0.1", () => {
      expect(resizeTrackValue(track("fr", 1), -1000, 1000)).toBe(0.1);
    });

    it("maps the delta to a percentage of the container for % tracks", () => {
      expect(resizeTrackValue(track("%", 50), 50, 500)).toBe(60);
    });

    it("clamps % tracks between 1 and 100", () => {
      expect(resizeTrackValue(track("%", 90), 500, 500)).toBe(100);
      expect(resizeTrackValue(track("%", 5), -500, 500)).toBe(1);
    });

    it("leaves auto tracks unchanged", () => {
      expect(resizeTrackValue(track("auto", 0), 100, 1000)).toBe(0);
    });
  });
});
