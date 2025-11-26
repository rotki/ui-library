import { expect, test } from '@playwright/test';

test.describe('color pickers', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/color-pickers');
  });

  test('should render color picker with initial values', async ({ page }) => {
    await expect(page.locator('h2[data-cy=color-pickers]')).toContainText('Color Pickers');

    const firstColorPicker = page.locator('div[data-cy=color-picker-0]');
    await expect(firstColorPicker.locator('input')).toHaveValue(/000000/);

    const secondColorPicker = page.locator('div[data-cy=color-picker-1]');
    await expect(secondColorPicker.locator('input')).toHaveValue(/45858a/);
  });
});
