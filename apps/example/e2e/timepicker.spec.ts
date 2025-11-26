import { expect, test } from '@playwright/test';

test.describe('timepickers', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/timepickers');
  });

  test('should render timepicker with initial values', async ({ page }) => {
    await expect(page.locator('h2[data-cy=timepickers]')).toContainText('Time Pickers');

    await expect(page.locator('[class*=_rui-digit_]', { hasText: '08' }).first()).toBeVisible();
    await expect(page.locator('[class*=_rui-digit_]', { hasText: '20' }).first()).toBeVisible();
    await expect(page.getByText('PM').first()).toBeVisible();
  });

  test('should be able to select time', async ({ page }) => {
    await page.locator('.rui-hour-06').click();
    await page.locator('.rui-minute-30').click();

    await expect(page.locator('[class*=_rui-digit_]', { hasText: '06' }).first()).toBeVisible();
    await expect(page.locator('[class*=_rui-digit_]', { hasText: '30' }).first()).toBeVisible();
    await expect(page.getByText('PM').first()).toBeVisible();
  });
});
