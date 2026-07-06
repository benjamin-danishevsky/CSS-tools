import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen, act } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import CodePanel from "../../src/components/CodePanel/CodePanel";
import { useGridStore } from "../../src/store/gridStore";

let writeText: ReturnType<typeof vi.fn>;

beforeEach(() => {
  useGridStore.getState().reset();
  writeText = vi.fn().mockResolvedValue(undefined);
  Object.defineProperty(navigator, "clipboard", {
    value: { writeText },
    configurable: true,
  });
});

describe("CodePanel", () => {
  it("renders the generated CSS", () => {
    render(<CodePanel />);
    const output = screen.getByTestId("code-output");
    expect(output.textContent).toContain("display: grid;");
    expect(output.textContent).toContain("grid-template-columns: 1fr 1fr 1fr;");
  });

  it("updates the CSS live when the store changes", () => {
    render(<CodePanel />);
    const output = screen.getByTestId("code-output");
    expect(output.textContent).toContain("grid-template-columns: 1fr 1fr 1fr;");

    act(() => {
      useGridStore.getState().addColumn();
    });

    expect(output.textContent).toContain(
      "grid-template-columns: 1fr 1fr 1fr 1fr;",
    );
  });

  it("applies syntax highlighting tokens", () => {
    const { container } = render(<CodePanel />);
    expect(
      container.querySelector('[data-token="selector"]'),
    ).toBeInTheDocument();
    expect(
      container.querySelector('[data-token="property"]'),
    ).toBeInTheDocument();
    expect(container.querySelector('[data-token="value"]')).toBeInTheDocument();
  });

  it("uses a monospace font for the code output", () => {
    render(<CodePanel />);
    const output = screen.getByTestId("code-output") as HTMLElement;
    expect(output.style.fontFamily).toMatch(/mono/i);
  });

  it("renders a copy button", () => {
    render(<CodePanel />);
    expect(screen.getByTestId("copy-btn")).toBeInTheDocument();
  });

  it("copies the CSS to the clipboard when copy is clicked", async () => {
    render(<CodePanel />);
    await userEvent.click(screen.getByTestId("copy-btn"));
    expect(writeText).toHaveBeenCalledWith(
      expect.stringContaining("display: grid;"),
    );
  });

  it("shows Copied! feedback after copying", async () => {
    render(<CodePanel />);
    await userEvent.click(screen.getByTestId("copy-btn"));
    expect(await screen.findByText(/copied/i)).toBeInTheDocument();
  });

  it("defaults to the CSS tab", () => {
    render(<CodePanel />);
    const output = screen.getByTestId("code-output");
    expect(output.textContent).toContain("display: grid;");
    expect(output.textContent).not.toContain('<div class="container">');
  });

  it("switches to the HTML tab and shows HTML output", async () => {
    useGridStore.getState().addItem();
    render(<CodePanel />);
    await userEvent.click(screen.getByTestId("tab-html"));
    const output = screen.getByTestId("code-output");
    expect(output.textContent).toContain('<div class="container">');
    expect(output.textContent).toContain('<div class="item-1">Item 1</div>');
  });

  it("copies the HTML when on the HTML tab", async () => {
    useGridStore.getState().addItem();
    render(<CodePanel />);
    await userEvent.click(screen.getByTestId("tab-html"));
    await userEvent.click(screen.getByTestId("copy-btn"));
    expect(writeText).toHaveBeenCalledWith(
      expect.stringContaining('<div class="container">'),
    );
  });

  it("switches to the Explain tab and shows plain-English sentences", async () => {
    render(<CodePanel />);
    await userEvent.click(screen.getByTestId("tab-explain"));
    const output = screen.getByTestId("code-output");
    expect(output.textContent?.toLowerCase()).toContain("columns");
    // Prose, not code:
    expect(output.textContent).not.toContain("display: grid;");
  });

  it("updates the explanation live when the store changes", async () => {
    render(<CodePanel />);
    await userEvent.click(screen.getByTestId("tab-explain"));
    const output = screen.getByTestId("code-output");
    expect(output.textContent).toContain("3 equal columns");

    act(() => {
      useGridStore.getState().addColumn();
    });

    expect(output.textContent).toContain("4 equal columns");
  });

  it("hides the copy button on the Explain tab", async () => {
    render(<CodePanel />);
    expect(screen.getByTestId("copy-btn")).toBeInTheDocument();
    await userEvent.click(screen.getByTestId("tab-explain"));
    expect(screen.queryByTestId("copy-btn")).not.toBeInTheDocument();
  });
});
