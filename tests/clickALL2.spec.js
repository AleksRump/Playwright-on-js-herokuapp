const { test, expect } = require('@playwright/test');

test.describe('Click All Links on Internet Page', () => {
    test('Click all links and verify navigation', async ({ page }) => {
        await page.goto('https://the-internet.herokuapp.com/');
        
        // Получаем все ссылки на странице
        const links = await page.locator('a');
        const count = await links.count();
        console.log(`Общее количество ссылок: ${count}`);
        expect(count).toBeGreaterThan(0);

        // Проходим по всем ссылкам
        for (let i = 0; i < count; i++) {
            // Обновляем список ссылок
            const link = links.nth(i);

            // Проверяем, видима ли ссылка
            if (await link.isVisible()) {
                const linkText = await link.innerText();
                console.log(`Нажимаем на ссылку [${i + 1}/${count}]: ${linkText}`);

                const currentUrl = page.url();

                try {
                    // Кликаем по ссылке
                    await link.click();

                    // Проверяем, что URL изменился
                    await page.waitForTimeout(500); // Короткая пауза для обработки перехода
                    const newUrl = page.url();
                    if (newUrl !== currentUrl) {
                        console.log(`Успешный переход: ${newUrl}`);
                    } else {
                        console.warn(`Переход не произошел. URL остался тем же: ${newUrl}`);
                    }

                    // Проверяем наличие элемента <h3>
                    const h3 = await page.locator('h3').first();
                    if (await h3.isVisible()) {
                        console.log(`Элемент <h3> найден: ${await h3.innerText()}`);
                    } else {
                        console.warn('Элемент <h3> не найден.');
                    }
                } catch (error) {
                    console.error(`Ошибка при переходе по ссылке "${linkText}": ${error.message}`);
                } finally {
                    // Возвращаемся на главную страницу
                    await page.goto('https://the-internet.herokuapp.com');
                    console.log('Вернулись на главную страницу.');
                }
            } else {
                console.warn(`Ссылка [${i + 1}/${count}] не видима, пропускаем.`);
            }
        }
    });
});
