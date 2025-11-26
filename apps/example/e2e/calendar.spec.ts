import { expect, test } from '@playwright/test';

test.describe('calendars', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/calendars');
  });

  test('should render calendar with selected date', async ({ page }) => {
    await expect(page.locator('h2[data-cy=calendars]')).toContainText('Calendar');

    await expect(page.locator('[data-id="2023-01-02"]')).toHaveClass(/bg-rui-primary/);
    await expect(page.locator('[data-id="2023-01-02"]')).toHaveClass(/text-white/);
    await expect(page.locator('[data-id="2023-01-01"]')).not.toHaveClass(/bg-rui-primary/);
    await expect(page.locator('[data-id="2023-01-01"]')).not.toHaveClass(/text-white/);
    await expect(page.locator('[data-id="2023-01-03"]')).not.toHaveClass(/bg-rui-primary/);
    await expect(page.locator('[data-id="2023-01-03"]')).not.toHaveClass(/text-white/);
  });
});
