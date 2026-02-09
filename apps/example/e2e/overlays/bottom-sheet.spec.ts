import { expect, test } from '@playwright/test';

test.describe('bottom-sheet', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/bottom-sheets');
  });

  test.afterEach(async ({ page }) => {
    // Clean up any open bottom sheets
    await page.keyboard.press('Escape');
  });

  test('check persistent bottom sheet', async ({ page }) => {
    await expect(page.locator('h2[data-cy=bottom-sheets]')).toContainText('Bottom Sheets');

    const defaultBottomSheet = page.locator('div[data-cy=bottom-sheet-0]');

    // open bottom sheet
    const activator = defaultBottomSheet.locator('[data-cy=activator]');
    await activator.click();
    await expect(page.locator('div[role=dialog]')).toBeVisible();

    // should not close the bottom sheet
    await page.keyboard.press('Escape');
    await expect(page.locator('div[role=dialog]')).toBeVisible();

    // should not close the bottom sheet
    await page.locator('div[role=dialog] [data-id=overlay]').click({ force: true });
    await expect(page.locator('div[role=dialog]')).toBeVisible();

    // close the bottom sheet
    await page.locator('button[data-cy=close]').click();
    await expect(page.locator('div[role=dialog]')).toHaveCount(0);
  });

  test('check non-persistent bottom sheet', async ({ page }) => {
    const defaultBottomSheet = page.locator('div[data-cy=bottom-sheet-1]');

    // open bottom sheet
    const activator = defaultBottomSheet.locator('[data-cy=activator]');
    await activator.click();
    await expect(page.locator('div[role=dialog]')).toBeVisible();

    // should close the bottom sheet
    await page.keyboard.press('Escape');
    await expect(page.locator('div[role=dialog]')).toHaveCount(0);

    // open the bottom sheet again
    await activator.click();
    await expect(page.locator('div[role=dialog]')).toBeVisible();

    // should close the bottom sheet too
    await page.locator('div[role=dialog] [data-id=overlay]').click({ force: true });
    await expect(page.locator('div[role=dialog]')).toHaveCount(0);
  });

  test('should have aria-modal attribute when open', async ({ page }) => {
    const defaultBottomSheet = page.locator('div[data-cy=bottom-sheet-0]');

    const activator = defaultBottomSheet.locator('[data-cy=activator]');
    await activator.click();

    const dialog = page.locator('div[role=dialog]');
    await expect(dialog).toBeVisible();
    await expect(dialog).toHaveAttribute('aria-modal', 'true');

    await page.locator('button[data-cy=close]').click();
    await expect(dialog).toHaveCount(0);
  });

  test('should apply custom width to bottom sheet content', async ({ page }) => {
    const defaultBottomSheet = page.locator('div[data-cy=bottom-sheet-0]');

    const activator = defaultBottomSheet.locator('[data-cy=activator]');
    await activator.click();

    const dialog = page.locator('div[role=dialog]');
    await expect(dialog).toBeVisible();

    const content = dialog.locator('[data-id=content]');
    await expect(content).toHaveCSS('width', '900px');

    await page.locator('button[data-cy=close]').click();
    await expect(dialog).toHaveCount(0);
  });
});
