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
**Date:**
**Prompt:**
**First output:**
**Iterations:**
**Time:**
**Verdict:**

---

## Phase 3: Sidebar controls
**Date:**
**Prompt:**
**First output:**
**Iterations:**
**Time:**
**Verdict:**

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
