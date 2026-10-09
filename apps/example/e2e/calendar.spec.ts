import { expect, test } from '@playwright/test';

test.describe('calendars', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/calendars');
  });

  test('should render calendar with selected date', async ({ page }) => {
    await expect(page.locator('h2[data-id=calendars]')).toContainText('Calendar');

    // the state, not the classes that paint it
    await expect(page.locator('[data-id="2023-01-02"]')).toHaveAttribute('aria-selected', 'true');
    await expect(page.locator('[data-id="2023-01-02"]')).toHaveClass(/bg-rui-primary-fill/);
    await expect(page.locator('[data-id="2023-01-01"]')).toHaveAttribute('aria-selected', 'false');
    await expect(page.locator('[data-id="2023-01-01"]')).not.toHaveClass(/bg-rui-primary-fill/);
    await expect(page.locator('[data-id="2023-01-03"]')).toHaveAttribute('aria-selected', 'false');
  });
});
