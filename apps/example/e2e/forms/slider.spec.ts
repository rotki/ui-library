import { expect, test } from '@playwright/test';

test.describe('forms/Slider', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/sliders');
  });

  test('checks for sliders', async ({ page }) => {
    await expect(page.locator('h2[data-cy=sliders]')).toContainText('Sliders');

    const firstSlider = page.locator('input[type="range"]').first();
    const secondWrapper = page.locator('[data-cy=content] > div > div').nth(2);
    const disabledSlider = page.locator('input[type="range"][disabled]').first();

    await expect(firstSlider).toHaveValue('50');
    await firstSlider.fill('30');
    await expect(firstSlider).toHaveValue('30');

    await expect(secondWrapper).toContainText('With Label');

    await expect(disabledSlider).toBeDisabled();
  });
});
