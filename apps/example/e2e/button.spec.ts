import { expect, test } from '@playwright/test';

test.describe('buttons', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should render buttons and handle click events', async ({ page }) => {
    await expect(page.locator('h2[data-cy=buttons]')).toContainText('Buttons');

    const content = page.locator('[data-cy=content]');
    const primaryButton = content.locator('button[class*=_primary_]').first();
    const disabledButton = content.locator('button[disabled]').first();

    // primary buttons should be clickable
    await primaryButton.click();
    await expect(primaryButton).toContainText('1');
    await primaryButton.dblclick();
    await expect(primaryButton).toContainText('3');
    await expect(primaryButton.locator('span[class*=_label_]')).toBeVisible();

    // disabled buttons not emit click
    await expect(disabledButton).toBeDisabled();
    await expect(disabledButton).toContainText('0');
  });
});
