import { expect, test } from '@playwright/test';

test.describe('icons', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/icons');
  });

  test('should render SVG icons with aria-hidden', async ({ page }) => {
    await expect(page.locator('h2[data-cy=icons]')).toContainText('Icons');

    // Icons are inside the content div following the h2
    const contentArea = page.locator('h2[data-cy=icons] + div[data-cy=content]');
    const icon = contentArea.locator('svg[aria-hidden="true"]').first();
    await expect(icon).toBeVisible();
    await expect(icon).toHaveAttribute('aria-hidden', 'true');
  });

  test('should render icons with correct dimensions', async ({ page }) => {
    const contentArea = page.locator('h2[data-cy=icons] + div[data-cy=content]');
    const icon = contentArea.locator('svg[aria-hidden="true"]').first();
    await expect(icon).toHaveAttribute('width', '24');
    await expect(icon).toHaveAttribute('height', '24');
  });

  test('should render multiple icons', async ({ page }) => {
    const contentArea = page.locator('h2[data-cy=icons] + div[data-cy=content]');
    const icons = contentArea.locator('svg[aria-hidden="true"]');
    const count = await icons.count();
    expect(count).toBeGreaterThanOrEqual(3);
  });
});
