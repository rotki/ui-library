import { expect, test } from '@playwright/test';
import { setupVisualPage } from './_setup';

/**
 * Whole-page baseline over every example route, in both themes. It is the net
 * for theme and styling changes that touch many components at once (the
 * Tailwind 4 move, token changes): any pixel that moves shows up here, and the
 * per-component specs then narrow it down.
 */
const routes = [
  '/',
  '/accordions',
  '/alerts',
  '/auto-completes/basic',
  '/auto-completes/grouping',
  '/auto-completes/selection',
  '/avatars',
  '/badges',
  '/bottom-sheets',
  '/calendars',
  '/cards',
  '/category-pickers',
  '/checkboxes',
  '/chips',
  '/color-pickers',
  '/data-tables/basic',
  '/data-tables/expandable',
  '/data-tables/grouping',
  '/data-tables/selection',
  '/datetimepickers',
  '/dialogs',
  '/dividers',
  '/file-uploads',
  '/loaders',
  '/logos',
  '/menu-selects/basic',
  '/menus',
  '/navigation-drawers',
  '/progress',
  '/radios',
  '/simple-selects',
  '/sliders',
  '/steppers',
  '/switches',
  '/tables',
  '/tabs',
  '/text-areas',
  '/text-fields',
  '/timepickers',
  '/timezone-selects',
  '/tooltips',
] as const;

const schemes = ['light', 'dark'] as const;

test.use({ timezoneId: 'UTC', locale: 'en-US' });

test.describe('visual/pages', () => {
  for (const scheme of schemes) {
    for (const route of routes) {
      const name = route === '/' ? 'buttons' : route.slice(1).replaceAll('/', '-');

      test(`${name} (${scheme})`, async ({ page }) => {
        await page.clock.setFixedTime(new Date('2026-01-15T10:00:00Z'));
        await page.emulateMedia({ colorScheme: scheme, reducedMotion: 'reduce' });
        await setupVisualPage(page, route);
        /*
         * The app scrolls inside a full-height body and pins its header, so an element screenshot
         * would stop at the viewport and show the header over the content. Letting the document
         * scroll and the header sit in the flow captures the whole page.
         */
        await page.addStyleTag({
          content: `
            html, body { height: auto !important; overflow: visible !important; }
            header { position: static !important; }
          `,
        });

        const content = page.getByTestId('page-content');
        await expect(content).toBeVisible();
        await expect(content).toHaveScreenshot(`${name}-${scheme}.png`, { animations: 'disabled' });
      });
    }
  }
});
