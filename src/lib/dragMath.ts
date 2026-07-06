import type { TrackDefinition } from "../types/grid";

export interface CellRect {
  row: number; // 1-based grid row line
  col: number; // 1-based grid column line
  left: number;
  top: number;
  right: number;
  bottom: number;
}

/**
 * Returns the 1-based { row, col } of the cell containing (x, y), or null if
 * the point lies outside every cell. Right/bottom edges are exclusive so a
 * point exactly on a boundary belongs to the next cell.
 */
export function findCellAtPoint(
  cells: CellRect[],
  x: number,
  y: number,
): { row: number; col: number } | null {
  for (const cell of cells) {
    if (x >= cell.left && x < cell.right && y >= cell.top && y < cell.bottom) {
      return { row: cell.row, col: cell.col };
    }
  }
  return null;
}

/**
 * Clamps a 1-based track start so an item of the given span stays fully
 * inside a grid with `trackCount` tracks.
 */
export function clampStart(
  start: number,
  span: number,
  trackCount: number,
): number {
  const maxStart = trackCount - span + 1;
  return Math.max(1, Math.min(start, maxStart));
}

/**
 * Computes a track's new numeric value after dragging its boundary by
 * `deltaPx` pixels. Behaviour depends on the track unit; auto is left as-is.
 */
export function resizeTrackValue(
  track: TrackDefinition,
  deltaPx: number,
  containerSizePx: number,
): number {
  switch (track.unit) {
    case "px":
      return Math.max(10, Math.round(track.value + deltaPx));
    case "fr":
      // ~50px of drag maps to 1fr.
      return Math.max(
        0.1,
        Math.round((track.value + deltaPx / 50) * 100) / 100,
      );
    case "%": {
      if (containerSizePx <= 0) return track.value;
      const pct = track.value + (deltaPx / containerSizePx) * 100;
      return Math.max(1, Math.min(100, Math.round(pct)));
    }
    default:
      return track.value;
  }
}
