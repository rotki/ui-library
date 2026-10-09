import { expect, type Locator, type Page, test } from '@playwright/test';

/** The example app's sticky offset, which clears its app bar. */
const APP_BAR = 72;

/** Scroll whatever scrolls the page (the example app scrolls its body) so `target` sits `top` px below the viewport top. */
async function scrollTo(target: Locator, top: number): Promise<void> {
  await target.evaluate((el, offset) => {
    let scroller = el.parentElement;
    while (scroller && !(['auto', 'scroll'].includes(getComputedStyle(scroller).overflowY) && scroller.scrollHeight > scroller.clientHeight))
      scroller = scroller.parentElement;
    (scroller ?? document.scrollingElement)?.scrollBy({ top: el.getBoundingClientRect().top - offset, behavior: 'instant' });
  }, top);
}

async function pageScrollTop(page: Page): Promise<number> {
  return page.evaluate(() => Math.max(document.body.scrollTop, document.documentElement.scrollTop));
}

async function bottomOf(locator: Locator): Promise<number> {
  const box = await locator.boundingBox();
  return Math.round((box?.y ?? Number.NaN) + (box?.height ?? Number.NaN));
}

async function topOf(locator: Locator): Promise<number> {
  return Math.round((await locator.boundingBox())?.y ?? Number.NaN);
}

function viewportHeight(page: Page): number {
  return page.viewportSize()?.height ?? 0;
}

