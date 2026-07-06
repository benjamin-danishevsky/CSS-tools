# GridCraft — Build Log

This log documents how I built GridCraft using Claude Code, for my Anthropic Claude Corps Fellowship application.

## Session format

For each phase, record:
- **Prompt given** — exact text sent to Claude Code
- **First output** — did it work? what was right/wrong?
- **Iterations** — follow-up prompts to fix issues
- **Time** — how long the phase took
- **Verdict** — what Claude Code did well, what it missed

---

## Phase 0: Project setup
**Date:** 2026-07-05
**Prompt:** "analyze my current project for instructions on how i want this app to be built. ask me questions for any details you think i need to add" → followed by "start it and don't forget about the build log"

**First output:** Claude Code analyzed the existing CLAUDE.md, BUILD_PROMPTS.md, BUILD_LOG.md, and grid.ts. It identified contradictions (testing approach, drag library, minmax type) and missing details (undo/redo, responsive strategy, dark mode, design direction, presets). It asked structured questions with options and applied the answers back to the spec before starting.

**What was produced:**
- Scaffolded Vite + React 19 + TypeScript project (spec said React 18, Vite gave 19 — kept it)
- Installed all deps: zustand, zundo, Tailwind CSS 3, Vitest, React Testing Library, Playwright
- Created full folder structure matching CLAUDE.md architecture
- Set up CSS custom properties for dark/light theming
- Created placeholder components (Canvas, Sidebar, CodePanel, Toolbar) with barrel exports
- Composed App.tsx with three-panel layout using the components
- Set up dark mode initialization in main.tsx (system preference + localStorage)
- Configured Vitest (jsdom, globals, setup file) and Playwright (chromium, dev server)
- Created 2 smoke tests: type import check + App renders "GridCraft" heading
- Updated CLAUDE.md with all discussed changes (testing, undo/redo, dark mode, grid-template-areas, HTML export, design direction, desktop-only, minmax exclusion)
- Updated grid.ts types (added gridTemplateAreas, undo/redo/area actions)
- Created README.md and .gitignore

**Iterations:** None needed — first pass compiled, typechecked, and all tests passed.

**Verification:**
- `npx tsc --noEmit` — passed (0 errors)
- `npm run build` — passed (192KB JS, 5.5KB CSS gzipped)
- `npm test` — 2/2 tests passed (668ms)

**Time:** ~15 minutes

**Verdict:** Claude Code handled the full project setup in one pass with zero iteration. Strong points: identified spec contradictions proactively, asked good clarifying questions before building, set up testing infrastructure alongside the scaffold (not as an afterthought). The Vite scaffold gave React 19 instead of the spec's React 18 — Claude flagged it and kept 19 since it's backward compatible. Minor note: the spec analysis phase (questions + CLAUDE.md updates) took longer than the actual scaffolding.

---

## Phase 1: State + CSS generator
**Date:** 2026-07-05
**Prompt:** "start phase 1"

**First output (TDD — RED phase):**
Wrote 61 tests across 3 test files before writing any implementation:
- `gridParser.test.ts` (12 tests): parseTrackString and trackToString
- `gridStore.test.ts` (37 tests): initial state, all actions, undo/redo
- `cssGenerator.test.ts` (12 tests): container CSS, items, alignment, template areas

All 61 tests failed as expected (RED confirmed).

**Implementation:**
- `src/lib/gridParser.ts` — parseTrackString/trackToString with regex-based unit parsing
- `src/store/gridStore.ts` — full zustand store with zundo temporal middleware, 3 presets (holy-grail, dashboard, gallery), 10-color palette for items
- `src/lib/cssGenerator.ts` — pure function generating formatted CSS with conditional alignment, split gap, and grid-template-areas support

**Iterations:** 1 minor fix needed. The test `expect(css).not.toContain("gap:")` matched the substring inside `row-gap:` and `column-gap:`. Fixed assertion to use regex `not.toMatch(/^\s+gap:/m)` instead. Code was correct; test assertion was too broad.

**Verification:**
- `npm test` — 63/63 passed (GREEN)
- `npx tsc --noEmit` — 0 errors
- RED → GREEN confirmed for all 61 new tests

**Time:** ~10 minutes

**Verdict:** Strong first pass. The store implementation with zundo undo/redo, 3 presets, and all CRUD actions worked on the first try. The cssGenerator's conditional logic (omit default alignment, split gap when asymmetric, optional template areas) all passed without iteration. The only hiccup was a test assertion mistake, not a code bug. The zundo temporal middleware integration required checking the library's TypeScript types since context7 was unavailable, but the `useGridStore.temporal.getState().undo()` pattern worked correctly.

