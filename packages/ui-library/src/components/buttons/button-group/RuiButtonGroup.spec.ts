import { type ComponentMountingOptions, mount } from '@vue/test-utils';
import { describe, expect, it, vi } from 'vitest';
import { h } from 'vue';
import RuiButtonGroup from '@/components/buttons/button-group/RuiButtonGroup.vue';
import RuiButton from '@/components/buttons/button/RuiButton.vue';
import RuiMenu from '@/components/overlays/menu/RuiMenu.vue';
import {
  assertExists,
  expectNotToHaveClass,
  expectToHaveClass,
  expectWrapperToHaveClass,
} from '~/tests/helpers/dom-helpers';

function createWrapper(
  options?: ComponentMountingOptions<typeof RuiButtonGroup>,
) {
  return mount(RuiButtonGroup, {
    slots: {
      default: () => [0, 1, 2].map(value => h(RuiButton, { modelValue: value }, () => `Button ${value}`)),
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
    expectNotToHaveClass(wrapper.element, /flex-col/);
    await wrapper.setProps({ vertical: true });
    expectToHaveClass(wrapper.element, /flex-col/);
  });

  it('should color the buttons and keep the filled group dividers neutral', async () => {
    wrapper = createWrapper({
      props: {
        color: 'primary',
      },
    });
    expectToHaveClass(wrapper.element, /^between:border-rui-divider$/);
    expectWrapperToHaveClass(wrapper, 'button', /bg-rui-primary/);

    await wrapper.setProps({ color: 'secondary' });
    expectToHaveClass(wrapper.element, /^between:border-rui-divider$/);
    expectWrapperToHaveClass(wrapper, 'button', /bg-rui-secondary/);

    await wrapper.setProps({ color: 'error' });
    expectToHaveClass(wrapper.element, /^between:border-rui-divider$/);
    expectWrapperToHaveClass(wrapper, 'button', /bg-rui-error/);

    await wrapper.setProps({ color: 'success' });
    expectToHaveClass(wrapper.element, /^between:border-rui-divider$/);
    expectWrapperToHaveClass(wrapper, 'button', /bg-rui-success/);
  });

  it('should pass variant props', async () => {
    wrapper = createWrapper();
    expectNotToHaveClass(wrapper.element, /outline-rui-outline/);
    await wrapper.setProps({ variant: 'outlined' });
    expectToHaveClass(wrapper.element, /outline-rui-outline/);
    expectToHaveClass(wrapper.element, /between:border-rui-outline/);
    expectWrapperToHaveClass(wrapper, 'button', /inset-ring-rui-outline/);
    await wrapper.setProps({ variant: 'text' });
    expectNotToHaveClass(wrapper.element, /outline-rui-outline/);
    expectWrapperToHaveClass(wrapper, 'button', /bg-transparent/);
  });

  it('should pass size props', async () => {
    wrapper = createWrapper();

    // size is passed through to child RuiButton
    await wrapper.setProps({ size: 'sm' });
    expectWrapperToHaveClass(wrapper, 'button', /py-1/);
    await wrapper.setProps({ size: 'lg' });
    expect(wrapper.find('button').classes()).toContain('text-[1rem]');
    // xl now targets the 40px input-row height (py-2 + leading-6 = 40).
    await wrapper.setProps({ size: 'xl' });
    expectWrapperToHaveClass(wrapper, 'button', /py-2(?!\.5)/);
    expectWrapperToHaveClass(wrapper, 'button', /leading-6/);
    // 2xl keeps the previous xl geometry at 44px.
    await wrapper.setProps({ size: '2xl' });
    expectWrapperToHaveClass(wrapper, 'button', /py-2\.5/);
    expectWrapperToHaveClass(wrapper, 'button', /leading-6/);
  });

  it('should let a child that sets its own size keep it, without changing its siblings', () => {
    const wrapperWithOverride = mount(RuiButtonGroup, {
      props: { size: 'lg' },
      slots: {
        default: [
          h(RuiButton, { size: 'sm' }, () => 'sm'),
          h(RuiButton, () => 'default'),
        ],
      },
    });
    const buttons = wrapperWithOverride.findAll('button');
    // First button keeps sm
    expect(buttons[0]!.classes()).toContain('py-1');
    // Second button inherits group size lg
    expect(buttons[1]!.classes()).toContain('text-[1rem]');
    wrapperWithOverride.unmount();
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
    expect(button0.element.getAttribute('data-active')).toBe('true');
    expect(button1.element.getAttribute('data-active')).toBeNull();
    expect(button2.element.getAttribute('data-active')).toBeNull();

    // on click, second button should take active state
    await button1.trigger('click');
    expect(wrapper.props('modelValue')).toBe(1);

    expect(button0.element.getAttribute('data-active')).toBeNull();
    expect(button1.element.getAttribute('data-active')).toBe('true');
    expect(button2.element.getAttribute('data-active')).toBeNull();

    // on click, third button should take active state
    await button2.trigger('click');
    expect(wrapper.props('modelValue')).toBe(2);
    const clickEvent = wrapper.emitted('click');
    expect(clickEvent).toHaveLength(2);

    expect(button0.element.getAttribute('data-active')).toBeNull();
    expect(button1.element.getAttribute('data-active')).toBeNull();
    expect(button2.element.getAttribute('data-active')).toBe('true');

    // on click, active button should lose state
    await button2.trigger('click');
    expect(button0.element.getAttribute('data-active')).toBeNull();
    expect(button1.element.getAttribute('data-active')).toBeNull();
    expect(button2.element.getAttribute('data-active')).toBeNull();
    expect(wrapper.props('modelValue')).toBeUndefined();

    // set as required
    await wrapper.setProps({ required: true });
    await button2.trigger('click');
    expect(button0.element.getAttribute('data-active')).toBeNull();
    expect(button1.element.getAttribute('data-active')).toBeNull();
    expect(button2.element.getAttribute('data-active')).toBe('true');
    expect(wrapper.props('modelValue')).toBe(2);

    // required so, can't deselect the active item
    await button2.trigger('click');
    expect(button2.element.getAttribute('data-active')).toBe('true');
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

    expect(button0.element.getAttribute('data-active')).toBe('true');
    expect(button1.element.getAttribute('data-active')).toBeNull();
    expect(button2.element.getAttribute('data-active')).toBeNull();

    // on click, second button should also be active
    await button1.trigger('click');
    expect(wrapper.props('modelValue')).toEqual([0, 1]);

    expect(button0.element.getAttribute('data-active')).toBe('true');
    expect(button1.element.getAttribute('data-active')).toBe('true');
    expect(button2.element.getAttribute('data-active')).toBeNull();

    // on click, third button should also be active
    await button2.trigger('click');
    expect(wrapper.props('modelValue')).toEqual([0, 1, 2]);
    const clickEvent = wrapper.emitted('click');
    expect(clickEvent).toHaveLength(2);

    expect(button0.element.getAttribute('data-active')).toBe('true');
    expect(button1.element.getAttribute('data-active')).toBe('true');
    expect(button2.element.getAttribute('data-active')).toBe('true');

    await button0.trigger('click');
    await button1.trigger('click');
    await button2.trigger('click');

    expect(button0.element.getAttribute('data-active')).toBeNull();
    expect(button1.element.getAttribute('data-active')).toBeNull();
    expect(button2.element.getAttribute('data-active')).toBeNull();
    expect(wrapper.props('modelValue')).toEqual([]);

    // set required
    await wrapper.setProps({ required: true });
    await button2.trigger('click');
    expect(button0.element.getAttribute('data-active')).toBeNull();
    expect(button1.element.getAttribute('data-active')).toBeNull();
    expect(button2.element.getAttribute('data-active')).toBe('true');
    expect(wrapper.props('modelValue')).toEqual([2]);

    // required so, can't deselect the active only item
    await button2.trigger('click');
    expect(button2.element.getAttribute('data-active')).toBe('true');
    expect(wrapper.props('modelValue')).toEqual([2]);

    await wrapper.setProps({ gap: 'md' });
    expectToHaveClass(wrapper.element, /gap-4/);

    await wrapper.setProps({ gap: 'sm' });
    expectToHaveClass(wrapper.element, /gap-2/);

    await wrapper.setProps({ gap: 'lg' });
    expectToHaveClass(wrapper.element, /gap-6/);
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

  it('should draw the segmented variant as a neutral track of text buttons', () => {
    wrapper = createWrapper({
      props: {
        color: 'primary',
        modelValue: 1,
        variant: 'segmented',
      },
    });

    expectToHaveClass(wrapper.element, /^bg-rui-neutral-200$/);
    const buttons = wrapper.findAll('button');
    for (const button of buttons) {
      expect(button.attributes('data-variant')).toBe('text');
      // neutral like the segmented tabs, so the group's color does not reach the buttons
      expect(button.attributes('data-color')).toBeUndefined();
    }
    expect(buttons[1]?.attributes('data-active')).toBe('true');
  });

  describe('wrapped buttons', () => {
    function mountWrapped(props: Record<string, unknown> = {}) {
      return mount(RuiButtonGroup, {
        attachTo: document.body,
        props: { color: 'primary', size: 'sm', ...props },
        slots: {
          default: () => [
            h('div', { 'data-id': 'wrapper-a' }, [h(RuiButton, { modelValue: 'a' }, () => 'A')]),
            h(RuiButton, { modelValue: 'b' }, () => 'B'),
            h('div', { 'data-id': 'wrapper-c' }, [h('span', [h(RuiButton, { modelValue: 'c' }, () => 'C')])]),
          ],
        },
      });
    }

    it('should apply the group state to a button at any depth', async () => {
      const group = mountWrapped({ disabled: true });
      for (const button of group.findAll('button')) {
        expect(button.attributes('data-color')).toBe('primary');
        expect(button.attributes('data-size')).toBe('sm');
        expect(button.attributes('disabled')).toBeDefined();
        expect(button.classes()).toContain('border-0');
      }
      group.unmount();
    });

    it('should toggle the model from a nested button', async () => {
      const group = mountWrapped({
        'modelValue': 'a',
        'onUpdate:modelValue': async (value: unknown) => group.setProps({ modelValue: value }),
      });
      const nested = group.find('[data-id=wrapper-c] button');
      expect(group.find('[data-id=wrapper-a] button').attributes('data-active')).toBe('true');

      await nested.trigger('click');
      expect(group.props('modelValue')).toBe('c');
      expect(nested.attributes('data-active')).toBe('true');
      expect(group.find('[data-id=wrapper-a] button').attributes('data-active')).toBeUndefined();
      group.unmount();
    });
  });

  it('should leave a button without a value out of the selection', async () => {
    const onUpdate = vi.fn();
    wrapper = mount(RuiButtonGroup, {
      props: { 'modelValue': undefined, 'onUpdate:modelValue': onUpdate },
      slots: { default: () => [h(RuiButton, () => 'No value')] },
    });

    await wrapper.find('button').trigger('click');
    expect(onUpdate).not.toHaveBeenCalled();
    expect(wrapper.find('button').attributes('data-active')).toBeUndefined();
  });

  it('should not reach the buttons inside an overlay\'s content', async () => {
    vi.useFakeTimers();
    wrapper = mount(RuiButtonGroup, {
      attachTo: document.body,
      props: { color: 'primary' },
      slots: {
        default: () => [
          h(RuiButton, { modelValue: 'run' }, () => 'Run'),
          h(RuiMenu, null, {
            activator: ({ attrs }: { attrs: Record<string, unknown> }) => h(RuiButton, { ...attrs, 'data-id': 'menu-activator' }, () => 'More'),
            default: () => h(RuiButton, { 'data-id': 'menu-item' }, () => 'Option'),
          }),
        ],
      },
    });

    const activator = wrapper.find('[data-id=menu-activator]');
    await activator.trigger('click');
    await vi.runAllTimersAsync();

    expect(activator.attributes('data-color')).toBe('primary');
    const item = document.body.querySelector('[data-id=menu-item]');
    assertExists(item);
    expect(item.getAttribute('data-color')).toBeNull();
    expect(item.classList.contains('border-0')).toBe(false);
    vi.useRealTimers();
  });
});
