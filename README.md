# GridCraft

A visual CSS Grid editor that lets you build layouts by dragging, resizing, and placing items on a grid canvas. The output is clean, copy-pasteable CSS and HTML — no framework lock-in.

## Features

- **Visual grid canvas** — real CSS Grid rendering, not a simulation
- **Live CSS output** — syntax-highlighted, copy-to-clipboard
- **HTML export** — matching `<div>` structure ready to paste
- **Grid template areas** — define named areas visually
- **Presets** — Holy Grail, Dashboard, Gallery layouts in one click
- **Drag interactions** — drag items to place, drag boundaries to resize tracks
- **Undo/redo** — full history with zustand temporal middleware
- **Dark mode** — follows system preference, manual toggle, persisted

## Stack

- React 18 + Vite
- TypeScript (strict)
- Tailwind CSS 3 (app chrome only — output is plain CSS)
- zustand + zundo (state + undo/redo)
- Vitest + React Testing Library + Playwright

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server |
| `npm run build` | Production build |
| `npm run lint` | ESLint |
| `npm run typecheck` | TypeScript type check |
| `npm test` | Vitest unit/component tests |
| `npm run test:e2e` | Playwright E2E tests |

> **First-time E2E setup:** Playwright needs its browser binaries once before `npm run test:e2e` will run. Install them with:
>
> ```bash
> npx playwright install chromium
> ```
>
> The E2E command starts the Vite dev server automatically.

## How It Works

Build a grid layout using the sidebar controls or by dragging on the canvas. The code panel updates live with valid CSS. When you're happy with the layout, copy the CSS (and optionally the HTML) into your project.

The canvas is a real CSS Grid container — what you see is exactly what the output CSS produces.

## Design

Colorful, playful aesthetic inspired by Figma and Framer. Desktop-only (1024px minimum viewport).

## License

MIT
