"use client";

/**
 * Root layout crash shell. Renders its own <html>/<body> with inline
 * styles only — no layout, CSS vars, or nonce-dependent scripts.
 * Colors match the dark brand tokens (#0B0E14 / #00D4AA / #E4E8EF).
 */
export default function GlobalError({
  error,
  retry,
}: {
  error: Error & { digest?: string };
  retry: () => void;
}) {
  return (
    <html lang="sr">
      <head>
        <title>Došlo je do greške | skockaj.rs</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          background: "#0B0E14",
          color: "#E4E8EF",
          fontFamily: "system-ui, sans-serif",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: 24,
        }}
      >
        <div style={{ textAlign: "center", maxWidth: 420 }}>
          <div
            style={{
              color: "#00D4AA",
              fontFamily: "ui-monospace, monospace",
              fontSize: 12,
              fontWeight: 700,
              letterSpacing: "0.3em",
              textTransform: "uppercase",
              marginBottom: 16,
            }}
          >
            skockaj.rs
          </div>
          <h1
            style={{
              fontSize: 28,
              fontWeight: 800,
              margin: "0 0 12px",
              color: "#E4E8EF",
            }}
          >
            Došlo je do greške
          </h1>
          <p style={{ color: "#A7B0C0", lineHeight: 1.6, margin: "0 0 28px" }}>
            Aplikacija se nije učitala kako treba. Osveži stranicu i pokušaj ponovo.
          </p>
          <button
            type="button"
            onClick={() => {
              if (typeof retry === "function") retry();
              else window.location.reload();
            }}
            style={{
              background: "#00D4AA",
              color: "#0B0E14",
              border: "none",
              borderRadius: 4,
              padding: "12px 24px",
              fontSize: 12,
              fontWeight: 700,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              cursor: "pointer",
              fontFamily: "ui-monospace, monospace",
            }}
          >
            Osveži stranicu
          </button>
          {error?.digest ? (
            <p
              style={{
                marginTop: 24,
                fontSize: 11,
                color: "#8B94A6",
                fontFamily: "ui-monospace, monospace",
              }}
            >
              ID greške: {error.digest.slice(0, 12)}
            </p>
          ) : null}
        </div>
      </body>
    </html>
  );
}
