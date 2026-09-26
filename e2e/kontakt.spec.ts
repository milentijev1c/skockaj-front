import { expect, test } from "@playwright/test";

test.describe("kontakt page", () => {
  test("renders form with topics and nav link", async ({ page }) => {
    await page.goto("/kontakt");
    await expect(page.getByRole("heading", { name: "Javi nam se" })).toBeVisible();
    await expect(page.getByRole("form", { name: "Kontakt forma" })).toBeVisible();

    await expect(page.getByRole("button", { name: "Povratna informacija" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Prijava greške" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Predlog" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Poslovna saradnja" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Ostalo" })).toBeVisible();

    // nav link present (header, lowercase)
    await expect(page.getByRole("link", { name: "kontakt", exact: true }).first()).toBeVisible();
  });

  test("empty submit is blocked by validation", async ({ page }) => {
    await page.goto("/kontakt");
    await page.getByRole("button", { name: "Pošalji poruku" }).click();

    await expect(page.getByRole("alert").filter({ hasText: "Unesi ime" })).toBeVisible();
    await expect(page.getByRole("alert").filter({ hasText: "ispravnu email" })).toBeVisible();
    await expect(page.getByRole("alert").filter({ hasText: "najmanje 10 znakova" })).toBeVisible();
    await expect(page.getByRole("alert").filter({ hasText: "politiku privatnosti" })).toBeVisible();

    // no success state
    await expect(page.getByRole("heading", { name: "Hvala!" })).toHaveCount(0);
  });

  test("business topic reveals company field", async ({ page }) => {
    await page.goto("/kontakt");
    await expect(page.getByLabel(/Kompanija/)).toHaveCount(0);
    await page.getByRole("button", { name: "Poslovna saradnja" }).click();
    await expect(page.getByLabel(/Kompanija/)).toBeVisible();

    await page.getByRole("button", { name: "Pošalji poruku" }).click();
    await expect(page.getByRole("alert").filter({ hasText: "naziv kompanije" })).toBeVisible();
  });

  test("honeypot field is hidden from users", async ({ page }) => {
    await page.goto("/kontakt");
    await expect(page.locator("#kontakt-website")).toBeHidden();
  });
});
