"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { apiFetch } from "@/lib/api";

type Topic = "feedback" | "bug" | "feature" | "business" | "other";

const TOPICS: { value: Topic; label: string }[] = [
  { value: "feedback", label: "Povratna informacija" },
  { value: "bug", label: "Prijava greške" },
  { value: "feature", label: "Predlog" },
  { value: "business", label: "Poslovna saradnja" },
  { value: "other", label: "Ostalo" },
];

const RATE_LIMIT_KEY = "skockaj-kontakt-last";
const RATE_LIMIT_MS = 30_000;
const RESET_MS = 5_000;

const fieldStyle = {
  background: "var(--void)",
  border: "1px solid var(--edge)",
  color: "var(--text)",
  borderRadius: 2,
  fontFamily: "var(--font-geist-mono)" as const,
};

function isValidEmail(v: string) {
  if (!v || v.startsWith("@") || v.endsWith("@") || !v.includes("@")) return false;
  const [local, domain] = v.split("@");
  if (!local || !domain || !domain.includes(".")) return false;
  if (v.includes(" ") || local.includes("..")) return false;
  return true;
}

type FieldName = "name" | "email" | "company" | "subject" | "message" | "privacy";
type FieldErrors = Partial<Record<FieldName, string>>;

function validateField(field: FieldName, value: string, topic: Topic, privacy: boolean): string | undefined {
  switch (field) {
    case "name":
      return value.trim().length < 2 ? "Unesi ime (najmanje 2 slova)." : undefined;
    case "email":
      return !isValidEmail(value.trim()) ? "Unesi ispravnu email adresu." : undefined;
    case "company":
      return topic === "business" && !value.trim()
        ? "Za poslovnu saradnju unesi naziv kompanije."
        : undefined;
    case "subject":
      return value.trim().length > 200 ? "Predmet je predug (max 200 znakova)." : undefined;
    case "message":
      if (value.trim().length < 10) return "Poruka mora imati najmanje 10 znakova.";
      if (value.trim().length > 5000) return "Poruka je preduga (max 5000 znakova).";
      return undefined;
    case "privacy":
      return !privacy ? "Potrebno je prihvatiti politiku privatnosti." : undefined;
  }
}

function inputBorder(error: boolean) {
  return error ? "1px solid var(--coral)" : "1px solid var(--edge)";
}

