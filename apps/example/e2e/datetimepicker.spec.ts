import { expect, test } from '@playwright/test';

test.describe('datetimepicker inside parent menu', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/datetimepickers');
  });

  test.afterEach(async ({ page }) => {
    await page.keyboard.press('Escape');
    await page.keyboard.press('Escape');
    await page.keyboard.press('Escape');
  });

  test('parent menu stays open while calendar sub-menu is open and click-outside fires', async ({ page }) => {
    await page.getByTestId('parent-menu-activator').click();
    const parentContent = page.getByTestId('parent-menu-content');
    await expect(parentContent).toBeVisible();

    // Open the date-time picker (its own RuiMenu)
    await parentContent.getByRole('textbox').click();

    // Open the calendar's teleported month/year sub-menu by clicking the header title
    await page.getByTestId('header-title').click();

    // Click somewhere outside the calendar sub-menu but on the page body —
    // because the picker exposes menu-open and the page binds :persistent to it,
    // the parent menu must NOT close.
    await page.mouse.click(5, 5);

    await expect(parentContent).toBeVisible();
  });

  test('parent menu stays open while only the picker menu is open and click-outside fires', async ({ page }) => {
    await page.getByTestId('parent-menu-activator').click();
    const parentContent = page.getByTestId('parent-menu-content');
    await expect(parentContent).toBeVisible();

    // Open the picker but do NOT open the calendar's year/month sub-menu
    await parentContent.getByRole('textbox').click();

    // Click outside — picker exposes menu-open while its own menu is open,
    // so parent stays open.
    await page.mouse.click(5, 5);

    await expect(parentContent).toBeVisible();
  });

  test('parent menu closes on outside click when no picker overlay is open', async ({ page }) => {
    await page.getByTestId('parent-menu-activator').click();
    const parentContent = page.getByTestId('parent-menu-content');
    await expect(parentContent).toBeVisible();

    // Click outside without opening the picker / calendar sub-menu
    await page.mouse.click(5, 5);

    await expect(parentContent).toBeHidden();
  });
});
