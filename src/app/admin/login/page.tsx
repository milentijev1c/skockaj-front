"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { adminLogin } from "@/lib/admin";

export default function AdminLoginPage() {
  const router = useRouter();
  const [token, setToken] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      await adminLogin(token.trim());
      router.replace("/admin");
    } catch (err) {
      const msg = err instanceof Error ? err.message : "";
      if (msg.includes("not configured")) setError("ADMIN_TOKEN nije podešen na serveru.");
      else if (msg.includes("invalid")) setError("Pogrešan token.");
      else setError("Greška pri prijavi.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="max-w-sm mx-auto mt-16">
      <p
        className="text-[10px] tracking-[0.2em] uppercase mb-2"
        style={{ color: "var(--glow)", fontFamily: "var(--font-geist-mono)" }}
      >
        admin
      </p>
      <h1 className="text-xl font-bold mb-6" style={{ fontFamily: "var(--font-geist-mono)" }}>
        prijava
      </h1>

      <form onSubmit={onSubmit}>
        <label className="block text-xs mb-2" style={{ color: "var(--text-muted)" }}>
          Token
          <input
            type="password"
            value={token}
            onChange={(e) => setToken(e.target.value)}
            autoFocus
            required
            className="mt-1 w-full text-sm px-3 py-2"
            style={{
              background: "var(--void)",
              border: "1px solid var(--edge)",
              color: "var(--text)",
              borderRadius: 2,
            }}
          />
        </label>
        {error && (
          <p className="text-xs mb-3" style={{ color: "var(--coral)" }} role="alert">
            {error}
          </p>
        )}
        <button
          type="submit"
          disabled={busy || !token.trim()}
          className="btn-glow text-xs px-4 py-2"
          style={{ fontFamily: "var(--font-geist-mono)" }}
        >
          {busy ? "proveravam…" : "uđi"}
        </button>
      </form>
    </div>
  );
}
