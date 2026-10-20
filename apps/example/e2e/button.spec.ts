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

  test('a split button joins buttons wrapped in a tooltip and a menu activator', async ({ page }) => {
    for (const variant of ['default', 'outlined']) {
      const group = page.getByTestId(`split-button-${variant}`);
      const action = group.getByTestId('split-button-action');
      const more = group.getByTestId('split-button-menu');

      // outer corners round, the joined ones stay square, wherever the button sits in the tree
      await expect(action).not.toHaveCSS('border-top-left-radius', '0px');
      await expect(action).toHaveCSS('border-top-right-radius', '0px');
      await expect(more).toHaveCSS('border-top-left-radius', '0px');
      await expect(more).not.toHaveCSS('border-top-right-radius', '0px');
      await expect(more).toHaveAttribute('data-color', 'primary');
    }

    await page.getByTestId('split-button-default').getByTestId('split-button-menu').click();
    // the menu's own buttons are not part of the group
    await expect(page.getByTestId('split-button-option')).toBeVisible();
    await expect(page.getByTestId('split-button-option')).not.toHaveAttribute('data-color');
    await page.keyboard.press('Escape');
  });

  test('list-variant button label shares the icon line-box (issue #515)', async ({ page }) => {
    const button = page.getByTestId('list-button-md-settings');
    const label = button.locator('[data-id="btn-label"]');
    const icon = button.locator('svg').first();

    await expect(button).toBeVisible();

    // 16px matches the md icon box; the inherited 20px drifted the label above the icon
    await expect(label).toHaveCSS('line-height', '16px');

    const labelBox = await label.boundingBox();
    const iconBox = await icon.boundingBox();
    expect(labelBox).not.toBeNull();
    expect(iconBox).not.toBeNull();

    // Centers should line up within ~1px now that the line-boxes match.
    const labelCenter = labelBox!.y + labelBox!.height / 2;
    const iconCenter = iconBox!.y + iconBox!.height / 2;
    expect(Math.abs(labelCenter - iconCenter)).toBeLessThanOrEqual(1);
  });

  test('a link button takes the size of the text around it and keeps the line height', async ({ page }) => {
    for (const textSize of ['text-caption', 'text-sm', 'text-body-1', 'text-h6']) {
      const paragraph = page.getByTestId(`link-text-${textSize}`);
      const link = page.getByTestId(`link-button-${textSize}`);
      const fontSize = await paragraph.evaluate(el => getComputedStyle(el).fontSize);

      await expect(link).toHaveCSS('font-size', fontSize);
      await expect(link).toHaveCSS('padding', '0px');
      await expect(link).toHaveCSS('display', 'inline-flex');
      await expect(link.locator('svg')).toHaveCSS('width', fontSize);

      // the link sits in the line, so the paragraph stays one line tall
      const lineHeight = await paragraph.evaluate(el => Number.parseFloat(getComputedStyle(el).lineHeight));
      const box = await paragraph.boundingBox();
      expect(box!.height).toBeLessThanOrEqual(lineHeight + 1);
    }

    const link = page.getByTestId('link-button-text-sm');
    await expect(link).toHaveCSS('text-decoration-line', 'none');
    await link.hover();
    await expect(link).toHaveCSS('text-decoration-line', 'underline');
  });
});
