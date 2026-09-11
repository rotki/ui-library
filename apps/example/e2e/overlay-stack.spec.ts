import { expect, test } from '@playwright/test';

test.describe('overlay stack', () => {
  test.beforeEach(async ({ page }) => {
    // Arrive from somewhere, so there is an entry underneath to be wrongly popped
    await page.goto('/cards');
    await page.getByTestId('link-overlay-stack').click();
    await expect(page).toHaveURL(/\/overlay-stack$/);
  });

  test('should take the dialogs down one at a time before leaving the page', async ({ page }) => {
    await page.getByTestId('open-outer').click();
    await expect(page.getByTestId('open-inner')).toBeVisible();

    await page.getByTestId('open-inner').click();
    await expect(page.getByText('Back takes this one first')).toBeVisible();

    await page.goBack();
    await expect(page.getByText('Back takes this one first')).toHaveCount(0);
    await expect(page.getByTestId('open-inner')).toBeVisible();
    await expect(page).toHaveURL(/\/overlay-stack$/);

    await page.goBack();
    await expect(page.getByTestId('open-inner')).toHaveCount(0);
    await expect(page).toHaveURL(/\/overlay-stack$/);

    // Nothing left covering the page, so the gesture is finally let through
    await page.goBack();
    await expect(page).toHaveURL(/\/cards$/);
  });

  test('should report whether anything is covering the page', async ({ page }) => {
    await expect(page.getByTestId('has-overlay')).toContainText('false');

    await page.getByTestId('open-outer').click();
    await expect(page.getByTestId('has-overlay')).toContainText('true');

    await page.goBack();
    await expect(page.getByTestId('has-overlay')).toContainText('false');
  });

  test('should swallow the gesture for a persistent dialog rather than pass it through', async ({ page }) => {
    await page.getByTestId('open-guarded').click();
    await expect(page.getByTestId('close-guarded')).toBeVisible();

    await page.goBack();
    await expect(page.getByTestId('close-guarded')).toBeVisible();
    await expect(page.getByTestId('refusals')).toContainText('1');
    await expect(page).toHaveURL(/\/overlay-stack$/);

    await page.goBack();
    await expect(page.getByTestId('refusals')).toContainText('2');
    await expect(page).toHaveURL(/\/overlay-stack$/);

    await page.getByTestId('close-guarded').click();
    await expect(page.getByTestId('close-guarded')).toHaveCount(0);

    await page.goBack();
    await expect(page).toHaveURL(/\/cards$/);
  });

  test('should let a forward navigation through while a dialog is open', async ({ page }) => {
    await page.getByTestId('open-outer').click();

    // From inside the dialog, since a modal covers the links behind it
    await page.getByTestId('link-from-dialog').click();
    await expect(page).toHaveURL(/\/tables$/);
  });
});
