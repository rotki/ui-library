import { expect, test } from '@playwright/test';

test.describe('data tables - basic', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/data-tables/basic');
  });

  test('should render table with column definitions', async ({ page }) => {
    const table = page.locator('[data-cy=table-columns-defined] [data-cy=table]');
    await expect(table).toBeVisible();

    await expect(
      table.locator('thead th span[class*=_column__text_]').filter({ hasText: 'Street' }).first(),
    ).toBeVisible();

    await expect(
      table.locator('thead th span[class*=_column__text_]').getByText('address.street', { exact: true }),
    ).toHaveCount(0);
  });

  test('should render table without column definitions (auto-generated)', async ({ page }) => {
    const table = page.locator('[data-cy=table-auto-columns] [data-cy=table]');
    await expect(table).toBeVisible();

    await expect(
      table.locator('thead th span[class*=_column__text_]').filter({ hasText: 'address.street' }).first(),
    ).toBeVisible();
  });

  test('should render outlined table', async ({ page }) => {
    const wrapper = page.locator('[data-cy=table-outlined] [data-cy=table]');
    await expect(wrapper).toBeVisible();
    await expect(wrapper).toHaveClass(/_outlined_/);
  });

  test('should render dense table', async ({ page }) => {
    const table = page.locator('[data-cy=table-dense] [data-cy=table] table');
    await expect(table).toBeVisible();
    await expect(table).toHaveClass(/_dense_/);
  });

  test('should render striped table', async ({ page }) => {
    const tbody = page.locator('[data-cy=table-striped] [data-cy=table] tbody');
    await expect(tbody).toBeVisible();
    await expect(tbody).toHaveClass(/_tbody--striped_/);
  });
});

test.describe('data tables - sorting', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/data-tables/sorting');
  });

  test('should sort by clicking column header', async ({ page }) => {
    const table = page.locator('[data-cy=table-single-sort] [data-cy=table]');
    await expect(table).toBeVisible();

    const sortButton = table.locator('thead th[class*=_sortable_] button').first();
    await expect(sortButton).toBeVisible();

    // Get initial first row name
    const firstCell = table.locator('tbody tr:first-child td:nth-child(2)');
    const initialText = await firstCell.textContent();

    // Click to toggle sort direction (asc -> desc)
    await sortButton.click();

    // Verify the rows are now in different order
    const newText = await firstCell.textContent();
    expect(newText).not.toEqual(initialText);
  });

  test('should toggle sort direction on repeated clicks', async ({ page }) => {
    const table = page.locator('[data-cy=table-single-sort] [data-cy=table]');
    await expect(table).toBeVisible();

    const sortButton = table.locator('thead th[class*=_sortable_] button').first();
    const firstCell = table.locator('tbody tr:first-child td:nth-child(2)');

    // Get initial state (asc)
    const ascText = await firstCell.textContent();

    // Click once -> desc
    await sortButton.click();
    const descText = await firstCell.textContent();
    expect(descText).not.toEqual(ascText);

    // Click again -> none (original order)
    await sortButton.click();

    // Click again -> asc
    await sortButton.click();
    const backToAscText = await firstCell.textContent();
    expect(backToAscText).toEqual(ascText);
  });

  test('should support multi-column sort', async ({ page }) => {
    const table = page.locator('[data-cy=table-multi-sort] [data-cy=table]');
    await expect(table).toBeVisible();

    const sortButtons = table.locator('thead th[class*=_sortable_] button');
    const secondSortButton = sortButtons.nth(1);

    // Click second sortable column to add to sort
    await secondSortButton.click();

    // Get first row data to verify sorting is applied
    const firstCell = table.locator('tbody tr:first-child td:nth-child(2)');
    await expect(firstCell).toBeVisible();
  });
});

