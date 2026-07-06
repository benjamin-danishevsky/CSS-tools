export type TrackUnit = 'fr' | 'px' | '%' | 'auto';

export interface TrackDefinition {
  id: string;
  value: number;
  unit: TrackUnit;
}

export type AlignmentValue = 'start' | 'end' | 'center' | 'stretch';
export type ContentAlignmentValue = AlignmentValue | 'space-between' | 'space-around' | 'space-evenly';

export interface GridItem {
  id: string;
  label: string;
  color: string;
  gridColumnStart: number;
  gridColumnEnd: number;
  gridRowStart: number;
  gridRowEnd: number;
  justifySelf?: AlignmentValue;
  alignSelf?: AlignmentValue;
}

export interface GridState {
  columns: TrackDefinition[];
  rows: TrackDefinition[];
  gap: { row: number; column: number };
  justifyItems: AlignmentValue;
  alignItems: AlignmentValue;
  justifyContent: ContentAlignmentValue;
  alignContent: ContentAlignmentValue;
  items: GridItem[];
  selectedItemId: string | null;
}

export interface GridActions {
  addColumn: (track?: Partial<TrackDefinition>) => void;
  removeColumn: (id: string) => void;
  addRow: (track?: Partial<TrackDefinition>) => void;
  removeRow: (id: string) => void;
  updateTrack: (type: 'columns' | 'rows', id: string, update: Partial<TrackDefinition>) => void;
  setGap: (gap: Partial<GridState['gap']>) => void;
  addItem: () => void;
  updateItem: (id: string, update: Partial<GridItem>) => void;
  removeItem: (id: string) => void;
  selectItem: (id: string | null) => void;
  setAlignment: <K extends 'justifyItems' | 'alignItems' | 'justifyContent' | 'alignContent'>(
    property: K,
    value: GridState[K]
  ) => void;
  reset: () => void;
  loadPreset: (preset: 'holy-grail' | 'dashboard' | 'gallery') => void;
}

export type GridStore = GridState & GridActions;
