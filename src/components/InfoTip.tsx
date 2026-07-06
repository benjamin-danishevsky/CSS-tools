import { useId, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { GLOSSARY, type TermKey } from "../lib/glossary";
import GlossaryVisual from "./GlossaryVisual";

const POPOVER_WIDTH = 224;
const MARGIN = 8;
const OFFSET = 6;

/**
 * A small accessible "info" trigger that reveals a plain-language definition
 * (plus a mini visual) on hover and keyboard focus. Dismisses on blur,
 * mouse-leave, or Escape.
 *
 * The popover is rendered in a portal with fixed positioning so it is never
 * clipped by a scrolling ancestor (a sidebar with `overflow-y: auto` also
 * clips horizontally per the CSS overflow spec), and it is clamped to the
 * viewport so it can't appear off-screen.
 */
export default function InfoTip({ termKey }: { termKey: TermKey }) {
  const [open, setOpen] = useState(false);
  const [coords, setCoords] = useState<{ top: number; left: number } | null>(
    null,
  );
  const triggerRef = useRef<HTMLButtonElement>(null);
  const popRef = useRef<HTMLSpanElement>(null);
  const tipId = useId();
  const entry = GLOSSARY[termKey];

  useLayoutEffect(() => {
    if (!open) return;
    const trigger = triggerRef.current;
    const pop = popRef.current;
    if (!trigger || !pop) return;

    const t = trigger.getBoundingClientRect();
    const p = pop.getBoundingClientRect();
    const vw = window.innerWidth;
    const vh = window.innerHeight;

    // Clamp horizontally within the viewport.
    let left = Math.min(t.left, vw - POPOVER_WIDTH - MARGIN);
    left = Math.max(MARGIN, left);

    // Prefer below the trigger; flip above if it would overflow the bottom.
    let top = t.bottom + OFFSET;
    if (top + p.height > vh - MARGIN) {
      const above = t.top - p.height - OFFSET;
      top = above >= MARGIN ? above : Math.max(MARGIN, vh - p.height - MARGIN);
    }

    setCoords({ top, left });
  }, [open]);

  function close() {
    setOpen(false);
    setCoords(null);
  }

  return (
    <span className="inline-flex align-middle">
      <button
        ref={triggerRef}
        type="button"
        data-testid={`infotip-${termKey}`}
        aria-label={`What is ${entry.term}?`}
        aria-describedby={open ? tipId : undefined}
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={close}
        onFocus={() => setOpen(true)}
        onBlur={close}
        onKeyDown={(e) => {
          if (e.key === "Escape") close();
        }}
        className="flex h-4 w-4 items-center justify-center rounded-full text-[10px] font-bold leading-none transition-colors"
        style={{
          backgroundColor: "var(--color-bg-tertiary)",
          color: "var(--color-text-muted)",
          border: "1px solid var(--color-border)",
        }}
      >
        i
      </button>

      {open &&
        createPortal(
          <span
            ref={popRef}
            role="tooltip"
            id={tipId}
            data-testid={`tip-content-${termKey}`}
            className="flex flex-col gap-1.5 rounded-lg p-2.5 text-left"
            style={{
              position: "fixed",
              top: coords?.top ?? 0,
              left: coords?.left ?? 0,
              width: POPOVER_WIDTH,
              visibility: coords ? "visible" : "hidden",
              zIndex: 1000,
              backgroundColor: "var(--color-bg)",
              border: "1px solid var(--color-border)",
              boxShadow: "var(--shadow-lg)",
            }}
          >
            <span
              className="text-xs font-semibold"
              style={{ color: "var(--color-text)" }}
            >
              {entry.term}
            </span>
            <span
              className="text-[11px] leading-snug"
              style={{ color: "var(--color-text-secondary)" }}
            >
              {entry.short}
            </span>
            <span className="mt-0.5">
              <GlossaryVisual termKey={termKey} />
            </span>
          </span>,
          document.body,
        )}
    </span>
  );
}
