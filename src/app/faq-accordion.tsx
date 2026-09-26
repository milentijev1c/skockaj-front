"use client";

import { useId, useState } from "react";

type Item = { q: string; a: string };

export default function FaqAccordion({ items }: { items: Item[] }) {
  const [open, setOpen] = useState<number | null>(0);
  const baseId = useId();

  return (
    <div className="max-w-2xl mx-auto" style={{ border: "1px solid var(--edge)", background: "var(--panel)" }}>
      {items.map((item, i) => {
        const expanded = open === i;
        const panelId = `${baseId}-panel-${i}`;
        const buttonId = `${baseId}-button-${i}`;
        return (
          <div key={item.q} style={{ borderBottom: i < items.length - 1 ? "1px solid var(--edge)" : "none" }}>
            <h3>
              <button
                type="button"
                id={buttonId}
                aria-expanded={expanded}
                aria-controls={panelId}
                onClick={() => setOpen(expanded ? null : i)}
                className="w-full text-left px-5 py-4 flex items-start justify-between gap-4"
                style={{
                  background: "transparent",
                  border: "none",
                  color: "var(--text)",
                  fontFamily: "var(--font-geist-sans)",
                  fontSize: 15,
                  fontWeight: 700,
                  cursor: "pointer",
                }}
              >
                <span>{item.q}</span>
                <span
                  aria-hidden="true"
                  className="faq-plus"
                  style={{
                    color: "var(--glow)",
                    fontFamily: "var(--font-geist-mono)",
                    fontSize: 18,
                    lineHeight: 1,
                    transform: expanded ? "rotate(45deg)" : "rotate(0deg)",
                    transition: "transform 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
                  }}
                >
                  +
                </span>
              </button>
            </h3>
            <div
              id={panelId}
              role="region"
              aria-labelledby={buttonId}
              className="faq-panel"
              data-open={expanded ? "true" : "false"}
              // Keep content in DOM for smooth height animation; hide from a11y when closed
              aria-hidden={!expanded}
              style={{
                display: "grid",
                gridTemplateRows: expanded ? "1fr" : "0fr",
                transition: "grid-template-rows 0.28s cubic-bezier(0.4, 0, 0.2, 1)",
              }}
            >
              <div style={{ overflow: "hidden", minHeight: 0 }}>
                <div
                  className="px-5 pb-4 text-sm leading-relaxed"
                  style={{
                    color: "var(--text-muted)",
                    opacity: expanded ? 1 : 0,
                    transform: expanded ? "translateY(0)" : "translateY(-4px)",
                    transition: "opacity 0.22s ease, transform 0.22s ease",
                  }}
                >
                  {item.a}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
