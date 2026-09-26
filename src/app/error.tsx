"use client";

import { useEffect } from "react";
import Link from "next/link";
import { ErrorShell } from "./error-shell";

export default function ErrorPage({
  error,
  retry,
}: {
  error: Error & { digest?: string };
  retry: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <ErrorShell
      code={error.digest ? `Greška · ${error.digest.slice(0, 8)}` : "Greška"}
      title="Došlo je do greške"
      description="Nešto je pošlo po zlu na našoj strani. Pokušaj ponovo — ako se greška ponavlja, javi nam."
    >
      <div className="flex flex-wrap items-center justify-center gap-3">
        <button
          type="button"
          onClick={() => retry()}
          className="btn-glow inline-flex items-center px-6 py-3 text-xs font-bold tracking-widest uppercase"
          style={{ fontFamily: "var(--font-geist-mono)" }}
        >
          Pokušaj ponovo
        </button>
        <Link
          href="/"
          className="btn-ghost inline-flex items-center px-6 py-3 text-xs font-medium tracking-wide"
          style={{ border: "1px solid var(--edge)", color: "var(--text-muted)", fontFamily: "var(--font-geist-mono)" }}
        >
          Početna
        </Link>
        <Link
          href="/kontakt"
          className="inline-flex items-center px-2 py-3 text-xs hover-link"
          style={{ color: "var(--text-dim)", fontFamily: "var(--font-geist-mono)" }}
        >
          Prijavi greške
        </Link>
      </div>
    </ErrorShell>
  );
}
