import { expect, test } from '@playwright/test';

test.describe('forms/Auto Completes', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/auto-completes');
  });

  test('rendered properly', async ({ page }) => {
    await expect(page.locator('h2[data-cy=auto-completes]')).toContainText('Auto Completes');

    const firstAutoComplete = page.locator('div[data-cy=auto-complete-0]');

    await expect(firstAutoComplete).toBeVisible();
    await expect(firstAutoComplete.locator('span[class*=_label_]')).toContainText('Select');

    await expect(page.locator('div[role=menu]')).toHaveCount(0);

    await firstAutoComplete.click();

    await expect(page.locator('div[role=menu]')).toBeVisible();
    await page.locator('div[role=menu] button:first-child').click();

    await expect(firstAutoComplete.locator('input')).toHaveValue('Germany');
  });
});
