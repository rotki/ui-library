import { expect, test } from '@playwright/test';

test.describe('auto-complete - index', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/auto-completes');
  });

  test('should render navigation links', async ({ page }) => {
    await expect(page.locator('[data-cy=auto-completes-index]')).toBeVisible();
    await expect(page.locator('[data-cy="link-/auto-completes/basic"]')).toBeVisible();
    await expect(page.locator('[data-cy="link-/auto-completes/selection"]')).toBeVisible();
    await expect(page.locator('[data-cy="link-/auto-completes/search"]')).toBeVisible();
    await expect(page.locator('[data-cy="link-/auto-completes/readonly"]')).toBeVisible();
    await expect(page.locator('[data-cy="link-/auto-completes/custom"]')).toBeVisible();
    await expect(page.locator('[data-cy="link-/auto-completes/keyboard"]')).toBeVisible();
    await expect(page.locator('[data-cy="link-/auto-completes/advanced"]')).toBeVisible();
  });

  test('should navigate to sub-routes', async ({ page }) => {
    await page.locator('[data-cy="link-/auto-completes/basic"]').click();
    await expect(page.locator('[data-cy=auto-completes-basic]')).toBeVisible();
  });
});

test.describe('auto-complete - basic', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/auto-completes/basic');
  });

  test.afterEach(async ({ page }) => {
    await page.keyboard.press('Escape');
  });

  test('should render default variant with pre-selected value', async ({ page }) => {
    const ac = page.locator('[data-cy=ac-basic-default]');
    await expect(ac).toBeVisible();
    await expect(ac.locator('input')).toHaveValue('Germany');
  });

  test('should render outlined variant', async ({ page }) => {
    const ac = page.locator('[data-cy=ac-basic-outlined]');
    await expect(ac).toBeVisible();
    await expect(ac.locator('fieldset')).toBeVisible();
    await expect(ac.locator('input')).toHaveValue('Germany');
  });

  test('should render dense variant', async ({ page }) => {
    const ac = page.locator('[data-cy=ac-basic-dense]');
    await expect(ac).toBeVisible();
    await expect(ac.locator('input')).toHaveValue('Germany');
  });

  test('should not open menu when disabled', async ({ page }) => {
    const ac = page.locator('[data-cy=ac-basic-disabled]');
    const activator = ac.locator('[data-id=activator]');
    await expect(activator).toHaveAttribute('aria-disabled', 'true');
    await activator.click({ force: true });
    await expect(page.locator('div[role=menu]')).toHaveCount(0);
  });

  test('should show loading indicator', async ({ page }) => {
    const ac = page.locator('[data-cy=ac-basic-loading]');
    const activator = ac.locator('[data-id=activator]');
    await expect(activator).toHaveAttribute('aria-busy', 'true');
  });

  test('should display error messages', async ({ page }) => {
    const ac = page.locator('[data-cy=ac-basic-error]');
    await expect(ac).toContainText('This field is required');
    await expect(ac.locator('input')).toHaveAttribute('aria-invalid', 'true');
  });

  test('should display success messages', async ({ page }) => {
    const ac = page.locator('[data-cy=ac-basic-success]');
    await expect(ac).toContainText('Looks good!');
  });

  test('should hide details when hideDetails is set', async ({ page }) => {
    const ac = page.locator('[data-cy=ac-basic-hide-details]');
    await expect(ac).toBeVisible();
    await expect(ac).not.toContainText('This field is required');
  });

  test('should show required indicator', async ({ page }) => {
    const ac = page.locator('[data-cy=ac-basic-required]');
    const activator = ac.locator('[data-id=activator]');
    await expect(activator).toHaveAttribute('aria-required', 'true');
    await expect(activator).toContainText('\uFE61');
  });

  test('should display hint text', async ({ page }) => {
    const ac = page.locator('[data-cy=ac-basic-hint]');
    await expect(ac).toBeVisible();
    await expect(ac).toContainText('Select your country');
  });
});

