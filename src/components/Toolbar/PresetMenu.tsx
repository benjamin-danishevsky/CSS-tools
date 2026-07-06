import { useEffect, useRef, useState } from "react";
import { useGridStore } from "../../store/gridStore";
import type { PresetKey } from "../../types/grid";

const PRESETS: { key: PresetKey; label: string }[] = [
  { key: "holy-grail", label: "Holy Grail" },
  { key: "app-shell", label: "App Shell" },
  { key: "dashboard", label: "Dashboard" },
  { key: "blog", label: "Blog / Article" },
  { key: "split-screen", label: "Split Screen" },
  { key: "hero-landing", label: "Hero Landing" },
  { key: "pricing", label: "Pricing Table" },
  { key: "kanban", label: "Kanban Board" },
  { key: "gallery", label: "Gallery" },
];

export default function PresetMenu() {
  const loadPreset = useGridStore((s) => s.loadPreset);
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function onPointerDown(e: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div ref={containerRef} className="relative">
      <button
        data-testid="presets-btn"
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-1 rounded-md px-2.5 py-1 text-xs font-medium transition-colors"
        style={{
          backgroundColor: "var(--color-accent-bg)",
          color: "var(--color-accent)",
        }}
      >
        Presets
        <span aria-hidden="true" className="text-[9px]">
          ▾
        </span>
      </button>

      {open && (
        <div
          role="menu"
          data-testid="presets-menu"
          className="absolute left-0 top-full z-50 mt-1 flex w-44 flex-col gap-0.5 rounded-lg p-1"
          style={{
            backgroundColor: "var(--color-bg)",
            border: "1px solid var(--color-border)",
            boxShadow: "var(--shadow-lg)",
          }}
        >
          {PRESETS.map((preset) => (
            <button
              key={preset.key}
              role="menuitem"
              data-testid={`preset-${preset.key}`}
              onClick={() => {
                loadPreset(preset.key);
                setOpen(false);
              }}
              className="rounded-md px-2.5 py-1.5 text-left text-xs font-medium transition-colors hover:brightness-95"
              style={{ color: "var(--color-text-secondary)" }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor =
                  "var(--color-accent-bg)";
                e.currentTarget.style.color = "var(--color-accent)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "transparent";
                e.currentTarget.style.color = "var(--color-text-secondary)";
              }}
            >
              {preset.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
