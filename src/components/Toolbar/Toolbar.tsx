import { useStore } from "zustand";
import { useGridStore } from "../../store/gridStore";
import { useTheme } from "../../lib/useTheme";
import PresetMenu from "./PresetMenu";

export default function Toolbar() {
  const reset = useGridStore((s) => s.reset);
  const undo = useGridStore((s) => s.undo);
  const redo = useGridStore((s) => s.redo);
  const canUndo = useStore(
    useGridStore.temporal,
    (s) => s.pastStates.length > 0,
  );
  const canRedo = useStore(
    useGridStore.temporal,
    (s) => s.futureStates.length > 0,
  );
  const { isDark, toggle } = useTheme();

  return (
    <header
      className="flex items-center justify-between gap-4 px-5 py-2.5"
      style={{
        borderBottom: "1px solid var(--color-border)",
        backgroundColor: "var(--color-bg-secondary)",
      }}
    >
      <div className="flex items-center gap-4">
        <h1
          className="text-lg font-extrabold tracking-tight"
          style={{ color: "var(--color-accent)" }}
        >
          GridCraft
        </h1>

        <div
          className="h-6 w-px"
          style={{ backgroundColor: "var(--color-border)" }}
        />

        <PresetMenu />
      </div>

      <div className="flex items-center gap-2">
        <button
          data-testid="undo-btn"
          onClick={() => undo()}
          disabled={!canUndo}
          aria-label="Undo"
          className="flex h-8 w-8 items-center justify-center rounded-md text-base transition-colors disabled:opacity-40"
          style={{
            backgroundColor: "var(--color-bg-tertiary)",
            color: "var(--color-text-secondary)",
            cursor: canUndo ? "pointer" : "not-allowed",
          }}
        >
          ↶
        </button>
        <button
          data-testid="redo-btn"
          onClick={() => redo()}
          disabled={!canRedo}
          aria-label="Redo"
          className="flex h-8 w-8 items-center justify-center rounded-md text-base transition-colors disabled:opacity-40"
          style={{
            backgroundColor: "var(--color-bg-tertiary)",
            color: "var(--color-text-secondary)",
            cursor: canRedo ? "pointer" : "not-allowed",
          }}
        >
          ↷
        </button>

        <div
          className="mx-1 h-6 w-px"
          style={{ backgroundColor: "var(--color-border)" }}
        />

        <button
          data-testid="reset-btn"
          onClick={() => reset()}
          className="rounded-md px-3 py-1.5 text-xs font-medium transition-colors"
          style={{
            backgroundColor: "var(--color-bg-tertiary)",
            color: "var(--color-danger)",
          }}
        >
          Reset
        </button>

        <button
          data-testid="theme-toggle"
          onClick={toggle}
          aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
          className="flex h-8 w-8 items-center justify-center rounded-md text-base transition-colors"
          style={{
            backgroundColor: "var(--color-bg-tertiary)",
            color: "var(--color-text-secondary)",
          }}
        >
          {isDark ? "☀" : "🌙"}
        </button>
      </div>
    </header>
  );
}