test.describe('auto-complete - selection', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/auto-completes/selection');
  });

  test.afterEach(async ({ page }) => {
    await page.keyboard.press('Escape');
  });

  test('should open menu and select single value', async ({ page }) => {
    const ac = page.locator('[data-cy=ac-select-single]');
    const activator = ac.locator('[data-id=activator]');

    await expect(activator).toHaveAttribute('aria-expanded', 'false');
    await activator.click();
    await expect(activator).toHaveAttribute('aria-expanded', 'true');
    await expect(page.locator('div[role=menu]')).toBeVisible();

    await page.locator('div[role=menu] button').first().click();
    await expect(activator).toHaveAttribute('aria-expanded', 'false');
    await expect(ac.locator('input')).toHaveValue('Lorem');
  });

  test('should clear value with clear button', async ({ page }) => {
    const ac = page.locator('[data-cy=ac-select-single-preselected]');
    await expect(ac.locator('input')).toHaveValue('Lorem');

    const activator = ac.locator('[data-id=activator]');
    await activator.hover();
    await ac.locator('[data-id=clear]').click();
    await expect(ac.locator('input')).toHaveValue('');
  });

  test('should select multiple values as chips', async ({ page }) => {
    const ac = page.locator('[data-cy=ac-select-multi]');
    const activator = ac.locator('[data-id=activator]');

    await activator.click();
    await expect(page.locator('div[role=menu]')).toBeVisible();

    await page.locator('div[role=menu] button').first().click();
    // Menu stays open for multi-select
    await expect(page.locator('div[role=menu]')).toBeVisible();
    await expect(ac.locator('[data-id=activator] [data-value]')).toHaveCount(1);

    await page.locator('div[role=menu] button').nth(1).click();
    await expect(ac.locator('[data-id=activator] [data-value]')).toHaveCount(2);
  });

  test('should remove chip by clicking close', async ({ page }) => {
    const ac = page.locator('[data-cy=ac-select-multi-preselected]');
    const chips = ac.locator('[data-id=activator] [data-value]');
    await expect(chips).toHaveCount(2);

    // Click close button on first chip
    await chips.first().locator('button[type="button"]').click();
    await expect(ac.locator('[data-id=activator] [data-value]')).toHaveCount(1);
  });

  test('should auto-select first option on open', async ({ page }) => {
    const ac = page.locator('[data-cy=ac-select-auto-first]');
    const activator = ac.locator('[data-id=activator]');

    await activator.click();
    await expect(page.locator('div[role=menu]')).toBeVisible();

    const firstButton = page.locator('div[role=menu] button').first();
    await expect(firstButton).toHaveClass(/highlighted/);
  });

  test('should hide selected items from dropdown', async ({ page }) => {
    const ac = page.locator('[data-cy=ac-select-hide-selected]');
    const activator = ac.locator('[data-id=activator]');

    await activator.click();
    await expect(page.locator('div[role=menu]')).toBeVisible();
    const initialCount = await page.locator('div[role=menu] button').count();

    // Select first item
    await page.locator('div[role=menu] button').first().click();

    // Re-focus to keep menu open (multi-select)
    const newCount = await page.locator('div[role=menu] button').count();
    expect(newCount).toBe(initialCount - 1);
  });

  test('should navigate options with keyboard', async ({ page }) => {
    const ac = page.locator('[data-cy=ac-select-single]');
    const activator = ac.locator('[data-id=activator]');

    await activator.click();
    await expect(page.locator('div[role=menu]')).toBeVisible();

    // Navigate down
    await activator.press('ArrowDown');
    await activator.press('ArrowDown');

    // Select with Enter
    await activator.press('Enter');
    await expect(page.locator('div[role=menu]')).toHaveCount(0);
    // The value should be set (exact value depends on which item was highlighted)
    await expect(ac.locator('input')).not.toHaveValue('');
  });

  test('should select with Tab in single mode', async ({ page }) => {
    const ac = page.locator('[data-cy=ac-select-single]');
    const activator = ac.locator('[data-id=activator]');

    await activator.click();
    await expect(page.locator('div[role=menu]')).toBeVisible();

    await activator.press('ArrowDown');
    await activator.press('Tab');

    // Tab should select and close in single mode
    await expect(ac.locator('input')).not.toHaveValue('');
  });
});

