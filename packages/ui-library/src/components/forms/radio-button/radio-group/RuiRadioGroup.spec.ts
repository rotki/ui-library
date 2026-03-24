import { type ComponentMountingOptions, mount } from '@vue/test-utils';
import { afterEach, describe, expect, it } from 'vitest';
import RuiRadioGroup from '@/components/forms/radio-button/radio-group/RuiRadioGroup.vue';

function createWrapper(
  options?: ComponentMountingOptions<typeof RuiRadioGroup>,
) {
  const opts: ComponentMountingOptions<typeof RuiRadioGroup> = {
    ...options,
    global: {
      stubs: ['icon'],
    },
  };

  return mount(RuiRadioGroup, opts);
}

describe('components/forms/radio-button/radio-group/RuiRadioGroup.vue', () => {
  let wrapper: ReturnType<typeof createWrapper>;

  afterEach(() => {
    wrapper?.unmount();
  });

  it('should have role="radiogroup" on wrapper', () => {
    wrapper = createWrapper();
    expect(wrapper.attributes('role')).toBe('radiogroup');
  });

  it('should pass inline props', async () => {
    wrapper = createWrapper();
    const radioWrapper = wrapper.findAll('div[role=radiogroup] > div')[0];
    expect(radioWrapper?.classes()).not.toContain('flex');

    await wrapper.setProps({ inline: true });
    const updatedWrapper = wrapper.findAll('div[role=radiogroup] > div')[0];
    expect(updatedWrapper?.classes()).toContain('flex');
    expect(updatedWrapper?.classes()).toContain('space-x-6');
  });

  it('should pass hint props', async () => {
    wrapper = createWrapper();
    expect(wrapper.find('.details > div').exists()).toBeFalsy();

    const hint = 'RadioGroup Hints';
    await wrapper.setProps({ hint });
    const hintEl = wrapper.find('.details > div');
    expect(hintEl.classes()).toEqual(expect.arrayContaining([expect.stringContaining('text-rui-text-secondary')]));
    expect(hintEl.text()).toBe(hint);
  });

  it('should pass hint errorMessages', async () => {
    wrapper = createWrapper();
    expect(wrapper.find('.details > div').exists()).toBeFalsy();

    const errorMessage = 'RadioGroup Error Message';
    await wrapper.setProps({ errorMessages: [errorMessage] });
    const errorEl = wrapper.find('.details > div');
    expect(errorEl.classes()).toEqual(expect.arrayContaining([expect.stringContaining('text-rui-error')]));
    expect(errorEl.text()).toBe(errorMessage);
  });

  it('should pass hideDetails', () => {
    wrapper = createWrapper({
      props: {
        hideDetails: true,
        hint: 'This hint should not be rendered',
      },
    });
    expect(wrapper.find('.details > div').exists()).toBeFalsy();
  });

  it('should show required asterisk when required prop is true', async () => {
    const label = 'RadioGroup Label';
    wrapper = createWrapper({
      props: {
        label,
      },
    });

    // Required asterisk should not be present by default
    expect(wrapper.text()).not.toContain('﹡');

    // Set required to true
    await wrapper.setProps({ required: true });
    expect(wrapper.text()).toContain('﹡');
    expect(wrapper.find('.text-rui-error').exists()).toBeTruthy();

    // Set required back to false
    await wrapper.setProps({ required: false });
    expect(wrapper.text()).not.toContain('﹡');
  });
});
