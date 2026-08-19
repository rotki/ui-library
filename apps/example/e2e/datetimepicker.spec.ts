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

    // focus sits on the footer button, so the emptied field shows its format
    // through the placeholder rather than holding the tokens as a value
    await expect(input).toHaveValue('');
    await expect(input).toHaveAttribute('placeholder', 'DD/MM/YYYY HH:mm:ss');

    // clicking back in restores the tokens the segment machinery works against
    await input.click();
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

test.describe('datetimepicker partial entries', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/datetimepickers');
  });

  test.afterEach(async ({ page }) => {
    await page.keyboard.press('Escape');
  });

  // the three partial pickers start empty and emit an epoch, written out next to each field
  function partialInput(page: Page, mode: 'start' | 'end' | 'strict') {
    return page.getByTestId(`picker-partial-${mode}`).locator('input');
  }

  // computed in the browser, so the expectation follows the timezone the page runs in
  async function epochOf(page: Page, hour: number, minute: number, second: number): Promise<string> {
    return page.evaluate(
      ([h, m, s]) => String(new Date(2023, 0, 15, h, m, s).getTime() / 1000),
      [hour, minute, second],
    );
  }

  test('a bare date becomes the start of its day when the field is left', async ({ page }) => {
    const input = partialInput(page, 'start');
    // focused rather than clicked, so the caret starts on the first segment and no calendar opens
    await input.focus();
    await page.keyboard.type('15012023');

    // nothing is committed while the user is still in the field
    await expect(page.getByTestId('picker-partial-start-value')).toHaveText('');

    await page.getByTestId('picker-partial-section').getByRole('heading').click();

    await expect(input).toHaveValue('15/01/2023 00:00:00');
    await expect(page.getByTestId('picker-partial-start-value')).toHaveText(await epochOf(page, 0, 0, 0));
  });

  test('a bare date becomes the end of its day for the other bound', async ({ page }) => {
    const input = partialInput(page, 'end');
    await input.focus();
    await page.keyboard.type('15012023');

    await page.getByTestId('picker-partial-section').getByRole('heading').click();

    await expect(input).toHaveValue('15/01/2023 23:59:59');
    await expect(page.getByTestId('picker-partial-end-value')).toHaveText(await epochOf(page, 23, 59, 59));
  });

  test('enter commits without waiting for the field to be left', async ({ page }) => {
    const input = partialInput(page, 'start');
    await input.focus();
    await page.keyboard.type('15012023');

    await page.keyboard.press('Enter');

    await expect(page.getByTestId('picker-partial-start-value')).toHaveText(await epochOf(page, 0, 0, 0));
    await expect(input).toBeFocused();
  });

  test('an hour entered on its own keeps its hour and fills the rest', async ({ page }) => {
    const input = partialInput(page, 'end');
    await input.focus();
    await page.keyboard.type('1501202309');

    await page.getByTestId('picker-partial-section').getByRole('heading').click();

    await expect(input).toHaveValue('15/01/2023 09:59:59');
    await expect(page.getByTestId('picker-partial-end-value')).toHaveText(await epochOf(page, 9, 59, 59));
  });

  // the mouse path leaves the time out just as typing does: the field starts empty, so the
  // calendar opens on the current month and today is the day that is there to be clicked
  test('a day picked in the calendar is committed once the user leaves the field', async ({ page }) => {
    const input = partialInput(page, 'start');
    await input.click();

    const today = await page.evaluate(() => {
      const now = new Date();
      const pad = (value: number): string => value.toString().padStart(2, '0');
      return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
    });
    await page.getByRole('grid').getByTestId(today).click();

    // a date on its own is not yet a value
    await expect(page.getByTestId('picker-partial-start-value')).toHaveText('');

    await page.keyboard.press('Escape');
    await page.getByTestId('picker-partial-section').getByRole('heading').click();

    await expect(input).toHaveValue(/^\d{2}\/\d{2}\/\d{4} 00:00:00$/);
    await expect(page.getByTestId('picker-partial-start-value')).not.toHaveText('');
  });

  // the control: without partial-time the same entry is still not a value
  test('a bare date stays uncommitted without the prop', async ({ page }) => {
    const input = partialInput(page, 'strict');
    await input.focus();
    await page.keyboard.type('15012023');

    await page.getByTestId('picker-partial-section').getByRole('heading').click();

    await expect(input).toHaveValue('15/01/2023 HH:mm:ss');
    await expect(page.getByTestId('picker-partial-strict-value')).toHaveText('');
  });

  // The attribute is easy to assert in a unit test and proves nothing about what tab actually
  // does, so the real key is pressed here against three fields standing in a row.
  test('tab crosses a field in one stop rather than landing on its calendar toggle', async ({ page }) => {
    const start = partialInput(page, 'start');
    await start.focus();

    await page.keyboard.press('Tab');

    await expect(partialInput(page, 'end')).toBeFocused();
  });

  // What makes skipping the toggle acceptable: the field itself still opens the calendar.
  test('the calendar is still reachable from the field without the toggle', async ({ page }) => {
    const input = partialInput(page, 'start');
    await input.focus();

    await page.keyboard.press('Alt+ArrowDown');

    await expect(page.getByRole('menu')).toBeVisible();
  });

  // A bound typed as a bare date is committed by tabbing out, the same as by clicking away.
  test('tabbing out of the field commits a bare date', async ({ page }) => {
    const input = partialInput(page, 'start');
    await input.focus();
    await page.keyboard.type('15012023');

    await page.keyboard.press('Tab');

    await expect(input).toHaveValue('15/01/2023 00:00:00');
    await expect(page.getByTestId('picker-partial-start-value')).toHaveText(await epochOf(page, 0, 0, 0));
  });
});

test.describe('datetimepicker footer actions against a bound', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/datetimepickers');
  });

  test.afterEach(async ({ page }) => {
    await page.keyboard.press('Escape');
  });

  // The bounded picker starts at 02/01/2023 20:20:00 with maxDate 10/01/2023 12:00
  function boundedInput(page: Page) {
    return page.getByTestId('picker-bounded').locator('input');
  }

  test('now clamps to maxDate instead of leaving the field ahead of the model', async ({ page }) => {
    const input = boundedInput(page);
    await input.click();
    await page.getByTestId('action-now').click();

    await expect(input).toHaveValue('10/01/2023 12:00:00');
  });

  test('today clamps when the kept time would cross maxDate', async ({ page }) => {
    const input = boundedInput(page);
    await input.click();
    await page.getByTestId('action-today').click();

    await expect(input).toHaveValue('10/01/2023 12:00:00');
  });

  test('the field is not spellchecked', async ({ page }) => {
    await expect(boundedInput(page)).toHaveAttribute('spellcheck', 'false');
  });

  // the message used to come from toLocaleDateString(), which follows the
  // browser locale rather than the field, and dropped the bound's time
  test('the bound error is written in the field format, with its time', async ({ page }) => {
    const input = boundedInput(page);
    await expect(input).toHaveValue('02/01/2023 20:20:00');

    // click the left edge so the day segment is selected, then type a day past the bound
    const box = await input.boundingBox();
    if (!box)
      throw new Error('input bounding box unavailable');
    await page.mouse.click(box.x + 12, box.y + box.height / 2);
    await page.keyboard.press('2');
    await page.keyboard.press('0');

    await expect(input).toHaveValue('20/01/2023 20:20:00');
    await expect(page.getByText('Date cannot be after 10/01/2023 12:00:00')).toBeVisible();
  });
});
