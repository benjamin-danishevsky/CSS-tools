import { useGridStore } from "../../store/gridStore";
import type { AlignmentValue } from "../../types/grid";

const SELF_VALUES: (AlignmentValue | "")[] = [
  "",
  "start",
  "end",
  "center",
  "stretch",
];

export default function ItemList() {
  const items = useGridStore((s) => s.items);
  const selectedItemId = useGridStore((s) => s.selectedItemId);
  const selectItem = useGridStore((s) => s.selectItem);
  const addItem = useGridStore((s) => s.addItem);
  const updateItem = useGridStore((s) => s.updateItem);
  const removeItem = useGridStore((s) => s.removeItem);

  const selectedItem = items.find((i) => i.id === selectedItemId);

  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <h3
          className="text-xs font-semibold uppercase tracking-wider"
          style={{ color: "var(--color-text-muted)" }}
        >
          Items
        </h3>
        <button
          data-testid="add-item-btn"
          onClick={() => addItem()}
          className="flex items-center justify-center rounded-md px-2 py-1 text-xs font-medium transition-colors"
          style={{
            backgroundColor: "var(--color-accent-bg)",
            color: "var(--color-accent)",
          }}
        >
          + Add Item
        </button>
      </div>

      <div className="flex flex-col gap-1">
        {items.map((item) => (
          <div
            key={item.id}
            data-testid={`sidebar-item-${item.id}`}
            onClick={() => selectItem(item.id)}
            className="flex cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 text-xs transition-colors"
            style={{
              backgroundColor:
                item.id === selectedItemId
                  ? "var(--color-accent-bg)"
                  : "transparent",
              color: "var(--color-text)",
            }}
          >
            <span
              className="h-3 w-3 shrink-0 rounded-sm"
              style={{ backgroundColor: item.color }}
            />
            <span className="flex-1 truncate">{item.label}</span>
            <button
              data-testid={`remove-item-${item.id}`}
              onClick={(e) => {
                e.stopPropagation();
                removeItem(item.id);
              }}
              className="rounded px-1 text-xs transition-colors"
              style={{ color: "var(--color-danger)" }}
              aria-label={`Remove ${item.label}`}
            >
              ×
            </button>
          </div>
        ))}
      </div>

      {selectedItem && (
        <div
          className="mt-3 flex flex-col gap-2 rounded-lg p-3"
          style={{
            backgroundColor: "var(--color-bg-tertiary)",
            border: "1px solid var(--color-border)",
          }}
        >
          <h4
            className="text-[10px] font-semibold uppercase tracking-wider"
            style={{ color: "var(--color-text-muted)" }}
          >
            Position
          </h4>
          <div className="grid grid-cols-2 gap-2">
            <label className="flex flex-col gap-0.5">
              <span
                className="text-[10px]"
                style={{ color: "var(--color-text-secondary)" }}
              >
                col start
              </span>
              <input
                data-testid="item-col-start"
                type="number"
                value={selectedItem.gridColumnStart}
                onChange={(e) =>
                  updateItem(selectedItem.id, {
                    gridColumnStart: parseInt(e.target.value) || 1,
                  })
                }
                className="w-full rounded-md px-2 py-1 text-xs"
                style={{
                  backgroundColor: "var(--color-bg)",
                  border: "1px solid var(--color-border)",
                  color: "var(--color-text)",
                }}
                min={1}
              />
            </label>
            <label className="flex flex-col gap-0.5">
              <span
                className="text-[10px]"
                style={{ color: "var(--color-text-secondary)" }}
              >
                col end
              </span>
              <input
                data-testid="item-col-end"
                type="number"
                value={selectedItem.gridColumnEnd}
                onChange={(e) =>
                  updateItem(selectedItem.id, {
                    gridColumnEnd: parseInt(e.target.value) || 1,
                  })
                }
                className="w-full rounded-md px-2 py-1 text-xs"
                style={{
                  backgroundColor: "var(--color-bg)",
                  border: "1px solid var(--color-border)",
                  color: "var(--color-text)",
                }}
                min={1}
              />
            </label>
            <label className="flex flex-col gap-0.5">
              <span
                className="text-[10px]"
                style={{ color: "var(--color-text-secondary)" }}
              >
                row start
              </span>
              <input
                data-testid="item-row-start"
                type="number"
                value={selectedItem.gridRowStart}
                onChange={(e) =>
                  updateItem(selectedItem.id, {
                    gridRowStart: parseInt(e.target.value) || 1,
                  })
                }
                className="w-full rounded-md px-2 py-1 text-xs"
                style={{
                  backgroundColor: "var(--color-bg)",
                  border: "1px solid var(--color-border)",
                  color: "var(--color-text)",
                }}
                min={1}
              />
            </label>
            <label className="flex flex-col gap-0.5">
              <span
                className="text-[10px]"
                style={{ color: "var(--color-text-secondary)" }}
              >
                row end
              </span>
              <input
                data-testid="item-row-end"
                type="number"
                value={selectedItem.gridRowEnd}
                onChange={(e) =>
                  updateItem(selectedItem.id, {
                    gridRowEnd: parseInt(e.target.value) || 1,
                  })
                }
                className="w-full rounded-md px-2 py-1 text-xs"
                style={{
                  backgroundColor: "var(--color-bg)",
                  border: "1px solid var(--color-border)",
                  color: "var(--color-text)",
                }}
                min={1}
              />
            </label>
          </div>

          <h4
            className="mt-1 text-[10px] font-semibold uppercase tracking-wider"
            style={{ color: "var(--color-text-muted)" }}
          >
            Self Alignment
          </h4>
          <div className="grid grid-cols-2 gap-2">
            <label className="flex flex-col gap-0.5">
              <span
                className="text-[10px]"
                style={{ color: "var(--color-text-secondary)" }}
              >
                justify-self
              </span>
              <select
                data-testid="item-justify-self"
                value={selectedItem.justifySelf || ""}
                onChange={(e) =>
                  updateItem(selectedItem.id, {
                    justifySelf: (e.target.value || undefined) as
                      AlignmentValue | undefined,
                  })
                }
                className="rounded-md px-2 py-1 text-xs"
                style={{
                  backgroundColor: "var(--color-bg)",
                  border: "1px solid var(--color-border)",
                  color: "var(--color-text)",
                }}
              >
                {SELF_VALUES.map((v) => (
                  <option key={v} value={v}>
                    {v || "—"}
                  </option>
                ))}
              </select>
            </label>
            <label className="flex flex-col gap-0.5">
              <span
                className="text-[10px]"
                style={{ color: "var(--color-text-secondary)" }}
              >
                align-self
              </span>
              <select
                data-testid="item-align-self"
                value={selectedItem.alignSelf || ""}
                onChange={(e) =>
                  updateItem(selectedItem.id, {
                    alignSelf: (e.target.value || undefined) as
                      AlignmentValue | undefined,
                  })
                }
                className="rounded-md px-2 py-1 text-xs"
                style={{
                  backgroundColor: "var(--color-bg)",
                  border: "1px solid var(--color-border)",
                  color: "var(--color-text)",
                }}
              >
                {SELF_VALUES.map((v) => (
                  <option key={v} value={v}>
                    {v || "—"}
                  </option>
                ))}
              </select>
            </label>
          </div>
        </div>
      )}
    </div>
  );
}
