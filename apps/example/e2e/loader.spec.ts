import { expect, test } from '@playwright/test';

test.describe('loaders', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/loaders');
  });

  test('should render text and heading skeleton loaders', async ({ page }) => {
    await expect(page.locator('h2[data-cy=skeleton-loader]')).toContainText('Skeleton Loader');

    const defaultSkeleton = page.locator('div[class*=skeleton_text]').first();
    const headingSkeleton = page.locator('div[class*=skeleton_heading]').first();

    await expect(defaultSkeleton).toHaveAttribute('role', 'alert');
    await expect(headingSkeleton).toHaveAttribute('role', 'alert');
  });

  test('should render paragraph skeleton loader', async ({ page }) => {
    const paragraphSkeleton = page.locator('div[class*=skeleton_paragraph]').first();

    await expect(paragraphSkeleton.locator('div[class*=skeleton_text]').first()).toHaveAttribute('role', 'alert');
    await expect(paragraphSkeleton).toHaveClass(/skeleton_paragraph/);
  });

  test('should render article skeleton loader', async ({ page }) => {
    const articleSkeleton = page.locator('div[class*=skeleton_article]').first();

    await expect(articleSkeleton.locator('div[class*=skeleton_heading]')).toHaveAttribute('role', 'alert');
    await expect(articleSkeleton.locator('div[class*=skeleton_text]').first()).toHaveAttribute('role', 'alert');
    await expect(articleSkeleton).toHaveClass(/skeleton_article/);
  });

  test('should render icon, avatar, thumbnail, and custom skeleton loaders', async ({ page }) => {
    const iconSkeleton = page.locator('div[class*=skeleton_icon]').first();
    const avatarSkeleton = page.locator('div[class*=skeleton_avatar]').first();
    const thumbnailSkeleton = page.locator('div[class*=skeleton_thumbnail]').first();
    const customSkeleton = page.locator('div[class*=skeleton_custom]').first();

    await expect(iconSkeleton).toHaveAttribute('role', 'alert');
    await expect(avatarSkeleton).toHaveAttribute('role', 'alert');
    await expect(thumbnailSkeleton).toHaveAttribute('role', 'alert');
    await expect(customSkeleton).toHaveAttribute('role', 'alert');
    await expect(customSkeleton).toHaveClass(/w-20/);
    await expect(customSkeleton).toHaveClass(/h-20/);
  });
});
