"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import type { Component } from "@/lib/types";
import { CATEGORIES, slugToCategory, categoryToSlug, CATEGORY_ICONS } from "@/lib/types";
import { apiFetch } from "@/lib/api";

// ── Parse derived values from component names ──────────

function parseCpuMeta(c: Component) {
  const n = c.name.toUpperCase();
  let series = "";
  let generation = "";

  if (n.includes("RYZEN 3")) series = "Ryzen 3";
  else if (n.includes("RYZEN 5")) series = "Ryzen 5";
  else if (n.includes("RYZEN 7")) series = "Ryzen 7";
  else if (n.includes("RYZEN 9")) series = "Ryzen 9";
  else if (n.includes("CORE I3") || n.includes("I3-")) series = "Core i3";
  else if (n.includes("CORE I5") || n.includes("I5-")) series = "Core i5";
  else if (n.includes("CORE I7") || n.includes("I7-")) series = "Core i7";
  else if (n.includes("CORE I9") || n.includes("I9-")) series = "Core i9";

  const match = n.match(/(\d{4,5})/);
  if (match) {
    const num = parseInt(match[1]);
    if (num >= 1000 && num < 10000) generation = `${Math.floor(num / 1000)}xxx`;
  }

  return { series, generation };
}

function parseGpuMeta(c: Component) {
  const n = c.name.toUpperCase();
  let series = "";
  if (n.includes("RTX 4090") || n.includes("RTX4090")) series = "RTX 4090";
  else if (n.includes("RTX 4080") || n.includes("RTX4080")) series = "RTX 4080";
  else if (n.includes("RTX 4070 TI") || n.includes("RTX4070TI")) series = "RTX 4070 Ti";
  else if (n.includes("RTX 4070") || n.includes("RTX4070")) series = "RTX 4070";
  else if (n.includes("RTX 4060 TI") || n.includes("RTX4060TI")) series = "RTX 4060 Ti";
  else if (n.includes("RTX 4060") || n.includes("RTX4060")) series = "RTX 4060";
  else if (n.includes("RTX 3090") || n.includes("RTX3090")) series = "RTX 3090";
  else if (n.includes("RTX 3080") || n.includes("RTX3080")) series = "RTX 3080";
  else if (n.includes("RTX 3070") || n.includes("RTX3070")) series = "RTX 3070";
  else if (n.includes("RTX 3060") || n.includes("RTX3060")) series = "RTX 3060";
  else if (n.includes("RX 7900")) series = "RX 7900";
  else if (n.includes("RX 7800")) series = "RX 7800";
  else if (n.includes("RX 7700")) series = "RX 7700";
  else if (n.includes("RX 7600")) series = "RX 7600";
  else if (n.includes("RX 6")) series = "RX 6000";
  return { series };
}

function parseRamMeta(c: Component) {
  return { ddr: c.ram_type ?? "" };
}

function parseMoboMeta(c: Component) {
  const n = c.name.toUpperCase();
  let chipset = "";
  const chipsets = ["Z790", "Z690", "B760", "B660", "H770", "H670", "X670", "B650", "A620", "X870", "B850", "X570", "B550"];
  for (const ch of chipsets) {
    if (n.includes(ch)) { chipset = ch; break; }
  }
  return { chipset };
}

// ── Filter definitions per category ────────────────────

type FilterDef = {
  key: string;
  label: string;
  derive?: (c: Component) => string;
  field?: keyof Component;
  specKey?: string;
};

