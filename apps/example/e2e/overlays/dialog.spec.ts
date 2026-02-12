import { expect, test } from '@playwright/test';

test.describe('dialog', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/dialogs');
  });

  test.afterEach(async ({ page }) => {
    // Clean up any open dialogs
    await page.keyboard.press('Escape');
  });

  test('check persistent dialog', async ({ page }) => {
    await expect(page.locator('h2[data-cy=dialogs]')).toContainText('Dialogs');

    const defaultDialog = page.locator('div[data-cy=dialog-0]');

    // open dialog
    const activator = defaultDialog.locator('[data-cy=activator]');
    await activator.click();
    await expect(page.locator('div[role=dialog]')).toBeVisible();

    // should not close the dialog
    await page.keyboard.press('Escape');
    await expect(page.locator('div[role=dialog]')).toBeVisible();

    // should not close the dialog (click near top-left corner where overlay is not covered by content)
    await page.locator('div[role=dialog] [data-id=overlay]').click({ position: { x: 5, y: 5 } });
    await expect(page.locator('div[role=dialog]')).toBeVisible();

    // close the dialog
    await page.locator('button[data-cy=close]').click();
    await expect(page.locator('div[role=dialog]')).toHaveCount(0);
  });

  test('should have aria-modal attribute when open', async ({ page }) => {
    const defaultDialog = page.locator('div[data-cy=dialog-0]');

    const activator = defaultDialog.locator('[data-cy=activator]');
    await activator.click();

    const dialog = page.locator('div[role=dialog]');
    await expect(dialog).toBeVisible();
    await expect(dialog).toHaveAttribute('aria-modal', 'true');

    await page.locator('button[data-cy=close]').click();
    await expect(dialog).toHaveCount(0);
  });

  test('should have aria-label attribute when provided', async ({ page }) => {
    const defaultDialog = page.locator('div[data-cy=dialog-0]');

    const activator = defaultDialog.locator('[data-cy=activator]');
    await activator.click();

    const dialog = page.locator('div[role=dialog]');
    await expect(dialog).toBeVisible();
    await expect(dialog).toHaveAttribute('aria-label', 'Persistent dialog');

    await page.locator('button[data-cy=close]').click();
    await expect(dialog).toHaveCount(0);
  });

  test('should display content inside dialog', async ({ page }) => {
    const defaultDialog = page.locator('div[data-cy=dialog-0]');

    const activator = defaultDialog.locator('[data-cy=activator]');
    await activator.click();

    const dialog = page.locator('div[role=dialog]');
    await expect(dialog).toBeVisible();
    await expect(dialog).toContainText('Contents 0');

    await page.locator('button[data-cy=close]').click();
    await expect(dialog).toHaveCount(0);
  });

  test('check non-persistent dialog', async ({ page }) => {
    const defaultDialog = page.locator('div[data-cy=dialog-1]');

    // open dialog
    const activator = defaultDialog.locator('[data-cy=activator]');
    await activator.click();
    await expect(page.locator('div[role=dialog]')).toBeVisible();

    // should close the dialog
    await page.keyboard.press('Escape');
    await expect(page.locator('div[role=dialog]')).toHaveCount(0);

    // open the dialog again
    await activator.click();
    await expect(page.locator('div[role=dialog]')).toBeVisible();

    // should close the dialog too (click near top-left corner where overlay is not covered by content)
    await page.locator('div[role=dialog] [data-id=overlay]').click({ position: { x: 5, y: 5 } });
    await expect(page.locator('div[role=dialog]')).toHaveCount(0);
  });
});
