"use client";

import { useEffect, useState } from "react";

/** Two-line hero phrases: white first line, one green accent word on line 2. */
const PHRASES: { top: string; accent: string }[] = [
  { top: "Skockaj svoj", accent: "računar" },
  { top: "Uporedi cene", accent: "komponenti" },
  { top: "Uštedi svoj", accent: "novac" },
];

const TYPE_MS = 85;
const DELETE_MS = 55;
const HOLD_MS = 2200;
const GAP_MS = 500;

export default function Typewriter() {
  const [index, setIndex] = useState(0);
  const [typed, setTyped] = useState(0);
  const [deleting, setDeleting] = useState(false);

  const { top, accent } = PHRASES[index];
  const fullLen = top.length + 1 + accent.length;
  const done = typed >= fullLen;

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      setTyped(fullLen);
      return;
    }

    let delay = deleting ? DELETE_MS : TYPE_MS;
    if (!deleting && done) delay = HOLD_MS;
    if (deleting && typed === 0) delay = GAP_MS;

    const t = window.setTimeout(() => {
      if (!deleting && done) {
        setDeleting(true);
        return;
      }
      if (deleting && typed === 0) {
        setDeleting(false);
        setIndex((i) => (i + 1) % PHRASES.length);
        return;
      }
      setTyped((n) => (deleting ? n - 1 : n + 1));
    }, delay);

    return () => window.clearTimeout(t);
  }, [typed, deleting, done, fullLen]);

  const topText = top.slice(0, Math.min(typed, top.length));
  const showAccent = typed > top.length;
  const accentText = showAccent
    ? accent.slice(0, Math.max(0, typed - top.length - 1))
    : "";

  return (
    <span
      aria-label={`${top} ${accent}`}
      style={{
        display: "inline-flex",
        flexDirection: "column",
        alignItems: "flex-start",
        gap: 0,
        lineHeight: 1.05,
      }}
    >
      <span
        aria-hidden="true"
        style={{
          display: "block",
          color: "var(--text)",
          minHeight: "1.05em",
          width: "100%",
        }}
      >
        {topText || "\u00A0"}
      </span>
      <span
        aria-hidden="true"
        style={{
          display: "block",
          minHeight: "1.05em",
          width: "100%",
        }}
      >
        <span
          className="glow-pulse"
          style={{ color: "var(--glow)" }}
        >
          {accentText || "\u00A0"}
        </span>
        <span
          style={{
            display: "inline-block",
            width: "0.08em",
            height: "0.85em",
            marginLeft: "0.06em",
            background: "var(--glow)",
            verticalAlign: "-0.05em",
            animation: "cursorBlink 1.1s steps(1) infinite",
          }}
        />
      </span>
    </span>
  );
}
