import { expect, test } from "@playwright/test";

test.describe("SEO", () => {
  test("robots.txt and sitemap.xml are served", async ({ request }) => {
    const robots = await request.get("/robots.txt");
    expect(robots.ok()).toBeTruthy();
    const robotsText = await robots.text();
    expect(robotsText).toContain("Disallow: /admin");
    expect(robotsText).toContain("Sitemap: https://skockaj.rs/sitemap.xml");

    const sitemap = await request.get("/sitemap.xml");
    expect(sitemap.ok()).toBeTruthy();
    const xml = await sitemap.text();
    expect(xml).toContain("<loc>https://skockaj.rs</loc>");
    expect(xml).toContain("/komponente");
    expect(xml).toContain("kategorija=procesor");
    expect(xml).toContain("/kontakt");
  });

  test("public pages have unique titles and canonical", async ({ page }) => {
    for (const [path, titlePart] of [
      ["/", "uporedi cene"],
      ["/komponente", "Komponente"],
      ["/kontakt", "Kontakt"],
      ["/prodavnice", "Prodavnice"],
      ["/konfigurator", "Konfigurator"],
    ] as const) {
      await page.goto(path);
      const title = await page.title();
      expect(title.toLowerCase()).toContain(titlePart.toLowerCase());
      const canonical = await page.locator('link[rel="canonical"]').getAttribute("href");
      expect(canonical).toBeTruthy();
    }
  });

  test("product page emits Product and Breadcrumb JSON-LD", async ({ page }) => {
    await page.goto("/komponente/63");
    const scripts = page.locator('script[type="application/ld+json"]');
    const count = await scripts.count();
    expect(count).toBeGreaterThanOrEqual(2);

    const bodies: string[] = [];
    for (let i = 0; i < count; i++) {
      bodies.push((await scripts.nth(i).textContent()) ?? "");
    }
    const joined = bodies.join("\n");
    expect(joined).toContain('"@type":"Product"');
    expect(joined).toContain('"@type":"BreadcrumbList"');
    expect(joined).toContain("RSD");
  });

  test("home has Organization/WebSite and FAQ JSON-LD", async ({ page }) => {
    await page.goto("/");
    const scripts = page.locator('script[type="application/ld+json"]');
    const count = await scripts.count();
    expect(count).toBeGreaterThanOrEqual(2);
    const bodies: string[] = [];
    for (let i = 0; i < count; i++) {
      bodies.push((await scripts.nth(i).textContent()) ?? "");
    }
    const joined = bodies.join("\n");
    expect(joined).toContain("Organization");
    expect(joined).toContain("WebSite");
    expect(joined).toContain("FAQPage");
  });

  test("admin is not indexable", async ({ page }) => {
    await page.goto("/admin/login");
    const robots = await page.locator('meta[name="robots"]').getAttribute("content");
    expect(robots).toContain("noindex");
  });

  test("category URL has category-specific title and canonical", async ({ page }) => {
    await page.goto("/komponente?kategorija=procesor");
    expect(await page.title()).toContain("Procesori");
    const canonical = await page.locator('link[rel="canonical"]').getAttribute("href");
    expect(canonical).toContain("kategorija=procesor");
  });
});
