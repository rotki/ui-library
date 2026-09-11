import type { GeneratedIcon } from '@/types/icons';
import { type ComponentMountingOptions, mount, type VueWrapper } from '@vue/test-utils';
import { afterEach, describe, expect, it, vi } from 'vitest';
import RuiIcon from '@/components/icons/RuiIcon.vue';
import { createIconDefaults, IconsSymbol } from '@/composables/icons';

function createWrapper(options?: ComponentMountingOptions<typeof RuiIcon>): VueWrapper<InstanceType<typeof RuiIcon>> {
  return mount(RuiIcon, options);
}

describe('components/icons/RuiIcon.vue', () => {
  let wrapper: VueWrapper<InstanceType<typeof RuiIcon>>;

  afterEach(() => {
    wrapper?.unmount();
  });

  it('should render properly', () => {
    wrapper = createWrapper({
      props: {
        color: 'primary',
        name: 'lu-circle-arrow-down',
      },
    });
    expect(wrapper.classes()).toContain('text-rui-primary');
  });

  it('should let a consumer class replace the conflicting variant class', () => {
    wrapper = createWrapper({
      attrs: {
        class: 'text-rui-error size-4',
      },
      props: {
        color: 'primary',
        name: 'lu-circle-arrow-down',
      },
    });

    const classes = wrapper.classes();
    expect(classes).toContain('text-rui-error');
    expect(classes).toContain('size-4');
    // the variant colour and the base box must be gone, not merely outranked
    expect(classes).not.toContain('text-rui-primary');
    expect(classes).not.toContain('w-[var(--rui-icon-size,1.5rem)]');
    // untouched base classes stay
    expect(classes).toContain('shrink-0');
    expect(classes).toContain('rui-icon');
  });

  it('should still forward non-class attributes to the svg', () => {
    wrapper = createWrapper({
      attrs: {
        'data-id': 'my-icon',
        'role': 'img',
      },
      props: {
        name: 'lu-circle-arrow-down',
      },
    });

    expect(wrapper.attributes('data-id')).toBe('my-icon');
    expect(wrapper.attributes('role')).toBe('img');
  });

  it('should have aria-hidden="true" on svg', () => {
    wrapper = createWrapper({
      props: {
        name: 'lu-circle-arrow-down',
      },
    });
    expect(wrapper.attributes('aria-hidden')).toBe('true');
  });

  it('should drive size via --rui-icon-size inline style when size prop is set', async () => {
    wrapper = createWrapper({
      props: {
        name: 'lu-circle-arrow-down',
        size: 32,
      },
    });

    // A numeric size becomes px, so the custom property holds a valid CSS length
    expect(wrapper.attributes('style')).toContain('--rui-icon-size: 32px');
    // Presentation attrs are gone: at specificity 0 they lost the cascade inside RuiButton (#512)
    expect(wrapper.attributes('width')).toBeUndefined();
    expect(wrapper.attributes('height')).toBeUndefined();

    await wrapper.setProps({ size: 48 });
    expect(wrapper.attributes('style')).toContain('--rui-icon-size: 48px');

    await wrapper.setProps({ size: '1.25rem' });
    expect(wrapper.attributes('style')).toContain('--rui-icon-size: 1.25rem');
  });

  it('should coerce the numeric string a `:size="16"` binding produces to px, not a unitless 0-width length', async () => {
    wrapper = createWrapper({
      props: {
        name: 'lu-circle-arrow-down',
        size: '16',
      },
    });
    expect(wrapper.attributes('style')).toContain('--rui-icon-size: 16px');

    await wrapper.setProps({ size: '18.5' });
    expect(wrapper.attributes('style')).toContain('--rui-icon-size: 18.5px');

    // Values that already carry a unit pass through unchanged.
    await wrapper.setProps({ size: '20px' });
    expect(wrapper.attributes('style')).toContain('--rui-icon-size: 20px');
  });

  it('should apply color classes', async () => {
    wrapper = createWrapper({
      props: {
        name: 'lu-circle-arrow-down',
        color: 'primary',
      },
    });

    expect(wrapper.classes()).toContain('text-rui-primary');

    await wrapper.setProps({ color: 'secondary' });
    expect(wrapper.classes()).toContain('text-rui-secondary');

    await wrapper.setProps({ color: 'error' });
    expect(wrapper.classes()).toContain('text-rui-error');
  });

  it('should size via --rui-icon-size with a 1.5rem fallback and no inline style', () => {
    wrapper = createWrapper({
      props: {
        name: 'lu-circle-arrow-down',
      },
    });

    expect(wrapper.attributes('style')).toBeUndefined();
    expect(wrapper.classes()).toContain('w-[var(--rui-icon-size,1.5rem)]');
    expect(wrapper.classes()).toContain('h-[var(--rui-icon-size,1.5rem)]');
  });

  it('should keep the var-driven sizing classes when size prop is set', () => {
    wrapper = createWrapper({
      props: {
        name: 'lu-circle-arrow-down',
        size: 32,
      },
    });

    // The classes stay; the size prop just changes the custom property.
    expect(wrapper.classes()).toContain('w-[var(--rui-icon-size,1.5rem)]');
    expect(wrapper.classes()).toContain('h-[var(--rui-icon-size,1.5rem)]');
  });

  it('should carry shrink-0 so a flex sibling cannot squeeze the icon below --rui-icon-size', () => {
    wrapper = createWrapper({
      props: {
        name: 'lu-circle-arrow-down',
      },
    });

    // A `w-full text-nowrap` label in a bounded menu would otherwise squeeze the glyph to a sliver
    expect(wrapper.classes()).toContain('shrink-0');
  });

  it('should always carry the rui-icon marker class for parent-driven sizing', () => {
    wrapper = createWrapper({
      props: {
        name: 'lu-circle-arrow-down',
      },
    });

    expect(wrapper.classes()).toContain('rui-icon');
  });

  describe('app-registered icons', () => {
    /** A brand logo of the shape an app registers itself, under a name the generated list cannot hold. */
    const customIcon: GeneratedIcon = {
      components: [['path', { d: 'M4 4h16v16H4z' }]],
      name: 'lu-not-a-library-icon',
    };

    function createWithCustomIcon(
      name: string,
    ): VueWrapper<InstanceType<typeof RuiIcon>> {
      return mount(RuiIcon, {
        global: {
          provide: {
            [IconsSymbol]: createIconDefaults({ registeredIcons: [customIcon] }),
          },
        },
        props: { name },
      });
    }

    it('should render a registered icon without complaining about it', () => {
      const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
      const error = vi.spyOn(console, 'error').mockImplementation(() => {});

      wrapper = createWithCustomIcon(customIcon.name);

      // Guards rotki/ui-library#568, where the name-list check warned on every render
      expect(wrapper.find('path').attributes('d')).toBe('M4 4h16v16H4z');
      expect(warn).not.toHaveBeenCalled();
      expect(error).not.toHaveBeenCalled();
    });

    it('should still report a name that is registered nowhere', () => {
      const error = vi.spyOn(console, 'error').mockImplementation(() => {});

      wrapper = createWithCustomIcon('lu-registered-nowhere');

      expect(error).toHaveBeenCalledOnce();
      expect(wrapper.find('path').exists()).toBe(false);
    });
  });

  it('should render svg element', () => {
    wrapper = createWrapper({
      props: {
        name: 'lu-circle-arrow-down',
      },
    });

    expect(wrapper.element.tagName).toBe('svg');
    expect(wrapper.attributes('xmlns')).toBe('http://www.w3.org/2000/svg');
  });
});
