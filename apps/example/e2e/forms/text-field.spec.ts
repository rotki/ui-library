import { expect, test } from '@playwright/test';

test.describe('forms/TextField', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/text-fields');
  });

  test('checks for text-fields', async ({ page }) => {
    await expect(page.locator('h2[data-cy=text-fields]').first()).toContainText('Text Fields');

    // Select the first grid (text fields) immediately after the h2, not the revealable text fields section
    const textFieldsGrid = page.locator('h2[data-cy=text-fields]').first().locator('+ div');
    const firstText = textFieldsGrid.locator('input').first();
    const secondText = textFieldsGrid.locator('input').nth(2);
    const disabledText = textFieldsGrid.locator('input[disabled]').first();

    await expect(firstText).toHaveValue('');
    await firstText.fill('value');
    await expect(firstText).toHaveValue('value');

    await expect(secondText).toHaveValue('');
    await secondText.fill('value');
    await expect(secondText).toHaveValue('value');

    await expect(disabledText).toBeDisabled();
  });
});
