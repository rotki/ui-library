import { type ComponentMountingOptions, mount } from '@vue/test-utils';
import { afterEach, describe, expect, it } from 'vitest';
import RuiCheckboxGroup from '@/components/forms/checkbox/checkbox-group/RuiCheckboxGroup.vue';
import RuiCheckbox from '@/components/forms/checkbox/RuiCheckbox.vue';

function createWrapper(
  options?: ComponentMountingOptions<typeof RuiCheckboxGroup>,
) {
  const opts: ComponentMountingOptions<typeof RuiCheckboxGroup> = {
    ...options,
    global: {
      stubs: ['rui-icon'],
    },
  };

  return mount(RuiCheckboxGroup, opts);
}

describe('components/forms/checkbox/checkbox-group/RuiCheckboxGroup.vue', () => {
  let wrapper: ReturnType<typeof createWrapper>;

  afterEach(() => {
    wrapper?.unmount();
  });

  it('should have role="group" on wrapper', () => {
    wrapper = createWrapper();
    expect(wrapper.attributes('role')).toBe('group');
  });

  it('should pass inline props', async () => {
    wrapper = createWrapper();
    const groupWrapper = wrapper.findAll('div[role=group] > div')[0];
    expect(groupWrapper?.classes()).not.toContain('flex');

    await wrapper.setProps({ inline: true });
    const updatedWrapper = wrapper.findAll('div[role=group] > div')[0];
    expect(updatedWrapper?.classes()).toContain('flex');
    expect(updatedWrapper?.classes()).toContain('space-x-6');
  });

  it('should pass hint props', async () => {
    wrapper = createWrapper();
    expect(wrapper.find('.details > div').exists()).toBeFalsy();

    const hint = 'CheckboxGroup Hints';
    await wrapper.setProps({ hint });
    const hintEl = wrapper.find('.details > div');
    expect(hintEl.classes()).toEqual(expect.arrayContaining([expect.stringContaining('text-rui-text-secondary')]));
    expect(hintEl.text()).toBe(hint);
  });

  it('should pass errorMessages', async () => {
    wrapper = createWrapper();
    expect(wrapper.find('.details > div').exists()).toBeFalsy();

    const errorMessage = 'CheckboxGroup Error Message';
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
    const label = 'CheckboxGroup Label';
    wrapper = createWrapper({
      props: {
        label,
      },
    });

    expect(wrapper.text()).not.toContain('﹡');

    await wrapper.setProps({ required: true });
    expect(wrapper.text()).toContain('﹡');
    expect(wrapper.find('.text-rui-error').exists()).toBeTruthy();

    await wrapper.setProps({ required: false });
    expect(wrapper.text()).not.toContain('﹡');
  });

  it('should toggle values into the model array', async () => {
    const Parent = defineComponent({
      components: { RuiCheckbox, RuiCheckboxGroup },
      data: () => ({ value: [] as string[] }),
      template: `
        <RuiCheckboxGroup v-model="value">
          <RuiCheckbox value="a" label="A" />
          <RuiCheckbox value="b" label="B" />
        </RuiCheckboxGroup>
      `,
    });
    const parent = mount(Parent, { global: { stubs: ['rui-icon'] } });

    const inputs = parent.findAll('input[type=checkbox]');
    expect(inputs).toHaveLength(2);

    await inputs[0]!.setValue(true);
    expect(parent.vm.value).toEqual(['a']);

    await inputs[1]!.setValue(true);
    expect(parent.vm.value).toEqual(['a', 'b']);

    await inputs[0]!.setValue(false);
    expect(parent.vm.value).toEqual(['b']);

    parent.unmount();
  });

  it('should propagate disabled to children', () => {
    const Parent = defineComponent({
      components: { RuiCheckbox, RuiCheckboxGroup },
      data: () => ({ value: [] as string[] }),
      template: `
        <RuiCheckboxGroup v-model="value" disabled>
          <RuiCheckbox value="a" label="A" />
          <RuiCheckbox value="b" label="B" />
        </RuiCheckboxGroup>
      `,
    });
    const parent = mount(Parent, { global: { stubs: ['rui-icon'] } });

    const inputs = parent.findAll('input[type=checkbox]');
    inputs.forEach((input) => {
      expect(input.attributes('disabled')).toBeDefined();
    });

    parent.unmount();
  });
});