const CATEGORY_FILTERS: Record<string, FilterDef[]> = {
  cpu: [
    { key: "manufacturer", label: "Proizvođač", field: "manufacturer" },
    { key: "socket", label: "Socket", field: "socket" },
    { key: "series", label: "Serija", derive: (c) => parseCpuMeta(c).series },
    { key: "generation", label: "Generacija", derive: (c) => parseCpuMeta(c).generation },
  ],
  motherboard: [
    { key: "manufacturer", label: "Proizvođač", field: "manufacturer" },
    { key: "socket", label: "Socket", field: "socket" },
    { key: "ram_type", label: "RAM tip", field: "ram_type" },
    { key: "chipset", label: "Čipset", derive: (c) => parseMoboMeta(c).chipset },
  ],
  gpu: [
    { key: "manufacturer", label: "Proizvođač", field: "manufacturer" },
    { key: "series", label: "Serija", derive: (c) => parseGpuMeta(c).series },
  ],
  ram: [
    { key: "manufacturer", label: "Proizvođač", field: "manufacturer" },
    { key: "ddr", label: "DDR tip", derive: (c) => parseRamMeta(c).ddr },
  ],
  psu: [
    { key: "manufacturer", label: "Proizvođač", field: "manufacturer" },
  ],
  case: [
    { key: "manufacturer", label: "Proizvođač", field: "manufacturer" },
  ],
  storage: [
    { key: "manufacturer", label: "Proizvođač", field: "manufacturer" },
  ],
  cooler: [
    { key: "manufacturer", label: "Proizvođač", field: "manufacturer" },
  ],
};

function getFilterOptions(components: Component[], def: FilterDef): string[] {
  const values = new Set<string>();
  for (const c of components) {
    let val = "";
    if (def.derive) val = def.derive(c);
    else if (def.field) val = String(c[def.field] ?? "");
    if (val) values.add(val);
  }
  return [...values].sort();
}

function componentMatchesFilters(c: Component, filters: Record<string, string>, filterDefs: FilterDef[]): boolean {
  for (const [key, val] of Object.entries(filters)) {
    if (!val) continue;
    const def = filterDefs.find((f) => f.key === key);
    if (!def) continue;
    let componentVal = "";
    if (def.derive) componentVal = def.derive(c);
    else if (def.field) componentVal = String(c[def.field] ?? "");
    if (componentVal !== val) return false;
  }
  return true;
}

// ── Main component ─────────────────────────────────────

