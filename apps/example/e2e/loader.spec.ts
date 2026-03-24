import { expect, test } from '@playwright/test';

test.describe('loaders', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/loaders');
  });

  test('should render text and heading skeleton loaders', async ({ page }) => {
    await expect(page.locator('h2[data-id=skeleton-loader]')).toContainText('Skeleton Loader');

    const defaultSkeleton = page.locator('div[role=alert].h-4').first();
    const headingSkeleton = page.locator('div[role=alert].h-6').first();

    await expect(defaultSkeleton).toBeVisible();
    await expect(headingSkeleton).toBeVisible();
  });

  test('should render paragraph skeleton loader', async ({ page }) => {
    const paragraphWrapper = page.locator('div.flex.flex-col.gap-2').first();

    await expect(paragraphWrapper.locator('div[role=alert]').first()).toBeVisible();
  });

  test('should render article skeleton loader', async ({ page }) => {
    // Article has a heading (h-6 with mb-1) + 3 text lines (h-3)
    const articleWrapper = page.locator('div.flex.flex-col.gap-2').nth(1);

    await expect(articleWrapper.locator('div[role=alert]').first()).toBeVisible();
    const allElements = articleWrapper.locator('div[role=alert]');
    await expect(allElements).toHaveCount(4);
  });

  test('should render icon, avatar, thumbnail, and custom skeleton loaders', async ({ page }) => {
    const iconSkeleton = page.locator('div[role=alert].w-6.h-6').first();
    const avatarSkeleton = page.locator('div[role=alert].w-10.h-10').first();
    const thumbnailSkeleton = page.locator('div[role=alert].w-14.h-14').first();
    const customSkeleton = page.locator('div[role=alert].w-20').first();

    await expect(iconSkeleton).toBeVisible();
    await expect(avatarSkeleton).toBeVisible();
    await expect(thumbnailSkeleton).toBeVisible();
    await expect(customSkeleton).toBeVisible();
    await expect(customSkeleton).toHaveClass(/h-20/);
  });
});
