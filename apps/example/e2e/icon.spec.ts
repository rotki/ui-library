import { expect, test } from '@playwright/test';

test.describe('icons', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/icons');
  });

  test('should render SVG icons with aria-hidden', async ({ page }) => {
    await expect(page.locator('h2[data-id=icons]')).toContainText('Icons');

    // Icons are inside the content div following the h2
    const contentArea = page.locator('h2[data-id=icons] + div[data-id=content]');
    const icon = contentArea.locator('svg[aria-hidden="true"]').first();
    await expect(icon).toBeVisible();
    await expect(icon).toHaveAttribute('aria-hidden', 'true');
  });

  test('should render icons with correct dimensions', async ({ page }) => {
    const contentArea = page.locator('h2[data-id=icons] + div[data-id=content]');
    const icon = contentArea.locator('svg[aria-hidden="true"]').first();
    // Icon sizing flows through `--rui-icon-size` (fallback 1.5rem = 24px).
    // Assert the computed box instead of the deprecated `width`/`height`
    // presentation attrs — this tests what actually renders and survives
    // any future shift in the mechanism (see rotki/ui-library#512).
    await expect(icon).toHaveCSS('width', '24px');
    await expect(icon).toHaveCSS('height', '24px');
  });

  test('should render multiple icons', async ({ page }) => {
    const contentArea = page.locator('h2[data-id=icons] + div[data-id=content]');
    const icons = contentArea.locator('svg[aria-hidden="true"]');
    const count = await icons.count();
    expect(count).toBeGreaterThanOrEqual(3);
  });
});
