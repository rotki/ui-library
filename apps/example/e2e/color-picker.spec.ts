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

  test('should update color when typing hex value', async ({ page }) => {
    const picker = page.locator('div[data-cy=color-picker-0]');
    const input = picker.locator('input');

    await input.fill('ff0000');
    await input.blur();

    // Color display should reflect the new color
    const display = picker.locator('[data-cy=color-display]');
    await expect(display).toHaveCSS('background-color', 'rgb(255, 0, 0)');
  });

  test('should switch between hex and RGB input modes', async ({ page }) => {
    const picker = page.locator('div[data-cy=color-picker-1]');

    // Initially in hex mode - single input
    await expect(picker.locator('input')).toHaveCount(1);
    await expect(picker.locator('input')).toHaveValue('45858a');

    // Click toggle button to switch to RGB mode
    await picker.locator('button').click();

    // Should now have 3 RGB inputs
    const inputs = picker.locator('input');
    await expect(inputs).toHaveCount(3);

    // Switch back to hex mode
    await picker.locator('button').click();
    await expect(picker.locator('input')).toHaveCount(1);
  });

  test('should have aria-label on picker', async ({ page }) => {
    const picker = page.locator('div[data-cy=color-picker-0]');
    await expect(picker).toHaveAttribute('role', 'application');
    await expect(picker).toHaveAttribute('aria-label', 'Color picker');

    // Color board should have slider role
    const board = picker.locator('.rui-color-board');
    await expect(board).toHaveAttribute('role', 'slider');
    await expect(board).toHaveAttribute('aria-label', 'Color saturation and brightness');

    // Hue bar should have slider role
    const hue = picker.locator('.rui-color-hue');
    await expect(hue).toHaveAttribute('role', 'slider');
    await expect(hue).toHaveAttribute('aria-label', 'Hue');
  });
});
