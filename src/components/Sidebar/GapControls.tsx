import { useGridStore } from "../../store/gridStore";
import InfoTip from "../InfoTip";

export default function GapControls() {
  const gap = useGridStore((s) => s.gap);
  const setGap = useGridStore((s) => s.setGap);

  return (
    <div>
      <div className="mb-2 flex items-center gap-1.5">
        <h3
          className="text-xs font-semibold uppercase tracking-wider"
          style={{ color: "var(--color-text-muted)" }}
        >
          Gap
        </h3>
        <InfoTip termKey="gap" />
      </div>
      <div className="flex gap-3">
        <label className="flex flex-col gap-1">
          <span
            className="text-[10px]"
            style={{ color: "var(--color-text-secondary)" }}
          >
            Row
          </span>
          <div className="flex items-center gap-1">
            <input
              data-testid="row-gap-input"
              type="number"
              value={gap.row}
              onChange={(e) => setGap({ row: parseInt(e.target.value) || 0 })}
              className="w-16 rounded-md px-2 py-1 text-xs"
              style={{
                backgroundColor: "var(--color-bg-tertiary)",
                border: "1px solid var(--color-border)",
                color: "var(--color-text)",
              }}
              min={0}
            />
            <span
              className="text-[10px]"
              style={{ color: "var(--color-text-muted)" }}
            >
              px
            </span>
          </div>
        </label>
        <label className="flex flex-col gap-1">
          <span
            className="text-[10px]"
            style={{ color: "var(--color-text-secondary)" }}
          >
            Column
          </span>
          <div className="flex items-center gap-1">
            <input
              data-testid="column-gap-input"
              type="number"
              value={gap.column}
              onChange={(e) =>
                setGap({ column: parseInt(e.target.value) || 0 })
              }
              className="w-16 rounded-md px-2 py-1 text-xs"
              style={{
                backgroundColor: "var(--color-bg-tertiary)",
                border: "1px solid var(--color-border)",
                color: "var(--color-text)",
              }}
              min={0}
            />
            <span
              className="text-[10px]"
              style={{ color: "var(--color-text-muted)" }}
            >
              px
            </span>
          </div>
        </label>
      </div>
    </div>
  );
}
