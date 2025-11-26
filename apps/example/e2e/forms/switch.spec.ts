import { expect, test } from '@playwright/test';

test.describe('forms/Switch', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/switches');
  });

  test('checks for switches', async ({ page }) => {
    await expect(page.locator('h2[data-cy=switches]')).toContainText('Switches');

    const firstSwitch = page.locator('input[type="checkbox"]').first();
    const secondSwitch = page.locator('input[type="checkbox"]').nth(1);
    const disabledSwitch = page.locator('input[type="checkbox"][disabled]').first();

    await expect(firstSwitch).not.toBeChecked();
    await firstSwitch.click();
    await expect(firstSwitch).toBeChecked();

    await expect(secondSwitch).not.toBeChecked();
    await secondSwitch.click();
    await expect(secondSwitch).toBeChecked();

    await expect(disabledSwitch).toBeDisabled();
  });
});
