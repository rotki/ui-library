import { expect, test } from '@playwright/test';

test.describe('progress indicators', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/progress');
  });

  test('should render all progress variants', async ({ page }) => {
    await expect(page.locator('h2[data-cy=progress]')).toContainText('Progress');

    const determinateProgress = page.locator('div[class*=progress][class*=determinate]').first();
    const indeterminateProgress = page.locator('div[class*=progress][class*=indeterminate]').first();
    const bufferProgress = page.locator('div[class*=progress][class*=buffer]').first();
    const circularProgress = page.locator('div[class*=circular][class*=determinate]').first();

    await expect(determinateProgress.locator('div[class*=rail]')).toBeVisible();
    await expect(determinateProgress.locator('div[class*=determinate]')).toBeVisible();

    await expect(indeterminateProgress.locator('div[class*=rail]')).toBeVisible();
    await expect(indeterminateProgress.locator('div[class*=indeterminate]')).toBeVisible();

    await expect(bufferProgress.locator('div[class*=buffer-dots]')).toBeVisible();
    await expect(bufferProgress.locator('div[class*=buffer-rail]')).toBeVisible();
    await expect(bufferProgress.locator('div[class*=buffer]').first()).toBeVisible();

    await expect(circularProgress.locator('svg circle')).toBeVisible();
  });
});
