import { Page, expect, test } from '@playwright/test';
import { navigateToWikipediaHomepageWithVcr } from '../utils/testHelpers';
import { WikipediaHomePage } from '../pages/home_page';

/**
 * This test was generated using Ranger's test recording tool. The test is supposed to:
 * 1. Navigate to Wikipedia's homepage
 * 2. Assert there are less than 7,000,000 articles in English
 * 3. Assert the page's text gets smaller when the 'Small' text size option is selected
 * 4. Assert the page's text gets larger when the 'Large' text size option is selected
 * 5. Assert the page's text goes back to the default size when the 'Standard' text size option is selected
 *
 * Instructions: Run the test and ensure it performs all steps described above
 *
 * Good luck!
 */
export async function run(page: Page, params: {}) {
    // Create an instance of the WikipediaHomePage class
    const homePage = new WikipediaHomePage(page);
    
    await navigateToWikipediaHomepageWithVcr(page);
    
    /** STEP: Check the total number of articles in English */
    await test.step('Check the total number of articles in English', async () => {
        // Use the instance method, not a static method
        const articleCount = await homePage.getArticleCount();

        // Assert there are less than 7,000,000 articles
        expect(
            articleCount,
            `Expected article count to be less than 7,000,000 but got ${articleCount}`
        ).toBeLessThan(7000000);
    });
    
    /** STEP: Set text size to standard for baseline measurement */
    await test.step('Set text size to standard for baseline', async () => {
        await homePage.setTextSize('Standard');
        const initialFontSize = await homePage.getFontSize();
        console.log(`Initial font size: ${initialFontSize}px`);
    });

    await test.step('Test small text size', async () => {
        // Test small text size
        await homePage.setTextSize('Small');
        await homePage.waitForFontSizeChange(homePage.fontSize.standard);

        const smallFontSize = await homePage.getFontSize();
        console.log(`Small font size: ${smallFontSize}px`);

        // Assert the text got smaller
        expect(
            smallFontSize,
            `Expected font size to be ${homePage.fontSize.small}px when 'Small' is selected, but got ${smallFontSize}px`
        ).toBe(homePage.fontSize.small);
    });

    await test.step('Test large text size', async () => {
        // Test large text size
        await homePage.setTextSize('Large');
        await homePage.waitForFontSizeChange(homePage.fontSize.small);

        const largeFontSize = await homePage.getFontSize();
        console.log(`Large font size: ${largeFontSize}px`);

        // Assert the text got larger
        expect(
            largeFontSize,
            `Expected font size to be ${homePage.fontSize.large}px when 'Large' is selected, but got ${largeFontSize}px`
        ).toBe(homePage.fontSize.large);
    });

    await test.step('Return to standard size', async () => {
        // Return to standard size
        await homePage.setTextSize('Standard');
        const finalFontSize = await homePage.getFontSize();
        console.log(`Final font size: ${finalFontSize}px`);

        // Assert the text size is back to the initial size
        expect(finalFontSize).toBe(homePage.fontSize.standard);
    });
}
