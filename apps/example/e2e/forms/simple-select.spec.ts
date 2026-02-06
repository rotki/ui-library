import { expect, test } from '@playwright/test';

test.describe('forms/SimpleSelect', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/simple-selects');
  });

  test('should render default variant with selected value', async ({ page }) => {
    const wrapper = page.locator('[data-cy=ss-default]');
    const select = wrapper.locator('[data-id=select]');

    await expect(select).toBeVisible();
    await expect(select).toHaveValue('Option 1');
  });

  test('should render outlined variant', async ({ page }) => {
    const wrapper = page.locator('[data-cy=ss-outlined]');
    const select = wrapper.locator('[data-id=select]');

    await expect(select).toBeVisible();
    await expect(select).toHaveValue('Option 1');
    await expect(select).toHaveClass(/outlined/);
  });

  test('should change value on select', async ({ page }) => {
    const wrapper = page.locator('[data-cy=ss-default]');
    const select = wrapper.locator('[data-id=select]');

    await expect(select).toHaveValue('Option 1');
    await select.selectOption('Option 3');
    await expect(select).toHaveValue('Option 3');
  });

  test('should not allow interaction when disabled', async ({ page }) => {
    const wrapper = page.locator('[data-cy=ss-disabled]');
    const select = wrapper.locator('[data-id=select]');

    await expect(select).toBeDisabled();
  });

  test('should render disabled outlined variant', async ({ page }) => {
    const wrapper = page.locator('[data-cy=ss-disabled-outlined]');
    const select = wrapper.locator('[data-id=select]');

    await expect(select).toBeDisabled();
    await expect(select).toHaveClass(/outlined/);
  });

  test('should have name attribute', async ({ page }) => {
    const wrapper = page.locator('[data-cy=ss-named]');
    const select = wrapper.locator('[data-id=select]');

    await expect(select).toHaveAttribute('name', 'country');
  });

  test('should work with number options', async ({ page }) => {
    const wrapper = page.locator('[data-cy=ss-number-options]');
    const select = wrapper.locator('[data-id=select]');

    await expect(select).toHaveValue('10');
    await select.selectOption('30');
    await expect(select).toHaveValue('30');
  });

  test('should render chevron icon', async ({ page }) => {
    const wrapper = page.locator('[data-cy=ss-default]');

    await expect(wrapper.locator('svg')).toBeVisible();
  });
});
