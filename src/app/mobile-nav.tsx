"use client";

import { useState } from "react";
import Link from "next/link";

const LINKS = [
  { href: "/komponente", label: "komponente" },
  { href: "/konfigurator", label: "konfigurator" },
  { href: "/kontakt", label: "kontakt" },
];

export default function MobileNav() {
  const [open, setOpen] = useState(false);

  return (
    <div className="mobile-nav">
      <button
        type="button"
        className="mobile-nav-toggle"
        aria-label={open ? "Zatvori meni" : "Otvori meni"}
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
      >
        <span className="mobile-nav-bar" />
        <span className="mobile-nav-bar" />
        <span className="mobile-nav-bar" />
      </button>
      {open && (
        <div className="mobile-nav-panel" role="menu">
          {LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              role="menuitem"
              onClick={() => setOpen(false)}
              style={{ color: "var(--text)" }}
            >
              {l.label}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
