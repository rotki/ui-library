import { expect, test } from '@playwright/test';

test.describe('notifications', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/notification');
  });

  test.afterEach(async ({ page }) => {
    // Clean up any open notifications
    await page.keyboard.press('Escape');
  });

  test('should toggle visibility through button', async ({ page }) => {
    await expect(page.locator('[data-cy="notification-content"]')).toHaveCount(0);
    await page.locator('[data-cy="visibility-toggle"]').click();
    await expect(page.locator('[data-cy="notification-content"]')).toBeVisible();
    await expect(page.locator('[data-cy="notification-content"]')).toContainText('This is a notification');
    await page.locator('[data-cy="visibility-toggle"]').click();
    await expect(page.locator('[data-cy="notification-content"]')).toHaveCount(0);
  });

  test('should dismiss by click', async ({ page }) => {
    await expect(page.locator('[data-cy="notification-content"]')).toHaveCount(0);
    await page.locator('[data-cy="visibility-toggle"]').click();
    await expect(page.locator('[data-cy="notification-content"]')).toBeVisible();
    await page.locator('[data-cy="notification-content"]').click();
    await expect(page.locator('[data-cy="notification-content"]')).toHaveCount(0);
  });

  test('should not dismiss by click when timeout is negative', async ({ page }) => {
    const timeoutInput = page.locator('[data-cy="timeout"] input');
    await timeoutInput.clear();
    await timeoutInput.fill('-1');
    await expect(page.locator('[data-cy="notification-content"]')).toHaveCount(0);
    await page.locator('[data-cy="visibility-toggle"]').click();
    await expect(page.locator('[data-cy="notification-content"]')).toBeVisible();
    await page.locator('[data-cy="notification-content"]').click();
    await expect(page.locator('[data-cy="notification-content"]')).toBeVisible();
  });

  test('should auto dismiss on timeout', async ({ page }) => {
    const timeoutInput = page.locator('[data-cy="timeout"] input');
    await timeoutInput.clear();
    await timeoutInput.fill('100');
    await expect(page.locator('[data-cy="notification-content"]')).toHaveCount(0);
    await page.locator('[data-cy="visibility-toggle"]').click();
    await expect(page.locator('[data-cy="notification-content"]')).toBeVisible();
    // Wait for the notification to auto-dismiss after 100ms timeout
    await expect(page.locator('[data-cy="notification-content"]')).toHaveCount(0, { timeout: 5000 });
  });
});
