const { test, expect } = require('@playwright/test');

const baseUrl = 'https://the-internet.herokuapp.com/';

test('Count link elements', async ({ page }) => {
    await page.goto(baseUrl);
    const links = await page.locator('a');
    const count = await links.count();
    console.log(`Count of link elements: ${count}`);
    expect(count).toBeGreaterThanOrEqual(10);
});

test('Click all links and navigate back', async ({ page }) => {
    await page.goto(baseUrl);
    const links = await page.locator('ul li a');
    const count = await links.count();

    for (let i = 0; i < count; i++) {
        await links.nth(i).click();
        console.log('Clicked link');
        await page.goBack({ timeout: 600000 });
        await page.waitForLoadState('load'); // Ожидаем загрузки страницы
        console.log('Navigated back');
    }
});

test('Test various pages', async ({ page }) => {
    // A/B Testing
    await page.goto(`${baseUrl}abtest`);
    await page.waitForSelector('h3:has-text("A/B Test Control")', { timeout: 60000 });
    console.log(`Navigated to: ${page.url()}`);
    await page.goto(baseUrl);

    // Add/Remove Elements
    await page.goto(`${baseUrl}add_remove_elements/`);
    await page.click('button:has-text("Add Element")');
    await page.click('button:has-text("Delete")');
    console.log('Add and Remove buttons clicked');
    await page.goto(baseUrl);

    // Basic Auth
    const basicAuthUrl = 'http://admin:admin@the-internet.herokuapp.com/basic_auth/';
    await page.goto(basicAuthUrl);
    await page.waitForSelector('h3:has-text("Basic Auth")');
    console.log('Basic Auth page verified');
    await page.goto(baseUrl);

    // Broken Images
    await page.goto(`${baseUrl}broken_images`);
    const images = await page.locator('img');
    const imageCount = await images.count();

    for (let i = 0; i < imageCount; i++) {
        const isBroken = await images.nth(i).evaluate(img => img.naturalWidth === 0);
        console.log(`Image ${i + 1} is ${isBroken ? 'broken' : 'loaded correctly'}`);
    }
    await page.goto(baseUrl);

    // Challenging DOM
    await page.goto(`${baseUrl}challenging_dom`);
    const buttons = await page.locator('a.button');
    const buttonCount = await buttons.count();

    for (let i = 0; i < buttonCount; i++) {
        await buttons.nth(i).click();
        console.log(`Clicked button ${i + 1}`);
    }
    await page.goto(baseUrl);
});

test('Form Authentication', async ({ page }) => {
    await page.goto(`${baseUrl}login`);
    await page.fill('#username', 'tomsmith');
    await page.fill('#password', 'SuperSecretPassword!');
    await page.click('button[type="submit"]');
    await page.waitForSelector('h2:has-text("Secure Area")');
    console.log('Login successful');
    await page.click('a:has-text("Logout")');
    console.log('Logout successful');
});