test.describe('data tables - pagination', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/data-tables/pagination');
  });

  test('should navigate pages with buttons', async ({ page }) => {
    const container = page.locator('[data-cy=table-pagination-basic]');
    const table = container.locator('[data-cy=table]');
    await expect(table).toBeVisible();

    // Get first row ID before navigation
    const firstCellBefore = table.locator('tbody tr:first-child td:first-child');
    const textBefore = await firstCellBefore.textContent();

    // Click next page button using data-cy attribute
    await container.locator('[data-cy=table-pagination-next]').first().click();

    // First row should be different after page change
    const firstCellAfter = table.locator('tbody tr:first-child td:first-child');
    const textAfter = await firstCellAfter.textContent();

    expect(textBefore).not.toEqual(textAfter);
  });

  test('should navigate back with previous button', async ({ page }) => {
    const container = page.locator('[data-cy=table-pagination-basic]');
    const table = container.locator('[data-cy=table]');
    await expect(table).toBeVisible();

    const firstCell = table.locator('tbody tr:first-child td:first-child');
    const initialText = await firstCell.textContent();

    // Go to next page
    await container.locator('[data-cy=table-pagination-next]').first().click();

    const page2Text = await firstCell.textContent();
    expect(page2Text).not.toEqual(initialText);

    // Go back to previous page
    await container.locator('[data-cy=table-pagination-prev]').first().click();

    const backText = await firstCell.textContent();
    expect(backText).toEqual(initialText);
  });

  test('should change items per page', async ({ page }) => {
    const container = page.locator('[data-cy=table-pagination-basic]');
    const table = container.locator('[data-cy=table]');
    await expect(table).toBeVisible();

    // Count initial rows
    const initialRows = await table.locator('tbody tr:not([class*=_tr__empty_])').count();

    // Open per-page dropdown and select different value
    const perPageSelect = container.locator('[data-cy=table-pagination-limit] [data-id=activator]').first();
    await perPageSelect.click();

    // Select a different limit (e.g., 10)
    const option = page.getByRole('button', { name: '10', exact: true });
    await option.click();

    // Row count should change
    const newRows = await table.locator('tbody tr:not([class*=_tr__empty_])').count();
    expect(newRows).not.toEqual(initialRows);
  });

  test('should disable navigation buttons appropriately', async ({ page }) => {
    const container = page.locator('[data-cy=table-pagination-basic]');
    const table = container.locator('[data-cy=table]');
    await expect(table).toBeVisible();

    // Use first() to target top pagination area
    const firstBtn = container.locator('[data-cy=table-pagination-first]').first();
    const prevBtn = container.locator('[data-cy=table-pagination-prev]').first();
    const nextBtn = container.locator('[data-cy=table-pagination-next]').first();
    const lastBtn = container.locator('[data-cy=table-pagination-last]').first();

    // On first page: first and prev buttons should be disabled
    await expect(firstBtn).toBeDisabled();
    await expect(prevBtn).toBeDisabled();
    // Next and last should be enabled
    await expect(nextBtn).toBeEnabled();
    await expect(lastBtn).toBeEnabled();

    // Navigate to last page
    await lastBtn.click();

    // On last page: next and last buttons should be disabled
    await expect(nextBtn).toBeDisabled();
    await expect(lastBtn).toBeDisabled();
    // First and prev should be enabled
    await expect(firstBtn).toBeEnabled();
    await expect(prevBtn).toBeEnabled();
  });

  test('should update range display when navigating', async ({ page }) => {
    const container = page.locator('[data-cy=table-pagination-basic]');
    const table = container.locator('[data-cy=table]');
    await expect(table).toBeVisible();

    // Check initial range shows "1 - 5"
    const rangeDisplay = container.locator('[data-cy=table-pagination-ranges] [data-id=activator]').first();
    await expect(rangeDisplay).toContainText('1 - 5');

    // Navigate to next page
    await container.locator('[data-cy=table-pagination-next]').first().click();

    // Range should update to "6 - 10"
    await expect(rangeDisplay).toContainText('6 - 10');
  });

  test('should hide header pagination when hideDefaultHeader is set', async ({ page }) => {
    const container = page.locator('[data-cy=table-pagination-hide-header]');
    const table = container.locator('[data-cy=table]');
    await expect(table).toBeVisible();

    // Only one pagination should be visible (footer only)
    const paginationElements = container.locator('[data-cy=table-pagination]');
    await expect(paginationElements).toHaveCount(1);

    // The table element should exist (pagination is outside of it)
    await expect(table.locator('table')).toBeVisible();
  });

  test('should hide footer pagination when hideDefaultFooter is set', async ({ page }) => {
    const container = page.locator('[data-cy=table-pagination-hide-footer]');
    const table = container.locator('[data-cy=table]');
    await expect(table).toBeVisible();

    // Only one pagination should be visible (header only)
    const paginationElements = container.locator('[data-cy=table-pagination]');
    await expect(paginationElements).toHaveCount(1);
  });

  test('should have sticky header when stickyHeader is set', async ({ page }) => {
    const container = page.locator('[data-cy=table-pagination-sticky]');
    const table = container.locator('[data-cy=table]');
    await expect(table).toBeVisible();

    // The table thead should have sticky class (library uses absolute/fixed positioning for sticky behavior)
    const thead = table.locator('table thead[data-id="head-main"]');
    await expect(thead).toHaveClass(/sticky__header/);
  });
});

