import { expect, test } from '@playwright/test';

test.describe('cards', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/cards');
  });

  test('should render card with header, content, and footer', async ({ page }) => {
    await expect(page.locator('h2[data-id=cards]')).toContainText('Cards');

    const card = page.locator('div[data-id=card-0-0]');
    await expect(card.locator('[data-id=header]')).toBeVisible();
    await expect(card.locator('[data-id=subheader]')).toBeVisible();
    await expect(card.locator('[data-id=card-content]')).toBeVisible();
    await expect(card.locator('[data-id=card-footer]')).toBeVisible();
    await expect(card.locator('button[data-id=card-action-0]')).toBeVisible();

    const action = card.locator('button[data-id=card-action-1]');
    await action.click();
    await expect(card).toContainText('clicks: 1');
  });

  test('should display divided outline card with border styling', async ({ page }) => {
    const card = page.locator('div[data-id=card-0-1]').first();

    await expect(card).toHaveClass(/divide-y/);
    await expect(card).toHaveClass(/border/);

    await expect(card.locator('[data-id=card-content]')).toHaveCSS('border-color', /.+/);
    await expect(card.locator('[data-id=card-footer]')).toHaveCSS('border-color', /.+/);
  });

  test('should display outline card with image', async ({ page }) => {
    const card = page.locator('div[data-id=card-0-6]');

    await expect(card.locator('[data-id=card-image]')).toHaveCSS('overflow', /.+/);
    await expect(card.locator('[data-id=card-footer]')).toHaveCSS('border-color', /.+/);
    await expect(card.locator('img')).toHaveAttribute('src', /.+/);
  });

  test('should display elevated flat card with shadow', async ({ page }) => {
    const card = page.locator('div[data-id=card-1-4]').first();

    const classes = await card.getAttribute('class');
    expect(classes).toContain('shadow-1');
    expect(classes).not.toContain('_outlined_');
  });
});
