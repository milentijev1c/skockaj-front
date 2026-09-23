export interface Price {
  id: number;
  store_id: number;
  price_rsd: number;
  product_url: string;
  in_stock: boolean;
  last_updated: string;
}

export interface Component {
  id: number;
  name: string;
  category: string;
  manufacturer: string;
  socket: string | null;
  ram_type: string | null;
  tdp_w: number;
  specifications: Record<string, unknown> | null;
  prices: Price[];
}

export interface Build {
  hash_id: string;
  parent_id: string | null;
  components_json: number[];
  total_price: number | null;
  created_at: string;
  view_count: number;
}

export interface CompatibilityIssue {
  severity: "error" | "warning";
  component_ids: number[];
  message: string;
}

export interface CompatibilityResult {
  compatible: boolean;
  issues: CompatibilityIssue[];
}

export interface ScrapedPrice {
  source: string;
  raw_name: string;
  price: number;
  url: string;
  in_stock: boolean;
  matched_at: string;
}

export const STORE_NAMES: Record<string, string> = {
  gigatron: "Gigatron",
  monitor: "Monitor",
  exceed: "Exceed",
  winwin: "WinWin",
  bigbang: "BigBang",
  ananas: "Ananas",
};

export const CATEGORIES = [
  { value: "cpu", label: "Procesor", slug: "procesor" },
  { value: "motherboard", label: "Matična ploča", slug: "maticna-ploca" },
  { value: "gpu", label: "Grafička kartica", slug: "graficka-kartica" },
  { value: "ram", label: "RAM", slug: "ram" },
  { value: "psu", label: "Napajanje", slug: "napajanje" },
  { value: "case", label: "Kućište", slug: "kuciste" },
  { value: "storage", label: "Disk", slug: "disk" },
  { value: "cooler", label: "Kuler", slug: "kuler" },
] as const;

export function slugToCategory(slug: string): string | undefined {
  return CATEGORIES.find((c) => c.slug === slug)?.value;
}

export function categoryToSlug(value: string): string | undefined {
  return CATEGORIES.find((c) => c.value === value)?.slug;
}

export const CATEGORY_ICONS: Record<string, string> = {
  cpu: "/icons/cpu.svg",
  motherboard: "/icons/motherboard.svg",
  gpu: "/icons/gpu.svg",
  ram: "/icons/ram.svg",
  psu: "/icons/psu.svg",
  case: "/icons/case.svg",
  storage: "/icons/storage.svg",
  cooler: "/icons/cooler.svg",
};
