import { type ComponentMountingOptions, mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import RuiButton from '@/components/buttons/button/RuiButton.vue';
import RuiIcon from '@/components/icons/RuiIcon.vue';
import { expectWrapperNotToHaveClass, expectWrapperToHaveClass } from '~/tests/helpers/dom-helpers';

function createWrapper(
  options?: ComponentMountingOptions<typeof RuiButton>,
) {
  return mount(RuiButton, options);
}

describe('components/buttons/button/RuiButton.vue', () => {
  let wrapper: ReturnType<typeof createWrapper>;

  afterEach(() => {
    wrapper?.unmount();
  });

  it('should render properly', () => {
    const label = 'Primary Button';
    wrapper = createWrapper({
      slots: {
        default: () => label,
      },
    });
    expect(wrapper.text()).toContain(label);
    expect(wrapper.find('button').exists()).toBeTruthy();
    expect(wrapper.attributes('type')).toBe('button');
  });

  it('should pass disabled props', async () => {
    wrapper = createWrapper();
    expect(wrapper.find('button').attributes('disabled')).toBeUndefined();
    await wrapper.setProps({ disabled: true });
    expect(wrapper.find('button').attributes('disabled')).toBeDefined();
    await wrapper.setProps({ disabled: false });
    expect(wrapper.find('button').attributes('disabled')).toBeUndefined();
  });

  it('should pass loading props', async () => {
    wrapper = createWrapper();
    expect(wrapper.find('[data-spinner]').exists()).toBeFalsy();

    await wrapper.setProps({ loading: true });
    expect(wrapper.find('[data-spinner]').exists()).toBeTruthy();

    await wrapper.setProps({ loading: false });
    expect(wrapper.find('[data-spinner]').exists()).toBeFalsy();
  });

  it('should pass color props', async () => {
    wrapper = createWrapper({
      props: {
        color: 'primary',
      },
    });
    expectWrapperToHaveClass(wrapper, 'button', /bg-rui-primary/);

    await wrapper.setProps({ color: 'secondary' });
    expectWrapperToHaveClass(wrapper, 'button', /bg-rui-secondary/);

    await wrapper.setProps({ color: 'error' });
    expectWrapperToHaveClass(wrapper, 'button', /bg-rui-error/);

    await wrapper.setProps({ color: 'success' });
    expectWrapperToHaveClass(wrapper, 'button', /bg-rui-success/);
  });

  it('should pass variant props', async () => {
    wrapper = createWrapper();
    expect(wrapper.attributes('data-variant')).toBe('default');

    await wrapper.setProps({ variant: 'outlined' });
    expect(wrapper.attributes('data-variant')).toBe('outlined');

    await wrapper.setProps({ variant: 'text' });
    expect(wrapper.attributes('data-variant')).toBe('text');

    await wrapper.setProps({ variant: 'fab' });
    expect(wrapper.attributes('data-variant')).toBe('fab');
    expectWrapperToHaveClass(wrapper, 'button', /rounded-full/);
  });

  it('should pass rounded props', async () => {
    wrapper = createWrapper();
    expectWrapperNotToHaveClass(wrapper, 'button', /rounded-full/);
    await wrapper.setProps({ rounded: true });
    expectWrapperToHaveClass(wrapper, 'button', /rounded-full/);
    await wrapper.setProps({ rounded: false });
    // Default rounded (not rounded-full) should apply
    expectWrapperToHaveClass(wrapper, 'button', /rounded/);
  });

  it('should pass icon props', async () => {
    wrapper = createWrapper();
    await wrapper.setProps({ icon: true });
    expectWrapperToHaveClass(wrapper, 'button', /rounded-full/);
    await wrapper.setProps({ icon: false });
    expectWrapperNotToHaveClass(wrapper, 'button', /rounded-full/);
  });

  it('should pass size props', async () => {
    wrapper = createWrapper();
    await wrapper.setProps({ size: 'xs' });
    expect(wrapper.find('button').classes()).toContain('text-[.75rem]');
    expect(wrapper.find('button').classes()).toContain('leading-4');
    await wrapper.setProps({ size: 'sm' });
    expectWrapperToHaveClass(wrapper, 'button', /py-1/);
    await wrapper.setProps({ size: 'lg' });
    expect(wrapper.find('button').classes()).toContain('text-[1rem]');
    await wrapper.setProps({ size: 'xl' });
    expect(wrapper.find('button').classes()).toContain('text-[1rem]');
    expectWrapperToHaveClass(wrapper, 'button', /py-2\.5/);
    expectWrapperToHaveClass(wrapper, 'button', /leading-6/);
  });

  it('should set --rui-icon-size per button size so descendant icons scale', async () => {
    wrapper = createWrapper();
    // default (md) — the base root seeds the property without `!` so consumer
    // overrides via inline style on the svg still win.
    expect(wrapper.find('button').classes()).toContain('[--rui-icon-size:1.125rem]');

    // Size variants redefine the property with `!` so they beat the base
    // rule on the same element regardless of CSS source order.
    await wrapper.setProps({ size: 'sm' });
    expect(wrapper.find('button').classes()).toContain('![--rui-icon-size:1rem]');

    await wrapper.setProps({ size: 'lg' });
    expect(wrapper.find('button').classes()).toContain('![--rui-icon-size:1.25rem]');

    await wrapper.setProps({ size: 'xl' });
    expect(wrapper.find('button').classes()).toContain('![--rui-icon-size:1.375rem]');
  });

  // Regression tests for https://github.com/rotki/ui-library/issues/512
  // Icon sizing inside a button now flows through a single CSS custom
  // property, `--rui-icon-size`. The button seeds it per size variant; the
  // icon reads it via `width: var(--rui-icon-size, 1.5rem)`. A consumer
  // passing `size` on RuiIcon stamps an inline style on the svg, which
  // overrides the inherited value without needing !important.
  describe('icon size cascade inside button (issue #512)', () => {
    const perSize = { xs: '![--rui-icon-size:0.75rem]', sm: '![--rui-icon-size:1rem]', lg: '![--rui-icon-size:1.25rem]', xl: '![--rui-icon-size:1.375rem]' } as const;
    for (const size of ['xs', 'sm', 'lg', 'xl'] as const) {
      it(`should attach ${perSize[size]} when size is ${size}`, () => {
        wrapper = createWrapper({
          props: { size },
          slots: {
            prepend: () => h(RuiIcon, { name: 'lu-circle-arrow-down', size: 14 }),
          },
        });
        expect(wrapper.find('button').classes()).toContain(perSize[size]);
      });
    }

    it('should let a consumer-supplied RuiIcon size override the button variant', () => {
      wrapper = createWrapper({
        props: { size: 'sm' },
        slots: {
          prepend: () => h(RuiIcon, { name: 'lu-circle-arrow-down', size: 14 }),
        },
      });
      const svg = wrapper.find('svg.rui-icon');
      // Consumer-driven size lands as inline style — beats the button's
      // inherited `![--rui-icon-size:1rem]` on the svg itself.
      expect(svg.attributes('style')).toContain('--rui-icon-size: 14px');
      // Presentation attrs are gone — the whole point of #512 was to stop
      // relying on them because they lost the cascade.
      expect(svg.attributes('width')).toBeUndefined();
      expect(svg.attributes('height')).toBeUndefined();
      // Button still carries its own property so a bare RuiIcon (no size)
      // next to this one would inherit the button-driven size.
      expect(wrapper.find('button').classes()).toContain('![--rui-icon-size:1rem]');
    });

    it('should override the md baseline via `!` on size variants', async () => {
      wrapper = createWrapper({
        slots: {
          prepend: () => h(RuiIcon, { name: 'lu-circle-arrow-down' }),
        },
      });
      // md default: no `!` prefix on the baseline rule — consumers can
      // shadow it with their own `--rui-icon-size` without fighting
      // !important.
      expect(wrapper.find('button').classes()).toContain('[--rui-icon-size:1.125rem]');
      expect(wrapper.find('button').classes()).not.toContain('![--rui-icon-size:1.125rem]');

      await wrapper.setProps({ size: 'sm' });
      expect(wrapper.find('button').classes()).toContain('![--rui-icon-size:1rem]');
      // baseline rule is still on the element — size variants win through
      // `!important` + equal specificity, not removal.
      expect(wrapper.find('button').classes()).toContain('[--rui-icon-size:1.125rem]');
    });

    it('should apply icon-only compound variant sizing across button sizes', async () => {
      wrapper = createWrapper({
        props: { icon: true },
        slots: {
          default: () => h(RuiIcon, { name: 'lu-circle-arrow-down' }),
        },
      });
      // md icon-only: 1.25rem glyph via compound variant
      expect(wrapper.find('button').classes()).toContain('![--rui-icon-size:1.25rem]');

      await wrapper.setProps({ size: 'xs' });
      // xs icon-only: 0.875rem glyph (14px) at 70% of a 1.25rem (20px) box.
      expect(wrapper.find('button').classes()).toContain('![--rui-icon-size:0.875rem]');
      expect(wrapper.find('button').classes()).toContain('p-[0.1875rem]');

      await wrapper.setProps({ size: 'sm' });
      expect(wrapper.find('button').classes()).toContain('![--rui-icon-size:1.25rem]');

      await wrapper.setProps({ size: 'lg' });
      expect(wrapper.find('button').classes()).toContain('![--rui-icon-size:1.5rem]');

      await wrapper.setProps({ size: 'xl' });
      expect(wrapper.find('button').classes()).toContain('![--rui-icon-size:1.75rem]');
    });
  });

  // Pairs with issue #512 second half: list-variant icon alignment audit.
  describe('list variant icon slot (issue #512)', () => {
    it('should preserve flex alignment for prepend icons in list variant', () => {
      wrapper = createWrapper({
        props: { variant: 'list' },
        slots: {
          prepend: () => h(RuiIcon, { name: 'lu-circle-arrow-down' }),
          default: () => 'Menu item',
        },
      });
      const btn = wrapper.find('button');
      expect(btn.classes()).toContain('flex');
      expect(btn.classes()).toContain('items-center');
      expect(btn.classes()).toContain('justify-start');
    });

    it('should give list-variant labels w-full so text fills the row', () => {
      wrapper = createWrapper({
        props: { variant: 'list' },
        slots: {
          prepend: () => h(RuiIcon, { name: 'lu-circle-arrow-down' }),
          default: () => 'Menu item',
        },
      });
      expect(wrapper.find('[data-id="btn-label"]').classes()).toContain('w-full');
    });

    it('should scale list-variant icons in lockstep with button size', async () => {
      wrapper = createWrapper({
        props: { variant: 'list' },
        slots: {
          prepend: () => h(RuiIcon, { name: 'lu-circle-arrow-down' }),
          default: () => 'Menu item',
        },
      });
      // md
      expect(wrapper.find('button').classes()).toContain('[--rui-icon-size:1.125rem]');

      await wrapper.setProps({ size: 'sm' });
      expect(wrapper.find('button').classes()).toContain('![--rui-icon-size:1rem]');
    });
  });

  it('should pass elevation props and set to correct classes based on the state', async () => {
    wrapper = createWrapper();
    expectWrapperToHaveClass(wrapper, 'button', /shadow-0/);
    await wrapper.setProps({ variant: 'fab' });
    expectWrapperToHaveClass(wrapper, 'button', /shadow-6/);
    await wrapper.setProps({ elevation: 10 });
    expectWrapperToHaveClass(wrapper, 'button', /shadow-10/);
    await wrapper.setProps({ disabled: true });
    expectWrapperToHaveClass(wrapper, 'button', /shadow-0/);
  });
});
