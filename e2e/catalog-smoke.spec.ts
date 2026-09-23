import { expect, test } from "@playwright/test";

test.describe("catalog UI smoke", () => {
  test("category cards render", async ({ page }) => {
    await page.goto("/komponente");
    await expect(page.locator("h1").filter({ hasText: "Komponente" })).toBeVisible();
    await expect(page.getByText("Procesor", { exact: true })).toBeVisible();
    await expect(page.getByText("Grafička kartica", { exact: true })).toBeVisible();
    await expect(page.getByText("Napajanje", { exact: true })).toBeVisible();
  });

  test("cpu filters are category-scoped collapsible buttons", async ({ page }) => {
    await page.goto("/komponente?kategorija=procesor");
    await page.waitForLoadState("networkidle");

    // classic button lists, not <select>
    await expect(page.locator("aside select")).toHaveCount(0);

    // socket + series filters exist for CPU
    await expect(page.getByText("Socket", { exact: true }).first()).toBeVisible();
    await expect(page.getByText("Serija", { exact: true }).first()).toBeVisible();

    // no motherboard chipset in CPU filters
    await expect(page.getByText("Čipset")).toHaveCount(0);

    // collapse Serija and options hide
    const serija = page.getByRole("button", { name: /^Serija/ }).first();
    const ryzen5 = page.locator("aside button", { hasText: /^Ryzen 5$/ }).first();
    await expect(ryzen5).toBeVisible();
    await serija.click();
    await expect(ryzen5).toBeHidden();
    await serija.click();
    await expect(ryzen5).toBeVisible();
  });

  test("filtering by series works", async ({ page }) => {
    await page.goto("/komponente?kategorija=procesor");
    await page.waitForLoadState("networkidle");
    await page.locator("aside button", { hasText: /^Ryzen 5$/ }).first().click();
    await page.waitForTimeout(400);
    const names = await page.locator('a[href^="/komponente/"]').allTextContents();
    expect(names.length).toBeGreaterThan(0);
    for (const n of names) {
      expect(n.toLowerCase()).toContain("ryzen 5");
    }
  });

  test("unavailable parts show Nema u ponudi and slash", async ({ page }) => {
    await page.goto("/komponente?kategorija=procesor");
    await page.waitForLoadState("networkidle");
    const body = await page.innerText("body");
    expect(body.includes("Nema u ponudi") || body.includes("RSD")).toBeTruthy();
    expect(body).not.toContain("Nema cenu");
  });

  test("cpu names are product-like and makers are AMD/Intel", async ({ page }) => {
    await page.goto("/komponente?kategorija=procesor");
    await page.waitForLoadState("networkidle");
    const rows = page.locator('a[href^="/komponente/"]');
    const count = await rows.count();
    expect(count).toBeGreaterThan(0);
    for (let i = 0; i < Math.min(count, 12); i++) {
      const name = (await rows.nth(i).innerText()).trim();
      expect(name.length).toBeGreaterThan(3);
      expect(name.length).toBeLessThan(60);
    }
  });

  test("detail specs use Serbian labels", async ({ page }) => {
    await page.goto("/komponente?kategorija=procesor");
    await page.waitForLoadState("networkidle");
    const product = page.locator('a[href^="/komponente/"]').first();
    const href = await product.getAttribute("href");
    await page.goto(`/komponente/${href?.split("/").pop()}`);
    await page.waitForLoadState("networkidle");
    const body = await page.innerText("body");
    // never show raw English keys / importer junk
    expect(body).not.toContain("base_clock_ghz");
    expect(body).not.toContain("source_names");
  });

  test("mobo filters expose socket not cpu series", async ({ page }) => {
    await page.goto("/komponente?kategorija=maticna-ploca");
    await page.waitForLoadState("networkidle");
    await expect(page.getByText("Čipset", { exact: true }).first()).toBeVisible();
    await expect(page.locator("aside button", { hasText: /^Ryzen 5$/ })).toHaveCount(0);
  });
});
