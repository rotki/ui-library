import { type ComponentMountingOptions, mount } from '@vue/test-utils';
import { afterEach, describe, expect, it } from 'vitest';
import RuiSimpleSelect from '@/components/forms/select/RuiSimpleSelect.vue';
import { expectWrapperToHaveClass } from '~/tests/helpers/dom-helpers';

function createWrapper(
  options?: ComponentMountingOptions<typeof RuiSimpleSelect>,
) {
  return mount(RuiSimpleSelect, options);
}

describe('components/forms/select/RuiSimpleSelect.vue', () => {
  let wrapper: ReturnType<typeof createWrapper>;

  afterEach(() => {
    wrapper?.unmount();
  });

  const options = [
    'Option 0',
    'Option 1',
    'Option 2',
    'Option 3',
    'Option 4',
    'Option 5',
  ];

  it('should render properly', () => {
    wrapper = createWrapper({
      props: {
        modelValue: 'Option 5',
        options,
      },
    });

    expectWrapperToHaveClass(wrapper, 'select', /_select_/);
    expect(wrapper.find('span > svg').exists()).toBeTruthy();
  });

  it('should pass props correctly', () => {
    wrapper = createWrapper({
      props: {
        disabled: true,
        modelValue: 'Option 5',
        options,
      },
    });
    expect(wrapper.find('select[disabled]').exists()).toBeTruthy();
  });
});
