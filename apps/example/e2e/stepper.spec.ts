import { expect, test } from '@playwright/test';

test.describe('steppers', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/steppers');
  });

  test('should render stepper with correct states', async ({ page }) => {
    await expect(page.locator('h2[data-cy=steppers]')).toContainText('Steppers');

    const horizontalStepper = page.locator('div[class*=_stepper]').first();

    await expect(horizontalStepper.locator('div[class*=_step][class*=_inactive]')).toContainText('Inactive');
    await expect(horizontalStepper.locator('div[class*=_step][class*=_success]')).toContainText('Success');
  });
});
