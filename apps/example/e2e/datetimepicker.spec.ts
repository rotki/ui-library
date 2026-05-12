import { expect, type Page, test } from '@playwright/test';

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

test.describe('datetimepicker segment typing', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/datetimepickers');
  });

  test.afterEach(async ({ page }) => {
    await page.keyboard.press('Escape');
    await page.keyboard.press('Escape');
  });

  // Helper to read the visible input value
  async function readValue(page: Page): Promise<string> {
    return page.getByRole('textbox').first().inputValue();
  }

  // Helper to click on a specific segment of the visible input by character offset.
  // Range is computed from the format "DD/MM/YYYY HH:mm":
  //   DD=0..2, MM=3..5, YYYY=6..10, HH=11..13, mm=14..16
  async function selectSegment(page: Page, start: number, end: number): Promise<void> {
    const input = page.getByRole('textbox').first();
    // Measure the pixel x-offset of the midpoint between `start` and `end` so the click
    // lands inside the desired segment. The component reads the click position via
    // document.caretPositionFromPoint, so accurate coordinates matter.
    const offsetX = await input.evaluate((el, args) => {
      if (!(el instanceof HTMLInputElement))
        throw new Error('expected input element');
      const style = window.getComputedStyle(el);
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx)
        throw new Error('canvas 2d context unavailable');
      ctx.font = `${style.fontWeight} ${style.fontSize} ${style.fontFamily}`;
      const beforeWidth = ctx.measureText(el.value.slice(0, args.start)).width;
      const segmentWidth = ctx.measureText(el.value.slice(args.start, args.end)).width;
      return beforeWidth + segmentWidth / 2;
    }, { start, end });

    const box = await input.boundingBox();
    if (!box)
      throw new Error('input bounding box unavailable');
    await page.mouse.click(box.x + offsetX, box.y + box.height / 2);
  }

  test('typing "12" in hour with existing value yields hour 12, not 13', async ({ page }) => {
    // Initial value is "02/01/2023 20:20"
    await expect(page.getByRole('textbox').first()).toHaveValue('02/01/2023 20:20');

    await page.getByRole('textbox').first().click();
    // Select the HH segment ("20")
    await selectSegment(page, 11, 13);

    await page.keyboard.press('1');
    expect(await readValue(page)).toMatch(/01:20$/);

    await page.keyboard.press('2');
    expect(await readValue(page)).toMatch(/12:20$/);
  });

  test('switching segments via click resets in-progress digit buffer', async ({ page }) => {
    await expect(page.getByRole('textbox').first()).toHaveValue('02/01/2023 20:20');

    await page.getByRole('textbox').first().click();
    await selectSegment(page, 11, 13);

    // Type "1" in HH — does not auto-advance yet (length < 2)
    await page.keyboard.press('1');
    expect(await readValue(page)).toMatch(/01:20$/);

    // Click into the minute segment instead of letting HH auto-advance
    await selectSegment(page, 14, 16);

    // Typing "3" must set mm=3 (not 13). Before the fix the leftover "1" from HH
    // would combine with "3" and produce mm=13.
    await page.keyboard.press('3');
    expect(await readValue(page)).toMatch(/01:03$/);
  });

  test('typing in the minute segment never alters the hour', async ({ page }) => {
    await expect(page.getByRole('textbox').first()).toHaveValue('02/01/2023 20:20');

    await page.getByRole('textbox').first().click();
    // Type "1" in HH first to seed the in-progress buffer
    await selectSegment(page, 11, 13);
    await page.keyboard.press('1');

    // Click to minute segment and type three digits
    await selectSegment(page, 14, 16);
    await page.keyboard.press('4');
    await page.keyboard.press('5');

    // Minute should be 45; hour must remain whatever we set it to (01), not change
    expect(await readValue(page)).toMatch(/^02\/01\/2023 01:45$/);
  });
});
