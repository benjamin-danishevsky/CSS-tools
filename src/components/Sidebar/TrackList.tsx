import { useGridStore } from "../../store/gridStore";
import type { TrackDefinition, TrackUnit } from "../../types/grid";

const UNITS: TrackUnit[] = ["fr", "px", "%", "auto"];

interface TrackListProps {
  type: "columns" | "rows";
}

export default function TrackList({ type }: TrackListProps) {
  const tracks = useGridStore((s) => s[type]);
  const updateTrack = useGridStore((s) => s.updateTrack);
  const addTrack = useGridStore((s) =>
    type === "columns" ? s.addColumn : s.addRow,
  );
  const removeTrack = useGridStore((s) =>
    type === "columns" ? s.removeColumn : s.removeRow,
  );

  const label = type === "columns" ? "Columns" : "Rows";

  return (
    <div data-testid={`${type}-section`}>
      <div className="mb-2 flex items-center justify-between">
        <h3
          className="text-xs font-semibold uppercase tracking-wider"
          style={{ color: "var(--color-text-muted)" }}
        >
          {label}
        </h3>
        <button
          data-testid={`add-${type === "columns" ? "column" : "row"}-btn`}
          onClick={() => addTrack()}
          className="flex items-center justify-center rounded-md px-2 py-1 text-xs font-medium transition-colors"
          style={{
            backgroundColor: "var(--color-accent-bg)",
            color: "var(--color-accent)",
          }}
        >
          + Add
        </button>
      </div>

      <div className="flex flex-col gap-1.5">
        {tracks.map((track: TrackDefinition) => (
          <div key={track.id} className="flex items-center gap-1.5">
            <input
              data-testid={`track-value-${track.id}`}
              type="number"
              value={track.unit === "auto" ? "" : track.value}
              disabled={track.unit === "auto"}
              onChange={(e) =>
                updateTrack(type, track.id, {
                  value: parseFloat(e.target.value) || 0,
                })
              }
              className="w-14 rounded-md px-2 py-1 text-xs"
              style={{
                backgroundColor: "var(--color-bg-tertiary)",
                border: "1px solid var(--color-border)",
                color: "var(--color-text)",
              }}
              min={0}
              step={track.unit === "fr" ? 0.5 : 1}
            />
            <select
              data-testid={`track-unit-${track.id}`}
              value={track.unit}
              onChange={(e) =>
                updateTrack(type, track.id, {
                  unit: e.target.value as TrackUnit,
                  value: e.target.value === "auto" ? 0 : track.value || 1,
                })
              }
              className="rounded-md px-1 py-1 text-xs"
              style={{
                backgroundColor: "var(--color-bg-tertiary)",
                border: "1px solid var(--color-border)",
                color: "var(--color-text)",
              }}
            >
              {UNITS.map((u) => (
                <option key={u} value={u}>
                  {u}
                </option>
              ))}
            </select>
            <button
              data-testid={`remove-track-${track.id}`}
              onClick={() => removeTrack(track.id)}
              className="ml-auto rounded-md px-1.5 py-0.5 text-xs transition-colors"
              style={{ color: "var(--color-danger)" }}
              aria-label={`Remove ${type === "columns" ? "column" : "row"}`}
            >
              ×
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
