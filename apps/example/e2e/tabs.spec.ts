import { expect, test } from '@playwright/test';

test.describe('tabs', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/tabs');
  });

  test('should render tabs and handle navigation', async ({ page }) => {
    await expect(page.locator('h2[data-cy=tabs]')).toContainText('Tabs');

    const wrapper = page.locator('[data-cy=wrapper-0]');
    const tablist = wrapper.locator('[data-cy=tabs] [role=tablist]');

    await expect(tablist.locator('> *')).toHaveCount(6);
    await expect(tablist.locator('button:first-child')).toHaveClass(/active-tab/);
    await expect(tablist.locator('button:nth-child(2)')).toBeDisabled();

    const tabcontent = wrapper.locator('[data-cy=tab-items]');
    await expect(tabcontent).toHaveText('Tab 1 Content');

    // Click third tab
    await tablist.locator('button:nth-child(3)').click();
    await expect(tabcontent.locator('> div > div:nth-child(3)')).toBeVisible();
    await expect(tabcontent.locator('> div > div:nth-child(3)')).toHaveClass(/active-tab-item/);
    await expect(tabcontent).toHaveText('Tab 3 Content');

    // Click last tab should redirect to stepper page
    await tablist.locator('a:last-child').click();
    await expect(page).toHaveURL(/\/steppers/);
  });
});
