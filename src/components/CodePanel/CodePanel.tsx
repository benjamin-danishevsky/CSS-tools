import { useMemo, useState } from "react";
import { useGridStore } from "../../store/gridStore";
import { generateCSS } from "../../lib/cssGenerator";
import { generateHTML } from "../../lib/htmlGenerator";
import { highlightCSS } from "./highlight";

type Tab = "css" | "html";

const MONO_FONT =
  "'Fira Code', 'JetBrains Mono', ui-monospace, SFMono-Regular, Menlo, monospace";

export default function CodePanel() {
  const state = useGridStore((s) => s);
  const [tab, setTab] = useState<Tab>("css");
  const [copied, setCopied] = useState(false);

  const css = useMemo(() => generateCSS(state), [state]);
  const html = useMemo(() => generateHTML(state), [state]);
  const activeCode = tab === "css" ? css : html;

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(activeCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // Clipboard unavailable — silently ignore.
    }
  }

  return (
    <aside
      className="flex w-[320px] shrink-0 flex-col"
      style={{
        borderLeft: "1px solid var(--color-border)",
        backgroundColor: "var(--color-bg-secondary)",
      }}
    >
      <div
        className="flex items-center justify-between gap-2 px-3 py-2"
        style={{ borderBottom: "1px solid var(--color-border)" }}
      >
        <div
          className="flex gap-1 rounded-lg p-0.5"
          style={{ backgroundColor: "var(--color-bg-tertiary)" }}
          role="tablist"
        >
          {(["css", "html"] as const).map((t) => (
            <button
              key={t}
              data-testid={`tab-${t}`}
              role="tab"
              aria-selected={tab === t}
              onClick={() => setTab(t)}
              className="rounded-md px-3 py-1 text-xs font-semibold uppercase tracking-wide transition-colors"
              style={{
                backgroundColor: tab === t ? "var(--color-bg)" : "transparent",
                color:
                  tab === t ? "var(--color-accent)" : "var(--color-text-muted)",
                boxShadow: tab === t ? "var(--shadow-sm)" : "none",
              }}
            >
              {t}
            </button>
          ))}
        </div>

        <button
          data-testid="copy-btn"
          onClick={handleCopy}
          className="rounded-md px-3 py-1.5 text-xs font-semibold transition-colors"
          style={{
            backgroundColor: copied
              ? "var(--color-success)"
              : "var(--color-accent)",
            color: "#fff",
          }}
        >
          {copied ? "Copied!" : `Copy ${tab.toUpperCase()}`}
        </button>
      </div>

      <div className="flex-1 overflow-auto p-3">
        <pre
          data-testid="code-output"
          className="whitespace-pre text-xs leading-relaxed"
          style={{
            fontFamily: MONO_FONT,
            color: "var(--color-text)",
            margin: 0,
          }}
        >
          <code>{tab === "css" ? highlightCSS(css) : html}</code>
        </pre>
      </div>
    </aside>
  );
}
