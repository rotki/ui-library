import { expect, type Page, test } from '@playwright/test';

interface DrawerFrame {
  at: number;
  left: number | null;
}

/**
 * Runs the action and returns the drawer's left edge on every frame for the next 600ms, timed from the
 * action, so a test can tell a slide from a jump. A removed drawer reads as null.
 */
async function trackDrawer(page: Page, action: () => Promise<void>): Promise<DrawerFrame[]> {
  await page.evaluate(() => {
    const frames: { at: number; left: number | null }[] = [];
    Reflect.set(window, '__drawerFrames', frames);
    Reflect.set(window, '__drawerStart', undefined);

    function sample(): void {
      const start = Reflect.get(window, '__drawerStart');
      const aside = document.querySelector('aside[data-id=drawer-content]');
      if (typeof start === 'number')
        frames.push({ at: performance.now() - start, left: aside ? Math.round(aside.getBoundingClientRect().left) : null });
      if (typeof start !== 'number' || performance.now() - start < 600)
        requestAnimationFrame(sample);
    }
    requestAnimationFrame(sample);
  });
  await page.evaluate(() => Reflect.set(window, '__drawerStart', performance.now()));
  await action();
  await page.waitForTimeout(700);
  return page.evaluate(() => Reflect.get(window, '__drawerFrames'));
}

test.describe('navigation drawer', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/navigation-drawers');
    // Ensure no drawers are open at the start of each test
    await expect(page.locator('aside[data-visible]')).toHaveCount(0);
  });

  test.afterEach(async ({ page }) => {
    // Clean up any open drawers
    await page.keyboard.press('Escape');
  });

  test('check non-persistent navigation-drawer', async ({ page }) => {
    await expect(page.locator('h2[data-id=navigation-drawers]')).toContainText('Navigation Drawers');

    const defaultDrawer = page.locator('div[data-id=navigation-drawer-0]');

    // open drawer
    const activator = defaultDrawer.locator('[data-id=activator]');
    await activator.click();
    // Wait for the aside element with visible attribute to appear (drawer is open)
    await expect(page.locator('aside[data-visible]')).toBeVisible();

    // The heading sits outside the drawer, so clicking it is a click outside, which closes a temporary drawer
    await page.locator('h2[data-id=navigation-drawers]').click();
    // After closing, there should be no visible drawer
    await expect(page.locator('aside[data-visible]')).toHaveCount(0);
  });

  test('check persistent drawer', async ({ page }) => {
    const defaultDrawer = page.locator('div[data-id=navigation-drawer-2]');

    // open drawer
    const activator = defaultDrawer.locator('[data-id=activator]');
    await activator.click();
    // Wait for the aside element with visible attribute to appear
    await expect(page.locator('aside[data-visible]')).toBeVisible();

    // should not close the drawer when clicking elsewhere (temporary: false)
    await page.locator('h2[data-id=navigation-drawers]').click();
    // The drawer should still be visible
    await expect(page.locator('aside[data-visible]')).toBeVisible();
  });

  test('should render drawer on left by default', async ({ page }) => {
    const defaultDrawer = page.locator('div[data-id=navigation-drawer-0]');
    await defaultDrawer.locator('[data-id=activator]').click();

    const aside = page.locator('aside[data-visible]');
    await expect(aside).toBeVisible();
    await expect(aside).toHaveAttribute('data-position', 'left');
  });

  test('should render drawer on right with position="right"', async ({ page }) => {
    const rightDrawer = page.locator('div[data-id=navigation-drawer-1]');
    await rightDrawer.locator('[data-id=activator]').click();

    const aside = page.locator('aside[data-visible]');
    await expect(aside).toBeVisible();
    await expect(aside).toHaveAttribute('data-position', 'right');
  });

  test('should show overlay when overlay prop is true', async ({ page }) => {
    const overlayDrawer = page.locator('div[data-id=navigation-drawer-3]');
    await overlayDrawer.locator('[data-id=activator]').click();

    const aside = page.locator('aside[data-visible]');
    await expect(aside).toBeVisible();

    // Overlay element should be present
    const overlay = page.locator('[data-id=overlay]');
    await expect(overlay).toBeVisible();

    // Clicking overlay should close the drawer
    await overlay.click();
    await expect(page.locator('aside[data-visible]')).toHaveCount(0);
  });

  test('keeps the app bar uncovered and usable with belowAppBar', async ({ page }) => {
    await page.locator('div[data-id=navigation-drawer-3] [data-id=activator]').click();
    const aside = page.locator('aside[data-visible]');
    await expect(aside).toBeVisible();

    const header = await page.locator('header').first().boundingBox();
    const drawer = await aside.boundingBox();
    const overlay = await page.locator('[data-id=overlay]').boundingBox();
    const headerBottom = Math.round((header?.y ?? 0) + (header?.height ?? 0));
    expect(Math.round(drawer?.y ?? -1)).toBe(headerBottom);
    expect(Math.round(overlay?.y ?? -1)).toBe(headerBottom);

    // the app bar is the topmost element over its own area, not the overlay
    const onTop = await page.evaluate(() => {
      const bar = document.querySelector('header')?.getBoundingClientRect();
      if (!bar)
        return false;
      return !!document.elementFromPoint(bar.left + bar.width / 2, bar.top + bar.height / 2)?.closest('header');
    });
    expect(onTop).toBe(true);
  });

  test('covers the app bar with a full-height overlay drawer by default', async ({ page }) => {
    await page.locator('div[data-id=navigation-drawer-4] [data-id=activator]').click();
    const aside = page.locator('aside[data-visible]');
    await expect(aside).toBeVisible();

    expect(Math.round((await aside.boundingBox())?.y ?? -1)).toBe(0);
    expect(Math.round((await page.locator('[data-id=overlay]').boundingBox())?.y ?? -1)).toBe(0);
  });

  test('slides a temporary drawer in when it opens and out when it closes', async ({ page }) => {
    const activator = page.locator('div[data-id=navigation-drawer-1] [data-id=activator]');
    const viewport = page.viewportSize()?.width ?? 0;
    const between = (frame: DrawerFrame, open: number): boolean => frame.left !== null && frame.left > open && frame.left < viewport;

    const opening = await trackDrawer(page, async () => activator.click());
    const open = opening.at(-1)?.left ?? viewport;
    expect(open).toBeLessThan(viewport);
    expect(opening.some(frame => between(frame, open))).toBe(true);

    const closing = await trackDrawer(page, async () => page.locator('h2[data-id=navigation-drawers]').click());
    expect(closing.some(frame => between(frame, open))).toBe(true);
    // removed as soon as the slide is over, not held for a transition end that never comes
    const removedAt = closing.find(frame => frame.left === null)?.at;
    expect(removedAt).toBeDefined();
    expect(removedAt).toBeLessThan(400);
  });

  test('should have aria-label on drawer', async ({ page }) => {
    const defaultDrawer = page.locator('div[data-id=navigation-drawer-0]');
    await defaultDrawer.locator('[data-id=activator]').click();

    const aside = page.locator('aside[data-visible]');
    await expect(aside).toBeVisible();
    await expect(aside).toHaveAttribute('aria-label', 'Left navigation');
  });
});
