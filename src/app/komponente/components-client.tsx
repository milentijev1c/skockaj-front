"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import type { Component } from "@/lib/types";
import { CATEGORIES, slugToCategory, categoryToSlug, CATEGORY_ICONS, srArtikli, srProdavnice, srRezultati } from "@/lib/types";
import { apiFetch } from "@/lib/api";
import { EmptyState, SkeletonList } from "../ui-states";

// ── Per-category attribute extraction (specs first, then name) ──

function specStr(c: Component, key: string): string {
  const v = c.specifications?.[key];
  return v == null ? "" : String(v);
}

function parseCpuMeta(c: Component) {
  const n = c.name.toUpperCase();
  const specs = c.specifications ?? {};
  let series = specStr(c, "series");
  let generation = specStr(c, "generation");

  if (!series) {
    if (/\bRYZEN\s*3\b/.test(n)) series = "Ryzen 3";
    else if (/\bRYZEN\s*5\b/.test(n)) series = "Ryzen 5";
    else if (/\bRYZEN\s*7\b/.test(n)) series = "Ryzen 7";
    else if (/\bRYZEN\s*9\b/.test(n)) series = "Ryzen 9";
    else if (/\bCORE\s*(ULTRA\s*)?I?3\b|\bI3-\d/.test(n)) series = "Core i3";
    else if (/\bCORE\s*(ULTRA\s*)?I?5\b|\bI5-\d/.test(n)) series = "Core i5";
    else if (/\bCORE\s*(ULTRA\s*)?I?7\b|\bI7-\d/.test(n)) series = "Core i7";
    else if (/\bCORE\s*(ULTRA\s*)?I?9\b|\bI9-\d/.test(n)) series = "Core i9";
    else if (/\bPENTIUM\b/.test(n)) series = "Pentium";
    else if (/\bCELERON\b/.test(n)) series = "Celeron";
    else if (/\bATHLON\b/.test(n)) series = "Athlon";
  }

  if (!generation) {
    const m = n.match(/\b(?:I[3579]|RYZEN|CORE)[-\s]?(\d)(\d{3,4})[A-Z]*\b/);
    if (m) {
      const gen = m[1];
      if (gen >= "3" && gen <= "9") generation = `${gen}xxx`;
    }
  }

  const cores = specStr(c, "cores");
  const socket = c.socket ?? "";
  return { series, generation, cores, socket, specs };
}

function parseGpuMeta(c: Component) {
  const n = c.name.toUpperCase();
  let series = specStr(c, "series");
  if (!series) {
    const m = n.match(/\b(RTX|GTX|RX|RADEON RX|ARC A)\s*(\d{3,4})\s*(TI|SUPER|XTX|XT)?\b/);
    if (m) series = `${m[1]} ${m[2]}${m[3] ? " " + m[3] : ""}`.replace("RADEON RX", "RX");
  }
  const vram = specStr(c, "vram_gb");
  return { series, vram: vram ? `${vram} GB` : "" };
}

function parseRamMeta(c: Component) {
  const ddr = c.ram_type ?? specStr(c, "memory_type") ?? "";
  const capacity = specStr(c, "capacity_gb");
  const speed = specStr(c, "speed_mhz");
  return {
    ddr,
    capacity: capacity ? `${capacity} GB` : "",
    speed: speed ? `${speed} MHz` : "",
  };
}

function parseMoboMeta(c: Component) {
  const n = c.name.toUpperCase();
  let chipset = specStr(c, "chipset");
  if (!chipset) {
    const chipsets = ["X870E", "X870", "X670E", "X670", "X570", "Z890", "Z790", "Z690", "B860", "B850", "B840", "B760", "B660", "B650", "B550", "B450", "H770", "H670", "H610", "H510", "A620", "A520"];
    for (const ch of chipsets) {
      if (n.includes(ch)) { chipset = ch; break; }
    }
  }
  const form = specStr(c, "form_factor");
  return { chipset, form, socket: c.socket ?? "", ram: c.ram_type ?? "" };
}

function parsePsuMeta(c: Component) {
  const n = c.name.toUpperCase();
  let watt = specStr(c, "wattage");
  if (!watt) {
    const m = n.match(/\b(\d{3,4})\s*W\b/) || n.match(/\bW(\d{3,4})\b/);
    if (m) watt = m[1];
  }
  const eff = specStr(c, "efficiency") || (/80\+\s*GOLD|GOLD/i.test(c.name) ? "80+ Gold"
    : /80\+\s*BRONZE|BRONZE/i.test(c.name) ? "80+ Bronze"
    : /80\+\s*PLATINUM|PLATINUM/i.test(c.name) ? "80+ Platinum"
    : /80\+/i.test(c.name) ? "80+" : "");
  const modular = specStr(c, "modular") || (/full modular|potpuno modular/i.test(c.name) ? "Full"
    : /semi.?modular|polu.?modular/i.test(c.name) ? "Semi"
    : /modularno|modular/i.test(c.name) ? "Modular" : "");
  return { watt: watt ? `${watt} W` : "", eff, modular };
}

