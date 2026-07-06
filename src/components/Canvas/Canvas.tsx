import { useRef, useState } from "react";
import { useGridStore } from "../../store/gridStore";
import { trackToString } from "../../lib/gridParser";
import {
  findCellAtPoint,
  clampStart,
  resizeTrackValue,
  type CellRect,
} from "../../lib/dragMath";
import type { TrackDefinition } from "../../types/grid";

interface Preview {
  colStart: number;
  colEnd: number;
  rowStart: number;
  rowEnd: number;
}

interface ItemDrag {
  id: string;
  colSpan: number;
  rowSpan: number;
  target: Preview | null;
}

interface ResizeDrag {
  type: "columns" | "rows";
  id: string;
  startPx: number;
  startValue: number;
  containerPx: number;
}

function capturePointer(e: React.PointerEvent) {
  try {
    (e.currentTarget as Element).setPointerCapture?.(e.pointerId);
  } catch {
    // Pointer capture unsupported (e.g. jsdom) — safe to ignore.
  }
}

function releasePointer(e: React.PointerEvent) {
  try {
    (e.currentTarget as Element).releasePointerCapture?.(e.pointerId);
  } catch {
    // ignore
  }
}

export default function Canvas() {
  const columns = useGridStore((s) => s.columns);
  const rows = useGridStore((s) => s.rows);
  const gap = useGridStore((s) => s.gap);
  const items = useGridStore((s) => s.items);
  const selectedItemId = useGridStore((s) => s.selectedItemId);
  const selectItem = useGridStore((s) => s.selectItem);
  const updateItem = useGridStore((s) => s.updateItem);
  const updateTrack = useGridStore((s) => s.updateTrack);

  const gridRef = useRef<HTMLDivElement>(null);
  const itemDrag = useRef<ItemDrag | null>(null);
  const resizeDrag = useRef<ResizeDrag | null>(null);
  const [preview, setPreview] = useState<Preview | null>(null);

  const gridTemplateColumns = columns.map(trackToString).join(" ");
  const gridTemplateRows = rows.map(trackToString).join(" ");
  const gapValue =
    gap.row === gap.column ? `${gap.row}px` : `${gap.row}px ${gap.column}px`;

  function cellUnderPointer(x: number, y: number) {
    const grid = gridRef.current;
    if (!grid) return null;
    const rects: CellRect[] = [];
    grid.querySelectorAll('[data-testid="grid-cell"]').forEach((el) => {
      const cell = el as HTMLElement;
      const r = cell.getBoundingClientRect();
      rects.push({
        row: Number(cell.dataset.row),
        col: Number(cell.dataset.col),
        left: r.left,
        top: r.top,
        right: r.right,
        bottom: r.bottom,
      });
    });
    return findCellAtPoint(rects, x, y);
  }

  // ----- Item drag-to-place -----
  function onItemPointerDown(
    e: React.PointerEvent,
    item: (typeof items)[number],
  ) {
    e.stopPropagation();
    selectItem(item.id);
    itemDrag.current = {
      id: item.id,
      colSpan: item.gridColumnEnd - item.gridColumnStart,
      rowSpan: item.gridRowEnd - item.gridRowStart,
      target: null,
    };
    capturePointer(e);
  }

  function onItemPointerMove(e: React.PointerEvent) {
    const drag = itemDrag.current;
    if (!drag) return;
    const cell = cellUnderPointer(e.clientX, e.clientY);
    if (!cell) return;
    const colStart = clampStart(cell.col, drag.colSpan, columns.length);
    const rowStart = clampStart(cell.row, drag.rowSpan, rows.length);
    const target: Preview = {
      colStart,
      colEnd: colStart + drag.colSpan,
      rowStart,
      rowEnd: rowStart + drag.rowSpan,
    };
    drag.target = target;
    setPreview(target);
  }

  function onItemPointerUp(e: React.PointerEvent) {
    const drag = itemDrag.current;
    if (drag?.target) {
      updateItem(drag.id, {
        gridColumnStart: drag.target.colStart,
        gridColumnEnd: drag.target.colEnd,
        gridRowStart: drag.target.rowStart,
        gridRowEnd: drag.target.rowEnd,
      });
    }
    itemDrag.current = null;
    setPreview(null);
    releasePointer(e);
  }

  // ----- Track boundary resize -----
  function onResizePointerDown(
    e: React.PointerEvent,
    type: "columns" | "rows",
    track: TrackDefinition,
  ) {
    e.stopPropagation();
    const grid = gridRef.current;
    const rect = grid?.getBoundingClientRect();
    resizeDrag.current = {
      type,
      id: track.id,
      startPx: type === "columns" ? e.clientX : e.clientY,
      startValue: track.value,
      containerPx: rect ? (type === "columns" ? rect.width : rect.height) : 0,
    };
    capturePointer(e);
  }

  function onResizePointerMove(e: React.PointerEvent) {
    const drag = resizeDrag.current;
    if (!drag) return;
    const current = drag.type === "columns" ? e.clientX : e.clientY;
    const delta = current - drag.startPx;
    const track = (drag.type === "columns" ? columns : rows).find(
      (t) => t.id === drag.id,
    );
    if (!track) return;
    const newValue = resizeTrackValue(
      { ...track, value: drag.startValue },
      delta,
      drag.containerPx,
    );
    updateTrack(drag.type, drag.id, { value: newValue });
  }

  function onResizePointerUp(e: React.PointerEvent) {
    resizeDrag.current = null;
    releasePointer(e);
  }

  const cells = [];
  for (let r = 0; r < rows.length; r++) {
    for (let c = 0; c < columns.length; c++) {
      cells.push(
        <div
          key={`cell-${r}-${c}`}
          data-testid="grid-cell"
          data-row={r + 1}
          data-col={c + 1}
          className="rounded"
          style={{
            gridColumn: `${c + 1} / ${c + 2}`,
            gridRow: `${r + 1} / ${r + 2}`,
            border: "1px dashed var(--color-canvas-grid)",
            minHeight: 40,
            minWidth: 40,
          }}
        />,
      );
    }
  }

  return (
    <section
      className="flex flex-1 items-center justify-center overflow-auto p-6"
      style={{
        backgroundColor: "var(--color-canvas-bg)",
        backgroundImage:
          "radial-gradient(circle, var(--color-canvas-grid) 1px, transparent 1px)",
        backgroundSize: "20px 20px",
      }}
    >
      <div
        className="h-full w-full"
        style={{
          display: "grid",
          gridTemplateColumns: "auto 1fr",
          gridTemplateRows: "auto 1fr",
          gap: 6,
        }}
      >
        {/* corner spacer */}
        <div />

        {/* column size labels — aligned above each column */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns,
            columnGap: gap.column,
          }}
        >
          {columns.map((col) => (
            <div
              key={`col-label-${col.id}`}
              data-testid={`col-label-${col.id}`}
              className="truncate text-center font-mono text-[11px] font-semibold"
              style={{ color: "var(--color-text-muted)" }}
              title={`Column: ${trackToString(col)}`}
            >
              {trackToString(col)}
            </div>
          ))}
        </div>

        {/* row size labels — aligned beside each row */}
        <div
          style={{
            display: "grid",
            gridTemplateRows,
            rowGap: gap.row,
          }}
        >
          {rows.map((row) => (
            <div
              key={`row-label-${row.id}`}
              data-testid={`row-label-${row.id}`}
              className="flex items-center justify-center pr-1 font-mono text-[11px] font-semibold"
              style={{ color: "var(--color-text-muted)" }}
              title={`Row: ${trackToString(row)}`}
            >
              {trackToString(row)}
            </div>
          ))}
        </div>

        <div
          ref={gridRef}
          data-testid="grid-container"
          className="h-full w-full"
          style={{
            display: "grid",
            gridTemplateColumns,
            gridTemplateRows,
            gap: gapValue,
            minHeight: 300,
            position: "relative",
          }}
        >
          {cells}

          {items.map((item) => {
            const isSelected = item.id === selectedItemId;
            return (
              <div
                key={item.id}
                data-testid={`grid-item-${item.id}`}
                onClick={() => selectItem(item.id)}
                onPointerDown={(e) => onItemPointerDown(e, item)}
                onPointerMove={onItemPointerMove}
                onPointerUp={onItemPointerUp}
                className="flex flex-col items-center justify-center transition-shadow"
                style={{
                  gridColumn: `${item.gridColumnStart} / ${item.gridColumnEnd}`,
                  gridRow: `${item.gridRowStart} / ${item.gridRowEnd}`,
                  backgroundColor: item.color,
                  borderRadius: "var(--radius-md)",
                  padding: "8px 12px",
                  color: "#fff",
                  fontWeight: 600,
                  fontSize: 13,
                  zIndex: 1,
                  cursor: "grab",
                  touchAction: "none",
                  boxShadow: isSelected
                    ? "0 0 0 3px var(--color-accent), var(--shadow-md)"
                    : "var(--shadow-sm)",
                  outline: isSelected
                    ? "2px solid var(--color-accent-light)"
                    : "none",
                }}
              >
                <span>{item.label}</span>
                <span
                  style={{
                    fontSize: 11,
                    opacity: 0.8,
                    fontWeight: 400,
                    marginTop: 2,
                  }}
                >
                  col {item.gridColumnStart}/{item.gridColumnEnd}, row{" "}
                  {item.gridRowStart}/{item.gridRowEnd}
                </span>
              </div>
            );
          })}

          {/* Column resize handles — one at the right edge of each column. */}
          {columns.map((col, i) => (
            <div
              key={`col-handle-${col.id}`}
              data-testid={`col-resize-${col.id}`}
              onPointerDown={(e) => onResizePointerDown(e, "columns", col)}
              onPointerMove={onResizePointerMove}
              onPointerUp={onResizePointerUp}
              style={{
                gridColumn: `${i + 1} / ${i + 2}`,
                gridRow: "1 / -1",
                justifySelf: "end",
                width: 8,
                marginRight: -4,
                cursor: "col-resize",
                touchAction: "none",
                zIndex: 2,
              }}
            />
          ))}

          {/* Row resize handles — one at the bottom edge of each row. */}
          {rows.map((row, i) => (
            <div
              key={`row-handle-${row.id}`}
              data-testid={`row-resize-${row.id}`}
              onPointerDown={(e) => onResizePointerDown(e, "rows", row)}
              onPointerMove={onResizePointerMove}
              onPointerUp={onResizePointerUp}
              style={{
                gridRow: `${i + 1} / ${i + 2}`,
                gridColumn: "1 / -1",
                alignSelf: "end",
                height: 8,
                marginBottom: -4,
                cursor: "row-resize",
                touchAction: "none",
                zIndex: 2,
              }}
            />
          ))}

          {preview && (
            <div
              data-testid="drag-preview"
              style={{
                gridColumn: `${preview.colStart} / ${preview.colEnd}`,
                gridRow: `${preview.rowStart} / ${preview.rowEnd}`,
                border: "2px dashed var(--color-accent)",
                borderRadius: "var(--radius-md)",
                backgroundColor: "var(--color-accent-bg)",
                opacity: 0.7,
                zIndex: 3,
                pointerEvents: "none",
              }}
            />
          )}
        </div>
      </div>
    </section>
  );
}
