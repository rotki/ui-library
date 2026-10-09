import { expect, type Locator, type Page, test } from '@playwright/test';
import { setupVisualPage } from './_setup';

/**
 * Keyboard focus in both themes. The page baseline never focuses anything, so
 * the shared `focus-ring` would otherwise go unchecked. Each target is reached
 * with Tab, since `:focus-visible` follows how focus arrived.
 */
interface FocusCase {
  name: string;
  route: string;
  target: (page: Page) => Locator;
  // what to frame, when the focused element is a hidden input drawn by something else
  frame?: (target: Locator) => Locator;
}

function content(page: Page): Locator {
  return page.getByTestId('page-content');
}

function parentLabel(target: Locator): Locator {
  return target.locator('xpath=ancestor::label[1]');
}

const cases: FocusCase[] = [
  {
    name: 'button',
    route: '/',
    target: page => content(page).locator('button[data-variant=default][data-color=primary]').first(),
  },
  {
    name: 'button-outlined',
    route: '/',
    target: page => content(page).locator('button[data-variant=outlined][data-color=primary]').first(),
  },
  {
    // the first clickable chip: the fifth attribute row, grey
    name: 'chip',
    route: '/chips',
    target: page => page.getByTestId('chip-28'),
  },
  {
    name: 'accordion',
    route: '/accordions',
    target: page => page.locator('[data-id=wrapper-0] [role=button]').first(),
  },
  {
    name: 'checkbox',
    route: '/checkboxes',
    target: page => content(page).locator('input[type=checkbox]').first(),
    frame: parentLabel,
  },
  {
    // Shift+Tab returns to a group's checked radio, so start from one
    name: 'radio',
    route: '/radios',
    target: page => content(page).locator('input[type=radio]:checked').first(),
    frame: parentLabel,
  },
  {
    // the switch's input is its track
    name: 'switch',
    route: '/switches',
    target: page => content(page).locator('input[type=checkbox]').first(),
  },
  {
    name: 'slider',
    route: '/sliders',
    target: page => content(page).locator('input[type=range]').first(),
  },
];

const schemes = ['light', 'dark'] as const;

// room for the 2px ring and its 2px gap
const margin = 8;

test.describe('visual/focus', () => {
  for (const scheme of schemes) {
    for (const { name, route, target, frame } of cases) {
      test(`${name} (${scheme})`, async ({ page }) => {
        await page.emulateMedia({ colorScheme: scheme, reducedMotion: 'reduce' });
        await setupVisualPage(page, route);

        const element = target(page);
        await element.scrollIntoViewIfNeeded();
        // focus the element, step off it and back with the keyboard, so it matches :focus-visible
        await element.focus();
        await page.keyboard.press('Tab');
        await page.keyboard.press('Shift+Tab');
        await expect(element).toBeFocused();

        const box = await (frame ? frame(element) : element).boundingBox();
        expect(box).not.toBeNull();
        if (!box)
          return;

        await expect(page).toHaveScreenshot(`${name}-${scheme}.png`, {
          animations: 'disabled',
          clip: {
            x: Math.max(0, box.x - margin),
            y: Math.max(0, box.y - margin),
            width: box.width + margin * 2,
            height: box.height + margin * 2,
          },
        });
      });
    }
  }
});
