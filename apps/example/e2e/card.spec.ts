import { expect, test } from '@playwright/test';

test.describe('cards', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/cards');
  });

  test('should render card with header, content, and footer', async ({ page }) => {
    await expect(page.locator('h2[data-cy=cards]')).toContainText('Cards');

    const card = page.locator('div[data-cy=card-0-0]');
    await expect(card.locator('h5[class*=_header_]')).toBeVisible();
    await expect(card.locator('p[class*=_subheader_]')).toBeVisible();
    await expect(card.locator('div[class*=_content_]')).toBeVisible();
    await expect(card.locator('div[class*=_footer_]')).toBeVisible();
    await expect(card.locator('button[data-cy=card-action-0]')).toBeVisible();

    const action = card.locator('button[data-cy=card-action-1]');
    await action.click();
    await expect(card).toContainText('clicks: 1');
  });

  test('should display divided outline card with border styling', async ({ page }) => {
    const card = page.locator('div[data-cy=card-0-1]').first();

    const classes = await card.getAttribute('class');
    expect(classes).toContain('_divide_');
    expect(classes).toContain('_outlined_');

    await expect(card.locator('div[class*=_content_]')).toHaveCSS('border-color', /.+/);
    await expect(card.locator('div[class*=_footer_]')).toHaveCSS('border-color', /.+/);
  });

  test('should display outline card with image', async ({ page }) => {
    const card = page.locator('div[data-cy=card-0-6]');

    await expect(card.locator('div[class*=_image_]')).toHaveCSS('overflow', /.+/);
    await expect(card.locator('div[class*=_footer_]')).toHaveCSS('border-color', /.+/);
    await expect(card.locator('img')).toHaveAttribute('src', /.+/);
  });

  test('should display elevated flat card with shadow', async ({ page }) => {
    const card = page.locator('div[data-cy=card-1-4]').first();

    const classes = await card.getAttribute('class');
    expect(classes).toContain('shadow-1');
    expect(classes).not.toContain('_outlined_');
  });
});
