import { expect, test } from '@playwright/test';

test.describe('timezone-select', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/timezone-selects');
  });

  test.afterEach(async ({ page }) => {
    await page.keyboard.press('Escape');
  });

  test('should render the page', async ({ page }) => {
    await expect(page.getByTestId('timezone-selects')).toBeVisible();
  });

  test('should render the default Timezone label', async ({ page }) => {
    const select = page.getByTestId('timezone-select-0');
    await expect(select).toBeVisible();
    await expect(select).toContainText('Timezone');
  });

  test('should display a pre-selected timezone', async ({ page }) => {
    const select = page.getByTestId('timezone-select-1');
    await expect(select.locator('input').first()).toHaveValue('Europe/Madrid');
  });

  test('should display the selected timezone with underscores replaced by spaces', async ({ page }) => {
    const select = page.getByTestId('timezone-select-2');
    await expect(select.locator('input').first()).toHaveValue('America/New York');
  });

  test('should not open the menu when disabled', async ({ page }) => {
    const select = page.getByTestId('timezone-select-3');
    const activator = select.locator('[data-id=activator]');
    await expect(activator).toHaveAttribute('aria-disabled', 'true');
    await activator.click({ force: true });
    await expect(page.locator('div[role=menu]')).toHaveCount(0);
  });

  test('should display error messages', async ({ page }) => {
    const select = page.getByTestId('timezone-select-5');
    await expect(select).toContainText('A timezone is required');
    await expect(select.locator('input').first()).toHaveAttribute('aria-invalid', 'true');
  });

  test('should open the menu and filter timezones by search input', async ({ page }) => {
    const select = page.getByTestId('timezone-select-0');
    const activator = select.locator('[data-id=activator]');
    await activator.click();

    const menu = page.locator('div[role=menu]');
    await expect(menu).toBeVisible();

    const input = select.locator('input').first();
    await input.fill('Madrid');
    await expect(menu).toContainText('Europe/Madrid');
  });

  test('should select a timezone from the menu', async ({ page }) => {
    const select = page.getByTestId('timezone-select-0');
    const activator = select.locator('[data-id=activator]');
    await activator.click();

    const input = select.locator('input').first();
    await input.fill('Berlin');

    const menu = page.locator('div[role=menu]');
    await menu.getByText('Europe/Berlin', { exact: true }).click();

    await expect(input).toHaveValue('Europe/Berlin');
  });
});
