# GridCraft — Visual CSS Grid Editor

## What this is
A single-page React app that lets users visually build CSS Grid layouts by dragging, resizing, and placing items on a grid canvas. The output is copyable CSS code. No backend. No auth. Ship as static files.

## Stack
- React 18 + Vite
- TypeScript (strict mode)
- Tailwind CSS 3 for app chrome only (NOT for the grid output — output must be plain CSS)
- zustand for state (single store, no prop drilling)
- zundo (zustand temporal middleware) for undo/redo
- Pointer events for drag interactions (no drag library)
- CSS custom properties for dark/light theming
- Vitest + React Testing Library for unit/component tests
- Playwright for E2E tests

## Architecture

```
src/
  components/
    Canvas/          # The visual grid. Renders grid lines, items, drag handles.
    Sidebar/         # Property controls: template-rows, template-columns, gap, alignment.
    CodePanel/       # Live CSS output with syntax highlighting and copy button.
    Toolbar/         # Presets, reset, undo/redo, dark mode toggle, export buttons.
  store/
    gridStore.ts     # Single zustand store. All grid state lives here.
  lib/
    cssGenerator.ts  # Pure function: gridState → CSS string. No side effects.
    htmlGenerator.ts # Pure function: gridState → HTML string with matching class names.
    gridParser.ts    # Parse track definitions (e.g., "1fr 200px auto") into typed arrays.
  types/
    grid.ts          # GridState, GridItem, TrackDefinition, AlignmentValue types.
  App.tsx
  main.tsx
```

## Core data model

```ts
type TrackUnit = 'fr' | 'px' | '%' | 'auto';
type TrackDefinition = { id: string; value: number; unit: TrackUnit };

interface GridItem {
  id: string;
  label: string;
  gridColumnStart: number;
  gridColumnEnd: number;
  gridRowStart: number;
  gridRowEnd: number;
  justifySelf?: AlignmentValue;
  alignSelf?: AlignmentValue;
}

type AlignmentValue = 'start' | 'end' | 'center' | 'stretch';
type ContentAlignmentValue = AlignmentValue | 'space-between' | 'space-around' | 'space-evenly';

interface GridState {
  columns: TrackDefinition[];
  rows: TrackDefinition[];
  gap: { row: number; column: number };
  justifyItems: AlignmentValue;
  alignItems: AlignmentValue;
  justifyContent: ContentAlignmentValue;
  alignContent: ContentAlignmentValue;
  items: GridItem[];
  selectedItemId: string | null;
  gridTemplateAreas: string[][] | null; // null = not using named areas
}
```

## Rules

- **CSS output must be valid, copy-pasteable CSS.** No Tailwind classes in output. No framework-specific syntax.
- **Canvas must show real CSS Grid rendering.** The canvas IS a CSS grid container — don't fake it with absolute positioning.
- **Grid lines must be visible.** Use dashed borders or background tricks to show track boundaries even when cells are empty.
- **One source of truth.** The zustand store drives both the canvas and the code panel. Never let them diverge.
- **No premature optimization.** Ship working features before polishing animations.
- **Accessibility baseline.** All controls keyboard-accessible. Visible focus rings. Buttons have labels.
- **Desktop-only.** Minimum viewport 1024px. No responsive breakpoints needed.
- **Pointer events only.** No drag libraries. Use native pointer events for all drag interactions.
- **Dark mode via CSS custom properties.** Default to `prefers-color-scheme`. Manual toggle in toolbar. Persist preference in `localStorage`.
- **Colorful/playful design.** Figma/Framer-inspired aesthetic — vibrant accent colors, rounded corners, visual personality. Not a gray dev-tool look.

## CSS output format

```css
.container {
  display: grid;
  grid-template-columns: 1fr 2fr 1fr;
  grid-template-rows: auto 1fr auto;
  grid-template-areas:
    "header header header"
    "sidebar main main"
    "footer footer footer";
  gap: 16px;
  justify-items: stretch;
  align-items: stretch;
}

.item-1 {
  grid-column: 1 / 3;
  grid-row: 1 / 2;
  grid-area: header; /* only when named areas are used */
}
```

## HTML export format

```html
<div class="container">
  <div class="item-1">Item 1</div>
  <div class="item-2">Item 2</div>
</div>
```

## Commands
- `npm run dev` — start dev server
- `npm run build` — production build
- `npm run lint` — eslint
- `npm run typecheck` — tsc --noEmit
- `npm test` — run Vitest unit/component tests
- `npm run test:e2e` — run Playwright E2E tests

## Testing approach
Full TDD with Vitest + React Testing Library + Playwright.

**Unit tests** (Vitest):
- `cssGenerator.ts` — gridState → correct CSS string
- `htmlGenerator.ts` — gridState → correct HTML string
- `gridParser.ts` — parse track strings into typed arrays
- `gridStore.ts` — all actions produce correct state transitions, undo/redo works

**Component tests** (Vitest + RTL):
- Sidebar controls update the store
- CodePanel reflects store changes
- Canvas renders correct grid styles

**E2E tests** (Playwright):
- User builds a layout from scratch using only the UI
- Preset buttons load correct configurations
- Copy CSS button works
- Export HTML button works
- Dark mode toggle works and persists
- Undo/redo buttons work

**Validation criteria** (still applies):
1. Does the canvas match the CSS output when pasted into a blank HTML file?
2. Do all controls update both canvas and code panel?
3. Can the user go from zero to a complete layout without touching code?

## Do not
- Add a backend or database
- Use CSS-in-JS (styled-components, emotion). Tailwind for app UI, inline styles for the grid canvas.
- Over-engineer: no router, no i18n, no analytics
- Add responsive breakpoints — this is a desktop-only tool
- Support `minmax()` track definitions (out of scope — the two-argument shape doesn't fit the current data model)
- Add features not listed here without asking
