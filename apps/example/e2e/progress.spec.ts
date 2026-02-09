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
    const linearProgress = page.locator('div[class*=progress][class*=determinate]').first();
    await expect(linearProgress).toBeVisible();

    // Circular progress bars
    const circularProgress = page.locator('div[class*=circular]').first();
    await expect(circularProgress).toBeVisible();
    await expect(circularProgress.locator('svg')).toBeVisible();
  });

  test('should render progress with labels', async ({ page }) => {
    // Progress items with showLabel (indices 3, 4, 5 in the view)
    const labeledProgress = page.locator('div[class*=has-label]').first();
    await expect(labeledProgress).toBeVisible();
    await expect(labeledProgress).toContainText('40%');
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