test.describe('data tables - long pages', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/data-tables/long-pages');
    // room below the content, so the last tables can scroll up past the app bar
    await page.addStyleTag({ content: '[data-id=page-content] { padding-bottom: 100vh; }' });
  });

  test('renders one pagination bar per table, under the rows', async ({ page }) => {
    const table = page.locator('[data-id=long-single] [data-id=table]');
    await expect(table.locator('[data-id=table-pagination]')).toHaveCount(1);
    expect(await topOf(table.locator('[data-id=table-pagination]'))).toBeGreaterThan(await topOf(table.locator('tbody')));
  });

  test('keeps the bar on screen at the bottom of a long page', async ({ page }) => {
    const table = page.locator('[data-id=long-single] [data-id=table]');
    const bar = table.locator('[data-id=table-pagination]');
    await scrollTo(table, APP_BAR);

    await expect.poll(() => bottomOf(bar)).toBe(viewportHeight(page));
    // the rows run on below the bar
    expect(await bottomOf(table)).toBeGreaterThan(viewportHeight(page));
  });

  test('leaves the bar under the rows while a table is only starting to scroll into view', async ({ page }) => {
    const table = page.locator('[data-id=long-stacked] [data-id=table-second]');
    const bar = table.locator('[data-id=table-pagination]');
    const head = table.locator('thead[data-id=head-main]');

    // just the header and a row showing at the bottom of the view
    await scrollTo(table, viewportHeight(page) - 80);
    await expect(bar).not.toHaveAttribute('data-sticky');
    expect(await topOf(bar)).toBeGreaterThan(viewportHeight(page));
    expect(await bottomOf(head)).toBeLessThanOrEqual(viewportHeight(page));

    // once more of it is showing, the bar sticks
    await scrollTo(table, viewportHeight(page) - 300);
    await expect(bar).toHaveAttribute('data-sticky', 'true');
    await expect.poll(() => bottomOf(bar)).toBe(viewportHeight(page));
  });

  test('shows the new page from its first row after paging from the bottom', async ({ page }) => {
    const table = page.locator('[data-id=long-single] [data-id=table]');
    await scrollTo(table, -1500);
    expect(await topOf(table)).toBeLessThan(0);

    await table.locator('[data-id=table-pagination-next]').click();

    await expect.poll(() => topOf(table)).toBe(APP_BAR);
    await expect(table.locator('tbody tr').first().locator('td').first()).toHaveText('51');
  });

  test('does not move the view when the table top is already showing', async ({ page }) => {
    const table = page.locator('[data-id=long-single] [data-id=table]');
    await scrollTo(table, 200);
    const before = await pageScrollTop(page);

    await table.locator('[data-id=table-pagination-next]').click();

    await expect(table.locator('tbody tr').first().locator('td').first()).toHaveText('51');
    expect(await pageScrollTop(page)).toBe(before);
    expect(await topOf(table)).toBe(200);
  });

  test('keeps the bar in place when a wide table scrolls sideways', async ({ page }) => {
    const table = page.locator('[data-id=long-single] [data-id=table]');
    const bar = table.locator('[data-id=table-pagination]');
    const scroller = table.locator('[data-id=table-scroller]');
    await scrollTo(table, APP_BAR);

    expect(await scroller.evaluate(el => el.scrollWidth > el.clientWidth)).toBe(true);
    const before = await bar.boundingBox();
    await scroller.evaluate((el) => {
      el.scrollLeft = 300;
    });

    expect(await scroller.evaluate(el => el.scrollLeft)).toBeGreaterThan(0);
    expect(await bar.boundingBox()).toEqual(before);
    // the full width inside the outlined table's 1px borders
    expect(before?.width).toBe(((await table.boundingBox())?.width ?? 0) - 2);
  });

  test('sticks only the bar of the stacked table on screen', async ({ page }) => {
    const first = page.locator('[data-id=long-stacked] [data-id=table-first]');
    const second = page.locator('[data-id=long-stacked] [data-id=table-second]');
    const firstBar = first.locator('[data-id=table-pagination]');
    const secondBar = second.locator('[data-id=table-pagination]');

    await scrollTo(first, APP_BAR);
    await expect.poll(() => bottomOf(firstBar)).toBe(viewportHeight(page));
    expect(await topOf(secondBar)).toBeGreaterThan(viewportHeight(page));

    await scrollTo(second, APP_BAR);
    // the first bar has gone back to the end of its own table
    expect(await bottomOf(firstBar)).toBe(await bottomOf(first) - 1);
    await expect.poll(() => bottomOf(secondBar)).toBe(viewportHeight(page));
  });

  test('sticks both bars of side-by-side tables', async ({ page }) => {
    const left = page.locator('[data-id=long-side-by-side] [data-id=table-left]');
    const right = page.locator('[data-id=long-side-by-side] [data-id=table-right]');
    await scrollTo(left, APP_BAR);

    await expect.poll(() => bottomOf(left.locator('[data-id=table-pagination]'))).toBe(viewportHeight(page));
    expect(await bottomOf(right.locator('[data-id=table-pagination]'))).toBe(viewportHeight(page));
  });

  test('sticks the outer bar but leaves a nested table bar under its rows', async ({ page }) => {
    const outer = page.locator('[data-id=long-nested] [data-id=table]');
    const nested = outer.locator('[data-id=nested-table]');
    const nestedBar = nested.locator('[data-id=table-pagination]');
    const outerBar = outer.locator(':scope > [data-id=table-pagination]');

    await scrollTo(nested, APP_BAR);
    await expect(outerBar).toHaveAttribute('data-sticky', 'true');
    await expect(nestedBar).not.toHaveAttribute('data-sticky');
    expect(await nestedBar.evaluate(el => getComputedStyle(el).position)).not.toBe('sticky');

    // the nested bar stays at the end of the nested rows, off screen, instead of riding along
    expect(await topOf(nestedBar)).toBeGreaterThan(viewportHeight(page));
  });

  test('sticks the bar to the bottom of a dialog body', async ({ page }) => {
    await page.locator('[data-id=long-dialog-activator]').click();
    const scroller = page.locator('[data-id=long-dialog-scroller]');
    await expect(scroller).toBeVisible();
    const bar = scroller.locator('[data-id=table-pagination]');

    await expect.poll(() => bottomOf(bar)).toBe(await bottomOf(scroller));
  });
});
