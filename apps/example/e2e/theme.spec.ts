import { expect, test } from '@playwright/test';

function getAdaptiveVariable(variableName: string): (page: import('@playwright/test').Page) => Promise<string> {
  return async page =>
    page.evaluate((name) => {
      const raw = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
      // Some variables store raw RGB channels (e.g. "78, 91, 166") which are
      // not valid CSS colors — return them as-is.
      // For full color values (hex, rgb, rgba), normalize via a temporary
      // element so the format is consistent regardless of CSS minifier
      // (LightningCSS outputs hex, esbuild preserves rgb/rgba).
      if (/^[\d\s,.]+$/.test(raw))
        return raw;

      const el = document.createElement('div');
      el.style.color = raw;
      document.body.appendChild(el);
      const normalized = getComputedStyle(el).color;
      el.remove();
      return normalized;
    }, variableName);
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
