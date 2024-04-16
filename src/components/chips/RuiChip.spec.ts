import { type ComponentMountingOptions, mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import RuiChip from '@/components/chips/RuiChip.vue';

function createWrapper(options?: ComponentMountingOptions<typeof RuiChip>) {
  return mount(RuiChip, { ...options, global: { stubs: ['rui-icon'] } });
}

describe('chips/Chip', () => {
  it('renders properly', () => {
    const label = 'Chip';
    const wrapper = createWrapper({
      slots: {
        default: label,
      },
    });
    expect(wrapper.find('span[class*=_label]').text()).toContain(label);
  });

  it('shows close icon', async () => {
    const wrapper = createWrapper({
      props: {
        closeable: true,
      },
    });

    expect(wrapper.find('button').attributes().disabled).toBeUndefined();

    await wrapper.find('button').trigger('click');
    expect(wrapper.emitted()).toHaveProperty('click:close');
  });

  it('disabled chip can\'t be closed', async () => {
    const wrapper = createWrapper({
      props: {
        closeable: true,
        disabled: true,
      },
    });

    expect(wrapper.find('button').attributes().disabled).toBe('');

    await wrapper.find('button').trigger('click');
    expect(wrapper.emitted()).not.toHaveProperty('click:close');
  });

  it('disabled chip doesn\'t emit click event', async () => {
    const wrapper = createWrapper({
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

  it('not `clickable` chip doesn\'t emit click event', async () => {
    const wrapper = createWrapper({
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
