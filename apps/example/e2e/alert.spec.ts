import { expect, test } from '@playwright/test';

test.describe('alerts', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/alerts');
  });

  test('checks for alerts and alert text', async ({ page }) => {
    await expect(page.locator('h2[data-cy=alerts]')).toContainText('Alerts');

    // Find alerts that have action buttons and close buttons using native locators
    // Instead of finding button first and traversing up with XPath, find alert first
    const actionAlert = page.locator('div[class*=_alert_]').filter({ has: page.locator('button[class*=_action_]') }).first();
    const closeAlert = page.locator('div[class*=_alert_]').filter({ has: page.locator('button[class*=_close_]') }).first();

    const actionButton = actionAlert.locator('button[class*=_action_]');
    const closeButton = closeAlert.locator('button[class*=_close_]');

    await expect(actionAlert).toContainText('primary (0)');

    await actionButton.click();

    await expect(actionAlert).toContainText('primary (1)');

    await expect(closeAlert).toContainText('primary (0)');

    await closeButton.click();

    await expect(closeAlert).toContainText('primary (0) (Closed)');
  });
});