test.describe('auto-complete - search', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/auto-completes/search');
  });

  test.afterEach(async ({ page }) => {
    await page.keyboard.press('Escape');
  });

  test('should filter options by typing', async ({ page }) => {
    const ac = page.locator('[data-cy=ac-search-filter]');
    const activator = ac.locator('[data-id=activator]');

    await activator.click();
    await expect(page.locator('div[role=menu]')).toBeVisible();

    await ac.locator('input').fill('Germany');
    await expect(page.locator('div[role=menu] button')).toHaveCount(1);
    await expect(page.locator('div[role=menu] button').first()).toContainText('Germany');

    // Type a broader search to verify results change
    await ac.locator('input').fill('Gr');
    const filteredCount = await page.locator('div[role=menu] button').count();
    expect(filteredCount).toBeGreaterThanOrEqual(1);
  });

  test('should not filter when noFilter is set', async ({ page }) => {
    const ac = page.locator('[data-cy=ac-search-no-filter]');
    const activator = ac.locator('[data-id=activator]');

    await activator.click();
    await expect(page.locator('div[role=menu]')).toBeVisible();

    const initialCount = await page.locator('div[role=menu] button').count();
    expect(initialCount).toBe(5);

    await ac.locator('input').fill('xyz');
    const filteredCount = await page.locator('div[role=menu] button').count();
    expect(filteredCount).toBe(5);
  });

  test('should allow custom value entry', async ({ page }) => {
    const ac = page.locator('[data-cy=ac-search-custom-value]');
    const activator = ac.locator('[data-id=activator]');

    await activator.click();
    await ac.locator('input').fill('MyCustomEntry');
    await activator.press('Enter');

    await expect(ac.locator('input')).toHaveValue('MyCustomEntry');
  });

  test('should hide custom value option from menu', async ({ page }) => {
    const ac = page.locator('[data-cy=ac-search-custom-hide]');
    const activator = ac.locator('[data-id=activator]');

    await activator.click();
    await ac.locator('input').fill('MyCustom');

    // With hideCustomValue, only exact matches from options should appear, not the typed custom text
    // Since "MyCustom" doesn't match any option, menu should show no-data or be hidden
    await expect(page.locator('div[role=menu] button')).toHaveCount(0);
  });

  test('should show no-data message when no matches', async ({ page }) => {
    const ac = page.locator('[data-cy=ac-search-no-data]');
    const activator = ac.locator('[data-id=activator]');

    await activator.click();
    await ac.locator('input').fill('xyznonexistent');

    await expect(page.locator('div[role=menu] [data-id=no-data]')).toBeVisible();
    await expect(page.locator('div[role=menu] [data-id=no-data]')).toContainText('Nothing found');
  });

  test('should hide no-data when hideNoData is set', async ({ page }) => {
    const ac = page.locator('[data-cy=ac-search-hide-no-data]');
    const activator = ac.locator('[data-id=activator]');

    await activator.click();
    await ac.locator('input').fill('xyznonexistent');

    await expect(page.locator('div[role=menu] [data-id=no-data]')).toHaveCount(0);
  });

  test('should show placeholder only when focused', async ({ page }) => {
    const ac = page.locator('[data-cy=ac-search-placeholder]');
    const input = ac.locator('input');

    // Before focus, placeholder should be empty
    await expect(input).toHaveAttribute('placeholder', '');

    // Click to focus
    await ac.locator('[data-id=activator]').click();
    await expect(input).toHaveAttribute('placeholder', 'Type here...');
  });
});

test.describe('auto-complete - readonly', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/auto-completes/readonly');
  });

  test.afterEach(async ({ page }) => {
    await page.keyboard.press('Escape');
  });

  test('should not open menu when read-only', async ({ page }) => {
    const ac = page.locator('[data-cy=ac-readonly-default]');
    const activator = ac.locator('[data-id=activator]');
    await expect(activator).toHaveAttribute('aria-readonly', 'true');
    await activator.click({ force: true });
    await expect(page.locator('div[role=menu]')).toHaveCount(0);
  });

  test('should display pre-selected value', async ({ page }) => {
    const ac = page.locator('[data-cy=ac-readonly-default]');
    await expect(ac.locator('input')).toHaveValue('Lorem');
  });

  test('should display read-only chips', async ({ page }) => {
    const ac = page.locator('[data-cy=ac-readonly-multi]');
    const chips = ac.locator('[data-id=activator] [data-value]');
    await expect(chips).toHaveCount(2);
  });
});

test.describe('auto-complete - custom slots', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/auto-completes/custom');
  });

  test.afterEach(async ({ page }) => {
    await page.keyboard.press('Escape');
  });

  test('should open menu via custom activator button', async ({ page }) => {
    const ac = page.locator('[data-cy=ac-custom-activator]');
    const button = ac.locator('[data-cy=activator]');

    await expect(button).toBeVisible();
    await expect(button).toContainText('Choose Option');

    await button.click();
    await expect(page.locator('div[role=menu]')).toBeVisible();
  });

  test('should render custom item append content', async ({ page }) => {
    const ac = page.locator('[data-cy=ac-custom-item]');
    const activator = ac.locator('[data-id=activator]');

    await activator.click();
    await expect(page.locator('div[role=menu]')).toBeVisible();

    // Select first item
    await page.locator('div[role=menu] button').first().click();

    // Re-open to verify check icon on the selected item
    await activator.click();
    await expect(page.locator('div[role=menu]')).toBeVisible();

    const activeButton = page.locator('div[role=menu] button[aria-selected=true]');
    await expect(activeButton.locator('svg')).toBeVisible();
  });
});

