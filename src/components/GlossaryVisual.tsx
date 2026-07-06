import type { TermKey } from "../lib/glossary";

const ACCENT = "var(--color-accent)";
const BORDER = "var(--color-border-hover)";
const MUTED = "var(--color-text-muted)";
const FILL = "var(--color-accent-bg)";

/**
 * Small static diagram illustrating a glossary term. Presentational only —
 * uses theme CSS variables so it works in light and dark mode.
 */
export default function GlossaryVisual({ termKey }: { termKey: TermKey }) {
  switch (termKey) {
    case "units":
      return (
        <svg viewBox="0 0 160 44" width="160" height="44" aria-hidden="true">
          <rect
            x="1"
            y="8"
            width="40"
            height="28"
            rx="3"
            fill={FILL}
            stroke={BORDER}
          />
          <text x="21" y="26" fontSize="9" fill={MUTED} textAnchor="middle">
            px
          </text>
          <rect
            x="45"
            y="8"
            width="114"
            height="28"
            rx="3"
            fill={FILL}
            stroke={ACCENT}
          />
          <text x="102" y="26" fontSize="9" fill={ACCENT} textAnchor="middle">
            fr (fills the rest)
          </text>
        </svg>
      );

    case "gap":
      return (
        <svg viewBox="0 0 160 44" width="160" height="44" aria-hidden="true">
          <rect
            x="1"
            y="8"
            width="66"
            height="28"
            rx="3"
            fill={FILL}
            stroke={BORDER}
          />
          <rect
            x="93"
            y="8"
            width="66"
            height="28"
            rx="3"
            fill={FILL}
            stroke={BORDER}
          />
          <line
            x1="67"
            y1="22"
            x2="93"
            y2="22"
            stroke={ACCENT}
            strokeWidth="1"
            strokeDasharray="3 3"
          />
          <text x="80" y="18" fontSize="8" fill={ACCENT} textAnchor="middle">
            gap
          </text>
        </svg>
      );

    case "justify-items":
    case "justify-content":
      return (
        <svg viewBox="0 0 160 44" width="160" height="44" aria-hidden="true">
          <rect
            x="1"
            y="8"
            width="158"
            height="28"
            rx="3"
            fill={FILL}
            stroke={BORDER}
          />
          <rect x="6" y="13" width="18" height="18" rx="2" fill={ACCENT} />
          <text x="90" y="26" fontSize="8" fill={MUTED} textAnchor="middle">
            ← positions horizontally →
          </text>
        </svg>
      );

    case "align-items":
    case "align-content":
      return (
        <svg viewBox="0 0 160 44" width="160" height="44" aria-hidden="true">
          <rect
            x="52"
            y="1"
            width="56"
            height="42"
            rx="3"
            fill={FILL}
            stroke={BORDER}
          />
          <rect x="66" y="4" width="28" height="12" rx="2" fill={ACCENT} />
          <text x="80" y="38" fontSize="7" fill={MUTED} textAnchor="middle">
            positions vertically
          </text>
        </svg>
      );

    case "grid-lines":
      return (
        <svg viewBox="0 0 160 44" width="160" height="44" aria-hidden="true">
          {[10, 60, 110, 150].map((x, i) => (
            <g key={x}>
              <line x1={x} y1="6" x2={x} y2="34" stroke={BORDER} />
              <text x={x} y="43" fontSize="8" fill={MUTED} textAnchor="middle">
                {i + 1}
              </text>
            </g>
          ))}
          <rect
            x="10"
            y="10"
            width="100"
            height="20"
            rx="2"
            fill={FILL}
            stroke={ACCENT}
          />
          <text x="60" y="24" fontSize="8" fill={ACCENT} textAnchor="middle">
            1 → 3
          </text>
        </svg>
      );

    case "self-align":
      return (
        <svg viewBox="0 0 160 44" width="160" height="44" aria-hidden="true">
          <rect
            x="52"
            y="4"
            width="56"
            height="36"
            rx="3"
            fill={FILL}
            stroke={BORDER}
          />
          <rect x="88" y="8" width="16" height="16" rx="2" fill={ACCENT} />
          <text x="80" y="38" fontSize="7" fill={MUTED} textAnchor="middle">
            just this item
          </text>
        </svg>
      );

    default:
      return null;
  }
}
