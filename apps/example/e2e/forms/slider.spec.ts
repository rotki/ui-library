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

  test('should display label text', async ({ page }) => {
    // Slider at index 2 has label "With Label"
    const slider = page.locator('[data-cy=slider-2]');
    await expect(slider).toContainText('With Label');

    // Slider at index 0 has no label
    const noLabelSlider = page.locator('[data-cy=slider-0]');
    const labelDiv = noLabelSlider.locator('div[class*=label]');
    await expect(labelDiv).toHaveCount(0);
  });

  test('should show thumb label when showThumbLabel is true', async ({ page }) => {
    // Sliders at index 8-9 have showThumbLabel: true
    const slider = page.locator('[data-cy=slider-8]');
    await expect(slider).toContainText('Show Thumb Label');

    const input = slider.locator('input[type="range"]');
    // Thumb label is visible when interacting
    await expect(input).toHaveValue('50');
  });

  test('should display hint text', async ({ page }) => {
    // Slider at index 12 has hint "Slider hints"
    const slider = page.locator('[data-cy=slider-12]');
    await expect(slider).toContainText('Slider hints');
  });

  test('should display error messages', async ({ page }) => {
    // Slider at index 14 has errorMessages
    const slider = page.locator('[data-cy=slider-14]');
    await expect(slider).toContainText('Slider error messages');

    const input = slider.locator('input[type="range"]');
    await expect(input).toHaveAttribute('aria-invalid', 'true');
  });

  test('should display success messages', async ({ page }) => {
    // Slider at index 15 has successMessages
    const slider = page.locator('[data-cy=slider-15]');
    await expect(slider).toContainText('Slider success messages');
  });

  test('should have aria-label on input when label is provided', async ({ page }) => {
    // Slider at index 2 has label "With Label"
    const input = page.locator('[data-cy=slider-2] input[type="range"]');
    await expect(input).toHaveAttribute('aria-label', 'With Label');

    // Slider at index 0 has no label, so aria-label should not be present
    const noLabelInput = page.locator('[data-cy=slider-0] input[type="range"]');
    await expect(noLabelInput).not.toHaveAttribute('aria-label');
  });

  test('should have aria-valuetext reflecting current value', async ({ page }) => {
    const input = page.locator('[data-cy=slider-0] input[type="range"]');
    await expect(input).toHaveAttribute('aria-valuetext', '50');

    await input.fill('25');
    await expect(input).toHaveAttribute('aria-valuetext', '25');
  });

  test('should not be interactable when disabled', async ({ page }) => {
    // Slider at index 4 is disabled
    const slider = page.locator('[data-cy=slider-4]');
    const input = slider.locator('input[type="range"]');

    await expect(input).toBeDisabled();
    await expect(input).toHaveValue('50');

    // Ticks and thumb label should not render when disabled
    await expect(slider.locator('div[class*=slider__ticks]')).toHaveCount(0);
    await expect(slider.locator('div[class*=slider__thumb_label]')).toHaveCount(0);
  });

  test('should update value with keyboard interaction', async ({ page }) => {
    const input = page.locator('[data-cy=slider-0] input[type="range"]');
    await expect(input).toHaveValue('50');

    await input.focus();
    await page.keyboard.press('ArrowRight');
    await expect(input).toHaveValue('51');

    await page.keyboard.press('ArrowLeft');
    await expect(input).toHaveValue('50');
  });
});
