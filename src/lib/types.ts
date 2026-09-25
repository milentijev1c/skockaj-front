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

export interface ScrapedOffer {
  id: number;
  source: string;
  raw_name: string;
  raw_price: number;
  url: string;
  ean: string | null;
  mpn: string | null;
  scraped_at: string;
}

export interface MatchQueueItem {
  id: number;
  offer_id: number;
  component_id: number | null;
  match_layer: number;
  confidence: number;
  status: string;
  created_at: string;
  offer: ScrapedOffer | null;
}

export const STORE_NAMES: Record<string, string> = {
  gigatron: "Gigatron",
  monitor: "Monitor",
  exceed: "Exceed",
  winwin: "WinWin",
  bigbang: "BigBang",
  ananas: "Ananas",
  bazzar: "Bazzar",
  lirs: "Lirs",
  pcpractic: "PC Practic",
  drtechno: "Dr Techno",
  jakov: "Jakov",
};

export const STORE_URLS: Record<string, string> = {
  gigatron: "https://gigatron.rs",
  monitor: "https://monitor.rs",
  exceed: "https://exceed.rs",
  winwin: "https://winwin.rs",
  bigbang: "https://bigbang.rs",
  ananas: "https://ananas.rs",
  bazzar: "https://bazzar.rs",
  lirs: "https://lirsshop.rs",
  pcpractic: "https://pcpractic.rs",
  drtechno: "https://drtechno.rs",
  jakov: "https://jakov.rs",
};

/** Local brand assets in /public/logos */
export const STORE_LOGOS: Record<string, string> = {
  gigatron: "/logos/gigatron.svg",
  monitor: "/logos/monitor.svg",
  exceed: "/logos/exceed.png",
  winwin: "/logos/winwin.png",
  bigbang: "/logos/bigbang.svg",
  ananas: "/logos/ananas.svg",
  bazzar: "/logos/bazzar.svg",
  lirs: "/logos/lirs.webp",
  pcpractic: "/logos/pcpractic.png",
  drtechno: "/logos/drtechno.png",
  jakov: "/logos/jakov.png",
};

export const ACTIVE_STORES = Object.keys(STORE_NAMES);

export const CATEGORIES = [
  { value: "cpu", label: "Procesor", title: "Procesori", slug: "procesor" },
  { value: "motherboard", label: "Matična ploča", title: "Matične ploče", slug: "maticna-ploca" },
  { value: "gpu", label: "Grafička kartica", title: "Grafičke kartice", slug: "graficka-kartica" },
  { value: "ram", label: "RAM", title: "RAM memorija", slug: "ram" },
  { value: "psu", label: "Napajanje", title: "Napajanja", slug: "napajanje" },
  { value: "case", label: "Kućište", title: "Kućišta", slug: "kuciste" },
  { value: "storage", label: "Disk", title: "Diskovi", slug: "disk" },
  { value: "cooler", label: "Kuler", title: "Kuleri", slug: "kuler" },
] as const;

export function slugToCategory(slug: string): string | undefined {
  return CATEGORIES.find((c) => c.slug === slug)?.value;
}

export function categoryToSlug(value: string): string | undefined {
  return CATEGORIES.find((c) => c.value === value)?.slug;
}

export {
  srCount,
  srProdavnice,
  srArtikli,
  srKomponente,
  srRezultati,
} from "./sr";

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
