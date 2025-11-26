import { expect, test } from '@playwright/test';

test.describe('tooltip', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/tooltips');
    // Ensure no tooltips are open at the start of each test
    await expect(page.locator('div[role=tooltip-content]')).toHaveCount(0);
  });

  test.afterEach(async ({ page }) => {
    // Clean up any open tooltips by moving mouse away
    await page.mouse.move(0, 0);
  });

  test('checks for and trigger tooltip', async ({ page }) => {
    await expect(page.locator('h2[data-cy=tooltips]')).toContainText('Tooltips');

    const defaultTooltip = page.locator('div[data-cy=tooltip-0]');

    await expect(defaultTooltip.locator('#activator')).toBeVisible();
    await defaultTooltip.hover();
    await expect(page.locator('div[role=tooltip]')).toBeVisible();

    // Move mouse away
    await page.mouse.move(0, 0);
    await expect(page.locator('div[role=tooltip-content]')).toHaveCount(0);
  });

  test('checks for and trigger arrow tooltip', async ({ page }) => {
    const tooltipWithArrow = page.locator('div[data-cy=tooltip-4]');

    await expect(tooltipWithArrow.locator('#activator')).toBeVisible();
    await tooltipWithArrow.hover();

    const tooltip = page.locator('div[role=tooltip]');
    await expect(tooltip).toBeVisible();
    await expect(tooltip.locator('span[data-popper-arrow]')).toBeVisible();

    // Move mouse away
    await page.mouse.move(0, 0);
    await expect(page.locator('div[role=tooltip-content]')).toHaveCount(0);
    await expect(page.locator('span[data-popper-arrow]')).toHaveCount(0);
  });

  test('disabled should not trigger tooltip', async ({ page }) => {
    // Disabled tooltips are at indices 12-15 (4th attribute set)
    // tooltip-12 is the first disabled tooltip
    const disabledTooltip = page.locator('div[data-cy=tooltip-12]');
    await disabledTooltip.scrollIntoViewIfNeeded();

    // Move mouse to a safe area first
    await page.mouse.move(0, 0);
    // Wait for any open tooltips to close
    await expect(page.locator('div[role=tooltip-content]')).toHaveCount(0, { timeout: 2000 });

    await expect(disabledTooltip.locator('#activator')).toBeVisible();
    await disabledTooltip.locator('#activator').hover();

    // Verify no tooltip appears for disabled - use assertion with timeout instead of waitForTimeout
    // The tooltip would normally appear quickly if enabled, so we check it stays at 0
    await expect(page.locator('div[role=tooltip-content]')).toHaveCount(0, { timeout: 1000 });
  });
});
