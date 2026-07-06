import { describe, it, expect, beforeEach } from "vitest";
import { render, screen, act } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import PresetMenu from "../../src/components/Toolbar/PresetMenu";
import { useGridStore } from "../../src/store/gridStore";

const ALL_PRESETS = [
  "holy-grail",
  "app-shell",
  "dashboard",
  "blog",
  "split-screen",
  "hero-landing",
  "pricing",
  "kanban",
  "gallery",
];

beforeEach(() => {
  act(() => {
    useGridStore.getState().reset();
  });
});

describe("PresetMenu", () => {
  it("renders a trigger button that is a menu with aria attributes", () => {
    render(<PresetMenu />);
    const trigger = screen.getByTestId("presets-btn");
    expect(trigger).toHaveAttribute("aria-haspopup", "menu");
    expect(trigger).toHaveAttribute("aria-expanded", "false");
  });

  it("keeps the menu closed by default", () => {
    render(<PresetMenu />);
    expect(screen.queryByTestId("presets-menu")).not.toBeInTheDocument();
    expect(screen.queryByTestId("preset-holy-grail")).not.toBeInTheDocument();
  });

  it("opens the menu with every preset when the trigger is clicked", async () => {
    render(<PresetMenu />);
    await userEvent.click(screen.getByTestId("presets-btn"));
    expect(screen.getByTestId("presets-menu")).toBeInTheDocument();
    ALL_PRESETS.forEach((key) => {
      expect(screen.getByTestId(`preset-${key}`)).toBeInTheDocument();
    });
  });

  it("marks the trigger expanded when open", async () => {
    render(<PresetMenu />);
    await userEvent.click(screen.getByTestId("presets-btn"));
    expect(screen.getByTestId("presets-btn")).toHaveAttribute(
      "aria-expanded",
      "true",
    );
  });

  it("loads a preset and closes the menu when an item is clicked", async () => {
    render(<PresetMenu />);
    await userEvent.click(screen.getByTestId("presets-btn"));
    await userEvent.click(screen.getByTestId("preset-app-shell"));

    // Store reflects the app-shell preset (2 columns).
    expect(useGridStore.getState().columns).toHaveLength(2);
    // Menu closed.
    expect(screen.queryByTestId("presets-menu")).not.toBeInTheDocument();
  });

  it("closes the menu on Escape", async () => {
    render(<PresetMenu />);
    await userEvent.click(screen.getByTestId("presets-btn"));
    expect(screen.getByTestId("presets-menu")).toBeInTheDocument();
    await userEvent.keyboard("{Escape}");
    expect(screen.queryByTestId("presets-menu")).not.toBeInTheDocument();
  });
});