function parseCaseMeta(c: Component) {
  const n = c.name.toUpperCase();
  const form = specStr(c, "form_factor") || (/E-?ATX/.test(n) ? "E-ATX"
    : /MID.?TOWER|MIDI/.test(n) ? "Mid Tower"
    : /MINI.?ITX|MINI ITX/.test(n) ? "Mini ITX"
    : /MICRO.?ATX|MICRO ATX/.test(n) ? "Micro ATX"
    : /FULL.?TOWER/.test(n) ? "Full Tower" : "");
  return { form };
}

function parseStorageMeta(c: Component) {
  const n = c.name.toUpperCase();
  const type = specStr(c, "type") || (/NVME|M\.2/.test(n) ? "NVMe" : /SATA/.test(n) ? "SATA" : /HDD|HARD DISK/.test(n) ? "HDD" : "");
  const cap = specStr(c, "capacity_gb");
  let capacity = cap ? (Number(cap) >= 1000 ? `${Number(cap) / 1000} TB` : `${cap} GB`) : "";
  if (!capacity) {
    const m = n.match(/\b(\d+)\s*(TB|GB)\b/);
    if (m) capacity = `${m[1]} ${m[2]}`;
  }
  return { type, capacity };
}

function parseCoolerMeta(c: Component) {
  const n = c.name.toUpperCase();
  const type = specStr(c, "type") || (/AIO|VODEN|LIQUID|KRAKEN|CLC/.test(n) ? "Vodeno"
    : /VENTILATOR|\bFAN\b/.test(n) ? "Ventilator" : "Vazdušno");
  return { type };
}

// ── Filter definitions — strictly per category ─────────

type FilterDef = {
  key: string;
  label: string;
  derive: (c: Component) => string;
};

const CATEGORY_FILTERS: Record<string, FilterDef[]> = {
  cpu: [
    { key: "manufacturer", label: "Proizvođač", derive: (c) => c.manufacturer },
    { key: "series", label: "Serija", derive: (c) => parseCpuMeta(c).series },
    { key: "socket", label: "Socket", derive: (c) => parseCpuMeta(c).socket },
    { key: "generation", label: "Generacija", derive: (c) => parseCpuMeta(c).generation },
    { key: "cores", label: "Jezgra", derive: (c) => parseCpuMeta(c).cores },
  ],
  motherboard: [
    { key: "manufacturer", label: "Proizvođač", derive: (c) => c.manufacturer },
    { key: "chipset", label: "Čipset", derive: (c) => parseMoboMeta(c).chipset },
    { key: "socket", label: "Socket", derive: (c) => parseMoboMeta(c).socket },
    { key: "ram", label: "RAM tip", derive: (c) => parseMoboMeta(c).ram },
  ],
  gpu: [
    { key: "manufacturer", label: "Proizvođač", derive: (c) => c.manufacturer },
    { key: "series", label: "Serija", derive: (c) => parseGpuMeta(c).series },
    { key: "vram", label: "VRAM", derive: (c) => parseGpuMeta(c).vram },
  ],
  ram: [
    { key: "manufacturer", label: "Proizvođač", derive: (c) => c.manufacturer },
    { key: "ddr", label: "DDR tip", derive: (c) => parseRamMeta(c).ddr },
    { key: "capacity", label: "Kapacitet", derive: (c) => parseRamMeta(c).capacity },
    { key: "speed", label: "Brzina", derive: (c) => parseRamMeta(c).speed },
  ],
  psu: [
    { key: "manufacturer", label: "Proizvođač", derive: (c) => c.manufacturer },
    { key: "watt", label: "Snaga", derive: (c) => parsePsuMeta(c).watt },
    { key: "eff", label: "Efikasnost", derive: (c) => parsePsuMeta(c).eff },
    { key: "modular", label: "Modularnost", derive: (c) => parsePsuMeta(c).modular },
  ],
  case: [
    { key: "manufacturer", label: "Proizvođač", derive: (c) => c.manufacturer },
    { key: "form", label: "Format", derive: (c) => parseCaseMeta(c).form },
  ],
  storage: [
    { key: "manufacturer", label: "Proizvođač", derive: (c) => c.manufacturer },
    { key: "type", label: "Tip", derive: (c) => parseStorageMeta(c).type },
    { key: "capacity", label: "Kapacitet", derive: (c) => parseStorageMeta(c).capacity },
  ],
  cooler: [
    { key: "manufacturer", label: "Proizvođač", derive: (c) => c.manufacturer },
    { key: "type", label: "Tip", derive: (c) => parseCoolerMeta(c).type },
  ],
};

