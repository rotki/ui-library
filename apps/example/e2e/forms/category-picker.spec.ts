import { expect, test } from '@playwright/test';

test.describe('category-picker', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/category-pickers');
  });

  test.afterEach(async ({ page }) => {
    await page.keyboard.press('Escape');
  });

  test('opens an anchored popover with a category rail and a detail pane', async ({ page }) => {
    await page.locator('[data-id=cp-default] [data-id=activator]').click();

    await expect(page.getByTestId('panel')).toBeVisible();
    await expect(page.getByTestId('rail')).toBeVisible();
    await expect(page.getByTestId('detail')).toBeVisible();
    await expect(page.getByRole('tab', { name: /All/ })).toBeVisible();
    await expect(page.getByRole('tab', { name: /Europe/ })).toBeVisible();
  });

  test('shows only a category items after picking it', async ({ page }) => {
    await page.locator('[data-id=cp-default] [data-id=activator]').click();
    await page.getByRole('tab', { name: /Europe/ }).click();

    const options = page.getByTestId('detail').getByRole('option');
    await expect(options).toHaveText(['Germany', 'France', 'Spain', 'Italy']);
  });

  test('selects an item and reflects it on the trigger', async ({ page }) => {
    await page.locator('[data-id=cp-default] [data-id=activator]').click();
    await page.getByRole('tab', { name: /Europe/ }).click();
    await page.getByRole('option', { name: 'France' }).click();

    await expect(page.getByTestId('panel')).toBeHidden();
    await expect(page.locator('[data-id=cp-default] [data-id=search-input]')).toHaveValue('France');
  });

  test('filters both panes by typing in the field (no separate search box)', async ({ page }) => {
    await page.locator('[data-id=cp-default] [data-id=search-input]').fill('germany');

    // The field is the only search input on desktop.
    await expect(page.getByTestId('panel').getByTestId('search')).toHaveCount(0);
    await expect(page.getByRole('tab')).toHaveText([/All/, /Europe/]);
    await expect(page.getByTestId('detail').getByRole('option')).toHaveText(['Germany']);
  });

  test('surfaces every item of a category when its label matches', async ({ page }) => {
    await page.locator('[data-id=cp-default] [data-id=search-input]').fill('asia');

    await expect(page.getByTestId('detail').getByRole('option')).toHaveText(['India', 'Indonesia', 'Japan']);
  });

  test('type-to-pick: Enter in the field commits the top match', async ({ page }) => {
    const field = page.locator('[data-id=cp-default] [data-id=search-input]');
    await field.fill('india');
    await field.press('Enter');

    await expect(page.getByTestId('panel')).toBeHidden();
    await expect(field).toHaveValue('India');
  });

  test('renders the large catalogue at 16 categories', async ({ page }) => {
    await page.locator('[data-id=cp-actions] [data-id=activator]').click();

    // All + 16 categories
    await expect(page.getByRole('tab')).toHaveCount(17);
    await expect(page.getByRole('tab', { name: /Staking/ })).toBeVisible();
  });
});

test.describe('category-picker - narrow (drill-in)', () => {
  test.use({ viewport: { width: 480, height: 800 } });

  test.beforeEach(async ({ page }) => {
    await page.goto('/category-pickers');
  });

  test.afterEach(async ({ page }) => {
    await page.keyboard.press('Escape');
  });

  test('collapses to a single pane with its own search and drills in and out', async ({ page }) => {
    await page.locator('[data-id=cp-default] [data-id=activator]').click();

    // The sheet carries its own search box on narrow screens.
    await expect(page.getByTestId('search')).toBeVisible();

    // Only the category rail is visible at first; the detail pane is hidden.
    await expect(page.getByTestId('rail')).toBeVisible();
    await expect(page.getByTestId('detail')).toBeHidden();

    // Drill into a category → detail replaces the rail, back button appears.
    await page.getByRole('tab', { name: /Europe/ }).click();
    await expect(page.getByTestId('detail')).toBeVisible();
    await expect(page.getByTestId('rail')).toBeHidden();
    await expect(page.getByTestId('back')).toBeVisible();

    // Back returns to the category rail.
    await page.getByTestId('back').click();
    await expect(page.getByTestId('rail')).toBeVisible();
    await expect(page.getByTestId('detail')).toBeHidden();
  });

  test('selects an item from the drilled-in pane', async ({ page }) => {
    await page.locator('[data-id=cp-default] [data-id=activator]').click();
    await page.getByRole('tab', { name: /Europe/ }).click();
    await page.getByRole('option', { name: 'France' }).click();

    await expect(page.getByRole('dialog')).toBeHidden();
    await expect(page.locator('[data-id=cp-default] [data-id=search-input]')).toHaveValue('France');
  });
});
