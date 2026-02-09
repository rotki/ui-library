import { expect, test } from '@playwright/test';

test.describe('timepickers', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/timepickers');
  });

  test('should render timepicker with initial values', async ({ page }) => {
    await expect(page.locator('h2[data-cy=timepickers]')).toContainText('Time Pickers');

    await expect(page.locator('[class*=_rui-digit_]', { hasText: '08' }).first()).toBeVisible();
    await expect(page.locator('[class*=_rui-digit_]', { hasText: '20' }).first()).toBeVisible();
    await expect(page.getByText('PM').first()).toBeVisible();
  });

  test('should be able to select time', async ({ page }) => {
    const picker = page.locator('[data-cy=timepicker-0]');
    await picker.locator('.rui-hour-06').click();
    await picker.locator('.rui-minute-30').click();

    await expect(picker.locator('[class*=_rui-digit_]', { hasText: '06' })).toBeVisible();
    await expect(picker.locator('[class*=_rui-digit_]', { hasText: '30' })).toBeVisible();
    await expect(picker.getByText('PM')).toBeVisible();
  });

  test('should toggle AM/PM', async ({ page }) => {
    const picker = page.locator('[data-cy=timepicker-0]');
    const amPmToggle = picker.locator('.rui-time-picker-period');

    await expect(amPmToggle).toHaveText('PM');
    await amPmToggle.click();
    await expect(amPmToggle).toHaveText('AM');
    await amPmToggle.click();
    await expect(amPmToggle).toHaveText('PM');
  });

  test('should show seconds when accuracy includes seconds', async ({ page }) => {
    const picker = page.locator('[data-cy=timepicker-1]');

    // Second picker has accuracy='second', should show seconds digit
    const digits = picker.locator('[role=button][aria-label="Select seconds"]');
    await expect(digits).toBeVisible();
    await expect(digits).toContainText('45');
  });

  test('should have aria-label on time picker root', async ({ page }) => {
    // data-cy is on the same root div as role="group"
    const picker = page.locator('[data-cy=timepicker-0]');

    await expect(picker).toHaveAttribute('role', 'group');
    await expect(picker).toHaveAttribute('aria-label', 'Time picker');
  });

  test('should have role="listbox" on clock face with aria-label', async ({ page }) => {
    const picker = page.locator('[data-cy=timepicker-0]');
    const clockFace = picker.locator('[role=listbox]');

    await expect(clockFace).toBeVisible();
    await expect(clockFace).toHaveAttribute('aria-label', 'Select hour');
  });

  test('should have role="option" with aria-selected on clock numbers', async ({ page }) => {
    const picker = page.locator('[data-cy=timepicker-0]');
    const options = picker.locator('[role=option]');

    await expect(options.first()).toBeVisible();

    // Hour 8 (20:20 -> 8 PM) should be selected
    const selectedOption = picker.locator('[role=option][aria-selected=true]');
    await expect(selectedOption).toHaveCount(1);
    await expect(selectedOption).toHaveText('8');
  });

  test('should update clock face aria-label when switching modes', async ({ page }) => {
    const picker = page.locator('[data-cy=timepicker-0]');
    const clockFace = picker.locator('[role=listbox]');

    // Initially in hour mode
    await expect(clockFace).toHaveAttribute('aria-label', 'Select hour');

    // Click hour to select and switch to minute mode
    await picker.locator('.rui-hour-06').click();
    await expect(clockFace).toHaveAttribute('aria-label', 'Select minute');

    // Click minute digit selector to go back to minute mode (already there)
    // Click hour digit selector to go back to hour mode
    await picker.locator('[role=button][aria-label="Select hours"]').click();
    await expect(clockFace).toHaveAttribute('aria-label', 'Select hour');
  });

  test('should switch mode by clicking digit selectors', async ({ page }) => {
    const picker = page.locator('[data-cy=timepicker-1]');
    const clockFace = picker.locator('[role=listbox]');

    // Click minutes digit selector
    await picker.locator('[role=button][aria-label="Select minutes"]').click();
    await expect(clockFace).toHaveAttribute('aria-label', 'Select minute');

    // Click seconds digit selector
    await picker.locator('[role=button][aria-label="Select seconds"]').click();
    await expect(clockFace).toHaveAttribute('aria-label', 'Select second');

    // Click hours digit selector
    await picker.locator('[role=button][aria-label="Select hours"]').click();
    await expect(clockFace).toHaveAttribute('aria-label', 'Select hour');
  });
});
