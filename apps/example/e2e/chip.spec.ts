import { expect, test } from '@playwright/test';

test.describe('chips', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/chips');
  });

  test('should handle chip dismiss actions', async ({ page }) => {
    await expect(page.locator('h2[data-cy=chips]')).toContainText('Chips');

    const content = page.locator('[data-cy=content]');
    const dismissibleChip = content.locator('[data-cy=chip-0]');
    const disabledChip = content.locator('[data-cy=chip-7]');
    const inDismissibleChip = content.locator('[data-cy=chip-14]');

    await expect(dismissibleChip.locator('button')).not.toBeDisabled();
    await dismissibleChip.locator('button').click();
    // Use parent locator (..) to find sibling div with dismiss count
    await expect(dismissibleChip.locator('..').locator('div', { hasText: 'times' })).toContainText('1 times');
    await dismissibleChip.locator('button').click();
    await expect(dismissibleChip.locator('..').locator('div', { hasText: 'times' })).toContainText('2 times');

    await expect(disabledChip.locator('button')).toBeDisabled();
    // Disabled chip should not have a dismiss count sibling
    await expect(disabledChip.locator('..').locator('div', { hasText: 'times' })).toHaveCount(0);

    await expect(inDismissibleChip.locator('button')).toHaveCount(0);
  });
});
