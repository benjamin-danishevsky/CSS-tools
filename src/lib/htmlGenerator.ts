import type { GridState } from "../types/grid";

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export function generateHTML(state: GridState): string {
  const lines: string[] = [];
  lines.push('<div class="container">');

  state.items.forEach((item, index) => {
    lines.push(
      `  <div class="item-${index + 1}">${escapeHtml(item.label)}</div>`,
    );
  });

  lines.push("</div>");
  return lines.join("\n");
}
