import { expect, test } from '@playwright/test';

test.describe('Divider', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/dividers');
  });

  test('should render horizontal divider by default', async ({ page }) => {
    const wrapper = page.locator('[data-cy=divider-horizontal]');
    const divider = wrapper.locator('[role=separator]');

    await expect(divider).toBeVisible();
    await expect(divider).toHaveAttribute('aria-orientation', 'horizontal');
  });

  test('should render vertical divider', async ({ page }) => {
    const wrapper = page.locator('[data-cy=divider-vertical]');
    const divider = wrapper.locator('[role=separator]');

    await expect(divider).toBeVisible();
    await expect(divider).toHaveAttribute('aria-orientation', 'vertical');
  });
});