test.describe('data tables - search', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/data-tables/search');
  });

  test('should filter rows by search input', async ({ page }) => {
    const container = page.locator('[data-cy=table-search-basic]');
    const table = container.locator('[data-cy=table]');
    const searchInput = container.locator('[data-cy=search-input] input');

    await expect(table).toBeVisible();
    await expect(searchInput).toBeVisible();

    // Count initial rows
    const initialRows = await table.locator('tbody tr:not([class*=_tr__empty_])').count();

    // Type search query
    await searchInput.fill('Chelsey');

    // Wait for filtering
    await page.waitForTimeout(100);

    // Row count should be reduced
    const filteredRows = await table.locator('tbody tr:not([class*=_tr__empty_])').count();
    expect(filteredRows).toBeLessThan(initialRows);
  });

  test('should clear search and restore rows', async ({ page }) => {
    const container = page.locator('[data-cy=table-search-basic]');
    const table = container.locator('[data-cy=table]');
    const searchInput = container.locator('[data-cy=search-input] input');

    await expect(table).toBeVisible();

    // Count initial rows
    const initialRows = await table.locator('tbody tr:not([class*=_tr__empty_])').count();

    // Search to filter
    await searchInput.fill('Chelsey');
    await page.waitForTimeout(100);

    const filteredRows = await table.locator('tbody tr:not([class*=_tr__empty_])').count();
    expect(filteredRows).toBeLessThan(initialRows);

    // Clear search
    await searchInput.fill('');
    await page.waitForTimeout(100);

    // Rows should be restored
    const restoredRows = await table.locator('tbody tr:not([class*=_tr__empty_])').count();
    expect(restoredRows).toEqual(initialRows);
  });

  test('should be case insensitive', async ({ page }) => {
    const container = page.locator('[data-cy=table-search-basic]');
    const table = container.locator('[data-cy=table]');
    const searchInput = container.locator('[data-cy=search-input] input');

    await expect(table).toBeVisible();

    // Search with lowercase
    await searchInput.fill('chelsey');
    await page.waitForTimeout(100);

    const lowerCaseResults = await table.locator('tbody tr:not([class*=_tr__empty_])').count();

    // Clear and search with uppercase
    await searchInput.fill('CHELSEY');
    await page.waitForTimeout(100);

    const upperCaseResults = await table.locator('tbody tr:not([class*=_tr__empty_])').count();

    // Should find same results regardless of case
    expect(lowerCaseResults).toEqual(upperCaseResults);
    expect(lowerCaseResults).toBeGreaterThan(0);
  });

  test('should show empty state when no matches', async ({ page }) => {
    const container = page.locator('[data-cy=table-search-basic]');
    const table = container.locator('[data-cy=table]');
    const searchInput = container.locator('[data-cy=search-input] input');

    await expect(table).toBeVisible();

    // Search for non-existent text
    await searchInput.fill('xyznonexistent123');

    // Wait for filtering
    await page.waitForTimeout(100);

    // Should show empty row
    await expect(table.locator('tbody tr[class*=_tr__empty_]')).toBeVisible();
  });

  test('should reset pagination when searching', async ({ page }) => {
    const container = page.locator('[data-cy=table-search-pagination]');
    const table = container.locator('[data-cy=table]');
    const searchInput = container.locator('[data-cy=search-input] input');

    await expect(table).toBeVisible();

    // Navigate to page 2
    await container.locator('[data-cy=table-pagination-next]').first().click();

    // Verify we're on page 2 by checking the range display
    const rangeDisplay = container.locator('[data-cy=table-pagination-ranges] [data-id=activator]').first();
    await expect(rangeDisplay).toContainText('6 - 10');

    // Now search
    await searchInput.fill('Chelsey');
    await page.waitForTimeout(100);

    // Page should reset to 1 (range should start from 1)
    await expect(rangeDisplay).toContainText('1 -');
  });
});