test.describe('auto-complete - keyboard', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/auto-completes/keyboard');
  });

  test.afterEach(async ({ page }) => {
    await page.keyboard.press('Escape');
  });

  test('should remove last value with Backspace in non-chips multi mode', async ({ page }) => {
    const ac = page.locator('[data-cy=ac-kb-multi-no-chips]');
    const activator = ac.locator('[data-id=activator]');

    // Verify initial state: 3 items selected (Lorem, Ipsum, Dolor)
    await expect(activator).toContainText('Lorem');
    await expect(activator).toContainText('Ipsum');
    await expect(activator).toContainText('Dolor');

    // Click the activator to focus, then press Backspace with empty search
    await activator.click();
    await page.keyboard.press('Backspace');

    // Last item (Dolor) should be removed
    await expect(activator).toContainText('Lorem');
    await expect(activator).toContainText('Ipsum');
    await expect(activator).not.toContainText('Dolor');
  });

  test('should focus chip on first Backspace, then delete on second', async ({ page }) => {
    const ac = page.locator('[data-cy=ac-kb-multi-chips]');
    const activator = ac.locator('[data-id=activator]');
    const chips = activator.locator('[data-value]');

    // Verify initial state: 3 chips
    await expect(chips).toHaveCount(3);

    // Focus the search input explicitly (input is hidden behind chips)
    await ac.locator('input').focus();
    await page.keyboard.press('Backspace');

    // First Backspace should focus the last chip (not remove it)
    await expect(chips).toHaveCount(3);
    await expect(activator.locator('[data-index="2"]')).toBeFocused();

    // Second Backspace on the focused chip should remove it
    await page.keyboard.press('Backspace');
    await expect(chips).toHaveCount(2);
  });

  test('should navigate between chips with arrow keys', async ({ page }) => {
    const ac = page.locator('[data-cy=ac-kb-chip-nav]');
    const activator = ac.locator('[data-id=activator]');
    const chips = activator.locator('[data-value]');

    // Verify initial state: 4 chips
    await expect(chips).toHaveCount(4);

    // Focus the search input explicitly (input is hidden behind chips)
    await ac.locator('input').focus();

    // Press ArrowLeft to move to the last chip
    await page.keyboard.press('ArrowLeft');
    await expect(activator.locator('[data-index="3"]')).toBeFocused();

    // Press ArrowLeft again to move to the previous chip
    await page.keyboard.press('ArrowLeft');
    await expect(activator.locator('[data-index="2"]')).toBeFocused();

    // Press ArrowRight to move back to the next chip
    await page.keyboard.press('ArrowRight');
    await expect(activator.locator('[data-index="3"]')).toBeFocused();
  });

  test('should close menu with Escape', async ({ page }) => {
    const ac = page.locator('[data-cy=ac-kb-escape]');
    const activator = ac.locator('[data-id=activator]');

    // Open the menu
    await activator.click();
    await expect(page.locator('div[role=menu]')).toBeVisible();

    // Press Escape to close
    await page.keyboard.press('Escape');
    await expect(page.locator('div[role=menu]')).toHaveCount(0);
  });

  test('should submit form on Enter when menu is closed and value is set', async ({ page }) => {
    const ac = page.locator('[data-cy=ac-kb-form-submit]');
    const form = page.locator('[data-cy=ac-kb-form]');

    // Value is preselected ('Lorem'), verify it
    await expect(ac.locator('input')).toHaveValue('Lorem');

    // Focus the input - this should open the menu
    await ac.locator('input').click();
    await expect(page.locator('div[role=menu]')).toBeVisible();

    // Close menu with Escape
    await page.keyboard.press('Escape');
    await expect(page.locator('div[role=menu]')).toHaveCount(0);

    // Press Enter - should submit the form
    await ac.locator('input').press('Enter');
    await expect(form.locator('[data-cy=form-submitted]')).toBeVisible();
  });

  test('should highlight selected item when re-opening menu', async ({ page }) => {
    const ac = page.locator('[data-cy=ac-kb-reopen]');
    const activator = ac.locator('[data-id=activator]');

    // Open and select an item
    await activator.click();
    await expect(page.locator('div[role=menu]')).toBeVisible();
    await page.locator('div[role=menu] button').nth(2).click();

    // Menu should close (single mode)
    await expect(page.locator('div[role=menu]')).toHaveCount(0);

    // Value should be set
    const selectedValue = await ac.locator('input').inputValue();
    expect(selectedValue).toBeTruthy();

    // Re-open the menu
    await activator.click();
    await expect(page.locator('div[role=menu]')).toBeVisible();

    // The selected item should be highlighted
    const highlightedButton = page.locator('div[role=menu] button.highlighted');
    await expect(highlightedButton).toBeVisible();
    await expect(highlightedButton).toHaveAttribute('aria-selected', 'true');
  });
});

