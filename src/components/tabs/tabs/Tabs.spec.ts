import {
  type ComponentMountingOptions,
  RouterLinkStub,
  mount,
} from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import Tabs from '@/components/tabs/tabs/Tabs.vue';
import Tab from '@/components/tabs/tab/Tab.vue';

const createWrapper = (options?: ComponentMountingOptions<typeof Tabs>) =>
  mount(Tabs, {
    ...options,
    global: {
      stubs: {
        RouterLink: RouterLinkStub,
      },
    },
    slots: {
      default: [
        h(Tab, [h('div', 'Tab 1')]),
        h(Tab, [h('div', 'Tab 2')]),
        h(Tab, [h('div', 'Tab 3')]),
        h(Tab, [h('div', 'Tab 4')]),
      ],
    },
  });

describe('Tabs/Tabs', () => {
  it('renders properly', async () => {
    const modelValue = ref();
    const wrapper = createWrapper({
      props: {
        modelValue,
        'onUpdate:modelValue': (e: any) => set(modelValue, e),
      },
    });

    await nextTick();

    const buttons = wrapper.findAll('div[class*=_tabs-wrapper] > button');

    expect(buttons).toHaveLength(4);
    expect(buttons[0].classes()).toMatch(/active-tab/);
  });

  it('pass vertical props', async () => {
    const wrapper = createWrapper({});

    expect(wrapper.classes()).not.toMatch(/_tabs--vertical_/);

    await wrapper.setProps({
      vertical: true,
    });
    expect(wrapper.classes()).toMatch(/_tabs--vertical_/);

    expect(
      wrapper.find('div[class*=_tabs-wrapper] > button').classes(),
    ).toMatch(/_tab--vertical_/);
  });

  it('pass grow props', async () => {
    const wrapper = createWrapper({});

    expect(wrapper.find('div[class*=tabs-bar]').classes()).not.toMatch(
      /_tabs-bar--grow/,
    );

    await wrapper.setProps({
      grow: true,
    });
    expect(wrapper.find('div[class*=tabs-bar]').classes()).toMatch(
      /_tabs-bar--grow/,
    );

    expect(
      wrapper.find('div[class*=_tabs-wrapper] > button').classes(),
    ).toMatch(/_tab--grow/);
  });

  it('pass disabled props', async () => {
    const wrapper = createWrapper({});

    expect(wrapper.find('button').attributes('disabled')).toBeUndefined();

    await wrapper.setProps({
      disabled: true,
    });

    expect(wrapper.find('button').attributes('disabled')).toBeDefined();
  });

  it('pass align props', async () => {
    const wrapper = createWrapper({});

    expect(wrapper.find('button').classes()).toMatch(/_tab--center_/);

    await wrapper.setProps({ align: 'start' });
    expect(wrapper.find('button').classes()).toMatch(/_tab--start_/);

    await wrapper.setProps({ align: 'end' });
    expect(wrapper.find('button').classes()).toMatch(/_tab--end_/);
  });

  it('click tab change the modelValue', async () => {
    const modelValue = ref();
    const wrapper = createWrapper({
      props: {
        modelValue,
        'onUpdate:modelValue': (e: any) => set(modelValue, e),
      },
    });

    await nextTick();
    let buttons = wrapper.findAll('div[class*=_tabs-wrapper] > button');

    expect(buttons).toHaveLength(4);
    expect(buttons[0].classes()).toMatch(/active-tab/);

    await buttons[1].trigger('click');
    await nextTick();
    expect(get(modelValue)).toBe(1);

    buttons = wrapper.findAll('div[class*=_tabs-wrapper] > button');
    await buttons[2].trigger('click');
    await nextTick();
    expect(get(modelValue)).toBe(2);

    buttons = wrapper.findAll('div[class*=_tabs-wrapper] > button');
    await buttons[3].trigger('click');
    await nextTick();
    expect(get(modelValue)).toBe(3);
  });
});
