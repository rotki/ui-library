import { describe, expect, it } from 'vitest';
import { type ComponentMountingOptions, mount } from '@vue/test-utils';
import RuiMenuSelect from '@/components/forms/select/RuiMenuSelect.vue';

interface SelectOption { id: string; label: string }

function createWrapper(options?: ComponentMountingOptions<typeof RuiMenuSelect<SelectOption>>) {
  return mount(RuiMenuSelect, options);
}

describe('menu select', () => {
  const options: SelectOption[] = [
    { id: '1', label: 'Germany' },
    { id: '2', label: 'Nigeria' },
    { id: '3', label: 'Greece' },
    { id: '4', label: 'Indonesia' },
    { id: '5', label: 'Spain' },
    { id: '6', label: 'India' },
    { id: '7', label: 'France' },
    { id: '8', label: 'England' },
    ...[...new Array(50).keys()].map(index => ({
      id: `${index + 9}`,
      label: `${index + 9}`,
    })),
  ];

  it('renders properly', () => {
    const wrapper = createWrapper({
      props: {
        keyAttr: 'id',
        modelValue: undefined,
        options,
        textAttr: 'label',
      },
    });

    expect(wrapper.get('button[data-id="activator"]').classes()).toEqual(
      expect.arrayContaining([expect.stringMatching(/_activator_/)]),
    );
    expect(wrapper.find('button[data-id="activator"] span[class*=label]').exists()).toBeTruthy();
    expect(wrapper.find('span > svg').exists()).toBeTruthy();
  });

  it('passes props correctly', () => {
    const wrapper = createWrapper({
      props: {
        disabled: true,
        keyAttr: 'id',
        modelValue: options[4].id,
        options,
        textAttr: 'label',
      },
    });
    expect(wrapper.find('button[aria-disabled]').exists()).toBeTruthy();
    expect(wrapper.find('button[aria-disabled]').text()).toMatch('Spain');
  });
});
