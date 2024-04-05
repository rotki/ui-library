import { type ComponentMountingOptions, mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import AutoComplete from '@/components/forms/auto-complete/AutoComplete.vue';

function createWrapper(options?: ComponentMountingOptions<typeof AutoComplete>) {
  return mount(AutoComplete, { ...options });
}

describe('forms/AutoComplete', () => {
  const data = [
    { disabled: false, id: '1', text: 'Hello 1' },
    { disabled: false, id: '2', text: 'Hello 2' },
    { disabled: false, id: '3', text: 'Hello 3' },
    { disabled: true, id: '4', text: 'Hello 4' },
    { disabled: true, id: '5', text: 'Hello 5' },
    { disabled: false, id: '6', text: 'Hello 6' },
    { disabled: false, id: '7', text: 'Hello 7' },
    { disabled: true, id: '8', text: 'Hello 8' },
    { disabled: false, id: '9', text: 'Hello 9' },
    { disabled: false, id: '10', text: 'Hello 10' },
    { disabled: false, id: '11', text: 'Hello 11' },
    { disabled: false, id: '12', text: 'Hello 12' },
    { disabled: false, id: '13', text: 'Hello 13' },
    { disabled: false, id: '14', text: 'Hello 14' },
    { disabled: false, id: '15', text: 'Hello 15' },
    { disabled: false, id: '16', text: 'Hello 16' },
  ];
  const hint = 'Lorem ipsum dolor hint';
  const errorMessage = 'Lorem ipsum dolor sit amet error';
  const label = 'Country';

  it('renders properly', () => {
    const wrapper = createWrapper({
      props: {
        data,
        hint,
        label,
        modelValue: null,
      },
    });
    expect(wrapper.find('label').text()).toContain(label);
    expect(wrapper.find('.details .text-caption').text()).toContain(hint);
    expect(wrapper.find('.details .text-caption').text()).toContain(hint);
  });

  it('error has more priority over hint', async () => {
    const wrapper = createWrapper({
      props: {
        data,
        hint,
        modelValue: null,
      },
    });

    expect(wrapper.find('.details .text-caption').text()).toContain(hint);

    await wrapper.setProps({ errorMessages: [errorMessage] });

    expect(wrapper.find('.details .text-caption').text()).not.toContain(hint);

    expect(wrapper.find('.details .text-caption').text()).toContain(
      errorMessage,
    );
  });

  it('based on model, expect single values', async () => {
    const wrapper = createWrapper({
      props: {
        data,
        hint,
        modelValue: null,
      },
    });

    expect(wrapper.classes()).toEqual(
      expect.arrayContaining([expect.stringMatching(/_single_/)]),
    );
    expect(wrapper.classes()).toEqual(
      expect.arrayContaining([expect.stringMatching(/_default_/)]),
    );
    expect(wrapper.classes()).not.toEqual(
      expect.arrayContaining([expect.stringMatching(/_multiple_/)]),
    );

    await wrapper.setProps({ variant: 'filled' });
    expect(wrapper.classes()).toEqual(
      expect.arrayContaining([expect.stringMatching(/_filled_/)]),
    );
    expect(wrapper.classes()).not.toEqual(
      expect.arrayContaining([expect.stringMatching(/_default_/)]),
    );
  });

  it('based on model, expect multiple values', async () => {
    const wrapper = createWrapper({
      props: {
        data,
        hint,
        modelValue: [],
      },
    });

    expect(wrapper.classes()).toEqual(
      expect.arrayContaining([expect.stringMatching(/_multiple_/)]),
    );
    expect(wrapper.classes()).toEqual(
      expect.arrayContaining([expect.stringMatching(/_default_/)]),
    );
    expect(wrapper.classes()).not.toEqual(
      expect.arrayContaining([expect.stringMatching(/_single_/)]),
    );

    await wrapper.setProps({ variant: 'filled' });
    expect(wrapper.classes()).toEqual(
      expect.arrayContaining([expect.stringMatching(/_filled_/)]),
    );
    expect(wrapper.classes()).not.toEqual(
      expect.arrayContaining([expect.stringMatching(/_default_/)]),
    );
  });
});
