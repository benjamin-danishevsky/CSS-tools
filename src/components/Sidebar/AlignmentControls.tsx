import { useGridStore } from "../../store/gridStore";
import type {
  AlignmentValue,
  ContentAlignmentValue,
  GridState,
} from "../../types/grid";
import InfoTip from "../InfoTip";
import type { TermKey } from "../../lib/glossary";

const ITEM_VALUES: AlignmentValue[] = ["start", "end", "center", "stretch"];
const CONTENT_VALUES: ContentAlignmentValue[] = [
  "start",
  "end",
  "center",
  "stretch",
  "space-between",
  "space-around",
  "space-evenly",
];

interface AlignDropdownProps {
  property: "justifyItems" | "alignItems" | "justifyContent" | "alignContent";
  label: string;
}

function AlignDropdown({ property, label }: AlignDropdownProps) {
  const value = useGridStore((s) => s[property]);
  const setAlignment = useGridStore((s) => s.setAlignment);
  const isContent =
    property === "justifyContent" || property === "alignContent";
  const options = isContent ? CONTENT_VALUES : ITEM_VALUES;

  return (
    <label className="flex flex-col gap-1">
      <span className="flex items-center gap-1">
        <span
          className="text-[10px]"
          style={{ color: "var(--color-text-secondary)" }}
        >
          {label}
        </span>
        <InfoTip termKey={label as TermKey} />
      </span>
      <select
        data-testid={`align-${property}`}
        value={value}
        onChange={(e) =>
          setAlignment(property, e.target.value as GridState[typeof property])
        }
        className="rounded-md px-2 py-1 text-xs"
        style={{
          backgroundColor: "var(--color-bg-tertiary)",
          border: "1px solid var(--color-border)",
          color: "var(--color-text)",
        }}
      >
        {options.map((v) => (
          <option key={v} value={v}>
            {v}
          </option>
        ))}
      </select>
    </label>
  );
}

export default function AlignmentControls() {
  return (
    <div>
      <h3
        className="mb-2 text-xs font-semibold uppercase tracking-wider"
        style={{ color: "var(--color-text-muted)" }}
      >
        Alignment
      </h3>
      <div className="grid grid-cols-2 gap-2">
        <AlignDropdown property="justifyItems" label="justify-items" />
        <AlignDropdown property="alignItems" label="align-items" />
        <AlignDropdown property="justifyContent" label="justify-content" />
        <AlignDropdown property="alignContent" label="align-content" />
      </div>
    </div>
  );
}
