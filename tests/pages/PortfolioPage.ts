import { type Page, type Locator, expect } from "@playwright/test";

/**
 * Page Object for the single-page portfolio. Centralizes the one piece of
 * orchestration every test needs: waiting out the WebGL preloader before the
 * DOM is interactive.
 */
export class PortfolioPage {
  readonly page: Page;
  readonly preloader: Locator;
  readonly heroTitle: Locator;
  readonly sectionNav: Locator;

  constructor(page: Page) {
    this.page = page;
    this.preloader = page.getByTestId("preloader");
    this.heroTitle = page.getByTestId("hero-title");
    this.sectionNav = page.getByTestId("section-nav");
  }

  /** Navigate home and wait for the preloader to wipe away (5s WebGL failsafe guarantees it). */
  async goto() {
    await this.page.goto("/");
    await this.preloader.waitFor({ state: "detached", timeout: 15_000 });
    await expect(this.heroTitle).toBeVisible();
  }

  /** The nav dot for a given section id. */
  navLink(sectionId: string): Locator {
    return this.sectionNav.locator(`[data-section="${sectionId}"]`);
  }

  /** Click a nav dot and wait for that section to scroll into view. The site
   *  uses Lenis smooth scroll (which preventDefaults the anchor, so the URL
   *  hash never changes), so we assert the visible outcome instead. */
  async gotoSection(sectionId: string) {
    await this.navLink(sectionId).click();
    await expect(this.page.locator(`#${sectionId}`)).toBeInViewport({ ratio: 0.2 });
  }

  projectPanels(): Locator {
    return this.page.getByTestId("project-panel");
  }

  /** Scope a query to a single project's panel by its stable id. */
  projectPanel(projectId: string): Locator {
    return this.page.locator(`[data-project="${projectId}"]`);
  }
}
