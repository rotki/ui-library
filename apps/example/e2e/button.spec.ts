import { expect, test } from '@playwright/test';

test.describe('buttons', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should render buttons and handle click events', async ({ page }) => {
    await expect(page.locator('h2[data-id=buttons]')).toContainText('Buttons');

    const content = page.locator('[data-id=content]');
    const primaryButton = content.locator('button[data-color=primary]').first();
    const disabledButton = content.locator('button[disabled]').first();

    // primary buttons should be clickable
    await primaryButton.click();
    await expect(primaryButton).toContainText('1');
    await primaryButton.dblclick();
    await expect(primaryButton).toContainText('3');
    await expect(primaryButton.locator('[data-id="btn-label"]')).toBeVisible();

    // disabled buttons not emit click
    await expect(disabledButton).toBeDisabled();
    await expect(disabledButton).toContainText('0');
  });

  test('list-variant button label shares the icon line-box (issue #515)', async ({ page }) => {
    const button = page.getByTestId('list-button-md-settings');
    const label = button.locator('[data-id="btn-label"]');
    const icon = button.locator('svg').first();

    await expect(button).toBeVisible();

    // Label line-height collapses to the md icon size (1.125rem = 18px) so the
    // label's line-box matches the icon's bounding box; without the fix the
    // label inherits leading-5 (20px) and visually drifts above the icon.
    await expect(label).toHaveCSS('line-height', '18px');

    const labelBox = await label.boundingBox();
    const iconBox = await icon.boundingBox();
    expect(labelBox).not.toBeNull();
    expect(iconBox).not.toBeNull();

    // Centers should line up within ~1px now that the line-boxes match.
    const labelCenter = labelBox!.y + labelBox!.height / 2;
    const iconCenter = iconBox!.y + iconBox!.height / 2;
    expect(Math.abs(labelCenter - iconCenter)).toBeLessThanOrEqual(1);
  });
});
