import { expect, test } from '@playwright/test';

test.describe('footer steppers', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/steppers');
    // Wait for footer steppers section to be visible
    await expect(page.locator('h2[data-cy=footer-steppers]')).toBeVisible();
  });

  test('should render footer stepper variants', async ({ page }) => {
    await expect(page.locator('h2[data-cy=footer-steppers]')).toContainText('Footer Steppers');

    // Footer steppers are rendered after the h2 element, select from page directly
    // The class names are CSS module scoped: _footer-stepper_xxx _numeric_xxx
    const numericStepper = page.locator('div[class*=_footer-stepper_][class*=_numeric_]').first();
    const bulletStepper = page.locator('div[class*=_footer-stepper_][class*=_bullet_]').first();
    const progressStepper = page.locator('div[class*=_footer-stepper_][class*=_progress_]').first();
    const pillStepper = page.locator('div[class*=_footer-stepper_][class*=_pill_]').first();

    // Verify stepper is visible first
    await expect(numericStepper).toBeVisible();

    await expect(numericStepper.locator('button', { hasText: 'Back' })).toBeVisible();
    await expect(numericStepper.locator('button', { hasText: 'Next' })).toBeVisible();
    // The numeric span contains the page counter
    await expect(numericStepper.locator('span[class*=_numeric_]')).toContainText('1/5');

    await expect(bulletStepper.locator('button', { hasText: 'Back' })).toBeVisible();
    await expect(bulletStepper.locator('button', { hasText: 'Next' })).toBeVisible();
    // Use first() since there are multiple bullet elements
    await expect(bulletStepper.locator('div[class*=_bullets_] span[class*=_bullet_]').first()).toBeVisible();

    await expect(progressStepper.locator('button', { hasText: 'Back' })).toBeVisible();
    await expect(progressStepper.locator('button', { hasText: 'Next' })).toBeVisible();
    // Use first() since there might be multiple determinate elements inside progress
    await expect(progressStepper.locator('div[class*=_progress_] div[class*=_determinate_]').first()).toBeVisible();

    await expect(pillStepper.locator('button span', { hasText: 'Back' })).toHaveCount(0);
    await expect(pillStepper.locator('button span', { hasText: 'Next' })).toHaveCount(0);
    // Use first() since there are multiple pill elements
    await expect(pillStepper.locator('div[class*=_pills_] span[class*=_pill_]').first()).toBeVisible();
  });
});
