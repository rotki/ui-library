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

    await accordions.locator('div:first-child [data-accordion-trigger]').click();
    await expect(accordions).toContainText('Accordion 1 Content');

    await accordions.locator('div:nth-child(2) [data-accordion-trigger]').click();
    await expect(accordions).not.toContainText('Accordion 1 Content');
    await expect(accordions).toContainText('Accordion 2 Content');
  });

  test('should allow multiple accordions to be open when multiple prop is set', async ({ page }) => {
    const wrapper = page.locator('[data-cy=wrapper-1]');
    const accordions = wrapper.locator('[data-cy=accordions]');

    await expect(accordions.locator('> *')).toHaveCount(2);

    await accordions.locator('div:first-child [data-accordion-trigger]').click();
    await expect(accordions).toContainText('Accordion 1 Content');
    await expect(accordions).not.toContainText('Accordion 2 Content');

    await accordions.locator('div:nth-child(2) [data-accordion-trigger]').click();
    await expect(accordions).toContainText('Accordion 1 Content');
    await expect(accordions).toContainText('Accordion 2 Content');

    await accordions.locator('div:first-child [data-accordion-trigger]').click();
    await expect(accordions).not.toContainText('Accordion 1 Content');
    await expect(accordions).toContainText('Accordion 2 Content');
  });

  test('should toggle aria-expanded on click', async ({ page }) => {
    const wrapper = page.locator('[data-cy=wrapper-0]');
    const accordions = wrapper.locator('[data-cy=accordions]');
    const trigger = accordions.locator('div:first-child [data-accordion-trigger]');

    await expect(trigger).toHaveAttribute('aria-expanded', 'false');

    await trigger.click();
    await expect(trigger).toHaveAttribute('aria-expanded', 'true');

    // Click second to close first (single mode)
    await accordions.locator('div:nth-child(2) [data-accordion-trigger]').click();
    await expect(trigger).toHaveAttribute('aria-expanded', 'false');
  });

  test('should collapse accordion when clicking expanded header', async ({ page }) => {
    const wrapper = page.locator('[data-cy=wrapper-0]');
    const accordions = wrapper.locator('[data-cy=accordions]');
    const trigger = accordions.locator('div:first-child [data-accordion-trigger]');

    await trigger.click();
    await expect(trigger).toHaveAttribute('aria-expanded', 'true');
    await expect(accordions).toContainText('Accordion 1 Content');

    // Click same header again to collapse
    await trigger.click();
    await expect(trigger).toHaveAttribute('aria-expanded', 'false');
    await expect(accordions).not.toContainText('Accordion 1 Content');
  });

  test('should have data-state attribute on accordion', async ({ page }) => {
    const wrapper = page.locator('[data-cy=wrapper-0]');
    const accordions = wrapper.locator('[data-cy=accordions]');
    const accordion = accordions.locator('> [data-accordion]').first();

    await expect(accordion).toHaveAttribute('data-state', 'closed');

    await accordion.locator('[data-accordion-trigger]').click();
    await expect(accordion).toHaveAttribute('data-state', 'open');
  });

  test('should have role="button" and aria-controls on trigger', async ({ page }) => {
    const wrapper = page.locator('[data-cy=wrapper-0]');
    const trigger = wrapper.locator('[data-cy=accordions] div:first-child [data-accordion-trigger]');

    await expect(trigger).toHaveAttribute('role', 'button');
    await expect(trigger).toHaveAttribute('tabindex', '0');
    await expect(trigger).toHaveAttribute('aria-controls');
  });

  test('should have role="region" on content with aria-labelledby', async ({ page }) => {
    const wrapper = page.locator('[data-cy=wrapper-0]');
    const accordions = wrapper.locator('[data-cy=accordions]');
    const trigger = accordions.locator('div:first-child [data-accordion-trigger]');

    // Open accordion to reveal content
    await trigger.click();

    const content = accordions.locator('div:first-child [data-accordion-content]');
    await expect(content).toHaveAttribute('role', 'region');
    await expect(content).toHaveAttribute('aria-labelledby');

    // Verify aria-controls matches content id
    const triggerId = await trigger.getAttribute('id');
    const contentId = await content.getAttribute('id');
    await expect(trigger).toHaveAttribute('aria-controls', contentId!);
    await expect(content).toHaveAttribute('aria-labelledby', triggerId!);
  });
});