---

## Phase 2: Canvas
**Date:** 2026-07-05
**Prompt:** "start phase 2" (continued from Phase 1 commit+push)

**First output (TDD — RED phase):**
Wrote 13 component tests for Canvas before implementation:
- Grid container renders with correct data-testid
- Inline styles match store state (grid-template-columns/rows, gap, display:grid)
- Grid items render with correct positioning, labels, position info, and colors
- Empty cell placeholders render (3x3 = 9 cells)
- Clicking an item selects it in the store
- Updated track definitions reflect in container styles

All 13 tests failed (RED confirmed).

**Implementation:**
- `Canvas.tsx` — real CSS grid container driven entirely by zustand store:
  - Renders `data-testid="grid-container"` div with inline grid styles
  - Empty cell overlay (dashed borders) for visual grid lines
  - Grid items as colored divs with label + position text
  - Selected item gets accent ring + shadow
  - Click-to-select wired to store's selectItem action
  - Uses `trackToString` from gridParser for track definitions

**Iterations:** 0 — all 13 tests passed on first implementation.

**Verification:**
- `npx vitest run tests/component/Canvas.test.tsx` — 13/13 passed
- Full suite: 76/76 passed (no regressions)
- `npx tsc --noEmit` — 0 errors

**Time:** ~5 minutes

**Verdict:** Cleanest phase so far. Zero iteration needed. The component tests were well-matched to the implementation — every test corresponded directly to a rendered element or behavior. The key design decision was layering empty grid cells behind the items so grid lines are always visible. Using zustand selectors for each state slice keeps the component reactive and efficient.

---

## Phase 3: Sidebar controls
**Date:** 2026-07-05
**Prompt:** "Commit the changes with a detailed commit message and then push it to the repo, then start phase 3"

**First output (TDD — RED phase):**
Wrote 25 component tests for Sidebar before implementation:
- Tracks: column/row track lists render correct count, add/remove buttons work, value/unit inputs update store
- Gap: row/column gap inputs render current values and update store
- Alignment: 4 dropdowns (justifyItems, alignItems, justifyContent, alignContent) render and update store
- Items: add button, item list rendering, click-to-select, edit controls for grid position, remove button

All 25 tests failed (RED confirmed).

**Implementation:**
Split into 4 focused sub-components for maintainability:
- `TrackList.tsx` — reusable for both columns and rows. Number input + unit select + remove button per track, add button at top
- `GapControls.tsx` — row and column gap number inputs with px labels
- `AlignmentControls.tsx` — 4 dropdowns in 2x2 grid. Items dropdowns get 4 values, content dropdowns get 7 (including space-between/around/evenly)
- `ItemList.tsx` — item list with color swatch + label, click-to-select, remove button. Selected item shows position editor (col/row start/end) and self-alignment dropdowns
- `Sidebar.tsx` — composes all 4 sub-components with consistent spacing

**Iterations:** 1 test fix needed. `userEvent.clear()` + `userEvent.type("3")` on a controlled number input caused a re-render after clear (fallback value 1), then "3" appended to make "13". Fixed by using `fireEvent.change` with target value directly. Code was correct; test interaction was fighting React's controlled input behavior.

**Verification:**
- `npx vitest run tests/component/Sidebar.test.tsx` — 25/25 passed
- Full suite: 101/101 passed (no regressions)
- `npx tsc --noEmit` — 0 errors

**Time:** ~10 minutes

**Verdict:** Good architectural decision to split into 4 sub-components — keeps each file under 100 lines and makes the sidebar easy to rearrange later. The one test failure was a common React testing pitfall with controlled number inputs (userEvent.clear triggers intermediate re-renders). The alignment controls needed type gymnastics for the generic setAlignment action, but TypeScript caught the mismatch immediately. All store wiring worked first try.

---

## Phase 4: Code panel
**Date:** 2026-07-05
**Prompt:** "continue with my project with phase 4" (first phase on Opus 4.8)

**First output (TDD — RED phase):**
Wrote 18 tests before implementation:
- `htmlGenerator.test.ts` (8 unit tests): container wrapper, one div per item, sequential class numbering matching the CSS, label as text content, 2-space indentation, empty container, HTML escaping (script tags and ampersands)
- `CodePanel.test.tsx` (10 component tests): renders CSS, live updates on store change, syntax highlighting tokens present, monospace font, copy button, clipboard copy, "Copied!" feedback, CSS/HTML tab switching, HTML copy

