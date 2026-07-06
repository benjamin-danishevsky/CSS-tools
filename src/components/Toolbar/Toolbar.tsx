export default function Toolbar() {
  return (
    <header
      className="flex items-center justify-between px-6 py-3"
      style={{
        borderBottom: "1px solid var(--color-border)",
        backgroundColor: "var(--color-bg-secondary)",
      }}
    >
      <h1
        className="text-xl font-bold tracking-tight"
        style={{ color: "var(--color-accent)" }}
      >
        GridCraft
      </h1>
    </header>
  );
}
