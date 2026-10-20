import { expect, test } from '@playwright/test';

test.describe('forms/TextField', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/text-fields');
  });

  test('checks for text-fields', async ({ page }) => {
    await expect(page.locator('h2[data-id=text-fields]').first()).toContainText('Text Fields');

    // Select the first grid (text fields) immediately after the h2, not the revealable text fields section
    const textFieldsGrid = page.locator('h2[data-id=text-fields]').first().locator('+ div');
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

  test('a long error is clamped to two lines with the full text in its title', async ({ page }) => {
    const long = page.getByTestId('text-field-long-error').locator('[data-id=details-error]');
    const short = page.getByTestId('text-field-short-error').locator('[data-id=details-error]');

    // 4px above two 16px lines
    await expect(long).toHaveCSS('height', '36px');
    await expect(long).toHaveAttribute('title', /did not answer within 30 seconds.*try again\.$/);
    await expect(short).toHaveCSS('height', '20px');
    await expect(short).not.toHaveAttribute('title');
  });
});