All 18 tests failed (RED confirmed).

**Implementation:**
- `htmlGenerator.ts` — pure gridState → HTML string with escaped labels and class names matching cssGenerator's numbering
- `highlight.tsx` — CSS tokenizer emitting themed spans (selector/property/value/punctuation) with `data-token` attributes; handles selectors, declarations, closing braces, and grid-template-areas string rows; reconstructs to identical text content
- `CodePanel.tsx` — tabbed CSS/HTML panel subscribing to the whole store for live updates, copy-to-clipboard with transient "Copied!" feedback, monospace output
- `index.css` — added syntax highlight color variables for both light and dark themes

**Iterations:** All 18 tests passed on first implementation — BUT `npm run build` then failed with a circular type-inference error (TS7022/7023) in gridStore.ts, cascading into "implicit any" errors across the Sidebar selectors.

Root cause & catch: the store's `undo`/`redo` referenced `useGridStore.temporal` *inside its own initializer*, creating a circular dependency on the store's own inferred type. This had existed since Phase 1 but went undetected because `npm run typecheck` ran `tsc --noEmit` against the root solution-style tsconfig (`files: []` + references), which checks zero files. Only `tsc -b` (used by `npm run build`) actually type-checks the app.

Fixes applied:
1. Broke the circularity with a `let temporalStore` holder carrying an explicit minimal type annotation (`{ getState: () => { undo, redo } }`), assigned `useGridStore.temporal` after store creation. The initializer now references the pre-typed holder, not the store's own type.
2. Improved `partialize` to track only grid data (not transient `selectedItemId` or action fns) so selecting an item is not an undo step.
3. Changed the `typecheck` script from `tsc --noEmit` to `tsc -b` so this class of error is caught going forward.

**Verification:**
- `npm test` — 119/119 passed (18 new)
- `npm run typecheck` (now real `tsc -b`) — 0 errors
- `npm run build` — clean (214 KB JS)
- Live Playwright visual check skipped per standing "never start web server" rule; build + component tests cover it.

**Time:** ~20 minutes (incl. debugging the build regression)

**Verdict:** The feature code (generator, highlighter, tabbed panel) was correct first try — all 18 tests green immediately. The valuable catch was a *tooling* gap: the mandated `typecheck` command was silently checking nothing, hiding a real circular-type bug since Phase 1. Running the full `build` (not just the shortcut typecheck) surfaced it. Lesson logged: `tsc --noEmit` against a Vite solution-style root config is a no-op — always type-check with `tsc -b`. Fixed the script so every future phase gets genuine coverage.

---

## Phase 5: Layout + polish
**Date:** 2026-07-05
**Prompt:** "commit with a detailed commit message and push, then go to the next phase"

**Context:** The three-panel layout (Sidebar | Canvas | CodePanel) was already composed in App.tsx during Phases 0/2, so Phase 5's real work was building out the Toolbar (previously a brand-only placeholder) plus the canvas background pattern.

**First output (TDD — RED phase):**
Wrote 14 component tests for Toolbar before implementation:
- Brand renders
- Reset button clears to default 3x3 (0 items)
- 3 preset buttons load correct configs (holy-grail: 3 cols/5 items, dashboard: 4 cols, gallery: 6 items)
- Undo disabled with no history, enabled after a change, reverts on click
- Redo disabled with no future, re-applies on click
- Dark mode toggle: renders, adds/removes `dark` class, persists to localStorage

13 failed, 1 passed (the brand text existed in the placeholder) — RED confirmed.

**Implementation:**
- `useTheme.ts` — hook managing the `dark` class on documentElement + localStorage persistence, initialized from current DOM state
- `Toolbar.tsx` — full toolbar: brand, preset buttons (wired to loadPreset), undo/redo buttons with reactive disabled state via `useStore(useGridStore.temporal, ...)` reading pastStates/futureStates length, Reset, and dark-mode toggle. Colorful/playful styling per the design direction (accent-tinted preset chips, icon buttons).
- `Canvas.tsx` — added a subtle radial-gradient dot pattern to the canvas background so grid boundaries are visible even with no items.

**Iterations:** 0 — all 14 tests passed on first implementation.

