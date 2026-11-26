import { describe, expect, it } from 'vitest';
import { dialogSizes, radiusRoles, shadowRoles, zLayers } from '@/consts/tokens';
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

    it('should merge the role tokens with the scale they stand in for', () => {
      expect(tv({ base: 'rounded-rui-control rounded-full' })()).toBe('rounded-full');
      expect(tv({ base: 'rounded-t-rui-control rounded-t-none' })()).toBe('rounded-t-none');
      expect(tv({ base: 'shadow-rui-menu shadow-lg' })()).toBe('shadow-lg');
      expect(tv({ base: 'shadow-lg shadow-rui-menu' })()).toBe('shadow-rui-menu');
      expect(tv({ base: 'bg-rui-surface bg-white' })()).toBe('bg-white');
      expect(tv({ base: 'border-rui-divider border-rui-primary' })()).toBe('border-rui-primary');
      expect(tv({ base: 'top-rui-app-bar top-16' })()).toBe('top-16');
      expect(tv({ base: 'top-0 top-rui-app-bar' })()).toBe('top-rui-app-bar');
    });

    it('should let a slash opacity colour replace the plain one', () => {
      expect(tv({ base: 'bg-rui-primary bg-rui-primary/40' })()).toBe('bg-rui-primary/40');
      expect(tv({ base: 'ring-2 ring-rui-primary/50' })()).toBe('ring-2 ring-rui-primary/50');
    });

    it('should let an inline padding replace its start and end sides', () => {
      expect(tv({ base: 'flex-1 ps-8' })({ class: 'px-8' })).toBe('flex-1 px-8');
      expect(tv({ base: 'pe-2' })({ class: 'px-0' })).toBe('px-0');
    });

    it('should keep an outline style, width and colour side by side', () => {
      expect(tv({ base: 'outline-solid outline-1 outline-transparent' })()).toBe('outline-solid outline-1 outline-transparent');
      // Widths still replace one another, and the style keywords still conflict with each other
      expect(tv({ base: 'outline-1 outline-2' })()).toBe('outline-2');
      expect(tv({ base: 'outline-solid outline-dashed' })()).toBe('outline-dashed');
      expect(tv({ base: 'outline-solid outline-hidden' })()).toBe('outline-hidden');
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

  /*
   * The merger only dedupes a theme class when it knows the class's group, so each token the theme
   * defines is checked here against a stock class of the same group, in both orders: the later
   * class must win. A consumer's class on a component then replaces the component's own.
   */
  describe('theme tokens', () => {
    const merge = (classes: string): string => tv({ base: classes })();
    const typeScale = ['body-1', 'body-2', 'caption', 'caption-2', 'overline', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'subtitle-1', 'subtitle-2'];

    function expectLaterWins(a: string, b: string): void {
      expect(merge(`${a} ${b}`)).toBe(b);
      expect(merge(`${b} ${a}`)).toBe(a);
    }

    it.each(radiusRoles)('replaces a stock radius with rounded-rui-%s', (role) => {
      expectLaterWins('rounded-full', `rounded-rui-${role}`);
    });

    it.each(shadowRoles)('replaces a stock shadow with shadow-rui-%s', (role) => {
      expectLaterWins('shadow-lg', `shadow-rui-${role}`);
    });

    it.each([...dialogSizes.map(size => `dialog-${size}`), 'tooltip'])('replaces a stock max width with max-w-rui-%s', (size) => {
      expectLaterWins('max-w-40', `max-w-rui-${size}`);
    });

    it('replaces a stock inset with the app bar spacing', () => {
      expectLaterWins('top-16', 'top-rui-app-bar');
    });

    it.each(zLayers)('replaces a stock z-index with z-rui-%s', (layer) => {
      expectLaterWins('z-10', `z-rui-${layer}`);
    });

    it.each(typeScale)('replaces a stock font size with text-%s', (step) => {
      expectLaterWins('text-sm', `text-${step}`);
    });

    it.each(typeScale)('keeps a text colour next to text-%s', (step) => {
      expect(merge(`text-rui-primary text-${step}`)).toBe(`text-rui-primary text-${step}`);
      expect(merge(`text-${step} text-rui-primary`)).toBe(`text-${step} text-rui-primary`);
    });

    it('treats two type scale steps as one group', () => {
      expectLaterWins('text-h6', 'text-body-1');
      expectLaterWins('text-h1', 'text-h6');
    });

    it('treats theme colours as colours', () => {
      expectLaterWins('text-white', 'text-rui-primary');
      expectLaterWins('bg-white', 'bg-rui-surface');
      expectLaterWins('border-red-500', 'border-rui-divider');
    });
  });
});
