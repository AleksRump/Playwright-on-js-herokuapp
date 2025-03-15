const { test, expect } = require('@playwright/test');

const baseUrl = 'https://the-internet.herokuapp.com/';

test('dont forget', async ({ page }) => {
    await page.goto(baseUrl);
    //await page.pause();
    await page.getByRole('link', { name: 'A/B Testing' }).click();
    //await expect(page.locator('h3')).toHaveText("A/B Test Control");  // Проверяем текст заголовк
    console.log(`Navigated to: ${page.url()}`);
    await page.goto(baseUrl);

    // Basic Auth
    const basicAuthUrl = 'http://admin:admin@the-internet.herokuapp.com/basic_auth/';
    await page.goto(basicAuthUrl);
    await page.waitForSelector('h3:has-text("Basic Auth")');
    console.log('Basic Auth page verified');
    await page.goto(baseUrl);

    //Form Authentication
    await page.goto(`${baseUrl}login`);
    await page.fill('#username', 'tomsmith');
    await page.fill('#password', 'SuperSecretPassword!');
    await page.click('button[type="submit"]');
    await page.waitForSelector('h2:has-text("Secure Area")');
    console.log('Login successful');
    await page.click('a:has-text("Logout")');
    console.log('Logout successful');
    await page.goto(baseUrl);

    //Digest Authentication
    await page.getByRole('link', { name: 'Digest Authentication' }).click();
    const basicAuthUrl2 = 'http://admin:admin@the-internet.herokuapp.com/digest_auth/';
    await page.goto(basicAuthUrl2);
    await page.waitForSelector('h3:has-text("Digest Auth")');
    await page.goto(baseUrl);
    console.log('finished');

});
