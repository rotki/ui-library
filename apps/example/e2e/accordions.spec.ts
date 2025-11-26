import { expect, test } from '@playwright/test';

test.describe('accordions', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/accordions');
  });

  test('should render accordions and handle expansion', async ({ page }) => {
    await expect(page.locator('h2[data-cy=accordions]')).toContainText('Accordions');

    const wrapper = page.locator('[data-cy=wrapper-0]');
    const accordions = wrapper.locator('[data-cy=accordions]');

    await expect(accordions.locator('> *')).toHaveCount(2);

    await accordions.locator('div:first-child .accordion__header').click();
    await expect(accordions).toContainText('Accordion 1 Content');

    await accordions.locator('div:nth-child(2) .accordion__header').click();
    await expect(accordions).not.toContainText('Accordion 1 Content');
    await expect(accordions).toContainText('Accordion 2 Content');
  });

  test('should allow multiple accordions to be open when multiple prop is set', async ({ page }) => {
    const wrapper = page.locator('[data-cy=wrapper-1]');
    const accordions = wrapper.locator('[data-cy=accordions]');

    await expect(accordions.locator('> *')).toHaveCount(2);

    await accordions.locator('div:first-child .accordion__header').click();
    await expect(accordions).toContainText('Accordion 1 Content');
    await expect(accordions).not.toContainText('Accordion 2 Content');

    await accordions.locator('div:nth-child(2) .accordion__header').click();
    await expect(accordions).toContainText('Accordion 1 Content');
    await expect(accordions).toContainText('Accordion 2 Content');

    await accordions.locator('div:first-child .accordion__header').click();
    await expect(accordions).not.toContainText('Accordion 1 Content');
    await expect(accordions).toContainText('Accordion 2 Content');
  });
});
