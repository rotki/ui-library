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

  it('should change size via size prop', async () => {
    wrapper = createWrapper({
      props: {
        name: 'lu-circle-arrow-down',
        size: 32,
      },
    });

    expect(wrapper.attributes('width')).toMatch('32');
    expect(wrapper.attributes('height')).toMatch('32');

    await wrapper.setProps({ size: 48 });
    expect(wrapper.attributes('width')).toMatch('48');
    expect(wrapper.attributes('height')).toMatch('48');
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

  it('should default to w-6/h-6 without inline size attributes', () => {
    wrapper = createWrapper({
      props: {
        name: 'lu-circle-arrow-down',
      },
    });

    // No inline width/height lets parent CSS override the size.
    expect(wrapper.attributes('width')).toBeUndefined();
    expect(wrapper.attributes('height')).toBeUndefined();
    expect(wrapper.classes()).toContain('w-6');
    expect(wrapper.classes()).toContain('h-6');
  });

  it('should drop the default sizing class when size prop is set', () => {
    wrapper = createWrapper({
      props: {
        name: 'lu-circle-arrow-down',
        size: 32,
      },
    });

    expect(wrapper.classes()).not.toContain('w-6');
    expect(wrapper.classes()).not.toContain('h-6');
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
