import type { Page } from '@playwright/test';

/**
 * Shared setup for visual regression specs. Drops the per-spec boilerplate
 * to a single call:
 *   - navigates to the fixture route
 *   - disables transitions / animations so frame-timing differences don't
 *     produce one-pixel diffs
 *   - hides the text caret so focused inputs render deterministically
 *   - waits for `document.fonts.ready` so glyph metrics are stable before
 *     any screenshot fires
 */
export async function setupVisualPage(page: Page, route: string): Promise<void> {
  await page.goto(route);
  await page.addStyleTag({
    content: `
      *, *::before, *::after {
        transition: none !important;
        animation: none !important;
        caret-color: transparent !important;
      }
    `,
  });
  await page.evaluate(() => document.fonts.ready);
}
