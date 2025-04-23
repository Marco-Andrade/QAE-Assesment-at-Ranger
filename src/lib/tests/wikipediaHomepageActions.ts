import { Page, expect } from '@playwright/test';

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
    /** STEP: Navigate to URL */
    await page.goto('https://en.wikipedia.org/wiki/Main_Page');

    /** STEP: Check the total number of articles in English */    
    const totalArticlesLink = page.getByTitle('Special:Statistics').filter({ hasText: /\d+,\d+,\d+/ });
    const articleCountText = await totalArticlesLink.textContent();
    
    // Extract the number from the text and convert to a number
    const articleCount = parseInt(articleCountText?.replace(/,/g, '') ?? '0');
    
    // Assert there are less than 7,000,000 articles
    expect(
        articleCount, 
        `Expected article count to be less than 7,000,000 but got ${articleCount}`
    ).toBeLessThan(7000000);

    // Making sure we're starting with the standard text size
    const standardTextSizeButton = page.getByLabel('Standard').first();
    await standardTextSizeButton.click();
    
    // Get the initial font size for comparison
    const initialFontSize = await getFontSize(page);
    console.log(`Initial font size: ${initialFontSize}px`);

    /** STEP: Select the 'Small' text size option in the appearance settings */
    const smallTextSizeOption = page.getByRole('radio', { name: 'Small' });
    await smallTextSizeOption.click();
    
    // Wait for the font size to change
    await page.waitForFunction(async(targetSize) => {
        const element = document.querySelector('.mw-body-content p');
        return element && parseFloat(window.getComputedStyle(element).fontSize) !== targetSize;
      }, initialFontSize);
    
    // Get the new font size after selecting 'Small'
    const smallFontSize = await getFontSize(page);
    console.log(`Small font size: ${smallFontSize}px`);
    
    // Assert the text got smaller
    expect(
        smallFontSize, 
        `Expected font size to decrease from ${initialFontSize}px when 'Small' is selected, but got ${smallFontSize}px`
    ).toBeLessThan(initialFontSize);

    /** STEP: Click the 'Large' text size option to change the display size */
    const largeTextSizeOption = page.getByRole('radio', { name: 'Large' });
    await largeTextSizeOption.click();
    
    // Wait for the font size to change
    await page.waitForFunction(async(targetSize) => {
        const element = document.querySelector('.mw-body-content p');
        return element && parseFloat(window.getComputedStyle(element).fontSize) !== targetSize;
      }, smallFontSize);
    
    // Get the new font size after selecting 'Large'
    const largeFontSize = await getFontSize(page);
    console.log(`Large font size: ${largeFontSize}px`);
    
    // Assert the text got larger
    expect(
        largeFontSize, 
        `Expected font size to increase from ${smallFontSize}px when 'Large' is selected, but got ${largeFontSize}px`
    ).toBeGreaterThan(smallFontSize);

    /** STEP: Click the 'Standard' text size option in the appearance settings */
    await standardTextSizeButton.click();
    
    // Wait for the font size to change
    await page.waitForFunction(async(targetSize) => {
        const element = document.querySelector('.mw-body-content p');
        return element && parseFloat(window.getComputedStyle(element).fontSize) !== targetSize;
      }, largeFontSize);
    
    // Get the new font size after selecting 'Standard'
    const standardFontSize = await getFontSize(page);
    console.log(`Standard font size: ${standardFontSize}px`);

    expect(
        standardFontSize, 
        `Expected font size to return ${initialFontSize}px when 'Standard' is selected, but got ${standardFontSize}px`
    ).toEqual(initialFontSize);
}

// Helper function to get the current font size of the main content
async function getFontSize(page: Page): Promise<number> {
    return page.evaluate(() => {
        const element = document.querySelector('.mw-body-content p');
        if (!element) return 0;
        
        const computedStyle = window.getComputedStyle(element);
        return parseFloat(computedStyle.fontSize);
    });
}
