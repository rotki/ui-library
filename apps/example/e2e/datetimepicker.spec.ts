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

test.describe('datetimepicker menu footer actions', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/datetimepickers');
  });

  test.afterEach(async ({ page }) => {
    await page.keyboard.press('Escape');
  });

  // The "All footer actions" picker starts at 02/01/2023 20:20:00
  function actionsInput(page: Page) {
    return page.getByTestId('picker-all-actions').locator('input');
  }

  test('today moves the date and keeps the picked time', async ({ page }) => {
    const input = actionsInput(page);
    await expect(input).toHaveValue('02/01/2023 20:20:00');

    await input.click();
    await page.getByTestId('action-today').click();

    await expect(input).not.toHaveValue('02/01/2023 20:20:00');
    // only the date part moved
    await expect(input).toHaveValue(/ 20:20:00$/);
  });

  test('now replaces both the date and the time', async ({ page }) => {
    const input = actionsInput(page);
    await input.click();
    await page.getByTestId('action-now').click();

    await expect(input).not.toHaveValue(/ 20:20:00$/);
    await expect(input).toHaveValue(/^\d{2}\/\d{2}\/\d{4} \d{2}:\d{2}:\d{2}$/);
  });

  test('clear empties an allowEmpty picker', async ({ page }) => {
    const input = actionsInput(page);
    await input.click();
    await page.getByTestId('action-clear').click();

    // a cleared picker falls back to rendering the bare format
    await expect(input).toHaveValue('DD/MM/YYYY HH:mm:ss');
  });

  test('the default picker shows no timezone select and only the now action', async ({ page }) => {
    await page.getByRole('textbox').first().click();

    const menu = page.getByRole('menu');
    await expect(menu.getByTestId('action-now')).toBeVisible();
    await expect(menu.getByTestId('action-today')).toBeHidden();
    await expect(menu.getByTestId('timezone-select')).toBeHidden();
  });

  test('the timezone select is rendered when showTimezone is set', async ({ page }) => {
    await page.getByTestId('picker-timezone').locator('input').first().click();

    await expect(page.getByRole('menu').getByTestId('timezone-select')).toBeVisible();
  });
});

test.describe('datetimepicker keyboard passthrough', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/datetimepickers');
  });

  test.afterEach(async ({ page }) => {
    await page.keyboard.press('Escape');
  });

  test('ctrl+a reaches the input instead of being swallowed', async ({ page }) => {
    const input = page.getByRole('textbox').first();
    await input.click();

    await page.keyboard.press('ControlOrMeta+a');

    const selection = await input.evaluate((el) => {
      if (!(el instanceof HTMLInputElement))
        throw new TypeError('expected input element');
      return { end: el.selectionEnd, length: el.value.length, start: el.selectionStart };
    });

    expect(selection.start).toBe(0);
    expect(selection.end).toBe(selection.length);
  });

  test('the field can be opened and closed without a mouse', async ({ page }) => {
    const input = page.getByRole('textbox').first();
    await input.focus();
    await expect(page.getByRole('menu')).toBeHidden();

    await page.keyboard.press('Alt+ArrowDown');
    await expect(page.getByRole('menu')).toBeVisible();

    await page.keyboard.press('Escape');
    await expect(page.getByRole('menu')).toBeHidden();
  });

  test('the append chevron is a real button that toggles the menu', async ({ page }) => {
    const toggle = page.getByTestId('append').first();
    await expect(toggle).toHaveAttribute('aria-expanded', 'false');

    await toggle.click();
    await expect(page.getByRole('menu')).toBeVisible();
    await expect(toggle).toHaveAttribute('aria-expanded', 'true');
  });

  test('escape closes the menu', async ({ page }) => {
    await page.getByRole('textbox').first().click();
    await expect(page.getByRole('menu')).toBeVisible();

    await page.keyboard.press('Escape');

    await expect(page.getByRole('menu')).toBeHidden();
  });
});

test.describe('datetimepicker calendar keyboard', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/datetimepickers');
  });

  test.afterEach(async ({ page }) => {
    await page.keyboard.press('Escape');
  });

  test('the whole calendar is reachable and usable without a mouse', async ({ page }) => {
    const input = page.getByRole('textbox').first();
    await input.focus();
    await page.keyboard.press('Alt+ArrowDown');

    const grid = page.getByRole('grid');
    await expect(grid).toBeVisible();

    // opening from the keyboard hands focus to the calendar, which is
    // teleported to the body and therefore never adjacent in the tab order
    await expect(grid.locator('[role=gridcell][tabindex="0"]')).toBeFocused();

    // the initial value is 02/01/2023, so a week back lands in December
    await page.keyboard.press('ArrowUp');
    await expect(page.getByTestId('header-title')).toHaveText('December 2022');
    await expect(grid.getByTestId('2022-12-26')).toBeFocused();

    await page.keyboard.press('ArrowRight');
    await expect(grid.getByTestId('2022-12-27')).toBeFocused();

    await page.keyboard.press('Enter');
    await expect(input).toHaveValue('27/12/2022 20:20');
  });

  test('escape from the calendar closes it and returns focus to the field', async ({ page }) => {
    const input = page.getByRole('textbox').first();
    await input.focus();
    await page.keyboard.press('Alt+ArrowDown');
    await expect(page.getByRole('grid')).toBeVisible();

    await page.keyboard.press('Escape');

    await expect(page.getByRole('menu')).toBeHidden();
    await expect(input).toBeFocused();
  });

  test('only one day of the grid is in the tab order', async ({ page }) => {
    await page.getByRole('textbox').first().focus();
    await page.keyboard.press('Alt+ArrowDown');

    const tabbable = page.getByRole('grid').locator('[role=gridcell][tabindex="0"]');
    await expect(tabbable).toHaveCount(1);
  });
});

test.describe('datetimepicker across a DST boundary', () => {
  // Berlin is +01:00 in January and +02:00 in July
  test.use({ timezoneId: 'Europe/Berlin' });

  test.beforeEach(async ({ page }) => {
    await page.goto('/datetimepickers');
  });

  test.afterEach(async ({ page }) => {
    await page.keyboard.press('Escape');
  });

  test('the repeated hour of the fall back stays put when picked twice', async ({ page }) => {
    // 02:30 happens twice on 29/10/2023 in Berlin. Whichever instant gets
    // chosen, re-picking the same day must not walk the value by an hour.
    const input = page.getByRole('textbox').first();
    await input.focus();
    // focus starts on the first segment, and each full segment auto-advances
    await page.keyboard.type('291020230230');
    await expect(input).toHaveValue('29/10/2023 02:30');

    await page.keyboard.press('Alt+ArrowDown');
    const day = page.getByRole('grid').getByTestId('2023-10-29');
    await day.click();
    await expect(input).toHaveValue('29/10/2023 02:30');

    await day.click();
    await expect(input).toHaveValue('29/10/2023 02:30');
  });

  test('picking a summer date from a winter value keeps the time', async ({ page }) => {
    const input = page.getByRole('textbox').first();
    await expect(input).toHaveValue('02/01/2023 20:20');

    await input.click();

    // January 2023 -> July 2023
    for (let i = 0; i < 6; i++)
      await page.getByTestId('nav-next').click();
    await expect(page.getByTestId('header-title')).toHaveText('July 2023');

    await page.getByTestId('2023-07-15').click();

    await expect(input).toHaveValue('15/07/2023 20:20');
  });
});
