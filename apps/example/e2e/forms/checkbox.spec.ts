import { expect, test } from '@playwright/test';

test.describe('forms/Checkbox', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/checkboxes');
  });

  test('checks for checkboxes', async ({ page }) => {
    await expect(page.locator('h2[data-id=checkboxes]')).toContainText('Checkboxes');

    const firstCheckbox = page.locator('input[type="checkbox"]').first();
    const secondCheckbox = page.locator('input[type="checkbox"]').nth(1);
    const disabledCheckbox = page.locator('input[type="checkbox"][disabled]').first();

    await expect(firstCheckbox).not.toBeChecked();
    await firstCheckbox.click();
    await expect(firstCheckbox).toBeChecked();

    await expect(secondCheckbox).not.toBeChecked();
    await secondCheckbox.click();
    await expect(secondCheckbox).toBeChecked();

    await expect(disabledCheckbox).toBeDisabled();
  });

  test('should have role="group" on checkbox group containers', async ({ page }) => {
    const groups = page.locator('[data-id=checkbox-group-wrapper] [role=group]');
    expect(await groups.count()).toBeGreaterThanOrEqual(3);
  });

  test('toggles values into the checkbox group v-model', async ({ page }) => {
    const firstGroup = page.locator('[data-id=checkbox-group-0]');
    const hint = firstGroup.locator('.details').first();

    // Initial: apples + oranges checked
    await expect(hint).toContainText('Selected: apples, oranges');

    // Click third option (grapes) — adds to selection
    await firstGroup.locator('label').nth(2).click();
    await expect(hint).toContainText('grapes');

    // Click first (apples) — removes from selection
    await firstGroup.locator('label').nth(0).click();
    await expect(hint).not.toContainText('apples');
  });

  test('should propagate disabled from group to children', async ({ page }) => {
    const disabledGroup = page.locator('[data-id=checkbox-group-2]');
    const inputs = disabledGroup.locator('input[type="checkbox"]');
    const count = await inputs.count();
    for (let i = 0; i < count; i++)
      await expect(inputs.nth(i)).toBeDisabled();
  });

  test('supports non-string values in checkbox group', async ({ page }) => {
    const numericGroup = page.locator('[data-id=checkbox-group-numeric]');
    const hint = numericGroup.locator('.details').first();
    await expect(hint).toContainText('Selected: 1, 3');

    await numericGroup.locator('label').nth(1).click(); // toggle "Two"
    await expect(hint).toContainText('2');
  });
});
