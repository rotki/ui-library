import { afterEach } from 'vitest';

// Since Storybook 10.3, @storybook/addon-vitest applies preview annotations
// automatically; calling setProjectAnnotations here registers duplicate hooks
// that were preventing the browser backend from shutting down cleanly on CI.

// Clean up teleported elements (tooltips, menus, dialogs) that persist in document.body
afterEach(() => {
  document.body
    .querySelectorAll('[data-popper-reference], [role="tooltip"], [role="menu"], [role="dialog"]')
    .forEach(el => el.remove());
});