export default function ComponentsClient({ initial }: { initial: Component[] }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const urlSlug = searchParams.get("kategorija") ?? "";
  const initialCat = slugToCategory(urlSlug) ?? "";

  const [components, setComponents] = useState<Component[]>([]);
  const [category, setCategory] = useState(initialCat);
  const [loading, setLoading] = useState(!initialCat);
  const [addedIds, setAddedIds] = useState<Set<number>>(new Set());
  const [justAddedIds, setJustAddedIds] = useState<Set<number>>(new Set());
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState<Record<string, string>>({});

  const filterDefs = CATEGORY_FILTERS[category] ?? [];
  const hasActiveFilters = search || Object.values(filters).some(Boolean);

  const filtered = components.filter((c) => {
    const matchesSearch = !search || c.name.toLowerCase().includes(search.toLowerCase()) || c.manufacturer.toLowerCase().includes(search.toLowerCase());
    return matchesSearch && componentMatchesFilters(c, filters, filterDefs);
  });

  useEffect(() => {
    const stored: number[] = JSON.parse(localStorage.getItem("builder") || "[]");
    if (stored.length > 0) setAddedIds(new Set(stored));
  }, []);

  useEffect(() => {
    if (initialCat) {
      setLoading(true);
      apiFetch<Component[]>(`/components/?category=${initialCat}`).then((data) => { setComponents(data); setLoading(false); });
    } else {
      setComponents(initial); setLoading(false);
    }
  }, []);

  useEffect(() => {
    const slug = searchParams.get("kategorija") ?? "";
    const cat = slugToCategory(slug) ?? "";
    setCategory(cat); setFilters({}); setSearch("");
    if (cat) {
      setLoading(true);
      apiFetch<Component[]>(`/components/?category=${cat}`).then((data) => { setComponents(data); setLoading(false); });
    } else {
      setComponents(initial); setLoading(false);
    }
  }, [searchParams]);

  function selectCategory(cat: string) {
    setCategory(cat); setComponents([]); setFilters({}); setSearch(""); setLoading(true);
    router.push(`/komponente?kategorija=${categoryToSlug(cat)}`, { scroll: false });
  }

  function clearCategory() {
    setCategory(""); setComponents(initial); setFilters({}); setSearch(""); setLoading(false);
    router.push("/komponente", { scroll: false });
  }

  function setFilter(key: string, val: string) { setFilters((prev) => ({ ...prev, [key]: val })); }
  function clearAllFilters() { setFilters({}); setSearch(""); }

  const addToBuilder = (id: number, e: React.MouseEvent) => {
    e.preventDefault(); e.stopPropagation();
    const stored: number[] = JSON.parse(localStorage.getItem("builder") || "[]");
    if (!stored.includes(id)) { stored.push(id); localStorage.setItem("builder", JSON.stringify(stored)); }
    setAddedIds((prev) => new Set(prev).add(id));
    setJustAddedIds((prev) => new Set(prev).add(id));
    setTimeout(() => setJustAddedIds((prev) => { const n = new Set(prev); n.delete(id); return n; }), 1500);
  };

  const removeFromBuilder = (id: number, e: React.MouseEvent) => {
    e.preventDefault(); e.stopPropagation();
    const stored: number[] = JSON.parse(localStorage.getItem("builder") || "[]");
    localStorage.setItem("builder", JSON.stringify(stored.filter((i) => i !== id)));
    setAddedIds((prev) => { const n = new Set(prev); n.delete(id); return n; });
  };

  return (
    <div className="fade-in">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-black tracking-tight" style={{ fontFamily: "var(--font-geist-sans)" }}>Komponente</h1>
        {category ? (
          <div className="flex items-center gap-3 mt-1">
            <button onClick={clearCategory}
              onMouseEnter={(e) => { e.currentTarget.style.background = "var(--glow-dim)"; e.currentTarget.style.textShadow = "0 0 12px var(--glow-dim)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.textShadow = "none"; }}
              style={{ color: "var(--glow)", fontFamily: "var(--font-geist-mono)", padding: "4px 8px", borderRadius: "4px", cursor: "pointer", transition: "all 0.2s ease", textShadow: "none", fontSize: "12px", fontWeight: 500 }}
            >← Sve kategorije</button>
            {!loading && <span className="text-sm" style={{ color: "var(--text-muted)", fontFamily: "var(--font-geist-mono)" }}>{hasActiveFilters ? `${filtered.length} rezultata` : `${components.length} ${components.length === 1 ? "artikal" : "artikala"}`}</span>}
          </div>
        ) : <p className="text-sm mt-1" style={{ color: "var(--text-muted)", fontFamily: "var(--font-geist-mono)" }}>Izaberi kategoriju</p>}
      </div>

      {/* Category cards */}
      {!category && (
        <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4">
          {CATEGORIES.map((cat) => (
            <button key={cat.value} onClick={() => selectCategory(cat.value)} className="p-8 card-hover text-center" style={{ background: "var(--panel)", border: "1px solid var(--edge)", cursor: "pointer", minHeight: 140 }}>
              <div className="mx-auto mb-4" style={{ width: 40, height: 40, backgroundColor: "var(--glow)", WebkitMaskImage: `url(${CATEGORY_ICONS[cat.value]})`, maskImage: `url(${CATEGORY_ICONS[cat.value]})`, WebkitMaskSize: "contain", maskSize: "contain", WebkitMaskRepeat: "no-repeat", maskRepeat: "no-repeat", WebkitMaskPosition: "center", maskPosition: "center" }} />
              <span className="text-sm font-bold tracking-wide" style={{ color: "var(--text)", fontFamily: "var(--font-geist-mono)" }}>{cat.label}</span>
            </button>
          ))}
        </div>
      )}

      {/* Loading */}
      {category && loading && (
        <div style={{ background: "var(--panel)", border: "1px solid var(--edge)" }}>
          {[1,2,3,4,5].map((i) => (
            <div key={i} className="flex items-center justify-between px-5 py-4 animate-pulse" style={{ borderBottom: "1px solid var(--edge)" }}>
              <div className="flex-1 space-y-2"><div className="h-3 rounded w-1/4" style={{ background: "var(--edge)" }} /><div className="h-4 rounded w-1/2" style={{ background: "var(--edge)" }} /></div>
              <div className="h-5 rounded w-24" style={{ background: "var(--edge)" }} />
            </div>
          ))}
        </div>
      )}

      {/* Sidebar + Table */}
      {category && !loading && (
        <div className="flex gap-6">
          {/* Sidebar */}
          <aside className="w-56 shrink-0 hidden lg:block">
            <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Pretraži..." className="w-full mb-4"
              style={{ background: "var(--panel)", border: "1px solid var(--edge)", color: "var(--text)", padding: "8px 12px", fontFamily: "var(--font-geist-mono)", fontSize: "12px", outline: "none" }}
              onFocus={(e) => { e.currentTarget.style.borderColor = "var(--glow)"; e.currentTarget.style.boxShadow = "0 0 10px var(--glow-dim)"; }}
              onBlur={(e) => { e.currentTarget.style.borderColor = "var(--edge)"; e.currentTarget.style.boxShadow = "none"; }}
            />
            {filterDefs.map((f) => {
              const options = getFilterOptions(components, f);
              if (options.length < 2) return null;
              return (
                <div key={f.key} className="mb-4">
                  <div className="text-[10px] font-bold tracking-widest uppercase mb-2" style={{ color: "var(--text-muted)", fontFamily: "var(--font-geist-mono)" }}>{f.label}</div>
                  <div className="flex flex-col gap-1">
                    <button onClick={() => setFilter(f.key, "")} className="text-xs text-left px-3 py-1.5"
                      style={{ background: !filters[f.key] ? "var(--glow-dim)" : "transparent", color: !filters[f.key] ? "var(--glow)" : "var(--text-muted)", border: "none", cursor: "pointer", fontFamily: "var(--font-geist-mono)", transition: "all 0.15s ease" }}
                      onMouseEnter={(e) => { if (filters[f.key]) e.currentTarget.style.color = "var(--text)"; }}
                      onMouseLeave={(e) => { if (filters[f.key]) e.currentTarget.style.color = "var(--text-muted)"; }}
                    >Sve</button>
                    {options.map((v) => (
                      <button key={v} onClick={() => setFilter(f.key, filters[f.key] === v ? "" : v)} className="text-xs text-left px-3 py-1.5"
                        style={{ background: filters[f.key] === v ? "var(--glow-dim)" : "transparent", color: filters[f.key] === v ? "var(--glow)" : "var(--text-muted)", border: "none", cursor: "pointer", fontFamily: "var(--font-geist-mono)", transition: "all 0.15s ease" }}
                        onMouseEnter={(e) => { if (filters[f.key] !== v) e.currentTarget.style.color = "var(--text)"; }}
                        onMouseLeave={(e) => { if (filters[f.key] !== v) e.currentTarget.style.color = "var(--text-muted)"; }}
                      >{v}</button>
                    ))}
                  </div>
                </div>
              );
            })}
            {hasActiveFilters && (
              <button onClick={clearAllFilters} className="w-full text-xs py-2 mt-2"
                style={{ background: "transparent", border: "1px solid var(--edge)", color: "var(--coral)", cursor: "pointer", fontFamily: "var(--font-geist-mono)", transition: "all 0.2s ease" }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = "var(--coral)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = "var(--edge)"; }}
              >Obriši sve filtere</button>
            )}
          </aside>

          {/* Table */}
          <div className="flex-1 min-w-0">
            <div className="lg:hidden mb-4">
              <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Pretraži..." className="w-full"
                style={{ background: "var(--panel)", border: "1px solid var(--edge)", color: "var(--text)", padding: "8px 12px", fontFamily: "var(--font-geist-mono)", fontSize: "12px", outline: "none" }}
                onFocus={(e) => { e.currentTarget.style.borderColor = "var(--glow)"; }}
                onBlur={(e) => { e.currentTarget.style.borderColor = "var(--edge)"; }}
              />
            </div>

            {components.length === 0 && <div className="text-center py-20" style={{ color: "var(--text-muted)" }}><p>Nema komponenti u ovoj kategoriji.</p></div>}
            {components.length > 0 && filtered.length === 0 && <div className="text-center py-20" style={{ color: "var(--text-muted)" }}><p>Nema rezultata za zadate filtere.</p></div>}

            {filtered.length > 0 && (
              <div style={{ background: "var(--panel)", border: "1px solid var(--edge)" }}>
                <div className="flex items-center px-5 py-3 text-[10px] font-bold tracking-widest uppercase" style={{ background: "rgba(0,212,170,0.03)", borderBottom: "1px solid var(--edge)", color: "var(--text-muted)", fontFamily: "var(--font-geist-mono)" }}>
                  <div className="flex-1">Proizvod</div>
                  <div className="w-32 text-center hidden sm:block">Socket / Tip</div>
                  <div className="w-32 text-right">Najniža cena</div>
                  <div className="w-28 text-right">Ponude</div>
                  <div className="w-32 text-right"></div>
                </div>
                {filtered.map((c) => {
                  const cheapest = c.prices.length > 0 ? Math.min(...c.prices.map((p) => p.price_rsd)) : null;
                  const inStock = c.prices.filter((p) => p.in_stock).length;
                  const added = addedIds.has(c.id);
                  return (
                    <div key={c.id} className="flex items-center px-5 py-4 fade-in" style={{ borderBottom: "1px solid var(--edge)", transition: "background 0.15s ease" }}
                      onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(0,212,170,0.03)"; }}
                      onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}>
                      <div className="flex-1 min-w-0">
                        <Link href={`/komponente/${c.id}`} className="text-sm font-bold truncate block" style={{ color: "var(--text)", textDecoration: "none" }}
                          onMouseEnter={(e) => { e.currentTarget.style.color = "var(--glow)"; }}
                          onMouseLeave={(e) => { e.currentTarget.style.color = "var(--text)"; }}>{c.name}</Link>
                        <span className="text-[11px]" style={{ color: "var(--text-muted)", fontFamily: "var(--font-geist-mono)" }}>{c.manufacturer}</span>
                      </div>
                      <div className="w-32 text-center text-xs hidden sm:block" style={{ color: "var(--glow)", fontFamily: "var(--font-geist-mono)" }}>{c.socket || c.ram_type || "—"}</div>
                      <div className="w-32 text-right">
                        {cheapest !== null ? <span className="text-sm font-bold" style={{ color: "var(--amber)", fontFamily: "var(--font-geist-mono)" }}>{cheapest.toLocaleString("sr")}<span className="text-[10px] font-normal ml-1" style={{ color: "var(--text-muted)" }}>RSD</span></span> : <span className="text-[11px]" style={{ color: "var(--text-muted)" }}>Nema cenu</span>}
                      </div>
                      <div className="w-28 text-right">
                        {inStock > 0 ? <span className="text-[11px]" style={{ color: "var(--glow)", fontFamily: "var(--font-geist-mono)" }}>{inStock} {inStock === 1 ? "radnja" : "radnji"}</span> : <span className="text-[11px]" style={{ color: "var(--coral)", fontFamily: "var(--font-geist-mono)" }}>Nema</span>}
                      </div>
                      <div className="w-32 text-right">
                        {added && justAddedIds.has(c.id) ? <span className="text-[10px] font-bold tracking-wider uppercase px-3 py-1.5 fade-in" style={{ color: "var(--glow)", fontFamily: "var(--font-geist-mono)" }}>Dodato ✓</span>
                        : added ? <button onClick={(e) => removeFromBuilder(c.id, e)} className="text-[10px] font-bold tracking-wider uppercase px-3 py-1.5" style={{ background: "transparent", color: "var(--coral)", border: "1px solid var(--coral)", fontFamily: "var(--font-geist-mono)", cursor: "pointer", transition: "all 0.2s ease" }}>Ukloni</button>
                        : <button onClick={(e) => addToBuilder(c.id, e)} className="text-[10px] font-bold tracking-wider uppercase px-3 py-1.5" style={{ background: "transparent", color: "var(--glow)", border: "1px solid var(--glow)", fontFamily: "var(--font-geist-mono)", cursor: "pointer", transition: "all 0.2s ease" }}>Dodaj</button>}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
