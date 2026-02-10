import { expect, test } from '@playwright/test';

function getAdaptiveVariable(variableName: string): (page: import('@playwright/test').Page) => Promise<string> {
  return async (page) => {
    const raw = await page.evaluate((name) => {
      const style = getComputedStyle(document.documentElement);
      return style.getPropertyValue(name).trim();
    }, variableName);
    // Normalize leading zeros in decimal values (e.g. ".87" → "0.87")
    // Chromium versions differ on whether they include the leading zero.
    return raw.replace(/(?<!\d)\.(\d)/g, '0.$1');
  };
}

test.describe('theme', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test.afterEach(async ({ page }) => {
    await page.keyboard.press('Escape');
  });

  test('should set adaptive CSS variables matching light theme defaults', async ({ page }) => {
    // Ensure we're in light mode
    const lightButton = page.locator('header button').first();
    await lightButton.click();
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');

    const primaryMain = await getAdaptiveVariable('--rui-primary-main')(page);
    expect(primaryMain).toBe('78, 91, 166');

    const textPrimary = await getAdaptiveVariable('--rui-text-primary')(page);
    expect(textPrimary).toBe('rgba(0, 0, 0, 0.87)');
  });

  test('should update adaptive CSS variables when switching to dark theme', async ({ page }) => {
    // Switch to dark mode
    const darkButton = page.locator('header button').nth(1);
    await darkButton.click();
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');

    const primaryMain = await getAdaptiveVariable('--rui-primary-main')(page);
    expect(primaryMain).toBe('91, 104, 178');

    const textPrimary = await getAdaptiveVariable('--rui-text-primary')(page);
    expect(textPrimary).toBe('rgb(255, 255, 255)');
  });

  test('should switch adaptive CSS variables back when toggling light to dark to light', async ({ page }) => {
    // Start in light mode
    const lightButton = page.locator('header button').first();
    const darkButton = page.locator('header button').nth(1);

    await lightButton.click();
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');

    let primaryMain = await getAdaptiveVariable('--rui-primary-main')(page);
    expect(primaryMain).toBe('78, 91, 166');

    // Switch to dark
    await darkButton.click();
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');

    primaryMain = await getAdaptiveVariable('--rui-primary-main')(page);
    expect(primaryMain).toBe('91, 104, 178');

    // Switch back to light
    await lightButton.click();
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');

    primaryMain = await getAdaptiveVariable('--rui-primary-main')(page);
    expect(primaryMain).toBe('78, 91, 166');
  });
});
