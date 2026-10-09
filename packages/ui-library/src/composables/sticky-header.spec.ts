import { describe, expect, it } from 'vitest';
import { createsFixedContainingBlock } from '@/composables/sticky-header';

function styleWith(values: Partial<Record<'transform' | 'translate' | 'rotate' | 'scale' | 'filter' | 'willChange' | 'contain', string>>): CSSStyleDeclaration {
  const element = document.createElement('div');
  for (const [property, value] of Object.entries(values))
    element.style.setProperty(property.replace(/[A-Z]/g, letter => `-${letter.toLowerCase()}`), value);

  return element.style;
}

describe('composables/sticky-header', () => {
  it('should not treat a plain element as a containing block', () => {
    expect(createsFixedContainingBlock(styleWith({}))).toBe(false);
  });

  it('should treat a transformed element as a containing block', () => {
    expect(createsFixedContainingBlock(styleWith({ transform: 'translateX(-50%)' }))).toBe(true);
  });

  it('should treat the individual translate, rotate and scale properties like transform', () => {
    expect(createsFixedContainingBlock(styleWith({ translate: '-50% -50%' }))).toBe(true);
    expect(createsFixedContainingBlock(styleWith({ rotate: '90deg' }))).toBe(true);
    expect(createsFixedContainingBlock(styleWith({ scale: '1.1' }))).toBe(true);
  });

  it('should count a will-change hint for translate', () => {
    expect(createsFixedContainingBlock(styleWith({ willChange: 'translate' }))).toBe(true);
  });
});
