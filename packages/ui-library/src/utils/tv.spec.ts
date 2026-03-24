import { describe, expect, it } from 'vitest';
import { tv } from './tv';

describe('tv', () => {
  describe('non-slotted', () => {
    it('should return base classes when no variants defined', () => {
      const button = tv({ base: 'rounded font-semibold' });
      expect(button()).toBe('rounded font-semibold');
    });

    it('should apply default variant classes', () => {
      const button = tv({
        base: 'rounded',
        variants: {
          size: {
            sm: 'text-sm',
            md: 'text-base',
          },
        },
        defaultVariants: { size: 'md' },
      });
      expect(button()).toBe('rounded text-base');
    });

    it('should override defaults with provided props', () => {
      const button = tv({
        base: 'rounded',
        variants: {
          size: {
            sm: 'text-sm',
            md: 'text-base',
          },
        },
        defaultVariants: { size: 'md' },
      });
      expect(button({ size: 'sm' })).toBe('rounded text-sm');
    });

    it('should apply compound variant classes when conditions match', () => {
      const button = tv({
        base: 'rounded',
        variants: {
          intent: {
            primary: 'bg-blue-500',
            secondary: 'bg-white',
          },
          size: {
            sm: 'px-2',
            md: 'px-4',
          },
        },
        compoundVariants: [
          { intent: 'primary', size: 'md', class: 'uppercase' },
        ],
        defaultVariants: { intent: 'primary', size: 'md' },
      });
      expect(button()).toBe('rounded bg-blue-500 px-4 uppercase');
      expect(button({ size: 'sm' })).toBe('rounded bg-blue-500 px-2');
      expect(button({ intent: 'secondary' })).toBe('rounded bg-white px-4');
    });

    it('should append extra class from props', () => {
      const button = tv({ base: 'rounded' });
      expect(button({ class: 'mt-4' })).toBe('rounded mt-4');
    });

    it('should handle boolean variant values', () => {
      const button = tv({
        base: 'rounded',
        variants: {
          disabled: {
            true: 'opacity-50 cursor-not-allowed',
            false: 'cursor-pointer',
          },
        },
        defaultVariants: { disabled: false },
      });
      expect(button({ disabled: true })).toBe('rounded opacity-50 cursor-not-allowed');
      expect(button({ disabled: false })).toBe('rounded cursor-pointer');
    });

    it('should resolve class conflicts with tailwind-merge', () => {
      const button = tv({
        base: 'px-4 py-2',
        variants: {
          size: {
            sm: 'px-2 py-1',
          },
        },
      });
      // tailwind-merge should remove conflicting px-4/py-2 when size=sm
      expect(button({ size: 'sm' })).toBe('px-2 py-1');
      // class prop should override base
      expect(button({ class: 'px-8' })).toBe('py-2 px-8');
    });
  });

  describe('slotted', () => {
    it('should return slot functions', () => {
      const card = tv({
        slots: {
          root: 'flex flex-col',
          content: 'p-4',
          footer: 'mt-auto',
        },
      });
      const ui = card();
      expect(ui.root()).toBe('flex flex-col');
      expect(ui.content()).toBe('p-4');
      expect(ui.footer()).toBe('mt-auto');
    });

    it('should apply variants to specific slots', () => {
      const card = tv({
        slots: {
          root: 'flex flex-col',
          content: 'p-4',
        },
        variants: {
          dense: {
            true: { content: 'p-2' },
          },
        },
      });
      const ui = card({ dense: true });
      expect(ui.root()).toBe('flex flex-col');
      // tailwind-merge resolves p-4 vs p-2
      expect(ui.content()).toBe('p-2');
    });

    it('should accept per-slot class overrides via slot function', () => {
      const card = tv({
        slots: {
          root: 'flex flex-col',
          content: 'p-4',
        },
      });
      const ui = card();
      expect(ui.root({ class: 'my-4' })).toBe('flex flex-col my-4');
      // class override should merge with tailwind-merge
      expect(ui.content({ class: 'p-8' })).toBe('p-8');
    });

    it('should apply compound variants to slots', () => {
      const component = tv({
        slots: {
          root: 'flex',
          label: 'text-sm',
        },
        variants: {
          size: {
            sm: { root: 'gap-1' },
            md: { root: 'gap-2' },
          },
          disabled: {
            true: { label: 'text-gray-400' },
          },
        },
        compoundVariants: [
          { size: 'sm', disabled: true, class: { root: 'opacity-50' } },
        ],
      });
      const ui = component({ size: 'sm', disabled: true });
      expect(ui.root()).toBe('flex gap-1 opacity-50');
      expect(ui.label()).toBe('text-sm text-gray-400');
    });
  });
});
