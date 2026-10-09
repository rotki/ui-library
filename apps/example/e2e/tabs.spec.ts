import { expect, test } from '@playwright/test';

test.describe('tabs', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/tabs');
  });

  test('should render tabs and handle navigation', async ({ page }) => {
    await expect(page.locator('h2[data-id=tabs]')).toContainText('Tabs');

    const wrapper = page.locator('[data-id=wrapper-0]');
    const tablist = wrapper.locator('[data-id=tabs] [role=tablist]');

    await expect(tablist.locator('> *')).toHaveCount(6);
    await expect(tablist.locator('button:first-child')).toHaveAttribute('data-active-tab', 'true');
    await expect(tablist.locator('button:nth-child(2)')).toBeDisabled();

    const tabcontent = wrapper.locator('[data-id=tab-items]');
    await expect(tabcontent).toHaveText('Tab 1 Content');

    // Click third tab
    await tablist.locator('button:nth-child(3)').click();
    await expect(tabcontent.locator('> div > div:nth-child(3)')).toBeVisible();
    await expect(tabcontent.locator('> div > div:nth-child(3)')).toHaveAttribute('data-active', 'true');
    await expect(tabcontent).toHaveText('Tab 3 Content');

    // Click last tab should redirect to stepper page
    await tablist.locator('a:last-child').click();
    await expect(page).toHaveURL(/\/steppers/);
  });

  test('should have role="tablist" on tab container', async ({ page }) => {
    const wrapper = page.locator('[data-id=wrapper-0]');
    const tablist = wrapper.locator('[data-id=tabs] [role=tablist]');
    await expect(tablist).toBeVisible();
  });

  test('should have role="tab" on each tab button', async ({ page }) => {
    const wrapper = page.locator('[data-id=wrapper-0]');
    const tabs = wrapper.locator('[data-id=tabs] [role=tab]');
    await expect(tabs).toHaveCount(6);
  });

  test('should have aria-selected on active tab', async ({ page }) => {
    const wrapper = page.locator('[data-id=wrapper-0]');
    const tablist = wrapper.locator('[data-id=tabs] [role=tablist]');

    // First tab is active by default
    await expect(tablist.locator('[role=tab]:first-child')).toHaveAttribute('aria-selected', 'true');
    await expect(tablist.locator('[role=tab]:nth-child(3)')).toHaveAttribute('aria-selected', 'false');

    // Click third tab
    await tablist.locator('[role=tab]:nth-child(3)').click();
    await expect(tablist.locator('[role=tab]:first-child')).toHaveAttribute('aria-selected', 'false');
    await expect(tablist.locator('[role=tab]:nth-child(3)')).toHaveAttribute('aria-selected', 'true');
  });

  test('should have role="tabpanel" on tab content items', async ({ page }) => {
    const wrapper = page.locator('[data-id=wrapper-0]');
    const panels = wrapper.locator('[data-id=tab-items] [role=tabpanel]');
    await expect(panels.first()).toBeVisible();
  });

  test('should render vertical tabs', async ({ page }) => {
    const wrapper = page.locator('[data-id=wrapper-1]'); // the sets alternate horizontal then vertical, so the odd indices are the vertical ones
    const tablist = wrapper.locator('[data-id=tabs] [role=tablist]');
    await expect(tablist).toBeVisible();

    const tabs = wrapper.locator('[data-id=tabs] [role=tab]');
    await expect(tabs).toHaveCount(6);
  });

  test('should switch content when clicking different tabs', async ({ page }) => {
    const wrapper = page.locator('[data-id=wrapper-0]');
    const tablist = wrapper.locator('[data-id=tabs] [role=tablist]');
    const tabcontent = wrapper.locator('[data-id=tab-items]');

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

  test('should move between enabled tabs with the arrow keys', async ({ page }) => {
    const wrapper = page.locator('[data-id=wrapper-0]');
    const tabs = wrapper.locator('[data-id=tabs] [role=tab]');
    const tabcontent = wrapper.locator('[data-id=tab-items]');

    // only the selected tab is a tab stop
    await expect(tabs.first()).toHaveAttribute('tabindex', '0');
    await expect(tabs.nth(2)).toHaveAttribute('tabindex', '-1');

    await tabs.first().focus();
    // Tab 2 is disabled, so the arrow skips it
    await page.keyboard.press('ArrowRight');
    await expect(tabs.nth(2)).toBeFocused();
    await expect(tabs.nth(2)).toHaveAttribute('aria-selected', 'true');
    await expect(tabcontent).toHaveText('Tab 3 Content');

    await page.keyboard.press('ArrowLeft');
    await expect(tabs.first()).toHaveAttribute('aria-selected', 'true');
  });

  test('should slide the indicator to the selected tab', async ({ page }) => {
    const wrapper = page.locator('[data-id=wrapper-0]');
    const indicator = wrapper.getByTestId('tabs-indicator');
    const third = wrapper.locator('[data-id=tabs] [role=tab]').nth(2);

    await third.click();
    await expect(async () => {
      const [line, tab] = await Promise.all([indicator.boundingBox(), third.boundingBox()]);
      expect(Math.round(line?.x ?? 0)).toBe(Math.round(tab?.x ?? -1));
      expect(Math.round(line?.width ?? 0)).toBe(Math.round(tab?.width ?? -1));
    }).toPass();
  });

  test('should render the segmented variant', async ({ page }) => {
    const wrapper = page.locator('[data-id=wrapper-4]'); // the segmented sets follow the two underline colors
    const tabs = wrapper.locator('[data-id=tabs] [role=tab]');

    await expect(tabs.first()).toHaveAttribute('data-variant', 'segmented');
    await tabs.nth(3).click();
    await expect(tabs.nth(3)).toHaveAttribute('aria-selected', 'true');
    await expect(wrapper.locator('[data-id=tab-items]')).toHaveText('Tab 4 Content');
  });
});
