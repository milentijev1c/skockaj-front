import { test } from "node:test";
import assert from "node:assert/strict";
import {
  caseMaxRadiatorMm,
  coolerRadiatorMm,
  isCompatibleWithBuild,
  isLiquidCooler,
  isM2Drive,
} from "./compat.ts";
import type { Component } from "./types.ts";

function c(partial: Partial<Component> & { category: string; name: string }): Component {
  return {
    id: partial.id ?? Math.floor(Math.random() * 1e6),
    manufacturer: partial.manufacturer ?? "Test",
    socket: partial.socket ?? null,
    ram_type: partial.ram_type ?? null,
    tdp_w: partial.tdp_w ?? 0,
    status: "approved",
    specifications: partial.specifications ?? null,
    prices: [],
    ...partial,
  } as Component;
}

test("empty build accepts everything", () => {
  assert.equal(isCompatibleWithBuild(c({ category: "cpu", name: "Ryzen" }), []), true);
});

test("cpu socket mismatch hidden", () => {
  const mobo = c({ category: "motherboard", name: "B650", socket: "AM5", ram_type: "DDR5" });
  const am5 = c({ category: "cpu", name: "7600X", socket: "AM5" });
  const am4 = c({ category: "cpu", name: "5600X", socket: "AM4" });
  assert.equal(isCompatibleWithBuild(am5, [mobo]), true);
  assert.equal(isCompatibleWithBuild(am4, [mobo]), false);
});

test("unknown socket stays visible", () => {
  const mobo = c({ category: "motherboard", name: "Mystery", socket: null });
  const am4 = c({ category: "cpu", name: "5600X", socket: "AM4" });
  assert.equal(isCompatibleWithBuild(am4, [mobo]), true);
});

test("ddr4 hidden on ddr5 board", () => {
  const mobo = c({ category: "motherboard", name: "B650", ram_type: "DDR5", socket: "AM5" });
  const ddr5 = c({ category: "ram", name: "Vengeance 32GB", ram_type: "DDR5" });
  const ddr4 = c({ category: "ram", name: "Vengeance 16GB", ram_type: "DDR4" });
  assert.equal(isCompatibleWithBuild(ddr5, [mobo]), true);
  assert.equal(isCompatibleWithBuild(ddr4, [mobo]), false);
});

test("m2 hidden when board has no slots", () => {
  const mobo = c({
    category: "motherboard",
    name: "Old",
    specifications: { m2_slots: 0 },
  });
  const nvme = c({ category: "storage", name: "Samsung 980 PRO 1TB M.2 NVMe" });
  const sata = c({ category: "storage", name: "WD Blue 1TB SATA HDD" });
  assert.equal(isCompatibleWithBuild(nvme, [mobo]), false);
  assert.equal(isCompatibleWithBuild(sata, [mobo]), true);
});

test("aio radiator vs case", () => {
  const k = c({
    category: "case",
    name: "Small",
    specifications: { max_radiator_mm: 240 },
  });
  const aio240 = c({ category: "cooler", name: "Kraken 240", specifications: { radiator_mm: 240 } });
  const aio360 = c({ category: "cooler", name: "Kraken 360", specifications: { radiator_mm: 360 } });
  assert.equal(isCompatibleWithBuild(aio240, [k]), true);
  assert.equal(isCompatibleWithBuild(aio360, [k]), false);
});

test("air cooler height vs case", () => {
  const k = c({
    category: "case",
    name: "Small",
    specifications: { max_cooler_height_mm: 155 },
  });
  const tall = c({ category: "cooler", name: "NH-D15", specifications: { height_mm: 165 } });
  const short = c({ category: "cooler", name: "NH-L9", specifications: { height_mm: 37 } });
  assert.equal(isCompatibleWithBuild(tall, [k]), false);
  assert.equal(isCompatibleWithBuild(short, [k]), true);
});

test("radiator helpers parse names", () => {
  assert.equal(coolerRadiatorMm(c({ category: "cooler", name: "NZXT Kraken 240" })), 240);
  assert.equal(caseMaxRadiatorMm(c({ category: "case", name: "supports 240/360mm rad" })), 360);
  assert.equal(isLiquidCooler(c({ category: "cooler", name: "Kraken 360" })), true);
  assert.equal(isM2Drive(c({ category: "storage", name: "990 PRO M.2 NVMe" })), true);
});
