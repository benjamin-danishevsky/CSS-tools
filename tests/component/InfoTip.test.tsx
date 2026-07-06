import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import InfoTip from "../../src/components/InfoTip";
import { GLOSSARY } from "../../src/lib/glossary";

describe("InfoTip", () => {
  it("renders an accessible trigger button", () => {
    render(<InfoTip termKey="gap" />);
    const trigger = screen.getByTestId("infotip-gap");
    expect(trigger.tagName).toBe("BUTTON");
    expect(trigger).toHaveAttribute("aria-label");
    expect(trigger.getAttribute("aria-label")).toContain(GLOSSARY.gap.term);
  });

  it("hides the definition by default", () => {
    render(<InfoTip termKey="gap" />);
    expect(screen.queryByTestId("tip-content-gap")).not.toBeInTheDocument();
  });

  it("reveals the definition on keyboard focus", () => {
    render(<InfoTip termKey="gap" />);
    fireEvent.focus(screen.getByTestId("infotip-gap"));
    const content = screen.getByTestId("tip-content-gap");
    expect(content).toBeInTheDocument();
    expect(content.textContent).toContain(GLOSSARY.gap.short);
  });

  it("hides the definition again on blur", () => {
    render(<InfoTip termKey="gap" />);
    const trigger = screen.getByTestId("infotip-gap");
    fireEvent.focus(trigger);
    expect(screen.getByTestId("tip-content-gap")).toBeInTheDocument();
    fireEvent.blur(trigger);
    expect(screen.queryByTestId("tip-content-gap")).not.toBeInTheDocument();
  });

  it("reveals the definition on hover", () => {
    render(<InfoTip termKey="units" />);
    fireEvent.mouseEnter(screen.getByTestId("infotip-units"));
    expect(screen.getByTestId("tip-content-units")).toBeInTheDocument();
  });

  it("exposes the tooltip via aria-describedby when open", () => {
    render(<InfoTip termKey="gap" />);
    const trigger = screen.getByTestId("infotip-gap");
    fireEvent.focus(trigger);
    const content = screen.getByTestId("tip-content-gap");
    expect(trigger.getAttribute("aria-describedby")).toBe(content.id);
    expect(content).toHaveAttribute("role", "tooltip");
  });

  it("renders the popover fixed and portaled out of the trigger's container so a scrolling ancestor can't clip it", () => {
    const { container } = render(
      <div style={{ overflow: "auto" }}>
        <InfoTip termKey="gap" />
      </div>,
    );
    fireEvent.focus(screen.getByTestId("infotip-gap"));
    const content = screen.getByTestId("tip-content-gap") as HTMLElement;
    // Fixed positioning is viewport-relative, immune to ancestor overflow clipping.
    expect(content.style.position).toBe("fixed");
    // Portaled to document.body, not nested inside the rendered wrapper.
    expect(container.contains(content)).toBe(false);
    expect(document.body.contains(content)).toBe(true);
  });
});
