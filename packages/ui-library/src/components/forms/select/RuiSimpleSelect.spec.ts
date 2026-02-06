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

  it('should render all options', () => {
    wrapper = createWrapper({
      props: {
        modelValue: 'Option 0',
        options,
      },
    });

    const optionElements = wrapper.findAll('option');
    expect(optionElements).toHaveLength(6);
    expect(optionElements[0]?.text()).toBe('Option 0');
    expect(optionElements[5]?.text()).toBe('Option 5');
  });

  it('should render outlined variant', () => {
    wrapper = createWrapper({
      props: {
        modelValue: 'Option 0',
        options,
        variant: 'outlined',
      },
    });

    expectWrapperToHaveClass(wrapper, 'select', /_outlined_/);
  });

  it('should render chevron icon', () => {
    wrapper = createWrapper({
      props: {
        modelValue: 'Option 0',
        options,
      },
    });

    expect(wrapper.find('svg').exists()).toBeTruthy();
  });

  it('should set name attribute', () => {
    wrapper = createWrapper({
      props: {
        modelValue: 'Option 0',
        name: 'test',
        options,
      },
    });

    expect(wrapper.find('select').attributes('name')).toBe('test');
  });

  it('should render selected value', () => {
    wrapper = createWrapper({
      props: {
        modelValue: 'Option 2',
        options,
      },
    });

    expect(
      wrapper.find<HTMLSelectElement>('select').element.value,
    ).toBe('Option 2');
  });

  it('should emit update:model-value on change', async () => {
    wrapper = createWrapper({
      props: {
        modelValue: 'Option 0',
        options,
      },
    });

    await wrapper.find('select').setValue('Option 3');
    expect(wrapper.emitted('update:model-value')).toBeTruthy();
    expect(wrapper.emitted('update:model-value')?.[0]).toEqual(['Option 3']);
  });

  it('should work with number options', () => {
    const numberOptions = [1, 2, 3];
    wrapper = createWrapper({
      props: {
        modelValue: 2,
        options: numberOptions,
      },
    });

    const optionElements = wrapper.findAll('option');
    expect(optionElements).toHaveLength(3);
    expect(optionElements[0]?.text()).toBe('1');
    expect(optionElements[2]?.text()).toBe('3');
  });

  it('should have data-id="select" on select element', () => {
    wrapper = createWrapper({
      props: {
        modelValue: 'Option 0',
        options,
      },
    });

    expect(wrapper.find('[data-id=select]').exists()).toBeTruthy();
    expect(wrapper.find('[data-id=select]').element.tagName).toBe('SELECT');
  });

  it('should set aria-label from label prop', () => {
    wrapper = createWrapper({
      props: {
        label: 'Choose option',
        modelValue: 'Option 0',
        options,
      },
    });

    expect(wrapper.find('select').attributes('aria-label')).toBe('Choose option');
  });

  it('should pass attrs to wrapper div', () => {
    wrapper = createWrapper({
      attrs: {
        'data-cy': 'test',
      },
      props: {
        modelValue: 'Option 0',
        options,
      },
    });

    expect(wrapper.attributes('data-cy')).toBe('test');
  });
});
