import { expect, test } from '@playwright/test';

test.describe('alerts', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/alerts');
  });

  test('checks for alerts and alert text', async ({ page }) => {
    await expect(page.locator('h2[data-id=alerts]')).toContainText('Alerts');

    const actionAlert = page.locator('[data-type]').filter({ has: page.locator('[data-id=alert-action]') }).first();
    const closeAlert = page.locator('[data-type]').filter({ has: page.locator('[data-id=alert-close]') }).first();

    const actionButton = actionAlert.locator('[data-id=alert-action]');
    const closeButton = closeAlert.locator('[data-id=alert-close]');

    await expect(actionAlert).toContainText('primary (0)');

    await actionButton.click();

    await expect(actionAlert).toContainText('primary (1)');

    await expect(closeAlert).toContainText('primary (0)');

    await closeButton.click();

    await expect(closeAlert).toContainText('primary (0) (Closed)');
  });
});
