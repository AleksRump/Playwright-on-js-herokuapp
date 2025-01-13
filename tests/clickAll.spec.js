const { test, expect } = require('@playwright/test');

test.describe('Click All Links on Internet Page', () => {
    test('Click all links and verify navigation', async ({ page }) => {
        await page.goto('https://the-internet.herokuapp.com');
        
        // Получаем все ссылки
        const links = await page.locator('a');
        const count = await links.count();
        console.log(`Количество ссылок: ${count}`);
        expect(count).toBeGreaterThan(0);

        // Проходим по всем ссылкам
        for (let i = 0; i < count; i++) {
            const link = links.nth(i);

            // Проверяем, видима ли ссылка
            if (await link.isVisible()) {
                const text = await link.innerText();
                console.log(`Найдена ссылка с текстом: ${text}`);
                
                // Переход по ссылке
                await link.click();
                console.log('Ссылка нажата.');

                // Проверяем наличие <h3>
                const h3 = await page.locator('h3');
                if (await h3.count() > 0) {
                    console.log(`Элемент <h3> найден: ${await h3.first().innerText()}`);
                } else {
                    console.log('Элемент <h3> не найден.');
                }

                // Возврат назад
                await page.goBack();
                console.log('Вернулись на предыдущую страницу.');
            } else {
                console.log(`Ссылка с индексом ${i} не видима, пропускаем.`);
            }
        }
    });
});