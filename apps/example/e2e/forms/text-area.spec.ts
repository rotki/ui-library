import { expect, test } from '@playwright/test';

test.describe('forms/TextArea', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/text-areas');
  });

  test('should render text areas', async ({ page }) => {
    await expect(page.locator('h2[data-cy=text-fields]')).toContainText('Text Fields');

    const content = page.locator('[data-cy=content]');
    const textareas = content.locator('textarea:not([aria-hidden="true"])');

    await expect(textareas.first()).toBeVisible();
  });

  test('should accept input and display value', async ({ page }) => {
    const content = page.locator('[data-cy=content]');
    const firstTextarea = content.locator('textarea:not([aria-hidden="true"])').first();

    await expect(firstTextarea).toHaveValue('');
    await firstTextarea.fill('Hello World');
    await expect(firstTextarea).toHaveValue('Hello World');
  });

  test('should have disabled text areas', async ({ page }) => {
    const content = page.locator('[data-cy=content]');
    const disabledTextarea = content.locator('textarea[disabled]:not([aria-hidden="true"])').first();

    await expect(disabledTextarea).toBeDisabled();
  });

  test('should display hint text', async ({ page }) => {
    const content = page.locator('[data-cy=content]');
    const hintText = content.locator('.details >> text=Text field hint').first();

    await expect(hintText).toBeVisible();
  });

  test('should display error messages', async ({ page }) => {
    const content = page.locator('[data-cy=content]');
    const errorText = content.locator('.details >> text=Text field error message').first();

    await expect(errorText).toBeVisible();
  });

  test('should show clear button on clearable textarea with value', async ({ page }) => {
    const content = page.locator('[data-cy=content]');

    // The clearable textarea with pre-filled value 'lorem ipsum dolor' renders a clear button
    // Verify the clear button is present when the textarea has focus and a value
    const clearButton = content.locator('.clear-btn').first();
    await expect(clearButton).toBeAttached();
  });
});
