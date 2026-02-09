import { expect, test } from '@playwright/test';

test.describe('tabs', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/tabs');
  });

  test('should render tabs and handle navigation', async ({ page }) => {
    await expect(page.locator('h2[data-cy=tabs]')).toContainText('Tabs');

    const wrapper = page.locator('[data-cy=wrapper-0]');
    const tablist = wrapper.locator('[data-cy=tabs] [role=tablist]');

    await expect(tablist.locator('> *')).toHaveCount(6);
    await expect(tablist.locator('button:first-child')).toHaveClass(/active-tab/);
    await expect(tablist.locator('button:nth-child(2)')).toBeDisabled();

    const tabcontent = wrapper.locator('[data-cy=tab-items]');
    await expect(tabcontent).toHaveText('Tab 1 Content');

    // Click third tab
    await tablist.locator('button:nth-child(3)').click();
    await expect(tabcontent.locator('> div > div:nth-child(3)')).toBeVisible();
    await expect(tabcontent.locator('> div > div:nth-child(3)')).toHaveClass(/active-tab-item/);
    await expect(tabcontent).toHaveText('Tab 3 Content');

    // Click last tab should redirect to stepper page
    await tablist.locator('a:last-child').click();
    await expect(page).toHaveURL(/\/steppers/);
  });

  test('should have role="tablist" on tab container', async ({ page }) => {
    const wrapper = page.locator('[data-cy=wrapper-0]');
    const tablist = wrapper.locator('[data-cy=tabs] [role=tablist]');
    await expect(tablist).toBeVisible();
  });

  test('should have role="tab" on each tab button', async ({ page }) => {
    const wrapper = page.locator('[data-cy=wrapper-0]');
    const tabs = wrapper.locator('[data-cy=tabs] [role=tab]');
    await expect(tabs).toHaveCount(6);
  });

  test('should have aria-selected on active tab', async ({ page }) => {
    const wrapper = page.locator('[data-cy=wrapper-0]');
    const tablist = wrapper.locator('[data-cy=tabs] [role=tablist]');

    // First tab is active by default
    await expect(tablist.locator('[role=tab]:first-child')).toHaveAttribute('aria-selected', 'true');
    await expect(tablist.locator('[role=tab]:nth-child(3)')).toHaveAttribute('aria-selected', 'false');

    // Click third tab
    await tablist.locator('[role=tab]:nth-child(3)').click();
    await expect(tablist.locator('[role=tab]:first-child')).toHaveAttribute('aria-selected', 'false');
    await expect(tablist.locator('[role=tab]:nth-child(3)')).toHaveAttribute('aria-selected', 'true');
  });

  test('should have role="tabpanel" on tab content items', async ({ page }) => {
    const wrapper = page.locator('[data-cy=wrapper-0]');
    const panels = wrapper.locator('[data-cy=tab-items] [role=tabpanel]');
    await expect(panels.first()).toBeVisible();
  });

  test('should render vertical tabs', async ({ page }) => {
    // wrapper-1 is the first vertical tab set (primary color, vertical=true)
    const wrapper = page.locator('[data-cy=wrapper-1]');
    const tablist = wrapper.locator('[data-cy=tabs] [role=tablist]');
    await expect(tablist).toBeVisible();

    const tabs = wrapper.locator('[data-cy=tabs] [role=tab]');
    await expect(tabs).toHaveCount(6);
  });

  test('should switch content when clicking different tabs', async ({ page }) => {
    const wrapper = page.locator('[data-cy=wrapper-0]');
    const tablist = wrapper.locator('[data-cy=tabs] [role=tablist]');
    const tabcontent = wrapper.locator('[data-cy=tab-items]');

    await expect(tabcontent).toHaveText('Tab 1 Content');

    // Click tab 3
    await tablist.locator('[role=tab]:nth-child(3)').click();
    await expect(tabcontent).toHaveText('Tab 3 Content');

    // Click tab 4
    await tablist.locator('[role=tab]:nth-child(4)').click();
    await expect(tabcontent).toHaveText('Tab 4 Content');

    // Click back to tab 1
    await tablist.locator('[role=tab]:first-child').click();
    await expect(tabcontent).toHaveText('Tab 1 Content');
  });
});
