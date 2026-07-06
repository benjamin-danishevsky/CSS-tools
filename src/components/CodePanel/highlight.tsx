import type { ReactNode } from "react";

const tokenStyle: Record<string, React.CSSProperties> = {
  selector: { color: "var(--color-syntax-selector)" },
  property: { color: "var(--color-syntax-property)" },
  value: { color: "var(--color-syntax-value)" },
  punctuation: { color: "var(--color-syntax-punctuation)" },
};

function Token({ type, children }: { type: string; children: ReactNode }) {
  return (
    <span data-token={type} style={tokenStyle[type]}>
      {children}
    </span>
  );
}

function leadingWhitespace(line: string): string {
  const match = line.match(/^\s*/);
  return match ? match[0] : "";
}

function highlightLine(line: string): ReactNode {
  const trimmed = line.trim();
  if (trimmed === "") return null;

  // Selector line, e.g. ".container {"
  if (trimmed.endsWith("{")) {
    const indent = leadingWhitespace(line);
    const selector = trimmed.slice(0, -1).trimEnd();
    return (
      <>
        {indent}
        <Token type="selector">{selector}</Token>
        <Token type="punctuation"> {"{"}</Token>
      </>
    );
  }

  // Closing brace
  if (trimmed === "}") {
    return <Token type="punctuation">{"}"}</Token>;
  }

  // grid-template-areas string row, e.g. '"header header header"'
  if (trimmed.startsWith('"')) {
    return (
      <>
        {leadingWhitespace(line)}
        <Token type="value">{trimmed}</Token>
      </>
    );
  }

  // Declaration line, e.g. "  display: grid;"
  const colonIndex = line.indexOf(":");
  if (colonIndex !== -1) {
    const indent = leadingWhitespace(line);
    const property = line.slice(indent.length, colonIndex);
    const rest = line.slice(colonIndex + 1);
    const hasSemicolon = rest.endsWith(";");
    const value = hasSemicolon ? rest.slice(0, -1) : rest;
    return (
      <>
        {indent}
        <Token type="property">{property}</Token>
        <Token type="punctuation">:</Token>
        {value && <Token type="value">{value}</Token>}
        {hasSemicolon && <Token type="punctuation">;</Token>}
      </>
    );
  }

  return line;
}

export function highlightCSS(css: string): ReactNode[] {
  const lines = css.split("\n");
  return lines.map((line, index) => (
    <span key={index}>
      {highlightLine(line)}
      {index < lines.length - 1 ? "\n" : ""}
    </span>
  ));
}
