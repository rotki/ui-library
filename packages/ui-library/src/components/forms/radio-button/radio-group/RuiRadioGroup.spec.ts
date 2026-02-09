import { type ComponentMountingOptions, mount } from '@vue/test-utils';
import { afterEach, describe, expect, it } from 'vitest';
import RuiRadioGroup from '@/components/forms/radio-button/radio-group/RuiRadioGroup.vue';
import { expectWrapperNotToHaveClass, expectWrapperToHaveClass } from '~/tests/helpers/dom-helpers';

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
    expectWrapperNotToHaveClass(wrapper, 'div[class*=wrapper]', /inline/);

    await wrapper.setProps({ inline: true });
    expectWrapperToHaveClass(wrapper, 'div[class*=wrapper]', /inline/);
  });

  it('should pass hint props', async () => {
    wrapper = createWrapper();
    expect(wrapper.find('.details > div').exists()).toBeFalsy();

    const hint = 'RadioGroup Hints';
    await wrapper.setProps({ hint });
    expectWrapperToHaveClass(wrapper, '.details > div', /text-rui-text-secondary/);
    expect(wrapper.find('.details > div').text()).toBe(hint);
  });

  it('should pass hint errorMessages', async () => {
    wrapper = createWrapper();
    expect(wrapper.find('.details > div').exists()).toBeFalsy();

    const errorMessage = 'RadioGroup Error Message';
    await wrapper.setProps({ errorMessages: [errorMessage] });
    expectWrapperToHaveClass(wrapper, '.details > div', /text-rui-error/);
    expect(wrapper.find('.details > div').text()).toBe(errorMessage);
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
