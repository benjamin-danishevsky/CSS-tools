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
**Date:**
**Prompt:**
**First output:**
**Iterations:**
**Time:**
**Verdict:**

---

## Phase 5: Layout + polish
**Date:**
**Prompt:**
**First output:**
**Iterations:**
**Time:**
**Verdict:**

---

## Phase 6: Drag interactions
**Date:**
**Prompt:**
**First output:**
**Iterations:**
**Time:**
**Verdict:**

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
