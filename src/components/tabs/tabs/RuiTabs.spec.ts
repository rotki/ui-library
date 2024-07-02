import {
  type ComponentMountingOptions,
  RouterLinkStub,
  mount,
} from '@vue/test-utils';
import { describe, expect, it, vi } from 'vitest';
import RuiTabs from '@/components/tabs/tabs/RuiTabs.vue';
import RuiTab from '@/components/tabs/tab/RuiTab.vue';

vi.mock('vue-router', () => ({
  useRoute: vi.fn().mockImplementation(() => ref()),
}));

function createWrapper(options: ComponentMountingOptions<typeof RuiTabs> = {}, customTabValue: boolean = false) {
  return mount(RuiTabs, {
    ...options,
    global: {
      stubs: {
        RouterLink: RouterLinkStub,
        RuiTab,
      },
    },
    slots: {
      default: [...new Array(4).keys()].map(item => (
        { template: customTabValue
          ? `<RuiTab value="tab-${item}"><div>Tab ${item}</div></RuiTab>`
          : `<RuiTab><div>Tab ${item}</div></RuiTab>` })),
    },
  });
}

describe('tabs/Tabs', () => {
  it('renders properly', async () => {
    const wrapper = createWrapper();

    await nextTick();

    const buttons = wrapper.findAll('div[class*=_tabs-wrapper] > button');

    expect(buttons).toHaveLength(4);
    expect(buttons[0].classes()).toEqual(
      expect.arrayContaining([expect.stringMatching(/active-tab/)]),
    );
  });

  it('pass vertical props', async () => {
    const wrapper = createWrapper();

    expect(wrapper.classes()).not.toEqual(
      expect.arrayContaining([expect.stringMatching(/_tabs--vertical_/)]),
    );

    await wrapper.setProps({
      vertical: true,
    });
    await nextTick();
    expect(wrapper.classes()).toEqual(
      expect.arrayContaining([expect.stringMatching(/_tabs--vertical_/)]),
    );

    expect(
      wrapper.find('div[class*=_tabs-wrapper] > button').classes(),
    ).toEqual(
      expect.arrayContaining([expect.stringMatching(/_tab--vertical_/)]),
    );
  });

  it('pass grow props', async () => {
    const wrapper = createWrapper();

    expect(wrapper.find('div[class*=tabs-bar]').classes()).not.toEqual(
      expect.arrayContaining([expect.stringMatching(/_tabs-bar--grow/)]),
    );

    await wrapper.setProps({
      grow: true,
    });
    expect(wrapper.find('div[class*=tabs-bar]').classes()).toEqual(
      expect.arrayContaining([expect.stringMatching(/_tabs-bar--grow/)]),
    );

    expect(
      wrapper.find('div[class*=_tabs-wrapper] > button').classes(),
    ).toEqual(
      expect.arrayContaining([expect.stringMatching(/_tab--grow/)]),
    );
  });

  it('pass disabled props', async () => {
    const wrapper = createWrapper();

    expect(wrapper.find('button').attributes('disabled')).toBeUndefined();

    await wrapper.setProps({
      disabled: true,
    });

    expect(wrapper.find('button').attributes('disabled')).toBeDefined();
  });

  it('pass align props', async () => {
    const wrapper = createWrapper();

    expect(wrapper.find('button').classes()).toEqual(
      expect.arrayContaining([expect.stringMatching(/_tab--center_/)]),
    );

    await wrapper.setProps({ align: 'start' });
    expect(wrapper.find('button').classes()).toEqual(
      expect.arrayContaining([expect.stringMatching(/_tab--start_/)]),
    );

    await wrapper.setProps({ align: 'end' });
    expect(wrapper.find('button').classes()).toEqual(
      expect.arrayContaining([expect.stringMatching(/_tab--end_/)]),
    );
  });

  it('click tab change the modelValue', async () => {
    const modelValue = ref();
    const wrapper = createWrapper({
      props: {
        'modelValue': get(modelValue),
        'onUpdate:modelValue': (e: any) => set(modelValue, e),
      },
    });

    await nextTick();
    let buttons = wrapper.findAll('div[class*=_tabs-wrapper] > button');

    expect(buttons).toHaveLength(4);
    expect(buttons[0].classes()).toEqual(
      expect.arrayContaining([expect.stringMatching(/active-tab/)]),
    );

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

  it ('works with custom tab value', async () => {
    const wrapper = createWrapper({}, true);

    await nextTick();

    const buttons = wrapper.findAll('div[class*=_tabs-wrapper] > button');

    expect(buttons).toHaveLength(4);
    expect(buttons[0].classes()).toEqual(
      expect.arrayContaining([expect.stringMatching(/active-tab/)]),
    );
  });
});
