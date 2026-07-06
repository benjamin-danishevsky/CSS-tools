# GridCraft — Claude Code Build Prompts

Use these prompts in order. Each one is a single Claude Code session prompt.
After each, test the result before moving to the next.

---

## Phase 0: Project setup

```
Initialize a new React + TypeScript + Vite project in this directory. Add Tailwind CSS 3 and zustand as dependencies. Set up the folder structure from CLAUDE.md. Create the type definitions in src/types/grid.ts. Don't build any UI yet — just the skeleton with a "GridCraft" heading rendering in App.tsx.
```

---

## Phase 1: State and CSS generator (no UI yet)

```
Build the zustand store in src/store/gridStore.ts following the GridState type from CLAUDE.md. Include actions: addColumn, removeColumn, addRow, removeRow, updateTrack, setGap, addItem, updateItem, removeItem, setAlignment, reset. Then build src/lib/cssGenerator.ts — a pure function that takes the store state and returns a formatted CSS string matching the output format in CLAUDE.md. Export both.
```

---

## Phase 2: Canvas — the actual grid

```
Build the Canvas component. It must be an actual CSS grid container — the component applies grid-template-columns, grid-template-rows, gap, etc. as inline styles derived from the zustand store. Render grid items as colored divs positioned via grid-column/grid-row. Show grid lines for empty cells using a background overlay or dotted borders. The canvas should fill the main content area (flex-1). Each grid item should show its label and grid position (e.g., "Item 1 — col 1/3, row 1/2").
```

---

## Phase 3: Sidebar controls

```
Build the Sidebar component. It needs these sections:

1. **Tracks** — List columns and rows. Each track shows its value and unit (e.g., "1fr") with inputs to change them. Add/remove track buttons.
2. **Gap** — Two number inputs for row gap and column gap in px.
3. **Container alignment** — Dropdowns for justify-items, align-items, justify-content, align-content. Each shows the 4 valid values.
4. **Items** — List of grid items. Click one to select it. Selected item shows inputs for grid-column-start, grid-column-end, grid-row-start, grid-row-end, justify-self, align-self.
5. **Add item** button at the bottom.

All controls read from and write to the zustand store. No local state for values that belong in the store.
```

---

## Phase 4: Code panel

```
Build the CodePanel component. It renders the CSS string from cssGenerator.ts with basic syntax highlighting (property names in one color, values in another, selectors in a third). Add a "Copy CSS" button that copies to clipboard and briefly shows "Copied!" feedback. The panel should be a fixed-width right sidebar or bottom panel. Use a monospace font. The CSS must update live as the user changes any control.
```

---

## Phase 5: Layout and polish

```
Wire Canvas, Sidebar, and CodePanel into App.tsx as a three-panel layout: Sidebar (left, 280px) | Canvas (center, flex-1) | CodePanel (right, 320px). Add a top toolbar with: a "Reset" button that clears to a default 3x3 grid, and 3 preset buttons ("Holy Grail", "Dashboard", "Gallery") that load pre-built grid configurations. Make sure the canvas area has a subtle background pattern so grid boundaries are visible even with no items. Verify all three panels stay in sync.
```

---

## Phase 6: Drag interactions

```
Add drag-to-place for grid items on the canvas. When the user drags an item, show which grid cells it will occupy. Dropping it updates grid-column and grid-row in the store. Also add drag handles on track boundaries in the canvas — dragging a column or row boundary resizes that track (updating the track definition in the store). Use pointer events, not a drag library. Show a resize cursor on track boundaries.
```

---

## Phase 7: Final pass

```
Review the entire app for these issues and fix them:
1. Can I go from empty to a complete layout using only the UI? Test this flow.
2. Does the copied CSS produce the same layout when pasted into a blank HTML file with matching class names?
3. Are all interactive elements keyboard-accessible with visible focus?
4. Is there any state that can get out of sync between panels?
5. Add a brief tooltip or label on the canvas showing track sizes (e.g., "1fr" above each column).
Clean up any console warnings. Remove unused imports.
```

---

## Tips for your fellowship narrative

After each phase, note in a separate log file:
- What prompt you gave Claude Code
- What it produced on the first try vs. what needed iteration
- Any bugs Claude Code introduced and how you caught them
- Where Claude Code saved time vs. where you'd have been faster manually

That log is your fellowship submission material. The app is the proof; the log is the story.