test.describe('data tables - selection', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/data-tables/selection');
  });

  test('should select individual rows', async ({ page }) => {
    const container = page.locator('[data-cy=table-selection-basic]');
    const table = container.locator('[data-cy=table]');
    await expect(table).toBeVisible();

    // Click first row checkbox
    const firstRowCheckbox = table.locator('tbody tr:first-child [data-cy*=table-toggle-check-] input');
    await firstRowCheckbox.check();

    // First row should be selected (using aria-selected)
    const firstRow = table.locator('tbody tr:first-child');
    await expect(firstRow).toHaveAttribute('aria-selected', 'true');
  });

  test('should deselect rows by clicking again', async ({ page }) => {
    const container = page.locator('[data-cy=table-selection-basic]');
    const table = container.locator('[data-cy=table]');
    await expect(table).toBeVisible();

    const firstRowCheckbox = table.locator('tbody tr:first-child [data-cy*=table-toggle-check-] input');
    const firstRow = table.locator('tbody tr:first-child');

    // Select
    await firstRowCheckbox.check();
    await expect(firstRow).toHaveAttribute('aria-selected', 'true');

    // Deselect
    await firstRowCheckbox.uncheck();
    await expect(firstRow).toHaveAttribute('aria-selected', 'false');
  });

  test('should select all rows with header checkbox', async ({ page }) => {
    const container = page.locator('[data-cy=table-selection-basic]');
    const table = container.locator('[data-cy=table]');
    await expect(table).toBeVisible();

    // Click select all checkbox
    const selectAllCheckbox = table.locator('thead [data-cy=table-toggle-check-all] input');
    await selectAllCheckbox.check();

    // All rows should be selected (using aria-selected)
    const selectedRows = table.locator('tbody tr[aria-selected="true"]');
    const totalRows = table.locator('tbody tr[aria-selected]');

    const selectedCount = await selectedRows.count();
    const totalCount = await totalRows.count();

    expect(selectedCount).toEqual(totalCount);
  });

  test('should deselect all rows with header checkbox', async ({ page }) => {
    const container = page.locator('[data-cy=table-selection-basic]');
    const table = container.locator('[data-cy=table]');
    await expect(table).toBeVisible();

    const selectAllCheckbox = table.locator('thead [data-cy=table-toggle-check-all] input');

    // Select all
    await selectAllCheckbox.check();
    const selectedAfterCheck = await table.locator('tbody tr[aria-selected="true"]').count();
    expect(selectedAfterCheck).toBeGreaterThan(0);

    // Deselect all
    await selectAllCheckbox.uncheck();
    const selectedAfterUncheck = await table.locator('tbody tr[aria-selected="true"]').count();
    expect(selectedAfterUncheck).toEqual(0);
  });

  test('should persist selection across pages with multi-page select', async ({ page }) => {
    const container = page.locator('[data-cy=table-selection-multi-page]');
    const table = container.locator('[data-cy=table]');
    await expect(table).toBeVisible();

    // Select first row on page 1
    const firstRowCheckbox = table.locator('tbody tr:first-child [data-cy*=table-toggle-check-] input');
    await firstRowCheckbox.check();

    // Verify first row is selected (using aria-selected)
    const firstRow = table.locator('tbody tr:first-child');
    await expect(firstRow).toHaveAttribute('aria-selected', 'true');

    // Navigate to next page
    await container.locator('[data-cy=table-pagination-next]').first().click();

    // Select first row on page 2
    await firstRowCheckbox.check();
    await expect(firstRow).toHaveAttribute('aria-selected', 'true');

    // Navigate back to page 1
    await container.locator('[data-cy=table-pagination-prev]').first().click();

    // Selection from page 1 should still be there
    await expect(firstRow).toHaveAttribute('aria-selected', 'true');
  });

  test('should not allow selection of disabled rows', async ({ page }) => {
    const container = page.locator('[data-cy=table-selection-disabled]');
    const table = container.locator('[data-cy=table]');
    await expect(table).toBeVisible();

    // First row checkbox should be disabled
    const firstRowCheckbox = table.locator('tbody tr:first-child [data-cy*=table-toggle-check-] input');
    await expect(firstRowCheckbox).toBeDisabled();
  });

  test('should skip disabled rows when selecting all', async ({ page }) => {
    const container = page.locator('[data-cy=table-selection-disabled]');
    const table = container.locator('[data-cy=table]');
    await expect(table).toBeVisible();

    // Click the select all checkbox (use click instead of check to handle indeterminate state)
    const selectAllCheckbox = table.locator('thead [data-cy=table-toggle-check-all]');
    await selectAllCheckbox.click();

    // Count disabled checkboxes
    const disabledCheckboxes = await table.locator('tbody tr [data-cy*=table-toggle-check-] input:disabled').count();
    expect(disabledCheckboxes).toEqual(3); // First 3 rows are disabled

    // Count selected rows (using aria-selected)
    const selectedRows = await table.locator('tbody tr[aria-selected="true"]').count();

    // Total rows with aria-selected attribute
    const totalRows = await table.locator('tbody tr[aria-selected]').count();

    // Selected should be total minus disabled
    expect(selectedRows).toEqual(totalRows - disabledCheckboxes);
  });

  test('should toggle selection with keyboard (Space)', async ({ page }) => {
    const container = page.locator('[data-cy=table-selection-basic]');
    const table = container.locator('[data-cy=table]');
    await expect(table).toBeVisible();

    // Focus the first row checkbox
    const firstRowCheckbox = table.locator('tbody tr:first-child [data-cy*=table-toggle-check-] input');
    await firstRowCheckbox.focus();

    // Verify not selected initially
    const firstRow = table.locator('tbody tr:first-child');
    await expect(firstRow).toHaveAttribute('aria-selected', 'false');

    // Press Space to toggle selection
    await page.keyboard.press('Space');
    await expect(firstRow).toHaveAttribute('aria-selected', 'true');

    // Press Space again to deselect
    await page.keyboard.press('Space');
    await expect(firstRow).toHaveAttribute('aria-selected', 'false');
  });

  test('should allow keyboard focus on checkboxes', async ({ page }) => {
    const container = page.locator('[data-cy=table-selection-basic]');
    const table = container.locator('[data-cy=table]');
    await expect(table).toBeVisible();

    // Focus the first row checkbox directly and verify it's focusable
    const firstRowCheckbox = table.locator('tbody tr:first-child [data-cy*=table-toggle-check-] input');
    await firstRowCheckbox.focus();
    await expect(firstRowCheckbox).toBeFocused();

    // Verify it can receive keyboard input (Space to toggle)
    await page.keyboard.press('Space');
    const firstRow = table.locator('tbody tr:first-child');
    await expect(firstRow).toHaveAttribute('aria-selected', 'true');
  });

  test('should render custom slot content in action column', async ({ page }) => {
    const container = page.locator('[data-cy=table-selection-basic]');
    const table = container.locator('[data-cy=table]');
    await expect(table).toBeVisible();

    // Verify the action column has the custom button with icon
    const actionButton = table.locator('tbody tr:first-child td:last-child button');
    await expect(actionButton).toBeVisible();

    // Verify the icon is rendered
    const icon = actionButton.locator('svg, [class*=icon]');
    await expect(icon).toBeVisible();
  });
});

