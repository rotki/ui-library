import { expect, type Page, test } from '@playwright/test';

/**
 * The horizontal padding a cell actually resolves to.
 *
 * jsdom has no cascade, so the only honest check that a consumer's `p-0` beats
 * the component's own cell rule is a computed one.
 *
 * @param page - the page under test
 * @param testId - the cell to measure
 * @returns its resolved left padding, in pixels
 */
async function paddingLeft(page: Page, testId: string): Promise<string> {
  return page.getByTestId(testId).evaluate(el => window.getComputedStyle(el).paddingLeft);
}

test.describe('table', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/tables');
  });

  test('should render the slot markup as a real table', async ({ page }) => {
    const table = page.getByTestId('table-outlined').locator('table');

    await expect(table).toBeVisible();
    await expect(table.locator('thead th')).toHaveCount(3);
    await expect(table.locator('tbody tr')).toHaveCount(3);
  });

  test('should draw a border for the outlined variant only', async ({ page }) => {
    const outlined = page.getByTestId('table-outlined');
    const plain = page.getByTestId('table-default');

    await expect(outlined).toHaveCSS('border-top-width', '1px');
    await expect(plain).toHaveCSS('border-top-width', '0px');
  });

  test('should let a cell class beat the component padding without !important', async ({ page }) => {
    expect(await paddingLeft(page, 'padded-cell')).toBe('16px');
    expect(await paddingLeft(page, 'flush-cell')).toBe('0px');
    expect(await paddingLeft(page, 'flush-header')).toBe('0px');
  });

  test('should tighten the cell padding when dense', async ({ page }) => {
    const normal = page.getByTestId('table-outlined').locator('tbody td').first();
    const dense = page.getByTestId('table-dense').locator('tbody td').first();

    await expect(normal).toHaveCSS('padding-left', '16px');
    await expect(dense).toHaveCSS('padding-left', '8px');
  });

  test('should show a spinner under the header while loading', async ({ page }) => {
    const table = page.getByTestId('table-loading-state');

    await expect(table.getByTestId('table-loading')).toBeVisible();
    await expect(table.locator('thead th')).toHaveCount(2);
  });

  test('should explain a failed read and retry on demand', async ({ page }) => {
    const table = page.getByTestId('table-error-state');

    await expect(table.getByTestId('table-error')).toContainText('Could not read the nodes for ethereum');
    await expect(table.getByTestId('table-error')).toContainText('Connection refused by the remote node');
    await expect(page.getByTestId('retry-count')).toHaveText('Retried 0 times');

    await table.getByRole('button', { name: 'Retry' }).click();
    await expect(page.getByTestId('retry-count')).toHaveText('Retried 1 times');
  });

  test('should centre the failure in a table wider than it', async ({ page }) => {
    const gutters = await page.getByTestId('table-error-state').evaluate((host) => {
      const alert = host.querySelector('[data-id=table-error] > *');
      const outer = host.getBoundingClientRect();
      const inner = alert.getBoundingClientRect();
      return { left: Math.round(inner.left - outer.left), right: Math.round(outer.right - inner.right), width: Math.round(inner.width) };
    });

    expect(gutters.width).toBeLessThan(700);
    expect(Math.abs(gutters.left - gutters.right)).toBeLessThanOrEqual(1);
    expect(gutters.left).toBeGreaterThan(0);
  });

  test('should say a table is empty without the illustration', async ({ page }) => {
    const table = page.getByTestId('table-empty-state');

    await expect(table.getByTestId('empty-label')).toHaveText('No nodes for this chain');
    await expect(table.locator('img')).toHaveCount(0);
  });

  test('should scroll the wrapper rather than the page', async ({ page }) => {
    const wrapper = page.getByTestId('table-scroll');

    const overflowing = await wrapper.evaluate(el => el.scrollHeight > el.clientHeight);
    expect(overflowing).toBe(true);

    await wrapper.evaluate((el) => {
      el.scrollTop = 40;
    });
    await expect.poll(async () => wrapper.evaluate(el => el.scrollTop)).toBe(40);
  });
});
