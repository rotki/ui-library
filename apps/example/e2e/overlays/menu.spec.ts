import { expect, test } from '@playwright/test';

const menuContent = 'div[role=menu] [data-id=content]';

test.describe('menu', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/menus');
    // Ensure no menus are open at the start of each test
    await expect(page.locator(menuContent)).toHaveCount(0);
  });

  test.afterEach(async ({ page }) => {
    // Clean up any open menus
    await page.keyboard.press('Escape');
  });

  test('checks for and trigger menu', async ({ page }) => {
    await expect(page.locator('h2[data-id=menus]')).toContainText('Menus');

    await expect(page.locator('[data-id=content]')).toBeVisible();
    await expect(page.locator('div[data-id=menu-0]')).toBeVisible();

    const defaultMenu = page.locator('div[data-id=menu-0]');
    const activator = defaultMenu.locator('[data-id=activator]');

    await expect(activator).toBeVisible();
    await activator.click();
    await expect(page.locator(menuContent)).toBeVisible();
    await activator.click();
    await expect(page.locator(menuContent)).toHaveCount(0);

    await activator.click();
    const content = page.locator(menuContent);
    await expect(content).toBeVisible();
    await content.hover();
    await content.click();
    await expect(page.locator(menuContent)).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(page.locator(menuContent)).toHaveCount(0);
  });

  test('disabled should not trigger menu', async ({ page }) => {
    const disabledMenu = page.locator('div[data-id=menu-4]');
    const activator = disabledMenu.locator('[data-id=activator]');

    await expect(activator).toBeDisabled();
    await expect(page.locator(menuContent)).toHaveCount(0);
  });

  test('menu should be opened on hover', async ({ page }) => {
    const menu = page.locator('div[data-id=menu-8]');
    const activator = menu.locator('[data-id=activator]');

    await activator.hover();
    await expect(page.locator(menuContent)).toBeVisible();

    // Move mouse away
    await page.mouse.move(0, 0);
    await expect(page.locator(menuContent)).toHaveCount(0);

    await activator.click();
    await expect(page.locator(menuContent)).toBeVisible();

    // Move mouse away but menu stays open because it was clicked
    await page.mouse.move(0, 0);
    await expect(page.locator(menuContent)).toBeVisible();

    await page.keyboard.press('Escape');
    await page.locator('body').click();
    await expect(page.locator(menuContent)).toHaveCount(0);
  });

  test('should have aria-expanded toggle on open/close', async ({ page }) => {
    const menu = page.locator('div[data-id=menu-0]');
    const activatorWrapper = menu.locator('[aria-haspopup=true]');

    // Initially aria-expanded should be false
    await expect(activatorWrapper).toHaveAttribute('aria-expanded', 'false');

    // Open menu
    await menu.locator('[data-id=activator]').click();
    await expect(page.locator(menuContent)).toBeVisible();
    await expect(activatorWrapper).toHaveAttribute('aria-expanded', 'true');

    // Close menu
    await page.keyboard.press('Escape');
    await expect(page.locator(menuContent)).toHaveCount(0);
    await expect(activatorWrapper).toHaveAttribute('aria-expanded', 'false');
  });

  test('should close menu when clicking outside', async ({ page }) => {
    const menu = page.locator('div[data-id=menu-0]');
    await menu.locator('[data-id=activator]').click();
    await expect(page.locator(menuContent)).toBeVisible();

    // Click outside the menu
    await page.locator('h2[data-id=menus]').click();
    await expect(page.locator(menuContent)).toHaveCount(0);
  });

  test('should not close persistent menu when clicking outside', async ({ page }) => {
    // Persistent menu is at index 16
    const menu = page.locator('div[data-id=menu-16]');
    await menu.scrollIntoViewIfNeeded();
    await menu.locator('[data-id=activator]').click();

    const content = page.locator(menuContent);
    await expect(content).toBeVisible();

    // Click outside should not close persistent menu
    await page.locator('h2[data-id=menus]').click();
    await expect(content).toBeVisible();

    // Clicking the activator again should close it
    await menu.locator('[data-id=activator]').click();
    await expect(content).toHaveCount(0);
  });

  test('should focus menu content on open and return focus to activator on close', async ({ page }) => {
    const menu = page.locator('div[data-id=menu-0]');
    const activator = menu.locator('[data-id=activator]');

    await activator.click();
    const content = page.locator(menuContent);
    await expect(content).toBeVisible();

    // Menu content should be focused
    await expect(content).toBeFocused();

    // Close via Escape
    await page.keyboard.press('Escape');
    await expect(content).toHaveCount(0);

    // Focus should return to the activator button
    await expect(activator).toBeFocused();
  });

  test('menu should be closed by clicking the menu content', async ({ page }) => {
    const menu = page.locator('div[data-id=menu-12]');
    const activator = menu.locator('[data-id=activator]');

    await activator.click();
    await expect(page.locator(menuContent)).toBeVisible();

    await page.locator('div[role=menu]').click();
    await expect(page.locator(menuContent)).toHaveCount(0);
  });
});
