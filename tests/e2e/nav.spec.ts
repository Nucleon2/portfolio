import { test, expect } from "@playwright/test";
import { PortfolioPage } from "../pages/PortfolioPage";
import { sections } from "../../src/lib/sections";
import { profile } from "../../src/data/profile";

test.describe("Navigation", () => {
  let portfolio: PortfolioPage;

  test.beforeEach(async ({ page }) => {
    portfolio = new PortfolioPage(page);
    await portfolio.goto();
  });

  test("renders a nav dot for every section", async () => {
    await expect(portfolio.sectionNav.getByTestId("nav-link")).toHaveCount(sections.length);
    for (const section of sections) {
      await expect(portfolio.navLink(section.id)).toHaveAttribute("aria-label", section.label);
    }
  });

  test("clicking a nav dot scrolls that section into view", async () => {
    await portfolio.gotoSection("about");
    await expect(portfolio.navLink("about")).toHaveAttribute("aria-current", "true");
  });

  test("the logo returns to the hero", async ({ page }) => {
    await portfolio.gotoSection("contact");
    await page.getByTestId("nav-logo").click();
    await expect(page.getByTestId("hero")).toBeInViewport();
  });

  test("the résumé link opens the PDF in a new tab", async () => {
    const resume = portfolio.page.getByTestId("nav-resume");
    await expect(resume).toHaveAttribute("href", profile.resumeUrl);
    await expect(resume).toHaveAttribute("target", "_blank");
    await expect(resume).toHaveAttribute("rel", /noopener/);
  });
});
