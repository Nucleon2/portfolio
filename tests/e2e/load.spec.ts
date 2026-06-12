import { test, expect } from "@playwright/test";
import { PortfolioPage } from "../pages/PortfolioPage";
import { profile } from "../../src/data/profile";

test.describe("Initial load", () => {
  test("shows the preloader, then reveals the hero", async ({ page }) => {
    const portfolio = new PortfolioPage(page);
    await page.goto("/");

    // Preloader is present on first paint...
    await expect(page.getByTestId("preloader")).toBeAttached();
    // ...and wipes away to reveal the hero.
    await page.getByTestId("preloader").waitFor({ state: "detached", timeout: 15_000 });

    await expect(portfolio.heroTitle).toBeVisible();
    await expect(portfolio.heroTitle).toContainText(profile.firstName);
    await expect(portfolio.heroTitle).toContainText(profile.lastName);
  });

  test("has the expected document title", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveTitle(/Ahmad Khamis/);
  });

  test("loads without uncaught page errors", async ({ page }) => {
    const errors: string[] = [];
    page.on("pageerror", (error) => errors.push(error.message));

    const portfolio = new PortfolioPage(page);
    await portfolio.goto();

    expect(errors).toEqual([]);
  });
});
