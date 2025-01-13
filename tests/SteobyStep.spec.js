const { test, expect } = require('@playwright/test');

test.describe('Automation Step By Step Tests', () => {

    test('Count Posters', async ({ page }) => {
        await page.goto('https://automationstepbystep.com/');
        const imgElements = await page.locator('img');
        const count = await imgElements.count();
        console.log('Количество элементов <img>: ', count);
        expect(count).toBeGreaterThanOrEqual(8);
    });

    test('Click and Change Page', async ({ page, context }) => {
        await page.goto('https://automationstepbystep.com/');

        // Click on the link
        const link = page.locator('a[title="What is DevOps"]');
        await link.click();
        console.log('нажато');

        // Wait for a new tab to open
        const [newPage] = await Promise.all([
            context.waitForEvent('page'), // Wait for a new page event
            link.click(),
        ]);

        // Wait for the new page to load
        await newPage.waitForLoadState('load');

        // Verify URL
        const actualURL = newPage.url();
        const expectedURL = 'https://www.youtube.com/playlist?list=PLhW3qG5bs-L8HKqfIp6qcAeGb3FAGDNLA';
        expect(actualURL).toBe(expectedURL);
        console.log('Current URL:', actualURL);

        // Verify element on new page
        const element = newPage.locator('a[title="What is DevOps | Explain DevOps | How DevOps work | Beginners"]');
        await expect(element).toBeVisible();
        console.log('Элемент найден: ', await element.textContent());

        // Close the new tab and return to the original page
        await newPage.close();
    });
});
