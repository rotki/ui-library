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

  test('should render drawer on left by default', async ({ page }) => {
    const defaultDrawer = page.locator('div[data-cy=navigation-drawer-0]');
    await defaultDrawer.locator('[data-cy=activator]').click();

    const aside = page.locator('aside[class*=_visible]');
    await expect(aside).toBeVisible();
    // Left drawer should have left position class
    await expect(aside).toHaveClass(/\b_left_/);
  });

  test('should render drawer on right with position="right"', async ({ page }) => {
    const rightDrawer = page.locator('div[data-cy=navigation-drawer-1]');
    await rightDrawer.locator('[data-cy=activator]').click();

    const aside = page.locator('aside[class*=_visible]');
    await expect(aside).toBeVisible();
    // Right drawer should have right position class
    await expect(aside).toHaveClass(/\b_right_/);
  });

  test('should show overlay when overlay prop is true', async ({ page }) => {
    const overlayDrawer = page.locator('div[data-cy=navigation-drawer-3]');
    await overlayDrawer.locator('[data-cy=activator]').click();

    const aside = page.locator('aside[class*=_visible]');
    await expect(aside).toBeVisible();

    // Overlay element should be present
    const overlay = page.locator('[data-id=overlay]');
    await expect(overlay).toBeVisible();

    // Clicking overlay should close the drawer
    await overlay.click();
    await expect(page.locator('aside[class*=_visible]')).toHaveCount(0);
  });

  test('should have aria-label on drawer', async ({ page }) => {
    const defaultDrawer = page.locator('div[data-cy=navigation-drawer-0]');
    await defaultDrawer.locator('[data-cy=activator]').click();

    const aside = page.locator('aside[class*=_visible]');
    await expect(aside).toBeVisible();
    await expect(aside).toHaveAttribute('aria-label', 'Left navigation');
  });
});
