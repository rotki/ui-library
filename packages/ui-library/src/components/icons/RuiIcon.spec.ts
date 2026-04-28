import { type ComponentMountingOptions, mount, type VueWrapper } from '@vue/test-utils';
import { afterEach, describe, expect, it } from 'vitest';
import RuiIcon from '@/components/icons/RuiIcon.vue';

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

    // Numeric sizes are normalized to px so the custom property has a valid
    // CSS length for the svg's `width: var(--rui-icon-size, 1.5rem)` class.
    expect(wrapper.attributes('style')).toContain('--rui-icon-size: 32px');
    // Presentation attrs are intentionally gone — they had specificity 0 and
    // lost the cascade inside RuiButton (see rotki/ui-library#512).
    expect(wrapper.attributes('width')).toBeUndefined();
    expect(wrapper.attributes('height')).toBeUndefined();

    await wrapper.setProps({ size: 48 });
    expect(wrapper.attributes('style')).toContain('--rui-icon-size: 48px');

    await wrapper.setProps({ size: '1.25rem' });
    expect(wrapper.attributes('style')).toContain('--rui-icon-size: 1.25rem');
  });

  it('should coerce a bare-number size string to px', async () => {
    // `:size="16"` in a template binds as a string; before the fix this
    // produced `--rui-icon-size: 16` (no unit), an invalid CSS length that
    // computed to 0 width. Assert the numeric-string path stays px-coerced.
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

    // No size prop → no inline `--rui-icon-size` → the var() fallback of
    // 1.5rem drives width/height. A parent (e.g. RuiButton) can still inject
    // `--rui-icon-size` to shrink the icon in lockstep with its own size.
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

    // Regression guard: in `RuiButton variant="list"` the label is `w-full`
    // and `text-nowrap`. With a long label inside a width-bounded menu, a
    // shrinkable SVG sibling collapses on the main axis (the height stays at
    // the var-driven box, so the glyph renders as a sliver). `shrink-0`
    // pins the icon at its `--rui-icon-size` regardless of sibling pressure.
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
