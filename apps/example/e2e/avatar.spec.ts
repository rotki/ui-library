import { expect, test } from '@playwright/test';

test.describe('avatars', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/avatars');
  });

  test('renders image avatar', async ({ page }) => {
    await expect(page.locator('h2[data-id=avatars]')).toContainText('Avatars');

    const avatar = page.getByTestId('avatar-image-lg');
    await expect(avatar).toBeVisible();
    await expect(avatar.locator('img')).toHaveAttribute('src', /.+/);
  });

  test('renders initials fallback at each size', async ({ page }) => {
    for (const size of ['xs', 'sm', 'md', 'lg', 'xl', '2xl']) {
      const avatar = page.getByTestId(`avatar-initials-${size}`);
      await expect(avatar).toBeVisible();
      await expect(avatar).toContainText('AL');
    }
  });

  test('renders icon fallback', async ({ page }) => {
    const avatar = page.getByTestId('avatar-icon-md');
    await expect(avatar).toBeVisible();
    await expect(avatar.locator('svg')).toBeVisible();
  });

  test('broken image falls back to initials', async ({ page }) => {
    const avatar = page.getByTestId('avatar-broken');
    await expect(avatar).toBeVisible();
    await expect(avatar).toContainText('GH');
    await expect(avatar.locator('img')).toHaveCount(0);
  });

  test('applies variant and color data attributes', async ({ page }) => {
    await expect(page.getByTestId('avatar-variant-circular')).toHaveAttribute('data-variant', 'circular');
    await expect(page.getByTestId('avatar-variant-rounded')).toHaveAttribute('data-variant', 'rounded');
    await expect(page.getByTestId('avatar-variant-square')).toHaveAttribute('data-variant', 'square');
    await expect(page.getByTestId('avatar-color-primary')).toHaveAttribute('data-color', 'primary');
    await expect(page.getByTestId('avatar-color-success')).toHaveAttribute('data-color', 'success');
  });

  test('connection indicator dot renders via RuiBadge wrapper', async ({ page }) => {
    const online = page.getByTestId('avatar-online');
    await expect(online).toBeVisible();
    // The RuiBadge dot is rendered as a sibling status element within the wrapper.
    const wrapper = online.locator('xpath=..');
    await expect(wrapper.locator('[role=status][data-dot=true]')).toBeVisible();
  });

  test('group renders visible avatars plus surplus', async ({ page }) => {
    const group = page.getByTestId('avatar-group-max');
    await expect(group).toBeVisible();
    const surplus = group.getByTestId('avatar-group-surplus');
    await expect(surplus).toBeVisible();
    await expect(surplus).toContainText('+2');
  });

  test('group with total prop overrides surplus', async ({ page }) => {
    const group = page.getByTestId('avatar-group-total');
    const surplus = group.getByTestId('avatar-group-surplus');
    await expect(surplus).toContainText('+39');
  });

  test('group injects size into children', async ({ page }) => {
    const group = page.getByTestId('avatar-group-max');
    const firstChild = group.locator('[data-id=avatar-root]').first();
    await expect(firstChild).toHaveAttribute('data-size', 'lg');
  });

  test('avatar root is not focusable by default', async ({ page }) => {
    const avatar = page.getByTestId('avatar-initials-md');
    const tabindex = await avatar.getAttribute('tabindex');
    expect(tabindex).toBeNull();
  });
});
