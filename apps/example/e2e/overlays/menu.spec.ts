import { expect, test } from '@playwright/test';

test.describe('menu', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/menus');
    // Ensure no menus are open at the start of each test
    await expect(page.locator('div[role=menu-content]')).toHaveCount(0);
  });

  test.afterEach(async ({ page }) => {
    // Clean up any open menus
    await page.keyboard.press('Escape');
  });

  test('checks for and trigger menu', async ({ page }) => {
    await expect(page.locator('h2[data-cy=menus]')).toContainText('Menus');

    await expect(page.locator('[data-cy=content]')).toBeVisible();
    await expect(page.locator('div[data-cy=menu-0]')).toBeVisible();

    const defaultMenu = page.locator('div[data-cy=menu-0]');
    const activator = defaultMenu.locator('[data-cy=activator]');

    await expect(activator).toBeVisible();
    await activator.click();
    await expect(page.locator('div[role=menu-content]')).toBeVisible();
    await activator.click();
    await expect(page.locator('div[role=menu-content]')).toHaveCount(0);

    await activator.click();
    const menuContent = page.locator('div[role=menu-content]');
    await expect(menuContent).toBeVisible();
    await menuContent.hover();
    await menuContent.click();
    await expect(page.locator('div[role=menu-content]')).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(page.locator('div[role=menu-content]')).toHaveCount(0);
  });

  test('disabled should not trigger menu', async ({ page }) => {
    const disabledMenu = page.locator('div[data-cy=menu-4]');
    const activator = disabledMenu.locator('[data-cy=activator]');

    await expect(activator).toBeDisabled();
    await expect(page.locator('div[role=menu-content]')).toHaveCount(0);
  });

  test('menu should be opened on hover', async ({ page }) => {
    const menu = page.locator('div[data-cy=menu-8]');
    const activator = menu.locator('[data-cy=activator]');

    await activator.hover();
    await expect(page.locator('div[role=menu-content]')).toBeVisible();

    // Move mouse away
    await page.mouse.move(0, 0);
    await expect(page.locator('div[role=menu-content]')).toHaveCount(0);

    await activator.click();
    await expect(page.locator('div[role=menu-content]')).toBeVisible();

    // Move mouse away but menu stays open because it was clicked
    await page.mouse.move(0, 0);
    await expect(page.locator('div[role=menu-content]')).toBeVisible();

    await page.keyboard.press('Escape');
    await page.locator('body').click();
    await expect(page.locator('div[role=menu-content]')).toHaveCount(0);
  });

  test('menu should be closed by clicking the menu content', async ({ page }) => {
    const menu = page.locator('div[data-cy=menu-12]');
    const activator = menu.locator('[data-cy=activator]');

    await activator.click();
    await expect(page.locator('div[role=menu-content]')).toBeVisible();

    await page.locator('div[role=menu]').click();
    await expect(page.locator('div[role=menu-content]')).toHaveCount(0);
  });
});
