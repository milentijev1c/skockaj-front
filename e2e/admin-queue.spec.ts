import { expect, test, type Page } from "@playwright/test";

const TOKEN =
  process.env.ADMIN_TOKEN || "KRrgV4lonTITJw8YeU07A4fk0JMbtgTOTxK9rwIic2g";

/** Real login → server sets httpOnly cookie (same path as production). */
async function login(page: Page) {
  const res = await page.request.post("/api/admin/session", {
    data: { token: TOKEN },
  });
  expect(res.ok(), `login failed: ${res.status()} ${await res.text()}`).toBeTruthy();
}

test.describe("admin match queue", () => {
  test("unauthenticated users are sent to login", async ({ page }) => {
    await page.goto("/admin");
    await expect(page).toHaveURL(/\/admin\/login/);
    await expect(page.getByRole("heading", { name: "prijava" })).toBeVisible();
  });

  test("login sets session and renders queue", async ({ page }) => {
    await login(page);
    await page.goto("/admin");
    await expect(page.getByRole("heading", { name: "red usklađivanja" })).toBeVisible();
    await expect(page.getByRole("button", { name: "na čekanju" })).toBeVisible();
    await expect(page.getByRole("button", { name: "odobrene" })).toBeVisible();
    await expect(page.getByRole("button", { name: "odbijene" })).toBeVisible();
  });

  test("status filter switches without crashing", async ({ page }) => {
    await login(page);
    await page.goto("/admin");
    await page.getByRole("button", { name: "odobrene" }).click();
    await expect(page.getByRole("button", { name: "odobrene" })).toBeVisible();
  });

  test("security headers present", async ({ page }) => {
    const res = await page.goto("/");
    expect(res?.headers()["x-frame-options"]).toBe("DENY");
    expect(res?.headers()["x-content-type-options"]).toBe("nosniff");
  });
});
