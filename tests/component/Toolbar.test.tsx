import { describe, it, expect, beforeEach } from "vitest";
import { render, screen, act } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import Toolbar from "../../src/components/Toolbar/Toolbar";
import { useGridStore } from "../../src/store/gridStore";

beforeEach(() => {
  act(() => {
    useGridStore.getState().reset();
  });
  useGridStore.temporal.getState().clear();
  document.documentElement.classList.remove("dark");
  localStorage.clear();
});

describe("Toolbar", () => {
  it("renders the GridCraft brand", () => {
    render(<Toolbar />);
    expect(screen.getByText("GridCraft")).toBeInTheDocument();
  });

  describe("reset", () => {
    it("resets the grid to the default 3x3", async () => {
      act(() => {
        useGridStore.getState().addColumn();
        useGridStore.getState().addItem();
      });
      render(<Toolbar />);
      await userEvent.click(screen.getByTestId("reset-btn"));
      expect(useGridStore.getState().columns).toHaveLength(3);
      expect(useGridStore.getState().items).toHaveLength(0);
    });
  });

  describe("presets", () => {
    it("loads the Holy Grail preset from the presets menu", async () => {
      render(<Toolbar />);
      await userEvent.click(screen.getByTestId("presets-btn"));
      await userEvent.click(screen.getByTestId("preset-holy-grail"));
      expect(useGridStore.getState().columns).toHaveLength(3);
      expect(useGridStore.getState().items).toHaveLength(5);
    });

    it("loads the Dashboard preset from the presets menu", async () => {
      render(<Toolbar />);
      await userEvent.click(screen.getByTestId("presets-btn"));
      await userEvent.click(screen.getByTestId("preset-dashboard"));
      expect(useGridStore.getState().columns).toHaveLength(4);
      expect(useGridStore.getState().items.length).toBeGreaterThan(0);
    });

    it("loads the Gallery preset from the presets menu", async () => {
      render(<Toolbar />);
      await userEvent.click(screen.getByTestId("presets-btn"));
      await userEvent.click(screen.getByTestId("preset-gallery"));
      expect(useGridStore.getState().items).toHaveLength(6);
    });

    it("loads a newly added preset (Kanban) from the presets menu", async () => {
      render(<Toolbar />);
      await userEvent.click(screen.getByTestId("presets-btn"));
      await userEvent.click(screen.getByTestId("preset-kanban"));
      expect(useGridStore.getState().columns).toHaveLength(3);
      expect(useGridStore.getState().items).toHaveLength(3);
    });
  });

  describe("undo/redo", () => {
    it("disables undo when there is no history", () => {
      render(<Toolbar />);
      expect(screen.getByTestId("undo-btn")).toBeDisabled();
    });

    it("enables undo after a change", async () => {
      render(<Toolbar />);
      act(() => {
        useGridStore.getState().addColumn();
      });
      expect(screen.getByTestId("undo-btn")).not.toBeDisabled();
    });

    it("undoes the last change when clicked", async () => {
      render(<Toolbar />);
      act(() => {
        useGridStore.getState().addColumn();
      });
      expect(useGridStore.getState().columns).toHaveLength(4);
      await userEvent.click(screen.getByTestId("undo-btn"));
      expect(useGridStore.getState().columns).toHaveLength(3);
    });

    it("disables redo when there is no future", () => {
      render(<Toolbar />);
      expect(screen.getByTestId("redo-btn")).toBeDisabled();
    });

    it("redoes an undone change when clicked", async () => {
      render(<Toolbar />);
      act(() => {
        useGridStore.getState().addColumn();
      });
      await userEvent.click(screen.getByTestId("undo-btn"));
      expect(useGridStore.getState().columns).toHaveLength(3);
      await userEvent.click(screen.getByTestId("redo-btn"));
      expect(useGridStore.getState().columns).toHaveLength(4);
    });
  });

  describe("dark mode toggle", () => {
    it("renders a theme toggle button", () => {
      render(<Toolbar />);
      expect(screen.getByTestId("theme-toggle")).toBeInTheDocument();
    });

    it("adds the dark class when toggled on", async () => {
      render(<Toolbar />);
      await userEvent.click(screen.getByTestId("theme-toggle"));
      expect(document.documentElement.classList.contains("dark")).toBe(true);
    });

    it("removes the dark class when toggled off", async () => {
      document.documentElement.classList.add("dark");
      render(<Toolbar />);
      await userEvent.click(screen.getByTestId("theme-toggle"));
      expect(document.documentElement.classList.contains("dark")).toBe(false);
    });

    it("persists the theme choice to localStorage", async () => {
      render(<Toolbar />);
      await userEvent.click(screen.getByTestId("theme-toggle"));
      expect(localStorage.getItem("gridcraft-theme")).toBe("dark");
    });
  });
});
