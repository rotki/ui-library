import { expect, test } from '@playwright/test';
import { setupVisualPage } from './_setup';

const variants = ['default', 'filled', 'outlined'] as const;
const densities = ['normal', 'dense'] as const;
const prepends = ['noprepend', 'prepend'] as const;

test.describe('visual/RuiTextField', () => {
  test.beforeEach(async ({ page }) => {
    await setupVisualPage(page, '/visual/text-field');
  });

  for (const variant of variants) {
    for (const density of densities) {
      for (const prepend of prepends) {
        const cellId = `${variant}-${density}-${prepend}`;

        test.describe(`${variant} / ${density} / ${prepend}`, () => {
          test('resting', async ({ page }) => {
            const cell = page.getByTestId(`cell-${cellId}`);
            await expect(cell).toBeVisible();
            await expect(cell).toHaveScreenshot(`${cellId}-resting.png`);
          });

          test('focused-empty', async ({ page }) => {
            const cell = page.getByTestId(`cell-${cellId}`);
            await cell.locator('input').focus();
            await expect(cell).toHaveScreenshot(`${cellId}-focused-empty.png`);
          });

          test('with-value', async ({ page }) => {
            const cell = page.getByTestId(`cell-${cellId}`);
            await cell.locator('input').fill('Sample');
            await cell.locator('input').blur();
            await expect(cell).toHaveScreenshot(`${cellId}-with-value.png`);
          });
        });
      }
    }
  }
});
