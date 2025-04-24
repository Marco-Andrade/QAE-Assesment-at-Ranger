import { Page, Locator, expect } from '@playwright/test';

/**
 * Page Object Model for Wikipedia Home Page
 * Encapsulates all interactions and elements on the Wikipedia home page
 */
export class WikipediaHomePage {
  readonly page: Page;
  
  // Common elements
  readonly searchInput: Locator;
  readonly articleCountElement: Locator;
  readonly loginLink: Locator;
  readonly personalToolsButton: Locator;
  
  // Appearance settings
  readonly appearanceButton: Locator;
  readonly standardTextSizeButton: Locator;
  readonly smallTextSizeOption: Locator;
  readonly largeTextSizeOption: Locator;

  readonly fontSize = {
    small: 14,
    standard: 16,
    large: 20
  }
  
  constructor(page: Page) {
    this.page = page;
    
    // Common elements
    this.searchInput = page.getByRole('searchbox', { name: 'Search Wikipedia' });
    this.articleCountElement = page.getByTitle('Special:Statistics').filter({ hasText: /\d+,\d+,\d+/ });
    this.loginLink = page.getByRole('link', { name: 'Log in' });
    this.personalToolsButton = page.getByRole('button', { name: 'Personal tools' });
    
    // Appearance settings
    this.appearanceButton = page.getByRole('button', { name: 'Appearance' });
    this.standardTextSizeButton = page.getByLabel('Standard').first();
    this.smallTextSizeOption = page.getByRole('radio', { name: 'Small' });
    this.largeTextSizeOption = page.getByRole('radio', { name: 'Large' });
  }

  /**
   * Navigates to the login page
   */
  async navigateToLogin() {
    await this.loginLink.click();
  }

  /**
   * Gets the current article count as a number
   * @returns The current article count
   */
  async getArticleCount(): Promise<number> {
    const text = await this.articleCountElement.textContent();
    return parseInt(text?.replace(/,/g, '') ?? '0');
  }

  /**
   * Sets the text size to the specified option
   * @param size The text size to set (Small, Standard, or Large)
   */
  async setTextSize(size: 'Small' | 'Standard' | 'Large') {    
    if (size === 'Small') {
      await this.smallTextSizeOption.click();
    } else if (size === 'Large') {
      await this.largeTextSizeOption.click();
    } else {
      await this.standardTextSizeButton.click();
    }
  }

  /**
   * Gets the current font size of the main content
   * @returns The font size in pixels
   */
  async getFontSize(): Promise<number> {
    return this.page.evaluate(() => {
      const element = document.querySelector('.mw-body-content p');
      if (!element) return 0;
      
      const computedStyle = window.getComputedStyle(element);
      return parseFloat(computedStyle.fontSize);
    });
  }

  /**
   * Waits for the font size to change from the provided baseline
   * @param baselineFontSize The font size to compare against
   */
  async waitForFontSizeChange(baselineFontSize: number): Promise<void> {
    await this.page.waitForFunction(async(targetSize) => {
      const element = document.querySelector('.mw-body-content p');
      return element && parseFloat(window.getComputedStyle(element).fontSize) !== targetSize;
    }, baselineFontSize);
  }

  /**
   * Verifies that the user is logged in
   * @param username The expected username
   */
  async verifyLoggedIn(username: string): Promise<void> {
    await expect(this.loginLink).not.toBeVisible();
    await this.personalToolsButton.click();
    await expect(this.page.getByRole('link', { name: username })).toBeVisible();
    await expect(this.page.getByRole('link', { name: 'Preferences' })).toBeVisible();
  }

  /**
   * Searches for a term in the search input
   * @param searchTerm The term to search for
   */
  async search(searchTerm: string): Promise<void> {
    await this.searchInput.fill(searchTerm);
  }

  /**
   * Clicks on a suggestion in the search dropdown
   * @param suggestionText The text of the suggestion to click
   */
  async clickSearchSuggestion(suggestionText: string): Promise<void> {
    await this.page.getByRole('link', { name: suggestionText }).click();
  }
}