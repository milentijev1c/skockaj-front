import { expect, test } from "@playwright/test";

test.describe("error pages", () => {
  test("unknown URL shows branded 404 with CTAs", async ({ page }) => {
    const res = await page.goto("/nepostojuca-stranica-xyz");
    expect(res?.status()).toBe(404);

    await expect(page.getByRole("heading", { name: /404 — Stranica nije pronađena/ })).toBeVisible();
    await expect(page.getByRole("link", { name: "Nazad na početnu" })).toBeVisible();
    await expect(page.getByRole("link", { name: "Pogledaj komponente" })).toBeVisible();

    await page.getByRole("link", { name: "Nazad na početnu" }).click();
    await expect(page).toHaveURL(/\/$/);
  });

  test("unknown product id shows Proizvod nije pronađen", async ({ page }) => {
    const res = await page.goto("/komponente/999999999");
    expect(res?.status()).toBe(404);
    await expect(page.getByRole("heading", { name: "Proizvod nije pronađen" })).toBeVisible();
    await expect(page.getByRole("link", { name: "Nazad na komponente" })).toBeVisible();
  });

  test("runtime error shows branded recovery UI", async ({ page }) => {
    await page.goto("/error-demo");
    await expect(page.getByRole("heading", { name: "Došlo je do greške" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Pokušaj ponovo" })).toBeVisible();

    // Retry re-renders the segment — demo page throws again, UI stays recoverable
    await page.getByRole("button", { name: "Pokušaj ponovo" }).click();
    await expect(page.getByRole("heading", { name: "Došlo je do greške" })).toBeVisible();

    await page.getByRole("main").getByRole("link", { name: "Početna" }).click();
    await expect(page).toHaveURL(/\/$/);
  });

  test("404 respects theme tokens (light)", async ({ page }) => {
    await page.goto("/");
    await page.evaluate(() => localStorage.setItem("skockaj-theme", "light"));
    await page.goto("/nepostojuca-stranica-xyz");
    await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
    const bg = await page.evaluate(() => getComputedStyle(document.body).backgroundColor);
    // light bg is near-white (#FAFAF8)
    expect(bg).toMatch(/250,\s*250,\s*248|255,\s*255,\s*255/);
  });
});