function getFilterOptions(components: Component[], def: FilterDef): string[] {
  const values = new Set<string>();
  for (const c of components) {
    const val = def.derive(c)?.trim();
    if (val && val !== "Nepoznat") values.add(val);
  }
  return [...values].sort((a, b) => {
    const na = parseFloat(a);
    const nb = parseFloat(b);
    if (!Number.isNaN(na) && !Number.isNaN(nb)) return na - nb;
    return a.localeCompare(b, "sr");
  });
}

function componentMatchesFilters(c: Component, filters: Record<string, string>, filterDefs: FilterDef[]): boolean {
  for (const [key, val] of Object.entries(filters)) {
    if (!val) continue;
    const def = filterDefs.find((f) => f.key === key);
    if (!def) continue;
    if (def.derive(c) !== val) return false;
  }
  return true;
}

function FilterGroups({ filterDefs, components, filters, setFilter }: {
  filterDefs: FilterDef[];
  components: Component[];
  filters: Record<string, string>;
  setFilter: (key: string, val: string) => void;
}) {
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});

  return (
    <>
      {filterDefs.map((f) => {
        const options = getFilterOptions(components, f);
        if (options.length < 1) return null;
        const active = filters[f.key] ?? "";
        const isOpen = !collapsed[f.key];
        return (
          <div key={f.key} className="mb-3">
            <button
              type="button"
              onClick={() => setCollapsed((p) => ({ ...p, [f.key]: !p[f.key] }))}
              className="w-full flex items-center justify-between text-[10px] font-bold tracking-widest uppercase mb-2"
              style={{ color: active ? "var(--glow)" : "var(--text-muted)", fontFamily: "var(--font-geist-mono)", background: "none", border: "none", cursor: "pointer", padding: 0 }}
            >
              <span>
                {f.label}
                {active ? <span style={{ color: "var(--glow)" }}> · {active}</span> : null}
              </span>
              <span
                style={{
                  fontSize: 10,
                  opacity: 0.7,
                  display: "inline-block",
                  transition: "transform 0.28s cubic-bezier(0.4, 0, 0.2, 1)",
                  transform: isOpen ? "rotate(0deg)" : "rotate(-90deg)",
                }}
              >
                ▾
              </span>
            </button>
            <div
              style={{
                display: "grid",
                gridTemplateRows: isOpen ? "1fr" : "0fr",
                transition: "grid-template-rows 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
              }}
            >
              <div style={{ overflow: "hidden", minHeight: 0 }}>
                <div
                  className="flex flex-col gap-1"
                  style={{
                    opacity: isOpen ? 1 : 0,
                    visibility: isOpen ? "visible" : "hidden",
                    transform: isOpen ? "translateY(0)" : "translateY(-6px)",
                    transition: "opacity 0.22s ease, transform 0.28s cubic-bezier(0.4, 0, 0.2, 1), visibility 0.28s",
                    pointerEvents: isOpen ? "auto" : "none",
                    paddingTop: 2,
                    paddingBottom: isOpen ? 4 : 0,
                  }}
                >
                  <button onClick={() => setFilter(f.key, "")} className="text-xs text-left px-3 py-1.5 chip-btn"
                    style={{ background: !active ? "var(--glow-dim)" : "transparent", color: !active ? "var(--glow)" : "var(--text-muted)", border: "none", cursor: "pointer", fontFamily: "var(--font-geist-mono)", transition: "all 0.15s ease" }}
                    onMouseEnter={(e) => { if (active) e.currentTarget.style.color = "var(--text)"; }}
                    onMouseLeave={(e) => { if (active) e.currentTarget.style.color = "var(--text-muted)"; }}
                  >Sve</button>
                  {options.map((v) => (
                    <button key={v} onClick={() => setFilter(f.key, active === v ? "" : v)} className="text-xs text-left px-3 py-1.5 chip-btn"
                      style={{ background: active === v ? "var(--glow-dim)" : "transparent", color: active === v ? "var(--glow)" : "var(--text-muted)", border: "none", cursor: "pointer", fontFamily: "var(--font-geist-mono)", transition: "all 0.15s ease" }}
                      onMouseEnter={(e) => { if (active !== v) e.currentTarget.style.color = "var(--text)"; }}
                      onMouseLeave={(e) => { if (active !== v) e.currentTarget.style.color = "var(--text-muted)"; }}
                    >{v}</button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </>
  );
}

// ── Sorting / availability helpers ─────────────────────

type SortKey = "default" | "cena-rast" | "cena-opad" | "naziv-az" | "naziv-za" | "prodavnice";

const SORT_OPTIONS: { key: SortKey; label: string }[] = [
  { key: "default", label: "Podrazumevano" },
  { key: "cena-rast", label: "Cena ↑" },
  { key: "cena-opad", label: "Cena ↓" },
  { key: "naziv-az", label: "Naziv A–Ž" },
  { key: "naziv-za", label: "Naziv Ž–A" },
  { key: "prodavnice", label: "Više prodavnica" },
];

function cheapestOf(c: Component): number | null {
  const priced = c.prices.filter((p) => p.price_rsd > 0);
  return priced.length > 0 ? Math.min(...priced.map((p) => p.price_rsd)) : null;
}

function shopsOf(c: Component): number {
  return c.prices.filter((p) => p.price_rsd > 0 && p.in_stock).length;
}

function applySort(list: Component[], sort: SortKey): Component[] {
  const out = [...list];
  const byName = (a: Component, b: Component) => a.name.localeCompare(b.name, "sr");
  switch (sort) {
    case "cena-rast":
      return out.sort((a, b) => {
        const pa = cheapestOf(a);
        const pb = cheapestOf(b);
        if (pa == null && pb == null) return byName(a, b);
        if (pa == null) return 1;
        if (pb == null) return -1;
        return pa - pb;
      });
    case "cena-opad":
      return out.sort((a, b) => {
        const pa = cheapestOf(a);
        const pb = cheapestOf(b);
        if (pa == null && pb == null) return byName(a, b);
        if (pa == null) return 1;
        if (pb == null) return -1;
        return pb - pa;
      });
    case "naziv-az":
      return out.sort(byName);
    case "naziv-za":
      return out.sort((a, b) => byName(b, a));
    case "prodavnice":
      return out.sort((a, b) => shopsOf(b) - shopsOf(a) || byName(a, b));
    default:
      return out.sort((a, b) => a.id - b.id);
  }
}

// ── URL query keys for shareable views ─────────────────

const RESERVED_PARAMS = new Set(["kategorija", "sort", "q", "stanje", "cena_od", "cena_do"]);

type ViewState = {
  category: string;
  search: string;
  filters: Record<string, string>;
  sort: SortKey;
  inStockOnly: boolean;
  priceMin: string;
  priceMax: string;
};

function parseViewState(params: URLSearchParams): ViewState {
  const cat = slugToCategory(params.get("kategorija") ?? "") ?? "";
  const sortRaw = params.get("sort") ?? "default";
  const sort = (SORT_OPTIONS.some((o) => o.key === sortRaw) ? sortRaw : "default") as SortKey;
  const filters: Record<string, string> = {};
  for (const [k, v] of params.entries()) {
    if (!RESERVED_PARAMS.has(k) && v) filters[k] = v;
  }
  return {
    category: cat,
    search: params.get("q") ?? "",
    filters,
    sort,
    inStockOnly: params.get("stanje") === "1",
    priceMin: params.get("cena_od") ?? "",
    priceMax: params.get("cena_do") ?? "",
  };
}

function buildQueryString(state: ViewState): string {
  const params = new URLSearchParams();
  if (state.category) params.set("kategorija", categoryToSlug(state.category) ?? state.category);
  if (state.search) params.set("q", state.search);
  if (state.sort !== "default") params.set("sort", state.sort);
  if (state.inStockOnly) params.set("stanje", "1");
  if (state.priceMin !== "") params.set("cena_od", state.priceMin);
  if (state.priceMax !== "") params.set("cena_do", state.priceMax);
  for (const [k, v] of Object.entries(state.filters)) {
    if (v) params.set(k, v);
  }
  return params.toString();
}

// ── Main component ─────────────────────────────────────

export default function ComponentsClient({ initial }: { initial: Component[] }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const boot = parseViewState(new URLSearchParams(searchParams.toString()));
  const lastWrittenQs = useState({ current: "" })[0];

  const [components, setComponents] = useState<Component[]>([]);
  const [category, setCategory] = useState(boot.category);
  const [loading, setLoading] = useState(!boot.category);
  const [addedIds, setAddedIds] = useState<Set<number>>(new Set());
  const [justAddedIds, setJustAddedIds] = useState<Set<number>>(new Set());
  const [search, setSearch] = useState(boot.search);
  const [filters, setFilters] = useState<Record<string, string>>(boot.filters);
  const [sort, setSort] = useState<SortKey>(boot.sort);
  const [inStockOnly, setInStockOnly] = useState(boot.inStockOnly);
  const [priceMin, setPriceMin] = useState(boot.priceMin);
  const [priceMax, setPriceMax] = useState(boot.priceMax);

  const filterDefs = CATEGORY_FILTERS[category] ?? [];
  const hasActiveFilters =
    search ||
    inStockOnly ||
    priceMin !== "" ||
    priceMax !== "" ||
    Object.values(filters).some(Boolean);

  const filtered = applySort(
    components.filter((c) => {
      const matchesSearch =
        !search ||
        c.name.toLowerCase().includes(search.toLowerCase()) ||
        c.manufacturer.toLowerCase().includes(search.toLowerCase());
      if (!matchesSearch || !componentMatchesFilters(c, filters, filterDefs)) return false;
      if (inStockOnly && shopsOf(c) < 1) return false;
      const price = cheapestOf(c);
      if (priceMin !== "" && (price == null || price < Number(priceMin))) return false;
      if (priceMax !== "" && (price == null || price > Number(priceMax))) return false;
      return true;
    }),
    sort,
  );

  function writeUrl(next: Partial<ViewState>, mode: "replace" | "push" = "replace") {
    const merged: ViewState = {
      category: category ?? "",
      search,
      filters,
      sort,
      inStockOnly,
      priceMin,
      priceMax,
      ...next,
    };
    const qs = buildQueryString(merged);
    lastWrittenQs.current = qs;
    const url = qs ? `/komponente?${qs}` : "/komponente";
    if (mode === "push") router.push(url, { scroll: false });
    else router.replace(url, { scroll: false });
    return merged;
  }

  function setFilter(key: string, val: string) {
    setFilters((prev) => {
      const nextFilters = { ...prev };
      if (val) nextFilters[key] = val;
      else delete nextFilters[key];
      writeUrl({ filters: nextFilters });
      return nextFilters;
    });
  }

  function changeSort(next: SortKey) {
    setSort(next);
    writeUrl({ sort: next });
  }

  function changeInStock(next: boolean) {
    setInStockOnly(next);
    writeUrl({ inStockOnly: next });
  }

  function changePriceMin(v: string) {
    setPriceMin(v);
    writeUrl({ priceMin: v });
  }

  function changePriceMax(v: string) {
    setPriceMax(v);
    writeUrl({ priceMax: v });
  }

  function changeSearch(v: string) {
    setSearch(v);
    writeUrl({ search: v });
  }

  function clearAllFilters() {
    setFilters({});
    setSearch("");
    setInStockOnly(false);
    setPriceMin("");
    setPriceMax("");
    writeUrl({ filters: {}, search: "", inStockOnly: false, priceMin: "", priceMax: "" });
  }

  useEffect(() => {
    const stored: number[] = JSON.parse(localStorage.getItem("builder") || "[]");
    if (stored.length > 0) setAddedIds(new Set(stored));
  }, []);

  useEffect(() => {
    if (boot.category) {
      setLoading(true);
      apiFetch<Component[]>(`/components/?category=${boot.category}`).then((data) => { setComponents(data); setLoading(false); });
    } else {
      setComponents([]);
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // URL → state only for external navigations (shared link, back/forward)
  useEffect(() => {
    const qs = new URLSearchParams(searchParams.toString()).toString();
    const written = new URLSearchParams(lastWrittenQs.current).toString();
    if (qs && qs === written) return;
    const state = parseViewState(new URLSearchParams(qs));
    setCategory(state.category);
    setSearch(state.search);
    setFilters(state.filters);
    setSort(state.sort);
    setInStockOnly(state.inStockOnly);
    setPriceMin(state.priceMin);
    setPriceMax(state.priceMax);
    if (state.category) {
      setLoading(true);
      apiFetch<Component[]>(`/components/?category=${state.category}`).then((data) => { setComponents(data); setLoading(false); });
    } else {
      setComponents([]);
      setLoading(false);
    }
  }, [searchParams, initial, lastWrittenQs]);

  function selectCategory(cat: string) {
    setCategory(cat);
    setFilters({});
    setSearch("");
    setInStockOnly(false);
    setPriceMin("");
    setPriceMax("");
    setLoading(true);
    writeUrl(
      { category: cat, filters: {}, search: "", inStockOnly: false, priceMin: "", priceMax: "" },
      "push",
    );
    apiFetch<Component[]>(`/components/?category=${cat}`).then((data) => { setComponents(data); setLoading(false); });
  }

  function clearCategory() {
    setCategory("");
    setComponents([]);
    setLoading(false);
    setFilters({});
    setSearch("");
    setInStockOnly(false);
    setPriceMin("");
    setPriceMax("");
    writeUrl({ category: "", filters: {}, search: "", inStockOnly: false, priceMin: "", priceMax: "" }, "push");
  }

  const addToBuilder = (id: number, e: React.MouseEvent) => {
    e.preventDefault(); e.stopPropagation();
    const stored: number[] = JSON.parse(localStorage.getItem("builder") || "[]");
    if (!stored.includes(id)) {
      stored.push(id);
      localStorage.setItem("builder", JSON.stringify(stored));
      setAddedIds((prev) => new Set(prev).add(id));
      // first (or next) part — continue in Konfigurator
      router.push("/konfigurator");
      return;
    }
    setAddedIds((prev) => new Set(prev).add(id));
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
        <h1 className="text-3xl font-black tracking-tight" style={{ fontFamily: "var(--font-geist-sans)" }}>
          {category ? (CATEGORIES.find((c) => c.value === category)?.title ?? "Komponente") : "Komponente"}
        </h1>
        {category ? (
          <div className="flex items-center gap-3 mt-1">
            <button onClick={clearCategory}
              onMouseEnter={(e) => { e.currentTarget.style.background = "var(--glow-dim)"; e.currentTarget.style.textShadow = "0 0 12px var(--glow-dim)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.textShadow = "none"; }}
              style={{ color: "var(--glow)", fontFamily: "var(--font-geist-mono)", padding: "4px 8px", borderRadius: "4px", cursor: "pointer", transition: "all 0.2s ease", textShadow: "none", fontSize: "12px", fontWeight: 500 }}
            >← Sve kategorije</button>
            {!loading && <span className="text-sm" style={{ color: "var(--text-muted)", fontFamily: "var(--font-geist-mono)" }}>{hasActiveFilters ? `${filtered.length} ${srRezultati(filtered.length)}` : `${components.length} ${srArtikli(components.length)}`}</span>}
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
        <div>
          <div className="flex gap-2 mb-4">
            <div className="skeleton-bar" style={{ width: 120, height: 28 }} />
            <div className="skeleton-bar" style={{ width: 80, height: 28 }} />
            <div className="skeleton-bar" style={{ width: 100, height: 28 }} />
          </div>
          <SkeletonList rows={8} />
        </div>
      )}

      {/* Sidebar + Table */}
      {category && !loading && (
        <div className="flex gap-6">
          {/* Sidebar */}
          <aside className="w-56 shrink-0 hidden lg:block">
            <input type="text" value={search} onChange={(e) => changeSearch(e.target.value)} placeholder="Pretraži..." className="w-full mb-4"
              style={{ background: "var(--panel)", border: "1px solid var(--edge)", color: "var(--text)", padding: "8px 12px", fontFamily: "var(--font-geist-mono)", fontSize: "12px", outline: "none" }}
              onFocus={(e) => { e.currentTarget.style.borderColor = "var(--glow)"; e.currentTarget.style.boxShadow = "0 0 10px var(--glow-dim)"; }}
              onBlur={(e) => { e.currentTarget.style.borderColor = "var(--edge)"; e.currentTarget.style.boxShadow = "none"; }}
            />
            {filterDefs.length > 0 && (
              <FilterGroups filterDefs={filterDefs} components={components} filters={filters} setFilter={setFilter} />
            )}

            {/* Availability */}
            <FilterGroups
              filterDefs={[
                {
                  key: "__stock",
                  label: "Dostupnost",
                  derive: (c) => (shopsOf(c) > 0 ? "Na stanju" : "Nema u ponudi"),
                },
              ]}
              components={components}
              filters={{ __stock: inStockOnly ? "Na stanju" : "" }}
              setFilter={(_k, v) => changeInStock(v === "Na stanju")}
            />

            <div className="mb-4">
              <div className="text-[10px] font-bold tracking-widest uppercase mb-2" style={{ color: "var(--text-muted)", fontFamily: "var(--font-geist-mono)" }}>Sortiranje</div>
              <div className="flex flex-col gap-1">
                {SORT_OPTIONS.map((o) => (
                  <button
                    key={o.key}
                    onClick={() => changeSort(o.key)}
                    className="text-xs text-left px-3 py-1.5 chip-btn"
                    style={{
                      background: sort === o.key ? "var(--glow-dim)" : "transparent",
                      color: sort === o.key ? "var(--glow)" : "var(--text-muted)",
                      border: "none",
                      cursor: "pointer",
                      fontFamily: "var(--font-geist-mono)",
                      transition: "all 0.15s ease",
                    }}
                    onMouseEnter={(e) => { if (sort !== o.key) e.currentTarget.style.color = "var(--text)"; }}
                    onMouseLeave={(e) => { if (sort !== o.key) e.currentTarget.style.color = "var(--text-muted)"; }}
                  >
                    {o.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-4">
              <div className="text-[10px] font-bold tracking-widest uppercase mb-2" style={{ color: "var(--text-muted)", fontFamily: "var(--font-geist-mono)" }}>Cena (RSD)</div>
              <div className="flex gap-2">
                <input
                  type="number"
                  min={0}
                  value={priceMin}
                  onChange={(e) => changePriceMin(e.target.value)}
                  placeholder="Od"
                  className="w-full"
                  style={{ background: "var(--panel)", border: "1px solid var(--edge)", color: "var(--text)", padding: "8px 10px", fontFamily: "var(--font-geist-mono)", fontSize: "12px", outline: "none" }}
                />
                <input
                  type="number"
                  min={0}
                  value={priceMax}
                  onChange={(e) => changePriceMax(e.target.value)}
                  placeholder="Do"
                  className="w-full"
                  style={{ background: "var(--panel)", border: "1px solid var(--edge)", color: "var(--text)", padding: "8px 10px", fontFamily: "var(--font-geist-mono)", fontSize: "12px", outline: "none" }}
                />
              </div>
            </div>

            {hasActiveFilters && (
              <button onClick={clearAllFilters} className="w-full text-xs py-2 mt-2 btn-danger"
                style={{ background: "transparent", border: "1px solid var(--edge)", color: "var(--coral)", cursor: "pointer", fontFamily: "var(--font-geist-mono)", transition: "all 0.2s ease" }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = "var(--coral)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = "var(--edge)"; }}
              >Obriši sve filtere</button>
            )}
          </aside>

          {/* Table */}
          <div className="flex-1 min-w-0">
            <div className="lg:hidden mb-4">
              <input type="text" value={search} onChange={(e) => changeSearch(e.target.value)} placeholder="Pretraži..." className="w-full mb-3"
                style={{ background: "var(--panel)", border: "1px solid var(--edge)", color: "var(--text)", padding: "8px 12px", fontFamily: "var(--font-geist-mono)", fontSize: "12px", outline: "none" }}
                onFocus={(e) => { e.currentTarget.style.borderColor = "var(--glow)"; }}
                onBlur={(e) => { e.currentTarget.style.borderColor = "var(--edge)"; }}
              />
              <div className="flex flex-wrap gap-2 mb-3">
                <select
                  value={sort}
                  onChange={(e) => changeSort(e.target.value as SortKey)}
                  className="flex-1 min-w-[160px]"
                  style={{ background: "var(--panel)", border: "1px solid var(--edge)", color: "var(--text)", padding: "8px 12px", fontFamily: "var(--font-geist-mono)", fontSize: "12px", outline: "none", cursor: "pointer" }}
                >
                  {SORT_OPTIONS.map((o) => (
                    <option key={o.key} value={o.key}>{o.label}</option>
                  ))}
                </select>
                <button
                  onClick={() => changeInStock(!inStockOnly)}
                  className="text-xs px-3 py-2"
                  style={{
                    background: inStockOnly ? "var(--glow-dim)" : "transparent",
                    color: inStockOnly ? "var(--glow)" : "var(--text-muted)",
                    border: "1px solid var(--edge)",
                    cursor: "pointer",
                    fontFamily: "var(--font-geist-mono)",
                  }}
                >
                  Na stanju
                </button>
              </div>
              <div style={{ background: "var(--panel)", border: "1px solid var(--edge)", padding: "12px 14px" }}>
                <FilterGroups filterDefs={filterDefs} components={components} filters={filters} setFilter={setFilter} />
              </div>
            </div>

            {/* Sort toolbar (desktop) */}
            <div className="hidden lg:flex items-center justify-between mb-3 gap-3">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[10px] font-bold tracking-widest uppercase" style={{ color: "var(--text-muted)", fontFamily: "var(--font-geist-mono)" }}>Sortiraj</span>
                {SORT_OPTIONS.map((o) => (
                  <button
                    key={o.key}
                    onClick={() => changeSort(o.key)}
                    className="text-[11px] px-2.5 py-1 chip-btn"
                    style={{
                      background: sort === o.key ? "var(--glow-dim)" : "transparent",
                      color: sort === o.key ? "var(--glow)" : "var(--text-muted)",
                      border: `1px solid ${sort === o.key ? "var(--glow)" : "var(--edge)"}`,
                      cursor: "pointer",
                      fontFamily: "var(--font-geist-mono)",
                      transition: "all 0.15s ease",
                    }}
                  >
                    {o.label}
                  </button>
                ))}
              </div>
              <button
                onClick={() => changeInStock(!inStockOnly)}
                className="text-[11px] px-2.5 py-1 chip-btn"
                style={{
                  background: inStockOnly ? "var(--glow-dim)" : "transparent",
                  color: inStockOnly ? "var(--glow)" : "var(--text-muted)",
                  border: `1px solid ${inStockOnly ? "var(--glow)" : "var(--edge)"}`,
                  cursor: "pointer",
                  fontFamily: "var(--font-geist-mono)",
                }}
              >
                {inStockOnly ? "✓ " : ""}Samo na stanju
              </button>
            </div>

            {components.length === 0 && (
              <EmptyState
                title="Nema komponenti u ovoj kategoriji"
                description="Još uvek nema artikala za ovu kategoriju. Vratite se na sve kategorije ili proverite kasnije."
                action={
                  <button
                    onClick={clearCategory}
                    className="btn-ghost px-5 py-2.5 text-xs font-bold tracking-widest uppercase"
                    style={{ border: "1px solid var(--edge)", color: "var(--text-muted)", fontFamily: "var(--font-geist-mono)" }}
                  >
                    ← Sve kategorije
                  </button>
                }
              />
            )}
            {components.length > 0 && filtered.length === 0 && (
              <EmptyState
                title={hasActiveFilters ? "Nema rezultata za zadate filtere" : "Nema rezultata pretrage"}
                description={
                  hasActiveFilters
                    ? "Probajte da promenite filtere, opseg cene ili pojam pretrage."
                    : "Nijedan artikal ne odgovara pretrazi. Skratite pojam ili obrišite pretragu."
                }
                action={
                  hasActiveFilters ? (
                    <button
                      onClick={clearAllFilters}
                      className="btn-ghost px-5 py-2.5 text-xs font-bold tracking-widest uppercase"
                      style={{ border: "1px solid var(--edge)", color: "var(--text-muted)", fontFamily: "var(--font-geist-mono)" }}
                    >
                      Obriši filtere
                    </button>
                  ) : (
                    <button
                      onClick={() => changeSearch("")}
                      className="btn-ghost px-5 py-2.5 text-xs font-bold tracking-widest uppercase"
                      style={{ border: "1px solid var(--edge)", color: "var(--text-muted)", fontFamily: "var(--font-geist-mono)" }}
                    >
                      Obriši pretragu
                    </button>
                  )
                }
              />
            )}

            {filtered.length > 0 && (
              <div style={{ background: "var(--panel)", border: "1px solid var(--edge)" }}>
                <div className="flex items-center px-5 py-3 text-[10px] font-bold tracking-widest uppercase" style={{ background: "rgba(0,212,170,0.03)", borderBottom: "1px solid var(--edge)", color: "var(--text-muted)", fontFamily: "var(--font-geist-mono)" }}>
                  <div className="flex-1">Proizvod</div>
                  <div className="w-32 text-center hidden sm:block">Socket / Tip</div>
                  <div className="w-32 text-right">Najniža cena</div>
                  <div className="w-28 text-right">Prodavnice</div>
                  <div className="w-32 text-right"></div>
                </div>
                {filtered.map((c) => {
                  const priced = c.prices.filter((p) => p.price_rsd > 0);
                  const cheapest = priced.length > 0 ? Math.min(...priced.map((p) => p.price_rsd)) : null;
                  const inStock = priced.filter((p) => p.in_stock).length;
                  const added = addedIds.has(c.id);
                  return (
                    <div key={c.id} className="flex items-center px-5 py-4 fade-in row-hover" style={{ borderBottom: "1px solid var(--edge)", transition: "background 0.15s ease" }}
                      onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(0,212,170,0.03)"; }}
                      onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}>
                      <div className="flex-1 min-w-0">
                        <Link href={`/komponente/${c.id}`} className="text-sm font-bold truncate block" style={{ color: "var(--text)", textDecoration: "none" }}
                          onMouseEnter={(e) => { e.currentTarget.style.color = "var(--glow)"; }}
                          onMouseLeave={(e) => { e.currentTarget.style.color = "var(--text)"; }}>{c.name}</Link>
                        <span className="text-[11px]" style={{ color: "var(--text-muted)", fontFamily: "var(--font-geist-mono)" }}>{c.manufacturer}</span>
                      </div>
                      <div className="w-32 text-center text-xs hidden sm:block" style={{ color: "var(--glow)", fontFamily: "var(--font-geist-mono)" }}>
                        {category === "ram" ? (c.ram_type || "—") : (c.socket || c.ram_type || "—")}
                      </div>
                      <div className="w-32 text-right">
                        {cheapest !== null ? <span className="text-sm font-bold" style={{ color: "var(--amber)", fontFamily: "var(--font-geist-mono)" }}>{cheapest.toLocaleString("sr")}<span className="text-[10px] font-normal ml-1" style={{ color: "var(--text-muted)" }}>RSD</span></span> : <span className="text-[11px]" style={{ color: "var(--text-muted)" }}>Nema u ponudi</span>}
                      </div>
                      <div className="w-28 text-right">
                        {inStock > 0 ? (
                          <span className="text-[11px]" style={{ color: "var(--glow)", fontFamily: "var(--font-geist-mono)" }}>
                            {inStock} {srProdavnice(inStock)}
                          </span>
                        ) : (
                          <span className="text-[11px]" style={{ color: "var(--text-muted)" }}>/</span>
                        )}
                      </div>
                      <div className="w-32 text-right">
                        {added ? (
                          <button onClick={(e) => removeFromBuilder(c.id, e)} className="text-[10px] font-bold tracking-wider uppercase px-3 py-1.5 btn-danger" style={{ background: "transparent", color: "var(--coral)", border: "1px solid var(--coral)", fontFamily: "var(--font-geist-mono)", cursor: "pointer", transition: "all 0.2s ease" }}>Ukloni</button>
                        ) : (
                          <button onClick={(e) => addToBuilder(c.id, e)} className="text-[10px] font-bold tracking-wider uppercase px-3 py-1.5" style={{ background: "transparent", color: "var(--glow)", border: "1px solid var(--glow)", fontFamily: "var(--font-geist-mono)", cursor: "pointer", transition: "all 0.2s ease" }}>Dodaj</button>
                        )}
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
