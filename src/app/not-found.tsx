import type { Metadata } from "next";
import { ErrorActions, ErrorShell } from "./error-shell";

export const metadata: Metadata = {
  title: "404 — Stranica nije pronađena",
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <ErrorShell
      code="404"
      title="404 — Stranica nije pronađena"
      description={
        <>
          Link je možda zastareo ili ima grešku u kucanju.
          <br />
          Ako tražiš deo za računar — kreni od komponenti.
        </>
      }
    >
      <ErrorActions />
    </ErrorShell>
  );
}
