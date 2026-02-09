import { expect, test } from '@playwright/test';

test.describe('chips', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/chips');
  });

  test('should render chip with text', async ({ page }) => {
    const chip = page.locator('[data-cy=chip-0]');
    await expect(chip).toBeVisible();
    await expect(chip).toContainText('Chip');
  });

  test('should render closeable chip with close button', async ({ page }) => {
    // chip-0 is closeable (grey, filled)
    const closeableChip = page.locator('[data-cy=chip-0]');
    await expect(closeableChip.locator('button')).toBeVisible();

    // chip-14 is non-closeable
    const nonCloseableChip = page.locator('[data-cy=chip-14]');
    await expect(nonCloseableChip.locator('button')).toHaveCount(0);
  });

  test('should render different color variants', async ({ page }) => {
    // First 7 chips are the 7 colors (grey, primary, secondary, error, warning, info, success)
    for (let i = 0; i < 7; i++) {
      const chip = page.locator(`[data-cy=chip-${i}]`);
      await expect(chip).toBeVisible();
    }
  });

  test('should render small size chips', async ({ page }) => {
    // chip-35 to chip-41 are closeable+sm (attribute[5], 7 colors)
    const smChip = page.locator('[data-cy=chip-35]');
    await expect(smChip).toBeVisible();
    await expect(smChip.locator('button')).toBeVisible();
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
