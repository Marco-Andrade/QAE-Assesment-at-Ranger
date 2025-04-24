import { test, expect, Page } from '@playwright/test';
import dotenv from 'dotenv';
import { navigateToWikipediaHomepage } from './utils/testHelpers';

dotenv.config();

const wikipediaUsername = process.env.WIKIPEDIA_USERNAME;
const wikipediaPassword = process.env.WIKIPEDIA_PASSWORD;

const authFile = 'src/auth/login.json';

/**
 * Manually create a Wikipedia account and then finish this test
 * so that it signs into Wikipedia and captures the logged-in
 * session to src/auth/login.json, so that the tests in all.test.ts
 * run as a signed in user.
 */
test('Sign in to Wikipedia', async ({ page }) => {
    if (!wikipediaUsername || !wikipediaPassword) {
        throw new Error(`Need a username and password to sign in!`);
    }

    await navigateToWikipediaHomepage(page);
    
    // Click on login link
    await page.getByRole('link', { name: 'Log in' }).click();
    
    // Fill in username and password
    await page.getByLabel('Username').fill(wikipediaUsername);
    await page.getByLabel('Password').fill(wikipediaPassword);
    
    // Click login button
    await page.getByRole('button', { name: 'Log in' }).click();
    await page.getByRole('button', { name: 'Personal tools' }).waitFor();

    await expect(page.getByRole('link', { name: 'Log in' })).not.toBeVisible();
    await expect(page.getByRole('link', { name: 'Sovaye3425' })).toBeVisible();
    
    await page.getByRole('button', { name: 'Personal tools' }).click();
    await expect(page.getByRole('link', { name: 'Preferences' })).toBeVisible();
    
    console.log('Successfully logged in as', wikipediaUsername);
    
    // Save authentication state to file
    await page.context().storageState({ path: authFile });
});
