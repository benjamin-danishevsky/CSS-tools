export default function Sidebar() {
  return (
    <aside
      className="w-[280px] shrink-0 overflow-y-auto p-4"
      style={{
        borderRight: "1px solid var(--color-border)",
        backgroundColor: "var(--color-bg-secondary)",
      }}
    >
      <p style={{ color: "var(--color-text-muted)" }}>
        Sidebar controls (Phase 3)
      </p>
    </aside>
  );
}
