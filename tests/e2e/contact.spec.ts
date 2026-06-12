import { test, expect } from "@playwright/test";
import { PortfolioPage } from "../pages/PortfolioPage";
import { profile } from "../../src/data/profile";

test.describe("Contact", () => {
  let portfolio: PortfolioPage;

  test.beforeEach(async ({ page }) => {
    portfolio = new PortfolioPage(page);
    await portfolio.goto();
  });

  test("the email CTA is a mailto link", async () => {
    await expect(portfolio.page.getByTestId("contact-email")).toHaveAttribute(
      "href",
      `mailto:${profile.email}`,
    );
  });

  test("social + resume links point at the right destinations", async () => {
    const cases: Array<[string, string]> = [
      ["contact-github", profile.github],
      ["contact-linkedin", profile.linkedin],
      ["contact-resume", profile.resumeUrl],
    ];
    for (const [testId, href] of cases) {
      const link = portfolio.page.getByTestId(testId);
      await expect(link).toHaveAttribute("href", href);
      await expect(link).toHaveAttribute("target", "_blank");
    }
  });
});