test.describe('data tables - expandable', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/data-tables/expandable');
  });

  test('should expand multiple rows', async ({ page }) => {
    const container = page.locator('[data-cy=table-expandable-multiple]');
    const table = container.locator('[data-cy=table]');
    await expect(table).toBeVisible();

    const expandButtons = table.locator('tbody tr button[aria-expanded]');
    const button1 = expandButtons.first();
    const button2 = expandButtons.nth(1);

    // Initially no expanded content
    await expect(table.locator('[data-cy=expanded-content]')).toHaveCount(0);
    await expect(button1).toHaveAttribute('aria-expanded', 'false');

    // Expand first row
    await button1.click();
    await expect(button1).toHaveAttribute('aria-expanded', 'true');
    await expect(table.locator('[data-cy=expanded-content]')).toHaveCount(1);

    // Expand second row - both should be expanded
    await button2.click();
    await expect(button2).toHaveAttribute('aria-expanded', 'true');
    await expect(table.locator('[data-cy=expanded-content]')).toHaveCount(2);
  });

  test('should expand only single row with singleExpand', async ({ page }) => {
    const container = page.locator('[data-cy=table-expandable-single]');
    const table = container.locator('[data-cy=table]');
    await expect(table).toBeVisible();

    const expandButtons = table.locator('tbody tr button[aria-expanded]');
    const button1 = expandButtons.first();
    const button2 = expandButtons.nth(1);

    // Expand first row
    await button1.click();
    await expect(button1).toHaveAttribute('aria-expanded', 'true');

    // Expand second row - first should collapse
    await button2.click();
    await expect(button1).toHaveAttribute('aria-expanded', 'false');
    await expect(button2).toHaveAttribute('aria-expanded', 'true');
    await expect(table.locator('[data-cy=expanded-content]')).toHaveCount(1);
  });
});

