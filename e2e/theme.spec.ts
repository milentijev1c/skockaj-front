import { expect, test } from "@playwright/test";

test.describe("theme toggle", () => {
  test("toggle flips data-theme and icon", async ({ page }) => {
    await page.goto("/");
    const html = page.locator("html");
    const toggle = page.getByRole("button", { name: /Prebaci na (svetlu|tamnu) temu/ });

    await expect(toggle).toBeVisible();

    // default dark → moon label offers light
    await expect(html).toHaveAttribute("data-theme", "dark");
    await expect(toggle).toHaveAttribute("aria-label", "Prebaci na svetlu temu");

    await toggle.click();
    await expect(html).toHaveAttribute("data-theme", "light");
    await expect(toggle).toHaveAttribute("aria-label", "Prebaci na tamnu temu");

    await toggle.click();
    await expect(html).toHaveAttribute("data-theme", "dark");
    await expect(toggle).toHaveAttribute("aria-label", "Prebaci na svetlu temu");
  });

  test("choice persists across reload", async ({ page }) => {
    await page.goto("/");
    const html = page.locator("html");
    const toggle = page.getByRole("button", { name: /Prebaci na (svetlu|tamnu) temu/ });

    await toggle.click();
    await expect(html).toHaveAttribute("data-theme", "light");

    await page.reload();
    await expect(html).toHaveAttribute("data-theme", "light");
    await expect(
      page.getByRole("button", { name: "Prebaci na tamnu temu" }),
    ).toBeVisible();
  });
});
