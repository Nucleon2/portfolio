import { test, expect } from "@playwright/test";

test.describe("SEO endpoints", () => {
  test("serves a sitemap", async ({ request }) => {
    const res = await request.get("/sitemap.xml");
    expect(res.status()).toBe(200);
    expect(res.headers()["content-type"]).toContain("xml");
  });

  test("serves robots.txt", async ({ request }) => {
    const res = await request.get("/robots.txt");
    expect(res.status()).toBe(200);
  });

  test("embeds Person JSON-LD in the page head", async ({ page }) => {
    await page.goto("/");
    const raw = await page
      .locator('script[type="application/ld+json"]')
      .first()
      .textContent();
    expect(raw).toBeTruthy();

    const data = JSON.parse(raw!);
    expect(data["@type"]).toBe("Person");
    expect(data.name).toBe("Ahmad Khamis");
  });
});
