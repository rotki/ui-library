import { expect, test } from '@playwright/test';

test.describe('navigation drawer', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/navigation-drawers');
    // Ensure no drawers are open at the start of each test
    await expect(page.locator('aside[class*=_visible]')).toHaveCount(0);
  });

  test.afterEach(async ({ page }) => {
    // Clean up any open drawers
    await page.keyboard.press('Escape');
  });

  test('check non-persistent navigation-drawer', async ({ page }) => {
    await expect(page.locator('h2[data-cy=navigation-drawers]')).toContainText('Navigation Drawers');

    const defaultDrawer = page.locator('div[data-cy=navigation-drawer-0]');

    // open drawer
    const activator = defaultDrawer.locator('[data-cy=activator]');
    await activator.click();
    // Wait for the aside element with visible class to appear (drawer is open)
    await expect(page.locator('aside[class*=_visible]')).toBeVisible();

    // should close the drawer by clicking outside (temporary drawer uses onClickOutside)
    // clicking on h2 closes the drawer since it's outside the aside content
    await page.locator('h2[data-cy=navigation-drawers]').click();
    // After closing, there should be no visible drawer (no aside with _visible class)
    await expect(page.locator('aside[class*=_visible]')).toHaveCount(0);
  });

  test('check persistent drawer', async ({ page }) => {
    const defaultDrawer = page.locator('div[data-cy=navigation-drawer-2]');

    // open drawer
    const activator = defaultDrawer.locator('[data-cy=activator]');
    await activator.click();
    // Wait for the aside element with visible class to appear
    await expect(page.locator('aside[class*=_visible]')).toBeVisible();

    // should not close the drawer when clicking elsewhere (temporary: false)
    await page.locator('h2[data-cy=navigation-drawers]').click();
    // The drawer should still be visible
    await expect(page.locator('aside[class*=_visible]')).toBeVisible();
  });
});
