export default function CodePanel() {
  return (
    <aside
      className="w-[320px] shrink-0 overflow-y-auto p-4"
      style={{
        borderLeft: "1px solid var(--color-border)",
        backgroundColor: "var(--color-bg-secondary)",
      }}
    >
      <p style={{ color: "var(--color-text-muted)" }}>Code panel (Phase 4)</p>
    </aside>
  );
}
