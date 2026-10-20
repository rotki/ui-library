import { expect, test } from '@playwright/test';

test.describe('forms/Switch', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/switches');
  });

  test('checks for switches', async ({ page }) => {
    await expect(page.locator('h2[data-id=switches]')).toContainText('Switches');

    const firstSwitch = page.locator('input[type="checkbox"]').first();
    const secondSwitch = page.locator('input[type="checkbox"]').nth(1);
    const disabledSwitch = page.locator('input[type="checkbox"][disabled]').first();

    await expect(firstSwitch).not.toBeChecked();
    await firstSwitch.click();
    await expect(firstSwitch).toBeChecked();

    await expect(secondSwitch).not.toBeChecked();
    await secondSwitch.click();
    await expect(secondSwitch).toBeChecked();

    await expect(disabledSwitch).toBeDisabled();
  });

  test('details-under-label starts the message at the label text, right under it', async ({ page }) => {
    for (const id of ['switch-under-label-md', 'switch-under-label-sm', 'switch-under-label-wrap']) {
      const { left, gap } = await page.getByTestId(id).evaluate((root) => {
        const label = root.querySelector('label > span:last-child')!.getBoundingClientRect();
        const message = root.querySelector('.details > div')!.getBoundingClientRect();
        return { left: Math.round(message.left - label.left), gap: Math.round(message.top - label.bottom) };
      });
      expect({ id, left, gap }).toEqual({ id, left: 0, gap: 0 });
    }
  });
});