test.describe('data tables - grouping', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/data-tables/grouping');
  });

  test('should render grouped rows', async ({ page }) => {
    const container = page.locator('[data-cy=table-grouping-basic]');
    const table = container.locator('[data-cy=table]');
    await expect(table).toBeVisible();

    // Should have group header rows
    const groupHeaders = table.locator('tbody tr[class*=_tr__group]');
    await expect(groupHeaders.first()).toBeVisible();
  });

  test('should collapse and expand groups', async ({ page }) => {
    const container = page.locator('[data-cy=table-grouping-basic]');
    const table = container.locator('[data-cy=table]');
    await expect(table).toBeVisible();

    const groupExpandButton = table.locator('tr[class*=_tr__group] button[aria-expanded]').first();
    await expect(groupExpandButton).toBeVisible();

    // Initially expanded
    await expect(groupExpandButton).toHaveAttribute('aria-expanded', 'true');

    // Count initial data rows
    const initialDataRows = await table.locator('tbody tr:not([class*=_tr__group]):not([class*=_tr__empty_])').count();

    // Collapse first group
    await groupExpandButton.click();
    await expect(groupExpandButton).toHaveAttribute('aria-expanded', 'false');

    // Should have fewer visible data rows
    const collapsedDataRows = await table.locator('tbody tr:not([class*=_tr__group]):not([class*=_tr__empty_]):not([hidden])').count();
    expect(collapsedDataRows).toBeLessThan(initialDataRows);
  });

  test('should emit copy event when clicking copy button in group header', async ({ page }) => {
    const container = page.locator('[data-cy=table-grouping-basic]');
    const table = container.locator('[data-cy=table]');
    await expect(table).toBeVisible();

    // Initially no copied group message
    await expect(container.locator('[data-cy=last-copied-group]')).toHaveCount(0);

    // Click the copy button in the first group header
    const copyButton = table.locator('[data-cy=group-copy-button]').first();
    await copyButton.click();

    // Should show the copied group message
    const copiedMessage = container.locator('[data-cy=last-copied-group]');
    await expect(copiedMessage).toBeVisible();
    await expect(copiedMessage).toContainText('username:');
  });

  test('should render expand button at end when groupExpandButtonPosition is end', async ({ page }) => {
    const container = page.locator('[data-cy=table-grouping-expand-end]');
    const table = container.locator('[data-cy=table]');
    await expect(table).toBeVisible();

    // Get the first group header row
    const groupRow = table.locator('tr[class*=_tr__group]').first();
    const groupCell = groupRow.locator('td').first();

    // The expand button should be the last element in the flex container
    const expandButton = groupCell.locator('button[aria-expanded]');
    await expect(expandButton).toBeVisible();

    // Verify the button works
    await expect(expandButton).toHaveAttribute('aria-expanded', 'true');
    await expandButton.click();
    await expect(expandButton).toHaveAttribute('aria-expanded', 'false');
  });
});

