import { create } from "zustand";
import { temporal } from "zundo";
import type {
  GridState,
  GridStore,
  TrackDefinition,
  GridItem,
} from "../types/grid";

let trackCounter = 0;
let itemCounter = 0;

function makeTrackId(): string {
  return `track-${++trackCounter}`;
}

function makeItemId(): string {
  return `item-${++itemCounter}`;
}

const ITEM_COLORS = [
  "#6c5ce7",
  "#00b894",
  "#e17055",
  "#0984e3",
  "#fdcb6e",
  "#e84393",
  "#00cec9",
  "#d63031",
  "#a29bfe",
  "#55efc4",
];

function makeDefaultColumns(): TrackDefinition[] {
  return [
    { id: makeTrackId(), value: 1, unit: "fr" },
    { id: makeTrackId(), value: 1, unit: "fr" },
    { id: makeTrackId(), value: 1, unit: "fr" },
  ];
}

function makeDefaultRows(): TrackDefinition[] {
  return [
    { id: makeTrackId(), value: 1, unit: "fr" },
    { id: makeTrackId(), value: 1, unit: "fr" },
    { id: makeTrackId(), value: 1, unit: "fr" },
  ];
}

function makeInitialState(): GridState {
  return {
    columns: makeDefaultColumns(),
    rows: makeDefaultRows(),
    gap: { row: 8, column: 8 },
    justifyItems: "stretch",
    alignItems: "stretch",
    justifyContent: "stretch",
    alignContent: "stretch",
    items: [],
    selectedItemId: null,
    gridTemplateAreas: null,
  };
}

function makeHolyGrailPreset(): Partial<GridState> {
  return {
    columns: [
      { id: makeTrackId(), value: 200, unit: "px" },
      { id: makeTrackId(), value: 1, unit: "fr" },
      { id: makeTrackId(), value: 200, unit: "px" },
    ],
    rows: [
      { id: makeTrackId(), value: 0, unit: "auto" },
      { id: makeTrackId(), value: 1, unit: "fr" },
      { id: makeTrackId(), value: 0, unit: "auto" },
    ],
    gap: { row: 0, column: 0 },
    items: [
      {
        id: makeItemId(),
        label: "Header",
        color: ITEM_COLORS[0],
        gridColumnStart: 1,
        gridColumnEnd: 4,
        gridRowStart: 1,
        gridRowEnd: 2,
      },
      {
        id: makeItemId(),
        label: "Nav",
        color: ITEM_COLORS[1],
        gridColumnStart: 1,
        gridColumnEnd: 2,
        gridRowStart: 2,
        gridRowEnd: 3,
      },
      {
        id: makeItemId(),
        label: "Main",
        color: ITEM_COLORS[2],
        gridColumnStart: 2,
        gridColumnEnd: 3,
        gridRowStart: 2,
        gridRowEnd: 3,
      },
      {
        id: makeItemId(),
        label: "Aside",
        color: ITEM_COLORS[3],
        gridColumnStart: 3,
        gridColumnEnd: 4,
        gridRowStart: 2,
        gridRowEnd: 3,
      },
      {
        id: makeItemId(),
        label: "Footer",
        color: ITEM_COLORS[4],
        gridColumnStart: 1,
        gridColumnEnd: 4,
        gridRowStart: 3,
        gridRowEnd: 4,
      },
    ],
    gridTemplateAreas: [
      ["header", "header", "header"],
      ["nav", "main", "aside"],
      ["footer", "footer", "footer"],
    ],
    selectedItemId: null,
  };
}

function makeDashboardPreset(): Partial<GridState> {
  return {
    columns: [
      { id: makeTrackId(), value: 1, unit: "fr" },
      { id: makeTrackId(), value: 1, unit: "fr" },
      { id: makeTrackId(), value: 1, unit: "fr" },
      { id: makeTrackId(), value: 1, unit: "fr" },
    ],
    rows: [
      { id: makeTrackId(), value: 0, unit: "auto" },
      { id: makeTrackId(), value: 1, unit: "fr" },
      { id: makeTrackId(), value: 1, unit: "fr" },
    ],
    gap: { row: 16, column: 16 },
    items: [
      {
        id: makeItemId(),
        label: "Stats",
        color: ITEM_COLORS[0],
        gridColumnStart: 1,
        gridColumnEnd: 5,
        gridRowStart: 1,
        gridRowEnd: 2,
      },
      {
        id: makeItemId(),
        label: "Chart",
        color: ITEM_COLORS[1],
        gridColumnStart: 1,
        gridColumnEnd: 3,
        gridRowStart: 2,
        gridRowEnd: 3,
      },
      {
        id: makeItemId(),
        label: "Table",
        color: ITEM_COLORS[2],
        gridColumnStart: 3,
        gridColumnEnd: 5,
        gridRowStart: 2,
        gridRowEnd: 3,
      },
      {
        id: makeItemId(),
        label: "Activity",
        color: ITEM_COLORS[3],
        gridColumnStart: 1,
        gridColumnEnd: 3,
        gridRowStart: 3,
        gridRowEnd: 4,
      },
      {
        id: makeItemId(),
        label: "Sidebar",
        color: ITEM_COLORS[4],
        gridColumnStart: 3,
        gridColumnEnd: 5,
        gridRowStart: 3,
        gridRowEnd: 4,
      },
    ],
    selectedItemId: null,
    gridTemplateAreas: null,
  };
}

