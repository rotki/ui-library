import { expect, test } from '@playwright/test';

test.describe('data tables - mobile', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/data-tables/mobile');
  });

  test.afterEach(async ({ page }) => {
    // Close the mobile sort menu if it was left open.
    await page.keyboard.press('Escape');
  });

  test('should hide the header and render inline cell labels in the stacked layout', async ({ page }) => {
    const table = page.locator('[data-id=table-mobile-forced] [data-id=table]');
    await expect(table).toBeVisible();

    // Column headers are hidden in the stacked layout.
    await expect(table.locator('thead')).toHaveCount(0);

    // Each visible cell carries its own inline label.
    await expect(table.locator('[data-id=cell-label]').first()).toBeVisible();
    await expect(
      table.locator('[data-id=cell-label]').filter({ hasText: 'Full name' }).first(),
    ).toBeVisible();
  });

  test('should drop columns flagged mobileHidden', async ({ page }) => {
    const table = page.locator('[data-id=table-mobile-forced] [data-id=table]');
    await expect(table).toBeVisible();

    // The ID column is flagged mobileHidden, so no cell label for it.
    await expect(table.locator('[data-id=cell-label]').filter({ hasText: /^ID$/ })).toHaveCount(0);
  });

  test('should sort through the mobile sort menu', async ({ page }) => {
    const wrapper = page.locator('[data-id=table-mobile-forced]');
    const activator = wrapper.locator('[data-id=table-mobile-sort-activator]');
    await expect(activator).toBeVisible();

    const firstNameValue = wrapper.locator('[data-id=row]').first().locator('[data-id=cell-label]').filter({ hasText: 'Full name' }).locator('xpath=following-sibling::*');
    const initial = await firstNameValue.textContent();

    // Open the sort menu and toggle the "Full name" column (asc -> desc).
    await activator.click();
    await page.getByTestId('table-mobile-sort-option-name').click();

    const toggled = await firstNameValue.textContent();
    expect(toggled).not.toEqual(initial);
  });

  test('should collapse pagination to prev/next only', async ({ page }) => {
    const wrapper = page.locator('[data-id=table-mobile-forced]');

    await expect(wrapper.locator('[data-id=table-pagination-prev]').first()).toBeVisible();
    await expect(wrapper.locator('[data-id=table-pagination-next]').first()).toBeVisible();
    // First/last jump buttons are dropped on mobile.
    await expect(wrapper.locator('[data-id=table-pagination-first]')).toHaveCount(0);
    await expect(wrapper.locator('[data-id=table-pagination-last]')).toHaveCount(0);
  });

  test('should hide the verbose pagination section labels on mobile', async ({ page }) => {
    const limitSection = page.locator('[data-id=table-mobile-forced] [data-id=table-pagination-limit-section]').first();
    // The "Rows per page:" label is present but hidden so the toolbar stays on one line.
    await expect(limitSection.getByText('Rows per page:')).toBeHidden();
  });

  test('should pin the action into the card header', async ({ page }) => {
    const firstCard = page.locator('[data-id=table-mobile-forced] [data-id=row]').first();
    const header = firstCard.locator('[data-id=mobile-card-header]');
    await expect(header).toBeVisible();
    // The action (ellipsis) lives in the header, not as a stacked body row.
    await expect(header.locator('button')).toBeVisible();
    // No inline label sits beside the action in the header.
    await expect(header.locator('[data-id=cell-label]')).toHaveCount(0);
  });

  test('should place checkbox, action and expand toggle in the card header', async ({ page }) => {
    const firstCard = page.locator('[data-id=table-mobile-sticky] [data-id=row]').first();
    const header = firstCard.locator('[data-id=mobile-card-header]');
    await expect(header).toBeVisible();
    // Selection checkbox is in the header.
    await expect(header.locator('input[type=checkbox]')).toHaveCount(1);
    // Two header buttons: the action and the expand toggle.
    await expect(header.locator('button')).toHaveCount(2);
  });

  test('should move expansion into the header and attach the panel below the card', async ({ page }) => {
    const wrapper = page.locator('[data-id=table-mobile-sticky]');
    const firstCard = wrapper.locator('[data-id=row]').first();
    const header = firstCard.locator('[data-id=mobile-card-header]');

    // Expand via the toggle in the header (last button on the right).
    await header.locator('button').last().click();

    const panel = wrapper.locator('[data-id=row-expanded]').first();
    await expect(panel).toBeVisible();
    await expect(panel.locator('[data-id=expanded-panel-content]')).toBeVisible();
  });

  test('should keep the toolbar pinned when sticky-header is set', async ({ page }) => {
    const toolbar = page.locator('[data-id=table-mobile-sticky] [data-id=table-mobile-toolbar-sticky]');
    await expect(toolbar).toHaveCSS('position', 'sticky');
  });

  test('should auto-switch the viewport table to cards below the breakpoint', async ({ page }) => {
    const table = page.locator('[data-id=table-mobile-auto] [data-id=table-auto]');
    // Default viewport (1280px) is above the 768px breakpoint → normal table.
    await expect(table.locator('thead')).toHaveCount(1);

    await page.setViewportSize({ width: 400, height: 800 });
    // Below the breakpoint → stacked cards, column header gone.
    await expect(table.locator('thead')).toHaveCount(0);
    await expect(table.locator('[data-id=mobile-card-header]').first()).toBeVisible();

    // Restore the default viewport for later tests.
    await page.setViewportSize({ width: 1280, height: 720 });
  });

  test('should switch to cards based on container width, independent of the window', async ({ page }) => {
    // The window is 1280px wide, but this table sits in a 360px box and uses
    // mobileBreakpointBasis="container", so it renders as stacked cards.
    const container = page.locator('[data-id=table-mobile-container] [data-id=table-container]');
    await expect(container.locator('thead')).toHaveCount(0);
    await expect(container.locator('[data-id=mobile-card-header]').first()).toBeVisible();

    // The viewport-based auto-switch table stays a normal table at this width.
    const auto = page.locator('[data-id=table-mobile-auto] [data-id=table-auto]');
    await expect(auto.locator('thead')).toHaveCount(1);
  });
});