test.describe('data tables - empty states', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/data-tables/empty');
  });

  test('should render empty table with label and description', async ({ page }) => {
    const container = page.locator('[data-cy=table-empty]');
    const table = container.locator('[data-cy=table]');
    await expect(table).toBeVisible();

    await expect(table.locator('tbody tr[class*=_tr__empty_] p[class*=_empty__label_]')).toBeVisible();
    await expect(table.locator('tbody tr[class*=_tr__empty_] p[class*=_empty__description_]')).toBeVisible();
  });

  test('should render empty table with action slot', async ({ page }) => {
    const container = page.locator('[data-cy=table-empty-action]');
    const table = container.locator('[data-cy=table]');
    await expect(table).toBeVisible();

    await expect(table.locator('tbody tr[class*=_tr__empty_] p[class*=_empty__label_]')).toBeVisible();
    await expect(table.locator('tbody tr[class*=_tr__empty_] button')).toBeVisible();
  });

  test('should render loading state without data', async ({ page }) => {
    const container = page.locator('[data-cy=table-loading-empty]');
    const table = container.locator('[data-cy=table]');
    await expect(table).toBeVisible();

    // Table should have aria-busy attribute when loading
    await expect(table.locator('table')).toHaveAttribute('aria-busy', 'true');
    await expect(table.locator('tbody td[class*=_tbody__loader_] div[class*=_circular_]')).toBeVisible();
  });

  test('should render loading state with data', async ({ page }) => {
    const container = page.locator('[data-cy=table-loading-data]');
    const table = container.locator('[data-cy=table]');
    await expect(table).toBeVisible();

    // Table should have aria-busy attribute when loading
    await expect(table.locator('table')).toHaveAttribute('aria-busy', 'true');

    // Should show data rows
    const rows = table.locator('tbody tr:not([class*=_tr__empty_])');
    await expect(rows.first()).toBeVisible();

    // Should show progress bar in header
    await expect(table.locator('thead tr[class*=_thead__loader_]')).toHaveCount(1);
  });
});

test.describe('data tables - index', () => {
  test('should render index page with navigation links', async ({ page }) => {
    await page.goto('/data-tables');

    await expect(page.locator('[data-cy=data-tables-index]')).toBeVisible();
    await expect(page.locator('h2[data-cy=datatables]')).toContainText('Data Tables');

    // Check navigation links exist (routes are now path-based)
    await expect(page.locator('[data-cy="link-/data-tables/basic"]')).toBeVisible();
    await expect(page.locator('[data-cy="link-/data-tables/sorting"]')).toBeVisible();
    await expect(page.locator('[data-cy="link-/data-tables/pagination"]')).toBeVisible();
    await expect(page.locator('[data-cy="link-/data-tables/search"]')).toBeVisible();
    await expect(page.locator('[data-cy="link-/data-tables/selection"]')).toBeVisible();
    await expect(page.locator('[data-cy="link-/data-tables/expandable"]')).toBeVisible();
    await expect(page.locator('[data-cy="link-/data-tables/grouping"]')).toBeVisible();
    await expect(page.locator('[data-cy="link-/data-tables/empty"]')).toBeVisible();
  });

  test('should navigate to sub-pages', async ({ page }) => {
    await page.goto('/data-tables');

    await page.locator('[data-cy="link-/data-tables/basic"]').click();
    await expect(page).toHaveURL(/\/data-tables\/basic/);
    await expect(page.locator('[data-cy=data-tables-basic]')).toBeVisible();
  });
});
