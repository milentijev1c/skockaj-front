import type { Component } from "./types";

/**
 * Browse-time compatibility: hide parts that cannot fit the current build.
 * Only filters when BOTH sides have the relevant spec — unknown stays visible.
 */
export function isCompatibleWithBuild(
  candidate: Component,
  build: Component[],
): boolean {
  if (build.length === 0) return true;
  const byCat = new Map<string, Component[]>();
  for (const b of build) {
    const list = byCat.get(b.category) ?? [];
    list.push(b);
    byCat.set(b.category, list);
  }

  const candSocket = candidate.socket ?? "";
  const candRam = candidate.ram_type ?? "";
  const candSpecs = candidate.specifications ?? {};

  // CPU ↔ motherboard (socket)
  if (candidate.category === "cpu") {
    for (const mobo of byCat.get("motherboard") ?? []) {
      const s = mobo.socket ?? "";
      if (candSocket && s && candSocket !== s) return false;
    }
  }
  if (candidate.category === "motherboard") {
    for (const cpu of byCat.get("cpu") ?? []) {
      const s = cpu.socket ?? "";
      if (candSocket && s && candSocket !== s) return false;
    }
  }

  // RAM ↔ motherboard (DDR generation)
  if (candidate.category === "ram") {
    for (const mobo of byCat.get("motherboard") ?? []) {
      const r = mobo.ram_type ?? "";
      if (candRam && r && candRam !== r) return false;
    }
  }
  if (candidate.category === "motherboard") {
    for (const ram of byCat.get("ram") ?? []) {
      const r = ram.ram_type ?? "";
      if (candRam && r && candRam !== r) return false;
    }
  }

  // M.2 storage ↔ board slots
  if (candidate.category === "storage" && isM2Drive(candidate)) {
    for (const mobo of byCat.get("motherboard") ?? []) {
      const slots = num(mobo.specifications?.m2_slots);
      if (slots !== null && slots <= 0) return false;
    }
  }
  if (candidate.category === "motherboard") {
    const slots = num(candSpecs.m2_slots);
    if (slots !== null && slots <= 0) {
      for (const d of byCat.get("storage") ?? []) {
        if (isM2Drive(d)) return false;
      }
    }
  }

  // Case ↔ GPU length
  if (candidate.category === "gpu") {
    const len = num(candSpecs.length_mm);
    if (len !== null) {
      for (const k of byCat.get("case") ?? []) {
        const max = num(k.specifications?.max_gpu_length_mm);
        if (max !== null && len > max) return false;
      }
    }
  }
  if (candidate.category === "case") {
    const max = num(candSpecs.max_gpu_length_mm);
    if (max !== null) {
      for (const g of byCat.get("gpu") ?? []) {
        const len = num(g.specifications?.length_mm);
        if (len !== null && len > max) return false;
      }
    }
  }

  // Case ↔ air cooler height
  if (candidate.category === "cooler" && !isLiquidCooler(candidate)) {
    const h = num(candSpecs.height_mm);
    if (h !== null) {
      for (const k of byCat.get("case") ?? []) {
        const max = num(k.specifications?.max_cooler_height_mm);
        if (max !== null && h > max) return false;
      }
    }
  }
  if (candidate.category === "case") {
    const max = num(candSpecs.max_cooler_height_mm);
    if (max !== null) {
      for (const cool of byCat.get("cooler") ?? []) {
        if (isLiquidCooler(cool)) continue;
        const h = num(cool.specifications?.height_mm);
        if (h !== null && h > max) return false;
      }
    }
  }

  // Case ↔ AIO radiator
  if (candidate.category === "cooler" && isLiquidCooler(candidate)) {
    const rad = coolerRadiatorMm(candidate);
    if (rad !== null) {
      for (const k of byCat.get("case") ?? []) {
        const max = caseMaxRadiatorMm(k);
        if (max !== null && rad > max) return false;
      }
    }
  }
  if (candidate.category === "case") {
    const max = caseMaxRadiatorMm(candidate);
    if (max !== null) {
      for (const cool of byCat.get("cooler") ?? []) {
        if (!isLiquidCooler(cool)) continue;
        const rad = coolerRadiatorMm(cool);
        if (rad !== null && rad > max) return false;
      }
    }
  }

  return true;
}

function num(v: unknown): number | null {
  if (v == null || v === "") return null;
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
}

export function isM2Drive(c: Component): boolean {
  const specs = c.specifications ?? {};
  const iface = String(specs.interface ?? specs.type ?? "").toLowerCase();
  const form = String(specs.form_factor ?? "").toLowerCase();
  if (iface.includes("m.2") || iface.includes("nvme") || form.replace(/[.\s]/g, "").includes("m2")) {
    return true;
  }
  return /\bm\.?2\b|\bnvme\b/i.test(c.name);
}

export function isLiquidCooler(c: Component): boolean {
  const specs = c.specifications ?? {};
  if (coolerRadiatorMm(c) !== null) return true;
  const kind = String(specs.type ?? specs.cooler_type ?? "").toLowerCase();
  return kind.includes("aio") || kind.includes("liquid") || kind.includes("vodeno");
}

const RAD_RE = /\b(120|140|240|280|360|420)\s*mm\b/i;
const RAD_MODEL_RE =
  /\b(?:kraken|liquid freezer|freezer|lc|aio|cooler|hladnjak|hlađenje|vodeno)[^\d]{0,10}(120|140|240|280|360|420)\b/i;

export function coolerRadiatorMm(c: Component): number | null {
  const specs = c.specifications ?? {};
  const direct = num(specs.radiator_mm) ?? num(specs.radiator_size_mm);
  if (direct !== null) return direct;
  const m = RAD_RE.exec(c.name) || RAD_MODEL_RE.exec(c.name);
  return m ? Number(m[1]) : null;
}

export function caseMaxRadiatorMm(c: Component): number | null {
  const specs = c.specifications ?? {};
  const direct = num(specs.max_radiator_mm) ?? num(specs.radiator_support_mm);
  if (direct !== null) return direct;
  const sizes = [...c.name.matchAll(/\b(120|140|240|280|360|420)(?!\d)/g)].map((m) => Number(m[1]));
  return sizes.length ? Math.max(...sizes) : null;
}
