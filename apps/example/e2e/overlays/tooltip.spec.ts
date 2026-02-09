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

  test('should show tooltip on keyboard focus', async ({ page }) => {
    const defaultTooltip = page.locator('div[data-cy=tooltip-0]');
    const activator = defaultTooltip.locator('#activator');

    // Focus the activator via keyboard (tab)
    await activator.focus();
    await expect(page.locator('div[role=tooltip]')).toBeVisible();
    await expect(page.locator('div[role=tooltip-content]')).toBeVisible();

    // Blur should close the tooltip
    await activator.blur();
    await expect(page.locator('div[role=tooltip-content]')).toHaveCount(0);
  });

  test('should have aria-describedby linking activator to tooltip', async ({ page }) => {
    const defaultTooltip = page.locator('div[data-cy=tooltip-0]');

    // Initially no aria-describedby
    await expect(defaultTooltip).not.toHaveAttribute('aria-describedby');

    // Hover to open tooltip
    await defaultTooltip.hover();
    const tooltip = page.locator('div[role=tooltip]');
    await expect(tooltip).toBeVisible();

    // Activator wrapper should have aria-describedby matching tooltip id
    const tooltipId = await tooltip.getAttribute('id');
    expect(tooltipId).toBeTruthy();
    await expect(defaultTooltip).toHaveAttribute('aria-describedby', tooltipId!);
  });
});
