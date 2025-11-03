import type { VueWrapper } from '@vue/test-utils';
import { expect } from 'vitest';

/**
 * Query an element from document.body using a CSS selector
 * Shorthand for document.body.querySelector
 * @param selector - CSS selector string
 * @returns The element or null if not found
 */
export function queryBody<T extends Element = Element>(
  selector: string,
): T | null {
  return document.body.querySelector<T>(selector);
}

/**
 * Query an element by its role attribute
 * @param role - The ARIA role to search for
 * @param container - The container to search within (defaults to document.body)
 * @returns The element or null if not found
 */
export function queryByRole<T extends Element = Element>(
  role: string,
  container: Document | Element = document.body,
): T | null {
  return container.querySelector<T>(`[role="${role}"]`);
}

/**
 * Query all elements by their role attribute
 * @param role - The ARIA role to search for
 * @param container - The container to search within (defaults to document.body)
 * @returns NodeList of matching elements
 */
export function queryAllByRole<T extends Element = Element>(
  role: string,
  container: Document | Element = document.body,
): NodeListOf<T> {
  return container.querySelectorAll<T>(`[role="${role}"]`);
}

/**
 * Query an element by data-id attribute
 * @param id - The data-id value
 * @param container - The container to search within (defaults to document.body)
 * @returns The element or null if not found
 */
export function queryByDataId<T extends Element = Element>(
  id: string,
  container: Document | Element = document.body,
): T | null {
  return container.querySelector<T>(`[data-id="${id}"]`);
}

/**
 * Query a menu button by its index
 * @param index - The 1-based index (CSS nth-child)
 * @param container - The container to search within (defaults to document.body)
 * @returns The button element or null if not found
 */
export function queryMenuButton(
  index: number,
  container: Document | Element = document.body,
): HTMLButtonElement | null {
  const menu = queryByRole('menu', container);
  if (!menu)
    return null;
  return menu.querySelector<HTMLButtonElement>(`button:nth-child(${index})`);
}

/**
 * Query all buttons within a menu
 * @param container - The container to search within (defaults to document.body)
 * @returns Array of button elements
 */
export function queryAllMenuButtons(
  container: Document | Element = document.body,
): HTMLButtonElement[] {
  const menu = queryByRole('menu', container);
  if (!menu)
    return [];
  return Array.from(menu.querySelectorAll<HTMLButtonElement>('button'));
}

/**
 * Assert that an element has a class matching the given pattern
 * @param element - The element to check
 * @param classPattern - The regex pattern to match against class names
 */
export function expectToHaveClass(
  element: Element | null | undefined,
  classPattern: RegExp,
): void {
  const classList = Array.from(element?.classList ?? []);
  expect(classList).toEqual(
    expect.arrayContaining([expect.stringMatching(classPattern)]),
  );
}

/**
 * Assert that an element does not have a class matching the given pattern
 * @param element - The element to check
 * @param classPattern - The regex pattern to match against class names
 */
export function expectNotToHaveClass(
  element: Element | null | undefined,
  classPattern: RegExp,
): void {
  const classList = Array.from(element?.classList ?? []);
  expect(classList).not.toEqual(
    expect.arrayContaining([expect.stringMatching(classPattern)]),
  );
}

/**
 * Assert that a Vue wrapper's element has a class matching the given pattern
 * @param wrapper - The Vue wrapper
 * @param selector - CSS selector to find the element within the wrapper
 * @param classPattern - The regex pattern to match against class names
 * @example
 * expectWrapperToHaveClass(wrapper, 'div[class*=wrapper]', /_primary_/);
 */
export function expectWrapperToHaveClass(
  wrapper: VueWrapper,
  selector: string,
  classPattern: RegExp,
): void {
  const element = wrapper.find(selector).element;
  expectToHaveClass(element, classPattern);
}

/**
 * Assert that a Vue wrapper's element does not have a class matching the given pattern
 * @param wrapper - The Vue wrapper
 * @param selector - CSS selector to find the element within the wrapper
 * @param classPattern - The regex pattern to match against class names
 * @example
 * expectWrapperNotToHaveClass(wrapper, 'div[class*=wrapper]', /_dense_/);
 */
export function expectWrapperNotToHaveClass(
  wrapper: VueWrapper,
  selector: string,
  classPattern: RegExp,
): void {
  const element = wrapper.find(selector).element;
  expectNotToHaveClass(element, classPattern);
}

/**
 * Get the value of an input element
 * @param input - The input element
 * @returns The input value
 */
export function getInputValue(input: Element | null | undefined): string {
  return (input as HTMLInputElement | null)?.value ?? '';
}

/**
 * Assert that an element exists and is truthy.
 * This function acts as both a Vitest assertion and a TypeScript type guard.
 * After calling this function, TypeScript knows the element is non-null.
 * @param element - The element to assert exists
 * @param message - Optional error message
 * @example
 * const dialog = queryByRole<HTMLDivElement>('dialog');
 * assertExists(dialog); // Asserts and narrows type
 * dialog.querySelector(...); // No optional chaining needed
 */
export function assertExists<T>(
  element: T,
  message?: string,
): asserts element is NonNullable<T> {
  expect(element, message).toBeTruthy();
}

/**
 * Clean up all elements matching a selector from the DOM
 * @param selector - CSS selector for elements to remove
 * @param container - The container to search within (defaults to document.body)
 */
export function cleanupElements(
  selector: string,
  container: Document | Element = document.body,
): void {
  const elements = container.querySelectorAll(selector);
  elements.forEach(element => element.remove());
}
