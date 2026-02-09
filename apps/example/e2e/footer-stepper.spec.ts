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

  test('should navigate forward and backward with buttons', async ({ page }) => {
    const stepper = page.locator('[data-cy=footer-stepper-0]');
    await expect(stepper.locator('span[class*=_numeric_]')).toContainText('1/5');

    // Back should be disabled on first page
    const backBtn = stepper.locator('button[aria-label=Previous]');
    const nextBtn = stepper.locator('button[aria-label=Next]');
    await expect(backBtn).toBeDisabled();

    // Navigate forward
    await nextBtn.click();
    await expect(stepper.locator('span[class*=_numeric_]')).toContainText('2/5');
    await expect(backBtn).toBeEnabled();

    // Navigate back
    await backBtn.click();
    await expect(stepper.locator('span[class*=_numeric_]')).toContainText('1/5');
    await expect(backBtn).toBeDisabled();
  });

  test('should have role="navigation" and aria-label on root', async ({ page }) => {
    const stepper = page.locator('[data-cy=footer-stepper-0]');
    await expect(stepper).toHaveAttribute('role', 'navigation');
    await expect(stepper).toHaveAttribute('aria-label', 'Step navigation');
  });

  test('should have aria-label on navigation buttons', async ({ page }) => {
    const stepper = page.locator('[data-cy=footer-stepper-0]');
    await expect(stepper.locator('button[aria-label=Previous]')).toBeVisible();
    await expect(stepper.locator('button[aria-label=Next]')).toBeVisible();
  });

  test('should have aria-current="step" on active bullet', async ({ page }) => {
    // Footer stepper at index 1 is bullet variant with value=2
    const stepper = page.locator('[data-cy=footer-stepper-1]');
    const activeBullet = stepper.locator('[aria-current=step]');
    await expect(activeBullet).toHaveCount(1);

    // Click Next to advance
    await stepper.locator('button[aria-label=Next]').click();
    const newActive = stepper.locator('[aria-current=step]');
    await expect(newActive).toHaveCount(1);
  });

  test('should hide buttons when hideButtons is true', async ({ page }) => {
    // Footer stepper at index 2 has hideButtons=true
    const stepper = page.locator('[data-cy=footer-stepper-2]');
    await expect(stepper.locator('button')).toHaveCount(0);
  });
});
