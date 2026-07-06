import type { GridState, TrackDefinition } from "../types/grid";

function trackToCSS(track: TrackDefinition): string {
  if (track.unit === "auto") return "auto";
  return `${track.value}${track.unit}`;
}

export function generateCSS(state: GridState): string {
  const lines: string[] = [];

  lines.push(".container {");
  lines.push("  display: grid;");
  lines.push(
    `  grid-template-columns: ${state.columns.map(trackToCSS).join(" ")};`,
  );
  lines.push(`  grid-template-rows: ${state.rows.map(trackToCSS).join(" ")};`);

  if (state.gridTemplateAreas) {
    lines.push("  grid-template-areas:");
    state.gridTemplateAreas.forEach((row, i) => {
      const rowStr = `    "${row.join(" ")}"`;
      lines.push(
        i < state.gridTemplateAreas!.length - 1 ? rowStr : `${rowStr};`,
      );
    });
  }

  if (state.gap.row === state.gap.column) {
    lines.push(`  gap: ${state.gap.row}px;`);
  } else {
    lines.push(`  row-gap: ${state.gap.row}px;`);
    lines.push(`  column-gap: ${state.gap.column}px;`);
  }

  if (state.justifyItems !== "stretch") {
    lines.push(`  justify-items: ${state.justifyItems};`);
  }
  if (state.alignItems !== "stretch") {
    lines.push(`  align-items: ${state.alignItems};`);
  }
  if (state.justifyContent !== "stretch") {
    lines.push(`  justify-content: ${state.justifyContent};`);
  }
  if (state.alignContent !== "stretch") {
    lines.push(`  align-content: ${state.alignContent};`);
  }

  lines.push("}");

  state.items.forEach((item, index) => {
    lines.push("");
    lines.push(`.item-${index + 1} {`);
    lines.push(
      `  grid-column: ${item.gridColumnStart} / ${item.gridColumnEnd};`,
    );
    lines.push(`  grid-row: ${item.gridRowStart} / ${item.gridRowEnd};`);

    if (item.justifySelf) {
      lines.push(`  justify-self: ${item.justifySelf};`);
    }
    if (item.alignSelf) {
      lines.push(`  align-self: ${item.alignSelf};`);
    }

    lines.push("}");
  });

  return lines.join("\n");
}
