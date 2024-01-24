import { describe, expect, it } from 'vitest';
import { type ComponentMountingOptions, mount } from '@vue/test-utils';
import SimpleSelect from '@/components/forms/select/SimpleSelect.vue';

function createWrapper(options?: ComponentMountingOptions<typeof SimpleSelect>) {
  return mount(SimpleSelect, options);
}

describe('simple select', () => {
  it('renders properly', () => {
    const wrapper = createWrapper({
      props: {
        modelValue: 'Option 5',
        options: [
          'Option 0',
          'Option 1',
          'Option 2',
          'Option 3',
          'Option 4',
          'Option 5',
        ],
      },
    });

    expect(wrapper.get('select').classes()).toMatch(/_select_/);
    expect(wrapper.find('span > svg').exists()).toBeTruthy();
  });

  it('passes props correctly', () => {
    const wrapper = createWrapper({
      props: {
        disabled: true,
        modelValue: 'Option 5',
        options: [
          'Option 0',
          'Option 1',
          'Option 2',
          'Option 3',
          'Option 4',
          'Option 5',
        ],
      },
    });
    expect(wrapper.find('select[disabled]').exists()).toBeTruthy();
  });
});
