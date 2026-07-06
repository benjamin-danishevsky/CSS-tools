import { useGridStore } from "../../store/gridStore";
import { trackToString } from "../../lib/gridParser";

export default function Canvas() {
  const columns = useGridStore((s) => s.columns);
  const rows = useGridStore((s) => s.rows);
  const gap = useGridStore((s) => s.gap);
  const items = useGridStore((s) => s.items);
  const selectedItemId = useGridStore((s) => s.selectedItemId);
  const selectItem = useGridStore((s) => s.selectItem);

  const gridTemplateColumns = columns.map(trackToString).join(" ");
  const gridTemplateRows = rows.map(trackToString).join(" ");
  const gapValue =
    gap.row === gap.column ? `${gap.row}px` : `${gap.row}px ${gap.column}px`;

  const cells = [];
  for (let r = 0; r < rows.length; r++) {
    for (let c = 0; c < columns.length; c++) {
      cells.push(
        <div
          key={`cell-${r}-${c}`}
          data-testid="grid-cell"
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
        data-testid="grid-container"
        className="w-full h-full"
        style={{
          display: "grid",
          gridTemplateColumns,
          gridTemplateRows,
          gap: gapValue,
          minHeight: 300,
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
              className="flex flex-col items-center justify-center cursor-pointer transition-shadow"
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
      </div>
    </section>
  );
}
