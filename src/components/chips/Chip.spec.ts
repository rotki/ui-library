import { type ComponentMountingOptions, mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import Chip from '@/components/chips/Chip.vue';

const createWrapper = (options?: ComponentMountingOptions<typeof Chip>) =>
  mount(Chip, { ...options, global: { stubs: ['rui-icon'] } });

describe('Chips/Chip', () => {
  it('renders properly', () => {
    const label = 'Chip';
    const wrapper = createWrapper({
      props: {
        label,
      },
    });
    expect(wrapper.find('span[class*=_label]').text()).toContain(label);
  });

  it('shows dismiss icon', async () => {
    const wrapper = createWrapper({
      props: {
        label: 'Chip',
        dismissible: true,
      },
    });

    expect(wrapper.find('button').attributes().disabled).toBeUndefined();

    await wrapper.find('button').trigger('click');
    expect(wrapper.emitted()).toHaveProperty('remove');
  });

  it("disabled chip can't dismiss dismiss", async () => {
    const wrapper = createWrapper({
      props: {
        label: 'Chip',
        dismissible: true,
        disabled: true,
      },
    });

    expect(wrapper.find('button').attributes().disabled).toBe('');

    await wrapper.find('button').trigger('click');
    expect(wrapper.emitted()).not.toHaveProperty('remove');
  });
});