**Verification:**
- `npx vitest run tests/component/Toolbar.test.tsx` — 14/14 passed
- Full suite: 133/133 passed (no regressions)
- `npm run typecheck` (tsc -b) — 0 errors
- `npm run build` — clean (217 KB JS)
- Live Playwright visual check skipped per standing "never start web server" rule.

**Time:** ~10 minutes

**Verdict:** Smooth phase, zero iteration. The reactive undo/redo disabled-state was the interesting part — it subscribes directly to zundo's temporal store via zustand's `useStore` hook to read pastStates/futureStates length, which "just worked" now that the store's types were fixed in Phase 4. Keeping the theme logic in a dedicated `useTheme` hook kept the Toolbar declarative and made the dark-mode behavior trivially testable via jsdom's classList + localStorage. The app is now fully interactive end-to-end (all panels driven by the single store).

---

## Phase 6: Drag interactions
**Date:** 2026-07-05
**Prompt:** "commit with a detailed commit message and push, then go to the next phase"

**The core challenge:** drag interactions depend on layout geometry (getBoundingClientRect, clientX/Y), but jsdom computes no layout — every rect is zero. Testing drag naively would mean either untestable code or brittle over-mocking.

**Strategy:** push all real geometry into pure functions (`dragMath.ts`), keep the DOM wiring thin, and make boundary-resize *delta-based* (new value = f(startValue, clientX − startX)) so it needs no layout at all and is directly testable.

**First output (TDD — RED phase):**
- `dragMath.test.ts` (15 unit tests): findCellAtPoint (hit, miss, exclusive edges), clampStart (in-range, span overflow, below 1, beyond count, full-span), resizeTrackValue (px add+clamp, fr scaling+clamp, % container-mapping+clamp, auto no-op)
- `CanvasDrag.test.tsx` (8 component tests): column/row resize handles render with correct count and resize cursors; dragging an fr column boundary +50px → 2fr; dragging a row boundary +100px → 3fr; item drag-to-place moves item to the dropped cell (with mocked cell rects); drag preview appears mid-drag

RED confirmed (dragMath failed at import; 8 CanvasDrag tests failed).

**Implementation:**
- `dragMath.ts` — pure `findCellAtPoint` / `clampStart` / `resizeTrackValue` (unit-aware: px adds pixels, fr uses ~50px per 1fr, % maps to container fraction, auto unchanged)
- `Canvas.tsx` — pointer-event wiring (no drag library):
  - Item drag: onPointerDown arms a drag (records item + span in a ref), onPointerMove finds the cell under the cursor via the rendered cells' rects and sets a clamped preview, onPointerUp commits new grid-column/row. Drag state kept in refs (not state) to avoid stale closures; preview kept in state for rendering.
  - Track resize: handles rendered as grid children pinned to each track's trailing edge (justify-self/align-self: end) with col-resize/row-resize cursors. Delta-based value update via resizeTrackValue.
  - setPointerCapture/releasePointerCapture guarded (jsdom lacks them).
  - Cells tagged with data-row/data-col so the pointer-to-cell lookup can reconstruct CellRects.
  - Dashed accent preview overlay (data-testid="drag-preview") shows target cells during an item drag.

**Iterations:** 0 — all 23 new tests passed on first implementation, and the 13 pre-existing Canvas tests stayed green (the added onPointerDown selection path is compatible with the existing click-to-select test).

**Verification:**
- `npx vitest run` (drag + existing Canvas) — 21/21
- Full suite: 156/156 passed
- `npm run typecheck` (tsc -b) — 0 errors
- `npm run build` — clean (220 KB JS)
- Live Playwright drag verification skipped per standing "never start web server" rule; pure-function coverage + mocked-rect component tests stand in.

**Time:** ~20 minutes

**Verdict:** The "extract the geometry, keep the wiring thin" approach paid off exactly as intended — the tricky logic (cell hit-testing, span clamping, unit-aware resizing) got exhaustive jsdom-independent coverage, and the delta-based resize made boundary dragging testable with plain fireEvent + clientX. The only real subtlety was avoiding stale-closure bugs in the pointer handlers, solved by holding drag state in refs and reading the commit target from the ref (not React state) on pointer-up. Zero iteration despite this being the most interaction-heavy phase.

---

## Phase 7: Final pass
**Date:**
**Prompt:**
**First output:**
**Iterations:**
**Time:**
**Verdict:**

---

## Summary

**Total build time:**
**Phases that worked first-try:**
**Phases that needed most iteration:**
**Biggest surprise:**
**Where I intervened manually:**
**What I'd do differently:**
