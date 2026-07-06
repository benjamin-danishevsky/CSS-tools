# GridCraft — Visual CSS Grid Editor

## What this is
A single-page React app that lets users visually build CSS Grid layouts by dragging, resizing, and placing items on a grid canvas. The output is copyable CSS code. No backend. No auth. Ship as static files.

## Stack
- React 18 + Vite
- TypeScript (strict mode)
- Tailwind CSS 3 for app chrome only (NOT for the grid output — output must be plain CSS)
- zustand for state (single store, no prop drilling)
- react-dnd or pointer events for drag interactions

## Architecture

```
src/
  components/
    Canvas/          # The visual grid. Renders grid lines, items, drag handles.
    Sidebar/         # Property controls: template-rows, template-columns, gap, alignment.
    CodePanel/       # Live CSS output with syntax highlighting and copy button.
    Toolbar/         # Presets, reset, undo/redo buttons.
  store/
    gridStore.ts     # Single zustand store. All grid state lives here.
  lib/
    cssGenerator.ts  # Pure function: gridState → CSS string. No side effects.
    gridParser.ts    # Parse track definitions (e.g., "1fr 200px auto") into typed arrays.
  types/
    grid.ts          # GridState, GridItem, TrackDefinition, AlignmentValue types.
  App.tsx
  main.tsx
```

## Core data model

```ts
type TrackUnit = 'fr' | 'px' | '%' | 'auto' | 'minmax';
type TrackDefinition = { value: number; unit: TrackUnit };

interface GridItem {
  id: string;
  label: string;
  gridColumnStart: number;
  gridColumnEnd: number;
  gridRowStart: number;
  gridRowEnd: number;
  justifySelf?: 'start' | 'end' | 'center' | 'stretch';
  alignSelf?: 'start' | 'end' | 'center' | 'stretch';
}

interface GridState {
  columns: TrackDefinition[];
  rows: TrackDefinition[];
  gap: { row: number; column: number };
  justifyItems: string;
  alignItems: string;
  justifyContent: string;
  alignContent: string;
  items: GridItem[];
}
```

## Rules

- **CSS output must be valid, copy-pasteable CSS.** No Tailwind classes in output. No framework-specific syntax.
- **Canvas must show real CSS Grid rendering.** The canvas IS a CSS grid container — don't fake it with absolute positioning.
- **Grid lines must be visible.** Use dashed borders or background tricks to show track boundaries even when cells are empty.
- **One source of truth.** The zustand store drives both the canvas and the code panel. Never let them diverge.
- **No premature optimization.** Ship working features before polishing animations.
- **Accessibility baseline.** All controls keyboard-accessible. Visible focus rings. Buttons have labels.

## CSS output format

```css
.container {
  display: grid;
  grid-template-columns: 1fr 2fr 1fr;
  grid-template-rows: auto 1fr auto;
  gap: 16px;
  justify-items: stretch;
  align-items: stretch;
}

.item-1 {
  grid-column: 1 / 3;
  grid-row: 1 / 2;
}
```

## Commands
- `npm run dev` — start dev server
- `npm run build` — production build
- `npm run lint` — eslint
- `npm run typecheck` — tsc --noEmit

## Testing approach
No test framework. Validate by:
1. Does the canvas match the CSS output when pasted into a blank HTML file?
2. Do all controls update both canvas and code panel?
3. Can the user go from zero to a complete layout without touching code?

## Do not
- Add a backend or database
- Use CSS-in-JS (styled-components, emotion). Tailwind for app UI, inline styles for the grid canvas.
- Over-engineer: no router, no i18n, no analytics
- Add features not listed here without asking
