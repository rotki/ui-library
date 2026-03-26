import { expect, test } from '@playwright/test';

test.describe('progress indicators', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/progress');
  });

  test('should have correct ARIA attributes on progress bars', async ({ page }) => {
    const progressbar = page.locator('div[role=progressbar]').first();
    await expect(progressbar).toBeVisible();
    await expect(progressbar).toHaveAttribute('aria-valuemin', '0');
    await expect(progressbar).toHaveAttribute('aria-valuemax', '100');
    await expect(progressbar).toHaveAttribute('aria-valuenow');
  });

  test('should render linear and circular variants', async ({ page }) => {
    // Linear progress bars
    const linearProgress = page.locator('div[role=progressbar][data-variant=determinate]:not(:has(svg))').first();
    await expect(linearProgress).toBeVisible();

    // Circular progress bars
    const circularProgress = page.locator('div[role=progressbar]:has(svg)').first();
    await expect(circularProgress).toBeVisible();
    await expect(circularProgress.locator('svg')).toBeVisible();
  });

  test('should render progress with labels', async ({ page }) => {
    const labeledProgress = page.locator('text=40%').first();
    await expect(labeledProgress).toBeVisible();
  });

  test('should render all progress variants', async ({ page }) => {
    await expect(page.locator('h2[data-id=progress]')).toContainText('Progress');

    const determinateProgress = page.locator('div[role=progressbar][data-variant=determinate]:not(:has(svg))').first();
    const indeterminateProgress = page.locator('div[role=progressbar][data-variant=indeterminate]:not(:has(svg))').first();
    const bufferProgress = page.locator('div[role=progressbar][data-variant=buffer]').first();
    const circularProgress = page.locator('div[role=progressbar][data-variant=determinate]:has(svg)').first();

    await expect(determinateProgress).toBeVisible();
    await expect(indeterminateProgress).toBeVisible();
    await expect(bufferProgress).toBeVisible();
    await expect(circularProgress.locator('svg circle')).toBeVisible();
  });
});
