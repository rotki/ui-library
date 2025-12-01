import { expect, test } from '@playwright/test';

test.describe('forms/Checkbox', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/checkboxes');
  });

  test('checks for checkboxes', async ({ page }) => {
    await expect(page.locator('h2[data-cy=checkboxes]')).toContainText('Checkboxes');

    const firstCheckbox = page.locator('input[type="checkbox"]').first();
    const secondCheckbox = page.locator('input[type="checkbox"]').nth(1);
    const disabledCheckbox = page.locator('input[type="checkbox"][disabled]').first();

    await expect(firstCheckbox).not.toBeChecked();
    await firstCheckbox.click();
    await expect(firstCheckbox).toBeChecked();

    await expect(secondCheckbox).not.toBeChecked();
    await secondCheckbox.click();
    await expect(secondCheckbox).toBeChecked();

    await expect(disabledCheckbox).toBeDisabled();
  });
});
