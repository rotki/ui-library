import { type ComponentMountingOptions, mount } from '@vue/test-utils';
import { describe, expect, it, vi } from 'vitest';
import RuiButtonGroup from '@/components/buttons/button-group/RuiButtonGroup.vue';
import RuiButton from '@/components/buttons/button/RuiButton.vue';
import {
  assertExists,
  expectNotToHaveClass,
  expectToHaveClass,
  expectWrapperNotToHaveClass,
  expectWrapperToHaveClass,
} from '~/tests/helpers/dom-helpers';

function createWrapper(
  options?: ComponentMountingOptions<typeof RuiButtonGroup>,
) {
  return mount(RuiButtonGroup, {
    slots: {
      default: [RuiButton, RuiButton, RuiButton],
    },
    ...options,
  });
}

describe('components/buttons/button-group/RuiButtonGroup.vue', () => {
  let wrapper: ReturnType<typeof createWrapper>;

  afterEach(() => {
    wrapper?.unmount();
  });

  it('should pass vertical props', async () => {
    wrapper = createWrapper();
    expectNotToHaveClass(wrapper.element, /vertical/);
    await wrapper.setProps({ vertical: true });
    expectToHaveClass(wrapper.element, /vertical/);
  });

  it('should pass color props', async () => {
    wrapper = createWrapper({
      props: {
        color: 'primary',
      },
    });
    expectToHaveClass(wrapper.element, /_primary_/);
    expectWrapperToHaveClass(wrapper, 'button', /_primary_/);

    await wrapper.setProps({ color: 'secondary' });
    expectToHaveClass(wrapper.element, /_secondary_/);
    expectWrapperToHaveClass(wrapper, 'button', /_secondary_/);

    await wrapper.setProps({ color: 'error' });
    expectToHaveClass(wrapper.element, /_error_/);
    expectWrapperToHaveClass(wrapper, 'button', /_error_/);

    await wrapper.setProps({ color: 'success' });
    expectToHaveClass(wrapper.element, /_success_/);
    expectWrapperToHaveClass(wrapper, 'button', /_success_/);
  });

  it('should pass variant props', async () => {
    wrapper = createWrapper();
    expectNotToHaveClass(wrapper.element, /_outlined_/);
    await wrapper.setProps({ variant: 'outlined' });
    expectToHaveClass(wrapper.element, /_outlined_/);
    expectWrapperToHaveClass(wrapper, 'button', /_outlined_/);
    await wrapper.setProps({ variant: 'text' });
    expectToHaveClass(wrapper.element, /_text_/);
    expectWrapperToHaveClass(wrapper, 'button', /_text_/);
  });

  it('should pass size props', async () => {
    wrapper = createWrapper();

    expectWrapperNotToHaveClass(wrapper, 'button', /_sm_/);
    expectWrapperNotToHaveClass(wrapper, 'button', /_lg_/);
    await wrapper.setProps({ size: 'sm' });
    expectWrapperToHaveClass(wrapper, 'button', /_sm_/);
    await wrapper.setProps({ size: 'lg' });
    expectWrapperToHaveClass(wrapper, 'button', /_lg_/);
  });

  it('should toggleable button group', async () => {
    wrapper = createWrapper({
      props: {
        'modelValue': 0,
        'onUpdate:modelValue': (e: any) => wrapper.setProps({ modelValue: e }),
      },
    });

    const buttons = wrapper.findAll('button');
    const button0 = buttons[0];
    const button1 = buttons[1];
    const button2 = buttons[2];
    assertExists(button0);
    assertExists(button1);
    assertExists(button2);

    // only first button active
    expectToHaveClass(button0.element, /_active_/);
    expectNotToHaveClass(button1.element, /_active_/);
    expectNotToHaveClass(button2.element, /_active_/);

    // on click, second button should take active state
    await button1.trigger('click');
    expect(wrapper.props('modelValue')).toBe(1);

    expectNotToHaveClass(button0.element, /_active_/);
    expectToHaveClass(button1.element, /_active_/);
    expectNotToHaveClass(button2.element, /_active_/);

    // on click, third button should take active state
    await button2.trigger('click');
    expect(wrapper.props('modelValue')).toBe(2);
    const clickEvent = wrapper.emitted('click');
    expect(clickEvent).toHaveLength(2);

    expectNotToHaveClass(button0.element, /_active_/);
    expectNotToHaveClass(button1.element, /_active_/);
    expectToHaveClass(button2.element, /_active_/);

    // on click, active button should lose state
    await button2.trigger('click');
    expectNotToHaveClass(button0.element, /_active_/);
    expectNotToHaveClass(button1.element, /_active_/);
    expectNotToHaveClass(button2.element, /_active_/);
    expect(wrapper.props('modelValue')).toBeUndefined();

    // set as required
    await wrapper.setProps({ required: true });
    await button2.trigger('click');
    expectNotToHaveClass(button0.element, /_active_/);
    expectNotToHaveClass(button1.element, /_active_/);
    expectToHaveClass(button2.element, /_active_/);
    expect(wrapper.props('modelValue')).toBe(2);

    // required so, can't deselect the active item
    await button2.trigger('click');
    expectToHaveClass(button2.element, /_active_/);
    expect(wrapper.props('modelValue')).toBe(2);
  });

  it('should multiple toggleable button group', async () => {
    wrapper = createWrapper({
      props: {
        'modelValue': [0],
        'onUpdate:modelValue': (e: any) => wrapper.setProps({ modelValue: e }),
      },
    });

    const buttons = wrapper.findAll('button');
    const button0 = buttons[0];
    const button1 = buttons[1];
    const button2 = buttons[2];
    assertExists(button0);
    assertExists(button1);
    assertExists(button2);

    expectToHaveClass(button0.element, /_active_/);
    expectNotToHaveClass(button1.element, /_active_/);
    expectNotToHaveClass(button2.element, /_active_/);

    // on click, second button should also be active
    await button1.trigger('click');
    expect(wrapper.props('modelValue')).toEqual([0, 1]);

    expectToHaveClass(button0.element, /_active_/);
    expectToHaveClass(button1.element, /_active_/);
    expectNotToHaveClass(button2.element, /_active_/);

    // on click, third button should also be active
    await button2.trigger('click');
    expect(wrapper.props('modelValue')).toEqual([0, 1, 2]);
    const clickEvent = wrapper.emitted('click');
    expect(clickEvent).toHaveLength(2);

    expectToHaveClass(button0.element, /_active_/);
    expectToHaveClass(button1.element, /_active_/);
    expectToHaveClass(button2.element, /_active_/);

    await button0.trigger('click');
    await button1.trigger('click');
    await button2.trigger('click');

    expectNotToHaveClass(button0.element, /_active_/);
    expectNotToHaveClass(button1.element, /_active_/);
    expectNotToHaveClass(button2.element, /_active_/);
    expect(wrapper.props('modelValue')).toEqual([]);

    // set required
    await wrapper.setProps({ required: true });
    await button2.trigger('click');
    expectNotToHaveClass(button0.element, /_active_/);
    expectNotToHaveClass(button1.element, /_active_/);
    expectToHaveClass(button2.element, /_active_/);
    expect(wrapper.props('modelValue')).toEqual([2]);

    // required so, can't deselect the active only item
    await button2.trigger('click');
    expectToHaveClass(button2.element, /_active_/);
    expect(wrapper.props('modelValue')).toEqual([2]);

    await wrapper.setProps({ gap: 'md' });
    expectToHaveClass(wrapper.element, /_separated_/);
    expectToHaveClass(wrapper.element, /_separated__md/);

    await wrapper.setProps({ gap: 'sm' });
    expectToHaveClass(wrapper.element, /_separated_/);
    expectToHaveClass(wrapper.element, /_separated__sm/);

    await wrapper.setProps({ gap: 'lg' });
    expectToHaveClass(wrapper.element, /_separated_/);
    expectToHaveClass(wrapper.element, /_separated__lg/);
  });

  it('should handle disabled button group', async () => {
    const modelValue = ref([0]);
    const updateModelValue = vi.fn((value: number[]) => set(modelValue, value));
    wrapper = createWrapper({
      data() {
        return { selected: get(modelValue) };
      },
      props: {
        'onUpdate:modelValue': (e: any) => updateModelValue(e),
      },
    });

    const buttons = wrapper.findAll('button');
    const button0 = buttons[0];
    const button1 = buttons[1];
    const button2 = buttons[2];
    assertExists(button0);
    assertExists(button1);
    assertExists(button2);

    expect(button0.attributes('disabled')).toBeUndefined();
    expect(button1.attributes('disabled')).toBeUndefined();
    expect(button2.attributes('disabled')).toBeUndefined();

    await wrapper.setProps({ disabled: true });

    expect(button0.attributes('disabled')).toBeDefined();
    expect(button1.attributes('disabled')).toBeDefined();
    expect(button2.attributes('disabled')).toBeDefined();
  });
});
