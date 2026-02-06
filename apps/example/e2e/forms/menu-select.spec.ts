import { expect, test } from '@playwright/test';

test.describe('menu-select - index', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/menu-selects');
  });

  test('should render navigation links', async ({ page }) => {
    await expect(page.locator('[data-cy=menu-selects-index]')).toBeVisible();
    await expect(page.locator('[data-cy="link-/menu-selects/basic"]')).toBeVisible();
    await expect(page.locator('[data-cy="link-/menu-selects/selection"]')).toBeVisible();
    await expect(page.locator('[data-cy="link-/menu-selects/readonly"]')).toBeVisible();
    await expect(page.locator('[data-cy="link-/menu-selects/custom"]')).toBeVisible();
  });

  test('should navigate to sub-routes', async ({ page }) => {
    await page.locator('[data-cy="link-/menu-selects/basic"]').click();
    await expect(page.locator('[data-cy=menu-selects-basic]')).toBeVisible();
  });
});

test.describe('menu-select - basic', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/menu-selects/basic');
  });

  test.afterEach(async ({ page }) => {
    await page.keyboard.press('Escape');
  });

  test('should render default variant with pre-selected value', async ({ page }) => {
    const ms = page.locator('[data-cy=ms-basic-default]');
    await expect(ms).toBeVisible();
    await expect(ms.locator('[data-id=activator]')).toContainText('Germany');
  });

  test('should render outlined variant', async ({ page }) => {
    const ms = page.locator('[data-cy=ms-basic-outlined]');
    await expect(ms).toBeVisible();
    await expect(ms.locator('fieldset')).toBeVisible();
    await expect(ms.locator('[data-id=activator]')).toContainText('Germany');
  });

  test('should render dense variant', async ({ page }) => {
    const ms = page.locator('[data-cy=ms-basic-dense]');
    await expect(ms).toBeVisible();
    await expect(ms.locator('[data-id=activator]')).toContainText('Germany');
  });

  test('should not open menu when disabled', async ({ page }) => {
    const ms = page.locator('[data-cy=ms-basic-disabled]');
    const activator = ms.locator('[data-id=activator]');
    await expect(activator).toHaveAttribute('aria-disabled', 'true');
    await activator.click({ force: true });
    await expect(page.locator('div[role=menu]')).toHaveCount(0);
  });

  test('should show loading indicator', async ({ page }) => {
    const ms = page.locator('[data-cy=ms-basic-loading]');
    const activator = ms.locator('[data-id=activator]');
    await expect(activator).toHaveAttribute('aria-busy', 'true');
  });

  test('should display error messages', async ({ page }) => {
    const ms = page.locator('[data-cy=ms-basic-error]');
    await expect(ms).toContainText('This field is required');
    await expect(ms.locator('[data-id=activator]')).toHaveAttribute('aria-invalid', 'true');
  });

  test('should display success messages', async ({ page }) => {
    const ms = page.locator('[data-cy=ms-basic-success]');
    await expect(ms).toContainText('Looks good!');
  });

  test('should hide details when hideDetails is set', async ({ page }) => {
    const ms = page.locator('[data-cy=ms-basic-hide-details]');
    await expect(ms).toBeVisible();
    await expect(ms).not.toContainText('This field is required');
  });

  test('should show required indicator', async ({ page }) => {
    const ms = page.locator('[data-cy=ms-basic-required]');
    const activator = ms.locator('[data-id=activator]');
    await expect(activator).toHaveAttribute('aria-required', 'true');
    await expect(activator).toContainText('\uFE61');
  });

  test('should display hint text', async ({ page }) => {
    const ms = page.locator('[data-cy=ms-basic-hint]');
    await expect(ms).toBeVisible();
    await expect(ms).toContainText('Pick a country');
  });
});

