import { expect, test } from '@playwright/test';

test.describe('Logo', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/logos');
  });

  test('should render fallback image', async ({ page }) => {
    const wrapper = page.locator('[data-cy=logo-default]');
    const img = wrapper.locator('img[data-image=fallback]');

    await expect(img).toBeVisible();
    await expect(img).toHaveAttribute('alt', 'rotki');
  });

  test('should render with text', async ({ page }) => {
    const wrapper = page.locator('[data-cy=logo-text]');
    const img = wrapper.locator('img[data-image=fallback]');

    await expect(img).toBeVisible();
    await expect(wrapper).toContainText('rotki');
  });

  test('should apply custom size', async ({ page }) => {
    const wrapper = page.locator('[data-cy=logo-size]');
    const container = wrapper.locator('div').first();

    await expect(container).toHaveCSS('height', '80px'); // 5rem = 80px
  });

  test('should apply small size', async ({ page }) => {
    const wrapper = page.locator('[data-cy=logo-small]');
    const container = wrapper.locator('div').first();

    await expect(container).toHaveCSS('height', '24px'); // 1.5rem = 24px
  });
});