export default function ContactForm() {
  const [topic, setTopic] = useState<Topic>("feedback");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [pageUrl, setPageUrl] = useState("");
  const [privacy, setPrivacy] = useState(false);
  const [website, setWebsite] = useState(""); // honeypot
  const [errors, setErrors] = useState<FieldErrors>({});
  const [touched, setTouched] = useState<Partial<Record<FieldName, boolean>>>({});
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [statusNote, setStatusNote] = useState<string | null>(null);

  // Prefill current page (client-only — avoids SSR mismatch)
  useEffect(() => {
    setPageUrl(window.location.href);
  }, []);

  function updateField(field: FieldName, value: string, setter: (v: string) => void) {
    setter(value);
    if (touched[field]) {
      const err = validateField(field, value, topic, field === "privacy" ? value === "true" : privacy);
      setErrors((prev) => {
        const next = { ...prev };
        if (err) next[field] = err;
        else delete next[field];
        return next;
      });
    }
  }

  function touchField(field: FieldName, value: string) {
    setTouched((prev) => ({ ...prev, [field]: true }));
    const err = validateField(field, value, topic, field === "privacy" ? value === "true" : privacy);
    setErrors((prev) => {
      const next = { ...prev };
      if (err) next[field] = err;
      else delete next[field];
      return next;
    });
  }

  function validateAll(): FieldErrors {
    const values: Record<FieldName, string> = {
      name,
      email,
      company,
      subject,
      message,
      privacy: privacy ? "true" : "",
    };
    const next: FieldErrors = {};
    for (const field of Object.keys(values) as FieldName[]) {
      const err = validateField(field, values[field], topic, privacy);
      if (err) next[field] = err;
    }
    return next;
  }

  const resetForm = useCallback(() => {
    setTopic("feedback");
    setName("");
    setEmail("");
    setCompany("");
    setSubject("");
    setMessage("");
    setPrivacy(false);
    setWebsite("");
    setErrors({});
    setTouched({});
    setStatus("idle");
    setStatusNote(null);
    setPageUrl(window.location.href);
  }, []);

  // Success card: 5s green bar fills, then refresh to a new form
  useEffect(() => {
    if (status !== "success") return;
    const t = window.setTimeout(resetForm, RESET_MS);
    return () => window.clearTimeout(t);
  }, [status, resetForm]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (status === "sending") return;

    // Client-side rate limit (server also enforces)
    try {
      const last = Number(localStorage.getItem(RATE_LIMIT_KEY) || 0);
      if (Date.now() - last < RATE_LIMIT_MS) {
        setStatus("error");
        setStatusNote("Sačekaj malo pre sledećeg slanja.");
        return;
      }
    } catch {
      /* ignore */
    }

    const next = validateAll();
    setErrors(next);
    setTouched({ name: true, email: true, company: true, subject: true, message: true, privacy: true });
    if (Object.keys(next).length > 0) return;

    // Honeypot filled → pretend success, never hit the API
    if (website.trim()) {
      setStatus("success");
      return;
    }

    setStatus("sending");
    setStatusNote(null);
    try {
      await apiFetch("/contact/", {
        method: "POST",
        body: JSON.stringify({
          topic,
          name: name.trim(),
          email: email.trim(),
          company: topic === "business" ? company.trim() : null,
          subject: subject.trim() || "Poruka sa kontakt forme",
          message: message.trim(),
          page_url: pageUrl.trim() || null,
          website: "",
        }),
      });
      try {
        localStorage.setItem(RATE_LIMIT_KEY, String(Date.now()));
      } catch {
        /* ignore */
      }
      setStatus("success");
    } catch {
      // Keep typed message on API failure
      setStatus("error");
      setStatusNote("Poruka nije poslata — server trenutno nije dostupan. Pokušaj ponovo za par trenutaka.");
    }
  }

  if (status === "success") {
    return (
      <div
        className="fade-in text-center overflow-hidden"
        style={{ background: "var(--panel)", border: "1px solid var(--edge)", alignSelf: "center", position: "relative" }}
      >
        {/* Green bar fills over 5s, then form refreshes */}
        <div
          aria-hidden="true"
          style={{
            height: 3,
            background: "var(--glow-dim)",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              height: "100%",
              width: "100%",
              background: "var(--glow)",
              transformOrigin: "left center",
              animation: "formResetBar 5s linear forwards",
            }}
          />
        </div>
        <div className="p-8">
          <div
            className="mx-auto mb-4 flex items-center justify-center"
            style={{
              width: 56,
              height: 56,
              border: "1px solid var(--glow)",
              color: "var(--glow)",
            }}
            aria-hidden="true"
          >
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
              <path d="M5 12.5l4.5 4.5L19 7.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <h2 className="text-xl font-bold mb-2" style={{ fontFamily: "var(--font-geist-mono)" }}>
            Hvala!
          </h2>
          <p className="text-sm" style={{ color: "var(--text-muted)" }}>
            Javićemo vam se u najkraćem roku.
          </p>
        </div>
      </div>
    );
  }

  return (
    <form
      onSubmit={onSubmit}
      noValidate
      className="p-6 md:p-8"
      style={{ background: "var(--panel)", border: "1px solid var(--edge)", alignSelf: "start" }}
      aria-label="Kontakt forma"
    >
      <fieldset className="mb-5">
        <legend className="text-xs mb-2" style={{ color: "var(--text-muted)" }}>
          Tip poruke
        </legend>
        <div className="flex flex-wrap gap-2">
          {TOPICS.map((t) => {
            const active = topic === t.value;
            return (
              <button
                key={t.value}
                type="button"
                onClick={() => {
                  setTopic(t.value);
                  if (t.value !== "business") {
                    setErrors((prev) => {
                      const next = { ...prev };
                      delete next.company;
                      return next;
                    });
                  } else if (touched.company) {
                    const err = validateField("company", company, t.value, privacy);
                    setErrors((prev) => {
                      const next = { ...prev };
                      if (err) next.company = err;
                      else delete next.company;
                      return next;
                    });
                  }
                }}
                aria-pressed={active}
                className="chip-btn px-3 py-2 text-[11px] tracking-wide"
                style={{
                  background: active ? "var(--glow-dim)" : "transparent",
                  border: `1px solid ${active ? "var(--glow)" : "var(--edge)"}`,
                  color: active ? "var(--glow)" : "var(--text-muted)",
                  fontFamily: "var(--font-geist-mono)",
                  cursor: "pointer",
                }}
              >
                {t.label}
              </button>
            );
          })}
        </div>
      </fieldset>

      <div className="space-y-4">
        <div>
          <label className="block text-xs mb-1.5" style={{ color: "var(--text-muted)" }} htmlFor="kontakt-ime">
            Ime <span style={{ color: "var(--coral)" }}>*</span>
          </label>
          <input
            id="kontakt-ime"
            name="name"
            value={name}
            onChange={(e) => updateField("name", e.target.value, setName)}
            onBlur={() => touchField("name", name)}
            required
            autoComplete="name"
            className="w-full text-base px-3 py-2.5"
            style={{ ...fieldStyle, border: inputBorder(Boolean(errors.name)) }}
            aria-invalid={Boolean(errors.name)}
          />
          {errors.name && (
            <p className="text-xs mt-1" style={{ color: "var(--coral)" }} role="alert">
              {errors.name}
            </p>
          )}
        </div>

        <div>
          <label className="block text-xs mb-1.5" style={{ color: "var(--text-muted)" }} htmlFor="kontakt-email">
            Email <span style={{ color: "var(--coral)" }}>*</span>
          </label>
          <input
            id="kontakt-email"
            name="email"
            type="email"
            value={email}
            onChange={(e) => updateField("email", e.target.value, setEmail)}
            onBlur={() => touchField("email", email)}
            required
            autoComplete="email"
            className="w-full text-base px-3 py-2.5"
            style={{ ...fieldStyle, border: inputBorder(Boolean(errors.email)) }}
            aria-invalid={Boolean(errors.email)}
          />
          {errors.email && (
            <p className="text-xs mt-1" style={{ color: "var(--coral)" }} role="alert">
              {errors.email}
            </p>
          )}
        </div>

        {topic === "business" && (
          <div>
            <label className="block text-xs mb-1.5" style={{ color: "var(--text-muted)" }} htmlFor="kontakt-kompanija">
              Kompanija <span style={{ color: "var(--coral)" }}>*</span>
            </label>
            <input
              id="kontakt-kompanija"
              name="company"
              value={company}
              onChange={(e) => updateField("company", e.target.value, setCompany)}
              onBlur={() => touchField("company", company)}
              required
              autoComplete="organization"
              className="w-full text-base px-3 py-2.5"
              style={{ ...fieldStyle, border: inputBorder(Boolean(errors.company)) }}
              aria-invalid={Boolean(errors.company)}
            />
            {errors.company && (
              <p className="text-xs mt-1" style={{ color: "var(--coral)" }} role="alert">
                {errors.company}
              </p>
            )}
          </div>
        )}

        <div>
          <label className="block text-xs mb-1.5" style={{ color: "var(--text-muted)" }} htmlFor="kontakt-predmet">
            Predmet
          </label>
          <input
            id="kontakt-predmet"
            name="subject"
            value={subject}
            onChange={(e) => updateField("subject", e.target.value, setSubject)}
            onBlur={() => touchField("subject", subject)}
            maxLength={200}
            className="w-full text-base px-3 py-2.5"
            style={{ ...fieldStyle, border: inputBorder(Boolean(errors.subject)) }}
            aria-invalid={Boolean(errors.subject)}
          />
          {errors.subject && (
            <p className="text-xs mt-1" style={{ color: "var(--coral)" }} role="alert">
              {errors.subject}
            </p>
          )}
        </div>

        <div>
          <label className="block text-xs mb-1.5" style={{ color: "var(--text-muted)" }} htmlFor="kontakt-poruka">
            Poruka <span style={{ color: "var(--coral)" }}>*</span>
          </label>
          <textarea
            id="kontakt-poruka"
            name="message"
            value={message}
            onChange={(e) => updateField("message", e.target.value, setMessage)}
            onBlur={() => touchField("message", message)}
            required
            rows={6}
            minLength={10}
            maxLength={5000}
            className="w-full text-base px-3 py-2.5"
            style={{ ...fieldStyle, resize: "vertical", border: inputBorder(Boolean(errors.message)) }}
            aria-invalid={Boolean(errors.message)}
          />
          {errors.message && (
            <p className="text-xs mt-1" style={{ color: "var(--coral)" }} role="alert">
              {errors.message}
            </p>
          )}
        </div>

        <div>
          <label className="block text-xs mb-1.5" style={{ color: "var(--text-muted)" }} htmlFor="kontakt-link">
            Stranica / link
          </label>
          <input
            id="kontakt-link"
            name="page_url"
            value={pageUrl}
            onChange={(e) => setPageUrl(e.target.value)}
            maxLength={500}
            className="w-full text-base px-3 py-2.5"
            style={fieldStyle}
          />
        </div>

        {/* Honeypot — zero-size + transparent so real users never see it */}
        <div aria-hidden="true">
          <label htmlFor="kontakt-website" className="sr-only">Website</label>
          <input
            id="kontakt-website"
            name="website"
            tabIndex={-1}
            autoComplete="off"
            value={website}
            onChange={(e) => setWebsite(e.target.value)}
            style={{
              position: "absolute",
              width: 0,
              height: 0,
              opacity: 0,
              border: "none",
              padding: 0,
              pointerEvents: "none",
            }}
          />
        </div>

        <div>
          <label className="flex items-start gap-2 text-xs cursor-pointer" style={{ color: "var(--text-muted)" }}>
            <input
              type="checkbox"
              checked={privacy}
              onChange={(e) => {
                setPrivacy(e.target.checked);
                setTouched((prev) => ({ ...prev, privacy: true }));
                const err = validateField("privacy", e.target.checked ? "true" : "", topic, e.target.checked);
                setErrors((prev) => {
                  const next = { ...prev };
                  if (err) next.privacy = err;
                  else delete next.privacy;
                  return next;
                });
              }}
              style={{ marginTop: 2, accentColor: "var(--glow)" }}
              aria-describedby={errors.privacy ? "kontakt-privacy-error" : undefined}
            />
            <span>
              Složio sam se sa{" "}
              <Link href="/politika-privatnosti" className="hover-link" style={{ color: "var(--glow)" }}>
                politikom privatnosti
              </Link>
              {" "}
              <span style={{ color: "var(--coral)" }}>*</span>
            </span>
          </label>
          {errors.privacy && (
            <p id="kontakt-privacy-error" className="text-xs mt-1" style={{ color: "var(--coral)" }} role="alert">
              {errors.privacy}
            </p>
          )}
        </div>
      </div>

      {status === "error" && statusNote && (
        <p className="text-xs mt-4" style={{ color: "var(--coral)" }} role="alert">
          {statusNote}
        </p>
      )}

      <button
        type="submit"
        disabled={status === "sending"}
        className="btn-glow mt-6 w-full text-xs px-4 py-3"
        style={{ fontFamily: "var(--font-geist-mono)" }}
      >
        {status === "sending" ? "šaljem…" : "Pošalji poruku"}
      </button>
    </form>
  );
}
