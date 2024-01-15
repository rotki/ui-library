import { describe, expect, it } from 'vitest';
import { type ComponentMountingOptions, mount } from '@vue/test-utils';
import SimpleSelect from '@/components/forms/select/SimpleSelect.vue';

const createWrapper = (
  options?: ComponentMountingOptions<typeof SimpleSelect>,
) => mount(SimpleSelect, options);

describe('Simple select', () => {
  it('renders properly', async () => {
    const wrapper = createWrapper({
      props: {
        options: [
          'Option 0',
          'Option 1',
          'Option 2',
          'Option 3',
          'Option 4',
          'Option 5',
        ],
        modelValue: 'Option 5',
      },
    });

    expect(wrapper.get('select').classes()).toMatch(/_select_/);
    expect(wrapper.find('span > svg').exists()).toBeTruthy();
  });

  it('passes props correctly', async () => {
    const wrapper = createWrapper({
      props: {
        options: [
          'Option 0',
          'Option 1',
          'Option 2',
          'Option 3',
          'Option 4',
          'Option 5',
        ],
        modelValue: 'Option 5',
        disabled: true,
      },
    });
    expect(wrapper.find('select[disabled]').exists()).toBeTruthy();
  });
});
