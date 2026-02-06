import { expect, test } from '@playwright/test';

test.describe('forms/RevealableTextField', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/text-fields');
  });

  test('should render with password type by default', async ({ page }) => {
    const section = page.locator('h2', { hasText: 'Revealable Text Fields' }).locator('+ div');
    const input = section.locator('input').first();

    await expect(input).toHaveAttribute('type', 'password');
  });

  test('should toggle visibility on button click', async ({ page }) => {
    const section = page.locator('h2', { hasText: 'Revealable Text Fields' }).locator('+ div');
    const input = section.locator('input').first();
    const toggleButton = section.locator('[data-id=toggle-visibility]').first();

    await expect(input).toHaveAttribute('type', 'password');

    await toggleButton.click();
    await expect(input).toHaveAttribute('type', 'text');

    await toggleButton.click();
    await expect(input).toHaveAttribute('type', 'password');
  });

  test('should have aria-label on toggle button', async ({ page }) => {
    const section = page.locator('h2', { hasText: 'Revealable Text Fields' }).locator('+ div');
    const toggleButton = section.locator('[data-id=toggle-visibility]').first();

    await expect(toggleButton).toHaveAttribute('aria-label', 'Show password');

    await toggleButton.click();
    await expect(toggleButton).toHaveAttribute('aria-label', 'Hide password');
  });

  test('should not allow toggle when disabled', async ({ page }) => {
    const section = page.locator('h2', { hasText: 'Revealable Text Fields' }).locator('+ div');
    const disabledInput = section.locator('input[disabled]').first();
    // The disabled field is the 5th item (index 4) in the revealable section
    const toggleButton = section.locator('[data-id=toggle-visibility]').nth(4);

    await expect(disabledInput).toBeDisabled();
    await expect(toggleButton).toBeDisabled();
  });

  test('should accept input value', async ({ page }) => {
    const section = page.locator('h2', { hasText: 'Revealable Text Fields' }).locator('+ div');
    const input = section.locator('input').first();

    await input.fill('my-secret-password');
    await expect(input).toHaveValue('my-secret-password');
  });

  test('should show clearable button when value present', async ({ page }) => {
    const section = page.locator('h2', { hasText: 'Revealable Text Fields' }).locator('+ div');
    // The last revealable text field has clearable=true and a pre-filled value
    const clearableInput = section.locator('input').last();

    await expect(clearableInput).toHaveValue('some values');
    await clearableInput.focus();

    const clearButton = section.locator('.clear-btn').last();
    await expect(clearButton).toBeVisible();
  });
});
