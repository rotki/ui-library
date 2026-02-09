import { expect, test } from '@playwright/test';

test.describe('steppers', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/steppers');
  });

  test('should render stepper with correct states', async ({ page }) => {
    await expect(page.locator('h2[data-cy=steppers]')).toContainText('Steppers');

    const horizontalStepper = page.locator('[data-cy=stepper-0]');

    await expect(horizontalStepper.locator('div[class*=_step][class*=_inactive]')).toContainText('Inactive');
    await expect(horizontalStepper.locator('div[class*=_step][class*=_success]')).toContainText('Success');
  });

  test('should have role="list" and aria-label on stepper', async ({ page }) => {
    const stepper = page.locator('[data-cy=stepper-0]');
    await expect(stepper).toHaveAttribute('role', 'list');
    await expect(stepper).toHaveAttribute('aria-label', 'Progress steps');
  });

  test('should have role="listitem" on each step', async ({ page }) => {
    const stepper = page.locator('[data-cy=stepper-0]');
    const items = stepper.locator('[role=listitem]');

    // First stepper has 7 steps
    await expect(items).toHaveCount(7);
  });

  test('should have aria-current="step" on active step', async ({ page }) => {
    const stepper = page.locator('[data-cy=stepper-0]');
    const activeStep = stepper.locator('[aria-current=step]');

    await expect(activeStep).toHaveCount(1);
    await expect(activeStep).toContainText('Active');
  });

  test('should render vertical stepper', async ({ page }) => {
    // Stepper at index 1 is vertical
    const stepper = page.locator('[data-cy=stepper-1]');
    await expect(stepper).toBeVisible();

    const items = stepper.locator('[role=listitem]');
    await expect(items).toHaveCount(7);
  });

  test('should render icon-top stepper', async ({ page }) => {
    // Stepper at index 2 has iconTop=true
    const stepper = page.locator('[data-cy=stepper-2]');
    await expect(stepper).toBeVisible();

    const items = stepper.locator('[role=listitem]');
    await expect(items).toHaveCount(7);
  });

  test('should render custom stepper variant', async ({ page }) => {
    // Stepper at index 4 has custom=true
    const stepper = page.locator('[data-cy=stepper-4]');
    await expect(stepper).toBeVisible();

    const items = stepper.locator('[role=listitem]');
    await expect(items).toHaveCount(3);
    await expect(stepper).toHaveAttribute('role', 'list');
  });
});