test.describe('auto-complete - advanced', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/auto-completes/advanced');
  });

  test.afterEach(async ({ page }) => {
    await page.keyboard.press('Escape');
  });

  test('should work with return-object mode', async ({ page }) => {
    const ac = page.locator('[data-cy=ac-adv-return-object]');
    const activator = ac.locator('[data-id=activator]');

    // Open and select an item
    await activator.click();
    await expect(page.locator('div[role=menu]')).toBeVisible();
    await page.locator('div[role=menu] button').first().click();

    // Value should be displayed
    await expect(ac.locator('input')).toHaveValue('Germany');
  });

  test('should display pre-selected return-object value', async ({ page }) => {
    const ac = page.locator('[data-cy=ac-adv-return-object-pre]');
    await expect(ac.locator('input')).toHaveValue('Germany');
  });

  test('should render filled variant', async ({ page }) => {
    const ac = page.locator('[data-cy=ac-adv-filled]');
    await expect(ac).toBeVisible();

    // Filled variant should be functional - open and select
    const activator = ac.locator('[data-id=activator]');
    await activator.click();
    await expect(page.locator('div[role=menu]')).toBeVisible();

    await page.locator('div[role=menu] button').first().click();
    await expect(ac.locator('input')).toHaveValue('Lorem');
  });

  test('should handle falsy modelValue like 0 correctly', async ({ page }) => {
    const ac = page.locator('[data-cy=ac-adv-falsy]');
    const display = page.locator('[data-cy=ac-adv-falsy-display]');

    // Value is preselected as 0, should display "Zero"
    await expect(ac.locator('input')).toHaveValue('Zero');
    await expect(display).toContainText('Model: 0');

    // Clear and select a different value
    const activator = ac.locator('[data-id=activator]');
    await activator.click();
    await expect(page.locator('div[role=menu]')).toBeVisible();

    // Select "One" (id: 1)
    await page.locator('div[role=menu] button').nth(1).click();
    await expect(ac.locator('input')).toHaveValue('One');
    await expect(display).toContainText('Model: 1');

    // Re-open and select "Zero" (id: 0) again
    await activator.click();
    await expect(page.locator('div[role=menu]')).toBeVisible();
    await page.locator('div[role=menu] button').first().click();
    await expect(ac.locator('input')).toHaveValue('Zero');
    await expect(display).toContainText('Model: 0');
  });

  test('should sync search input model', async ({ page }) => {
    const ac = page.locator('[data-cy=ac-adv-search-input]');
    const display = page.locator('[data-cy=ac-adv-search-display]');

    // Initially search should be empty
    await expect(display).toContainText('Search: ""');

    // Focus and type
    await ac.locator('[data-id=activator]').click();
    await ac.locator('input').fill('test');
    await expect(display).toContainText('Search: "test"');

    // Clear the input
    await ac.locator('input').fill('');
    await expect(display).toContainText('Search: ""');
  });

  test('should clear all values in multi-select with clear button', async ({ page }) => {
    const ac = page.locator('[data-cy=ac-adv-multi-clear]');
    const activator = ac.locator('[data-id=activator]');
    const chips = activator.locator('[data-value]');

    // Verify initial state: 3 chips
    await expect(chips).toHaveCount(3);

    // Hover and click clear button
    await activator.hover();
    await ac.locator('[data-id=clear]').click();

    // All chips should be removed
    await expect(chips).toHaveCount(0);
  });

  test('should set custom value on blur', async ({ page }) => {
    const ac = page.locator('[data-cy=ac-adv-custom-blur]');

    // Focus and type a custom value
    await ac.locator('[data-id=activator]').click();
    await ac.locator('input').fill('MyCustomBlur');

    // Click somewhere else to blur
    await page.locator('[data-cy=auto-completes-advanced] h2').click();

    // The custom value should be set
    await expect(ac.locator('input')).toHaveValue('MyCustomBlur');
  });
});
