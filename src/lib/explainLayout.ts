import type {
  GridState,
  GridItem,
  TrackDefinition,
  ContentAlignmentValue,
} from "../types/grid";

function describeTrack(track: TrackDefinition): string {
  switch (track.unit) {
    case "fr":
      return `${track.value}fr (a flexible share of the leftover space)`;
    case "px":
      return `${track.value}px (a fixed size)`;
    case "%":
      return `${track.value}% of the container`;
    case "auto":
    default:
      return "auto (sized to fit its content)";
  }
}

function describeTracks(
  noun: "column" | "row",
  tracks: TrackDefinition[],
): string {
  const n = tracks.length;
  const plural = n === 1 ? noun : `${noun}s`;
  const allSame = tracks.every(
    (t) => t.unit === tracks[0].unit && t.value === tracks[0].value,
  );
  if (allSame) {
    return `${n} equal ${plural}, each ${describeTrack(tracks[0])}.`;
  }
  return `${n} ${plural}: ${tracks.map(describeTrack).join(", ")}.`;
}

function describeGap(gap: GridState["gap"]): string {
  if (gap.row === gap.column) {
    return `There is a ${gap.row}px gap between cells.`;
  }
  return `There is a ${gap.row}px gap between rows and a ${gap.column}px gap between columns.`;
}

const ITEM_HORIZONTAL: Record<string, string> = {
  start: "to the left",
  end: "to the right",
  center: "centered",
};
const ITEM_VERTICAL: Record<string, string> = {
  start: "at the top",
  end: "at the bottom",
  center: "centered",
};

function describeContentPosition(value: ContentAlignmentValue): string {
  switch (value) {
    case "start":
      return "at the start";
    case "end":
      return "at the end";
    case "center":
      return "in the center";
    case "space-between":
      return "with space between the tracks";
    case "space-around":
      return "with space around the tracks";
    case "space-evenly":
      return "with even spacing around the tracks";
    default:
      return "stretched to fill";
  }
}

function describeAlignment(state: GridState): string[] {
  const out: string[] = [];
  if (state.justifyItems !== "stretch") {
    out.push(
      `Items are aligned ${ITEM_HORIZONTAL[state.justifyItems]} within their cells.`,
    );
  }
  if (state.alignItems !== "stretch") {
    out.push(
      `Items are aligned ${ITEM_VERTICAL[state.alignItems]} within their cells.`,
    );
  }
  if (state.justifyContent !== "stretch") {
    out.push(
      `The whole grid is positioned ${describeContentPosition(state.justifyContent)} horizontally in the container.`,
    );
  }
  if (state.alignContent !== "stretch") {
    out.push(
      `The whole grid is positioned ${describeContentPosition(state.alignContent)} vertically in the container.`,
    );
  }
  return out;
}

function describeSpan(start: number, end: number, noun: string): string {
  const last = end - 1;
  if (last <= start) {
    return `${noun} ${start}`;
  }
  return `${noun}s ${start}–${last}`;
}

function describeItem(item: GridItem): string {
  const cols = describeSpan(item.gridColumnStart, item.gridColumnEnd, "column");
  const rows = describeSpan(item.gridRowStart, item.gridRowEnd, "row");
  return `"${item.label}" occupies ${cols} and ${rows}.`;
}

function describeAreas(areas: string[][]): string {
  const names = [...new Set(areas.flat())];
  return `Named areas are used, so items can be placed by name: ${names.join(", ")}.`;
}

/**
 * Turns the grid state into a list of plain-English sentences describing the
 * layout for someone who does not know CSS. Pure — mirrors cssGenerator.
 */
export function explainLayout(state: GridState): string[] {
  const out: string[] = [];
  out.push(describeTracks("column", state.columns));
  out.push(describeTracks("row", state.rows));
  out.push(describeGap(state.gap));
  out.push(...describeAlignment(state));

  if (state.items.length === 0) {
    out.push("No items placed yet — add one to position content on the grid.");
  } else {
    state.items.forEach((item) => out.push(describeItem(item)));
  }

  if (state.gridTemplateAreas) {
    out.push(describeAreas(state.gridTemplateAreas));
  }

  return out;
}
