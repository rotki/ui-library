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

    // should not close the dialog
    await page.locator('div[role=dialog] div[class*=_overlay_]').click({ force: true });
    await expect(page.locator('div[role=dialog]')).toBeVisible();

    // close the dialog
    await page.locator('button[data-cy=close]').click();
    await expect(page.locator('div[role=dialog]')).toHaveCount(0);
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

    // should close the dialog too
    await page.locator('div[role=dialog] div[class*=_overlay_]').click({ force: true });
    await expect(page.locator('div[role=dialog]')).toHaveCount(0);
  });
});
