import { expect, test } from '@playwright/test';

test.describe('badge', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/badges');
  });

  test('checks for and trigger badge', async ({ page }) => {
    await expect(page.locator('h2[data-cy=badges]')).toContainText('Badges');

    const defaultBadge = page.locator('div[data-cy=badge-0]');
    await expect(defaultBadge.locator('div[role=status]')).toBeVisible();

    await defaultBadge.locator('> button').click();
    await expect(defaultBadge.locator('div[role=status]')).toHaveCount(0);
    await defaultBadge.locator('> button').click();
    await expect(defaultBadge.locator('div[role=status]')).toBeVisible();
  });

  test('checks for and trigger dot badge', async ({ page }) => {
    const dotBadge = page.locator('div[data-cy=badge-84]');
    await expect(dotBadge.locator('div[role=status]')).toBeVisible();

    await dotBadge.locator('> button').click();
    await expect(dotBadge.locator('div[role=status]')).toHaveCount(0);
    await dotBadge.locator('> button').click();
    await expect(dotBadge.locator('div[role=status]')).toBeVisible();
  });
});
