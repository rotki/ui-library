import { describe, expect, it } from 'vitest';
import { needsOwnFocus } from '@/composables/keyboard-scroll';

function box(size: { client: number; scroll: number }, html = 'Text'): HTMLElement {
  const element = document.createElement('div');
  element.innerHTML = html;
  Object.defineProperty(element, 'clientWidth', { value: size.client });
  Object.defineProperty(element, 'scrollWidth', { value: size.scroll });
  Object.defineProperty(element, 'clientHeight', { value: 100 });
  Object.defineProperty(element, 'scrollHeight', { value: 100 });
  return element;
}

describe('composables/keyboard-scroll', () => {
  it('should not focus a box that fits', () => {
    expect(needsOwnFocus(box({ client: 300, scroll: 300 }))).toBe(false);
  });

  it('should focus a box that overflows with nothing focusable inside', () => {
    expect(needsOwnFocus(box({ client: 300, scroll: 600 }))).toBe(true);
  });

  it('should leave an overflowing box alone when a control inside can take focus', () => {
    expect(needsOwnFocus(box({ client: 300, scroll: 600 }, '<button>Go</button>'))).toBe(false);
    expect(needsOwnFocus(box({ client: 300, scroll: 600 }, '<span tabindex="0">Tab</span>'))).toBe(false);
  });

  it('should still focus a box whose only controls are disabled or out of the tab order', () => {
    expect(needsOwnFocus(box({ client: 300, scroll: 600 }, '<button disabled>Go</button>'))).toBe(true);
    expect(needsOwnFocus(box({ client: 300, scroll: 600 }, '<span tabindex="-1">Tab</span>'))).toBe(true);
  });

  it('should ignore a sub-pixel overflow', () => {
    expect(needsOwnFocus(box({ client: 300, scroll: 301 }))).toBe(false);
  });
});
