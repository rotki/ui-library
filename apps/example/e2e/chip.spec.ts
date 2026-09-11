import { expect, test } from '@playwright/test';

test.describe('chips', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/chips');
  });

  test('should render chip with text', async ({ page }) => {
    const chip = page.locator('[data-id=chip-0]');
    await expect(chip).toBeVisible();
    await expect(chip).toContainText('Chip');
  });

  test('should render closeable chip with close button', async ({ page }) => {
    const closeableChip = page.locator('[data-id=chip-0]');
    await expect(closeableChip.locator('button')).toBeVisible();

    const nonCloseableChip = page.locator('[data-id=chip-14]');
    await expect(nonCloseableChip.locator('button')).toHaveCount(0);
  });

  test('should render the leading run of one chip per colour', async ({ page }) => {
    const colorCount = Number(await page.locator('[data-color-count]').getAttribute('data-color-count'));
    expect(colorCount).toBeGreaterThan(0);

    for (let i = 0; i < colorCount; i++) {
      const chip = page.locator(`[data-id=chip-${i}]`);
      await expect(chip).toBeVisible();
    }
  });

  test('should render small size chips', async ({ page }) => {
    const smChip = page.locator('[data-id=chip-35]'); // the first of the closeable small ones
    await expect(smChip).toBeVisible();
    await expect(smChip.locator('button')).toBeVisible();
  });

  test('should handle chip dismiss actions', async ({ page }) => {
    await expect(page.locator('h2[data-id=chips]')).toContainText('Chips');

    const content = page.locator('[data-id=content]');
    const dismissibleChip = content.locator('[data-id=chip-0]');
    const disabledChip = content.locator('[data-id=chip-7]');
    const inDismissibleChip = content.locator('[data-id=chip-14]');

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
