import { type ComponentMountingOptions, mount, type VueWrapper } from '@vue/test-utils';
import { afterEach, describe, expect, it } from 'vitest';
import RuiChip from '@/components/chips/RuiChip.vue';

function createWrapper(options?: ComponentMountingOptions<typeof RuiChip>): VueWrapper<InstanceType<typeof RuiChip>> {
  return mount(RuiChip, { ...options, global: { stubs: ['rui-icon'] } });
}

describe('components/chips/RuiChip.vue', () => {
  let wrapper: VueWrapper<InstanceType<typeof RuiChip>>;

  afterEach(() => {
    wrapper?.unmount();
  });

  it('should render properly', () => {
    const label = 'Chip';
    wrapper = createWrapper({
      props: {
        contentClass: 'content-class',
      },
      slots: {
        default: label,
      },
    });

    expect(wrapper.find('span[class*=_label]').text()).toContain(label);
    expect(wrapper.find('span[class*=_label]').classes()).toContain('content-class');
  });

  it('should show close icon', async () => {
    wrapper = createWrapper({
      props: {
        closeable: true,
      },
    });

    expect(wrapper.find('button').attributes().disabled).toBeUndefined();

    await wrapper.find('button').trigger('click');
    expect(wrapper.emitted()).toHaveProperty('click:close');
  });

  it('should not close disabled chip', async () => {
    wrapper = createWrapper({
      props: {
        closeable: true,
        disabled: true,
      },
    });

    expect(wrapper.find('button').attributes().disabled).toBe('');

    await wrapper.find('button').trigger('click');
    expect(wrapper.emitted()).not.toHaveProperty('click:close');
  });

  it('should not emit click event for disabled chip', async () => {
    wrapper = createWrapper({
      props: {
        clickable: true,
        disabled: true,
      },
    });

    await wrapper.find('div[role=button]').trigger('click');
    expect(wrapper.emitted()).not.toHaveProperty('click');

    await wrapper.setProps({ disabled: false });

    await wrapper.find('div[role=button]').trigger('click');
    expect(wrapper.emitted()).toHaveProperty('click');
  });

  it('should not emit click event for non-clickable chip', async () => {
    wrapper = createWrapper({
      props: {
        clickable: false,
      },
    });

    await wrapper.find('div[role=button]').trigger('click');
    expect(wrapper.emitted()).not.toHaveProperty('click');

    await wrapper.setProps({ clickable: true });

    await wrapper.find('div[role=button]').trigger('click');
    expect(wrapper.emitted()).toHaveProperty('click');
  });
});
