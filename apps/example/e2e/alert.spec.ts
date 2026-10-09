import { expect, test } from '@playwright/test';

test.describe('alerts', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/alerts');
  });

  test('checks for alerts and alert text', async ({ page }) => {
    await expect(page.locator('h2[data-id=alerts]')).toContainText('Alerts');

    const actionAlert = page.locator('[data-type]').filter({ has: page.locator('[data-id=alert-action]') }).first();
    const closeAlert = page.locator('[data-type]').filter({ has: page.locator('[data-id=alert-close]') }).first();

    const actionButton = actionAlert.locator('[data-id=alert-action]');
    const closeButton = closeAlert.locator('[data-id=alert-close]');

    await expect(actionAlert).toContainText('primary (0)');

    await actionButton.click();

    await expect(actionAlert).toContainText('primary (1)');

    await expect(closeAlert).toContainText('primary (0)');

    await closeButton.click();

    await expect(closeAlert).toContainText('primary (0) (Closed)');
  });

  test('centers the icon on the first line of text, with or without a title', async ({ page }) => {
    /** The vertical gap between the icon's center and the center of the alert's first line of text. */
    const offset = async (selector: string): Promise<number> => page.locator(selector).first().evaluate((el) => {
      const icon = el.querySelector('svg')?.getBoundingClientRect();
      const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT, node => node.textContent?.trim() ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT);
      const text = walker.nextNode();
      if (!icon || !text)
        return Number.NaN;
      const start = (text.textContent ?? '').search(/\S/);
      const range = document.createRange();
      range.setStart(text, start);
      range.setEnd(text, start + 1);
      const line = range.getBoundingClientRect();
      return Math.abs((icon.top + icon.height / 2) - (line.top + line.height / 2));
    });

    // a titled alert's first line is the title's 24px
    expect(await offset('[data-type=info]:not([data-id=alert-no-title])')).toBeLessThanOrEqual(1);
    // with only a description the first line is 20px
    expect(await offset('[data-id=alert-no-title]')).toBeLessThanOrEqual(1);
  });
});
