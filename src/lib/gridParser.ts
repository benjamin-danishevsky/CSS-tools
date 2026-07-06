import type { TrackDefinition, TrackUnit } from "../types/grid";

let nextId = 1;

function generateId(): string {
  return `track-${nextId++}`;
}

const UNIT_PATTERN = /^(\d+(?:\.\d+)?)(fr|px|%)$/;

export function parseTrackString(input: string): TrackDefinition[] {
  const trimmed = input.trim();
  if (!trimmed) return [];

  return trimmed.split(/\s+/).map((token) => {
    if (token === "auto") {
      return { id: generateId(), value: 0, unit: "auto" as TrackUnit };
    }

    const match = token.match(UNIT_PATTERN);
    if (match) {
      return {
        id: generateId(),
        value: parseFloat(match[1]),
        unit: match[2] as TrackUnit,
      };
    }

    return { id: generateId(), value: 1, unit: "fr" as TrackUnit };
  });
}

export function trackToString(track: TrackDefinition): string {
  if (track.unit === "auto") return "auto";
  return `${track.value}${track.unit}`;
}
