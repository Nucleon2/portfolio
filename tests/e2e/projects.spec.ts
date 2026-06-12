import { test, expect } from "@playwright/test";
import { PortfolioPage } from "../pages/PortfolioPage";
import { projects } from "../../src/data/projects";

test.describe("Projects", () => {
  let portfolio: PortfolioPage;

  test.beforeEach(async ({ page }) => {
    portfolio = new PortfolioPage(page);
    await portfolio.goto();
  });

  test("renders every project panel with its title", async () => {
    await expect(portfolio.projectPanels()).toHaveCount(projects.length);
    for (const project of projects) {
      await expect(
        portfolio.projectPanel(project.id).getByTestId("project-title"),
      ).toHaveText(project.name);
    }
  });

  test("each project links to its source on GitHub in a new tab", async () => {
    for (const project of projects) {
      const source = portfolio.projectPanel(project.id).getByTestId("project-source");
      await expect(source).toHaveAttribute("href", project.github);
      await expect(source).toHaveAttribute("target", "_blank");
      await expect(source).toHaveAttribute("rel", /noopener/);
    }
  });

  test("shows a Live button only for projects that have a live URL", async () => {
    for (const project of projects) {
      const live = portfolio.projectPanel(project.id).getByTestId("project-live");
      await expect(live).toHaveCount(project.liveUrl ? 1 : 0);
    }
  });
});
