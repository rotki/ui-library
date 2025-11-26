import { expect, test } from '@playwright/test';

test.describe('data tables', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/data-tables');
    // Wait for the API data to load - the tables only render after isFetching becomes false
    // The page fetches from jsonplaceholder.typicode.com which can be slow
    // Wait for table to be visible with increased timeout
    await expect(page.locator('div[data-cy=table-0]')).toBeVisible({ timeout: 30000 });
    // Also wait for actual table content (tbody with rows) to ensure data is loaded
    await expect(page.locator('div[data-cy=table-0] table tbody tr').first()).toBeVisible({ timeout: 30000 });
  });

  test('should render table with column definitions', async ({ page }) => {
    await expect(page.locator('h2[data-cy=datatables]')).toContainText('Data Tables');

    const columnsDefined = page.locator('div[data-cy=table-0]').first();

    // With column definitions, headers should use labels like "Street" not raw keys like "address.street"
    // Check that "Street" label exists (from fixedColumns config) and raw key "address.street" doesn't appear
    await expect(
      columnsDefined.locator('table thead th span[class*=_column__text_]').filter({ hasText: 'Street' }).first(),
    ).toBeVisible();
    // Use getByText with exact match to avoid false positives
    await expect(
      columnsDefined.locator('table thead th span[class*=_column__text_]').getByText('address.street', { exact: true }),
    ).toHaveCount(0);

    await expect(
      columnsDefined.locator('table tbody td[class*=_align__start_]', { hasText: '1' }).first(),
    ).toBeVisible();

    await expect(columnsDefined.locator('table thead th[class*=_checkbox_]')).toHaveCount(0);
    await expect(columnsDefined.locator('table tbody td[class*=_checkbox_]')).toHaveCount(0);
  });

  test('should render table without column definitions', async ({ page }) => {
    const columnsNotDefined = page.locator('div[data-cy=table-1]').first();

    // Without column definitions, headers should show raw data keys
    // The table without column definition is "No Column definitions" table
    // It shows keys from the data object directly as headers
    await expect(
      columnsNotDefined.locator('table thead th span[class*=_column__text_]').filter({ hasText: 'address.street' }).first(),
    ).toBeVisible();

    await expect(
      columnsNotDefined.locator('table tbody td[class*=_align__start_]', { hasText: '1' }).first(),
    ).toBeVisible();
  });

  test('should render empty table with outline', async ({ page }) => {
    const empty = page.locator('div[data-cy=table-empty-0]').first();

    await expect(empty.locator('table tbody tr[class*=_tr__empty_] p[class*=_empty__label_]')).toBeVisible();
    await expect(empty.locator('table tbody tr[class*=_tr__empty_] p[class*=_empty__description_]')).toBeVisible();

    const outlined = page.locator('div[data-cy=table-empty-0][class*=_outlined_]').first();
    await expect(outlined).toBeVisible();
  });

  test('should render empty table with action slot', async ({ page }) => {
    const empty = page.locator('div[data-cy=table-empty-1]').first();

    await expect(empty.locator('table tbody tr[class*=_tr__empty_] p[class*=_empty__label_]')).toBeVisible();
    await expect(empty.locator('table tbody tr[class*=_empty_] button[class*=_btn_]')).toBeVisible();

    const outlined = page.locator('div[data-cy=table-empty-1][class*=_outlined_]').first();
    await expect(outlined).toBeVisible();
  });

  test('should render empty table with loading state', async ({ page }) => {
    const loading = page.locator('div[data-cy=table-empty-2]').first();

    await expect(loading.locator('table tbody td[class*=_tbody__loader_] div[class*=_circular_]')).toBeVisible();

    const outlined = page.locator('div[data-cy=table-empty-2][class*=_outlined_]').first();
    await expect(outlined).toBeVisible();
  });

  test('should render table with loading progress bar', async ({ page }) => {
    const loading = page.locator('div[data-cy=table-empty-3]').first();

    // The loading progress bar row exists in the thead
    // The element may be visually hidden due to sticky header implementation
    await expect(loading.locator('table thead[data-id=head-main] tr[class*=_thead__loader_] th[class*=_progress_]')).toHaveCount(1);

    // Check the table has the outlined class
    const loadingClasses = await loading.getAttribute('class');
    expect(loadingClasses).toContain('_outlined_');
  });

  test('should handle multiple expanded rows', async ({ page }) => {
    const multiple = page.locator('div[data-cy=table-expandable-0]');
    const buttons = multiple.locator('tr button[class*=_tr__expander_button]');
    const button1 = buttons.nth(1);
    const button2 = buttons.nth(2);

    await expect(multiple.locator('table tbody tr div[data-cy=expanded-content]')).toHaveCount(0);

    await button1.click();

    let classes = await button1.getAttribute('class');
    expect(classes).toContain('_tr__expander_button');
    expect(classes).toContain('_tr__expander_button_open');

    await button1.click();

    classes = await button1.getAttribute('class');
    expect(classes).not.toContain('_tr__expander_button_open');

    await button1.click();
    await button2.click();

    classes = await button1.getAttribute('class');
    expect(classes).toContain('_tr__expander_button');
    expect(classes).toContain('_tr__expander_button_open');

    classes = await button2.getAttribute('class');
    expect(classes).toContain('_tr__expander_button');
    expect(classes).toContain('_tr__expander_button_open');
  });

  test('should handle single expanded row', async ({ page }) => {
    const single = page.locator('div[data-cy=table-expandable-1]');
    const buttons = single.locator('tr button[class*=_tr__expander_button]');
    const button1 = buttons.nth(1);
    const button2 = buttons.nth(2);

    await expect(single.locator('table tbody tr div[data-cy=expanded-content]')).toHaveCount(0);

    await button1.click();

    let classes = await button1.getAttribute('class');
    expect(classes).toContain('_tr__expander_button');
    expect(classes).toContain('_tr__expander_button_open');

    await button1.click();

    classes = await button1.getAttribute('class');
    expect(classes).not.toContain('_tr__expander_button_open');

    await button1.click();
    await button2.click();

    classes = await button1.getAttribute('class');
    expect(classes).not.toContain('_tr__expander_button_open');

    classes = await button2.getAttribute('class');
    expect(classes).toContain('_tr__expander_button');
    expect(classes).toContain('_tr__expander_button_open');
  });

  test('should render table with sticky header', async ({ page }) => {
    const sticky = page.locator('div[data-cy="table-expandable-0"]');

    // Scroll to the expandable tables section first to ensure the sticky table is in view
    await sticky.scrollIntoViewIfNeeded();

    // The head-clone exists but is hidden (opacity-0 invisible) until scrolling activates sticky behavior
    // Just check it exists in DOM, not that it's visible
    await expect(sticky.locator('table thead[data-id=head-clone]')).toHaveCount(1);
    const mainHead = sticky.locator('table thead[data-id=head-main]');
    await expect(mainHead).toBeVisible();

    // Verify sticky header class is present (table is configured with stickyHeader: true)
    await expect(mainHead).toHaveClass(/_sticky__header_/);

    // Scroll to very top of page to reset scroll position
    await page.evaluate(() => window.scrollTo(0, 0));

    // After scrolling to top, verify _stick__top_ is not applied (header not stuck)
    await expect(mainHead).not.toHaveClass(/_stick__top_/);
  });
});