function makeGalleryPreset(): Partial<GridState> {
  return {
    columns: [
      { id: makeTrackId(), value: 1, unit: "fr" },
      { id: makeTrackId(), value: 1, unit: "fr" },
      { id: makeTrackId(), value: 1, unit: "fr" },
    ],
    rows: [
      { id: makeTrackId(), value: 1, unit: "fr" },
      { id: makeTrackId(), value: 1, unit: "fr" },
      { id: makeTrackId(), value: 1, unit: "fr" },
    ],
    gap: { row: 8, column: 8 },
    items: [
      {
        id: makeItemId(),
        label: "Featured",
        color: ITEM_COLORS[0],
        gridColumnStart: 1,
        gridColumnEnd: 3,
        gridRowStart: 1,
        gridRowEnd: 3,
      },
      {
        id: makeItemId(),
        label: "Thumb 1",
        color: ITEM_COLORS[1],
        gridColumnStart: 3,
        gridColumnEnd: 4,
        gridRowStart: 1,
        gridRowEnd: 2,
      },
      {
        id: makeItemId(),
        label: "Thumb 2",
        color: ITEM_COLORS[2],
        gridColumnStart: 3,
        gridColumnEnd: 4,
        gridRowStart: 2,
        gridRowEnd: 3,
      },
      {
        id: makeItemId(),
        label: "Thumb 3",
        color: ITEM_COLORS[3],
        gridColumnStart: 1,
        gridColumnEnd: 2,
        gridRowStart: 3,
        gridRowEnd: 4,
      },
      {
        id: makeItemId(),
        label: "Thumb 4",
        color: ITEM_COLORS[4],
        gridColumnStart: 2,
        gridColumnEnd: 3,
        gridRowStart: 3,
        gridRowEnd: 4,
      },
      {
        id: makeItemId(),
        label: "Thumb 5",
        color: ITEM_COLORS[5],
        gridColumnStart: 3,
        gridColumnEnd: 4,
        gridRowStart: 3,
        gridRowEnd: 4,
      },
    ],
    selectedItemId: null,
    gridTemplateAreas: null,
  };
}

const PRESETS = {
  "holy-grail": makeHolyGrailPreset,
  dashboard: makeDashboardPreset,
  gallery: makeGalleryPreset,
} as const;

export const useGridStore = create<GridStore>()(
  temporal(
    (set) => ({
      ...makeInitialState(),

      addColumn: (track) =>
        set((state) => ({
          columns: [
            ...state.columns,
            {
              id: makeTrackId(),
              value: track?.value ?? 1,
              unit: track?.unit ?? "fr",
            },
          ],
        })),

      removeColumn: (id) =>
        set((state) => ({
          columns: state.columns.filter((c) => c.id !== id),
        })),

      addRow: (track) =>
        set((state) => ({
          rows: [
            ...state.rows,
            {
              id: makeTrackId(),
              value: track?.value ?? 1,
              unit: track?.unit ?? "fr",
            },
          ],
        })),

      removeRow: (id) =>
        set((state) => ({
          rows: state.rows.filter((r) => r.id !== id),
        })),

      updateTrack: (type, id, update) =>
        set((state) => ({
          [type]: state[type].map((t: TrackDefinition) =>
            t.id === id ? { ...t, ...update } : t,
          ),
        })),

      setGap: (gap) =>
        set((state) => ({
          gap: { ...state.gap, ...gap },
        })),

      addItem: () =>
        set((state) => {
          const num = state.items.length + 1;
          const newItem: GridItem = {
            id: makeItemId(),
            label: `Item ${num}`,
            color: ITEM_COLORS[(num - 1) % ITEM_COLORS.length],
            gridColumnStart: 1,
            gridColumnEnd: 2,
            gridRowStart: 1,
            gridRowEnd: 2,
          };
          return { items: [...state.items, newItem] };
        }),

      updateItem: (id, update) =>
        set((state) => ({
          items: state.items.map((item) =>
            item.id === id ? { ...item, ...update } : item,
          ),
        })),

      removeItem: (id) =>
        set((state) => ({
          items: state.items.filter((item) => item.id !== id),
          selectedItemId:
            state.selectedItemId === id ? null : state.selectedItemId,
        })),

      selectItem: (id) => set({ selectedItemId: id }),

      setAlignment: (property, value) => set({ [property]: value }),

      setGridTemplateAreas: (areas) => set({ gridTemplateAreas: areas }),

      updateAreaName: (row, col, name) =>
        set((state) => {
          if (!state.gridTemplateAreas) return state;
          const newAreas = state.gridTemplateAreas.map((r) => [...r]);
          newAreas[row][col] = name;
          return { gridTemplateAreas: newAreas };
        }),

      reset: () => set(makeInitialState()),

      loadPreset: (preset) => {
        const factory = PRESETS[preset];
        set({ ...makeInitialState(), ...factory() });
      },

      undo: () => useGridStore.temporal.getState().undo(),
      redo: () => useGridStore.temporal.getState().redo(),
    }),
    {
      limit: 50,
      partialize: (state) => {
        const { ...rest } = state;
        return rest;
      },
    },
  ),
);