test.describe('menu-select - selection', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/menu-selects/selection');
  });

  test.afterEach(async ({ page }) => {
    await page.keyboard.press('Escape');
  });

  test('should open menu and select value', async ({ page }) => {
    const ms = page.locator('[data-cy=ms-select-single]');
    const activator = ms.locator('[data-id=activator]');

    await expect(activator).toHaveAttribute('aria-expanded', 'false');
    await activator.click();
    await expect(activator).toHaveAttribute('aria-expanded', 'true');
    await expect(page.locator('div[role=menu]')).toBeVisible();

    await page.locator('div[role=menu] button').first().click();
    await expect(activator).toHaveAttribute('aria-expanded', 'false');
    await expect(activator).toContainText('Lorem');
  });

  test('should clear value with clear button', async ({ page }) => {
    const ms = page.locator('[data-cy=ms-select-preselected]');
    const activator = ms.locator('[data-id=activator]');
    await expect(activator).toContainText('Lorem');

    await activator.hover();
    await ms.locator('[data-id=clear]').click();
    await expect(activator).not.toContainText('Lorem');
  });

  test('should auto-select first option on open', async ({ page }) => {
    const ms = page.locator('[data-cy=ms-select-auto-first]');
    const activator = ms.locator('[data-id=activator]');

    await activator.click();
    await expect(page.locator('div[role=menu]')).toBeVisible();

    const firstButton = page.locator('div[role=menu] button').first();
    await expect(firstButton).toHaveClass(/highlighted/);
  });

  test('should navigate options with keyboard', async ({ page }) => {
    const ms = page.locator('[data-cy=ms-select-auto-first]');
    const activator = ms.locator('[data-id=activator]');

    await activator.click();
    await expect(page.locator('div[role=menu]')).toBeVisible();

    // First item should be highlighted due to autoSelectFirst
    const firstButton = page.locator('div[role=menu] button').first();
    await expect(firstButton).toHaveClass(/highlighted/);

    // Navigate down
    await activator.press('ArrowDown');
    const secondButton = page.locator('div[role=menu] button').nth(1);
    await expect(secondButton).toHaveClass(/highlighted/);

    // Navigate back up
    await activator.press('ArrowUp');
    await expect(firstButton).toHaveClass(/highlighted/);

    // Click the highlighted option to select
    await firstButton.click();
    await expect(page.locator('div[role=menu]')).toHaveCount(0);
    await expect(activator).toContainText('Lorem');
  });

  test('should show no-data message when options empty', async ({ page }) => {
    const ms = page.locator('[data-cy=ms-select-no-data]');
    const activator = ms.locator('[data-id=activator]');

    await activator.click();
    await expect(page.locator('div[role=menu]')).toBeVisible();
    await expect(page.locator('div[role=menu] [data-id=no-data]')).toBeVisible();
    await expect(page.locator('div[role=menu] [data-id=no-data]')).toContainText('Nothing found');
  });

  test('should hide no-data when hideNoData is set', async ({ page }) => {
    const ms = page.locator('[data-cy=ms-select-hide-no-data]');
    const activator = ms.locator('[data-id=activator]');

    await activator.click();
    // Menu may not even open if hideNoData is set and there are no options
    const menu = page.locator('div[role=menu]');
    const menuCount = await menu.count();
    if (menuCount > 0) {
      await expect(menu.locator('[data-id=no-data]')).toHaveCount(0);
    }
  });

  test('should show aria-selected on active option', async ({ page }) => {
    const ms = page.locator('[data-cy=ms-select-single]');
    const activator = ms.locator('[data-id=activator]');

    // Select an item first
    await activator.click();
    await expect(page.locator('div[role=menu]')).toBeVisible();
    await page.locator('div[role=menu] button').first().click();
    await expect(page.locator('div[role=menu]')).toHaveCount(0);

    // Re-open and check aria-selected
    await activator.click();
    await expect(page.locator('div[role=menu]')).toBeVisible();

    const activeButton = page.locator('div[role=menu] button[aria-selected=true]');
    await expect(activeButton).toHaveCount(1);
    await expect(activeButton).toContainText('Lorem');
  });
});

test.describe('menu-select - readonly', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/menu-selects/readonly');
  });

  test.afterEach(async ({ page }) => {
    await page.keyboard.press('Escape');
  });

  test('should not open menu when read-only', async ({ page }) => {
    const ms = page.locator('[data-cy=ms-readonly-default]');
    const activator = ms.locator('[data-id=activator]');
    await expect(activator).toHaveAttribute('aria-readonly', 'true');
    await activator.click({ force: true });
    await expect(page.locator('div[role=menu]')).toHaveCount(0);
  });

  test('should display pre-selected value', async ({ page }) => {
    const ms = page.locator('[data-cy=ms-readonly-default]');
    await expect(ms.locator('[data-id=activator]')).toContainText('Lorem');
  });
});

test.describe('menu-select - custom slots', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/menu-selects/custom');
  });

  test.afterEach(async ({ page }) => {
    await page.keyboard.press('Escape');
  });

  test('should open menu via custom activator button', async ({ page }) => {
    const ms = page.locator('[data-cy=ms-custom-activator]');
    const button = ms.locator('[data-cy=activator]');

    await expect(button).toBeVisible();
    await expect(button).toContainText('Choose option');

    await button.click();
    await expect(page.locator('div[role=menu]')).toBeVisible();
  });

  test('should render custom selection display', async ({ page }) => {
    const ms = page.locator('[data-cy=ms-custom-selection]');
    const activator = ms.locator('[data-id=activator]');

    await activator.click();
    await expect(page.locator('div[role=menu]')).toBeVisible();

    // Select first item (Germany, id=1)
    await page.locator('div[role=menu] button').first().click();
    await expect(activator).toContainText('1 | Germany');
  });

  test('should render custom item append content', async ({ page }) => {
    const ms = page.locator('[data-cy=ms-custom-item]');
    const activator = ms.locator('[data-id=activator]');

    // Select first item
    await activator.click();
    await expect(page.locator('div[role=menu]')).toBeVisible();
    await page.locator('div[role=menu] button').first().click();

    // Re-open to verify check icon on the selected item
    await activator.click();
    await expect(page.locator('div[role=menu]')).toBeVisible();

    const activeButton = page.locator('div[role=menu] button[aria-selected=true]');
    await expect(activeButton.locator('[data-cy=check-icon]')).toBeVisible();
  });
});
