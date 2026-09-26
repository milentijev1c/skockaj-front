import { expect, test } from "@playwright/test";

test.describe("homepage landing", () => {
  test("hero and section CTAs are present", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();

    // above-the-fold CTAs
    await expect(page.getByRole("link", { name: "Pokreni konfigurator" }).first()).toBeVisible();
    await expect(page.getByRole("link", { name: "Pregledaj komponente" }).first()).toBeVisible();

    // major sections
    await expect(page.getByRole("heading", { name: "Šta tražiš za svoj računar?" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Tri koraka do bolje cene" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Poređenje cena bez frke" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Poređenje iz domaćih prodavnica" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Česta pitanja" })).toBeVisible();

    // final CTA
    await expect(page.getByRole("link", { name: "Pokreni konfigurator" }).last()).toBeVisible();
    await expect(page.getByRole("link", { name: "Pregledaj komponente" }).last()).toBeVisible();
  });

  test("FAQ accordion expands and collapses", async ({ page }) => {
    await page.goto("/");
    const first = page.getByRole("button", { name: "Kako se ažuriraju cene?" });
    const second = page.getByRole("button", { name: "Da li moram da se registrujem?" });
    await first.scrollIntoViewIfNeeded();

    // first item open by default
    await expect(first).toHaveAttribute("aria-expanded", "true");
    await expect(second).toHaveAttribute("aria-expanded", "false");

    await second.click();
    await expect(second).toHaveAttribute("aria-expanded", "true");
    await expect(first).toHaveAttribute("aria-expanded", "false");
    await expect(page.getByText("bez naloga", { exact: false }).first()).toBeVisible();

    await second.click();
    await expect(second).toHaveAttribute("aria-expanded", "false");
  });

  test("category cards link to catalog filters", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("link", { name: "Procesor" }).first().click();
    await expect(page).toHaveURL(/kategorija=procesor/);
  });
});
