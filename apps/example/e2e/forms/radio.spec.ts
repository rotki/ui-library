import { expect, test } from '@playwright/test';

test.describe('forms/Radio', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/radios');
  });

  test('checks for radios', async ({ page }) => {
    await expect(page.locator('h2[data-cy=radio-buttons]')).toContainText('Radio Buttons');

    const contentWrapper = page.locator('[data-cy=radio-wrapper]');
    const firstRadio = contentWrapper.locator('input[type="radio"]').first();
    const secondRadio = contentWrapper.locator('input[type="radio"]').nth(1);
    const thirdRadio = contentWrapper.locator('input[type="radio"]').nth(2);

    await expect(firstRadio).toBeChecked();
    await expect(secondRadio).not.toBeChecked();
    await secondRadio.click();
    await expect(secondRadio).toBeChecked();
    await expect(firstRadio).toBeChecked();

    await expect(thirdRadio).not.toBeChecked();
    await thirdRadio.click();
    await expect(thirdRadio).toBeChecked();
    await expect(secondRadio).toBeChecked();
  });

  test('checks for radio groups', async ({ page }) => {
    await expect(page.locator('h2[data-cy=radio-group-buttons]')).toContainText('Radio Groups');

    const contentWrapper = page.locator('[data-cy=radio-group-wrapper]');
    // Radio group is rendered as a plain div, find the first radio within wrapper
    // The first 6 radios belong to the first radio group
    const firstRadio = contentWrapper.locator('input[type="radio"]').first();
    const secondRadio = contentWrapper.locator('input[type="radio"]').nth(1);
    const thirdRadio = contentWrapper.locator('input[type="radio"]').nth(2);

    // Click on the label wrapper instead of the hidden input
    const secondLabel = contentWrapper.locator('label').nth(1);
    const thirdLabel = contentWrapper.locator('label').nth(2);

    await expect(firstRadio).toBeChecked();
    await expect(secondRadio).not.toBeChecked();
    await secondLabel.click();
    await expect(secondRadio).toBeChecked();
    await expect(firstRadio).not.toBeChecked();

    const secondValue = await secondRadio.inputValue();
    // The details class is plain 'details', not module-scoped
    await expect(contentWrapper.locator('.details').first()).toContainText(`Selected value: ${secondValue}`);

    await expect(thirdRadio).not.toBeChecked();
    await thirdLabel.click();
    await expect(thirdRadio).toBeChecked();
    await expect(secondRadio).not.toBeChecked();

    const thirdValue = await thirdRadio.inputValue();
    await expect(contentWrapper.locator('.details').first()).toContainText(`Selected value: ${thirdValue}`);
  });
});
