import RuiSimpleSelect from '@/components/forms/select/RuiSimpleSelect.vue';
import { type ComponentMountingOptions, mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';

function createWrapper(options?: ComponentMountingOptions<typeof RuiSimpleSelect>) {
  return mount(RuiSimpleSelect, options);
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

    expect(wrapper.get('select').classes()).toEqual(
      expect.arrayContaining([expect.stringMatching(/_select_/)]),
    );
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
