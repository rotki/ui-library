import { expect, test } from '@playwright/test';

test.describe('footer steppers', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/steppers');
    // Wait for footer steppers section to be visible
    await expect(page.locator('h2[data-id=footer-steppers]')).toBeVisible();
  });

  test('should render footer stepper variants', async ({ page }) => {
    await expect(page.locator('h2[data-id=footer-steppers]')).toContainText('Footer Steppers');

    const numericStepper = page.locator('[data-variant=numeric]').first();
    const bulletStepper = page.locator('[data-variant=bullet]').first();
    const progressStepper = page.locator('[data-variant=progress]').first();
    const pillStepper = page.locator('[data-variant=pill]').first();

    // Verify stepper is visible first
    await expect(numericStepper).toBeVisible();

    await expect(numericStepper.locator('button', { hasText: 'Back' })).toBeVisible();
    await expect(numericStepper.locator('button', { hasText: 'Next' })).toBeVisible();
    await expect(numericStepper.locator('[data-id=numeric]')).toContainText('1/5');

    await expect(bulletStepper.locator('button', { hasText: 'Back' })).toBeVisible();
    await expect(bulletStepper.locator('button', { hasText: 'Next' })).toBeVisible();
    await expect(bulletStepper.locator('[data-id=bullets] button').first()).toBeVisible();

    await expect(progressStepper.locator('button', { hasText: 'Back' })).toBeVisible();
    await expect(progressStepper.locator('button', { hasText: 'Next' })).toBeVisible();
    await expect(progressStepper.locator('div[role=progressbar]').first()).toBeVisible();

    await expect(pillStepper.locator('button span', { hasText: 'Back' })).toHaveCount(0);
    await expect(pillStepper.locator('button span', { hasText: 'Next' })).toHaveCount(0);
    await expect(pillStepper.locator('[data-id=pills] span').first()).toBeVisible();
  });

  test('should navigate forward and backward with buttons', async ({ page }) => {
    const stepper = page.locator('[data-id=footer-stepper-0]');
    await expect(stepper.locator('[data-id=numeric]')).toContainText('1/5');

    // Back should be disabled on first page
    const backBtn = stepper.getByTestId('prev');
    const nextBtn = stepper.getByTestId('next');
    await expect(backBtn).toBeDisabled();

    // Navigate forward
    await nextBtn.click();
    await expect(stepper.locator('[data-id=numeric]')).toContainText('2/5');
    await expect(backBtn).toBeEnabled();

    // Navigate back
    await backBtn.click();
    await expect(stepper.locator('[data-id=numeric]')).toContainText('1/5');
    await expect(backBtn).toBeDisabled();
  });

  test('should have role="navigation" and aria-label on root', async ({ page }) => {
    const stepper = page.locator('[data-id=footer-stepper-0]');
    await expect(stepper).toHaveAttribute('role', 'navigation');
    await expect(stepper).toHaveAttribute('aria-label', 'Step navigation');
  });

  test('should name the navigation buttons', async ({ page }) => {
    const stepper = page.locator('[data-id=footer-stepper-0]');
    await expect(stepper.getByRole('button', { name: 'Back' })).toBeVisible();
    await expect(stepper.getByRole('button', { name: 'Next' })).toBeVisible();
  });

  test('should have aria-current="step" on active bullet', async ({ page }) => {
    const stepper = page.locator('[data-id=footer-stepper-1]'); // the bullet variant, on step 2
    const activeBullet = stepper.locator('[aria-current=step]');
    await expect(activeBullet).toHaveCount(1);

    // Click Next to advance
    await stepper.getByTestId('next').click();
    const newActive = stepper.locator('[aria-current=step]');
    await expect(newActive).toHaveCount(1);
  });

  test('should hide buttons when hideButtons is true', async ({ page }) => {
    const stepper = page.locator('[data-id=footer-stepper-2]');
    // only the step bullets are buttons there
    await expect(stepper.getByTestId('prev')).toHaveCount(0);
    await expect(stepper.getByTestId('next')).toHaveCount(0);
    await expect(stepper.getByRole('button', { name: /^Step \d+$/ }).first()).toBeVisible();
  });
});
