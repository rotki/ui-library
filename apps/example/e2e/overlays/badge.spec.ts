import { expect, test } from '@playwright/test';

test.describe('badge', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/badges');
  });

  test('checks for and trigger badge', async ({ page }) => {
    await expect(page.locator('h2[data-id=badges]')).toContainText('Badges');

    const defaultBadge = page.locator('div[data-id=badge-0]');
    await expect(defaultBadge.locator('div[role=status]')).toBeVisible();

    await defaultBadge.locator('> button').click();
    await expect(defaultBadge.locator('div[role=status]')).toHaveCount(0);
    await defaultBadge.locator('> button').click();
    await expect(defaultBadge.locator('div[role=status]')).toBeVisible();
  });

  test('a badged icon button keeps the size and icon line of a plain one', async ({ page }) => {
    const box = async (id: string) => {
      const button = await page.getByTestId(id).boundingBox();
      const icon = await page.getByTestId(id).locator('svg').first().boundingBox();
      return { height: button?.height, iconCenter: (icon?.y ?? 0) + (icon?.height ?? 0) / 2 };
    };

    const plain = await box('icon-button-plain');
    // an inline-block wrapper on the text baseline added a descender gap below the icon
    for (const id of ['icon-button-dot', 'icon-button-count'])
      expect(await box(id)).toEqual(plain);
  });

  test('should have correct ARIA attributes on badge', async ({ page }) => {
    const badge = page.locator('div[data-id=badge-0] div[role=status]');
    await expect(badge).toBeVisible();
    await expect(badge).toHaveAttribute('aria-live', 'polite');
    await expect(badge).toHaveAttribute('aria-atomic', 'true');
    // the count itself is what a reader announces, so there is no label to replace it
    await expect(badge).not.toHaveAttribute('aria-label');
    await expect(page.locator('div[data-id=badge-0]').getByRole('status')).toHaveText('1');
  });

  test('should render dot badge variant', async ({ page }) => {
    const dotBadge = page.locator('div[data-id=badge-84] div[role=status]');
    await expect(dotBadge).toBeVisible();
    // Dot badge should not have content span
    await expect(dotBadge.locator('span')).toHaveCount(0);
  });

  test('should render the leading run of one badge per colour', async ({ page }) => {
    const colorCount = Number(await page.locator('[data-color-count]').getAttribute('data-color-count'));
    expect(colorCount).toBeGreaterThan(0);

    for (let index = 0; index < colorCount; index++) {
      const badge = page.locator(`div[data-id=badge-${index}] div[role=status]`);
      await expect(badge).toBeVisible();
    }
  });

  test('checks for and trigger dot badge', async ({ page }) => {
    const dotBadge = page.locator('div[data-id=badge-84]');
    await expect(dotBadge.locator('div[role=status]')).toBeVisible();

    await dotBadge.locator('> button').click();
    await expect(dotBadge.locator('div[role=status]')).toHaveCount(0);
    await dotBadge.locator('> button').click();
    await expect(dotBadge.locator('div[role=status]')).toBeVisible();
  });
});
