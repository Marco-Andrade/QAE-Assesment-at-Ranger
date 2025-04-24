import { Page, test } from '@playwright/test';
import { withVcr } from './playwrightVcr';

/**
 * Common navigation steps that can be reused across tests
 */
export async function navigateToWikipediaHomepageWithVcr(page: Page) {
  await test.step('Navigate to Wikipedia homepage', async () => {
    await withVcr(page, 'wikipedia_homepage', async () => {
      await page.goto('https://en.wikipedia.org/wiki/Main_Page');
    });
  });
}

export async function navigateToWikipediaHomepage(page: Page) {
  await test.step('Navigate to Wikipedia homepage', async () => {
    await page.goto('https://en.wikipedia.org/wiki/Main_Page');
  });
}

export async function navigateToWikipediaSearchPage(page: Page) {
  await test.step('Navigate to Wikipedia search page', async () => {
    await page.goto('https://www.wikipedia.org/');
  });
}

export async function checkArticleCount(page: Page) {
    await test.step('Check the total number of articles in English', async () => {
        const totalArticlesLink = page.getByTitle('Special:Statistics').filter({ hasText: /\d+,\d+,\d+/ });
        const articleCountText = await totalArticlesLink.textContent();

    // Extract the number from the text and convert to a number
    const articleCount = parseInt(articleCountText?.replace(/,/g, '') ?? '0');

    await page.pause();

    // Assert there are less than 7,000,000 articles
    expect(
      articleCount,
      `Expected article count to be less than 7,000,000 but got ${articleCount}`
    ).toBeLessThan(7000000);
  });
}
