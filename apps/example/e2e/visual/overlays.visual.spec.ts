import { expect, type Page, test } from '@playwright/test';
import { setupVisualPage } from './_setup';

/**
 * Open popups in both themes. The page baseline only sees overlays closed, and
 * the menu surfaces (background, elevation, item hover and selection colors)
 * are where a theme change shows first.
 */
interface OverlayCase {
  name: string;
  route: string;
  open: (page: Page) => Promise<void>;
  // what to capture once open; a menu by default
  target?: string;
}

const cases: OverlayCase[] = [
  {
    name: 'menu',
    route: '/menus',
    open: async page => page.locator('[data-id=menu-0] [data-id=activator]').click(),
  },
  {
    name: 'menu-select',
    route: '/menu-selects/basic',
    open: async page => page.locator('[data-id=ms-basic-default] [data-id=activator]').click(),
    target: '[role=listbox]',
  },
  {
    name: 'auto-complete',
    route: '/auto-completes/basic',
    open: async page => page.locator('[data-id=ac-basic-default] [data-id=activator]').click(),
    target: '[role=listbox]',
  },
  {
    name: 'date-time-picker',
    route: '/datetimepickers',
    open: async (page) => {
      await page.getByTestId('picker-all-actions').locator('input').click();
      // the menu may slide over the field, so the pointer would rest on one of its buttons
      await page.mouse.move(1, 1);
    },
  },
  {
    // the whole viewport: the dialog's shadow and corners over the blurred backdrop
    name: 'dialog',
    route: '/dialogs',
    open: async page => page.locator('[data-id=dialog-0] [data-id=activator]').click(),
    target: '[role=dialog]',
  },
  {
    name: 'tooltip',
    route: '/tooltips',
    open: async page => page.locator('div[data-id=tooltip-4]').hover(),
    target: '[role=tooltip]',
  },
  {
    // the whole page: a docked drawer belongs to it, so its edge against the content is the point
    name: 'drawer-docked',
    route: '/navigation-drawers',
    open: async page => page.locator('[data-id=navigation-drawer-2] [data-id=activator]').click(),
    target: 'body',
  },
  {
    name: 'drawer-temporary',
    route: '/navigation-drawers',
    open: async page => page.locator('[data-id=navigation-drawer-0] [data-id=activator]').click(),
    target: 'body',
  },
];

const schemes = ['light', 'dark'] as const;

test.use({ timezoneId: 'UTC', locale: 'en-US' });

test.describe('visual/overlays', () => {
  for (const scheme of schemes) {
    for (const { name, route, open, target = '[role=menu]' } of cases) {
      test(`${name} (${scheme})`, async ({ page }) => {
        await page.clock.setFixedTime(new Date('2026-01-15T10:00:00Z'));
        await page.emulateMedia({ colorScheme: scheme, reducedMotion: 'reduce' });
        await setupVisualPage(page, route);

        await open(page);
        const menu = page.locator(target).last();
        await expect(menu).toBeVisible();
        // the menu positions itself a frame after it opens
        await page.waitForTimeout(300);
        await expect(menu).toHaveScreenshot(`${name}-${scheme}.png`, { animations: 'disabled' });
      });
    }
  }
});
