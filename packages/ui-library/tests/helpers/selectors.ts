/**
 * Common CSS selectors used in component tests
 * Centralizes selector definitions to avoid magic strings and ensure consistency
 */

export const ROLE_SELECTORS = {
  TOOLTIP: 'div[role="tooltip"]',
  MENU: 'div[role="menu"]',
  DIALOG: 'div[role="dialog"]',
  ALERT: 'div[role="alert"]',
} as const;

export const DATA_ATTRIBUTE_SELECTORS = {
  ACTIVATOR: '[data-id="activator"]',
  POPPER_PLACEMENT_BOTTOM: '[data-popper-placement="bottom"]',
  POPPER_PLACEMENT_TOP: '[data-popper-placement="top"]',
  POPPER_ARROW: '[data-popper-arrow]',
} as const;

export const ELEMENT_SELECTORS = {
  INPUT: 'input',
  BUTTON: 'button',
  FORM: 'form',
  SVG: 'svg',
} as const;

export const CLASS_PATTERNS = {
  TOOLTIP: /_tooltip_/,
  MENU: /_menu_/,
  CARD: /_card_/,
  OUTLINED: /_outlined_/,
  DENSE: /_dense_/,
  DIVIDE: /_divide_/,
  DISABLED: /_disabled_/,
  HIGHLIGHTED: 'highlighted',
} as const;
