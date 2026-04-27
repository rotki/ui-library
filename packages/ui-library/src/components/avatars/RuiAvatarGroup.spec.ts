import { type ComponentMountingOptions, mount, type VueWrapper } from '@vue/test-utils';
import { afterEach, describe, expect, it } from 'vitest';
import RuiAvatar from '@/components/avatars/RuiAvatar.vue';
import RuiAvatarGroup from '@/components/avatars/RuiAvatarGroup.vue';

function createWrapper(
  options?: ComponentMountingOptions<typeof RuiAvatarGroup>,
): VueWrapper<InstanceType<typeof RuiAvatarGroup>> {
  return mount(RuiAvatarGroup, {
    ...options,
    global: {
      components: { RuiAvatar },
    },
  });
}

describe('components/avatars/RuiAvatarGroup.vue', () => {
  let wrapper: VueWrapper<InstanceType<typeof RuiAvatarGroup>>;

  afterEach(() => {
    wrapper?.unmount();
  });

  it('renders all children when max is not set', () => {
    wrapper = createWrapper({
      slots: {
        default: `
          <RuiAvatar text="AB" />
          <RuiAvatar text="CD" />
          <RuiAvatar text="EF" />
        `,
      },
    });

    const items = wrapper.findAllComponents(RuiAvatar);
    expect(items).toHaveLength(3);
    expect(wrapper.find('[data-id="avatar-group-surplus"]').exists()).toBeFalsy();
  });

  it('slices children to max and renders +N surplus', () => {
    wrapper = createWrapper({
      props: { max: 2 },
      slots: {
        default: `
          <RuiAvatar text="AB" />
          <RuiAvatar text="CD" />
          <RuiAvatar text="EF" />
          <RuiAvatar text="GH" />
        `,
      },
    });

    const surplus = wrapper.find('[data-id="avatar-group-surplus"]');
    expect(surplus.exists()).toBeTruthy();
    expect(surplus.text()).toBe('+2');
  });

  it('uses total prop to override surplus count', () => {
    wrapper = createWrapper({
      props: { max: 2, total: 42 },
      slots: {
        default: `
          <RuiAvatar text="AB" />
          <RuiAvatar text="CD" />
          <RuiAvatar text="EF" />
        `,
      },
    });

    expect(wrapper.find('[data-id="avatar-group-surplus"]').text()).toBe('+40');
  });

  it('uses surplus slot override', () => {
    wrapper = createWrapper({
      props: { max: 1 },
      slots: {
        default: `
          <RuiAvatar text="AB" />
          <RuiAvatar text="CD" />
          <RuiAvatar text="EF" />
        `,
        surplus: '<span data-test="surplus">custom {{ params.count }}</span>',
      },
    });

    const surplus = wrapper.find('[data-test="surplus"]');
    expect(surplus.exists()).toBeTruthy();
  });

  it('injects size into children without explicit size', () => {
    wrapper = createWrapper({
      props: { size: 'lg' },
      slots: {
        default: '<RuiAvatar text="AB" />',
      },
    });

    const child = wrapper.find('[data-id="avatar-root"]');
    expect(child.attributes('data-size')).toBe('lg');
  });

  it('child explicit size wins over injected', () => {
    wrapper = createWrapper({
      props: { size: 'lg' },
      slots: {
        default: '<RuiAvatar text="AB" size="sm" />',
      },
    });

    const child = wrapper.find('[data-id="avatar-root"]');
    expect(child.attributes('data-size')).toBe('sm');
  });

  it('injects variant into children', () => {
    wrapper = createWrapper({
      props: { variant: 'square' },
      slots: {
        default: '<RuiAvatar text="AB" />',
      },
    });

    expect(wrapper.find('[data-id="avatar-root"]').attributes('data-variant')).toBe('square');
  });

  it('exposes data-id on group root', () => {
    wrapper = createWrapper({
      slots: { default: '<RuiAvatar text="AB" />' },
    });
    expect(wrapper.find('[data-id="avatar-group"]').exists()).toBeTruthy();
  });
});
