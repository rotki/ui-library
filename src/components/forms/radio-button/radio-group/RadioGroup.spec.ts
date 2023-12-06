import { describe, expect, it } from 'vitest';
import { type ComponentMountingOptions, mount } from '@vue/test-utils';
import RadioGroup from './RadioGroup.vue';

const createWrapper = (options?: ComponentMountingOptions<typeof RadioGroup>) =>
  mount(RadioGroup, { ...options, global: { stubs: ['icon'] } });

describe('Forms/RadioButton/RadioGroup', () => {
  it('passes inline props', async () => {
    const wrapper = createWrapper();
    expect(wrapper.find('div[class*=wrapper]').classes()).not.toMatch(/inline/);
    await wrapper.setProps({ inline: true });
    expect(wrapper.find('div[class*=wrapper]').classes()).toMatch(/inline/);
  });

  it('passes hint props', async () => {
    const wrapper = createWrapper();
    expect(wrapper.find('.details > div').exists()).toBeFalsy();

    const hint = 'RadioGroup Hints';
    await wrapper.setProps({ hint });
    expect(wrapper.find('.details > div').classes()).toMatch(
      /text-rui-text-secondary/,
    );
    expect(wrapper.find('.details > div').text()).toBe(hint);
  });

  it('passes hint errorMessages', async () => {
    const wrapper = createWrapper();
    expect(wrapper.find('.details > div').exists()).toBeFalsy();

    const errorMessage = 'RadioGroup Error Message';
    await wrapper.setProps({ errorMessages: [errorMessage] });
    expect(wrapper.find('.details > div').classes()).toMatch(/text-rui-error/);
    expect(wrapper.find('.details > div').text()).toBe(errorMessage);
  });

  it('passes hideDetails', async () => {
    const wrapper = createWrapper({
      props: {
        hint: 'This hint should not be rendered',
        hideDetails: true,
      },
    });
    expect(wrapper.find('.details > div').exists()).toBeFalsy();
  });
});
